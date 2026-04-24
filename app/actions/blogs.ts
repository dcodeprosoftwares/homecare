"use server";

import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export async function getBlogs() {
  const { data, error } = await supabase
    .from("blogs")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching blogs:", error);
    return [];
  }
  return data;
}

export async function createBlog(formData: FormData) {
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const excerpt = formData.get("excerpt") as string;
  const cover_image = formData.get("cover_image") as string;
  const author_name = formData.get("author_name") as string || 'TrueCare Team';

  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Date.now().toString().slice(-4);

  const { error } = await supabase.from("blogs").insert([
    { title, slug, content, excerpt, cover_image, author_name, published_at: new Date().toISOString() }
  ]);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/blogs");
  revalidatePath("/blogs");
  return { success: true };
}

export async function updateBlog(id: string, formData: FormData) {
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const excerpt = formData.get("excerpt") as string;
  const cover_image = formData.get("cover_image") as string;
  const author_name = formData.get("author_name") as string;

  const { error } = await supabase
    .from("blogs")
    .update({ title, content, excerpt, cover_image, author_name })
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/blogs");
  revalidatePath("/blogs");
  return { success: true };
}

export async function deleteBlog(id: string) {
  const { error } = await supabase.from("blogs").delete().eq("id", id);
  if (error) {
    return { error: error.message };
  }
  revalidatePath("/admin/blogs");
  revalidatePath("/blogs");
  return { success: true };
}
