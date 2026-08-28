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
 *   READ:
 *     - anon gets 0 rows unless `publicRead`
 *     - user B gets 0 rows / no effect against user A's owned rows
 *     - `adminOnly` targets reject both A and B entirely
 *   WRITE (remediation cycle 1, finding 2 — previously untested entirely):
 *     - anon/A/B cannot INSERT, UPDATE, or DELETE unless `ownerWritable`
 *       is true AND the acting identity is the row's own owner
 *
 * Also (finding 3): before running the matrix, asserts every `target`
 * actually exists in the live schema, and distinguishes a genuine RLS
 * denial from a schema/transport error (PostgREST PGRST205 "table not
 * found", PGRST202, network failure) rather than silently counting the
 * latter as "0 visible rows = deny working correctly."
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

// PostgREST error codes that mean "this isn't a schema/transport problem, it
// really is an RLS/permission denial" — anything else (PGRST205 "table not
// found", PGRST202 "function not found", or a thrown network error) must
// fail loudly rather than being silently counted as "0 rows = deny working."
// 42501 = insufficient_privilege (Postgres). PGRST116 = "no rows" from
// .single()/.maybeSingle(), which is a legitimate empty-result shape, not
// an error condition, for our purposes.
const RLS_DENIAL_CODES = new Set(["42501", "PGRST116"]);
// Prefixes of PostgREST codes that indicate the schema itself is wrong
// (missing table, missing column, missing relationship) — these must never
// be silently treated as a deny.
const SCHEMA_ERROR_CODES = new Set(["PGRST202", "PGRST203", "PGRST205", "PGRST301"]);

function classifyError(error: { code?: string; message?: string } | null): "denied" | "schema_error" | "other_error" {
  if (!error) return "denied"; // no error at all is handled by the caller before classifyError is invoked
  const code = error.code ?? "";
  if (SCHEMA_ERROR_CODES.has(code)) return "schema_error";
  if (RLS_DENIAL_CODES.has(code)) return "denied";
  // Postgres RLS/permission errors sometimes surface without a recognized
  // PostgREST code but with "permission denied" or "row-level security" in
  // the message — treat those as denials too. Anything else is unknown and
  // must not be silently swallowed.
  const msg = (error.message ?? "").toLowerCase();
  if (msg.includes("permission denied") || msg.includes("row-level security") || msg.includes("violates row-level security policy")) {
    return "denied";
  }
  return "other_error";
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

function baseTableFor(row: MatrixRow): string {
  return row.target.endsWith("_view") ? row.target.replace(/_view$/, "") : row.target;
}

/** Asserts every matrix target actually exists in the live schema BEFORE
 * running any assertions against it (finding 3) — a typo'd/renamed/dropped
 * table must fail loudly, not silently pass as "0 rows visible." Queried
 * via the service-role client (bypasses RLS, so existence — not
 * visibility — is what's being checked here). */
async function assertTargetsExist(admin: SupabaseClient, rows: MatrixRow[]): Promise<string[]> {
  const failures: string[] = [];
  for (const row of rows) {
    // NOTE: deliberately NOT { head: true, count: "exact" } — that
    // combination was empirically found (during remediation cycle 1) to
    // return a bare 204 No Content with `error: null` for a table that
    // does not exist at all, silently defeating this exact check. A plain
    // row-returning select correctly surfaces PGRST205 for a missing table.
    const { error } = await admin.from(row.target).select("*").limit(1);
    if (error) {
      failures.push(
        `matrix target "${row.target}" does not exist or is not queryable via service_role ` +
          `(code=${error.code ?? "unknown"} message="${error.message}") — fix the matrix entry or the schema ` +
          `before trusting this suite's result for it`,
      );
    }
  }
  return failures;
}

async function seedRow(admin: SupabaseClient, row: MatrixRow, ownerId: string): Promise<string> {
  const baseTable = baseTableFor(row);
  const payload: Record<string, unknown> = { ...row.insertPayload };
  if (row.ownerColumn) payload[row.ownerColumn] = ownerId;

  const { data, error } = await admin.from(baseTable).insert(payload).select("id").single();
  if (error || !data) {
    throw new Error(`Failed to seed row for ${row.target}: ${error?.message}`);
  }
  return data.id as string;
}

async function countVisibleRows(
  client: SupabaseClient,
  target: string,
  rowId: string | null,
): Promise<{ count: number; failure: string | null }> {
  let query = client.from(target).select("id", { count: "exact", head: false });
  if (rowId) query = query.eq("id", rowId);
  const { data, error } = await query;

  if (!error) return { count: data?.length ?? 0, failure: null };

  const classification = classifyError(error);
  if (classification === "denied") return { count: 0, failure: null };

  // schema_error or other_error — this must NOT be silently treated as a
  // successful deny (finding 3's exact bug).
  return {
    count: 0,
    failure: `${target}: read attempt errored in an UNEXPECTED way (not a recognized RLS denial) — ` +
      `code=${error.code ?? "unknown"} message="${error.message}" — this is a ${classification}, not a deny; ` +
      `fix the matrix/schema, don't trust this as a pass`,
  };
}

/** Attempts an INSERT as `client` (anon has actingUid=null and no owner
 * column value set), tagging the row with a per-call-unique `probeValue` in
 * `row.writeProbe.column` so it can be found unambiguously afterward.
 *
 * Deliberately does NOT chain `.select()` onto the mutating call and does
 * NOT trust its error/success report as the verdict (remediation cycle 2,
 * finding 2 follow-up — QA proved live that the previous version's
 * `.insert(payload).select("id").single()` was the bug: Postgres RLS
 * requires `INSERT ... RETURNING` to ALSO satisfy a SELECT policy for the
 * acting role, and every M0 matrix row has zero SELECT policies. That means
 * a genuinely-denied INSERT and a genuinely-SUCCESSFUL INSERT whose
 * RETURNING-read was separately denied produce the byte-identical
 * "new row violates row-level security policy" error — the suite could not
 * tell them apart and reported PASS either way, even with a real permissive
 * INSERT policy in place. QA's live reproduction: a raw insert WITHOUT
 * `.select()` got a real `201 Created` and the row persisted, while this
 * function's old `.select()`-chained version reported "denied.")
 *
 * Fixed by mirroring exactly how attemptUpdate/attemptDelete already work:
 * fire the mutation, then independently verify via a SEPARATE service-role
 * read — immune to any client-side response masking, whether that masking
 * comes from RLS denying the INSERT itself or from RLS denying only the
 * RETURNING-read of an INSERT that actually succeeded. */
async function attemptInsert(
  client: SupabaseClient,
  admin: SupabaseClient,
  row: MatrixRow,
  actingUid: string | null,
  probeValue: string,
): Promise<{ succeeded: boolean; failure: string | null }> {
  const baseTable = baseTableFor(row);
  const payload: Record<string, unknown> = { ...row.insertPayload, [row.writeProbe.column]: probeValue };
  if (row.ownerColumn && actingUid) payload[row.ownerColumn] = actingUid;

  // Bare insert — no .select() chained, so its own return value is never
  // the verdict. The client library still needs SOME call to issue the
  // INSERT, but what it reports (error or not) is deliberately ignored
  // below in favor of the independent service-role read.
  const { error } = await client.from(row.target).insert(payload);

  // ALWAYS independently verify via service_role — authoritative,
  // regardless of what the acting client's own insert call reported.
  const { data: confirmed } = await admin
    .from(baseTable)
    .select("id")
    .eq(row.writeProbe.column, probeValue)
    .maybeSingle();

  const succeeded = Boolean(confirmed);
  if (confirmed) {
    await admin.from(baseTable).delete().eq("id", confirmed.id); // cleanup, always
  }

  // The row did NOT land. If the client-reported error isn't a recognized
  // RLS denial, that's still worth surfacing (finding 3's same "don't
  // silently swallow an unexpected error as a pass" principle) — but it
  // never overrides the authoritative succeeded=false verdict above.
  if (!succeeded && error) {
    const classification = classifyError(error);
    if (classification !== "denied") {
      return {
        succeeded: false,
        failure: `${row.target}: INSERT attempt errored unexpectedly (not a recognized RLS denial) — ` +
          `code=${error.code ?? "unknown"} message="${error.message}"`,
      };
    }
  }

  return { succeeded, failure: null };
}

/** Attempts an UPDATE of row.writeProbe.column to a per-call-unique
 * probeValue, then re-reads via service_role to confirm whether it
 * actually changed — a client-side "success" with 0 rows matched (RLS
 * silently filtered the target) looks identical to a real deny unless you
 * check the authoritative state afterward, which is exactly finding 2's
 * point. */
async function attemptUpdate(
  client: SupabaseClient,
  admin: SupabaseClient,
  row: MatrixRow,
  seededRowId: string,
  probeValue: string,
): Promise<boolean> {
  const baseTable = baseTableFor(row);
  await client.from(row.target).update({ [row.writeProbe.column]: probeValue }).eq("id", seededRowId);

  const { data: confirmed } = await admin
    .from(baseTable)
    .select(row.writeProbe.column)
    .eq("id", seededRowId)
    .maybeSingle();
  const currentValue = confirmed ? (confirmed as unknown as Record<string, unknown>)[row.writeProbe.column] : undefined;
  return currentValue === probeValue;
}

/** Attempts a DELETE, then re-reads via service_role to confirm whether
 * the row is actually gone. */
async function attemptDelete(client: SupabaseClient, admin: SupabaseClient, row: MatrixRow, seededRowId: string): Promise<boolean> {
  const baseTable = baseTableFor(row);
  await client.from(row.target).delete().eq("id", seededRowId);
  const { data: confirmed } = await admin.from(baseTable).select("id").eq("id", seededRowId).maybeSingle();
  return !confirmed;
}

interface WriteCheckIdentity {
  label: string;
  client: SupabaseClient;
  uid: string | null;
  isOwner: boolean;
}

async function runWriteChecks(
  admin: SupabaseClient,
  anonClient: SupabaseClient,
  userA: TestUser,
  userB: TestUser,
  row: MatrixRow,
  seededRowId: string,
): Promise<string[]> {
  const failures: string[] = [];
  const identities: WriteCheckIdentity[] = [
    { label: "anon", client: anonClient, uid: null, isOwner: false },
    { label: "user A (owner)", client: userA.client, uid: userA.id, isOwner: true },
    { label: "user B (non-owner)", client: userB.client, uid: userB.id, isOwner: false },
  ];

  const ownerCanWrite = !row.adminOnly && row.ownerColumn !== null && row.ownerWritable;

  // INSERT — every identity attempts to insert a new row "as themselves,"
  // each tagged with a distinct probe value so its fate can be looked up
  // unambiguously via the independent service-role read inside attemptInsert.
  for (const identity of identities) {
    const expectSuccess = ownerCanWrite && identity.isOwner;
    const probeValue = `inserted-by-${identity.label.replace(/[^a-z0-9]/gi, "-")}-${crypto.randomUUID()}`;
    const { succeeded, failure } = await attemptInsert(identity.client, admin, row, identity.uid, probeValue);
    if (failure) {
      failures.push(failure);
    } else if (succeeded && !expectSuccess) {
      failures.push(`${row.target}: ${identity.label} INSERT unexpectedly SUCCEEDED — expected denial`);
    } else if (!succeeded && expectSuccess) {
      failures.push(`${row.target}: ${identity.label} (owner) INSERT unexpectedly DENIED — ownerWritable=true expects this to succeed`);
    }
  }

  // UPDATE — every identity attempts to mutate the shared seeded row, each
  // with a distinct probe value so we can attribute any actual change to
  // exactly one identity's attempt, unambiguously.
  for (const identity of identities) {
    const expectSuccess = ownerCanWrite && identity.isOwner;
    const probeValue = `mutated-by-${identity.label.replace(/[^a-z0-9]/gi, "-")}-${crypto.randomUUID()}`;
    const succeeded = await attemptUpdate(identity.client, admin, row, seededRowId, probeValue);
    if (succeeded && !expectSuccess) {
      failures.push(`${row.target}: ${identity.label} UPDATE unexpectedly took effect — expected denial`);
    } else if (!succeeded && expectSuccess) {
      failures.push(`${row.target}: ${identity.label} (owner) UPDATE unexpectedly had no effect — ownerWritable=true expects this to succeed`);
    }
  }

  // DELETE — non-owners first (row must still exist after each), owner
  // last (only identity ever allowed to actually consume the row).
  const deleteOrder = [...identities].sort((a, b) => Number(a.isOwner) - Number(b.isOwner));
  for (const identity of deleteOrder) {
    const expectSuccess = ownerCanWrite && identity.isOwner;
    const succeeded = await attemptDelete(identity.client, admin, row, seededRowId);
    if (succeeded && !expectSuccess) {
      failures.push(`${row.target}: ${identity.label} DELETE unexpectedly SUCCEEDED — expected denial`);
    } else if (!succeeded && expectSuccess) {
      failures.push(`${row.target}: ${identity.label} (owner) DELETE unexpectedly DENIED — ownerWritable=true expects this to succeed`);
    }
    if (succeeded) break; // row is gone, nothing left to attempt against
  }

  return failures;
}

async function runRow(
  admin: SupabaseClient,
  anonClient: SupabaseClient,
  userA: TestUser,
  userB: TestUser,
  row: MatrixRow,
): Promise<string[]> {
  const failures: string[] = [];
  const seededRowId = await seedRow(admin, row, userA.id);

  try {
    // --- READ ---
    const anonRead = await countVisibleRows(anonClient, row.target, seededRowId);
    if (anonRead.failure) failures.push(anonRead.failure);
    else if (!row.publicRead && anonRead.count > 0) {
      failures.push(`${row.target}: anon saw ${anonRead.count} row(s) — expected 0 (publicRead=false)`);
    }

    if (row.adminOnly) {
      const aRead = await countVisibleRows(userA.client, row.target, seededRowId);
      const bRead = await countVisibleRows(userB.client, row.target, seededRowId);
      if (aRead.failure) failures.push(aRead.failure);
      else if (aRead.count > 0) failures.push(`${row.target}: adminOnly but non-admin user A saw ${aRead.count} row(s)`);
      if (bRead.failure) failures.push(bRead.failure);
      else if (bRead.count > 0) failures.push(`${row.target}: adminOnly but non-admin user B saw ${bRead.count} row(s)`);
    } else if (row.ownerColumn) {
      const bRead = await countVisibleRows(userB.client, row.target, seededRowId);
      if (bRead.failure) failures.push(bRead.failure);
      else if (bRead.count > 0) {
        failures.push(`${row.target}: non-owner user B saw ${bRead.count} row(s) owned by user A — expected 0`);
      }
    }

    // --- WRITE (finding 2) ---
    failures.push(...(await runWriteChecks(admin, anonClient, userA, userB, row, seededRowId)));
  } finally {
    // Final cleanup — the row may already be gone (a correctly-allowed
    // owner delete in a future ownerWritable=true table), so ignore errors.
    await admin.from(baseTableFor(row)).delete().eq("id", seededRowId).then(
      () => {},
      () => {},
    );
  }

  return failures;
}

async function main(): Promise<void> {
  const admin = makeSupabaseClient(SUPABASE_URL, SERVICE_ROLE_KEY!);
  const anonClient = makeSupabaseClient(SUPABASE_URL, ANON_KEY!);

  console.log("rls-negative-auth: verifying every matrix target exists in the live schema...");
  const existenceFailures = await assertTargetsExist(admin, matrix);
  if (existenceFailures.length > 0) {
    console.error("rls-negative-auth: FAIL — matrix references target(s) that don't exist");
    for (const f of existenceFailures) console.error(`  ${f}`);
    process.exit(1);
  }

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
    console.log(`rls-negative-auth: PASS (${matrix.length} target(s) checked — read AND write — all deny-by-default as expected)`);
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
