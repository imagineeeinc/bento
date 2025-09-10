import { json, error } from '@sveltejs/kit'
import { env } from "$env/dynamic/private"
import { validateSessionToken } from '$lib/server/session.js'
import { getNote, putNote } from '$lib/server/db.js'

export async function GET(event) {
	let session = await validateSessionToken(event.cookies.get("session"))
	if (session.session === null) {
		return json({error: "Not logged in"})
	}
	if (!event.url.searchParams.get('id')) {
		return json({error: "Missing note id"})
	}
	let note = await getNote(session.user.id, event.url.searchParams.get('id'))
	if (note === null) {
		return json({error: "Note not found"})
	} else {
		return json({ note })
	}
}
export async function POST(event) {
  const data = await event.request.formData()
	const note = JSON.parse(data.get('data'))
	let first = event.url.searchParams.get('first')
	let session = await validateSessionToken(event.cookies.get("session"))
	if (session.session === null) {
		return json({error: "Not logged in"})
	}
	if (!event.url.searchParams.get('id')) {
		return json({error: "Missing note id"})
	}
	if (first) {
		let res = await putNote(session.user.id, event.url.searchParams.get('id'), note)
		return json({ note: res })
	} else {
		await putNote(session.user.id, event.url.searchParams.get('id'), note)
		return json({ success: true })
	}
}