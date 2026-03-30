/**
 * Detection category card in the sidebar.
 */
import { createSignal, Show, For, createMemo } from 'solid-js';
import { store, toggleCategory, togglePattern } from '../../store/appStore.js';
import { t } from '../../i18n/index.js';
import { PATTERNS, CATEGORIES } from '../../patterns/index.js';
import { Badge } from '../ui/Badge.jsx';
import { Toggle } from '../ui/Toggle.jsx';
import { FoundValueItem } from './FoundValueItem.jsx';

const CATEGORY_ICONS = {
  credentials: (
    <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
        d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
    </svg>
  ),
  identity: (
    <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  ),
  financial: (
    <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
        d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
    </svg>
  ),
  network: (
    <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
        d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
    </svg>
  ),
  address: (
    <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
};

export function CategoryCard(props) {
  const [expanded, setExpanded] = createSignal(false);

  const categoryInfo = CATEGORIES[props.category];
  const patternsInCategory = PATTERNS.filter((p) => p.category === props.category);

  const totalCount = createMemo(() => {
    return patternsInCategory.reduce((sum, p) => {
      const d = store.detections[p.id];
      return sum + (d?.count || 0);
    }, 0);
  });

  const allValues = createMemo(() => {
    const result = [];
    for (const p of patternsInCategory) {
      const d = store.detections[p.id];
      if (d?.values) {
        for (const [original, replacement] of Object.entries(d.values)) {
          result.push({ original, replacement });
        }
      }
    }
    return result;
  });

  const allEnabled = createMemo(() =>
    patternsInCategory.every((p) => store.enabledPatterns[p.id])
  );

  const hasDetections = createMemo(() => totalCount() > 0);

  const categoryLabel = createMemo(() => t(`categories.${props.category}`));

  return (
    <div class={`rounded-lg border transition-colors ${
      hasDetections()
        ? 'border-zinc-300 dark:border-zinc-700 bg-zinc-100/60 dark:bg-zinc-800/40'
        : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/20'
    }`}>
      {/* Category header */}
      <div class="flex items-center gap-2 px-3 py-2.5">
        {/* Icon */}
        <span class={`text-${categoryInfo.color}-500 dark:text-${categoryInfo.color}-400 shrink-0`}>
          {CATEGORY_ICONS[props.category]}
        </span>

        {/* Label + count */}
        <button
          class="flex items-center gap-2 flex-1 text-left"
          onClick={() => setExpanded((v) => !v)}
        >
          <span class={`text-xs font-medium ${hasDetections() ? 'text-zinc-700 dark:text-zinc-200' : 'text-zinc-400 dark:text-zinc-500'}`}>
            {categoryLabel()}
          </span>

          <Show when={hasDetections()}>
            <Badge color={categoryInfo.color}>{totalCount()}</Badge>
          </Show>
        </button>

        {/* Expand chevron */}
        <button
          onClick={() => setExpanded((v) => !v)}
          class="text-zinc-400 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
        >
          <svg
            class={`w-3.5 h-3.5 transition-transform ${expanded() ? 'rotate-180' : ''}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Category toggle */}
        <Toggle
          checked={allEnabled()}
          onChange={() => toggleCategory(props.category)}
          title={allEnabled() ? t('patterns.disableCategory') : t('patterns.enableCategory')}
        />
      </div>

      {/* Expanded values list */}
      <Show when={expanded() && allValues().length > 0}>
        <div class="border-t border-zinc-200 dark:border-zinc-800 px-2 py-2 space-y-0.5 max-h-48 overflow-y-auto">
          <For each={allValues()}>
            {(item) => (
              <FoundValueItem
                original={item.original}
                replacement={item.replacement}
              />
            )}
          </For>
        </div>
      </Show>

      {/* Per-pattern toggles when no detections but expanded */}
      <Show when={!hasDetections() && expanded()}>
        <div class="border-t border-zinc-200 dark:border-zinc-800 px-3 py-2 space-y-1.5">
          <For each={patternsInCategory}>
            {(pattern) => (
              <div class="flex items-center justify-between gap-2">
                <span class={`text-xs ${pattern.experimental ? 'text-amber-500 dark:text-amber-400/70' : 'text-zinc-400 dark:text-zinc-500'}`}>
                  {pattern.label}
                  {pattern.experimental && ` — ${t('patterns.experimental')}`}
                </span>
                <Toggle
                  checked={store.enabledPatterns[pattern.id]}
                  onChange={() => togglePattern(pattern.id)}
                />
              </div>
            )}
          </For>
        </div>
      </Show>
    </div>
  );
}
