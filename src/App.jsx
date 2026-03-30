/**
 * Root application component.
 * Manages the main layout, reactive processing pipeline, and sidebar toggle.
 */
import { createEffect, Show } from 'solid-js';
import { store, setStore } from './store/appStore.js';
import { processText } from './hooks/useWorker.js';
import { useDebounce } from './hooks/useDebounce.js';
import { PATTERNS } from './patterns/index.js';
import { Header } from './components/layout/Header.jsx';
import { InputPanel } from './components/editor/InputPanel.jsx';
import { OutputPanel } from './components/editor/OutputPanel.jsx';
import { DetectionSidebar } from './components/detection/DetectionSidebar.jsx';
import { Disclaimer } from './components/ui/Disclaimer.jsx';

export function App() {
  // Debounced input text — triggers worker after 300ms of no typing
  const debouncedInput = useDebounce(() => store.inputText, 300);

  // Re-run worker when: input changes, patterns change, style changes, excluded values change
  createEffect(() => {
    const text = debouncedInput();
    const enabledPatterns = { ...store.enabledPatterns };
    const replacementStyle = store.replacementStyle;
    const excludedValues = [...store.excludedValues];

    processText(text, {
      enabledPatterns,
      replacementStyle,
      excludedValues,
    });
  });

  // Initialize theme on mount
  createEffect(() => {
    document.documentElement.classList.toggle('dark', store.theme === 'dark');
  });

  return (
    <div class="flex flex-col h-full min-h-0 bg-zinc-950 text-zinc-100">
      {/* Header */}
      <Header />

      {/* Main content area */}
      <div class="flex flex-1 min-h-0 overflow-hidden">
        {/* Panels container */}
        <div class="flex flex-1 min-w-0 flex-col md:flex-row">
          {/* Input panel */}
          <div class="flex-1 min-h-0 min-w-0 flex flex-col border-b md:border-b-0 md:border-r border-zinc-800 md:max-h-full"
            style={{ "max-height": "50dvh", "min-height": "200px" }}
          >
            <InputPanel />
          </div>

          {/* Output panel */}
          <div class="flex-1 min-h-0 min-w-0 flex flex-col"
            style={{ "min-height": "200px" }}
          >
            <OutputPanel />
          </div>
        </div>

        {/* Detection sidebar — desktop always visible, mobile as overlay */}
        <Show when={store.sidebarOpen}>
          <div class="hidden lg:flex w-72 xl:w-80 flex-col shrink-0">
            <DetectionSidebar />
          </div>
        </Show>

        {/* Mobile sidebar overlay */}
        <Show when={store.sidebarOpen}>
          <div class="lg:hidden fixed inset-0 z-40 flex" onClick={() => setStore('sidebarOpen', false)}>
            <div class="flex-1 bg-black/40 backdrop-blur-sm" />
            <div class="w-72 flex flex-col bg-zinc-950 border-l border-zinc-800 h-full overflow-hidden">
              <DetectionSidebar />
            </div>
          </div>
        </Show>
      </div>

      {/* Mobile sidebar toggle */}
      <Show when={!store.sidebarOpen}>
        <button
          onClick={() => setStore('sidebarOpen', true)}
          class="lg:hidden fixed bottom-16 right-4 z-30 flex items-center gap-2 px-3 py-2 rounded-full bg-indigo-600 text-white shadow-lg text-sm font-medium"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          Détections
        </button>
      </Show>

      {/* Footer */}
      <footer class="flex items-center justify-between px-4 py-2 border-t border-zinc-800 bg-zinc-950/80 shrink-0">
        <Disclaimer />

        {/* Sidebar toggle for desktop */}
        <button
          onClick={() => setStore('sidebarOpen', (v) => !v)}
          class="hidden lg:flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
          title="Afficher/masquer le panneau de détections"
        >
          <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          {store.sidebarOpen ? 'Masquer' : 'Détections'}
        </button>
      </footer>
    </div>
  );
}
