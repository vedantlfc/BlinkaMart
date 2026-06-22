import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/Button";
import { EmptyState } from "../components/EmptyState";
import { PageHeader } from "../components/PageHeader";
import { useSettings } from "../state/settings";
import {
  getProgressBadgeName,
  getReceiptProgressSummary,
  progressBadgeDefinitions,
  useReceiptProgress,
  type CompletedOrderRecord,
} from "../state/receiptProgress";

function formatOrderTime(timestamp: string) {
  const date = new Date(timestamp);

  if (Number.isNaN(date.getTime())) {
    return "Recently";
  }

  return date.toLocaleString([], {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function getItemLabel(totalQuantity: number) {
  return totalQuantity === 1 ? "1 item avoided" : `${totalQuantity} items avoided`;
}

function getPrimaryBadgeName(order: CompletedOrderRecord) {
  const primaryBadgeId = order.badgeIds[0];
  return primaryBadgeId ? getProgressBadgeName(primaryBadgeId) : "Successfully Not Ordered";
}

function getNextGoalPrompt(
  summary: ReturnType<typeof getReceiptProgressSummary>,
  unlockedBadgeIds: Set<string>,
) {
  const nextBadge = progressBadgeDefinitions.find((badge) => !unlockedBadgeIds.has(badge.id));

  if (!nextBadge) {
    return "All current badges are unlocked. The next goal is keeping the streak alive.";
  }

  if (nextBadge.id === "cart-without-consequence") {
    const remainingOrders = Math.max(1, 3 - summary.totalOrders);
    return `${remainingOrders} more completed ritual${
      remainingOrders === 1 ? "" : "s"
    } unlocks Cart Without Consequence.`;
  }

  if (nextBadge.id === "salary-saved") {
    const remainingMoney = Math.max(1, 1000 - summary.totalMoneySaved);
    return `Rs ${remainingMoney} more saved unlocks Salary Saved.`;
  }

  return nextBadge.lockedHint;
}

export function ProgressPage() {
  const navigate = useNavigate();
  const settings = useSettings();
  const receiptProgress = useReceiptProgress();
  const summary = useMemo(
    () => getReceiptProgressSummary(receiptProgress.progress),
    [receiptProgress.progress],
  );
  const unlockedBadgeIds = new Set(summary.unlockedBadgeIds);
  const nextGoalPrompt = useMemo(
    () => getNextGoalPrompt(summary, unlockedBadgeIds),
    [summary, unlockedBadgeIds],
  );
  const hasProgress = summary.totalOrders > 0 || summary.recentOrders.length > 0;

  return (
    <div className="progress-page">
      <PageHeader
        title="Your Cart Ritual Career."
        subtitle="Local progress for cart rituals that ended well."
        trailing={<span className="status-dot">Saved on this browser</span>}
      />

      {!hasProgress ? (
        <section className="progress-empty-section" aria-label="No progress yet">
          <EmptyState
            title="No wins logged yet."
            message="Complete a checkout ritual and this dashboard will start keeping score locally."
          />
          <Button
            type="button"
            analyticsName="products_browse"
            onClick={() => navigate("/products")}
          >
            Browse Shelf
          </Button>
        </section>
      ) : (
        <>
          <section className="progress-hero" aria-labelledby="progress-hero-title">
            <div>
              <span className="section-kicker">Progress</span>
              <h2 id="progress-hero-title">Receipts became receipts of restraint.</h2>
              <p>
                A quiet scoreboard for your exits, saved on this browser.
              </p>
              <p className="progress-next-goal">{nextGoalPrompt}</p>
            </div>
            <span className="progress-hero-mark">{summary.currentStreak}</span>
          </section>

          <section className="progress-stats-section" aria-labelledby="progress-stats-title">
            <div className="section-heading">
              <span className="section-kicker">Totals</span>
              <h2 id="progress-stats-title">What stayed fictional</h2>
            </div>

            <dl className="progress-stat-grid">
              <div>
                <dt>Orders avoided</dt>
                <dd>{summary.totalOrders}</dd>
              </div>
              <div>
                <dt>Money not spent</dt>
                <dd>Rs {summary.totalMoneySaved}</dd>
              </div>
              <div>
                <dt>Current streak</dt>
                <dd>{summary.currentStreak}</dd>
              </div>
              <div>
                <dt>Longest streak</dt>
                <dd>{summary.longestStreak}</dd>
              </div>
              {settings.showCalories ? (
                <div>
                  <dt>Calories avoided</dt>
                  <dd>{summary.totalCaloriesAvoided}</dd>
                </div>
              ) : null}
            </dl>
          </section>

          <section className="progress-badges-section" aria-labelledby="progress-badges-title">
            <div className="section-heading">
              <span className="section-kicker">Badges</span>
              <h2 id="progress-badges-title">Tiny trophies, locally stored</h2>
              <p>Unlocked badges come from completed order rituals only.</p>
            </div>

            <div className="progress-badge-grid">
              {progressBadgeDefinitions.map((badge) => {
                const unlocked = unlockedBadgeIds.has(badge.id);

                return (
                  <article
                    className={`progress-badge-card ${
                      unlocked ? "progress-badge-card--unlocked" : "progress-badge-card--locked"
                    }`}
                    key={badge.id}
                  >
                    <div className="progress-badge-card__top">
                      <span>{unlocked ? "Unlocked" : "Locked"}</span>
                      <strong aria-hidden="true">{unlocked ? "OK" : "--"}</strong>
                    </div>
                    <h3>{badge.name}</h3>
                    <p>
                      {unlocked
                        ? "Earned by catching the craving at the right moment."
                        : badge.lockedHint}
                    </p>
                  </article>
                );
              })}
            </div>
          </section>

          <section className="progress-history-section" aria-labelledby="progress-history-title">
            <div className="section-heading">
              <span className="section-kicker">Recent history</span>
              <h2 id="progress-history-title">Recently avoided carts</h2>
              <p>Only completed order rituals appear here.</p>
            </div>

            <ol className="progress-history-list">
              {summary.recentOrders.map((order) => (
                <li className="progress-history-item" key={order.id}>
                  <div>
                    <span>{getPrimaryBadgeName(order)}</span>
                    <strong>{formatOrderTime(order.timestamp)}</strong>
                    <small>{order.id}</small>
                  </div>
                  <dl>
                    <div>
                      <dt>Saved</dt>
                      <dd>Rs {order.totalPrice}</dd>
                    </div>
                    <div>
                      <dt>Items</dt>
                      <dd>{getItemLabel(order.totalQuantity)}</dd>
                    </div>
                    {settings.showCalories ? (
                      <div>
                        <dt>Calories</dt>
                        <dd>{order.totalCalories}</dd>
                      </div>
                    ) : null}
                  </dl>
                </li>
              ))}
            </ol>
          </section>

          <div className="cart-cta-row" aria-label="Progress actions">
            <Button
              type="button"
              analyticsName="products_browse"
              onClick={() => navigate("/products")}
            >
              Build Another Cart
            </Button>
            <Button
              type="button"
              analyticsName="home_open"
              variant="secondary"
              onClick={() => navigate("/")}
            >
              Home
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
