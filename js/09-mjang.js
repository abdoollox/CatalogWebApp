/* MAXLUQLAR JANGI (kartochkalar jangi) - shanba turniri (egasi, 2026-10-14). Server: hpmjang.py, POST /api/mjang.
   Qo'riqxonaning 12 maxluqi - kartalar: Kuch / Himoya / Chaqqonlik va unsur (olov > havo > suv > olov, +2).
   Har kimga 5 ta tasodifiy karta, ikkala qo'l ochiq. Hujum qiluvchi karta va kuchni tanlaydi, raqib ko'rib javob kartasini beradi;
   raundni yutgan keyingi raundda hujum qiladi. 3 raund - g'alaba. O'quvchining o'z maxluqi eng kuchli tomoniga qo'shimcha oladi
   (o'smir +0,5 - teng bo'lsa yutadi, katta +1). Hamma hisobni SERVER qiladi - ilova faqat ko'rsatadi va tanlovni yuboradi.
   Ilova kodi bir necha faylga bo'lingan; hammasi BIR umumiy maydonda ishlaydi
   va index.html dagi TARTIBDA yuklanadi. Yuklanish paytida keyingi fayldagi
   narsani chaqirmang - tekshiruv: tools/tartib.js */
"use strict";

  var API_MJ = "https://bot.tizimshunos.uz/api/mjang";
  var MJ_T = {
    uz: { kick: "Shanba turniri", ttl: "Maxluqlar jangi", nom: "Maxluqlar jangi turniri", kunlar: ["yakshanba", "dushanba", "seshanba", "chorshanba", "payshanba", "juma", "shanba"],
          qoldi: "qoldi", soni: function (n) { return n + " kishi yozildi"; }, qat: "Qatnashaman", bor: "Siz yozilgansiz — boyo'g'li eslatadi", chiq: "Chiqish", yopiq: "Yozilish yopildi",
          q1: "Har kimga 5 ta maxluq kartasi — ikkala qo'l ham ochiq", q2: "Hujumda karta va kuchni tanlaysiz, raqib javob kartasini beradi",
          q3: "Raundni yutgan keyingi hujumni qiladi — 3 raund yutgan g'olib",
          mashq: "Mashq", mashqS: "Ball berilmaydi", daraja: ["Oson", "O'rta", "Qiyin"], stat: function (a, b) { return a + " jang · " + b + " g'alaba"; },
          dost: "Do'st bilan", dostS: "Telegram orqali", kartalar: "Kartalar", kartalarS: "O'z maxluqingiz eng kuchli tomoniga qo'shimcha oladi: o'smir +½ (teng bo'lsa yutadi), katta +1",
          ozim: "Sizniki", osmir: "o'smir · +½", katta: "katta · +1", bola: "bola", yoq: "sizda yo'q",
          tor: "Turnir to'ri", bosq: { 2: "Final", 4: "Yarim final", 8: "Chorak final", 16: "1/8 final", 32: "1/16 final" }, jonli: "JONLI", kutadi: "kutadi",
          ball: function (p) { return "g'alabaga +" + p; }, sinov: "Sinov jangi", sinovS: "Faqat adminga ko'rinadi · kompyuter bilan, turnir oqimi",
          siz: "Siz", kuchlar: { k: "Kuch", h: "Himoya", c: "Chaqqonlik" }, unsur: { olov: "olov", suv: "suv", havo: "havo" },
          boshlanadi: "Jang boshlanmoqda…", birinchi: function (n) { return "Birinchi hujum — " + n; },
          hujumSiz: "Sizning hujumingiz: karta tanlang", hujumKuch: "Endi qaysi kuch bilan hujum qilasiz?",
          hujumR: function (n) { return n + " hujumga tayyorlanmoqda…"; },
          javobSiz: function (k, s, v) { return "Raqib hujumi: " + k + " · " + s + " " + v + ". Javob kartasini tanlang"; },
          javobR: function (n) { return n + " javob kartasini tanlamoqda…"; }, javobB: "Javob berish", hujumB: function (s, v) { return s + " " + v; },
          yutadi: "yutadi", yutqazadi: "yutqazadi", teng: "teng",
          rYutdi: "Raundni siz oldingiz!", rYutqazdi: "Raundni raqib oldi", rTeng: "Teng — raund hech kimga", rOldi: function (n) { return n + " raundni oldi"; },
          yutdi: "Siz yutdingiz!", yutqazdi: "Siz yutqazdingiz", durang: "Durang", golibi: function (n) { return n + " yutdi"; },
          kelmadi: "Raqib kelmadi", tengT: "Teng — to'rda yuqori turgan o'tdi", yana: "Yana o'ynash", ortga: "Ortga", aloqa: "Aloqa yo'q — qayta urinib ko'ring",
          galaba: "G'alaba", maglub: "Mag'lubiyat", yakunK: "Jang tugadi", raund: function (n) { return n + "-raund"; }, ishlatildi: "ishlatildi",
          kutT: "Do'stingizni kutyapmiz", kutS: "Kartani Telegram chatiga yuboring — do'stingiz bosishi bilan jang boshlanadi",
          muddat: function (v) { return "Taklif yana " + v + " amal qiladi"; }, tgB: "Telegram chatiga yuborish", bekorB: "Bekor qilish",
          eBand: "Bu taklifni boshqa odam qabul qilib bo'lgan", eMuddat: "Taklif muddati tugagan", ustun: "unsur +2" },
    ru: { kick: "Турнир субботы", ttl: "Битва существ", nom: "Турнир «Битва существ»", kunlar: ["воскресенье", "понедельник", "вторник", "среда", "четверг", "пятница", "суббота"],
          qoldi: "осталось", soni: function (n) { return "Записалось: " + n; }, qat: "Участвую", bor: "Вы записаны — сова напомнит", chiq: "Выйти", yopiq: "Запись закрыта",
          q1: "У каждого 5 карт существ — обе руки открыты", q2: "В атаке вы выбираете карту и силу, соперник отвечает своей картой",
          q3: "Кто взял раунд, тот атакует дальше — 3 раунда для победы",
          mashq: "Тренировка", mashqS: "Без очков", daraja: ["Легко", "Средне", "Сложно"], stat: function (a, b) { return "Битв: " + a + " · побед: " + b; },
          dost: "С другом", dostS: "через Telegram", kartalar: "Карты", kartalarS: "Ваше существо получает прибавку к самой сильной стороне: подросток +½ (побеждает при равенстве), взрослое +1",
          ozim: "Ваше", osmir: "подросток · +½", katta: "взрослое · +1", bola: "малыш", yoq: "нет у вас",
          tor: "Сетка турнира", bosq: { 2: "Финал", 4: "Полуфинал", 8: "Четвертьфинал", 16: "1/8 финала", 32: "1/16 финала" }, jonli: "LIVE", kutadi: "ждёт",
          ball: function (p) { return "за победу +" + p; }, sinov: "Тестовая битва", sinovS: "Только для админа · с компьютером, как в турнире",
          siz: "Вы", kuchlar: { k: "Сила", h: "Защита", c: "Ловкость" }, unsur: { olov: "огонь", suv: "вода", havo: "воздух" },
          boshlanadi: "Битва начинается…", birinchi: function (n) { return "Первым атакует " + n; },
          hujumSiz: "Ваша атака: выберите карту", hujumKuch: "Какой силой атакуете?",
          hujumR: function (n) { return n + " готовит атаку…"; },
          javobSiz: function (k, s, v) { return "Атака соперника: " + k + " · " + s + " " + v + ". Выберите карту для ответа"; },
          javobR: function (n) { return n + " выбирает ответ…"; }, javobB: "Ответить", hujumB: function (s, v) { return s + " " + v; },
          yutadi: "побеждает", yutqazadi: "проигрывает", teng: "ничья",
          rYutdi: "Раунд ваш!", rYutqazdi: "Раунд взял соперник", rTeng: "Ничья — раунд никому", rOldi: function (n) { return n + " взял раунд"; },
          yutdi: "Вы победили!", yutqazdi: "Вы проиграли", durang: "Ничья", golibi: function (n) { return "Победил " + n; },
          kelmadi: "Соперник не пришёл", tengT: "Ничья — прошёл тот, кто выше в сетке", yana: "Ещё раз", ortga: "Назад", aloqa: "Нет связи — попробуйте ещё раз",
          galaba: "Победа", maglub: "Поражение", yakunK: "Битва окончена", raund: function (n) { return "Раунд " + n; }, ishlatildi: "сыграна",
          kutT: "Ждём вашего друга", kutS: "Отправьте карточку в чат Telegram — друг нажмёт, и битва начнётся",
          muddat: function (v) { return "Приглашение действует ещё " + v; }, tgB: "Отправить в чат Telegram", bekorB: "Отменить",
          eBand: "Это приглашение уже принял другой", eMuddat: "Срок приглашения истёк", ustun: "стихия +2" },
    en: { kick: "Saturday tournament", ttl: "Creature Battle", nom: "Creature Battle tournament", kunlar: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
          qoldi: "left", soni: function (n) { return n + " signed up"; }, qat: "I'm in", bor: "You are signed up — an owl will remind you", chiq: "Leave", yopiq: "Sign-up closed",
          q1: "5 creature cards each — both hands are open", q2: "When attacking you choose a card and a power, the rival answers with a card",
          q3: "Whoever takes a round attacks next — 3 rounds to win",
          mashq: "Practice", mashqS: "No points", daraja: ["Easy", "Medium", "Hard"], stat: function (a, b) { return a + " battles · " + b + " wins"; },
          dost: "With a friend", dostS: "via Telegram", kartalar: "Cards", kartalarS: "Your own creature gets a bonus on its strongest side: young +½ (wins ties), adult +1",
          ozim: "Yours", osmir: "young · +½", katta: "adult · +1", bola: "baby", yoq: "not yours",
          tor: "Tournament bracket", bosq: { 2: "Final", 4: "Semi-final", 8: "Quarter-final", 16: "Round of 16", 32: "Round of 32" }, jonli: "LIVE", kutadi: "waiting",
          ball: function (p) { return "+" + p + " for a win"; }, sinov: "Test battle", sinovS: "Admin only · against the computer, tournament flow",
          siz: "You", kuchlar: { k: "Power", h: "Defence", c: "Agility" }, unsur: { olov: "fire", suv: "water", havo: "air" },
          boshlanadi: "The battle is starting…", birinchi: function (n) { return n + " attacks first"; },
          hujumSiz: "Your attack: choose a card", hujumKuch: "Which power do you attack with?",
          hujumR: function (n) { return n + " is preparing an attack…"; },
          javobSiz: function (k, s, v) { return "Rival's attack: " + k + " · " + s + " " + v + ". Choose your answer card"; },
          javobR: function (n) { return n + " is choosing an answer…"; }, javobB: "Answer", hujumB: function (s, v) { return s + " " + v; },
          yutadi: "wins", yutqazadi: "loses", teng: "tie",
          rYutdi: "You took the round!", rYutqazdi: "The rival took the round", rTeng: "Tie — nobody takes the round", rOldi: function (n) { return n + " took the round"; },
          yutdi: "You won!", yutqazdi: "You lost", durang: "Draw", golibi: function (n) { return n + " won"; },
          kelmadi: "The opponent did not come", tengT: "Tie — the higher seed goes through", yana: "Play again", ortga: "Back", aloqa: "No connection — please try again",
          galaba: "Victory", maglub: "Defeat", yakunK: "Battle over", raund: function (n) { return "Round " + n; }, ishlatildi: "played",
          kutT: "Waiting for your friend", kutS: "Send the card to a Telegram chat — the battle starts as soon as your friend taps it",
          muddat: function (v) { return "The invite is valid for " + v + " more"; }, tgB: "Send to a Telegram chat", bekorB: "Cancel",
          eBand: "Someone else has already accepted this invite", eMuddat: "The invite has expired", ustun: "element +2" }
  };
  function mjT() { return MJ_T[lang] || MJ_T.uz; }

  // Server bilan bir xil (hpmjang.KARTALAR, USTUN) - faqat oldindan ko'rsatish uchun; natijani server hisoblaydi
  var MJ_KARTA = {
    gippo: ["havo", 7, 3, 5], boyogli: ["havo", 2, 4, 9], niffler: ["olov", 3, 4, 8], flobber: ["suv", 1, 9, 5],
    testral: ["havo", 6, 5, 4], qurbaqa: ["suv", 3, 5, 7], kalmar: ["suv", 8, 6, 1], boutrakl: ["suv", 4, 8, 3],
    salamandra: ["olov", 6, 6, 3], mushuk: ["havo", 5, 2, 8], kalamush: ["olov", 2, 5, 8], ajdar: ["olov", 9, 4, 2]
  };
  var MJ_USTUN = { olov: "havo", havo: "suv", suv: "olov" };
  var MJ_U = { olov: { rgb: "239,118,64", e: "🔥" }, suv: { rgb: "74,160,236", e: "💧" }, havo: { rgb: "150,214,196", e: "🌪️" } };
  var MJ_S = ["k", "h", "c"], MJ_B = { k: "⚔️", h: "🛡️", c: "💨" };
  var MJ_RAUND_T = 30;       // server yuboradi (g.turn_t); bu - zaxira
  var MJ_AVTO = 1.5;         // belgilangan karta vaqt tugashidan shuncha soniya oldin o'zi yuboriladi
  function mjTop(k) { var x = MJ_KARTA[k]; return x[1] >= x[2] && x[1] >= x[3] ? "k" : x[2] >= x[3] ? "h" : "c"; }
  function mjBaza(k, s) { return MJ_KARTA[k][1 + MJ_S.indexOf(s)]; }
  function mjKuch(c, s, r) {
    var v = mjBaza(c.k, s);
    if (c.o && s === mjTop(c.k)) { v += c.o; }
    if (r && MJ_USTUN[MJ_KARTA[c.k][0]] === MJ_KARTA[r.k][0]) { v += 2; }
    return v;
  }
  function mjSon(v) { return v % 1 ? (Math.floor(v) + "½") : String(v); }
  function mjNom(k) { try { return mxTx(k)[0]; } catch (e) { return k; } }

  // Qo'riqxona kartasidagi qator: jangdagi kuchlari va o'stirish qo'shimchasi
  function mjQrQator(k, st) {
    var x = MJ_KARTA[k], top = MJ_B[mjTop(k)];
    var q = { uz: ["Jangda", "o'smir bo'lsa " + top + "+½", "katta bo'lsa " + top + "+1"], ru: ["В битве", "подросток: " + top + "+½", "взрослое: " + top + "+1"],
              en: ["In battle", "young: " + top + "+½", "adult: " + top + "+1"] }[lang] || [];
    var s = MJ_S.map(function (s2) { return MJ_B[s2] + mjBaza(k, s2); }).join(" ");
    return (q[0] || "Jangda") + ": " + MJ_U[x[0]].e + " " + s + " · " + (st === 2 ? top + "+1" : st === 1 ? top + "+½, " + q[2] : q[1]);
  }
  var mjData = null, mjTm = null, mjSoat = null, mjOlingan = 0, mjLocal = null;
  var mj = null;      // o'yin: {id, g, sel, tm, korildi (ko'rsatilgan raundlar soni), rev}

  function mjPost(body, cb) {
    body = body || {};
    body.lang = lang;
    if (!window.fetch) { return; }
    window.fetch(API_MJ, { method: "POST", headers: { "Content-Type": "application/json", "X-Telegram-Init-Data": drInit() }, body: JSON.stringify(body) })
      .then(function (r) { return r.json(); })
      .then(function (res) { cb(res && res.ok ? res : (MS_LOCAL ? mjSample(body) : res)); })
      ["catch"](function () { cb(MS_LOCAL ? mjSample(body) : null); });
  }

  /* ---------- mahalliy ko'rik: serversiz namuna (kompyuter - eng kuchli kartani tashlaydi) ---------- */
  function mjSample(body) {
    if (!mjLocal) { mjLocal = { joined: false, g: null }; }
    var L2 = mjLocal, hozir = Date.now() / 1000;
    var kartalar = Object.keys(MJ_KARTA).map(function (k) {
      var st = { testral: 2, flobber: 1, gippo: 0 }[k];
      return { k: k, u: MJ_KARTA[k][0], s: MJ_KARTA[k].slice(1), top: mjTop(k), st: st == null ? -1 : st, o: st === 2 ? 1 : st === 1 ? 0.5 : 0 };
    });
    var ozing = {};
    kartalar.forEach(function (c) { ozing[c.k] = c; });
    var yur = function (g) {      // kompyuter navbati
      var men = g.hand.b, tarix = g.hist, bor = [];
      for (var i = 0; i < 5; i++) { if (!tarix.some(function (h) { return h.b.i === i; })) { bor.push(i); } }
      if (g.turn === "b" && !g.attack && bor.length) {
        var eng = null;
        bor.forEach(function (i) { MJ_S.forEach(function (s) { var v = mjKuch(men[i], s); if (!eng || v > eng.v) { eng = { i: i, s: s, v: v }; } }); });
        g.attack = { i: eng.i, s: eng.s }; g.phase = "answer"; g.left = 20;
      } else if (g.turn === "a" && g.attack && bor.length) {
        var hk = g.hand.a[g.attack.i], s2 = g.attack.s, yut = bor.filter(function (j) { return mjKuch(men[j], s2, hk) > mjKuch(hk, s2, men[j]); });
        mjSampleRaund(g, g.attack.i, yut.length ? yut[0] : bor[0]);
      }
    };
    if (body.join != null) { L2.joined = !!body.join; }
    if (body.mashq != null || body.sinov || body.dost) {
      var kod = Object.keys(MJ_KARTA).sort(function () { return Math.random() - 0.5; });
      var qol = function (q, mi) { return q.map(function (k) { return { k: k, o: mi && ozing[k].o ? ozing[k].o : 0, st: mi ? ozing[k].st : -1 }; }); };
      L2.g = { id: 7, kind: body.dost ? "dost" : body.sinov ? "sinov" : "mashq", state: body.dost ? "kutmoqda" : "ketmoqda", me: "a",
               a: { uid: 1, name: "Sehrgar", house: "gryffindor" }, b: body.dost ? null : { uid: null, name: ["Luna Lavgud", "Charli Uizli", "Nyut Skamander"][(body.mashq || 2) - 1], house: "ravenclaw", bot: body.mashq || 2 },
               hand: { a: qol(kod.slice(0, 5), true), b: qol(kod.slice(5, 10), false) }, turn: "a", attack: null, phase: "attack", hist: [], wins: [0, 0], "in": 0, left: 20,
               winner: null, why: null, expires_in: body.dost ? 1790 : null };
    }
    if (L2.g && body.oyin != null) {
      var g = L2.g;
      if (body.hujum && g.turn === "a" && !g.attack) { g.attack = { i: body.hujum.i, s: body.hujum.s }; g.phase = "answer"; yur(g); }
      else if (body.javob != null && g.turn === "b" && g.attack) { mjSampleRaund(g, g.attack.i, body.javob); }
      else if (g.state === "ketmoqda" && g.phase === "wait") { g.phase = g.attack ? "answer" : "attack"; if (g.turn === "b") { yur(g); } }
    }
    if (body.oyin != null || body.mashq != null || body.sinov || body.dost) {
      return { ok: true, game: JSON.parse(JSON.stringify(L2.g)), move_ok: (body.hujum || body.javob != null) ? true : undefined };
    }
    return { ok: true, now: hozir, admin: true, stats: { played: 3, won: 2 }, cards: kartalar,
      tour: { ts: hozir + 3 * 86400, now: hozir, open: true, joined: L2.joined, n: 4, players: [] },
      rules: { hand: 5, win: 3, turn: 20, edge: 2, grow: { "1": 0.5, "2": 1 }, points: { "2": 30, "4": 20, "8": 10, "16": 5 }, bots: { "1": "Luna Lavgud", "2": "Charli Uizli", "3": "Nyut Skamander" } },
      cup: { size: null }, champs: null };
  }
  function mjSampleRaund(g, hi, ji) {
    var nav = g.turn, ia = nav === "a" ? hi : ji, ib = nav === "a" ? ji : hi, s = g.attack.s, ka = g.hand.a[ia], kb = g.hand.b[ib];
    var va = mjKuch(ka, s, kb), vb = mjKuch(kb, s, ka), w = va > vb ? "a" : vb > va ? "b" : null;
    g.hist.push({ r: g.hist.length, by: nav, s: s, w: w, a: { i: ia, k: ka.k, v: va }, b: { i: ib, k: kb.k, v: vb } });
    if (w) { g.wins[w === "a" ? 0 : 1]++; }
    g.turn = w || (nav === "a" ? "b" : "a"); g.attack = null; g.phase = "wait"; g["in"] = 3;
    if (g.wins[0] >= 3 || g.wins[1] >= 3 || g.hist.length >= 5) { g.state = "tugadi"; g.phase = "over"; g.winner = g.wins[0] > g.wins[1] ? "a" : g.wins[1] > g.wins[0] ? "b" : null; }
  }

  /* ---------- sahifa ---------- */
  function mjOpen() {
    try { $("scr-hub").classList.add("hidden"); } catch (e) {}
    mjKorsat();
  }
  function mjKorsat() {
    drShowGame("scr-mjang");
    $("mj-kick").textContent = mjT().kick;
    $("mj-ttl").textContent = mjT().ttl;
    $("mj-home").classList.remove("hidden");
    $("mj-game").classList.add("hidden");
    $("mj-info-b").classList.remove("hidden");
    mjRender();
    mjLoad();
  }
  function mjYop() {
    clearTimeout(mjTm);
    clearInterval(mjSoat);
    mjStop();
    var ochiq = $("du-info");
    if (ochiq) { ochiq.parentNode.removeChild(ochiq); }
    $("scr-mjang").classList.add("hidden");
    openHub();
  }
  function mjLoad() {
    clearTimeout(mjTm);
    if ($("scr-mjang").classList.contains("hidden") || mj) { return; }
    mjPost({}, function (res) {
      if ($("scr-mjang").classList.contains("hidden") || mj) { return; }
      if (res && res.tour) { mjData = res; mjOlingan = Date.now(); mjRender(); }
      var d = mjData, kech = d ? d.tour.ts - d.now : 99999, jonli = d && d.cup && d.cup.size && kech < 0 && kech > -7200;
      if (d && d.active && d.active.kind === "turnir" && !MS_LOCAL) { mjOyin(d.active.id); return; }
      if (!MS_LOCAL) { mjTm = setTimeout(mjLoad, jonli || (kech < 900 && kech > -60) ? 3000 : 60000); }
    });
  }

  // Karta: rasm, nom, unsur, uch kuch (eng kuchli tomoni belgilangan, o'z maxluqi qo'shimchasi bilan)
  function mjKarta(c, o) {
    o = o || {};
    var x = MJ_KARTA[c.k], u = MJ_U[x[0]], top = mjTop(c.k);
    var el = drEl(o.tag || "div", "mj-c" + (o.cls ? " " + o.cls : ""));
    el.style.setProperty("--un", u.rgb);
    var rasm = drEl("span", "mj-c-r"), im = document.createElement("img");
    im.src = IMG_DIR + "qoriq/" + c.k + "-2.webp";
    im.alt = "";
    im.loading = "lazy";
    rasm.appendChild(im);
    rasm.appendChild(drEl("i", "mj-c-u", u.e));
    if (c.o) { rasm.appendChild(drEl("u", "mj-c-o", c.o >= 1 ? "+1" : "½")); }
    el.appendChild(rasm);
    if (!o.ism0) { el.appendChild(drEl("b", "mj-c-n", mjNom(c.k))); }
    var st = drEl("span", "mj-c-s");
    MJ_S.forEach(function (s) {
      var v = mjBaza(c.k, s) + (c.o && s === top ? c.o : 0);
      var q = drEl("em", (s === top ? "top" : "") + (o.s === s ? " on" : ""));
      q.appendChild(drEl("small", "", MJ_B[s]));
      q.appendChild(document.createTextNode(mjSon(v)));
      st.appendChild(q);
    });
    el.appendChild(st);
    return el;
  }

  function mjQol(sek) {
    sek = Math.max(0, Math.round(sek));
    if (sek >= 86400) { return Math.floor(sek / 86400) + " " + (lang === "en" ? "d" : lang === "ru" ? "дн." : "kun"); }
    if (sek >= 3600) { return Math.floor(sek / 3600) + (lang === "en" ? " h " : lang === "ru" ? " ч " : " soat ") + Math.floor(sek % 3600 / 60) + (lang === "en" ? " min" : lang === "ru" ? " мин" : " daq"); }
    return Math.floor(sek / 60) + ":" + (sek % 60 < 10 ? "0" : "") + (sek % 60);
  }
  function mjRender() {
    var d = mjData, t = mjT(), box = $("mj-home");
    box.innerHTML = "";
    clearInterval(mjSoat);
    if (!d) { return; }
    var tr = d.tour, hero = drEl("div", "dr-hero du-hero vk-hero mj-hero"), tep = drEl("div", "du-h-t"), chap = drEl("span", "du-h-m");
    chap.appendChild(drEl("small", "", t.nom));
    var kun = t.kunlar[new Date((tr.ts + 5 * 3600) * 1000).getUTCDay()];
    chap.appendChild(drEl("b", "", kun.charAt(0).toUpperCase() + kun.slice(1) + ", 22:00"));
    var iz = drEl("em", "", "");
    chap.appendChild(iz);
    tep.appendChild(chap);
    hero.appendChild(tep);
    var yoz = function () { var q = tr.ts - tr.now - (Date.now() - mjOlingan) / 1000; iz.textContent = (q > 0 ? mjQol(q) + " " + t.qoldi + " · " : "") + t.soni(tr.n); };
    yoz();
    mjSoat = setInterval(yoz, 1000);
    var yb = drEl("div", "du-yoz" + (tr.joined ? " bor" : ""));
    if (!tr.open) { yb.classList.add("bor"); yb.appendChild(drEl("b", "", tr.joined ? t.bor : t.yopiq)); }
    else if (tr.joined) {
      yb.appendChild(drEl("b", "", t.bor));
      var ch = drEl("button", "", t.chiq);
      ch.type = "button";
      ch.addEventListener("click", function () { mjPost({ join: 0 }, function (r) { if (r && r.tour) { mjData = r; mjRender(); } }); });
      yb.appendChild(ch);
    } else {
      var qb = drEl("button", "dr-btn", t.qat);
      qb.type = "button";
      qb.addEventListener("click", function () { mjPost({ join: 1 }, function (r) { if (r && r.tour) { mjData = r; mjRender(); } else { showToast(t.aloqa, "err"); } }); });
      yb.appendChild(qb);
    }
    hero.appendChild(yb);
    box.appendChild(hero);
    if (d.cup && d.cup.stages) { box.appendChild(mjTor(d.cup.stages)); }
    // mashq: uchta kompyuter raqib + do'st bilan
    var mq = drEl("div", "gb-mq");
    var mh = drEl("div", "dk-bosh");
    mh.appendChild(drEl("b", "", t.mashq));
    mh.appendChild(drEl("span", "", t.mashqS + (d.stats && d.stats.played ? " · " + t.stat(d.stats.played, d.stats.won) : "")));
    mq.appendChild(mh);
    var qator = drEl("div", "gb-bots mj-bots");
    [1, 2, 3].forEach(function (k) {
      var b = drEl("button", "gb-bot mj-bot mj-b" + k);
      b.type = "button";
      var r = drEl("span", "mj-bot-r"), im = document.createElement("img");
      im.src = IMG_DIR + "qoriq/" + ["boyogli", "ajdar", "testral"][k - 1] + "-1.webp";
      im.alt = "";
      r.appendChild(im);
      b.appendChild(r);
      b.appendChild(drEl("b", "", (d.rules && d.rules.bots && d.rules.bots[String(k)]) || ""));
      b.appendChild(drEl("small", "", t.daraja[k - 1]));
      b.addEventListener("click", function () { mjBoshla({ mashq: k }); });
      qator.appendChild(b);
    });
    var db2 = drEl("button", "gb-bot gb-bd mj-bot");
    db2.type = "button";
    db2.appendChild(drEl("span", "gb-bot-t"));
    db2.appendChild(drEl("b", "", t.dost));
    db2.appendChild(drEl("small", "", t.dostS));
    db2.addEventListener("click", function () { mjBoshla({ dost: 1 }, true); });
    qator.appendChild(db2);
    mq.appendChild(qator);
    box.appendChild(mq);
    // kartalar: 12 maxluq, o'zinikilar belgilangan
    if (d.cards) {
      var kb = drEl("div", "mj-kb");
      var kh = drEl("div", "dk-bosh");
      kh.appendChild(drEl("b", "", t.kartalar));
      kh.appendChild(drEl("span", "", t.kartalarS));
      kb.appendChild(kh);
      var to = drEl("div", "mj-to");
      d.cards.forEach(function (c) {
        var el = mjKarta(c, { cls: c.st >= 0 ? "oz" : "" });
        el.appendChild(drEl("small", "mj-c-h", c.st === 2 ? t.katta : c.st === 1 ? t.osmir : c.st === 0 ? t.bola : t.yoq));
        to.appendChild(el);
      });
      kb.appendChild(to);
      var leg = drEl("div", "mj-leg");
      ["olov", "havo", "suv"].forEach(function (u) {
        leg.appendChild(drEl("span", "", MJ_U[u].e + " " + t.unsur[u] + " › " + MJ_U[MJ_USTUN[u]].e + " " + t.unsur[MJ_USTUN[u]]));
      });
      kb.appendChild(leg);
      box.appendChild(kb);
    }
    var gk = golibKarta(d.champs);
    if (gk) { box.appendChild(gk); }
    var q = drEl("div", "vk-qoida");
    [t.q1, t.q2, t.q3].forEach(function (m, i) {
      var r2 = drEl("div", "vk-q");
      r2.appendChild(drEl("u", "", String(i + 1)));
      r2.appendChild(drEl("span", "", m));
      q.appendChild(r2);
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
      sb.addEventListener("click", function () { mjBoshla({ sinov: 1 }); });
      box.appendChild(sb);
    }
  }
  function mjTor(stages) {
    var t = mjT(), k = drEl("div", "gb-tor");
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
        if (m.state !== "kutmoqda" && m.why !== "bye") { r.addEventListener("click", function () { mjOyin(m.id); }); } else { r.disabled = true; }
        b.appendChild(r);
      });
      k.appendChild(b);
    });
    return k;
  }

  /* ---------- jang ---------- */
  function mjBoshla(body, tgga) {
    mjPost(body, function (res) {
      if (!res || !res.game) { showToast(mjT().aloqa, "err"); return; }
      mjOyin(res.game.id, res.game);
      if (tgga) { tgTaklif("mjang", res.game.id); }
    });
  }
  // Telegram kartasi bilan kelgan do'st: taklifni qabul qilib, jangga kiradi
  function mjQabul2(id) {
    var t = mjT();
    try { $("scr-cat").classList.add("hidden"); } catch (e) {}
    drShowGame("scr-mjang");
    $("mj-kick").textContent = t.kick;
    $("mj-ttl").textContent = t.ttl;
    mjPost({ qabul: id }, function (res) {
      if (res && res.game) { mjOyin(res.game.id, res.game); return; }
      showToast(res && res.error === "band" ? t.eBand : res && res.error === "muddat" ? t.eMuddat : t.aloqa, "err");
      mjKorsat();
    });
  }
  function mjStop() {
    if (!mj) { return; }
    clearTimeout(mj.tm);
    clearInterval(mj.soat);
    mj = null;
  }
  function mjOyin(id, g0) {
    mjStop();
    clearTimeout(mjTm);
    clearInterval(mjSoat);
    $("mj-home").classList.add("hidden");
    $("mj-game").classList.remove("hidden");
    $("mj-info-b").classList.add("hidden");
    $("mj-end").classList.add("hidden");
    $("mj-end").setAttribute("data-k", "");
    mj = { id: id, g: null, sel: null, tm: 0, korildi: null, rev: null, olingan: Date.now(), ver: 0, iz: "" };
    mj.soat = setInterval(mjVaqt, 250);
    if (g0) { mjQabul(g0); }
    mjSor();
  }
  function mjSor() {
    if (!mj) { return; }
    var me = mj, ver = mj.ver;
    clearTimeout(mj.tm);
    mjPost({ oyin: mj.id }, function (res) {
      if (mj !== me) { return; }
      // so'rov yuborilgandan keyin yurish qilingan bo'lsa - bu javob eskirgan (ekran bir lahza eski holatga qaytmasin)
      if (res && res.game && mj.ver === ver) { mjQabul(res.game); }
      mj.tm = setTimeout(mjSor, 1000);
    });
  }
  function mjQabul(g) {
    var eski = mj.g;
    if (mj.korildi == null) { mj.korildi = g.hist.length; }
    if (g.hist.length > mj.korildi) {          // yangi raund natijasi - ko'rsatiladi
      mj.rev = { h: g.hist[g.hist.length - 1], t: Date.now() };
      mj.korildi = g.hist.length;
      mj.sel = null;
      var h = mj.rev.h;
      if (g.me && h.w === g.me) { try { if (tg && tg.HapticFeedback) { tg.HapticFeedback.notificationOccurred("success"); } } catch (e) {} }
    }
    if (eski && (eski.turn !== g.turn || !!eski.attack !== !!g.attack || eski.hist.length !== g.hist.length)) { mj.sel = null; }
    mj.g = g;
    mj.olingan = Date.now();
    // holat o'zgarmagan bo'lsa qayta chizilmaydi (har soniyada qayta chizish bosilayotgan tugmani yo'qotib qo'yardi); vaqtni mjVaqt yuritadi
    var iz = JSON.stringify([g.state, g.phase, g.turn, g.attack, g.hist.length, g.wins, g.winner, mj.sel, g.expires_in != null ? Math.round(g.expires_in / 10) : 0]);
    if (iz === mj.iz && !(mj.rev && Date.now() - mj.rev.t < 4300)) { return; }
    mj.iz = iz;
    mjChiz();
  }
  function mjBor(g, yon) {
    var bor = [];
    for (var i = 0; i < (g.hand[yon] || []).length; i++) { if (!g.hist.some(function (h) { return h[yon].i === i; })) { bor.push(i); } }
    return bor;
  }
  function mjVaqt() {
    var g = mj && mj.g;
    if (!g) { return; }
    var o = (Date.now() - mj.olingan) / 1000, v = $("mj-v"), son = $("mj-vs2"), T = g.turn_t || MJ_RAUND_T;
    if (g.state === "ketmoqda" && (g.phase === "attack" || g.phase === "answer") && g["in"] - o <= 0) {
      var q = Math.max(0, g.left - o);
      v.style.width = Math.min(100, q / T * 100) + "%";
      v.parentNode.classList.toggle("oz", q < 8);
      son.textContent = Math.ceil(q) + " s";
      son.classList.toggle("oz", q < 8);
      // belgilangan karta bor, lekin tasdiqlanmagan - vaqt tugashidan oldin o'zi yuboriladi (server tasodifiy karta qo'ymasin);
      // hujumda kuch tanlanmagan bo'lsa - kartaning eng kuchli tomoni
      var navim = g.me && ((g.phase === "attack" && g.turn === g.me) || (g.phase === "answer" && g.turn !== g.me));
      if (navim && mj.sel != null && q <= MJ_AVTO && !mj.yubordi) {
        if (g.phase === "attack") { mjYubor({ hujum: { i: mj.sel, s: mjTop(g.hand[g.me][mj.sel].k) } }); }
        else { mjYubor({ javob: mj.sel }); }
      }
    } else { v.style.width = "0"; son.textContent = ""; }
  }

  function mjChiz() {
    var g = mj.g, t = mjT();
    if (!g) { return; }
    var men = g.me || "a", u = men === "a" ? "b" : "a";
    if (g.kind === "dost" && g.state === "kutmoqda") { mjKutish(); return; }
    var eb = $("mj-end");
    if (eb.getAttribute("data-k") === "kut") { eb.setAttribute("data-k", ""); eb.classList.add("hidden"); eb.innerHTML = ""; }
    // o'yinchilar: gerb, ism, yutgan raundlar
    var oyinchi = function (k, el) {
      var p = g[k];
      el.innerHTML = "";
      var hujumchi = g.state === "ketmoqda" && g.turn === k;
      el.classList.toggle("faol", hujumchi);
      var x = HOUSES[validHouse(p && p.house) || ""];
      el.style.setProperty("--uy", x ? x.rgb : "214,220,230");
      var tep = drEl("div", "gb-p-t"), cr = cupCrestImg(p && p.house, 24);
      if (cr) { tep.appendChild(cr); }
      tep.appendChild(drEl("b", "", p ? (g.me && k === g.me ? t.siz : p.name) : "—"));
      el.appendChild(tep);
      var past = drEl("div", "gb-p-b"), pips = drEl("span", "gb-pips mj-pips"), n = g.wins[k === "a" ? 0 : 1];
      for (var i = 0; i < 3; i++) { pips.appendChild(drEl("i", i < n ? "on" : "")); }
      past.appendChild(pips);
      if (hujumchi) { past.appendChild(drEl("small", "mj-hj", "⚔️")); }
      el.appendChild(past);
    };
    oyinchi(men, $("mj-p1"));
    oyinchi(u, $("mj-p2"));
    $("mj-z").textContent = t.raund(Math.min(5, g.hist.length + (g.state === "ketmoqda" && !(mj.rev && Date.now() - mj.rev.t < 4000) ? 1 : 0)) || 1);
    // raqib qo'li
    var oq = $("mj-opp");
    oq.innerHTML = "";
    (g.hand[u] || []).forEach(function (c, i) {
      var ish = g.hist.some(function (h) { return h[u].i === i; }), hj = g.attack && g.turn === u && g.attack.i === i;
      oq.appendChild(mjKarta(c, { cls: "kich" + (ish ? " ish" : "") + (hj ? " hj" : ""), ism0: true, s: hj ? g.attack.s : null }));
    });
    mjArena();
    mjQol2();
    if (g.state === "tugadi" && !(mj.rev && Date.now() - mj.rev.t < 2600)) { mjYakun(); }
    else if (g.state === "tugadi") { setTimeout(function () { if (mj && mj.g === g) { mjYakun(); } }, 2700); }
  }

  // O'rta maydon: hujum, javob, raund natijasi
  function mjArena() {
    var g = mj.g, t = mjT(), men = g.me || "a", u = men === "a" ? "b" : "a", ar = $("mj-ar"), h = $("mj-h");
    ar.innerHTML = "";
    ar.className = "mj-ar";
    var slot = function (c, o) {
      var s = drEl("div", "mj-sl" + (o && o.cls ? " " + o.cls : ""));
      if (c) {
        s.appendChild(mjKarta(c, { cls: "kat", s: o && o.s }));
        if (o && o.v != null) {
          var v = drEl("div", "mj-v");
          v.appendChild(drEl("strong", "", mjSon(o.v)));
          if (o.ust) { v.appendChild(drEl("small", "", t.ustun)); }
          s.appendChild(v);
        }
      } else { s.appendChild(drEl("span", "mj-sl-q", "?")); }
      return s;
    };
    var vs = drEl("span", "mj-vs", "VS");
    var r = mj.rev;
    if (r && Date.now() - r.t < 4200) {          // raund natijasi
      var hh = r.h, a1 = hh[men], b1 = hh[u];
      ar.classList.add("rev");
      ar.appendChild(slot(g.hand[men][a1.i], { s: hh.s, v: a1.v, ust: a1.u, cls: hh.w === men ? "yut" : hh.w ? "yiq" : "" }));
      vs.textContent = t.kuchlar[hh.s];
      ar.appendChild(vs);
      ar.appendChild(slot(g.hand[u][b1.i], { s: hh.s, v: b1.v, ust: b1.u, cls: hh.w === u ? "yut" : hh.w ? "yiq" : "" }));
      h.textContent = !g.me ? (hh.w ? t.rOldi(g[hh.w].name) : t.rTeng) : hh.w === men ? t.rYutdi : hh.w ? t.rYutqazdi : t.rTeng;
      h.className = "mj-h " + (hh.w === men ? "y" : hh.w ? "m" : "");
      $("mj-act").innerHTML = "";
      mjQolChiz();
      clearTimeout(mj.revTm);
      mj.revTm = setTimeout(function () { if (mj) { mjChiz(); } }, 4250 - (Date.now() - r.t));
      return;
    }
    h.className = "mj-h";
    var nav = g.turn, hujumchi = nav, javobchi = nav === "a" ? "b" : "a";
    if (g.state !== "ketmoqda" || g.phase === "wait") {
      ar.appendChild(slot(null));
      ar.appendChild(vs);
      ar.appendChild(slot(null));
      h.textContent = g.hist.length ? "" : t.boshlanadi + (g.turn && g[g.turn] ? " " + t.birinchi(g.me && g.turn === g.me ? t.siz : g[g.turn].name) : "");
    } else if (g.phase === "attack") {
      var mening = g.me && hujumchi === g.me;
      var sc = mening && mj.sel != null ? g.hand[men][mj.sel] : null;
      ar.appendChild(slot(sc, { cls: mening ? "tan" : "" }));
      ar.appendChild(vs);
      ar.appendChild(slot(null));
      h.textContent = mening ? (mj.sel != null ? t.hujumKuch : t.hujumSiz) : t.hujumR(g[hujumchi] ? g[hujumchi].name : "");
    } else {                                    // javob
      var hk = g.hand[hujumchi][g.attack.i], s = g.attack.s, menJ = g.me && javobchi === g.me;
      var sel = menJ && mj.sel != null ? g.hand[men][mj.sel] : null;
      var hv = mjKuch(hk, s, sel), jv = sel ? mjKuch(sel, s, hk) : null;
      var chap = hujumchi === men ? slot(hk, { s: s, v: hv }) : slot(sel, { s: s, v: jv, cls: sel ? (jv > hv ? "yut" : jv < hv ? "yiq" : "") + " tan" : "tan" });
      var ong = hujumchi === men ? slot(null) : slot(hk, { s: s, v: hv });
      ar.appendChild(chap);
      vs.textContent = t.kuchlar[s];
      ar.appendChild(vs);
      ar.appendChild(ong);
      if (menJ) {
        h.textContent = sel ? (mjNom(sel.k) + ": " + mjSon(jv) + " — " + (jv > hv ? t.yutadi : jv < hv ? t.yutqazadi : t.teng)) : t.javobSiz(mjNom(hk.k), t.kuchlar[s], mjSon(mjKuch(hk, s)));
      } else { h.textContent = t.javobR(g[javobchi] ? g[javobchi].name : ""); }
    }
    mjQolChiz();
  }

  // O'z qo'lim va tanlov tugmalari
  function mjQolChiz() {
    var g = mj.g, t = mjT(), men = g.me || "a", q = $("mj-hand"), act = $("mj-act");
    q.innerHTML = "";
    act.innerHTML = "";
    var rev = mj.rev && Date.now() - mj.rev.t < 4200;
    var navMen = g.me && g.state === "ketmoqda" && !rev && g["in"] - (Date.now() - mj.olingan) / 1000 <= 0.2 &&
      ((g.phase === "attack" && g.turn === g.me) || (g.phase === "answer" && g.turn !== g.me));
    var bor = mjBor(g, men);
    (g.hand[men] || []).forEach(function (c, i) {
      var ish = bor.indexOf(i) < 0;
      var el = mjKarta(c, { tag: "button", cls: "mening" + (ish ? " ish" : "") + (mj.sel === i ? " sel" : "") + (navMen && !ish ? " faol" : "") });
      el.type = "button";
      el.disabled = ish || !navMen;
      el.addEventListener("click", function () { mj.sel = mj.sel === i ? null : i; mj.iz = ""; mjChiz(); });
      q.appendChild(el);
    });
    if (!navMen || mj.sel == null) { return; }
    var c = g.hand[men][mj.sel];
    if (g.phase === "attack") {
      MJ_S.forEach(function (s) {
        var b = drEl("button", "mj-sb" + (s === mjTop(c.k) ? " top" : ""));
        b.type = "button";
        b.appendChild(drEl("small", "", MJ_B[s] + " " + t.kuchlar[s]));
        b.appendChild(drEl("strong", "", mjSon(mjKuch(c, s))));
        b.addEventListener("click", function () { mjYubor({ hujum: { i: mj.sel, s: s } }); });
        act.appendChild(b);
      });
    } else {
      var jb = drEl("button", "dr-btn mj-jb", t.javobB);
      jb.type = "button";
      jb.addEventListener("click", function () { mjYubor({ javob: mj.sel }); });
      act.appendChild(jb);
    }
  }
  function mjYubor(body) {
    if (!mj || mj.yubordi) { return; }
    var me = mj;
    body.oyin = mj.id;
    mj.ver++;
    mj.yubordi = true;
    $("mj-act").innerHTML = "";
    mjPost(body, function (res) {
      if (mj !== me) { return; }
      mj.yubordi = false;
      if (res && res.game) { mj.sel = null; mj.iz = ""; mjQabul(res.game); }
      if (!res || res.move_ok === false) { showToast(mjT().aloqa, "err"); }
    });
  }
  function mjQol2() { mjVaqt(); }

  function mjKutish() {
    var g = mj.g, t = mjT(), box = $("mj-end");
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
      tb.addEventListener("click", function () { if (mj) { tgTaklif("mjang", mj.id); } });
      bb.addEventListener("click", function () { var id = mj && mj.id; mjPost({ bekor: id }, function () {}); mjStop(); mjKorsat(); });
      tug.appendChild(tb);
      tug.appendChild(bb);
      k.appendChild(tug);
      box.appendChild(k);
    }
    var m = box.querySelector(".gb-kut-m");
    if (m && g.expires_in != null) { m.textContent = t.muddat(mjQol(g.expires_in)); }
  }

  function mjYakun() {
    var g = mj.g, t = mjT(), box = $("mj-end");
    if (!box.classList.contains("hidden") || g.state !== "tugadi") { return; }
    box.innerHTML = "";
    box.setAttribute("data-k", "end");
    box.classList.remove("hidden");
    var men = g.me || "a", u = men === "a" ? "b" : "a", yutdi = g.me && g.winner === g.me, yutqazdi = g.me && g.winner && g.winner !== g.me;
    var k = drEl("div", "gb-e-k" + (yutdi ? " g" : yutqazdi ? " mj-m" : ""));
    k.appendChild(drEl("small", "gb-e-kick", yutdi ? t.galaba : yutqazdi ? t.maglub : t.yakunK));
    k.appendChild(drEl("b", "gb-e-t", yutdi ? t.yutdi : yutqazdi ? t.yutqazdi : g.winner ? t.golibi(g[g.winner].name) : t.durang));
    var vs = drEl("div", "gb-e-vs");
    var oyinchi = function (yon) {
      var p = g[yon], d = drEl("div", "gb-e-o" + (g.winner === yon ? " yut" : ""));
      var x = HOUSES[validHouse(p && p.house) || ""];
      d.style.setProperty("--uy", x ? x.rgb : "214,220,230");
      var gerb = drEl("span", "gb-e-g"), cr = cupCrestImg(p && p.house, 58);
      if (cr) { gerb.appendChild(cr); }
      if (g.winner === yon) { gerb.appendChild(drEl("u", "gb-toj", "✦")); }
      d.appendChild(gerb);
      d.appendChild(drEl("b", "", p ? (g.me && yon === g.me ? t.siz : p.name) : "—"));
      d.appendChild(drEl("strong", "", String(g.wins[yon === "a" ? 0 : 1])));
      return d;
    };
    vs.appendChild(oyinchi(men));
    vs.appendChild(drEl("span", "gb-e-x", ":"));
    vs.appendChild(oyinchi(u));
    k.appendChild(vs);
    // raundlar izi
    var iz = drEl("div", "mj-iz");
    g.hist.forEach(function (h) {
      var r = drEl("span", "mj-iz-r " + (h.w === men ? "y" : h.w ? "m" : ""));
      r.appendChild(drEl("small", "", MJ_B[h.s]));
      r.appendChild(drEl("b", "", mjSon(h[men].v) + ":" + mjSon(h[u].v)));
      iz.appendChild(r);
    });
    k.appendChild(iz);
    if (g.why === "kelmadi") { k.appendChild(drEl("p", "", t.kelmadi)); }
    else if (g.why === "teng") { k.appendChild(drEl("p", "", t.tengT)); }
    var tug = drEl("div", "gb-e-b");
    if (g.kind === "dost" && g.me) {
      var dy = drEl("button", "dr-btn", t.yana);
      dy.type = "button";
      dy.addEventListener("click", function () { mjBoshla({ dost: 1 }, true); });
      tug.appendChild(dy);
    }
    if ((g.kind === "mashq" || g.kind === "sinov") && g.b && g.b.bot) {
      var y = drEl("button", "dr-btn", t.yana);
      y.type = "button";
      y.addEventListener("click", function () { mjBoshla(g.kind === "sinov" ? { sinov: 1 } : { mashq: g.b.bot }); });
      tug.appendChild(y);
    }
    var o = drEl("button", "dr-btn gb-ikki", t.ortga);
    o.type = "button";
    o.addEventListener("click", function () { mjStop(); mjKorsat(); });
    tug.appendChild(o);
    k.appendChild(tug);
    box.appendChild(k);
    if (yutdi) { try { if (tg && tg.HapticFeedback) { tg.HapticFeedback.notificationOccurred("success"); } } catch (e) {} }
  }

  function mjInfo() {
    var eski = $("du-info"), t = mjT(), r = (mjData && mjData.rules) || {}, pt = r.points || {};
    if (eski) { eski.parentNode.removeChild(eski); }
    var bandlar = lang === "ru" ? [
      ["Карты", "12 существ из заповедника. У каждого три силы — Сила, Защита и Ловкость (сумма у всех одинакова) — и стихия. Огонь бьёт воздух, воздух — воду, вода — огонь: такая карта получает +2."],
      ["Раздача", "Каждому 5 случайных карт. Обе руки открыты: вы видите карты соперника и какие он уже сыграл."],
      ["Раунд", "Атакующий выбирает карту и силу. Соперник видит её и отвечает своей картой. Сравнивается выбранная сила (со стихией), сильнейшая берёт раунд."],
      ["Кто атакует", "Первым — случайно. Дальше атакует тот, кто взял раунд; при ничьей атака переходит к сопернику. Каждая карта — один раз."],
      ["Победа", "Кто первым взял 3 раунда. После 5 раундов при равенстве — по сумме сил."],
      ["Ваши существа", "Если вам выпало ваше существо из заповедника, его самая сильная сторона сильнее: подросток выигрывает ничью, взрослое +1. Кормите существ — и они помогут."],
      ["Время", "На выбор " + (r.turn || 20) + " секунд. Не успели — карта выбирается сама."],
      ["Турнир", "Каждую субботу в 22:00. Очки за победу: 1/8 +" + (pt["16"] || 5) + ", четвертьфинал +" + (pt["8"] || 10) + ", полуфинал +" + (pt["4"] || 20) + ", финал +" + (pt["2"] || 30) + "."]]
      : lang === "en" ? [
      ["The cards", "12 creatures from the sanctuary. Each has three powers — Power, Defence and Agility (the sum is the same for all) — and an element. Fire beats air, air beats water, water beats fire: such a card gets +2."],
      ["The deal", "Everyone gets 5 random cards. Both hands are open: you see the rival's cards and which ones are already played."],
      ["A round", "The attacker chooses a card and a power. The rival sees it and answers with a card. The chosen power is compared (with the element bonus), the stronger card takes the round."],
      ["Who attacks", "The first attacker is random. After that whoever took the round attacks; on a tie the attack passes to the rival. Every card is played once."],
      ["Victory", "First to 3 rounds. After 5 rounds, a tie is decided by the sum of powers."],
      ["Your creatures", "If you are dealt one of your own creatures, its strongest side is stronger: a young one wins ties, an adult gets +1. Feed your creatures and they will help."],
      ["Time", (r.turn || 20) + " seconds per choice. If you run out, a card is chosen for you."],
      ["Tournament", "Every Saturday at 22:00. Points for a win: round of 16 +" + (pt["16"] || 5) + ", quarter-final +" + (pt["8"] || 10) + ", semi-final +" + (pt["4"] || 20) + ", final +" + (pt["2"] || 30) + "."]]
      : [
      ["Kartalar", "Qo'riqxonaning 12 maxluqi. Har birida uchta kuch bor — Kuch, Himoya va Chaqqonlik (yig'indisi hammada bir xil) — va unsur. Olov havoni, havo suvni, suv olovni yengadi: shunday karta +2 oladi."],
      ["Tarqatish", "Har kimga 5 ta tasodifiy karta. Ikkala qo'l ham ochiq: raqibning kartalarini va qaysilarini ishlatib bo'lganini ko'rib turasiz."],
      ["Raund", "Hujum qiluvchi karta va kuchni tanlaydi. Raqib uni ko'rib, javob kartasini beradi. Tanlangan kuch solishtiriladi (unsur bilan), kuchlisi raundni oladi."],
      ["Kim hujum qiladi", "Birinchi — tasodifiy. Keyin raundni yutgan hujum qiladi; teng bo'lsa hujum raqibga o'tadi. Har karta bir marta."],
      ["G'alaba", "Birinchi bo'lib 3 raund yutgan. 5 raunddan keyin teng bo'lsa — kuchlar yig'indisi."],
      ["O'z maxluqlaringiz", "Qo'lingizga Qo'riqxonadagi o'z maxluqingiz tushsa, uning eng kuchli tomoni kuchliroq: o'smir teng holatda yutadi, katta +1. Maxluqlarni boqing — ular yordam beradi."],
      ["Vaqt", "Har tanlovga " + (r.turn || 20) + " soniya. Ulgurmasangiz karta o'zi tanlanadi."],
      ["Turnir", "Har shanba 22:00 da. G'alaba uchun: 1/8 final +" + (pt["16"] || 5) + ", chorak final +" + (pt["8"] || 10) + ", yarim final +" + (pt["4"] || 20) + ", final +" + (pt["2"] || 30) + "."]];
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

  function mjSetup() {
    $("mj-back").addEventListener("click", function () {
      if (mj) { mjStop(); mjKorsat(); return; }
      mjYop();
    });
    $("mj-info-b").addEventListener("click", mjInfo);
  }

  mjSetup();
