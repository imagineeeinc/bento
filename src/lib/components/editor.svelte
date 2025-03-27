<script>
  export let title = ""
  export let text = " "
  export let archive = false
  export let pin = false
  export let uid = null
  // mode: 1=edit, 0=view only
  export let mode = 1
  export let back = '/'

  import { onMount, createEventDispatcher } from 'svelte'
  import * as TinyMDE from 'tiny-markdown-editor'
  import { navigate } from 'svelte-routing'
  import 'tiny-markdown-editor/dist/tiny-mde.css'
  import SvelteMarkdown from 'svelte-markdown'
  import { sendFile } from '$lib/components/images.js'
  import { newNote, updateNote, delNote, getUidNote, settings } from '$lib/components/store'
  import { get, writable } from 'svelte/store'
  import TagsEditor from '$lib/components/tagsEditor.svelte'

  const dispatch = createEventDispatcher()
  var tinyMDE
  function update() {
    if (tinyMDE.getContent() != '') {
      if (uid === null || uid == "null") {
        uid = newNote(tinyMDE.getContent(), title)
        navigate(`/editor/${uid}`)
      } else {
        updateNote(uid, tinyMDE.getContent(), title, archive, pin)
      }
      text = tinyMDE.getContent()
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
      window.history.back()
    }
  }
  function swapViewMode() {mode = mode == 0 ? 1 : 0}
  let pickImage = false
  function addImage() {
    let blackhole = get(settings).blackhole
    if (blackhole == '' || blackhole == null || blackhole == undefined) {
      alert("Please add a blackhole image upload intergration url.")
    } else {
      let imagePicker = document.getElementById('image-picker')
      pickImage = true
      imagePicker.click()
    }
  }
  async function imagePicked() {
    if (pickImage == true) {
      pickImage = false
      let imageUrl = await sendFile(get(settings).blackhole, document.getElementById('image-picker').files[0])
      tinyMDE.setContent(tinyMDE.getContent() + `\n![](${imageUrl})`)
    }
  }
  onMount(()=>{
    tinyMDE = new TinyMDE.Editor({ element: 'editor-box' })

    if (uid == null || uid == "null") {
      text = ""
    } else {
      let note = getUidNote(uid)
      text = note.data
      title = note.title
      archive = note.archive || false
      pin = note.pin || false
    }
    tinyMDE.setContent(text)
    tinyMDE.addEventListener('change', update)
  })
  let tagEditor = writable(false)
</script>
<input id="image-picker" style="display: none;" type="file" accept="image/*" multiple="false" on:change={imagePicked}>
<div id="editor-container">
  <button id="close-btn" class="m-icon big" on:click={()=>navigate(back)}>close</button>
  <input type="text" bind:value={title} placeholder="title" on:change={update} id="title-box">
  <div id="editor-box" class="{mode == 0?'hide':''}"></div>
  {#if mode == 0}
    <div id="preview-box">
      <SvelteMarkdown source={text} />
    </div>
  {/if}
  <div id="editor-toolbar">
    <button class="m-icon transparent" on:click={deleteThisNote}>delete</button>
    <button class="m-icon transparent" on:click={swapViewMode}>edit_note</button>
    <!-- <button class="m-icon transparent" on:click={addImage}>add_a_photo</button> -->
    <button class="m-icon transparent" on:click={()=>{archive=!archive;update()}}>
      {#if archive}
        unarchive
      {:else}
        archive
      {/if}
    </button>
    {#if uid !== 'null'}
      <button class="m-icon transparent" on:click={()=>tagEditor.set(!$tagEditor)}>label</button>
    {/if}
    <button class="m-icon transparent" on:click={()=>{pin=!pin;update()}}>
      {#if pin}
        keep_off
      {:else}
        keep
      {/if}
    </button>
  </div>
</div>
{#if $tagEditor}
  <TagsEditor uid={uid} tagEditor={tagEditor} />
{/if}
<style>
  #editor-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: var(--bg);
    z-index: 200;
    overflow-y: hidden;
  }
  #editor-box {
    position: absolute;
    top: 74px;
    width: 100%;
  }
  #preview-box {
    position: absolute;
    top: 74px;
    width: 100%;
    height: calc(100% - 149px);
    padding: 10px;
    overflow-y: auto;
  }
  :global(#preview-box img) {
    max-width: 90%;
    border-radius: 5px;
  }
  #editor-toolbar {
    background: var(--bg);
    position: fixed;
    bottom: 0;
    left: 0;
    width: calc(100% - 10px);
    height: 56px;
    padding: 5px 10px;

    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    gap: 5px;
    overflow-x: auto;
  }
  #editor-toolbar::-webkit-scrollbar {
    display: none;
  }
  :global(.TinyMDE) {
    background-color: var(--bg) !important;
    color: var(--color) !important;
    height: calc(100% - 149px);
    overflow-y: auto;
  }
  .hide {
    display: none;
  }
  #editor-box {
    height: 100%;
  }
  #close-btn {
    position: fixed;
    top: 5px;
    left: 5px;
    z-index: 10;
  }
  #title-box {
    position: absolute;
    right: 10px;
    top: 5px;
    width: calc(100% - 114px);
  }
</style>
