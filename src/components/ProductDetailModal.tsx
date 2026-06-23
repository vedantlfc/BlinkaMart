import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
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
    .slice(0, 3);
}

function getFocusableElements(container: HTMLElement) {
  const selectors = [
    "a[href]",
    "button:not([disabled])",
    "input:not([disabled])",
    "select:not([disabled])",
    "textarea:not([disabled])",
    "[tabindex]:not([tabindex='-1'])",
  ].join(",");

  return Array.from(container.querySelectorAll<HTMLElement>(selectors))
    .filter((element) => element.offsetParent !== null);
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
  const dialogRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);
  const inCart = quantity > 0;
  const imageAlt = product.fullName || `${product.brandName} ${product.name}`;
  const visibleKeywords = getVisibleKeywords(product);
  const metadataChips = [
    showCalories ? `${product.calories} cal` : null,
    formatAvailability(product.availabilityStatus),
    `Shelf: ${product.tag ?? product.subcategory}`,
    ...visibleKeywords.map((keyword) => `#${keyword}`),
  ].filter((chip): chip is string => Boolean(chip));

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    const previouslyFocusedElement =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const rootElement = document.getElementById("root");
    const previousRootInert = rootElement?.inert ?? false;
    const rootHadInertAttribute = rootElement?.hasAttribute("inert") ?? false;
    const rootHadAriaHidden = rootElement?.hasAttribute("aria-hidden") ?? false;
    const previousRootAriaHidden = rootElement?.getAttribute("aria-hidden") ?? null;

    document.body.style.overflow = "hidden";
    if (rootElement) {
      rootElement.inert = true;
      rootElement.setAttribute("inert", "");
      rootElement.setAttribute("aria-hidden", "true");
    }

    dialogRef.current
      ?.querySelector<HTMLButtonElement>(".product-detail-modal__close")
      ?.focus({ preventScroll: true });

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onCloseRef.current();
        return;
      }

      if (event.key !== "Tab" || !dialogRef.current) {
        return;
      }

      const focusableElements = getFocusableElements(dialogRef.current);

      if (focusableElements.length === 0) {
        event.preventDefault();
        dialogRef.current.focus({ preventScroll: true });
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus({ preventScroll: true });
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus({ preventScroll: true });
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      if (rootElement) {
        rootElement.inert = previousRootInert;
        if (rootHadInertAttribute) {
          rootElement.setAttribute("inert", "");
        } else {
          rootElement.removeAttribute("inert");
        }

        if (rootHadAriaHidden && previousRootAriaHidden !== null) {
          rootElement.setAttribute("aria-hidden", previousRootAriaHidden);
        } else {
          rootElement.removeAttribute("aria-hidden");
        }
      }
      window.removeEventListener("keydown", handleKeyDown);
      if (previouslyFocusedElement?.isConnected) {
        previouslyFocusedElement.focus({ preventScroll: true });
      }
    };
  }, []);

  const modal = (
    <div className="product-detail-modal" onClick={onClose}>
      <div
        aria-describedby={descriptionId}
        aria-labelledby={titleId}
        aria-modal="true"
        className="product-detail-modal__dialog"
        onClick={(event) => event.stopPropagation()}
        ref={dialogRef}
        role="dialog"
        tabIndex={-1}
      >
        <header className="product-detail-modal__header">
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
            <span aria-hidden="true">&times;</span>
          </Button>
        </header>

        <section className="product-detail-modal__surface" aria-label={`${product.name} craving report`}>
          <div className="product-detail-modal__media">
            <img src={product.imageSrc} alt={imageAlt} />
          </div>
          <div className="product-detail-modal__copy">
            <span className="product-detail-modal__eyebrow">Craving report</span>
            <span className="product-detail-modal__headline">
              {product.detailCopy.headline}
            </span>
            <p id={descriptionId}>{product.detailCopy.description}</p>
          </div>
        </section>

        <dl className="product-detail-modal__stats" aria-label={`${product.name} key stats`}>
          <div>
            <dt>Price</dt>
            <dd>Rs {product.price}</dd>
          </div>
          <div>
            <dt>Regret</dt>
            <dd>{product.regretScore}/100</dd>
          </div>
        </dl>

        {metadataChips.length > 0 ? (
          <div className="product-detail-modal__metadata" aria-label="Product metadata">
            {metadataChips.map((chip) => (
              <span className="product-detail-modal__chip" key={chip}>{chip}</span>
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
              Add to Cart - Rs {product.price}
            </Button>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}
