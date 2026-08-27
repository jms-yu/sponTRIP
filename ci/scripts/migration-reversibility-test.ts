#!/usr/bin/env tsx
/**
 * migration-reversibility-test.ts — INF-2 acceptance criterion, mechanically
 * enforced on every PR, forever (not a one-time M0 artifact).
 *
 * Steps, applied to EVERY migration in the repo, not just the newest one
 * (remediation cycle 1, finding 9 — testing only the newest migration meant
 * a `create function`/`create type`/`create materialized view` in an OLDER
 * down file that forgets to drop it would pass silently forever once a
 * newer migration existed on top of it):
 *  1. `supabase db reset` — applies every migration on a clean local DB.
 *     Take snapshot A (the fully-migrated reference state).
 *  2. Walk migrations NEWEST -> OLDEST, tearing down one at a time via its
 *     own down file (reverse order because a later migration can depend on
 *     an earlier one's objects, never the other way round). After each
 *     down file: `pg_dump --schema-only`, assert the diff from the
 *     PREVIOUS step matches exactly that migration's own created objects
 *     (compared by pg_dump's own "-- Name: X; Type: Y" section blocks, not
 *     a raw line diff, so reordering noise doesn't produce false
 *     failures).
 *  3. Once every migration is torn down, re-apply every up file OLDEST ->
 *     NEWEST (the normal forward order), dump again, and assert the final
 *     schema matches snapshot A exactly — proving the WHOLE chain is
 *     idempotent end-to-end, not just the newest migration's own
 *     down-then-up cycle.
 *
 * Object-type recognition (finding 9's second half): tables, views,
 * extensions, functions, types, and materialized views. Function/type
 * names can be overloaded/signature-qualified in pg_dump's own "Name:"
 * field (e.g. "my_func(integer)") — matched by prefix, not exact equality,
 * to handle that without needing full signature parsing.
 *
 * Requires Docker + the Supabase CLI local stack (`supabase start`) already
 * running, and the `supabase_db_<project_id>` container reachable via
 * `docker exec`. This is the CI-target path (local Docker), not a cloud
 * project — see .spark/environment.md.
 *
 * Exit code contract: 0 = pass, 1 = fail (blocks merge).
 */
import { readFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync, spawnSync } from "node:child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, "..", "..");
const MIGRATIONS_DIR = join(REPO_ROOT, "supabase", "migrations");
const MIGRATIONS_DOWN_DIR = join(REPO_ROOT, "supabase", "migrations_down");
const CONFIG_TOML = join(REPO_ROOT, "supabase", "config.toml");

const DB_USER = "postgres";
const DB_NAME = "postgres";

function getProjectId(): string {
  const config = readFileSync(CONFIG_TOML, "utf-8");
  const match = config.match(/^project_id\s*=\s*"([^"]+)"/m);
  if (!match) throw new Error("Could not find project_id in supabase/config.toml");
  return match[1]!;
}

function dbContainerName(): string {
  return `supabase_db_${getProjectId()}`;
}

const IS_WINDOWS = process.platform === "win32";

function run(cmd: string, args: string[], opts: { input?: string } = {}): string {
  const result = spawnSync(cmd, args, {
    cwd: REPO_ROOT,
    input: opts.input,
    encoding: "utf-8",
    shell: IS_WINDOWS, // Windows needs shell:true to resolve .cmd shims (e.g. supabase.cmd)
    maxBuffer: 1024 * 1024 * 64,
  });
  if (result.status !== 0) {
    throw new Error(
      `Command failed: ${cmd} ${args.join(" ")}\nstdout: ${result.stdout}\nstderr: ${result.stderr}`,
    );
  }
  return result.stdout;
}

function schemaDump(): string {
  const container = dbContainerName();
  return run("docker", [
    "exec",
    container,
    "pg_dump",
    "-U",
    DB_USER,
    "-d",
    DB_NAME,
    "--schema-only",
    "--no-owner",
    "--no-privileges",
  ]);
}

function execSqlFile(sql: string): void {
  const container = dbContainerName();
  run("docker", ["exec", "-i", container, "psql", "-U", DB_USER, "-d", DB_NAME, "-v", "ON_ERROR_STOP=1"], {
    input: sql,
  });
}

interface ObjectBlock {
  key: string; // "TYPE: NAME" — unique map key
  type: string;
  name: string;
  content: string;
}

// Supabase's local-dev platform scaffolding installs its own event triggers
// (PostgREST schema-cache watchers, extension "issue" trackers, etc.) whose
// dumped definitions can shift for reasons entirely unrelated to OUR
// migrations (e.g. which extensions happen to be installed at dump time).
// They are not owned by any of our migrations, so they're excluded from
// comparison rather than treated as false-positive breakage.
const IGNORED_BLOCK_TYPES = new Set(["EVENT TRIGGER"]);

/** Splits a pg_dump --schema-only output into named object blocks, for
 * order-insensitive, structurally-aware comparison. */
function splitIntoBlocks(dump: string): Map<string, ObjectBlock> {
  const blocks = new Map<string, ObjectBlock>();
  const headerRe = /^--\n-- Name: (.+?); Type: (.+?); Schema: (.+?);.*\n--\n/gm;
  const matches = [...dump.matchAll(headerRe)];

  for (let i = 0; i < matches.length; i++) {
    const match = matches[i]!;
    const name = match[1]!;
    const type = match[2]!;
    if (IGNORED_BLOCK_TYPES.has(type)) continue;
    const start = match.index!;
    const end = i + 1 < matches.length ? matches[i + 1]!.index! : dump.length;
    const key = `${type}: ${name}`;
    blocks.set(key, { key, type, name, content: dump.slice(start, end).trim() });
  }
  return blocks;
}

/** True if the given object block "belongs to" a table/view/extension/
 * function/type/materialized-view name created by the migration under
 * test — covering pg_dump's several ways of naming dependent objects (the
 * object itself, COMMENT ON EXTENSION blocks, table-qualified
 * constraint/index names like "job_runs job_runs_pkey", and
 * signature-qualified function/type names like "my_func(integer)"). */
function blockBelongsToCreatedObject(block: ObjectBlock, createdObjectName: string): boolean {
  if (block.name === createdObjectName) return true;
  if (block.type === "COMMENT" && block.name === `EXTENSION ${createdObjectName}`) return true;
  if (block.name.startsWith(`${createdObjectName} `)) return true; // e.g. constraints/indexes/triggers
  if (block.name.startsWith(`${createdObjectName}(`)) return true; // e.g. overloaded FUNCTION my_func(integer)
  return false;
}

/** Object types this test recognizes in an up migration's SQL. Extend this
 * list (and the corresponding regex in extractCreatedObjectNames) whenever
 * a migration introduces a new kind of CREATE statement — an unrecognized
 * object type here means this test can't verify its down file actually
 * removes it, which is exactly finding 9's original gap. */
function extractCreatedObjectNames(upSql: string): string[] {
  const names: string[] = [];
  const patterns = [
    /create\s+table\s+(?:if\s+not\s+exists\s+)?public\.(\w+)/gi,
    /create\s+view\s+public\.(\w+)/gi,
    /create\s+extension\s+(?:if\s+not\s+exists\s+)?"?([\w-]+)"?/gi,
    /create\s+(?:or\s+replace\s+)?function\s+public\.(\w+)/gi,
    /create\s+(?:or\s+replace\s+)?procedure\s+public\.(\w+)/gi,
    /create\s+type\s+public\.(\w+)/gi,
    /create\s+materialized\s+view\s+(?:if\s+not\s+exists\s+)?public\.(\w+)/gi,
  ];
  for (const pattern of patterns) {
    for (const match of upSql.matchAll(pattern)) {
      names.push(match[1]!);
    }
  }
  return names;
}

interface MigrationEntry {
  upFile: string;
  downFile: string;
  upSql: string;
  downSql: string;
  createdObjectNames: string[];
}

function loadMigrations(): MigrationEntry[] {
  const upFiles = readdirSync(MIGRATIONS_DIR).filter((f) => f.endsWith(".sql")).sort();
  return upFiles.map((upFile) => {
    const downFile = upFile.replace(/\.sql$/, ".down.sql");
    const upSql = readFileSync(join(MIGRATIONS_DIR, upFile), "utf-8");
    const downSql = readFileSync(join(MIGRATIONS_DOWN_DIR, downFile), "utf-8");
    return { upFile, downFile, upSql, downSql, createdObjectNames: extractCreatedObjectNames(upSql) };
  });
}

/** Verifies that executing `migration.downSql` against the DB (currently
 * in the state described by `before`) produces exactly `before` minus
 * that migration's own created objects, with nothing else disturbed.
 * Returns the new (post-down) block map so the caller can chain into the
 * next migration's teardown, plus any failure messages. */
function verifyOneRollback(migration: MigrationEntry, before: Map<string, ObjectBlock>): { after: Map<string, ObjectBlock>; failures: string[] } {
  const failures: string[] = [];

  execSqlFile(migration.downSql);
  const after = splitIntoBlocks(schemaDump());

  const removedKeys = [...before.keys()].filter((k) => !after.has(k));
  for (const key of removedKeys) {
    const block = before.get(key)!;
    const belongsToMigration = migration.createdObjectNames.some((name) => blockBelongsToCreatedObject(block, name));
    if (!belongsToMigration) {
      failures.push(`[${migration.upFile}] Unexpected object removed by ${migration.downFile}: ${key}`);
    }
  }

  for (const name of migration.createdObjectNames) {
    const stillPresent = [...after.values()].some((block) => blockBelongsToCreatedObject(block, name));
    if (stillPresent) {
      failures.push(`[${migration.upFile}] Object "${name}" was NOT fully removed by ${migration.downFile}`);
    }
  }

  const addedKeys = [...after.keys()].filter((k) => !before.has(k));
  for (const key of addedKeys) {
    failures.push(`[${migration.upFile}] ${migration.downFile} unexpectedly ADDED an object: ${key}`);
  }

  for (const [key, blockBefore] of before) {
    if (!after.has(key)) continue; // already checked above
    const blockAfter = after.get(key)!;
    if (blockBefore.content !== blockAfter.content) {
      failures.push(`[${migration.upFile}] Unrelated object "${key}" changed after running ${migration.downFile} (should be untouched)`);
    }
  }

  return { after, failures };
}

function main(): void {
  console.log("migration-reversibility-test: resetting local DB (supabase db reset)...");
  execFileSync("supabase", ["db", "reset"], { cwd: REPO_ROOT, stdio: "inherit", shell: IS_WINDOWS });

  const migrations = loadMigrations();
  if (migrations.length === 0) throw new Error("No migrations found in supabase/migrations/");

  console.log(`migration-reversibility-test: testing all ${migrations.length} migration(s), newest -> oldest...`);
  console.log("migration-reversibility-test: dumping snapshot A (fully-migrated reference state)...");
  const snapshotA = splitIntoBlocks(schemaDump());

  // Tear down NEWEST -> OLDEST: a later migration can depend on an
  // earlier one's objects, never the other way round, so this is the only
  // safe general order.
  const failures: string[] = [];
  let currentBlocks = snapshotA;
  for (let i = migrations.length - 1; i >= 0; i--) {
    const migration = migrations[i]!;
    console.log(`migration-reversibility-test: rolling back ${migration.upFile} via ${migration.downFile}...`);
    const { after, failures: rollbackFailures } = verifyOneRollback(migration, currentBlocks);
    failures.push(...rollbackFailures);
    currentBlocks = after;
  }

  if (failures.length > 0) {
    console.error("migration-reversibility-test: FAIL (rollback step)");
    for (const f of failures) console.error(`  ${f}`);
    process.exit(1);
  }
  console.log("migration-reversibility-test: every migration's rollback verified — schema diff matches expected object set at each step.");

  // Re-apply OLDEST -> NEWEST (the normal forward order) to restore full
  // state, then assert the final schema matches snapshot A exactly —
  // proving the WHOLE chain is idempotent end-to-end, not just the newest
  // migration's own down-then-up cycle.
  console.log("migration-reversibility-test: re-applying all migrations oldest -> newest to prove idempotent re-appliability...");
  for (const migration of migrations) {
    execSqlFile(migration.upSql);
  }

  console.log("migration-reversibility-test: dumping final snapshot...");
  const finalBlocks = splitIntoBlocks(schemaDump());

  const reapplyFailures: string[] = [];
  const allKeys = new Set([...snapshotA.keys(), ...finalBlocks.keys()]);
  for (const key of allKeys) {
    const inA = snapshotA.has(key);
    const inFinal = finalBlocks.has(key);
    if (inA !== inFinal) {
      reapplyFailures.push(`Object set mismatch after full re-apply: "${key}" present in original=${inA}, final=${inFinal}`);
      continue;
    }
    if (inA && inFinal && snapshotA.get(key)!.content !== finalBlocks.get(key)!.content) {
      reapplyFailures.push(`Object "${key}" differs after full down-then-up chain (did not restore identical schema)`);
    }
  }

  if (reapplyFailures.length > 0) {
    console.error("migration-reversibility-test: FAIL (re-apply step)");
    for (const f of reapplyFailures) console.error(`  ${f}`);
    process.exit(1);
  }

  console.log(`migration-reversibility-test: PASS — all ${migrations.length} migration(s)' down->up chain is clean and idempotent.`);
  process.exit(0);
}

main();
