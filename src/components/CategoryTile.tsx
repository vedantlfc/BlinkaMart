import type { ButtonHTMLAttributes } from "react";
import { categoryIconById } from "../data/categoryIcons";
import type { Category } from "../data/catalog";

export interface CategoryTileProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  category: Category;
  active?: boolean;
}

export function CategoryTile({
  category,
  active = false,
  className = "",
  type = "button",
  ...props
}: CategoryTileProps) {
  const classes = [
    "category-tile",
    `category-tile--${category.accent}`,
    active ? "category-tile--active" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");
  const ariaLabel = props["aria-label"] ?? `${category.name} category`;

  return (
    <button
      aria-label={ariaLabel}
      aria-pressed={active}
      className={classes}
      type={type}
      {...props}
    >
      <span className="category-tile__icon" aria-hidden="true">
        <img alt="" src={categoryIconById[category.id]} />
      </span>
      <span className="category-tile__name">{category.name}</span>
      <span className="category-tile__indicator" aria-hidden="true" />
    </button>
  );
}
