# SponTRIP — Milestones

**Version:** v0.4 — second post-Gate-1 scope addition (recurring events, Reason Rate), 2026-08-13
**Status:** DRAFT — not approved. Gate 1 pending, now covering twice-revised scope.
**Scope:** closed beta (decision 76). "December" is a name now, not a date — see
below. Not full Phase 1.

Feature IDs are defined canonically in `.spark/plan.md` §4.1. Risk IDs (K1–K5,
R1–R30) are defined in `.spark/plan.md` §3. **This file adds no feature not
specified there** — the previous version referenced 40+ undefined IDs.

---

## Capacity model — read this before any date

**An FTE-week is 40 hours of work, not one calendar week.** AI-assisted development
compresses typing, not decision-making, testing, credential plumbing, or debugging.

Founder capacity varies week to week (decision 71). Planning assumption: **20
combined productive hours/week** (decision 79).

**Updated 2026-08-13, second time** — total effort is now **21.5 FTE-weeks**, not
15.0, after two post-Gate-1 scope additions: poll/badges/check-in template
(decision 98, +4.5) then recurring events/Reason Rate (decision 109, +2.0).

| Combined capacity | 21.5 FTE-weeks becomes | Beta lands |
| --- | --- | --- |
| 30 hrs/week | 29 calendar weeks | early March 2027 |
| 25 hrs/week | 34 calendar weeks | early-mid April 2027 |
| **20 hrs/week (assumption)** | **43 calendar weeks** | **mid-June 2027** |
| 15 hrs/week | 57 calendar weeks | mid-September 2027 |

**December is no longer reachable at any modeled capacity, and the gap has
widened with the second addition.** Even the fastest row lands three months past
it. The original reason for the December target — landing inside Philippine office
Christmas-party season for the launch cohort — no longer holds at any row above.
This was stated to the founder directly, twice (decisions 99 and 110); the added
scope was chosen over the date both times. Track actual hours against the FTE
estimate from M0 onward — see the calendar-week-8 checkpoint below.

### External calendar time — not build time, must run in parallel from week 1

- **Google Play: 12 testers opted in for 14 continuous days.** Mandatory for a new
  *personal* developer account before production access. The clock starts when the
  12th tester opts in. Organization accounts are exempt but require a D-U-N-S
  number with its own lead time. **Decide account type in week 1.**
- **Apple Developer Program enrolment** — needed at **M0**, not before beta.
- **Apple review round-trips** — at public launch, not for TestFlight beta.

---

## M0 — Scaffold & security baseline · 2.0 FTE-wk

**Contents:** INF-1…10, SEC-1…4.

**Acceptance criteria**
- CI blocks a deliberately failing PR
- A schema change applies via migration on a clean DB and is reversible
- A deployed web route is reachable over HTTPS at the project domain (INF-3)
- A scheduled job runs at T+2min and records its run; **a deliberately failing job
  surfaces an error rather than failing silently** (INF-4)
- Sentry receives a test event with email and phone **redacted, not plaintext**
- **The repeat-join funnel renders correctly in PostHog from seeded fixture data** —
  not merely "an event was received" (INF-6). A wrong schema here cannot be
  backfilled and the entire success metric depends on it.
- Push delivers to a physical device within 10s; password-reset email within 2 min
- Three R2 locations exist and each restricted location **rejects a denied-read
  test** (INF-9) — verified, not inspected
- Billing alert configured at **$40** (INF-10)
- A new table with no explicit policy is unreadable and unwritable by `anon` and by
  an authenticated non-owner (SEC-1)
- **The negative-authorization suite runs in CI and blocks merge** (SEC-2)
- CI fails if a `service_role` key appears in the client bundle (SEC-3)
- CI fails if any view lacks `security_invoker` (SEC-4)

**Founder tasks in parallel:** Apple Developer enrolment, Google Play account type
decision + enrolment, domain purchase, Google Cloud OAuth app.

**Retires:** R9 (alert), R11, R12 (provisioning), R23 (mechanical half), partial K5

> **Note:** M0 is the milestone where AI assistance helps least. Most of it is
> console work behind 2FA — Apple enrolment, APNs keys, FCM, EAS credentials,
> Cloudflare buckets. First-timers routinely lose days here. Budget accordingly.

---

## M1 — App shell, IA, design system, accounts · 2.5 FTE-wk

> Previously owned by **no milestone at all** (validator issue 6).

**Contents:** SHELL-1…4, HOME-1 (shell), PROF-1 (own profile only), SET-1,
NOTIF-1 (shell), ONB-1, AUTH-1…7.

> **Scoping correction 2026-08-13.** An earlier version gave M1 acceptance criteria
> that depended on M2, M3 and M6 outputs — HOME-1 listing Circle events (Circles are
> M2, events M3, Drawing Rate M6), SHELL-1 covering "every primary surface" when most
> don't exist yet. Those criteria could only have been met by waiving them, which
> sets exactly the precedent that later makes SEC-5 waivable. **M1's criteria now
> cover only what exists at M1**, and completeness is enforced by the standing
> definition of done below.

**Acceptance criteria**
- Every surface **that exists at M1** is reachable by tab and by deep link; a
  cold-start deep link lands on the correct screen (SHELL-1)
- Design tokens, typography, spacing and component primitives exist in code, with
  Airbnb-bones and Duolingo-soul variants documented and each applied to at least
  one screen (SHELL-2)
- Home renders its **empty state** ("no Circles yet") correctly — the only state it
  can have at M1
- Own profile renders; another member's profile is out of scope until M2
- Dark mode persists across restart across all M1 screens (SHELL-4)
- Onboarding completes and lands the user on Home; **it explains what Drawing Rate
  is and how it is calculated** (ONB-1)
- Under-18 birthdate blocks account creation; the affirmation record lands in an
  immutable admin-queryable table (AUTH-4)
- **Account deletion works via both the in-app flow and the web path**, verified by
  querying for residual rows (AUTH-5/6)

**Demo:** sign up → age gate → onboarding → land on Home (empty state) → view own
profile → delete account via both paths.

**Retires:** R16, decision 50, validator issue 6

---

## 📌 STANDING DEFINITION OF DONE — applies to every milestone

Every new user-facing surface, in the milestone that introduces it, ships with:

1. Designed **empty, loading and error** states
2. **Dark mode** applied, with no mixed-theme screen
3. **Deep-link registration** and a working cold-start route
4. Design-system components — no one-off styling
5. **Negative-authorization tests** (SEC-2) for any new table it reads or writes
6. For anything touching auth, RLS or admin surfaces: an explicit written
   **"what does this permit that it didn't before?"** (R23)

**M8 includes a UI-parity sweep** verifying 1–4 across every shipped surface. This
turns a criterion that could not be met once into one that is enforced continuously.

---

## M2 — Circles + RLS review 1 (optional) · 1.0 FTE-wk

**Contents:** CIRC-1…3, SEC-5 (first review — optional, decision 112).

**Acceptance criteria**
- Creating a Circle auto-creates its group chat with the creator as Leader, zero
  extra taps
- A valid invite link joins Circle and chat in one flow; an expired or revoked link
  fails cleanly
- Delegate assignment authorizes only that delegate's device, for that event only
- SEC-2's automated negative-authorization CI suite covers Circle/chat RLS
  policies (mandatory, unchanged)

> **Decision 112 (2026-08-28):** SEC-5 downgraded from hard gate to
> recommendation. **M2 no longer waits on a human RLS review.** Founders may
> self-review RLS policies after this milestone at no cost; it is optional.
> The mandatory control against K5/R23 is SEC-2 (CI suite, above).

**Retires:** K5 (first pass, via SEC-2)

---

## M3 — Private events, chat, notifications, trust & safety · 2.5 FTE-wk

**Contents:** EVT-1, EVT-2, EVT-4, EVT-5, CHAT-1…3, TS-1…3, SEC-6.

> EVT-3 (finalize) belongs to **M4**, not here — it generates the check-in QR and
> is meaningless before QR exists. Previously ambiguous across two milestones.

**Acceptance criteria**
- Events appear in the Circle list immediately; confirm/decline updates instantly
- **Cancellation reason is persisted with an `exempt` boolean.** Scoring behaviour
  is asserted in **M6**, not here — at M3 nothing consumes the flag, so a scoring
  AC would pass while the feature is broken.
- Chat and DM deliver within 2s; system messages are non-editable and non-deletable
- Reports reach the admin queue with reporter, reported party and reason
- Blocked users' content disappears and DMs are refused
- **SEC-6 load test:** ≥300 concurrent connections **at a specified message rate**,
  p95 delivery <2s, **zero dropped messages**, with observed peak-connection and
  cost figures recorded as the dashboard baseline

**⏱ CHECKPOINT — CALENDAR WEEK 8, not "end of M3."** At the 20 hrs/week assumption,
M0–M3 (8.0 FTE-wk = 320 hours) completes around calendar week 16 — which *is*
December. A milestone-anchored checkpoint would fire after the date it exists to
protect. **At calendar week 8, compare hours actually burned against 160.** Under by
20% or more and December is gone — say so then, while it can still change something.

**Retires:** R9 (load-test half)

---

## M4 — QR check-in · 1.0 FTE-wk

> **Re-estimated from 2 weeks after validation.** The original spec asked the wrong
> question (see plan.md R7). The offline device does not validate — it records
> `(code, timestamp)` and the server validates at sync.

**Contents:** EVT-3, QR-1…5.

**Acceptance criteria**
- Finalizing generates the QR; **before finalize, no attendance data is collected**
- A screenshot older than one rotation interval fails server validation
- A scan made in airplane mode is queued and auto-submitted on reconnect **without
  re-scanning**; the server validates against the **recorded** timestamp
- **A scan whose wall-clock is inconsistent with its monotonic clock reading is
  rejected or flagged** (QR-4). If residual risk remains, it is written into
  `decisions.md` — not silently accepted.
- **The Leader or delegate displaying the QR can record their own attendance
  without scanning their own device** (QR-5)

**Demo:** finalize → Leader displays QR → 3 members scan, one in airplane mode →
sync on reconnect → timestamps visible in a debug view.

**Retires:** R7, R8, R26

---

## M5 — Attendance & K2 trust mitigations · 1.5 FTE-wk

**Contents:** ATT-1…8.

**Acceptance criteria**
- Leader toggles each member present/absent in ≤2 taps from a scan-derived list
- **Every participant can view scan-derived beside final, with discrepancies
  visibly flagged — never silent** (ATT-2)
- Every edit logs old value, new value, editor, timestamp in a never-deleted table;
  **a Leader's edit to their own attendance is logged distinctly and surfaced to
  members** (ATT-3)
- **Flagging produces a ticket containing event id, member id, disputed value and
  the full edit history** — correctness asserted, not just latency (ATT-4)
- Attendance is **provisional until T+72h**; a late scan inside the window
  auto-corrects absent→present, notifies both parties and logs it; a late scan
  after the window opens an admin item **rather than mutating a published score**
  (ATT-5)
- The Leader reminder fires at the **close of the provisional window**, once, not
  repeated (ATT-6)
- **At T+7d an unconfirmed event auto-resolves from scans alone; zero scans →
  did-not-push-through, with the Leader notified before it lands** (ATT-8)

**Demo:** mock event → scan → Leader confirms with one deliberate edit → affected
member sees the discrepancy flagged → flags it → ticket appears with full history.

**Retires: K2, R4**

---

## M6 — Drawing Rate + recap card · 1.5 FTE-wk

**Contents:** DR-1…8, RECAP-1. Scoring follows `plan.md` §4.5 exactly.

**Acceptance criteria (fixture-based)**
- 10 confirmed over 6 months with 3 no-shows → **30%**; an 8-month-old no-show is
  excluded from **both** numerator and denominator
- Streak increments on consecutive attendance, resets on confirmed no-show,
  **unchanged by walk-ins**
- 5 finalized with 1 weather-cancel and 1 backed-out-cancel → exactly **1
  non-exempt failure of 5** (this is where M3's `exempt` flag is finally asserted)
- **An event with at least one check-in is treated as held even if later
  cancelled** — attendees credited, confirmed absentees penalised (DR-4)
- A confirmed member of a cancelled-with-no-check-ins event shows **no change**
- Below 3 resolved events: "no track record yet"
- **A user who attends 10 events without ever confirming still reads "no track
  record yet"** — the walk-in loophole is closed
- Default view shows label + mascot with **no visible percentage**; tap reveals it;
  streak visible without tapping
- **The share card carries the positive stat**, not the flake percentage (DR-7)
- **A Drawing Rate request from a non-co-member returns not-found** (DR-8),
  asserted in the SEC-2 suite
- Recap card exports to the native share sheet with no server round-trip

**Founder dependency:** mascot and brand assets must be delivered **before** this
milestone — DR-6/DR-7 cannot ship without them. On the critical path.

**Retires:** makes K1 observable via the M0 confirm-rate funnel

---

## M7 — Magic Bunot, minimal admin slice + RLS review 2 (optional) · 1.5 FTE-wk

**Contents:** MB-1…3, ADM-1…5, SEC-5 (second review — optional, decision 112).

**Acceptance criteria**
- Draw executes **server-side (CSPRNG in an Edge Function)**; winner and pool post
  as an **immutable system message** within 3 seconds, identical for all members
- A completed Bunot exposes no redraw; the create form has **no monetary or
  prize-value field anywhere**
- **The admin role is server-side only and cannot be granted or self-assigned from
  any client path** (ADM-1), asserted in the SEC-2 suite
- Report queue resolution logs deciding admin and timestamp
- Attendance-flag queue shows the disputed record, full Leader edit history, and an
  override action with its own logged trail
- A suspended user's next login is blocked
- **Watch-list dashboard shows, refreshed at least daily and without a manual DB
  query:** confirm-rate trend (K1), weather-exemption rate per Circle (R19/K2), and
  Supabase peak concurrent connections (R9)
- SEC-2's CI suite extended to cover the attendance audit log, flag queue and
  admin surface — the tables that did not exist at review 1 (mandatory,
  unchanged). A founder self-review of these tables' RLS policies remains
  optional, at no cost (decision 112).

**Retires:** R28 (partial — full console is a public-launch item), K5 (second pass)

---

## M8 — Poll, badge system, check-in template, recurring events · 6.5 FTE-wk

> **Added 2026-08-13, post-Gate-1, in two rounds** (decisions 90–110). Round 1
> recovers two features from the original ideation doc dropped during Phase 4
> feature design (poll, §6.3; check-in photo template, §9.2) and moves the badge
> system from Phase 3 into the beta (supersedes decision 60). Round 2 adds
> recurring events and Reason Rate, built deliberately as a thin convenience layer
> reusing the existing event/QR/attendance/Drawing-Rate pipeline rather than a new
> series-editing or scoring system — that's what kept it to ~2.0 FTE-weeks instead
> of much more. Runs **after M6 and M7** — no-show badges, Frida, and the
> zero-response-occurrence rule all depend on Drawing Rate and Circle data that
> don't exist before then.

**Contents:** CIRC-4, POLL-1…3, BADGE-1…4, CHECKIN-1, RECUR-1…5, REASON-1.

**Acceptance criteria**
- A poll with 3+ options collects exactly one vote per member; a repeat vote
  replaces rather than adds; the tally updates live for all members
- Closing a poll **pre-fills a new event's title and description** with the
  winning option's text, editable by the Leader before finalizing; a tie is
  resolved by the poll's creator picking manually
- A Circle can optionally be tagged with a category from the fixed event-category
  list at creation (CIRC-4)
- **All 26 badges** from `SponTRIP_Badge_System.md`'s three defined collections
  (Onboarding, Circle Achievement, No-Show/Drawing) unlock correctly against
  seeded fixture data — at least one verified per collection
- **A no-show badge does not unlock for a user below Drawing Rate's 3-event
  minimum display threshold**, verified by fixture — a badge can never surface a
  worse signal earlier than the score itself would (decision 92a)
- Frida unlocks when a Circle's category isn't already used by another Circle its
  creator belongs to
- **No-show/Drawing badges are visible only to members of a shared Circle**;
  Onboarding and Circle Achievement badges are visible on the global profile —
  both asserted in the SEC-2 negative-authorization suite alongside DR-8
  (decision 92b, 93)
- Badge collection page renders locked badges with a plain-language unlock hint
  and unlocked badges with their art, organized by collection
- A user pins exactly 2–3 badges as "featured" on their profile; a 4th pin attempt
  is rejected
- Check-in photo template composes an image from a picked photo and a selected
  template **entirely on-device** — verified by confirming **no network request
  occurs during composition** — and shares via the native share sheet. The photo
  is never uploaded or stored (decision 96; this is what keeps CHECKIN-1 out of the
  moderation/UGC surface RECAP-2 was deferred specifically to avoid)
- A recurring series can be set to Daily / Weekly (with one or more days of the
  week selected, e.g. Mon+Wed+Fri) / Bi-Weekly / Monthly / Bi-Monthly / Quarterly /
  Annually
- Once an occurrence resolves, the next one is auto-generated (via a scheduled job
  reusing INF-4), pre-filled from the previous occurrence, and members are notified
- Editing one occurrence — title, time, location, description — **never** changes
  any other occurrence, past or future; a "stop recurring" action ends the series
  without touching already-generated occurrences
- Declining any event, recurring or one-off, offers an **optional** free-text
  reason; leaving it blank is always allowed
- **A recurring occurrence that never gets finalized expires with zero group and
  zero individual Drawing Rate impact** — verified by fixture: an occurrence with
  no responses at all does not appear in any Drawing Rate calculation for any
  member or the group (decision 106)
- Profile shows a purely descriptive "most common reason" fact aggregated from
  declines with a reason filled in — **no number, no ranking, no score** — visible
  only to members of a shared Circle (decision 107)

**Founder dependency — critical path.** Artwork for all ~26 badges, plus the
check-in share templates, must be delivered **before** this milestone's UI work
begins. Same pattern as the mascot-before-M6 dependency. Recurring events and
Reason Rate need no new founder-supplied art.

**Retires:** R29 (badge boundary — the badge doc itself is the written limit;
anything beyond it needs a new `decisions.md` entry, same discipline decision 60
established for the original 6). Re-confirms decisions 36/42 apply identically to
recurring occurrences (silence stays risk-free everywhere, not just for one-off
events).

---

## M9 — Beta launch prep · 1.5 FTE-wk

**Contents:** store metadata, IARC questionnaire, EAS builds, TestFlight + Play
closed track, beta onboarding.

**Acceptance criteria**
- Both store listings configured **17+/equivalent**, reflecting UGC, real-world
  meetups and messaging
- Both account-deletion paths smoke-tested **on the production build**, not a dev
  client
- **Recruit 16–20 Play testers to reliably hold 12.** Testers must remain opted in
  for **14 continuous days** — the closing AC is "12 testers remained opted in for
  14 days," not "the clock started." One drop-out restarts nothing but breaks the
  count.
- Build installed and smoke-tested by the founders' own Circle **plus a second,
  independent office group** (R6) — recruit both cohorts together, since the Play
  testers and R6's independent group overlap
- **UI-parity sweep** across every shipped surface per the standing definition of
  done (empty/loading/error states, dark mode, deep links, design-system components)
- Device-parity check on at least one low-end Android handset

> **TestFlight correction.** "TestFlight is effectively immediate" holds only for
> **internal** testers (≤100 App Store Connect users). An office-colleague cohort is
> **external** TestFlight, which requires **Beta App Review** with a full review of
> the first build, including a privacy policy URL. **Budget a round-trip.**

> **Beta ≠ public launch.** Public store release is a separate later milestone and
> must account for Apple review round-trips, which for a social app with UGC,
> stranger meetups and a 17+ rating routinely take 2–3 attempts.

**Retires:** R6

---

## Summary

| # | Milestone | FTE-wk |
| --- | --- | --- |
| M0 | Scaffold & security baseline | 2.0 |
| M1 | App shell, IA, design system, accounts | 2.5 |
| M2 | Circles (+ optional RLS review 1) | 1.0 |
| M3 | Private events, chat, notifications, T&S | 2.5 |
| M4 | QR check-in | 1.0 |
| M5 | Attendance + K2 trust mitigations | 1.5 |
| M6 | Drawing Rate + recap card | 1.5 |
| M7 | Magic Bunot, admin slice (+ optional RLS review 2) | 1.5 |
| M8 | Poll, badges, check-in template, recurring events | 6.5 |
| M9 | Beta launch prep | 1.5 |
| | **Total** | **21.5** |

---

## After the beta — public launch (indicative, re-plan against beta data)

Onboarding interest capture · full admin console · broader email notifications ·
app colour personalization · public store submission with Apple review buffer ·
Kris Kringle variant (decision 77).

## Phase 2 — rides + diving (sketch, re-plan against beta data)

Hubs + KYC (**hard-gated on legal documents and the paid security audit**) ·
public events · Navigate feed + Discover · form builder (4 field types, written
boundary) · fees + segregated receipt storage · waitlist · **live location**
(deferred here from Phase 1, decision 74) · Drawing Rate visibility widens to
public (decision 34 takes effect) · bulk scanning.

## Phase 3 — later (sketch)

Album (video generation remains cut — R30, re-stated in its own acceptance
criteria) · ratings · organizer analytics. **Badges moved out of Phase 3 into the
beta (M8) — decision 91, supersedes decision 60.** Any badge beyond the 26 in
`SponTRIP_Badge_System.md` still requires its own new decision, so Phase 3 may add
more later, but the base set is no longer Phase 3 scope.
**Not scheduled:** automated moderation tooling (R20 remains a medium-term risk).

---

## Open items for Gate 1 — RESOLVED 2026-08-28 (decisions 112–116)

1. ~~RLS review budget and vendor~~ — **downgraded to optional recommendation,
   no longer gates M2 or M7.** Decision 112.
2. ~~Google Play account type~~ — **Personal.** 12-testers/14-day gate accepted;
   recruit immediately. Decision 113.
3. ~~Capacity assumption~~ — **confirmed at 20 combined hrs/week**, no date
   change. Decision 114.
6. ~~December no longer reachable~~ — **reconfirmed; founders proceed with eyes
   open** (reaffirms decisions 90–99, 101–111). Decision 114.
4. ~~Accessibility commitment level~~ — **confirmed at the stated baseline**, no
   formal WCAG AA. Decision 115.
5. ~~Repeat-behavior target~~ — **relative** ("trends upward month over month"),
   not absolute. Decision 116.

**GATE 1 APPROVED 2026-08-28 — decision 118.** Ready for `/spark-dev`.
