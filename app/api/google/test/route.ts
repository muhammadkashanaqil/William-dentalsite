import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { testGoogleCalendarConnection, getGoogleIntegrationCredentials } from "@/lib/google-calendar";
import { createServerClient } from "@/lib/supabase/server";

export async function POST() {
  try {
    await requireAdmin();

    const credentials = await getGoogleIntegrationCredentials();

    if (!credentials.isConnected || !credentials.refreshToken) {
      return NextResponse.json(
        { error: "Google Calendar is not connected. Please connect first." },
        { status: 400 }
      );
    }

    let lastError: string | null = null;
    let success = false;

    try {
      await testGoogleCalendarConnection(
        credentials.refreshToken,
        credentials.calendarId,
        credentials.timezone
      );
      success = true;
    } catch (e: any) {
      lastError = e.message;
    }

    const nowIso = new Date().toISOString();
    const supabase = createServerClient();

    // 1. Update integration_connections table
    await supabase
      .from("integration_connections")
      .upsert(
        {
          provider: "google_calendar",
          status: success ? "connected" : "error",
          last_tested_at: nowIso,
          last_error: lastError,
          updated_at: nowIso,
        },
        { onConflict: "provider" }
      );

    // 2. Update site_settings table
    await supabase
      .from("site_settings")
      .update({
        google_status: success ? "connected" : "error",
        google_last_tested_at: nowIso,
        google_last_error: lastError,
        updated_at: nowIso,
      })
      .eq("id", 1);

    if (!success) {
      return NextResponse.json(
        { success: false, error: lastError || "Failed Free/Busy query check" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      last_tested_at: nowIso,
      message: "Google Calendar connection test passed successfully.",
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Unauthorized" }, { status: 401 });
  }
}
