/* hadyr tools: search, water & sleep, tasbih, expense sheet template */
(function(){
'use strict';
Object.assign(T.ar,{search:'البحث',health:'الماء والنوم',tasbih:'المسبحة',
 srPh:'ابحث في المهام والملاحظات والجداول...',srNone:'ما لقيت حتى حاجة',srTask:'مهمة',srNote:'ملاحظة',srGoal:'هدف',srSheet:'جدول',srJr:'يوميات',srBook:'كتاب',srHint:'اكتب كلمة باش نلوّج عليها في كل التطبيق',
 hWater:'الماء',hGlass:'كاس',hGoal:'الهدف',hSleep:'النوم',hBed:'وقت النوم',hWake:'وقت الفيقة',hHours:'ساعة',hWeek:'آخر 7 أيام',hRemind:'ذكّرني نشرب الما كل',hOff:'ما نحبش',hRemindMsg:'وقت تشرب كاس ما 💧',hL:'لتر',hSleepGoal:'هدف النوم',
 tsToday:'اليوم',tsRounds:'دورات',tsReset:'صفر',tsTarget:'الهدف',tsDone:'اكتملت الدورة',tsFree:'حرّ',
 exTpl:'+ قالب مصاريف الشهر',exTitle:'مصاريف الشهر',exCat:'الفئة',exW:'أسبوع',exTot:'المجموع',exBud:'الميزانية',exLeft:'المتبقي',exFood:'طعام',exTrans:'مواصلات',exBills:'فواتير',exFun:'ترفيه',exHealth:'صحة',exOther:'أخرى',exInc:'الدخل',exBal:'الرصيد'});
Object.assign(T.en,{search:'Search',health:'Water & sleep',tasbih:'Tasbih',
 srPh:'Search tasks, notes, sheets...',srNone:'Nothing found',srTask:'Task',srNote:'Note',srGoal:'Goal',srSheet:'Sheet',srJr:'Journal',srBook:'Book',srHint:'Type a word to search the whole app',
 hWater:'Water',hGlass:'glasses',hGoal:'Goal',hSleep:'Sleep',hBed:'Bedtime',hWake:'Wake-up',hHours:'h',hWeek:'Last 7 days',hRemind:'Remind me to drink every',hOff:'Never',hRemindMsg:'Time for a glass of water 💧',hL:'L',hSleepGoal:'Sleep goal',
 tsToday:'Today',tsRounds:'rounds',tsReset:'Reset',tsTarget:'Target',tsDone:'Round complete',tsFree:'Free',
 exTpl:'+ Monthly budget template',exTitle:'Monthly budget',exCat:'Category',exW:'Week',exTot:'Total',exBud:'Budget',exLeft:'Left',exFood:'Food',exTrans:'Transport',exBills:'Bills',exFun:'Fun',exHealth:'Health',exOther:'Other',exInc:'Income',exBal:'Balance'});
IC.search='<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>';
IC.health='<path d="M12 3c3 4 6 7 6 11a6 6 0 01-12 0c0-4 3-7 6-11z"/>';
IC.tasbih='<circle cx="12" cy="12" r="9"/><circle cx="12" cy="6" r="1"/><circle cx="17" cy="9" r="1"/><circle cx="17" cy="15" r="1"/><circle cx="12" cy="18" r="1"/><circle cx="7" cy="15" r="1"/><circle cx="7" cy="9" r="1"/>';

const DHIKR=['سبحان الله','الحمد لله','الله أكبر','لا إله إلا الله','أستغفر الله','اللهم صلّ على محمد'];
const TARGETS=[33,99,100,0];

function ensure(){
 if(!S.health||typeof S.health!=='object')S.health={};
 const h=S.health;
 if(!h.water)h.water={};if(!h.sleep)h.sleep={};
 if(typeof h.goal!=='number')h.goal=8;
 if(typeof h.sgoal!=='number')h.sgoal=8;
 if(typeof h.wrem!=='number')h.wrem=0;
 if(typeof h.wlast!=='number')h.wlast=0;
 if(!S.tasbih||typeof S.tasbih!=='object')S.tasbih={};
 const s=S.tasbih;
 if(typeof s.n!=='number')s.n=0;
 if(typeof s.target!=='number')s.target=33;
 if(typeof s.label!=='number')s.label=0;
 if(!s.log)s.log={};if(!s.rounds)s.rounds={};
}
ensure();

const st=document.createElement('style');
st.textContent='.srch{position:sticky;top:0;z-index:5}.sres .card{cursor:pointer}.sres .k{font-size:12px;font-weight:700;color:var(--soft)}.sres mark{background:var(--ac);border-radius:4px;padding:0 2px}'
+'.wbtn{display:flex;gap:10px;align-items:center;justify-content:center;margin:10px 0}.wbtn button{width:64px;height:64px;border-radius:50%;border:0;font-size:30px;font-weight:800;background:#fff;color:#111;box-shadow:0 1px 4px rgba(0,0,0,.18)}.wbtn button.big{background:#111;color:#fff}.wbtn .n{font-size:44px;font-weight:800;min-width:90px;text-align:center}'
+'.wk{display:flex;gap:6px;align-items:flex-end;height:90px;margin-top:8px}.wk div{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;height:100%;font-size:11px;font-weight:700}.wk i{display:block;width:100%;border-radius:6px 6px 2px 2px;background:var(--ac);min-height:3px}.wk i.f{background:#111}.wk span{margin-top:3px;font-weight:600;color:var(--soft)}'
+'.tsb{width:230px;height:230px;border-radius:50%;border:0;background:#111;color:#fff;font-size:64px;font-weight:800;display:block;margin:18px auto;touch-action:manipulation;-webkit-user-select:none;user-select:none;box-shadow:0 6px 18px rgba(0,0,0,.25)}.tsb:active{transform:scale(.97)}.tsl{text-align:center;font-size:26px;font-weight:800;margin-top:6px}.tss{text-align:center;color:var(--soft);font-weight:600}.hrow{display:flex;gap:8px;flex-wrap:wrap}.hrow button{border:2px solid transparent;border-radius:999px;padding:8px 14px;font:inherit;font-weight:600;background:rgba(0,0,0,.06);color:#111}.hrow button.on{border-color:#111;background:#fff}';
document.head.appendChild(st);

const today=()=>ymd(new Date());
const back=()=>'<button class="btn alt sm" data-a="tab" data-v="more" style="margin-bottom:6px">'+(S.lang==='ar'?'→ ':'← ')+t('back')+'</button>';
const lastDays=n=>{const a=[];for(let i=n-1;i>=0;i--){const d=new Date();d.setDate(d.getDate()-i);a.push(d)}return a};
const wd=d=>d.toLocaleDateString(S.lang==='ar'?'ar-TN':'en-GB',{weekday:'short'});

const norm=s=>String(s||'').toLowerCase().replace(/[\u064B-\u0652\u0640]/g,'').replace(/[أإآ]/g,'ا').replace(/ى/g,'ي').replace(/ة/g,'ه');
function snippet(text,q){
 const raw=String(text||''),n=norm(raw),i=n.indexOf(q);
 if(i<0)return esc(raw.slice(0,70));
 const a=Math.max(0,i-25),b=Math.min(raw.length,i+q.length+45);
 return (a>0?'…':'')+esc(raw.slice(a,i))+'<mark>'+esc(raw.slice(i,i+q.length))+'</mark>'+esc(raw.slice(i+q.length,b))+(b<raw.length?'…':'');
}
function searchAll(qs){
 const q=norm(qs.trim());if(!q)return [];
 const out=[],add=(k,id,title,txt,key)=>out.push({k,id,title,txt,key});
 S.tasks.forEach(x=>{if(norm(x.text).includes(q))add('task',x.id,x.text,(x.date||'')+(x.time?' '+x.time:''),'srTask')});
 S.notes.forEach(x=>{if(x.locked)return;const body=x.body||'';if(norm(x.title).includes(q))add('note',x.id,x.title||'',body.slice(0,70),'srNote');else if(norm(body).includes(q))add('note',x.id,x.title||'',body,'srNote')});
 S.goals.forEach(x=>{if(norm(x.title).includes(q))add('goal',x.id,x.title,'','srGoal')});
 S.sheets.forEach(sh=>{
  let hit=norm(sh.title).includes(q)?(sh.title||''):'';
  if(!hit)(sh.data||[]).some(r=>(r||[]).some(c=>{if(c&&c[0]!=='='&&norm(c).includes(q)){hit=c;return true}}));
  if(hit)add('sheet',sh.id,sh.title||t('newSheet'),hit,'srSheet');
 });
 (S.journal||[]).forEach(x=>{if(norm(x.text).includes(q))add('jr',x.id,(x.mood||'')+' '+x.date,x.text,'srJr')});
 (S.books||[]).forEach(x=>{if(norm(x.title+' '+(x.author||'')).includes(q))add('book',x.id,x.title,x.author||'','srBook')});
 return out.slice(0,60).map(r=>Object.assign(r,{q}));
}
function resHTML(qs){
 const q=norm(qs.trim());if(!q)return '<div class="empty">'+t('srHint')+'</div>';
 const rs=searchAll(qs);if(!rs.length)return '<div class="empty">'+t('srNone')+'</div>';
 return rs.map((r,i)=>'<div class="card" data-a="s_open" data-v="'+r.k+':'+r.id+'" style="background:'+PASTEL[i%4]+'"><div class="k">'+t(r.key)+'</div><b>'+esc(r.title)+'</b><div class="sub">'+snippet(r.txt,q)+'</div></div>').join('');
}
let lastQ='';
function vSearch(){return '<div class="srch"><input id="sq" type="search" placeholder="'+esc(t('srPh'))+'" value="'+esc(lastQ)+'" style="width:100%;margin-bottom:10px"></div><div class="sres" id="sres">'+resHTML(lastQ)+'</div>'}
function openResult(v){
 const i=v.indexOf(':'),k=v.slice(0,i),id=v.slice(i+1);
 if(k==='task')taskModal(id);
 else if(k==='note')noteModal(id);
 else if(k==='goal')goalModal(id);
 else if(k==='sheet')sheetModal(id);
 else if(k==='jr'){tab='journal';render()}
 else if(k==='book'){tab='reading';render()}
}

const hrs=(bed,wake)=>{if(!bed||!wake)return 0;const a=bed.split(':'),b=wake.split(':'),m=((+b[0]*60+ +b[1])-(+a[0]*60+ +a[1])+1440)%1440;return Math.round(m/6)/10};
function vHealth(){
 ensure();const h=S.health,td=today(),w=h.water[td]||0,sl=h.sleep[td]||{bed:'',wake:''},sh=hrs(sl.bed,sl.wake);
 const days=lastDays(7);
 const wbars=days.map(d=>{const k=ymd(d),v=h.water[k]||0,p=Math.min(100,Math.round(v/h.goal*100));return '<div><b>'+v+'</b><i class="'+(v>=h.goal?'f':'')+'" style="height:'+Math.max(3,p*0.62)+'px"></i><span>'+wd(d)+'</span></div>'}).join('');
 const sbars=days.map(d=>{const k=ymd(d),s=h.sleep[k],v=s?hrs(s.bed,s.wake):0,p=Math.min(100,Math.round(v/h.sgoal*100));return '<div><b>'+(v||'')+'</b><i class="'+(v>=h.sgoal?'f':'')+'" style="height:'+Math.max(3,p*0.62)+'px"></i><span>'+wd(d)+'</span></div>'}).join('');
 const R=[0,2,3,4].map(x=>'<button data-a="s_wrem" data-v="'+x+'" class="'+(h.wrem===x?'on':'')+'">'+(x?x+' '+t('hHours'):t('hOff'))+'</button>').join('');
 return '<div class="card" style="background:'+PASTEL[0]+'"><label>💧 '+t('hWater')+'</label>'
  +'<div class="wbtn"><button data-a="s_wm">−</button><div class="n" id="wn">'+w+'<span style="font-size:18px">/'+h.goal+'</span></div><button class="big" data-a="s_wp">+</button></div>'
  +'<div class="sub" style="text-align:center" id="wl">'+(w*0.25).toFixed(2).replace(/\.?0+$/,'')+' '+t('hL')+' · '+t('hGlass')+' 250ml</div>'
  +'<div class="hrow" style="justify-content:center;margin-top:10px"><button data-a="s_gm">'+t('hGoal')+' −</button><button data-a="s_gp">'+t('hGoal')+' +</button></div>'
  +'<div class="wk">'+wbars+'</div></div>'
  +'<div class="card" style="background:'+PASTEL[1]+'"><label>'+t('hRemind')+'</label><div class="hrow">'+R+'</div></div>'
  +'<div class="card" style="background:'+PASTEL[2]+'"><label>🌙 '+t('hSleep')+'</label>'
  +'<label>'+t('hBed')+'</label><input id="sl_bed" type="time" value="'+esc(sl.bed||'')+'"><label>'+t('hWake')+'</label><input id="sl_wake" type="time" value="'+esc(sl.wake||'')+'">'
  +'<div class="big" id="sl_h" style="font-size:30px;font-weight:800;text-align:center;margin-top:10px">'+(sh?sh+' '+t('hHours'):'—')+'</div>'
  +'<div class="hrow" style="justify-content:center;margin-top:8px"><button data-a="s_sm">'+t('hSleepGoal')+' −</button><span style="align-self:center;font-weight:800">'+h.sgoal+' '+t('hHours')+'</span><button data-a="s_sp">'+t('hSleepGoal')+' +</button></div>'
  +'<div class="wk">'+sbars+'</div></div>';
}

function vTasbih(){
 ensure();const s=S.tasbih,td=today();
 const L=DHIKR.map((x,i)=>'<button data-a="s_lbl" data-v="'+i+'" class="'+(s.label===i?'on':'')+'">'+x+'</button>').join('');
 const G=TARGETS.map(x=>'<button data-a="s_tg" data-v="'+x+'" class="'+(s.target===x?'on':'')+'">'+(x||t('tsFree'))+'</button>').join('');
 return '<div class="tsl" id="tsl">'+DHIKR[s.label]+'</div>'
  +'<button class="tsb" data-a="s_tap" id="tsn" aria-label="count">'+s.n+'</button>'
  +'<div class="tss" id="tss">'+(s.target?'/ '+s.target+' · ':'')+t('tsToday')+': '+(s.log[td]||0)+' · '+(s.rounds[td]||0)+' '+t('tsRounds')+'</div>'
  +'<div class="actions" style="justify-content:center;margin:12px 0"><button class="btn alt" data-a="s_ts0">'+t('tsReset')+'</button></div>'
  +'<div class="card"><label>'+t('tsTarget')+'</label><div class="hrow">'+G+'</div></div>'
  +'<div class="card"><div class="hrow">'+L+'</div></div>';
}
let tsSave=0;
function tap(){
 ensure();const s=S.tasbih,td=today();
 s.n++;s.log[td]=(s.log[td]||0)+1;
 let done=false;
 if(s.target&&s.n>=s.target){done=true;s.rounds[td]=(s.rounds[td]||0)+1;s.n=0}
 try{navigator.vibrate&&navigator.vibrate(done?[200,100,200]:15)}catch(e){}
 const b=document.getElementById('tsn'),i=document.getElementById('tss');
 if(b)b.textContent=s.n;
 if(i)i.textContent=(s.target?'/ '+s.target+' · ':'')+t('tsToday')+': '+(s.log[td]||0)+' · '+(s.rounds[td]||0)+' '+t('tsRounds');
 if(done)toast('🔔 '+t('tsDone'));
 clearTimeout(tsSave);tsSave=setTimeout(save,400);
}

function expenseSheet(){
 const H=[t('exCat'),t('exW')+' 1',t('exW')+' 2',t('exW')+' 3',t('exW')+' 4',t('exTot'),t('exBud'),t('exLeft')];
 const cats=['exFood','exTrans','exBills','exFun','exHealth','exOther'].map(k=>t(k));
 const d=[H];
 cats.forEach((c,i)=>{const r=i+2;d.push([c,'','','','','=SUM(B'+r+':E'+r+')','','=G'+r+'-F'+r])});
 d.push([t('exTot'),'=SUM(B2:B7)','=SUM(C2:C7)','=SUM(D2:D7)','=SUM(E2:E7)','=SUM(F2:F7)','=SUM(G2:G7)','=G8-F8']);
 d.push([]);
 d.push([t('exInc'),'']);
 d.push([t('exBal'),'=B10-F8']);
 const sh={id:uid(),title:t('exTitle'),rows:11,cols:8,data:d};
 S.sheets.unshift(sh);save();sheetModal(sh.id);
}

const prevRender=window.render;
window.render=function(){
 if(tab==='search'||tab==='health'||tab==='tasbih'){
  applyTheme();document.body.dataset.tab=tab;
  const body=tab==='search'?vSearch():tab==='health'?vHealth():vTasbih();
  $('#app').innerHTML=header()+back()+'<h2>'+t(tab)+'</h2>'+body+nav();
  if(tab==='search')setTimeout(()=>{const e=document.getElementById('sq');if(e&&!lastQ)e.focus()},60);
  return;
 }
 prevRender();
 if(tab==='sheets'){
  const h2=document.querySelector('#app h2');
  if(h2&&!document.querySelector('[data-a="s_expense"]'))h2.insertAdjacentHTML('afterend','<button class="btn alt" data-a="s_expense" style="width:100%;margin-bottom:10px">'+t('exTpl')+'</button>');
 }
 if(tab==='more'){
  const g=document.querySelector('#app .grid');
  if(g)[['search',3],['health',0],['tasbih',2]].forEach(a=>{
   if(g.querySelector('[data-v="'+a[0]+'"]'))return;
   const d=document.createElement('div');d.className='card note hub';d.dataset.a='tab';d.dataset.v=a[0];d.style.background=PASTEL[a[1]];d.innerHTML=svg(a[0])+'<b>'+t(a[0])+'</b>';g.appendChild(d);
  });
 }
};

document.addEventListener('input',e=>{
 const el=e.target;
 if(el.id==='sq'){lastQ=el.value;const r=document.getElementById('sres');if(r)r.innerHTML=resHTML(lastQ)}
 if(el.id==='sl_bed'||el.id==='sl_wake'){
  ensure();const td=today(),s=S.health.sleep[td]||(S.health.sleep[td]={bed:'',wake:''});
  if(el.id==='sl_bed')s.bed=el.value;else s.wake=el.value;
  const v=hrs(s.bed,s.wake),l=document.getElementById('sl_h');if(l)l.textContent=v?v+' '+t('hHours'):'—';
  save();
 }
});
document.addEventListener('click',e=>{
 const el=e.target.closest('[data-a]');if(!el)return;
 const a=el.dataset.a,v=el.dataset.v;
 if(a==='add'&&(tab==='search'||tab==='health'||tab==='tasbih')){e.stopPropagation();return}
 if(a.slice(0,2)!=='s_')return;
 ensure();const h=S.health,s=S.tasbih,td=today();
 switch(a){
  case 's_open':openResult(v);break;
  case 's_expense':expenseSheet();break;
  case 's_wp':h.water[td]=(h.water[td]||0)+1;save();render();break;
  case 's_wm':h.water[td]=Math.max(0,(h.water[td]||0)-1);save();render();break;
  case 's_gp':h.goal=Math.min(30,h.goal+1);save();render();break;
  case 's_gm':h.goal=Math.max(1,h.goal-1);save();render();break;
  case 's_sp':h.sgoal=Math.min(14,h.sgoal+0.5);save();render();break;
  case 's_sm':h.sgoal=Math.max(3,h.sgoal-0.5);save();render();break;
  case 's_wrem':h.wrem=+v;h.wlast=Date.now();save();render();break;
  case 's_tap':tap();break;
  case 's_ts0':s.n=0;save();render();break;
  case 's_tg':s.target=+v;s.n=0;save();render();break;
  case 's_lbl':s.label=+v;save();render();break;
 }
},true);

setInterval(()=>{
 ensure();const h=S.health;if(!h.wrem)return;
 const now=new Date(),hr=now.getHours();
 if(hr<8||hr>=22)return;
 if((h.water[today()]||0)>=h.goal)return;
 if(Date.now()-h.wlast<h.wrem*3600000)return;
 h.wlast=Date.now();save();
 toast('🔔 '+t('hRemindMsg'));
 try{if(window.Notification&&Notification.permission==='granted'&&navigator.serviceWorker&&navigator.serviceWorker.ready)navigator.serviceWorker.ready.then(r=>r.showNotification(t('hRemindMsg'),{icon:'icon-192.png',tag:'water'}))}catch(x){}
},60000);

window.__tools={searchAll,hrs};
})();
