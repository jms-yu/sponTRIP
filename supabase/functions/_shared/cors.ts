// Shared CORS headers for Edge Functions.
// M0 functions are either cron-invoked (no browser origin) or called from
// the Expo mobile client (no CORS enforcement needed — native apps don't
// send an Origin header the way browsers do). Kept permissive but scoped to
// the methods/headers these functions actually use, not a blanket "*" for
// every header.
//
// ACCEPTED AT M0, MUST BE REVISITED BEFORE ANY BROWSER-ORIGIN CALLER
// EXISTS (Review Gate finding 11, remediation cycle 1; spark-security-
// checklist: "CORS restricted to actual known origins. Never `*` in
// production."). `Access-Control-Allow-Origin: *` is genuinely harmless
// today because nothing here is ever called from a browser tab — but the
// moment apps/web (or any future browser-based caller, e.g. an admin
// console) calls one of these functions directly, this needs to become an
// explicit allow-list of real origins (the deployed apps/web domain(s)),
// not `*`. Tracked here so it isn't rediscovered as a surprise later.
export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-cron-secret",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

export function handleOptions(req: Request): Response | null {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  return null;
}

export function jsonResponse(body: unknown, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
