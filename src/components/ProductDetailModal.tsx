import {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { createPortal } from "react-dom";
import { Button } from "./Button";
import type { Product } from "../data/catalog";

export interface ProductDetailTransitionRect {
  height: number;
  left: number;
  top: number;
  width: number;
}

export interface ProductDetailOpenTransitionSource {
  detailsRect: ProductDetailTransitionRect;
  mediaRect: ProductDetailTransitionRect;
}

export interface ProductDetailModalProps {
  product: Product;
  categoryName: string;
  quantity: number;
  showCalories: boolean;
  openTransitionSource?: ProductDetailOpenTransitionSource | null;
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
    .filter((keyword) => keyword.length > 2);
}

const MAX_METADATA_CHIPS = 5;

interface MetadataChip {
  label: string;
  hiddenText?: string;
}

function getMetadataChips(product: Product, showCalories: boolean) {
  const coreChips: MetadataChip[] = [
    ...(showCalories ? [{ label: `${product.calories} cal` }] : []),
    { label: formatAvailability(product.availabilityStatus) },
    { label: `Shelf: ${product.tag ?? product.subcategory}` },
  ];
  const keywordChips: MetadataChip[] = getVisibleKeywords(product).map((keyword) => ({
    label: `#${keyword}`,
  }));
  const availableKeywordSlots = MAX_METADATA_CHIPS - coreChips.length;

  if (availableKeywordSlots <= 0) {
    return coreChips.slice(0, MAX_METADATA_CHIPS);
  }

  if (keywordChips.length <= availableKeywordSlots) {
    return [...coreChips, ...keywordChips];
  }

  const visibleKeywordSlots = Math.max(0, availableKeywordSlots - 1);
  const visibleKeywords = keywordChips.slice(0, visibleKeywordSlots);
  const hiddenKeywords = keywordChips.slice(visibleKeywordSlots);
  const hiddenLabels = hiddenKeywords.map((chip) => chip.label);

  return [
    ...coreChips,
    ...visibleKeywords,
    {
      label: `+${hiddenKeywords.length}`,
      hiddenText: `Additional tags: ${hiddenLabels.join(", ")}`,
    },
  ];
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

function getPlainRect(rect: DOMRect): ProductDetailTransitionRect {
  return {
    height: rect.height,
    left: rect.left,
    top: rect.top,
    width: rect.width,
  };
}

function shouldReduceMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

type SharedTransitionPhase = "start" | "end";

interface SharedTransitionState {
  mediaFrom: ProductDetailTransitionRect;
  mediaTo: ProductDetailTransitionRect;
  phase: SharedTransitionPhase;
  surfaceFrom: ProductDetailTransitionRect;
  surfaceTo: ProductDetailTransitionRect;
}

function getTransitionRectStyle(rect: ProductDetailTransitionRect): CSSProperties {
  return {
    height: `${rect.height}px`,
    transform: `translate3d(${rect.left}px, ${rect.top}px, 0)`,
    width: `${rect.width}px`,
  };
}

function ProductDetailTransitionLayer({
  imageAlt,
  imageSrc,
  transition,
}: {
  imageAlt: string;
  imageSrc: string;
  transition: SharedTransitionState;
}) {
  const surfaceRect =
    transition.phase === "start" ? transition.surfaceFrom : transition.surfaceTo;
  const mediaRect = transition.phase === "start" ? transition.mediaFrom : transition.mediaTo;

  return (
    <div className="product-detail-transition-layer" aria-hidden="true">
      <div
        className="product-detail-transition-layer__surface"
        style={getTransitionRectStyle(surfaceRect)}
      />
      <div
        className="product-detail-transition-layer__media"
        style={getTransitionRectStyle(mediaRect)}
      >
        <img src={imageSrc} alt={imageAlt} />
      </div>
    </div>
  );
}

export function ProductDetailModal({
  product,
  categoryName,
  quantity,
  showCalories,
  openTransitionSource = null,
  onClose,
  onAdd,
  onIncrement,
  onDecrement,
}: ProductDetailModalProps) {
  const titleId = useId();
  const descriptionId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const surfaceRef = useRef<HTMLElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);
  const requestCloseRef = useRef<() => void>(() => {});
  const closeTimeoutRef = useRef<number | null>(null);
  const closingRef = useRef(false);
  const [isClosing, setIsClosing] = useState(false);
  const [sharedTransition, setSharedTransition] =
    useState<SharedTransitionState | null>(null);
  const [sharedTransitionEnabled, setSharedTransitionEnabled] = useState(
    () => Boolean(openTransitionSource) && !shouldReduceMotion(),
  );
  const [sharedTransitionSettled, setSharedTransitionSettled] = useState(
    () => !openTransitionSource || shouldReduceMotion(),
  );
  const inCart = quantity > 0;
  const imageAlt = product.fullName || `${product.brandName} ${product.name}`;
  const metadataChips = getMetadataChips(product, showCalories);
  const modalClasses = [
    "product-detail-modal",
    sharedTransitionEnabled && !sharedTransitionSettled
      ? "product-detail-modal--shared-opening"
      : "",
    sharedTransitionEnabled && sharedTransitionSettled
      ? "product-detail-modal--shared-settled"
      : "",
    isClosing ? "product-detail-modal--closing" : "",
  ]
    .filter(Boolean)
    .join(" ");

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  function requestClose() {
    if (closingRef.current) {
      return;
    }

    if (shouldReduceMotion()) {
      onCloseRef.current();
      return;
    }

    closingRef.current = true;
    setIsClosing(true);
    closeTimeoutRef.current = window.setTimeout(() => {
      onCloseRef.current();
    }, 170);
  }

  useEffect(() => {
    requestCloseRef.current = requestClose;
  });

  useLayoutEffect(() => {
    if (
      !openTransitionSource ||
      shouldReduceMotion() ||
      !surfaceRef.current ||
      !mediaRef.current
    ) {
      setSharedTransition(null);
      setSharedTransitionEnabled(false);
      setSharedTransitionSettled(true);
      return undefined;
    }

    const nextTransition: SharedTransitionState = {
      mediaFrom: openTransitionSource.mediaRect,
      mediaTo: getPlainRect(mediaRef.current.getBoundingClientRect()),
      phase: "start",
      surfaceFrom: openTransitionSource.detailsRect,
      surfaceTo: getPlainRect(surfaceRef.current.getBoundingClientRect()),
    };

    let firstFrame = 0;
    let secondFrame = 0;
    let settleTimeout = 0;

    setSharedTransitionEnabled(true);
    setSharedTransitionSettled(false);
    setSharedTransition(nextTransition);

    firstFrame = window.requestAnimationFrame(() => {
      secondFrame = window.requestAnimationFrame(() => {
        setSharedTransition((currentTransition) =>
          currentTransition ? { ...currentTransition, phase: "end" } : currentTransition,
        );
        settleTimeout = window.setTimeout(() => {
          setSharedTransition(null);
          setSharedTransitionSettled(true);
        }, 340);
      });
    });

    return () => {
      window.cancelAnimationFrame(firstFrame);
      window.cancelAnimationFrame(secondFrame);
      window.clearTimeout(settleTimeout);
    };
  }, [openTransitionSource, product.imageSrc]);

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
    dialogRef.current
      ?.querySelector<HTMLButtonElement>(".product-detail-modal__close")
      ?.focus({ preventScroll: true });
    if (!dialogRef.current?.contains(document.activeElement)) {
      dialogRef.current?.focus({ preventScroll: true });
    }

    if (rootElement) {
      rootElement.inert = true;
      rootElement.setAttribute("inert", "");
      rootElement.setAttribute("aria-hidden", "true");
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        requestCloseRef.current();
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
      if (closeTimeoutRef.current !== null) {
        window.clearTimeout(closeTimeoutRef.current);
      }
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
    <div className={modalClasses} onClick={requestClose}>
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
            onClick={requestClose}
            aria-label={`Close details for ${product.name}`}
          >
            <span aria-hidden="true">&times;</span>
          </Button>
        </header>

        <section
          className="product-detail-modal__surface"
          aria-label={`${product.name} craving report`}
          ref={surfaceRef}
        >
          <div className="product-detail-modal__media" ref={mediaRef}>
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
              <span
                className="product-detail-modal__chip"
                key={chip.label}
              >
                {chip.label}
                {chip.hiddenText ? (
                  <span className="visually-hidden"> {chip.hiddenText}</span>
                ) : null}
              </span>
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
      {sharedTransition ? (
        <ProductDetailTransitionLayer
          imageAlt={imageAlt}
          imageSrc={product.imageSrc}
          transition={sharedTransition}
        />
      ) : null}
    </div>
  );

  return createPortal(modal, document.body);
}
