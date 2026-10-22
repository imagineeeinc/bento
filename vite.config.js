import adapter from '@sveltejs/adapter-node';
import { sveltekit } from '@sveltejs/kit/vite';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { defineConfig } from 'vite';
import UnoCSS from '@unocss/svelte-scoped/preprocess';

export default defineConfig({
  plugins: [
    sveltekit({
      preprocess: [
        vitePreprocess(),
        UnoCSS({
          classPrefix: 'bento-'
        })
      ],
      adapter: adapter(),
      version: {
        name: process.env.npm_package_version
      }
    })
  ]
});
