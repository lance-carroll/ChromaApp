import { Surface } from "./Surface";
import { GaugeBar } from "./GaugeBar";
import type { Tone } from "@/lib/chroma";

export function Counter({
  label,
  value,
  max,
  setValue,
  tone,
}: {
  label: string;
  value: number;
  max: number;
  setValue: (value: number) => void;
  tone?: Tone;
}) {
  return (
    <Surface>
      <GaugeBar label={label} value={value} max={max} setValue={setValue} tone={tone} />
    </Surface>
  );
}
