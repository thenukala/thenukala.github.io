/**
 * nukala.js — Single combined script for all pages
 * Handles: dark mode, search, language, mobile menu, notifications
 * Bulletproof: each feature checks for existing elements before adding
 */
(function(){
  'use strict';

  // ── Run after DOM ready ──
  function ready(fn){ if(document.readyState!=='loading') fn(); else document.addEventListener('DOMContentLoaded',fn); }

  // ══════════════════════════════════════
  // 1. DARK MODE
  // ══════════════════════════════════════
  const DK='nukala_dark';
  function applyDark(on){
    document.documentElement.setAttribute('data-theme', on?'dark':'light');
    localStorage.setItem(DK, on?'1':'0');
    document.querySelectorAll('.nk-dm').forEach(b=>b.textContent=on?'☀️':'🌙');
  }
  // Apply immediately (before DOM loads) to prevent flash
  applyDark(localStorage.getItem(DK)==='1');
  window.toggleDark=function(){ applyDark(localStorage.getItem(DK)!=='1'); };

  // ══════════════════════════════════════
  // 2. SEARCH OVERLAY
  // ══════════════════════════════════════
  function buildSearch(){
    if(document.getElementById('nk-search')) return;
    const css=document.createElement('style');
    css.textContent=`
      #nk-search{position:fixed;inset:0;z-index:9000;background:rgba(0,0,0,.55);backdrop-filter:blur(6px);display:none;align-items:flex-start;justify-content:center;padding-top:80px;}
      #nk-search.on{display:flex;}
      #nk-search .box{background:#fff;border-radius:18px;width:92%;max-width:560px;overflow:hidden;box-shadow:0 20px 60px rgba(0,0,0,.2);}
      #nk-search .bar{display:flex;align-items:center;gap:10px;padding:16px 18px;border-bottom:1px solid #e8e2d8;}
      #nk-search input{flex:1;border:none;outline:none;font-size:.95rem;font-family:inherit;background:transparent;color:#2c2c2c;}
      #nk-search .cls{background:none;border:none;font-size:1rem;cursor:pointer;color:#aaa;padding:2px 6px;}
      #nk-search .res{max-height:360px;overflow-y:auto;}
      #nk-search .item{display:flex;align-items:center;gap:12px;padding:11px 18px;cursor:pointer;border-bottom:1px solid #f5f2ee;transition:background .1s;}
      #nk-search .item:hover{background:#f5faf5;}
      #nk-search .av{width:36px;height:36px;border-radius:50%;background:#c8ddc8;display:flex;align-items:center;justify-content:center;font-size:15px;flex-shrink:0;overflow:hidden;}
      #nk-search .av img{width:100%;height:100%;object-fit:cover;}
      #nk-search .nm{font-size:.9rem;font-weight:500;color:#2c2c2c;}
      #nk-search .mt{font-size:.7rem;color:#aaa;}
      #nk-search .empty{padding:28px;text-align:center;color:#aaa;font-size:.85rem;}
      #nk-search .foot{padding:10px 18px;font-size:.7rem;color:#bbb;text-align:center;border-top:1px solid #e8e2d8;}
      [data-theme="dark"] #nk-search .box{background:#1a2a1a;}
      [data-theme="dark"] #nk-search input{color:#e8d5a0;}
      [data-theme="dark"] #nk-search .item:hover{background:#243024;}
      [data-theme="dark"] #nk-search .nm{color:#e8d5a0;}
    `;
    document.head.appendChild(css);
    const el=document.createElement('div');
    el.id='nk-search';
    el.innerHTML=`<div class="box"><div class="bar"><span>🔍</span><input id="nk-si" placeholder="Search family members..." autocomplete="off"/><button class="cls" onclick="nkCloseSearch()">✕</button></div><div class="res" id="nk-sr"><div class="empty">Start typing to search...</div></div><div class="foot">Press Esc to close</div></div>`;
    document.body.appendChild(el);
    el.addEventListener('click',e=>{if(e.target===el)nkCloseSearch();});
    document.getElementById('nk-si').addEventListener('input',function(){
      const q=this.value.trim().toLowerCase();
      const members=Object.values(JSON.parse(localStorage.getItem('nukala_tree_data')||'{}'));
      const sr=document.getElementById('nk-sr');
      if(!q){sr.innerHTML='<div class="empty">Start typing to search...</div>';return;}
      const found=members.filter(m=>[m.firstName,m.lastName,m.role,m.place].join(' ').toLowerCase().includes(q)).slice(0,10);
      if(!found.length){sr.innerHTML=`<div class="empty">No results for "<b>${q}</b>"</div>`;return;}
      sr.innerHTML=found.map(m=>{
        const name=[m.firstName,m.lastName].filter(Boolean).join(' ')||'Unnamed';
        const av=m.photo?`<img src="${m.photo}" alt=""/>`:(m.female?'👩':m.ancestor?'👴':'👨');
        const meta=[m.role,m.gen?'Gen '+m.gen:'',m.born?'b.'+m.born:''].filter(Boolean).join(' · ');
        return `<div class="item" onclick="nkCloseSearch();location.href='tree.html'"><div class="av">${av}</div><div><div class="nm">${name}</div><div class="mt">${meta}</div></div></div>`;
      }).join('');
    });
  }
  window.nkOpenSearch=function(){buildSearch();document.getElementById('nk-search').classList.add('on');setTimeout(()=>document.getElementById('nk-si').focus(),80);};
  window.nkCloseSearch=function(){const el=document.getElementById('nk-search');if(el){el.classList.remove('on');document.getElementById('nk-si').value='';document.getElementById('nk-sr').innerHTML='<div class="empty">Start typing to search...</div>';}};
  document.addEventListener('keydown',e=>{if(e.key==='Escape')nkCloseSearch();if((e.ctrlKey||e.metaKey)&&e.key==='k'){e.preventDefault();nkOpenSearch();}});

  // ══════════════════════════════════════
  // 3. LANGUAGE (English / Telugu)
  // ══════════════════════════════════════
  const LK='nukala_lang';
  const T={
    en:{home:'Home',tree:'Family Tree',history:'History',gallery:'Gallery',facts:'Facts',stats:'Stats',events:'Events',map:'Map',polls:'Polls',recipes:'Recipes',achievements:'Achievements',videos:'Videos',share:'Share',contact:'Contact'},
    te:{home:'హోమ్',tree:'కుటుంబ వృక్షం',history:'చరిత్ర',gallery:'గ్యాలరీ',facts:'వాస్తవాలు',stats:'గణాంకాలు',events:'కార్యక్రమాలు',map:'మ్యాప్',polls:'పోల్స్',recipes:'వంటకాలు',achievements:'విజయాలు',videos:'వీడియోలు',share:'షేర్',contact:'సంప్రదించండి'}
  };
  const HREF_TO_KEY={'home.html':'home','tree.html':'tree','history.html':'history','gallery.html':'gallery','facts.html':'facts','stats.html':'stats','events.html':'events','map.html':'map','polls.html':'polls','recipes.html':'recipes','achievements.html':'achievements','videos.html':'videos','qr.html':'share','contact.html':'contact'};
  function applyLang(lang){
    localStorage.setItem(LK,lang);
    const t=T[lang]||T.en;
    document.querySelectorAll('nav .nav-links a').forEach(a=>{
      const key=HREF_TO_KEY[a.getAttribute('href')];
      if(key&&t[key]) a.textContent=t[key];
    });
    document.querySelectorAll('.nk-lang').forEach(b=>b.textContent=lang==='te'?'EN':'తె');
  }
  window.toggleLang=function(){applyLang(localStorage.getItem(LK)==='te'?'en':'te');};

  // ══════════════════════════════════════
  // 4. MOBILE HAMBURGER
  // ══════════════════════════════════════
  function buildMobile(){
    if(document.querySelector('.nk-burger')) return;
    const nav=document.querySelector('nav'); if(!nav) return;
    const burger=document.createElement('button');
    burger.className='nk-burger';
    burger.setAttribute('aria-label','Menu');
    burger.innerHTML='<span></span><span></span><span></span>';
    burger.style.cssText='display:none;flex-direction:column;gap:5px;padding:8px;background:none;border:1.5px solid #e8e2d8;border-radius:8px;cursor:pointer;margin-left:8px;flex-shrink:0;';
    burger.onclick=function(){
      this.classList.toggle('open');
      const links=nav.querySelector('.nav-links');
      if(links) links.classList.toggle('mobile-open');
    };
    // Insert burger before the right-side buttons
    const logout=nav.querySelector('.nav-logout');
    if(logout) logout.parentNode.insertBefore(burger,logout);
    else nav.appendChild(burger);
    // Show on mobile via CSS
    const style=document.createElement('style');
    style.textContent=`
      @media(max-width:768px){
        .nk-burger{display:flex!important;}
        .nk-burger span{display:block;width:20px;height:2px;background:#6b6b6b;border-radius:2px;transition:all .3s;}
        .nk-burger.open span:nth-child(1){transform:rotate(45deg) translate(5px,5px);}
        .nk-burger.open span:nth-child(2){opacity:0;}
        .nk-burger.open span:nth-child(3){transform:rotate(-45deg) translate(5px,-5px);}
        nav .nav-links{display:none;position:absolute;top:100%;left:0;right:0;background:rgba(250,248,244,.98);border-bottom:1px solid #e8e2d8;flex-direction:column;gap:0;padding:6px 0;z-index:99;backdrop-filter:blur(12px);}
        nav .nav-links.mobile-open{display:flex!important;}
        nav .nav-links a{padding:12px 20px;font-size:.85rem;border-bottom:1px solid rgba(232,226,216,.4);white-space:nowrap;}
        nav{position:fixed;flex-wrap:wrap;height:auto;min-height:68px;}
        main{padding-top:80px;}
      }
    `;
    document.head.appendChild(style);
    // Close when link clicked
    nav.querySelectorAll('.nav-links a').forEach(a=>a.addEventListener('click',()=>{
      burger.classList.remove('open');
      nav.querySelector('.nav-links')?.classList.remove('mobile-open');
    }));
  }

  // ══════════════════════════════════════
  // 5. BUILD NAV BUTTONS (once only)
  // ══════════════════════════════════════
  function buildNavButtons(){
    const nav=document.querySelector('nav'); if(!nav) return;
    if(nav.querySelector('.nk-search-btn,.nk-dm,.nk-lang')) return; // already built

    const logout=nav.querySelector('.nav-logout');
    const insertBefore=logout||null;

    function addBtn(cls,text,onclick,title){
      const b=document.createElement('button');
      b.className='nav-logout '+cls;
      b.style.cssText='padding:6px 10px;font-size:13px;font-weight:500;min-width:36px;cursor:pointer;white-space:nowrap;flex-shrink:0;';
      b.textContent=text; b.title=title; b.onclick=onclick;
      if(insertBefore) nav.insertBefore(b,insertBefore);
      else nav.appendChild(b);
      return b;
    }

    // Search button
    addBtn('nk-search-btn','🔍 Search',nkOpenSearch,'Search (Ctrl+K)');
    // Dark mode
    const isDark=localStorage.getItem(DK)==='1';
    addBtn('nk-dm',isDark?'☀️':'🌙',window.toggleDark,'Toggle Dark/Light Mode');
    // Language
    const isTE=localStorage.getItem(LK)==='te';
    addBtn('nk-lang',isTE?'EN':'తె',window.toggleLang,'Switch Language');
  }

  // ══════════════════════════════════════
  // 6. INIT ON DOM READY
  // ══════════════════════════════════════
  ready(function(){
    buildNavButtons();
    buildMobile();
    // Apply saved language
    const savedLang=localStorage.getItem(LK)||'en';
    if(savedLang==='te') applyLang('te');
  });

  // ══════════════════════════════════════
  // 7. BIRTHDAY NOTIFICATIONS
  // ══════════════════════════════════════
  window.enableNotifications=async function(){
    if(!('Notification' in window)){alert('Notifications not supported on this browser.');return;}
    const perm=await Notification.requestPermission();
    if(perm==='granted'){
      const members=Object.values(JSON.parse(localStorage.getItem('nukala_tree_data')||'{}'));
      const contacts=JSON.parse(localStorage.getItem('nukala_contacts')||'{}');
      const today=new Date();
      members.forEach(m=>{
        const c=contacts[m.id]; if(!c||!c.birthday) return;
        const bd=c.birthday.toLowerCase();
        const months=['january','february','march','april','may','june','july','august','september','october','november','december'];
        const todayMonth=months[today.getMonth()];
        if(bd.includes(todayMonth)&&bd.includes(String(today.getDate()))){
          const name=[m.firstName,m.lastName].filter(Boolean).join(' ');
          new Notification('🎂 Birthday Today!',{body:`Today is ${name}'s birthday!`,icon:'logo.png'});
        }
      });
      alert('✅ Birthday notifications enabled!');
    } else alert('Notifications blocked. Allow them in your browser settings.');
  };

})();
