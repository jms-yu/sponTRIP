// Shared CORS headers for Edge Functions.
// M0 functions are either cron-invoked (no browser origin) or called from
// the Expo mobile client (no CORS enforcement needed — native apps don't
// send an Origin header the way browsers do). Kept permissive but scoped to
// the methods/headers these functions actually use, not a blanket "*" for
// every header.
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
