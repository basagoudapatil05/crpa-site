import { createClient } from '@supabase/supabase-js'
import { v4 as uuidv4 } from 'uuid'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  try {
    const { filename } = JSON.parse(req.body)
    const ext = filename.split('.').pop()
    const key = `projects/${uuidv4()}.${ext}`

    // Generate a signed upload URL (PUT)
    const { data, error } = await supabase.storage
      .from('project-images')
      .createSignedUploadUrl(key)

    if (error) return res.status(500).json({ error })

    return res.status(200).json({
      uploadUrl: data.signedUrl,
      path: key
    })

  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}

