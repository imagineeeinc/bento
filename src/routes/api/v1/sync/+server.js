import { json } from '@sveltejs/kit'
import * as db from '$lib/db'

export async function GET(event) {
  const data = await db.load()
  return json(data)
}
export async function POST(event) {
  const data = await event.request.formData()
  const res = await db.save(JSON.parse(data.get('notes')))
  return json(res)
}
