# SponTRIP — Project Plan

**Version:** v0.6 (**APPROVED — GATE 1 CLEARED 2026-08-28. See decision 118.**)
**Status:** Phases 2–5 complete and validated. Two post-Gate-1 scope additions
incorporated 2026-08-13 — see decisions 100 and 111. All five "Open items for
Gate 1" resolved 2026-08-28 — see decisions 112–116. **Founder gave explicit
final approval 2026-08-28 (decision 118). Ready for `/spark-dev`.**
**Last updated:** 2026-08-28

## Changelog

- v0.6 — 2026-08-28 — All five open Gate 1 items resolved (decisions 112–116):
  SEC-5 human RLS review downgraded from hard gate to recommendation (SEC-2's
  automated CI suite remains mandatory and unchanged); Google Play account type
  set to Personal (12-tester/14-day gate accepted); capacity assumption
  confirmed at 20 combined hrs/week (no date change); accessibility commitment
  confirmed at the stated baseline (no formal WCAG AA); repeat-behavior success
  metric set to relative ("trends upward month over month"), not absolute.
  §5.1 and §6 updated. Final overall Gate 1 approval presented separately.
- v0.5 — 2026-08-13 — Second post-Gate-1 addition: recurring events + Reason Rate
  (decisions 101–110). Founder's original workflow proposed penalizing silence on
  recurring event invites; declined in favor of keeping decisions 36/42's rule
  (only a broken confirmed promise counts) consistent everywhere. Reason Rate
  scoped as a purely descriptive "fun fact," not a score — no peer judgment of
  reason credibility. Built as an auto-recreate convenience reusing the existing
  event/QR/attendance/Drawing-Rate pipeline, not a new series-editing system,
  which kept the real cost to ~2.0 FTE-weeks. **M8: 4.5 → 6.5 FTE-weeks. Total:
  19.5 → 21.5 FTE-weeks.** Beta now lands mid-June 2027 at the planning
  assumption. Stated plainly once; not re-litigated. NOT YET APPROVED.
- v0.4 — 2026-08-13 — Founder requested three additions after reviewing Gate 1:
  a poll feature (recovers ideation §6.3), the full badge system from
  `SponTRIP_Badge_System.md` moved from Phase 3 into the beta (supersedes decision
  60), and an ephemeral check-in photo-template share card (recovers ideation §9.2,
  scoped to avoid reopening decision 68). New milestone M8 (~4.5 FTE-weeks).
  **Total effort: 15.0 → 19.5 FTE-weeks.** Founder chose to accept the schedule
  slip rather than cut other scope. Consequence stated plainly: December is no
  longer reachable at any modeled capacity, and the original seasonal reason for
  targeting it (Christmas-party season for the launch cohort) no longer applies.
  Beta now lands mid-May 2027 at the planning assumption, or mid-February 2027 at
  a sustained 30 hrs/week. NOT YET APPROVED.
- v0.3 — 2026-08-13 — Loop-2 remediation. RECAP-1 restricted to aggregate counts
  only. Event lifecycle defined with scores moving only on resolution. `T` defined
  as event end time and added to EVT-1. Edit precedence defined. QR-4 downgraded
  from detection to forensics. QR-6 and ONB-1 added. M1 acceptance criteria
  rescoped, with a standing definition of done. Checkpoint moved to calendar week 8.
  Rate limiting and dependency scanning added. Privacy Policy corrected to
  beta-blocking. **Plan is 15 FTE-weeks, not the 12 the founders consented to —
  see decision 83.** NOT APPROVED.
- v0.2 — 2026-08-13 — Remediated all 12 major issues from validation loop 1.
  Feature specification written with canonical IDs (was prose only). Capacity model
  added — an FTE-week is 40 hours, not one calendar week. Drawing Rate state machine
  defined, fixing the walk-in loophole and four undefined states. "December launch"
  redefined as a closed beta. Live location deferred to Phase 2. Drawing Rate
  visibility scoped to Circle members in Phase 1. App shell / IA / design system,
  web target, scheduled jobs and a CI negative-authorization suite added — all
  previously owned by no milestone. Security requirements section written.
  NOT APPROVED.
- v0.1 — 2026-08-12 — Draft opened. Research phase incorporated. NOT APPROVED.

---

## 1. Overview

SponTRIP connects people and friend groups who want to do the same activity, with
the same people, at the same time — rides, dives, hikes, sports, coffee meetups,
spontaneous weekend trips. Its distinguishing mechanic is **Drawing Rate**: a
public, quantified reliability signal that measures whether plans actually happen,
named for the Filipino "puro plano lang."

Full brief and constraints: `.spark/project.md`. Decision history with rationale:
`.spark/decisions.md` (85 recorded decisions, with a supersession index at the top).

**Fixed before this plan started:** React Native + Expo client; $50/month budget
ceiling pre-revenue; 18+ only; sequenced 3-phase delivery; SponTRIP holds no money;
manual KYC; founders build via AI-assisted development and do not hand-write
production code.

---

## 2. Research findings (Phase 2 — 2026-08-12)

> Source: spark-researcher report, 2026-08-12. All pricing is an estimate as of
> that date and **must be re-verified before any commitment or client-facing use.**

### 2.1 Problem validation — honest assessment

The "puro plano lang" problem is **culturally corroborated but not survey-validated.**
No published study quantifies it. Philippine social/culture press in 2026 is writing
about the adjacent "sponty plans" trend — Filipinos moving to spontaneous,
low-friction plans precisely because group-chat planning fatigues them — which
describes the same pain from the other side without productizing it.

**Treat the problem statement as founder-observed, not externally proven.** This
raises the stakes on the repeat-behavior success metric: it is the only mechanism
that will actually validate or falsify the thesis.

**Market size is not a constraint.** Philippines: ~98M internet users (83.8%
penetration), 98.6% smartphone ownership, ~95.8M social media identities, ~7.7
hours/day on connected media. Facebook holds ~91.6% social traffic share as of
Feb 2026 — enormous addressable population, and an incumbent that is not eroding.

### 2.2 Competitors

| Product | Gap it leaves | Verdict |
| --- | --- | --- |
| **Facebook Events + Messenger/Viber** | No commitment mechanic, RSVPs non-binding, no reputation, no structured registration, no offline check-in, plans buried in chat noise | **The real incumbent.** Research confirms all three beachhead verticals (PH motorcycle clubs, dive communities, office groups) organize on Facebook Groups today — this is verified fact, not assumption. |
| **Meetup** | **Organizer-side paywalled at ~$29.99/mo — no free organizer tier.** Built for public communities, not friend groups. Thin PH presence. | SponTRIP's free-for-organizers Circle model is a genuine structural advantage for the office-group beachhead. |
| **Eventbrite** | Per-ticket fees (~3.5–3.7% + flat fee per paid ticket). Commercial organizers, no Circle/group-chat concept. | SponTRIP's zero-take-rate GCash-direct model is a real differentiator for small PH registration fees. |
| **Partiful** | US-centric. No accountability mechanic, no check-in, no persistent group identity. | Validates the playful/shareable design tone for this demographic. Not a PH competitor. |
| **Luma** | Professional/public community events. No reliability scoring, no offline check-in. | Validates the Phase 2 public-event category. Does not compete with Phase 1 at all. |
| **PH/SEA-local apps** | No live, meaningfully-adopted PH-local dedicated competitor surfaced. | **Absence of evidence, not evidence of opportunity.** Could be white space or could be a business nobody has made work. |

### 2.3 Prior art on Drawing Rate — the single most important finding

**No shipped consumer product was found with a fully public, cross-context
individual flake/reliability score for social plans.**

The closest prior art is **FLKE** (iOS), which targets the identical
"stop flaking" problem — but chose a **financial** enforcement mechanism, not a
reputational one: the organizer sets a monetary flake fee, no-shows forfeit money.
Location-based check-in, no public score.

This is genuinely ambiguous evidence and must be read honestly. Either:

- **(a)** money is a more legible incentive than reputation, and Drawing Rate is
  untested territory carrying real risk; or
- **(b)** reputation is a novel, defensible wedge nobody has publicly attempted.

Research cannot resolve which. Only Phase 1 usage data can. Ride-hailing driver
ratings are the nearest real-world analog, but the power dynamic is asymmetric
(gig worker vs. customer) and scores are aggregate/private — not a precedent for a
**peer-to-peer public flake percentage among friends.**

**Consequence for the plan: the riskiest bet in this project is not the stack, the
budget, or the timeline. It is whether the public Drawing Rate produces delight or
backlash.** That must be instrumented and watched from day one of Phase 1.

### 2.4 Wedge ranking (research-informed)

1. **Circles + Drawing Rate — highest switching power, unproven.** The only wedge
   structurally impossible to replicate inside Messenger: a persistent,
   cross-group, quantified reputation signal. Built-in growth loop via
   screenshot-sharing. Risk: no prior art validates that friend groups *want* a
   public flake score on themselves.
2. **Album / memories — retention multiplier, not a wedge.** Facebook and Instagram
   already own post-event photo sharing as a habit. Real reason to return; not a
   reason to switch.
3. **Public hobby-event discovery — lowest near-term switching power, real
   long-term value.** Two-sided cold start, and Luma/Eventbrite already serve
   organizers willing to leave Facebook. SponTRIP's edge here is narrow but real:
   zero take rate, certification-aware form builder, and offline check-in for
   signal-dead terrain — it wins the "remote/hazardous hobby with money changing
   hands" niche (diving, touring) before it wins general public events.

**This ranking matches the sequencing already decided.** No change required.

### 2.5 Stack options — DECIDED (Option A), retained for the record

React Native + Expo is fixed on the client. These options vary the backend.
**All three pair with Cloudflare R2 for photos** — R2 has **zero egress fees**,
$0.015/GB storage, free up to 10GB storage / 1M write ops / 10M read ops per month.
No backend's native object storage has zero egress, and this single decision is
what keeps a photo-heavy app affordable regardless of backend choice.

#### Option A — Supabase + Cloudflare R2 ⭐ RECOMMENDED

Postgres + Row-Level Security as datastore and declarative access control;
Supabase Auth (Google/Apple/email, managed); Supabase Realtime for chat/DM/presence;
Edge Functions minting presigned R2 URLs.

| Scale | Modeled monthly cost | Notes |
| --- | --- | --- |
| 100 users | **~$25** | Pro plan. Free tier technically covers it but has no backups/SLA — unacceptable for real users. $10 compute credit covers Micro instance. |
| 1,000 users | **~$25–40** | May need $15/mo Small compute. ~100–200 peak concurrent chat connections stays inside the 500 included. |
| 10,000 users | **~$60–130 — BREAKS CEILING** | Peak concurrent connections may exceed 500 → $10 per 1,000 peak-connections overage. Compute moves to Small ($15) or Medium ($60). |

**Founders-can't-debug-it fit: STRONGEST.** RLS policies are short SQL predicates
reviewable in isolation, not traced code paths — this is exactly the declarative
access control the team constraint demands. Managed auth. Connection-based billing
with a published overage formula fails predictably.

**Escape hatch: LOW PAIN.** Standard Postgres underneath — `pg_dump` is portable,
RLS policies are ordinary SQL. R2 is S3-API-compatible.

#### Option B — Firebase + Cloudflare R2

Firebase Auth; Firestore with declarative Security Rules; `onSnapshot` listeners
for chat.

Cheaper on paper (a cited real-world example puts 5,000 DAU at ~$12/mo on Blaze).
**But that same source flags the disqualifying risk: there is no hard spending cap.
One unbounded query or looping Cloud Function can turn $12 into thousands
overnight.** Firestore bills per document read, and every open chat listener
re-reads on every change — cost scales with (messages × listeners), not a clean
connection count.

**Founders-can't-debug-it fit: WEAK.** The uncapped-spend risk requires the founders
to build their own budget alerts and kill-switch — real ops work squarely inside
"things nobody on the team can debug."
**Escape hatch: HIGH PAIN.** NoSQL document model doesn't export to a portable
relational schema; leaving means a data-model rewrite.

#### Option C — AWS Amplify Gen 2 + Cloudflare R2

Cognito (10,000 MAU free, then $0.015/MAU — auth is free at every modeled scale
point); AppSync GraphQL with real-time subscriptions; DynamoDB; S3.

**Cheapest on paper — plausibly under $20–30/mo even at 10,000 users.**

**Founders-can't-debug-it fit: WEAKEST — this is the deciding downside.** Largest
operational surface of the three. Access control is spread across IAM policies,
Cognito groups, and resolver-level authorization rather than living in one
reviewable place. Misconfigured IAM/S3 permissions are among the most common causes
of real-world cloud breaches — precisely the "subtle authorization bug an attacker
notices before the founders do" scenario this project is most exposed to. No SQL
for ad-hoc debugging.
**Escape hatch: HIGHEST PAIN.** Classic AWS lock-in.

#### DECISION — Option A, taken by founders 2026-08-12

**Option A (Supabase + Cloudflare R2) is the chosen stack.** Recorded in
`config.md`. Founders also confirmed **SMS OTP is excluded** and **n8n is
excluded** from all scope.

**Option A**, despite not being cheapest at 10,000 users. It wins on the two
criteria the founders weighted heaviest: reviewable declarative access control, and
predictable failure. **Decided by the founders 2026-08-12 (decision 54); recorded
in `config.md`.** Options B and C are retained above as the rationale record.

**Critical open number:** the $50 ceiling's true breakpoint depends on real
concurrent-chat behavior, which cannot be derived from pricing pages. **Load-test
chat concurrency early** — watch connections, not user count.

### 2.6 Integrations & pricing (all estimates — re-verify)

| Service | Purpose | Pricing | Note |
| --- | --- | --- | --- |
| Expo Push | Push notifications | **Free**, no per-notification fee, no MAU cap. 600/sec/project rate limit | No budget impact |
| Resend | Transactional email | Free: 3,000/mo **capped at 100/day**; $20/mo for 50k | ⚠️ The 100/day cap can bind during a launch spike |
| Sentry | Error monitoring | Free: 5k errors/mo, 1 user. Team $26–29/mo | Free tier realistic for Phase 1 |
| **PostHog** | **Product analytics — REQUIRED from M0** | **Free: 1M events/mo, 1yr retention, cohort + retention analysis, session replay, feature flags all included** | ⭐ Recommended. Retention/cohort tooling is built in, directly serving the repeat-behavior success metric |
| Cloudflare R2 | Photo storage | Free to 10GB + 1M write / 10M read ops; then $0.015/GB. **Egress always $0** | Decisive for a photo-heavy app |
| Cloudflare Images | Image transforms | 5,000 free unique transforms/mo on remote images, then $0.50/1,000 | Pairs with R2 without double-paying storage |
| Google Sign-In | Auth | Free | Needs free Google Cloud OAuth app |
| Sign in with Apple | Auth (mandatory on iOS) | No fee beyond the ~$99/yr Apple Developer Program already budgeted | No incremental cost |
| SMS OTP | Phone verification | PH local: PhilSMS ~₱0.35, Semaphore ~₱0.50/SMS. Twilio Verify ~$0.05/verification (5–20× local) | ❌ **RECOMMEND DROPPING FROM MVP** — see below |

**SMS OTP — research recommends dropping entirely for MVP.** Per-message cost is
negligible at this scale; the risk is **SMS pumping fraud** (bots triggering
thousands of OTPs to premium-rate numbers the founders pay for). Google Sign-In,
Sign in with Apple and email already cover authentication without touching phone
numbers. Defer entirely; revisit as a Phase 2+ decision behind CAPTCHA and rate
limiting if Hub verification ever needs it.

**n8n — research recommends deferring.** n8n Cloud no longer has a free tier
(from $24/mo). Self-hosting conflicts directly with the project's own
managed-services-only constraint. The described use cases (KYC queue alerts,
moderation escalation) are low-volume internal notifications achievable at ~$0 via
Postgres triggers / Edge Functions posting to a Slack or Discord webhook.

### 2.7 Deployment

**Expo EAS.** Free: 15 iOS + 15 Android builds/month, OTA for **up to 1,000 MAU**,
100GiB bandwidth. Starter **$19/mo**: $45 build credit, OTA for 3,000 MAU.
Production $199/mo: OTA for 50,000 MAU.

⚠️ **The free tier's 1,000-MAU OTA cap is the first Expo threshold to hit.**

**Modeled Phase 1 launch cost:** Supabase Pro $25 + R2 ~$0 + Expo Free→Starter
$0–19 + PostHog $0 + Sentry $0 + Resend $0 = **$25–45/month. Inside the ceiling
with headroom.**

### 2.8 App store requirements — concrete build items, not afterthoughts

1. **Account deletion is a hard requirement on both stores, and Google requires
   TWO paths:** an in-app delete-account flow **and a web-based deletion path
   reachable after the app is uninstalled.** This is a Milestone 0/1 build item —
   submission will fail without it.
2. **Expect a 17+ App Store rating** regardless of the internal 18+ account gate.
   Comparable apps that facilitate real-world meeting with UGC (happn, Yubo,
   MeetMe) carry 17+. Store rating and in-app age verification are two separate
   mechanisms; **both are needed.** Google Play's IARC questionnaire must reflect
   UGC, location-based real-world meetups, and user-to-user messaging.
3. **UGC moderation requirements tightened for 2026.** Google Play requires in-app
   reporting/blocking and action on reports, and **explicitly expects automated
   moderation at scale — manual review alone is not considered sufficient as volume
   grows.** Apple Guideline 1.2 is equivalent. The planned admin console satisfies
   the baseline at launch scale, but **manual-only moderation is a medium-term
   platform risk**, and moderation is explicitly manual founder labor per the brief.
4. **Foreground-only location is confirmed as the correct mitigation** — it avoids
   Apple's much stricter background-location review entirely.
5. **QR/camera permission:** unremarkable, no special review friction with an
   accurate purpose string.

### 2.9 Success metric benchmark

Generic social/messaging D30 retention benchmarks run **5–20%**, with ">15%
excellent" and ">10% healthy" commonly cited. **But SponTRIP's actual metric
(joined-one-event → joined-another) is behaviorally far stricter than
generic D30 app-open and will track lower in absolute terms.**

**Recommendation: set a relative target — "repeat-join rate trends upward month
over month post-launch" — rather than anchoring to an external absolute number that
measures a different behavior.**

---

## 3. Risks (Phase 3 — 2026-08-12)

> Source: spark-risk-analyst report, 2026-08-12. Likelihood/Impact are the
> analyst's assessment. Mitigations are constrained to what a 2-person
> non-coding team on $50/month can actually execute.

### 3.1 TOP 5 — the ones that kill the project

#### K1 — Drawing Rate trains the exact behaviour it was built to kill
**Likelihood: High · Impact: High**

Second-order effect of decision 36 that had not been traced through: since only
*confirmed-then-no-showed* is penalised, **the rational strategy is to never
confirm.** No confirmation = no risk in either direction. Once a few users work
this out (one screenshot in a group chat away from common knowledge), confirmation
stops carrying signal — and confirmation-derived headcount is the thing Leaders
actually need for food, transport seats, and dive slots. The app would have
recreated "puro plano lang" ambiguity with an extra screen.

Note: decision 42 (confirm-required-to-check-in) partially blunts this — a
never-confirmer earns no streak and no record — but it does not remove the
underlying incentive.

**Mitigation:** Instrument confirm-rate and confirm→no-show rate as a PostHog
funnel from day one (nearly free — the analytics are already required). The tell
is confirm rate trending *down* over a user's tenure. If it appears, the fix is a
design change, not a code fix. Watch it; don't pre-solve it.

#### K2 — The reputation data may not be trustworthy, and credibility dies in one screenshot
**Likelihood: Medium-High · Impact: High**

Three gaps compound:

1. **The weather/safety exemption is self-reported with no verification.** Any
   group can escape the penalty by typing "weather" every time. The group score is
   only as honest as the least honest Leader.
2. **The Leader unilaterally edits the attendance list** with no visibility to
   affected members and no audit trail they can see. A normal user — not a
   moderator — silently rewrites another person's public reputation.
3. **No dispute or appeal path exists in the design at all.**

Failure mode: a user discovers their public score was set by someone's editorial
choice rather than a scan record, and posts about it. **For a product whose growth
loop is "screenshot your stat and share it," the same virality works in reverse.**

**Mitigation — not fully fixable at this budget; say so plainly.** What is
affordable: (a) show the scan-derived list to affected members alongside publish,
so being marked absent is never a silent surprise; (b) log every Leader edit with
old/new value and timestamp — one Postgres table — so disputes are adjudicated
from data; (c) build a minimal "flag this attendance record" button into Phase 1
scope now, routed to the founders' manual queue.

#### K3 — Founder bandwidth has no slack, and the workload scales with success
**Likelihood: High · Impact: High**

Two part-time founders simultaneously running manual KYC review, moderation,
Drawing Rate dispute adjudication, support, *and* directing all development. None
are one-time costs — all are recurring, per-user, un-delegable labour that grows
with the exact growth the product needs.

**The specific trap: growth is good news that directly produces more unpaid,
safety- and legally-sensitive manual work.** The moment it starts working is the
moment it breaks the people running it. There is no team to absorb the surge and
no budget to hire.

**Mitigation:** Set explicit volume caps *before* Phase 2 launch — e.g. "X new Hub
applications per week" — and build the queue UI to enforce the cap honestly rather
than silently degrading turnaround. Throttling intake to match real review capacity
is the only lever this team has. Also track founder-hours/week on
KYC+moderation+disputes from the first approval onward; untracked, "we're fine" is
a feeling, not a fact.

#### K4 — Drawing Rate has to work, and there is no fallback wedge
**Likelihood: Medium · Impact: High**

Every non-Drawing-Rate Phase 1 feature (Circles, chat, events) is something
Messenger already does adequately for free. **Drawing Rate is the entire switching
argument.** Album is explicitly "retention, not a wedge"; public discovery is the
weakest near-term wedge. If K1 or K2 undermine the mechanic, there is no B-plan.

**Mitigation:** Nothing shrinks this except real Phase 1 data, fast — already
prioritised. The concrete addition: **define the kill/pivot signal now, while it is
still hypothetical and before emotional investment makes it hard to see.** E.g.
"if repeat-join is flat after N weeks with M active Circles, and PostHog shows
declining confirm-rate (K1) or score-accuracy complaints (K2), that is the signal
to redesign Drawing Rate's visibility rules."

#### K5 — One subtle authorization bug, in code neither founder can audit, on the most sensitive data the app holds
**Likelihood: Medium · Impact: High**

RLS being *reviewable* is not the same as RLS being *reviewed correctly*. An agent
fixing an unrelated bug can loosen an `AND` to an `OR`, drop a `USING` clause on an
`UPDATE` policy, or expose a column through a view that bypasses RLS — a two-line
diff the founders can read but cannot evaluate adversarially. The data at stake is
RA 10173's highest-obligation class.

**Gap in the current plan:** the security audit is scoped "before KYC" — but Phase 1
already collects names, contacts, city, photos and event history, and already ships
an admin console with account-action powers whose own authorization must be correct.

**Mitigation:** Pull a **lightweight RLS-policy-only review earlier** — end of
Milestone 0/1, before real user data is live. Narrowly scoped (review the policies,
not a full pen-test), so it is affordable, and it targets exactly this team's blind
spot.

### 3.2 Drawing Rate — further risks

| ID | Risk | L / I | Mitigation |
| --- | --- | --- | --- |
| **R1** | **Reputation cross-contamination.** One chaotic barkada phase produces a score that follows the user into a Phase 2 dive organizer's admission decision. Score can't distinguish "unreliable person" from "one bad Circle." | M / M | Phase 2 registration UX must not surface Drawing Rate as a gate — **don't let organizers sort or filter registrants by score.** Cheap to decide now, expensive to walk back once organizers form the habit. |
| **R2** | **Phase 1's cohort is coworkers.** The first people to hold permanently public reliability scores on each other are office colleagues, in a context with real power dynamics. A public "23%" on a colleague becomes ammunition in office dynamics the founders can't see or control. | M / M-H | Genuine argument for reconsidering full public visibility *for the Phase 1 cohort specifically*, even if not product-wide. If declined (founders' prerogative — already decided once against recommendation), instrument for it: watch account deletions and profile-visibility complaints from the office cohort. |
| **R3** | **Live-location link as a stalking vector.** Mitigations cover forwarding and spam, not the case where the *original recipient* is the threat — an abusive partner given the link "for safety," with a live feed during a vulnerable activity plus a message channel reaching the person mid-dive or mid-ride. | L-M / H | Not fully solvable in software. Two cheap helps: the thread must not vibrate/notify during active sharing without per-session silencing (distraction during a hazardous activity is itself a danger); and safety copy must warn explicitly, since the product cannot distinguish a trusted contact from an abuser at share time. |
| **R4** | **Leaders have no accountability of their own.** Nothing tracks whether a Leader runs the attendance step honestly or promptly. Doing it days later from memory silently degrades every downstream score. | H / M | **REVISED 2026-08-13.** The original "push at T+4h" fought the offline-first requirement (it drove finalization before offline scans could sync). Replaced with **two** prompts: an early nudge shortly after `T` to fill an explicitly *provisional* editable list while memory is fresh, and a final reminder at the close of the T+72h window (ATT-6). This keeps R4's "not from memory days later" benefit without breaking offline sync. Leader self-edits are logged distinctly (ATT-3) and counted in ADM-5. |

### 3.3 Market & competitive

| ID | Risk | L / I | Mitigation |
| --- | --- | --- | --- |
| **R5** | **Facebook doesn't need to copy Drawing Rate to neutralise it.** A lightweight "did this actually happen" poll sticker inside Messenger — where the beachhead communities already live — captures most of the behavioural signal with no new app. | L-M / H | None available at this budget beyond speed. "Launch early" is the only answer. This is a risk to outrun, not defend against. |
| **R6** | **Seed recruiting rests entirely on founders' personal social capital**, with zero paid-acquisition backstop at $50/month. If their own office, riding, or diving contacts try it once and don't return, there is no second channel. | M / H | Identify a **second, independent office-group contact — not their own workplace** — before calling Phase 1 launched, so validation isn't riding on one social circle that may be humouring the founders. |

### 3.4 Technical & architecture

| ID | Risk | L / I | Mitigation |
| --- | --- | --- | --- |
| **R7** | ~~Offline check-in and rotating-QR anti-cheat are in direct tension~~ **RESTATED 2026-08-13 — the original framing was wrong and would have caused the slip it predicted.** The offline device does **not** need to validate anything. The member's device records `(code, timestamp)` and queues it; the **server** validates at sync. Only the *Leader's* device holds the seed, issued online at finalize — and a Leader who extracts their own event seed gains the ability to mark people present, **which they already have with two taps** via ATT-1. The threat is null. | **Resolved** | Spec rewritten (plan.md §4.1 QR-1…5). As originally written, R7 would have sent the build chasing an unsolvable client-side-validation problem and burned the entire M4 timebox — self-inflicted by the spec. Corrected estimate: **~3 days, not 2 weeks.** |
| **R8** | ~~Offline sync tolerance weakens the anti-cheat window~~ **PARTLY WRONG — RESTATED.** Sync delay does *not* widen the validity window, because validation is against the **recorded** timestamp, not the sync time. **The real offline attack is different and was unnamed: device clock manipulation.** Obtain a code screenshot from someone present at time T, set the phone clock to T, scan, queue, sync later — the server sees a valid code at a valid timestamp. This defeats rotation in the offline path, which decision 28 makes mandatory. | M / L-M | QR-2 records a **monotonic clock reading** alongside wall-clock time; QR-4 rejects or flags inconsistency. **Residual risk is documented in `decisions.md` rather than silently accepted.** See plan.md §4.5 — rotation stops casual cheating only; the Leader's confirmation is the actual control. |
| **R9** | **The budget wall binds at the worst possible moment.** Connection-based billing means the exact scenario indicating product-market fit — a viral Drawing Rate screenshot driving a signup wave — is the one most likely to spike concurrent connections past $50 with no warning. | M / M | Load-test chat concurrency early, **and set a hard Supabase billing alert well below the ceiling (~$35–40).** Five-minute dashboard config. |
| **R10** | **Single-vendor concentration with no fallback.** Supabase down = auth + DB + chat + functions down together, not independent failure domains. With no ops team, a vendor outage is indistinguishable from "our app is broken," and hours get lost debugging working code. | L-M / L-M | Bookmark Supabase and Cloudflare status pages; make "check status page first" step one of the incident checklist. Costs nothing. |
| **R11** | **Sentry free tier caps at 1 seat**, forcing shared credentials on a tool holding stack traces that can leak PII. | H / L | Scrub PII from error payloads at the SDK config level regardless — error monitoring is a common accidental PII leak vector independent of who is logged in. |

### 3.5 Security

| ID | Risk | L / I | Mitigation |
| --- | --- | --- | --- |
| **R12** | **Payment receipts are financial data in a general photo bucket.** GCash/bank screenshots contain account numbers, partial bank details and names — sitting alongside event photos with no handling distinction. | M / M | Distinct R2 bucket/prefix with narrower access policy — visible to the specific organizer and admin only, never general Circle/Hub members. Cheap at schema time, expensive to retrofit. |
| **R13** | **"Delete after approval" must be enforced, not just stated.** If the deletion job silently fails — a common real-world failure — the app accumulates exactly the data class it promised not to keep, invisibly. | M / H | Don't rely on the job alone. Add an admin-console dashboard count of "verification documents older than N days still present," which must always read zero. A silent failure becomes visible to a human. |
| **R14** | **The admin console is itself a high-value attack surface.** It approves KYC and takes account actions, so its own authorization is arguably more critical than the consumer app — and it's new scope built by the same non-auditing team. | L-M / H | Explicitly in scope for the earlier lightweight RLS review (K5) — the admin console's policies specifically, not just the general schema. |

### 3.6 Legal & compliance

| ID | Risk | L / I | Mitigation |
| --- | --- | --- | --- |
| **R15** | **Phase 1's "standard ToS" may be under-scoped.** Drawing Rate is a Phase 1 feature that *publicly characterises real people*, edited by a peer with no formal accountability. Boilerplate is unlikely to anticipate this. | M / M-H | When the legal blocker resolves, explicitly flag Drawing Rate's public-scoring nature as a drafting requirement for Phase 1's ToS — don't let "Phase 1 needs only standard docs" under-scope this specific document. |
| **R16** | **The 18+ gate is a self-attested checkbox**, yet it is the entire legal rationale for skipping RA 10173 parental-consent machinery. The compliance mitigation on paper and in practice are not the same thing. | M / M | Real age verification is neither affordable nor appropriate here — say so plainly. Achievable: make attestation legally meaningful — explicit birthdate entry with a genuine affirmation step, logged with timestamp. Doesn't prevent the problem; improves the founders' position if challenged. |
| **R17** | **Magic Bunot has latent gambling-regulation exposure** if it ever touches monetary value. Currently stakes-free, but "let Hubs run prize raffles" is a natural Phase 2 request that crosses a regulated line without anyone noticing. | L (rising) / M | No action now — scope is genuinely stakes-free. Flag as a **scope-creep tripwire** so a future prize-raffle proposal triggers a legal check *before* building. |
| **R18** | **Cross-border data transfer under RA 10173.** Supabase, Cloudflare, PostHog, Resend and Sentry are all foreign-hosted. Paperwork gap, invisible until an NPC inquiry. | L / M | Add to the already-planned lawyer engagement: ask about cross-border obligations for the current vendor list. Five-minute question, no new cost. |

### 3.7 Trust, safety & moderation

| ID | Risk | L / I | Mitigation |
| --- | --- | --- | --- |
| **R19** | **The safety exemption creates a trust problem where it solved a penalty problem.** Because it's self-reported, members now have reason to doubt a genuinely safety-motivated cancellation — adding reputational stakes to an already-hard go/no-go call on marginal dive or weather conditions. The exact dynamic decision 32 tried to design away. | M / M | Must stay self-reported — no affordable verification. Available lever is copy/UX: make choosing "weather/safety" not *visibly costless* (e.g. a note that repeated safety cancellations may be reviewed) without deterring genuine safety calls. Hard balance; needs a specific design pass. |
| **R20** | **Manual part-time moderation is against 2026 platform expectations, and compounds with K3.** If growth succeeds, moderation volume spikes exactly when founder bandwidth is already maxed by KYC and disputes — store-policy risk and burnout risk arrive together, for the same reason. | M (grows) / M | No affordable full fix. Realistic lever: **keep Phase 1's cohort small, known and low-stranger deliberately longer than strictly necessary** — manual moderation is far more tractable pre-strangers. Treat "delay Phase 2 until moderation tooling or a hire exists" as a legitimate deliberate choice. |

### 3.8 Founder-dependency & operational

| ID | Risk | L / I | Mitigation |
| --- | --- | --- | --- |
| **R21** | **Key-person risk on the SPARK prompting/spec discipline itself.** If one founder is unavailable for an extended period over 18 months, can the other alone run KYC, moderation, disputes *and* direct development at the same quality bar? | M / M | Keep `decisions.md` and milestone discipline genuinely current — that *is* the continuity mechanism. Ensure **both** founders can independently read the state files and resume, not just the more hands-on one. |
| **R22** | **Founders personally reviewing gov IDs of people in their own social networks.** PH riding and diving communities are small; seed organizers will be one degree of separation away. Socially awkward, and may itself suppress organizer signup. | M / L-M | No fix at this team size. Name it as an accepted cost of manual KYC in a small-community launch, so it isn't a surprise. |
| **R23** | **The AI-development failure mode is silent, not catastrophic.** The dangerous pattern: a plausible, narrowly-scoped fix that happens to touch an RLS policy or auth check, in a diff small enough to look safe and pass tests — because tests cover intended behaviour, not the unintended permission also granted. **Tests-as-code-review gives false confidence for exactly this class of bug.** | M / M-H | For any change touching auth, RLS or the admin console, require an explicit **"what does this change permit that it didn't before"** summary in the SPARK review gate. A checklist discipline, not a technical skill the founders lack. |
| **R24** | **The AI coding tool is a single point of failure for the team's only production capability** — including the ability to respond to a security incident. | L-M / M | Nothing structural is affordable. Recorded as an **accepted, unmitigated dependency** rather than pretending it's covered. |

### 3.9 Timeline & scope

| ID | Risk | L / I | Mitigation |
| --- | --- | --- | --- |
| **R25** | **18 months of comfortable runway removes the forcing function that caps scope drift** — and cuts against the plan's own "launch early" guidance. No deadline + cheap-to-request iterations + no revenue pressure = polish cycles that never ship. | M / M | **Set an actual calendar-bound Phase 1 launch target now**, self-imposed, tied to the 1–2 week milestone cadence — so "launch early" is a checkpoint, not a preference that comfortable runway makes easy to defer. |
| **R26** | **Decision 27 put the hardest, least-precedented work in the first release.** Offline anti-cheat rotating QR feeding a public reputation score with unresolved integrity issues (K1, K2, R7, R8) is now inside Phase 1, not a later phase where more would be known. | M / M | Can't be un-decided without losing the wedge. **Timebox the QR/offline-sync design work and flag it in milestones.md as the highest-uncertainty Phase 1 item.** If it overruns, that's the signal to simplify to a narrower anti-cheat guarantee for the low-stakes office cohort. |
| **R27** | **Form builder scope creep.** Inherently a mini low-code product; conditional logic, per-field validation and multi-language become natural asks once organizers use it. | H / M | Scope narrowly *and in writing* now: fixed field types (text, single-select, file upload, certification dropdown), **no conditional logic, no custom validation scripting** — so "just one more field type" has a written boundary. |
| **R28** | **The admin console is a second full application** bundled quietly into Phase 1/2. Internal tools are notoriously underscoped — every edge case the founders hit while actually doing KYC becomes "the console should also do X." | H / M | **Give it its own milestone with its own acceptance criteria**, not a footnote inside feature milestones, so its growth is visible rather than silently absorbed. |
| **R29** | **Badge/gamification creep**, pushed by the Duolingo-soul direction — or proposed as the fix if Drawing Rate underperforms. | M / L-M | Badges are Phase 3. Any Phase 1/2 badge proposal is a scope-boundary violation requiring deliberate re-decision, not a natural extension. |
| **R30** | **Album reopens the cut video generation** piecemeal — "just a simple collage," "just a short highlight reel" — once Album looks plain next to Instagram. | M / L | Re-state the video-generation cut **inside Album's own milestone acceptance criteria**, so it isn't quietly reopened by a plausible-sounding small request. |

### 3.10 Watch list — instrument from Milestone 0

These are not yet risks; they are the earliest tells for the risks above.

- **Confirm-rate trend per user and per Circle** → earliest tell for K1.
- **Founder-hours/week on KYC + moderation + disputes** → earliest tell for K3.
- **Any "my Drawing Rate is wrong" complaint** → even one matters, given K2's viral downside.
- **Weather/safety exemption rate per group** → a group claiming it every time is R19/K2 in action.
- **Supabase peak concurrent connections** (not user count) → the real budget wall.
- **Resend daily send count** against the 100/day free-tier cap during launch spikes.
- **Time from KYC submission to decision** (Phase 2) → tells you founder capacity, not organizer demand, is the growth bottleneck.

## 4. Features (Phase 4 — 2026-08-12, remediated after validation 2026-08-13)

> Feature IDs below are the canonical specification. `.spark/milestones.md`
> references these IDs and adds nothing not defined here.

### 4.0 Resolved design questions

**Navigate.** Phase 1 has **no Navigate tab** — there is no public corpus to
browse. Phase 1's home surface is HOME-1. Navigate ships in Phase 2 as
**feed-first**, with an **opt-in Discover swipe deck (TikTok convention, swipe up =
next) that is save-only and can never transact**, completing decision 2.

**Drawing Rate visibility (decision 73).** In Phase 1, a score is visible to
**members of Circles you share** — not to the world. Decision 34's "fully public"
is **scoped, not reversed**: it applies from Phase 2, when profiles have an actual
audience. This resolves the decision 34 × decision 58 collision, where "public" had
no implementation surface.

> ⚠️ **Correction 2026-08-13: this does NOT mitigate R2.** An earlier draft claimed
> it did. R2 is specifically that *the first people to hold permanently visible
> reliability scores on each other are office colleagues*. **The beta cohort is the
> office Circle.** Circle-scoping protects users from strangers; it does nothing for
> the exact cohort R2 names. R2's real mitigation remains instrumentation — watch
> account deletions and profile-visibility complaints from the office cohort
> (ADM-5) — and that is a watch, not a fix.

**Badges.** Closed set of 6, Phase 3. No organizer-awarded and no admin-awarded
badges. A 7th requires a new `decisions.md` entry (R29's written boundary).

**Album.** Phase 3 only. Client-side composed; **video generation stays cut (R30)**
and must be re-stated in Album's own acceptance criteria.

**Magic Bunot.** Server-side CSPRNG draw in an Edge Function, never client-computed;
result auto-posts as an **immutable** system message so it is witnessed; no re-draw;
**no monetary or prize-value field anywhere** (R17 tripwire).

**Kris Kringle / Monito Monita.** Raised, deferred by founders (decision 77).
Logged as a strong seasonal-acquisition candidate, not lost.

---

### 4.1 December closed beta — feature specification

**Scope note:** this is the December closed-beta scope (decision 76), not full
Phase 1. Features deferred to the public launch are listed in §4.2.

#### Platform & infrastructure

| ID | Feature | Acceptance criterion |
| --- | --- | --- |
| INF-1 | Expo + Supabase scaffold, CI (lint/typecheck/test) | CI blocks a deliberately failing PR from merging. |
| INF-2 | `.env` structure, migration tooling | A schema change applies via migration on a clean database and is reversible. |
| INF-3 | **Web target** (Cloudflare Pages — free, already in the vendor family) | A deployed web route is reachable at the project domain over HTTPS. |
| INF-4 | **Scheduled-job infrastructure** (`pg_cron` or scheduled Edge Functions) | A test job scheduled for T+2min executes and records its run; a deliberately failing job surfaces an error rather than failing silently. |
| INF-5 | Sentry + **PII scrubbing** | A test event containing an email and phone number arrives in Sentry with both **redacted, not plaintext**. |
| INF-6 | PostHog + event schema | The **repeat-join funnel renders correctly from seeded fixture data** — not merely "an event was received." |
| INF-7 | Expo Push | A push delivers to a physical device within 10s in the test environment. |
| INF-8 | Resend transactional email | A password-reset email delivers a working link within 2 minutes. |
| INF-9 | R2 storage, three access-distinct locations (general / receipts / verification docs) | Provisioned at M0 though only "general" is used in beta; **verified by a denied read attempt** against each restricted location, not by inspection. |
| INF-10 | Supabase billing alert | Configured at **$40** and verified in dashboard config. Deliberately set at $40, not $35, so it does not fire during normal operation — an alert that fires routinely gets ignored. |

#### Security controls (load-bearing, not checklist)

| ID | Feature | Acceptance criterion |
| --- | --- | --- |
| SEC-1 | **Deny-by-default RLS** on every table | A newly created table with no explicit policy is unreadable and unwritable by `anon` and by an authenticated non-owner. |
| SEC-2 | **Negative-authorization test suite in CI — blocks merge** | For every table: user A cannot read or write user B's rows; `anon` cannot read anything not explicitly public; admin-only tables reject a non-admin session. Suite runs on every PR and **fails the build** on violation. |
| SEC-3 | **Key segregation** | Automated check asserts the Expo bundle contains only the Supabase `anon` key; presence of a `service_role` key fails CI. |
| SEC-4 | **`security_invoker` on all views** | Automated check asserts every view is defined `WITH (security_invoker = true)`; a view without it fails CI. (Postgres views bypass RLS by default — named explicitly in K5.) |
| SEC-5 | **RLS policy review — human, scoped, twice** | Review 1 after M2 (auth/profile/Circle schema). Review 2 after M7 and **before beta submission**, covering the attendance audit log, flag queue and admin surface. Findings logged in `decisions.md`. See §5 for budget and the critical-path decision. |
| SEC-6 | Chat concurrency load test | ≥300 simulated concurrent connections **with a specified message rate**, asserting p95 delivery <2s, zero dropped messages, and the observed Supabase peak-connection and cost figures recorded as the dashboard baseline. |

#### App shell, information architecture & design system

> Previously owned by no milestone at all (validator issue 6). Now explicit.

| ID | Feature | Acceptance criterion |
| --- | --- | --- |
| SHELL-1 | Tab navigation + routing + deep-link handling | Every primary surface is reachable by tab and by deep link; a cold-start deep link lands on the correct screen. |
| SHELL-2 | **Design system foundations** — the two-language split (decision 25) | Tokens, typography, spacing and component primitives exist in code, with Airbnb-bones and Duolingo-soul variants documented and applied to at least one screen each. |
| SHELL-3 | Empty, loading and error states | Every primary surface renders a designed empty state, a loading state, and an error state — verified screen by screen, not assumed. |
| SHELL-4 | Dark mode | Toggle persists across restart and applies to all primary screens with no mixed-theme screen. |
| HOME-1 | Home tab | Lists every event across the user's Circles sorted by soonest upcoming, with the Drawing Rate card at top. **No Navigate or Discover tab exists in this build.** |
| PROF-1 | Profile screen | Own profile shows name, nickname, avatar, city, Drawing Rate card and streak; another member's profile is viewable only if a Circle is shared (decision 73), and returns not-found otherwise. |
| SET-1 | Settings | Contains account deletion, dark mode, notification preferences, and links to ToS and Privacy Policy. |
| NOTIF-1 | Notifications surface | In-app list of notifications with read/unread state, populated by the same events that trigger pushes. |

#### Accounts

| ID | Feature | Acceptance criterion |
| --- | --- | --- |
| AUTH-1 | Google Sign-In | New user completes signup in ≤3 taps and lands on onboarding; returning user authenticates without re-entering credentials. |
| AUTH-2 | Sign in with Apple | Present on the same screen as Google in the iOS build. Its absence is a release-blocking checklist item. |
| AUTH-3 | Email auth | Account created, confirmed via emailed link, session persists across app restart. |
| AUTH-4 | **Age gate with logged affirmation** (R16) | A birthdate under 18 blocks account creation; the affirmation record (birthdate, affirmation, timestamp, user id) lands in an immutable admin-queryable table. |
| AUTH-5 | In-app account deletion | Account and PII removed or anonymized per the §5 retention schedule; verified by querying for residual rows. |
| AUTH-6 | **Web account deletion** (store hard requirement, decision 50) | A user who has uninstalled the app reaches the published URL, authenticates, and submits a request entering the same pipeline as AUTH-5. |
| AUTH-7 | Profile editing | Field changes are visible to Circle co-members immediately. |

#### Circles

| ID | Feature | Acceptance criterion |
| --- | --- | --- |
| CIRC-1 | Create Circle, group chat auto-created | Creator names a Circle; chat exists and creator is Leader with zero extra taps. |
| CIRC-2 | Link invite | A user opening a valid invite link joins the Circle and its chat in one flow; an expired or revoked link fails cleanly. |
| CIRC-3 | Leader delegate for QR display | Leader designates a delegate for one event before it starts; only that delegate's device is authorized to display that event's QR, and only for that event. |
| CIRC-4 | **Circle category tag** (added by decision 95) | Optional category from the fixed event-category list, set at Circle creation. Feeds the Frida badge trigger (BADGE-1) and pre-positions the category field Phase 2's Navigate feed already assumes (NAV-1). |

#### Polls (added by decision 90 — recovers ideation §6.3)

| ID | Feature | Acceptance criterion |
| --- | --- | --- |
| POLL-1 | Create poll | Leader (or any Circle member) posts a question with 2+ options into Circle chat. |
| POLL-2 | Vote | Each member casts exactly one vote; changing a vote replaces it, not adds to it. Live tally visible to all members. |
| POLL-3 | Close + auto-populate event | Closing the poll (manual, by the creator) **pre-fills a new event's title and description** with the winning option's text; the Leader can edit before finalizing. A tie is resolved by the poll creator picking manually. |

#### Private events

| ID | Feature | Acceptance criterion |
| --- | --- | --- |
| EVT-1 | Create private event | Title, **start date/time, and end date/time (or duration — defaulting to 4 hours)**, location text + address, description. Appears in the Circle's event list immediately. **The end time is `T` — the anchor for ATT-1, ATT-5, ATT-6, ATT-8 and §4.5's cancelled-vs-abandoned distinction.** Five features and the canonical state machine depend on it; it was previously absent from the event model. |
| EVT-2 | Confirm / decline | State updates in the attendee list instantly and is the input to all scoring. |
| EVT-3 | **Finalize** | The **only** trigger that starts Drawing Rate tracking and generates the check-in QR. Before finalize, no attendance data is collected. Owned by M4, not M3. |
| EVT-4 | Cancel with reason | Reason required from a fixed list. The reason is **persisted with an `exempt` boolean**; scoring behaviour is asserted in M6, not here. |
| EVT-5 | Open in external maps | Venue address opens Google Maps or Waze via deep link. No in-app map. |

#### Chat

| ID | Feature | Acceptance criterion |
| --- | --- | --- |
| CHAT-1 | Circle group chat | Satisfied by CIRC-1. Messages deliver to all members within 2s under normal connectivity. |
| CHAT-2 | Direct messaging | Available only between users sharing a Circle; delivery within 2s. |
| CHAT-3 | System messages | Immutable, non-editable, non-deletable message type used by Magic Bunot and event lifecycle events. |

#### QR check-in

> **Spec corrected after validation (issue 12).** The offline device does **not**
> validate. The member's device records `(code_seen, timestamp)` and queues it;
> the **server** validates at sync. Only the Leader's device holds the per-event
> seed, issued online at finalize.

| ID | Feature | Acceptance criterion |
| --- | --- | --- |
| QR-1 | Leader-displayed rotating QR | Leader's device holds a server-issued per-event seed; code = `HMAC(seed, time_bucket)`, rotating on a short interval. A screenshot older than one rotation fails server validation. |
| QR-2 | Member scan | Scan records `(code, timestamp, monotonic clock reading)` locally. |
| QR-3 | Offline queue + deferred sync | A scan made in airplane mode is queued and auto-submitted on reconnect **without re-scanning**; the server validates the code was valid **at the recorded timestamp**, not at sync time. |
| QR-4 | **Clock-manipulation forensics** (downgraded 2026-08-13 — see note) | The device records boot-uptime alongside wall-clock time with each scan, and the server **flags** implausible (wallclock, uptime) pairs on sync for Leader review. **Detection is not claimed.** True detection requires paired baseline samples captured while online plus a native module (a dev build, not Expo Go) — not affordable inside a 1.0 FTE-week milestone. **The residual risk is accepted and recorded in `security.md` §5.** The earlier AC ("rejects inconsistent scans") was not buildable as written and would have been marked passed without being true. |
| QR-6 | **Non-confirmed scans are refused** | A user who has not confirmed cannot check in (decision 42). Their scan is rejected with a clear message, and they do **not** appear on the scan-derived list in ATT-1/ATT-2 — so their absence is never counted as a discrepancy. The Leader may still add them via ATT-7 as a walk-in, which scores nothing. |
| QR-5 | **Leader self-check-in** | The Leader (or delegate) displaying the QR can record their own attendance without scanning their own device. Undefined previously; would have broken on the first real event. |

#### Attendance & trust mitigations (K2/R4 — non-negotiable)

| ID | Feature | Acceptance criterion |
| --- | --- | --- |
| ATT-1 | Leader post-event confirmation | Scan-derived list presented after event end; each member set to **present / absent / excused** in ≤2 taps. **Excused requires a reason**, logged in the ATT-3 audit trail. Restores the fourth mitigation `project.md` §14 requires for a visible score — without it, a Leader's only way to be kind to a genuinely sick member is to mark them falsely present, filling the audit log with edits indistinguishable from the manipulation ATT-2/ATT-3 exist to detect. |
| ATT-2 | **Member-visible scan-vs-final comparison** | Every participant can view the scan-derived list beside the Leader's final list; **any discrepancy is visibly flagged — never silent.** |
| ATT-3 | **Leader edit audit log** | Every edit records old value, new value, editor and timestamp in a **never-deleted** table. A Leader's edit to their **own** attendance is logged distinctly and surfaced to members (validator issue 4d). |
| ATT-4 | **Flag this record** | Produces an admin-queue ticket containing event id, member id, disputed value and the full edit history. Correctness asserted, not just latency. |
| ATT-5 | **Provisional-then-final attendance window** | Attendance is **provisional until T+72h**. Late-syncing scans within the window auto-correct absent→present, notify both parties, and log the correction. After the window, a late scan opens an admin-queue item rather than silently mutating a published score. |
| ATT-6 | Leader reminder | Fires at the **close of the provisional window**, not T+4h. The earlier T+4h design actively fought the offline-first requirement (validator issue 4a) by driving finalization before offline scans could sync. One reminder, not repeated. |
| ATT-7 | Walk-in add | Leader may add a non-confirmed attendee. **Walk-ins count for headcount and the recap card only — never for score.** See §4.5. |
| ATT-8 | **Auto-resolution if the Leader never confirms** | At T+7d an unconfirmed event resolves from scans alone. If zero scans exist it resolves as did-not-push-through, and the Leader is notified **before** it lands. |

#### Drawing Rate

| ID | Feature | Acceptance criterion |
| --- | --- | --- |
| DR-1 | Individual Drawing Rate | Per §4.5 state table. Fixture: 10 confirmed over 6 months with 3 no-shows → 30%; an 8-month-old no-show is excluded from **both** numerator and denominator. |
| DR-2 | Show-up record + streak | Streak increments on consecutive attended events, resets on a confirmed no-show, **unchanged by walk-ins**. |
| DR-3 | Group Drawing Rate | Finalized-not-pushed-through ÷ finalized, rolling 6 months, exempt cancellations excluded. Fixture: 5 finalized, 1 weather-cancel, 1 backed-out-cancel → exactly 1 non-exempt failure of 5. |
| DR-4 | Cancelled-event handling | Per §4.5. **If any check-in exists, the event is treated as held**, not cancelled. |
| DR-5 | Minimum-events threshold (N=3) | Below 3 confirmed-and-resolved events the profile reads "no track record yet." **Additional AC: a user who attends 10 events without ever confirming still reads "no track record yet."** |
| DR-6 | Three-layer display | Default shows tier label + mascot with **no visible percentage**; tap reveals the exact figure; streak is visible without tapping. |
| DR-7 | Share card | Client-side generated, no server round-trip. **Carries the positive stat** (streak, "12 of 14 showed up") — not the flake percentage, which is what produces K2 backlash. |
| DR-8 | Circle-scoped visibility (decision 73) | A user's Drawing Rate is retrievable only by members of a shared Circle; a request from a non-co-member returns not-found. **Asserted in the SEC-2 negative-authorization suite.** |
| RECAP-1 | Event recap card | On event completion, any attendee exports a stats-only recap image (event name, date, Circle, attendance summary) to the native share sheet with no server round-trip. **The attendance summary is AGGREGATE COUNTS ONLY — no individual names, no individual attendance status.** "14 of 16 made it" is shareable; "Maria didn't show" is not. Without this, any attendee could publish a colleague's no-show to Facebook — the exact disclosure decision 73 narrowed, in the exact cohort R2 names. |

#### Badges (moved from Phase 3 into the beta — decision 91, supersedes decision 60)

> Canonical list: `SponTRIP_Badge_System.md`. That document **is** the written
> boundary (R29) — any badge beyond it needs a new `decisions.md` entry. Founder
> owns artwork for all ~26 badges; delivery **before** this milestone's UI work
> begins, same pattern as the mascot-before-M6 dependency.

| ID | Feature | Acceptance criterion |
| --- | --- | --- |
| BADGE-1 | Badge data model + unlock engine | All 26 badges from the three defined collections (Onboarding, Circle Achievement, No-Show/Drawing) unlock correctly against seeded fixture data — at least one verified per collection. **No-show badges do not unlock below Drawing Rate's 3-event minimum threshold** (decision 92a), verified by fixture. Frida unlocks when a Circle's category (CIRC-4) isn't already used by another Circle its creator belongs to. |
| BADGE-2 | Badge collection page | Browsable by collection (Onboarding / Circle / Drawing — the doc's other named collections have no concrete badges yet and are not built). Locked badges show a plain-language unlock hint; unlocked badges show their art. |
| BADGE-3 | Profile badge pinning | A user pins exactly 2–3 badges as "featured" on their profile; a 4th pin attempt is rejected. |
| BADGE-4 | Visibility split (decision 92b, 93) | Onboarding + Circle Achievement badges are visible on the global profile. **No-show/Drawing badges are Circle-scoped**, following decision 73 — asserted in the SEC-2 negative-authorization suite alongside DR-8. |

#### Check-in photo template (recovers ideation §9.2, decision 96)

| ID | Feature | Acceptance criterion |
| --- | --- | --- |
| CHECKIN-1 | Ephemeral share card | User picks a photo from camera or library, composes it against a founder-designed template **entirely on-device**, and shares via the native share sheet. **No network request occurs during composition** — verified directly, since this is what keeps it out of the moderation/UGC surface RECAP-2 was deferred to avoid. The photo is never uploaded or stored. |

#### Recurring events (added 2026-08-13 — decisions 101–110)

> Built as an auto-recreate convenience, not a series/occurrence model: each
> occurrence is a fully normal event that reuses the entire existing EVT/QR/ATT/DR
> pipeline. Editing one occurrence never affects another. This is what keeps the
> feature cheap.

| ID | Feature | Acceptance criterion |
| --- | --- | --- |
| RECUR-1 | Create recurring series | At event creation, Leader optionally sets an interval: Daily / Weekly (day-of-week multi-select, e.g. Mon+Wed+Fri) / Bi-Weekly / Monthly / Bi-Monthly / Quarterly / Annually. No end-date or occurrence-count option in the beta — recurs until manually stopped. |
| RECUR-2 | Auto-generate next occurrence | A scheduled job (reusing INF-4) creates the next occurrence, pre-filled from the previous one, once the current occurrence resolves. Members are notified. |
| RECUR-3 | Per-occurrence editing + stop | Leader edits any single occurrence without affecting past or future ones. A "stop recurring" action ends the series; already-generated occurrences are unaffected. |
| RECUR-4 | Optional decline reason | Declining **any** event (recurring or one-off) offers an optional free-text reason. Not required — see decision 105 for why. |
| RECUR-5 | Zero-response occurrence resolution | An occurrence that is never finalized (nobody engaged) expires with **no group or individual Drawing Rate impact** (decision 106, consistent with decision 35). A Leader-finalized occurrence that then falls through follows ordinary DR-3/DR-4 rules — no new logic. |

#### Reason Rate (added 2026-08-13 — decision 102, the "fun fact" version)

| ID | Feature | Acceptance criterion |
| --- | --- | --- |
| REASON-1 | Most common reason | Profile shows a purely descriptive fact aggregated from RECUR-4's optional reason text (e.g. "Most common reason: 'stuck in traffic' — 4 times"). **No numeric score, no ranking, no peer visibility of individual instances.** Circle-scoped visibility, matching BADGE-4 (decision 107). |

#### Magic Bunot

| ID | Feature | Acceptance criterion |
| --- | --- | --- |
| MB-1 | Create Bunot | Started from chat, named, with a participant pool selected from current members. |
| MB-2 | Server-side draw + auto-post | CSPRNG draw in an Edge Function; winner and participant list post as an **immutable system message (CHAT-3)** within 3 seconds, identical for all members. |
| MB-3 | No re-draw, no stakes | A completed Bunot exposes no redraw action; the create form contains **no monetary or prize-value field anywhere** (R17). |

#### Trust & safety, and the minimal admin slice

> The **full** admin console is deferred to public launch (§4.2). This is the
> minimum required to operate a closed beta and satisfy store UGC obligations.

| ID | Feature | Acceptance criterion |
| --- | --- | --- |
| TS-1 | Report user/content | Report reaches the admin queue with reporter, reported party and reason. |
| TS-2 | Block user | Blocked user's content disappears for the blocker and cannot reach them via DM. |
| TS-3 | Kick from Circle | Removed member immediately loses Circle chat and event access, and is notified. |
| ADM-1 | Admin auth + role | Admin role is server-side only and cannot be granted or self-assigned from any client path. **Asserted in the SEC-2 suite.** |
| ADM-2 | Report queue | Open reports listed newest-first; resolution logs the deciding admin and timestamp. |
| ADM-3 | Attendance-flag queue | Shows the disputed record, the Leader's full edit history, and an override action with its own logged trail. |
| ADM-4 | User search + suspend | A suspended user's next login attempt is blocked. |
| ADM-5 | Beta watch-list dashboard | Shows, refreshed at least daily and without a manual DB query: **confirm-rate trend** (K1's tell) · **weather/safety-exemption rate per Circle** (R19/K2's tell) · **Supabase peak concurrent connections** (R9's tell) · **count of "my Drawing Rate is wrong" flags** (K2's tell — §3.10 says even one matters) · **excused-absence rate per Circle** (so ATT-1's excused state doesn't become a new self-reported escape hatch). |
| ONB-1 | **Onboarding flow** | Previously referenced by AUTH-1 and M8 but defined nowhere. A new user completes a first-run sequence — welcome, what Drawing Rate is and how it is calculated, notification permission priming — and lands on Home. **Must explain the scoring rules plainly**, because a reputation mechanic users don't understand is one they don't trust (K2). |

---

### 4.2 Deferred to public launch (built after the December beta)

**RECAP-2** (event photo upload + photo-composed recap cards, decision 68 —
**distinct from CHECKIN-1**, which is ephemeral and ships in the beta; RECAP-2 is
the persisted, gallery-based version and stays deferred) ·
Email notification breadth beyond AUTH flows · **onboarding interest capture**
(powers nothing until Phase 2's feed; the validator correctly flagged it as data
collected with no purpose — a data-minimization wrinkle under RA 10173 and an
activation cost on a product whose primary metric is activation) · **full admin
console** (event takedown, richer moderation tooling, operational analytics) ·
**live location** (LOC-1…6 — deferred to Phase 2 with the cohort it was designed
for, decision 74) · app colour personalization · Kris Kringle variant (decision 77).

### 4.3 Phase 2 — rides + diving cohort

Hubs + Hub Admin role · KYC submission, admin approval queue, **auto-deletion of
raw documents within 72h** and the **always-zero stale-document dashboard count**
(R13) · public events · **feed-first Navigate + interest ranking + opt-in
save-only Discover + bookmarks** · **form builder limited in writing to 4 field
types — text, single-select, file upload, certification dropdown; no conditional
logic, no custom validation scripting** (R27) · itemized fees, **segregated
receipt storage** (R12), organizer verification, **persistent non-party disclaimer
on every event carrying a fee** · waitlist with a 2h confirmation window ·
**registrant list with no Drawing Rate sort or filter control** (R1, verified by UI
audit) · bulk scanning · attendee list · **live location** (LOC-1…6, incl. R3's
silent-by-default notifications and the anonymous web surface) · Drawing Rate
visibility widens from Circle-scoped to public (decision 34 takes effect here).

### 4.4 Phase 3 — later

Album (3 pages, client-side, **video generation remains cut — R30**) · badge
system v1 (closed set of 6) · ratings and evaluation forms · organizer analytics ·
automated moderation tooling (deferred, no milestone — R20 remains a medium-term
platform risk).

---

### 4.5 Drawing Rate state machine — CANONICAL

> Remediates validator issues 3 and 4. Previously the walk-in rule contradicted
> decision 42 and was arithmetically capable of producing a show-up rate above
> 100%; four state transitions were undefined.

#### Scoring by attendance state

| State | No-show numerator | Show numerator | Denominator | Streak |
| --- | --- | --- | --- | --- |
| Confirmed + present | 0 | +1 | +1 | +1 |
| Confirmed + absent | +1 | 0 | +1 | reset |
| **Confirmed + excused** (decision 86) | 0 | 0 | **0** | **preserved, not incremented** |
| **Not confirmed + present (walk-in)** | 0 | **0** | **0** | **no change** |
| Not confirmed + absent | 0 | 0 | 0 | no change |
| **Any state, exempt-reason cancellation** (decision 87) | 0 | +1 if checked in, else 0 | +1 if checked in, else 0 | +1 if checked in |

**Excused** is Leader-set with a required reason (ATT-1), logged in the audit trail
(ATT-3), and its per-Circle rate is surfaced on the admin dashboard (ADM-5) so it
cannot quietly become the new self-reported escape hatch — the same failure mode
R19 identifies for the weather exemption. Excused events do **not** count toward
DR-5's three-event display threshold, since they contribute no denominator.

**Walk-ins exist for headcount and the recap card only.** Giving them show-credit
would make never-confirming *strictly dominant* — attend, get added, earn streak,
carry zero risk — which amplifies K1 rather than blunting it. This is what
decision 42 exists to prevent.

**Verifying AC:** a user who attends 10 events without ever confirming still reads
**"no track record yet."**

#### Undefined states, now defined

**(a) A scan syncs after the Leader finalized.** Attendance is **provisional until
T+72h** (ATT-5). Late scans inside the window auto-correct absent→present, notify
both parties, and log it. After the window, a late scan opens an admin-queue item
rather than silently mutating a published score. The Leader reminder (ATT-6) fires
at the **close** of the window, not T+4h — the earlier design drove finalization
before offline scans could plausibly have arrived.

**(b) The Leader never runs the attendance step.** At T+7d the event auto-resolves
from scans alone (ATT-8). Zero scans → resolves as did-not-push-through, with the
Leader notified **before** it lands.

**(c) Cancel with partial attendance.** **If any check-in exists for an event, it
is treated as held** — attendees credited — and the group failure is applied
separately per the cancellation reason. Cancelled-before-start and
abandoned-at-or-after-start are distinct.

**Individual penalties apply only when the cancellation reason is NON-EXEMPT
(decision 87, amending decision 39).** Attendees receive show-credit either way.

*Why this carve-out exists:* without it, four people scanning at a ride's meetup
point before a storm rolls in would make the event "held," and the six who
prudently stayed home would take individual hits for a **weather** cancellation.
That contradicts decision 39 outright and, more seriously, decisions 29/32's
safety-critical principle — **the mechanic must never make calling off a ride or
dive in bad conditions the expensive choice.** Low stakes for the office beta
cohort; a genuine safety issue for the Phase 2 rides and diving cohort, and the
rule is being written now.

The case that motivated (c) — ten confirm, three show, Leader cancels citing
"everyone backed out" — is a **non-exempt** reason and is still correctly
penalised. The narrower rule keeps the fix and drops the harm.

*Why this matters:* under the previous rule, ten confirm, three show, Leader
cancels citing "everyone backed out" → the seven no-shows took **no** hit and the
three who showed got **no** credit. That is the canonical "puro plano lang"
scenario and the mechanic rewarded the flakes. It also handed the Leader a lever to
shield friends from individual penalties by cancelling.

**(d) The Leader's own attendance.** Scan-derived where a delegate displays the QR.
Where the Leader displays it, QR-5 lets them record their own attendance without
self-scanning — and **any Leader self-edit is logged distinctly and surfaced to
members** alongside the discrepancy view (ATT-3). Founder rule 5 (the Leader takes
the individual hit for not attending) previously had no enforcement mechanism at
all, which is K2 in its purest form.

#### Event lifecycle — when a score actually moves

`T` = the event's **end time** (EVT-1).

| State | Trigger | Score visible? |
| --- | --- | --- |
| Draft | created | no tracking at all |
| **Finalized** | EVT-3 | tracking starts; QR generated |
| Held | start time passes, or any check-in exists | — |
| **Provisional** | from `T` until `T+72h` | **no — profile shows "1 event pending"** |
| **Resolved** | at `T+72h`, or at Leader confirmation if later corrections are impossible, or at `T+7d` via ATT-8 | **yes — the score moves once, here** |
| Cancelled | EVT-4 before start, no check-ins | excluded per §4.5(c) |

**Scores move only on resolution.** A member's public number never changes twice
within 72 hours, and the profile shows "1 event pending" during the provisional
window. This removes the screenshot-of-a-changing-number problem, which matters on
a product whose credibility dies in one screenshot (K2). DR-5's
"confirmed-and-**resolved**" threshold counts resolved events only.

**Edit precedence during the provisional window.** A late-syncing scan is
**evidence**; a Leader edit is a **judgement**. A scan arriving after a Leader has
marked someone absent auto-corrects to present and notifies both parties (ATT-5).
The Leader **may** re-edit, but doing so overrides physical evidence, so it is
logged distinctly, surfaced to the affected member, and counted in ADM-5. Last
write wins on the record; the audit trail preserves the whole sequence.

#### What rotation actually buys — approve this knowingly

**Rotation raises the cost of casual cheating. It does not resist a colluding
Leader, a colluding present member, or device clock manipulation in the offline
path. The Leader's attendance confirmation is the actual control.**

For a beta cohort of office colleagues with no money at stake, casual cheating is
realistically the only threat, so rotation is worth having — at roughly three days,
not two weeks. It must never be described to users as a guarantee, because K2's
credibility failure is exactly what happens when users discover the limits
themselves.

---

### 4.6 Milestones — summary

Full detail with acceptance criteria in `.spark/milestones.md`.

| # | Milestone | FTE-wk | Retires |
| --- | --- | --- | --- |
| M0 | Scaffold, security baseline, CI negative-auth suite, web target, scheduled jobs | 2.0 | R9, R11, R12, partial K5/R23 |
| M1 | App shell, IA, design system, auth, both deletion paths | 2.5 | R16, decision 50, validator issue 6 |
| M2 | Circles + **RLS review 1** | 1.0 | K5 (first pass) |
| M3 | Private events, chat, notifications, T&S | 2.5 | R9 (load test) |
| M4 | QR check-in (corrected spec) + finalize | 1.0 | R7, R8, R26 |
| M5 | Attendance + K2 trust mitigations | 1.5 | **K2**, R4 |
| M6 | Drawing Rate + recap card | 1.5 | makes K1 observable |
| M7 | Magic Bunot + minimal admin slice + **RLS review 2** | 1.5 | R28 (partial), K5 (second pass) |
| **M8** | **Poll, badge system, check-in template, recurring events** (decisions 90–110) | **6.5** | R29 (badge boundary), recovers ideation §6.3 + §9.2 |
| M9 | Beta launch prep + store gates | 1.5 | R6 |

**Total: 21.5 FTE-weeks** (was 15.0 at Gate 1 presentation, then 19.5 after the
first addition, now 21.5 after recurring events + Reason Rate — decision 109).
"The December closed beta" is now a name, not a date: the milestone content stays
the same, but December itself is no longer reachable at any capacity scenario
below. See §4.7 and decisions 99, 110.

### 4.7 Capacity model and timeline honesty

> Remediates validator issue 2. Previously the plan quoted 16 "weeks" without ever
> stating what a week meant in effort.

**An FTE-week is 40 hours of work, not one calendar week.** AI-assisted development
compresses typing — not decision-making, testing, credential plumbing, or debugging.

Founders report capacity **varies week to week** (decision 71). The plan is computed
against **20 combined productive hours/week** as a working midpoint, with the
sensitivity exposed rather than hidden. **Updated 2026-08-13, second time** — a
follow-up addition (recurring events + Reason Rate, decisions 101–110) added a
further 2.0 FTE-weeks on top of the 19.5 already recorded from the first addition:

| Combined capacity | 21.5 FTE-weeks becomes | Beta lands |
| --- | --- | --- |
| 30 hrs/week | 29 calendar weeks | **early March 2027** |
| 25 hrs/week | 34 calendar weeks | **early-mid April 2027** |
| **20 hrs/week (planning assumption)** | **43 calendar weeks** | **mid-June 2027** |
| 15 hrs/week | 57 calendar weeks | **mid-September 2027** |

**December remains out of reach, and the gap has widened.** Even the fastest row
(30 hrs/week sustained) now lands in early March — three months past the original
target, not two. Chat (~2.5 FTE-weeks) was flagged as the largest compressible item
when the total was 15.0; founders re-confirmed keeping it (decision 89), and this
second addition was accepted on the same "log it honestly, don't trade scope"
basis (decision 98) rather than reopening that call.

**The seasonal case for December is gone, and that was the actual reason for the
date (decision 99).** "Hold December, narrow scope" (decision 72) existed to land
inside Philippine office Christmas-party season for the launch cohort. At every
row above, delivery lands well after that season ends. This was stated to the
founders directly, twice now (decisions 99 and 110); they chose the added scope
over the date both times.

**No contingency is included in the 21.5.** For a first-time team on a first
product — with M0's own note warning that first-timers routinely lose days on
console and credential work — a 20% buffer would put this at **~25.8 FTE-weeks /
~52 calendar weeks at the assumption**. The sensitivity table above is currently
doing double duty as contingency. Founders should treat the 20 hrs/week row as the
realistic case, not the pessimistic one.

**⏱ Checkpoint — CALENDAR-ANCHORED, not milestone-anchored.** M0–M3 (8.0
FTE-weeks = 320 hours) is unaffected by either scope addition — it still completes
around calendar week 16 at the planning assumption. **At calendar week 8, compare
hours actually burned against 160.** Under by 20% or more, the mid-June target is
already slipping — say so then, openly, while it can still change something. (The
original purpose of this checkpoint — protecting a December date — no longer
applies; see above. The mechanism is kept because early visibility into slippage is
useful regardless of what date it's measured against.)

**External calendar time that is not build time**, and must run in parallel from
week 1: Google Play's **12 testers opted in for 14 continuous days** (mandatory for
a new personal developer account before production), Apple Developer enrolment, and
Apple review round-trips at public launch.

---

## 5. Security requirements

> Mirrored into `.spark/security.md`, which is the operational source of truth.
> Remediates validator issue 10.

### 5.1 Non-negotiable controls

1. **Managed auth only.** No hand-rolled session logic, password handling, or token
   juggling.
2. **Deny-by-default RLS on every table** (SEC-1).
3. **Negative-authorization test suite in CI, blocking merge** (SEC-2). This is the
   highest-leverage affordable control for this team: it is free, recurring, runs on
   every PR, and targets R23's "small diff that quietly grants a permission"
   directly. Its earlier absence was the single largest gap in the posture.
4. **Key segregation** — only the `anon` key ships in the client (SEC-3).
5. **`security_invoker` on all views** (SEC-4) — Postgres views bypass RLS by default.
6. **RLS reviews** (SEC-5) — **downgraded from hard gate to recommendation at
   Gate 1 (decision 112).** Founders may self-review policies after M2 and
   after M7 at no cost; this is now optional and does not block either
   milestone. The mandatory control against R23 remains #3 above (SEC-2, CI
   negative-authorization suite), unchanged.
7. **PII scrubbed from error payloads** (INF-5).
8. **Storage segregation verified by denied-read test**, not inspection (INF-9).
9. **Every change touching auth, RLS or admin surfaces requires an explicit "what
   does this permit that it didn't before" summary** at the review gate (R23).

### 5.2 Data classes and retention

| Class | Examples | Phase | Retention |
| --- | --- | --- | --- |
| Account PII | name, nickname, email, city, avatar | Beta | Life of account; removed or anonymized on deletion (AUTH-5/6) |
| Age affirmation | birthdate, affirmation, timestamp | Beta | Immutable, retained for compliance evidence (R16) |
| Behavioural | events, confirmations, scans, scores | Beta | Rolling 6 months for scoring; audit log never deleted |
| Attendance audit log | Leader edits, old/new values | Beta | **Never deleted** — it is the K2 dispute evidence |
| Location | live location shares | **Phase 2** | Purged within 1h of event end |
| Payment receipts | GCash/bank screenshots | Phase 2 | Segregated bucket; organizer + admin only (R12) |
| Verification docs | gov ID, selfie | Phase 2 | **Deleted within 72h of decision**, with an always-zero stale-document dashboard count proving the job ran (R13) |

### 5.3 Known accepted risks

- **Rotation is not an anti-cheat guarantee** (§4.5). Documented, approved knowingly.
- **Supabase Pro provides 7 days of daily backups; point-in-time recovery is a
  ~$100/month add-on that would break the ceiling alone.** The accepted data-loss
  window is therefore **up to 24 hours**, pre-revenue.
- **R2 has no RLS.** Photo access control lives in imperative Edge Function code
  that mints presigned URLs — the one traced-code-path in a stack chosen to avoid
  them. Low stakes in beta (avatars only), **high stakes in Phase 2** (receipts,
  government IDs). The design is set at M0; revisit before Phase 2.
- **The AI coding tool is an unmitigated single point of failure** (R24).

### 5.4 Phase 2 hard gate

Before any **real** (non-test) KYC data flows in production, both must be complete
and logged in `decisions.md`: the **legal documents** and the **paid third-party
security audit**. A feature flag keeps real KYC submission disabled until both are
checked off.

---

## 6. Founder responsibilities

> Every cost is an **estimate — to be confirmed before commitment.**

| Item | Est. cost | Deadline |
| --- | --- | --- |
| **Google Play Developer account** | ~$25 one-time | **START THIS WEEK.** 12 testers × 14 continuous days is mandatory before production on a personal account. Organization accounts are exempt but need a D-U-N-S number with its own lead time. **Decide account type now.** |
| **Apple Developer Program** | ~$99/yr | **M0 — not "before beta."** Sign in with Apple, Expo Push on iOS, and any EAS iOS build all depend on it. |
| Domain name | ~$12/yr | M0 (needed for AUTH-6 and the privacy policy URL) |
| Google Cloud OAuth app | Free | M0 |
| RLS review 1 + 2 (SEC-5) | $0 (optional) | **Downgraded to recommendation (decision 112) — no longer blocks M2 or M7.** Founders may self-review RLS policies after each milestone at no cost; not required. |
| **16–20 beta testers recruited** | Founder time | Before M9 (was M8 at Gate 1 presentation). **Overlaps with R6's second independent office group — recruit both once.** |
| **Brand assets / mascot direction** | Founder + designer | **Before M6.** DR-6/DR-7's shareable mascot card cannot ship without it. On the critical path. |
| **Privacy Policy + minimal ToS, live at a real URL** | **Founder-drafted for the beta** (decision 88); lawyer engaged before public launch | **BEFORE M9 (was M8 at Gate 1 presentation) — this blocks the BETA, not just public launch.** Google Play requires the Data safety form and a live HTTPS privacy policy URL for **closed** tracks; Apple requires Beta App Review with a privacy policy URL for **external** TestFlight testers. Beta data footprint is narrow (no gov IDs, no location, no payments), so this is a small ask — but it is on the critical path. |
| **Badge artwork (~26 badges) + check-in share templates** | Founder design work | **Before M8 (new).** On the critical path — same pattern as the mascot-before-M6 dependency. See decision 97. |
| Full legal set (Community Guidelines, liability disclaimer, R15 scoping) | TBD | Before public launch. **Scope widened:** must cover public reputation scoring *and* (from Phase 2) geolocation shared to unauthenticated third parties. |
| Third-party security audit | TBD | Before Phase 2 KYC |
| Seed organizer recruiting (rides/diving) | Founder time | Before Phase 2 |
