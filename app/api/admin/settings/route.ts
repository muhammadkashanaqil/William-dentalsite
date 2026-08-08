import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = createServerClient();
    const [{ data: settings, error: sErr }, { data: integration }] = await Promise.all([
      supabase.from("site_settings").select("*").single(),
      supabase.from("integration_connections").select("*").eq("provider", "google_calendar").maybeSingle(),
    ]);

    if (sErr) throw sErr;

    const isConnected = integration?.status === "connected" && !!integration?.refresh_token_encrypted;

    const combinedData = {
      ...settings,
      google_status: isConnected ? "connected" : (integration?.status || settings?.google_status || "not_connected"),
      google_connected_email: integration?.connected_email || settings?.google_connected_email || null,
      google_last_tested_at: integration?.last_tested_at || settings?.google_last_tested_at || null,
      google_last_error: integration?.last_error || settings?.google_last_error || null,
      google_refresh_token_encrypted: integration?.refresh_token_encrypted || settings?.google_refresh_token_encrypted || null,
      integration_connection: integration || null,
    };

    return NextResponse.json({ data: combinedData, error: null });
  } catch (e: any) {
    return NextResponse.json({ data: null, error: e.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from("site_settings")
      .update({ ...body, updated_at: new Date().toISOString() })
      .eq("id", 1)
      .select()
      .single();
    if (error) throw error;
    return NextResponse.json({ data, error: null });
  } catch (e: any) {
    return NextResponse.json({ data: null, error: e.message }, { status: 500 });
  }
}
