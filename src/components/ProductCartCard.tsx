import { Button } from "./Button";
import type { Product } from "../data/catalog";

export interface ProductCartCardProps {
  product: Product;
  categoryName: string;
  quantity: number;
  onAdd: () => void;
  onIncrement: () => void;
  onDecrement: () => void;
  onRemove: () => void;
}

export function ProductCartCard({
  product,
  categoryName,
  quantity,
  onAdd,
  onIncrement,
  onDecrement,
  onRemove,
}: ProductCartCardProps) {
  const inCart = quantity > 0;

  return (
    <article className={["product-card", inCart ? "product-card--in-cart" : ""].filter(Boolean).join(" ")}>
      <div className="product-card__header">
        <div>
          <span className="product-card__category">{categoryName}</span>
          <h3>{product.name}</h3>
        </div>
        {product.tag ? <span className="product-card__tag">{product.tag}</span> : null}
      </div>

      <p>{product.subtitle}</p>

      <dl className="product-card__stats" aria-label={`${product.name} fake stats`}>
        <div>
          <dt>Fake price</dt>
          <dd>Rs {product.price}</dd>
        </div>
        <div>
          <dt>Calories</dt>
          <dd>{product.calories}</dd>
        </div>
        <div>
          <dt>Regret</dt>
          <dd>{product.regretScore}/100</dd>
        </div>
      </dl>

      {inCart ? (
        <div className="cart-controls" aria-label={`${product.name} quantity controls`}>
          <Button
            type="button"
            variant="secondary"
            size="compact"
            onClick={onDecrement}
            aria-label={`Decrease ${product.name} quantity`}
          >
            -
          </Button>
          <span className="cart-controls__quantity" aria-label={`${quantity} in fake cart`}>
            {quantity}
          </span>
          <Button
            type="button"
            variant="secondary"
            size="compact"
            onClick={onIncrement}
            aria-label={`Increase ${product.name} quantity`}
          >
            +
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="compact"
            onClick={onRemove}
            aria-label={`Remove ${product.name} from fake cart`}
          >
            Remove
          </Button>
        </div>
      ) : (
        <Button
          type="button"
          variant="primary"
          size="compact"
          onClick={onAdd}
          aria-label={`Add ${product.name} to fake cart`}
        >
          Add
        </Button>
      )}
    </article>
  );
}
