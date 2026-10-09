/* Duel (egasi, 2026-10-09). 1-bosqich: kompyuter raqiblar bilan duel va haftalik saralash jadvali
   Ilova kodi bir necha faylga bo'lingan; hammasi BIR umumiy maydonda ishlaydi
   va index.html dagi TARTIBDA yuklanadi. Yuklanish paytida keyingi fayldagi
   narsani chaqirmang - tekshiruv: tools/tartib.js */
"use strict";
  /* QOIDA: har duelchida 5 jon. Har raundda TUR tanlanadi (hujum / himoya / hiyla), keyin shu turdagi afsun barmoq bilan
     chiziladi - aniqlik 0..100 (duAcc). Hujum hiylani, hiyla himoyani, himoya hujumni yengadi; bir xil turda aniqrog'i
     yutadi; aniqlik 35 dan past - afsun chiqmadi. Raundni SERVER hal qiladi (hpduel.py, POST /api/duel) - raqib yurishi
     ham serverda. REJA: duel haftalik TURNIR bo'ladi (saralash du-ch, pley-off pa-ya, JONLI, belgilangan vaqtda) -
     pley-off hali qurilmagan; bu yerda saralash bosqichi. Afsun shakllari Afsunlar darsidan (AF). */
  var API_DUEL = "https://bot.tizimshunos.uz/api/duel";
  var DU_TUR = ["hujum", "himoya", "hiyla"];
  var DU_AF = { hujum: ["stupefy", "expelliarmus", "incendio", "reducto"], himoya: ["protego", "finite", "episkey"], hiyla: ["impedimenta", "petrificus", "riddikulus", "silencio"] };
  var DU_YENG = { hujum: "hiyla", hiyla: "himoya", himoya: "hujum" };
  var DU_RGB = { hujum: "214,84,72", himoya: "92,140,226", hiyla: "150,196,96" };
  var DU_IC = {
    hujum: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M13.500 2 5 13.200h5.200L9 22l9-11.600h-5.400z"/></svg>',
    himoya: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2.500 4.500 5.200v6.100c0 4.700 3.100 8.300 7.500 10.200 4.400-1.900 7.500-5.500 7.500-10.200V5.200z"/></svg>',
    hiyla: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M4 8c3-4 6-4 8 0s5 4 8 0M4 16c3-4 6-4 8 0s5 4 8 0"/></svg>'
  };
  var DU_X = {
    uz: { ttl: "Duel", kick: "Duel klubi", note: "Raqibni tanlang. Har ikkingizda 5 tadan jon bor: kim birinchi tugatsa — yutqazadi.",
          tur: { hujum: "Hujum", himoya: "Himoya", hiyla: "Hiyla" }, raq: ["Birinchi kurs o'quvchisi", "Yuqori kurs o'quvchisi", "Duel ustozi"], lvl: ["Oson", "O'rta", "Qiyin"],
          best: function (n) { return n ? "Eng yaxshi natija: " + n : "Hali yengilmagan"; }, rule: "Hujum hiylani yengadi · hiyla himoyani · himoya hujumni",
          planT: "Duel turniri", plan: "Dushanba–chorshanba: saralash — shu yerda ball to'plang. Eng yaxshi 16 duelchi pley-offga chiqadi: payshanba 1/8 final, juma chorak final, shanba yarim final, yakshanba final. Pley-off jonli o'tadi: duellar soat 21:00 da boshlanadi, 5 daqiqa ichida kelmagan duelchi yutqazadi. Kubok ballari: pley-offga chiqqanga +5, har g'alaba uchun +10, +15, +20, chempionga +30.",
          topT: "Saralash jadvali · shu hafta", empty: "Bu hafta hali hech kim duel qilmadi. Birinchi bo'ling!", mine: function (b, p, n) { return "Sizning balingiz: " + b + (p ? " · " + p + "-o'rin (" + n + " kishi)" : ""); },
          pick: function (r) { return r + "-raund. Nima qilasiz?"; }, draw: function (nom) { return nom + " — afsunni chizing!"; }, wait: "Afsunlar to'qnashmoqda…",
          you: "Siz", w1: "Zarbangiz yetdi!", w0: "Durang — afsunlar bir-birini so'ndirdi.", wm: "Raqib ustun keldi.", fail: "afsun chiqmadi", next: "Keyingi raund",
          won: "G'alaba!", lost: "Mag'lubiyat", score: function (n) { return "Saralash bali: " + n; }, again: "Yana duel", back: "Raqiblar", acc: "aniqlik" },
    ru: { ttl: "Дуэль", kick: "Дуэльный клуб", note: "Выберите соперника. У каждого по 5 жизней: у кого закончатся первыми — тот проиграл.",
          tur: { hujum: "Атака", himoya: "Защита", hiyla: "Уловка" }, raq: ["Первокурсник", "Старшекурсник", "Мастер дуэлей"], lvl: ["Легко", "Средне", "Сложно"],
          best: function (n) { return n ? "Лучший результат: " + n : "Ещё не побеждён"; }, rule: "Атака бьёт уловку · уловка — защиту · защита — атаку",
          planT: "Дуэльный турнир", plan: "Понедельник–среда: отбор — набирайте очки здесь. 16 лучших дуэлянтов выходят в плей-офф: четверг — 1/8 финала, пятница — четвертьфинал, суббота — полуфинал, воскресенье — финал. Плей-офф проходит вживую: дуэли начинаются в 21:00, кто не придёт в течение 5 минут — проигрывает. Очки кубка: за выход в плей-офф +5, за победы +10, +15, +20, чемпиону +30.",
          topT: "Таблица отбора · эта неделя", empty: "На этой неделе ещё никто не дрался. Будьте первым!", mine: function (b, p, n) { return "Ваши очки: " + b + (p ? " · место " + p + " (из " + n + ")" : ""); },
          pick: function (r) { return "Раунд " + r + ". Что будете делать?"; }, draw: function (nom) { return nom + " — начертите заклинание!"; }, wait: "Заклинания сталкиваются…",
          you: "Вы", w1: "Ваш удар достиг цели!", w0: "Ничья — заклинания погасили друг друга.", wm: "Соперник оказался сильнее.", fail: "заклинание не вышло", next: "Следующий раунд",
          won: "Победа!", lost: "Поражение", score: function (n) { return "Очки отбора: " + n; }, again: "Ещё дуэль", back: "Соперники", acc: "точность" },
    en: { ttl: "Duel", kick: "Duelling Club", note: "Choose your opponent. You each have 5 lives: whoever runs out first loses.",
          tur: { hujum: "Attack", himoya: "Defence", hiyla: "Trick" }, raq: ["First-year student", "Senior student", "Duelling master"], lvl: ["Easy", "Medium", "Hard"],
          best: function (n) { return n ? "Best result: " + n : "Not beaten yet"; }, rule: "Attack beats trick · trick beats defence · defence beats attack",
          planT: "Duelling tournament", plan: "Monday–Wednesday: qualifying — earn points here. The top 16 duellists reach the play-offs: Thursday round of 16, Friday quarter-finals, Saturday semi-finals, Sunday final. Play-offs are live: duels start at 21:00, and anyone who fails to turn up within 5 minutes loses. Cup points: +5 for reaching the play-offs, +10, +15, +20 for each win, +30 for the champion.",
          topT: "Qualifying table · this week", empty: "Nobody has duelled this week yet. Be the first!", mine: function (b, p, n) { return "Your points: " + b + (p ? " · place " + p + " of " + n : ""); },
          pick: function (r) { return "Round " + r + ". What will you do?"; }, draw: function (nom) { return nom + " — draw the spell!"; }, wait: "The spells collide…",
          you: "You", w1: "Your spell hit!", w0: "A draw — the spells cancelled out.", wm: "Your opponent got the better of you.", fail: "the spell failed", next: "Next round",
          won: "Victory!", lost: "Defeat", score: function (n) { return "Qualifying points: " + n; }, again: "Duel again", back: "Opponents", acc: "accuracy" }
  };
  /* PLEY-OFF (jonli, 21:00): to'r serverdan (holatdagi `cup`), duel «arena»da - {arena: id} har 1,5 soniyada so'raladi,
     bosqichni server aytadi: early / wait / pick / reveal / over (hpduel._arena). Mahalliy ko'rikda soxta arena (duArSample). */
  var DU_T = {
    uz: { st: { 16: "1/8 final", 8: "Chorak final", 4: "Yarim final", 2: "Final" }, kun: { 16: "payshanba", 8: "juma", 4: "shanba", 2: "yakshanba" },
          from: "Birinchi turnir 12-oktabr haftasida. Hozircha mashq qiling — saralash dushanbadan boshlanadi.",
          kam: "Bu hafta pley-off uchun duelchi yetmadi (kamida 2 kishi kerak).", at: function (k) { return k + ", 21:00"; }, tbd: "aniqlanmoqda",
          my: function (st, k) { return "Sizning duelingiz: " + st + " — " + k + ", 21:00"; }, in_: function (t) { return "Boshlanishiga " + t + " qoldi"; }, now: "Duel boshlandi — kiring!",
          go: "Arenaga kirish", wopp: "Raqibingiz hali aniqlanmagan", test: "Sinov dueli (faqat admin)", h: " soat ", m: " daqiqa",
          early: function (t) { return "Duel " + t + " dan keyin boshlanadi"; }, wait: function (t) { return "Raqib kutilmoqda… " + t; }, here: "Raqibingiz arenada.", nothere: "Raqibingiz hali kelmadi.",
          sent: "Afsun otildi! Raqibni kutamiz…", left: function (s) { return " · " + s + " s"; }, nxt: function (s) { return "Keyingi raund " + s + " soniyadan keyin"; },
          kelmadi: "Raqibingiz kelmadi — g'alaba sizniki.", kelmadim: "Siz vaqtida kelmadingiz.", ikkalasi: "Ikkalangiz ham kelmadingiz — saralashda yuqori turgan duelchi o'tdi.",
          pts: function (n) { return "+" + n + " ball kubokka"; }, champ: "Siz duel chempionisiz!", out: "Turnir siz uchun tugadi. Keyingi hafta yana urinib ko'ring!", tbl: "Turnir jadvali", bot: "Sinov raqibi" },
    ru: { st: { 16: "1/8 финала", 8: "Четвертьфинал", 4: "Полуфинал", 2: "Финал" }, kun: { 16: "четверг", 8: "пятница", 4: "суббота", 2: "воскресенье" },
          from: "Первый турнир — на неделе с 12 октября. Пока тренируйтесь — отбор начнётся в понедельник.",
          kam: "На этой неделе не хватило дуэлянтов для плей-офф (нужно минимум 2).", at: function (k) { return k + ", 21:00"; }, tbd: "определяется",
          my: function (st, k) { return "Ваша дуэль: " + st + " — " + k + ", 21:00"; }, in_: function (t) { return "До начала " + t; }, now: "Дуэль началась — заходите!",
          go: "Войти на арену", wopp: "Ваш соперник ещё не определён", test: "Тестовая дуэль (только админ)", h: " ч ", m: " мин",
          early: function (t) { return "Дуэль начнётся через " + t; }, wait: function (t) { return "Ждём соперника… " + t; }, here: "Соперник на арене.", nothere: "Соперник ещё не пришёл.",
          sent: "Заклинание выпущено! Ждём соперника…", left: function (s) { return " · " + s + " с"; }, nxt: function (s) { return "Следующий раунд через " + s + " с"; },
          kelmadi: "Соперник не пришёл — победа ваша.", kelmadim: "Вы не пришли вовремя.", ikkalasi: "Никто не пришёл — дальше прошёл дуэлянт, стоявший выше в отборе.",
          pts: function (n) { return "+" + n + " очков в кубок"; }, champ: "Вы чемпион дуэлей!", out: "Турнир для вас окончен. Попробуйте на следующей неделе!", tbl: "Таблица турнира", bot: "Тестовый соперник" },
    en: { st: { 16: "Round of 16", 8: "Quarter-final", 4: "Semi-final", 2: "Final" }, kun: { 16: "Thursday", 8: "Friday", 4: "Saturday", 2: "Sunday" },
          from: "The first tournament is in the week of 12 October. Practise for now — qualifying starts on Monday.",
          kam: "Not enough duellists for the play-offs this week (at least 2 needed).", at: function (k) { return k + ", 21:00"; }, tbd: "to be decided",
          my: function (st, k) { return "Your duel: " + st + " — " + k + ", 21:00"; }, in_: function (t) { return "Starts in " + t; }, now: "The duel has started — come in!",
          go: "Enter the arena", wopp: "Your opponent is not known yet", test: "Test duel (admin only)", h: " h ", m: " min",
          early: function (t) { return "The duel starts in " + t; }, wait: function (t) { return "Waiting for your opponent… " + t; }, here: "Your opponent is in the arena.", nothere: "Your opponent has not arrived yet.",
          sent: "Spell cast! Waiting for your opponent…", left: function (s) { return " · " + s + " s"; }, nxt: function (s) { return "Next round in " + s + " s"; },
          kelmadi: "Your opponent did not turn up — the win is yours.", kelmadim: "You did not turn up in time.", ikkalasi: "Neither of you turned up — the higher-ranked duellist went through.",
          pts: function (n) { return "+" + n + " points for the Cup"; }, champ: "You are the duelling champion!", out: "The tournament is over for you. Try again next week!", tbl: "Tournament table", bot: "Test opponent" }
  };
  var DU_BALL = { 16: 10, 8: 15, 4: 20, 2: 30 };
  function duT() { return DU_T[lang] || DU_T.uz; }
  function duMS(s) { s = Math.max(0, Math.round(s)); return Math.floor(s / 60) + ":" + (s % 60 < 10 ? "0" : "") + (s % 60); }

  var DU_VAQT = 8000;        // afsunni chizishga vaqt (ms)
  var duData = null, du = null, duLocal = null;     // du: {game, tur, af, pts, user, drawing, t0, tm, busy}

  function duX() { return DU_X[lang] || DU_X.uz; }
  function duRaqImg(l) { return l === 3 ? IMG_DIR + "duel/r3.webp" : IMG_DIR + "duel/r" + l + ".webp"; }

  // Mahalliy ko'rik uchun namuna (server yo'q)
  function duSample(body) {
    if (!duLocal) { duLocal = { best: { 1: 190, 2: 0, 3: 0 }, g: null }; }
    var L = duLocal, res = { ok: true };
    if (body && body.start) { L.g = { id: 1, level: body.start, lives: 5, rlives: 5, round: 0, over: false, sum: 0 }; res.game = L.g; }
    if (body && body.move && L.g) {
      var g = L.g, his = DU_TUR[Math.floor(Math.random() * 3)], racc = Math.round([50, 68, 84][g.level - 1] + (Math.random() - 0.5) * 30), a = body.acc, w;
      if (a < 35 && racc < 35) { w = 0; } else if (a < 35) { w = -1; } else if (racc < 35) { w = 1; }
      else if (his === body.move) { w = Math.abs(a - racc) < 5 ? 0 : a > racc ? 1 : -1; } else { w = DU_YENG[body.move] === his ? 1 : -1; }
      g.round++; g.sum += a; if (w > 0) { g.rlives--; } if (w < 0) { g.lives--; }
      g.over = g.lives <= 0 || g.rlives <= 0 || g.round >= 20; g.won = g.over && g.lives > g.rlives;
      g.score = g.won ? g.level * 100 + g.lives * 20 + Math.floor(g.sum / g.round * 0.5) : 0;
      if (g.won) { L.best[g.level] = Math.max(L.best[g.level], g.score); }
      res.round = { mine: body.move, his: his, acc: a, racc: racc, win: w }; res.game = g;
    }
    var tot = L.best[1] + L.best[2] + L.best[3];
    res.mine = { "1": L.best[1], "2": L.best[2], "3": L.best[3], total: tot };
    res.top = [{ uid: 5, name: "Germiona", house: "gryffindor", score: 880 }, { uid: 6, name: "Draco", house: "slytherin", score: 610 }, { uid: 1, name: "Sehrgar", house: "gryffindor", score: tot, me: true }, { uid: 7, name: "Luna", house: "ravenclaw", score: 150 }]
      .sort(function (p, q) { return q.score - p.score; });
    res.n = res.top.length; res.place = res.top.findIndex(function (p) { return p.me; }) + 1;
    var P = function (u, n, h, sd) { return { uid: u, name: n, house: h, seed: sd }; }, hozir = Date.now() / 1000, meId = (tgUser() || {}).id || 1;
    res.admin = true;
    res.cup = { size: 4, hour: 21, wait: 300, now: hozir, my: { id: 1, stage: 2, ts: hozir + 5400, ready: true }, stages: [
      { stage: 4, ts: hozir - 80000, matches: [
        { id: 3, a: P(meId, "Sehrgar", "gryffindor", 1), b: P(7, "Luna", "ravenclaw", 4), winner: meId, state: "tugadi", lives: [2, 0], why: "duel" },
        { id: 4, a: P(5, "Germiona", "gryffindor", 2), b: P(6, "Draco", "slytherin", 3), winner: 6, state: "tugadi", lives: [3, 3], why: "kelmadi" }] },
      { stage: 2, ts: hozir + 5400, matches: [{ id: 1, a: P(meId, "Sehrgar", "gryffindor", 1), b: P(6, "Draco", "slytherin", 3), winner: null, state: "kutmoqda", lives: [3, 3], why: null }] }] };
    return res;
  }
  // Mahalliy soxta arena: 6 s kutish -> raundlar (raqib 2 s da yuradi) -> natija
  var duArL = null;
  function duArSample(body) {
    var n = Date.now(), A = duArL;
    if (!A || body.sinov) { A = duArL = { bosh: n + 6000, r: 0, rb: 0, l: 5, rl: 5, mv: null, last: null, over: false }; if (body.sinov) { return { ok: true, test_id: 1, mine: duSample({}).mine, top: [], cup: null }; } }
    if (!A.over && n >= A.bosh && A.r === 0) { A.r = 1; A.rb = n; }
    if (!A.over && A.r && n >= A.rb) {
      if (body.move && !A.mv) { A.mv = [body.move, body.acc]; A.mt = n; }
      if ((A.mv && n >= A.mt + 1500) || n >= A.rb + 30000) {
        var his = DU_TUR[Math.floor(Math.random() * 3)], racc = 55 + Math.round(Math.random() * 35), m = A.mv || ["hujum", 0], w;
        if (m[1] < 35) { w = -1; } else if (his === m[0]) { w = Math.abs(m[1] - racc) < 5 ? 0 : m[1] > racc ? 1 : -1; } else { w = DU_YENG[m[0]] === his ? 1 : -1; }
        if (w > 0) { A.rl--; } if (w < 0) { A.l--; }
        A.last = { r: A.r, mine: m[0], acc: m[1], his: his, racc: racc, win: w }; A.mv = null; A.rb = n + 6000;
        if (A.l <= 0 || A.rl <= 0) { A.over = true; } else { A.r++; }
      }
    }
    var ph = A.over ? (n < A.rb ? "reveal" : "over") : A.r === 0 ? "early" : n < A.rb ? "reveal" : "pick";
    return { ok: true, arena: { id: 1, stage: 2, test: true, phase: ph, starts_in: Math.max(0, Math.round((A.bosh - n) / 1000)), wait_left: 300, round: A.r,
      deadline_in: ph === "pick" ? Math.max(0, Math.round((A.rb + 30000 - n) / 1000)) : 0, next_in: ph === "reveal" ? Math.max(0, Math.round((A.rb - n) / 1000)) : 0,
      lives: A.l, rlives: A.rl, moved: !!A.mv, opp: { uid: 0, name: "Sinov raqibi", house: null, seed: 0, here: true }, last: A.last, over: A.over, won: A.over && A.l > A.rl, why: "duel" } };
  }
  function duPost(body, cb) {
    if (!window.fetch) { return; }
    if (MS_LOCAL && body && (body.arena != null || body.sinov)) { setTimeout(function () { cb(duArSample(body)); }, 60); return; }
    window.fetch(API_DUEL, { method: "POST", headers: { "Content-Type": "application/json", "X-Telegram-Init-Data": drInit() }, body: JSON.stringify(body || {}) })
      .then(function (r) { return r.json(); })
      .then(function (res) { cb(res && (res.mine || res.arena) ? res : (MS_LOCAL ? duSample(body) : res)); })
      ["catch"](function () { cb(MS_LOCAL ? duSample(body) : null); });
  }

  function duOpen() {
    drShowGame("scr-duel");
    duStop();
    duHome();
    duPost({}, function (res) { if (res && res.mine) { duData = res; if (!du) { duHome(); } } else if (!duData) { showToast(drX().fail, "err"); } });
  }
  function duStop() { if (du) { clearTimeout(du.tm); clearTimeout(du.poll); cancelAnimationFrame(du.raf || 0); } du = null; }

  function duJonlar() { return (duData && duData.rules && duData.rules.lives) || 5; }     // har duelchida 5 jon (egasi, 2026-10-09)
  function duJon(el, n) {
    el.innerHTML = "";
    for (var i = 0; i < duJonlar(); i++) { el.appendChild(drEl("i", i < n ? "on" : "")); }
  }

  /* ---------- bosh ko'rinish: raqiblar, turnir rejasi, saralash jadvali ---------- */
  function duHome() {
    var x = duX(), d = duData;
    $("du-kick").textContent = x.kick;
    $("du-ttl").textContent = x.ttl;
    $("du-home").classList.remove("hidden");
    $("du-game").classList.add("hidden");
    $("du-note").textContent = x.note;
    $("du-rule").textContent = x.rule;
    var box = $("du-raq");
    box.innerHTML = "";
    [1, 2, 3].forEach(function (l) {
      var c = drEl("button", "du-rq"), im = document.createElement("img");
      c.type = "button";
      im.alt = ""; im.src = duRaqImg(l);
      c.appendChild(im);
      var tx = drEl("span", "du-rq-tx");
      tx.appendChild(drEl("small", "du-lv l" + l, x.lvl[l - 1]));
      tx.appendChild(drEl("b", "", x.raq[l - 1]));
      tx.appendChild(drEl("span", "", x.best(d ? d.mine[String(l)] : 0)));
      c.appendChild(tx);
      c.addEventListener("click", function () { duStart(l); });
      box.appendChild(c);
    });
    $("du-plan-t").textContent = x.planT;
    $("du-plan").textContent = x.plan;
    duCup();
    $("du-top-t").textContent = x.topT;
    $("du-mine").textContent = d && d.mine.total ? x.mine(d.mine.total, d.place, d.n) : "";
    var tb = $("du-top");
    tb.innerHTML = "";
    if (!d || !d.top.length) { tb.appendChild(drEl("p", "rk-bosh", x.empty)); return; }
    d.top.forEach(function (p, i) {
      var row = drEl("div", "bl-row" + (p.me ? " me" : ""));
      row.appendChild(drEl("i", "o" + (i + 1), String(i + 1)));
      var cr = drEl("span", "bl-cr"), im = cupCrestImg(p.house, 18);
      if (im) { cr.appendChild(im); }
      row.appendChild(cr);
      row.appendChild(drEl("b", "", p.name + (p.me ? " (" + drX().you + ")" : "")));
      row.appendChild(drEl("em", "", String(p.score)));
      tb.appendChild(odamLink(row, p));
    });
  }

  /* ---------- turnir kartasi: o'z dueli, to'r ---------- */
  function duCup() {
    var x = duX(), t = duT(), box = $("du-cup"), c = duData && duData.cup;
    box.innerHTML = "";
    if (duData && duData.admin) {
      var tb = drEl("button", "qr-b", t.test);
      tb.type = "button";
      tb.addEventListener("click", function () { duPost({ sinov: 1 }, function (res) { if (res && res.test_id) { duArena(res.test_id); } else { showToast(drX().fail, "err"); } }); });
      box.appendChild(tb);
    }
    if (!c) { return; }
    if (c.from) { box.appendChild(drEl("p", "du-cup-n", t.from)); return; }
    if (c.size == null) { return; }
    if (!c.size) { box.appendChild(drEl("p", "du-cup-n", t.kam)); return; }
    if (c.my) {
      var k = drEl("div", "du-my"), qol = c.my.ts - c.now;
      k.appendChild(drEl("b", "", t.my(t.st[c.my.stage], t.kun[c.my.stage])));
      k.appendChild(drEl("small", "", !c.my.ready ? t.wopp : qol > 0 ? t.in_(qol >= 3600 ? Math.floor(qol / 3600) + t.h + Math.floor(qol % 3600 / 60) + t.m : duMS(qol)) : t.now));
      if (c.my.ready) {
        var gb = drEl("button", "dr-btn", t.go);
        gb.type = "button";
        gb.addEventListener("click", function () { duArena(c.my.id); });
        k.appendChild(gb);
      }
      box.appendChild(k);
    }
    c.stages.forEach(function (s) {
      box.appendChild(drEl("span", "du-st-t", t.st[s.stage] + " · " + t.at(t.kun[s.stage])));
      s.matches.forEach(function (m) {
        var row = drEl("div", "du-mt"), yon = function (p, jon) {
          var e = drEl("span", "du-mt-p" + (p && m.winner === p.uid ? " g" : "") + (p && m.winner && m.winner !== p.uid ? " y" : "") + (p && p.uid === (tgUser() || {}).id ? " men" : ""));
          if (p) {
            var cr = cupCrestImg(p.house, 16);
            if (cr) { e.appendChild(cr); }
            e.appendChild(drEl("b", "", p.name));
            if (m.state !== "kutmoqda" && m.why !== "kelmadi" && m.why !== "ikkalasi") { e.appendChild(drEl("em", "", String(jon))); }
          } else { e.appendChild(drEl("b", "tbd", t.tbd)); }
          return e;
        };
        row.appendChild(yon(m.a, m.lives[0]));
        row.appendChild(drEl("i", "", "–"));
        row.appendChild(yon(m.b, m.lives[1]));
        box.appendChild(row);
      });
    });
  }

  /* ---------- arena: jonli duel (pley-off) ---------- */
  function duArena(id) {
    var x = duX();
    duStop();
    du = { mode: "ar", arena: id, game: { lives: duJonlar(), rlives: duJonlar(), round: 0 }, rnd: 0, shown: 0, step: "" };
    $("du-home").classList.add("hidden");
    $("du-game").classList.remove("hidden");
    $("du-res").classList.add("hidden");
    $("du-turs").classList.add("hidden");
    $("du-draw").classList.add("hidden");
    $("du-rev").classList.add("hidden");
    $("du-msg").textContent = "…";
    $("du-m-nom").textContent = x.you;
    var av = $("du-m-im"), me = cupMe(), ci = cupCrestImg(me.house || house, 54);
    av.innerHTML = "";
    if (ci) { av.appendChild(ci); }
    duHearts();
    try { window.scrollTo(0, 0); } catch (e) {}
    duArTick();
  }
  function duArTick(body) {
    if (!du || du.mode !== "ar") { return; }
    var id = du.arena, so = body || { arena: id };
    clearTimeout(du.poll);
    duPost(so, function (res) {
      if (!du || du.mode !== "ar" || du.arena !== id) { return; }
      if (res && res.arena) { duArApply(res.arena); }
      if (du && du.mode === "ar" && !du.done) { du.poll = setTimeout(duArTick, 1500); }
    });
  }
  function duArApply(ar) {
    var x = duX(), t = duT();
    du.ar = ar;
    du.game = { lives: ar.lives, rlives: ar.rlives, round: Math.max(0, ar.round - 1) };
    du.oppName = ar.opp.uid ? ar.opp.name : t.bot;
    $("du-r-nom").textContent = du.oppName;
    var rim = $("du-r-im"), src = ar.opp.house ? (cupCrestImg(ar.opp.house, 54) || {}).src : IMG_DIR + "duel/r4.webp";
    if (src && rim.getAttribute("data-s") !== src) { rim.setAttribute("data-s", src); rim.src = src; rim.classList.toggle("gerb", !!ar.opp.house); }
    if (ar.phase === "early" || ar.phase === "wait") {
      duHearts();
      $("du-msg").textContent = (ar.phase === "early" ? t.early(duMS(ar.starts_in)) : t.wait(duMS(ar.wait_left))) + " " + (ar.opp.here ? t.here : t.nothere);
      return;
    }
    if (ar.phase === "pick") {
      if (du.rnd !== ar.round) { du.rnd = ar.round; du.step = "pick"; du.busy = false; clearTimeout(du.tm); duPick(); }
      if (ar.moved && du.step !== "sent") { du.step = "sent"; du.busy = true; clearTimeout(du.tm); $("du-turs").classList.add("hidden"); $("du-draw").classList.add("hidden"); }
      if (du.step === "sent") { $("du-msg").textContent = t.sent + t.left(ar.deadline_in); }
      else if (du.step === "pick") { $("du-msg").textContent = x.pick(ar.round) + t.left(ar.deadline_in); }
      return;
    }
    if (ar.last && du.shown !== ar.last.r) {
      du.shown = ar.last.r; du.step = "rev"; du.busy = true; clearTimeout(du.tm);
      $("du-turs").classList.add("hidden");
      duReveal(ar.last);
    }
    if (ar.phase === "reveal" && !ar.over) { var nx = $("du-nxt"); if (nx) { nx.textContent = t.nxt(ar.next_in); } }
    if (ar.phase === "over" && !du.done) { du.done = true; clearTimeout(du.poll); duArEnd(ar); }
  }
  function duArEnd(ar) {
    var x = duX(), t = duT(), box = $("du-res");
    duHearts();
    $("du-turs").classList.add("hidden");
    $("du-draw").classList.add("hidden");
    if (ar.why !== "duel") { $("du-rev").classList.add("hidden"); }
    $("du-msg").textContent = ar.why === "kelmadi" ? (ar.won ? t.kelmadi : t.kelmadim) : ar.why === "ikkalasi" ? t.ikkalasi : "";
    box.innerHTML = "";
    box.appendChild(drEl("b", "rk-son", ar.won ? x.won : x.lost));
    if (!ar.test) {
      if (ar.won) { box.appendChild(drEl("b", "dr-res-p", t.pts(DU_BALL[ar.stage] || 0))); }
      box.appendChild(drEl("small", "dr-res-s", ar.won ? (ar.stage === 2 ? t.champ : "") : t.out));
    }
    var b = drEl("button", "dr-btn", t.tbl);
    b.type = "button";
    b.addEventListener("click", function () { duOpen(); });
    box.appendChild(b);
    box.classList.remove("hidden");
    try { if (tg && tg.HapticFeedback) { tg.HapticFeedback.notificationOccurred(ar.won ? "success" : "error"); } } catch (e) {}
  }

  /* ---------- duel ---------- */
  function duStart(level) {
    var x = duX();
    duStop();
    duPost({ start: level }, function (res) {
      if (!res || !res.game) { showToast(drX().fail, "err"); return; }
      du = { game: res.game, level: level };
      $("du-home").classList.add("hidden");
      $("du-game").classList.remove("hidden");
      $("du-r-im").src = duRaqImg(level);
      $("du-r-nom").textContent = x.raq[level - 1];
      $("du-m-nom").textContent = x.you;
      var av = $("du-m-im"), me = cupMe(), ci = cupCrestImg(me.house || house, 54);
      av.innerHTML = "";
      if (ci) { av.appendChild(ci); }
      $("du-res").classList.add("hidden");
      duPick();
      try { window.scrollTo(0, 0); } catch (e) {}
    });
  }

  function duHearts() { duJon($("du-r-jon"), du.game.rlives); duJon($("du-m-jon"), du.game.lives); }

  // 1) tur tanlash
  function duPick() {
    var x = duX(), box = $("du-turs");
    duHearts();
    $("du-msg").textContent = x.pick(du.game.round + 1);
    $("du-draw").classList.add("hidden");
    $("du-rev").classList.add("hidden");
    box.classList.remove("hidden");
    box.innerHTML = "";
    DU_TUR.forEach(function (t) {
      var b = drEl("button", "du-tur");
      b.type = "button";
      b.style.setProperty("--tu", DU_RGB[t]);
      b.innerHTML = DU_IC[t];
      b.appendChild(drEl("b", "", x.tur[t]));
      b.appendChild(drEl("small", "", "› " + x.tur[DU_YENG[t]]));
      b.addEventListener("click", function () { duDraw(t); });
      box.appendChild(b);
    });
  }

  // 2) afsunni chizish
  function duDraw(tur) {
    var x = duX(), havza = DU_AF[tur], id = havza[Math.floor(Math.random() * havza.length)], a = AF[id];
    du.tur = tur; du.af = id; du.user = []; du.drawing = false; du.busy = false;
    du.pts = afResample(a.s, 48);
    $("du-turs").classList.add("hidden");
    $("du-draw").classList.remove("hidden");
    $("du-draw").style.setProperty("--tu", DU_RGB[tur]);
    $("du-msg").textContent = x.draw((a[lang] || a.uz)[0]);
    duSize();
    du.t0 = Date.now();
    clearTimeout(du.tm);
    du.vaqt = du.mode === "ar" && du.ar ? Math.max(3000, Math.min(DU_VAQT, du.ar.deadline_in * 1000 - 2500)) : DU_VAQT;
    if (du.mode === "ar") { du.step = "draw"; }
    du.tm = setTimeout(function () { duSend(); }, du.vaqt);
    duLoop();
  }
  function duSize() {
    var c = $("du-canvas"), w = Math.min(300, ($("du-draw").clientWidth || 300)), r = window.devicePixelRatio || 1;
    c.style.width = w + "px"; c.style.height = w + "px";
    c.width = Math.round(w * r); c.height = Math.round(w * r);
    du.w = w; du.r = r;
  }
  function duLoop() {
    if (!du || du.busy || $("du-draw").classList.contains("hidden")) { return; }
    duPaint();
    du.raf = requestAnimationFrame(duLoop);
  }
  function duPaint() {
    var c = $("du-canvas"), g = c.getContext("2d"), w = du.w, i, rgb = DU_RGB[du.tur];
    g.setTransform(du.r, 0, 0, du.r, 0, 0);
    g.clearRect(0, 0, w, w);
    g.lineCap = "round"; g.lineJoin = "round";
    g.strokeStyle = "rgba(" + rgb + ",.38)"; g.lineWidth = 12; g.setLineDash([2, 16]);
    g.beginPath();
    for (i = 0; i < du.pts.length; i++) { g[i ? "lineTo" : "moveTo"](du.pts[i][0] * w, du.pts[i][1] * w); }
    g.stroke();
    g.setLineDash([]);
    g.fillStyle = "rgba(" + rgb + ",.95)";
    g.beginPath(); g.arc(du.pts[0][0] * w, du.pts[0][1] * w, 8, 0, Math.PI * 2); g.fill();
    if (du.user.length > 1) {
      g.strokeStyle = "#f3d58f"; g.lineWidth = 5; g.shadowColor = "rgba(243,213,143,.9)"; g.shadowBlur = 12;
      g.beginPath();
      for (i = 0; i < du.user.length; i++) { g[i ? "lineTo" : "moveTo"](du.user[i][0] * w, du.user[i][1] * w); }
      g.stroke();
      g.shadowBlur = 0;
    }
    var q = Math.max(0, 1 - (Date.now() - du.t0) / (du.vaqt || DU_VAQT));
    $("du-vaqt").style.width = Math.round(q * 100) + "%";
  }
  // Aniqlik 0..100: chizilgan iz shaklga qanchalik yaqin va shaklni qanchalik to'liq qoplagan
  function duAcc(pts, user) {
    if (!user || user.length < 6) { return 0; }
    var u = afResample(user, 48), yaq = function (a, b) {
      var s = 0;
      a.forEach(function (p) { var m = 9; b.forEach(function (q) { var d = Math.hypot(p[0] - q[0], p[1] - q[1]); if (d < m) { m = d; } }); s += m; });
      return s / a.length;
    };
    var d = (yaq(pts, u) + yaq(u, pts)) / 2;
    return Math.max(0, Math.min(100, Math.round(100 * (1 - (d - 0.012) / 0.13))));
  }
  function duXY(ev) {
    var r = $("du-canvas").getBoundingClientRect();
    return [Math.max(0, Math.min(1, (ev.clientX - r.left) / r.width)), Math.max(0, Math.min(1, (ev.clientY - r.top) / r.height))];
  }
  function duDown(ev) { if (!du || du.busy || !du.pts) { return; } du.drawing = true; du.user = [duXY(ev)]; try { ev.preventDefault(); } catch (e) {} }
  function duMove(ev) { if (!du || !du.drawing) { return; } du.user.push(duXY(ev)); try { ev.preventDefault(); } catch (e) {} }
  function duUp() { if (!du || !du.drawing) { return; } du.drawing = false; if (du.user.length >= 6) { duSend(); } }

  // 3) yurish serverga, natijani ko'rsatish
  function duSend() {
    if (!du || du.busy) { return; }
    var x = duX(), acc = duAcc(du.pts, du.user);
    du.busy = true; du.drawing = false;
    clearTimeout(du.tm);
    duPaint();
    $("du-msg").textContent = x.wait;
    if (du.mode === "ar") {                      // jonli duel: yurish arenaga, natijani server aytadi
      du.step = "sent";
      $("du-draw").classList.add("hidden");
      $("du-msg").textContent = duT().sent;
      duArTick({ arena: du.arena, move: du.tur, acc: acc });
      return;
    }
    duPost({ game: du.game.id, move: du.tur, acc: acc }, function (res) {
      if (!du) { return; }
      if (!res || !res.round) { showToast(drX().fail, "err"); du.busy = false; duPick(); return; }
      duData = res;
      du.game = res.game;
      duReveal(res.round);
    });
  }
  function duReveal(r) {
    var x = duX(), box = $("du-rev");
    $("du-draw").classList.add("hidden");
    box.classList.remove("hidden");
    box.innerHTML = "";
    var yon = function (nom, tur, acc, yutdi) {
      var c = drEl("div", "du-rv" + (yutdi ? " yutdi" : ""));
      c.style.setProperty("--tu", DU_RGB[tur]);
      c.appendChild(drEl("small", "", nom));
      var ic = drEl("span", "du-rv-ic"); ic.innerHTML = DU_IC[tur];
      c.appendChild(ic);
      c.appendChild(drEl("b", "", x.tur[tur]));
      c.appendChild(drEl("em", acc < 35 ? "yoq" : "", acc < 35 ? x.fail : x.acc + " " + acc));
      return c;
    };
    box.appendChild(yon(du.mode === "ar" ? du.oppName : x.raq[du.level - 1], r.his, r.racc, r.win < 0));
    box.appendChild(yon(x.you, r.mine, r.acc, r.win > 0));
    $("du-msg").textContent = r.win > 0 ? x.w1 : r.win < 0 ? x.wm : x.w0;
    duHearts();
    try { if (tg && tg.HapticFeedback) { tg.HapticFeedback.notificationOccurred(r.win > 0 ? "success" : r.win < 0 ? "error" : "warning"); } } catch (e) {}
    $("scr-duel").classList.remove("zarba-m", "zarba-r");
    void $("scr-duel").offsetWidth;
    if (r.win) { $("scr-duel").classList.add(r.win > 0 ? "zarba-r" : "zarba-m"); }
    if (du.mode === "ar") { var nx = drEl("small", "du-nxt", ""); nx.id = "du-nxt"; box.appendChild(nx); return; }     // keyingi raundni server boshlaydi
    var b = drEl("button", "dr-btn", du.game.over ? (du.game.won ? x.won : x.lost) : x.next);
    b.type = "button";
    b.addEventListener("click", function () { if (du.game.over) { duEnd(); } else { du.busy = false; duPick(); } });
    box.appendChild(b);
  }
  function duEnd() {
    var x = duX(), box = $("du-res"), g = du.game, level = du.level;
    $("du-rev").classList.add("hidden");
    $("du-turs").classList.add("hidden");
    $("du-msg").textContent = "";
    box.innerHTML = "";
    box.appendChild(drEl("b", "rk-son", g.won ? x.won : x.lost));
    if (g.won) { box.appendChild(drEl("b", "dr-res-p", x.score(g.score))); }
    var a = drEl("button", "dr-btn", x.again);
    a.type = "button";
    a.addEventListener("click", function () { duStart(level); });
    box.appendChild(a);
    var b = drEl("button", "dr-btn ikkinchi", x.back);
    b.type = "button";
    b.addEventListener("click", function () { duStop(); duHome(); });
    box.appendChild(b);
    box.classList.remove("hidden");
  }

  function duSetup() {
    $("du-back").addEventListener("click", function () {
      if (du) { duStop(); duHome(); return; }
      $("scr-duel").classList.add("hidden");
      openHub();
    });
    var c = $("du-canvas");
    if (window.PointerEvent) {
      c.addEventListener("pointerdown", duDown); c.addEventListener("pointermove", duMove);
      c.addEventListener("pointerup", duUp); c.addEventListener("pointercancel", duUp); c.addEventListener("pointerleave", duUp);
    } else {
      var tch = function (fn) { return function (ev) { var t = ev.changedTouches && ev.changedTouches[0]; if (t) { fn({ clientX: t.clientX, clientY: t.clientY, preventDefault: function () { ev.preventDefault(); } }); } }; };
      c.addEventListener("touchstart", tch(duDown), { passive: false });
      c.addEventListener("touchmove", tch(duMove), { passive: false });
      c.addEventListener("touchend", function () { duUp(); });
    }
  }

  duSetup();
