-- Dr. Sharmistha Bhattacharyya platform: initial schema.
-- All tables have row level security ON with NO policies: browsers using the anon key can read nothing.
-- The Next.js server uses the service-role key and enforces staff permissions in code.

create type staff_role as enum ('admin', 'doctor', 'receptionist', 'coordinator');
create type appt_status as enum ('held', 'confirmed', 'completed', 'cancelled', 'expired', 'conflict');
create type appt_mode as enum ('online', 'in_person');
create type payment_status as enum ('created', 'captured', 'failed', 'refunded');

create table locations (
  id uuid primary key default gen_random_uuid(),
  name text not null, address text, active boolean not null default true
);
insert into locations (name, address)
values ('Accord Super Speciality Hospital, Faridabad', 'Sector 86, Faridabad, Haryana 121002');

create table staff (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null,
  email text not null unique,
  role staff_role not null,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table patients (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  phone text not null unique,           -- E.164, for example +919876543210
  email text,
  created_at timestamptz not null default now()
);

create table leads (
  id uuid primary key default gen_random_uuid(),
  name text not null, phone text not null, email text, service text, message text,
  attribution jsonb not null default '{}',
  status text not null default 'New',
  assigned_to uuid references staff (id),
  created_at timestamptz not null default now()
);

create sequence invoice_seq start 1;
create function next_invoice_no() returns text language sql as $$
  select 'INV-' || to_char(now() at time zone 'Asia/Kolkata', 'YYYY') || '-' || lpad(nextval('invoice_seq')::text, 4, '0')
$$;

create table appointments (
  id uuid primary key default gen_random_uuid(),
  ref text not null unique,
  patient_id uuid not null references patients (id),
  doctor_id uuid references staff (id),
  location_id uuid references locations (id),
  service text not null,
  mode appt_mode not null default 'online',
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  status appt_status not null default 'held',
  hold_expires_at timestamptz,
  fee_paise integer not null check (fee_paise >= 0),
  notes text,
  attribution jsonb not null default '{}',
  meet_link text, google_event_id text,
  reminded_24h boolean not null default false,
  reminded_1h boolean not null default false,
  followup_sent boolean not null default false,
  confirmed_at timestamptz,
  created_at timestamptz not null default now()
);
-- One live booking per slot. 'held' and 'confirmed' block the slot; expired, cancelled and conflict free it.
create unique index appt_slot_unique
  on appointments (coalesce(doctor_id, '00000000-0000-0000-0000-000000000000'::uuid), starts_at)
  where status in ('held', 'confirmed');
create index appt_starts_idx on appointments (starts_at);

create table payments (
  id uuid primary key default gen_random_uuid(),
  appointment_id uuid not null references appointments (id),
  rzp_order_id text not null unique,
  rzp_payment_id text unique,
  amount_paise integer not null,
  status payment_status not null default 'created',
  method text, invoice_no text, raw jsonb,
  created_at timestamptz not null default now(),
  captured_at timestamptz, refunded_at timestamptz
);

create table documents (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null references patients (id),
  appointment_id uuid references appointments (id),
  kind text not null check (kind in ('prescription_pad', 'prescription_photo', 'prescription_typed', 'report', 'invoice')),
  storage_key text not null, filename text not null, mime text not null, size_bytes integer not null,
  created_by uuid references staff (id),
  created_at timestamptz not null default now()
);
create index documents_patient_idx on documents (patient_id);

create table message_log (
  id uuid primary key default gen_random_uuid(),
  appointment_id uuid references appointments (id),
  patient_id uuid references patients (id),
  channel text not null check (channel in ('whatsapp', 'email')),
  template text not null,
  recipient text not null,
  status text not null check (status in ('sent', 'failed', 'skipped')),
  provider_id text, error text,
  created_at timestamptz not null default now()
);

create table audit_log (
  id bigint generated always as identity primary key,
  staff_id uuid, staff_name text not null,
  action text not null, entity text not null, entity_id text, meta jsonb,
  created_at timestamptz not null default now()
);
create index audit_created_idx on audit_log (created_at desc);

create table page_overrides (            -- editable SEO fields (title and description) per page
  slug text primary key,
  title text, description text,
  updated_by uuid references staff (id),
  updated_at timestamptz not null default now()
);

-- Simple fixed-window rate limiter used by public endpoints.
create table rate_limits (key text primary key, window_start timestamptz not null, count integer not null);
create function rate_limit(p_key text, p_max integer, p_window_seconds integer) returns boolean
language plpgsql as $$
declare c integer;
begin
  insert into rate_limits as r (key, window_start, count) values (p_key, now(), 1)
  on conflict (key) do update set
    window_start = case when r.window_start < now() - make_interval(secs => p_window_seconds) then now() else r.window_start end,
    count = case when r.window_start < now() - make_interval(secs => p_window_seconds) then 1 else r.count + 1 end
  returning r.count into c;
  return c <= p_max;
end $$;

-- Lock everything down for browser roles.
do $$
declare t text;
begin
  for t in select tablename from pg_tables where schemaname = 'public' loop
    execute format('alter table public.%I enable row level security', t);
  end loop;
end $$;
revoke all on all tables in schema public from anon, authenticated;
revoke all on all sequences in schema public from anon, authenticated;
revoke all on all functions in schema public from anon, authenticated, public;
