import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { createServerClient } from "@/lib/supabase/server";

export async function POST() {
  try {
    await requireAdmin();

    const supabase = createServerClient();
    const now = new Date().toISOString();

    // 1. Update integration_connections table
    await supabase
      .from("integration_connections")
      .upsert(
        {
          provider: "google_calendar",
          status: "not_connected",
          refresh_token_encrypted: null,
          connected_email: null,
          last_error: null,
          updated_at: now,
        },
        { onConflict: "provider" }
      );

    // 2. Clear site_settings table
    const { error } = await supabase
      .from("site_settings")
      .update({
        google_refresh_token_encrypted: null,
        google_connected_email: null,
        google_calendar_name: null,
        google_status: "not_connected",
        google_last_tested_at: null,
        google_last_error: null,
        updated_at: now,
      })
      .eq("id", 1);

    if (error) throw error;

    return NextResponse.json({ success: true, message: "Google Calendar disconnected successfully." });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Unauthorized" }, { status: 401 });
  }
}
