import { writable, get } from 'svelte/store'
import { browser } from '$app/environment'
import { DateTime } from 'luxon'
/*
format:
{
  title: string
  data: string
  creation: Date.now() readonly
  lastEdited: Date.now()
  uid: uid
  owner: string
  delete: boolen
  archive: boolen
  tags: [
    string
  ]
  clientArgs: {
    markdown: true
    data: string
  }
  versonHistory?: array[
    {
      timestamp: Date.now() readonly
      data: gzip string
    }
  ]
}
*/
// Vars
export let notes = writable([])
export let settings = writable({})
let user = ''

export function newNote(text, title) {
  let uid = crypto.randomUUID()
  notes.update((list) => {
    list.push(
      {
        title: title,
        data: text,
        creation: Date.now(),
        lastEdited: Date.now(),
        uid: uid,
        owner: user,
        delete: false,
        archive: false,
        tags: [],
        clientArgs: {
          markdown: true
        }
      }
    )
    return list
  })
  return uid
}

export function updateNote(uid, text, title, archive) {
  notes.update((list) => {
    let i = null
    list.find((data, index) => {
      if (data.uid === uid) {
        i = index
        return true
      }
    })
    let note = list[i]
    note.data = text
    note.title = title
    note.owner = user
    note.lastEdited = Date.now()
    note.archive = archive
    list[i] = note
    return list
  })
}

export function delNote(uid) {
  notes.update((list) => {
    let i = null
    list.find((data, index) => {
      if (data.uid === uid) {
        i = index
        return true
      }
    })
    let note = list[i]
    delete note.data
    delete note.title
    delete note.owner
    delete note.clientArgs
    note.lastEdited = Date.now()
    note.delete = true
    list[i] = note
    return list
  })
}
export function getListNotes() {
  return get(notes)
}
export function getUidNote(uid) {
  let list = getListNotes()
  let i = null
  list.find((data, index) => {
    if (data.uid === uid) {
      i = index
      return true
    }
  })
  return list[i]
}

// Note Sync
let sendOf = null
export async function sendSync(noWait) {
  if (sendOf != null) {
    clearTimeout(sendOf)
  }
  let send = async ()=>{
    if (localStorage.getItem('login') !== undefined &&
      localStorage.getItem('login') != "" &&
      localStorage.getItem('login') !== null) {
      let d = new FormData()
      d.append("notes", localStorage.getItem('notes'))
      await fetch(`/api/v1/sync?p=${localStorage.getItem('login')}`, {
        method: "POST",
        body: d
      })
      .then(data=>{
        if (data.status==200) {
          return data.json()
        } else {
          setTimeout(sendSync,100)
          return false
        }
      })
      .then(json=>{
        if (json != false) {
          notes.set(json)
        }
        sendOf = null
      })
      let f = await fetch(`/api/v1/settings?p=${localStorage.getItem('login')}`, {
        method: "GET"
      })
      let json = await f.status==200?await f.json():false
      if (json != false && !json.error) {
        settings.set(json)
        user = json.user
      }
      return json
    }
  }
  if (noWait == true) {
    return send()
  } else {
    sendOf = setTimeout(send, 1000)
  }
}
if (browser) {
  // Check if 
  if (localStorage.getItem('notes') !== undefined &&
  localStorage.getItem('notes') != "" &&
  localStorage.getItem('notes') !== null) {
    notes.set(JSON.parse(localStorage.getItem('notes')))
  }
  // Update on change
  notes.subscribe((data) => {
    localStorage.setItem('notes', JSON.stringify(data))
    if (sendOf === null) sendSync()
  })
}

// Settings
if (browser) {
  if (localStorage.getItem('settings') !== undefined &&
  localStorage.getItem('settings') != "" &&
  localStorage.getItem('settings') !== null) {
    settings.set(JSON.parse(localStorage.getItem('settings')))
  }
  settings.subscribe((data) => {
    localStorage.setItem('settings', JSON.stringify(data))
  })
}

// Login
export async function authenticate(pass, pub) {
  let f = await fetch(`/api/v1/auth?p=${pass}`, {
    method: "GET"
  })
  let res = await f.json()
  if (res.ok == 0) {
    localStorage.setItem('login', pass)
    let settingsCopy = await sendSync(true)
    localStorage.setItem('logOut', Number(DateTime.now().plus({hours: !pub?settingsCopy.logOut.h || 24:0, minutes: !pub?settingsCopy.logOut.m || 0:10}).toFormat("X")))
    return true
  } else {
    return false
  }
}
export function checkTime() {
  if (localStorage.getItem('logOut')<=Number(DateTime.now().toFormat("X"))) {
    localStorage.removeItem('logOut')
    localStorage.removeItem('login')
  }
}
