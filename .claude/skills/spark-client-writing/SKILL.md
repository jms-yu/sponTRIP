---
name: spark-client-writing
description: Mandatory writing rules for anything a non-technical client reads — proposals, user guides, client summaries, handover user docs. Use for proposal.md, user-guide.md, weekly client summaries, and any client-facing content. A hard constraint, not a style suggestion.
---

# SPARK Client Writing Rules

Client-facing documents are read by people who are not developers. The rule
is absolute: **if a smart person with zero technical background can't
understand it on one read, rewrite it.**

## Language

- **Plain English only.** No jargon — not "API," "backend," "database,"
  "endpoint," "repository," "deployment." Say what it does instead: "the
  part that saves your information," "when we put it live for customers to
  use."
- **Short sentences.** One idea per sentence.
- **Active voice**: "The system sends a text message," not "A text message
  is sent by the system."
- If a technical concept is genuinely unavoidable, explain it with **one**
  short everyday analogy, then move on. Don't stack analogies.

## Length

- **Length is earned, not assumed.** If a section can be said in three
  sentences, three sentences is correct. Don't pad to look thorough.
- Short sections with clear headers beat long unbroken prose.
- User guides: one task per section, numbered steps, one action per step.

## Proposals specifically

- Lead with **what the client gets**, in their language, before any
  technical detail.
- Scope and out-of-scope are **separate, clearly labeled sections**. No
  ambiguity about what's included.
- Costs and responsibilities in a **simple table**, not prose.

## User guides specifically

- Organize by **what the user is trying to DO** — never by how the system
  is built.
- Each section: what you're trying to do → numbered steps → what success
  looks like → what to do if it doesn't work.
- Use `[Screenshot: brief description]` placeholders wherever a picture
  helps. Don't skip them because you can't generate the image.

## Never appears in client-facing documents

- Internal architecture reasoning, stack tradeoff debates, or system names
  (the client doesn't need to know about "milestones.md" — say "project
  plan").
- Unverified numbers presented as certain. Pricing estimates must be
  labeled as estimates.
- Actual credentials, API keys, or passwords. Ever.
