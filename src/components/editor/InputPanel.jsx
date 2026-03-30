/**
 * Left panel: text input with file import and stats.
 */
import { createMemo, Show } from 'solid-js';
import { store, setStore, clearAll } from '../../store/appStore.js';
import { DropZone } from './DropZone.jsx';
import { importFile } from '../../hooks/useFileImport.js';
import { ACCEPT_STRING } from '../../parsers/index.js';

export function InputPanel() {
  let fileInputRef;

  const lineCount = createMemo(() => {
    if (!store.inputText) return 0;
    return store.inputText.split('\n').length;
  });

  const charCount = createMemo(() => store.inputText?.length || 0);

  function handleFileSelect(e) {
    const file = e.target.files?.[0];
    if (file) {
      importFile(file);
      e.target.value = '';
    }
  }

  const FORMAT_LABELS = {
    json: 'JSON',
    yaml: 'YAML',
    csv: 'CSV',
    env: 'ENV',
    xml: 'XML',
    plaintext: null,
  };

  return (
    <div class="flex flex-col h-full min-h-0">
      {/* Panel header */}
      <div class="flex items-center justify-between px-3 py-2 border-b border-zinc-800 bg-zinc-900/50">
        <div class="flex items-center gap-2">
          <span class="text-xs font-medium text-zinc-400">Prompt original</span>
          <Show when={store.fileName}>
            <span class="flex items-center gap-1 px-2 py-0.5 rounded bg-zinc-800 text-xs text-zinc-300">
              <svg class="w-3 h-3 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              {store.fileName}
            </span>
          </Show>
          <Show when={FORMAT_LABELS[store.fileFormat]}>
            <span class="px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-400 text-xs font-mono font-medium">
              {FORMAT_LABELS[store.fileFormat]}
            </span>
          </Show>
        </div>

        <div class="flex items-center gap-1">
          {/* Import file button */}
          <button
            onClick={() => fileInputRef.click()}
            class="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
            title="Importer un fichier"
          >
            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            Importer
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept={ACCEPT_STRING}
            class="hidden"
            onChange={handleFileSelect}
          />

          {/* Clear button */}
          <Show when={store.inputText}>
            <button
              onClick={clearAll}
              class="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs text-zinc-500 hover:text-red-400 hover:bg-red-950/40 transition-colors"
              title="Effacer tout"
            >
              <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
              Effacer
            </button>
          </Show>
        </div>
      </div>

      {/* Textarea with drop zone */}
      <DropZone>
        <textarea
          class="flex-1 w-full h-full min-h-0 resize-none bg-transparent text-sm text-zinc-200 font-mono leading-relaxed px-4 py-3 placeholder-zinc-600 focus:outline-none"
          placeholder="Collez votre prompt ici, ou déposez un fichier...&#10;&#10;Exemples détectés :&#10;john.doe@company.com · 192.168.1.100 · +33 6 12 34 56 78&#10;mot de passe: s3cr3t · IBAN FR76... · ghp_xxxx..."
          value={store.inputText}
          onInput={(e) => setStore('inputText', e.currentTarget.value)}
          spellcheck={false}
          autocomplete="off"
          autocorrect="off"
          autocapitalize="off"
        />
      </DropZone>

      {/* Stats footer */}
      <div class="flex items-center gap-3 px-3 py-1.5 border-t border-zinc-800 bg-zinc-900/30">
        <span class="text-xs text-zinc-600">{lineCount().toLocaleString()} lignes</span>
        <span class="text-zinc-700">·</span>
        <span class="text-xs text-zinc-600">{charCount().toLocaleString()} caractères</span>
        <Show when={store.importError}>
          <span class="ml-auto text-xs text-red-400">{store.importError}</span>
        </Show>
      </div>
    </div>
  );
}
