import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = createServerClient();

    // Run all queries in parallel
    const [
      { count: totalAppointments },
      { count: pendingAppointments },
      { count: totalLeads },
      { count: newLeads },
      { count: bookedLeads },
      { count: pendingSyncs },
      { data: recentAppointments },
      { data: recentLeads },
    ] = await Promise.all([
      supabase.from("appointments").select("*", { count: "exact", head: true }),
      supabase.from("appointments").select("*", { count: "exact", head: true }).eq("status", "requested"),
      supabase.from("leads").select("*", { count: "exact", head: true }),
      supabase.from("leads").select("*", { count: "exact", head: true }).eq("status", "new"),
      supabase.from("leads").select("*", { count: "exact", head: true }).eq("status", "booked"),
      supabase.from("appointments").select("*", { count: "exact", head: true }).eq("calendar_sync_status", "pending"),
      supabase
        .from("appointments")
        .select("id, reference, patient_name, status, start_at, services(name)")
        .order("created_at", { ascending: false })
        .limit(5),
      supabase
        .from("leads")
        .select("id, reference, name, status, created_at, services(name)")
        .order("created_at", { ascending: false })
        .limit(5),
    ]);

    // Conversion rate = booked / total leads
    const conversionRate =
      totalLeads && totalLeads > 0
        ? Math.round(((bookedLeads || 0) / totalLeads) * 100)
        : 0;

    // Merge & sort recent activity
    const activity = [
      ...(recentAppointments || []).map((a: any) => ({
        id: a.id,
        type: "appointment" as const,
        name: a.patient_name,
        service: a.services?.name || "N/A",
        status: a.status,
        timestamp: a.start_at,
      })),
      ...(recentLeads || []).map((l: any) => ({
        id: l.id,
        type: "lead" as const,
        name: l.name,
        service: l.services?.name || "General Inquiry",
        status: l.status,
        timestamp: l.created_at,
      })),
    ]
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 7);

    return NextResponse.json({
      data: {
        stats: {
          totalAppointments: totalAppointments || 0,
          pendingAppointments: pendingAppointments || 0,
          totalLeads: totalLeads || 0,
          newLeads: newLeads || 0,
          conversionRate,
          pendingSyncs: pendingSyncs || 0,
        },
        recentActivity: activity,
      },
      error: null,
    });
  } catch (e: any) {
    return NextResponse.json({ data: null, error: e.message }, { status: 500 });
  }
}
