<script>
  import { get, writable } from 'svelte/store'
  let title = writable("")
  let text = writable("")
  let archive = $state(false)
  let pin = $state(false)
  let { uid } = $props()
  // mode: 1=edit, 0=view only
  let mode = $state(1)
  let back = '/'

  import { onMount } from 'svelte'
  import { navigate } from 'svelte-routing'
  import SvelteMarkdown from 'svelte-markdown'
  import { sendFile } from '$lib/components/images.js'
  import { newNote, updateNote, delNote, getUidNote, settings } from '$lib/components/store'
  import TagsEditor from '$lib/components/tagsEditor.svelte'

  function update() {
    if (text != '') {
      if (uid === null || uid == "null") {
        // uid = newNote(tinyMDE.getContent(), title)
        navigate(`/editor/${uid}`)
      } else {
        updateNote(uid, get(text), get(title), archive, pin)
      }
    } else {
      if (uid !== null) {
        //TODO: move the deleting note to on close of window
        delNote(uid)
        // uid = null
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
      // add image`\n![](${imageUrl})`
    }
  }
  onMount(()=>{
    if (uid == null || uid == "null") {
      text = ""
    } else {
      let note = getUidNote(uid)
      text.set(note.data)
      title.set(note.title)
      archive = note.archive || false
      pin = note.pin || false
    }
/*     text.subscribe(() => {
      update()
    }) */
  })
  let tagEditor = writable(false)
</script>
<input id="image-picker" style="display: none;" type="file" accept="image/*" multiple="false" onchange={imagePicked}>
<div id="editor-container">
  <div id="editor-topbar">
    <button id="close-btn" class="m-icon transparent" onclick={()=>navigate(back)}>arrow_back</button>
    <div id="topbar-right">
      <button class="m-icon transparent" onclick={()=>{pin=!pin;update()}}>
        {#if pin}
          keep_off
        {:else}
          keep
        {/if}
      </button>
      <button class="m-icon transparent" onclick={()=>{archive=!archive;update()}}>
      {#if archive}
        unarchive
      {:else}
        archive
      {/if}
    </button>
    </div>
  </div>
  <div id="editing-box">
    <input type="text" bind:value={$title} placeholder="Title" onchange={update} oninput={update} id="title-box">
    <textarea id="editor-box" class="{mode == 0?'hide':''}" placeholder="note..." bind:value={$text} onchange={update} oninput={update}></textarea>
    {#if mode == 0}
      <div id="preview-box">
        <SvelteMarkdown source={text} />
      </div>
    {/if}
  </div>
  <div id="editor-toolbar">
    <button class="m-icon transparent" onclick={deleteThisNote}>delete</button>
    <button class="m-icon transparent" onclick={swapViewMode}>edit_note</button>
    <!-- <button class="m-icon transparent" on:click={addImage}>add_a_photo</button> -->
    
    {#if uid !== 'null'}
      <button class="m-icon transparent" onclick={()=>tagEditor.set(!$tagEditor)}>label</button>
    {/if}
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
  #editor-topbar {
    position: fixed;
    top: 0;
    width: calc(100% - 2ch);
    padding: 5px 1ch;
  }
  #topbar-right {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: center;
    justify-content: flex-end;
    gap: .25ch;
  }
  #editing-box {
    position: fixed;
    top: 69px;
    width: 100%;
    height: calc(100% - 135px);
    overflow-y: auto;

    display: flex;
    flex-direction: column;
  }
  #editor-box {
    display: block;
    width: calc(100% - 40px);
    height: calc(100% - var(--width) - 40px);
    outline: none;
    resize: none;
    margin: 0;
    overflow: auto;
    padding: 20px;
  }
  #preview-box {
    position: absolute;
    top: 74px;
    width: 100%;
    height: calc(100% - 149px);
    padding: 1ch;
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
    width: calc(100% - 20px);
    height: 56px;
    padding: 5px 1ch;

    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    gap: .25ch;
    overflow-x: auto;
  }
  #editor-toolbar::after {
    content: "";
    position: fixed;
    bottom: 0;
    right: 0;
    width: 40px;
    height: 56px;
    background: linear-gradient(90deg, transparent, var(--bg));
  }
  #editor-toolbar::-webkit-scrollbar {
    display: none;
  }
  .hide {
    display: none;
  }
  #close-btn {
    position: fixed;
    top: 5px;
    left: 5px;
    z-index: 10;
  }
  #title-box {
    width: calc(100% - 40px);
    outline: none;
    font-size: x-large;
    margin: 0;
    padding: 20px;
  }
</style>
