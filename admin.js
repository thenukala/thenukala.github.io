
// admin.js v3962 — Nukala Family CMS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// DATA HELPERS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// Global error trap - shows any JS error on screen after login
window.addEventListener('error', function(e){
  var banner = document.getElementById('jsErrorBanner');
  if(!banner){
    banner = document.createElement('div');
    banner.id = 'jsErrorBanner';
    banner.style.cssText = 'position:fixed;top:0;left:0;right:0;z-index:9999;background:#c0614a;color:white;padding:12px 20px;font-size:.8rem;font-family:monospace;';
    document.body.appendChild(banner);
  }
  banner.textContent = '❌ JS Error: ' + e.message + ' (line ' + e.lineno + ')';
});

var LS = {members:'nukala_tree_data',gallery:'nukala_gallery',history:'nukala_history',facts:'nukala_facts',events:'nukala_events',recipes:'nukala_recipes',videos:'nukala_videos',polls:'nukala_polls',contacts:'nukala_contacts',settings:'nukala_settings',log:'nukala_log',pagevis:'nukala_page_vis',visits:'nukala_visits',visitors:'nukala_visitors',logins:'nukala_logins',sessions:'nukala_sessions',pagecounts:'nukala_page_counts',annLog:'nukala_ann_log'};
function ld(k){try{return JSON.parse(localStorage.getItem(LS[k]||k)||'{}');}catch(e){return {};}}
function lda(k){try{return JSON.parse(localStorage.getItem(LS[k]||k)||'[]');}catch(e){return [];}}
function sv(k,v){localStorage.setItem(LS[k]||k,JSON.stringify(v));}
function svRaw(k,v){localStorage.setItem(k,JSON.stringify(v));}
function ldRaw(k){try{return JSON.parse(localStorage.getItem(k)||'null');}catch(e){return null;}}
function log(m){var l=lda('log');l.push(m);if(l.length>50)l=l.slice(-50);sv('log',l);}
function toast(m){var t=document.createElement('div');t.className='toast';t.textContent=m;document.body.appendChild(t);setTimeout(function(){t.remove();},3000);}
function openM(id){document.getElementById(id).classList.add('open');}
function closeM(id){document.getElementById(id).classList.remove('open');}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// AUTH
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function getAdminPass(){return localStorage.getItem('nukala_admin_pass')||'nukala_admin_2024';}

function doLogin(){
  var pw = document.getElementById('pwInput').value;
  if(pw === getAdminPass()){
    sessionStorage.setItem('nukala_admin','true');
    localStorage.setItem('nukala_admin_active','true');
    showAdmin();
  } else {
    var err = document.getElementById('errMsg');
    err.textContent = 'Incorrect password. Please try again.';
    err.style.display = 'block';
    document.getElementById('pwInput').value = '';
    document.getElementById('pwInput').focus();
  }
}

function showAdmin(){
  document.getElementById('loginPage').style.display='none';
  document.getElementById('adminPage').style.display='block';
  initAdmin();
}

function initAdmin(){
  var s=ld('settings');
  if(s&&s.familyName){
    var sn=document.getElementById('siteName');
    if(sn) sn.textContent=s.familyName;
  }
  // Re-wire nav in case it wasn't registered at load time
  document.querySelectorAll('.ni[data-page]').forEach(function(btn){
    btn.onclick = function(){
      var pg = this.getAttribute('data-page');
      document.querySelectorAll('.ni').forEach(function(n){n.classList.remove('on');});
      this.classList.add('on');
      document.querySelectorAll('.page').forEach(function(p){p.classList.remove('on');});
      var el=document.getElementById('page-'+pg);
      if(el) el.classList.add('on');
      if(PAGE_LOADERS[pg]) PAGE_LOADERS[pg]();
    };
  });
  // Modal close buttons
  document.querySelectorAll('[data-close]').forEach(function(btn){
    btn.onclick = function(){closeM(this.getAttribute('data-close'));};
  });
  // Tab buttons
  document.querySelectorAll('.ptb[data-tab]').forEach(function(btn){
    btn.onclick = function(){
      var tab=this.getAttribute('data-tab');
      document.querySelectorAll('.ptb').forEach(function(b){b.classList.remove('on');});
      this.classList.add('on');
      document.querySelectorAll('.pt-panel').forEach(function(p){p.classList.remove('on');});
      var tp=document.getElementById('pt-'+tab);
      if(tp) tp.classList.add('on');
      if(tab==='tree') loadTreeColours();
    };
  });
  renderDash();
}

// Wire up login
document.getElementById('loginBtn').addEventListener('click', doLogin);
document.getElementById('pwInput').addEventListener('keydown', function(e){if(e.key==='Enter')doLogin();});
document.getElementById('pwInput').focus();

// No auto-restore — password required on every admin.html load
// If inline login already fired before admin.js loaded, init now
if(typeof _adminLoggedIn !== 'undefined' && _adminLoggedIn){
  var _warn = document.getElementById('jsLoadWarn');
  if(_warn) _warn.remove();
  initAdmin();
}

// Dark mode
(function(){
  var dm = localStorage.getItem('nukala_admin_dark')==='1';
  if(dm){ document.documentElement.setAttribute('data-theme','dark'); }
  document.addEventListener('DOMContentLoaded',function(){
    var btn=document.getElementById('dmBtn');
    if(btn){
      btn.textContent = dm?'☀️':'🌙';
      btn.addEventListener('click',function(){
        dm = !dm;
        localStorage.setItem('nukala_admin_dark', dm?'1':'0');
        document.documentElement.setAttribute('data-theme', dm?'dark':'light');
        this.textContent = dm?'☀️':'🌙';
      });
    }
  });
})();

// Wire up logout
document.getElementById('logoutBtn').addEventListener('click',function(){sessionStorage.removeItem('nukala_admin');localStorage.removeItem('nukala_admin_active');window.location.href='home.html';});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// NAVIGATION
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
var PAGE_LOADERS = {
  dash:renderDash, members:renderMembers, history:renderHist,
  gallery:renderGal, facts:renderFacts, events:renderEvts,
  recipes:renderRecs, polls:renderPolls,
  stats:loadStatsAdmin, map:function(){},  qr:function(){},  join:function(){}, about:renderAbout,
  contacts:renderContacts, announce:renderAnn,
  pagevis:renderVis, pagenames:renderPageNames, editor:function(){loadPeTab('theme'); if(document.querySelector('.ptb[data-tab="tree"]')) loadTreeColours();}, loginpage:loadLoginPageEditor, analytics:renderAnalytics, settings:loadSettings
};

document.querySelectorAll('.ni[data-page]').forEach(function(btn){
  btn.addEventListener('click', function(){
    var pg = this.getAttribute('data-page');
    document.querySelectorAll('.ni').forEach(function(n){n.classList.remove('on');});
    this.classList.add('on');
    document.querySelectorAll('.page').forEach(function(p){p.classList.remove('on');});
    var el = document.getElementById('page-'+pg);
    if(el) el.classList.add('on');
    if(PAGE_LOADERS[pg]) PAGE_LOADERS[pg]();
  });
});

// Modal close buttons (data-close)
document.querySelectorAll('[data-close]').forEach(function(btn){
  btn.addEventListener('click', function(){closeM(this.getAttribute('data-close'));});
});

// Sidebar action buttons
document.getElementById('expBtn').addEventListener('click', expAll);
document.getElementById('impBtn').addEventListener('click', function(){openM('importModal');});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// DASHBOARD
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function renderDash(){
  var m=Object.values(ld('members'));
  var g=lda('gallery'),h=lda('history'),f=lda('facts');
  var gens=[...new Set(m.map(function(x){return x.gen;}).filter(Boolean))];
  document.getElementById('ds-m').textContent=m.length;
  document.getElementById('ds-g').textContent=g.length;
  document.getElementById('ds-h').textContent=h.length;
  document.getElementById('ds-f').textContent=f.length;
  document.getElementById('ds-gens').textContent=gens.length;
  var logs=lda('log');
  document.getElementById('ds-log').innerHTML=logs.length?logs.slice(-6).reverse().map(function(l){return '<div style="padding:4px 0;border-bottom:1px solid var(--b);color:var(--tm);">'+l+'</div>';}).join(''):'<span style="color:var(--tl);">No activity yet.</span>';
  // Also render today's occasions and wishes
  if(typeof renderDashWishes === 'function') renderDashWishes();
}
document.getElementById('qAddMember').addEventListener('click',function(){openMemberM();document.querySelector('.ni[data-page="members"]').click();});
document.getElementById('qAddPhoto').addEventListener('click',function(){document.querySelector('.ni[data-page="gallery"]').click();openGalM();});
document.getElementById('qAddHistory').addEventListener('click',function(){document.querySelector('.ni[data-page="history"]').click();openHistM();});
document.getElementById('qAddFact').addEventListener('click',function(){document.querySelector('.ni[data-page="facts"]').click();openFactM();});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SHARED PHOTO UPLOAD HELPER
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function wireImageUpload(btnId, fileInputId, urlFieldId, previewImgId, previewWrapId){
  var btn       = document.getElementById(btnId);
  var fileInput = document.getElementById(fileInputId);
  var urlField  = document.getElementById(urlFieldId);
  if(!btn || !fileInput) return;

  btn.addEventListener('click', function(){ fileInput.click(); });

  fileInput.addEventListener('change', function(){
    var file = this.files && this.files[0];
    if(!file) return;
    // Check size - warn if > 500KB (base64 inflates ~33%)
    if(file.size > 500*1024){
      toast('⚠️ Image is ' + Math.round(file.size/1024) + 'KB — large images slow the site. Consider resizing first.');
    }
    var reader = new FileReader();
    reader.onload = function(e){
      var dataUrl = e.target.result;
      if(urlField) urlField.value = dataUrl;
      // Update preview if provided
      if(previewImgId){
        var prev = document.getElementById(previewImgId);
        if(prev){ prev.src = dataUrl; prev.style.display = 'block'; }
      }
      if(previewWrapId){
        var wrap = document.getElementById(previewWrapId);
        if(wrap){ wrap.style.display = 'flex'; wrap.style.alignItems = 'center'; }
      }
      // Trigger any existing oninput on the url field
      if(urlField) urlField.dispatchEvent(new Event('input'));
    };
    reader.readAsDataURL(file);
  });
}

// Wire up all image upload buttons
// 1. Members modal (mmPhotoUrl) - already has custom handler, skip
// 2. Gallery modal
wireImageUpload('galUploadBtn', 'galFileInput', 'galUrl', 'galPrevImg', null);

// 3. Hero Background (Page Editor > Home tab)
wireImageUpload('herobgUploadBtn', 'herobgFileInput', 'pe-herobg', null, null);

// 4. History modal
wireImageUpload('histImgUploadBtn', 'histImgFile', 'histImg', 'histImgPrev', 'histImgWrap');

// 5. Facts modal
wireImageUpload('factImgUploadBtn', 'factImgFile', 'factImg', 'factImgPrev', 'factImgWrap');

// 6. Recipe modal
wireImageUpload('recImgUploadBtn', 'recImgFile', 'recImg', 'recImgPrev', 'recImgWrap');

// 7. Events modal
wireImageUpload('evtImgUploadBtn', 'evtImgFile', 'evtImg', 'evtImgPrev', 'evtImgWrap');

// 8. Polls modal
wireImageUpload('pollImgUploadBtn', 'pollImgFile', 'pollImg', null, null);

// 7b. Events modal - re-wire (was missing before)
wireImageUpload('evtImgUploadBtn', 'evtImgFile', 'evtImg', null, null);

// 11. Login page background photo upload
(function(){
  var btn = document.getElementById('lpeBgUploadBtn');
  var inp = document.getElementById('lpeBgFileInput');
  if(!btn||!inp) return;
  btn.addEventListener('click', function(){ inp.click(); });
  inp.addEventListener('change', function(){
    var file = this.files&&this.files[0]; if(!file) return;
    if(file.size > 500*1024){ toast('⚠️ Image is '+Math.round(file.size/1024)+'KB — large backgrounds may slow load.'); }
    var reader = new FileReader();
    reader.onload = function(e){
      var dataUrl = e.target.result;
      var urlVal = "url('"+dataUrl+"')";
      var custom = document.getElementById('lpe-bg-custom');
      var hidden = document.getElementById('lpe-bg');
      var preview = document.getElementById('lpe-theme-preview');
      if(custom) custom.value = urlVal;
      if(hidden) hidden.value = urlVal;
      if(preview){ preview.style.background = urlVal; preview.style.backgroundSize='cover'; preview.textContent=''; }
    };
    reader.readAsDataURL(file);
  });
})();

// 9. Gallery video upload
(function(){
  var vBtn = document.getElementById('galVideoUploadBtn');
  var vFile = document.getElementById('galVideoFileInput');
  if(!vBtn||!vFile) return;
  vBtn.addEventListener('click', function(){ vFile.click(); });
  vFile.addEventListener('change', function(){
    var file = this.files&&this.files[0]; if(!file) return;
    if(file.size > 50*1024*1024){ toast('⚠️ Video is large ('+Math.round(file.size/1024/1024)+'MB). Consider using YouTube link instead.'); }
    var reader = new FileReader();
    reader.onload = function(e){ document.getElementById('galVideoUrl').value = e.target.result; };
    reader.readAsDataURL(file);
  });
})();

// 10. Recipe video upload
(function(){
  var vBtn = document.getElementById('recVideoUploadBtn');
  var vFile = document.getElementById('recVideoFile');
  if(!vBtn||!vFile) return;
  vBtn.addEventListener('click', function(){ vFile.click(); });
  vFile.addEventListener('change', function(){
    var file = this.files&&this.files[0]; if(!file) return;
    if(file.size > 50*1024*1024){ toast('⚠️ Video is '+Math.round(file.size/1024/1024)+'MB. Consider using YouTube link instead.'); return; }
    var reader = new FileReader();
    reader.onload = function(e){ document.getElementById('recVideo').value = e.target.result; };
    reader.readAsDataURL(file);
  });
})();

// Gallery type switcher
window.galSwitchType = function(type){
  document.getElementById('galType').value = type;
  var isPhoto = type==='photo';
  document.getElementById('galPhotoSection').style.display = isPhoto?'':'none';
  document.getElementById('galVideoSection').style.display = isPhoto?'none':'';
  document.getElementById('galTypePhoto').className = isPhoto?'btn bg bsm':'btn bo bsm';
  document.getElementById('galTypeVideo').className = isPhoto?'btn bo bsm':'btn bg bsm';
  document.getElementById('galMH').textContent = isPhoto?'Add Photo':'Add Video';
};


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MEMBERS PAGE SETTINGS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
var MP_DEFAULTS = {
  title:'The Nukala Family Members',
  subtitle:'Every leaf of our family tree. Tap any member to see their full story.',
  defaultView:'grid', cardSize:'normal',
  showFilter:true, showViewToggle:true,
  statTotal:true, statLiving:true, statGens:true, statPhotos:true,
  color:'#5c7a5c', herobg:'',
  gen1:'Great-Great-Grandparents', gen2:'Great-Grandparents', gen3:'Grandparents',
  gen4:'Parents & Aunts/Uncles', gen5:'Your Generation',
  gen6:'Children', gen7:'Grandchildren', gen8:'Great-Grandchildren'
};

function loadMembersPageSettings(){
  var s = ldRaw('nukala_members_page') || {};
  var d = MP_DEFAULTS;
  function gv(k){ return s[k]!==undefined ? s[k] : d[k]; }
  var ids = ['title','subtitle','defaultView','cardSize','color','herobg',
             'gen1','gen2','gen3','gen4','gen5','gen6','gen7','gen8'];
  ids.forEach(function(k){
    var el = document.getElementById('mp-'+k);
    if(el) el.value = gv(k)||'';
  });
  document.getElementById('mp-color-hex').value = gv('color')||'#5c7a5c';
  var chks = {total:'statTotal',living:'statLiving',gens:'statGens',
              photos:'statPhotos',showfilter:'showFilter',showviewtoggle:'showViewToggle'};
  Object.keys(chks).forEach(function(k){
    var el = document.getElementById('mp-'+k);
    if(el) el.checked = gv(chks[k]) !== false;
  });
}

document.getElementById('saveMembersPageBtn').addEventListener('click', function(){
  var s = {};
  ['title','subtitle','defaultView','cardSize','color','herobg',
   'gen1','gen2','gen3','gen4','gen5','gen6','gen7','gen8'].forEach(function(k){
    var el = document.getElementById('mp-'+k);
    if(el) s[k] = el.value.trim();
  });
  s.statTotal    = document.getElementById('mp-stat-total').checked;
  s.statLiving   = document.getElementById('mp-stat-living').checked;
  s.statGens     = document.getElementById('mp-stat-gens').checked;
  s.statPhotos   = document.getElementById('mp-stat-photos').checked;
  s.showFilter   = document.getElementById('mp-showfilter').checked;
  s.showViewToggle = document.getElementById('mp-showviewtoggle').checked;
  svRaw('nukala_members_page', s);
  log('Members page settings saved');
  toast('\u2705 Members page settings saved! Publish to apply.');
});

document.getElementById('previewMembersBtn').addEventListener('click', function(){
  sessionStorage.setItem('nukala_admin','true');
  sessionStorage.setItem('nukala_auth','true');
  localStorage.setItem('nukala_preview_mode','true');
  setTimeout(function(){ localStorage.removeItem('nukala_preview_mode'); }, 30*60*1000);
  window.open('members.html','_blank');
});

wireImageUpload('mpBgUploadBtn', 'mpBgFileInput', 'mp-herobg', null, null);



// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// FACTS PAGE SETTINGS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
(function(){
  var sfBtn = document.getElementById('saveFactsPageBtn');
  if(sfBtn) sfBtn.addEventListener('click', function(){
    var s = {
      showYear: document.getElementById('pe-facts-showYear') ? document.getElementById('pe-facts-showYear').checked : true,
      timeline: document.getElementById('pe-facts-timeline') ? document.getElementById('pe-facts-timeline').checked : true,
      cats: {
        achievement: document.getElementById('pe-facts-cat-achievement') ? document.getElementById('pe-facts-cat-achievement').checked : true,
        milestone:   document.getElementById('pe-facts-cat-milestone') ? document.getElementById('pe-facts-cat-milestone').checked : true,
        tradition:   document.getElementById('pe-facts-cat-tradition') ? document.getElementById('pe-facts-cat-tradition').checked : true,
        record:      document.getElementById('pe-facts-cat-record') ? document.getElementById('pe-facts-cat-record').checked : true,
        funfact:     document.getElementById('pe-facts-cat-funfact') ? document.getElementById('pe-facts-cat-funfact').checked : true
      }
    };
    svRaw('nukala_facts_page', s);
    toast('✅ Facts page settings saved! Click Publish to apply.');
  });
  var pfBtn = document.getElementById('previewFactsPageBtn2');
  if(pfBtn) pfBtn.addEventListener('click', function(){
    sessionStorage.setItem('nukala_admin','true');
    sessionStorage.setItem('nukala_auth','true');
    localStorage.setItem('nukala_preview_mode','true');
    setTimeout(function(){ localStorage.removeItem('nukala_preview_mode'); }, 30*60*1000);
    window.open('facts.html','_blank');
  });
})();

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// PREVIEW BUTTONS FOR ALL PAGES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
(function(){
  var pages = [
    {btn:'previewPollsBtn', page:'polls.html'},
    {btn:'previewMapBtn',   page:'map.html'},
    {btn:'previewGalBtn',   page:'gallery.html'},
    {btn:'previewEvtsBtn',  page:'events.html'},
    {btn:'previewFactsBtn', page:'facts.html'},
    {btn:'previewHistBtn',  page:'history.html'},
    {btn:'previewStatsBtn', page:'stats.html'},
    {btn:'previewRecBtn',   page:'recipes.html'},
    {btn:'previewContactBtn',page:'contact.html'},
    {btn:'previewAboutBtn', page:'about.html'},
  ];
  function openPreview(page){
    sessionStorage.setItem('nukala_admin','true');
    sessionStorage.setItem('nukala_auth','true');
    localStorage.setItem('nukala_preview_mode','true');
    setTimeout(function(){ localStorage.removeItem('nukala_preview_mode'); }, 30*60*1000);
    window.open(page,'_blank');
  }
  pages.forEach(function(p){
    var btn = document.getElementById(p.btn);
    if(btn) btn.addEventListener('click', function(){ openPreview(p.page); });
  });
})();
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// PREVIEW TREE BUTTON
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
document.getElementById('previewTreeBtn').addEventListener('click', function(){
  sessionStorage.setItem('nukala_admin','true');
  sessionStorage.setItem('nukala_auth','true');
  localStorage.setItem('nukala_preview_mode','true');
  // Auto-clear preview flag after 30 mins
  setTimeout(function(){ localStorage.removeItem('nukala_preview_mode'); }, 30*60*1000);
  window.open('tree.html','_blank');
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MEMBERS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
document.getElementById('addMemberBtn').addEventListener('click', openMemberM);
document.getElementById('mGenF').addEventListener('change', renderMembers);
document.getElementById('mSrch').addEventListener('input', renderMembers);
document.getElementById('mmRole').addEventListener('change', function(){document.getElementById('mmCRG').style.display=this.value==='other'?'block':'none';});
document.getElementById('mmPU').addEventListener('click',function(){document.getElementById('mmFile').click();});

// ── Device photo upload (member modal) ──
document.getElementById('mmUploadBtn').addEventListener('click',function(){
  document.getElementById('mmFile2').click();
});
document.getElementById('mmFile2').addEventListener('change',function(){
  var file=this.files&&this.files[0];
  if(!file) return;
  var reader=new FileReader();
  reader.onload=function(e){
    var dataUrl=e.target.result;
    document.getElementById('mmPhotoUrl').value=dataUrl;
    var prev=document.getElementById('mmPrevImg2');
    var wrap=document.getElementById('mmPhotoPreview');
    if(prev){ prev.src=dataUrl; }
    if(wrap){ wrap.style.display='flex'; wrap.style.alignItems='center'; }
    // Also update the existing preview if present
    var existPrev=document.getElementById('mmPrev');
    if(existPrev){ existPrev.src=dataUrl; existPrev.style.display='block'; }
    var existPH=document.getElementById('mmPH');
    if(existPH) existPH.style.display='none';
  };
  reader.readAsDataURL(file);
});
document.getElementById('mmClearPhoto').addEventListener('click',function(){
  document.getElementById('mmPhotoUrl').value='';
  document.getElementById('mmPhotoPreview').style.display='none';
  document.getElementById('mmFile2').value='';
  var existPrev=document.getElementById('mmPrev');
  if(existPrev){ existPrev.src=''; existPrev.style.display='none'; }
  var existPH=document.getElementById('mmPH');
  if(existPH) existPH.style.display='flex';
});
document.getElementById('mmFile').addEventListener('change',function(){if(!this.files||!this.files[0])return;var r=new FileReader();r.onload=function(e){document.getElementById('mmPrev').src=e.target.result;document.getElementById('mmPrev').style.display='block';document.getElementById('mmPH').style.display='none';};r.readAsDataURL(this.files[0]);});
document.getElementById('mmPhotoUrl').addEventListener('input',function(){if(this.value){document.getElementById('mmPrev').src=this.value;document.getElementById('mmPrev').style.display='block';document.getElementById('mmPH').style.display='none';}});
document.getElementById('saveMemberBtn').addEventListener('click', saveMember);

function openMemberM(){
  document.getElementById('mmId').value='';
  document.getElementById('mmH').textContent='Add Family Member';
  ['mmFirst','mmLast','mmBorn','mmDied','mmPlace','mmOcc','mmNotes','mmFather','mmMother','mmSpouse','mmCRole','mmPhotoUrl','mmPhone','mmWhatsapp','mmCity','mmEmail'].forEach(function(id){var el=document.getElementById(id);if(el)el.value='';});
  document.getElementById('mmRole').value='';document.getElementById('mmGen').value='';
  document.getElementById('mmFemale').checked=false;document.getElementById('mmAnc').checked=false;
  document.getElementById('mmDead').checked=false;document.getElementById('mmInlaw').checked=false;
  document.getElementById('mmPrev').style.display='none';document.getElementById('mmPH').style.display='block';
  document.getElementById('mmCRG').style.display='none';
  openM('memberModal');
}

function editMember(id){
  var data=ld('members'),m=data[id];if(!m)return;
  document.getElementById('mmId').value=id;
  document.getElementById('mmH').textContent='Edit Member';
  document.getElementById('mmFirst').value=m.firstName||'';document.getElementById('mmLast').value=m.lastName||'';
  document.getElementById('mmRole').value=m.role||'';document.getElementById('mmGen').value=m.gen||'';
  document.getElementById('mmBorn').value=m.born||'';document.getElementById('mmDied').value=m.died||'';
  document.getElementById('mmPlace').value=m.place||'';document.getElementById('mmOcc').value=m.occ||'';if(document.getElementById('mmPhone'))document.getElementById('mmPhone').value=m.phone||'';if(document.getElementById('mmWhatsapp'))document.getElementById('mmWhatsapp').value=m.whatsapp||'';if(document.getElementById('mmCity'))document.getElementById('mmCity').value=m.city||'';if(document.getElementById('mmEmail'))document.getElementById('mmEmail').value=m.email||'';
  document.getElementById('mmNotes').value=m.notes||'';
  document.getElementById('mmFather').value=m.fatherId||'';document.getElementById('mmMother').value=m.motherId||'';
  document.getElementById('mmSpouse').value=m.spouseId||'';document.getElementById('mmPhotoUrl').value=m.photo||'';
  document.getElementById('mmFemale').checked=!!m.female;document.getElementById('mmAnc').checked=!!m.ancestor;
  document.getElementById('mmDead').checked=!!m.deceased;document.getElementById('mmInlaw').checked=!!m.inlaw;
  if(m.photo){document.getElementById('mmPrev').src=m.photo;document.getElementById('mmPrev').style.display='block';document.getElementById('mmPH').style.display='none';}
  else{document.getElementById('mmPrev').style.display='none';document.getElementById('mmPH').style.display='block';}
  openM('memberModal');
}

function saveMember(){
  var first=document.getElementById('mmFirst').value.trim();
  if(!first){alert('Please enter a first name.');return;}
  var id=document.getElementById('mmId').value||'member_'+Date.now();
  var data=ld('members');
  var roleVal=document.getElementById('mmRole').value;
  var role=roleVal==='other'?document.getElementById('mmCRole').value.trim():roleVal;
  var photo=document.getElementById('mmPhotoUrl').value.trim();
  if(!photo&&document.getElementById('mmPrev').src&&document.getElementById('mmPrev').src.startsWith('data:'))photo=document.getElementById('mmPrev').src;
  data[id]={id:id,firstName:first,lastName:document.getElementById('mmLast').value.trim(),role:role,gen:document.getElementById('mmGen').value,born:document.getElementById('mmBorn').value.trim(),died:document.getElementById('mmDied').value.trim(),place:document.getElementById('mmPlace').value.trim(),occ:document.getElementById('mmOcc').value.trim(),phone:document.getElementById('mmPhone')?document.getElementById('mmPhone').value.trim():'',whatsapp:document.getElementById('mmWhatsapp')?document.getElementById('mmWhatsapp').value.trim():'',city:document.getElementById('mmCity')?document.getElementById('mmCity').value.trim():'',email:document.getElementById('mmEmail')?document.getElementById('mmEmail').value.trim():'',notes:document.getElementById('mmNotes').value.trim(),fatherId:document.getElementById('mmFather').value.trim(),motherId:document.getElementById('mmMother').value.trim(),spouseId:document.getElementById('mmSpouse').value.trim(),female:document.getElementById('mmFemale').checked,ancestor:document.getElementById('mmAnc').checked,deceased:document.getElementById('mmDead').checked||!!document.getElementById('mmDied').value.trim(),inlaw:document.getElementById('mmInlaw').checked,photo:photo};
  sv('members',data);closeM('memberModal');renderMembers();log('Member: '+first);toast('Saved: '+first);
}

function delMember(id){var data=ld('members');var n=[data[id]&&data[id].firstName,data[id]&&data[id].lastName].filter(Boolean).join(' ')||'member';if(!confirm('Delete '+n+'?'))return;delete data[id];sv('members',data);renderMembers();toast('Deleted.');}

function copyId(id){try{navigator.clipboard.writeText(id);}catch(e){}toast('ID copied: '+id.slice(-8));}

function renderMembers(){
  var data=ld('members'),list=Object.values(data);
  var gf=document.getElementById('mGenF').value,q=(document.getElementById('mSrch').value||'').toLowerCase();
  if(gf)list=list.filter(function(m){return m.gen==gf;});
  if(q)list=list.filter(function(m){return([m.firstName,m.lastName,m.role,m.place].join(' ')).toLowerCase().includes(q);});
  list.sort(function(a,b){return(parseInt(a.gen)||9)-(parseInt(b.gen)||9);});
  var g=document.getElementById('membersGrid');
  if(!list.length){g.innerHTML='<div style="grid-column:1/-1;text-align:center;padding:50px;color:var(--tl);"><div style="font-size:40px;margin-bottom:10px;">🌿</div><p>No members yet.<br/>Click <strong>+ Add Member</strong> to start.</p></div>';return;}
  g.innerHTML=list.map(function(m){
    var name=[m.firstName,m.lastName].filter(Boolean).join(' ')||'Unnamed';
    var emoji=m.deceased?'👤':m.female?'👩':'👨';
    var av=m.photo?'<img src="'+m.photo+'" alt="" onerror="this.parentElement.textContent=\''+emoji+'\'"/>':emoji;
    var avCls='av'+(m.ancestor?' ta':'')+(m.female&&!m.ancestor?' tf':'');
    var dates=[m.born,m.died?'✝ '+m.died:''].filter(Boolean).join(' · ')||'–';
    var tags='';
    if(m.gen)tags+='<span class="tag tg">Gen '+m.gen+'</span>';
    if(m.female)tags+='<span class="tag tf">Female</span>';
    if(m.ancestor)tags+='<span class="tag ta">Ancestor</span>';
    if(m.inlaw)tags+='<span class="tag ti">In-law</span>';
    if(m.deceased||m.died)tags+='<span class="tag tdec">Deceased</span>';
    return '<div class="card"><div class="ctop"><div class="'+avCls+'">'+av+'</div><div><div class="cn">'+name+'</div><div class="cr">'+(m.role||'–')+'</div><div class="cd">'+dates+'</div></div></div>'+(tags?'<div class="tags">'+tags+'</div>':'')+'<div class="acts"><button class="ab" onclick="copyId(\''+m.id+'\')">📋 ID</button><button class="ab" onclick="editMember(\''+m.id+'\')">✏️ Edit</button><button class="ab abr" onclick="delMember(\''+m.id+'\')">🗑️</button></div></div>';
  }).join('');
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// HISTORY
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
document.getElementById('addHistBtn').addEventListener('click', openHistM);
document.getElementById('saveHistBtn').addEventListener('click', saveHist);

function openHistM(){document.getElementById('histId').value='';document.getElementById('histMH').textContent='Add History Event';document.getElementById('histYear').value='';document.getElementById('histTitle').value='';document.getElementById('histDesc').value='';openM('histModal');}
function editHist(i){var l=lda('history'),h=l[i];document.getElementById('histId').value=i;document.getElementById('histMH').textContent='Edit Event';document.getElementById('histYear').value=h.year||'';document.getElementById('histTitle').value=h.title||'';document.getElementById('histDesc').value=h.desc||'';document.getElementById('histTag').value=h.tag||document.getElementById('histTag').options[0].value;var _hiEl=document.getElementById('histImg');if(_hiEl){_hiEl.value=h.img||'';var _hw=document.getElementById('histImgWrap');if(h.img){document.getElementById('histImgPrev').src=h.img;if(_hw)_hw.style.display='flex';}else{if(_hw)_hw.style.display='none';}}openM('histModal');}
function saveHist(){var yr=document.getElementById('histYear').value.trim(),ti=document.getElementById('histTitle').value.trim();if(!yr||!ti){alert('Year and Title required.');return;}var l=lda('history'),i=document.getElementById('histId').value,obj={year:yr,title:ti,desc:document.getElementById('histDesc').value.trim(),tag:document.getElementById('histTag').value,img:(document.getElementById('histImg')?document.getElementById('histImg').value.trim():'')};if(i!=='')l[parseInt(i)]=obj;else l.push(obj);l.sort(function(a,b){return(parseInt(a.year)||0)-(parseInt(b.year)||0);});sv('history',l);closeM('histModal');renderHist();log('History: '+ti);toast('Saved!');}
function delHist(i){if(!confirm('Delete?'))return;var l=lda('history');l.splice(i,1);sv('history',l);renderHist();toast('Deleted.');}
function renderHist(){var list=lda('history'),el=document.getElementById('histList');if(!el)return;if(!list.length){el.innerHTML='<div style="text-align:center;padding:40px;color:var(--tl);">No history events yet.</div>';return;}el.innerHTML=list.map(function(h,i){return '<div class="li"><div class="ly">'+h.year+'</div><div class="lb"><div class="lt">'+h.title+'</div><div class="ld">'+(h.tag||'')+(h.desc?' · '+h.desc:'')+'</div><div class="la"><button class="ab" onclick="editHist('+i+')">✏️ Edit</button><button class="ab abr" onclick="delHist('+i+')">🗑️</button></div></div></div>';}).join('');}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// GALLERY
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
document.getElementById('addGalBtn').addEventListener('click', openGalM);
document.getElementById('saveGalBtn').addEventListener('click', saveGal);
document.getElementById('galUrl').addEventListener('input',function(){if(this.value){document.getElementById('galPrevImg').src=this.value;document.getElementById('galPrevDiv').style.display='block';}});

function openGalM(){document.getElementById('galId').value='';document.getElementById('galMH').textContent='Add Photo';['galTitle','galUrl','galYear','galCaption'].forEach(function(id){document.getElementById(id).value='';});document.getElementById('galPrevDiv').style.display='none';openM('galModal');}
function editGal(i){var l=lda('gallery'),g=l[i];document.getElementById('galId').value=i;document.getElementById('galMH').textContent='Edit Photo';document.getElementById('galTitle').value=g.title||'';document.getElementById('galUrl').value=g.url||'';document.getElementById('galYear').value=g.year||'';document.getElementById('galCaption').value=g.caption||'';document.getElementById('galCat').value=g.cat||'family';if(g.url){document.getElementById('galPrevImg').src=g.url;document.getElementById('galPrevDiv').style.display='block';}openM('galModal');}
function saveGal(){var ti=document.getElementById('galTitle').value.trim();if(!ti){alert('Title required.');return;}var l=lda('gallery');var i=document.getElementById('galId').value;var _gt=document.getElementById('galType')?document.getElementById('galType').value:'photo';var _gv=document.getElementById('galVideoUrl')?document.getElementById('galVideoUrl').value.trim():'';var obj={title:ti,type:_gt,url:_gt==='photo'?document.getElementById('galUrl').value.trim():_gv,videoUrl:_gv,year:document.getElementById('galYear').value.trim(),caption:document.getElementById('galCaption').value.trim(),cat:document.getElementById('galCat').value};if(i!=='')l[parseInt(i)]=obj;else l.push(obj);sv('gallery',l);closeM('galModal');renderGal();log('Gallery: '+ti);toast('Saved!');}
function delGal(i){if(!confirm('Delete?'))return;var l=lda('gallery');l.splice(i,1);sv('gallery',l);renderGal();toast('Deleted.');}
function renderGal(){var list=lda('gallery'),el=document.getElementById('galGrid');if(!el)return;if(!list.length){el.innerHTML='<div style="grid-column:1/-1;text-align:center;padding:40px;color:var(--tl);">No photos yet.</div>';return;}el.innerHTML=list.map(function(g,i){var img=g.url?'<img src="'+g.url+'" alt="'+g.title+'" onerror="this.parentElement.innerHTML=\'<div class=gip>🖼️</div>\'">':'<div class="gip">🖼️</div>';return '<div class="gi">'+img+'<div class="git">'+g.title+'</div><div class="gia"><button class="ab" onclick="editGal('+i+')">✏️</button><button class="ab abr" onclick="delGal('+i+')">🗑️</button></div></div>';}).join('');}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// FACTS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
document.getElementById('addFactBtn').addEventListener('click', openFactM);
document.getElementById('saveFactBtn').addEventListener('click', saveFact);

function openFactM(){document.getElementById('factId').value='';document.getElementById('factMH').textContent='Add Fact';['factTitle','factDesc','factIcon','factPerson','factYear'].forEach(function(id){document.getElementById(id).value='';});openM('factModal');}
function editFact(i){var l=lda('facts'),f=l[i];document.getElementById('factId').value=i;document.getElementById('factMH').textContent='Edit Fact';document.getElementById('factTitle').value=f.title||'';document.getElementById('factDesc').value=f.desc||'';document.getElementById('factIcon').value=f.icon||'';document.getElementById('factPerson').value=f.person||'';document.getElementById('factYear').value=f.year||'';document.getElementById('factCat').value=f.cat||'Achievement';var _fiEl=document.getElementById('factImg');if(_fiEl){_fiEl.value=f.img||'';var _fw=document.getElementById('factImgWrap');if(f.img){document.getElementById('factImgPrev').src=f.img;if(_fw)_fw.style.display='flex';}else{if(_fw)_fw.style.display='none';}}openM('factModal');}
function saveFact(){var ti=document.getElementById('factTitle').value.trim();if(!ti){alert('Title required.');return;}var l=lda('facts'),i=document.getElementById('factId').value,obj={title:ti,desc:document.getElementById('factDesc').value.trim(),icon:document.getElementById('factIcon').value.trim(),person:document.getElementById('factPerson').value.trim(),year:document.getElementById('factYear').value.trim(),category:document.getElementById('factCat').value,img:(document.getElementById('factImg')?document.getElementById('factImg').value.trim():'')};if(i!=='')l[parseInt(i)]=obj;else l.push(obj);sv('facts',l);closeM('factModal');renderFacts();log('Fact: '+ti);toast('Saved!');}
function delFact(i){if(!confirm('Delete?'))return;var l=lda('facts');l.splice(i,1);sv('facts',l);renderFacts();toast('Deleted.');}
function renderFacts(){var list=lda('facts'),el=document.getElementById('factsList');if(!el)return;if(!list.length){el.innerHTML='<div style="text-align:center;padding:40px;color:var(--tl);">No facts yet.</div>';return;}el.innerHTML=list.map(function(f,i){return '<div class="li"><div class="ly" style="font-size:1.4rem;">'+(f.icon||'🌟')+'</div><div class="lb"><div class="lt">'+f.title+'</div><div class="ld">'+(f.cat||'')+(f.person?' · '+f.person:'')+(f.year?' · '+f.year:'')+(f.desc?'<br>'+f.desc:'')+'</div><div class="la"><button class="ab" onclick="editFact('+i+')">✏️</button><button class="ab abr" onclick="delFact('+i+')">🗑️</button></div></div></div>';}).join('');}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// EVENTS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
document.getElementById('addEvtBtn').addEventListener('click', openEvtM);
document.getElementById('saveEvtBtn').addEventListener('click', saveEvt);

function openEvtM(){document.getElementById('evtId').value='';document.getElementById('evtMH').textContent='Add Event';['evtTitle','evtDate','evtLoc','evtDesc'].forEach(function(id){document.getElementById(id).value='';});openM('evtModal');}
function editEvt(i){var l=lda('events'),e=l[i];document.getElementById('evtId').value=i;document.getElementById('evtMH').textContent='Edit Event';document.getElementById('evtTitle').value=e.title||'';document.getElementById('evtDate').value=e.date||'';document.getElementById('evtLoc').value=e.loc||'';document.getElementById('evtDesc').value=e.desc||'';document.getElementById('evtType').value=e.type||'Reunion';openM('evtModal');}
function saveEvt(){var ti=document.getElementById('evtTitle').value.trim();if(!ti){alert('Title required.');return;}var l=lda('events'),i=document.getElementById('evtId').value,obj={title:ti,date:document.getElementById('evtDate').value,loc:document.getElementById('evtLoc').value.trim(),desc:document.getElementById('evtDesc').value.trim(),type:document.getElementById('evtType').value,img:document.getElementById('evtImg')?document.getElementById('evtImg').value.trim():''};if(i!=='')l[parseInt(i)]=obj;else l.push(obj);sv('events',l);closeM('evtModal');renderEvts();toast('Saved!');}
function delEvt(i){if(!confirm('Delete?'))return;var l=lda('events');l.splice(i,1);sv('events',l);renderEvts();toast('Deleted.');}
function renderEvts(){
  var list=lda('events'), el=document.getElementById('evtList');if(!el)return;
  document.getElementById('evtReminderPanel').style.display='none';
  if(!list.length){el.innerHTML='<div style="text-align:center;padding:40px;color:var(--tl);">No events yet.</div>';return;}
  var today = new Date(); today.setHours(0,0,0,0);
  el.innerHTML=list.map(function(e,i){
    var evtDate = e.date ? new Date(e.date) : null;
    var isUpcoming = evtDate && evtDate >= today;
    var daysLeft = evtDate ? Math.ceil((evtDate-today)/(1000*60*60*24)) : null;
    var badge = isUpcoming
      ? (daysLeft===0?'<span style="font-size:.65rem;font-weight:700;color:#fff;background:#e07030;border-radius:20px;padding:2px 8px;margin-left:6px;">TODAY</span>'
        :daysLeft<=7?'<span style="font-size:.65rem;font-weight:700;color:#fff;background:#5c7a5c;border-radius:20px;padding:2px 8px;margin-left:6px;">'+daysLeft+'d away</span>'
        :'<span style="font-size:.65rem;color:var(--tl);margin-left:6px;">'+daysLeft+'d away</span>')
      : '';
    var reminderBtn = isUpcoming
      ? '<button class="ab" onclick="showEvtReminders('+i+')" title="Send WhatsApp Reminders" style="background:linear-gradient(135deg,#128c7e,#25d366);color:white;border:none;">📱</button>'
      : '';
    return '<div class="li"><div class="ly" style="font-size:.75rem;text-align:center;">'+((e.date||'').slice(5).replace('-','/'))+'</div>'
      +'<div class="lb"><div class="lt">'+e.title+badge+'</div>'
      +'<div class="ld">'+(e.type||'')+(e.loc?' · '+e.loc:'')+(e.desc?'<br>'+e.desc:'')+'</div>'
      +'<div class="la">'+reminderBtn+'<button class="ab" onclick="editEvt('+i+')">✏️</button><button class="ab abr" onclick="delEvt('+i+')">🗑️</button></div>'
      +'</div></div>';
  }).join('');
}


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// EVENT WHATSAPP REMINDERS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function buildEvtMsg(e, memberName){
  var evtDate = e.date ? new Date(e.date).toLocaleDateString('en-GB',{weekday:'long',year:'numeric',month:'long',day:'numeric'}) : 'Date TBC';
  var today = new Date(); today.setHours(0,0,0,0);
  var daysLeft = e.date ? Math.ceil((new Date(e.date)-today)/(1000*60*60*24)) : null;
  var greeting = memberName ? 'Dear *'+memberName+'*,\n\n' : '';
  var msg = greeting
    + '🌳 *Nukala Family Event Reminder*\n\n'
    + '*'+e.title+'*\n'
    + (e.type ? '📋 Type: '+e.type+'\n' : '')
    + '📅 Date: '+evtDate+'\n'
    + (daysLeft!==null ? (daysLeft===0?'⏰ *This is today!*\n':'⏰ '+daysLeft+' day'+(daysLeft===1?'':'s')+' away\n') : '')
    + (e.loc ? '📍 Location: '+e.loc+'\n' : '')
    + (e.desc ? '\n'+e.desc+'\n' : '')
    + '\nWe hope to see you there! 🎉\n'
    + '\n_Sent from the Nukala Family website_';
  return msg;
}

function showEvtReminders(evtIdx){
  var events = lda('events');
  var e = events[evtIdx];
  if(!e) return;
  var members  = Object.values(ld('members'));
  var contacts = ld('contacts');

  var panel = document.getElementById('evtReminderPanel');
  document.getElementById('evtReminderTitle').textContent = e.title;
  panel.style.display = 'block';
  panel.scrollIntoView({behavior:'smooth', block:'nearest'});

  var withWA = members.filter(function(m){ var c=contacts[m.id]||{}; return m.whatsapp||c.whatsapp; });
  var noWA   = members.filter(function(m){ var c=contacts[m.id]||{}; return !m.whatsapp&&!c.whatsapp; });

  if(!withWA.length){
    document.getElementById('evtReminderList').innerHTML = '<div style="color:var(--tl);font-size:.8rem;">No members have WhatsApp numbers yet. Add them in Admin → Members or Contacts.</div>';
    return;
  }

  var rows = withWA.map(function(m){
    var c = contacts[m.id]||{};
    var wa = m.whatsapp||c.whatsapp||'';
    var num = wa.replace(/[^0-9]/g,'');
    var name = [m.firstName,m.lastName].filter(Boolean).join(' ')||'';
    var msg = buildEvtMsg(e, name);
    var url = 'https://wa.me/'+num+'?text='+encodeURIComponent(msg);
    return '<div style="display:flex;align-items:center;justify-content:space-between;padding:7px 0;border-bottom:1px solid var(--b);">'
      +'<div><strong style="font-size:.8rem;">'+name+'</strong>'
      +(m.gen?'<span style="font-size:.68rem;color:var(--tl);margin-left:6px;">Gen '+m.gen+'</span>':'')
      +'<div style="font-size:.7rem;color:var(--tl);">'+wa+'</div></div>'
      +'<a href="'+url+'" target="_blank" style="background:linear-gradient(135deg,#128c7e,#25d366);color:white;text-decoration:none;border-radius:8px;padding:5px 12px;font-size:.7rem;font-weight:500;white-space:nowrap;flex-shrink:0;">📱 Send</a>'
      +'</div>';
  }).join('');

  var noWANote = noWA.length
    ? '<div style="font-size:.72rem;color:var(--tl);margin-top:8px;">⚠️ '+noWA.length+' member(s) have no WhatsApp number.</div>'
    : '';

  var groupBtn = '<div style="margin-bottom:12px;padding-bottom:12px;border-bottom:2px solid var(--b);">'
    +'<div style="font-size:.75rem;color:var(--tl);margin-bottom:6px;">📤 Send to entire WhatsApp group at once:</div>'
    +'<a href="https://wa.me/?text='+encodeURIComponent(buildEvtMsg(e,''))+'" target="_blank"'
    +' style="display:inline-flex;align-items:center;gap:6px;background:linear-gradient(135deg,#128c7e,#25d366);color:white;text-decoration:none;border-radius:8px;padding:8px 16px;font-size:.8rem;font-weight:500;">'
    +'📤 Send to a Group / Anyone</a>'
    +'<div style="font-size:.68rem;color:var(--tl);margin-top:5px;">Opens WhatsApp → you pick any group or person → tap Send</div>'
    +'</div>';
  document.getElementById('evtReminderList').innerHTML = groupBtn + rows + noWANote;
}

document.getElementById('sendAllRemindersBtn').addEventListener('click', function(){
  var events = lda('events');
  var today = new Date(); today.setHours(0,0,0,0);
  var upcoming = events.filter(function(e){ return e.date && new Date(e.date) >= today; });
  if(!upcoming.length){ alert('No upcoming events found. Add events with future dates first.'); return; }
  var members  = Object.values(ld('members'));
  var contacts = ld('contacts');
  var withWA = members.filter(function(m){ var c=contacts[m.id]||{}; return m.whatsapp||c.whatsapp; });
  if(!withWA.length){ alert('No members have WhatsApp numbers yet. Add them in Members or Contacts.'); return; }

  // Build one combined message for all upcoming events
  var settings = ld('settings');
  var familyName = (settings&&settings.familyName)||'Nukala';
  var evtLines = upcoming.map(function(e){
    var evtDate = e.date ? new Date(e.date).toLocaleDateString('en-GB',{weekday:'short',month:'short',day:'numeric'}) : 'TBC';
    var today2 = new Date(); today2.setHours(0,0,0,0);
    var days = e.date ? Math.ceil((new Date(e.date)-today2)/(1000*60*60*24)) : null;
    return '• *'+e.title+'*'+(e.loc?' @ '+e.loc:'')
      +'\n  📅 '+evtDate+(days!==null?' ('+days+'d away)':''
      +(e.desc?'\n  '+e.desc:''));
  }).join('\n\n');

  var panel = document.getElementById('evtReminderPanel');
  document.getElementById('evtReminderTitle').textContent = upcoming.length+' upcoming event'+(upcoming.length>1?'s':'');
  panel.style.display = 'block';
  panel.scrollIntoView({behavior:'smooth', block:'nearest'});

  var rows = withWA.map(function(m){
    var c = contacts[m.id]||{};
    var wa = m.whatsapp||c.whatsapp||'';
    var num = wa.replace(/[^0-9]/g,'');
    var name = [m.firstName,m.lastName].filter(Boolean).join(' ')||'';
    var msg = 'Dear *'+name+'*,\n\n'
      +'🌳 *'+familyName+' Family — Upcoming Events*\n\n'
      +evtLines+'\n\n'
      +'We hope to see you there! 🎉\n'
      +'_Sent from the '+familyName+' Family website_';
    var url = 'https://wa.me/'+num+'?text='+encodeURIComponent(msg);
    return '<div style="display:flex;align-items:center;justify-content:space-between;padding:7px 0;border-bottom:1px solid var(--b);">'
      +'<div><strong style="font-size:.8rem;">'+name+'</strong>'
      +(m.gen?'<span style="font-size:.68rem;color:var(--tl);margin-left:6px;">Gen '+m.gen+'</span>':'')
      +'<div style="font-size:.7rem;color:var(--tl);">'+wa+'</div></div>'
      +'<a href="'+url+'" target="_blank" style="background:linear-gradient(135deg,#128c7e,#25d366);color:white;text-decoration:none;border-radius:8px;padding:5px 12px;font-size:.7rem;font-weight:500;white-space:nowrap;flex-shrink:0;">📱 Send</a>'
      +'</div>';
  }).join('');

  var noWA = members.filter(function(m){ var c=contacts[m.id]||{}; return !m.whatsapp&&!c.whatsapp; });
  var allMsg = 'Dear Family,\n\n'
    +'🌳 *'+familyName+' Family — Upcoming Events*\n\n'
    +evtLines+'\n\nWe hope to see you there! 🎉\n_Sent from the '+familyName+' Family website_';
  var groupBtn2 = '<div style="margin-bottom:12px;padding-bottom:12px;border-bottom:2px solid var(--b);">'
    +'<div style="font-size:.75rem;color:var(--tl);margin-bottom:6px;">📤 Send to entire WhatsApp group at once:</div>'
    +'<a href="https://wa.me/?text='+encodeURIComponent(allMsg)+'" target="_blank"'
    +' style="display:inline-flex;align-items:center;gap:6px;background:linear-gradient(135deg,#128c7e,#25d366);color:white;text-decoration:none;border-radius:8px;padding:8px 16px;font-size:.8rem;font-weight:500;">'
    +'📤 Send to a Group / Anyone</a>'
    +'<div style="font-size:.68rem;color:var(--tl);margin-top:5px;">Opens WhatsApp → you pick any group or person → tap Send</div>'
    +'</div>';
  document.getElementById('evtReminderList').innerHTML = groupBtn2 + rows
    +(noWA.length?'<div style="font-size:.72rem;color:var(--tl);margin-top:8px;">⚠️ '+noWA.length+' member(s) have no WhatsApp number.</div>':'');
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// RECIPES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
document.getElementById('addRecBtn').addEventListener('click', openRecM);
document.getElementById('saveRecBtn').addEventListener('click', saveRec);

function openRecM(){document.getElementById('recId').value='';document.getElementById('recMH').textContent='Add Recipe';['recTitle','recBy','recTime','recIng','recSteps'].forEach(function(id){document.getElementById(id).value='';});openM('recModal');}
function editRec(i){var l=lda('recipes'),r=l[i];document.getElementById('recId').value=i;document.getElementById('recMH').textContent='Edit Recipe';document.getElementById('recTitle').value=r.title||'';document.getElementById('recBy').value=r.by||'';document.getElementById('recTime').value=r.time||'';document.getElementById('recIng').value=(r.ingredients||[]).join('\n');document.getElementById('recSteps').value=(r.steps||[]).join('\n');document.getElementById('recCat').value=r.cat||'Curry';var _riEl=document.getElementById('recImg');if(_riEl){_riEl.value=r.img||'';var _rw=document.getElementById('recImgWrap');if(r.img){document.getElementById('recImgPrev').src=r.img;if(_rw)_rw.style.display='flex';}else{if(_rw)_rw.style.display='none';}}openM('recModal');}
function saveRec(){var ti=document.getElementById('recTitle').value.trim();if(!ti){alert('Name required.');return;}var l=lda('recipes'),i=document.getElementById('recId').value,obj={title:ti,cat:document.getElementById('recCat').value,by:document.getElementById('recBy').value.trim(),time:document.getElementById('recTime').value.trim(),ingredients:document.getElementById('recIng').value.split('\n').filter(function(x){return x.trim();}),steps:document.getElementById('recSteps').value.split('\n').filter(function(x){return x.trim();}),img:(document.getElementById('recImg')?document.getElementById('recImg').value.trim():''),video:(document.getElementById('recVideo')?document.getElementById('recVideo').value.trim():'')};if(i!=='')l[parseInt(i)]=obj;else l.push(obj);sv('recipes',l);closeM('recModal');renderRecs();toast('Saved!');}
function delRec(i){if(!confirm('Delete?'))return;var l=lda('recipes');l.splice(i,1);sv('recipes',l);renderRecs();toast('Deleted.');}
function renderRecs(){var list=lda('recipes'),el=document.getElementById('recList');if(!el)return;if(!list.length){el.innerHTML='<div style="text-align:center;padding:40px;color:var(--tl);">No recipes yet.</div>';return;}el.innerHTML=list.map(function(r,i){return '<div class="li"><div class="ly" style="font-size:1.2rem;">🍛</div><div class="lb"><div class="lt">'+r.title+'</div><div class="ld">'+(r.cat||'')+(r.by?' · By: '+r.by:'')+(r.time?' · '+r.time:'')+'</div><div class="la"><button class="ab" onclick="editRec('+i+')">✏️</button><button class="ab abr" onclick="delRec('+i+')">🗑️</button></div></div></div>';}).join('');}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ACHIEVEMENTS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
if(document.getElementById('addAchBtn')) document.getElementById('addAchBtn').addEventListener('click', openAchM);
if(document.getElementById('saveAchBtn')) document.getElementById('saveAchBtn').addEventListener('click', saveAch);

function openAchM(){document.getElementById('achId').value='';document.getElementById('achMH').textContent='Add Achievement';['achTitle','achPerson','achYear','achIcon','achDesc'].forEach(function(id){document.getElementById(id).value='';});openM('achModal');}
function editAch(i){var l=lda('achievements'),a=l[i];document.getElementById('achId').value=i;document.getElementById('achMH').textContent='Edit Achievement';document.getElementById('achTitle').value=a.title||'';document.getElementById('achPerson').value=a.person||'';document.getElementById('achYear').value=a.year||'';document.getElementById('achIcon').value=a.icon||'';document.getElementById('achDesc').value=a.desc||'';document.getElementById('achCat').value=a.cat||'Education';openM('achModal');}
function saveAch(){var ti=document.getElementById('achTitle').value.trim();if(!ti){alert('Title required.');return;}var l=lda('achievements'),i=document.getElementById('achId').value,obj={title:ti,person:document.getElementById('achPerson').value.trim(),year:document.getElementById('achYear').value.trim(),icon:document.getElementById('achIcon').value.trim(),cat:document.getElementById('achCat').value,desc:document.getElementById('achDesc').value.trim()};if(i!=='')l[parseInt(i)]=obj;else l.push(obj);sv('achievements',l);closeM('achModal');renderAchs();toast('Saved!');}
function delAch(i){if(!confirm('Delete?'))return;var l=lda('achievements');l.splice(i,1);sv('achievements',l);renderAchs();toast('Deleted.');}
function renderAchs(){var list=lda('achievements'),el=document.getElementById('achList');if(!list.length){el.innerHTML='<div style="text-align:center;padding:40px;color:var(--tl);">No achievements yet.</div>';return;}el.innerHTML=list.map(function(a,i){return '<div class="li"><div class="ly" style="font-size:1.3rem;">'+(a.icon||'🏆')+'</div><div class="lb"><div class="lt">'+a.title+'</div><div class="ld">'+(a.person||'')+(a.year?' · '+a.year:'')+(a.cat?' · '+a.cat:'')+(a.desc?'<br>'+a.desc:'')+'</div><div class="la"><button class="ab" onclick="editAch('+i+')">✏️</button><button class="ab abr" onclick="delAch('+i+')">🗑️</button></div></div></div>';}).join('');}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// VIDEOS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
if(document.getElementById('addVidBtn')) document.getElementById('addVidBtn').addEventListener('click', openVidM);
if(document.getElementById('saveVidBtn')) document.getElementById('saveVidBtn').addEventListener('click', saveVid);

function openVidM(){document.getElementById('vidId').value='';document.getElementById('vidMH').textContent='Add Video';['vidTitle','vidUrl','vidDesc'].forEach(function(id){document.getElementById(id).value='';});openM('vidModal');}
function editVid(i){var l=lda('videos'),v=l[i];document.getElementById('vidId').value=i;document.getElementById('vidMH').textContent='Edit Video';document.getElementById('vidTitle').value=v.title||'';document.getElementById('vidUrl').value=v.url||'';document.getElementById('vidDesc').value=v.desc||'';openM('vidModal');}
function saveVid(){var ti=document.getElementById('vidTitle').value.trim(),url=document.getElementById('vidUrl').value.trim();if(!ti||!url){alert('Title and URL required.');return;}var l=lda('videos'),i=document.getElementById('vidId').value,obj={title:ti,url:url,desc:document.getElementById('vidDesc').value.trim()};if(i!=='')l[parseInt(i)]=obj;else l.push(obj);sv('videos',l);closeM('vidModal');renderVids();toast('Saved!');}
function delVid(i){if(!confirm('Delete?'))return;var l=lda('videos');l.splice(i,1);sv('videos',l);renderVids();toast('Deleted.');}
function renderVids(){var list=lda('videos'),el=document.getElementById('vidList');if(!list.length){el.innerHTML='<div style="text-align:center;padding:40px;color:var(--tl);">No videos yet.</div>';return;}el.innerHTML=list.map(function(v,i){return '<div class="li"><div class="ly" style="font-size:1.3rem;">🎥</div><div class="lb"><div class="lt">'+v.title+'</div><div class="ld">'+(v.url||'')+(v.desc?'<br>'+v.desc:'')+'</div><div class="la"><button class="ab" onclick="editVid('+i+')">✏️</button><button class="ab abr" onclick="delVid('+i+')">🗑️</button></div></div></div>';}).join('');}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// POLLS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
document.getElementById('addPollBtn').addEventListener('click', openPollM);
document.getElementById('savePollBtn').addEventListener('click', savePoll);

function openPollM(){['pollQ','pollOpts'].forEach(function(id){document.getElementById(id).value='';});openM('pollModal');}
function savePoll(){var q=document.getElementById('pollQ').value.trim(),opts=document.getElementById('pollOpts').value.split('\n').map(function(o){return o.trim();}).filter(Boolean);if(!q||opts.length<2){alert('Question and 2+ options required.');return;}var l=lda('polls');var _pi=document.getElementById('pollImg')?document.getElementById('pollImg').value.trim():'';l.push({question:q,options:opts,img:_pi,votes:{}});sv('polls',l);closeM('pollModal');renderPolls();toast('Poll created!');}
function resetPoll(i){var l=lda('polls');l[i].votes={};sv('polls',l);renderPolls();toast('Votes reset.');}
function delPoll(i){if(!confirm('Delete?'))return;var l=lda('polls');l.splice(i,1);sv('polls',l);renderPolls();toast('Deleted.');}
function renderPolls(){var list=lda('polls'),el=document.getElementById('pollList');if(!el)return;if(!list.length){el.innerHTML='<div style="text-align:center;padding:40px;color:var(--tl);">No polls yet.</div>';return;}el.innerHTML=list.map(function(p,i){var opts=p.options.map(function(o){return o+(p.votes&&p.votes[o]?' ('+p.votes[o]+')':'');}).join(', ');return '<div class="li"><div class="ly" style="font-size:1.2rem;">🗳️</div><div class="lb"><div class="lt">'+p.question+'</div><div class="ld">'+opts+'</div><div class="la"><button class="ab" onclick="resetPoll('+i+')">↺ Reset</button><button class="ab abr" onclick="delPoll('+i+')">🗑️</button></div></div></div>';}).join('');}




// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// FAMILY TREE DOWNLOAD (from admin)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function downloadTreeFromAdmin(format){
  var url = 'tree.html?download='+format;
  var w = window.open(url, '_blank');
  if(!w) alert('Please allow pop-ups for this site, then try again.');
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CONTACTS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
document.getElementById('cSrch').addEventListener('input', renderContacts);
document.getElementById('saveCEBtn').addEventListener('click', saveCE);

function renderContacts(){
  var members=Object.values(ld('members')),contacts=ld('contacts');
  var q=(document.getElementById('cSrch').value||'').toLowerCase();
  if(q)members=members.filter(function(m){return([m.firstName,m.lastName,m.role].join(' ')).toLowerCase().includes(q);});
  var el=document.getElementById('contactsGrid');
  if(!members.length){el.innerHTML='<div style="grid-column:1/-1;text-align:center;padding:40px;color:var(--tl);">No members yet. Add members first.</div>';return;}
  el.innerHTML=members.map(function(m){
    var c=contacts[m.id]||{};
    var name=[m.firstName,m.lastName].filter(Boolean).join(' ')||'Unnamed';
    var details=[c.phone?'📞 '+c.phone:'',c.email?'✉️ '+c.email:'',c.city?'📍 '+c.city:''].filter(Boolean).join('<br>');
    return '<div class="card"><div class="ctop"><div class="av">'+(m.female?'👩':'👨')+'</div><div><div class="cn">'+name+'</div><div class="cr">'+(m.role||'–')+'</div></div></div>'+(details?'<div style="font-size:.73rem;color:var(--tm);margin-bottom:8px;line-height:1.7;">'+details+'</div>':'<div style="font-size:.73rem;color:var(--tl);margin-bottom:8px;">No contact info yet.</div>')+'<button class="ab" onclick="openCE(\''+m.id+'\')">✏️ Edit Contact</button></div>';
  }).join('');
}
function openCE(memberId){
  var c=ld('contacts')[memberId]||{},m=ld('members')[memberId]||{};
  document.getElementById('ceId').value=memberId;
  document.getElementById('ceMH').textContent='Edit: '+([m.firstName,m.lastName].filter(Boolean).join(' ')||'Member');
  document.getElementById('cePhone').value=c.phone||'';document.getElementById('ceEmail').value=c.email||'';
  document.getElementById('ceCity').value=c.city||'';document.getElementById('ceBday').value=c.birthday||'';
  document.getElementById('ceSocial').value=c.social||'';document.getElementById('ceNotes').value=c.notes||'';
  openM('ceModal');
}
function saveCE(){
  var id=document.getElementById('ceId').value,contacts=ld('contacts');
  contacts[id]={phone:document.getElementById('cePhone').value.trim(),email:document.getElementById('ceEmail').value.trim(),city:document.getElementById('ceCity').value.trim(),birthday:document.getElementById('ceBday').value.trim(),social:document.getElementById('ceSocial').value.trim(),notes:document.getElementById('ceNotes').value.trim()};
  sv('contacts',contacts);closeM('ceModal');renderContacts();toast('Contact saved!');
}



// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ABOUT PAGE EDITOR
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function renderAbout(){
  _abData = null; // always reload fresh from storage when tab is opened
  var d = ldRaw('nukala_about_draft')||ldRaw('nukala_about')||{sections:[]};
  document.getElementById('ab-title').value   = d.heroTitle||'';
  document.getElementById('ab-desc').value    = d.heroDesc||'';
  document.getElementById('ab-message').value = d.message||'';
  document.getElementById('ab-msgname').value = d.messageName||'';
  abDrawSections(d.sections||[]);
}

function abDrawSections(sections){
  var el = document.getElementById('abSections');
  if(!sections.length){
    el.innerHTML='<div style="text-align:center;padding:20px;color:var(--tl);font-size:.8rem;">No sections yet. Click + Add Section.</div>';
    return;
  }
  el.innerHTML = sections.map(function(sec,si){
    var people = (sec.people||[]).map(function(p,pi){
      return '<div style="display:flex;gap:8px;align-items:flex-start;padding:8px 0;border-bottom:1px solid var(--b);">'
        +'<div style="flex:1;display:grid;grid-template-columns:1fr 1fr;gap:6px;">'
        +'<input type="text" class="fi" placeholder="Name *" value="'+((p.name||'').replace(/"/g,'&quot;'))+'" style="padding:6px 10px;" oninput="abUpdate('+si+','+pi+',\'name\',this.value)"/>'
        +'<input type="text" class="fi" placeholder="Role / Title" value="'+((p.role||'').replace(/"/g,'&quot;'))+'" style="padding:6px 10px;" oninput="abUpdate('+si+','+pi+',\'role\',this.value)"/>'
        +'<div style="grid-column:1/-1;display:flex;gap:6px;align-items:center;">'+'<button type="button" class="btn bo bsm" onclick="abTriggerUpload('+si+','+pi+')" style="flex-shrink:0;white-space:nowrap;">&#128247; Upload</button>'+'<input type="text" class="fi" id="ab-photo-'+si+'-'+pi+'" placeholder="Photo URL (optional)" value="'+((p.photo||'').replace(/"/g,'&quot;'))+'" style="flex:1;padding:6px 10px;" oninput="abUpdate('+si+','+pi+',\'photo\',this.value)"/>'+'</div>'
        +'<input type="text" class="fi" placeholder="Short note (optional)" value="'+((p.note||'').replace(/"/g,'&quot;'))+'" style="padding:6px 10px;grid-column:1/-1;" oninput="abUpdate('+si+','+pi+',\'note\',this.value)"/>'
        +'</div>'
        +'<button class="ab abr" onclick="abRemovePerson('+si+','+pi+')" style="flex-shrink:0;margin-top:2px;">🗑️</button>'
        +'</div>';
    }).join('');

    return '<div style="border:1px solid var(--b);border-radius:10px;padding:14px;margin-bottom:12px;">'
      +'<div style="display:flex;gap:8px;align-items:center;margin-bottom:10px;">'
      +'<input type="text" class="fi" placeholder="Section title e.g. Developers" value="'+((sec.title||'').replace(/"/g,'&quot;'))+'" style="flex:1;padding:7px 11px;" oninput="abUpdateSection('+si+',\'title\',this.value)"/>'
      +'<button class="ab abr" onclick="abRemoveSection('+si+')" title="Delete section">🗑️</button>'
      +'</div>'
      +'<input type="text" class="fi" placeholder="Section description (optional)" value="'+((sec.desc||'').replace(/"/g,'&quot;'))+'" style="width:100%;padding:7px 11px;margin-bottom:10px;" oninput="abUpdateSection('+si+',\'desc\',this.value)"/>'
      +'<div id="ab-people-'+si+'">'+people+'</div>'
      +'<button class="btn bo bsm" onclick="abAddPerson('+si+')" style="margin-top:8px;font-size:.7rem;">+ Add Person</button>'
      +'</div>';
  }).join('');
}

// In-memory about data
var _abData = null;
function abGetData(){
  if(!_abData) _abData = ldRaw('nukala_about_draft')||ldRaw('nukala_about')||{sections:[]};
  return _abData;
}

// ── About page photo upload ──
// Single hidden file input reused for all person rows
(function(){
  var _inp = document.createElement('input');
  _inp.type = 'file'; _inp.accept = 'image/*';
  _inp.style.display = 'none'; _inp.id = 'abPhotoFileGlobal';
  document.body.appendChild(_inp);
  var _si, _pi;
  window.abTriggerUpload = function(si, pi){
    _si = si; _pi = pi; _inp.value = ''; _inp.click();
  };
  _inp.addEventListener('change', function(){
    var file = this.files && this.files[0]; if(!file) return;
    if(file.size > 500*1024) toast('⚠️ Image is '+Math.round(file.size/1024)+'KB — consider resizing first.');
    var reader = new FileReader();
    reader.onload = function(e){
      var url = e.target.result;
      // Update the data model
      abUpdate(_si, _pi, 'photo', url);
      // Update the visible input field
      var fieldId = 'ab-photo-'+_si+'-'+_pi;
      var field = document.getElementById(fieldId);
      if(field) field.value = url;
    };
    reader.readAsDataURL(file);
  });
})();

function abAddSection(){
  var d = abGetData();
  d.sections = d.sections||[];
  d.sections.push({title:'New Section',desc:'',people:[]});
  abDrawSections(d.sections);
}

function abRemoveSection(si){
  if(!confirm('Delete this section?')) return;
  var d = abGetData();
  d.sections.splice(si,1);
  abDrawSections(d.sections);
}

function abAddPerson(si){
  var d = abGetData();
  d.sections[si].people = d.sections[si].people||[];
  d.sections[si].people.push({name:'',role:'',photo:'',note:''});
  abDrawSections(d.sections);
}

function abRemovePerson(si,pi){
  var d = abGetData();
  d.sections[si].people.splice(pi,1);
  abDrawSections(d.sections);
}

function abUpdate(si,pi,field,val){
  var d = abGetData();
  d.sections[si].people[pi][field]=val;
}

function abUpdateSection(si,field,val){
  var d = abGetData();
  d.sections[si][field]=val;
}

document.getElementById('saveAboutBtn').addEventListener('click',function(){
  var d = abGetData();
  d.heroTitle   = document.getElementById('ab-title').value.trim();
  d.heroDesc    = document.getElementById('ab-desc').value.trim();
  d.message     = document.getElementById('ab-message').value.trim();
  d.messageName = document.getElementById('ab-msgname').value.trim();
  svRaw('nukala_about', d);
  svRaw('nukala_about_draft', d); // draft survives site-data.js XHR on other pages
  _abData = null; // reset cache
  log('About page saved');
  toast('✅ About page saved! Click Publish to Site to apply.');
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CONTACTS EXCEL EXPORT
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
document.getElementById('expContactsBtn').addEventListener('click', function(){
  var members  = Object.values(ld('members'));
  var contacts = ld('contacts');
  var settings = ld('settings');

  // Build rows — one per member with all details
  var headers = [
    'First Name','Last Name','Generation','Role',
    'Date of Birth','Birthplace','Occupation',
    'City / Lives In','Phone','WhatsApp','Email',
    'Birthday (Contact)','Social Media','Notes (Contact)',
    'Father','Mother','Spouse','Deceased'
  ];

  // Helper: get name from id
  var allMem = ld('members');
  function getName(id){ if(!id||!allMem[id]) return ''; return [allMem[id].firstName,allMem[id].lastName].filter(Boolean).join(' '); }

  var rows = members.map(function(m){
    var c = contacts[m.id]||{};
    return [
      m.firstName||'',
      m.lastName||'',
      m.gen||'',
      m.role||'',
      m.born||'',
      m.place||'',
      m.occ||'',
      m.city||c.city||'',
      m.phone||c.phone||'',
      m.whatsapp||c.whatsapp||'',
      m.email||c.email||'',
      c.birthday||'',
      c.social||'',
      c.notes||'',
      getName(m.fatherId),
      getName(m.motherId),
      getName(m.spouseId),
      m.deceased?'Yes':''
    ];
  });

  // Sort by generation then name
  rows.sort(function(a,b){
    var gA=parseInt(a[2])||99, gB=parseInt(b[2])||99;
    if(gA!==gB) return gA-gB;
    return (a[0]+a[1]).localeCompare(b[0]+b[1]);
  });

  var familyName = (settings&&settings.familyName)||'Nukala';
  var date = new Date().toISOString().slice(0,10);
  dlCsv([headers].concat(rows), familyName+'-Contacts-'+date+'.csv');
  toast('✅ Contacts downloaded! Open in Excel or Google Sheets.');
  log('Exported contacts to CSV');
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ANNOUNCEMENTS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
document.getElementById('sendEmailBtn').addEventListener('click',function(){var title=document.getElementById('annTitle').value.trim(),msg=document.getElementById('annMsg').value.trim();if(!title||!msg){alert('Title and message required.');return;}window.open('mailto:?subject='+encodeURIComponent(title)+'&body='+encodeURIComponent(msg));var l=lda('annLog');l.push('📧 '+title+' — '+(new Date().toLocaleDateString()));sv('annLog',l);renderAnn();toast('Email client opened!');});
document.getElementById('sendWABtn').addEventListener('click',function(){
  var title=document.getElementById('annTitle').value.trim();
  var msg=document.getElementById('annMsg').value.trim();
  if(!msg){alert('Message required.');return;}
  // Open general WA share (no specific recipient)
  window.open('https://wa.me/?text='+encodeURIComponent('*'+title+'*\n\n'+msg));
  var l=lda('annLog');
  l.push('📱 '+title+' — '+(new Date().toLocaleDateString()));
  sv('annLog',l);
  renderAnn();
  toast('WhatsApp opened! Use the list below to send to individual members.');
});

// Update WA list when message changes
document.getElementById('annMsg').addEventListener('input', refreshWAList);
document.getElementById('annTitle').addEventListener('input', refreshWAList);

// Send to Group button — opens WA with no recipient so admin can pick any group
document.getElementById('sendWAGroupBtn').addEventListener('click', function(){
  var title = document.getElementById('annTitle').value.trim();
  var msg   = document.getElementById('annMsg').value.trim();
  if(!msg){ alert('Please type a message first.'); return; }
  var fullMsg = (title ? '*'+title+'*\n\n' : '') + msg;
  window.open('https://wa.me/?text='+encodeURIComponent(fullMsg), '_blank');
  var l = lda('annLog');
  l.push('📤 '+title+' (Group) — '+(new Date().toLocaleDateString()));
  sv('annLog', l);
  renderAnn();
  toast('WhatsApp opened — pick your family group and tap Send!');
});
function renderAnn(){
  var logs=lda('annLog'),el=document.getElementById('annLog');if(!el)return;
  el.innerHTML=logs.length?logs.slice(-10).reverse().map(function(l){return '<div style="padding:4px 0;border-bottom:1px solid var(--b);font-size:.78rem;color:var(--tm);">'+l+'</div>';}).join(''):'No announcements sent yet.';
  refreshWAList();
}

function refreshWAList(){
  var el = document.getElementById('annWAList');
  if(!el) return;
  var members  = Object.values(ld('members'));
  var contacts = ld('contacts');
  var msg = (document.getElementById('annMsg')||{}).value||'';
  var title = (document.getElementById('annTitle')||{}).value||'';
  var fullMsg = (title?'*'+title+'*\n\n':'')+msg;

  // Filter members who have a WhatsApp number
  var withWA = members.filter(function(m){
    var c=contacts[m.id]||{};
    return m.whatsapp||c.whatsapp;
  });
  var noWA   = members.filter(function(m){
    var c=contacts[m.id]||{};
    return !m.whatsapp&&!c.whatsapp;
  });

  if(!members.length){
    el.innerHTML='<span style="color:var(--tl);">No members added yet.</span>';
    return;
  }

  var rows = withWA.map(function(m){
    var c   = contacts[m.id]||{};
    var wa  = m.whatsapp||c.whatsapp||'';
    var num = wa.replace(/[^0-9]/g,'');
    var name= [m.firstName,m.lastName].filter(Boolean).join(' ')||'Unnamed';
    var url = 'https://wa.me/'+num+'?text='+encodeURIComponent(fullMsg||'Hello '+name+'!');
    return '<div style="display:flex;align-items:center;justify-content:space-between;padding:7px 0;border-bottom:1px solid var(--b);">'
      +'<div><strong style="font-size:.8rem;">'+name+'</strong>'
      +(m.gen?'<span style="font-size:.68rem;color:var(--tl);margin-left:6px;">Gen '+m.gen+'</span>':'')
      +'<div style="font-size:.7rem;color:var(--tl);">'+wa+'</div></div>'
      +'<a href="'+url+'" target="_blank" style="background:linear-gradient(135deg,#128c7e,#25d366);color:white;text-decoration:none;border-radius:8px;padding:5px 12px;font-size:.7rem;font-weight:500;white-space:nowrap;">📱 Send</a>'
      +'</div>';
  }).join('');

  var noWANote = noWA.length
    ? '<div style="font-size:.72rem;color:var(--tl);margin-top:8px;">⚠️ '+noWA.length+' member(s) have no WhatsApp number — add it in Admin → Members or Contacts.</div>'
    : '';

  var groupAnnBtn = withWA.length ? '<div style="margin-bottom:12px;padding-bottom:12px;border-bottom:2px solid var(--b);">'
    +'<div style="font-size:.75rem;color:var(--tl);margin-bottom:6px;">📤 Send to entire WhatsApp group at once:</div>'
    +'<a href="https://wa.me/?text='+encodeURIComponent(fullMsg)+'" target="_blank"'
    +' style="display:inline-flex;align-items:center;gap:6px;background:linear-gradient(135deg,#128c7e,#25d366);color:white;text-decoration:none;border-radius:8px;padding:8px 16px;font-size:.8rem;font-weight:500;">'
    +'📤 Send to a Group / Anyone</a>'
    +'<div style="font-size:.68rem;color:var(--tl);margin-top:5px;">Opens WhatsApp → you pick any group or person → tap Send</div>'
    +'</div>' : '';
  el.innerHTML = withWA.length
    ? groupAnnBtn + rows + noWANote
    : '<div style="color:var(--tl);font-size:.78rem;">No members have WhatsApp numbers yet. Add WhatsApp numbers in Admin → Members or Contacts.</div>';
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// PAGE VISIBILITY
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
var PAGES = [
  {id:'home',     href:'home.html',    label:'Home',        locked:true},
  {id:'tree',     href:'tree.html',    label:'Family Tree', locked:true},
  {id:'members',  href:'members.html', label:'Family Members', locked:false},
  {id:'history',  href:'history.html', label:'History',     locked:false},
  {id:'gallery',  href:'gallery.html', label:'Gallery',     locked:false},
  {id:'facts',    href:'facts.html',   label:'Facts',       locked:false},
  {id:'stats',    href:'stats.html',   label:'Stats',       locked:false},
  {id:'events',   href:'events.html',  label:'Events',      locked:false},
  {id:'map',      href:'map.html',     label:'Map',         locked:false},
  {id:'polls',    href:'polls.html',   label:'Polls',       locked:false},
  {id:'recipes',  href:'recipes.html', label:'Recipes',     locked:false},
  {id:'qr',       href:'qr.html',      label:'QR Code',    locked:false},
  {id:'contact',  href:'contact.html', label:'Contact',     locked:true},
  {id:'join',     href:'join.html',    label:'Join Tree',   locked:false},
  {id:'about',    href:'about.html',   label:'About',       locked:false},
];
document.getElementById('visSaveBtn').addEventListener('click', visSave);
document.getElementById('visEnableAllBtn').addEventListener('click', visEnableAll);

function renderVis(){
  var saved=ld('pagevis'),el=document.getElementById('visList'),html='';
  PAGES.forEach(function(p){
    var on=saved[p.id]!==false,bg=on?'#5c7a5c':'#ccc',tx=on?'translateX(20px)':'translateX(0)';
    var bdg=on?'<span style="font-size:.68rem;font-weight:600;padding:2px 10px;border-radius:20px;background:#f0f5f0;color:#5c7a5c;">Enabled</span>':'<span style="font-size:.68rem;font-weight:600;padding:2px 10px;border-radius:20px;background:#faf0f0;color:#c0614a;">Disabled</span>';
    html+='<div class="vr"><div style="display:flex;align-items:center;gap:12px;"><div class="vt"><input type="checkbox" id="v-'+p.id+'" '+(on?'checked ':' ')+(p.locked?'disabled ':' ')+'onchange="visChg(\''+p.id+'\',this.checked)"/><div id="vtr-'+p.id+'" class="vtr" style="background:'+bg+';"></div><div id="vth-'+p.id+'" class="vth" style="transform:'+tx+';"></div></div><div><div style="font-size:.84rem;font-weight:500;color:var(--td);">'+p.label+'</div><div style="font-size:.68rem;color:var(--tl);">'+p.href+(p.locked?' · Core page':'')+'</div></div></div>'+bdg+'</div>';
  });
  el.innerHTML=html;visPreview();
}
function visChg(id,on){var tr=document.getElementById('vtr-'+id),th=document.getElementById('vth-'+id);if(tr)tr.style.background=on?'#5c7a5c':'#ccc';if(th)th.style.transform=on?'translateX(20px)':'translateX(0)';visPreview();}
function visPreview(){document.getElementById('visPreview').innerHTML=PAGES.map(function(p){var cb=document.getElementById('v-'+p.id),on=cb?cb.checked:true;return '<span style="padding:4px 10px;border-radius:20px;font-size:.71rem;font-weight:500;background:'+(on?'#c8ddc8':'#f0f0f0')+';color:'+(on?'#5c7a5c':'#aaa')+(on?'':';text-decoration:line-through')+';display:inline-block;margin:2px;">'+p.label+'</span>';}).join('');}
function visSave(){
  var vis={};
  PAGES.forEach(function(p){
    var cb=document.getElementById('v-'+p.id);
    vis[p.id]=p.locked?true:(cb?cb.checked:true);
  });
  sv('pagevis',vis);

  // ALSO sync nukala_navmenu so nav hides correctly on all devices after publish
  var nm=ldRaw('nukala_navmenu')||{items:[]};
  if(!nm.items||!nm.items.length){
    // Build from PAGES defaults
    nm.items=PAGES.map(function(p){return {href:p.href,label:p.label,active:vis[p.id]!==false};});
  } else {
    nm.items=nm.items.map(function(item){
      var pageId=Object.keys(vis).find(function(id){
        return PAGES.find(function(p){return p.id===id&&p.href===item.href;});
      });
      if(pageId) item.active=vis[pageId]!==false;
      return item;
    });
  }
  svRaw('nukala_navmenu',nm);

  log('Page visibility updated');
  toast('✅ Visibility saved! Click Publish to Site to apply to all devices.');
}
function visEnableAll(){PAGES.forEach(function(p){var cb=document.getElementById('v-'+p.id);if(cb&&!p.locked){cb.checked=true;visChg(p.id,true);}});toast('All enabled!');}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// PAGE EDITOR
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
var PAGE_TEXTS=[{key:'history',page:'History',file:'history.html',eye:'Our Story',title:'Nukala Family History',desc:'A journey through time.'},{key:'gallery',page:'Gallery',file:'gallery.html',eye:'Memories',title:'Photo Gallery',desc:'A visual archive.'},{key:'facts',page:'Facts',file:'facts.html',eye:'Did You Know?',title:'Interesting Family Facts',desc:'Fascinating milestones.'},{key:'tree',page:'Family Tree',file:'tree.html',eye:'Our Roots',title:'Nukala Family Tree',desc:'Click any leaf to discover.'},{key:'events',page:'Events',file:'events.html',eye:'Upcoming',title:'Family Events',desc:'Reunions and celebrations.'},{key:'recipes',page:'Recipes',file:'recipes.html',eye:'Traditional',title:'Family Recipes',desc:'Cherished recipes.'},{key:'polls',page:'Polls',file:'polls.html',eye:'Have Your Say',title:'Family Polls',desc:'Every voice counts.'},{key:'stats',page:'Stats',file:'stats.html',eye:'By The Numbers',title:'Family Statistics',desc:'Fascinating insights.'},{key:'map',page:'Map',file:'map.html',eye:'Where We Are',title:'Family Map',desc:'See where we live.'},{key:'contact',page:'Contact',file:'contact.html',eye:'Contribute',title:'Get In Touch',desc:'Share a story or photo.'},{key:'join',page:'Join Tree',file:'join.html',eye:'Join the Family',title:'Join the Family Tree',desc:'Help us build the most complete Nukala family archive.'}];

document.querySelectorAll('.ptb[data-tab]').forEach(function(btn){
  btn.addEventListener('click',function(){
    var tab=this.getAttribute('data-tab');
    document.querySelectorAll('.ptb').forEach(function(b){b.classList.remove('on');});
    this.classList.add('on');
    document.querySelectorAll('.pts').forEach(function(s){s.classList.remove('on');});
    document.getElementById('pt-'+tab).classList.add('on');
    loadPeTab(tab);
  });
});

document.querySelectorAll('[data-theme]').forEach(function(btn){
  btn.addEventListener('click',function(){applyThemePreset(this.getAttribute('data-theme'));});
});

document.getElementById('clrPrimary').addEventListener('input',function(){document.getElementById('clrPrimaryHex').value=this.value;});
document.getElementById('clrPrimaryHex').addEventListener('input',function(){if(/^#[0-9a-fA-F]{6}$/.test(this.value))document.getElementById('clrPrimary').value=this.value;});
document.getElementById('clrSecondary').addEventListener('input',function(){document.getElementById('clrSecondaryHex').value=this.value;});
document.getElementById('clrSecondaryHex').addEventListener('input',function(){if(/^#[0-9a-fA-F]{6}$/.test(this.value))document.getElementById('clrSecondary').value=this.value;});
document.getElementById('clrBg').addEventListener('input',function(){document.getElementById('clrBgHex').value=this.value;});
document.getElementById('clrBgHex').addEventListener('input',function(){if(/^#[0-9a-fA-F]{6}$/.test(this.value))document.getElementById('clrBg').value=this.value;});
document.getElementById('clrText').addEventListener('input',function(){document.getElementById('clrTextHex').value=this.value;});
document.getElementById('clrTextHex').addEventListener('input',function(){if(/^#[0-9a-fA-F]{6}$/.test(this.value))document.getElementById('clrText').value=this.value;});

document.getElementById('saveThemeBtn').addEventListener('click',function(){
  var theme={primary:document.getElementById('clrPrimaryHex').value||document.getElementById('clrPrimary').value,secondary:document.getElementById('clrSecondaryHex').value||document.getElementById('clrSecondary').value,bg:document.getElementById('clrBgHex').value||document.getElementById('clrBg').value,text:document.getElementById('clrTextHex').value||document.getElementById('clrText').value};
  svRaw('nukala_theme',theme);log('Theme saved');toast('Theme saved!');
});
// ─── FONT SIZE ───────────────────────────────────
var FONT_SIZES = {
  small:  {base:'13px', scale:'0.9'},
  normal: {base:'15px', scale:'1.0'},
  large:  {base:'17px', scale:'1.1'},
  xlarge: {base:'19px', scale:'1.2'}
};

document.querySelectorAll('[data-fontsize]').forEach(function(btn){
  btn.addEventListener('click', function(){
    var sz = FONT_SIZES[this.getAttribute('data-fontsize')];
    document.getElementById('fontSizeCustom').value  = sz.base;
    document.getElementById('fontScaleCustom').value = sz.scale;
    applyFontPreview(sz.base, sz.scale);
    document.querySelectorAll('[data-fontsize]').forEach(function(b){ b.style.background=''; b.style.color=''; });
    this.style.background = 'var(--sd)'; this.style.color = 'white';
  });
});

function applyFontPreview(base, scale){
  var theme = ldRaw('nukala_theme')||{};
  theme.fontSize = base;
  theme.fontScale = scale;
  svRaw('nukala_theme', theme);
}

document.getElementById('saveFontSizeBtn').addEventListener('click', function(){
  var base  = document.getElementById('fontSizeCustom').value.trim()||'15px';
  var scale = document.getElementById('fontScaleCustom').value.trim()||'1.0';
  var theme = ldRaw('nukala_theme')||{};
  theme.fontSize  = base;
  theme.fontScale = scale;
  svRaw('nukala_theme', theme);
  log('Font size updated');
  toast('✅ Font size saved! Publish to Site to apply to all devices.');
});

// Load saved font size into inputs
(function(){
  var theme = ldRaw('nukala_theme')||{};
  if(theme.fontSize)  { var el=document.getElementById('fontSizeCustom');  if(el) el.value=theme.fontSize; }
  if(theme.fontScale) { var el2=document.getElementById('fontScaleCustom'); if(el2) el2.value=theme.fontScale; }
})();

// ─── BACKGROUND PRESETS ──────────────────────────
var BG_PRESETS = {
  default:  '#faf8f4',
  warm:     'linear-gradient(135deg,#fdf6ee,#faf0e6)',
  sand:     'linear-gradient(135deg,#f5f0e8,#ede5d5)',
  mint:     'linear-gradient(135deg,#eef6f0,#dff0e8)',
  blush:    'linear-gradient(135deg,#fdf0f0,#f5e6e8)',
  sky:      'linear-gradient(135deg,#eef4fd,#e0eeff)',
  lavender: 'linear-gradient(135deg,#f4eefb,#ede0f5)',
  dark:     'linear-gradient(135deg,#1a1a2e,#16213e)'
};

document.querySelectorAll('.bg-preset-btn').forEach(function(btn){
  btn.addEventListener('click', function(){
    var key = this.getAttribute('data-bg');
    var val = BG_PRESETS[key]||'#faf8f4';
    document.getElementById('bgCustomInput').value = val;
    var prev = document.getElementById('bgPreview');
    if(prev){ prev.style.background=val; prev.style.backgroundSize='cover'; }
    document.querySelectorAll('.bg-preset-btn').forEach(function(b){ b.style.outline=''; });
    this.style.outline = '2px solid var(--sd)';
  });
});

document.getElementById('bgCustomInput').addEventListener('input', function(){
  var val = this.value.trim();
  if(!val) return;
  var prev = document.getElementById('bgPreview');
  if(prev){ prev.style.background=val; prev.style.backgroundSize='cover'; prev.textContent=''; }
});

document.getElementById('saveBgBtn').addEventListener('click', function(){
  var val = document.getElementById('bgCustomInput').value.trim();
  if(!val){ toast('Please enter or select a background.'); return; }
  var theme = ldRaw('nukala_theme')||{};
  theme.siteBackground = val;
  svRaw('nukala_theme', theme);
  log('Background updated');
  toast('✅ Background saved! Publish to Site to apply to all devices.');
});

document.getElementById('resetBgBtn').addEventListener('click', function(){
  var theme = ldRaw('nukala_theme')||{};
  delete theme.siteBackground;
  svRaw('nukala_theme', theme);
  document.getElementById('bgCustomInput').value = '';
  var prev = document.getElementById('bgPreview');
  if(prev){ prev.style.background='var(--cream)'; prev.textContent='Preview'; }
  document.querySelectorAll('.bg-preset-btn').forEach(function(b){ b.style.outline=''; });
  toast('✅ Background reset to default.');
});

// Load saved background into input on open
(function(){
  var theme = ldRaw('nukala_theme')||{};
  if(theme.siteBackground){
    var el=document.getElementById('bgCustomInput'); if(el) el.value=theme.siteBackground;
    var prev=document.getElementById('bgPreview');
    if(prev){ prev.style.background=theme.siteBackground; prev.style.backgroundSize='cover'; prev.textContent=''; }
  }
})();

document.getElementById('resetThemeBtn').addEventListener('click',function(){localStorage.removeItem('nukala_theme');applyThemePreset('sage');toast('Theme reset.');});
document.getElementById('saveSiteWideBtn').addEventListener('click',function(){
  var sw=ldRaw('nukala_sitewide')||{};
  sw.navName=document.getElementById('pe-sitename').value.trim();
  sw.footerName=document.getElementById('pe-footer').value.trim();
  sw.footerSub=document.getElementById('pe-footersub').value.trim();
  sw.showSearch=document.getElementById('pe-showsearch').checked;
  sw.showDark=document.getElementById('pe-showdark').checked;
  sw.showLang=document.getElementById('pe-showlang').checked;
  sw.treeQuote=document.getElementById('pe-treequote').value.trim();
  sw.treeQuoteAuthor=document.getElementById('pe-treequoteauthor').value.trim();
  var yr=document.getElementById('pe-footeryear').value.trim();
  sw.footerYear=yr?yr:'';
  svRaw('nukala_sitewide',sw);
  var s=ld('settings');
  if(sw.navName){s.familyName=sw.navName;sv('settings',s);document.getElementById('siteName').textContent=sw.navName;}
  log('Site wide saved');toast('✅ Saved! Footer and nav updated on all pages.');
});
document.getElementById('saveHomeBtn').addEventListener('click',function(){
  var hd=ldRaw('nukala_home')||{};
  hd.heroTitle=document.getElementById('pe-htitle').value.trim();hd.heroTagline=document.getElementById('pe-htagline').value.trim();
  hd.stat1num=document.getElementById('pe-s1num').value.trim();hd.stat1lbl=document.getElementById('pe-s1lbl').value.trim();
  hd.stat2num=document.getElementById('pe-s2num').value.trim();hd.stat2lbl=document.getElementById('pe-s2lbl').value.trim();
  hd.stat3num=document.getElementById('pe-s3num').value.trim();hd.stat3lbl=document.getElementById('pe-s3lbl').value.trim();
  hd.aboutTitle=document.getElementById('pe-abouttitle').value.trim();hd.about1=document.getElementById('pe-about1').value.trim();hd.about2=document.getElementById('pe-about2').value.trim();hd.about3=document.getElementById('pe-about3').value.trim();
  svRaw('nukala_home',hd);var hp=ldRaw('nukala_heropage')||{};hp.homeImgUrl=document.getElementById('pe-herobg').value.trim();svRaw('nukala_heropage',hp);log('Home saved');toast('Home page saved!');
});
document.getElementById('savePageTextsBtn').addEventListener('click',function(){
  var np=ldRaw('nukala_newpages')||{};
  PAGE_TEXTS.forEach(function(pg){np[pg.key]={eye:document.getElementById('np-'+pg.key+'-eye').value.trim(),title:document.getElementById('np-'+pg.key+'-title').value.trim(),desc:document.getElementById('np-'+pg.key+'-desc').value.trim()};});
  svRaw('nukala_newpages',np);log('Page texts saved');toast('All page texts saved!');
});
document.getElementById('saveContactBtn').addEventListener('click',function(){
  var cp={contactName:document.getElementById('pe-cname').value.trim(),contactEmail:document.getElementById('pe-cemail').value.trim(),formspree:document.getElementById('pe-formspree').value.trim(),dropdownOptions:document.getElementById('pe-droptions').value.split('\n').map(function(o){return o.trim();}).filter(Boolean)};
  svRaw('nukala_contactpage2',cp);log('Contact page saved');toast('Contact page saved!');
});
document.getElementById('saveGalPageBtn').addEventListener('click',function(){
  var gp={categories:document.getElementById('pe-galcats').value.split('\n').map(function(c){return c.trim();}).filter(Boolean)};
  svRaw('nukala_gallerypage2',gp);toast('Gallery categories saved!');
});
document.getElementById('saveFontsBtn').addEventListener('click',function(){
  var typo={headFont:document.getElementById('pe-fonthead').value,bodyFont:document.getElementById('pe-fontbody').value};
  svRaw('nukala_typography',typo);var s=ld('settings');s.headFont=typo.headFont;s.bodyFont=typo.bodyFont;sv('settings',s);toast('Fonts saved!');
});

function applyThemePreset(t){
  var themes={sage:{primary:'#5c7a5c',secondary:'#8aab8a',bg:'#faf8f4',text:'#2c2c2c'},navy:{primary:'#1a3a5c',secondary:'#2e6090',bg:'#f4f6fa',text:'#1a2a3a'},gold:{primary:'#8a6a00',secondary:'#c9a84c',bg:'#faf8f0',text:'#2c2a1a'},maroon:{primary:'#6b1a1a',secondary:'#a03030',bg:'#faf4f4',text:'#2c1a1a'},purple:{primary:'#4a2060',secondary:'#7050a0',bg:'#f8f4fa',text:'#2a1a2c'},teal:{primary:'#0d6e6e',secondary:'#1aab9b',bg:'#f4fafa',text:'#1a2c2c'}};
  var c=themes[t];if(!c)return;
  document.getElementById('clrPrimary').value=c.primary;document.getElementById('clrPrimaryHex').value=c.primary;
  document.getElementById('clrSecondary').value=c.secondary;document.getElementById('clrSecondaryHex').value=c.secondary;
  document.getElementById('clrBg').value=c.bg;document.getElementById('clrBgHex').value=c.bg;
  document.getElementById('clrText').value=c.text;document.getElementById('clrTextHex').value=c.text;
}

function loadPeTab(tab){
  if(tab==='theme'){var t=ldRaw('nukala_theme')||{};if(t.primary){document.getElementById('clrPrimary').value=t.primary;document.getElementById('clrPrimaryHex').value=t.primary;}if(t.secondary){document.getElementById('clrSecondary').value=t.secondary;document.getElementById('clrSecondaryHex').value=t.secondary;}if(t.bg){document.getElementById('clrBg').value=t.bg;document.getElementById('clrBgHex').value=t.bg;}if(t.text){document.getElementById('clrText').value=t.text;document.getElementById('clrTextHex').value=t.text;}}
  if(tab==='sitewide'){var sw=ldRaw('nukala_sitewide')||{};document.getElementById('pe-sitename').value=sw.navName||'';document.getElementById('pe-footer').value=sw.footerName||'';document.getElementById('pe-footersub').value=sw.footerSub||'';document.getElementById('pe-showsearch').checked=sw.showSearch!==false;document.getElementById('pe-showdark').checked=sw.showDark!==false;document.getElementById('pe-showlang').checked=sw.showLang!==false;document.getElementById('pe-treequote').value=sw.treeQuote||'';document.getElementById('pe-treequoteauthor').value=sw.treeQuoteAuthor||'';document.getElementById('pe-footeryear').value=sw.footerYear||'';}
  if(tab==='home'){var hd=ldRaw('nukala_home')||{},hp=ldRaw('nukala_heropage')||{};document.getElementById('pe-htitle').value=hd.heroTitle||'';document.getElementById('pe-htagline').value=hd.heroTagline||'';document.getElementById('pe-herobg').value=hp.homeImgUrl||'';document.getElementById('pe-s1num').value=hd.stat1num||'';document.getElementById('pe-s1lbl').value=hd.stat1lbl||'';document.getElementById('pe-s2num').value=hd.stat2num||'';document.getElementById('pe-s2lbl').value=hd.stat2lbl||'';document.getElementById('pe-s3num').value=hd.stat3num||'';document.getElementById('pe-s3lbl').value=hd.stat3lbl||'';document.getElementById('pe-abouttitle').value=hd.aboutTitle||'';document.getElementById('pe-about1').value=hd.about1||'';document.getElementById('pe-about2').value=hd.about2||'';document.getElementById('pe-about3').value=hd.about3||'';}
  if(tab==='pages'){var np=ldRaw('nukala_newpages')||{};document.getElementById('pageTextsEditor').innerHTML=PAGE_TEXTS.map(function(pg){var d=np[pg.key]||{};return '<div class="panel" style="margin-bottom:12px;"><div class="pt">'+pg.page+' ('+pg.file+')</div><div class="fr"><div class="fg"><label>Eyebrow Text</label><input type="text" class="fi" id="np-'+pg.key+'-eye" placeholder="'+pg.eye+'" value="'+(d.eye||'').replace(/"/g,'&quot;')+'"/></div><div class="fg"><label>Page Title</label><input type="text" class="fi" id="np-'+pg.key+'-title" placeholder="'+pg.title+'" value="'+(d.title||'').replace(/"/g,'&quot;')+'"/></div></div><div class="fg"><label>Description</label><input type="text" class="fi" id="np-'+pg.key+'-desc" placeholder="'+pg.desc+'" value="'+(d.desc||'').replace(/"/g,'&quot;')+'"/></div></div>';}).join('');}
  if(tab==='contact'){var cp=ldRaw('nukala_contactpage2')||{};document.getElementById('pe-cname').value=cp.contactName||'';document.getElementById('pe-cemail').value=cp.contactEmail||'';document.getElementById('pe-formspree').value=cp.formspree||'';document.getElementById('pe-droptions').value=(cp.dropdownOptions||['Add a family member','Submit a photo','Share a story','Other']).join('\n');}
  if(tab==='gallery'){var gp=ldRaw('nukala_gallerypage2')||{};document.getElementById('pe-galcats').value=(gp.categories||['All Photos','Family','Vintage','Celebrations','Travel','Other']).join('\n');}
  if(tab==='fonts'){var ty=ldRaw('nukala_typography')||{},s2=ld('settings');document.getElementById('pe-fonthead').value=ty.headFont||s2.headFont||'Cormorant Garamond';document.getElementById('pe-fontbody').value=ty.bodyFont||s2.bodyFont||'Jost';}
  if(tab==='map'){
    var ms=ldRaw('nukala_map_settings')||{};
    var defType=ms.defaultType||'street';
    document.querySelectorAll('input[name="defaultMapType"]').forEach(function(r){r.checked=(r.value===defType);});
    document.getElementById('mapDefaultZoom').value=ms.zoom||'';
    document.getElementById('mapCentLat').value=ms.lat||'';
    document.getElementById('mapCentLng').value=ms.lng||'';
    // Marker categories (colour pickers now inside category rows)
    renderMapCatList();
    // Visibility checkboxes
    var vis=ms.vis||{};
    document.getElementById('mapShowInteractiveMap').checked=vis.interactiveMap!==false;
    document.getElementById('mapShowMemberChips').checked=vis.memberChips!==false;
    document.getElementById('mapShowNearby').checked=vis.nearby!==false;
    document.getElementById('mapShowGeoBreakdown').checked=vis.geoBreakdown!==false;
    document.getElementById('mapShowContributeBar').checked=vis.contributeBar!==false;
  }
}


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MAP SETTINGS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
document.getElementById('saveMapVisBtn').addEventListener('click', function(){
  var ms = ldRaw('nukala_map_settings')||{};
  ms.vis = {
    interactiveMap: document.getElementById('mapShowInteractiveMap').checked,
    memberChips:    document.getElementById('mapShowMemberChips').checked,
    nearby:         document.getElementById('mapShowNearby').checked,
    geoBreakdown:   document.getElementById('mapShowGeoBreakdown').checked,
    contributeBar:  document.getElementById('mapShowContributeBar').checked,
  };
  svRaw('nukala_map_settings', ms);
  log('Map visibility saved');
  toast('✅ Map visibility saved! Publish to Site to apply.');
});

document.getElementById('saveMapTypeBtn').addEventListener('click', function(){
  var ms = ldRaw('nukala_map_settings')||{};
  var sel = document.querySelector('input[name="defaultMapType"]:checked');
  if(sel) ms.defaultType = sel.value;
  svRaw('nukala_map_settings', ms);
  log('Map type saved');
  toast('✅ Default map style saved! Publish to Site to apply.');
});

document.getElementById('saveMapZoomBtn').addEventListener('click', function(){
  var ms = ldRaw('nukala_map_settings')||{};
  ms.zoom = document.getElementById('mapDefaultZoom').value.trim();
  ms.lat  = document.getElementById('mapCentLat').value.trim();
  ms.lng  = document.getElementById('mapCentLng').value.trim();
  svRaw('nukala_map_settings', ms);
  log('Map zoom saved');
  toast('✅ Zoom & centre saved! Publish to Site to apply.');
});


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MAP MARKER CATEGORIES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
var DEFAULT_MAP_CATS = [
  { id:'male',     label:'Male',     color:'#5c7a5c', shape:'circle',  builtin:true  },
  { id:'female',   label:'Female',   color:'#9060b0', shape:'diamond', builtin:true  },
  { id:'ancestor', label:'Ancestor', color:'#c9a84c', shape:'star',    builtin:true  },
];

var MAP_SHAPES = ['circle','diamond','square','star','triangle','pentagon'];

function getMapCats(){
  var ms = ldRaw('nukala_map_settings')||{};
  return ms.categories || JSON.parse(JSON.stringify(DEFAULT_MAP_CATS));
}

function drawMapCatRow(cat, idx){
  var shapeOpts = MAP_SHAPES.map(function(s){
    return '<option value="'+s+'"'+(cat.shape===s?' selected':'')+'>'+s.charAt(0).toUpperCase()+s.slice(1)+'</option>';
  }).join('');
  return '<div class="map-cat-row" data-catidx="'+idx+'" style="display:flex;align-items:center;gap:8px;padding:10px;background:var(--cream);border:1px solid var(--b);border-radius:10px;flex-wrap:wrap;">'
    +'<input type="color" class="mcat-color" value="'+cat.color+'" title="Colour" style="width:38px;height:32px;border:1.5px solid var(--b);border-radius:7px;cursor:pointer;padding:2px;flex-shrink:0;"/>'
    +'<input type="text" class="fi mcat-label" value="'+cat.label+'" placeholder="Category name"'+(cat.builtin?' readonly style="background:#f8f8f8;width:110px;"':' style="width:110px;"')+'/>'
    +'<select class="fi mcat-shape" style="width:110px;">'+ shapeOpts +'</select>'
    +'<span style="font-size:.7rem;color:var(--tl);flex:1;min-width:80px;">'+(cat.builtin?'Built-in (matches '+cat.label.toLowerCase()+' members)':'Matches members whose Role contains this label')+'</span>'
    +(!cat.builtin?'<button class="btn bo bsm mcat-del" data-idx="'+idx+'" style="color:#c00;border-color:#c00;flex-shrink:0;">&#10005;</button>':'')
    +'</div>';
}

function renderMapCatList(){
  var cats = getMapCats();
  var el = document.getElementById('mapCatList');
  if(!el) return;
  el.innerHTML = cats.map(function(cat, idx){ return drawMapCatRow(cat, idx); }).join('');
  // Delete handlers
  el.querySelectorAll('.mcat-del').forEach(function(btn){
    btn.addEventListener('click', function(){
      var idx = parseInt(this.getAttribute('data-idx'));
      var cats = getMapCats();
      cats.splice(idx, 1);
      var ms = ldRaw('nukala_map_settings')||{};
      ms.categories = cats;
      svRaw('nukala_map_settings', ms);
      renderMapCatList();
    });
  });
}

document.getElementById('mapAddCatBtn').addEventListener('click', function(){
  var cats = getMapCats();
  cats.push({ id:'custom_'+Date.now(), label:'', color:'#5c7a5c', shape:'circle', builtin:false });
  var ms = ldRaw('nukala_map_settings')||{};
  ms.categories = cats;
  svRaw('nukala_map_settings', ms);
  renderMapCatList();
  // Focus the new label input
  var rows = document.querySelectorAll('.mcat-label');
  if(rows.length) rows[rows.length-1].focus();
});

document.getElementById('saveMapColoursBtn').addEventListener('click', function(){
  var rows = document.querySelectorAll('.map-cat-row');
  var cats = getMapCats();
  rows.forEach(function(row, i){
    var color = row.querySelector('.mcat-color').value;
    var label = row.querySelector('.mcat-label').value.trim();
    var shape = row.querySelector('.mcat-shape').value;
    if(cats[i]){
      cats[i].color = color;
      if(!cats[i].builtin && label) cats[i].label = label;
      cats[i].shape = shape;
    }
  });
  var ms = ldRaw('nukala_map_settings')||{};
  ms.categories = cats;
  // Also keep legacy keys for backward compat
  cats.forEach(function(c){
    if(c.id==='male')     ms.colMale=c.color;
    if(c.id==='female')   ms.colFemale=c.color;
    if(c.id==='ancestor') ms.colAncestor=c.color;
  });
  svRaw('nukala_map_settings', ms);
  log('Map marker categories saved');
  toast('&#x2705; Marker settings saved! Publish to Site to apply.');
  renderMapCatList();
});


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// STATS PAGE ADMIN CONTROLS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
var STAT_VIS_KEYS = ['total','gens','living','bybirth','families','female','male','photos','cities','genchart','connfamilies','locations','insights'];

var STAT_EMOJI_DEFAULTS = {
  total:'🌳',gens:'🏛️',living:'💚',bybirth:'📖',families:'👥',
  female:'👩',male:'👨',photos:'📸',cities:'🌍',genchart:'📊',
  connfamilies:'👥',locations:'🌍',insights:'🏆'
};

function loadStatsAdmin(){
  // Load saved visibility
  var sv  = ldRaw('nukala_stats_vis')||{};
  var se  = ldRaw('nukala_stats_emoji')||{};
  STAT_VIS_KEYS.forEach(function(k){
    var vel = document.getElementById('stv-'+k);
    if(vel) vel.checked = sv[k] !== false;
    var eel = document.getElementById('ste-'+k);
    if(eel) eel.value = se[k] || STAT_EMOJI_DEFAULTS[k] || '📊';
  });
  // Load custom stats
  renderCustomStatsList();
}

document.getElementById('saveStatsVisBtn').addEventListener('click', function(){
  var sv = {}, se = {};
  STAT_VIS_KEYS.forEach(function(k){
    var vel = document.getElementById('stv-'+k);
    var eel = document.getElementById('ste-'+k);
    sv[k] = vel ? vel.checked : true;
    if(eel && eel.value.trim()) se[k] = eel.value.trim();
  });
  svRaw('nukala_stats_vis', sv);
  svRaw('nukala_stats_emoji', se);
  log('Stats visibility saved');
  toast('✅ Stats visibility & emojis saved! Publish to Site to apply.');
});

// Custom stats
function renderCustomStatsList(){
  var customs = ldRaw('nukala_custom_stats')||[];
  var el = document.getElementById('customStatsList');
  if(!el) return;
  if(!customs.length){
    el.innerHTML = '<div style="font-size:.78rem;color:var(--tl);padding:8px 0;">No custom stats yet. Click + Add Custom Stat below.</div>';
    return;
  }
  el.innerHTML = customs.map(function(cs, i){
    return '<div style="display:flex;gap:8px;align-items:center;padding:8px;background:var(--cream);border:1px solid var(--b);border-radius:10px;">'
      +'<div style="font-size:1.2rem;width:30px;text-align:center;flex-shrink:0;">'
        +'<input type="text" class="fi cs-icon" data-idx="'+i+'" value="'+(cs.icon||'📊')+'" style="width:36px;text-align:center;font-size:1.1rem;padding:4px;"/>'
      +'</div>'
      +'<input type="text" class="fi cs-label" data-idx="'+i+'" value="'+(cs.label||'')+'" placeholder="Label e.g. Years of Legacy" style="flex:1;"/>'
      +'<input type="text" class="fi cs-value" data-idx="'+i+'" value="'+(cs.value||'')+'" placeholder="Value e.g. 100" style="width:80px;"/>'
      +'<button class="btn bo bsm cs-del" data-idx="'+i+'" style="color:#c00;border-color:#c00;flex-shrink:0;">✕</button>'
      +'</div>';
  }).join('');
  // Delete handlers
  el.querySelectorAll('.cs-del').forEach(function(btn){
    btn.addEventListener('click', function(){
      var idx = parseInt(this.getAttribute('data-idx'));
      var customs = ldRaw('nukala_custom_stats')||[];
      customs.splice(idx, 1);
      svRaw('nukala_custom_stats', customs);
      renderCustomStatsList();
    });
  });
}

document.getElementById('addCustomStatBtn').addEventListener('click', function(){
  var customs = ldRaw('nukala_custom_stats')||[];
  customs.push({icon:'📊', label:'', value:''});
  svRaw('nukala_custom_stats', customs);
  renderCustomStatsList();
  // Focus new label
  var inputs = document.querySelectorAll('.cs-label');
  if(inputs.length) inputs[inputs.length-1].focus();
});

document.getElementById('saveCustomStatsBtn').addEventListener('click', function(){
  var customs = [];
  document.querySelectorAll('#customStatsList > div').forEach(function(row){
    var icon  = (row.querySelector('.cs-icon')||{}).value||'📊';
    var label = (row.querySelector('.cs-label')||{}).value.trim();
    var value = (row.querySelector('.cs-value')||{}).value.trim();
    if(label) customs.push({icon:icon, label:label, value:value});
  });
  svRaw('nukala_custom_stats', customs);
  log('Custom stats saved');
  toast('✅ Custom stats saved! Publish to Site to apply.');
  renderCustomStatsList();
});


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TREE COLOURS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
var TREE_COLOUR_DEFAULTS = {
  ancestor:     '#c9a84c',
  male:         '#8aab8a',
  female:       '#9060b0',
  mainLine:     '#8aab8a',
  spouseLine:   '#c9a84c',
  femaleBranch: '#c06090',
  spouseHeart:  '💛',
  femaleHeart:  '🌸'
};

function loadTreeColours(){
  var tc = ldRaw('nukala_tree_colours') || {};
  Object.keys(TREE_COLOUR_DEFAULTS).forEach(function(k){
    var el = document.getElementById('tc-'+k);
    if(el) el.value = tc[k] || TREE_COLOUR_DEFAULTS[k];
  });
  // Load mobile settings
  var tm = ldRaw('nukala_tree_mobile')||{};
  var af = document.getElementById('tm-autofit');   if(af) af.checked = tm.autoFit  !== false;
  var cp = document.getElementById('tm-compact');   if(cp) cp.checked = tm.compact  !== false;
  var lv = document.getElementById('tm-listview');  if(lv) lv.checked = tm.listView !== false;
}

document.getElementById('saveTreeColoursBtn').addEventListener('click', function(){
  var tc = {};
  Object.keys(TREE_COLOUR_DEFAULTS).forEach(function(k){
    var el = document.getElementById('tc-'+k);
    if(el) tc[k] = el.value;
  });
  svRaw('nukala_tree_colours', tc);
  log('Tree colours saved');
  toast('\u2705 Tree colours saved! Publish to Site to apply.');
});

document.getElementById('resetTreeColoursBtn').addEventListener('click', function(){
  svRaw('nukala_tree_colours', TREE_COLOUR_DEFAULTS);
  loadTreeColours();
  toast('✅ Reset to default colours! Publish to Site to apply.');
});

document.getElementById('saveMobileTreeBtn').addEventListener('click', function(){
  var tm = {
    autoFit:  document.getElementById('tm-autofit').checked,
    compact:  document.getElementById('tm-compact').checked,
    listView: document.getElementById('tm-listview').checked,
  };
  svRaw('nukala_tree_mobile', tm);
  log('Tree mobile settings saved');
  toast('✅ Mobile settings saved! Publish to Site to apply.');
});

// Also hook into the ptb click for the tree tab
document.querySelectorAll('.ptb[data-tab="tree"]').forEach(function(btn){
  btn.addEventListener('click', loadTreeColours);
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ANALYTICS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
var PNAMES={'home.html':'Home','tree.html':'Family Tree','gallery.html':'Gallery','history.html':'History','facts.html':'Facts','stats.html':'Stats','events.html':'Events','contact.html':'Contact','index.html':'Login','qr.html':'Share','map.html':'Map','polls.html':'Polls','recipes.html':'Recipes'};
var PEMOJI={'home.html':'🏠','tree.html':'🌳','gallery.html':'🖼️','history.html':'📜','facts.html':'🌟','stats.html':'📊','events.html':'📆','contact.html':'✉️','index.html':'🔐','qr.html':'📱','map.html':'🗺️','polls.html':'🗳️','recipes.html':'🍛'};

document.getElementById('an-filter').addEventListener('change', renderAnalytics);
document.getElementById('expVisBtn').addEventListener('click',function(){dlCsv([['IP','Country','City','ISP','Device','Browser','Visits','Pages','First','Last']].concat(lda('visitors').map(function(v){return[v.ip,v.country,v.city,v.isp,v.device,v.browser,v.visits,(v.pages||[]).join('|'),v.firstSeen,v.lastSeen];})),'nukala-visitors.csv');toast('Exported!');});
document.getElementById('expAnBtn').addEventListener('click',function(){dlCsv([['Page','Date','Time','IP','Country','City','Device','Browser']].concat(lda('visits').map(function(v){return[v.page,v.date,v.time,v.ip||'',v.country||'',v.city||'',v.device||'',v.browser||''];})),'nukala-analytics.csv');toast('Exported!');});
document.getElementById('clrAnBtn').addEventListener('click',function(){if(!confirm('Clear ALL analytics?'))return;['visits','visitors','logins','sessions','pagecounts'].forEach(function(k){sv(k,[]);});localStorage.removeItem('nukala_login_count');renderAnalytics();toast('Cleared.');});

function renderAnalytics(){
  var visits=lda('visits'),visitors=lda('visitors'),sessions=lda('sessions'),logins=lda('logins');
  var today=new Date().toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'});
  document.getElementById('an-logins').textContent=parseInt(localStorage.getItem('nukala_login_count')||'0')||logins.length;
  document.getElementById('an-visits').textContent=visits.length;
  document.getElementById('an-sessions').textContent=sessions.length;
  document.getElementById('an-unique').textContent=visitors.length;
  document.getElementById('an-today').textContent=visits.filter(function(v){return v.date===today;}).length;
  var tbody=document.getElementById('an-vbody');
  tbody.innerHTML=!visitors.length?'<tr><td colspan="9" style="padding:20px;text-align:center;color:var(--tl);">No visitors yet.</td></tr>':[...visitors].reverse().map(function(v){return '<tr style="border-bottom:1px solid var(--b)"><td style="font-family:monospace;font-size:.7rem;">'+v.ip+'</td><td style="font-size:.7rem;">'+(v.city?v.city+', ':'')+v.country+'</td><td style="font-size:.7rem;">'+v.isp+'</td><td style="font-size:.7rem;">'+v.device+'</td><td style="font-size:.7rem;">'+v.browser+'</td><td style="font-weight:600;color:var(--sd);">'+(v.visits||1)+'</td><td style="font-size:.7rem;">'+(v.pages||[]).map(function(p){return PNAMES[p]||p;}).join(', ')+'</td><td style="font-size:.7rem;">'+v.firstSeen+'</td><td style="font-size:.7rem;">'+v.lastSeen+'</td></tr>';}).join('');
  var counts=ldRaw('nukala_page_counts')||{},sorted=Object.entries(counts).sort(function(a,b){return b[1]-a[1];}).slice(0,6),maxC=sorted[0]?sorted[0][1]:1;
  document.getElementById('an-pages').innerHTML=!sorted.length?'<span style="color:var(--tl);font-size:.78rem;">No data yet.</span>':sorted.map(function(e){return '<div style="margin-bottom:8px;"><div style="display:flex;justify-content:space-between;font-size:.74rem;margin-bottom:2px;"><span>'+(PEMOJI[e[0]]||'📄')+' '+(PNAMES[e[0]]||e[0])+'</span><span style="font-weight:600;color:var(--sd);">'+e[1]+'</span></div><div style="background:var(--sl);border-radius:20px;height:7px;"><div style="background:linear-gradient(to right,var(--sd),var(--s));border-radius:20px;height:100%;width:'+Math.round(e[1]/maxC*100)+'%;"></div></div></div>';}).join('');
  document.getElementById('an-logslist').innerHTML=!logins.length?'<span style="color:var(--tl);font-size:.78rem;">No logins yet.</span>':[...logins].reverse().slice(0,6).map(function(l,i){return '<div style="display:flex;gap:8px;padding:6px 0;border-bottom:1px solid var(--b);font-size:.76rem;align-items:center;">🔐<div><div style="font-weight:500;">Login #'+(logins.length-i)+'</div><div style="color:var(--tl);">'+l.date+' at '+l.time+'</div></div></div>';}).join('');
  var filter=document.getElementById('an-filter').value,filtered=filter==='all'?visits:visits.filter(function(v){return v.page===filter;});
  document.getElementById('an-log').innerHTML=!filtered.length?'<div style="text-align:center;padding:20px;color:var(--tl);">No visits yet.</div>':[...filtered].reverse().slice(0,150).map(function(v){return '<div style="display:grid;grid-template-columns:24px 1fr auto;gap:8px;padding:7px 0;border-bottom:1px solid var(--b);font-size:.74rem;">'+(PEMOJI[v.page]||'📄')+'<div><div style="font-weight:500;">'+(PNAMES[v.page]||v.page)+'</div><div style="color:var(--tl);">'+(v.ip&&v.ip!=='Fetching...'?'🌐 '+v.ip+' ':'')+(v.city?'📍 '+v.city+' ':'')+(v.device?'· '+v.device:'')+'</div></div><div style="color:var(--tl);font-size:.68rem;text-align:right;">'+v.date+'<br/>'+v.time+'</div></div>';}).join('');
}

function dlCsv(rows,name){var csv=rows.map(function(r){return r.map(function(c){return '"'+String(c||'').replace(/"/g,'""')+'"';}).join(',');}).join('\n');var a=document.createElement('a');a.href=URL.createObjectURL(new Blob([csv],{type:'text/csv'}));a.download=name;a.click();}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// SETTINGS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function toggleSiteLogin(enabled){localStorage.setItem('nukala_login_disabled',enabled?'0':'1');document.getElementById('loginToggleTrack').style.background=enabled?'#5c7a5c':'#ccc';document.getElementById('loginToggleThumb').style.transform=enabled?'translateX(20px)':'translateX(0)';document.getElementById('loginToggleLabel').textContent=enabled?'Enabled':'Disabled';document.getElementById('loginToggleLabel').style.color=enabled?'var(--sd)':'var(--r)';toast(enabled?'Site login enabled!':'Site login disabled!');}


function toggleTreeDownload(on){
  var s=ld('settings');
  s.showTreeDownload=on;
  sv('settings',s);
  document.getElementById('treeDownloadTrack').style.background=on?'#5c7a5c':'#ccc';
  document.getElementById('treeDownloadThumb').style.transform=on?'translateX(20px)':'translateX(0)';
  document.getElementById('treeDownloadLabel').textContent=on?'Visible':'Hidden';
  document.getElementById('treeDownloadLabel').style.color=on?'var(--sd)':'var(--r)';
  toast(on?'✅ Download button now visible on tree page — Publish to apply.':'Download button hidden from tree page — Publish to apply.');
}
function loadSettings(){
  var s=ld('settings');
  document.getElementById('s-famname').value=s.familyName||'';
  document.getElementById('s-adminwa').value=s.adminWhatsapp||'';
  document.getElementById('s-adminemail').value=s.adminEmail||'';
  if(document.getElementById('s-showTreeDl')) document.getElementById('s-showTreeDl').checked=!!s.showTreeDownload;
  document.getElementById('s-footer').value=s.footerText||'';
  var disabled=localStorage.getItem('nukala_login_disabled')==='1';
  document.getElementById('loginToggle').checked=!disabled;
  document.getElementById('loginToggleTrack').style.background=disabled?'#ccc':'#5c7a5c';
  document.getElementById('loginToggleThumb').style.transform=disabled?'translateX(0)':'translateX(20px)';
  document.getElementById('loginToggleLabel').textContent=disabled?'Disabled':'Enabled';
  document.getElementById('loginToggleLabel').style.color=disabled?'var(--r)':'var(--sd)';
  // Tree download toggle
  var tdl = document.getElementById('treeDownloadToggle');
  var showDl = s.showTreeDownload===true;
  if(tdl){ 
    tdl.checked=showDl;
    document.getElementById('treeDownloadTrack').style.background=showDl?'#5c7a5c':'#ccc';
    document.getElementById('treeDownloadThumb').style.transform=showDl?'translateX(20px)':'translateX(0)';
    document.getElementById('treeDownloadLabel').textContent=showDl?'Visible':'Hidden';
    document.getElementById('treeDownloadLabel').style.color=showDl?'var(--sd)':'var(--r)';
  }
}
document.getElementById('saveSettingsBtn').addEventListener('click',function(){var s=ld('settings');s.familyName=document.getElementById('s-famname').value.trim();
  s.adminWhatsapp=document.getElementById('s-adminwa').value.trim();
  s.adminEmail=document.getElementById('s-adminemail').value.trim();s.footerText=document.getElementById('s-footer').value.trim();s.showTreeDownload=document.getElementById('treeDownloadToggle').checked;sv('settings',s);if(s.familyName)document.getElementById('siteName').textContent=s.familyName;log('Settings saved');toast('Settings saved!');});
document.getElementById('saveSitePassBtn').addEventListener('click',function(){var p=document.getElementById('newSitePass').value.trim();if(!p){alert('Enter a password.');return;}localStorage.setItem('nukala_site_pass',p);document.getElementById('newSitePass').value='';log('Site pass updated');toast('Site password updated!');});
document.getElementById('saveAdminPassBtn').addEventListener('click',function(){var p=document.getElementById('newAdminPass').value.trim();if(!p){alert('Enter a password.');return;}localStorage.setItem('nukala_admin_pass',p);document.getElementById('newAdminPass').value='';log('Admin pass updated');toast('Admin password updated!');});
document.getElementById('expAllBtn2').addEventListener('click', expAll);
document.getElementById('impAllBtn2').addEventListener('click',function(){openM('importModal');});
document.getElementById('resetAllBtn').addEventListener('click',function(){if(!confirm('Delete ALL data permanently?'))return;Object.values(LS).forEach(function(k){localStorage.removeItem(k);});renderDash();toast('All data reset.');});
document.getElementById('doImportBtn').addEventListener('click',function(){try{var parsed=JSON.parse(document.getElementById('impData').value.trim());Object.keys(LS).forEach(function(k){if(parsed[k]!==undefined&&parsed[k]!==null)localStorage.setItem(LS[k],JSON.stringify(parsed[k]));});closeM('importModal');renderDash();toast('Data imported!');}catch(e){alert('Invalid JSON. Check the file and try again.');}});

function expAll(){var data={};Object.keys(LS).forEach(function(k){data[k]=JSON.parse(localStorage.getItem(LS[k])||'null');});var a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'}));a.download='nukala-backup-'+Date.now()+'.json';a.click();toast('Backup exported!');}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// PAGE NAMES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
var DEFAULT_NAV_PAGES = [
  {id:'home',     href:'home.html',    label:'Home',        locked:true},
  {id:'tree',     href:'tree.html',    label:'Family Tree', locked:true},
  {id:'members',  href:'members.html', label:'Family Members', locked:false},
  {id:'history',  href:'history.html', label:'History',     locked:false},
  {id:'gallery',  href:'gallery.html', label:'Gallery',     locked:false},
  {id:'facts',    href:'facts.html',   label:'Facts',       locked:false},
  {id:'stats',    href:'stats.html',   label:'Stats',       locked:false},
  {id:'events',   href:'events.html',  label:'Events',      locked:false},
  {id:'map',      href:'map.html',     label:'Map',         locked:false},
  {id:'polls',    href:'polls.html',   label:'Polls',       locked:false},
  {id:'recipes',  href:'recipes.html', label:'Recipes',     locked:false},
  {id:'qr',       href:'qr.html',      label:'QR Code',    locked:false},
  {id:'contact',  href:'contact.html', label:'Contact',     locked:false},
  {id:'join',     href:'join.html',    label:'Join Tree',   locked:false},
  {id:'about',    href:'about.html',   label:'About',       locked:false},
];

function getNavPages(){
  // Always returns pages in navmenu saved order, or DEFAULT order if none saved
  // Filters out any pages no longer in DEFAULT_NAV_PAGES (e.g. removed achievements/videos)
  var saved = ldRaw('nukala_navmenu');
  var defMap = {};
  DEFAULT_NAV_PAGES.forEach(function(p){ defMap[p.href] = p; });
  var result = [];
  if(saved && saved.items && saved.items.length){
    saved.items.forEach(function(item){
      // Skip pages that are no longer in DEFAULT (removed pages)
      if(!defMap[item.href]) return;
      var def = defMap[item.href];
      result.push({href:item.href, label:item.label||def.label||item.href, locked:!!def.locked, active:item.active!==false});
    });
    // Add any pages in DEFAULT that are missing from saved navmenu
    DEFAULT_NAV_PAGES.forEach(function(p){
      if(!result.find(function(r){ return r.href===p.href; })){
        result.push({href:p.href, label:p.label, locked:p.locked, active:true});
      }
    });
  } else {
    DEFAULT_NAV_PAGES.forEach(function(p){
      result.push({href:p.href, label:p.label, locked:p.locked, active:true});
    });
  }
  return result;
}

// In-memory state for page names editor — avoids localStorage race conditions
var _pnPages = null;

function renderPageNames(){
  // Always reload from storage when first opening
  _pnPages = getNavPages();
  _drawPageNames();
}

function renderPageNamesPreview(pages){
  var el = document.getElementById('pnPreview');
  if(!el || !pages) return;
  el.innerHTML = pages.map(function(p){
    return '<span style="padding:4px 10px;border-radius:20px;font-size:.71rem;font-weight:500;background:#c8ddc8;color:#5c7a5c;display:inline-block;margin:2px;">'+p.label+'</span>';
  }).join('');
}

function _drawPageNames(){
  var pages = _pnPages;
  var el = document.getElementById('pageNamesEditor');
  if(!el || !pages) return;
  var rows = pages.map(function(p,i){
    var upOp = i===0               ? 'opacity:.25;cursor:not-allowed;' : '';
    var dnOp = i===pages.length-1  ? 'opacity:.25;cursor:not-allowed;' : '';
    var upDis = i===0               ? 'disabled' : '';
    var dnDis = i===pages.length-1  ? 'disabled' : '';
    var base  = 'background:var(--w);border:1.5px solid var(--b);border-radius:6px;width:30px;height:26px;cursor:pointer;font-size:.75rem;line-height:1;padding:0;color:var(--td);';
    return '<div style="display:flex;align-items:center;gap:8px;padding:10px 0;border-bottom:1px solid var(--b);">'
      +'<div style="display:flex;flex-direction:column;gap:3px;flex-shrink:0;">'
      +'<button class="pn-up" data-i="'+i+'" '+upDis+' style="'+base+upOp+'">▲</button>'
      +'<button class="pn-dn" data-i="'+i+'" '+dnDis+' style="'+base+dnOp+'">▼</button>'
      +'</div>'
      +'<div style="width:115px;font-size:.72rem;color:var(--tl);flex-shrink:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">'+p.href+'</div>'
      +'<input type="text" class="fi" id="pn-'+i+'" value="'+p.label.replace(/"/g,'&quot;')+'" placeholder="'+p.label+'" '+(p.locked?'disabled ':'')+' style="flex:1;padding:7px 11px;'+(p.locked?'opacity:.5;cursor:not-allowed;':'')+'">'
      +(p.locked?'<span style="font-size:.65rem;color:var(--tl);flex-shrink:0;padding:0 4px;">core</span>':'')
      +'</div>';
  }).join('');
  el.innerHTML = rows;
  // Single event listener on the container — never breaks on re-render
  el.onclick = function(e){
    var btn = e.target;
    if(btn.tagName!=='BUTTON') btn = btn.closest('button');
    if(!btn) return;
    var idx = parseInt(btn.getAttribute('data-i'));
    if(isNaN(idx)) return;
    if(btn.classList.contains('pn-up') && !btn.disabled) _pnSwap(idx, idx-1);
    if(btn.classList.contains('pn-dn') && !btn.disabled) _pnSwap(idx, idx+1);
  };
  renderPageNamesPreview(pages);
}

function _pnSwap(a, b){
  if(!_pnPages || a<0 || b<0 || a>=_pnPages.length || b>=_pnPages.length) return;
  // Read current label values before swap so edits are preserved
  var elA = document.getElementById('pn-'+a);
  var elB = document.getElementById('pn-'+b);
  if(elA && !_pnPages[a].locked) _pnPages[a].label = elA.value||_pnPages[a].label;
  if(elB && !_pnPages[b].locked) _pnPages[b].label = elB.value||_pnPages[b].label;
  // Swap in memory only
  var tmp = _pnPages[a]; _pnPages[a] = _pnPages[b]; _pnPages[b] = tmp;
  _drawPageNames();
}

document.getElementById('savePageNamesBtn').addEventListener('click', function(){
  if(!_pnPages) _pnPages = getNavPages();
  // Collect any edited labels
  _pnPages.forEach(function(p,i){
    var inp = document.getElementById('pn-'+i);
    if(inp && !p.locked) p.label = inp.value.trim()||p.label;
  });
  // Save order + labels to navmenu (active defaults to true if not set)
  var items = _pnPages.map(function(p){
    return {href:p.href, label:p.label, active:p.active===false?false:true};
  });
  svRaw('nukala_navmenu', {items:items});
  log('Page names and order saved');
  toast('✅ Order & labels saved! Now click 🌐 Publish to Site in the sidebar to apply to all family members.');
  renderPageNamesPreview(_pnPages);
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// LOGIN PAGE EDITOR
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
function loadLoginPageEditor(){
  var lp = ldRaw('nukala_loginpage')||{};
  document.getElementById('lpe-title').value    = lp.title||'';
  document.getElementById('lpe-subtitle').value = lp.subtitle||'';
  document.getElementById('lpe-tagline').value  = lp.tagline||'';
  document.getElementById('lpe-label').value    = lp.label||'';
  document.getElementById('lpe-btn').value      = lp.btnText||'';
  document.getElementById('lpe-divider').value  = lp.dividerText||'';
  document.getElementById('lpe-footnote').value = lp.footnote||'';
  document.getElementById('lpe-bg').value       = lp.bgColor||'';
  if(lp.fontSize) document.getElementById('lpe-fontsize').value = lp.fontSize;
  if(lp.bgColor){
    document.getElementById('lpe-bg-custom').value = lp.bgColor;
    var prev = document.getElementById('lpe-theme-preview');
    if(prev){ prev.style.background=lp.bgColor; prev.textContent=''; }
  }
  // Highlight active theme preset
  document.querySelectorAll('.lpe-theme-btn').forEach(function(b){
    b.style.outline = b.getAttribute('data-lpe-theme')===(lp.activeTheme||'') ? '2px solid var(--sd)' : '';
  });
}

document.getElementById('saveLoginPageBtn').addEventListener('click', function(){
  var bgVal = document.getElementById('lpe-bg').value.trim() ||
              document.getElementById('lpe-bg-custom').value.trim();
  var lp = {
    title:       document.getElementById('lpe-title').value.trim(),
    subtitle:    document.getElementById('lpe-subtitle').value.trim(),
    tagline:     document.getElementById('lpe-tagline').value.trim(),
    label:       document.getElementById('lpe-label').value.trim(),
    btnText:     document.getElementById('lpe-btn').value.trim(),
    dividerText: document.getElementById('lpe-divider').value.trim(),
    footnote:    document.getElementById('lpe-footnote').value.trim(),
    bgColor:     bgVal,
    fontSize:    document.getElementById('lpe-fontsize').value.trim(),
    activeTheme: (document.querySelector('.lpe-theme-btn[style*="2px solid"]')||{}).getAttribute&&(document.querySelector('.lpe-theme-btn[style*="2px solid"]')).getAttribute('data-lpe-theme')||'',
  };
  svRaw('nukala_loginpage', lp);
  log('Login page customised');
  toast('✅ Login page saved! Click Preview to see changes.');
});



// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// LOGIN PAGE THEME PRESETS + FONT SIZE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
var LPE_THEMES = {
  classic: { bg: 'linear-gradient(135deg,#faf8f4 0%,#f0f5f0 100%)',  accent: '#5c7a5c' },
  gold:    { bg: 'linear-gradient(135deg,#fdf6e8 0%,#f5e8b0 100%)',  accent: '#c9a84c' },
  navy:    { bg: 'linear-gradient(135deg,#0f1f3d 0%,#1a3a6c 100%)',  accent: '#5090d0' },
  rose:    { bg: 'linear-gradient(135deg,#fdf0f2 0%,#f0d0d8 100%)',  accent: '#c06080' },
  dark:    { bg: 'linear-gradient(135deg,#1a1a2e 0%,#16213e 100%)',  accent: '#7090d0' },
  sand:    { bg: 'linear-gradient(135deg,#f5f0e8 0%,#ede5d5 100%)',  accent: '#8a6a40' },
};

document.querySelectorAll('.lpe-theme-btn').forEach(function(btn){
  btn.addEventListener('click', function(){
    var key = this.getAttribute('data-lpe-theme');
    var customWrap = document.getElementById('lpe-custom-bg-wrap');
    var prev = document.getElementById('lpe-theme-preview');
    document.querySelectorAll('.lpe-theme-btn').forEach(function(b){ b.style.outline=''; });
    this.style.outline = '2px solid var(--sd)';
    if(key === 'custom'){
      if(customWrap) customWrap.style.display = 'block';
      return;
    }
    if(customWrap) customWrap.style.display = 'none';
    var theme = LPE_THEMES[key];
    if(!theme) return;
    document.getElementById('lpe-bg').value = theme.bg;
    if(prev){ prev.style.background=theme.bg; prev.style.backgroundSize='cover'; prev.textContent=''; }
  });
});

document.getElementById('lpe-bg-custom').addEventListener('input', function(){
  var val = this.value.trim();
  document.getElementById('lpe-bg').value = val;
  var prev = document.getElementById('lpe-theme-preview');
  if(prev && val){ prev.style.background=val; prev.style.backgroundSize='cover'; prev.textContent=''; }
});

document.querySelectorAll('.lpe-size-btn').forEach(function(btn){
  btn.addEventListener('click', function(){
    document.getElementById('lpe-fontsize').value = this.getAttribute('data-lpe-size');
    document.querySelectorAll('.lpe-size-btn').forEach(function(b){ b.style.background=''; b.style.color=''; });
    this.style.background = 'var(--sd)'; this.style.color = 'white';
  });
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// PUBLISH TO SITE — generates site-data.js for cross-device sharing
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
document.getElementById('publishBtn').addEventListener('click', function(){
  var KEYS = [
    'nukala_tree_data','nukala_gallery','nukala_history','nukala_facts',
    'nukala_events','nukala_recipes','nukala_achievements','nukala_videos',
    'nukala_polls','nukala_contacts','nukala_settings','nukala_page_vis',
    'nukala_sitewide','nukala_home','nukala_heropage','nukala_newpages',
    'nukala_contactpage2','nukala_gallerypage2','nukala_typography',
    'nukala_navmenu','nukala_loginpage','nukala_wishes','nukala_about','nukala_about'
  ];
  var DATA = {};
  KEYS.forEach(function(k){
    var v = localStorage.getItem(k);
    if(v) try{ DATA[k] = JSON.parse(v); } catch(e){}
  });

  var ts = new Date().toLocaleString();
  var content='/* Published:'+ts+' — upload site-data.js to GitHub */(function(){var D='+JSON.stringify(DATA)+';Object.keys(D).forEach(function(k){localStorage.setItem(k,JSON.stringify(D[k]));});})();';

  var blob = new Blob([content], {type:'application/javascript'});
  var a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'site-data.js';
  a.click();

  toast('✅ site-data.js downloaded! Now: go to GitHub → your repo → upload this file → replace existing site-data.js → commit. All devices will see your changes within 1-2 minutes.');
  log('Published site-data.js — ' + ts);
});


// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TODAY'S OCCASIONS & WHATSAPP WISHES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
var MONTHS_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
var MONTHS_LONG  = ['January','February','March','April','May','June','July','August','September','October','November','December'];

// Populate day dropdown
(function(){
  var sel = document.getElementById('wishDay');
  if(sel){for(var d=1;d<=31;d++){var o=document.createElement('option');o.value=d;o.textContent=d;sel.appendChild(o);}}
})();

function getWishes(){ return ldRaw('nukala_wishes')||[]; }
function svWishes(w){ svRaw('nukala_wishes',w); }

function buildWAMessage(occasion){
  if(occasion.msg) return occasion.msg;
  var name = occasion.people||occasion.title;
  if(occasion.type==='Birthday')    return '🎂 Happy Birthday to '+name+'! Wishing you a wonderful day filled with joy and love. God bless you! 🌟 — The Nukala Family';
  if(occasion.type==='Anniversary') return '💍 Happy Anniversary to '+name+'! Wishing you many more years of love and happiness. 🎉 — The Nukala Family';
  if(occasion.type==='Memorial')    return '🕯️ Remembering '+name+' on this day. Forever in our hearts. — The Nukala Family';
  if(occasion.type==='Achievement') return '🏆 Congratulations to '+name+'! Celebrating your achievement today. 🌟 — The Nukala Family';
  return '🎊 '+occasion.title+' — wishing '+name+' a beautiful day! — The Nukala Family';
}

function sendWA(msg){
  window.open('https://wa.me/?text='+encodeURIComponent(msg), '_blank');
}

function getTodayOccasions(){
  var now   = new Date();
  var month = now.getMonth()+1;
  var day   = now.getDate();
  var found = [];

  // 1. Check custom wishes
  getWishes().forEach(function(w){
    if(parseInt(w.month)===month && parseInt(w.day)===day){
      found.push({source:'custom', title:w.title, type:w.type, people:w.people, msg:w.msg, wishIdx:w.id});
    }
  });

  // 2. Check events (Birthday / Anniversary type with matching date)
  lda('events').forEach(function(e){
    if(!e.date) return;
    var parts = e.date.split('-');
    if(parts.length<3) return;
    var em=parseInt(parts[1]), ed=parseInt(parts[2]);
    if(em===month && ed===day){
      found.push({source:'event', title:e.title, type:e.type||'Event', people:e.title, msg:''});
    }
  });

  // 3. Check member contacts for birthdays
  var members = Object.values(ld('members'));
  var contacts = ldRaw('nukala_contacts')||{};
  members.forEach(function(m){
    var c = contacts[m.id];
    if(!c||!c.birthday) return;
    var bday = c.birthday.toLowerCase();
    var todayMonth = MONTHS_LONG[month-1].toLowerCase();
    var todayShort = MONTHS_SHORT[month-1].toLowerCase();
    if((bday.includes(todayMonth)||bday.includes(todayShort)) && bday.includes(String(day))){
      var name = [m.firstName,m.lastName].filter(Boolean).join(' ');
      found.push({source:'birthday', title:name+' Birthday', type:'Birthday', people:name, msg:''});
    }
  });

  return found;
}

function renderDashWishes(){
  var occasions = getTodayOccasions();
  var todayEl = document.getElementById('ds-today');
  var wishEl  = document.getElementById('ds-wishes');

  // Today panel
  if(!todayEl) return;
  if(!occasions.length){
    todayEl.innerHTML = '<span style="color:var(--tl);">No birthdays, anniversaries or events today &#127807;</span>';
  } else {
    // Store messages in a window array so onclick can reference by index
    window._wishMsgs = occasions.map(function(o){ return buildWAMessage(o); });
    todayEl.innerHTML = occasions.map(function(o,oi){
      var emoji = {Birthday:'&#127874;',Anniversary:'&#128141;',Memorial:'&#128145;',Achievement:'&#127942;',Festival:'&#127882;',Event:'&#128197;'}[o.type]||'&#11088;';
      return '<div style="display:flex;align-items:center;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--b);">'
        +'<div><span style="font-size:1.1rem;margin-right:8px;">'+emoji+'</span>'
        +'<strong style="font-size:.82rem;">'+o.title+'</strong>'
        +(o.type?'<span style="font-size:.7rem;color:var(--tl);margin-left:6px;">'+o.type+'</span>':'')
        +'</div>'
        +'<button onclick="sendWA(window._wishMsgs['+oi+'])" '
        +'style="background:linear-gradient(135deg,#128c7e,#25d366);color:white;border:none;'
        +'border-radius:9px;padding:6px 12px;font-size:.68rem;font-weight:500;cursor:pointer;'
        +'white-space:nowrap;flex-shrink:0;">&#128241; Send Wish</button>'
        +'</div>';
    }).join('');
  }

  // Custom wishes list
  if(!wishEl) return;
  var wishes = getWishes();
  if(!wishes.length){
    wishEl.innerHTML = '<span style="color:var(--tl);font-size:.75rem;">No custom wishes added yet.</span>';
  } else {
    wishEl.innerHTML = wishes.map(function(w,i){
      var emoji = {Birthday:'🎂',Anniversary:'💍',Memorial:'🕯️',Achievement:'🏆',Festival:'🎊',Custom:'⭐'}[w.type]||'⭐';
      var dayStr = w.day+' '+MONTHS_SHORT[(parseInt(w.month)||1)-1];
      return '<div style="display:flex;align-items:center;justify-content:space-between;padding:7px 0;border-bottom:1px solid var(--b);">'
        +'<div style="flex:1;min-width:0;">'
        +'<span style="font-size:.9rem;margin-right:6px;">'+emoji+'</span>'
        +'<strong style="font-size:.78rem;">'+w.title+'</strong>'
        +'<span style="font-size:.68rem;color:var(--tl);margin-left:6px;">Every '+dayStr+'</span>'
        +(w.people?'<div style="font-size:.7rem;color:var(--tm);padding-left:24px;">'+w.people+'</div>':'')
        +'</div>'
        +'<div style="display:flex;gap:5px;flex-shrink:0;">'
        +'<button class="ab" onclick="editWish('+i+')">✏️</button>'
        +'<button class="ab abr" onclick="delWish('+i+')">🗑️</button>'
        +'</div>'
        +'</div>';
    }).join('');
  }
}

function openWishM(){
  document.getElementById('wishId').value='';
  document.getElementById('wishTitle').value='';
  document.getElementById('wishDay').value='';
  document.getElementById('wishMonth').value='';
  document.getElementById('wishType').value='Birthday';
  document.getElementById('wishPeople').value='';
  document.getElementById('wishMsg').value='';
  document.getElementById('wishMH').textContent='Add Custom Wish';
  openM('wishModal');
}

function editWish(i){
  var w=getWishes()[i];
  if(!w) return;
  document.getElementById('wishId').value=i;
  document.getElementById('wishTitle').value=w.title||'';
  document.getElementById('wishDay').value=w.day||'';
  document.getElementById('wishMonth').value=w.month||'';
  document.getElementById('wishType').value=w.type||'Birthday';
  document.getElementById('wishPeople').value=w.people||'';
  document.getElementById('wishMsg').value=w.msg||'';
  document.getElementById('wishMH').textContent='Edit Wish';
  openM('wishModal');
}

function delWish(i){
  if(!confirm('Delete this wish?')) return;
  var w=getWishes(); w.splice(i,1); svWishes(w);
  renderDashWishes(); toast('Deleted.');
}

document.getElementById('saveWishBtn').addEventListener('click', function(){
  var title=document.getElementById('wishTitle').value.trim();
  var day  =document.getElementById('wishDay').value;
  var month=document.getElementById('wishMonth').value;
  if(!title||!day||!month){alert('Title, day and month are required.');return;}
  var w=getWishes();
  var obj={id:Date.now(),title:title,day:day,month:month,
    type:document.getElementById('wishType').value,
    people:document.getElementById('wishPeople').value.trim(),
    msg:document.getElementById('wishMsg').value.trim()};
  var idx=document.getElementById('wishId').value;
  if(idx!=='') w[parseInt(idx)]=obj; else w.push(obj);
  svWishes(w);
  closeM('wishModal');
  renderDashWishes();
  log('Wish saved: '+title);
  toast('✅ Wish saved!');
});

document.getElementById('addWishBtn').addEventListener('click', openWishM);

// renderDashWishes is called directly inside renderDash

