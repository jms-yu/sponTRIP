---
description: SPARK status — instant answer to "where is everything?" Reads state files only. Your re-entry point after breaks and usage-limit cutoffs.
---

# /spark-status

Read spark-state-protocol. **READ ONLY** — never modify anything, and
never resume work. Resuming is always the user explicitly re-running the
interrupted command. Delegate to **spark-scribe** if the read is heavy;
answer directly if it's trivial.

Report concisely:

1. Project, plan version, Gate-1 status.
2. Milestones: done / awaiting-acceptance / in-progress / pending.
3. **The exact checkpoint** if anything is mid-flight: "Milestone 3, phase
   4/6 complete (QA passed; Review Gate pending). Resume with:
   `/spark-dev 3`".
4. Blockers, with how long they've been open, from progress.md.
5. What needs the human right now: gates awaiting, checklists untested, branches unpushed, pricing unverified in proposal.md, **finalize-report.md findings unread if present.**
6. Anything stale — e.g. no weekly report in over 7 days → suggest
   `/spark-document`; all milestones done but no /spark-finalize run yet → suggest it before handover.
