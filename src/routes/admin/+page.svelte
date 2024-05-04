<script>
  import { browser } from '$app/environment'
  import { onMount } from 'svelte'
  import { writable } from 'svelte/store'
  let password = ""
  let blackholeUrl = writable("")
  let user = writable("")
  function save() {
    let settings = {
      blackholeUrl: $blackholeUrl,
      user: $user,
      logOut: {
        h: document.getElementById("logout-hour").value,
        m: document.getElementById("logout-min").value
      }
    }
    let d = new FormData()
    d.append("value", JSON.stringify(settings))
    fetch(`/api/v1/settings?p=${password}`, {
      method: "POST",
      body: d
    })
  }
  onMount(()=>{
    let pass = prompt("Password")
    password = pass
    fetch(`/api/v1/settings?p=${pass}`, {
      method: "GET"
    })
    .then(res=>res.json())
    .then(json=>{
      if (!json.error) {
        blackholeUrl.set(json.blackholeUrl)
        user.set(json.user)
        document.getElementById("logout-hour").value = json.logOut.h
        document.getElementById("logout-min").value = json.logOut.m
      } else {
          alert("Wrong password, reload page and re-enter password.")
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
    <h5>Logout Time</h5>
    <label>
			Hours
			<br>
			<input id="logout-hour" type="number" placeholder="24">
		</label>
    <label>
			Minutes
			<br>
			<input id="logout-min" type="number" placeholder="0">
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
		width: calc(100% - 10px);
		padding: 5px;
    overflow-y: auto;
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
