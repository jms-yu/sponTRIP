// scheduled-smoke-fail — INF-4 proof (failure path).
//
// Same invocation contract as scheduled-smoke-ok, but deliberately throws
// inside the try/catch. The AC this proves: a failing scheduled job records
// its failure and surfaces an error — it is never swallowed silently.
//
//   POST /functions/v1/scheduled-smoke-fail
//   Headers: x-cron-secret: <CRON_SHARED_SECRET>
//   Body: { "job_name": "smoke-fail", "scheduled_for": "<ISO8601>" }
import { getSupabaseAdmin } from "../_shared/supabaseAdmin.ts";
import { corsHeaders, handleOptions, jsonResponse } from "../_shared/cors.ts";

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
  if (!cronSecret || providedSecret !== cronSecret) {
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

  try {
    // Deliberate failure — this function exists to prove failures are
    // recorded, not to do real work.
    throw new Error("deliberate smoke-test failure");
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    await supabase
      .from("job_runs")
      .update({
        status: "failed",
        error: message,
        finished_at: new Date().toISOString(),
      })
      .eq("id", jobRunId);

    return jsonResponse({ ok: false, job_run_id: jobRunId, error: message }, 500);
  }
}

if (import.meta.main) {
  Deno.serve(handler);
}

export { corsHeaders };
