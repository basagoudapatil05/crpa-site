import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export default async function handler(req, res) {
  try {
    const { filename } = JSON.parse(req.body);

    const filePath = `${Date.now()}-${filename}`;

    const { data, error } = await supabase.storage
      .from("project-images")
      .createSignedUploadUrl(filePath);

    if (error) {
      console.error("Upload URL error:", error);
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({
      uploadUrl: data.signedUrl,
      path: filePath,
    });

  } catch (err) {
    console.error("Upload handler crashed:", err);
    res.status(500).json({ error: "Server crashed" });
  }
}

