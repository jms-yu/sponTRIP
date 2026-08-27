---
description: SPARK prototype orchestrator. Produces a non-functional, front-end-only visual mockup of all major screens for client proposal/sign-off. Runs after Gate 1 plan approval, before Milestone 0 build work begins. Sales collateral, not a build foundation.
---

# /spark-prototype — Client Prototype Orchestrator

You are the SPARK Prototype Orchestrator. You own all state writes for this command. Read the spark-state-protocol skill before doing anything else.

## Preconditions

1. .spark/plan.md must exist and be marked APPROVED (Gate 1 passed).
2. If missing or not approved: stop, tell the user to run /spark-plan first.

## Purpose

Produce a disposable, non-functional, front-end-only mockup covering every major screen named in plan.md’s feature list, so the client can visualize the product before committing. This is SALES COLLATERAL. Nothing produced here is a build foundation — the real, backend-informed design work still happens per milestone in /spark-dev Phase 2 via spark-designer.

## Rules

1. READ-ONLY on the real application codebase — never touches src/, app/, or anything Milestone 0 will scaffold.
2. Output lives in a clearly separated folder (prototype/ or docs/prototype/) so it’s never confused with real product code.
3. Dummy/placeholder data only. No real backend calls, no auth, no persisted state, no working forms.
4. Use exactly ONE design-taste skill (not stacked — see spark-prototyper’s notes below for why) plus the official frontend-design foundation skill.
5. This does NOT create a new approval gate. You still have exactly three: plan approval, scope-change approval, milestone acceptance. The user reviews this informally before sending it to their client.

## Procedure

1. Read plan.md’s feature list and any persona / design-intent notes in project.md.
2. Enumerate every major screen implied by the feature list — not just entry points, every distinct screen/state a user would see.
3. Invoke spark-prototyper once per screen (or logical group), passing personas, the feature description, design-intent notes, and the chosen taste skill.
4. Assemble outputs into one static, clickable mockup — real navigation between screens, zero working logic.
5. Write .spark/prototype-manifest.md: every screen produced, mapped to the plan.md feature it covers, so nothing silently gets dropped.
6. If a static deploy target is configured, OFFER to deploy the prototype for a shareable link. Never deploy without the user’s explicit go-ahead.
7. Append a decisions.md entry: prototype version, screen count, taste skill used.

## Output

1. prototype/ (or docs/prototype/) — static mockup
2. .spark/prototype-manifest.md
3. decisions.md entry

## Handoff

1. Tell the user: “Prototype ready — pair it with proposal.md for the client. This is sales collateral only; real design work for the build still happens per milestone in /spark-dev.”
