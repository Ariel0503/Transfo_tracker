"use client";

import { useState } from "react";
import { SourceBadge } from "@/components/Badge";
import {
  ACTORS, ACTIONS, SYSTEMS, IO_VALUES, STEP_KINDS,
  type SourceType, type StepKind,
} from "@/lib/types";

const INTAKE = [
  { mode: "interview", source: "people" as SourceType, title: "Interview / video", desc: "Record an interview or video walkthrough; transcription feeds extraction." },
  { mode: "document", source: "documents" as SourceType, title: "Document ingestion", desc: "Upload SOPs, work instructions and policies." },
  { mode: "screen", source: "system" as SourceType, title: "Screen capture", desc: "Capture the system as actually used; optional event-log import." },
];

export default function Capture() {
  const [mode, setMode] = useState(INTAKE[1].mode);
  const active = INTAKE.find((i) => i.mode === mode)!;

  return (
    <div className="space-y-8">
      <section aria-labelledby="intake-h">
        <h2 id="intake-h" className="mb-1 text-base font-semibold">Capture evidence</h2>
        <p className="mb-4 text-sm text-ink-soft">
          Choose an intake mode. Each maps to one evidence stream — keep the streams distinct.
        </p>
        <div role="radiogroup" aria-labelledby="intake-h" className="grid gap-4 md:grid-cols-3">
          {INTAKE.map((i) => {
            const selected = i.mode === mode;
            return (
              <button
                key={i.mode}
                role="radio"
                aria-checked={selected}
                onClick={() => setMode(i.mode)}
                className={`rounded-card border p-4 text-left shadow-card transition-colors ${
                  selected ? "border-ink bg-white ring-2 ring-ink" : "border-line bg-white hover:border-ink/40"
                }`}
              >
                <div className="mb-2"><SourceBadge source={i.source} /></div>
                <h3 className="font-semibold text-ink">{i.title}</h3>
                <p className="mt-1 text-sm text-ink-soft">{i.desc}</p>
              </button>
            );
          })}
        </div>
      </section>

      <section aria-labelledby="form-h" className="rounded-card border border-line bg-white p-5 shadow-card">
        <div className="mb-4 flex items-center gap-3">
          <h2 id="form-h" className="text-base font-semibold">Structured step — {active.title}</h2>
          <SourceBadge source={active.source} />
        </div>
        <StructuredForm source={active.source} />
      </section>
    </div>
  );
}

function StructuredForm({ source }: { source: SourceType }) {
  // Controlled dropdowns for actor/action/system/input/output/kind.
  // Free text only for step name and exception.
  const [saved, setSaved] = useState<string | null>(null);

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    // In production this inserts into `candidate_steps` via Supabase.
    setSaved(String(fd.get("step_name") || "Step"));
    e.currentTarget.reset();
  }

  return (
    <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
      <Text name="step_name" label="Step name" placeholder="e.g. Check credit limit" required full />
      <Select name="actor" label="Actor" options={[...ACTORS]} />
      <Select name="action" label="Action" options={[...ACTIONS]} />
      <Select name="system" label="System" options={[...SYSTEMS]} />
      <Select name="step_kind" label="Step type" options={STEP_KINDS as StepKind[]} />
      <Select name="input" label="Input" options={[...IO_VALUES]} />
      <Select name="output" label="Output" options={[...IO_VALUES]} />
      <Text name="exception" label="Exception (free text)" placeholder="e.g. Manual override above £50k" full />
      <input type="hidden" name="source" value={source} />
      <div className="sm:col-span-2 flex items-center gap-3">
        <button type="submit" className="rounded-md bg-ink px-4 py-2 text-sm font-semibold text-white">
          Add candidate step
        </button>
        {saved && (
          <p role="status" className="text-sm text-ink-soft">
            Added “{saved}” to the validation queue.
          </p>
        )}
      </div>
    </form>
  );
}

function Select({ name, label, options }: { name: string; label: string; options: string[] }) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={name} className="text-xs font-medium uppercase tracking-wide text-ink-soft">{label}</label>
      <select id={name} name={name} className="rounded-md border border-line bg-white px-3 py-2 text-sm text-ink">
        <option value="">—</option>
        {options.map((o) => <option key={o} value={o}>{o.replace(/_/g, " ")}</option>)}
      </select>
    </div>
  );
}

function Text({
  name, label, placeholder, required, full,
}: { name: string; label: string; placeholder?: string; required?: boolean; full?: boolean }) {
  return (
    <div className={`flex flex-col gap-1 ${full ? "sm:col-span-2" : ""}`}>
      <label htmlFor={name} className="text-xs font-medium uppercase tracking-wide text-ink-soft">{label}</label>
      <input
        id={name} name={name} placeholder={placeholder} required={required}
        className="rounded-md border border-line bg-white px-3 py-2 text-sm text-ink"
      />
    </div>
  );
}
