import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/Button";
import { EmptyState } from "../components/EmptyState";
import { FictionalDeliveryMap } from "../components/FictionalDeliveryMap";
import { PageHeader } from "../components/PageHeader";
import { products } from "../data/catalog";
import { useCart } from "../state/cart";
import {
  ORDER_TRACKING_DURATION_MS,
  useOrder,
  type OrderSnapshot,
} from "../state/order";

const ROUTE_WOBBLE_START_RATIO = 290 / 300;
const FINAL_STAGE_INDEX = 6;

const trackingStages = [
  {
    title: "Order confirmed",
    copy: "The Late-Night Craving Desk woke up and stamped the order with dramatic urgency.",
    mapLabel: "Order confirmed",
  },
  {
    title: "Packing your order",
    copy: "The bag is being filled with snacks, suspense, and unusually steady hands.",
    mapLabel: "Packing started",
  },
  {
    title: "Delivery partner selected",
    copy: "A delivery partner has accepted the ritual and is checking the route.",
    mapLabel: "Partner assigned",
  },
  {
    title: "On the way",
    copy: "Your order is moving through Snack Flyover with concerning confidence.",
    mapLabel: "On the way",
  },
  {
    title: "Almost there",
    copy: "The marker is near Self Control Signal. The craving is leaning forward.",
    mapLabel: "Near Self Control Signal",
  },
  {
    title: "Route wobble",
    copy: "The route is doing one last suspicious little wiggle near Self Control Signal.",
    mapLabel: "Route wobble",
  },
  {
    title: "Order lost",
    copy: "The order got lost. You did not. Self Control Signal reports excellent timing.",
    mapLabel: "Self Control Signal",
  },
];

const productById = new Map(products.map((product) => [product.id, product]));

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function getTimestampMs(value: string | null | undefined) {
  if (!value) {
    return null;
  }

  const timestampMs = new Date(value).getTime();
  return Number.isNaN(timestampMs) ? null : timestampMs;
}

function getTrackingStartedAtMs(order: OrderSnapshot | null) {
  return getTimestampMs(order?.tracking.trackingStartedAt);
}

function getTrackingEndsAtMs(order: OrderSnapshot | null) {
  const storedEndsAtMs = getTimestampMs(order?.tracking.trackingEndsAt);

  if (storedEndsAtMs !== null) {
    return storedEndsAtMs;
  }

  const startedAtMs = getTrackingStartedAtMs(order);
  return startedAtMs === null ? null : startedAtMs + ORDER_TRACKING_DURATION_MS;
}

function getTrackingDurationMs(startedAtMs: number | null, endsAtMs: number | null) {
  if (startedAtMs === null || endsAtMs === null || endsAtMs <= startedAtMs) {
    return ORDER_TRACKING_DURATION_MS;
  }

  return Math.max(1000, endsAtMs - startedAtMs);
}

function getElapsedMs(
  startedAtMs: number | null,
  now: number,
  durationMs: number,
  forceComplete: boolean,
) {
  if (forceComplete) {
    return durationMs;
  }

  if (startedAtMs === null) {
    return 0;
  }

  return clamp(now - startedAtMs, 0, durationMs);
}

function getTimelineProgress(elapsedMs: number, durationMs: number) {
  return durationMs > 0 ? clamp(elapsedMs / durationMs, 0, 1) : 0;
}

function getActiveStageIndex(timelineProgress: number, forceComplete: boolean) {
  if (forceComplete || timelineProgress >= 1) {
    return FINAL_STAGE_INDEX;
  }

  if (timelineProgress >= ROUTE_WOBBLE_START_RATIO) {
    return 5;
  }

  if (timelineProgress >= 0.85) {
    return 4;
  }

  if (timelineProgress >= 0.45) {
    return 3;
  }

  if (timelineProgress >= 0.3) {
    return 2;
  }

  if (timelineProgress >= 0.1) {
    return 1;
  }

  return 0;
}

function getMapProgress(timelineProgress: number, isLost: boolean) {
  if (isLost) {
    return 0.86;
  }

  return clamp(0.04 + timelineProgress * 0.82, 0.04, 0.85);
}

function getItemLabel(quantity: number) {
  return quantity === 1 ? "1 item" : `${quantity} items`;
}

function getEtaSupportCopy(stageIndex: number) {
  if (stageIndex <= 1) {
    return "Packing is underway.";
  }

  if (stageIndex === 2) {
    return "Delivery partner is getting ready.";
  }

  if (stageIndex === 3) {
    return "Moving through Snack Flyover.";
  }

  if (stageIndex === 4) {
    return "Almost near Your Sofa.";
  }

  return "Self Control Signal redirected the bag at the last possible moment.";
}

function formatRemainingTime(remainingMs: number) {
  const totalSeconds = Math.max(0, Math.ceil(remainingMs / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

function getEtaHeadline(
  order: OrderSnapshot,
  elapsedMs: number,
  remainingMs: number,
  durationMs: number,
  isLostStage: boolean,
) {
  if (isLostStage) {
    return "Route update: order lost near Self Control Signal";
  }

  if (durationMs === ORDER_TRACKING_DURATION_MS && elapsedMs < 1000) {
    return `Your order will arrive in ${order.tracking.etaMinutes} minutes`;
  }

  return `Arriving in ${formatRemainingTime(remainingMs)}`;
}

function getEtaSummary(remainingMs: number, isLostStage: boolean) {
  if (isLostStage) {
    return "Lost near signal";
  }

  return formatRemainingTime(remainingMs);
}

function getEtaTrailingLabel(remainingMs: number, isLostStage: boolean) {
  if (isLostStage) {
    return "Signal update";
  }

  return `ETA ${formatRemainingTime(remainingMs)}`;
}

function getEtaMeterProgress(timelineProgress: number) {
  return Math.round(clamp(timelineProgress, 0, 1) * 100);
}

function renderPackingPreview(order: OrderSnapshot) {
  return (
    <section className="packing-preview" aria-labelledby="packing-preview-title">
      <div className="section-heading">
        <span className="section-kicker">Packing preview</span>
        <h2 id="packing-preview-title">Bag contents entering the drama</h2>
      </div>
      <div className="packing-preview__items">
        {order.items.slice(0, 3).map((item) => {
          const product = productById.get(item.productId);

          return (
            <article className="packing-preview__item" key={item.productId}>
              {product ? (
                <img
                  src={product.imageSrc}
                  alt={product.fullName || product.name}
                  loading="lazy"
                />
              ) : null}
              <div>
                <strong>{item.name}</strong>
                <span>{getItemLabel(item.quantity)}</span>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function renderPartnerCard(order: OrderSnapshot) {
  return (
    <section className="delivery-partner-card" aria-labelledby="delivery-partner-title">
      <div>
        <span className="section-kicker">Delivery partner</span>
        <h2 id="delivery-partner-title">{order.tracking.deliveryPartner.name}</h2>
        <p>{order.tracking.deliveryPartner.oneLineStatus}</p>
      </div>
      <dl className="delivery-partner-grid">
        <div>
          <dt>Vehicle</dt>
          <dd>{order.tracking.deliveryPartner.vehicle}</dd>
        </div>
        <div>
          <dt>Reliability</dt>
          <dd>{order.tracking.deliveryPartner.reliabilityLabel}</dd>
        </div>
      </dl>
    </section>
  );
}

export function TrackingPage() {
  const orderState = useOrder();
  const { clearCart } = useCart();
  const navigate = useNavigate();
  const [now, setNow] = useState(() => Date.now());
  const [isCompleting, setIsCompleting] = useState(false);
  const hasStartedRef = useRef(false);
  const hasCompletedRef = useRef(false);
  const order = orderState.currentOrder;
  const hasTrackableOrder =
    order?.status === "tracking" ||
    (order?.status === "completed" && order.tracking.trackingOutcome === "lost");
  const isCompletedOrder = order?.status === "completed";
  const startedAtMs = getTrackingStartedAtMs(order);
  const trackingEndsAtMs = getTrackingEndsAtMs(order);
  const durationMs = getTrackingDurationMs(startedAtMs, trackingEndsAtMs);
  const shouldShowFinalOutcome =
    Boolean(isCompletedOrder) ||
    (trackingEndsAtMs !== null && now >= trackingEndsAtMs);
  const elapsedMs = getElapsedMs(startedAtMs, now, durationMs, shouldShowFinalOutcome);
  const remainingMs = shouldShowFinalOutcome ? 0 : Math.max(0, durationMs - elapsedMs);
  const timelineProgress = getTimelineProgress(elapsedMs, durationMs);
  const activeStageIndex = getActiveStageIndex(timelineProgress, shouldShowFinalOutcome);
  const activeStage = trackingStages[activeStageIndex];
  const isLostStage = activeStageIndex === FINAL_STAGE_INDEX;
  const mapProgress = getMapProgress(timelineProgress, isLostStage);
  const etaMeterProgress = getEtaMeterProgress(timelineProgress);
  const showPackingPreview = activeStageIndex >= 1;
  const showPartnerCard = activeStageIndex >= 2;
  const showMapBeforeSummary = activeStageIndex >= 3 && activeStageIndex < FINAL_STAGE_INDEX;
  const showLostMessageBeforeSummary = isLostStage;

  useEffect(() => {
    if (
      order?.status !== "tracking" ||
      order?.tracking.trackingStartedAt ||
      hasStartedRef.current
    ) {
      return;
    }

    hasStartedRef.current = true;
    orderState.beginTracking();
  }, [order?.status, order?.tracking.trackingStartedAt, orderState]);

  useEffect(() => {
    if (order?.status !== "tracking" || !order.tracking.trackingStartedAt) {
      return undefined;
    }

    const intervalId = window.setInterval(() => setNow(Date.now()), 500);
    setNow(Date.now());

    return () => window.clearInterval(intervalId);
  }, [order?.status, order?.tracking.trackingStartedAt]);

  useEffect(() => {
    if (
      order?.status !== "tracking" ||
      trackingEndsAtMs === null ||
      now < trackingEndsAtMs ||
      hasCompletedRef.current
    ) {
      return;
    }

    hasCompletedRef.current = true;
    const completedOrder = orderState.completeTracking("lost");

    if (completedOrder) {
      clearCart();
      setIsCompleting(false);
      return;
    }

    hasCompletedRef.current = false;
  }, [clearCart, now, order?.status, orderState, trackingEndsAtMs]);

  function handleViewReceipt() {
    if (!hasTrackableOrder || !order) {
      return;
    }

    if (order.status === "completed") {
      navigate("/receipt", { replace: true });
      return;
    }

    if (hasCompletedRef.current) {
      return;
    }

    hasCompletedRef.current = true;
    setIsCompleting(true);
    const completedOrder = orderState.completeTracking("lost");

    if (completedOrder) {
      clearCart();
      navigate("/receipt", { replace: true });
      return;
    }

    hasCompletedRef.current = false;
    setIsCompleting(false);
  }

  return (
    <div className="tracking-page">
      <PageHeader
        title="Tracking your order."
        subtitle="Your cart is moving through the late-night delivery grid."
        trailing={
          hasTrackableOrder && order ? (
            <span className="status-dot">{getEtaTrailingLabel(remainingMs, isLostStage)}</span>
          ) : (
            <span className="status-dot">Route desk</span>
          )
        }
      />

      {!hasTrackableOrder || !order ? (
        <section className="tracking-empty-section" aria-label="No order tracking">
          <EmptyState
            title="No order is currently being tracked."
            message="Build a cart first, then the route can begin."
          />
          <Button type="button" onClick={() => navigate("/products")}>
            Browse Shelf
          </Button>
        </section>
      ) : (
        <>
          <section className="eta-arrival-card" aria-labelledby="eta-arrival-title">
            <div>
              <span className="section-kicker">Arrival estimate</span>
              <h2 id="eta-arrival-title">
                {getEtaHeadline(
                  order,
                  elapsedMs,
                  remainingMs,
                  durationMs,
                  isLostStage,
                )}
              </h2>
              <p>{getEtaSupportCopy(activeStageIndex)}</p>
            </div>
            <div
              className="eta-arrival-meter"
              role="progressbar"
              aria-label="Route progress"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={etaMeterProgress}
            >
              <span style={{ width: `${etaMeterProgress}%` }} />
            </div>
          </section>

          {showLostMessageBeforeSummary ? (
            <section className="lost-order-panel" aria-labelledby="lost-order-title">
              <span className="section-kicker">Final update</span>
              <h2 id="lost-order-title">Sorry, your order is lost.</h2>
              <p>The order got lost. You did not. Self Control Signal reports excellent timing.</p>
              <Button type="button" onClick={handleViewReceipt} disabled={isCompleting}>
                View Receipt
              </Button>
            </section>
          ) : null}

          {showMapBeforeSummary ? (
            <FictionalDeliveryMap
              routeSeed={order.tracking.routeSeed}
              progress={mapProgress}
              darkStoreName={order.tracking.darkStoreName}
              stage={activeStage.mapLabel}
              isLost={isLostStage}
            />
          ) : null}

          <section className="tracking-hero-card" aria-labelledby="tracking-current-title">
            <div className="tracking-hero-card__copy">
              <span className="section-kicker">{order.tracking.darkStoreName}</span>
              <h2 id="tracking-current-title">{activeStage.title}</h2>
              <p>{activeStage.copy}</p>
            </div>
            <dl className="tracking-summary-grid" aria-label="Tracking summary">
              <div>
                <dt>Order ID</dt>
                <dd>{order.id}</dd>
              </div>
              <div>
                <dt>ETA</dt>
                <dd>{getEtaSummary(remainingMs, isLostStage)}</dd>
              </div>
              <div>
                <dt>Status</dt>
                <dd>{isLostStage ? "Lost near Self Control Signal" : activeStage.title}</dd>
              </div>
            </dl>
          </section>

          {showPackingPreview && !showMapBeforeSummary ? renderPackingPreview(order) : null}

          {showPartnerCard && !showMapBeforeSummary ? renderPartnerCard(order) : null}

          {!showMapBeforeSummary ? (
            <FictionalDeliveryMap
              routeSeed={order.tracking.routeSeed}
              progress={mapProgress}
              darkStoreName={order.tracking.darkStoreName}
              stage={activeStage.mapLabel}
              isLost={isLostStage}
            />
          ) : null}

          {showPartnerCard && showMapBeforeSummary ? renderPartnerCard(order) : null}

          {showPackingPreview && showMapBeforeSummary ? renderPackingPreview(order) : null}

          <section className="tracking-progress" aria-labelledby="tracking-progress-title">
            <div className="section-heading">
              <h2 id="tracking-progress-title">Tracking timeline</h2>
              <p>Status updates appear as the route changes.</p>
            </div>

            <ol className="tracking-stage-list">
              {trackingStages.map((stage, index) => {
                const isComplete = index < activeStageIndex;
                const isActive = index === activeStageIndex;

                return (
                  <li
                    className={[
                      "tracking-stage",
                      isComplete ? "tracking-stage--complete" : "",
                      isActive ? "tracking-stage--active" : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                    key={stage.title}
                    aria-current={isActive ? "step" : undefined}
                  >
                    <span className="tracking-stage__marker" aria-hidden="true">
                      {isComplete ? "OK" : index + 1}
                    </span>
                    <div>
                      <h3>{stage.title}</h3>
                      <p>{stage.copy}</p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </section>
        </>
      )}
    </div>
  );
}
