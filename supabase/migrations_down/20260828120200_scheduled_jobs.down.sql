-- Rollback for 20260828120200_scheduled_jobs.sql
--
-- CAUTION (logged 2026-08-28, per M0 technical spec): dropping pg_cron here
-- is safe only until M8's RECUR-2 schedules real recurring-event jobs on
-- it. Once that milestone ships, a future rollback of THIS migration needs
-- its own review — blindly re-running this down file at that point could
-- silently take out production recurrence scheduling along with the M0
-- smoke-test jobs. Flagged now so it isn't rediscovered the hard way later.
drop table if exists public.job_runs;
-- pg_net is intentionally NOT dropped here — see the up migration's comment.
-- It is Supabase-platform-managed, not owned by this migration.
drop extension if exists pg_cron;
