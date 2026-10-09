/* Issiqxona: har o'quvchining o'z o'simliklari (egasi, 2026-10-09) - Qo'riqxonaning «egizagi»
   Ilova kodi bir necha faylga bo'lingan; hammasi BIR umumiy maydonda ishlaydi
   va index.html dagi TARTIBDA yuklanadi. Yuklanish paytida keyingi fayldagi
   narsani chaqirmang - tekshiruv: tools/tartib.js */
"use strict";
  /* Urug' O'simlikshunoslik darslaridan (har uch darsda bitta, 12 ta). Sug'orish BEPUL, kuniga bir marta; 3 marta - o'smir,
     10 marta - yetilgan. Yetilgan o'simlik har 3-sug'orishda HOSIL beradi; hosil Qo'riqxonada yemishi tugagan maxluqni
     boqishga ishlatiladi (qrRender dagi «Hosil bilan boqish»). Sug'orilmasa qurimaydi, faqat o'smaydi.
     Server: hpissiq.py, POST /api/issiq ({} | {water: kod | "all"}). Rasmlar img/issiq/<kod>-<0|1|2>.webp. */
  var API_ISSIQ = "https://bot.tizimshunos.uz/api/issiq";
  var IS_TARTIB = ["mandragora", "bubotuber", "puffapod", "geran", "mimbulus", "ditani", "jabra", "tentakula", "shayton", "akonit", "snargaluff", "tol"];
  var IS_NOM = {
    mandragora: ["Mandragora", "Мандрагора", "Mandrake"], bubotuber: ["Bubotuber", "Бубонтюбер", "Bubotuber"],
    puffapod: ["Puffapod", "Пуффапод", "Puffapod"], geran: ["Tishli yorongul", "Клыкастая герань", "Fanged Geranium"],
    mimbulus: ["Mimbulus", "Мимбулус", "Mimbulus"], ditani: ["Ditani", "Бадьян", "Dittany"],
    jabra: ["Jabra o'ti", "Жабросли", "Gillyweed"], tentakula: ["Zaharli tentakula", "Ядовитая тентакула", "Venomous Tentacula"],
    shayton: ["Shayton tuzog'i", "Дьявольские силки", "Devil's Snare"], akonit: ["Bo'ri o'ti", "Аконит", "Wolfsbane"],
    snargaluff: ["Snargaluff", "Цапень", "Snargaluff"], tol: ["Urilqoq tol", "Гремучая ива", "Whomping Willow"]
  };
  var IS_X = {
    uz: { ttl: "Issiqxona", sum: function (a, b) { return a + " / " + b + " o'simlik"; }, hosil: function (n) { return "Hosil: " + n; },
          all: "Hammasini sug'orish", allDone: "Bugun hammasi sug'orildi", st: ["Nihol", "O'smir", "Yetilgan"],
          tip: "Har o'simlikni kuniga bir marta sug'oring. Yetilgani hosil beradi — hosil Qo'riqxonadagi maxluqlarga yemish bo'ladi.",
          tip0: "Hali urug' yo'q. Birinchi urug' O'simlikshunoslikning 3-darsidan keyin beriladi.",
          next: function (n) { return "Yana " + n + " marta"; }, crop: function (n) { return "Hosilgacha " + n; }, lock: function (n) { return n + "-darsdan keyin"; },
          done: "Sug'orildi", water: "Sug'orish", grew: function (nom, st) { return nom + " o'sdi: endi " + st.toLowerCase() + "!"; },
          got: function (n) { return "Hosil yig'ildi: +" + n; }, ok: "Rahmat! O'simliklar suvga to'ydi.", seed: function (nom) { return "Yangi urug': " + nom + ". U Issiqxonada kutmoqda!"; },
          qrHosil: function (n) { return "Hosil bilan boqish (" + n + ")"; }, fanS: function (n) { return n ? n + " ta o'simlik sizni kutmoqda" : "Har uch darsda bitta urug'"; } },
    ru: { ttl: "Теплица", sum: function (a, b) { return "Растений: " + a + " / " + b; }, hosil: function (n) { return "Урожай: " + n; },
          all: "Полить все", allDone: "Сегодня всё полито", st: ["Росток", "Подросток", "Зрелое"],
          tip: "Поливайте каждое растение раз в день. Зрелое даёт урожай — им можно кормить существ в Питомнике.",
          tip0: "Семян пока нет. Первое семя вы получите после 3-го урока травологии.",
          next: function (n) { return "Ещё " + n + " раз"; }, crop: function (n) { return "До урожая: " + n; }, lock: function (n) { return "После урока " + n; },
          done: "Полито", water: "Полить", grew: function (nom, st) { return nom + " подросло: теперь " + st.toLowerCase() + "!"; },
          got: function (n) { return "Урожай собран: +" + n; }, ok: "Спасибо! Растения напились.", seed: function (nom) { return "Новое семя: " + nom + ". Оно ждёт в Теплице!"; },
          qrHosil: function (n) { return "Покормить урожаем (" + n + ")"; }, fanS: function (n) { return n ? "Вас ждут растения: " + n : "Новое семя каждые три урока"; } },
    en: { ttl: "Greenhouse", sum: function (a, b) { return a + " / " + b + " plants"; }, hosil: function (n) { return "Harvest: " + n; },
          all: "Water them all", allDone: "All watered for today", st: ["Seedling", "Young", "Mature"],
          tip: "Water each plant once a day. A mature plant gives a harvest — use it to feed your creatures in the Sanctuary.",
          tip0: "No seeds yet. You get your first seed after Herbology lesson 3.",
          next: function (n) { return n + " more"; }, crop: function (n) { return n + " to harvest"; }, lock: function (n) { return "After lesson " + n; },
          done: "Watered", water: "Water", grew: function (nom, st) { return nom + " has grown: now " + st.toLowerCase() + "!"; },
          got: function (n) { return "Harvest gathered: +" + n; }, ok: "Thank you! The plants have had their fill.", seed: function (nom) { return "A new seed: " + nom + ". It is waiting in the Greenhouse!"; },
          qrHosil: function (n) { return "Feed with harvest (" + n + ")"; }, fanS: function (n) { return n ? n + " plants are waiting for you" : "A new seed every three lessons"; } }
  };
  var isData = null, isBusy = false, isLocal = null, isKel = "hub", isAt = 0;

  function isX() { return IS_X[lang] || IS_X.uz; }
  function isNom(k) { return (IS_NOM[k] || [k, k, k])[lang === "ru" ? 1 : lang === "en" ? 2 : 0]; }
  function isImg(k, st) { return IMG_DIR + "issiq/" + k + "-" + (st || 0) + ".webp"; }
  function isSoni() {
    var n = 0;
    try { ((isData && isData.list) || []).forEach(function (m) { if (m.got) { n++; } }); } catch (e) {}
    return n;
  }
  // Bugun sug'orilmaganlari (bosh sahifadagi katak soni)
  function isKutmoqda() {
    var n = 0;
    try { ((isData && isData.list) || []).forEach(function (m) { if (m.got && !m.today) { n++; } }); } catch (e) {}
    return n;
  }

  // Mahalliy ko'rik uchun namuna (server yo'q)
  function isSample(body) {
    if (!isLocal) {
      isLocal = { hosil: 2, m: {} };
      IS_TARTIB.forEach(function (k, i) { if (i < 5) { isLocal.m[k] = { w: [1, 5, 12, 2, 9][i], today: i === 1 }; } });
    }
    var L = isLocal, res = { ok: true, watered: [], grew: {}, crop: 0 }, st = function (b) { return b >= 10 ? 2 : b >= 3 ? 1 : 0; };
    if (body && body.water) {
      Object.keys(L.m).forEach(function (k) {
        var o = L.m[k];
        if ((body.water !== "all" && body.water !== k) || o.today) { return; }
        o.w++; o.today = true; res.watered.push(k);
        if (st(o.w) !== st(o.w - 1)) { res.grew[k] = st(o.w); }
        if (o.w > 10 && (o.w - 10) % 3 === 0) { res.crop++; }
      });
      L.hosil += res.crop;
    }
    res.hosil = L.hosil;
    res.list = IS_TARTIB.map(function (kod, i) {
      var q = L.m[kod], b = q ? q.w : 0, s = st(b);
      return { kod: kod, got: !!q, need: (i + 1) * 3, watered: b, stage: s, next: s === 0 ? 3 - b : s === 1 ? 10 - b : 0, today: !!(q && q.today), crop: s === 2 ? 3 - (b - 10) % 3 : 0 };
    });
    return res;
  }

  function isPost(body, cb) {
    if (!window.fetch) { return; }
    window.fetch(API_ISSIQ, { method: "POST", headers: { "Content-Type": "application/json", "X-Telegram-Init-Data": drInit() }, body: JSON.stringify(body || {}) })
      .then(function (r) { return r.json(); })
      .then(function (res) { cb(res && res.list ? res : (MS_LOCAL ? isSample(body) : res)); })
      ["catch"](function () { cb(MS_LOCAL ? isSample(body) : null); });
  }

  // Bosh sahifa katagi uchun holat (5 daqiqada bir marta)
  function isLoad(cb) {
    if (Date.now() - isAt < 300000) { return; }
    isAt = Date.now();
    isPost({}, function (res) { if (res && res.list) { isData = res; if (cb) { cb(); } } });
  }

  function isHubOpen() { isKel = "hub"; isOpen(); }
  function isOpen() {
    var x = isX();
    drShowGame("scr-issiq");
    $("is-kick").textContent = drFan("osimlik").ust[lang];
    $("is-ttl").textContent = x.ttl;
    $("is-sp").src = osSpImg("maslahat");
    isRender();
    isPost({}, function (res) { if (res && res.list) { isData = res; isRender(); } else if (!isData) { showToast(drX().fail, "err"); } });
  }

  function isDe(matn, kayf) { $("is-tip").textContent = matn; $("is-sp").src = osSpImg(kayf || "zor"); }

  function isAct(kod) {
    if (isBusy) { return; }
    var x = isX();
    isBusy = true;
    isPost({ water: kod }, function (res) {
      isBusy = false;
      if (!res || !res.list) { showToast(drX().fail, "err"); return; }
      isData = res;
      isAt = Date.now();
      isRender();
      var w = res.watered || [];
      if (!w.length) { return; }
      try { if (tg && tg.HapticFeedback) { tg.HapticFeedback.notificationOccurred("success"); } } catch (e) {}
      var osgan = Object.keys(res.grew || {}), matn = x.ok, kayf = "yaxshi";
      if (osgan.length) { matn = x.grew(isNom(osgan[0]), x.st[res.grew[osgan[0]]]); kayf = "zor"; }
      if (res.crop) { matn = (osgan.length ? matn + " " : "") + x.got(res.crop); kayf = "zor"; }
      isDe(matn, kayf);
      if (osgan.length || res.crop) { showToast(matn); }
      w.forEach(function (k) {
        var el = document.querySelector('.is-c[data-k="' + k + '"]');
        if (el) { el.classList.add(res.grew && res.grew[k] != null ? "osdi" : "ichdi"); }
      });
    });
  }

  function isRender() {
    var x = isX(), box = $("is-grid"), d = isData, all = $("is-all");
    box.innerHTML = "";
    if (!d) { $("is-sum").textContent = ""; $("is-hosil").textContent = ""; all.classList.add("hidden"); $("is-tip").textContent = x.tip; return; }
    var bor = isSoni(), kut = isKutmoqda();
    $("is-sum").textContent = x.sum(bor, d.list.length);
    $("is-hosil").textContent = x.hosil(d.hosil || 0);
    $("is-tip").textContent = bor ? x.tip : x.tip0;
    all.classList.toggle("hidden", !bor);
    all.textContent = kut ? x.all + " (" + kut + ")" : x.allDone;
    all.disabled = !kut;
    d.list.forEach(function (q) {
      var c = drEl("button", "is-c" + (q.got ? "" : " yopiq") + (q.stage === 2 ? " katta" : "") + (q.got && !q.today ? " chanqoq" : ""));
      c.type = "button";
      c.setAttribute("data-k", q.kod);
      var ph = drEl("span", "is-ph"), im = document.createElement("img");
      im.alt = ""; im.loading = "lazy"; im.src = isImg(q.kod, q.got ? q.stage : 2);
      ph.appendChild(im);
      if (q.got && !q.today) { ph.appendChild(drEl("i", "is-tomchi")); }
      c.appendChild(ph);
      c.appendChild(drEl("b", "", q.got ? isNom(q.kod) : "???"));
      if (!q.got) {
        c.appendChild(drEl("small", "", x.lock(q.need)));
        box.appendChild(c);
        return;
      }
      c.appendChild(drEl("span", "is-st", x.st[q.stage]));
      var jami = q.stage === 0 ? 3 : q.stage === 1 ? 7 : 3, qilingan = q.stage === 0 ? q.watered : q.stage === 1 ? q.watered - 3 : 3 - q.crop;
      var bar = drEl("span", "qr-bar"), bi = drEl("i");
      bi.style.width = Math.round(100 * Math.max(0, qilingan) / jami) + "%";
      bar.appendChild(bi);
      c.appendChild(bar);
      c.appendChild(drEl("small", q.today ? "is-ok" : "", q.today ? x.done : q.stage === 2 ? x.crop(q.crop) : x.next(q.next)));
      c.addEventListener("click", function () { if (!q.today) { isAct(q.kod); } });
      box.appendChild(c);
    });
  }

  // Dars oxirida yangi urug' chiqdi (har uchinchi dars)
  function isSeed(level) {
    var k = IS_TARTIB[Math.floor(level / 3) - 1];
    isAt = 0;
    if (k) { setTimeout(function () { showToast(isX().seed(isNom(k))); }, 900); }
  }

  function isSetup() {
    $("is-back").addEventListener("click", function () {
      $("scr-issiq").classList.add("hidden");
      if (isKel === "fan") { isKel = "hub"; fanOpen("osimlik"); } else { openHub(); }
    });
    $("is-all").addEventListener("click", function () { isAct("all"); });
  }

  isSetup();
