import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  try {
    const project = JSON.parse(req.body)

    const { data, error } = await supabase
      .from('projects')
      .insert([project])
      .select()
      .single()

    if (error) return res.status(500).json({ error })

    return res.status(200).json(data)
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
}
