/* =============================================================================
   Eclipse Aluminum & Shade — SHARED SITE LAYER
   Icons, analytics, navigation, scroll reveal, countdown, modals.
   Loaded before calculator.js / booking.js / forms.js, which all depend on it.
   ========================================================================== */
(function () {
  'use strict';

  var CFG = window.ECLIPSE_CONFIG;

  /* ===========================================================================
     ICONS — inline SVG (Lucide-style, 24x24, currentColor stroke).
     Never emoji: they render differently on every platform and read as
     decoration to a screen reader.
     ======================================================================== */
  var PATHS = {
    'arrow-right':  '<path d="M5 12h14M12 5l7 7-7 7"/>',
    'arrow-left':   '<path d="M19 12H5M12 19l-7-7 7-7"/>',
    'check':        '<path d="M20 6 9 17l-5-5"/>',
    'chevron-down': '<path d="m6 9 6 6 6-6"/>',
    'x':            '<path d="M18 6 6 18M6 6l12 12"/>',
    'phone':        '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/>',
    'calendar':     '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01"/>',
    'mail':         '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>',
    'map-pin':      '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/>',
    'clock':        '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
    'shield':       '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>',
    'shield-check': '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/>',
    'sun':          '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>',
    'wind':         '<path d="M12.8 19.6A2 2 0 1 0 14 16H2M17.5 8a2.5 2.5 0 1 1 2 4H2M9.8 4.4A2 2 0 1 1 11 8H2"/>',
    'lock':         '<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
    'star':         '<path d="M11.5 3.2a.6.6 0 0 1 1 0l2.3 4.7 5.2.8a.6.6 0 0 1 .3 1l-3.7 3.6.9 5.1a.6.6 0 0 1-.9.7L12 16.7l-4.6 2.4a.6.6 0 0 1-.9-.7l.9-5.1L3.7 9.7a.6.6 0 0 1 .3-1l5.2-.8z"/>',
    'sparkle':      '<path d="M12 3 13.9 8.6 19.5 10.5 13.9 12.4 12 18 10.1 12.4 4.5 10.5 10.1 8.6z"/><path d="M18 15.5 18.8 17.7 21 18.5 18.8 19.3 18 21.5 17.2 19.3 15 18.5 17.2 17.7z"/>',
    'ruler':        '<path d="M21.3 15.3 8.7 2.7a1 1 0 0 0-1.4 0L2.7 7.3a1 1 0 0 0 0 1.4l12.6 12.6a1 1 0 0 0 1.4 0l4.6-4.6a1 1 0 0 0 0-1.4z"/><path d="m7.5 10.5 2 2M10.5 7.5l2 2M13.5 4.5l2 2M4.5 13.5l2 2"/>',
    'clipboard':    '<rect x="8" y="2" width="8" height="4" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="m9 14 2 2 4-4"/>',
    'tag':          '<path d="M12.6 2.7 21 11a2 2 0 0 1 0 2.8l-7.2 7.2a2 2 0 0 1-2.8 0L2.7 12.6A2 2 0 0 1 2.1 11V4a2 2 0 0 1 2-2h7a2 2 0 0 1 1.5.7z"/><circle cx="7.5" cy="7.5" r="1.2"/>',
    'menu':         '<path d="M4 6h16M4 12h16M4 18h16"/>',
    'quote':        '<path d="M9 7H6a3 3 0 0 0-3 3v1a3 3 0 0 0 3 3h1v1a3 3 0 0 1-3 3M20 7h-3a3 3 0 0 0-3 3v1a3 3 0 0 0 3 3h1v1a3 3 0 0 1-3 3"/>',
    'thermometer':  '<path d="M14 14.76V4.5a2.5 2.5 0 0 0-5 0v10.26a4.5 4.5 0 1 0 5 0z"/>',
    'wrench':       '<path d="M14.7 6.3a4 4 0 0 0 5 5l-9.4 9.4a2.1 2.1 0 0 1-3-3z"/>',
    'eye':          '<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/>',

    /* Service marks — simple line diagrams of the actual products. */
    'awning':       '<path d="M3 11 12 5l9 6"/><path d="M3 11h18l-1.6 4H4.6z"/><path d="M6.5 15v3M12 15v3M17.5 15v3"/>',
    'screen':       '<rect x="4" y="3" width="16" height="4" rx="1"/><path d="M6 7v13M18 7v13"/><path d="M6 10h12M6 13h12M6 16h12"/>',
    'pergola':      '<path d="M3 8h18"/><path d="M5 8v13M19 8v13"/><path d="M8 8v4M12 8v4M16 8v4"/><path d="M3 5h18"/>'
  };

  window.EclipseIcon = function (name, size) {
    var d = PATHS[name];
    if (!d) return '';
    return '<svg viewBox="0 0 24 24" width="' + (size || 24) + '" height="' + (size || 24) +
           '" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" ' +
           'stroke-linejoin="round" aria-hidden="true" focusable="false">' + d + '</svg>';
  };

  /* Replace every <i data-icon="name"> in the markup with real SVG. */
  function hydrateIcons(scope) {
    (scope || document).querySelectorAll('[data-icon]').forEach(function (n) {
      if (n.dataset.iconDone) return;
      n.innerHTML = window.EclipseIcon(n.getAttribute('data-icon'));
      n.dataset.iconDone = '1';
    });
  }

  /* ===========================================================================
     ANALYTICS — nothing loads unless an ID is configured.
     ======================================================================== */
  function loadAnalytics() {
    var a = CFG.analytics || {};
    if (a.googleAnalyticsId || a.googleAdsId) {
      var id = a.googleAnalyticsId || a.googleAdsId;
      var s = document.createElement('script');
      s.async = true;
      s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(id);
      document.head.appendChild(s);
      window.dataLayer = window.dataLayer || [];
      window.gtag = function () { window.dataLayer.push(arguments); };
      window.gtag('js', new Date());
      if (a.googleAnalyticsId) window.gtag('config', a.googleAnalyticsId);
      if (a.googleAdsId)       window.gtag('config', a.googleAdsId);
    }
    if (a.metaPixelId) {
      /* eslint-disable */
      !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
      n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}
      (window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
      /* eslint-enable */
      window.fbq('init', a.metaPixelId);
      window.fbq('track', 'PageView');
    }
  }

  window.EclipseTrack = function (name, params) {
    var a = CFG.analytics || {};
    if (!a.trackEvents) return;
    if (window.gtag) window.gtag('event', name, params || {});
    if (window.fbq) {
      var map = { estimate_completed: 'Lead', booking_opened: 'Schedule', form_submitted: 'Lead' };
      if (map[name]) window.fbq('track', map[name], params || {});
    }
    if (!window.gtag && !window.fbq) console.info('[eclipse] event:', name, params || {});
  };

  /* ===========================================================================
     CONFIG → DOM  (phone numbers, license, offer copy in one pass)
     ======================================================================== */
  function applyConfig() {
    var b = CFG.business, o = CFG.offer || {};
    var map = {
      'biz-name': b.name, 'biz-phone': b.phone, 'biz-license': b.stateLicense,
      'biz-website': b.website, 'biz-email': b.email, 'biz-hours': b.hours,
      'offer-headline': o.headline, 'offer-subhead': o.subhead,
      'offer-eyebrow': o.eyebrow, 'offer-cta': o.ctaPrimary,
      'offer-dollars': '$' + (o.dollarsOff || 0),
      'offer-value': '$' + (o.renderingValue || 0),
      'guarantee-title': (o.guarantee || {}).title,
      'guarantee-body': (o.guarantee || {}).body,
      'biz-area': (b.serviceArea || []).join(' · ')
    };
    Object.keys(map).forEach(function (k) {
      if (map[k] === undefined || map[k] === null) return;
      document.querySelectorAll('[data-cfg="' + k + '"]').forEach(function (n) { n.textContent = map[k]; });
    });
    document.querySelectorAll('[data-cfg-href="phone"]').forEach(function (n) { n.href = b.phoneHref; });
    document.querySelectorAll('[data-cfg-href="email"]').forEach(function (n) { n.href = 'mailto:' + b.email; });
    document.querySelectorAll('[data-cfg="year"]').forEach(function (n) { n.textContent = new Date().getFullYear(); });

    if (!o.enabled) document.querySelectorAll('[data-offer-block]').forEach(function (n) { n.hidden = true; });
    renderOfferStack();
    renderScarcity();
    renderReviews();
    startCountdown();
    renderFinanceTerms();
  }

  function renderOfferStack() {
    var host = document.getElementById('offer-stack');
    var o = CFG.offer || {};
    if (!host || !o.stack) return;
    host.innerHTML = o.stack.map(function (s) {
      return '<li class="stack__item">' +
        '<span class="stack__check">' + window.EclipseIcon('check', 18) + '</span>' +
        '<span class="stack__body"><span class="stack__label">' + esc(s.label) + '</span>' +
        '<span class="stack__note">' + esc(s.note) + '</span></span>' +
        (s.valueText ? '<span class="stack__value">' + esc(s.valueText) + '</span>'
         : s.value ? '<span class="stack__value">$' + s.value + ' value</span>'
                   : '<span class="stack__value stack__value--free">Included</span>') +
        '</li>';
    }).join('');
  }

  function renderReviews() {
    var sec  = document.getElementById('reviews');
    var grid = document.getElementById('reviews-grid');
    var r    = CFG.reviews || {};
    if (!sec || !grid) return;
    if (!r.items || !r.items.length) { sec.hidden = true; return; }   // never ship fake reviews

    sec.hidden = false;
    var head = document.getElementById('reviews-headline');
    if (head && r.headline) head.textContent = r.headline;

    grid.innerHTML = r.items.map(function (q) {
      var stars = '';
      for (var i = 0; i < (q.stars || 5); i++) stars += window.EclipseIcon('star', 17);
      return '<article class="quote">' +
        '<div class="quote__stars" role="img" aria-label="' + (q.stars || 5) + ' out of 5 stars">' + stars + '</div>' +
        '<p class="quote__text">' + esc(q.text) + '</p>' +
        '<div class="quote__who"><span class="quote__name">' + esc(q.name) + '</span>' +
        (q.where ? '<span class="quote__where">' + esc(q.where) + '</span>' : '') +
        '</div></article>';
    }).join('');
  }

  function renderScarcity() {
    var n = document.getElementById('offer-scarcity');
    var slots = (CFG.offer || {}).slotsRemaining;
    if (!n) return;
    if (!slots) { n.hidden = true; return; }
    n.hidden = false;
    n.innerHTML = window.EclipseIcon('clock', 16) +
      '<span><strong>' + slots + ' design appointments</strong> left this week in your area.</span>';
  }

  function startCountdown() {
    var host = document.getElementById('offer-countdown');
    var iso = (CFG.offer || {}).deadline;
    if (!host) return;
    if (!iso) { host.hidden = true; return; }
    var end = new Date(iso + 'T23:59:59');
    if (isNaN(end.getTime())) { host.hidden = true; return; }
    host.hidden = false;

    function tick() {
      var ms = end - new Date();
      if (ms <= 0) { host.hidden = true; return; }
      var d = Math.floor(ms / 864e5),
          h = Math.floor(ms % 864e5 / 36e5),
          m = Math.floor(ms % 36e5 / 6e4);
      host.innerHTML = '<span class="countdown__label">Offer ends in</span>' +
        unit(d, 'days') + unit(h, 'hrs') + unit(m, 'min');
      setTimeout(tick, 30000);
    }
    function unit(v, l) {
      return '<span class="countdown__unit"><strong>' + v + '</strong><span>' + l + '</span></span>';
    }
    tick();
  }

  function renderFinanceTerms() {
    var host = document.getElementById('finance-terms-body');
    var f = ((CFG.offer || {}).financing) || {};
    if (!host) return;
    host.textContent = f.disclaimer || '';
    var head = document.getElementById('finance-terms-head');
    if (head && f.apr) {
      head.textContent = 'Example based on ' + f.apr + '% APR over ' + f.months +
        ' months on the midpoint of your estimate.';
    }
  }

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  window.EclipseEsc = esc;

  /* ===========================================================================
     NAVIGATION
     ======================================================================== */
  function initNav() {
    var header = document.querySelector('.site-header');
    var toggle = document.querySelector('.nav-toggle');
    var menu   = document.getElementById('site-nav');

    if (toggle && menu) {
      toggle.addEventListener('click', function () {
        var open = menu.classList.toggle('is-open');
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        document.body.classList.toggle('nav-locked', open);
      });
      menu.addEventListener('click', function (e) {
        if (e.target.closest('a')) {
          menu.classList.remove('is-open');
          toggle.setAttribute('aria-expanded', 'false');
          document.body.classList.remove('nav-locked');
        }
      });
    }

    if (header) {
      var onScroll = function () {
        header.classList.toggle('is-stuck', window.scrollY > 24);
        var bar = document.querySelector('.mobile-cta');
        if (bar) bar.classList.toggle('is-visible', window.scrollY > 600);
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    }

    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var id = a.getAttribute('href');
        if (id.length < 2) return;
        var t = document.querySelector(id);
        if (!t) return;
        e.preventDefault();
        t.scrollIntoView({ behavior: reduced() ? 'auto' : 'smooth', block: 'start' });
        history.replaceState(null, '', id);
      });
    });
  }

  /* ===========================================================================
     SCROLL REVEAL — opt-in, and a no-op under reduced motion.
     ======================================================================== */
  function initReveal() {
    var nodes = document.querySelectorAll('[data-reveal]');
    if (!nodes.length) return;
    if (reduced() || !('IntersectionObserver' in window)) {
      nodes.forEach(function (n) { n.classList.add('is-revealed'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add('is-revealed');
        io.unobserve(en.target);
      });
    }, { rootMargin: '0px 0px -40px 0px', threshold: 0 });
    nodes.forEach(function (n) { io.observe(n); });

    /* Failsafe. This is a lead-generation page: content that stays invisible
       because of a browser quirk costs real money. If anything is still hidden
       after a few seconds, show it — the visitor has not scrolled to it yet, so
       nothing about the experience is lost. */
    setTimeout(function () {
      document.querySelectorAll('[data-reveal]:not(.is-revealed)')
        .forEach(function (n) { n.classList.add('is-revealed'); io.unobserve(n); });
    }, 6000);
  }

  /* ===========================================================================
     GENERIC MODALS  (finance terms, offer fine print)
     Booking has its own richer modal in booking.js.
     ======================================================================== */
  function initModals() {
    document.addEventListener('click', function (e) {
      var open = e.target.closest && e.target.closest('[data-modal]');
      if (open) {
        var m = document.getElementById(open.getAttribute('data-modal'));
        if (m) { e.preventDefault(); showModal(m); }
        return;
      }
      var close = e.target.closest && e.target.closest('[data-modal-close]');
      if (close) { e.preventDefault(); hideModal(close.closest('.modal')); }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      var open = document.querySelector('.modal.is-open');
      if (open && !open.dataset.customEscape) hideModal(open);
    });
  }

  function showModal(m) {
    m.classList.add('is-open');
    m.removeAttribute('hidden');
    document.body.classList.add('nav-locked');
    var f = m.querySelector('[data-autofocus], button, [href], input, select, textarea');
    if (f) f.focus({ preventScroll: true });
  }
  function hideModal(m) {
    if (!m) return;
    m.classList.remove('is-open');
    m.setAttribute('hidden', '');
    document.body.classList.remove('nav-locked');
  }
  window.EclipseModal = { show: showModal, hide: hideModal };

  /* Keep focus inside an open dialog — used by every modal on the page. */
  window.EclipseTrapFocus = function (container, e) {
    if (e.key !== 'Tab') return;
    var f = container.querySelectorAll(
      'a[href], button:not([disabled]), input:not([disabled]), select, textarea, iframe, [tabindex]:not([tabindex="-1"])'
    );
    if (!f.length) return;
    var first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  };

  function reduced() {
    return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }
  window.EclipseReduced = reduced;

  /* ===========================================================================
     PHOTOS ARE OPTIONAL
     Every photo sits on top of a designed CSS backdrop. If the file is missing,
     we drop the <img> and the backdrop shows through — no broken-image icons.
     ======================================================================== */
  function initOptionalPhotos() {
    document.querySelectorAll('img[data-optional]').forEach(function (img) {
      var frame = img.closest('[data-photo]');
      var found = function () { if (frame) frame.classList.add('has-photo'); };
      var absent = function () { img.remove(); };

      if (img.complete) {
        // Already resolved before this script ran — the error event will never
        // fire again, so decide from naturalWidth instead of waiting for it.
        // Without this the browser paints the alt text over the CSS artwork.
        if (img.naturalWidth > 0) found(); else absent();
        return;
      }
      img.addEventListener('load', found);
      img.addEventListener('error', absent);
    });
  }

  /* ===========================================================================
     BOOT
     ======================================================================== */
  function init() {
    hydrateIcons();
    applyConfig();
    initNav();
    initReveal();
    initModals();
    initOptionalPhotos();
    loadAnalytics();
    document.documentElement.classList.add('js-ready');
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

  window.EclipseHydrateIcons = hydrateIcons;
})();
