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
      throw new Error('Fichier XML invalide : ' + parseError.textContent.slice(0, 100));
    }
  } catch (e) {
    if (e.message.startsWith('Fichier XML invalide')) throw e;
  }
  return text;
}
