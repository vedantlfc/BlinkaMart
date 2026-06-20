import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { toBlob } from "html-to-image";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/Button";
import { EmptyState } from "../components/EmptyState";
import { PageHeader } from "../components/PageHeader";
import { ShareReceiptPoster } from "../components/ShareReceiptPoster";
import { Toast } from "../components/Toast";
import { getOrderCompletionTimestamp, useOrder, type OrderSnapshot } from "../state/order";
import {
  getPrimaryBadgeNameForOrder,
  getProjectedReceiptProgress,
  useReceiptProgress,
  type ReceiptProgressState,
} from "../state/receiptProgress";
import { getPublicAppUrl } from "../utils/publicAppUrl";

const POSTER_BACKGROUND_COLOR = "#130f22";
const POSTER_EXPORT_WIDTH = 1080;
const POSTER_EXPORT_HEIGHT = 1350;
const POSTER_SOURCE_WIDTH = 360;
const POSTER_SOURCE_HEIGHT = 450;
const POSTER_EXPORT_SCALE = 3;
const POSTER_GENERATION_TIMEOUT_MS = 4500;
const POSTER_IMAGE_WAIT_MS = 1200;
const TRANSPARENT_IMAGE_PLACEHOLDER =
  "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";

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
  progress: ReceiptProgressState,
  publicAppUrl: string,
) {
  const lines = [
    `I successfully did not order on DopeCart.`,
    `Rs ${order.totalPrice} saved by avoiding ${getItemCountLabel(order.totalQuantity)}.`,
    "Regret avoided.",
    "Dopamine delivered anyway.",
    `Outcome: ${getDeliveryOutcomeCopy(order)}.`,
    `Streak: ${getStreakCopy(progress.currentStreak)}.`,
  ];

  if (order.showCalories) {
    lines.push(`Calories avoided: ${order.totalCalories}.`);
  }

  lines.push(`Try it: ${publicAppUrl}`);
  return lines.join(" ");
}

function getPosterFileName(orderId: string) {
  return `dopecart-receipt-${orderId.replace(/[^a-z0-9-]/gi, "-").toLowerCase()}.png`;
}

async function createPosterFile(node: HTMLElement, orderId: string) {
  await waitForPosterImages(node);

  const blob = await toBlob(node, {
    backgroundColor: POSTER_BACKGROUND_COLOR,
    cacheBust: false,
    height: POSTER_SOURCE_HEIGHT,
    imagePlaceholder: TRANSPARENT_IMAGE_PLACEHOLDER,
    pixelRatio: POSTER_EXPORT_SCALE,
    skipFonts: true,
    style: {
      height: `${POSTER_SOURCE_HEIGHT}px`,
      maxWidth: "none",
      width: `${POSTER_SOURCE_WIDTH}px`,
    },
    width: POSTER_SOURCE_WIDTH,
  });

  if (!blob) {
    throw new Error("Poster image was empty.");
  }

  return new File([blob], getPosterFileName(orderId), { type: "image/png" });
}

function delay(ms: number) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

async function withTimeout<T>(promise: Promise<T>, ms: number, message: string) {
  let timeoutId = 0;

  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = window.setTimeout(() => reject(new Error(message)), ms);
  });

  try {
    return await Promise.race([promise, timeoutPromise]);
  } finally {
    window.clearTimeout(timeoutId);
  }
}

async function waitForPosterImages(node: HTMLElement) {
  const images = Array.from(node.querySelectorAll("img"));

  if (images.length === 0) {
    return;
  }

  const imagePromises = images.map(
    (image) =>
      new Promise<void>((resolve) => {
        if (image.complete && image.naturalWidth > 0) {
          resolve();
          return;
        }

        if (typeof image.decode === "function") {
          image.decode().then(resolve).catch(resolve);
          return;
        }

        const finish = () => resolve();
        image.addEventListener("load", finish, { once: true });
        image.addEventListener("error", finish, { once: true });
      }),
  );

  await Promise.race([Promise.all(imagePromises), delay(POSTER_IMAGE_WAIT_MS)]);
}

async function createPosterFileWithTimeout(node: HTMLElement, orderId: string) {
  return withTimeout(
    createPosterFile(node, orderId),
    POSTER_GENERATION_TIMEOUT_MS,
    "Poster generation timed out.",
  );
}

function canUseNativeShare() {
  return typeof navigator !== "undefined" && typeof navigator.share === "function";
}

function canSharePosterFile(file: File) {
  return (
    canUseNativeShare() &&
    typeof navigator.canShare === "function" &&
    navigator.canShare({ files: [file] })
  );
}

function downloadPosterFile(file: File) {
  const objectUrl = URL.createObjectURL(file);
  const link = document.createElement("a");

  link.href = objectUrl;
  link.download = file.name;
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
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
  const [isPosterBusy, setIsPosterBusy] = useState(false);
  const recordedOrderIdRef = useRef<string | null>(null);
  const posterRef = useRef<HTMLDivElement | null>(null);
  const order =
    orderState.currentOrder?.status === "completed" ? orderState.currentOrder : null;
  const publicAppUrl = useMemo(() => getPublicAppUrl(), []);
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
    () => (order ? buildShareText(order, displayedProgress, publicAppUrl) : ""),
    [displayedProgress, order, publicAppUrl],
  );
  const avoidedItemSummary = useMemo(
    () => (order ? getAvoidedItemSummary(order.items) : ""),
    [order],
  );
  const deliveryOutcome = useMemo(
    () => (order ? getDeliveryOutcomeCopy(order) : ""),
    [order],
  );
  const completionTimestamp = useMemo(
    () => (order ? getOrderCompletionTimestamp(order) : ""),
    [order],
  );

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
    if (order && recordedOrderIdRef.current !== order.id) {
      recordedOrderIdRef.current = order.id;
      receiptProgress.recordCompletedOrder(order);
    }
  }, [order, receiptProgress.recordCompletedOrder]);

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

  async function copyShareTextToClipboard() {
    if (!shareText) {
      return;
    }

    if (
      typeof navigator !== "undefined" &&
      navigator.clipboard &&
      typeof navigator.clipboard.writeText === "function"
    ) {
      try {
        await navigator.clipboard.writeText(shareText);
        showToast("Receipt link copied. Go cause mild confusion.", "success");
        return;
      } catch {
        // Fall through to the visible text fallback.
      }
    }

    setShowShareFallback(true);
    showToast("Could not copy, but the receipt is still yours.");
  }

  async function shareLinkOrCopy() {
    if (!shareText) {
      return;
    }

    if (canUseNativeShare()) {
      try {
        await navigator.share({
          title: "DopeCart receipt",
          text: shareText,
          url: publicAppUrl,
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

    await copyShareTextToClipboard();
  }

  async function handleSharePoster() {
    if (!shareText || !order) {
      return;
    }

    setShowShareFallback(false);

    if (!canUseNativeShare()) {
      await copyShareTextToClipboard();
      return;
    }

    if (typeof navigator.canShare !== "function") {
      await shareLinkOrCopy();
      return;
    }

    setIsPosterBusy(true);
    showToast("Preparing poster...");

    try {
      const posterFile = posterRef.current
        ? await createPosterFileWithTimeout(posterRef.current, order.id)
        : null;

      if (posterFile && canSharePosterFile(posterFile)) {
        try {
          await navigator.share({
            title: "DopeCart receipt",
            text: shareText,
            url: publicAppUrl,
            files: [posterFile],
          });
          showToast("Poster share sheet opened.", "success");
          return;
        } catch (error) {
          if (isShareAbortError(error)) {
            setShowShareFallback(false);
            showToast("Share cancelled. Receipt stayed yours.");
            return;
          }
          // Non-cancel file-share failures fall through to link/text support.
        }
      }
    } catch {
      showToast("Poster took too long. Sharing the link instead.");
    } finally {
      setIsPosterBusy(false);
    }

    await shareLinkOrCopy();
  }

  async function handleSavePoster() {
    if (!order || !posterRef.current) {
      return;
    }

    setShowShareFallback(false);
    setIsPosterBusy(true);
    showToast("Preparing poster...");

    try {
      const posterFile = await createPosterFileWithTimeout(posterRef.current, order.id);
      downloadPosterFile(posterFile);
      showToast("Poster saved. Trophy secured.", "success");
    } catch {
      setShowShareFallback(true);
      showToast("Poster could not render, but the share text is ready.");
    } finally {
      setIsPosterBusy(false);
    }
  }

  async function handleCopyShareText() {
    if (!shareText) {
      return;
    }

    setShowShareFallback(false);
    await copyShareTextToClipboard();
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
              <span className="section-kicker">DopeCart receipt</span>
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
                <dd>{formatOrderTime(completionTimestamp)}</dd>
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
              <h2 id="receipt-share-title">Share the poster</h2>
              <p>
                A tiny achievement card with the link baked in.
              </p>
            </div>

            <div className="receipt-share-preview" aria-label="Share poster preview">
              <ShareReceiptPoster
                badge={badge}
                order={order}
                progress={displayedProgress}
                publicAppUrl={publicAppUrl}
                ref={posterRef}
              />
            </div>

            <div className="receipt-share-actions" aria-label="Share poster actions">
              <Button type="button" onClick={handleSharePoster} disabled={isPosterBusy}>
                Share Poster
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={handleSavePoster}
                disabled={isPosterBusy}
              >
                Save Poster
              </Button>
              <Button type="button" variant="ghost" onClick={handleCopyShareText}>
                Copy Text
              </Button>
            </div>

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
