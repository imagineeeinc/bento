import { sessionTable, usersTable } from '../../db/schema.js'
import { eq } from 'drizzle-orm'
import { db } from '../server/db.js'
import { encodeBase32LowerCaseNoPadding, encodeHexLowerCase } from '@oslojs/encoding'
import { sha256 } from '@oslojs/crypto/sha2'

export function generateSessionToken() {
	const bytes = new Uint8Array(20)
	crypto.getRandomValues(bytes)
	const token = encodeBase32LowerCaseNoPadding(bytes)
	return token
}
export async function createSession(token, userId) {
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)))
	const session = {
		id: sessionId,
		userId,
		expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30)
	}
	await db.insert(sessionTable).values(session)
	return session
}
export async function validateSessionToken(token) {
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)))
	const result = await db
		.select({ user: usersTable, session: sessionTable })
		.from(sessionTable)
		.innerJoin(usersTable, eq(sessionTable.userId, usersTable.id))
		.where(eq(sessionTable.id, sessionId))
	if (result.length < 1) {
		return { session: null, user: null }
	}
	const { user, session } = result[0]
	if (Date.now() >= session.expiresAt.getTime()) {
		await db.delete(sessionTable).where(eq(sessionTable.id, session.id))
		return { session: null, user: null }
	}
	if (Date.now() >= session.expiresAt.getTime() - 1000 * 60 * 60 * 24 * 15) {
		session.expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30)
		await db
			.update(sessionTable)
			.set({
				expiresAt: session.expiresAt
			})
			.where(eq(sessionTable.id, session.id))
	}
	return { session, user }
}
export async function invalidateSession(sessionId) {
	await db.delete(sessionTable).where(eq(sessionTable.id, sessionId))
}
export async function invalidateAllSessions(userId) {
	await db.delete(sessionTable).where(eq(sessionTable.userId, userId))
}

export function setSessionTokenCookie(event, token, expiresAt) {
	event.cookies.set("session", token, {
		httpOnly: true,
		sameSite: "lax",
		expires: expiresAt,
		path: "/"
	});
}

export function deleteSessionTokenCookie(event) {
	event.cookies.set("session", "", {
		httpOnly: true,
		sameSite: "lax",
		maxAge: 0,
		path: "/"
	});
}