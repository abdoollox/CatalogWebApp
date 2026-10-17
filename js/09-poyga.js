/* «Supurgi poygasi» - dushanba turniri (egasi, 2026-10-12). Server: hppoyga.py, POST /api/poyga.
   BITTA UZLUKSIZ POYGA: hamma bir vaqtda bitta yo'ldan uchadi (uchishning o'zi - js/09-darslar.js dagi uchPoyga);
   har 10 halqada NAZORAT - unga eng oxirida yetgan uchuvchi poygani tark etadi; oxirida qolgan - g'olib.
   Uchish paytida ilova har soniyada o'z o'rnini aytadi va jonli jadvalni oladi (uchish ostidagi panel).
   Ilova kodi bir necha faylga bo'lingan; hammasi BIR umumiy maydonda ishlaydi
   va index.html dagi TARTIBDA yuklanadi. Yuklanish paytida keyingi fayldagi
   narsani chaqirmang - tekshiruv: tools/tartib.js */
"use strict";

  var API_POYGA = "https://bot.tizimshunos.uz/api/poyga";
  var PG_T = {
    uz: { kick: "Dushanba turniri", ttl: "Poyga", nom: "Supurgi poygasi", kunlar: ["yakshanba", "dushanba", "seshanba", "chorshanba", "payshanba", "juma", "shanba"], qoldi: "qoldi",
          soni: function (n) { return n + " kishi yozildi"; }, qat: "Qatnashaman", bor: "Siz yozilgansiz — boyo'g'li eslatadi", chiq: "Chiqish",
          q1: "Hamma bir vaqtda bitta yo'ldan uchadi", q2: "Halqaning o'rtasidan o'tsangiz tezlashasiz",
          q3: function (n) { return "Har " + n + " halqada eng oxirgi uchuvchi chiqib ketadi — oxirida qolgan yutadi"; },
          sov: "Sovrinlar", orin: function (n) { return n + "-o'rin"; }, keyinP: function (a, p) { return "4–" + a + "-o'ringa — +" + p + " ball"; },
          otgan: function (n, k) { return "O'tgan safar g'olib: " + n + " (" + k + " kishi ichida)"; },
          mashq: "Mashq qilish", mashqS: "30 halqalik yo'lda sinab ko'ring — natija hisoblanmaydi", mashqN: function (v) { return "Mashq natijasi: 30 halqa — " + v; },
          zal: "Start chizig'i ochiq", zalS: function (n) { return n + " uchuvchi keldi"; }, bosh: function (v) { return "Startga " + v; }, kut: "Shu sahifada qoling — poyga o'zi boshlanadi.",
          kech: "Kechikdingiz — bu safar faqat tomosha qilasiz", uchmoqda: "Poyga ketmoqda", tirikN: function (n) { return "Poygada " + n + " uchuvchi"; },
          nazorat: function (h) { return "Navbatdagi nazorat — " + h + "-halqa: unga oxirgi yetgan chiqadi"; }, halqa: function (n) { return n + " halqa"; },
          chiqdiH: function (h) { return h + "-halqada chiqdi"; }, qayt: "Poygaga qaytish", qaytS: "Siz hali poygadasiz — vaqt to'xtamaydi",
          sizChiq: function (n) { return "Siz " + n + "-o'rinda poygani tark etdingiz"; }, tomoshaS: "Qolganini shu yerda kuzatishingiz mumkin",
          marra: "Marraga yetdingiz!", marraS: "Natija aniqlanmoqda…",
          ketdi: function (i) { return i + " poygani tark etdi"; },
          tugadi: "Poyga tugadi", golib: "G'olib", golibE: "g'olib", siz: "siz", orningiz: function (n) { return "Sizning o'rningiz: " + n; },
          ball: function (n) { return "+" + n + " ball kubokka"; }, bolmadi: "Bu safar uchuvchi yetmadi — poyga o'tmadi.", ortga: "Xogvartsga qaytish",
          yoq: "Aloqa yo'q — qayta urinib ko'ring", m: " daq ", h: " soat ", kunQ: "kun", mashqK: "Mashq" },
    ru: { kick: "Турнир понедельника", ttl: "Гонка", nom: "Гонка на мётлах", kunlar: ["воскресенье", "понедельник", "вторник", "среда", "четверг", "пятница", "суббота"], qoldi: "осталось",
          soni: function (n) { return "Записалось: " + n; }, qat: "Участвую", bor: "Вы записаны — сова напомнит", chiq: "Выйти",
          q1: "Все одновременно летят по одной трассе", q2: "Пролетел через центр кольца — ускорился",
          q3: function (n) { return "Каждые " + n + " колец последний пилот выбывает — побеждает тот, кто останется"; },
          sov: "Призы", orin: function (n) { return n + "-е место"; }, keyinP: function (a, p) { return "Места 4–" + a + " — +" + p + " очк."; },
          otgan: function (n, k) { return "Прошлый победитель: " + n + " (из " + k + ")"; },
          mashq: "Тренировка", mashqS: "Попробуйте трассу из 30 колец — результат не считается", mashqN: function (v) { return "Тренировка: 30 колец — " + v; },
          zal: "Стартовая линия открыта", zalS: function (n) { return "Пришло пилотов: " + n; }, bosh: function (v) { return "До старта " + v; }, kut: "Оставайтесь на этой странице — гонка начнётся сама.",
          kech: "Вы опоздали — в этот раз только смотреть", uchmoqda: "Идёт гонка", tirikN: function (n) { return "В гонке: " + n; },
          nazorat: function (h) { return "Следующий рубеж — кольцо " + h + ": последний на нём выбывает"; }, halqa: function (n) { return "колец: " + n; },
          chiqdiH: function (h) { return "выбыл на кольце " + h; }, qayt: "Вернуться в гонку", qaytS: "Вы ещё в гонке — время идёт",
          sizChiq: function (n) { return "Вы выбыли — " + n + "-е место"; }, tomoshaS: "Дальше можно смотреть здесь",
          marra: "Вы на финише!", marraS: "Определяем результат…",
          ketdi: function (i) { return i + " выбывает"; },
          tugadi: "Гонка окончена", golib: "Победитель", golibE: "победитель", siz: "вы", orningiz: function (n) { return "Ваше место: " + n; },
          ball: function (n) { return "+" + n + " очков в кубок"; }, bolmadi: "В этот раз пилотов не хватило — гонка не состоялась.", ortga: "Вернуться в Хогвартс",
          yoq: "Нет связи — попробуйте ещё раз", m: " мин ", h: " ч ", kunQ: "дн.", mashqK: "Тренировка" },
    en: { kick: "Monday tournament", ttl: "Race", nom: "Broom race", kunlar: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], qoldi: "left",
          soni: function (n) { return n + " signed up"; }, qat: "I'm in", bor: "You are signed up — an owl will remind you", chiq: "Leave",
          q1: "Everyone flies the same course at the same time", q2: "Go through the centre of a hoop to speed up",
          q3: function (n) { return "Every " + n + " hoops the last flyer drops out — the last one left wins"; },
          sov: "Prizes", orin: function (n) { return ["", "1st", "2nd", "3rd"][n] + " place"; }, keyinP: function (a, p) { return "Places 4–" + a + " — +" + p + " pts"; },
          otgan: function (n, k) { return "Last winner: " + n + " (out of " + k + ")"; },
          mashq: "Practice", mashqS: "Try a 30-hoop course — the result does not count", mashqN: function (v) { return "Practice: 30 hoops — " + v; },
          zal: "The start line is open", zalS: function (n) { return n + " flyers are here"; }, bosh: function (v) { return "Start in " + v; }, kut: "Stay on this page — the race will start by itself.",
          kech: "You are late — watching only this time", uchmoqda: "Race in progress", tirikN: function (n) { return n + " flyers in the race"; },
          nazorat: function (h) { return "Next checkpoint — hoop " + h + ": the last one there is out"; }, halqa: function (n) { return n + " hoops"; },
          chiqdiH: function (h) { return "out at hoop " + h; }, qayt: "Back to the race", qaytS: "You are still in — the clock is running",
          sizChiq: function (n) { return "You are out — place " + n; }, tomoshaS: "You can watch the rest here",
          marra: "You reached the finish!", marraS: "Working out the result…",
          ketdi: function (i) { return i + " is out"; },
          tugadi: "The race is over", golib: "Winner", golibE: "winner", siz: "you", orningiz: function (n) { return "Your place: " + n; },
          ball: function (n) { return "+" + n + " points for the Cup"; }, bolmadi: "Not enough flyers this time — no race.", ortga: "Back to Hogwarts",
          yoq: "No connection — please try again", m: " min ", h: " h ", kunQ: "d", mashqK: "Practice" }
  };
  function pgT() { return PG_T[lang] || PG_T.uz; }

  var pgData = null, pgTm = null, pgSoat = null, pgLocal = null, pgOlingan = 0;
  var pgMashq = null;       // oxirgi mashq natijasi {ms}
  var pgUchmoqda = false;   // hozir poygada uchyapti (uchish sahifasi ochiq)
  var pgTashladi = false;   // uchishdan o'zi chiqdi - qayta o'zi ochilmasin («Poygaga qaytish» bilan qaytadi)
  var pgMarra = false;      // yo'l oxiriga yetdi - natija kutilmoqda
  var pgCps = {};           // serverga hali yetmagan nazorat yozuvlari {k: ms}
  var pgUchTm = null, pgChiqN = -1, pgOxPos = 0;

  function pgQol(sek) {
    var t = pgT();
    sek = Math.max(0, Math.round(sek));
    if (sek >= 86400) { return Math.floor(sek / 86400) + " " + t.kunQ + " " + Math.floor(sek % 86400 / 3600) + t.h.replace(/\s+$/, ""); }
    if (sek >= 3600) { return Math.floor(sek / 3600) + t.h + Math.floor(sek % 3600 / 60) + t.m.replace(/\s+$/, ""); }
    return Math.floor(sek / 60) + ":" + (sek % 60 < 10 ? "0" : "") + (sek % 60);
  }
  function pgSek(ms) { return ms == null ? "—" : drX().sec(ms); }

  /* Mahalliy ko'rik uchun namuna: pgLocal.rej = "kutish" | "zal" | "poyga" | "tugadi" */
  function pgSample(body) {
    if (!pgLocal) { pgLocal = { rej: "kutish", joined: false }; }
    var L2 = pgLocal, hozir = Date.now() / 1000;
    if (body && body.join != null) { L2.joined = !!body.join; }
    var res = { ok: true, now: hozir, tour: { ts: hozir + 6 * 86400 + 5 * 3600, now: hozir, open: true, n: 11, joined: L2.joined },
      rules: { count: 6, every: 10, hall: 120, wait: 20, next_pts: 5, next_to: 6, points: { "1": 30, "2": 20, "3": 10 } },
      last: { uid: 5, name: "Garri", house: "gryffindor", n: 14 }, me: { "in": false, alive: false, out: null, place: null }, phase: L2.rej, can_test: true };
    var odam = [["Garri", "gryffindor", 47], ["Jinni", "gryffindor", 46], ["Draco", "slytherin", 44], ["Sehrgar", "ravenclaw", 43], ["Sedrik", "hufflepuff", 43],
                ["Chjou", "ravenclaw", 41], ["Anjelina", "gryffindor", 30], ["Markus", "slytherin", 20], ["Nevill", "gryffindor", 10]]
      .map(function (r, i) { return { uid: 100 + i, name: r[0], house: r[1], pos: r[2], me: i === 3, place: i >= 6 ? i + 1 : null, out: i >= 6 }; });
    if (L2.rej === "zal") { res.total = 12; res.starts_in = 74; res.me = { "in": true, alive: true }; }
    if (L2.rej === "poyga") {
      res.total = 9; res.alive = 6; res.me = { "in": true, alive: !L2.chiqdi };
      res.race = { seed: 4242, start_in: -52, rings: 80, every: 10, cp: 4, pos: 43 };
      res.board = odam;
      if (L2.chiqdi) { odam[3].out = true; odam[3].place = 6; res.me.place = 6; }
    }
    if (L2.rej === "tugadi") {
      res.total = 9; res.alive = 1; res.played = true; res.me = { "in": true, alive: false, place: 4, points: 5 };
      res.board = odam.map(function (p, i) { p.place = i + 1; p.out = i > 0; p.pos = [80, 80, 70, 60, 50, 40, 30, 20, 10][i]; return p; });
    }
    return res;
  }

  function pgPost(body, cb) {
    body = body || {};
    body.lang = lang;
    if (!window.fetch) { return; }
    window.fetch(API_POYGA, { method: "POST", headers: { "Content-Type": "application/json", "X-Telegram-Init-Data": drInit() }, body: JSON.stringify(body) })
      .then(function (r) { return r.json(); })
      .then(function (res) { cb(res && (res.tour || res.light) ? res : (MS_LOCAL ? pgSample(body) : res)); })
      ["catch"](function () { cb(MS_LOCAL ? pgSample(body) : null); });
  }

  function pgKorsat() {
    drShowGame("scr-poyga");
    $("pg-kick").textContent = pgT().kick;
    $("pg-ttl").textContent = pgT().ttl;
    pgRender();
    pgLoad();
  }
  function pgOpen() {
    try { $("scr-hub").classList.add("hidden"); } catch (e) {}
    pgKorsat();
  }
  function pgYop() {
    clearTimeout(pgTm);
    clearInterval(pgSoat);
    var ochiq = $("du-info");
    if (ochiq) { ochiq.parentNode.removeChild(ochiq); }
    $("scr-poyga").classList.add("hidden");
    openHub();
  }

  // Holatni so'rash: poyga oqshomida har 1,5 soniyada, start yaqinlashganda 5 s, boshqa payt daqiqada bir
  function pgLoad() {
    clearTimeout(pgTm);
    if ($("scr-poyga").classList.contains("hidden") || pgD) { return; }
    pgPost({}, function (res) {
      if ($("scr-poyga").classList.contains("hidden")) { return; }
      if (res && res.tour) { pgApply(res); }
      var d = pgData, ph = d && d.phase, kech = d ? d.tour.ts - d.now : 99999;
      var oraliq = (ph === "zal" || ph === "poyga") ? 1500 : (ph === "kutish" && kech < 900) ? 5000 : 60000;
      if (!$("scr-poyga").classList.contains("hidden") && !MS_LOCAL) { pgTm = setTimeout(pgLoad, oraliq); }
    });
  }
  function pgApply(res) {
    pgData = res;
    pgOlingan = Date.now();
    if (res.phase === "kutish" || res.phase === "zal") { pgTashladi = false; pgMarra = false; pgCps = {}; }     // yangi poyga
    // Poyga boshlandi - uchish o'zi ochiladi
    var men = res.me || {};
    if (res.phase === "poyga" && res.race && men.alive && !pgUchmoqda && !pgTashladi && !pgMarra && !MS_LOCAL) { pgUch(); return; }
    pgRender();
  }
  function pgYozil(on) {
    pgPost({ join: on ? 1 : 0 }, function (res) { if (res && res.tour) { pgApply(res); } else { showToast(pgT().yoq, "err"); } });
  }
  function pgSinov(on) {
    pgPost({ sinov: on ? 1 : 0 }, function (res) {
      if (res && res.tour) { pgApply(res); pgLoad(); } else { showToast(pgT().yoq, "err"); }
    });
  }

  /* Poygada uchish: yo'l urug'i serverdan, sanoq hammada bir paytda tugaydi. Har soniyada o'rin aytiladi, jonli jadval olinadi. */
  function pgUch() {
    var d = pgData, r = d.race, t = pgT(), qol = r.start_in - (Date.now() - pgOlingan) / 1000;
    clearTimeout(pgTm);
    clearInterval(pgSoat);
    pgUchmoqda = true; pgTashladi = false; pgChiqN = -1;
    var tezlik = qol >= 0 && dkDamlama("tezlik") > 0;            // do'kon: startdan katta tezlik
    if (tezlik) {
      if (!d.test) { dkPost({ use: "tezlik" }, function (res) { if (res && res.gear) { dkQabul(res); } }); }
      setTimeout(function () { dkDamXabar("tezlik"); }, Math.max(0, qol * 1000) + 300);
    }
    if (dkDaraja("supurgi")) { dkXabar("supurgi", "supurgi", dkFoiz("supurgi", "speed")); }
    uchPoyga({ gaz0: tezlik ? 0.8 : 0, urug: r.seed, halqa: r.rings, har: r.every, joy: qol < 0 ? (r.pos || 0) : 0, kut: Math.max(0, qol * 1000), otdi: Math.max(0, -qol * 1000),
      sarlavha: t.nom + (d.test ? " · SINOV" : ""), ost: t.ttl,
      nazorat: function (k, ms) { pgCps[k] = Math.round(ms); pgUchYubor(); },
      tugadi: function (nat) { pgOxPos = r.rings; pgUchmoqda = false; pgMarra = true; pgUchYubor(); pgKorsat(); },      // yo'l oxiri - natija sahifada kutiladi
      ortga: function () { pgOxPos = pgPosOx; pgUchmoqda = false; pgTashladi = true; pgKorsat(); } });
    pgUchYubor();
  }
  var pgPosOx = 0;
  function pgUchYubor() {
    clearTimeout(pgUchTm);
    var cps = {}, bor = false, k;
    for (k in pgCps) { if (Object.prototype.hasOwnProperty.call(pgCps, k)) { cps[k] = pgCps[k]; bor = true; } }
    if (!pgUchmoqda && !bor) { return; }
    if (pgUchmoqda) { pgPosOx = uchPoygaPos(); }
    var body = { pos: pgUchmoqda ? pgPosOx : pgOxPos };
    if (bor) { body.cps = cps; }
    pgPost(body, function (res) {
      if (res && res.ack) { res.ack.forEach(function (a) { delete pgCps[a]; }); }
      if (res && pgUchmoqda && (res.light || res.tour)) { pgUchKorsat(res); }
      var qoldi = false;
      for (var q in pgCps) { if (Object.prototype.hasOwnProperty.call(pgCps, q)) { qoldi = true; } }
      clearTimeout(pgUchTm);
      if (pgUchmoqda || qoldi) { pgUchTm = setTimeout(pgUchYubor, 1000); }
    });
  }
  // Uchish ostidagi panel: o'z o'rni, nazoratgacha masofa, yaqin raqiblar; chiqib ketgan bo'lsa - uchish to'xtaydi
  function pgUchKorsat(res) {
    var t = pgT(), men = res.me || {};
    if (res.phase !== "poyga" || !men.alive) {
      pgUchmoqda = false;
      uchPoygaToxta();
      if (res.tour) { pgData = res; pgOlingan = Date.now(); }
      else if (pgData) { pgData.me = pgData.me || {}; pgData.me.alive = false; pgData.me.place = men.place; pgData.board = res.board || pgData.board; }
      pgKorsat();
      return;
    }
    var taxta = res.board || [], tirik = taxta.filter(function (p) { return !p.out; }), chiq = taxta.filter(function (p) { return p.out; });
    if (pgChiqN >= 0 && chiq.length > pgChiqN && chiq[0]) { uchPoygaXabar(t.ketdi(chiq[0].name)); }
    pgChiqN = chiq.length;
    var joy = -1, i;
    for (i = 0; i < tirik.length; i++) { if (tirik[i].me) { joy = i; } }
    if (joy < 0) { return; }
    var cp = res.cp != null ? res.cp : (res.race || {}).cp || 0, har = res.every || (res.race || {}).every || 10;
    // o'rin: server jadvali bir soniyagacha eskirgan bo'lishi mumkin - o'zining hozirgi joyi bilan qayta sanaladi
    var men = Math.max(uchPoygaPos(), tirik[joy].pos || 0), orin = 1, raqib = [];
    for (i = 0; i < tirik.length; i++) {
      if (i === joy) { continue; }
      if ((tirik[i].pos || 0) > men) { orin++; }
      raqib.push({ k: (tirik[i].uid || "") + "|" + tirik[i].name, ism: tirik[i].name, uy: tirik[i].house, pos: tirik[i].pos || 0 });
    }
    var enKam = null;
    raqib.forEach(function (q) { if (!enKam || q.pos < enKam.pos) { enKam = q; } });
    if (enKam && orin < tirik.length) { enKam.oxir = true; }
    uchPoygaTaxta({ orin: orin, tirik: tirik.length, qoldi: Math.ceil((cp + 1) * har - men), oxirgi: orin === tirik.length && tirik.length > 1,
                    cpPos: (cp + 1) * har, raqib: raqib });
  }
  /* Mashq: 30 halqalik yo'l, tasodifiy yo'nalish; hech narsa yuborilmaydi */
  function pgMashqUch() {
    var t = pgT();
    clearTimeout(pgTm);
    clearInterval(pgSoat);
    uchPoyga({ urug: 1000 + Math.floor(Math.random() * 900000), halqa: 30, har: 10, mashq: true, sarlavha: t.nom, ost: t.mashqK, kut: 3000,
      tugadi: function (nat) { pgMashq = { ms: nat.ms }; pgKorsat(); },
      ortga: function () { pgKorsat(); } });
  }

  function pgRender() {
    var d = pgData, ph = d ? d.phase : "kutish", oyin = ph === "poyga";
    if (pgD) { return; }                         // do'st bilan poyga ochiq - u o'z sahifasini chizadi (#pg-dost)
    $("pg-info-b").classList.toggle("hidden", !!oyin);
    $("pg-home").classList.toggle("hidden", !!oyin || ph === "tugadi");
    $("pg-oyin").classList.toggle("hidden", !oyin);
    $("pg-end").classList.toggle("hidden", ph !== "tugadi");
    clearInterval(pgSoat);
    if (!d) { return; }
    if (oyin) { pgOyin(); } else if (ph === "tugadi") { pgYakun(); } else { pgBosh(); }
  }

  /* Bosh ko'rinish - YAGONA QOLIP (js/09-turnir-qolip.js): karta -> g'oliblar -> mashq -> qoida va sovrinlar -> yozilganlar -> sinov */
  function pgBosh() {
    var d = pgData, t = pgT(), tp = tpT(), box = $("pg-bosh"), tr = d.tour, zal = d.phase === "zal", r = d.rules || {};
    box.innerHTML = "";
    var holat = zal ? { matn: d.me && d.me["in"] ? t.kut : t.kech, ok: !!(d.me && d.me["in"]) }
      : tpYozHolat(tr, t.bor, t.chiq, t.qat, t.yopiq || t.bor, pgYozil);
    var hero = tpHero({ lab: zal ? tp.ketmoqda : tp.keyingi + (d.test ? " · SINOV" : ""), sar: zal ? t.zal : tpKun(tr.ts, t.kunlar), holat: holat });
    var qol0 = zal ? d.starts_in : tr.ts - tr.now, olingan = pgOlingan;
    var yoz = function () {
      var qol = Math.max(0, qol0 - (Date.now() - olingan) / 1000);
      hero.tpIz.textContent = zal ? t.zalS(d.total || 0) + " · " + t.bosh(pgQol(qol)) : pgQol(qol) + " " + t.qoldi + " · " + t.soni(tr.n);
    };
    yoz();
    pgSoat = setInterval(yoz, 1000);
    box.appendChild(hero);
    var gk = golibKarta(d.champs);                // so'nggi poyga g'oliblari: o'rin va ball (keyingi poygagacha turadi)
    if (gk) { box.appendChild(gk); }
    if (!zal) {                                   // mashq - startga oz qolganda chalg'itmasin
      var dk = tpDost(function () { tkOyna("poyga"); });           // do'st bilan poyga (o'quvchi taklifi, 2026-10-17)
      dk.keng = true;
      box.appendChild(tpMashq(tp.ballsiz, [{ av: tpRasm(IMG_DIR + "hub/poyga.webp"), nom: t.mashq, sub: pgMashq ? t.mashqN(pgSek(pgMashq.ms)) : t.mashqS, keng: true, fn: pgMashqUch }, dk]));
    }
    box.appendChild(tpQoida([t.q1, t.q2, t.q3(r.every || 10)], tpOrinSov(r.points), t.keyinP(r.next_to || 6, r.next_pts || 5)));
    if (!zal) { box.appendChild(tpYoz(tr.players, tr.n)); }
    // Faqat adminga: sinov poygasi - kompyuter uchuvchilar bilan haqiqiy poyga oqimi (ballsiz)
    if (d.can_test && !zal) {
      box.appendChild(tpSinov("Sinov poygasi", "Faqat adminga ko'rinadi · 9 ta kompyuter uchuvchi · ballsiz · 20 soniyadan keyin start", function () { pgSinov(true); }));
    }
  }

  // Jadval: poyga paytida - tiriklar (oxirgisi qizil), ostida chiqqanlar; yakunda - o'rinlar
  function pgJadval(rows, yakun) {
    var t = pgT(), list = drEl("div", "bl-list pg-list"), tirik = (rows || []).filter(function (p) { return !p.out; }), n = 0;
    (rows || []).forEach(function (p) {
      n++;
      var orin = p.place || n, xavf = !yakun && !p.out && tirik.length > 1 && p === tirik[tirik.length - 1];
      var row = drEl("div", "bl-row" + (p.me ? " me" : "") + (p.out && !yakun ? " pg-chiq" : "") + (xavf ? " pg-xavf" : ""));
      row.appendChild(drEl("i", yakun && orin <= 3 ? "o" + orin : "", String(orin)));
      var c2 = drEl("span", "bl-cr"), im = cupCrestImg(p.house, 18);
      if (im) { c2.appendChild(im); }
      row.appendChild(c2);
      row.appendChild(drEl("b", "", p.name + (p.me ? " (" + t.siz + ")" : "")));
      row.appendChild(drEl("em", "", yakun && orin === 1 ? t.golibE : p.out ? t.chiqdiH(p.pos) : t.halqa(Math.floor(p.pos || 0))));
      list.appendChild(odamLink(row, p));
    });
    return list;
  }

  /* Poyga ketmoqda (sahifada turganlar: tomoshabin, chiqib ketgan yoki uchishdan chiqqan) */
  function pgOyin() {
    var d = pgData, t = pgT(), box = $("pg-oyin"), r = d.race || {}, men = d.me || {};
    box.innerHTML = "";
    var tep = drEl("div", "vk-g-top");
    tep.appendChild(drEl("b", "", t.uchmoqda + (d.test ? " · SINOV" : "")));
    tep.appendChild(drEl("span", "", t.tirikN(d.alive || 0)));
    box.appendChild(tep);
    var holat = drEl("div", "pg-holat");
    if (pgMarra && men.alive) {
      holat.classList.add("yaxshi");
      holat.appendChild(drEl("b", "", t.marra));
      holat.appendChild(drEl("small", "", t.marraS));
    } else if (men.alive) {                        // uchishdan chiqib ketgan - qaytsa bo'ladi (vaqt to'xtamaydi)
      holat.appendChild(drEl("b", "", t.qaytS));
      var qb = drEl("button", "dr-btn", t.qayt);
      qb.type = "button";
      qb.addEventListener("click", function () { if (pgData && pgData.race) { pgTashladi = false; pgUch(); } });
      holat.appendChild(qb);
    } else if (men["in"] && men.place) {
      holat.classList.add("yomon");
      holat.appendChild(drEl("b", "", t.sizChiq(men.place)));
      holat.appendChild(drEl("small", "", t.tomoshaS));
    } else {
      holat.appendChild(drEl("b", "", t.kech));
      holat.appendChild(drEl("small", "", t.tomoshaS));
    }
    box.appendChild(holat);
    box.appendChild(drEl("p", "pg-ost", t.nazorat(((r.cp || 0) + 1) * (r.every || 10))));
    box.appendChild(pgJadval(d.board, false));
  }

  /* Yakun: g'olib, o'z o'rni va bali, hamma o'rinlar */
  function pgYakun() {
    var d = pgData, t = pgT(), box = $("pg-end"), men = d.me || {};
    box.innerHTML = "";
    if (!d.played) {
      box.appendChild(drEl("p", "rk-bosh", t.bolmadi));
    } else {
      box.appendChild(drEl("small", "af-baho-k", t.tugadi + (d.test ? " · SINOV" : "")));
      var g = (d.board || [])[0];
      if (g && g.place === 1) {
        var gk = drEl("div", "vk-golib");
        var cr = cupCrestImg(g.house, 46);
        if (cr) { gk.appendChild(cr); }
        gk.appendChild(drEl("small", "", t.golib));
        gk.appendChild(drEl("b", "", g.name + (g.me ? " (" + t.siz + ")" : "")));
        box.appendChild(gk);
      }
      if (men.place) {
        var mk = drEl("div", "vk-men");
        mk.appendChild(drEl("b", "", t.orningiz(men.place)));
        if (men.points) { mk.appendChild(drEl("small", "", t.ball(men.points))); }
        box.appendChild(mk);
      }
      box.appendChild(pgJadval(d.board, true));
    }
    var b = drEl("button", "dr-btn", d.test ? "Sinovni tugatish" : t.ortga);
    b.type = "button";
    b.addEventListener("click", d.test ? function () { pgSinov(false); } : pgYop);
    box.appendChild(b);
  }

  function pgInfo() {
    var eski = $("du-info"), t = pgT(), r = (pgData && pgData.rules) || {}, pt = r.points || {};
    if (eski) { eski.parentNode.removeChild(eski); }
    var v = { hall: Math.round((r.hall || 120) / 60), har: r.every || 10, kut: r.wait || 20, np: r.next_pts || 5, nt: r.next_to || 6, p1: pt["1"] || 30, p2: pt["2"] || 20, p3: pt["3"] || 10 };
    var bandlar = lang === "ru" ? [
      ["Когда", "Раз в неделю — в понедельник в 22:00 (время Ташкента)."],
      ["Кто участвует", "Каждый распределённый ученик, кто был на этой странице к старту. Записываться заранее не обязательно: кнопка «Участвую» нужна, чтобы сова напомнила. Стартовая линия открывается за " + v.hall + " мин до начала."],
      ["Как это проходит", "После отсчёта все одновременно летят по одной и той же трассе. Мётлой управляете пальцем — влево и вправо. Гонка одна, без перерывов."],
      ["Кто выбывает", "Каждые " + v.har + " колец — рубеж. Кто пришёл к нему последним, покидает гонку. Так продолжается, пока не останется один пилот — он и победитель. Чем больше пилотов, тем длиннее гонка."],
      ["Как лететь быстрее", "Чем ближе к центру кольца вы пролетаете, тем сильнее ускорение. Пропущенное кольцо или удар бладжера сбивают скорость. Пойманный снитч даёт большое ускорение."],
      ["Что видно на экране", "Прямо на поле: слева вверху ваше место и сколько колец до рубежа; справа линия гонки — лидер вверху, последний внизу, большая точка — вы. Если вы последний, края поля краснеют."],
      ["Если пропала связь", "Кто не добрался до рубежа за " + v.kut + " с после лидера, тоже выбывает."],
      ["Опоздавшие", "Кто пришёл после старта — зритель: видит таблицу, но не летит."],
      ["Очки", "В кубок факультета: 1-е место +" + v.p1 + ", 2-е +" + v.p2 + ", 3-е +" + v.p3 + ", места 4–" + v.nt + " — +" + v.np + "."],
      ["Тренировка", "Кнопка «Тренировка» открывает трассу из 30 колец в любое время. Результат никуда не идёт."]]
      : lang === "en" ? [
      ["When", "Once a week — on Monday at 22:00 (Tashkent time)."],
      ["Who flies", "Every sorted student who is on this page at the start. You do not have to sign up: “I'm in” just makes an owl remind you. The start line opens " + v.hall + " minutes before the start."],
      ["How it works", "After the countdown everyone flies the same course at the same time. Steer the broom with your finger — left and right. It is one race with no breaks."],
      ["Who drops out", "Every " + v.har + " hoops there is a checkpoint. Whoever reaches it last leaves the race. This goes on until one flyer is left — the winner. The more flyers, the longer the race."],
      ["How to fly faster", "The closer to the centre of a hoop you pass, the bigger the boost. A missed hoop or a Bludger hit slows you down. Catching the Snitch gives a big boost."],
      ["What you see", "Right on the field: your place and hoops left to the checkpoint at the top left; the race line on the right — leader on top, last at the bottom, the big dot is you. If you are last, the edges of the field turn red."],
      ["If the connection drops", "Anyone who does not reach a checkpoint within " + v.kut + " s after the leader is out too."],
      ["Latecomers", "Anyone who arrives after the start is a spectator: they see the table but do not fly."],
      ["Points", "For the House Cup: 1st place +" + v.p1 + ", 2nd +" + v.p2 + ", 3rd +" + v.p3 + ", places 4–" + v.nt + " get +" + v.np + "."],
      ["Practice", "The “Practice” button opens a 30-hoop course at any time. The result goes nowhere."]]
      : [
      ["Qachon", "Haftada bir marta — dushanba kuni soat 22:00 da (Toshkent vaqti)."],
      ["Kim qatnashadi", "Start paytida shu sahifada bo'lgan har bir saralangan o'quvchi. Oldindan yozilish shart emas: «Qatnashaman» tugmasi boyo'g'li eslatishi uchun kerak. Start chizig'i boshlanishidan " + v.hall + " daqiqa oldin ochiladi."],
      ["Qanday o'tadi", "Sanoqdan keyin hamma bir vaqtda bir xil yo'ldan uchadi. Supurgini barmoq bilan o'ngga-chapga boshqarasiz. Poyga bitta, tanaffussiz."],
      ["Kim chiqib ketadi", "Har " + v.har + " halqada — nazorat. Unga eng oxirida yetgan uchuvchi poygani tark etadi. Shu tartibda davom etadi — oxirida bitta uchuvchi qoladi, u g'olib. Uchuvchi qancha ko'p bo'lsa, poyga shuncha uzun."],
      ["Qanday tezroq uchiladi", "Halqaning o'rtasiga qancha yaqin o'tsangiz, shuncha ko'p tezlashasiz. O'tkazib yuborilgan halqa yoki bladjer zarbasi tezlikni tushiradi. Snitchni tutsangiz — katta tezlik."],
      ["Ekranda nima ko'rinadi", "Maydonning o'zida: chap tepada o'rningiz va nazoratgacha nechta halqa qolgani; o'ng chetda poyga chizig'i — yetakchi tepada, oxirgi pastda, katta nuqta siz. Oxirgi bo'lib qolsangiz maydon chetlari qizaradi."],
      ["Aloqa uzilsa", "Birinchi uchuvchi nazoratdan o'tgach " + v.kut + " soniya ichida yetib kelmagan ham chiqib ketadi."],
      ["Kechikkanlar", "Startdan keyin kelgan — tomoshabin: jadvalni ko'radi, lekin uchmaydi."],
      ["Ballar", "Fakultet kubogiga: 1-o'rin +" + v.p1 + ", 2-o'rin +" + v.p2 + ", 3-o'rin +" + v.p3 + ", 4–" + v.nt + "-o'ringa +" + v.np + "."],
      ["Mashq", "«Mashq qilish» tugmasi istalgan payt 30 halqalik yo'lni ochadi. Natija hech qayerga yozilmaydi."]];
    var orqa = drEl("div", "du-info"), oyna = drEl("div", "du-info-p"), yop = function () { if (orqa.parentNode) { orqa.parentNode.removeChild(orqa); } };
    orqa.id = "du-info";
    var bosh = drEl("div", "du-info-h");
    bosh.appendChild(drEl("b", "", t.nom));
    var xb = drEl("button", "", "×");
    xb.type = "button";
    xb.addEventListener("click", yop);
    bosh.appendChild(xb);
    oyna.appendChild(bosh);
    var tana = drEl("div", "du-info-b");
    bandlar.forEach(function (b, i) {
      var q = drEl("div", "du-info-q");
      q.appendChild(drEl("u", "", String(i + 1)));
      var m = document.createElement("span");
      m.appendChild(drEl("b", "", b[0]));
      m.appendChild(drEl("p", "", b[1]));
      q.appendChild(m);
      tana.appendChild(q);
    });
    oyna.appendChild(tana);
    orqa.appendChild(oyna);
    orqa.addEventListener("click", function (e) { if (e.target === orqa) { yop(); } });
    document.body.appendChild(orqa);
  }

  /* ================= DO'ST BILAN POYGA (o'quvchi taklifi, 2026-10-17; Toshchalar/Maxluqlar jangi qolipida) =================
     Taklif: «Do'st bilan» katagi -> tkOyna("poyga") (chat yoki Telegram). Server: {dost: 1}, {dqabul}, {dbekor}, {doyin, dpos | dfin | dtashla}.
     Qabul qilingach ikkalasi DOST_SANOQ soniyadan keyin BIR XIL yo'ldan (30 halqa) uchadi; marraga tezroq yetgan yutadi; ball yo'q.
     Uchish paytida raqib joyi maydonning o'ng chetidagi poyga chizig'ida ko'rinadi (uchPoygaTaxta). Sahifa: #pg-dost. */
  var PGD_T = {
    uz: { lab: "Do'stona poyga", dost: "Do'st bilan", kutT: "Do'stingizni kutyapmiz", kutS: "Taklif chatda turibdi — do'stingiz qabul qilishi bilan poyga boshlanadi",
          muddat: function (v) { return "Taklif yana " + v + " amal qiladi"; }, kutB: "Raqib kutilmoqda", tg: "Telegram chatiga yuborish", bekor: "Bekor qilish",
          start: function (s) { return "Start " + s + " soniyadan keyin"; }, ketmoqda: "Poyga ketmoqda", qayt: "Poygaga qaytish", qaytS: "Vaqt to'xtamaydi — tezroq qayting!",
          marra: "Marraga yetdingiz! Raqib kutilmoqda…", yutdi: "G'alaba!", yutqazdi: "Mag'lubiyat", durang: "Durang", golib: function (n) { return n + " yutdi"; },
          why: { kelmadi: "Raqib uchmadi", tashladi: "Raqib poygani tark etdi", vaqt: "Vaqt tugadi — ko'proq halqa o'tgan yutdi", ikkalasi: "Hech kim uchmadi" },
          yana: "Yana o'ynash", ortga: "Ortga", siz: "siz", uchT: "Uchuvchilar", halqaS: function (n) { return n + " halqa"; }, halqa: function (n, m) { return n + " / " + m; },
          oldinda: function (q) { return "Siz oldindasiz · marragacha " + q; }, ortda: function (q) { return "Raqib oldinda · marragacha " + q; },
          eBand: "Bu taklifni boshqa sehrgar qabul qilib bo'ldi", eMuddat: "Taklif muddati tugagan", aloqa: "Aloqa yo'q — qayta urinib ko'ring" },
    ru: { lab: "Дружеская гонка", dost: "С другом", kutT: "Ждём вашего друга", kutS: "Приглашение в чате — гонка начнётся, как только друг его примет",
          muddat: function (v) { return "Приглашение действует ещё " + v; }, kutB: "Ждём соперника", tg: "Отправить в чат Telegram", bekor: "Отменить",
          start: function (s) { return "Старт через " + s + " с"; }, ketmoqda: "Гонка идёт", qayt: "Вернуться в гонку", qaytS: "Время идёт — возвращайтесь скорее!",
          marra: "Вы на финише! Ждём соперника…", yutdi: "Победа!", yutqazdi: "Поражение", durang: "Ничья", golib: function (n) { return "Победил " + n; },
          why: { kelmadi: "Соперник не взлетел", tashladi: "Соперник покинул гонку", vaqt: "Время вышло — победил тот, кто пролетел больше колец", ikkalasi: "Никто не взлетел" },
          yana: "Ещё раз", ortga: "Назад", siz: "вы", uchT: "Пилоты", halqaS: function (n) { return n + " колец"; }, halqa: function (n, m) { return n + " / " + m; },
          oldinda: function (q) { return "Вы впереди · до финиша " + q; }, ortda: function (q) { return "Соперник впереди · до финиша " + q; },
          eBand: "Это приглашение уже принял другой", eMuddat: "Срок приглашения истёк", aloqa: "Нет связи — попробуйте ещё раз" },
    en: { lab: "Friendly race", dost: "With a friend", kutT: "Waiting for your friend", kutS: "The invite is in the chat — the race starts as soon as your friend accepts",
          muddat: function (v) { return "The invite is valid for " + v + " more"; }, kutB: "Waiting for a rival", tg: "Send to a Telegram chat", bekor: "Cancel",
          start: function (s) { return "Start in " + s + " s"; }, ketmoqda: "Race in progress", qayt: "Back to the race", qaytS: "The clock is running — hurry back!",
          marra: "You reached the finish! Waiting for your rival…", yutdi: "Victory!", yutqazdi: "Defeat", durang: "Draw", golib: function (n) { return n + " won"; },
          why: { kelmadi: "Your rival never took off", tashladi: "Your rival left the race", vaqt: "Time is up — more hoops wins", ikkalasi: "Nobody took off" },
          yana: "Play again", ortga: "Back", siz: "you", uchT: "Flyers", halqaS: function (n) { return n + " hoops"; }, halqa: function (n, m) { return n + " / " + m; },
          oldinda: function (q) { return "You are ahead · " + q + " to the finish"; }, ortda: function (q) { return "Rival ahead · " + q + " to the finish"; },
          eBand: "Someone else has already accepted this invite", eMuddat: "The invite has expired", aloqa: "No connection — please try again" }
  };
  function pgdT() { return PGD_T[lang] || PGD_T.uz; }
  var pgD = null;          // {id, g, tm, olingan, uch (uchyapti), ortga (uchishdan chiqdi), marra (o'z vaqti yuborildi)}
  var pgdLocal = null;
  function pgdSample(body) {
    var h = Date.now() / 1000;
    if (!pgdLocal || body.dost || body.dqabul) { pgdLocal = { t0: h, st: body.dqabul ? "ketmoqda" : "kutmoqda", me: body.dqabul ? "b" : "a" }; }
    var L2 = pgdLocal, g = { id: 9, state: L2.st, me: L2.me, friend: true, rings: 30, every: 10, a: { uid: 1, name: "Garri", house: "gryffindor" },
      b: L2.st === "kutmoqda" ? null : { uid: 2, name: "Draco", house: "slytherin" }, pos: [0, 0], ms: [null, null], winner: null, why: null };
    if (L2.st === "kutmoqda") { g.expires_in = 1700; } else { g.seed = 4242; g.start_in = 8 - (h - L2.t0); g.pos = [Math.min(30, Math.max(0, h - L2.t0 - 8) * 0.55), body.dpos || 0]; }
    if (body.dfin != null) { L2.st = "tugadi"; L2.fin = body.dfin; }
    if (L2.st === "tugadi") { g.state = "tugadi"; g.ms = [L2.fin ? L2.fin + 2100 : 47300, L2.fin || 44900]; g.pos = [30, 30]; g.winner = L2.me === "b" ? "b" : "a"; g.why = "oyin"; }
    return { ok: true, dost: g };
  }
  function pgdPost(body, cb) {
    body = body || {};
    body.lang = lang;
    if (!window.fetch) { return; }
    window.fetch(API_POYGA, { method: "POST", headers: { "Content-Type": "application/json", "X-Telegram-Init-Data": drInit() }, body: JSON.stringify(body) })
      .then(function (r) { return r.json(); })
      .then(function (res) { cb(res && (res.dost || res.ok === false || res.bekor_ok != null) ? res : (MS_LOCAL ? pgdSample(body) : res)); })
      ["catch"](function () { cb(MS_LOCAL ? pgdSample(body) : null); });
  }
  // «Do'st bilan» -> tkOyna("poyga"): Telegram tanlansa shu yerga (tgga), chat tanlansa server taklifni o'zi yaratadi (tkInvite)
  function pgDostBoshla(tgga) {
    pgdPost({ dost: 1 }, function (res) {
      if (!res || !res.dost) { showToast(pgdT().aloqa, "err"); return; }
      pgDostOch(res.dost.id, res.dost);
      if (tgga) { tgTaklif("poyga", res.dost.id); }
    });
  }
  // Chatdagi kartadan yoki Telegram havolasidan: qabul qilib, poygaga kiradi
  function pgDostQabul(id) {
    var t = pgdT();
    try { $("scr-cat").classList.add("hidden"); $("scr-hub").classList.add("hidden"); } catch (e) {}
    pgdPost({ dqabul: id }, function (res) {
      if (res && res.dost) { pgDostOch(res.dost.id, res.dost); return; }
      showToast(res && res.error === "band" ? t.eBand : res && res.error === "muddat" ? t.eMuddat : t.aloqa, "err");
      pgKorsat();
    });
  }
  function pgDostOch(id, g0) {
    pgdStop();
    clearTimeout(pgTm);
    clearInterval(pgSoat);
    pgD = { id: id, g: null, tm: null, olingan: 0, uch: false, ortga: false, marra: false };
    pgdKorsat();
    if (g0) { pgdQabul(g0); }
    pgdSor();
  }
  function pgdKorsat() {
    drShowGame("scr-poyga");
    $("pg-kick").textContent = pgdT().lab;
    $("pg-ttl").textContent = pgT().ttl;
    ["pg-home", "pg-oyin", "pg-end", "pg-info-b"].forEach(function (k) { $(k).classList.add("hidden"); });
    $("pg-dost").classList.remove("hidden");
  }
  function pgdStop() { if (pgD) { clearTimeout(pgD.tm); } }
  function pgdYop() {
    if (pgD && pgD.uch) { uchPoygaToxta(); }
    pgdStop();
    pgD = null;
    $("pg-dost").classList.add("hidden");
    $("pg-dost").innerHTML = "";
    pgKorsat();
  }
  function pgdSor() {
    if (!pgD) { return; }
    var me = pgD, body = { doyin: pgD.id };
    clearTimeout(pgD.tm);
    if (pgD.uch) { body.dpos = uchPoygaPos(); }
    pgdPost(body, function (res) {
      if (pgD !== me) { return; }
      if (res && res.dost) { pgdQabul(res.dost); }
      var g = pgD.g;
      if (!g || g.state !== "tugadi" || pgD.uch) { pgD.tm = setTimeout(pgdSor, pgD.uch ? 1000 : 1500); }
    });
  }
  function pgdMen(g) { return g && g.me ? (g.me === "a" ? 0 : 1) : -1; }
  function pgdQabul(g) {
    if (!pgD) { return; }
    pgD.g = g;
    pgD.olingan = Date.now();
    var i = pgdMen(g);
    if (pgD.uch) {
      if (g.state === "tugadi" && g.ms[i] == null) { pgD.uch = false; uchPoygaToxta(); pgdKorsat(); pgdChiz(); return; }
      var r = g.me === "a" ? g.b : g.a, rp = g.pos[1 - i] || 0, men = uchPoygaPos(), oldin = men >= rp, q = Math.max(0, Math.ceil(g.rings - men));
      uchPoygaTaxta({ orin: oldin ? 1 : 2, tirik: 2, qoldi: q, oxirgi: !oldin, cpPos: g.rings, yoz: oldin ? pgdT().oldinda(q) : pgdT().ortda(q),
                      raqib: r ? [{ k: "r", ism: r.name, uy: r.house, pos: rp }] : [] });
      return;
    }
    if (g.state === "ketmoqda" && i >= 0 && g.ms[i] == null && !pgD.ortga && !pgD.marra) { pgdUch(); return; }
    pgdChiz();
  }
  function pgdUch() {
    var g = pgD.g, t = pgdT(), i = pgdMen(g), qol = g.start_in - (Date.now() - pgD.olingan) / 1000, raq = g.me === "a" ? g.b : g.a;
    pgD.uch = true; pgD.ortga = false;
    if (dkDaraja("supurgi")) { dkXabar("supurgi", "supurgi", dkFoiz("supurgi", "speed")); }
    uchPoyga({ urug: g.seed, halqa: g.rings, har: g.every || 10, mashq: true, joy: qol < 0 ? (g.pos[i] || 0) : 0,
      kut: Math.max(0, qol * 1000), otdi: Math.max(0, -qol * 1000), sarlavha: t.lab, ost: raq ? "⚔ " + raq.name : pgT().ttl,
      tugadi: function (nat) {
        if (!pgD) { return; }
        pgD.uch = false; pgD.marra = true;
        pgdKorsat(); pgdChiz();
        pgdPost({ doyin: pgD.id, dfin: Math.round(nat.ms) }, function (res) { if (pgD && res && res.dost) { pgdQabul(res.dost); pgdSor(); } });
      },
      ortga: function () { if (!pgD) { return; } pgD.uch = false; pgD.ortga = true; pgdKorsat(); pgdChiz(); pgdSor(); } });
  }
  function pgdSek(ms) { return ms == null ? null : (Math.round(ms / 100) / 10).toFixed(1).replace(".", lang === "en" ? "." : ",") + " s"; }
  // Sahifa: holat kartasi (kutish / start / natija) va ikkala uchuvchining yo'li
  function pgdChiz() {
    var box = $("pg-dost"), g = pgD && pgD.g, t = pgdT();
    if (!g) { return; }
    box.innerHTML = "";
    var i = pgdMen(g), o = { lab: t.dost }, tug = [];
    if (g.state === "kutmoqda") {
      o.sar = i === 0 ? t.kutT : t.kutB;
      o.iz = i === 0 ? t.kutS + " · " + t.muddat(pgQol(g.expires_in || 0)) : "";
      if (i === 0) {
        tug.push([t.tg, function () { tgTaklif("poyga", g.id); }, ""]);
        tug.push([t.bekor, function () { pgdPost({ dbekor: g.id }, function () {}); pgdYop(); }, "gb-ikki"]);
      }
    } else if (g.state === "ketmoqda") {
      var qol = g.start_in - (Date.now() - pgD.olingan) / 1000;
      o.sar = qol > 0 ? t.start(Math.ceil(qol)) : pgD.marra || (i >= 0 && g.ms[i] != null) ? t.marra : t.ketmoqda;
      if (i >= 0 && g.ms[i] == null && pgD.ortga) { o.iz = t.qaytS; tug.push([t.qayt, function () { pgD.ortga = false; pgdUch(); }, ""]); }
    } else {
      var yut = g.winner ? (g.winner === "a" ? 0 : 1) : -1, raqNomi = (g.winner === "a" ? g.a : g.b || {}).name || "";
      o.sar = i < 0 ? (yut < 0 ? t.durang : t.golib(raqNomi)) : yut < 0 ? t.durang : yut === i ? t.yutdi : t.yutqazdi;
      o.iz = g.why && g.why !== "oyin" && t.why[g.why] ? (g.why === "tashladi" && yut !== i && i >= 0 ? "" : t.why[g.why]) : "";
      if (i >= 0) { tug.push([t.yana, function () { pgdYop(); tkOyna("poyga"); }, ""]); }
      tug.push([t.ortga, pgdYop, "gb-ikki"]);
    }
    box.appendChild(tpHero(o));
    // ikkala uchuvchi: yo'l chizig'i, vaqt
    var k = drEl("div", "tp-card pgd-k");
    [[g.a, 0], [g.b, 1]].forEach(function (p) {
      var u = p[0], j = p[1];
      if (!u) { return; }
      var r = drEl("div", "pgd-r" + (g.winner && g.winner === (j ? "b" : "a") ? " g" : "") + (j === i ? " men" : ""));
      var bosh = drEl("div", "pgd-h"), cr = cupCrestImg(u.house, 18);
      if (cr) { bosh.appendChild(cr); }
      bosh.appendChild(drEl("b", "", u.name + (j === i ? " (" + t.siz + ")" : "")));
      bosh.appendChild(drEl("em", "", pgdSek(g.ms[j]) || t.halqa(Math.floor(g.pos[j] || 0), g.rings)));
      r.appendChild(bosh);
      var ch = drEl("span", "pgd-ch"), ic = drEl("i", "");
      ic.style.width = Math.min(100, 100 * (g.pos[j] || 0) / (g.rings || 30)) + "%";
      ch.appendChild(ic);
      r.appendChild(ch);
      k.appendChild(r);
    });
    if (g.b) { box.appendChild(tpSek(t.uchT, t.halqaS(g.rings))); box.appendChild(k); }
    if (tug.length) {
      var tb = drEl("div", "gb-e-b pgd-b");
      tug.forEach(function (q) { var b = drEl("button", "dr-btn" + (q[2] ? " " + q[2] : ""), q[0]); b.type = "button"; b.addEventListener("click", q[1]); tb.appendChild(b); });
      box.appendChild(tb);
    }
  }

  function pgSetup() {
    $("pg-back").addEventListener("click", function () { if (pgD) { pgdYop(); return; } pgYop(); });
    $("pg-info-b").addEventListener("click", pgInfo);
  }

  pgSetup();
