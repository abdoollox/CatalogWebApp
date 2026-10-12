/* DO'KON (egasi, 2026-10-12): galleonga JIHOZ va DAMLAMA - o'yinda haqiqiy ustunlik beradi (server: hpdokon.py, POST /api/dokon).
   Egasi qarorlari: xarid kuch berishi SHART («faqat ko'rinish» rad etilgan), lekin mahorat hal qilsin (ustunlik kichik); shaxmatda jihoz yo'q.
   Jihozlar (3 bosqichdan): supurgi (poyga va uchish bellashuvida tezlik), qolqop (duel kuchi - server; afsunlar shami), qozon (damlamalar shami),
   mantiya (himoyada xavf sekinroq), eslatgich (tarix darsida noto'g'ri variant o'chadi); to'rttasi o'z fani bellashuvida xato jarimasini kamaytiradi (server).
   Damlamalar: feliks (viktorina - server), tezlik (poyga - shu fayl so'raydi), diqqat (bellashuv - server).
   O'yinlar jihoz bosqichini dkDaraja(tur) dan oladi (oxirgi holat qurilmada ham saqlanadi - hp_dokon).
   Ilova kodi bir necha faylga bo'lingan; hammasi BIR umumiy maydonda ishlaydi
   va index.html dagi TARTIBDA yuklanadi. Yuklanish paytida keyingi fayldagi
   narsani chaqirmang - tekshiruv: tools/tartib.js */
"use strict";

  var API_DOKON = "https://bot.tizimshunos.uz/api/dokon";
  var DK_T = {
    uz: { kick: "Xogvarts", ttl: "Do'kon", hamyon: "Hamyoningizda", gal: function (n) { return n + " galleon"; }, galQ: "Galleon hafta yakunida beriladi: har 10 ballga 1 galleon",
          jihoz: "Jihozlar", jihozS: "Doimiy. Har bosqich oldingisidan kuchliroq", damlama: "Damlamalar", damlamaS: "Bir martalik. Bor va yoqilgan bo'lsa, o'zi ishlaydi",
          ol: function (n) { return "Sotib olish · " + n; }, kuchaytir: function (n) { return "Kuchaytirish · " + n; }, toliq: "Eng yuqori bosqich", sizda: function (n) { return "Sizda: " + n + " ta"; },
          yoq: "Hali yo'q", bosqich: function (a, b) { return a + " / " + b + "-bosqich"; }, keyingi: "Keyingi bosqich", hozir: "Hozir",
          so: function (nom, narx) { return nom + "\n\n" + narx + " galleonga sotib olasizmi?"; }, ha: "Sotib olish", yoqJ: "Yo'q",
          pul: function (n) { return "Galleon yetmaydi — yana " + n + " ta kerak"; }, olindi: function (nom) { return nom + " — sizniki!"; }, aloqa: "Aloqa yo'q — qayta urinib ko'ring",
          yoqilgan: "Yoqilgan", ochirilgan: "O'chirilgan", tur: { supurgi: "Supurgi", qolqop: "Duel qo'lqopi", qozon: "Qozon", mantiya: "Mantiya", eslatgich: "Eslatgich" },
          nom: { supurgi: ["Nimbus 2000", "Nimbus 2001", "Firebolt"], qolqop: ["Charm qo'lqop", "Ajdar terisidan qo'lqop", "Shoxdum terisidan qo'lqop"],
                 qozon: ["Mis qozon", "Kumush qozon", "Oltin qozon"], mantiya: ["Himoya mantiyasi", "Afsunlangan mantiya", "Ajdar terisidan mantiya"],
                 eslatgich: ["Kichik eslatgich", "Eslatgich shar", "Usta eslatgichi"] },
          ef: { supurgi: function (v) { return ["Poyga va uchish bellashuvida tezlik +" + v.speed + "%"]; },
                qolqop: function (v) { return ["Duelda afsun kuchi +" + v.duel, "Afsunlar darsida sham " + v.candle + "% uzoqroq yonadi", "Afsunlar bellashuvida xato jarimasi " + v.pen + " s"]; },
                qozon: function (v) { return ["Damlamalar darsida sham " + v.candle + "% uzoqroq yonadi", "Damlamalar bellashuvida xato jarimasi " + v.pen + " s"]; },
                mantiya: function (v) { return ["Himoya darsida xavf " + v.danger + "% sekinroq yaqinlashadi", "Himoya bellashuvida xato jarimasi " + v.pen + " s"]; },
                eslatgich: function (v) { return ["Tarix darsida " + v.n + " ta savolda bitta noto'g'ri javob o'chadi", "Tarix bellashuvida xato jarimasi " + v.pen + " s"]; } },
          dam: { feliks: ["Feliks Felitsis", "Viktorinada bitta xatoingiz kechiriladi (har viktorinada bir marta)"],
                 tezlik: ["Tezlik damlamasi", "Poygada startdan katta tezlik bilan chiqasiz"],
                 diqqat: ["Diqqat damlamasi", "Bellashuvda birinchi xatoingiz jarimasiz o'tadi"] },
          ishladi: { supurgi: function (nom, v) { return nom + ": tezlik +" + v + "%"; }, sham: function (nom, v) { return nom + ": sham " + v + "% uzoqroq"; },
                     xavf: function (nom, v) { return nom + ": xavf " + v + "% sekinroq"; }, esl: function (nom) { return nom + ": bitta noto'g'ri javob o'chirildi"; },
                     tezlik: "Tezlik damlamasi ishladi!", diqqat: "Diqqat damlamasi: birinchi xato kechirildi", feliks: "Feliks Felitsis sizni qutqardi — o'yinda qolasiz!" } },
    ru: { kick: "Хогвартс", ttl: "Лавка", hamyon: "В кошельке", gal: function (n) { return n + " галл."; }, galQ: "Галлеоны выдаются в конце недели: 1 галлеон за каждые 10 очков",
          jihoz: "Снаряжение", jihozS: "Навсегда. Каждый уровень сильнее предыдущего", damlama: "Зелья", damlamaS: "Одноразовые. Срабатывают сами, если есть и включены",
          ol: function (n) { return "Купить · " + n; }, kuchaytir: function (n) { return "Улучшить · " + n; }, toliq: "Максимальный уровень", sizda: function (n) { return "У вас: " + n; },
          yoq: "Пока нет", bosqich: function (a, b) { return "Уровень " + a + " из " + b; }, keyingi: "Следующий уровень", hozir: "Сейчас",
          so: function (nom, narx) { return nom + "\n\nКупить за " + narx + " галлеонов?"; }, ha: "Купить", yoqJ: "Нет",
          pul: function (n) { return "Не хватает галлеонов — нужно ещё " + n; }, olindi: function (nom) { return nom + " — ваше!"; }, aloqa: "Нет связи — попробуйте ещё раз",
          yoqilgan: "Включено", ochirilgan: "Выключено", tur: { supurgi: "Метла", qolqop: "Дуэльные перчатки", qozon: "Котёл", mantiya: "Мантия", eslatgich: "Напоминалка" },
          nom: { supurgi: ["Нимбус-2000", "Нимбус-2001", "Молния"], qolqop: ["Кожаные перчатки", "Перчатки из драконьей кожи", "Перчатки из кожи хвостороги"],
                 qozon: ["Медный котёл", "Серебряный котёл", "Золотой котёл"], mantiya: ["Защитная мантия", "Зачарованная мантия", "Мантия из драконьей кожи"],
                 eslatgich: ["Малая напоминалка", "Напоминалка", "Напоминалка мастера"] },
          ef: { supurgi: function (v) { return ["В гонке и состязании по полётам скорость +" + v.speed + "%"]; },
                qolqop: function (v) { return ["В дуэли сила заклинания +" + v.duel, "На уроках заклинаний свеча горит на " + v.candle + "% дольше", "В состязании по заклинаниям штраф за ошибку " + v.pen + " с"]; },
                qozon: function (v) { return ["На уроках зельеварения свеча горит на " + v.candle + "% дольше", "В состязании по зельям штраф за ошибку " + v.pen + " с"]; },
                mantiya: function (v) { return ["На уроках защиты опасность приближается на " + v.danger + "% медленнее", "В состязании по защите штраф за ошибку " + v.pen + " с"]; },
                eslatgich: function (v) { return ["На уроках истории в " + v.n + " вопросах исчезает один неверный ответ", "В состязании по истории штраф за ошибку " + v.pen + " с"]; } },
          dam: { feliks: ["Феликс Фелицис", "В викторине одна ваша ошибка прощается (раз за викторину)"],
                 tezlik: ["Зелье скорости", "В гонке стартуете с большой скоростью"],
                 diqqat: ["Зелье внимания", "В состязании первая ошибка без штрафа"] },
          ishladi: { supurgi: function (nom, v) { return nom + ": скорость +" + v + "%"; }, sham: function (nom, v) { return nom + ": свеча на " + v + "% дольше"; },
                     xavf: function (nom, v) { return nom + ": опасность на " + v + "% медленнее"; }, esl: function (nom) { return nom + ": один неверный ответ убран"; },
                     tezlik: "Зелье скорости сработало!", diqqat: "Зелье внимания: первая ошибка прощена", feliks: "Феликс Фелицис спас вас — вы остаётесь в игре!" } },
    en: { kick: "Hogwarts", ttl: "Shop", hamyon: "In your purse", gal: function (n) { return n + " Galleons"; }, galQ: "Galleons come at the end of the week: 1 for every 10 points",
          jihoz: "Gear", jihozS: "Permanent. Each level is stronger than the last", damlama: "Potions", damlamaS: "Single use. They work by themselves when you have one switched on",
          ol: function (n) { return "Buy · " + n; }, kuchaytir: function (n) { return "Upgrade · " + n; }, toliq: "Top level", sizda: function (n) { return "You have: " + n; },
          yoq: "Not yet", bosqich: function (a, b) { return "Level " + a + " of " + b; }, keyingi: "Next level", hozir: "Now",
          so: function (nom, narx) { return nom + "\n\nBuy for " + narx + " Galleons?"; }, ha: "Buy", yoqJ: "No",
          pul: function (n) { return "Not enough Galleons — you need " + n + " more"; }, olindi: function (nom) { return nom + " is yours!"; }, aloqa: "No connection — please try again",
          yoqilgan: "On", ochirilgan: "Off", tur: { supurgi: "Broom", qolqop: "Duelling gloves", qozon: "Cauldron", mantiya: "Cloak", eslatgich: "Remembrall" },
          nom: { supurgi: ["Nimbus 2000", "Nimbus 2001", "Firebolt"], qolqop: ["Leather gloves", "Dragon-hide gloves", "Horntail-hide gloves"],
                 qozon: ["Copper cauldron", "Silver cauldron", "Gold cauldron"], mantiya: ["Protective cloak", "Enchanted cloak", "Dragon-hide cloak"],
                 eslatgich: ["Small Remembrall", "Remembrall", "Master's Remembrall"] },
          ef: { supurgi: function (v) { return ["Speed +" + v.speed + "% in the race and the flying contest"]; },
                qolqop: function (v) { return ["Spell power +" + v.duel + " in duels", "The candle burns " + v.candle + "% longer in Charms lessons", "Mistake penalty " + v.pen + " s in the Charms contest"]; },
                qozon: function (v) { return ["The candle burns " + v.candle + "% longer in Potions lessons", "Mistake penalty " + v.pen + " s in the Potions contest"]; },
                mantiya: function (v) { return ["Danger approaches " + v.danger + "% slower in Defence lessons", "Mistake penalty " + v.pen + " s in the Defence contest"]; },
                eslatgich: function (v) { return ["One wrong answer disappears in " + v.n + " questions of a History lesson", "Mistake penalty " + v.pen + " s in the History contest"]; } },
          dam: { feliks: ["Felix Felicis", "One mistake is forgiven in the quiz (once per quiz)"],
                 tezlik: ["Speed potion", "You start the race at high speed"],
                 diqqat: ["Focus potion", "Your first mistake in a contest carries no penalty"] },
          ishladi: { supurgi: function (nom, v) { return nom + ": speed +" + v + "%"; }, sham: function (nom, v) { return nom + ": candle " + v + "% longer"; },
                     xavf: function (nom, v) { return nom + ": danger " + v + "% slower"; }, esl: function (nom) { return nom + ": one wrong answer removed"; },
                     tezlik: "The speed potion kicked in!", diqqat: "Focus potion: first mistake forgiven", feliks: "Felix Felicis saved you — you stay in!" } }
  };
  function dkT() { return DK_T[lang] || DK_T.uz; }

  var DK_QOIDA = { prices: [15, 35, 80], speed: [4, 8, 12], candle: [10, 20, 30], danger: [8, 16, 24], duel: 2, penalty: [2.6, 2.2, 1.8] };
  var dkData = null, dkVaqt = 0, dkKutmoqda = false, dkLocal = null;
  try { dkData = JSON.parse(localStorage.getItem("hp_dokon") || "null"); } catch (e) { dkData = null; }

  function dkQoida() { return (dkData && dkData.rules) || DK_QOIDA; }
  // O'yinlar uchun: jihoz bosqichi (0 - yo'q) va shu bosqichdagi foiz
  function dkDaraja(tur) {
    var g = (dkData && dkData.gear) || [];
    for (var i = 0; i < g.length; i++) { if (g[i].k === tur) { return g[i].level || 0; } }
    return 0;
  }
  function dkFoiz(tur, qator) { var d = dkDaraja(tur), q = dkQoida()[qator] || []; return d > 0 ? (q[d - 1] || 0) : 0; }
  function dkNom(tur) { var d = dkDaraja(tur); return d > 0 ? dkT().nom[tur][d - 1] : ""; }
  function dkDamlama(kod) {
    var p = (dkData && dkData.potions) || [];
    for (var i = 0; i < p.length; i++) { if (p[i].k === kod) { return p[i].on ? (p[i].n || 0) : 0; } }
    return 0;
  }
  // O'yin boshida: jihoz ishlayotgani haqida qisqa xabar (tur: supurgi | sham | xavf | esl)
  function dkXabar(jihoz, tur, foiz) {
    if (!dkDaraja(jihoz)) { return; }
    try { showToast(dkT().ishladi[tur](dkNom(jihoz), foiz)); } catch (e) {}
  }
  function dkDamXabar(kod) { try { showToast(dkT().ishladi[kod]); } catch (e) {} }

  function dkSample(body) {
    if (!dkLocal) { dkLocal = { gal: 58, gear: { supurgi: 1, qolqop: 0, qozon: 2, mantiya: 0, eslatgich: 3 }, pot: { feliks: [1, true], tezlik: [0, true], diqqat: [3, false] } }; }
    var L2 = dkLocal, qosh = {};
    if (body && body.buy) {
      var k = body.buy;
      if (L2.gear[k] != null) {
        if (L2.gear[k] >= 3) { qosh.buy = "toliq"; } else if (L2.gal < DK_QOIDA.prices[L2.gear[k]]) { qosh.buy = "pul"; } else { L2.gal -= DK_QOIDA.prices[L2.gear[k]]; L2.gear[k]++; qosh.buy = "ok"; }
      } else {
        var narx = { feliks: 4, tezlik: 3, diqqat: 2 }[k];
        if (L2.gal < narx) { qosh.buy = "pul"; } else { L2.gal -= narx; L2.pot[k][0]++; qosh.buy = "ok"; }
      }
    }
    if (body && body.toggle) { L2.pot[body.toggle][1] = !!body.on; }
    var res = { ok: true, galleons: L2.gal, rules: DK_QOIDA,
      gear: ["supurgi", "qolqop", "qozon", "mantiya", "eslatgich"].map(function (g) { return { k: g, level: L2.gear[g], max: 3, price: L2.gear[g] < 3 ? DK_QOIDA.prices[L2.gear[g]] : null }; }),
      potions: [["feliks", 4], ["tezlik", 3], ["diqqat", 2]].map(function (p) { return { k: p[0], n: L2.pot[p[0]][0], on: L2.pot[p[0]][1], price: p[1] }; }) };
    for (var q in qosh) { if (Object.prototype.hasOwnProperty.call(qosh, q)) { res[q] = qosh[q]; } }
    return res;
  }
  function dkPost(body, cb) {
    if (!window.fetch) { return; }
    window.fetch(API_DOKON, { method: "POST", headers: { "Content-Type": "application/json", "X-Telegram-Init-Data": drInit() }, body: JSON.stringify(body || {}) })
      .then(function (r) { return r.json(); })
      .then(function (res) { cb(res && res.gear ? res : (MS_LOCAL ? dkSample(body) : res)); })
      ["catch"](function () { cb(MS_LOCAL ? dkSample(body) : null); });
  }
  function dkQabul(res) {
    dkData = res;
    dkVaqt = Date.now();
    try { localStorage.setItem("hp_dokon", JSON.stringify({ gear: res.gear, potions: res.potions, rules: res.rules, galleons: res.galleons })); } catch (e) {}
  }
  // Bosh sahifa ochilganda: daqiqada bir martadan ko'p so'ralmaydi, bosh sahifani qayta chizmaydi
  function dkLoad(cb) {
    if (dkKutmoqda || Date.now() - dkVaqt < 60000) { if (cb) { cb(); } return; }
    dkKutmoqda = true;
    dkPost({}, function (res) {
      dkKutmoqda = false;
      dkVaqt = Date.now();
      if (res && res.gear) { dkQabul(res); }
      if (cb) { cb(); }
    });
  }
  function dkGalleon() { return dkData && dkData.galleons != null ? dkData.galleons : null; }

  function dkOpen() {
    try { $("scr-hub").classList.add("hidden"); } catch (e) {}
    drShowGame("scr-dokon");
    $("dk-kick").textContent = dkT().kick;
    $("dk-ttl").textContent = dkT().ttl;
    dkRender();
    dkVaqt = 0;
    dkLoad(dkRender);
  }
  function dkYop() {
    $("scr-dokon").classList.add("hidden");
    openHub();
  }
  function dkRasm(nom) {
    var im = document.createElement("img");
    im.alt = "";
    im.loading = "lazy";
    im.onerror = function () { im.style.visibility = "hidden"; };
    im.src = IMG_DIR + "dokon/" + nom + ".webp";
    return im;
  }
  function dkSotibOl(kod, nom, narx) {
    var t = dkT(), bor = dkGalleon() || 0;
    if (bor < narx) { showToast(t.pul(narx - bor), "err"); return; }
    testAsk(t.so(nom, narx), function () {
      dkPost({ buy: kod }, function (res) {
        if (!res || !res.gear) { showToast(t.aloqa, "err"); return; }
        dkQabul(res);
        if (res.buy === "ok") {
          showToast(t.olindi(nom));
          try { if (tg && tg.HapticFeedback) { tg.HapticFeedback.notificationOccurred("success"); } } catch (e) {}
          try { walLoad(); } catch (e2) {}                 // profildagi hamyon ham yangilansin
        } else if (res.buy === "pul") { showToast(t.pul(Math.max(1, narx - (res.galleons || 0))), "err"); }
        dkRender();
      });
    }, { ok: t.ha, no: t.yoqJ });
  }
  function dkEfQiymat(tur, d) {
    var q = dkQoida();
    return { speed: q.speed[d - 1], candle: q.candle[d - 1], danger: q.danger[d - 1], duel: q.duel * d, pen: String(q.penalty[d - 1]).replace(".", lang === "en" ? "." : ","), n: d };
  }
  function dkRender() {
    var d = dkData, t = dkT(), box = $("dk-body");
    if (!box) { return; }
    box.innerHTML = "";
    var ham = drEl("div", "dk-ham");
    ham.appendChild(drEl("small", "", t.hamyon));
    ham.appendChild(drEl("b", "", t.gal(d && d.galleons != null ? d.galleons : "…")));
    ham.appendChild(drEl("p", "", t.galQ));
    box.appendChild(ham);
    if (!d || !d.gear) { return; }
    var bosh = function (a, b) { var h = drEl("div", "dk-bosh"); h.appendChild(drEl("b", "", a)); h.appendChild(drEl("span", "", b)); box.appendChild(h); };
    bosh(t.jihoz, t.jihozS);
    d.gear.forEach(function (g) {
      var karta = drEl("div", "dk-k" + (g.level > 0 ? " bor" : "")), tep = drEl("div", "dk-k-t"), rasm = drEl("span", "dk-rasm");
      rasm.appendChild(dkRasm(g.k + "-" + Math.max(1, Math.min(g.max, g.level || 1))));
      tep.appendChild(rasm);
      var mt = drEl("span", "dk-k-m");
      mt.appendChild(drEl("small", "", t.tur[g.k]));
      mt.appendChild(drEl("b", "", g.level > 0 ? t.nom[g.k][g.level - 1] : t.yoq));
      var pips = drEl("span", "dk-pips");
      for (var i = 1; i <= g.max; i++) { pips.appendChild(drEl("i", i <= g.level ? "on" : "")); }
      mt.appendChild(pips);
      tep.appendChild(mt);
      karta.appendChild(tep);
      if (g.level > 0) {
        var hz = drEl("div", "dk-ef");
        hz.appendChild(drEl("u", "", t.hozir));
        t.ef[g.k](dkEfQiymat(g.k, g.level)).forEach(function (m) { hz.appendChild(drEl("p", "", m)); });
        karta.appendChild(hz);
      }
      if (g.level < g.max) {
        var kn = drEl("div", "dk-ef kn");
        kn.appendChild(drEl("u", "", (g.level > 0 ? t.keyingi : t.nom[g.k][0]) + (g.level > 0 ? " — " + t.nom[g.k][g.level] : "")));
        t.ef[g.k](dkEfQiymat(g.k, g.level + 1)).forEach(function (m) { kn.appendChild(drEl("p", "", m)); });
        karta.appendChild(kn);
        var b = drEl("button", "dr-btn dk-btn" + ((d.galleons || 0) < g.price ? " kam" : ""), (g.level > 0 ? t.kuchaytir : t.ol)(t.gal(g.price)));
        b.type = "button";
        b.addEventListener("click", function () { dkSotibOl(g.k, t.nom[g.k][g.level], g.price); });
        karta.appendChild(b);
      } else {
        karta.appendChild(drEl("p", "dk-toliq", t.toliq));
      }
      box.appendChild(karta);
    });
    bosh(t.damlama, t.damlamaS);
    (d.potions || []).forEach(function (p) {
      var karta = drEl("div", "dk-k dk-d" + (p.n > 0 ? " bor" : "")), tep = drEl("div", "dk-k-t"), rasm = drEl("span", "dk-rasm");
      rasm.appendChild(dkRasm(p.k));
      tep.appendChild(rasm);
      var mt = drEl("span", "dk-k-m");
      mt.appendChild(drEl("b", "", t.dam[p.k][0]));
      mt.appendChild(drEl("p", "", t.dam[p.k][1]));
      tep.appendChild(mt);
      karta.appendChild(tep);
      var past = drEl("div", "dk-d-p");
      past.appendChild(drEl("span", "dk-soni", t.sizda(p.n)));
      if (p.n > 0) {
        var tg2 = drEl("button", "dk-tg" + (p.on ? " on" : ""), p.on ? t.yoqilgan : t.ochirilgan);
        tg2.type = "button";
        tg2.addEventListener("click", function () { dkPost({ toggle: p.k, on: p.on ? 0 : 1 }, function (res) { if (res && res.gear) { dkQabul(res); dkRender(); } }); });
        past.appendChild(tg2);
      }
      var b = drEl("button", "dr-btn dk-btn" + ((d.galleons || 0) < p.price ? " kam" : ""), t.ol(t.gal(p.price)));
      b.type = "button";
      b.addEventListener("click", function () { dkSotibOl(p.k, t.dam[p.k][0], p.price); });
      past.appendChild(b);
      karta.appendChild(past);
      box.appendChild(karta);
    });
  }

  function dkSetup() {
    $("dk-back").addEventListener("click", dkYop);
  }

  dkSetup();
