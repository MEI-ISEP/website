/* ============================================================
   reveal.js — MEI · ISEP website
   Generic scroll-reveal engine shared by every page. Position-
   based (getBoundingClientRect), not IntersectionObserver, with
   a scroll listener + a bounded poll fallback so nothing can be
   left stuck invisible regardless of how scroll is driven.
   ============================================================ */
(function () {
  var reveals = [];
  function collect() { reveals = [].slice.call(document.querySelectorAll('.reveal:not(.in)')); }
  function tick() {
    if (!reveals.length) return;
    var vh = window.innerHeight || document.documentElement.clientHeight;
    var still = [];
    for (var i = 0; i < reveals.length; i++) {
      var r = reveals[i].getBoundingClientRect();
      if (r.top < vh * 0.92) reveals[i].classList.add('in');
      else still.push(reveals[i]);
    }
    reveals = still;
  }
  var ticking = false;
  function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(function () { ticking = false; tick(); }); } }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  window.addEventListener('load', function () { collect(); tick(); });
  document.addEventListener('DOMContentLoaded', function () { collect(); tick(); });
  var poll = setInterval(function () { tick(); if (!reveals.length) clearInterval(poll); }, 200);
  setTimeout(function () { clearInterval(poll); }, 20000);
  // re-collect once dynamic content from page-specific render scripts settles
  setTimeout(function () { collect(); tick(); }, 100);
  window.__meiCollectReveals = function () { collect(); tick(); };
})();
