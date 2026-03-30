/**
 * Accessible toggle switch component.
 */
export function Toggle(props) {
  return (
    <button
      role="switch"
      aria-checked={props.checked}
      onClick={() => props.onChange?.(!props.checked)}
      class={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900 ${
        props.checked
          ? 'bg-indigo-600'
          : 'bg-zinc-600 dark:bg-zinc-700'
      } ${props.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      disabled={props.disabled}
      title={props.title}
    >
      <span
        class={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg transition duration-200 ${
          props.checked ? 'translate-x-4' : 'translate-x-0'
        }`}
      />
    </button>
  );
}
