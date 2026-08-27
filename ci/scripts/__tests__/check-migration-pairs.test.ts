import { describe, it, expect } from "vitest";
import { checkMigrationPairs, upNameToDownName } from "../check-migration-pairs.js";

describe("upNameToDownName", () => {
  it("converts an up filename to its expected down filename", () => {
    expect(upNameToDownName("20260828120000_enable_extensions.sql")).toBe(
      "20260828120000_enable_extensions.down.sql",
    );
  });
});

describe("checkMigrationPairs", () => {
  it("passes when every up file has a matching down file", () => {
    const result = checkMigrationPairs(
      ["0001_a.sql", "0002_b.sql"],
      ["0001_a.down.sql", "0002_b.down.sql"],
    );
    expect(result.missing).toEqual([]);
    expect(result.orphanDown).toEqual([]);
  });

  it("flags an up file with no matching down file", () => {
    const result = checkMigrationPairs(["0001_a.sql"], []);
    expect(result.missing).toHaveLength(1);
    expect(result.missing[0]).toContain("0001_a.sql");
  });

  it("flags a down file with no matching up file (orphan)", () => {
    const result = checkMigrationPairs([], ["0001_a.down.sql"]);
    expect(result.orphanDown).toHaveLength(1);
    expect(result.orphanDown[0]).toContain("0001_a.down.sql");
  });

  it("passes with the real M0 migration set (regression guard)", () => {
    const ups = [
      "20260828120000_enable_extensions.sql",
      "20260828120100_smoke_test_fixtures.sql",
      "20260828120200_scheduled_jobs.sql",
    ];
    const downs = [
      "20260828120000_enable_extensions.down.sql",
      "20260828120100_smoke_test_fixtures.down.sql",
      "20260828120200_scheduled_jobs.down.sql",
    ];
    const result = checkMigrationPairs(ups, downs);
    expect(result.missing).toEqual([]);
    expect(result.orphanDown).toEqual([]);
  });
});
