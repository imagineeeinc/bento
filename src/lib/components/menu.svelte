<script>
	import { onMount } from 'svelte'
  import { navigate } from 'svelte-routing'
	import { availableTags } from './store.js'
	import Acordian from './acordian.svelte'
</script>
<div id="menu-container">
	<button id="close-btn" class="m-icon big" on:click={()=>window.history.back()}>close</button>
	<div id="menu-list">
		<a on:click={()=>navigate('/')}><span class="m-icon">home</span>Home</a>
		<a on:click={()=>navigate('tags/archive')}><span class="m-icon">archive</span>Archive</a>
		<Acordian title="Tags">
			{#each availableTags() as tag}
				<a on:click={()=>navigate(`tags/${tag}`)} class="label-link"><span class="m-icon">label</span>{tag}</a>
			{/each}
		</Acordian>
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
	#menu-list {
		height: calc(100% - 84px);
		overflow: auto;
	}
	#menu-list::-webkit-scrollbar {
		display: none;
	}
	#menu-list > a {
		cursor: pointer;
		text-decoration: none;
		color: var(--color);
		display: flex;
		flex-direction: row;
		align-items: center;
	}
	.m-icon {
		text-decoration: none !important;
	}
	#menu-list > a:hover {
		color: var(--color-sec);
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
	.label-link {
		text-decoration: none !important;
		color: var(--color);
		cursor: pointer;
	}
	.label-link:hover {
		color: var(--color-sec);
	}
</style>