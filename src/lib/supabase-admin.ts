// src/lib/supabase-admin.ts
// BLOCK: Supabase Admin Client
// Server-side only. Uses service role key for privileged auth operations:
// - Creating users (sign-up)
// - Validating credentials (sign-in via Credentials provider)
// NEVER import this in client components.

import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Lazily instantiated so the build doesn't crash when env vars are absent
// during static page generation. The client is created on first actual use.
let _client: SupabaseClient | null = null;

export function getSupabaseAdmin(): SupabaseClient {
  if (!_client) {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) {
      throw new Error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set");
    }
    _client = createClient(url, key, {
      auth: { autoRefreshToken: false, persistSession: false },
    });
  }
  return _client;
}
