/// <reference types="@sveltejs/kit" />
import { build, files, version } from '$service-worker';

// Create a unique cache name for this deployment
const CACHE = `cache-${version}`;

const ASSETS = [
  ...build, // the app itself
  ...files  // everything in `static`
];

self.addEventListener('install', (event) => {
  // Create a new cache and add all files to it
  async function addFilesToCache() {
    const cache = await caches.open(CACHE);
    await cache.addAll(ASSETS);
  }

  event.waitUntil(addFilesToCache());
});

self.addEventListener('activate', (event) => {
  // Remove previous cached data from disk
  async function deleteOldCaches() {
    for (const key of await caches.keys()) {
      if (key !== CACHE) await caches.delete(key);
    }
  }

  event.waitUntil(deleteOldCaches());
});

self.addEventListener('fetch', (event) => {
  // ignore POST requests etc
  if (event.request.method !== 'GET') return;
  // if anyhting under `/api`
  if (event.request.url.includes('/api/')) return;  

  async function respond() {
    const url = new URL(event.request.url);
    const cache = await caches.open(CACHE);  
    // `build`/`files` can always be served from the cache
    if (ASSETS.includes(url.pathname)) {
      return cache.match(url.pathname);
    } 
    // for everything else, try the network first, but
    // fall back to the cache if we're offline
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2500);
      const response = await fetch(event.request, { signal: controller.signal });
      clearTimeout(timeoutId);
      // if response takes to long return from cache
      if (response.headers.get('x-sveltekit-cache') === 'no-store') {
        return response;
      }
      
      if (response.status === 200) {
        cache.put(event.request, response.clone());
      }  
      return response;
    } catch (error) {
      if (error.name === 'AbortError') {
        // If the fetch was aborted due to timeout, return from cache
        return cache.match(event.request);
      } else {
        return cache.match(event.request);
      }
    }
  }

  event.respondWith(respond());
});