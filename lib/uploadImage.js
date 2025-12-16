import { supabase } from "./supabase";

export async function uploadImage(file) {
  const fileExt = file.name.split(".").pop();
  const fileName = `${Date.now()}.${fileExt}`;
  const filePath = `projects/${fileName}`;

  const { error } = await supabase.storage
    .from("project-images")
    .upload(filePath, file);

  if (error) throw error;

  const { data } = supabase.storage
    .from("project-images")
    .getPublicUrl(filePath);

  return data.publicUrl;
}
