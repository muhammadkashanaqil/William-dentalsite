import { createServerClient as createSSRServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

/**
 * Cookie-based server client for use in Server Components, Server Actions,
 * and API Route Handlers. Reads and writes auth cookies so sessions persist.
 * Use this for all auth-related server-side operations.
 */
export async function createServerSupabaseClient() {
  const cookieStore = await cookies();

  return createSSRServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // setAll is called from Server Components where cookies can't be set.
            // This is safe to ignore — middleware handles session refresh.
          }
        },
      },
    }
  );
}

/**
 * Legacy non-cookie server client for data-only API routes (no auth needed).
 * Falls back to anon key if service role key is a placeholder.
 */
export const createServerClient = () => {
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const anonKey = process.env.SUPABASE_ANON_KEY;

  const key =
    serviceKey && serviceKey !== "server-only" ? serviceKey : anonKey;

  if (!supabaseUrl || !key) {
    throw new Error("Missing Supabase environment variables for server client.");
  }

  return createClient(supabaseUrl, key);
};
