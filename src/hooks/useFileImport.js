/**
 * File import hook.
 * Handles reading a file, routing to the correct parser,
 * and updating the store with the parsed text.
 */
import { setStore } from '../store/appStore.js';
import { parseFile } from '../parsers/index.js';

/**
 * Import a File object and load it into the store.
 * @param {File} file
 * @returns {Promise<void>}
 */
export async function importFile(file) {
  try {
    setStore({ isProcessing: true });

    const { text, format } = await parseFile(file);

    setStore({
      inputText: text,
      fileFormat: format,
      fileName: file.name,
      // Clear previous results
      cleanedText: '',
      detections: {},
      excludedValues: [],
    });
  } catch (err) {
    console.error('[File import error]', err);
    // Surface the error to the user via store
    setStore({
      isProcessing: false,
      importError: err.message,
    });
    // Clear error after 4 seconds
    setTimeout(() => setStore('importError', null), 4000);
    throw err;
  }
}

/**
 * Handle a DataTransfer object (from drag & drop or paste).
 * Only processes the first file.
 * @param {DataTransfer} dataTransfer
 */
export async function handleDataTransfer(dataTransfer) {
  const file = dataTransfer.files?.[0];
  if (!file) return;
  await importFile(file);
}
