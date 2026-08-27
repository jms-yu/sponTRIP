/**
 * Shared Supabase JS client factory for ci/scripts.
 *
 * Node 20 has no native WebSocket global (that lands in Node 22), and
 * @supabase/supabase-js always instantiates a RealtimeClient even when
 * nothing subscribes to a channel — so every client needs an explicit `ws`
 * transport or client construction throws immediately. Centralized here so
 * every CI script gets this for free instead of repeating the workaround.
 */
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import WebSocket from "ws";

export function makeSupabaseClient(
  url: string,
  key: string,
  options: Parameters<typeof createClient>[2] = {},
): SupabaseClient {
  return createClient(url, key, {
    ...options,
    realtime: {
      // @ts-expect-error — ws's Node implementation is structurally
      // compatible with the WebSocket constructor supabase-js expects.
      transport: WebSocket,
      ...(options.realtime ?? {}),
    },
  });
}
