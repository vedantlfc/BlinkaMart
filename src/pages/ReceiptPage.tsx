import { useEffect, useLayoutEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/Button";
import { EmptyState } from "../components/EmptyState";
import { PageHeader } from "../components/PageHeader";
import { Toast } from "../components/Toast";
import { useOrder, type OrderSnapshot } from "../state/order";
import {
  getPrimaryBadgeNameForOrder,
  getProjectedReceiptProgress,
  useReceiptProgress,
  type ReceiptProgressState,
} from "../state/receiptProgress";

function formatOrderTime(timestamp: string) {
  const date = new Date(timestamp);

  if (Number.isNaN(date.getTime())) {
    return "Just now";
  }

  return date.toLocaleString([], {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function getItemCountLabel(totalQuantity: number) {
  return totalQuantity === 1 ? "1 item" : `${totalQuantity} items`;
}

function getStreakCopy(streak: number) {
  return streak === 1 ? "1-day restraint streak" : `${streak}-day restraint streak`;
}

function getAvoidedItemSummary(items: OrderSnapshot["items"]) {
  const visibleItems = items
    .slice(0, 3)
    .map((item) => (item.quantity > 1 ? `${item.name} x${item.quantity}` : item.name));
  const remainingCount = items.length - visibleItems.length;

  if (remainingCount > 0) {
    return `${visibleItems.join(", ")} +${remainingCount} more`;
  }

  return visibleItems.join(", ");
}

function getDeliveryOutcomeCopy(order: OrderSnapshot) {
  return order.tracking.trackingOutcome === "lost"
    ? "Lost near Self Control Signal"
    : "Arrived at character development";
}

function buildShareText(
  order: OrderSnapshot,
  badge: string,
  progress: ReceiptProgressState,
) {
  const lines = [
    "Successfully Not Ordered on BlinkaMart.",
    `Badge unlocked: ${badge}.`,
    `Saved Rs ${order.totalPrice} by avoiding ${getItemCountLabel(order.totalQuantity)}.`,
    `Delivery outcome: ${getDeliveryOutcomeCopy(order)}.`,
    `Streak: ${getStreakCopy(progress.currentStreak)}.`,
  ];

  if (order.showCalories) {
    lines.push(`Calories avoided: ${order.totalCalories}.`);
  }

  lines.push("The receipt ceremony remains delightfully private.");
  return lines.join(" ");
}

function isShareAbortError(error: unknown) {
  if (
    typeof DOMException !== "undefined" &&
    error instanceof DOMException &&
    error.name === "AbortError"
  ) {
    return true;
  }

  return (
    typeof error === "object" &&
    error !== null &&
    "name" in error &&
    (error as { name?: unknown }).name === "AbortError"
  );
}

export function ReceiptPage() {
  const orderState = useOrder();
  const receiptProgress = useReceiptProgress();
  const navigate = useNavigate();
  const [toast, setToast] = useState<{ message: string; tone: "info" | "success" }>({
    message: "",
    tone: "info",
  });
  const [showShareFallback, setShowShareFallback] = useState(false);
  const order =
    orderState.currentOrder?.status === "completed" ? orderState.currentOrder : null;
  const displayedProgress = useMemo(
    () =>
      order
        ? getProjectedReceiptProgress(receiptProgress.progress, order)
        : receiptProgress.progress,
    [order, receiptProgress.progress],
  );
  const badge = useMemo(
    () => (order ? getPrimaryBadgeNameForOrder(displayedProgress, order.id) : ""),
    [displayedProgress, order],
  );
  const shareText = useMemo(
    () => (order ? buildShareText(order, badge, displayedProgress) : ""),
    [badge, displayedProgress, order],
  );
  const avoidedItemSummary = useMemo(
    () => (order ? getAvoidedItemSummary(order.items) : ""),
    [order],
  );
  const deliveryOutcome = useMemo(
    () => (order ? getDeliveryOutcomeCopy(order) : ""),
    [order],
  );
  const shareButtonLabel =
    typeof navigator !== "undefined" && typeof navigator.share === "function"
      ? "Share Receipt"
      : "Copy Receipt";

  useLayoutEffect(() => {
    if (order) {
      const resetScroll = () => {
        window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      };
      const previousScrollRestoration = window.history.scrollRestoration;

      window.history.scrollRestoration = "manual";
      resetScroll();

      const animationFrameId = window.requestAnimationFrame(resetScroll);
      const timeoutId = window.setTimeout(resetScroll, 0);

      return () => {
        window.cancelAnimationFrame(animationFrameId);
        window.clearTimeout(timeoutId);
        window.history.scrollRestoration = previousScrollRestoration;
      };
    }

    return undefined;
  }, [order?.id]);

  useEffect(() => {
    if (order) {
      receiptProgress.recordCompletedOrder(order);
    }
  }, [order, receiptProgress]);

  useEffect(() => {
    if (!toast.message) {
      return undefined;
    }

    const timeoutId = window.setTimeout(
      () => setToast((currentToast) => ({ ...currentToast, message: "" })),
      3200,
    );
    return () => window.clearTimeout(timeoutId);
  }, [toast.message]);

  function showToast(message: string, tone: "info" | "success" = "info") {
    setToast({ message, tone });
  }

  async function handleShareReceipt() {
    if (!shareText) {
      return;
    }

    setShowShareFallback(false);

    if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
      try {
        await navigator.share({
          title: "BlinkaMart receipt",
          text: shareText,
        });
        showToast("Share sheet opened.", "success");
        return;
      } catch (error) {
        if (isShareAbortError(error)) {
          setShowShareFallback(false);
          showToast("Share cancelled. Receipt stayed yours.");
          return;
        }
        // Non-cancel share failures fall through to copy support.
      }
    }

    if (
      typeof navigator !== "undefined" &&
      navigator.clipboard &&
      typeof navigator.clipboard.writeText === "function"
    ) {
      try {
        await navigator.clipboard.writeText(shareText);
        showToast("Receipt copied. Go cause mild confusion.", "success");
        return;
      } catch {
        // Fall through to the visible text fallback.
      }
    }

    setShowShareFallback(true);
    showToast("Could not copy, but the receipt is still yours.");
  }

  return (
    <div className="receipt-page">
      <PageHeader
        title="Receipt ready."
        subtitle="A tiny trophy for catching the craving in time."
        trailing={<span className="status-dot">Receipt ready</span>}
      />

      {!order ? (
        <section className="receipt-empty-section" aria-label="No receipt">
          <EmptyState
            title="No receipt yet."
            message="There is no completed tracking flow to summarize right now."
          />
          <Button type="button" onClick={() => navigate("/products")}>
            Browse Shelf
          </Button>
        </section>
      ) : (
        <>
          <section className="receipt-card receipt-card--poster" aria-labelledby="receipt-status-title">
            <div className="receipt-status-band">
              <span className="section-kicker">BlinkaMart receipt</span>
              <h2 id="receipt-status-title">Successfully Not Ordered</h2>
              <span className="receipt-badge">Badge unlocked: {badge}</span>
              <p>
                The craving got a full ceremony, then took a graceful bow.
              </p>
            </div>

            <div className="receipt-poster-items">
              <span>Items left on stage</span>
              <strong>{avoidedItemSummary}</strong>
            </div>

            <div className="receipt-outcome">
              <span>Delivery outcome</span>
              <strong>{deliveryOutcome}</strong>
            </div>

            <dl className="receipt-meta-grid" aria-label="Order details">
              <div>
                <dt>Order ID</dt>
                <dd>{order.id}</dd>
              </div>
              <div>
                <dt>Completed</dt>
                <dd>{formatOrderTime(order.timestamp)}</dd>
              </div>
            </dl>

            <dl className="receipt-impact-grid" aria-label="Receipt impact">
              <div>
                <dt>Rs saved</dt>
                <dd>Rs {order.totalPrice}</dd>
              </div>
              <div>
                <dt>Items avoided</dt>
                <dd>{order.totalQuantity}</dd>
              </div>
              {order.showCalories ? (
                <div>
                  <dt>Calories avoided</dt>
                  <dd>{order.totalCalories}</dd>
                </div>
              ) : null}
              <div>
                <dt>Regret avoided</dt>
                <dd>{order.averageRegretScore}/100 avg</dd>
              </div>
              <div>
                <dt>Streak</dt>
                <dd>{displayedProgress.currentStreak}</dd>
              </div>
            </dl>
          </section>

          <section className="receipt-items-section" aria-labelledby="receipt-items-title">
            <div className="section-heading">
              <span className="section-kicker">Avoided items</span>
              <h2 id="receipt-items-title">Items left on the stage</h2>
              <p>Compact proof for the cart that chose applause over chaos.</p>
            </div>

            <ol className="receipt-item-list">
              {order.items.map((item) => (
                <li className="receipt-item-row" key={item.productId}>
                  <div>
                    <span>{item.categoryName}</span>
                    <strong>{item.name}</strong>
                  </div>
                  <small>
                    {item.quantity} x Rs {item.price}
                  </small>
                </li>
              ))}
            </ol>
          </section>

          <section className="receipt-progress-panel" aria-label="Receipt progress">
            <div>
              <span className="section-kicker">Streak</span>
              <h2>{getStreakCopy(displayedProgress.currentStreak)}</h2>
              <p>
                {displayedProgress.totalCompletedOrders} orders avoided in
                total. Same-day wins count, but the daily streak stays honest.
              </p>
            </div>
            <span className="receipt-progress-mark">{displayedProgress.currentStreak}</span>
          </section>

          <section className="receipt-share-panel" aria-labelledby="receipt-share-title">
            <div className="section-heading">
              <span className="section-kicker">Share</span>
              <h2 id="receipt-share-title">Cause mild confusion responsibly</h2>
              <p>
                Share text stays short, odd, and free of private details.
              </p>
            </div>

            <Button type="button" onClick={handleShareReceipt}>
              {shareButtonLabel}
            </Button>

            {showShareFallback ? (
              <p
                className="receipt-share-fallback"
                role="textbox"
                aria-readonly="true"
                tabIndex={0}
              >
                {shareText}
              </p>
            ) : null}
          </section>

          <div className="cart-cta-row" aria-label="Receipt actions">
            <Button type="button" onClick={() => navigate("/products")}>
              Browse Shelf
            </Button>
            <Button type="button" variant="secondary" onClick={() => navigate("/progress")}>
              View Progress
            </Button>
            <Button type="button" variant="ghost" onClick={() => navigate("/cart")}>
              Back to Cart
            </Button>
          </div>

          <Toast message={toast.message} tone={toast.tone} visible={Boolean(toast.message)} />
        </>
      )}
    </div>
  );
}
