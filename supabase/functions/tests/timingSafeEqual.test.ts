// Unit tests for the constant-time secret comparison helper (remediation
// cycle 1, finding 5). Run with:
//   deno test --allow-net supabase/functions/tests/timingSafeEqual.test.ts
import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { timingSafeEqual } from "../_shared/timingSafeEqual.ts";

Deno.test("timingSafeEqual: returns true for identical strings", async () => {
  assertEquals(await timingSafeEqual("my-shared-secret", "my-shared-secret"), true);
});

Deno.test("timingSafeEqual: returns false for different strings of the same length", async () => {
  assertEquals(await timingSafeEqual("my-shared-secret", "my-shared-secreT"), false);
});

Deno.test("timingSafeEqual: returns false for strings differing only in the first character", async () => {
  assertEquals(await timingSafeEqual("xy-shared-secret", "my-shared-secret"), false);
});

Deno.test("timingSafeEqual: returns false for strings of different lengths", async () => {
  assertEquals(await timingSafeEqual("short", "a-much-longer-secret-value"), false);
});

Deno.test("timingSafeEqual: returns false when one input is empty", async () => {
  assertEquals(await timingSafeEqual("", "non-empty"), false);
});

Deno.test("timingSafeEqual: returns true when both inputs are empty", async () => {
  assertEquals(await timingSafeEqual("", ""), true);
});

Deno.test("timingSafeEqual: is case-sensitive", async () => {
  assertEquals(await timingSafeEqual("Secret", "secret"), false);
});
