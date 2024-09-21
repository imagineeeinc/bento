import * as adapter from './adapters/sqlite3.js'
import 'dotenv/config'

//TODO: decipher diffrent adapters

export async function save(data) {
  let oldData = await adapter.retrive()
  // oldData = oldData.value
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
      if (timestamp < n.lastEdited) {
        oldData.splice(i, 1, n)
      }
      // Oblitorate if older client says exist and its deleted on server
      /*  else if (timestamp >= n.lastEdited && deleted === true) {
        oldData.splice(i, 1)
      } */
    } else {
      if (n.delete === false) {
        oldData.push(n)
      }
    }
    // TODO: deleted notes list
  })
  adapter.putAway(oldData, Date.now().toString())
  return oldData
}
export async function load() {
  const data = await adapter.retrive()
  return data.value
}

export function settingsSave(data) {
  adapter.settingsPutAway(data, Date.now().toString())
}
export async function settingsLoad() {
  const data = await adapter.settingsRetrive()
  return data.value
}
