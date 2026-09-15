/* MO Fitness smart install — no browser alert dialogs */
(()=>{
let promptEvent=null;
const standalone=()=>matchMedia('(display-mode: standalone)').matches||navigator.standalone===true;
const mobile=()=>/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)||matchMedia('(max-width:820px)').matches;
const ios=()=>/iPhone|iPad|iPod/i.test(navigator.userAgent);
const en=()=>document.documentElement.lang==='en';
const banner=()=>document.getElementById('installBanner');
const btn=()=>document.getElementById('installBtn');
const msg=()=>banner()?.querySelector('.installMsg span');
function hide(){banner()?.classList.remove('show')}
function normal(){const m=msg(),b=btn();if(m)m.textContent=en()?'Install MO Fitness on your phone.':'ثبّت MO Fitness على جوالك.';if(b)b.textContent=en()?'Install':'تثبيت'}
function guide(){const m=msg(),b=btn();if(!m||!b)return;if(ios())m.textContent=en()?'Safari: Share → Add to Home Screen':'Safari: مشاركة ← إضافة إلى الشاشة الرئيسية';else m.textContent=en()?'Browser menu ⋮ → Install app':'قائمة المتصفح ⋮ ← تثبيت التطبيق';b.textContent=en()?'Got it':'حسنًا';b.dataset.guide='1'}
function show(){if(!mobile()||standalone()){hide();return}normal();banner()?.classList.add('show')}
addEventListener('beforeinstallprompt',e=>{e.preventDefault();promptEvent=e;show()});
addEventListener('appinstalled',()=>{promptEvent=null;hide()});
document.addEventListener('DOMContentLoaded',()=>{
 if(mobile()&&!standalone())setTimeout(show,350);
 const b=btn();if(!b)return;
 b.addEventListener('click',async e=>{
  e.preventDefault();e.stopImmediatePropagation();
  if(b.dataset.guide==='1'){delete b.dataset.guide;hide();return}
  if(standalone()){hide();return}
  if(promptEvent){const p=promptEvent;promptEvent=null;await p.prompt();const c=await p.userChoice;if(c?.outcome==='accepted')hide();else normal();return}
  guide();
 },true);
});
})();
