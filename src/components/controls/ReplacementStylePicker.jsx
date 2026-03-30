/**
 * Three-mode replacement style picker.
 * Labeled [EMAIL_1] | Redact ████ | Anonymize fake_data
 */
import { store, setStore } from '../../store/appStore.js';

const STYLES = [
  {
    id: 'labeled',
    label: '[VAL_1]',
    title: 'Placeholder étiqueté — ex: [EMAIL_1], [IP_1]',
  },
  {
    id: 'redact',
    label: '████',
    title: 'Rédaction — remplace par des blocs noirs',
  },
  {
    id: 'anon',
    label: '~fake',
    title: 'Anonymisation — remplace par des données fictives plausibles',
  },
];

export function ReplacementStylePicker() {
  return (
    <div class="flex items-center gap-0.5 bg-zinc-800 rounded-lg p-0.5" role="group" aria-label="Style de remplacement">
      {STYLES.map((style) => (
        <button
          onClick={() => setStore('replacementStyle', style.id)}
          title={style.title}
          class={`px-3 py-1.5 rounded-md text-xs font-mono font-medium transition-colors ${
            store.replacementStyle === style.id
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-700'
          }`}
        >
          {style.label}
        </button>
      ))}
    </div>
  );
}
