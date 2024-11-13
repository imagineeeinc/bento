import { writable, get } from 'svelte/store'
import { browser } from '$app/environment'
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
  pin: boolen
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
export let theme = writable('system')
export let tags = writable([])
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
        pin: false,
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

export function updateNote(uid, text, title, archive, pin) {
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
    note.pin = pin
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
export function getUidTags(uid) {
  let list = getListNotes()
  let i = null
  list.find((data, index) => {
    if (data.uid === uid) {
      i = index
      return true
    }
  })
  let note = list[i]
  // if tags dosen't exist create and save
  if (note.tags === undefined) {
    note.tags = []
    list[i] = note
    notes.set(list)
  }
  return note.tags
}
export function setUidTags(uid, tags) {
  notes.update((list) => {
    let i = null
    list.find((data, index) => {
      if (data.uid === uid) {
        i = index
        return true
      }
    })
    let note = list[i]
    note.tags = tags
    note.lastEdited = Date.now()
    list[i] = note
    return list
  })
}

// Note Sync
let sendOf = null
async function syncSave() {
  let d = new FormData()
  d.append("notes", localStorage.getItem('notes'))
  fetch(`/api/v1/sync?t=${localStorage.getItem('token')}`, {
    method: "POST",
    body: d
  }).then(res=>res.json()).then(res=>{if (res.success) {sendOf = null} else {console.error(res.error)}})
}
var firstTime
async function syncFirst() {
  let d = new FormData()
  d.append("notes", localStorage.getItem('notes'))
  let res = await fetch(`/api/v1/sync?t=${localStorage.getItem('token')}&first=true`, {
    method: "POST",
    body: d
  })
  res = await res.json()
  if (res.notes) {
    notes.set(res.notes)
    settings.set(res.settings)
    // user = data.settings.user
  } else {
    alert("Error syncing")
    console.error(res.error)
  }
}
var socket
if (browser) {
  // Check if 
  if (localStorage.getItem('notes') !== undefined &&
  localStorage.getItem('notes') != "" &&
  localStorage.getItem('notes') !== null) {
    notes.set(JSON.parse(localStorage.getItem('notes')))
  }
  firstTime = setInterval(()=>{
    if (localStorage.getItem('token') !== undefined &&
    localStorage.getItem('token') != "" &&
    localStorage.getItem('token') !== null) {
      clearInterval(firstTime)
      syncFirst()
    }
  }, 1000)
  // Update on change
  notes.subscribe((data) => {
    localStorage.setItem('notes', JSON.stringify(data))
    if (sendOf !== null) {
      clearTimeout(sendOf)
      sendOf = setTimeout(syncSave, 1000)
    } else {
      syncSave()
    }
  })
  theme.set(localStorage.getItem('theme') || 'system')
  theme.subscribe((data) => {
    localStorage.setItem('theme', data)
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
  let res = await fetch(`/api/v1/auth?p=${pass}`)
  res = await res.json()
  if (res.token) {
    localStorage.setItem('token', res.token)
    return true
  }
  return false
}
export async function authValidity() {
  if (localStorage.getItem('token') == null) {
    return false
  }
  let res = await fetch(`/api/v1/auth?t=${localStorage.getItem('token')}`)
  res = await res.json()
  if (res.token == localStorage.getItem('token')) {
    return true
  }
  localStorage.removeItem('token')
  return false
}

export function availableTags() {
  get(notes).forEach(note => {
    if (note.tags) {
      note.tags.forEach(tag => {
        if (!get(tags).includes(tag)) {
          tags.update((list) => {
            list.push(tag)
            return list
          })
        }
      })
    }
  })
  return get(tags)
}

export function resetClient() {
  localStorage.removeItem('notes')
  localStorage.removeItem('settings')
  localStorage.removeItem('theme')
  localStorage.removeItem('token')
  location.reload()
}