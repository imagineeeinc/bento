import { json, error } from '@sveltejs/kit'
import * as db from '$lib/db'
import { env } from "$env/dynamic/private"

export async function GET(event) {
  let p = event.url.searchParams.get('p')
  if (p == env.WEB_PASS) {
    const data = await db.settingsLoad()
    return json(data)
  } else {
    return error(403, {error: "password"})
  }
}
export async function POST(event) {
  let p = event.url.searchParams.get('p')
  if (p == env.WEB_PASS) {
    const data = await event.request.formData()
    db.settingsSave(JSON.parse(data.get('value')))
    return json({saved: true})
  } else {
    return error(403, {error: "password"})
  }
}
