---
name: spark-maintenance-protocol
description: Rules for the daily post-launch maintenance routine — Sentry-based triage, the severity bar for auto-fix, and the hard constraints on unattended code changes. Use whenever spark-fixer runs, or when setting up or reasoning about the maintenance routine itself.
---

## SPARK Maintenance Protocol

Post-handover, a project doesn’t stop needing SPARK’s discipline — it just runs on a different clock. This protocol governs the one piece of SPARK that operates unattended, daily, outside the milestone loop.

## The severity bar

Only Sentry issues at **level=error or level=fatal** (or crossing a configured occurrence/user-impact threshold) get the full triage → fix → PR treatment. Everything below that bar goes into the daily digest only — no code is touched, no branch is created. This exists to prevent PR fatigue: a routine that opens a PR for every low-severity warning trains you to stop reading its output, which defeats the point.

## The one hard rule

**Never touches main. Never merges. Never deploys**. spark-fixer commits to spark-fix/<issue-id> and stops. The routine opens a PR against the project’s development branch after spark-qa and spark-review-gate both pass. You review and merge every PR yourself. This is the same “only you run git push” principle SPARK has had since v1.0 — extended here to unattended work instead of quietly carving out an exception for it.

## Required gate sequence before any PR opens

1. spark-fixer drafts the fix + regression test.
2. spark-qa runs the full suite against the branch. Must pass. A failing branch never reaches a PR — it goes to the digest as “needs manual attention” instead.
3. spark-review-gate runs in branch-diff scope — a real security check on the fix itself, not skipped because it’s “just a bug fix.”
4. Only after both pass does the routine open the PR.

## Multi-project scoping

One routine, not one per client — see ~/.spark-maintenance/projects.md. It processes projects **sequentially**, never in parallel, same discipline as every other part of SPARK. Each project entry carries its own severity threshold (client risk tolerance varies) and its own live-flag status.

## Live-production priority

Issues from a project with live: true in its config.md get handled with priority — don’t make them wait behind other projects in the daily queue. If the Routine scheduler supports event-based triggers, a live: true project’s post-deploy window is worth an immediate check rather than waiting for the next scheduled run — verify what your scheduler actually supports before relying on this.

What spark-fixer explicitly does not do

- No feature work. No “while I’m in here” improvements.
- No schema/migration changes — flag for manual review instead.
- No confident guessing when the root cause isn’t clear — say so plainly.
