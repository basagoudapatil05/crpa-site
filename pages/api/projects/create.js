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
    const { title, location, scope, status } = req.body;

    // BASIC VALIDATION
    if (!title || !location || !scope || !status) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const { data, error } = await supabase
      .from("projects")
      .insert([
        {
          title,
          location,
          scope,
          status,
          images: [], // ✅ IMPORTANT: always send empty array
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Supabase insert error:", error);
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json(data);
  } catch (err) {
    console.error("Create API crashed:", err);
    return res.status(500).json({ error: "Server error" });
  }
}

