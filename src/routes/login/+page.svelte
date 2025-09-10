<script>
	let { data, form } = $props()
	let mode = $state(form ? form.mode : 0)
	let showPassword = $state(false)
	let register = $state(data? data.register : true)
	import { redirect } from '@sveltejs/kit'
	import { browser } from '$app/environment'

	if (browser && form && form.success) window.location.href = '/';
</script>
<svelte:head>
	<title>Login - Bento</title>
</svelte:head>
<div id="login">
	<div id="login-form">
		<img src="/images/bento2.svg" width="30%" alt="bento logo" />
		<h1>Bento</h1>
		<hr>
		{#if register == true || register == 'true'}
			<div id="selection">
				<button class={[mode==0?'selected':'']} onclick={() => mode = 0}>Login</button>
				<button class={[mode==1?'selected':'']} onclick={() => mode = 1}>Register</button>
			</div>
		{/if}
		<form method="POST" action={mode == 0?'?/login':'?/register'}>
			<label>
				<div class="label">Username</div>
				<input type="text" name="username" required/>
			</label>
			{#if mode == 1}
				<label>
					<div class="label">Email</div>
					<input type="email" name="email" required/>
				</label>
			{/if}
			<label>
				<div class="label">Password</div>
				<div id="password-box">
					<input type={showPassword?'text':'password'} id="password" name="password" required/>				
					<button type="button" class="m-icon transparent" title={showPassword?'Hide Password':'Show Password'} onclick={() => showPassword = !showPassword}>visibility</button>
				</div>
			</label>
			{#if form?.error}
				<br>
				<div id="error">{form.error}</div>
			{/if}
			<br>
			<button type="submit">
				{#if mode == 0}Login{:else}Register{/if}
			</button>
		</form>
	</div>
</div>

<style>
	img, h1 {
		user-select: none;
	}
	#login {
		display: flex;
		justify-content: center;
		width:	calc(100% - 20px);
		height: 100%;
		padding: 1ch;
		background: var(--bg);
	}
	#login-form {
		width: 80vh;
		max-width: 100%;
		height: calc(100% - 40px);
		padding: 20px;
		outline: 3px solid var(--primary);
		border-radius: 10px;
		overflow: auto;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
	.label {
		font-size: x-large;
		margin-left: 5px;
		user-select: none;
	}
	hr {
		width: 25%;
		margin: 20px 0;
	}
	#selection {
		width: 100%;
		max-width: 300px;
		display: flex;
		flex-direction: row;
	}
	#selection button {
		width: 50%;
	}
	form {
		width: 100%;
		max-width: 300px;
		display: flex;
		flex-direction: column;
	}
	input {
		outline: none !important;
		border-bottom: 3px solid var(--primary) !important;
		border-radius: 0 !important;
		width: calc(100% - 20px);
	}
	input:hover, input:focus {
		outline: none;
		border-bottom: 3px solid var(--secondary);
	}
	button.m-icon.transperent:focus {
		background: rgba(128, 128, 128, 0.25);
	}
	button.m-icon.transperent:hover {
		background: rgba(128, 128, 128, 0.3);
	}
	#password-box {
		display: flex;
		flex-direction: row;
		flex-wrap: nowrap;
	}
	#password {
		width: calc(100% - 70px);
	}
	.selected {
		background: var(--primary);
		color: var(--bg);
	}
	.selected:hover {
		outline: 3px solid var(--primary);
	}
	#error {
		background: lightcoral;
		color: var(--bg);
		padding: 1ch;
		border-radius: 10px;
	}
</style>