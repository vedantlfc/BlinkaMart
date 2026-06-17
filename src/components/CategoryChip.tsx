import type { ButtonHTMLAttributes } from "react";

export interface CategoryChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  active?: boolean;
}

export function CategoryChip({
  label,
  active = false,
  className = "",
  type = "button",
  ...props
}: CategoryChipProps) {
  const classes = ["category-chip", active ? "category-chip--active" : "", className]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      aria-pressed={active}
      className={classes}
      type={type}
      {...props}
    >
      {label}
    </button>
  );
}
