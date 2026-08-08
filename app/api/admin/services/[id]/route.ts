import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

// PATCH update a service
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const supabase = createServerClient();

    const { data, error } = await supabase
      .from("services")
      .update({ ...body, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ data, error: null });
  } catch (e: any) {
    return NextResponse.json({ data: null, error: e.message }, { status: 500 });
  }
}

// DELETE a service
export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const supabase = createServerClient();

    const { error } = await supabase.from("services").delete().eq("id", id);
    if (error) throw error;
    return NextResponse.json({ data: { id }, error: null });
  } catch (e: any) {
    return NextResponse.json({ data: null, error: e.message }, { status: 500 });
  }
}
