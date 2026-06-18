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
  onAction,
}: BottomCartBarProps) {
  const isEmpty = totalQuantity === 0;
  const itemLabel = totalQuantity === 1 ? "item" : "items";
  const label = message ?? (isEmpty ? "Cart waiting" : `${totalQuantity} ${itemLabel}`);
  const caloriesCopy = showCalories ? ` - ${totalCalories} cal kept offstage` : "";
  const note = isEmpty
    ? "Cart is calm. Cravings are rehearsing."
    : `Rs ${totalPrice} saved-in-progress${caloriesCopy} - regret ${averageRegretScore}/100`;
  const hasAction = !isEmpty && Boolean(actionLabel) && Boolean(onAction);

  return (
    <aside
      className={["bottom-cart-bar", hasAction ? "bottom-cart-bar--active" : ""]
        .filter(Boolean)
        .join(" ")}
      aria-label="Cart status"
    >
      <div>
        <span className="cart-label">{label}</span>
        <span className="cart-note">{note}</span>
      </div>
      {!isEmpty && actionLabel ? (
        <Button
          type="button"
          variant="secondary"
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
