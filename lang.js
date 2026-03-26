/**
 * lang.js — Full page English / Telugu translation
 * Uses data-en / data-te attributes on any element
 * Falls back to nav link text translation for unlabelled elements
 */
(function(){
  const LK = 'nukala_lang';

  // ── Full translations ──
  const T = {
    en: {
      // Nav
      home:'Home', tree:'Family Tree', history:'History', gallery:'Gallery',
      facts:'Facts', stats:'Stats', events:'Events', map:'Map', polls:'Polls',
      recipes:'Recipes', achievements:'Achievements', videos:'Videos',
      share:'Share', contact:'Contact',
      // Common UI
      signin:'Sign In', signout:'Sign Out', search:'Search',
      admin:'Admin Panel', viewsite:'View Site',
      // Home page
      'welcome-eyebrow':'Welcome to the',
      'hero-title':'The Nukala Family Archive',
      'hero-tagline':'A private space to celebrate our roots, preserve our stories, and stay connected across generations.',
      'stat1-lbl':'Generations', 'stat2-lbl':'Family Members', 'stat3-lbl':'Stories Shared',
      'about-heading':'Our Roots Run Deep',
      'about-p1':'Welcome to the Nukala Family Tree — a private, members-only archive.',
      'about-p2':'This site is a living record of who we are: our ancestors, our stories, our photos.',
      'recent-updates':'Recent Updates',
      // Quick nav cards
      'card-tree-title':'Family Tree', 'card-tree-desc':'Explore our family connections and lineage.',
      'card-history-title':'Our History', 'card-history-desc':'Read stories and milestones.',
      'card-gallery-title':'Photo Gallery', 'card-gallery-desc':'Browse cherished photos.',
      'card-contact-title':'Get in Touch', 'card-contact-desc':'Contribute your stories.',
      // History
      'history-eyebrow':'Our Story',
      'history-title':'The Nukala Family History',
      'history-subtitle':'A journey through time — the milestones, moments and memories.',
      'add-story':'+ Add a Story',
      // Gallery
      'gallery-eyebrow':'Memories',
      'gallery-title':'The Nukala Photo Gallery',
      'gallery-subtitle':'A visual archive of cherished moments across the years.',
      'filter-all':'All Photos', 'filter-family':'Family', 'filter-vintage':'Vintage',
      'filter-celebrations':'Celebrations', 'filter-travel':'Travel', 'filter-other':'Other',
      // Facts
      'facts-eyebrow':'Did You Know?',
      'facts-title':'Interesting Family Facts',
      'facts-subtitle':'Fascinating milestones, achievements and traditions.',
      'filter-achievements':'Achievements', 'filter-milestones':'Milestones',
      'filter-traditions':'Traditions', 'filter-records':'Records',
      'filter-fun':'Fun Facts',
      // Tree
      'tree-eyebrow':'Explore',
      'tree-title':'The Nukala Family Tree',
      'tree-subtitle':'Click any person to view details.',
      'btn-fit':'Fit to Screen', 'btn-reset':'Reset View',
      'lines-on':'Lines On', 'lines-off':'Lines Off',
      // Contact
      'contact-eyebrow':'Contribute',
      'contact-title':'Get In Touch',
      'contact-subtitle':'Have a story to share or a photo to contribute?',
      'form-firstname':'First Name', 'form-lastname':'Last Name',
      'form-email':'Email Address', 'form-subject':'What would you like to do?',
      'form-message':'Your Message', 'form-submit':'Send Message →',
      // Footer
      'footer-text':'Private & Password Protected · Made with 🌳 & love',
    },
    te: {
      // Nav
      home:'హోమ్', tree:'కుటుంబ వృక్షం', history:'చరిత్ర', gallery:'గ్యాలరీ',
      facts:'వాస్తవాలు', stats:'గణాంకాలు', events:'కార్యక్రమాలు', map:'మ్యాప్',
      polls:'పోల్స్', recipes:'వంటకాలు', achievements:'విజయాలు', videos:'వీడియోలు',
      share:'షేర్', contact:'సంప్రదించండి',
      // Common UI
      signin:'లాగిన్', signout:'నిష్క్రమించు', search:'శోధించు',
      admin:'నిర్వాహకుడు', viewsite:'సైట్ చూడు',
      // Home page
      'welcome-eyebrow':'స్వాగతం',
      'hero-title':'నుకాల కుటుంబ సంగ్రహశాల',
      'hero-tagline':'మన మూలాలను వేడుక చేసుకోవడానికి, మన కథలను భద్రపరచడానికి ఒక ప్రైవేట్ స్థలం.',
      'stat1-lbl':'తరాలు', 'stat2-lbl':'కుటుంబ సభ్యులు', 'stat3-lbl':'పంచుకున్న కథలు',
      'about-heading':'మన వేర్లు లోతుగా ఉన్నాయి',
      'about-p1':'నుకాల ఫ్యామిలీ ట్రీకి స్వాగతం — ఒక ప్రైవేట్ కుటుంబ సంగ్రహశాల.',
      'about-p2':'ఈ సైట్ మన పూర్వీకులు, కథలు మరియు ఫోటోల జీవంతమైన రికార్డు.',
      'recent-updates':'తాజా అప్‌డేట్‌లు',
      // Quick nav cards
      'card-tree-title':'కుటుంబ వృక్షం', 'card-tree-desc':'మన కుటుంబ సంబంధాలను అన్వేషించండి.',
      'card-history-title':'మన చరిత్ర', 'card-history-desc':'కథలు మరియు మైలురాళ్ళు చదవండి.',
      'card-gallery-title':'ఫోటో గ్యాలరీ', 'card-gallery-desc':'ఫోటోలు చూడండి.',
      'card-contact-title':'సంప్రదించండి', 'card-contact-desc':'మీ కథలను పంచుకోండి.',
      // History
      'history-eyebrow':'మన కథ',
      'history-title':'నుకాల కుటుంబ చరిత్ర',
      'history-subtitle':'కాలం గుండా ఒక ప్రయాణం — మైలురాళ్ళు మరియు జ్ఞాపకాలు.',
      'add-story':'+ కథ జోడించు',
      // Gallery
      'gallery-eyebrow':'జ్ఞాపకాలు',
      'gallery-title':'నుకాల ఫోటో గ్యాలరీ',
      'gallery-subtitle':'సంవత్సరాల జ్ఞాపకాల దృశ్య సంగ్రహశాల.',
      'filter-all':'అన్ని ఫోటోలు', 'filter-family':'కుటుంబం', 'filter-vintage':'పాత',
      'filter-celebrations':'వేడుకలు', 'filter-travel':'ప్రయాణం', 'filter-other':'ఇతరాలు',
      // Facts
      'facts-eyebrow':'మీకు తెలుసా?',
      'facts-title':'ఆసక్తికర కుటుంబ వాస్తవాలు',
      'facts-subtitle':'ఆసక్తికర మైలురాళ్ళు, విజయాలు మరియు సంప్రదాయాలు.',
      'filter-achievements':'విజయాలు', 'filter-milestones':'మైలురాళ్ళు',
      'filter-traditions':'సంప్రదాయాలు', 'filter-records':'రికార్డులు',
      'filter-fun':'సరదా విషయాలు',
      // Tree
      'tree-eyebrow':'అన్వేషించండి',
      'tree-title':'నుకాల కుటుంబ వృక్షం',
      'tree-subtitle':'వివరాలు చూడటానికి ఏదైనా వ్యక్తిని క్లిక్ చేయండి.',
      'btn-fit':'స్క్రీన్‌కు అమర్చు', 'btn-reset':'రీసెట్',
      'lines-on':'రేఖలు ఆన్', 'lines-off':'రేఖలు ఆఫ్',
      // Contact
      'contact-eyebrow':'సహకరించండి',
      'contact-title':'సంప్రదించండి',
      'contact-subtitle':'పంచుకోవడానికి కథ లేదా ఫోటో ఉందా?',
      'form-firstname':'మొదటి పేరు', 'form-lastname':'చివరి పేరు',
      'form-email':'ఇమెయిల్ చిరునామా', 'form-subject':'మీరు ఏమి చేయాలనుకుంటున్నారు?',
      'form-message':'మీ సందేశం', 'form-submit':'సందేశం పంపండి →',
      // Footer
      'footer-text':'ప్రైవేట్ & పాస్‌వర్డ్ రక్షిత · 🌳 & ప్రేమతో చేయబడింది',
    }
  };

  // Nav href → key mapping
  const HREF_MAP = {
    'home.html':'home','tree.html':'tree','history.html':'history',
    'gallery.html':'gallery','facts.html':'facts','stats.html':'stats',
    'events.html':'events','map.html':'map','polls.html':'polls',
    'recipes.html':'recipes','achievements.html':'achievements',
    'videos.html':'videos','qr.html':'share','contact.html':'contact'
  };

  function applyLang(lang){
    localStorage.setItem(LK, lang);
    const t = T[lang] || T.en;

    // 1. Nav links
    document.querySelectorAll('nav .nav-links a').forEach(a=>{
      const key = HREF_MAP[a.getAttribute('href')];
      if(key && t[key]) a.textContent = t[key];
    });

    // 2. Elements with data-lang attribute
    document.querySelectorAll('[data-lang]').forEach(el=>{
      const key = el.getAttribute('data-lang');
      if(t[key]) el.textContent = t[key];
    });

    // 3. Sign out button
    document.querySelectorAll('.nav-logout:not(.nk-dm):not(.nk-lang):not(.nk-search-btn)').forEach(b=>{
      if(b.textContent.includes('Sign') || b.textContent.includes('నిష్క్రమించు'))
        b.textContent = t.signout;
    });

    // 4. Page hero sections — translate eyebrow, h1, p
    const page = location.pathname.split('/').pop() || 'home.html';
    const pageMap = {
      'home.html':    { eyebrow:'welcome-eyebrow', h1:'hero-title', p:'hero-tagline' },
      'history.html': { eyebrow:'history-eyebrow', h1:'history-title', p:'history-subtitle' },
      'gallery.html': { eyebrow:'gallery-eyebrow', h1:'gallery-title', p:'gallery-subtitle' },
      'facts.html':   { eyebrow:'facts-eyebrow', h1:'facts-title', p:'facts-subtitle' },
      'tree.html':    { eyebrow:'tree-eyebrow', h1:'tree-title', p:'tree-subtitle' },
      'contact.html': { eyebrow:'contact-eyebrow', h1:'contact-title', p:'contact-subtitle' },
    };
    const pm = pageMap[page];
    if(pm){
      const hero = document.querySelector('.page-hero, .hero-banner');
      if(hero){
        const eyebrow = hero.querySelector('.eyebrow');
        const h1 = hero.querySelector('h1, .hero-title');
        const p = hero.querySelector('p, .hero-tagline');
        if(eyebrow && t[pm.eyebrow]) eyebrow.textContent = t[pm.eyebrow];
        if(h1 && t[pm.h1]){
          // Keep italic em tag structure
          const em = h1.querySelector('em');
          if(em){ h1.childNodes[0].textContent = t[pm.h1].split(' ')[0]+' '; em.textContent = t[pm.h1].split(' ').slice(1).join(' '); }
          else h1.textContent = t[pm.h1];
        }
        if(p && t[pm.p]) p.textContent = t[pm.p];
      }
    }

    // 5. Filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn=>{
      const key = btn.getAttribute('data-filter-key');
      if(key && t[key]) btn.textContent = t[key];
    });

    // 6. Tree toolbar buttons
    document.querySelectorAll('[data-translate]').forEach(el=>{
      const key = el.getAttribute('data-translate');
      if(t[key]) el.textContent = t[key];
    });

    // 7. Update toggle button
    document.querySelectorAll('.nk-lang').forEach(b => b.textContent = lang==='te'?'EN':'తె');
  }

  window.toggleLang = function(){ applyLang(localStorage.getItem(LK)==='te'?'en':'te'); };

  // Apply on load
  document.addEventListener('DOMContentLoaded', function(){
    const saved = localStorage.getItem(LK)||'en';
    if(saved === 'te') applyLang('te');
  });
})();
