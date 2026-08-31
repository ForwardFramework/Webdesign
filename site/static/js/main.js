/* Acosta Pro — progressive enhancement only. Every page works with JS off. */
(function () {
  'use strict';

  /* ---- Mobile navigation ------------------------------------------------ */
  var burger = document.getElementById('burger');
  var nav = document.getElementById('nav');

  if (burger && nav) {
    burger.addEventListener('click', function () {
      var open = burger.getAttribute('aria-expanded') === 'true';
      burger.setAttribute('aria-expanded', String(!open));
      burger.setAttribute('aria-label', open ? 'Open menu' : 'Close menu');
      nav.classList.toggle('is-open', !open);
    });

    /* On mobile the parent link doubles as a submenu toggle. On desktop the
       submenu opens on hover/focus via CSS, so leave the link alone. */
    nav.querySelectorAll('.has-sub > a').forEach(function (link) {
      link.addEventListener('click', function (e) {
        if (window.matchMedia('(min-width: 981px)').matches) return;
        var li = link.parentElement;
        if (!li.classList.contains('is-open')) {
          e.preventDefault();
          nav.querySelectorAll('.has-sub.is-open').forEach(function (o) {
            if (o !== li) o.classList.remove('is-open');
          });
          li.classList.add('is-open');
        }
      });
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) {
        nav.classList.remove('is-open');
        burger.setAttribute('aria-expanded', 'false');
        burger.focus();
      }
    });
  }

  /* ---- Header elevation on scroll --------------------------------------- */
  var head = document.getElementById('siteHead');
  if (head) {
    var ticking = false;
    var onScroll = function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        head.classList.toggle('is-stuck', window.scrollY > 8);
        ticking = false;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---- Conversion tracking ---------------------------------------------
     Calls and estimate requests are the only two things this site exists to
     produce, so both are instrumented. Fires only if GA4/GTM is present. */
  function track(name, params) {
    if (typeof window.gtag === 'function') window.gtag('event', name, params || {});
    if (Array.isArray(window.dataLayer)) {
      window.dataLayer.push(Object.assign({ event: name }, params || {}));
    }
  }

  document.addEventListener('click', function (e) {
    var el = e.target.closest('[data-track]');
    if (!el) return;
    var where = el.getAttribute('data-track');
    var isCall = el.getAttribute('href') && el.getAttribute('href').indexOf('tel:') === 0;
    track(isCall ? 'phone_call_click' : 'quote_cta_click', {
      placement: where,
      page_path: window.location.pathname
    });
  });

  /* ---- Quote form ------------------------------------------------------- */
  var form = document.getElementById('quoteForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      /* Honeypot: real people never fill a hidden field. */
      var trap = form.querySelector('input[name="_gotcha"]');
      if (trap && trap.value) { e.preventDefault(); return; }

      if (!form.checkValidity()) return; /* let the browser show its messages */

      var btn = form.querySelector('button[type="submit"]');
      if (btn) {
        btn.disabled = true;
        btn.dataset.label = btn.textContent;
        btn.textContent = 'Sending…';
      }
      track('generate_lead', { form: 'quote', page_path: window.location.pathname });

      /* No endpoint configured yet: fall back to the phone rather than
         silently swallowing the lead. See CONTENT-TO-VERIFY.md. */
      if (!form.getAttribute('action')) {
        e.preventDefault();
        var msg = document.getElementById('formFallback');
        if (msg) {
          msg.hidden = false;
          msg.focus();
        }
        if (btn) { btn.disabled = false; btn.textContent = btn.dataset.label; }
      }
    });
  }

  /* ---- Only one FAQ open at a time, per group --------------------------- */
  document.querySelectorAll('.faq-list').forEach(function (list) {
    list.addEventListener('toggle', function (e) {
      var d = e.target;
      if (d.tagName !== 'DETAILS' || !d.open) return;
      list.querySelectorAll('details[open]').forEach(function (other) {
        if (other !== d) other.open = false;
      });
    }, true);
  });
})();
