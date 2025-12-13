import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export default async function handler(req, res) {
  try {
    const body = JSON.parse(req.body);

    const { data, error } = await supabase
      .from("projects")
      .insert({
        title: body.title,
        location: body.location,
        scope: body.scope,
        status: body.status,
        category: body.category,
        images: body.images,           // ARRAY OF URLs
        featured_image: body.images?.[0] || null,
      });

    if (error) {
      console.log("Insert error:", error);
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ success: true });
  } catch (e) {
    console.error("Create API crashed:", e);
    return res.status(500).json({ error: "Server error" });
  }
}

