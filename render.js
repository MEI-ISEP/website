/* ============================================================
   render.js — MEI · ISEP website
   Builds the data-driven sections from window.MEI (content.js)
   and wires interactivity: specialization tabs, scroll-spy nav,
   reveal-on-scroll, mobile menu.
   ============================================================ */
(function () {
  var M = window.MEI;
  if (!M) { console.error('content.js (window.MEI) not loaded'); return; }
  var U = M.ui;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var el = function (tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  };

  /* ---------- PILLARS ---------- */
  (function () {
    var box = $('#pillars');
    M.pillars.forEach(function (p, i) {
      var c = el('div', 'pillar reveal');
      c.setAttribute('data-d', String((i % 3) + 1));
      c.innerHTML =
        '<div class="pillar__no">' + String(i + 1).padStart(2, '0') + '</div>' +
        '<h3 class="pillar__t">' + p.t + '</h3>' +
        '<p class="pillar__d">' + p.d + '</p>';
      box.appendChild(c);
    });
  })();

  /* ---------- GLANCE ---------- */
  (function () {
    var box = $('#glance');
    M.glance.forEach(function (g) {
      box.appendChild(el('div', 'glance__cell',
        '<div class="glance__k">' + g.k + '</div><div class="glance__v">' + g.v + '</div>'));
    });
  })();

  /* ---------- SPECIALIZATIONS (tabs + panel) ---------- */
  (function () {
    var tabsBox = $('#specTabs');
    var panelBox = $('#specPanel');
    var specs = M.specializations;

    function courseRow(c) {
      return '<div class="course">' +
        '<div class="course__code">' + c.code + '</div>' +
        '<div>' +
          '<div class="course__name">' + c.name + '</div>' +
          (c.desc ? '<div class="course__desc">' + c.desc + '</div>' : '') +
          (c.shared ? '<span class="course__shared">' + U.spec.shared + ' · ' + c.shared + '</span>' : '') +
        '</div>' +
        '<div class="course__ects"><span class="n">' + c.ects + '</span><span class="u">ECTS</span></div>' +
      '</div>';
    }

    function panelHTML(s) {
      return '<div class="spec__panel">' +
        '<div class="spec__panelhead">' +
          '<div class="spec__intro">' +
            '<div class="spec__no">' + s.no + '</div>' +
            '<h3 class="spec__name">' + s.name + '</h3>' +
            '<p class="spec__blurb">' + s.blurb + '</p>' +
            '<div class="spec__meta">' +
              '<div class="spec__metaitem"><div class="n">8+1</div><div class="l">' + U.spec.metaUnits + '</div></div>' +
              '<div class="spec__metaitem"><div class="n">60</div><div class="l">' + U.spec.metaEcts + '</div></div>' +
            '</div>' +
          '</div>' +
          /* Falls back to the hatched placeholder when a spec has no photo yet. */
          '<div class="spec__photo' + (s.photoSrc ? ' has-img' : '') + '" data-label="' + s.photo + '">' +
            (s.photoSrc
              ? '<img src="' + s.photoSrc + '" alt="' + s.photo + '" loading="lazy" decoding="async">'
              : '') +
          '</div>' +
        '</div>' +
        '<div class="spec__courses">' +
          '<div class="spec__semgrid">' +
            '<div><div class="subsem">' + U.spec.sem1 + ' <span class="tag">' + U.spec.tag1 + '</span></div>' + s.y1s1.map(courseRow).join('') + '</div>' +
            '<div><div class="subsem">' + U.spec.sem2 + ' <span class="tag">' + U.spec.tag2 + '</span></div>' + s.y1s2.map(courseRow).join('') + '</div>' +
          '</div>' +
        '</div>' +
        '<div class="spec__y2">' +
          '<div class="spec__lab">' +
            '<div class="blk-label"><span class="dot"></span>' + U.spec.labLabel + '</div>' +
            courseRow(s.lab) +
            '<p class="spec__extra">' + U.spec.labExtra + '</p>' +
          '</div>' +
          '<div class="spec__proj">' +
            '<div class="blk-label"><span class="dot"></span>' + U.spec.projLabel + '</div>' +
            s.projects.map(function (p) {
              return '<div class="proj"><div class="proj__t">' + p.t + '</div><div class="proj__m">' + p.m + '</div></div>';
            }).join('') +
          '</div>' +
        '</div>' +
      '</div>';
    }

    specs.forEach(function (s, i) {
      var t = el('button', 'spec__tab' + (i === 0 ? ' active' : ''));
      t.setAttribute('role', 'tab');
      t.setAttribute('data-i', String(i));
      t.innerHTML = '<span class="no">' + s.no + '</span>' + s.name;
      t.addEventListener('click', function () {
        tabsBox.querySelectorAll('.spec__tab').forEach(function (x) { x.classList.remove('active'); });
        t.classList.add('active');
        panelBox.innerHTML = panelHTML(s);
      });
      tabsBox.appendChild(t);
    });
    panelBox.innerHTML = panelHTML(specs[0]);

    $('#fifthNote').innerHTML = '<b>' + U.spec.fifthLabel + '</b> ' + M.fifth;
  })();

  /* ---------- COMMON COURSES ---------- */
  (function () {
    var box = $('#common');
    M.common.forEach(function (c) {
      box.appendChild(el('div', 'common__row',
        '<div class="common__code">' + c.code + '</div>' +
        '<div><div class="common__name">' + c.name + '</div><div class="common__desc">' + c.desc + '</div></div>' +
        '<div class="common__ects"><span class="n">' + c.ects + '</span><span class="u">ECTS</span></div>'));
    });
  })();

  /* ---------- ADVANTAGES ----------
     M.accreditations is still in the content model for the brochure, but the
     site no longer gives accreditation a section of its own. */
  (function () {
    var adv = $('#adv');
    M.advantages.forEach(function (a) {
      adv.appendChild(el('div', 'adv__card',
        '<div class="adv__t">' + a.title + '</div>' +
        '<div class="adv__d">' + a.desc + '</div>'));
    });
  })();

  /* ---------- CAREERS ---------- */
  (function () {
    var box = $('#chips');
    M.careers.forEach(function (c) {
      box.appendChild(el('span', 'chip', c));
    });
    $('#careersLead').textContent = M.careersLead;
    $('#careersNote').textContent = M.careersNote;
  })();

  /* ---------- PARTNERS ---------- */
  (function () {
    var P = M.partners;
    var wall = $('#partnerWall');
    P.logos.forEach(function (p) {
      wall.appendChild(el('div', 'partner' + (p.accent ? ' accent' : ''),
        '<div class="partner__name">' + p.name + '</div>' +
        '<div class="partner__kind">' + p.kind + '</div>'));
    });

    /* sector breakdown + research groups: rows of label / names */
    function rows(box, list) {
      list.forEach(function (s) {
        box.appendChild(el('div', 'sector',
          '<div class="sector__k">' + s.k + '</div>' +
          '<div class="sector__v">' + s.v + '</div>'));
      });
    }
    $('#partnersLead').textContent = P.lead;
    rows($('#sectors'), P.sectors);
    $('#sectorsNote').textContent = P.sectorsNote;
    $('#researchLead').textContent = P.research.lead;
    rows($('#research'), P.research.rows);

    var r = P.repo;
    $('#repo').innerHTML =
      '<div class="repo__n">' + r.n + '</div>' +
      '<div class="repo__l">' + r.l + '</div>' +
      '<div class="repo__url"><a href="https://recipp.ipp.pt" target="_blank" rel="noopener">' + r.url + '</a></div>';
  })();

  /* Admissions live on candidatura.html (built by candidatura.js); the
     homepage links to it from the hero and the nav CTA. */

  /* ---------- CONTACTS ---------- */
  (function () {
    var c = M.contacts;
    $('#contactGrid').innerHTML =
      '<div>' +
        '<h4>' + U.contactos.dirHeading + '</h4>' +
        c.direction.map(function (p) {
          return '<div class="person">' +
            '<span class="nm">' + p.name + '</span>' +
            (p.role ? '<span class="rl">' + p.role + '</span>' : '') +
            '<a class="em" href="mailto:' + p.email + '">' + p.email + '</a>' +
          '</div>';
        }).join('') +
      '</div>' +
      '<div>' +
        '<h4>' + U.contactos.infoHeading + '</h4>' +
        '<div class="ml">' +
          '<div class="ml__item"><span class="ml__lab">' + U.contactos.labelProgram + '</span><a class="ml__em" href="mailto:' + c.info + '">' + c.info + '</a></div>' +
          '<div class="ml__item"><span class="ml__lab">' + U.contactos.labelAcademic + '</span><a class="ml__em" href="mailto:' + c.academic + '">' + c.academic + '</a></div>' +
        '</div>' +
      '</div>';
  })();
})();
