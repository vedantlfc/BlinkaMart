import type { ButtonHTMLAttributes } from "react";
import type { Category } from "../data/catalog";

export interface CategoryTileProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  category: Category;
  productCount: number;
  active?: boolean;
}

export function CategoryTile({
  category,
  productCount,
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

  return (
    <button
      aria-pressed={active}
      className={classes}
      type={type}
      {...props}
    >
      <span className="category-tile__mark" aria-hidden="true">
        {category.mark}
      </span>
      <span className="category-tile__body">
        <span className="category-tile__name">{category.name}</span>
        <span className="category-tile__description">{category.description}</span>
        <span className="category-tile__meta">
          {productCount} items - {category.vibe}
        </span>
      </span>
    </button>
  );
}
