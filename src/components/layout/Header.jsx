/**
 * Application header.
 * Contains: logo/title, replacement style picker, theme toggle.
 */
import { store, toggleTheme } from '../../store/appStore.js';
import { ReplacementStylePicker } from '../controls/ReplacementStylePicker.jsx';

export function Header() {
  return (
    <header class="flex items-center justify-between px-4 py-3 border-b border-zinc-800 dark:border-zinc-800 bg-zinc-950/80 backdrop-blur-sm sticky top-0 z-30">
      {/* Logo + Title */}
      <div class="flex items-center gap-3">
        <div class="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-600">
          <svg class="w-4 h-4 text-white" viewBox="0 0 16 16" fill="none">
            <path d="M2 4h12M2 7h9M2 10h11M2 13h8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            <circle cx="13" cy="12" r="3" fill="#10b981" stroke="#09090b" stroke-width="1"/>
            <path d="M12 12l.75.75L14.5 11" stroke="white" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <div>
          <h1 class="text-sm font-semibold text-white leading-none">Prompt Cleaner</h1>
          <p class="text-xs text-zinc-500 leading-none mt-0.5">Supprimez les données sensibles avant l'IA</p>
        </div>
      </div>

      {/* Controls */}
      <div class="flex items-center gap-3">
        <ReplacementStylePicker />

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          class="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          title={store.theme === 'dark' ? 'Passer en mode clair' : 'Passer en mode sombre'}
        >
          {store.theme === 'dark' ? (
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          ) : (
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          )}
        </button>
      </div>
    </header>
  );
}
