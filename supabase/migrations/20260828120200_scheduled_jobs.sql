-- M0 migration 3/3: scheduled_jobs
--
-- Backs INF-4 (scheduled-job infrastructure). job_runs is the ledger the
-- scheduled-smoke-ok / scheduled-smoke-fail Edge Functions write to.

create extension if not exists pg_cron with schema extensions;

-- pg_net is deliberately NOT created/dropped by this migration: it comes
-- pre-installed by Supabase's own platform bootstrap (local and cloud
-- alike — confirmed empirically during M0 build via the "extension pg_net
-- already exists, skipping" NOTICE on first apply). This migration only
-- USES net.http_post (via pg_cron's scheduled job body), it does not own
-- pg_net's lifecycle. Dropping a platform-managed extension in this
-- migration's down file would be actively harmful (other Supabase internals
-- may depend on it) and non-deterministic to recreate outside Supabase's
-- own bootstrap (verified by migration-reversibility-test.ts: a plain SQL
-- session installs it into "public" instead of the platform's "extensions"
-- schema).

create table public.job_runs (
  id uuid primary key default gen_random_uuid(),
  job_name text not null,
  scheduled_for timestamptz not null,
  started_at timestamptz not null default now(),
  finished_at timestamptz,
  status text not null check (status in ('running', 'succeeded', 'failed')),
  error text
);

alter table public.job_runs enable row level security;
-- No policies: readable/writable only via service_role (bypasses RLS
-- entirely) — i.e. only trusted server-side code (the Edge Functions, using
-- their service-role client). Never anon or any authenticated app user.
-- Doubles as the SEC-2 matrix's "admin-only table" pattern until M7
-- introduces a real is_admin role flag.
