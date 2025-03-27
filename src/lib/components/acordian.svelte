<script>
	export let title = ""

	let expanded = false

	function toggleExpansion() {
		expanded = !expanded
	}
</script>
	
<div>
	<div class="title" on:click={toggleExpansion}>
		<span class="m-icon">
			{expanded?'expand_less':'expand_more'}
		</span>
		<span>{title}</span>
	</div>
	{#if expanded}
		<div class="items">
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
</style>