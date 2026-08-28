/**
 * posthog-funnel.merge-test.ts — INF-6's permanent CI-blocking proof for
 * the repeat-join funnel schema.
 *
 * Runs ONLY on merge to main (see .github/workflows/ci.yml), not every
 * PR — it's an external-system integration test and would flake ordinary
 * PR merges. Seeds fixtures via posthog-fixture-seed.ts, then polls
 * PostHog's Query API for the expected per-event counts, isolated to this
 * run via `run_id`.
 *
 * Verifies "the repeat-join funnel renders correctly from seeded fixture
 * data" (M0 AC) — not merely "an event was received." A wrong schema here
 * can't be backfilled once real milestones start emitting these events, so
 * this runs against the real Capture + Query APIs, not a mock.
 *
 * Honestly skips (not silently passes) when PostHog credentials aren't
 * configured — see seedFixtures()'s own skip behavior.
 *
 * IMPORTANT — three real issues found and fixed during M0 GATE 3 manual
 * testing (2026-08-28), against a real PostHog project, each confirmed
 * independently before being accepted as the explanation:
 *
 * (1) `refresh=blocking` does not bust the Query API's cache on repeat
 *     polls with the *same* query — it only guarantees a synchronous (not
 *     async-job) response, and will keep serving an earlier CACHED answer,
 *     including an empty one computed before ingestion caught up. Since
 *     this function polls the same query repeatedly, `blocking` alone
 *     reliably "poisons" the cache with the first (too-early, empty)
 *     answer and never recovers, however long you poll.
 *     `refresh=force_blocking` genuinely bypasses the cache every call
 *     (confirmed via the response's own `is_cached: false`).
 *
 * (2) Separately, `FunnelsQuery` (the original approach) returned EMPTY
 *     results even with `force_blocking`, against data independently
 *     confirmed present and correct via a raw HogQL count on the exact
 *     same run_id. This is not caching or ingestion lag — both were ruled
 *     out for that specific check. It looks like a real limitation in how
 *     `FunnelsQuery`'s forced-refresh path behaves; a direct
 *     `count(DISTINCT distinct_id) ... GROUP BY event` HogQL query
 *     verified reliably correct against the identical already-landed data,
 *     so that's what this file uses instead. It proves exactly what the
 *     AC asks for (the right number of distinct users hit each step)
 *     without depending on the Funnels insight engine specifically — the
 *     separate, human-only "renders in the dashboard" checklist item still
 *     covers that engine's own visual output.
 *
 * (3) Genuine Kafka -> ClickHouse ingestion lag on this project is real
 *     and can be substantial — not a smooth per-event delay. A precise
 *     timed measurement (15s checkpoints) showed exactly 1 of 16 seeded
 *     events queryable within seconds, then a flat plateau for ~5 minutes,
 *     then all remaining 15 landing in the same checkpoint at 324s —
 *     consistent with a fixed-interval batch flush rather than gradual
 *     lag. Repeated rapid-fire testing during debugging (many seed runs in
 *     quick succession, all hitting the same free-tier project) appeared
 *     to make this worse across successive runs, up to 7+ minutes at one
 *     point — plausibly self-inflicted ingestion-pipeline backlog from the
 *     debugging session itself, not necessarily representative of a single
 *     isolated production run. The timeout below is set generously to
 *     absorb real variance either way.
 */
import { describe, it, expect } from "vitest";
import { AnalyticsEvent } from "../../apps/mobile/src/lib/analytics/events.js";
import { seedFixtures, CONFIRMING_USER_COUNT, REPEAT_USER_COUNT } from "./posthog-fixture-seed.js";

const POSTHOG_HOST = process.env.POSTHOG_HOST ?? "https://us.i.posthog.com";
const PERSONAL_API_KEY = process.env.POSTHOG_PERSONAL_API_KEY;
const PROJECT_ID = process.env.POSTHOG_PROJECT_ID;

const POLL_INTERVAL_MS = 10_000;
const POLL_TIMEOUT_MS = 480_000; // see file header (3) — generous margin over observed real-world ingestion variance

interface FunnelStepResult {
  name: string;
  count: number;
}

// run_id is always a crypto.randomUUID() output (see posthog-fixture-seed.ts) —
// validated here defensively before string-interpolating it into HogQL.
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

async function queryFunnel(runId: string): Promise<FunnelStepResult[]> {
  if (!UUID_RE.test(runId)) {
    throw new Error(`queryFunnel: runId does not look like a UUID, refusing to interpolate: ${runId}`);
  }

  // force_blocking (not blocking) — see file header (1). HogQLQuery, not
  // FunnelsQuery — see file header (2).
  const res = await fetch(`${POSTHOG_HOST}/api/projects/${PROJECT_ID}/query/?refresh=force_blocking`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${PERSONAL_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: {
        kind: "HogQLQuery",
        query:
          `SELECT event, count(DISTINCT distinct_id) AS cnt FROM events ` +
          `WHERE event IN ('${AnalyticsEvent.EventConfirmed}', '${AnalyticsEvent.EventConfirmedRepeat}') ` +
          `AND properties.environment = 'ci-test' AND properties.run_id = '${runId}' GROUP BY event`,
      },
    }),
  });

  if (!res.ok) {
    throw new Error(`PostHog Query API returned ${res.status}: ${await res.text()}`);
  }

  const json = (await res.json()) as { results?: Array<[string, number]>; error?: unknown };
  if (json.error) {
    throw new Error(`PostHog Query API returned a query error: ${JSON.stringify(json.error)}`);
  }
  const rows = json.results ?? [];
  const byEvent = new Map(rows.map(([name, count]) => [name, count]));

  return [
    { name: AnalyticsEvent.EventConfirmed, count: byEvent.get(AnalyticsEvent.EventConfirmed) ?? 0 },
    { name: AnalyticsEvent.EventConfirmedRepeat, count: byEvent.get(AnalyticsEvent.EventConfirmedRepeat) ?? 0 },
  ];
}

async function pollUntilExpected(runId: string): Promise<FunnelStepResult[]> {
  const deadline = Date.now() + POLL_TIMEOUT_MS;
  let lastResult: FunnelStepResult[] = [];

  while (Date.now() < deadline) {
    lastResult = await queryFunnel(runId);
    const step1 = lastResult[0]?.count ?? 0;
    const step2 = lastResult[1]?.count ?? 0;
    if (step1 === CONFIRMING_USER_COUNT && step2 === REPEAT_USER_COUNT) {
      return lastResult;
    }
    await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));
  }

  return lastResult;
}

const hasCredentials = Boolean(PERSONAL_API_KEY && PROJECT_ID && process.env.POSTHOG_CAPTURE_API_KEY);

describe.skipIf(!hasCredentials)("PostHog repeat-join funnel (INF-6)", () => {
  it(
    "renders the correct step counts from seeded fixture data",
    async () => {
      const seedResult = await seedFixtures();
      expect(seedResult).not.toBeNull();
      if (!seedResult) return;

      const funnel = await pollUntilExpected(seedResult.runId);

      expect(funnel[0]?.count).toBe(CONFIRMING_USER_COUNT);
      expect(funnel[1]?.count).toBe(REPEAT_USER_COUNT);
    },
    POLL_TIMEOUT_MS + 30_000,
  );
});

if (!hasCredentials) {
  console.warn(
    "posthog-funnel.merge-test: SKIPPED — POSTHOG_PERSONAL_API_KEY / POSTHOG_PROJECT_ID / " +
      "POSTHOG_CAPTURE_API_KEY not fully configured. This is an HONEST skip: INF-6's funnel " +
      "proof has NOT run. Configure a `ci-test`-tagged PostHog environment's credentials as " +
      "repository secrets for this to be a real gate on merge to main.",
  );
}
