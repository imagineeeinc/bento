<script>
	import { onMount } from 'svelte'
	import { pop, push, replace } from 'svelte-spa-router'
	import { availableTags } from './store.js'
	import Acordian from './acordian.svelte'
	import { fade } from 'svelte/transition'
</script>
<div id="menu-container">
	<div id="menu-box">
		<div id="top-bar">
			<span id="title">Bento</span>
			<button id="close-btn" class="transparent m-icon big" onclick={()=>pop()}>close</button>
		</div>
		<div id="menu-list-container">
			<div id="menu-list">
				<section>
					<button class="transparent" onclick={()=>replace("/")}><span class="m-icon">home</span>Home</button>
					<button class="transparent" onclick={()=>replace("/tags/archive")}><span class="m-icon">archive</span>Archive</button>
				</section>
				<section>
					<div class="transparent section-title"><span class="m-icon">tag</span>Tags</div>
					{#each availableTags() as tag}
						<button onclick={()=>replace(`/tags/${tag}`)} class=" transparent label-link">
							<span class="m-icon">label_important</span>{tag}
						</button>
					{/each}
				</section>
			</div>
		</div>
		<div id="bottom-bar">
			<button class="transparent m-icon big" onclick={()=>replace("/about")} title="About">info</button>
			<button class="transparent m-icon big" onclick={()=>replace("/settings")} title="Settings">settings</button>
		</div>
	</div>
</div>

<style>
	#menu-container {
		width: 100%;
		height: 100%;
		position: fixed;
		top: 0;
		left: 0;
		background: var(--secondary-transperent);
		backdrop-filter: blur(10px);
		z-index: 20;
	}
	#menu-box {
		width: 60vh;
		background: var(--bg-50);
		height: 100%;
		overflow: hidden;
		position: relative;
	}
	@media only screen and (max-width: 60vh) {
		#menu-box {
			width: 100%;
		}
	}
	#top-bar {
		width: calc(100% - 6ch);
		height: 60px;
		background: var(--bg);
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		padding: 1ch 2ch 1ch 4ch;
		border-bottom: 3px solid var(--bg-50);
	}
	#menu-list-container {
		height: calc(100% - 120px - 4ch);
		overflow: auto;
	}
	#title {
		font-size: 1.5em;
		font-weight: 600;
		user-select: none;
	}
	#menu-list {
		font-size: 1.2em;
		height: 100%;
		overflow: auto;
		display: flex;
		flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
		gap: 1ch;
		padding: 1ch 2ch;
	}
	#menu-list-container::-webkit-scrollbar {
		display: none;
	}
	section {
		width: 100%;
		display: flex;
		flex-direction: column;
		gap: 3px;
	}
	#menu-list button, .section-title {
		cursor: pointer;
		text-decoration: none;
		margin: 0;
		color: var(--color);
		display: flex;
		flex-direction: row;
		align-items: center;
		flex-wrap: nowrap;
		gap: 1ch;
		background: var(--bg);
		width: 100%;
		border-radius: 0;
	}
	.section-title {
		padding: 10px;
		width: calc(100% - 20px);
		user-select: none;
		cursor: default;
		font-weight: 600;
	}
	#menu-list button:first-child, .section-title:first-child {
		border-radius: 10px 10px 0 0;
	}
	#menu-list button:last-child {
		border-radius: 0 0 10px 10px;
	}
	#menu-list button:hover {
		background: var(--bg-100);
	}
	.label-link {
		padding-left: 3ch;
	}
	#bottom-bar {
		width: calc(100% - 4ch);
		height: 60px;
		background: var(--bg);
		display: flex;
		flex-direction: row;
		justify-content: end;
		align-items: center;
		padding: 1ch 2ch;
		border-top: 3px solid var(--bg-50);
		position: absolute;
		bottom: 0;
	}
</style>