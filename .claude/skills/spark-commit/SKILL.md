---
name: spark-commit
description: Git commit and branching procedure for all SPARK development work. Use when committing code during /spark-dev, /spark-fix, or /spark-update. Enforces milestone branches, conventional commits, and the rule that only the human runs git push.
---

# SPARK Commit Protocol

## Branching

- One branch per milestone: `milestone/NN-short-name` (e.g.
  `milestone/03-auth`).
- Fixes with no open milestone branch: `fix/short-name`.
- **NEVER commit directly to `main`.** If `main` is checked out, create the
  correct branch first.

## Commit format (Conventional Commits)

```
<type>(<scope>): <short summary>

<optional body — what and why, not how>
```

Types: `feat`, `fix`, `test`, `docs`, `chore`, `refactor`, `security`.
Example: `feat(auth): add password reset via emailed link`

## Granularity

Commit in logical units as work completes — not one giant commit at
milestone end, not one commit per file. A commit should be one coherent
change a reviewer could understand on its own.

## What agents NEVER do

- **`git push`** — reserved for the human, always. Agents commit locally.
- Force-push, rebase shared history, or any destructive git operation.
- Commit directly to `main`.
- Commit secrets, `.env` (only `.env.example`), or credentials.

## At milestone close

1. Final commit of the milestone's work.
2. `pr-draft.md` gets: suggested PR title (conventional format), body
   (summary, key changes, test evidence from QA, migration notes), and the
   exact command for the human:
   ```
   git push -u origin milestone/NN-short-name
   ```
   then open the PR on GitHub and merge after manual testing passes.
3. **Never mark a milestone `done`** in milestones.md until the human
   confirms the merge. Status stays `awaiting-acceptance` until then.
