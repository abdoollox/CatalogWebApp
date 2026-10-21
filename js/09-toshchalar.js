/* TOSHCHALAR (Gobstones) - seshanba turniri (egasi, 2026-10-14). Server: hptosh.py, POST /api/tosh.
   Darslarda yo'q, o'ziga xos o'yin: doiradagi toshchalarni o'z toshingiz bilan urib chiqarasiz. Joy (pastki yoy), yo'nalish va kuch -
   o'yinchining mahorati. FIZIKA SERVERDA: zarba yuboriladi, server toshlar harakatini kadrlar bilan qaytaradi - ilova faqat ko'rsatadi.
   Mashq - kompyuter bilan (3 daraja); turnir - duel/shaxmat qolipida to'r.
   Ilova kodi bir necha faylga bo'lingan; hammasi BIR umumiy maydonda ishlaydi
   va index.html dagi TARTIBDA yuklanadi. Yuklanish paytida keyingi fayldagi
   narsani chaqirmang - tekshiruv: tools/tartib.js */
"use strict";

  var API_TOSH = "https://bot.tizimshunos.uz/api/tosh";
  var GB_T = {
    uz: { kick: "Seshanba turniri", ttl: "Toshchalar", nom: "Toshchalar turniri", kunlar: ["yakshanba", "dushanba", "seshanba", "chorshanba", "payshanba", "juma", "shanba"],
          qoldi: "qoldi", soni: function (n) { return n + " kishi yozildi"; }, qat: "Qatnashaman", bor: "Siz yozilgansiz — boyo'g'li eslatadi", chiq: "Chiqish",
          yopiq: "Yozilish yopildi", q1: "Doiradagi toshchalarni o'z toshingiz bilan urib chiqaring", q2: "Joyni, yo'nalishni va kuchni o'zingiz tanlaysiz",
          q3: function (z) { return "Har kimga " + z + " ta zarba — ko'p chiqargan yutadi"; },
          mashq: "Mashq", mashqS: "Kompyuter bilan, ballsiz", daraja: ["Oson", "O'rta", "Qiyin"], stat: function (a, b) { return a + " o'yin · " + b + " g'alaba"; },
          tor: "Turnir to'ri", bosq: { 2: "Final", 4: "Yarim final", 8: "Chorak final", 16: "1/8 final", 32: "1/16 final" }, jonli: "JONLI", kutadi: "kutadi",
          kor: "Ko'rish", ball: function (p) { return "g'alabaga +" + p; }, sinov: "Sinov o'yini", sinovS: "Faqat adminga ko'rinadi · kompyuter bilan, turnir oqimi",
          siz: "Siz", navbat: "Sizning navbatingiz", navbatR: function (n) { return n + " otmoqda…"; }, kut: "Kuting…", boshlanadi: function (s) { return "O'yin " + s + " soniyadan keyin boshlanadi"; },
          joyH: "Toshni yoy bo'ylab suring — joyni tanlang", otH: "Joy: toshni yoy bo'ylab suring · Zarba: maydonda barmoqni orqaga torting", kuch: "Kuch",
          qaytH: "bekor qilish — barmoqni ✕ ga qaytaring", bekorH: "Qo'yib yuborsangiz — zarba bekor bo'ladi", bekorX: "Zarba bekor qilindi — joyni o'zgartirsangiz bo'ladi", zarba: function (a, b) { return a + " / " + b + " zarba"; },
          chiqdi: function (n) { return n > 0 ? "+" + n + " toshcha!" : "Toshcha chiqmadi"; }, otkazdi: "Zarba yonib ketdi — vaqt tugadi",
          yutdi: "Siz yutdingiz!", yutqazdi: "Siz yutqazdingiz", durang: "Durang", golibi: function (n) { return n + " yutdi"; }, sepdi: function (n) { return "Toshchalar " + n + "ga sassiq suyuqlik sepdi!"; }, sepSiz: "Toshchalar sizga sassiq suyuqlik sepdi!",
          kelmadi: "Raqib kelmadi", teng: "Teng — to'rda yuqori turgan o'tdi", yana: "Yana o'ynash", ortga: "Ortga", aloqa: "Aloqa yo'q — qayta urinib ko'ring",
          qoshimcha: "Teng! Qo'shimcha zarbalar",
          r2: ["1-RAUND", "2-RAUND", "PENALTI"], r2X: ["", "2-raund — yangi toshchalar", "Teng! Penalti"],
          q3v2: function (z, n) { return "Ikki raund: har raundda " + n + " ta yangi toshcha, har kimga " + z + " tadan zarba. 2-raundni raqib boshlaydi"; },
          infoV2: function (n, z, v) { return ["Ikki raund", "Har raundda doira o'rtasiga " + n + " ta yangi toshcha qo'yiladi, har kimga " + z + " tadan zarba. 1-raundni bir o'yinchi, 2-raundni ikkinchisi boshlaydi — birinchi otishning ustunligi teng bo'linadi. Ikki raund ballari qo'shiladi. Teng bo'lsa — penalti: navbat bilan har kim to'liq yangi taxtaga bittadan zarba beradi. Har zarbaga " + v + " soniya."]; },
          galaba: "G'alaba", maglub: "Mag'lubiyat", yakunK: "O'yin tugadi",
          dost: "Do'st bilan", dostS: "Telegram orqali", kutT: "Do'stingizni kutyapmiz", kutS: "Kartani Telegram chatiga yuboring — do'stingiz bosishi bilan o'yin boshlanadi",
          muddat: function (v) { return "Taklif yana " + v + " amal qiladi"; }, tgB: "Telegram chatiga yuborish", bekorB: "Bekor qilish",
          eBand: "Bu taklifni boshqa odam qabul qilib bo'lgan", eMuddat: "Taklif muddati tugagan" },
    ru: { kick: "Турнир вторника", ttl: "Плюй-камни", nom: "Турнир по плюй-камням", kunlar: ["воскресенье", "понедельник", "вторник", "среда", "четверг", "пятница", "суббота"],
          qoldi: "осталось", soni: function (n) { return "Записалось: " + n; }, qat: "Участвую", bor: "Вы записаны — сова напомнит", chiq: "Выйти",
          yopiq: "Запись закрыта", q1: "Выбивайте камешки из круга своим камнем", q2: "Место, направление и силу выбираете сами",
          q3: function (z) { return "У каждого " + z + " ударов — кто выбьет больше, тот победил"; },
          mashq: "Тренировка", mashqS: "С компьютером, без очков", daraja: ["Легко", "Средне", "Сложно"], stat: function (a, b) { return "Игр: " + a + " · побед: " + b; },
          tor: "Сетка турнира", bosq: { 2: "Финал", 4: "Полуфинал", 8: "Четвертьфинал", 16: "1/8 финала", 32: "1/16 финала" }, jonli: "LIVE", kutadi: "ждёт",
          kor: "Смотреть", ball: function (p) { return "за победу +" + p; }, sinov: "Тестовая игра", sinovS: "Только для админа · с компьютером, как в турнире",
          siz: "Вы", navbat: "Ваш ход", navbatR: function (n) { return n + " бьёт…"; }, kut: "Ждите…", boshlanadi: function (s) { return "Игра начнётся через " + s + " с"; },
          joyH: "Двигайте камень по дуге — выберите место", otH: "Место: двигайте камень по дуге · Удар: оттяните палец на поле", kuch: "Сила",
          qaytH: "отмена — верните палец к ✕", bekorH: "Отпустите — удар отменится", bekorX: "Удар отменён — можно сменить место", zarba: function (a, b) { return "Удар " + a + " из " + b; },
          chiqdi: function (n) { return n > 0 ? "+" + n + "!" : "Мимо"; }, otkazdi: "Удар сгорел — время вышло",
          yutdi: "Вы победили!", yutqazdi: "Вы проиграли", durang: "Ничья", golibi: function (n) { return "Победил " + n; }, sepdi: function (n) { return "Камни обрызгали " + n + " вонючей жидкостью!"; }, sepSiz: "Камни обрызгали вас вонючей жидкостью!",
          kelmadi: "Соперник не пришёл", teng: "Ничья — прошёл тот, кто выше в сетке", yana: "Ещё раз", ortga: "Назад", aloqa: "Нет связи — попробуйте ещё раз",
          qoshimcha: "Ничья! Дополнительные удары",
          r2: ["1-Й РАУНД", "2-Й РАУНД", "ПЕНАЛЬТИ"], r2X: ["", "2-й раунд — новые камешки", "Ничья! Пенальти"],
          q3v2: function (z, n) { return "Два раунда: в каждом " + n + " новых камешков и по " + z + " удара. Второй раунд начинает соперник"; },
          infoV2: function (n, z, v) { return ["Два раунда", "В каждом раунде в центр круга кладут " + n + " новых камешков, у каждого по " + z + " удара. Первый раунд начинает один игрок, второй — другой: преимущество первого удара делится поровну. Очки двух раундов складываются. Ничья — пенальти: по очереди каждый бьёт по одному разу по полному новому кругу. На удар " + v + " секунд."]; },
          galaba: "Победа", maglub: "Поражение", yakunK: "Игра окончена",
          dost: "С другом", dostS: "через Telegram", kutT: "Ждём вашего друга", kutS: "Отправьте карточку в чат Telegram — друг нажмёт, и игра начнётся",
          muddat: function (v) { return "Приглашение действует ещё " + v; }, tgB: "Отправить в чат Telegram", bekorB: "Отменить",
          eBand: "Это приглашение уже принял другой", eMuddat: "Срок приглашения истёк" },
    en: { kick: "Tuesday tournament", ttl: "Gobstones", nom: "Gobstones tournament", kunlar: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
          qoldi: "left", soni: function (n) { return n + " signed up"; }, qat: "I'm in", bor: "You are signed up — an owl will remind you", chiq: "Leave",
          yopiq: "Sign-up closed", q1: "Knock the stones out of the ring with your own stone", q2: "You choose the spot, the direction and the power",
          q3: function (z) { return z + " shots each — whoever knocks out more wins"; },
          mashq: "Practice", mashqS: "Against the computer, no points", daraja: ["Easy", "Medium", "Hard"], stat: function (a, b) { return a + " games · " + b + " wins"; },
          tor: "Tournament bracket", bosq: { 2: "Final", 4: "Semi-final", 8: "Quarter-final", 16: "Round of 16", 32: "Round of 32" }, jonli: "LIVE", kutadi: "waiting",
          kor: "Watch", ball: function (p) { return "+" + p + " for a win"; }, sinov: "Test game", sinovS: "Admin only · against the computer, tournament flow",
          siz: "You", navbat: "Your turn", navbatR: function (n) { return n + " is shooting…"; }, kut: "Wait…", boshlanadi: function (s) { return "The game starts in " + s + " s"; },
          joyH: "Slide your stone along the arc to pick a spot", otH: "Spot: slide the stone along the arc · Shot: pull your finger back on the field", kuch: "Power",
          qaytH: "to cancel, bring your finger back to ✕", bekorH: "Let go now and the shot is cancelled", bekorX: "Shot cancelled — you can change the spot", zarba: function (a, b) { return "Shot " + a + " of " + b; },
          chiqdi: function (n) { return n > 0 ? "+" + n + "!" : "No stone out"; }, otkazdi: "Shot lost — time ran out",
          yutdi: "You won!", yutqazdi: "You lost", durang: "Draw", golibi: function (n) { return n + " won"; }, sepdi: function (n) { return "The Gobstones squirted " + n + " with stinky liquid!"; }, sepSiz: "The Gobstones squirted you with stinky liquid!",
          kelmadi: "The opponent did not come", teng: "Tie — the higher seed goes through", yana: "Play again", ortga: "Back", aloqa: "No connection — please try again",
          qoshimcha: "Tie! Extra shots",
          r2: ["ROUND 1", "ROUND 2", "PENALTIES"], r2X: ["", "Round 2 — new stones", "Tie! Penalties"],
          q3v2: function (z, n) { return "Two rounds: " + n + " new stones and " + z + " shots each per round. Your rival starts round 2"; },
          infoV2: function (n, z, v) { return ["Two rounds", "Each round " + n + " new stones are placed in the ring, " + z + " shots each. One player starts round 1, the other starts round 2 — the first-shot advantage is shared. Points from both rounds add up. On a tie — penalties: taking turns, each shoots once at a full new ring. " + v + " seconds per shot."]; },
          galaba: "Victory", maglub: "Defeat", yakunK: "Game over",
          dost: "With a friend", dostS: "via Telegram", kutT: "Waiting for your friend", kutS: "Send the card to a Telegram chat — the game starts as soon as your friend taps it",
          muddat: function (v) { return "The invite is valid for " + v + " more"; }, tgB: "Send to a Telegram chat", bekorB: "Cancel",
          eBand: "Someone else has already accepted this invite", eMuddat: "The invite has expired" }
  };
  function gbT() { return GB_T[lang] || GB_T.uz; }

  // Server bilan bir xil o'lchamlar (hptosh.py)
  var GB_R = 1.0, GB_TR = 0.058, GB_OR = 0.068, GB_JOY = [-150, -30];
  var GB_BEKOR = 0.12;          // bundan kuchsiz tortilsa (barmoq ✕ ga qaytarilsa) - zarba bekor
  var gbData = null, gbTm = null, gbSoat = null, gbOlingan = 0, gbLocal = null;
  var gb = null;      // o'yin: {id, g (server holati), seen, anim, s (joy), aim, raf, tm, w, dpr}

  function gbPost(body, cb) {
    body = body || {};
    body.lang = lang;
    if (!window.fetch) { return; }
    window.fetch(API_TOSH, { method: "POST", headers: { "Content-Type": "application/json", "X-Telegram-Init-Data": drInit() }, body: JSON.stringify(body) })
      .then(function (r) { return r.json(); })
      .then(function (res) { cb(res && res.ok ? res : (MS_LOCAL ? gbSample(body) : res)); })
      ["catch"](function () { cb(MS_LOCAL ? gbSample(body) : null); });
  }

  /* ---------- mahalliy ko'rik: serversiz namuna (fizika - soddalashtirilgan nusxa) ---------- */
  function gbSimLocal(st, s, a, p) {
    var n = st.length, px = [], py = [], vx = [], vy = [], rad = [], m = [], tirik = [], out = [], f = [], i, j, q = 0;
    var sr = s * Math.PI / 180, ar = a * Math.PI / 180, v = 0.6 + 2.0 * p;
    for (i = 0; i < n; i++) { px.push(st[i][0]); py.push(st[i][1]); vx.push(0); vy.push(0); rad.push(GB_TR); m.push(1); tirik.push(true); out.push(null); }
    px.push(Math.cos(sr) * (GB_R - GB_OR * 1.2)); py.push(Math.sin(sr) * (GB_R - GB_OR * 1.2)); vx.push(Math.cos(ar) * v); vy.push(Math.sin(ar) * v); rad.push(GB_OR); m.push(1.45); tirik.push(true); out.push(null);
    var snap = function () { var k = []; for (var t = 0; t <= n; t++) { k.push([px[t], py[t]]); } f.push(k); };
    snap();
    var chiqdi = 0;
    while (q * (1 / 120) < 7) {
      q++;
      var harakat = false;
      for (i = 0; i <= n; i++) {
        if (!tirik[i]) { continue; }
        var sp = Math.hypot(vx[i], vy[i]);
        if (sp > 0) { var y2 = Math.max(0, sp - 1.2 / 120), k2 = y2 / sp; vx[i] *= k2; vy[i] *= k2; px[i] += vx[i] / 120; py[i] += vy[i] / 120; if (y2 > 0.004) { harakat = true; } }
      }
      for (i = 0; i <= n; i++) {
        if (!tirik[i]) { continue; }
        for (j = i + 1; j <= n; j++) {
          if (!tirik[j]) { continue; }
          var dx = px[j] - px[i], dy = py[j] - py[i], ms = rad[i] + rad[j], d2 = dx * dx + dy * dy;
          if (d2 >= ms * ms || !d2) { continue; }
          var d = Math.sqrt(d2), nx = dx / d, ny = dy / d, rv = (vx[i] - vx[j]) * nx + (vy[i] - vy[j]) * ny, u = (ms - d) / 2;
          px[i] -= nx * u; py[i] -= ny * u; px[j] += nx * u; py[j] += ny * u;
          if (rv <= 0) { continue; }
          var imp = 1.9 * rv / (1 / m[i] + 1 / m[j]);
          vx[i] -= imp / m[i] * nx; vy[i] -= imp / m[i] * ny; vx[j] += imp / m[j] * nx; vy[j] += imp / m[j] * ny; harakat = true;
        }
      }
      for (i = 0; i <= n; i++) { if (tirik[i] && Math.hypot(px[i], py[i]) > GB_R && !(i === n && q / 120 < 0.15)) { tirik[i] = false; out[i] = f.length; if (i < n) { chiqdi++; } } }
      if (q % 3 === 0) { snap(); }
      if (!harakat) { break; }
    }
    snap();
    var qoldi = [];
    for (i = 0; i < n; i++) { if (tirik[i]) { qoldi.push([px[i], py[i]]); } }
    return { qoldi: qoldi, ball: chiqdi, f: f, out: out };
  }
  function gbSample(body) {
    if (body.history) {                                // mahalliy ko'rik: namuna tarix
      var h0 = Date.now() / 1000;
      return { ok: true, history: [
        { id: 31, kind: "turnir", stage: 8, opp: { name: "Germiona", house: "gryffindor" }, score: [5, 3], res: "g", why: "oyin", ts: h0 - 3600 },
        { id: 30, kind: "dost", stage: null, opp: { name: "Draco", house: "slytherin" }, score: [2, 4], res: "m", why: "oyin", ts: h0 - 86400 },
        { id: 29, kind: "mashq", stage: null, opp: { name: "Ron", bot: 2 }, score: [4, 1], res: "g", why: "oyin", ts: h0 - 2 * 86400 }] };
    }
    if (!gbLocal) { gbLocal = { joined: false, g: null }; }
    var L2 = gbLocal, hozir = Date.now() / 1000;
    if (body.join != null) { L2.joined = !!body.join; }
    if (body.mashq != null || body.sinov) {
      var st = [], q = 0.165;
      [1, 0, -1].forEach(function (y) { [-1, 0, 1].forEach(function (x) { st.push([x * q, y * q]); }); });
      L2.g = { id: 7, kind: body.sinov ? "sinov" : "mashq", state: "ketmoqda", me: "a", a: { uid: 1, name: "Sehrgar", house: "ravenclaw" },
               b: { uid: null, name: GB_BOT[(body.mashq || 2) - 1], house: "gryffindor", bot: body.mashq || 2 }, score: [0, 0], shots: 0, per: 5, extra: 3,
               turn: "a", stones: st, turn_in: 0, turn_left: 30, winner: null, why: null, last_n: 0, t0: hozir };
    }
    if (body.shot && L2.g && L2.g.turn === "a") {
      var r = gbSimLocal(L2.g.stones, body.shot.s, body.shot.a, body.shot.p), g = L2.g;
      g.shots++; g.score[0] += r.ball; g.stones = r.qoldi; g.last = { n: g.shots, by: "a", ball: r.ball, f: r.f, out: r.out, dt: 0.025 }; g.last_n = g.shots;
      if (g.stones.length && g.shots < 10) {
        // kompyuter darhol javob beradi (namuna)
        var t = g.stones[Math.floor(Math.random() * g.stones.length)], sx = Math.cos(-Math.PI / 2) * 0.92, sy = -0.92;
        var r2 = gbSimLocal(g.stones, -90, Math.atan2(t[1] - sy, t[0] - sx) * 180 / Math.PI + (Math.random() - 0.5) * 8, 0.85);
        g.pending = { n: g.shots + 1, by: "b", ball: r2.ball, f: r2.f, out: r2.out, dt: 0.025, qoldi: r2.qoldi };
      }
      g.turn = "b";
      if (!g.stones.length || g.shots >= 10) { g.state = "tugadi"; g.winner = g.score[0] > g.score[1] ? "a" : g.score[1] > g.score[0] ? "b" : null; g.turn = null; }
    } else if (L2.g && L2.g.pending && body.seen >= L2.g.pending.n - 1 && body.oyin) {
      var gg = L2.g, pd = gg.pending;
      gg.pending = null; gg.shots++; gg.score[1] += pd.ball; gg.stones = pd.qoldi; gg.last = pd; gg.last_n = gg.shots; gg.turn = "a";
      if (!gg.stones.length || gg.shots >= 10) { gg.state = "tugadi"; gg.winner = gg.score[0] > gg.score[1] ? "a" : gg.score[1] > gg.score[0] ? "b" : null; gg.turn = null; }
    }
    if (body.dost) {           // namuna: do'stga taklif kutilmoqda
      return { ok: true, game: { id: 9, kind: "dost", state: "kutmoqda", me: "a", a: { uid: 1, name: "Sehrgar", house: "ravenclaw" }, b: null, score: [0, 0], shots: 0,
        per: 5, extra: 3, turn: "a", stones: [], turn_in: 0, turn_left: 30, winner: null, expires_in: 1790, last_n: 0 } };
    }
    if (body.oyin != null || body.mashq != null || body.sinov) {
      var ko = JSON.parse(JSON.stringify(L2.g));
      if (body.seen != null && ko.last && ko.last.n <= body.seen) { delete ko.last; }
      delete ko.pending;
      return { ok: true, game: ko, shot_ok: body.shot ? true : undefined };
    }
    return { ok: true, now: hozir, admin: true, stats: { played: 4, won: 1 },
      tour: { ts: hozir + 6 * 86400, now: hozir, open: true, joined: L2.joined, n: 5, players: [] },
      rules: { shots: 5, extra: 3, turn: 30, stones: 9, points: { "2": 30, "4": 20, "8": 10, "16": 5 }, bots: { "1": "Nevill", "2": "Ron", "3": "Jorj Uizli" } },
      cup: { size: null }, champs: null };
  }
  var GB_BOT = ["Nevill", "Ron", "Jorj Uizli"];

  /* ---------- sahifa ---------- */
  function gbOpen() {
    try { $("scr-hub").classList.add("hidden"); } catch (e) {}
    gbKor = "home";
    gbKorsat();
  }
  function gbKorsat() {
    drShowGame("scr-tosh");
    $("gb-kick").textContent = gbT().kick;
    $("gb-ttl").textContent = gbKor === "tarix" ? tpT().tarix : gbT().ttl;
    $("gb-home").classList.remove("hidden");
    $("gb-game").classList.add("hidden");
    $("gb-info-b").classList.toggle("hidden", gbKor === "tarix");
    if (gbKor === "tarix") { gbTarix(); return; }
    gbRender();
    gbLoad();
  }
  function gbYop() {
    clearTimeout(gbTm);
    clearInterval(gbSoat);
    gbStop();
    var ochiq = $("du-info");
    if (ochiq) { ochiq.parentNode.removeChild(ochiq); }
    $("scr-tosh").classList.add("hidden");
    openHub();
  }
  function gbLoad() {
    clearTimeout(gbTm);
    if ($("scr-tosh").classList.contains("hidden") || gb) { return; }
    gbPost({}, function (res) {
      if ($("scr-tosh").classList.contains("hidden") || gb) { return; }
      if (res && res.tour) { gbData = res; gbOlingan = Date.now(); gbRender(); }
      var d = gbData, kech = d ? d.tour.ts - d.now : 99999, jonli = d && d.cup && d.cup.size && kech < 0 && kech > -7200;
      // o'z turnir o'yini boshlandi - o'zi ochiladi
      if (d && d.active && d.active.kind === "turnir" && !MS_LOCAL) { gbOyin(d.active.id); return; }
      if (!MS_LOCAL) { gbTm = setTimeout(gbLoad, jonli || (kech < 900 && kech > -60) ? 3000 : 60000); }
    });
  }
  function gbQol(sek) {
    var t = gbT();
    sek = Math.max(0, Math.round(sek));
    if (sek >= 86400) { return Math.floor(sek / 86400) + " " + (lang === "en" ? "d" : lang === "ru" ? "дн." : "kun"); }
    if (sek >= 3600) { return Math.floor(sek / 3600) + (lang === "en" ? " h " : lang === "ru" ? " ч " : " soat ") + Math.floor(sek % 3600 / 60) + (lang === "en" ? " min" : lang === "ru" ? " мин" : " daq"); }
    return Math.floor(sek / 60) + ":" + (sek % 60 < 10 ? "0" : "") + (sek % 60);
  }
  // O'yinlar tarixi: karta ichidagi qator ochadi; o'yin bosilsa - o'sha o'yin, «ortga» - tarixga, yana «ortga» - bosh ko'rinish
  var gbKor = "home";
  function gbTarix() {
    gbKor = "tarix";
    clearInterval(gbSoat);
    $("gb-ttl").textContent = tpT().tarix;
    $("gb-info-b").classList.add("hidden");
    var box = $("gb-home"), o = { bot: function (k) { return tpTosh("k" + k); }, och: function (id) { gbOyin(id); } };
    tpTarix(box, null, o);
    try { window.scrollTo(0, 0); } catch (e) {}
    gbPost({ history: 1 }, function (res) { if (gbKor === "tarix" && !gb) { tpTarix(box, (res && res.history) || [], o); } });
  }
  function gbRender() {
    var d = gbData, t = gbT(), tp = tpT(), box = $("gb-home");
    if (gbKor === "tarix") { return; }
    box.innerHTML = "";
    clearInterval(gbSoat);
    if (!d) { return; }
    // YAGONA QOLIP (js/09-turnir-qolip.js): karta -> to'r -> g'oliblar -> mashq -> qoida -> yozilganlar -> sinov
    var tr = d.tour, jonli = d.cup && d.cup.stages;
    var hero = tpHero({ lab: jonli ? tp.ketmoqda : tp.keyingi, sar: tpKun(tr.ts, t.kunlar),
      tarix: [tp.tarix, gbTarix],
      holat: tpYozHolat(tr, t.bor, t.chiq, t.qat, t.yopiq, function (on) {
        gbPost({ join: on ? 1 : 0 }, function (r) { if (r && r.tour) { gbData = r; gbRender(); } else { showToast(t.aloqa, "err"); } });
      }) });
    var yoz = function () { var q = tr.ts - tr.now - (Date.now() - gbOlingan) / 1000; hero.tpIz.textContent = (q > 0 ? gbQol(q) + " " + t.qoldi + " · " : "") + t.soni(tr.n); };
    yoz();
    gbSoat = setInterval(yoz, 1000);
    box.appendChild(hero);
    if (jonli) { box.appendChild(gbTor(d.cup.stages)); }
    var gk = golibKarta(d.champs);
    if (gk) { box.appendChild(gk); }
    var kat = [1, 2, 3].map(function (k) {
      return { av: tpTosh("k" + k), nom: (d.rules && d.rules.bots && d.rules.bots[String(k)]) || GB_BOT[k - 1], sub: t.daraja[k - 1], fn: function () { gbBoshla({ mashq: k }); } };
    });
    kat.push(tpDost(function () { tkOyna("tosh"); }));      // chat (Katta zal, fakultet, shaxsiy) yoki Telegram
    box.appendChild(tpMashq(tp.ballsiz + (d.stats && d.stats.played ? " · " + t.stat(d.stats.played, d.stats.won) : ""), kat));
    var r0 = d.rules || {};       // ikki raundli qoida (2026-10-21) - hozircha faqat adminga (sinov)
    box.appendChild(tpQoida([t.q1, t.q2, r0.v2 ? t.q3v2(r0.rshots || 3, r0.rstones || 6) : t.q3(r0.shots || 5)], tpTorSov(d.rules && d.rules.points), tp.torIz));
    if (!jonli) { box.appendChild(tpYoz(tr.players, tr.n)); }
    if (d.admin) { box.appendChild(tpSinov(t.sinov, t.sinovS, function () { gbBoshla({ sinov: 1 }); })); }
  }
  function gbTor(stages) {
    var t = gbT(), k = drEl("div", "gb-tor");
    k.appendChild(drEl("div", "dk-bosh", null)).appendChild(drEl("b", "", t.tor));
    stages.forEach(function (s) {
      var b = drEl("div", "gb-st");
      b.appendChild(drEl("small", "", (t.bosq[s.stage] || s.stage) + " · " + t.ball(s.points)));
      s.matches.forEach(function (m) {
        var r = drEl("button", "gb-m" + (m.mine ? " men" : "") + (m.state === "ketmoqda" ? " jonli" : ""));
        r.type = "button";
        var ism = function (p, yon) {
          var sp = drEl("span", "gb-m-p" + (m.winner != null && p && p.uid === m.winner ? " yut" : ""));
          sp.appendChild(drEl("b", "", p ? p.name : t.kutadi));
          if (m.why !== "bye") { sp.appendChild(drEl("em", "", String(m.score[yon]))); }
          return sp;
        };
        r.appendChild(ism(m.a, 0));
        r.appendChild(ism(m.b, 1));
        if (m.state === "ketmoqda") { r.appendChild(drEl("u", "", t.jonli)); }
        if (m.state !== "kutmoqda" && m.why !== "bye") { r.addEventListener("click", function () { gbOyin(m.id); }); } else { r.disabled = true; }
        b.appendChild(r);
      });
      k.appendChild(b);
    });
    return k;
  }

  /* ---------- o'yin ---------- */
  function gbBoshla(body, tgga) {
    gbPost(body, function (res) {
      if (!res || !res.game) { showToast(gbT().aloqa, "err"); return; }
      gbOyin(res.game.id, res.game);
      if (tgga) { tgTaklif("tosh", res.game.id); }          // do'st bilan: karta darhol chat tanlab yuboriladi
    });
  }
  // Telegram kartasi bilan kelgan do'st: taklifni qabul qilib, o'yinga kiradi
  function gbQabul2(id) {
    var t = gbT();
    try { $("scr-cat").classList.add("hidden"); } catch (e) {}
    drShowGame("scr-tosh");
    $("gb-kick").textContent = t.kick;
    $("gb-ttl").textContent = t.ttl;
    gbPost({ qabul: id }, function (res) {
      if (res && res.game) { gbOyin(res.game.id, res.game); return; }
      showToast(res && res.error === "band" ? t.eBand : res && res.error === "muddat" ? t.eMuddat : t.aloqa, "err");
      gbKorsat();
    });
  }
  // Do'st kutilayotganda: karta yuborish va bekor qilish
  function gbKutish() {
    var g = gb.g, t = gbT(), box = $("gb-end");
    box.classList.remove("hidden");
    if (box.getAttribute("data-k") !== "kut") {
      box.setAttribute("data-k", "kut");
      box.innerHTML = "";
      var k = drEl("div", "gb-e-k");
      k.appendChild(drEl("small", "gb-e-kick", t.dost));
      k.appendChild(drEl("b", "gb-e-t", t.kutT));
      k.appendChild(drEl("p", "", t.kutS));
      k.appendChild(drEl("p", "gb-kut-m", ""));
      var tug = drEl("div", "gb-e-b"), tb = drEl("button", "dr-btn", t.tgB), bb = drEl("button", "dr-btn gb-ikki", t.bekorB);
      tb.type = bb.type = "button";
      tb.addEventListener("click", function () { if (gb) { tgTaklif("tosh", gb.id); } });
      bb.addEventListener("click", function () { var id = gb && gb.id; gbPost({ bekor: id }, function () {}); gbStop(); gbKorsat(); });
      tug.appendChild(tb);
      tug.appendChild(bb);
      k.appendChild(tug);
      box.appendChild(k);
    }
    var m = box.querySelector(".gb-kut-m");
    if (m && g.expires_in != null) { m.textContent = t.muddat(gbQol(g.expires_in)); }
  }
  function gbStop() {
    if (!gb) { return; }
    clearTimeout(gb.tm);
    try { cancelAnimationFrame(gb.raf); } catch (e) {}
    gb = null;
  }
  function gbOyin(id, g0) {
    gbStop();
    clearTimeout(gbTm);
    clearInterval(gbSoat);
    $("gb-home").classList.add("hidden");
    $("gb-game").classList.remove("hidden");
    $("gb-info-b").classList.add("hidden");
    $("gb-end").classList.add("hidden");
    var c = $("gb-canvas"), w = Math.min((c.parentNode.clientWidth || 340), 380), dpr = Math.min(window.devicePixelRatio || 1, 2);
    c.style.width = w + "px"; c.style.height = w + "px";
    c.width = Math.round(w * dpr); c.height = Math.round(w * dpr);
    gb = { id: id, g: null, seen: null, anim: null, s: -90, aim: null, raf: 0, tm: 0, w: w, dpr: dpr, splash: [] };
    if (g0) { gbQabul(g0); }
    gbSor();
    gb.raf = requestAnimationFrame(gbKadr);
  }
  function gbSor() {
    if (!gb) { return; }
    var me = gb;
    clearTimeout(gb.tm);
    gbPost({ oyin: gb.id, seen: gb.seen == null ? -1 : gb.seen }, function (res) {
      if (gb !== me) { return; }
      if (res && res.game) { gbQabul(res.game); }
      gb.tm = setTimeout(gbSor, gb.anim ? 600 : 1000);
    });
  }
  function gbQabul(g) {
    var t = gbT();
    if (g.last && (gb.seen == null || g.last.n > gb.seen)) {
      if (gb.seen != null || g.shots <= 1) {
        gb.anim = { ox: g.last, t0: performance.now(), dt: (g.last.dt || 0.025) * 1000, tugadi: false };
        if (g.last.skip) { gbXabar(t.otkazdi); gb.anim = null; }
      }
      gb.seen = g.last.n;
    } else if (gb.seen == null) { gb.seen = g.last_n || 0; }
    gb.g = g;
    gbHud();
  }
  function gbXabar(m) { if (gb) { gb.xabar = { m: m, t: performance.now() }; } }
  // Fakultet rangi (otuvchi tosh va o'yinchi kartasi uchun); ikkalasi bir fakultetdan bo'lsa raqibniki kumush
  function gbUyRang(h, kumush) { var x = HOUSES[validHouse(h) || ""]; return (!x || kumush) ? "214,220,230" : x.rgb; }
  function gbAralash(rgb, k) {
    var p = rgb.split(",").map(Number);
    return "rgb(" + p.map(function (v) { return Math.round(k >= 0 ? v + (255 - v) * k : v * (1 + k)); }).join(",") + ")";
  }
  var GB_TAXTA = null;
  function gbTaxta() {
    if (!GB_TAXTA) { GB_TAXTA = new Image(); GB_TAXTA.src = IMG_DIR + "toshchalar/taxta.webp"; }
    return GB_TAXTA.complete && GB_TAXTA.naturalWidth ? GB_TAXTA : null;
  }
  function gbHud() {
    var g = gb && gb.g, t = gbT();
    if (!g) { return; }
    var men = g.me === "b" ? "b" : "a", u = men === "a" ? "b" : "a";
    gb.rang = {};
    gb.rang[men] = gbUyRang(g[men] && g[men].house, false);
    gb.rang[u] = gbUyRang(g[u] && g[u].house, !!(g[u] && g[men] && g[u].house === g[men].house));
    var v2 = g.rule === 2 && g.taken;
    var otdi = function (k) { return v2 ? g.taken[k === "a" ? 0 : 1] : k === "a" ? Math.ceil(g.shots / 2) : Math.floor(g.shots / 2); };
    var yon = function (k, el) {
      var p = g[k];
      el.innerHTML = "";
      el.classList.toggle("faol", g.turn === k && g.state === "ketmoqda");
      el.style.setProperty("--uy", gb.rang[k]);
      var tep = drEl("div", "gb-p-t"), cr = cupCrestImg(p && p.house, 24);
      if (cr) { tep.appendChild(cr); }
      tep.appendChild(drEl("b", "", p ? (g.me && k === g.me ? t.siz : p.name) : "—"));
      el.appendChild(tep);
      var past = drEl("div", "gb-p-b"), sc = drEl("span", "gb-sc");
      sc.appendChild(drEl("i", ""));
      sc.appendChild(drEl("strong", "", String(g.score[k === "a" ? 0 : 1])));
      past.appendChild(sc);
      var pips = drEl("span", "gb-pips"), n = otdi(k), i;
      for (i = 0; i < g.per; i++) { pips.appendChild(drEl("i", i < n ? "on" : "")); }
      if (n > g.per) { pips.appendChild(drEl("em", "", "+" + (n - g.per))); }
      past.appendChild(pips);
      el.appendChild(past);
    };
    yon(men, $("gb-p1"));
    yon(u, $("gb-p2"));
    $("gb-z").textContent = v2 ? (g.state === "ketmoqda" ? t.r2[g.round] || "VS" : "VS") : g.shots >= g.per * 2 && g.state === "ketmoqda" ? t.qoshimcha : "VS";
    // ikki raundli qoida: raund almashganda (zarba manzarasi tugagach) xabar - «2-raund», «Penalti»
    if (v2 && !gb.anim) {
      if (gb.raund != null && g.round > gb.raund && g.state === "ketmoqda") { gbXabar(t.r2X[g.round]); }
      gb.raund = g.round;
    }
    var eb = $("gb-end");
    if (g.kind === "dost" && g.state === "kutmoqda") { gbKutish(); return; }
    if (eb.getAttribute("data-k") === "kut") { eb.setAttribute("data-k", ""); eb.classList.add("hidden"); eb.innerHTML = ""; }      // do'st keldi
    if (g.state === "tugadi" && !(gb.anim)) { gbYakun(); }
  }
  function gbMeni() { var g = gb && gb.g; return g && g.state === "ketmoqda" && g.me && g.turn === g.me && !gb.anim && g.turn_in <= 0.3; }

  // dunyo (doira markazi 0,0; y tepaga) <-> kanvas. Doira (R = 1) taxta rasmidagi runa halqasining ichki chetiga to'g'ri keladi.
  // Taxta rasmida runa halqasining ichki cheti rasm yarim kengligining 0,645 qismida - rasm kattalashtirib chiziladi, doira maydonning 84% ini egallaydi
  var GB_HALQA = 0.645, GB_DOIRA = 0.84;
  function gbKoord() { var w = gb.w; return { cx: w / 2, cy: w / 2, sc: w / 2 * GB_DOIRA }; }
  function gbJoy(s) { var r = (s * Math.PI) / 180; return [Math.cos(r) * (GB_R - GB_OR * 1.2), Math.sin(r) * (GB_R - GB_OR * 1.2)]; }

  function gbKadr(ts) {
    if (!gb) { return; }
    gb.raf = requestAnimationFrame(gbKadr);
    var c = $("gb-canvas"), g2 = c.getContext("2d"), K = gbKoord(), g = gb.g, t = gbT(), i, hozir = performance.now();
    var X = function (x) { return K.cx + x * K.sc; }, Y = function (y) { return K.cy - y * K.sc; };
    var rang = gb.rang || { a: "214,220,230", b: "214,220,230" };
    g2.setTransform(gb.dpr, 0, 0, gb.dpr, 0, 0);
    g2.clearRect(0, 0, gb.w, gb.w);
    // taxta: tosh pol, disk va runa halqasi (rasm); rasm yuklanmaguncha - oddiy doira
    var tx = gbTaxta();
    if (tx) { var ol = gb.w * GB_DOIRA / GB_HALQA; g2.drawImage(tx, (gb.w - ol) / 2, (gb.w - ol) / 2, ol, ol); }
    else {
      g2.fillStyle = "#1b1824"; g2.fillRect(0, 0, gb.w, gb.w);
      g2.beginPath(); g2.arc(K.cx, K.cy, K.sc * GB_R, 0, Math.PI * 2); g2.fillStyle = "#2c3140"; g2.fill();
      g2.lineWidth = 3; g2.strokeStyle = "rgba(243,213,143,.6)"; g2.stroke();
    }
    // doira chegarasi ozgina nurlanadi (chiqish chizig'i aniq ko'rinsin)
    g2.lineWidth = 2; g2.strokeStyle = "rgba(243,213,143," + (0.28 + 0.12 * Math.sin(ts / 600)).toFixed(3) + ")";
    g2.shadowColor = "rgba(243,213,143,.6)"; g2.shadowBlur = 10;
    g2.beginPath(); g2.arc(K.cx, K.cy, K.sc * GB_R, 0, Math.PI * 2); g2.stroke(); g2.shadowBlur = 0;
    // otish yoyi (pastki qism)
    var mening = gbMeni();
    g2.lineCap = "round"; g2.lineWidth = 7; g2.strokeStyle = mening ? "rgba(" + rang[g.me] + ",.32)" : "rgba(226,232,240,.07)";
    g2.beginPath(); g2.arc(K.cx, K.cy, K.sc * (GB_R - GB_OR * 1.2), -GB_JOY[1] * Math.PI / 180, -GB_JOY[0] * Math.PI / 180, false); g2.stroke();      // kanvasda y pastga - burchak teskari
    // marmar tosh: soya, gradient, marmar chizig'i, yaltiroq nuqta
    var tosh = function (x, y, r, rgb, a) {
      var px = X(x), py = Y(y), rr = r * K.sc;
      g2.globalAlpha = a == null ? 1 : a;
      g2.fillStyle = "rgba(0,0,0,.45)";
      g2.beginPath(); g2.ellipse(px + rr * 0.22, py + rr * 0.42, rr * 0.95, rr * 0.62, 0, 0, Math.PI * 2); g2.fill();
      var gr = g2.createRadialGradient(px - rr * 0.35, py - rr * 0.4, rr * 0.08, px, py, rr);
      if (!rgb) { gr.addColorStop(0, "#e9d6ff"); gr.addColorStop(0.45, "#8a5ad0"); gr.addColorStop(1, "#2a1646"); }
      else { gr.addColorStop(0, gbAralash(rgb, 0.75)); gr.addColorStop(0.5, gbAralash(rgb, 0)); gr.addColorStop(1, gbAralash(rgb, -0.6)); }
      g2.fillStyle = gr; g2.beginPath(); g2.arc(px, py, rr, 0, Math.PI * 2); g2.fill();
      g2.lineWidth = Math.max(1, rr * 0.16); g2.strokeStyle = rgb ? "rgba(255,255,255,.3)" : "rgba(235,215,255,.35)";
      g2.beginPath(); g2.arc(px + rr * 0.12, py + rr * 0.1, rr * 0.55, 3.5, 5.3); g2.stroke();
      g2.fillStyle = "rgba(255,255,255,.8)"; g2.beginPath(); g2.arc(px - rr * 0.36, py - rr * 0.4, rr * 0.17, 0, Math.PI * 2); g2.fill();
      g2.lineWidth = 1.4; g2.strokeStyle = "rgba(8,6,14,.85)"; g2.beginPath(); g2.arc(px, py, rr, 0, Math.PI * 2); g2.stroke();
      g2.globalAlpha = 1;
    };
    var men = g && g.me ? g.me : "a";
    if (gb.anim) {
      var an = gb.anim, f = an.ox.f, k = Math.min(f.length - 1, (hozir - an.t0) / an.dt), k0 = Math.floor(k), k1 = Math.min(f.length - 1, k0 + 1), fr = k - k0;
      var otuvchi = rang[an.ox.by] || rang.a, oxirgi = f[0].length - 1;
      an.sp = an.sp || {};
      for (i = 0; i < f[0].length; i++) {
        var ch = an.ox.out ? an.ox.out[i] : null, alfa = 1;
        var x = f[k0][i][0] + (f[k1][i][0] - f[k0][i][0]) * fr, y = f[k0][i][1] + (f[k1][i][1] - f[k0][i][1]) * fr;
        if (ch != null && k > ch) {
          if (i < oxirgi && !an.sp[i]) { an.sp[i] = 1; gb.splash.push({ x: x, y: y, t0: hozir }); }      // toshcha chiqdi - sassiq suyuqlik sachradi
          alfa = Math.max(0, 1 - (k - ch) / 10);
          if (alfa <= 0) { continue; }
        }
        tosh(x, y, i === oxirgi ? GB_OR : GB_TR, i === oxirgi ? otuvchi : null, alfa);
      }
      if (k >= f.length - 1 && !an.tugadi) {
        an.tugadi = true;
        if (!an.ox.skip) { gbXabar(t.chiqdi(an.ox.ball || 0)); }
        if (an.ox.ball > 0) { try { if (tg && tg.HapticFeedback) { tg.HapticFeedback.notificationOccurred(an.ox.by === men ? "success" : "warning"); } } catch (e) {} }
        setTimeout(function () { if (gb && gb.anim === an) { gb.anim = null; gbHud(); } }, 500);
      }
    } else if (g) {
      (g.stones || []).forEach(function (s2) { tosh(s2[0], s2[1], GB_TR, null); });
      if (mening) {
        var p = gbJoy(gb.s), mr = rang[g.me];
        if (gb.tutish === "ot" && gb.b0) {
          // bekor qilish joyi: barmoq tekkan nuqta - shu yerga qaytarilsa zarba bo'lmaydi
          var bx = X(gb.b0[0]), by = Y(gb.b0[1]), bekor = !gb.aim || gb.aim.p < GB_BEKOR;
          g2.setLineDash([4, 4]); g2.lineWidth = 2; g2.strokeStyle = bekor ? "rgba(240,101,90,.9)" : "rgba(255,255,255,.45)";
          g2.beginPath(); g2.arc(bx, by, 16, 0, Math.PI * 2); g2.stroke(); g2.setLineDash([]);
          g2.lineWidth = 2.5; g2.beginPath(); g2.moveTo(bx - 6, by - 6); g2.lineTo(bx + 6, by + 6); g2.moveTo(bx + 6, by - 6); g2.lineTo(bx - 6, by + 6); g2.stroke();
        }
        if (gb.aim && gb.aim.p >= GB_BEKOR) {
          var ar = gb.aim.a * Math.PI / 180, uz = 0.22 + gb.aim.p * 0.6, ux = Math.cos(ar), uy = Math.sin(ar);
          // orqaga tortilgan «rezina»
          g2.lineWidth = 2; g2.strokeStyle = "rgba(255,255,255,.35)";
          g2.beginPath(); g2.moveTo(X(p[0]), Y(p[1])); g2.lineTo(X(p[0] - ux * gb.aim.p * 0.45), Y(p[1] - uy * gb.aim.p * 0.45)); g2.stroke();
          // yo'nalish chizig'i va o'q uchi
          var ex = p[0] + ux * uz, ey = p[1] + uy * uz;
          g2.setLineDash([4, 6]); g2.lineWidth = 3; g2.strokeStyle = "rgba(255,255,255," + (0.55 + gb.aim.p * 0.4).toFixed(2) + ")";
          g2.beginPath(); g2.moveTo(X(p[0] + ux * GB_OR * 1.4), Y(p[1] + uy * GB_OR * 1.4)); g2.lineTo(X(ex), Y(ey)); g2.stroke(); g2.setLineDash([]);
          g2.fillStyle = "rgba(255,255,255,.9)";
          g2.beginPath(); g2.moveTo(X(ex + ux * 0.06), Y(ey + uy * 0.06));
          g2.lineTo(X(ex - uy * 0.035), Y(ey + ux * 0.035)); g2.lineTo(X(ex + uy * 0.035), Y(ey - ux * 0.035)); g2.closePath(); g2.fill();
        }
        tosh(p[0], p[1], GB_OR, mr);
        // kuch halqasi (tosh atrofida) yoki - nishonga olinmaganda - suriladigan joy belgisi
        var rr2 = GB_OR * K.sc + 7;
        if (gb.aim && gb.aim.p >= GB_BEKOR) {
          var kk = gb.aim.p, rgbK = kk < 0.5 ? "143,240,182" : kk < 0.8 ? "243,213,143" : "240,101,90";
          g2.lineWidth = 4; g2.strokeStyle = "rgba(255,255,255,.12)"; g2.beginPath(); g2.arc(X(p[0]), Y(p[1]), rr2, 0, Math.PI * 2); g2.stroke();
          g2.strokeStyle = "rgb(" + rgbK + ")"; g2.shadowColor = "rgba(" + rgbK + ",.8)"; g2.shadowBlur = 8;
          g2.beginPath(); g2.arc(X(p[0]), Y(p[1]), rr2, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * kk); g2.stroke(); g2.shadowBlur = 0;
        } else {
          g2.lineWidth = 2; g2.strokeStyle = "rgba(255,255,255," + (0.35 + 0.25 * Math.sin(ts / 220)).toFixed(2) + ")";
          g2.beginPath(); g2.arc(X(p[0]), Y(p[1]), rr2, 0, Math.PI * 2); g2.stroke();
          [-1, 1].forEach(function (yo) {                       // yoy bo'ylab surish mumkinligini ko'rsatuvchi o'qchalar
            var sa = (gb.s + yo * 13) * Math.PI / 180, rad = GB_R - GB_OR * 1.2, qx = Math.cos(sa) * rad, qy = Math.sin(sa) * rad;
            var tx2 = -Math.sin(sa) * yo, ty2 = Math.cos(sa) * yo;
            g2.fillStyle = "rgba(255,255,255,.55)";
            g2.beginPath(); g2.moveTo(X(qx + tx2 * 0.05), Y(qy + ty2 * 0.05));
            g2.lineTo(X(qx - ty2 * 0.03), Y(qy + tx2 * 0.03)); g2.lineTo(X(qx + ty2 * 0.03), Y(qy - tx2 * 0.03)); g2.closePath(); g2.fill();
          });
        }
      }
    }
    // sachragan sassiq suyuqlik (yashil-binafsha tomchilar)
    gb.splash = gb.splash.filter(function (sp) { return hozir - sp.t0 < 800; });
    gb.splash.forEach(function (sp) {
      var q = (hozir - sp.t0) / 800, j;
      for (j = 0; j < 9; j++) {
        var bur = j / 9 * Math.PI * 2 + sp.x * 7, mas = 0.04 + q * 0.2 * (0.6 + (j % 3) * 0.25);
        g2.globalAlpha = Math.max(0, 1 - q);
        g2.fillStyle = j % 2 ? "rgba(150,230,90,.95)" : "rgba(170,110,230,.95)";
        g2.beginPath(); g2.arc(X(sp.x + Math.cos(bur) * mas), Y(sp.y + Math.sin(bur) * mas), (1 - q) * 4 + 1.5, 0, Math.PI * 2); g2.fill();
      }
      g2.globalAlpha = 1;
    });
    // xabar
    if (gb.xabar && hozir - gb.xabar.t < 1800) {
      g2.globalAlpha = Math.min(1, (1800 - (hozir - gb.xabar.t)) / 500);
      g2.font = "800 19px Manrope, sans-serif"; g2.textAlign = "center"; g2.textBaseline = "middle";
      g2.lineWidth = 5; g2.lineJoin = "round"; g2.strokeStyle = "rgba(8,10,16,.9)"; g2.strokeText(gb.xabar.m, K.cx, gb.w * 0.2);
      g2.fillStyle = "#f3d58f"; g2.fillText(gb.xabar.m, K.cx, gb.w * 0.2); g2.globalAlpha = 1;
    }
    // navbat matni va vaqt
    var h = $("gb-h"), vq = $("gb-v");
    if (g && h) {
      if (g.kind === "dost" && g.state === "kutmoqda") { h.textContent = ""; }
      else if (g.state === "kutmoqda" || (g.state === "ketmoqda" && g.turn_in > 0.5 && !gb.anim && g.shots === 0)) { h.textContent = t.boshlanadi(Math.ceil(Math.max(g.turn_in || g.starts_in || 0, 0))); }
      else if (g.state !== "ketmoqda" || gb.anim) { h.textContent = ""; }
      else if (mening) { h.textContent = !gb.aim ? t.otH : gb.aim.p < GB_BEKOR ? t.bekorH : t.kuch + " " + Math.round(gb.aim.p * 100) + "% · " + t.qaytH; }
      else if (g.me && g.turn === g.me) { h.textContent = t.kut; }
      else { h.textContent = t.navbatR(g[g.turn] ? g[g.turn].name : ""); }
      if (vq) {
        vq.style.width = (g.state === "ketmoqda" && !gb.anim ? Math.max(0, Math.min(100, (g.turn_left || 0) / 30 * 100)) : 0) + "%";
        vq.style.background = g.turn && rang[g.turn] ? "rgb(" + rang[g.turn] + ")" : "";
      }
    }
  }

  // Barmoq: tosh ustidan boshlansa - joyni yoy bo'ylab suradi; boshqa joydan - orqaga tortib otadi (rogatka)
  function gbBarmoq(e, bosqich) {
    if (!gb || !gbMeni()) { return; }
    var c = $("gb-canvas"), r = c.getBoundingClientRect(), K = gbKoord();
    var tch = e.touches && e.touches[0] ? e.touches[0] : (e.changedTouches && e.changedTouches[0]) || e;
    var x = (tch.clientX - r.left - K.cx) / K.sc, y = -(tch.clientY - r.top - K.cy) / K.sc;
    if (bosqich === "bosh" && e.touches && e.touches.length > 1 && gb.tutish === "ot") {
      // ikkinchi barmoq tegsa - nishonga olish bekor (egasi, 2026-10-14: «kuch berishni boshlagach, ortga qaytarolmayapman»)
      gb.tutish = null; gb.aim = null; gbXabar(gbT().bekorX);
      if (e.cancelable) { e.preventDefault(); }
      return;
    }
    if (bosqich === "bosh") {
      var p = gbJoy(gb.s);
      gb.tutish = Math.hypot(x - p[0], y - p[1]) < 0.17 ? "joy" : "ot";
      gb.b0 = [x, y];
      gb.aim = null;
    } else if (bosqich === "yur" && gb.tutish) {
      if (gb.tutish === "joy") {
        var s = Math.atan2(y, x) * 180 / Math.PI;
        gb.s = Math.max(GB_JOY[0], Math.min(GB_JOY[1], s));
      } else {
        var dx = gb.b0[0] - x, dy = gb.b0[1] - y, l = Math.hypot(dx, dy);
        gb.aim = { a: Math.atan2(dy, dx) * 180 / Math.PI, p: Math.max(0, Math.min(1, l / 0.9)) };
      }
    } else if (bosqich === "tug") {
      // barmoq boshlang'ich joyiga (✕) qaytarilsa yoki deyarli tortilmagan bo'lsa - zarba bekor; keyin joyni bemalol o'zgartirsa bo'ladi
      if (gb.tutish === "ot" && gb.aim && gb.aim.p >= GB_BEKOR) { gbOt(gb.aim); }
      else if (gb.tutish === "ot" && gb.aim && gb.aim.p > 0.02) { gbXabar(gbT().bekorX); }
      gb.tutish = null;
      gb.aim = null;
    }
    if (e.cancelable) { e.preventDefault(); }
  }
  function gbOt(aim) {
    var me = gb, shot = { s: gb.s, a: aim.a, p: aim.p };
    try { if (tg && tg.HapticFeedback) { tg.HapticFeedback.impactOccurred("medium"); } } catch (e) {}
    gb.g.turn = null;             // qayta otib bo'lmasin (javob kelguncha)
    gbPost({ oyin: gb.id, shot: shot, seen: gb.seen == null ? -1 : gb.seen }, function (res) {
      if (gb !== me) { return; }
      if (res && res.game) { gbQabul(res.game); }
      if (!res || res.shot_ok === false) { showToast(gbT().aloqa, "err"); }
    });
  }

  function gbYakun() {
    var g = gb.g, t = gbT(), box = $("gb-end");
    if (!box.classList.contains("hidden")) { return; }
    box.innerHTML = "";
    box.classList.remove("hidden");
    var men = g.me || "a", u = men === "a" ? "b" : "a", yutdi = g.me && g.winner === g.me, yutqazdi = g.me && g.winner && g.winner !== g.me;
    var k = drEl("div", "gb-e-k" + (yutdi ? " g" : yutqazdi ? " m" : ""));
    k.appendChild(drEl("small", "gb-e-kick", yutdi ? t.galaba : yutqazdi ? t.maglub : t.yakunK));
    k.appendChild(drEl("b", "gb-e-t", yutdi ? t.yutdi : yutqazdi ? t.yutqazdi : g.winner ? t.golibi(g[g.winner].name) : t.durang));
    var vs = drEl("div", "gb-e-vs");
    var oyinchi = function (yon) {
      var p = g[yon], d = drEl("div", "gb-e-o" + (g.winner === yon ? " yut" : g.winner ? " sep" : ""));
      d.style.setProperty("--uy", (gb.rang && gb.rang[yon]) || "214,220,230");
      var gerb = drEl("span", "gb-e-g"), cr = cupCrestImg(p && p.house, 58);
      if (cr) { gerb.appendChild(cr); }
      if (g.winner && g.winner !== yon) { for (var i = 0; i < 6; i++) { gerb.appendChild(drEl("i", "gb-dog d" + i)); } }      // sassiq suyuqlik dog'lari
      if (g.winner === yon) { gerb.appendChild(drEl("u", "gb-toj", "✦")); }
      d.appendChild(gerb);
      d.appendChild(drEl("b", "", p ? (g.me && yon === g.me ? t.siz : p.name) : "—"));
      d.appendChild(drEl("strong", "", String(g.score[yon === "a" ? 0 : 1])));
      return d;
    };
    vs.appendChild(oyinchi(men));
    vs.appendChild(drEl("span", "gb-e-x", ":"));
    vs.appendChild(oyinchi(u));
    k.appendChild(vs);
    if (g.why === "kelmadi") { k.appendChild(drEl("p", "", t.kelmadi)); }
    else if (g.why === "teng") { k.appendChild(drEl("p", "", t.teng)); }
    if (g.winner) { k.appendChild(drEl("p", "gb-e-sep", yutqazdi ? t.sepSiz : t.sepdi(g[g.winner === "a" ? "b" : "a"].name))); }
    var tug = drEl("div", "gb-e-b");
    if (g.kind === "dost" && g.me) {
      var dy = drEl("button", "dr-btn", t.yana);
      dy.type = "button";
      dy.addEventListener("click", function () { tkOyna("tosh"); });
      tug.appendChild(dy);
    }
    if ((g.kind === "mashq" || g.kind === "sinov") && g.b && g.b.bot) {
      var y = drEl("button", "dr-btn", t.yana);
      y.type = "button";
      y.addEventListener("click", function () { gbBoshla(g.kind === "sinov" ? { sinov: 1 } : { mashq: g.b.bot }); });
      tug.appendChild(y);
    }
    var o = drEl("button", "dr-btn gb-ikki", t.ortga);
    o.type = "button";
    o.addEventListener("click", function () { gbStop(); gbKorsat(); });
    tug.appendChild(o);
    k.appendChild(tug);
    box.appendChild(k);
    if (yutdi) { try { if (tg && tg.HapticFeedback) { tg.HapticFeedback.notificationOccurred("success"); } } catch (e) {} }
  }

  function gbInfo() {
    var eski = $("du-info"), t = gbT(), r = (gbData && gbData.rules) || {}, pt = r.points || {};
    if (eski) { eski.parentNode.removeChild(eski); }
    var nT = r.v2 ? (r.rstones || 6) : (r.stones || 9);
    var bandlar = lang === "ru" ? [
      ["Игра", "В центре круга лежат " + nT + " камешков. По очереди вы бьёте своим камнем с края круга. Каждый камешек, вылетевший за круг, — ваше очко."],
      ["Как бить", "Сначала передвиньте свой камень по нижней дуге — выберите место. Затем оттяните палец на поле в обратную сторону и отпустите: чем дальше оттянули, тем сильнее удар."],
      r.v2 ? t.infoV2(r.rstones || 6, r.rshots || 3, r.turn || 30) : ["Сколько ударов", "У каждого по " + (r.shots || 5) + " ударов. Ничья — ещё до " + (r.extra || 3) + " пар ударов. Время на удар — " + (r.turn || 30) + " секунд, иначе удар сгорает."],
      ["Тренировка", "Три соперника-компьютера: Невилл (легко), Рон (средне), Джордж Уизли (сложно). Очков не дают."],
      ["Турнир", "Каждый вторник в 22:00. Нажмите «Участвую». Сетка, как в дуэли и шахматах; чаще побеждавшие на тренировке получают место выше."],
      ["Очки", "За победу: 1/8 финала +" + (pt["16"] || 5) + ", четвертьфинал +" + (pt["8"] || 10) + ", полуфинал +" + (pt["4"] || 20) + ", финал +" + (pt["2"] || 30) + "."],
      ["Как в книге", "Проигравшего камешки обрызгивают вонючей жидкостью."]]
      : lang === "en" ? [
      ["The game", nT + " stones lie in the middle of the ring. Taking turns, you shoot your own stone from the edge of the ring. Every stone knocked out of the ring is a point for you."],
      ["How to shoot", "First slide your stone along the lower arc to choose a spot. Then pull your finger back on the field and let go: the further you pull, the harder the shot."],
      r.v2 ? t.infoV2(r.rstones || 6, r.rshots || 3, r.turn || 30) : ["How many shots", (r.shots || 5) + " shots each. On a tie — up to " + (r.extra || 3) + " extra pairs. " + (r.turn || 30) + " seconds per shot, or it is lost."],
      ["Practice", "Three computer rivals: Neville (easy), Ron (medium), George Weasley (hard). No points."],
      ["Tournament", "Every Tuesday at 22:00. Tap “I'm in”. A bracket like in duels and chess; those who won more practice games are seeded higher."],
      ["Points", "For a win: round of 16 +" + (pt["16"] || 5) + ", quarter-final +" + (pt["8"] || 10) + ", semi-final +" + (pt["4"] || 20) + ", final +" + (pt["2"] || 30) + "."],
      ["Like in the books", "The loser gets squirted with stinky liquid by the stones."]]
      : [
      ["O'yin", "Doiraning o'rtasida " + nT + " ta toshcha turadi. Navbat bilan o'z toshingizni doira chetidan otasiz. Doiradan chiqib ketgan har bir toshcha — sizga ochko."],
      ["Qanday otiladi", "Avval toshingizni pastki yoy bo'ylab surib, joy tanlang. Keyin maydonda barmoqni orqaga torting va qo'yib yuboring: qancha uzoq tortsangiz, zarba shuncha kuchli."],
      r.v2 ? t.infoV2(r.rstones || 6, r.rshots || 3, r.turn || 30) : ["Nechta zarba", "Har kimga " + (r.shots || 5) + " tadan zarba. Teng bo'lsa — yana " + (r.extra || 3) + " juftgacha qo'shimcha zarba. Har zarbaga " + (r.turn || 30) + " soniya, ulgurmasangiz zarba yonib ketadi."],
      ["Mashq", "Uchta kompyuter raqib: Nevill (oson), Ron (o'rta), Jorj Uizli (qiyin). Ball berilmaydi."],
      ["Turnir", "Har seshanba 22:00 da. «Qatnashaman»ni bosing. To'r duel va shaxmatdagidek; mashqda ko'p yutganlar to'rda yuqoriroq turadi."],
      ["Ballar", "G'alaba uchun: 1/8 final +" + (pt["16"] || 5) + ", chorak final +" + (pt["8"] || 10) + ", yarim final +" + (pt["4"] || 20) + ", final +" + (pt["2"] || 30) + "."],
      ["Asardagidek", "Yutqazganga toshchalar sassiq suyuqlik sepadi."]];
    var orqa = drEl("div", "du-info"), oyna = drEl("div", "du-info-p"), yop = function () { if (orqa.parentNode) { orqa.parentNode.removeChild(orqa); } };
    orqa.id = "du-info";
    var bosh = drEl("div", "du-info-h");
    bosh.appendChild(drEl("b", "", t.ttl));
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

  function gbSetup() {
    $("gb-back").addEventListener("click", function () {
      if (gb) { gbStop(); gbKorsat(); return; }
      if (gbKor === "tarix") { gbKor = "home"; gbKorsat(); return; }
      gbYop();
    });
    $("gb-info-b").addEventListener("click", gbInfo);
    var c = $("gb-canvas");
    c.addEventListener("touchstart", function (e) { gbBarmoq(e, "bosh"); }, { passive: false });
    c.addEventListener("touchmove", function (e) { gbBarmoq(e, "yur"); }, { passive: false });
    c.addEventListener("touchend", function (e) { gbBarmoq(e, "tug"); }, { passive: false });
    c.addEventListener("mousedown", function (e) { gbBarmoq(e, "bosh"); });
    window.addEventListener("mousemove", function (e) { if (gb && gb.tutish) { gbBarmoq(e, "yur"); } });
    window.addEventListener("mouseup", function (e) { if (gb && gb.tutish) { gbBarmoq(e, "tug"); } });
  }

  gbSetup();
