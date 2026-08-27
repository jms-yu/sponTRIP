-- Local dev seed data ONLY. Never run against Stage or Production.
-- `supabase start` / `supabase db reset` applies this automatically after
-- migrations. Deliberately minimal at M0 — no product tables exist yet.
--
-- Throwaway smoke_test rows are NOT seeded here on purpose: they are
-- created per-test-run by ci/scripts/rls-negative-auth/run.ts against
-- freshly-created throwaway users (A/B), so the negative-auth suite stays
-- self-contained and repeatable rather than depending on seed state.

select 1; -- no-op placeholder; keeps this file present and valid SQL
