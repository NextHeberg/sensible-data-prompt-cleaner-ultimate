/**
 * File type router.
 * Maps file extension/MIME type to the appropriate parser.
 * Returns { text, fileFormat } for the store.
 */
import { parsePlaintext } from './plaintext.js';
import { parseJson, reformatJson } from './jsonParser.js';
import { parseYaml, reformatYaml } from './yamlParser.js';
import { parseCsv } from './csvParser.js';
import { parseEnv } from './envParser.js';
import { parseXml } from './xmlParser.js';

const FORMAT_MAP = {
  // JSON
  'application/json': 'json',
  '.json': 'json',
  // YAML
  'application/x-yaml': 'yaml',
  'text/yaml': 'yaml',
  '.yaml': 'yaml',
  '.yml': 'yaml',
  // CSV
  'text/csv': 'csv',
  'application/csv': 'csv',
  '.csv': 'csv',
  // ENV
  '.env': 'env',
  // XML
  'application/xml': 'xml',
  'text/xml': 'xml',
  '.xml': 'xml',
  // Plain text
  'text/plain': 'plaintext',
  '.txt': 'plaintext',
  '.md': 'plaintext',
  '.log': 'plaintext',
  '.conf': 'plaintext',
  '.ini': 'plaintext',
  '.toml': 'plaintext',
  '.sh': 'plaintext',
  '.bash': 'plaintext',
  '.zsh': 'plaintext',
};

const PARSERS = {
  json: parseJson,
  yaml: parseYaml,
  csv: parseCsv,
  env: parseEnv,
  xml: parseXml,
  plaintext: parsePlaintext,
};

/**
 * Detect the file format from a File object.
 */
export function detectFormat(file) {
  // Try MIME type first
  if (file.type && FORMAT_MAP[file.type]) {
    return FORMAT_MAP[file.type];
  }
  // Fall back to extension
  const ext = '.' + file.name.split('.').pop().toLowerCase();
  if (FORMAT_MAP[ext]) return FORMAT_MAP[ext];
  // Check if filename is exactly '.env' or 'env'
  if (file.name === '.env' || file.name.endsWith('.env')) return 'env';
  return 'plaintext';
}

/**
 * Parse a File object and return its text content + detected format.
 */
export async function parseFile(file) {
  const format = detectFormat(file);
  const parser = PARSERS[format] || parsePlaintext;
  const text = await parser(file);
  return { text, format };
}

/**
 * Post-process cleaned text to reformat structured outputs.
 */
export function postProcess(cleanedText, format) {
  switch (format) {
    case 'json':
      return reformatJson(cleanedText);
    case 'yaml':
      return reformatYaml(cleanedText);
    default:
      return cleanedText;
  }
}

export const SUPPORTED_EXTENSIONS = [
  '.txt', '.md', '.log', '.conf', '.ini', '.toml', '.sh',
  '.json',
  '.yaml', '.yml',
  '.csv',
  '.env',
  '.xml',
];

export const ACCEPT_STRING = SUPPORTED_EXTENSIONS.join(',');
