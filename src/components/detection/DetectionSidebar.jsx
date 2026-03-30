/**
 * Detection sidebar.
 * Shows all detection categories with their results.
 */
import { createMemo, For, Show } from 'solid-js';
import { store, setStore } from '../../store/appStore.js';
import { t } from '../../i18n/index.js';
import { CATEGORIES } from '../../patterns/index.js';
import { CategoryCard } from './CategoryCard.jsx';

export function DetectionSidebar() {
  const totalDetections = createMemo(() => {
    return Object.values(store.detections).reduce((sum, d) => sum + d.count, 0);
  });

  const categories = Object.keys(CATEGORIES);

  const protectedLabel = createMemo(() =>
    t('detection.protected', { count: totalDetections() })
  );

  return (
    <aside class="flex flex-col h-full min-h-0 bg-zinc-50 dark:bg-zinc-950/50 border-l border-zinc-200 dark:border-zinc-800 transition-colors duration-150">
      {/* Sidebar header */}
      <div class="flex items-center justify-between px-3 py-2.5 border-b border-zinc-200 dark:border-zinc-800">
        <div class="flex items-center gap-2">
          <span class="text-xs font-semibold text-zinc-500 dark:text-zinc-300 uppercase tracking-wider">{t('detection.title')}</span>
          <Show when={totalDetections() > 0}>
            <span class="px-2 py-0.5 rounded-full bg-indigo-600 text-white text-xs font-bold leading-none">
              {totalDetections()}
            </span>
          </Show>
        </div>

        {/* Close sidebar on mobile */}
        <button
          onClick={() => setStore('sidebarOpen', false)}
          class="lg:hidden p-1 text-zinc-400 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Category list */}
      <div class="flex-1 overflow-y-auto p-3 space-y-2">
        <For each={categories}>
          {(category) => <CategoryCard category={category} />}
        </For>
      </div>

      {/* Sidebar footer: stats */}
      <Show when={totalDetections() > 0}>
        <div class="border-t border-zinc-200 dark:border-zinc-800 px-3 py-2.5">
          <p class="text-xs text-zinc-400 dark:text-zinc-500 text-center">
            <span class="text-emerald-600 dark:text-emerald-400 font-medium">{protectedLabel()}</span>
          </p>
        </div>
      </Show>
    </aside>
  );
}
