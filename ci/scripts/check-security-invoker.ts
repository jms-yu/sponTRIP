#!/usr/bin/env tsx
/**
 * check-security-invoker.ts — SEC-4 live-schema check.
 *
 * Postgres views bypass RLS by default (K5). This queries the LIVE schema
 * of a freshly-migrated Postgres (run `supabase db reset` or `supabase
 * start` first, or point SUPABASE_DB_URL at any migrated instance) and
 * fails if any `public` view's reloptions lack `security_invoker=true`.
 *
 * Deliberately a live-schema check, not a static SQL-text check — a view's
 * actual reloptions are the ground truth; text-matching "with
 * (security_invoker = true)" in a migration file could miss a view
 * altered afterward by a later migration.
 *
 * Exit code contract: 0 = pass, 1 = fail (blocks merge).
 */
import { Client } from "pg";

const DB_URL =
  process.env.SUPABASE_DB_URL ?? "postgresql://postgres:postgres@127.0.0.1:54422/postgres";

interface ViewRow {
  relname: string;
  reloptions: string[] | null;
}

async function main(): Promise<void> {
  const client = new Client({ connectionString: DB_URL });
  await client.connect();

  try {
    const { rows } = await client.query<ViewRow>(
      `select c.relname, c.reloptions
       from pg_class c
       join pg_namespace n on n.oid = c.relnamespace
       where c.relkind = 'v' and n.nspname = 'public'
       order by c.relname`,
    );

    const violations: string[] = [];
    for (const row of rows) {
      const options = row.reloptions ?? [];
      const hasSecurityInvoker = options.some(
        (opt) => opt.replace(/\s/g, "").toLowerCase() === "security_invoker=true",
      );
      if (!hasSecurityInvoker) {
        violations.push(row.relname);
      }
    }

    if (violations.length === 0) {
      console.log(
        `check-security-invoker: PASS (${rows.length} view(s) in public schema, all have security_invoker=true)`,
      );
      process.exit(0);
    }

    console.error("check-security-invoker: FAIL — SEC-4 violation");
    for (const v of violations) {
      console.error(`  public.${v} is missing WITH (security_invoker = true)`);
    }
    process.exit(1);
  } finally {
    await client.end();
  }
}

main().catch((err) => {
  console.error("check-security-invoker: ERROR —", err instanceof Error ? err.message : err);
  process.exit(1);
});
