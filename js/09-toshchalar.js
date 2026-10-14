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
          joyH: "Toshni yoy bo'ylab suring — joyni tanlang", otH: "Maydonda barmoqni orqaga torting va qo'yib yuboring", kuch: "Kuch", zarba: function (a, b) { return a + " / " + b + " zarba"; },
          chiqdi: function (n) { return n > 0 ? "+" + n + " toshcha!" : "Toshcha chiqmadi"; }, otkazdi: "Zarba yonib ketdi — vaqt tugadi",
          yutdi: "Siz yutdingiz!", yutqazdi: "Siz yutqazdingiz", durang: "Durang", golibi: function (n) { return n + " yutdi"; }, sepdi: function (n) { return "Toshchalar " + n + "ga sassiq suyuqlik sepdi!"; }, sepSiz: "Toshchalar sizga sassiq suyuqlik sepdi!",
          kelmadi: "Raqib kelmadi", teng: "Teng — to'rda yuqori turgan o'tdi", yana: "Yana o'ynash", ortga: "Ortga", aloqa: "Aloqa yo'q — qayta urinib ko'ring",
          qoshimcha: "Teng! Qo'shimcha zarbalar" },
    ru: { kick: "Турнир вторника", ttl: "Плюй-камни", nom: "Турнир по плюй-камням", kunlar: ["воскресенье", "понедельник", "вторник", "среда", "четверг", "пятница", "суббота"],
          qoldi: "осталось", soni: function (n) { return "Записалось: " + n; }, qat: "Участвую", bor: "Вы записаны — сова напомнит", chiq: "Выйти",
          yopiq: "Запись закрыта", q1: "Выбивайте камешки из круга своим камнем", q2: "Место, направление и силу выбираете сами",
          q3: function (z) { return "У каждого " + z + " ударов — кто выбьет больше, тот победил"; },
          mashq: "Тренировка", mashqS: "С компьютером, без очков", daraja: ["Легко", "Средне", "Сложно"], stat: function (a, b) { return "Игр: " + a + " · побед: " + b; },
          tor: "Сетка турнира", bosq: { 2: "Финал", 4: "Полуфинал", 8: "Четвертьфинал", 16: "1/8 финала", 32: "1/16 финала" }, jonli: "LIVE", kutadi: "ждёт",
          kor: "Смотреть", ball: function (p) { return "за победу +" + p; }, sinov: "Тестовая игра", sinovS: "Только для админа · с компьютером, как в турнире",
          siz: "Вы", navbat: "Ваш ход", navbatR: function (n) { return n + " бьёт…"; }, kut: "Ждите…", boshlanadi: function (s) { return "Игра начнётся через " + s + " с"; },
          joyH: "Двигайте камень по дуге — выберите место", otH: "Оттяните палец на поле и отпустите", kuch: "Сила", zarba: function (a, b) { return "Удар " + a + " из " + b; },
          chiqdi: function (n) { return n > 0 ? "+" + n + "!" : "Мимо"; }, otkazdi: "Удар сгорел — время вышло",
          yutdi: "Вы победили!", yutqazdi: "Вы проиграли", durang: "Ничья", golibi: function (n) { return "Победил " + n; }, sepdi: function (n) { return "Камни обрызгали " + n + " вонючей жидкостью!"; }, sepSiz: "Камни обрызгали вас вонючей жидкостью!",
          kelmadi: "Соперник не пришёл", teng: "Ничья — прошёл тот, кто выше в сетке", yana: "Ещё раз", ortga: "Назад", aloqa: "Нет связи — попробуйте ещё раз",
          qoshimcha: "Ничья! Дополнительные удары" },
    en: { kick: "Tuesday tournament", ttl: "Gobstones", nom: "Gobstones tournament", kunlar: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
          qoldi: "left", soni: function (n) { return n + " signed up"; }, qat: "I'm in", bor: "You are signed up — an owl will remind you", chiq: "Leave",
          yopiq: "Sign-up closed", q1: "Knock the stones out of the ring with your own stone", q2: "You choose the spot, the direction and the power",
          q3: function (z) { return z + " shots each — whoever knocks out more wins"; },
          mashq: "Practice", mashqS: "Against the computer, no points", daraja: ["Easy", "Medium", "Hard"], stat: function (a, b) { return a + " games · " + b + " wins"; },
          tor: "Tournament bracket", bosq: { 2: "Final", 4: "Semi-final", 8: "Quarter-final", 16: "Round of 16", 32: "Round of 32" }, jonli: "LIVE", kutadi: "waiting",
          kor: "Watch", ball: function (p) { return "+" + p + " for a win"; }, sinov: "Test game", sinovS: "Admin only · against the computer, tournament flow",
          siz: "You", navbat: "Your turn", navbatR: function (n) { return n + " is shooting…"; }, kut: "Wait…", boshlanadi: function (s) { return "The game starts in " + s + " s"; },
          joyH: "Slide your stone along the arc to pick a spot", otH: "Pull your finger back on the field and let go", kuch: "Power", zarba: function (a, b) { return "Shot " + a + " of " + b; },
          chiqdi: function (n) { return n > 0 ? "+" + n + "!" : "No stone out"; }, otkazdi: "Shot lost — time ran out",
          yutdi: "You won!", yutqazdi: "You lost", durang: "Draw", golibi: function (n) { return n + " won"; }, sepdi: function (n) { return "The Gobstones squirted " + n + " with stinky liquid!"; }, sepSiz: "The Gobstones squirted you with stinky liquid!",
          kelmadi: "The opponent did not come", teng: "Tie — the higher seed goes through", yana: "Play again", ortga: "Back", aloqa: "No connection — please try again",
          qoshimcha: "Tie! Extra shots" }
  };
  function gbT() { return GB_T[lang] || GB_T.uz; }

  // Server bilan bir xil o'lchamlar (hptosh.py)
  var GB_R = 1.0, GB_TR = 0.058, GB_OR = 0.068, GB_JOY = [-150, -30];
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
    gbKorsat();
  }
  function gbKorsat() {
    drShowGame("scr-tosh");
    $("gb-kick").textContent = gbT().kick;
    $("gb-ttl").textContent = gbT().ttl;
    $("gb-home").classList.remove("hidden");
    $("gb-game").classList.add("hidden");
    $("gb-info-b").classList.remove("hidden");
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
  function gbRender() {
    var d = gbData, t = gbT(), box = $("gb-home");
    box.innerHTML = "";
    clearInterval(gbSoat);
    if (!d) { return; }
    var tr = d.tour, hero = drEl("div", "dr-hero du-hero vk-hero gb-hero"), tep = drEl("div", "du-h-t"), chap = drEl("span", "du-h-m");
    chap.appendChild(drEl("small", "", t.nom));
    var kun = t.kunlar[new Date((tr.ts + 5 * 3600) * 1000).getUTCDay()];
    chap.appendChild(drEl("b", "", kun.charAt(0).toUpperCase() + kun.slice(1) + ", 22:00"));
    var iz = drEl("em", "", "");
    chap.appendChild(iz);
    tep.appendChild(chap);
    hero.appendChild(tep);
    var yoz = function () { var q = tr.ts - tr.now - (Date.now() - gbOlingan) / 1000; iz.textContent = (q > 0 ? gbQol(q) + " " + t.qoldi + " · " : "") + t.soni(tr.n); };
    yoz();
    gbSoat = setInterval(yoz, 1000);
    var yb = drEl("div", "du-yoz" + (tr.joined ? " bor" : ""));
    if (!tr.open) { yb.classList.add("bor"); yb.appendChild(drEl("b", "", tr.joined ? t.bor : t.yopiq)); }
    else if (tr.joined) {
      yb.appendChild(drEl("b", "", t.bor));
      var ch = drEl("button", "", t.chiq);
      ch.type = "button";
      ch.addEventListener("click", function () { gbPost({ join: 0 }, function (r) { if (r && r.tour) { gbData = r; gbRender(); } }); });
      yb.appendChild(ch);
    } else {
      var qb = drEl("button", "dr-btn", t.qat);
      qb.type = "button";
      qb.addEventListener("click", function () { gbPost({ join: 1 }, function (r) { if (r && r.tour) { gbData = r; gbRender(); } else { showToast(t.aloqa, "err"); } }); });
      yb.appendChild(qb);
    }
    hero.appendChild(yb);
    box.appendChild(hero);
    // to'r (turnir paytida)
    if (d.cup && d.cup.stages) { box.appendChild(gbTor(d.cup.stages)); }
    // mashq: uchta kompyuter raqib
    var mq = drEl("div", "gb-mq");
    var mh = drEl("div", "dk-bosh");
    mh.appendChild(drEl("b", "", t.mashq));
    mh.appendChild(drEl("span", "", t.mashqS + (d.stats && d.stats.played ? " · " + t.stat(d.stats.played, d.stats.won) : "")));
    mq.appendChild(mh);
    var qator = drEl("div", "gb-bots");
    [1, 2, 3].forEach(function (k) {
      var b = drEl("button", "gb-bot gb-b" + k);
      b.type = "button";
      var tosh = drEl("span", "gb-bot-t");
      b.appendChild(tosh);
      b.appendChild(drEl("b", "", (d.rules && d.rules.bots && d.rules.bots[String(k)]) || GB_BOT[k - 1]));
      b.appendChild(drEl("small", "", t.daraja[k - 1]));
      b.addEventListener("click", function () { gbBoshla({ mashq: k }); });
      qator.appendChild(b);
    });
    mq.appendChild(qator);
    box.appendChild(mq);
    var gk = golibKarta(d.champs);
    if (gk) { box.appendChild(gk); }
    var q = drEl("div", "vk-qoida");
    [t.q1, t.q2, t.q3((d.rules && d.rules.shots) || 5)].forEach(function (m, i) {
      var r = drEl("div", "vk-q");
      r.appendChild(drEl("u", "", String(i + 1)));
      r.appendChild(drEl("span", "", m));
      q.appendChild(r);
    });
    box.appendChild(q);
    if (d.admin) {
      var sb = drEl("button", "pg-mashq pg-sinov");
      sb.type = "button";
      var sm = drEl("span", "");
      sm.appendChild(drEl("b", "", t.sinov));
      sm.appendChild(drEl("small", "", t.sinovS));
      sb.appendChild(sm);
      sb.appendChild(drEl("i", "", "›"));
      sb.addEventListener("click", function () { gbBoshla({ sinov: 1 }); });
      box.appendChild(sb);
    }
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
  function gbBoshla(body) {
    gbPost(body, function (res) {
      if (!res || !res.game) { showToast(gbT().aloqa, "err"); return; }
      gbOyin(res.game.id, res.game);
    });
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
  function gbHud() {
    var g = gb && gb.g, t = gbT();
    if (!g) { return; }
    var yon = function (p, sc, el, faol) {
      el.innerHTML = "";
      el.classList.toggle("faol", !!faol);
      var cr = cupCrestImg(p && p.house, 20);
      if (cr) { el.appendChild(cr); }
      el.appendChild(drEl("b", "", p ? (g.me && p === g[g.me] ? t.siz : p.name) : "—"));
      el.appendChild(drEl("strong", "", String(sc)));
    };
    var men = g.me === "b" ? "b" : "a", u = men === "a" ? "b" : "a";
    yon(g[men], g.score[men === "a" ? 0 : 1], $("gb-p1"), g.turn === men && g.state === "ketmoqda");
    yon(g[u], g.score[u === "a" ? 0 : 1], $("gb-p2"), g.turn === u && g.state === "ketmoqda");
    var jami = g.per * 2, n = Math.min(g.shots + 1, Math.max(jami, g.shots + 1));
    $("gb-z").textContent = g.shots >= jami && g.state === "ketmoqda" ? t.qoshimcha : t.zarba(Math.min(n, jami), jami);
    if (g.state === "tugadi" && !(gb.anim)) { gbYakun(); }
  }
  function gbMeni() { var g = gb && gb.g; return g && g.state === "ketmoqda" && g.me && g.turn === g.me && !gb.anim && g.turn_in <= 0.3; }

  // dunyo (doira markazi 0,0; y tepaga) <-> kanvas
  function gbKoord() { var w = gb.w, sc = w / 2 / 1.13; return { cx: w / 2, cy: w / 2, sc: sc }; }
  function gbJoy(s) { var r = (s * Math.PI) / 180; return [Math.cos(r) * (GB_R - GB_OR * 1.2), Math.sin(r) * (GB_R - GB_OR * 1.2)]; }

  function gbKadr(ts) {
    if (!gb) { return; }
    gb.raf = requestAnimationFrame(gbKadr);
    var c = $("gb-canvas"), g2 = c.getContext("2d"), K = gbKoord(), g = gb.g, t = gbT(), i;
    var X = function (x) { return K.cx + x * K.sc; }, Y = function (y) { return K.cy - y * K.sc; };
    g2.setTransform(gb.dpr, 0, 0, gb.dpr, 0, 0);
    g2.clearRect(0, 0, gb.w, gb.w);
    // maydon: tosh pol, doira, runa halqasi
    var bg = g2.createRadialGradient(K.cx, K.cy, K.sc * 0.2, K.cx, K.cy, K.sc * 1.2);
    bg.addColorStop(0, "#2a2733"); bg.addColorStop(1, "#121118");
    g2.fillStyle = bg; g2.fillRect(0, 0, gb.w, gb.w);
    g2.beginPath(); g2.arc(K.cx, K.cy, K.sc * GB_R, 0, Math.PI * 2);
    var pol = g2.createRadialGradient(K.cx, K.cy, 0, K.cx, K.cy, K.sc);
    pol.addColorStop(0, "#3b3646"); pol.addColorStop(1, "#24212c");
    g2.fillStyle = pol; g2.fill();
    g2.lineWidth = 4; g2.strokeStyle = "rgba(243,213,143,.55)"; g2.shadowColor = "rgba(243,213,143,.45)"; g2.shadowBlur = 14; g2.stroke(); g2.shadowBlur = 0;
    g2.setLineDash([3, 7]); g2.lineWidth = 1.5; g2.strokeStyle = "rgba(226,232,240,.18)";
    g2.beginPath(); g2.arc(K.cx, K.cy, K.sc * 0.62, 0, Math.PI * 2); g2.stroke(); g2.setLineDash([]);
    // otish yoyi (pastki qism)
    g2.lineWidth = 6; g2.strokeStyle = "rgba(226,232,240,.08)";
    g2.beginPath(); g2.arc(K.cx, K.cy, K.sc * (GB_R - GB_OR * 1.2), -GB_JOY[1] * Math.PI / 180, -GB_JOY[0] * Math.PI / 180, false); g2.stroke();      // kanvasda y pastga - burchak teskari
    var tosh = function (x, y, r, tur, a) {
      g2.globalAlpha = a == null ? 1 : a;
      var gr = g2.createRadialGradient(X(x) - r * K.sc * 0.35, Y(y) - r * K.sc * 0.35, r * K.sc * 0.1, X(x), Y(y), r * K.sc);
      if (tur === "t") { gr.addColorStop(0, "#d7b8ff"); gr.addColorStop(0.5, "#7b4fc0"); gr.addColorStop(1, "#2c1a4a"); }
      else if (tur === "men") { gr.addColorStop(0, "#ffffff"); gr.addColorStop(0.5, "#c9d1dc"); gr.addColorStop(1, "#5c6573"); }
      else { gr.addColorStop(0, "#ffe6a8"); gr.addColorStop(0.5, "#c8923a"); gr.addColorStop(1, "#5a3a10"); }
      g2.fillStyle = gr; g2.beginPath(); g2.arc(X(x), Y(y), r * K.sc, 0, Math.PI * 2); g2.fill();
      g2.lineWidth = 1.5; g2.strokeStyle = "rgba(8,8,12,.8)"; g2.stroke();
      g2.globalAlpha = 1;
    };
    var men = g && g.me ? g.me : "a";
    if (gb.anim) {
      var an = gb.anim, f = an.ox.f, k = Math.min(f.length - 1, (performance.now() - an.t0) / an.dt), k0 = Math.floor(k), k1 = Math.min(f.length - 1, k0 + 1), fr = k - k0;
      var otuvchi = an.ox.by === men ? "men" : "u";
      for (i = 0; i < f[0].length; i++) {
        var ch = an.ox.out ? an.ox.out[i] : null, alfa = 1;
        if (ch != null && k > ch) { alfa = Math.max(0, 1 - (k - ch) / 14); if (alfa <= 0) { continue; } }
        var x = f[k0][i][0] + (f[k1][i][0] - f[k0][i][0]) * fr, y = f[k0][i][1] + (f[k1][i][1] - f[k0][i][1]) * fr;
        tosh(x, y, i === f[0].length - 1 ? GB_OR : GB_TR, i === f[0].length - 1 ? otuvchi : "t", alfa);
      }
      if (k >= f.length - 1 && !an.tugadi) {
        an.tugadi = true;
        if (!an.ox.skip) { gbXabar(t.chiqdi(an.ox.ball || 0)); }
        if (an.ox.ball > 0) { try { if (tg && tg.HapticFeedback) { tg.HapticFeedback.notificationOccurred(an.ox.by === men ? "success" : "warning"); } } catch (e) {} }
        setTimeout(function () { if (gb && gb.anim === an) { gb.anim = null; gbHud(); } }, 500);
      }
    } else if (g) {
      (g.stones || []).forEach(function (s) { tosh(s[0], s[1], GB_TR, "t"); });
      if (gbMeni()) {
        var p = gbJoy(gb.s);
        // nishon chizig'i (qisqa) va kuch
        if (gb.aim && gb.aim.p > 0.03) {
          var ar = gb.aim.a * Math.PI / 180, uz = 0.25 + gb.aim.p * 0.55;
          g2.setLineDash([5, 6]); g2.lineWidth = 2.5; g2.strokeStyle = "rgba(255,255,255," + (0.5 + gb.aim.p * 0.4).toFixed(2) + ")";
          g2.beginPath(); g2.moveTo(X(p[0]), Y(p[1])); g2.lineTo(X(p[0] + Math.cos(ar) * uz), Y(p[1] + Math.sin(ar) * uz)); g2.stroke(); g2.setLineDash([]);
        }
        tosh(p[0], p[1], GB_OR, "men");
        g2.lineWidth = 2; g2.strokeStyle = "rgba(255,255,255," + (0.35 + 0.25 * Math.sin(ts / 220)).toFixed(2) + ")";
        g2.beginPath(); g2.arc(X(p[0]), Y(p[1]), GB_OR * K.sc + 6, 0, Math.PI * 2); g2.stroke();
      }
    }
    // kuch chizig'i (pastda)
    if (gb.aim && gbMeni()) {
      var bw = gb.w * 0.5, bx = (gb.w - bw) / 2, by = gb.w - 16;
      g2.fillStyle = "rgba(8,10,16,.6)"; g2.fillRect(bx - 2, by - 2, bw + 4, 10);
      var kg = g2.createLinearGradient(bx, 0, bx + bw, 0); kg.addColorStop(0, "#8ff0b6"); kg.addColorStop(0.6, "#f3d58f"); kg.addColorStop(1, "#f0655a");
      g2.fillStyle = kg; g2.fillRect(bx, by, bw * gb.aim.p, 6);
    }
    // xabar
    if (gb.xabar && performance.now() - gb.xabar.t < 1800) {
      g2.globalAlpha = Math.min(1, (1800 - (performance.now() - gb.xabar.t)) / 500);
      g2.font = "800 18px Manrope, sans-serif"; g2.textAlign = "center"; g2.textBaseline = "middle";
      g2.lineWidth = 4; g2.strokeStyle = "rgba(8,10,16,.85)"; g2.strokeText(gb.xabar.m, K.cx, gb.w * 0.16);
      g2.fillStyle = "#f3d58f"; g2.fillText(gb.xabar.m, K.cx, gb.w * 0.16); g2.globalAlpha = 1;
    }
    // navbat matni va vaqt
    var h = $("gb-h"), vq = $("gb-v");
    if (g && h) {
      if (g.state === "kutmoqda" || (g.state === "ketmoqda" && g.turn_in > 0.5 && !gb.anim && g.shots === 0)) { h.textContent = t.boshlanadi(Math.ceil(Math.max(g.turn_in || g.starts_in || 0, 0))); }
      else if (g.state !== "ketmoqda") { h.textContent = ""; }
      else if (gb.anim) { h.textContent = ""; }
      else if (gbMeni()) { h.textContent = gb.aim ? t.kuch + " " + Math.round(gb.aim.p * 100) + "%" : t.otH; }
      else if (g.me && g.turn === g.me) { h.textContent = t.kut; }
      else { h.textContent = t.navbatR(g[g.turn] ? g[g.turn].name : ""); }
      if (vq) { vq.style.width = (g.state === "ketmoqda" && !gb.anim ? Math.max(0, Math.min(100, (g.turn_left || 0) / 30 * 100)) : 0) + "%"; }
    }
  }

  // Barmoq: tosh ustidan boshlansa - joyni yoy bo'ylab suradi; boshqa joydan - orqaga tortib otadi (rogatka)
  function gbBarmoq(e, bosqich) {
    if (!gb || !gbMeni()) { return; }
    var c = $("gb-canvas"), r = c.getBoundingClientRect(), K = gbKoord();
    var tch = e.touches && e.touches[0] ? e.touches[0] : (e.changedTouches && e.changedTouches[0]) || e;
    var x = (tch.clientX - r.left - K.cx) / K.sc, y = -(tch.clientY - r.top - K.cy) / K.sc;
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
      if (gb.tutish === "ot" && gb.aim && gb.aim.p > 0.06) { gbOt(gb.aim); }
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
    var men = g.me, yutdi = men && g.winner === men, yutqazdi = men && g.winner && g.winner !== men;
    var golib = g.winner ? g[g.winner] : null, mag = g.winner ? g[g.winner === "a" ? "b" : "a"] : null;
    box.appendChild(drEl("b", "gb-e-t" + (yutdi ? " yaxshi" : yutqazdi ? " yomon" : ""), yutdi ? t.yutdi : yutqazdi ? t.yutqazdi : g.winner ? t.golibi(golib.name) : t.durang));
    box.appendChild(drEl("strong", "gb-e-s", g.score[0] + " : " + g.score[1]));
    if (g.why === "kelmadi") { box.appendChild(drEl("p", "", t.kelmadi)); }
    else if (g.why === "teng") { box.appendChild(drEl("p", "", t.teng)); }
    if (mag) {
      box.appendChild(drEl("p", "gb-e-sep", yutqazdi ? t.sepSiz : t.sepdi(mag.name)));
      if (yutqazdi) { box.classList.add("sepildi"); } else { box.classList.remove("sepildi"); }
    }
    var tug = drEl("div", "gb-e-b");
    if (g.kind === "mashq" && g.b && g.b.bot) {
      var y = drEl("button", "dr-btn", t.yana);
      y.type = "button";
      y.addEventListener("click", function () { gbBoshla({ mashq: g.b.bot }); });
      tug.appendChild(y);
    }
    var o = drEl("button", "dr-link", t.ortga);
    o.type = "button";
    o.addEventListener("click", function () { gbStop(); gbKorsat(); });
    tug.appendChild(o);
    box.appendChild(tug);
  }

  function gbInfo() {
    var eski = $("du-info"), t = gbT(), r = (gbData && gbData.rules) || {}, pt = r.points || {};
    if (eski) { eski.parentNode.removeChild(eski); }
    var bandlar = lang === "ru" ? [
      ["Игра", "В центре круга лежат 9 камешков. По очереди вы бьёте своим камнем с края круга. Каждый камешек, вылетевший за круг, — ваше очко."],
      ["Как бить", "Сначала передвиньте свой камень по нижней дуге — выберите место. Затем оттяните палец на поле в обратную сторону и отпустите: чем дальше оттянули, тем сильнее удар."],
      ["Сколько ударов", "У каждого по " + (r.shots || 5) + " ударов. Ничья — ещё до " + (r.extra || 3) + " пар ударов. Время на удар — " + (r.turn || 30) + " секунд, иначе удар сгорает."],
      ["Тренировка", "Три соперника-компьютера: Невилл (легко), Рон (средне), Джордж Уизли (сложно). Очков не дают."],
      ["Турнир", "Каждый вторник в 22:00. Нажмите «Участвую». Сетка, как в дуэли и шахматах; чаще побеждавшие на тренировке получают место выше."],
      ["Очки", "За победу: 1/8 финала +" + (pt["16"] || 5) + ", четвертьфинал +" + (pt["8"] || 10) + ", полуфинал +" + (pt["4"] || 20) + ", финал +" + (pt["2"] || 30) + "."],
      ["Как в книге", "Проигравшего камешки обрызгивают вонючей жидкостью."]]
      : lang === "en" ? [
      ["The game", "Nine stones lie in the middle of the ring. Taking turns, you shoot your own stone from the edge of the ring. Every stone knocked out of the ring is a point for you."],
      ["How to shoot", "First slide your stone along the lower arc to choose a spot. Then pull your finger back on the field and let go: the further you pull, the harder the shot."],
      ["How many shots", (r.shots || 5) + " shots each. On a tie — up to " + (r.extra || 3) + " extra pairs. " + (r.turn || 30) + " seconds per shot, or it is lost."],
      ["Practice", "Three computer rivals: Neville (easy), Ron (medium), George Weasley (hard). No points."],
      ["Tournament", "Every Tuesday at 22:00. Tap “I'm in”. A bracket like in duels and chess; those who won more practice games are seeded higher."],
      ["Points", "For a win: round of 16 +" + (pt["16"] || 5) + ", quarter-final +" + (pt["8"] || 10) + ", semi-final +" + (pt["4"] || 20) + ", final +" + (pt["2"] || 30) + "."],
      ["Like in the books", "The loser gets squirted with stinky liquid by the stones."]]
      : [
      ["O'yin", "Doiraning o'rtasida 9 ta toshcha turadi. Navbat bilan o'z toshingizni doira chetidan otasiz. Doiradan chiqib ketgan har bir toshcha — sizga ochko."],
      ["Qanday otiladi", "Avval toshingizni pastki yoy bo'ylab surib, joy tanlang. Keyin maydonda barmoqni orqaga torting va qo'yib yuboring: qancha uzoq tortsangiz, zarba shuncha kuchli."],
      ["Nechta zarba", "Har kimga " + (r.shots || 5) + " tadan zarba. Teng bo'lsa — yana " + (r.extra || 3) + " juftgacha qo'shimcha zarba. Har zarbaga " + (r.turn || 30) + " soniya, ulgurmasangiz zarba yonib ketadi."],
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
