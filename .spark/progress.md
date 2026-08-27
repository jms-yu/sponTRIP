# Progress / Checkpoint

current_command: /spark-dev
current_phase: Milestone 0 (Scaffold & security baseline) — Phase 1 complete (spec + environment recipe written). M0 has no UI component, so Phase 2 (design spec) is skipped. Entering Phase 3 (build via spark-developer).
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
