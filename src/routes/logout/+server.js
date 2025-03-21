import { invalidateSession, deleteSessionTokenCookie } from '$lib/server/session.js'
import { fail, redirect } from '@sveltejs/kit'

export async function GET(event) {
	let token = event.cookies.get("session") ?? null
	if (token === null) return redirect(307, '/login')
	await invalidateSession(token)
	deleteSessionTokenCookie(event)
	return redirect(307, '/login')
}