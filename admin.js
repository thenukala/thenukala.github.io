

// ── Data helpers (must be first) ──
const LS={members:'nukala_tree_data',contacts:'nukala_contacts',gallery:'nukala_gallery',history:'nukala_history',facts:'nukala_facts',home:'nukala_home',contact:'nukala_contact',settings:'nukala_settings',log:'nukala_log',annLog:'nukala_ann_log'};
const load=k=>JSON.parse(localStorage.getItem(LS[k]||k)||'{}');
const loadArr=k=>JSON.parse(localStorage.getItem(LS[k]||k)||'[]');
const save=(k,v)=>localStorage.setItem(LS[k]||k,JSON.stringify(v));

// ═══════════════════════════════════════
// PASSWORDS & AUTH
// ═══════════════════════════════════════
const getAdminPass=()=>localStorage.getItem('nukala_admin_pass')||'nukala_admin_2024';
const getSitePass=()=>localStorage.getItem('nukala_site_pass')||'nukala2024';

function doLogin(){
  const passEl=document.getElementById('adminPass');
  const errEl=document.getElementById('loginErr');
  if(!passEl) return;
  const entered=passEl.value.trim();
  if(entered===getAdminPass()){
    sessionStorage.setItem('nukala_admin','true');
    document.getElementById('loginScreen').style.display='none';
    document.getElementById('adminUI').style.display='block';
    init();
  } else {
    if(errEl) errEl.style.display='block';
    passEl.value='';
    passEl.focus();
  }
}
function doLogout(){ sessionStorage.removeItem('nukala_admin'); window.location.href='home.html'; }

// Run after DOM is ready
document.addEventListener('DOMContentLoaded', function(){
  // Auto-login if session active
  if(sessionStorage.getItem('nukala_admin')==='true'){
    document.getElementById('loginScreen').style.display='none';
    document.getElementById('adminUI').style.display='block';
    init();
    return;
  }
  // Enter key on password field
  const passEl=document.getElementById('adminPass');
  if(passEl){
    passEl.addEventListener('keydown',function(e){ if(e.key==='Enter') doLogin(); });
    passEl.focus();
  }
});

// ═══════════════════════════════════════
// DATA
// ═══════════════════════════════════════

// ═══════════════════════════════════════
// NAV
// ═══════════════════════════════════════
function showSec(id,el){
  document.querySelectorAll('.page-section').forEach(s=>s.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n=>n.classList.remove('active'));
  document.getElementById('sec-'+id).classList.add('active');
  if(el) el.classList.add('active');
  const loaders={
    members:renderMembers, gallery:renderGallery, history:renderHistory,
    facts:renderFacts, home:loadHomeForm, contact:loadContactForm,
    settings:loadSettings2, contacts:renderContacts, announcements:renderAnn,
    dashboard:renderDash,
    pagevis:renderPageVis, analytics:renderAnalytics,
    eventsAdmin:renderEvts, recipesAdmin:renderRecipes,
    achievementsAdmin:renderAchs, videosAdmin:renderVideos, pollsAdmin:renderPolls,
    pageeditor:()=>showPeTab('theme', document.querySelector('.pe-tab'))
  };
  if(loaders[id]) loaders[id]();
}

// ═══════════════════════════════════════
// INIT
// ═══════════════════════════════════════
function init(){
  const s=load('settings');
  if(s.familyName) document.getElementById('tbSiteName').textContent=s.familyName;
  renderDash();
  document.getElementById('mmRole').addEventListener('change',function(){
    document.getElementById('mmCustomRoleGrp').style.display=this.value==='other'?'block':'none';
  });
}
// init called via DOMContentLoaded

// ═══════════════════════════════════════
// DASHBOARD
// ═══════════════════════════════════════
function renderDash(){
  const m=Object.values(load('members'));
  const g=loadArr('gallery'),h=loadArr('history'),f=loadArr('facts');
  const gens=[...new Set(m.map(x=>x.gen).filter(Boolean))];
  document.getElementById('d-members').textContent=m.length;
  document.getElementById('d-photos').textContent=g.length;
  document.getElementById('d-history').textContent=h.length;
  document.getElementById('d-facts').textContent=f.length;
  document.getElementById('d-gens').textContent=gens.length;
  const log=loadArr('log');
  document.getElementById('recentAct').innerHTML=log.length
    ?log.slice(-6).reverse().map(l=>`<div style="padding:5px 0;border-bottom:1px solid var(--border);color:var(--tm);">${l}</div>`).join('')
    :'<span style="color:var(--tl);">No activity yet.</span>';
}
function logAct(msg){ const log=loadArr('log'); log.push(`${new Date().toLocaleDateString()} — ${msg}`); save('log',log.slice(-50)); }

// ═══════════════════════════════════════
// MEMBERS
// ═══════════════════════════════════════
let mFilter='',mGenFilter='';
function searchM(q){ mFilter=q; renderMembers(); }
function filterMGen(g){ mGenFilter=g; renderMembers(); }

function renderMembers(){
  const data=load('members');
  let list=Object.values(data);
  if(mGenFilter) list=list.filter(m=>m.gen==mGenFilter);
  if(mFilter){ const q=mFilter.toLowerCase(); list=list.filter(m=>([m.firstName,m.lastName,m.role,m.place].join(' ')).toLowerCase().includes(q)); }
  list.sort((a,b)=>(parseInt(a.gen)||9)-(parseInt(b.gen)||9));
  const grid=document.getElementById('membersGrid');
  if(!list.length){ grid.innerHTML='<div style="grid-column:1/-1;text-align:center;padding:60px;color:var(--tl);"><div style="font-size:42px;margin-bottom:12px;">🌿</div><p>No members yet. Click <strong>Add Member</strong>!</p></div>'; return; }
  grid.innerHTML=list.map(m=>{
    const name=[m.firstName,m.lastName].filter(Boolean).join(' ')||'Unnamed';
    const avatarCls=m.deceased?'d':m.ancestor?'a':m.inlaw?'il':m.female?'f':'';
    const emoji=m.female?'👩':m.ancestor?'👴':'👨';
    const dates=[m.born,m.died?'† '+m.died:''].filter(Boolean).join(' · ')||'–';
    const avatar=m.photo?`<div class="mavatar ${avatarCls}"><img src="${m.photo}" alt="${name}" onerror="this.parentNode.innerHTML='${emoji}'"/></div>`:`<div class="mavatar ${avatarCls}">${emoji}</div>`;
    return `<div class="mcard">
      <div class="mcard-top">${avatar}<div>
        <div class="mname">${name}</div>
        <div class="mrole">${m.role||'–'}</div>
        <div class="mdates">${dates}</div>
      </div></div>
      <div class="mtags">
        ${m.gen?`<span class="tag tag-g">Gen ${m.gen}</span>`:''}
        ${m.female?`<span class="tag tag-f">F</span>`:''}
        ${m.ancestor?`<span class="tag tag-a">Ancestor</span>`:''}
        ${m.inlaw?`<span class="tag tag-il">In-law</span>`:''}
        ${m.deceased||m.died?`<span class="tag tag-d">✝</span>`:''}
        ${m.spouseId?`<span class="tag" style="background:#fdf5e0;color:#8a6a00;">💛</span>`:''}
      </div>
      <div class="mactions">
        <button class="mbtn" onclick="copyId('${m.id}')" title="Copy ID">📋 ID</button>
        <button class="mbtn" onclick="openEditMember('${m.id}')">✏️</button>
        <button class="mbtn mbtn-red" onclick="delMember('${m.id}')">🗑️</button>
      </div>
    </div>`;
  }).join('');
}

function openMemberModal(){
  document.getElementById('mmId').value='';
  document.getElementById('mmTitle').textContent='Add Family Member';
  ['mmFirst','mmLast','mmBorn','mmDied','mmPlace','mmOcc','mmNotes','mmFather','mmMother','mmSpouse','mmCustomRole','mmPhotoUrl'].forEach(id=>{ const el=document.getElementById(id); if(el) el.value=''; });
  document.getElementById('mmRole').value='';document.getElementById('mmGen').value='';
  document.getElementById('mmFemale').checked=false;document.getElementById('mmAncestor').checked=false;
  document.getElementById('mmDeceased').checked=false;document.getElementById('mmInlaw').checked=false;
  document.getElementById('mmPhotoPreview').style.display='none';
  document.getElementById('mmPhotoPlaceholder').style.display='block';
  document.getElementById('mmCustomRoleGrp').style.display='none';
  document.getElementById('memberModal').classList.add('open');
}

function openEditMember(id){
  const m=load('members')[id]; if(!m) return;
  document.getElementById('mmId').value=id;
  document.getElementById('mmTitle').textContent='Edit Family Member';
  document.getElementById('mmFirst').value=m.firstName||'';
  document.getElementById('mmLast').value=m.lastName||'';
  document.getElementById('mmRole').value=m.role||'';
  document.getElementById('mmGen').value=m.gen||'';
  document.getElementById('mmBorn').value=m.born||'';
  document.getElementById('mmDied').value=m.died||'';
  document.getElementById('mmPlace').value=m.place||'';
  document.getElementById('mmOcc').value=m.occupation||'';
  document.getElementById('mmNotes').value=m.notes||'';
  document.getElementById('mmFather').value=m.fatherId||'';
  document.getElementById('mmMother').value=m.motherId||'';
  document.getElementById('mmSpouse').value=m.spouseId||'';
  document.getElementById('mmFemale').checked=!!m.female;
  document.getElementById('mmAncestor').checked=!!m.ancestor;
  document.getElementById('mmDeceased').checked=!!m.deceased;
  document.getElementById('mmInlaw').checked=!!m.inlaw;
  if(m.photo){
    document.getElementById('mmPhotoPreview').src=m.photo;
    document.getElementById('mmPhotoPreview').style.display='block';
    document.getElementById('mmPhotoPlaceholder').style.display='none';
    document.getElementById('mmPhotoUrl').value=m.photo;
  } else {
    document.getElementById('mmPhotoPreview').style.display='none';
    document.getElementById('mmPhotoPlaceholder').style.display='block';
    document.getElementById('mmPhotoUrl').value='';
  }
  document.getElementById('memberModal').classList.add('open');
}

function closeMemberModal(){ document.getElementById('memberModal').classList.remove('open'); }

// Photo handling
function handlePhotoUpload(input){
  const file=input.files[0]; if(!file) return;
  const reader=new FileReader();
  reader.onload=e=>{
    document.getElementById('mmPhotoPreview').src=e.target.result;
    document.getElementById('mmPhotoPreview').style.display='block';
    document.getElementById('mmPhotoPlaceholder').style.display='none';
    document.getElementById('mmPhotoUrl').value=e.target.result;
  };
  reader.readAsDataURL(file);
}

function previewPhotoUrl(url){
  if(url){
    document.getElementById('mmPhotoPreview').src=url;
    document.getElementById('mmPhotoPreview').style.display='block';
    document.getElementById('mmPhotoPlaceholder').style.display='none';
  } else {
    document.getElementById('mmPhotoPreview').style.display='none';
    document.getElementById('mmPhotoPlaceholder').style.display='block';
  }
}

function saveMember(){
  const first=document.getElementById('mmFirst').value.trim();
  if(!first){ alert('Please enter a first name.'); return; }
  const roleVal=document.getElementById('mmRole').value;
  const role=roleVal==='other'?document.getElementById('mmCustomRole').value.trim():roleVal;
  const id=document.getElementById('mmId').value||'member_'+Date.now();
  const data=load('members');
  const photo=document.getElementById('mmPhotoUrl').value.trim();
  data[id]={
    id,firstName:first,lastName:document.getElementById('mmLast').value.trim(),
    role,gen:document.getElementById('mmGen').value,
    born:document.getElementById('mmBorn').value.trim(),died:document.getElementById('mmDied').value.trim(),
    place:document.getElementById('mmPlace').value.trim(),occupation:document.getElementById('mmOcc').value.trim(),
    notes:document.getElementById('mmNotes').value.trim(),photo:photo||'',
    fatherId:document.getElementById('mmFather').value.trim(),
    motherId:document.getElementById('mmMother').value.trim(),
    spouseId:document.getElementById('mmSpouse').value.trim(),
    female:document.getElementById('mmFemale').checked,
    ancestor:document.getElementById('mmAncestor').checked,
    deceased:document.getElementById('mmDeceased').checked||!!document.getElementById('mmDied').value.trim(),
    inlaw:document.getElementById('mmInlaw').checked,
  };
  save('members',data);
  closeMemberModal(); renderMembers(); renderDash();
  logAct('Member saved: '+first); toast('✅ '+first+' saved!');
}

function delMember(id){
  const data=load('members');
  const name=[data[id]?.firstName,data[id]?.lastName].filter(Boolean).join(' ')||'member';
  if(!confirm('Delete '+name+'?')) return;
  delete data[id]; save('members',data); renderMembers(); renderDash();
  logAct('Member deleted: '+name); toast('🗑️ Deleted.');
}

function copyId(id){ navigator.clipboard.writeText(id).then(()=>toast('📋 ID copied! Paste into another member\'s link field.')); }
function exportMembers(){ dl(load('members'),'nukala-members.json'); }

// ═══════════════════════════════════════
// HISTORY
// ═══════════════════════════════════════
function renderHistory(){
  const list=loadArr('history');
  const el=document.getElementById('historyList');
  if(!list.length){ el.innerHTML='<div style="text-align:center;padding:60px;color:var(--tl);"><div style="font-size:36px;margin-bottom:10px;">📜</div><p>No events yet.</p></div>'; return; }
  el.innerHTML=list.map((h,i)=>`<div class="tl-item">
    <div class="tl-year">${h.year}</div>
    <div class="tl-body">
      <div class="tl-title-txt">${h.title}</div>
      ${h.desc?`<div class="tl-desc">${h.desc}</div>`:''}
      <div style="margin-top:6px;font-size:.62rem;background:rgba(92,122,92,.1);color:var(--sage-d);padding:2px 8px;border-radius:20px;display:inline-block;">${h.tag||''}</div>
      <div class="tl-actions">
        <button class="btn btn-outline btn-sm" onclick="openEditHist(${i})">✏️ Edit</button>
        <button class="btn btn-red btn-sm" onclick="delHist(${i})">🗑️</button>
      </div>
    </div>
  </div>`).join('');
}

function openHistModal(){ document.getElementById('hmId').value=''; document.getElementById('hmTitle').textContent='Add History Event'; ['hmYear','hmTitle2','hmDesc'].forEach(id=>document.getElementById(id).value=''); document.getElementById('hmTag').value='📍 Origins'; document.getElementById('historyModal').classList.add('open'); }
function openEditHist(i){ const h=loadArr('history')[i]; if(!h) return; document.getElementById('hmId').value=i; document.getElementById('hmTitle').textContent='Edit Event'; document.getElementById('hmYear').value=h.year||''; document.getElementById('hmTitle2').value=h.title||''; document.getElementById('hmDesc').value=h.desc||''; document.getElementById('hmTag').value=h.tag||'📍 Origins'; document.getElementById('historyModal').classList.add('open'); }
function closeHistModal(){ document.getElementById('historyModal').classList.remove('open'); }
function saveHist(){ const year=document.getElementById('hmYear').value.trim(),title=document.getElementById('hmTitle2').value.trim(); if(!year||!title){ alert('Enter year and title.'); return; } const list=loadArr('history'),idx=document.getElementById('hmId').value; const item={year,title,desc:document.getElementById('hmDesc').value.trim(),tag:document.getElementById('hmTag').value}; if(idx!=='') list[parseInt(idx)]=item; else list.push(item); save('history',list); closeHistModal(); renderHistory(); renderDash(); logAct('History event: '+title); toast('✅ Event saved!'); }
function delHist(i){ if(!confirm('Delete?')) return; const list=loadArr('history'); list.splice(i,1); save('history',list); renderHistory(); renderDash(); toast('🗑️ Deleted.'); }

// ═══════════════════════════════════════
// GALLERY
// ═══════════════════════════════════════
function renderGallery(){
  const list=loadArr('gallery');
  const grid=document.getElementById('galleryGrid');
  if(!list.length){ grid.innerHTML='<div style="grid-column:1/-1;text-align:center;padding:60px;color:var(--tl);"><div style="font-size:36px;margin-bottom:10px;">🖼️</div><p>No photos yet.</p></div>'; return; }
  grid.innerHTML=list.map((g,i)=>`<div class="gal-item">
    ${g.url?`<img class="gal-img" src="${g.url}" alt="${g.title}" onerror="this.style.display='none';this.nextSibling.style.display='flex'"/><div class="gal-placeholder" style="display:none;">🖼️</div>`:`<div class="gal-placeholder">🖼️</div>`}
    <div class="gal-info"><div class="gal-title">${g.title}</div><div class="gal-cat">${g.cat||''} ${g.year?'· '+g.year:''}</div></div>
    <div class="gal-actions">
      <button class="mbtn" style="flex:1;" onclick="openEditGal(${i})">✏️</button>
      <button class="mbtn mbtn-red" onclick="delGal(${i})">🗑️</button>
    </div>
  </div>`).join('');
}

function previewGal(url){ const p=document.getElementById('gmPreview'),img=document.getElementById('gmPreviewImg'); if(url){ img.src=url; p.style.display='block'; } else p.style.display='none'; }
function openGalModal(){ document.getElementById('gmId').value=''; document.getElementById('gmTitle').textContent='Add Photo'; ['gmTitle2','gmUrl','gmYear','gmCaption'].forEach(id=>document.getElementById(id).value=''); document.getElementById('gmCat').value='family'; document.getElementById('gmPreview').style.display='none'; document.getElementById('galleryModal').classList.add('open'); }
function openEditGal(i){ const g=loadArr('gallery')[i]; if(!g) return; document.getElementById('gmId').value=i; document.getElementById('gmTitle').textContent='Edit Photo'; document.getElementById('gmTitle2').value=g.title||''; document.getElementById('gmUrl').value=g.url||''; document.getElementById('gmCat').value=g.cat||'family'; document.getElementById('gmYear').value=g.year||''; document.getElementById('gmCaption').value=g.caption||''; if(g.url){ document.getElementById('gmPreviewImg').src=g.url; document.getElementById('gmPreview').style.display='block'; } document.getElementById('galleryModal').classList.add('open'); }
function closeGalModal(){ document.getElementById('galleryModal').classList.remove('open'); }
function saveGal(){ const title=document.getElementById('gmTitle2').value.trim(); if(!title){ alert('Enter a title.'); return; } const list=loadArr('gallery'),idx=document.getElementById('gmId').value; const item={title,url:document.getElementById('gmUrl').value.trim(),cat:document.getElementById('gmCat').value,year:document.getElementById('gmYear').value.trim(),caption:document.getElementById('gmCaption').value.trim()}; if(idx!=='') list[parseInt(idx)]=item; else list.push(item); save('gallery',list); closeGalModal(); renderGallery(); renderDash(); logAct('Photo: '+title); toast('✅ Photo saved!'); }
function delGal(i){ if(!confirm('Delete?')) return; const list=loadArr('gallery'); list.splice(i,1); save('gallery',list); renderGallery(); renderDash(); toast('🗑️ Deleted.'); }

// ═══════════════════════════════════════
// FACTS
// ═══════════════════════════════════════
function renderFacts(){
  const list=loadArr('facts');
  const el=document.getElementById('factsList');
  if(!list.length){ el.innerHTML='<div style="text-align:center;padding:60px;color:var(--tl);"><div style="font-size:36px;margin-bottom:10px;">🌟</div><p>No facts yet. Click <strong>Add Fact</strong>!</p></div>'; return; }
  el.innerHTML=list.map((f,i)=>`<div class="fact-admin-item">
    <div class="fact-admin-icon">${f.icon||'📌'}</div>
    <div class="fact-admin-body">
      <div class="fact-admin-title">${f.title}</div>
      ${f.desc?`<div class="fact-admin-desc">${f.desc}</div>`:''}
      <div class="fact-admin-meta">
        <span class="fact-admin-tag">${f.category||'Other'}</span>
        ${f.person?`<span style="font-size:.7rem;color:var(--tl);">👤 ${f.person}</span>`:''}
        ${f.year?`<span style="font-size:.7rem;color:var(--tl);">📅 ${f.year}</span>`:''}
      </div>
      <div style="display:flex;gap:6px;margin-top:8px;">
        <button class="btn btn-outline btn-sm" onclick="openEditFact(${i})">✏️ Edit</button>
        <button class="btn btn-red btn-sm" onclick="delFact(${i})">🗑️</button>
      </div>
    </div>
  </div>`).join('');
}

function openFactModal(){ document.getElementById('fmId').value=''; document.getElementById('fmTitle').textContent='Add Interesting Fact'; ['fmTitle2','fmDesc','fmIcon','fmPerson','fmYear'].forEach(id=>document.getElementById(id).value=''); document.getElementById('fmCat').value='Achievement'; document.getElementById('factModal').classList.add('open'); }
function openEditFact(i){ const f=loadArr('facts')[i]; if(!f) return; document.getElementById('fmId').value=i; document.getElementById('fmTitle').textContent='Edit Fact'; document.getElementById('fmTitle2').value=f.title||''; document.getElementById('fmDesc').value=f.desc||''; document.getElementById('fmCat').value=f.category||'Achievement'; document.getElementById('fmIcon').value=f.icon||''; document.getElementById('fmPerson').value=f.person||''; document.getElementById('fmYear').value=f.year||''; document.getElementById('factModal').classList.add('open'); }
function closeFactModal(){ document.getElementById('factModal').classList.remove('open'); }
function saveFact(){ const title=document.getElementById('fmTitle2').value.trim(); if(!title){ alert('Enter a title.'); return; } const list=loadArr('facts'),idx=document.getElementById('fmId').value; const item={title,desc:document.getElementById('fmDesc').value.trim(),category:document.getElementById('fmCat').value,icon:document.getElementById('fmIcon').value.trim(),person:document.getElementById('fmPerson').value.trim(),year:document.getElementById('fmYear').value.trim()}; if(idx!=='') list[parseInt(idx)]=item; else list.push(item); save('facts',list); closeFactModal(); renderFacts(); renderDash(); logAct('Fact: '+title); toast('✅ Fact saved!'); }
function delFact(i){ if(!confirm('Delete?')) return; const list=loadArr('facts'); list.splice(i,1); save('facts',list); renderFacts(); renderDash(); toast('🗑️ Deleted.'); }

// ═══════════════════════════════════════
// HOME PAGE
// ═══════════════════════════════════════
function loadHomeForm(){
  const d=load('home'),s=load('settings');
  document.getElementById('homeNavName').value=d.navName||s.familyName||'NUKALA';
  document.getElementById('homeSiteSubtitle').value=d.siteSubtitle||'Family Tree';
  document.getElementById('homeTitle').value=d.title||'';
  document.getElementById('homeTagline').value=d.tagline||'';
  document.getElementById('homeWelcome').value=d.welcome||'';
  document.getElementById('homeStat1Num').value=d.stat1num||'';document.getElementById('homeStat1Lbl').value=d.stat1lbl||'Generations';
  document.getElementById('homeStat2Num').value=d.stat2num||'';document.getElementById('homeStat2Lbl').value=d.stat2lbl||'Family Members';
  document.getElementById('homeStat3Num').value=d.stat3num||'';document.getElementById('homeStat3Lbl').value=d.stat3lbl||'Stories Shared';
  document.getElementById('homeAboutTitle').value=d.aboutTitle||'';
  document.getElementById('homeAbout1').value=d.about1||'';document.getElementById('homeAbout2').value=d.about2||'';document.getElementById('homeAbout3').value=d.about3||'';
}
function saveHome(){
  const navName=document.getElementById('homeNavName').value.trim()||'NUKALA';
  save('home',{navName,siteSubtitle:document.getElementById('homeSiteSubtitle').value.trim(),title:document.getElementById('homeTitle').value.trim(),tagline:document.getElementById('homeTagline').value.trim(),welcome:document.getElementById('homeWelcome').value.trim(),stat1num:document.getElementById('homeStat1Num').value.trim(),stat1lbl:document.getElementById('homeStat1Lbl').value.trim(),stat2num:document.getElementById('homeStat2Num').value.trim(),stat2lbl:document.getElementById('homeStat2Lbl').value.trim(),stat3num:document.getElementById('homeStat3Num').value.trim(),stat3lbl:document.getElementById('homeStat3Lbl').value.trim(),aboutTitle:document.getElementById('homeAboutTitle').value.trim(),about1:document.getElementById('homeAbout1').value.trim(),about2:document.getElementById('homeAbout2').value.trim(),about3:document.getElementById('homeAbout3').value.trim()});
  // Also update settings family name
  const s=load('settings'); s.familyName=navName; save('settings',s);
  document.getElementById('tbSiteName').textContent=navName;
  logAct('Home page updated'); toast('✅ Home page saved!');
}

// ═══════════════════════════════════════
// CONTACT PAGE
// ═══════════════════════════════════════
function loadContactForm(){
  const d=load('contact');
  document.getElementById('cName').value=d.name||'';document.getElementById('cEmail').value=d.email||'';
  document.getElementById('cMsg').value=d.msg||'';document.getElementById('cFormspree').value=d.formspree||'';
  document.getElementById('cw1i').value=d.cw1icon||'📸';document.getElementById('cw1t').value=d.cw1title||'Share a Photo';document.getElementById('cw1d').value=d.cw1desc||'';
  document.getElementById('cw2i').value=d.cw2icon||'📝';document.getElementById('cw2t').value=d.cw2title||'Add a Story';document.getElementById('cw2d').value=d.cw2desc||'';
}
function saveContact(){ save('contact',{name:document.getElementById('cName').value.trim(),email:document.getElementById('cEmail').value.trim(),msg:document.getElementById('cMsg').value.trim(),formspree:document.getElementById('cFormspree').value.trim(),cw1icon:document.getElementById('cw1i').value.trim(),cw1title:document.getElementById('cw1t').value.trim(),cw1desc:document.getElementById('cw1d').value.trim(),cw2icon:document.getElementById('cw2i').value.trim(),cw2title:document.getElementById('cw2t').value.trim(),cw2desc:document.getElementById('cw2d').value.trim()}); logAct('Contact page updated'); toast('✅ Contact page saved!'); }

// ═══════════════════════════════════════
// CONTACTS
// ═══════════════════════════════════════
let cSearchQ='';
function searchContacts(q){ cSearchQ=q; renderContacts(); }
function renderContacts(){
  const members=Object.values(load('members'));
  const contacts=load('contacts');
  let list=members;
  if(cSearchQ){ const q=cSearchQ.toLowerCase(); list=list.filter(m=>{ const c=contacts[m.id]||{}; return ([m.firstName,m.lastName,c.city,c.email].join(' ')).toLowerCase().includes(q); }); }
  list.sort((a,b)=>(parseInt(a.gen)||9)-(parseInt(b.gen)||9));
  const grid=document.getElementById('contactsGrid');
  if(!list.length){ grid.innerHTML='<div style="grid-column:1/-1;text-align:center;padding:60px;color:var(--tl);">No members yet.</div>'; return; }
  grid.innerHTML=list.map(m=>{
    const c=contacts[m.id]||{};
    const name=[m.firstName,m.lastName].filter(Boolean).join(' ')||'Unnamed';
    const has=c.phone||c.email||c.city;
    const photo=m.photo?`<div class="mavatar" style="width:36px;height:36px;overflow:hidden;border-radius:50%;border:2px solid var(--border);flex-shrink:0;"><img src="${m.photo}" style="width:100%;height:100%;object-fit:cover;" onerror="this.parentNode.innerHTML='${m.female?'👩':'👨'}'"/></div>`:`<div class="mavatar ${m.female?'f':'a'}" style="width:36px;height:36px;flex-shrink:0;">${m.female?'👩':'👨'}</div>`;
    return `<div class="contact-admin-card">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:10px;">
        ${photo}
        <div style="flex:1;min-width:0;">
          <div style="font-family:'Cormorant Garamond',serif;font-size:.95rem;font-weight:600;">${name}</div>
          <div style="font-size:.6rem;font-weight:500;letter-spacing:.08em;text-transform:uppercase;color:var(--sage-d);">${m.role||'–'}</div>
        </div>
        <span style="font-size:.6rem;${has?'background:#f0f5f0;color:var(--sage-d)':'background:#faf0f0;color:var(--red)'};padding:2px 7px;border-radius:10px;font-weight:500;">${has?'✅':'No info'}</span>
      </div>
      ${c.phone?`<div style="font-size:.76rem;color:var(--tm);margin-bottom:3px;">📱 ${c.phone}</div>`:''}
      ${c.email?`<div style="font-size:.76rem;color:var(--tm);margin-bottom:3px;">📧 ${c.email}</div>`:''}
      ${c.city?`<div style="font-size:.76rem;color:var(--tm);margin-bottom:3px;">📍 ${c.city}</div>`:''}
      ${c.birthday?`<div style="font-size:.76rem;color:var(--tm);margin-bottom:3px;">🎂 ${c.birthday}</div>`:''}
      ${c.social?`<div style="font-size:.76rem;color:var(--tm);margin-bottom:3px;">📘 ${c.social}</div>`:''}
      <button class="btn btn-outline btn-sm" style="width:100%;margin-top:8px;" onclick="openContactEdit('${m.id}')">${has?'✏️ Edit':'➕ Add'} Contact</button>
    </div>`;
  }).join('');
}

function openContactEdit(memberId){
  const members=load('members'),contacts=load('contacts');
  const m=members[memberId]; if(!m) return;
  const c=contacts[memberId]||{};
  const name=[m.firstName,m.lastName].filter(Boolean).join(' ');
  const old=document.getElementById('contactEditModal');
  if(old) old.remove();
  const modal=document.createElement('div');
  modal.id='contactEditModal';modal.className='modal-bg open';
  modal.innerHTML=`<div class="modal" style="max-width:460px;">
    <button class="modal-close" onclick="document.getElementById('contactEditModal').remove()">✕</button>
    <h2>${name}</h2><p class="modal-sub">Contact details — admin only.</p>
    <div class="fgrp"><label>📱 Phone</label><input type="text" id="ce-phone" value="${c.phone||''}" placeholder="+91 98765 43210"/></div>
    <div class="fgrp"><label>📧 Email</label><input type="text" id="ce-email" value="${c.email||''}" placeholder="email@example.com"/></div>
    <div class="fgrp"><label>📍 City / Country</label><input type="text" id="ce-city" value="${c.city||''}" placeholder="Hyderabad, India"/></div>
    <div class="fgrp"><label>🎂 Birthday</label><input type="text" id="ce-birthday" value="${c.birthday||''}" placeholder="15 August"/></div>
    <div class="fgrp"><label>📘 Social Media</label><input type="text" id="ce-social" value="${c.social||''}" placeholder="facebook.com/..."/></div>
    <div class="fgrp"><label>📝 Notes</label><textarea id="ce-notes" rows="2">${c.notes||''}</textarea></div>
    <div class="modal-footer">
      <button class="btn btn-green" style="flex:1;" onclick="saveContactEntry('${memberId}')">💾 Save</button>
      <button class="btn btn-outline" onclick="document.getElementById('contactEditModal').remove()">Cancel</button>
    </div>
  </div>`;
  document.body.appendChild(modal);
}

function saveContactEntry(id){
  const contacts=load('contacts');
  contacts[id]={phone:document.getElementById('ce-phone').value.trim(),email:document.getElementById('ce-email').value.trim(),city:document.getElementById('ce-city').value.trim(),birthday:document.getElementById('ce-birthday').value.trim(),social:document.getElementById('ce-social').value.trim(),notes:document.getElementById('ce-notes').value.trim()};
  save('contacts',contacts);
  document.getElementById('contactEditModal').remove();
  renderContacts(); logAct('Contact updated'); toast('✅ Contact saved!');
}

function exportContacts(){
  const members=Object.values(load('members')),contacts=load('contacts');
  const rows=[['Name','Role','Gen','Phone','Email','City','Birthday','Social']];
  members.forEach(m=>{ const c=contacts[m.id]||{}; rows.push([[m.firstName,m.lastName].filter(Boolean).join(' '),m.role||'',m.gen||'',c.phone||'',c.email||'',c.city||'',c.birthday||'',c.social||'']); });
  const csv=rows.map(r=>r.map(v=>`"${v}"`).join(',')).join('\n');
  const blob=new Blob([csv],{type:'text/csv'});
  const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='nukala-contacts.csv'; a.click();
  toast('📥 Contacts exported!');
}

// ═══════════════════════════════════════
// ANNOUNCEMENTS
// ═══════════════════════════════════════
function renderAnn(){
  const members=Object.values(load('members')),contacts=load('contacts');
  const recList=document.getElementById('recipientsList');
  if(!members.length){ recList.innerHTML='<p style="color:var(--tl);font-size:.78rem;padding:8px;">No members yet.</p>'; return; }
  recList.innerHTML=members.sort((a,b)=>(parseInt(a.gen)||9)-(parseInt(b.gen)||9)).map(m=>{
    const c=contacts[m.id]||{};
    const name=[m.firstName,m.lastName].filter(Boolean).join(' ')||'Unnamed';
    return `<label style="display:flex;align-items:center;gap:7px;padding:7px 9px;background:white;border-radius:8px;border:1px solid var(--border);cursor:pointer;font-size:.78rem;">
      <input type="checkbox" class="rcb" data-id="${m.id}" data-name="${name}" data-email="${c.email||''}" data-phone="${c.phone||''}" style="accent-color:var(--sage-d);width:14px;height:14px;"/>
      <div><div style="font-weight:500;color:var(--td);">${name}</div>
      <div style="font-size:.66rem;color:var(--tl);">${c.email||'<span style="color:var(--red);">No email</span>'}</div></div>
    </label>`;
  }).join('');
  document.querySelectorAll('.rcb').forEach(cb=>cb.addEventListener('change',updateRecCount));
  updateRecCount();
  const al=loadArr('annLog');
  document.getElementById('annHistory').innerHTML=al.length?al.slice(-8).reverse().map(a=>`<div class="ann-hist-item"><strong>${a.title}</strong><br/><span style="font-size:.7rem;color:var(--tl);">${a.date} · ${a.count} member(s) via ${a.via}</span></div>`).join(''):'<span style="color:var(--tl);font-size:.82rem;">No announcements yet.</span>';
}

function updateRecCount(){ document.getElementById('recCount').textContent=document.querySelectorAll('.rcb:checked').length+' selected'; }
function selAll(){ document.querySelectorAll('.rcb').forEach(c=>c.checked=true); updateRecCount(); }
function selNone(){ document.querySelectorAll('.rcb').forEach(c=>c.checked=false); updateRecCount(); }
function getSelected(){ const s=[]; document.querySelectorAll('.rcb:checked').forEach(c=>s.push({id:c.dataset.id,name:c.dataset.name,email:c.dataset.email,phone:c.dataset.phone})); return s; }

function buildAnn(){ const t=document.getElementById('annTitle').value.trim(),m=document.getElementById('annMsg').value.trim(); if(!t||!m){ alert('Enter title and message.'); return null; } return {title:t,msg:m}; }

function sendEmail(){
  const ann=buildAnn(); if(!ann) return;
  const rec=getSelected(); if(!rec.length){ alert('Select recipients.'); return; }
  const withEmail=rec.filter(r=>r.email);
  if(!withEmail.length){ alert('No emails found. Add emails in Contacts first.'); return; }
  const from=document.getElementById('annFrom').value.trim()||'The Nukala Family';
  window.location.href=`mailto:${withEmail.map(r=>r.email).join(',')}?subject=${encodeURIComponent(ann.title)}&body=${encodeURIComponent(`Dear Family,\n\n${ann.msg}\n\nWith love,\n${from}`)}`;
  logAnnouncement(ann.title,withEmail.length,'Email'); toast('📧 Email client opened!');
}

function sendWA(){
  const ann=buildAnn(); if(!ann) return;
  const rec=getSelected(); if(!rec.length){ alert('Select recipients.'); return; }
  const msg=`🌳 *${ann.title}*\n\nDear Nukala Family,\n\n${ann.msg}\n\n— The Nukala Family`;
  navigator.clipboard.writeText(msg).then(()=>{
    document.getElementById('annPreview').textContent=msg;
    document.getElementById('annPreviewPanel').style.display='block';
    const url=rec.length===1&&rec[0].phone?`https://wa.me/${rec[0].phone.replace(/[^0-9]/g,'')}?text=${encodeURIComponent(msg)}`:`https://wa.me/?text=${encodeURIComponent(msg)}`;
    setTimeout(()=>window.open(url,'_blank'),500);
    logAnnouncement(ann.title,rec.length,'WhatsApp'); toast('📱 Message copied & WhatsApp opened!');
  });
}

function copyAnn(){ navigator.clipboard.writeText(document.getElementById('annPreview').textContent).then(()=>toast('📋 Copied!')); }
function logAnnouncement(title,count,via){ const al=loadArr('annLog'); al.push({title,count,via,date:new Date().toLocaleDateString()}); save('annLog',al); logAct('Announcement: '+title); renderAnn(); }

// ═══════════════════════════════════════
// SETTINGS
// ═══════════════════════════════════════
function loadSettings2(){ const s=load('settings'); document.getElementById('setFamily').value=s.familyName||'Nukala'; document.getElementById('setFooter').value=s.footer||''; }
function saveSitePass(){ const p=document.getElementById('newSitePass').value.trim(); if(!p){ alert('Enter password.'); return; } localStorage.setItem('nukala_site_pass',p); document.getElementById('newSitePass').value=''; logAct('Site password updated'); toast('✅ Password updated!'); }
function saveAdminPass(){ const p=document.getElementById('newAdminPass').value.trim(); if(!p){ alert('Enter password.'); return; } localStorage.setItem('nukala_admin_pass',p); document.getElementById('newAdminPass').value=''; logAct('Admin password updated'); toast('✅ Admin password updated!'); }
function saveIdentity(){ const s=load('settings'); s.familyName=document.getElementById('setFamily').value.trim(); s.footer=document.getElementById('setFooter').value.trim(); save('settings',s); document.getElementById('tbSiteName').textContent=s.familyName; logAct('Identity updated'); toast('✅ Saved!'); }

// ═══════════════════════════════════════
// EXPORT / IMPORT / RESET
// ═══════════════════════════════════════
function dl(data,filename){ const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'}); const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download=filename; a.click(); }
function exportAll(){ dl({members:load('members'),contacts:load('contacts'),gallery:loadArr('gallery'),history:loadArr('history'),facts:loadArr('facts'),home:load('home'),contact:load('contact'),settings:load('settings')},'nukala-backup-'+new Date().toISOString().split('T')[0]+'.json'); toast('📥 Full backup exported!'); }
function doImport(){ try{ const p=JSON.parse(document.getElementById('importData').value.trim()); if(p.members)save('members',p.members); if(p.contacts)save('contacts',p.contacts); if(p.gallery)save('gallery',p.gallery); if(p.history)save('history',p.history); if(p.facts)save('facts',p.facts); if(p.home)save('home',p.home); if(p.contact)save('contact',p.contact); if(p.settings)save('settings',p.settings); document.getElementById('importModal').classList.remove('open'); renderDash(); toast('📤 Imported!'); } catch(e){ alert('Invalid JSON.'); } }
function resetAll(){ Object.values(LS).forEach(k=>localStorage.removeItem(k)); renderDash(); toast('🗑️ Reset.'); }

// ═══════════════════════════════════════
// PAGE EDITOR
// ═══════════════════════════════════════
function showPeTab(id, el){
  document.querySelectorAll('.pe-section').forEach(s=>s.classList.remove('active'));
  document.querySelectorAll('.pe-tab').forEach(t=>t.classList.remove('active'));
  document.getElementById('pe-'+id).classList.add('active');
  if(el) el.classList.add('active');
  if(id==='theme') loadThemeForm();
  if(id==='sitewide') loadSiteWideForm();
  if(id==='homepage') loadHomePageEditor();
  if(id==='contactpage') loadContactPageEditor();
  if(id==='gallerypage') loadGalleryPageEditor();
  if(id==='heropage') loadHeroEditor();
  if(id==='newpages') loadNewPagesForm();
  if(id==='newpages') loadNewPages();
  if(id==='navmenu') loadNavMenu();
  if(id==='typography') loadTypography();
}

// ── THEME ──
const themes={
  sage:{primary:'#5c7a5c',secondary:'#8aab8a',highlight:'#c9a84c',bg:'#faf8f4',text:'#2c2c2c',nav:'#faf8f4'},
  navy:{primary:'#1a3a5c',secondary:'#2e6090',highlight:'#c9a84c',bg:'#f4f6fa',text:'#1a2a3a',nav:'#f4f6fa'},
  gold:{primary:'#8a6a00',secondary:'#c9a84c',highlight:'#e8d5a0',bg:'#fdfaf4',text:'#2c2a1a',nav:'#fdfaf4'},
  maroon:{primary:'#6b1a1a',secondary:'#a03030',highlight:'#c9a84c',bg:'#faf8f4',text:'#2c1a1a',nav:'#faf8f4'},
  purple:{primary:'#4a2060',secondary:'#7050a0',highlight:'#c9a84c',bg:'#faf8ff',text:'#1a0a2c',nav:'#faf8ff'},
  teal:{primary:'#0d6e6e',secondary:'#1aab9b',highlight:'#c9a84c',bg:'#f4fafa',text:'#0a2020',nav:'#f4fafa'},
};

function applyTheme(name){
  const t=themes[name]; if(!t) return;
  document.getElementById('clrPrimary').value=t.primary; document.getElementById('clrPrimaryHex').value=t.primary;
  document.getElementById('clrSecondary').value=t.secondary; document.getElementById('clrSecondaryHex').value=t.secondary;
  document.getElementById('clrHighlight').value=t.highlight; document.getElementById('clrHighlightHex').value=t.highlight;
  document.getElementById('clrBg').value=t.bg; document.getElementById('clrBgHex').value=t.bg;
  document.getElementById('clrText').value=t.text; document.getElementById('clrTextHex').value=t.text;
  document.getElementById('clrNav').value=t.nav; document.getElementById('clrNavHex').value=t.nav;
}

function syncColour(name){ const hex=document.getElementById('clrHex'+name).value; if(/^#[0-9A-Fa-f]{6}$/.test(hex)) document.getElementById('clr'+name).value=hex; }

function loadThemeForm(){
  const t=load('nukala_theme')||{};
  if(t.primary){ document.getElementById('clrPrimary').value=t.primary; document.getElementById('clrPrimaryHex').value=t.primary; }
  if(t.secondary){ document.getElementById('clrSecondary').value=t.secondary; document.getElementById('clrSecondaryHex').value=t.secondary; }
  if(t.highlight){ document.getElementById('clrHighlight').value=t.highlight; document.getElementById('clrHighlightHex').value=t.highlight; }
  if(t.bg){ document.getElementById('clrBg').value=t.bg; document.getElementById('clrBgHex').value=t.bg; }
  if(t.text){ document.getElementById('clrText').value=t.text; document.getElementById('clrTextHex').value=t.text; }
  if(t.nav){ document.getElementById('clrNav').value=t.nav; document.getElementById('clrNavHex').value=t.nav; }
  if(t.fontHeading) document.getElementById('fontHeading').value=t.fontHeading;
  if(t.fontBody) document.getElementById('fontBody').value=t.fontBody;
}

function saveTheme(){
  const t={
    primary:document.getElementById('clrPrimary').value,
    secondary:document.getElementById('clrSecondary').value,
    highlight:document.getElementById('clrHighlight').value,
    bg:document.getElementById('clrBg').value,
    text:document.getElementById('clrText').value,
    nav:document.getElementById('clrNav').value,
    fontHeading:document.getElementById('fontHeading').value,
    fontBody:document.getElementById('fontBody').value,
  };
  localStorage.setItem('nukala_theme',JSON.stringify(t));
  logAct('Theme updated'); toast('✅ Theme saved! Refresh the website to see changes.');
}

function saveFonts(){
  const t=JSON.parse(localStorage.getItem('nukala_theme')||'{}');
  t.fontHeading=document.getElementById('fontHeading').value;
  t.fontBody=document.getElementById('fontBody').value;
  localStorage.setItem('nukala_theme',JSON.stringify(t));
  logAct('Fonts updated'); toast('✅ Fonts saved!');
}

// ── SITE WIDE ──
function loadSiteWideForm(){
  const d=load('nukala_sitewide')||{};
  document.getElementById('pe-navname').value=d.navName||(load('nukala_home')||{}).navName||'NUKALA';
  document.getElementById('pe-navlinks').value=d.navLinks||'Home,Family Tree,History,Gallery,Facts,Contact';
  document.getElementById('pe-footer').value=d.footer||'© 2024 The Nukala Family · Private & Password Protected · Made with 🌳 & love';
  document.getElementById('pe-footersub').value=d.footerSub||'';
  document.getElementById('pe-logintitle').value=d.loginTitle||'The Nukala Family Tree';
  document.getElementById('pe-loginsub').value=d.loginSub||'A private family archive';
  document.getElementById('pe-loginbtn').value=d.loginBtn||'Enter Family Archive →';
  document.getElementById('pe-loginnote').value=d.loginNote||'This site is exclusively for the Nukala family.';
}

function saveSiteWide(){
  const d={
    navName:document.getElementById('pe-navname').value.trim(),
    navLinks:document.getElementById('pe-navlinks').value.trim(),
    footer:document.getElementById('pe-footer').value.trim(),
    footerSub:document.getElementById('pe-footersub').value.trim(),
    loginTitle:document.getElementById('pe-logintitle').value.trim(),
    loginSub:document.getElementById('pe-loginsub').value.trim(),
    loginBtn:document.getElementById('pe-loginbtn').value.trim(),
    loginNote:document.getElementById('pe-loginnote').value.trim(),
  };
  localStorage.setItem('nukala_sitewide',JSON.stringify(d));
  // Also update home navName
  const h=load('nukala_home')||{}; h.navName=d.navName; save('home',h);
  const s=load('nukala_settings')||{}; s.familyName=d.navName; save('settings',s);
  document.getElementById('tbSiteName').textContent=d.navName;
  logAct('Site wide settings updated'); toast('✅ Site wide settings saved!');
}

// ── HOME PAGE EDITOR ──
function loadHomePageEditor(){
  const d=JSON.parse(localStorage.getItem('nukala_homepage2')||'{}');
  // Quick cards
  const cards=d.quickCards||[
    {icon:'🌿',title:'Family Tree',desc:'Explore our family connections.',link:'tree.html',arrow:'View tree →'},
    {icon:'📜',title:'Our History',desc:'Read stories and milestones.',link:'history.html',arrow:'Read more →'},
    {icon:'🖼️',title:'Photo Gallery',desc:'Browse cherished photos.',link:'gallery.html',arrow:'View photos →'},
    {icon:'✉️',title:'Get in Touch',desc:'Contribute your stories.',link:'contact.html',arrow:'Contact us →'},
  ];
  renderQuickCards(cards);
  // Updates
  const updates=d.updates||[];
  renderUpdateItems(updates);
  document.getElementById('pe-updatestitle').value=d.updatesTitle||'Recent Updates';
}

function renderQuickCards(cards){
  document.getElementById('quickCardsEditor').innerHTML=cards.map((c,i)=>`
    <div class="repeat-item">
      <button class="del-btn" onclick="delQuickCard(${i})">✕</button>
      <div class="frow">
        <div class="fgrp"><label>Icon (emoji)</label><input type="text" value="${c.icon||''}" oninput="updateQC(${i},'icon',this.value)" placeholder="🌿"/></div>
        <div class="fgrp"><label>Title</label><input type="text" value="${c.title||''}" oninput="updateQC(${i},'title',this.value)" placeholder="Family Tree"/></div>
      </div>
      <div class="fgrp"><label>Description</label><input type="text" value="${c.desc||''}" oninput="updateQC(${i},'desc',this.value)" placeholder="Short description..."/></div>
      <div class="frow">
        <div class="fgrp"><label>Link (page)</label><input type="text" value="${c.link||''}" oninput="updateQC(${i},'link',this.value)" placeholder="tree.html"/></div>
        <div class="fgrp"><label>Arrow Text</label><input type="text" value="${c.arrow||''}" oninput="updateQC(${i},'arrow',this.value)" placeholder="View →"/></div>
      </div>
    </div>`).join('');
}

let _quickCards=[];
function updateQC(i,field,val){ _quickCards[i][field]=val; }
function delQuickCard(i){ _quickCards.splice(i,1); renderQuickCards(_quickCards); }
function addQuickCard(){ _quickCards.push({icon:'⭐',title:'New Card',desc:'Description',link:'home.html',arrow:'Go →'}); renderQuickCards(_quickCards); }

function renderUpdateItems(items){
  _updateItems=[...items];
  document.getElementById('updatesEditor').innerHTML=items.map((u,i)=>`
    <div class="repeat-item">
      <button class="del-btn" onclick="delUpdateItem(${i})">✕</button>
      <div class="frow">
        <div class="fgrp"><label>Title</label><input type="text" value="${u.title||''}" oninput="updateUI(${i},'title',this.value)" placeholder="Update title"/></div>
        <div class="fgrp"><label>Date / Subtitle</label><input type="text" value="${u.date||''}" oninput="updateUI(${i},'date',this.value)" placeholder="e.g. January 2024"/></div>
      </div>
    </div>`).join('');
}

let _updateItems=[];
function updateUI(i,field,val){ _updateItems[i][field]=val; }
function delUpdateItem(i){ _updateItems.splice(i,1); renderUpdateItems(_updateItems); }
function addUpdateItem(){ _updateItems.push({title:'New Update',date:''}); renderUpdateItems(_updateItems); }

function saveHomePage2(){
  const d={quickCards:_quickCards,updates:_updateItems,updatesTitle:document.getElementById('pe-updatestitle').value.trim()};
  localStorage.setItem('nukala_homepage2',JSON.stringify(d));
  logAct('Home page editor saved'); toast('✅ Home page saved!');
}

// ── CONTACT PAGE EDITOR ──
let _dropdownOpts=[], _contactWays=[];

function loadContactPageEditor(){
  const d=JSON.parse(localStorage.getItem('nukala_contactpage2')||'{}');
  _dropdownOpts=d.dropdownOpts||['Share a family photo','Add a family story or memory','Suggest a correction to the tree','Add a new family member','Request site access for someone','Other'];
  _contactWays=d.contactWays||[
    {icon:'📸',title:'Share a Photo',desc:'Send old or new family photos.'},
    {icon:'📝',title:'Add a Story',desc:'Share a memory or anecdote.'},
    {icon:'🌿',title:'Update the Tree',desc:'Add new family members or corrections.'},
    {icon:'🔑',title:'Request Access',desc:'Need the site password? Let us know.'},
  ];
  renderDropdownOpts(); renderContactWays();
}

function renderDropdownOpts(){
  document.getElementById('dropdownEditor').innerHTML=_dropdownOpts.map((o,i)=>`
    <div class="repeat-item" style="display:flex;align-items:center;gap:10px;">
      <input type="text" value="${o}" oninput="_dropdownOpts[${i}]=this.value" style="flex:1;padding:9px 12px;border:1.5px solid var(--border);border-radius:9px;font-family:Jost,sans-serif;font-size:.84rem;outline:none;"/>
      <button class="del-btn" style="position:static;" onclick="_dropdownOpts.splice(${i},1);renderDropdownOpts()">✕</button>
    </div>`).join('');
}

function addDropdownOption(){ _dropdownOpts.push('New Option'); renderDropdownOpts(); }

function renderContactWays(){
  document.getElementById('contactWaysEditor').innerHTML=_contactWays.map((w,i)=>`
    <div class="repeat-item">
      <button class="del-btn" onclick="_contactWays.splice(${i},1);renderContactWays()">✕</button>
      <div class="frow">
        <div class="fgrp"><label>Icon</label><input type="text" value="${w.icon||''}" oninput="_contactWays[${i}].icon=this.value" placeholder="📸"/></div>
        <div class="fgrp"><label>Title</label><input type="text" value="${w.title||''}" oninput="_contactWays[${i}].title=this.value" placeholder="Share a Photo"/></div>
      </div>
      <div class="fgrp"><label>Description</label><input type="text" value="${w.desc||''}" oninput="_contactWays[${i}].desc=this.value" placeholder="Description..."/></div>
    </div>`).join('');
}

function addContactWay(){ _contactWays.push({icon:'⭐',title:'New Way',desc:'Description'}); renderContactWays(); }

function saveContactPage2(){
  localStorage.setItem('nukala_contactpage2',JSON.stringify({dropdownOpts:_dropdownOpts,contactWays:_contactWays}));
  logAct('Contact page editor saved'); toast('✅ Contact page saved!');
}

// ── GALLERY PAGE EDITOR ──
let _galCats=[];

function loadGalleryPageEditor(){
  const d=JSON.parse(localStorage.getItem('nukala_gallerypage2')||'{}');
  _galCats=d.cats||['family','vintage','celebrations','travel','other'];
  document.getElementById('pe-galtitle').value=d.title||'The Nukala Photo Gallery';
  document.getElementById('pe-galdesc').value=d.desc||'A visual archive of cherished moments, celebrations, and faces across the years.';
  renderGalCats();
}

function renderGalCats(){
  document.getElementById('galCatsEditor').innerHTML=_galCats.map((c,i)=>`
    <div class="repeat-item" style="display:flex;align-items:center;gap:10px;">
      <input type="text" value="${c}" oninput="_galCats[${i}]=this.value" style="flex:1;padding:9px 12px;border:1.5px solid var(--border);border-radius:9px;font-family:Jost,sans-serif;font-size:.84rem;outline:none;" placeholder="Category name"/>
      <button class="del-btn" style="position:static;" onclick="_galCats.splice(${i},1);renderGalCats()">✕</button>
    </div>`).join('');
}

function addGalCat(){ _galCats.push('new category'); renderGalCats(); }

function saveGalleryPage2(){
  localStorage.setItem('nukala_gallerypage2',JSON.stringify({cats:_galCats,title:document.getElementById('pe-galtitle').value.trim(),desc:document.getElementById('pe-galdesc').value.trim()}));
  logAct('Gallery page editor saved'); toast('✅ Gallery page saved!');
}

// ── HERO EDITOR ──
const heroPages=['Family Tree','History','Gallery','Facts','Contact'];

function loadHeroEditor(){
  const d=JSON.parse(localStorage.getItem('nukala_heropage')||'{}');
  document.getElementById('pe-heroimgurl').value=d.homeImgUrl||'';
  document.getElementById('pe-herobg').value=d.homeBg||'#f0f5f0';
  document.getElementById('pe-herobghex').value=d.homeBg||'#f0f5f0';
  document.getElementById('pe-herotextclr').value=d.homeTextClr||'#2c2c2c';
  document.getElementById('pe-herotextclrhex').value=d.homeTextClr||'#2c2c2c';
  document.getElementById('pe-heroopacity').value=d.homeOverlay||0;
  document.getElementById('pe-heroopacityval').textContent=d.homeOverlay||0;
  if(d.homeImgUrl){ document.getElementById('pe-heroimgurl').value=d.homeImgUrl; previewHeroImg(d.homeImgUrl); }

  // Page heroes
  document.getElementById('pageHeroEditor').innerHTML=heroPages.map((p,i)=>{
    const key='page'+i;
    const pd=d[key]||{};
    return `<div class="panel" style="margin-bottom:12px;">
      <div class="panel-title">${p} Page <span></span></div>
      <div class="frow3">
        <div class="fgrp"><label>Eyebrow Text</label><input type="text" id="hero-${i}-eye" value="${pd.eye||''}" placeholder="e.g. Explore"/></div>
        <div class="fgrp"><label>Title</label><input type="text" id="hero-${i}-title" value="${pd.title||''}" placeholder="e.g. The Nukala Family Tree"/></div>
        <div class="fgrp"><label>Description</label><input type="text" id="hero-${i}-desc" value="${pd.desc||''}" placeholder="Short description..."/></div>
      </div>
    </div>`;
  }).join('');
}

function previewHeroImg(url){
  const p=document.getElementById('heroImgPreview'),img=document.getElementById('heroImgPreviewImg');
  if(url){ img.src=url; p.style.display='block'; } else p.style.display='none';
}

function saveHeroSettings(){
  const d={
    homeImgUrl:document.getElementById('pe-heroimgurl').value.trim(),
    homeBg:document.getElementById('pe-herobg').value,
    homeTextClr:document.getElementById('pe-herotextclr').value,
    homeOverlay:document.getElementById('pe-heroopacity').value,
  };
  heroPages.forEach((p,i)=>{
    d['page'+i]={
      eye:document.getElementById(`hero-${i}-eye`).value.trim(),
      title:document.getElementById(`hero-${i}-title`).value.trim(),
      desc:document.getElementById(`hero-${i}-desc`).value.trim(),
    };
  });
  localStorage.setItem('nukala_heropage',JSON.stringify(d));
  logAct('Hero settings saved'); toast('✅ Hero settings saved!');
}

// ── UPDATE showSec to load page editor ──
const _origShowSec = showSec;

// ═══════════════════════════════════════
// EVENTS
// ═══════════════════════════════════════
function renderEvts(){
  const list=loadArr('nukala_events');
  const el=document.getElementById('evtList');
  if(!el) return;
  if(!list.length){ el.innerHTML='<div style="text-align:center;padding:40px;color:var(--tl);">No events yet.</div>'; return; }
  el.innerHTML=list.map((e,i)=>`<div class="tl-item">
    <div class="tl-year" style="min-width:80px;">${new Date(e.date).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}</div>
    <div class="tl-body">
      <div class="tl-title-txt">${e.title}</div>
      ${e.location?`<div class="tl-desc">📍 ${e.location}</div>`:''}
      ${e.desc?`<div class="tl-desc">${e.desc}</div>`:''}
      <div style="margin-top:6px;font-size:.62rem;background:rgba(92,122,92,.1);color:var(--sage-d);padding:2px 8px;border-radius:20px;display:inline-block;">${e.type||'Event'}</div>
      <div class="tl-actions">
        <button class="btn btn-outline btn-sm" onclick="openEditEvt(${i})">✏️</button>
        <button class="btn btn-red btn-sm" onclick="delEvt(${i})">🗑️</button>
      </div>
    </div>
  </div>`).join('');
}
function openEvtModal(){ document.getElementById('evtId').value=''; document.getElementById('evtModalTitle').textContent='Add Event'; ['evtTitle','evtLocation','evtDesc'].forEach(id=>document.getElementById(id).value=''); document.getElementById('evtDate').value=''; document.getElementById('evtType').value='Reunion'; document.getElementById('evtModal').classList.add('open'); }
function openEditEvt(i){ const e=loadArr('nukala_events')[i]; if(!e) return; document.getElementById('evtId').value=i; document.getElementById('evtModalTitle').textContent='Edit Event'; document.getElementById('evtTitle').value=e.title||''; document.getElementById('evtDate').value=e.date||''; document.getElementById('evtType').value=e.type||'Reunion'; document.getElementById('evtLocation').value=e.location||''; document.getElementById('evtDesc').value=e.desc||''; document.getElementById('evtModal').classList.add('open'); }
function closeEvtModal(){ document.getElementById('evtModal').classList.remove('open'); }
function saveEvt(){ const title=document.getElementById('evtTitle').value.trim(); if(!title){ alert('Enter a title.'); return; } const list=loadArr('nukala_events'),idx=document.getElementById('evtId').value; const item={title,date:document.getElementById('evtDate').value,type:document.getElementById('evtType').value,location:document.getElementById('evtLocation').value.trim(),desc:document.getElementById('evtDesc').value.trim()}; if(idx!=='') list[parseInt(idx)]=item; else list.push(item); save('nukala_events',list); closeEvtModal(); renderEvts(); logAct('Event: '+title); toast('✅ Event saved!'); }
function delEvt(i){ if(!confirm('Delete?')) return; const list=loadArr('nukala_events'); list.splice(i,1); save('nukala_events',list); renderEvts(); toast('🗑️ Deleted.'); }

// ═══════════════════════════════════════
// RECIPES
// ═══════════════════════════════════════
function renderRecipes(){ const list=loadArr('nukala_recipes'); const el=document.getElementById('recipeList'); if(!el) return; if(!list.length){ el.innerHTML='<div style="text-align:center;padding:40px;color:var(--tl);">No recipes yet.</div>'; return; } el.innerHTML=list.map((r,i)=>`<div class="tl-item"><div class="tl-year">${r.category||'Recipe'}</div><div class="tl-body"><div class="tl-title-txt">${r.title}</div>${r.by?`<div class="tl-desc">By ${r.by}</div>`:''}<div class="tl-actions"><button class="btn btn-outline btn-sm" onclick="openEditRecipe(${i})">✏️</button><button class="btn btn-red btn-sm" onclick="delRecipe(${i})">🗑️</button></div></div></div>`).join(''); }
function openRecipeModal(){ document.getElementById('recipeId').value=''; document.getElementById('recipeModalTitle').textContent='Add Recipe'; ['recipeTitle','recipeBy','recipeTime','recipeDesc','recipeIngredients','recipeSteps'].forEach(id=>document.getElementById(id).value=''); document.getElementById('recipeModal').classList.add('open'); }
function openEditRecipe(i){ const r=loadArr('nukala_recipes')[i]; if(!r) return; document.getElementById('recipeId').value=i; document.getElementById('recipeModalTitle').textContent='Edit Recipe'; document.getElementById('recipeTitle').value=r.title||''; document.getElementById('recipeCat').value=r.category||'Curry'; document.getElementById('recipeBy').value=r.by||''; document.getElementById('recipeTime').value=r.time||''; document.getElementById('recipeDesc').value=r.desc||''; document.getElementById('recipeIngredients').value=r.ingredients||''; document.getElementById('recipeSteps').value=r.steps||''; document.getElementById('recipeModal').classList.add('open'); }
function closeRecipeModal(){ document.getElementById('recipeModal').classList.remove('open'); }
function saveRecipe(){ const title=document.getElementById('recipeTitle').value.trim(); if(!title){ alert('Enter a name.'); return; } const list=loadArr('nukala_recipes'),idx=document.getElementById('recipeId').value; const item={title,category:document.getElementById('recipeCat').value,by:document.getElementById('recipeBy').value.trim(),time:document.getElementById('recipeTime').value.trim(),desc:document.getElementById('recipeDesc').value.trim(),ingredients:document.getElementById('recipeIngredients').value.trim(),steps:document.getElementById('recipeSteps').value.trim()}; if(idx!=='') list[parseInt(idx)]=item; else list.push(item); save('nukala_recipes',list); closeRecipeModal(); renderRecipes(); logAct('Recipe: '+title); toast('✅ Recipe saved!'); }
function delRecipe(i){ if(!confirm('Delete?')) return; const list=loadArr('nukala_recipes'); list.splice(i,1); save('nukala_recipes',list); renderRecipes(); toast('🗑️ Deleted.'); }

// ═══════════════════════════════════════
// ACHIEVEMENTS
// ═══════════════════════════════════════
function renderAchs(){ const list=loadArr('nukala_achievements'); const el=document.getElementById('achList'); if(!el) return; if(!list.length){ el.innerHTML='<div style="text-align:center;padding:40px;color:var(--tl);">No achievements yet.</div>'; return; } el.innerHTML=list.map((a,i)=>`<div class="tl-item"><div class="tl-year">${a.icon||'🏆'}</div><div class="tl-body"><div class="tl-title-txt">${a.title}</div>${a.person?`<div class="tl-desc">${a.person} ${a.year?'· '+a.year:''}</div>`:''}<div class="tl-actions"><button class="btn btn-outline btn-sm" onclick="openEditAch(${i})">✏️</button><button class="btn btn-red btn-sm" onclick="delAch(${i})">🗑️</button></div></div></div>`).join(''); }
function openAchModal(){ document.getElementById('achId').value=''; document.getElementById('achModalTitle').textContent='Add Achievement'; ['achTitle','achPerson','achYear','achIcon','achDesc'].forEach(id=>document.getElementById(id).value=''); document.getElementById('achCat').value='Education'; document.getElementById('achModal').classList.add('open'); }
function openEditAch(i){ const a=loadArr('nukala_achievements')[i]; if(!a) return; document.getElementById('achId').value=i; document.getElementById('achModalTitle').textContent='Edit Achievement'; document.getElementById('achTitle').value=a.title||''; document.getElementById('achPerson').value=a.person||''; document.getElementById('achYear').value=a.year||''; document.getElementById('achIcon').value=a.icon||''; document.getElementById('achCat').value=a.category||'Education'; document.getElementById('achDesc').value=a.desc||''; document.getElementById('achModal').classList.add('open'); }
function closeAchModal(){ document.getElementById('achModal').classList.remove('open'); }
function saveAch(){ const title=document.getElementById('achTitle').value.trim(); if(!title){ alert('Enter a title.'); return; } const list=loadArr('nukala_achievements'),idx=document.getElementById('achId').value; const item={title,person:document.getElementById('achPerson').value.trim(),year:document.getElementById('achYear').value.trim(),icon:document.getElementById('achIcon').value.trim(),category:document.getElementById('achCat').value,desc:document.getElementById('achDesc').value.trim()}; if(idx!=='') list[parseInt(idx)]=item; else list.push(item); save('nukala_achievements',list); closeAchModal(); renderAchs(); logAct('Achievement: '+title); toast('✅ Saved!'); }
function delAch(i){ if(!confirm('Delete?')) return; const list=loadArr('nukala_achievements'); list.splice(i,1); save('nukala_achievements',list); renderAchs(); toast('🗑️ Deleted.'); }

// ═══════════════════════════════════════
// VIDEOS
// ═══════════════════════════════════════
function renderVideos(){ const list=loadArr('nukala_videos'); const el=document.getElementById('videoList'); if(!el) return; if(!list.length){ el.innerHTML='<div style="text-align:center;padding:40px;color:var(--tl);">No videos yet.</div>'; return; } el.innerHTML=list.map((v,i)=>`<div class="tl-item"><div class="tl-year">🎥</div><div class="tl-body"><div class="tl-title-txt">${v.title}</div>${v.url?`<div class="tl-desc" style="word-break:break-all;">${v.url}</div>`:''}<div class="tl-actions"><button class="btn btn-outline btn-sm" onclick="openEditVideo(${i})">✏️</button><button class="btn btn-red btn-sm" onclick="delVideo(${i})">🗑️</button></div></div></div>`).join(''); }
function openVideoModal(){ document.getElementById('videoId').value=''; document.getElementById('videoModalTitle').textContent='Add Video'; ['videoTitle','videoUrl','videoDesc'].forEach(id=>document.getElementById(id).value=''); document.getElementById('videoModal').classList.add('open'); }
function openEditVideo(i){ const v=loadArr('nukala_videos')[i]; if(!v) return; document.getElementById('videoId').value=i; document.getElementById('videoModalTitle').textContent='Edit Video'; document.getElementById('videoTitle').value=v.title||''; document.getElementById('videoUrl').value=v.url||''; document.getElementById('videoDesc').value=v.desc||''; document.getElementById('videoModal').classList.add('open'); }
function closeVideoModal(){ document.getElementById('videoModal').classList.remove('open'); }
function saveVideo(){ const title=document.getElementById('videoTitle').value.trim(),url=document.getElementById('videoUrl').value.trim(); if(!title||!url){ alert('Enter title and URL.'); return; } const list=loadArr('nukala_videos'),idx=document.getElementById('videoId').value; const item={title,url,desc:document.getElementById('videoDesc').value.trim()}; if(idx!=='') list[parseInt(idx)]=item; else list.push(item); save('nukala_videos',list); closeVideoModal(); renderVideos(); logAct('Video: '+title); toast('✅ Video saved!'); }
function delVideo(i){ if(!confirm('Delete?')) return; const list=loadArr('nukala_videos'); list.splice(i,1); save('nukala_videos',list); renderVideos(); toast('🗑️ Deleted.'); }

// ═══════════════════════════════════════
// POLLS
// ═══════════════════════════════════════
function renderPolls(){ const list=loadArr('nukala_polls'); const el=document.getElementById('pollList'); if(!el) return; if(!list.length){ el.innerHTML='<div style="text-align:center;padding:40px;color:var(--tl);">No polls yet.</div>'; return; } el.innerHTML=list.map((p,i)=>`<div class="tl-item"><div class="tl-year">🗳️</div><div class="tl-body"><div class="tl-title-txt">${p.question}</div><div class="tl-desc">${(p.options||[]).join(' · ')} · ${(p.votes||[]).reduce((a,b)=>a+(b||0),0)} votes</div><div class="tl-actions"><button class="btn btn-red btn-sm" onclick="delPoll(${i})">🗑️ Delete</button><button class="btn btn-outline btn-sm" onclick="resetPoll(${i})">↺ Reset Votes</button></div></div></div>`).join(''); }
function openPollModal(){ document.getElementById('pollId').value=''; document.getElementById('pollModalTitle').textContent='Create Poll'; ['pollQuestion','pollOptions'].forEach(id=>document.getElementById(id).value=''); document.getElementById('pollModal').classList.add('open'); }
function closePollModal(){ document.getElementById('pollModal').classList.remove('open'); }
function savePoll(){ const q=document.getElementById('pollQuestion').value.trim(),opts=document.getElementById('pollOptions').value.trim().split('\n').filter(Boolean); if(!q||opts.length<2){ alert('Enter a question and at least 2 options.'); return; } const list=loadArr('nukala_polls'); list.push({question:q,options:opts,votes:new Array(opts.length).fill(0),active:true}); save('nukala_polls',list); closePollModal(); renderPolls(); logAct('Poll: '+q); toast('✅ Poll created!'); }
function delPoll(i){ if(!confirm('Delete?')) return; const list=loadArr('nukala_polls'); list.splice(i,1); save('nukala_polls',list); renderPolls(); toast('🗑️ Deleted.'); }
function resetPoll(i){ if(!confirm('Reset all votes for this poll?')) return; const list=loadArr('nukala_polls'); list[i].votes=new Array(list[i].options.length).fill(0); save('nukala_polls',list); const votes=JSON.parse(localStorage.getItem('nukala_votes')||'{}'); delete votes[i]; localStorage.setItem('nukala_votes',JSON.stringify(votes)); renderPolls(); toast('↺ Votes reset!'); }

// Update showSec to handle new sections
const _origShowSecEvts=showSec;

// ═══════════════════════════════════════
// NEW PAGES EDITOR
// ═══════════════════════════════════════
const NP_KEY = 'nukala_newpages';
const NP_PAGES = ['events','recipes','ach','videos','polls','stats','map','facts','history','gallery','contact','tree','login'];

function loadNewPages(){
  const d = JSON.parse(localStorage.getItem(NP_KEY)||'{}');
  NP_PAGES.forEach(p=>{
    const pd = d[p]||{};
    ['eye','title','em','desc','quote','heading','para','splash','sub','label','btn','note','contact'].forEach(f=>{
      const el = document.getElementById(`np-${p}-${f}`);
      if(el && pd[f] !== undefined) el.value = pd[f];
    });
  });
}

function saveNewPages(){
  const d = {};
  NP_PAGES.forEach(p=>{
    d[p] = {};
    ['eye','title','em','desc','quote','heading','para','splash','sub','label','btn','note','contact'].forEach(f=>{
      const el = document.getElementById(`np-${p}-${f}`);
      if(el) d[p][f] = el.value.trim();
    });
  });
  localStorage.setItem(NP_KEY, JSON.stringify(d));
  logAct('New pages content saved');
  toast('✅ All page content saved!');
}

// ═══════════════════════════════════════
// NAV MENU EDITOR
// ═══════════════════════════════════════
const NAV_KEY = 'nukala_navmenu';
let _navItems = [];

function loadNavMenu(){
  const d = JSON.parse(localStorage.getItem(NAV_KEY)||'null') || {
    items:[
      {label:'Home',href:'home.html',active:true},
      {label:'Family Tree',href:'tree.html',active:true},
      {label:'History',href:'history.html',active:true},
      {label:'Gallery',href:'gallery.html',active:true},
      {label:'Facts',href:'facts.html',active:true},
      {label:'Stats',href:'stats.html',active:true},
      {label:'Events',href:'events.html',active:true},
      {label:'Map',href:'map.html',active:false},
      {label:'Polls',href:'polls.html',active:false},
      {label:'Recipes',href:'recipes.html',active:false},
      {label:'Achievements',href:'achievements.html',active:false},
      {label:'Videos',href:'videos.html',active:false},
      {label:'Share',href:'qr.html',active:true},
      {label:'Contact',href:'contact.html',active:true},
    ],
    showSearch:true, showDark:true, showLang:true
  };
  _navItems = d.items||[];
  document.getElementById('pe-showsearch').checked = d.showSearch !== false;
  document.getElementById('pe-showdark').checked = d.showDark !== false;
  document.getElementById('pe-showlang').checked = d.showLang !== false;
  renderNavItems();
}

function renderNavItems(){
  document.getElementById('navItemsEditor').innerHTML = _navItems.map((item,i)=>`
    <div class="repeat-item" style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">
      <label class="cbitem" style="margin:0;"><input type="checkbox" ${item.active?'checked':''} onchange="_navItems[${i}].active=this.checked" style="accent-color:var(--sage-d);width:15px;height:15px;"/></label>
      <input type="text" value="${item.label}" oninput="_navItems[${i}].label=this.value" style="flex:1;padding:8px 11px;border:1.5px solid var(--border);border-radius:9px;font-family:'Jost',sans-serif;font-size:.82rem;outline:none;" placeholder="Label"/>
      <input type="text" value="${item.href}" oninput="_navItems[${i}].href=this.value" style="flex:1;padding:8px 11px;border:1.5px solid var(--border);border-radius:9px;font-family:'Jost',sans-serif;font-size:.82rem;outline:none;color:var(--tl);" placeholder="page.html"/>
      <button class="del-btn" style="position:static;" onclick="_navItems.splice(${i},1);renderNavItems()">✕</button>
    </div>`).join('');
}

function addNavItem(){
  _navItems.push({label:'New Page',href:'home.html',active:false});
  renderNavItems();
}

function saveNavMenu(){
  const d = {
    items: _navItems,
    showSearch: document.getElementById('pe-showsearch').checked,
    showDark: document.getElementById('pe-showdark').checked,
    showLang: document.getElementById('pe-showlang').checked,
  };
  localStorage.setItem(NAV_KEY, JSON.stringify(d));
  logAct('Nav menu saved');
  toast('✅ Nav menu saved! Refresh site to see changes.');
}

// ═══════════════════════════════════════
// TYPOGRAPHY EDITOR
// ═══════════════════════════════════════
const TYPO_KEY = 'nukala_typography';

function loadTypography(){
  const d = JSON.parse(localStorage.getItem(TYPO_KEY)||'{}');
  if(d.heroSize) document.getElementById('typo-hero').value = d.heroSize;
  if(d.navSize) document.getElementById('typo-nav').value = d.navSize;
  if(d.bodySize) document.getElementById('typo-body').value = d.bodySize;
  if(d.radius) document.getElementById('typo-radius').value = d.radius;
  if(d.maxWidth) document.getElementById('typo-maxwidth').value = d.maxWidth;
  if(d.headingLS) document.getElementById('typo-heading-ls').value = d.headingLS;
  if(d.navLS) document.getElementById('typo-nav-ls').value = d.navLS;
  if(d.btnRadius) document.getElementById('typo-btnstyle').value = d.btnRadius;
}

function saveTypography(){
  const d = {
    heroSize: document.getElementById('typo-hero').value,
    navSize: document.getElementById('typo-nav').value,
    bodySize: document.getElementById('typo-body').value,
    radius: document.getElementById('typo-radius').value,
    maxWidth: document.getElementById('typo-maxwidth').value,
    headingLS: document.getElementById('typo-heading-ls').value,
    navLS: document.getElementById('typo-nav-ls').value,
    btnRadius: document.getElementById('typo-btnstyle').value,
  };
  localStorage.setItem(TYPO_KEY, JSON.stringify(d));
  logAct('Typography saved');
  toast('✅ Typography saved! Refresh site to see changes.');
}

// ═══════════════════════════════════════
// NEW PAGES EDITOR
// ═══════════════════════════════════════
function loadNewPagesForm(){
  const d=JSON.parse(localStorage.getItem('nukala_newpages')||'{}');
  const fields={
    'pe-evt-eye':'evtEye','pe-evt-title':'evtTitle','pe-evt-desc':'evtDesc',
    'pe-evt-bdaytitle':'evtBdayTitle','pe-evt-empty':'evtEmpty',
    'pe-rec-eye':'recEye','pe-rec-title':'recTitle','pe-rec-desc':'recDesc','pe-rec-empty':'recEmpty',
    'pe-ach-eye':'achEye','pe-ach-title':'achTitle','pe-ach-desc':'achDesc','pe-ach-empty':'achEmpty',
    'pe-vid-eye':'vidEye','pe-vid-title':'vidTitle','pe-vid-desc':'vidDesc','pe-vid-empty':'vidEmpty',
    'pe-pol-eye':'polEye','pe-pol-title':'polTitle','pe-pol-desc':'polDesc','pe-pol-empty':'polEmpty',
    'pe-sta-eye':'staEye','pe-sta-title':'staTitle','pe-sta-desc':'staDesc',
    'pe-map-eye':'mapEye','pe-map-title':'mapTitle','pe-map-desc':'mapDesc','pe-map-listtitle':'mapListTitle',
    'pe-qr-eye':'qrEye','pe-qr-title':'qrTitle','pe-qr-desc':'qrDesc','pe-qr-instructions':'qrInstructions',
    'pe-fct-eye':'fctEye','pe-fct-title':'fctTitle','pe-fct-desc':'fctDesc',
    'pe-his-eye':'hisEye','pe-his-title':'hisTitle','pe-his-desc':'hisDesc',
    'pe-his-quote':'hisQuote','pe-his-btntext':'hisBtnText',
    'pe-gal-eye':'galEye','pe-gal-title2':'galTitle2','pe-gal-desc2':'galDesc2','pe-gal-hint':'galHint',
    'pe-con-eye':'conEye','pe-con-title':'conTitle','pe-con-desc':'conDesc',
    'pe-con-heading':'conHeading','pe-con-para':'conPara',
    'pe-con-formtitle':'conFormTitle','pe-con-privacy':'conPrivacy',
  };
  Object.entries(fields).forEach(([elId,key])=>{
    const el=document.getElementById(elId);
    if(el&&d[key]) el.value=d[key];
  });
}

function saveNewPages(){
  const fields={
    'pe-evt-eye':'evtEye','pe-evt-title':'evtTitle','pe-evt-desc':'evtDesc',
    'pe-evt-bdaytitle':'evtBdayTitle','pe-evt-empty':'evtEmpty',
    'pe-rec-eye':'recEye','pe-rec-title':'recTitle','pe-rec-desc':'recDesc','pe-rec-empty':'recEmpty',
    'pe-ach-eye':'achEye','pe-ach-title':'achTitle','pe-ach-desc':'achDesc','pe-ach-empty':'achEmpty',
    'pe-vid-eye':'vidEye','pe-vid-title':'vidTitle','pe-vid-desc':'vidDesc','pe-vid-empty':'vidEmpty',
    'pe-pol-eye':'polEye','pe-pol-title':'polTitle','pe-pol-desc':'polDesc','pe-pol-empty':'polEmpty',
    'pe-sta-eye':'staEye','pe-sta-title':'staTitle','pe-sta-desc':'staDesc',
    'pe-map-eye':'mapEye','pe-map-title':'mapTitle','pe-map-desc':'mapDesc','pe-map-listtitle':'mapListTitle',
    'pe-qr-eye':'qrEye','pe-qr-title':'qrTitle','pe-qr-desc':'qrDesc','pe-qr-instructions':'qrInstructions',
    'pe-fct-eye':'fctEye','pe-fct-title':'fctTitle','pe-fct-desc':'fctDesc',
    'pe-his-eye':'hisEye','pe-his-title':'hisTitle','pe-his-desc':'hisDesc',
    'pe-his-quote':'hisQuote','pe-his-btntext':'hisBtnText',
    'pe-gal-eye':'galEye','pe-gal-title2':'galTitle2','pe-gal-desc2':'galDesc2','pe-gal-hint':'galHint',
    'pe-con-eye':'conEye','pe-con-title':'conTitle','pe-con-desc':'conDesc',
    'pe-con-heading':'conHeading','pe-con-para':'conPara',
    'pe-con-formtitle':'conFormTitle','pe-con-privacy':'conPrivacy',
  };
  const d={};
  Object.entries(fields).forEach(([elId,key])=>{
    const el=document.getElementById(elId);
    if(el) d[key]=el.value.trim();
  });
  localStorage.setItem('nukala_newpages',JSON.stringify(d));
  logAct('New pages editor saved');
  toast('✅ All new page settings saved!');
}

// ═══════════════════════════════════════
// ANALYTICS
// ═══════════════════════════════════════
const PAGE_NAMES = {
  'home.html':'Home','tree.html':'Family Tree','gallery.html':'Gallery',
  'history.html':'History','facts.html':'Facts','stats.html':'Stats',
  'events.html':'Events','contact.html':'Contact','index.html':'Login',
  'qr.html':'Share/QR','map.html':'Map','polls.html':'Polls',
  'recipes.html':'Recipes','achievements.html':'Achievements','videos.html':'Videos'
};
const PAGE_EMOJI = {
  'home.html':'🏠','tree.html':'🌳','gallery.html':'🖼️','history.html':'📜',
  'facts.html':'🌟','stats.html':'📊','events.html':'📆','contact.html':'✉️',
  'index.html':'🔐','qr.html':'📱','map.html':'🗺️','polls.html':'🗳️',
  'recipes.html':'🍛','achievements.html':'🏆','videos.html':'🎥'
};

function renderAnalytics(){
  const visits   = JSON.parse(localStorage.getItem('nukala_visits')||'[]');
  const logins   = JSON.parse(localStorage.getItem('nukala_logins')||'[]');
  const sessions = JSON.parse(localStorage.getItem('nukala_sessions')||'[]');
  const counts   = JSON.parse(localStorage.getItem('nukala_page_counts')||'{}');
  const visitors = JSON.parse(localStorage.getItem('nukala_visitors')||'[]');
  const totalLogins = parseInt(localStorage.getItem('nukala_login_count')||'0');

  // Summary
  const today = new Date().toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'});
  const todayViews = visits.filter(v=>v.date===today).length;
  document.getElementById('an-logins').textContent  = totalLogins||logins.length;
  document.getElementById('an-visits').textContent  = visits.length;
  document.getElementById('an-sessions').textContent= sessions.length;
  document.getElementById('an-unique').textContent  = visitors.length;
  document.getElementById('an-today').textContent   = todayViews;

  // Unique visitors table
  const tbody = document.getElementById('an-visitorsBody');
  if(!visitors.length){
    tbody.innerHTML='<tr><td colspan="9" style="padding:24px;text-align:center;color:var(--tl);">No visitors tracked yet.<br/><small>Data appears as family members visit the site. IP fetch may take ~1 second per visit.</small></td></tr>';
  } else {
    tbody.innerHTML = [...visitors].reverse().map(v=>`
      <tr style="border-bottom:1px solid var(--border);">
        <td style="padding:9px 10px;font-size:.75rem;font-family:monospace;color:var(--td);">${v.ip}</td>
        <td style="padding:9px 10px;font-size:.75rem;color:var(--td);">${v.city?v.city+', ':''}${v.country}</td>
        <td style="padding:9px 10px;font-size:.72rem;color:var(--tm);">${v.isp||'–'}</td>
        <td style="padding:9px 10px;font-size:.75rem;color:var(--td);">${v.device||'–'}</td>
        <td style="padding:9px 10px;font-size:.75rem;color:var(--td);">${v.browser||'–'}</td>
        <td style="padding:9px 10px;font-size:.75rem;font-weight:600;color:var(--sage-d);">${v.visits||1}</td>
        <td style="padding:9px 10px;font-size:.72rem;color:var(--tm);">${(v.pages||[]).map(p=>PAGE_NAMES[p]||p).join(', ')}</td>
        <td style="padding:9px 10px;font-size:.72rem;color:var(--tl);">${v.firstSeen||'–'}</td>
        <td style="padding:9px 10px;font-size:.72rem;color:var(--tl);">${v.lastSeen||'–'}</td>
      </tr>`).join('');
  }

  // Top pages
  const sorted = Object.entries(counts).sort((a,b)=>b[1]-a[1]).slice(0,8);
  const maxC = sorted[0]?.[1]||1;
  const topEl = document.getElementById('an-topPages');
  topEl.innerHTML = !sorted.length
    ? '<div style="color:var(--tl);font-size:.8rem;padding:16px 0;">No data yet.</div>'
    : sorted.map(([page,count])=>`
        <div style="margin-bottom:10px;">
          <div style="display:flex;justify-content:space-between;font-size:.76rem;color:var(--tm);margin-bottom:3px;">
            <span>${PAGE_EMOJI[page]||'📄'} ${PAGE_NAMES[page]||page}</span>
            <span style="font-weight:600;color:var(--sage-d);">${count}</span>
          </div>
          <div style="background:var(--sage-l);border-radius:20px;height:8px;">
            <div style="background:linear-gradient(to right,var(--sage-d),var(--sage));border-radius:20px;height:100%;width:${Math.round((count/maxC)*100)}%;"></div>
          </div>
        </div>`).join('');

  // Recent logins
  const loginEl = document.getElementById('an-recentLogins');
  loginEl.innerHTML = !logins.length
    ? '<div style="color:var(--tl);font-size:.8rem;padding:16px 0;">No logins yet.</div>'
    : [...logins].reverse().slice(0,8).map((l,i)=>`
        <div style="display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid var(--border);">
          <div style="width:28px;height:28px;border-radius:50%;background:linear-gradient(135deg,var(--sage-l),var(--gold-l));display:flex;align-items:center;justify-content:center;font-size:12px;flex-shrink:0;">🔐</div>
          <div style="flex:1;">
            <div style="font-size:.78rem;font-weight:500;color:var(--td);">Login #${logins.length-i}</div>
            <div style="font-size:.7rem;color:var(--tl);">${l.date} at ${l.time}</div>
          </div>
        </div>`).join('');

  // Visit log
  const filter = document.getElementById('an-filter')?.value||'all';
  const filtered = filter==='all' ? visits : visits.filter(v=>v.page===filter);
  const logEl = document.getElementById('an-visitLog');
  logEl.innerHTML = !filtered.length
    ? '<div style="color:var(--tl);font-size:.8rem;padding:20px;text-align:center;">No visits recorded yet.</div>'
    : [...filtered].reverse().slice(0,200).map(v=>`
        <div style="display:grid;grid-template-columns:28px 1fr auto;align-items:center;gap:10px;padding:9px 0;border-bottom:1px solid var(--border);font-size:.76rem;">
          <span style="font-size:15px;">${PAGE_EMOJI[v.page]||'📄'}</span>
          <div>
            <div style="font-weight:500;color:var(--td);">${PAGE_NAMES[v.page]||v.page}</div>
            <div style="color:var(--tl);font-size:.7rem;">
              ${v.ip&&v.ip!=='Fetching...'?`🌐 ${v.ip}`:''} 
              ${v.city?`📍 ${v.city}, ${v.country}`:''}
              ${v.device?`· ${v.device}`:''}
              ${v.browser?`· ${v.browser}`:''}
            </div>
          </div>
          <div style="color:var(--tl);white-space:nowrap;font-size:.7rem;">${v.date}<br/>${v.time}</div>
        </div>`).join('');
}

function exportAnalytics(){
  const visits=JSON.parse(localStorage.getItem('nukala_visits')||'[]');
  const rows=[['Page','Date','Time','IP','Country','City','ISP','Device','Browser','Screen','Timezone'],
    ...visits.map(v=>[v.page,v.date,v.time,v.ip||'',v.country||'',v.city||'',v.isp||'',v.device||'',v.browser||'',v.screen||'',v.timezone||''])];
  const csv=rows.map(r=>r.map(c=>`"${String(c).replace(/"/g,'""')}"`).join(',')).join('\n');
  const blob=new Blob([csv],{type:'text/csv'});
  const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='nukala-analytics.csv'; a.click();
  toast('📥 Analytics exported!');
}

function exportVisitors(){
  const visitors=JSON.parse(localStorage.getItem('nukala_visitors')||'[]');
  const rows=[['IP','Country','City','ISP','Device','Browser','Visits','Pages','First Seen','Last Seen'],
    ...visitors.map(v=>[v.ip,v.country,v.city,v.isp,v.device,v.browser,v.visits,(v.pages||[]).join(' | '),v.firstSeen,v.lastSeen])];
  const csv=rows.map(r=>r.map(c=>`"${String(c||'').replace(/"/g,'""')}"`).join(',')).join('\n');
  const blob=new Blob([csv],{type:'text/csv'});
  const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='nukala-visitors.csv'; a.click();
  toast('📥 Visitors exported!');
}

// ═══════════════════════════════════════
// PAGE VISIBILITY
// ═══════════════════════════════════════
const ALL_PAGES = [
  { id:'home',          label:'🏠 Home',            file:'home.html',         locked:true  },
  { id:'tree',          label:'🌳 Family Tree',      file:'tree.html',         locked:true  },
  { id:'history',       label:'📜 History',          file:'history.html',      locked:false },
  { id:'gallery',       label:'🖼️ Gallery',          file:'gallery.html',      locked:false },
  { id:'facts',         label:'🌟 Facts',            file:'facts.html',        locked:false },
  { id:'stats',         label:'📊 Stats',            file:'stats.html',        locked:false },
  { id:'events',        label:'📆 Events',           file:'events.html',       locked:false },
  { id:'map',           label:'🗺️ Map',              file:'map.html',          locked:false },
  { id:'polls',         label:'🗳️ Polls',            file:'polls.html',        locked:false },
  { id:'recipes',       label:'🍛 Recipes',          file:'recipes.html',      locked:false },
  { id:'achievements',  label:'🏆 Achievements',     file:'achievements.html', locked:false },
  { id:'videos',        label:'🎥 Videos',           file:'videos.html',       locked:false },
  { id:'qr',            label:'📱 Share/QR',         file:'qr.html',           locked:false },
  { id:'contact',       label:'✉️ Contact',          file:'contact.html',      locked:true  },
];

function getPageVis(){
  const saved = JSON.parse(localStorage.getItem('nukala_page_vis')||'{}');
  const result = {};
  ALL_PAGES.forEach(p=>{ result[p.id] = saved[p.id]!==undefined ? saved[p.id] : true; });
  return result;
}

function renderPageVis(){
  const vis = getPageVis();
  const list = document.getElementById('pageVisList');
  if(!list) return;

  const rows = ALL_PAGES.map(function(p){
    const isOn = vis[p.id] !== false;
    const trackBg = isOn ? '#5c7a5c' : '#cccccc';
    const thumbX  = isOn ? 'translateX(20px)' : 'translateX(0)';
    const badgeBg = isOn ? '#f0f5f0' : '#faf0f0';
    const badgeClr= isOn ? '#5c7a5c' : '#c0614a';
    const badgeTxt= isOn ? 'Enabled' : 'Disabled';
    const coreNote= p.locked ? ' &nbsp;&middot;&nbsp; <span style="color:#5c7a5c;">Core page</span>' : '';
    return '<div style="display:flex;align-items:center;justify-content:space-between;padding:14px 0;border-bottom:1px solid var(--border);">'
      + '<div style="display:flex;align-items:center;gap:14px;">'
      + '<div style="position:relative;width:46px;height:26px;flex-shrink:0;">'
      + '<input type="checkbox" id="vis-' + p.id + '"'
      + (isOn ? ' checked' : '')
      + (p.locked ? ' disabled' : '')
      + ' onchange="onVisChange('' + p.id + '',this.checked)"'
      + ' style="position:absolute;inset:0;opacity:0;width:100%;height:100%;cursor:' + (p.locked?'not-allowed':'pointer') + ';z-index:2;margin:0;"/>'
      + '<div id="vis-track-' + p.id + '" style="position:absolute;inset:0;border-radius:26px;background:' + trackBg + ';transition:background .25s;pointer-events:none;"></div>'
      + '<div id="vis-thumb-' + p.id + '" style="position:absolute;top:3px;left:3px;width:20px;height:20px;border-radius:50%;background:white;box-shadow:0 1px 4px rgba(0,0,0,.2);transition:transform .25s;transform:' + thumbX + ';pointer-events:none;"></div>'
      + '</div>'
      + '<div>'
      + '<div style="font-size:.88rem;font-weight:500;color:var(--td);">' + p.label + '</div>'
      + '<div style="font-size:.7rem;color:var(--tl);">' + p.file + coreNote + '</div>'
      + '</div></div>'
      + '<span id="vis-badge-' + p.id + '" style="font-size:.7rem;font-weight:600;padding:3px 12px;border-radius:20px;background:' + badgeBg + ';color:' + badgeClr + ';">' + badgeTxt + '</span>'
      + '</div>';
  });
  list.innerHTML = rows.join('');
  updateVisPreview();
}

function onVisChange(id, on){
  var track = document.getElementById('vis-track-'+id);
  var thumb = document.getElementById('vis-thumb-'+id);
  var badge = document.getElementById('vis-badge-'+id);
  if(track) track.style.background = on ? '#5c7a5c' : '#cccccc';
  if(thumb) thumb.style.transform  = on ? 'translateX(20px)' : 'translateX(0)';
  if(badge){
    badge.textContent   = on ? 'Enabled' : 'Disabled';
    badge.style.background = on ? '#f0f5f0' : '#faf0f0';
    badge.style.color      = on ? '#5c7a5c' : '#c0614a';
  }
  updateVisPreview();
}

function updateVisPreview(){
  var preview = document.getElementById('pageVisPreview');
  if(!preview) return;
  var chips = ALL_PAGES.map(function(p){
    var cb = document.getElementById('vis-'+p.id);
    var on = cb ? cb.checked : true;
    var style = on
      ? 'padding:5px 12px;border-radius:20px;font-size:.74rem;font-weight:500;background:#c8ddc8;color:#5c7a5c;display:inline-block;margin:3px;'
      : 'padding:5px 12px;border-radius:20px;font-size:.74rem;font-weight:500;background:#f0f0f0;color:#aaa;text-decoration:line-through;display:inline-block;margin:3px;';
    return '<span style="' + style + '">' + p.label + '</span>';
  });
  preview.innerHTML = chips.join('');
}

function savePageVis(){
  var vis = {};
  ALL_PAGES.forEach(function(p){
    var cb = document.getElementById('vis-'+p.id);
    vis[p.id] = p.locked ? true : (cb ? cb.checked : true);
  });
  localStorage.setItem('nukala_page_vis', JSON.stringify(vis));
  logAct('Page visibility updated');
  toast('✅ Page visibility saved! Nav will update on the website.');
}

function enableAllPages(){
  ALL_PAGES.forEach(function(p){
    var cb = document.getElementById('vis-'+p.id);
    if(cb && !p.locked){
      cb.checked = true;
      onVisChange(p.id, true);
    }
  });
  toast('✅ All pages enabled!');
}

// ═══════════════════════════════════════
// NEW PAGE EDITORS
// ═══════════════════════════════════════

// All new page IDs and their field keys
const NEW_PAGE_FIELDS = {
  statspage:        ['eyebrow','title','desc','s1','s2'],
  eventspage:       ['eyebrow','title','desc','s1','s2','btn'],
  recipespage:      ['eyebrow','title','desc','btn','empty'],
  achievementspage: ['eyebrow','title','desc','btn','empty'],
  videospage:       ['eyebrow','title','desc','btn','empty'],
  pollspage:        ['eyebrow','title','desc','btn','empty','vote'],
  mappage:          ['eyebrow','title','desc','notice','s1'],
  qrpage:           ['eyebrow','title','desc','desc2','dl','copy','wa'],
};

function loadNewPage(secId){
  const saved = JSON.parse(localStorage.getItem('nukala_page_'+secId)||'{}');
  const fields = NEW_PAGE_FIELDS[secId]||[];
  fields.forEach(f=>{
    const el = document.getElementById('pe-'+secId+'-'+f);
    if(el && saved[f]) el.value = saved[f];
  });
}

function saveNewPage(secId){
  const fields = NEW_PAGE_FIELDS[secId]||[];
  const data = {};
  fields.forEach(f=>{
    const el = document.getElementById('pe-'+secId+'-'+f);
    if(el) data[f] = el.value.trim();
  });
  localStorage.setItem('nukala_page_'+secId, JSON.stringify(data));
  logAct('Page edited: '+secId);
  toast('✅ '+ secId.replace('page','') +' page saved!');
}

// Hook into showPeTab to load data when tab opened
const _origShowPeTab = showPeTab;
function showPeTab(id, el){
  document.querySelectorAll('.pe-section').forEach(s=>s.classList.remove('active'));
  document.querySelectorAll('.pe-tab').forEach(t=>t.classList.remove('active'));
  const sec = document.getElementById('pe-'+id);
  if(sec) sec.classList.add('active');
  if(el) el.classList.add('active');
  // Load data for standard tabs
  if(id==='theme') loadThemeForm();
  if(id==='sitewide') loadSiteWideForm();
  if(id==='homepage') loadHomePageEditor();
  if(id==='contactpage') loadContactPageEditor();
  if(id==='gallerypage') loadGalleryPageEditor();
  if(id==='heropage') loadHeroEditor();
  // Load data for new page tabs
  if(NEW_PAGE_FIELDS[id]) loadNewPage(id);
}

// ═══════════════════════════════════════
// TOAST
// ═══════════════════════════════════════
function toast(msg){ const t=document.createElement('div'); t.className='toast'; t.textContent=msg; document.body.appendChild(t); setTimeout(()=>t.remove(),3000); }
