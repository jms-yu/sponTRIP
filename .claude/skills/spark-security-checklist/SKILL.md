---
name: spark-security-checklist
description: Production-grade security checklist used at build time, during codebase audits, and at the final review gate. Use when writing, reviewing, or auditing code that handles auth, user data, payments, or external input. Security is the highest priority in SPARK.
---

# SPARK Security Checklist

Every project is production, for a real client, with real consequences.
Security is never optional polish.

## Secrets & configuration

- No hardcoded API keys, passwords, tokens, or connection strings —
  anywhere, including "temporary" debug code.
- `.env` holds real values and is gitignored. `.env.example` holds key
  NAMES with placeholder values and is committed.
- Different secrets for dev/staging/production. Never share prod
  credentials into a dev environment.

## Authentication & authorization

- Every route that should require login checks for it — **server-side**.
  Never trust a client-side check alone.
- Every action restricted by role or ownership is checked **server-side**.
  A user editing another user's data is the single most common real-world
  break.
- Passwords hashed with bcrypt or argon2. Never plain, never weakly hashed.
- Session/token expiry is sane; refresh flows don't silently extend
  forever.

## Data handling

- All database queries **parameterized**. Never string-concatenated SQL.
- All external input — form fields, query params, uploads, webhook
  payloads, device/n8n payloads — validated and sanitized before use.
- File uploads: type and size restricted, never executed, stored outside
  the web root or in proper object storage.
- Sensitive data (PII, payment info) encrypted at rest where the platform
  supports it. Never logged in plaintext.

## Network & infrastructure

- HTTPS enforced everywhere in production.
- CORS restricted to actual known origins. Never `*` in production.
- Rate limiting on auth endpoints and any expensive operation.
- Debug endpoints, verbose errors, and stack traces disabled in production.

## Dependencies

- No known-critical-vulnerability packages left unaddressed (`npm audit`,
  `pip-audit`, or stack equivalent).
- Dependencies reasonably current. Flag anything wildly out of date.

## Hardware-specific

- No hardcoded WiFi credentials or API keys in firmware shipped to
  production devices — use provisioning or secure storage.
- **No open debug/serial backdoor left enabled** in production firmware.

## Severity tagging

- **Critical**: exploitable now, real data or access at risk → **blocks GO**
- **High**: exploitable under realistic conditions → **blocks GO**
- **Medium**: hardening gap, not immediately exploitable → note, fix before
  handover
- **Low**: best-practice polish → note, non-blocking
