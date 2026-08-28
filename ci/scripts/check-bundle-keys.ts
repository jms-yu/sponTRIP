#!/usr/bin/env tsx
/**
 * check-bundle-keys.ts — SEC-3 check.
 *
 * Key segregation: only the Supabase `anon` key may ever ship in the
 * mobile client. Three checks, all must pass:
 *
 *  1. Source scan: no EXPO_PUBLIC_* identifier (in apps/mobile source)
 *     contains "SERVICE" or "SECRET" — prefixing a secret-named var with
 *     EXPO_PUBLIC_ is itself the bug, independent of whether it's read.
 *  2. Source scan: no reference to `process.env.SUPABASE_SERVICE_ROLE_KEY`
 *     (or any `SUPABASE_SERVICE_ROLE_KEY` identifier at all) anywhere
 *     inside apps/mobile/.
 *  3. Bundle scan: the exported JS bundle (`npx expo export`) contains no
 *     "service_role" substring and no value matching a Supabase
 *     service-role JWT/secret-key shape.
 *
 * Check 3 requires a working Expo export and is skipped (with a loud
 * warning, not a silent pass) when SKIP_BUNDLE_EXPORT=1 is set — for fast
 * local iteration only. CI must NOT set that flag.
 *
 * Exit code contract: 0 = pass, 1 = fail (blocks merge).
 */
import { readFileSync, readdirSync, statSync, existsSync, mkdtempSync, rmSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { tmpdir } from "node:os";
import { execFileSync } from "node:child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, "..", "..");
const MOBILE_SRC_DIR = join(REPO_ROOT, "apps", "mobile");

const FORBIDDEN_ENV_SUBSTRINGS = ["SERVICE", "SECRET"];
const EXPO_PUBLIC_IDENTIFIER_RE = /EXPO_PUBLIC_[A-Z0-9_]*/g;
const SERVICE_ROLE_IDENTIFIER_RE = /SUPABASE_SERVICE_ROLE_KEY/g;

/** Strips JS/TS comments before scanning, so a comment that explains this
 * very rule (e.g. "never reference SUPABASE_SERVICE_ROLE_KEY here") doesn't
 * false-positive against itself. Deliberately simple/pragmatic (same spirit
 * as check-rls-enabled.ts's stripSqlComments) rather than a full parser —
 * this is our own source, not adversarial input. The `(^|[^:])` guard keeps
 * "https://" URLs intact instead of treating them as line comments. */
export function stripJsComments(code: string): string {
  const withoutBlockComments = code.replace(/\/\*[\s\S]*?\*\//g, "");
  return withoutBlockComments
    .split("\n")
    .map((line) => line.replace(/(^|[^:])\/\/.*$/, "$1"))
    .join("\n");
}
// Legacy Supabase keys are JWTs (eyJ...); new-style secret keys look like
// sb_secret_<random>. Either shape appearing verbatim in a client bundle is
// a hard failure.
export const SERVICE_ROLE_VALUE_RE =
  /sb_secret_[A-Za-z0-9_-]+|eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}/g;

function walkFiles(dir: string, exts: string[], skipDirs: string[]): string[] {
  const out: string[] = [];
  if (!existsSync(dir)) return out;
  for (const entry of readdirSync(dir)) {
    if (skipDirs.includes(entry)) continue;
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      out.push(...walkFiles(full, exts, skipDirs));
    } else if (exts.some((ext) => entry.endsWith(ext))) {
      out.push(full);
    }
  }
  return out;
}

/** Pure logic, exported for unit testing — scans one file's text content.
 * Comments are stripped first (see stripJsComments) so a comment
 * explaining this very rule doesn't false-positive against itself. */
export function scanSourceContent(relPath: string, rawContent: string): string[] {
  const violations: string[] = [];
  const content = stripJsComments(rawContent);

  for (const match of content.matchAll(EXPO_PUBLIC_IDENTIFIER_RE)) {
    const identifier = match[0];
    if (FORBIDDEN_ENV_SUBSTRINGS.some((bad) => identifier.toUpperCase().includes(bad))) {
      violations.push(
        `${relPath}: forbidden identifier "${identifier}" (EXPO_PUBLIC_* must never contain SERVICE or SECRET)`,
      );
    }
  }

  // NOTE: global regexes retain `lastIndex` state across .test() calls,
  // which silently produces false negatives when this function runs across
  // many files in a loop (a real bug caught by this file's own unit tests —
  // see check-bundle-keys.test.ts). Reset before every use rather than
  // relying on a fresh regex per call.
  SERVICE_ROLE_IDENTIFIER_RE.lastIndex = 0;
  if (SERVICE_ROLE_IDENTIFIER_RE.test(content)) {
    violations.push(
      `${relPath}: references SUPABASE_SERVICE_ROLE_KEY — service-role key must never be read inside apps/mobile`,
    );
  }

  // Finding 4 (remediation cycle 1): the source scan previously matched
  // only identifier NAMES, never the key's actual VALUE shape — a real
  // service_role JWT/secret hardcoded under an innocuous variable name
  // (e.g. `const CLIENT_KEY = "eyJ..."`) sailed through this half of SEC-3
  // even though it's exactly the kind of literal-in-source leak the
  // "no hardcoded secrets" checklist item exists to catch, and it stays
  // green even if the constant is never imported/reachable from App.tsx —
  // anyone with repo access can still read it directly off disk.
  //
  // CAVEAT this can't fully solve: SERVICE_ROLE_VALUE_RE matches by JWT
  // *shape*, not by role — a legitimately inlined anon-key JWT (same
  // `eyJ...` shape) will also match and fail this check. That's a
  // deliberate fail-closed tradeoff, not an oversight. A real fix would
  // decode the JWT payload and assert the `role` claim isn't
  // `service_role` (or isn't `anon`/`authenticated` for the inverse case);
  // out of scope for this remediation pass.
  SERVICE_ROLE_VALUE_RE.lastIndex = 0;
  if (SERVICE_ROLE_VALUE_RE.test(content)) {
    violations.push(
      `${relPath}: contains a value matching a service-role key shape (sb_secret_... or a JWT) — ` +
        `even if unused/unreachable, a key sitting in source leaks to anyone with repo access`,
    );
  }

  return violations;
}

/** Pure logic, exported for unit testing — scans one exported bundle file's
 * text content. */
export function scanBundleContent(filePath: string, content: string): string[] {
  const violations: string[] = [];
  if (content.includes("service_role")) {
    violations.push(`exported bundle ${filePath} contains the substring "service_role"`);
  }
  // See the lastIndex note above — same fix applies here.
  SERVICE_ROLE_VALUE_RE.lastIndex = 0;
  if (SERVICE_ROLE_VALUE_RE.test(content)) {
    violations.push(`exported bundle ${filePath} contains a value matching a service-role key shape`);
  }
  return violations;
}

function scanSource(): string[] {
  const violations: string[] = [];
  const files = walkFiles(
    MOBILE_SRC_DIR,
    [".ts", ".tsx", ".js", ".jsx", ".json"],
    ["node_modules", ".expo", "dist", "build", "ios", "android"],
  );

  for (const file of files) {
    const relPath = file.replace(REPO_ROOT + "\\", "").replace(REPO_ROOT + "/", "");
    const content = readFileSync(file, "utf-8");
    violations.push(...scanSourceContent(relPath, content));
  }

  return violations;
}

function scanExportedBundle(): string[] {
  const violations: string[] = [];
  const outDir = mkdtempSync(join(tmpdir(), "sponTRIP-expo-export-"));

  try {
    execFileSync("npx", ["expo", "export", "--platform", "web", "--output-dir", outDir], {
      cwd: MOBILE_SRC_DIR,
      stdio: "pipe",
      shell: process.platform === "win32",
      env: { ...process.env, CI: "1" },
    });
  } catch (err) {
    violations.push(
      `expo export failed to run — cannot verify bundle contents (this itself blocks merge; ` +
        `fix the export before relying on this check): ${err instanceof Error ? err.message : String(err)}`,
    );
    return violations;
  }

  const bundleFiles = walkFiles(outDir, [".js", ".map", ".json"], []);
  for (const file of bundleFiles) {
    const content = readFileSync(file, "utf-8");
    violations.push(...scanBundleContent(file, content));
  }

  rmSync(outDir, { recursive: true, force: true });
  return violations;
}

function main(): void {
  const sourceViolations = scanSource();

  let bundleViolations: string[] = [];
  let bundleSkipped = false;
  if (process.env.SKIP_BUNDLE_EXPORT === "1") {
    bundleSkipped = true;
  } else {
    bundleViolations = scanExportedBundle();
  }

  const allViolations = [...sourceViolations, ...bundleViolations];

  if (bundleSkipped) {
    console.warn(
      "check-bundle-keys: WARNING — bundle export check SKIPPED (SKIP_BUNDLE_EXPORT=1). " +
        "CI must never set this; it is for fast local iteration only.",
    );
  }

  if (allViolations.length === 0) {
    console.log(
      "check-bundle-keys: PASS (source scan clean" +
        (bundleSkipped ? ", bundle scan skipped" : ", bundle scan clean") +
        ")",
    );
    process.exit(0);
  }

  console.error("check-bundle-keys: FAIL — SEC-3 violation");
  for (const v of allViolations) console.error(`  ${v}`);
  process.exit(1);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main();
}
