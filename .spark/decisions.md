# Decision Log (append-only — never delete entries, only add)

## ⚠️ SUPERSESSION INDEX — read before trusting any entry below

This log is append-only, so obsolete commitments stay visible. Check here first.

| Entry | Status | Superseded by |
| --- | --- | --- |
| 8 (SMS OTP open) | SUPERSEDED | 55 — excluded |
| 29, 34 (cite "project.md §15") | WRONG REFERENCE | The Drawing Rate mechanic is **§14**; §15 is Open items |
| 34 ("fully public" Drawing Rate) | SCOPED, not reversed | 73 — Circle-members-only in Phase 1; applies from Phase 2 |
| 39 (cancelled events never count against individuals) | **AMENDED** | 84 — narrowed to *exempt-reason* cancellations only |
| 63, 69 (16 weeks / 1 Dec 2026 public launch) | STALE | 76 (closed beta), 79 + 83 (capacity model, 15 FTE-weeks) |
| 67 (M6 stays whole in Phase 1) | SPLIT | 74 (live location → Phase 2) + 75 (Magic Bunot stays) |
| 68 ("holds the 16-week estimate and the 1 December target") | STALE tail | 76, 83 — RECAP-1/RECAP-2 split itself still stands |
| 78, 79 (12 FTE-weeks ≈ late January 2027) | SUPERSEDED | 83 — 15 FTE-weeks |
| 83 (15 FTE-weeks ≈ mid-March 2027) | SUPERSEDED | 98 — 19.5 FTE-weeks |
| 98 (19.5 FTE-weeks ≈ mid-May 2027) | **SUPERSEDED** | 109/110 — plan is **21.5 FTE-weeks ≈ mid-June 2027** at the planning assumption; see 109 for why it grew again |
| 72, 76 ("hold December") | **DATE NO LONGER REACHABLE, PUSHED FURTHER** | 99, then 110 — every capacity scenario now lands well after December; founders informed twice and chose to accept the slip both times |
| 60 (badges closed set of 6, Phase 3) | **SUPERSEDED** | 91 — full badge system (26 badges) moved into the closed beta |
| project.md §13 (founder responsibilities) | SUPERSEDED | `plan.md` §6 |
| project.md §12 (1–2 week cadence) | SUPERSEDED | FTE-week model, `plan.md` §4.7 |

## 2026-08-12 — .spark initialized

Initial state files created. Mode: GREENFIELD (no `.spark/codebase.md` present).

## 2026-08-12 — Source material

`SponTRIP-Ideation.md` accepted as raw input only. User explicitly stated the
ideation doc is NOT final and must be iterated before any plan is written.
Standing constraint from user: no development work until the plan is explicitly
finalized and approved at Gate 1.

## 2026-08-12 — Intake batch 1 decisions (Phase 1-A)

**Confirmed by user:**

1. **Platform — DECIDED: React Native + Expo.** iOS + Android from one codebase,
   plus a web surface for share/deep links. Native camera for QR scan, real push,
   OTA updates.
2. **Swipe interaction — CHANGED from ideation doc.** User agreed swipe must never
   transact. Swipe-right-to-register is dropped. Swipe direction convention
   corrected to TikTok standard (swipe up = next). Final interaction model still
   to be settled (feed-first + Discover mode vs. swipe-to-save).
3. **Dynamic form builder — RETAINED at user's explicit instruction.** User
   overrode the recommendation to defer it. Stays in scope.
4. **Video generation for social sharing — CUT.** Moved to future scope. User has
   a separate future-scope document (incl. monetization) not yet shared.
5. **Live location — RETAINED, REDESIGNED by user.** Not continuous GPS. Design:
   joiner toggles sharing ON/OFF. ON → link recipient sees live location. OFF →
   recipient sees event overview/timeline only. Link includes a temporary message
   thread, auto-deleted after the event. Recipients are anonymous (not SponTRIP
   users, no account required).
6. **KYC — CONFIRMED manual review.** No automated biometric face-match vendor.
   Upload gov ID + selfie, reviewed by the founding team.
7. **Admin console — NEW SCOPE, added by user.** Internal admin app: KYC/verification
   approval queue, user counts, dashboards, moderation, operational metrics.
8. **Facebook login — CUT.** SMS OTP raised by user as a possible alternative;
   decision pending.
9. **Payments — CONFIRMED out of scope for SponTRIP.** No money held. GCash/bank
   direct, receipt upload, verification is the organizer's responsibility, not
   SponTRIP's. Must be explicit in UI copy and ToS.
10. **QR check-in — RESOLVED (was open question #1 in ideation doc).** QR encodes
    an opaque ticket ID only; server resolves status at scan time. Cancellation,
    waitlist promotion, kicks and no-shows all handled by status, never by
    reissuing or revoking QR images.
11. **Raffle — RETAINED, RENAMED "Magic Bunot".** Scope widened by user: available
    to private events too, as a casual decision-maker (who pays the bill, etc.),
    not just an organizer prize draw.

## 2026-08-12 — Intake batch 2 decisions (Phase 1-A)

12. **Scope posture — RESOLVED: sequenced, not cut.** All three wedges stay in the
    product vision; they ship in phases. Phase order: (a) Circles + private events
    + Drawing Rate + Magic Bunot, (b) public events + Hubs + KYC, (c) Album depth.
    Each phase must be independently releasable. Nothing is deleted from the vision.
13. **Minimum age — DECIDED: 18+ only for launch.** Under-18 access explicitly
    deferred to a future phase with restrictions. No parental-consent machinery in
    v1. Requires an age gate at signup and matching app store age rating.
14. **Runway — no hard deadline, finite self-funded money.** Plan optimizes for
    earliest useful launch, with later phases staged behind it. No fixed external
    date to build backwards from.
15. **Team composition — CRITICAL PLANNING INPUT.** Neither founder hand-writes
    production code. Both are tech-background graduates, fluent in technical
    concepts and terminology, operating through the SPARK Protocol (AI-assisted
    development) rather than writing from scratch. User A: ideation/product.
    User B: business. Intent to hire career developers when the product scales.

    **Consequences accepted into the plan:**
    - Stack must bias hard toward managed services and conventional, boring,
      well-trodden patterns. No self-hosted infrastructure, no exotic frameworks,
      no microservices. Fewer failure modes the team cannot personally debug.
    - Automated tests and the SPARK review gate are the primary safety net, not
      human code review. Test budget is non-negotiable, not a nice-to-have.
    - Security is the top risk, not velocity. The app will hold government IDs,
      selfies, live location and PII, built by operators who cannot independently
      audit an auth bug. Mitigation: managed auth (never hand-rolled), declarative
      Postgres RLS policies (reviewable as data, not as code), spark-security-
      checklist at every gate, and a paid third-party security review before KYC
      goes live with real documents.
    - Code must stay handoff-ready for the future hires: conventional structure,
      fully typed, tested, documented.

## 2026-08-12 — Intake batch 3 decisions (Phase 1-A)

16. **Budget — DECIDED: under $50/month pre-revenue.** Hard ceiling. Excludes
    one-time costs (Apple $99/yr, Google Play $25 one-time, domain). Drives:
    managed Postgres entry tier, object storage with zero egress fees, free-tier
    email/push/error-monitoring. Plan must state the usage thresholds that force
    the next tier so cost surprises are predicted, not discovered.
17. **Beachhead — DECIDED: one hobby vertical, nationwide.** Specific vertical
    still to be named. Noted tradeoff: geographic scatter thins local turnout,
    but this is materially reduced if the chosen vertical is inherently
    travel-based (rides, hikes) where going somewhere IS the activity.
18. **Design direction — DECIDED: Duolingo/Finch + Airbnb/Klook, combined.**
    Reading: Airbnb bones, Duolingo soul. Clean photo-led surfaces for browsing
    and trust (Navigate feed, event detail, Hub profiles); playful, celebratory,
    character-driven treatment for the social and gamified surfaces (badges,
    Drawing Rate, Magic Bunot, Album, check-in moments). The split is by surface,
    not a blend — blending these two languages evenly produces mush.
19. **Legal documents — OPEN BLOCKER.** Ownership undecided. Required before any
    milestone that ships KYC with real government IDs. Documents needed: Terms of
    Service, Privacy Policy, Community Guidelines, and an explicit liability
    disclaimer that SponTRIP is not a party to any event or any payment between
    joiner and organizer.

## 2026-08-12 — Intake batch 4 decisions (Phase 1-A) — INTAKE COMPLETE

20. **Beachhead verticals — DECIDED: motorcycle rides, diving, office social
    groups.** Chosen for personal founder access to the communities. Focus concern
    resolved by phase-mapping: office groups are a pure Phase 1 cohort (Circles +
    private events, no public feed, no KYC); rides and diving are the Phase 2
    cohort (public events, Hubs, fees). Not three simultaneous verticals — one per
    phase.
21. **Diving surfaces a real form-builder justification.** Divers hold
    certification levels organizers must verify at registration. This independently
    validates the founders' insistence on retaining the dynamic form builder.
    Diving also carries the highest safety stakes and largest registration fees of
    the three verticals, raising the consequence of the fake-receipt risk.
22. **Runway — DECIDED: 18+ months, day jobs cover costs.** No hard external
    deadline. Standing counter-guidance recorded: launch Phase 1 early regardless,
    because the chosen success metric cannot be measured without real users.
23. **Success metric — DECIDED: repeat behavior.** Not signup count. Whether a user
    who joins one event joins another. Consequence: product analytics instrumented
    from Milestone 0. Exact target number still to be set. Secondary metric: events
    reaching the Painting phase with real check-ins.
24. **Maps — DECIDED: deep-link out, no in-app map.** Venue name + address + button
    opening Google Maps/Waze. Zero cost. Accepted loss: map browsing and visual
    nearby-discovery. Revisit post-revenue.
25. **Design language split — refined and recorded.** Airbnb/Klook treatment on
    trust-and-legibility surfaces (Navigate feed, event detail, Hub profile,
    registration, payment). Duolingo/Finch treatment on emotional surfaces
    (check-in, badge unlocks, Drawing Rate, Magic Bunot, Album, streaks). Split by
    surface, never blended evenly — an even blend produces a product that is
    neither trustworthy nor fun.
26. **Phase 1 carries no KYC.** Deliberately preserved property: Phase 1 collects
    no government IDs, so the heaviest RA 10173 obligations and the legal-document
    blocker both land in Phase 2. Milestone structure must maintain this so Phase 1
    can launch on standard ToS + Privacy Policy.

**Phase 1-A intake COMPLETE.** Written to `.spark/project.md`. Awaiting founder
confirmation before proceeding to Phase 2 (research).

## 2026-08-12 — CORRECTION: QR check-in moves to Phase 1

27. **QR check-in reassigned from Phase 2 to Phase 1.** Founder correction,
    accepted. Rationale: Drawing Rate is the Phase 1 wedge, and it has no data
    source without check-in. Attendance is not derivable from RSVPs,
    confirmations, or chat activity — only a check-in proves a plan happened.
    Check-in is the measurement instrument for the wedge, therefore load-bearing
    in Phase 1. Phase 2 adds organizer-scale tooling on the same ticket model.
    Increases Phase 1 size; justified.
28. **Offline check-in with deferred sync — HARD REQUIREMENT.** Two of the three
    beachhead verticals (motorcycle touring, diving) routinely operate with no
    mobile signal. Online-only check-in fails precisely where the beachhead users
    are. Scans queue locally, sync on reconnect.
29. **Drawing Rate mechanic specified by founders** — six rules recorded verbatim
    in `project.md` §15, with nine design issues flagged for resolution before
    build. The safety-critical one: weather/safety cancellations must be exempt
    from penalty, because a reputation mechanic must never make riding or diving
    in dangerous conditions the cheaper choice.
30. **Drawing Rate screenshot-sharing is the intended growth loop**, per founder —
    not incidental. Treated as a first-class design target for the Duolingo-soul
    surface treatment, not an afterthought export button.
31. **Scan model — DECIDED: Leader displays one rotating QR, members scan it.**
    Chosen over Leader-scans-each-member. Faster at office-group size, removes the
    Leader bottleneck, and the rotating code defeats screenshot-forwarding, which
    matters because a reputation score creates real incentive to cheat. Offline
    compatible: scan + timestamp queues locally, server validates validity at that
    timestamp on sync. Phase 2 organizer flow will layer on the same ticket model.
32. **Cancellation — DECIDED: reason required, safety exempt.** Weather, safety,
    illness, emergency carry no penalty. "Nobody showed" / "all backed out" counts
    against the group. Resolves the safety-critical issue flagged in decision 29.
33. **Attribution — DECIDED: Leader confirms the final attendance list** after the
    event, pre-filled from scans and editable. Resolves three flagged issues at
    once: the rules 2/3 conflict, the missing manual override (dead phone, no
    signal), and the "event happened but nobody scanned" grace path.
34. **Visibility — DECIDED BY FOUNDER: group AND individual Drawing Rate both
    fully public.** Taken against the recommendation to keep individual rates
    private-to-self-and-Circles. Concern stated and accepted by the founder: a
    permanently public reliability score on a real person is a social weapon among
    friends and a gatekeeping mechanism against strangers in Phase 2. Proceeding
    as decided, with required mitigations recorded in project.md §15: minimum
    event threshold before display, excused absences excluded, and positive
    framing shown alongside negative.
35. **Only finalized events count toward Drawing Rate.** Prevents the mechanic from
    suppressing the planning behaviour it exists to encourage.
36. **Scoring model — DECIDED (founder clarification, endorsed): individual Drawing
    Rate penalises broken commitments only.** Confirmed-then-no-showed counts.
    Declining or never confirming has zero effect. Rationale: penalising declines
    would train ghosting, the exact behaviour the product exists to fight. Free to
    say no, costly to break a promise.
37. **Two stats from one base.** Individual Drawing Rate (no-showed ÷ confirmed)
    and show-up record + streak (showed ÷ confirmed). Same denominator — events
    the user confirmed for — so declined invites appear in neither. Satisfies the
    positive-framing mitigation required by decision 34.
38. **Group vs individual Drawing Rate are different measurements sharing a name.**
    Group = finalized events that didn't push through ÷ finalized events.
    Individual = confirmed-but-no-showed ÷ confirmed. Must not be conflated in
    implementation.
39. **Cancelled events excluded from the individual denominator.** If an event is
    cancelled, nobody no-showed; it must not count against any individual.
40. **Display — DECIDED: all three layers.** Playful tier label + mascot as the
    shareable headline, exact percentage on tap, show-up streak as a separate
    prominent positive stat. Not alternatives — three layers of one card.
41. **Window — DECIDED: rolling last 6 months.** Users can recover; score stays
    motivating rather than fatalistic.
42. **Confirmation is required to check in — DECIDED.** No confirmation, no scan,
    no credit. Closes the "never confirm, just show up" loophole: non-confirmers
    escape penalty but earn no streak and no show-up record, so their profile
    reads "no track record yet," which signals on its own. Leader may still add a
    walk-in manually during attendance confirmation. Consistent with Phase 2,
    where paid registration already requires confirming.

**Drawing Rate mechanic is now fully specified** (`project.md` §14). Ready for
Phase 2 research.

## 2026-08-12 — Phase 2 (Research) complete

spark-researcher report incorporated into `.spark/plan.md` v0.1 §2 (DRAFT).
Findings that change or constrain the plan:

43. **No prior art exists for a public peer-to-peer flake score.** Closest shipped
    analog is FLKE (iOS), which solves the identical problem with a *financial*
    penalty rather than reputation. Ambiguous evidence: either money is the more
    legible incentive and Drawing Rate is unvalidated, or reputation is genuinely
    novel and defensible. Unresolvable by research. **Recorded as the single
    riskiest bet in the project** — not the stack, budget, or timeline. Must be
    instrumented and watched from day one of Phase 1.
44. **Facebook incumbency confirmed as fact, not assumption.** All three beachhead
    verticals (PH motorcycle clubs, dive communities, office groups) are verified
    to organize on Facebook Groups today. Facebook holds ~91.6% PH social traffic
    share and is not eroding.
45. **Problem is culturally corroborated but NOT survey-validated.** No published
    study quantifies "puro plano lang." Raises the stakes on the repeat-behavior
    metric as the only real validation mechanism.
46. **Stack options costed — Supabase + Cloudflare R2 recommended** (Option A of
    three). Deferred to founders at Gate 1. Modeled: ~$25/mo at 100 users,
    ~$25–40 at 1,000, **~$60–130 at 10,000 (breaks ceiling)**. Cloudflare R2 for
    photos in all three options — zero egress fees is decisive for a photo-heavy
    app; no backend's native storage matches it.
47. **Chat concurrency is the real budget breakpoint, not user count.** Cannot be
    derived from pricing pages. Load-test early. Recorded as a required
    Milestone-0-era activity.
48. **SMS OTP — research recommends dropping from MVP entirely.** Cost is
    negligible; SMS pumping fraud is the real risk. Google/Apple/email cover auth
    without touching phone numbers. Supersedes the open question from decision 8.
    **Pending founder confirmation.**
49. **n8n — research recommends deferring.** No free Cloud tier as of 2026 ($24/mo
    floor); self-hosting violates the managed-services-only constraint. Low-volume
    internal alerts achievable at ~$0 via Postgres triggers / Edge Functions →
    Slack/Discord webhook. **Pending founder confirmation.**
50. **Account deletion requires TWO paths — hard store requirement.** In-app delete
    flow AND a web-based deletion path reachable after uninstall (Google). This is
    a Milestone 0/1 build item; submission fails without it.
51. **17+ App Store rating expected** regardless of the internal 18+ gate. Store
    rating and in-app age verification are separate mechanisms; both required.
52. **2026 UGC moderation policy expects automated moderation at scale.** Manual
    review alone is explicitly not considered sufficient as volume grows. The
    planned admin console meets the launch-scale baseline, but manual-only
    moderation is recorded as a medium-term platform risk given moderation is
    founder labor.
## 2026-08-12 — Stack DECIDED by founders

54. **Stack — DECIDED: Option A, Supabase + Cloudflare R2.** Founders accepted the
    recommendation in full. Client: React Native + Expo. Backend: Supabase
    (Postgres + RLS + Auth + Realtime + Edge Functions). Object storage:
    Cloudflare R2 (zero egress). Transforms: Cloudflare Images. Analytics:
    PostHog. Monitoring: Sentry. Email: Resend. Push: Expo Push. Written to
    `config.md`. Chosen over the cheaper AWS Amplify option specifically because
    Postgres RLS gives one reviewable access-control surface, and over Firebase
    because Firestore has no hard spending cap.
55. **SMS OTP — DECIDED: EXCLUDED.** Founders confirmed. Closes the open question
    from decision 8. Auth is Google Sign-In + Sign in with Apple + email only.
56. **n8n — DECIDED: EXCLUDED.** Founders confirmed. Internal ops alerts (KYC
    queue, moderation escalation) to be handled by Postgres triggers / Edge
    Functions posting to a Slack or Discord webhook at ~$0.

## 2026-08-12 — Phase 3 (Risk) complete

57. **Risk register written to plan.md §3.** 5 project-killing risks (K1–K5),
    30 catalogued risks (R1–R30), plus a §3.10 watch list to instrument from M0.
    Highest-value findings not previously named: **K1** — the rational strategy is
    to never confirm, which destroys the headcount signal Leaders actually need;
    **K2** — the Leader unilaterally edits attendance with no member visibility,
    no audit trail and no dispute path, making reputation integrity a single point
    of failure, and the weather exemption is self-reported with no verification;
    **R2** — the Phase 1 cohort is coworkers, so public scores land inside
    workplace power dynamics; **R7/R8** — offline check-in and rotating-QR
    anti-cheat are in direct unresolved tension; **R23** — tests-as-code-review
    gives false confidence for precisely the RLS/auth bug class this team cannot
    catch by inspection.

## 2026-08-12 — Phase 4 (Features & Milestones) complete

58. **Phase 1 has NO Navigate tab.** There is no public corpus to browse in Phase 1;
    a discovery surface with nothing to discover is invented scope. Phase 1's home
    surface is a Home tab (your Circles, their events, your Drawing Rate card).
59. **Navigate is Phase 2, feed-first.** Filterable Airbnb-style list as the default
    surface, with an **opt-in Discover swipe deck (TikTok convention) that is
    save-only and can never transact** — completing decision 2.
60. **Badge system v1 — closed set of 6, Phase 3.** All derived from data already
    tracked. **No organizer-awarded and no admin-awarded badges** (avoids reopening
    a fairness/moderation surface). A 7th badge requires a new decisions.md entry —
    this is the written boundary R29 demands.
61. **Album is Phase 3 only — no Phase 1 version.** Designer declined to invent
    scope against project.md §5's explicit phase table. Video generation stays cut
    and must be re-stated in Album's own acceptance criteria (R30).
62. **Magic Bunot specified.** Server-side CSPRNG draw in an Edge Function, never
    client-computed; result auto-posts as an immutable system message so it is
    witnessed; no re-draw; **no monetary or prize-value field anywhere**, keeping
    R17's gambling tripwire untripped.
63. **Phase 1 = 9 milestones (M0–M8), ≈16 weeks.** Longer than "launch early"
    implies, and honestly flagged as such. The length is the cost of turning
    risk-driven requirements into real build items rather than intentions.
    **Largest compressible block: M6** (Magic Bunot + live location) — flagged for
    founder decision, not cut unilaterally. **Largest schedule risk: M3** (QR
    anti-cheat), deliberately timeboxed with a documented narrower-guarantee
    fallback.
64. **Admin console gets its own milestone (M7)** per R28, so its scope growth is
    visible rather than silently absorbed.
65. **Phase 2 hard gate recorded.** Before any real (non-test) KYC data flows in
    production: legal documents AND the paid third-party security audit both
    complete and logged. Feature flag keeps real KYC submission disabled until then.

## 2026-08-12 — Founder decisions on Phase 4 open items

66. **DR-5 minimum-events threshold — DECIDED: N = 3.** Below three confirmed and
    resolved events, the profile shows "no track record yet" rather than a number.
67. **M6 — DECIDED: stays in Phase 1 as locked.** Founders declined compression.
    Magic Bunot and live location both ship at launch. Phase 1 remains 9 milestones.
68. **Event Recap Card — DECIDED: Version A at launch (RECAP-1, ships in M5),
    Version B in the first post-launch update (RECAP-2).** Scoping correction that
    drove this: the "nearly free" claim holds for card composition but not for
    inputs, since Phase 1 has no event photo upload. Version A is stats-only and
    near-zero cost; Version B adds ~1 week AND introduces user-generated photo
    content into Phase 1, expanding TS-1 scope, the M7 moderation queue and the
    store UGC profile — recurring manual work under K3, not just build time.
    Deferring also means the founders learn whether the stats card is shared at all
    before investing in a photo pipeline. **Holds the 16-week estimate and the
    1 December target.**
69. **Phase 1 launch target — DECIDED: 1 December 2026.** Self-imposed forcing
    function per R25, not an external deadline. Assumes the 1–2 week cadence holds;
    both founders work day jobs. Purpose is to make slippage visible and deliberate
    rather than silently absorbed. Review at M4 against actual cadence.
70. **Defaults accepted without objection:** waitlist confirmation window 2 hours
    (Phase 2, revisit at re-planning); KYC document deletion within 72 hours of
    decision (to mirror into `security.md`).

## 2026-08-12 — Phase 5 validation FAILED; founder decisions on remediation

71. **Capacity — founder answer: "varies a lot week to week."** No fixed weekly
    number available. Consequence for planning: estimate against a conservative
    average, and structure milestones so slippage is **visible per-milestone**
    rather than accumulating invisibly toward the end. The M4 mid-point review
    becomes load-bearing, not ceremonial.
72. **Date vs scope — DECIDED: hold December, narrow the scope.** Founder
    requirement added: **Magic Bunot must stay in the narrowed Phase 1**, on the
    reasoning that it will be used at Christmas parties. Endorsed — see 75.
73. **Phase 1 Drawing Rate visibility — DECIDED: Circle members only.** Scores are
    visible to people in Circles you share. Full public visibility deferred to
    Phase 2, when profiles have an actual audience. **Resolves the decision 34 ×
    decision 58 collision** (validator issue 5): "fully public" had no
    implementation surface in Phase 1. Also gives R2 (coworkers seeing each
    other's flake scores) an honest mitigation without reversing decision 34
    product-wide. Decision 34 is hereby **scoped, not reversed** — it now applies
    from Phase 2 onward.
74. **Live location — DECIDED: deferred to Phase 2.** Its stated justification in
    project.md §10 is motorcycle touring and diving safety, which is the Phase 2
    cohort; the Phase 1 office cohort has near-zero need for it. Deferring also
    removes Phase 1's **only unauthenticated write surface** and removes
    geolocation from the Phase 1 legal scoping — which directly narrows validator
    issue 8. Supersedes the live-location half of decision 67.
75. **Magic Bunot — CONFIRMED in the narrowed Phase 1.** Genuinely small (~2–3
    days: an Edge Function plus an immutable chat message) and it is the strongest
    between-events retention hook. The Christmas-party reasoning is sound and is
    reinforced by the Kris Kringle observation logged below. Supersedes the
    Magic Bunot half of decision 67 (M6 is split along the line where the real
    cost is).
76. **"Launch in December" — REDEFINED: closed beta, not public store launch.**
    TestFlight + Google Play closed track with the founders' own office Circles
    during Christmas-party season. Public store launch Q1 2027 with real usage
    data behind it. Rationale: Google Play's 12-tester/14-continuous-day closed
    test is **mandatory** for a new personal developer account before production,
    so this route is compulsory regardless; TestFlight is effectively immediate;
    and the beta cohort is reachable by email without a store listing. Gets the
    seasonal signal without a fictional public-launch date.
77. **Kris Kringle / Monito Monita — RAISED, DEFERRED by founder.** Filipino office
    Christmas gift-draw is literally a bunot, and Magic Bunot already has the draw
    infrastructure (server-side draw, participant pool, immutable posting). Would
    need a derangement rule (nobody draws themselves) plus private per-person
    reveal — est. 2–3 days. Founders chose to ship basic Magic Bunot first and see
    whether it is used at all before building a variant. **Logged as a strong
    seasonal-acquisition candidate for a future update, not lost.**
78. **Group chat + DMs — FOUNDER DECISION: stay in the December beta.**
    Recommendation was to defer (largest single build item at ~2.5 FTE-weeks,
    largest cost risk via concurrent connections per R9, and most of the Phase 1
    UGC moderation surface; beta cohort already coordinates in Viber/Messenger).
    **Founders declined; chat stays.** Consequence stated and accepted: the
    minimal beta rises from ~9.5 to **~12 FTE-weeks**, making December a stretch
    target rather than a plan. Milestones are therefore structured so tracking is
    visible by M3 rather than discovered at the end.
79. **Capacity assumption — STATED, correcting validator issue 2.** No fixed
    founder number is available (decision 71: "varies week to week"). The plan is
    computed against **20 combined productive hours per week** as the working
    midpoint, with the sensitivity shown rather than hidden:
    - 12 FTE-weeks ≈ 480 hours
    - @ 30 hrs/wk → 16 calendar weeks → **early December 2026**
    - @ 25 hrs/wk → 19 calendar weeks → **late December 2026**
    - @ 20 hrs/wk → 24 calendar weeks → **late January 2027**
    - @ 15 hrs/wk → 32 calendar weeks → **late March 2027**
    An FTE-week means 40 hours of work, not one calendar week. AI-assisted
    development compresses typing, not decision-making, testing, credential
    plumbing, or debugging. **Founders should correct this assumption if wrong —
    every date in the plan derives from it.**

## 2026-08-13 — Phase 5 remediation complete (validation loop 1)

80. **All 12 major validation issues remediated.** `plan.md` bumped to v0.2,
    `milestones.md` to v0.2, `security.md` created, `project.md` corrected.
    Summary of what changed:
    - **Issue 1** — feature specification written with canonical IDs in `plan.md`
      §4.1. `milestones.md` previously referenced 40+ IDs that were defined
      nowhere; the scope was literally unwritten.
    - **Issue 2** — capacity model added (`plan.md` §4.7). See decision 79.
    - **Issue 3** — walk-in loophole closed via the four-state scoring table
      (`plan.md` §4.5). Walk-ins count for headcount and the recap card only,
      never for score.
    - **Issue 4** — four undefined Drawing Rate states now defined: late sync
      (provisional until T+72h), Leader never confirms (auto-resolve at T+7d),
      cancel-with-partial-attendance (any check-in ⇒ treated as held), and the
      Leader's own attendance (QR-5 + distinctly logged self-edits).
    - **Issue 5** — resolved by decision 73 (Circle-scoped visibility in Phase 1).
    - **Issue 6** — SHELL-1…4, HOME-1, PROF-1, SET-1, NOTIF-1 added; M1 now owns
      the app shell, IA and design system, which no milestone previously did.
    - **Issue 7** — Cloudflare Pages named as the web target in `config.md` and
      `project.md` §8; INF-3 added to M0.
    - **Issue 8** — `project.md` §9 corrected; narrowed by decision 74.
    - **Issue 9** — SEC-2 (CI negative-authorization suite, blocking merge),
      SEC-3 (key segregation), SEC-4 (`security_invoker` on views) added; RLS
      review split into two passes (after M2 and after M7); budget gap flagged
      explicitly rather than left implicit.
    - **Issue 10** — `plan.md` §5 written and `.spark/security.md` created.
    - **Issue 11** — M8 redefined as **beta** launch; Google Play's 12-tester /
      14-continuous-day gate and Apple enrolment moved to week-1 parallel tasks.
    - **Issue 12** — M4 (was M3) re-estimated from 2 weeks to **1 FTE-week**; R7
      and R8 restated in `plan.md` §3.4. The original R7 framing asked the wrong
      question and would have burned the entire timebox on an unsolvable
      client-side-validation problem. **Device clock manipulation** named as the
      real residual attack.
81. **Rotation's true guarantee recorded for knowing approval:** rotation raises
    the cost of *casual* cheating only. It does not resist a colluding Leader, a
    colluding present member, or clock manipulation in the offline path. **The
    Leader's attendance confirmation is the actual control.** It must never be
    described to users as a guarantee — K2's credibility failure is precisely what
    happens when users discover the limits themselves.

## 2026-08-13 — Validation loop 2 (final loop) and remediation

82. **Loop 2 verdict: 11 of 12 loop-1 majors FIXED**, 7 new issues raised — almost
    all consequences of the fixes. Fixes applied without needing founder input:
    RECAP-1 restricted to **aggregate counts only, no individual names or
    attendance status** (it would otherwise have let any attendee publish a
    colleague's no-show — the exact disclosure decision 73 narrowed, in the exact
    cohort R2 names); **event lifecycle defined** (draft → finalized → held →
    provisional → resolved) with **scores moving only on resolution**, so a public
    number never changes twice in 72h; **`T` defined as the event end time** and
    added to EVT-1, since five features and the state machine anchored on a
    timestamp the event model did not have; **edit precedence defined** (a scan is
    evidence, a Leader edit is judgement — Leader may override but it is logged
    distinctly and counted); **QR-4 downgraded from detection to forensics**
    because true clock-manipulation detection needs a native module and paired
    online baselines, unaffordable in a 1 FTE-week milestone; **QR-6 added** so
    non-confirmed scans are refused rather than silently ignored (closing a gap
    between decision 42 and the QR spec); **ONB-1 added** (onboarding was
    referenced by AUTH-1 and M8 but defined nowhere); **M1's acceptance criteria
    rescoped** to surfaces that exist at M1, with a **standing definition of done**
    enforcing empty/loading/error states, dark mode, deep links and negative-auth
    tests in *every* milestone; **checkpoint moved from milestone-anchored to
    calendar week 8**, because M0–M3 completes in calendar week 16 — the checkpoint
    would have fired after the date it exists to protect; rate limiting and
    dependency scanning added to `security.md`; audit-log anonymisation-in-place
    defined to reconcile with AUTH-5; `config.md` web target corrected.
83. **CAPACITY CORRECTION — the plan is 15 FTE-weeks, not 12.** Decisions 78 and 79
    recorded founder consent against **12 FTE-weeks ≈ late January 2027**. The
    remediated plan is **15 FTE-weeks ≈ mid-March 2027** at the 20 hrs/week
    assumption. **The growth is legitimate** — it is the cost of fixing loop-1
    issues 1, 6, 7 and 9: the app shell / IA / design system (~2.5 FTE-wk, owned by
    no milestone before), the web target, scheduled-job infrastructure, and the CI
    security suite. None of it is scope creep; all of it was missing work the plan
    had been getting for free. **Consequence for decision 78:** the chat trade-off
    no longer computes as stated — under current estimates cutting chat saves
    ~1.0–1.5 FTE-weeks, not 2.5. **Founders must be re-shown this at Gate 1**;
    their choice was made on arithmetic that has since changed.
84. **Decision 39 AMENDED — individual penalties apply only on NON-EXEMPT
    cancellations.** §4.5(c)'s "any check-in ⇒ treated as held" rule correctly
    fixed the ten-confirm/three-show/"everyone backed out" case, but as written it
    also penalised confirmed absentees when a Leader cancelled for **weather or
    safety** — contradicting decision 39 verbatim and, more seriously, decisions
    29/32's safety-critical principle that the mechanic must never make calling off
    a ride or dive the expensive choice. Low stakes for an office beta; a genuine
    safety issue for the Phase 2 rides and diving cohort, and the rule is being
    written now. **Attendees still receive show-credit either way.** Pending
    founder confirmation at Gate 1.
85. **Privacy Policy is BETA-BLOCKING, not public-launch-blocking.** `security.md`
    §4 previously said legal did not block the closed beta. Wrong on both stores:
    Google Play requires the Data safety form and a **live HTTPS privacy policy
    URL** for **closed** tracks, and Apple requires **Beta App Review** for
    *external* TestFlight testers — an office-colleague cohort is external, not
    internal — with a privacy policy URL in the Beta App Information. Corrected.
    Mitigating fact: the beta's data footprint is narrow (no government IDs, no
    location, no payments), so a beta-scoped policy is a much smaller ask than the
    Phase 2 set. **Ownership still unassigned since decision 19 — now on the
    critical path.**

## 2026-08-13 — GATE 1 founder decisions

86. **Excused absences RESTORED — third attendance state.** ATT-1 becomes
    present / absent / **excused**. Excused scores nothing (0 numerator, 0
    denominator) and **preserves the streak without incrementing it**. Leader must
    give a reason, logged in the ATT-3 audit trail, with the per-Circle excused
    rate surfaced on ADM-5 so it cannot become the new self-reported escape hatch
    (the failure mode R19 identifies for the weather exemption). Excused events do
    not count toward DR-5's three-event threshold. Restores the fourth mitigation
    `project.md` §14 requires for a visible score, which had been silently dropped
    in the v0.2 rewrite.
87. **Decision 39 AMENDED (confirming 84): individual penalties apply only on
    NON-EXEMPT cancellations.** Attendees receive show-credit either way. Preserves
    decisions 29/32's safety-critical principle — the mechanic must never make
    calling off a ride or dive in bad conditions the expensive choice. The
    ten-confirm/three-show/"everyone backed out" case that motivated §4.5(c) is a
    non-exempt reason and remains correctly penalised.
88. **Beta legal documents — founder-drafted; lawyer engaged before public launch.**
    Closes the ownership gap open since decision 19. Rationale: the beta's data
    footprint is genuinely narrow (no government IDs, no location, no payments), so
    a beta-scoped Privacy Policy plus minimal ToS is a small, well-understood ask;
    professional drafting is reserved for public launch, when Drawing Rate's public
    scoring (R15) and Phase 2's geolocation actually require it. **Must be live at
    a real HTTPS URL before M8** — both stores check it for closed-track betas.
89. **Chat — founder answer RE-CONFIRMED against corrected arithmetic.** Founders
    were re-shown decision 83's numbers (plan is 15 FTE-weeks not 12; cutting chat
    now saves ~1–1.5 weeks, not the 2.5 originally stated) and **kept chat**.
    Recorded as a knowing decision on accurate figures. Beta remains **15
    FTE-weeks ≈ mid-March 2027** at the 20 hrs/week planning assumption, or **late
    January 2027** at a sustained 25 hrs/week.

## 2026-08-13 — Post-Gate-1 scope addition: poll, badge system, check-in template

> Raised by the founder after reviewing Gate 1, alongside `SponTRIP_Badge_System.md`.
> Not yet re-approved at Gate 1 — see decision 100.

90. **Poll feature recovered from the original ideation doc (§6.3), dropped during
    Phase 4 feature design.** This was an omission, not new invention. Shape:
    Circle Leader posts a question with options in chat; each member votes once;
    live tally visible to all; closing the poll **auto-populates a new event's
    title and description** with the winning option, which the Leader can still edit.
91. **Badge system moved from Phase 3 (decision 60) into the closed beta —
    SUPERSEDES decision 60.** All three lists in `SponTRIP_Badge_System.md`
    included: Onboarding (7), Circle Achievement (10), No-Show/Drawing (9) — 26
    badges total. **The document itself is the written boundary** the R29
    discipline requires: any badge beyond this fixed list needs a new
    `decisions.md` entry, exactly the rule decision 60 established for the
    original 6. The doc's other named collections (Explorer, Social, Streak,
    Legend) have no concrete badges defined yet and are **not** built now.
92. **No-show/Drawing badges ship exactly as drafted** — founder overrode the
    recommendation to hold them back, given their tension with Drawing Rate's own
    visibility safeguards (K2, R2). Two mechanical fixes applied to keep this
    consistent with decisions already made, not re-litigating the inclusion call:
    - **(a)** Unlock is gated behind Drawing Rate's 3-event minimum display
      threshold (DR-5) — a badge can never surface a worse signal earlier than the
      score itself would.
    - **(b)** No-show badge visibility is **Circle-scoped**, following decision 73
      — the same sensitive class of data gets the same protection Drawing Rate has.
93. **Onboarding and Circle Achievement badges are visible on the global profile**
    (no privacy concern — these are positive). A user **pins 2–3 as "featured"**
    on their profile (BADGE-3). The badge collection page (BADGE-2) shows locked
    badges with a plain-language unlock hint, and unlocked badges with their art.
94. **Circle badge thresholds (25-member Circle, 5 Circles, 50 events) kept exactly
    as drafted**, despite being unlikely to unlock during the beta window. They are
    permanent goals that stay meaningful into Phase 2/3, not beta-scoped numbers,
    and resizing them costs nothing either way.
95. **"The Frida" badge's undeterminable trigger fixed with a new data field.**
    Nothing in the current model classifies a Circle's interest as "unique," so
    Circle creation (CIRC-1) gains an **optional category tag** (CIRC-4) drawn
    from the existing event-category list (Sports, Socialize, Rides, Nature, etc.).
    Frida unlocks when a Circle's category isn't already used by another Circle its
    creator belongs to — deterministic, no admin judgment required. This also
    pre-positions the category field **Phase 2's Navigate feed already assumes**
    (NAV-1's category filtering), so the work isn't wasted outside the badge system.
96. **Check-in photo template recovered from the original ideation doc (§9.2),
    scoped EPHEMERAL per founder choice.** A photo is picked from camera or
    library, composed client-side against a founder-designed template, and shared
    via the native share sheet. **It is never uploaded and never stored** — no new
    moderation surface, no new UGC exposure. This deliberately does **not** reopen
    decision 68's reasoning for keeping event photos out of Phase 1: RECAP-2 (the
    persisted, gallery-based version) **remains deferred** to the first
    post-launch update.
97. **Founder responsibility added — critical path:** artwork for all ~26 badges,
    plus the check-in share templates, must be delivered before the new milestone's
    UI work begins. Same pattern as the existing mascot-before-Drawing-Rate
    dependency (decision 68's critical-path note).
98. **Total effort grows from 15.0 to 19.5 FTE-weeks — SUPERSEDES decision 83's
    figure.** New milestone (~4.5 FTE-weeks): poll ~1.0, category tag ~0.25, badge
    data model + unlock engine for 26 badges ~1.5, collection page ~0.5, profile
    pinning ~0.5, check-in template ~0.5. **Per founder instruction: the slip is
    accepted and logged rather than trading away other scope.** At the 20 hrs/week
    planning assumption the beta now lands **mid-May 2027**. At a sustained
    30 hrs/week it lands **mid-February 2027**.
99. **Strategic consequence — flagged for the record, not re-litigated.** The
    original case for "hold December, narrow scope" (decision 72) was to land
    inside Philippine office Christmas-party season for the beachhead cohort. At
    every capacity scenario in the revised table, delivery now lands **after** that
    season ends — the seasonal rationale that motivated the December target no
    longer applies. The founder was informed of this consequence directly and
    chose to accept the added scope and the slip anyway.
100. **NOT YET RE-APPROVED.** This scope addition happened after the Gate 1
     presentation. `plan.md`, `milestones.md` and `proposal.md` have been updated
     to reflect it. **Gate 1 approval is still pending** and now covers this
     revised scope, not the version originally presented.

## 2026-08-13 — Second post-Gate-1 addition: recurring events, Reason Rate

101. **Recurring events — silence stays risk-free, confirming decisions 36/42
     apply identically to recurring occurrences.** Founder's original workflow
     proposed penalizing non-response on an individual's Drawing Rate; founder
     chose instead to keep the existing rule (only confirmed-then-no-show counts)
     rather than reverse it. Avoids the "Everyday recurrence bleeds your score
     daily" failure mode raised during review.
102. **Reason Rate — DECIDED: a fun fact, not a score.** "Most common reason"
     shown as a descriptive profile element — no number, no ranking, no peer
     judgment of reason credibility. The higher-risk "credibility-judged" version
     is explicitly parked, not built, matching the Kris Kringle precedent
     (decision 77).
103. **Recurrence build approach — orchestrator recommendation adopted (stated as
     a correctable default, not directly confirmed).** Auto-recreate convenience:
     the Leader sets an interval once; each occurrence is generated as a fully
     normal event (its own EVT-1 row, its own confirm/decline, its own QR
     finalize/check-in, its own attendance and Drawing Rate resolution) rather
     than a series/occurrence data model with "edit this vs. edit all future"
     propagation logic. Editing one occurrence never affects another. This is
     what keeps the feature cheap — it reuses the entire existing event pipeline
     instead of building a second one.
104. **"As needed" corrected by founder to custom weekday selection (e.g. MWF,
     TTH).** Folded into the **Weekly** interval as a multi-day-of-week selector
     rather than added as a separate 8th interval type — a single day selected is
     the ordinary "weekly" case, multiple days selected is the MWF/TTH case, same
     mechanism either way. Simplifies rather than adds complexity.
105. **Decline reason — DECIDED (orchestrator default, stated plainly): optional,
     not mandatory, and applies to declining ANY event, not just recurring
     occurrences.** Rationale: a mandatory reason on every decline adds friction
     that could push users toward silence instead of an honest decline — the same
     failure mode decision 36 was written to prevent, reintroduced through the
     back door. Optional entry still feeds Reason Rate (decision 102) from
     whoever chooses to fill it in.
106. **Zero-response recurring occurrence — resolution defined.** An occurrence
     that is never finalized (because nobody engaged with it) simply expires with
     **no group or individual Drawing Rate impact**, consistent with decision 35
     (only finalized events count at all). If the Leader finalizes anyway despite
     low or no response and the event then doesn't happen, ordinary DR-3/DR-4
     group-scoring rules apply — no new logic required.
107. **Reason Rate visibility — Circle-scoped**, following the same pattern
     established for no-show badges (decision 92b). Derived from decline/cancel
     reasons, the same sensitive-adjacent category as flaking data.
108. **Recurrence interval list finalized:** Daily / Weekly (with day-of-week
     multi-select) / Bi-Weekly / Monthly / Bi-Monthly / Quarterly / Annually.
     **No end-date or occurrence-count option in the beta** — a series recurs
     until the Leader manually stops it. Stated as a default; add an end
     condition later if testers ask for one.
109. **Effort re-estimated after the safer scope was chosen: ~2.0 FTE-weeks**,
     not the larger figure a full series-model-plus-scoring-change would have
     required. Reuses M0's scheduled-job infrastructure (INF-4) to auto-generate
     the next occurrence, and reuses the entire existing EVT/QR/ATT/DR pipeline
     per-occurrence with no new scoring logic. Folded into **M8**, alongside the
     poll/badge/check-in-template work already there (decisions 90–98).
     **M8: 4.5 → 6.5 FTE-weeks. Total beta effort: 19.5 → 21.5 FTE-weeks.**
110. **Capacity table updated for 21.5 FTE-weeks (860 hours):** 30 hrs/wk → 29
     calendar weeks → early March 2027; 25 hrs/wk → 34 weeks → early-mid April
     2027; **20 hrs/wk (planning assumption) → 43 weeks → mid-June 2027**;
     15 hrs/wk → 57 weeks → mid-September 2027. Stated plainly, once, per the
     pattern established at decision 99 — not re-litigated further.
111. **NOT YET RE-APPROVED.** `plan.md`, `milestones.md`, `project.md` and
     `proposal.md` updated to reflect this second addition. Gate 1 approval is
     still pending and now covers 21.5 FTE-weeks of scope.

---

## Corrections to earlier entries

- **Entries 29 and 34 cite "project.md §15"** for the Drawing Rate mechanic. The
  correct reference is **§14**; §15 is "Open items." Recorded here rather than
  editing the entries, since this log is append-only.
- **Entry 53 appeared out of sequence** below entry 70 in an earlier revision.
  Restored to numeric position below.

53. **Success metric target should be RELATIVE, not absolute.** Generic D30
    benchmarks (5–20%) measure a different, much weaker behavior than
    joined-one-event → joined-another. Recommend "repeat-join rate trends upward
    month over month" instead of anchoring to an external number.

---

## 2026-08-28 — Gate 1 (revised scope, 2nd addition): open items resolved

112. **SEC-5 (paid/independent human RLS review) DROPPED as a hard milestone
     gate on M2 and M7.** Kept as a standing recommendation, not a blocker.
     Founder's explicit rationale: security remains the top priority given
     multiple users share data through the app, but the two-checkpoint external
     review specifically was judged not worth its unbudgeted cost/schedule risk
     as a *hard gate*. **This does not weaken the mandatory security posture
     elsewhere in the plan** — SEC-2 (automated negative-authorization CI suite,
     blocking merge on every PR) remains required and unchanged, as does
     `spark-security-checklist` enforcement on all auth/RLS/user-data code and
     `spark-review-gate`'s security audit at every milestone's Review Gate.
     Founders (with AI-tool assistance) may still self-review RLS policies at
     the same two checkpoints at no added cost; that is now optional, not
     required. `plan.md` §5.1 item 6 and `security.md` updated accordingly.
113. **Google Play Developer account type: PERSONAL.** Accepts the 12-testers ×
     14-continuous-days closed-testing gate before production (D-U-N-S lead time
     avoided). Founder responsibility action: **start recruiting the 12 testers
     immediately** — the clock starts on the 12th opt-in, and this runs in
     parallel with the 16–20 total beta testers already needed before M9.
114. **Capacity assumption CONFIRMED: 20 combined founder-hours/week stands.**
     No change to the planning-assumption dates (beta ~mid-June 2027, per
     decision 110's capacity table). December 2026 is reconfirmed unreachable
     at this or any faster modeled rate without cutting scope; founders proceed
     with eyes open (reaffirms decisions 90–99, 101–111 — not re-litigated).
115. **Accessibility commitment CONFIRMED at the baseline assumption stated in
     `project.md` §3**: contrast, tap target size, dynamic type, screen-reader
     labels on primary flows. **No formal WCAG AA conformance commitment** —
     not scoped or budgeted into M1 or QA.
116. **Repeat-behavior success metric DECIDED: relative, not absolute** —
     "repeat-join rate trends upward month over month," per the research
     recommendation (entry 53). No external benchmark number adopted.
117. All five open items from `milestones.md` "Open items for Gate 1" resolved
     (112–116 above). Plan updated to v0.6.
118. **GATE 1 APPROVED — plan v0.6, 21.5 FTE-weeks, 2026-08-28.** Founder gave
     explicit final approval of the complete plan (stack, M0–M9 milestone
     breakdown, out-of-scope list, founder responsibilities/costs — pricing
     still to be verified before any client-facing use — and decisions
     112–116) to proceed to `/spark-dev`, Milestone 0.

---

## 2026-08-28 — `/spark-dev` Milestone 0 — technical spec (spark-architect)

119. **Repo layout locked: npm-workspaces monorepo**, TypeScript everywhere —
     `apps/mobile` (Expo/RN, Jest via jest-expo), `apps/web` (Astro static
     output → Cloudflare Pages, Vitest), `supabase/` (migrations + a
     project-level `migrations_down/` convention Supabase's CLI doesn't
     natively provide, seed, Deno Edge Functions under `supabase/functions`,
     tested with `deno test`), `ci/scripts` (Node/TS via tsx, Vitest). No
     Turborepo/pnpm — one less tool for a two-founder AI-assisted team to
     debug. Full tree in the M0 technical spec (superseded nowhere; this
     entry is the durable record).
120. **Migration rollback convention, binding from M0 onward, not just this
     milestone:** every `supabase/migrations/<ts>_<name>.sql` ships a paired
     `supabase/migrations_down/<ts>_<name>.down.sql` that exactly reverses
     it. `migrations_down/` is never read by `supabase migration up` — it's
     read only by this project's own CI tooling
     (`check-migration-pairs.ts` blocks a PR missing a pair;
     `migration-reversibility-test.ts` actually executes the newest down
     file against a freshly-migrated local Postgres, diffs the schema, then
     re-applies the up file to prove idempotent re-appliability). This is
     the mechanical answer to "databases don't roll back via git."
121. **M0's three migrations decided:** (1) `enable_extensions` —
     `pgcrypto`, trivially reversible; (2) `smoke_test_fixtures` — a
     permanent (not torn down after M0) canary table/view: RLS enabled with
     deliberately zero policies (proves SEC-1's deny-by-default is
     Postgres's actual behavior, not an assumption) plus a
     `security_invoker`-flagged view over it (proves SEC-4's flag actually
     delegates RLS rather than just being set). Re-run by the SEC-2
     negative-auth suite on every future PR as a regression canary, not a
     one-time M0 artifact; (3) `scheduled_jobs` — `pg_cron` + `pg_net` +
     a service-role-only `job_runs` ledger table backing INF-4, doubling as
     the SEC-2 matrix's "admin-only table" pattern until M7's real
     `is_admin` claim exists. Rollback note logged directly in the down
     migration's own comment: dropping `pg_cron` there is safe only until
     M8's RECUR-2 schedules real production recurrence jobs on it — a
     future rollback of that migration needs its own review at that point,
     flagged now so it isn't rediscovered the hard way later.
122. **Four Edge Functions decided for M0, all Deno, all narrowly scoped —
     no product endpoints invented:** `scheduled-smoke-ok` /
     `scheduled-smoke-fail` (INF-4 proof pair, shared-secret auth, not user
     JWT — cron-invoked only), `mint-storage-url` (INF-9's R2 gatekeeper —
     the one imperative, non-RLS access-control code path
     `security.md` §5 already accepts as a known/accepted design; M0's
     exact rule: `general` bucket → any authenticated caller may mint a URL
     scoped to their own `general/{uid}/...` prefix; `receipts` and
     `verification` → unconditional 403 for everyone until a later
     milestone adds real ownership/admin logic — no direct/public bucket
     read is ever permitted), `send-test-push` (INF-7's physical-device
     harness, shared-secret auth, a build-time diagnostic tool, not a
     product endpoint, deleted or left dormant after later milestones add
     real push triggers).
123. **Canonical PostHog analytics event schema locked now** (INF-6), in
     `apps/mobile/src/lib/analytics/events.ts`, as the single legal event
     vocabulary every later milestone must use:
     `user_signed_up` / `event_confirmed` / `event_confirmed_repeat` /
     `event_no_show` / `event_cancelled_exempt` / `event_cancelled_non_exempt`.
     The repeat-join funnel (the project's core success metric — decisions
     23, 53, 116) is defined as the two PostHog-native events
     `event_confirmed` → `event_confirmed_repeat`, deliberately avoiding
     PostHog's less-robust property-based step deduping. The no-show/
     cancellation events are locked now because plan.md §3.10 names them as
     "instrument from Milestone 0" watch-list tells for K1 and R19, even
     though no milestone before M2/M3/M6 has code that fires them yet. **M0
     does not wire any real emission call site** — it proves the pipeline
     via a fixture seeder pushing synthetic events through PostHog's HTTP
     Capture API into a dedicated `ci-test`-tagged environment, checked
     against a saved Insights funnel — because this schema can't be
     backfilled if wrong and there's no real feature yet to test it against
     honestly.
124. **INF-4's real T+2min pg_cron proof is explicitly NOT a permanent CI
     gate — logged so it isn't mistaken for one later.** pg_cron has no
     one-shot scheduling primitive, so faithfully proving real wall-clock
     firing can't be done in a fresh CI container without a genuine
     multi-minute wait every PR. Resolution: the function's own
     success/failure-recording logic (job_runs row correctness for both
     the -ok and -fail paths) is covered by an automated integration test
     that invokes the Edge Functions directly, every PR; the actual
     pg_cron→T+2min wall-clock firing is a one-time manual proof against
     the dev cloud Supabase project, done once during M0 build and logged
     as evidence, not re-run automatically.
125. **Environment recipe selected for Milestone 0/R — no single
     spark-environment-protocol recipe matches this stack exactly.**
     Adapted composite, not a forced fit: `mobile-expo`'s client-tier
     progression taken as-is; the Supabase-specific dev/stage/prod project
     separation pattern named under `web-vercel-supabase` adopted on its
     own merits for the backend slice (Vercel itself doesn't apply here —
     Cloudflare Pages does); the web surface's dev/stage/prod handling
     applied straight from the protocol's generic principles, since no
     named recipe covers a static-site/Pages target. Full recipe written to
     `.spark/environment.md`. Flagged there as a candidate for a future
     named `mobile-expo-supabase-cloudflare` recipe if this exact composite
     recurs on another SPARK project. Key decisions inside it worth
     surfacing here: one PostHog project and one Sentry project total
     (environment-tagged, not three separate free-tier accounts, to avoid
     fragmenting INF-6's funnel fixture data); R2 uses environment-prefixed
     paths within the same three buckets rather than nine buckets (access
     control lives in `mint-storage-url`, not bucket ACLs, so fewer buckets
     costs nothing security-wise); OTA (`eas update`) vs. full native build
     promotion rule decided now, before any code exists, specifically so it
     isn't improvised ad hoc under deadline pressure later; Supabase Pro
     Branching (per-PR ephemeral DB) noted as available but explicitly not
     required at M0, to protect the $40 billing-alert headroom.
126. **Full negative-authorization matrix mechanism decided (SEC-2), binding
     for every milestone from here on, not just M0:**
     `ci/scripts/rls-negative-auth/matrix.ts` is a data-driven array — one
     row per table/view (`target`, `ownerColumn | null`, `publicRead`,
     `adminOnly`). The runner seeds two throwaway users via the
     service-role client, signs in as each for real access tokens, builds
     anon/user-A/user-B Supabase JS clients, and asserts anon gets zero
     rows unless `publicRead`, user B gets zero rows/no effect against user
     A's rows, and `adminOnly` targets reject both. **Every milestone from
     M1 onward is required to add its new tables to this same matrix
     file** — this is the concrete mechanical structure that makes SEC-5's
     downgrade to optional (decision 112) safe rather than a quiet
     weakening.
127. Full spec — repo tree, all three migrations' up/down SQL, all four Edge
     Function contracts, the CI mechanical-check exit-code contracts, and
     the AC-by-AC test-strategy table — held by the orchestrator and handed
     directly to `spark-developer` for Phase 3 build; not fully duplicated
     here to avoid drift between two copies. This entry is the durable
     summary; the spec itself is ephemeral orchestration state.

---

## 2026-08-28 — `/spark-dev` Milestone 0 — build complete, one founder decision surfaced pre-QA

128. **M0 built and verified against a real local Supabase Docker stack**
     (not just written): 3 migrations with tested rollbacks, 4 Deno Edge
     Functions (11/11 tests), 8 CI mechanical-check scripts (SEC-1…4, INF-2,
     INF-9, INF-6), Expo mobile scaffold (12/12 Jest tests incl. Sentry PII
     scrubber), Astro web scaffold, full GitHub Actions pipeline +
     Dependabot. Real pg_cron T+2min firing proven against the local stack
     (substituted for the spec's "dev cloud project" step — no cloud
     Supabase project exists yet). 11 commits on
     `milestone/00-scaffold-security-baseline`. Full report in
     `progress.md`'s Phase 3 checkpoint entry.
129. **Astro/Node version conflict found and surfaced, not silently
     resolved:** `astro@5.18.2` (used for `apps/web`) has real HIGH/CRITICAL
     npm-audit advisories fixed only in `astro@7.2.9`, which requires
     Node ≥22; M0's spec pinned Node 20 LTS repo-wide. The Developer left
     CI's `npm audit --audit-level=high` gate unweakened rather than
     suppressing it — meaning CI is genuinely red on this branch pending a
     human call. Full exploitability analysis (why MEDIUM-in-practice today,
     given `apps/web` is a single static route using none of the affected
     directives) logged in `security.md` §7.
130. **Founder decision: bump `apps/web` to Node 22**, keeping
     `apps/mobile` and `ci/scripts` on Node 20 LTS (mixed Node versions
     across workspaces, accepted as minor added CI/tooling complexity in
     exchange for clearing the vulnerable Astro major cleanly, rather than
     accepting the documented risk or weakening the audit gate). Routed
     back to `spark-developer` to implement (Astro upgrade to 7.2.9, `.nvmrc`
     handling for the web workspace, CI workflow Node-version-per-job
     update) before QA runs, so QA doesn't burn a cycle on a
     human-decision item rather than a code bug.
131. **QA (Phase 4) passed cleanly** — every runnable check green, exact
     counts as expected, credential-gated items honestly self-skipped.
     Full report in `progress.md`.
132. **Review Gate (Phase 5) — NO-GO, remediation cycle 1 of 3.** QA
     evidence integrity confirmed accurate on independent re-run; no scope
     drift. NO-GO from real code defects the QA suite doesn't cover — most
     seriously a live-proven path-traversal bypass in `mint-storage-url`
     (any authenticated user can mint read/write URLs into other users'
     files and into the `receipts`/`verification` buckets meant to be
     unconditionally denied at M0) and a negative-authorization suite that
     only tests reads, never writes. Full 11-finding list in `progress.md`'s
     Phase 5 checkpoint entry. Findings 1–8 routed to `spark-developer` for
     remediation; 9–11 recommended fixed in the same pass since M1's schema
     will trip 9/10 (migration-reversibility blind spots) otherwise.
133. **Remediation cycle 1 complete — all 11 findings fixed** (required
     1–8 and recommended 9–11), each verified against the real local
     Supabase stack, not just typechecked. Finding 1's exact live
     traversal reproduction was turned into regression tests; finding 2's
     new write-denial checks were sanity-checked by temporarily adding
     real permissive policies and confirming detection before reverting.
     11 commits. Full writeup in `progress.md`'s checkpoint log. Proceeding
     to QA re-verification, then Review Gate cycle 2 of 3.
134. **QA re-verification: 10/11 findings solid, finding 2 partially
     fixed with a real remaining gap, proven live.** UPDATE/DELETE
     write-denial testing is correct (independent service-role re-read).
     INSERT is not: `attemptInsert()` chains `.select("id").single()` onto
     the mutating call, and Postgres RLS makes an `INSERT ... RETURNING`
     fail with the *same* error when the SELECT half lacks a policy as
     when the INSERT itself is genuinely denied — true for all 3 M0 matrix
     rows (zero SELECT policies each). QA proved it: planted a permissive
     INSERT policy on `smoke_test`, suite still reported PASS; a raw
     client sending the identical payload without `.select()` got `201`
     and the row persisted (service-role-confirmed), reverted cleanly.
     Binding for every table added from M1 onward per decision 126, so
     routed straight back to `spark-developer` rather than waiting for
     Review Gate to catch it — findings 1, 3–11 confirmed solid and not
     re-litigated.
135. **Finding 2 follow-up fixed.** `attemptInsert()` now mirrors
     `attemptUpdate`/`attemptDelete`'s pattern: fires the mutation bare (no
     `.select()` chained, its own response is never the verdict), tags the
     payload with a per-identity probe value, verifies via an independent
     service-role read. Developer reproduced QA's exact live-exploit steps
     against the fix (planted permissive INSERT policy → suite now fails
     loudly for both identities on both affected tables → reverted → clean)
     before reporting done. 2 commits. Proceeding to final QA
     re-verification, then Review Gate cycle 2 of 3.
136. **QA closed finding 2 with its own independent live reproduction**
     (not just re-reading the diff): replanted the identical permissive
     INSERT policy, confirmed the suite now fails loudly for both
     identities on both affected tables, separately confirmed the fix
     detects the actual real-world attack shape (bare insert, no
     `.select()` chained — the same vulnerability shape as the original
     finding) rather than a coincidentally-different behavior, reverted,
     confirmed clean. Full regression sweep: all counts unchanged from the
     prior pass (16/16 mobile, 2/2 web, 29/29 ci/scripts, 19/19 Deno, npm
     audit clean both Node versions). No scope creep — `git log` confirms
     only the two described commits. **All 11 remediation-cycle-1 findings
     now genuinely fixed and genuinely tested. Entering Review Gate cycle
     2 of 3.**
137. **Review Gate cycle 2 — GO.** Both HIGH findings independently
     re-verified as genuinely resolved: finding 1 (path traversal) survived
     17 exploit variants including 6 new encoding cases with zero escapes;
     finding 2 (write-denial) was mutation-tested — 8 real permission
     grants planted directly into the live schema, 6/8 caught by the
     suite, the 2 misses proven to be equivalent mutants (Postgres denies
     UPDATE/DELETE with no SELECT policy regardless, so nothing was
     actually being granted). INF-4's cron runbook was executed end-to-end
     against real wall-clock firing. Findings 3–11 each independently
     re-verified. Zero unresolved Critical/High findings; **zero scope
     creep** (exactly 4 new files, each traceable to a specific finding).
     Full evidence in `progress.md`'s Phase 5 checkpoint.
138. **Four new non-blocking observations from cycle 2, not routed back
     for a 3rd remediation cycle per the Review Gate's own recommendation
     — logged as M1-kickoff follow-ups instead:**
     [MEDIUM] the negative-auth matrix's `ownerWritable` INSERT check
     conflates "owns the seeded row" with "owns the row being inserted,"
     which will false-fail on correct M1 owner-scoped policies (proven
     with a textbook M1-shaped policy set) — predictable fix is an M1
     developer flipping `ownerWritable` back to `false` under CI pressure,
     silently disabling the assertion decision 126 requires; also, no
     identity currently attempts inserting a row forging another user's
     ownership, the actually-important INSERT negative case, moot at M0's
     zero-policy tables but real from M1.
     [MEDIUM] new Edge Function test files must be hand-enumerated as
     individual steps in `ci.yml`, so `timingSafeEqual.test.ts` (7 tests)
     currently runs locally but never in the blocking pipeline — same
     "silently doesn't run" class as cycle-1 finding 3, one layer up; fix
     is switching to a directory-level `deno test tests/`.
     Both logged in `security.md` §7. Two LOW observations (SEC-3 misses a
     key pasted into a comment — satisfies the literal bundle-only AC;
     `redactDeep` flattens non-plain values in Sentry contexts, to check
     during the already-owed manual dashboard verification) logged and
     carried, no fix required now.
139. **Milestone 0 build complete. GO. Entering Phase 6 (close-out).**
     29 commits on `milestone/00-scaffold-security-baseline`. Two
     remediation cycles (of the allowed 3) consumed on Review Gate findings
     plus one QA-caught follow-up within cycle 1's remediation — both
     resolved with independent, adversarial verification at every step,
     not just diff review. `.spark/milestones.md` M0 status set to
     `awaiting-acceptance`.
