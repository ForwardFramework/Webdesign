/* Forward Framework — site behaviour. No dependencies.
 *
 * Split into two scopes:
 *   initShell() — header, nav, sticky CTA. Runs once; these live outside <main>.
 *   initPage(root) — everything inside <main>. Re-runnable, so injected or
 *   swapped page content wires itself up the same way a fresh load would.
 */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* The one address and number, for the fallback shown when a submission is
     refused. tools/set_domain.py and tools/set_phone.py rewrite these, so do
     not edit them by hand. */
  var CONTACT_EMAIL = 'hello@forward-framework.com';
  var CONTACT_PHONE = '(412) 463-2126';
  var CONTACT_TEL = '+14124632126';

  /* What the visitor said they came for, as a service slug, so the
     post-submission page can lead with that deliverable. */
  var NEED_SLUGS = {
    'A website that converts': 'web-design',
    'More qualified leads': 'marketing',
    'AI + automation': 'automation',
    'Better ad performance': 'ad-management'
  };

  function needSlug(form) {
    var picked = form.querySelector('input[name="primary_need"]:checked');
    if (picked && NEED_SLUGS[picked.value]) return NEED_SLUGS[picked.value];
    // On a service page the deliverable they asked for is the page itself.
    var here = window.location.pathname.match(/\/services\/([a-z-]+)/);
    return here && here[1] !== 'index' ? here[1] : '';
  }

  /* ---------- Attribution capture (once) ---------- */
  var params = new URLSearchParams(window.location.search);
  var attrKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'fbclid'];
  var stored = {};
  try { stored = JSON.parse(sessionStorage.getItem('ff_attr') || '{}'); } catch (e) { stored = {}; }
  attrKeys.forEach(function (k) { if (params.get(k)) stored[k] = params.get(k); });
  if (!stored.landing_page) stored.landing_page = window.location.pathname;
  if (!stored.referrer) stored.referrer = document.referrer || 'direct';
  try { sessionStorage.setItem('ff_attr', JSON.stringify(stored)); } catch (e) {}

  /* ================= Shell ================= */
  function initShell() {
    /* Sticky header */
    var header = document.querySelector('.site-header');
    if (header) {
      var onScroll = function () { header.classList.toggle('is-stuck', window.scrollY > 12); };
      onScroll();
      window.addEventListener('scroll', onScroll, { passive: true });
    }

    /* Mobile nav */
    var toggle = document.querySelector('.nav-toggle');
    var nav = document.getElementById('primary-nav');
    if (toggle && nav) {
      toggle.addEventListener('click', function () {
        var open = toggle.getAttribute('aria-expanded') === 'true';
        toggle.setAttribute('aria-expanded', String(!open));
        nav.classList.toggle('is-open', !open);
        document.body.style.overflow = !open ? 'hidden' : '';
      });
      nav.addEventListener('click', function (e) {
        if (e.target.closest('a') && window.innerWidth <= 1080) {
          toggle.setAttribute('aria-expanded', 'false');
          nav.classList.remove('is-open');
          document.body.style.overflow = '';
        }
      });
    }

    /* Services dropdown */
    Array.prototype.forEach.call(document.querySelectorAll('.nav-item--has-mega'), function (item) {
      var btn = item.querySelector('.nav-link');
      if (!btn) return;
      var close = function () { item.classList.remove('is-open'); btn.setAttribute('aria-expanded', 'false'); };
      var open = function () { item.classList.add('is-open'); btn.setAttribute('aria-expanded', 'true'); };
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        item.classList.contains('is-open') ? close() : open();
      });
      item.addEventListener('mouseenter', function () { if (window.innerWidth > 1080) open(); });
      item.addEventListener('mouseleave', function () { if (window.innerWidth > 1080) close(); });
      document.addEventListener('click', function (e) { if (!item.contains(e.target)) close(); });
      document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
    });

    /* Sticky mobile CTA */
    var mcta = document.querySelector('.mobile-cta');
    if (mcta) {
      var showAfter = function () { mcta.classList.toggle('is-visible', window.scrollY > 420); };
      showAfter();
      window.addEventListener('scroll', showAfter, { passive: true });
    }
  }

  /* ================= Page ================= */
  function isValid(form, el) {
    if (el.type === 'radio') return !!form.querySelector('input[name="' + el.name + '"]:checked');
    return el.checkValidity() && el.value.trim() !== '';
  }

  function markField(el, valid) {
    var field = el.closest('.field') || el.closest('.fieldset-block');
    if (field) field.classList.toggle('has-error', !valid);
    if (valid) { el.removeAttribute('aria-invalid'); } else { el.setAttribute('aria-invalid', 'true'); }
  }

  function labelFor(el) {
    var field = el.closest('.field');
    var label = field && field.querySelector('label');
    return (label ? label.textContent : el.name || 'This field').replace('*', '').trim();
  }

  /* Validate a scope (a step, or the whole form). Returns true when clean;
     otherwise paints inline errors, fills the summary and moves focus to it. */
  function validateScope(form, scope) {
    var bad = [];
    var seenRadios = {};
    Array.prototype.forEach.call(scope.querySelectorAll('[required]'), function (el) {
      if (el.type === 'radio') {
        if (seenRadios[el.name]) return;
        seenRadios[el.name] = true;
      }
      var valid = isValid(form, el);
      markField(el, valid);
      if (!valid) bad.push(el);
    });

    var summary = form._ffSummary;
    if (!summary) return bad.length === 0;

    if (bad.length) {
      // The submit handler reuses this box to report a send failure, so put the
      // validation heading back before listing fields.
      summary.querySelector('h3').textContent = 'There is a problem';
      summary.querySelector('ul').innerHTML = bad.map(function (el) {
        return '<li><a href="#' + el.id + '">' + labelFor(el) + '</a></li>';
      }).join('');
      summary.classList.add('is-visible');
      summary.focus({ preventScroll: false });
      return false;
    }
    summary.classList.remove('is-visible');
    summary.querySelector('ul').innerHTML = '';
    return true;
  }

  function initPage(root) {
    root = root || document;

    /* ---------- Reveal on scroll ---------- */
    var revealables = root.querySelectorAll('.reveal');
    if (revealables.length) {
      if (reduced || !('IntersectionObserver' in window)) {
        Array.prototype.forEach.call(revealables, function (el) { el.classList.add('is-in'); });
      } else {
        var ro = new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-in');
              ro.unobserve(entry.target);
            }
          });
        }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
        Array.prototype.forEach.call(revealables, function (el) { ro.observe(el); });
      }
    }

    /* ---------- Animated counters ---------- */
    var counters = root.querySelectorAll('[data-count]');
    if (counters.length && 'IntersectionObserver' in window && !reduced) {
      var co = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var el = entry.target;
          co.unobserve(el);
          var target = parseFloat(el.getAttribute('data-count'));
          var dec = parseInt(el.getAttribute('data-decimals') || '0', 10);
          var prefix = el.getAttribute('data-prefix') || '';
          var suffix = el.getAttribute('data-suffix') || '';
          var start = null;
          var dur = 1200;
          var tick = function (ts) {
            if (start === null) start = ts;
            var p = Math.min((ts - start) / dur, 1);
            var eased = 1 - Math.pow(1 - p, 3);
            el.textContent = prefix + (target * eased).toLocaleString('en-US', {
              minimumFractionDigits: dec, maximumFractionDigits: dec
            }) + suffix;
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        });
      }, { threshold: 0.4 });
      Array.prototype.forEach.call(counters, function (el) { co.observe(el); });
    }

    /* ---------- Accessible form validation ----------
       Inline error per field linked with aria-describedby, a focusable error
       summary at the top of the form linking to each invalid field, and
       validation on blur rather than submit-only. */
    var forms = root.querySelectorAll('form[data-ff-form]');

    Array.prototype.forEach.call(forms, function (form, fi) {
      Array.prototype.forEach.call(form.querySelectorAll('.field-error'), function (err, ei) {
        var field = err.closest('.field');
        var control = field && field.querySelector('input, select, textarea');
        if (!control) return;
        if (!err.id) err.id = (form.id || 'f' + fi) + '-err-' + ei;
        var described = (control.getAttribute('aria-describedby') || '').split(' ').filter(Boolean);
        if (described.indexOf(err.id) === -1) described.push(err.id);
        control.setAttribute('aria-describedby', described.join(' '));
        if (!control.id) control.id = (form.id || 'f' + fi) + '-ctl-' + ei;
      });

      var summary = document.createElement('div');
      summary.className = 'form-errors';
      summary.setAttribute('role', 'alert');
      summary.setAttribute('tabindex', '-1');
      summary.innerHTML = '<h3>There is a problem</h3><ul></ul>';
      form.insertBefore(summary, form.firstChild);
      form._ffSummary = summary;

      form.addEventListener('blur', function (e) {
        if (e.target.matches && e.target.matches('[required]')) markField(e.target, isValid(form, e.target));
      }, true);
      form.addEventListener('input', function (e) {
        var field = e.target.closest && e.target.closest('.field');
        if (field) { field.classList.remove('has-error'); e.target.removeAttribute('aria-invalid'); }
      });
      form.addEventListener('change', function (e) {
        if (e.target.type === 'radio') {
          var block = e.target.closest('.field');
          if (block) block.classList.remove('has-error');
        }
      });
    });

    /* ---------- Multi-step forms ---------- */
    Array.prototype.forEach.call(root.querySelectorAll('[data-multistep]'), function (form) {
      var steps = form.querySelectorAll('.fstep');
      var bar = form.querySelector('.steps-bar .bar i');
      var count = form.querySelector('.steps-bar .count');
      var idx = 0;

      var paint = function () {
        Array.prototype.forEach.call(steps, function (s, i) { s.classList.toggle('is-active', i === idx); });
        if (bar) bar.style.width = ((idx + 1) / steps.length * 100) + '%';
        if (count) count.textContent = 'Step ' + (idx + 1) + ' of ' + steps.length;
        var focusable = steps[idx].querySelector('input:not([type=hidden]), select, textarea');
        if (focusable && idx > 0) focusable.focus({ preventScroll: true });
      };

      form.addEventListener('click', function (e) {
        var next = e.target.closest('[data-next]');
        var back = e.target.closest('[data-back]');
        if (next) {
          e.preventDefault();
          if (!validateScope(form, steps[idx])) return;
          idx = Math.min(idx + 1, steps.length - 1);
          paint();
        }
        if (back) {
          e.preventDefault();
          idx = Math.max(idx - 1, 0);
          paint();
        }
      });

      paint();
    });

    /* ---------- Form submission ---------- */
    Array.prototype.forEach.call(forms, function (form) {
      form.addEventListener('submit', function (e) {
        var hp = form.querySelector('.hp input');
        if (hp && hp.value) { e.preventDefault(); return; } // honeypot

        var scope = form.querySelector('.fstep.is-active') || form;

        /* Hosts that capture the POST themselves and need a plain browser
           submission (static.app's `static-form`, or an explicit opt-in).
           Validate, then get out of the way. Netlify is handled below, by
           posting in the background so the inline success state survives. */
        if (form.hasAttribute('static-form') || form.hasAttribute('data-native-submit')) {
          if (!validateScope(form, scope)) e.preventDefault();
          return;
        }

        e.preventDefault();
        if (!validateScope(form, scope)) return;

        /* Carry attribution into the hidden inputs so it is submitted with the
           form. These exist in the markup because Netlify only records fields
           it saw in the deployed HTML. */
        Object.keys(stored).forEach(function (k) {
          var field = form.querySelector('input[name="' + k + '"]');
          if (field) field.value = stored[k];
        });
        var stamp = form.querySelector('input[name="submitted_at"]');
        if (stamp) stamp.value = new Date().toISOString();

        var btn = form.querySelector('[type=submit]');
        var original = btn ? btn.innerHTML : '';
        if (btn) { btn.disabled = true; btn.innerHTML = 'Sending…'; }

        var payload = {};
        new FormData(form).forEach(function (v, k) {
          if (payload[k]) { payload[k] = [].concat(payload[k], v); } else { payload[k] = v; }
        });
        Object.keys(stored).forEach(function (k) { payload[k] = stored[k]; });
        payload.submitted_at = new Date().toISOString();

        var endpoint = form.getAttribute('data-endpoint');
        var isNetlify = form.hasAttribute('data-netlify');
        var finish = function () {
          if (window.dataLayer) {
            window.dataLayer.push({ event: 'generate_lead', form_id: form.id || 'ff_form' });
          }
          /* Send them to the post-submission page rather than swapping in an
             inline confirmation. It says what happens next, asks for the
             walkthrough while intent is at its highest, and shows the other
             free deliverables — none of which fits in the panel they just
             filled in. ?need carries what they asked for so that offer leads
             the grid. The .html is rewritten to the clean URL by the host
             build, the same as every other link. */
          var dest = '/thank-you.html';
          var need = needSlug(form);
          window.location.href = dest + (need ? '?need=' + need : '');
        };

        /* If the host refuses the submission, hand the enquiry back to the
           visitor rather than losing it: keep everything they typed on screen,
           offer a prefilled email and the phone number, and log the status so
           the cause is diagnosable from the console. */
        var failed = function (status) {
          if (btn) { btn.disabled = false; btn.innerHTML = original; }
          var skip = ['form-name', 'company_website_hp', 'routed_to', 'gclid',
                      'fbclid', 'landing_page', 'referrer', 'submitted_at'];
          var lines = Object.keys(payload).filter(function (k) {
            return payload[k] && skip.indexOf(k) === -1 && k.indexOf('utm_') !== 0;
          }).map(function (k) { return k.replace(/_/g, ' ') + ': ' + payload[k]; });
          var mail = 'mailto:' + CONTACT_EMAIL +
            '?subject=' + encodeURIComponent('Enquiry from the website') +
            '&body=' + encodeURIComponent(lines.join('\n'));
          var box = form._ffSummary;
          if (box) {
            box.querySelector('h3').textContent = 'We could not send that';
            box.querySelector('ul').innerHTML =
              '<li>Something on our end refused it. Nothing you typed has been lost.</li>' +
              '<li><a href="' + mail + '">Send it to ' + CONTACT_EMAIL + ' instead</a></li>' +
              '<li><a href="tel:' + CONTACT_TEL + '">Or call ' + CONTACT_PHONE + '</a></li>';
            box.classList.add('is-visible');
            box.focus({ preventScroll: false });
          } else {
            window.location.href = mail;
          }
          if (window.console && console.error) {
            console.error('[Forward Framework] Form "' + (form.getAttribute('name') || form.id) +
              '" was refused (' + (status ? 'HTTP ' + status : 'network error') + '). ' +
              'On Netlify, check Project configuration \u2192 Forms \u2192 form detection is ' +
              'enabled, and that the live deploy contains this form.');
          }
        };

        if (isNetlify) {
          /* Netlify Forms accepts a urlencoded POST carrying form-name. Posting
             in the background keeps the visitor on the page for the inline
             success state.

             Try this page's own path first — that is what a no-JS submit would
             hit — then the site root as the documented alternative. Do not fall
             back to form.submit(): a host that is not processing the form
             answers a native POST with an empty 405, which shows the visitor a
             blank page and throws away everything they typed. */
          var encoded = new URLSearchParams(new FormData(form)).toString();
          var post = function (url) {
            return fetch(url, {
              method: 'POST',
              headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
              body: encoded
            });
          };
          post(window.location.pathname)
            .then(function (res) { return res.ok ? res : post('/'); })
            .then(function (res) { if (res.ok) { finish(); } else { failed(res.status); } })
            .catch(function () { failed(0); });
        } else if (endpoint && endpoint.indexOf('REPLACE') === -1) {
          fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify(payload)
          }).then(finish).catch(function () { failed(0); });
        } else {
          // Nothing wired (local preview) — log so the flow stays testable.
          console.info('[Forward Framework] Form payload (no endpoint configured):', payload);
          setTimeout(finish, 550);
        }
      });
    });

    /* ---------- Post-submission offer grid ----------
       Lift the deliverable they said they wanted to the front and mark it.
       Progressive enhancement: without this the grid still renders complete,
       in the same order as the services hub. */
    var offerGrid = root.querySelector ? root.querySelector('[data-offer-grid]') : null;
    if (offerGrid) {
      var want = (new URLSearchParams(window.location.search).get('need') || '').toLowerCase();
      if (/^[a-z][a-z-]{2,39}$/.test(want)) {
        var chosen = offerGrid.querySelector('[data-slug="' + want + '"]');
        if (chosen) {
          offerGrid.insertBefore(chosen, offerGrid.firstElementChild);
          chosen.classList.add('is-picked');
          var tag = chosen.querySelector('.offer-tag');
          if (tag) tag.textContent = 'Your pick \u00b7 ' + tag.textContent;
        }
      }
    }

    /* ---------- Automation ROI calculator ---------- */
    var calc = root.querySelector ? root.querySelector('#roi-calc') : null;
    if (calc) {
      var money = function (n) { return '$' + Math.round(n).toLocaleString('en-US'); };
      var run = function () {
        var people = parseFloat(calc.querySelector('#calc-people').value);
        var hours = parseFloat(calc.querySelector('#calc-hours').value);
        var rate = parseFloat(calc.querySelector('#calc-rate').value);

        calc.querySelector('#out-people').textContent = people;
        calc.querySelector('#out-hours').textContent = hours;
        calc.querySelector('#out-rate').textContent = '$' + rate;

        // Conservative assumption: automation removes ~65% of identified manual hours.
        var recovered = people * hours * 0.65;
        var weeklyValue = recovered * rate;
        var annual = weeklyValue * 48;

        calc.querySelector('#res-hours').textContent = Math.round(recovered).toLocaleString('en-US');
        calc.querySelector('#res-weekly').textContent = money(weeklyValue);
        calc.querySelector('#res-annual').textContent = money(annual);
        };
      Array.prototype.forEach.call(calc.querySelectorAll('input[type=range]'), function (el) {
        el.addEventListener('input', run);
      });
      run();
    }

    /* ---------- Current year ---------- */
    Array.prototype.forEach.call(document.querySelectorAll('[data-year]'), function (el) {
      el.textContent = new Date().getFullYear();
    });
  }

  window.FF = window.FF || {};
  window.FF.initPage = initPage;

  initShell();
  initPage(document);
})();
