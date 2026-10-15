/* TOSHCHALAR VA MAXLUQLAR JANGIGA XOGVARTS CHATI ORQALI CHAQIRISH (o'quvchilar taklifi, egasi 2026-10-15).
   Duel qolipida: chatga karta tushadi (Katta zal, fakultet xonasi yoki shaxsiy suhbat), birinchi «Qabul qilish» bosgan raqib bo'ladi;
   karta holati jonli: kutmoqda -> ketmoqda -> tugadi. O'yin ketayotganda boshqalar uni tomosha qila oladi.
   Server: chat amali "tosh" / "mjang" (hpbot), karta ma'lumoti m.tosh / m.mjang (hpcup._chat_row).
   Ilova kodi bir necha faylga bo'lingan; hammasi BIR umumiy maydonda ishlaydi
   va index.html dagi TARTIBDA yuklanadi. Yuklanish paytida keyingi fayldagi
   narsani chaqirmang - tekshiruv: tools/tartib.js */
"use strict";

  var TK_T = {
    uz: { tosh: { cT: "Toshchalar", sh: "Kimni Toshchalar o'yiniga chaqirasiz?", peer: "Toshchalarga chaqirish" },
          mjang: { cT: "Maxluqlar jangi", sh: "Kimni Maxluqlar jangiga chaqirasiz?", peer: "Maxluqlar jangiga chaqirish" },
          cSub: "Do'stona · ballsiz", cMine: "Siz chaqirdingiz — raqib kutilmoqda", cCalls: function (n) { return n + " o'yinga chaqirmoqda!"; },
          cAccept: "Qabul qilish", cOpen: "O'yinga kirish", cWatch: "Tomosha qilish", cPlaying: "o'yin ketmoqda", cWon: function (n) { return n + " yutdi"; },
          cDraw: "durang", cView: "Natijani ko'rish", cExp: "Taklif muddati tugadi",
          tg: "Telegram chatiga yuborish", tgS: "Do'stingizga yoki guruhga karta — bosishi bilan o'yin boshlanadi",
          zal: "Katta zalga e'lon", zalS: "Barcha fakultetlar ko'radi", uy: "Fakultet xonasiga", uyS: "Faqat o'z fakultetingiz",
          dm: function (p) { return "Bitta do'stingizni chaqirish uchun: u bilan shaxsiy suhbatni oching va tepadagi ismini bosing → «" + p + "»."; },
          yubordi: "Taklif chatga yuborildi", eTaken: "Bu taklifni boshqa sehrgar qabul qilib bo'ldi", eExp: "Taklif muddati tugagan" },
    ru: { tosh: { cT: "Плюй-камни", sh: "Кого позвать сыграть в плюй-камни?", peer: "Позвать в плюй-камни" },
          mjang: { cT: "Битва существ", sh: "Кого позвать на Битву существ?", peer: "Позвать на Битву существ" },
          cSub: "Дружеская · без очков", cMine: "Вы позвали — ждём соперника", cCalls: function (n) { return n + " зовёт сыграть!"; },
          cAccept: "Принять", cOpen: "Войти в игру", cWatch: "Смотреть", cPlaying: "идёт игра", cWon: function (n) { return "победил " + n; },
          cDraw: "ничья", cView: "Посмотреть итог", cExp: "Срок приглашения истёк",
          tg: "Отправить в чат Telegram", tgS: "Карточка другу или в группу — нажмёт, и игра начнётся",
          zal: "Объявить в Большом зале", zalS: "Увидят все факультеты", uy: "В гостиную факультета", uyS: "Только ваш факультет",
          dm: function (p) { return "Чтобы позвать одного друга: откройте личный чат с ним и нажмите на его имя вверху → «" + p + "»."; },
          yubordi: "Приглашение отправлено в чат", eTaken: "Это приглашение уже принял другой", eExp: "Срок приглашения истёк" },
    en: { tosh: { cT: "Gobstones", sh: "Who do you challenge to Gobstones?", peer: "Challenge to Gobstones" },
          mjang: { cT: "Creature Battle", sh: "Who do you challenge to a Creature Battle?", peer: "Challenge to a Creature Battle" },
          cSub: "Friendly · no points", cMine: "You sent a challenge — waiting for a rival", cCalls: function (n) { return n + " is calling for a game!"; },
          cAccept: "Accept", cOpen: "Enter the game", cWatch: "Watch", cPlaying: "game in progress", cWon: function (n) { return n + " won"; },
          cDraw: "draw", cView: "See the result", cExp: "The invite has expired",
          tg: "Send to a Telegram chat", tgS: "A card for a friend or a group — the game starts as soon as they tap it",
          zal: "Announce in the Great Hall", zalS: "All houses will see it", uy: "To your common room", uyS: "Only your house",
          dm: function (p) { return "To challenge one friend: open a private chat with them and tap their name at the top → “" + p + "”."; },
          yubordi: "Invite sent to the chat", eTaken: "Someone else has already accepted this invite", eExp: "The invite has expired" }
  };
  function tkT() { return TK_T[lang] || TK_T.uz; }

  // «Kimni chaqirasiz?» oynasi: Telegram chati, Katta zal yoki fakultet xonasi (duel oynasi uslubida)
  function tkOyna(kind) {
    var eski = $("du-info"), t = tkT(), k = t[kind];
    if (eski) { eski.parentNode.removeChild(eski); }
    var orqa = drEl("div", "du-info"), oyna = drEl("div", "du-info-p"), yop = function () { if (orqa.parentNode) { orqa.parentNode.removeChild(orqa); } };
    orqa.id = "du-info";
    var bosh = drEl("div", "du-info-h");
    bosh.appendChild(drEl("b", "", k.sh));
    var xb = drEl("button", "", "×");
    xb.type = "button";
    xb.addEventListener("click", yop);
    bosh.appendChild(xb);
    oyna.appendChild(bosh);
    var tana = drEl("div", "du-info-b du-dz");
    [["tg", t.tg, t.tgS], ["global", t.zal, t.zalS], ["house", t.uy, t.uyS]].forEach(function (q) {
      var b = drEl("button", "du-dz-b");
      b.type = "button";
      var s2 = document.createElement("span");
      s2.appendChild(drEl("b", "", q[1]));
      s2.appendChild(drEl("small", "", q[2]));
      b.appendChild(s2);
      b.appendChild(drEl("i", "", "›"));
      b.addEventListener("click", function () {
        yop();
        if (q[0] !== "tg") { tkInvite(kind, q[0]); }
        else if (kind === "tosh") { gbBoshla({ dost: 1 }, true); }
        else { mjBoshla({ dost: 1 }, true); }
      });
      tana.appendChild(b);
    });
    tana.appendChild(drEl("p", "du-dz-n", t.dm(k.peer)));
    oyna.appendChild(tana);
    orqa.appendChild(oyna);
    orqa.addEventListener("click", function (e) { if (e.target === orqa) { yop(); } });
    document.body.appendChild(orqa);
  }

  // Chatga taklif: server ochiq o'yin yaratadi va chatga karta qo'yadi; chaqiruvchi o'yin ekranida raqibni kutadi
  function tkInvite(kind, room) {
    var t = tkT(), d = drInit();
    if (MS_LOCAL) { showToast(t.yubordi); tkOch(kind, 9); return; }
    window.fetch(API_CHAT, { method: "POST", headers: { "Content-Type": "application/json", "X-Telegram-Init-Data": d },
      body: JSON.stringify({ action: kind, room: room, v: 2, initData: d }) })
      .then(function (r) { return r.json(); })
      .then(function (res) {
        if (res && res.ok && res.game_id) { showToast(t.yubordi); tkOch(kind, res.game_id); return; }
        showToast(res && res.error === "slow" ? L("chatSlow").replace("%s", res.retry || 5) : res && res.error === "banned" ? L("chatBannedShort")
          : res && String(res.error || "").indexOf("dm_") === 0 ? L("chatDmClosedShort") : drX().fail, "err");
      })["catch"](function () { showToast(drX().fail, "err"); });
  }

  // O'yin ekranini istalgan joydan (chat) ochadi: o'yinchi bo'lsa - o'yin, bo'lmasa - tomosha
  function tkOch(kind, id) {
    try { if (!$("scr-chat").classList.contains("hidden")) { closeChat(); } } catch (e) {}
    ["scr-cup", "scr-hub", "scr-cat"].forEach(function (s2) { var e = $(s2); if (e) { e.classList.add("hidden"); } });
    if (kind === "tosh") {
      drShowGame("scr-tosh");
      $("gb-kick").textContent = gbT().kick;
      $("gb-ttl").textContent = gbT().ttl;
      gbOyin(id);
    } else {
      drShowGame("scr-mjang");
      $("mj-kick").textContent = mjT().kick;
      $("mj-ttl").textContent = mjT().ttl;
      mjOyin(id);
    }
  }

  // Chatdagi karta tugmasi: qabul qilish (yoki o'z taklifiga qaytish) - qolganlari tkOch
  function tkFromChat(kind, id, qabul) {
    if (!qabul) { tkOch(kind, id); return; }
    try { if (!$("scr-chat").classList.contains("hidden")) { closeChat(); } } catch (e) {}
    try { $("scr-hub").classList.add("hidden"); } catch (e) {}
    if (kind === "tosh") { gbQabul2(id); } else { mjQabul2(id); }
  }

  // Chat xabari o'rnidagi karta (holati jonli)
  function tkChatCard(m) {
    var kind = m.tosh ? "tosh" : "mjang", c = m[kind], t = tkT(), me = (tgUser() || {}).id || 0;
    var el = drEl("div", "cmc cmc-tk cmc-" + kind);
    var an = (c.a && c.a.name) || "Sehrgar", bn = (c.b && c.b.name) || "Sehrgar", menda = me && (me === c.a.uid || (c.b && me === c.b.uid));
    var bosh = drEl("div", "cmc-h"), ic = drEl("span", "cmc-ic"), im = document.createElement("img"), tx = document.createElement("div");
    im.src = IMG_DIR + "hub/" + kind + ".webp";
    im.alt = "";
    ic.appendChild(im);
    tx.appendChild(drEl("b", "", t[kind].cT));
    tx.appendChild(drEl("span", "", t.cSub));
    bosh.appendChild(ic); bosh.appendChild(tx);
    el.appendChild(bosh);
    var st = "", tugma = null, sc = c.score || [0, 0];
    if (c.status === "waiting") {
      if (me === c.a.uid) { st = t.cMine; tugma = [t.cOpen, 1, false]; } else { st = t.cCalls(an); tugma = [t.cAccept, 1, true]; }
    } else if (c.status === "active") {
      st = an + " ⚔ " + bn + " — " + t.cPlaying + " (" + sc[0] + " : " + sc[1] + ")";
      tugma = [menda ? t.cOpen : t.cWatch, 0, false];
    } else if (c.status === "finished" && c.b) {
      st = an + " ⚔ " + bn + " — " + (c.winner ? t.cWon(c.winner === c.a.uid ? an : bn) : t.cDraw) + " (" + sc[0] + " : " + sc[1] + ")";
      tugma = [t.cView, 0, false];
    } else { st = t.cExp; }
    el.appendChild(drEl("div", "cmc-s", st));
    if (tugma) {
      var b = drEl("button", "cmc-b" + (tugma[2] ? " gold" : ""), tugma[0]);
      b.type = "button";
      b.setAttribute("data-tk", kind);
      b.setAttribute("data-tk-q", tugma[1] ? "1" : "0");
      b.setAttribute("data-g", String(c.id));
      el.appendChild(b);
    }
    return el;
  }
