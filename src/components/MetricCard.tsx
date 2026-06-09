export default function MetricCard({
  label, value, sub, tone = "canvas",
}: {
  label: string; value: string | number; sub?: string;
  tone?: "canvas" | "people" | "documents" | "system";
}) {
  const bg = {
    canvas: "bg-white", people: "bg-people",
    documents: "bg-documents", system: "bg-system",
  }[tone];
  return (
    <div className={`rounded-card border border-line ${bg} p-4 shadow-card`}>
      <p className="text-xs font-medium uppercase tracking-wide text-ink-soft">{label}</p>
      <p className="mt-1 text-3xl font-semibold tabular-nums text-ink">{value}</p>
      {sub && <p className="mt-1 text-sm text-ink-soft">{sub}</p>}
    </div>
  );
}
