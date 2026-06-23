import { toneColorVars } from "@/lib/chroma";
import type { Tone } from "@/lib/chroma";

export function GaugeBar({
  label,
  value,
  max,
  setValue,
  tone = "accent",
  compact = false,
}: {
  label: string;
  value: number;
  max: number;
  setValue: (value: number) => void;
  tone?: Tone;
  compact?: boolean;
}) {
  const fillColor = toneColorVars[tone] ?? toneColorVars.accent;

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <span
          className={`font-semibold uppercase tracking-wide text-foreground/60 ${
            compact ? "text-[10px]" : "text-xs"
          }`}
        >
          {label}
        </span>
        <span className={`font-mono font-bold ${compact ? "text-sm" : "text-xl"}`}>
          {value}/{max}
        </span>
      </div>
      <div className={`flex gap-1 ${compact ? "mt-1" : "mt-3"}`}>
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
              className={`flex-1 rounded-sm border transition-colors ${
                compact ? "h-4" : "h-8"
              }`}
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
