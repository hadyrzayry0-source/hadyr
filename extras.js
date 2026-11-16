/* hadyr extras: timers, journal, reading (books + quran), "more" hub */
(function(){
'use strict';
const today=()=>ymd(new Date());
let xe=null;

/* ---------- translations & icons ---------- */
Object.assign(T.ar,{
 more:'المزيد',back:'رجوع',timers:'المؤقّتات',journal:'اليوميات',reading:'القراءة',
 tm_prayer:'الصلاة',tm_sport:'الرياضة',tm_study:'الدراسة',tm_care:'الاهتمام بالنفس',
 tmNew:'مؤقّت جديد',tmEdit:'تعديل المؤقّت',tmName:'الاسم',tmWork:'مدة التركيز (بالدقائق)',tmBreak:'مدة الراحة (بالدقائق)',tmRounds:'عدد الجولات',tmHint:'0.5 = 30 ثانية',
 tmSkip:'تخطّي',tmPause:'إيقاف مؤقّت',tmResume:'متابعة',tmStop:'إنهاء',tmMin:'تصغير',tmFocus:'تركيز',tmRest:'راحة',tmRound:'جولة',tmBusy:'فما مؤقّت يخدم توّا',
 tmDone:'انتهى المؤقّت 🎉',tmEndFocus:'انتهى التركيز، وقت الراحة',tmEndBreak:'انتهت الراحة، نرجعو للتركيز',tmNextRound:'جولة جديدة',unitMin:'د',unitSec:'ث',
 jrNew:'يومية جديدة',jrNone:'ما كتبتش حتى حاجة بعد',jrMood:'المزاج',jrText:'كيفاش مشى نهارك؟',
 rdBooks:'كتب',rdQuran:'القرآن',rdNoBooks:'ما فما حتى كتاب',rdNewBook:'كتاب جديد',rdEditBook:'تعديل الكتاب',rdTitle:'عنوان الكتاب',rdAuthor:'المؤلف (اختياري)',rdPages:'عدد الصفحات',rdCur:'الصفحة الحالية',
 qrLast:'آخر صفحة قرأتها',qrJuz:'الجزء',qrKhatma:'ختمات',qrLeft:'باقي {n} يوم للختمة',qrToday:'اليوم',qrEdit:'تعديل',qrGoal:'الورد اليومي (صفحات)',qrPageSet:'آخر صفحة قرأتها (0-604)',qrKhatmaDone:'ختمة مباركة 🎉'
});
Object.assign(T.en,{
 more:'More',back:'Back',timers:'Timers',journal:'Journal',reading:'Reading',
 tm_prayer:'Prayer',tm_sport:'Sport',tm_study:'Study',tm_care:'Self-care',
 tmNew:'New timer',tmEdit:'Edit timer',tmName:'Name',tmWork:'Focus time (minutes)',tmBreak:'Break time (minutes)',tmRounds:'Rounds',tmHint:'0.5 = 30 seconds',
 tmSkip:'Skip',tmPause:'Pause',tmResume:'Resume',tmStop:'Stop',tmMin:'Minimize',tmFocus:'Focus',tmRest:'Rest',tmRound:'Round',tmBusy:'A timer is already running',
 tmDone:'Timer finished 🎉',tmEndFocus:'Focus is over, time to rest',tmEndBreak:'Break is over, back to focus',tmNextRound:'New round',unitMin:'min',unitSec:'s',
 jrNew:'New entry',jrNone:'Nothing written yet',jrMood:'Mood',jrText:'How did today go?',
 rdBooks:'Books',rdQuran:'Quran',rdNoBooks:'No books yet',rdNewBook:'New book',rdEditBook:'Edit book',rdTitle:'Book title',rdAuthor:'Author (optional)',rdPages:'Total pages',rdCur:'Current page',
 qrLast:'Last page read',qrJuz:'Juz',qrKhatma:'Khatmas',qrLeft:'{n} days left to finish',qrToday:'Today',qrEdit:'Edit',qrGoal:'Daily goal (pages)',qrPageSet:'Last page read (0-604)',qrKhatmaDone:'A blessed khatma 🎉'
});
Object.assign(IC,{
 timers:'<circle cx="12" cy="13" r="8"/><path d="M12 9v4l3 2M9 2h6"/>',
 journal:'<path d="M4 5a2 2 0 012-2h13v16H6a2 2 0 00-2 2z"/><path d="M8 7h7M8 11h5"/>',
 reading:'<path d="M2 5h7a3 3 0 013 3v12a2 2 0 00-2-2H2zM22 5h-7a3 3 0 00-3 3v12a2 2 0 012-2h8z"/>',
 more:'<circle cx="5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="19" cy="12" r="1.6"/>',
 play:'<path d="M8 5v14l11-7z"/>'
});

/* ---------- styles ---------- */
const st=document.createElement('style');
st.textContent=
'.hub{display:flex;flex-direction:column;gap:10px;align-items:flex-start;min-height:110px}'+
'.hub svg.i{width:30px;height:30px}'+
'.play{width:46px;height:46px;border-radius:50%;border:0;background:#111;color:#fff;display:grid;place-items:center;flex:none}'+
'.play svg{fill:#fff;stroke:#fff;width:20px;height:20px}'+
'.tmr-run{background:#111!important;color:#fff;display:flex;align-items:center;justify-content:space-between;cursor:pointer}'+
'.tmr-run .pill{background:#fff;color:#111}'+
'#tmr{position:fixed;inset:0;background:var(--bg);z-index:19;display:none;align-items:center;justify-content:center;text-align:center}'+
'#tmr.show{display:flex}'+
'.tmr-in{width:min(92vw,420px);padding:20px}'+
'.tmr-name{font-size:24px;font-weight:800}'+
'.tmr-phase{font-size:16px;color:var(--soft);margin:4px 0 16px}'+
'.tmr-ring{position:relative;width:min(72vw,300px);aspect-ratio:1;margin:0 auto}'+
'.tmr-ring svg{width:100%;height:100%;transform:rotate(-90deg)}'+
'.tmr-ring circle{fill:none;stroke-width:8}'+
'.tmr-ring .bg{stroke:rgba(0,0,0,.1)}'+
'.tmr-ring .fg{stroke:#111;stroke-linecap:round;transition:stroke-dashoffset .25s linear}'+
'.tmr-time{position:absolute;inset:0;display:grid;place-items:center;font-size:52px;font-weight:800;direction:ltr;font-variant-numeric:tabular-nums}'+
'.tmr-round{margin:14px 0 18px;font-weight:600}'+
'.moods{display:flex;gap:8px;justify-content:space-between}'+
'.moods button{flex:1;font-size:26px;padding:8px 0;border-radius:14px;border:2px solid transparent;background:#f2f2f2}'+
'.moods button.on{border-color:#111;background:#fff}'+
'.jrp{margin:6px 0 0;font-size:14px;color:var(--soft);display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden;white-space:pre-wrap}'+
'.dots7{display:flex;gap:6px;margin-top:8px}'+
'.dots7 i{width:14px;height:14px;border-radius:50%;border:2px solid #111}'+
'.dots7 i.f{background:#111}'+
'.big{font-size:34px;font-weight:800;line-height:1.1}';
document.head.appendChild(st);

/* ---------- state ---------- */
const DEFT=()=>[
 {id:'tp',k:'prayer',name:'',work:10,brk:0,rounds:1},
 {id:'ts',k:'sport',name:'',work:0.5,brk:0.25,rounds:8},
 {id:'td',k:'study',name:'',work:25,brk:5,rounds:4},
 {id:'tc',k:'care',name:'',work:15,brk:0,rounds:1}
];
function ensure(){
 if(!Array.isArray(S.timers))S.timers=DEFT();
 if(!Array.isArray(S.journal))S.journal=[];
 if(!Array.isArray(S.books))S.books=[];
 if(!S.quran||typeof S.quran!=='object')S.quran={done:0,goal:5,khatmas:0,log:{}};
 if(!S.quran.log)S.quran.log={};
}
const pname=p=>p.name||t('tm_'+p.k);
const fmtMin=m=>m<1?Math.round(m*60)+' '+t('unitSec'):(Math.round(m*100)/100)+' '+t('unitMin');
const tmSummary=p=>fmtMin(p.work)+(p.brk>0?' · '+t('tmRest')+' '+fmtMin(p.brk):'')+(p.rounds>1?' × '+p.rounds:'');
const mmss=ms=>{const s=Math.ceil(ms/1000),m=Math.floor(s/60);return z(m)+':'+z(s%60)};

/* ---------- views ---------- */
function vMore(){
 return '<div class="grid">'+['sheets','timers','journal','reading','settings'].map((k,i)=>'<div class="card note hub" data-a="tab" data-v="'+k+'" style="background:'+PASTEL[i%4]+'">'+svg(k)+'<b>'+t(k)+'</b></div>').join('')+'</div>';
}
function vTimers(){
 let h='';
 const p=S.timerRun&&curP();
 if(p)h+='<div class="card tmr-run" data-a="x_tmOpen"><b>'+esc(pname(p))+'</b><span class="pill" id="runPill">'+mmss(remaining())+'</span></div>';
 h+=S.timers.map((q,i)=>'<div class="card task" style="background:'+PASTEL[i%4]+'"><div class="tx" data-a="x_tmEdit" data-v="'+q.id+'"><div class="t">'+esc(pname(q))+'</div><div class="sub">'+esc(tmSummary(q))+'</div></div><button class="play" data-a="x_tmPlay" data-v="'+q.id+'" aria-label="start">'+svg('play')+'</button></div>').join('');
 return h;
}
function vJournal(){
 if(!S.journal.length)return '<div class="empty">'+t('jrNone')+'<br><br><button class="btn" data-a="x_jrNew">'+t('jrNew')+'</button></div>';
 return S.journal.slice().sort((a,b)=>a.date<b.date?1:a.date>b.date?-1:(b.ts||0)-(a.ts||0)).map((j,i)=>'<div class="card" data-a="x_jrOpen" data-v="'+j.id+'" style="background:'+PASTEL[i%4]+'"><div class="row"><b>'+esc(fmtDate(j.date))+'</b><span style="font-size:24px">'+esc(j.mood)+'</span></div><p class="jrp">'+esc(j.text)+'</p></div>').join('');
}
let rdTab='books';
const QP=604;
const juzOf=n=>n<=21?1:Math.min(30,Math.floor((n-2)/20)+1);
function qrStreak(){
 let d=new Date(),n=0;const L=S.quran.log;
 if(!(L[ymd(d)]>0))d.setDate(d.getDate()-1);
 while(L[ymd(d)]>0){n++;d.setDate(d.getDate()-1)}
 return n;
}
function vBooks(){
 if(!S.books.length)return '<div class="empty">'+t('rdNoBooks')+'</div>';
 return S.books.map((b,i)=>{
  const pct=b.pages>0?Math.min(100,Math.round(b.cur/b.pages*100)):0;
  return '<div class="card" style="background:'+PASTEL[i%4]+'"><div class="row"><b data-a="x_bkEdit" data-v="'+b.id+'">'+esc(b.title)+'</b><span class="pill">'+pct+'%</span></div>'+(b.author?'<div class="sub">'+esc(b.author)+'</div>':'')+'<div class="bar"><i style="width:'+pct+'%"></i></div><div class="row"><span class="sub">'+b.cur+' / '+b.pages+'</span><span><button class="btn sm alt" data-a="x_bkAdd" data-v="'+b.id+':-1">−1</button> <button class="btn sm alt" data-a="x_bkAdd" data-v="'+b.id+':1">+1</button> <button class="btn sm" data-a="x_bkAdd" data-v="'+b.id+':10">+10</button></span></div></div>';
 }).join('');
}
function vQuran(){
 const q=S.quran,L=q.log,td=L[today()]||0,goal=Math.max(1,q.goal);
 const pct=Math.round(q.done/QP*100),days=Math.ceil((QP-q.done)/goal),tpct=Math.min(100,Math.round(td/goal*100));
 let dots='';
 for(let i=6;i>=0;i--){const d=new Date();d.setDate(d.getDate()-i);dots+='<i class="'+(L[ymd(d)]>0?'f':'')+'"></i>'}
 return '<div class="card" style="background:'+PASTEL[1]+'"><div class="row"><div><div class="sub">'+t('qrLast')+'</div><div class="big">'+q.done+' / '+QP+'</div></div><span class="pill">'+t('qrJuz')+' '+juzOf(q.done)+'</span></div><div class="bar"><i style="width:'+pct+'%"></i></div><div class="row"><span class="sub">'+pct+'% · '+t('qrKhatma')+': '+q.khatmas+'</span><span class="sub">'+t('qrLeft').replace('{n}',days)+'</span></div></div>'
 +'<div class="card" style="background:'+PASTEL[3]+'"><div class="row"><b>'+t('qrToday')+'</b><span class="pill">'+td+' / '+goal+'</span></div><div class="bar"><i style="width:'+tpct+'%"></i></div><div class="actions"><button class="btn alt" data-a="x_qrAdd" data-v="-1">−1</button><button class="btn" data-a="x_qrAdd" data-v="1">+1</button><button class="btn" data-a="x_qrAdd" data-v="2">+2</button><button class="btn" data-a="x_qrAdd" data-v="5">+5</button></div></div>'
 +'<div class="card" style="background:'+PASTEL[2]+'"><b>'+qrStreak()+' '+t('streak')+'</b><div class="dots7">'+dots+'</div></div>'
 +'<button class="btn alt" style="width:100%" data-a="x_qrEdit">'+t('qrEdit')+'</button>';
}
function vReading(){
 const seg='<div class="seg"><button data-a="x_rdTab" data-v="books" class="'+(rdTab==='books'?'on':'')+'">'+t('rdBooks')+'</button><button data-a="x_rdTab" data-v="quran" class="'+(rdTab==='quran'?'on':'')+'">'+t('rdQuran')+'</button></div>';
 return seg+(rdTab==='books'?vBooks():vQuran());
}

/* ---------- overrides of core render / nav ---------- */
window.nav=function(){
 const on=k=>k==='more'?!['tasks','notes','goals'].includes(tab):tab===k;
 const b=k=>'<button data-a="tab" data-v="'+k+'" class="'+(on(k)?'on':'')+'" aria-label="'+t(k)+'">'+svg(k)+'</button>';
 return '<nav><div class="bar2">'+b('tasks')+b('notes')+'<button class="fab" data-a="add" aria-label="+">'+svg('plus')+'</button>'+b('goals')+b('more')+'</div></nav>';
};
window.render=function(){
 ensure();applyTheme();
 const V={tasks:vTasks,notes:vNotes,sheets:vSheets,goals:vGoals,settings:vSettings,more:vMore,timers:vTimers,journal:vJournal,reading:vReading};
 if(!V[tab])tab='tasks';
 const sub=['sheets','settings','timers','journal','reading'].includes(tab);
 const back=sub?'<button class="btn alt sm" data-a="tab" data-v="more" style="margin-bottom:6px">'+(S.lang==='ar'?'→ ':'← ')+t('back')+'</button>':'';
 $('#app').innerHTML=header()+back+'<h2>'+t(tab)+'</h2>'+V[tab]()+nav();
};

/* ---------- timer engine ---------- */
let tmrEl=null,tickId=null,wl=null,ac=null;
const curP=()=>S.timerRun&&S.timers.find(p=>p.id===S.timerRun.tid);
function remaining(){const r=S.timerRun;return r.paused!=null?r.paused:Math.max(0,r.endAt-Date.now())}
function phaseTotal(){const r=S.timerRun,p=curP();return (r.phase==='work'?p.work:p.brk)*60000}
async function wake(){try{if(navigator.wakeLock&&!wl)wl=await navigator.wakeLock.request('screen')}catch(e){}}
function unwake(){try{wl&&wl.release()}catch(e){}wl=null}
function audio(){try{if(!ac){const A=window.AudioContext||window.webkitAudioContext;if(A)ac=new A()}if(ac&&ac.state==='suspended')ac.resume()}catch(e){}}
function beep(){
 try{
  audio();if(!ac)return;
  [0,0.25,0.5].forEach((d,i)=>{
   const o=ac.createOscillator(),g=ac.createGain(),s=ac.currentTime+d;
   o.type='sine';o.frequency.value=i===2?988:784;
   g.gain.setValueAtTime(0.0001,s);g.gain.exponentialRampToValueAtTime(0.3,s+0.02);g.gain.exponentialRampToValueAtTime(0.0001,s+0.2);
   o.connect(g);g.connect(ac.destination);o.start(s);o.stop(s+0.22);
  });
 }catch(e){}
}
function notify(msg,body){
 beep();
 try{navigator.vibrate&&navigator.vibrate([250,120,250,120,400])}catch(e){}
 toast('⏱ '+msg);
 try{
  if('Notification' in window&&Notification.permission==='granted'&&navigator.serviceWorker){
   navigator.serviceWorker.ready.then(g=>g.showNotification(msg,{body:body,icon:'icon.svg',tag:'hadyr-timer',vibrate:[200,100,200]}));
  }
 }catch(e){}
}
function advance(){
 const r=S.timerRun,p=curP();
 if(!p){S.timerRun=null;return}
 const base=r.endAt,fresh=Date.now()-base<5000;
 if(r.phase==='work'){
  if(r.round>=p.rounds){S.timerRun=null;if(fresh)notify(t('tmDone'),pname(p));return}
  if(p.brk>0){r.phase='brk';r.endAt=base+p.brk*60000;if(fresh)notify(t('tmEndFocus'),pname(p))}
  else{r.round++;r.endAt=base+p.work*60000;if(fresh)notify(t('tmNextRound'),pname(p))}
 }else{
  r.round++;r.phase='work';r.endAt=base+p.work*60000;if(fresh)notify(t('tmEndBreak'),pname(p));
 }
}
function mkOverlay(){
 if(tmrEl)return;
 tmrEl=document.createElement('div');tmrEl.id='tmr';document.body.appendChild(tmrEl);
 tmrEl.addEventListener('click',e=>{
  const b=e.target.closest('[data-x]');if(!b)return;
  const r=S.timerRun;if(!r)return;
  switch(b.dataset.x){
   case 'pause':
    if(r.paused==null){r.paused=Math.max(0,r.endAt-Date.now());unwake()}
    else{r.endAt=Date.now()+r.paused;r.paused=null;wake()}
    save();drawTimer();break;
   case 'skip':
    if(r.paused!=null)r.paused=null;
    r.endAt=Date.now();tick();break;
   case 'stop':
    S.timerRun=null;save();unwake();hideTimer();render();break;
   case 'min':
    hideTimer(true);render();break;
  }
 });
}
function showTimer(){mkOverlay();tmrEl.classList.add('show');drawTimer();startTick()}
function hideTimer(keepRunning){if(tmrEl)tmrEl.classList.remove('show');if(!keepRunning||!S.timerRun)stopTick()}
function startTick(){if(!tickId)tickId=setInterval(tick,250)}
function stopTick(){if(tickId){clearInterval(tickId);tickId=null}}
function drawTimer(){
 const r=S.timerRun,p=r&&curP();
 if(!p){hideTimer();return}
 const C=2*Math.PI*52;
 tmrEl.innerHTML='<div class="tmr-in"><div class="tmr-name">'+esc(pname(p))+'</div><div class="tmr-phase" id="tmrPh"></div>'
  +'<div class="tmr-ring"><svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="52" class="bg"/><circle id="tmrFg" cx="60" cy="60" r="52" class="fg" stroke-dasharray="'+C+'"/></svg><div class="tmr-time" id="tmrT"></div></div>'
  +'<div class="tmr-round" id="tmrR"></div>'
  +'<div class="actions"><button class="btn alt" data-x="skip">'+t('tmSkip')+'</button><button class="btn" data-x="pause">'+(r.paused==null?t('tmPause'):t('tmResume'))+'</button><button class="btn danger" data-x="stop">'+t('tmStop')+'</button></div>'
  +'<button class="btn alt" data-x="min" style="margin-top:14px;width:100%">'+t('tmMin')+'</button></div>';
 paint();
}
function paint(){
 const r=S.timerRun,p=r&&curP();
 if(!p)return;
 const rem=remaining(),tot=phaseTotal(),C=2*Math.PI*52;
 const el=id=>document.getElementById(id);
 if(el('tmrT'))el('tmrT').textContent=mmss(rem);
 if(el('tmrFg'))el('tmrFg').style.strokeDashoffset=C*(1-(tot?rem/tot:0));
 if(el('tmrPh'))el('tmrPh').textContent=t(r.phase==='work'?'tmFocus':'tmRest');
 if(el('tmrR'))el('tmrR').textContent=t('tmRound')+' '+r.round+' / '+p.rounds;
 if(el('runPill'))el('runPill').textContent=mmss(rem);
}
function tick(){
 const r=S.timerRun;
 if(!r){stopTick();return}
 if(r.paused==null){
  let changed=false,guard=0;
  while(S.timerRun&&S.timerRun.paused==null&&Date.now()>=S.timerRun.endAt&&guard++<500){advance();changed=true}
  if(changed){
   save();
   if(!S.timerRun){unwake();hideTimer();render();return}
   drawTimer();
   if(tab==='timers')render();
  }
 }
 paint();
}
function startTimer(id){
 if(S.timerRun){toast(t('tmBusy'));showTimer();return}
 const p=S.timers.find(a=>a.id===id);if(!p)return;
 S.timerRun={tid:id,phase:'work',round:1,endAt:Date.now()+p.work*60000,paused:null};
 save();audio();wake();showTimer();
}
document.addEventListener('visibilitychange',()=>{
 if(!document.hidden&&S.timerRun){if(S.timerRun.paused==null)wake();tick()}
});

/* ---------- modals ---------- */
function tmModal(id){
 xe=id;
 const p=S.timers.find(a=>a.id===id)||{name:'',work:25,brk:5,rounds:4};
 modal('<h2>'+t(id?'tmEdit':'tmNew')+'</h2><label>'+t('tmName')+'</label><input id="m_name" value="'+esc(id?pname(p):'')+'"><label>'+t('tmWork')+'</label><input id="m_work" type="number" step="0.05" min="0.1" value="'+p.work+'"><div class="sub">'+t('tmHint')+'</div><label>'+t('tmBreak')+'</label><input id="m_brk" type="number" step="0.05" min="0" value="'+p.brk+'"><label>'+t('tmRounds')+'</label><input id="m_rounds" type="number" min="1" max="99" value="'+p.rounds+'">'+acts('x_tmSave',id?'x_tmDel':''));
}
function saveTm(){
 const o={
  name:$('#m_name').value.trim()||t('tmNew'),
  work:Math.max(0.1,+$('#m_work').value||25),
  brk:Math.max(0,+$('#m_brk').value||0),
  rounds:Math.min(99,Math.max(1,Math.round(+$('#m_rounds').value||1)))
 };
 if(xe)Object.assign(S.timers.find(a=>a.id===xe),o);else S.timers.push(Object.assign({id:uid(),k:'custom'},o));
 save();closeModal();render();
}
const MOODS=['😄','🙂','😐','😔','😢'];
let jrM='🙂';
function jrModal(id){
 xe=id;
 const j=S.journal.find(a=>a.id===id)||{date:today(),mood:'🙂',text:''};
 jrM=j.mood;
 modal('<h2>'+t(id?'journal':'jrNew')+'</h2><label>'+t('date')+'</label><input id="j_date" type="date" value="'+esc(j.date)+'"><label>'+t('jrMood')+'</label><div class="moods">'+MOODS.map(m=>'<button data-a="x_mood" data-v="'+m+'" class="'+(m===jrM?'on':'')+'">'+m+'</button>').join('')+'</div><label>'+t('jrText')+'</label><textarea id="j_text">'+esc(j.text)+'</textarea>'+acts('x_jrSave',id?'x_jrDel':''));
}
function saveJr(){
 const text=$('#j_text').value.trim();if(!text)return;
 const o={date:$('#j_date').value||today(),mood:jrM,text:text};
 if(xe)Object.assign(S.journal.find(a=>a.id===xe),o);else S.journal.unshift(Object.assign({id:uid(),ts:Date.now()},o));
 save();closeModal();render();
}
function bkModal(id){
 xe=id;
 const b=S.books.find(a=>a.id===id)||{title:'',author:'',pages:300,cur:0};
 modal('<h2>'+t(id?'rdEditBook':'rdNewBook')+'</h2><label>'+t('rdTitle')+'</label><input id="b_title" value="'+esc(b.title)+'"><label>'+t('rdAuthor')+'</label><input id="b_author" value="'+esc(b.author)+'"><label>'+t('rdPages')+'</label><input id="b_pages" type="number" min="1" value="'+b.pages+'"><label>'+t('rdCur')+'</label><input id="b_cur" type="number" min="0" value="'+b.cur+'">'+acts('x_bkSave',id?'x_bkDel':''));
}
function saveBk(){
 const title=$('#b_title').value.trim();if(!title)return;
 const pages=Math.max(1,Math.round(+$('#b_pages').value||1));
 const o={title:title,author:$('#b_author').value.trim(),pages:pages,cur:Math.min(pages,Math.max(0,Math.round(+$('#b_cur').value||0)))};
 if(xe)Object.assign(S.books.find(a=>a.id===xe),o);else S.books.unshift(Object.assign({id:uid()},o));
 save();closeModal();render();
}
function qrModal(){
 const q=S.quran;
 modal('<h2>'+t('rdQuran')+'</h2><label>'+t('qrPageSet')+'</label><input id="q_done" type="number" min="0" max="'+QP+'" value="'+q.done+'"><label>'+t('qrGoal')+'</label><input id="q_goal" type="number" min="1" max="'+QP+'" value="'+q.goal+'"><label>'+t('qrKhatma')+'</label><input id="q_kh" type="number" min="0" value="'+q.khatmas+'">'+acts('x_qrSave',''));
}
function saveQr(){
 const q=S.quran;
 q.done=Math.min(QP-1,Math.max(0,Math.round(+$('#q_done').value||0)));
 q.goal=Math.min(QP,Math.max(1,Math.round(+$('#q_goal').value||1)));
 q.khatmas=Math.max(0,Math.round(+$('#q_kh').value||0));
 save();closeModal();render();
}

/* ---------- events ---------- */
// the + button: intercept it on the pages that belong to this file
document.addEventListener('click',e=>{
 const el=e.target.closest('[data-a]');
 if(!el||el.dataset.a!=='add')return;
 const h={timers:()=>tmModal(),journal:()=>jrModal(),reading:()=>{rdTab==='books'?bkModal():qrModal()}};
 if(h[tab]){e.stopPropagation();h[tab]()}
},true);
document.addEventListener('click',e=>{
 const el=e.target.closest('[data-a]');if(!el)return;
 const a=el.dataset.a,v=el.dataset.v;
 if(a.slice(0,2)!=='x_')return;
 switch(a){
  case 'x_tmPlay':startTimer(v);break;
  case 'x_tmEdit':tmModal(v);break;
  case 'x_tmSave':saveTm();break;
  case 'x_tmDel':S.timers=S.timers.filter(q=>q.id!==xe);save();closeModal();render();break;
  case 'x_tmOpen':showTimer();break;
  case 'x_jrNew':jrModal();break;
  case 'x_jrOpen':jrModal(v);break;
  case 'x_jrSave':saveJr();break;
  case 'x_jrDel':S.journal=S.journal.filter(q=>q.id!==xe);save();closeModal();render();break;
  case 'x_mood':jrM=v;document.querySelectorAll('.moods button').forEach(b=>b.classList.toggle('on',b.dataset.v===jrM));break;
  case 'x_rdTab':rdTab=v;render();break;
  case 'x_bkEdit':bkModal(v);break;
  case 'x_bkSave':saveBk();break;
  case 'x_bkDel':S.books=S.books.filter(q=>q.id!==xe);save();closeModal();render();break;
  case 'x_bkAdd':{
   const p=v.split(':'),b=S.books.find(q=>q.id===p[0]);
   if(b){b.cur=Math.min(b.pages,Math.max(0,b.cur+(+p[1])));save();render()}
   break}
  case 'x_qrEdit':qrModal();break;
  case 'x_qrSave':saveQr();break;
  case 'x_qrAdd':{
   const q=S.quran,d=today(),cur=q.log[d]||0,nn=Math.max(0,cur+(+v)),delta=nn-cur;
   q.log[d]=nn;q.done=Math.max(0,q.done+delta);
   let ended=false;
   while(q.done>=QP){q.done-=QP;q.khatmas++;ended=true}
   save();render();
   if(ended)toast(t('qrKhatmaDone'));
   break}
 }
});

/* ---------- start ---------- */
ensure();
render();
if(S.timerRun){showTimer();tick()}
})();
