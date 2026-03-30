/**
 * Lightweight SolidJS-native i18n.
 *
 * - Uses a createSignal for the current locale.
 * - t(key, params) is reactive: when called inside a SolidJS reactive context
 *   (JSX, createMemo, createEffect), it will re-evaluate when locale changes.
 * - Supports nested keys: t('header.title')
 * - Supports interpolation: t('output.lines', { count: 42 }) → "42 lines"
 * - Falls back to the key string if translation is missing.
 * - Default locale: 'en'
 */
import { createSignal } from 'solid-js';
import en from './locales/en.js';
import fr from './locales/fr.js';

const LOCALES = { en, fr };

const [locale, setLocale] = createSignal('en');

/**
 * Translate a dot-notation key with optional parameter interpolation.
 * @param {string} key - e.g. 'header.title' or 'output.lines'
 * @param {object} [params] - e.g. { count: 5 }
 * @returns {string}
 */
export function t(key, params) {
  const keys = key.split('.');
  let val = LOCALES[locale()];
  for (const k of keys) {
    val = val?.[k];
  }
  if (typeof val === 'string' && params) {
    return Object.entries(params).reduce(
      (s, [k, v]) => s.replace(new RegExp(`\\{\\{${k}\\}\\}`, 'g'), String(v)),
      val
    );
  }
  // Handle plural keys: t('output.cleaned', { count: 2 }) → looks for cleaned_other
  if (typeof val === 'undefined' && params?.count !== undefined) {
    const pluralKey = params.count === 1 ? `${key}_one` : `${key}_other`;
    return t(pluralKey, params);
  }
  return val ?? key;
}

/**
 * Toggle between 'en' and 'fr'.
 */
export function toggleLocale() {
  setLocale((l) => (l === 'en' ? 'fr' : 'en'));
}

export { locale, setLocale };
