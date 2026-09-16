/* Osas Construction Group — site.js
   Vanilla, no dependencies. Progressive enhancement only: every page works with JS off. */
(function () {
  'use strict';
  var root = document.documentElement;
  root.classList.remove('no-js');
  // Only opt into reveal animations once we know the observer will run.
  if ('IntersectionObserver' in window &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    root.classList.add('js');
  }

  /* ---- Mobile navigation ---------------------------------------------- */
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('site-nav');
  var backdrop = null;

  function closeNav() {
    if (!toggle || !nav) return;
    toggle.setAttribute('aria-expanded', 'false');
    nav.setAttribute('data-open', 'false');
    document.body.style.removeProperty('overflow');
    if (backdrop) { backdrop.remove(); backdrop = null; }
  }

  function openNav() {
    toggle.setAttribute('aria-expanded', 'true');
    nav.setAttribute('data-open', 'true');
    document.body.style.overflow = 'hidden';
    backdrop = document.createElement('button');
    backdrop.className = 'nav-backdrop';
    backdrop.setAttribute('aria-label', 'Close menu');
    backdrop.addEventListener('click', closeNav);
    document.body.appendChild(backdrop);
  }

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      toggle.getAttribute('aria-expanded') === 'true' ? closeNav() : openNav();
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) closeNav();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeNav();
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > 1080) closeNav();
    });
  }

  /* ---- Scroll reveal --------------------------------------------------- */
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  var items = document.querySelectorAll('.reveal');
  if (items.length && 'IntersectionObserver' in window && !reduce.matches) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    items.forEach(function (el, i) {
      el.style.transitionDelay = (Math.min(i % 4, 3) * 60) + 'ms';
      io.observe(el);
    });
  } else {
    items.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ---- Click-to-load map (keeps third-party JS off first paint) -------- */
  var mapBtn = document.querySelector('[data-map-load]');
  if (mapBtn) {
    mapBtn.addEventListener('click', function () {
      var wrap = mapBtn.closest('.map');
      var src = wrap.getAttribute('data-map-src');
      var frame = document.createElement('iframe');
      frame.src = src;
      frame.title = 'Map of the Osas Construction Group service area around Pittsburgh, Pennsylvania';
      frame.loading = 'lazy';
      frame.referrerPolicy = 'no-referrer-when-downgrade';
      frame.setAttribute('allowfullscreen', '');
      wrap.innerHTML = '';
      wrap.appendChild(frame);
    });
  }

  /* ---- Estimate form: preselect the service from ?service= ------------- */
  var serviceField = document.getElementById('service');
  if (serviceField) {
    var wanted = new URLSearchParams(window.location.search).get('service');
    if (wanted) {
      var match = Array.prototype.find.call(serviceField.options, function (o) {
        return o.value.toLowerCase() === wanted.toLowerCase();
      });
      if (match) serviceField.value = match.value;
    }
  }

  /* ---- Footer year ----------------------------------------------------- */
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();
