<script>
  let { params = {} } = $props();
  import { tick } from 'svelte';
  import { get, writable } from 'svelte/store';
  let title = writable('');
  let text = writable('');
  let archive = $state(false);
  let pin = $state(false);
  let uid = params.uid;
  let editing = $state(true);
  let editPosition = $state(null);
  let charCount = $state(0);
  let lineCount = $state(0);
  let wordCount = $state(0);

  import { onMount } from 'svelte';
  import { pop } from 'svelte-spa-router';
  import SvelteMarkdown from 'svelte-markdown';
  import { sendFile } from '#lib/components/images.js';
  import { newNote, updateNote, delNote, getUidNote, settings } from '#lib/components/store.js';
  import TagsEditor from '#lib/components/tagsEditor.svelte';
  import { createHotkey } from '@tanstack/svelte-hotkeys';
  import { fade } from 'svelte/transition';

  import Link from '#lib/components/renderer/Link.svelte';

  function stats() {
    charCount = $text.length;
    lineCount = $text === '' ? 0 : $text.split(/\r\n|\r|\n/).length;
    wordCount = $text.trim() === '' ? 0 : $text.trim().split(/\s+/).length;
  }
  function update() {
    if ($text == '' && $title == '') {
      if (uid !== null) {
        //TODO: move the deleting note to on close of window
        delNote(uid);
        // uid = null
      }
    } else {
      updateNote(uid, get(text), get(title), archive, pin, editing, editPosition);
      stats();
    }
  }
  async function focusLocation() {
    await tick();
    if (typeof editPosition === 'number') {
      console.log(editPosition);
      document.getElementById('editor-box').focus();
      document.getElementById('editor-box').setSelectionRange(editPosition, editPosition);
    } else {
      document.getElementById('editor-box').focus();
    }
  }
  function titleUpdate(e) {
    if (e.key == 'Enter') {
      document.getElementById('editor-box').focus();
    }
  }
  function editorKeyPressed(e) {
    let pos = document.getElementById('editor-box').selectionStart;
    if (e.key == 'Enter') {
      let editor = document.getElementById('editor-box');
      let value = editor.value;
      let lineTillNow = value.substr(0, pos).split('\n');
      let curLine = lineTillNow[lineTillNow.length - 1];
      if (curLine.endsWith('- ')) {
        e.preventDefault();
        let sections = curLine.split('-');
        editor.value =
          value.substr(0, pos - (2 + (sections.length > 1 ? sections[0].length : 0))) +
          value.substr(pos);
        editor.selectionStart =
          editor.selectionEnd =
          pos =
            pos - (2 + (sections.length > 1 ? sections[0].length : 0));
      } else if (curLine.startsWith('- ')) {
        e.preventDefault();
        editor.value = value.substr(0, pos) + '\n- ' + value.substr(pos);
        editor.selectionStart = editor.selectionEnd = pos = pos + 3;
        update();
      } else if (curLine.trim().startsWith('- ')) {
        e.preventDefault();
        let sections = curLine.split('-');
        editor.value = value.substr(0, pos) + '\n' + sections[0] + '- ' + value.substr(pos);
        editor.selectionstart = editor.selectionend = pos = pos + sections[0].length + 3;
      }
    }
    editPosition = pos;
  }
  function editorKeyDown(e) {
    if (e.key == 'Tab' && !e.ctrlKey) {
      e.preventDefault();
      let editor = document.getElementById('editor-box');
      let value = editor.value;
      let pos = editor.selectionStart;
      let lineTillNow = value.substr(0, pos).split('\n');
      let curLine = lineTillNow[lineTillNow.length - 1];
      if (e.shiftKey) {
        if (curLine.startsWith('  ')) {
          editor.value =
            value.substr(0, pos - curLine.length) + curLine.substr(2) + value.substr(pos);
          editor.selectionStart = editor.selectionEnd = pos - 2;
        }
      } else {
        editor.value = value.substr(0, pos - curLine.length) + '  ' + curLine + value.substr(pos);
        editor.selectionStart = editor.selectionEnd = pos + 2;
      }
    }
  }
  function deleteThisNote() {
    let ask = confirm('Are you sure you want to delete this Note?');
    if (ask) {
      delNote(uid);
      window.history.back();
    }
  }
  function swapViewMode(edit) {
    if (typeof edit === 'boolean') {
      editing = edit;
    } else {
      editing = !editing;
    }
    update();
    if (editing == true) {
      focusLocation();
    }
  }
  let pickImage = false;
  function addImage() {
    let blackhole = get(settings).blackhole;
    if (blackhole == '' || blackhole == null || blackhole == undefined) {
      alert('Please add a blackhole image upload intergration url.');
    } else {
      let imagePicker = document.getElementById('image-picker');
      pickImage = true;
      imagePicker.click();
    }
  }
  async function imagePicked() {
    if (pickImage == true) {
      pickImage = false;
      let imageUrl = await sendFile(
        get(settings).blackhole,
        document.getElementById('image-picker').files[0]
      );
      // add image`\n![](${imageUrl})`
    }
  }
  onMount(() => {
    if (uid == null || uid == 'null') {
      text = '';
      document.getElementById('title-box').focus();
    } else {
      let note = getUidNote(uid);
      text.set(note.data);
      title.set(note.title);
      if (note.clientArgs.editing == undefined) {
        note.clientArgs.editing = true;
      }
      editing = note.clientArgs.editing;
      archive = note.archive || false;
      pin = note.pin || false;
      editPosition = note.clientArgs.lastPosition;
      if (note.title == '') {
        document.getElementById('title-box').focus();
      } else if (editing == true) {
        focusLocation();
        // scroll bottom
        document.getElementById('editing-box').scrollTop =
          document.getElementById('editor-box').scrollHeight;
      }
      stats();
    }
  });
  let tagEditor = writable(false);

  createHotkey('i', () => {
    swapViewMode(true);
  });
  createHotkey('Mod+I', () => {
    swapViewMode();
  });
</script>

<div id="editor-container" transition:fade>
  <input
    id="image-picker"
    style="display: none;"
    type="file"
    accept="image/*"
    multiple="false"
    onchange={imagePicked}
  />
  <div id="editor-topbar">
    <button id="close-btn" class="m-icon transparent" onclick={() => pop()} title="Back"
      >arrow_back</button
    >
    <div id="topbar-right" class="hori-button-bar-100">
      <button
        class="m-icon transparent"
        class:dimmed={pin}
        onclick={() => {
          pin = !pin;
          update();
        }}
        title="Pin this note"
      >
        {#if pin}
          keep_off
        {:else}
          keep
        {/if}
      </button>
      <button
        class="m-icon transparent"
        class:dimmed={archive}
        onclick={() => {
          archive = !archive;
          update();
        }}
        title="Archive this note"
      >
        {#if archive}
          unarchive
        {:else}
          archive
        {/if}
      </button>
    </div>
  </div>
  <div id="editing-box">
    <input
      type="text"
      bind:value={$title}
      placeholder="Title"
      onchange={update}
      oninput={update}
      onkeyup={titleUpdate}
      id="title-box"
      disabled={editing == false}
    />
    {#if editing == true}
      <textarea
        id="editor-box"
        placeholder="note..."
        bind:value={$text}
        onchange={update}
        oninput={update}
        onkeypress={editorKeyPressed}
        onkeydown={editorKeyDown}
        spellcheck="true"></textarea>
    {:else}
      <div id="preview-box">
        <SvelteMarkdown
          source={$text}
          renderers={{
            link: Link
          }}
        />
      </div>
    {/if}
  </div>
  <div id="editor-toolbar" class="hori-button-bar-100">
    <button class="m-icon" onclick={deleteThisNote} title="Delete this note">delete</button>
    <button
      class="m-icon"
      onclick={swapViewMode}
      title="Switch between edit and view mode (Ctrl+I)"
    >
      {#if editing == false}
        edit
      {:else}
        two_pager
      {/if}
    </button>
    <!-- <button class="m-icon transparent" on:click={addImage}>add_a_photo</button> -->
    {#if uid !== 'null'}
      <button
        class="m-icon transparent"
        onclick={() => tagEditor.set(!$tagEditor)}
        title="Add a tag to this note">label</button
      >
    {/if}
  </div>
</div>
{#if $tagEditor}
  <TagsEditor {uid} {tagEditor} />
{/if}

<style>
  #editor-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: var(--bg-100);
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
    gap: 0.25ch;
  }
  #editing-box {
    position: fixed;
    top: 69px;
    width: 100%;
    height: calc(100% - 135px);
    overflow-y: hidden;

    display: flex;
    flex-direction: column;
  }
  #editor-box {
    display: block;
    width: calc(100% - 4ch);
    height: calc(100% - var(--width) - 2ch);
    outline: none;
    resize: none;
    margin: 0;
    overflow: auto;
    padding: 0.5ch 2ch;
  }
  #preview-box {
    width: calc(100% - 4ch);
    height: calc(100% - var(--width) - 40px);
    padding: 0.5ch 2ch;
    overflow-y: auto;
  }
  :global(#preview-box img) {
    max-width: 90%;
    border-radius: 5px;
  }
  #editor-toolbar {
    background: var(--bg-100);
    position: fixed;
    bottom: 0;
    left: 0;
    width: calc(100% - 20px);
    height: 56px;
    padding: 5px 1ch;

    overflow-x: auto;
  }
  #editor-toolbar::after {
    content: '';
    position: fixed;
    bottom: 0;
    right: 0;
    width: 40px;
    height: 56px;
    background: linear-gradient(90deg, transparent, var(--bg-100));
  }
  #editor-toolbar::-webkit-scrollbar {
    display: none;
  }
  #close-btn {
    position: fixed;
    top: 5px;
    left: 5px;
    z-index: 10;
  }
  #title-box {
    width: calc(100% - 2em);
    outline: none;
    font-size: x-large;
    margin: 0;
    padding: 0.5ch 1em;
  }
</style>
