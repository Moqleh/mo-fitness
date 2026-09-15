/* MO Fitness mobile install helper — GitHub-hosted, no device dependency */
(()=>{
  let promptEvent=null;
  const isStandalone=()=>window.matchMedia('(display-mode: standalone)').matches||window.navigator.standalone===true;
  const isMobile=()=>/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)||window.matchMedia('(max-width: 820px)').matches;
  const isIOS=()=>/iPhone|iPad|iPod/i.test(navigator.userAgent);
  const banner=()=>document.getElementById('installBanner');
  const button=()=>document.getElementById('installBtn');
  const message=()=>banner()?.querySelector('.installMsg span');
  function show(){if(!isMobile()||isStandalone())return;const b=banner();if(!b)return;b.classList.add('show');const m=message();if(m){m.textContent=isIOS()?(document.documentElement.lang==='en'?'Add MO Fitness to your Home Screen.':'أضف MO Fitness إلى الشاشة الرئيسية.'):(document.documentElement.lang==='en'?'Install MO Fitness on your phone.':'ثبّت MO Fitness على جوالك.')}}
  window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();promptEvent=e;show();});
  window.addEventListener('appinstalled',()=>banner()?.classList.remove('show'));
  document.addEventListener('DOMContentLoaded',()=>{if(isMobile()&&!isStandalone())setTimeout(show,500);const btn=button();if(!btn)return;btn.addEventListener('click',async e=>{e.preventDefault();e.stopImmediatePropagation();if(promptEvent){promptEvent.prompt();await promptEvent.userChoice;promptEvent=null;return;}const en=document.documentElement.lang==='en';if(isIOS())alert(en?'To install: tap Share in Safari, then “Add to Home Screen”.':'للتثبيت على الآيفون: اضغط زر المشاركة في Safari ثم «إضافة إلى الشاشة الرئيسية».');else alert(en?'Open your browser menu (⋮) and choose “Install app” or “Add to Home screen”.':'افتح قائمة المتصفح (⋮) ثم اختر «تثبيت التطبيق» أو «إضافة إلى الشاشة الرئيسية».');},true);});
})();
