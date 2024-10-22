<script>
	import { onMount } from 'svelte'
  import { navigate } from 'svelte-routing'
</script>
<div id="menu-container">
	<button id="close-btn" class="m-icon big" on:click={()=>navigate("/")}>close</button>
	<div id="menu-list">
		<a on:click={()=>navigate('/')}><span class="m-icon">home</span>Home</a>
		<a on:click={()=>navigate('tags/archive')}><span class="m-icon">archive</span>Archive</a>
		<a on:click={()=>navigate('settings')}><span class="m-icon">settings</span>Settings</a>
		<a on:click={()=>navigate('about')}><span class="m-icon">info</span>About</a>
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
		mask: linear-gradient(to right, black 50%, transparent);
		backdrop-filter: blur(10px);
		padding: 5px;
		font-size: 30px;
		font-weight: 600;
		z-index: 20;
	}
	#menu-list > a {
		cursor: pointer;
		text-decoration: underline;
		color: var(--color);
		display: flex;
		flex-direction: row;
		align-items: center;
	}
	.m-icon {
		text-decoration: none !important;
	}
	#menu-list > a:hover {
		text-shadow: 0 0 2px slategrey;
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