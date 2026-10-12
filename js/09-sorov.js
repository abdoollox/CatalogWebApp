/* So'rovnoma (egasi, 2026-10-12): Xogvarts bosh sahifasida, Jadval kartasi ustida. Birinchisi - turnirlar boshlanish vaqti.
   Server: hpsorov.py, POST /api/sorov. Yopiq holatda (server YOQIQ = False) faqat adminga ko'rinadi.
   «Ovoz berish» egasi rad etganlar ro'yxatida - bu so'rovnomani egasi o'zi so'radi; yangisi faqat u aytganda.
   Ilova kodi bir necha faylga bo'lingan; hammasi BIR umumiy maydonda ishlaydi
   va index.html dagi TARTIBDA yuklanadi. Yuklanish paytida keyingi fayldagi
   narsani chaqirmang - tekshiruv: tools/tartib.js */
"use strict";

  var API_SOROV = "https://bot.tizimshunos.uz/api/sorov";
  var SN_T = {
    uz: { kick: "So'rovnoma", savol: "Turnirlar soat nechada boshlansin?", izoh: "Poyga, shaxmat, viktorina va duel — hammasi shu vaqtda boshlanadi.",
          hozir: "hozirgi vaqt", ovoz: function (n) { return n + " ta ovoz"; }, sizniki: "Sizning tanlovingiz", ozgar: "Tanlovni o'zgartirsa bo'ladi",
          qoldi: function (v) { return v + " qoldi"; }, yopiq: "So'rovnoma yakunlandi", korik: "Faqat sizga ko'rinadi (hali ochilmagan)",
          kun: " kun", soat: " soat", daq: " daq", yoq: "Aloqa yo'q — qayta urinib ko'ring" },
    ru: { kick: "Опрос", savol: "Во сколько начинать турниры?", izoh: "Гонка, шахматы, викторина и дуэль — все начинаются в это время.",
          hozir: "сейчас так", ovoz: function (n) { return "Голосов: " + n; }, sizniki: "Ваш выбор", ozgar: "Выбор можно изменить",
          qoldi: function (v) { return "осталось " + v; }, yopiq: "Опрос завершён", korik: "Видно только вам (ещё не открыт)",
          kun: " дн.", soat: " ч", daq: " мин", yoq: "Нет связи — попробуйте ещё раз" },
    en: { kick: "Poll", savol: "What time should tournaments start?", izoh: "The race, chess, the quiz and the duel all start at this time.",
          hozir: "current time", ovoz: function (n) { return n + " votes"; }, sizniki: "Your choice", ozgar: "You can change your choice",
          qoldi: function (v) { return v + " left"; }, yopiq: "The poll is closed", korik: "Only you can see this (not open yet)",
          kun: " d", soat: " h", daq: " min", yoq: "No connection — please try again" }
  };
  function snT() { return SN_T[lang] || SN_T.uz; }

  var snData = null, snVaqt = 0, snKutmoqda = false, snLocal = null;

  function snSample(body) {
    if (!snLocal) { snLocal = { mine: null }; }
    if (body && body.vote != null) { snLocal.mine = String(body.vote); }
    var son = { "20": 9, "21": 31, "22": 24 }, res = { ok: true, on: true, open: true, left: 5 * 86400 + 7200, mine: snLocal.mine, preview: false,
      options: ["20", "21", "22"].map(function (k) { return { k: k }; }) };
    if (snLocal.mine) { res.options.forEach(function (o) { o.n = son[o.k] + (o.k === snLocal.mine ? 1 : 0); }); res.total = 65; }
    return res;
  }
  function snPost(body, cb) {
    if (!window.fetch) { return; }
    window.fetch(API_SOROV, { method: "POST", headers: { "Content-Type": "application/json", "X-Telegram-Init-Data": drInit() }, body: JSON.stringify(body || {}) })
      .then(function (r) { return r.json(); })
      .then(function (res) { cb(res && res.ok ? res : (MS_LOCAL ? snSample(body) : res)); })
      ["catch"](function () { cb(MS_LOCAL ? snSample(body) : null); });
  }
  // Bosh sahifa ochilganda (openHub): daqiqada bir martadan ko'p so'ralmaydi; javob faqat o'z kartasini chizadi (bosh sahifani emas)
  function snLoad() {
    snRender();
    if (snKutmoqda || Date.now() - snVaqt < 60000) { return; }
    snKutmoqda = true;
    snPost({}, function (res) {
      snKutmoqda = false;
      snVaqt = Date.now();
      if (res && res.ok) { snData = res; snRender(); }
    });
  }
  function snOvoz(k) {
    try { if (tg && tg.HapticFeedback) { tg.HapticFeedback.impactOccurred("light"); } } catch (e) {}
    snPost({ vote: k }, function (res) {
      if (res && res.ok && res.on) { snData = res; snVaqt = Date.now(); snRender(); } else { showToast(snT().yoq, "err"); }
    });
  }
  function snQoldi(sek) {
    var t = snT();
    if (sek >= 86400) { return Math.floor(sek / 86400) + t.kun; }
    if (sek >= 3600) { return Math.floor(sek / 3600) + t.soat; }
    return Math.max(1, Math.floor(sek / 60)) + t.daq;
  }
  function snRender() {
    var box = $("hub-sorov"), d = snData, t = snT();
    if (!box) { return; }
    var korsat = !!(d && d.on && kursN() >= 4);       // turnirlar 4-kursdan - so'rovnoma ham shu o'quvchilarga
    box.classList.toggle("hidden", !korsat);
    box.innerHTML = "";
    if (!korsat) { return; }
    var bosh = drEl("div", "sn-h");
    bosh.appendChild(drEl("b", "", t.kick));
    bosh.appendChild(drEl("span", "", d.preview ? t.korik : d.open ? t.qoldi(snQoldi(d.left || 0)) : t.yopiq));
    box.appendChild(bosh);
    box.appendChild(drEl("p", "sn-q", t.savol));
    box.appendChild(drEl("p", "sn-i", t.izoh));
    var natija = d.total != null && (d.mine != null || !d.open), qator = drEl("div", "sn-v"), eng = 0;
    (d.options || []).forEach(function (o) { eng = Math.max(eng, o.n || 0); });
    (d.options || []).forEach(function (o) {
      var b = drEl("button", "sn-b" + (d.mine === o.k ? " men" : "") + (natija && eng > 0 && (o.n || 0) === eng ? " eng" : ""));
      b.type = "button";
      b.appendChild(drEl("b", "", o.k + ":00"));
      if (natija) {
        var foiz = d.total > 0 ? Math.round((o.n || 0) * 100 / d.total) : 0, ch = drEl("span", "sn-ch"), ich = drEl("i", "");
        ich.style.width = foiz + "%";
        ch.appendChild(ich);
        b.appendChild(ch);
        b.appendChild(drEl("em", "", foiz + "%"));
      } else if (o.k === "21") {
        b.appendChild(drEl("small", "", t.hozir));
      }
      if (d.open) { b.addEventListener("click", function () { if (d.mine !== o.k) { snOvoz(o.k); } }); } else { b.disabled = true; }
      qator.appendChild(b);
    });
    box.appendChild(qator);
    if (natija) { box.appendChild(drEl("p", "sn-f", t.ovoz(d.total) + (d.open && d.mine != null ? " · " + t.ozgar : ""))); }
  }
