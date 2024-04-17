<script>
  import { browser } from '$app/environment'
  import { onMount } from 'svelte'
  import { writable } from 'svelte/store'

  let blackholeUrl = writable("")
  let user = writable("")
  function save() {
    let settings = {
      blackholeUrl: $blackholeUrl,
      user: $user
    }
    let d = new FormData()
    d.append("value", JSON.stringify(settings))
    fetch('/api/v1/settings', {
      method: "POST",
      body: d
    })
  }
  onMount(()=>{
    fetch('/api/v1/settings', {
      method: "GET"
    })
    .then(res=>res.status==200?res.json():false)
    .then(json=>{
      if (json != false) {
        blackholeUrl.set(json.blackholeUrl)
        user.set(json.user)
      }
    })
  })
</script>
<div id="settings-panel">
	<div id="settings-content">
    <h2>Admin Panel</h2>
    <h4>Configure settings on this instance</h4>
    <label>
			Owner Name
			<br>
			<input id="user" type="text" placeholder="Bento Lover" bind:value={$user}>
		</label>
		<label>
			Blackhole Image Intergration
			<br>
			<input id="blackhole" type="url" placeholder="https://..." bind:value={$blackholeUrl}>
		</label>
    <button id="save" on:click={save}>Save</button>
	</div>
</div>
<style>
	#settings-panel {
		position: fixed;
		top: 0;
		left: 0;
		height: 100%;
		width: calc(100% - 20px);
		padding: 5px;
	}
	#settings-content {
		padding: 20px;
		display: flex;
		flex-direction: column;
		flex-wrap: nowrap;
		align-items: center;
	}
	label {
		max-width: 500px;
		width: 100%;
	}
	input {
		margin: 10px 0;
		width: calc(100% - 20px);
	}
</style>