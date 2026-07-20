export type SourceType = "people" | "documents" | "system";
export type HealthStatus = "on_track" | "at_risk";
export type Process = {
  id: string;
  team_id: string;
  name: string;
  status: HealthStatus;
  progress_pct: number;
  updated_at: string;
};

export type CandidateStep = {
  id: string;
  process_id: string;
  source: SourceType;
  seq: number;
  step_name: string;
  actor: string;
  action: string;
  system: string;
  input?: string;
  output?: string;
  step_kind: string;
  exception?: string;
  stage: "candidate" | "extracted" | "sme_validated" | "committed";
  validated_by?: string;
};

export type PipelineStage = "raw" | "extracted" | "candidate" | "sme_validated" | "committed";

export type Arbitration = {
  id: string;
  process_id: string;
  title: string;
  people_summary: string;
  documents_summary: string;
  system_summary: string;
  fit_gap?: string;
  resolved: boolean;
  reversible: boolean;
  created_at: string;
};

export type FitGapClass = "fit" | "gap" | "partial";
export const FIT_GAP: { value: FitGapClass; label: string }[] = [
  { value: "fit", label: "Fit" },
  { value: "gap", label: "Gap" },
  { value: "partial", label: "Partial" },
];

export type BacklogTarget = "jira" | "service-now" | "azure-devops";
export const BACKLOG_TARGETS: { value: BacklogTarget; label: string }[] = [
  { value: "jira", label: "Jira" },
  { value: "service-now", label: "ServiceNow" },
  { value: "azure-devops", label: "Azure DevOps" },
];

import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    user: { roles: string[] } & DefaultSession["user"];
  }
}