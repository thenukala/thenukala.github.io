/* auth.js – include on every protected page */
(function(){
  if(sessionStorage.getItem('nukala_auth')!=='true'){
    window.location.replace('index.html');
    return;
  }
  // Track page visit
  try{
    const page = location.pathname.split('/').pop() || 'index.html';
    const now = new Date().toISOString();
    const today = new Date().toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'});
    const time = new Date().toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit'});

    // Log visit
    const visits = JSON.parse(localStorage.getItem('nukala_visits')||'[]');
    visits.push({ page, date: today, time, ts: Date.now() });
    // Keep last 500 visits only
    if(visits.length > 500) visits.splice(0, visits.length - 500);
    localStorage.setItem('nukala_visits', JSON.stringify(visits));

    // Update page view counts
    const counts = JSON.parse(localStorage.getItem('nukala_page_counts')||'{}');
    counts[page] = (counts[page]||0) + 1;
    localStorage.setItem('nukala_page_counts', JSON.stringify(counts));

    // Track unique sessions
    const sessions = JSON.parse(localStorage.getItem('nukala_sessions')||'[]');
    const lastSession = sessions[sessions.length-1];
    const sessionKey = today + '-' + sessionStorage.getItem('nukala_session_id');
    if(!sessionStorage.getItem('nukala_session_id')){
      const sid = 'S' + Date.now();
      sessionStorage.setItem('nukala_session_id', sid);
      sessions.push({ sid, date: today, time, ts: Date.now(), pages: [page] });
      if(sessions.length > 200) sessions.splice(0, sessions.length - 200);
      localStorage.setItem('nukala_sessions', JSON.stringify(sessions));
    } else {
      // Add page to existing session
      const sid = sessionStorage.getItem('nukala_session_id');
      const sess = sessions.find(s => s.sid === sid);
      if(sess && !sess.pages.includes(page)) sess.pages.push(page);
      localStorage.setItem('nukala_sessions', JSON.stringify(sessions));
    }
  } catch(e){}
})();

function logout(){
  sessionStorage.removeItem('nukala_auth');
  sessionStorage.removeItem('nukala_session_id');
  window.location.href = 'index.html';
}
