import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "selected";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  selected?: boolean;
};

const baseClasses =
  "inline-flex min-h-10 items-center justify-center gap-2 rounded-md border px-3.5 py-2 text-sm font-semibold tracking-tight transition-all duration-150 active:translate-y-px disabled:cursor-not-allowed disabled:opacity-50 disabled:active:translate-y-0";

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "border-accent-strong bg-accent text-accent-ink shadow-sm shadow-accent-strong/30 hover:bg-accent-strong hover:shadow-md hover:shadow-accent-strong/40",
  secondary: "border-border bg-surface-muted text-foreground hover:border-foreground/30 hover:bg-border/40",
  ghost: "border-border/70 bg-surface text-foreground hover:border-border hover:bg-surface-muted",
  danger: "border-chroma-red/50 bg-chroma-red/10 text-chroma-red-ink hover:bg-chroma-red/20",
  selected: "border-accent bg-accent/10 text-accent shadow-inner",
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
