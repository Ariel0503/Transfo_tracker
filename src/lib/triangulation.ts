// lib/triangulation.ts
// Single source of truth for the triangulation methodology: the four-colour
// palette, the three evidence streams, and the capture sources that feed them.
// Colour-to-meaning is load-bearing — keep every screen importing from here.

export type EvidenceStream = 'people' | 'documents' | 'system';

export interface StreamConfig {
  id: EvidenceStream;
  /** Stream name — carries the meaning for anyone who can't rely on colour. */
  label: string;
  /** Short descriptor of what this stream proves. */
  blurb: string;
  /** Brand background hex. */
  bg: string;
  /** Dark text from the same colour family (readable on `bg`). */
  text: string;
}

export const PALETTE = {
  people: '#D2E0FB',     // light blue  — people / regional data
  documents: '#F9F3CC',  // light yellow — documents / at-risk
  system: '#D7E5CA',     // light green  — system-observed / on-track
  header: '#8EACCD',      // medium blue  — structural headers
} as const;

/** Ordered people → documents → system, the canonical triangulation order. */
export const STREAMS: StreamConfig[] = [
  { id: 'people',    label: 'People say',    blurb: 'What practitioners describe', bg: PALETTE.people,    text: '#1b3a6b' },
  { id: 'documents', label: 'Documents say', blurb: 'What the records state',      bg: PALETTE.documents, text: '#5a4d12' },
  { id: 'system',    label: 'System shows',  blurb: 'What actually happened',      bg: PALETTE.system,    text: '#3a5226' },
];

export const STRUCTURAL_HEADER = PALETTE.header;
export const STRUCTURAL_HEADER_TEXT = '#14304f';

export type CaptureSourceId = 'video' | 'form' | 'documents' | 'screen' | 'event-log';
export type IconName = 'video' | 'form' | 'document' | 'screen' | 'log';

export interface CaptureSource {
  id: CaptureSourceId;
  stream: EvidenceStream;
  /** Action-first label: leads with the verb. */
  title: string;
  /** Plain-language description of what the option does. */
  description: string;
  /** Verb-matched meta label, paired with a dd/mm/yyyy date. */
  metaLabel: string;
  icon: IconName;
}

export const CAPTURE_SOURCES: CaptureSource[] = [
  { id: 'video',     stream: 'people',    title: 'Upload a video',     description: 'Add an interview or walkthrough — we transcribe it for you.', metaLabel: 'Last upload',  icon: 'video' },
  { id: 'form',      stream: 'people',    title: 'Fill in a form',     description: 'Answer guided questions about a process, step by step.',     metaLabel: 'Last entry',   icon: 'form' },
  { id: 'documents', stream: 'documents', title: 'Upload documents',   description: 'Add SOPs, policies, or process maps for the system to read.', metaLabel: 'Last upload',  icon: 'document' },
  { id: 'screen',    stream: 'system',    title: 'Capture your screen', description: 'Record yourself doing the task — we detect the steps.',      metaLabel: 'Last capture', icon: 'screen' },
  { id: 'event-log', stream: 'system',    title: 'Import an event log', description: 'Upload a system export (CSV) to rebuild the real flow.',     metaLabel: 'Last import',  icon: 'log' },
];

/** Programme-wide date format: dd/mm/yyyy. */
export function formatDate(value: Date | string): string {
  const d = typeof value === 'string' ? new Date(value) : value;
  if (Number.isNaN(d.getTime())) return '';
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}
