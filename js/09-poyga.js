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
          soni: function (n) { return n + " kishi yozildi"; }, qat: "Qatnashaman", bor: "Eslatma yoqilgan — boyo'g'li xabar beradi", chiq: "Bekor qilish",
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
          pOrin: function (o, n, q) { return o + "-o'rin · " + n + " uchuvchi · nazoratgacha " + q + " halqa"; },
          pOtdi: function (o, n) { return o + "-o'rin · " + n + " uchuvchi · nazoratdan o'tdingiz"; },
          pOxir: function (q) { return "Siz oxirgisiz! Nazoratgacha " + q + " halqa"; }, ketdi: function (i) { return i + " poygani tark etdi"; },
          tugadi: "Poyga tugadi", golib: "G'olib", golibE: "g'olib", siz: "siz", orningiz: function (n) { return "Sizning o'rningiz: " + n; },
          ball: function (n) { return "+" + n + " ball kubokka"; }, bolmadi: "Bu safar uchuvchi yetmadi — poyga o'tmadi.", ortga: "Xogvartsga qaytish",
          yoq: "Aloqa yo'q — qayta urinib ko'ring", m: " daq ", h: " soat ", kunQ: "kun", mashqK: "Mashq" },
    ru: { kick: "Турнир понедельника", ttl: "Гонка", nom: "Гонка на мётлах", kunlar: ["воскресенье", "понедельник", "вторник", "среда", "четверг", "пятница", "суббота"], qoldi: "осталось",
          soni: function (n) { return "Записалось: " + n; }, qat: "Участвую", bor: "Напоминание включено — сова сообщит", chiq: "Отменить",
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
          pOrin: function (o, n, q) { return o + "-е место · пилотов: " + n + " · до рубежа " + q; },
          pOtdi: function (o, n) { return o + "-е место · пилотов: " + n + " · рубеж пройден"; },
          pOxir: function (q) { return "Вы последний! До рубежа " + q + " колец"; }, ketdi: function (i) { return i + " выбывает"; },
          tugadi: "Гонка окончена", golib: "Победитель", golibE: "победитель", siz: "вы", orningiz: function (n) { return "Ваше место: " + n; },
          ball: function (n) { return "+" + n + " очков в кубок"; }, bolmadi: "В этот раз пилотов не хватило — гонка не состоялась.", ortga: "Вернуться в Хогвартс",
          yoq: "Нет связи — попробуйте ещё раз", m: " мин ", h: " ч ", kunQ: "дн.", mashqK: "Тренировка" },
    en: { kick: "Monday tournament", ttl: "Race", nom: "Broom race", kunlar: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], qoldi: "left",
          soni: function (n) { return n + " signed up"; }, qat: "I'm in", bor: "Reminder on — an owl will let you know", chiq: "Cancel",
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
          pOrin: function (o, n, q) { return "Place " + o + " of " + n + " · " + q + " hoops to the checkpoint"; },
          pOtdi: function (o, n) { return "Place " + o + " of " + n + " · checkpoint passed"; },
          pOxir: function (q) { return "You are last! " + q + " hoops to the checkpoint"; }, ketdi: function (i) { return i + " is out"; },
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
    if ($("scr-poyga").classList.contains("hidden")) { return; }
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
    uchPoyga({ urug: r.seed, halqa: r.rings, har: r.every, joy: qol < 0 ? (r.pos || 0) : 0, kut: Math.max(0, qol * 1000), otdi: Math.max(0, -qol * 1000),
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
    if (pgChiqN >= 0 && chiq.length > pgChiqN && chiq[0]) { showToast(t.ketdi(chiq[0].name)); }
    pgChiqN = chiq.length;
    var joy = -1, i;
    for (i = 0; i < tirik.length; i++) { if (tirik[i].me) { joy = i; } }
    if (joy < 0) { return; }
    var cp = res.cp != null ? res.cp : (res.race || {}).cp || 0, har = res.every || (res.race || {}).every || 10;
    var qoldi = (cp + 1) * har - Math.max(uchPoygaPos(), tirik[joy].pos || 0), oxirgi = joy === tirik.length - 1;
    var kerak = {}, qator = [], oldingi = -1;
    [0, joy - 1, joy, joy + 1, tirik.length - 1].forEach(function (n) { if (n >= 0 && n < tirik.length) { kerak[n] = 1; } });
    if (tirik.length <= 5) { for (i = 0; i < tirik.length; i++) { kerak[i] = 1; } }
    for (i = 0; i < tirik.length; i++) {
      if (!kerak[i]) { continue; }
      qator.push({ n: i + 1, ism: tirik[i].name + (tirik[i].me ? " (" + t.siz + ")" : ""), pos: tirik[i].me ? Math.max(uchPoygaPos(), tirik[i].pos || 0) : tirik[i].pos,
                   men: tirik[i].me, oxir: i === tirik.length - 1, uzuq: oldingi >= 0 && i - oldingi > 1 });
      oldingi = i;
    }
    uchPoygaTaxta({ orin: joy + 1, tirik: tirik.length, oxirgi: oxirgi, qator: qator,
      matn: qoldi <= 0 ? t.pOtdi(joy + 1, tirik.length) : oxirgi ? t.pOxir(qoldi) : t.pOrin(joy + 1, tirik.length, qoldi) });
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
    $("pg-info-b").classList.toggle("hidden", !!oyin);
    $("pg-home").classList.toggle("hidden", !!oyin || ph === "tugadi");
    $("pg-oyin").classList.toggle("hidden", !oyin);
    $("pg-end").classList.toggle("hidden", ph !== "tugadi");
    clearInterval(pgSoat);
    if (!d) { return; }
    if (oyin) { pgOyin(); } else if (ph === "tugadi") { pgYakun(); } else { pgBosh(); }
  }

  /* Bosh ko'rinish: turnir kartasi (qachon / start chizig'i), mashq, qoida va sovrinlar */
  function pgBosh() {
    var d = pgData, t = pgT(), box = $("pg-hero"), tr = d.tour, zal = d.phase === "zal";
    box.innerHTML = "";
    var tep = drEl("div", "du-h-t"), chap = drEl("span", "du-h-m");
    chap.appendChild(drEl("small", "", t.nom + (d.test ? " · SINOV" : "")));
    var kun = t.kunlar[new Date((tr.ts + 5 * 3600) * 1000).getUTCDay()];
    chap.appendChild(drEl("b", "", zal ? t.zal : kun.charAt(0).toUpperCase() + kun.slice(1) + ", 21:00"));
    var iz = drEl("em", "", "");
    chap.appendChild(iz);
    tep.appendChild(chap);
    box.appendChild(tep);
    var qol0 = zal ? d.starts_in : tr.ts - tr.now, olingan = pgOlingan;
    var yoz = function () {
      var qol = Math.max(0, qol0 - (Date.now() - olingan) / 1000);
      iz.textContent = zal ? t.zalS(d.total || 0) + " · " + t.bosh(pgQol(qol)) : pgQol(qol) + " " + t.qoldi + " · " + t.soni(tr.n);
    };
    yoz();
    pgSoat = setInterval(yoz, 1000);
    if (zal) {
      var kq = drEl("div", "du-yoz bor");
      kq.appendChild(drEl("b", "", d.me && d.me["in"] ? t.kut : t.kech));
      box.appendChild(kq);
    } else if (tr.open) {
      var yb = drEl("div", "du-yoz" + (tr.joined ? " bor" : ""));
      if (tr.joined) {
        yb.appendChild(drEl("b", "", t.bor));
        var ch = drEl("button", "", t.chiq);
        ch.type = "button";
        ch.addEventListener("click", function () { pgYozil(false); });
        yb.appendChild(ch);
      } else {
        var qb = drEl("button", "dr-btn", t.qat);
        qb.type = "button";
        qb.addEventListener("click", function () { pgYozil(true); });
        yb.appendChild(qb);
      }
      box.appendChild(yb);
    }
    var q = $("pg-qoida"), r = d.rules || {}, pt = r.points || {};
    q.innerHTML = "";
    if (!zal) {                                   // mashq - startga oz qolganda chalg'itmasin
      var mq = drEl("button", "pg-mashq");
      mq.type = "button";
      var mm = drEl("span", "");
      mm.appendChild(drEl("b", "", t.mashq));
      mm.appendChild(drEl("small", "", pgMashq ? t.mashqN(pgSek(pgMashq.ms)) : t.mashqS));
      mq.appendChild(mm);
      mq.appendChild(drEl("i", "", "›"));
      mq.addEventListener("click", pgMashqUch);
      q.appendChild(mq);
    }
    [t.q1, t.q2, t.q3(r.every || 10)].forEach(function (m, i) {
      var b = drEl("div", "vk-q");
      b.appendChild(drEl("u", "", String(i + 1)));
      b.appendChild(drEl("span", "", m));
      q.appendChild(b);
    });
    var sv = drEl("div", "vk-sov");
    sv.appendChild(drEl("small", "", t.sov));
    var qator = drEl("div", "vk-sov-r");
    [1, 2, 3].forEach(function (o) {
      var k = drEl("span", "vk-pz o" + o);
      k.appendChild(drEl("b", "", "+" + (pt[String(o)] || 0)));
      k.appendChild(drEl("small", "", t.orin(o)));
      qator.appendChild(k);
    });
    sv.appendChild(qator);
    sv.appendChild(drEl("p", "", t.keyinP(r.next_to || 6, r.next_pts || 5)));
    q.appendChild(sv);
    if (d.last) { q.appendChild(drEl("p", "vk-otgan", t.otgan(d.last.name, d.last.n))); }
    // Faqat adminga: sinov poygasi - kompyuter uchuvchilar bilan haqiqiy poyga oqimi (ballsiz)
    if (d.can_test && !zal) {
      var sb = drEl("button", "pg-mashq pg-sinov");
      sb.type = "button";
      var sm = drEl("span", "");
      sm.appendChild(drEl("b", "", "Sinov poygasi"));
      sm.appendChild(drEl("small", "", "Faqat adminga ko'rinadi · 9 ta kompyuter uchuvchi · ballsiz · 20 soniyadan keyin start"));
      sb.appendChild(sm);
      sb.appendChild(drEl("i", "", "›"));
      sb.addEventListener("click", function () { pgSinov(true); });
      q.appendChild(sb);
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
      row.appendChild(drEl("em", "", yakun && orin === 1 ? t.golibE : p.out ? t.chiqdiH(p.pos) : t.halqa(p.pos || 0)));
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
      ["Когда", "Раз в неделю — в понедельник в 21:00 (время Ташкента)."],
      ["Кто участвует", "Каждый распределённый ученик, кто был на этой странице к старту. Записываться заранее не обязательно: кнопка «Участвую» нужна, чтобы сова напомнила. Стартовая линия открывается за " + v.hall + " мин до начала."],
      ["Как это проходит", "После отсчёта все одновременно летят по одной и той же трассе. Мётлой управляете пальцем — влево и вправо. Гонка одна, без перерывов."],
      ["Кто выбывает", "Каждые " + v.har + " колец — рубеж. Кто пришёл к нему последним, покидает гонку. Так продолжается, пока не останется один пилот — он и победитель. Чем больше пилотов, тем длиннее гонка."],
      ["Как лететь быстрее", "Чем ближе к центру кольца вы пролетаете, тем сильнее ускорение. Пропущенное кольцо или удар бладжера сбивают скорость. Пойманный снитч даёт большое ускорение."],
      ["Что видно на экране", "Под полем — ваше место, сколько колец до рубежа и ближайшие соперники. Последний в списке выделен красным: он в опасности."],
      ["Если пропала связь", "Кто не добрался до рубежа за " + v.kut + " с после лидера, тоже выбывает."],
      ["Опоздавшие", "Кто пришёл после старта — зритель: видит таблицу, но не летит."],
      ["Очки", "В кубок факультета: 1-е место +" + v.p1 + ", 2-е +" + v.p2 + ", 3-е +" + v.p3 + ", места 4–" + v.nt + " — +" + v.np + "."],
      ["Тренировка", "Кнопка «Тренировка» открывает трассу из 30 колец в любое время. Результат никуда не идёт."]]
      : lang === "en" ? [
      ["When", "Once a week — on Monday at 21:00 (Tashkent time)."],
      ["Who flies", "Every sorted student who is on this page at the start. You do not have to sign up: “I'm in” just makes an owl remind you. The start line opens " + v.hall + " minutes before the start."],
      ["How it works", "After the countdown everyone flies the same course at the same time. Steer the broom with your finger — left and right. It is one race with no breaks."],
      ["Who drops out", "Every " + v.har + " hoops there is a checkpoint. Whoever reaches it last leaves the race. This goes on until one flyer is left — the winner. The more flyers, the longer the race."],
      ["How to fly faster", "The closer to the centre of a hoop you pass, the bigger the boost. A missed hoop or a Bludger hit slows you down. Catching the Snitch gives a big boost."],
      ["What you see", "Under the field: your place, hoops left to the checkpoint and the nearest rivals. The last flyer is shown in red — in danger."],
      ["If the connection drops", "Anyone who does not reach a checkpoint within " + v.kut + " s after the leader is out too."],
      ["Latecomers", "Anyone who arrives after the start is a spectator: they see the table but do not fly."],
      ["Points", "For the House Cup: 1st place +" + v.p1 + ", 2nd +" + v.p2 + ", 3rd +" + v.p3 + ", places 4–" + v.nt + " get +" + v.np + "."],
      ["Practice", "The “Practice” button opens a 30-hoop course at any time. The result goes nowhere."]]
      : [
      ["Qachon", "Haftada bir marta — dushanba kuni soat 21:00 da (Toshkent vaqti)."],
      ["Kim qatnashadi", "Start paytida shu sahifada bo'lgan har bir saralangan o'quvchi. Oldindan yozilish shart emas: «Qatnashaman» tugmasi boyo'g'li eslatishi uchun kerak. Start chizig'i boshlanishidan " + v.hall + " daqiqa oldin ochiladi."],
      ["Qanday o'tadi", "Sanoqdan keyin hamma bir vaqtda bir xil yo'ldan uchadi. Supurgini barmoq bilan o'ngga-chapga boshqarasiz. Poyga bitta, tanaffussiz."],
      ["Kim chiqib ketadi", "Har " + v.har + " halqada — nazorat. Unga eng oxirida yetgan uchuvchi poygani tark etadi. Shu tartibda davom etadi — oxirida bitta uchuvchi qoladi, u g'olib. Uchuvchi qancha ko'p bo'lsa, poyga shuncha uzun."],
      ["Qanday tezroq uchiladi", "Halqaning o'rtasiga qancha yaqin o'tsangiz, shuncha ko'p tezlashasiz. O'tkazib yuborilgan halqa yoki bladjer zarbasi tezlikni tushiradi. Snitchni tutsangiz — katta tezlik."],
      ["Ekranda nima ko'rinadi", "Maydon ostida — o'rningiz, nazoratgacha nechta halqa qolgani va yaqin raqiblar. Ro'yxatdagi oxirgi uchuvchi qizil rangda: u xavf ostida."],
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

  function pgSetup() {
    $("pg-back").addEventListener("click", pgYop);
    $("pg-info-b").addEventListener("click", pgInfo);
  }

  pgSetup();
