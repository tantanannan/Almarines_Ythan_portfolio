/* ============================================================
   site.js — shared by every page: theme switch, mobile menu,
   gentle reveal on scroll, and the "you are here" nav highlight.
   ============================================================ */
(function () {
  var root = document.documentElement;
  root.classList.add('js');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  /* Lite: reduced motion, Data Saver, or a device reporting 2 GB of memory or less.
     Scroll reveals and the theme cross-fade are skipped; everything still works. */
  var conn = navigator.connection;
  var lite = reduce || !!(conn && conn.saveData) || (navigator.deviceMemory > 0 && navigator.deviceMemory <= 2);
  if (lite) root.classList.add('lite');
  var darkQuery = window.matchMedia('(prefers-color-scheme: dark)');

  /* Theme: an explicit choice is saved; otherwise follow the device */
  var themeBtn = document.getElementById('theme-toggle');
  function store(key, val) { try { localStorage.setItem(key, val); } catch (e) {} }
  function load(key) { try { return localStorage.getItem(key); } catch (e) { return null; } }
  function isDark() { var t = root.getAttribute('data-theme'); return t ? t === 'dark' : darkQuery.matches; }
  function syncTheme() {
    var dark = isDark();
    root.classList.toggle('is-dark', dark);
    themeBtn.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
  }
  var saved = load('sts-theme');
  if (saved === 'dark' || saved === 'light') root.setAttribute('data-theme', saved);
  syncTheme();
  themeBtn.addEventListener('click', function () {
    var next = isDark() ? 'light' : 'dark';
    function apply() {
      root.setAttribute('data-theme', next);
      store('sts-theme', next);
      syncTheme();
    }
    /* Cross-fade the whole page in one composited step where supported; otherwise switch at once */
    if (document.startViewTransition && !lite) document.startViewTransition(apply); else apply();
  });
  darkQuery.addEventListener('change', syncTheme);

  /* Links to #main (the intro's scroll cue, the skip link, "Back to top" on project pages).
     Handled here because a second click on a link to the address already showing could fail to
     scroll. Focus moves to the content as a skip link should, and history gets the usual entry. */
  var mainEl = document.getElementById('main');
  if (mainEl) {
    document.querySelectorAll('a[href="#main"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        e.preventDefault();
        mainEl.setAttribute('tabindex', '-1');
        mainEl.focus({ preventScroll: true });
        mainEl.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
        if (location.hash !== '#main') history.pushState(null, '', '#main');
      });
    });
  }

  /* Mobile menu: fades in, then its links rise in order (see .menu in style.css) */
  var menu = document.getElementById('menu');
  var openBtn = document.getElementById('menu-open');
  var closeBtn = document.getElementById('menu-close');
  var closeTimer = null;
  menu.querySelectorAll('li').forEach(function (li, i) { li.style.setProperty('--i', i); });
  function isOpen() { return menu.classList.contains('is-open'); }
  function openMenu() {
    clearTimeout(closeTimer);
    menu.hidden = false;
    void menu.offsetWidth; // start the fade from the hidden state
    menu.classList.add('is-open');
    document.body.classList.add('menu-open');
    openBtn.setAttribute('aria-expanded', 'true');
    closeBtn.focus();
  }
  function closeMenu(returnFocus) {
    menu.classList.remove('is-open');
    document.body.classList.remove('menu-open');
    openBtn.setAttribute('aria-expanded', 'false');
    if (returnFocus) openBtn.focus();
    clearTimeout(closeTimer);
    closeTimer = setTimeout(function () { if (!isOpen()) menu.hidden = true; }, reduce ? 0 : 200);
  }
  openBtn.addEventListener('click', openMenu);
  closeBtn.addEventListener('click', function () { closeMenu(true); });
  menu.addEventListener('click', function (e) { if (e.target.closest('a')) closeMenu(false); });
  document.addEventListener('keydown', function (e) {
    if (!isOpen()) return;
    if (e.key === 'Escape') { closeMenu(true); return; }
    if (e.key === 'Tab') {
      var items = menu.querySelectorAll('button, li:not([hidden]) a, .menu-top a');
      var first = items[0], last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
  window.addEventListener('resize', function () { if (isOpen() && window.innerWidth >= 1100) closeMenu(false); });

  /* Analytics: GoatCounter's free hosted service (no cookies, no personal data).
     count.js reports each page load once; GoatCounter records it as a view unless the same visitor
     opened that page in the last 8 hours. It skips localhost, file:// and bots on its own.
     The detailed statistics stay private at the dashboard address below (GoatCounter login).
     The footer shows only the site-wide total, from GoatCounter's public TOTAL counter. */
  var GC = 'https://almarinesythan.goatcounter.com';
  function track() {
    if (document.querySelector('script[data-goatcounter]')) return; // never load it twice
    /* One path per page: /projects/camou-poster/ and .../index.html count together; query strings are ignored */
    window.goatcounter = { no_events: true, path: function () { return location.pathname.replace(/index\.html$/, '') || '/'; } };
    var gc = document.createElement('script');
    gc.async = true;
    gc.src = 'https://gc.zgo.at/count.js';
    gc.setAttribute('data-goatcounter', GC + '/count');
    document.body.appendChild(gc);
  }
  /* After the page's own scripts, so a project page is recorded with its project title */
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', track); else track();
  /* The site-wide total, as GoatCounter formats it ("1,234"). One request per page, shared by the
     footer and the Views page (Site.totalViews); a failed request may be tried again. */
  var totalReq = null;
  function totalViews() {
    if (totalReq) return totalReq;
    if (!window.fetch) return Promise.reject(new Error('fetch'));
    var ctrl = window.AbortController ? new AbortController() : null;
    var timer = setTimeout(function () { if (ctrl) ctrl.abort(); }, 8000);
    totalReq = fetch(GC + '/counter/TOTAL.json', { signal: ctrl ? ctrl.signal : undefined, credentials: 'omit' })
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(function (d) {
        clearTimeout(timer);
        var n = d && typeof d.count === 'string' ? d.count.trim() : '';
        if (!/^\d[\d\s,.  ']*$/.test(n)) throw new Error('count');
        return n;
      })
      .catch(function (err) { clearTimeout(timer); totalReq = null; throw err; });
    return totalReq;
  }
  /* "Recorded Portfolio Views" in the footer: fetched when the footer comes near the screen.
     Hidden without JavaScript; says "Loading" while it waits and "Unavailable" if the service fails. */
  var views = document.querySelector('[data-views]');
  if (views) {
    var viewsN = views.querySelector('[data-views-n]');
    views.hidden = false;
    var showViews = function () {
      totalViews().then(function (n) {
        viewsN.textContent = n;
        views.setAttribute('data-state', 'ready');
      }, function () {
        viewsN.textContent = 'Unavailable';
        views.setAttribute('data-state', 'error');
      });
    };
    if ('IntersectionObserver' in window) {
      var vio = new IntersectionObserver(function (entries) {
        if (!entries[0].isIntersecting) return;
        vio.disconnect();
        showViews();
      }, { rootMargin: '0px 0px 600px 0px' });
      vio.observe(views);
    } else showViews();
  }

  /* Called by each page once its content is in place */
  window.Site = {
    reduce: reduce,
    lite: lite,
    totalViews: totalViews,
    goatcounter: GC,
    /* Things below the first screen arrive as they scroll in. At rest, the page is always complete:
       only elements below the fold are ever hidden, and only while this script runs.
       data-stagger="selector" reveals those children in sequence when the group arrives;
       with data-each, every child is watched on its own and staggered by its grid column.
       Site.rearm() hides whatever is below the fold again, so it all arrives again (used by Home). */
    reveal: function (selector, addClass) {
      if (lite || !('IntersectionObserver' in window)) return;
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (!en.isIntersecting) return;
          en.target.classList.remove('pending');
          (en.target._kids || []).forEach(function (k) { k.classList.remove('pending'); });
          io.unobserve(en.target);
        });
      }, { rootMargin: '0px 0px -8% 0px' });
      function below(el) { return el.getBoundingClientRect().top > window.innerHeight; }
      function hide(el, i) { el.classList.add('reveal', 'pending'); el.style.setProperty('--i', i); }
      var items = document.querySelectorAll(selector);
      function arm() {
        items.forEach(function (el) {
          var group = el.getAttribute('data-stagger');
          if (addClass && !group) el.classList.add('reveal');
          if (!group) { if (below(el)) { el.classList.add('pending'); io.observe(el); } return; }
          var kids = el.querySelectorAll(group); // asked each time: the gallery re-renders its plates
          if (el.hasAttribute('data-each')) {
            var cols = getComputedStyle(el).gridTemplateColumns.split(' ').length || 1;
            kids.forEach(function (k, i) { if (below(k)) { hide(k, i % cols); io.observe(k); } });
            return;
          }
          if (!below(el)) return;
          el.classList.add('pending');
          el._kids = [];
          kids.forEach(function (k, i) { hide(k, Math.min(i, 8)); el._kids.push(k); });
          io.observe(el);
        });
      }
      arm();
      Site.rearm = arm;
      /* Once shown, drop the stagger delay so later hovers respond at once */
      document.addEventListener('transitionend', function (e) {
        var t = e.target;
        if (t.classList && t.classList.contains('reveal') && !t.classList.contains('pending')) t.style.removeProperty('--i');
      });
    },
    /* Highlight the section in view in the desktop nav */
    navSpy: function () {
      var links = {};
      document.querySelectorAll('.nav-desktop a[href^="#"]').forEach(function (a) { links[a.getAttribute('href').slice(1)] = a; });
      if (!('IntersectionObserver' in window)) return;
      var spy = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (!en.isIntersecting || !links[en.target.id]) return;
          Object.keys(links).forEach(function (k) { links[k].removeAttribute('aria-current'); });
          links[en.target.id].setAttribute('aria-current', 'true');
        });
      }, { rootMargin: '-45% 0px -50% 0px' });
      Object.keys(links).forEach(function (id) { var s = document.getElementById(id); if (s) spy.observe(s); });
    },
    /* Before & after: drag, tap, arrow keys, and a slider / side-by-side switch */
    compare: function (cmp) {
      var range = cmp.querySelector('.cmp-range');
      var split = cmp.querySelector('.cmp-split');
      var section = cmp.closest('section');
      var hint = section.querySelector('.cmp-hint');
      var buttons = section.querySelectorAll('.vt-btn');
      function setPos() {
        var v = +range.value;
        cmp.style.setProperty('--pos', v + '%');
        range.setAttribute('aria-valuetext', v + '% sketch, ' + (100 - v) + '% final');
      }
      function setView(view) {
        cmp.setAttribute('data-view', view);
        buttons.forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-view') === view)); });
        split.setAttribute('aria-hidden', String(view !== 'split'));
        if (hint) hint.hidden = view === 'split';
      }
      range.addEventListener('input', setPos);
      setPos();
      buttons.forEach(function (b) { b.addEventListener('click', function () { if (!b.disabled) setView(b.getAttribute('data-view')); }); });
      return { setView: setView };
    }
  };
})();
