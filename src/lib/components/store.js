import { writable, get } from 'svelte/store'
import { browser } from '$app/environment'
import { DateTime } from 'luxon'
import { io } from 'socket.io-client'
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
function syncSave() {
  if (socket.connected) {
    socket.emit("save", JSON.parse(localStorage.getItem('notes')))
    sendOf = null
  }
}
function syncFirst() {
  socket.emit("syncFirst", JSON.parse(localStorage.getItem('notes')), data => {
    if (data) {
      notes.set(data.notes)
      settings.set(data.settings)
      // user = data.settings.user
    }
  })
}
var socket
if (browser) {
  socket = io()
  socket.on("connect", () => {
    syncFirst()
  })
  socket.on("load", data => {
    console.log(data)
  })
  // Check if 
  if (localStorage.getItem('notes') !== undefined &&
  localStorage.getItem('notes') != "" &&
  localStorage.getItem('notes') !== null) {
    notes.set(JSON.parse(localStorage.getItem('notes')))
  }
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
  return new Promise(resolve => socket.emit("signIn", pass, data => {
    if (data == null) {
      resolve(false)
    } else {
      localStorage.setItem('token', data.token)
      resolve(true)
    }
  }))
}
export async function authValidity() {
  return new Promise(resolve => socket.emit("authVerify", localStorage.getItem('token'), data => {
    if (data.signOut == true) {
      localStorage.removeItem('login')
      resolve(false)
    } else {
      resolve(true)
    }
  }))
}
