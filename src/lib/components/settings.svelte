<script>
	import { navigate } from 'svelte-routing'
</script>

<div id="settings-panel">
	<button id="close-btn" class="m-icon big" on:click={()=>navigate("/")}>close</button>
	<h2 style="display: inline;">Settings</h2>
	<div id="settings-content">
		<i>Very Empty Right now...</i>
		<p>
			Settings has moved to the admin panel.
		</p>
		<p>
			<a href="/admin" target="_blank" rel="noopener noreferrer">Go to Admin panel</a>
		</p>
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