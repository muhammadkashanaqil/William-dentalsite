import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export type AdminProfile = {
  user_id: string;
  display_name: string;
  role: string;
  is_active: boolean;
};

/**
 * Server-side guard for all protected admin pages.
 *
 * 1. Gets the authenticated Supabase user from the session cookie.
 * 2. Redirects to /admin/login if no session exists.
 * 3. Looks up the admin_profiles row for the user.
 * 4. Redirects (after sign-out) if role != 'admin' or is_active != true.
 * 5. Returns { user, profile, supabase } so the caller can query the DB.
 */
export async function requireAdmin() {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const { data: profile } = await supabase
    .from("admin_profiles")
    .select("user_id, display_name, role, is_active")
    .eq("user_id", user.id)
    .single();

  if (!profile || profile.role !== "admin" || !profile.is_active) {
    await supabase.auth.signOut();
    redirect("/admin/login");
  }

  return {
    user,
    profile: profile as AdminProfile,
    supabase,
  };
}

/**
 * Guard for API routes. Does NOT call redirect() so API responses remain clean JSON.
 */
export async function requireAdminApi() {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { authError: "Unauthorized. Please sign in as admin.", status: 401, user: null, profile: null, supabase };
  }

  const { data: profile } = await supabase
    .from("admin_profiles")
    .select("user_id, display_name, role, is_active")
    .eq("user_id", user.id)
    .single();

  if (!profile || profile.role !== "admin" || !profile.is_active) {
    return { authError: "Forbidden. Admin access required.", status: 403, user, profile: null, supabase };
  }

  return {
    authError: null,
    status: 200,
    user,
    profile: profile as AdminProfile,
    supabase,
  };
}
