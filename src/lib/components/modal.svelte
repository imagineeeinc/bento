<script>
  export let title = ""
	import { pop } from 'svelte-spa-router'
</script>

<div class="modal-panel">
	<div class="modal-content">
		<div class="modal-top-bar">
			<button class="m-icon big transparent" onclick={()=>pop()}>arrow_back</button>
			<h2 style="display: inline;">{title}</h2>
		</div>
		<div class="modal-body">
     <slot></slot>   
		</div>
	</div>
</div>
<style>
  .modal-panel {
		position: fixed;
		top: 0;
		left: 0;
		background: var(--secondary-transparent);
		backdrop-filter: blur(10px);
		height: 100%;
		width: 100%;
		z-index: 20;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.modal-content {
		padding: 2ch;
		padding-top: .5ch;
		width: 80vh;
		height: calc(100% - 80px - 2.5ch);
		max-width: 100%;
		border-radius: 10px;
		display: flex;
		flex-direction: column;
		flex-wrap: nowrap;
		overflow: hidden;
		background: var(--bg);
		outline: 3px solid var(--bg-50);
	}
  .modal-body {
    flex-grow: 1;
    overflow: auto;
  }
	@media only screen and (max-width: 80vh) {
		.modal-content {
			height: calc(100% - .5ch);
			border-radius: 0;
			outline: none;
      padding: .5ch 1ch 0 1ch; 
		}
	}
	.modal-top-bar {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 1ch;
    border-bottom: 3px solid var(--bg);
	}
</style>