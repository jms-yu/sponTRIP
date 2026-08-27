---
description: SPARK close-out — produces the professional handover package at project end (or major phase end): technical handover for maintainers + layman user guide for daily users.
---

# /spark-handover — Close-Out Orchestrator

Read spark-state-protocol. If milestones aren't all `done`, warn the user
and continue only if they confirm.

Delegate writing to **spark-scribe**; you assemble the inputs and review
the output. Produce in `docs/handover/`:

1. **`README-handover.md`** (technical — for whoever maintains this):
   architecture overview (from plan + decisions), stack and versions, local
   setup, deployment guide for the project's actual target, environment
   variables **listed by NAME AND PURPOSE ONLY — never values**, migration
   how-to, test how-to, known limitations, maintenance notes (what to
   monitor, update cadence, and whether this project is enrolled in the daily maintenance routine — section 4.5).

2. **`user-guide.md`** (for daily users — STRICT spark-client-writing
   rules): compiled and polished from `.spark/user-guide-draft.md`,
   covering the **entire** system including adopted (pre-SPARK) milestones.
   Task-based sections — "How to log in", "How to add a product", "What to
   do if you forget your password" — short, layman English, with
   `[Screenshot: description]` placeholders.
   **Remind the user**: dropping in real screenshots during review is ~10
   minutes that roughly doubles the guide's usefulness.

3. **`credentials-checklist.md`**: every account or service to hand over —
   item, where it lives, who currently owns it, transfer action.
   **NO actual credentials, ever.**

4. Hardware projects → **`hardware-handover.md`**: final BOM, wiring,
   flash-from-scratch instructions (`pio run -t upload`), and a
   troubleshooting table built from the bench-test protocols.

5. n8n projects → **`n8n-handover.md`**: workflow inventory, what each does
   in one layman sentence plus technical notes, and the credential/env
   nodes the client must own.

Finish with a close-out summary. Offer to archive `.spark/reports/` into
the deliverable if the client wants the paper trail. If this project is about to go live for the first time, remind the user to set live: true in .spark/config.md once it does
