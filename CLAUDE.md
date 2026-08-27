```markdown
# Project: <PROJECT sponTRIP>

This project uses the **SPARK Protocol**. Before ANY work in this repo —
planning, developing, fixing, reporting — read `.spark/` state files first:

- `.spark/progress.md` — **always check this first.** If it shows a command
  mid-flight, that command resumes from its checkpoint rather than
  restarting.
- `.spark/config.md` — project settings, stack, deploy target, live: flag — check this before any milestone, fix, or update work; if true, the live-production rules in section 4.6 of the SPARK Protocol doc apply.
- `.spark/plan.md` — the approved plan. Status must be APPROVED before any
  /spark-dev work
- `.spark/environment.md` — the selected environment recipe for this project (present after Milestone 0/R)
- `.spark/milestones.md` — current milestone and acceptance criteria
- `.spark/decisions.md` — history of what's been decided and why
- `.spark/security.md` — security requirements for this project
- `.spark/finalize-report.md ` — present only after /spark-finalize has run; read it before /spark-handover
- `.spark/codebase.md` — present only if this project was onboarded via /spark-audit

## Rules for this repo

- **Never work directly on `main`.** Every milestone, fix, and update happens on its own branch per the spark-commit skill.
- **Never run `git push`** — that is the human’s action, always. This includes the daily maintenance routine, which opens PRs but never merges.
- Follow spark-security-checklist for all code touching auth, payments, or user data — including the live-production additions if live: true.
- Client-facing content (proposal.md, user-guide.md, client summaries) must follow spark-client-writing rules — plain English, no jargon.
- If this repo has a `hardware/` folder, follow spark-hardware-protocol — PlatformIO only, never Arduino IDE. If it has an `n8n/` folder, follow spark-n8n-protocol — step-by-step instructions, never generated JSON.
- Environment setup follows spark-environment-protocol’s recipe recorded in .spark/environment.md.
- If this project is enrolled in the daily maintenance routine, it appears in ~/.spark-maintenance/projects.md — not in this repo’s .spark/.

## Stack

<Filled in after Gate 1 — e.g. "Next.js 14 + Supabase + Vercel" — so any session knows the tech context without re-deriving it.>
```

---
