<script>
  export let text = " "
  export let uid = null

  import { onMount } from 'svelte'
  import * as TinyMDE from 'tiny-markdown-editor'
  import 'tiny-markdown-editor/dist/tiny-mde.css'
  import { newNote, updateNote, delNote, getUidNote, editing } from '$lib/components/store'
  onMount(()=>{
    editing.subscribe((id)=>{
      uid=id
    })

    var tinyMDE = new TinyMDE.Editor({ textarea: 'editor-box' })

    if (uid == null) {
      text = "*starts typing*"
    } else {
      text = getUidNote(uid).data
    }
    tinyMDE.setContent(text)
    tinyMDE.addEventListener('change', () => {
      if (tinyMDE.getContent() != '') {
        if (uid === null) {
          uid = newNote(tinyMDE.getContent())
        } else {
          updateNote(uid, tinyMDE.getContent())
        }
      } else {
        if (uid !== null) {
          //TODO: move the deleting note to on closr of window
          delNote(uid)
          uid = null
        }
      }
    })
  })
</script>
<div id="editor-container">
  <textarea id="editor-box">*starts typing*</textarea>
</div>
<style>
#editor-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vh;
  height: 100%;
  background: var(--bg);
  z-index: 10;
  overflow-y: scroll;
}
.TinyMDE {
  background-color: var(--bg) !important;
  color: var(--color) !important;
  height: 100%;
  overflow-y: scroll;
}
textarea {
  background: var(--bg) !important;
}
#editor-box {
  height: 100%;
}
</style>
