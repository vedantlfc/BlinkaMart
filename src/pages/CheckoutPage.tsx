import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/Button";
import { EmptyState } from "../components/EmptyState";
import { PageHeader } from "../components/PageHeader";
import { categories, products, type Product } from "../data/catalog";
import { useCart } from "../state/cart";
import { useFakeOrder, type FakeOrderItem, type FakeOrderSnapshot } from "../state/fakeOrder";
import { useSettings } from "../state/settings";

const productById = new Map(products.map((product) => [product.id, product]));
const categoryNames = new Map(categories.map((category) => [category.id, category.name]));

interface CheckoutSummary {
  items: FakeOrderItem[];
  totalQuantity: number;
  totalPrice: number;
  totalCalories: number;
  averageRegretScore: number;
  showCalories: boolean;
  sourceLabel: string;
}

function getCartSummary(
  cartItems: Record<string, number>,
  showCalories: boolean,
): CheckoutSummary | null {
  const items = Object.entries(cartItems).reduce<FakeOrderItem[]>(
    (summaryItems, [productId, quantity]) => {
      const product: Product | undefined = productById.get(productId);

      if (!product || quantity <= 0) {
        return summaryItems;
      }

      summaryItems.push({
        productId: product.id,
        name: product.name,
        categoryId: product.categoryId,
        categoryName: categoryNames.get(product.categoryId) ?? "Fake shelf",
        quantity,
        price: product.price,
        calories: product.calories,
        regretScore: product.regretScore,
        subtitle: product.subtitle,
      });

      return summaryItems;
    },
    [],
  );

  const totals = items.reduce(
    (runningTotals, item) => {
      runningTotals.totalQuantity += item.quantity;
      runningTotals.totalPrice += item.price * item.quantity;
      runningTotals.totalCalories += item.calories * item.quantity;
      runningTotals.regretScoreTotal += item.regretScore * item.quantity;
      return runningTotals;
    },
    {
      totalQuantity: 0,
      totalPrice: 0,
      totalCalories: 0,
      regretScoreTotal: 0,
    },
  );

  if (totals.totalQuantity <= 0) {
    return null;
  }

  return {
    items,
    totalQuantity: totals.totalQuantity,
    totalPrice: totals.totalPrice,
    totalCalories: totals.totalCalories,
    averageRegretScore: Math.round(totals.regretScoreTotal / totals.totalQuantity),
    showCalories,
    sourceLabel: "Current fake cart",
  };
}

function getOrderSummary(order: FakeOrderSnapshot): CheckoutSummary {
  return {
    items: order.items,
    totalQuantity: order.totalQuantity,
    totalPrice: order.totalPrice,
    totalCalories: order.totalCalories,
    averageRegretScore: order.averageRegretScore,
    showCalories: order.showCalories,
    sourceLabel: "Saved fake order draft",
  };
}

export function CheckoutPage() {
  const cart = useCart();
  const fakeOrder = useFakeOrder();
  const settings = useSettings();
  const navigate = useNavigate();

  const cartSummary = useMemo(
    () => getCartSummary(cart.items, settings.showCalories),
    [cart.items, settings.showCalories],
  );
  const summary = cartSummary ?? (fakeOrder.currentOrder ? getOrderSummary(fakeOrder.currentOrder) : null);

  function handleConfirmFakeCheckout() {
    const nextOrder = cartSummary
      ? fakeOrder.createOrderFromCart(cart.items, settings.showCalories, "tracking")
      : fakeOrder.updateOrderStatus("tracking");

    if (nextOrder) {
      navigate("/tracking");
    }
  }

  return (
    <div className="checkout-page">
      <PageHeader
        title="Fake checkout reality check."
        subtitle="Final pause before the imaginary rider starts doing imaginary work."
        trailing={<span className="status-dot">No real payment</span>}
      />

      {!summary ? (
        <section className="checkout-empty-section" aria-label="No fake order checkout">
          <EmptyState
            title="No fake order to cancel."
            message="There is no fake cart or saved fake order draft ready for checkout."
          />
          <Button type="button" onClick={() => navigate("/products")}>
            Browse Fake Shelf
          </Button>
        </section>
      ) : (
        <>
          <section className="fake-disclaimer" aria-labelledby="checkout-disclaimer-title">
            <span className="section-kicker">Reality check</span>
            <h2 id="checkout-disclaimer-title">This checkout cannot charge you.</h2>
            <p>
              Final reality check: this is a fake checkout. No address, no
              payment, no delivery. We are only cancelling the craving ritual.
            </p>
            <p>
              BlinkaMart does not sell, deliver, or process orders. The next step
              is parody tracking, starring Self Control.
            </p>
          </section>

          <section className="checkout-summary" aria-labelledby="checkout-summary-title">
            <div className="section-heading">
              <span className="section-kicker">{summary.sourceLabel}</span>
              <h2 id="checkout-summary-title">About to not order</h2>
              <p>This snapshot carries into fake tracking and the Phase 6 receipt handoff.</p>
            </div>

            <div className="impact-grid">
              <div className="impact-stat">
                <span>Fake total avoided</span>
                <strong>Rs {summary.totalPrice}</strong>
              </div>
              <div className="impact-stat">
                <span>Fake items</span>
                <strong>{summary.totalQuantity}</strong>
              </div>
              {summary.showCalories ? (
                <div className="impact-stat">
                  <span>Calories avoided</span>
                  <strong>{summary.totalCalories}</strong>
                </div>
              ) : null}
              <div className="impact-stat">
                <span>Average regret score</span>
                <strong>{summary.averageRegretScore}/100</strong>
              </div>
            </div>
          </section>

          <section className="checkout-items" aria-labelledby="checkout-items-title">
            <div className="section-heading">
              <h2 id="checkout-items-title">Imaginary bag contents</h2>
              <p>No one is packing this. That is the entire feature.</p>
            </div>

            <div className="mini-item-list">
              {summary.items.map((item) => (
                <article className="mini-item" key={item.productId}>
                  <div>
                    <span className="product-card__category">{item.categoryName}</span>
                    <h3>{item.name}</h3>
                    <p>{item.subtitle}</p>
                  </div>
                  <strong>
                    {item.quantity} x Rs {item.price}
                  </strong>
                </article>
              ))}
            </div>
          </section>

          <div className="cart-cta-row" aria-label="Checkout actions">
            <Button type="button" onClick={handleConfirmFakeCheckout}>
              Cancel Order Successfully
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
