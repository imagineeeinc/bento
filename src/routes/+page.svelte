<script>
  import Editor from '$lib/components/editor.svelte'
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
<h1>Welcome to Bento 🍱</h1>
<p>Minimlist Self Hosted Notes.</p>
<!--{#if editing == true}
  <Editor text="" {uid}></Editor>
{/if}-->
<p>
  {#each $notes as note}
    <div on:click={()=>editNow(note.uid)}>{note.data}</div>
  {/each}
</p>
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
    left: 74px;
    width: calc(100% - 84px);
    height: 54px;
    padding: 20px;
  }
</style>
