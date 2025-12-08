import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  try {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("id", { ascending: false });

    if (error) {
      console.error("Supabase list error:", error);
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json(data);
  } catch (err) {
    console.error("List API crashed:", err);
    res.status(500).json({ error: "Server error" });
  }
}
