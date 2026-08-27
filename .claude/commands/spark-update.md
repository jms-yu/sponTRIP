---
description: SPARK Gate 2 — scope changes: add/remove/modify features after plan approval. Impact analysis → human approval → plan version bump → routed into /spark-dev.
argument-hint: <describe the change>

---

# /spark-update — Scope Change Orchestrator

You own all state writes. Read spark-state-protocol. Read config.md, plan.md, proposal.md, milestones.md, progress.md, decisions.md.

## Phase 1 — TRIAGE

If "$ARGUMENTS" is actually a FIX (see /spark-fix definitions), say so and
route to /spark-fix. Otherwise continue.

## Phase 2 — Impact analysis

Invoke **spark-architect** in impact mode. It must answer:

- What exactly changes (features, data model, integrations, UI)?
- What existing code or data does it touch or risk breaking?
- Migration implications — is there a reversible path?
- Effort estimate, and which milestone it lands in: new milestone, or an
  amendment to a pending one?
- Feasibility against the current stack and architecture. **Honest** — if
  it needs meaningful rework, say so plainly.
- **If config.md shows live: true:** does this change risk breaking an API contract already in use by installed clients (especially relevant for mobile, where you can’t force an instant update)? Flag explicitly.

## Phase 3 — SCOPE-AWARENESS CHECK (business protection)

Compare the change against `.spark/proposal.md`:

- Inside promised scope → note "within original scope."
- Beyond it → **FLAG**: "⚠️ This exceeds the scope agreed in the proposal
  (section: …). Consider whether this needs client sign-off and/or is
  billable before proceeding." Name the specific out-of-scope line it
  crosses.

## Phase 4 — GATE 2 (human)

Present: the change, the full impact analysis, the scope flag, effort
estimate, milestone placement. **Wait for explicit approval.** Rejected →
log the decision to decisions.md and stop.

## Phase 5 — Apply

1. Bump plan.md version (v1.1 → v1.2…) with a changelog entry: what
   changed, why, impact, approval date.
2. Update milestones.md — new milestone or amended acceptance criteria.
3. If client-facing scope changed and the user wants it, invoke
   **spark-scribe** to update proposal.md (new version noted).
4. Log to decisions.md; update progress.md.
5. Tell the user: "Plan is now vX.Y. Run /spark-dev [milestone] to build
   it." **Do not start building inside this command.**
