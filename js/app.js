/* Digital business card behaviour. Plain JavaScript, no frameworks, no tracking. */
(function () {
  "use strict";

  var cfg = window.CARD_CONFIG || {};
  var PROFILE_URL = cfg.PROFILE_URL || location.href.split("#")[0];
  var SHARE_TITLE = "Abdullah Al Shams | Air Freight Analyst | B-GOLS Limited";
  var SHARE_TEXT = "Abdullah Al Shams, Air Freight Analyst at B-GOLS Limited. View and save my contact:";
  var MAP_QUERY = "B&T Nehaleeya Tower, Holding No. 80B, Kemal Ataturk Avenue, Banani, Dhaka-1213, Bangladesh";

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  // ---------- loader ----------
  // Opening animation: keep the B-GOLS intro up for about 2.5 s (shorter for #qr links and reduced motion),
  // then reveal the card once the page has loaded. Never longer than 4 s, even on a slow network.
  var quick = location.hash === "#qr" || (window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches);
  var introDone = false, pageLoaded = document.readyState === "complete";
  function ready() { document.body.classList.add("ready"); }
  function check() { if (introDone && pageLoaded) ready(); }
  setTimeout(function () { introDone = true; check(); }, quick ? 600 : 2500);
  if (!pageLoaded) window.addEventListener("load", function () { pageLoaded = true; check(); });
  setTimeout(ready, 4000);

  // ---------- profile URL text ----------
  $$("[data-profile-url]").forEach(function (el) { el.textContent = PROFILE_URL.replace(/^https?:\/\//, "").replace(/\/$/, ""); });

  // ---------- toast ----------
  var toastEl = $("#toast"), toastTimer;
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove("show"); }, 2400);
  }

  // ---------- theme (light default) ----------
  var themeBtn = $("#themeBtn");
  function setTheme(t) {
    document.documentElement.setAttribute("data-theme", t);
    document.querySelector('meta[name="theme-color"]').setAttribute("content", t === "dark" ? "#0D1527" : "#FFFFFF");
    themeBtn.setAttribute("aria-label", t === "dark" ? "Switch to light mode" : "Switch to dark mode");
    try { localStorage.setItem("card-theme", t); } catch (e) {}
  }
  setTheme(document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light");
  themeBtn.addEventListener("click", function () {
    setTheme(document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark");
  });

  // ---------- card flip ----------
  var flip = $("#flip"), flipLabel = $("[data-flip-label]");
  $$("[data-flip]").forEach(function (b) {
    b.addEventListener("click", function () {
      var on = flip.classList.toggle("is-flipped");
      flipLabel.textContent = on ? "Show card front" : "Show QR side";
      $(".card-front").setAttribute("aria-hidden", on ? "true" : "false");
      $(".card-back").setAttribute("aria-hidden", on ? "false" : "true");
    });
  });
  $(".card-back").setAttribute("aria-hidden", "true");

  // ---------- dialogs ----------
  function openDialog(d) {
    if (typeof d.showModal === "function") d.showModal(); else d.setAttribute("open", "");
  }
  function closeDialog(d) {
    if (typeof d.close === "function") d.close(); else d.removeAttribute("open");
  }
  $$("dialog").forEach(function (d) {
    $$("[data-close]", d).forEach(function (b) { b.addEventListener("click", function () { closeDialog(d); }); });
    d.addEventListener("click", function (e) { if (e.target === d) closeDialog(d); }); // tap on backdrop
  });

  var shareSheet = $("#shareSheet");
  $$("[data-open-share]").forEach(function (b) { b.addEventListener("click", function () { openDialog(shareSheet); }); });
  $("#wechatBtn").addEventListener("click", function () { openDialog($("#wechatSheet")); });

  // ---------- share links ----------
  var enc = encodeURIComponent;
  var msg = SHARE_TEXT + " " + PROFILE_URL;
  $("#shWhatsApp").href = "https://wa.me/?text=" + enc(msg);
  $("#shTelegram").href = "https://t.me/share/url?url=" + enc(PROFILE_URL) + "&text=" + enc(SHARE_TEXT);
  $("#shLinkedIn").href = "https://www.linkedin.com/sharing/share-offsite/?url=" + enc(PROFILE_URL);
  $("#shEmail").href = "mailto:?subject=" + enc(SHARE_TITLE) + "&body=" + enc(msg);
  // "sms:?&body=" is accepted by both Android and iOS messaging apps.
  $("#shSms").href = "sms:?&body=" + enc(msg);

  // ---------- native share ----------
  var nativeBtn = $("#nativeShareBtn");
  if (navigator.share) {
    nativeBtn.hidden = false;
    nativeBtn.addEventListener("click", function () {
      navigator.share({ title: SHARE_TITLE, text: SHARE_TEXT, url: PROFILE_URL }).catch(function () { /* user cancelled */ });
    });
  }

  // Share the QR image itself where the browser supports file sharing.
  var shareQrBtn = $("#shareQrBtn");
  if (navigator.canShare && window.File) {
    try {
      if (navigator.canShare({ files: [new File([""], "qr.png", { type: "image/png" })] })) {
        shareQrBtn.hidden = false;
        shareQrBtn.addEventListener("click", function () {
          fetch("assets/qr/profile-qr.png")
            .then(function (r) { return r.blob(); })
            .then(function (blob) {
              var file = new File([blob], "Abdullah-Al-Shams-QR.png", { type: "image/png" });
              return navigator.share({ files: [file], title: SHARE_TITLE, text: msg });
            })
            .catch(function (e) { if (e && e.name !== "AbortError") toast("Could not share the image. Use Download instead."); });
        });
      }
    } catch (e) { /* not supported */ }
  }

  // ---------- copy to clipboard (with fallbacks) ----------
  function copyText(text, okMsg) {
    function legacy() {
      var ta = document.createElement("textarea");
      ta.value = text; ta.setAttribute("readonly", ""); ta.style.position = "fixed"; ta.style.opacity = "0";
      document.body.appendChild(ta); ta.select(); ta.setSelectionRange(0, text.length);
      var ok = false;
      try { ok = document.execCommand("copy"); } catch (e) {}
      document.body.removeChild(ta);
      if (ok) toast(okMsg); else window.prompt("Copy this:", text);
    }
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(function () { toast(okMsg); }, legacy);
    } else legacy();
  }
  $("#copyBtn").addEventListener("click", function () { copyText(PROFILE_URL, "Profile link copied"); });
  $("#copyNumBtn").addEventListener("click", function () { copyText("+8801335134471", "Mobile number copied"); });

  // ---------- save contact feedback ----------
  $$('a[href="contact.vcf"]').forEach(function (a) {
    a.addEventListener("click", function () { toast("Opening contact file. Confirm on your phone to save."); });
  });

  // ---------- click-to-load map (no Google request until the visitor asks) ----------
  $("#mapBtn").addEventListener("click", function () {
    var f = document.createElement("iframe");
    f.title = "Map: B-GOLS Limited office, Banani, Dhaka";
    f.loading = "lazy";
    f.referrerPolicy = "no-referrer-when-downgrade";
    f.src = "https://maps.google.com/maps?q=" + enc(MAP_QUERY) + "&z=16&output=embed";
    var box = $("#map"); box.innerHTML = ""; box.appendChild(f);
  });

  // ---------- Add to Home Screen ----------
  var deferredPrompt = null, installBtn = $("#installBtn");
  window.addEventListener("beforeinstallprompt", function (e) {
    e.preventDefault(); deferredPrompt = e; installBtn.hidden = false;
  });
  installBtn.addEventListener("click", function () {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    deferredPrompt.userChoice.finally(function () { deferredPrompt = null; installBtn.hidden = true; });
  });
  window.addEventListener("appinstalled", function () { installBtn.hidden = true; toast("Added to Home Screen"); });

  // ---------- offline support ----------
  if ("serviceWorker" in navigator && (location.protocol === "https:" || location.hostname === "localhost")) {
    window.addEventListener("load", function () { navigator.serviceWorker.register("sw.js").catch(function () {}); });
  }
})();
