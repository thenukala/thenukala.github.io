/**
 * lang.js — Complete English / Telugu translations
 * Translates: nav, hero, buttons, filters, cards, labels, footers
 */
(function(){
  'use strict';
  const LK = 'nukala_lang';

  const T = {
    en: {
      // Nav links
      nav_home:'Home', nav_tree:'Family Tree', nav_history:'History',
      nav_gallery:'Gallery', nav_facts:'Facts', nav_stats:'Stats',
      nav_events:'Events', nav_map:'Map', nav_polls:'Polls',
      nav_recipes:'Recipes', nav_achievements:'Achievements',
      nav_videos:'Videos', nav_share:'Share', nav_contact:'Contact',
      // Sign out
      signout:'Sign Out',
      // Login page
      login_title:'The Nukala Family Tree',
      login_sub:'A private family archive · Enter your password to continue',
      login_placeholder:'Enter family password',
      login_btn:'Enter Family Archive →',
      login_note:'This site is exclusively for the Nukala family.',
      // Home hero
      hero_eyebrow:'Welcome to the',
      hero_title_1:'The', hero_title_em:'Nukala', hero_title_2:'Family Archive',
      hero_tagline:'A private space to celebrate our roots, preserve our stories, and stay connected across generations.',
      stat1_lbl:'Generations', stat2_lbl:'Family Members', stat3_lbl:'Stories Shared',
      about_title:'Our Roots Run Deep',
      about_p1:'Welcome to the Nukala Family Tree — a private, members-only archive dedicated to preserving and celebrating our shared heritage.',
      about_p2:'This site is a living record of who we are: our ancestors, our stories, our photos, and the bonds that tie us together.',
      about_p3:'We invite every family member to contribute — add your memories, upload old photographs, and help build this archive for generations to come.',
      recent_updates:'Recent Updates',
      // Quick cards
      card_tree_title:'Family Tree', card_tree_desc:'Explore our family connections, branches, and lineage.', card_tree_arrow:'View tree →',
      card_history_title:'Our History', card_history_desc:'Read stories, milestones, and heritage of the Nukala family.', card_history_arrow:'Read more →',
      card_gallery_title:'Photo Gallery', card_gallery_desc:'Browse cherished photos and memories across the years.', card_gallery_arrow:'View photos →',
      card_contact_title:'Get in Touch', card_contact_desc:'Contribute your own stories, photos, or corrections.', card_contact_arrow:'Contact us →',
      // History
      hist_eyebrow:'Our Story', hist_title_em:'Nukala', hist_title:'Family History',
      hist_sub:'A journey through time — the milestones, moments, and memories that shaped who we are.',
      hist_quote:'"A family\'s story is a river — it flows through time, carves its own path, and nourishes everything it touches."',
      add_story:'+ Add a Story',
      // Gallery
      gal_eyebrow:'Memories', gal_title_em:'Nukala', gal_title:'Photo Gallery',
      gal_sub:'A visual archive of cherished moments, celebrations, and faces across the years.',
      filter_all:'All Photos', filter_family:'Family', filter_vintage:'Vintage',
      filter_celebrations:'Celebrations', filter_travel:'Travel', filter_other:'Other',
      // Facts
      facts_eyebrow:'Did You Know?', facts_title:'Interesting Family Facts',
      facts_sub:'Fascinating milestones, achievements, traditions and firsts from across the Nukala family.',
      filter_achievements:'Achievements', filter_milestones:'Milestones',
      filter_traditions:'Traditions', filter_records:'Records', filter_fun:'Fun Facts',
      // Tree
      tree_eyebrow:'Our Roots', tree_title_em:'Nukala', tree_title:'Family Tree',
      tree_sub:'Click any leaf to discover the story within. Lines trace the branches of our family across generations.',
      btn_fit:'Fit to Screen', btn_reset:'Reset View', lines_on:'Lines On', lines_off:'Lines Off',
      // Contact
      cont_eyebrow:'Contribute', cont_title:'Get In Touch',
      cont_sub:'Have a story to share, a photo to contribute, or a correction to suggest?',
      form_fn:'First Name', form_ln:'Last Name', form_email:'Email Address',
      form_subj:'What would you like to do?', form_msg:'Your Message',
      form_btn:'Send Message →',
      // Stats
      stats_eyebrow:'By The Numbers', stats_title:'Family Statistics',
      stats_sub:'Fascinating insights and records from across the Nukala family.',
      // Events
      evts_eyebrow:'Upcoming', evts_title:'Family Events',
      evts_sub:'Reunions, birthdays, anniversaries and celebrations.',
      // Recipes
      rec_eyebrow:'Traditional', rec_title:'Family Recipes',
      rec_sub:'Cherished recipes passed down through generations of the Nukala family.',
      // Achievements
      ach_eyebrow:'Pride of the Family', ach_title:'Family Achievements',
      ach_sub:'Degrees, awards, milestones and proud moments.',
      // Videos
      vid_eyebrow:'Memories in Motion', vid_title:'Family Videos',
      vid_sub:'Family videos, celebrations and memorable moments captured on film.',
      // Map
      map_eyebrow:'Where We Are', map_title:'Family Map',
      map_sub:'See where Nukala family members live around the world.',
      // Polls
      poll_eyebrow:'Have Your Say', poll_title:'Family Polls',
      poll_sub:'Vote on family decisions — every voice counts!',
      // QR
      qr_eyebrow:'Share Access', qr_title:'QR Code Access',
      qr_sub:'Share the family website with relatives — scan to open instantly.',
      // Footer
      footer_private:'Private & Password Protected · Made with 🌳 & love',
    },
    te: {
      // Nav links
      nav_home:'హోమ్', nav_tree:'కుటుంబ వృక్షం', nav_history:'చరిత్ర',
      nav_gallery:'గ్యాలరీ', nav_facts:'వాస్తవాలు', nav_stats:'గణాంకాలు',
      nav_events:'కార్యక్రమాలు', nav_map:'మ్యాప్', nav_polls:'పోల్స్',
      nav_recipes:'వంటకాలు', nav_achievements:'విజయాలు',
      nav_videos:'వీడియోలు', nav_share:'షేర్', nav_contact:'సంప్రదించండి',
      // Sign out
      signout:'నిష్క్రమించు',
      // Login page
      login_title:'నుకాల కుటుంబ వృక్షం',
      login_sub:'ప్రైవేట్ కుటుంబ సంగ్రహశాల · కొనసాగించడానికి పాస్‌వర్డ్ నమోదు చేయండి',
      login_placeholder:'కుటుంబ పాస్‌వర్డ్ నమోదు చేయండి',
      login_btn:'కుటుంబ సంగ్రహశాలలోకి ప్రవేశించండి →',
      login_note:'ఈ సైట్ ప్రత్యేకంగా నుకాల కుటుంబానికి మాత్రమే.',
      // Home hero
      hero_eyebrow:'స్వాగతం',
      hero_title_1:'', hero_title_em:'నుకాల', hero_title_2:'కుటుంబ సంగ్రహశాల',
      hero_tagline:'మన మూలాలను వేడుక చేసుకోవడానికి, మన కథలను భద్రపరచడానికి, తరాల అంతటా అనుసంధానంగా ఉండడానికి ఒక ప్రైవేట్ స్థలం.',
      stat1_lbl:'తరాలు', stat2_lbl:'కుటుంబ సభ్యులు', stat3_lbl:'పంచుకున్న కథలు',
      about_title:'మన వేర్లు లోతుగా ఉన్నాయి',
      about_p1:'నుకాల ఫ్యామిలీ ట్రీకి స్వాగతం — మన పూర్వీకులను మరియు వారసత్వాన్ని భద్రపరచడానికి అంకితమైన ప్రైవేట్ సభ్యత్వ సంగ్రహశాల.',
      about_p2:'ఈ సైట్ మనం ఎవరో అనే దానికి జీవంతమైన రికార్డు: మన పూర్వీకులు, మన కథలు, మన ఫోటోలు మరియు మనల్ని కలిపే బంధాలు.',
      about_p3:'ప్రతి కుటుంబ సభ్యుడూ సహకరించమని ఆహ్వానిస్తున్నాం — మీ జ్ఞాపకాలు జోడించండి, పాత ఫోటోలు అప్‌లోడ్ చేయండి.',
      recent_updates:'తాజా అప్‌డేట్‌లు',
      // Quick cards
      card_tree_title:'కుటుంబ వృక్షం', card_tree_desc:'మన కుటుంబ సంబంధాలు, శాఖలు మరియు వంశావళిని అన్వేషించండి.', card_tree_arrow:'వృక్షం చూడండి →',
      card_history_title:'మన చరిత్ర', card_history_desc:'నుకాల కుటుంబ కథలు, మైలురాళ్ళు మరియు వారసత్వాన్ని చదవండి.', card_history_arrow:'మరింత చదవండి →',
      card_gallery_title:'ఫోటో గ్యాలరీ', card_gallery_desc:'సంవత్సరాల జ్ఞాపకాలు మరియు ఫోటోలు చూడండి.', card_gallery_arrow:'ఫోటోలు చూడండి →',
      card_contact_title:'సంప్రదించండి', card_contact_desc:'మీ కథలు, ఫోటోలు లేదా సవరణలు అందించండి.', card_contact_arrow:'సంప్రదించండి →',
      // History
      hist_eyebrow:'మన కథ', hist_title_em:'నుకాల', hist_title:'కుటుంబ చరిత్ర',
      hist_sub:'కాలం గుండా ఒక ప్రయాణం — మనం ఎవరో అని రూపొందించిన మైలురాళ్ళు, క్షణాలు మరియు జ్ఞాపకాలు.',
      hist_quote:'"కుటుంబ కథ ఒక నది — అది కాలంలో ప్రవహిస్తుంది, తన దారిని తానే కోసుకుంటుంది."',
      add_story:'+ కథ జోడించు',
      // Gallery
      gal_eyebrow:'జ్ఞాపకాలు', gal_title_em:'నుకాల', gal_title:'ఫోటో గ్యాలరీ',
      gal_sub:'ప్రియమైన క్షణాలు, వేడుకలు మరియు సంవత్సరాల ముఖాల దృశ్య సంగ్రహశాల.',
      filter_all:'అన్ని ఫోటోలు', filter_family:'కుటుంబం', filter_vintage:'పాత ఫోటోలు',
      filter_celebrations:'వేడుకలు', filter_travel:'ప్రయాణం', filter_other:'ఇతరాలు',
      // Facts
      facts_eyebrow:'మీకు తెలుసా?', facts_title:'ఆసక్తికర కుటుంబ వాస్తవాలు',
      facts_sub:'నుకాల కుటుంబం అంతటా ఆసక్తికర మైలురాళ్ళు, విజయాలు మరియు సంప్రదాయాలు.',
      filter_achievements:'విజయాలు', filter_milestones:'మైలురాళ్ళు',
      filter_traditions:'సంప్రదాయాలు', filter_records:'రికార్డులు', filter_fun:'సరదా విషయాలు',
      // Tree
      tree_eyebrow:'మన మూలాలు', tree_title_em:'నుకాల', tree_title:'కుటుంబ వృక్షం',
      tree_sub:'లోపలి కథను కనుగొనడానికి ఏదైనా ఆకును క్లిక్ చేయండి.',
      btn_fit:'స్క్రీన్‌కు అమర్చు', btn_reset:'రీసెట్ చేయి', lines_on:'రేఖలు ఆన్', lines_off:'రేఖలు ఆఫ్',
      // Contact
      cont_eyebrow:'సహకరించండి', cont_title:'సంప్రదించండి',
      cont_sub:'పంచుకోవడానికి కథ, ఫోటో లేదా సవరణ ఉందా?',
      form_fn:'మొదటి పేరు', form_ln:'చివరి పేరు', form_email:'ఇమెయిల్ చిరునామా',
      form_subj:'మీరు ఏమి చేయాలనుకుంటున్నారు?', form_msg:'మీ సందేశం',
      form_btn:'సందేశం పంపండి →',
      // Stats
      stats_eyebrow:'సంఖ్యల ప్రకారం', stats_title:'కుటుంబ గణాంకాలు',
      stats_sub:'నుకాల కుటుంబం అంతటా ఆసక్తికర అంతర్దృష్టులు మరియు రికార్డులు.',
      // Events
      evts_eyebrow:'రానున్నవి', evts_title:'కుటుంబ కార్యక్రమాలు',
      evts_sub:'పునర్మిలనాలు, పుట్టినరోజులు, వార్షికోత్సవాలు మరియు వేడుకలు.',
      // Recipes
      rec_eyebrow:'సాంప్రదాయ', rec_title:'కుటుంబ వంటకాలు',
      rec_sub:'నుకాల కుటుంబంలో తరాల నుండి తరాలకు అందజేయబడిన ప్రియమైన వంటకాలు.',
      // Achievements
      ach_eyebrow:'కుటుంబ గర్వం', ach_title:'కుటుంబ విజయాలు',
      ach_sub:'పట్టాలు, అవార్డులు, మైలురాళ్ళు మరియు గర్వంగా చెప్పుకోగలిగే క్షణాలు.',
      // Videos
      vid_eyebrow:'చలనంలో జ్ఞాపకాలు', vid_title:'కుటుంబ వీడియోలు',
      vid_sub:'కుటుంబ వీడియోలు, వేడుకలు మరియు చిత్రీకరించిన అద్భుతమైన క్షణాలు.',
      // Map
      map_eyebrow:'మనం ఎక్కడ ఉన్నాం', map_title:'కుటుంబ మ్యాప్',
      map_sub:'నుకాల కుటుంబ సభ్యులు ప్రపంచంలో ఎక్కడ నివసిస్తున్నారో చూడండి.',
      // Polls
      poll_eyebrow:'మీ అభిప్రాయం చెప్పండి', poll_title:'కుటుంబ పోల్స్',
      poll_sub:'కుటుంబ నిర్ణయాలపై ఓటు వేయండి — ప్రతి గొంతూ ముఖ్యమే!',
      // QR
      qr_eyebrow:'యాక్సెస్ షేర్ చేయండి', qr_title:'QR కోడ్ యాక్సెస్',
      qr_sub:'బంధువులతో కుటుంబ వెబ్‌సైట్‌ను షేర్ చేయండి.',
      // Footer
      footer_private:'ప్రైవేట్ & పాస్‌వర్డ్ రక్షిత · 🌳 & ప్రేమతో చేయబడింది',
    }
  };

  const NAV_MAP = {
    'home.html':'nav_home','tree.html':'nav_tree','history.html':'nav_history',
    'gallery.html':'nav_gallery','facts.html':'nav_facts','stats.html':'nav_stats',
    'events.html':'nav_events','map.html':'nav_map','polls.html':'nav_polls',
    'recipes.html':'nav_recipes','achievements.html':'nav_achievements',
    'videos.html':'nav_videos','qr.html':'nav_share','contact.html':'nav_contact'
  };

  // Page → translation key prefix
  const PAGE_KEYS = {
    'home.html':    { eyebrow:'hero_eyebrow', p:'hero_tagline', extra:'home' },
    'history.html': { eyebrow:'hist_eyebrow', p:'hist_sub', extra:'history' },
    'gallery.html': { eyebrow:'gal_eyebrow',  p:'gal_sub',  extra:'gallery' },
    'facts.html':   { eyebrow:'facts_eyebrow',p:'facts_sub', extra:'facts' },
    'tree.html':    { eyebrow:'tree_eyebrow', p:'tree_sub',  extra:'tree' },
    'contact.html': { eyebrow:'cont_eyebrow', p:'cont_sub',  extra:'contact' },
    'stats.html':   { eyebrow:'stats_eyebrow',p:'stats_sub', extra:'stats' },
    'events.html':  { eyebrow:'evts_eyebrow', p:'evts_sub',  extra:'events' },
    'recipes.html': { eyebrow:'rec_eyebrow',  p:'rec_sub',   extra:'recipes' },
    'achievements.html':{ eyebrow:'ach_eyebrow',p:'ach_sub', extra:'achievements' },
    'videos.html':  { eyebrow:'vid_eyebrow',  p:'vid_sub',   extra:'videos' },
    'map.html':     { eyebrow:'map_eyebrow',  p:'map_sub',   extra:'map' },
    'polls.html':   { eyebrow:'poll_eyebrow', p:'poll_sub',  extra:'polls' },
    'qr.html':      { eyebrow:'qr_eyebrow',   p:'qr_sub',    extra:'qr' },
  };

  function setText(sel, val, root){
    const el = (root||document).querySelector(sel);
    if(el && val) el.textContent = val;
  }

  function applyLang(lang){
    localStorage.setItem(LK, lang);
    const t = T[lang] || T.en;
    const page = location.pathname.split('/').pop() || 'home.html';

    // 1. Nav links
    document.querySelectorAll('nav .nav-links a').forEach(a => {
      const key = NAV_MAP[a.getAttribute('href')];
      if(key && t[key]) a.textContent = t[key];
    });

    // 2. Sign out buttons
    document.querySelectorAll('.nav-logout').forEach(b => {
      if(b.classList.contains('nk-dm') || b.classList.contains('nk-lang') ||
         b.classList.contains('nk-search-btn') || b.classList.contains('nk-burger')) return;
      if(b.textContent.trim().length > 0) b.textContent = t.signout;
    });

    // 3. Language toggle button text
    document.querySelectorAll('.nk-lang').forEach(b => b.textContent = lang==='te' ? 'EN' : 'తె');

    // 4. Page hero
    const pk = PAGE_KEYS[page];
    if(pk){
      const hero = document.querySelector('.page-hero, .hero-banner');
      if(hero){
        const eyebrow = hero.querySelector('.eyebrow');
        if(eyebrow && t[pk.eyebrow]) eyebrow.textContent = t[pk.eyebrow];
        const p = hero.querySelector('p, .hero-tagline');
        if(p && t[pk.p]) p.textContent = t[pk.p];
        // H1 — handle em tag
        const h1 = hero.querySelector('h1, .hero-title');
        if(h1){
          const titleKey = pk.extra + '_title';
          const emKey    = pk.extra + '_title_em';
          if(t[emKey]){
            const em = h1.querySelector('em');
            if(em){
              // Set text around the em
              const t1 = t[pk.extra+'_title_1'] || '';
              const t2 = t[pk.extra+'_title_2'] || (t[titleKey]||'');
              h1.innerHTML = (t1 ? t1+' ' : '') + `<em>${t[emKey]}</em>` + (t2 ? '<br>'+t2 : '');
            } else {
              if(t[titleKey]) h1.textContent = t[titleKey];
            }
          } else if(t[titleKey]){
            h1.textContent = t[titleKey];
          }
        }
      }
    }

    // 5. Home page specific
    if(page === 'home.html'){
      setText('#stat1lbl', t.stat1_lbl);
      setText('#stat2lbl', t.stat2_lbl);
      setText('#stat3lbl', t.stat3_lbl);
      setText('#aboutTitle', t.about_title);
      setText('#aboutP1', t.about_p1);
      setText('#aboutP2', t.about_p2);
      setText('#aboutP3', t.about_p3);
      // Recent updates heading
      document.querySelectorAll('.recent-updates h2').forEach(el => el.textContent = t.recent_updates);
      // Quick nav cards
      const cards = document.querySelectorAll('.quick-card');
      const cardKeys = [
        {title:'card_tree_title', desc:'card_tree_desc', arrow:'card_tree_arrow'},
        {title:'card_history_title', desc:'card_history_desc', arrow:'card_history_arrow'},
        {title:'card_gallery_title', desc:'card_gallery_desc', arrow:'card_gallery_arrow'},
        {title:'card_contact_title', desc:'card_contact_desc', arrow:'card_contact_arrow'},
      ];
      cards.forEach((card, i) => {
        if(!cardKeys[i]) return;
        const ck = cardKeys[i];
        const titleEl = card.querySelector('.quick-card-title');
        const descEl  = card.querySelector('.quick-card-desc');
        const arrEl   = card.querySelector('.quick-card-arrow');
        if(titleEl && t[ck.title]) titleEl.textContent = t[ck.title];
        if(descEl  && t[ck.desc])  descEl.textContent  = t[ck.desc];
        if(arrEl   && t[ck.arrow]) arrEl.textContent   = t[ck.arrow];
      });
    }

    // 6. History page
    if(page === 'history.html'){
      const addStoryBtn = document.querySelector('.add-story-bar a, .btn-outline-sm');
      if(addStoryBtn && addStoryBtn.textContent.includes('Story')) addStoryBtn.textContent = t.add_story;
      const quote = document.querySelector('.history-intro');
      if(quote) quote.textContent = t.hist_quote;
    }

    // 7. Gallery filter buttons
    if(page === 'gallery.html'){
      const filterMap = { 'all':'filter_all','family':'filter_family','vintage':'filter_vintage','celebrations':'filter_celebrations','travel':'filter_travel','other':'filter_other' };
      document.querySelectorAll('.filter-btn').forEach(btn => {
        const key = btn.getAttribute('data-filter-key');
        if(key && t[filterMap[key]||key]) btn.textContent = t[filterMap[key]||key];
      });
    }

    // 8. Facts filter buttons
    if(page === 'facts.html'){
      const filterMap = { 'all':'filter_all','Achievement':'filter_achievements','Milestone':'filter_milestones','Tradition':'filter_traditions','Record':'filter_records','Fun Fact':'filter_fun' };
      document.querySelectorAll('.filter-btn').forEach(btn => {
        const key = btn.getAttribute('data-filter-key');
        if(key && t[filterMap[key]||key]) btn.textContent = t[filterMap[key]||key];
      });
    }

    // 9. Tree page buttons
    if(page === 'tree.html'){
      document.querySelectorAll('[data-translate]').forEach(el => {
        const key = el.getAttribute('data-translate');
        if(t[key]) el.textContent = t[key];
      });
    }

    // 10. Contact form labels
    if(page === 'contact.html'){
      document.querySelectorAll('label[for="fname"]').forEach(l => l.textContent = t.form_fn);
      document.querySelectorAll('label[for="lname"]').forEach(l => l.textContent = t.form_ln);
      document.querySelectorAll('label[for="email"]').forEach(l => l.textContent = t.form_email);
      document.querySelectorAll('label[for="subject"]').forEach(l => l.textContent = t.form_subj);
      document.querySelectorAll('label[for="message"]').forEach(l => l.textContent = t.form_msg);
      const submitBtn = document.querySelector('.submit-btn');
      if(submitBtn) submitBtn.textContent = t.form_btn;
    }

    // 11. Footer
    document.querySelectorAll('footer').forEach(f => {
      const txt = f.querySelector('strong');
      // Don't touch family name inside strong, but translate the rest
      const nodes = [...f.childNodes];
      nodes.forEach(n => {
        if(n.nodeType === 3 && n.textContent.includes('Private')){
          n.textContent = ' · ' + t.footer_private;
        }
      });
    });

    // 12. Login page
    if(page === 'index.html'){
      const title = document.querySelector('.ltitle, h1');
      const sub   = document.querySelector('.lsub');
      const inp   = document.querySelector('input[type="password"]');
      const btn   = document.querySelector('.btnp');
      const note  = document.querySelector('.login-note, p[style*="color"]');
      if(title) title.textContent  = t.login_title;
      if(sub)   sub.textContent    = t.login_sub;
      if(inp)   inp.placeholder    = t.login_placeholder;
      if(btn)   btn.textContent    = t.login_btn;
    }
  }

  window.toggleLang = function(){
    applyLang(localStorage.getItem(LK) === 'te' ? 'en' : 'te');
  };

  // Apply on DOM ready
  function init(){
    const saved = localStorage.getItem(LK) || 'en';
    if(saved === 'te') applyLang('te');
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
