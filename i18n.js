/* ============================================================
   i18n.js — MEI · ISEP website
   Picks the active language and exposes it as window.MEI, so the
   render scripts keep reading M.<field> with no language logic of
   their own. Two complete content objects are loaded (MEI_PT from
   content.js, MEI_EN from content.en.js) and this file chooses.

   Static markup is translated by tagging elements:
     <h2 data-i18n="curso.h2">                  -> innerHTML
     <meta data-i18n-attr="content:meta.home">  -> attribute

   Load order matters: content.js, content.en.js, i18n.js, then
   nav.js / render.js / faq.js / candidatura.js.
   ============================================================ */
(function () {
  var STORE = 'mei-lang';
  var FALLBACK = 'pt';
  var SUPPORTED = ['pt', 'en'];

  function pick() {
    /* Portuguese is the default: only an explicit choice changes it.
       ?lang= wins, so a link can force a language; then a choice the
       visitor previously made here. The browser's own language is
       deliberately NOT consulted. */
    var q = (location.search.match(/[?&]lang=([a-z]{2})/i) || [])[1];
    if (q && SUPPORTED.indexOf(q.toLowerCase()) > -1) return q.toLowerCase();
    try {
      var saved = localStorage.getItem(STORE);
      if (SUPPORTED.indexOf(saved) > -1) return saved;
    } catch (e) { /* storage blocked; fall through */ }
    return FALLBACK;
  }

  var lang = pick();
  var bundle = (lang === 'en' ? window.MEI_EN : window.MEI_PT) || window.MEI_PT;
  if (!bundle) { console.error('i18n: no content bundle loaded'); return; }

  window.MEI_LANG = lang;
  window.MEI = bundle;
  document.documentElement.lang = lang;

  window.MEI_setLang = function (next) {
    if (SUPPORTED.indexOf(next) < 0 || next === lang) return;
    try { localStorage.setItem(STORE, next); } catch (e) { /* ignore */ }
    /* Drop any ?lang= so the stored choice is what takes effect. */
    location.href = location.pathname + location.hash;
  };

  /* Resolve "a.b.c" against the ui dictionary. */
  function lookup(key) {
    var node = bundle.ui;
    var parts = key.split('.');
    for (var i = 0; i < parts.length && node != null; i++) node = node[parts[i]];
    return typeof node === 'string' ? node : null;
  }
  window.MEI_t = lookup;

  window.MEI_applyUI = function (root) {
    var scope = root || document;
    scope.querySelectorAll('[data-i18n]').forEach(function (n) {
      var v = lookup(n.getAttribute('data-i18n'));
      if (v != null) n.innerHTML = v;
    });
    scope.querySelectorAll('[data-i18n-attr]').forEach(function (n) {
      n.getAttribute('data-i18n-attr').split(';').forEach(function (pair) {
        var bits = pair.split(':');
        var v = lookup(bits[1]);
        if (v != null) n.setAttribute(bits[0], v);
      });
    });
  };

  window.MEI_applyUI();
})();
