/* Sehrgar profili: boshqa odamning profil SAHIFASI - o'z profili (#pm) ko'rinishida (egasi, 2026-10-10)
   Ilova kodi bir necha faylga bo'lingan; hammasi BIR umumiy maydonda ishlaydi
   va index.html dagi TARTIBDA yuklanadi. Yuklanish paytida keyingi fayldagi
   narsani chaqirmang - tekshiruv: tools/tartib.js */
"use strict";
  /* Ma'lumot botdan (hpprofil.py, POST /api/profil {uid}). Oyna #odam - sahifa ustida ochiladi (chat ustida ham).
     Hozircha chatdan ochiladi: xabar menyusi va shaxsiy suhbat sarlavhasi. */
  var API_PROFIL = "https://bot.tizimshunos.uz/api/profil";
  var ODAM_TX = {
    uz: { qoriq: "Qo'riqxonasi", issiq: "Issiqxonasi", nsh: "Nishonlar", qb: "Kolleksiya", qob: "Qobiliyatlar", bosh: "Hali bo'sh", prof: "Profil", stage: ["bola", "o'smir", "katta"], pstage: ["nihol", "o'smoqda", "yetilgan"], kick: "Sehrgar", noHouse: "Hali saralanmagan", since: function (d) { return "Xogvartsda " + d + " dan"; },
          week: "Shu hafta", all: "Jami ball", films: "Filmlar", wand: "Tayoqcha", pat: "Patronus", badges: "Nishonlar",
          noWand: "Hali tayoqchasi yo'q", noPat: "Patronusini hali chaqirmagan", noBadges: "Hali nishoni yo'q",
          inch: "dyuym", cards: "Sehrgar kartochkalari", chess: "Shaxmat reytingi", games: function (n, w) { return n + " o'yin · " + w + " g'alaba"; },
          online: "hozir ilovada", peer: "Profilni ko'rish", write: "Xabar yozish", close: "Yopish", you: "Bu siz", fail: "Profil ochilmadi", anon: "Sehrgar" },
    ru: { qoriq: "Питомник", issiq: "Теплица", nsh: "Значки", qb: "Коллекция", qob: "Способности", bosh: "Пока пусто", prof: "Профиль", stage: ["малыш", "подросток", "взрослый"], pstage: ["росток", "растёт", "созрело"], kick: "Волшебник", noHouse: "Ещё не распределён", since: function (d) { return "В Хогвартсе с " + d; },
          week: "За неделю", all: "Всего очков", films: "Фильмы", wand: "Палочка", pat: "Патронус", badges: "Значки",
          noWand: "Палочки пока нет", noPat: "Патронус ещё не вызван", noBadges: "Значков пока нет",
          inch: "дюймов", cards: "Карточки волшебников", chess: "Шахматный рейтинг", games: function (n, w) { return "Игр: " + n + " · побед: " + w; },
          online: "сейчас в приложении", peer: "Открыть профиль", write: "Написать", close: "Закрыть", you: "Это вы", fail: "Профиль не открылся", anon: "Волшебник" },
    en: { qoriq: "Menagerie", issiq: "Greenhouse", nsh: "Badges", qb: "Collection", qob: "Abilities", bosh: "Empty so far", prof: "Profile", stage: ["baby", "young", "grown"], pstage: ["sprout", "growing", "mature"], kick: "Wizard", noHouse: "Not sorted yet", since: function (d) { return "At Hogwarts since " + d; },
          week: "This week", all: "Total points", films: "Films", wand: "Wand", pat: "Patronus", badges: "Badges",
          noWand: "No wand yet", noPat: "Has not cast a Patronus yet", noBadges: "No badges yet",
          inch: "inches", cards: "Wizard cards", chess: "Chess rating", games: function (n, w) { return n + " games · " + w + " wins"; },
          online: "in the app now", peer: "View profile", write: "Send a message", close: "Close", you: "This is you", fail: "Could not open the profile", anon: "Wizard" }
  };
  var odamBusy = false;

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
             points: { week: 45, all: 310 }, films: 9, cards: 6, skills: [{ id: "bilim", score: 34 }, { id: "aniqlik", score: 71 }, { id: "xotira", score: 48 }, { id: "tezlik", score: 62 }, { id: "koord", score: 15 }, { id: "fazo", score: 40 }, { id: "diqqat", score: 22 }, { id: "mantiq", score: 55 }], creatures: [{ kod: "gippo", stage: 2 }, { kod: "boyogli", stage: 1 }, { kod: "niffler", stage: 0 }], chess: { rating: 1284, games: 14, wins: 9 },
             plants: [{ kod: "mandragora", stage: 2 }, { kod: "bubotuber", stage: 1 }], cards_list: ["dumbledore", "merlin", "morgana", "flamel", "gryffindor", "slytherin"],
             badges: ["film_1", "poliglot", "oquvchi", "tayoqcha", "patronus", "ball_1", "sandiq_1", "dost_1"], badges_total: 22 };
  }

  function odamOpen(uid, hint) {
    if (odamBusy || !uid || !window.fetch) { return; }
    odamBusy = true;
    var done = function (res) {
      odamBusy = false;
      if (!res || !res.ok) { showToast(odamX().fail, "err"); return; }
      odamRender(res);
      $("odam").classList.remove("hidden");
      try { $("odam").scrollTop = 0; } catch (e) {}
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

  function odamClose() { $("odam").classList.add("hidden"); }

  // Katak (o'z profilidagi .pu-c bilan bir xil): kichik sarlavha, doira rasm, nom/son
  function odamKatak(qator, lbl, src, nom, cls, fn, svg) {
    var b = odamEl("button", "pu-c" + (cls ? " " + cls : ""));
    b.type = "button";
    b.appendChild(odamEl("small", "", lbl));
    var im = odamEl("span", "pu-im" + (svg ? " svg" : ""));
    if (svg) { im.innerHTML = svg; }
    else { var img = document.createElement("img"); img.alt = ""; img.src = src; im.appendChild(img); }
    b.appendChild(im);
    b.appendChild(odamEl("b", "", nom));
    if (fn) { b.addEventListener("click", fn); }
    qator.appendChild(b);
    return b;
  }
  // Sakkiz burchakli kichik diagramma (js/09-xarid.js pu2Radar bilan bir xil chizma, lekin berilgan ballardan)
  function odamRadar(v) {
    var n = v.length, c = 39, R = 30;
    var nuqta = function (i, r) { var a = -Math.PI / 2 + i * 2 * Math.PI / n; return (c + r * Math.cos(a)).toFixed(1) + "," + (c + r * Math.sin(a)).toFixed(1); };
    var tash = [], ich = [], i;
    for (i = 0; i < n; i++) { tash.push(nuqta(i, R)); ich.push(nuqta(i, 5 + (R - 5) * Math.max(0, Math.min(100, v[i])) / 100)); }
    return '<svg viewBox="0 0 78 78" aria-hidden="true"><circle cx="39" cy="39" r="38" fill="rgba(255,255,255,.04)" stroke="rgba(255,255,255,.18)" stroke-width="1.5"/>' +
           '<polygon points="' + tash.join(" ") + '" fill="none" stroke="rgba(255,255,255,.22)" stroke-width="1"/>' +
           '<polygon points="' + ich.join(" ") + '" fill="rgba(243,213,143,.35)" stroke="#f3d58f" stroke-width="1.6" stroke-linejoin="round"/></svg>';
  }
  // Ochilib-yopiladigan bo'lim (ikkinchi qatordagi katak bosilganda)
  var odamOch = "";
  function odamBolim(kod, el) {
    el.classList.add("od-bolim");
    el.setAttribute("data-b", kod);
    el.classList.toggle("hidden", odamOch !== kod);
    return el;
  }
  function odamToggle(kod) {
    odamOch = odamOch === kod ? "" : kod;
    Array.prototype.forEach.call($("odam-body").querySelectorAll(".od-bolim"), function (e) { e.classList.toggle("hidden", e.getAttribute("data-b") !== odamOch); });
    Array.prototype.forEach.call($("odam-body").querySelectorAll(".pu-c[data-b]"), function (e) { e.classList.toggle("on", e.getAttribute("data-b") === odamOch); });
    var o = $("odam-body").querySelector('.od-bolim[data-b="' + odamOch + '"]');
    if (o) { try { o.scrollIntoView({ block: "nearest", behavior: "smooth" }); } catch (e) {} }
  }
  // Rasmlar qatori: Qo'riqxona va Issiqxona
  function odamXona(nom, soni, jami, royxat, rasm, izoh) {
    var c = odamEl("div", "od-card od-xona" + (royxat.length ? "" : " yoq"));
    var t = odamEl("span", "od-lbl", nom);
    t.appendChild(odamEl("i", "", soni + " / " + jami));
    c.appendChild(t);
    if (!royxat.length) { c.appendChild(odamEl("b", "od-yoq", odamX().bosh)); return c; }
    var r = odamEl("div", "od-xr");
    royxat.forEach(function (z) {
      var k = odamEl("span", "od-xi"), im = document.createElement("img");
      im.alt = ""; im.loading = "lazy"; im.src = rasm(z);
      k.appendChild(im);
      k.appendChild(odamEl("small", "", izoh(z)));
      r.appendChild(k);
    });
    c.appendChild(r);
    return c;
  }

  function odamRender(d) {
    var x = odamX(), h = validHouse(d.house), hh = HOUSES[h || "none"], box = $("odam-body"), t = T[lang];
    box.innerHTML = "";
    odamOch = "";
    $("odam-box").style.setProperty("--od", hh.accent);
    $("odam-box").style.setProperty("--od-rgb", hh.rgb);
    $("odam-kick").textContent = d.name || x.anon;
    $("odam-title").textContent = x.prof;

    // holat: hozir ilovada / oxirgi marta · Xogvartsda ... dan
    var qism = [];
    if (d.me) { qism.push(x.you); } else { var kor = odamSeen(d); if (kor) { qism.push(kor); } }
    if (h && odamSana(d.since)) { qism.push(x.since(odamSana(d.since))); }
    if (!h) { qism.push(x.noHouse); }
    if (qism.length) { box.appendChild(odamEl("p", "od-holat" + (d.online && !d.me ? " on" : ""), qism.join(" · "))); }

    // 1-qator: Fakultet / Tayoqcha / Patronus
    var q1 = odamEl("div", "pu");
    if (h) {
      var hx = UY_XAR[lang] || UY_XAR.uz;
      odamKatak(q1, t.houseLbl, IMG_DIR + hh.img, hh[lang], "gerb", function () {
        nshBox({ x: true, codes: ["x"], srcs: [IMG_DIR + hh.img], crest: true, kick: t.houseLbl, title: hh[lang] || "", text: hx[h] || "" });
      });
    } else {
      odamKatak(q1, t.houseLbl, IMG_DIR + "tayoqcha/quti.webp", "—", "yoq", null);
    }
    var w = d.wand && WOODS[d.wand.wood] && CORES[d.wand.core] && FLEX[d.wand.flex] ? d.wand : null;
    if (w) {
      var ws = IMG_DIR + "tayoqcha/" + w.wood + ".webp";
      odamKatak(q1, t.wandLbl, ws, WOODS[w.wood][lang], "", function () {
        nshBox({ x: true, codes: ["x"], srcs: [ws], kick: t.wandLbl, title: WOODS[w.wood][lang] + ", " + CORES[w.core][lang],
                 text: FLEX[w.flex].len + " " + x.inch + ", " + FLEX[w.flex][lang] + "\n\n" + WOOD_LORE[w.wood][lang] });
      });
    } else {
      odamKatak(q1, t.wandLbl, IMG_DIR + "tayoqcha/quti.webp", "—", "yoq", function () { showToast(x.noWand); });
    }
    var p = d.patronus && PATRONUS[d.patronus];
    if (p) {
      odamKatak(q1, x.pat, patImg(d.patronus), p[lang], "", function () {
        nshBox({ x: true, codes: ["x"], srcs: [patImg(d.patronus)], kick: x.pat, title: p[lang], text: p["n_" + lang] });
      });
    } else {
      odamKatak(q1, x.pat, patImg("mist"), "—", "yoq", function () { showToast(x.noPat); });
    }
    box.appendChild(q1);

    // 2-qator: Nishonlar / Kolleksiya / Qobiliyatlar - bosilsa ostida ro'yxati ochiladi
    var q2 = odamEl("div", "pu od-q2");
    var nishonlar = NSH_ORDER.filter(function (c) { return d.badges.indexOf(c) >= 0; });
    var kartalar = (d.cards_list || []).filter(function (c) { return !!QB.uz[c]; });
    var ball = (d.skills || []).map(function (q) { return q.score || 0; }), orta = 0;
    ball.forEach(function (b) { orta += b; });
    orta = ball.length ? Math.round(orta / ball.length) : 0;
    odamKatak(q2, x.nsh, nishonlar.length ? nshImg(nishonlar[nishonlar.length - 1]) : IMG_DIR + "nishon/film_1.webp",
              nishonlar.length + " / " + (d.badges_total || NSH_ORDER.length), nishonlar.length ? "" : "yoq",
              function () { if (nishonlar.length) { odamToggle("nsh"); } else { showToast(x.noBadges); } }).setAttribute("data-b", "nsh");
    odamKatak(q2, x.qb, kartalar.length ? qbImg(kartalar[0]) : IMG_DIR + "qurbaqa/dumbledore.webp", (d.cards || 0) + " / " + QB_ORDER.length,
              kartalar.length ? "" : "yoq", function () { if (kartalar.length) { odamToggle("qb"); } else { showToast(x.bosh); } }).setAttribute("data-b", "qb");
    odamKatak(q2, x.qob, "", orta + " / 100", "", function () { odamToggle("qob"); }, odamRadar(ball.length ? ball : [0, 0, 0, 0, 0, 0, 0, 0])).setAttribute("data-b", "qob");
    box.appendChild(q2);

    // Nishonlar ro'yxati
    var nb = odamBolim("nsh", odamEl("div", "od-card"));
    var grid = odamEl("div", "od-nsh"), nx = (NSH_TX[lang] || NSH_TX.uz).n || {};
    nishonlar.forEach(function (code) {
      var b = odamEl("button", "od-n");
      b.type = "button";
      var im = document.createElement("img");
      im.alt = ""; im.loading = "lazy"; im.src = nshImg(code);
      b.appendChild(im);
      b.appendChild(odamEl("span", "", (nx[code] || [code])[0]));
      b.addEventListener("click", function () { nshBox({ codes: [code], names: false, kick: x.badges, title: (nx[code] || [code])[0], text: (nx[code] || ["", ""])[1] }); });
      grid.appendChild(b);
    });
    nb.appendChild(grid);
    box.appendChild(nb);
    // Kolleksiya: yig'ilgan kartochkalar
    var kb = odamBolim("qb", odamEl("div", "od-card"));
    var kg = odamEl("div", "od-nsh");
    kartalar.forEach(function (code) {
      var k = odamEl("span", "od-n"), im = document.createElement("img");
      im.alt = ""; im.loading = "lazy"; im.src = qbImg(code);
      k.appendChild(im);
      k.appendChild(odamEl("span", "", ((QB[lang] || QB.uz)[code] || QB.uz[code] || [code])[0]));
      kg.appendChild(k);
    });
    kb.appendChild(kg);
    box.appendChild(kb);
    // Qobiliyatlar: sakkiz soha
    var qc = odamBolim("qob", odamEl("div", "od-card"));
    var li = lang === "ru" ? 1 : lang === "en" ? 2 : 0, qg = odamEl("div", "od-qob");
    (d.skills || []).forEach(function (q) {
      var nom = q.id;
      try { QOB.forEach(function (z) { if (z.id === q.id) { nom = z.nom[li]; } }); } catch (e) {}
      var r = odamEl("span", "od-qb"), bar = odamEl("i", ""), ich = odamEl("u", "");
      ich.style.width = Math.max(0, Math.min(100, q.score)) + "%";
      bar.appendChild(ich);
      r.appendChild(odamEl("small", "", nom));
      r.appendChild(odamEl("b", "", String(q.score)));
      r.appendChild(bar);
      qg.appendChild(r);
    });
    qc.appendChild(qg);
    box.appendChild(qc);

    // Ballar va filmlar
    var st = odamEl("div", "od-stats");
    [[d.points.week, x.week], [d.points.all, x.all], [d.films + " / " + (MOVIES.length + ((typeof MOVIES_FB !== "undefined" && MOVIES_FB) ? MOVIES_FB.length : 0)), x.films]].forEach(function (s) {
      var c = odamEl("span", "od-stat");
      c.appendChild(odamEl("b", "", String(s[0])));
      c.appendChild(odamEl("small", "", s[1]));
      st.appendChild(c);
    });
    box.appendChild(st);

    // Qo'riqxonasi va Issiqxonasi (faqat saralangan odamda)
    if (h) {
      var mx = d.creatures || [], os = d.plants || [];
      box.appendChild(odamXona(x.qoriq, mx.length, 12, mx, function (c) { return IMG_DIR + "qoriq/" + c.kod + "-" + c.stage + ".webp"; },
                               function (c) { return x.stage[c.stage] || ""; }));
      var ix = odamXona(x.issiq, os.length, 12, os, function (c) { return IMG_DIR + "issiq/" + c.kod + "-" + c.stage + ".webp"; },
                        function (c) { return x.pstage[c.stage] || ""; });
      ix.classList.add("osimlik");
      box.appendChild(ix);
    }

    // Shaxmat
    if (d.chess) {
      var sh = odamEl("div", "od-card od-chess");
      sh.appendChild(odamEl("span", "od-lbl", x.chess));
      sh.appendChild(odamEl("b", "", String(d.chess.rating)));
      sh.appendChild(odamEl("small", "", x.games(d.chess.games, d.chess.wins)));
      box.appendChild(sh);
    }

    // Xabar yozish: chat qayerdan ochilgan bo'lmasin (yopiq bo'lsa - ochiladi); o'ziga va saralanmaganga yo'q
    var wr = $("odam-write"), menSaralangan = false;
    try { menSaralangan = hasHouse(); } catch (e) {}
    wr.textContent = x.write;
    wr.classList.toggle("hidden", d.me || !h || !menSaralangan);
    wr.onclick = function () {
      var kim = { uid: d.uid, name: d.name, house: d.house };
      var chatda = !$("scr-chat").classList.contains("hidden");
      odamClose();
      try {
        if (!chatda) {                       // boshqa sahifadan (kubok, tasma, do'stlar...): o'sha sahifa yopilib, chat ochiladi; ortga - Xogvartsga
          Array.prototype.forEach.call(document.querySelectorAll(".screen"), function (e) { if (e.id !== "scr-chat") { e.classList.add("hidden"); } });
          worldFrom = "hub";
          openChat();
        }
        chatOpenDm(kim);
      } catch (e) {}
    };
  }

  function odamSetup() {
    $("odam-close").addEventListener("click", odamClose);
  }

  odamSetup();
