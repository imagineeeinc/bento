<script>
  import '$lib/css/main.css'
  import { theme } from '$lib/components/store.js'
</script>
<svelte:head>
  <title>Bento</title>

  <meta name="color-scheme" content={$theme == 'system' ? 'light dark' : $theme}/>
  <link rel="stylesheet" href={`/theme/${$theme}.css`} />

  {#if $theme == 'system'}
    <meta name="theme-color" media="(prefers-color-scheme: light)" content="#f0f5f3" />
    <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#0a0f0d" />
  {:else}
    <meta name="theme-color" content={$theme == 'dark' ? '#0a0f0d' : '#f0f5f3'} />
  {/if}
</svelte:head>

<slot />
