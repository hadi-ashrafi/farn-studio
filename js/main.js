/* FARN Studio — interactions
   Kept light and old-browser safe: no optional chaining, no heavy
   pointer effects. Everything degrades if an API is missing. */
(function () {
  "use strict";
  var CFG = window.FARN_CONFIG;
  var I18N = window.FARN_I18N;
  var root = document.documentElement;
  function $(s, el) { return (el || document).querySelector(s); }
  function $$(s, el) { return Array.prototype.slice.call((el || document).querySelectorAll(s)); }

  root.classList.add("js");

  // low-power devices: drop the remaining decorative animations
  // (only genuinely weak devices — glass blur stays on for normal phones)
  var lowPower = (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2) ||
    (navigator.deviceMemory && navigator.deviceMemory <= 2);
  if (lowPower) root.classList.add("lite");
  var bigScreen = window.matchMedia && matchMedia("(min-width: 1000px) and (pointer: fine)").matches;

  var lang = "en", planTab = "web", filter = "all";
  function t(k) { var d = I18N[lang]; return d && d[k] !== undefined ? d[k] : I18N.en[k]; }
  function L(o) { return o ? (o[lang] !== undefined ? o[lang] : o.en) : ""; }
  function num(n) { return Number(n).toLocaleString(lang === "fa" ? "fa-IR" : "en-US"); }
  function digits(str) { return lang === "fa" ? String(str).replace(/\d/g, function (d) { return "۰۱۲۳۴۵۶۷۸۹"[d]; }) : String(str); }
  // Persian prices read better as "۱۸ میلیون تومان"
  function toman(n) {
    if (n >= 1e6) return { amt: num(+(n / 1e6).toFixed(1)), unit: t("pricing.million") };
    return { amt: num(n), unit: "" };
  }
  function year(y) { return lang === "fa" ? Number(y).toLocaleString("fa-IR", { useGrouping: false }) : String(y); }
  var store = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  };
  var ARROW = '<svg class="ar" viewBox="0 0 16 16" width="12" height="12" aria-hidden="true"><path d="M4 12 12 4M5.5 4H12v6.5" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>';

  /* ================= language ================= */
  function applyLang(next, persist) {
    lang = next === "fa" ? "fa" : "en";
    root.lang = lang;
    root.dir = lang === "fa" ? "rtl" : "ltr";
    document.title = t("meta.title");
    $$("[data-i18n]").forEach(function (el) { var v = t(el.getAttribute("data-i18n")); if (typeof v === "string") el.textContent = v; });
    $$("[data-i18n-html]").forEach(function (el) { el.innerHTML = t(el.getAttribute("data-i18n-html")); });
    if (persist) store.set("farn-lang", lang);
    if (window.history && history.replaceState) {
      var q = location.search.replace(/([?&])lang=[^&]*&?/, "$1").replace(/[?&]$/, "");
      history.replaceState(null, "", location.pathname + (q ? q + "&" : "?") + "lang=" + lang + location.hash);
    }
    $$(".svc .num").forEach(function (el) {
      if (!el.getAttribute("data-n")) el.setAttribute("data-n", el.textContent);
      el.textContent = digits(el.getAttribute("data-n"));
    });
    renderWork(); renderPlans(); renderPlanSelect(); renderVideos();
  }
  $$(".js-lang").forEach(function (b) { b.addEventListener("click", function () { applyLang(lang === "en" ? "fa" : "en", true); }); });
  var m = location.search.match(/[?&]lang=(en|fa)/);
  var initial = m ? m[1] : (store.get("farn-lang") || ((navigator.language || "").indexOf("fa") === 0 ? "fa" : "en"));

  /* ================= header & menu ================= */
  var header = $("#header");
  var ticking = false;
  window.addEventListener("scroll", function () {
    if (ticking) return; ticking = true;
    requestAnimationFrame(function () { header.classList.toggle("scrolled", window.pageYOffset > 20); ticking = false; });
  }, { passive: true });
  header.classList.toggle("scrolled", window.pageYOffset > 20);

  var burger = $("#burger"), menu = $("#menu");
  function setMenu(open) {
    burger.setAttribute("aria-expanded", open ? "true" : "false");
    menu.classList.toggle("open", open);
    document.body.classList.toggle("lock", open);
  }
  burger.addEventListener("click", function () { setMenu(burger.getAttribute("aria-expanded") !== "true"); });
  $$("a", menu).forEach(function (a) { a.addEventListener("click", function () { setMenu(false); }); });
  // tap/click anywhere outside the open menu closes it
  document.addEventListener("click", function (e) {
    if (burger.getAttribute("aria-expanded") === "true" && !menu.contains(e.target) && !burger.contains(e.target)) setMenu(false);
  });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && burger.getAttribute("aria-expanded") === "true") { setMenu(false); burger.focus(); } });

  /* ================= reveal ================= */
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { threshold: 0.1, rootMargin: "0px 0px -5% 0px" });
    $$(".reveal").forEach(function (el) { io.observe(el); });

    var navIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        $$("a", menu).forEach(function (a) { a.classList.toggle("active", a.getAttribute("href") === "#" + e.target.id); });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    ["work", "services", "pricing", "studio", "youtube", "contact"].forEach(function (id) { navIO.observe(document.getElementById(id)); });
  } else {
    $$(".reveal").forEach(function (el) { el.classList.add("in"); });
  }

  /* ================= portfolio ================= */
  var works = $("#works");

  function resolveSrc(p) {
    if (p.live) return p.live;
    if (p.github) {
      var u = p.github.user || CFG.githubUser;
      if (p.github.pages) return "https://" + u + ".github.io/" + p.github.repo + "/";
      return "https://htmlpreview.github.io/?https://github.com/" + u + "/" + p.github.repo + "/blob/" + (p.github.branch || "main") + "/" + (p.github.path || "index.html");
    }
    return p.local || null;
  }
  function sourceLink(p) {
    if (p.source) return p.source;
    if (p.github) return "https://github.com/" + (p.github.user || CFG.githubUser) + "/" + p.github.repo;
    return null;
  }
  function displayUrl(p, src) {
    if (p.live || p.github) return src.replace(/^https?:\/\//, "");
    return "farn.studio/" + (p.local || "").replace(/\/?index\.html$/, "");
  }

  function coverArt(p) {
    var a = p.accent || ["#ff6b4a", "#7c5cff"];
    if (p.category === "motion") {
      return '<div class="art">' +
        '<span class="c" style="width:70%;height:58%;left:15%;top:14%;background:radial-gradient(circle at 35% 30%,' + a[0] + ',' + a[1] + ' 70%);opacity:.85"></span>' +
        '<span class="r" style="width:16%;height:13%;left:8%;top:10%;transform:rotate(-14deg)"></span>' +
        '<span class="r" style="width:10%;height:8%;left:78%;top:62%;transform:rotate(20deg)"></span>' +
        '<span class="p"></span></div>';
    }
    // brand: a mark built on a 2x2 grid
    return '<div class="art">' +
      '<span class="r" style="width:24%;height:20%;left:24%;top:20%;background:' + a[0] + ';border:0"></span>' +
      '<span class="r" style="width:24%;height:20%;left:52%;top:20%"></span>' +
      '<span class="r" style="width:24%;height:20%;left:24%;top:44%"></span>' +
      '<span class="c" style="width:24%;height:20%;left:52%;top:44%;background:' + a[1] + '"></span>' +
      '</div>';
  }

  function renderWork() {
    works.innerHTML = CFG.projects.map(function (p, i) {
      var a = p.accent || ["#ff6b4a", "#333"];
      var src = p.category === "web" ? resolveSrc(p) : null;
      var playable = !!(src || (p.category === "motion" && p.youtubeId) || p.link);
      var inner;
      if (src) {
        inner = '<span class="wtag"><i></i>' + t("work.live") + '</span>' +
          '<div class="device"><div class="bar"><i></i><i></i><i></i></div><div class="screen"' + (bigScreen ? ' data-src="' + src + '"' : "") + '>' +
          '<div class="shot"><b></b><u></u><u></u><s></s><s></s><s></s></div></div></div>';
      } else {
        inner = coverArt(p) + (playable ? "" : '<span class="wtag">' + t("work.soon") + '</span>');
      }
      var hidden = filter !== "all" && filter !== p.category;
      return '<button class="wcard glass' + (hidden ? " hide" : "") + '" data-i="' + i + '" data-cat="' + p.category + '"' + (playable ? "" : ' aria-disabled="true"') + '>' +
        '<div class="wthumb" style="--a1:' + a[0] + '55;--a2:' + a[1] + '33">' + inner + '</div>' +
        '<div class="wmeta"><div><h3>' + L(p.title) + '</h3><small>' + t("work.cat." + p.category) + ' / ' + (p.stack || []).slice(0, 2).join(" · ") + ' · ' + year(p.year) + '</small></div>' +
        '<span class="warrow">' + ARROW + '</span></div></button>';
    }).join("");
    $$(".shot b", works).forEach(function (b) { b.style.background = b.closest(".wthumb").style.getPropertyValue("--a1").trim().slice(0, 7); });
    loadThumbs();
  }

  // On large screens only: load a real, scaled-down preview of each website
  var thumbIO = ("IntersectionObserver" in window) ? new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      thumbIO.unobserve(e.target);
      var box = e.target, f = document.createElement("iframe");
      f.src = box.getAttribute("data-src");
      f.tabIndex = -1;
      f.setAttribute("aria-hidden", "true");
      f.setAttribute("sandbox", "allow-scripts allow-same-origin");
      f.style.transform = "scale(" + box.clientWidth / 1280 + ")";
      f.onload = function () { var s = $(".shot", box); if (s) s.style.display = "none"; };
      box.appendChild(f);
    });
  }, { rootMargin: "100px" }) : null;
  function loadThumbs() { if (thumbIO) $$(".screen[data-src]", works).forEach(function (b) { thumbIO.observe(b); }); }
  window.addEventListener("resize", function () {
    $$(".screen iframe", works).forEach(function (f) { f.style.transform = "scale(" + f.parentNode.clientWidth / 1280 + ")"; });
  });

  $("#filters").addEventListener("click", function (e) {
    var b = e.target.closest(".chip"); if (!b) return;
    $$(".chip", this).forEach(function (c) { c.classList.toggle("on", c === b); });
    filter = b.getAttribute("data-filter");
    $$(".wcard", works).forEach(function (c) { c.classList.toggle("hide", filter !== "all" && c.getAttribute("data-cat") !== filter); });
    works.scrollLeft = 0;
  });


  works.addEventListener("click", function (e) {
    var c = e.target.closest(".wcard");
    if (!c || c.getAttribute("aria-disabled") === "true") return;
    var p = CFG.projects[+c.getAttribute("data-i")];
    if (p.category === "web") openViewer(p);
    else if (p.category === "motion" && p.youtubeId) openViewer(p, "https://www.youtube-nocookie.com/embed/" + p.youtubeId + "?autoplay=1&rel=0");
    else if (p.link) window.open(p.link, "_blank", "noopener");
  });

  /* ================= viewer ================= */
  var viewer = $("#viewer"), frame = $("#viewerFrame"), wrap = $("#frameWrap"), lastFocus = null;
  function setDevice(d) {
    wrap.setAttribute("data-dev", d);
    $$(".dev", viewer).forEach(function (b) { b.classList.toggle("on", b.getAttribute("data-dev") === d); });
  }
  function openViewer(p, forced) {
    var src = forced || resolveSrc(p); if (!src) return;
    lastFocus = document.activeElement;
    $("#viewerTitle").textContent = L(p.title);
    $("#viewerUrl").textContent = forced ? "youtube.com" : displayUrl(p, src);
    $("#viewerOpen").href = src;
    var repo = sourceLink(p);
    $("#viewerRepo").hidden = !repo; if (repo) $("#viewerRepo").href = repo;
    $("#devices").style.visibility = forced ? "hidden" : "";
    setDevice("desktop");
    wrap.classList.remove("loaded");
    frame.src = src;
    viewer.hidden = false;
    document.body.classList.add("lock");
    $(".icon-btn[data-close]", viewer).focus();
  }
  function closeViewer() {
    viewer.hidden = true; frame.src = "about:blank";
    document.body.classList.remove("lock");
    if (lastFocus) lastFocus.focus();
  }
  frame.addEventListener("load", function () { wrap.classList.add("loaded"); });
  viewer.addEventListener("click", function (e) {
    if (e.target.closest("[data-close]")) closeViewer();
    var d = e.target.closest(".dev"); if (d) setDevice(d.getAttribute("data-dev"));
  });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && !viewer.hidden) closeViewer(); });

  /* ================= pricing ================= */
  function renderPlans() {
    $("#plans").innerHTML = CFG.plans[planTab].map(function (pl) {
      var pr = pl.price;
      var tm = toman(pr.irt);
      var amt = lang === "fa" ? tm.amt + ' <span class="unit">' + tm.unit + " " + t("pricing.currency") + "</span>" : "$" + num(pr.usd);
      var per = pl.period === "mo" ? t("pricing.mo") : t("pricing.once");
      return '<article class="plan glass' + (pl.featured ? " featured" : "") + '">' +
        (pl.featured ? '<span class="plan-badge">' + t("pricing.popular") + '</span>' : "") +
        '<h3>' + L(pl.name) + '</h3><p class="plan-tag">' + L(pl.tagline) + '</p>' +
        '<div class="price">' + (pr.from ? '<span class="from">' + t("pricing.from") + '</span>' : "") +
        '<span class="amt">' + amt + '</span><span class="per">' + per + '</span></div>' +
        '<ul>' + L(pl.features).map(function (f) { return "<li>" + f + "</li>"; }).join("") + '</ul>' +
        '<a href="#contact" class="btn ' + (pl.featured ? "btn-accent" : "btn-ghost") + '" data-choose="' + pl.id + '">' + t("pricing.choose") + '</a>' +
        '</article>';
    }).join("");
    $("#plans").scrollLeft = 0;
    $("#planDots").innerHTML = CFG.plans[planTab].map(function (_, i) { return '<i class="' + (i ? "" : "on") + '"></i>'; }).join("");
  }
  // swipe indicator for the side-scrolling plans on phones
  var dotsTick = false;
  $("#plans").addEventListener("scroll", function () {
    if (dotsTick) return; dotsTick = true;
    requestAnimationFrame(function () {
      dotsTick = false;
      var box = $("#plans"), cards = $$(".plan", box); if (!cards.length) return;
      var step = cards[0].offsetWidth + 14, i = Math.round(Math.abs(box.scrollLeft) / step);
      $$("#planDots i").forEach(function (d, k) { d.classList.toggle("on", k === Math.min(i, cards.length - 1)); });
    });
  }, { passive: true });
  $("#planTabs").addEventListener("click", function (e) {
    var b = e.target.closest(".chip"); if (!b) return;
    $$(".chip", this).forEach(function (c) { c.classList.toggle("on", c === b); });
    planTab = b.getAttribute("data-plan");
    renderPlans();
  });
  $("#plans").addEventListener("click", function (e) {
    var a = e.target.closest("[data-choose]"); if (a) setPlan(a.getAttribute("data-choose"));
  });

  /* ================= youtube ================= */
  function renderVideos() {
    var cols = ["#ff7a4a", "#8f7cff", "#ff5c8a"];
    $("#videos").innerHTML = (CFG.videos || []).map(function (v, i) {
      var href = v.id ? "https://www.youtube.com/watch?v=" + v.id : CFG.contact.youtube;
      return '<a class="vcard glass" href="' + href + '" target="_blank" rel="noopener">' +
        '<div class="vthumb" style="--a1:' + cols[i % 3] + '55"><span class="play-btn"><svg viewBox="0 0 24 24" width="16" height="16"><path d="M8 5v14l11-7z" fill="currentColor"/></svg></span><span class="vline"></span></div>' +
        '<p>' + L(v.title) + '<small>' + (v.id ? "YouTube" : t("work.soon")) + '</small></p></a>';
    }).join("");
  }

  /* ================= about pattern (one sun per composition) ================= */
  (function () {
    var html = "";
    for (var i = 0; i < 32; i++) {
      var cls = i === 13 ? "sun-dot" : ([2, 9, 19, 27].indexOf(i) > -1 ? "d" : ([5, 22].indexOf(i) > -1 ? "v" : ([16, 30].indexOf(i) > -1 ? "t" : "")));
      html += '<span class="' + cls + '"></span>';
    }
    $("#pattern").innerHTML = html;
  })();

  /* ================= contact ================= */
  /* ---- custom dropdown: looks identical on every device/browser ---- */
  var dd = $("#planDD"), ddBtn = $("#planBtn"), ddList = $("#planList"), planInput = $("#f-plan");

  function planPrice(pl) {
    if (lang === "fa") { var tm = toman(pl.price.irt); return tm.amt + " " + tm.unit; }
    return "$" + num(pl.price.usd) + (pl.period === "mo" ? "/mo" : "");
  }
  function renderPlanSelect() {
    var html = '<li class="dd-opt" role="option" id="opt-custom" data-value="custom"><span>' + t("pricing.custom") + '</span></li>';
    ["web", "brand", "motion"].forEach(function (k) {
      html += '<li class="dd-group" role="presentation">' + t("pricing.tab." + k) + '</li>';
      html += CFG.plans[k].map(function (pl) {
        return '<li class="dd-opt" role="option" id="opt-' + pl.id + '" data-value="' + pl.id + '"><span>' + L(pl.name) + '</span><small>' + planPrice(pl) + '</small></li>';
      }).join("");
    });
    ddList.innerHTML = html;
    setPlan(planInput.value || "custom");
  }
  function setPlan(value) {
    var opt = $('.dd-opt[data-value="' + value + '"]', ddList) || $(".dd-opt", ddList);
    planInput.value = opt.getAttribute("data-value");
    $$(".dd-opt", ddList).forEach(function (o) {
      var on = o === opt;
      o.classList.toggle("selected", on);
      o.setAttribute("aria-selected", on ? "true" : "false");
    });
    var group = "";
    for (var el = opt.previousElementSibling; el; el = el.previousElementSibling) {
      if (el.classList.contains("dd-group")) { group = el.textContent + " · "; break; }
    }
    $("#planValue").textContent = group + $("span", opt).textContent;
  }
  function openDD(open) {
    dd.classList.toggle("open", open);
    ddBtn.setAttribute("aria-expanded", open ? "true" : "false");
    if (open) {
      var sel = $(".dd-opt.selected", ddList) || $(".dd-opt", ddList);
      focusOpt(sel);
    }
  }
  function focusOpt(o) {
    if (!o) return;
    $$(".dd-opt", ddList).forEach(function (x) { x.classList.toggle("active", x === o); });
    ddList.setAttribute("aria-activedescendant", o.id);
    var top = o.offsetTop, bottom = top + o.offsetHeight;
    if (top < ddList.scrollTop) ddList.scrollTop = top - 8;
    else if (bottom > ddList.scrollTop + ddList.clientHeight) ddList.scrollTop = bottom - ddList.clientHeight + 8;
  }
  ddBtn.addEventListener("click", function () { openDD(!dd.classList.contains("open")); if (dd.classList.contains("open")) ddList.focus(); });
  ddList.addEventListener("click", function (e) {
    var o = e.target.closest(".dd-opt"); if (!o) return;
    setPlan(o.getAttribute("data-value")); openDD(false); ddBtn.focus();
  });
  function ddKeys(e) {
    var opts = $$(".dd-opt", ddList), cur = $(".dd-opt.active", ddList), i = opts.indexOf(cur);
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      if (!dd.classList.contains("open")) { openDD(true); ddList.focus(); return; }
      i = e.key === "ArrowDown" ? Math.min(opts.length - 1, i + 1) : Math.max(0, i - 1);
      focusOpt(opts[i]);
    } else if (e.key === "Home" || e.key === "End") {
      e.preventDefault(); focusOpt(e.key === "Home" ? opts[0] : opts[opts.length - 1]);
    } else if ((e.key === "Enter" || e.key === " ") && dd.classList.contains("open") && cur) {
      e.preventDefault(); setPlan(cur.getAttribute("data-value")); openDD(false); ddBtn.focus();
    } else if (e.key === "Escape" || e.key === "Tab") {
      if (dd.classList.contains("open")) { openDD(false); if (e.key === "Escape") ddBtn.focus(); }
    }
  }
  ddBtn.addEventListener("keydown", ddKeys);
  ddList.addEventListener("keydown", ddKeys);
  document.addEventListener("click", function (e) { if (!dd.contains(e.target)) openDD(false); });

  var c = CFG.contact;
  $("#phoneLink").href = $("#fPhoneLink").href = "tel:" + c.phone.replace(/[^\d+]/g, "");
  $("#phoneText").textContent = $("#fPhoneText").textContent = c.phoneDisplay || c.phone;
  $("#emailLink").href = $("#fMail").href = "mailto:" + c.email;
  $("#emailText").textContent = c.email;
  $("#igLink").href = $("#fIg").href = c.instagram; $("#igText").textContent = c.instagramHandle;
  $("#ytLink").href = $("#fYt").href = $("#subLink").href = $("#mbArt").href = $("#mbLink").href = c.youtube;
  $("#ytText").textContent = c.youtubeHandle;
  $("#year").textContent = new Date().getFullYear();

  $("#contactForm").addEventListener("submit", function (e) {
    e.preventDefault();
    var msg = $("#formMsg");
    var name = $("#f-name").value.trim(), email = $("#f-email").value.trim(), body = $("#f-msg").value.trim();
    // accept Persian/Arabic digits, spaces, dashes and a leading +
    var phone = $("#f-phone").value.replace(/[۰-۹]/g, function (d) { return "۰۱۲۳۴۵۶۷۸۹".indexOf(d); })
      .replace(/[٠-٩]/g, function (d) { return "٠١٢٣٤٥٦٧٨٩".indexOf(d); }).replace(/[\s\-().]/g, "");
    var okPhone = /^\+?\d{8,15}$/.test(phone);
    var okEmail = !email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);   // optional, but must be valid if given
    $("#f-name").parentNode.classList.toggle("invalid", !name);
    $("#f-phone").parentNode.classList.toggle("invalid", !okPhone);
    $("#f-email").parentNode.classList.toggle("invalid", !okEmail);
    if (!name || !okPhone || !okEmail) {
      msg.textContent = !okPhone && name ? t("contact.f.errPhone") : (!okEmail && name && okPhone ? t("contact.f.errEmail") : t("contact.f.err"));
      msg.className = "form-msg err"; return;
    }
    var plan = $("#planValue").textContent || "-";
    var text = "Name: " + name + "\nMobile: " + phone + "\nEmail: " + (email || "-") + "\nPlan: " + plan + "\n\n" + (body || "-");
    // TODO: connect to a real backend / form service later
    location.href = "mailto:" + c.email + "?subject=" + encodeURIComponent("New project — " + name) + "&body=" + encodeURIComponent(text);
    msg.textContent = t("contact.f.ok"); msg.className = "form-msg ok";
  });

  /* ================= boot ================= */
  applyLang(initial, !!m || !!store.get("farn-lang"));
  // hero is above the fold: show it right away
  $$(".hero .reveal").forEach(function (el) { el.classList.add("in"); });
})();
