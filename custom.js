/* hadyr custom: text size, font, custom notification tones */
(function(){
'use strict';
Object.assign(T.ar,{custom:'التخصيص',csSize:'حجم الخط',csFont:'نوع الخط',csSound:'نغمة التنبيه',csVol:'مستوى الصوت',csAdd:'زيد نغمة من تيليفونك',csDef:'النغمة الافتراضية',csReset:'رجّع الافتراضي',csTest:'جرّب',csNote:'النغمة تخدم كي يكون التطبيق مفتوح (تذكيرات، مؤقتات، مواقيت الصلاة). الإشعار كي يكون التطبيق مسكّر صوتو يحدّدو الأندرويد، وتنجم تبدّلو من إعدادات الإشعارات متاع التيليفون.',csAdded:'تزادت النغمة',csBad:'الملف هذا ما نجمتش نستعملو',csPreview:'هكا يكون شكل الخط',csTones:'نغماتي'});
Object.assign(T.en,{custom:'Customize',csSize:'Text size',csFont:'Font',csSound:'Alert tone',csVol:'Volume',csAdd:'Add a tone from your phone',csDef:'Default tone',csReset:'Reset',csTest:'Test',csNote:'The tone plays while the app is open (reminders, timers, prayer times). When the app is closed, Android decides the notification sound; you can change it in the phone notification settings.',csAdded:'Tone added',csBad:"Couldn't use that file",csPreview:'This is how the font looks',csTones:'My tones'});
IC.custom='<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2"/>';

const FONTS=[['Cairo','Cairo'],['Tajawal','Tajawal'],['Almarai','Almarai'],['Noto Naskh Arabic','Noto Naskh Arabic'],['Amiri','Amiri'],['Aref Ruqaa','Aref Ruqaa'],['El Messiri','El Messiri']];

function ensureUI(){
 if(!S.ui||typeof S.ui!=='object')S.ui={};
 const u=S.ui;
 if(typeof u.size!=='number')u.size=100;
 if(!u.font)u.font='Cairo';
 if(!u.tone)u.tone='def';
 if(typeof u.vol!=='number')u.vol=100;
 if(!Array.isArray(u.tones))u.tones=[];
}
ensureUI();

const st=document.createElement('style');st.id='csStyle';document.head.appendChild(st);
const fl=document.createElement('link');fl.rel='stylesheet';document.head.appendChild(fl);
function fontUrl(names){return 'https://fonts.googleapis.com/css2?'+names.map(n=>'family='+n.replace(/ /g,'+')+':wght@400;700').join('&')+'&display=swap'}
function applyUI(){
 ensureUI();const u=S.ui,z1=(u.size/100).toFixed(2);
 let css='';
 if(u.size!==100)css+='#app>:not(nav){zoom:'+z1+'}.sheet{zoom:'+z1+'}';
 if(u.font!=='Cairo')css+='body{font-family:"'+u.font+'",Cairo,system-ui,sans-serif}';
 st.textContent=css;
 if(u.font!=='Cairo')fl.href=fontUrl([u.font]);else fl.removeAttribute('href');
}
applyUI();

function db(){return new Promise((res,rej)=>{const r=indexedDB.open('hadyr-snd',1);r.onupgradeneeded=()=>r.result.createObjectStore('snd',{keyPath:'id'});r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error)})}
async function idb(mode,fn){const d=await db();return new Promise((res,rej)=>{const tx=d.transaction('snd',mode),q=fn(tx.objectStore('snd'));tx.oncomplete=()=>res(q&&q.result);tx.onerror=()=>rej(tx.error)})}
const putTone=o=>idb('readwrite',s=>s.put(o));
const getTone=id=>idb('readonly',s=>s.get(id));
const delTone=id=>idb('readwrite',s=>s.delete(id));

const urls={};let cur=null,lastPlay=0;
async function playTone(id,force){
 ensureUI();id=id||S.ui.tone;
 if(id==='def')return false;
 const now=Date.now();if(!force&&now-lastPlay<1500)return true;
 try{
  if(!urls[id]){const rec=await getTone(id);if(!rec)return false;urls[id]=URL.createObjectURL(rec.blob)}
  lastPlay=now;
  if(cur){try{cur.pause()}catch(e){}}
  const a=new Audio(urls[id]);a.volume=Math.max(0,Math.min(1,S.ui.vol/100));cur=a;
  await a.play();
  setTimeout(()=>{try{if(cur===a)a.pause()}catch(e){}},20000);
  return true;
 }catch(e){return false}
}
const AC=window.AudioContext||window.webkitAudioContext;
const origOsc=AC&&AC.prototype.createOscillator;
function defaultBeep(){
 if(!AC)return;
 try{const A=new AC(),o=origOsc.call(A),g=A.createGain();o.connect(g);g.connect(A.destination);o.frequency.value=784;g.gain.setValueAtTime(.2*(S.ui.vol/100),A.currentTime);g.gain.exponentialRampToValueAtTime(.001,A.currentTime+.8);o.start();o.stop(A.currentTime+.8)}catch(e){}
}
if(AC){
 AC.prototype.createOscillator=function(){
  const o=origOsc.call(this);
  ensureUI();
  if(S.ui.tone!=='def'){
   o.start=function(){playTone().then(ok=>{if(!ok)defaultBeep()})};
   o.stop=function(){};
  }
  return o;
 };
}
const origToast=window.toast;
window.toast=function(m){
 origToast.apply(this,arguments);
 if(typeof m==='string'&&m.indexOf('🔔')===0){
  ensureUI();
  if(S.ui.tone==='def')defaultBeep();else playTone().then(ok=>{if(!ok)defaultBeep()});
 }
};

const pst=document.createElement('style');
pst.textContent='.fgrid{display:grid;grid-template-columns:1fr 1fr;gap:8px}.fgrid button{border:2px solid transparent;border-radius:14px;padding:10px 6px;background:rgba(0,0,0,.06);font-size:17px;color:#111}.fgrid button.on{border-color:#111;background:#fff}.zrow{display:flex;align-items:center;gap:10px}.zrow input[type=range]{padding:0;background:transparent}.trow{display:flex;align-items:center;gap:8px;padding:8px 0;border-bottom:1px solid rgba(0,0,0,.08)}.trow:last-child{border:0}.trow .tn{flex:1;min-width:0;word-break:break-word;font-weight:600}.trow .rd{width:22px;height:22px;border-radius:50%;border:2px solid #111;flex:none}.trow.on .rd{background:#111}.trow .btn{padding:6px 10px}';
document.head.appendChild(pst);

function vCustom(){
 ensureUI();const u=S.ui;
 const fonts=FONTS.map(f=>'<button data-a="c_font" data-v="'+f[0]+'" class="'+(u.font===f[0]?'on':'')+'" style="font-family:\''+f[1]+'\',Cairo,sans-serif">'+f[0]+'</button>').join('');
 const tones=[{id:'def',name:t('csDef')}].concat(u.tones).map(x=>'<div class="trow'+(u.tone===x.id?' on':'')+'"><span class="rd" data-a="c_pick" data-v="'+x.id+'"></span><span class="tn" data-a="c_pick" data-v="'+x.id+'">'+esc(x.name)+'</span><button class="btn alt sm" data-a="c_test" data-v="'+x.id+'">▶</button>'+(x.id==='def'?'':'<button class="btn danger sm" data-a="c_del" data-v="'+x.id+'">'+t('del')+'</button>')+'</div>').join('');
 return '<div class="card"><label>'+t('csSize')+' <b id="szv">'+u.size+'%</b></label><div class="zrow"><span style="font-size:14px">A</span><input id="cs_size" type="range" min="80" max="160" step="5" value="'+u.size+'"><span style="font-size:24px">A</span></div></div>'
  +'<div class="card"><label>'+t('csFont')+'</label><div class="fgrid">'+fonts+'</div><div class="sub" style="margin-top:8px">'+t('csPreview')+'</div></div>'
  +'<div class="card"><label>'+t('csSound')+'</label>'+tones+'<button class="btn" style="width:100%;margin-top:10px" data-a="c_add">'+t('csAdd')+'</button>'
  +'<label style="margin-top:14px">'+t('csVol')+' <b id="vlv">'+u.vol+'%</b></label><input id="cs_vol" type="range" min="10" max="100" step="5" value="'+u.vol+'" style="padding:0;background:transparent"><div class="sub" style="margin-top:8px">'+t('csNote')+'</div></div>'
  +'<button class="btn alt" style="width:100%" data-a="c_reset">'+t('csReset')+'</button>';
}
const prevRender=window.render;
window.render=function(){
 if(tab==='custom'){
  applyTheme();
  fl.href=fontUrl(FONTS.map(f=>f[0]));
  const back='<button class="btn alt sm" data-a="tab" data-v="more" style="margin-bottom:6px">'+(S.lang==='ar'?'→ ':'← ')+t('back')+'</button>';
  $('#app').innerHTML=header()+back+'<h2>'+t('custom')+'</h2>'+vCustom()+nav();
  return;
 }
 applyUI();
 prevRender();
 if(tab==='more'){
  const g=document.querySelector('#app .grid');
  if(g&&!g.querySelector('[data-v="custom"]')){
   const d=document.createElement('div');d.className='card note hub';d.dataset.a='tab';d.dataset.v='custom';d.style.background=PASTEL[1];
   d.innerHTML=svg('custom')+'<b>'+t('custom')+'</b>';g.appendChild(d);
  }
 }
};

let saveT=0;
document.addEventListener('input',e=>{
 const el=e.target;
 if(el.id==='cs_size'){S.ui.size=+el.value;const l=document.getElementById('szv');if(l)l.textContent=el.value+'%';applyUI();clearTimeout(saveT);saveT=setTimeout(save,300)}
 if(el.id==='cs_vol'){S.ui.vol=+el.value;const l=document.getElementById('vlv');if(l)l.textContent=el.value+'%';clearTimeout(saveT);saveT=setTimeout(save,300)}
});
document.addEventListener('click',async e=>{
 const el=e.target.closest('[data-a]');if(!el)return;
 const a=el.dataset.a,v=el.dataset.v;
 if(a==='add'&&tab==='custom'){return}
 if(a.slice(0,2)!=='c_')return;
 ensureUI();
 switch(a){
  case 'c_font':S.ui.font=v;save();applyUI();render();break;
  case 'c_pick':S.ui.tone=v;save();render();playTone(v,true);break;
  case 'c_test':if(v==='def')defaultBeep();else{const ok=await playTone(v,true);if(!ok)toast(t('csBad'))}break;
  case 'c_del':
   try{await delTone(v)}catch(x){}
   if(urls[v]){URL.revokeObjectURL(urls[v]);delete urls[v]}
   S.ui.tones=S.ui.tones.filter(x=>x.id!==v);if(S.ui.tone===v)S.ui.tone='def';
   save();render();break;
  case 'c_reset':S.ui.size=100;S.ui.font='Cairo';S.ui.vol=100;save();applyUI();render();break;
  case 'c_add':{
   const inp=document.createElement('input');inp.type='file';inp.accept='audio/*,.mp3,.m4a,.ogg,.wav,.aac,.opus';
   inp.onchange=async()=>{
    const f=inp.files&&inp.files[0];if(!f)return;
    try{
     const id='t'+Date.now().toString(36);
     await putTone({id,name:f.name.replace(/\.[^.]+$/,''),blob:f});
     S.ui.tones.push({id,name:f.name.replace(/\.[^.]+$/,'')});S.ui.tone=id;
     save();toast(t('csAdded'));render();
     const ok=await playTone(id,true);if(!ok){toast(t('csBad'))}
    }catch(x){toast(t('csBad'))}
   };
   inp.click();break;
  }
 }
});

window.__custom={playTone,applyUI};
})();
