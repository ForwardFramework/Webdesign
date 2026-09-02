/* Roughneck Roofing — site behaviour. No dependencies. */
(function () {
  'use strict';
  var cfg = window.RR_CONFIG || {};
  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---------- Sticky header shadow ---------- */
  var header = $('.site-header');
  if (header) {
    var onScroll = function () { header.classList.toggle('is-stuck', window.scrollY > 8); };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------- Mobile drawer ---------- */
  var burger = $('.burger'), drawer = $('.drawer'), scrim = $('.scrim');
  function setNav(open) {
    if (!drawer) return;
    drawer.classList.toggle('is-open', open);
    if (scrim) scrim.classList.toggle('is-open', open);
    document.body.classList.toggle('nav-open', open);
    if (burger) burger.setAttribute('aria-expanded', String(open));
    drawer.setAttribute('aria-hidden', String(!open));
    if (open) { var f = drawer.querySelector('a,button'); if (f) f.focus(); }
    else if (burger) burger.focus();
  }
  if (burger) burger.addEventListener('click', function () { setNav(!drawer.classList.contains('is-open')); });
  if (scrim) scrim.addEventListener('click', function () { setNav(false); });
  $$('.drawer a').forEach(function (a) { a.addEventListener('click', function () { setNav(false); }); });
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    if (drawer && drawer.classList.contains('is-open')) setNav(false);
    closeLightbox();
  });

  /* ---------- Reveal on scroll ---------- */
  var revealables = $$('.reveal');
  if (revealables.length) {
    if (!('IntersectionObserver' in window) ||
        window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      revealables.forEach(function (el) { el.classList.add('is-in'); });
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
        });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
      revealables.forEach(function (el) { io.observe(el); });
    }
  }

  /* ---------- Gallery: catch photos that failed before this script ran ---- */
  $$('.shot img').forEach(function (img) {
    if (img.complete && img.naturalWidth === 0 && window.RRphoto) window.RRphoto(img);
  });

  /* ---------- Lightbox ---------- */
  var lb = $('.lightbox'), lbImg = lb && $('img', lb), lbCap = lb && $('.lightbox-cap', lb), lbIndex = 0;
  function shots() { return $$('.shot:not(.shot--empty)'); }
  function openLightbox(i) {
    var list = shots(); if (!lb || !list[i]) return;
    lbIndex = i;
    var img = list[i].querySelector('img');
    lbImg.src = img.currentSrc || img.src;
    lbImg.alt = img.alt || '';
    if (lbCap) lbCap.textContent = img.alt || '';
    lb.classList.add('is-open');
    document.body.classList.add('nav-open');
    var c = $('.lightbox-close', lb); if (c) c.focus();
  }
  function closeLightbox() {
    if (!lb || !lb.classList.contains('is-open')) return;
    lb.classList.remove('is-open');
    document.body.classList.remove('nav-open');
  }
  function step(d) { var list = shots(); if (list.length) openLightbox((lbIndex + d + list.length) % list.length); }
  document.addEventListener('click', function (e) {
    var shot = e.target.closest && e.target.closest('.shot:not(.shot--empty)');
    if (shot) { e.preventDefault(); openLightbox(shots().indexOf(shot)); return; }
    if (!lb) return;
    if (e.target.closest('.lightbox-close') || e.target === lb) closeLightbox();
    if (e.target.closest('.lightbox-nav.prev')) step(-1);
    if (e.target.closest('.lightbox-nav.next')) step(1);
  });
  document.addEventListener('keydown', function (e) {
    if (!lb || !lb.classList.contains('is-open')) return;
    if (e.key === 'ArrowLeft') step(-1);
    if (e.key === 'ArrowRight') step(1);
  });

  /* ---------- Lead forms ---------- */
  function showStatus(form, kind, msg) {
    var box = $('.form-status', form);
    if (!box) return;
    box.className = 'form-status is-on ' + kind;
    box.textContent = msg;
    box.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }
  function validate(form) {
    var ok = true;
    $$('.field', form).forEach(function (f) {
      var input = f.querySelector('input,select,textarea');
      if (!input || input.type === 'hidden' || !input.required) return;
      var val = (input.value || '').trim();
      var bad = !val;
      if (!bad && input.type === 'email') bad = !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(val);
      if (!bad && input.type === 'tel') bad = (val.replace(/\D/g, '').length < 10);
      f.classList.toggle('has-error', bad);
      if (bad && ok) { input.focus(); ok = false; }
    });
    return ok;
  }

  $$('form[data-lead]').forEach(function (form) {
    $$('.field input,.field select,.field textarea', form).forEach(function (i) {
      i.addEventListener('input', function () { i.closest('.field').classList.remove('has-error'); });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (form.querySelector('input[name="company_website"]').value) return; // honeypot
      if (!validate(form)) { showStatus(form, 'bad', 'Please fill in the highlighted fields so we can reach you.'); return; }

      var btn = $('button[type="submit"]', form);
      var label = btn ? btn.textContent : '';
      if (btn) { btn.disabled = true; btn.textContent = 'Sending…'; }

      var data = new FormData(form);
      data.append('page', location.pathname);
      var endpoint = cfg.formEndpoint || '';
      var req;

      if (endpoint) {
        req = fetch(endpoint, { method: 'POST', body: data, headers: { Accept: 'application/json' } });
      } else {
        // Netlify Forms: url-encoded POST back to the page itself
        req = fetch(location.pathname, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams(data).toString()
        });
      }

      req.then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        window.location.href = (cfg.base || '') + 'thank-you/';
      }).catch(function () {
        showStatus(form, 'bad',
          'That did not go through. Please call or text us at ' + (cfg.phone || '') + ' and we will get you scheduled.');
        if (btn) { btn.disabled = false; btn.textContent = label; }
      });
    });
  });

  /* ---------- Phone formatting ---------- */
  $$('input[type="tel"]').forEach(function (i) {
    i.addEventListener('input', function () {
      var d = i.value.replace(/\D/g, '').slice(0, 10);
      i.value = d.length > 6 ? d.slice(0,3) + '-' + d.slice(3,6) + '-' + d.slice(6)
              : d.length > 3 ? d.slice(0,3) + '-' + d.slice(3)
              : d;
    });
  });

  /* ---------- Year stamp ---------- */
  $$('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();
