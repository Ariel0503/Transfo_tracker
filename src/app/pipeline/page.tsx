"use client";

import { useState } from "react";
import { SourceBadge } from "@/components/Badge";
import { MOCK_STEPS } from "@/lib/mock";
import type { CandidateStep, PipelineStage } from "@/lib/types";

const STAGES: { key: PipelineStage; label: string }[] = [
  { key: "raw", label: "Raw input" },
  { key: "extracted", label: "Entity extraction" },
  { key: "candidate", label: "Candidate steps" },
  { key: "sme_validated", label: "SME validation" },
  { key: "committed", label: "Committed BPMN" },
];

// The SME validation stage is a deliberate checkpoint, not a placeholder.
const CHECKPOINT: PipelineStage = "sme_validated";

export default function Pipeline() {
  const [steps, setSteps] = useState<CandidateStep[]>(MOCK_STEPS);

  function validate(id: string) {
    setSteps((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, stage: "sme_validated", validated_by: "SME" } : s
      )
    );
  }

  return (
    <div className="space-y-8">
      <section aria-labelledby="stages-h">
        <h2 id="stages-h" className="mb-1 text-base font-semibold">Extraction pipeline</h2>
        <p className="mb-4 text-sm text-ink-soft">
          Raw input flows left to right. The SME validation checkpoint is mandatory before anything is committed.
        </p>
        <ol className="flex flex-wrap items-stretch gap-2">
          {STAGES.map((s, i) => {
            const isCheckpoint = s.key === CHECKPOINT;
            return (
              <li key={s.key} className="flex items-center gap-2">
                <div
                  className={`rounded-card border px-3 py-2 text-sm font-medium ${
                    isCheckpoint
                      ? "border-ink bg-documents text-ink"
                      : "border-line bg-white text-ink"
                  }`}
                >
                  <span className="font-mono text-xs text-ink-soft">{i + 1}.</span> {s.label}
                  {isCheckpoint && <span className="ml-2 text-xs font-semibold">human-in-the-loop</span>}
                </div>
                {i < STAGES.length - 1 && <span aria-hidden className="text-ink-soft">→</span>}
              </li>
            );
          })}
        </ol>
      </section>

      <section aria-labelledby="queue-h">
        <h2 id="queue-h" className="mb-3 text-base font-semibold">Validation queue</h2>
        <div className="space-y-3">
          {steps.map((s) => {
            const done = s.stage === "sme_validated" || s.stage === "committed";
            return (
              <div key={s.id} className="rounded-card border border-line bg-white p-4 shadow-card">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <SourceBadge source={s.source} />
                    <span className="font-medium text-ink">{s.step_name}</span>
                  </div>
                  {done ? (
                    <span className="rounded-full bg-system px-2.5 py-0.5 text-xs font-semibold text-ink">
                      ● Validated
                    </span>
                  ) : (
                    <button
                      onClick={() => validate(s.id)}
                      className="rounded-md bg-ink px-3 py-1.5 text-sm font-semibold text-white"
                    >
                      Confirm step
                    </button>
                  )}
                </div>
                <dl className="mt-3 grid grid-cols-2 gap-x-6 gap-y-1 text-sm sm:grid-cols-4">
                  <Field k="Actor" v={s.actor} />
                  <Field k="Action" v={s.action} />
                  <Field k="System" v={s.system} mono />
                  <Field k="Type" v={s.step_kind} />
                  {s.exception && <Field k="Exception" v={s.exception} span />}
                </dl>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function Field({ k, v, mono, span }: { k: string; v?: string; mono?: boolean; span?: boolean }) {
  return (
    <div className={span ? "col-span-2 sm:col-span-4" : ""}>
      <dt className="text-xs uppercase tracking-wide text-ink-soft">{k}</dt>
      <dd className={`text-ink ${mono ? "font-mono" : ""}`}>{v || "—"}</dd>
    </div>
  );
}
