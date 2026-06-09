import type { SourceType, HealthStatus } from "@/lib/types";
import { SOURCE_META, STATUS_META } from "@/lib/theme";

// Colour-coded badge. Text label is always present so meaning never relies on
// colour alone (accessibility: do not encode information with colour only).
export function SourceBadge({ source }: { source: SourceType }) {
  const m = SOURCE_META[source];
  return (
    <span
      className={`inline-flex items-center rounded-full ${m.tw} px-2.5 py-0.5 text-xs font-semibold text-ink`}
    >
      {m.label}
    </span>
  );
}

export function StatusBadge({ status }: { status: HealthStatus }) {
  const m = STATUS_META[status];
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full ${m.tw} px-2.5 py-0.5 text-xs font-semibold text-ink`}
    >
      <span aria-hidden>{status === "on_track" ? "●" : "▲"}</span>
      {m.label}
    </span>
  );
}
