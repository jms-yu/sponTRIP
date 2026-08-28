# SponTRIP — Security Requirements

**Version:** v1.0 — 2026-08-13
**Status:** Requirements defined. Findings section opens at M0.
**Mirrors:** `.spark/plan.md` §5. This file is the operational source of truth.

---

## 0. Why this project's security posture is unusual

Two founders, **neither of whom hand-writes production code**, building via
AI-assisted development, on an app that will hold government IDs, selfies, phone
numbers, home cities, live location and payment receipts.

The risk is not that they write bad code. It is that **an agent making a plausible,
narrowly-scoped fix touches an RLS policy or auth check in a diff small enough to
look safe and pass tests** — because tests cover intended behaviour, not the
unintended permission also granted (R23).

**Consequence: tests-as-code-review is not sufficient here.** The controls below
are chosen specifically to be *mechanical* — things that fail a build rather than
requiring a human to notice something subtle.

---

## 1. Non-negotiable controls

| # | Control | Feature ID | Enforcement |
| --- | --- | --- | --- |
| 1 | **Managed auth only.** No hand-rolled sessions, password handling or token juggling. | AUTH-1…3 | Design constraint |
| 2 | **Deny-by-default RLS on every table.** A table with no explicit policy is unreadable and unwritable. | SEC-1 | Test at M0 |
| 3 | **Negative-authorization test suite in CI, blocking merge.** Per table: user A cannot read/write user B's rows; `anon` reads nothing not explicitly public; admin tables reject non-admin sessions. | SEC-2 | **CI, every PR** |
| 4 | **Key segregation.** Only the Supabase `anon` key ships in the client. | SEC-3 | **CI fails on `service_role` in bundle** |
| 5 | **`security_invoker` on every view.** Postgres views bypass RLS by default. | SEC-4 | **CI fails on any view without it** |
| 6 | **RLS reviews (optional)** — founder self-review after M2 and after M7, at no cost. **Downgraded from milestone gate to recommendation (decision 112, 2026-08-28).** | SEC-5 | Recommended, not blocking |
| 7 | **PII scrubbed from error payloads.** Sentry is a common accidental PII leak vector. | INF-5 | Test at M0 |
| 8 | **Storage segregation verified by denied-read test**, not by inspection. | INF-9 | Test at M0 |
| 9 | **Permission-delta summary.** Every change touching auth, RLS or admin surfaces requires an explicit written answer to *"what does this permit that it didn't before?"* | — | SPARK review gate (R23) |
| 10 | **Rate limiting** on every abuse-prone endpoint: invite-link redemption (CIRC-2), report submission (TS-1), DM creation, and all Edge Functions. Currently unthrottled. | — | Test at M3 |
| 11 | **Dependency scanning in CI** (Dependabot or `npm audit`). Free, mechanical, fails the build — same philosophy as controls 3–5. | — | **CI, every PR** |

### Why control 3 is the most important line in this document

It is free, recurring, runs on every pull request, and survives the team's blind
spot completely. Control 9 is the human version of the same idea; control 3 is the
mechanical version and is strictly better. Its absence was the single largest gap
found at validation.

---

## 2. Data classes and retention

| Class | Examples | Phase | Retention | Notes |
| --- | --- | --- | --- | --- |
| Account PII | name, nickname, email, city, avatar | Beta | Life of account; removed or anonymized on deletion | Verified by querying for residual rows (AUTH-5/6) |
| Age affirmation | birthdate, affirmation, timestamp, user id | Beta | Immutable, retained as compliance evidence | R16 — the 18+ gate is self-attested; the log improves the founders' position if challenged, it does not prevent misrepresentation |
| Behavioural | events, confirmations, scans, scores | Beta | Rolling 6 months for scoring | Older records age out of Drawing Rate but remain for history |
| **Attendance audit log** | Leader edits, old/new values, editor, timestamp | Beta | **Never deleted; anonymised in place on account deletion** | This is the K2 dispute evidence — deleting it destroys the only defence against "the score is made up." **Reconciles with AUTH-5:** on deletion, the editor identity is replaced with an irreversible pseudonym; the row itself survives. Without this rule, AUTH-5's "verified by querying for residual rows" check would fail against this table, and it is an RA 10173 erasure question, not just an engineering one. |
| Chat messages | Circle chat, DMs | Beta | Life of Circle; removed on account deletion | |
| Location | live location shares, viewer sessions | **Phase 2** | **Purged within 1h of event end** | Deferred out of Phase 1 by decision 74 |
| Payment receipts | GCash/bank screenshots | Phase 2 | Life of event + dispute window | **Separate R2 prefix, organizer + admin only** (R12). Contains account numbers and names — treat as financial data, not photos. |
| Verification documents | government ID, selfie | Phase 2 | **Deleted within 72h of the approval decision** | R13. Requires an **always-zero stale-document dashboard count**; a seeded stale fixture must make it read 1, proving the check actually works. A silently failing deletion job is the real risk. |

---

## 3. Philippine Data Privacy Act (RA 10173)

- Government ID and selfie imagery fall in the **higher-obligation category**.
  At contemplated volumes this likely brings NPC registration duties and
  breach-notification obligations.
- **18+ only**, so no minor's data is processed — but the gate is a self-attested
  birthdate (R16). The paper mitigation and the practical mitigation are not the
  same thing; the affirmation log exists to narrow that gap, not close it.
- **Manual KYC review** by the founders rather than a biometric vendor, with
  minimum retention and deletion after decision.
- **Cross-border transfer (R18).** Supabase, Cloudflare, PostHog, Resend and Sentry
  are all foreign-hosted. Ask the lawyer about transfer obligations for this exact
  vendor list — a five-minute question inside an already-planned engagement.
- **Beta consequence worth preserving:** the December beta collects **no government
  IDs and no location data**. Keep it that way; it is what makes a
  standard-ToS-plus-Privacy-Policy beta defensible.

---

## 4. Legal documents — OPEN BLOCKER

Required: Terms of Service, Privacy Policy, Community Guidelines, and an explicit
disclaimer that SponTRIP is not a party to any event or any payment.

**Scope is wider than boilerplate**, for two reasons found separately:

1. **Drawing Rate publishes a quantified reliability judgement about a real
   person**, edited by a peer with no formal accountability (R15). Generic
   templates will not anticipate this.
2. **From Phase 2, precise geolocation of identified individuals is transmitted to
   unauthenticated third parties over a public URL** (validator issue 8). Deferring
   live location out of the beta (decision 74) narrows this to Phase 2 — it does
   not remove it.

### ⚠️ CORRECTED 2026-08-13 — a Privacy Policy DOES block the beta

An earlier version of this section said legal documents do not block the closed
beta. **That was wrong on both stores:**

- **Google Play** requires the Data safety form for apps on **closed**, open and
  production tracks, plus a **live HTTPS privacy policy URL** checked at review. A
  parked or dead URL is a common rejection cause.
- **Apple** requires **Beta App Review** for *external* TestFlight testers, and the
  required Beta App Information includes a **privacy policy URL**.

**Beta-blocking:** a published Privacy Policy and a minimal Terms of Service, live
at a real URL, before M9 (was M8 at Gate 1 presentation — a new milestone, M8, was
inserted 2026-08-13 for the poll/badge/check-in-template addition; see
`decisions.md` 90–98).
**Public-launch-blocking:** the full document set, including the R15 scoping.
**Phase-2-blocking:** everything above, plus the paid security audit (section 6).

**The good news, and it is real:** the beta's data footprint is genuinely narrow —
**no government IDs, no location, no payments.** A beta-scoped privacy policy is a
far smaller and cheaper legal ask than the Phase 2 set. This is a schedule item to
start now, not a new wall.

---

## 5. Known accepted risks

| Risk | Why accepted | Revisit |
| --- | --- | --- |
| **QR rotation is not an anti-cheat guarantee.** It stops casual "send me the QR" cheating. It does not resist a colluding Leader, a colluding present member, or device clock manipulation in the offline path. **The Leader's attendance confirmation is the actual control.** | Beta cohort is office colleagues with no money at stake; casual cheating is realistically the only threat. Worth ~3 days, not 2 weeks. | If Drawing Rate is ever used to gate access to paid or capacity-limited events (Phase 2) |
| **Data-loss window up to 24 hours.** Supabase Pro provides 7 days of daily backups; point-in-time recovery is a ~$100/month add-on that breaks the $50 ceiling alone. | Pre-revenue. Unaffordable. | On first revenue |
| **R2 has no RLS.** Photo access control lives in imperative Edge Function code minting presigned URLs — the one traced-code-path in a stack chosen to avoid them. | Low stakes in beta (avatars only). | **Before Phase 2** — receipts and government IDs raise this sharply |
| **The AI coding tool is a single point of failure** for the team's only production capability, including incident response (R24). | No affordable multi-vendor redundancy at this team size. | On first hire |
| **Manual-only moderation.** Google Play's 2026 policy expects automated moderation at scale and states manual review alone is insufficient as volume grows (R20). | Adequate at closed-beta scale with a known, low-anonymity cohort. | Before opening to strangers in Phase 2 |

**These are approved knowingly, not overlooked.** Each is written here so that when
one bites, it is a known cost rather than a surprise.

---

## 6. Phase 2 hard gate

Before any **real** (non-test) KYC data flows in production, both of the following
must be complete and logged in `.spark/decisions.md`:

1. **Legal documents** finalized (section 4)
2. **Paid third-party security audit** complete, with findings remediated

**A feature flag keeps real KYC submission disabled until both are checked off.**
A gate that depends on someone remembering is not a gate.

---

## 7. Findings log

*(Opens at M0. Optional RLS self-review findings (decision 112) land here after
M2 and after M7 if performed. Tag each finding CRITICAL / HIGH / MEDIUM / LOW
with its remediation and date.)*

### 2026-08-28 — M0 build — Astro's security-patched major requires Node 22, blocked by this project's Node 20 LTS pin

**Severity tag: MEDIUM** (npm audit reports HIGH/CRITICAL by package metadata, but see
exploitability context below — downgraded on the specific facts of this repo's
current usage, not on convenience).

`npm audit --audit-level=high` currently fails: `astro@5.18.2` (the newest 5.x
release; no further 5.x patches exist) has transitive HIGH-severity advisories
(several XSS vectors in `define:vars`/spread-prop/`transition:`/view-transition
handling, a host-header SSRF in the prerendered error page, `sharp`'s inherited
libvips CVEs) plus a CRITICAL advisory on `vitest` via `vite`/`esbuild`. **All of
these are fixed only in `astro@7.2.9`, which requires Node >=22.12.0.** This
project's `.nvmrc` pins Node 20 LTS per the M0 technical spec; no Astro 6.x line
exists (5.x jumps straight to 7.x).

**Why MEDIUM in practice, not HIGH, for THIS repo today:** the flagged XSS vectors
require Astro directives (`define:vars`, `transition:*`, spread props on
hydrated islands) that `apps/web`'s single static placeholder route does not
use (`output: 'static'`, no SSR, no dynamic/untrusted content rendered). The
esbuild advisories are dev-server-only (arbitrary requests/file-read against a
locally-running `astro dev` process) — not a production build-artifact risk.
`sharp`'s CVEs require processing untrusted images, which this repo does not do
yet. Real exposure will change the moment any of those features are used —
**re-evaluate before using `define:vars`, view transitions, or image processing
via sharp in apps/web.**

**Not remediated in M0; deliberately left for a human decision, not silently
resolved or silently suppressed:** the fix requires either (a) bumping Node to
22 for at least the `apps/web` workspace (mixed Node-version workspaces adds
CI/tooling complexity), (b) waiting for Astro to backport fixes to a 5.x patch
(none exists as of 2026-08-28), or (c) accepting this as a documented risk until
one of the above changes. **The CI `npm-audit` job (`.github/workflows/ci.yml`)
is intentionally left unweakened** (`--audit-level=high`, no ignore-list) so it
correctly stays red until a human makes this call — matching this project's
"tests-as-code-review is not sufficient, mechanical checks must actually block"
posture (R23) rather than papering over a real advisory to get a green build.
**Founder action needed:** decide (a)/(b)/(c) above; until then, `npm-audit`
failing on `apps/web`'s Astro dependency chain is expected, not a regression.

**RESOLVED 2026-08-28 (decision 130):** founder chose (a) — `apps/web`
bumped to Node 22 (own `.nvmrc`, own `engines` field), Astro upgraded to
7.2.9, `ci.yml` split into a dedicated Node-22 job for `apps/web`.
`npm audit --audit-level=high` verified clean under both Node 20 and 22.

### 2026-08-28 — M0 Review Gate cycle 2 — two M1-kickoff follow-ups (not fixed in M0, deliberately not a 3rd remediation cycle)

**Severity tag: MEDIUM (both).** Logged per the Review Gate's own
recommendation: real, but narrow, and better fixed at the start of M1's
work (where they'll first bite) than spent as a third M0 remediation cycle.

1. **`ci/scripts/rls-negative-auth/matrix.ts`/`run.ts` — `ownerWritable`'s
   INSERT check conflates two different meanings of "owner."** `isOwner`
   means "owns the seeded row used for the UPDATE/DELETE probes";
   `attemptInsert` sets the new row's owner column to the acting
   identity's own uid. For UPDATE/DELETE these coincide; for INSERT they
   don't, so `expectSuccess = ownerCanWrite && identity.isOwner` is wrong
   for INSERT specifically. Proven with a textbook M1-shaped owner-scoped
   policy set (`with check (owner_id = auth.uid())`): the suite fails
   loudly on **correct** code (`FAIL — user B (non-owner) INSERT
   unexpectedly SUCCEEDED`, when B legitimately inserted a row it itself
   owns). Fails closed, so not a live vulnerability today — the real risk
   is the fix-under-pressure failure mode: an M1 developer facing red CI
   on correct code flips `ownerWritable` back to `false`, which per
   decision 126 silently disables the owner-write assertion for that table
   going forward, the exact "waive the criterion" precedent
   `milestones.md` M1 was rewritten to avoid repeating. **Also:** no
   identity currently attempts inserting a row that forges another user's
   ownership (`owner_id = A.id` submitted by B) — the actually load-bearing
   INSERT negative case. Moot at M0 (zero-policy tables), real from M1's
   first owner-scoped table.
   **Fix, before M1's first table is added to the matrix:** for INSERT use
   `expectSuccess = ownerCanWrite && identity.uid !== null` (any
   authenticated identity may create a row it owns); keep `isOwner`
   semantics for UPDATE/DELETE against the seeded row; add an
   ownership-forgery INSERT case that must always be denied regardless of
   `ownerWritable`.
2. **New Edge Function test files aren't wired into CI unless
   hand-enumerated.** `.github/workflows/ci.yml` lists Deno test files
   individually (`scheduled_smoke.integration.test.ts`,
   `mint_storage_url.test.ts`, `send_test_push.test.ts`) — the new
   `timingSafeEqual.test.ts` (7 tests, added in remediation cycle 1) passes
   locally but was never added to this list, so it never runs in the
   merge-blocking pipeline. Same failure class as cycle-1 finding 3
   (a check that silently doesn't run reads identically to one that
   passes), one layer up the stack — a future M1+ Edge Function test file
   will have the identical fate unless this is fixed structurally.
   **Fix:** replace the per-file `deno test` steps with a single
   directory-level `deno test --allow-net --allow-env tests/` so new test
   files are picked up automatically.

Two LOW observations from the same review, logged and carried without a
required fix: `check-bundle-keys.ts`'s comment-stripping (needed to avoid
the identifier-check self-matching its own regex source) also hides a key
value pasted into a `//` comment from the source-scan half — satisfies the
literal AC ("fails if a key appears in the client bundle," and comments
don't ship) but is worth tightening if convenient. `sentry.ts`'s
`redactDeep` flattens non-plain values (`Date`, `Error`, `Map`) it
encounters inside `contexts`/SDK metadata to `{}` — harmless for the
JSON-serializable `beforeSend` payload, worth a glance during the
already-owed real-dashboard manual check.

---

#### RESOLVED — 2026-08-28, same day, decision 130

Founder chose option (a): bump `apps/web` to Node >=22.12.0, keeping
`apps/mobile` and `ci/scripts` on Node 20 LTS. Accepted mixed Node versions
across workspaces as the tradeoff, specifically to clear the vulnerable Astro
major rather than carry it as documented risk or weaken the audit gate.

**What changed:**
- `apps/web`'s `astro` dependency bumped `^5.18.2` → `^7.2.9` (clears every
  advisory listed above — no config/API changes needed; `astro build` and
  `astro check` both verified clean, 2/2 Vitest tests still pass).
- `apps/web/.nvmrc` added (`22`), distinct from the repo-root `.nvmrc` (`20`).
  `apps/web/package.json` given its own `"engines": {"node": ">=22.12.0"}`.
- A second, unrelated HIGH/CRITICAL chain was discovered and fixed in the same
  pass: our own `vitest` devDependency (both `apps/web` and `ci/scripts`, used
  purely as a dev/test tool, never shipped) pulled an outdated `vite`/`esbuild`
  carrying its own HIGH (`vite`: path traversal in optimized-deps `.map`
  handling, Windows `server.fs.deny` bypass, NTLMv2 hash disclosure via
  `launch-editor`) and CRITICAL (`vitest`: arbitrary file read/execution via
  its UI server) advisories — separate from the Astro chain and not fixed by
  the Astro bump alone. Fixed by bumping `vitest` `^2.1.4`/`^3.2.4` → `^4.1.11`
  in both workspaces (`vitest@4` supports Node 20 and 22 alike, so this did
  not need its own Node-version exception).
- `.github/workflows/ci.yml`: `apps/web`'s lint/typecheck/build/test/its own
  `npm audit` slice now run under Node 22 in a dedicated `web-node22` job;
  every other job stays on Node 20.

**Verified, not just changed:** `npm audit --audit-level=high` exits **0**
under both Node 20 and Node 22 — confirmed by running it directly (not just
trusting `npm install`'s summary line) in both environments. Remaining
findings are **11 moderate-only** vulnerabilities (the `uuid` chain via
`xcode`/`@expo/config-plugins`, a real transitive Expo SDK 57 dependency —
pre-existing, unrelated to Astro, does not block `--audit-level=high`, no fix
available without a major Expo downgrade). Zero HIGH or CRITICAL remain.

This entry is kept (not deleted) as the finding's full history — see also
`.spark/decisions.md` 130 and `.spark/environment.md`'s Dev/Web section.
