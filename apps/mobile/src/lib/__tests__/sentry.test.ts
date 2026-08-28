import { redactPii, scrubEvent } from "../sentry";

describe("redactPii", () => {
  it("redacts an email address", () => {
    expect(redactPii("contact me at juan.delacruz@example.com please")).toBe(
      "contact me at [REDACTED_EMAIL] please",
    );
  });

  it("DELIBERATE CI DRILL #2 — safe to delete, verifying branch protection blocks merge", () => {
    expect(1 + 1).toBe(3);
  });

  it("redacts a +63 formatted PH phone number", () => {
    expect(redactPii("call +639171234567 now")).toBe("call [REDACTED_PHONE] now");
  });

  it("redacts a 09XXXXXXXXX formatted PH phone number", () => {
    expect(redactPii("call 09171234567 now")).toBe("call [REDACTED_PHONE] now");
  });

  it("redacts multiple PII instances in the same string", () => {
    expect(redactPii("email a@b.com or call 09171234567")).toBe(
      "email [REDACTED_EMAIL] or call [REDACTED_PHONE]",
    );
  });

  it("leaves clean text untouched", () => {
    expect(redactPii("event confirmed successfully")).toBe("event confirmed successfully");
  });
});

describe("scrubEvent", () => {
  it("redacts PII from event.message", () => {
    const event = { message: "user juan@example.com failed to sign in" };
    const scrubbed = scrubEvent(event);
    expect(scrubbed.message).toBe("user [REDACTED_EMAIL] failed to sign in");
  });

  it("redacts PII from event.exception (nested object)", () => {
    const event = {
      exception: {
        values: [{ value: "Error for user 09171234567", type: "Error" }],
      },
    };
    const scrubbed = scrubEvent(event) as {
      exception: { values: Array<{ value: string; type: string }> };
    };
    expect(scrubbed.exception.values[0]?.value).toBe("Error for user [REDACTED_PHONE]");
  });

  it("redacts PII from event.extra", () => {
    const event = { extra: { userEmail: "test@example.com", note: "fine" } };
    const scrubbed = scrubEvent(event) as { extra: { userEmail: string; note: string } };
    expect(scrubbed.extra.userEmail).toBe("[REDACTED_EMAIL]");
    expect(scrubbed.extra.note).toBe("fine");
  });

  it("redacts PII from event.breadcrumbs (array of objects)", () => {
    const event = {
      breadcrumbs: [
        { message: "logged in as owner@example.com", category: "auth" },
        { message: "clicked button", category: "ui" },
      ],
    };
    const scrubbed = scrubEvent(event) as {
      breadcrumbs: Array<{ message: string; category: string }>;
    };
    expect(scrubbed.breadcrumbs[0]?.message).toBe("logged in as [REDACTED_EMAIL]");
    expect(scrubbed.breadcrumbs[1]?.message).toBe("clicked button");
  });

  it("redacts PII from event.request", () => {
    const event = {
      request: { url: "https://api.example.com/users?email=a@b.com", headers: { "X-User": "09171234567" } },
    };
    const scrubbed = scrubEvent(event) as {
      request: { url: string; headers: Record<string, string> };
    };
    expect(scrubbed.request.url).toContain("[REDACTED_EMAIL]");
    expect(scrubbed.request.headers["X-User"]).toBe("[REDACTED_PHONE]");
  });

  // Regression tests for finding 8 (Review Gate, remediation cycle 1): the
  // old allow-list version explicitly did NOT scrub these fields (and had
  // a test proving it) — the moment M1's auth code calls the ordinary
  // `Sentry.setUser({ email, id })` idiom, the email would ship in
  // plaintext via event.user, with this exact test suite staying green.
  // Now the whole event is scrubbed structurally, so these are covered
  // without needing to remember to add them to a list.
  it("redacts PII from event.user (the Sentry.setUser() idiom M1's auth code will use)", () => {
    const event = { user: { id: "abc123", email: "juan.delacruz@example.com", username: "juan" } };
    const scrubbed = scrubEvent(event) as { user: { id: string; email: string; username: string } };
    expect(scrubbed.user.email).toBe("[REDACTED_EMAIL]");
    expect(scrubbed.user.id).toBe("abc123"); // non-PII-shaped values pass through unchanged
  });

  it("redacts PII from event.tags", () => {
    const event = { tags: { reporter_email: "test@example.com", feature: "checkin" } };
    const scrubbed = scrubEvent(event) as { tags: { reporter_email: string; feature: string } };
    expect(scrubbed.tags.reporter_email).toBe("[REDACTED_EMAIL]");
    expect(scrubbed.tags.feature).toBe("checkin");
  });

  it("redacts PII from event.contexts", () => {
    const event = { contexts: { profile: { phone: "09171234567" } } };
    const scrubbed = scrubEvent(event) as { contexts: { profile: { phone: string } } };
    expect(scrubbed.contexts.profile.phone).toBe("[REDACTED_PHONE]");
  });

  it("redacts PII from event.logentry", () => {
    const event = { logentry: { message: "Login failed for owner@example.com" } };
    const scrubbed = scrubEvent(event) as { logentry: { message: string } };
    expect(scrubbed.logentry.message).toBe("Login failed for [REDACTED_EMAIL]");
  });

  it("leaves non-PII metadata fields byte-for-byte unchanged (redaction is non-destructive, not an allow-list)", () => {
    const event = { level: "error", event_id: "abc123", platform: "javascript", tags: { feature: "checkin" } };
    const scrubbed = scrubEvent(event);
    expect(scrubbed).toEqual(event);
  });

  it("leaves an event with no PII completely unchanged in content", () => {
    const event = { message: "clean event", extra: { count: 5 } };
    const scrubbed = scrubEvent(event);
    expect(scrubbed).toEqual(event);
  });
});
