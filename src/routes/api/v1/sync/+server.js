import { json } from '@sveltejs/kit'
import * as db from '$lib/db'

export async function GET(event) {
  const data = await db.load()
  return json(data)
}
export async function POST(event) {
  const data = await event.request.formData()
  db.save(data)
  return json({saved: true})
}
