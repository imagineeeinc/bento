<script>
  import '$lib/css/main.css'
  import { theme } from '$lib/components/store.js'
</script>
<svelte:head>
  <title>Bento</title>

  <meta name="color-scheme" content={$theme == 'system' ? 'light dark' : $theme}/>
  <link rel="stylesheet" href={`/theme/${$theme}.css`} />

  {#if $theme == 'system'}
    <meta name="theme-color" media="(prefers-color-scheme: light)" content="#eff1f5" />
    <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#1e1e2e" />
  {:else}
    <meta name="theme-color" content={$theme == 'dark' ? '#1e1e2e' : '#eff1f5'} />
  {/if}
</svelte:head>

<slot />
