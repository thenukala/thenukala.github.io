/**
 * site-data.js — Nukala Family Archive
 * 
 * HOW TO UPDATE:
 * 1. Go to Admin Panel
 * 2. Make your changes (add members, photos etc.)
 * 3. Click "Publish to Site" button in the sidebar
 * 4. Download this file
 * 5. Upload to GitHub (replace this file)
 * 6. All devices see your changes within 1-2 minutes
 *
 * This file is loaded fresh on every page visit (no caching)
 * so your family always sees the latest data.
 */
(function(){
  // DATA is populated when you click "Publish to Site" in Admin
  var DATA = {};

  // Write all data to localStorage so every page can read it
  Object.keys(DATA).forEach(function(k){
    if(DATA[k] !== undefined){
      localStorage.setItem(k, JSON.stringify(DATA[k]));
    }
  });
})();
