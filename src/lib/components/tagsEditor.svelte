<script>
	import { navigate } from 'svelte-routing'
	import { availableTags, getUidTags, setUidTags } from '$lib/components/store.js'

	export let tagEditor = null
	export let uid = null
	let appliedTags = getUidTags(uid).join(" ")

	function save() {
		setUidTags(uid, appliedTags.split(" "))
		tagEditor.set(false)
	}
</script>

<div id="tags-panel">
	<button id="close-btn" class="m-icon big" on:click={save}>close</button>
	<h2 style="display: inline;">Tags</h2>
	<div id="tags-content">
		<div>>
			<input type="text" bind:value={appliedTags} placeholder="Tags">
		</div>
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
		gap: 1ch;
	}
</style>