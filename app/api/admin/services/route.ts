import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

// GET all services (admin view - includes unpublished)
export async function GET() {
  try {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .order("display_order");

    if (error) throw error;
    return NextResponse.json({ data, error: null });
  } catch (e: any) {
    return NextResponse.json({ data: null, error: e.message }, { status: 500 });
  }
}

// POST create a new service
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, slug, summary, content, duration_minutes, price_text, published } = body;

    if (!name || !slug || !summary || !content) {
      return NextResponse.json({ error: "Name, slug, summary, and content are required." }, { status: 400 });
    }

    const supabase = createServerClient();
    const { data, error } = await supabase.from("services").insert({
      name, slug, summary, content,
      duration_minutes: duration_minutes || 60,
      price_text: price_text || null,
      published: published ?? false,
    }).select().single();

    if (error) throw error;
    return NextResponse.json({ data, error: null }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ data: null, error: e.message }, { status: 500 });
  }
}
