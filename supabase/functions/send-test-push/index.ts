// send-test-push — INF-7 manual verification harness.
//
// Manual-invocation-only. NOT a product endpoint — no product feature
// triggers push yet at M0. Exists so a human can verify a push notification
// reaches a physical device within 10s (the INF-7 acceptance criterion),
// and remains dormant/available as a debug tool until a later milestone
// wires real push triggers.
//
// PRODUCTION-DEPLOYMENT GUARD (Review Gate finding 11, remediation cycle
// 1): nothing about Supabase's own deploy mechanism stops this debug
// endpoint from being deployed to production alongside real functions —
// deploying it is not itself dangerous (it still requires the correct
// CRON_SHARED_SECRET, checked in constant time), but a live debug
// endpoint sitting in production that can send arbitrary-content push
// notifications to any Expo push token is exactly the kind of thing a
// security review should not have to rediscover later. Requires an
// explicit `ALLOW_TEST_PUSH=true` environment variable to do anything at
// all — set it in dev/stage secrets, deliberately leave it UNSET in
// production so this function 404s there even if deployed.
//
//   POST /functions/v1/send-test-push
//   Headers: x-cron-secret: <CRON_SHARED_SECRET>
//   Body: { "expo_push_token": "ExponentPushToken[...]", "title": "string", "body": "string" }
//   200 { "ok": true, "ticket": {...} }
//   404 { "error": "not_found" }        — ALLOW_TEST_PUSH is not "true"
//   502 { "ok": false, "error": "..." }
import { corsHeaders, handleOptions, jsonResponse } from "../_shared/cors.ts";
import { timingSafeEqual } from "../_shared/timingSafeEqual.ts";

interface RequestBody {
  expo_push_token: string;
  title: string;
  body: string;
}

function isValidBody(x: unknown): x is RequestBody {
  if (typeof x !== "object" || x === null) return false;
  const b = x as Record<string, unknown>;
  return (
    typeof b.expo_push_token === "string" &&
    b.expo_push_token.startsWith("ExponentPushToken") &&
    typeof b.title === "string" &&
    typeof b.body === "string"
  );
}

const EXPO_PUSH_ENDPOINT = "https://exp.host/--/api/v2/push/send";

export async function handler(req: Request): Promise<Response> {
  const optionsResponse = handleOptions(req);
  if (optionsResponse) return optionsResponse;

  // Deliberately checked BEFORE the secret check, and returns the same
  // generic 404 shape a nonexistent route would — this is meant to look
  // like the function isn't deployed at all in an environment where
  // ALLOW_TEST_PUSH wasn't set (production), not merely "unauthorized"
  // (which would confirm to a prober that the endpoint exists and is
  // gated only by a secret worth guessing).
  if (Deno.env.get("ALLOW_TEST_PUSH") !== "true") {
    return jsonResponse({ error: "not_found" }, 404);
  }

  const cronSecret = Deno.env.get("CRON_SHARED_SECRET");
  const providedSecret = req.headers.get("x-cron-secret");
  if (!cronSecret || !providedSecret || !(await timingSafeEqual(providedSecret, cronSecret))) {
    return jsonResponse({ error: "unauthorized" }, 401);
  }

  let requestBody: unknown;
  try {
    requestBody = await req.json();
  } catch {
    return jsonResponse({ error: "invalid_request" }, 400);
  }
  if (!isValidBody(requestBody)) {
    return jsonResponse({ error: "invalid_request" }, 400);
  }

  const accessToken = Deno.env.get("EXPO_ACCESS_TOKEN");

  try {
    const response = await fetch(EXPO_PUSH_ENDPOINT, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Accept-Encoding": "gzip, deflate",
        "Content-Type": "application/json",
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
      body: JSON.stringify({
        to: requestBody.expo_push_token,
        title: requestBody.title,
        body: requestBody.body,
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      return jsonResponse({ ok: false, error: `expo push api error: ${text}` }, 502);
    }

    const json = await response.json();
    return jsonResponse({ ok: true, ticket: json.data ?? json }, 200);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return jsonResponse({ ok: false, error: message }, 502);
  }
}

if (import.meta.main) {
  Deno.serve(handler);
}

export { corsHeaders };
