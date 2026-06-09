import type { SourceType, HealthStatus } from "./types";

// Single source of truth for the colour->meaning mapping.
export const PALETTE = {
  people: "#D2E0FB",
  documents: "#F9F3CC",
  system: "#D7E5CA",
  header: "#8EACCD",
} as const;

// Evidence streams. Labels follow the "X says / X shows" methodology wording.
export const SOURCE_META: Record<
  SourceType,
  { label: string; bg: string; tw: string }
> = {
  people: { label: "People say", bg: PALETTE.people, tw: "bg-people" },
  documents: { label: "Documents say", bg: PALETTE.documents, tw: "bg-documents" },
  system: { label: "System shows", bg: PALETTE.system, tw: "bg-system" },
};

// Status reuses the same yellow/green so colour stays consistent with meaning.
export const STATUS_META: Record<
  HealthStatus,
  { label: string; bg: string; tw: string }
> = {
  on_track: { label: "On track", bg: PALETTE.system, tw: "bg-system" },
  at_risk: { label: "At risk", bg: PALETTE.documents, tw: "bg-documents" },
};
