import * as deta from './adapters/deta.js'
import 'dotenv/config'

//TODO: decipher diffrent adapters

export function save(data) {
  deta.putAway(data, Date.now().toString())
}
export async function load() {
  const data = await deta.retrive()
  return data.value
}
