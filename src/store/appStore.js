/**
 * Global application store using SolidJS createStore.
 * Single source of truth for all application state.
 */
import { createStore } from 'solid-js/store';
import { PATTERNS } from '../patterns/index.js';

// Build initial enabledPatterns map from pattern defaults
const initialEnabledPatterns = {};
for (const p of PATTERNS) {
  initialEnabledPatterns[p.id] = p.enabled;
}

const [store, setStore] = createStore({
  // Text content
  inputText: '',
  cleanedText: '',

  // Detection results
  // { [patternId]: { label, category, risk, confidence, count, values: { original: replacement } } }
  detections: {},

  // Pattern enable/disable state
  enabledPatterns: initialEnabledPatterns,

  // Values explicitly excluded by the user (false positive overrides)
  // Stored as an array for serialization; converted to Set in worker calls
  excludedValues: [],

  // Replacement style: 'labeled' | 'redact' | 'anon'
  replacementStyle: 'labeled',

  // Processing state
  isProcessing: false,
  progress: 0,

  // Theme: 'dark' | 'light'
  theme: 'dark',

  // File state
  fileFormat: 'plaintext',  // 'plaintext' | 'json' | 'yaml' | 'csv' | 'env' | 'xml'
  fileName: null,

  // UI state
  sidebarOpen: true,
  disclaimerSeen: false,
});

/**
 * Toggle a pattern on/off.
 */
function togglePattern(patternId) {
  setStore('enabledPatterns', patternId, (v) => !v);
}

/**
 * Toggle a category on/off (all patterns in category).
 */
function toggleCategory(category) {
  const patternsInCategory = PATTERNS.filter((p) => p.category === category);
  const allEnabled = patternsInCategory.every((p) => store.enabledPatterns[p.id]);
  for (const p of patternsInCategory) {
    setStore('enabledPatterns', p.id, !allEnabled);
  }
}

/**
 * Add a value to the excluded list (user marks as false positive).
 */
function excludeValue(value) {
  if (!store.excludedValues.includes(value)) {
    setStore('excludedValues', (prev) => [...prev, value]);
  }
}

/**
 * Remove a value from the excluded list.
 */
function includeValue(value) {
  setStore('excludedValues', (prev) => prev.filter((v) => v !== value));
}

/**
 * Toggle theme between dark and light.
 */
function toggleTheme() {
  const next = store.theme === 'dark' ? 'light' : 'dark';
  setStore('theme', next);
  document.documentElement.classList.toggle('dark', next === 'dark');
}

/**
 * Reset the input and all derived state.
 */
function clearAll() {
  setStore({
    inputText: '',
    cleanedText: '',
    detections: {},
    excludedValues: [],
    isProcessing: false,
    progress: 0,
    fileFormat: 'plaintext',
    fileName: null,
  });
}

export {
  store,
  setStore,
  togglePattern,
  toggleCategory,
  excludeValue,
  includeValue,
  toggleTheme,
  clearAll,
};
