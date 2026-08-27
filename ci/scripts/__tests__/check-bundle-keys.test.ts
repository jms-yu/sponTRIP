import { describe, it, expect } from "vitest";
import { scanSourceContent, scanBundleContent, SERVICE_ROLE_VALUE_RE } from "../check-bundle-keys.js";

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
