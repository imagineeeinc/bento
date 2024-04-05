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
        owner: "Bento Client",
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
    let note = list.find((data, index) => {
      if (data.uid === uid) {
        i = index
        return true
      }
    })
    note.data = text
    note.title = title
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
    list.splice(i, 1)
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
if (browser) {
  // Check if 
  if (localStorage.getItem('notes') !== undefined &&
  localStorage.getItem('notes') != "" &&
  localStorage.getItem('notes') !== null) {
    notes.set(JSON.parse(localStorage.getItem('notes')))
  }
  // Get latest from server
	let res = await fetch('/api/v1/sync', {
    method: "GET"
	})
  res = await res.json()
  notes.set(res)
  // Update on change
  notes.subscribe((data) => {
    localStorage.setItem('notes', JSON.stringify(data))
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
    }, 1000)
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
  settings.subscribe((data) => {
    localStorage.setItem('settings', JSON.stringify(data))
  })
}

//TODO: add server sync