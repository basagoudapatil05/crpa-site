import { createClient } from "@supabase/supabase-js";

export const config = {
  api: {
    bodyParser: true,
  },
};

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export default async function handler(req, res) {
  try {
    // Next.js already parses req.body automatically
    const body = req.body;

    const { data, error } = await supabase
      .from("projects")
      .insert({
        title: body.title,
        location: body.location,
        scope: body.scope,
        status: body.status,
        images: body.images, // array of URLs
      });

    if (error) {
      console.error("Supabase insert error:", error);
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("Create API crashed:", err);
    res.status(500).json({ error: "Server crashed" });
  }
}

