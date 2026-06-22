import { toneColorVars } from "@/lib/chroma";
import type { Tone } from "@/lib/chroma";

export function GaugeBar({
  label,
  value,
  max,
  setValue,
  tone = "accent",
}: {
  label: string;
  value: number;
  max: number;
  setValue: (value: number) => void;
  tone?: Tone;
}) {
  const fillColor = toneColorVars[tone] ?? toneColorVars.accent;

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-semibold uppercase tracking-wide text-foreground/60">
          {label}
        </span>
        <span className="font-mono text-xl font-bold">
          {value}/{max}
        </span>
      </div>
      <div className="mt-3 flex gap-1">
        {Array.from({ length: max }, (_, index) => {
          const filled = index < value;

          return (
            <button
              key={index}
              type="button"
              aria-label={
                filled && index === value - 1
                  ? `Clear ${label} segment ${index + 1}`
                  : `Fill ${label} up to ${index + 1}`
              }
              className="h-8 flex-1 rounded-sm border transition-colors"
              style={
                filled
                  ? { backgroundColor: fillColor, borderColor: fillColor }
                  : { borderColor: "var(--color-border)" }
              }
              onClick={() => setValue(index + 1 === value ? index : index + 1)}
            />
          );
        })}
      </div>
    </div>
  );
}
