import type { SourceType } from "@/lib/types";
import { SOURCE_META } from "@/lib/theme";

// One evidence stream rendered as its colour-coded card. Used side-by-side in
// the arbitration view so the three streams stay visually distinct.
export default function SourceCard({
  source, body,
}: { source: SourceType; body?: string }) {
  const m = SOURCE_META[source];
  return (
    <article
      className={`rounded-card ${m.tw} border border-ink/10 p-4`}
      aria-label={m.label}
    >
      <h3 className="mb-2 text-sm font-semibold text-ink">{m.label}</h3>
      <p className="text-sm leading-relaxed text-ink/90">
        {body ?? "No evidence captured for this stream."}
      </p>
    </article>
  );
}
