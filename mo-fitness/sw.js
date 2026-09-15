const CACHE='mo-fitness-v29';
const CORE=['./','./index.html','./exercise-guide.js','./exercise-en.js','./dbpress-images.js','./privacy.html','./disclaimer.html','./manifest.json','./icon.svg'];

self.addEventListener('install',event=>{
  event.waitUntil((async()=>{
    const cache=await caches.open(CACHE);
    await Promise.allSettled(CORE.map(url=>cache.add(url)));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate',event=>{
  event.waitUntil((async()=>{
    const keys=await caches.keys();
    await Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET')return;
  const url=new URL(event.request.url);
  if(url.origin!==self.location.origin)return;

  if(event.request.destination==='image'){
    event.respondWith((async()=>{
      const cached=await caches.match(event.request);
      const network=fetch(event.request).then(async response=>{
        if(response.ok){
          const cache=await caches.open(CACHE);
          cache.put(event.request,response.clone());
        }
        return response;
      }).catch(()=>null);
      if(cached){event.waitUntil(network);return cached;}
      const response=await network;
      return response||new Response('',{status:504,statusText:'Offline'});
    })());
    return;
  }

  event.respondWith((async()=>{
    try{
      const response=await fetch(event.request);
      if(response.ok){
        const cache=await caches.open(CACHE);
        cache.put(event.request,response.clone());
      }
      return response;
    }catch(e){
      const cached=await caches.match(event.request);
      if(cached)return cached;
      if(event.request.mode==='navigate')return (await caches.match('./index.html'))||new Response('Offline',{status:503});
      return new Response('',{status:504,statusText:'Offline'});
    }
  })());
});
