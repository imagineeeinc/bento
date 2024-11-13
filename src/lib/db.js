import * as adapter from './adapters/sqlite3.js'
import 'dotenv/config'
import { DateTime } from 'luxon'
import uuid4 from 'uuid4'

//TODO: decipher diffrent adapters

export async function save(data) {
  let oldData = await adapter.retrive()
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
  adapter.putAway(oldData, DateTime.now().toISO(), updated, deletedList)
  return oldData
}
export async function load() {
  const data = await adapter.retrive()
  return data
}

export function settingsSave(data) {
  adapter.settingsPutAway(data, DateTime.now().toISO())
}
export async function settingsLoad() {
  const data = await adapter.settingsRetrive()
  return data
}

export async function authenticate(pass, correct) {
  // check if password is correct
  let token = ""
  if (pass == correct) {
    let expiry = DateTime.now().plus({ days: 30 }).toISO()
    token = uuid4()
    await adapter.saveToken(token, expiry)
  } else {
    return null
  }

  return token
}
export async function checkTokenValidity(token) {
  let res = await adapter.checkToken(token)
  if (res == null || DateTime.fromISO(res.expiry) < DateTime.now()) {
		return null
	}
  return res
}