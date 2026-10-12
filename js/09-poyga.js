/* «Supurgi poygasi» - dushanba turniri (egasi, 2026-10-12). Server: hppoyga.py, POST /api/poyga.
   Hamma bir vaqtda bitta yo'ldan uchadi (uchishning o'zi - js/09-darslar.js dagi uchPoyga), har bosqichda sekinlar chiqib ketadi.
   Ilova kodi bir necha faylga bo'lingan; hammasi BIR umumiy maydonda ishlaydi
   va index.html dagi TARTIBDA yuklanadi. Yuklanish paytida keyingi fayldagi
   narsani chaqirmang - tekshiruv: tools/tartib.js */
"use strict";

  var API_POYGA = "https://bot.tizimshunos.uz/api/poyga";
  var PG_T = {
    uz: { kick: "Dushanba turniri", ttl: "Poyga", nom: "Supurgi poygasi", kunlar: ["yakshanba", "dushanba", "seshanba", "chorshanba", "payshanba", "juma", "shanba"], qoldi: "qoldi",
          soni: function (n) { return n + " kishi yozildi"; }, qat: "Qatnashaman", bor: "Eslatma yoqilgan — boyo'g'li xabar beradi", chiq: "Bekor qilish",
          q1: "Hamma bir vaqtda bitta yo'ldan uchadi", q2: "Halqaning o'rtasidan o'tsangiz tezlashasiz", q3: "Har bosqichda sekinlar chiqib ketadi — finalda eng tezi yutadi",
          sov: "Sovrinlar", orin: function (n) { return n + "-o'rin"; }, finalP: function (p) { return "Finalga chiqqan qolganlarga — +" + p + " ball"; },
          otgan: function (n, k) { return "O'tgan safar g'olib: " + n + " (" + k + " kishi ichida)"; },
          mashq: "Mashq qilish", mashqS: "Poyga yo'lida sinab ko'ring — natija hisoblanmaydi", mashqN: function (v, x) { return "Mashq natijasi: " + v + (x ? " · " + x + " ta xato" : ""); },
          zal: "Start chizig'i ochiq", zalS: function (n) { return n + " uchuvchi keldi"; }, bosh: function (v) { return "Startga " + v; }, kut: "Shu sahifada qoling — poyga o'zi boshlanadi.",
          kech: "Kechikdingiz — bu safar faqat tomosha qilasiz", bosqich: function (n) { return n + "-bosqich"; }, fin: "Final", uchmoqda: "Poyga ketmoqda",
          uchdi: function (a, b) { return a + " / " + b + " uchuvchi marrada"; }, vaqt: function (s) { return "Bosqich tugashiga " + s + " s"; },
          sizV: function (v) { return "Sizning vaqtingiz: " + v; }, kuting: "Qolganlar uchib bo'lishini kuting…", qayt: "Poygaga qaytish",
          tomosha: "Siz tomoshabinsiz", chiqqan: function (n) { return "Siz " + n + "-bosqichda chiqdingiz — tomosha qilyapsiz"; },
          natija: function (n) { return n + "-bosqich natijasi"; }, otdi: "O'tdingiz!", otmadi: "Bu safar o'ta olmadingiz", keyingi: function (s, f) { return (f ? "Final " : "Keyingi bosqich ") + s + " soniyadan keyin"; },
          kelmadi: "yetib kelmadi", otadi: function (n) { return "Keyingi bosqichga eng tez " + n + " kishi o'tadi"; }, finS: "Eng tez uchgan — g'olib",
          tugadi: "Poyga tugadi", golib: "G'olib", siz: "siz", orningiz: function (n) { return "Sizning o'rningiz: " + n; },
          ball: function (n) { return "+" + n + " ball kubokka"; }, bolmadi: "Bu safar uchuvchi yetmadi — poyga o'tmadi.", ortga: "Xogvartsga qaytish",
          yoq: "Aloqa yo'q — qayta urinib ko'ring", m: " daq ", h: " soat ", kunQ: "kun", mashqK: "Mashq", yuborildi: "Natija yuborilmoqda…" },
    ru: { kick: "Турнир понедельника", ttl: "Гонка", nom: "Гонка на мётлах", kunlar: ["воскресенье", "понедельник", "вторник", "среда", "четверг", "пятница", "суббота"], qoldi: "осталось",
          soni: function (n) { return "Записалось: " + n; }, qat: "Участвую", bor: "Напоминание включено — сова сообщит", chiq: "Отменить",
          q1: "Все одновременно летят по одной трассе", q2: "Пролетел через центр кольца — ускорился", q3: "В каждом заезде медленные выбывают — в финале побеждает самый быстрый",
          sov: "Призы", orin: function (n) { return n + "-е место"; }, finalP: function (p) { return "Остальным финалистам — +" + p + " очк."; },
          otgan: function (n, k) { return "Прошлый победитель: " + n + " (из " + k + ")"; },
          mashq: "Тренировка", mashqS: "Попробуйте трассу — результат не считается", mashqN: function (v, x) { return "Результат тренировки: " + v + (x ? " · ошибок: " + x : ""); },
          zal: "Стартовая линия открыта", zalS: function (n) { return "Пришло пилотов: " + n; }, bosh: function (v) { return "До старта " + v; }, kut: "Оставайтесь на этой странице — гонка начнётся сама.",
          kech: "Вы опоздали — в этот раз только смотреть", bosqich: function (n) { return "Заезд " + n; }, fin: "Финал", uchmoqda: "Идёт гонка",
          uchdi: function (a, b) { return "На финише: " + a + " из " + b; }, vaqt: function (s) { return "До конца заезда " + s + " с"; },
          sizV: function (v) { return "Ваше время: " + v; }, kuting: "Ждём, пока долетят остальные…", qayt: "Вернуться в гонку",
          tomosha: "Вы зритель", chiqqan: function (n) { return "Вы выбыли в заезде " + n + " — смотрите дальше"; },
          natija: function (n) { return "Итоги заезда " + n; }, otdi: "Вы прошли дальше!", otmadi: "В этот раз пройти не удалось", keyingi: function (s, f) { return (f ? "Финал" : "Следующий заезд") + " через " + s + " с"; },
          kelmadi: "не долетел", otadi: function (n) { return "Дальше проходят " + n + " самых быстрых"; }, finS: "Самый быстрый — победитель",
          tugadi: "Гонка окончена", golib: "Победитель", siz: "вы", orningiz: function (n) { return "Ваше место: " + n; },
          ball: function (n) { return "+" + n + " очков в кубок"; }, bolmadi: "В этот раз пилотов не хватило — гонка не состоялась.", ortga: "Вернуться в Хогвартс",
          yoq: "Нет связи — попробуйте ещё раз", m: " мин ", h: " ч ", kunQ: "дн.", mashqK: "Тренировка", yuborildi: "Отправляем результат…" },
    en: { kick: "Monday tournament", ttl: "Race", nom: "Broom race", kunlar: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], qoldi: "left",
          soni: function (n) { return n + " signed up"; }, qat: "I'm in", bor: "Reminder on — an owl will let you know", chiq: "Cancel",
          q1: "Everyone flies the same course at the same time", q2: "Go through the centre of a hoop to speed up", q3: "The slowest drop out each heat — the fastest wins the final",
          sov: "Prizes", orin: function (n) { return ["", "1st", "2nd", "3rd"][n] + " place"; }, finalP: function (p) { return "Other finalists — +" + p + " pts"; },
          otgan: function (n, k) { return "Last winner: " + n + " (out of " + k + ")"; },
          mashq: "Practice", mashqS: "Try the race course — the result does not count", mashqN: function (v, x) { return "Practice result: " + v + (x ? " · " + x + " mistakes" : ""); },
          zal: "The start line is open", zalS: function (n) { return n + " flyers are here"; }, bosh: function (v) { return "Start in " + v; }, kut: "Stay on this page — the race will start by itself.",
          kech: "You are late — watching only this time", bosqich: function (n) { return "Heat " + n; }, fin: "Final", uchmoqda: "Race in progress",
          uchdi: function (a, b) { return a + " of " + b + " finished"; }, vaqt: function (s) { return "Heat ends in " + s + " s"; },
          sizV: function (v) { return "Your time: " + v; }, kuting: "Waiting for the others to finish…", qayt: "Back to the race",
          tomosha: "You are watching", chiqqan: function (n) { return "You went out in heat " + n + " — watching now"; },
          natija: function (n) { return "Heat " + n + " results"; }, otdi: "You are through!", otmadi: "Not this time", keyingi: function (s, f) { return (f ? "Final" : "Next heat") + " in " + s + " s"; },
          kelmadi: "did not finish", otadi: function (n) { return "The fastest " + n + " go through"; }, finS: "The fastest flyer wins",
          tugadi: "The race is over", golib: "Winner", siz: "you", orningiz: function (n) { return "Your place: " + n; },
          ball: function (n) { return "+" + n + " points for the Cup"; }, bolmadi: "Not enough flyers this time — no race.", ortga: "Back to Hogwarts",
          yoq: "No connection — please try again", m: " min ", h: " h ", kunQ: "d", mashqK: "Practice", yuborildi: "Sending the result…" }
  };
  function pgT() { return PG_T[lang] || PG_T.uz; }

  var pgData = null, pgTm = null, pgSoat = null, pgLocal = null, pgOlingan = 0;
  var pgUchgan = -1;        // shu bosqichda uchish boshlangan (qayta o'zi ochilmasin)
  var pgMashq = null;       // oxirgi mashq natijasi {ms, xato}

  function pgQol(sek) {
    var t = pgT();
    sek = Math.max(0, Math.round(sek));
    if (sek >= 86400) { return Math.floor(sek / 86400) + " " + t.kunQ + " " + Math.floor(sek % 86400 / 3600) + t.h.replace(/\s+$/, ""); }
    if (sek >= 3600) { return Math.floor(sek / 3600) + t.h + Math.floor(sek % 3600 / 60) + t.m.replace(/\s+$/, ""); }
    return Math.floor(sek / 60) + ":" + (sek % 60 < 10 ? "0" : "") + (sek % 60);
  }
  function pgSek(ms) { return ms == null ? "—" : drX().sec(ms); }

  /* Mahalliy ko'rik uchun namuna: pgLocal.rej = "kutish" | "zal" | "poyga" | "natija" | "tugadi" */
  function pgSample(body) {
    if (!pgLocal) { pgLocal = { rej: "kutish", joined: false }; }
    var L2 = pgLocal, hozir = Date.now() / 1000;
    if (body && body.join != null) { L2.joined = !!body.join; }
    var res = { ok: true, now: hozir, tour: { ts: hozir + 6 * 86400 + 5 * 3600, now: hozir, open: true, n: 11, joined: L2.joined },
      rules: { count: 6, heat: 100, show: 14, hall: 120, penalty: 3, keep: 3, final_pts: 5, points: { "1": 30, "2": 20, "3": 10 } },
      last: { uid: 5, name: "Garri", house: "gryffindor", n: 14 }, me: { "in": false, alive: false, out: null, place: null }, phase: L2.rej };
    var odam = [["Garri", "gryffindor", 23410], ["Jinni", "gryffindor", 24120], ["Draco", "slytherin", 24980], ["Sehrgar", "ravenclaw", 25630], ["Sedrik", "hufflepuff", 26240],
                ["Chjou", "ravenclaw", 27910], ["Anjelina", "gryffindor", 29350], ["Markus", "slytherin", 33870], ["Nevill", "gryffindor", null]]
      .map(function (r, i) { return { uid: 100 + i, place: i + 1, name: r[0], house: r[1], ms: r[2], me: i === 3 }; });
    if (L2.rej === "zal") { res.total = 12; res.starts_in = 74; res.me = { "in": true, alive: true }; }
    if (L2.rej === "poyga") {
      res.total = 14; res.alive = 9; res.heats = 3; res.me = { "in": true, alive: true };
      res.heat = { n: 1, seed: 4242, start_in: -40, left: 54, "final": false, done: 5, keep: 5, mine: { ms: 25630, xato: 1 } };
      res.results = odam.slice(0, 5);
    }
    if (L2.rej === "natija") {
      res.total = 14; res.alive = 5; res.heats = 3; res.me = { "in": true, alive: true };
      res.heat = { n: 1 }; res.next_in = 9; res.next_final = true;
      res.results = odam.map(function (p, i) { p.through = i < 5; return p; });
    }
    if (L2.rej === "tugadi") {
      res.total = 14; res.alive = 5; res.heats = 3; res.played = true; res.me = { "in": true, alive: true, place: 4, points: 5, ms: 25630 };
      res.top = odam.slice(0, 5);
    }
    return res;
  }

  function pgPost(body, cb) {
    body = body || {};
    body.lang = lang;
    if (!window.fetch) { return; }
    window.fetch(API_POYGA, { method: "POST", headers: { "Content-Type": "application/json", "X-Telegram-Init-Data": drInit() }, body: JSON.stringify(body) })
      .then(function (r) { return r.json(); })
      .then(function (res) { cb(res && res.tour ? res : (MS_LOCAL ? pgSample(body) : res)); })
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
      var oraliq = (ph === "zal" || ph === "poyga" || ph === "natija") ? 1500 : (ph === "kutish" && kech < 900) ? 5000 : 60000;
      if (!$("scr-poyga").classList.contains("hidden") && !MS_LOCAL) { pgTm = setTimeout(pgLoad, oraliq); }
    });
  }
  function pgApply(res) {
    pgData = res;
    pgOlingan = Date.now();
    // O'z bosqichi boshlandi - uchish o'zi ochiladi (bir bosqichga bir marta)
    var h = res.heat, men = res.me || {};
    if (res.phase === "poyga" && h && men.alive && !h.mine && pgUchgan !== h.n && h.left > 25 && !MS_LOCAL) { pgUch(); return; }
    pgRender();
  }
  function pgYozil(on) {
    pgPost({ join: on ? 1 : 0 }, function (res) { if (res && res.tour) { pgApply(res); } else { showToast(pgT().yoq, "err"); } });
  }

  /* Turnir bosqichi: yo'l urug'i serverdan, sanoq hammada bir paytda tugaydi; natija serverga yuboriladi */
  function pgUch() {
    var d = pgData, h = d.heat, t = pgT(), otdi = (Date.now() - pgOlingan) / 1000;
    pgUchgan = h.n;
    clearTimeout(pgTm);
    clearInterval(pgSoat);
    // Qiyinlik: final har doim eng qiyin yo'l (3), undan oldingilari yengilroq
    var daraja = Math.max(1, 3 - ((d.heats || 1) - 1 - h.n));
    uchPoyga({ urug: h.seed, bosqich: daraja, sarlavha: t.nom, ost: h["final"] ? t.fin : t.bosqich(h.n + 1), kut: Math.max(0, (h.start_in - otdi) * 1000),
      tugadi: function (nat) {
        showToast(t.yuborildi);
        pgPost({ heat: h.n, ms: nat.ms, xato: nat.xato }, function (res) {
          drShowGame("scr-poyga");
          if (res && res.tour) { pgData = res; pgOlingan = Date.now(); } else { showToast(t.yoq, "err"); }
          pgRender();
          pgLoad();
        });
      },
      ortga: function () { pgKorsat(); } });
  }
  /* Mashq: poyga yo'lining o'zi, tasodifiy yo'nalish; hech narsa yuborilmaydi */
  function pgMashqUch() {
    var t = pgT();
    clearTimeout(pgTm);
    clearInterval(pgSoat);
    uchPoyga({ urug: 1000 + Math.floor(Math.random() * 900000), bosqich: 2, sarlavha: t.nom, ost: t.mashqK, kut: 3000,
      tugadi: function (nat) { pgMashq = { ms: nat.ms + nat.xato * 3000, xato: nat.xato }; pgKorsat(); },
      ortga: function () { pgKorsat(); } });
  }

  function pgRender() {
    var d = pgData, ph = d ? d.phase : "kutish", oyin = ph === "poyga" || ph === "natija";
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
    chap.appendChild(drEl("small", "", t.nom));
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
      mm.appendChild(drEl("small", "", pgMashq ? t.mashqN(pgSek(pgMashq.ms), pgMashq.xato) : t.mashqS));
      mq.appendChild(mm);
      mq.appendChild(drEl("i", "", "›"));
      mq.addEventListener("click", pgMashqUch);
      q.appendChild(mq);
    }
    [t.q1, t.q2, t.q3].forEach(function (m, i) {
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
    sv.appendChild(drEl("p", "", t.finalP(r.final_pts || 5)));
    q.appendChild(sv);
    if (d.last) { q.appendChild(drEl("p", "vk-otgan", t.otgan(d.last.name, d.last.n))); }
  }

  function pgJadval(rows, otishBor) {
    var t = pgT(), list = drEl("div", "bl-list pg-list");
    (rows || []).forEach(function (p) {
      var row = drEl("div", "bl-row" + (p.me ? " me" : "") + (otishBor && !p.through ? " pg-chiq" : ""));
      row.appendChild(drEl("i", p.place <= 3 && !otishBor ? "o" + p.place : "", String(p.place)));
      var c2 = drEl("span", "bl-cr"), im = cupCrestImg(p.house, 18);
      if (im) { c2.appendChild(im); }
      row.appendChild(c2);
      row.appendChild(drEl("b", "", p.name + (p.me ? " (" + t.siz + ")" : "")));
      row.appendChild(drEl("em", "", p.ms == null ? t.kelmadi : pgSek(p.ms)));
      if (otishBor && p.through) { row.appendChild(drEl("u", "pg-ok", "✓")); }
      list.appendChild(odamLink(row, p));
    });
    return list;
  }

  /* Poyga oqshomi (sahifada turganlar uchun): bosqich ketmoqda yoki bosqich natijasi */
  function pgOyin() {
    var d = pgData, t = pgT(), box = $("pg-oyin"), h = d.heat || {}, men = d.me || {}, natija = d.phase === "natija", olingan = pgOlingan;
    box.innerHTML = "";
    var tep = drEl("div", "vk-g-top");
    tep.appendChild(drEl("b", "", natija ? t.natija(h.n + 1) : (h["final"] ? t.fin : t.bosqich(h.n + 1))));
    var son = drEl("span", "", "");
    tep.appendChild(son);
    box.appendChild(tep);
    var holat = drEl("div", "pg-holat");
    box.appendChild(holat);
    var ost = drEl("p", "pg-ost", "");
    if (natija) {
      var meni = (d.results || []).filter(function (p) { return p.me; })[0];
      son.textContent = t.uchdi((d.results || []).filter(function (p) { return p.ms != null; }).length, (d.results || []).length);
      if (meni) {
        holat.classList.add(meni.through ? "yaxshi" : "yomon");
        holat.appendChild(drEl("b", "", meni.through ? t.otdi : t.otmadi));
        holat.appendChild(drEl("small", "", meni.ms == null ? t.kelmadi : t.sizV(pgSek(meni.ms))));
      } else {
        holat.appendChild(drEl("b", "", men["in"] ? t.chiqqan((men.out || 0) + 1) : t.tomosha));
      }
      box.appendChild(pgJadval(d.results, true));
    } else {
      son.textContent = t.uchdi(h.done || 0, d.alive || 0);
      if (h.mine) {
        holat.classList.add("yaxshi");
        holat.appendChild(drEl("b", "", t.sizV(pgSek(h.mine.ms))));
        holat.appendChild(drEl("small", "", t.kuting));
      } else if (men.alive) {                      // uchishdan chiqib ketgan - qaytsa bo'ladi (vaqt to'xtamaydi)
        holat.appendChild(drEl("b", "", t.uchmoqda));
        var qb = drEl("button", "dr-btn", t.qayt);
        qb.type = "button";
        qb.addEventListener("click", function () { if (pgData && pgData.heat) { pgUch(); } });
        holat.appendChild(qb);
      } else {
        holat.appendChild(drEl("b", "", men["in"] ? t.chiqqan((men.out || 0) + 1) : t.kech));
        holat.appendChild(drEl("small", "", t.uchmoqda));
      }
      box.appendChild(drEl("p", "pg-ost", h["final"] ? t.finS : (h.keep ? t.otadi(h.keep) : "")));
      if (d.results && d.results.length) { box.appendChild(pgJadval(d.results, false)); }
    }
    box.appendChild(ost);
    var yur = function () {
      var o = (Date.now() - olingan) / 1000;
      ost.textContent = natija ? t.keyingi(Math.max(0, Math.ceil((d.next_in || 0) - o)), d.next_final) : t.vaqt(Math.max(0, Math.ceil((h.left || 0) - o)));
    };
    yur();
    pgSoat = setInterval(yur, 250);
  }

  /* Yakun: g'olib, o'z o'rni va bali, finalchilar */
  function pgYakun() {
    var d = pgData, t = pgT(), box = $("pg-end"), men = d.me || {};
    box.innerHTML = "";
    if (!d.played) {
      box.appendChild(drEl("p", "rk-bosh", t.bolmadi));
    } else {
      box.appendChild(drEl("small", "af-baho-k", t.tugadi));
      var g = (d.top || [])[0];
      if (g) {
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
        var qism = [];
        if (men.ms != null) { qism.push(pgSek(men.ms)); }
        if (men.points) { qism.push(t.ball(men.points)); }
        mk.appendChild(drEl("small", "", qism.join(" · ")));
        box.appendChild(mk);
      }
      box.appendChild(pgJadval(d.top, false));
    }
    var b = drEl("button", "dr-btn", t.ortga);
    b.type = "button";
    b.addEventListener("click", pgYop);
    box.appendChild(b);
  }

  function pgInfo() {
    var eski = $("du-info"), t = pgT(), r = (pgData && pgData.rules) || {}, pt = r.points || {};
    if (eski) { eski.parentNode.removeChild(eski); }
    var v = { hall: Math.round((r.hall || 120) / 60), pen: r.penalty || 3, keep: r.keep || 3, heat: r.heat || 100, fp: r.final_pts || 5, p1: pt["1"] || 30, p2: pt["2"] || 20, p3: pt["3"] || 10 };
    var bandlar = lang === "ru" ? [
      ["Когда", "Раз в неделю — в понедельник в 21:00 (время Ташкента). Длится около 5–7 минут."],
      ["Кто участвует", "Каждый распределённый ученик, кто был на этой странице к старту. Записываться заранее не обязательно: кнопка «Участвую» нужна, чтобы сова напомнила. Стартовая линия открывается за " + v.hall + " мин до начала."],
      ["Как это проходит", "После отсчёта все одновременно летят по одной и той же трассе. Мётлой управляете пальцем — влево и вправо."],
      ["Как лететь быстрее", "Чем ближе к центру кольца вы пролетаете, тем сильнее ускорение. Пропущенное кольцо или удар бладжера сбивают скорость и добавляют " + v.pen + " с штрафа. Пойманный снитч даёт большое ускорение."],
      ["Заезды", "Если пилотов много, гонка идёт в 2–3 заезда: дальше проходит быстрейшая половина (не меньше " + v.keep + "). Финал — самая трудная трасса."],
      ["Кто побеждает", "Тот, кто быстрее всех пролетит финал. Кто не долетел за " + v.heat + " с — выбывает."],
      ["Опоздавшие", "Кто пришёл после старта — зритель: видит результаты, но не летит."],
      ["Очки", "В кубок факультета: 1-е место +" + v.p1 + ", 2-е +" + v.p2 + ", 3-е +" + v.p3 + ". Остальным финалистам — +" + v.fp + "."],
      ["Тренировка", "Кнопка «Тренировка» открывает такую же трассу в любое время. Результат никуда не идёт."]]
      : lang === "en" ? [
      ["When", "Once a week — on Monday at 21:00 (Tashkent time). It takes about 5–7 minutes."],
      ["Who flies", "Every sorted student who is on this page at the start. You do not have to sign up: “I'm in” just makes an owl remind you. The start line opens " + v.hall + " minutes before the start."],
      ["How it works", "After the countdown everyone flies the same course at the same time. Steer the broom with your finger — left and right."],
      ["How to fly faster", "The closer to the centre of a hoop you pass, the bigger the boost. A missed hoop or a Bludger hit slows you down and adds a " + v.pen + " s penalty. Catching the Snitch gives a big boost."],
      ["Heats", "With many flyers the race has 2–3 heats: the faster half (at least " + v.keep + ") goes through. The final is the hardest course."],
      ["Who wins", "Whoever flies the final fastest. Anyone who does not finish within " + v.heat + " s is out."],
      ["Latecomers", "Anyone who arrives after the start is a spectator: they see the results but do not fly."],
      ["Points", "For the House Cup: 1st place +" + v.p1 + ", 2nd +" + v.p2 + ", 3rd +" + v.p3 + ". Other finalists get +" + v.fp + "."],
      ["Practice", "The “Practice” button opens the same kind of course at any time. The result goes nowhere."]]
      : [
      ["Qachon", "Haftada bir marta — dushanba kuni soat 21:00 da (Toshkent vaqti). Taxminan 5–7 daqiqa davom etadi."],
      ["Kim qatnashadi", "Start paytida shu sahifada bo'lgan har bir saralangan o'quvchi. Oldindan yozilish shart emas: «Qatnashaman» tugmasi boyo'g'li eslatishi uchun kerak. Start chizig'i boshlanishidan " + v.hall + " daqiqa oldin ochiladi."],
      ["Qanday o'tadi", "Sanoqdan keyin hamma bir vaqtda bir xil yo'ldan uchadi. Supurgini barmoq bilan o'ngga-chapga boshqarasiz."],
      ["Qanday tezroq uchiladi", "Halqaning o'rtasiga qancha yaqin o'tsangiz, shuncha ko'p tezlashasiz. O'tkazib yuborilgan halqa yoki bladjer zarbasi tezlikni tushiradi va " + v.pen + " soniya jarima qo'shadi. Snitchni tutsangiz — katta tezlik."],
      ["Bosqichlar", "Uchuvchi ko'p bo'lsa poyga 2–3 bosqichda o'tadi: keyingisiga tezroq uchgan yarmi (kamida " + v.keep + " kishi) o'tadi. Final — eng qiyin yo'l."],
      ["Kim yutadi", "Finalda eng tez uchgan. " + v.heat + " soniyada marraga yetmagan chiqib ketadi."],
      ["Kechikkanlar", "Startdan keyin kelgan — tomoshabin: natijalarni ko'radi, lekin uchmaydi."],
      ["Ballar", "Fakultet kubogiga: 1-o'rin +" + v.p1 + ", 2-o'rin +" + v.p2 + ", 3-o'rin +" + v.p3 + ". Finalga chiqqan qolganlarga +" + v.fp + "."],
      ["Mashq", "«Mashq qilish» tugmasi istalgan payt xuddi shunday yo'lni ochadi. Natija hech qayerga yozilmaydi."]];
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
