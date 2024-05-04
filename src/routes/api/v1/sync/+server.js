import { json, error } from '@sveltejs/kit'
import * as db from '$lib/db'
import { env } from "$env/dynamic/private"

export async function GET(event) {
  let p = event.url.searchParams.get('p')
  if (p == env.WEB_PASS) {
    const data = await db.load()
    return json(data)
  } else {
    return error(403, {error: "password"})
  }
}
export async function POST(event) {
  const data = await event.request.formData()
  let p = event.url.searchParams.get('p')
  if (p == env.WEB_PASS) {
    const res = await db.save(JSON.parse(data.get('notes')))
    return json(res)
  } else {
    return error(403, {error: "password"})
  }
}
