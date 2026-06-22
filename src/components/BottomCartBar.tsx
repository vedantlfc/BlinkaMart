import { Button } from "./Button";

export interface BottomCartBarProps {
  message?: string;
  totalQuantity?: number;
  totalPrice?: number;
  totalCalories?: number;
  averageRegretScore?: number;
  showCalories?: boolean;
  actionLabel?: string;
  actionDisabled?: boolean;
  actionAnalyticsName?: string;
  onAction?: () => void;
}

export function BottomCartBar({
  message,
  totalQuantity = 0,
  totalPrice = 0,
  totalCalories = 0,
  averageRegretScore = 0,
  showCalories = true,
  actionLabel,
  actionDisabled = false,
  actionAnalyticsName,
  onAction,
}: BottomCartBarProps) {
  const isEmpty = totalQuantity === 0;
  const itemLabel = totalQuantity === 1 ? "item" : "items";
  const label = message ?? "Cart waiting";
  const note = isEmpty
    ? "Cart is calm. Cravings are rehearsing."
    : `${totalQuantity} ${itemLabel} - ${
        showCalories
          ? `${totalCalories} cal kept offstage`
          : `regret ${averageRegretScore}/100`
      }`;
  const hasAction = !isEmpty && Boolean(actionLabel) && Boolean(onAction);

  return (
    <aside
      className={["bottom-cart-bar", hasAction ? "bottom-cart-bar--active" : "bottom-cart-bar--idle"]
        .filter(Boolean)
        .join(" ")}
      aria-label="Cart status"
    >
      <div className="bottom-cart-bar__art" aria-hidden="true">
        <img src="/dopecart-cart-bag.svg" alt="" />
        {!isEmpty ? <span>{totalQuantity}</span> : null}
      </div>

      <div className="bottom-cart-bar__summary">
        <span className="cart-label">
          {isEmpty ? label : `Estimated saved Rs ${totalPrice}`}
        </span>
        <span className="cart-note">{note}</span>
      </div>

      {hasAction ? (
        <Button
          type="button"
          analyticsName={actionAnalyticsName}
          variant="primary"
          size="compact"
          onClick={onAction}
          disabled={actionDisabled}
        >
          {actionLabel}
        </Button>
      ) : null}
    </aside>
  );
}
