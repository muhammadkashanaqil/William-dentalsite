import { NextResponse } from "next/server";
import { createServerClient, createServerSupabaseClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// PATCH update lead status or fields
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();

    let supabase;
    try {
      supabase = await createServerSupabaseClient();
    } catch {
      supabase = createServerClient();
    }

    const updatePayload = {
      ...body,
      updated_at: new Date().toISOString(),
    };

    let { data, error } = await supabase
      .from("leads")
      .update(updatePayload)
      .eq("id", id)
      .select()
      .maybeSingle();

    if (error) {
      console.warn("Retrying lead update with createServerClient fallback:", error.message);
      const fallbackClient = createServerClient();
      const fallbackRes = await fallbackClient
        .from("leads")
        .update(updatePayload)
        .eq("id", id)
        .select()
        .maybeSingle();

      if (fallbackRes.error) throw fallbackRes.error;
      data = fallbackRes.data;
    }

    return NextResponse.json({ data, error: null });
  } catch (e: any) {
    console.error("Error in PATCH /api/admin/leads/[id]:", e);
    return NextResponse.json({ data: null, error: e.message || "Failed to update lead" }, { status: 500 });
  }
}

// DELETE a lead
export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    let supabase;
    try {
      supabase = await createServerSupabaseClient();
    } catch {
      supabase = createServerClient();
    }

    let { error } = await supabase.from("leads").delete().eq("id", id);

    if (error) {
      console.warn("Retrying lead delete with createServerClient fallback:", error.message);
      const fallbackClient = createServerClient();
      const fallbackRes = await fallbackClient.from("leads").delete().eq("id", id);
      if (fallbackRes.error) throw fallbackRes.error;
    }

    return NextResponse.json({ data: { id }, error: null });
  } catch (e: any) {
    console.error("Error in DELETE /api/admin/leads/[id]:", e);
    return NextResponse.json({ data: null, error: e.message || "Failed to delete lead" }, { status: 500 });
  }
}
