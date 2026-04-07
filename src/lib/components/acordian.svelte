<script>
	import { slide } from 'svelte/transition'
	export let title = ""
	export let icon = ""
	export let titleSize = "1.0em"

	let expanded = false

	function toggleExpansion() {
		expanded = !expanded
	}
</script>
	
<div>
	<div class="title" on:click={toggleExpansion} style="font-size: {titleSize}">
		<span class="m-icon expand-arrow {expanded?'rotate-180':''}">
			expand_more
		</span>
		<span class="m-icon">{icon}</span>
		<span>{title}</span>
	</div>
	{#if expanded}
		<div class="items" transition:slide>
			<slot></slot>
		</div>
	{/if}
</div>
	
<style>
	.title {
		cursor: pointer;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: flex-start;
	}
	.title:hover, .title:hover .m-icon {
		color: var(--color-sec);
	}
	.items {
		display: flex;
		flex-direction: column;
	}
	.items > * {
		margin-left: 20px;
	}
	.expand-arrow {
		transition: transform .2s ease-in-out;
	}
	.rotate-180 {
		transform: rotate(180deg);
	}
</style>