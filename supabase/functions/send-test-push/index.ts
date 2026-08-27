// send-test-push — INF-7 manual verification harness.
//
// Manual-invocation-only. NOT a product endpoint — no product feature
// triggers push yet at M0. Exists so a human can verify a push notification
// reaches a physical device within 10s (the INF-7 acceptance criterion),
// and remains dormant/available as a debug tool until a later milestone
// wires real push triggers.
//
//   POST /functions/v1/send-test-push
//   Headers: x-cron-secret: <CRON_SHARED_SECRET>
//   Body: { "expo_push_token": "ExponentPushToken[...]", "title": "string", "body": "string" }
//   200 { "ok": true, "ticket": {...} }
//   502 { "ok": false, "error": "..." }
import { corsHeaders, handleOptions, jsonResponse } from "../_shared/cors.ts";

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

  const cronSecret = Deno.env.get("CRON_SHARED_SECRET");
  const providedSecret = req.headers.get("x-cron-secret");
  if (!cronSecret || providedSecret !== cronSecret) {
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
