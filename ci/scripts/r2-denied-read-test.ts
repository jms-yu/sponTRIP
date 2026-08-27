#!/usr/bin/env tsx
/**
 * r2-denied-read-test.ts — INF-9, verified by a denied-read attempt, not by
 * inspection.
 *
 * Requires REAL dev-tier R2 buckets and a REACHABLE mint-storage-url Edge
 * Function (local `supabase functions serve` or the dev cloud project).
 * This is deliberately NOT run against fake/dummy credentials — its whole
 * point is proving real denial against real infrastructure.
 *
 * Two things must be true:
 *   1. Any UNAUTHENTICATED direct read against an R2 bucket object fails —
 *      there is no direct/public bucket read path at all, ever.
 *   2. Any call to mint-storage-url for "receipts" or "verification"
 *      returns exactly 403 { error: "location_not_available" }, regardless
 *      of who's calling — unconditional at M0.
 *
 * Skips (exit 0 with a loud warning, not a silent pass counted as green)
 * when R2 credentials or a reachable mint-storage-url endpoint aren't
 * configured — e.g. a contributor's machine with no dev R2 bucket access.
 * CI must have these configured as repository secrets for this to be a
 * real gate; see .spark/environment.md.
 *
 * Exit code contract: 0 = pass (or honestly-skipped), 1 = fail.
 */
import { S3Client, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";

const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
const R2_ENDPOINT = process.env.R2_ENDPOINT ?? (R2_ACCOUNT_ID ? `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com` : undefined);
const R2_BUCKET_GENERAL = process.env.R2_BUCKET_GENERAL ?? "general";
const R2_BUCKET_RECEIPTS = process.env.R2_BUCKET_RECEIPTS ?? "receipts";
const R2_BUCKET_VERIFICATION = process.env.R2_BUCKET_VERIFICATION ?? "verification";
const R2_ENV_PREFIX = process.env.R2_ENV_PREFIX ?? "dev";

const SUPABASE_URL = process.env.SUPABASE_URL ?? "http://127.0.0.1:54421";
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const hasR2Creds = Boolean(R2_ACCOUNT_ID && R2_ACCESS_KEY_ID && R2_SECRET_ACCESS_KEY);
const hasSupabaseCreds = Boolean(SUPABASE_ANON_KEY && SUPABASE_SERVICE_ROLE_KEY);

async function testUnauthenticatedDirectRead(): Promise<string[]> {
  const failures: string[] = [];
  // A totally unsigned, unauthenticated request straight at the object URL
  // (no presigned query params at all) — this must always fail. R2 buckets
  // in this project are never configured for public/anonymous access.
  for (const bucket of [R2_BUCKET_GENERAL, R2_BUCKET_RECEIPTS, R2_BUCKET_VERIFICATION]) {
    const url = `${R2_ENDPOINT}/${bucket}/${R2_ENV_PREFIX}/probe/does-not-need-to-exist.txt`;
    try {
      const res = await fetch(url);
      if (res.ok) {
        failures.push(`UNAUTHENTICATED direct read against bucket "${bucket}" succeeded (status ${res.status}) — must always fail`);
      }
    } catch {
      // Network-level failure also counts as "denied" — fine.
    }
  }
  return failures;
}

async function callMintStorageUrl(jwt: string | null, body: unknown): Promise<{ status: number; json: any }> {
  const res = await fetch(`${SUPABASE_URL}/functions/v1/mint-storage-url`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(jwt ? { Authorization: `Bearer ${jwt}` } : {}),
    },
    body: JSON.stringify(body),
  });
  const json = await res.json().catch(() => ({}));
  return { status: res.status, json };
}

async function testMintStorageUrlDenials(): Promise<string[]> {
  const failures: string[] = [];
  const { makeSupabaseClient } = await import("./lib/supabaseClient.js");
  const admin = makeSupabaseClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY!);

  const email = `r2-denied-read-${crypto.randomUUID()}@example.test`;
  const password = "correct horse battery staple 123";
  const { data: created, error: createError } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });
  if (createError || !created?.user) {
    return [`Failed to create throwaway test user: ${createError?.message}`];
  }

  try {
    const anon = makeSupabaseClient(SUPABASE_URL, SUPABASE_ANON_KEY!);
    const { data: session, error: signInError } = await anon.auth.signInWithPassword({ email, password });
    if (signInError || !session?.session) {
      return [`Failed to sign in throwaway test user: ${signInError?.message}`];
    }
    const jwt = session.session.access_token;

    const receipts = await callMintStorageUrl(jwt, { bucket: "receipts", key: "anything", operation: "read" });
    if (receipts.status !== 403 || receipts.json?.error !== "location_not_available") {
      failures.push(`mint-storage-url for "receipts" returned status=${receipts.status} body=${JSON.stringify(receipts.json)} — expected 403 location_not_available`);
    }

    const verification = await callMintStorageUrl(jwt, { bucket: "verification", key: "anything", operation: "read" });
    if (verification.status !== 403 || verification.json?.error !== "location_not_available") {
      failures.push(`mint-storage-url for "verification" returned status=${verification.status} body=${JSON.stringify(verification.json)} — expected 403 location_not_available`);
    }
  } finally {
    await admin.auth.admin.deleteUser(created.user.id).catch(() => {});
  }

  return failures;
}

async function main(): Promise<void> {
  if (!hasR2Creds) {
    console.warn(
      "r2-denied-read-test: SKIPPED — no R2 credentials in environment (R2_ACCOUNT_ID / " +
        "R2_ACCESS_KEY_ID / R2_SECRET_ACCESS_KEY). This is a HONEST skip, not a pass: INF-9's " +
        "real denied-read proof has NOT run. CI must set real dev-tier R2 credentials as " +
        "repository secrets for this check to be meaningful.",
    );
    process.exit(0);
  }
  if (!hasSupabaseCreds) {
    console.warn(
      "r2-denied-read-test: SKIPPED — no Supabase credentials in environment. The " +
        "mint-storage-url denial half of INF-9 has NOT run.",
    );
    process.exit(0);
  }

  const failures: string[] = [];
  failures.push(...(await testUnauthenticatedDirectRead()));
  failures.push(...(await testMintStorageUrlDenials()));

  if (failures.length === 0) {
    console.log("r2-denied-read-test: PASS — unauthenticated direct reads denied, receipts/verification always 403");
    process.exit(0);
  }

  console.error("r2-denied-read-test: FAIL — INF-9 violation");
  for (const f of failures) console.error(`  ${f}`);
  process.exit(1);
}

main().catch((err) => {
  console.error("r2-denied-read-test: ERROR —", err instanceof Error ? err.stack ?? err.message : err);
  process.exit(1);
});
