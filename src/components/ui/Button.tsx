import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "selected";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  selected?: boolean;
};

const baseClasses =
  "inline-flex min-h-10 items-center justify-center gap-2 rounded-md border px-3 py-2 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50";

const variantClasses: Record<ButtonVariant, string> = {
  primary: "border-accent bg-accent text-accent-ink hover:opacity-90",
  secondary: "border-border bg-surface-muted text-foreground hover:bg-border/40",
  ghost: "border-border bg-surface text-foreground hover:bg-surface-muted",
  danger: "border-chroma-red/50 bg-chroma-red/10 text-chroma-red-ink hover:bg-chroma-red/20",
  selected: "border-accent bg-accent/10 text-accent",
};

export function Button({
  variant = "ghost",
  selected = false,
  className = "",
  type = "button",
  ...rest
}: ButtonProps) {
  const resolvedVariant = selected ? "selected" : variant;

  return (
    <button
      type={type}
      className={`${baseClasses} ${variantClasses[resolvedVariant]} ${className}`.trim()}
      {...rest}
    />
  );
}
