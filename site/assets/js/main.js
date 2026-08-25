/* Kotouch Equipment Services — site behaviour.
   No dependencies. Every enhancement degrades gracefully without JS. */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* ---- Mobile navigation ------------------------------------------------ */
  function initNav() {
    var toggle = document.querySelector('.nav__toggle');
    var menu = document.getElementById('nav-menu');
    if (!toggle || !menu) return;

    function setOpen(open) {
      toggle.setAttribute('aria-expanded', String(open));
      menu.classList.toggle('is-open', open);
    }

    toggle.addEventListener('click', function () {
      setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });

    // Close on link tap, Escape, or resize back to desktop.
    menu.addEventListener('click', function (e) {
      if (e.target.closest('a')) setOpen(false);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        setOpen(false);
        toggle.focus();
      }
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 900) setOpen(false);
    });
  }

  /* ---- Header shadow on scroll ------------------------------------------ */
  function initHeader() {
    var header = document.querySelector('.site-header');
    if (!header) return;
    var ticking = false;

    function update() {
      header.classList.toggle('is-stuck', window.scrollY > 8);
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; window.requestAnimationFrame(update); }
    }, { passive: true });
    update();
  }

  /* ---- Scroll reveal ----------------------------------------------------- */
  function initReveal() {
    var items = document.querySelectorAll('.reveal');
    if (!items.length) return;

    // Without IO support or with reduced motion, show everything immediately.
    if (!('IntersectionObserver' in window) || reduceMotion.matches) {
      items.forEach(function (el) { el.classList.add('is-in'); });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var delay = Math.min(Number(el.dataset.revealDelay || 0), 400);
        window.setTimeout(function () { el.classList.add('is-in'); }, delay);
        io.unobserve(el);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });

    items.forEach(function (el, i) {
      // Stagger siblings within the same grid for a gentle wave.
      if (!el.dataset.revealDelay) el.dataset.revealDelay = String((i % 4) * 70);
      io.observe(el);
    });
  }

  /* ---- Quote form -------------------------------------------------------- */
  /* Static hosting has no server, so a validated submission is handed to the
     visitor's mail client. Swap FORM_ENDPOINT in for a POST handler (Formspree,
     Netlify Forms, etc.) to collect submissions server-side instead. */
  var FORM_ENDPOINT = '';
  var CONTACT_EMAIL = 'stephenkotouch222@gmail.com';

  function initForm() {
    var form = document.getElementById('quote-form');
    if (!form) return;
    var status = document.getElementById('form-status');

    function fieldOf(input) { return input.closest('.field'); }

    function validate(input) {
      var wrap = fieldOf(input);
      if (!wrap) return true;
      var ok = input.checkValidity();
      wrap.classList.toggle('has-error', !ok);
      var err = wrap.querySelector('.error');
      if (err && !ok) err.textContent = input.validationMessage;
      return ok;
    }

    form.querySelectorAll('input, select, textarea').forEach(function (input) {
      input.addEventListener('blur', function () { validate(input); });
      input.addEventListener('input', function () {
        var wrap = fieldOf(input);
        if (wrap && wrap.classList.contains('has-error')) validate(input);
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      // Honeypot: a filled hidden field means a bot. Fail silently.
      if (form.elements.company && form.elements.company.value) return;

      var invalid = null;
      form.querySelectorAll('input, select, textarea').forEach(function (input) {
        if (input.type === 'hidden' || input.name === 'company') return;
        if (!validate(input) && !invalid) invalid = input;
      });
      if (invalid) { invalid.focus(); return; }

      var data = new FormData(form);
      var get = function (k) { return (data.get(k) || '').toString().trim(); };

      if (FORM_ENDPOINT) {
        form.setAttribute('action', FORM_ENDPOINT);
        form.setAttribute('method', 'POST');
        form.submit();
        return;
      }

      var lines = [
        'Name: ' + get('name'),
        'Phone: ' + get('phone'),
        'Email: ' + get('email'),
        'Location: ' + get('location'),
        'Service needed: ' + get('service'),
        'Equipment: ' + get('equipment'),
        'Urgency: ' + get('urgency'),
        '',
        'Details:',
        get('details')
      ];

      var subject = 'Service request — ' + (get('service') || 'Equipment repair') +
                    (get('urgency') === 'Emergency — down now' ? ' (EMERGENCY)' : '');

      window.location.href = 'mailto:' + CONTACT_EMAIL +
        '?subject=' + encodeURIComponent(subject) +
        '&body=' + encodeURIComponent(lines.join('\n'));

      if (status) {
        status.textContent = 'Your email app should now be open with the request filled in — ' +
          'press send to deliver it. Down right now? Call 724-531-7457 instead.';
        status.classList.add('is-visible');
      }
    });
  }

  /* ---- Footer year ------------------------------------------------------- */
  function initYear() {
    document.querySelectorAll('[data-year]').forEach(function (el) {
      el.textContent = String(new Date().getFullYear());
    });
  }

  function init() {
    initNav();
    initHeader();
    initReveal();
    initForm();
    initYear();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
