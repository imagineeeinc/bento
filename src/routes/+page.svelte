<script>
  import Editor from '#lib/components/editor.svelte';
  import Menu from '#lib/components/menu.svelte';
  import Settings from '#lib/components/settings.svelte';
  import About from '#lib/components/about.svelte';
  import Search, { searchTerm } from '#lib/components/search.svelte';
  import Grid from '#lib/components/grid.svelte';
  import { newNoteId } from '../lib/components/store';
  import SvelteMarkdown from 'svelte-markdown';
  import { fade } from 'svelte/transition';
  import Router, { push, replace } from 'svelte-spa-router';
  import { browser } from '$app/env';
  import { slide } from 'svelte/transition';
  // import { version, dev } from '$app/environment';
  function newNote() {
    push(`/editor/${newNoteId()}`);
  }
  function openMenu() {
    menuOpened = true;
    push('/menu');
  }
  let animtion = { fn: fade, duration: 200 };
  let menuOpened = false;
  let searchMenuOpened = false;

  if (browser) {
    searchTerm.subscribe((val) => {
      if (val != '' && searchMenuOpened == false) {
        push('/search');
        searchMenuOpened = true;
        document.getElementById('searchbar').focus();
      } else if (val == '' && searchMenuOpened == true) {
        replace('/');
        searchMenuOpened = false;
        document.getElementById('searchbar').focus();
      }
    });
  }
  let url = '';
  const routes = {
    '/editor/:uid': Editor,
    '/menu': Menu,
    '/settings': Settings,
    '/about': About,
    '/search': Search,
    '/tags/:tag': Grid
  };
</script>

<nav>
  <button id="menu-btn" class="m-icon big" on:click={openMenu}>menu</button>

  <input type="search" id="searchbar" placeholder="Search your notes" bind:value={$searchTerm} />
</nav>
<!-- {#if $searchterm != ""} -->
<!--   <search></search> -->
<!-- {/if} -->
<Grid tag="" />
<button id="new" class="m-icon big" on:click={newNote}>add</button>
<Router {routes}>
  <!-- <Route path="editor/:uid" let:params><Editor uid="{params.uid}"/></Route>
  <Route path="menu"><Menu transition={slide} /></Route>
  <Route path="settings"><Settings /></Route>
  <Route path="about"><About /></Route>
  <Route path="search"><Search /></Route>
  <Route path="tags/:tag" let:params><Grid tag="{params.tag}"/></Route> -->
</Router>

<style>
  #new {
    position: fixed;
    bottom: 15px;
    right: 15px;
    z-index: 10;
    color: var(--bg-100);
    background: var(--accent);
    outline: none;
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
    background: linear-gradient(var(--bg-100) 10%, transparent);
  }
  #searchbar {
    width: calc(100%);
    height: 54px;
    padding: 20px;
  }
  #searchbar,
  #menu-btn {
    background: var(--bg-50);
    outline: 3px solid var(--bg-100);
  }
  #searchbar:hover,
  #searchbar:focus-visible,
  #menu-btn:hover,
  #menu-btn:focus-visible {
    background: var(--bg-100);
    outline: 3px solid var(--bg-400);
  }
  #new:hover,
  #new:focus-visible {
    background: var(--secondary);
  }
  :global(.note-box img) {
    max-width: 90%;
    border-radius: 5px;
    display: block;
    margin: 0 auto;
  }
</style>
