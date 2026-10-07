/* Sehrgar profili: boshqa odam (yoki o'zi) haqidagi oyna - fakultet, tayoqcha, Patronus, nishonlar
   Ilova kodi bir necha faylga bo'lingan; hammasi BIR umumiy maydonda ishlaydi
   va index.html dagi TARTIBDA yuklanadi. Yuklanish paytida keyingi fayldagi
   narsani chaqirmang - tekshiruv: tools/tartib.js */
"use strict";
  /* Ma'lumot botdan (hpprofil.py, POST /api/profil {uid}). Oyna #odam - sahifa ustida ochiladi (chat ustida ham).
     Hozircha chatdan ochiladi: xabar menyusi va shaxsiy suhbat sarlavhasi. */
  var API_PROFIL = "https://bot.tizimshunos.uz/api/profil";
  var ODAM_TX = {
    uz: { kick: "Sehrgar", noHouse: "Hali saralanmagan", since: function (d) { return "Xogvartsda " + d + " dan"; },
          week: "Shu hafta", all: "Jami ball", films: "Filmlar", wand: "Tayoqcha", pat: "Patronus", badges: "Nishonlar",
          noWand: "Hali tayoqchasi yo'q", noPat: "Patronusini hali chaqirmagan", noBadges: "Hali nishoni yo'q",
          inch: "dyuym", cards: "Sehrgar kartochkalari", chess: "Shaxmat reytingi", games: function (n, w) { return n + " o'yin · " + w + " g'alaba"; },
          online: "hozir ilovada", peer: "Profilni ko'rish", write: "Xabar yozish", close: "Yopish", you: "Bu siz", fail: "Profil ochilmadi", anon: "Sehrgar" },
    ru: { kick: "Волшебник", noHouse: "Ещё не распределён", since: function (d) { return "В Хогвартсе с " + d; },
          week: "За неделю", all: "Всего очков", films: "Фильмы", wand: "Палочка", pat: "Патронус", badges: "Значки",
          noWand: "Палочки пока нет", noPat: "Патронус ещё не вызван", noBadges: "Значков пока нет",
          inch: "дюймов", cards: "Карточки волшебников", chess: "Шахматный рейтинг", games: function (n, w) { return "Игр: " + n + " · побед: " + w; },
          online: "сейчас в приложении", peer: "Открыть профиль", write: "Написать", close: "Закрыть", you: "Это вы", fail: "Профиль не открылся", anon: "Волшебник" },
    en: { kick: "Wizard", noHouse: "Not sorted yet", since: function (d) { return "At Hogwarts since " + d; },
          week: "This week", all: "Total points", films: "Films", wand: "Wand", pat: "Patronus", badges: "Badges",
          noWand: "No wand yet", noPat: "Has not cast a Patronus yet", noBadges: "No badges yet",
          inch: "inches", cards: "Wizard cards", chess: "Chess rating", games: function (n, w) { return n + " games · " + w + " wins"; },
          online: "in the app now", peer: "View profile", write: "Send a message", close: "Close", you: "This is you", fail: "Could not open the profile", anon: "Wizard" }
  };
  var odamBusy = false, odamCur = null;

  function odamX() { return ODAM_TX[lang] || ODAM_TX.uz; }
  function odamInit() { try { return (tg && tg.initData) || ""; } catch (e) { return ""; } }
  function odamEl(tag, cls, text) {
    var el = document.createElement(tag);
    if (cls) { el.className = cls; }
    if (text != null) { el.textContent = text; }
    return el;
  }
  function odamSana(s) {
    var m = /^(\d{4})-(\d{2})-(\d{2})/.exec(s || "");
    return m ? m[3] + "." + m[2] + "." + m[1] : "";
  }

  // Mahalliy ko'rikda server yo'q - namuna
  function odamSample(uid, hint) {
    return { ok: true, uid: uid, me: false, name: (hint && hint.name) || "Germiona", house: (hint && hint.house) || "gryffindor",
             since: "2026-09-14", online: false, seen: new Date(Date.now() - 47 * 60000).toISOString(), wand: { wood: "holly", core: "phoenix", flex: "rigid" }, patronus: "otter",
             points: { week: 45, all: 310 }, films: 9, cards: 6, chess: { rating: 1284, games: 14, wins: 9 },
             badges: ["film_1", "poliglot", "oquvchi", "tayoqcha", "patronus", "ball_1", "sandiq_1", "dost_1"], badges_total: 19 };
  }

  function odamOpen(uid, hint) {
    if (odamBusy || !uid || !window.fetch) { return; }
    odamBusy = true;
    var done = function (res) {
      odamBusy = false;
      if (!res || !res.ok) { showToast(odamX().fail, "err"); return; }
      odamCur = res;
      odamRender(res);
      $("odam").classList.remove("hidden");
      try { $("odam-box").scrollTop = 0; } catch (e) {}
    };
    window.fetch(API_PROFIL, { method: "POST", headers: { "Content-Type": "application/json", "X-Telegram-Init-Data": odamInit() },
                               body: JSON.stringify({ uid: uid }) })
      .then(function (r) { return r.json(); })
      .then(function (res) { done(res && res.ok ? res : (MS_LOCAL ? odamSample(uid, hint) : res)); })
      ["catch"](function () { done(MS_LOCAL ? odamSample(uid, hint) : null); });
  }

  // Ro'yxat qatorini (kubok a'zolari, eng yaxshi uchlik, tasma, do'st taklifi) profilga ulaydi
  function odamLink(el, m, houseId) {
    if (!el || !m || !m.uid) { return el; }
    el.classList.add("od-go");
    el.addEventListener("click", function () { odamOpen(m.uid, { name: m.name, house: m.house || houseId }); });
    return el;
  }

  // "hozir ilovada" yoki "oxirgi marta ..." (chatdagi kabi yoziladi)
  function odamSeen(d) {
    var x = odamX();
    if (d.online) { return x.online; }
    var t = "";
    try { t = chatSeenText(d.seen); } catch (e) { t = ""; }
    return t;
  }

  function odamClose() { $("odam").classList.add("hidden"); odamCur = null; }

  function odamCard(label, imgSrc, title, sub, yoq) {
    var c = odamEl("div", "od-card" + (yoq ? " yoq" : ""));
    c.appendChild(odamEl("span", "od-lbl", label));
    var row = odamEl("div", "od-row");
    if (imgSrc) {
      var im = document.createElement("img");
      im.className = "od-im";
      im.alt = "";
      im.src = imgSrc;
      row.appendChild(im);
    }
    var tx = odamEl("span", "od-tx");
    tx.appendChild(odamEl("b", "", title));
    if (sub) { tx.appendChild(odamEl("small", "", sub)); }
    row.appendChild(tx);
    c.appendChild(row);
    return c;
  }

  function odamRender(d) {
    var x = odamX(), h = validHouse(d.house), hh = HOUSES[h || "none"], box = $("odam-body");
    box.innerHTML = "";
    $("odam-box").style.setProperty("--od", hh.accent);
    $("odam-box").style.setProperty("--od-rgb", hh.rgb);

    var head = odamEl("div", "od-head");
    var av = odamEl("span", "od-av");
    var crest = h ? cupCrestImg(h, 0) : null;
    if (crest) { av.appendChild(crest); } else { av.innerHTML = PM_ICON; }
    head.appendChild(av);
    head.appendChild(odamEl("span", "od-kick", d.me ? x.you : x.kick));
    head.appendChild(odamEl("h3", "od-name", d.name || x.anon));
    head.appendChild(odamEl("span", "od-house", h ? hh[lang] : x.noHouse));
    if (h && odamSana(d.since)) { head.appendChild(odamEl("small", "od-since", x.since(odamSana(d.since)))); }
    var korildi = d.me ? "" : odamSeen(d);
    if (korildi) { head.appendChild(odamEl("small", "od-seen" + (d.online ? " on" : ""), korildi)); }
    box.appendChild(head);

    var st = odamEl("div", "od-stats");
    [[d.points.week, x.week], [d.points.all, x.all], [d.films + " / " + (MOVIES.length + ((typeof MOVIES_FB !== "undefined" && MOVIES_FB) ? MOVIES_FB.length : 0)), x.films]].forEach(function (s) {
      var c = odamEl("span", "od-stat");
      c.appendChild(odamEl("b", "", String(s[0])));
      c.appendChild(odamEl("small", "", s[1]));
      st.appendChild(c);
    });
    box.appendChild(st);

    // Tayoqcha
    var w = d.wand && WOODS[d.wand.wood] && CORES[d.wand.core] && FLEX[d.wand.flex] ? d.wand : null;
    if (w) {
      box.appendChild(odamCard(x.wand, IMG_DIR + "tayoqcha/" + w.wood + ".webp", WOODS[w.wood][lang] + ", " + CORES[w.core][lang],
                               FLEX[w.flex].len + " " + x.inch + ", " + FLEX[w.flex][lang]));
    } else {
      box.appendChild(odamCard(x.wand, null, x.noWand, "", true));
    }
    // Patronus
    var p = d.patronus && PATRONUS[d.patronus];
    if (p) { box.appendChild(odamCard(x.pat, patImg(d.patronus), p[lang], p["n_" + lang])); }
    else { box.appendChild(odamCard(x.pat, null, x.noPat, "", true)); }

    // Nishonlar
    var nb = odamEl("div", "od-card" + (d.badges.length ? "" : " yoq"));
    nb.appendChild(odamEl("span", "od-lbl", x.badges + (d.badges.length ? " · " + d.badges.length + " / " + (d.badges_total || NSH_ORDER.length) : "")));
    if (d.badges.length) {
      var grid = odamEl("div", "od-nsh");
      var nx = (NSH_TX[lang] || NSH_TX.uz).n || {};
      NSH_ORDER.forEach(function (code) {
        if (d.badges.indexOf(code) < 0) { return; }
        var b = odamEl("button", "od-n");
        b.type = "button";
        var im = document.createElement("img");
        im.alt = "";
        im.loading = "lazy";
        im.src = nshImg(code);
        b.appendChild(im);
        b.appendChild(odamEl("span", "", (nx[code] || [code])[0]));
        b.addEventListener("click", function () { nshBox({ codes: [code], names: false, kick: x.badges, title: (nx[code] || [code])[0], text: (nx[code] || ["", ""])[1] }); });
        grid.appendChild(b);
      });
      nb.appendChild(grid);
    } else {
      nb.appendChild(odamEl("b", "od-yoq", x.noBadges));
    }
    box.appendChild(nb);

    // Kartochkalar va shaxmat - bitta qatorda
    var kich = odamEl("div", "od-stats two");
    var k1 = odamEl("span", "od-stat");
    k1.appendChild(odamEl("b", "", d.cards + " / " + QB_ORDER.length));
    k1.appendChild(odamEl("small", "", x.cards));
    kich.appendChild(k1);
    if (d.chess) {
      var k2 = odamEl("span", "od-stat");
      k2.appendChild(odamEl("b", "", String(d.chess.rating)));
      k2.appendChild(odamEl("small", "", x.chess + " · " + x.games(d.chess.games, d.chess.wins)));
      kich.appendChild(k2);
    }
    box.appendChild(kich);

    var wr = $("odam-write");
    wr.textContent = x.write;
    // Xabar yozish faqat chat ochiq turganda (suhbat o'sha yerda ochiladi) va o'ziga emas
    var chatda = !$("scr-chat").classList.contains("hidden");
    wr.classList.toggle("hidden", d.me || !chatda || !h);
    wr.onclick = function () {
      var kim = { uid: d.uid, name: d.name, house: d.house };
      odamClose();
      try { chatOpenDm(kim); } catch (e) {}
    };
    $("odam-close").textContent = x.close;
  }

  function odamSetup() {
    $("odam-close").addEventListener("click", odamClose);
    $("odam").addEventListener("click", function (ev) { if (ev.target === $("odam")) { odamClose(); } });
  }

  odamSetup();
