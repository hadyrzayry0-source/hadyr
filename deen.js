/* hadyr deen: prayer times (offline calculation) */
(function(){
'use strict';
const rad=Math.PI/180,sin=a=>Math.sin(a*rad),cos=a=>Math.cos(a*rad),tan=a=>Math.tan(a*rad);
const asin=x=>Math.asin(x)/rad,acos=x=>Math.acos(x)/rad,atan2=(y,x)=>Math.atan2(y,x)/rad,acot=x=>Math.atan(1/x)/rad;
const fix=(a,b)=>{a=a-b*Math.floor(a/b);return a<0?a+b:a};

Object.assign(T.ar,{prayer:'مواقيت الصلاة',pFajr:'الفجر',pSunrise:'الشروق',pDhuhr:'الظهر',pAsr:'العصر',pMaghrib:'المغرب',pIsha:'العشاء',
 pNext:'الصلاة الجاية',pIn:'بعد',pCity:'المدينة',pMyLoc:'موقعي الحالي (GPS)',pGotLoc:'تم تحديد موقعك',pNoLoc:'ما نجمتش نعرف موقعك',pAsrM:'حساب العصر',pAsr1:'الشافعي / الجمهور (ظل = 1)',pAsr2:'الحنفي (ظل = 2)',
 pOff:'تعديل بالدقائق (+ / −)',pAlert:'تنبيه عند دخول الوقت',pCalc:'الحساب: الفجر 18° والعشاء 18° — تقدير فلكي، قارنو بالروزنامة الرسمية وعدّل بالدقائق كان لزم',
 pQibla:'اتجاه القبلة',pQdeg:'درجة من الشمال',pCustom:'موقع GPS',pSettings:'الإعدادات',pNotifOn:'التنبيه يخدم كان التطبيق مفتوح أو في الخلفية',pTomorrow:'غدوة',
 c_tunis:'تونس',c_ariana:'أريانة',c_benarous:'بن عروس',c_manouba:'منوبة',c_nabeul:'نابل',c_zaghouan:'زغوان',c_bizerte:'بنزرت',c_beja:'باجة',c_jendouba:'جندوبة',c_kef:'الكاف',c_siliana:'سليانة',c_sousse:'سوسة',c_monastir:'المنستير',c_mahdia:'المهدية',c_kairouan:'القيروان',c_kasserine:'القصرين',c_sidibouzid:'سيدي بوزيد',c_sfax:'صفاقس',c_gafsa:'قفصة',c_tozeur:'توزر',c_kebili:'قبلي',c_gabes:'قابس',c_medenine:'مدنين',c_tataouine:'تطاوين'});
Object.assign(T.en,{prayer:'Prayer times',pFajr:'Fajr',pSunrise:'Sunrise',pDhuhr:'Dhuhr',pAsr:'Asr',pMaghrib:'Maghrib',pIsha:'Isha',
 pNext:'Next prayer',pIn:'in',pCity:'City',pMyLoc:'My location (GPS)',pGotLoc:'Location set',pNoLoc:"Couldn't get your location",pAsrM:'Asr calculation',pAsr1:'Shafi / majority (shadow = 1)',pAsr2:'Hanafi (shadow = 2)',
 pOff:'Minute adjustments (+ / −)',pAlert:'Alert when time comes',pCalc:'Calculated: Fajr 18° and Isha 18° — astronomical estimate; compare with the official timetable and adjust minutes if needed',
 pQibla:'Qibla direction',pQdeg:'degrees from north',pCustom:'GPS location',pSettings:'Settings',pNotifOn:'Alerts work while the app is open or in background',pTomorrow:'Tomorrow',
 c_tunis:'Tunis',c_ariana:'Ariana',c_benarous:'Ben Arous',c_manouba:'Manouba',c_nabeul:'Nabeul',c_zaghouan:'Zaghouan',c_bizerte:'Bizerte',c_beja:'Béja',c_jendouba:'Jendouba',c_kef:'Le Kef',c_siliana:'Siliana',c_sousse:'Sousse',c_monastir:'Monastir',c_mahdia:'Mahdia',c_kairouan:'Kairouan',c_kasserine:'Kasserine',c_sidibouzid:'Sidi Bouzid',c_sfax:'Sfax',c_gafsa:'Gafsa',c_tozeur:'Tozeur',c_kebili:'Kébili',c_gabes:'Gabès',c_medenine:'Médenine',c_tataouine:'Tataouine'});
IC.prayer='<path d="M12 3c-2.5 2-5 3.2-5 6.5V11h10V9.5C17 6.2 14.5 5 12 3z"/><path d="M5 11h14v10H5z"/><path d="M10 21v-4a2 2 0 014 0v4"/>';

const CITIES={tunis:[36.8065,10.1815],ariana:[36.8665,10.1647],benarous:[36.7531,10.2189],manouba:[36.8089,10.0863],nabeul:[36.4513,10.7357],zaghouan:[36.4029,10.1429],bizerte:[37.2744,9.8739],beja:[36.7256,9.1817],jendouba:[36.5011,8.7802],kef:[36.1742,8.7049],siliana:[36.0849,9.3708],sousse:[35.8256,10.6369],monastir:[35.7643,10.8113],mahdia:[35.5047,11.0622],kairouan:[35.6781,10.0963],kasserine:[35.1676,8.8365],sidibouzid:[35.0382,9.4849],sfax:[34.7406,10.7603],gafsa:[34.425,8.7842],tozeur:[33.9197,8.1335],kebili:[33.7044,8.969],gabes:[33.8815,10.0982],medenine:[33.3549,10.5055],tataouine:[32.9297,10.4518]};
const NAMES=['fajr','sunrise','dhuhr','asr','maghrib','isha'];
const KEY={fajr:'pFajr',sunrise:'pSunrise',dhuhr:'pDhuhr',asr:'pAsr',maghrib:'pMaghrib',isha:'pIsha'};

function ensureP(){
 if(!S.prayer||typeof S.prayer!=='object')S.prayer={};
 const p=S.prayer;
 if(!p.city)p.city='tunis';
 if(typeof p.lat!=='number'){p.lat=CITIES.tunis[0];p.lng=CITIES.tunis[1]}
 if(p.asr!==2)p.asr=1;
 if(!p.off)p.off={};
 NAMES.forEach(n=>{if(typeof p.off[n]!=='number')p.off[n]=0});
 if(typeof p.alert!=='boolean')p.alert=true;
 if(!p.sent)p.sent={};
}
function coords(){const p=S.prayer;if(p.city!=='gps'&&CITIES[p.city])return CITIES[p.city];return [p.lat,p.lng]}

function julian(y,m,d){if(m<=2){y-=1;m+=12}const A=Math.floor(y/100),B=2-A+Math.floor(A/4);return Math.floor(365.25*(y+4716))+Math.floor(30.6001*(m+1))+d+B-1524.5}
function sunPos(jd){
 const D=jd-2451545.0,g=fix(357.529+0.98560028*D,360),q=fix(280.459+0.98564736*D,360),L=fix(q+1.915*sin(g)+0.020*sin(2*g),360);
 const e=23.439-0.00000036*D,RA=fix(atan2(cos(e)*sin(L),cos(L))/15,24);
 return {decl:asin(sin(e)*sin(L)),eqt:q/15-RA};
}
function calcDay(date,lat,lng,asrF){
 const y=date.getFullYear(),m=date.getMonth()+1,d=date.getDate();
 const tz=-new Date(y,m-1,d,12).getTimezoneOffset()/60;
 const jd=julian(y,m,d)-lng/(15*24);
 const base=t=>{const s=sunPos(jd+t/24);return fix(12-s.eqt,24)};
 const noon=base(12)+tz-lng/15;
 const angleT=(angle,tm,ccw)=>{
  const s=sunPos(jd+tm/24),v=(-sin(angle)-sin(s.decl)*sin(lat))/(cos(s.decl)*cos(lat));
  if(v<-1||v>1)return NaN;
  return base(tm)+tz-lng/15+(ccw?-1:1)*acos(v)/15;
 };
 const horizon=0.833;
 const fajr=angleT(18,5,true),sunrise=angleT(horizon,6,true);
 const s2=sunPos(jd+0.625);
 const aAngle=-acot(asrF+tan(Math.abs(lat-s2.decl)));
 const asr=angleT(aAngle,16,false),maghrib=angleT(horizon,18,false),isha=angleT(18,19,false);
 return {fajr,sunrise,dhuhr:noon+0.0,asr,maghrib,isha};
}
function times(date){
 ensureP();const p=S.prayer,c=coords(),r=calcDay(date,c[0],c[1],p.asr),out={};
 NAMES.forEach(n=>{
  let h=r[n];
  if(n==='dhuhr')h+=1/60;
  if(isNaN(h)){out[n]=null;return}
  const mins=Math.round(h*60)+(p.off[n]||0);
  const dt=new Date(date.getFullYear(),date.getMonth(),date.getDate(),0,0,0,0);
  dt.setMinutes(mins);out[n]=dt;
 });
 return out;
}
const hm=d=>d?z(d.getHours())+':'+z(d.getMinutes()):'--:--';
function nextPrayer(now){
 let day=new Date(now.getFullYear(),now.getMonth(),now.getDate());
 for(let k=0;k<2;k++){
  const ts=times(day);
  for(const n of ['fajr','dhuhr','asr','maghrib','isha']){if(ts[n]&&ts[n]>now)return {n,t:ts[n],tomorrow:k===1}}
  day=new Date(day.getFullYear(),day.getMonth(),day.getDate()+1);
 }
 return null;
}
function qibla(lat,lng){
 const k=[21.4225,39.8262],p1=lat*rad,p2=k[0]*rad,dl=(k[1]-lng)*rad;
 return Math.round(fix(Math.atan2(Math.sin(dl)*Math.cos(p2),Math.cos(p1)*Math.sin(p2)-Math.sin(p1)*Math.cos(p2)*Math.cos(dl))/rad,360));
}
const countdown=ms=>{const s=Math.max(0,Math.floor(ms/1000)),h=Math.floor(s/3600),m=Math.floor(s%3600/60);return (h?h+(S.lang==='ar'?' س ':'h '):'')+z(m)+(S.lang==='ar'?' د ':'m ')+z(s%60)+(S.lang==='ar'?' ث':'s')};

const st=document.createElement('style');
st.textContent='.pnext{text-align:center}.pnext .big{font-size:40px}.prow{display:flex;justify-content:space-between;align-items:center;padding:10px 4px;border-bottom:1px solid rgba(0,0,0,.08);font-size:18px}.prow:last-child{border:0}.prow.nx{font-weight:800}.prow.nx .pill{background:#111}.qib{display:inline-block;transition:transform .3s}.pset select,.pset input{width:100%}.poff{display:grid;grid-template-columns:1fr 90px;gap:6px;align-items:center;margin-top:6px}';
document.head.appendChild(st);

function vPrayer(){
 ensureP();const now=new Date(),ts=times(now),nx=nextPrayer(now),p=S.prayer,c=coords();
 const cityName=p.city==='gps'?t('pCustom'):t('c_'+p.city);
 let h='<div class="card pnext" style="background:'+PASTEL[1]+'"><div class="sub">'+t('pNext')+' · '+esc(cityName)+'</div>'
  +(nx?'<div class="big" id="pnName">'+t(KEY[nx.n])+' '+hm(nx.t)+(nx.tomorrow?' ('+t('pTomorrow')+')':'')+'</div><div class="sub" id="pnLeft">'+t('pIn')+' '+countdown(nx.t-now)+'</div>':'<div class="big">--</div>')+'</div>';
 h+='<div class="card">'+NAMES.map(n=>'<div class="prow'+(nx&&!nx.tomorrow&&nx.n===n?' nx':'')+'"><span>'+t(KEY[n])+'</span><span class="pill">'+hm(ts[n])+'</span></div>').join('')+'</div>';
 h+='<div class="card"><div class="row"><b>'+t('pQibla')+'</b><span><span class="qib" style="transform:rotate('+qibla(c[0],c[1])+'deg)">⬆</span> '+qibla(c[0],c[1])+'° '+t('pQdeg')+'</span></div></div>';
 h+='<div class="sub" style="margin:8px 4px">'+t('pCalc')+'</div>';
 h+='<button class="btn" style="width:100%" data-a="p_set">'+t('pSettings')+'</button>';
 return h;
}
function setModal(){
 ensureP();const p=S.prayer;
 const opts=Object.keys(CITIES).map(k=>'<option value="'+k+'"'+(p.city===k?' selected':'')+'>'+t('c_'+k)+'</option>').join('')+(p.city==='gps'?'<option value="gps" selected>'+t('pCustom')+'</option>':'');
 modal('<h2>'+t('prayer')+'</h2><div class="pset"><label>'+t('pCity')+'</label><select id="pc_city">'+opts+'</select>'
  +'<button class="btn alt" data-a="p_gps" style="width:100%;margin-top:8px">'+t('pMyLoc')+'</button>'
  +'<label>'+t('pAsrM')+'</label><select id="pc_asr"><option value="1"'+(p.asr===1?' selected':'')+'>'+t('pAsr1')+'</option><option value="2"'+(p.asr===2?' selected':'')+'>'+t('pAsr2')+'</option></select>'
  +'<label>'+t('pOff')+'</label>'+NAMES.map(n=>'<div class="poff"><span>'+t(KEY[n])+'</span><input id="po_'+n+'" type="number" step="1" min="-30" max="30" value="'+p.off[n]+'"></div>').join('')
  +'<label style="display:flex;gap:8px;align-items:center;margin-top:12px"><input id="pc_alert" type="checkbox" style="width:auto" '+(p.alert?'checked':'')+'>'+t('pAlert')+'</label><div class="sub">'+t('pNotifOn')+'</div></div>'
  +acts('p_save',''));
}
function savePrayer(){
 const p=S.prayer;
 const city=$('#pc_city').value;
 if(city!=='gps'){p.city=city}
 p.asr=+$('#pc_asr').value===2?2:1;
 NAMES.forEach(n=>{p.off[n]=Math.max(-30,Math.min(30,Math.round(+$('#po_'+n).value||0)))});
 p.alert=$('#pc_alert').checked;
 if(p.alert&&window.Notification&&Notification.permission==='default'){try{Notification.requestPermission()}catch(e){}}
 save();closeModal();render();
}
function gps(){
 if(!navigator.geolocation){toast(t('pNoLoc'));return}
 navigator.geolocation.getCurrentPosition(pos=>{
  const p=S.prayer;p.lat=pos.coords.latitude;p.lng=pos.coords.longitude;p.city='gps';
  save();toast(t('pGotLoc'));closeModal();render();
 },()=>toast(t('pNoLoc')),{enableHighAccuracy:false,timeout:15000,maximumAge:600000});
}

const prevRender=window.render;
window.render=function(){
 if(tab==='prayer'){
  ensureP();applyTheme();
  const back='<button class="btn alt sm" data-a="tab" data-v="more" style="margin-bottom:6px">'+(S.lang==='ar'?'→ ':'← ')+t('back')+'</button>';
  $('#app').innerHTML=header()+back+'<h2>'+t('prayer')+'</h2>'+vPrayer()+nav();
  return;
 }
 prevRender();
 if(tab==='more'){
  const g=document.querySelector('#app .grid');
  if(g&&!g.querySelector('[data-v="prayer"]')){
   const d=document.createElement('div');d.className='card note hub';d.dataset.a='tab';d.dataset.v='prayer';d.style.background=PASTEL[2];
   d.innerHTML=svg('prayer')+'<b>'+t('prayer')+'</b>';g.insertBefore(d,g.children[1]||null);
  }
 }
};

document.addEventListener('click',e=>{
 const el=e.target.closest('[data-a]');if(!el)return;
 const a=el.dataset.a;
 if(a==='add'&&tab==='prayer'){e.stopPropagation();setModal();return}
 if(a.slice(0,2)!=='p_')return;
 if(a==='p_set')setModal();else if(a==='p_save')savePrayer();else if(a==='p_gps')gps();
},true);

function beep(){
 try{const A=new (window.AudioContext||window.webkitAudioContext)(),o=A.createOscillator(),g=A.createGain();
  o.connect(g);g.connect(A.destination);o.frequency.value=660;g.gain.setValueAtTime(.2,A.currentTime);g.gain.exponentialRampToValueAtTime(.001,A.currentTime+1.5);o.start();o.stop(A.currentTime+1.5)}catch(e){}
}
function notify(title){
 try{
  if(window.Notification&&Notification.permission==='granted'){
   if(navigator.serviceWorker&&navigator.serviceWorker.ready){navigator.serviceWorker.ready.then(r=>r.showNotification(title,{icon:'icon-192.png',badge:'icon-192.png',tag:'prayer',vibrate:[200,100,200]})).catch(()=>{try{new Notification(title)}catch(e){}})}
   else new Notification(title);
  }
 }catch(e){}
}
setInterval(()=>{
 ensureP();const now=new Date();
 if(tab==='prayer'){
  const nx=nextPrayer(now),l=document.getElementById('pnLeft');
  if(nx&&l){l.textContent=t('pIn')+' '+countdown(nx.t-now);
   const n=document.getElementById('pnName');if(n&&!n.textContent.startsWith(t(KEY[nx.n])))render()}
 }
 if(!S.prayer.alert)return;
 const ts=times(now),day=ymd(now);
 ['fajr','dhuhr','asr','maghrib','isha'].forEach(n=>{
  const d=ts[n];if(!d)return;
  const diff=now-d,k=day+n;
  if(diff>=0&&diff<120000&&!S.prayer.sent[k]){
   S.prayer.sent[k]=1;
   Object.keys(S.prayer.sent).forEach(x=>{if(x.slice(0,10)!==day)delete S.prayer.sent[x]});
   save();toast(t(KEY[n])+' · '+hm(d));beep();notify(t(KEY[n])+' · '+hm(d));
  }
 });
},1000);

window.__prayer={times,calcDay,qibla,nextPrayer};
})();
