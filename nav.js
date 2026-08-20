/* ============================================================
   nav.js — MEI · ISEP website
   Shared header (nav) + footer, injected into #site-nav /
   #site-footer placeholders so every page stays in sync.
   Reads body[data-page] to know whether it's the homepage
   (transparent-to-solid dark nav over a hero) or a subpage
   (nav is solid/light from the start, no hero underneath).
   Also owns: burger menu and scroll-spy over in-page anchors
   when present.
   ============================================================ */
(function () {
  var page = document.body.getAttribute('data-page') || 'home';
  var isHome = page === 'home';
  var U = ((window.MEI || {}).ui) || {};
  var L = U.nav || {}, F = U.footer || {};

  /* Standalone pages that sit alongside the homepage anchors.
     Candidatura is not listed here: it already has the CTA button. */
  var pages = [
    { id: 'cooperacao', href: 'cooperacao.html', label: L.cooperacao },
    { id: 'faq', href: 'faq.html', label: L.faq }
  ];

  var homeAnchors = [
    { id: 'curso', href: 'curso', label: L.curso },
    { id: 'especializacoes', href: 'especializacoes', label: L.especializacoes },
    { id: 'estrutura', href: 'estrutura', label: L.estrutura },
    { id: 'saidas', href: 'saidas', label: L.saidas },
    { id: 'contactos', href: 'contactos', label: L.contactos }
  ];

  function homeHref(a) { return isHome ? '#' + a.href : 'index.html#' + a.href; }

  var linksHTML = homeAnchors.map(function (a) {
    return '<a class="nav__link" data-id="' + a.id + '" href="' + homeHref(a) + '">' + a.label + '</a>';
  }).join('') +
  pages.map(function (p) {
    return '<a class="nav__link' + (page === p.id ? ' active' : '') + '" href="' + p.href + '">' + p.label + '</a>';
  }).join('');

  /* Language switch. MEI_setLang stores the choice and reloads. */
  var cur = window.MEI_LANG || 'pt';
  var langHTML =
    '<div class="langsw" role="group" aria-label="Language">' +
      ['pt', 'en'].map(function (code) {
        return '<button type="button" class="langsw__b' + (code === cur ? ' active' : '') +
          '" data-lang="' + code + '"' + (code === cur ? ' aria-current="true"' : '') + '>' +
          code.toUpperCase() + '</button>';
      }).join('') +
    '</div>';

  var navHTML =
    '<header class="nav' + (isHome ? '' : ' scrolled') + '" id="nav">' +
      '<div class="nav__inner">' +
        '<a class="brand" href="index.html" aria-label="ISEP · MEI">' +
          '<span class="brand__bar"></span><span class="brand__isep">ISEP</span><span class="brand__sub">MEI</span>' +
        '</a>' +
        '<nav class="nav__links" id="navLinks">' + linksHTML + '</nav>' +
        langHTML +
        '<a class="nav__cta" href="candidatura.html">' + L.cta + '</a>' +
        '<button class="nav__burger" id="burger" aria-label="' + L.menu + '" aria-expanded="false"><span></span><span></span><span></span></button>' +
      '</div>' +
    '</header>';

  var footerHTML =
    '<footer class="footer">' +
      '<div class="wrap footer__inner">' +
        '<div class="footer__brand"><span class="brand__bar"></span><span class="brand__isep" style="color:#fff;font-size:17px;">ISEP</span><span class="brand__sub" style="color:rgba(255,255,255,.5);">' + F.dept + '</span></div>' +
        '<nav class="footer__links">' +
          '<a href="index.html">' + F.home + '</a><a href="candidatura.html">' + F.candidatura + '</a><a href="cooperacao.html">' + F.cooperacao + '</a><a href="faq.html">' + F.faq + '</a>' +
        '</nav>' +
        '<div class="footer__meta">' + F.meta + '</div>' +
      '</div>' +
    '</footer>';

  var navSlot = document.getElementById('site-nav');
  var footSlot = document.getElementById('site-footer');
  if (navSlot) navSlot.outerHTML = navHTML;
  if (footSlot) footSlot.outerHTML = footerHTML;

  var nav = document.getElementById('nav');
  var burger = document.getElementById('burger');
  var navLinks = document.getElementById('navLinks');

  document.querySelectorAll('.langsw__b').forEach(function (b) {
    b.addEventListener('click', function () {
      if (window.MEI_setLang) window.MEI_setLang(b.getAttribute('data-lang'));
    });
  });

  burger.addEventListener('click', function () {
    var open = navLinks.classList.toggle('open');
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  navLinks.addEventListener('click', function (e) {
    if (e.target.classList.contains('nav__link')) {
      navLinks.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
    }
  });

  if (isHome) {
    var sectionEls = homeAnchors.map(function (a) { return document.getElementById(a.id); }).filter(Boolean);
    var linkFor = {};
    document.querySelectorAll('.nav__link[data-id]').forEach(function (a) { linkFor[a.getAttribute('data-id')] = a; });
    var hero = document.querySelector('.hero');
    var ticking = false;
    function update() {
      ticking = false;
      var vh = window.innerHeight || document.documentElement.clientHeight;
      /* Flip to the light bar only once the nav has actually cleared the dark
         hero, so the light bar never sits over the hero (and vice versa). */
      var flipAt = hero ? hero.offsetHeight - nav.offsetHeight : vh * 0.7;
      if (window.scrollY > flipAt) nav.classList.add('scrolled');
      else nav.classList.remove('scrolled');
      var active = null, line = vh * 0.4;
      for (var j = 0; j < sectionEls.length; j++) {
        var rect = sectionEls[j].getBoundingClientRect();
        if (rect.top <= line) active = sectionEls[j].id;
      }
      Object.keys(linkFor).forEach(function (id) { linkFor[id].classList.toggle('active', id === active); });
    }
    function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    update();
    var poll = setInterval(update, 250);
    setTimeout(function () { clearInterval(poll); }, 20000);
  }
})();
