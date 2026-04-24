"use server";

import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export async function getServices() {
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching services:", error);
    return [];
  }
  return data;
}

export async function createService(formData: FormData) {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const icon = formData.get("icon") as string;
  const content = formData.get("content") as string;
  const is_active = formData.get("is_active") === "on";

  // Simple slug generation
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

  const { error } = await supabase.from("services").insert([
    { title, slug, description, icon, content, is_active }
  ]);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/services");
  revalidatePath("/services");
  return { success: true };
}

export async function updateService(id: string, formData: FormData) {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const icon = formData.get("icon") as string;
  const content = formData.get("content") as string;
  const is_active = formData.get("is_active") === "on";

  const { error } = await supabase
    .from("services")
    .update({ title, description, icon, content, is_active })
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/services");
  revalidatePath("/services");
  return { success: true };
}

export async function deleteService(id: string) {
  const { error } = await supabase.from("services").delete().eq("id", id);
  if (error) {
    return { error: error.message };
  }
  revalidatePath("/admin/services");
  revalidatePath("/services");
  return { success: true };
}
