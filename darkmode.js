// Dark mode toggle — persists across sessions
(function(){
  const DARK_KEY='nukala_dark_mode';
  function applyDark(on){
    document.documentElement.setAttribute('data-theme', on?'dark':'light');
    localStorage.setItem(DARK_KEY, on?'1':'0');
    document.querySelectorAll('.dark-toggle-btn').forEach(b=>{
      b.innerHTML = on ? '☀️' : '🌙';
      b.title = on ? 'Switch to Light Mode' : 'Switch to Dark Mode';
    });
  }
  // Apply on load
  const saved = localStorage.getItem(DARK_KEY);
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  applyDark(saved !== null ? saved==='1' : prefersDark);
  // Expose toggle
  window.toggleDarkMode = function(){ applyDark(localStorage.getItem(DARK_KEY)!=='1'); };
  // Add button to nav when DOM ready
  document.addEventListener('DOMContentLoaded',()=>{
    document.querySelectorAll('nav .nav-logout').forEach(btn=>{
      const dmBtn=document.createElement('button');
      dmBtn.className='nav-logout dark-toggle-btn';
      dmBtn.style.cssText='padding:7px 10px;font-size:16px;line-height:1;';
      dmBtn.onclick=window.toggleDarkMode;
      const isDark=localStorage.getItem(DARK_KEY)==='1';
      dmBtn.innerHTML=isDark?'☀️':'🌙';
      dmBtn.title=isDark?'Switch to Light Mode':'Switch to Dark Mode';
      btn.parentNode.insertBefore(dmBtn,btn);
    });
  });
})();
