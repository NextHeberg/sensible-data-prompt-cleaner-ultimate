/**
 * Three-mode replacement style picker.
 * Labeled [EMAIL_1] | Redact ████ | Anonymize fake_data
 */
import { store, setStore } from '../../store/appStore.js';
import { t } from '../../i18n/index.js';

export function ReplacementStylePicker() {
  const styles = () => [
    { id: 'labeled', labelKey: 'replacement.labeled', titleKey: 'replacement.labeledTitle' },
    { id: 'redact',  labelKey: 'replacement.redact',  titleKey: 'replacement.redactTitle' },
    { id: 'anon',    labelKey: 'replacement.anon',    titleKey: 'replacement.anonTitle' },
  ];

  return (
    <div class="flex items-center gap-0.5 bg-zinc-100 dark:bg-zinc-800 rounded-lg p-0.5" role="group" aria-label={t('replacement.label')}>
      {styles().map((style) => (
        <button
          onClick={() => setStore('replacementStyle', style.id)}
          title={t(style.titleKey)}
          class={`px-3 py-1.5 rounded-md text-xs font-mono font-medium transition-colors ${
            store.replacementStyle === style.id
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-zinc-700'
          }`}
        >
          {t(style.labelKey)}
        </button>
      ))}
    </div>
  );
}
