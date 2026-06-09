// Domain types — kept in lock-step with supabase/migrations/0001_init.sql.

export type SourceType = "people" | "documents" | "system";
export type HealthStatus = "on_track" | "at_risk";
export type StepKind =
  | "start" | "task" | "decision" | "manual" | "automated" | "sub_process" | "end";
export type FitGapClass =
  | "standard_fit" | "configuration" | "customisation" | "process_change";
export type BacklogTarget = "jira" | "azure_devops" | "servicenow" | "sap_signavio";
export type PipelineStage =
  | "raw" | "extracted" | "candidate" | "sme_validated" | "committed";

export interface Region { id: string; name: string; }
export interface Country { id: string; region_id: string; name: string; iso_code?: string; }
export interface Team { id: string; country_id: string; name: string; }

export interface Process {
  id: string;
  team_id: string;
  name: string;
  description?: string;
  status: HealthStatus;
  progress_pct: number;
  updated_at?: string;
}

export interface CandidateStep {
  id: string;
  process_id: string;
  source: SourceType;
  seq: number;
  step_name: string;       // free text
  actor?: string;          // controlled
  action?: string;         // controlled
  system?: string;         // controlled
  input?: string;          // controlled
  output?: string;         // controlled
  step_kind: StepKind;
  exception?: string;      // free text
  stage: PipelineStage;
  validated_by?: string;
}

export interface Arbitration {
  id: string;
  process_id: string;
  title: string;
  people_summary?: string;
  documents_summary?: string;
  system_summary?: string;
  fit_gap?: FitGapClass;
  resolved: boolean;
  resolution_note?: string;
  resolved_by?: string;
  reversible: boolean;
  created_at: string;
}

// Controlled vocabularies for the structured capture form.
export const ACTORS = ["Customer", "Sales rep", "Finance analyst", "Approver", "System"] as const;
export const ACTIONS = ["Create", "Review", "Approve", "Reject", "Update", "Notify", "Reconcile"] as const;
export const SYSTEMS = ["SAP S/4HANA", "Salesforce", "ServiceNow", "Excel", "Email"] as const;
export const IO_VALUES = ["Order", "Invoice", "Credit memo", "Approval", "Notification", "Report"] as const;
export const STEP_KINDS: StepKind[] =
  ["start", "task", "decision", "manual", "automated", "sub_process", "end"];
export const FIT_GAP: { value: FitGapClass; label: string }[] = [
  { value: "standard_fit", label: "Standard fit" },
  { value: "configuration", label: "Configuration" },
  { value: "customisation", label: "Customisation" },
  { value: "process_change", label: "Process change" },
];
export const BACKLOG_TARGETS: { value: BacklogTarget; label: string }[] = [
  { value: "jira", label: "Jira" },
  { value: "azure_devops", label: "Azure DevOps" },
  { value: "servicenow", label: "ServiceNow" },
  { value: "sap_signavio", label: "SAP Signavio" },
];
