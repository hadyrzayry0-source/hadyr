/* hadyr themes: more pastel + seasonal colors */
(function(){
'use strict';
const G=[
 ['pastel',{ar:'باستيل',en:'Pastel'},[
  ['sage',['#e4f0e6','#f4faf5','#9cc9a8'],'أخضر هادي','Sage'],
  ['sky',['#e3edf7','#f4f8fc','#9dbfe0'],'سماوي','Sky'],
  ['sand',['#f6efdc','#fcf8ec','#e3cf8f'],'رملي','Sand'],
  ['lavender',['#ebe6f5','#f7f4fc','#bfb2e0'],'خزامى','Lavender'],
  ['peach',['#fbe9e1','#fef6f2','#f0b9a1'],'خوخي','Peach'],
  ['pink',['#fbe4ec','#fef5f8','#f2b5c8'],'وردي','Pink'],
  ['mint',['#e0f5ec','#f3fbf8','#9fdcc4'],'نعناعي','Mint'],
  ['butter',['#fdf6d8','#fffcee','#f1dc7e'],'زبدة','Butter'],
  ['aqua',['#ddf3f4','#f2fbfb','#8fd3d8'],'أكوا','Aqua'],
  ['lilac',['#f0e1f5','#faf3fc','#d3a9e0'],'ليلكي','Lilac'],
  ['coral',['#fde5e0','#fff6f4','#f5a99b'],'مرجاني','Coral']]],
 ['winter',{ar:'شتوي',en:'Winter'},[
  ['frost',['#e6eef5','#f5f9fc','#a9c4dc'],'صقيع','Frost'],
  ['snow',['#eef1f4','#fafbfc','#b8c4d0'],'ثلج','Snow'],
  ['icy',['#e0f0f7','#f3fafd','#8cc5dd'],'جليدي','Icy'],
  ['pine',['#e1ebe5','#f3f8f5','#7fa591'],'صنوبر','Pine'],
  ['berry',['#f3e1e5','#fbf3f5','#c98a99'],'توت','Berry'],
  ['cocoa',['#ece3dc','#f8f4f0','#b79b88'],'كاكاو','Cocoa']]],
 ['summer',{ar:'صيفي',en:'Summer'},[
  ['sunshine',['#fdf1c9','#fffbea','#f5cb4a'],'شمس','Sunshine'],
  ['ocean',['#d8eef7','#f0f9fd','#58b8d8'],'بحر','Ocean'],
  ['melon',['#fde0e3','#fff4f5','#f2808f'],'دلاع','Melon'],
  ['mango',['#fde7cf','#fff5ea','#f4a65b'],'مانجا','Mango'],
  ['lime',['#eaf5d3','#f7fbec','#a8d05a'],'ليمون أخضر','Lime'],
  ['lagoon',['#d6f3ee','#effbf9','#4cc2b0'],'لاجون','Lagoon']]],
 ['autumn',{ar:'خريفي',en:'Autumn'},[
  ['pumpkin',['#fbe3d0','#fff4ea','#e48a4a'],'قرع','Pumpkin'],
  ['maple',['#f4ddd6','#fcf1ed','#c9684f'],'قيقب','Maple'],
  ['olive',['#e9ead2','#f6f6e8','#a9ad5c'],'زيتوني','Olive'],
  ['mustard',['#f6ebc3','#fcf8e4','#d9b23c'],'خردلي','Mustard'],
  ['terracotta',['#f1dcd0','#faf0ea','#c98265'],'طوب','Terracotta'],
  ['chestnut',['#e8dcd2','#f6efe9','#a77b5c'],'كستنائي','Chestnut']]],
 ['spring',{ar:'ربيعي',en:'Spring'},[
  ['blossom',['#fce6ef','#fff5f9','#f2a6c4'],'زهر','Blossom'],
  ['meadow',['#e5f4d8','#f4fbee','#9fd47c'],'مرج','Meadow'],
  ['daffodil',['#fcf4c8','#fffbe8','#efd54f'],'نرجس','Daffodil'],
  ['wisteria',['#e9e3f7','#f6f3fd','#b3a3e6'],'ويستيريا','Wisteria'],
  ['fresh',['#dff3e3','#f1fbf3','#7fd49a'],'أخضر ربيعي','Fresh'],
  ['drizzle',['#e1f0fb','#f3f9fe','#8fc3ec'],'رذاذ','Drizzle']]]
];
G.forEach(g=>{
 T.ar['g_'+g[0]]=g[1].ar;T.en['g_'+g[0]]=g[1].en;
 g[2].forEach(c=>{THEMES[c[0]]=c[1];T.ar['th_'+c[0]]=c[2];T.en['th_'+c[0]]=c[3]});
});

const st=document.createElement('style');
st.textContent='.thg{font-size:13px;font-weight:700;margin:12px 2px 2px;color:var(--soft)}.sw button{box-shadow:0 1px 3px rgba(0,0,0,.18)}';
document.head.appendChild(st);

const prev=window.vSettings;
window.vSettings=function(){
 let h=prev();
 const key='<label>'+t('theme')+'</label>',i=h.indexOf(key);
 if(i<0)return h;
 const start=h.lastIndexOf('<div class="card">',i),endMark='</div></div>',end=h.indexOf(endMark,i)+endMark.length;
 const body=G.map(g=>'<div class="thg">'+t('g_'+g[0])+'</div><div class="sw">'+g[2].map(c=>'<button data-a="theme" data-v="'+c[0]+'" class="'+(S.theme===c[0]?'on':'')+'" aria-label="'+t('th_'+c[0])+'" title="'+t('th_'+c[0])+'" style="background:linear-gradient(135deg,'+c[1][0]+' 48%,'+c[1][2]+' 52%)"></button>').join('')+'</div>').join('');
 return h.slice(0,start)+'<div class="card"><label>'+t('theme')+'</label>'+body+'</div>'+h.slice(end);
};
})();
