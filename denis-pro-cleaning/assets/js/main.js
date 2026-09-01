/* =========================================================
   Denis Pro Cleaning Services — site behaviour
   Everything configurable lives in CONFIG below.
   ========================================================= */
(function () {
  'use strict';

  var CONFIG = {
    business: 'Denis Pro Cleaning Services',
    email: 'denisprocleaningservice@gmail.com',
    phone: '203-627-9940',

    /* ---- Where form submissions go -------------------------------------
       Paste a Formspree / Netlify / Getform / Basin endpoint here and both
       forms POST straight to it. Leave empty and the site falls back to
       opening a pre-filled email to the address above, so nothing is ever
       lost while the endpoint is being set up.
       e.g. formEndpoint: 'https://formspree.io/f/xxxxxxxx'                */
    formEndpoint: '',

    /* ---- Online calendar ------------------------------------------------
       provider: '' | 'calendly' | 'iframe'
         ''         → the built-in date + time picker below (default)
         'calendly' → embeds a Calendly inline widget at schedulerUrl
         'iframe'   → embeds any scheduler that supports an iframe
                      (Housecall Pro, Jobber, Square Appointments,
                       Acuity, Cal.com, Setmore, Google Appointment
                       Schedule …) — just paste its booking URL.
       Example:
         provider: 'calendly',
         schedulerUrl: 'https://calendly.com/denisprocleaning/cleaning'   */
    provider: '',
    schedulerUrl: '',

    /* ---- Drop-in original artwork ---------------------------------------
       The site ships with a faithful SVG rebuild of the logo. To use the
       original files instead, drop them in assets/img/ and name them here.
       Leave empty to keep the SVG.
         logoFull → full lockup, used in the footer
         logoMark → emblem only, used in the header                        */
    logoFull: '',
    logoMark: '',

    /* Booking window for the built-in picker */
    daysAhead: 90,
    closedWeekdays: [0],           // 0 = Sunday
    slotsWeekday: ['8:00 – 10:00 AM', '10:00 AM – 12:00 PM', '12:00 – 2:00 PM', '2:00 – 4:00 PM', '4:00 – 6:00 PM'],
    slotsSaturday: ['8:00 – 10:00 AM', '10:00 AM – 12:00 PM', '12:00 – 2:00 PM']
  };

  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var money = function (n) { return '$' + Math.round(n / 5) * 5; };

  /* ---------------------------------------------------------------
     Header: shadow on scroll + mobile menu
     --------------------------------------------------------------- */
  var header = $('#header'), burger = $('#burger'), nav = $('#nav');

  window.addEventListener('scroll', function () {
    header.classList.toggle('is-stuck', window.scrollY > 8);
  }, { passive: true });

  burger.addEventListener('click', function () {
    var open = nav.classList.toggle('is-open');
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  });

  $$('#nav a').forEach(function (a) {
    a.addEventListener('click', function () {
      nav.classList.remove('is-open');
      burger.setAttribute('aria-expanded', 'false');
    });
  });

  /* ---------------------------------------------------------------
     Scroll reveal
     --------------------------------------------------------------- */
  var reveals = $$('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e, i) {
        if (!e.isIntersecting) return;
        setTimeout(function () { e.target.classList.add('is-in'); }, Math.min(i * 70, 280));
        io.unobserve(e.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px' });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ---------------------------------------------------------------
     Instant quote calculator
     --------------------------------------------------------------- */
  var TYPE = { standard: 1, deep: 1.55, movein: 1.7, post: 2.1 };
  var FREQ = { weekly: 0.80, biweekly: 0.85, monthly: 0.90, once: 1 };
  var FREQ_LABEL = { weekly: 'weekly · 20% off', biweekly: 'bi-weekly · 15% off', monthly: 'monthly · 10% off', once: 'one-time visit' };

  var qBeds = $('#q-beds'), qBaths = $('#q-baths'), qType = $('#q-type');
  var qAmount = $('#q-amount'), qSave = $('#q-save');

  function currentFreq() {
    var picked = $('input[name="q-freq"]:checked');
    return picked ? picked.value : 'biweekly';
  }

  function calcQuote() {
    var beds = parseFloat(qBeds.value);
    var baths = parseFloat(qBaths.value);
    var freq = currentFreq();
    var base = 70 + beds * 20 + baths * 25;
    var price = base * TYPE[qType.value] * FREQ[freq];
    qAmount.textContent = money(price);
    qSave.textContent = FREQ_LABEL[freq];
    return { price: money(price), freq: freq };
  }

  [qBeds, qBaths, qType].forEach(function (el) { el.addEventListener('change', calcQuote); });
  $$('input[name="q-freq"]').forEach(function (el) { el.addEventListener('change', calcQuote); });
  calcQuote();

  /* Carry the quote into the booking form */
  $('#q-cta').addEventListener('click', function () {
    var q = calcQuote();
    var typeMap = { standard: 'Standard clean', deep: 'Deep clean', movein: 'Move-in / move-out', post: 'Post-construction' };
    var planMap = { weekly: 'Weekly', biweekly: 'Bi-Weekly', monthly: 'Monthly', once: 'One-Time Deep' };
    setSelect($('#b-service'), typeMap[qType.value]);
    setSelect($('#b-plan'), planMap[q.freq]);
    setSelect($('#b-beds'), qBeds.options[qBeds.selectedIndex].text.replace(/\s*bedrooms?/, '').replace('Studio', 'Studio').replace('5+', '5+'));
    setSelect($('#b-baths'), qBaths.value === '4' ? '4+' : qBaths.value);
    $('#b-notes').value = 'Website quote: ' + q.price + ' per visit (' + FREQ_LABEL[q.freq] + ').' +
      ($('#b-notes').value ? '\n' + $('#b-notes').value : '');
  });

  function setSelect(sel, text) {
    if (!sel) return;
    for (var i = 0; i < sel.options.length; i++) {
      if (sel.options[i].value === text || sel.options[i].text === text) { sel.selectedIndex = i; return; }
    }
  }

  /* ---------------------------------------------------------------
     Package pricing by home size
     --------------------------------------------------------------- */
  var SIZE_BASE = { apt: 135, home: 185, large: 255, office: null };

  function paintPlans(size) {
    var base = SIZE_BASE[size];
    var mult = { weekly: 0.80, biweekly: 0.85, monthly: 0.90, once: 1.55 };

    $$('[data-price]').forEach(function (el) {
      var key = el.getAttribute('data-price');
      el.textContent = base ? money(base * mult[key]) : 'Custom';
    });

    $$('[data-save]').forEach(function (el) {
      var key = el.getAttribute('data-save');
      if (!base) {
        el.textContent = key === 'once' ? 'Free walkthrough quote' : 'Priced per square foot';
      } else {
        el.textContent = { weekly: 'Save 20% vs. one-time', biweekly: 'Save 15% vs. one-time',
                           monthly: 'Save 10% vs. one-time', once: '$50 off for new clients' }[key];
      }
    });

    $$('.plan-price .per').forEach(function (el) {
      if (!base) el.textContent = '';
      else el.textContent = el.closest('.plan').querySelector('[data-price]').getAttribute('data-price') === 'once' ? '/ clean' : '/ visit';
    });
    $$('.plan-price .from').forEach(function (el) { el.style.display = base ? '' : 'none'; });
  }

  $$('.plan-toggle button').forEach(function (btn) {
    btn.addEventListener('click', function () {
      $$('.plan-toggle button').forEach(function (b) { b.setAttribute('aria-selected', 'false'); });
      btn.setAttribute('aria-selected', 'true');
      paintPlans(btn.getAttribute('data-size'));
    });
  });
  paintPlans('home');

  /* Plan CTA → preselect the package in the booking form */
  $$('[data-plan]').forEach(function (a) {
    a.addEventListener('click', function () { setSelect($('#b-plan'), a.getAttribute('data-plan')); });
  });

  /* ---------------------------------------------------------------
     Online calendar
     Either mounts a third-party scheduler, or runs the built-in
     date + arrival-window picker.
     --------------------------------------------------------------- */
  var embed = $('#scheduler-embed'), native = $('#scheduler-native');

  function mountScheduler() {
    if (!CONFIG.provider || !CONFIG.schedulerUrl) return false;
    embed.hidden = false;
    native.hidden = true;

    if (CONFIG.provider === 'calendly') {
      var css = document.createElement('link');
      css.rel = 'stylesheet';
      css.href = 'https://assets.calendly.com/assets/external/widget.css';
      document.head.appendChild(css);

      var holder = document.createElement('div');
      holder.className = 'calendly-inline-widget';
      holder.setAttribute('data-url', CONFIG.schedulerUrl);
      holder.style.minWidth = '280px';
      holder.style.height = '660px';
      embed.appendChild(holder);

      var js = document.createElement('script');
      js.src = 'https://assets.calendly.com/assets/external/widget.js';
      js.async = true;
      document.body.appendChild(js);
    } else {
      var frame = document.createElement('iframe');
      frame.src = CONFIG.schedulerUrl;
      frame.title = 'Book a cleaning appointment';
      frame.loading = 'lazy';
      frame.style.cssText = 'width:100%;height:660px;border:0;border-radius:18px';
      embed.appendChild(frame);
    }
    return true;
  }

  if (!mountScheduler()) initNativeCalendar();

  function initNativeCalendar() {
    var dowWrap = $('#cal-dow'), daysWrap = $('#cal-days'), monthLbl = $('#cal-month');
    var slotsWrap = $('#cal-slots'), summary = $('#booking-summary');
    var whenInput = $('#b-when');

    var today = new Date(); today.setHours(0, 0, 0, 0);
    var maxDate = new Date(today.getTime() + CONFIG.daysAhead * 864e5);
    var view = new Date(today.getFullYear(), today.getMonth(), 1);
    var chosenDate = null, chosenSlot = null;

    ['S', 'M', 'T', 'W', 'T', 'F', 'S'].forEach(function (d) {
      var c = document.createElement('div'); c.className = 'cal-dow'; c.textContent = d;
      dowWrap.appendChild(c);
    });

    function fmt(d) {
      return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
    }

    function render() {
      daysWrap.innerHTML = '';
      monthLbl.textContent = view.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

      $('#cal-prev').disabled = view <= new Date(today.getFullYear(), today.getMonth(), 1);
      $('#cal-next').disabled = new Date(view.getFullYear(), view.getMonth() + 1, 1) > maxDate;

      var first = new Date(view.getFullYear(), view.getMonth(), 1);
      var total = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate();

      for (var p = 0; p < first.getDay(); p++) daysWrap.appendChild(document.createElement('div'));

      for (var d = 1; d <= total; d++) {
        var date = new Date(view.getFullYear(), view.getMonth(), d);
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'cal-day';
        btn.textContent = d;
        btn.setAttribute('aria-label', fmt(date));

        var closed = CONFIG.closedWeekdays.indexOf(date.getDay()) !== -1;
        var tooSoon = date <= today;         // one full day of lead time
        var tooFar = date > maxDate;
        btn.disabled = closed || tooSoon || tooFar;

        if (date.getTime() === today.getTime()) btn.classList.add('is-today');
        if (chosenDate && date.getTime() === chosenDate.getTime()) {
          btn.classList.add('is-selected');
          btn.setAttribute('aria-pressed', 'true');
        }

        (function (dt, el) {
          el.addEventListener('click', function () { pickDate(dt); });
        })(date, btn);

        daysWrap.appendChild(btn);
      }
    }

    function pickDate(date) {
      chosenDate = date;
      chosenSlot = null;
      render();
      renderSlots();
      updateSummary();
    }

    function renderSlots() {
      slotsWrap.innerHTML = '';
      if (!chosenDate) return;
      var list = chosenDate.getDay() === 6 ? CONFIG.slotsSaturday : CONFIG.slotsWeekday;
      list.forEach(function (label) {
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'slot';
        b.textContent = label;
        b.addEventListener('click', function () {
          chosenSlot = label;
          $$('.slot', slotsWrap).forEach(function (s) { s.classList.remove('is-selected'); });
          b.classList.add('is-selected');
          updateSummary();
        });
        slotsWrap.appendChild(b);
      });
    }

    function updateSummary() {
      if (!chosenDate) {
        summary.textContent = 'Select a date to see available arrival windows.';
        whenInput.value = '';
        return;
      }
      if (!chosenSlot) {
        summary.innerHTML = 'Selected <b>' + fmt(chosenDate) + '</b> — now pick an arrival window.';
        whenInput.value = fmt(chosenDate);
        return;
      }
      summary.innerHTML = 'Your slot: <b>' + fmt(chosenDate) + '</b>, arriving <b>' + chosenSlot + '</b>. Finish the form to lock it in →';
      whenInput.value = fmt(chosenDate) + ', ' + chosenSlot;
    }

    $('#cal-prev').addEventListener('click', function () {
      view = new Date(view.getFullYear(), view.getMonth() - 1, 1); render();
    });
    $('#cal-next').addEventListener('click', function () {
      view = new Date(view.getFullYear(), view.getMonth() + 1, 1); render();
    });

    render();
  }

  /* ---------------------------------------------------------------
     Forms
     --------------------------------------------------------------- */
  function collect(form) {
    var data = {};
    $$('input, select, textarea', form).forEach(function (el) {
      if (!el.name) return;
      data[el.name] = el.type === 'checkbox' ? (el.checked ? 'Yes' : 'No') : el.value.trim();
    });
    return data;
  }

  function validate(form) {
    var ok = true;
    $$('[required]', form).forEach(function (el) {
      var bad = el.type === 'checkbox' ? !el.checked : !el.value.trim();
      if (!bad && el.type === 'email') bad = !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(el.value);
      if (!bad && el.type === 'tel') bad = (el.value.replace(/\D/g, '').length < 10);
      el.style.borderColor = bad ? '#C24545' : '';
      if (bad && ok) { el.focus(); ok = false; }
    });
    return ok;
  }

  function say(node, msg, isError) {
    node.className = 'form-status ' + (isError ? 'is-err' : 'is-ok');
    node.textContent = msg;
  }

  function mailtoFallback(subject, data) {
    var body = Object.keys(data).map(function (k) {
      return k.replace(/_/g, ' ').replace(/^./, function (c) { return c.toUpperCase(); }) + ': ' + data[k];
    }).join('\n');
    window.location.href = 'mailto:' + CONFIG.email +
      '?subject=' + encodeURIComponent(subject) +
      '&body=' + encodeURIComponent(body);
  }

  function wire(formId, statusId, subject, successMsg) {
    var form = $('#' + formId), status = $('#' + statusId);
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!validate(form)) { say(status, 'Please fill in the highlighted fields.', true); return; }

      var data = collect(form);
      var btn = $('button[type="submit"]', form);
      var original = btn.textContent;

      if (!CONFIG.formEndpoint) {
        mailtoFallback(subject, data);
        say(status, 'Your email app is opening with the details filled in — hit send and we\'ll reply shortly. ' +
                    'In a hurry? Call or text ' + CONFIG.phone + '.');
        return;
      }

      btn.disabled = true; btn.textContent = 'Sending…';
      fetch(CONFIG.formEndpoint, {
        method: 'POST',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.assign({ _subject: subject }, data))
      }).then(function (r) {
        if (!r.ok) throw new Error('bad response');
        form.reset();
        if (formId === 'booking-form') { paintPlans($('.plan-toggle button[aria-selected="true"]').getAttribute('data-size')); }
        say(status, successMsg);
      }).catch(function () {
        say(status, 'Something went wrong sending that. Please call or text ' + CONFIG.phone +
                    ' or email ' + CONFIG.email + ' and we\'ll take care of you.', true);
      }).then(function () {
        btn.disabled = false; btn.textContent = original;
      });
    });
  }

  wire('booking-form', 'booking-status',
    'New cleaning booking request — ' + CONFIG.business,
    'Booking request received! We\'ll confirm your date and arrival window by text within the hour.');

  wire('contact-form', 'contact-status',
    'New website message — ' + CONFIG.business,
    'Thanks for reaching out! We typically reply within a couple of hours during business hours.');

  /* ---------------------------------------------------------------
     Swap in the original logo artwork when CONFIG names it
     --------------------------------------------------------------- */
  [['.brand img', CONFIG.logoMark], ['.footer-brand img', CONFIG.logoFull]].forEach(function (pair) {
    var target = $(pair[0]);
    if (target && pair[1]) { target.src = pair[1]; target.removeAttribute('height'); }
  });

  /* ---------------------------------------------------------------
     Misc
     --------------------------------------------------------------- */
  $('#year').textContent = new Date().getFullYear();
})();
