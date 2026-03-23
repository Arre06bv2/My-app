interface TagBadgeProps {
  tag: string;
  color?: string;
}

export function TagBadge({ tag, color = '#6366f1' }: TagBadgeProps) {
  return (
    <span
      className="px-2 py-0.5 rounded-full text-xs font-medium"
      style={{
        background: `${color}22`,
        color,
        border: `1px solid ${color}44`,
      }}
    >
      #{tag}
    </span>
  );
}
