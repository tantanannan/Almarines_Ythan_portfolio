/* ============================================================
   project.js — fills in a project page from projects.js.
   The page works out which project to show from its folder name:
   projects/camou-poster/index.html  ->  slug "camou-poster"

   Every project uses the same three steps, always in this order:
   01 Original sketch -> 02 Inside my workspace -> 03 Final output
   ============================================================ */
(function () {
  var P = Portfolio, esc = P.esc;
  var placeholders = typeof SHOW_PLACEHOLDERS === 'undefined' ? false : SHOW_PLACEHOLDERS;
  var CHIP = '<span class="zoom-chip mono" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></svg>Enlarge</span>';

  function currentSlug() {
    var forced = document.body.getAttribute('data-project');
    if (forced) return forced;
    var m = decodeURIComponent(location.pathname).match(/\/projects\/([^\/]+)\/(?:index\.html)?$/);
    return m ? m[1] : '';
  }

  var p = P.find(currentSlug());
  var steps = ['sketch', 'workspace', 'final'];

  if (!p) {
    /* The folder name does not match any slug in projects.js */
    document.title = 'Project not found | Almarines_Ythan_portfolio';
    document.getElementById('cs-plate').textContent = 'Not found';
    document.getElementById('cs-title').textContent = 'This project is not in the list';
    document.getElementById('cs-meta').innerHTML = '<div><dt>Check</dt><dd>The folder name must match a slug in js/projects.js</dd></div>';
    steps.forEach(function (id) { document.getElementById(id).hidden = true; });
    document.querySelectorAll('[data-sec]').forEach(function (li) { li.hidden = true; });
    document.getElementById('pn').innerHTML = '<a class="next" href="' + P.root + 'index.html#projects"><span class="mono">Back to all projects <span class="arr" aria-hidden="true">&rarr;</span></span><span class="pn-title">See every project</span></a>';
    return;
  }

  var no = P.plateNo(p);
  var soft = (p.software || []).join(' & ') || 'editing software';
  var ratio = p.ratio || '16 / 9';
  var hasSketch = !!p.images.sketch;
  document.title = p.title + ' | Almarines_Ythan_portfolio';
  var metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc && p.description) metaDesc.setAttribute('content', p.description);

  /* Title, description, three facts, and goal / result only when you wrote them */
  document.getElementById('cs-plate').textContent = 'Plate ' + no;
  document.getElementById('cs-sample').innerHTML = p.sample ? '<span class="tag-ph">Sample</span>' : '';
  document.getElementById('cs-title').textContent = p.title;
  var intro = document.getElementById('cs-intro');
  intro.textContent = p.description || '';
  intro.hidden = !p.description;
  document.getElementById('cs-meta').innerHTML = [['Year', p.year], ['Category', p.category], ['Software', soft]]
    .map(function (r) { return '<div><dt>' + r[0] + '</dt><dd>' + esc(r[1]) + '</dd></div>'; }).join('');
  var notes = [['Design goal', p.goal], ['Final result', p.result]].filter(function (r) { return r[1]; });
  document.getElementById('cs-notes').innerHTML = notes.map(function (r) { return '<div><dt>' + r[0] + '</dt><dd>' + esc(r[1]) + '</dd></div>'; }).join('');
  document.getElementById('cs-notes').hidden = !notes.length;

  /* One image step: a real image (click to enlarge), a labeled placeholder while building, or nothing */
  var zoomers = {};
  function fillStep(id, artId, src, alt, phLabel, cap, startRatio) {
    var sec = document.getElementById(id), art = document.getElementById(artId);
    sec.hidden = !src && !placeholders;
    if (sec.hidden) return;
    P.setRatio(art, startRatio);
    var html = function () { return P.media(src, alt, phLabel); };
    art.innerHTML = html() + (src ? CHIP : '');
    art.classList.toggle('is-ph', !src);
    if (src) {
      art.setAttribute('aria-label', 'Enlarge: ' + cap);
      zoomers[artId] = { html: html, cap: cap };
      P.autoRatio(art.querySelector('img'), [art]);
    } else {
      art.removeAttribute('aria-label');
      art.disabled = true;
    }
  }
  var tag = p.sample ? 'Sample · ' : '';
  fillStep('sketch', 'sk-art', p.images.sketch, p.title + ', original sketch', 'Original sketch not added yet', 'Original sketch — ' + p.title, ratio);
  var wsCap = 'Digital workspace — ' + soft;
  document.getElementById('ws-cap').textContent = wsCap;
  fillStep('workspace', 'ws-art', p.images.workspace, 'Screenshot of ' + soft + ' while working on ' + p.title, 'Workspace screenshot not added yet', wsCap, '16 / 9');
  fillStep('final', 'fi-art', p.images.final, p.title + ', final artwork', tag + 'Final artwork not added yet', 'Final output — ' + p.title, ratio);

  /* Final output can also be compared with the sketch: slider or side by side */
  var finalSec = document.getElementById('final');
  var cmp = document.getElementById('compare');
  var views = document.getElementById('fi-views');
  var note = document.getElementById('fi-note');
  var canCompare = hasSketch && !!p.images.final;
  views.hidden = !canCompare;
  if (canCompare) {
    P.setRatio(cmp, ratio);
    var pair = P.comparePair(p);
    cmp.querySelectorAll('[data-slot]').forEach(function (slot) {
      var before = slot.getAttribute('data-slot') === 'before';
      slot.innerHTML = P.media(before ? pair.sketch : pair.final, p.title + (before ? ', original sketch' : ', final artwork'), before ? 'Sketch' : 'Final');
    });
    P.autoRatio(cmp.querySelector('[data-slot="after"] img'), [cmp]);
    var compare = Site.compare(cmp);
    var aligned = pair.aligned;
    views.querySelector('[data-view="slider"]').disabled = !aligned;
    note.hidden = aligned;
    note.textContent = aligned ? '' : 'The sketch and the final are framed differently, so they can be compared side by side.';
    views.addEventListener('click', function (e) {
      var b = e.target.closest('.vt-btn');
      if (!b || b.disabled) return;
      finalSec.setAttribute('data-mode', b.getAttribute('data-view'));
    });
    compare.setView('final');
  }

  /* Number the steps that are shown (01, 02, 03) and hide menu links to missing ones */
  var n = 0;
  steps.forEach(function (id) {
    var sec = document.getElementById(id);
    var num = sec.hidden ? '' : (++n < 10 ? '0' : '') + n;
    sec.querySelector('.step-no').textContent = num;
    document.querySelectorAll('[data-sec="' + id + '"]').forEach(function (li) {
      li.hidden = sec.hidden;
      var s = li.querySelector('sup, .num');
      if (s) s.textContent = num;
    });
  });

  /* Click to enlarge */
  var zoomDlg = document.getElementById('zoom'), zoomFrom = null;
  function openZoom(btn) {
    var z = zoomers[btn.id];
    if (!z) return;
    var m = document.getElementById('zoom-media');
    var img = btn.querySelector('img');
    P.setRatio(m, img && img.naturalWidth ? img.naturalWidth + ' / ' + img.naturalHeight : (btn.style.getPropertyValue('--ratio') || '16 / 9'));
    m.innerHTML = z.html();
    document.getElementById('zoom-cap').textContent = z.cap;
    zoomFrom = btn;
    if (zoomDlg.showModal) zoomDlg.showModal(); else zoomDlg.setAttribute('open', '');
    document.getElementById('zoom-close').focus();
  }
  ['sk-art', 'ws-art', 'fi-art'].forEach(function (id) {
    document.getElementById(id).addEventListener('click', function () { openZoom(this); });
  });
  function closeZoom() { if (zoomDlg.close) zoomDlg.close(); else zoomDlg.removeAttribute('open'); }
  document.getElementById('zoom-close').addEventListener('click', closeZoom);
  zoomDlg.addEventListener('click', function (e) { if (e.target === zoomDlg) closeZoom(); });
  zoomDlg.addEventListener('close', function () { if (zoomFrom) zoomFrom.focus(); });

  /* Previous / next project, wrapping around the list */
  var idx = PROJECTS.indexOf(p);
  var prev = PROJECTS[(idx - 1 + PROJECTS.length) % PROJECTS.length];
  var next = PROJECTS[(idx + 1) % PROJECTS.length];
  function pnLink(q, cls, label) {
    return '<a class="' + cls + '" href="' + esc(P.pageUrl(q)) + '">' +
      '<span class="mono">' + (cls === 'prev' ? '<span class="arr" aria-hidden="true">&larr;</span> ' : '') + label + ' &middot; Plate ' + P.plateNo(q) + (cls === 'next' ? ' <span class="arr" aria-hidden="true">&rarr;</span>' : '') + '</span>' +
      '<span class="pn-title">' + esc(q.title) + '</span></a>';
  }
  document.getElementById('pn').innerHTML = PROJECTS.length > 1 ? pnLink(prev, 'prev', 'Previous project') + pnLink(next, 'next', 'Next project') : '';

  /* Each stage arrives in order: its rule draws across, the number and title rise, then the image */
  Site.reveal('.step-head, .mat > .art, .pn-sec .wrap', true);
  Site.navSpy();
})();
