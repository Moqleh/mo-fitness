/* MO Fitness Add to Home Screen only — never trigger PWA Install app dialog */
(()=>{
const standalone=()=>matchMedia('(display-mode: standalone)').matches||navigator.standalone===true;
const mobile=()=>/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)||matchMedia('(max-width:820px)').matches;
const ios=()=>/iPhone|iPad|iPod/i.test(navigator.userAgent);
const en=()=>document.documentElement.lang==='en';
const banner=()=>document.getElementById('installBanner');
const btn=()=>document.getElementById('installBtn');
const msg=()=>banner()?.querySelector('.installMsg span');
function hide(){banner()?.classList.remove('show')}
function normal(){const m=msg(),b=btn();if(m)m.textContent=en()?'Add MO Fitness to your Home Screen.':'أضف MO Fitness إلى الشاشة الرئيسية.';if(b){b.textContent=en()?'Add to Home Screen':'إضافة إلى الشاشة الرئيسية';delete b.dataset.guide}}
function guide(){const m=msg(),b=btn();if(!m||!b)return;m.textContent=ios()?(en()?'Tap Share, then Add to Home Screen':'اضغط مشاركة ثم إضافة إلى الشاشة الرئيسية'):(en()?'Tap browser menu ⋮, then Add to Home screen':'اضغط قائمة المتصفح ⋮ ثم إضافة إلى الشاشة الرئيسية');b.textContent=en()?'Got it':'حسنًا';b.dataset.guide='1'}
function show(){if(!mobile()||standalone()){hide();return}normal();banner()?.classList.add('show')}
/* Prevent the browser install event from being used by this page button. */
addEventListener('beforeinstallprompt',e=>{e.preventDefault();show()});
addEventListener('appinstalled',hide);
document.addEventListener('DOMContentLoaded',()=>{
 if(mobile()&&!standalone())setTimeout(show,350);
 const b=btn();if(!b)return;
 b.addEventListener('click',e=>{
  // This button owns only the add-to-home-screen guide.  Never stop the
  // browser's click event: doing so can swallow other UI actions on mobile.
  e.preventDefault();
  if(standalone()){hide();return}
  if(b.dataset.guide==='1'){normal();return}
  guide();
 },true);
});
})();
