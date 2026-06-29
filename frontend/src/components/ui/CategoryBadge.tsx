import Link from "next/link";

interface CategoryBadgeProps {
  name: string;
  slug: string;
  color?: string;
  icon?: string;
  size?: "sm" | "md";
}

export default function CategoryBadge({ name, slug, color = "#7c3aed", icon, size = "sm" }: CategoryBadgeProps) {
  const sizeClass = size === "sm" ? "text-xs px-2.5 py-1" : "text-sm px-4 py-1.5";

  return (
    <Link
      href={`/category/${slug}`}
      className={`inline-flex items-center gap-1.5 ${sizeClass} rounded-full font-semibold uppercase tracking-wider transition-opacity hover:opacity-80`}
      style={{ backgroundColor: `${color}20`, color, border: `1px solid ${color}40` }}
    >
      {icon && <span>{icon}</span>}
      {name}
    </Link>
  );
}
