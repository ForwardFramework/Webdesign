/* KUBS Handy-Man Services — landing page interactions */
(function () {
  'use strict';

  /* ---------------------------------------------------------------
     Business constants. Change these in one place.
     --------------------------------------------------------------- */
  var CONFIG = {
    email: 'kubshandy@gmail.com',
    monthly: 99,          // Care Plan price per month
    yearly: 990,          // Care Plan price per year (2 months free)
    hourlyValue: 95,      // hourly labor rate, used for the "hours banked" figure
    maxBankedMonths: 12
  };

  var $ = function (sel, root) { return (root || document).querySelector(sel); };

  /* ── Footer year ───────────────────────────────────────────── */
  var yearEl = $('#year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ── Mobile navigation ─────────────────────────────────────── */
  var toggle = $('.nav-toggle');
  var nav = $('#site-nav');

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      nav.classList.toggle('is-open', !open);
    });

    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) {
        toggle.setAttribute('aria-expanded', 'false');
        nav.classList.remove('is-open');
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) {
        toggle.setAttribute('aria-expanded', 'false');
        nav.classList.remove('is-open');
        toggle.focus();
      }
    });
  }

  /* ── Care Plan billing toggle ──────────────────────────────── */
  var billingButtons = document.querySelectorAll('[data-billing]');
  var priceEl = $('[data-price]');
  var periodEl = $('[data-period]');
  var priceNoteEl = $('[data-price-note]');

  function setBilling(mode) {
    billingButtons.forEach(function (btn) {
      var on = btn.dataset.billing === mode;
      btn.classList.toggle('is-active', on);
      btn.setAttribute('aria-pressed', String(on));
    });

    if (!priceEl) return;

    if (mode === 'yearly') {
      priceEl.textContent = '$' + CONFIG.yearly;
      periodEl.textContent = 'per year';
      priceNoteEl.textContent =
        'Billed yearly · works out to $' + Math.round(CONFIG.yearly / 12) +
        '/month, and two months are on us';
    } else {
      priceEl.textContent = '$' + CONFIG.monthly;
      periodEl.textContent = 'per month';
      priceNoteEl.textContent = 'Billed monthly · $' + (CONFIG.monthly * 12).toLocaleString('en-US') + ' a year';
    }
  }

  billingButtons.forEach(function (btn) {
    btn.addEventListener('click', function () { setBilling(btn.dataset.billing); });
  });
  setBilling('monthly');

  /* ── Hour bank explainer ───────────────────────────────────── */
  var range = $('#months');
  var monthsOut = $('#monthsOut');
  var blocks = $('#bankBlocks');
  var hoursEl = $('#bankHours');
  var valueEl = $('#bankValue');
  var exampleEl = $('#bankExample');

  var EXAMPLES = {
    1: 'Enough for a <b>TV mounted</b>, a ceiling fan swapped out, or three small repairs knocked off the list.',
    2: 'Enough to <b>rehang a sagging gate</b> and reset the posts that are leaning with it.',
    3: 'Enough to <b>swap out a run of rotted deck boards</b> or hang a couple of interior doors.',
    4: 'Half a day on site — a <b>garage cleanout</b> with the trailer, or a bathroom tear-out.',
    5: 'A <b>full junk-removal run</b> plus a handful of repairs while we are already there.',
    6: 'A solid day of <b>punch-list work</b> — the whole page of small stuff, done in one visit.',
    7: 'A full day: <b>build a gate from scratch</b>, or frame out a shade structure.',
    8: 'A full day of <b>demo</b> — a shed, an old deck, or a room stripped to the studs and hauled off.',
    9: 'Most of a <b>short fence run</b>, posts set and panels hung.',
    10: 'A day and a half — a <b>deck resurface</b> or a serious carpentry repair.',
    11: 'Nearly two days: <b>pergola prep and build</b>, or a full property reset before you list it.',
    12: 'Two full days of skilled labor banked — the <b>big project</b> you have been putting off.'
  };

  function renderBank() {
    if (!range) return;

    var months = parseInt(range.value, 10);
    var pct = (months - 1) / (CONFIG.maxBankedMonths - 1) * 100;

    range.style.setProperty('--fill', pct + '%');
    if (monthsOut) monthsOut.textContent = String(months);
    if (hoursEl) hoursEl.textContent = String(months);
    if (valueEl) {
      valueEl.textContent = 'a $' + (months * CONFIG.hourlyValue).toLocaleString('en-US') + ' value of labor';
    }
    if (exampleEl) exampleEl.innerHTML = EXAMPLES[months] || '';

    if (blocks) {
      for (var i = 0; i < blocks.children.length; i++) {
        blocks.children[i].classList.toggle('on', i < months);
      }
    }
  }

  if (blocks) {
    var frag = document.createDocumentFragment();
    for (var i = 0; i < CONFIG.maxBankedMonths; i++) frag.appendChild(document.createElement('i'));
    blocks.appendChild(frag);
  }

  if (range) {
    range.addEventListener('input', renderBank);
    renderBank();
  }

  /* ── "Start the Care Plan" preselects the right form option ── */
  var planCta = $('[data-plan-cta]');
  var serviceSelect = $('#service');

  if (planCta && serviceSelect) {
    planCta.addEventListener('click', function () {
      serviceSelect.value = 'Care Plan sign-up';
    });
  }

  /* ── Estimate form ─────────────────────────────────────────────
     No backend on a static page, so the form hands off to the
     visitor's mail client. To wire up a real endpoint later, POST
     the same fields instead of building the mailto below.
     ------------------------------------------------------------ */
  var form = $('#quoteForm');
  var note = $('#formNote');

  if (form) {
    var DEFAULT_NOTE = note ? note.innerHTML : '';

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var data = new FormData(form);
      var name = (data.get('name') || '').trim();
      var phone = (data.get('phone') || '').trim();
      var email = (data.get('email') || '').trim();
      var service = data.get('service') || '';
      var details = (data.get('details') || '').trim();

      var missing = [];
      [['name', name], ['phone', phone]].forEach(function (pair) {
        var input = $('#' + pair[0], form);
        var empty = !pair[1];
        input.setAttribute('aria-invalid', String(empty));
        if (empty) missing.push(input);
      });

      if (missing.length) {
        if (note) {
          note.className = 'form-note err';
          note.textContent = 'Please add your name and a phone number so we can get back to you.';
        }
        missing[0].focus();
        return;
      }

      var body = [
        'Name: ' + name,
        'Phone: ' + phone,
        'Email: ' + (email || '—'),
        'Service: ' + service,
        '',
        'Details:',
        details || '—'
      ].join('\n');

      var href = 'mailto:' + CONFIG.email +
        '?subject=' + encodeURIComponent('Estimate request — ' + service + ' — ' + name) +
        '&body=' + encodeURIComponent(body);

      window.location.href = href;

      if (note) {
        note.className = 'form-note ok';
        note.textContent = 'Opening your email app… if nothing happens, call or text 941-539-2957.';
        window.setTimeout(function () {
          note.className = 'form-note';
          note.innerHTML = DEFAULT_NOTE;
        }, 8000);
      }
    });
  }

  /* ── Reveal sections on scroll ─────────────────────────────── */
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!reduced && 'IntersectionObserver' in window) {
    var targets = document.querySelectorAll('.card, .steps li, .price-card, .bank, .mini, .contact-form');

    targets.forEach(function (el, idx) {
      el.style.opacity = '0';
      el.style.transform = 'translateY(18px)';
      el.style.transition = 'opacity .55s ease ' + (idx % 4 * 0.06) + 's, transform .55s ease ' + (idx % 4 * 0.06) + 's';
    });

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'none';
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    targets.forEach(function (el) { io.observe(el); });

    /* Safety net: if the observer never fires (odd viewport, print, a
       screenshot pass that resizes the page), show everything anyway.
       Content must never be left invisible because of a decoration. */
    window.setTimeout(function () {
      targets.forEach(function (el) {
        if (el.style.opacity !== '1') {
          el.style.opacity = '1';
          el.style.transform = 'none';
        }
      });
    }, 2500);
  }
})();
