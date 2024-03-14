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
    delete list[i]
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
if (browser) {
  if (localStorage.getItem('notes') !== undefined &&
  localStorage.getItem('notes') != "" &&
  localStorage.getItem('notes') !== null) {
    notes.set(JSON.parse(localStorage.getItem('notes')))
  }
  notes.subscribe((data) => {
    localStorage.setItem('notes', JSON.stringify(data))
  })
}

// Editor State
export let editing = writable(null)
