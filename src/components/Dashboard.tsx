"use client";

import { useMemo, useState } from "react";
import MetricCard from "@/components/MetricCard";
import ProgressBar from "@/components/ProgressBar";
import { StatusBadge } from "@/components/Badge";
import { MOCK_PROCESSES, MOCK_FILTERS, MOCK_MILESTONES } from "@/lib/mock";
import { formatDate } from "@/lib/format";

const ALL = "All";

export default function Dashboard() {
  const [region, setRegion] = useState(ALL);
  const [country, setCountry] = useState(ALL);
  const [team, setTeam] = useState(ALL);

  const rows = useMemo(
    () =>
      MOCK_PROCESSES.filter(
        (p) =>
          (region === ALL || p.region === region) &&
          (country === ALL || p.country === country) &&
          (team === ALL || p.team === team)
      ),
    [region, country, team]
  );

  const onTrack = rows.filter((p) => p.status === "on_track").length;
  const atRisk = rows.filter((p) => p.status === "at_risk").length;
  const avg = rows.length
    ? Math.round(rows.reduce((s, p) => s + p.progress_pct, 0) / rows.length)
    : 0;

  return (
    <div className="space-y-8">
      <section aria-labelledby="filters-h">
        <h2 id="filters-h" className="sr-only">Filters</h2>
        <div className="flex flex-wrap gap-4 rounded-card border border-line bg-white p-4 shadow-card">
          <Filter label="Region" value={region} onChange={setRegion} options={MOCK_FILTERS.regions} />
          <Filter label="Country" value={country} onChange={setCountry} options={MOCK_FILTERS.countries} />
          <Filter label="Team" value={team} onChange={setTeam} options={MOCK_FILTERS.teams} />
        </div>
      </section>

      <section aria-labelledby="summary-h">
        <h2 id="summary-h" className="mb-3 text-base font-semibold">Programme summary</h2>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <MetricCard label="Processes" value={rows.length} sub="in current view" />
          <MetricCard label="On track" value={onTrack} tone="system" />
          <MetricCard label="At risk" value={atRisk} tone="documents" />
          <MetricCard label="Avg. progress" value={`${avg}%`} tone="people" />
        </div>
      </section>

      <section aria-labelledby="progress-h">
        <h2 id="progress-h" className="mb-3 text-base font-semibold">Process progress</h2>
        <div className="overflow-hidden rounded-card border border-line bg-white shadow-card">
          <table className="w-full text-left text-sm">
            <thead className="bg-header/40 text-ink">
              <tr>
                <th scope="col" className="px-4 py-3 font-semibold">Process</th>
                <th scope="col" className="hidden px-4 py-3 font-semibold md:table-cell">Region / Country</th>
                <th scope="col" className="hidden px-4 py-3 font-semibold sm:table-cell">Team</th>
                <th scope="col" className="px-4 py-3 font-semibold">Status</th>
                <th scope="col" className="px-4 py-3 font-semibold">Progress</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((p) => (
                <tr key={p.id} className="border-t border-line align-middle">
                  <td className="px-4 py-3 font-medium text-ink">{p.name}</td>
                  <td className="hidden px-4 py-3 text-ink-soft md:table-cell">{p.region} · {p.country}</td>
                  <td className="hidden px-4 py-3 text-ink-soft sm:table-cell">{p.team}</td>
                  <td className="px-4 py-3"><StatusBadge status={p.status} /></td>
                  <td className="px-4 py-3 w-56"><ProgressBar pct={p.progress_pct} status={p.status} /></td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr><td colSpan={5} className="px-4 py-8 text-center text-ink-soft">No processes match these filters.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section aria-labelledby="timeline-h">
        <h2 id="timeline-h" className="mb-3 text-base font-semibold">Milestone timeline</h2>
        <ol className="space-y-3">
          {MOCK_MILESTONES.map((m) => (
            <li key={m.id} className="flex items-center gap-4 rounded-card border border-line bg-white p-4 shadow-card">
              <span
                aria-hidden
                className={`h-3 w-3 shrink-0 rounded-full ${m.status === "on_track" ? "bg-system" : "bg-documents"}`}
              />
              <span className="flex-1 font-medium text-ink">{m.label}</span>
              <time className="font-mono text-sm text-ink-soft" dateTime={m.date}>{formatDate(m.date)}</time>
              <StatusBadge status={m.status} />
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}

function Filter({
  label, value, onChange, options,
}: {
  label: string; value: string; onChange: (v: string) => void; options: string[];
}) {
  const id = `filter-${label.toLowerCase()}`;
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-xs font-medium uppercase tracking-wide text-ink-soft">{label}</label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="min-w-44 rounded-md border border-line bg-white px-3 py-2 text-sm text-ink"
      >
        <option>{ALL}</option>
        {options.map((o) => <option key={o}>{o}</option>)}
      </select>
    </div>
  );
}
