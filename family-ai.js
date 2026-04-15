// ═══════════════════════════════════════════════════════════
// Family AI Assistant — Powered by Google Gemini (free tier)
// ═══════════════════════════════════════════════════════════
(function () {
  'use strict';

  var DAILY_LIMIT = 1400;
  var USAGE_KEY   = 'nukala_ai_usage';
  var CONFIG_KEY  = 'nukala_ai_config';

  function load(k) {
    try { return JSON.parse(localStorage.getItem(k) || 'null'); } catch(e) { return null; }
  }
  function save(k, v) {
    try { localStorage.setItem(k, JSON.stringify(v)); } catch(e) {}
  }
  function getConfig() { return load(CONFIG_KEY) || {}; }

  function getUsage() {
    var u = load(USAGE_KEY) || {};
    var today = new Date().toISOString().slice(0, 10);
    if (u.date !== today) { u = { date: today, count: 0 }; save(USAGE_KEY, u); }
    return u;
  }
  function incrementUsage() { var u = getUsage(); u.count++; save(USAGE_KEY, u); }
  function isLimitReached() { return getUsage().count >= DAILY_LIMIT; }
  function msToMidnight() { var n = new Date(), m = new Date(n); m.setHours(24,0,0,0); return m - n; }
  function fmtCountdown(ms) { return Math.floor(ms/3600000) + 'h ' + Math.floor((ms%3600000)/60000) + 'm'; }

  function buildContext() {
    var st  = load('nukala_settings') || {};
    var cfg = getConfig();
    var fname = cfg.familyName || st.familyName || 'Our Family';
    var members  = Object.values(load('nukala_tree_data') || {});
    var contacts = load('nukala_contacts') || {};
    var history  = load('nukala_history')  || [];
    var events   = load('nukala_events')   || [];
    var recipes  = load('nukala_recipes')  || [];
    var facts    = load('nukala_facts')    || [];

    var mList = members.slice(0, 50).map(function(m) {
      var c = contacts[m.id] || {};
      return [m.firstName, m.lastName].filter(Boolean).join(' ')
        + (m.role ? ' [' + m.role + ']' : '')
        + (m.gen  ? ' Gen' + m.gen : '')
        + ((c.city || m.city) ? ' - ' + (c.city || m.city) : '');
    }).join(', ');

    var lines = [
      fname + ' Family: ' + members.length + ' members total',
      members.length ? 'Members: ' + mList : '',
      history.length  ? 'History: '  + history.slice(0,4).map(function(h){return (h.year||'') + ' ' + (h.title||'');}).join('; ') : '',
      events.length   ? 'Events: '   + events.slice(0,5).map(function(e){return (e.title||'') + (e.date?' on '+e.date:'');}).join('; ') : '',
      recipes.length  ? 'Recipes: '  + recipes.slice(0,5).map(function(r){return r.title||r.name||'';}).join(', ') : '',
      facts.length    ? 'Facts: '    + facts.slice(0,5).map(function(f){return f.title||'';}).join(', ') : '',
    ];
    return lines.filter(Boolean).join('\n');
  }

  async function askGemini(question, history) {
    var cfg = getConfig();

    // Step 1: check key
    if (!cfg.apiKey || cfg.apiKey.length < 10) {
      throw new Error('NO_API_KEY');
    }

    // Step 2: check rate limit
    if (isLimitReached()) {
      throw new Error('RATE_LIMIT');
    }

    var context = buildContext();
    var aiName  = cfg.aiName || 'Family Assistant';

    // Step 3: build prompt
    var prompt = 'You are ' + aiName + ', AI assistant for this family website.\n'
      + 'FAMILY DATA:\n' + context + '\n\n'
      + 'Answer ONLY from the data above. Be friendly and brief (2-3 sentences).\n'
      + (history.length ? 'Prior chat:\n' + history.slice(-4).map(function(m){ return (m.role==='user'?'Q':'A') + ': ' + m.text; }).join('\n') + '\n' : '')
      + 'Q: ' + question + '\nA:';

    // Step 4: call API with timeout
    var ctrl = new AbortController();
    var timer = setTimeout(function(){ ctrl.abort(); }, 20000);

    var resp, data;
    try {
      resp = await fetch(
        'https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=' + cfg.apiKey,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: ctrl.signal,
          body: JSON.stringify({
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            generationConfig: { maxOutputTokens: 300, temperature: 0.7 }
          })
        }
      );
      clearTimeout(timer);
      data = await resp.json();
    } catch(fetchErr) {
      clearTimeout(timer);
      if (fetchErr.name === 'AbortError') throw new Error('TIMEOUT');
      throw new Error('NETWORK: ' + fetchErr.message);
    }

    // Step 5: parse response
    if (!resp.ok) {
      var errMsg = (data && data.error && data.error.message) || ('HTTP ' + resp.status);
      if (resp.status === 400 || resp.status === 401 || resp.status === 403) throw new Error('BAD_KEY: ' + errMsg);
      if (resp.status === 429) throw new Error('RATE_LIMIT');
      throw new Error('API ' + resp.status + ': ' + errMsg);
    }

    var part = (((((data.candidates || [])[0] || {}).content || {}).parts || [])[0] || {});
    var answer = (part.text || '').trim();
    if (!answer) throw new Error('EMPTY: ' + JSON.stringify(data).slice(0, 100));

    incrementUsage();
    return answer;
  }

  // ── UI ───────────────────────────────────────────────────
  function buildUI() {
    var cfg = getConfig();
    if (!cfg.apiKey || cfg.enabled === false) return;

    var aiName   = cfg.aiName   || 'Family Assistant';
    var greeting = cfg.greeting || 'Hi! I\'m your family assistant. Ask me anything about the family! 👋';
    var clr = '#5c7a5c';

    var style = document.createElement('style');
    style.textContent = '#faiBtn{position:fixed;bottom:24px;right:24px;z-index:9900;width:54px;height:54px;border-radius:50%;background:'+clr+';border:none;cursor:pointer;box-shadow:0 4px 16px rgba(92,122,92,.4);display:flex;align-items:center;justify-content:center;font-size:1.4rem;transition:transform .2s}'
      +'#faiBtn:hover{transform:scale(1.08)}'
      +'#faiPanel{position:fixed;bottom:88px;right:24px;z-index:9900;width:340px;max-width:calc(100vw - 48px);background:#fff;border-radius:20px;box-shadow:0 12px 48px rgba(0,0,0,.16);border:1px solid #e8e4dc;display:none;flex-direction:column;overflow:hidden}'
      +'#faiHdr{background:'+clr+';padding:13px 16px;display:flex;align-items:center;gap:10px}'
      +'#faiHdr .fn{color:#fff;font-weight:600;font-size:.88rem;flex:1}'
      +'#faiHdr .fs{color:rgba(255,255,255,.7);font-size:.68rem}'
      +'#faiX{background:none;border:none;color:#fff;cursor:pointer;font-size:1.1rem;opacity:.8;padding:4px}'
      +'#faiMsgs{overflow-y:auto;padding:14px;max-height:300px;display:flex;flex-direction:column;gap:8px;scroll-behavior:smooth}'
      +'.fm{max-width:86%;padding:8px 13px;border-radius:14px;font-size:.78rem;line-height:1.6;word-wrap:break-word}'
      +'.fm.u{align-self:flex-end;background:'+clr+';color:#fff;border-bottom-right-radius:3px}'
      +'.fm.a{align-self:flex-start;background:#f5f3ef;color:#2c2c2c;border-bottom-left-radius:3px}'
      +'.fm.s{align-self:center;background:#fef9e7;color:#856404;border-radius:10px;font-size:.72rem;text-align:center;max-width:92%}'
      +'.fty{display:flex;gap:4px;padding:10px 14px;align-self:flex-start}'
      +'.fty span{width:7px;height:7px;background:#bbb;border-radius:50%;animation:ftd 1.2s infinite}'
      +'.fty span:nth-child(2){animation-delay:.2s}.fty span:nth-child(3){animation-delay:.4s}'
      +'@keyframes ftd{0%,60%,100%{transform:translateY(0)}30%{transform:translateY(-5px)}}'
      +'#faiSugs{padding:0 14px 10px;display:flex;flex-wrap:wrap;gap:6px}'
      +'.fsug{background:#f0f5f0;border:1px solid #c8ddc8;border-radius:20px;padding:5px 12px;font-size:.7rem;color:'+clr+';cursor:pointer}'
      +'.fsug:hover{background:#ddeedd}'
      +'#faiRow{padding:10px 12px;border-top:1px solid #eee;display:flex;gap:8px}'
      +'#faiInp{flex:1;border:1.5px solid #ddd;border-radius:20px;padding:8px 14px;font-size:.78rem;outline:none;font-family:inherit}'
      +'#faiInp:focus{border-color:'+clr+'}'
      +'#faiGo{background:'+clr+';border:none;border-radius:50%;width:34px;height:34px;cursor:pointer;color:#fff;flex-shrink:0;font-size:.9rem}'
      +'#faiGo:disabled{opacity:.4;cursor:default}'
      +'#faiUse{padding:3px 14px 8px;font-size:.65rem;color:#bbb;text-align:right}'
      +'@media(max-width:400px){#faiPanel{right:8px;width:calc(100vw - 16px)}#faiBtn{right:12px}}';
    document.head.appendChild(style);

    // Suggestion chips
    var members = Object.values(load('nukala_tree_data') || {});
    var events  = load('nukala_events')  || [];
    var history = load('nukala_history') || [];
    var recipes = load('nukala_recipes') || [];
    var sugs = [];
    if (members.length) sugs.push('How many members do we have?');
    if (members.length) sugs.push('Who is in Generation 1?');
    if (events.length)  sugs.push('What events are coming up?');
    if (history.length) sugs.push('Tell me about our family history');
    if (recipes.length) sugs.push('What recipes do we have?');
    if (!sugs.length)   sugs.push('Tell me about this family');

    var panel = document.createElement('div');
    panel.id = 'faiPanel';
    panel.innerHTML =
      '<div id="faiHdr">'
        +'<div style="width:32px;height:32px;border-radius:50%;background:rgba(255,255,255,.25);display:flex;align-items:center;justify-content:center;font-size:1rem">🤖</div>'
        +'<div style="flex:1"><div class="fn">'+aiName+'</div><div class="fs">Family AI · Free</div></div>'
        +'<button id="faiX" title="Close">✕</button>'
      +'</div>'
      +'<div id="faiMsgs"><div class="fm a">'+greeting+'</div></div>'
      +'<div id="faiSugs">'+sugs.slice(0,4).map(function(s){ return '<button class="fsug">'+s+'</button>'; }).join('')+'</div>'
      +'<div id="faiRow">'
        +'<input id="faiInp" type="text" placeholder="Ask about your family..." maxlength="200"/>'
        +'<button id="faiGo">➤</button>'
      +'</div>'
      +'<div id="faiUse"></div>';

    var btn = document.createElement('button');
    btn.id = 'faiBtn'; btn.title = aiName; btn.textContent = '🤖';
    document.body.appendChild(panel);
    document.body.appendChild(btn);

    var hist = [], isOpen = false;

    function updUsage() {
      var el = document.getElementById('faiUse');
      if (el) { var u = getUsage(); el.textContent = u.count + ' / ' + DAILY_LIMIT + ' questions today'; }
    }

    function toggle() {
      isOpen = !isOpen;
      panel.style.display = isOpen ? 'flex' : 'none';
      if (isOpen) { updUsage(); setTimeout(function(){ var i=document.getElementById('faiInp'); if(i) i.focus(); }, 80); }
    }

    btn.addEventListener('click', toggle);
    document.getElementById('faiX').addEventListener('click', toggle);

    panel.querySelectorAll('.fsug').forEach(function(b) {
      b.addEventListener('click', function() { send(b.textContent); });
    });

    function addMsg(txt, role) {
      var msgs = document.getElementById('faiMsgs');
      var d = document.createElement('div');
      d.className = 'fm ' + role;
      d.textContent = txt;
      msgs.appendChild(d);
      msgs.scrollTop = msgs.scrollHeight;
    }

    function showTyping() {
      var msgs = document.getElementById('faiMsgs');
      var d = document.createElement('div');
      d.className = 'fty'; d.id = 'faiTyping';
      d.innerHTML = '<span></span><span></span><span></span>';
      msgs.appendChild(d); msgs.scrollTop = msgs.scrollHeight;
    }
    function hideTyping() { var t=document.getElementById('faiTyping'); if(t) t.remove(); }

    async function send(txt) {
      txt = (txt || '').trim();
      if (!txt) return;
      var inp = document.getElementById('faiInp');
      var go  = document.getElementById('faiGo');
      var sg  = document.getElementById('faiSugs');
      if (inp) inp.value = '';
      if (go)  go.disabled = true;
      if (sg)  sg.style.display = 'none';
      addMsg(txt, 'u');
      showTyping();
      try {
        var ans = await askGemini(txt, hist);
        hideTyping();
        addMsg(ans, 'a');
        hist.push({role:'user', text:txt});
        hist.push({role:'ai',   text:ans});
        if (hist.length > 12) hist = hist.slice(-12);
        updUsage();
      } catch(e) {
        hideTyping();
        var msg;
        if (e.message === 'NO_API_KEY')        msg = 'The family AI hasn\'t been configured yet. Ask the admin to set it up.';
        else if (e.message === 'RATE_LIMIT')   msg = '🌙 Daily limit reached. Back in ' + fmtCountdown(msToMidnight()) + '!';
        else if (e.message === 'TIMEOUT')      msg = '⏱ Request timed out. Please try again.';
        else if (e.message.indexOf('BAD_KEY') === 0) msg = '🔑 API key issue: ' + e.message + '. Admin needs to update the key.';
        else if (e.message.indexOf('NETWORK') === 0) msg = '🌐 Network error: ' + e.message;
        else                                    msg = '⚠️ Error: ' + e.message + '. Please try again.';
        addMsg(msg, 's');
      }
      if (go)  go.disabled = false;
      if (inp) inp.focus();
    }

    document.getElementById('faiGo').addEventListener('click', function() {
      var inp = document.getElementById('faiInp'); send(inp ? inp.value : '');
    });
    document.getElementById('faiInp').addEventListener('keydown', function(e) {
      if (e.key === 'Enter') { e.preventDefault(); send(this.value); }
    });

    updUsage();
  }

  // Don't show on admin page
  if (window.location.pathname.indexOf('admin') !== -1) return;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', buildUI);
  } else {
    buildUI();
  }
})();
