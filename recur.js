/* hadyr recur: repeating tasks */
(function(){
'use strict';
Object.assign(T.ar,{rpLabel:'التكرار',rpNone:'ما يتعاودش',rpD:'كل يوم',rpWd:'كل يوم عمل (الإثنين → الجمعة)',rpW:'كل أسبوع',rpM:'كل شهر',rpN:'كل عدد أيام',rpEvery:'كل كم يوم؟',rpNext:'تعاودت لـ'});
Object.assign(T.en,{rpLabel:'Repeat',rpNone:'Does not repeat',rpD:'Every day',rpWd:'Weekdays (Mon → Fri)',rpW:'Every week',rpM:'Every month',rpN:'Every N days',rpEvery:'Every how many days?',rpNext:'Repeats on'});

const OPTS=[['','rpNone'],['d','rpD'],['wd','rpWd'],['w','rpW'],['m','rpM'],['n','rpN']];
const parse=s=>{const a=s.split('-');return new Date(+a[0],+a[1]-1,+a[2],12)};
const addDays=(s,n)=>{const d=parse(s);d.setDate(d.getDate()+n);return ymd(d)};
function addMonth(s,rday){
 const d=parse(s),y=d.getFullYear(),m=d.getMonth()+1,dim=new Date(y,m+1,0).getDate();
 return ymd(new Date(y,m,Math.min(rday||d.getDate(),dim),12));
}
function nextDate(x,today){
 let n=x.date||today;
 const step=()=>{
  if(x.rep==='d')n=addDays(n,1);
  else if(x.rep==='wd'){do{n=addDays(n,1)}while([0,6].includes(parse(n).getDay()))}
  else if(x.rep==='w')n=addDays(n,7);
  else if(x.rep==='m')n=addMonth(n,x.rday);
  else n=addDays(n,Math.max(1,x.repN||1));
 };
 step();
 let guard=0;
 while(n<=today&&guard++<800)step();
 return n;
}

const origModal=window.taskModal;
window.taskModal=function(id){
 origModal.apply(this,arguments);
 const x=S.tasks.find(a=>a.id===id)||{},sh=document.querySelector('#modal .sheet'),acts=sh&&sh.querySelector('.actions');
 if(!acts)return;
 const w=document.createElement('div');
 w.innerHTML='<label>'+t('rpLabel')+'</label><select id="f_rep">'+OPTS.map(o=>'<option value="'+o[0]+'"'+((x.rep||'')===o[0]?' selected':'')+'>'+t(o[1])+'</option>').join('')+'</select>'
  +'<div id="f_repw" style="'+(x.rep==='n'?'':'display:none')+'"><label>'+t('rpEvery')+'</label><input id="f_repn" type="number" min="1" max="365" value="'+(x.repN||2)+'"></div>';
 acts.parentNode.insertBefore(w,acts);
};
document.addEventListener('change',e=>{
 if(e.target.id==='f_rep'){const w=document.getElementById('f_repw');if(w)w.style.display=e.target.value==='n'?'':'none'}
});

const origSave=window.saveTask;
window.saveTask=function(){
 const sel=document.getElementById('f_rep'),rep=sel?sel.value:null,rn=document.getElementById('f_repn'),repN=rn?Math.max(1,Math.min(365,+rn.value||1)):1;
 const ed=editing,n=S.tasks.length;
 origSave.apply(this,arguments);
 if(rep===null)return;
 const x=ed?S.tasks.find(a=>a.id===ed):(S.tasks.length>n?S.tasks[S.tasks.length-1]:null);
 if(!x)return;
 if(rep){
  x.rep=rep;x.repN=repN;
  if(!x.date)x.date=ymd(new Date());
  x.rday=parse(x.date).getDate();
 }else{delete x.rep;delete x.repN;delete x.rday}
 save();render();
};

document.addEventListener('click',e=>{
 const el=e.target.closest('[data-a="toggle"]');if(!el)return;
 const x=S.tasks.find(q=>q.id===el.dataset.v);
 if(!x||!x.rep||x.done)return;
 e.stopPropagation();
 const nd=nextDate(x,ymd(new Date()));
 x.date=nd;x.done=false;x.notified=false;x.cnt=(x.cnt||0)+1;
 save();toast('🔁 '+t('rpNext')+' '+fmtDate(nd));render();
},true);

const origIcs=window.icsFor;
window.icsFor=function(x){
 let s=origIcs.apply(this,arguments);
 if(!x||!x.rep)return s;
 const r={d:'FREQ=DAILY',wd:'FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR',w:'FREQ=WEEKLY',m:'FREQ=MONTHLY',n:'FREQ=DAILY;INTERVAL='+Math.max(1,x.repN||1)}[x.rep];
 return r?s.replace('BEGIN:VALARM','RRULE:'+r+'\r\nBEGIN:VALARM'):s;
};

const prevRender=window.render;
window.render=function(){
 prevRender();
 document.querySelectorAll('#app [data-a="editTask"]').forEach(el=>{
  const x=S.tasks.find(q=>q.id===el.dataset.v),t1=el.querySelector('.t');
  if(x&&x.rep&&t1&&!t1.querySelector('.rpb')){const b=document.createElement('span');b.className='rpb';b.textContent=' 🔁';t1.appendChild(b)}
 });
};
render();
window.__recur={nextDate};
})();
