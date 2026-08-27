# SponTRIP — Project Proposal

**Version:** 1.2 — updated 13 August 2026, twice, for two post-Gate-1 scope
additions: (1) poll, badge system, check-in share card, and (2) recurring events
+ Reason Rate. Total effort 15.0 → 19.5 → 21.5 FTE-weeks; beta no longer lands
within the original December target at any modeled capacity.
**Date:** 13 August 2026
**Status:** For Gate 1 approval, and for sharing with investors, advisors or a first hire

> **Who this is for.** SponTRIP has no external client — it is the founders' own
> product. This document exists so that someone who has never heard of SponTRIP can
> understand what is being built, what is deliberately not being built, what it
> depends on, and where the real risks are. It is not a pitch. Where something is
> unproven or undecided, it says so.

---

## 1. What SponTRIP is

### The problem

People constantly plan things with friends — weekend rides, dive trips, office
outings, coffee, sports — and the plans die. In the Philippines there is a phrase
for it: **"puro plano lang"** — roughly, "all talk, no follow-through." Everyone
recognises the pattern: a group chat lights up, a date is picked, and then it
quietly evaporates. Or it happens, but only four of the twelve who said yes turn up.

The organiser has no way to know who is actually coming, so they can't book the
restaurant, reserve the dive slots, or count the seats. Their only tool is nagging
the group chat the day before.

**The real competitor is Facebook Events plus Messenger.** It is free, everyone in
the Philippines already uses it, and it works well enough. Any product that merely
matches it is not a reason for anyone to switch.

### The product

SponTRIP is a mobile app for iOS and Android. Three things make it up:

**Circles** — a friend group you create and control. Group chat is created
automatically. Anyone in the Circle can propose an activity.

**Drawing Rate** — a visible reliability score. When an event is finalised, a
check-in code is generated. On the day, people scan it. Afterwards the organiser
confirms who actually came. The result is a simple number: does this person show
up, or do they flake? It is shown to everyone in the Circle, and it is designed to
be screenshotted and shared — that sharing is how new people hear about the app.

**Magic Bunot** — a random draw any group can run to settle something: who pays the
bill, who picks the venue. The draw happens on the server and the result is posted
into the group chat automatically, so nobody can claim it was rigged. *("Bunot" is
Filipino for drawing lots.)*

Around those sit group chat, direct messages, notifications, onboarding, and
account deletion. The first release deliberately has no payments, no identity
verification, and no public event discovery.

### The bet, stated plainly

**Drawing Rate is the whole argument for using SponTRIP instead of Messenger.**

No shipping product has a public peer-to-peer reliability score for social plans.
The closest is **FLKE** (iOS), which tackles the identical problem — but chose
*money* as the enforcement mechanism: the organiser sets a flake fee and no-shows
forfeit it. SponTRIP is betting on *reputation* instead.

That is either a genuine gap nobody has filled, or evidence that money is the more
effective lever and reputation is not enough. **Research cannot settle which.** Only
real users can. This is the central unproven bet of the entire project, and it is
being instrumented from the first day of the beta.

---

## 2. Who it is for

Three communities the founders can personally reach, deliberately sequenced:

| Order | Community | Why here |
| --- | --- | --- |
| **First** | **Office social groups** — workplace friend groups organising team outings, dinners, Christmas parties | Needs nothing but Circles and private events. Usable on day one with no organisers to recruit and no empty feed — everyone in an office already knows each other. |
| Second | **Motorcycle touring and riding clubs** | Needs public event discovery, verified organisers, and registration fees. More build, more risk. |
| Second | **Diving groups** | Same, plus certification checks and the highest safety stakes and fees of the three. |

**Why this order matters.** The first group validates whether Drawing Rate actually
changes behaviour, before any money is spent building verification, payments or a
discovery feed. If the score doesn't motivate people who already know each other, it
certainly won't motivate strangers.

**Age:** 18 and over only. Under-18 support is explicitly deferred. This avoids
parental-consent obligations under the Philippine Data Privacy Act and lowers
liability for a product that brings people together in physical places.

---

## 3. What makes it different

RSVPs on Facebook are not binding. "Going" and "Maybe" carry the same weight,
because neither costs anything. Fifty people can accept and twelve turn up, and
nothing about that changes next time.

Drawing Rate puts a small, visible cost on breaking a commitment. You can still
decline freely — **declining costs nothing at all**, by design, because a system
that punished honest "I can't make it" would simply train people to stop replying.
But if you say yes and don't come, the number moves, and the people you said yes to
can see it.

**Two honest caveats, stated up front:**

**This has never been shipped.** That is either the opportunity or the warning.

**Visible reputation among colleagues can backfire.** The first cohort is office
workers, which means the first people to carry visible reliability scores about each
other are people who sit near each other five days a week. That is a real social
risk, it is not fully solvable in software, and it is being watched from launch. If
the data shows backlash, the visibility rules can be changed.

---

## 4. What we are building first — the closed beta

### What a closed beta means

The first release is **not** a public app store launch. It goes to a known,
invited group of testers through TestFlight (iOS) and Google Play's closed test
track. Everyone is opted in and reachable by email.

This is not a compromise — it is the required path anyway. Google Play makes a new
developer account run a closed test before it can publish publicly.

> **⚠️ Updated 13 August 2026.** After Gate 1 was first presented, the founder
> added three features (a poll, the full badge system, and a check-in photo
> template — see below). That added real effort, and the beta no longer lands
> within Philippine office Christmas-party season, which was the original reason
> for targeting December. See section 7 for the honest revised timeline. The
> founder was told this directly and chose the added features over the date.

### What is included

| Area | What it does |
| --- | --- |
| **Accounts** | Sign in with Google, Apple, or email. Age gate blocking under-18s. Account deletion from inside the app **and** from a web page (both stores require this). |
| **Circles** | Create a friend group, invite by link, automatic group chat, a designated Leader who runs events. Optionally tagged with a category (Sports, Rides, Nature, etc.). |
| **Polls** | A Circle member proposes a question with a few options when the group is still deciding what to do; everyone votes once; the winning option pre-fills a new event so nobody has to retype it. |
| **Private events** | Title, start and end time, location, description. Confirm or decline. "Finalise" locks it in — and only then does attendance tracking begin. |
| **Recurring events** | Set an event to repeat — daily, weekly (on chosen days, e.g. Mon/Wed/Fri), fortnightly, monthly, and so on. Each repeat is generated automatically and can be edited on its own without touching the others. **Not responding to a repeat costs nothing** — the same rule as any other event; only a confirmed-then-no-show affects your score. |
| **Reason for declining (optional)** | When you say no to an event, you can optionally say why. It's never required, and it never affects your score — it just feeds a light "most common reason" fact on your profile. |
| **Check-in** | On the day, the Leader displays a code on their phone that changes every few seconds; members scan it. **Scans work with no signal** and sync later — dive sites and ride routes often have none. |
| **Attendance confirmation** | Afterwards the Leader gets a list built from the scans and marks each person **present, absent, or excused** (excused needs a reason). Every member can see the scan list beside the Leader's final list, with any difference clearly flagged — nobody is quietly marked absent. Anyone can dispute a record. |
| **Drawing Rate** | Personal score, group score, and a show-up streak. Shown by default as a friendly label and character, **not** a bare percentage — you tap to see the number. The shareable card carries the *positive* stat ("14 of 14 showed up"). |
| **Badges** | A collection of unlockable badges — for onboarding milestones, for building and showing up to Circles, and a set of humorous "flaking" badges tied to Drawing Rate. Browsable on a badge page showing how to unlock each one; you choose 2–3 to feature on your profile. Badge artwork is being designed by the founders. |
| **Magic Bunot** | Server-run draw, result posted into group chat as a message nobody can edit or delete. No prizes or money involved. |
| **Check-in share card** | Pick a photo from your camera or library at check-in, compose it against a designed template on your own phone, and share it — the photo is never uploaded or stored by SponTRIP. |
| **Chat** | Circle group chat and direct messages between people who share a Circle. |
| **Notifications** | Event updates, messages, invitations. |
| **Onboarding** | Explains in plain language what Drawing Rate is and exactly how it is calculated. A reputation system people don't understand is one they won't trust. |
| **Admin tools (minimal)** | Founders-only: reports queue, attendance disputes, user suspension, and a dashboard of the warning-sign metrics listed in section 9. |
| **User guide and onboarding documentation** | Task-based written guides for every feature — for testers, and so a future hire can get up to speed without asking. |

### How the work is broken up

| Milestone | What it covers | Effort |
| --- | --- | --- |
| M0 | Project setup, security baseline, automated safety checks, web hosting | 2.0 |
| M1 | App structure, navigation, visual design system, accounts, both deletion paths | 2.5 |
| M2 | Circles + first security policy review | 1.0 |
| M3 | Private events, chat, notifications, reporting and blocking | 2.5 |
| M4 | Check-in codes and offline scanning | 1.0 |
| M5 | Attendance confirmation and the dispute/audit safeguards | 1.5 |
| M6 | Drawing Rate scoring, display and share card | 1.5 |
| M7 | Magic Bunot, admin tools + second security policy review | 1.5 |
| **M8** | **Poll, badges, check-in share card, recurring events** *(added and grown twice, 13 August 2026)* | **6.5** |
| M9 | Beta release preparation and store submission | 1.5 |
| | **Total** | **21.5 FTE-weeks** *(was 15.0 at Gate 1 presentation, then 19.5, now 21.5)* |

---

## 5. Out of scope

Everything below is **excluded from the closed beta**. Most are sequenced for
later, not rejected. The genuinely rejected ones are marked.

| Not included | Why |
| --- | --- |
| **Public events and organisations (Hubs)** | Needs a browsable feed and verified organisers. Phase 2. |
| **Identity verification (KYC)** | Requires finished legal documents and a paid security audit first. Phase 2. |
| **Registration fees and payments** | SponTRIP never holds money — organisers take payment directly and verify receipts themselves. Phase 2. |
| **Custom registration forms** | For things like diving certifications. Phase 2. |
| **Live location sharing** | Built for the safety needs of riders and divers — the Phase 2 audience. Office outings don't need it, and deferring keeps location data out of the beta entirely. Phase 2. |
| **Full admin console** | The beta ships a minimal version. Richer tooling comes with Phase 2's larger operational load. |
| **Persisted event photo upload and the Album** | The check-in share card (now included) never uploads or stores the photo — it composes on your own phone and nothing is saved to SponTRIP. A gallery where a whole Circle can browse each other's event photos is a materially bigger, different feature — it needs upload infrastructure and content moderation, and stays Phase 3. |
| **Kris Kringle / Monito Monita draw** | A strong seasonal idea that reuses Magic Bunot's machinery. Deliberately held back until the basic draw proves people use it at all. |
| **Video generation for sharing** | ❌ **Rejected.** Server-side video rendering costs real money per share. Images generated on the phone achieve nearly the same thing for nothing. |
| **In-app maps** | ❌ **Rejected.** Map services charge per view. A button that opens Google Maps or Waze costs nothing and is what people use for directions anyway. |
| **SMS / phone-number login** | ❌ **Rejected.** Not on cost, but on fraud: attackers trigger mass verification texts to premium numbers the company pays for. Google, Apple and email cover everyone. |
| **Under-18 support** | Deferred. Needs parental-consent handling. |

---

## 6. What it costs to run

**Every figure below is an estimate — to be confirmed.**

| Service | Purpose | Monthly |
| --- | --- | --- |
| Supabase | Database, sign-in, live chat | ~$25 |
| Cloudflare R2 | Photo storage (no charge for data leaving) | ~$0 under the free tier |
| Cloudflare Images | Image resizing | ~$0 under the free tier |
| Cloudflare Pages | Web pages (deletion page, privacy policy) | $0 |
| Expo | App builds and instant updates | $0, rising to ~$19 above 1,000 monthly users |
| PostHog | Usage analytics | $0 free tier |
| Sentry | Error alerts | $0 free tier |
| Resend | Emails | $0 free tier (capped at 100/day) |
| Push notifications | | $0 |
| **Running total** | | **~$25–45/month** |

One-off and annual costs: Apple Developer Program ~$99/year; Google Play ~$25
one-time; domain ~$12/year. **All estimates — to be confirmed.**

**Where this breaks.** The ceiling is $50/month before any revenue. The first thing
to break it is **live chat connections** — cost scales with how many people have the
app open at once, not with how many have signed up. Around 1,000 users it still
fits; around 10,000 simultaneous users it would roughly triple. A billing alert is
set at $40 so this is noticed early rather than discovered on an invoice. The real
threshold is measured by load-testing during M3, not guessed from price lists.

---

## 7. Timeline, and how it was estimated

**This is the section most worth scrutinising, so it is written to be checked.**

### FTE-weeks, not calendar weeks

An **FTE-week** is 40 hours of work. Two people each putting in 20 hours finish one
FTE-week per calendar week.

AI-assisted development is genuinely faster, but it speeds up *typing*. It does not
speed up deciding what to build, testing it, chasing credentials through vendor
consoles, or debugging. Those dominate.

### The capacity assumption

Both founders work day jobs. Capacity varies week to week, so the plan uses **20
combined productive hours per week** as its working assumption — and shows what
happens if that is wrong.

> **Updated 13 August 2026, twice.** After Gate 1 was first presented, the founder
> added a poll, the full badge system, and a check-in share card (round 1: 15.0 →
> 19.5 FTE-weeks), then recurring events and a light "Reason Rate" fun fact
> (round 2: 19.5 → **21.5 FTE-weeks**). The table below reflects the current total.

| Sustained capacity | Calendar time | Beta lands |
| --- | --- | --- |
| 30 hrs/week | 29 weeks | early March 2027 |
| 25 hrs/week | 34 weeks | early-mid April 2027 |
| **20 hrs/week (assumption)** | **43 weeks** | **mid-June 2027** |
| 15 hrs/week | 57 weeks | mid-September 2027 |

### December is no longer reachable at any modeled capacity

Even the fastest row above — 30 hours a week, sustained, on top of two full-time
jobs — now lands in early March, three months past the original December target.

**The original reason for December was seasonal, and that reason is gone.**
Landing inside Philippine office Christmas-party season was the whole point of the
date; at every row in the table, delivery now lands well after that season ends.
This was stated to the founder directly, twice. The added features were chosen
over the date both times.

**There is no contingency buffer in the 21.5 FTE-weeks.** For a first-time team on
a first product, a 20% allowance would put this at roughly 25.8 FTE-weeks — about
52 weeks at the planning assumption. The capacity table above is currently doing
the job a buffer would otherwise do, which is worth knowing when reading it.

### The week-8 checkpoint

At **calendar week 8 (early October 2026)**, compare hours actually worked against
160 — this part of the estimate is unaffected by either round of new scope, since
it only measures the first four milestones. If the shortfall is 20% or more, the
mid-June target is already slipping — and that gets said then, openly, while there
is still time to adjust rather than discovering it later.

### After the beta

Public app store launch follows the beta, once real usage has shown what to fix —
realistically **Q4 2027** at the planning assumption, pushed back again from the
Q3 estimate after the first addition. Apple's review for a social app with user
content, stranger meetups and a 17+ rating commonly takes two or three attempts,
and that time is not build time.

---

## 8. Founder responsibilities

**All costs are estimates — to be confirmed.**

| Item | When | Notes |
| --- | --- | --- |
| ⚠️ **Google Play account** | **Week 1 — decision needed now** | A *personal* account must run a closed test with **12 testers opted in for 14 continuous days** before it can publish publicly. An *organisation* account skips that but needs a D-U-N-S business number, which has its own waiting period. **This choice changes the calendar**, so it cannot wait. ~$25 one-time. |
| ⚠️ **Apple Developer Program** | **Week 1 / M0** | Needed far earlier than expected — Sign in with Apple, iOS push notifications and any iOS build all depend on it. ~$99/year. |
| Domain name | M0 | Needed for the privacy policy and the web deletion page. ~$12/year. |
| Google sign-in setup | M0 | Free. |
| ⚠️ **Privacy Policy + basic Terms of Service, live at a real address** | **Before M9 — blocks the beta** | Both stores check for a working privacy policy link *even for closed testing*. Founder-drafted for the beta; a lawyer is engaged before public launch. The beta's data footprint is genuinely small — no ID documents, no location, no payments — which makes this a manageable task rather than a wall. |
| Mascot and brand assets | **Before M6** | The Drawing Rate card cannot ship without them. On the critical path. |
| ⚠️ **Badge artwork (~26 badges) + check-in share templates** | **Before M8** *(added 13 August 2026)* | On the critical path, same as the mascot dependency above — the new milestone's screens can't be built without the art. |
| Security policy review (twice) | After M2 and M7 | **Not yet budgeted and no reviewer chosen.** See section 9, risk K5. Needs a decision. |
| Recruit 16–20 beta testers | Before M9 | Recruit more than 12, because 12 must *stay* opted in for 14 continuous days. Overlaps with the independent second office group — recruit both together. |
| Full legal set | Before public launch | Community guidelines, liability disclaimer, and wording covering Drawing Rate's public scoring. |
| Manual identity checks | Phase 2 only | Founders personally review ID documents. Ongoing per-organiser work, not a one-off. |

---

## 9. Known risks, stated plainly

### The five that could end the project

**K1 — Drawing Rate could teach people never to commit.**
Only *confirming and then not showing up* costs you anything. So the safest strategy
is to never confirm — just turn up, or don't. If that spreads, confirmations stop
meaning anything, and organisers lose the headcount they needed in the first place.
*What we do:* measure confirmation rates from day one and watch for them falling over
time. This can't be solved in advance; it can be caught early.

**K2 — The scores might not be trustworthy, and one screenshot could prove it.**
The Leader can edit the attendance list. The weather exemption is self-reported. If
someone discovers their public score was set by a friend's judgement rather than the
actual scans, and posts about it — the same sharing that grows the app destroys it.
*What we do:* members see the scan list beside the Leader's version with differences
flagged; every edit is permanently logged; anyone can dispute a record. These reduce
the risk. They do not eliminate it.

**K3 — Two part-time founders have no slack, and success makes it worse.**
Moderation, identity checks, disputes and support are all recurring manual work that
grows with the number of users. The moment the product starts working is the moment
it overwhelms the two people running it.
*What we do:* cap intake deliberately rather than let response times quietly rot, and
track hours spent on this from the first week so "we're coping" is a measurement
rather than a feeling.

**K4 — If Drawing Rate doesn't work, there is no second idea.**
Circles, chat and events are all things Messenger already does for free. Drawing Rate
is the entire reason to switch.
*What we do:* decide *now*, while it is still hypothetical, what result would mean it
isn't working — so the decision to change course isn't made emotionally later.

**K5 — A single access-control mistake, in code neither founder can audit.**
Neither founder writes production code. A small, plausible-looking change could
quietly grant access to data it shouldn't, and pass its tests, because tests check
what a feature *should* do rather than what it *also now permits*.
*What we do:* automated checks that fail the build if any user can reach another
user's data — this is the mechanical defence and the most important safeguard in the
project. Plus two human reviews of the access rules. **The reviews are not yet
budgeted and no reviewer has been chosen — this needs a decision.**

### Also worth knowing

- **Office politics.** Visible reliability scores among colleagues can become
  ammunition in dynamics the founders cannot see.
- **The weather excuse.** It is self-reported, so a group could claim it every time.
  Usage rates are tracked per group to make that visible.
- **The budget breaks exactly when things go well.** A widely-shared Drawing Rate
  screenshot brings a rush of signups, which is the same event that spikes chat
  costs past the ceiling.

### The single most important thing

It is not the technology, the budget or the timeline. **It is whether a visible
reliability score among friends produces delight or resentment.** Nobody has shipped
one, so there is no precedent to learn from. Launching and watching is the only way
to find out.

---

## 10. How we will know if it worked

**The measure is repeat behaviour:** somebody joins an event, it happens, they turn
up — and then they join another one.

That is a deliberately harder test than the usual "monthly active users." Signups
can be manufactured. Coming back cannot.

**Why a moving target rather than a fixed number.** Published benchmarks for social
apps measure something much weaker — whether someone opened the app at all. Comparing
against them would be misleading. The target is instead that the repeat-join rate
**trends upward month over month**. A rising line means it is working. A flat line
means it is not, whatever the feature list looks like.

**Secondary measure:** how many events reach real check-ins. That is the direct
measurement of plans no longer dying.

---

## 11. Assumptions

| # | Assumption | If it's wrong |
| --- | --- | --- |
| A1 | Two founders sustain ~20 combined productive hours/week alongside day jobs | Every date moves. Section 7 shows the sensitivity. |
| A2 | The founders' own office, riding and diving networks will genuinely use it — not just humour them | No organic growth, and there is no advertising budget to fall back on. A second, independent office group is recruited specifically to test this. |
| A3 | Reputation motivates showing up more than it motivates avoiding commitment | This is K1, and it is the bet. |
| A4 | Reputation is a strong enough incentive without money changing hands | This is K4. The nearest comparable product chose money instead. |
| A5 | Audit logs and member-visible attendance are enough to keep the scores credible | This is K2. Mitigated, not solved. |
| A6 | Chat connection costs stay inside $50/month at beta scale | Load-tested in M3 rather than assumed. |
| A7 | Access rules written as database policies are reviewable by non-programmers | This is K5, and it drove the entire technology choice. |
| A8 | Founders can draft an adequate privacy policy for a beta with no ID documents, location or payments | Legal exposure. Reason it is scoped narrowly and a lawyer is engaged before public launch. |
| A9 | Manual moderation is sustainable at beta scale | This is K3, and it stops being true as the product grows. |

---

## 12. How a milestone is accepted

A milestone is done when every one of its acceptance criteria is met. Criteria are
written to be checkable, not aspirational.

For example, M0 is complete when a deliberately broken change is blocked by the
automated checks; when error reports arrive with email addresses and phone numbers
removed; when the automated access-control tests run and fail the build on a
violation; and when the billing alert is configured. It is **not** complete because
"everything compiles" or "security looks fine."

In addition, every new screen in every milestone must ship with its empty, loading
and error states designed, dark mode applied, and its own access-control tests. That
standard is checked again across the whole app before the beta goes out.

---

## 13. How scope changes are handled

1. **State the change** — what is being added, removed or delayed, and why.
2. **Price it** — in FTE-weeks, in money, and in calendar time.
3. **Record it** — the decision and its reasoning go into the permanent decision log,
   which currently holds 89 entries and is the reason a new person can reconstruct
   why anything is the way it is.
4. **Update the plan** — milestones and dates are revised to match reality.

Three limits constrain any change: the **$50/month** running cost, the **capacity
assumption**, and the fact that anything added to the beta pushes the launch date
out. Changes that breach those require a deliberate decision to drop something else.

*Examples that already happened during planning:* live location was moved to Phase 2
once it became clear it was built for an audience the beta doesn't serve; group chat
was reviewed twice for removal and deliberately kept both times, with the date cost
accepted; the web account-deletion page was added on discovering both app stores
require it.

---

## Summary

**In one sentence:** SponTRIP is a mobile app that helps friend groups make plans
actually happen, using check-in codes and a visible reliability score.

**Key dates** (at the 20 hrs/week planning assumption; **updated 13 August 2026,
twice** — total effort is now **21.5 FTE-weeks**, was 15.0 at Gate 1 presentation):

| | |
| --- | --- |
| Week-8 checkpoint | early October 2026 |
| Beta launch | mid-June 2027 — *or early March 2027 at a sustained 30 hrs/week* |
| Public store launch | Q4 2027 |

**What it needs from the founders:** roughly 20 productive hours a week for about
43 weeks; around $25–45/month running cost plus one-off store and domain fees;
badge and template artwork ahead of M6/M8; and ongoing manual moderation that grows
with success.

**Immediate actions, before anything else:**

- [ ] Decide the Google Play account type — **week 1, it changes the calendar**
- [ ] Enrol in the Apple Developer Program — **week 1**
- [ ] Confirm or correct the 20 hrs/week capacity assumption
- [ ] Budget and choose a reviewer for the two security policy reviews
- [ ] Start drafting the beta privacy policy and terms
- [ ] Start badge artwork (~26 badges) and check-in share templates — on the M8 critical path
- [ ] Re-confirm at Gate 1: the December target is no longer reachable at any
      modeled capacity, and the added scope was chosen over the date

---

*Prepared 13 August 2026. All costs are estimates and must be confirmed before
commitment. Full technical detail, decision history and risk register are held in
the project's `.spark/` files.*
