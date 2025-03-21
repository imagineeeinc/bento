import { fail, redirect } from '@sveltejs/kit'
import {
	validateSessionToken,
	deleteSessionTokenCookie
} from '$lib/server/session.js'

export const load = async (event) => {
	const token = event.cookies.get("session") ?? null
	if (token === null) {
		return redirect(307, '/login')
	} else {
		const { session, user } = await validateSessionToken(token)
		if (session === null) {
			deleteSessionTokenCookie(event)
			return redirect(307, '/login')
		}
	}
}