import { Button } from "./Button";
import type { Product } from "../data/catalog";

export interface ProductPreviewCardProps {
  product: Product;
  categoryName: string;
  showCalories?: boolean;
}

export function ProductPreviewCard({
  product,
  categoryName,
  showCalories = true,
}: ProductPreviewCardProps) {
  return (
    <article className="product-card">
      <div className="product-card__header">
        <div>
          <span className="product-card__category">{categoryName}</span>
          <h3>{product.name}</h3>
        </div>
        {product.tag ? <span className="product-card__tag">{product.tag}</span> : null}
      </div>

      <p>{product.subtitle}</p>

      <dl className="product-card__stats" aria-label={`${product.name} stats`}>
        <div>
          <dt>Price</dt>
          <dd>Rs {product.price}</dd>
        </div>
        {showCalories ? (
          <div>
            <dt>Calories</dt>
            <dd>{product.calories}</dd>
          </div>
        ) : null}
        <div>
          <dt>Regret</dt>
          <dd>{product.regretScore}/100</dd>
        </div>
      </dl>

      <Button type="button" variant="secondary" size="compact" disabled>
        Add on Products page
      </Button>
    </article>
  );
}
