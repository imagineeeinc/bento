<script>
  export let title = ""
  export let text = " "
  export let uid = null

  import { onMount } from 'svelte'
  import * as TinyMDE from 'tiny-markdown-editor'
  import { navigate } from 'svelte-routing'
  import 'tiny-markdown-editor/dist/tiny-mde.css'
  import { newNote, updateNote, delNote, getUidNote, editing } from '$lib/components/store'

  var tinyMDE
  function update() {
    if (tinyMDE.getContent() != '') {
      if (uid === null) {
        uid = newNote(tinyMDE.getContent(), title)
      } else {
        updateNote(uid, tinyMDE.getContent(), title)
      }
    } else {
      if (uid !== null) {
        //TODO: move the deleting note to on close of window
        delNote(uid)
        uid = null
      }
    }
  }
  function deleteThisNote() {
    let ask = confirm("Are you sure you want to delete this Note?")
    if (ask) {
      delNote(uid)
      navigate("/")
    }
  }
  onMount(()=>{
    editing.subscribe((id)=>{
      uid=id
    })

    tinyMDE = new TinyMDE.Editor({ element: 'editor-box' })

    if (uid == null) {
      text = "*starts typing*"
    } else {
      let note = getUidNote(uid)
      text = note.data
      title = note.title
    }
    tinyMDE.setContent(text)
    tinyMDE.addEventListener('change', update)
  })
</script>
<div id="editor-container">
  <button id="close-btn" class="m-icon big" on:click={()=>navigate("/")}>close</button>
  <input type="text" bind:value={title} placeholder="title" on:change={update} id="title-box">
  <div id="editor-box"></div>
  <div id="editor-toolbar">
    <button id="new" class="m-icon" on:click={deleteThisNote}>delete</button>
  </div>
</div>
<style>
  #editor-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: var(--bg);
    z-index: 10;
    overflow-y: hidden;
  }
  #editor-box {
    position: absolute;
    top: 74px;
    width: 100%;
    height: calc(100% - 74px);
  }
  #editor-toolbar {
    background: var(--secondary);
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 46px;
    padding: 5px;

    display: grid;
    align-items: center;
    justify-content: center;
  }
  :global(.TinyMDE) {
    background-color: var(--bg) !important;
    color: var(--color) !important;
    height: calc(100% - 84px);
    overflow-y: auto;
  }
  #editor-box {
    height: 100%;
  }
  #close-btn {
    position: fixed;
    top: 10px;
    left: 10px;
    z-index: 10;
  }
  #title-box {
    position: absolute;
    right: 10px;
    top: 10px;
    width: calc(100% - 104px);
  }
</style>
