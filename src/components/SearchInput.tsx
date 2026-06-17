import type { InputHTMLAttributes } from "react";

export interface SearchInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "onChange" | "value"> {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

export function SearchInput({
  label,
  value,
  onChange,
  className = "",
  ...props
}: SearchInputProps) {
  const classes = ["search-input", className].filter(Boolean).join(" ");

  return (
    <label className={classes}>
      <span>{label}</span>
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        {...props}
      />
    </label>
  );
}
