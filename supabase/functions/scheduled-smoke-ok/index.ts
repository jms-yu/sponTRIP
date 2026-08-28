// scheduled-smoke-ok — INF-4 proof (success path).
//
// Invoked ONLY by pg_cron via pg_net's net.http_post. Never by a client
// app. Auth is a shared secret header, not a user JWT.
//
//   POST /functions/v1/scheduled-smoke-ok
//   Headers: x-cron-secret: <CRON_SHARED_SECRET>
//   Body: { "job_name": "smoke-ok", "scheduled_for": "<ISO8601>" }
//
// Records a job_runs row: running -> succeeded, with finished_at set.
import { getSupabaseAdmin } from "../_shared/supabaseAdmin.ts";
import { corsHeaders, handleOptions, jsonResponse } from "../_shared/cors.ts";
import { timingSafeEqual } from "../_shared/timingSafeEqual.ts";

interface RequestBody {
  job_name: string;
  scheduled_for: string;
}

function isValidBody(x: unknown): x is RequestBody {
  return (
    typeof x === "object" &&
    x !== null &&
    typeof (x as Record<string, unknown>).job_name === "string" &&
    typeof (x as Record<string, unknown>).scheduled_for === "string"
  );
}

export async function handler(req: Request): Promise<Response> {
  const optionsResponse = handleOptions(req);
  if (optionsResponse) return optionsResponse;

  const cronSecret = Deno.env.get("CRON_SHARED_SECRET");
  const providedSecret = req.headers.get("x-cron-secret");
  if (!cronSecret || !providedSecret || !(await timingSafeEqual(providedSecret, cronSecret))) {
    return jsonResponse({ error: "unauthorized" }, 401);
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return jsonResponse({ error: "invalid_request" }, 400);
  }
  if (!isValidBody(body)) {
    return jsonResponse({ error: "invalid_request" }, 400);
  }

  const supabase = getSupabaseAdmin();

  const { data: inserted, error: insertError } = await supabase
    .from("job_runs")
    .insert({
      job_name: body.job_name,
      scheduled_for: body.scheduled_for,
      status: "running",
    })
    .select("id")
    .single();

  if (insertError || !inserted) {
    return jsonResponse(
      { ok: false, error: insertError?.message ?? "insert_failed" },
      500,
    );
  }

  const jobRunId = inserted.id as string;

  // No-op work — this function's only job is to prove the scheduling +
  // recording pipeline works, not to do real work.

  const { error: updateError } = await supabase
    .from("job_runs")
    .update({ status: "succeeded", finished_at: new Date().toISOString() })
    .eq("id", jobRunId);

  if (updateError) {
    return jsonResponse({ ok: false, job_run_id: jobRunId, error: updateError.message }, 500);
  }

  return jsonResponse({ ok: true, job_run_id: jobRunId }, 200);
}

if (import.meta.main) {
  Deno.serve(handler);
}

export { corsHeaders };
