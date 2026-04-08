<script>
  import { push } from 'svelte-spa-router'
	import SvelteMarkdown from 'svelte-markdown'
  import { settings } from '$lib/components/store'

	export let note
	function editNow(uid) {
		push(`/editor/${uid}`)
	}
</script>
<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="note-box" on:click={()=>editNow(note.uid)} style="font-size: {$settings.local.gridFontSize || 0.8}em">
	<h3>{note.title}</h3>
	<SvelteMarkdown source={note.data} />
	<div class="note-time">
		{#if note.tags && note.tags.length > 0}
			<span class="tags-list">
				{#each note.tags as tag}
					<span class="tag">{tag}</span>
				{/each}
			</span>
		{/if}
		<span class="time">{new Intl.DateTimeFormat('en-GB', {dateStyle: 'short',timeStyle: 'short'}).format(new Date(note.lastEdited))}</span>
	</div>
</div>

<style>
	.note-box {
    --offset: 35px;
    padding: 1ch;
    padding-bottom: calc(1ch + 20px);
    background: var(--bg-50);
    outline: 3px solid var(--bg-50);
    border-radius: 10px;
    cursor: pointer;
    width: calc(25vw - var(--offset));
    max-height: 60vh;
    overflow: hidden;
    position: relative;
  }
  .note-box:hover {
    outline: 3px solid var(--bg-100);
  }
  .note-time {
    position: absolute;
    bottom: 1ch;
    right: 1ch;
    max-width: calc(100% - 30px);
    display: flex;
    gap: 1em;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    justify-content: flex-end;
    color: var(--color-sec);
    background: var(--bg-transperent);
		backdrop-filter: blur(5px);
    padding: 5px;
    border-radius: 10px;
  }
  .tags-list {
    display: inline-flex;
    flex-direction: row;
    flex-wrap: nowrap;
    gap: 5px;
    overflow: hidden;
  }

  .tag {
    background: var(--secondary);
    color: var(--color);
    padding: 5px;
    border-radius: 10px;
    flex-shrink: 0;
  }
  .time {
    flex-shrink: 0;
  }
  @media (max-width: 1000px) {
    .note-box {
      width: calc(50vw - var(--offset));
      padding: .5ch 1ch;
      padding-bottom: calc(.5ch + 20px)
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