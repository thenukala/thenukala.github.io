/* auth.js – include on every protected page */
(function () {
  if (sessionStorage.getItem('nukala_auth') !== 'true') {
    window.location.replace('index.html');
  }
})();

function logout() {
  sessionStorage.removeItem('nukala_auth');
  window.location.href = 'index.html';
}
