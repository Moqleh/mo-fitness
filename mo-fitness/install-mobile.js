/* MO Fitness smart install button — GitHub-hosted, no device dependency */
(()=>{
  let promptEvent=null;
  const isStandalone=()=>window.matchMedia('(display-mode: standalone)').matches||window.navigator.standalone===true;
  const isMobile=()=>/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)||window.matchMedia('(max-width: 820px)').matches;
  const isIOS=()=>/iPhone|iPad|iPod/i.test(navigator.userAgent);
  const banner=()=>document.getElementById('installBanner');
  const button=()=>document.getElementById('installBtn');
  const message=()=>banner()?.querySelector('.installMsg span');
  const en=()=>document.documentElement.lang==='en';
  function hide(){banner()?.classList.remove('show')}
  function show(){
    if(!isMobile()||isStandalone()){hide();return;}
    const b=banner(); if(!b)return;
    b.classList.add('show');
    const m=message();
    if(m)m.textContent=isIOS()?(en()?'Add MO Fitness to your Home Screen.':'أضف MO Fitness إلى الشاشة الرئيسية.'):(en()?'Install MO Fitness on your phone.':'ثبّت MO Fitness على جوالك.');
    const btn=button();
    if(btn)btn.textContent=en()?'Install':'تثبيت';
  }
  window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();promptEvent=e;show();});
  window.addEventListener('appinstalled',()=>{promptEvent=null;hide();});
  document.addEventListener('DOMContentLoaded',()=>{
    if(isMobile()&&!isStandalone())setTimeout(show,400);
    const btn=button(); if(!btn)return;
    btn.addEventListener('click',async e=>{
      e.preventDefault(); e.stopImmediatePropagation();
      if(isStandalone()){hide();return;}
      if(promptEvent){
        const p=promptEvent; promptEvent=null;
        await p.prompt();
        const choice=await p.userChoice;
        if(choice&&choice.outcome==='accepted')hide();
        return;
      }
      if(isIOS()){
        alert(en()?'On iPhone, tap Share then “Add to Home Screen”. Apple does not allow websites to trigger this automatically.':'على الآيفون اضغط «مشاركة» ثم «إضافة إلى الشاشة الرئيسية». نظام Apple لا يسمح للموقع بتنفيذ هذه الخطوة تلقائيًا.');
      }else{
        alert(en()?'Your browser has not offered direct installation yet. Open the browser menu and choose “Install app” or “Add to Home screen”.':'المتصفح لم يفعّل التثبيت المباشر بعد. افتح قائمة المتصفح واختر «تثبيت التطبيق» أو «إضافة إلى الشاشة الرئيسية».');
      }
    },true);
  });
})();
