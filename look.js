/* hadyr look: to-do list paper style + year calendar */
(function(){
'use strict';
Object.assign(T.ar,{todoTitle:'قائمة المهام',todoSub:'خطوة بخطوة',todoNote:'اعمل أحسن ما عندك وارتاح، راك تعمل خير!',year:'السنة',yrNone:'ما فماش مهام في اليوم هذا',yrAdd:'زيد مهمة',yrTasks:'مهام اليوم',yrBackY:'السنة كاملة'});
Object.assign(T.en,{todoTitle:'to do list',todoSub:'one step at a time',todoNote:"do your best and take rest. you're doing great!",year:'Year',yrNone:'No tasks on this day',yrAdd:'Add task',yrTasks:'Tasks of the day',yrBackY:'Whole year'});
IC.year='<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M8 3v4M16 3v4M3 10h18"/>';

const WD={ar:['إث','ثل','أر','خم','جم','سب','أح'],en:['Mo','Tu','We','Th','Fr','Sa','Su']};
const TABS=['#dbe9f7','#d6efe3','#e6defa','#fbeab8','color-mix(in srgb,var(--ac) 50%,#fff)','#fbe0d6'];
const ROWS=8;

const st=document.createElement('style');
st.textContent=
'.todo-h{background:var(--ac);border-radius:14px 30px 14px 30px;padding:10px 16px;text-align:center;margin:4px 0 4px;font-size:26px;font-weight:800}'+
'.todo-s{text-align:center;font-size:14px;color:var(--soft);margin-bottom:12px}'+
'body[data-tab=tasks] .card.task,body[data-tab=tasks] .card.blank{background:transparent;box-shadow:none;border-radius:0;border-bottom:1.5px dashed rgba(0,0,0,.35);padding:8px 2px;margin-bottom:2px;backdrop-filter:none;gap:14px;min-height:52px}'+
'body[data-tab=tasks] .chk,body[data-tab=tasks] .blank .tabc{width:60px;height:40px;border:0;border-radius:12px 8px 14px 8px;background:var(--tab,#dbe9f7);position:relative;flex:none;padding:0}'+
'body[data-tab=tasks] .chk svg{display:none}'+
'body[data-tab=tasks] .chk::before,body[data-tab=tasks] .blank .tabc::before{content:"";position:absolute;inset:0;margin:auto;width:22px;height:22px;border-radius:50%;border:2px solid #111;background:transparent}'+
'body[data-tab=tasks] .chk.on{background:var(--tab,#dbe9f7);color:inherit}'+
'body[data-tab=tasks] .chk.on::before{background:#111}'+
'body[data-tab=tasks] .empty{display:none}'+
'.blank{display:flex;align-items:center;cursor:pointer}'+
'.todo-n{background:#fbeab8;border-radius:8px 18px 10px 14px;padding:14px 16px;margin:16px 6px 0;text-align:center;font-weight:600;transform:rotate(-1deg);box-shadow:0 1px 3px rgba(0,0,0,.1)}'+
'.yh{display:flex;align-items:center;justify-content:space-between;margin:4px 0 12px}'+
'.yh b{font-size:30px}'+
'.ymg{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}'+
'.ym{margin:0;padding:8px 6px;cursor:pointer}'+
'.ym b{display:block;text-align:center;font-size:13px;margin-bottom:4px}'+
'.mg{display:grid;grid-template-columns:repeat(7,1fr);gap:1px;text-align:center}'+
'.mg i{font-style:normal;font-size:9px;line-height:15px;height:15px;border-radius:50%;color:var(--ink)}'+
'.mg i.w{font-weight:800;color:var(--soft)}'+
'.mg i.h{background:var(--ac);font-weight:700}'+
'.mg i.t{background:#111;color:#fff;font-weight:700}'+
'.mb{margin:0}'+
'.mb .mg{gap:6px}'+
'.mb .mg i{font-size:15px;line-height:40px;height:44px;border-radius:14px;position:relative}'+
'.mb .mg i.w{font-size:12px;line-height:24px;height:26px}'+
'.mb .mg i.s{outline:2px solid #111}'+
'.mb .mg i.h::after{content:"";position:absolute;bottom:5px;left:50%;width:6px;height:6px;margin-left:-3px;border-radius:50%;background:#111}'+
'.mb .mg i.h{background:transparent}'+
'.mb .mg i.t.h::after{background:#fff}'+
'.mb .mg i.h:not(.t){background:var(--ac)}';
document.head.appendChild(st);

function decorateTasks(){
 document.body.dataset.tab=tab;
 if(tab!=='tasks')return;
 const app=document.getElementById('app');
 const h2=app.querySelector('h2');
 if(h2&&!app.querySelector('.todo-h')){
  const d=document.createElement('div');
  d.innerHTML='<div class="todo-h">'+esc(t('todoTitle'))+'</div><div class="todo-s">♥ '+esc(t('todoSub'))+' ♥</div>';
  h2.replaceWith(d);
 }
 const rows=[...app.querySelectorAll('.card.task')];
 rows.forEach((el,i)=>{el.style.setProperty('--tab',TABS[i%TABS.length]);el.style.background='transparent'});
 if(typeof filter!=='undefined'&&filter!=='done'){
  const anchor=rows.length?rows[rows.length-1]:app.querySelector('.seg');
  let last=anchor;
  for(let i=rows.length;i<ROWS;i++){
   const b=document.createElement('div');b.className='card blank';b.dataset.a='add';
   b.innerHTML='<span class="tabc" style="--tab:'+TABS[i%TABS.length]+';background:'+TABS[i%TABS.length]+'"></span>';
   last.after(b);last=b;
  }
  const n=document.createElement('div');n.className='todo-n';n.textContent=t('todoNote');
  last.after(n);
 }
}

let yr=new Date().getFullYear(),mo=null,sel=ymd(new Date());
const tasksOn=d=>S.tasks.filter(x=>x.date===d);
function miniMonth(y,m){
 const first=new Date(y,m,1),off=(first.getDay()+6)%7,n=new Date(y,m+1,0).getDate(),td=ymd(new Date());
 let h=WD[S.lang==='ar'?'ar':'en'].map(w=>'<i class="w">'+(S.lang==='ar'?'نثرخجسح'.charAt(WD.ar.indexOf(w)):w.charAt(0))+'</i>').join('');
 for(let i=0;i<off;i++)h+='<i></i>';
 for(let d=1;d<=n;d++){
  const k=y+'-'+z(m+1)+'-'+z(d),has=S.tasks.some(x=>x.date===k&&!x.done);
  h+='<i class="'+(k===td?'t ':'')+(has?'h':'')+'">'+d+'</i>';
 }
 return h;
}
const mname=(y,m)=>new Date(y,m,1).toLocaleDateString(S.lang==='ar'?'ar-TN':'en-GB',{month:'long'});
function vYear(){
 const head='<div class="yh"><button class="btn alt sm" data-a="y_next" aria-label="next">'+(S.lang==='ar'?'‹':'›')+'</button><b>'+yr+'</b><button class="btn alt sm" data-a="y_prev" aria-label="prev">'+(S.lang==='ar'?'›':'‹')+'</button></div>';
 if(mo===null){
  let g='';
  for(let m=0;m<12;m++)g+='<div class="card ym" data-a="y_month" data-v="'+m+'" style="background:'+PASTEL[m%4]+'"><b>'+esc(mname(yr,m))+'</b><div class="mg">'+miniMonth(yr,m)+'</div></div>';
  return head+'<div class="ymg">'+g+'</div>';
 }
 const first=new Date(yr,mo,1),off=(first.getDay()+6)%7,n=new Date(yr,mo+1,0).getDate(),td=ymd(new Date());
 let c=WD[S.lang==='ar'?'ar':'en'].map(w=>'<i class="w">'+w+'</i>').join('');
 for(let i=0;i<off;i++)c+='<i></i>';
 for(let d=1;d<=n;d++){
  const k=yr+'-'+z(mo+1)+'-'+z(d),has=tasksOn(k).length>0;
  c+='<i data-a="y_day" data-v="'+k+'" class="'+(k===td?'t ':'')+(has?'h ':'')+(k===sel?'s':'')+'">'+d+'</i>';
 }
 const list=tasksOn(sel);
 const hd='<div class="yh"><button class="btn alt sm" data-a="y_pm">'+(S.lang==='ar'?'›':'‹')+'</button><b style="font-size:24px">'+esc(mname(yr,mo))+' '+yr+'</b><button class="btn alt sm" data-a="y_nm">'+(S.lang==='ar'?'‹':'›')+'</button></div>';
 return hd+'<div class="card mb" style="background:'+PASTEL[mo%4]+'"><div class="mg">'+c+'</div></div>'
  +'<div class="actions" style="margin:6px 0 10px"><button class="btn alt sm" data-a="y_whole">'+t('yrBackY')+'</button></div>'
  +'<h2>'+esc(fmtDate(sel))+'</h2>'
  +(list.length?list.map((x,i)=>'<div class="card task'+(x.done?' done':'')+'" style="background:'+PASTEL[i%4]+'"><div class="tx" data-a="editTask" data-v="'+x.id+'"><div class="t">'+esc(x.text)+'</div></div>'+(x.time?'<span class="pill">'+esc(x.time)+'</span>':'')+'</div>').join(''):'<div class="empty" style="padding:14px">'+t('yrNone')+'</div>')
  +'<button class="btn" style="width:100%" data-a="y_add">'+t('yrAdd')+'</button>';
}
function addOn(d){taskModal(null);setTimeout(()=>{const e=$('#f_date');if(e)e.value=d},0)}

const prevRender=window.render;
window.render=function(){
 if(tab==='year'){
  applyTheme();document.body.dataset.tab=tab;
  const back='<button class="btn alt sm" data-a="tab" data-v="more" style="margin-bottom:6px">'+(S.lang==='ar'?'→ ':'← ')+t('back')+'</button>';
  $('#app').innerHTML=header()+back+(mo===null?'<h2>'+t('year')+'</h2>':'')+vYear()+nav();
  return;
 }
 prevRender();
 document.body.dataset.tab=tab;
 decorateTasks();
 if(tab==='more'){
  const g=document.querySelector('#app .grid');
  if(g&&!g.querySelector('[data-v="year"]')){
   const d=document.createElement('div');d.className='card note hub';d.dataset.a='tab';d.dataset.v='year';d.style.background=PASTEL[0];
   d.innerHTML=svg('year')+'<b>'+t('year')+'</b>';g.insertBefore(d,g.children[1]||null);
  }
 }
};

document.addEventListener('click',e=>{
 const el=e.target.closest('[data-a]');if(!el)return;
 const a=el.dataset.a,v=el.dataset.v;
 if(a==='add'&&tab==='year'){e.stopPropagation();addOn(sel);return}
 if(a.slice(0,2)!=='y_')return;
 switch(a){
  case 'y_next':yr++;mo=null;break;
  case 'y_prev':yr--;mo=null;break;
  case 'y_month':mo=+v;{const d=new Date();sel=(yr===d.getFullYear()&&mo===d.getMonth())?ymd(d):yr+'-'+z(mo+1)+'-01'}break;
  case 'y_whole':mo=null;break;
  case 'y_pm':mo--;if(mo<0){mo=11;yr--}sel=yr+'-'+z(mo+1)+'-01';break;
  case 'y_nm':mo++;if(mo>11){mo=0;yr++}sel=yr+'-'+z(mo+1)+'-01';break;
  case 'y_day':sel=v;break;
  case 'y_add':addOn(sel);return;
 }
 render();
});
document.addEventListener('click',e=>{
 const el=e.target.closest('[data-a="tab"]');
 if(el&&el.dataset.v==='year'){mo=null;yr=new Date().getFullYear()}
},true);

if(typeof tab!=='undefined'){render()}
window.__look={vYear};
})();
