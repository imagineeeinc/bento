<script>
  import Editor from '$lib/components/editor.svelte'
  import Menu from '$lib/components/menu.svelte'
  import Settings from '$lib/components/settings.svelte'
  import About from '$lib/components/about.svelte'
  import Search, { searchTerm } from '$lib/components/search.svelte'
  import Password from '$lib/components/password.svelte'
  import Grid from '$lib/components/grid.svelte'
  import SvelteMarkdown from 'svelte-markdown'
  import { fade } from 'svelte/transition'
  import { Router, Route, navigate } from 'svelte-routing'
  import { authValidity } from '$lib/components/store'
  import { browser } from '$app/environment'
  import { onMount } from 'svelte'

  function newNote() {
    navigate('/editor/null')
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
    onMount(async () => {
      if (!(await authValidity())) {
        navigate('/login')
      }
    })
  }
</script>
<button id="menu-btn" class="m-icon big" on:click={openMenu}>menu</button>
<input type="search" id="searchbar" placeholder="Search your notes" bind:value={$searchTerm}>
<!-- {#if $searchTerm != ""} -->
<!--   <Search></Search> -->
<!-- {/if} -->
<Grid tag=""></Grid>
<button id="new" class="m-icon big" on:click={newNote}>add</button>
<Router>
  <Route path="editor/:uid" component={Editor} />
  <Route path="menu" component={Menu} />
  <Route path="settings" component={Settings} />
  <Route path="about" component={About} />
  <Route path="search" component={Search} />
  <Route path="login" component={Password} />
  <Route path="tags/:tag" component={Grid} />
</Router>
<style>
  #new {
    position: fixed;
    bottom: 15px;
    right: 15px;
    z-index: 10;
  }
  #menu-btn {
    position: fixed;
    top: 5px;
    left: 5px;
    z-index: 10;
  }
  #searchbar {
    position: fixed;
    top: 5px;
    right: 20px;
    width: calc(100% - 109px);
    height: 54px;
    padding: 20px;
    z-index: 10;
    outline: 3px solid var(--secondary);
  }
  #searchbar:hover, #searchbar:focus-visible {
    outline: 3px solid var(--accent);
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
  :global(.note-box img) {
    max-width: 90%;
    border-radius: 5px;
    display: block;
    margin: 0 auto;
  }
</style>
