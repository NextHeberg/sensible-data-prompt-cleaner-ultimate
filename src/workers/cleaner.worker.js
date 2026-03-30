/**
 * Web Worker: Sensitive data detection and replacement engine.
 * All regex processing runs here, off the main thread.
 *
 * Message protocol:
 *   IN:  { type: 'process', text, enabledPatterns, replacementStyle, excludedValues, requestId }
 *   OUT: { type: 'result', cleaned, detections, requestId }
 *        { type: 'progress', percent, requestId }
 *        { type: 'error', message, requestId }
 */

// Fake data generators for 'anon' replacement style
const ANON_GENERATORS = {
  EMAIL: (n) => `utilisateur${n}@exemple.fr`,
  PHONE: () => '+33 6 00 00 00 00',
  IP: () => '10.0.0.1',
  IPV6: () => '::1',
  IBAN: () => 'FR7630006000011234567890189',
  RIB: () => '30006 00001 12345678901 89',
  CARD: () => '4000 0000 0000 0000',
  EMAIL_KEY: () => '"email"',
  SECRET: (n) => `"secret_${n}"`,
  JWT: () => 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1c2VyIn0.xxx',
  AWS_KEY: () => 'AKIAIOSFODNN7EXAMPLE',
  GH_TOKEN: () => 'ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
  PRIVATE_KEY: () => '-----BEGIN PRIVATE KEY-----\n[REDACTED]\n-----END PRIVATE KEY-----',
  BEARER: () => 'token_example',
  ADRESSE: (n) => `${n} rue de l'Exemple`,
  CP: () => '75001',
  CP_VILLE: () => '75001 Paris',
  INSEE: () => '1 85 12 75 001 001 42',
  NOM: () => 'Jean Dupont',
  URL_CREDS: () => 'https://user:***@host',
  DB_URL: () => 'postgresql://user:***@localhost/db',
  DEFAULT: (n) => `VALEUR_${n}`,
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

/**
 * Main processing function.
 * Returns { cleaned, detections }.
 */
function processText(text, enabledPatternsList, replacementStyle, excludedValues) {
  if (!text || text.length === 0) {
    return { cleaned: '', detections: {} };
  }

  // detections: { patternId: { label, category, risk, count, values: Map<original, replacement> } }
  const detections = {};
  // counters per placeholder for labeling
  const counters = {};

  // We'll do multiple passes — one per pattern to avoid named group conflicts
  // and to support group-based replacement (replaceGroup)
  let result = text;

  for (const pattern of enabledPatternsList) {
    const regex = new RegExp(pattern.regex.source, pattern.regex.flags.includes('g') ? pattern.regex.flags : pattern.regex.flags + 'g');

    if (!detections[pattern.id]) {
      detections[pattern.id] = {
        label: pattern.label,
        category: pattern.category,
        risk: pattern.risk,
        confidence: pattern.confidence || 'confirmed',
        count: 0,
        values: {},  // original -> replacement
      };
    }

    result = result.replace(regex, (...args) => {
      // args: [match, ...groups, offset, string, namedGroups]
      const match = args[0];
      const groups = args.slice(1, -2);  // capture groups

      // Determine the actual sensitive value (might be a capture group)
      const sensitiveValue = pattern.replaceGroup ? groups[pattern.replaceGroup - 1] : match;

      if (!sensitiveValue) return match;

      // Skip if in excluded values
      if (excludedValues.has(sensitiveValue) || excludedValues.has(match)) {
        return match;
      }

      // Apply custom validator (Luhn, IBAN checksum, etc.)
      if (pattern.validate && !pattern.validate(match)) {
        return match;
      }

      const placeholder = pattern.placeholder;
      if (!counters[placeholder]) counters[placeholder] = 0;

      // Check if we've seen this exact value before (reuse same replacement)
      let replacement;
      if (detections[pattern.id].values[sensitiveValue] !== undefined) {
        replacement = detections[pattern.id].values[sensitiveValue];
      } else {
        counters[placeholder]++;
        replacement = buildReplacement(placeholder, counters[placeholder], replacementStyle, sensitiveValue);
        detections[pattern.id].values[sensitiveValue] = replacement;
        detections[pattern.id].count++;
      }

      // If replaceGroup, replace only that group within the full match
      if (pattern.replaceGroup) {
        return match.replace(sensitiveValue, replacement);
      }
      return replacement;
    });
  }

  return { cleaned: result, detections };
}

/**
 * Process large text in chunks to avoid blocking.
 * Posts progress updates between chunks.
 */
function processInChunks(text, enabledPatterns, replacementStyle, excludedValues, requestId) {
  const CHUNK_SIZE = 50000; // characters per chunk

  if (text.length <= CHUNK_SIZE) {
    const result = processText(text, enabledPatterns, replacementStyle, excludedValues);
    return result;
  }

  // Split at line boundaries
  const lines = text.split('\n');
  const chunks = [];
  let currentChunk = '';

  for (const line of lines) {
    if ((currentChunk + line).length > CHUNK_SIZE && currentChunk.length > 0) {
      chunks.push(currentChunk);
      currentChunk = line + '\n';
    } else {
      currentChunk += line + '\n';
    }
  }
  if (currentChunk) chunks.push(currentChunk);

  const allDetections = {};
  const cleanedParts = [];
  // Share counters across chunks for consistent numbering
  const sharedCounters = {};

  for (let i = 0; i < chunks.length; i++) {
    // Post progress
    self.postMessage({
      type: 'progress',
      percent: Math.round(((i) / chunks.length) * 100),
      requestId,
    });

    const chunkResult = processText(chunks[i], enabledPatterns, replacementStyle, excludedValues);
    cleanedParts.push(chunkResult.cleaned);

    // Merge detections
    for (const [patternId, data] of Object.entries(chunkResult.detections)) {
      if (!allDetections[patternId]) {
        allDetections[patternId] = { ...data, values: { ...data.values } };
      } else {
        allDetections[patternId].count += data.count;
        Object.assign(allDetections[patternId].values, data.values);
      }
    }
  }

  return {
    cleaned: cleanedParts.join('').replace(/\n$/, text.endsWith('\n') ? '\n' : ''),
    detections: allDetections,
  };
}

// Main message handler
self.onmessage = function (event) {
  const { type, text, enabledPatterns, replacementStyle, excludedValues, requestId } = event.data;

  if (type !== 'process') return;

  try {
    const excludedSet = new Set(excludedValues || []);

    const result = processInChunks(
      text || '',
      enabledPatterns || [],
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
