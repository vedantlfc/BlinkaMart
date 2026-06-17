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
  const itemLabel = totalQuantity === 1 ? "fake item" : "fake items";
  const label = message ?? (isEmpty ? "Fake cart waiting" : `${totalQuantity} ${itemLabel}`);
  const caloriesCopy = showCalories ? ` - ${totalCalories} cal avoided if cancelled` : "";
  const note = isEmpty
    ? "No snacks, no payment, no driver drama."
    : `Rs ${totalPrice} saved-in-progress${caloriesCopy} - regret ${averageRegretScore}/100`;

  return (
    <aside className="bottom-cart-bar" aria-label="Fake cart status">
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
