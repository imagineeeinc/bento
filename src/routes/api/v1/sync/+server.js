import { json, error } from '@sveltejs/kit'
import { env } from "$env/dynamic/private"
import { validateSessionToken } from '$lib/server/session.js'
import { getNotes, putNotes } from '$lib/server/db.js'

export async function GET(event) {
	let session = await validateSessionToken(event.cookies.get("session"))
	if (session.session === null) {
		return json({error: "Not logged in"})
	}
	let notes = await getNotes(session.user.id)
	return json({ notes })
}
export async function POST(event) {
  const data = await event.request.formData()
	const notes = JSON.parse(data.get('notes'))
	let first = event.url.searchParams.get('first')
	let session = await validateSessionToken(event.cookies.get("session"))
	if (session.session === null) {
		return json({error: "Not logged in"})
	}
	if (first) {
		let res = await putNotes(session.user.id, notes)
		// TODO: Get settings sync
		// let settings = await db.settingsLoad()
		return json({ notes: res, settings: {} })
	} else {
		await putNotes(session.user.id, notes)
		return json({ success: true })
	}
}