/* =============================================================================
   Urban Brother's Heating & Air — site behavior
   Everything a non-developer needs to change lives in CONFIG, right below.
   ========================================================================== */
(function () {
  'use strict';

  /* ---------------------------------------------------------------------- *
   * CONFIG — edit these four things and the site is live.                   *
   * ---------------------------------------------------------------------- */
  var CONFIG = {

    /* 1. ONLINE CALENDAR ---------------------------------------------------
       Paste the public booking URL from whichever scheduler the business uses.
       Leave `url` empty ('') and the site falls back to the built-in
       "pick a window + request" panel, which still works fine.

       provider: 'calendly' | 'google' | 'housecallpro' | 'acuity' | 'iframe'
       Examples:
         Calendly ......... https://calendly.com/urbanbrothershvac/service-call
         Google Calendar .. https://calendar.google.com/calendar/appointments/schedules/AcZ...
                            (Appointment schedule → "Open booking page" link)
         Housecall Pro .... https://book.housecallpro.com/book/Urban-Brothers/xxxxxxxx
         Acuity ........... https://app.acuityscheduling.com/schedule.php?owner=00000000
    ------------------------------------------------------------------------ */
    scheduler: {
      provider: 'calendly',
      url: '',                 // <-- paste booking URL here
      height: 700,
      title: 'Book an appointment with Urban Brother\'s Heating & Air'
    },

    /* 2. CONTACT FORM ------------------------------------------------------
       provider: 'netlify'  → Netlify Forms. Nothing to configure: deploy to
                              Netlify and submissions appear under
                              Site → Forms → service-request. Set up email
                              notifications there.
                 'endpoint' → any URL that accepts a JSON POST, e.g.
                              Formspree  https://formspree.io/f/YOUR_FORM_ID
                              Web3Forms  https://api.web3forms.com/submit
                                         (also set accessKey)
                 'mailto'   → always open the visitor's email client instead.

       Whatever the provider, a failed send tells the visitor to call, so a
       lead is never silently dropped. Note that Netlify Forms only works on a
       deployed Netlify site — locally it will fail and show that call prompt.
    ------------------------------------------------------------------------ */
    form: {
      provider: 'netlify',
      endpoint: '',                                  // 'endpoint' provider only
      accessKey: '',                                 // Web3Forms only
      fallbackEmail: 'service@urbanbrothershvac.com' // <-- confirm this address
    },

    /* 3. BUSINESS ---------------------------------------------------------- */
    business: {
      phoneDisplay: '412-913-5291',
      phoneHref: '+14129135291'
    },

    /* 4. ANALYTICS ---------------------------------------------------------
       Call tracking fires automatically into gtag / dataLayer / fbq when any
       of them are present. Nothing to configure.
    ------------------------------------------------------------------------ */
    analytics: { enabled: true }
  };

  var $  = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ====================================================================== *
   * Header: shadow on scroll + mobile nav                                   *
   * ====================================================================== */
  var head = $('#siteHead');
  if (head) {
    var onScroll = function () { head.classList.toggle('is-stuck', window.scrollY > 8); };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  var burger = $('#burger'), nav = $('#nav'), scrim = $('#navScrim');
  function setNav(open) {
    if (!nav || !burger) return;
    nav.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', String(open));
    if (scrim) { scrim.classList.toggle('is-open', open); scrim.hidden = !open; }
    document.body.style.overflow = open ? 'hidden' : '';
  }
  if (burger) burger.addEventListener('click', function () {
    setNav(burger.getAttribute('aria-expanded') !== 'true');
  });
  if (scrim) scrim.addEventListener('click', function () { setNav(false); });
  $$('#nav a').forEach(function (a) { a.addEventListener('click', function () { setNav(false); }); });

  /* ====================================================================== *
   * Reveal on scroll                                                        *
   * ====================================================================== */
  var reveals = $$('.reveal');
  if ('IntersectionObserver' in window && reveals.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ====================================================================== *
   * Reviews: show all                                                       *
   * ====================================================================== */
  var revToggle = $('#revToggle');
  if (revToggle) {
    revToggle.addEventListener('click', function () {
      var open = revToggle.getAttribute('aria-expanded') === 'true';
      $$('#revGrid .rev').forEach(function (r, i) {
        if (i >= 6) r.classList.toggle('rev--hide', open);
      });
      revToggle.setAttribute('aria-expanded', String(!open));
      revToggle.textContent = open ? 'Read all 19 reviews' : 'Show fewer reviews';
      if (open) $('#reviews').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  /* ====================================================================== *
   * Scheduler embed                                                         *
   * ====================================================================== */
  function schedulerSrc() {
    var s = CONFIG.scheduler;
    if (!s.url) return '';
    var u = s.url;
    if (s.provider === 'calendly') {
      u += (u.indexOf('?') > -1 ? '&' : '?') +
           'hide_gdpr_banner=1&background_color=ffffff&text_color=14141a&primary_color=d91f26';
    }
    return u;
  }

  function buildScheduler(host) {
    if (!host) return;
    var src = schedulerSrc();
    if (!src) return false;
    var frame = document.createElement('iframe');
    frame.className = 'sched__frame';
    frame.src = src;
    frame.title = CONFIG.scheduler.title;
    frame.loading = 'lazy';
    frame.style.minHeight = CONFIG.scheduler.height + 'px';
    frame.setAttribute('allow', 'payment');
    host.innerHTML = '';
    host.appendChild(frame);
    return true;
  }

  var schedHost = $('#sched');
  var schedModalHost = $('#schedModal');
  var hasCalendar = buildScheduler(schedHost);

  if (schedModalHost) {
    if (hasCalendar) {
      buildScheduler(schedModalHost);
    } else {
      // No calendar configured — mirror the on-page fallback into the modal.
      var fb = $('#schedFallback');
      if (fb) {
        var clone = fb.cloneNode(true);
        clone.id = 'schedFallbackModal';
        $$('[id]', clone).forEach(function (n) { n.removeAttribute('id'); });
        schedModalHost.appendChild(clone);
      }
    }
  }

  /* Preferred-window chips → sync into the request form */
  document.addEventListener('click', function (e) {
    var slot = e.target.closest ? e.target.closest('.slot') : null;
    if (!slot) return;
    var group = slot.parentElement;
    $$('.slot', group).forEach(function (b) { b.setAttribute('aria-pressed', 'false'); });
    slot.setAttribute('aria-pressed', 'true');

    var value = slot.getAttribute('data-slot') || '';
    var win = $('#f-window'), urg = $('#f-urgency');
    if (win) {
      var map = { 'Morning': 0, 'Afternoon': 1, 'Evening': 2 };
      var key = value.split(' ')[0];
      if (key in map) win.selectedIndex = map[key];
    }
    if (urg && value.indexOf('ASAP') === 0) urg.selectedIndex = 0;

    closeBooking();
    var book = $('#book');
    if (book) book.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setTimeout(function () { var n = $('#f-name'); if (n) n.focus({ preventScroll: true }); }, 500);
  });

  /* ====================================================================== *
   * Booking modal                                                           *
   * ====================================================================== */
  var modal = $('#bookingModal');
  var lastFocus = null;

  function openBooking() {
    if (!modal) return;
    lastFocus = document.activeElement;
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    var first = modal.querySelector('[data-close-booking], button, a, iframe');
    if (first) first.focus();
    track('booking_modal_open', {});
  }
  function closeBooking() {
    if (!modal || modal.hidden) return;
    modal.hidden = true;
    document.body.style.overflow = '';
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  $$('[data-open-booking]').forEach(function (b) {
    b.addEventListener('click', function (e) { e.preventDefault(); openBooking(); });
  });
  $$('[data-close-booking]').forEach(function (b) {
    b.addEventListener('click', function () { closeBooking(); });
  });
  if (modal) {
    modal.addEventListener('click', function (e) { if (e.target === modal) closeBooking(); });
  }
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { closeBooking(); setNav(false); }
    if (e.key === 'Tab' && modal && !modal.hidden) trapFocus(e);
  });

  function trapFocus(e) {
    var f = $$('a[href], button:not([disabled]), input, select, textarea, iframe, [tabindex]:not([tabindex="-1"])', modal)
      .filter(function (el) { return el.offsetParent !== null; });
    if (!f.length) return;
    var first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  /* Modal tabs */
  var tabCal = $('#tab-cal'), tabForm = $('#tab-form');
  function selectTab(which) {
    var isCal = which === 'cal';
    if (tabCal)  tabCal.setAttribute('aria-selected', String(isCal));
    if (tabForm) tabForm.setAttribute('aria-selected', String(!isCal));
    var pc = $('#pane-cal'), pf = $('#pane-form');
    if (pc) pc.hidden = !isCal;
    if (pf) pf.hidden = isCal;
  }
  if (tabCal)  tabCal.addEventListener('click', function () { selectTab('cal'); });
  if (tabForm) tabForm.addEventListener('click', function () { selectTab('form'); });

  /* ====================================================================== *
   * Offer buttons → preselect the offer in the form                         *
   * ====================================================================== */
  $$('[data-offer]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var offer = btn.getAttribute('data-offer');
      var sel = $('#f-offer');
      if (sel) {
        $$('option', sel).forEach(function (o) { if (o.value === offer || o.text === offer) sel.value = o.value || o.text; });
      }
      if (offer === 'Free Second Opinion') {
        var svc = $('#f-service');
        if (svc) $$('option', svc).forEach(function (o) { if (/second opinion/i.test(o.text)) svc.value = o.value || o.text; });
      }
      track('offer_click', { offer: offer });
      setTimeout(function () { var n = $('#f-name'); if (n) n.focus({ preventScroll: true }); }, 600);
    });
  });

  /* ====================================================================== *
   * Request form                                                            *
   * ====================================================================== */
  var form = $('#serviceForm');
  var statusEl = $('#formStatus');
  var submitBtn = $('#formSubmit');

  var RULES = {
    'f-name':    function (v) { return v.trim().length >= 2; },
    'f-phone':   function (v) { return (v.replace(/\D/g, '').length >= 10); },
    'f-email':   function (v) { return v === '' || /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()); },
    'f-zip':     function (v) { return /^\d{5}(-\d{4})?$/.test(v.trim()); },
    'f-service': function (v) { return v !== ''; }
  };

  function validateField(id) {
    var el = document.getElementById(id);
    if (!el) return true;
    var ok = RULES[id](el.value);
    el.setAttribute('aria-invalid', ok ? 'false' : 'true');
    var wrap = el.closest('.field');
    if (wrap) wrap.classList.toggle('has-err', !ok);
    return ok;
  }

  Object.keys(RULES).forEach(function (id) {
    var el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('blur', function () { if (el.value !== '') validateField(id); });
    el.addEventListener('input', function () {
      if (el.getAttribute('aria-invalid') === 'true') validateField(id);
    });
  });

  /* Light phone formatting as they type */
  var phone = $('#f-phone');
  if (phone) phone.addEventListener('input', function () {
    var d = phone.value.replace(/\D/g, '').slice(0, 10);
    phone.value = d.length > 6 ? d.slice(0, 3) + '-' + d.slice(3, 6) + '-' + d.slice(6)
                : d.length > 3 ? d.slice(0, 3) + '-' + d.slice(3)
                : d;
  });

  function say(kind, msg) {
    if (!statusEl) return;
    statusEl.className = 'form-status is-' + kind;
    statusEl.textContent = msg;
  }

  function payload() {
    var data = {};
    new FormData(form).forEach(function (v, k) { data[k] = v; });
    data.page_source = window.location.href;
    data.submitted_at = new Date().toLocaleString('en-US', { timeZone: 'America/New_York' });
    if (CONFIG.form.accessKey) data.access_key = CONFIG.form.accessKey;
    return data;
  }

  function encode(data) {
    return Object.keys(data).map(function (k) {
      return encodeURIComponent(k) + '=' + encodeURIComponent(data[k]);
    }).join('&');
  }

  function mailtoFallback(data) {
    var lines = [
      'Name: ' + (data.name || ''),
      'Phone: ' + (data.phone || ''),
      'Email: ' + (data.email || ''),
      'Service ZIP: ' + (data.zip || ''),
      'Service needed: ' + (data.service || ''),
      'Urgency: ' + (data.urgency || ''),
      'Preferred window: ' + (data.preferred_window || ''),
      'Offer: ' + (data.offer || 'none'),
      '',
      'Details:',
      (data.message || '(none)')
    ].join('\n');
    var href = 'mailto:' + encodeURIComponent(CONFIG.form.fallbackEmail) +
      '?subject=' + encodeURIComponent('Service request from ' + (data.name || 'website')) +
      '&body=' + encodeURIComponent(lines);
    window.location.href = href;
  }

  if (form) {
    var ps = $('#pageSource');
    if (ps) ps.value = window.location.href;

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      /* Honeypot — silently succeed for bots. */
      if (form.company_website && form.company_website.value) { say('ok', 'Thanks — we\'ll be in touch.'); return; }

      var firstBad = null;
      Object.keys(RULES).forEach(function (id) {
        if (!validateField(id) && !firstBad) firstBad = document.getElementById(id);
      });
      if (firstBad) {
        say('err', 'Please fix the highlighted fields so we can reach you.');
        firstBad.focus();
        return;
      }

      var data = payload();
      var provider = CONFIG.form.provider;
      if (provider === 'endpoint' && !CONFIG.form.endpoint) provider = 'mailto';

      if (provider === 'mailto') {
        say('busy', 'Opening your email so you can send this to us…');
        track('lead_submit', { method: 'mailto', service: data.service });
        mailtoFallback(data);
        return;
      }

      submitBtn.disabled = true;
      say('busy', 'Sending your request…');

      var request = provider === 'netlify'
        /* Netlify Forms wants urlencoded data posted back to the site itself. */
        ? fetch('/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: encode(data)
          })
        : fetch(CONFIG.form.endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify(data)
          });

      request.then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        form.reset();
        say('ok', 'Got it — thanks! We\'ll call you shortly to confirm your appointment window. ' +
                  'Need someone right now? Call ' + CONFIG.business.phoneDisplay + '.');
        track('lead_submit', { method: provider, service: data.service, offer: data.offer || 'none' });
      }).catch(function () {
        say('err', 'That didn\'t go through. Please call ' + CONFIG.business.phoneDisplay +
                   ' — we\'ll get you on the schedule right away.');
      }).then(function () {
        submitBtn.disabled = false;
      });
    });
  }

  /* ====================================================================== *
   * Conversion tracking                                                     *
   * ====================================================================== */
  function track(event, params) {
    if (!CONFIG.analytics.enabled) return;
    try {
      if (typeof window.gtag === 'function') window.gtag('event', event, params || {});
      if (window.dataLayer && window.dataLayer.push) window.dataLayer.push(Object.assign({ event: event }, params || {}));
      if (typeof window.fbq === 'function') window.fbq('trackCustom', event, params || {});
    } catch (err) { /* analytics must never break the page */ }
  }

  $$('[data-track^="call-"]').forEach(function (a) {
    a.addEventListener('click', function () {
      track('call_click', { placement: a.getAttribute('data-track').replace('call-', '') });
    });
  });

  /* ====================================================================== *
   * Misc                                                                    *
   * ====================================================================== */
  var yr = $('#yr');
  if (yr) yr.textContent = new Date().getFullYear();

  /* Skip the calendar tab entirely when there's nothing to show there. */
  if (!hasCalendar && tabCal) tabCal.textContent = 'Request a time';
})();
