/**
 * nukala.js — Dark mode, search, mobile nav, page visibility
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

    var style = document.createElement('style');
    style.id = 'nk-nav-style';
    style.textContent =
      /* Hamburger */
      '.nk-burger{display:none;flex-direction:column;justify-content:center;align-items:center;' +
      'gap:5px;width:36px;height:36px;background:none;border:1.5px solid #e8e2d8;' +
      'border-radius:8px;cursor:pointer;flex-shrink:0;margin-left:6px;padding:0;' +
      'transition:border-color 0.2s;position:relative;}' +
      '.nk-burger:hover{border-color:#8aab8a;}' +
      '[data-theme=dark] .nk-burger{border-color:#1e361e;}' +
      '.nk-burger span{display:block;width:18px;height:2px;background:#5c7a5c;border-radius:2px;' +
      'transition:all 0.25s ease;transform-origin:center;}' +
      '[data-theme=dark] .nk-burger span{background:#8acc8a;}' +
      '.nk-burger.open span:nth-child(1){transform:translateY(7px) rotate(45deg);}' +
      '.nk-burger.open span:nth-child(2){opacity:0;transform:scaleX(0);}' +
      '.nk-burger.open span:nth-child(3){transform:translateY(-7px) rotate(-45deg);}' +

      /* Dropdown panel — fully independent, NO nav-links class */
      '#nk-drop{display:none;position:fixed;left:0;right:0;z-index:9001;' +
      'background:#faf8f4;border-bottom:2px solid #c8ddc8;' +
      'box-shadow:0 8px 32px rgba(0,0,0,0.18);overflow-y:auto;' +
      '-webkit-overflow-scrolling:touch;}' +
      '[data-theme=dark] #nk-drop{background:#0e180e;border-color:#1e361e;}' +
      '#nk-drop.open{display:block;}' +
      '#nk-drop nav-item{display:block;}' +
      '.nk-drop-link{display:block!important;padding:14px 22px!important;' +
      'font-family:Jost,sans-serif;font-size:0.92rem;font-weight:500;' +
      'color:#2c2c2c!important;text-decoration:none!important;' +
      'border-bottom:1px solid rgba(0,0,0,0.06)!important;}' +
      '[data-theme=dark] .nk-drop-link{color:#e8d5a0!important;border-color:rgba(255,255,255,0.06)!important;}' +
      '.nk-drop-link:hover,.nk-drop-link:active{background:rgba(92,122,92,0.1)!important;}' +
      '.nk-drop-link.active{color:#5c7a5c!important;font-weight:600!important;}' +
      '[data-theme=dark] .nk-drop-link.active{color:#8acc8a!important;}' +

      /* Backdrop */
      '#nk-back{display:none;position:fixed;inset:0;z-index:9000;background:rgba(0,0,0,0.25);}' +
      '#nk-back.open{display:block;}' +

      /* Mobile styles */
      '@media(max-width:768px){' +
      'nav{position:fixed!important;top:0;left:0;right:0;z-index:100!important;' +
      'height:auto!important;min-height:56px!important;padding:0 14px!important;' +
      'flex-wrap:nowrap!important;overflow:visible!important;}' +
      '.nav-brand{padding:12px 0;flex:1;min-width:0;}' +
      '.nav-brand img{width:26px!important;height:26px!important;}' +
      '.nav-brand .nav-site-name{font-size:0.95rem!important;}' +
      '.nav-links{display:none!important;}' +
      '.nk-burger{display:flex!important;}' +
      '.nav-logout{padding:5px 7px!important;font-size:11px!important;flex-shrink:0;}' +
      'main{padding-top:64px!important;}' +
      '}';

    document.head.appendChild(style);

    var nav = document.querySelector('nav');
    if(!nav || document.querySelector('.nk-burger')) return;

    // Create hamburger
    var burger = document.createElement('button');
    burger.className = 'nk-burger';
    burger.type = 'button';
    burger.setAttribute('aria-label', 'Open menu');
    burger.innerHTML = '<span></span><span></span><span></span>';
    nav.appendChild(burger);

    // Build dropdown by reading nav links directly — NO cloneNode
    // This avoids inheriting .nav-links CSS which has display:none !important
    var drop = document.createElement('div');
    drop.id = 'nk-drop';

    var currentPage = location.pathname.split('/').pop() || 'home.html';
    var links = nav.querySelectorAll('.nav-links a');
    
    if(links.length === 0){
      // Fallback: build from scratch if links not found yet
      drop.innerHTML = '<p style="padding:20px;color:#aaa;font-size:.8rem;">Loading...</p>';
    } else {
      var html = '';
      links.forEach(function(a){
        var href = a.getAttribute('href') || '#';
        var text = a.textContent.trim();
        var isActive = href === currentPage ? ' active' : '';
        html += '<a class="nk-drop-link' + isActive + '" href="' + href + '">' + text + '</a>';
      });
      drop.innerHTML = html;
    }
    document.body.appendChild(drop);

    // Backdrop
    var back = document.createElement('div');
    back.id = 'nk-back';
    document.body.appendChild(back);

    // Position dropdown below nav
    function position(){
      var r = nav.getBoundingClientRect();
      drop.style.top = Math.round(r.bottom) + 'px';
      drop.style.maxHeight = (window.innerHeight - Math.round(r.bottom) - 10) + 'px';
    }

    function open(){
      // Rebuild links each time (in case lang changed them)
      var ls = nav.querySelectorAll('.nav-links a');
      if(ls.length > 0){
        var h = '';
        ls.forEach(function(a){
          var href = a.getAttribute('href') || '#';
          var text = a.textContent.trim();
          var isActive = href === currentPage ? ' active' : '';
          h += '<a class="nk-drop-link' + isActive + '" href="' + href + '">' + text + '</a>';
        });
        drop.innerHTML = h;
        // Re-wire close on click
        drop.querySelectorAll('.nk-drop-link').forEach(function(a){
          a.addEventListener('click', close);
        });
      }
      position();
      burger.classList.add('open');
      drop.classList.add('open');
      back.classList.add('open');
      // iOS safe: no body overflow lock
    }

    function close(){
      burger.classList.remove('open');
      drop.classList.remove('open');
      back.classList.remove('open');
      
    }

    burger.addEventListener('click', function(e){
      e.stopPropagation();
      if(drop.classList.contains('open')) close(); else open();
    });

    back.addEventListener('click', close);

    window.addEventListener('resize', function(){
      if(drop.classList.contains('open')) position();
    });
    window.addEventListener('orientationchange', function(){
      setTimeout(function(){ close(); }, 100);
    });
  }

  // ══════════════════════════════════════
  // 3. SEARCH OVERLAY
  // ══════════════════════════════════════
  function buildSearch(){
    if(document.getElementById('nk-search')) return;
    var css = document.createElement('style');
    css.textContent =
      '#nk-search{position:fixed;inset:0;z-index:99999;background:rgba(0,0,0,.55);' +
      'backdrop-filter:blur(6px);display:none;align-items:flex-start;' +
      'justify-content:center;padding-top:80px;}' +
      '#nk-search.on{display:flex;}' +
      '#nk-search .box{background:#fff;border-radius:18px;width:92%;max-width:560px;' +
      'overflow:hidden;box-shadow:0 20px 60px rgba(0,0,0,.2);}' +
      '#nk-search .bar{display:flex;align-items:center;gap:10px;padding:16px 18px;' +
      'border-bottom:1px solid #e8e2d8;}' +
      '#nk-search input{flex:1;border:none;outline:none;font-size:.95rem;' +
      'font-family:inherit;background:transparent;color:#2c2c2c;}' +
      '#nk-search .cls{background:none;border:none;font-size:1rem;cursor:pointer;color:#aaa;padding:2px 8px;}' +
      '#nk-search .res{max-height:360px;overflow-y:auto;}' +
      '#nk-search .item{display:flex;align-items:center;gap:12px;padding:11px 18px;' +
      'cursor:pointer;border-bottom:1px solid #f5f2ee;transition:background .1s;}' +
      '#nk-search .item:hover{background:#f5faf5;}' +
      '#nk-search .av{width:36px;height:36px;border-radius:50%;background:#c8ddc8;' +
      'display:flex;align-items:center;justify-content:center;font-size:15px;flex-shrink:0;overflow:hidden;}' +
      '#nk-search .av img{width:100%;height:100%;object-fit:cover;}' +
      '#nk-search .nm{font-size:.9rem;font-weight:500;color:#2c2c2c;}' +
      '#nk-search .mt{font-size:.7rem;color:#aaa;}' +
      '#nk-search .empty{padding:28px;text-align:center;color:#aaa;font-size:.85rem;}' +
      '#nk-search .foot{padding:10px 18px;font-size:.7rem;color:#bbb;text-align:center;border-top:1px solid #e8e2d8;}' +
      '[data-theme=dark] #nk-search .box{background:#131f13;}' +
      '[data-theme=dark] #nk-search input{color:#e8d5a0;}' +
      '[data-theme=dark] #nk-search .item:hover{background:#1a2a1a;}' +
      '[data-theme=dark] #nk-search .nm{color:#e8d5a0;}' +
      '[data-theme=dark] #nk-search .bar,[data-theme=dark] #nk-search .foot{border-color:#1e361e;}' +
      '@media(max-width:768px){#nk-search{padding-top:70px;}}';
    document.head.appendChild(css);

    var el = document.createElement('div');
    el.id = 'nk-search';
    el.innerHTML = '<div class="box">' +
      '<div class="bar"><span>🔍</span>' +
      '<input id="nk-si" placeholder="Search family members..." autocomplete="off"/>' +
      '<button class="cls" onclick="nkCloseSearch()">✕</button>' +
      '</div>' +
      '<div class="res" id="nk-sr"><div class="empty">Start typing to search...</div></div>' +
      '<div class="foot">Press Esc to close</div>' +
      '</div>';
    document.body.appendChild(el);
    el.addEventListener('click', function(e){ if(e.target===el) nkCloseSearch(); });

    document.getElementById('nk-si').addEventListener('input', function(){
      var q = this.value.trim().toLowerCase();
      var members = Object.values(JSON.parse(localStorage.getItem('nukala_tree_data')||'{}'));
      var sr = document.getElementById('nk-sr');
      if(!q){ sr.innerHTML='<div class="empty">Start typing to search...</div>'; return; }
      var found = members.filter(function(m){
        return [m.firstName,m.lastName,m.role,m.place].join(' ').toLowerCase().includes(q);
      }).slice(0,10);
      if(!found.length){ sr.innerHTML='<div class="empty">No results for "<b>'+q+'</b>"</div>'; return; }
      sr.innerHTML = found.map(function(m){
        var name=[m.firstName,m.lastName].filter(Boolean).join(' ')||'Unnamed';
        var av=m.photo?'<img src="'+m.photo+'" alt=""/>':(m.female?'👩':m.ancestor?'👴':'👨');
        var meta=[m.role,m.gen?'Gen '+m.gen:'',m.born?'b.'+m.born:''].filter(Boolean).join(' · ');
        return '<div class="item" onclick="nkCloseSearch();location.href=\'tree.html\'">' +
          '<div class="av">'+av+'</div>' +
          '<div><div class="nm">'+name+'</div><div class="mt">'+meta+'</div></div>' +
          '</div>';
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
      document.getElementById('nk-si').value='';
      document.getElementById('nk-sr').innerHTML='<div class="empty">Start typing to search...</div>';
    }
  };
  document.addEventListener('keydown', function(e){
    if(e.key==='Escape') nkCloseSearch();
    if((e.ctrlKey||e.metaKey)&&e.key==='k'){ e.preventDefault(); nkOpenSearch(); }
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
      b.textContent = text; b.title = title; b.onclick = fn;
      if(logout) nav.insertBefore(b, logout); else nav.appendChild(b);
    }
    var isDark = localStorage.getItem(DK)==='1';
    addBtn('nk-search-btn','🔍 Search',nkOpenSearch,'Search (Ctrl+K)');
    addBtn('nk-dm', isDark?'☀️':'🌙', window.toggleDark, 'Toggle Dark/Light');
    addBtn('nk-lang', localStorage.getItem('nukala_lang')==='te'?'EN':'తె', window.toggleLang, 'Switch Language');
  }

  // ══════════════════════════════════════
  // 5. FOOTER — year + name + sub from admin
  // ══════════════════════════════════════
  function applyFooter(){
    var sw = JSON.parse(localStorage.getItem('nukala_sitewide')||'null')||{};
    var s  = JSON.parse(localStorage.getItem('nukala_settings')||'null')||{};
    // Year: custom from admin OR current year
    var year = sw.footerYear || new Date().getFullYear();
    var name = sw.footerName || (s.familyName ? 'The '+s.familyName+' Family' : null);
    var sub  = sw.footerSub  || null;
    var fy = document.getElementById('footerYear');  if(fy) fy.textContent = year;
    var fn = document.getElementById('footerText');  if(fn && name) fn.textContent = name;
    var fs = document.getElementById('footerSub');   if(fs && sub) fs.innerHTML = sub;
  }

  // ══════════════════════════════════════
  // 6. INIT
  // ══════════════════════════════════════
  function applyNavNames(){
    var menu = JSON.parse(localStorage.getItem('nukala_navmenu')||'null');
    var vis  = JSON.parse(localStorage.getItem('nukala_page_vis')||'{}');
    if(!menu || !menu.items) return;
    var map = {};
    menu.items.forEach(function(item){ map[item.href] = item; });
    document.querySelectorAll('nav .nav-links a').forEach(function(a){
      var href = a.getAttribute('href');
      if(!href) return;
      var item = map[href];
      // Apply custom label
      if(item && item.label) a.textContent = item.label;
      // Hide if disabled in navmenu OR in page_vis
      var li = a.parentElement;
      if(!li) return;
      var pageId = href.replace('.html','');
      var hiddenByNavMenu = item && item.active === false;
      var hiddenByVis     = vis[pageId] === false;
      li.style.display = (hiddenByNavMenu || hiddenByVis) ? 'none' : '';
    });

  }



  function init(){
    buildNavButtons();
    buildMobileNav();
    applyFooter();
    applyNavNames();

  }
  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded', init);
  } else { init(); }

  // Rebuild More menu on resize

  // ══════════════════════════════════════
  // 7. PAGE VISIBILITY
  // ══════════════════════════════════════
  var PAGE_FILE_MAP = {
    'home.html':'home','tree.html':'tree','history.html':'history',
    'gallery.html':'gallery','facts.html':'facts','stats.html':'stats',
    'events.html':'events','map.html':'map','polls.html':'polls',
    'recipes.html':'recipes',
    'videos.html':'videos','qr.html':'qr','contact.html':'contact'
  };
  function applyPageVisibility(){
    var vis = JSON.parse(localStorage.getItem('nukala_page_vis')||'{}');
    if(!Object.keys(vis).length) return;
    var cur = location.pathname.split('/').pop()||'home.html';
    var id  = PAGE_FILE_MAP[cur];
    if(id && vis[id]===false){
      var ov = document.createElement('div');
      ov.style.cssText='position:fixed;inset:0;z-index:8000;background:rgba(250,248,244,.97);display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;';
      ov.innerHTML='<div style="font-size:56px;margin-bottom:16px;">🚧</div>' +
        '<h2 style="font-family:Cormorant Garamond,serif;font-size:2rem;font-weight:300;margin-bottom:8px;">Coming Soon</h2>' +
        '<p style="font-size:.9rem;color:#6b6b6b;margin-bottom:24px;">This page is not available yet.</p>' +
        '<a href="home.html" style="padding:12px 28px;background:#5c7a5c;color:white;border-radius:12px;text-decoration:none;font-size:.82rem;">← Back to Home</a>';
      document.body.appendChild(ov);
    }
    document.querySelectorAll('nav .nav-links a').forEach(function(a){
      var href=a.getAttribute('href'), pid=PAGE_FILE_MAP[href];
      if(pid&&vis[pid]===false) a.parentElement.style.display='none';
      else a.parentElement.style.display='';
    });
  }
  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded', applyPageVisibility);
  } else { applyPageVisibility(); }

  // ══════════════════════════════════════
  // 8. BIRTHDAY NOTIFICATIONS
  // ══════════════════════════════════════
  window.enableNotifications = async function(){
    if(!('Notification' in window)){ alert('Notifications not supported.'); return; }
    var perm = await Notification.requestPermission();
    if(perm==='granted'){
      var members=Object.values(JSON.parse(localStorage.getItem('nukala_tree_data')||'{}'));
      var contacts=JSON.parse(localStorage.getItem('nukala_contacts')||'{}');
      var today=new Date();
      var months=['january','february','march','april','may','june','july','august','september','october','november','december'];
      members.forEach(function(m){
        var c=contacts[m.id]; if(!c||!c.birthday) return;
        var bd=c.birthday.toLowerCase();
        if(bd.includes(months[today.getMonth()])&&bd.includes(String(today.getDate()))){
          var name=[m.firstName,m.lastName].filter(Boolean).join(' ');
          new Notification('🎂 Birthday Today!',{body:'Today is '+name+"'s birthday!",icon:'logo.png'});
        }
      });
      alert('✅ Notifications enabled!');
    } else alert('Notifications blocked.');
  };

  
  // ══════════════════════════════════════
  // SECRET ADMIN ACCESS
  // ══════════════════════════════════════
  function goAdmin(){ window.location.href = 'admin.html'; }

  // Method 1: Keyboard shortcut — Ctrl+Shift+A (or Cmd+Shift+A on Mac)
  document.addEventListener('keydown', function(e){
    if((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'A'){
      e.preventDefault();
      goAdmin();
    }
  });

  // Method 2: Triple-click the nav logo
  (function(){
    var clicks = 0, timer = null;
    function attachLogoClick(){
      var brand = document.querySelector('.nav-brand');
      if(!brand) return;
      brand.addEventListener('click', function(e){
        e.preventDefault();
        clicks++;
        clearTimeout(timer);
        if(clicks >= 3){
          clicks = 0;
          goAdmin();
          return;
        }
        timer = setTimeout(function(){
          // Navigate on single or double click (only triple goes to admin)
          if(clicks >= 1) window.location.href = brand.getAttribute('href') || 'home.html';
          clicks = 0;
        }, 600);
      });
    }
    if(document.readyState === 'loading'){
      document.addEventListener('DOMContentLoaded', attachLogoClick);
    } else {
      attachLogoClick();
    }
  })();

  // Method 3: Tap footer copyright © symbol 3 times quickly
  (function(){
    var taps = 0, timer = null;
    document.addEventListener('DOMContentLoaded', function(){
      var footer = document.querySelector('footer');
      if(!footer) return;
      footer.addEventListener('click', function(e){
        taps++;
        clearTimeout(timer);
        if(taps >= 3){ taps = 0; goAdmin(); return; }
        timer = setTimeout(function(){ taps = 0; }, 800);
      });
    });
  })();



  // ══════════════════════════════════════
  // 9. TODAY'S OCCASION BANNER (shown to all family members)
  // ══════════════════════════════════════
  function checkTodayOccasions(){
    // Only run on content pages, not index/admin
    var page = location.pathname.split('/').pop()||'home.html';
    if(page==='index.html'||page==='admin.html') return;

    var now=new Date(), month=now.getMonth()+1, day=now.getDate();
    var MONTHS_L=['January','February','March','April','May','June','July','August','September','October','November','December'];
    var MONTHS_S=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var found=[];

    // Check custom wishes
    try{
      var wishes=JSON.parse(localStorage.getItem('nukala_wishes')||'[]');
      wishes.forEach(function(w){
        if(parseInt(w.month)===month&&parseInt(w.day)===day){
          found.push({type:w.type||'Custom',title:w.title,people:w.people,msg:w.msg});
        }
      });
    }catch(e){}

    // Check events
    try{
      var events=JSON.parse(localStorage.getItem('nukala_events')||'[]');
      events.forEach(function(e){
        if(!e.date) return;
        var p=e.date.split('-');
        if(p.length<3) return;
        if(parseInt(p[1])===month&&parseInt(p[2])===day){
          found.push({type:e.type||'Event',title:e.title,people:e.title,msg:''});
        }
      });
    }catch(e){}

    // Check member birthdays
    try{
      var members=Object.values(JSON.parse(localStorage.getItem('nukala_tree_data')||'{}'));
      var contacts=JSON.parse(localStorage.getItem('nukala_contacts')||'{}');
      members.forEach(function(m){
        var c=contacts[m.id]; if(!c||!c.birthday) return;
        var bday=c.birthday.toLowerCase();
        var ml=MONTHS_L[month-1].toLowerCase(), ms=MONTHS_S[month-1].toLowerCase();
        if((bday.includes(ml)||bday.includes(ms))&&bday.includes(String(day))){
          var name=[m.firstName,m.lastName].filter(Boolean).join(' ');
          found.push({type:'Birthday',title:name+' Birthday',people:name,msg:''});
        }
      });
    }catch(e){}

    if(!found.length) return;

    // Build banner
    var emoji={Birthday:'🎂',Anniversary:'💍',Memorial:'🕯️',Achievement:'🏆',Festival:'🎊',Event:'📅'};
    var banner=document.createElement('div');
    banner.id='nk-occasion-banner';
    banner.style.cssText='position:fixed;bottom:80px;left:50%;transform:translateX(-50%);'
      +'z-index:8999;background:linear-gradient(135deg,#fdfaf4,#f0f8f0);'
      +'border:1.5px solid #c9a84c;border-radius:16px;padding:14px 20px;'
      +'box-shadow:0 8px 30px rgba(0,0,0,0.12);max-width:480px;width:90%;'
      +'display:flex;align-items:flex-start;gap:14px;';

    var content='<div style="flex:1;">';
    found.forEach(function(o){
      var em=emoji[o.type]||'⭐';
      var waMsg=o.msg||(em+' Happy '+o.type+' - '+o.people+'! Wishing you a wonderful day! 🎉 — The Nukala Family');
      var waUrl='https://wa.me/?text='+encodeURIComponent(waMsg);
      content+='<div style="margin-bottom:8px;">'
        +'<span style="font-size:1.1rem;margin-right:6px;">'+em+'</span>'
        +'<strong style="font-size:.85rem;color:#2c2c2c;">'+o.title+'</strong>'
        +'<a href="'+waUrl+'" target="_blank" style="margin-left:10px;background:linear-gradient(135deg,#128c7e,#25d366);'
        +'color:white;text-decoration:none;border-radius:7px;padding:3px 10px;'
        +'font-size:.7rem;font-weight:500;white-space:nowrap;">📱 Send Wish</a>'
        +'</div>';
    });
    content+='</div>';

    var close='<button onclick="(function(){var b=document.getElementById(\'nk-occasion-banner\');if(b)b.remove();})()" '
      +'style="background:none;border:none;font-size:1rem;cursor:pointer;color:#aaa;'
      +'padding:0;flex-shrink:0;line-height:1;">✕</button>';

    banner.innerHTML=content+close;

    // Show after short delay so page is ready
    setTimeout(function(){
      if(!document.getElementById('nk-occasion-banner')){
        document.body.appendChild(banner);
        // Auto-hide after 30 seconds
        setTimeout(function(){
          var b=document.getElementById('nk-occasion-banner');
          if(b) b.remove();
        }, 30000);
      }
    }, 1500);
  }

  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded', checkTodayOccasions);
  } else { checkTodayOccasions(); }

  if(!window.toggleLang) window.toggleLang = function(){};
})();
