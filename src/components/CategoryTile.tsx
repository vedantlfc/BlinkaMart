import type { ButtonHTMLAttributes } from "react";
import type { Category, Product } from "../data/catalog";

export interface CategoryTileProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  category: Category;
  productCount: number;
  representativeProducts?: Product[];
  active?: boolean;
}

export function CategoryTile({
  category,
  productCount,
  representativeProducts = [],
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
      <span className="category-tile__art" aria-hidden="true">
        {representativeProducts.slice(0, 2).map((product) => (
          <img
            alt=""
            key={product.id}
            loading="lazy"
            src={product.imageSrc}
          />
        ))}
        {representativeProducts.length === 0 ? (
          <span className="category-tile__mark">{category.mark}</span>
        ) : null}
        <span className="category-tile__count">{productCount} items</span>
      </span>
      <span className="category-tile__body">
        <span className="category-tile__name">{category.name}</span>
        <span className="visually-hidden">{productCount} items</span>
        <span className="category-tile__meta">{category.vibe}</span>
      </span>
    </button>
  );
}
