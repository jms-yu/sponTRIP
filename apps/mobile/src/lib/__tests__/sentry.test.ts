import { redactPii, scrubEvent } from "../sentry";

describe("redactPii", () => {
  it("redacts an email address", () => {
    expect(redactPii("contact me at juan.delacruz@example.com please")).toBe(
      "contact me at [REDACTED_EMAIL] please",
    );
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

  it("does not touch fields outside the five scrubbed fields", () => {
    const event = { level: "error", tags: { foo: "bar" } };
    const scrubbed = scrubEvent(event);
    expect(scrubbed).toEqual(event);
  });

  it("leaves an event with no PII completely unchanged in content", () => {
    const event = { message: "clean event", extra: { count: 5 } };
    const scrubbed = scrubEvent(event);
    expect(scrubbed).toEqual(event);
  });
});
