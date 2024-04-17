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
// Notes
export let notes = writable([])
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
        clientArgs: {
          markdown: true
        }
      }
    )
    return list
  })
  return uid
}

export function updateNote(uid, text, title) {
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
let sendOf = null
function sendSync() {
  if (sendOf != null) {
    clearTimeout(sendOf)
  }
  sendOf = setTimeout(()=>{
    let d = new FormData()
    d.append("notes", localStorage.getItem('notes'))
    fetch('/api/v1/sync', {
      method: "POST",
      body: d
    })
    //.then(data=>data.status==200?null:setTimeout(sendSync,100))
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
  }, 1000)
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

// Editor State
export let editing = writable(null)

// Settings
export let settings = writable({})
if (browser) {
  if (localStorage.getItem('settings') !== undefined &&
  localStorage.getItem('settings') != "" &&
  localStorage.getItem('settings') !== null) {
    settings.set(JSON.parse(localStorage.getItem('settings')))
  }
  fetch('/api/v1/settings', {
    method: "GET"
  })
  .then(res=>res.status==200?res.json():false)
  .then(json=>{
    if (json != false) {
      settings.set(json)
      user = json.user
    }
  })
  settings.subscribe((data) => {
    localStorage.setItem('settings', JSON.stringify(data))
  })
}
