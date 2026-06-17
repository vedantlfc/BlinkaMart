export interface ToastProps {
  message: string;
  tone?: "info" | "success";
  visible?: boolean;
}

export function Toast({ message, tone = "info", visible = true }: ToastProps) {
  if (!visible) {
    return null;
  }

  return (
    <div className={`toast toast--${tone}`} role="status" aria-live="polite">
      {message}
    </div>
  );
}
