"use server";

import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export async function getInquiries() {
  const { data, error } = await supabase
    .from("contact_inquiries")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching inquiries:", error);
    return [];
  }
  return data;
}

export async function updateInquiryStatus(id: string, status: string) {
  const { error } = await supabase
    .from("contact_inquiries")
    .update({ status })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/admin/inquiries");
  return { success: true };
}

export async function deleteInquiry(id: string) {
  const { error } = await supabase.from("contact_inquiries").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/inquiries");
  return { success: true };
}
