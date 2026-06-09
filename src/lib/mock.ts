import type { Process, CandidateStep, Arbitration } from "./types";

// Fallback data used only when Supabase is not yet configured. Shapes match
// the DB rows exactly, so swapping in live queries needs no UI changes.

export const MOCK_FILTERS = {
  regions: ["EMEA", "APAC", "Americas"],
  countries: ["United Kingdom", "Germany", "Singapore", "United States"],
  teams: ["Order to Cash", "Procure to Pay", "Record to Report", "Hire to Retire"],
};

export const MOCK_PROCESSES: (Process & {
  region: string; country: string; team: string;
})[] = [
  { id: "p1", team_id: "t1", name: "Customer credit check", status: "on_track", progress_pct: 82, region: "EMEA", country: "United Kingdom", team: "Order to Cash", updated_at: "2026-06-04" },
  { id: "p2", team_id: "t2", name: "Supplier onboarding", status: "at_risk", progress_pct: 47, region: "EMEA", country: "United Kingdom", team: "Procure to Pay", updated_at: "2026-06-02" },
  { id: "p3", team_id: "t3", name: "Month-end close", status: "at_risk", progress_pct: 38, region: "EMEA", country: "Germany", team: "Record to Report", updated_at: "2026-05-30" },
  { id: "p4", team_id: "t4", name: "New-joiner provisioning", status: "on_track", progress_pct: 74, region: "APAC", country: "Singapore", team: "Hire to Retire", updated_at: "2026-06-05" },
  { id: "p5", team_id: "t5", name: "Customer credit check", status: "at_risk", progress_pct: 55, region: "Americas", country: "United States", team: "Order to Cash", updated_at: "2026-06-01" },
];

export const MOCK_MILESTONES = [
  { id: "m1", label: "Discovery complete", date: "2026-06-20", status: "on_track" as const },
  { id: "m2", label: "Standardisation sign-off", date: "2026-07-15", status: "at_risk" as const },
  { id: "m3", label: "Fit-gap review", date: "2026-08-05", status: "at_risk" as const },
  { id: "m4", label: "Backlog handover", date: "2026-09-01", status: "on_track" as const },
];

export const MOCK_STEPS: CandidateStep[] = [
  { id: "s1", process_id: "p2", source: "people", seq: 1, step_name: "Receive supplier request", actor: "Sales rep", action: "Create", system: "Email", input: "Order", output: "Notification", step_kind: "start", stage: "candidate" },
  { id: "s2", process_id: "p2", source: "documents", seq: 2, step_name: "Check policy threshold", actor: "Finance analyst", action: "Review", system: "Excel", input: "Order", output: "Approval", step_kind: "decision", exception: "Manual override above £50k", stage: "extracted" },
  { id: "s3", process_id: "p2", source: "system", seq: 3, step_name: "Create vendor master", actor: "System", action: "Update", system: "SAP S/4HANA", input: "Approval", output: "Report", step_kind: "automated", stage: "candidate" },
];

export const MOCK_ARBITRATIONS: Arbitration[] = [
  {
    id: "a1",
    process_id: "p2",
    title: "Supplier approval threshold disagreement",
    people_summary: "Interviewees say any request over £25k goes to the finance manager for sign-off.",
    documents_summary: "The SOP (v3, 11/2025) sets the manual-approval threshold at £50k.",
    system_summary: "SAP workflow log shows the approval step triggers at £50k with no exceptions in the last 90 days.",
    fit_gap: undefined,
    resolved: false,
    reversible: true,
    created_at: "2026-06-03",
  },
];
