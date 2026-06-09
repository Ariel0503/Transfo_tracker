-- ============================================================================
--  Transformation Tracker — initial schema
--  Methodology: triangulation of three distinct evidence streams
--    people-say (blue) · documents-say (yellow) · system-shows (green)
--  Architecture layers: Capture -> Model Repository -> Standardisation
--                       -> Fit-Gap Comparison -> Outputs (backlog)
-- ============================================================================

-- ---- Enumerated, controlled vocabularies -----------------------------------
-- Evidence stream. The three are NOT interchangeable.
create type source_type as enum ('people', 'documents', 'system');

-- Health status used on the dashboard.
create type health_status as enum ('on_track', 'at_risk');

-- Structured-form controlled values (free text only for step name + exception).
create type step_kind as enum ('start', 'task', 'decision', 'manual', 'automated', 'sub_process', 'end');

-- Fit-gap taxonomy applied at arbitration.
create type fit_gap_class as enum ('standard_fit', 'configuration', 'customisation', 'process_change');

-- Where committed backlog items are pushed.
create type backlog_target as enum ('jira', 'azure_devops', 'servicenow', 'sap_signavio');

-- Pipeline checkpoint: raw -> extracted -> candidate -> validated -> committed.
create type pipeline_stage as enum ('raw', 'extracted', 'candidate', 'sme_validated', 'committed');

-- ---- Geography & ownership --------------------------------------------------
create table regions (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  created_at  timestamptz not null default now()
);

create table countries (
  id          uuid primary key default gen_random_uuid(),
  region_id   uuid not null references regions(id) on delete cascade,
  name        text not null,
  iso_code    text,
  created_at  timestamptz not null default now()
);

create table teams (
  id          uuid primary key default gen_random_uuid(),
  country_id  uuid not null references countries(id) on delete cascade,
  name        text not null,
  created_at  timestamptz not null default now()
);

-- ---- Processes being captured ----------------------------------------------
create table processes (
  id            uuid primary key default gen_random_uuid(),
  team_id       uuid not null references teams(id) on delete cascade,
  name          text not null,
  description   text,
  status        health_status not null default 'at_risk',
  progress_pct  int not null default 0 check (progress_pct between 0 and 100),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- ---- Capture layer: raw evidence, tagged by stream -------------------------
-- Three intake modes (video/interview, structured form, screen capture) plus
-- document ingestion and optional event-log import all land here as evidence.
create table evidence (
  id            uuid primary key default gen_random_uuid(),
  process_id    uuid not null references processes(id) on delete cascade,
  source        source_type not null,            -- drives the colour everywhere
  intake_mode   text not null,                   -- 'interview' | 'form' | 'screen' | 'document' | 'event_log'
  captured_by   text,
  captured_at   timestamptz not null default now(),
  raw_payload   jsonb not null default '{}'::jsonb,
  transcript    text                             -- transcription for interview/screen
);

-- ---- Standardisation: candidate steps (tight, controlled schema) -----------
-- Controlled dropdowns: actor, action, system, input, output, step_kind.
-- Free text only: step_name, exception.
create table candidate_steps (
  id            uuid primary key default gen_random_uuid(),
  process_id    uuid not null references processes(id) on delete cascade,
  evidence_id   uuid references evidence(id) on delete set null,
  source        source_type not null,
  seq           int not null default 0,
  step_name     text not null,                   -- free text
  actor         text,                            -- controlled dropdown
  action        text,                            -- controlled dropdown
  system        text,                            -- controlled dropdown
  input         text,                            -- controlled dropdown
  output        text,                            -- controlled dropdown
  step_kind     step_kind not null default 'task',
  exception     text,                            -- free text
  stage         pipeline_stage not null default 'candidate',
  validated_by  text,                            -- SME who confirmed the checkpoint
  validated_at  timestamptz,
  created_at    timestamptz not null default now()
);

-- ---- Fit-Gap Comparison & arbitration --------------------------------------
-- Raised when the three streams disagree. Routed to the TRANSFORMATION LEAD
-- (not the SME or process owner). Decisions are reversible by default.
create table arbitrations (
  id                uuid primary key default gen_random_uuid(),
  process_id        uuid not null references processes(id) on delete cascade,
  title             text not null,
  people_summary    text,                        -- blue card
  documents_summary text,                        -- yellow card
  system_summary    text,                        -- green card
  fit_gap           fit_gap_class,
  resolved          boolean not null default false,
  resolution_note   text,
  resolved_by       text,                        -- transformation lead
  resolved_at       timestamptz,
  reversible        boolean not null default true,  -- OPEN DECISION (see README)
  created_at        timestamptz not null default now()
);

-- Audit trail so reversible decisions stay accountable.
create table arbitration_events (
  id               uuid primary key default gen_random_uuid(),
  arbitration_id   uuid not null references arbitrations(id) on delete cascade,
  action           text not null,               -- 'resolved' | 'reversed' | 'reclassified'
  fit_gap          fit_gap_class,
  actor            text,
  note             text,
  created_at       timestamptz not null default now()
);

-- ---- Outputs: migration backlog --------------------------------------------
create table backlog_items (
  id               uuid primary key default gen_random_uuid(),
  process_id       uuid not null references processes(id) on delete cascade,
  arbitration_id   uuid references arbitrations(id) on delete set null,
  title            text not null,
  fit_gap          fit_gap_class not null,
  target           backlog_target not null default 'jira',  -- OPEN DECISION (default)
  external_ref     text,                        -- key returned by Jira/ADO/etc.
  created_at       timestamptz not null default now()
);

-- ---- Helpful indexes --------------------------------------------------------
create index on countries (region_id);
create index on teams (country_id);
create index on processes (team_id);
create index on evidence (process_id, source);
create index on candidate_steps (process_id, stage);
create index on arbitrations (process_id, resolved);
create index on backlog_items (process_id);

-- ---- Row Level Security (enable; policies added per auth model) ------------
alter table regions          enable row level security;
alter table countries        enable row level security;
alter table teams            enable row level security;
alter table processes        enable row level security;
alter table evidence         enable row level security;
alter table candidate_steps  enable row level security;
alter table arbitrations     enable row level security;
alter table arbitration_events enable row level security;
alter table backlog_items    enable row level security;

-- Starter policy: any authenticated user may read. Tighten by region/role
-- before go-live (e.g. arbitration writes limited to the transformation lead).
create policy "authenticated read regions"   on regions          for select to authenticated using (true);
create policy "authenticated read countries"  on countries        for select to authenticated using (true);
create policy "authenticated read teams"      on teams            for select to authenticated using (true);
create policy "authenticated read processes"  on processes        for select to authenticated using (true);
create policy "authenticated read evidence"   on evidence         for select to authenticated using (true);
create policy "authenticated read steps"      on candidate_steps  for select to authenticated using (true);
create policy "authenticated read arbitr"     on arbitrations     for select to authenticated using (true);
create policy "authenticated read arb_events" on arbitration_events for select to authenticated using (true);
create policy "authenticated read backlog"    on backlog_items    for select to authenticated using (true);
