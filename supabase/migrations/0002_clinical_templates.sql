-- 0002_clinical_templates.sql
-- Stores clinical catalog items, custom investigation templates, procedure care orders, and prescription kits.
-- RLS enabled with no browser access; server enforces admin/doctor permissions via service-role key.

create table if not exists clinical_templates (
  key text primary key,
  payload jsonb not null,
  updated_by uuid references staff (id),
  updated_at timestamptz not null default now()
);

create table if not exists patient_rx_snapshots (
  patient_id uuid primary key references patients (id) on delete cascade,
  appointment_id uuid references appointments (id) on delete set null,
  payload jsonb not null,
  updated_by uuid references staff (id),
  updated_at timestamptz not null default now()
);

alter table public.clinical_templates enable row level security;
alter table public.patient_rx_snapshots enable row level security;
revoke all on table public.clinical_templates from anon, authenticated;
revoke all on table public.patient_rx_snapshots from anon, authenticated;
