/* Set 'N Concrete — progressive enhancement only.
   The page is fully usable (nav, phone links, form POST) with JS disabled. */
(function () {
  'use strict';

  var PHONE = '+14124398833';
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- Footer year ------------------------------------------------------ */
  var year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());

  /* ---- Mobile navigation ------------------------------------------------ */
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('site-nav');

  function setNav(open) {
    if (!toggle || !nav) return;
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
    nav.setAttribute('data-open', String(open));
  }

  if (toggle && nav) {
    setNav(false);
    toggle.addEventListener('click', function () {
      setNav(toggle.getAttribute('aria-expanded') !== 'true');
    });
    // Close after choosing a destination, and on Escape.
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) setNav(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        setNav(false);
        toggle.focus();
      }
    });
  }

  /* ---- Scroll reveal ---------------------------------------------------- */
  var revealables = document.querySelectorAll('.reveal');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    Array.prototype.forEach.call(revealables, function (el) { el.classList.add('is-visible'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.1 });
    Array.prototype.forEach.call(revealables, function (el, i) {
      el.style.transitionDelay = (i % 3) * 70 + 'ms';
      io.observe(el);
    });
  }

  /* ---- Estimate form ---------------------------------------------------- */
  var form = document.getElementById('estimate-form');
  if (!form) return;

  var status = document.getElementById('form-status');
  var submit = form.querySelector('button[type="submit"]');
  var endpointConfigured = form.action.indexOf('YOUR_FORM_ID') === -1;

  var RULES = {
    name: function (v) { return v.trim().length >= 2 || 'Please enter your name.'; },
    phone: function (v) {
      return (v.replace(/\D/g, '').length >= 10) || 'Please enter a 10-digit phone number.';
    },
    email: function (v) {
      if (!v.trim()) return true; // optional
      return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) || 'Please check the email address.';
    },
    service: function (v) { return !!v || 'Please choose the service you need.'; }
  };

  function showError(field, message) {
    var box = document.getElementById(field.id + '-error');
    var ok = message === true;
    field.setAttribute('aria-invalid', ok ? 'false' : 'true');
    if (box) box.textContent = ok ? '' : message;
    return ok;
  }

  function validateField(field) {
    var rule = RULES[field.id];
    return rule ? showError(field, rule(field.value)) : true;
  }

  Object.keys(RULES).forEach(function (id) {
    var field = document.getElementById(id);
    if (!field) return;
    // Validate on blur, then live-correct once the field has been flagged.
    field.addEventListener('blur', function () { validateField(field); });
    field.addEventListener('input', function () {
      if (field.getAttribute('aria-invalid') === 'true') validateField(field);
    });
  });

  /* Fallback while no form endpoint is configured: hand the lead to the phone's
     messaging app pre-filled, so an enquiry is never silently dropped. */
  function textFallback(data) {
    var body = [
      'Free estimate request',
      'Name: ' + data.name,
      'Phone: ' + data.phone,
      data.email ? 'Email: ' + data.email : '',
      data.zip ? 'Town/ZIP: ' + data.zip : '',
      'Service: ' + data.service,
      data.details ? 'Details: ' + data.details : ''
    ].filter(Boolean).join('\n');

    var sep = /iPhone|iPad|Macintosh/.test(navigator.userAgent) ? '&' : '?';
    window.location.href = 'sms:' + PHONE + sep + 'body=' + encodeURIComponent(body);
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var fields = Object.keys(RULES).map(function (id) { return document.getElementById(id); });
    var invalid = fields.filter(function (f) { return f && !validateField(f); });

    if (invalid.length) {
      status.textContent = 'Please fix the highlighted fields.';
      invalid[0].focus();
      return;
    }

    // Honeypot: a filled "company" field means a bot. Fail quietly.
    if (form.company && form.company.value) return;

    var data = {};
    new FormData(form).forEach(function (v, k) { data[k] = v; });

    if (!endpointConfigured) {
      status.textContent = 'Opening a text message to 412-439-8833…';
      textFallback(data);
      return;
    }

    submit.disabled = true;
    status.textContent = 'Sending…';

    fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { Accept: 'application/json' }
    }).then(function (res) {
      if (!res.ok) throw new Error('Request failed');
      form.reset();
      status.textContent = 'Thanks — we got it. We will call or text you back shortly.';
    }).catch(function () {
      status.textContent = 'That did not send. Please call or text 412-439-8833 instead.';
    }).then(function () {
      submit.disabled = false;
    });
  });
})();
