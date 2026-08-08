import { createBrowserClient as createSSRBrowserClient } from "@supabase/ssr";

/**
 * Browser-side Supabase client.
 * Uses cookie-based sessions so auth state persists across page navigations.
 * Safe to call in Client Components ("use client").
 */
export function createBrowserClient() {
  return createSSRBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
