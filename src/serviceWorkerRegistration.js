export function registerServiceWorker(){
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').then(reg => {
      console.log('SW registered', reg);
    }).catch(err => console.warn('SW register failed', err));
  }
}

export function cacheUrls(urls = []){
  if (navigator.serviceWorker && navigator.serviceWorker.controller) {
    // use MessageChannel to get response
    const msg = { type: 'CACHE_URLS', urls };
    const mc = new MessageChannel();
    mc.port1.onmessage = (ev) => { console.log('cache result', ev.data); };
    navigator.serviceWorker.controller.postMessage(msg, [mc.port2]);
  } else {
    // if SW not controlled yet, try fetch each to warm browser cache (best-effort)
    urls.forEach(u => fetch(u).catch(()=>{}));
  }
}
