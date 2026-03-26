// Language support — English & Telugu
const TRANSLATIONS={
  en:{ home:'Home', tree:'Family Tree', history:'History', gallery:'Gallery', facts:'Facts', contact:'Contact', stats:'Stats', events:'Events', recipes:'Recipes', achievements:'Achievements', videos:'Videos', map:'Map', polls:'Polls', signout:'Sign Out', search:'Search' },
  te:{ home:'హోమ్', tree:'కుటుంబ వృక్షం', history:'చరిత్ర', gallery:'గ్యాలరీ', facts:'వాస్తవాలు', contact:'సంప్రదించండి', stats:'గణాంకాలు', events:'కార్యక్రమాలు', recipes:'వంటకాలు', achievements:'విజయాలు', videos:'వీడియోలు', map:'మ్యాప్', polls:'పోల్స్', signout:'సైన్ అవుట్', search:'శోధన' }
};
(function(){
  const LANG_KEY='nukala_lang';
  function applyLang(lang){
    const t=TRANSLATIONS[lang]||TRANSLATIONS.en;
    localStorage.setItem(LANG_KEY,lang);
    document.querySelectorAll('[data-lang]').forEach(el=>{ if(t[el.dataset.lang]) el.textContent=t[el.dataset.lang]; });
    document.querySelectorAll('.lang-toggle-btn').forEach(b=>b.textContent=lang==='en'?'తె':'EN');
  }
  window.toggleLang=function(){ applyLang(localStorage.getItem(LANG_KEY)==='te'?'en':'te'); };
  const saved=localStorage.getItem(LANG_KEY)||'en';
  document.addEventListener('DOMContentLoaded',()=>{
    applyLang(saved);
    document.querySelectorAll('nav .nav-logout').forEach(btn=>{
      const lb=document.createElement('button');
      lb.className='nav-logout lang-toggle-btn'; lb.onclick=window.toggleLang;
      lb.textContent=saved==='en'?'తె':'EN'; lb.title='Switch Language / భాష మార్చండి';
      btn.parentNode.insertBefore(lb,btn);
    });
  });
})();
