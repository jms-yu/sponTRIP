---
description: SPARK reporting — generates/updates weekly and monthly progress reports and the project timeline from state files. Cheap (Haiku). Run after milestones or weekly.
argument-hint: [weekly | monthly | timeline | all]
---

# /spark-document — Reporting Orchestrator

Read spark-state-protocol. This command READS state and WRITES to
`.spark/reports/`. Delegate all writing to **spark-scribe** (Haiku).

Inputs: milestones.md, progress.md (including blockers), decisions.md
entries since the last report, and `git log` since the last report.

Outputs (default: whatever is due; the argument overrides):

1. **`reports/weekly-YYYY-MM-DD.md`** — done this week (from decisions +
   git), in progress, blockers **with start dates and owner** ("waiting on
   client's Stripe credentials since Jul 12 — client"), next week, overall
   % (milestones done / total; adopted A-milestones count toward it).
2. **`reports/monthly-YYYY-MM.md`** — rollup of the weeklies: milestone
   status table, timeline health vs plan, notable decisions, risk changes.
3. **`reports/timeline.md`** — every milestone: planned dates, actual
   dates, status, variance. Flag if projected completion slips past the
   deadline in project.md.

Reports are internal, so a technical tone is fine — **but** each weekly
ends with a short **"Client summary"** paragraph in layman English (scribe
has spark-client-writing preloaded) that the user can paste straight to the
client.
