import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

// GET all appointments (admin)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q");
    const status = searchParams.get("status");

    const supabase = createServerClient();
    let query = supabase
      .from("appointments")
      .select("*, services(name, duration_minutes)")
      .order("start_at", { ascending: false });

    if (status && status !== "all") {
      query = query.eq("status", status);
    }
    if (q) {
      query = query.or(
        `patient_name.ilike.%${q}%,patient_email.ilike.%${q}%,reference.ilike.%${q}%`
      );
    }

    const { data, error } = await query;
    if (error) throw error;
    return NextResponse.json({ data, error: null });
  } catch (e: any) {
    return NextResponse.json({ data: null, error: e.message }, { status: 500 });
  }
}
