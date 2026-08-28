// Unit tests for send-test-push's auth gating and validation — the parts
// that don't require a physical device. Real delivery-within-10s (INF-7) is
// inherently a manual check against a physical device; see the M0 report
// for the exact manual steps. Run with:
//   deno test --allow-net --allow-env supabase/functions/tests/send_test_push.test.ts
import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { handler } from "../send-test-push/index.ts";

const CRON_SECRET = "test-cron-secret";
Deno.env.set("CRON_SHARED_SECRET", CRON_SECRET);

function makeRequest(body: unknown, secret?: string): Request {
  return new Request("http://localhost/functions/v1/send-test-push", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(secret !== undefined ? { "x-cron-secret": secret } : {}),
    },
    body: JSON.stringify(body),
  });
}

// Regression test for finding 11 (Review Gate, remediation cycle 1): with
// ALLOW_TEST_PUSH unset (the production default — never set in prod
// secrets), this debug endpoint must 404 rather than reveal it exists at
// all, even with a correct secret.
Deno.test("send-test-push: 404s when ALLOW_TEST_PUSH is not set to \"true\" (the production-safe default)", async () => {
  const previous = Deno.env.get("ALLOW_TEST_PUSH");
  try {
    Deno.env.delete("ALLOW_TEST_PUSH");
    const res = await handler(
      makeRequest({ expo_push_token: "ExponentPushToken[abc]", title: "t", body: "b" }, CRON_SECRET),
    );
    assertEquals(res.status, 404);
    assertEquals((await res.json()).error, "not_found");
  } finally {
    // Restore, rather than leaving the env mutated for whichever test runs
    // next — Deno.test() callbacks share process-wide env state, so a test
    // that deletes a var without restoring it silently corrupts every
    // later test in the file (the exact bug this comment replaced).
    if (previous === undefined) Deno.env.delete("ALLOW_TEST_PUSH");
    else Deno.env.set("ALLOW_TEST_PUSH", previous);
  }
});

// Every test below needs the endpoint actually enabled, same as a real
// dev/stage deployment would configure. Set inside a beforeEach-equivalent
// (each test's own first line) rather than once at module scope, so this
// doesn't depend on Deno running tests in declaration order.
function enableTestPush(): void {
  Deno.env.set("ALLOW_TEST_PUSH", "true");
}

Deno.test("send-test-push: rejects requests without the correct shared secret", async () => {
  enableTestPush();
  const res = await handler(
    makeRequest({ expo_push_token: "ExponentPushToken[abc]", title: "t", body: "b" }, "wrong"),
  );
  assertEquals(res.status, 401);
});

Deno.test("send-test-push: rejects a malformed push token", async () => {
  enableTestPush();
  const res = await handler(
    makeRequest({ expo_push_token: "not-a-token", title: "t", body: "b" }, CRON_SECRET),
  );
  assertEquals(res.status, 400);
});

Deno.test("send-test-push: rejects a missing body field", async () => {
  enableTestPush();
  const res = await handler(makeRequest({ expo_push_token: "ExponentPushToken[abc]" }, CRON_SECRET));
  assertEquals(res.status, 400);
});
