import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const {
      title,
      location,
      scope,
      category,
      status,
      images // this must be an ARRAY
    } = JSON.parse(req.body);

    if (!title || !category || !status) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Insert new project record
    const { data, error } = await supabase.from("projects").insert([
      {
        title,
        location,
        scope,
        category,
        status,
        images, // ARRAY of uploaded image paths
      }
    ]);

    if (error) {
      console.error("INSERT ERROR:", error);
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ success: true, project: data[0] });
  } catch (err) {
    console.error("API ERROR:", err);
    return res.status(500).json({ error: "Server error" });
  }
}

