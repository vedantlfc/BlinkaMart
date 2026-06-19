import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/Button";
import { EmptyState } from "../components/EmptyState";
import { PageHeader } from "../components/PageHeader";
import { categories, products, type Product } from "../data/catalog";
import { useCart } from "../state/cart";
import { useOrder, type OrderItem, type OrderSnapshot } from "../state/order";
import { useSettings } from "../state/settings";

const productById = new Map(products.map((product) => [product.id, product]));
const categoryNames = new Map(categories.map((category) => [category.id, category.name]));

interface CheckoutSummary {
  items: OrderItem[];
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
  const items = Object.entries(cartItems).reduce<OrderItem[]>(
    (summaryItems, [productId, quantity]) => {
      const product: Product | undefined = productById.get(productId);

      if (!product || quantity <= 0) {
        return summaryItems;
      }

      summaryItems.push({
        productId: product.id,
        name: product.name,
        categoryId: product.categoryId,
        categoryName: categoryNames.get(product.categoryId) ?? "Shelf",
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
    sourceLabel: "Current cart",
  };
}

function getOrderSummary(order: OrderSnapshot): CheckoutSummary {
  return {
    items: order.items,
    totalQuantity: order.totalQuantity,
    totalPrice: order.totalPrice,
    totalCalories: order.totalCalories,
    averageRegretScore: order.averageRegretScore,
    showCalories: order.showCalories,
    sourceLabel: "Saved order draft",
  };
}

export function CheckoutPage() {
  const cart = useCart();
  const orderState = useOrder();
  const settings = useSettings();
  const navigate = useNavigate();

  const cartSummary = useMemo(
    () => getCartSummary(cart.items, settings.showCalories),
    [cart.items, settings.showCalories],
  );
  const savedDraftOrder =
    orderState.currentOrder?.status === "draft" ? orderState.currentOrder : null;
  const hasTrackingOrder = orderState.currentOrder?.status === "tracking";
  const summary = cartSummary ?? (savedDraftOrder ? getOrderSummary(savedDraftOrder) : null);

  function handleConfirmCheckout() {
    const nextOrder = cartSummary
      ? orderState.createOrderFromCart(cart.items, settings.showCalories, "tracking")
      : savedDraftOrder
        ? orderState.beginTracking()
        : null;

    if (nextOrder) {
      navigate("/tracking");
    }
  }

  return (
    <div className="checkout-page">
      <PageHeader
        title="Checkout reality check."
        subtitle="One last pause before Self Control starts doing excellent work."
      />

      {!summary && hasTrackingOrder ? (
        <section className="checkout-empty-section" aria-label="Order already tracking">
          <EmptyState
            title="This order is already being tracked."
            message="It is past checkout and already in the tracking ritual."
          />
          <Button type="button" onClick={() => navigate("/tracking")}>
            Resume Tracking
          </Button>
        </section>
      ) : !summary ? (
        <section className="checkout-empty-section" aria-label="No order checkout">
          <EmptyState
            title="No order to review."
            message="There is no cart or saved order draft ready for checkout."
          />
          <Button type="button" onClick={() => navigate("/products")}>
            Browse Shelf
          </Button>
        </section>
      ) : (
        <>
          <section className="checkout-note" aria-labelledby="checkout-disclaimer-title">
            <span className="section-kicker">Reality check</span>
            <h2 id="checkout-disclaimer-title">One last pause before Self Control clocks in.</h2>
            <p>
              This checkout keeps the ritual playful while the craving gets one
              final look in the mirror.
            </p>
            <p>
              Next up: Self Control gets assigned, the cart gets ceremonious,
              and the receipt gets its tiny spotlight.
            </p>
          </section>

          <section className="checkout-summary" aria-labelledby="checkout-summary-title">
            <div className="section-heading">
              <span className="section-kicker">{summary.sourceLabel}</span>
              <h2 id="checkout-summary-title">Cart summary</h2>
              <p>This snapshot carries into tracking and the receipt handoff.</p>
            </div>

            <div className="impact-grid">
              <div className="impact-stat">
                <span>Total avoided</span>
                <strong>Rs {summary.totalPrice}</strong>
              </div>
              <div className="impact-stat">
                <span>Items</span>
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
              <p>A compact cast list for the cart that gets the spotlight.</p>
            </div>

            <div className="mini-item-list">
              {summary.items.map((item) => {
                const product = productById.get(item.productId);

                return (
                  <article
                    className={["mini-item", product ? "" : "mini-item--no-thumb"]
                      .filter(Boolean)
                      .join(" ")}
                    key={item.productId}
                  >
                    {product ? (
                      <div className="mini-item__thumb">
                        <img
                          src={product.imageSrc}
                          alt={product.fullName || product.name}
                          loading="lazy"
                        />
                      </div>
                    ) : null}
                    <div className="mini-item__body">
                      <span className="product-card__category">{item.categoryName}</span>
                      <h3>{item.name}</h3>
                      <p>{item.subtitle}</p>
                    </div>
                    <strong>
                      {item.quantity} x Rs {item.price}
                    </strong>
                  </article>
                );
              })}
            </div>
          </section>

          <div className="cart-cta-row" aria-label="Checkout actions">
            <Button type="button" onClick={handleConfirmCheckout}>
              Confirm Order
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
