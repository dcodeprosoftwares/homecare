"use server";

import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export async function updateSettings(settings: Record<string, string>) {
  try {
    const promises = Object.entries(settings).map(([key, value]) => {
      return supabase
        .from('site_settings')
        .update({ value })
        .eq('key', key);
    });
    
    await Promise.all(promises);
    
    // Revalidate everything since settings affect layout and global areas
    revalidatePath("/", "layout");
    return { success: true };
  } catch (error: any) {
    console.error("Error saving settings:", error);
    return { error: error.message || "Failed to save settings." };
  }
}
