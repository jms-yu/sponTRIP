import PostHog from "posthog-react-native";

/**
 * INF-6: PostHog client init. One PostHog project total (dev/stage/prod
 * distinguished by an `environment` property on every event, not three
 * separate free-tier projects — see .spark/environment.md), so the
 * repeat-join funnel fixture data (event_confirmed -> event_confirmed_repeat)
 * never fragments across environments.
 *
 * M0 does not wire any real emission call site — no auth or events exist
 * yet to emit from honestly (decision 123). This client is available for
 * later milestones to import and call posthogClient.capture(...) from real
 * feature code. The funnel schema itself is proven via
 * ci/scripts/posthog-fixture-seed.ts against a `ci-test`-tagged
 * environment, not through this file.
 */
let client: PostHog | null = null;

export function getPostHogClient(): PostHog | null {
  if (client) return client;

  const apiKey = process.env.EXPO_PUBLIC_POSTHOG_KEY;
  const host = process.env.EXPO_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com";

  if (!apiKey) {
    console.warn("[posthog] EXPO_PUBLIC_POSTHOG_KEY is not set — analytics will not be captured.");
    return null;
  }

  client = new PostHog(apiKey, { host });
  return client;
}
