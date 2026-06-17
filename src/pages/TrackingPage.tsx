import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/Button";
import { EmptyState } from "../components/EmptyState";
import { PageHeader } from "../components/PageHeader";
import { useFakeOrder } from "../state/fakeOrder";

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
    title: "Physical delivery cancelled",
    copy: "No doorbell. No payment. No 1 AM negotiation.",
  },
];

function getPrefersReducedMotion() {
  if (typeof window === "undefined" || !window.matchMedia) {
    return false;
  }

  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function TrackingPage() {
  const fakeOrder = useFakeOrder();
  const navigate = useNavigate();
  const [activeStageIndex, setActiveStageIndex] = useState(0);
  const hasNavigatedRef = useRef(false);
  const hasTrackableOrder = fakeOrder.currentOrder?.status === "tracking";

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
      fakeOrder.updateOrderStatus("completed");
      navigate("/receipt", { replace: true });
    }, finalStageDelay);

    return () => window.clearTimeout(timeoutId);
  }, [activeStageIndex, fakeOrder, finalStageDelay, finalStageIndex, hasTrackableOrder, navigate]);

  return (
    <div className="tracking-page">
      <PageHeader
        title="Tracking the order that will never arrive."
        subtitle="A calm little progress ritual for a very fake delivery."
        trailing={<span className="status-dot">ETA: never</span>}
      />

      {!hasTrackableOrder || !fakeOrder.currentOrder ? (
        <section className="tracking-empty-section" aria-label="No fake order tracking">
          <EmptyState
            title="No fake order is currently being tracked."
            message="Build a fake cart first, then we can assign Self Control to the case."
          />
          <Button type="button" onClick={() => navigate("/products")}>
            Browse Fake Shelf
          </Button>
        </section>
      ) : (
        <>
          <section className="rider-panel" aria-labelledby="rider-title">
            <div className="section-heading">
              <span className="section-kicker">Parody tracking</span>
              <h2 id="rider-title">Rider details</h2>
              <p>No map, no location, no delivery. Just a fake progress bar with manners.</p>
            </div>

            <div className="rider-grid">
              <div>
                <span>Delivery Partner</span>
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
              <h2 id="tracking-progress-title">Fake tracking progress</h2>
              <p>Order {fakeOrder.currentOrder.id} is being successfully not delivered.</p>
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
