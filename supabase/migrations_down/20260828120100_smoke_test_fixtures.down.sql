-- Rollback for 20260828120100_smoke_test_fixtures.sql
--
-- NOTE: in normal operation this migration is never rolled back in a real
-- environment — it is a PERMANENT standing CI canary. This down file exists
-- so the reversibility mechanism (migration-reversibility-test.ts) can
-- exercise and prove the rollback path mechanically, per project convention
-- ("every migration ships a tested rollback, forever"), not because we
-- intend to actually drop this table outside of that test.
drop view if exists public.smoke_test_view;
drop table if exists public.smoke_test;
