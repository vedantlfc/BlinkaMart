import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/Button";
import { EmptyState } from "../components/EmptyState";
import { FictionalDeliveryMap } from "../components/FictionalDeliveryMap";
import { PageHeader } from "../components/PageHeader";
import { products } from "../data/catalog";
import { useCart } from "../state/cart";
import { useOrder, type OrderSnapshot } from "../state/order";

const TRACKING_STAGE_MS = 2200;
const REDUCED_MOTION_STAGE_MS = 1100;

const trackingStages = [
  {
    title: "Order received",
    copy: "Your order reached the Late-Night Craving Desk and got a tiny clipboard.",
    mapLabel: "Desk check-in",
  },
  {
    title: "Packing your order",
    copy: "The bag is being filled with snacks, suspense, and one dramatic pause.",
    mapLabel: "Bag getting serious",
  },
  {
    title: "Delivery partner assigned",
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
    copy: "The marker is near your sofa. The craving is leaning forward.",
    mapLabel: "Almost there",
  },
  {
    title: "Order lost",
    copy: "The order got lost. You did not. Self Control Signal reports excellent timing.",
    mapLabel: "Self Control Signal",
  },
];

const productById = new Map(products.map((product) => [product.id, product]));

function getPrefersReducedMotion() {
  if (typeof window === "undefined" || !window.matchMedia) {
    return false;
  }

  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getStartedAtMs(order: OrderSnapshot | null) {
  if (!order?.tracking.trackingStartedAt) {
    return null;
  }

  const startedAtMs = new Date(order.tracking.trackingStartedAt).getTime();
  return Number.isNaN(startedAtMs) ? null : startedAtMs;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function getActiveStageIndex(startedAtMs: number | null, now: number, stageMs: number) {
  if (!startedAtMs) {
    return 0;
  }

  const elapsed = Math.max(0, now - startedAtMs);
  return clamp(Math.floor(elapsed / stageMs), 0, trackingStages.length - 1);
}

function getStageFraction(startedAtMs: number | null, now: number, stageMs: number) {
  if (!startedAtMs) {
    return 0;
  }

  const elapsed = Math.max(0, now - startedAtMs);
  return clamp((elapsed % stageMs) / stageMs, 0, 1);
}

function getMapProgress(stageIndex: number, stageFraction: number) {
  if (stageIndex <= 0) {
    return 0.04;
  }

  if (stageIndex === 1) {
    return 0.1;
  }

  if (stageIndex === 2) {
    return 0.18 + stageFraction * 0.08;
  }

  if (stageIndex === 3) {
    return 0.28 + stageFraction * 0.38;
  }

  if (stageIndex === 4) {
    return 0.72 + stageFraction * 0.24;
  }

  return 0.86;
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

  return "Route update changed at Self Control Signal.";
}

function getEtaMeterProgress(stageIndex: number, mapProgress: number) {
  if (stageIndex >= trackingStages.length - 1) {
    return 100;
  }

  return Math.round(clamp(mapProgress, 0, 1) * 100);
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
  const hasTrackableOrder = order?.status === "tracking";
  const prefersReducedMotion = useMemo(() => getPrefersReducedMotion(), []);
  const stageDuration = prefersReducedMotion ? REDUCED_MOTION_STAGE_MS : TRACKING_STAGE_MS;
  const startedAtMs = getStartedAtMs(order);
  const activeStageIndex = getActiveStageIndex(startedAtMs, now, stageDuration);
  const activeStage = trackingStages[activeStageIndex];
  const stageFraction = getStageFraction(startedAtMs, now, stageDuration);
  const mapProgress = getMapProgress(activeStageIndex, stageFraction);
  const etaMeterProgress = getEtaMeterProgress(activeStageIndex, mapProgress);
  const isLostStage = activeStage.title === "Order lost";
  const showPackingPreview = activeStageIndex >= 1;
  const showPartnerCard = activeStageIndex >= 2;
  const showMapBeforeSummary = activeStageIndex >= 3 && !isLostStage;
  const showLostMessageBeforeSummary = isLostStage;

  useEffect(() => {
    if (
      !hasTrackableOrder ||
      order?.tracking.trackingStartedAt ||
      hasStartedRef.current
    ) {
      return;
    }

    hasStartedRef.current = true;
    orderState.beginTracking();
  }, [hasTrackableOrder, order?.tracking.trackingStartedAt, orderState]);

  useEffect(() => {
    if (!hasTrackableOrder || !order?.tracking.trackingStartedAt) {
      return undefined;
    }

    const intervalId = window.setInterval(() => setNow(Date.now()), 250);
    setNow(Date.now());

    return () => window.clearInterval(intervalId);
  }, [hasTrackableOrder, order?.tracking.trackingStartedAt]);

  function handleViewReceipt() {
    if (!hasTrackableOrder || !order || hasCompletedRef.current) {
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
            <span className="status-dot">ETA {order.tracking.etaMinutes} min</span>
          ) : (
            <span className="status-dot">Cart ritual</span>
          )
        }
      />

      {!hasTrackableOrder || !order ? (
        <section className="tracking-empty-section" aria-label="No order tracking">
          <EmptyState
            title="No order is currently being tracked."
            message="Build a cart first, then the route theatre can begin."
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
                Your order will arrive in {order.tracking.etaMinutes} minutes
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
                <dd>{order.tracking.etaMinutes} min</dd>
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
