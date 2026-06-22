import { useState } from "react";
import { Surface } from "./Surface";

export function CollapsibleSection({
  title,
  summary,
  defaultOpen = false,
  children,
}: {
  title: string;
  summary?: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <Surface as="section" padded={false}>
      <button
        type="button"
        className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left transition-colors hover:bg-surface-muted"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
      >
        <div className="min-w-0">
          <h2 className="text-xl font-bold">{title}</h2>
          {summary ? <p className="mt-1 text-sm text-foreground/70">{summary}</p> : null}
        </div>
        <span
          className={`shrink-0 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide transition-colors ${
            open
              ? "border-accent/40 bg-accent/10 text-accent"
              : "border-border text-foreground/50"
          }`}
        >
          {open ? "Hide" : "Show"}
        </span>
      </button>
      {open ? <div className="border-t border-border p-5">{children}</div> : null}
    </Surface>
  );
}
