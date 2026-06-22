import type { ButtonHTMLAttributes, ReactNode } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  analyticsName?: string;
  variant?: "primary" | "secondary" | "ghost";
  size?: "normal" | "compact";
}

export function Button({
  analyticsName,
  children,
  className = "",
  variant = "primary",
  size = "normal",
  type = "button",
  ...props
}: ButtonProps) {
  const classes = ["button", `button--${variant}`, `button--${size}`, className]
    .filter(Boolean)
    .join(" ");

  return (
    <button className={classes} data-attr={analyticsName} type={type} {...props}>
      {children}
    </button>
  );
}
