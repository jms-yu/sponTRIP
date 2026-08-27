# SponTRIP — Project Brief

**Status:** Phase 1-A intake COMPLETE — 2026-08-12
**Source material:** `SponTRIP-Ideation.md` (raw ideation, superseded where this
document contradicts it)
**Mode:** GREENFIELD

---

## 1. Identity

| Field       | Value                                                              |
| ----------- | ------------------------------------------------------------------ |
| Project     | SponTRIP                                                           |
| Client      | Internal product — Fonya Technology, 2-person founding team        |
| Industry    | Social / events / real-world community                             |
| Market      | Philippines (launch), no geographic restriction in the product     |

## 2. Problem & success

**Problem.** People and friend groups constantly *talk about* doing things
together — hikes, rides, dives, coffee, sports, weekend trips — and the plans
die. The Filipino-slang framing the founders use is **"puro plano lang."**
Separately, people who want to join hobby activities with strangers have no
trustworthy place to find them.

**What exists today.** Facebook Events plus Messenger/Viber group chats. It is
free, everyone is already on it, and it is the real competitor. Any feature that
merely matches it is not a reason to switch. This is the sharpest strategic
constraint on the whole product.

**Success / definition of validated — DECIDED: repeat behavior.**
Not signups. The metric is whether a user who joins one event joins another.
Consequence: product analytics must be instrumented from Milestone 0, not added
later. The specific target number is to be set with the founders before launch;
the *shape* of the metric is fixed.

Supporting metric (secondary): events that actually reach the Painting phase with
real check-ins — the direct measurement of the "plans stop dying" thesis.

## 3. Users

**Roles.** Sponter (joiner) and Sparker (organizer). **Design decision:** these
are capabilities, not separate account types. Every account is a user; verification
unlocks public hosting. This simplifies the data model and lets organizer supply
grow out of the existing user base rather than from cold outreach.

Additional role: **Circle Leader** (creator of a friend group) and **Hub Master /
Hub Admin** (organization roles). Plus **SponTRIP internal admin** (the founders).

**Age — DECIDED: 18+ only at launch.** Under-18 support explicitly deferred.
Requires an age gate at signup and a matching app store age rating. Rationale:
avoids RA 10173 parental-consent machinery and sharply lowers liability for a
product that puts strangers together in physical places. Accepted cost: excludes
16–17 year old college students, a real slice of the stated market.

**Tech literacy.** High. Young, mobile-native, Philippine smartphone users.
**Accessibility.** Not raised by the founders. Assumption to confirm: meet
baseline standards (contrast, tap target size, dynamic type, screen-reader labels
on primary flows) without a formal WCAG conformance commitment.

**Expected volume.** Pre-launch. Plan targets low thousands of users for the first
year; architecture must not foreclose growth beyond that.

## 4. Beachhead — DECIDED

Three communities the founders can personally reach:

1. **Motorcycle rides / touring**
2. **Diving**
3. **Office social groups / workplace barkada**

**Noted tradeoff (flagged, accepted by founders):** three verticals is not one
beachhead, and each needs different seed content and organizer recruiting.

**Mitigating structure — these map cleanly onto the chosen phase order:**

- **Office social groups → Phase 1.** Pure Circles + private events. Needs no
  public feed, no Hubs, no KYC, no verification. Usable on day one with zero
  supply-side cold start. This is the Phase 1 launch cohort.
- **Rides + diving → Phase 2.** Public events, verified Hubs, real organizers,
  registration fees. This is the Phase 2 launch cohort.

So the founders are not running three verticals simultaneously — they are running
one per phase. Recorded as the resolution to the focus concern.

**Diving-specific requirements surfaced:** divers hold certification levels (Open
Water, Advanced, etc.) that organizers must verify at registration. This is a
concrete, real justification for the dynamic form builder the founders insisted
on retaining. Diving also carries the highest safety stakes and the highest
registration fees of the three, which raises the consequence of the known
fake-receipt risk.

## 5. Scope posture — DECIDED: SEQUENCED, NOT CUT

All three product wedges remain in the vision. They ship in order, each phase
independently releasable.

| Phase | Contents                                                                                                          | Launch cohort   |
| ----- | ------------------------------------------------------------------------------------------------------------------ | --------------- |
| 1     | Circles, private events, **QR check-in**, Drawing Rate, Magic Bunot, core account/profile, chat, notifications      | Office groups   |
| 2     | Public events, Hubs, KYC/verification, form builder, registration + fees, waitlist, organizer-side check-in tooling | Rides + diving  |
| 3     | Album depth, badge system maturity, organizer analytics                                                            | All             |

**QR check-in is Phase 1, not Phase 2 — corrected 2026-08-12.** Drawing Rate has
no data source without it. Attendance cannot be derived from RSVPs, confirmations,
or chat activity; only a check-in event proves a plan actually happened. Check-in
is therefore the measurement instrument for the Phase 1 wedge and is load-bearing,
not a convenience feature. Phase 2 adds organizer-scale check-in tooling (bulk
scanning, attendee lists, no-show review) on top of the same ticket model.

### In scope (confirmed)

- Google Sign-In + email auth; **Sign in with Apple required on iOS** (App Store
  rule when any third-party social login is offered)
- Onboarding + interest/hobby selection driving recommendations
- Circles (friend groups) with auto-created group chat
- Hubs (organizations) with **manual** KYC review by the founders
- Private events (Circle-based) and public events (Hub-based)
- **Dynamic form builder** — retained at founder instruction, overriding the
  recommendation to defer. Justified by diving certification verification.
- Registration fees as an itemized list; **SponTRIP holds no money** — GCash/bank
  direct, receipt upload, organizer-verified
- Waitlist with confirmation windows and automatic slot promotion
- **QR check-in (Phase 1)** — opaque ticket ID, server-resolved status. Doubles as
  the Drawing Rate measurement instrument. See §14 for the full mechanic.
- **Offline check-in with deferred sync — HARD REQUIREMENT.** Motorcycle touring
  and diving, two of the three beachhead verticals, routinely happen where there
  is no mobile signal. Check-in that requires connectivity fails exactly where the
  beachhead users are. Scans must queue locally and sync when signal returns.
- Group chat + direct messaging
- Push + email notifications
- **Magic Bunot** (renamed from "raffle") — available to private events too, as a
  casual decision-maker ("who pays the bill"). Must be server-drawn and posted to
  group chat automatically so results are witnessed and trusted.
- **Live location sharing** — founder-redesigned. Toggle ON/OFF. ON → link
  recipient sees location. OFF → recipient sees event overview/timeline only.
  Link contains a temporary message thread, auto-deleted after the event.
  Recipients are anonymous, no account required.
- Drawing Rate (individual + group reliability scoring)
- Badges, ratings, evaluation forms
- Album (post-event scrapbook)
- **Internal admin console** — new scope. KYC approval queue with audit trail,
  user search and account actions, report/moderation queue, event takedown,
  operational dashboards. Required by the choice of manual KYC.
- Dark mode; app color personalization
- Age gate (18+)

### ⚠️ Post-Gate-1 addition, 2026-08-13 — poll, badges, check-in template

Three items added to the closed beta after Gate 1 was first presented, on founder
request. Full detail: `plan.md` §4.1, `decisions.md` 90–99.

- **Poll** — recovers §6.3 below ("Circle can create a poll first if undecided"),
  which was dropped during Phase 4 feature design. Vote, then the winning option
  auto-populates a new event.
- **Badge system** — moved from Phase 3 into the beta. All 26 badges from
  `SponTRIP_Badge_System.md` (Onboarding, Circle Achievement, No-Show/Drawing).
  That document is now the canonical, written badge list.
- **Check-in photo template** — recovers §9.2 below, scoped ephemeral: composed
  on-device, shared, never uploaded or stored.

**Cost of this addition:** beta effort rose from 15.0 to 19.5 FTE-weeks. December
is no longer reachable at any modeled capacity — the original reason for that
target (landing inside Philippine office Christmas-party season) no longer applies.
The founder was told this directly and chose the added scope over the date.

### ⚠️ Second post-Gate-1 addition, 2026-08-13 — recurring events, Reason Rate

Two more items added the same day, on further founder request. Full detail:
`plan.md` §4.1, `decisions.md` 101–110.

- **Recurring events** — Leader sets a repeat interval (Daily / Weekly with
  day-of-week selection / Bi-Weekly / Monthly / Bi-Monthly / Quarterly / Annually)
  at creation; each occurrence is generated as a fully normal event, editable
  independently. Built as a convenience layer over the existing event pipeline,
  not a new series-editing system — that choice is what kept the cost down.
- **Silence stays risk-free.** The founder's original workflow proposed
  penalizing non-response to a recurring invite on the individual's Drawing Rate;
  declined in favor of keeping decisions 36/42 consistent everywhere, avoiding the
  risk of a daily-cadence event bleeding someone's score.
- **Reason Rate** — a purely descriptive "most common reason" fact on profile, not
  a score. No peer judgment of reason credibility.

**Cost of this addition:** a further 2.0 FTE-weeks (M8: 4.5 → 6.5). **Total beta
effort: 15.0 → 19.5 → 21.5 FTE-weeks.** December's gap widens further — even the
fastest modeled capacity now lands in early March 2027. Stated to the founder
directly a second time; scope was chosen over the date again.

### Cut / deferred to future scope

- **Video generation for social sharing** — server-side rendering cost. Replaced
  by client-side generated image cards. Founders maintain a separate future-scope
  document (including monetization) not yet shared.
- **Facebook login** — Meta business verification friction.
- **Automated biometric face-match KYC vendor** — recurring cost, and biometric
  data sits in the higher-obligation tier of RA 10173.
- **In-app map** — see §8. Deep-link to Google Maps / Waze instead.
- **Under-18 support with restrictions.**
- **Payment gateway / take rate** (PayMongo, Xendit) — no revenue mechanism in MVP
  by deliberate choice.

### Changed from the ideation document

- **Swipe-to-register is dropped.** Swipe must navigate and express interest,
  never transact. Swipe direction corrected to the TikTok convention (swipe up =
  next). Final interaction model — feed-first with a Discover mode vs.
  swipe-to-save — to be settled in feature design.
- **QR open question resolved.** QR encodes an opaque ticket ID only; the server
  resolves status at scan time. Cancellation, waitlist promotion, kicks and
  no-shows are all handled by status changes. QR images are never revoked or
  reissued.
- **Sponter/Sparker are capabilities, not user types** (see §3).

## 6. Platform — DECIDED

**React Native + Expo.** iOS + Android from one codebase, plus a small web surface
for share links, event deep links, and the anonymous live-location link.
Native camera for QR scanning, real push notifications, OTA updates via EAS
without app-store review round-trips.

No hardware. No n8n automation identified yet (revisit for internal ops
automation — KYC queue alerts, moderation escalation).

## 7. Team — CRITICAL PLANNING CONSTRAINT

Two founders. **Neither hand-writes production code.** Both are tech-background
graduates, fluent in technical concepts and terminology, and build through the
SPARK Protocol (AI-assisted development). Founder A: ideation/product. Founder B:
business. They intend to hire career developers when the product scales.

**This is the single most important input to stack selection.** It does not reduce
throughput on greenfield feature work; it relocates the risk. The bottleneck moves
from writing code to everything downstream of code nobody on the team wrote:
production debugging, performance profiling, and — the material one here —
noticing a subtle authorization bug before an attacker does.

**Constraints this imposes on the plan (accepted):**

- **Managed auth, never hand-rolled.** No custom session logic, password handling,
  or bespoke token juggling.
- **Declarative access control.** Postgres Row-Level Security, so "who can see
  what" is reviewable as rules rather than as traced code paths.
- **Boring, conventional patterns throughout.** No exotic frameworks, no
  microservices, no clever architecture.
- **Managed services over self-hosted, always.** Every self-run server is an
  emergency neither founder can resolve at 2am.
- **Automated tests and the SPARK review gate are the code review.** Non-negotiable
  budget line.
- **One paid third-party security audit before KYC ships** with real government
  IDs. Treated as required, not optional.
- **Handoff-ready code is a design requirement**, not a nicety: conventional
  structure, full TypeScript typing, real tests, documented decisions — so a
  developer hired later is productive in week one instead of proposing a rewrite.

## 8. Budget & hosting — DECIDED

**Ceiling: under USD $50/month pre-revenue.** Excludes one-time costs (Apple
$99/yr, Google Play $25 one-time, domain).

**The two lines that will break this ceiling first** — both scale with user count
rather than usage, so they creep rather than spike:

1. **Photo storage and egress.** The app is photo-heavy by design: albums, event
   images, posters, payment receipts, ID documents. Object storage with **zero
   egress fees** is the decisive requirement here.
2. **Persistent chat connections.** Group chat plus DMs hold connections open per
   active user. Concurrent-connection limits, not message volume, are the wall.

The plan must state, per service, the usage threshold that forces the next tier
and what that tier costs — so cost is predicted rather than discovered.

**Maps — DECIDED: deep-link out, no in-app map.** Venue name + address + a button
opening Google Maps or Waze, which is what people use for directions anyway. Cost:
zero. Accepted loss: map-based browsing and visual "what's near me" discovery.
Revisit after revenue exists.

**Deploy target — DECIDED (decision 54, recorded in `config.md`):** Supabase
managed cloud (Postgres + Auth + Realtime + Edge Functions), Cloudflare R2 +
Images for object storage, **Cloudflare Pages for the web surface** (account
deletion page, privacy policy, and from Phase 2 the anonymous live-location link),
Expo EAS for app builds, submission and OTA.

## 9. Data & compliance

**Personal data collected:** first/last name, nickname, avatar, email, contact
number, city, interests, event history, photos, ratings and reports. Phase 2 adds:
**government ID and selfie** (Hub verification), **payment receipts**, and
**location data** (live location sharing).

> **CORRECTED 2026-08-13 (validator issue 8).** An earlier version of this section
> placed location data in Phase 2 while live location was scheduled in Phase 1 —
> making the Phase 1 legal scoping below wrong. **Decision 74 resolved this by
> deferring live location to Phase 2**, so the statement above is now accurate. Had
> live location stayed in Phase 1, that phase would have processed *precise
> geolocation of identified individuals, transmitted to unauthenticated third
> parties over a public URL*, and "standard ToS + Privacy Policy" would have been
> under-scoped for that reason in addition to Drawing Rate's public scoring (R15).

**Philippine Data Privacy Act (RA 10173) exposure.** Government ID and selfie
imagery fall in the higher-obligation category. At the volumes contemplated this
likely brings NPC registration duties and breach-notification obligations.
Deliberate mitigations already chosen: manual review instead of a biometric
vendor, minimum retention, raw verification documents deleted after approval, and
18+ only so no minor's data is processed.

**Phase-1 consequence worth preserving:** Phase 1 collects **no government IDs at
all** — no KYC, no Hubs, no verification. The heaviest compliance obligations are
therefore Phase 2 obligations. The milestone structure must keep this true so the
founders can launch Phase 1 on standard ToS + Privacy Policy and engage a lawyer
later with real usage data and less money at risk.

**Retention:** to be specified per data class in `security.md`. Verification
documents: delete after approval decision.

## 10. Trust, safety & liability

This product places strangers in physical proximity — sometimes in remote or
genuinely hazardous settings (mountain hikes, motorcycle touring, diving) — with
money changing hands. That is a heavier trust burden than a typical social app,
and it is carried operationally by two people.

- Report / block / kick exist in the ideation doc and are retained.
- **The anonymous message thread inside the live-location link is an unmoderated
  inbox from unauthenticated strangers** sitting inside a safety feature.
  Mitigations required: recipient must set a display name, hard rate limiting,
  joiner can mute or kill the thread instantly, auto-purge on event end.
- **Link forwarding** on the live-location link: short expiry tied to the event
  window, joiner-revocable at any time, and a visible "currently viewing" count.
- **Location updates every 1–2 minutes while foregrounded**, not continuous
  streaming — same felt experience, far lower battery and write cost, and avoids
  the background-location permission review conversation with Apple entirely.
- **Fake payment receipts are trivially produced.** UI copy and ToS must state
  plainly that verification is the organizer's responsibility and SponTRIP is not
  a party to the transaction and offers no refunds.
- Trust & safety moderation is manual founder labor. Operational load must be
  acknowledged in the risk analysis.

## 11. Legal — OPEN BLOCKER

Ownership of the legal documents is **undecided**. Required set: Terms of Service,
Privacy Policy, Community Guidelines, and an explicit liability disclaimer that
SponTRIP is not a party to any event or any payment.

**Hard-blocks:** any milestone shipping KYC with real government IDs (Phase 2).
**Does not block:** Phase 1, which can launch on standard ToS + Privacy Policy.

## 12. Timeline & runway — DECIDED

**No hard external deadline. 18+ months of runway; day jobs cover costs.**

Standing guidance to the founders despite the comfortable runway: launch early
anyway. With a repeat-behavior success metric, feedback is worth more than
features, and the metric cannot be measured until real users are using it.

> **UPDATED 2026-08-13.** Three things changed after validation:
> 1. **First release is a CLOSED BETA**, not a public store launch (decision 76).
> 2. **Milestone cadence is measured in FTE-weeks, not calendar weeks.** An
>    FTE-week is 40 hours of work. At the planning assumption of 20 combined
>    productive hours/week (decision 79), a 2.5 FTE-week milestone is 5 calendar
>    weeks. The old "1–2 week cadence" line conflicts with this and is superseded.
> 3. **Dates live in `plan.md` §4.7 and `milestones.md`**, with sensitivity shown
>    across four capacity scenarios rather than a single date.

## 13. Founder responsibilities — ⚠️ SUPERSEDED

> **This table is stale as of 2026-08-13. Use `plan.md` §6 instead.**
> It is retained only as the original record. Specifically wrong here: the Apple
> Developer Program is needed at **M0**, not "before iOS beta"; the Google Play
> account must be started **in week 1** because of the 12-tester / 14-continuous-day
> gate; and brand assets are needed **before M6**, not Milestone 1.

| Item                                        | Est. cost                      | Deadline           |
| ------------------------------------------- | ------------------------------ | ------------------ |
| Apple Developer Program                     | ~$99/yr — estimate, to confirm | Before iOS beta    |
| Google Play Developer                       | ~$25 one-time — to confirm     | Before Android beta|
| Domain name                                 | ~$12/yr — to confirm           | Milestone 0        |
| Legal documents (ToS/Privacy/Guidelines)    | TBD — **open blocker**         | Before Phase 2 KYC |
| Third-party security audit                  | TBD — to confirm               | Before Phase 2 KYC |
| Seed organizer recruiting (rides/diving)    | Founder time                   | Before Phase 2     |
| Brand assets / mascot direction             | Founder + designer             | Milestone 1        |
| Google Cloud OAuth app (Sign-In)            | Free                           | Milestone 0        |

## 14. Drawing Rate mechanic (founder-specified 2026-08-12)

Drawing Rate is the Phase 1 wedge. QR check-in is how it is measured.

### Founder-specified rules (as given)

1. Once an event is **finalized**, a check-in QR is generated.
2. On event day the QR is used for attendance. A member who **confirmed** but
   failed to be scanned takes a hit on their **individual** Drawing Rate.
3. If **nobody** scanned on event day, the hit lands on the **group's** Drawing
   Rate.
4. If the group **cancels on the day of the event**, that hits the group's
   Drawing Rate.
5. The **Leader / event creator** scans. If the Leader cannot attend they may
   **assign a delegate** to scan — but the Leader still takes the individual hit
   for not attending.
6. The resulting stat is intended to be **funny and screenshot-shareable** to
   social media. This is the intended growth loop, not a side effect.

### Resolved design decisions (2026-08-12)

- **Scan model — Leader displays one rotating QR; members scan it.** Leader holds
  up their phone, the whole group scans at once. Fast for a 20-person office
  group, no Leader bottleneck. The code rotates on a short interval so a forwarded
  screenshot cannot be used to check in remotely — this is the anti-cheat
  mechanism, and it matters because a reputation score creates real incentive to
  game it. Works offline: the scan queues on the member's device with its
  timestamp and syncs later; the server validates the code was valid at that
  timestamp. Leader may delegate by handing off who displays the code (rule 5),
  and still takes the individual hit for not attending.
- **Cancellation — reason required, safety exempt.** Cancelling prompts for a
  reason. Weather, safety, illness and emergency are exempt from penalty.
  "Nobody showed up" / "everyone backed out" counts against the group. Resolves
  the safety-critical concern: the mechanic must never make calling off a dive or
  ride in bad conditions the expensive choice.
- **Attribution — Leader confirms the final attendance list.** After the event the
  Leader gets a short prompt ("Who actually came?") pre-filled from scans and
  editable in a few taps. Scans do the work; the Leader closes the gaps.
  Individual penalties apply only to members the Leader confirms were absent.
  This simultaneously resolves the rules 2/3 conflict, supplies the missing manual
  override for dead phones and lost signal, and provides the grace path for
  "the event happened but nobody remembered to scan."
- **Visibility — both group and individual Drawing Rate are fully public.**
  Founder decision, taken against the recommendation to keep individual rates
  private. Accepted. Required mitigations are recorded below; without them a
  permanently public flake score on a real person is a genuine social-harm and,
  in Phase 2, gatekeeping risk.
- **Only finalized events count.** Casual "tara, hiking tayo" chatter carries no
  consequence; the score only starts tracking once an event is finalized. Prevents
  the mechanic from suppressing the very behaviour it exists to encourage.
- **Offline-first check-in is mandatory** — see §5.

### Scoring model — founder clarification 2026-08-12

**Individual Drawing Rate penalises broken commitments only.** A user is affected
only if they **confirmed** and then failed to show. Declining, ignoring, or never
confirming an invite has **no effect** on the score.

Rationale (endorsed): if declining hurt the score, users would stop responding
altogether — training exactly the ghosting behaviour the product exists to fight.
Free to say no, costly to break a promise. That is what makes a confirmation mean
something.

**Two distinct stats, same underlying data, opposite framing:**

| Stat                        | Definition                                                      |
| --------------------------- | --------------------------------------------------------------- |
| Individual Drawing Rate     | confirmed-but-no-showed ÷ total confirmed (rolling 6 months)     |
| Show-up record + streak     | showed ÷ total confirmed, plus consecutive-show streak           |

Both derive from the same base — **events the user confirmed for** — so declined
invitations appear in neither. This satisfies the "positive framing alongside
negative" mitigation required for a public score.

**Group Drawing Rate is a different measurement sharing the name:** finalized
events that did not push through ÷ total finalized events (rolling 6 months).
It measures "puro plano lang" at group level; the individual rate measures
flaking. Must not be conflated in implementation.

**Edge case — cancelled events are excluded from the individual denominator.**
If an event is cancelled, nobody no-showed. A confirmed-then-cancelled event must
not count against any individual. Weather/safety cancellations are already exempt
from the group rate (decision 32).

**Display — DECIDED: all three, layered.** Playful tier label with mascot
expression as the headline (the shareable artifact), exact percentage revealed on
tap, and the show-up streak as a separate prominent positive stat. These are not
alternatives; they are three layers of the same card.

**Window — DECIDED: rolling last 6 months.** Recent behaviour only, so users can
recover. Keeps the score motivating rather than fatalistic.

**Confirmation is required to check in — DECIDED.** No confirmation, no scan, no
credit. Closes the "never confirm, just show up" loophole. Non-confirmers escape
the penalty but earn no streak and no show-up record, so their profile reads
"no track record yet." The Leader may still add a walk-in manually during
attendance confirmation. Consistent with Phase 2, where paid registration already
requires confirming.

### Mitigations required for a fully public individual score

- Minimum completed-event threshold before any score is displayed, so new users
  are never shown with a meaningless or damning number.
- Leader-excused absences do not count against the individual.
- Positive framing shown alongside the negative — events completed, not only
  events flaked.
- Score window and display format: RESOLVED above (rolling 6 months, three-layer
  display).

## 15. Open items — status as of 2026-08-13

**RESOLVED (do not re-litigate — see `decisions.md`):**

- ~~Navigate interaction model~~ → decisions 58, 59. No Navigate tab in Phase 1;
  Phase 2 is feed-first with an opt-in save-only Discover deck.
- ~~Badge system design~~ → decision 60. Closed set of 6, Phase 3.
- ~~Chat infrastructure choice~~ → decision 54. Supabase Realtime. Cost curve in
  `plan.md` §2.5; the wall is peak concurrent connections, not user count.
- ~~n8n for ops automation~~ → decision 56. Excluded.

**RESOLVED 2026-08-28 (decisions 112–116) — was "STILL OPEN":**

- **Accessibility commitment level** — confirmed at the baseline stated in §3
  (contrast, tap targets, dynamic type, screen-reader labels on primary flows).
  No formal WCAG AA conformance commitment. Decision 115.
- **Repeat-behavior target number** — **relative**, not absolute: "repeat-join
  rate trends upward month over month" (decision 53, confirmed as 116).
- **RLS review budget and vendor** (SEC-5) — downgraded to an optional,
  unbudgeted founder self-review; no longer gates M2 or M7. Decision 112.
- **Google Play account type** — **Personal.** Accepts the 12-testers/14-day
  gate; recruit immediately. Decision 113.
- **Capacity assumption** — confirmed at 20 combined hrs/week (decision 79),
  no change. Decision 114.
