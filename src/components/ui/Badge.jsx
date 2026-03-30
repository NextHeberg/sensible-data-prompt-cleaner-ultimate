/**
 * Badge/chip component for counts and labels.
 */
const COLORS = {
  red: 'bg-red-100 dark:bg-red-500/15 text-red-600 dark:text-red-400 ring-red-300 dark:ring-red-500/20',
  orange: 'bg-orange-100 dark:bg-orange-500/15 text-orange-600 dark:text-orange-400 ring-orange-300 dark:ring-orange-500/20',
  yellow: 'bg-yellow-100 dark:bg-yellow-500/15 text-yellow-700 dark:text-yellow-400 ring-yellow-300 dark:ring-yellow-500/20',
  blue: 'bg-blue-100 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400 ring-blue-300 dark:ring-blue-500/20',
  purple: 'bg-purple-100 dark:bg-purple-500/15 text-purple-600 dark:text-purple-400 ring-purple-300 dark:ring-purple-500/20',
  green: 'bg-emerald-100 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 ring-emerald-300 dark:ring-emerald-500/20',
  zinc: 'bg-zinc-100 dark:bg-zinc-500/15 text-zinc-600 dark:text-zinc-400 ring-zinc-300 dark:ring-zinc-500/20',
};

export function Badge(props) {
  const color = props.color || 'zinc';
  const colorClass = COLORS[color] || COLORS.zinc;

  return (
    <span
      class={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${colorClass} ${props.class || ''}`}
    >
      {props.children}
    </span>
  );
}
