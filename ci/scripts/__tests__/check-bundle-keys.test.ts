import { describe, it, expect } from "vitest";
import { scanSourceContent, scanBundleContent, stripJsComments, SERVICE_ROLE_VALUE_RE } from "../check-bundle-keys.js";

describe("scanSourceContent", () => {
  it("passes clean source with only a safe EXPO_PUBLIC_ var", () => {
    const violations = scanSourceContent(
      "apps/mobile/src/lib/supabase.ts",
      `const url = process.env.EXPO_PUBLIC_SUPABASE_URL;\nconst key = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;`,
    );
    expect(violations).toEqual([]);
  });

  it("flags an EXPO_PUBLIC_ var containing SERVICE", () => {
    const violations = scanSourceContent(
      "apps/mobile/src/lib/bad.ts",
      `const key = process.env.EXPO_PUBLIC_SUPABASE_SERVICE_ROLE_KEY;`,
    );
    expect(violations.length).toBeGreaterThan(0);
    expect(violations[0]).toContain("EXPO_PUBLIC_SUPABASE_SERVICE_ROLE_KEY");
  });

  it("flags an EXPO_PUBLIC_ var containing SECRET", () => {
    const violations = scanSourceContent(
      "apps/mobile/src/lib/bad.ts",
      `const key = process.env.EXPO_PUBLIC_STRIPE_SECRET;`,
    );
    expect(violations.length).toBeGreaterThan(0);
  });

  it("flags any reference to SUPABASE_SERVICE_ROLE_KEY even without EXPO_PUBLIC_ prefix", () => {
    const violations = scanSourceContent(
      "apps/mobile/src/lib/bad.ts",
      `const key = process.env.SUPABASE_SERVICE_ROLE_KEY;`,
    );
    expect(violations.some((v) => v.includes("SUPABASE_SERVICE_ROLE_KEY"))).toBe(true);
  });

  // Regression test: a real bug found while building M0 — a comment
  // *explaining* this very rule (mentioning SUPABASE_SERVICE_ROLE_KEY by
  // name, as good security documentation does) tripped the checker against
  // itself. Comments must be stripped before scanning.
  it("does NOT flag a comment that merely mentions SUPABASE_SERVICE_ROLE_KEY", () => {
    const violations = scanSourceContent(
      "apps/mobile/src/lib/supabase.ts",
      `// Never reference SUPABASE_SERVICE_ROLE_KEY in this file.\nconst key = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;`,
    );
    expect(violations).toEqual([]);
  });

  it("does NOT flag a block comment mentioning a forbidden EXPO_PUBLIC_ identifier", () => {
    const violations = scanSourceContent(
      "apps/mobile/src/lib/supabase.ts",
      `/* e.g. never name a var EXPO_PUBLIC_SERVICE_KEY */\nconst key = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;`,
    );
    expect(violations).toEqual([]);
  });

  // Regression test for finding 4 (Review Gate, remediation cycle 1): the
  // Review Gate planted a real-shaped service_role JWT under an innocuous
  // name (CLIENT_KEY, not reachable from App.tsx) and got a clean PASS on
  // the source scan, because it only ever matched identifier NAMES, never
  // the literal VALUE. A key sitting unused/unreachable in source still
  // leaks to anyone with repo access, which is exactly what the
  // source-scan half of SEC-3 exists to prevent.
  it("flags a hardcoded service-role-shaped JWT under an innocuous variable name (legacy JWT shape)", () => {
    const fakeServiceRoleJwt =
      "eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoic2VydmljZV9yb2xlIn0.abcdefghijklmnopqrstuvwx";
    const violations = scanSourceContent(
      "apps/mobile/src/lib/unused-constants.ts",
      `const CLIENT_KEY = "${fakeServiceRoleJwt}";`,
    );
    expect(violations.length).toBeGreaterThan(0);
    expect(violations.some((v) => v.includes("service-role key shape"))).toBe(true);
  });

  it("flags a hardcoded value matching the new-style sb_secret_ shape under an innocuous name", () => {
    const violations = scanSourceContent(
      "apps/mobile/src/lib/unused-constants.ts",
      `const CLIENT_KEY = "sb_secret_abcdefghijklmnopqrstuvwx123";`,
    );
    expect(violations.length).toBeGreaterThan(0);
    expect(violations.some((v) => v.includes("service-role key shape"))).toBe(true);
  });

  it("documented tradeoff: a legitimately inlined anon JWT also fails closed (can't distinguish role by shape alone)", () => {
    // Same eyJ...eyJ...xyz shape as a service_role JWT — SERVICE_ROLE_VALUE_RE
    // matches on shape, not on the decoded `role` claim. This is a known,
    // accepted false-positive direction (fail closed), documented in
    // check-bundle-keys.ts's scanSourceContent comment.
    const fakeAnonJwt = "eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiYW5vbiJ9.abcdefghijklmnopqrstuvwx";
    const violations = scanSourceContent("apps/mobile/src/lib/supabase.ts", `const k = "${fakeAnonJwt}";`);
    expect(violations.length).toBeGreaterThan(0);
  });
});

describe("stripJsComments", () => {
  it("strips a whole-line // comment", () => {
    expect(stripJsComments("// a comment\nconst x = 1;")).toBe("\nconst x = 1;");
  });

  it("strips a trailing // comment", () => {
    expect(stripJsComments("const x = 1; // trailing")).toBe("const x = 1; ");
  });

  it("strips a /* */ block comment", () => {
    expect(stripJsComments("const x = 1; /* block */ const y = 2;")).toBe("const x = 1;  const y = 2;");
  });

  it("does NOT strip an https:// URL", () => {
    expect(stripJsComments('const url = "https://example.com";')).toBe('const url = "https://example.com";');
  });
});

describe("scanBundleContent", () => {
  it("passes clean bundle content", () => {
    const violations = scanBundleContent("bundle.js", `var x = "hello world";`);
    expect(violations).toEqual([]);
  });

  it("flags the literal substring service_role", () => {
    const violations = scanBundleContent("bundle.js", `var role = "service_role";`);
    expect(violations.length).toBeGreaterThan(0);
  });

  it("flags a value matching a legacy JWT service-role key shape", () => {
    const fakeJwt = "eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoic2VydmljZV9yb2xlIn0.abcdefghijklmnopqrstuvwx";
    const violations = scanBundleContent("bundle.js", `var k = "${fakeJwt}";`);
    expect(violations.length).toBeGreaterThan(0);
  });

  it("flags a value matching the new-style sb_secret_ shape", () => {
    const violations = scanBundleContent("bundle.js", `var k = "sb_secret_abcdefghijklmnopqrstuvwx123";`);
    expect(violations.length).toBeGreaterThan(0);
  });
});

describe("SERVICE_ROLE_VALUE_RE", () => {
  it("does not false-positive on an ordinary anon publishable key", () => {
    SERVICE_ROLE_VALUE_RE.lastIndex = 0;
    expect(SERVICE_ROLE_VALUE_RE.test("sb_publishable_ACJWlzQHlZjBrEguHvfOxg_3BJgxAaH")).toBe(false);
  });
});
