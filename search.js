// Global family member search
(function(){
  const style=document.createElement('style');
  style.textContent=`
    #globalSearch{position:fixed;top:0;left:0;right:0;bottom:0;z-index:500;background:rgba(0,0,0,0.6);backdrop-filter:blur(8px);display:none;align-items:flex-start;justify-content:center;padding-top:80px;}
    #globalSearch.open{display:flex;}
    .gs-box{background:white;border-radius:20px;width:90%;max-width:600px;overflow:hidden;box-shadow:0 24px 64px rgba(0,0,0,0.2);}
    .gs-input-wrap{display:flex;align-items:center;gap:12px;padding:18px 20px;border-bottom:1px solid #e8e2d8;}
    .gs-input{flex:1;border:none;outline:none;font-size:1.1rem;font-family:'Jost',sans-serif;color:#2c2c2c;background:transparent;}
    .gs-close{background:none;border:none;font-size:1.2rem;cursor:pointer;color:#a0a0a0;padding:4px;}
    .gs-results{max-height:420px;overflow-y:auto;}
    .gs-item{display:flex;align-items:center;gap:14px;padding:14px 20px;cursor:pointer;transition:background .15s;border-bottom:1px solid #f0ede8;}
    .gs-item:hover{background:#f5faf5;}
    .gs-avatar{width:42px;height:42px;border-radius:50%;background:#c8ddc8;display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0;overflow:hidden;}
    .gs-avatar img{width:100%;height:100%;object-fit:cover;}
    .gs-name{font-family:'Cormorant Garamond',serif;font-size:1.05rem;font-weight:600;color:#2c2c2c;}
    .gs-meta{font-size:.75rem;color:#a0a0a0;}
    .gs-empty{padding:40px;text-align:center;color:#a0a0a0;font-size:.9rem;}
    .gs-hint{padding:16px 20px;font-size:.75rem;color:#a0a0a0;text-align:center;border-top:1px solid #e8e2d8;}
    .search-trigger{background:rgba(255,255,255,0.9);border:1.5px solid #e8e2d8;border-radius:20px;padding:6px 14px;font-size:.75rem;color:#6b6b6b;cursor:pointer;font-family:'Jost',sans-serif;transition:all .2s;display:flex;align-items:center;gap:6px;}
    .search-trigger:hover{border-color:#8aab8a;color:#5c7a5c;}
    [data-theme="dark"] .gs-box{background:#1a2a1a;} [data-theme="dark"] .gs-input{color:#e8d5a0;} [data-theme="dark"] .gs-item{border-color:#2a3a2a;} [data-theme="dark"] .gs-item:hover{background:#2a3a2a;} [data-theme="dark"] .gs-name{color:#e8d5a0;}
  `;
  document.head.appendChild(style);

  const overlay=document.createElement('div');
  overlay.id='globalSearch';
  overlay.innerHTML=`
    <div class="gs-box">
      <div class="gs-input-wrap">
        <span style="font-size:18px;">🔍</span>
        <input class="gs-input" id="gsInput" placeholder="Search family members..." autocomplete="off"/>
        <button class="gs-close" onclick="closeSearch()">✕</button>
      </div>
      <div class="gs-results" id="gsResults"><div class="gs-empty">Start typing to search...</div></div>
      <div class="gs-hint">Press <kbd style="background:#f0f0f0;padding:2px 6px;border-radius:4px;font-size:.7rem;">Esc</kbd> to close · Click a member to view their profile</div>
    </div>`;
  document.body.appendChild(overlay);

  document.getElementById('gsInput').addEventListener('input', function(){
    const q=this.value.trim().toLowerCase();
    const members=Object.values(JSON.parse(localStorage.getItem('nukala_tree_data')||'{}'));
    if(!q){ document.getElementById('gsResults').innerHTML='<div class="gs-empty">Start typing to search...</div>'; return; }
    const results=members.filter(m=>[m.firstName,m.lastName,m.role,m.place,m.occupation].join(' ').toLowerCase().includes(q));
    if(!results.length){ document.getElementById('gsResults').innerHTML='<div class="gs-empty">No family members found for "'+q+'"</div>'; return; }
    document.getElementById('gsResults').innerHTML=results.slice(0,12).map(m=>{
      const name=[m.firstName,m.lastName].filter(Boolean).join(' ')||'Unnamed';
      const avatar=m.photo?`<img src="${m.photo}" alt="${name}"/>`:(m.female?'👩':m.ancestor?'👴':'👨');
      return `<div class="gs-item" onclick="window.location.href='tree.html'">
        <div class="gs-avatar">${avatar}</div>
        <div><div class="gs-name">${name}</div><div class="gs-meta">${m.role||''} ${m.gen?'· Gen '+m.gen:''} ${m.born?'· b.'+m.born:''}</div></div>
      </div>`;
    }).join('');
  });

  window.openSearch=function(){
    overlay.classList.add('open');
    setTimeout(()=>document.getElementById('gsInput').focus(),100);
  };
  window.closeSearch=function(){
    overlay.classList.remove('open');
    document.getElementById('gsInput').value='';
    document.getElementById('gsResults').innerHTML='<div class="gs-empty">Start typing to search...</div>';
  };
  overlay.addEventListener('click',e=>{ if(e.target===overlay) closeSearch(); });
  document.addEventListener('keydown',e=>{ if(e.key==='Escape') closeSearch(); if((e.ctrlKey||e.metaKey)&&e.key==='k'){ e.preventDefault(); openSearch(); }});

  // Add search button to nav
  document.addEventListener('DOMContentLoaded',()=>{
    document.querySelectorAll('nav .nav-logout').forEach(btn=>{
      const sb=document.createElement('button');
      sb.className='search-trigger';
      sb.onclick=openSearch;
      sb.innerHTML='🔍 Search <span style="font-size:.65rem;background:#e8e2d8;padding:1px 5px;border-radius:4px;margin-left:4px;">Ctrl+K</span>';
      btn.parentNode.insertBefore(sb,btn);
    });
  });
})();
