---
name: spark-state-protocol
description: Defines the .spark/ state file structure that all SPARK orchestrator commands read from and write to. Use when creating a new SPARK project, reading project state, or checkpointing progress. This is the shared-memory backbone of the SPARK Protocol.
---

# SPARK State Protocol

Files are the memory. No agent has memory across sessions; `.spark/` does.

## Who writes what — the rule

Orchestrator commands own every state file write. Agents run in isolated contexts, several have no Write tool at all, and an agent that "forgot" to checkpoint leaves state silently wrong. So:

- **Agents:** receive context, do work, return content. The only agent that touches the repo's git history is `spark-developer` (code commits), and, in v1.2, `spark-fixer` (maintenance commits, on a fix branch only).
- **Orchestrators:** read state → invoke agent → write the result to the right file → update `progress.md` → move to the next phase.

If an orchestrator is interrupted, the last completed phase is on disk. That's the whole design.

## File map

| File                    | Written by                          | Purpose                                                     |
| ----------------------- | ----------------------------------- | ----------------------------------------------------------- |
| `config.md`             | spark-plan (once)                   | Project settings, stack, deploy target, `live:` flag (v1.2) |
| `project.md`            | spark-plan / spark-audit            | Brief, client, constraints, interview answers               |
| `plan.md`               | spark-plan, spark-update            | The approved plan, versioned, with changelog                |
| `proposal.md`           | spark-plan, spark-update            | Client-facing scope document (layman English)               |
| `prototype-manifest.md` | spark-prototype (v1.2)              | Screens produced, mapped to plan.md features                |
| `environment.md`        | spark-dev (Milestone 0/R) (v1.2)    | Selected environment recipe, per-tier config summary        |
| `milestones.md`         | spark-plan, spark-update, spark-dev | Milestone table + acceptance criteria + status              |
| `decisions.md`          | all orchestrators                   | Append-only log: what was decided, by which phase, when     |
| `progress.md`           | all orchestrators, every phase      | Live checkpoint + blockers                                  |
| `security.md`           | spark-plan, spark-audit, spark-dev  | Requirements + findings, tagged by severity                 |
| `codebase.md`           | spark-audit                         | Legacy codebase map                                         |
| `finalize-report.md`    | spark-finalize (v1.2)               | Whole-project security/performance/edge-case findings       |
| `manual-test-script.md` | spark-finalize (v1.2)               | Consolidated pre-handover manual test script                |
| `pr-draft.md`           | spark-dev                           | Ready PR title/body per milestone                           |
| `user-guide-draft.md`   | spark-dev                           | Grows per milestone, polished at handover                   |
| `reports/*.md`          | spark-document                      | Weekly/monthly/timeline                                     |

One file lives outside any single repo (new in v1.2): `~/.spark-maintenance/projects.md` — the config list the daily maintenance routine reads across all your client projects. It's not part of any one project's `.spark/` because it's about you as the operator, not about any single engagement. See `spark-maintenance-protocol`.

## Creating `.spark/` for a new project

**`config.md`**

# SPARK Config

project_created: <date>
stack: <filled in after Gate 1 — the user's chosen stack>
deploy_target: <Vercel | VPS | client infra | TBD>
live: false # v1.2 — flip to true the first time real users touch this # project. See spark-environment-protocol and section 4.6 # of the SPARK Protocol doc for what changes when this is true.

## Usage note

Gates (spark-plan-validator, spark-review-gate, spark-performance-auditor)
run Opus at xhigh effort. If usage limits bite, switch these agents to
`model: sonnet` in ~/.claude/agents/ — keep `effort: xhigh`.

**`progress.md`**

# Progress / Checkpoint

current_command: none
current_phase: none
last_updated: <date>

## Blockers

(none yet)

## Checkpoint log

- <date> — .spark/ initialized

**`decisions.md`**

# Decision Log (append-only — never delete entries, only add)

## <date> — .spark initialized

Initial state files created.

Other files are created with real content by spark-plan phase 6 — don’t pre-create empty shells. prototype-manifest.md, environment.md, finalize-report.md, and manual-test-script.md are created only when their respective commands (/spark-prototype, /spark-dev Milestone 0, /spark-finalize) actually run — same rule.

## Checkpointing rules (orchestrators, every phase)

1. **Before a phase**: read progress.md to confirm you're not redoing
   completed work.
2. **After a phase**: append to decisions.md (what happened and why),
   update progress.md (`current_command`, `current_phase`,
   `last_updated`), and write whatever file that phase owns.
3. **On failure or interruption**: still checkpoint what completed before
   the failure. Never leave progress.md stale or wrong — a wrong checkpoint
   is worse than none.
4. **decisions.md is APPEND-ONLY.** Never rewrite history. If a decision is
   later reversed, add a new entry saying so; don't delete the old one.
5. **Blockers** go in progress.md under `## Blockers` with the date they
   started and who they're waiting on ("client" or a specific task). Remove
   only when resolved, noting the resolution date.

## Resuming after an interruption

Any command checks progress.md first. If `current_command` matches the
command being run and the phase is incomplete, **announce the checkpoint
and resume from that phase** — never restart from Phase 0.

`/spark-status` is the read-only way to check this without resuming
anything.

## Versioning plan.md and proposal.md

Every approved change bumps the version. Keep a changelog at the top:

```markdown
## Changelog

- v1.2 — 2026-08-03 — Added SMS notifications (client request) — approved by user
- v1.1 — 2026-07-20 — Adjusted milestone 4 timeline — approved by user
- v1.0 — 2026-07-01 — Initial plan approved
```
