/* MO Fitness AI — bilingual chat UI */
(()=>{
const ENDPOINT='https://mo-fitness-ai.moh-oglah.workers.dev';
const ar=()=>document.documentElement.lang!=='en';
const T=(a,e)=>ar()?a:e;
const hasArabic=text=>/[\u0600-\u06FF]/.test(String(text||''));
const normalize=text=>String(text||'').toLowerCase().normalize('NFKC').replace(/[ًٌٍَُِّْـ]/g,'').replace(/[أإآ]/g,'ا').replace(/ؤ/g,'و').replace(/ئ/g,'ي').replace(/ى/g,'ي').replace(/ة/g,'ه').replace(/[^\u0600-\u06ffa-z0-9\s-]/g,' ').replace(/\s+/g,' ').trim();
const exercisePhrases=[
'برنامج رياضي','برنامج تمارين','برنامج تدريبي','جدول تمارين','جدول تدريبي','جدول رياضي','روتين تمارين','روتين رياضي','خطة تمارين','خطة تدريب','خطة رياضية',
'workout plan','training plan','exercise plan','fitness plan','workout routine','training routine','exercise routine','fitness routine','workout schedule','training schedule'
];
const planWords=['برنامج','جدول','روتين','خطة','plan','routine','schedule'];
const fitnessWords=['رياضي','رياضه','لياقه','جيم','نادي','تمرين','تمارين','تدريب','fitness','gym','workout','exercise','training'];
const exerciseTerms=[
'تمرين','تمارين','تمرن','تدريب','سكوات','قرفصاء','ضغط','بوش اب','بوش ابس','عقلة','بلانك','لانجز','اندفاع','ديدلفت','رفعة','سحب','تجديف','بنش','دمبل','دنبل','باربل','بار','كيبل','كابل','عضلة','عضلات','صدر','ظهر','كتف','اكتاف','رجل','ارجل','فخذ','بايسبس','ترايسبس','بطن','كور','عدة','عدات','تكرار','تكرارات','مجموعة','مجموعات','احماء','اطالة','تمدد','كارديو',
'exercise','exercises','workout','workouts','training','train','squat','pushup','push-up','pullup','pull-up','plank','lunge','deadlift','row','bench','dumbbell','barbell','cable','muscle','muscles','chest','back','shoulder','shoulders','legs','leg','biceps','triceps','core','abs','rep','reps','set','sets','warmup','warm-up','stretch','stretching','cardio'
];
const blockedTerms=[
'سياسة','انتخابات','رئيس','حكومة','اخبار','خبر','طقس','سفر','فندق','مطعم','طبخ','وصفة','برمجة','كود','اسهم','استثمار','دين','فتوى','قران','دواء','ادوية','تشخيص','علاج','مرض','سكري','ضغط الدم','حمل','اصابة','اصابات','الم','دوخة',
'تغذيه','غذاء','غذائي','نظام غذائي','حميه','دايت','اكل','وجبه','سعرات','بروتين','كرياتين','مكمل','مكملات','فيتامين','نوم','النوم','انام','ينام','ساعات النوم','تعافي','politics','election','president','government','news','weather','travel','hotel','restaurant','recipe','cooking','programming','code','stocks','investment','religion','medical','medicine','medication','diagnosis','treatment','disease','diabetes','pregnancy','injury','pain','dizziness','nutrition','diet','food','meal','calorie','calories','protein','creatine','supplement','supplements','vitamin','sleep','recovery'
];
function isExerciseOnlyQuestion(text){const v=normalize(text);if(!v)return false;if(blockedTerms.some(k=>v.includes(normalize(k))))return false;if(exercisePhrases.some(k=>v.includes(normalize(k))))return true;if(planWords.some(k=>v.includes(normalize(k)))&&fitnessWords.some(k=>v.includes(normalize(k))))return true;return exerciseTerms.some(k=>v.includes(normalize(k)))}
function scopeReply(text){return hasArabic(text)?'أنا مخصص لأسئلة التمارين فقط: طريقة أداء التمرين، العضلات المستهدفة، المعدات، المجموعات والتكرارات، الإحماء والسلامة أثناء التمرين.':'I only answer exercise questions: exercise form, target muscles, equipment, sets and reps, warm-up, and exercise safety.'}
function looksLikeScopeFallback(text){const v=normalize(text);return ['اسالني عن التمارين','متخصص في اللياقه البدنيه','برامج التدريب التعافي او التغذيه','ask me about exercise','specialized in fitness','training recovery or sports nutrition'].some(k=>v.includes(normalize(k)))}
function localExerciseFallback(text){
 const v=normalize(text),rtl=hasArabic(text);
 const has=(...keys)=>keys.some(k=>v.includes(normalize(k)));
 if(has('انحف','تنحيف','حرق دهون','حرق الدهون','lose weight','fat loss','slim')){
  return rtl?'جرّب هذا التمرين الدائري 3 مرات أسبوعيًا:\n• سكوات: 12–15 تكرار\n• Push-ups: 8–12 تكرار\n• Lunges: 10 لكل رجل\n• Mountain Climbers: 30 ثانية\n• Plank: 30–45 ثانية\nكرر الدائرة 3–4 مرات مع راحة 60–90 ثانية بين الجولات. ابدأ بوتيرة مريحة وزد المدة أو التكرارات تدريجيًا.':'Try this circuit 3 times per week:\n• Squats: 12–15 reps\n• Push-ups: 8–12 reps\n• Lunges: 10 each leg\n• Mountain climbers: 30 sec\n• Plank: 30–45 sec\nRepeat 3–4 rounds with 60–90 sec rest. Start comfortably and progress gradually.'
 }
 if(has('صدر','chest')) return rtl?'للصدر: Bench Press 3×8–12، Dumbbell Press 3×8–12، Push-ups 3 مجموعات حتى قبل الفشل بتكرارين تقريبًا. حافظ على لوحَي الكتف ثابتين وتحكم بالنزول.':'For chest: Bench Press 3×8–12, Dumbbell Press 3×8–12, and Push-ups for 3 sets stopping about 2 reps before failure. Keep the shoulder blades stable and control the lowering phase.';
 if(has('ظهر','back')) return rtl?'للظهر: Lat Pulldown 3×8–12، Seated Row 3×8–12، One-arm Dumbbell Row 3×10 لكل جهة. ركّز على سحب المرفق للخلف من دون تأرجح الجذع.':'For back: Lat Pulldown 3×8–12, Seated Row 3×8–12, and One-arm Dumbbell Row 3×10 each side. Pull with the elbows and avoid torso swinging.';
 if(has('رجل','ارجل','فخذ','legs','leg')) return rtl?'للأرجل: Squat 3×8–12، Lunges 3×10 لكل رجل، Romanian Deadlift 3×8–12، وLeg Press 3×10–15. ابدأ بأوزان تستطيع التحكم بها بالكامل.':'For legs: Squat 3×8–12, Lunges 3×10 each leg, Romanian Deadlift 3×8–12, and Leg Press 3×10–15. Start with loads you can fully control.';
 if(has('كتف','اكتاف','shoulder','shoulders')) return rtl?'للأكتاف: Dumbbell Shoulder Press 3×8–12، Lateral Raise 3×12–15، وRear-delt Row 3×12–15. لا تستخدم وزنًا يجبرك على التأرجح.':'For shoulders: Dumbbell Shoulder Press 3×8–12, Lateral Raise 3×12–15, and Rear-delt Row 3×12–15. Avoid loads that force you to swing.';
 if(has('بطن','كور','abs','core')) return rtl?'للبطن والكور: Plank 3×30–45 ثانية، Dead Bug 3×8–12 لكل جهة، وSide Plank 3×20–40 ثانية لكل جهة. حافظ على الجذع ثابتًا والتنفس طبيعيًا.':'For abs/core: Plank 3×30–45 sec, Dead Bug 3×8–12 each side, and Side Plank 3×20–40 sec each side. Keep the trunk stable and breathe normally.';
 return rtl?'ابدأ ببرنامج جسم كامل 3 مرات أسبوعيًا:\n• Squat: 3×8–12\n• Push-ups: 3×8–12\n• Row: 3×8–12\n• Shoulder Press: 3×8–12\n• Plank: 3×30–45 ثانية\nخذ 60–90 ثانية راحة بين المجموعات وركز على الأداء الصحيح قبل زيادة التكرارات أو الوزن.':'Start with a full-body routine 3 times per week:\n• Squat: 3×8–12\n• Push-ups: 3×8–12\n• Row: 3×8–12\n• Shoulder Press: 3×8–12\n• Plank: 3×30–45 sec\nRest 60–90 sec between sets and prioritize good form before adding reps or load.'
}
function cleanReply(text){return String(text||'').replace(/\r\n/g,'\n').replace(/\*\*(.*?)\*\*/g,'$1').replace(/__(.*?)__/g,'$1').replace(/`([^`]+)`/g,'$1').replace(/^#{1,6}\s+/gm,'').replace(/^\s*[-*]\s+/gm,'• ').replace(/\n{3,}/g,'\n\n').trim()}
function formatMsg(el,text,who){const value=who==='user'?String(text||''):cleanReply(text);el.textContent=value;const rtl=hasArabic(value);el.dir=rtl?'rtl':'ltr';el.lang=rtl?'ar':'en';el.style.textAlign=rtl?'right':'left'}
function mount(){if(document.getElementById('moAiBtn'))return;
const style=document.createElement('style');style.textContent=`#moAiBtn{position:fixed;z-index:260;right:18px;bottom:82px;width:56px;height:56px;visibility:visible!important;opacity:1!important;pointer-events:auto!important;border:1px solid #62d4ff;border-radius:50%;background:linear-gradient(135deg,#17b5ff,#078cff);color:#fff;font-size:25px;box-shadow:0 12px 32px #0008;cursor:pointer}#moAiPanel{position:fixed;z-index:261;right:16px;bottom:148px;width:min(390px,calc(100vw - 24px));height:min(570px,72vh);display:none;flex-direction:column;background:#081925;border:1px solid #17465e;border-radius:18px;box-shadow:0 24px 70px #000b;overflow:hidden;color:#f5fbff}#moAiPanel.open{display:flex}.moAiHead{display:flex;align-items:center;justify-content:space-between;padding:13px 14px;background:#0a1d29;border-bottom:1px solid #17465e}.moAiHead b{color:#62d4ff}.moAiClose{border:0;background:transparent;color:#fff;font-size:22px;cursor:pointer}.moAiMsgs{flex:1;overflow:auto;padding:12px;display:flex;flex-direction:column;gap:9px}.moAiMsg{max-width:88%;padding:9px 11px;border-radius:13px;white-space:pre-wrap;font-size:14px;line-height:1.75;overflow-wrap:anywhere;unicode-bidi:plaintext}.moAiMsg[dir=rtl]{font-family:inherit;letter-spacing:0}.moAiUser{align-self:flex-end;background:#0d8fd1;color:#fff}.moAiBot{align-self:flex-start;background:#0d2634;border:1px solid #17465e}.moAiForm{display:flex;gap:7px;padding:10px;border-top:1px solid #17465e;background:#071722}.moAiInput{flex:1;min-width:0;border:1px solid #28536b;background:#0a2230;color:#fff;border-radius:10px;padding:10px;outline:none}.moAiSend{border:0;border-radius:10px;padding:9px 13px;background:#0da7ff;color:#fff;font-weight:900;cursor:pointer}.moAiSend:disabled{opacity:.55}.moAiNote{padding:0 11px 9px;color:#8fa7b4;font-size:10px}.moAiOpen #installBanner{display:none!important}@media(max-width:520px){#moAiBtn{right:12px;bottom:76px}#moAiPanel{inset:8px;width:auto;height:auto;max-height:none;border-radius:14px}.moAiMsg{max-width:92%;font-size:14px;line-height:1.8}.moAiForm{padding-bottom:max(10px,env(safe-area-inset-bottom))}}`;document.head.appendChild(style);
const btn=document.createElement('button');btn.id='moAiBtn';btn.type='button';btn.setAttribute('aria-label','MO Fitness AI');btn.setAttribute('aria-controls','moAiPanel');btn.setAttribute('aria-expanded','false');btn.textContent='🤖';
const panel=document.createElement('section');panel.id='moAiPanel';panel.setAttribute('role','dialog');panel.setAttribute('aria-label','MO Fitness AI');panel.innerHTML=`<div class="moAiHead"><b>MO Fitness AI</b><button class="moAiClose" type="button" aria-label="${T('إغلاق','Close')}">×</button></div><div class="moAiMsgs" aria-live="polite"></div><form class="moAiForm"><input class="moAiInput" maxlength="500" autocomplete="off" aria-label="${T('سؤالك','Your question')}" placeholder="${T('اكتب سؤالك...','Type your question...')}"><button class="moAiSend" type="submit">${T('إرسال','Send')}</button></form><div class="moAiNote">${T('إرشادات لياقة عامة وليست تشخيصًا أو علاجًا طبيًا. لا ترسل معلومات شخصية أو حساسة.','General fitness guidance, not medical diagnosis or treatment. Do not send personal or sensitive information.')}</div>`;
document.body.append(panel,btn);const msgs=panel.querySelector('.moAiMsgs'),form=panel.querySelector('form'),input=panel.querySelector('input'),send=panel.querySelector('.moAiSend'),close=panel.querySelector('.moAiClose');
function setOpen(open){panel.classList.toggle('open',open);document.body.classList.toggle('moAiOpen',open);btn.setAttribute('aria-expanded',String(open));if(open)input.focus()}
btn.onclick=()=>setOpen(!panel.classList.contains('open'));close.onclick=()=>setOpen(false);document.addEventListener('keydown',e=>{if(e.key==='Escape'&&panel.classList.contains('open'))setOpen(false)});
const add=(text,who)=>{const d=document.createElement('div');d.className='moAiMsg '+(who==='user'?'moAiUser':'moAiBot');formatMsg(d,text,who);msgs.appendChild(d);msgs.scrollTop=msgs.scrollHeight;return d};
add(T('مرحبًا! أنا مساعد MO Fitness للتمارين فقط. اسألني عن طريقة أداء التمارين، العضلات، المعدات، المجموعات والتكرارات.','Hi! I’m the MO Fitness exercise-only assistant. Ask about exercise form, muscles, equipment, sets, and reps.'),'bot');
form.onsubmit=async e=>{e.preventDefault();const message=input.value.trim();if(!message||send.disabled)return;add(message,'user');input.value='';if(!isExerciseOnlyQuestion(message)){add(scopeReply(message),'bot');input.focus();return}send.disabled=true;input.disabled=true;const wait=add(T('جاري التفكير…','Thinking…'),'bot');const controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),15000);try{const r=await fetch(ENDPOINT,{method:'POST',headers:{'Content-Type':'application/json'},signal:controller.signal,body:JSON.stringify({message,originalMessage:message,scope:'exercise-only'})});const data=await r.json().catch(()=>({}));const reply=r.ok&&data.reply?data.reply:'';formatMsg(wait,reply&&!looksLikeScopeFallback(reply)?reply:(reply?localExerciseFallback(message):(data.error||localExerciseFallback(message))),'bot')}catch(_){formatMsg(wait,T('تعذر الاتصال بالمساعد حاليًا. حاول مرة أخرى.','Unable to reach the assistant right now. Please try again.'),'bot')}finally{clearTimeout(timeout);send.disabled=false;input.disabled=false;input.focus();msgs.scrollTop=msgs.scrollHeight}};
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount);else mount();window.addEventListener('pageshow',mount);document.addEventListener('visibilitychange',()=>{if(!document.hidden)mount()});
})();

/* MO Fitness Experience Layer v50 — additive only; preserves existing structure and images */
(()=>{
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const isAr=()=>document.documentElement.lang!=='en';
const tr=(a,e)=>isAr()?a:e;
const LOG_KEY='moFitnessLogsV1', SESSION_KEY='moFitnessSessionsV2';
const safeJSON=(k,f)=>{try{return JSON.parse(localStorage.getItem(k)||JSON.stringify(f))}catch{return f}};
function injectStyles(){
 if($('#moExperienceStyles'))return;
 const s=document.createElement('style');s.id='moExperienceStyles';s.textContent=`
 :root{--mo-glass:rgba(9,25,36,.78);--mo-ring:rgba(53,194,255,.22)}
 body{padding-bottom:0}
 .moToday{padding:24px 0 8px}.moTodayGrid{display:grid;grid-template-columns:1.35fr repeat(3,.65fr);gap:10px}
 .moTodayMain,.moMetric{border:1px solid var(--line);background:linear-gradient(145deg,rgba(13,29,40,.96),rgba(7,16,24,.96));border-radius:18px;padding:18px;box-shadow:0 16px 45px #0004}
 .moTodayMain{display:flex;align-items:center;justify-content:space-between;gap:18px;overflow:hidden;position:relative}
 .moTodayMain:after{content:"MO";position:absolute;inset-inline-end:18px;bottom:-28px;font-size:7rem;font-weight:1000;color:#ffffff06;pointer-events:none}
 .moEyebrow{color:var(--blue2);font-size:.72rem;font-weight:900;letter-spacing:.14em;text-transform:uppercase}.moTodayMain h2{font-size:clamp(1.5rem,3vw,2.3rem);margin:4px 0}.moTodayMain p{margin:0;color:var(--mut);font-size:.88rem;max-width:620px}
 .moTodayActions{display:flex;gap:8px;flex-wrap:wrap;margin-top:13px}.moMetric{display:flex;flex-direction:column;justify-content:center;min-height:126px}.moMetric b{font-size:1.8rem;color:#fff}.moMetric span{font-size:.75rem;color:var(--mut)}.moMetric small{color:var(--blue2);margin-top:4px}
 .moProgress{height:6px;background:#13232d;border-radius:20px;overflow:hidden;margin-top:9px}.moProgress i{display:block;height:100%;background:linear-gradient(90deg,var(--blue),var(--green));border-radius:inherit}
 .moBottomNav{display:none}.moToast{position:fixed;z-index:400;left:50%;bottom:22px;transform:translate(-50%,20px);background:#071722;border:1px solid #28536b;color:#fff;padding:10px 14px;border-radius:12px;box-shadow:0 18px 45px #0009;opacity:0;pointer-events:none;transition:.22s}.moToast.show{opacity:1;transform:translate(-50%,0)}
 .exercise,.program{will-change:transform}.exercise img,.program img,.heroPhoto img,.step img,.rel img{background:#07131c}.exercise img{transition:transform .28s ease}.exercise:hover img{transform:scale(1.035)}
 @media(max-width:900px){.moTodayGrid{grid-template-columns:1fr 1fr}.moTodayMain{grid-column:1/-1}}
 @media(max-width:620px){body{padding-bottom:68px}.moToday{padding-top:14px}.moTodayGrid{grid-template-columns:1fr 1fr;gap:8px}.moTodayMain{display:block;padding:16px}.moMetric{padding:13px;min-height:105px}.moMetric b{font-size:1.45rem}.moTodayGrid .moMetric:last-child{grid-column:1/-1}.moBottomNav{position:fixed;z-index:115;bottom:0;left:0;right:0;height:62px;padding-bottom:env(safe-area-inset-bottom);display:grid;grid-template-columns:repeat(4,1fr);background:rgba(5,11,16,.94);border-top:1px solid #20313c;backdrop-filter:blur(18px)}.moBottomNav button{border:0;background:transparent;color:#91a1ac;font-size:.66rem;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px}.moBottomNav button b{font-size:1.05rem;color:#dcecf4}.moBottomNav button.active,.moBottomNav button.active b{color:var(--blue2)}#moAiBtn{bottom:76px!important}.installBanner{bottom:68px!important}}
 `;document.head.appendChild(s)
}
function streak(logs){
 const days=[...new Set(logs.map(x=>new Date(x.date).toISOString().slice(0,10)))].sort().reverse();if(!days.length)return 0;
 let n=1,d=new Date(days[0]+'T12:00:00');for(let i=1;i<days.length;i++){const p=new Date(d);p.setDate(p.getDate()-1);if(days[i]===p.toISOString().slice(0,10)){n++;d=p}else break}return n
}
function metrics(){
 const logs=safeJSON(LOG_KEY,[]), now=Date.now(), week=logs.filter(x=>now-Number(x.date)<7*864e5), sets=week.reduce((a,x)=>a+(+x.sets||0),0), volume=Math.round(week.reduce((a,x)=>a+(+x.weight||0)*(+x.reps||0)*(+x.sets||0),0));
 return {logs,week,sets,volume,streak:streak(logs)}
}
function toast(a,e){let t=$('#moToast');if(!t){t=document.createElement('div');t.id='moToast';t.className='moToast';document.body.appendChild(t)}t.textContent=tr(a,e);t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2200)}
function mountToday(){
 if($('#moToday'))return;const hero=$('.hero'), stats=$('.stats');if(!hero&&!stats)return;
 const m=metrics(), box=document.createElement('section');box.id='moToday';box.className='moToday';box.innerHTML=`<div class="wrap"><div class="moTodayGrid">
 <article class="moTodayMain"><div><span class="moEyebrow" data-mo-ar="لوحة التدريب" data-mo-en="Training dashboard">${tr('لوحة التدريب','Training dashboard')}</span><h2 data-mo-ar="تمرينك. تقدمك. في مكان واحد." data-mo-en="Your workout. Your progress. One place.">${tr('تمرينك. تقدمك. في مكان واحد.','Your workout. Your progress. One place.')}</h2><p data-mo-ar="ابدأ من البرنامج، نفّذ التمرين، وسجّل نتائجك محليًا بدون حساب." data-mo-en="Start your program, train, and save results locally without an account.">${tr('ابدأ من البرنامج، نفّذ التمرين، وسجّل نتائجك محليًا بدون حساب.','Start your program, train, and save results locally without an account.')}</p><div class="moTodayActions"><button class="btn primary" id="moStartNow">${tr('ابدأ تمرينك','Start workout')}</button><button class="btn ghost" id="moLogNow">${tr('سجّل أداءك','Log performance')}</button></div></div></article>
 <article class="moMetric"><span data-mo-ar="هذا الأسبوع" data-mo-en="This week">${tr('هذا الأسبوع','This week')}</span><b id="moWeekSessions">${m.week.length}</b><small data-mo-ar="سجلات تدريب" data-mo-en="workout logs">${tr('سجلات تدريب','workout logs')}</small><div class="moProgress"><i style="width:${Math.min(100,m.week.length*20)}%"></i></div></article>
 <article class="moMetric"><span data-mo-ar="المجموعات" data-mo-en="Sets">${tr('المجموعات','Sets')}</span><b id="moWeekSets">${m.sets}</b><small data-mo-ar="خلال 7 أيام" data-mo-en="last 7 days">${tr('خلال 7 أيام','last 7 days')}</small></article>
 <article class="moMetric"><span data-mo-ar="الاستمرارية" data-mo-en="Streak">${tr('الاستمرارية','Streak')}</span><b id="moStreak">${m.streak}</b><small data-mo-ar="أيام متتالية" data-mo-en="consecutive days">${tr('أيام متتالية','consecutive days')}</small></article>
 </div></div>`; (stats||hero).insertAdjacentElement('afterend',box);
 $('#moStartNow').onclick=()=>($('#programs')||$('.programs'))?.scrollIntoView({behavior:'smooth'});
 $('#moLogNow').onclick=()=>($('#tracker')||$('[id*=track]'))?.scrollIntoView({behavior:'smooth'});
}
function refresh(){const m=metrics();if($('#moWeekSessions'))$('#moWeekSessions').textContent=m.week.length;if($('#moWeekSets'))$('#moWeekSets').textContent=m.sets;if($('#moStreak'))$('#moStreak').textContent=m.streak}
function mountBottom(){
 if($('#moBottomNav'))return;const nav=document.createElement('nav');nav.id='moBottomNav';nav.className='moBottomNav';nav.setAttribute('aria-label',tr('تنقل سريع','Quick navigation'));nav.innerHTML=`
 <button data-mo-go=".hero"><b>⌂</b><span data-mo-ar="الرئيسية" data-mo-en="Home">${tr('الرئيسية','Home')}</span></button>
 <button data-mo-go="#programs"><b>▦</b><span data-mo-ar="البرامج" data-mo-en="Programs">${tr('البرامج','Programs')}</span></button>
 <button data-mo-go="#exercises"><b>◫</b><span data-mo-ar="التمارين" data-mo-en="Exercises">${tr('التمارين','Exercises')}</span></button>
 <button data-mo-go="#tracker"><b>↗</b><span data-mo-ar="التقدم" data-mo-en="Progress">${tr('التقدم','Progress')}</span></button>`;document.body.appendChild(nav);
 $$('[data-mo-go]').forEach(b=>b.onclick=()=>{let target=$(b.dataset.moGo);if(!target&&b.dataset.moGo==='#tracker')target=$('[id*=track]')||$('.trackerTop');target?.scrollIntoView({behavior:'smooth'});$$('[data-mo-go]').forEach(x=>x.classList.remove('active'));b.classList.add('active')})
}
function improveImages(){
 $$('img').forEach(img=>{if(!img.hasAttribute('loading')&&!img.closest('.hero'))img.loading='lazy';img.decoding='async';img.addEventListener('error',()=>{img.style.opacity='.55'},{once:true})})
}
function enhanceLogging(){
 const save=$('#saveLog');if(!save||save.dataset.moEnhanced)return;save.dataset.moEnhanced='1';save.addEventListener('click',()=>setTimeout(()=>{refresh();toast('تم حفظ الأداء محليًا ✓','Performance saved locally ✓')},50))
}
function translateExtras(){$$('[data-mo-ar][data-mo-en]').forEach(x=>x.textContent=isAr()?x.dataset.moAr:x.dataset.moEn)}
function boot(){injectStyles();mountToday();mountBottom();improveImages();enhanceLogging();translateExtras();refresh()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
window.addEventListener('pageshow',boot);document.addEventListener('click',e=>{if(e.target.closest('#langBtn'))setTimeout(translateExtras,20)});
})();
