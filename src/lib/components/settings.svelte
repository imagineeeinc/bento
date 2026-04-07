<script>
	import Acordian from "./acordian.svelte"
	import { navigate } from "svelte-routing"
	import { theme } from "$lib/components/store.js"
	import { resetClient } from "./store.js";
	function reset() {
		resetClient()
		window.location.href = "/logout"
	}
	// TODO: Add change password
</script>

<div id="settings-panel">
	<button id="close-btn" class="m-icon big transparent" onclick={()=>navigate("/")}>arrow_back</button>
	<div id="settings-content">
	<h2 style="display: inline;">Settings</h2>
		<div>
			<section>
				<Acordian title="Account" icon="person" titleSize="1.4em">
					<label>
						<span class="center-icon">
							Change Password
						</span>
						<input type="button" class="hidden" onclick={()=>navigate("/change-password")}>
					</label>
					<label>
						<span class="center-icon">
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
				</Acordian>
			</section>
		</div>
	</div>
</div>
<style>
	#settings-panel {
		position: fixed;
		top: 0;
		left: 0;
		background: var(--bg);
		backdrop-filter: blur(20px);
		height: 100%;
		width: calc(100% - 20px);
		padding: 5px;
		z-index: 20;
		display: flex;
		justify-content: center;
	}
	#settings-content {
		padding: 20px;
		padding-top: calc(60px);
		width: 80vh;
		max-width: 100%;
		display: flex;
		flex-direction: column;
		flex-wrap: nowrap;
		overflow: auto;
	}
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
	#close-btn {
		position: fixed;
		top: 10px;
		left: 10px;
	}
	label {
		display: flex;
		background: var(--bg);
		padding: 1ch 2ch;
		border-bottom: 3px solid var(--bg-50);
		cursor: pointer;
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
	select {
		padding: 0;
		height: auto;
	}
	select:hover {
		background: none;
	}
	.center-icon {
		margin: 0;
		display: flex;
		flex-direction: row;
		flex-wrap: nowrap;
		align-items: center;
		width: 100%;
		gap: 5px;
	}
	.hidden {
		visibility: hidden;
		height: 0;
	}
</style>