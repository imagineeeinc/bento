import { json } from '@sveltejs/kit'
import * as db from '$lib/db'

export async function GET(event) {
  const data = await db.settingsLoad()
  return json(data)
}
export async function POST(event) {
  const data = await event.request.formData()
  db.settingsSave(JSON.parse(data.get('value')))
  return json({saved: true})
}
