// ═══════════════════════════════════════════════════════════
// Family AI Assistant — Powered by Google Gemini (free tier)
// Works on any family's site — fully configurable via admin
// ═══════════════════════════════════════════════════════════
(function () {
  'use strict';

  // ── Config ──────────────────────────────────────────────
  var GEMINI_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=';
  var DAILY_LIMIT = 1400;          // stay under Gemini free 1500/day limit
  var USAGE_KEY   = 'nukala_ai_usage';
  var CONFIG_KEY  = 'nukala_ai_config';

  // ── Helpers ──────────────────────────────────────────────
  function load(k) { try { return JSON.parse(localStorage.getItem(k) || 'null'); } catch (e) { return null; } }
  function save(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }

  function getConfig() { return load(CONFIG_KEY) || {}; }

  // ── Rate limit tracking ──────────────────────────────────
  function getUsage() {
    var u = load(USAGE_KEY) || {};
    var today = new Date().toISOString().slice(0, 10);
    if (u.date !== today) { u = { date: today, count: 0 }; save(USAGE_KEY, u); }
    return u;
  }
  function incrementUsage() {
    var u = getUsage(); u.count++; save(USAGE_KEY, u); return u.count;
  }
  function isLimitReached() { return getUsage().count >= DAILY_LIMIT; }

  function msToMidnight() {
    var now = new Date();
    var midnight = new Date(now); midnight.setHours(24, 0, 0, 0);
    return midnight - now;
  }
  function fmtCountdown(ms) {
    var h = Math.floor(ms / 3600000);
    var m = Math.floor((ms % 3600000) / 60000);
    return h + 'h ' + m + 'm';
  }

  // ── Context builder — reads all family data ─────────────
  function buildFamilyContext() {
    var cfg    = getConfig();
    var st     = load('nukala_settings') || {};
    var hd     = load('nukala_home')     || {};
    var fname  = cfg.familyName || st.familyName || hd.familyName || 'Our Family';

    var members   = Object.values(load('nukala_tree_data') || {});
    var history   = load('nukala_history')  || [];
    var events    = load('nukala_events')   || [];
    var facts     = load('nukala_facts')    || [];
    var recipes   = load('nukala_recipes')  || [];
    var polls     = load('nukala_polls')    || [];
    var about     = load('nukala_about')    || {};
    var contacts  = load('nukala_contacts') || {};

    // Member summary
    var living  = members.filter(function (m) { return !m.died; }).length;
    var gens    = [...new Set(members.map(function (m) { return m.gen; }).filter(Boolean))].length;
    var withCity = members.filter(function (m) { var c = contacts[m.id] || {}; return (c.city || m.city || '').trim(); });
    var cities = {};
    withCity.forEach(function (m) { var city = (contacts[m.id] || {}).city || m.city || ''; if (city) cities[city] = (cities[city] || 0) + 1; });

    var memberList = members.slice(0, 40).map(function (m) {
      var c = contacts[m.id] || {};
      return [m.firstName, m.lastName].filter(Boolean).join(' ')
        + (m.role ? ' (' + m.role + ')' : '')
        + (m.gen ? ' — Gen ' + m.gen : '')
        + ((c.city || m.city) ? ' — ' + (c.city || m.city) : '');
    }).join('\n  ');

    var historyText = history.slice(0, 5).map(function (h) {
      return (h.year || '') + ' — ' + (h.title || '') + ': ' + (h.content || '').slice(0, 120);
    }).join('\n  ');

    var eventsText = events.slice(0, 8).map(function (e) {
      return (e.date || e.year || '') + ' — ' + (e.title || '') + (e.location ? ' at ' + e.location : '');
    }).join('\n  ');

    var factsText = facts.slice(0, 8).map(function (f) {
      return '• ' + (f.title || '') + (f.year ? ' (' + f.year + ')' : '') + ': ' + (f.content || '').slice(0, 100);
    }).join('\n  ');

    var recipesText = recipes.slice(0, 6).map(function (r) {
      return '• ' + (r.title || r.name || '') + (r.by ? ' by ' + r.by : '');
    }).join('\n  ');

    var pollsText = polls.slice(0, 4).map(function (p) {
      return '• ' + (p.question || '') + ' [' + (p.options || []).join(' / ') + ']';
    }).join('\n  ');

    var aboutText = typeof about === 'string' ? about.slice(0, 300)
      : (about.text || about.content || about.about1 || '').slice(0, 300);

    var cityBreakdown = Object.entries(cities).slice(0, 10).map(function (e) {
      return e[1] + ' in ' + e[0];
    }).join(', ');

    return [
      '=== ' + fname + ' Family Archive ===',
      'Total members: ' + members.length + ' (' + living + ' living, across ' + gens + ' generation' + (gens !== 1 ? 's' : '') + ')',
      cityBreakdown ? 'Locations: ' + cityBreakdown : '',
      '',
      'MEMBERS:',
      '  ' + (memberList || 'No members added yet'),
      '',
      historyText ? 'FAMILY HISTORY:\n  ' + historyText : '',
      eventsText  ? 'EVENTS:\n  ' + eventsText           : '',
      factsText   ? 'FACTS & ACHIEVEMENTS:\n  ' + factsText : '',
      recipesText ? 'FAMILY RECIPES:\n  ' + recipesText   : '',
      pollsText   ? 'ACTIVE POLLS:\n  ' + pollsText       : '',
      aboutText   ? 'ABOUT THE FAMILY:\n  ' + aboutText   : '',
    ].filter(Boolean).join('\n');
  }

  // ── Gemini API call ──────────────────────────────────────
  async function askGemini(userQuestion, history) {
    var cfg = getConfig();
    if (!cfg.apiKey) throw new Error('NO_API_KEY');
    if (isLimitReached()) throw new Error('RATE_LIMIT');

    var familyContext = buildFamilyContext();
    var cfg2 = getConfig();
    var aiName = cfg2.aiName || 'Family Assistant';
    var familyName = (load('nukala_settings') || {}).familyName || 'our family';

    var systemPrompt = [
      'You are ' + aiName + ', the AI assistant for the ' + familyName + ' family archive website.',
      'You help family members discover facts about their family — members, history, events, recipes, achievements and more.',
      'Be warm, friendly, conversational and concise. Use the family data below to answer accurately.',
      'If a question is not about the family or if the data does not contain the answer, say so politely.',
      'Keep answers to 2-4 sentences unless detail is specifically requested.',
      'Never make up information not in the data.',
      '',
      familyContext
    ].join('\n');

    // Build conversation contents
    var contents = [];
    // Add history (last 6 messages)
    var recent = history.slice(-6);
    recent.forEach(function (msg) {
      contents.push({ role: msg.role === 'ai' ? 'model' : 'user', parts: [{ text: msg.text }] });
    });
    // Add current question
    contents.push({ role: 'user', parts: [{ text: userQuestion }] });

    // Inject system prompt as first user message (works with all Gemini models)
    contents.unshift({ role: 'user', parts: [{ text: systemPrompt }] });
    contents.unshift({ role: 'model', parts: [{ text: 'Understood. I will act as the family assistant and only answer from the family data provided.' }] });

    var body = {
      contents: contents,
      generationConfig: { maxOutputTokens: 400, temperature: 0.7, topP: 0.9 }
    };

    var controller = new AbortController();
    var tout = setTimeout(function(){ controller.abort(); }, 15000);
    var res = await fetch(GEMINI_ENDPOINT + cfg.apiKey, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify(body)
    });
    clearTimeout(tout);

    if (res.status === 429) throw new Error('RATE_LIMIT');
    if (!res.ok) {
      var err = await res.json().catch(() => ({}));
      if (err.error && err.error.message && err.error.message.includes('API_KEY')) throw new Error('BAD_API_KEY');
      throw new Error('API_ERROR');
    }

    var data = await res.json();
    var text = ((data.candidates || [])[0] || {});
    var answer = ((text.content || {}).parts || [{ text: '' }])[0].text || '';
    if (!answer) throw new Error('EMPTY_RESPONSE');

    incrementUsage();
    return answer.trim();
  }

  // ── UI Builder ───────────────────────────────────────────
  function buildUI() {
    var cfg = getConfig();
    if (!cfg.apiKey || cfg.enabled === false) return; // don't show if not configured

    var aiName    = cfg.aiName    || 'Family Assistant';
    var greeting  = cfg.greeting  || 'Hi! I\'m your family assistant. Ask me anything about the family — members, history, events, recipes and more! 👋';
    var btnColor  = '#5c7a5c';

    // Inject styles
    var style = document.createElement('style');
    style.textContent = [
      '#faiBtn{position:fixed;bottom:24px;right:24px;z-index:9000;width:54px;height:54px;border-radius:50%;background:' + btnColor + ';border:none;cursor:pointer;box-shadow:0 4px 16px rgba(92,122,92,.4);display:flex;align-items:center;justify-content:center;font-size:1.4rem;transition:transform .2s,box-shadow .2s;}',
      '#faiBtn:hover{transform:scale(1.08);box-shadow:0 6px 20px rgba(92,122,92,.5);}',
      '#faiBtn .fai-badge{position:absolute;top:-3px;right:-3px;background:#e74c3c;color:white;border-radius:50%;width:18px;height:18px;font-size:.6rem;display:none;align-items:center;justify-content:center;font-weight:700;}',
      '#faiPanel{position:fixed;bottom:88px;right:24px;z-index:9000;width:340px;max-width:calc(100vw - 48px);background:white;border-radius:20px;box-shadow:0 12px 48px rgba(0,0,0,.15);border:1px solid #e8e4dc;display:none;flex-direction:column;overflow:hidden;animation:faiSlide .25s ease;}',
      '@keyframes faiSlide{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}',
      '#faiHeader{background:' + btnColor + ';padding:14px 16px;display:flex;align-items:center;gap:10px;flex-shrink:0;}',
      '#faiHeader .fai-av{width:32px;height:32px;border-radius:50%;background:rgba(255,255,255,.25);display:flex;align-items:center;justify-content:center;font-size:1rem;flex-shrink:0;}',
      '#faiHeader .fai-name{color:white;font-weight:600;font-size:.88rem;flex:1;}',
      '#faiHeader .fai-sub{color:rgba(255,255,255,.7);font-size:.68rem;}',
      '#faiClose{background:none;border:none;color:white;cursor:pointer;font-size:1.1rem;padding:4px;opacity:.8;}',
      '#faiClose:hover{opacity:1;}',
      '#faiMsgs{flex:1;overflow-y:auto;padding:14px;max-height:320px;display:flex;flex-direction:column;gap:10px;scroll-behavior:smooth;}',
      '.fai-msg{max-width:85%;padding:9px 13px;border-radius:14px;font-size:.78rem;line-height:1.6;word-wrap:break-word;}',
      '.fai-msg.user{align-self:flex-end;background:' + btnColor + ';color:white;border-bottom-right-radius:4px;}',
      '.fai-msg.ai{align-self:flex-start;background:#f5f3ef;color:#2c2c2c;border-bottom-left-radius:4px;}',
      '.fai-msg.system{align-self:center;background:#fef9e7;color:#856404;border-radius:10px;font-size:.72rem;text-align:center;max-width:90%;}',
      '.fai-typing{display:flex;gap:4px;padding:10px 14px;}',
      '.fai-typing span{width:7px;height:7px;background:#aaa;border-radius:50%;animation:faiDot 1.2s infinite;}',
      '.fai-typing span:nth-child(2){animation-delay:.2s;}',
      '.fai-typing span:nth-child(3){animation-delay:.4s;}',
      '@keyframes faiDot{0%,60%,100%{transform:translateY(0)}30%{transform:translateY(-6px)}}',
      '#faiSuggestions{padding:0 14px 10px;display:flex;flex-wrap:wrap;gap:6px;}',
      '.fai-sug{background:#f0f5f0;border:1px solid #c8ddc8;border-radius:20px;padding:5px 12px;font-size:.7rem;color:' + btnColor + ';cursor:pointer;transition:background .15s;}',
      '.fai-sug:hover{background:#c8ddc8;}',
      '#faiInputRow{padding:10px 12px;border-top:1px solid #eee;display:flex;gap:8px;flex-shrink:0;}',
      '#faiInput{flex:1;border:1.5px solid #ddd;border-radius:20px;padding:8px 14px;font-size:.78rem;outline:none;font-family:inherit;}',
      '#faiInput:focus{border-color:' + btnColor + ';}',
      '#faiSend{background:' + btnColor + ';border:none;border-radius:50%;width:34px;height:34px;cursor:pointer;display:flex;align-items:center;justify-content:center;color:white;flex-shrink:0;font-size:.85rem;}',
      '#faiSend:disabled{opacity:.4;cursor:default;}',
      '#faiUsage{padding:4px 14px 8px;font-size:.65rem;color:#aaa;text-align:right;}',
      '@media(max-width:400px){#faiPanel{right:12px;bottom:80px;width:calc(100vw - 24px);}#faiBtn{right:12px;bottom:12px;}}'
    ].join('');
    document.head.appendChild(style);

    // Suggestions based on what data exists
    var members  = Object.values(load('nukala_tree_data') || {});
    var events   = load('nukala_events') || [];
    var history  = load('nukala_history') || [];
    var recipes  = load('nukala_recipes') || [];
    var sugs = [];
    if (members.length)  sugs.push('How many members do we have?');
    if (members.length)  sugs.push('Who is the oldest member?');
    if (events.length)   sugs.push('What events are coming up?');
    if (history.length)  sugs.push('Tell me about our family history');
    if (recipes.length)  sugs.push('What recipes do we have?');
    sugs.push('Where does our family live?');

    // Build HTML
    var panel = document.createElement('div');
    panel.id = 'faiPanel';
    panel.innerHTML = [
      '<div id="faiHeader">',
        '<div class="fai-av">🤖</div>',
        '<div style="flex:1"><div class="fai-name">' + aiName + '</div><div class="fai-sub">Family AI · Free</div></div>',
        '<button id="faiClose" title="Close">✕</button>',
      '</div>',
      '<div id="faiMsgs">',
        '<div class="fai-msg ai">' + greeting + '</div>',
      '</div>',
      '<div id="faiSuggestions">',
        sugs.slice(0, 4).map(function (s) {
          return '<button class="fai-sug">' + s + '</button>';
        }).join(''),
      '</div>',
      '<div id="faiInputRow">',
        '<input type="text" id="faiInput" placeholder="Ask about your family..." maxlength="200"/>',
        '<button id="faiSend">➤</button>',
      '</div>',
      '<div id="faiUsage"></div>',
    ].join('');

    var btn = document.createElement('button');
    btn.id = 'faiBtn';
    btn.title = 'Ask ' + aiName;
    btn.innerHTML = '🤖<div class="fai-badge" id="faiBadge">!</div>';

    document.body.appendChild(panel);
    document.body.appendChild(btn);

    // State
    var chatHistory = [];
    var open = false;

    function updateUsageBar() {
      var u = getUsage();
      var el = document.getElementById('faiUsage');
      if (el) el.textContent = u.count + ' / ' + DAILY_LIMIT + ' questions used today';
    }

    function togglePanel() {
      open = !open;
      panel.style.display = open ? 'flex' : 'none';
      if (open) {
        updateUsageBar();
        setTimeout(function () { document.getElementById('faiInput').focus(); }, 100);
        document.getElementById('faiBadge').style.display = 'none';
      }
    }

    btn.addEventListener('click', togglePanel);
    document.getElementById('faiClose').addEventListener('click', togglePanel);

    // Suggestion clicks
    panel.querySelectorAll('.fai-sug').forEach(function (b) {
      b.addEventListener('click', function () { sendMessage(b.textContent); });
    });

    function addMsg(text, role) {
      var msgs = document.getElementById('faiMsgs');
      var div = document.createElement('div');
      div.className = 'fai-msg ' + role;
      div.textContent = text;
      msgs.appendChild(div);
      msgs.scrollTop = msgs.scrollHeight;
      return div;
    }

    function addTyping() {
      var msgs = document.getElementById('faiMsgs');
      var div = document.createElement('div');
      div.className = 'fai-typing';
      div.id = 'faiTyping';
      div.innerHTML = '<span></span><span></span><span></span>';
      msgs.appendChild(div);
      msgs.scrollTop = msgs.scrollHeight;
    }

    function removeTyping() {
      var t = document.getElementById('faiTyping');
      if (t) t.remove();
    }

    async function sendMessage(text) {
      text = (text || '').trim();
      if (!text) return;

      var input = document.getElementById('faiInput');
      var sendBtn = document.getElementById('faiSend');
      var sugsEl = document.getElementById('faiSuggestions');

      input.value = '';
      sendBtn.disabled = true;
      if (sugsEl) sugsEl.style.display = 'none'; // hide suggestions after first message

      addMsg(text, 'user');
      addTyping();

      try {
        var answer = await askGemini(text, chatHistory);
        removeTyping();
        addMsg(answer, 'ai');
        chatHistory.push({ role: 'user', text: text });
        chatHistory.push({ role: 'ai', text: answer });
        // Keep history manageable
        if (chatHistory.length > 12) chatHistory = chatHistory.slice(-12);
        updateUsageBar();
      } catch (e) {
        removeTyping();
        if (e.name === 'AbortError') {
          addMsg('The request timed out. Please check your internet connection and try again.', 'system');
        } else if (e.message === 'RATE_LIMIT') {
          var countdown = fmtCountdown(msToMidnight());
          addMsg('Our family assistant has answered a lot of questions today! 🌙 It will be back in ' + countdown + '. Browse the site in the meantime!', 'system');
        } else if (e.message === 'NO_API_KEY') {
          addMsg('The family AI hasn\'t been set up yet. Ask the family admin to configure it.', 'system');
        } else if (e.message === 'BAD_API_KEY') {
          addMsg('There\'s a problem with the AI configuration. Ask the family admin to check the API key.', 'system');
        } else {
          addMsg('Sorry, I couldn\'t get a response right now. Please try again in a moment.', 'system');
        }
      }

      sendBtn.disabled = false;
      input.focus();
    }

    // Send on button click or Enter
    document.getElementById('faiSend').addEventListener('click', function () {
      sendMessage(document.getElementById('faiInput').value);
    });
    document.getElementById('faiInput').addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(this.value); }
    });

    updateUsageBar();
  }

  // ── Init ─────────────────────────────────────────────────
  // Don't show on admin page
  if (window.location.pathname.indexOf('admin') !== -1) return;

  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    buildUI();
  } else {
    document.addEventListener('DOMContentLoaded', buildUI);
  }
})();
