import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,   // ✅ MUST be NEXT_PUBLIC
  process.env.SUPABASE_SERVICE_KEY        // ✅ server-only key
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
      images = [],
    } = req.body;

    if (!title || !status) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const { data, error } = await supabase
      .from("projects")
      .insert([
        {
          title,
          location,
          scope,
          category,
          status,
          images, // must be TEXT[]
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Insert error:", error);
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json(data);
  } catch (err) {
    console.error("Create project failed:", err);
    return res.status(500).json({ error: "Server error" });
  }
}

