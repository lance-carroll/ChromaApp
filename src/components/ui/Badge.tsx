import { colorStyles, threatBucketStyles } from "@/lib/chroma";
import type { ThreatBucket } from "@/lib/chroma";

export function ChromaBadge({ color, label }: { color: string; label?: string }) {
  const style = colorStyles[color] ?? "border-border bg-surface-muted text-foreground";
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${style}`}
    >
      {label ?? color}
    </span>
  );
}

export function ThreatBadge({ bucket, label }: { bucket: ThreatBucket; label?: string }) {
  const style = threatBucketStyles[bucket];
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${style}`}
    >
      {label ?? bucket}
    </span>
  );
}
