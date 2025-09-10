<script>
  import Editor from '$lib/components/editor.svelte'
  import Menu from '$lib/components/menu.svelte'
  import Settings from '$lib/components/settings.svelte'
  import About from '$lib/components/about.svelte'
  import Search, { searchTerm } from '$lib/components/search.svelte'
  import Grid from '$lib/components/grid.svelte'
  import { newNoteId } from '../lib/components/store'
  import SvelteMarkdown from 'svelte-markdown'
  import { fade } from 'svelte/transition'
  import { Router, Route, navigate } from 'svelte-routing'
  import { browser } from '$app/environment'
  import { onMount } from 'svelte'
  import { slide } from 'svelte/transition'
  function newNote() {
    navigate(`/editor/${newNoteId()}`)
  }
  function openMenu() {
    menuOpened = true
    navigate('/menu')
  }
  let animtion = { fn: fade, duration: 200 }
  let menuOpened = false
  let searchMenuOpened = false

  if (browser) {
    searchTerm.subscribe(val=>{
      if (val != "" && searchMenuOpened == false) {
        navigate('/search')
        searchMenuOpened = true
        document.getElementById("searchbar").focus()
      } else if (val == "" && searchMenuOpened == true){
        navigate('/')
        searchMenuOpened = false
        document.getElementById("searchbar").focus()
      }
    })
  }
  let url = ''
</script>
<nav>
  <button id="menu-btn" class="m-icon big" on:click={openMenu}>menu</button>
  <input type="search" id="searchbar" placeholder="Search your notes" bind:value={$searchTerm}>
</nav>
<!-- {#if $searchterm != ""} -->
<!--   <search></search> -->
<!-- {/if} -->
<Grid tag=""></Grid>
<button id="new" class="m-icon big" on:click={newNote}>add</button>
<Router {url}>
  <Route path="editor/:uid" let:params><Editor uid="{params.uid}"/></Route>
  <Route path="menu"><Menu transition={slide} /></Route>
  <Route path="settings"><Settings /></Route>
  <Route path="about"><About /></Route>
  <Route path="search"><Search /></Route>
  <Route path="tags/:tag" let:params><Grid tag="{params.tag}"/></Route>
</Router>
<style>
  #new {
    position: fixed;
    bottom: 15px;
    right: 15px;
    z-index: 10;
    background: var(--secondary-transperent);
    outline: 3px solid var(--secondary-transperent);
    backdrop-filter: blur(20px);
  }
  #new:hover, #new:focus-visible {
      outline: 3px solid var(--accent);
  }
  nav {
    position: fixed;
    top: 0;
    left: 0;
    width: calc(100% - 2ch);
    padding: 5px 1ch;
    z-index: 10;
    display: flex;
    flex-direction: row;
    gap: 1ch;
    background: var(--bg);
  }
  #menu-btn {
    background: var(--secondary-transperent);
    outline: 3px solid var(--secondary-transperent);
    backdrop-filter: blur(20px);
  }
  #menu-btn:hover, #menu-btn:focus-visible {
    outline: 3px solid var(--accent);
  }
  #searchbar {
    width: calc(100%);
    height: 54px;
    padding: 20px;
    background: var(--secondary-transperent);
    outline: 3px solid var(--secondary-transperent);
    backdrop-filter: blur(20px);
  }
  #searchbar:hover, #searchbar:focus-visible {
    outline: 3px solid var(--accent);
  }
  :global(.note-box img) {
    max-width: 90%;
    border-radius: 5px;
    display: block;
    margin: 0 auto;
  }
</style>
