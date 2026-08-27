-- M0 migration 2/3: smoke_test_fixtures
--
-- PERMANENT — do NOT tear this down after M0. This table+view pair is a
-- standing CI canary for SEC-1 (deny-by-default RLS) and SEC-4
-- (security_invoker actually delegates RLS, not just sets the flag).
-- It is re-asserted by ci/scripts/rls-negative-auth/run.ts on every future
-- PR, not just once during M0 build.

create table public.smoke_test (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  label text not null,
  created_at timestamptz not null default now()
);

alter table public.smoke_test enable row level security;
-- Deliberately NO policies below this line — this is the SEC-1 proof:
-- RLS enabled + zero policies = zero rows visible to anon or any
-- non-owner authenticated role, by Postgres's own default behavior.

create view public.smoke_test_view
with (security_invoker = true) as
select id, owner_id, label, created_at
from public.smoke_test;
