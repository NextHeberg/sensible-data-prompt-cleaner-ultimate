/**
 * XML parser.
 * Returns the raw XML text for the worker to process.
 * Validates that the content is parseable XML.
 */
export async function parseXml(file) {
  const text = await file.text();
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, 'application/xml');
    const parseError = doc.querySelector('parsererror');
    if (parseError) {
      // Use a static error message — never inject DOM-sourced text into
      // strings that may later be rendered as HTML (CodeQL js/xss-through-dom)
      throw new Error('Fichier XML invalide');
    }
  } catch (e) {
    if (e.message.startsWith('Fichier XML invalide')) throw e;
  }
  return text;
}
