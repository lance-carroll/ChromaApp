import type { HTMLAttributes } from "react";

type SurfaceProps = HTMLAttributes<HTMLDivElement> & {
  as?: "div" | "section";
  padded?: boolean;
};

export function Surface({
  as = "div",
  padded = true,
  className = "",
  children,
  ...rest
}: SurfaceProps) {
  const Tag = as;
  return (
    <Tag
      className={`surface-shadow rounded-xl border border-border bg-surface ${
        padded ? "p-5" : ""
      } ${className}`.trim()}
      {...rest}
    >
      {children}
    </Tag>
  );
}
