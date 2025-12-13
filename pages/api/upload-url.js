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

    const { data, error } = await supabase.storage
      .from("project-images")   // <-- MUST MATCH YOUR BUCKET NAME EXACTLY
      .createSignedUploadUrl(path);

    if (error) {
      console.log("SIGNED URL ERROR:", error);
      return res.status(500).json({ error: error.message });
    }

    // Return both upload URL & public path
    const publicUrl =
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/project-images/${path}`;

    return res.status(200).json({
      uploadUrl: data.signedUrl,
      path: publicUrl, // <--- This MUST be a valid public URL
    });
  } catch (err) {
    console.error("Upload URL error:", err);
    res.status(500).json({ error: "Upload URL failed" });
  }
}
