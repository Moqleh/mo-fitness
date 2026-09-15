/* MO Fitness — detailed exercise-by-exercise coaching */
(function(){
const guides={
dbpress:{setup:'مقعد مسطح ثابت + زوج دمبل متساويين. اجلس عند طرف المقعد وضع كل دمبل على فخذ، ثم استخدم الفخذين لمساعدة الدمبلين إلى وضع البداية أثناء الاستلقاء.',start:'ثبّت القدمين على الأرض واسحب لوحي الكتف للخلف ولأسفل. ضع الدمبلين فوق جانبي الصدر، والرسغان فوق المرفقين تقريبًا والقبضة مريحة للكتف.',move:'خذ شهيقًا وأنزل الدمبلين معًا ببطء إلى جانبي الصدر. اسمح للمرفقين بالنزول ضمن مسار مريح من دون فتحهما أفقيًا بشكل مبالغ، وحافظ على الرسغ ثابتًا فوق الساعد.',finish:'ادفع الدمبلين للأعلى باتجاه بعضهما قليلًا حتى يعودا فوق الصدر. لا تضرب الدمبلين ببعضهما ولا تدفع الكتفين للأمام في أعلى الحركة.',breath:'شهيق أثناء النزول، وزفير أثناء الدفع للأعلى.',safety:'اختر مدى حركة يناسب كتفك. لا تنزل الدمبلين أعمق من قدرتك على تثبيت الكتف، وأعدهما إلى الفخذين بطريقة مسيطر عليها.'}
};
const imageSets={
 bench:['./assets/exercises/bench-press/start.jpg','./assets/exercises/bench-press/descent.jpg','./assets/exercises/bench-press/finish.jpg'],
 dbpress:['./assets/exercises/dumbbell-press/start.jpg','./assets/exercises/dumbbell-press/descent.jpg','./assets/exercises/dumbbell-press/finish.jpg']
};
function apply(){
 if(!window.exercises)return;
 window.exercises.forEach(e=>{if(guides[e.id])Object.assign(e,guides[e.id]);if(imageSets[e.id])e.stepImgs=imageSets[e.id];});
 if(window.stepCard && !window.__moStageImages){
  window.__moStageImages=true;
  const old=window.stepCard;
  window.stepCard=function(n,title,text,e,pos){
   if(e&&e.stepImgs&&e.stepImgs[n-1]){
    const safe=String(text||'').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    return `<div class="step-card"><div class="step-head"><span class="step-num">${n}</span><strong>${title}</strong></div><img src="${e.stepImgs[n-1]}" alt="${e.en} ${title}" loading="lazy"><p>${safe}</p></div>`;
   }
   return old(n,title,text,e,pos);
  };
 }
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply);else apply();
setTimeout(apply,0);
})();