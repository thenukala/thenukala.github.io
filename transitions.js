// Smooth page transitions
(function(){
  const style=document.createElement('style');
  style.textContent=`
    .page-transition-out{animation:pageOut .25s ease forwards!important;}
    .page-transition-in{animation:pageIn .35s ease forwards!important;}
    @keyframes pageOut{to{opacity:0;transform:translateY(-8px)}}
    @keyframes pageIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
    body{animation:pageIn .4s ease;}
  `;
  document.head.appendChild(style);
  document.addEventListener('click',e=>{
    const a=e.target.closest('a[href]');
    if(!a||!a.href||a.target==='_blank'||a.href.startsWith('mailto')||a.href.startsWith('tel')) return;
    const url=new URL(a.href);
    if(url.origin!==location.origin) return;
    e.preventDefault();
    document.body.classList.add('page-transition-out');
    setTimeout(()=>{ window.location.href=a.href; },240);
  });
})();
