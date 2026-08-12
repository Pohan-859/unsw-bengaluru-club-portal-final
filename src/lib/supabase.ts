import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

/**
 * Public Client-side Supabase Connection Instance
 * Safe for use in browser components and server rendering
 */
export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Admin Server-side Supabase Connection Instance
 * Uses service role key for admin privileges (never exposed to client)
 */
export const supabaseAdmin: SupabaseClient = createClient(
  supabaseUrl,
  supabaseServiceKey || supabaseAnonKey
);

/**
 * Helper to upload club assets (logos, banners) to Supabase Storage
 * Bucket: "club-assets"
 */
export async function uploadClubAsset(
  file: File | Blob,
  fileName: string,
  bucket: string = "club-assets"
): Promise<{ url: string | null; error: string | null }> {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return {
        url: null,
        error: "Supabase environment variables (NEXT_PUBLIC_SUPABASE_URL) are not configured yet.",
      };
    }

    const fileExt = fileName.split(".").pop();
    const filePath = `${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: true,
      });

    if (uploadError) {
      return { url: null, error: uploadError.message };
    }

    const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(filePath);

    return { url: publicUrlData.publicUrl, error: null };
  } catch (err) {
    return {
      url: null,
      error: err instanceof Error ? err.message : "Failed to upload file to Supabase storage.",
    };
  }
}
