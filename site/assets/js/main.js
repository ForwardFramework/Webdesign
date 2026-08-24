/* Rough Diamond Pressure Washing — site interactions
   Vanilla JS, no dependencies. Everything degrades gracefully without it. */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- sticky header + scroll progress ---------- */
  var header = document.querySelector('.header');
  var progress = document.querySelector('.progress');

  function onScroll() {
    var y = window.scrollY || document.documentElement.scrollTop;
    if (header) header.classList.toggle('is-stuck', y > 24);
    if (progress) {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = (max > 0 ? (y / max) * 100 : 0) + '%';
    }
  }
  var ticking = false;
  window.addEventListener('scroll', function () {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () { onScroll(); ticking = false; });
  }, { passive: true });
  onScroll();

  /* ---------- mobile drawer ---------- */
  var toggle = document.querySelector('.nav-toggle');
  var drawer = document.querySelector('.drawer');
  if (toggle && drawer) {
    var setDrawer = function (open) {
      toggle.setAttribute('aria-expanded', String(open));
      drawer.classList.toggle('is-open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    };
    toggle.addEventListener('click', function () {
      setDrawer(toggle.getAttribute('aria-expanded') !== 'true');
    });
    drawer.addEventListener('click', function (e) {
      if (e.target.closest('a')) setDrawer(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && drawer.classList.contains('is-open')) {
        setDrawer(false);
        toggle.focus();
      }
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > 900 && drawer.classList.contains('is-open')) setDrawer(false);
    });
  }

  /* ---------- scroll reveal ---------- */
  var revealables = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window) || reduceMotion) {
    revealables.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    revealables.forEach(function (el) { revealObserver.observe(el); });
  }

  /* ---------- animated counters ---------- */
  var counters = document.querySelectorAll('[data-count]');
  function runCounter(el) {
    var target = parseFloat(el.getAttribute('data-count'));
    var suffix = el.getAttribute('data-suffix') || '';
    var decimals = (el.getAttribute('data-count').split('.')[1] || '').length;
    if (reduceMotion) { el.textContent = target.toFixed(decimals) + suffix; return; }
    var duration = 1500, start = null;
    function tick(ts) {
      if (start === null) start = ts;
      var p = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = (target * eased).toFixed(decimals) + suffix;
      if (p < 1) window.requestAnimationFrame(tick);
    }
    window.requestAnimationFrame(tick);
  }
  if (counters.length) {
    if (!('IntersectionObserver' in window)) {
      counters.forEach(runCounter);
    } else {
      var countObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          runCounter(entry.target);
          countObserver.unobserve(entry.target);
        });
      }, { threshold: 0.5 });
      counters.forEach(function (el) { countObserver.observe(el); });
    }
  }

  /* ---------- before / after sliders ---------- */
  document.querySelectorAll('.ba').forEach(function (ba) {
    var range = ba.querySelector('.ba__range');
    var grip = ba.querySelector('.ba__grip');
    function apply(v) {
      ba.style.setProperty('--pos', v + '%');
      if (grip) grip.style.left = v + '%';
    }
    if (range) {
      apply(range.value);
      range.addEventListener('input', function () { apply(range.value); });
    }
    function dragTo(clientX) {
      var rect = ba.getBoundingClientRect();
      var v = ((clientX - rect.left) / rect.width) * 100;
      v = Math.max(0, Math.min(100, v));
      if (range) range.value = v;
      apply(v);
    }
    var dragging = false;
    ba.addEventListener('pointerdown', function (e) {
      dragging = true;
      ba.setPointerCapture(e.pointerId);
      dragTo(e.clientX);
    });
    ba.addEventListener('pointermove', function (e) { if (dragging) dragTo(e.clientX); });
    ['pointerup', 'pointercancel'].forEach(function (evt) {
      ba.addEventListener(evt, function () { dragging = false; });
    });
  });

  /* ---------- gallery lightbox ---------- */
  var lightbox = document.querySelector('.lightbox');
  if (lightbox) {
    var lbImg = lightbox.querySelector('img');
    var lbCap = lightbox.querySelector('.lightbox__cap');
    var lastFocus = null;

    var closeLb = function () {
      lightbox.classList.remove('is-open');
      document.body.style.overflow = '';
      if (lastFocus) lastFocus.focus();
    };

    document.querySelectorAll('[data-lightbox]').forEach(function (item) {
      item.addEventListener('click', function () {
        var img = item.querySelector('img');
        if (!img) return;
        lastFocus = item;
        lbImg.src = img.currentSrc || img.src;
        lbImg.alt = img.alt;
        if (lbCap) lbCap.textContent = item.getAttribute('data-lightbox') || img.alt;
        lightbox.classList.add('is-open');
        document.body.style.overflow = 'hidden';
        lightbox.querySelector('.lightbox__close').focus();
      });
      item.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); item.click(); }
      });
    });

    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox || e.target.closest('.lightbox__close')) closeLb();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && lightbox.classList.contains('is-open')) closeLb();
    });
  }

  /* ---------- quote form ---------- */
  var form = document.querySelector('[data-quote-form]');
  if (form) {
    var status = form.querySelector('.form__status');

    var validators = {
      name: function (v) { return v.trim().length >= 2 || 'Please enter your name.'; },
      phone: function (v) {
        return /^[\d\s().+-]{10,}$/.test(v.trim()) || 'Please enter a valid phone number.';
      },
      email: function (v) {
        if (!v.trim()) return true; // optional
        return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) || 'Please enter a valid email address.';
      },
      address: function (v) { return v.trim().length >= 3 || 'Please enter your city or ZIP.'; },
      service: function (v) { return !!v || 'Please choose a service.'; }
    };

    function validateField(input) {
      var rule = validators[input.name];
      if (!rule) return true;
      var result = rule(input.value);
      var field = input.closest('.field');
      var msg = field ? field.querySelector('.field__error') : null;
      var ok = result === true;
      if (field) field.classList.toggle('has-error', !ok);
      if (msg && !ok) msg.textContent = result;
      input.setAttribute('aria-invalid', String(!ok));
      return ok;
    }

    form.querySelectorAll('input, select, textarea').forEach(function (input) {
      input.addEventListener('blur', function () { validateField(input); });
      input.addEventListener('input', function () {
        var field = input.closest('.field');
        if (field && field.classList.contains('has-error')) validateField(input);
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var valid = true;
      var firstBad = null;
      form.querySelectorAll('input, select, textarea').forEach(function (input) {
        if (!validateField(input)) {
          valid = false;
          if (!firstBad) firstBad = input;
        }
      });
      if (!valid) {
        if (firstBad) firstBad.focus();
        return;
      }

      // No backend is wired up yet, so hand the request off to the
      // company inbox via the visitor's own mail client.
      var data = new FormData(form);
      var lines = [
        'Name: ' + (data.get('name') || ''),
        'Phone: ' + (data.get('phone') || ''),
        'Email: ' + (data.get('email') || 'not provided'),
        'Property / area: ' + (data.get('address') || ''),
        'Service needed: ' + (data.get('service') || ''),
        '',
        'Details:',
        (data.get('details') || 'None provided')
      ];
      var subject = 'Free quote request — ' + (data.get('service') || 'Pressure washing');
      var href = 'mailto:roughdiamondpw@gmail.com?subject=' +
        encodeURIComponent(subject) + '&body=' + encodeURIComponent(lines.join('\n'));

      if (status) {
        status.textContent =
          'Thanks! Your email app is opening with the request filled in — just hit send. ' +
          'In a hurry? Call or text 412-500-1363.';
        status.classList.add('is-visible');
        status.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
      }
      window.location.href = href;
    });
  }

  /* ---------- hide photos that fail to load ----------
     Until ./fetch-assets.sh has been run the photo files are absent. The slots
     already carry a branded gradient, so drop the broken-image icon on top of
     it rather than letting the browser draw one. */
  document.querySelectorAll('img').forEach(function (img) {
    var hide = function () { img.style.visibility = 'hidden'; };
    if (img.complete && img.naturalWidth === 0 && img.getAttribute('src')) hide();
    img.addEventListener('error', hide);
  });

  /* ---------- footer year ---------- */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
