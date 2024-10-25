<script>
	import { navigate } from 'svelte-routing'
  import { authenticate } from '$lib/components/store'
  let visibility = false
  async function login() {
    let res = await authenticate(document.getElementById("pass").value, false)
    if (res) {
      navigate('/')
    } else {
      alert("Wrong Password Entered")
    }
  }
</script>

<div id="login-panel">
	<div id="login-content">
    <h2>Login</h2>
		<input id="pass" type={visibility?"text":"password"} placeholder="Password">
    <button class="m-icon" on:click={()=>visibility=!visibility}>
      {#if visibility == false}
        visibility
      {:else}
        visibility_off
      {/if}
    </button>
    <br>
    <button on:click={login} class="m-icon">login</button>
	</div>
</div>
<style>
	#login-panel {
		position: fixed;
		top: 0;
		left: 0;
		background: var(--bg);
		height: 100%;
		width: calc(100% - 20px);
		padding: 5px;
		z-index: 20;
	}
	#login-content {
		padding: 20px;
		display: flex;
		flex-direction: column;
		flex-wrap: nowrap;
		align-items: center;
	}
</style>
