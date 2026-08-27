// Tests for mint-storage-url (INF-9's R2 gatekeeper). Auth-gating and
// bucket-rule tests run against the handler directly (fast, no network to
// R2 needed — signing is computed locally via aws4fetch). The "does the
// minted URL actually get denied by real R2 when scope doesn't match" half
// of INF-9 is covered separately by ci/scripts/r2-denied-read-test.ts
// against real dev-tier R2 buckets, per the M0 spec ("verified by a denied
// read attempt, not by inspection").
//
// Requires a running local Supabase stack for the "authenticated" cases
// (creates throwaway users via the service-role admin API). Run with:
//   deno test --allow-net --allow-env supabase/functions/tests/mint_storage_url.test.ts
import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";
import { handler } from "../mint-storage-url/index.ts";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "http://127.0.0.1:54321";
const ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

Deno.env.set("SUPABASE_URL", SUPABASE_URL);
Deno.env.set("SUPABASE_ANON_KEY", ANON_KEY);
Deno.env.set("SUPABASE_SERVICE_ROLE_KEY", SERVICE_ROLE_KEY);
Deno.env.set("R2_ACCOUNT_ID", Deno.env.get("R2_ACCOUNT_ID") ?? "test-account");
Deno.env.set("R2_ACCESS_KEY_ID", Deno.env.get("R2_ACCESS_KEY_ID") ?? "test-key");
Deno.env.set("R2_SECRET_ACCESS_KEY", Deno.env.get("R2_SECRET_ACCESS_KEY") ?? "test-secret");
Deno.env.set("R2_ENV_PREFIX", "dev");

function makeRequest(body: unknown, jwt?: string): Request {
  return new Request("http://localhost/functions/v1/mint-storage-url", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(jwt ? { Authorization: `Bearer ${jwt}` } : {}),
    },
    body: JSON.stringify(body),
  });
}

Deno.test("mint-storage-url: rejects requests with no Authorization header", async () => {
  const res = await handler(makeRequest({ bucket: "general", key: "dev/general/x/photo.jpg", operation: "read" }));
  assertEquals(res.status, 401);
  const json = await res.json();
  assertEquals(json.error, "unauthenticated");
});

Deno.test("mint-storage-url: rejects an invalid JWT", async () => {
  const res = await handler(
    makeRequest({ bucket: "general", key: "dev/general/x/photo.jpg", operation: "read" }, "not-a-real-jwt"),
  );
  assertEquals(res.status, 401);
});

Deno.test("mint-storage-url: rejects malformed body even with no auth (400 takes priority check order aside, still unauth first)", async () => {
  const res = await handler(makeRequest({ nope: true }));
  assertEquals(res.status, 401); // auth is checked before body validation by design
});

Deno.test({
  name: "mint-storage-url: authenticated flows (receipts/verification always 403, general scoped correctly)",
  ignore: SERVICE_ROLE_KEY === "" || ANON_KEY === "",
  fn: async () => {
    const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);
    const email = `m0-test-${crypto.randomUUID()}@example.test`;
    const password = "correct horse battery staple 123";

    const { data: created, error: createError } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });
    if (createError || !created?.user) {
      throw new Error(`failed to create test user: ${createError?.message}`);
    }
    const uid = created.user.id;

    try {
      const anon = createClient(SUPABASE_URL, ANON_KEY);
      const { data: session, error: signInError } = await anon.auth.signInWithPassword({ email, password });
      if (signInError || !session?.session) {
        throw new Error(`failed to sign in test user: ${signInError?.message}`);
      }
      const jwt = session.session.access_token;

      // receipts -> always 403 location_not_available
      const receiptsRes = await handler(
        makeRequest({ bucket: "receipts", key: "anything", operation: "read" }, jwt),
      );
      assertEquals(receiptsRes.status, 403);
      assertEquals((await receiptsRes.json()).error, "location_not_available");

      // verification -> always 403 location_not_available
      const verificationRes = await handler(
        makeRequest({ bucket: "verification", key: "anything", operation: "read" }, jwt),
      );
      assertEquals(verificationRes.status, 403);
      assertEquals((await verificationRes.json()).error, "location_not_available");

      // general, own prefix -> 200 with a minted URL
      const ownKeyRes = await handler(
        makeRequest({ bucket: "general", key: `dev/general/${uid}/avatar.jpg`, operation: "read" }, jwt),
      );
      assertEquals(ownKeyRes.status, 200);
      const ownKeyJson = await ownKeyRes.json();
      assertEquals(typeof ownKeyJson.url, "string");
      assertEquals(typeof ownKeyJson.expires_at, "string");

      // general, someone else's prefix -> 403 invalid_key_scope
      const otherKeyRes = await handler(
        makeRequest({ bucket: "general", key: "dev/general/someone-else-uid/avatar.jpg", operation: "read" }, jwt),
      );
      assertEquals(otherKeyRes.status, 403);
      assertEquals((await otherKeyRes.json()).error, "invalid_key_scope");

      // --- Path-traversal regression tests (remediation cycle 1, finding 1) ---
      // Review Gate proved live, against this exact handler with a real
      // signed-in JWT: a `../` sequence long enough to pop the bucket name
      // itself off the path defeated the old `key.startsWith(expectedPrefix)`
      // raw-string check, because the WHATWG URL parser normalizes `../`
      // segments AFTER that check but BEFORE signing. Got 200 with a valid
      // presigned URL for another user's `general` object, a `receipts`
      // object, a `verification` object, and a WRITE into `verification`.
      // All of the below must now be rejected.

      // general bucket, traversal that would reach another user's own prefix
      const crossUserTraversalRes = await handler(
        makeRequest(
          { bucket: "general", key: `dev/general/${uid}/../someone-else-uid/avatar.jpg`, operation: "read" },
          jwt,
        ),
      );
      assertEquals(crossUserTraversalRes.status, 400);
      assertEquals((await crossUserTraversalRes.json()).error, "invalid_request");

      // general bucket, traversal deep enough to pop the bucket name itself
      // and reach receipts — the exact live-proven exploit shape.
      const traversalToReceiptsRes = await handler(
        makeRequest(
          { bucket: "general", key: `../receipts/${envPrefixKeyFor(uid)}/some-receipt.jpg`, operation: "read" },
          jwt,
        ),
      );
      assertEquals(traversalToReceiptsRes.status, 400);
      assertEquals((await traversalToReceiptsRes.json()).error, "invalid_request");

      // Same shape, but as a WRITE into verification — the reviewer's most
      // severe reproduction.
      const traversalWriteToVerificationRes = await handler(
        makeRequest(
          { bucket: "general", key: `dev/general/${uid}/../../verification/forged-id.jpg`, operation: "write" },
          jwt,
        ),
      );
      assertEquals(traversalWriteToVerificationRes.status, 400);
      assertEquals((await traversalWriteToVerificationRes.json()).error, "invalid_request");

      // Percent-encoded traversal variant (%2e%2e%2f) — must not slip past
      // the raw-string ".." check via decode-after-validate.
      const encodedTraversalRes = await handler(
        makeRequest(
          { bucket: "general", key: `dev/general/${uid}/%2e%2e%2fsomeone-else-uid/x.jpg`, operation: "read" },
          jwt,
        ),
      );
      assertEquals(encodedTraversalRes.status, 400);
      assertEquals((await encodedTraversalRes.json()).error, "invalid_request");

      // Backslash variant (some parsers/proxies treat \ as a path separator).
      const backslashTraversalRes = await handler(
        makeRequest(
          { bucket: "general", key: `dev/general/${uid}/..\\someone-else-uid\\x.jpg`, operation: "read" },
          jwt,
        ),
      );
      assertEquals(backslashTraversalRes.status, 400);
      assertEquals((await backslashTraversalRes.json()).error, "invalid_request");
    } finally {
      await admin.auth.admin.deleteUser(uid);
    }
  },
});

/** Helper only used by the traversal regression tests above, to keep the
 * "reach receipts via traversal" key shape self-documenting. */
function envPrefixKeyFor(uid: string): string {
  return `dev/general/${uid}`;
}
