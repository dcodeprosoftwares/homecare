"use server";

import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export async function getGallery() {
  const { data, error } = await supabase
    .from("gallery")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching gallery:", error);
    return [];
  }
  return data;
}

export async function createGalleryItem(formData: FormData) {
  const title = formData.get("title") as string;
  const image_url = formData.get("image_url") as string;
  const category = formData.get("category") as string || "General";

  const { error } = await supabase.from("gallery").insert([
    { title, image_url, category }
  ]);

  if (error) return { error: error.message };

  revalidatePath("/admin/gallery");
  revalidatePath("/gallery");
  return { success: true };
}

export async function deleteGalleryItem(id: string) {
  const { error } = await supabase.from("gallery").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/gallery");
  revalidatePath("/gallery");
  return { success: true };
}
