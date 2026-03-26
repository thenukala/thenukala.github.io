// Push notification support for birthdays
(function(){
  if(!('Notification' in window)||!('serviceWorker' in navigator)) return;
  async function checkBirthdayNotifications(){
    const contacts=JSON.parse(localStorage.getItem('nukala_contacts')||'{}');
    const members=JSON.parse(localStorage.getItem('nukala_tree_data')||'{}');
    const today=new Date();
    const todayStr=today.toLocaleDateString('en-US',{month:'long',day:'numeric'}).toLowerCase();
    Object.values(members).forEach(m=>{
      const c=contacts[m.id]; if(!c||!c.birthday) return;
      if(todayStr.includes(c.birthday.toLowerCase().split(' ')[0])&&todayStr.includes(c.birthday.toLowerCase().split(' ')[1])){
        const name=[m.firstName,m.lastName].filter(Boolean).join(' ');
        if(Notification.permission==='granted'){
          new Notification('🎂 Birthday Today!',{body:`Today is ${name}'s birthday! Wishing them a wonderful day!`,icon:'logo.png',badge:'favicon.ico'});
        }
      }
    });
  }
  window.enableNotifications=async function(){
    const perm=await Notification.requestPermission();
    if(perm==='granted'){ checkBirthdayNotifications(); alert('✅ Notifications enabled! You will be notified on family birthdays.'); }
    else alert('Notifications blocked. Please allow in browser settings.');
  };
  // Auto check if already granted
  if(Notification.permission==='granted') checkBirthdayNotifications();
})();
