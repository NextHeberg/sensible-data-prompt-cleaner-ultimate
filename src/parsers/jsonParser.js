/**
 * JSON parser.
 * Reads JSON, the worker will process it as plain text but structured-aware.
 * Returns the raw text so the worker can do value-only replacement.
 * After cleaning, the output is re-formatted JSON.
 */
export async function parseJson(file) {
  const text = await file.text();
  // Validate it's parseable JSON (throw if not)
  try {
    JSON.parse(text);
  } catch {
    throw new Error('Fichier JSON invalide : impossible de le parser.');
  }
  return text;
}

/**
 * Post-process: re-format cleaned JSON text for consistent indentation.
 * Called on the cleaned output if fileFormat === 'json'.
 */
export function reformatJson(cleanedText) {
  try {
    return JSON.stringify(JSON.parse(cleanedText), null, 2);
  } catch {
    // If replacement broke the JSON structure, return as-is
    return cleanedText;
  }
}
