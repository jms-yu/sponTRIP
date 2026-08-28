#!/usr/bin/env tsx
/**
 * check-rls-enabled.ts — SEC-1 static check.
 *
 * Scans supabase/migrations/*.sql (in filename/timestamp order, i.e.
 * migration history order) for `create table public.X` statements, and
 * fails if any such table never gets a later
 * `alter table public.X enable row level security` in that same history.
 *
 * This is a STATIC check over migration SQL text, not a live-schema check —
 * deliberately cheap and fast, runs on every PR with no database required.
 * (SEC-4's check-security-invoker.ts is the live-schema counterpart, since
 * `security_invoker` needs to be checked against actual reloptions.)
 *
 * Exit code contract: 0 = pass, 1 = fail (blocks merge).
 */
import { readdirSync, readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, "..", "..");
const MIGRATIONS_DIR = join(REPO_ROOT, "supabase", "migrations");

const CREATE_TABLE_RE = /create\s+table\s+(?:if\s+not\s+exists\s+)?public\.(\w+)/gi;
const ENABLE_RLS_RE = /alter\s+table\s+public\.(\w+)\s+enable\s+row\s+level\s+security/gi;

export function stripSqlComments(sql: string): string {
  // Strip -- line comments (good enough for our own migration SQL; we don't
  // use /* */ block comments or string literals containing "--").
  return sql
    .split("\n")
    .map((line) => line.replace(/--.*$/, ""))
    .join("\n");
}

export interface MigrationFile {
  name: string;
  content: string;
}

export interface RlsCheckResult {
  tablesCreated: string[];
  missing: string[];
  createdInFile: Map<string, string>;
}

/** Pure logic, exported for unit testing — no filesystem access. `files`
 * must already be in migration-history (chronological) order. */
export function findMissingRlsTables(files: MigrationFile[]): RlsCheckResult {
  const tablesCreated = new Set<string>();
  const tablesWithRlsEnabled = new Set<string>();
  const createdInFile = new Map<string, string>();

  for (const file of files) {
    const sql = stripSqlComments(file.content);

    for (const match of sql.matchAll(CREATE_TABLE_RE)) {
      const tableName = match[1]!;
      tablesCreated.add(tableName);
      createdInFile.set(tableName, file.name);
    }
    for (const match of sql.matchAll(ENABLE_RLS_RE)) {
      tablesWithRlsEnabled.add(match[1]!);
    }
  }

  const missing = [...tablesCreated].filter((t) => !tablesWithRlsEnabled.has(t));
  return { tablesCreated: [...tablesCreated], missing, createdInFile };
}

function main(): void {
  const fileNames = readdirSync(MIGRATIONS_DIR)
    .filter((f) => f.endsWith(".sql"))
    .sort(); // filenames are timestamp-prefixed -> sort() = chronological order

  const files: MigrationFile[] = fileNames.map((name) => ({
    name,
    content: readFileSync(join(MIGRATIONS_DIR, name), "utf-8"),
  }));

  const { tablesCreated, missing, createdInFile } = findMissingRlsTables(files);

  if (missing.length === 0) {
    console.log(
      `check-rls-enabled: PASS (${tablesCreated.length} table(s) created, all have RLS enabled)`,
    );
    process.exit(0);
  }

  console.error("check-rls-enabled: FAIL — SEC-1 violation");
  for (const table of missing) {
    console.error(
      `  public.${table} (created in ${createdInFile.get(table)}) has no later ` +
        `"alter table public.${table} enable row level security" in migration history`,
    );
  }
  process.exit(1);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main();
}
