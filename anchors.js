/* ============================================================
   anchors.js — MEI · ISEP website
   Gives every main section a copy-able deep link. Hovering a
   section heading reveals a "#" that copies the absolute URL of
   that section to the clipboard and sets the hash, the same
   affordance faq.js already gives each individual question.

   A heading is anchorable when it carries an id of its own, or
   sits inside a <section> that does. Those ids are hand-written
   in the HTML (never derived from the heading text) so a copied
   link keeps working in both language bundles.

   Load after i18n.js: MEI_applyUI() rewrites the innerHTML of
   every [data-i18n] heading, which would wipe the link.
   ============================================================ */
(function () {
  var A = (((window.MEI || {}).ui) || {}).anchor || {};
  var LABEL = A.copy || 'Copiar ligação';
  var DONE = A.copied || 'Ligação copiada';

  /* Section headings, plus the standalone eyebrows that label a
     subsection of their own (they carry the id directly). */
  var heads = document.querySelectorAll(
    '.section h2, .subhero h1, .section .eyebrow[id], .subhero .eyebrow[id]'
  );

  function targetOf(el) {
    if (el.id) return el.id;
    var sec = el.closest('section[id]');
    return sec ? sec.id : null;
  }

  function urlFor(id) {
    /* location.origin is "null" over file://, so cut the current URL
       instead of rebuilding it. Non-default languages are carried in
       the link the same way i18n.js tags internal hrefs. */
    var base = location.href.replace(/[?#].*$/, '');
    var lang = window.MEI_LANG;
    return base + (lang && lang !== 'pt' ? '?lang=' + lang : '') + '#' + id;
  }

  function copy(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text);
    }
    /* Insecure origins (plain http, file://) have no async clipboard. */
    return new Promise(function (resolve, reject) {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.cssText = 'position:fixed;top:-1000px;opacity:0';
      document.body.appendChild(ta);
      ta.select();
      var ok = false;
      try { ok = document.execCommand('copy'); } catch (e) { /* blocked */ }
      document.body.removeChild(ta);
      ok ? resolve() : reject();
    });
  }

  for (var i = 0; i < heads.length; i++) {
    (function (head) {
      var id = targetOf(head);
      if (!id || head.querySelector('.anchor-link')) return;

      var a = document.createElement('a');
      a.className = 'anchor-link';
      a.href = '#' + id;
      a.textContent = '#';
      a.title = LABEL;
      a.setAttribute('aria-label', LABEL);
      head.classList.add('anchor-host');
      head.appendChild(a);

      a.addEventListener('click', function () {
        /* The default click still runs: the hash lands in the address
           bar and the page scrolls, so the link works even if the
           clipboard is blocked. */
        copy(urlFor(id)).then(function () {
          a.classList.add('copied');
          a.title = DONE;
          setTimeout(function () {
            a.classList.remove('copied');
            a.title = LABEL;
          }, 1400);
        }, function () { /* clipboard blocked; the hash is set anyway */ });
      });
    })(heads[i]);
  }
})();
