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

<div id="about-panel">
	<button id="close-btn" class="m-icon big" on:click={()=>navigate("/")}>close</button>
	<h2 style="display: inline;">About</h2>
	
	<div id="about-content">
		<img src="/images/bento.svg" class="icon">
		<h3>A minimal self hosted notes app.</h3>
		<p style="text-align: justify; max-width: 600px;">
			Bento is a self hosted, minimal looking and private notes taking app.
			<br>
			You simply host your own instance of it on your own server.
			<br>
			And then take control of your own data.
			<br>
			It has markdown support and image support using <a href="https://github.com/mikhailsdv/deta-black-hole" target="_blank" rel="noopener noreferrer">Blackhole</a> intergration.
			<br>
			It is also open source.
		</p>
		<p>
			<a href="https://github.com/imagineeeinc/bento" target="_blank" rel="noopener noreferrer">Github</a>
		</p>
	</div>
</div>
<style>
	#about-panel {
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
	#about-content {
		padding: 20px;
		display: flex;
		flex-direction: column;
		flex-wrap: nowrap;
		align-items: center;
	}
	.icon {
		max-width: 200px;
		width: 100%;
		user-select: none;
	}
</style>
