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
      .from("project-images")
      .createSignedUploadUrl(path);

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.status(200).json({
      uploadUrl: data.signedUrl,
      path,
    });
  } catch (err) {
    console.error("Upload URL error:", err);
    res.status(500).json({ error: "Upload URL failed" });
  }
}

<select
  value={form.category}
  onChange={(e) => setForm({ ...form, category: e.target.value })}
>
  <option value="residence">Residence</option>
  <option value="hotel">Hotel</option>
  <option value="school">School</option>
  <option value="temple">Temple</option>
  <option value="commercial">Commercial</option>
  <option value="farmhouse">Farmhouse</option>
  <option value="office">Office</option>
</select>
