#!/usr/bin/env tsx
/**
 * migration-reversibility-test.ts — INF-2 acceptance criterion, mechanically
 * enforced on every PR, forever (not a one-time M0 artifact).
 *
 * Steps (per the M0 technical spec):
 *  1. `supabase db reset` — applies every migration on a clean local DB.
 *  2. `pg_dump --schema-only` -> snapshot A.
 *  3. Execute the down file paired with the NEWEST migration via psql.
 *  4. `pg_dump --schema-only` -> snapshot B. Assert B == A minus exactly
 *     that migration's created objects (compared by pg_dump's own
 *     "-- Name: X; Type: Y" section blocks, not a raw line diff, so
 *     reordering noise doesn't produce false failures).
 *  5. Re-run the up file's SQL directly, dump again -> snapshot C, assert
 *     C's object-block set matches A's — proving idempotent re-apply
 *     (catches partial-rollback bugs).
 *
 * Requires Docker + the Supabase CLI local stack (`supabase start`) already
 * running, and the `supabase_db_<project_id>` container reachable via
 * `docker exec`. This is the CI-target path (local Docker), not a cloud
 * project — see .spark/environment.md.
 *
 * Exit code contract: 0 = pass, 1 = fail (blocks merge).
 */
import { readFileSync, readdirSync, writeFileSync, mkdtempSync, rmSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { tmpdir } from "node:os";
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

/** True if the given object block "belongs to" a table/view/extension name
 * created by the migration under test — covering pg_dump's several ways of
 * naming dependent objects (the object itself, COMMENT ON EXTENSION blocks,
 * and table-qualified constraint/index names like "job_runs job_runs_pkey"). */
function blockBelongsToCreatedObject(block: ObjectBlock, createdObjectName: string): boolean {
  if (block.name === createdObjectName) return true;
  if (block.type === "COMMENT" && block.name === `EXTENSION ${createdObjectName}`) return true;
  if (block.name.startsWith(`${createdObjectName} `)) return true; // e.g. constraints/indexes/triggers
  return false;
}

function extractCreatedObjectNames(upSql: string): string[] {
  const names: string[] = [];
  const patterns = [
    /create\s+table\s+(?:if\s+not\s+exists\s+)?public\.(\w+)/gi,
    /create\s+view\s+public\.(\w+)/gi,
    /create\s+extension\s+(?:if\s+not\s+exists\s+)?(\w+)/gi,
  ];
  for (const pattern of patterns) {
    for (const match of upSql.matchAll(pattern)) {
      names.push(match[1]!);
    }
  }
  return names;
}

function main(): void {
  console.log("migration-reversibility-test: resetting local DB (supabase db reset)...");
  execFileSync("supabase", ["db", "reset"], { cwd: REPO_ROOT, stdio: "inherit", shell: IS_WINDOWS });

  const upFiles = readdirSync(MIGRATIONS_DIR).filter((f) => f.endsWith(".sql")).sort();
  const newestUpFile = upFiles[upFiles.length - 1];
  if (!newestUpFile) throw new Error("No migrations found in supabase/migrations/");
  const downFile = newestUpFile.replace(/\.sql$/, ".down.sql");
  const downPath = join(MIGRATIONS_DOWN_DIR, downFile);
  const upPath = join(MIGRATIONS_DIR, newestUpFile);

  console.log(`migration-reversibility-test: target migration = ${newestUpFile}`);

  const upSql = readFileSync(upPath, "utf-8");
  const downSql = readFileSync(downPath, "utf-8");
  const createdObjectNames = extractCreatedObjectNames(upSql);

  console.log("migration-reversibility-test: dumping snapshot A (post-up)...");
  const snapshotA = schemaDump();
  const blocksA = splitIntoBlocks(snapshotA);

  console.log(`migration-reversibility-test: executing down file ${downFile}...`);
  execSqlFile(downSql);

  console.log("migration-reversibility-test: dumping snapshot B (post-down)...");
  const snapshotB = schemaDump();
  const blocksB = splitIntoBlocks(snapshotB);

  const failures: string[] = [];

  // Every block present in A but absent in B must correspond to one of the
  // migration's created objects. Anything else missing means the down file
  // took out more than it should have.
  const removedKeys = [...blocksA.keys()].filter((k) => !blocksB.has(k));
  for (const key of removedKeys) {
    const block = blocksA.get(key)!;
    const belongsToMigration = createdObjectNames.some((name) => blockBelongsToCreatedObject(block, name));
    if (!belongsToMigration) {
      failures.push(`Unexpected object removed by down file, not created by ${newestUpFile}: ${key}`);
    }
  }

  // Every created object must actually have been removed (its own block,
  // and any dependent blocks pg_dump lists separately, e.g. constraints).
  for (const name of createdObjectNames) {
    const stillPresent = [...blocksB.values()].some((block) => blockBelongsToCreatedObject(block, name));
    if (stillPresent) {
      failures.push(`Object "${name}" created by ${newestUpFile} was NOT fully removed by ${downFile}`);
    }
  }

  // Nothing new should have appeared.
  const addedKeys = [...blocksB.keys()].filter((k) => !blocksA.has(k));
  for (const key of addedKeys) {
    failures.push(`Down file unexpectedly ADDED an object: ${key}`);
  }

  // Unrelated objects must be byte-identical before/after (down didn't
  // silently mutate something it shouldn't have touched).
  for (const [key, blockA] of blocksA) {
    if (!blocksB.has(key)) continue; // already checked above
    const blockB = blocksB.get(key)!;
    if (blockA.content !== blockB.content) {
      failures.push(`Unrelated object "${key}" changed after running the down file (should be untouched)`);
    }
  }

  if (failures.length > 0) {
    console.error("migration-reversibility-test: FAIL (rollback step)");
    for (const f of failures) console.error(`  ${f}`);
    process.exit(1);
  }
  console.log("migration-reversibility-test: rollback verified — schema diff matches expected object set.");

  console.log(`migration-reversibility-test: re-applying ${newestUpFile} to prove idempotent re-appliability...`);
  execSqlFile(upSql);

  console.log("migration-reversibility-test: dumping snapshot C (post-re-up)...");
  const snapshotC = schemaDump();
  const blocksC = splitIntoBlocks(snapshotC);

  const reapplyFailures: string[] = [];
  const allKeys = new Set([...blocksA.keys(), ...blocksC.keys()]);
  for (const key of allKeys) {
    const inA = blocksA.has(key);
    const inC = blocksC.has(key);
    if (inA !== inC) {
      reapplyFailures.push(`Object set mismatch after re-apply: "${key}" present in A=${inA}, C=${inC}`);
      continue;
    }
    if (inA && inC && blocksA.get(key)!.content !== blocksC.get(key)!.content) {
      reapplyFailures.push(`Object "${key}" differs after re-apply (down-then-up did not restore identical schema)`);
    }
  }

  if (reapplyFailures.length > 0) {
    console.error("migration-reversibility-test: FAIL (re-apply step)");
    for (const f of reapplyFailures) console.error(`  ${f}`);
    process.exit(1);
  }

  console.log("migration-reversibility-test: PASS — up -> down -> up is clean and idempotent.");
  process.exit(0);
}

main();
