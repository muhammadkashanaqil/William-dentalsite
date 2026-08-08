import { NextResponse, type NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { getOAuth2Client } from "@/lib/google-calendar";
import { encryptToken } from "@/lib/crypto";
import { createServerClient } from "@/lib/supabase/server";
import { google } from "googleapis";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const errorParam = searchParams.get("error");

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const redirectTarget = `${baseUrl}/admin/settings/integrations`;

  if (errorParam) {
    return NextResponse.redirect(`${redirectTarget}?error=${encodeURIComponent(errorParam)}`);
  }

  try {
    // 1. Confirm admin session
    await requireAdmin();

    // 2. Validate OAuth state
    const savedState = request.cookies.get("google_oauth_state")?.value;
    if (!state || !savedState || state !== savedState) {
      return NextResponse.redirect(`${redirectTarget}?error=invalid_oauth_state`);
    }

    if (!code) {
      return NextResponse.redirect(`${redirectTarget}?error=missing_code`);
    }

    // 3. Exchange authorization code for tokens
    const oauthClient = getOAuth2Client();
    const { tokens } = await oauthClient.getToken(code);

    if (!tokens.refresh_token) {
      throw new Error(
        "Google did not return a refresh token. Revoke access from your Google Account security settings and connect again."
      );
    }

    oauthClient.setCredentials(tokens);

    // 4. Encrypt the refresh token
    const encryptedRefreshToken = encryptToken(tokens.refresh_token);
    const calendarId = "primary";

    // 5. Fetch user email for display
    let userEmail = "williamdentist@gmail.com";
    try {
      const oauth2 = google.oauth2({ version: "v2", auth: oauthClient });
      const userInfo = await oauth2.userinfo.get();
      if (userInfo.data.email) {
        userEmail = userInfo.data.email;
      }
    } catch {
      // Fallback if userinfo scope was not requested
    }

    // 6. Test Google Calendar access via events list
    const calendar = google.calendar({ version: "v3", auth: oauthClient });
    await calendar.events.list({
      calendarId,
      maxResults: 1,
      singleEvents: true,
      timeMin: new Date().toISOString(),
    });

    // 7. Upsert into integration_connections ONLY after Google Calendar test succeeds
    const supabase = createServerClient();

    // First check if a row exists (maybeSingle = null if 0 rows, no crash)
    const { data: existingConnection, error: lookupError } = await supabase
      .from("integration_connections")
      .select("*")
      .eq("provider", "google_calendar")
      .maybeSingle();

    if (lookupError) {
      console.error("Integration lookup error:", lookupError);
      throw new Error(lookupError.message);
    }

    // existingConnection = null  → first-time connect  → INSERT
    // existingConnection = row   → reconnect           → UPDATE
    const { data: savedConnection, error: dbError } = await supabase
      .from("integration_connections")
      .upsert(
        {
          provider: "google_calendar",
          status: "connected",
          calendar_id: calendarId,
          refresh_token_encrypted: encryptedRefreshToken,
          connected_email: userEmail,
          granted_scopes: tokens.scope ? tokens.scope.split(" ") : [],
          connected_at: existingConnection?.connected_at ?? new Date().toISOString(),
          last_tested_at: new Date().toISOString(),
          last_error: null,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "provider" }
      )
      .select()
      .single();

    if (dbError || !savedConnection) {
      console.error("Google connection save failed:", {
        code: dbError?.code,
        message: dbError?.message,
        details: dbError?.details,
        hint: dbError?.hint,
      });
      throw new Error(
        `Could not save Google Calendar connection: ${dbError?.message ?? "No row returned"}`
      );
    }

    console.log("Google Calendar connected successfully. DB row id:", savedConnection.id);

    // 8. Also update site_settings table for backward compatibility
    await supabase
      .from("site_settings")
      .update({
        google_refresh_token_encrypted: encryptedRefreshToken,
        google_connected_email: userEmail,
        google_calendar_name: "William Dentist Appointments",
        google_calendar_id: calendarId,
        google_status: "connected",
        google_last_tested_at: new Date().toISOString(),
        google_last_error: null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", 1);

    // 9. Redirect to integrations page with connected=true
    const response = NextResponse.redirect(`${redirectTarget}?connected=true`);
    response.cookies.delete("google_oauth_state");
    return response;
  } catch (e: any) {
    console.error("Google callback error:", e);
    return NextResponse.redirect(
      `${redirectTarget}?error=${encodeURIComponent(e.message || "Failed to complete Google OAuth")}`
    );
  }
}
