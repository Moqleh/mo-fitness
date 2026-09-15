const CACHE='mo-fitness-v19';
const CORE=['./','./index.html','./exercise-guide.js','./exercise-en.js','./dbpress-images.js','./privacy.html','./disclaimer.html','./manifest.json','./icon.svg','./assets/exercises/bench-press/start.jpg','./assets/exercises/bench-press/descent.jpg','./assets/exercises/bench-press/finish.jpg','./assets/exercises/dumbbell-press/start.jpg','./assets/exercises/dumbbell-press/descent.jpg','./assets/exercises/dumbbell-press/finish.jpg','./assets/exercises/pushup/start.jpg','./assets/exercises/pushup/descent.jpg','./assets/exercises/pushup/finish.jpg','./assets/exercises/lat/start.jpg','./assets/exercises/lat/descent.jpg','./assets/exercises/lat/finish.jpg','./assets/exercises/row/start.jpg','./assets/exercises/row/descent.jpg','./assets/exercises/row/finish.jpg','./assets/exercises/onearm/start.jpg','./assets/exercises/onearm/descent.jpg','./assets/exercises/onearm/finish.jpg','./assets/exercises/shoulder/start.jpg','./assets/exercises/shoulder/descent.jpg','./assets/exercises/shoulder/finish.jpg','./assets/exercises/lateral/start.jpg','./assets/exercises/lateral/descent.jpg','./assets/exercises/lateral/finish.jpg','./assets/exercises/squat/start.jpg','./assets/exercises/squat/descent.jpg','./assets/exercises/squat/finish.jpg','./assets/exercises/rdl/start.jpg','./assets/exercises/rdl/descent.jpg','./assets/exercises/rdl/finish.jpg','./assets/exercises/legpress/start.jpg','./assets/exercises/legpress/descent.jpg','./assets/exercises/legpress/finish.jpg','./assets/exercises/curl/start.jpg','./assets/exercises/curl/descent.jpg','./assets/exercises/curl/finish.jpg','./assets/exercises/triceps/start.jpg','./assets/exercises/triceps/descent.jpg','./assets/exercises/triceps/finish.jpg','./assets/exercises/plank/start.jpg','./assets/exercises/plank/descent.jpg','./assets/exercises/plank/finish.jpg','./assets/exercises/deadbug/start.jpg','./assets/exercises/deadbug/descent.jpg','./assets/exercises/deadbug/finish.jpg','./assets/exercises/carry/start.jpg','./assets/exercises/carry/descent.jpg','./assets/exercises/carry/finish.jpg'];
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