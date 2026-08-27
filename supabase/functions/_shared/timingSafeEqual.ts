/**
 * Constant-time string comparison for shared-secret checks.
 *
 * scheduled-smoke-ok, scheduled-smoke-fail, and send-test-push all set
 * `verify_jwt = false` (see supabase/config.toml) and rely ENTIRELY on the
 * `x-cron-secret` header matching `CRON_SHARED_SECRET` — it's the whole
 * access control for those three functions, not defense-in-depth. A naive
 * `a === b` string compare short-circuits on the first mismatched byte,
 * which leaks a timing signal proportional to how many leading characters
 * of a guess are correct. Remote timing attacks over HTTP are impractical
 * here (this project's threat model doesn't call it HIGH), but this
 * project's stated posture is mechanical correctness, not "probably fine."
 *
 * Uses the Web Crypto API (available in the Deno Edge Runtime) to hash
 * both inputs and compare the digests — comparing fixed-length digests
 * byte-by-byte with an XOR accumulator is constant-time regardless of
 * where the original strings first differ, without needing Node's
 * `crypto.timingSafeEqual` (not available in this Deno runtime) or an
 * external dependency. Hashing first also sidesteps the usual
 * "check lengths match before comparing" step direct byte-compare
 * approaches need — SHA-256 digests are always 32 bytes regardless of
 * input length, so there's no length-based signal to leak in the first
 * place.
 */
export async function timingSafeEqual(a: string, b: string): Promise<boolean> {
  const encoder = new TextEncoder();
  const [digestA, digestB] = await Promise.all([
    crypto.subtle.digest("SHA-256", encoder.encode(a)),
    crypto.subtle.digest("SHA-256", encoder.encode(b)),
  ]);

  const bytesA = new Uint8Array(digestA);
  const bytesB = new Uint8Array(digestB);

  // Both are SHA-256 digests, so this is always 32 bytes for either input
  // — the loop length itself never leaks anything about `a` or `b`.
  let diff = 0;
  for (let i = 0; i < bytesA.length; i++) {
    diff |= bytesA[i]! ^ bytesB[i]!;
  }
  return diff === 0;
}
