<script>
	import { navigate } from 'svelte-routing'
	import { availableTags, getUidTags, setUidTags } from '$lib/components/store.js'
	import Tags from "svelte-tags-input";

	export let tagEditor = null
	export let uid = null
	let tags = availableTags()
	let appliedTags = getUidTags(uid)

	function save() {
		setUidTags(uid, appliedTags)
		tagEditor.set(false)
	}
</script>

<div id="tags-panel">
	<button id="close-btn" class="m-icon big" on:click={save}>close</button>
	<h2 style="display: inline;">Tags</h2>
	<div id="tags-content">
		<Tags
			bind:tags={appliedTags}
			allowPaste={true}
			onlyUnique={true}
			placeholder={"Tags"}
			autoComplete={tags}
			id={"tags-input"}
			minChars={3}
		/>
		<button on:click={save} class="m-icon">save</button>
	</div>
	
</div>
<style>
	#tags-panel {
		position: fixed;
		top: 0;
		left: 0;
		background: var(--bg-transperent);
		backdrop-filter: blur(20px);
		height: 100%;
		width: calc(100% - 20px);
		padding: 5px;
		z-index: 200;
	}
	#tags-content {
		padding: 20px;
		display: flex;
		flex-direction: row;
		flex-wrap: nowrap;
		align-items: center;
		justify-content: center;
		gap: 10px;
	}
	#tags-content :global(.svelte-tags-input-tag) {
		background:var(--bg);
		color:var(--color);
		width: fit-content;
		height: 34px;
		border-radius: 10px;
		display: flex;
		align-items: center;
	}
	#tags-content :global(.svelte-tags-input-tag-remove) {
		font-size: larger;
	}
	#tags-content :global(.svelte-tags-input-layout) {
		background:var(--bg);
		border: none;
		outline: 3px solid var(--secondary);
		border-radius: 10px;
		font: inherit;
		max-width: 100vh;
		padding: 0;
		font-size: 20px;
	}
	#tags-content :global(.svelte-tags-input) {
		background:var(--bg);
		outline: none;
		margin: 0;
	}
	#tags-content :global(.svelte-tags-input-layout:hover) {
		outline: 3px solid var(--accent);
	}
	#tags-content :global(.svelte-tags-input-layout:focus-within) {
		outline: 3px solid var(--accent);
	}
</style>