import { describe, it, expect, beforeAll } from "vitest";
import { execFileSync } from "node:child_process";
import { readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const WEB_ROOT = join(__dirname, "..", "..", "..");
const DIST_INDEX = join(WEB_ROOT, "dist", "index.html");

// INF-3's full route-reachability AC needs a real Cloudflare Pages deploy
// to fully verify (see the M0 report for what's still manual). This test
// verifies the thing that IS testable in CI: `astro build` produces the
// exact static HTML that would get deployed, and it contains the expected
// content — so a broken page fails the build before it ever reaches a
// deploy. Runs a real `astro build` rather than importing the .astro
// component directly (see vitest.config.ts for why).
describe("astro build output: index.html", () => {
  beforeAll(() => {
    execFileSync("npx", ["astro", "build"], {
      cwd: WEB_ROOT,
      stdio: "pipe",
      shell: process.platform === "win32",
    });
  }, 60_000);

  it("produces dist/index.html", () => {
    expect(existsSync(DIST_INDEX)).toBe(true);
  });

  it("renders the SponTRIP placeholder page with expected content", () => {
    const html = readFileSync(DIST_INDEX, "utf-8");
    expect(html).toContain("SponTRIP");
    expect(html).toContain('data-testid="build-time"');
    expect(html).toMatch(/<html/i);
  });
});
