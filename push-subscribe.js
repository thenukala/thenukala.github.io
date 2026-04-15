// Nukala Family — Push Subscription Handler
// Loaded on all pages to handle subscribe/unsubscribe
(function(){
  var VAPID_PUBLIC_KEY = 'BOWG3ZTrxXas91IEwEm4WZXlk7zV2y2zSYNcyLO-D0b-_zWNqRlQeinnX-S_eJrTRtqwRyhpg5JexYHQMklFT30';

  function getWorkerConfig(){
    try{ return JSON.parse(localStorage.getItem('nukala_notif_config')||'{}'); }catch(e){ return {}; }
  }

  function urlBase64ToUint8Array(base64String){
    var padding = '='.repeat((4 - base64String.length % 4) % 4);
    var base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    var rawData = window.atob(base64);
    var outputArray = new Uint8Array(rawData.length);
    for (var i = 0; i < rawData.length; ++i) outputArray[i] = rawData.charCodeAt(i);
    return outputArray;
  }

  async function subscribe(){
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) return null;
    var cfg = getWorkerConfig();
    if (!cfg.workerUrl) return null;
    var reg = await navigator.serviceWorker.ready;
    var sub = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
    });
    // Send to Cloudflare Worker
    await fetch(cfg.workerUrl + '/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sub.toJSON())
    });
    localStorage.setItem('nukala_push_subscribed', '1');
    return sub;
  }

  async function unsubscribe(){
    if (!('serviceWorker' in navigator)) return;
    var cfg = getWorkerConfig();
    var reg = await navigator.serviceWorker.ready;
    var sub = await reg.pushManager.getSubscription();
    if (sub) {
      if (cfg.workerUrl) {
        await fetch(cfg.workerUrl + '/unsubscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(sub.toJSON())
        }).catch(()=>{});
      }
      await sub.unsubscribe();
      localStorage.removeItem('nukala_push_subscribed');
    }
  }

  async function checkSubscription(){
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) return false;
    var reg = await navigator.serviceWorker.ready;
    var sub = await reg.pushManager.getSubscription();
    return !!sub;
  }

  // Show subscribe banner if not yet subscribed and worker URL is configured
  async function maybeShowBanner(){
    var cfg = getWorkerConfig();
    if (!cfg.workerUrl) return; // admin hasn't set up worker yet
    if (localStorage.getItem('nukala_push_dismissed')) return;
    if (localStorage.getItem('nukala_push_subscribed')) return;
    if (!('Notification' in window)) return;
    if (Notification.permission === 'denied') return;
    var alreadySubscribed = await checkSubscription();
    if (alreadySubscribed) { localStorage.setItem('nukala_push_subscribed','1'); return; }

    // Create banner
    var banner = document.createElement('div');
    banner.id = 'pushBanner';
    banner.innerHTML = [
      '<div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap;">',
      '<span style="font-size:1.3rem;">&#128276;</span>',
      '<div style="flex:1;min-width:180px;">',
        '<div style="font-size:.84rem;font-weight:600;color:#2c2c2c;">Stay updated with family news</div>',
        '<div style="font-size:.75rem;color:#666;margin-top:2px;">Get instant notifications when events or announcements are posted</div>',
      '</div>',
      '<div style="display:flex;gap:8px;flex-shrink:0;">',
        '<button id="pushAllowBtn" style="background:#5c7a5c;color:white;border:none;border-radius:8px;padding:8px 16px;font-size:.78rem;font-weight:500;cursor:pointer;">&#10003; Allow</button>',
        '<button id="pushDismissBtn" style="background:transparent;border:1.5px solid #ddd;border-radius:8px;padding:8px 12px;font-size:.78rem;cursor:pointer;color:#999;">Not now</button>',
      '</div>',
      '</div>'
    ].join('');
    banner.style.cssText = 'position:fixed;bottom:20px;left:50%;transform:translateX(-50%);z-index:9999;background:white;border:1px solid #e0d9cd;border-radius:16px;padding:16px 20px;box-shadow:0 8px 32px rgba(0,0,0,.12);max-width:480px;width:calc(100% - 40px);animation:slideUp .3s ease;';

    if (!document.getElementById('pushBannerStyle')) {
      var st = document.createElement('style');
      st.id = 'pushBannerStyle';
      st.textContent = '@keyframes slideUp{from{transform:translateX(-50%) translateY(20px);opacity:0}to{transform:translateX(-50%) translateY(0);opacity:1}}';
      document.head.appendChild(st);
    }

    document.body.appendChild(banner);

    document.getElementById('pushAllowBtn').addEventListener('click', async function(){
      var perm = await Notification.requestPermission();
      if (perm === 'granted') {
        await subscribe();
        banner.remove();
        // Show success toast
        var t = document.createElement('div');
        t.textContent = '\u2705 You will now receive family notifications!';
        t.style.cssText = 'position:fixed;bottom:20px;left:50%;transform:translateX(-50%);background:#5c7a5c;color:white;padding:10px 20px;border-radius:10px;font-size:.8rem;z-index:10000;';
        document.body.appendChild(t);
        setTimeout(()=>t.remove(), 3000);
      } else {
        banner.remove();
        localStorage.setItem('nukala_push_dismissed', '1');
      }
    });

    document.getElementById('pushDismissBtn').addEventListener('click', function(){
      banner.remove();
      localStorage.setItem('nukala_push_dismissed', '1');
    });
  }

  // Run after page loads
  if (document.readyState === 'complete') {
    setTimeout(maybeShowBanner, 2000);
  } else {
    window.addEventListener('load', function(){ setTimeout(maybeShowBanner, 2000); });
  }

  // Expose for manual use
  window.nukalaSubscribe = subscribe;
  window.nukalaUnsubscribe = unsubscribe;
})();
