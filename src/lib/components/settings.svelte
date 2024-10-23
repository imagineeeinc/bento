<script>
	import { navigate } from 'svelte-routing'
	import { theme } from '$lib/components/store.js'
</script>

<div id="settings-panel">
	<button id="close-btn" class="m-icon big" on:click={()=>navigate("/")}>close</button>
	<h2 style="display: inline;">Settings</h2>
	<div id="settings-content">
		<select name="theme" id="theme" bind:value={$theme}>
			<option value="system">System</option>
			<option value="dark">Dark</option>
			<option value="light">Light</option>
		</select>
	</div>
</div>
<style>
	#settings-panel {
		position: fixed;
		top: 0;
		left: 0;
		background: var(--bg-transperent);
		backdrop-filter: blur(20px);
		height: 100%;
		width: calc(100% - 20px);
		padding: 5px;
		z-index: 20;
	}
	#settings-content {
		padding: 20px;
		display: flex;
		flex-direction: column;
		flex-wrap: nowrap;
		align-items: center;
	}
</style>