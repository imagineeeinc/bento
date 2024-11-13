import { json, error } from '@sveltejs/kit'
import * as db from '$lib/db.js'
import { env } from "$env/dynamic/private"

export async function GET(event) {
  let p = event.url.searchParams.get('p')
	let t = event.url.searchParams.get('t')
	if (t && await db.checkTokenValidity(t) == null) {
		return json({error: "token"})
	} else if (t) {
		return json({ token: t })
	}
	if (p && p == env.WEB_PASS) {
		const token = await db.authenticate(p, process.env.WEB_PASS || "")
		return json({ token })
	} else if (p) {
		return json({error: "password"})
	}
	return json({error: "empty"})
}