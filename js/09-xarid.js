/* Profilning ikkinchi qatori (Nishonlar / Kolleksiya / Qobiliyatlar) va «Xaridlar» sahifasi (egasi, 2026-10-09)
   Ilova kodi bir necha faylga bo'lingan; hammasi BIR umumiy maydonda ishlaydi
   va index.html dagi TARTIBDA yuklanadi. Yuklanish paytida keyingi fayldagi
   narsani chaqirmang - tekshiruv: tools/tartib.js */
"use strict";
  var XR_TX = {
    uz: { nsh: "Nishonlar", qb: "Kolleksiya", qob: "Qobiliyatlar", ttl: "Xaridlar", kick: "Hamyon", gal: function (n) { return n + " galleon"; },
          how: "Galleon qanday olinadi?", sum: function (a, b) { return "Sizda: " + a + " ta albom, " + b + " ta kitob"; },
          s1: "Soundtrack albomlari", s2: "Kitoblar", s3: "Qo'riqxona",
          own: "Sizniki", free: "Bepul", soon: "Tez orada", price: function (n) { return n + " galleon"; },
          food: "Maxluqlarga yemish", foodS: function (g, n) { return g + " galleon = " + n + " porsiya · Qo'riqxonada olinadi"; },
          none1: "Albomlar hali yuklanmadi.", none2: "Kitoblar hali qo'shilmagan." },
    ru: { nsh: "Значки", qb: "Коллекция", qob: "Способности", ttl: "Покупки", kick: "Кошелёк", gal: function (n) { return n + " галлеонов"; },
          how: "Как получить галлеоны?", sum: function (a, b) { return "У вас: альбомов — " + a + ", книг — " + b; },
          s1: "Альбомы саундтреков", s2: "Книги", s3: "Питомник",
          own: "Ваше", free: "Бесплатно", soon: "Скоро", price: function (n) { return n + " галлеона"; },
          food: "Корм для существ", foodS: function (g, n) { return g + " галлеон = " + n + " порций · покупается в Питомнике"; },
          none1: "Альбомы ещё не загрузились.", none2: "Книги пока не добавлены." },
    en: { nsh: "Badges", qb: "Collection", qob: "Abilities", ttl: "Purchases", kick: "Purse", gal: function (n) { return n + " Galleons"; },
          how: "How do I earn Galleons?", sum: function (a, b) { return "You own " + a + " albums and " + b + " books"; },
          s1: "Soundtrack albums", s2: "Books", s3: "Sanctuary",
          own: "Yours", free: "Free", soon: "Coming soon", price: function (n) { return n + " Galleons"; },
          food: "Food for creatures", foodS: function (g, n) { return g + " Galleon = " + n + " portions · bought in the Sanctuary"; },
          none1: "Albums have not loaded yet.", none2: "No books yet." }
  };
  function xrX() { return XR_TX[lang] || XR_TX.uz; }

  /* ---------- Profil: ikkinchi qator. Eski uchta uzun qator (#nsh-sec, #qb-row, #pm-qob) DOMda qoladi va yashirin -
     ular son va rasmlarni to'ldiradi, katak bosilganda ularning o'z ishlovchisi chaqiriladi. ---------- */
  function pu2Radar() {
    var v = QOB.map(function (q) { return Math.max(0, Math.min(100, qobBall(q))); }), n = v.length, c = 39, R = 30;
    var nuqta = function (i, r) { var a = -Math.PI / 2 + i * 2 * Math.PI / n; return (c + r * Math.cos(a)).toFixed(1) + "," + (c + r * Math.sin(a)).toFixed(1); };
    var tash = [], ich = [], i;
    for (i = 0; i < n; i++) { tash.push(nuqta(i, R)); ich.push(nuqta(i, 5 + (R - 5) * v[i] / 100)); }
    return '<svg viewBox="0 0 78 78" aria-hidden="true"><circle cx="39" cy="39" r="38" fill="rgba(255,255,255,.04)" stroke="rgba(255,255,255,.18)" stroke-width="1.5"/>' +
           '<polygon points="' + tash.join(" ") + '" fill="none" stroke="rgba(255,255,255,.22)" stroke-width="1"/>' +
           '<polygon points="' + ich.join(" ") + '" fill="rgba(243,213,143,.35)" stroke="#f3d58f" stroke-width="1.6" stroke-linejoin="round"/></svg>';
  }
  function pu2Render() {
    var box = $("pu2"), pm = $("pm");
    if (!box || !pm) { return; }
    var bor = pm.classList.contains("uchlik");
    box.classList.toggle("hidden", !bor);
    if (!bor) { return; }
    var x = xrX(), orta = 0;
    try { QOB.forEach(function (q) { orta += qobBall(q); }); orta = Math.round(orta / QOB.length); } catch (e) {}
    box.innerHTML = "";
    var katak = function (lbl, rasm, qiymat, manba, svg) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "pu-c";
      var s = document.createElement("small");
      s.textContent = lbl;
      b.appendChild(s);
      var im = document.createElement("span");
      im.className = "pu-im" + (svg ? " svg" : "");
      if (svg) { im.innerHTML = svg; }
      else { var img = document.createElement("img"); img.alt = ""; img.src = rasm; im.appendChild(img); }
      b.appendChild(im);
      var t = document.createElement("b");
      t.textContent = qiymat;
      b.appendChild(t);
      b.addEventListener("click", function () { var e = $(manba); if (e) { e.click(); } });
      box.appendChild(b);
    };
    var ni = document.querySelector("#nsh-mini img"), qi = document.querySelector("#qb-row-im img");
    katak(x.nsh, ni ? ni.src : IMG_DIR + "nishon/film_1.webp", ($("nsh-cnt").textContent || "—"), "nsh-sec");
    katak(x.qb, qi ? qi.src : IMG_DIR + "qurbaqa/dumbledore.webp", ($("qb-row-s").textContent || "—"), "qb-row");
    katak(x.qob, "", orta + " / 100", "pm-qob", pu2Radar());
    // Hamyon kartasi endi «Xaridlar» sahifasini ochadi (ilgari - kubok)
    $("pm-wal").onclick = function () { pmHide(); xrOpen(); };
  }
  var pu2Kuz = null;
  function pu2Kuzat() {
    if (pu2Kuz || !window.MutationObserver) { return; }
    pu2Kuz = new MutationObserver(function () { clearTimeout(pu2Kuzat.t); pu2Kuzat.t = setTimeout(function () { try { pu2Render(); } catch (e) {} }, 60); });
    ["nsh-sec", "qb-row", "pm"].forEach(function (id) {
      var e = $(id);
      if (e) { pu2Kuz.observe(e, id === "pm" ? { attributes: true, attributeFilter: ["class"] } : { childList: true, subtree: true, characterData: true }); }
    });
  }

  /* ---------- «Xaridlar» sahifasi: sotib olingan va olinishi mumkin bo'lgan narsalar bir joyda ----------
     Albomlar (js/06-soundtrack.js: msData, msBuyAsk), kitoblar (js/07-kitoblar.js: ktData, ktBuyAsk), maxluq yemishi
     (Qo'riqxonaga yo'l). Sotib olishning o'zi o'sha modullarda - bu yerda faqat ro'yxat. Yangi sotiladigan narsa
     qo'shilsa shu sahifaga bo'lim qo'shing. */
  var xrTm = null;
  function xrOpen() {
    drShowGame("scr-xarid");
    xrRender();
    try { walLoad(function () { if (!$("scr-xarid").classList.contains("hidden")) { xrRender(); } }); } catch (e) {}
    clearInterval(xrTm);
    xrTm = setInterval(function () {
      var s = $("scr-xarid");
      if (s.classList.contains("hidden")) { clearInterval(xrTm); return; }
      // boshqa sahifa ochilgan bo'lsa (kubok, albom, kitob, qo'riqxona...) - bu sahifa yopiladi
      var boshqa = ["scr-cup", "scr-album", "scr-kitob", "scr-qoriq", "scr-hub", "scr-cat", "pm"].some(function (id) { var e = $(id); return e && !e.classList.contains("hidden"); });
      if (boshqa) { s.classList.add("hidden"); clearInterval(xrTm); return; }
      xrRender();
    }, 1200);
    try { window.scrollTo(0, 0); } catch (e) {}
  }
  function xrYop() { clearInterval(xrTm); $("scr-xarid").classList.add("hidden"); }
  function xrRender() {
    var x = xrX(), box = $("xr-list"), gal = 0;
    try { gal = pmGal(); } catch (e) {}
    $("xr-kick").textContent = x.kick;
    $("xr-ttl").textContent = x.ttl;
    $("xr-gal").textContent = x.gal(gal);
    $("xr-how").textContent = x.how;
    var alb = [], kit = [], na = 0, nk = 0;
    try { alb = msAlbums(); } catch (e) {}
    try { kit = KT_ORDER.filter(function (id) { return ktState(id) !== "soon"; }); } catch (e) {}
    alb.forEach(function (id) { if (!msLocked(id)) { na++; } });
    kit.forEach(function (id) { if (ktState(id) === "") { nk++; } });
    var imzo = [lang, gal, alb.map(function (id) { return id + (msLocked(id) ? 0 : 1); }).join(""), kit.map(function (id) { return id + ktState(id); }).join("")].join("|");
    if (box.getAttribute("data-i") === imzo) { return; }          // o'zgarmagan bo'lsa qayta chizilmaydi
    box.setAttribute("data-i", imzo);
    $("xr-sum").textContent = x.sum(na, nk);
    box.innerHTML = "";
    var bolim = function (nom) { var h = document.createElement("div"); h.className = "hg-t"; h.textContent = nom; box.appendChild(h); var g = document.createElement("div"); g.className = "xr-grid"; box.appendChild(g); return g; };
    var narsa = function (g, rasm, nom, holat, matn, fn, kitob) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "xr-i " + holat + (kitob ? " kitob" : "");
      var ph = document.createElement("span");
      ph.className = "xr-ph";
      ph.style.backgroundImage = "url(" + rasm + ")";
      b.appendChild(ph);
      var t = document.createElement("b");
      t.textContent = nom;
      b.appendChild(t);
      var s = document.createElement("small");
      s.textContent = matn;
      b.appendChild(s);
      b.addEventListener("click", fn);
      g.appendChild(b);
    };
    var g1 = bolim(x.s1);
    if (!alb.length) { g1.outerHTML = '<p class="rk-bosh">' + x.none1 + "</p>"; }
    alb.forEach(function (id) {
      var qulf = msLocked(id);
      narsa(g1, msCover(id), msName(id), qulf ? "sot" : "bor", qulf ? x.price(msPrice) : x.own, function () {
        if (msLocked(id)) { msBuyAsk(id); } else { xrYop(); msOpenAlbum(id); }
      });
    });
    var g2 = bolim(x.s2);
    if (!kit.length) { g2.outerHTML = '<p class="rk-bosh">' + x.none2 + "</p>"; }
    kit.forEach(function (id) {
      var st = ktState(id);
      narsa(g2, ktArt(id), ktName(id), st === "lock" ? "sot" : "bor", st === "lock" ? x.price(ktPrice) : x.own, function () {
        if (ktState(id) === "lock") { ktBuyAsk(id); } else { xrYop(); ktOpen(id); }
      }, true);
    });
    var h3 = document.createElement("div");
    h3.className = "hg-t"; h3.textContent = x.s3;
    box.appendChild(h3);
    var f = document.createElement("button"), P = (qrData && qrData.prices) || { gal: 1, n: 5 };
    f.type = "button";
    f.className = "fn-qr xr-food";
    f.innerHTML = '<img alt="" src="' + qrImg("gippo", 2) + '"><span><b></b><small></small></span>';
    f.querySelector("b").textContent = x.food;
    f.querySelector("small").textContent = x.foodS(P.gal, P.n);
    f.addEventListener("click", function () { xrYop(); qrHubOpen(); });
    box.appendChild(f);
  }

  function xrSetup() {
    $("xr-back").addEventListener("click", function () { xrYop(); pmOpen(); });
    $("xr-how").addEventListener("click", function () { xrYop(); try { openCup(); } catch (e) {} });
    pu2Kuzat();
  }

  xrSetup();
