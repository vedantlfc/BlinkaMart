import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/Button";
import { EmptyState } from "../components/EmptyState";
import { PageHeader } from "../components/PageHeader";
import { useCart } from "../state/cart";
import { useOrder } from "../state/order";

const trackingStages = [
  {
    title: "Craving received",
    copy: "The impulse has entered the building and immediately looked suspicious.",
  },
  {
    title: "Self-control assigned",
    copy: "Your imaginary delivery partner has picked up the assignment.",
  },
  {
    title: "Regret being packed",
    copy: "Better Judgement is sealing the bag with excellent tape.",
  },
  {
    title: "Order intercepted",
    copy: "Common Sense has taken a clean turn away from chaos.",
  },
  {
    title: "Dopamine delivered",
    copy: "The ritual is complete. Nothing edible was harmed.",
  },
  {
    title: "Doorbell crisis averted",
    copy: "Self Control takes a tiny bow.",
  },
];

function getPrefersReducedMotion() {
  if (typeof window === "undefined" || !window.matchMedia) {
    return false;
  }

  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function TrackingPage() {
  const orderState = useOrder();
  const { clearCart } = useCart();
  const navigate = useNavigate();
  const [activeStageIndex, setActiveStageIndex] = useState(0);
  const hasNavigatedRef = useRef(false);
  const hasTrackableOrder = orderState.currentOrder?.status === "tracking";

  const prefersReducedMotion = useMemo(() => getPrefersReducedMotion(), []);
  const finalStageIndex = trackingStages.length - 1;
  const stepDuration = prefersReducedMotion ? 450 : 1050;
  const finalStageDelay = prefersReducedMotion ? 700 : 1300;

  useEffect(() => {
    if (!hasTrackableOrder || activeStageIndex >= finalStageIndex) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      setActiveStageIndex((currentIndex) => Math.min(currentIndex + 1, finalStageIndex));
    }, stepDuration);

    return () => window.clearTimeout(timeoutId);
  }, [activeStageIndex, finalStageIndex, hasTrackableOrder, stepDuration]);

  useEffect(() => {
    if (
      !hasTrackableOrder ||
      activeStageIndex < finalStageIndex ||
      hasNavigatedRef.current
    ) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      hasNavigatedRef.current = true;
      const completedOrder = orderState.updateOrderStatus("completed");
      if (completedOrder) {
        clearCart();
        navigate("/receipt", { replace: true });
      }
    }, finalStageDelay);

    return () => window.clearTimeout(timeoutId);
  }, [
    activeStageIndex,
    clearCart,
    orderState,
    finalStageDelay,
    finalStageIndex,
    hasTrackableOrder,
    navigate,
  ]);

  return (
    <div className="tracking-page">
      <PageHeader
        title="Tracking the craving handoff."
        subtitle="A calm progress ritual with Self Control in uniform."
        trailing={<span className="status-dot">ETA: never</span>}
      />

      {!hasTrackableOrder || !orderState.currentOrder ? (
        <section className="tracking-empty-section" aria-label="No order tracking">
          <EmptyState
            title="No order is currently being tracked."
            message="Build a cart first, then we can assign Self Control to the case."
          />
          <Button type="button" onClick={() => navigate("/products")}>
            Browse Shelf
          </Button>
        </section>
      ) : (
        <>
          <section className="rider-panel" aria-labelledby="rider-title">
            <div className="section-heading">
              <span className="section-kicker">Tracking ritual</span>
              <h2 id="rider-title">Ritual details</h2>
              <p>A progress ritual with a clipboard, a wink, and excellent timing.</p>
            </div>

            <div className="rider-grid">
              <div>
                <span>Ritual Partner</span>
                <strong>Self Control</strong>
              </div>
              <div>
                <span>Vehicle</span>
                <strong>Common Sense</strong>
              </div>
              <div>
                <span>ETA</span>
                <strong>Never</strong>
              </div>
              <div>
                <span>Tip</span>
                <strong>Drink water</strong>
              </div>
            </div>
          </section>

          <section className="tracking-progress" aria-labelledby="tracking-progress-title">
            <div className="section-heading">
              <h2 id="tracking-progress-title">Tracking progress</h2>
              <p>Order {orderState.currentOrder.id} is being escorted into receipt history.</p>
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
