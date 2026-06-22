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
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left hover:bg-surface-muted"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
      >
        <div className="min-w-0">
          <h2 className="text-base font-bold">{title}</h2>
          {summary ? <p className="mt-1 text-sm text-foreground/70">{summary}</p> : null}
        </div>
        <span className="shrink-0 text-xs font-semibold uppercase tracking-wide text-foreground/50">
          {open ? "Hide" : "Show"}
        </span>
      </button>
      {open ? <div className="border-t border-border p-4">{children}</div> : null}
    </Surface>
  );
}
