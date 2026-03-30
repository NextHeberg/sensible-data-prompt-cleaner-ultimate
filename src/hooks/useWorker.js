/**
 * Web Worker hook.
 * Manages the lifecycle of the cleaner worker and provides a `process` function.
 * Handles request ID versioning to ignore stale responses.
 */
import { onCleanup } from 'solid-js';
import { setStore } from '../store/appStore.js';
import { PATTERNS } from '../patterns/index.js';
import { postProcess } from '../parsers/index.js';

// Single persistent worker instance
let worker = null;
let latestRequestId = 0;

function getWorker() {
  if (!worker) {
    worker = new Worker(new URL('../workers/cleaner.worker.js', import.meta.url), {
      type: 'module',
    });

    worker.onmessage = (event) => {
      const { type, cleaned, detections, percent, requestId, message } = event.data;

      // Ignore stale responses
      if (requestId !== latestRequestId) return;

      if (type === 'progress') {
        setStore('progress', percent);
        return;
      }

      if (type === 'error') {
        console.error('[Worker error]', message);
        setStore({ isProcessing: false, progress: 0 });
        return;
      }

      if (type === 'result') {
        setStore({
          cleanedText: cleaned,
          detections,
          isProcessing: false,
          progress: 100,
        });
        // Reset progress bar after a brief moment
        setTimeout(() => setStore('progress', 0), 500);
      }
    };

    worker.onerror = (err) => {
      console.error('[Worker error]', err);
      setStore({ isProcessing: false, progress: 0 });
    };
  }
  return worker;
}

/**
 * Send text to the worker for processing.
 * @param {string} text - The input text
 * @param {object} options - { enabledPatterns, replacementStyle, excludedValues, fileFormat }
 */
export function processText(text, options) {
  const { enabledPatterns, replacementStyle, excludedValues, fileFormat } = options;

  if (!text || text.trim().length === 0) {
    setStore({ cleanedText: '', detections: {}, isProcessing: false, progress: 0 });
    return;
  }

  // Send only serializable pattern IDs — the worker imports PATTERNS itself
  // (RegExp and functions cannot be cloned via structured clone algorithm)
  const enabledPatternIds = PATTERNS
    .filter((p) => enabledPatterns[p.id])
    .map((p) => p.id);

  latestRequestId++;
  const requestId = latestRequestId;

  setStore({ isProcessing: true, progress: 0 });

  getWorker().postMessage({
    type: 'process',
    text,
    enabledPatternIds,
    replacementStyle,
    excludedValues: excludedValues || [],
    requestId,
  });
}

/**
 * Terminate the worker (called on app cleanup).
 */
export function terminateWorker() {
  if (worker) {
    worker.terminate();
    worker = null;
  }
}
