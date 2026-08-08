import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

// GET all leads
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q");

    const supabase = createServerClient();
    let query = supabase
      .from("leads")
      .select("*, services(name)")
      .order("created_at", { ascending: false });

    if (q) {
      query = query.or(`name.ilike.%${q}%,email.ilike.%${q}%,reference.ilike.%${q}%`);
    }

    const { data, error } = await query;
    if (error) throw error;
    return NextResponse.json({ data, error: null });
  } catch (e: any) {
    return NextResponse.json({ data: null, error: e.message }, { status: 500 });
  }
}
