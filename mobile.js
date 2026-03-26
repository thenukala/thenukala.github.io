// Mobile hamburger menu
(function(){
  document.addEventListener('DOMContentLoaded', function(){
    const nav = document.querySelector('nav');
    if(!nav) return;

    // Add hamburger button
    if(!document.querySelector('.nav-hamburger')){
      const burger = document.createElement('button');
      burger.className = 'nav-hamburger';
      burger.setAttribute('aria-label', 'Toggle menu');
      burger.innerHTML = '<span></span><span></span><span></span>';
      burger.onclick = function(){
        burger.classList.toggle('open');
        const links = document.querySelector('.nav-links');
        if(links) links.classList.toggle('mobile-open');
        // Show/hide sign out button
        document.querySelectorAll('.nav-logout').forEach(b=>{
          b.style.display = links.classList.contains('mobile-open') ? 'block' : '';
        });
      };

      // Insert after brand
      const brand = nav.querySelector('.nav-brand');
      if(brand) brand.parentNode.insertBefore(burger, brand.nextSibling);
    }

    // Close menu when a link is clicked
    document.querySelectorAll('.nav-links a').forEach(a=>{
      a.addEventListener('click', function(){
        document.querySelector('.nav-hamburger')?.classList.remove('open');
        document.querySelector('.nav-links')?.classList.remove('mobile-open');
      });
    });
  });
})();
