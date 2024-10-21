<script>
  import '$lib/css/main.css'
  import { theme } from '$lib/components/store.js'
</script>
<svelte:head>
  <title>Bento</title>

  <meta name="color-scheme" content={$theme == 'system' ? 'light dark' : $theme}/>
  <link rel="stylesheet" href={`/theme/${$theme}.css`} />
</svelte:head>

<slot />
