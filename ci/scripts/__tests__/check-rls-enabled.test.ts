import { describe, it, expect } from "vitest";
import { findMissingRlsTables } from "../check-rls-enabled.js";

describe("findMissingRlsTables", () => {
  it("passes when every created table later enables RLS", () => {
    const result = findMissingRlsTables([
      { name: "0001.sql", content: "create table public.foo (id uuid primary key);" },
      { name: "0002.sql", content: "alter table public.foo enable row level security;" },
    ]);
    expect(result.missing).toEqual([]);
    expect(result.tablesCreated).toEqual(["foo"]);
  });

  it("fails when a created table never enables RLS", () => {
    const result = findMissingRlsTables([
      { name: "0001.sql", content: "create table public.foo (id uuid primary key);" },
    ]);
    expect(result.missing).toEqual(["foo"]);
    expect(result.createdInFile.get("foo")).toBe("0001.sql");
  });

  it("handles multiple tables, some with RLS and some without", () => {
    const result = findMissingRlsTables([
      {
        name: "0001.sql",
        content: `
          create table public.good (id uuid primary key);
          create table public.bad (id uuid primary key);
          alter table public.good enable row level security;
        `,
      },
    ]);
    expect(result.missing).toEqual(["bad"]);
  });

  it("ignores create table statements inside -- comments", () => {
    const result = findMissingRlsTables([
      {
        name: "0001.sql",
        content: `
          -- create table public.commented_out (id uuid primary key);
          create table public.real_table (id uuid primary key);
          alter table public.real_table enable row level security;
        `,
      },
    ]);
    expect(result.tablesCreated).toEqual(["real_table"]);
    expect(result.missing).toEqual([]);
  });

  it("handles 'create table if not exists'", () => {
    const result = findMissingRlsTables([
      {
        name: "0001.sql",
        content: `
          create table if not exists public.foo (id uuid primary key);
          alter table public.foo enable row level security;
        `,
      },
    ]);
    expect(result.missing).toEqual([]);
  });

  it("passes when there are no tables at all (e.g. an extensions-only migration)", () => {
    const result = findMissingRlsTables([
      { name: "0001.sql", content: "create extension if not exists pgcrypto;" },
    ]);
    expect(result.tablesCreated).toEqual([]);
    expect(result.missing).toEqual([]);
  });
});
