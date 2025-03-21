import { hashPassword, verifyPasswordHash } from '$lib/server/password.js'
import { newUser, comparePasswordHash } from '$lib/server/db.js'
import { generateSessionToken, createSession, setSessionTokenCookie } from '$lib/server/session.js'
import { fail, redirect } from '@sveltejs/kit'
import { env } from '$env/dynamic/private'

export const load = async (event) => {
	const token = event.cookies.get("session") ?? null
	if (token !== null && event.request.method !== 'POST') {
		return redirect(307, '/')
	} else {
		return {
			register: env.REGISTRATION || true
		}
	}
}
export const actions = {
	login: async (event) => {
		const data = await event.request.formData()
		let username = data.get('username')
		let password = await hashPassword(data.get('password'))
		let res = await comparePasswordHash(username, password)
		if (res.status == 2) {
			return {
				error: 'Invalid username or password',
				mode: 0
			}
		} else if (res.status == 0) {
			return {
				error: 'User does not exist',
				mode: 0
			}
		} else if (res.status == 1) {
			let token = await generateSessionToken()
			let session = await createSession(token, res.id)
			setSessionTokenCookie(event, token, session.expiresAt)
			return {
				success: true
			}
			// redirect(307, '/')
		}

	},
	register: async (event) => {
		if (env.REGISTRATION == 'false') return {
			error: 'Registration is disabled'
		}
		const data = await event.request.formData()
		let username = data.get('username')
		let password = await hashPassword(data.get('password'))
		let email = data.get('email')
		let user = await newUser(username, email, password)
		if (user.length == 0) {
			return {
				error: 'User already exists with that username or email',
				mode: 1
			}
		}
		let token = await generateSessionToken()
		let session = await createSession(token, user[0].id)
		setSessionTokenCookie(event, token, session.expiresAt)
		return {
			success: true
		}
		// redirect(307, '/')
	}
}