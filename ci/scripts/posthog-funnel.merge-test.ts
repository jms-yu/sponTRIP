/**
 * posthog-funnel.merge-test.ts — INF-6's permanent CI-blocking proof for
 * the repeat-join funnel schema.
 *
 * Runs ONLY on merge to main (see .github/workflows/ci.yml), not every
 * PR — it's an external-system integration test and would flake ordinary
 * PR merges. Seeds fixtures via posthog-fixture-seed.ts, then polls
 * PostHog's Query API (funnel query) for the expected step counts.
 *
 * Verifies "the repeat-join funnel renders correctly from seeded fixture
 * data" (M0 AC) — not merely "an event was received." A wrong schema here
 * can't be backfilled once real milestones start emitting these events, so
 * this runs against the real Capture + Query APIs, not a mock.
 *
 * Honestly skips (not silently passes) when PostHog credentials aren't
 * configured — see seedFixtures()'s own skip behavior.
 */
import { describe, it, expect } from "vitest";
import { AnalyticsEvent } from "../../apps/mobile/src/lib/analytics/events.js";
import { seedFixtures, CONFIRMING_USER_COUNT, REPEAT_USER_COUNT } from "./posthog-fixture-seed.js";

const POSTHOG_HOST = process.env.POSTHOG_HOST ?? "https://us.i.posthog.com";
const PERSONAL_API_KEY = process.env.POSTHOG_PERSONAL_API_KEY;
const PROJECT_ID = process.env.POSTHOG_PROJECT_ID;

const POLL_INTERVAL_MS = 5_000;
const POLL_TIMEOUT_MS = 120_000; // PostHog ingestion can lag by up to ~1-2 minutes

interface FunnelStepResult {
  name: string;
  count: number;
}

async function queryFunnel(runId: string): Promise<FunnelStepResult[]> {
  const res = await fetch(`${POSTHOG_HOST}/api/projects/${PROJECT_ID}/query/`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${PERSONAL_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: {
        kind: "FunnelsQuery",
        series: [
          { kind: "EventsNode", event: AnalyticsEvent.EventConfirmed },
          { kind: "EventsNode", event: AnalyticsEvent.EventConfirmedRepeat },
        ],
        properties: [
          { key: "environment", value: "ci-test", operator: "exact", type: "event" },
          { key: "run_id", value: runId, operator: "exact", type: "event" },
        ],
      },
    }),
  });

  if (!res.ok) {
    throw new Error(`PostHog Query API returned ${res.status}: ${await res.text()}`);
  }

  const json = (await res.json()) as { results?: Array<{ name?: string; custom_name?: string; count: number }> };
  const results = json.results ?? [];
  return results.map((r: { name?: string; custom_name?: string; count: number }) => ({
    name: r.custom_name ?? r.name ?? "unknown",
    count: r.count,
  }));
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
