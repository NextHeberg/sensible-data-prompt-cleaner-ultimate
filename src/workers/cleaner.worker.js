/**
 * Web Worker: Sensitive data detection and replacement engine.
 * All regex processing runs here, off the main thread.
 *
 * Message protocol:
 *   IN:  { type: 'process', text, enabledPatternIds, replacementStyle, excludedValues, requestId }
 *   OUT: { type: 'result', cleaned, detections, requestId }
 *        { type: 'progress', percent, requestId }
 *        { type: 'error', message, requestId }
 *
 * The worker imports PATTERNS directly — the main thread only sends serializable IDs.
 * This avoids DataCloneError (RegExp and functions cannot be cloned via postMessage).
 */
import { PATTERNS } from '../patterns/index.js';

// Fake data generators for 'anon' replacement style
const ANON_GENERATORS = {
  EMAIL: (n) => `user${n}@example.com`,
  PHONE: () => '+33 6 00 00 00 00',
  IP: () => '10.0.0.1',
  IPV6: () => '::1',
  IBAN: () => 'FR7630006000011234567890189',
  RIB: () => '30006 00001 12345678901 89',
  CARD: () => '4000 0000 0000 0000',
  SECRET: (n) => `secret_value_${n}`,
  JWT: () => 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1c2VyIn0.xxx',
  AWS_KEY: () => 'AKIAIOSFODNN7EXAMPLE',
  GH_TOKEN: () => 'ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
  PRIVATE_KEY: () => '-----BEGIN PRIVATE KEY-----\n[REDACTED]\n-----END PRIVATE KEY-----',
  BEARER: () => 'token_example',
  ADRESSE: (n) => `${n} rue de l'Exemple`,
  CP: () => '75001',
  CP_VILLE: () => '75001 Paris',
  INSEE: () => '1 85 12 75 001 001 42',
  NOM: () => 'John Doe',
  URL_CREDS: () => 'https://user:***@host',
  DB_URL: () => 'postgresql://user:***@localhost/db',
  SWIFT: () => 'BNPAFRPPXXX',
  CRYPTO: () => '0x0000000000000000000000000000000000000000',
  MAC: () => '00:00:00:00:00:00',
  DEFAULT: (n) => `VALUE_${n}`,
};

function getAnonValue(placeholder, counter) {
  const gen = ANON_GENERATORS[placeholder] || ANON_GENERATORS.DEFAULT;
  return gen(counter);
}

/**
 * Build the replacement string for a matched value.
 */
function buildReplacement(placeholder, counter, style, originalMatch) {
  switch (style) {
    case 'labeled':
      return `[${placeholder}_${counter}]`;
    case 'redact': {
      const len = Math.min(originalMatch.length, 12);
      return '█'.repeat(len);
    }
    case 'anon':
      return getAnonValue(placeholder, counter);
    default:
      return `[${placeholder}_${counter}]`;
  }
}

// ────────────────────────────────────────────────────────────
// Multi-pass detection engine (3 phases)
// Phase 1: Collect all matches from original text (no mutation)
// Phase 2: Resolve overlapping matches by priority
// Phase 3: Build output string with replacements
// ────────────────────────────────────────────────────────────

/**
 * Phase 1: Collect all regex matches against the original text.
 * Returns an array of match descriptors without modifying the text.
 */
function collectMatches(text, enabledPatternsList) {
  const matches = [];

  for (const pattern of enabledPatternsList) {
    // Clone regex to reset lastIndex
    const regex = new RegExp(
      pattern.regex.source,
      pattern.regex.flags.includes('g') ? pattern.regex.flags : pattern.regex.flags + 'g'
    );

    let m;
    while ((m = regex.exec(text)) !== null) {
      const fullMatch = m[0];
      const fullMatchStart = m.index;
      const fullMatchEnd = fullMatchStart + fullMatch.length;

      // Determine the sensitive value and its position
      let sensitiveValue = fullMatch;
      let start = fullMatchStart;
      let end = fullMatchEnd;

      if (pattern.replaceGroup && m[pattern.replaceGroup]) {
        sensitiveValue = m[pattern.replaceGroup];
        // Locate the captured group within the full match
        const groupOffset = fullMatch.indexOf(sensitiveValue);
        if (groupOffset !== -1) {
          start = fullMatchStart + groupOffset;
          end = start + sensitiveValue.length;
        }
      }

      // Run custom validator on the full match
      if (pattern.validate && !pattern.validate(fullMatch)) {
        continue;
      }

      matches.push({
        patternId: pattern.id,
        placeholder: pattern.placeholder,
        start,
        end,
        sensitiveValue,
        fullMatch,
      });

      // Prevent infinite loop on zero-length matches
      if (fullMatch.length === 0) regex.lastIndex++;
    }
  }

  return matches;
}

/**
 * Phase 2: Resolve overlapping matches.
 * Sort by start position; when overlaps occur, the earlier match wins
 * (pattern priority is already encoded in the enabledPatternsList order:
 * credentials first, then identity, financial, network, addresses).
 */
function resolveOverlaps(matches, enabledPatternsList) {
  if (matches.length === 0) return [];

  // Build priority map: lower index = higher priority
  const priorityMap = {};
  enabledPatternsList.forEach((p, i) => { priorityMap[p.id] = i; });

  // Sort by start ascending, then by higher priority (lower index) first
  matches.sort((a, b) => {
    if (a.start !== b.start) return a.start - b.start;
    const pa = priorityMap[a.patternId] ?? 999;
    const pb = priorityMap[b.patternId] ?? 999;
    return pa - pb;
  });

  const resolved = [];
  let lastEnd = -1;

  for (const match of matches) {
    if (match.start >= lastEnd) {
      resolved.push(match);
      lastEnd = match.end;
    }
    // Overlapping match is silently dropped (earlier/higher-priority wins)
  }

  return resolved;
}

/**
 * Phase 3: Build the output string by walking through the original text
 * and inserting replacements at the resolved match positions.
 */
function buildOutput(text, resolvedMatches, replacementStyle, excludedValues, detections, counters) {
  const parts = [];
  let cursor = 0;

  for (const match of resolvedMatches) {
    // Skip if user excluded this value
    if (excludedValues.has(match.sensitiveValue) || excludedValues.has(match.fullMatch)) {
      continue;
    }

    const placeholder = match.placeholder;
    if (!counters[placeholder]) counters[placeholder] = 0;

    // Reuse same replacement if we've seen this exact value before
    let replacement;
    if (detections[match.patternId].values[match.sensitiveValue] !== undefined) {
      replacement = detections[match.patternId].values[match.sensitiveValue];
    } else {
      counters[placeholder]++;
      replacement = buildReplacement(placeholder, counters[placeholder], replacementStyle, match.sensitiveValue);
      detections[match.patternId].values[match.sensitiveValue] = replacement;
      detections[match.patternId].count++;
    }

    // Copy text before this match
    if (match.start > cursor) {
      parts.push(text.slice(cursor, match.start));
    }

    parts.push(replacement);
    cursor = match.end;
  }

  // Append remaining text
  if (cursor < text.length) {
    parts.push(text.slice(cursor));
  }

  return parts.join('');
}

/**
 * Main processing function (3-phase engine).
 * Returns { cleaned, detections }.
 */
function processText(text, enabledPatternsList, replacementStyle, excludedValues) {
  if (!text || text.length === 0) {
    return { cleaned: '', detections: {} };
  }

  const detections = {};
  const counters = {};

  // Initialize detection entries for all enabled patterns
  for (const pattern of enabledPatternsList) {
    detections[pattern.id] = {
      label: pattern.label,
      category: pattern.category,
      risk: pattern.risk,
      confidence: pattern.confidence || 'confirmed',
      count: 0,
      values: {},
    };
  }

  // Phase 1: Collect all matches from the original text
  const allMatches = collectMatches(text, enabledPatternsList);

  // Phase 2: Resolve overlapping matches
  const resolved = resolveOverlaps(allMatches, enabledPatternsList);

  // Phase 3: Build the output with replacements
  const cleaned = buildOutput(text, resolved, replacementStyle, excludedValues, detections, counters);

  return { cleaned, detections };
}

/**
 * Process large text in chunks to avoid blocking.
 * Multiline patterns (e.g. PEM keys) run against the full text to avoid
 * chunk-boundary misses; single-line patterns are processed per chunk.
 */
function processInChunks(text, enabledPatterns, replacementStyle, excludedValues, requestId) {
  const CHUNK_SIZE = 50000;

  if (text.length <= CHUNK_SIZE) {
    return processText(text, enabledPatterns, replacementStyle, excludedValues);
  }

  // Separate multiline patterns from single-line ones
  const multilinePatterns = enabledPatterns.filter((p) => p.multiline === true);
  const singleLinePatterns = enabledPatterns.filter((p) => p.multiline !== true);

  // Split text into line-aligned chunks, tracking their start offsets
  const lines = text.split('\n');
  const chunks = [];
  const chunkOffsets = [];
  let currentChunk = '';
  let currentOffset = 0;

  for (const line of lines) {
    if ((currentChunk + line).length > CHUNK_SIZE && currentChunk.length > 0) {
      chunks.push(currentChunk);
      chunkOffsets.push(currentOffset);
      currentOffset += currentChunk.length;
      currentChunk = line + '\n';
    } else {
      currentChunk += line + '\n';
    }
  }
  if (currentChunk) {
    chunks.push(currentChunk);
    chunkOffsets.push(currentOffset);
  }

  // Collect matches from multiline patterns against the FULL text
  const multilineMatches = collectMatches(text, multilinePatterns);

  // Collect matches from single-line patterns chunk by chunk
  const chunkMatches = [];
  for (let i = 0; i < chunks.length; i++) {
    self.postMessage({
      type: 'progress',
      percent: Math.round((i / chunks.length) * 100),
      requestId,
    });

    const matches = collectMatches(chunks[i], singleLinePatterns);
    // Adjust match positions to absolute offsets within the full text
    for (const m of matches) {
      m.start += chunkOffsets[i];
      m.end += chunkOffsets[i];
    }
    chunkMatches.push(...matches);
  }

  // Combine, resolve overlaps, and build output
  const allMatches = [...multilineMatches, ...chunkMatches];
  const resolved = resolveOverlaps(allMatches, enabledPatterns);

  const detections = {};
  const counters = {};
  for (const pattern of enabledPatterns) {
    detections[pattern.id] = {
      label: pattern.label,
      category: pattern.category,
      risk: pattern.risk,
      confidence: pattern.confidence || 'confirmed',
      count: 0,
      values: {},
    };
  }

  const cleaned = buildOutput(text, resolved, replacementStyle, excludedValues, detections, counters);

  return { cleaned, detections };
}

// Main message handler
self.onmessage = function (event) {
  const { type, text, enabledPatternIds, replacementStyle, excludedValues, requestId } = event.data;

  if (type !== 'process') return;

  try {
    const excludedSet = new Set(excludedValues || []);

    // Filter patterns by the received IDs — RegExp and validate functions are available here
    const enabledList = PATTERNS.filter((p) => (enabledPatternIds || []).includes(p.id));

    const result = processInChunks(
      text || '',
      enabledList,
      replacementStyle || 'labeled',
      excludedSet,
      requestId
    );

    self.postMessage({
      type: 'result',
      cleaned: result.cleaned,
      detections: result.detections,
      requestId,
    });
  } catch (err) {
    self.postMessage({
      type: 'error',
      message: err.message,
      requestId,
    });
  }
};
