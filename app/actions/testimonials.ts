"use server";

import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export async function getTestimonials() {
  const { data, error } = await supabase
    .from("testimonials")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return [];
  return data;
}

export async function createTestimonial(formData: FormData) {
  const author_name = formData.get("author_name") as string;
  const content = formData.get("content") as string;
  const rating = parseInt(formData.get("rating") as string) || 5;

  const { error } = await supabase.from("testimonials").insert([
    { author_name, content, rating }
  ]);

  if (error) return { error: error.message };

  revalidatePath("/admin/testimonials");
  revalidatePath("/testimonials");
  return { success: true };
}

export async function deleteTestimonial(id: string) {
  const { error } = await supabase.from("testimonials").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/testimonials");
  revalidatePath("/testimonials");
  return { success: true };
}
