/**
 * Right panel: cleaned text output.
 */
import { createMemo, Show } from 'solid-js';
import { store } from '../../store/appStore.js';
import { CopyButton } from '../controls/CopyButton.jsx';
import { postProcess } from '../../parsers/index.js';

export function OutputPanel() {
  const processedText = createMemo(() => {
    if (!store.cleanedText) return '';
    return postProcess(store.cleanedText, store.fileFormat);
  });

  const totalDetections = createMemo(() => {
    return Object.values(store.detections).reduce((sum, d) => sum + d.count, 0);
  });

  const lineCount = createMemo(() => {
    if (!processedText()) return 0;
    return processedText().split('\n').length;
  });

  function downloadFile() {
    const text = processedText();
    if (!text) return;
    const ext = store.fileName ? store.fileName.split('.').pop() : 'txt';
    const baseName = store.fileName
      ? store.fileName.replace(/\.[^.]+$/, '')
      : 'prompt';
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${baseName}_cleaned.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div class="flex flex-col h-full min-h-0">
      {/* Panel header */}
      <div class="flex items-center justify-between px-3 py-2 border-b border-zinc-800 bg-zinc-900/50">
        <div class="flex items-center gap-2">
          <span class="text-xs font-medium text-zinc-400">Prompt nettoyé</span>
          <Show when={totalDetections() > 0}>
            <span class="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 text-xs ring-1 ring-emerald-500/20">
              <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
              </svg>
              {totalDetections()} valeur{totalDetections() > 1 ? 's' : ''} nettoyée{totalDetections() > 1 ? 's' : ''}
            </span>
          </Show>
        </div>

        <div class="flex items-center gap-1">
          <Show when={processedText()}>
            <>
              <CopyButton getText={() => processedText()} />
              <button
                onClick={downloadFile}
                class="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                title="Télécharger le fichier nettoyé"
              >
                <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Exporter
              </button>
            </>
          </Show>
        </div>
      </div>

      {/* Progress bar */}
      <Show when={store.isProcessing && store.progress > 0 && store.progress < 100}>
        <div class="h-0.5 bg-zinc-800">
          <div
            class="h-full bg-indigo-500 transition-all duration-200"
            style={{ width: `${store.progress}%` }}
          />
        </div>
      </Show>

      {/* Output content */}
      <div class="flex-1 min-h-0 overflow-auto">
        <Show
          when={processedText()}
          fallback={
            <div class="flex flex-col items-center justify-center h-full text-zinc-600 select-none gap-3">
              <Show
                when={store.isProcessing}
                fallback={
                  <>
                    <svg class="w-10 h-10 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1"
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <p class="text-sm">Le prompt nettoyé apparaîtra ici</p>
                  </>
                }
              >
                <svg class="w-6 h-6 animate-spin text-indigo-500" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                <p class="text-sm">Analyse en cours...</p>
              </Show>
            </div>
          }
        >
          <pre class="text-sm text-zinc-200 font-mono leading-relaxed px-4 py-3 whitespace-pre-wrap break-words">
            {processedText()}
          </pre>
        </Show>
      </div>

      {/* Stats footer */}
      <div class="flex items-center gap-3 px-3 py-1.5 border-t border-zinc-800 bg-zinc-900/30">
        <Show when={processedText()}>
          <span class="text-xs text-zinc-600">{lineCount().toLocaleString()} lignes</span>
          <span class="text-zinc-700">·</span>
          <span class="text-xs text-zinc-600">{processedText().length.toLocaleString()} caractères</span>
        </Show>
      </div>
    </div>
  );
}
