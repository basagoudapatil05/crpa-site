import { supabase } from "./supabase";

/**
 * Upload multiple images safely
 * Always returns an ARRAY
 */
export async function uploadImages(files) {
  const uploadedUrls = [];

  for (const file of files) {
    const ext = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random()
      .toString(36)
      .substring(2)}.${ext}`;

    const { error } = await supabase.storage
      .from("project-images")
      .upload(fileName, file);

    if (error) {
      console.error("Upload failed:", error);
      continue;
    }

    const { data } = supabase.storage
      .from("project-images")
      .getPublicUrl(fileName);

    if (data?.publicUrl) {
      uploadedUrls.push(data.publicUrl);
    }
  }

  return uploadedUrls;
}
