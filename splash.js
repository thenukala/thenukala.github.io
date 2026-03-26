// Splash screen — shows on first visit each session
(function(){
  if(sessionStorage.getItem('nukala_splash_shown')) return;
  sessionStorage.setItem('nukala_splash_shown','true');
  const splash = document.createElement('div');
  splash.id='nukala-splash';
  splash.innerHTML=`
    <style>
      #nukala-splash{position:fixed;inset:0;z-index:9999;background:linear-gradient(135deg,#1a2e1a 0%,#2d4a2d 50%,#1a2e1a 100%);display:flex;flex-direction:column;align-items:center;justify-content:center;transition:opacity .8s ease;}
      #nukala-splash.fade{opacity:0;pointer-events:none;}
      .splash-logo{width:140px;height:140px;object-fit:contain;animation:splashPop .8s cubic-bezier(0.16,1,0.3,1) forwards;opacity:0;filter:drop-shadow(0 8px 32px rgba(201,168,76,0.4));}
      @keyframes splashPop{from{opacity:0;transform:scale(0.6) rotate(-10deg)}to{opacity:1;transform:scale(1) rotate(0)}}
      .splash-name{font-family:'Cormorant Garamond',Georgia,serif;font-size:3rem;font-weight:300;color:#e8d5a0;letter-spacing:.2em;margin-top:20px;animation:splashFadeUp 1s .4s ease forwards;opacity:0;}
      @keyframes splashFadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
      .splash-sub{font-family:'Jost',sans-serif;font-size:.75rem;font-weight:400;letter-spacing:.3em;text-transform:uppercase;color:rgba(232,213,160,0.6);margin-top:10px;animation:splashFadeUp 1s .7s ease forwards;opacity:0;}
      .splash-dots{display:flex;gap:8px;margin-top:32px;animation:splashFadeUp 1s 1s ease forwards;opacity:0;}
      .splash-dot{width:6px;height:6px;border-radius:50%;background:rgba(232,213,160,0.4);animation:splashDot 1.2s 1.2s ease-in-out infinite;}
      .splash-dot:nth-child(2){animation-delay:1.4s;}
      .splash-dot:nth-child(3){animation-delay:1.6s;}
      @keyframes splashDot{0%,100%{opacity:.3;transform:scale(1)}50%{opacity:1;transform:scale(1.4)}}
    </style>
    <img class="splash-logo" src="logo.png" alt="Nukala"/>
    <div class="splash-name" id="splashFamilyName">NUKALA</div>
    <div class="splash-sub">Family Archive</div>
    <div class="splash-dots"><div class="splash-dot"></div><div class="splash-dot"></div><div class="splash-dot"></div></div>
  `;
  document.body.appendChild(splash);

  // Read family name from settings
  try{
    const s=JSON.parse(localStorage.getItem('nukala_settings')||'{}');
    const h=JSON.parse(localStorage.getItem('nukala_home')||'{}');
    const name=h.navName||s.familyName||'NUKALA';
    document.getElementById('splashFamilyName').textContent=name.toUpperCase();
  }catch(e){}

  setTimeout(()=>{ splash.classList.add('fade'); setTimeout(()=>splash.remove(),900); },2400);
})();
