import 'dotenv/config'
import { Deta } from 'deta'

const deta = process.env.DETA_COLLECTION_KEY ? Deta(process.env.DETA_COLLECTION_KEY) : Deta()

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

