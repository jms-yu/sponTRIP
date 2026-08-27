/**
 * rls-negative-auth/matrix.ts — SEC-2's data-driven test matrix.
 *
 * One row per table/view. run.ts seeds two throwaway users (A, B) via the
 * service-role client's auth.admin.createUser, signs in as each for real
 * access tokens, builds anon / user-A / user-B Supabase JS clients, and for
 * every row here asserts:
 *   - anon gets 0 rows unless `publicRead` is true (READ)
 *   - user B gets 0 rows / no effect against user A's owned rows (READ)
 *   - `adminOnly` targets reject both A and B entirely (READ)
 *   - anon/A/B cannot INSERT, UPDATE, or DELETE unless `ownerWritable` is
 *     true AND the acting identity is the row's own owner (WRITE) — added
 *     remediation cycle 1, finding 2: the "unwritable" half of SEC-1/SEC-2's
 *     "unreadable and unwritable" AC was previously never tested at all.
 *
 * *** BINDING FOR EVERY MILESTONE FROM M1 ONWARD ***
 * Every milestone that adds a new table or view MUST add its row here,
 * including insertPayload/writeProbe (schema-valid values for THAT table —
 * a generic/wrong payload can mask a real RLS bug behind a schema error
 * that looks like a deny). Do not ship a new table/view without a
 * corresponding matrix entry.
 */

export interface MatrixRow {
  /** Table or view name in the public schema. */
  target: string;
  /** Column that identifies the owning user's auth.uid(), or null if the
   * table has no per-row owner concept (e.g. an admin-only ledger table). */
  ownerColumn: string | null;
  /** True if anonymous (unauthenticated) reads are expected to succeed for
   * at least some rows. False means anon must see zero rows, period. */
  publicRead: boolean;
  /** True if this target must reject BOTH non-admin users entirely (no
   * anon, no owner-based access at all — service_role/admin only). */
  adminOnly: boolean;
  /** True if the row's OWNER (the identity whose id equals ownerColumn) is
   * expected to be able to insert their own row, update it, and delete it.
   * Non-owners (anon, any other authenticated user) must ALWAYS be denied
   * write regardless of this flag. Ignored when adminOnly is true or
   * ownerColumn is null (both cases: nobody but service_role writes).
   * M0 default is false for every row — smoke_test/smoke_test_view have
   * RLS enabled with literally zero policies, so even the "owner" has no
   * write access; only service_role can write. */
  ownerWritable: boolean;
  /** Extra columns (beyond ownerColumn) needed to satisfy this table's
   * NOT NULL/schema constraints for an INSERT attempt during write-denial
   * checks. Kept schema-only, not business logic — values don't need to be
   * unique across runs; the runner cleans up whatever it inserts. */
  insertPayload: Record<string, unknown>;
  /** A column + value used to test UPDATE — the runner attempts to set
   * this column to a per-identity-unique probe value, then re-reads via
   * the service-role client to confirm whether it actually changed. */
  writeProbe: { column: string };
}

export const matrix: MatrixRow[] = [
  {
    // M0: SEC-1's proof table. RLS enabled, deliberately zero policies.
    // Every access path (anon, owner, non-owner) must see zero rows AND
    // have zero write effect — nobody but service_role can touch it.
    target: "smoke_test",
    ownerColumn: "owner_id",
    publicRead: false,
    adminOnly: false,
    ownerWritable: false,
    insertPayload: { label: "rls-neg-auth-write-probe" },
    writeProbe: { column: "label" },
  },
  {
    // M0: proves security_invoker actually delegates RLS through a view,
    // not just that the flag is set (SEC-4's live-schema check covers the
    // flag itself; this proves the flag's real effect) — for writes too,
    // not just reads. smoke_test_view is a plain single-table view with no
    // INSTEAD OF triggers, so Postgres treats it as auto-updatable and
    // rewrites INSERT/UPDATE/DELETE through it onto smoke_test, subject to
    // smoke_test's own (zero) policies.
    target: "smoke_test_view",
    ownerColumn: "owner_id",
    publicRead: false,
    adminOnly: false,
    ownerWritable: false,
    insertPayload: { label: "rls-neg-auth-write-probe" },
    writeProbe: { column: "label" },
  },
  {
    // M0: INF-4's job ledger. No policies at all — readable/writable only
    // via service_role, i.e. trusted server-side code. Doubles as the
    // matrix's "admin-only table" pattern until M7's real is_admin claim
    // exists. ownerColumn is null (no per-row owner concept), so
    // ownerWritable is meaningless here — adminOnly alone drives the
    // "nobody but service_role" expectation for both read and write.
    target: "job_runs",
    ownerColumn: null,
    publicRead: false,
    adminOnly: true,
    ownerWritable: false,
    insertPayload: {
      job_name: "rls-neg-auth-write-probe",
      status: "running",
      scheduled_for: "2020-01-01T00:00:00Z",
    },
    writeProbe: { column: "job_name" },
  },
];
