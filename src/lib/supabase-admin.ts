// src/lib/supabase-admin.ts
// BLOCK: Supabase Admin Client
// Server-side only. Uses service role key for privileged auth operations:
// - Creating users (sign-up)
// - Validating credentials (sign-in via Credentials provider)
// NEVER import this in client components.

import { createClient } from "@supabase/supabase-js";

export const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);
