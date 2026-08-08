import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

// GET all FAQs (admin view - includes unpublished)
export async function GET() {
  try {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from("faqs")
      .select("*")
      .order("display_order");

    if (error) throw error;
    return NextResponse.json({ data, error: null });
  } catch (e: any) {
    return NextResponse.json({ data: null, error: e.message }, { status: 500 });
  }
}

// POST create a new FAQ
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { category, question, answer, published } = body;

    if (!category || !question || !answer) {
      return NextResponse.json({ error: "Category, question, and answer are required." }, { status: 400 });
    }

    const supabase = createServerClient();
    const { data, error } = await supabase.from("faqs").insert({
      category, question, answer,
      published: published ?? false,
    }).select().single();

    if (error) throw error;
    return NextResponse.json({ data, error: null }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ data: null, error: e.message }, { status: 500 });
  }
}
