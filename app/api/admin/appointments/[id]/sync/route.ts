import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/auth";
import { createServerClient } from "@/lib/supabase/server";
import { createGoogleEvent, updateGoogleEvent } from "@/lib/google-calendar";

export async function POST(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authCheck = await requireAdminApi();
    if (authCheck.authError) {
      return NextResponse.json({ error: authCheck.authError }, { status: authCheck.status });
    }

    const { id } = await params;
    const supabase = createServerClient();

    const { data: appt, error: fetchErr } = await supabase
      .from("appointments")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchErr || !appt) {
      return NextResponse.json({ error: "Appointment not found" }, { status: 404 });
    }

    let googleEventId = appt.google_event_id;
    let syncStatus = "synced";
    let syncError: string | null = null;

    try {
      let syncDone = false;
      if (googleEventId) {
        try {
          await updateGoogleEvent(googleEventId, {
            id: appt.id,
            patient_name: appt.patient_name,
            start_at: appt.start_at,
            end_at: appt.end_at,
          });
          syncDone = true;
        } catch (updateErr: any) {
          // If the event ID doesn't exist on Google Calendar anymore (404 / Not Found), fallback to creating a new one
          const isNotFound =
            updateErr?.message?.toLowerCase().includes("not found") ||
            updateErr?.message?.includes("404");
          if (isNotFound) {
            googleEventId = null;
          } else {
            throw updateErr;
          }
        }
      }

      if (!syncDone) {
        const gRes = await createGoogleEvent({
          id: appt.id,
          patient_name: appt.patient_name,
          start_at: appt.start_at,
          end_at: appt.end_at,
        });
        googleEventId = gRes.eventId;
      }
    } catch (e: any) {
      syncStatus = "failed";
      syncError = e.message || "Failed to sync to Google Calendar";
    }

    const { data: updated, error: updateErr } = await supabase
      .from("appointments")
      .update({
        google_event_id: googleEventId,
        calendar_sync_status: syncStatus,
        calendar_last_synced_at: syncStatus === "synced" ? new Date().toISOString() : appt.calendar_last_synced_at,
        calendar_error_message: syncError,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (updateErr) throw updateErr;

    if (syncStatus === "failed") {
      return NextResponse.json({ error: syncError, data: updated }, { status: 400 });
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Internal server error" }, { status: 500 });
  }
}
