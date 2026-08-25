/* =============================================================================
   Eclipse Aluminum & Shade — LIVE BOOKING
   -----------------------------------------------------------------------------
   Opens the real scheduling calendar in a modal so the visitor books without
   ever leaving the page. Configured entirely from config.booking.

   Supported providers: calendly | acuity | hubspot | google | iframe | none

   Design rule: a booking button must NEVER dead-end. In order of preference we
   try the inline embed, then an "open in a new tab" link, then the contact form,
   then the phone number. Something always works.
   ========================================================================== */
(function () {
  'use strict';

  var CFG = window.ECLIPSE_CONFIG;
  var B   = CFG.booking || {};

  var modal, frameHost, lastFocus, calendlyLoading = false;

  function configured() {
    return B.provider && B.provider !== 'none' && !!B.url;
  }

  /* ---------------------------------------------------------------------------
     Build the scheduler URL, carrying what we already know about the lead.
     Calendly and HubSpot read name/email from query params; the others simply
     ignore params they don't recognize, so this is safe everywhere.
     ------------------------------------------------------------------------ */
  function buildUrl(ctx) {
    var url = B.url;
    if (!B.prefill) return url;

    var lead = readLead();
    var q = [];
    function add(k, v) { if (v) q.push(encodeURIComponent(k) + '=' + encodeURIComponent(v)); }

    if (B.provider === 'calendly') {
      add('name', lead.name);
      add('email', lead.email);
      add('a1', lead.phone);
      add('a2', summary(ctx));
    } else if (B.provider === 'hubspot') {
      add('firstname', (lead.name || '').split(' ')[0]);
      add('lastname', (lead.name || '').split(' ').slice(1).join(' '));
      add('email', lead.email);
      add('phone', lead.phone);
    } else if (B.provider === 'acuity') {
      add('firstName', (lead.name || '').split(' ')[0]);
      add('lastName', (lead.name || '').split(' ').slice(1).join(' '));
      add('email', lead.email);
      add('phone', lead.phone);
      add('field:notes', summary(ctx));
    } else {
      add('name', lead.name);
      add('email', lead.email);
    }

    if (!q.length) return url;
    return url + (url.indexOf('?') === -1 ? '?' : '&') + q.join('&');
  }

  /* Anything the visitor already typed into the contact form. */
  function readLead() {
    function val(id) { var n = document.getElementById(id); return n ? n.value.trim() : ''; }
    return { name: val('field-name'), email: val('field-email'), phone: val('field-phone') };
  }

  /* A one-line description of what they priced, passed into the booking notes. */
  function summary(ctx) {
    ctx = ctx || {};
    var parts = [];
    if (ctx.service) parts.push(ctx.service);
    var saved = (window.EclipseCalc && window.EclipseCalc.getSaved()) || [];
    var est = ctx.estimate || saved[saved.length - 1];
    if (est && window.EclipseCalc) {
      parts.push('Website estimate ' + window.EclipseCalc.money(est.low) +
                 '–' + window.EclipseCalc.money(est.high));
    }
    return parts.join(' · ');
  }

  /* ---------------------------------------------------------------------------
     Modal
     ------------------------------------------------------------------------ */
  function ensureModal() {
    if (modal) return modal;
    modal = document.getElementById('booking-modal');
    frameHost = document.getElementById('booking-embed');
    if (!modal) return null;

    modal.dataset.customEscape = '1';
    modal.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { close(); return; }
      window.EclipseTrapFocus(modal, e);
    });
    modal.addEventListener('click', function (e) {
      if (e.target === modal || e.target.closest('[data-booking-close]')) close();
    });
    return modal;
  }

  function open(ctx) {
    var m = ensureModal();
    if (!m) { fallbackNavigate(ctx); return; }

    lastFocus = document.activeElement;
    m.removeAttribute('hidden');
    m.classList.add('is-open');
    document.body.classList.add('nav-locked');

    renderEmbed(ctx);

    var focusTarget = m.querySelector('[data-autofocus]') || m.querySelector('button');
    if (focusTarget) focusTarget.focus({ preventScroll: true });

    if (window.EclipseTrack) {
      window.EclipseTrack('booking_opened', {
        provider: B.provider || 'none',
        service: (ctx && ctx.service) || ''
      });
    }
  }

  function close() {
    if (!modal) return;
    modal.classList.remove('is-open');
    modal.setAttribute('hidden', '');
    document.body.classList.remove('nav-locked');
    if (frameHost) frameHost.innerHTML = '';
    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
  }

  /* ---------------------------------------------------------------------------
     Embeds
     ------------------------------------------------------------------------ */
  function renderEmbed(ctx) {
    if (!frameHost) return;
    frameHost.innerHTML = '';

    var note = document.getElementById('booking-fallback');
    var openTab = document.getElementById('booking-newtab');

    if (!configured()) {
      if (note) {
        note.hidden = false;
        note.innerHTML =
          '<p class="booking-fallback__msg">' + window.EclipseEsc(B.fallbackNote || '') + '</p>' +
          '<div class="booking-fallback__actions">' +
            '<a class="btn btn--accent btn--lg" href="' + CFG.business.phoneHref + '">' +
              window.EclipseIcon('phone', 20) + '<span>Call ' + window.EclipseEsc(CFG.business.phone) + '</span></a>' +
            '<button class="btn btn--outline" type="button" data-booking-form>Use the contact form</button>' +
          '</div>';
      }
      if (openTab) openTab.hidden = true;
      frameHost.hidden = true;
      return;
    }

    if (note) note.hidden = true;
    frameHost.hidden = false;

    var url = buildUrl(ctx);

    if (openTab) {
      openTab.hidden = false;
      openTab.href = url;
    }

    if (B.provider === 'calendly') { renderCalendly(url); return; }
    renderIframe(url);
  }

  /* Calendly ships an official inline widget — better mobile behavior and it
     resizes itself. Everything else gets a plain iframe. */
  function renderCalendly(url) {
    var host = document.createElement('div');
    host.className = 'calendly-inline-widget booking-embed__frame';
    host.style.minWidth = '280px';
    host.style.height = '100%';
    frameHost.appendChild(host);
    showSpinner();

    function mount() {
      hideSpinner();
      try {
        window.Calendly.initInlineWidget({
          url: url + (url.indexOf('?') === -1 ? '?' : '&') + 'hide_gdpr_banner=1',
          parentElement: host
        });
      } catch (err) {
        renderIframe(url);
      }
    }

    if (window.Calendly) { mount(); return; }
    if (calendlyLoading) { setTimeout(function () { window.Calendly ? mount() : renderIframe(url); }, 1200); return; }

    calendlyLoading = true;
    var css = document.createElement('link');
    css.rel = 'stylesheet';
    css.href = 'https://assets.calendly.com/assets/external/widget.css';
    document.head.appendChild(css);

    var s = document.createElement('script');
    s.src = 'https://assets.calendly.com/assets/external/widget.js';
    s.async = true;
    s.onload = mount;
    s.onerror = function () { renderIframe(url); };   // blocked script → iframe
    document.head.appendChild(s);

    // Belt and braces: if the widget never boots, fall back rather than hang.
    setTimeout(function () {
      if (!window.Calendly && frameHost.contains(host)) renderIframe(url);
    }, 6000);
  }

  function renderIframe(url) {
    frameHost.innerHTML = '';
    showSpinner();
    var f = document.createElement('iframe');
    f.className = 'booking-embed__frame';
    f.src = url;
    f.title = B.modalTitle || 'Book an appointment';
    f.loading = 'eager';
    f.setAttribute('frameborder', '0');
    f.allow = 'camera; microphone; fullscreen; payment';
    f.addEventListener('load', hideSpinner);
    frameHost.appendChild(f);

    /* Some schedulers refuse to be framed. We cannot read the frame to find out,
       so if nothing has loaded after 7 seconds we surface the new-tab route
       loudly instead of leaving the visitor staring at a spinner. */
    setTimeout(function () {
      var sp = frameHost.querySelector('.booking-spinner');
      if (!sp) return;
      hideSpinner();
      var note = document.getElementById('booking-fallback');
      if (note) {
        note.hidden = false;
        note.innerHTML =
          '<p class="booking-fallback__msg">Our calendar is taking a moment. Open it in a new tab to book instantly:</p>' +
          '<div class="booking-fallback__actions">' +
            '<a class="btn btn--accent btn--lg" href="' + url + '" target="_blank" rel="noopener">' +
              window.EclipseIcon('calendar', 20) + '<span>Open the calendar</span></a>' +
            '<a class="btn btn--outline" href="' + CFG.business.phoneHref + '">Call ' +
              window.EclipseEsc(CFG.business.phone) + '</a>' +
          '</div>';
      }
    }, 7000);
  }

  function showSpinner() {
    var s = document.createElement('div');
    s.className = 'booking-spinner';
    s.innerHTML = '<span class="booking-spinner__ring" aria-hidden="true"></span>' +
                  '<span>Loading available times…</span>';
    frameHost.appendChild(s);
  }
  function hideSpinner() {
    var s = frameHost && frameHost.querySelector('.booking-spinner');
    if (s) s.remove();
  }

  /* With no modal in the DOM at all, go straight to the calendar or the form. */
  function fallbackNavigate(ctx) {
    if (configured()) { window.open(buildUrl(ctx), '_blank', 'noopener'); return; }
    var c = document.getElementById('contact');
    if (c) c.scrollIntoView({ behavior: window.EclipseReduced() ? 'auto' : 'smooth', block: 'start' });
  }

  /* ---------------------------------------------------------------------------
     Wire-up
     ------------------------------------------------------------------------ */
  function init() {
    ensureModal();

    document.addEventListener('click', function (e) {
      var t = e.target.closest && e.target.closest('[data-book]');
      if (t) {
        e.preventDefault();
        open({ service: t.getAttribute('data-book') || '' });
        return;
      }
      // "Use the contact form" inside the unconfigured-booking fallback.
      var f = e.target.closest && e.target.closest('[data-booking-form]');
      if (f) {
        e.preventDefault();
        close();
        var c = document.getElementById('contact');
        if (c) c.scrollIntoView({ behavior: window.EclipseReduced() ? 'auto' : 'smooth', block: 'start' });
        setTimeout(function () {
          var n = document.getElementById('field-name');
          if (n) n.focus({ preventScroll: true });
        }, window.EclipseReduced() ? 0 : 550);
      }
    });

    /* Tell the owner, in the console, exactly what to do to switch booking on. */
    if (!configured()) {
      console.info(
        '%c[Eclipse] Online booking is not connected yet.',
        'color:#c8952b;font-weight:600',
        '\nOpen assets/js/config.js → booking, set provider (calendly | acuity | hubspot | google | iframe)' +
        '\nand paste your scheduling URL. Every "Book" button switches to your live calendar automatically.' +
        '\nUntil then those buttons route to the contact form and the phone number.'
      );
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

  window.EclipseBooking = { open: open, close: close, isConfigured: configured };
})();
