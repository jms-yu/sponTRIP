---
description: SPARK fix loop — for defects and dislikes found in manual testing (broken behavior, layout/placement issues, wrong copy). Triages first; auto-escalates to /spark-update if the change touches scope.
argument-hint: <describe what's wrong>
---

# /spark-fix — Fix Orchestrator

You own all state writes. Read spark-state-protocol. Read config.md, plan.md, proposal.md, milestones.md, progress.md.

## Phase 1 — TRIAGE (mandatory)

Classify "$ARGUMENTS" against plan.md + proposal.md:

- **FIX** = restores or polishes what the plan already promised: bugs, broken flows, layout/placement/styling changes, copy changes, obvious UX friction. Touches code only. Proceed below.
- **UPDATE** = adds, removes, or changes a feature, data model, integration, or promised behavior — even if the user called it a “fix.” STOP and say: “This changes scope, not just code — routing to /spark-update: .” Then follow the /spark-update procedure.
- **Ambiguous** → ask ONE clarifying question, then classify.
- **Mid-fix escalation**: if implementation reveals the fix needs schema or architecture changes, STOP, checkpoint, escalate to update.

## Phase 2 — Fix

Branch: the current milestone branch if one is open, else
`fix/short-name`. Invoke **spark-developer** with the triage note.
Smallest correct change. For behavior bugs a **regression test is
REQUIRED** — the test that should have caught it. Design-related fixes must
stay consistent with the existing design system. If config.md shows live: true, apply the same migration-reversibility and no-breaking-API discipline from section 4.6 — a live fix is not exempt just because it’s small.

## Phase 3 — Mini-QA

Invoke spark-qa, scoped: affected tests + the new regression test + lint + build. Full suite only if the change touched shared code. Fail → back to Phase 2 (max 3 cycles).

## Phase 4 — Close

Developer commits (`fix:` type). You log to decisions.md and update
progress.md. Tell the user exactly what changed and the 1–3 manual steps to
verify it.

No Review Gate for ordinary fixes — QA plus the regression test is the
gate. **But** if a fix balloons past ~5 files or touches security-sensitive
code (auth, payments, uploads), DO invoke **spark-review-gate** before
closing.
