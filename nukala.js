/**
 * nukala.js — Core scripts: dark mode, search, mobile nav, notifications
 * Language is handled separately by lang.js
 */
(function(){
  'use strict';

  // ══════════════════════════════════════
  // 1. DARK MODE
  // ══════════════════════════════════════
  const DK = 'nukala_dark';

  function applyDark(on){
    document.documentElement.setAttribute('data-theme', on ? 'dark' : 'light');
    localStorage.setItem(DK, on ? '1' : '0');
    document.querySelectorAll('.nk-dm').forEach(b => b.textContent = on ? '☀️' : '🌙');
  }

  // Apply immediately before DOM loads to prevent white flash
  applyDark(localStorage.getItem(DK) === '1');
  window.toggleDark = function(){ applyDark(localStorage.getItem(DK) !== '1'); };

  // ══════════════════════════════════════
  // 2. MOBILE NAV — Fixed hamburger
  // ══════════════════════════════════════
  function buildMobileNav(){
    // Inject mobile nav CSS
    if(!document.getElementById('nk-mobile-css')){
      const style = document.createElement('style');
      style.id = 'nk-mobile-css';
      style.textContent = `
        /* ── Mobile Nav ── */
        @media(max-width:768px){
          nav {
            position: fixed !important;
            top: 0; left: 0; right: 0;
            height: auto !important;
            min-height: 60px;
            flex-wrap: wrap;
            padding: 0 16px !important;
            z-index: 9999;
          }
          .nav-brand { padding: 14px 0; flex: 1; }
          .nav-brand .nav-site-name { font-size: 1.1rem !important; }
          .nav-brand img { width: 28px !important; height: 28px !important; }

          /* Hide links by default */
          nav .nav-links {
            display: none !important;
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            right: 0 !important;
            padding-top: 62px;
            padding-bottom: 8px;
            background: rgba(250,248,244,0.99) !important;
            border-bottom: 2px solid #c8ddc8;
            flex-direction: column !important;
            gap: 0 !important;
            z-index: 9990 !important;
            box-shadow: 0 8px 24px rgba(0,0,0,0.12);
            max-height: 100vh;
            overflow-y: auto;
          }

          /* Dark mode mobile nav */
          [data-theme="dark"] nav .nav-links {
            background: rgba(13,24,13,0.99) !important;
            border-color: #1e361e;
          }

          nav .nav-links.open {
            display: flex !important;
          }

          nav .nav-links li { width: 100% !important; }
          nav .nav-links a {
            display: block !important;
            padding: 14px 20px !important;
            font-size: 0.88rem !important;
            font-weight: 500 !important;
            letter-spacing: 0.04em !important;
            border-bottom: 1px solid rgba(200,200,200,0.2) !important;
            white-space: nowrap !important;
            color: #2c2c2c !important;
          }
          [data-theme="dark"] nav .nav-links a { color: #e8d5a0 !important; }
          nav .nav-links a.active { color: #5c7a5c !important; background: rgba(92,122,92,0.06) !important; }
          [data-theme="dark"] nav .nav-links a.active { color: #8acc8a !important; }

          /* Show hamburger on mobile */
          .nk-burger { display: flex !important; }

          /* Hide extra nav buttons on mobile to save space */
          .nk-search-btn .gs-kbd { display: none !important; }
          .nk-search-btn { font-size: 0 !important; padding: 7px 9px !important; }
          .nk-search-btn::before { content: '🔍'; font-size: 15px; }

          main { padding-top: 70px !important; }
        }

        /* ── Hamburger button ── */
        .nk-burger {
          display: none;
          flex-direction: column;
          justify-content: center;
          gap: 5px;
          width: 38px;
          height: 38px;
          padding: 8px;
          background: none;
          border: 1.5px solid #e8e2d8;
          border-radius: 8px;
          cursor: pointer;
          flex-shrink: 0;
          margin-left: 8px;
          transition: border-color 0.2s;
        }
        .nk-burger:hover { border-color: #8aab8a; }
        .nk-burger span {
          display: block;
          width: 18px;
          height: 2px;
          background: #5c7a5c;
          border-radius: 2px;
          transition: all 0.3s ease;
          transform-origin: center;
        }
        [data-theme="dark"] .nk-burger { border-color: #1e361e; }
        [data-theme="dark"] .nk-burger span { background: #8acc8a; }

        /* Hamburger → X animation */
        .nk-burger.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
        .nk-burger.open span:nth-child(2) { opacity: 0; transform: scaleX(0); }
        .nk-burger.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }
      `;
      document.head.appendChild(style);
    }

    if(document.querySelector('.nk-burger')) return; // already built

    const nav = document.querySelector('nav');
    if(!nav) return;

    // Create hamburger
    const burger = document.createElement('button');
    burger.className = 'nk-burger';
    burger.setAttribute('aria-label', 'Toggle navigation menu');
    burger.setAttribute('type', 'button');
    burger.innerHTML = '<span></span><span></span><span></span>';

    // Insert burger: after nav-brand, before other buttons
    const brand = nav.querySelector('.nav-brand');
    const navLinks = nav.querySelector('.nav-links');
    if(brand && navLinks){
      // Insert burger right after the brand
      brand.insertAdjacentElement('afterend', burger);
    } else {
      nav.appendChild(burger);
    }

    // Toggle function — measures actual nav height for accurate dropdown position
    burger.addEventListener('click', function(e){
      e.stopPropagation();
      const links = nav.querySelector('.nav-links');
      const isOpen = burger.classList.toggle('open');
      if(links){
        if(isOpen){
          // Measure actual nav height at time of click
          const navH = nav.getBoundingClientRect().height;
          links.style.paddingTop = navH + 'px';
          links.classList.add('open');
        } else {
          links.classList.remove('open');
        }
      }
    });

    // Close when clicking a nav link
    nav.querySelectorAll('.nav-links a').forEach(a => {
      a.addEventListener('click', () => {
        burger.classList.remove('open');
        nav.querySelector('.nav-links')?.classList.remove('open');
      });
    });

    // Close when clicking outside
    document.addEventListener('click', function(e){
      if(!nav.contains(e.target)){
        burger.classList.remove('open');
        nav.querySelector('.nav-links')?.classList.remove('open');
      }
    });
  }

  // ══════════════════════════════════════
  // 3. SEARCH OVERLAY
  // ══════════════════════════════════════
  function buildSearch(){
    if(document.getElementById('nk-search')) return;

    const css = document.createElement('style');
    css.textContent = `
      #nk-search{position:fixed;inset:0;z-index:99999;background:rgba(0,0,0,.55);backdrop-filter:blur(6px);display:none;align-items:flex-start;justify-content:center;padding-top:80px;}
      #nk-search.on{display:flex;}
      #nk-search .box{background:#fff;border-radius:18px;width:92%;max-width:560px;overflow:hidden;box-shadow:0 20px 60px rgba(0,0,0,.2);}
      #nk-search .bar{display:flex;align-items:center;gap:10px;padding:16px 18px;border-bottom:1px solid #e8e2d8;}
      #nk-search input{flex:1;border:none;outline:none;font-size:.95rem;font-family:inherit;background:transparent;color:#2c2c2c;}
      #nk-search .cls{background:none;border:none;font-size:1rem;cursor:pointer;color:#aaa;padding:2px 8px;}
      #nk-search .res{max-height:360px;overflow-y:auto;}
      #nk-search .item{display:flex;align-items:center;gap:12px;padding:11px 18px;cursor:pointer;border-bottom:1px solid #f5f2ee;transition:background .1s;}
      #nk-search .item:hover{background:#f5faf5;}
      #nk-search .av{width:36px;height:36px;border-radius:50%;background:#c8ddc8;display:flex;align-items:center;justify-content:center;font-size:15px;flex-shrink:0;overflow:hidden;}
      #nk-search .av img{width:100%;height:100%;object-fit:cover;}
      #nk-search .nm{font-size:.9rem;font-weight:500;color:#2c2c2c;}
      #nk-search .mt{font-size:.7rem;color:#aaa;}
      #nk-search .empty{padding:28px;text-align:center;color:#aaa;font-size:.85rem;}
      #nk-search .foot{padding:10px 18px;font-size:.7rem;color:#bbb;text-align:center;border-top:1px solid #e8e2d8;}
      [data-theme="dark"] #nk-search .box{background:#131f13;}
      [data-theme="dark"] #nk-search input{color:#e8d5a0;}
      [data-theme="dark"] #nk-search .item:hover{background:#1a2a1a;}
      [data-theme="dark"] #nk-search .nm{color:#e8d5a0;}
      [data-theme="dark"] #nk-search .bar,[data-theme="dark"] #nk-search .foot{border-color:#1e361e;}
      @media(max-width:768px){#nk-search{padding-top:70px;}}
    `;
    document.head.appendChild(css);

    const el = document.createElement('div');
    el.id = 'nk-search';
    el.innerHTML = `<div class="box">
      <div class="bar"><span>🔍</span>
        <input id="nk-si" placeholder="Search family members..." autocomplete="off"/>
        <button class="cls" onclick="nkCloseSearch()">✕</button>
      </div>
      <div class="res" id="nk-sr"><div class="empty">Start typing to search...</div></div>
      <div class="foot">Press Esc to close</div>
    </div>`;
    document.body.appendChild(el);

    el.addEventListener('click', e => { if(e.target === el) nkCloseSearch(); });

    document.getElementById('nk-si').addEventListener('input', function(){
      const q = this.value.trim().toLowerCase();
      const members = Object.values(JSON.parse(localStorage.getItem('nukala_tree_data')||'{}'));
      const sr = document.getElementById('nk-sr');
      if(!q){ sr.innerHTML = '<div class="empty">Start typing to search...</div>'; return; }
      const found = members.filter(m => [m.firstName,m.lastName,m.role,m.place].join(' ').toLowerCase().includes(q)).slice(0,10);
      if(!found.length){ sr.innerHTML = `<div class="empty">No results for "<b>${q}</b>"</div>`; return; }
      sr.innerHTML = found.map(m => {
        const name = [m.firstName,m.lastName].filter(Boolean).join(' ')||'Unnamed';
        const av = m.photo ? `<img src="${m.photo}" alt=""/>` : (m.female?'👩':m.ancestor?'👴':'👨');
        const meta = [m.role, m.gen?'Gen '+m.gen:'', m.born?'b.'+m.born:''].filter(Boolean).join(' · ');
        return `<div class="item" onclick="nkCloseSearch();location.href='tree.html'">
          <div class="av">${av}</div>
          <div><div class="nm">${name}</div><div class="mt">${meta}</div></div>
        </div>`;
      }).join('');
    });
  }

  window.nkOpenSearch = function(){
    buildSearch();
    document.getElementById('nk-search').classList.add('on');
    setTimeout(() => document.getElementById('nk-si').focus(), 80);
  };
  window.nkCloseSearch = function(){
    const el = document.getElementById('nk-search');
    if(el){
      el.classList.remove('on');
      document.getElementById('nk-si').value = '';
      document.getElementById('nk-sr').innerHTML = '<div class="empty">Start typing to search...</div>';
    }
  };

  document.addEventListener('keydown', e => {
    if(e.key === 'Escape') nkCloseSearch();
    if((e.ctrlKey||e.metaKey) && e.key === 'k'){ e.preventDefault(); nkOpenSearch(); }
  });

  // ══════════════════════════════════════
  // 4. BUILD NAV BUTTONS (once only)
  // ══════════════════════════════════════
  function buildNavButtons(){
    const nav = document.querySelector('nav');
    if(!nav) return;
    if(nav.querySelector('.nk-dm')) return; // already built

    const logout = nav.querySelector('.nav-logout');

    function addBtn(cls, text, fn, title){
      const b = document.createElement('button');
      b.className = 'nav-logout ' + cls;
      b.style.cssText = 'padding:6px 10px;font-size:13px;font-weight:500;min-width:34px;cursor:pointer;white-space:nowrap;flex-shrink:0;';
      b.textContent = text; b.title = title; b.onclick = fn;
      if(logout) nav.insertBefore(b, logout);
      else nav.appendChild(b);
      return b;
    }

    const isDark = localStorage.getItem(DK) === '1';
    addBtn('nk-search-btn', '🔍 Search', nkOpenSearch, 'Search (Ctrl+K)');
    addBtn('nk-dm', isDark ? '☀️' : '🌙', window.toggleDark, 'Toggle Dark/Light Mode');
    addBtn('nk-lang', localStorage.getItem('nukala_lang')==='te' ? 'EN' : 'తె', window.toggleLang, 'Switch Language / భాష మార్చండి');
  }

  // ══════════════════════════════════════
  // 5. INIT
  // ══════════════════════════════════════
  function init(){
    buildNavButtons();
    buildMobileNav();
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // ══════════════════════════════════════
  // 6. PAGE VISIBILITY
  // ══════════════════════════════════════
  const PAGE_FILE_MAP = {
    'home.html':'home','tree.html':'tree','history.html':'history',
    'gallery.html':'gallery','facts.html':'facts','stats.html':'stats',
    'events.html':'events','map.html':'map','polls.html':'polls',
    'recipes.html':'recipes','achievements.html':'achievements',
    'videos.html':'videos','qr.html':'qr','contact.html':'contact'
  };

  function applyPageVisibility(){
    const vis = JSON.parse(localStorage.getItem('nukala_page_vis')||'{}');
    if(!Object.keys(vis).length) return;
    const currentPage = location.pathname.split('/').pop() || 'home.html';
    const currentId = PAGE_FILE_MAP[currentPage];
    if(currentId && vis[currentId] === false){
      const overlay = document.createElement('div');
      overlay.style.cssText = 'position:fixed;inset:0;z-index:8000;background:rgba(250,248,244,.97);display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;';
      overlay.innerHTML = `<div style="font-size:56px;margin-bottom:16px;">🚧</div>
        <h2 style="font-family:Cormorant Garamond,serif;font-size:2rem;font-weight:300;margin-bottom:8px;">Coming Soon</h2>
        <p style="font-size:.9rem;color:#6b6b6b;margin-bottom:24px;">This page is not available yet.</p>
        <a href="home.html" style="padding:12px 28px;background:#5c7a5c;color:white;border-radius:12px;text-decoration:none;font-size:.82rem;">← Back to Home</a>`;
      document.body.appendChild(overlay);
    }
    document.querySelectorAll('nav .nav-links a').forEach(a => {
      const href = a.getAttribute('href');
      const id = PAGE_FILE_MAP[href];
      if(id && vis[id] === false) a.parentElement.style.display = 'none';
      else a.parentElement.style.display = '';
    });
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', applyPageVisibility);
  } else {
    applyPageVisibility();
  }

  // ══════════════════════════════════════
  // 7. BIRTHDAY NOTIFICATIONS
  // ══════════════════════════════════════
  window.enableNotifications = async function(){
    if(!('Notification' in window)){ alert('Notifications not supported.'); return; }
    const perm = await Notification.requestPermission();
    if(perm === 'granted'){
      const members = Object.values(JSON.parse(localStorage.getItem('nukala_tree_data')||'{}'));
      const contacts = JSON.parse(localStorage.getItem('nukala_contacts')||'{}');
      const today = new Date();
      const months = ['january','february','march','april','may','june','july','august','september','october','november','december'];
      members.forEach(m => {
        const c = contacts[m.id]; if(!c||!c.birthday) return;
        const bd = c.birthday.toLowerCase();
        if(bd.includes(months[today.getMonth()]) && bd.includes(String(today.getDate()))){
          const name = [m.firstName,m.lastName].filter(Boolean).join(' ');
          new Notification('🎂 Birthday Today!',{body:`Today is ${name}'s birthday!`,icon:'logo.png'});
        }
      });
      alert('✅ Notifications enabled!');
    } else alert('Notifications blocked. Please allow in browser settings.');
  };

  // Expose toggleLang as a no-op here (real implementation in lang.js)
  if(!window.toggleLang) window.toggleLang = function(){};

})();
