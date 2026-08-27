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

Deno.test("send-test-push: rejects requests without the correct shared secret", async () => {
  const res = await handler(
    makeRequest({ expo_push_token: "ExponentPushToken[abc]", title: "t", body: "b" }, "wrong"),
  );
  assertEquals(res.status, 401);
});

Deno.test("send-test-push: rejects a malformed push token", async () => {
  const res = await handler(
    makeRequest({ expo_push_token: "not-a-token", title: "t", body: "b" }, CRON_SECRET),
  );
  assertEquals(res.status, 400);
});

Deno.test("send-test-push: rejects a missing body field", async () => {
  const res = await handler(makeRequest({ expo_push_token: "ExponentPushToken[abc]" }, CRON_SECRET));
  assertEquals(res.status, 400);
});
