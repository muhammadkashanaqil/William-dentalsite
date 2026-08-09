import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// GET all leads (including source = ai_chat, status = new)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q");

    const supabase = createServerClient();

    // Query all leads ordered by created_at descending
    let query = supabase
      .from("leads")
      .select("*, services(name)")
      .order("created_at", { ascending: false });

    if (q) {
      query = query.or(`name.ilike.%${q}%,email.ilike.%${q}%,reference.ilike.%${q}%,source.ilike.%${q}%`);
    }

    let { data, error } = await query;

    // Fallback to select("*") without join if services join throws an error
    if (error) {
      console.warn("Retrying leads query with fallback select('*'):", error.message);
      let fallbackQuery = supabase
        .from("leads")
        .select("*")
        .order("created_at", { ascending: false });

      if (q) {
        fallbackQuery = fallbackQuery.or(`name.ilike.%${q}%,email.ilike.%${q}%,reference.ilike.%${q}%,source.ilike.%${q}%`);
      }

      const fallbackRes = await fallbackQuery;
      if (fallbackRes.error) throw fallbackRes.error;
      data = fallbackRes.data;
      error = null;
    }

    return NextResponse.json(
      { data: data || [], error: null },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
          Pragma: "no-cache",
        },
      }
    );
  } catch (e: any) {
    return NextResponse.json(
      { data: null, error: e.message },
      {
        status: 500,
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        },
      }
    );
  }
}
