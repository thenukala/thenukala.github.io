/**
 * nukala.js — Dark mode, search, mobile nav, page visibility
 * Mobile nav rebuilt from scratch — works on iOS Safari + Android Chrome
 */
(function(){
  'use strict';

  // ══════════════════════════════════════
  // 1. DARK MODE
  // ══════════════════════════════════════
  var DK = 'nukala_dark';

  function applyDark(on){
    document.documentElement.setAttribute('data-theme', on ? 'dark' : 'light');
    localStorage.setItem(DK, on ? '1' : '0');
    document.querySelectorAll('.nk-dm').forEach(function(b){ b.textContent = on ? '☀️' : '🌙'; });
  }

  applyDark(localStorage.getItem(DK) === '1');
  window.toggleDark = function(){ applyDark(localStorage.getItem(DK) !== '1'); };

  // ══════════════════════════════════════
  // 2. MOBILE NAV
  // ══════════════════════════════════════
  function buildMobileNav(){
    if(document.getElementById('nk-nav-style')) return;

    // Inject CSS
    var style = document.createElement('style');
    style.id = 'nk-nav-style';
    style.textContent = [
      /* Hamburger — hidden by default, shown on mobile */
      '.nk-burger{display:none;flex-direction:column;justify-content:center;align-items:center;gap:5px;',
      'width:36px;height:36px;background:none;border:1.5px solid #e8e2d8;border-radius:8px;',
      'cursor:pointer;flex-shrink:0;margin-left:6px;padding:0;',
      'transition:border-color 0.2s;z-index:1001;position:relative;}',
      '.nk-burger:hover{border-color:#8aab8a;}',
      '[data-theme=dark] .nk-burger{border-color:#1e361e;}',
      '.nk-burger span{display:block;width:18px;height:2px;background:#5c7a5c;border-radius:2px;',
      'transition:all 0.25s ease;transform-origin:center;}',
      '[data-theme=dark] .nk-burger span{background:#8acc8a;}',
      '.nk-burger.open span:nth-child(1){transform:translateY(7px) rotate(45deg);}',
      '.nk-burger.open span:nth-child(2){opacity:0;transform:scaleX(0);}',
      '.nk-burger.open span:nth-child(3){transform:translateY(-7px) rotate(-45deg);}',

      /* Mobile dropdown — separate from nav flow */
      '#nk-dropdown{',
      'display:none;',
      'position:fixed;',
      'left:0;right:0;',
      'z-index:999;',
      'background:#faf8f4;',
      'border-bottom:2px solid #c8ddc8;',
      'box-shadow:0 8px 32px rgba(0,0,0,0.18);',
      'overflow-y:auto;',
      '-webkit-overflow-scrolling:touch;',
      '}',
      '[data-theme=dark] #nk-dropdown{background:#0e180e;border-color:#1e361e;}',
      '#nk-dropdown.open{display:block;}',
      '#nk-dropdown ul{list-style:none;margin:0;padding:8px 0 16px;}',
      '#nk-dropdown li{}',
      '#nk-dropdown a{',
      'display:block;',
      'padding:14px 22px;',
      'font-family:Jost,sans-serif;',
      'font-size:0.92rem;',
      'font-weight:500;',
      'color:#2c2c2c;',
      'text-decoration:none;',
      'border-bottom:1px solid rgba(0,0,0,0.06);',
      'letter-spacing:0.02em;',
      '}',
      '[data-theme=dark] #nk-dropdown a{color:#e8d5a0;border-color:rgba(255,255,255,0.06);}',
      '#nk-dropdown a:active{background:rgba(92,122,92,0.1);}',
      '#nk-dropdown a.active{color:#5c7a5c;font-weight:600;}',
      '[data-theme=dark] #nk-dropdown a.active{color:#8acc8a;}',

      /* Backdrop */
      '#nk-backdrop{display:none;position:fixed;inset:0;z-index:998;background:rgba(0,0,0,0.3);}',
      '#nk-backdrop.open{display:block;}',

      /* Mobile breakpoint */
      '@media(max-width:768px){',
      '  nav{position:fixed!important;top:0;left:0;right:0;z-index:1000!important;',
      '  height:auto!important;min-height:56px;padding:0 14px!important;flex-wrap:nowrap!important;}',
      '  .nav-brand{padding:12px 0;flex:1;min-width:0;}',
      '  .nav-brand .nav-site-name{font-size:1rem!important;}',
      '  nav .nav-links{display:none!important;}',
      '  .nk-burger{display:flex!important;}',
      '  .nav-logout,.nk-dm,.nk-lang,.nk-search-btn{',
      '    padding:5px 7px!important;font-size:12px!important;min-width:28px!important;',
      '  }',
      '  main{padding-top:64px!important;}',
      '  body{padding-top:0!important;}',
      '}',

      /* Hide extra button labels on very small screens */
      '@media(max-width:380px){',
      '  .nk-search-btn{font-size:0!important;padding:5px 8px!important;}',
      '  .nk-search-btn::before{content:"🔍";font-size:14px;}',
      '}'
    ].join('');
    document.head.appendChild(style);

    var nav = document.querySelector('nav');
    if(!nav) return;
    if(document.querySelector('.nk-burger')) return;

    // Create hamburger button
    var burger = document.createElement('button');
    burger.className = 'nk-burger';
    burger.type = 'button';
    burger.setAttribute('aria-label', 'Open menu');
    burger.setAttribute('aria-expanded', 'false');
    burger.innerHTML = '<span></span><span></span><span></span>';
    nav.appendChild(burger);

    // Create separate dropdown (NOT inside nav — avoids z-index stacking issues)
    var dropdown = document.createElement('div');
    dropdown.id = 'nk-dropdown';

    // Clone nav links into dropdown
    var navLinks = nav.querySelector('.nav-links');
    if(navLinks){
      var cloned = navLinks.cloneNode(true);
      dropdown.appendChild(cloned);
    }
    document.body.appendChild(dropdown);

    // Create backdrop
    var backdrop = document.createElement('div');
    backdrop.id = 'nk-backdrop';
    document.body.appendChild(backdrop);

    // Position dropdown just below nav
    function positionDropdown(){
      var navRect = nav.getBoundingClientRect();
      var navBottom = Math.round(navRect.bottom);
      dropdown.style.top = navBottom + 'px';
      dropdown.style.maxHeight = (window.innerHeight - navBottom - 10) + 'px';
    }

    // Open/close
    function openMenu(){
      positionDropdown();
      burger.classList.add('open');
      dropdown.classList.add('open');
      backdrop.classList.add('open');
      burger.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden'; // prevent scroll behind menu
    }

    function closeMenu(){
      burger.classList.remove('open');
      dropdown.classList.remove('open');
      backdrop.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }

    burger.addEventListener('click', function(e){
      e.stopPropagation();
      if(dropdown.classList.contains('open')) closeMenu();
      else openMenu();
    });

    // Close on backdrop tap
    backdrop.addEventListener('click', closeMenu);

    // Close on link tap
    dropdown.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click', closeMenu);
    });

    // Reposition on resize/orientation change
    window.addEventListener('resize', function(){
      if(dropdown.classList.contains('open')) positionDropdown();
    });
    window.addEventListener('orientationchange', function(){
      setTimeout(function(){
        if(dropdown.classList.contains('open')) positionDropdown();
        else closeMenu();
      }, 200);
    });
  }

  // ══════════════════════════════════════
  // 3. SEARCH OVERLAY
  // ══════════════════════════════════════
  function buildSearch(){
    if(document.getElementById('nk-search')) return;

    var css = document.createElement('style');
    css.textContent = [
      '#nk-search{position:fixed;inset:0;z-index:99999;background:rgba(0,0,0,.55);',
      'backdrop-filter:blur(6px);display:none;align-items:flex-start;',
      'justify-content:center;padding-top:80px;}',
      '#nk-search.on{display:flex;}',
      '#nk-search .box{background:#fff;border-radius:18px;width:92%;max-width:560px;',
      'overflow:hidden;box-shadow:0 20px 60px rgba(0,0,0,.2);}',
      '#nk-search .bar{display:flex;align-items:center;gap:10px;padding:16px 18px;',
      'border-bottom:1px solid #e8e2d8;}',
      '#nk-search input{flex:1;border:none;outline:none;font-size:.95rem;',
      'font-family:inherit;background:transparent;color:#2c2c2c;}',
      '#nk-search .cls{background:none;border:none;font-size:1rem;cursor:pointer;color:#aaa;padding:2px 8px;}',
      '#nk-search .res{max-height:360px;overflow-y:auto;}',
      '#nk-search .item{display:flex;align-items:center;gap:12px;padding:11px 18px;',
      'cursor:pointer;border-bottom:1px solid #f5f2ee;transition:background .1s;}',
      '#nk-search .item:hover{background:#f5faf5;}',
      '#nk-search .av{width:36px;height:36px;border-radius:50%;background:#c8ddc8;',
      'display:flex;align-items:center;justify-content:center;font-size:15px;flex-shrink:0;overflow:hidden;}',
      '#nk-search .av img{width:100%;height:100%;object-fit:cover;}',
      '#nk-search .nm{font-size:.9rem;font-weight:500;color:#2c2c2c;}',
      '#nk-search .mt{font-size:.7rem;color:#aaa;}',
      '#nk-search .empty{padding:28px;text-align:center;color:#aaa;font-size:.85rem;}',
      '#nk-search .foot{padding:10px 18px;font-size:.7rem;color:#bbb;text-align:center;',
      'border-top:1px solid #e8e2d8;}',
      '[data-theme=dark] #nk-search .box{background:#131f13;}',
      '[data-theme=dark] #nk-search input{color:#e8d5a0;}',
      '[data-theme=dark] #nk-search .item:hover{background:#1a2a1a;}',
      '[data-theme=dark] #nk-search .nm{color:#e8d5a0;}',
      '[data-theme=dark] #nk-search .bar,[data-theme=dark] #nk-search .foot{border-color:#1e361e;}',
      '@media(max-width:768px){#nk-search{padding-top:70px;}}'
    ].join('');
    document.head.appendChild(css);

    var el = document.createElement('div');
    el.id = 'nk-search';
    el.innerHTML = '<div class="box">'
      + '<div class="bar"><span>🔍</span>'
      + '<input id="nk-si" placeholder="Search family members..." autocomplete="off"/>'
      + '<button class="cls" onclick="nkCloseSearch()">✕</button>'
      + '</div>'
      + '<div class="res" id="nk-sr"><div class="empty">Start typing to search...</div></div>'
      + '<div class="foot">Press Esc to close</div>'
      + '</div>';
    document.body.appendChild(el);

    el.addEventListener('click', function(e){ if(e.target === el) nkCloseSearch(); });

    document.getElementById('nk-si').addEventListener('input', function(){
      var q = this.value.trim().toLowerCase();
      var members = Object.values(JSON.parse(localStorage.getItem('nukala_tree_data')||'{}'));
      var sr = document.getElementById('nk-sr');
      if(!q){ sr.innerHTML = '<div class="empty">Start typing to search...</div>'; return; }
      var found = members.filter(function(m){
        return [m.firstName,m.lastName,m.role,m.place].join(' ').toLowerCase().includes(q);
      }).slice(0,10);
      if(!found.length){ sr.innerHTML = '<div class="empty">No results for "<b>'+q+'</b>"</div>'; return; }
      sr.innerHTML = found.map(function(m){
        var name = [m.firstName,m.lastName].filter(Boolean).join(' ')||'Unnamed';
        var av = m.photo ? '<img src="'+m.photo+'" alt=""/>' : (m.female?'👩':m.ancestor?'👴':'👨');
        var meta = [m.role, m.gen?'Gen '+m.gen:'', m.born?'b.'+m.born:''].filter(Boolean).join(' · ');
        return '<div class="item" onclick="nkCloseSearch();location.href=\'tree.html\'">'
          + '<div class="av">'+av+'</div>'
          + '<div><div class="nm">'+name+'</div><div class="mt">'+meta+'</div></div>'
          + '</div>';
      }).join('');
    });
  }

  window.nkOpenSearch = function(){
    buildSearch();
    document.getElementById('nk-search').classList.add('on');
    setTimeout(function(){ document.getElementById('nk-si').focus(); }, 80);
  };
  window.nkCloseSearch = function(){
    var el = document.getElementById('nk-search');
    if(el){
      el.classList.remove('on');
      document.getElementById('nk-si').value = '';
      document.getElementById('nk-sr').innerHTML = '<div class="empty">Start typing to search...</div>';
    }
  };

  document.addEventListener('keydown', function(e){
    if(e.key === 'Escape') nkCloseSearch();
    if((e.ctrlKey||e.metaKey) && e.key === 'k'){ e.preventDefault(); nkOpenSearch(); }
  });

  // ══════════════════════════════════════
  // 4. NAV BUTTONS
  // ══════════════════════════════════════
  function buildNavButtons(){
    var nav = document.querySelector('nav');
    if(!nav || nav.querySelector('.nk-dm')) return;

    var logout = nav.querySelector('.nav-logout');

    function addBtn(cls, text, fn, title){
      var b = document.createElement('button');
      b.className = 'nav-logout ' + cls;
      b.style.cssText = 'padding:6px 10px;font-size:13px;font-weight:500;min-width:34px;cursor:pointer;white-space:nowrap;flex-shrink:0;';
      b.textContent = text;
      b.title = title;
      b.onclick = fn;
      if(logout) nav.insertBefore(b, logout);
      else nav.appendChild(b);
      return b;
    }

    var isDark = localStorage.getItem(DK) === '1';
    addBtn('nk-search-btn', '🔍 Search', nkOpenSearch, 'Search (Ctrl+K)');
    addBtn('nk-dm', isDark ? '☀️' : '🌙', window.toggleDark, 'Toggle Dark/Light');
    addBtn('nk-lang', localStorage.getItem('nukala_lang')==='te' ? 'EN' : 'తె', window.toggleLang, 'Switch Language');
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
  var PAGE_FILE_MAP = {
    'home.html':'home','tree.html':'tree','history.html':'history',
    'gallery.html':'gallery','facts.html':'facts','stats.html':'stats',
    'events.html':'events','map.html':'map','polls.html':'polls',
    'recipes.html':'recipes','achievements.html':'achievements',
    'videos.html':'videos','qr.html':'qr','contact.html':'contact'
  };

  function applyPageVisibility(){
    var vis = JSON.parse(localStorage.getItem('nukala_page_vis')||'{}');
    if(!Object.keys(vis).length) return;
    var currentPage = location.pathname.split('/').pop() || 'home.html';
    var currentId = PAGE_FILE_MAP[currentPage];
    if(currentId && vis[currentId] === false){
      var overlay = document.createElement('div');
      overlay.style.cssText = 'position:fixed;inset:0;z-index:8000;background:rgba(250,248,244,.97);display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;';
      overlay.innerHTML = '<div style="font-size:56px;margin-bottom:16px;">🚧</div>'
        + '<h2 style="font-family:Cormorant Garamond,serif;font-size:2rem;font-weight:300;margin-bottom:8px;">Coming Soon</h2>'
        + '<p style="font-size:.9rem;color:#6b6b6b;margin-bottom:24px;">This page is not available yet.</p>'
        + '<a href="home.html" style="padding:12px 28px;background:#5c7a5c;color:white;border-radius:12px;text-decoration:none;font-size:.82rem;">← Back to Home</a>';
      document.body.appendChild(overlay);
    }
    document.querySelectorAll('nav .nav-links a').forEach(function(a){
      var href = a.getAttribute('href');
      var id = PAGE_FILE_MAP[href];
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
    var perm = await Notification.requestPermission();
    if(perm === 'granted'){
      var members = Object.values(JSON.parse(localStorage.getItem('nukala_tree_data')||'{}'));
      var contacts = JSON.parse(localStorage.getItem('nukala_contacts')||'{}');
      var today = new Date();
      var months = ['january','february','march','april','may','june','july','august','september','october','november','december'];
      members.forEach(function(m){
        var c = contacts[m.id]; if(!c||!c.birthday) return;
        var bd = c.birthday.toLowerCase();
        if(bd.includes(months[today.getMonth()]) && bd.includes(String(today.getDate()))){
          var name = [m.firstName,m.lastName].filter(Boolean).join(' ');
          new Notification('🎂 Birthday Today!',{body:'Today is '+name+"'s birthday!",icon:'logo.png'});
        }
      });
      alert('✅ Notifications enabled!');
    } else alert('Notifications blocked. Please allow in browser settings.');
  };

  if(!window.toggleLang) window.toggleLang = function(){};

})();
