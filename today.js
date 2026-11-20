/* hadyr today: "today" home page + backup reminders */
(function(){
'use strict';
Object.assign(T.ar,{today:'اليوم',gMorning:'صباح الخير',gEvening:'مساء الخير',tdTasks:'مهام اليوم',tdNone:'ما عندك حتى مهمة لليوم 🎉',tdMore:'شوف الكل',tdHabits:'العادات',tdTimers:'مؤقتات سريعة',tdHome:'افتح التطبيق على هذي الصفحة',tdPrayer:'الصلاة الجاية',tdIn:'بعد',
 backup:'النسخة الاحتياطية',bkSave:'احفظ نسخة في التيليفون',bkShare:'ابعث / شارك النسخة',bkLast:'آخر نسخة',bkNever:'ما عملتش حتى نسخة',bkAgo:'قبل',bkDays:'يوم',bkToday:'اليوم',bkFreq:'ذكّرني بالنسخة كل',bkOff:'ما نحبش',bkD3:'3 أيام',bkD7:'أسبوع',bkD14:'أسبوعين',bkD30:'شهر',bkImport:'استرجع من نسخة',bkSaved:'تحفظت النسخة ✓',bkNote:'بياناتك محفوظة داخل التطبيق فقط. كان تمسح بيانات Chrome ولا تبدّل التيليفون تضيع، ولهذا احفظ نسخة وابعثها لروحك على واتساب ولا Drive.',bkDue:'وقت النسخة الاحتياطية',bkDueSub:'احفظ نسخة باش ما تضيّعش بياناتك',bkNow:'احفظ دبا'});
Object.assign(T.en,{today:'Today',gMorning:'Good morning',gEvening:'Good evening',tdTasks:"Today's tasks",tdNone:'No tasks for today 🎉',tdMore:'See all',tdHabits:'Habits',tdTimers:'Quick timers',tdHome:'Open the app on this page',tdPrayer:'Next prayer',tdIn:'in',
 backup:'Backup',bkSave:'Save a copy to the phone',bkShare:'Send / share the copy',bkLast:'Last backup',bkNever:'No backup yet',bkAgo:'',bkDays:'days ago',bkToday:'today',bkFreq:'Remind me to back up every',bkOff:'Never',bkD3:'3 days',bkD7:'week',bkD14:'2 weeks',bkD30:'month',bkImport:'Restore from a backup',bkSaved:'Backup saved ✓',bkNote:'Your data lives only inside the app. If you clear Chrome data or change phones it is lost, so save a copy and send it to yourself on WhatsApp or Drive.',bkDue:'Backup time',bkDueSub:"Save a copy so you don't lose your data",bkNow:'Save now'});
IC.today='<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M19 5l-1.5 1.5M6.5 17.5L5 19"/>';
IC.backup='<path d="M12 3v12M7 10l5 5 5-5"/><path d="M4 17v3h16v-3"/>';

function ensureB(){
 if(!S.backup||typeof S.backup!=='object')S.backup={};
 if(typeof S.backup.last!=='string')S.backup.last='';
 if(typeof S.backup.freq!=='number')S.backup.freq=7;
 if(typeof S.home!=='boolean')S.home=true;
}
ensureB();
try{navigator.storage&&navigator.storage.persist&&navigator.storage.persist()}catch(e){}

const dayDiff=(a,b)=>Math.round((new Date(b+'T00:00:00')-new Date(a+'T00:00:00'))/86400000);
function bkDays(){ensureB();return S.backup.last?dayDiff(S.backup.last,ymd(new Date())):999}
function bkDue(){
 ensureB();if(!S.backup.freq)return false;
 const has=S.tasks.length+S.notes.length+S.goals.length+S.sheets.length+((S.journal||[]).length)+((S.books||[]).length);
 return has>0&&bkDays()>=S.backup.freq;
}
function mkFile(){return new File([JSON.stringify(S)],'hadyr-backup-'+ymd(new Date())+'.json',{type:'application/json'})}
function markSaved(){ensureB();S.backup.last=ymd(new Date());save();toast(t('bkSaved'))}
function doSave(){
 const f=mkFile(),u=URL.createObjectURL(f),l=document.createElement('a');
 l.href=u;l.download=f.name;document.body.appendChild(l);l.click();l.remove();setTimeout(()=>URL.revokeObjectURL(u),3000);
 markSaved();render();
}
async function doShare(){
 try{
  const f=mkFile();
  if(navigator.canShare&&navigator.canShare({files:[f]})){await navigator.share({files:[f],title:'hadyr backup'});markSaved();render();return}
 }catch(e){if(e&&e.name==='AbortError')return}
 doSave();
}

const st=document.createElement('style');
st.textContent='.hi{font-size:22px;font-weight:800;margin:2px 2px 10px}.tdp{display:flex;justify-content:space-between;align-items:center;gap:10px}.tdp .big{font-size:30px;font-weight:800}.chips{display:flex;gap:8px;flex-wrap:wrap}.chips button{border:0;border-radius:999px;padding:8px 14px;font:inherit;font-weight:600;background:#fff;color:#111;box-shadow:0 1px 3px rgba(0,0,0,.12)}.dueb{display:flex;align-items:center;justify-content:space-between;gap:10px;background:#fbeab8}.cap{font-size:13px;font-weight:700;color:var(--soft);margin:12px 4px 6px}.hb{display:flex;align-items:center;justify-content:space-between;gap:10px}';
document.head.appendChild(st);

const nmap=n=>'p'+n.charAt(0).toUpperCase()+n.slice(1);
const cd=ms=>{const s=Math.max(0,Math.floor(ms/1000)),h=Math.floor(s/3600),m=Math.floor(s%3600/60);return (h?h+(S.lang==='ar'?' س ':'h '):'')+z(m)+(S.lang==='ar'?' د ':'m ')+z(s%60)+(S.lang==='ar'?' ث':'s')};
function vToday(){
 ensureB();const now=new Date(),td=ymd(now),hr=now.getHours();
 let h='<div class="hi">'+(hr<12?t('gMorning'):t('gEvening'))+' ♥</div>';
 if(bkDue())h+='<div class="card dueb"><div><b>'+t('bkDue')+'</b><div class="sub">'+t('bkDueSub')+'</div></div><button class="btn" data-a="d_bkshare">'+t('bkNow')+'</button></div>';
 if(window.__prayer){
  try{const nx=window.__prayer.nextPrayer(now);
   if(nx)h+='<div class="card tdp" data-a="tab" data-v="prayer" style="background:'+PASTEL[1]+'"><div><div class="sub">'+t('tdPrayer')+'</div><div class="big" id="tdPn">'+t(nmap(nx.n))+' '+z(nx.t.getHours())+':'+z(nx.t.getMinutes())+'</div></div><span class="pill" id="tdLeft">'+t('tdIn')+' '+cd(nx.t-now)+'</span></div>';
  }catch(e){}
 }
 const pool=S.tasks.filter(x=>x.date===td||(!x.done&&taskBucket(x)==='today'));
 const open=pool.filter(x=>!x.done).sort((a,b)=>(a.time||'99:99').localeCompare(b.time||'99:99'));
 const done=pool.length-open.length,pct=pool.length?Math.round(done/pool.length*100):0;
 h+='<div class="cap">'+t('tdTasks')+(pool.length?' · '+done+'/'+pool.length:'')+'</div>';
 if(pool.length)h+='<div class="bar" style="margin:0 2px 8px"><i style="width:'+pct+'%"></i></div>';
 if(!open.length)h+='<div class="card" style="background:'+PASTEL[1]+'">'+t('tdNone')+'</div>';
 h+=open.slice(0,6).map((x,i)=>'<div class="card task" style="background:'+PASTEL[i%4]+'"><button class="chk" data-a="toggle" data-v="'+x.id+'"></button><div class="tx" data-a="editTask" data-v="'+x.id+'"><div class="t">'+esc(x.text)+'</div></div>'+(x.time?'<span class="pill">'+esc(x.time)+'</span>':'')+'</div>').join('');
 if(open.length>6)h+='<div class="actions"><button class="btn alt sm" data-a="tab" data-v="tasks">'+t('tdMore')+' ('+(open.length-6)+')</button></div>';
 const habits=S.goals.filter(g=>g.type==='habit');
 if(habits.length){
  h+='<div class="cap">'+t('tdHabits')+'</div>'+habits.map((g,i)=>{const on=(g.days||[]).includes(td);
   return '<div class="card hb" style="background:'+PASTEL[(i+2)%4]+'"><div><b>'+esc(g.title)+'</b><div class="sub">'+streak(g)+' '+t('streak')+'</div></div><button class="btn'+(on?' alt':'')+'" data-a="checkin" data-v="'+g.id+'">'+(on?t('undo'):t('checkin'))+'</button></div>'}).join('');
 }
 if(Array.isArray(S.timers)&&S.timers.length){
  h+='<div class="cap">'+t('tdTimers')+'</div><div class="chips">'+S.timers.map(q=>'<button data-a="x_tmPlay" data-v="'+q.id+'">▶ '+esc(q.name||t('tm_'+q.k))+'</button>').join('')+'</div>';
 }
 h+='<label style="display:flex;gap:8px;align-items:center;margin:18px 2px 0;font-weight:600"><input id="td_home" type="checkbox" style="width:auto" '+(S.home?'checked':'')+'>'+t('tdHome')+'</label>';
 return h;
}

function vBackup(){
 ensureB();const d=bkDays();
 const last=!S.backup.last?t('bkNever'):(d===0?t('bkToday'):(S.lang==='ar'?t('bkAgo')+' '+d+' '+t('bkDays'):d+' '+t('bkDays')));
 const F=[[0,'bkOff'],[3,'bkD3'],[7,'bkD7'],[14,'bkD14'],[30,'bkD30']];
 return '<div class="card" style="background:'+PASTEL[1]+'"><div class="sub">'+t('bkLast')+'</div><div class="big" style="font-size:26px;font-weight:800">'+esc(last)+'</div><div class="sub" style="margin-top:6px">'+t('bkNote')+'</div></div>'
  +'<button class="btn" style="width:100%;margin-bottom:8px" data-a="d_bksave">'+t('bkSave')+'</button>'
  +'<button class="btn" style="width:100%;margin-bottom:8px" data-a="d_bkshare">'+t('bkShare')+'</button>'
  +'<button class="btn alt" style="width:100%;margin-bottom:14px" data-a="import">'+t('bkImport')+'</button>'
  +'<div class="card"><label>'+t('bkFreq')+'</label><div class="seg" style="margin:0;flex-wrap:wrap">'+F.map(f=>'<button data-a="d_freq" data-v="'+f[0]+'" class="'+(S.backup.freq===f[0]?'on':'')+'">'+t(f[1])+'</button>').join('')+'</div></div>';
}

const prevRender=window.render;
window.render=function(){
 if(tab==='today'||tab==='backup'){
  applyTheme();document.body.dataset.tab=tab;
  const back=tab==='backup'?'<button class="btn alt sm" data-a="tab" data-v="more" style="margin-bottom:6px">'+(S.lang==='ar'?'→ ':'← ')+t('back')+'</button>':'';
  $('#app').innerHTML=header()+back+(tab==='backup'?'<h2>'+t('backup')+'</h2>'+vBackup():vToday())+nav();
  return;
 }
 prevRender();
 if(tab==='more'){
  const g=document.querySelector('#app .grid');
  if(g){
   const mk=(k,i)=>{if(g.querySelector('[data-v="'+k+'"]'))return null;const d=document.createElement('div');d.className='card note hub';d.dataset.a='tab';d.dataset.v=k;d.style.background=PASTEL[i];d.innerHTML=svg(k)+'<b>'+t(k)+'</b>';return d};
   const a=mk('today',0),b=mk('backup',2);
   if(a)g.insertBefore(a,g.firstChild);
   if(b)g.appendChild(b);
  }
 }
};

document.addEventListener('click',e=>{
 const el=e.target.closest('[data-a]');if(!el)return;
 const a=el.dataset.a,v=el.dataset.v;
 if(a==='add'&&(tab==='today'||tab==='backup')){e.stopPropagation();if(tab==='today')taskModal(null);return}
 if(a.slice(0,2)!=='d_')return;
 if(a==='d_bksave')doSave();
 else if(a==='d_bkshare')doShare();
 else if(a==='d_freq'){ensureB();S.backup.freq=+v;save();render()}
},true);
document.addEventListener('change',e=>{
 if(e.target.id==='td_home'){S.home=e.target.checked;save()}
});

setInterval(()=>{
 if(tab!=='today'||!window.__prayer)return;
 const l=document.getElementById('tdLeft');if(!l)return;
 try{const now=new Date(),nx=window.__prayer.nextPrayer(now);if(!nx)return;
  l.textContent=t('tdIn')+' '+cd(nx.t-now);
  const n=document.getElementById('tdPn');if(n&&n.textContent.indexOf(t(nmap(nx.n)))!==0)render();
 }catch(e){}
},1000);

if(S.home&&tab==='tasks'){tab='today'}
render();
setTimeout(()=>{if(bkDue())toast('💾 '+t('bkDue'))},2500);
window.__today={vToday,bkDue};
})();
