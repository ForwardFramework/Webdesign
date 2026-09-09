/* Angel's Hand Painting LLC — site behaviour.
   No dependencies. Everything degrades gracefully with JS disabled. */
(function () {
  'use strict';

  /* ---------------------------------------------------------- mobile nav */
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('primary-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      nav.setAttribute('data-open', String(!open));
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) {
        toggle.setAttribute('aria-expanded', 'false');
        nav.setAttribute('data-open', 'false');
      }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        toggle.setAttribute('aria-expanded', 'false');
        nav.setAttribute('data-open', 'false');
        toggle.focus();
      }
    });
  }

  /* ------------------------------------------------------- header shadow */
  var header = document.querySelector('.site-header');
  if (header) {
    var onScroll = function () {
      header.classList.toggle('is-stuck', window.scrollY > 8);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ------------------------------------------------------------- reveals */
  var reveals = document.querySelectorAll('.reveal');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reveals.length && 'IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  /* --------------------------------------------------------------- year */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });

  /* --------------------------------------------------- phone formatting */
  document.querySelectorAll('input[type="tel"]').forEach(function (input) {
    input.addEventListener('input', function () {
      var d = input.value.replace(/\D/g, '').slice(0, 10);
      input.value = d.length > 6 ? '(' + d.slice(0, 3) + ') ' + d.slice(3, 6) + '-' + d.slice(6)
        : d.length > 3 ? '(' + d.slice(0, 3) + ') ' + d.slice(3)
        : d.length ? '(' + d : '';
    });
  });

  /* ------------------------------------------------------ quote form UX */
  var EMAIL = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;

  function showError(field, message) {
    var input = field.querySelector('input, select, textarea');
    var slot = field.querySelector('.err');
    if (!input) return;
    if (message) {
      input.setAttribute('aria-invalid', 'true');
      if (slot) { slot.textContent = message; slot.classList.add('show'); }
    } else {
      input.removeAttribute('aria-invalid');
      if (slot) { slot.classList.remove('show'); }
    }
  }

  function validate(form) {
    var ok = true, firstBad = null;
    form.querySelectorAll('.field').forEach(function (field) {
      var input = field.querySelector('input, select, textarea');
      if (!input || input.type === 'hidden' || input.name === 'website') return;
      var value = (input.value || '').trim();
      var msg = '';
      if (input.required && !value) {
        msg = 'Please fill this in.';
      } else if (value && input.type === 'email' && !EMAIL.test(value)) {
        msg = 'Please enter a valid email address.';
      } else if (value && input.type === 'tel' && value.replace(/\D/g, '').length < 10) {
        msg = 'Please enter a 10-digit phone number.';
      }
      showError(field, msg);
      if (msg) { ok = false; firstBad = firstBad || input; }
    });
    if (firstBad) { firstBad.focus(); }
    return ok;
  }

  document.querySelectorAll('form[data-quote-form]').forEach(function (form) {
    form.setAttribute('novalidate', 'novalidate');

    form.addEventListener('input', function (e) {
      var field = e.target.closest('.field');
      if (field && e.target.getAttribute('aria-invalid') === 'true') showError(field, '');
    });

    form.addEventListener('submit', function (e) {
      var status = form.querySelector('.form-status');
      if (!validate(form)) {
        e.preventDefault();
        if (status) {
          status.textContent = 'Please check the highlighted fields and try again.';
          status.className = 'form-status form-status--err show';
        }
        return;
      }
      if (status) status.className = 'form-status';

      var endpoint = form.getAttribute('data-endpoint');
      var button = form.querySelector('button[type="submit"]');
      if (button) { button.disabled = true; button.dataset.label = button.textContent; button.textContent = 'Sending…'; }

      // With no JSON endpoint configured the form posts normally
      // (works as-is with Netlify Forms / any form action).
      if (!endpoint) return;

      e.preventDefault();
      var payload = {};
      new FormData(form).forEach(function (v, k) { payload[k] = v; });
      fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload)
      }).then(function (res) {
        if (!res.ok) throw new Error('Request failed');
        window.location.href = form.getAttribute('data-success') || '/thank-you.html';
      }).catch(function () {
        if (button) { button.disabled = false; button.textContent = button.dataset.label || 'Send'; }
        if (status) {
          status.innerHTML = 'Sorry — that did not go through. Please call or text ' +
            '<a href="tel:+19414052750">941-405-2750</a>.';
          status.className = 'form-status form-status--err show';
        }
      });
    });
  });
})();
