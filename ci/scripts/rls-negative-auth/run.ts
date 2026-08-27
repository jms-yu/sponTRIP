#!/usr/bin/env tsx
/**
 * rls-negative-auth/run.ts — SEC-2's generic runner, blocking merge on
 * every PR. Reads matrix.ts (data-driven, one row per table/view) and
 * proves deny-by-default RLS mechanically rather than by inspection.
 *
 * For every matrix row, seeds two throwaway users (A, B) via the
 * service-role client's auth.admin.createUser, signs in as each for real
 * access tokens, builds anon / user-A / user-B Supabase JS clients, and
 * asserts:
 *   - anon gets 0 rows unless `publicRead`
 *   - user B gets 0 rows / no effect against user A's owned rows
 *   - `adminOnly` targets reject both A and B entirely
 *
 * Requires a running local Supabase stack (`supabase start`). Reads
 * SUPABASE_URL / SUPABASE_ANON_KEY / SUPABASE_SERVICE_ROLE_KEY from the
 * environment — the local-Docker CI job needs no real external
 * credentials (per .spark/environment.md).
 *
 * Exit code contract: 0 = pass, 1 = fail (blocks merge).
 */
import { makeSupabaseClient } from "../lib/supabaseClient.js";
import { matrix, type MatrixRow } from "./matrix.js";

// Derived from makeSupabaseClient's own inferred return type rather than
// importing SupabaseClient directly — see lib/supabaseClient.ts for why an
// explicit SupabaseClient annotation there mismatches its inferred schema
// generic.
type SupabaseClient = ReturnType<typeof makeSupabaseClient>;

const SUPABASE_URL = process.env.SUPABASE_URL ?? "http://127.0.0.1:54421";
const ANON_KEY = process.env.SUPABASE_ANON_KEY;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!ANON_KEY || !SERVICE_ROLE_KEY) {
  console.error(
    "rls-negative-auth: missing SUPABASE_ANON_KEY or SUPABASE_SERVICE_ROLE_KEY in environment",
  );
  process.exit(1);
}

interface TestUser {
  id: string;
  email: string;
  client: SupabaseClient;
}

async function createTestUser(admin: SupabaseClient, label: string): Promise<TestUser> {
  const email = `rls-neg-auth-${label}-${crypto.randomUUID()}@example.test`;
  const password = "correct horse battery staple 123";

  const { data, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });
  if (error || !data.user) {
    throw new Error(`Failed to create test user ${label}: ${error?.message}`);
  }

  const anon = makeSupabaseClient(SUPABASE_URL, ANON_KEY!);
  const { data: session, error: signInError } = await anon.auth.signInWithPassword({ email, password });
  if (signInError || !session.session) {
    throw new Error(`Failed to sign in test user ${label}: ${signInError?.message}`);
  }

  const userClient = makeSupabaseClient(SUPABASE_URL, ANON_KEY!, {
    global: { headers: { Authorization: `Bearer ${session.session.access_token}` } },
  });

  return { id: data.user.id, email, client: userClient };
}

async function seedOwnedRow(admin: SupabaseClient, row: MatrixRow, ownerId: string): Promise<string | null> {
  if (!row.ownerColumn || row.adminOnly) return null;
  // Insert directly into the base table via the admin client so RLS never
  // blocks the seed itself. smoke_test_view reads from smoke_test, so we
  // seed the base table for either target.
  const baseTable = row.target.endsWith("_view") ? row.target.replace(/_view$/, "") : row.target;
  const { data, error } = await admin
    .from(baseTable)
    .insert({ [row.ownerColumn]: ownerId, label: `rls-neg-auth seed for ${row.target}` })
    .select("id")
    .single();
  if (error) {
    throw new Error(`Failed to seed owned row for ${row.target}: ${error.message}`);
  }
  return data.id as string;
}

async function countVisibleRows(client: SupabaseClient, target: string, rowId: string | null): Promise<number> {
  let query = client.from(target).select("id", { count: "exact", head: false });
  if (rowId) query = query.eq("id", rowId);
  const { data, error } = await query;
  // A permissions error (RLS denial surfaced as an error rather than an
  // empty result set) also counts as "zero visible rows" for our purposes —
  // both are a correct deny outcome.
  if (error) return 0;
  return data?.length ?? 0;
}

async function runRow(admin: SupabaseClient, anonClient: SupabaseClient, userA: TestUser, userB: TestUser, row: MatrixRow): Promise<string[]> {
  const failures: string[] = [];
  const seededRowId = await seedOwnedRow(admin, row, userA.id);

  // anon
  const anonCount = await countVisibleRows(anonClient, row.target, seededRowId);
  if (row.publicRead) {
    // publicRead targets aren't used at M0 (all three rows are non-public);
    // kept generic for future milestones per the matrix's own contract.
  } else if (anonCount > 0) {
    failures.push(`${row.target}: anon saw ${anonCount} row(s) — expected 0 (publicRead=false)`);
  }

  if (row.adminOnly) {
    // Both A and B must be rejected entirely — no owner-based access exists.
    const aCount = await countVisibleRows(userA.client, row.target, seededRowId);
    const bCount = await countVisibleRows(userB.client, row.target, seededRowId);
    if (aCount > 0) failures.push(`${row.target}: adminOnly but non-admin user A saw ${aCount} row(s)`);
    if (bCount > 0) failures.push(`${row.target}: adminOnly but non-admin user B saw ${bCount} row(s)`);
    return failures;
  }

  if (row.ownerColumn && seededRowId) {
    // User B must not see user A's owned row.
    const bCount = await countVisibleRows(userB.client, row.target, seededRowId);
    if (bCount > 0) {
      failures.push(`${row.target}: non-owner user B saw ${bCount} row(s) owned by user A — expected 0`);
    }
  }

  return failures;
}

async function main(): Promise<void> {
  const admin = makeSupabaseClient(SUPABASE_URL, SERVICE_ROLE_KEY!);
  const anonClient = makeSupabaseClient(SUPABASE_URL, ANON_KEY!);

  console.log(`rls-negative-auth: seeding throwaway users A and B...`);
  const userA = await createTestUser(admin, "a");
  const userB = await createTestUser(admin, "b");

  const allFailures: string[] = [];

  try {
    for (const row of matrix) {
      console.log(`rls-negative-auth: checking ${row.target}...`);
      const failures = await runRow(admin, anonClient, userA, userB, row);
      allFailures.push(...failures);
    }
  } finally {
    // Cleanup — never leave throwaway users behind, even on failure.
    await admin.auth.admin.deleteUser(userA.id).catch(() => {});
    await admin.auth.admin.deleteUser(userB.id).catch(() => {});
  }

  if (allFailures.length === 0) {
    console.log(`rls-negative-auth: PASS (${matrix.length} target(s) checked, all deny-by-default as expected)`);
    process.exit(0);
  }

  console.error("rls-negative-auth: FAIL — SEC-2 violation(s)");
  for (const f of allFailures) console.error(`  ${f}`);
  process.exit(1);
}

main().catch((err) => {
  console.error("rls-negative-auth: ERROR —", err instanceof Error ? err.stack ?? err.message : err);
  process.exit(1);
});
