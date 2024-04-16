<script context="module">
	export var searchTerm = writable("")
</script>
<script>
	import { get, writable } from 'svelte/store'
	import { onMount } from 'svelte';
	import lunr from 'lunr'
	import SvelteMarkdown from 'svelte-markdown'
	import { notes, getUidNote, editing } from '$lib/components/store'
	import { navigate } from 'svelte-routing'

	var idx
	let res = []

	onMount(()=>{
		idx = lunr(function () {
			this.ref('uid')
			this.field('title')
			this.field('data')

			get(notes).forEach(function (doc) {
				this.add(doc)
			}, this)
		})
		searchTerm.subscribe((val) => {
			res = idx.search(val).map(res=>getUidNote(res.ref))
		})
	})

	function editNow(uid) {
    editing.set(uid)
    navigate('editor')
  }
</script>

<div id="search-container">
	<div id="search-res">
		{#each res as note}
		<div class="note-box" on:click={()=>editNow(note.uid)}>
			<h3>{note.title}</h3>
			<SvelteMarkdown source={note.data} />
		</div>
		{/each}
	</div>
</div>

<style>
	#search-container {
		width: 100%;
		height: 100%;
		position: fixed;
		top: 74px;
		left: 0;
		display: flex;
    align-items: flex-start;
		justify-content: center;
		z-index: 100;
	}
	#search-res {
		max-width: 1000px;
		width: calc(100% - 60px);
		height: 60vh;
		border-radius: 10px;
		z-index: 100;
		background: var(--bg-transperent);
		backdrop-filter: blur(20px);
		padding: 10px;
		overflow-y: auto;
		display: flex;
		flex-direction: row;
    gap: 5px;
    flex-wrap: wrap;
    align-items: flex-start;
	}
	.note-box {
    --offset: 50px;
    font-size: 15px;
    padding: 10px;
    background: var(--secondary);
    border-radius: 10px;
    cursor: pointer;
    max-width: calc(100% - 20px);
		width: 100%;
    max-height: 100vh;
    overflow-y: hidden;
    position: relative;
  }
  .note-box:hover {
    outline: 3px solid lightgreen;
  }
  .note-box > h3 {
    margin: 0;
  }
  :global(.note-box img) {
    max-height: 10vh;
    border-radius: 5px;
  }
</style>