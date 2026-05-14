"use server";

import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export async function getPlans() {
  const { data, error } = await supabase
    .from("plans")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching plans:", error);
    return [];
  }
  return data;
}

export async function createPlan(formData: FormData) {
  const name = formData.get("name") as string;
  const price = formData.get("price") as string;
  const description = formData.get("description") as string;
  const features = formData.get("features") as string;
  const is_active = formData.get("is_active") === "on";

  const { error } = await supabase.from("plans").insert([
    { name, price, description, features, is_active }
  ]);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/plans");
  revalidatePath("/plans");
  return { success: true };
}

export async function updatePlan(id: string, formData: FormData) {
  const name = formData.get("name") as string;
  const price = formData.get("price") as string;
  const description = formData.get("description") as string;
  const features = formData.get("features") as string;
  const is_active = formData.get("is_active") === "on";

  const { error } = await supabase
    .from("plans")
    .update({ name, price, description, features, is_active })
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/plans");
  revalidatePath("/plans");
  return { success: true };
}

export async function deletePlan(id: string) {
  const { error } = await supabase.from("plans").delete().eq("id", id);
  if (error) {
    return { error: error.message };
  }
  revalidatePath("/admin/plans");
  revalidatePath("/plans");
  return { success: true };
}
