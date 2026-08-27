-- Rollback for 20260828120000_enable_extensions.sql
-- NOT read by `supabase migration up` — this project's own rollback
-- convention. Executed only by ci/scripts/migration-reversibility-test.ts
-- and by a human running a real rollback against a Supabase project.
drop extension if exists pgcrypto;
