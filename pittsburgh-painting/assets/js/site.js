/* =============================================================================
   Pittsburgh Painting & Property Solutions — site behaviour
   Vanilla JS, no dependencies. Loaded with `defer`.
   Every animation here is transform/opacity only and respects reduced motion.
   ========================================================================== */
(function () {
  'use strict';

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* --- analytics ---------------------------------------------------------
     Safe no-op until GA4 / Ads / Meta are wired up. See README §Tracking.  */
  function track(name, params) {
    try {
      if (typeof window.gtag === 'function') window.gtag('event', name, params || {});
      (window.dataLayer = window.dataLayer || []).push(
        Object.assign({ event: name }, params || {})
      );
    } catch (e) { /* never let tracking break the page */ }
  }
  window.ppsTrack = track;

  $$('a[href^="tel:"]').forEach(function (a) {
    a.addEventListener('click', function () {
      track('call_click', { location: a.dataset.loc || 'page' });
    });
  });
  $$('a[href^="sms:"]').forEach(function (a) {
    a.addEventListener('click', function () { track('text_click', {}); });
  });

  /* --- 1. header: condense on scroll ------------------------------------- */
  var header = $('.site-header');
  var mobileBar = $('.mobile-bar');
  if (header || mobileBar) {
    var ticking = false;
    var onScroll = function () {
      var y = window.scrollY || window.pageYOffset;
      if (header) header.classList.toggle('is-stuck', y > 40);
      if (mobileBar) mobileBar.classList.toggle('is-on', y > 380);
      ticking = false;
    };
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; window.requestAnimationFrame(onScroll); }
    }, { passive: true });
    onScroll();
  }

  /* --- 2. mobile navigation ---------------------------------------------- */
  var burger = $('.burger');
  var mnav   = $('.mnav');
  var scrim  = $('.scrim');
  if (burger && mnav) {
    var lastFocus = null;
    var setNav = function (open) {
      burger.setAttribute('aria-expanded', String(open));
      mnav.dataset.open = String(open);
      if (scrim) scrim.dataset.open = String(open);
      document.body.style.overflow = open ? 'hidden' : '';
      if (open) {
        lastFocus = document.activeElement;
        var first = mnav.querySelector('a,button');
        if (first) first.focus();
      } else if (lastFocus) {
        lastFocus.focus();
      }
    };
    burger.addEventListener('click', function () {
      setNav(burger.getAttribute('aria-expanded') !== 'true');
    });
    if (scrim) scrim.addEventListener('click', function () { setNav(false); });
    $$('.mnav a').forEach(function (a) {
      a.addEventListener('click', function () { setNav(false); });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape' || mnav.dataset.open !== 'true') return;
      setNav(false);
    });
    // focus trap
    mnav.addEventListener('keydown', function (e) {
      if (e.key !== 'Tab') return;
      var f = $$('a[href],button:not([disabled])', mnav);
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
  }

  /* --- 3. desktop dropdown ------------------------------------------------ */
  $$('.has-menu').forEach(function (wrap) {
    var btn = $('button', wrap);
    if (!btn) return;
    var close = function () { wrap.dataset.open = 'false'; btn.setAttribute('aria-expanded', 'false'); };
    var open  = function () { wrap.dataset.open = 'true';  btn.setAttribute('aria-expanded', 'true'); };
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      wrap.dataset.open === 'true' ? close() : open();
    });
    wrap.addEventListener('mouseenter', open);
    wrap.addEventListener('mouseleave', close);
    wrap.addEventListener('focusout', function (e) {
      if (!wrap.contains(e.relatedTarget)) close();
    });
    document.addEventListener('click', close);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
  });

  /* --- 4. scroll reveal (+ staggered groups) ------------------------------ */
  var revealables = $$('[data-reveal]');
  if (revealables.length) {
    if (reduce || !('IntersectionObserver' in window)) {
      revealables.forEach(function (el) { el.classList.add('is-in'); });
    } else {
      var io = new IntersectionObserver(function (entries, obs) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var el = entry.target;
          var delay = parseInt(el.dataset.delay || '0', 10);
          if (delay) el.style.transitionDelay = delay + 'ms';
          el.classList.add('is-in');
          obs.unobserve(el);
        });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
      revealables.forEach(function (el) { io.observe(el); });
    }
    // auto-stagger direct children of [data-stagger]
    $$('[data-stagger]').forEach(function (group) {
      var step = parseInt(group.dataset.stagger || '70', 10);
      $$(':scope > [data-reveal]', group).forEach(function (child, i) {
        if (!child.dataset.delay) child.dataset.delay = String(i * step);
      });
    });
  }

  /* --- 5. stat count-up --------------------------------------------------- */
  var counters = $$('[data-count]');
  if (counters.length) {
    // The final figure is already in the HTML so it reads correctly with JS off.
    // We only zero it out at the moment we're about to animate.
    var run = function (el) {
      var target = parseFloat(el.dataset.count);
      var dec = (el.dataset.count.split('.')[1] || '').length;
      if (reduce) { el.textContent = target.toFixed(dec); return; }
      el.textContent = (0).toFixed(dec);
      var dur = 1200, t0 = null;
      var tick = function (ts) {
        if (t0 === null) t0 = ts;
        var p = Math.min((ts - t0) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = (target * eased).toFixed(dec);
        if (p < 1) window.requestAnimationFrame(tick);
        else el.textContent = target.toFixed(dec);
      };
      window.requestAnimationFrame(tick);
    };
    if (!('IntersectionObserver' in window)) counters.forEach(run);
    else {
      var cio = new IntersectionObserver(function (es, obs) {
        es.forEach(function (e) { if (e.isIntersecting) { run(e.target); obs.unobserve(e.target); } });
      }, { threshold: 0.5 });
      counters.forEach(function (el) { cio.observe(el); });
    }
  }

  /* --- 6. before / after sliders ------------------------------------------ */
  $$('.ba').forEach(function (ba) {
    var dragging = false;
    var set = function (pct) {
      pct = Math.max(0, Math.min(100, pct));
      ba.style.setProperty('--pos', pct + '%');
      ba.setAttribute('aria-valuenow', Math.round(pct));
    };
    var fromEvent = function (e) {
      var r = ba.getBoundingClientRect();
      var x = (e.touches ? e.touches[0].clientX : e.clientX) - r.left;
      set((x / r.width) * 100);
    };
    var start = function (e) { dragging = true; ba.setPointerCapture && e.pointerId != null && ba.setPointerCapture(e.pointerId); fromEvent(e); };
    var move  = function (e) { if (dragging) fromEvent(e); };
    var end   = function () { dragging = false; };

    ba.addEventListener('pointerdown', start);
    ba.addEventListener('pointermove', move);
    window.addEventListener('pointerup', end);
    ba.addEventListener('pointercancel', end);

    ba.setAttribute('role', 'slider');
    ba.setAttribute('tabindex', '0');
    ba.setAttribute('aria-valuemin', '0');
    ba.setAttribute('aria-valuemax', '100');
    ba.setAttribute('aria-label', ba.dataset.label || 'Before and after comparison. Use arrow keys to reveal.');
    ba.addEventListener('keydown', function (e) {
      var cur = parseFloat(getComputedStyle(ba).getPropertyValue('--pos')) || 50;
      var step = e.shiftKey ? 10 : 4;
      if (e.key === 'ArrowLeft')  { set(cur - step); e.preventDefault(); }
      if (e.key === 'ArrowRight') { set(cur + step); e.preventDefault(); }
      if (e.key === 'Home')       { set(0);  e.preventDefault(); }
      if (e.key === 'End')        { set(100); e.preventDefault(); }
    });
    set(50);
  });

  /* --- 7. FAQ accordions --------------------------------------------------- */
  $$('.faq-q').forEach(function (q) {
    q.addEventListener('click', function () {
      var open = q.getAttribute('aria-expanded') === 'true';
      var group = q.closest('.faq');
      if (group && group.dataset.single !== 'false') {
        $$('.faq-q[aria-expanded="true"]', group).forEach(function (o) {
          if (o !== q) o.setAttribute('aria-expanded', 'false');
        });
      }
      q.setAttribute('aria-expanded', String(!open));
    });
  });

  /* --- 8. gallery filter --------------------------------------------------- */
  var filterBar = $('.filters');
  if (filterBar) {
    filterBar.addEventListener('click', function (e) {
      var btn = e.target.closest('button[data-filter]');
      if (!btn) return;
      var want = btn.dataset.filter;
      $$('button', filterBar).forEach(function (b) {
        b.setAttribute('aria-pressed', String(b === btn));
      });
      $$('.gal-item').forEach(function (item) {
        item.hidden = !(want === 'all' || item.dataset.cat === want);
      });
      track('gallery_filter', { filter: want });
    });
  }

  /* --- 9. multi-step estimate form ---------------------------------------- */
  var form = $('[data-multistep]');
  if (form) {
    var steps = $$('.fstep', form);
    var bar   = $('.prog-bar i', form);
    var num   = $('[data-step-num]', form);
    var idx   = 0;

    var show = function (n) {
      steps[idx].classList.remove('is-on');
      idx = n;
      steps[idx].classList.add('is-on');
      if (bar) bar.style.width = (((idx + 1) / steps.length) * 100) + '%';
      if (num) num.textContent = 'Step ' + (idx + 1) + ' of ' + steps.length;
      var h = $('h3', steps[idx]);
      if (h) { h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); }
      var top = form.getBoundingClientRect().top + window.scrollY - 110;
      window.scrollTo({ top: top, behavior: reduce ? 'auto' : 'smooth' });
      track(idx === 0 ? 'estimate_start' : 'estimate_step_' + (idx + 1), {});
    };

    var validate = function (step) {
      var ok = true;
      $$('.field', step).forEach(function (field) {
        var input = $('input[required],select[required],textarea[required]', field);
        if (!input) return;
        var bad = !input.value.trim() ||
                  (input.type === 'tel'   && input.value.replace(/\D/g, '').length < 10) ||
                  (input.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(input.value));
        field.classList.toggle('is-bad', bad);
        if (bad && ok) { input.focus(); ok = false; }
      });
      var radios = $$('input[type="radio"][required]', step);
      if (radios.length) {
        var name = radios[0].name;
        var picked = form.querySelector('input[name="' + name + '"]:checked');
        var box = radios[0].closest('.field') || radios[0].closest('.tiles');
        if (box) box.classList.toggle('is-bad', !picked);
        if (!picked) ok = false;
      }
      return ok;
    };

    form.addEventListener('click', function (e) {
      var next = e.target.closest('[data-next]');
      var prev = e.target.closest('[data-prev]');
      if (next) { e.preventDefault(); if (validate(steps[idx])) show(Math.min(idx + 1, steps.length - 1)); }
      if (prev) { e.preventDefault(); show(Math.max(idx - 1, 0)); }
    });

    // picking a tile advances the step — one tap, no "next" hunt
    $$('.tile input[type="radio"]', form).forEach(function (r) {
      r.addEventListener('change', function () {
        var box = r.closest('.tiles');
        if (box) box.classList.remove('is-bad');
        if (r.dataset.advance === 'true' && idx < steps.length - 1) {
          window.setTimeout(function () { show(idx + 1); }, 220);
        }
      });
    });

    // clear the error state as soon as the visitor starts fixing it
    form.addEventListener('input', function (e) {
      var f = e.target.closest('.field');
      if (f) f.classList.remove('is-bad');
    });

    form.addEventListener('submit', function (e) {
      if (!validate(steps[idx])) { e.preventDefault(); return; }
      var btn = $('[type="submit"]', form);
      if (btn) { btn.disabled = true; btn.textContent = 'Sending…'; }
      track('estimate_submit', {
        project: (form.querySelector('input[name="project"]:checked') || {}).value || '',
        timeline: (form.querySelector('[name="timeline"]') || {}).value || ''
      });
      // No endpoint configured yet → keep the visitor on-page instead of
      // firing them at a dead action URL. See README §Wiring up the form.
      if (!form.getAttribute('action')) {
        e.preventDefault();
        var done = $('[data-form-success]');
        if (done) {
          form.hidden = true;
          done.hidden = false;
          done.setAttribute('tabindex', '-1');
          done.focus();
        }
      }
    });

    if (bar) bar.style.width = (100 / steps.length) + '%';
    if (num) num.textContent = 'Step 1 of ' + steps.length;
  }

  /* --- 10. simple (single-step) forms ------------------------------------- */
  $$('form[data-simple]').forEach(function (f) {
    f.addEventListener('submit', function (e) {
      var ok = true;
      $$('.field', f).forEach(function (field) {
        var input = $('[required]', field);
        if (!input) return;
        var bad = !input.value.trim() ||
                  (input.type === 'tel'   && input.value.replace(/\D/g, '').length < 10) ||
                  (input.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(input.value));
        field.classList.toggle('is-bad', bad);
        if (bad && ok) { input.focus(); ok = false; }
      });
      if (!ok) { e.preventDefault(); return; }
      track(f.dataset.simple || 'form_submit', {});
      if (!f.getAttribute('action')) {
        e.preventDefault();
        var done = f.parentElement.querySelector('[data-form-success]');
        if (done) { f.hidden = true; done.hidden = false; }
      }
    });
    f.addEventListener('input', function (e) {
      var field = e.target.closest('.field');
      if (field) field.classList.remove('is-bad');
    });
  });

  /* --- 11. phone input mask ------------------------------------------------ */
  $$('input[type="tel"]').forEach(function (el) {
    el.addEventListener('input', function () {
      var d = el.value.replace(/\D/g, '').slice(0, 10);
      el.value = d.length > 6 ? '(' + d.slice(0, 3) + ') ' + d.slice(3, 6) + '-' + d.slice(6)
               : d.length > 3 ? '(' + d.slice(0, 3) + ') ' + d.slice(3)
               : d.length     ? '(' + d
               : '';
    });
  });

  /* --- 12. year stamp ------------------------------------------------------ */
  $$('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();
