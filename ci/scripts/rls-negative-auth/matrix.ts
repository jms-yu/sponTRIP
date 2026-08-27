/**
 * rls-negative-auth/matrix.ts — SEC-2's data-driven test matrix.
 *
 * One row per table/view. run.ts seeds two throwaway users (A, B) via the
 * service-role client's auth.admin.createUser, signs in as each for real
 * access tokens, builds anon / user-A / user-B Supabase JS clients, and for
 * every row here asserts:
 *   - anon gets 0 rows unless `publicRead` is true
 *   - user B gets 0 rows / no effect against user A's owned rows
 *   - `adminOnly` targets reject both A and B entirely
 *
 * *** BINDING FOR EVERY MILESTONE FROM M1 ONWARD ***
 * Every milestone that adds a new table or view MUST add its row here.
 * This is the concrete mechanism that makes SEC-5's downgrade to optional
 * (decision 112) safe rather than a quiet weakening — SEC-2 (this suite) is
 * the mandatory, unchanged control. Do not ship a new table/view without a
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
}

export const matrix: MatrixRow[] = [
  {
    // M0: SEC-1's proof table. RLS enabled, deliberately zero policies.
    // Every access path (anon, owner, non-owner) must see zero rows.
    target: "smoke_test",
    ownerColumn: "owner_id",
    publicRead: false,
    adminOnly: false,
  },
  {
    // M0: proves security_invoker actually delegates RLS through a view,
    // not just that the flag is set (SEC-4's live-schema check covers the
    // flag itself; this proves the flag's real effect).
    target: "smoke_test_view",
    ownerColumn: "owner_id",
    publicRead: false,
    adminOnly: false,
  },
  {
    // M0: INF-4's job ledger. No policies at all — readable/writable only
    // via service_role, i.e. trusted server-side code. Doubles as the
    // matrix's "admin-only table" pattern until M7's real is_admin claim
    // exists.
    target: "job_runs",
    ownerColumn: null,
    publicRead: false,
    adminOnly: true,
  },
];
