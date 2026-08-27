---
name: spark-n8n-protocol
description: How SPARK produces n8n workflow instructions — step-by-step guidance with verification checkpoints, never generated JSON. Use whenever a project involves n8n or workflow automation.
---

# SPARK n8n Protocol

Goal: detailed, buildable instructions the human executes in their own n8n
instance. **Never generate the workflow JSON from scratch** — it's
expensive in tokens and the human already knows n8n.

## Output location

`n8n/<workflow-name>.md` in the project repo. One file per workflow.

## Required structure

1. **Purpose** — one paragraph: what this workflow does and why.
2. **Trigger node** — exact type (Webhook, Schedule, etc.) and exact
   configuration values.
3. **Node-by-node build steps**, in order. Per node: type, purpose in one
   line, exact field values and expressions — precise n8n syntax, e.g.
   `{{ $json.email }}`.
4. **Verification checkpoints every 2–4 nodes** — mandatory:

   > Execute this node now (manual execute). Expected output shape:
   >
   > ```json
   > { "status": "ok", "id": "..." }
   > ```
   >
   > Do not continue until your output matches.

   This turns building into incremental diagnosis instead of building the
   whole thing blind and debugging a black box at the end.

5. **Error-handling branches** — specify explicitly (e.g. an IF node
   checking for a failed HTTP response, and what happens on failure). Never
   leave error paths implicit.
6. **Integration contract** — the exact payload shape, auth method, and
   error cases this workflow sends or receives, matching what the architect
   defined for the software side.

## When something breaks

Ask the human for one of:

- The exact error n8n shows on the failing node, **or**
- If the issue is structural, ask them to **export the workflow JSON and
  paste it**. Reading JSON to diagnose is cheap; generating it is what
  we're avoiding. Use it to see their actual state, then give a precise,
  targeted correction — not a full rebuild.

## Rules

- Never output a full workflow JSON blob unless the human explicitly asks
  for an importable file as a deliberate exception.
- Keep instructions numbered and unambiguous. Assume the human knows n8n's
  UI but not this workflow's logic.
