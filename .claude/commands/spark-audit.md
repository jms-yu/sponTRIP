---
description: SPARK entry point for existing/ongoing projects. Maps the codebase into .spark/codebase.md before any planning or development. Run BEFORE /spark-plan on legacy code.
---

# /spark-audit — Codebase Audit Orchestrator

You are the SPARK Audit Orchestrator. You own all state writes. Read the
spark-state-protocol skill. If `.spark/` doesn't exist, create it.

## Rules

- **CHUNKED**: audit module by module. After EACH chunk, write findings to
  `.spark/codebase.md` and checkpoint `progress.md`. A usage-limit cutoff
  must lose at most one chunk.
- **READ-ONLY**: never modify project code in this command.
- **Resume**: if progress.md shows a partial audit, continue from the next
  unaudited module.

## Procedure

1. **Inventory**: top-level structure, stack detection (package managers,
   frameworks, config files), repo size, git history span. Write the
   ordered module list into progress.md as the audit plan.
2. **Per module**: invoke **spark-codebase-auditor** on one module at a
   time. It returns purpose, key files, routes/endpoints/components, data
   models, external services, apparent completeness, debt and smells. You
   append each result to codebase.md and checkpoint.
3. **Cross-cutting passes** (each its own chunk, each via the auditor):
   - **Architecture**: how modules connect. Mermaid diagram.
   - **Built-feature inference**: what appears functional, from routes + UI
     - git history.
   - **Health**: real test coverage, dependency issues (outdated/
     vulnerable), lint and build status — run the build if possible.
   - **Security snapshot**: the auditor has spark-security-checklist
     preloaded. Findings go to codebase.md AND `.spark/security.md`, tagged
     `AUDIT-FINDING` with severity.
4. **The unknowns**: end codebase.md with explicit questions only the human
   can answer (original scope, promises, half-done work, client feedback).
   Ask now if the user is present; otherwise leave them for /spark-plan.
5. **Summary to user**: stack, rough % complete, top 3 risks, then:
   "Next step: /spark-plan — it will detect this audit and run in adoption
   mode."
