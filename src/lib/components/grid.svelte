<script>
	export let tag = ""

	import SvelteMarkdown from 'svelte-markdown'
	import { navigate } from 'svelte-routing'
	import { notes } from '$lib/components/store'

	function editNow(uid) {
    navigate(`/editor/${uid}`)
  }
	function filterBy(item) {
		if (tag == "") {
			return !item.archive
		} else {
			return (item.tags && item.tags.includes(tag)) || (tag == "archive" && item.archive)
		}
	}
</script>
<div id="notes-grid">
  {#each [...$notes].reverse().filter(filterBy) as note}
    {#if note.delete == false}
      <div class="note-box" on:click={()=>editNow(note.uid)}>
        <h3>{note.title}</h3>
        <SvelteMarkdown source={note.data} />
        <div class="note-time">{new Intl.DateTimeFormat('en-GB', {dateStyle: 'short',timeStyle: 'short'}).format(new Date(note.lastEdited))}</div>
      </div>
    {/if}
  {/each}
</div>

<style>
	#notes-grid {
    position: absolute;
    top: 0;
    left: 0;
    padding-top: 74px;
		padding-bottom: 20px;
    height: calc(100vh - 74px);
    width: 100%;
    overflow-y: auto;

    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    align-content: flex-start;
    gap: 20px;

		background: var(--bg);
  }
  .note-box {
    --offset: 50px;
    font-size: 15px;
    padding: 10px;
    padding-bottom: calc(1ch + 20px);
    background: var(--secondary);
    border-radius: 10px;
    cursor: pointer;
    width: calc(25vw - var(--offset));
    max-height: 60vh;
    overflow-y: hidden;
    position: relative;
  }
  .note-box:hover {
    outline: 3px solid lightgreen;
  }
  .note-time {
    position: absolute;
    bottom: 10px;
    right: 10px;
    color: var(--color-sec);
    background: var(--bg-transperent);
		backdrop-filter: blur(5px);
    padding: 5px;
    border-radius: 10px;
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
  :global(.note-box img) {
    max-width: 90%;
    border-radius: 5px;
    display: block;
    margin: 0 auto;
  }
</style>