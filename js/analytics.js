/* ============================================================
   analytics.js — the Analytics page only.
   Public view: the site-wide total from GoatCounter (Site.totalViews in site.js).
   Owner view: GoatCounter's own dashboard in a frame. GoatCounter handles the sign-in;
   nothing secret is in this file, and the frame shows only what GoatCounter allows.
   ============================================================ */
(function () {
  /* Public total: "Loading", then the number, or "Unavailable" with a way to try again */
  var box = document.querySelector('[data-total]');
  var num = box.querySelector('[data-total-n]');
  var status = box.querySelector('[data-total-status]');
  var retry = box.querySelector('[data-total-retry]');
  function loadTotal() {
    box.setAttribute('data-state', 'loading');
    num.textContent = '—';
    num.setAttribute('aria-hidden', 'true');
    status.textContent = 'Loading the latest total…';
    retry.hidden = true;
    Site.totalViews().then(function (n) {
      box.setAttribute('data-state', 'ready');
      num.textContent = n;
      num.removeAttribute('aria-hidden');
      status.textContent = 'Recorded page views across the whole portfolio, from GoatCounter.';
    }, function () {
      box.setAttribute('data-state', 'error');
      status.textContent = 'The total is unavailable right now. GoatCounter could not be reached.';
      retry.hidden = false;
    });
  }
  retry.addEventListener('click', loadTotal);
  loadTotal();

  /* Owner view: the frame is created the first time it is opened, then kept, so a sign-in survives Close */
  var toggle = document.getElementById('owner-toggle');
  var panel = document.getElementById('owner-panel');
  var holder = document.getElementById('owner-frame');
  var closeBtn = document.getElementById('owner-close');
  function setOpen(open) {
    panel.hidden = !open;
    toggle.setAttribute('aria-expanded', String(open));
    if (!open) { toggle.focus(); return; }
    if (!holder.firstChild) {
      var frame = document.createElement('iframe');
      frame.src = Site.goatcounter + '/';
      frame.title = 'GoatCounter analytics dashboard (sign-in required)';
      frame.referrerPolicy = 'strict-origin';
      /* Scripts, forms and its own cookies for the sign-in; it cannot navigate this page */
      frame.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox allow-downloads');
      holder.appendChild(frame);
    }
    panel.scrollIntoView({ behavior: Site.reduce ? 'auto' : 'smooth', block: 'start' });
  }
  toggle.addEventListener('click', function () { setOpen(panel.hidden); });
  closeBtn.addEventListener('click', function () { setOpen(false); });

  Site.reveal('.reveal');
})();
