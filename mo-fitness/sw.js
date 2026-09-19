const CACHE='mo-fitness-v60';
const CORE=['./','./index.html','./exercise-guide.js','./exercise-en.js','./dbpress-images.js','./install-mobile.js','./privacy.html','./disclaimer.html','./manifest.json','./icon.svg','./ai-chat.js'];
self.addEventListener('install',event=>{event.waitUntil((async()=>{const cache=await caches.open(CACHE);await Promise.allSettled(CORE.map(url=>cache.add(url)));await self.skipWaiting()})())});
self.addEventListener('activate',event=>{event.waitUntil((async()=>{const keys=await caches.keys();await Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)));await self.clients.claim()})())});
self.addEventListener('fetch',event=>{
 if(event.request.method!=='GET')return;
 const url=new URL(event.request.url);
 if(url.origin!==self.location.origin)return;
 if(event.request.mode==='navigate'){
   event.respondWith((async()=>{try{
     const response=await fetch(event.request,{cache:'no-store'});
     if(response&&response.ok){const cache=await caches.open(CACHE);cache.put('./index.html',response.clone())}
     return response;
   }catch(e){return (await caches.match('./index.html'))||new Response('Offline',{status:503})}})());
   return;
 }
 event.respondWith((async()=>{try{
   const response=await fetch(event.request,{cache:'no-cache'});
   if(response&&response.ok){const cache=await caches.open(CACHE);cache.put(event.request,response.clone())}
   return response;
 }catch(e){return (await caches.match(event.request))||new Response('',{status:504,statusText:'Offline'})}})());
});