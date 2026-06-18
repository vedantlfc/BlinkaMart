import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BottomCartBar } from "../components/BottomCartBar";
import { Button } from "../components/Button";
import { EmptyState } from "../components/EmptyState";
import { PageHeader } from "../components/PageHeader";
import { Toast } from "../components/Toast";
import { categories, products, type Product } from "../data/catalog";
import { useCart } from "../state/cart";
import { useFakeOrder } from "../state/fakeOrder";
import { useSettings } from "../state/settings";

const categoryNames = new Map(categories.map((category) => [category.id, category.name]));
const productById = new Map(products.map((product) => [product.id, product]));

function getTimeImpactCopy(date: Date) {
  const hour = date.getHours();

  if (hour >= 23 || hour < 6) {
    return "Late-night multiplier active: every snack idea sounds 37% more convincing after midnight.";
  }

  if (hour < 12) {
    return "Morning clarity mode: last night's cart looks easier to question now.";
  }

  if (hour < 18) {
    return "Afternoon snack fog: boredom is doing product research.";
  }

  return "Evening danger zone: dinner-adjacent decisions are assembling.";
}

function getCartProducts(items: Record<string, number>) {
  return Object.entries(items).reduce<Array<{ product: Product; quantity: number }>>(
    (cartProducts, [productId, quantity]) => {
      const product = productById.get(productId);

      if (product && quantity > 0) {
        cartProducts.push({ product, quantity });
      }

      return cartProducts;
    },
    [],
  );
}

export function CartPage() {
  const cart = useCart();
  const settings = useSettings();
  const fakeOrder = useFakeOrder();
  const navigate = useNavigate();
  const [toastMessage, setToastMessage] = useState("");
  const [showHungryGuidance, setShowHungryGuidance] = useState(false);

  const cartProducts = useMemo(() => getCartProducts(cart.items), [cart.items]);
  const hasItems = cart.totals.totalQuantity > 0;
  const timeImpactCopy = getTimeImpactCopy(new Date());

  useEffect(() => {
    if (!toastMessage) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => setToastMessage(""), 3200);
    return () => window.clearTimeout(timeoutId);
  }, [toastMessage]);

  function handlePlaceFakeOrder() {
    const order = fakeOrder.createOrderFromCart(cart.items, settings.showCalories);
    if (!order) {
      setToastMessage("Add an item first. Checkout needs something imaginary to process.");
      return;
    }

    navigate("/checkout");
  }

  return (
    <div className="cart-page">
      <PageHeader
        title="Review the fictional damage."
        subtitle="No payment. No address. Just a cart-shaped pause."
        trailing={<span className="status-dot">Parody flow</span>}
      />

      {!hasItems ? (
        <section className="cart-empty-section" aria-label="Empty cart">
          <EmptyState
            title="No damage yet."
            message="Your cart is emotionally empty. Browse the shelf when the craving starts negotiating."
          />
          <Button type="button" onClick={() => navigate("/products")}>
            Browse Shelf
          </Button>
        </section>
      ) : (
        <>
          <section className="impact-summary" aria-labelledby="impact-title">
            <div className="section-heading">
              <span className="section-kicker">Impact summary</span>
              <h2 id="impact-title">If this gets cancelled, you keep the win.</h2>
              <p>Numbers are estimates for the ritual, not a lecture.</p>
            </div>

            <div className="impact-grid">
              <div className="impact-stat">
                <span>Total avoided</span>
                <strong>Rs {cart.totals.totalPrice}</strong>
              </div>
              <div className="impact-stat">
                <span>Items</span>
                <strong>{cart.totals.totalQuantity}</strong>
              </div>
              {settings.showCalories ? (
                <div className="impact-stat">
                  <span>Calories avoided</span>
                  <strong>{cart.totals.totalCalories}</strong>
                </div>
              ) : null}
              <div className="impact-stat">
                <span>Average regret score</span>
                <strong>{cart.totals.averageRegretScore}/100</strong>
              </div>
            </div>
          </section>

          <section className="settings-panel" aria-label="Calorie visibility">
            <label className="toggle-row">
              <span>
                <strong>Show calories</strong>
                <small>For some brains, numbers help. For others, vibes are enough.</small>
              </span>
              <input
                type="checkbox"
                checked={settings.showCalories}
                onChange={(event) => settings.setShowCalories(event.target.checked)}
              />
            </label>
          </section>

          <section className="time-impact" aria-label="Time of night note">
            <span className="section-kicker">Craving weather</span>
            <p>{timeImpactCopy}</p>
          </section>

          <section className="cart-items" aria-labelledby="cart-items-title">
            <div className="section-heading">
              <h2 id="cart-items-title">Cart items</h2>
              <p>Adjust the cart before the checkout ritual starts.</p>
            </div>

            <div className="cart-item-list">
              {cartProducts.map(({ product, quantity }) => (
                <article className="cart-item-card" key={product.id}>
                  <div className="cart-item-card__header">
                    <div>
                      <span className="product-card__category">
                        {categoryNames.get(product.categoryId) ?? "Shelf"}
                      </span>
                      <h3>{product.name}</h3>
                    </div>
                    <strong>Rs {product.price * quantity}</strong>
                  </div>

                  <p>{product.subtitle}</p>

                  <div className="cart-item-card__impact">
                    <span>{quantity} in cart</span>
                    {settings.showCalories ? (
                      <span>{product.calories * quantity} cal avoided if cancelled</span>
                    ) : null}
                    <span>Regret {product.regretScore}/100</span>
                  </div>

                  <div className="cart-controls" aria-label={`${product.name} quantity controls`}>
                    <Button
                      type="button"
                      variant="secondary"
                      size="compact"
                      onClick={() => cart.decrementItem(product.id)}
                      aria-label={`Decrease ${product.name} quantity`}
                    >
                      -
                    </Button>
                    <span
                      className="cart-controls__quantity"
                      aria-label={`${quantity} in cart`}
                    >
                      {quantity}
                    </span>
                    <Button
                      type="button"
                      variant="secondary"
                      size="compact"
                      onClick={() => cart.incrementItem(product.id)}
                      aria-label={`Increase ${product.name} quantity`}
                    >
                      +
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="compact"
                      onClick={() => cart.removeItem(product.id)}
                      aria-label={`Remove ${product.name} from cart`}
                    >
                      Remove
                    </Button>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {showHungryGuidance ? (
            <section className="hungry-guidance" aria-label="Actually hungry guidance">
              <h2>Real hunger deserves real food.</h2>
              <p>
                If you're genuinely hungry, eat something real and basic. This app is
                for impulse loops, not ignoring hunger.
              </p>
              <p>
                Try water, leftovers, fruit, eggs, dal-rice, toast, or anything
                simple your future self will not have to litigate.
              </p>
            </section>
          ) : null}

          <div className="cart-cta-row" aria-label="Cart actions">
            <Button type="button" onClick={handlePlaceFakeOrder}>
              Place order successfully
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setShowHungryGuidance(true)}
            >
              I'm Actually Hungry
            </Button>
          </div>
        </>
      )}

      <Toast message={toastMessage} visible={Boolean(toastMessage)} />
      <BottomCartBar
        totalQuantity={cart.totals.totalQuantity}
        totalPrice={cart.totals.totalPrice}
        totalCalories={cart.totals.totalCalories}
        averageRegretScore={cart.totals.averageRegretScore}
        showCalories={settings.showCalories}
      />
    </div>
  );
}
