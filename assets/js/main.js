/* Coastal Custom Carts — site behaviours
   Vanilla JS, no dependencies, no build step. */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------------------------------------------------- header */
  var header = document.querySelector('.header');
  if (header) {
    var onScroll = function () {
      header.classList.toggle('is-stuck', window.scrollY > 8);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ------------------------------------------------------------ mobile nav */
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('primary-nav');

  function closeNav() {
    if (!toggle || !nav) return;
    toggle.setAttribute('aria-expanded', 'false');
    nav.classList.remove('is-open');
    document.body.classList.remove('nav-open');
  }

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      nav.classList.toggle('is-open', !open);
      document.body.classList.toggle('nav-open', !open);
    });

    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) closeNav();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        closeNav();
        toggle.focus();
      }
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth >= 1024) closeNav();
    });
  }

  /* --------------------------------------------------------- scroll reveal */
  var revealables = document.querySelectorAll('.reveal');
  if (revealables.length) {
    if (reduceMotion || !('IntersectionObserver' in window)) {
      revealables.forEach(function (el) { el.classList.add('is-visible'); });
    } else {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var el = entry.target;
          var delay = parseInt(el.getAttribute('data-reveal-delay') || '0', 10);
          window.setTimeout(function () { el.classList.add('is-visible'); }, delay);
          observer.unobserve(el);
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

      revealables.forEach(function (el) { observer.observe(el); });
    }
  }

  /* -------------------------------------------- date inputs: no past dates */
  var today = new Date();
  var iso = today.toISOString().split('T')[0];
  document.querySelectorAll('input[type="date"]').forEach(function (input) {
    if (!input.min) input.min = iso;
  });

  /* Keep return date at or after the delivery date */
  document.querySelectorAll('form').forEach(function (form) {
    var start = form.querySelector('[name="delivery_date"]');
    var end = form.querySelector('[name="pickup_date"]');
    if (!start || !end) return;
    start.addEventListener('change', function () {
      end.min = start.value || iso;
      if (end.value && end.value < start.value) end.value = start.value;
    });
  });

  /* ------------------------------------------------------ booking requests */
  /* The forms post to the endpoint named in each form's `action`. Until a real
     endpoint is wired up (Netlify Forms, Formspree, etc.) we intercept the
     submit, validate, and show a confirmation that points people at the phone
     number — so no enquiry is ever silently lost. */
  document.querySelectorAll('[data-booking-form]').forEach(function (form) {
    var status = form.querySelector('.form-status');

    form.addEventListener('submit', function (e) {
      if (!form.checkValidity()) return; // let the browser show its messages

      var endpoint = form.getAttribute('action');
      var isPlaceholder = !endpoint || endpoint.indexOf('REPLACE_WITH') !== -1;
      if (!isPlaceholder) return; // a real endpoint is configured — submit normally

      e.preventDefault();
      if (!status) return;

      var name = (form.querySelector('[name="name"]') || {}).value || '';
      var first = name.trim().split(/\s+/)[0];

      status.hidden = false;
      status.textContent = (first ? 'Thanks, ' + first + '! ' : 'Thanks! ') +
        'Your request is ready to send — this form still needs its delivery ' +
        'endpoint connected. To lock in your dates right now, call or text ' +
        '941-312-1494.';
      status.setAttribute('role', 'status');
      status.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
    });
  });

  /* -------------------------------------------------------- photo fallback */
  /* Each photo sits on top of an SVG illustration. If the image file hasn't
     been added yet (or fails to load) we remove it and the illustration shows. */
  document.querySelectorAll('img[data-photo]').forEach(function (img) {
    var drop = function () { if (img.parentNode) img.parentNode.removeChild(img); };
    img.addEventListener('error', drop);
    if (img.complete && img.naturalWidth === 0) drop();

    /* The hero photo also switches its gradient from background to scrim, so
       the headline keeps its contrast either way. */
    if (img.classList.contains('hero__photo')) {
      var hero = img.closest('.hero');
      var mark = function () { if (hero && img.naturalWidth > 0) hero.classList.add('has-photo'); };
      img.addEventListener('load', mark);
      if (img.complete) mark();
    }
  });

  /* ------------------------------------------------- current page in nav */
  var here = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  document.querySelectorAll('.nav__link').forEach(function (link) {
    var href = link.getAttribute('href') || '';
    if (href.indexOf('#') !== -1) return;       // in-page section links aren't "the current page"
    if (href.toLowerCase() === here) link.setAttribute('aria-current', 'page');
  });

  /* --------------------------------------------------------- current year */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });
}());
