<script>
  import Editor from '$lib/components/editor.svelte'
  import Menu from '../lib/components/menu.svelte'
  import Settings from '../lib/components/settings.svelte'
  import SvelteMarkdown from 'svelte-markdown'
  import { fade } from 'svelte/transition'
  import { Router, Route, navigate } from 'svelte-routing'
  import { notes, editing } from '$lib/components/store'

  function newNote() {
    editing.set(null)
    navigate('editor')
  }
  function editNow(uid) {
    editing.set(uid)
    navigate('editor')
  }
  function openMenu() {
    menuOpened = true
    navigate('menu')
  }
  let animtion = { fn: fade, duration: 200 }
  let menuOpened = false
</script>
<button id="menu-btn" class="m-icon big" on:click={openMenu}>menu</button>
<input type="search" id="searcbar" placeholder="Search your notes">
<div id="notes-grid">
  {#each $notes as note}
    <div class="note-box" on:click={()=>editNow(note.uid)}>
      <h3>{note.title}</h3>
      <SvelteMarkdown source={note.data} />
    </div>
  {/each}
</div>
<button id="new" class="m-icon big" on:click={newNote}>add</button>
<Router>
  <Route path="editor" component={Editor} />
  <Route path="menu" component={Menu} />
  <Route path="settings" component={Settings} />
</Router>
<style>
  #new {
    position: fixed;
    bottom: 15px;
    right: 15px;
  }
  #menu-btn {
    position: fixed;
    top: 5px;
    left: 5px;
    z-index: 10;
  }
  #searcbar {
    position: fixed;
    top: 5px;
    right: 20px;
    width: calc(100% - 109px);
    height: 54px;
    padding: 20px;
    z-index: 10;
  }
  #notes-grid {
    position: absolute;
    top: 0;
    left: 0;
    padding-top: 74px;
    height: calc(100vh - 74px);
    width: 100%;
    overflow-y: auto;

    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    align-content: flex-start;
    gap: 20px;
  }
  .note-box {
    --offset: 50px;
    font-size: 15px;
    padding: 10px;
    background: var(--secondary);
    border-radius: 10px;
    cursor: pointer;
    width: calc(25vw - var(--offset));
    max-height: 100vh;
    overflow-y: hidden;
  }
  @media (max-width: 1000px) {
    .note-box {
      width: calc(50vw - var(--offset));
    }
  }
  @media (max-width: 400px) {
    .note-box {
      width: calc(100vw - var(--offset));
    }
  }
  .note-box > h3 {
    margin: 0;
  }
  :global(.note-box > p > img) {
    max-width: 100%;
    border-radius: 5px;
  }
</style>
