<script>
	import { onMount } from 'svelte'
  import { navigate } from 'svelte-routing'
</script>
<div id="menu-container">
	<button id="close-btn" class="m-icon big" on:click={()=>navigate("/")}>close</button>
	<div id="menu-list">
		<a on:click={()=>navigate('/')}><span class="m-icon">home</span>Home</a>
		<a on:click={()=>navigate('settings')}><span class="m-icon">settings</span>Settings</a>
	</div>
</div>

<style>
	#menu-container {
		width: 100%;
		height: 100%;
		position: fixed;
		top: 0;
		left: 0;
		background: var(--bg-transperent);
		backdrop-filter: blur(10px);
		padding: 10px;
		font-size: 30px;
		font-weight: 600;
	}
	#menu-container > ul {
		list-style-type: none;
	}
	#menu-container > ul > li {
		cursor: pointer;
	}
	#menu-list {
		position: fixed;
		top: 74px;
		left: 37px;
		display: flex;
		flex-direction: column;
		flex-wrap: nowrap;
		gap: 10px;
	}
</style>