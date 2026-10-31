/* ============================================================
   home.js — homepage only: project gallery with search and
   filters, featured before & after, contact form.
   Project information comes from projects.js.
   (The hero animation is pure CSS: see MOTION in style.css.)
   ============================================================ */
(function () {
  var P = Portfolio, esc = P.esc;

  /* ===== PROJECT GALLERY ===== */
  var els = {
    q: document.getElementById('q'), cat: document.getElementById('f-cat'), reset: document.getElementById('f-reset'),
    form: document.getElementById('filters'), count: document.getElementById('f-count'),
    list: document.getElementById('plates'), empty: document.getElementById('empty'), emptyText: document.getElementById('empty-text')
  };
  var hasSamples = PROJECTS.some(function (p) { return p.sample; });
  document.getElementById('sample-note').hidden = !hasSamples;

  function hl(text, q) {
    text = String(text);
    var safe = esc(text);
    if (!q) return safe;
    var i = text.toLowerCase().indexOf(q);
    if (i < 0) return safe;
    return esc(text.slice(0, i)) + '<mark>' + esc(text.slice(i, i + q.length)) + '</mark>' + esc(text.slice(i + q.length));
  }
  function uniq(fn) {
    var seen = {}, out = [];
    PROJECTS.forEach(function (p) { [].concat(fn(p)).forEach(function (v) { if (v && !seen[v]) { seen[v] = 1; out.push(String(v)); } }); });
    return out;
  }
  function fill(sel, values) { values.forEach(function (v) { var o = document.createElement('option'); o.value = v; o.textContent = v; sel.appendChild(o); }); }
  fill(els.cat, uniq(function (p) { return p.category; })); // only terms the projects use, in course order (Prelim, Midterm, Finals)

  function matches(p, f) {
    if (f.cat && p.category !== f.cat) return false;
    if (f.q) { // search still looks at software and year, so "Photoshop" or "2025" find projects
      var hay = [p.title, p.category, P.typeOf(p), p.year, p.description].concat(p.software || []).join(' ').toLowerCase();
      if (hay.indexOf(f.q) < 0) return false;
    }
    return true;
  }
  function plateHTML(p, q, n) {
    var url = esc(P.pageUrl(p));
    var tag = p.sample ? 'Sample · ' : '';
    var hasSketch = !!p.images.sketch;
    return '<li class="plate" style="--n: ' + n + '"><article aria-labelledby="pt-' + esc(p.slug) + '">' +
      '<div class="plate-media">' +
        '<div class="pm-layer pm-final">' + P.media(p.images.final, p.title + ', final artwork', tag + 'Final artwork', true) + '</div>' +
        (hasSketch ? '<div class="pm-layer pm-sketch">' + P.media(p.images.sketch, p.title + ', original sketch', tag + 'Original sketch', true) + '</div>' +
          '<span class="pm-label mono" aria-hidden="true"><span class="pm-l-final">Final</span><span class="pm-l-sketch">Sketch</span></span>' : '') +
        '<a href="' + url + '" tabindex="-1" aria-hidden="true"></a>' +
      '</div>' +
      '<div class="plate-cap">' +
        '<p class="plate-no mono"><span>Plate ' + P.plateNo(p) + '</span>' + (p.sample ? '<span class="tag-ph">Sample</span>' : '') +
          '<span class="plate-meta">' + hl(p.category, q) + (P.typeOf(p) !== p.category ? ' &middot; ' + hl(P.typeOf(p), q) : '') + ' &middot; ' + hl(p.year, q) + '</span></p>' +
        '<h3 class="plate-title" id="pt-' + esc(p.slug) + '"><a href="' + url + '">' + hl(p.title, q) + '</a></h3>' +
        (p.description ? '<p class="plate-desc">' + esc(p.description) + '</p>' : '') +
        '<div class="plate-foot">' +
          '<dl class="plate-soft"><dt>Software</dt><dd>' + (p.software || []).map(function (t) { return hl(t, q); }).join(', ') + '</dd></dl>' +
          '<a class="plate-btn" href="' + url + '" aria-label="View project: ' + esc(p.title) + '">View project <span class="arr" aria-hidden="true">&rarr;</span></a>' +
        '</div>' +
      '</div>' +
    '</article></li>';
  }
  var rendered = false;
  function render() {
    var f = { q: els.q.value.trim().toLowerCase(), cat: els.cat.value };
    els.cat.classList.toggle('on', !!f.cat);
    els.reset.hidden = !f.q && !f.cat; // "Clear" only appears when there is something to clear
    var hits = PROJECTS.filter(function (p) { return matches(p, f); });
    els.list.innerHTML = hits.map(function (p, i) { return plateHTML(p, f.q, i); }).join('');
    /* After the first render, new results fade in and the count ticks, so each change is felt */
    els.list.classList.toggle('refresh', rendered);
    if (rendered) { els.count.classList.remove('tick'); void els.count.offsetWidth; els.count.classList.add('tick'); }
    rendered = true;
    var label = hasSamples ? 'sample projects' : 'projects';
    els.count.innerHTML = hits.length === PROJECTS.length
      ? 'All ' + PROJECTS.length + ' <em>' + label + '</em>'
      : 'Showing ' + hits.length + ' of ' + PROJECTS.length + ' <em>' + label + '</em>';
    els.empty.hidden = hits.length > 0;
    if (!hits.length) {
      var parts = [];
      if (f.q) parts.push('“' + els.q.value.trim() + '”');
      if (f.cat) parts.push(f.cat);
      els.emptyText.textContent = 'No projects match ' + parts.join(' in ') + '. Try a shorter word or another category, or show all projects.';
    }
  }
  els.form.addEventListener('input', render);
  els.form.addEventListener('change', render);
  els.form.addEventListener('submit', function (e) { e.preventDefault(); });
  els.form.addEventListener('reset', function () { setTimeout(function () { render(); els.q.focus(); }, 0); });
  document.getElementById('empty-reset').addEventListener('click', function () { els.form.reset(); });
  render();

  /* ===== FEATURED before & after (set in projects.js) ===== */
  var fp = P.find(FEATURED.slug);
  var featured = document.getElementById('featured');
  if (!fp || !fp.images.sketch) {
    featured.hidden = true; // nothing to compare without a sketch
  } else {
    var cmp = document.getElementById('compare');
    P.setRatio(cmp, fp.ratio || '16 / 9');
    document.getElementById('feat-title').textContent = FEATURED.title || fp.title;
    document.getElementById('feat-desc').textContent = FEATURED.text || '';
    document.getElementById('feat-desc').hidden = !FEATURED.text;
    document.getElementById('feat-plate').innerHTML = (fp.sample ? '<span class="tag-ph">Sample</span> ' : '') + 'Plate ' + P.plateNo(fp) + ' &middot; ' + esc(fp.title);
    document.getElementById('feat-open').href = P.pageUrl(fp);
    var pair = P.comparePair(fp);
    cmp.querySelectorAll('[data-slot]').forEach(function (slot) {
      var before = slot.getAttribute('data-slot') === 'before';
      slot.innerHTML = P.media(before ? pair.sketch : pair.final, fp.title + (before ? ', original sketch' : ', final artwork'), before ? 'Sketch' : 'Final');
    });
    P.autoRatio(cmp.querySelector('[data-slot="after"] img'), [cmp]);
    var view = Site.compare(cmp);
    if (!pair.aligned) {
      featured.querySelector('.vt-btn[data-view="slider"]').disabled = true;
      view.setView('split');
    } else {
      rearmSweep = introSweep(cmp);
    }
  }

  /* When the slider scrolls into view, its handle glides from mostly-sketch back to the middle,
     showing that it can be moved. One CSS transition; any touch or key stops it.
     Returns a function that sets it up again (used by Home). */
  var rearmSweep; // set above when the featured slider is in use
  function introSweep(cmp) {
    var stage = cmp.querySelector('.cmp-stage'), range = cmp.querySelector('.cmp-range');
    if (Site.lite || !('IntersectionObserver' in window) || !(window.CSS && CSS.registerProperty)) return function () {};
    var io = null;
    function set(v) { range.value = v; range.dispatchEvent(new Event('input')); }
    function stop() { cmp.classList.remove('cmp-intro'); }
    function arm() {
      if (io) io.disconnect();
      if (stage.getBoundingClientRect().top < window.innerHeight) return; // already on screen: leave it be
      stop();
      set(82);
      io = new IntersectionObserver(function (en) {
        if (!en[0].isIntersecting) return;
        io.disconnect();
        cmp.classList.add('cmp-intro');
        requestAnimationFrame(function () { set(50); });
      }, { threshold: .5 });
      io.observe(stage);
    }
    cmp.addEventListener('transitionend', function (e) { if (e.propertyName === '--pos') stop(); });
    range.addEventListener('pointerdown', stop);
    range.addEventListener('keydown', function () { if (io) io.disconnect(); stop(); });
    arm();
    return arm;
  }

  /* ===== CONTACT FORM =====
     Sends to Formspree (formspree.io), which emails each message to you. The form address is public
     by design: it is not a password or key. Formspree sets Reply-To from the "email" field, so you can
     answer from Gmail directly. "_gotcha" is the hidden spam trap, also checked by Formspree. */
  var FORMSPREE_ENDPOINT = 'https://formspree.io/f/xgaananp';
  var CONTACT_EMAIL = 'almarinesythan2@gmail.com'; // offered when sending fails

  var form = document.getElementById('contact-form');
  var status = document.getElementById('form-status');
  var sendBtn = form.querySelector('button[type="submit"]');
  var sendLabel = sendBtn.innerHTML;
  var sending = false;
  var rules = {
    'f-name': function (v) { return v ? '' : 'Enter your name.'; },
    'f-email': function (v) {
      if (!v) return 'Enter your email address.';
      return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) ? '' : 'Enter an email address like name@example.com.';
    },
    'f-subject': function (v) { return v ? '' : 'Add a subject so I know what it is about.'; },
    'f-message': function (v) {
      if (!v) return 'Write a message.';
      return v.length < 10 ? 'Your message needs at least 10 characters (' + v.length + ' so far).' : '';
    }
  };
  function check(id) {
    var el = document.getElementById(id);
    var msg = rules[id](el.value.trim());
    var err = document.getElementById(id + '-err');
    err.textContent = msg;
    err.hidden = !msg;
    if (msg) el.setAttribute('aria-invalid', 'true'); else el.removeAttribute('aria-invalid');
    return !msg;
  }
  Object.keys(rules).forEach(function (id) {
    var el = document.getElementById(id);
    el.addEventListener('blur', function () { if (el.value.trim() || el.hasAttribute('aria-invalid')) check(id); });
    el.addEventListener('input', function () { if (el.hasAttribute('aria-invalid')) check(id); });
  });
  function say(kind, text) { status.className = 'form-status' + (kind ? ' ' + kind : ''); status.textContent = text; }
  /* While sending, the button stays focusable (aria-disabled, not disabled) so keyboard focus is not lost */
  function setSending(on) {
    sending = on;
    form.setAttribute('aria-busy', String(on));
    sendBtn.classList.toggle('is-sending', on);
    if (on) { sendBtn.setAttribute('aria-disabled', 'true'); sendBtn.textContent = 'Sending…'; }
    else { sendBtn.removeAttribute('aria-disabled'); sendBtn.innerHTML = sendLabel; }
  }
  /* Formspree answers with JSON: { ok: true } on success, or { errors: [{ message }] } */
  function failText(data) {
    var why = data && data.errors && data.errors.length
      ? data.errors.map(function (er) { return er.message; }).join(' ')
      : (data && data.error) || '';
    return 'Your message was not sent' + (why ? ': ' + why.replace(/\.?$/, '.') : '.') +
      ' Your text is still here, so you can try again, or email me at ' + CONTACT_EMAIL + '.';
  }
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (sending) return; // a second click or Enter while the first send is still going
    if (document.getElementById('f-website').value) return; // hidden field filled in: probably a bot
    var firstBad = null;
    Object.keys(rules).forEach(function (id) { if (!check(id) && !firstBad) firstBad = id; });
    if (firstBad) { say('bad', 'Please fix the highlighted fields.'); document.getElementById(firstBad).focus(); return; }

    var data = new FormData(form); // name, email, subject, message, _gotcha
    data.append('_subject', 'Portfolio message: ' + document.getElementById('f-subject').value.trim());
    var ctrl = window.AbortController ? new AbortController() : null;
    var timer = ctrl && setTimeout(function () { ctrl.abort(); }, 20000);
    setSending(true);
    say('', 'Sending your message…');
    fetch(FORMSPREE_ENDPOINT, { method: 'POST', body: data, headers: { Accept: 'application/json' }, signal: ctrl ? ctrl.signal : undefined })
      .then(function (res) {
        return res.json().catch(function () { return null; }).then(function (json) {
          if (!res.ok || !json || json.ok === false) throw { data: json };
          form.reset(); // only after Formspree confirms
          Object.keys(rules).forEach(function (id) { document.getElementById(id).removeAttribute('aria-invalid'); });
          say('ok', 'Message sent successfully!');
        });
      })
      .catch(function (err) {
        if (err && err.data !== undefined) say('bad', failText(err.data));
        else if (err && err.name === 'AbortError') say('bad', 'Sending took too long, so it was stopped. Your text is still here; please try again, or email me at ' + CONTACT_EMAIL + '.');
        else say('bad', 'Could not reach the mail service. Check your internet connection and try again. Your text is still here, or email me at ' + CONTACT_EMAIL + '.');
      })
      .then(function () { if (timer) clearTimeout(timer); setSending(false); });
  });

  /* ===== INTRO COVER leaving the screen =====
     Normally pure CSS (scroll-driven animations, see style.css). Browsers without them get the same
     effect from one number: how far the cover has scrolled away (0 to 1), written into --p once per
     frame, and only while the cover is on screen. */
  (function introScroll() {
    var intro = document.getElementById('home');
    if (!intro || Site.lite || !document.documentElement.classList.contains('motion')) return;
    if (window.CSS && CSS.supports && CSS.supports('animation-timeline: view()')) return;
    intro.classList.add('intro-js');
    var queued = false, onScreen = true;
    function update() {
      queued = false;
      var p = Math.min(1, Math.max(0, window.scrollY / intro.offsetHeight));
      intro.style.setProperty('--p', p.toFixed(4));
    }
    window.addEventListener('scroll', function () {
      if (onScreen && !queued) { queued = true; requestAnimationFrame(update); }
    }, { passive: true });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (en) { onScreen = en[0].isIntersecting; update(); }).observe(intro);
    }
    update();
  })();

  Site.reveal('.section, .reveal, [data-stagger]', false);
  Site.navSpy();

  /* ===== HOME: back to the cover, and play it all again =====
     Every link to #home (nav Home, the logos, the menu, "Back to top") scrolls up to the cover.
     Once there, the opening sequence restarts, and everything below is set to arrive again as
     you scroll down: section reveals, line drawings and the before & after glide. */
  var intro = document.getElementById('home');
  function replayIntro() {
    if (!intro.getAnimations) return;
    intro.getAnimations({ subtree: true }).forEach(function (a) {
      if (a.timeline !== document.timeline) return; // leave the scroll-linked exit alone
      a.currentTime = 0;
      a.play();
    });
  }
  function whenAtTop(fn) {
    var start = performance.now();
    (function check() {
      if (window.scrollY < 2 || performance.now() - start > 2000) fn();
      else requestAnimationFrame(check);
    })();
  }
  /* ===== PROOF viewer: "View proof" links in Experience open their image in a dialog ===== */
  var proofDlg = document.getElementById('proof'), proofFrom = null;
  if (proofDlg && proofDlg.showModal) {
    document.addEventListener('click', function (e) {
      var link = e.target.closest('[data-proof]');
      if (!link || e.ctrlKey || e.metaKey || e.shiftKey || e.button) return; // new tab / window still work
      e.preventDefault();
      var img = document.getElementById('proof-img');
      img.src = link.getAttribute('href');
      img.alt = 'Proof: ' + link.getAttribute('data-proof');
      document.getElementById('proof-cap').textContent = link.getAttribute('data-proof');
      proofFrom = link;
      proofDlg.showModal();
      document.getElementById('proof-close').focus();
    });
    document.getElementById('proof-close').addEventListener('click', function () { proofDlg.close(); });
    proofDlg.addEventListener('click', function (e) { if (e.target === proofDlg) proofDlg.close(); });
    proofDlg.addEventListener('close', function () { if (proofFrom) proofFrom.focus(); });
  }

  document.querySelectorAll('a[href="#home"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      e.preventDefault();
      if (location.hash !== '#home') history.pushState(null, '', '#home');
      window.scrollTo({ top: 0, behavior: Site.reduce ? 'auto' : 'smooth' });
      if (Site.reduce) return;
      whenAtTop(function () {
        replayIntro();
        if (Site.rearm) Site.rearm();
        if (rearmSweep) rearmSweep();
      });
    });
  });
})();
