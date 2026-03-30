/**
 * Badge/chip component for counts and labels.
 */
const COLORS = {
  red: 'bg-red-500/15 text-red-400 ring-red-500/20',
  orange: 'bg-orange-500/15 text-orange-400 ring-orange-500/20',
  yellow: 'bg-yellow-500/15 text-yellow-400 ring-yellow-500/20',
  blue: 'bg-blue-500/15 text-blue-400 ring-blue-500/20',
  purple: 'bg-purple-500/15 text-purple-400 ring-purple-500/20',
  green: 'bg-emerald-500/15 text-emerald-400 ring-emerald-500/20',
  zinc: 'bg-zinc-500/15 text-zinc-400 ring-zinc-500/20',
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
