/**
 * Drag-and-drop file import overlay.
 * Wraps around the InputPanel textarea.
 */
import { createSignal, Show } from 'solid-js';
import { handleDataTransfer } from '../../hooks/useFileImport.js';
import { ACCEPT_STRING } from '../../parsers/index.js';

export function DropZone(props) {
  const [isDragging, setIsDragging] = createSignal(false);
  let dragCounter = 0;

  function onDragEnter(e) {
    e.preventDefault();
    dragCounter++;
    setIsDragging(true);
  }

  function onDragLeave(e) {
    e.preventDefault();
    dragCounter--;
    if (dragCounter === 0) setIsDragging(false);
  }

  function onDragOver(e) {
    e.preventDefault();
  }

  async function onDrop(e) {
    e.preventDefault();
    dragCounter = 0;
    setIsDragging(false);
    await handleDataTransfer(e.dataTransfer);
  }

  return (
    <div
      class="relative flex-1 flex flex-col min-h-0"
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      {props.children}

      {/* Overlay shown while dragging */}
      <Show when={isDragging()}>
        <div class="absolute inset-0 z-20 flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-indigo-500 bg-indigo-950/80 backdrop-blur-sm pointer-events-none">
          <svg class="w-10 h-10 text-indigo-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <p class="text-indigo-300 font-semibold text-base">Déposez votre fichier ici</p>
          <p class="text-indigo-400/70 text-xs mt-1">
            TXT, MD, LOG, JSON, YAML, CSV, ENV, XML
          </p>
        </div>
      </Show>
    </div>
  );
}
