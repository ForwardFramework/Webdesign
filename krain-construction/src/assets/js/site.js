/* Krain Construction — site behaviour. No dependencies. ~5KB. */
(function () {
  "use strict";
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------------------------------------------------- sticky header */
  var header = $(".header");
  if (header) {
    var onScroll = function () { header.classList.toggle("is-stuck", window.scrollY > 8); };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ------------------------------------------------------------ desktop nav */
  $$(".nav-item").forEach(function (item) {
    var btn = $("button", item);
    if (!btn) return;
    var close = function () { item.dataset.open = "false"; btn.setAttribute("aria-expanded", "false"); };
    var open = function () { item.dataset.open = "true"; btn.setAttribute("aria-expanded", "true"); };
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      item.dataset.open === "true" ? close() : open();
    });
    item.addEventListener("mouseenter", open);
    item.addEventListener("mouseleave", close);
    item.addEventListener("focusout", function (e) {
      if (!item.contains(e.relatedTarget)) close();
    });
    document.addEventListener("click", function (e) { if (!item.contains(e.target)) close(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") close(); });
  });

  /* ------------------------------------------------------------- mobile nav */
  var burger = $(".burger"), mnav = $(".mobile-nav");
  if (burger && mnav) {
    var toggleNav = function (force) {
      var open = typeof force === "boolean" ? force : burger.getAttribute("aria-expanded") !== "true";
      burger.setAttribute("aria-expanded", String(open));
      mnav.classList.toggle("is-open", open);
      document.documentElement.style.overflow = open ? "hidden" : "";
    };
    burger.addEventListener("click", function () { toggleNav(); });
    $$("a", mnav).forEach(function (a) { a.addEventListener("click", function () { toggleNav(false); }); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") toggleNav(false); });
  }

  /* ============================================================================
     Everything below is scoped to a view root so it can be re-run after the
     single-file preview swaps pages in. On the static site it runs once.
     ========================================================================== */
  window.krainInitPage = function (root) {
    root = root || document;
    var $r = function (s) { return root.querySelector(s); };
    var $$r = function (s) { return Array.prototype.slice.call(root.querySelectorAll(s)); };

  /* ------------------------------------------------------- scroll reveal */
  var revealables = $$r(".reveal");
  if (revealables.length) {
    if (reduce || !("IntersectionObserver" in window)) {
      revealables.forEach(function (el) { el.classList.add("in"); });
    } else {
      var ro = new IntersectionObserver(function (entries) {
        entries.forEach(function (en, i) {
          if (!en.isIntersecting) return;
          setTimeout(function () { en.target.classList.add("in"); }, Math.min(i * 70, 350));
          ro.unobserve(en.target);
        });
      }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
      revealables.forEach(function (el) { ro.observe(el); });
    }
  }

  /* ---------------------------------------------------------- stat counters */
  var counters = $$r("[data-count]");
  if (counters.length && "IntersectionObserver" in window) {
    var co = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var el = en.target, target = parseFloat(el.dataset.count),
            pre = el.dataset.prefix || "", suf = el.dataset.suffix || "",
            dec = (el.dataset.count.split(".")[1] || "").length;
        co.unobserve(el);
        if (reduce) { el.textContent = pre + target.toFixed(dec) + suf; return; }
        var start = null, dur = 1400;
        var tick = function (ts) {
          if (!start) start = ts;
          var p = Math.min((ts - start) / dur, 1);
          var eased = 1 - Math.pow(1 - p, 3);
          el.textContent = pre + (target * eased).toFixed(dec) + suf;
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      });
    }, { threshold: 0.4 });
    counters.forEach(function (el) { co.observe(el); });
  }

  /* -------------------------------------------------------- gallery filters */
  var filters = $$r(".filter");
  if (filters.length) {
    filters.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var cat = btn.dataset.filter;
        filters.forEach(function (b) { b.setAttribute("aria-pressed", String(b === btn)); });
        $$r(".shot").forEach(function (fig) {
          fig.hidden = !(cat === "all" || fig.dataset.cat === cat);
        });
      });
    });
  }

  /* -------------------------------------------------------------- lightbox */
  var box = $r(".lightbox");
  if (box && typeof box.showModal === "function") {
    $$r(".shot").forEach(function (fig) {
      var open = function () {
        $r(".lightbox-inner .art-slot").innerHTML = $("svg", fig).outerHTML;
        $r(".lightbox-cap b").textContent = fig.dataset.title;
        $r(".lightbox-cap span").textContent = fig.dataset.sub;
        box.showModal();
      };
      fig.addEventListener("click", open);
      fig.addEventListener("keydown", function (ev) {
        if (ev.key === "Enter" || ev.key === " ") { ev.preventDefault(); open(); }
      });
    });
    $r(".lightbox-close").addEventListener("click", function () { box.close(); });
    box.addEventListener("click", function (e) { if (e.target === box) box.close(); });
  }

  /* ------------------------------------------------------- multi-step form */
  $$r("form[data-quote]").forEach(function (form) {
    var steps = $$(".fstep", form),
        bars = $$(".progress i", form),
        current = 0,
        endpoint = form.dataset.endpoint || "";

    var setStep = function (i) {
      current = i;
      steps.forEach(function (s, n) { s.classList.toggle("on", n === i); });
      bars.forEach(function (b, n) { b.classList.toggle("on", n <= i); });
      var lbl = $(".step-label b", form);
      if (lbl) lbl.textContent = String(i + 1);
      if (i > 0) {
        var f = $("input,select,textarea", steps[i]);
        if (f) try { f.focus({ preventScroll: true }); } catch (e) { f.focus(); }
      }
    };

    var fail = function (field, msg) {
      field.setAttribute("aria-invalid", "true");
      var e = field.closest(".field, fieldset") && $(".err", field.closest(".field, fieldset"));
      if (e) { e.textContent = msg; e.classList.add("on"); }
    };
    var clear = function (field) {
      field.removeAttribute("aria-invalid");
      var w = field.closest(".field, fieldset"), e = w && $(".err", w);
      if (e) e.classList.remove("on");
    };

    var validate = function (step) {
      var ok = true;
      // radio groups
      $$("fieldset[data-required]", step).forEach(function (fs) {
        var chosen = $("input:checked", fs);
        var e = $(".err", fs);
        if (!chosen) {
          ok = false;
          if (e) { e.textContent = fs.dataset.msg || "Please choose an option."; e.classList.add("on"); }
        } else if (e) { e.classList.remove("on"); }
      });
      $$("input[required],select[required],textarea[required]", step).forEach(function (f) {
        if (f.type === "radio") return;
        var v = f.value.trim();
        clear(f);
        if (!v) { fail(f, "This field is required."); ok = false; return; }
        if (f.type === "email" && !/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(v)) {
          fail(f, "Enter a valid email address."); ok = false; return;
        }
        if (f.type === "tel" && v.replace(/\D/g, "").length < 10) {
          fail(f, "Enter a 10-digit phone number."); ok = false;
        }
      });
      return ok;
    };

    $$("[data-next]", form).forEach(function (b) {
      b.addEventListener("click", function () {
        if (!validate(steps[current])) { var bad = $("[aria-invalid='true'],.err.on", steps[current]); if (bad) bad.scrollIntoView({ block: "center", behavior: reduce ? "auto" : "smooth" }); return; }
        if (current < steps.length - 1) setStep(current + 1);
      });
    });
    $$("[data-back]", form).forEach(function (b) {
      b.addEventListener("click", function () { if (current > 0) setStep(current - 1); });
    });

    // Auto-advance on project-type pick (step 1 only) — fewer taps, higher completion.
    $$("input[name='project']", form).forEach(function (r) {
      r.addEventListener("change", function () {
        if (current !== 0) return;
        setTimeout(function () { if (validate(steps[0])) setStep(1); }, 220);
      });
    });

    $$("input,select,textarea", form).forEach(function (f) {
      f.addEventListener("input", function () { clear(f); });
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!validate(steps[current])) return;
      if ($(".hp input", form) && $(".hp input", form).value) return; // honeypot

      var btn = $("[data-submit]", form);
      if (btn) { btn.disabled = true; btn.dataset.label = btn.textContent; btn.textContent = "Sending…"; }

      var fd = new FormData(form);
      fd.append("page", location.pathname);
      var name = (fd.get("name") || "").toString().split(" ")[0];
      var qs = "?ref=" + encodeURIComponent(fd.get("project") || "") +
               "&n=" + encodeURIComponent(name);

      var done = function () {
        try { sessionStorage.setItem("krain_lead", JSON.stringify({
          name: fd.get("name"), project: fd.get("project"), city: fd.get("city")
        })); } catch (err) {}
        if (window.krainTrack) window.krainTrack("generate_lead", { project: fd.get("project") });
        (window.krainNavigate || function (u) { location.href = u; })(form.dataset.success + qs);
      };

      if (!endpoint) { setTimeout(done, 500); return; } // demo mode

      fetch(endpoint, { method: "POST", body: fd, headers: { Accept: "application/json" } })
        .then(done)
        .catch(function () {
          if (btn) { btn.disabled = false; btn.textContent = btn.dataset.label; }
          var e2 = $(".form-error", form);
          if (e2) { e2.textContent = "Something went wrong. Please call " + (form.dataset.phone || "us") + " and we'll take it from there."; e2.classList.add("on"); }
        });
    });

    setStep(0);
  });

  /* ------------------------------------------------ thank-you personalisation */
  var ty = $r("[data-ty]");
  if (ty) {
    var p = new URLSearchParams(location.search);
    var first = p.get("n");
    if (first) {
      var h = $r("[data-ty-name]");
      if (h) h.textContent = "Thanks, " + first.replace(/[^\w\s'-]/g, "") + " —";
    }
    var ref = p.get("ref");
    var refEl = $r("[data-ty-project]");
    if (ref && refEl) {
      refEl.textContent = ({
        "custom-home": "Custom home", "log-home": "Log or timber frame home",
        "addition": "Addition or remodel", "garage": "Garage, barn or steel building",
        "deck": "Deck or outdoor living", "roofing": "Roofing, siding or exterior"
      })[ref] || "Your project";
      var wrap = refEl.closest("[data-ty-project-wrap]");
      if (wrap) wrap.hidden = false;
    }
  }

  /* ------------------------------------------------------------- tel tracking */
  $$r('a[href^="tel:"]').forEach(function (a) {
    a.addEventListener("click", function () {
      if (window.krainTrack) window.krainTrack("phone_call", { location: a.dataset.loc || "page" });
    });
  });

  /* ------------------------------------------------------------- current year */
  $$r("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });
  };

  window.krainInitPage(document);
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
