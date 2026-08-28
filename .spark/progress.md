# Progress / Checkpoint

current_command: /spark-dev
current_phase: Milestone 0 (Scaffold & security baseline) — Phases 1-5 complete, Review Gate GO. Entering Phase 6 (close-out): scribe writes pr-draft.md + manual test checklist, then GATE 3 presented to the human.
last_updated: 2026-08-28

## Blockers

- 2026-08-12 — **LEGAL (open).** Ownership of ToS / Privacy Policy / Community
  Guidelines / liability disclaimer undecided beyond the beta scope (decision 88:
  founder-drafted for beta, lawyer before public launch). Full legal set (incl.
  public reputation scoring + geolocation coverage per validator issue 8) still
  TBD before public launch — see `plan.md` §6. Not beta-blocking beyond decision
  88's Privacy Policy + minimal ToS requirement (blocks M9). Waiting on: user,
  before M9 for the beta piece; before public launch for the rest.
- ~~2026-08-13 — RLS review (SEC-5) is unbudgeted with no vendor, while gating
  M2.~~ **RESOLVED 2026-08-28 — decision 112: downgraded to optional
  recommendation, no longer gates M2 or M7.**
- ~~2026-08-13 — Google Play account type undecided.~~ **RESOLVED 2026-08-28 —
  decision 113: Personal.** Founder action still open: recruit the 12 testers
  now (clock starts on the 12th opt-in).
- 2026-08-12 — **ACTION STILL OPEN, independent of Gate 1.** Google Play needs
  12 testers opted in for 14 continuous days of closed testing before this
  Personal account can reach production. Apple Developer Program is needed at
  **M0** (Sign in with Apple, Expo Push on iOS, any EAS iOS build) — project.md
  §13 previously dated it "before iOS beta," corrected. Both store accounts
  should be started now, in parallel with development. Waiting on: user.

## Checkpoint log

- 2026-08-12 — .spark/ initialized. Mode detected: GREENFIELD (no codebase.md).
- 2026-08-12 — Source material ingested: SponTRIP-Ideation.md (raw, non-final).
- 2026-08-12 — Phase 1-A started; stress-test analysis delivered, batch 1 questions asked.
- 2026-08-12 — Batch 1 answered. 11 decisions confirmed (see decisions.md). Platform
  locked to React Native + Expo. Two contradictions surfaced for batch 2.
- 2026-08-12 — Batch 2 answered. Decisions 12–15 recorded. Scope posture resolved to
  SEQUENCED. Team composition revealed as AI-assisted (no hand-coding founders) —
  recorded as a critical planning input that constrains stack selection toward
  managed services, and elevates security + automated testing above velocity.
- 2026-08-12 — Batch 3 answered. Decisions 16–19 recorded. Budget ceiling $50/mo.
  Beachhead = single hobby vertical nationwide. Design = Airbnb bones + Duolingo
  soul, split by surface. Legal document ownership logged as an open blocker.
- 2026-08-12 — Batch 4 answered. Decisions 20–26 recorded. Beachhead = rides +
  diving + office groups, resolved by mapping verticals onto phases. Runway 18+
  months. Success metric = repeat behavior. Maps = deep-link only.
- 2026-08-12 — **Phase 1-A COMPLETE.** `.spark/project.md` written (26 decisions
  consolidated). Held at founder sign-off before Phase 2.
- 2026-08-12 — Founder correction accepted: QR check-in moved Phase 2 → Phase 1
  (Drawing Rate has no data source without it). Offline check-in added as a hard
  requirement. Drawing Rate mechanic specified in project.md §15 with 9 open
  design issues, one of them safety-critical (weather-cancellation exemption).
  Decisions 27–30 recorded. Still held before Phase 2.
- 2026-08-12 — Drawing Rate mechanic resolved. Decisions 31–35 recorded: rotating
  group QR scanned by members, safety-exempt cancellations, Leader-confirmed
  attendance list, fully public scores (founder call, against recommendation, with
  mitigations), finalized-events-only scoring. Two display questions remain open.
- 2026-08-12 — Drawing Rate FULLY SPECIFIED (project.md §15). Decisions 36–42:
  broken-commitments-only scoring, two stats from one confirmed-events base,
  group vs individual definitions separated, cancelled events excluded, three-layer
  display, rolling 6-month window, confirm-required-to-check-in. Ready for Phase 2.
- 2026-08-12 — **Phase 2 COMPLETE.** spark-researcher report incorporated into
  `.spark/plan.md` v0.1 (DRAFT, not approved). Key outputs: 3 stack options costed
  at 3 scale points with Supabase+R2 recommended; no prior art found for a public
  peer flake score (closest analog FLKE uses money, not reputation); SMS OTP and
  n8n both recommended dropped; account deletion needs BOTH in-app and web paths;
  17+ store rating expected; 2026 UGC policy expects automated moderation at scale.
- 2026-08-12 — Stack DECIDED by founders: Supabase + Cloudflare R2 (Option A).
  SMS OTP and n8n confirmed EXCLUDED. Decisions 54–56. config.md updated.
- 2026-08-12 — **Phase 3 COMPLETE.** spark-risk-analyst report written to plan.md
  §3: 5 project-killing risks (K1–K5) + 30 catalogued risks (R1–R30) + a
  Milestone-0 watch list. Highest-value new findings: K1 (never-confirm is the
  rational strategy, destroying headcount signal), K2 (Leader unilaterally edits
  attendance with no audit trail or dispute path — reputation integrity single
  point of failure), R2 (Phase 1 cohort is coworkers, so public scores land in
  workplace power dynamics), R7/R8 (offline check-in and rotating-QR anti-cheat
  are in direct unresolved tension), R23 (tests-as-code-review gives false
  confidence for exactly the RLS/auth bug class this team can't catch).
- 2026-08-12 — **Phase 4 COMPLETE.** Feature list written to plan.md §4;
  milestone breakdown written to `.spark/milestones.md`. Phase 1 = 9 milestones
  (M0–M8), ~16 weeks. Open design questions resolved: Phase 1 has NO Navigate tab
  (no corpus to browse); Navigate is Phase 2, feed-first with opt-in save-only
  Discover; badges = closed set of 6, Phase 3; Album = Phase 3 only, video stays
  cut; Magic Bunot = server-drawn CSPRNG, auto-posted immutable to chat, no stakes
  field. Six open items need founder input before Gate 1 (milestones.md, bottom).
- 2026-08-12 — Founder decisions 66–70: DR-5 threshold N=3; M6 stays in Phase 1;
  Recap Card Version A at launch / Version B in first update; launch target
  1 Dec 2026; waitlist 2h and KYC deletion 72h defaults accepted.
- 2026-08-12 — **Phase 5 VALIDATION FAILED — MAJOR ISSUES (loop 1 of 2).**
  spark-plan-validator returned 12 major issues, 22 minor, 8 observations.
  Headline findings:
  1. Feature IDs referenced throughout milestones.md (AUTH-1…8, DR-1…7, etc.)
     are NOT defined in plan.md §4 — orchestrator wrote prose instead of the
     numbered spec. Scope is unwritten; every estimate is unfalsifiable.
  2. **No capacity model.** 16 FTE-weeks ≠ 16 calendar weeks. Two part-time
     founders around day jobs ≈ 12–20 combined hours/week → **30–50 calendar
     weeks**. The 1 Dec target is arithmetic, not a capacity estimate.
  3. Walk-in rule (ATT-6) contradicts decision 42 and is arithmetically broken —
     show-up rate could exceed 100%, and it makes never-confirming strictly
     dominant, AMPLIFYING K1 rather than blunting it.
  4. Drawing Rate state machine has 4 undefined states, incl. late offline sync
     arriving after the Leader finalized; the R4 T+4h reminder actively fights
     decision 28's offline-first requirement; and cancel-with-partial-attendance
     gets the canonical "puro plano lang" case exactly backwards.
  5. Decision 34 ("fully public") collides with decision 58 (no Navigate tab, no
     public surface in Phase 1) — "public" has no implementation surface.
  6. NO milestone owns app shell, navigation, Home tab, Profile, Notifications,
     settings, or any design-system work — despite a two-language design direction.
  7. Three Phase 1 deliverables need a web surface (account-deletion page,
     anonymous live-location link, admin console); no web hosting in config.md,
     no web milestone anywhere.
  8. project.md §9 wrongly places location data in Phase 2; it is Phase 1.
  9. K5's RLS review is unbudgeted, mis-timed, blocks M1 on an external party,
     and the highest-leverage affordable control — an automated
     negative-authorization CI test suite — is absent entirely.
  10. plan.md §5 (security requirements) is an empty placeholder; security.md
      does not exist. Cannot go to Gate 1 in that state.
  11. M8 at 1.5 wk is not credible: Google Play's 12-testers/14-day gate and
      Apple review round-trips are absent, and the AC defines launch as
      "submitted," not "live."
  12. M3's spec asks the wrong question. The offline device does NOT need to
      validate — it records (code, timestamp) and the server validates at sync.
      Correctly specified this is ~3 days, not 2 weeks. The real residual attack
      is device clock manipulation, which is unnamed. R7 as written would burn
      the entire timebox chasing an unsolvable problem.
- 2026-08-13 — Founder decisions 71–79 on remediation: capacity varies (planning
  assumption 20 combined hrs/wk); hold December but narrow scope; Drawing Rate
  Circle-scoped in Phase 1; live location deferred to Phase 2; Magic Bunot stays;
  "December launch" redefined as a **closed beta**; Kris Kringle raised and
  deferred; **chat kept in the beta against recommendation** (raises the beta from
  ~9.5 to ~12 FTE-weeks, making December a stretch target rather than a plan).
- 2026-08-13 — **VALIDATION LOOP 2 (final permitted loop).** 11 of 12 loop-1
  majors confirmed FIXED. 7 new issues, mostly consequences of the fixes.
  Orchestrator applied all fixes not needing founder input (decisions 82, 85):
  RECAP-1 aggregate-only, event lifecycle + `T` defined, edit precedence, QR-4
  downgraded to forensics, QR-6 added, ONB-1 added, M1 ACs rescoped + standing
  definition of done, checkpoint moved to calendar week 8, rate limiting +
  dependency scanning, audit-log anonymisation, config.md web target.
  **Four items escalated to Gate 1 as founder decisions: capacity 12→15 FTE-weeks
  (83), excused absences dropped (N4), exempt-cancellation individual penalties
  (84), Privacy Policy ownership now beta-blocking (85).**
- 2026-08-13 — Gate 1 founder decisions 86–89: excused-absence state restored
  (3-value ATT-1 + reason + ADM-5 rate counter); decision 39 amended so individual
  penalties apply only on non-exempt cancellations (safety principle preserved);
  beta legal docs founder-drafted with a lawyer before public launch; chat
  re-confirmed against corrected 15-FTE-week arithmetic.
- 2026-08-13 — **PHASE 6 COMPLETE.** `.spark/proposal.md` written (plain-English
  scope document for investors/advisors/first hire). All Phase 6 deliverables now
  exist: plan.md v0.3, milestones.md v0.2, security.md v1.0, proposal.md v1.0.
- 2026-08-13 — **AWAITING GATE 1 APPROVAL.** No development work may begin until
  the founders explicitly approve.
- 2026-08-13 — **Post-Gate-1 scope addition** (decisions 90–100), after the founder
  reviewed `SponTRIP_Badge_System.md`. Three items added to the beta: poll
  (recovers ideation §6.3), full badge system — 26 badges across three collections
  — moved from Phase 3 into the beta (supersedes decision 60), and an ephemeral
  check-in photo template (recovers ideation §9.2, scoped to avoid reopening
  decision 68). New milestone **M8** inserted (~4.5 FTE-weeks); the former M8
  "Beta launch prep" is now **M9**. **Total effort: 15.0 → 19.5 FTE-weeks.**
  Founder chose to accept the schedule slip rather than cut other scope.
  **December is no longer reachable at any modeled capacity** — the seasonal
  rationale for that target (Christmas-party season for the launch cohort) no
  longer applies; founder was informed directly and proceeded anyway. Updated:
  `plan.md` (v0.4), `milestones.md` (v0.3), `project.md`, `proposal.md` (v1.1).
  Two mechanical fixes applied to the no-show badges without re-asking: gated
  behind Drawing Rate's 3-event minimum threshold, and Circle-scoped visibility
  matching decision 73. Frida badge's undeterminable trigger fixed by adding a
  category tag to Circle creation (CIRC-4), which also pre-positions Phase 2's
  Navigate category filtering.
- 2026-08-13 — **STILL AT GATE 1**, now covering the revised 19.5 FTE-week scope.
  Awaiting explicit founder approval before any development work begins.
- 2026-08-13 — **Second post-Gate-1 scope addition** (decisions 101–111): recurring
  events + a "Reason Rate" fun-fact feature. Founder's original workflow proposed
  penalizing non-response on individual Drawing Rate for recurring events; declined
  in favor of keeping decisions 36/42 consistent everywhere (silence stays
  risk-free). Reason Rate scoped as purely descriptive, not a score — the
  higher-risk "credibility-judged" version was explicitly discussed and parked.
  Recurring events built as an auto-recreate convenience reusing the existing
  event/QR/attendance/Drawing-Rate pipeline (orchestrator recommendation, stated
  as a correctable default) rather than a full series-editing system, keeping real
  cost to ~2.0 FTE-weeks. "As needed" corrected by founder to custom weekday
  selection, folded into Weekly rather than added as an 8th interval type.
  **M8: 4.5 → 6.5 FTE-weeks. Total: 19.5 → 21.5 FTE-weeks.** December's gap
  widens further — even 30 hrs/week sustained now lands early March 2027, three
  months past the original target. Founder informed directly a second time;
  chose scope over date again. Updated: `plan.md` (v0.5), `milestones.md` (v0.4),
  `project.md`, `proposal.md` (v1.2).
- 2026-08-13 — **STILL AT GATE 1**, now covering 21.5 FTE-weeks of scope across
  two post-approval additions. Awaiting explicit founder approval before any
  development work begins.
- 2026-08-13 — **REMEDIATION COMPLETE (decisions 80–81).** All 12 major issues
  addressed. `plan.md` v0.2 (feature spec with canonical IDs, capacity model,
  Drawing Rate state machine, security requirements section). `milestones.md` v0.2
  (M0–M8, 15 FTE-weeks, app shell now owned, RLS review split in two, M8 redefined
  as beta launch). **`.spark/security.md` created.** `project.md` §8/§9/§15
  corrected. Ready for re-validation loop 2.
- 2026-08-28 — **All five "Open items for Gate 1" resolved** (decisions 112–116):
  SEC-5 human RLS review downgraded from hard milestone gate to optional
  recommendation on M2/M7 (SEC-2's mandatory CI suite unchanged) per founder's
  explicit security-first rationale; Google Play account set to Personal;
  capacity confirmed at 20 hrs/week (no date change, beta still ~mid-June 2027);
  accessibility confirmed at stated baseline (no formal WCAG AA); repeat-behavior
  metric set to relative (month-over-month trend). `plan.md` (v0.6),
  `milestones.md`, `security.md`, `project.md` updated.
- 2026-08-28 — **GATE 1 APPROVED (decision 118).** Founder gave explicit final
  approval of plan v0.6 in full. `/spark-plan` is complete. Next: `/spark-dev`
  to begin Milestone 0 (scaffold, CI, security baseline, environment recipe).
- 2026-08-28 — **`/spark-dev` STARTED, Milestone 0.** Phase 0 preconditions
  verified (plan APPROVED, no mid-flight checkpoint, live: false so no
  live-production rules apply). Repo had no `.git` (greenfield, matches
  GREENFIELD detection at project start) — initialized on `main` with a
  baseline commit of pre-existing `.spark/`, `.claude/`, and ideation docs
  (no application code). Branch `milestone/00-scaffold-security-baseline`
  created off `main`. Entering Phase 1: spark-architect for M0 technical
  spec + environment recipe selection (writes `.spark/environment.md`).
- 2026-08-28 — **Phase 1 COMPLETE.** spark-architect returned the M0 technical
  spec (repo layout, 3 reversible migrations, 4 Edge Function contracts, CI
  mechanical-check contracts, full AC→test-strategy mapping) and the
  environment recipe. Summary recorded as decisions 119–127.
  `.spark/environment.md` written (adapted composite: mobile-expo client
  tier + generic-principles Supabase backend tiering + generic-principles
  Cloudflare Pages web tiering — no single recipe matched exactly).
  Checkpoint. M0 has no UI surface, so Phase 2 (spark-designer) is skipped
  per the orchestrator's own rule. Entering Phase 3: spark-developer build.
- 2026-08-28 — **Phase 3 (spark-developer build) COMPLETE.** Full M0 scope
  built and verified against a real local Supabase Docker stack (not just
  written): 3 migrations with tested rollbacks (INF-2), 4 Deno Edge
  Functions (11/11 tests pass), 8 CI mechanical-check scripts covering
  SEC-1..4/INF-2/INF-9, PostHog fixture seeder + funnel merge-test
  (INF-6), Expo mobile scaffold (12/12 Jest tests — Sentry PII scrubber,
  INF-5), Astro web scaffold (INF-3, hand-scaffolded — current Astro CLI
  needs Node 22, this repo pins Node 20 LTS), full GitHub Actions
  pipeline + Dependabot. Real pg_cron T+2min firing proven against the
  local stack (no cloud project exists). One finding logged to
  `security.md` §7 rather than silently resolved: Astro's security-patched
  major needs Node 22, in tension with the Node 20 pin — CI's npm-audit
  gate deliberately left unweakened. 11 commits on
  `milestone/00-scaffold-security-baseline`. `.spark/pr-draft.md` written.
  **Status: awaiting-acceptance, NOT marked done** — per spark-commit
  protocol, requires human-confirmed merge first. Entering QA/Review Gate.
- 2026-08-28 — **Paused before QA**: `npm audit --audit-level=high` is
  genuinely red on this branch (astro@5.18.2's HIGH/CRITICAL advisories,
  fixed only in astro@7.2.9 which needs Node ≥22, vs. the repo's Node 20
  pin) — a human decision, not a QA-fixable bug, so asked before spending a
  build↔QA cycle on it. **Founder decided: bump `apps/web` to Node 22**
  (decision 130), mobile/ci stay on Node 20. Resuming the same
  spark-developer agent to implement, then proceeding to Phase 4 (QA).
- 2026-08-28 — **Node 22 fix complete.** Astro bumped 5.18.2 to 7.2.9 in
  `apps/web`, given its own `.nvmrc` (22) distinct from the repo root (20);
  `.github/workflows/ci.yml` split into a dedicated `web-node22` job.
  A second, unrelated HIGH/CRITICAL chain was found in the same pass
  (`vitest` to `vite`, dev-tooling only, in both `apps/web` and
  `ci/scripts`) and fixed by bumping `vitest` to `^4.1.11`. `npm audit
  --audit-level=high` verified clean under both Node 20 and 22 by actually
  running it. 11 moderate-only findings remain (Expo SDK 57's own
  `uuid`/`xcode` chain, no fix available without a major Expo downgrade —
  doesn't trip the `--audit-level=high` gate). 4 more commits.
  `security.md` §7 and `pr-draft.md` updated with a resolution note, not
  overwritten. `.spark/environment.md`'s Web dev-tier section updated in
  place by the developer to document the Node split — reviewed, accurate,
  kept as-is. **Entering Phase 4: QA.**
- 2026-08-28 — **Phase 4 (QA) COMPLETE — everything runnable passed.**
  Exact counts matched expectations: 12/12 mobile Jest, 2/2 web Vitest +
  clean `astro build`/`astro check`, 26/26 ci/scripts Vitest, 11/11 Deno
  Edge Function tests, `npm audit --audit-level=high` clean under both
  Node 20 and 22 (11 moderate-only findings from Expo SDK 57's own
  dependency chain, zero HIGH/CRITICAL). QA independently re-verified two
  developer claims rather than trusting them: (1) broke a test and
  confirmed `npm test` genuinely exits nonzero, reverted cleanly; (2) read
  `check-bundle-keys.ts` to confirm it scans a real `npx expo export`
  bundle output, not just source text. QA also read `ci.yml` directly to
  confirm every mechanical check (SEC-1..4, INF-2, INF-9, migration-pairs,
  npm-audit) is wired as a blocking job/step with no `continue-on-error` —
  one caveat noted: whether these are configured as **required** GitHub
  branch-protection status checks is a repo-settings question invisible
  from the workflow file itself, flagged manual-only for the human.
  Credential-gated items (INF-9's real R2 denial, INF-6's real PostHog
  funnel, INF-7/8 push/email, INF-10 billing alert, INF-3's live HTTPS
  domain, a real EAS build) all confirmed to honestly self-skip (loud
  warning, not a silent pass) rather than being run. Zero failures.
  **Entering Phase 5: Review Gate.**
- 2026-08-28 — **Phase 5 (Review Gate) — NO-GO, remediation cycle 1 of 3.**
  Opus/xhigh review of `main..HEAD` (15 commits). QA evidence integrity
  **confirmed accurate** — every re-run claim held (migration-reversibility,
  negative-auth matrix, all test counts, npm audit under both Node
  versions, `ci.yml` blocking wiring all independently reproduced). No
  scope drift found — nothing built outside INF-1…10/SEC-1…4, decision 130's
  Node split implemented cleanly with no cross-contamination. **NO-GO is
  from real defects the QA suite doesn't test for, not misreported
  evidence.** 11 findings, most severe two:
  1. **[HIGH] `mint-storage-url` path-traversal, proven live** — `../`
     segments in the `key` field survive the prefix check and get resolved
     by the URL parser before signing, letting any authenticated user mint
     read+write URLs into another user's `general` objects and into
     `receipts`/`verification` (supposed to be unconditional 403 for
     everyone at M0). Neither existing test would catch it — both only
     probe the naive case. Defeats the one non-RLS access-control path
     `security.md` §5 knowingly accepted; becomes CRITICAL the moment real
     R2 credentials land (itself a pending M0 item).
  2. **[HIGH] SEC-1/SEC-2's "unwritable" half is never tested** — the
     negative-auth suite only ever issues `SELECT`; no INSERT/UPDATE/DELETE
     is attempted by anon or a non-owner anywhere. Live DB behavior is
     currently correct (verified manually), but the mechanical control
     `decisions.md` 112/126 relies on to make human RLS review safely
     optional doesn't actually prove write-denial — and every table from M1
     onward inherits this blind spot silently green.
  Plus: [MEDIUM] the suite reports PASS for tables that don't exist
  (swallows schema errors as "0 rows"); [MEDIUM] SEC-3's source scan misses
  a hardcoded service_role literal under an innocuous variable name (bundle
  scan does catch it); [MEDIUM] shared-secret comparison is timing-unsafe
  on 3 functions; [MEDIUM] INF-4 has no committed `cron.schedule` artifact
  (only the ledger + handlers — the manual T+2min proof isn't reproducible
  by anyone else); [MEDIUM] "CI blocks a deliberately failing PR"/"SEC-2
  blocks merge" aren't actually established without a GitHub branch-
  protection ruleset, which nothing in this changeset configures or even
  lists as a manual step; [MEDIUM] Sentry scrubber allow-lists 5 fields,
  doesn't cover `user`/`tags`/`contexts` — a landmine for M1's
  `Sentry.setUser()`; [LOW] migration-reversibility only tests the newest
  migration and doesn't recognize functions/enums/materialized views;
  [LOW] `enable_extensions.down.sql` would drop Supabase's own
  platform-managed `pgcrypto`; hardening notes on CORS `*`, `send-test-push`
  having no prod-exclusion mechanism, INF-8 having zero committed artifact,
  and a root `package.json` engines mismatch against decision 130.
  Routing findings 1–8 back to `spark-developer` (9–11 may be logged and
  carried, but recommended fixed now since M1's schema will trip 9/10).
- 2026-08-28 — **Remediation cycle 1 COMPLETE — all 11 findings fixed**
  (1–8 required, 9–11 recommended, all addressed since none were high
  effort and 9/10 would otherwise trip on M1's schema per the Review
  Gate's own note). 11 commits on `milestone/00-scaffold-security-baseline`.
  Every fix verified against the real local Supabase stack, not just
  typechecked — including re-proving finding 1's traversal exploit is
  closed with the reviewer's exact reproduction steps as new regression
  tests, and sanity-checking finding 2's new write-denial tests by
  temporarily adding permissive INSERT/UPDATE policies and confirming the
  suite catches them before reverting. One test-isolation bug caught and
  fixed in the same pass while adding finding 11's coverage (a test
  deleting an env var without restoring it, silently corrupting later
  tests in the same file via shared process-wide env state — not a
  reported finding, found by actually running the new tests rather than
  trusting them). Full finding-by-finding writeup delivered to the
  coordinator separately. Local dev environment note for future sessions:
  the Kong gateway container occasionally caches a stale upstream IP for
  the auth container after a `supabase stop`/`start` cycle, surfacing as
  502s / empty error objects from `auth.admin.createUser` — `docker
  restart supabase_kong_SponTRIP` resolves it; not a code issue, confirmed
  via Kong's own access logs ("connect() failed ... Connection refused"
  against a stale IP). **Entering Phase 4: QA (remediation cycle 1 verify),
  then Phase 5: Review Gate (cycle 2 of 3).**
- 2026-08-28 — **Finding 2 follow-up fix complete.** QA's live
  reproduction confirmed the root cause: `attemptInsert()` chained
  `.select("id").single()` onto the mutating INSERT, and Postgres RLS
  makes `INSERT ... RETURNING` fail identically whether the INSERT itself
  was denied or only its RETURNING-read was denied (all 3 M0 matrix rows
  have zero SELECT policies) — the suite couldn't distinguish a real deny
  from a successful insert it merely couldn't read back, so a genuinely
  permissive INSERT policy still reported PASS. Fixed by mirroring
  attemptUpdate/attemptDelete's already-correct pattern: insert bare (no
  `.select()`), tag with a per-identity probe value, verify independently
  via a separate service-role read. Re-ran QA's exact sanity check against
  the real local stack (planted `qa_temp_permissive_insert` on
  `smoke_test`) — fixed suite now correctly FAILs loudly on both
  `smoke_test` and `smoke_test_view`; reverted, confirmed zero leftover
  rows and a clean PASS. Full suite re-verified: 29/29 ci/scripts Vitest,
  19/19 Deno tests, root lint/typecheck clean. One commit
  (`ddf9fee`). **Entering QA re-verification, then Review Gate cycle 2 of
  3.**
- 2026-08-28 — **Final QA pass confirmed finding 2 closed** with QA's own
  independent live reproduction (replanted the permissive INSERT policy,
  confirmed loud failure, confirmed the fix detects the real attack shape
  not a coincidental one, reverted clean) — not taken on the developer's
  word. Full regression sweep: 16/16 mobile, 2/2 web, 29/29 ci/scripts,
  19/19 Deno, npm audit clean both Node versions, no drift from prior
  counts. **All 11 remediation-cycle-1 findings now genuinely fixed and
  tested. Entering Review Gate cycle 2 of 3.**
- 2026-08-28 — **Phase 5 (Review Gate) cycle 2 — GO.** Both HIGH findings
  independently re-verified as closed, not re-read: finding 1 survived 17
  exploit variants (6 new encoding cases beyond the original 3) with zero
  escapes; finding 2 was mutation-tested — 8 real permission grants
  planted live, 6/8 caught, the 2 misses proven to be equivalent mutants
  (Postgres denies UPDATE/DELETE with no SELECT policy regardless, so
  nothing was actually granted). INF-4's `cron-jobs.md` runbook was
  executed end-to-end against real wall-clock pg_cron firing (both -ok and
  -fail paths, `job_runs` rows confirmed). Findings 3–11 each
  independently re-verified. Zero unresolved Critical/High findings, zero
  scope creep (4 new files, each traceable to a specific finding), every
  QA-reported count reproduced exactly. Four new non-blocking
  observations (2 MEDIUM, 2 LOW) — logged in `security.md` §7 as
  M1-kickoff follow-ups per the Review Gate's own recommendation, not
  routed to a 3rd remediation cycle. **VERDICT: GO.**
- 2026-08-28 — **Milestone 0 — Phase 5 complete, GO. `milestones.md` M0
  status set to `awaiting-acceptance`.** 29 commits on
  `milestone/00-scaffold-security-baseline`, 2 of the allowed 3
  remediation cycles used. Entering Phase 6: spark-scribe writes the final
  `pr-draft.md` (incorporating the GO verdict, the two remediation cycles,
  and the M1-follow-up observations) and the M0 manual testing checklist,
  then GATE 3 is presented to the human.
- 2026-08-28 — **Phase 6 complete.** spark-scribe finalized `pr-draft.md`
  and wrote `m0-manual-test-checklist.md`. Orchestrator fact-checked both
  against the actual shipped code before presenting and found/fixed 4
  substantive drift issues the scribe (working from state-file summaries,
  not the code itself) introduced: wrong Sentry DSN env var name plus a
  test approach that would have bypassed the client-side `beforeSend`
  scrubber entirely; wrong PostHog env var names, a nonexistent npm
  script, and a described 3-step funnel when the shipped funnel is 2
  steps; wrong `send-test-push` header name/payload field and a missing
  mention of the `ALLOW_TEST_PUSH` gate added in remediation; a
  nonexistent R2 test npm script and missing required Supabase env vars.
  All corrected against the real source before commit. **GATE 3
  presented to the human.**
- 2026-08-28 — **GATE 3 manual testing in progress, walked through
  interactively with the founder.** Test #1 (CI blocks a failing PR)
  PASSED — real throwaway PR opened against a newly-connected GitHub repo
  (`github.com/jms-yu/sponTRIP`), `Test - apps/mobile` went red as
  expected, 10 other checks stayed green, closed without merging. Test #2
  (migration reversibility) PASSED — ran the real
  `migration-reversibility-test.ts` directly rather than the checklist's
  manual pg_dump steps (which had a wrong port number, now fixed in the
  checklist). Test #3 (web domain/HTTPS) deferred — founder needs to
  purchase a domain first. Test #4 (scheduled job T+2min) PASSED — ran
  `cron-jobs.md`'s runbook live against the local stack a third time
  (previously run once by the developer, once by the Review Gate): both
  the success path (`job_runs.status = 'succeeded'`) and failure path
  (`status = 'failed'`, `error = 'deliberate smoke-test failure'`) fired
  and recorded correctly, both jobs unscheduled after, `cron.job` confirmed
  empty. Continuing through the remaining items next.
- 2026-08-28 — **Tests #5 (Sentry) and #7 (push notification) PAUSED, not
  failed.** Real blocker found and worked through methodically: Jest can't
  prove real Sentry delivery (native SDK disabled in its mocked RN
  environment — confirmed via debug logging, "flush() returned: true" but
  no event ever reached Sentry); the real app requires a physical device.
  Attempted via Expo Go (QR connection worked correctly — proves the dev
  server and network path are fine) but hit a hard SDK-version wall:
  this project targets Expo SDK 57, current Expo Go only supports up to
  SDK 54 (confirmed by the founder's own device), and that mismatch has no
  workaround short of a custom dev client. Founder opted to build a proper
  EAS development client (the correct long-term path — needed for all
  future device testing, not just this check) rather than downgrade SDK or
  skip. Logged into EAS CLI as `jms_yu` after working around this sandbox's
  inability to handle any interactive terminal prompt (login had to be run
  in the founder's own VS Code terminal). **Blocked again immediately
  after:** founder does not yet have an Apple Developer Program membership
  (needed for iOS code signing, confirmed the phone in use is an iPhone),
  which is money ($99/yr) and 1-2 days identity verification — already
  flagged as a founder task in `milestones.md`'s M0 section, now
  confirmed not yet done. **Both tests paused here**, temporary test
  button in `App.tsx` reverted, dev server stopped, local `.env` DSN file
  removed — clean state to resume from once Apple Developer enrollment
  completes. Continuing with checklist items that don't depend on it.
- 2026-08-28 — **Test #11 (branch protection) PASSED — verified with a
  real second throwaway PR, not just by inspecting the settings.**
  GitHub repo connected to a working ruleset requiring all 11 mechanical
  CI checks (verified against `ci.yml`'s actual top-level job `name:`
  fields, not step names — an earlier naive grep pass would have pulled
  nested step names too). Founder chose to drop the ruleset's default
  1-approving-review requirement (GitHub disallows self-approval; this is
  currently a solo-merge team relying on the automated Review Gate
  instead of a second human reviewer) — `.github/rulesets/require-ci-checks.json`
  updated and committed to reflect that decision, with reasoning recorded
  in the file's own comment. Second throwaway PR opened with the same
  kind of deliberate test failure: this time the failing check showed
  tagged **"Required"** and the **"Merge pull request" button was greyed
  out/disabled** — the real, load-bearing proof branch protection blocks
  merges, not just that checks turn red. Closed without merging, branches
  cleaned up locally and on GitHub.
- 2026-08-28 — Test #6 (PostHog repeat-join funnel) PASSED, but only after
  finding and fixing a real, permanent bug in
  posthog-funnel.merge-test.ts that had NEVER been run against real
  PostHog credentials before now (QA and Review Gate both correctly
  honest-skipped it for lack of them at the time). Founder created a real
  PostHog account/project; running the test for the first time against
  live credentials failed. Root-caused through direct API experimentation
  to three independently-confirmed issues, all fixed in one commit:
  (1) refresh=blocking doesn't bust the Query API's cache on repeat polls
  with the same query, so polling against not-yet-ingested data
  permanently poisons the cache with an empty answer that never recovers
  - fixed with refresh=force_blocking; (2) FunnelsQuery itself returns
  empty even with force_blocking against data independently proven
  present via raw HogQL on the identical run_id - replaced with a direct
  count(DISTINCT distinct_id) GROUP BY event HogQL query, verified
  reliable where FunnelsQuery was not; (3) real Kafka to ClickHouse
  ingestion lag on this project is substantial and non-uniform (measured
  via 15-second checkpointing: 1 of 16 events landed in seconds, then a
  ~5-minute plateau, then the remaining 15 together) - timeout raised
  from 2 to 8 minutes. Two wrong turns corrected honestly along the way
  rather than papered over. Final fix verified with a full real
  end-to-end run against live credentials: PASS, 305s. Typecheck, lint,
  and the full 29-test unit suite confirmed no regression. PostHog
  secrets added as GitHub repository secrets so this becomes a real,
  permanent merge-to-main gate (not yet fire-tested live, since that job
  only runs on push to main, which hasn't happened yet pending the rest
  of GATE 3).
- 2026-08-29 — Founder purchased the spontrip.app domain and added it to
  Cloudflare (unblocks Test #3 - INF-3 web/HTTPS - deferred item, not yet
  resumed). Also created a Resend account and verified spontrip.app as a
  sending domain there.
- 2026-08-29 — Test #8 (password-reset email) PASSED, using the newly
  verified domain. Wired real Resend SMTP into
  supabase/config.toml's auth.email.smtp block for real (previously
  entirely commented out - INF-8 had zero working email path in any
  environment before now, a gap the Review Gate had already flagged).
  Hit and fixed one real snag: the first attempt used
  noreply@send.spontrip.app as the sender and got a 550 "API key not
  authorized" rejection from Resend - root-caused via the auth
  container's own logs, not guesswork. Resend's actual verified domain is
  the root spontrip.app; send.spontrip.app only appears in the DNS
  records Resend asks you to add (MX/SPF routing), it is not the sender
  address domain, and the API key must be scoped to match. Fixed by
  using noreply@spontrip.app with a correctly-scoped key. Verified
  end-to-end for real: created a throwaway local auth user with the
  founder's real email, triggered POST /auth/v1/recover, and a working
  password-reset email arrived in about 1 minute (well under the 2-minute
  AC), from the real branded sender. Throwaway test user deleted after.