const CACHE_NAME = 'poc-icai-sw-v1';
self.addEventListener('install', (e) => {
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(self.clients.claim());
});

// store list of cached urls in IndexedDB or use cache directly
self.addEventListener('message', async (e) => {
  const data = e.data || {};
  if (data.type === 'CACHE_URLS' && Array.isArray(data.urls)) {
    const cache = await caches.open(CACHE_NAME);
    for (const url of data.urls) {
      try { await cache.add(url); } catch(err){ /* ignore per-file errors */ }
    }
    // respond back
    e.ports && e.ports[0] && e.ports[0].postMessage({ok:true});
  }
});
