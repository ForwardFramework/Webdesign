/* ==========================================================================
   Buckle & Bloom — landing page behaviour
   Everything you need to personalise lives in CONFIG below.
   ========================================================================== */
(function () {
  'use strict';

  var CONFIG = {
    /* Business contact details. Change these two and every phone/email link,
       plus the booking form's destination, updates across the page. */
    phoneDisplay: '(000) 000-0000',
    phoneHref: '+10000000000',
    email: 'hello@buckleandbloom.com',

    /* Optional: paste a form endpoint (Formspree, Netlify Forms, Basin, etc.).
       Leave empty and the form opens a pre-filled email instead — no backend
       required, works on any static host. */
    formEndpoint: ''
  };

  /* ---------------------------------------------------------------- contact */
  function applyContactDetails() {
    document.querySelectorAll('[data-contact="phone"]').forEach(function (el) {
      el.setAttribute('href', 'tel:' + CONFIG.phoneHref);
      if (el.textContent.trim().indexOf('(') === 0) el.textContent = CONFIG.phoneDisplay;
    });
    document.querySelectorAll('[data-contact="email"]').forEach(function (el) {
      el.setAttribute('href', 'mailto:' + CONFIG.email);
      if (el.textContent.indexOf('@') > -1) el.textContent = CONFIG.email;
    });
  }

  /* ------------------------------------------------------------- navigation */
  function initNav() {
    var toggle = document.querySelector('.nav-toggle');
    var nav = document.getElementById('primary-nav');
    if (!toggle || !nav) return;

    function close() {
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    }

    toggle.addEventListener('click', function () {
      var open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      nav.classList.toggle('is-open', !open);
    });

    nav.addEventListener('click', function (event) {
      if (event.target.closest('a')) close();
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && nav.classList.contains('is-open')) {
        close();
        toggle.focus();
      }
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 900) close();
    });
  }

  /* ---------------------------------------------------------- sticky header */
  function initStickyHeader() {
    var header = document.querySelector('.site-header');
    if (!header) return;
    var ticking = false;

    function update() {
      header.classList.toggle('is-stuck', window.scrollY > 8);
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(update);
      }
    }, { passive: true });
    update();
  }

  /* --------------------------------------------------------- scroll reveals */
  function initReveals() {
    var items = document.querySelectorAll('.reveal');
    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduced || !('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });

    items.forEach(function (el, index) {
      el.style.transitionDelay = Math.min(index % 4, 3) * 70 + 'ms';
      observer.observe(el);
    });
  }

  /* ------------------------------------------------------------------- form */
  var RULES = {
    name:    { message: 'Please tell us your name.', test: function (v) { return v.length > 1; } },
    phone:   { message: 'A phone number helps us confirm your pickup.',
               test: function (v) { return v.replace(/\D/g, '').length >= 10; } },
    email:   { message: 'Please enter a valid email address.',
               test: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v); } },
    area:    { message: 'Which city or ZIP are we coming to?', test: function (v) { return v.length > 1; } },
    service: { message: 'Pick the service you need.', test: function (v) { return v !== ''; } }
  };

  function setError(field, message) {
    var input = document.getElementById('f-' + field);
    var slot = document.getElementById('e-' + field);
    if (!input) return;
    if (message) {
      input.setAttribute('aria-invalid', 'true');
      if (slot) { slot.textContent = message; input.setAttribute('aria-describedby', slot.id); }
    } else {
      input.removeAttribute('aria-invalid');
      if (slot) slot.textContent = '';
    }
  }

  function initForm() {
    var form = document.getElementById('booking-form');
    if (!form) return;
    var status = document.getElementById('form-status');

    Object.keys(RULES).forEach(function (field) {
      var input = document.getElementById('f-' + field);
      if (!input) return;
      input.addEventListener('blur', function () {
        if (input.value.trim()) {
          setError(field, RULES[field].test(input.value.trim()) ? '' : RULES[field].message);
        }
      });
      input.addEventListener('input', function () {
        if (input.getAttribute('aria-invalid') === 'true' &&
            RULES[field].test(input.value.trim())) setError(field, '');
      });
    });

    function show(message, isError) {
      if (!status) return;
      status.hidden = false;
      status.textContent = message;
      status.style.background = isError ? '#fbe6e4' : '';
      status.style.color = isError ? '#8a2a22' : '';
    }

    form.addEventListener('submit', function (event) {
      event.preventDefault();

      var data = {};
      var firstInvalid = null;

      ['name', 'phone', 'email', 'area', 'service', 'seats', 'date', 'notes'].forEach(function (field) {
        var input = document.getElementById('f-' + field);
        data[field] = input ? input.value.trim() : '';
      });

      Object.keys(RULES).forEach(function (field) {
        var ok = RULES[field].test(data[field]);
        setError(field, ok ? '' : RULES[field].message);
        if (!ok && !firstInvalid) firstInvalid = document.getElementById('f-' + field);
      });

      if (firstInvalid) {
        show('Just a couple of fields to fix and we’ll get you booked.', true);
        firstInvalid.focus();
        return;
      }

      var lines = [
        'Name: ' + data.name,
        'Phone: ' + data.phone,
        'Email: ' + data.email,
        'City / ZIP: ' + data.area,
        'Service: ' + data.service,
        'Seats: ' + (data.seats || '1'),
        'Preferred date: ' + (data.date || 'Flexible'),
        '',
        'Notes:',
        data.notes || '(none)'
      ];

      if (CONFIG.formEndpoint) {
        show('Sending your request…');
        fetch(CONFIG.formEndpoint, {
          method: 'POST',
          headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        }).then(function (response) {
          if (!response.ok) throw new Error('Request failed');
          form.reset();
          show('Thank you! Your pickup request is in — we’ll be in touch today.');
        }).catch(function () {
          show('That didn’t go through. Please call or text ' + CONFIG.phoneDisplay + ' and we’ll get you booked.', true);
        });
        return;
      }

      /* No backend configured: open a pre-filled email. */
      var subject = 'Pickup request — ' + data.name + ' (' + (data.seats || '1') + ' seat)';
      window.location.href = 'mailto:' + CONFIG.email +
        '?subject=' + encodeURIComponent(subject) +
        '&body=' + encodeURIComponent(lines.join('\n'));
      show('Opening your email app with the details filled in. Prefer to text? ' +
           CONFIG.phoneDisplay + ' works too.');
    });
  }

  /* ------------------------------------------------------------------- init */
  function init() {
    applyContactDetails();
    initNav();
    initStickyHeader();
    initReveals();
    initForm();
    var year = document.getElementById('year');
    if (year) year.textContent = new Date().getFullYear();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
