import { Button } from "./Button";
import type { Product } from "../data/catalog";

export interface ProductCartCardProps {
  product: Product;
  categoryName: string;
  quantity: number;
  onAdd: () => void;
  onIncrement: () => void;
  onDecrement: () => void;
  showCalories?: boolean;
}

export function ProductCartCard({
  product,
  categoryName,
  quantity,
  onAdd,
  onIncrement,
  onDecrement,
  showCalories = true,
}: ProductCartCardProps) {
  const inCart = quantity > 0;
  const imageAlt = product.fullName || `${product.brandName} ${product.name}`;

  return (
    <article className={["product-card", inCart ? "product-card--in-cart" : ""].filter(Boolean).join(" ")}>
      <div className="product-card__top">
        <div className="product-card__media">
          <img src={product.imageSrc} alt={imageAlt} loading="lazy" />
        </div>

        <div className="product-card__body">
          <div className="product-card__header">
            <div>
              <span className="product-card__category">{categoryName}</span>
              <h3>{product.name}</h3>
              <span className="product-card__meta">
                {product.brandName}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="product-card__price-row">
        <strong>Rs {product.price}</strong>
        {product.tag ? <span className="product-card__tag">{product.tag}</span> : null}
      </div>

      <div className="product-card__stat-strip" aria-label={`${product.name} stats`}>
        <span>Regret {product.regretScore}</span>
        {showCalories ? (
          <span>{product.calories} cal</span>
        ) : null}
      </div>

      {inCart ? (
        <div className="cart-controls" aria-label={`${product.name} quantity controls`}>
          <Button
            type="button"
            analyticsName="product_decrement"
            variant="secondary"
            size="compact"
            onClick={onDecrement}
            aria-label={`Decrease ${product.name} quantity`}
          >
            -
          </Button>
          <span className="cart-controls__quantity" aria-label={`${quantity} in cart`}>
            {quantity}
          </span>
          <Button
            type="button"
            analyticsName="product_increment"
            variant="secondary"
            size="compact"
            onClick={onIncrement}
            aria-label={`Increase ${product.name} quantity`}
          >
            +
          </Button>
        </div>
      ) : (
        <Button
          type="button"
          analyticsName="product_add"
          variant="primary"
          size="compact"
          onClick={onAdd}
          aria-label={`Add ${product.name} to cart`}
        >
          Add
        </Button>
      )}
    </article>
  );
}
