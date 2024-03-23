<script>
  import Editor from '$lib/components/editor.svelte'
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
  let animtion = { fn: fade, duration: 200 }
</script>
<button id="menu-btn" class="m-icon big">menu</button>
<input type="search" id="searcbar" placeholder="Search your notes">
<div id="notes-grid">
  {#each $notes as note}
    <div id="note-box" on:click={()=>editNow(note.uid)}>
      <h3>{note.title}</h3>
      <SvelteMarkdown source={note.data} />
    </div>
  {/each}
</div>
<Router>
  <Route path="editor" component={Editor} />
</Router>
<button id="new" class="m-icon big" on:click={newNote}>add</button>
<style>
  #new {
    position: fixed;
    bottom: 20px;
    right: 20px;
  }
  #menu-btn {
    position: fixed;
    top: 10px;
    left: 10px;
  }
  #searcbar {
    position: fixed;
    top: 10px;
    right: 10px;
    width: calc(100% - 84px);
    height: 54px;
    padding: 20px;
  }
  #notes-grid {
    position: absolute;
    top: 74px;
    height: calc(100vh - 74px);
    width: 100%;
    overflow-y: auto;

    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    gap: 20px;
  }
  #note-box {
    --offset: 40px;
    font-size: 15px;
    padding: 10px;
    background: var(--secondary);
    border-radius: 10px;
    cursor: pointer;
    width: calc(25vw - var(--offset));
  }
  @media (max-width: 1000px) {
    #note-box {
      width: calc(50vw - var(--offset));
    }
  }
  @media (max-width: 400px) {
    #note-box {
      width: calc(100vw - var(--offset));
    }
  }
  #note-box > h3 {
    margin: 0;
  }
  :global(#note-box > p > img) {
    width: 100%;
    border-radius: 10px;
  }
</style>
