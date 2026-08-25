/* =============================================================================
   Eclipse Aluminum & Shade — CONTACT FORM
   -----------------------------------------------------------------------------
   Validates inline, protects against bots, and posts to whichever provider is
   set in config.form. Until one is configured it runs in DEMO mode: full
   validation, real success screen, payload logged to the console — so nothing
   looks broken and no lead is silently swallowed.
   ========================================================================== */
(function () {
  'use strict';

  var CFG  = window.ECLIPSE_CONFIG;
  var FORM = CFG.form || {};

  var form, submitBtn, loadedAt = Date.now();

  /* ---------------------------------------------------------------------------
     Validation
     ------------------------------------------------------------------------ */
  var RULES = {
    'field-name': {
      required: true,
      test: function (v) { return v.trim().length >= 2; },
      message: 'Please tell us your name.'
    },
    'field-phone': {
      required: true,
      test: function (v) { return digits(v).length === 10 || (digits(v).length === 11 && digits(v)[0] === '1'); },
      message: 'Enter a 10-digit phone number so we can call you back.'
    },
    'field-email': {
      required: true,
      test: function (v) { return /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(v.trim()); },
      message: 'Enter a valid email address.'
    },
    'field-zip': {
      required: true,
      test: function (v) { return /^\d{5}$/.test(v.trim()); },
      message: 'Enter your 5-digit ZIP code so we know we cover you.'
    },
    'field-service': {
      required: true,
      test: function (v) { return !!v; },
      message: 'Pick what you’re interested in.'
    },
    'field-consent': {
      required: !!FORM.requireSmsConsent,
      test: function (v, node) { return node.checked; },
      message: 'Please tick the box so we know we may contact you.'
    }
  };

  function digits(v) { return String(v || '').replace(/\D/g, ''); }

  function validateField(node, showError) {
    var rule = RULES[node.id];
    if (!rule) return true;
    var value = node.type === 'checkbox' ? (node.checked ? 'on' : '') : node.value;
    var ok = rule.required ? rule.test(value, node) : (!value || rule.test(value, node));
    if (showError) setError(node, ok ? '' : rule.message);
    return ok;
  }

  function setError(node, message) {
    var field = node.closest('.field');
    if (!field) return;
    var slot = field.querySelector('.field__error');
    if (!slot) {
      slot = document.createElement('p');
      slot.className = 'field__error';
      slot.id = node.id + '-error';
      field.appendChild(slot);
    }
    if (message) {
      slot.textContent = message;
      field.classList.add('has-error');
      node.setAttribute('aria-invalid', 'true');
      node.setAttribute('aria-describedby', slot.id);
    } else {
      slot.textContent = '';
      field.classList.remove('has-error');
      node.removeAttribute('aria-invalid');
      node.removeAttribute('aria-describedby');
    }
  }

  function validateAll() {
    var firstBad = null;
    Object.keys(RULES).forEach(function (id) {
      var node = document.getElementById(id);
      if (!node || node.disabled || node.offsetParent === null && node.type !== 'checkbox') return;
      if (!validateField(node, true) && !firstBad) firstBad = node;
    });
    return firstBad;
  }

  /* ---------------------------------------------------------------------------
     Payload
     ------------------------------------------------------------------------ */
  function collect() {
    var data = {};
    new FormData(form).forEach(function (v, k) {
      if (k === '_gotcha' || k === '_elapsed') return;
      data[k] = typeof v === 'string' ? v.trim() : v;
    });

    data.consent = document.getElementById('field-consent')?.checked ? 'yes' : 'no';

    var saved = (window.EclipseCalc && window.EclipseCalc.getSaved()) || [];
    if (saved.length) {
      data.estimates = saved.map(function (s) {
        return {
          service: s.serviceName,
          range: window.EclipseCalc.money(s.low) + ' – ' + window.EclipseCalc.money(s.high),
          squareFeet: s.area,
          units: s.units
        };
      });
    }

    data.pageUrl   = window.location.href;
    data.referrer  = document.referrer || 'direct';
    data.submitted = new Date().toISOString();

    // Ad campaign attribution, if the visitor arrived from a tracked link.
    var params = new URLSearchParams(window.location.search);
    ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'fbclid']
      .forEach(function (k) { if (params.get(k)) data[k] = params.get(k); });

    return data;
  }

  /* ---------------------------------------------------------------------------
     Delivery
     ------------------------------------------------------------------------ */
  function send(data) {
    var provider = FORM.provider || 'demo';

    if (provider === 'demo') {
      console.group('%c[Eclipse] Contact form — DEMO mode (nothing was sent)',
                    'color:#c8952b;font-weight:600');
      console.log('This is exactly what will be delivered once you configure a provider:');
      console.log(data);
      console.info('Set config.form.provider to "formspree", "netlify", "web3forms" or "custom" ' +
                   'and add the endpoint. See docs/SETUP.md.');
      console.groupEnd();
      return Promise.resolve();
    }

    if (provider === 'mailto') {
      var body = Object.keys(data).map(function (k) {
        return k + ': ' + (typeof data[k] === 'object' ? JSON.stringify(data[k]) : data[k]);
      }).join('\n');
      window.location.href = 'mailto:' + CFG.business.email +
        '?subject=' + encodeURIComponent(FORM.subject || 'Website inquiry') +
        '&body=' + encodeURIComponent(body);
      return Promise.resolve();
    }

    if (provider === 'netlify') {
      // Netlify Forms reads a urlencoded POST back to the same page.
      var enc = new URLSearchParams();
      enc.append('form-name', form.getAttribute('name') || 'contact');
      Object.keys(data).forEach(function (k) {
        enc.append(k, typeof data[k] === 'object' ? JSON.stringify(data[k]) : data[k]);
      });
      return post('/', enc.toString(), { 'Content-Type': 'application/x-www-form-urlencoded' });
    }

    if (provider === 'web3forms') {
      return postJson('https://api.web3forms.com/submit',
        Object.assign({ access_key: FORM.endpoint, subject: FORM.subject }, data));
    }

    if (provider === 'formspree' || provider === 'custom') {
      if (!FORM.endpoint) return Promise.reject(new Error('No endpoint configured'));
      return postJson(FORM.endpoint, Object.assign({ _subject: FORM.subject }, data));
    }

    return Promise.reject(new Error('Unknown form provider: ' + provider));
  }

  function postJson(url, body) {
    return post(url, JSON.stringify(body), {
      'Content-Type': 'application/json', 'Accept': 'application/json'
    });
  }

  function post(url, body, headers) {
    return fetch(url, { method: 'POST', headers: headers, body: body }).then(function (res) {
      if (!res.ok) throw new Error('Submission failed with status ' + res.status);
      return res;
    });
  }

  /* ---------------------------------------------------------------------------
     Submit
     ------------------------------------------------------------------------ */
  function onSubmit(e) {
    e.preventDefault();

    // Honeypot: a real person never fills a hidden field.
    var pot = form.querySelector('[name="_gotcha"]');
    if (pot && pot.value) { showSuccess(); return; }

    // Time trap: a form completed in under 3 seconds is a script.
    if (Date.now() - loadedAt < 3000) { showSuccess(); return; }

    var bad = validateAll();
    if (bad) {
      bad.focus({ preventScroll: true });
      bad.scrollIntoView({ behavior: window.EclipseReduced() ? 'auto' : 'smooth', block: 'center' });
      announce('Please fix the highlighted fields.');
      return;
    }

    setBusy(true);
    send(collect())
      .then(function () {
        showSuccess();
        if (window.EclipseTrack) {
          var saved = (window.EclipseCalc && window.EclipseCalc.getSaved()) || [];
          window.EclipseTrack('form_submitted', {
            currency: 'USD',
            value: saved.length ? saved[saved.length - 1].mid : 0
          });
        }
      })
      .catch(function (err) {
        console.error('[Eclipse] Form submission failed:', err);
        setBusy(false);
        announce('');
        showFailure();
      });
  }

  function setBusy(busy) {
    if (!submitBtn) return;
    submitBtn.disabled = busy;
    submitBtn.classList.toggle('is-busy', busy);
    submitBtn.setAttribute('aria-busy', busy ? 'true' : 'false');
    var label = submitBtn.querySelector('.btn__label');
    if (label) {
      if (busy) { label.dataset.idle = label.textContent; label.textContent = 'Sending…'; }
      else if (label.dataset.idle) { label.textContent = label.dataset.idle; }
    }
  }

  function showSuccess() {
    var panel = document.getElementById('form-success');
    if (!panel) return;
    form.hidden = true;
    panel.hidden = false;
    panel.querySelector('[data-success-title]').textContent = FORM.successTitle || 'Thanks!';
    panel.querySelector('[data-success-body]').textContent  = FORM.successBody || '';
    panel.setAttribute('tabindex', '-1');
    panel.focus({ preventScroll: true });
    panel.scrollIntoView({ behavior: window.EclipseReduced() ? 'auto' : 'smooth', block: 'center' });
  }

  function showFailure() {
    var box = document.getElementById('form-failure');
    if (!box) return;
    box.hidden = false;
    box.innerHTML =
      '<strong>That didn’t go through.</strong> ' +
      'Please call us on <a href="' + CFG.business.phoneHref + '">' +
      window.EclipseEsc(CFG.business.phone) + '</a> or email ' +
      '<a href="mailto:' + CFG.business.email + '">' + window.EclipseEsc(CFG.business.email) + '</a> ' +
      'and we’ll pick it up right away.';
    box.focus && box.focus({ preventScroll: true });
  }

  function announce(msg) {
    var live = document.getElementById('form-live');
    if (live) live.textContent = msg;
  }

  /* ---------------------------------------------------------------------------
     Niceties
     ------------------------------------------------------------------------ */
  function formatPhone(node) {
    var d = digits(node.value).slice(0, 10);
    if (d.length < 4) { node.value = d; return; }
    if (d.length < 7) { node.value = '(' + d.slice(0, 3) + ') ' + d.slice(3); return; }
    node.value = '(' + d.slice(0, 3) + ') ' + d.slice(3, 6) + '-' + d.slice(6);
  }

  function init() {
    form = document.getElementById('contact-form');
    if (!form) return;
    submitBtn = form.querySelector('[type="submit"]');

    form.addEventListener('submit', onSubmit);

    // Validate on blur, then live-clear the error once it is fixed.
    Object.keys(RULES).forEach(function (id) {
      var node = document.getElementById(id);
      if (!node) return;
      node.addEventListener('blur', function () { validateField(node, true); });
      node.addEventListener('input', function () {
        if (node.closest('.field').classList.contains('has-error')) validateField(node, true);
      });
      if (node.type === 'checkbox') {
        node.addEventListener('change', function () { validateField(node, true); });
      }
    });

    var phone = document.getElementById('field-phone');
    if (phone) phone.addEventListener('input', function () { formatPhone(phone); });

    // Hide the SMS consent row entirely if it is not required.
    var consentRow = document.getElementById('consent-row');
    if (consentRow && !FORM.requireSmsConsent) consentRow.hidden = true;

    // A Netlify build needs the form name present in the static HTML; that lives
    // in index.html. Nothing to do here beyond confirming the provider is sane.
    if (FORM.provider === 'demo') {
      console.info(
        '%c[Eclipse] The contact form is in DEMO mode — submissions are logged, not delivered.',
        'color:#c8952b;font-weight:600',
        '\nOpen assets/js/config.js → form and set a provider. See docs/SETUP.md for the two-minute version.'
      );
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
