<script>
	import Acordian from "./acordian.svelte"
	import Modal from "./modal.svelte"
	import { theme, settings } from "$lib/components/store.js"
	import { resetClient } from "./store.js";
	
	let gridSize = $state($settings.local.gridFontSize)
	function reset() {
		resetClient()
		window.location.href = "/logout"
	}
	$effect(() => {
		settings.update((value) => {
			value.local.gridFontSize = gridSize
			return value
		})
	})
</script>

<Modal title="Settings">
	<section>
		<Acordian title="Account" icon="person" titleSize="1.4em" expanded={true}>
			<label>
				<span class="center-icon">
					<span class="m-icon">user_attributes</span>
					Change Username
				</span>
				<input type="button" class="hidden">
			</label>
			<label>
				<span class="center-icon">
					<span class="m-icon">shield_lock</span>
					Manage 2FA
				</span>
				<input type="button" class="hidden">
			</label>
			<label>
				<span class="center-icon">
					<span class="m-icon">key</span>
					Change Password
				</span>
				<input type="button" class="hidden">
			</label>
			<label class="red">
				<span class="center-icon">
					<span class="m-icon">logout</span>
					Logout
				</span>
				<input type="button" class="hidden" onclick={reset}>
			</label>
		</Acordian>
	</section>
	<section>
		<Acordian title="Apperance" icon="dark_mode" titleSize="1.4em">
			<label>
				<span class="center-icon">
					<span class="m-icon">dark_mode</span>
					Theme
				</span>
				<select name="theme" id="theme" class="transparent" bind:value={$theme}>
					<option value="system">System</option>
					<option value="dark">Dark</option>
					<option value="light">Light</option>
				</select>
			</label>
			<label class="vert">
				<span class="center-icon">
					<span class="m-icon">format_size</span>
					Grid Font Size
				</span>
				<span class="range-box">
					<input type="range" step="0.1" min="0.5" max="1.5" bind:value={gridSize}>
					<span class="range-value">{gridSize.toFixed(1)}x</span>
				</span>
			</label>
		</Acordian>
	</section>
	<section>
		<Acordian title="Data" icon="data_table" titleSize="1.4em">
			<label>
				<span class="center-icon">
					<span class="m-icon">download</span>
					Export Data
				</span>
				<input type="button" class="hidden">
			</label>
			<label class="amber">
				<span class="center-icon">
					<span class="m-icon">publish</span>
					Import Data
				</span>
				<input type="button" class="hidden">
			</label>
			<label class="red">
				<span class="center-icon">
					<span class="m-icon">delete_forever</span>
					Delete Account
				</span>
				<input type="button" class="hidden" onclick={reset}>
			</label>
		</Acordian>
	</section>
</Modal>
<style>
	section {
		padding: 1ch;
		background: var(--bg-50);
		border-bottom: 3px solid var(--bg-100);
	}
	section:first-child {
		border-radius: 10px 10px 0 0;
	}
	section:last-child {
		border-radius: 0 0 10px 10px;
		border-bottom: none;
	}
	label {
		display: flex;
		flex-direction: row;
		background: var(--bg);
		padding: 1ch 2ch;
		border-bottom: 3px solid var(--bg-50);
		cursor: pointer;
		user-select: none;
	}
	label.vert {
		flex-direction: column;
	}
	label:first-child {
		margin-top: 1ch;
		border-radius: 10px 10px 0 0;
	}
	label:last-child {
		border-radius: 0 0 10px 10px;
		border-bottom: none;
	}
	label:only-child {
		border-radius: 10px;
		border-bottom: none;
	}
	label:hover {
		background: var(--bg-100);
	}
	select {
		padding: 0;
		height: auto;
		background: var(--bg);
	}
	select:hover {
		background: none;
	}
	input[type="range"] {
		outline: none;
		width: 100%;
	}
	.range-box {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 1ch;
		margin-top: .5ch;
	}
	.center-icon {
		margin: 0;
		display: flex;
		flex-direction: row;
		flex-wrap: nowrap;
		align-items: center;
		width: 100%;
		gap: 1ch;
	}
	.hidden {
		visibility: hidden;
		height: 0;
	}
	.red, .red .m-icon {
		color: var(--red);
	}
	.amber, .amber .m-icon {
		color: var(--amber);
	}
</style>