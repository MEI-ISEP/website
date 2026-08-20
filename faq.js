(function () {
  var M = window.MEI;
  if (!M) { console.error('content.js not loaded'); return; }
  var $ = function (s) { return document.querySelector(s); };
  var groups = M.faqGroups;
  var U = M.ui;

  var tabsBox = $('#faqTabs');
  var listBox = $('#faqList');

  var noteBox = $('#faqNote');
  var current = -1;

  /* Each question carries a stable slug id (shared by both language
     bundles), so faq.html#<id> links straight to it. */
  function locate(id) {
    for (var g = 0; g < groups.length; g++) {
      for (var i = 0; i < groups[g].items.length; i++) {
        if (groups[g].items[i].id === id) return g;
      }
    }
    return -1;
  }

  function openItem(id, scroll) {
    var wrap = document.getElementById(id);
    if (!wrap) return;
    if (!wrap.classList.contains('open')) wrap.querySelector('.faq-q').click();
    if (scroll) {
      /* Let the panel finish expanding before measuring where to land. */
      setTimeout(function () { wrap.scrollIntoView({ block: 'center', behavior: 'smooth' }); }, 80);
    }
  }

  function renderGroup(i) {
    current = i;
    tabsBox.querySelectorAll('.spec__tab').forEach(function (x, n) {
      x.classList.toggle('active', n === i);
    });

    /* Optional per-group preamble (e.g. the shared 120 ECTS structure). */
    var note = groups[i].note;
    noteBox.innerHTML = note || '';
    noteBox.style.display = note ? '' : 'none';

    listBox.innerHTML = '';
    groups[i].items.forEach(function (item) {
      var wrap = document.createElement('div');
      wrap.className = 'faq-item';
      if (item.id) wrap.id = item.id;
      wrap.innerHTML =
        '<button class="faq-q" aria-expanded="false"><span>' + item.q + '</span>' +
          '<span class="faq-q__tools">' +
            (item.id ? '<a class="faq-link" href="#' + item.id + '" title="' + U.faq.copyLink +
                       '" aria-label="' + U.faq.copyLink + '">#</a>' : '') +
            '<span class="plus">+</span>' +
          '</span>' +
        '</button>' +
        '<div class="faq-a"><div class="faq-a__inner">' + item.a + '</div></div>';
      var btn = wrap.querySelector('.faq-q');
      var panel = wrap.querySelector('.faq-a');
      btn.addEventListener('click', function () {
        var open = wrap.classList.toggle('open');
        btn.setAttribute('aria-expanded', open ? 'true' : 'false');
        panel.style.maxHeight = open ? panel.scrollHeight + 'px' : '';
      });
      var link = wrap.querySelector('.faq-link');
      if (link) {
        link.addEventListener('click', function (e) {
          /* Don't let the click fall through to the accordion toggle. */
          e.stopPropagation();
          var url = location.origin + location.pathname + '#' + item.id;
          if (navigator.clipboard) {
            navigator.clipboard.writeText(url).then(function () {
              link.classList.add('copied');
              setTimeout(function () { link.classList.remove('copied'); }, 1400);
            }, function () { /* clipboard blocked; the href still sets the hash */ });
          }
        });
      }
      listBox.appendChild(wrap);
    });
    if (window.__meiCollectReveals) setTimeout(window.__meiCollectReveals, 60);
  }

  groups.forEach(function (g, i) {
    var t = document.createElement('button');
    t.className = 'spec__tab' + (i === 0 ? ' active' : '');
    t.setAttribute('role', 'tab');
    t.textContent = g.title;
    t.addEventListener('click', function () { renderGroup(i); });
    tabsBox.appendChild(t);
  });

  /* A hash may point at a question in any tab, so pick the tab first. */
  function fromHash(scroll) {
    var id = (location.hash || '').replace(/^#/, '');
    if (!id) return false;
    var g = locate(id);
    if (g < 0) return false;
    if (g !== current) renderGroup(g);
    openItem(id, scroll);
    return true;
  }

  if (!fromHash(true)) renderGroup(0);
  window.addEventListener('hashchange', function () { fromHash(true); });

  var tbl = $('#faqContactsTable');
  tbl.innerHTML = '<thead><tr><th>' + U.faq.thAssunto + '</th><th>' + U.faq.thContacto + '</th></tr></thead><tbody>' +
    M.faqContacts.map(function (c) {
      return '<tr><th>' + c.topic + '</th><td class="hl"><a href="mailto:' + c.email + '">' + c.email + '</a></td></tr>';
    }).join('') + '</tbody>';

  $('#faqLinksTable').innerHTML =
    '<thead><tr><th>' + U.faq.thRecurso + '</th><th>' + U.faq.thLigacao + '</th></tr></thead><tbody>' +
    M.faqLinks.map(function (l) {
      return '<tr><th>' + l.topic + '</th><td class="hl"><a href="' + l.href + '" target="_blank" rel="noopener">' + l.label + '</a></td></tr>';
    }).join('') + '</tbody>';

  $('#refsList').innerHTML = M.faqSources.map(function (s) { return '<li>' + s + '</li>'; }).join('');

  if (window.__meiCollectReveals) setTimeout(window.__meiCollectReveals, 60);
})();
