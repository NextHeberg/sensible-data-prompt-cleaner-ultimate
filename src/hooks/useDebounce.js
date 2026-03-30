/**
 * Debounce hook for SolidJS signals.
 * Returns a debounced version of the accessor that only updates after `delay` ms of inactivity.
 */
import { createSignal, createEffect, on } from 'solid-js';

export function useDebounce(accessor, delay = 300) {
  const [debounced, setDebounced] = createSignal(accessor());

  createEffect(
    on(accessor, (value) => {
      const timer = setTimeout(() => setDebounced(() => value), delay);
      return () => clearTimeout(timer);
    })
  );

  return debounced;
}
