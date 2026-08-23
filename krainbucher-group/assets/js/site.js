/* The Krainbucher Group — site behaviour
   Restrained motion: 0.2s state changes, 2.5s atmospheric reveals, no parallax. */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- mobile navigation ---------- */
  var toggle = document.querySelector('.nav-toggle');
  var panel = document.getElementById('nav-panel');
  if (toggle && panel) {
    toggle.addEventListener('click', function () {
      var open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      panel.hidden = open;
    });
    panel.addEventListener('click', function (e) {
      if (e.target.closest('a')) {
        toggle.setAttribute('aria-expanded', 'false');
        panel.hidden = true;
      }
    });
    window.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        toggle.setAttribute('aria-expanded', 'false');
        panel.hidden = true;
        toggle.focus();
      }
    });
  }

  /* ---------- sticky nav tint ---------- */
  var nav = document.querySelector('.nav');
  if (nav) {
    var onScroll = function () { nav.classList.toggle('is-stuck', window.scrollY > 24); };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------- atmospheric reveals ---------- */
  var revealables = document.querySelectorAll('.reveal');
  if (!revealables.length) { /* nothing to do */ }
  else if (reduceMotion || !('IntersectionObserver' in window)) {
    revealables.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    revealables.forEach(function (el) { io.observe(el); });
  }

  /* ---------- FAQ disclosure ---------- */
  document.querySelectorAll('.faq-q').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var open = btn.getAttribute('aria-expanded') === 'true';
      var answer = document.getElementById(btn.getAttribute('aria-controls'));
      btn.setAttribute('aria-expanded', String(!open));
      if (answer) answer.hidden = open;
    });
  });

  /* ---------- "ask a question" composer -> contact page ---------- */
  document.querySelectorAll('[data-ask]').forEach(function (form) {
    var input = form.querySelector('input');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var q = (input && input.value.trim()) || '';
      var base = form.getAttribute('data-ask') || 'contact.html';
      window.location.href = q ? base + '?q=' + encodeURIComponent(q) + '#talk' : base + '#talk';
    });
    form.parentElement && form.parentElement.querySelectorAll('.chip').forEach(function (chip) {
      chip.addEventListener('click', function () {
        if (!input) return;
        input.value = chip.textContent.trim();
        input.focus();
      });
    });
  });

  /* ---------- contact form ---------- */
  var contactForm = document.getElementById('contact-form');
  if (contactForm) {
    var params = new URLSearchParams(window.location.search);
    var seeded = params.get('q');
    var message = contactForm.querySelector('[name="message"]');
    if (seeded && message && !message.value) message.value = seeded;

    var topic = params.get('topic');
    var topicField = contactForm.querySelector('[name="topic"]');
    if (topic && topicField) {
      Array.prototype.forEach.call(topicField.options, function (opt) {
        if (opt.value.toLowerCase() === topic.toLowerCase()) topicField.value = opt.value;
      });
    }

    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var status = document.getElementById('form-status');
      var data = new FormData(contactForm);
      var lines = [
        'Name: ' + (data.get('name') || ''),
        'Email: ' + (data.get('email') || ''),
        'Phone: ' + (data.get('phone') || ''),
        'Topic: ' + (data.get('topic') || ''),
        'Best time: ' + (data.get('timing') || ''),
        '',
        (data.get('message') || '')
      ].join('\n');

      var mailto = 'mailto:brian@thekrainbuchergroup.com'
        + '?subject=' + encodeURIComponent('Website enquiry — ' + (data.get('topic') || 'General'))
        + '&body=' + encodeURIComponent(lines);

      if (status) {
        status.hidden = false;
        status.textContent = 'Opening your email app with this message ready to send to brian@thekrainbuchergroup.com. '
          + 'If nothing opens, call (724) 321-0588 or email us directly.';
      }
      window.location.href = mailto;
    });
  }

  /* ---------- tax-deferral illustration ---------- */
  var calc = document.getElementById('growth-calc');
  if (calc) {
    var outputs = {
      deferred: document.getElementById('out-deferred'),
      taxable: document.getElementById('out-taxable'),
      gap: document.getElementById('out-gap')
    };
    var line1 = document.getElementById('line-deferred');
    var line2 = document.getElementById('line-taxable');
    var money = function (n) {
      return '$' + Math.round(n).toLocaleString('en-US');
    };

    var render = function () {
      var principal = Number(calc.querySelector('[name="principal"]').value);
      var years = Number(calc.querySelector('[name="years"]').value);
      var rate = Number(calc.querySelector('[name="rate"]').value) / 100;
      var bracket = Number(calc.querySelector('[name="bracket"]').value) / 100;

      calc.querySelector('[data-out="principal"]').textContent = money(principal);
      calc.querySelector('[data-out="years"]').textContent = years + ' yrs';
      calc.querySelector('[data-out="rate"]').textContent = (rate * 100).toFixed(1) + '%';
      calc.querySelector('[data-out="bracket"]').textContent = Math.round(bracket * 100) + '%';

      var deferredSeries = [], taxableSeries = [];
      for (var y = 0; y <= years; y++) {
        deferredSeries.push(principal * Math.pow(1 + rate, y));
        taxableSeries.push(principal * Math.pow(1 + rate * (1 - bracket), y));
      }
      var finalDeferred = deferredSeries[years];
      var finalTaxable = taxableSeries[years];

      if (outputs.deferred) outputs.deferred.textContent = money(finalDeferred);
      if (outputs.taxable) outputs.taxable.textContent = money(finalTaxable);
      if (outputs.gap) outputs.gap.textContent = money(finalDeferred - finalTaxable);

      var w = 640, h = 220, pad = 6;
      var max = finalDeferred || 1;
      var path = function (series) {
        return series.map(function (v, i) {
          var x = pad + (i / years) * (w - pad * 2);
          var yy = h - pad - (v / max) * (h - pad * 2);
          return (i ? 'L' : 'M') + x.toFixed(1) + ' ' + yy.toFixed(1);
        }).join(' ');
      };
      if (line1) line1.setAttribute('d', path(deferredSeries));
      if (line2) line2.setAttribute('d', path(taxableSeries));
    };

    calc.querySelectorAll('input, select').forEach(function (el) {
      el.addEventListener('input', render);
    });
    render();
  }

  /* ---------- footer year ---------- */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });
})();
