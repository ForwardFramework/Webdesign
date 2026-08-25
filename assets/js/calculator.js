/* =============================================================================
   Eclipse Aluminum & Shade — INSTANT ESTIMATE CALCULATOR
   -----------------------------------------------------------------------------
   Two halves:
     1. Estimator — pure functions over ECLIPSE_PRICING. No DOM, so it can be
        unit tested (see tests/pricing.test.js).
     2. Wizard    — one question per screen, progress bar, results panel.
   ========================================================================== */
(function () {
  'use strict';

  var CFG  = window.ECLIPSE_CONFIG;
  var DATA = window.ECLIPSE_PRICING;

  /* ===========================================================================
     1. ESTIMATOR
     ======================================================================== */

  function roundTo(value, step) { return Math.round(value / step) * step; }

  function roundPrice(value) {
    var r = DATA.rounding;
    return roundTo(value, value < r.under ? r.toNearestSmall : r.toNearestLarge);
  }

  function money(value) {
    return '$' + Math.round(value).toLocaleString('en-US');
  }

  function valueOf(a) { return (a && typeof a === 'object' && !Array.isArray(a)) ? a.value : a; }
  function num(a) { return Number(valueOf(a)) || 0; }

  function byId(svc, id) {
    return (svc.questions || []).filter(function (q) { return q.id === id; })[0];
  }

  /* A question can be hidden by an earlier answer (no cassette on a fixed awning). */
  function isVisible(q, answers) {
    var d = q.dependsOn;
    if (!d) return true;
    var v = valueOf(answers[d.question]);
    if (d.notIn) return d.notIn.indexOf(v) === -1;
    if (d.in)    return d.in.indexOf(v) !== -1;
    return true;
  }

  /* Resolve the chosen option object(s) for a question.
     Options may share a `value` (a "Not sure" choice reuses a midpoint number),
     so answers carry the option index to stay unambiguous. */
  function chosen(question, answer) {
    if (!question || answer === undefined || answer === null) return null;
    if (question.type === 'multi') {
      var picked = answer || [];
      return (question.options || []).filter(function (o) { return picked.indexOf(o.value) !== -1; });
    }
    if (answer && typeof answer === 'object' && answer.index !== undefined) {
      return question.options[answer.index] || null;
    }
    return (question.options || []).filter(function (o) { return o.value === answer; })[0] || null;
  }

  /* Monthly payment on an amortising loan — drives the "as low as" line. */
  function monthlyPayment(principal, apr, months) {
    if (!principal || !months) return 0;
    var r = (apr / 100) / 12;
    if (r === 0) return principal / months;
    return principal * r / (1 - Math.pow(1 + r, -months));
  }

  /**
   * Estimate a project.
   * @param  {string} serviceId  'awnings' | 'screens' | 'aluminum'
   * @param  {object} answers    { questionId: answer }
   * @return {object|null}
   */
  function estimate(serviceId, answers) {
    var svc = DATA[serviceId];
    if (!svc) return null;

    var unsure   = 0;   // "not sure" answers — each widens the band
    var drivers  = [];  // human-readable "what this is based on"
    var rate     = 0;   // $/sq ft base
    var rateAdd  = 0;   // $/sq ft adders
    var mult     = 1;   // compounding multipliers
    var unitFlat = 0;   // flat $ that repeats per unit / per opening
    var projFlat = 0;   // flat $ charged once for the whole project
    var areaRate = 0;   // $/sq ft charged once over the footprint (e.g. a new slab)
    var volume   = 1;   // quantity factor, already volume-discounted
    var units    = 1;

    function note(label, detail) { drivers.push({ label: label, detail: detail || '' }); }

    (svc.questions || []).forEach(function (q) {
      if (!isVisible(q, answers)) return;
      var pick = chosen(q, answers[q.id]);
      if (!pick) return;
      var many = Array.isArray(pick);
      var list = many ? pick : [pick];

      list.forEach(function (opt) {
        if (opt.unsure) unsure++;
        if (typeof opt.rate    === 'number') rate     += opt.rate;
        if (typeof opt.rateAdd === 'number') rateAdd  += opt.rateAdd;
        if (typeof opt.mult    === 'number') mult     *= opt.mult;
        if (typeof opt.perSqFt === 'number') areaRate += opt.perSqFt;
        if (typeof opt.volume  === 'number') { volume = opt.volume; units = opt.value; }
        if (typeof opt.flat    === 'number') {
          if (opt.scope === 'unit') unitFlat += opt.flat; else projFlat += opt.flat;
        }
        note(many ? 'Added' : (q.short || q.label), opt.label);
      });
    });

    /* Area, which is derived differently per service. */
    var area = 0;
    if (serviceId === 'awnings') {
      area = num(answers.width) * num(answers.projection);

    } else if (serviceId === 'screens') {
      area = num(answers.width) * num(answers.height);
      var goal = valueOf(answers.goal);
      var op   = valueOf(answers.operation);
      if (goal && op && svc.rates[goal]) {
        rate     += svc.rates[goal][op] || 0;
        unitFlat += svc.perOpening[op] || 0;
      }
      var openings = chosen(byId(svc, 'openings'), answers.openings);
      if (openings) { volume = openings.volume; units = openings.value; }

    } else if (serviceId === 'aluminum') {
      area = num(answers.width) * num(answers.depth);
      projFlat += svc.permitAndEngineering || 0;
    }

    if (!area || !rate) return null;

    var perUnit = area * (rate + rateAdd) * mult + unitFlat;
    var point   = perUnit * volume + projFlat + areaRate * area;

    if (svc.minProject && point < svc.minProject) point = svc.minProject;

    var b = DATA.band;
    var band = Math.min(b.base + unsure * b.perUnsureAnswer, b.max);

    var low  = roundPrice(point * (1 - band));
    var high = roundPrice(point * (1 + band));
    var mid  = roundPrice(point);

    var off = CFG.offer || {};
    var discount = (off.enabled && mid >= (off.minimumProject || 0)) ? (off.dollarsOff || 0) : 0;
    var fin = off.financing || {};
    var monthly = fin.enabled ? monthlyPayment(mid - discount, fin.apr, fin.months) : 0;

    return {
      serviceId: serviceId,
      serviceName: svc.name,
      low: low, high: high, mid: mid,
      area: Math.round(area),
      units: units,
      band: band,
      unsure: unsure,
      discount: discount,
      lowAfterOffer:  Math.max(0, low  - discount),
      highAfterOffer: Math.max(0, high - discount),
      monthly: monthly ? Math.ceil(monthly) : 0,
      drivers: drivers,
      answers: answers
    };
  }

  /* ===========================================================================
     2. WIZARD UI
     ======================================================================== */

  var state = { service: null, step: 0, answers: {}, result: null, saved: [] };
  var el = {};

  function h(tag, attrs, kids) {
    var n = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (k) {
      var v = attrs[k];
      if (v === null || v === undefined) return;
      if (k === 'class') n.className = v;
      else if (k === 'html') n.innerHTML = v;
      else if (k === 'text') n.textContent = v;
      else if (k.slice(0, 2) === 'on') n.addEventListener(k.slice(2), v);
      else n.setAttribute(k, v);
    });
    (kids || []).forEach(function (c) { if (c) n.appendChild(c); });
    return n;
  }

  function steps() {
    var svc = DATA[state.service];
    if (!svc) return [];
    return svc.questions.filter(function (q) { return isVisible(q, state.answers); });
  }

  function render() {
    if (!el.root) return;
    el.root.innerHTML = '';
    if (!state.service)    el.root.appendChild(viewServicePicker());
    else if (state.result) el.root.appendChild(viewResult());
    else                   el.root.appendChild(viewQuestion());
    renderSaved();
  }

  /* ---- service picker ---------------------------------------------------- */
  function viewServicePicker() {
    var wrap = h('div', { class: 'calc-panel' }, [
      h('p', { class: 'calc-kicker', text: 'Instant estimate' }),
      h('h3', { class: 'calc-title', text: 'What are you looking to shade?' }),
      h('p', { class: 'calc-sub', text: 'Pick a service and answer a handful of quick questions. You get a real price range in under a minute — no email needed to see it.' })
    ]);

    var grid = h('div', { class: 'calc-services' });
    window.ECLIPSE_SERVICE_ORDER.forEach(function (id) {
      var svc = DATA[id];
      grid.appendChild(h('button', {
        class: 'calc-service', type: 'button', onclick: function () { pickService(id); }
      }, [
        h('span', { class: 'calc-service__icon', html: icon(svc.icon) }),
        h('span', { class: 'calc-service__name', text: svc.short }),
        h('span', { class: 'calc-service__blurb', text: svc.blurb })
      ]));
    });
    wrap.appendChild(grid);
    return wrap;
  }

  function pickService(id) {
    state.service = id; state.step = 0; state.answers = {}; state.result = null;
    render(); focusPanel();
    track('estimate_started', { service: id });
  }

  /* ---- one question ------------------------------------------------------ */
  function viewQuestion() {
    var list = steps();
    var q = list[state.step];
    if (!q) { finish(); return h('div'); }

    var total = list.length;
    var pct = Math.round((state.step / total) * 100);
    var wrap = h('div', { class: 'calc-panel' });

    wrap.appendChild(h('div', { class: 'calc-progress' }, [
      h('div', { class: 'calc-progress__bar' }, [
        h('div', { class: 'calc-progress__fill', style: 'width:' + Math.max(pct, 6) + '%' })
      ]),
      h('span', { class: 'calc-progress__label', text: 'Question ' + (state.step + 1) + ' of ' + total })
    ]));

    wrap.appendChild(h('p', { class: 'calc-kicker', text: DATA[state.service].short }));
    wrap.appendChild(h('h3', { class: 'calc-title', id: 'calc-q', text: q.label }));
    if (q.help) wrap.appendChild(h('p', { class: 'calc-sub', text: q.help }));

    wrap.appendChild(q.type === 'cards' ? fieldCards(q)
                   : q.type === 'multi' ? fieldMulti(q)
                   :                      fieldSelect(q));

    var nav = h('div', { class: 'calc-nav' });
    if (state.step > 0) {
      nav.appendChild(h('button', {
        class: 'btn btn--ghost btn--sm', type: 'button',
        onclick: function () { state.step--; state.result = null; render(); focusPanel(); }
      }, [h('span', { class: 'btn__ico', html: icon('arrow-left') }), h('span', { text: 'Back' })]));
    }
    if (q.type !== 'cards') {
      nav.appendChild(h('button', { class: 'btn btn--primary btn--sm', type: 'button', onclick: next }, [
        h('span', { text: state.step === total - 1 ? 'See my price range' : 'Continue' }),
        h('span', { class: 'btn__ico', html: icon('arrow-right') })
      ]));
    } else if (q.optional) {
      nav.appendChild(h('button', { class: 'btn btn--ghost btn--sm', type: 'button', onclick: next, text: 'Skip' }));
    }
    wrap.appendChild(nav);

    wrap.appendChild(h('button', {
      class: 'calc-restart', type: 'button', text: 'Start over',
      onclick: function () { state.service = null; state.result = null; render(); focusPanel(); }
    }));
    return wrap;
  }

  function fieldCards(q) {
    var group = h('div', { class: 'calc-options', role: 'radiogroup', 'aria-labelledby': 'calc-q' });
    q.options.forEach(function (opt, i) {
      var picked = isPicked(q, i);
      group.appendChild(h('button', {
        class: 'calc-option' + (picked ? ' is-selected' : '') + (opt.unsure ? ' is-unsure' : ''),
        type: 'button', role: 'radio', 'aria-checked': picked ? 'true' : 'false',
        onclick: function () { state.answers[q.id] = { value: opt.value, index: i, label: opt.label }; next(); }
      }, [
        opt.popular ? h('span', { class: 'calc-option__tag', text: 'Most popular' }) : null,
        h('span', { class: 'calc-option__label', text: opt.label }),
        opt.note ? h('span', { class: 'calc-option__note', text: opt.note }) : null
      ]));
    });
    return group;
  }

  function fieldMulti(q) {
    var current = state.answers[q.id] || [];
    var group = h('div', { class: 'calc-options calc-options--multi', role: 'group', 'aria-labelledby': 'calc-q' });
    q.options.forEach(function (opt) {
      var picked = current.indexOf(opt.value) !== -1;
      group.appendChild(h('button', {
        class: 'calc-option calc-option--check' + (picked ? ' is-selected' : ''),
        type: 'button', 'aria-pressed': picked ? 'true' : 'false',
        onclick: function () {
          var arr = (state.answers[q.id] || []).slice();
          var at = arr.indexOf(opt.value);
          if (at === -1) arr.push(opt.value); else arr.splice(at, 1);
          state.answers[q.id] = arr;
          render();
        }
      }, [
        h('span', { class: 'calc-option__box', html: icon('check') }),
        h('span', { class: 'calc-option__body' }, [
          h('span', { class: 'calc-option__label', text: opt.label }),
          opt.note ? h('span', { class: 'calc-option__note', text: opt.note }) : null
        ])
      ]));
    });
    return group;
  }

  function fieldSelect(q) {
    var current = state.answers[q.id];
    var sel = h('select', {
      class: 'calc-select', 'aria-labelledby': 'calc-q',
      onchange: function (e) {
        if (e.target.value === '') return;
        var i = Number(e.target.value);
        var opt = q.options[i];
        state.answers[q.id] = { value: opt.value, index: i, label: opt.label };
      }
    });
    sel.appendChild(h('option', { value: '', text: 'Choose one…', selected: current ? null : 'selected' }));
    q.options.forEach(function (opt, i) {
      sel.appendChild(h('option', {
        value: String(i),
        text: opt.label + (opt.popular ? '  ·  most common' : ''),
        selected: (current && current.index === i) ? 'selected' : null
      }));
    });
    return h('div', { class: 'calc-selectwrap' }, [
      sel, h('span', { class: 'calc-selectwrap__chev', html: icon('chevron-down') })
    ]);
  }

  function isPicked(q, i) {
    var a = state.answers[q.id];
    return !!(a && typeof a === 'object' && a.index === i);
  }

  function next() {
    var list = steps();
    var q = list[state.step];
    if (q && !q.optional && q.type !== 'multi' && state.answers[q.id] === undefined) {
      flash('Pick an option to continue.');
      return;
    }
    if (state.step >= list.length - 1) { finish(); return; }
    state.step++;
    render(); focusPanel();
  }

  function finish() {
    state.result = estimate(state.service, state.answers);
    if (!state.result) { flash('We need a size to work from — go back and choose one.'); return; }
    render(); focusPanel();
    track('estimate_completed', { service: state.service, value: state.result.mid, currency: 'USD' });
  }

  /* ---- result ------------------------------------------------------------ */
  function viewResult() {
    var r = state.result;
    var off = CFG.offer || {};
    var wrap = h('div', { class: 'calc-panel calc-panel--result' });

    wrap.appendChild(h('p', { class: 'calc-kicker', text: 'Your estimate  ·  ' + DATA[state.service].short }));

    wrap.appendChild(h('div', { class: 'estimate' }, [
      h('div', { class: 'estimate__range' }, [
        h('span', { class: 'estimate__num', text: money(r.low) }),
        h('span', { class: 'estimate__dash', text: '–' }),
        h('span', { class: 'estimate__num', text: money(r.high) })
      ]),
      h('p', { class: 'estimate__basis', text:
        'Installed, permitted and finished. Based on roughly ' + r.area.toLocaleString('en-US') + ' sq ft' +
        (r.units > 1 ? ' each, across ' + r.units + ' of them' : '') + '.' })
    ]));

    if (r.discount) {
      wrap.appendChild(h('div', { class: 'estimate__offer' }, [
        h('span', { class: 'estimate__offer-icon', html: icon('tag') }),
        h('div', { class: 'estimate__offer-body' }, [
          h('strong', { text: 'With your $' + r.discount.toLocaleString('en-US') + ' offer applied: ' +
            money(r.lowAfterOffer) + ' – ' + money(r.highAfterOffer) }),
          h('span', { text: 'Plus a free 3D rendering of your home, a $' + off.renderingValue + ' value.' })
        ])
      ]));
    }

    if (r.monthly) {
      wrap.appendChild(h('p', { class: 'estimate__finance', html:
        'Or around <strong>' + money(r.monthly) + '/month</strong> with approved financing. ' +
        '<button type="button" class="linkish" data-modal="finance-terms">See terms</button>' }));
    }

    var drivers = h('ul', { class: 'estimate__drivers' });
    r.drivers.slice(0, 9).forEach(function (d) {
      drivers.appendChild(h('li', {}, [
        h('span', { class: 'estimate__driver-k', text: d.label }),
        h('span', { class: 'estimate__driver-v', text: d.detail })
      ]));
    });

    wrap.appendChild(h('details', { class: 'estimate__details' }, [
      h('summary', { text: 'What this estimate is based on' }),
      drivers,
      h('p', { class: 'estimate__fine', text:
        'This is a planning range built from current Southwest Florida installed pricing — it is not a quote. ' +
        'Your final price depends on actual measurements, wall construction, wind zone, county permit fees and the ' +
        'exact products you choose. The written quote comes after we measure, and it holds for 30 days.' })
    ]));

    if (r.unsure > 1) {
      wrap.appendChild(h('p', { class: 'estimate__widen', text:
        'You answered “not sure” a few times, so we widened the range on purpose. It tightens the moment we measure.' }));
    }

    wrap.appendChild(h('div', { class: 'estimate__cta' }, [
      h('button', {
        class: 'btn btn--accent btn--lg btn--block', type: 'button',
        onclick: function () {
          saveEstimate(true);
          window.EclipseBooking.open({ service: DATA[state.service].name, estimate: r });
        }
      }, [h('span', { text: off.ctaPrimary || 'Book my free design' }), h('span', { class: 'btn__ico', html: icon('arrow-right') })]),
      h('button', {
        class: 'btn btn--outline btn--block', type: 'button', text: 'Email me this estimate instead',
        onclick: function () { saveEstimate(true); scrollToForm(); }
      })
    ]));

    wrap.appendChild(h('div', { class: 'estimate__foot' }, [
      h('button', {
        class: 'linkish', type: 'button', text: 'Change my answers',
        onclick: function () { state.result = null; state.step = 0; render(); focusPanel(); }
      }),
      h('button', {
        class: 'linkish', type: 'button', text: 'Price another service',
        onclick: function () { saveEstimate(); state.service = null; state.result = null; render(); focusPanel(); }
      })
    ]));
    return wrap;
  }

  /* ---- saved estimates --------------------------------------------------- */
  function saveEstimate(silent) {
    var r = state.result;
    if (!r) return;
    var exists = state.saved.some(function (s) { return s.serviceId === r.serviceId && s.mid === r.mid; });
    if (!exists) state.saved.push(r);
    if (!silent) flash('Saved. Price another service and we’ll total them up.');
    renderSaved(); syncToForm();
  }

  function renderSaved() {
    var box = document.getElementById('calc-saved');
    if (!box) return;
    if (!state.saved.length) { box.hidden = true; box.innerHTML = ''; return; }
    box.hidden = false;
    box.innerHTML = '';

    var lo = 0, hi = 0;
    state.saved.forEach(function (s) { lo += s.low; hi += s.high; });

    var list = h('ul', { class: 'saved__list' });
    state.saved.forEach(function (s, i) {
      list.appendChild(h('li', { class: 'saved__item' }, [
        h('span', { class: 'saved__name', text: DATA[s.serviceId].short }),
        h('span', { class: 'saved__price', text: money(s.low) + ' – ' + money(s.high) }),
        h('button', {
          class: 'saved__remove', type: 'button',
          'aria-label': 'Remove ' + DATA[s.serviceId].short + ' from my project',
          html: icon('x'),
          onclick: function () { state.saved.splice(i, 1); renderSaved(); syncToForm(); }
        })
      ]));
    });

    box.appendChild(h('div', { class: 'saved' }, [
      h('p', { class: 'saved__title', text: 'Your project so far' }),
      list,
      state.saved.length > 1 ? h('p', { class: 'saved__total', html:
        '<span>Combined range</span><strong>' + money(lo) + ' – ' + money(hi) + '</strong>' }) : null,
      state.saved.length > 1 ? h('p', { class: 'saved__note', text:
        'Bundling into one installation usually beats doing them separately — ask your designer what that looks like.' }) : null,
      h('button', {
        class: 'btn btn--accent btn--block', type: 'button',
        text: (CFG.offer && CFG.offer.ctaPrimary) || 'Book my free design',
        onclick: function () { window.EclipseBooking.open({ estimate: state.saved[state.saved.length - 1] }); }
      })
    ]));
  }

  /* Carry the estimate into the contact form so the lead arrives with context. */
  function syncToForm() {
    var field = document.getElementById('field-estimate');
    if (field) {
      field.value = !state.saved.length ? '' : state.saved.map(function (s) {
        return DATA[s.serviceId].short + ': ' + money(s.low) + '–' + money(s.high) +
               ' (' + s.area + ' sq ft' + (s.units > 1 ? ' x' + s.units : '') + ')';
      }).join(' | ');
    }
    var interest = document.getElementById('field-service');
    if (interest && state.saved.length) {
      interest.value = state.saved[state.saved.length - 1].serviceId;
    }
  }

  function scrollToForm() {
    syncToForm();
    var target = document.getElementById('contact');
    if (target) target.scrollIntoView({ behavior: motion(), block: 'start' });
    setTimeout(function () {
      var f = document.getElementById('field-name');
      if (f) f.focus({ preventScroll: true });
    }, prefersReducedMotion() ? 0 : 550);
  }

  /* ---- helpers ----------------------------------------------------------- */
  function focusPanel() {
    var t = el.root && el.root.querySelector('.calc-title');
    if (t) { t.setAttribute('tabindex', '-1'); t.focus({ preventScroll: true }); }
  }

  function flash(msg) {
    var live = document.getElementById('calc-live');
    if (!live) return;
    live.textContent = msg;
    live.classList.add('is-visible');
    clearTimeout(flash._t);
    flash._t = setTimeout(function () { live.classList.remove('is-visible'); }, 4000);
  }

  function prefersReducedMotion() {
    return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }
  function motion() { return prefersReducedMotion() ? 'auto' : 'smooth'; }
  function track(n, p) { if (window.EclipseTrack) window.EclipseTrack(n, p); }
  function icon(n) { return window.EclipseIcon ? window.EclipseIcon(n) : ''; }

  /* ---- boot -------------------------------------------------------------- */
  function init() {
    el.root = document.getElementById('calculator');
    if (!el.root) return;
    render();

    var m = /^#estimate-(\w+)$/.exec(window.location.hash);
    if (m && DATA[m[1]]) pickService(m[1]);

    document.addEventListener('click', function (e) {
      var t = e.target.closest && e.target.closest('[data-start-estimate]');
      if (!t) return;
      e.preventDefault();
      var id = t.getAttribute('data-start-estimate');
      if (DATA[id]) pickService(id);
      else { state.service = null; state.result = null; render(); }
      var sec = document.getElementById('estimate');
      if (sec) sec.scrollIntoView({ behavior: motion(), block: 'start' });
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

  /* Exposed for the booking modal, the contact form, and the test suite. */
  window.EclipseCalc = {
    estimate: estimate,
    money: money,
    monthlyPayment: monthlyPayment,
    getSaved: function () { return state.saved.slice(); }
  };
})();
