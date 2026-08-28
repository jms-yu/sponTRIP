import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["**/*.test.ts"],
    // *.merge-test.ts files hit external systems (e.g. the PostHog funnel
    // check) and are deliberately excluded from the normal `npm test` /
    // every-PR run to avoid flaking PR merges on a third-party API. They
    // run in their own CI job, gated to pushes on main only — see
    // .github/workflows/ci.yml and package.json's `test:merge` script.
    exclude: ["node_modules", ".tmp", "**/*.merge-test.ts"],
  },
});
