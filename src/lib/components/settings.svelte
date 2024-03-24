<script>
	import { navigate } from 'svelte-routing'
	import { writable } from 'svelte/store'
	import { settings } from '$lib/components/store.js'

	let blackholeUrl = writable("")

	settings.subscribe((data)=>{
		blackholeUrl.set(data.blackhole)
	})
	blackholeUrl.subscribe((url) => {
		settings.update((value) => {
			value.blackhole = url
			return value
		})
	})
</script>

<div id="settings-panel">
	<button id="close-btn" class="m-icon big" on:click={()=>navigate("/")}>close</button>
	<h2 style="display: inline;">Settings</h2>
	<div id="settings-content">
		<label>
			Blackhole Image Intergration
			<br>
			<input id="blackhole" type="url" placeholder="https://..." bind:value={$blackholeUrl}>
		</label>
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
		padding: 10px;
		z-index: 20;
	}
	#settings-content {
		padding: 20px;
		display: flex;
		flex-direction: column;
		flex-wrap: nowrap;
		align-items: center;
	}
	label {
		max-width: 500px;
		width: 100%;
	}
	#blackhole {
		margin: 10px 0;
		width: calc(100% - 20px);
	}
</style>