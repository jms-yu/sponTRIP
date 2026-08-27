# PR Draft — Milestone 0: Scaffold & security baseline

**Status:** awaiting-acceptance (do NOT mark M0 `done` in milestones.md until the
human confirms the merge, per spark-commit protocol).

## Suggested PR title

```
feat(m0): scaffold, CI, and security baseline
```

## Suggested PR body

### Summary

Builds SponTRIP's Milestone 0: npm-workspaces monorepo scaffold (Expo mobile +
Astro web + Supabase backend + CI mechanical-check scripts), three reversible
Postgres migrations, four Deno Edge Functions, a full GitHub Actions CI
pipeline enforcing SEC-1 through SEC-4 and INF-2/INF-4/INF-6/INF-9 mechanically
(not by inspection), and the three-tier environment recipe's foundation. No
product features or UI screens — those start at M1 per the M0 spec.

### Key changes

- **Repo scaffold**: `apps/mobile` (Expo SDK 57, TypeScript, Jest via
  jest-expo), `apps/web` (Astro 5.18.x static output, hand-scaffolded because
  the current Astro CLI requires Node 22 and this repo pins Node 20 LTS),
  `ci/scripts` (`@sponTRIP/ci-scripts`, tsx + Vitest), `supabase/` (migrations,
  Edge Functions). Root ESLint/TypeScript config shared via `tsconfig.base.json`.
- **Migrations** (`supabase/migrations/` + paired `supabase/migrations_down/`):
  `enable_extensions` (pgcrypto), `smoke_test_fixtures` (permanent SEC-1/SEC-4
  canary), `scheduled_jobs` (pg_cron + `job_runs` ledger backing INF-4).
  Verified end-to-end against a real local Supabase Docker stack via
  `migration-reversibility-test.ts` (up → dump → down → dump → re-up → dump,
  asserting the object-level diff matches exactly). This surfaced and fixed a
  real bug: `pg_net`/`pgcrypto` landed in different Postgres schemas
  depending on which tool applied the SQL — pg_net is now correctly treated
  as Supabase-platform-managed (not owned/dropped by our migration), and
  `pgcrypto` explicitly targets the `extensions` schema.
- **Edge Functions**: `scheduled-smoke-ok`/`-fail` (INF-4 proof pair),
  `mint-storage-url` (INF-9's R2 gatekeeper), `send-test-push` (INF-7 manual
  harness). Each exports a testable `handler()`, verified with 11 passing
  Deno tests against the real local stack (not mocked).
- **CI mechanical checks** (`ci/scripts/`): `check-rls-enabled.ts` (SEC-1),
  `check-security-invoker.ts` (SEC-4), `check-bundle-keys.ts` (SEC-3),
  `check-migration-pairs.ts`, `migration-reversibility-test.ts` (INF-2),
  `rls-negative-auth/{matrix,run}.ts` (SEC-2), `r2-denied-read-test.ts`
  (INF-9), `posthog-fixture-seed.ts` + `posthog-funnel.merge-test.ts`
  (INF-6). All verified against the real local stack; `rls-negative-auth`
  was additionally confirmed to actually catch violations (not vacuously
  green) by temporarily adding a permissive RLS policy, observing a real
  failure, then reverting.
- **GitHub Actions** (`.github/workflows/ci.yml`, `.github/dependabot.yml`):
  lint, typecheck, tests per workspace, all SEC/INF mechanical checks, a
  secrets-gated real-R2 job, a merge-to-main-only PostHog funnel job, and
  `npm audit --audit-level=high`.

### Known findings / deliberately left for human action

1. ~~`npm audit --audit-level=high` currently fails on `astro@5.18.2`'s
   transitive HIGH/CRITICAL advisories~~ — **RESOLVED same day, decision
   130.** Founder chose to bump `apps/web` to Node ≥22.12.0 (astro@7.2.9,
   which clears every flagged advisory) rather than accept the documented
   risk or weaken the gate; `apps/mobile`/`ci/scripts` stay on Node 20 LTS.
   A second, unrelated HIGH/CRITICAL chain in our own `vitest` devDependency
   was found and fixed in the same pass (bumped to `^4.1.11`). `npm audit
   --audit-level=high` now exits **0** under both Node versions — verified,
   not just installed. 11 moderate-only findings remain (pre-existing Expo
   SDK 57 `uuid`/`xcode` chain, unrelated, no fix available without a major
   Expo downgrade). Full history in `.spark/security.md` §7.
2. **R2 buckets, Cloudflare Pages, EAS credentials, real PostHog/Sentry
   accounts, Supabase billing alert, physical-device push/email delivery**
   all need real external credentials/accounts this agent doesn't have.
   Everything up to that point is built and code-complete; see the full M0
   report (delivered separately) for exact manual steps.
3. **pg_cron's real T+2min wall-clock firing** was proven against the
   **local** Docker Supabase stack (no cloud credentials exist) rather than
   the dev cloud project the spec's manual-proof step names — same
   mechanism, different target. Evidence (real timestamps, both -ok and
   -fail paths, twice each) is in the M0 report.

### Test evidence

- `apps/mobile`: 12/12 Jest tests pass (Sentry PII scrubber).
- `apps/web` (now Node 22, astro@7.2.9): 2/2 Vitest tests pass (`astro build`
  + output assertions); `astro check` 0 errors/warnings/hints; `npm audit
  --audit-level=high` exits 0.
- `ci/scripts` (Node 20, vitest@4.1.11): 26/26 Vitest unit tests pass;
  `tsc --noEmit` clean across all three workspaces. `npm audit
  --audit-level=high` exits 0 under both Node 20 and Node 22.
- Real local Supabase Docker stack: `migration-reversibility-test.ts` PASS,
  `check-security-invoker.ts` PASS, `rls-negative-auth/run.ts` PASS (and
  confirmed to catch real violations), 11/11 Deno Edge Function tests PASS.
- Root `npm run lint` clean (0 errors) across the whole repo.
- Deliberately-failing-test simulation confirmed `npm test` exits non-zero
  (the CI-blocking mechanism) — the literal "push a scratch branch, open a
  throwaway PR" step still needs the human once this branch is pushed.

### Migration notes

Three migrations apply cleanly on a fresh database; each has a tested,
paired rollback in `supabase/migrations_down/`. No destructive changes to
any existing schema (greenfield).

## Command for the human

```
git push -u origin milestone/00-scaffold-security-baseline
```

Then open the PR on GitHub and merge after manual testing passes. Per
spark-commit protocol, M0 stays `awaiting-acceptance` in `.spark/milestones.md`
until that merge is confirmed.
