# pg_cron scheduling snippets

**Not a migration on purpose.** `supabase/migrations/20260828120200_scheduled_jobs.sql`
enables `pg_cron` and creates the `job_runs` ledger table — that's the
*infrastructure* half of INF-4. This file is the *scheduling* half: the
exact SQL used to actually schedule a job against that infrastructure,
kept here as a reusable snippet rather than baked into a migration, because
a schedule is an operational decision each environment/milestone makes
deliberately (what job, what interval, when to unschedule) — not something
that should silently exist forever in every fresh database just because a
migration ran.

M8's RECUR-2 (recurring events, auto-generating the next occurrence) is
specified as "reusing INF-4" — this file is what it reuses for the
scheduling half. Copy the pattern below, point it at the real feature
function, and give the job a real name.

---

## 1. Manual T+2min real-firing proof (the M0 acceptance criterion)

INF-4's AC is "a test job scheduled for T+2min executes and records its
run; a deliberately failing job surfaces an error rather than failing
silently." `pg_cron` has no one-shot scheduling primitive, so this can't be
a CI-run automated test (see `ci/scripts/rls-negative-auth` and the Deno
Edge Function tests for the CI-blocking proof of the functions'
success/failure-recording *logic* — this section is specifically the real
wall-clock firing proof, done once, by a human, against a real environment).

**Endpoint URL depends on where you're running this:**
- **Local Docker** (`supabase start`): use `http://api.supabase.internal:8000/functions/v1/<fn>`
  — `api.supabase.internal` is the Kong gateway's DNS alias on the
  `supabase_network_<project>` Docker network, reachable from the `db`
  container (where `pg_net`'s `net.http_post` actually executes from).
  `http://127.0.0.1:...` will NOT work here — the db container can't reach
  the host's loopback interface that way.
- **A real cloud Supabase project**: use the project's real Edge Function
  URL, e.g. `https://<project-ref>.supabase.co/functions/v1/<fn>`.

**`x-cron-secret` must match `CRON_SHARED_SECRET`** as configured for the
target environment (`supabase/functions/.env` locally — gitignored, never
committed; a Supabase project secret in the cloud). `scheduled-smoke-ok`,
`scheduled-smoke-fail`, and `send-test-push` all have `verify_jwt = false`
in `supabase/config.toml` specifically so this shared-secret header is
sufficient — see those functions' own auth check for why.

```sql
-- Schedule the SUCCESS-path proof, firing every 1 minute (pg_cron's
-- shortest supported interval — "T+2min" in the AC means "observe at
-- least one firing within 2 minutes," not literally a 2-minute interval).
select cron.schedule(
  'm0-manual-proof-ok',
  '*/1 * * * *',
  $$ select net.http_post(
       url := '<endpoint-per-above>/functions/v1/scheduled-smoke-ok',
       headers := jsonb_build_object(
         'Content-Type', 'application/json',
         'x-cron-secret', '<CRON_SHARED_SECRET>'
       ),
       body := jsonb_build_object(
         'job_name', 'm0-manual-proof-ok',
         'scheduled_for', now()
       )
     ) $$
);
```

Wait ~1-2 minutes, then check both layers:

```sql
-- pg_cron's own record of the scheduled call firing (job status = did the
-- HTTP request itself get sent and get a response, not what the response
-- body said):
select jobid, status, return_message, start_time
from cron.job_run_details
where jobid = (select jobid from cron.job where jobname = 'm0-manual-proof-ok')
order by start_time desc
limit 5;

-- The function's OWN record of what happened (this is the actual INF-4
-- proof — a real row, with a real status, recorded by the function code):
select id, job_name, status, started_at, finished_at
from public.job_runs
where job_name = 'm0-manual-proof-ok'
order by started_at desc;
```

Expect `job_runs.status = 'succeeded'` with `finished_at` set.

**Always unschedule when done** — this is a one-time manual proof, not a
standing job:

```sql
select cron.unschedule('m0-manual-proof-ok');
```

Repeat the whole sequence with `scheduled-smoke-fail` / job name
`m0-manual-proof-fail` to prove the failure path — expect
`job_runs.status = 'failed'` with a real `error` message (never silent),
then unschedule `m0-manual-proof-fail` too.

```sql
select cron.schedule(
  'm0-manual-proof-fail',
  '*/1 * * * *',
  $$ select net.http_post(
       url := '<endpoint-per-above>/functions/v1/scheduled-smoke-fail',
       headers := jsonb_build_object(
         'Content-Type', 'application/json',
         'x-cron-secret', '<CRON_SHARED_SECRET>'
       ),
       body := jsonb_build_object(
         'job_name', 'm0-manual-proof-fail',
         'scheduled_for', now()
       )
     ) $$
);

-- ... wait, check cron.job_run_details + public.job_runs as above ...

select cron.unschedule('m0-manual-proof-fail');
```

**Evidence this was actually run for M0** (local Docker stack — no cloud
Supabase project exists for this build; see the M0 report for that
substitution being called out explicitly): both jobs fired twice each at
real 1-minute intervals, `job_runs` recorded `succeeded`/`failed` correctly
each time, and both were unscheduled afterward (`cron.job` empty,
confirmed via `select jobid, jobname, schedule from cron.job;`).

---

## 2. Pattern for a real feature job (M8's RECUR-2 and beyond)

Same shape, pointed at a real feature function instead of the smoke-test
pair, with a real (not `m0-manual-proof-*`) job name, and a schedule that's
meant to run indefinitely rather than being unscheduled after one
observation:

```sql
select cron.schedule(
  'recur-generate-next-occurrence', -- pick a real, descriptive name
  '*/5 * * * *',                    -- pick a real interval for the feature
  $$ select net.http_post(
       url := '<endpoint>/functions/v1/<real-function-name>',
       headers := jsonb_build_object(
         'Content-Type', 'application/json',
         'x-cron-secret', '<CRON_SHARED_SECRET>'
       ),
       body := jsonb_build_object('triggered_by', 'pg_cron')
     ) $$
);
```

Standing jobs like this belong in a real migration once a feature milestone
actually needs them (so `cron.schedule` runs exactly once per environment,
tracked the same way every other schema change is) — this file is for the
one-time manual proof and as a copyable pattern, not a substitute for that.
