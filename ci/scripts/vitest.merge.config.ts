import { defineConfig } from "vitest/config";

// Separate config for *.merge-test.ts files (external-system integration
// tests, e.g. the PostHog funnel check) — deliberately NOT included in the
// default vitest.config.ts used by `npm test` on every PR, to avoid flaking
// ordinary PR merges on a third-party API. Run via `npm run test:merge`,
// wired only into the merge-to-main CI job.
export default defineConfig({
  test: {
    environment: "node",
    include: ["**/*.merge-test.ts"],
    exclude: ["node_modules", ".tmp"],
  },
});
