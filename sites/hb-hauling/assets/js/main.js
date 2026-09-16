/* HB Hauling & Contracting — site behavior
   Vanilla JS, no dependencies. Everything degrades gracefully without it:
   the page reads and every phone/text link works with JS disabled. */
(function () {
  'use strict';

  var PHONE = '+14129928796';
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------------ mobile nav -- */
  var toggle = document.getElementById('navToggle');
  var nav = document.getElementById('primaryNav');

  function setNav(open) {
    if (!toggle || !nav) return;
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    nav.dataset.open = String(open);
  }

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      setNav(toggle.getAttribute('aria-expanded') !== 'true');
    });

    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) setNav(false);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        setNav(false);
        toggle.focus();
      }
    });

    // Reset when the menu breakpoint is left behind.
    window.matchMedia('(min-width: 861px)').addEventListener('change', function (e) {
      if (e.matches) setNav(false);
    });
  }

  /* --------------------------------------------------- sticky header -- */
  var header = document.getElementById('siteHeader');
  if (header) {
    var onScroll = function () {
      header.classList.toggle('is-stuck', window.scrollY > 12);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ------------------------------------------------ scroll reveals -- */
  var revealables = document.querySelectorAll('.reveal');
  if (!reduceMotion && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry, i) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        el.style.transitionDelay = Math.min(i * 60, 240) + 'ms';
        el.classList.add('is-visible');
        io.unobserve(el);
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.08 });

    revealables.forEach(function (el) { io.observe(el); });
  } else {
    revealables.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ------------------------------------------- active nav highlight -- */
  var sections = Array.prototype.slice.call(document.querySelectorAll('main section[id]'));
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav a[href^="#"]'));

  if (sections.length && navLinks.length && 'IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (link) {
          var match = link.getAttribute('href') === '#' + entry.target.id;
          if (match) {
            link.setAttribute('aria-current', 'true');
          } else {
            link.removeAttribute('aria-current');
          }
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });

    sections.forEach(function (section) { spy.observe(section); });
  }

  /* ------------------------------------------------------ quote form -- */
  var form = document.getElementById('quoteForm');
  var status = document.getElementById('formStatus');
  var statusMsg = document.getElementById('formStatusMsg');
  var smsLink = document.getElementById('sendSms');

  function value(id) {
    var el = document.getElementById(id);
    return el && el.value ? el.value.trim() : '';
  }

  function flagInvalid(el, message) {
    el.setAttribute('aria-invalid', 'true');
    el.focus();
    var hint = el.parentElement.querySelector('.error');
    if (!hint) {
      hint = document.createElement('span');
      hint.className = 'hint error';
      hint.style.color = '#dcdcdc';
      el.parentElement.appendChild(hint);
    }
    hint.textContent = message;
  }

  function clearInvalid(el) {
    el.removeAttribute('aria-invalid');
    var hint = el.parentElement.querySelector('.error');
    if (hint) hint.remove();
  }

  if (form) {
    ['name', 'phone'].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.addEventListener('input', function () { clearInvalid(el); });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      // Honeypot: silently accept and do nothing for bots.
      if (value('company')) return;

      var nameEl = document.getElementById('name');
      var phoneEl = document.getElementById('phone');

      if (!value('name')) return flagInvalid(nameEl, 'We need a name to put on the job.');
      if (value('phone').replace(/\D/g, '').length < 10) {
        return flagInvalid(phoneEl, 'Add a 10-digit phone number so we can call you back.');
      }

      var lines = [
        'Quote request from ' + value('name'),
        'Phone: ' + value('phone'),
        value('location') ? 'Location: ' + value('location') : '',
        'Job: ' + value('service'),
        value('details') ? 'Details: ' + value('details') : ''
      ].filter(Boolean);

      var body = lines.join('\n');

      if (smsLink) {
        // iOS wants "&body=", everything else takes "?body=".
        var isApple = /iPad|iPhone|iPod|Macintosh/.test(navigator.userAgent);
        smsLink.href = 'sms:' + PHONE + (isApple ? '&' : '?') + 'body=' + encodeURIComponent(body);
      }

      if (statusMsg) {
        statusMsg.textContent = 'Thanks, ' + value('name').split(' ')[0] +
          ' — your request is written up and ready. Tap below to send it to Isaiah, or just call and we\'ll sort it out on the phone.';
      }

      if (status) {
        status.hidden = false;
        status.focus();
        status.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
      }

      form.hidden = true;
    });
  }

  /* ------------------------------------------------------------ misc -- */
  var year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
