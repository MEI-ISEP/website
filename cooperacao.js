/* ============================================================
   cooperacao.js — MEI · ISEP website
   Renders the partnerships page from M.cooperation: the five kinds
   of partnership, how a dissertation proposal moves through the
   platform, what makes a good one, and the practical framework
   (supervision, protocol, confidentiality, calendar).
   ============================================================ */
(function () {
  var M = window.MEI;
  if (!M) { console.error('content.js not loaded'); return; }
  var $ = function (s) { return document.querySelector(s); };
  var c = M.cooperation;
  var U = M.ui.coop;

  $('#coopIntro').textContent = c.intro;
  $('#coopFormsLead').textContent = c.formsLead;
  $('#coopProposalLead').textContent = c.proposalLead;
  $('#coopProcessLead').textContent = c.processLead;
  $('#coopGoodLead').textContent = c.goodLead;
  $('#coopContactLead').textContent = c.contactLead;

  /* The five kinds of partnership. */
  $('#coopForms').innerHTML = c.forms.map(function (f) {
    return '<div class="coop-card">' +
      '<div class="pillar__no">' + f.n + '</div>' +
      '<div class="pillar__t">' + f.t + '</div>' +
      '<div class="pillar__d">' + f.d + '</div>' +
    '</div>';
  }).join('');
  $('#coopFormsNote').innerHTML = c.formsNote;

  /* Proposal → assignment → formalisation. */
  $('#coopSteps').innerHTML = c.proposalSteps.map(function (s) {
    return '<div class="step-row">' +
      '<div class="step-row__no">' + s.n + '</div>' +
      '<div><div class="step-row__t">' + s.t + '</div><div class="step-row__d">' + s.d + '</div></div>' +
    '</div>';
  }).join('');
  $('#coopProposalNote').innerHTML = '<b>' + U.proposalNoteLabel + '</b> ' + c.proposalNote;

  /* Good-proposal checklist next to the indicative theme list. */
  $('#coopGood').innerHTML =
    '<div class="adm-card">' +
      '<h4>' + U.goodCardTitle + '</h4>' +
      '<ul>' + c.goodProposal.map(function (r, i) {
        return '<li><span class="b">' + String.fromCharCode(97 + i) + ')</span><span>' + r + '</span></li>';
      }).join('') + '</ul>' +
    '</div>' +
    '<div class="adm-card">' +
      '<h4>' + U.themesCardTitle + '</h4>' +
      '<ul>' + c.themes.map(function (t) {
        return '<li><span class="b">·</span><span>' + t + '</span></li>';
      }).join('') + '</ul>' +
      '<p style="margin:16px 0 0;">' + U.themesNote + '</p>' +
    '</div>';

  /* Practical matters, as the same label/value rows used for sectors. */
  $('#coopPractical').innerHTML = c.practical.map(function (r) {
    return '<div class="sector"><div class="sector__k">' + r.k + '</div><div class="sector__v">' + r.v + '</div></div>';
  }).join('');

  $('#coopActions').innerHTML =
    '<a class="btn btn--primary" href="https://projetos.dei.isep.ipp.pt/home" target="_blank" rel="noopener"><span>' + U.closingCta + '</span> <span class="arr">→</span></a>' +
    '<a class="btn btn--ghost-light" href="mailto:mei@isep.ipp.pt">mei@isep.ipp.pt</a>';

  if (window.__meiCollectReveals) setTimeout(window.__meiCollectReveals, 60);
})();
