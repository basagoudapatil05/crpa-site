import { createClient } from "@supabase/supabase-js";
import { v4 as uuidv4 } from "uuid";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export default async function handler(req, res) {
  try {
    const { filename } = JSON.parse(req.body);

    const ext = filename.split(".").pop();
    const path = `${uuidv4()}.${ext}`;

    // 1. Create signed upload URL
    const { data, error } = await supabase.storage
      .from("project-images")
      .createSignedUploadUrl(path);

    if (error) return res.status(500).json({ error: error.message });

    return res.status(200).json({
      uploadUrl: data.signedUrl,
      path: path,
      publicUrl: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/project-images/${path}`
    });

  } catch (err) {
    console.error("Upload URL error:", err);
    return res.status(500).json({ error: "Upload URL failed" });
  }
}


