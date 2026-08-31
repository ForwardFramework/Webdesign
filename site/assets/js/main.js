/* Top Gun Roofing — site behaviour
   No dependencies. Deferred. Progressive enhancement only:
   every page works with JavaScript disabled. */
(function () {
  'use strict';

  /* ---------- Mobile navigation ---------- */
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('primary-nav');

  function closeNav() {
    if (!toggle || !nav) return;
    toggle.setAttribute('aria-expanded', 'false');
    nav.setAttribute('data-open', 'false');
  }

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      nav.setAttribute('data-open', String(!open));
    });
  }

  /* ---------- Dropdown submenus (click + keyboard) ---------- */
  var subToggles = Array.prototype.slice.call(document.querySelectorAll('.has-sub > button'));

  function closeAllSubmenus(except) {
    subToggles.forEach(function (btn) {
      if (btn === except) return;
      btn.setAttribute('aria-expanded', 'false');
      var menu = document.getElementById(btn.getAttribute('aria-controls'));
      if (menu) menu.setAttribute('data-open', 'false');
    });
  }

  subToggles.forEach(function (btn) {
    var menu = document.getElementById(btn.getAttribute('aria-controls'));
    if (!menu) return;

    btn.addEventListener('click', function () {
      var open = btn.getAttribute('aria-expanded') === 'true';
      closeAllSubmenus(btn);
      btn.setAttribute('aria-expanded', String(!open));
      menu.setAttribute('data-open', String(!open));
    });

    // Hover only on pointer devices with room for a dropdown
    var parent = btn.parentElement;
    if (window.matchMedia('(min-width: 1081px) and (hover: hover)').matches) {
      parent.addEventListener('mouseenter', function () {
        closeAllSubmenus(btn);
        btn.setAttribute('aria-expanded', 'true');
        menu.setAttribute('data-open', 'true');
      });
      parent.addEventListener('mouseleave', function () {
        btn.setAttribute('aria-expanded', 'false');
        menu.setAttribute('data-open', 'false');
      });
    }
  });

  document.addEventListener('click', function (e) {
    if (!e.target.closest('.has-sub')) closeAllSubmenus(null);
    if (nav && nav.getAttribute('data-open') === 'true' &&
        !e.target.closest('#primary-nav') && !e.target.closest('.nav-toggle')) {
      closeNav();
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closeAllSubmenus(null);
      closeNav();
      if (toggle) toggle.focus();
    }
  });

  /* ---------- Estimate form: inline validation ---------- */
  Array.prototype.forEach.call(document.querySelectorAll('form[data-validate]'), function (form) {
    var status = form.querySelector('.form-status');

    function fieldWrap(el) { return el.closest('.field'); }

    function validateField(el) {
      var wrap = fieldWrap(el);
      if (!wrap) return true;
      var ok = el.checkValidity();
      wrap.setAttribute('data-invalid', String(!ok));
      var err = wrap.querySelector('.field__error');
      if (err && !ok) err.textContent = el.validationMessage;
      el.setAttribute('aria-invalid', String(!ok));
      return ok;
    }

    Array.prototype.forEach.call(form.elements, function (el) {
      if (!el.name) return;
      el.addEventListener('blur', function () { validateField(el); });
      el.addEventListener('input', function () {
        var wrap = fieldWrap(el);
        if (wrap && wrap.getAttribute('data-invalid') === 'true') validateField(el);
      });
    });

    form.addEventListener('submit', function (e) {
      var firstBad = null;
      Array.prototype.forEach.call(form.elements, function (el) {
        if (!el.name) return;
        if (!validateField(el) && !firstBad) firstBad = el;
      });

      if (firstBad) {
        e.preventDefault();
        if (status) {
          status.setAttribute('data-type', 'error');
          status.textContent = 'Please check the highlighted fields and try again.';
        }
        firstBad.focus();
        return;
      }

      if (status) {
        status.setAttribute('data-type', 'success');
        status.textContent = 'Sending your request…';
      }
      var submit = form.querySelector('[type="submit"]');
      if (submit) {
        submit.disabled = true;
        submit.textContent = 'Sending…';
      }
      // The form posts to the configured handler (see contact.html comments).
    });
  });

  /* ---------- Capture the referring page for the estimate form ---------- */
  var srcField = document.querySelector('input[name="page_source"]');
  if (srcField) srcField.value = document.title + ' — ' + window.location.pathname;

  /* ---------- Mark the current nav item ---------- */
  var here = window.location.pathname.replace(/index\.html$/, '').replace(/\/$/, '') || '/';
  Array.prototype.forEach.call(document.querySelectorAll('#primary-nav a[href]'), function (a) {
    var path = a.getAttribute('href');
    if (!path || path.charAt(0) === '#' || /^https?:/.test(path)) return;
    var norm = new URL(path, window.location.href).pathname
      .replace(/index\.html$/, '').replace(/\/$/, '') || '/';
    if (norm === here) a.setAttribute('aria-current', 'page');
  });
})();
