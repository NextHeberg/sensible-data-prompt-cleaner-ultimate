/**
 * Copy to clipboard button with visual feedback.
 */
import { createSignal } from 'solid-js';

export function CopyButton(props) {
  const [copied, setCopied] = createSignal(false);

  async function handleCopy() {
    const text = props.getText?.();
    if (!text) return;

    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Fallback for browsers without clipboard API
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }

    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      onClick={handleCopy}
      disabled={props.disabled}
      title="Copier dans le presse-papiers"
      class={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
        copied()
          ? 'bg-emerald-600/20 text-emerald-400 ring-1 ring-emerald-500/30'
          : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white'
      } disabled:opacity-40 disabled:cursor-not-allowed`}
    >
      {copied() ? (
        <>
          <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
          </svg>
          Copié
        </>
      ) : (
        <>
          <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          Copier
        </>
      )}
    </button>
  );
}
