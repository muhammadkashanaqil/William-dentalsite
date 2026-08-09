import { NextResponse } from "next/server";
import { createServerClient, createServerSupabaseClient } from "@/lib/supabase/server";
import { updateGoogleEvent, deleteGoogleEvent, createGoogleEvent } from "@/lib/google-calendar";

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function getClient() {
  try {
    return await createServerSupabaseClient();
  } catch {
    return createServerClient();
  }
}

// POST retry calendar sync for an appointment
export async function POST(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await getClient();

    let { data: appt, error: fetchErr } = await supabase
      .from("appointments")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (fetchErr || !appt) {
      const fallbackClient = createServerClient();
      const res = await fallbackClient.from("appointments").select("*").eq("id", id).maybeSingle();
      appt = res.data;
    }

    if (!appt) {
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

    const updatePayload = {
      google_event_id: googleEventId,
      calendar_sync_status: syncStatus,
      calendar_last_synced_at: syncStatus === "synced" ? new Date().toISOString() : appt.calendar_last_synced_at,
      calendar_error_message: syncError,
      updated_at: new Date().toISOString(),
    };

    let { data: updated, error: updateErr } = await supabase
      .from("appointments")
      .update(updatePayload)
      .eq("id", id)
      .select()
      .maybeSingle();

    if (updateErr) {
      const fallbackClient = createServerClient();
      const res = await fallbackClient.from("appointments").update(updatePayload).eq("id", id).select().maybeSingle();
      if (res.error) throw res.error;
      updated = res.data;
    }

    if (syncStatus === "failed") {
      return NextResponse.json({ error: syncError, data: updated }, { status: 400 });
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Internal server error" }, { status: 500 });
  }
}

// PATCH update appointment status or time (Reschedule / Confirm / Cancel)
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const supabase = await getClient();

    // 1. Fetch current appointment record
    let { data: current, error: fetchErr } = await supabase
      .from("appointments")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (fetchErr || !current) {
      const fallbackClient = createServerClient();
      const res = await fallbackClient.from("appointments").select("*").eq("id", id).maybeSingle();
      current = res.data;
    }

    if (!current) {
      return NextResponse.json({ error: "Appointment not found" }, { status: 404 });
    }

    const isReschedule = body.start_at && body.start_at !== current.start_at;
    const isCancellation = body.status === "cancelled" && current.status !== "cancelled";

    // 2. If rescheduling, calculate new end_at and recheck availability
    let updateData = { ...body, updated_at: new Date().toISOString() };

    if (isReschedule) {
      let durationMinutes = 60;
      if (current.service_id) {
        const { data: svc } = await supabase
          .from("services")
          .select("duration_minutes")
          .eq("id", current.service_id)
          .maybeSingle();
        if (svc?.duration_minutes) durationMinutes = svc.duration_minutes;
      }

      const newEndAt = new Date(new Date(body.start_at).getTime() + durationMinutes * 60000).toISOString();
      updateData.end_at = newEndAt;

      // Check DB overlaps for new time window
      const { data: overlaps } = await supabase
        .from("appointments")
        .select("id")
        .neq("id", id)
        .neq("status", "cancelled")
        .lt("start_at", newEndAt)
        .gt("end_at", body.start_at);

      if (overlaps && overlaps.length > 0) {
        return NextResponse.json(
          { error: "The new time slot conflicts with an existing appointment." },
          { status: 409 }
        );
      }
    }

    // 3. Update Supabase appointment record
    let { data: updatedAppt, error: updateErr } = await supabase
      .from("appointments")
      .update(updateData)
      .eq("id", id)
      .select()
      .maybeSingle();

    if (updateErr || !updatedAppt) {
      const fallbackClient = createServerClient();
      const res = await fallbackClient.from("appointments").update(updateData).eq("id", id).select().maybeSingle();
      if (res.error) throw res.error;
      updatedAppt = res.data;
    }

    // 4. Handle Google Calendar synchronization
    let googleSyncStatus = updatedAppt.calendar_sync_status;
    let googleError: string | null = null;
    let googleEventId = updatedAppt.google_event_id;

    try {
      if (isCancellation) {
        if (googleEventId) {
          await deleteGoogleEvent(googleEventId);
        }
        googleSyncStatus = "cancelled";
      } else if (isReschedule) {
        if (googleEventId) {
          await updateGoogleEvent(googleEventId, {
            id: updatedAppt.id,
            patient_name: updatedAppt.patient_name,
            start_at: updatedAppt.start_at,
            end_at: updatedAppt.end_at,
          });
          googleSyncStatus = "synced";
        } else {
          const gRes = await createGoogleEvent({
            id: updatedAppt.id,
            patient_name: updatedAppt.patient_name,
            start_at: updatedAppt.start_at,
            end_at: updatedAppt.end_at,
          });
          googleEventId = gRes.eventId;
          googleSyncStatus = "synced";
        }
      }
    } catch (gErr: any) {
      console.warn("Google Event update/delete error:", gErr.message);
      if (gErr.message !== "Google Calendar is not connected.") {
        googleSyncStatus = "failed";
        googleError = gErr.message;
      }
    }

    // Save final Google sync state
    if (
      googleSyncStatus !== updatedAppt.calendar_sync_status ||
      googleEventId !== updatedAppt.google_event_id
    ) {
      const syncUpdate = {
        google_event_id: googleEventId,
        calendar_sync_status: googleSyncStatus,
        calendar_last_synced_at: googleSyncStatus === "synced" ? new Date().toISOString() : updatedAppt.calendar_last_synced_at,
        calendar_error_message: googleError,
        updated_at: new Date().toISOString(),
      };

      const res = await supabase.from("appointments").update(syncUpdate).eq("id", id);
      if (res.error) {
        const fallbackClient = createServerClient();
        await fallbackClient.from("appointments").update(syncUpdate).eq("id", id);
      }
    }

    return NextResponse.json({ data: updatedAppt, error: null });
  } catch (e: any) {
    return NextResponse.json({ data: null, error: e.message }, { status: 500 });
  }
}

// DELETE an appointment
export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await getClient();

    // Fetch existing appointment to clean up Google Event
    let { data: current } = await supabase
      .from("appointments")
      .select("google_event_id")
      .eq("id", id)
      .maybeSingle();

    if (!current) {
      const fallbackClient = createServerClient();
      const res = await fallbackClient.from("appointments").select("google_event_id").eq("id", id).maybeSingle();
      current = res.data;
    }

    if (current?.google_event_id) {
      try {
        await deleteGoogleEvent(current.google_event_id);
      } catch (gErr: any) {
        console.warn("Failed to delete Google Event on appointment deletion:", gErr.message);
      }
    }

    let { error } = await supabase.from("appointments").delete().eq("id", id);
    if (error) {
      console.warn("Retrying appointment deletion with createServerClient fallback:", error.message);
      const fallbackClient = createServerClient();
      const fallbackRes = await fallbackClient.from("appointments").delete().eq("id", id);
      if (fallbackRes.error) throw fallbackRes.error;
    }

    return NextResponse.json({ data: { id }, error: null });
  } catch (e: any) {
    console.error("Error deleting appointment:", e);
    return NextResponse.json({ data: null, error: e.message || "Failed to delete appointment" }, { status: 500 });
  }
}
