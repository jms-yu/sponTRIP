#!/usr/bin/env tsx
/**
 * check-migration-pairs.ts — SEC-adjacent mechanical check.
 *
 * Asserts every up migration in supabase/migrations/ has a paired down file
 * in supabase/migrations_down/ named <same-timestamp>_<same-name>.down.sql.
 * migrations_down/ is this project's own rollback convention — never read
 * by `supabase migration up`, only by this project's CI tooling.
 *
 * Exit code contract: 0 = pass, 1 = fail (blocks merge).
 */
import { readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, "..", "..");
const MIGRATIONS_DIR = join(REPO_ROOT, "supabase", "migrations");
const MIGRATIONS_DOWN_DIR = join(REPO_ROOT, "supabase", "migrations_down");

export function upNameToDownName(upFileName: string): string {
  // 20260828120000_enable_extensions.sql -> 20260828120000_enable_extensions.down.sql
  return upFileName.replace(/\.sql$/, ".down.sql");
}

export interface PairCheckResult {
  missing: string[];
  orphanDown: string[];
}

/** Pure logic, exported for unit testing — no filesystem access. */
export function checkMigrationPairs(upFiles: string[], downFiles: string[]): PairCheckResult {
  const downFileSet = new Set(downFiles);
  const missing: string[] = [];
  for (const upFile of upFiles) {
    const expectedDown = upNameToDownName(upFile);
    if (!downFileSet.has(expectedDown)) {
      missing.push(`${upFile} -> missing supabase/migrations_down/${expectedDown}`);
    }
  }

  const upFileSet = new Set(upFiles);
  const orphanDown: string[] = [];
  for (const downFile of downFiles) {
    const expectedUp = downFile.replace(/\.down\.sql$/, ".sql");
    if (!upFileSet.has(expectedUp)) {
      orphanDown.push(`supabase/migrations_down/${downFile} -> no matching supabase/migrations/${expectedUp}`);
    }
  }

  return { missing, orphanDown };
}

function main(): void {
  const upFiles = readdirSync(MIGRATIONS_DIR).filter((f) => f.endsWith(".sql"));
  const downFiles = readdirSync(MIGRATIONS_DOWN_DIR).filter((f) => f.endsWith(".down.sql"));

  const { missing, orphanDown } = checkMigrationPairs(upFiles, downFiles);

  if (missing.length === 0 && orphanDown.length === 0) {
    console.log(`check-migration-pairs: PASS (${upFiles.length} migration(s), all paired)`);
    process.exit(0);
  }

  console.error("check-migration-pairs: FAIL");
  for (const m of missing) console.error(`  MISSING DOWN: ${m}`);
  for (const o of orphanDown) console.error(`  ORPHAN DOWN:  ${o}`);
  process.exit(1);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main();
}
