import type { HealthStatus } from "@/lib/types";

// Accessible progress bar with explicit aria values.
export default function ProgressBar({
  pct, status,
}: { pct: number; status: HealthStatus }) {
  const fill = status === "on_track" ? "bg-system" : "bg-documents";
  return (
    <div className="flex items-center gap-3">
      <div
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        className="h-2.5 flex-1 overflow-hidden rounded-full bg-line"
      >
        <div className={`h-full ${fill}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="w-10 text-right text-sm font-medium tabular-nums text-ink">{pct}%</span>
    </div>
  );
}
