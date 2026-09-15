const CACHE='mo-fitness-v10';
const CORE=['./','./index.html','./exercise-guide.js','./dbpress-images.js','./privacy.html','./disclaimer.html','./manifest.json','./icon.svg','./assets/exercises/bench-press/start.jpg','./assets/exercises/bench-press/descent.jpg','./assets/exercises/bench-press/finish.jpg','./assets/exercises/dumbbell-press/start.jpg','./assets/exercises/dumbbell-press/descent.jpg','./assets/exercises/dumbbell-press/finish.jpg','./assets/exercises/pushup/start.jpg','./assets/exercises/pushup/descent.jpg','./assets/exercises/pushup/finish.jpg','./assets/exercises/lat/start.jpg','./assets/exercises/lat/descent.jpg','./assets/exercises/lat/finish.jpg'];
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(CORE)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',event=>{
 if(event.request.method!=='GET')return;
 event.respondWith((async()=>{
  try{
   const response=await fetch(event.request);
   if(event.request.mode==='navigate'&&new URL(event.request.url).pathname.endsWith('/mo-fitness/')){
    let html=await response.text();
    if(!html.includes('exercise-guide.js'))html=html.replace('</body>','<script src="exercise-guide.js"></script></body>');
    if(!html.includes('dbpress-images.js'))html=html.replace('</body>','<script src="dbpress-images.js"></script></body>');
    const out=new Response(html,{status:response.status,statusText:response.statusText,headers:response.headers});
    caches.open(CACHE).then(c=>c.put(event.request,out.clone()));return out;
   }
   caches.open(CACHE).then(c=>c.put(event.request,response.clone()));return response;
  }catch(e){const cached=await caches.match(event.request);if(cached)return cached;if(event.request.mode==='navigate')return caches.match('./index.html');return new Response('',{status:504,statusText:'Offline'});}
 })());
});