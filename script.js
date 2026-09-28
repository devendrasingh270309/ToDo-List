(()=>{
'use strict';
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const KEY='todo-glass-v2',TKEY='todo-theme',root=document.documentElement;
const CATS=['Work','Personal','Health','Study','Ideas'],PRI=['Low','Medium','High'],PC=['#30c46a','#ff9f0a','#ff453a'];
const p2=n=>String(n).padStart(2,'0'),ymd=d=>`${d.getFullYear()}-${p2(d.getMonth()+1)}-${p2(d.getDate())}`;
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const uid=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,6);
let S={tasks:[],view:'all',cat:'all',sort:'due',q:''},fresh=null,editing=null,lastFocus=null;
try{const r=JSON.parse(localStorage.getItem(KEY));if(r&&Array.isArray(r.tasks))S={...S,...r,q:''}}catch(e){}
try{if(!localStorage.getItem(KEY)){const d=n=>{const x=new Date();x.setDate(x.getDate()+n);return ymd(x)},t=Date.now();
 S.tasks=[{id:uid(),title:'Plan the week',notes:'Pick three priorities and block time for them.',pri:2,cat:'Work',due:d(0)+'T17:00',done:false,created:t},
 {id:uid(),title:'Evening walk',notes:'',pri:0,cat:'Health',due:d(0)+'T19:00',done:false,created:t-1},
 {id:uid(),title:'Sketch app ideas',notes:'Keep it simple.',pri:1,cat:'Ideas',due:d(2)+'T10:00',done:false,created:t-2}]}}catch(e){}
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify({tasks:S.tasks,view:S.view,cat:S.cat,sort:S.sort}))}catch(e){}};
// Theme
const SUN='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
 MOON='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/></svg>';
function paintTheme(){const d=root.dataset.theme==='dark',b=$('#theme');b.setAttribute('aria-checked',d);$('#tl').textContent=d?'Dark':'Light';$('#knob').innerHTML=d?MOON:SUN}
$('#theme').onclick=()=>{const d=root.dataset.theme!=='dark';root.classList.add('tt');root.dataset.theme=d?'dark':'light';paintTheme();try{localStorage.setItem(TKEY,d?'dark':'light')}catch(e){}setTimeout(()=>root.classList.remove('tt'),650)};
try{matchMedia('(prefers-color-scheme:dark)').addEventListener('change',e=>{if(!localStorage.getItem(TKEY)){root.dataset.theme=e.matches?'dark':'light';paintTheme()}})}catch(e){}
// Filters setup
const fc=$('#fc'),fcat=$('#f-c');
fc.innerHTML='<option value="all">All categories</option>'+CATS.map(c=>`<option>${c}</option>`).join('');
fcat.innerHTML=CATS.map(c=>`<option>${c}</option>`).join('');
fc.value=CATS.includes(S.cat)?S.cat:'all';$('#so').value=S.sort;
const fmt=d=>{const x=new Date(d),tm=new Date();tm.setDate(tm.getDate()+1);const k=d.slice(0,10),day=k===ymd(new Date())?'Today':k===ymd(tm)?'Tomorrow':x.toLocaleDateString(undefined,{month:'short',day:'numeric'});return day+(d.length>10?', '+x.toLocaleTimeString(undefined,{hour:'numeric',minute:'2-digit'}):'')};
const overdue=t=>!t.done&&t.due&&new Date(t.due)<new Date();
const isToday=t=>t.due&&t.due.slice(0,10)===ymd(new Date());
function visible(){const q=S.q.trim().toLowerCase();
 const a=S.tasks.filter(t=>(S.view==='all'||(S.view==='active'&&!t.done)||(S.view==='done'&&t.done)||(S.view==='today'&&isToday(t)))&&(S.cat==='all'||t.cat===S.cat)&&(!q||(t.title+' '+t.notes+' '+t.cat).toLowerCase().includes(q)));
 const due=(x,y)=>(x.due?new Date(x.due):8e15)-(y.due?new Date(y.due):8e15);
 const s={due,pri:(x,y)=>y.pri-x.pri||due(x,y),new:(x,y)=>y.created-x.created,az:(x,y)=>x.title.localeCompare(y.title)}[S.sort]||due;
 return a.sort((x,y)=>(x.done-y.done)||s(x,y))}
const IE='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20h4L19 9l-4-4L4 16z"/></svg>',
 ID='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/></svg>';
const list=$('#list');
function render(){
 const v=visible();
 list.innerHTML=v.length?v.map((t,i)=>`<article class="card glass${t.done?' done':''}${t.id===fresh?' fresh':''}" data-id="${t.id}" style="--i:${Math.min(i,12)};--pc:${PC[t.pri]}">
 <button class="chk" data-a="tog" aria-label="${t.done?'Mark as not done':'Mark as done'}: ${esc(t.title)}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12.5 4.5 4.5L19 7"/></svg></button>
 <div class="body"><h3>${esc(t.title)}</h3>${t.notes?`<p>${esc(t.notes)}</p>`:''}<div class="meta"><span class="chip"><i></i>${PRI[t.pri]}</span><span class="chip">${esc(t.cat)}</span>${t.due?`<span class="chip${overdue(t)?' od':''}">${fmt(t.due)}</span>`:''}</div></div>
 <div class="acts"><button data-a="edit" aria-label="Edit ${esc(t.title)}">${IE}</button><button class="del" data-a="del" aria-label="Delete ${esc(t.title)}">${ID}</button></div></article>`).join('')
 :`<div class="empty"><h3>${S.tasks.length?'Nothing matches':'No tasks yet'}</h3><p>${S.tasks.length?'Try another filter or search.':'Tap “New task” to add your first one.'}</p></div>`;
 fresh=null;stats();
}
function stats(){
 const T=S.tasks,dn=T.filter(t=>t.done).length,pc=T.length?Math.round(dn/T.length*100):0;
 $('#rg').style.setProperty('--p',pc);$('#pct').textContent=pc+'%';$('#s-done').textContent=dn+' / '+T.length;
 $('#s-today').textContent=T.filter(t=>!t.done&&isToday(t)).length;$('#s-od').textContent=T.filter(overdue).length;
 $('#n-all').textContent=T.length;$('#n-active').textContent=T.length-dn;$('#n-today').textContent=T.filter(isToday).length;$('#n-done').textContent=dn;
 const days=[...Array(7)].map((_,i)=>{const d=new Date();d.setDate(d.getDate()-6+i);return d}),cnt=days.map(d=>T.filter(t=>t.doneAt&&ymd(new Date(t.doneAt))===ymd(d)).length),mx=Math.max(1,...cnt);
 $('#s-wk').textContent='· '+cnt.reduce((a,b)=>a+b,0);
 $('#bars').innerHTML=days.map((d,i)=>`<div title="${cnt[i]} completed"><i style="height:${cnt[i]/mx*75}%"></i>${d.toLocaleDateString(undefined,{weekday:'narrow'})}</div>`).join('');
 $$('.nb').forEach(b=>b.setAttribute('aria-current',b.dataset.view===S.view));
 const left=T.length-dn;
 $('#sub').textContent=left?`${left} task${left>1?'s':''} left · ${new Date().toLocaleDateString(undefined,{weekday:'long',month:'long',day:'numeric'})}`:'All caught up.';
}
$$('.nb').forEach(b=>b.onclick=()=>{S.view=b.dataset.view;save();render()});
$('#q').oninput=e=>{S.q=e.target.value;render()};
fc.onchange=()=>{S.cat=fc.value;save();render()};$('#so').onchange=e=>{S.sort=e.target.value;save();render()};
list.addEventListener('click',e=>{const b=e.target.closest('[data-a]'),c=e.target.closest('.card');if(!b||!c)return;const t=S.tasks.find(x=>x.id===c.dataset.id);if(!t)return;
 if(b.dataset.a==='tog'){t.done=!t.done;t.doneAt=t.done?Date.now():null;save();render();const n=list.querySelector(`[data-id="${t.id}"]`);n&&n.classList.add('pop')}
 else if(b.dataset.a==='edit')openM(t);
 else{c.classList.add('out');setTimeout(()=>{S.tasks=S.tasks.filter(x=>x.id!==t.id);save();render()},300)}});
const M=$('#modal'),F=$('#form');
function openM(t){lastFocus=document.activeElement;editing=t||null;$('#mt').textContent=t?'Edit task':'New task';$('#save').textContent=t?'Save changes':'Add task';
 $('#f-t').value=t?t.title:'';$('#f-n').value=t?t.notes:'';fcat.value=t?t.cat:(S.cat!=='all'?S.cat:'Work');$('#f-d').value=t&&t.due?t.due:'';
 F.querySelector(`[name=pri][value="${t?t.pri:1}"]`).checked=true;M.classList.add('open');M.setAttribute('aria-hidden','false');setTimeout(()=>$('#f-t').focus(),100)}
function closeM(){M.classList.remove('open');M.setAttribute('aria-hidden','true');lastFocus&&lastFocus.focus&&lastFocus.focus()}
$('#add').onclick=()=>openM();$('#cancel').onclick=closeM;M.addEventListener('pointerdown',e=>{if(e.target===M)closeM()});
F.onsubmit=e=>{e.preventDefault();const title=$('#f-t').value.trim();if(!title)return;
 const d={title,notes:$('#f-n').value.trim(),pri:+F.pri.value,cat:fcat.value,due:$('#f-d').value||''};
 if(editing)Object.assign(editing,d);else{const t={id:uid(),done:false,created:Date.now(),...d};S.tasks.push(t);fresh=t.id}
 save();closeM();render()};
addEventListener('keydown',e=>{const open=M.classList.contains('open');
 if(e.key==='Escape'&&open)closeM();
 if(open&&e.key==='Tab'){const f=$$('#form input:not([type=radio]),#form textarea,#form select,#form button,#form input[type=radio]:checked'),a=f[0],z=f[f.length-1];
  if(e.shiftKey&&document.activeElement===a){e.preventDefault();z.focus()}else if(!e.shiftKey&&document.activeElement===z){e.preventDefault();a.focus()}}
 if(/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)||e.metaKey||e.ctrlKey||e.altKey)return;
 if(e.key==='n'){e.preventDefault();openM()}if(e.key==='/'){e.preventDefault();$('#q').focus()}});
// Live clock + greeting (device local time)
const greet=h=>h>=5&&h<12?'Good Morning':h>=12&&h<17?'Good Afternoon':h>=17&&h<21?'Good Evening':'Good Night';
let lastG='',lastT='',lastD=ymd(new Date());
function tick(){const n=new Date(),g=greet(n.getHours()),t=n.toLocaleTimeString('en-US',{hour:'numeric',minute:'2-digit',hour12:true});
 if(g!==lastG){lastG=g;$('#hi').textContent=g}
 if(t!==lastT){lastT=t;const c=$('#clk');c.textContent=t;c.dateTime=p2(n.getHours())+':'+p2(n.getMinutes())}
 const d=ymd(n);if(d!==lastD){lastD=d;render()}}
function loop(){tick();setTimeout(loop,1000-Date.now()%1000+5)}
paintTheme();render();loop();
})();
