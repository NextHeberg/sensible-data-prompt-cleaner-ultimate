/**
 * CSV parser using PapaParse.
 * Returns the raw CSV text for the worker to process.
 * CSV structure is naturally preserved since patterns only replace values.
 */
import Papa from 'papaparse';

export async function parseCsv(file) {
  const text = await file.text();
  try {
    const result = Papa.parse(text, { header: false, skipEmptyLines: false });
    if (result.errors.length > 0 && result.data.length === 0) {
      throw new Error('Fichier CSV invalide.');
    }
  } catch (e) {
    if (e.message === 'Fichier CSV invalide.') throw e;
    // Non-critical parse errors are fine
  }
  return text;
}
