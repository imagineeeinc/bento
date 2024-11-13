import { json, error } from '@sveltejs/kit'
import * as db from '$lib/db.js'
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
	const notes = JSON.parse(data.get('notes'))
  let t = event.url.searchParams.get('t')
	let first = event.url.searchParams.get('first')
	if (t && await db.checkTokenValidity(t) == null) {
		return json({error: "token"})
	} else if (t) {
		if (first) {
			let res = await db.save(notes)
			let settings = await db.settingsLoad()
			return json({ notes: res, settings })
		} else {
			await db.save(notes)
			return json({ success: true })
		}
	}
}