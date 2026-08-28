import * as Sentry from "@sentry/react-native";

/**
 * INF-5: Sentry with PII scrubbing. `sendDefaultPii: false` plus a pure,
 * network-free `beforeSend` hook that redacts email and Philippine phone
 * numbers from every field a stack trace or breadcrumb could carry PII in.
 *
 * `scrubPii` is deliberately exported and pure (no Sentry SDK calls inside
 * it) so it's independently unit-testable with fake events — see
 * __tests__/sentry.test.ts, the permanent CI-blocking proof for INF-5.
 *
 * A one-time manual check (sending a real test event to the Sentry
 * dashboard and confirming redaction there too) is still owed by a human —
 * this file proves the redaction logic is correct, not that the Sentry
 * dashboard renders it correctly, which needs a real DSN/account.
 */

const EMAIL_RE = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
// Philippine mobile numbers: +63 9XXXXXXXXX or 09XXXXXXXXX (10 digits after
// the leading 9, optionally with separators). Deliberately conservative —
// false positives (redacting a non-PH number that happens to match) are
// far cheaper than false negatives (leaking a real number).
const PH_PHONE_RE = /(?:\+63|0)9\d{2}[-.\s]?\d{3}[-.\s]?\d{4}\b/g;

const REDACTED_EMAIL = "[REDACTED_EMAIL]";
const REDACTED_PHONE = "[REDACTED_PHONE]";

export function redactPii(value: string): string {
  return value.replace(EMAIL_RE, REDACTED_EMAIL).replace(PH_PHONE_RE, REDACTED_PHONE);
}

function redactDeep<T>(value: T): T {
  if (typeof value === "string") {
    return redactPii(value) as unknown as T;
  }
  if (Array.isArray(value)) {
    return value.map((item) => redactDeep(item)) as unknown as T;
  }
  if (value !== null && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(value as Record<string, unknown>)) {
      out[key] = redactDeep(val);
    }
    return out as unknown as T;
  }
  return value;
}

/**
 * Pure, network-free redaction of a Sentry event. Exported directly for
 * unit testing without needing the Sentry SDK's event type at all — kept
 * loosely typed (Record<string, unknown>) so tests can pass minimal fake
 * event shapes instead of constructing a full Sentry.Event.
 *
 * Redacts the ENTIRE event structurally, recursively — deliberately NOT a
 * field allow-list (remediation cycle 1, finding 8: the previous version
 * only scrubbed message/exception/extra/breadcrumbs/request, which was
 * fine the day it was written since nothing called Sentry.setUser() yet,
 * but the moment M1's auth code uses that ordinary idiom
 * (`Sentry.setUser({ email, id })`), the email ships in plaintext via
 * `event.user` — exactly the R23 pattern security.md §0 exists to catch:
 * a plausible, narrowly-scoped change elsewhere in the codebase silently
 * defeats a security control here, with the old test suite staying green
 * because it explicitly asserted "leaves fields outside the five alone").
 *
 * This is safe precisely because `redactDeep` is non-destructive for
 * anything that doesn't match the email/phone patterns — it only ever
 * REPLACES matching substrings and passes everything else through
 * byte-for-byte unchanged. So there is no allow-list/deny-list to
 * maintain and no future Sentry SDK field can be missed: `event_id`,
 * `timestamp`, `platform`, `level`, `release`, and similar metadata are
 * never going to match an email or PH-phone pattern in practice, and if
 * something genuinely unexpected ever did, redacting it is the safe
 * failure direction anyway.
 */
export function scrubEvent<T extends Record<string, unknown>>(event: T): T {
  return redactDeep(event);
}

export function initSentry(): void {
  const dsn = process.env.EXPO_PUBLIC_SENTRY_DSN;
  const environment = process.env.EXPO_PUBLIC_ENV ?? "dev";

  if (!dsn) {
    console.warn("[sentry] EXPO_PUBLIC_SENTRY_DSN is not set — Sentry will not report events.");
    return;
  }

  Sentry.init({
    dsn,
    environment,
    sendDefaultPii: false, // Never let the SDK attach IP/user data automatically — scrubEvent handles what we DO want to send.
    beforeSend(event) {
      return scrubEvent(event as unknown as Record<string, unknown>) as unknown as typeof event;
    },
  });
}
