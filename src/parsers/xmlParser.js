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
      // Strip HTML metacharacters from DOM-sourced text before use (XSS guard)
      const rawMsg = parseError.textContent ?? '';
      const safeMsg = rawMsg.replace(/[<>"'&]/g, '').trim().slice(0, 100);
      throw new Error('Fichier XML invalide : ' + safeMsg);
    }
  } catch (e) {
    if (e.message.startsWith('Fichier XML invalide')) throw e;
  }
  return text;
}
