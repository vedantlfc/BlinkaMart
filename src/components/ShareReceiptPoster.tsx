import { forwardRef } from "react";
import { products } from "../data/catalog";
import type { OrderSnapshot } from "../state/order";
import type { ReceiptProgressState } from "../state/receiptProgress";

export interface ShareReceiptPosterProps {
  order: OrderSnapshot;
  badge: string;
  progress: ReceiptProgressState;
}

const productById = new Map(products.map((product) => [product.id, product]));

function getStreakLabel(streak: number) {
  return streak === 1 ? "1 day" : `${streak} days`;
}

function getItemLabel(totalQuantity: number) {
  return totalQuantity === 1 ? "1 item" : `${totalQuantity} items`;
}

export const ShareReceiptPoster = forwardRef<HTMLDivElement, ShareReceiptPosterProps>(
  function ShareReceiptPoster({ order, badge, progress }, ref) {
    const visibleItems = order.items.slice(0, 3);
    const extraItemCount = Math.max(0, order.items.length - visibleItems.length);

    return (
      <div className="share-poster" ref={ref} aria-label="Shareable DopeCart receipt poster">
        <div className="share-poster__background-mark" aria-hidden="true">DC</div>

        <header className="share-poster__header">
          <div className="share-poster__brand">
            <span className="share-poster__logo" aria-hidden="true">
              <img src="/dopecart-logo-web.svg" alt="" />
            </span>
            <span>
              <strong>DopeCart</strong>
              <small>We deliver Dopamine</small>
            </span>
          </div>
        </header>

        <section className="share-poster__hero" aria-label="Receipt headline">
          <span>Receipt unlocked</span>
          <h2>Successfully Not Ordered</h2>
          <p>Order lost near Self Control Signal.</p>
        </section>

        <section className="share-poster__metric" aria-label="Money saved">
          <span>Saved</span>
          <strong>Rs {order.totalPrice}</strong>
          <small>{getItemLabel(order.totalQuantity)} kept offstage</small>
        </section>

        <section className="share-poster__lineup" aria-label="Avoided item lineup">
          <div className="share-poster__lineup-header">
            <span>Craving lineup</span>
            {extraItemCount > 0 ? <strong>+{extraItemCount} more</strong> : null}
          </div>
          <div className="share-poster__thumbs">
            {visibleItems.map((item) => {
              const product = productById.get(item.productId);

              return (
                <article className="share-poster__thumb" key={item.productId}>
                  {product ? (
                    <img src={product.imageSrc} alt={product.fullName || product.name} />
                  ) : null}
                  <span>{item.quantity}x</span>
                </article>
              );
            })}
          </div>
        </section>

        <section className="share-poster__stats" aria-label="Receipt stats">
          <div>
            <span>Badge</span>
            <strong>{badge}</strong>
          </div>
          <div>
            <span>Streak</span>
            <strong>{getStreakLabel(progress.currentStreak)}</strong>
          </div>
          <div>
            <span>Regret avoided</span>
            <strong>{order.averageRegretScore}/100</strong>
          </div>
          {order.showCalories ? (
            <div>
              <span>Calories avoided</span>
              <strong>{order.totalCalories}</strong>
            </div>
          ) : null}
        </section>

      </div>
    );
  },
);
