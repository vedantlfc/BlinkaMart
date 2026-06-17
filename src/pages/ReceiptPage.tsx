import { useNavigate } from "react-router-dom";
import { Button } from "../components/Button";
import { EmptyState } from "../components/EmptyState";
import { PageHeader } from "../components/PageHeader";
import { useFakeOrder } from "../state/fakeOrder";

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

export function ReceiptPage() {
  const fakeOrder = useFakeOrder();
  const navigate = useNavigate();
  const order = fakeOrder.currentOrder;

  return (
    <div className="receipt-page">
      <PageHeader
        title="Successfully Not Ordered."
        subtitle="The receipt screen gets fancy in Phase 6. For now, the win is real enough."
        trailing={<span className="status-dot">Phase 6 handoff</span>}
      />

      {!order ? (
        <section className="receipt-empty-section" aria-label="No fake receipt">
          <EmptyState
            title="No fake receipt yet."
            message="There is no completed fake tracking flow to summarize right now."
          />
          <Button type="button" onClick={() => navigate("/products")}>
            Browse Fake Shelf
          </Button>
        </section>
      ) : (
        <>
          <section className="receipt-card" aria-labelledby="receipt-status-title">
            <span className="section-kicker">BlinkaMart receipt</span>
            <h2 id="receipt-status-title">Status: Successfully Not Ordered</h2>
            <p>
              Order {order.id} completed its fake journey on {formatOrderTime(order.timestamp)}.
            </p>

            <div className="impact-grid">
              <div className="impact-stat">
                <span>Fake total avoided</span>
                <strong>Rs {order.totalPrice}</strong>
              </div>
              <div className="impact-stat">
                <span>Fake items</span>
                <strong>{order.totalQuantity}</strong>
              </div>
              {order.showCalories ? (
                <div className="impact-stat">
                  <span>Calories avoided</span>
                  <strong>{order.totalCalories}</strong>
                </div>
              ) : null}
              <div className="impact-stat">
                <span>Average regret score</span>
                <strong>{order.averageRegretScore}/100</strong>
              </div>
            </div>
          </section>

          <section className="receipt-handoff" aria-label="Receipt phase handoff">
            <h2>Full receipt arrives in Phase 6.</h2>
            <p>
              Shareable receipt art, badges, and social copy stay intentionally
              deferred. Today, the craving got the paperwork and nothing got delivered.
            </p>
          </section>

          <div className="cart-cta-row" aria-label="Receipt actions">
            <Button type="button" onClick={() => navigate("/products")}>
              Browse Fake Shelf
            </Button>
            <Button type="button" variant="secondary" onClick={() => navigate("/cart")}>
              Back to Cart
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
