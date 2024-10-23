<script>
	export let tag = ""

	import { notes } from '$lib/components/store'
  import NoteBox from './noteBox.svelte';
  import { writable } from 'svelte/store';

	function filterBy(item) {
		if (tag == "") {
			return !item.archive
		} else {
			return (item.tags && item.tags.includes(tag)) || (tag == "archive" && item.archive)
		}
	}
  let pinned = writable([])
  notes.subscribe((value) => {
    pinned.set([])
    pinned.update((value) => {
      let list = []
      let notesList = $notes.filter(filterBy)
      for (let i = 0; i < notesList.length; i++) {
        if (notesList[i].pin) {
          list.push(notesList[i])
        }
      }
      return list
    })
  })
</script>
<div id="grid">
  {#if $pinned.length > 0}
    <span class="section-title">Pinned</span>
    <div class="notes-grid">
      {#each [...$pinned].reverse().filter(filterBy) as note}
        <NoteBox {note} />
      {/each} 
    </div>
  {/if}
  {#if $pinned.length > 0}
    <span class="section-title">Other</span>
  {/if}
  <div class="notes-grid">
    {#each [...$notes].reverse().filter(filterBy) as note}
      {#if note.delete == false && !note.pin}
        <NoteBox {note} />
      {/if}
    {/each}
  </div>
</div>

<style>
	#grid {
    position: absolute;
    top: 0;
    left: 0;
    padding-top: 84px;
		padding-bottom: 20px;
    height: calc(100vh - 104px);
    width: 100%;
    overflow-y: auto;

		background: var(--bg);
  }
  .notes-grid {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    align-content: flex-start;
    gap: 20px;
    margin: 10px 0;
  }
  .section-title {
    font-size: 20px;
    margin: 0 10px;
  }
</style>