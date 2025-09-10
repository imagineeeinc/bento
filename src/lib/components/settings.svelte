<script>
	import { navigate } from 'svelte-routing'
	import { theme } from '$lib/components/store.js'
	import { resetClient } from './store.js';
	function reset() {
		resetClient()
		window.location.href = '/logout'
	}
</script>

<div id="settings-panel">
	<button id="close-btn" class="m-icon big transparent" on:click={()=>navigate("/")}>arrow_back</button>
	<div id="settings-content">
	<h2 style="display: inline;">Settings</h2>
		<label>
			<h3>
				<span class="m-icon">dark_mode</span>
				Theme
			</h3>
			<br>
			<select name="theme" id="theme" bind:value={$theme}>
				<option value="system">System</option>
				<option value="dark">Dark</option>
				<option value="light">Light</option>
			</select>
		</label>
		<button on:click={reset}>Logout</button>
	</div>
</div>
<style>
	#settings-panel {
		position: fixed;
		top: 0;
		left: 0;
		background: var(--bg);
		backdrop-filter: blur(20px);
		height: 100%;
		width: calc(100% - 20px);
		padding: 5px;
		z-index: 20;
		display: flex;
		justify-content: center;
	}
	#settings-content {
		padding: 20px;
		padding-top: calc(60px);
		width: 80vh;
		max-width: 100%;
		display: flex;
		flex-direction: column;
		flex-wrap: nowrap;
		overflow: auto;
	}
	#close-btn {
		position: fixed;
		top: 10px;
		left: 10px;
	}
	h3 {
		margin: 0;
		display: flex;
		flex-direction: row;
		flex-wrap: nowrap;
		align-items: center;
		width: 100%;
		gap: 5px;
	}
</style>