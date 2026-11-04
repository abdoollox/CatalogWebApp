"use strict";
  // ===================== KANAL POSTIDAN YO'L KO'RSATISH =====================
  // Kanaldagi qo'llanma posti tugmasi (t.me/<bot>/catalog?startapp=q_<nom>) bilan kelgan odamni ilova kerakli joyga
  // O'ZI olib boradi: sahifa silliq suriladi, barmoq izi ko'rinadi va tugmalar ko'z oldida bosiladi; oxirgi qadam
  // yoritib qo'yiladi (egasi, 2026-11-04: "shu qadamda paydo bo'lib qolib emas, tugmalar bosilib borsin").
  // Qadam: ["t", tanlovchi, zaxira] - bosish (topilmasa zaxira funksiya), ["k", tanlovchi] - yoritib ko'rsatish, ["f", funksiya].
  var yhYol = null, yhIshladi = false;
  try {
    var yhSp = (tg && tg.initDataUnsafe && tg.initDataUnsafe.start_param) || "";
    if (!yhSp) {
      var yhM = /[?&#]tgWebAppStartParam=([^&#]+)/.exec((window.location.search || "") + (window.location.hash || ""));
      if (yhM) { yhSp = decodeURIComponent(yhM[1]); }
    }
    if (/^q_[a-z]+$/.test(yhSp)) { yhYol = yhSp.slice(2); yhIshladi = true; }
  } catch (e) { yhYol = null; }

  function yhQadamlar(k) {
    var uy = false;
    try { uy = hasHouse(); } catch (e) {}
    var xat = [["t", "#scr-cat #hogc", goWorld], ["k", "#lt #lt-go"]];
    if (k === "yukla") { return [["t", "#rows .card:not(.soon)"], ["k", "#scr-pleyer #pl-bot"]]; }
    if (k === "pleyer") { return [["t", "#rows .card:not(.soon)"], ["k", "#scr-pleyer .pl-cta-row"]]; }
    if (k === "ost") { return [["t", "#rows .ms-row .ms-card:not(.lock)"], ["k", "#scr-album #ms-play"]]; }
    if (k === "kitob") { return [["t", "#rows .kt-shelf .kt-bk"], ["t", "#rows .kt-info .kt-go"], ["t", "#scr-kitob #kt-acts button"]]; }
    if (k === "til") { return [["t", "#scr-cat #pm-btn"], ["k", "#pm #pm-langs"]]; }
    if (k === "xat") { return uy ? [["t", "#scr-cat #world-btn", function () {}]] : xat; }
    if (k === "tayoq") { return uy ? [["t", "#pm-btn, #pm-btn2"], ["k", "#pm #pu .pu-c:nth-child(2)"]] : xat; }
    if (k === "fakultet") { return uy ? [["t", "#pm-btn, #pm-btn2"], ["k", "#pm #pu .pu-c:nth-child(1)"]] : xat; }
    return [];
  }

  function yhEl(sel) {
    var a = document.querySelectorAll(sel);
    for (var i = 0; i < a.length; i++) {
      var r = a[i].getBoundingClientRect();
      if (a[i].offsetParent !== null && r.width > 0 && r.height > 0 && !a[i].classList.contains("hidden")) { return a[i]; }
    }
    return null;
  }

  function yhKut(sel, ms, cb) {
    var t0 = Date.now();
    (function f() {
      var e = yhEl(sel);
      if (e) { cb(e); return; }
      if (Date.now() - t0 > ms) { cb(null); return; }
      setTimeout(f, 150);
    })();
  }

  // Kutubxona ochilganda (openCatalog) bir marta
  // Fakultet holati serverdan kelishini kutamiz (xat/tayoqcha/fakultet yo'li saralanganga boshqacha)
  function maybeYolLink() {
    if (!yhYol) { return; }
    var k = yhYol, t0 = Date.now();
    yhYol = null;
    (function kut() {
      if (!cupData && Date.now() - t0 < 6000) { setTimeout(kut, 200); return; }
      var q = yhQadamlar(k);
      if (q.length) { setTimeout(function () { yhQadam(q, 0); }, Math.max(0, 1100 - (Date.now() - t0))); }
    })();
  }

  // Ustida oyna turibdi (nishon tabrigi, tasdiq, sifat tanlovi) - yopilishini kutamiz
  function yhOyna() {
    var a = ["nsh", "qs"];
    for (var i = 0; i < a.length; i++) { var e = $(a[i]); if (e && !e.classList.contains("hidden")) { return true; } }
    return !!document.querySelector(".hpask:not(.hidden)");
  }

  function yhQadam(q, i, n) {
    if (i >= q.length) { return; }
    if (yhOyna()) { if ((n || 0) < 200) { setTimeout(function () { yhQadam(q, i, (n || 0) + 1); }, 600); } return; }
    var s = q[i];
    yhKut(s[1], s[2] ? 1500 : 9000, function (e) {
      if (!e) {
        if (s[2]) { try { s[2](); } catch (x) {} setTimeout(function () { yhQadam(q, i + 1); }, 700); }
        return;
      }
      try { e.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" }); } catch (x) { e.scrollIntoView(); }
      setTimeout(function () {
        if (s[0] === "t") {
          yhBarmoq(e, function () {
            try { e.click(); } catch (x) {}
            setTimeout(function () { yhQadam(q, i + 1); }, 450);
          });
        } else {
          yhKorsat(e);
        }
      }, 700);
    });
  }

  // Barmoq izi: halqa paydo bo'lib, siqiladi - keyin bosiladi
  function yhBarmoq(e, keyin) {
    var r = e.getBoundingClientRect(), d = document.createElement("div");
    d.className = "yh-rg";
    d.style.left = (r.left + r.width / 2) + "px";
    d.style.top = (r.top + r.height / 2) + "px";
    document.body.appendChild(d);
    setTimeout(keyin, 520);
    setTimeout(function () { if (d.parentNode) { d.parentNode.removeChild(d); } }, 900);
  }

  // Oxirgi qadam: element yoritiladi (bir necha marta nafas oladi), odam tegsa yo'qoladi
  function yhKorsat(e) {
    var d = document.createElement("div"), t0 = Date.now(), tm = 0;
    d.className = "yh-hl";
    document.body.appendChild(d);
    function joy() {
      var r = e.getBoundingClientRect();
      d.style.left = (r.left - 6) + "px";
      d.style.top = (r.top - 6) + "px";
      d.style.width = (r.width + 12) + "px";
      d.style.height = (r.height + 12) + "px";
      if (Date.now() - t0 < 6000 && d.parentNode) { tm = requestAnimationFrame(joy); } else { yop(); }
    }
    function yop() {
      cancelAnimationFrame(tm);
      document.removeEventListener("pointerdown", yop, true);
      if (d.parentNode) { d.parentNode.removeChild(d); }
    }
    joy();
    setTimeout(function () { document.addEventListener("pointerdown", yop, true); }, 300);
  }
