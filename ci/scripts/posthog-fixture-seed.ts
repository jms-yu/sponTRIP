#!/usr/bin/env tsx
/**
 * posthog-fixture-seed.ts — INF-6's fixture seeder.
 *
 * M0 does not wire any real emission call site (decision 123) — no auth or
 * events exist yet to emit from honestly. Instead this script pushes
 * synthetic historical events matching the canonical AnalyticsEvent schema
 * (apps/mobile/src/lib/analytics/events.ts) via PostHog's HTTP Capture
 * API into a dedicated `ci-test`-tagged environment, so the repeat-join
 * funnel (event_confirmed -> event_confirmed_repeat, the project's core
 * success metric) can be proven end-to-end BEFORE any real feature emits
 * it — a wrong schema here can't be backfilled later.
 *
 * Every event carries:
 *   - environment: 'ci-test' (never mixed with real dev/stage/prod data —
 *     one PostHog project total per .spark/environment.md, distinguished
 *     by this property)
 *   - run_id: a fresh UUID per invocation, so concurrent/repeated CI runs
 *     never interfere with each other's funnel counts
 *
 * Fixture shape (deliberately simple, matching the funnel's two steps):
 *   - CONFIRMING_USER_COUNT synthetic users each fire EventConfirmed once
 *   - REPEAT_USER_COUNT of those additionally fire EventConfirmedRepeat
 * Expected funnel: step 1 = CONFIRMING_USER_COUNT, step 2 = REPEAT_USER_COUNT.
 *
 * Requires POSTHOG_CAPTURE_API_KEY and POSTHOG_HOST. Exits 0 with a loud
 * warning (not a silent pass) if unset — see r2-denied-read-test.ts for the
 * same honest-skip pattern.
 */
import { randomUUID } from "node:crypto";
import { AnalyticsEvent } from "../../apps/mobile/src/lib/analytics/events.js";

export const CONFIRMING_USER_COUNT = 10;
export const REPEAT_USER_COUNT = 6;

const POSTHOG_HOST = process.env.POSTHOG_HOST ?? "https://us.i.posthog.com";
const CAPTURE_API_KEY = process.env.POSTHOG_CAPTURE_API_KEY;

export interface SeedResult {
  runId: string;
  confirmingUserCount: number;
  repeatUserCount: number;
}

interface CaptureBatchEvent {
  event: string;
  distinct_id: string;
  properties: Record<string, unknown>;
  timestamp: string;
}

function buildFixtureEvents(runId: string): CaptureBatchEvent[] {
  const events: CaptureBatchEvent[] = [];
  const baseTime = Date.now();

  for (let i = 0; i < CONFIRMING_USER_COUNT; i++) {
    const distinctId = `ci-test-user-${runId}-${i}`;
    const circleId = `ci-test-circle-${runId}`;

    events.push({
      event: AnalyticsEvent.EventConfirmed,
      distinct_id: distinctId,
      properties: {
        environment: "ci-test",
        run_id: runId,
        event_id: `ci-test-event-${runId}-${i}-a`,
        circle_id: circleId,
      },
      timestamp: new Date(baseTime - 60_000).toISOString(),
    });

    if (i < REPEAT_USER_COUNT) {
      events.push({
        event: AnalyticsEvent.EventConfirmedRepeat,
        distinct_id: distinctId,
        properties: {
          environment: "ci-test",
          run_id: runId,
          event_id: `ci-test-event-${runId}-${i}-b`,
          circle_id: circleId,
        },
        timestamp: new Date(baseTime - 30_000).toISOString(),
      });
    }
  }

  return events;
}

export async function seedFixtures(): Promise<SeedResult | null> {
  if (!CAPTURE_API_KEY) {
    console.warn(
      "posthog-fixture-seed: SKIPPED — POSTHOG_CAPTURE_API_KEY not set. " +
        "This is an HONEST skip, not a pass: INF-6's funnel proof has NOT run.",
    );
    return null;
  }

  const runId = randomUUID();
  const events = buildFixtureEvents(runId);

  const res = await fetch(`${POSTHOG_HOST}/batch/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      api_key: CAPTURE_API_KEY,
      batch: events,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`PostHog Capture API returned ${res.status}: ${text}`);
  }

  console.log(
    `posthog-fixture-seed: seeded ${events.length} events for run_id=${runId} ` +
      `(${CONFIRMING_USER_COUNT} confirmed, ${REPEAT_USER_COUNT} repeat)`,
  );

  return { runId, confirmingUserCount: CONFIRMING_USER_COUNT, repeatUserCount: REPEAT_USER_COUNT };
}

if (process.argv[1]?.endsWith("posthog-fixture-seed.ts")) {
  seedFixtures()
    .then((result) => {
      if (result) console.log(JSON.stringify(result));
      process.exit(0);
    })
    .catch((err) => {
      console.error("posthog-fixture-seed: ERROR —", err instanceof Error ? err.message : err);
      process.exit(1);
    });
}
