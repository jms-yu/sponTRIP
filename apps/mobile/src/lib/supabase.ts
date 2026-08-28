import "react-native-url-polyfill/auto";
import { createClient } from "@supabase/supabase-js";
import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * The ONLY Supabase client the mobile app ever creates. Uses the `anon`
 * key exclusively — never the service_role key. See
 * ci/scripts/check-bundle-keys.ts (SEC-3), which fails CI if that rule is
 * ever violated (a SUPABASE_SERVICE_ROLE_KEY reference anywhere in
 * apps/mobile, or an EXPO_PUBLIC_* var containing SERVICE/SECRET).
 */

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // Loud failure at startup rather than a silent client that mysteriously
  // 401s on every call — this is a config error, not a runtime edge case.
  console.warn(
    "[supabase] EXPO_PUBLIC_SUPABASE_URL / EXPO_PUBLIC_SUPABASE_ANON_KEY are not set. " +
      "Copy apps/mobile/.env.example to apps/mobile/.env and fill in dev-tier values.",
  );
}

export const supabase = createClient(supabaseUrl ?? "", supabaseAnonKey ?? "", {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
