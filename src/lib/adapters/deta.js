import 'dotenv/config'
import { Deta } from 'deta'
import { env } from "$env/dynamic/private";

//const deta = DETA_COLLECTION_KEY && DETA_COLLECTION_KEY != '' ? Deta(DETA_COLLECTION_KEY) : Deta()
const deta = Deta(env.DETA_PROJECT_KEY)

const db = deta.Base('bento')

export async function putAway(data, timestamp) {
  db.put(data, "storedNotes")
  db.put(timestamp, "lastUpdate")
}
export async function retrive() {
  const data = await db.get("storedNotes")
  delete data.key
  return data
}

