"use server";

import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export async function getCareers() {
  const { data, error } = await supabase
    .from("careers")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching careers:", error);
    return [];
  }
  return data;
}

export async function createCareer(formData: FormData) {
  const job_title = formData.get("job_title") as string;
  const location = formData.get("location") as string;
  const employment_type = formData.get("employment_type") as string;
  const description = formData.get("description") as string;
  const requirements = formData.get("requirements") as string;
  const is_active = formData.get("is_active") === "on";

  // Simple slug generation
  const slug = job_title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Date.now().toString().slice(-4);

  const { error } = await supabase.from("careers").insert([
    { job_title, slug, location, employment_type, description, requirements, is_active }
  ]);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/careers");
  revalidatePath("/career");
  return { success: true };
}

export async function updateCareer(id: string, formData: FormData) {
  const job_title = formData.get("job_title") as string;
  const location = formData.get("location") as string;
  const employment_type = formData.get("employment_type") as string;
  const description = formData.get("description") as string;
  const requirements = formData.get("requirements") as string;
  const is_active = formData.get("is_active") === "on";

  const { error } = await supabase
    .from("careers")
    .update({ job_title, location, employment_type, description, requirements, is_active })
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/careers");
  revalidatePath("/career");
  return { success: true };
}

export async function deleteCareer(id: string) {
  const { error } = await supabase.from("careers").delete().eq("id", id);
  if (error) {
    return { error: error.message };
  }
  revalidatePath("/admin/careers");
  revalidatePath("/career");
  return { success: true };
}
