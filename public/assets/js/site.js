/* Booth's Contracting — progressive enhancement only.
   Every form works, and every page is readable, with JavaScript disabled. */
(function () {
  'use strict';

  var doc = document;
  var on = function (el, ev, fn, opts) { if (el) el.addEventListener(ev, fn, opts || false); };
  var $ = function (s, r) { return (r || doc).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || doc).querySelectorAll(s)); };

  /* ---------- Mobile navigation ---------- */
  var nav = $('#primary-nav');
  var toggle = $('#nav-toggle');
  var scrim = $('#nav-scrim');

  function setNav(open) {
    if (!nav || !toggle) return;
    nav.classList.toggle('is-open', open);
    if (scrim) scrim.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    doc.body.classList.toggle('nav-open', open);
  }
  on(toggle, 'click', function () { setNav(toggle.getAttribute('aria-expanded') !== 'true'); });
  on(scrim, 'click', function () { setNav(false); });
  on(doc, 'keydown', function (e) { if (e.key === 'Escape') setNav(false); });
  $$('#primary-nav a').forEach(function (a) { on(a, 'click', function () { setNav(false); }); });

  /* ---------- Header shadow on scroll ---------- */
  var header = $('#site-header');
  if (header) {
    var stuck = false;
    var onScroll = function () {
      var next = window.scrollY > 8;
      if (next !== stuck) { stuck = next; header.classList.toggle('is-stuck', stuck); }
    };
    on(window, 'scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Dismissible promo bar ---------- */
  var promo = $('#promo-bar');
  var PROMO_KEY = 'bc-promo-dismissed-v1';
  try {
    if (promo && localStorage.getItem(PROMO_KEY) === '1') promo.hidden = true;
  } catch (e) { /* private mode */ }
  on($('#promo-close'), 'click', function () {
    if (promo) promo.hidden = true;
    try { localStorage.setItem(PROMO_KEY, '1'); } catch (e) {}
  });

  /* ---------- Reveal on scroll ---------- */
  var revealables = $$('.reveal');
  if (revealables.length) {
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) { entry.target.classList.add('is-in'); io.unobserve(entry.target); }
        });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });
      revealables.forEach(function (el) { io.observe(el); });
    } else {
      revealables.forEach(function (el) { el.classList.add('is-in'); });
    }
  }

  /* ---------- Lead attribution ----------
     Captures the first campaign that brought the visitor in and keeps it for
     30 days, so the source lands on the lead rather than being lost on the
     second page view. */
  var ATTR_KEY = 'bc-attribution-v1';
  var ATTR_TTL = 30 * 24 * 60 * 60 * 1000;

  function readStoredAttribution() {
    try {
      var raw = localStorage.getItem(ATTR_KEY);
      if (!raw) return null;
      var parsed = JSON.parse(raw);
      if (!parsed || !parsed.t || Date.now() - parsed.t > ATTR_TTL) return null;
      return parsed;
    } catch (e) { return null; }
  }

  function currentAttribution() {
    var params = new URLSearchParams(window.location.search);
    var keys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'fbclid'];
    var found = {};
    var any = false;
    keys.forEach(function (k) {
      var v = params.get(k);
      if (v) { found[k] = v.slice(0, 120); any = true; }
    });
    if (!any) return null;
    found.landing = window.location.pathname;
    found.referrer = doc.referrer ? doc.referrer.slice(0, 200) : '';
    found.t = Date.now();
    return found;
  }

  var attribution = currentAttribution();
  if (attribution) {
    try { localStorage.setItem(ATTR_KEY, JSON.stringify(attribution)); } catch (e) {}
  } else {
    attribution = readStoredAttribution();
  }

  function attributionSummary() {
    var parts = [];
    if (attribution) {
      ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'fbclid'].forEach(function (k) {
        if (attribution[k]) parts.push(k + '=' + attribution[k]);
      });
      if (attribution.landing) parts.push('landing=' + attribution.landing);
      if (attribution.referrer) parts.push('referrer=' + attribution.referrer);
    }
    if (!parts.length) {
      parts.push('referrer=' + (doc.referrer || 'direct'));
      parts.push('landing=' + window.location.pathname);
    }
    return parts.join(' | ').slice(0, 900);
  }

  /* ---------- Phone number formatting ---------- */
  function formatPhone(value) {
    var digits = value.replace(/\D/g, '').slice(0, 11);
    if (digits.length === 11 && digits.charAt(0) === '1') digits = digits.slice(1);
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return '(' + digits.slice(0, 3) + ') ' + digits.slice(3);
    return '(' + digits.slice(0, 3) + ') ' + digits.slice(3, 6) + '-' + digits.slice(6, 10);
  }

  $$('input[type="tel"]').forEach(function (input) {
    on(input, 'input', function () {
      var start = input.selectionStart;
      var before = input.value.length;
      input.value = formatPhone(input.value);
      if (start !== null && start < before) {
        var delta = input.value.length - before;
        try { input.setSelectionRange(start + delta, start + delta); } catch (e) {}
      }
    });
  });

  /* ---------- Form validation & submission ---------- */
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;

  function fieldWrap(input) { return input.closest('.field') || input.parentNode; }

  function setError(input, message) {
    var wrap = fieldWrap(input);
    wrap.classList.add('field--error');
    var err = wrap.querySelector('.field__err');
    if (err) err.textContent = message;
    input.setAttribute('aria-invalid', 'true');
  }

  function clearError(input) {
    var wrap = fieldWrap(input);
    wrap.classList.remove('field--error');
    input.removeAttribute('aria-invalid');
  }

  function validateField(input) {
    var value = (input.value || '').trim();
    var label = input.getAttribute('data-label') || 'This field';

    if (input.required && !value) { setError(input, label + ' is required.'); return false; }
    if (!value) { clearError(input); return true; }

    if (input.type === 'tel') {
      var digits = value.replace(/\D/g, '');
      if (digits.length !== 10) { setError(input, 'Enter a 10-digit phone number so we can reach you.'); return false; }
    }
    if (input.type === 'email' && !EMAIL_RE.test(value)) {
      setError(input, 'Enter a valid email address.'); return false;
    }
    if (input.getAttribute('data-validate') === 'zip' && !/^\d{5}$/.test(value)) {
      setError(input, 'Enter a 5-digit ZIP code.'); return false;
    }
    if (input.getAttribute('data-validate') === 'name' && value.length < 2) {
      setError(input, 'Enter your name.'); return false;
    }
    clearError(input);
    return true;
  }

  $$('form[data-lead-form]').forEach(function (form) {
    var inputs = $$('input, select, textarea', form).filter(function (el) {
      return el.type !== 'hidden' && el.type !== 'submit' && !el.closest('.hp');
    });

    inputs.forEach(function (input) {
      on(input, 'blur', function () { validateField(input); });
      on(input, 'input', function () {
        if (fieldWrap(input).classList.contains('field--error')) validateField(input);
      });
    });

    on(form, 'submit', function (e) {
      // Stamp attribution and page context on every submission.
      var attrInput = form.querySelector('input[name="attribution"]');
      if (attrInput) attrInput.value = attributionSummary();
      var pageInput = form.querySelector('input[name="submitted_from"]');
      if (pageInput) pageInput.value = doc.title + ' — ' + window.location.pathname;

      var firstBad = null;
      inputs.forEach(function (input) {
        if (!validateField(input) && !firstBad) firstBad = input;
      });

      if (firstBad) {
        e.preventDefault();
        var status = form.querySelector('.form-status');
        if (status) {
          status.className = 'form-status is-error';
          status.textContent = 'Please check the highlighted fields and try again.';
        }
        firstBad.focus();
        firstBad.scrollIntoView({ block: 'center', behavior: 'smooth' });
        return;
      }

      var submit = form.querySelector('[type="submit"]');
      if (submit) {
        submit.disabled = true;
        submit.dataset.original = submit.textContent;
        submit.textContent = 'Sending…';
        // Re-enable if the navigation is blocked or the user comes back.
        setTimeout(function () {
          submit.disabled = false;
          submit.textContent = submit.dataset.original || 'Send';
        }, 8000);
      }
      track('generate_lead', { form_id: form.getAttribute('name') || 'lead' });
    });
  });

  /* ---------- Conversion tracking hooks ---------- */
  function track(event, params) {
    if (typeof window.gtag === 'function') window.gtag('event', event, params || {});
    if (Array.isArray(window.dataLayer)) window.dataLayer.push(Object.assign({ event: event }, params || {}));
  }

  $$('a[href^="tel:"]').forEach(function (a) {
    on(a, 'click', function () { track('click_to_call', { link_location: a.dataset.loc || 'page' }); });
  });
  $$('a[href^="sms:"]').forEach(function (a) {
    on(a, 'click', function () { track('click_to_text', { link_location: a.dataset.loc || 'page' }); });
  });

  /* ---------- Prefill the service dropdown from a service page ---------- */
  var pageService = doc.body.getAttribute('data-service');
  if (pageService) {
    $$('select[name="service"]').forEach(function (select) {
      var match = Array.prototype.some.call(select.options, function (o) { return o.value === pageService; });
      if (match && !select.value) select.value = pageService;
    });
  }

  /* ---------- Current year in the footer ---------- */
  $$('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();
