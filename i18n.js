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
    if (q && SUPPORTED.indexOf(q.toLowerCase()) > -1) {
      q = q.toLowerCase();
      /* Treat the link as an explicit choice and remember it, so the
         language survives the visitor's next click instead of lasting a
         single page load. Note this deliberately overrides a preference
         they may have set with the PT/EN switch earlier. */
      try { localStorage.setItem(STORE, q); } catch (e) { /* storage blocked */ }
      return q;
    }
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
    var stored = false;
    try { localStorage.setItem(STORE, next); stored = true; } catch (e) { /* blocked */ }
    /* Stored choice: drop any ?lang= so the stored choice is what takes
       effect, and the URL stays clean. Storage blocked (private windows,
       cookies-off): carry the choice in the URL instead, or the switch
       would appear to do nothing at all. */
    location.href = stored
      ? location.pathname + location.hash
      : location.pathname + '?lang=' + next + location.hash;
  };

  /* ---- Carry the language across internal links ------------------------
     Persisting the choice above covers the normal case. This covers the
     one it can't: a visitor with storage blocked, who would otherwise drop
     back to Portuguese on their first click. It also makes any URL they
     copy carry the language with it.

     Only non-default languages are tagged, so Portuguese URLs stay clean. */
  function localizeHref(href) {
    if (!href) return null;
    if (/^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(href)) return null; // external, mailto, tel
    if (href.charAt(0) === '#') return null;                     // same page
    if (/[?&]lang=/i.test(href)) return null;                    // already tagged
    var hash = '', h = href.indexOf('#');
    if (h > -1) { hash = href.slice(h); href = href.slice(0, h); }
    return href + (href.indexOf('?') > -1 ? '&' : '?') + 'lang=' + lang + hash;
  }

  window.MEI_localizeLinks = function (root) {
    if (lang === FALLBACK) return;
    var scope = root || document;
    if (!scope.querySelectorAll) return;
    var links = scope.querySelectorAll('a[href]');
    for (var i = 0; i < links.length; i++) {
      var next = localizeHref(links[i].getAttribute('href'));
      if (next) links[i].setAttribute('href', next);
    }
    /* querySelectorAll skips the root itself. */
    if (scope.tagName === 'A' && scope.getAttribute('href')) {
      var self = localizeHref(scope.getAttribute('href'));
      if (self) scope.setAttribute('href', self);
    }
  };

  /* nav.js, render.js and faq.js all inject links after this file runs, so
     watch for them rather than making each render script call in. Only
     childList is observed, so rewriting an href cannot re-trigger this. */
  if (lang !== FALLBACK && window.MutationObserver) {
    new MutationObserver(function (muts) {
      for (var i = 0; i < muts.length; i++) {
        var added = muts[i].addedNodes;
        for (var j = 0; j < added.length; j++) {
          if (added[j].nodeType === 1) window.MEI_localizeLinks(added[j]);
        }
      }
    }).observe(document.documentElement, { childList: true, subtree: true });
  }

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
  window.MEI_localizeLinks();
})();
