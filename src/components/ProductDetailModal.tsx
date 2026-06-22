import { useEffect, useId } from "react";
import { Button } from "./Button";
import type { Product } from "../data/catalog";

export interface ProductDetailModalProps {
  product: Product;
  categoryName: string;
  quantity: number;
  showCalories: boolean;
  onClose: () => void;
  onAdd: () => void;
  onIncrement: () => void;
  onDecrement: () => void;
}

function formatAvailability(value: string) {
  if (!value.trim()) {
    return "Available";
  }

  return value
    .split(/[\s_-]+/)
    .filter(Boolean)
    .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1).toLowerCase()}`)
    .join(" ");
}

function getVisibleKeywords(product: Product) {
  return product.searchKeywords
    .filter((keyword) => keyword.length > 2)
    .slice(0, 5);
}

export function ProductDetailModal({
  product,
  categoryName,
  quantity,
  showCalories,
  onClose,
  onAdd,
  onIncrement,
  onDecrement,
}: ProductDetailModalProps) {
  const titleId = useId();
  const descriptionId = useId();
  const inCart = quantity > 0;
  const imageAlt = product.fullName || `${product.brandName} ${product.name}`;
  const visibleKeywords = getVisibleKeywords(product);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return (
    <div className="product-detail-modal" onClick={onClose}>
      <div
        aria-describedby={descriptionId}
        aria-labelledby={titleId}
        aria-modal="true"
        className="product-detail-modal__dialog"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
      >
        <div className="product-detail-modal__header">
          <div>
            <span className="section-kicker">{categoryName}</span>
            <h2 id={titleId}>{product.name}</h2>
            <p>{product.brandName} - {product.subcategory}</p>
          </div>
          <Button
            type="button"
            analyticsName="product_details_close"
            className="product-detail-modal__close"
            variant="ghost"
            size="compact"
            onClick={onClose}
            aria-label={`Close details for ${product.name}`}
          >
            Close
          </Button>
        </div>

        <div className="product-detail-modal__hero">
          <div className="product-detail-modal__media">
            <img src={product.imageSrc} alt={imageAlt} />
          </div>
          <div className="product-detail-modal__copy">
            <span className="product-detail-modal__headline">
              {product.detailCopy.headline}
            </span>
            <p id={descriptionId}>{product.detailCopy.description}</p>
          </div>
        </div>

        <dl className="product-detail-modal__attributes" aria-label={`${product.name} attributes`}>
          <div>
            <dt>Price</dt>
            <dd>Rs {product.price}</dd>
          </div>
          <div>
            <dt>Regret</dt>
            <dd>{product.regretScore}/100</dd>
          </div>
          {showCalories ? (
            <div>
              <dt>Calories</dt>
              <dd>{product.calories}</dd>
            </div>
          ) : null}
          <div>
            <dt>Status</dt>
            <dd>{formatAvailability(product.availabilityStatus)}</dd>
          </div>
          <div>
            <dt>Shelf</dt>
            <dd>{product.tag ?? product.subcategory}</dd>
          </div>
        </dl>

        {visibleKeywords.length > 0 ? (
          <div className="product-detail-modal__tags" aria-label="Craving tags">
            {visibleKeywords.map((keyword) => (
              <span key={keyword}>#{keyword}</span>
            ))}
          </div>
        ) : null}

        <div className="product-detail-modal__actions">
          {inCart ? (
            <div
              className="cart-controls"
              aria-label={`${product.name} quantity controls`}
            >
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
              analyticsName="product_detail_add"
              onClick={onAdd}
              aria-label={`Add ${product.name} to cart`}
            >
              Add to Cart
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
