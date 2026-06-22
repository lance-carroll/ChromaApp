import { Surface } from "./Surface";
import { Button } from "./Button";

export function Counter({
  label,
  value,
  max,
  setValue,
}: {
  label: string;
  value: number;
  max: number;
  setValue: (value: number) => void;
}) {
  return (
    <Surface>
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-semibold uppercase tracking-wide text-foreground/60">
          {label}
        </span>
        <span className="font-mono text-xl font-bold">
          {value}/{max}
        </span>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2">
        <Button
          variant="secondary"
          className="h-10 text-xl"
          aria-label={`Decrease ${label}`}
          onClick={() => setValue(Math.max(0, value - 1))}
        >
          -
        </Button>
        <Button
          variant="secondary"
          className="h-10 text-xl"
          aria-label={`Increase ${label}`}
          onClick={() => setValue(Math.min(max, value + 1))}
        >
          +
        </Button>
      </div>
    </Surface>
  );
}
