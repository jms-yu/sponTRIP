// Integration test for scheduled-smoke-ok / scheduled-smoke-fail — the
// permanent CI-blocking proof for INF-4 (per M0 spec: the real T+2min
// pg_cron wall-clock firing is a one-time manual proof, NOT re-run in CI;
// THIS test is what runs on every PR instead — it invokes both functions'
// success/failure-recording logic directly and asserts job_runs correctness).
//
// Requires a running local Supabase stack (`supabase start`) — reads
// SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY / CRON_SHARED_SECRET from the
// environment. Run with:
//   deno test --allow-net --allow-env supabase/functions/tests/scheduled_smoke.integration.test.ts
import { assertEquals, assertExists } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";
import { handler as okHandler } from "../scheduled-smoke-ok/index.ts";
import { handler as failHandler } from "../scheduled-smoke-fail/index.ts";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "http://127.0.0.1:54321";
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
const CRON_SECRET = Deno.env.get("CRON_SHARED_SECRET") ?? "test-cron-secret";

Deno.env.set("SUPABASE_URL", SUPABASE_URL);
Deno.env.set("SUPABASE_SERVICE_ROLE_KEY", SERVICE_ROLE_KEY);
Deno.env.set("CRON_SHARED_SECRET", CRON_SECRET);

function makeRequest(path: string, body: unknown, secret?: string): Request {
  return new Request(`http://localhost/functions/v1/${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(secret !== undefined ? { "x-cron-secret": secret } : {}),
    },
    body: JSON.stringify(body),
  });
}

Deno.test("scheduled-smoke-ok: rejects requests without a valid cron secret", async () => {
  const res = await okHandler(makeRequest("scheduled-smoke-ok", { job_name: "smoke-ok", scheduled_for: new Date().toISOString() }, "wrong-secret"));
  assertEquals(res.status, 401);
});

Deno.test("scheduled-smoke-ok: rejects malformed body", async () => {
  const res = await okHandler(makeRequest("scheduled-smoke-ok", { nope: true }, CRON_SECRET));
  assertEquals(res.status, 400);
});

Deno.test({
  name: "scheduled-smoke-ok: records a job_runs row as succeeded",
  ignore: SERVICE_ROLE_KEY === "",
  fn: async () => {
    const res = await okHandler(
      makeRequest("scheduled-smoke-ok", { job_name: "smoke-ok", scheduled_for: new Date().toISOString() }, CRON_SECRET),
    );
    assertEquals(res.status, 200);
    const json = await res.json();
    assertEquals(json.ok, true);
    assertExists(json.job_run_id);

    const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);
    const { data, error } = await admin.from("job_runs").select("*").eq("id", json.job_run_id).single();
    assertEquals(error, null);
    assertEquals(data?.status, "succeeded");
    assertExists(data?.finished_at);
    assertEquals(data?.error, null);
  },
});

Deno.test({
  name: "scheduled-smoke-fail: records a job_runs row as failed, with an error surfaced (never silent)",
  ignore: SERVICE_ROLE_KEY === "",
  fn: async () => {
    const res = await failHandler(
      makeRequest("scheduled-smoke-fail", { job_name: "smoke-fail", scheduled_for: new Date().toISOString() }, CRON_SECRET),
    );
    assertEquals(res.status, 500);
    const json = await res.json();
    assertEquals(json.ok, false);
    assertExists(json.job_run_id);
    assertExists(json.error);

    const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);
    const { data, error } = await admin.from("job_runs").select("*").eq("id", json.job_run_id).single();
    assertEquals(error, null);
    assertEquals(data?.status, "failed");
    assertExists(data?.finished_at);
    assertExists(data?.error);
  },
});
