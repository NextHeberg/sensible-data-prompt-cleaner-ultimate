/**
 * Single detected value row in the sidebar.
 */
import { createMemo } from 'solid-js';
import { store, excludeValue, includeValue } from '../../store/appStore.js';
import { t } from '../../i18n/index.js';

export function FoundValueItem(props) {
  const isExcluded = createMemo(() => store.excludedValues.includes(props.original));

  const truncated = createMemo(() => {
    const v = props.original || '';
    return v.length > 36 ? v.slice(0, 33) + '...' : v;
  });

  function toggle() {
    if (isExcluded()) {
      includeValue(props.original);
    } else {
      excludeValue(props.original);
    }
  }

  return (
    <div
      class={`flex items-center justify-between gap-2 px-2 py-1.5 rounded-md text-xs transition-colors group ${
        isExcluded()
          ? 'opacity-40 bg-zinc-100/50 dark:bg-zinc-800/30'
          : 'hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50'
      }`}
    >
      <div class="flex items-center gap-2 min-w-0 flex-1">
        <code
          class="truncate text-zinc-600 dark:text-zinc-300 font-mono"
          title={props.original}
        >
          {truncated()}
        </code>

        <svg class="w-3 h-3 text-zinc-400 dark:text-zinc-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
        </svg>

        <code class="shrink-0 font-mono text-indigo-500 dark:text-indigo-400 opacity-80">
          {isExcluded() ? props.original : props.replacement}
        </code>
      </div>

      <button
        onClick={toggle}
        title={isExcluded() ? t('detection.includeValue') : t('detection.excludeValue')}
        class={`shrink-0 p-0.5 rounded transition-colors opacity-0 group-hover:opacity-100 ${
          isExcluded()
            ? 'text-emerald-500 dark:text-emerald-400 hover:text-emerald-600 dark:hover:text-emerald-300'
            : 'text-zinc-400 dark:text-zinc-500 hover:text-amber-500 dark:hover:text-amber-400'
        }`}
      >
        {isExcluded() ? (
          <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
        ) : (
          <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
          </svg>
        )}
      </button>
    </div>
  );
}
