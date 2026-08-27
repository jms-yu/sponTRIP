import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

// Service-role client — bypasses RLS entirely. Used ONLY server-side, by
// Edge Functions, for the two things RLS deliberately cannot do:
// 1. Writing to job_runs (has zero policies — service_role only, by design)
// 2. Reading auth.users metadata to check ownership in mint-storage-url
//
// NEVER expose SUPABASE_SERVICE_ROLE_KEY to any client bundle. See
// ci/scripts/check-bundle-keys.ts, which fails CI if it ever leaks into
// apps/mobile.
export function getSupabaseAdmin() {
  const url = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !serviceRoleKey) {
    throw new Error(
      "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in function environment",
    );
  }
  return createClient(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

// Anon-scoped client used to validate a caller's JWT and resolve auth.uid()
// without needing service-role privileges for that step.
export function getSupabaseForToken(jwt: string) {
  const url = Deno.env.get("SUPABASE_URL");
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
  if (!url || !anonKey) {
    throw new Error("Missing SUPABASE_URL or SUPABASE_ANON_KEY in function environment");
  }
  return createClient(url, anonKey, {
    global: { headers: { Authorization: `Bearer ${jwt}` } },
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
