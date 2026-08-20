(function () {
  var M = window.MEI;
  if (!M) { console.error('content.js not loaded'); return; }
  var $ = function (s) { return document.querySelector(s); };
  var el = function (tag, cls, html) { var n = document.createElement(tag); if (cls) n.className = cls; if (html != null) n.innerHTML = html; return n; };
  var a = M.admissions;
  var U = M.ui;

  $('#admIntro').textContent = a.intro;

  var stepsBox = $('#stepsList');
  a.steps.forEach(function (s) {
    /* Cautions sit with the step they belong to, rather than trailing
       the whole list. */
    var notes = {
      '01': ['<b>' + U.cand.docsLabel + '</b> ' + a.docsNote,
             '<b>' + U.cand.foreignLabel + '</b> ' + a.foreignNote,
             a.isepNote],
      '04': ['<b>' + U.cand.resultsLabel + '</b> ' + a.resultsNote]
    };
    var note = (notes[s.n] || []).map(function (html) {
      return '<div class="callout">' + html + '</div>';
    }).join('');
    stepsBox.appendChild(el('div', 'step-row',
      '<div class="step-row__no">' + s.n + '</div>' +
      '<div><div class="step-row__t">' + s.t + '</div><div class="step-row__d">' + s.d + '</div>' + note + '</div>'));
  });

  var list = $('#branchList');
  a.branches.forEach(function (b, i) {
    var row = el('div', 'branch' + (i === 4 ? ' dim' : ''));
    row.innerHTML = '<span class="branch__no">' + String(i + 1).padStart(2, '0') + '</span>' + b;
    list.appendChild(row);
  });
  $('#applyNote').innerHTML = '<b>' + U.cand.noteLabel + '</b> ' + a.applyNote;

  $('#admTwo').innerHTML =
    '<div class="adm-card">' +
      '<h4>' + a.individual.title + '</h4>' +
      '<p>' + a.individual.desc + '</p>' +
      '<ul>' + a.individual.reqs.map(function (r, i) {
        return '<li><span class="b">' + String.fromCharCode(97 + i) + ')</span><span>' + r + '</span></li>';
      }).join('') + '</ul>' +
    '</div>' +
    '<div class="adm-card">' +
      '<h4>' + U.cand.editalTitle + '</h4>' +
      '<p>' + a.edital + '</p>' +
      '<p style="color:var(--ink-900);font-weight:600;">' + U.cand.editalNote + '</p>' +
    '</div>';

  $('#feesNote').innerHTML = '<b>' + a.feesTitle + '.</b> ' + a.fees;

  if (window.__meiCollectReveals) setTimeout(window.__meiCollectReveals, 60);
})();
