import { env } from '$env/dynamic/private'
import { drizzle } from 'drizzle-orm/node-postgres';
import { eq } from 'drizzle-orm'
import { usersTable, notesTable } from '../../db/schema.js'
import { verifyPasswordHash } from './password.js'
import { DateTime } from 'luxon'

export const db = drizzle(env.DATABASE_URL);

export function newUser(username, email, password) {
	return db.insert(usersTable).values({ username: username.toLowerCase(), email, password }).onConflictDoNothing().returning()
}
/*
 * 0 - dosnet exist
 * 1 - exist
 * 2 - incorrect
*/
export async function comparePasswordHash(username, hash) {
	let res = await db.select().from(usersTable).where(eq(usersTable.username, username.toLowerCase()))
	if (res.length == 0) return { status: 0, id: null}
	if (await verifyPasswordHash(res[0].password, hash)) return { status: 2, id: null}
	return { status: 1, id: res[0].id}
}

export async function getNotes(userId) {
	/* let result = await Notes.findAll({
		attributes: ['data'],
		order: [['created', 'ASC']],
	})
	result = result.map(item => JSON.parse(item.data))
	return result */
	let result = await db.select({
		data: notesTable.data,
	})
	.from(notesTable)
	.where(eq(notesTable.userId, userId))
	.orderBy(notesTable.created, 'ASC')
	let res = []
	result.forEach(item => res.push(item.data))
	return res
}

export async function putNotes(userId, data) {
	let oldData = await getNotes(userId)
  let updated = []
  let deletedList = []
  data.forEach(n => {
    let i = null
    let timestamp = 0
    let deleted = false
    oldData.find((data, index) => {
      if (data.uid === n.uid) {
        i = index
        timestamp = data.lastEdited
        deleted = data.delete
        return true
      }
    })
    if (i !== null) {
      if (timestamp < n.lastEdited && !deleted) {
        oldData.splice(i, 1, n)
        updated.push(i)
      } else if (deleted) {
        deletedList.push(i)
      }
    } else {
      if (n.delete === false) {
        oldData.push(n)
        updated.push(oldData.length - 1)
      }
    }
    // TODO: deleted notes list
  })
  putAway(oldData, DateTime.now().toISO(), updated, deletedList, userId)
  return oldData
}

async function putAway(data, timestamp, updated, deleted, userId) {
	updated.forEach(async i => {
		let item = data[i]
		await db.insert(notesTable)
		.values({
			id: item.uid,
			data: item,
			userId: userId,
			lastUpdated: new Date(timestamp),
			created: new Date(item.creation),
			delete: item.delete
		}).onConflictDoUpdate({
			target: notesTable.id,
			set: {
				data: item,
				lastUpdated: new Date(timestamp),
				created: new Date(item.creation),
				delete: item.delete
			}
		})
	})
	deleted.forEach(async i => {
		await db.delete(notesTable).where(eq(notesTable.id, data[i].uid))
	})
}