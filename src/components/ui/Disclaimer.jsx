/**
 * Disclaimer footer notice and modal.
 */
import { createSignal, Show } from 'solid-js';
import { t } from '../../i18n/index.js';

export function Disclaimer() {
  const [open, setOpen] = createSignal(false);

  return (
    <>
      {/* Footer strip */}
      <div class="flex items-center gap-2 text-xs text-zinc-400 dark:text-zinc-500">
        <span class="text-amber-500 dark:text-amber-400">⚠</span>
        <span>
          {t('disclaimer.short')}<strong class="text-zinc-600 dark:text-zinc-400">{t('disclaimer.shortBold')}</strong>{t('disclaimer.shortEnd')}
        </span>
        <button
          onClick={() => setOpen(true)}
          class="underline hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors whitespace-nowrap"
        >
          {t('disclaimer.learnMore')}
        </button>
      </div>

      {/* Modal */}
      <Show when={open()}>
        <div
          class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={(e) => e.target === e.currentTarget && setOpen(false)}
        >
          <div class="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl max-w-lg w-full p-6 shadow-2xl">
            <div class="flex items-start justify-between mb-4">
              <h2 class="text-lg font-semibold text-zinc-900 dark:text-white flex items-center gap-2">
                <span class="text-amber-500 dark:text-amber-400">⚠</span>
                {t('disclaimer.title')}
              </h2>
              <button
                onClick={() => setOpen(false)}
                class="text-zinc-400 hover:text-zinc-700 dark:hover:text-white transition-colors text-xl leading-none"
              >
                ×
              </button>
            </div>

            <div class="space-y-3 text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
              <ul class="space-y-2 pl-4 list-disc text-zinc-500 dark:text-zinc-400">
                <li>
                  <strong class="text-zinc-700 dark:text-zinc-300">{t('disclaimer.fpLabel')}</strong> — {t('disclaimer.fp')}
                </li>
                <li>
                  <strong class="text-zinc-700 dark:text-zinc-300">{t('disclaimer.fnLabel')}</strong> — {t('disclaimer.fn')}
                  <code class="bg-zinc-100 dark:bg-zinc-800 px-1 rounded">{t('disclaimer.fnCode')}</code>{t('disclaimer.fnEnd')}
                </li>
                <li>
                  <strong class="text-zinc-700 dark:text-zinc-300">{t('disclaimer.namesLabel')}</strong> — {t('disclaimer.names')}
                </li>
                <li>
                  <strong class="text-zinc-700 dark:text-zinc-300">{t('disclaimer.structuredLabel')}</strong> — {t('disclaimer.structured')}
                </li>
              </ul>

              <p class="text-amber-600 dark:text-amber-400/80 font-medium">
                {t('disclaimer.responsibility')}
              </p>

              <p class="text-xs text-zinc-400 dark:text-zinc-500">
                {t('disclaimer.local')}<strong class="text-zinc-500 dark:text-zinc-400">{t('disclaimer.localBold')}</strong>{t('disclaimer.localEnd')}
              </p>
            </div>

            <button
              onClick={() => setOpen(false)}
              class="mt-5 w-full bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg py-2 text-sm font-medium transition-colors"
            >
              {t('disclaimer.understood')}
            </button>
          </div>
        </div>
      </Show>
    </>
  );
}
