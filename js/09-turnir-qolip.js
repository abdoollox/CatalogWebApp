/* TURNIR SAHIFALARI - YAGONA QOLIP (egasi, 2026-10-15: «har birining vizual tizimi turlicha bo'lib qolgan - yagona tizimga olib kelish kerak»;
   namuna dizayn-tizimi/turnir-tizimi/). Olti turnir (poyga, toshchalar, shaxmat, viktorina, maxluqlar jangi, duel) bir xil tartibda:
   sarlavha («KUN TURNIRI») -> turnir kartasi -> (turnir paytida - to'r) -> so'nggi g'oliblar -> MASHQ (kataklar) -> QOIDA VA SOVRINLAR
   -> O'YIN HAQIDA (har o'yinning o'ziga xos qismi) -> YOZILGANLAR -> (adminga sinov). Yangi turnir qo'shilsa - shu funksiyalar bilan quring.
   Ilova kodi bir necha faylga bo'lingan; hammasi BIR umumiy maydonda ishlaydi
   va index.html dagi TARTIBDA yuklanadi. Yuklanish paytida keyingi fayldagi
   narsani chaqirmang - tekshiruv: tools/tartib.js */
"use strict";

  var TP_T = {
    uz: { keyingi: "Keyingi turnir", ketmoqda: "Turnir ketmoqda", mashq: "Mashq", ballsiz: "Ball berilmaydi", qoida: "Qoida va sovrinlar",
          yoz: "Yozilganlar", kishi: function (n) { return n + " kishi"; }, hammasi: function (n) { return "Hammasini ko'rish (" + n + ")"; }, yigish: "Yig'ish",
          torIz: "Har bosqichdagi g'alaba uchun", orin: function (n) { return n + "-o'rin"; },
          bosq: { 2: "Final", 4: "Yarim final", 8: "Chorak", 16: "1/8 final", 32: "1/16 final" }, dost: "Do'st bilan", dostS: "Chat yoki Telegram",
          kunT: function (k) { return k + " turniri"; } },
    ru: { keyingi: "Следующий турнир", ketmoqda: "Турнир идёт", mashq: "Тренировка", ballsiz: "Без очков", qoida: "Правила и призы",
          yoz: "Записались", kishi: function (n) { return n + " чел."; }, hammasi: function (n) { return "Показать всех (" + n + ")"; }, yigish: "Свернуть",
          torIz: "За победу на каждом этапе", orin: function (n) { return n + "-е место"; },
          bosq: { 2: "Финал", 4: "Полуфинал", 8: "Четвертьфинал", 16: "1/8 финала", 32: "1/16 финала" }, dost: "С другом", dostS: "Чат или Telegram",
          kunT: function (k) { return "Турнир: " + k; } },
    en: { keyingi: "Next tournament", ketmoqda: "Tournament in progress", mashq: "Practice", ballsiz: "No points", qoida: "Rules and prizes",
          yoz: "Signed up", kishi: function (n) { return n + " players"; }, hammasi: function (n) { return "Show all (" + n + ")"; }, yigish: "Collapse",
          torIz: "For a win at each stage", orin: function (n) { return ["1st", "2nd", "3rd"][n - 1] + " place"; },
          bosq: { 2: "Final", 4: "Semi-final", 8: "Quarter-final", 16: "Round of 16", 32: "Round of 32" }, dost: "With a friend", dostS: "Chat or Telegram",
          kunT: function (k) { return k + " tournament"; } }
  };
  function tpT() { return TP_T[lang] || TP_T.uz; }

  // Bo'lim sarlavhasi: chapda nom, o'ngda qisqa izoh
  function tpSek(nom, ong) {
    var s = drEl("div", "tp-sek");
    s.appendChild(drEl("b", "", nom));
    if (ong) { s.appendChild(drEl("span", "", ong)); }
    return s;
  }

  /* Turnir kartasi. o = {lab, sar, iz (matn), holat: {matn, ok, tugma: [matn, fn]} | {asosiy: [matn, fn]}, tarix: [matn, fn]}
     Qaytaradi: karta; karta.tpIz - «qolgan vaqt» yozuvi (sahifa uni har soniyada yangilaydi). */
  function tpHero(o) {
    var box = drEl("div", "dr-hero du-hero tp-hero"), tep = drEl("div", "du-h-t"), chap = drEl("span", "du-h-m");
    chap.appendChild(drEl("small", "", o.lab || tpT().keyingi));
    chap.appendChild(drEl("b", "", o.sar || ""));
    var iz = drEl("em", "", o.iz || "");
    chap.appendChild(iz);
    tep.appendChild(chap);
    box.appendChild(tep);
    box.tpIz = iz;
    var h = o.holat;
    if (h && h.asosiy) {
      var tb = drEl("div", "du-yoz"), gb = drEl("button", "dr-btn", h.asosiy[0]);
      gb.type = "button";
      gb.addEventListener("click", h.asosiy[1]);
      tb.appendChild(gb);
      box.appendChild(tb);
    } else if (h && h.matn) {
      var yb = drEl("div", "du-yoz bor" + (h.ok ? "" : " xira"));
      yb.appendChild(drEl("b", "", h.matn));
      if (h.tugma) {
        var ch = drEl("button", "", h.tugma[0]);
        ch.type = "button";
        ch.addEventListener("click", h.tugma[1]);
        yb.appendChild(ch);
      }
      box.appendChild(yb);
    }
    if (o.tarix) {
      var hb = drEl("button", "dr-hero-q du-hero-b");
      hb.type = "button";
      hb.innerHTML = '<span class="qo-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.2 2"/></svg></span>';
      var hs = document.createElement("span");
      hs.appendChild(drEl("b", "", o.tarix[0]));
      hb.appendChild(hs);
      hb.appendChild(drEl("i", "", "›"));
      hb.addEventListener("click", o.tarix[1]);
      box.appendChild(hb);
    }
    return box;
  }
  // Yozilish holati - hamma turnirda bir xil: yozilgan / yozilmagan / yopiq
  function tpYozHolat(tr, bor, chiq, qat, yopiq, fn) {
    if (!tr) { return null; }
    if (!tr.open) { return { matn: tr.joined ? bor : yopiq, ok: !!tr.joined }; }
    if (tr.joined) { return { matn: bor, ok: true, tugma: [chiq, function () { fn(false); }] }; }
    return { asosiy: [qat, function () { fn(true); }] };
  }

  /* Mashq kataklari. k = {av: element, nom, sub, fn, dost, keng} - keng katak bitta qatorni egallaydi (poyga). */
  function tpMashq(ong, kataklar) {
    var f = document.createDocumentFragment(), q = drEl("div", "tp-tiles");
    f.appendChild(tpSek(tpT().mashq, ong));
    kataklar.forEach(function (k) {
      var b = drEl("button", "tp-tile" + (k.dost ? " dost" : "") + (k.keng ? " keng" : "") + (k.cls ? " " + k.cls : ""));
      b.type = "button";
      var av = drEl("span", "tp-av");
      if (k.av) { av.appendChild(k.av); }
      b.appendChild(av);
      var tx = drEl("span", "tp-tx");
      tx.appendChild(drEl("b", "", k.nom));
      if (k.sub) { tx.appendChild(drEl("small", "", k.sub)); }
      b.appendChild(tx);
      if (k.keng) { b.appendChild(drEl("i", "", "›")); }
      b.addEventListener("click", k.fn);
      q.appendChild(b);
    });
    f.appendChild(q);
    return f;
  }
  function tpRasm(src) { var im = document.createElement("img"); im.src = src; im.alt = ""; return im; }
  function tpTosh(cls) { return drEl("span", "tp-tosh" + (cls ? " " + cls : "")); }
  function tpDost(fn) { var t = tpT(); return { av: tpTosh("ko"), nom: t.dost, sub: t.dostS, dost: true, fn: fn }; }

  /* Qoida va sovrinlar. sov - [[ball, yozuv], ...]: 4 ta - to'r bosqichlari, 3 ta - 1-2-3-o'rin (medal ranglari). */
  function tpQoida(bandlar, sov, izoh) {
    var f = document.createDocumentFragment(), k = drEl("div", "tp-card tp-qoida");
    f.appendChild(tpSek(tpT().qoida));
    bandlar.forEach(function (m, i) {
      var r = drEl("div", "vk-q");
      r.appendChild(drEl("u", "", String(i + 1)));
      r.appendChild(drEl("span", "", m));
      k.appendChild(r);
    });
    if (sov && sov.length) {
      var q = drEl("div", "tp-sov n" + sov.length);
      sov.forEach(function (p, i) {
        var c = drEl("span", "tp-pz " + (sov.length === 3 ? "o" + (i + 1) : i === sov.length - 1 ? "o1" : i === sov.length - 2 ? "o2" : ""));
        c.appendChild(drEl("b", "", "+" + p[0]));
        c.appendChild(drEl("small", "", p[1]));
        q.appendChild(c);
      });
      k.appendChild(q);
    }
    if (izoh) { k.appendChild(drEl("p", "tp-iz", izoh)); }
    f.appendChild(k);
    return f;
  }
  // To'r bosqichlari bo'yicha sovrin: rules.points = {"16": 5, "8": 10, "4": 20, "2": 30}
  function tpTorSov(pt) {
    var t = tpT(), r = [];
    [16, 8, 4, 2].forEach(function (s) { if (pt && pt[String(s)]) { r.push([pt[String(s)], t.bosq[s]]); } });
    return r;
  }
  function tpOrinSov(pt) {
    var t = tpT();
    return [1, 2, 3].map(function (o) { return [(pt && pt[String(o)]) || 0, t.orin(o)]; });
  }

  // O'yin haqida: har o'yinning o'ziga xos qismi (afsun turlari, kartalar, taxta ko'rinishi)
  function tpHaqida(nom, ong, el) {
    var f = document.createDocumentFragment(), k = drEl("div", "tp-card tp-haq");
    f.appendChild(tpSek(nom, ong));
    k.appendChild(el);
    f.appendChild(k);
    return f;
  }

  /* Yozilganlar: fakultet gerbi + ism, ikki ustun; 8 tadan ko'p bo'lsa - «Hammasini ko'rish». */
  var TP_KOR = 8;
  function tpYoz(players, n, izoh) {
    var t = tpT(), f = document.createDocumentFragment();
    if (!players || !players.length) { return f; }
    f.appendChild(tpSek(t.yoz, t.kishi(n || players.length)));
    var k = drEl("div", "tp-card tp-yoz"), ql = drEl("div", "du-qat");
    players.forEach(function (p, i) {
      var r = drEl("span", "du-qat-p" + (p.me ? " men" : "") + (i >= TP_KOR ? " tp-ort" : ""));
      var cr = cupCrestImg(p.house, 16);
      if (cr) { r.appendChild(cr); }
      r.appendChild(drEl("b", "", p.name));
      ql.appendChild(odamLink(r, p));
    });
    k.appendChild(ql);
    if (players.length > TP_KOR) {
      var mb = drEl("button", "tp-more", t.hammasi(players.length));
      mb.type = "button";
      mb.addEventListener("click", function () {
        var och = k.classList.toggle("ochiq");
        mb.textContent = och ? t.yigish : t.hammasi(players.length);
      });
      k.appendChild(mb);
    }
    if (izoh) { k.appendChild(drEl("p", "tp-iz", izoh)); }
    f.appendChild(k);
    return f;
  }

  // Faqat adminga: sinov o'yini (kompyuter bilan, turnir oqimi)
  function tpSinov(nom, izoh, fn) {
    var sb = drEl("button", "pg-mashq pg-sinov");
    sb.type = "button";
    var sm = drEl("span", "");
    sm.appendChild(drEl("b", "", nom));
    sm.appendChild(drEl("small", "", izoh));
    sb.appendChild(sm);
    sb.appendChild(drEl("i", "", "›"));
    sb.addEventListener("click", fn);
    return sb;
  }
  // «Seshanba, 22:00» - turnir vaqtidan (Toshkent)
  function tpKun(ts, kunlar) {
    var d = new Date((ts + 5 * 3600) * 1000), k = kunlar[d.getUTCDay()];
    return k.charAt(0).toUpperCase() + k.slice(1) + ", " + ("0" + d.getUTCHours()).slice(-2) + ":" + ("0" + d.getUTCMinutes()).slice(-2);
  }
