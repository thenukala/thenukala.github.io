/* auth.js — Page protection + full visitor tracking */
(function(){
  if(sessionStorage.getItem('nukala_auth')!=='true'){
    window.location.replace('index.html');
    return;
  }

  // ── Visitor fingerprint ──
  function getDevice(){
    const ua = navigator.userAgent;
    if(/iPhone|iPad|iPod/.test(ua)) return '📱 iPhone/iPad';
    if(/Android/.test(ua)) return '📱 Android';
    if(/Mac/.test(ua)) return '💻 Mac';
    if(/Windows/.test(ua)) return '🖥️ Windows';
    if(/Linux/.test(ua)) return '🐧 Linux';
    return '❓ Unknown';
  }
  function getBrowser(){
    const ua = navigator.userAgent;
    if(/CriOS|Chrome/.test(ua) && !/Edg/.test(ua)) return 'Chrome';
    if(/Safari/.test(ua) && !/Chrome/.test(ua)) return 'Safari';
    if(/Firefox/.test(ua)) return 'Firefox';
    if(/Edg/.test(ua)) return 'Edge';
    if(/OPR|Opera/.test(ua)) return 'Opera';
    return 'Other';
  }
  function getScreen(){
    return window.screen.width + 'x' + window.screen.height;
  }
  function getTimezone(){
    try{ return Intl.DateTimeFormat().resolvedOptions().timeZone; } catch(e){ return 'Unknown'; }
  }

  const page    = location.pathname.split('/').pop() || 'home.html';
  const now     = new Date();
  const dateStr = now.toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'});
  const timeStr = now.toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit',second:'2-digit'});
  const sid     = sessionStorage.getItem('nukala_session_id') || ('S'+Date.now());
  if(!sessionStorage.getItem('nukala_session_id')) sessionStorage.setItem('nukala_session_id', sid);

  // Base visit record (no IP yet)
  const visitBase = {
    sid, page, date: dateStr, time: timeStr, ts: Date.now(),
    device: getDevice(), browser: getBrowser(),
    os: navigator.platform||'Unknown',
    screen: getScreen(), timezone: getTimezone(),
    lang: navigator.language||'Unknown',
    ip: 'Fetching...', country: '...', city: '...', isp: '...'
  };

  // Save immediately with base data
  function saveVisit(visit){
    try{
      // Page visits log
      const visits = JSON.parse(localStorage.getItem('nukala_visits')||'[]');
      // Update existing entry for this sid+page or add new
      const existing = visits.findIndex(v=>v.sid===visit.sid && v.page===visit.page);
      if(existing >= 0) visits[existing] = visit;
      else visits.push(visit);
      if(visits.length > 500) visits.splice(0, visits.length-500);
      localStorage.setItem('nukala_visits', JSON.stringify(visits));

      // Page counts
      const counts = JSON.parse(localStorage.getItem('nukala_page_counts')||'{}');
      counts[page] = (counts[page]||0) + (existing >= 0 ? 0 : 1);
      localStorage.setItem('nukala_page_counts', JSON.stringify(counts));

      // Unique visitors by IP
      if(visit.ip && visit.ip !== 'Fetching...'){
        const visitors = JSON.parse(localStorage.getItem('nukala_visitors')||'[]');
        const existingV = visitors.findIndex(v=>v.ip===visit.ip);
        if(existingV >= 0){
          visitors[existingV].lastSeen = dateStr+' '+timeStr;
          visitors[existingV].visits = (visitors[existingV].visits||1) + 1;
          visitors[existingV].pages = [...new Set([...(visitors[existingV].pages||[]),page])];
        } else {
          visitors.push({
            ip:visit.ip, country:visit.country, city:visit.city, isp:visit.isp,
            device:visit.device, browser:visit.browser, timezone:visit.timezone,
            firstSeen:dateStr+' '+timeStr, lastSeen:dateStr+' '+timeStr,
            visits:1, pages:[page]
          });
        }
        if(visitors.length > 200) visitors.splice(0, visitors.length-200);
        localStorage.setItem('nukala_visitors', JSON.stringify(visitors));
      }
    } catch(e){}
  }

  // Save base data immediately
  saveVisit({...visitBase});

  // Fetch IP + geo info (free APIs, no key needed)
  async function fetchIPData(){
    try{
      // Get IP
      const ipRes = await fetch('https://api.ipify.org?format=json', {cache:'no-store'});
      const ipData = await ipRes.json();
      const ip = ipData.ip;

      // Get geo from IP
      const geoRes = await fetch(`https://ipapi.co/${ip}/json/`, {cache:'no-store'});
      const geo = await geoRes.json();

      const enriched = {
        ...visitBase,
        ip: ip || 'Unknown',
        country: (geo.country_name||'Unknown') + ' ' + (geo.country_code?`(${geo.country_code})`:''),
        city: geo.city || 'Unknown',
        region: geo.region || '',
        isp: geo.org || geo.asn || 'Unknown',
        latitude: geo.latitude || '',
        longitude: geo.longitude || '',
      };
      saveVisit(enriched);
    } catch(e){
      // If IP fetch fails, save with unknown IP
      saveVisit({...visitBase, ip:'Could not fetch', country:'Unknown', city:'Unknown', isp:'Unknown'});
    }
  }

  // Fetch IP in background — don't block page load
  setTimeout(fetchIPData, 800);

  // Track session pages
  try{
    const sessions = JSON.parse(localStorage.getItem('nukala_sessions')||'[]');
    const sess = sessions.find(s=>s.sid===sid);
    if(sess){
      if(!sess.pages.includes(page)) sess.pages.push(page);
      sess.lastSeen = dateStr+' '+timeStr;
    } else {
      sessions.push({sid, date:dateStr, time:timeStr, ts:Date.now(), pages:[page], lastSeen:dateStr+' '+timeStr});
    }
    if(sessions.length > 200) sessions.splice(0, sessions.length-200);
    localStorage.setItem('nukala_sessions', JSON.stringify(sessions));
  } catch(e){}

})();

function logout(){
  sessionStorage.removeItem('nukala_auth');
  sessionStorage.removeItem('nukala_session_id');
  window.location.href = 'index.html';
}
