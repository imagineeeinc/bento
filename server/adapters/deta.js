// DEPRECTED
// DO NOT USE
// ONLY FOR REFERENCE
import 'dotenv/config'
import { Deta } from 'deta'
import { env } from '$env/dynamic/private'

//const deta = DETA_COLLECTION_KEY && DETA_COLLECTION_KEY != '' ? Deta(DETA_COLLECTION_KEY) : Deta()
const deta = Deta(env.DETA_PROJECT_KEY || process.env.DETA_PROJECT_KEY || 'key')

const db = deta.Base('bento')

// Init
if (await db.get("settings") == null) {
  db.put({"adapter": "deta"}, "settings")
}
if (await db.get("storedNotes") == null) {
  db.put([], "storedNotes")
}

export async function putAway(data, timestamp) {
  db.put(data, "storedNotes")
  db.put(timestamp, "lastUpdate")
}
export async function retrive() {
  const data = await db.get("storedNotes")
  if (await db.get("storedNotes") == null) {
    db.put([], "storedNotes")
    return []
  }
  delete data.key
  return data
}

const defaultSettings = {value: {"adapter": "deta", "logOut": {h: 24, m: 0}}}
export async function settingsPutAway(data) {
  db.put({value: data}, "settings")
}
export async function settingsRetrive() {
  const data = await db.get("settings")
  if (data == null) {
    db.put(defaultSettings, "settings")
    return defaultSettings
  }
  delete data.key
  return data
}
