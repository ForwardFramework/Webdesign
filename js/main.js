/* ============================================================
   Yasse's Cleaning — site behaviour
   - instant estimate engine (shared by hero + pricing page)
   - plan frequency toggle
   - mobile nav, sticky header, scroll reveal
   - client-side form validation + mailto/handoff submit
   ============================================================ */
(function () {
  'use strict';

  /* ---------------------------------------------------------
     1. PRICING ENGINE
     Benchmarks: Sarasota / Bradenton / Lakewood Ranch market,
     ~$120-200 per recurring visit for a 3bd/2ba home.
     Edit these numbers in ONE place to reprice the whole site.
  --------------------------------------------------------- */
  var PRICING = {
    base: 79,              // trip + supplies + baseline living areas
    perBedroom: 24,
    perBathroom: 22,
    tierMultiplier: {      // service package
      fresh: 1.00,         // Fresh Start  – essential maintenance clean
      signature: 1.18,     // Signature Sparkle – + rotating deep-clean zone
      platinum: 1.42       // Platinum Shine – white-glove
    },
    typeMultiplier: {      // one-time job types
      standard: 1.15,      // single standard clean (no plan)
      deep: 1.65,
      move: 1.85
    },
    frequencyDiscount: {   // recurring plan savings
      weekly: 0.20,
      biweekly: 0.15,
      monthly: 0.10,
      once: 0
    },
    frequencyLabel: {
      weekly: 'Every week',
      biweekly: 'Every 2 weeks',
      monthly: 'Every 4 weeks',
      once: 'One-time clean'
    },
    firstCleanCredit: 50   // "$50 off your first clean" starter offer
  };
  window.YC_PRICING = PRICING;

  function money(n) { return '$' + Math.round(n); }

  /**
   * @returns {{list:number, price:number, saved:number, pct:number}}
   */
  function estimate(opts) {
    var beds = Number(opts.bedrooms) || 1;
    var baths = Number(opts.bathrooms) || 1;
    var tier = PRICING.tierMultiplier[opts.tier] || 1;
    var freq = opts.frequency || 'biweekly';

    var rooms = PRICING.base + beds * PRICING.perBedroom + baths * PRICING.perBathroom;

    // A one-off visit costs more than a maintained home: no plan discount,
    // plus the job type multiplier for deep / move-out work. The tier
    // multiplier does NOT apply here — Fresh Start / Signature / Platinum are
    // recurring plans, so a one-time job is priced off the room base alone.
    // This is what keeps the estimator inside the published one-time ranges.
    if (freq === 'once') {
      var type = PRICING.typeMultiplier[opts.jobType] || PRICING.typeMultiplier.standard;
      var oneOff = rooms * type;
      return { list: oneOff, price: oneOff, saved: 0, pct: 0 };
    }

    var raw = rooms * tier;

    var pct = PRICING.frequencyDiscount[freq] || 0;
    var price = raw * (1 - pct);
    return { list: raw, price: price, saved: raw - price, pct: Math.round(pct * 100) };
  }
  window.YC_estimate = estimate;

  /* ---------------------------------------------------------
     2. HERO / PAGE INSTANT ESTIMATE WIDGET
  --------------------------------------------------------- */
  function initEstimator(root) {
    var out = root.querySelector('[data-estimate-value]');
    if (!out) return;
    var note = root.querySelector('[data-estimate-note]');
    var save = root.querySelector('[data-estimate-save]');
    var hidden = root.querySelector('[data-estimate-field]');
    var jobTypeField = root.querySelector('[data-jobtype-field]');

    function read(name, fallback) {
      var checked = root.querySelector('[name="' + name + '"]:checked');
      if (checked) return checked.value;
      var sel = root.querySelector('[name="' + name + '"]');
      return sel ? sel.value : fallback;
    }

    function update() {
      var frequency = read('frequency', 'biweekly');
      var result = estimate({
        bedrooms: read('bedrooms', 3),
        bathrooms: read('bathrooms', 2),
        tier: read('tier', 'signature'),
        frequency: frequency,
        jobType: read('jobType', 'standard')
      });

      // Show a range rather than a false-precision number.
      var low = Math.round(result.price / 5) * 5;
      var high = Math.round((result.price * 1.12) / 5) * 5;
      out.textContent = money(low) + '–' + money(high);

      if (jobTypeField) jobTypeField.hidden = frequency !== 'once';

      if (note) {
        note.textContent = frequency === 'once'
          ? 'Per visit · one-time clean · no contract'
          : 'Per visit · ' + PRICING.frequencyLabel[frequency].toLowerCase() + ' · cancel anytime';
      }
      if (save) {
        if (result.pct > 0) {
          save.hidden = false;
          save.textContent = 'You save ' + result.pct + '% (' + money(result.saved) +
            ' every visit) with a recurring plan';
        } else {
          save.hidden = true;
        }
      }
      if (hidden) {
        hidden.value = out.textContent + ' (' + PRICING.frequencyLabel[frequency] + ')';
      }
    }

    root.addEventListener('change', update);
    root.addEventListener('input', update);
    update();
  }

  /* ---------------------------------------------------------
     3. PLAN FREQUENCY TOGGLE (pricing tables)
  --------------------------------------------------------- */
  function initPlanToggle() {
    var toggle = document.querySelector('[data-plan-toggle]');
    if (!toggle) return;
    var buttons = Array.prototype.slice.call(toggle.querySelectorAll('button'));

    function apply(freq) {
      buttons.forEach(function (b) {
        b.setAttribute('aria-pressed', String(b.dataset.freq === freq));
      });

      document.querySelectorAll('[data-tier]').forEach(function (card) {
        var tier = card.dataset.tier;
        var beds = Number(card.dataset.beds || 3);
        var baths = Number(card.dataset.baths || 2);
        var res = estimate({ bedrooms: beds, bathrooms: baths, tier: tier, frequency: freq });

        var amount = card.querySelector('[data-tier-amount]');
        var was = card.querySelector('[data-tier-was]');
        var saveEl = card.querySelector('[data-tier-save]');
        var per = card.querySelector('[data-tier-per]');

        if (amount) amount.textContent = money(Math.round(res.price / 5) * 5);
        if (per) per.textContent = freq === 'once' ? '/ visit' : '/ visit';
        if (was) {
          was.hidden = res.pct === 0;
          was.textContent = money(Math.round(res.list / 5) * 5);
        }
        if (saveEl) {
          saveEl.hidden = res.pct === 0;
          saveEl.textContent = 'Save ' + res.pct + '% · ' + money(res.saved) + ' off every visit';
        }
      });

      document.querySelectorAll('[data-freq-label]').forEach(function (el) {
        el.textContent = PRICING.frequencyLabel[freq];
      });
    }

    toggle.addEventListener('click', function (e) {
      var btn = e.target.closest('button[data-freq]');
      if (btn) apply(btn.dataset.freq);
    });

    var pressed = toggle.querySelector('button[aria-pressed="true"]');
    apply(pressed ? pressed.dataset.freq : 'biweekly');
  }

  /* ---------------------------------------------------------
     4. NAVIGATION + HEADER
  --------------------------------------------------------- */
  function initNav() {
    var toggle = document.querySelector('.nav-toggle');
    var panel = document.getElementById('mobile-nav');
    if (toggle && panel) {
      toggle.addEventListener('click', function () {
        var open = toggle.getAttribute('aria-expanded') === 'true';
        toggle.setAttribute('aria-expanded', String(!open));
        panel.classList.toggle('is-open', !open);
      });
      panel.addEventListener('click', function (e) {
        if (e.target.tagName === 'A') {
          toggle.setAttribute('aria-expanded', 'false');
          panel.classList.remove('is-open');
        }
      });
    }

    var header = document.querySelector('.site-header');
    if (header) {
      var onScroll = function () {
        header.classList.toggle('is-stuck', window.scrollY > 8);
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    }
  }

  /* ---------------------------------------------------------
     5. SCROLL REVEAL
  --------------------------------------------------------- */
  function initReveal() {
    var items = document.querySelectorAll('.reveal');
    if (!items.length) return;
    if (!('IntersectionObserver' in window) ||
        window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      items.forEach(function (el) { el.classList.add('is-in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    items.forEach(function (el) { io.observe(el); });
  }

  /* ---------------------------------------------------------
     6. FORMS
     No backend is wired up yet, so a valid submission is handed
     off to the business inbox via mailto and the visitor gets a
     confirmation. Swap `handoff()` for a fetch() to your CRM /
     Formspree / Jobber endpoint when one exists.
  --------------------------------------------------------- */
  function validate(form) {
    var ok = true;
    form.querySelectorAll('[required]').forEach(function (input) {
      var field = input.closest('.field') || input.parentElement;
      var value = (input.value || '').trim();
      var valid = !!value;

      if (valid && input.type === 'email') {
        valid = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
      }
      if (valid && input.type === 'tel') {
        valid = (value.replace(/\D/g, '').length >= 10);
      }
      field.classList.toggle('has-error', !valid);
      if (!valid && ok) { input.focus(); ok = false; }
    });
    return ok;
  }

  function handoff(form) {
    var to = form.dataset.mailto;
    if (!to) return;
    var data = new FormData(form);
    var lines = [];
    data.forEach(function (value, key) {
      if (key === 'company') return;                 // honeypot
      if (String(value).trim()) lines.push(key + ': ' + value);
    });
    var href = 'mailto:' + to +
      '?subject=' + encodeURIComponent(form.dataset.subject || 'Website quote request') +
      '&body=' + encodeURIComponent(lines.join('\n'));
    window.location.href = href;
  }

  function initForms() {
    document.querySelectorAll('form[data-form]').forEach(function (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();

        // Honeypot: bots fill hidden fields, people don't.
        var trap = form.querySelector('[name="company"]');
        if (trap && trap.value) return;

        if (!validate(form)) return;

        var status = form.querySelector('.form-status');
        if (status) {
          status.className = 'form-status form-status--ok is-visible';
          status.textContent = form.dataset.success ||
            'Thanks! Your request is on its way — we reply to every quote within 1 business hour.';
        }
        handoff(form);
        form.querySelectorAll('input[type=text],input[type=tel],input[type=email],textarea')
          .forEach(function (i) { i.value = ''; });
      });

      form.addEventListener('input', function (e) {
        var field = e.target.closest('.field');
        if (field) field.classList.remove('has-error');
      });
    });
  }

  /* ---------------------------------------------------------
     7. BOOT
  --------------------------------------------------------- */
  function boot() {
    document.querySelectorAll('[data-estimator]').forEach(initEstimator);
    initPlanToggle();
    initNav();
    initReveal();
    initForms();
    document.documentElement.classList.add('js-ready');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
