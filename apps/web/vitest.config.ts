import { defineConfig } from "vitest/config";

// Deliberately NOT using astro/config's getViteConfig() + the experimental
// Astro Container API here: in this project's environment it produces an
// unhandled, unhelpfully-serialized error during vitest's config-resolution
// phase (reproduced with a trivial config-only test, i.e. unrelated to any
// .astro import) — a known-fragile combination given the Container API is
// still "experimental" upstream. A plain vitest config testing the actual
// build OUTPUT (see __tests__/index.test.ts) is more robust, is a closer
// proxy for what actually gets deployed to Cloudflare Pages, and has none
// of that fragility.
export default defineConfig({
  test: {
    environment: "node",
    include: ["**/*.test.ts"],
    exclude: ["node_modules", "dist"],
  },
});
