const CACHE='mo-fitness-v3';
const CORE=['./','./index.html','./privacy.html','./disclaimer.html','./manifest.json','./icon.svg'];
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(CORE)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET') return;
  event.respondWith(
    fetch(event.request).then(response=>{
      const copy=response.clone();
      caches.open(CACHE).then(cache=>cache.put(event.request,copy));
      return response;
    }).catch(async()=>{
      const cached=await caches.match(event.request);
      if(cached) return cached;
      if(event.request.mode==='navigate') return caches.match('./index.html');
      return new Response('',{status:504,statusText:'Offline'});
    })
  );
});