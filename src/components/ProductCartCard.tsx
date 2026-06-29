import { useEffect, useRef, useState, type MouseEvent } from "react";
import { Button } from "./Button";
import type { Product } from "../data/catalog";
import type { ProductDetailOpenTransitionSource } from "./ProductDetailModal";
import { prepareProductDetailPopSound } from "../utils/productDetailSound";

export interface ProductCartCardProps {
  product: Product;
  categoryName: string;
  quantity: number;
  onAdd: (source: ProductCartAddSource) => void;
  onIncrement: () => void;
  onDecrement: () => void;
  onOpenDetails?: (source: ProductDetailOpenTransitionSource) => void;
  showCalories?: boolean;
}

export interface ProductCartAddSource {
  mediaRect: ProductDetailOpenTransitionSource["mediaRect"];
}

function getPlainRect(rect: DOMRect) {
  return {
    height: rect.height,
    left: rect.left,
    top: rect.top,
    width: rect.width,
  };
}

export function ProductCartCard({
  product,
  categoryName,
  quantity,
  onAdd,
  onIncrement,
  onDecrement,
  onOpenDetails,
  showCalories = true,
}: ProductCartCardProps) {
  const [cartPulse, setCartPulse] = useState(false);
  const previousQuantityRef = useRef(quantity);
  const detailsRef = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const inCart = quantity > 0;
  const imageAlt = product.fullName || `${product.brandName} ${product.name}`;

  useEffect(() => {
    if (previousQuantityRef.current === quantity) {
      return;
    }

    previousQuantityRef.current = quantity;

    if (quantity <= 0) {
      setCartPulse(false);
      return;
    }

    setCartPulse(false);
    const frameId = window.requestAnimationFrame(() => setCartPulse(true));
    const timeoutId = window.setTimeout(() => setCartPulse(false), 340);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.clearTimeout(timeoutId);
    };
  }, [quantity]);

  function handleDetailsClick(event: MouseEvent<HTMLButtonElement>) {
    if (!onOpenDetails) {
      return;
    }

    const fallbackRect = getPlainRect(event.currentTarget.getBoundingClientRect());
    prepareProductDetailPopSound();
    onOpenDetails({
      detailsRect: detailsRef.current
        ? getPlainRect(detailsRef.current.getBoundingClientRect())
        : fallbackRect,
      mediaRect: mediaRef.current
        ? getPlainRect(mediaRef.current.getBoundingClientRect())
        : fallbackRect,
    });
  }

  function handleAddClick(event: MouseEvent<HTMLButtonElement>) {
    const fallbackRect = getPlainRect(event.currentTarget.getBoundingClientRect());

    onAdd({
      mediaRect: mediaRef.current
        ? getPlainRect(mediaRef.current.getBoundingClientRect())
        : fallbackRect,
    });
  }

  return (
    <article
      className={[
        "product-card",
        inCart ? "product-card--in-cart" : "",
        cartPulse ? "product-card--cart-pulse" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="product-card__details" ref={detailsRef}>
        {onOpenDetails ? (
          <button
            type="button"
            className="product-card__details-trigger"
            onClick={handleDetailsClick}
            aria-label={`View details for ${product.name}`}
          />
        ) : null}

        <div className="product-card__top">
          <div className="product-card__media" ref={mediaRef}>
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
      </div>

      <div className="product-card__actions">
        {inCart ? (
          <div className="product-card__action-state" key="quantity">
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
          </div>
        ) : (
          <div className="product-card__action-state" key="add">
            <Button
              type="button"
              analyticsName="product_add"
              variant="primary"
              size="compact"
              onClick={handleAddClick}
              aria-label={`Add ${product.name} to cart`}
            >
              Add
            </Button>
          </div>
        )}
      </div>
    </article>
  );
}
