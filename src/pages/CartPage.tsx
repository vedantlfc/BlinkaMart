import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/Button";
import { PageHeader } from "../components/PageHeader";
import { Toast } from "../components/Toast";
import { categories, products, type Product } from "../data/catalog";
import {
  cartTotalsAnalyticsProperties,
  productAnalyticsProperties,
  trackEvent,
} from "../lib/analytics";
import { getCartTotals, getCartUpdatePreview, useCart } from "../state/cart";
import { useOrder } from "../state/order";
import { useSettings } from "../state/settings";

const categoryNames = new Map(categories.map((category) => [category.id, category.name]));
const productById = new Map(products.map((product) => [product.id, product]));

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
  const orderState = useOrder();
  const navigate = useNavigate();
  const [toastMessage, setToastMessage] = useState("");
  const [showHungryGuidance, setShowHungryGuidance] = useState(false);

  const cartProducts = useMemo(() => getCartProducts(cart.items), [cart.items]);
  const hasItems = cart.totals.totalQuantity > 0;
  const cartPageClassName = hasItems
    ? "cart-page cart-page--with-sticky-checkout"
    : "cart-page";
  const itemLabel = cart.totals.totalQuantity === 1 ? "item" : "items";
  const shelfPickLabel = cart.totals.uniqueItems === 1 ? "shelf pick" : "shelf picks";

  useEffect(() => {
    if (!toastMessage) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => setToastMessage(""), 3200);
    return () => window.clearTimeout(timeoutId);
  }, [toastMessage]);

  function handlePlaceOrder() {
    const order = orderState.createOrderFromCart(cart.items, settings.showCalories);
    if (!order) {
      setToastMessage("Add an item first. The cart needs something to review.");
      trackEvent("checkout blocked", {
        reason: "empty_cart",
        location: "cart",
        ...cartTotalsAnalyticsProperties(cart.totals),
      });
      return;
    }

    trackEvent("checkout draft created", {
      order_id: order.id,
      order_total_price: order.totalPrice,
      order_total_quantity: order.totalQuantity,
      order_total_calories: order.totalCalories,
      order_average_regret_score: order.averageRegretScore,
      order_show_calories: order.showCalories,
      order_item_count: order.items.length,
      ...cartTotalsAnalyticsProperties(cart.totals),
    });
    navigate("/checkout");
  }

  return (
    <div className={cartPageClassName}>
      <PageHeader
        title="Review your cart"
        subtitle="Everything here is reversible until you make the ritual official."
      />

      {!hasItems ? (
        <section className="cart-empty-panel" aria-label="Empty cart">
          <div className="cart-empty-panel__art" aria-hidden="true">
            <img src="/dopecart-cart-bag.svg" alt="" />
          </div>
          <div className="cart-empty-panel__copy">
            <span className="section-kicker">Cart status</span>
            <h2>No items waiting.</h2>
            <p>Browse the shelf, add a few temptations, then come back for the review ritual.</p>
          </div>
          <Button
            type="button"
            analyticsName="products_browse"
            onClick={() => {
              trackEvent("products browsed", {
                location: "cart_empty",
              });
              navigate("/products");
            }}
          >
            Browse Shelf
          </Button>
        </section>
      ) : (
        <>
          <section className="cart-selection-row" aria-label="Cart selection">
            <div className="cart-selection-row__status">
              <div>
                <strong>All items included</strong>
                <small>
                  {cart.totals.totalQuantity} {itemLabel} across {cart.totals.uniqueItems}{" "}
                  {shelfPickLabel}
                </small>
              </div>
            </div>
            <Button
              type="button"
              analyticsName="cart_clear"
              variant="ghost"
              size="compact"
              onClick={() => {
                trackEvent("cart cleared", {
                  location: "cart_selection_row",
                  ...cartTotalsAnalyticsProperties(getCartTotals({})),
                });
                cart.clearCart();
              }}
            >
              Clear cart
            </Button>
          </section>

          <section className="cart-items" aria-labelledby="cart-items-title">
            <div className="section-heading">
              <h2 id="cart-items-title">Shelf picks</h2>
            </div>

            <div className="cart-item-list">
              {cartProducts.map(({ product, quantity }) => (
                <article className="cart-item-row" key={product.id}>
                  <div className="cart-item-row__thumb">
                    <img
                      src={product.imageSrc}
                      alt={product.fullName || product.name}
                      loading="lazy"
                    />
                  </div>

                  <div className="cart-item-row__body">
                    <div className="cart-item-row__top">
                      <div className="cart-item-row__title">
                        <span>
                          {product.brandName} - {product.subcategory}
                        </span>
                        <h3>{product.name}</h3>
                      </div>
                      <strong>Rs {product.price * quantity}</strong>
                    </div>

                    <div className="cart-item-row__meta">
                      <span>{categoryNames.get(product.categoryId) ?? "Shelf"}</span>
                      {product.tag ? <span>{product.tag}</span> : null}
                      <span>Regret {product.regretScore}/100</span>
                      {settings.showCalories ? (
                        <span>{product.calories * quantity} cal</span>
                      ) : null}
                    </div>

                    <div className="cart-item-row__controls">
                      <div className="cart-stepper" aria-label={`${product.name} quantity controls`}>
                        <Button
                          type="button"
                          analyticsName="product_decrement"
                          variant="secondary"
                          size="compact"
                          onClick={() => {
                            const nextCart = getCartUpdatePreview(
                              cart.items,
                              product.id,
                              (currentQuantity) => currentQuantity - 1,
                            );
                            cart.decrementItem(product.id);
                            trackEvent(
                              quantity === 1 ? "product removed" : "product quantity decreased",
                              {
                                location: "cart",
                                quantity_before: quantity,
                                quantity_after: nextCart.quantity,
                                ...productAnalyticsProperties(product),
                                ...cartTotalsAnalyticsProperties(nextCart.totals),
                              },
                            );
                          }}
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
                          analyticsName="product_increment"
                          variant="secondary"
                          size="compact"
                          onClick={() => {
                            const nextCart = getCartUpdatePreview(
                              cart.items,
                              product.id,
                              (currentQuantity) => currentQuantity + 1,
                            );
                            cart.incrementItem(product.id);
                            trackEvent("product quantity increased", {
                              location: "cart",
                              quantity_before: quantity,
                              quantity_after: nextCart.quantity,
                              ...productAnalyticsProperties(product),
                              ...cartTotalsAnalyticsProperties(nextCart.totals),
                            });
                          }}
                          aria-label={`Increase ${product.name} quantity`}
                        >
                          +
                        </Button>
                      </div>
                      <Button
                        type="button"
                        analyticsName="product_remove"
                        variant="ghost"
                        size="compact"
                        onClick={() => {
                          const nextCart = getCartUpdatePreview(
                            cart.items,
                            product.id,
                            () => 0,
                          );
                          cart.removeItem(product.id);
                          trackEvent("product removed", {
                            location: "cart",
                            quantity_before: quantity,
                            quantity_after: 0,
                            ...productAnalyticsProperties(product),
                            ...cartTotalsAnalyticsProperties(nextCart.totals),
                          });
                        }}
                        aria-label={`Remove ${product.name} from cart`}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="cart-impact-card" aria-labelledby="cart-impact-title">
            <div className="cart-impact-card__header">
              <div className="cart-impact-card__icon" aria-hidden="true">
                <img src="/dopecart-coupon-ticket.svg" alt="" />
              </div>
              <div>
                <span className="section-kicker">Review summary</span>
                <h2 id="cart-impact-title">Estimated win if this order wanders off.</h2>
              </div>
            </div>

            <div className="cart-impact-grid">
              <div className="cart-impact-line">
                <span>Cart total</span>
                <strong>Rs {cart.totals.totalPrice}</strong>
              </div>
              <div className="cart-impact-line cart-impact-line--coupon">
                <span>Restraint coupon</span>
                <strong>- Rs {cart.totals.totalPrice}</strong>
              </div>
              <div className="cart-impact-line cart-impact-line--payable">
                <span>Estimated payable</span>
                <strong>Rs 0</strong>
              </div>
              <div className="cart-impact-line">
                <span>Items kept offstage</span>
                <strong>{cart.totals.totalQuantity}</strong>
              </div>
              {settings.showCalories ? (
                <div className="cart-impact-line">
                  <span>Calories avoided</span>
                  <strong>{cart.totals.totalCalories}</strong>
                </div>
              ) : null}
              <div className="cart-impact-line">
                <span>Regret average</span>
                <strong>{cart.totals.averageRegretScore}/100</strong>
              </div>
            </div>
          </section>

          <section className="cart-settings-card" aria-label="Calorie visibility">
            <label className="cart-toggle-row">
              <span>
                <strong>Show calories</strong>
                <small>For some brains, numbers help. For others, vibes are enough.</small>
              </span>
              <input
                type="checkbox"
                checked={settings.showCalories}
                onChange={(event) => {
                  settings.setShowCalories(event.target.checked);
                  trackEvent("calorie visibility changed", {
                    location: "cart",
                    show_calories: event.target.checked,
                  });
                }}
              />
            </label>
          </section>

          <section className="cart-hungry-card" aria-label="Actually hungry guidance">
            <div>
              <span className="section-kicker">Real hunger check</span>
              <h2>Actually hungry?</h2>
              <p>
                If your body wants food, feed it. This cart is for impulse loops,
                not for skipping a meal.
              </p>
            </div>

            {showHungryGuidance ? (
              <div className="cart-hungry-card__guidance">
                <p>
                  Try water, leftovers, fruit, eggs, dal-rice, toast, or anything
                  simple your future self will not have to litigate.
                </p>
              </div>
            ) : (
              <Button
                type="button"
                analyticsName="hunger_guidance_open"
                variant="secondary"
                onClick={() => {
                  setShowHungryGuidance(true);
                  trackEvent("hunger guidance opened", {
                    location: "cart",
                    ...cartTotalsAnalyticsProperties(cart.totals),
                  });
                }}
              >
                I'm Actually Hungry
              </Button>
            )}
          </section>

          <aside className="cart-checkout-bar" aria-label="Cart checkout">
            <div className="cart-checkout-bar__art" aria-hidden="true">
              <img src="/dopecart-cart-bag.svg" alt="" />
              <span>{cart.totals.totalQuantity}</span>
            </div>
            <div className="cart-checkout-bar__summary">
              <strong>Estimated saved Rs {cart.totals.totalPrice}</strong>
              <span>
                {cart.totals.totalQuantity} {itemLabel} -{" "}
                {settings.showCalories
                  ? `${cart.totals.totalCalories} cal kept offstage`
                  : `regret ${cart.totals.averageRegretScore}/100`}
              </span>
            </div>
            <Button
              type="button"
              analyticsName="cart_review_order"
              onClick={handlePlaceOrder}
            >
              Review Order
            </Button>
          </aside>
        </>
      )}

      <Toast message={toastMessage} visible={Boolean(toastMessage)} />
    </div>
  );
}
