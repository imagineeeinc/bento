import { writable, get } from 'svelte/store'
import { browser } from '$app/environment'

/*
format:
{
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

export function newNote(text) {
  let uid = crypto.randomUUID()
  notes.update((list) => {
    list.push(
      {
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

export function updateNote(uid,text) {
  notes.update((list) => {
    let i = null
    let note = list.find((data, index) => {
      if (data.uid === uid) {
        i = index
        return true
      }
    })
    note.data = text
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
  if (localStorage.getItem('notes') !== undefined) {
    notes.set(JSON.parse(localStorage.getItem('notes')))
  }
  notes.subscribe((data) => {
    localStorage.setItem('notes', JSON.stringify(data))
  })
}

// Editor State
export let editing = writable(null)
