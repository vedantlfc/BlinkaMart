import { Button } from "./Button";

export interface BottomCartBarProps {
  message?: string;
}

export function BottomCartBar({ message = "Fake cart waiting" }: BottomCartBarProps) {
  return (
    <aside className="bottom-cart-bar" aria-label="Fake cart status">
      <div>
        <span className="cart-label">{message}</span>
        <span className="cart-note">No snacks, no payment, no driver drama.</span>
      </div>
      <Button type="button" variant="secondary" size="compact">
        Soon
      </Button>
    </aside>
  );
}
