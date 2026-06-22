import type { Entry, Tone } from "@/lib/chroma";
import { toneColorVars } from "@/lib/chroma";
import { Surface } from "./Surface";

export function TextEntryList({
  title,
  items,
  setItems,
  placeholder,
  tone = "Violet",
}: {
  title: string;
  items: Entry[];
  setItems: (items: Entry[]) => void;
  placeholder: string;
  tone?: Tone;
}) {
  const accentColor = toneColorVars[tone] ?? toneColorVars.Violet;

  return (
    <Surface as="section">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="text-base font-bold">{title}</h2>
        <span className="text-xs font-semibold uppercase tracking-wide text-foreground/50">
          {items.length} active
        </span>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {items.map((item) => (
          <div
            key={item.id}
            className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5"
            style={{
              borderColor: `color-mix(in srgb, ${accentColor} 45%, transparent)`,
              backgroundColor: `color-mix(in srgb, ${accentColor} 12%, transparent)`,
            }}
          >
            <input
              className="bg-transparent text-sm font-semibold outline-none placeholder:font-normal placeholder:text-foreground/40"
              style={{ width: `${Math.max(item.value.length, placeholder.length, 6) + 1}ch` }}
              placeholder={placeholder}
              value={item.value}
              onChange={(event) =>
                setItems(
                  items.map((entry) =>
                    entry.id === item.id ? { ...entry, value: event.target.value } : entry,
                  ),
                )
              }
            />
            <button
              type="button"
              aria-label={`Remove ${title} entry`}
              className="text-foreground/50 hover:text-foreground"
              onClick={() => setItems(items.filter((entry) => entry.id !== item.id))}
            >
              x
            </button>
          </div>
        ))}
        <button
          type="button"
          className="inline-flex h-9 items-center rounded-full border border-dashed border-border px-3 text-sm font-semibold text-foreground/60 hover:border-foreground/40 hover:text-foreground"
          onClick={() => setItems([...items, { id: Date.now(), value: "" }])}
        >
          + Add
        </button>
      </div>
    </Surface>
  );
}
