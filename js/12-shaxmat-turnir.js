/* Shaxmat turniri (egasi, 2026-10-11) - duel turniri bilan bir xil mexanizm: yozilish, to'r daraxti, bir oqshomda.
   Ilova kodi bir necha faylga bo'lingan; hammasi BIR umumiy maydonda ishlaydi
   va index.html dagi TARTIBDA yuklanadi. Yuklanish paytida keyingi fayldagi
   narsani chaqirmang - tekshiruv: tools/tartib.js */
"use strict";

  var SHT_T = {
    uz: { turT: "Shaxmat turniri", kunlar: ["yakshanba", "dushanba", "seshanba", "chorshanba", "payshanba", "juma", "shanba"], qoldi: "qoldi",
          soni: function (n) { return n + " kishi yozildi"; }, qat: "Qatnashaman", bor: "Siz yozilgansiz — boyo'g'li eslatadi", chiq: "Chiqish", yopiq: "Yozilish yopildi — to'r tuzilmoqda",
          kam: "Bu safar ishtirokchi yetmadi — turnir o'tmadi.", yozing: "Qatnashish uchun yoziling", hist: "O'yinlar tarixi",
          qatT: "Yozilganlar", yozS: "Kuchliroq shaxmatchilar birinchi bosqichni o'tkazib yuboradi", torT: "Turnir to'ri", surish: "Yonga suring — keyingi bosqichlar",
          kutadi: "kutadi", jonli: "JONLI", kelmadi: "kelmadi", durang: "durang", ball: function (n) { return "+" + n + " ball"; },
          raqib: function (n) { return "Raqibingiz: " + n; }, boshlandi: "O'yin boshlandi — kiring!", kir: "O'yinga kirish", dan: function (v) { return v + " dan keyin boshlanadi"; },
          aniq: "Raqibingiz aniqlanmoqda…", oq: "Siz oq donalar bilan", qora: "Siz qora donalar bilan", champ: "Siz turnir chempionisiz!", out: "Turnir siz uchun tugadi. Keyingi chorshanba yana urinib ko'ring!",
          mashq: "Mashq", mashqS: "Turnirdan tashqari o'yinlar", kick: "Chorshanba turniri", ttl: "Shaxmat", botT: "Bot bilan", botS: "5 daraja", seekT: "Tasodifiy", seekS: "Jonli raqib", kodT: "Kod bilan", kodS: "Ulanish", turnirdan: "Turnirdan tashqari", q1: function (m) { return "Har o'yinchiga " + m + " daqiqa — kim yutsa, keyingi bosqichga o'tadi"; }, q2: "Birinchi yurishni 1 daqiqada qilmagan yutqazadi", q3: "Durangda qora bilan o'ynagan o'tadi", temaT: "Taxta ko'rinishi", yoq: "Aloqa yo'q — qayta urinib ko'ring" },
    ru: { turT: "Шахматный турнир", kunlar: ["воскресенье", "понедельник", "вторник", "среда", "четверг", "пятница", "суббота"], qoldi: "осталось",
          soni: function (n) { return "Записалось: " + n; }, qat: "Участвую", bor: "Вы записаны — сова напомнит", chiq: "Выйти", yopiq: "Запись закрыта — составляется сетка",
          kam: "В этот раз участников не хватило — турнир не состоялся.", yozing: "Запишитесь, чтобы участвовать", hist: "История партий",
          qatT: "Записались", yozS: "Более сильные шахматисты пропускают первый круг", torT: "Сетка турнира", surish: "Листайте вбок — следующие круги",
          kutadi: "ждёт", jonli: "LIVE", kelmadi: "не пришёл", durang: "ничья", ball: function (n) { return "+" + n + " очк."; },
          raqib: function (n) { return "Ваш соперник: " + n; }, boshlandi: "Партия началась — заходите!", kir: "Войти в партию", dan: function (v) { return "начнётся через " + v; },
          aniq: "Ваш соперник определяется…", oq: "Вы играете белыми", qora: "Вы играете чёрными", champ: "Вы чемпион турнира!", out: "Турнир для вас окончен. Попробуйте в следующую среду!",
          mashq: "Тренировка", mashqS: "Партии вне турнира", kick: "Турнир среды", ttl: "Шахматы", botT: "С ботом", botS: "5 уровней", seekT: "Случайный", seekS: "Живой соперник", kodT: "По коду", kodS: "Подключиться", turnirdan: "Вне турнира", q1: function (m) { return "У каждого " + m + " минут — победитель проходит дальше"; }, q2: "Кто не сделал первый ход за 1 минуту — проиграл", q3: "При ничьей проходит игравший чёрными", temaT: "Вид доски", yoq: "Нет связи — попробуйте ещё раз" },
    en: { turT: "Chess tournament", kunlar: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], qoldi: "left",
          soni: function (n) { return n + " signed up"; }, qat: "I'm in", bor: "You are signed up — an owl will remind you", chiq: "Leave", yopiq: "Sign-up closed — drawing the bracket",
          kam: "Not enough players this time — no tournament.", yozing: "Sign up to take part", hist: "Game history",
          qatT: "Signed up", yozS: "Stronger players skip the first round", torT: "Bracket", surish: "Swipe sideways for the next rounds",
          kutadi: "bye", jonli: "LIVE", kelmadi: "no-show", durang: "draw", ball: function (n) { return "+" + n + " pts"; },
          raqib: function (n) { return "Your opponent: " + n; }, boshlandi: "Your game has started — come in!", kir: "Enter the game", dan: function (v) { return "starts in " + v; },
          aniq: "Your opponent is being decided…", oq: "You play white", qora: "You play black", champ: "You are the tournament champion!", out: "The tournament is over for you. Try again next Wednesday!",
          mashq: "Practice", mashqS: "Games outside the tournament", kick: "Wednesday tournament", ttl: "Chess", botT: "With a bot", botS: "5 levels", seekT: "Random", seekS: "Live opponent", kodT: "By code", kodS: "Join", turnirdan: "Outside the tournament", q1: function (m) { return m + " minutes each — the winner goes through"; }, q2: "No first move within 1 minute — you lose", q3: "In a draw, the player with black goes through", temaT: "Board style", yoq: "No connection — please try again" }
  };
  function shtT() { return SHT_T[lang] || SHT_T.uz; }

  var shtData = null, shtTm = null, shtOchilgan = null, shtLocal = null;

  function shtMen() { return (tgUser() || {}).id || (MS_LOCAL ? 1 : 0); }

  /* Mahalliy ko'rik uchun namuna: shtLocal.rej = "yozilish" | "tor" */
  function shtSample(body) {
    if (!shtLocal) { shtLocal = { rej: "yozilish", joined: false }; }
    var L2 = shtLocal, hozir = Date.now() / 1000, men = shtMen();
    if (body && body.join != null) { L2.joined = !!body.join; }
    var ism = ["Germiona", "Draco", "Sehrgar", "Luna", "Sedrik", "Ron", "Nevill", "Parvati", "Jinni"], uy = ["gryffindor", "slytherin", "gryffindor", "ravenclaw", "hufflepuff", "gryffindor", "gryffindor", "gryffindor", "gryffindor"];
    var kim = function (i) { return { uid: i === 2 ? men : 100 + i, name: ism[i], house: uy[i] }; };
    var res = { ok: true, now: hozir, rules: { base: 300, gap: 60, first: 60, points: { "16": 5, "8": 10, "4": 20, "2": 30 } }, cup: { size: null } };
    if (L2.rej === "yozilish") {
      var royxat = ism.map(function (n, i) { var k = kim(i); k.me = i === 2; return k; }).filter(function (p) { return !p.me || L2.joined; });
      res.tour = { ts: hozir + 3 * 86400 + 2 * 3600, now: hozir, open: true, joined: L2.joined, n: royxat.length, close: 300, players: royxat };
      return res;
    }
    var T0 = hozir - 900, bye = function (id, i) { return { id: id, a: kim(i), b: null, winner: kim(i).uid, state: "tugadi", why: "bye", game: null }; };
    res.tour = { ts: T0, now: hozir, open: false, joined: true, n: 9, close: 300, players: [] };
    res.cup = { size: 16, now: hozir, my: { id: 23, stage: 8, game: "abc", state: "ketmoqda", ts: T0 + 780, ready: true, white: true }, stages: [
      { stage: 16, ts: T0, points: 5, matches: [bye(1, 0), { id: 2, a: kim(7), b: kim(8), winner: kim(7).uid, state: "tugadi", why: "oyin", game: "g1" }, bye(3, 3), bye(4, 4), bye(5, 1), bye(6, 6), bye(7, 2), bye(8, 5)] },
      { stage: 8, ts: T0 + 780, points: 10, matches: [
        { id: 20, a: kim(0), b: kim(7), winner: null, state: "ketmoqda", why: null, game: "g2" },
        { id: 22, a: kim(3), b: kim(4), winner: kim(4).uid, state: "tugadi", why: "durang", game: "g3" },
        { id: 21, a: kim(1), b: kim(6), winner: kim(1).uid, state: "tugadi", why: "kelmadi", game: "g4" },
        { id: 23, a: kim(2), b: kim(5), winner: null, state: "ketmoqda", why: null, game: "abc" }] },
      { stage: 4, ts: T0 + 1560, points: 20, matches: [{ id: 30, a: null, b: kim(4), winner: null, state: "kutmoqda", why: null, game: null }, { id: 31, a: kim(1), b: null, winner: null, state: "kutmoqda", why: null, game: null }] },
      { stage: 2, ts: T0 + 2340, points: 30, matches: [{ id: 40, a: null, b: null, winner: null, state: "kutmoqda", why: null, game: null }] }] };
    return res;
  }

  function shtPost(body, cb) {
    chessApi("turnir", body || {}).then(function (res) { cb(res && res.tour ? res : (MS_LOCAL ? shtSample(body) : res)); })
      ["catch"](function () { cb(MS_LOCAL ? shtSample(body) : null); });
  }

  // Shaxmat bosh sahifasi ochilganda chaqiriladi; turnir oqshomida holat har 4 soniyada yangilanadi
  function shtLoad() {
    clearTimeout(shtTm);
    if ($("scr-chess-hub").classList.contains("hidden")) { return; }
    shtPost({}, function (res) {
      if (res && res.tour) { shtData = res; shtRender(); }
      else if (!shtData) { shtRender(); }
      var d = shtData, tez = d && ((d.cup && d.cup.size > 0 && d.cup.stages && d.cup.stages[d.cup.stages.length - 1].matches[0].state !== "tugadi") || (d.tour && d.tour.ts - d.now < 900 && d.tour.ts - d.now > -600));
      if (!$("scr-chess-hub").classList.contains("hidden")) { shtTm = setTimeout(shtLoad, tez ? 4000 : 60000); }
    });
  }
  function shtYozil(on) {
    shtPost({ join: on ? 1 : 0 }, function (res) {
      if (res && res.tour) { shtData = res; shtRender(); if (res.join_ok === false) { showToast(shtT().yopiq, "err"); } }
      else { showToast(shtT().yoq, "err"); }
    });
  }

  function shtRender() {
    var t = shtT();
    $("sht-kick").textContent = t.kick;
    $("sht-ttl").textContent = t.ttl;
    shtMashq();
    shtHero();
    shtCup();
    // O'z o'yini ochilgan zahoti taxtaga o'tadi (bir o'yin uchun bir marta) - birinchi yurishga atigi 1 daqiqa bor
    var my = shtData && shtData.cup && shtData.cup.my;
    if (my && my.game && my.state === "ketmoqda" && shtOchilgan !== my.game && !MS_LOCAL) {
      shtOchilgan = my.game;
      if (!$("scr-chess-hub").classList.contains("hidden")) { joinPvPGame(my.game); }
    }
  }

  function shtMeniki(c) {
    var topildi = null;
    if (!c || !c.my || !c.stages) { return null; }
    c.stages.forEach(function (st) { st.matches.forEach(function (m) { if (m.id === c.my.id) { topildi = m; } }); });
    return topildi;
  }

  /* Tepa karta: turnir holati (duel sahifasidagi bilan bir xil qolip) - o'rin ham, reyting ham YO'Q */
  function shtHero() {
    var box = $("sht-hero"), d = shtData, t = shtT(), tp = tpT();
    if (!box) { return; }
    box.innerHTML = "";
    var c = d && d.cup, tr = d && d.tour, men = shtMen(), o = { lab: tp.keyingi, sar: t.turT, tarix: [t.hist, function () { openChessStats("hist"); }] };
    if (c && c.size) {
      o.lab = tp.ketmoqda;
      if (c.my) {
        var m = shtMeniki(c), raq = m ? ((m.a && m.a.uid === men) ? m.b : m.a) : null;
        o.sar = duBosq(c.my.stage);
        if (c.my.game) { o.iz = (raq ? t.raqib(raq.name) + " · " : "") + t.boshlandi; o.holat = { asosiy: [t.kir, function () { joinPvPGame(c.my.game); }] }; }
        else if (c.my.ready && c.my.ts) { o.iz = (raq ? t.raqib(raq.name) + " · " : "") + (c.my.white ? t.oq : t.qora) + " · " + t.dan(duVaqt(c.my.ts - c.now)); }
        else { o.iz = t.aniq; }
      } else {
        var bormi = false;
        c.stages.forEach(function (st) { st.matches.forEach(function (x) { if ((x.a && x.a.uid === men) || (x.b && x.b.uid === men)) { bormi = true; } }); });
        var fin = c.stages[c.stages.length - 1].matches[0], chempion = bormi && fin.winner === men;
        o.iz = chempion ? t.champ : bormi ? t.out : "";
      }
    } else if (c && c.size === 0) { o.iz = t.kam; }
    else if (tr) {
      o.sar = tpKun(tr.ts, t.kunlar);
      o.iz = duQol(tr.ts - tr.now) + " " + t.qoldi + " · " + t.soni(tr.n);
      o.holat = tpYozHolat(tr, t.bor, t.chiq, t.qat, t.yopiq, shtYozil);
    }
    box.appendChild(tpHero(o));
    shtQoida();
  }

  /* Mashq kataklari (yagona qolip): bot, tasodifiy raqib, kod, do'st - bosilsa pastdan oyna chiqadi (#ch-sh) */
  function shtMashq() {
    var box = $("sht-mashq"), t = shtT();
    if (!box) { return; }
    box.innerHTML = "";
    var pc = function (p) { var e = drEl("span", "tp-pc"); e.innerHTML = getPieceSVG(p); return e; };
    var ic = function (k) { var e = drEl("span", "tp-ic"); e.innerHTML = CHESS_IC[k] || ""; return e; };
    var dost = tpDost(function () { shtSh("dost"); });
    box.appendChild(tpMashq(t.turnirdan, [
      { av: pc("n"), nom: t.botT, sub: t.botS, fn: function () { shtSh("bot"); } },
      { av: ic("swords"), nom: t.seekT, sub: t.seekS, fn: function () { shtSh("seek"); } },
      { av: drEl("span", "tp-ic tp-hash", "#"), nom: t.kodT, sub: t.kodS, fn: function () { shtSh("kod"); } },
      dost]));
    box.appendChild(drEl("p", "tp-iz", L("rulesText")));
  }
  function shtSh(rejim) {
    var sh = $("ch-sh"), t = shtT();
    if (!sh) { return; }
    if (sh.parentNode !== document.body) { document.body.appendChild(sh); }      // .screen ichida fixed oyna sahifa pastiga yopishadi
    sh.className = "du-info ch-sh m-" + rejim;
    $("ch-sh-t").textContent = rejim === "bot" ? t.botT : rejim === "seek" ? t.seekT : rejim === "kod" ? t.kodT : tpT().dost;
    renderChessHub();
  }
  function shtShYop() { var sh = $("ch-sh"); if (sh) { sh.classList.add("hidden"); } }
  // Qoida va sovrinlar, taxta ko'rinishi, yozilganlar
  function shtQoida() {
    var d = shtData || {}, t = shtT(), tp = tpT(), r = d.rules || {}, q = $("sht-qoida"), h = $("sht-haqida"), y = $("sht-yozl");
    if (!q) { return; }
    var th = $("ch-themes");
    if (th) { $("ch-tema-k").appendChild(th); }          // taxta tanlovi (tugmalari bog'langan) - tozalashdan oldin joyiga qaytariladi
    q.innerHTML = ""; h.innerHTML = ""; y.innerHTML = "";
    q.appendChild(tpQoida([t.q1(Math.round((r.base || 300) / 60)), t.q2, t.q3], tpTorSov(r.points), tp.torIz));
    if (th) { h.appendChild(tpHaqida(t.temaT, "", th)); }
    var c = d.cup, tr = d.tour;
    if (c && c.size == null && tr) { y.appendChild(tpYoz(tr.players, tr.n, t.yozS)); }
  }

  /* Turnir kartasi: to'r tuzilmaguncha - yozilganlar (raqam va reytingsiz), keyin - to'r daraxti */
  function shtCup() {
    var box = $("sht-cup"), d = shtData, t = shtT();
    if (!box) { return; }
    box.innerHTML = "";
    golibQoy("sht-golib", d && d.champs);                  // so'nggi turnir g'oliblari (o'rin va ball)
    var c = d && d.cup, tr = d && d.tour;
    if (!c) { return; }
    if (c.size == null) { return; }                     // to'r hali tuzilmagan - yozilganlar pastda (shtQoida)
    if (!c.size) { return; }
    var men = shtMen(), birinchi = c.stages[0].matches.length, QATOR = 62;
    var sar = drEl("span", "du-st-t");
    sar.appendChild(drEl("b", "", t.torT));
    sar.appendChild(drEl("em", "", t.surish));
    box.appendChild(sar);
    var br = drEl("div", "du-br"), ich = drEl("div", "du-br-i"), menUstun = null;
    c.stages.forEach(function (s, si) {
      var col = drEl("div", "du-br-c"), bosh = drEl("div", "du-br-h");
      bosh.appendChild(drEl("b", "", duBosq(s.stage)));
      bosh.appendChild(drEl("small", "", (si ? "≈ " : "") + duSoat(s.ts) + (s.points ? " · " + t.ball(s.points) : "")));
      col.appendChild(bosh);
      var tana = drEl("div", "du-br-b");
      tana.style.height = (birinchi * QATOR) + "px";
      s.matches.forEach(function (m) {
        var tugadi = m.state === "tugadi", bye = m.why === "bye", meniki = (m.a && m.a.uid === men) || (m.b && m.b.uid === men);
        if (meniki && (!tugadi || !menUstun)) { menUstun = col; }
        var joy = drEl("div", "du-br-m" + (si === c.stages.length - 1 ? " oxir" : ""));
        // tugagan o'yin - yurishma-yurish; JONLI o'yin - tomosha (egasi, 2026-10-14: «jonli o'tayotgan janglarni kuzatish»)
        var ochiladi = m.game && !bye && ((tugadi && (m.why === "oyin" || m.why === "vaqt" || m.why === "durang")) || m.state === "ketmoqda");
        var card = drEl(ochiladi ? "button" : "div", "du-bc" + (meniki ? " men" : "") + (m.state === "ketmoqda" ? " jonli" : "") + (bye ? " bye" : ""));
        if (ochiladi) { card.type = "button"; card.addEventListener("click", function () { chessReview(m.game, true); }); }
        var yon = function (p, oq) {
          var e = drEl("span", "du-bc-p" + (p && m.winner === p.uid && !bye ? " g" : "") + (p && m.winner && m.winner !== p.uid ? " y" : "") + (p && p.uid === men ? " siz" : ""));
          if (!p) { e.appendChild(drEl("b", "tbd", "—")); return e; }
          var cr = cupCrestImg(p.house, 14);
          if (cr) { e.appendChild(cr); }
          e.appendChild(drEl("b", "", p.name));
          if (bye) { e.appendChild(drEl("em", "yoq", t.kutadi)); }
          else if (tugadi && m.winner !== p.uid && (m.why === "kelmadi" || m.why === "ikkalasi")) { e.appendChild(drEl("em", "yoq", t.kelmadi)); }
          else if (tugadi && m.why === "durang" && !oq) { e.appendChild(drEl("em", "yoq", t.durang)); }
          else if (m.a && m.b) { e.appendChild(drEl("i", "sht-rang" + (oq ? " oq" : ""), "")); }
          return e;
        };
        card.appendChild(yon(m.a, true));
        if (!bye) { card.appendChild(yon(m.b, false)); }
        if (m.state === "ketmoqda") { card.appendChild(drEl("i", "du-bc-j", t.jonli)); }
        joy.appendChild(card);
        tana.appendChild(joy);
      });
      col.appendChild(tana);
      ich.appendChild(col);
    });
    br.appendChild(ich);
    var eski = box._sl || 0;
    box.appendChild(br);
    if (menUstun && !box._surildi) { box._surildi = true; setTimeout(function () { try { br.scrollLeft = Math.max(0, menUstun.offsetLeft - 12); } catch (e) {} }, 60); }
    else { br.scrollLeft = eski; }
    br.addEventListener("scroll", function () { box._sl = br.scrollLeft; });
  }

  /* «i» tugmasi: turnir haqidagi hamma ma'lumot bitta oynada (sonlar serverdagi qoidalardan) */
  function shtInfoMatn() {
    var q = (shtData && shtData.rules) || {}, pt = q.points || {};
    var r = { daq: Math.round((q.base || 300) / 60), gap: Math.round((q.gap || 60) / 60), first: Math.round((q.first || 60) / 60),
      yop: Math.round((((shtData && shtData.tour) || {}).close || 300) / 60), p16: pt["16"] || 5, p8: pt["8"] || 10, p4: pt["4"] || 20, p2: pt["2"] || 30 };
    if (lang === "ru") { return [
      ["Когда", "Раз в неделю — в среду в 22:00 (время Ташкента). Победитель определяется в тот же вечер."],
      ["Кто участвует", "Отбора нет. Играет каждый, кто нажал «Участвую». Запись закрывается за " + r.yop + " мин. до начала — после этого составляется сетка."],
      ["Как составляется сетка", "Турнир на выбывание: победитель идёт дальше, проигравший выбывает. Если участников не хватает на полную сетку, более сильные шахматисты пропускают первый круг («ждёт»). Кто сильнее — определяется по вашим результатам в живых партиях."],
      ["Как проходит партия", "Каждому игроку — " + r.daq + " минут на всю партию. Партия открывается сама: оставайтесь на странице шахмат. Тот, кто стоит выше в сетке, играет белыми."],
      ["Ничья", "При ничьей дальше проходит тот, кто играл чёрными: у белых преимущество первого хода, поэтому им нужна победа."],
      ["Кто не пришёл", "На первый ход даётся " + r.first + " мин. Кто не успел — проигрывает. Отменить турнирную партию нельзя: вышедший считается проигравшим."],
      ["Следующий круг", "Следующая партия начинается через " + r.gap + " мин. после того, как определились оба соперника. Время кругов в сетке — примерное."],
      ["Очки", "За победу — очки в кубок факультета: в 1/8 финала +" + r.p16 + ", в четвертьфинале +" + r.p8 + ", в полуфинале +" + r.p4 + ", в финале +" + r.p2 + ". За более ранние круги и за пропуск круга очков нет."],
      ["Напоминание", "Записавшимся сова приносит напоминание утром в день турнира и за 10 минут до начала."]]; }
    if (lang === "en") { return [
      ["When", "Once a week — on Wednesday at 22:00 (Tashkent time). The winner is decided that same evening."],
      ["Who plays", "No qualifying. Everyone who taps “I'm in” plays. Sign-up closes " + r.yop + " minutes before the start — then the bracket is drawn."],
      ["How the bracket works", "It is a knockout: the winner moves on, the loser is out. If there are not enough players for a full bracket, stronger players skip the first round (“bye”). Strength is judged by your results in live games."],
      ["How a game works", "Each player has " + r.daq + " minutes for the whole game. The game opens by itself: stay on the chess page. The player higher in the bracket plays white."],
      ["Draws", "After a draw the player with the black pieces moves on: white has the first-move advantage, so white must win."],
      ["No-shows", "You have " + r.first + " minute for your first move. Miss it and you lose. A tournament game cannot be aborted: whoever leaves loses."],
      ["Next round", "The next game starts " + r.gap + " minute after both opponents are known. Round times in the bracket are approximate."],
      ["Points", "A win earns House Cup points: +" + r.p16 + " in the round of 16, +" + r.p8 + " in the quarter-final, +" + r.p4 + " in the semi-final, +" + r.p2 + " in the final. No points for earlier rounds or for a bye."],
      ["Reminder", "If you signed up, an owl reminds you on the morning of the tournament and 10 minutes before it starts."]]; }
    return [
      ["Qachon", "Haftada bir marta — chorshanba kuni soat 22:00 da (Toshkent vaqti). G'olib shu oqshomning o'zida aniqlanadi."],
      ["Kim qatnashadi", "Saralash yo'q. «Qatnashaman» tugmasini bosgan har bir o'quvchi o'ynaydi. Yozilish turnirdan " + r.yop + " daqiqa oldin yopiladi — shundan keyin to'r tuziladi."],
      ["To'r qanday tuziladi", "Turnir — olib tashlash usulida: yutgan keyingi bosqichga o'tadi, yutqazgan turnirni tark etadi. Ishtirokchilar soni to'rga to'liq yetmasa, kuchliroq shaxmatchilar birinchi bosqichni o'tkazib yuboradi («kutadi»). Kim kuchliroq ekani jonli o'yinlardagi natijalaringizdan aniqlanadi."],
      ["O'yin qanday o'tadi", "Har o'yinchiga butun o'yin uchun " + r.daq + " daqiqa beriladi. O'yin o'zi ochiladi: shaxmat sahifasida turing. To'rda yuqori turgan o'yinchi oq donalar bilan o'ynaydi."],
      ["Durang bo'lsa", "Durangda qora donalar bilan o'ynagan keyingi bosqichga o'tadi: oq birinchi yurish ustunligiga ega, shuning uchun unga faqat g'alaba kerak."],
      ["Kelmagan o'yinchi", "Birinchi yurish uchun " + r.first + " daqiqa beriladi. Ulgurmagan yutqazadi. Turnir o'yinini bekor qilib bo'lmaydi: chiqib ketgan yutqazgan hisoblanadi."],
      ["Keyingi bosqich", "Keyingi o'yin ikkala raqib aniqlangach " + r.gap + " daqiqadan keyin boshlanadi. To'rdagi bosqich soatlari taxminiy."],
      ["Ballar", "G'alaba uchun fakultet kubogiga ball: 1/8 finalda +" + r.p16 + ", chorak finalda +" + r.p8 + ", yarim finalda +" + r.p4 + ", finalda +" + r.p2 + ". Oldingi bosqichlar va o'tkazib yuborilgan bosqich uchun ball yo'q."],
      ["Eslatma", "Turnirga yozilganlarga turnir kuni ertalab va boshlanishiga 10 daqiqa qolganda boyo'g'li xabar olib keladi."]];
  }
  function shtInfo() {
    var eski = $("du-info");
    if (eski) { eski.parentNode.removeChild(eski); }
    var orqa = drEl("div", "du-info"), oyna = drEl("div", "du-info-p"), yop = function () { if (orqa.parentNode) { orqa.parentNode.removeChild(orqa); } };
    orqa.id = "du-info";
    var bosh = drEl("div", "du-info-h");
    bosh.appendChild(drEl("b", "", shtT().turT));
    var xb = drEl("button", "", "×");
    xb.type = "button";
    xb.addEventListener("click", yop);
    bosh.appendChild(xb);
    oyna.appendChild(bosh);
    var tana = drEl("div", "du-info-b");
    shtInfoMatn().forEach(function (b, i) {
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

  function shtSetup() {
    var b = $("sht-info-b");
    if (b) { b.addEventListener("click", shtInfo); }
    // mashq oynasi: × yoki fon bosilsa yopiladi; shaxmat sahifasidan chiqilsa (o'yin boshlandi, ortga) - o'zi yopiladi
    var sh = $("ch-sh"), hub = $("scr-chess-hub");
    if (sh) {
      $("ch-sh-x").addEventListener("click", shtShYop);
      sh.addEventListener("click", function (e) { if (e.target === sh) { shtShYop(); } });
    }
    if (sh && hub && window.MutationObserver) {
      new MutationObserver(function () { if (hub.classList.contains("hidden")) { shtShYop(); } }).observe(hub, { attributes: true, attributeFilter: ["class"] });
    }
  }

  shtSetup();
