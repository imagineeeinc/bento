<script>
	import Modal from './modal.svelte'
</script>

<Modal title="About">
	<div id="about-content">
		<img src="/images/bento2.svg" alt="Bento logo" class="icon">
		<h3>A minimal self hosted notes app.</h3>
		<p style="text-align: justify; max-width: 600px;">
			Bento is a self hosted, minimal looking and grid based private notes taking app.
			<br>
			You simply host your own instance of it on your own server.
			<br>
			And then take control of your own data.
			<br>
			It has markdown, tags, pinning, searching and multi user support.
			<br>
			It is a free and open source software licensed under <a href="https://github.com/imagineeeinc/bento/blob/main/LICENSE">GPL v3.0</a>.
		</p>
		<p>
			<a href="https://github.com/imagineeeinc/bento" target="_blank" rel="noopener noreferrer">Github</a>
		</p>
	</div>
</Modal>
<style>
	#about-content {
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
