/* Onlayn, SVG chizmalar, xabar oynalari, film yuborish, chizish
   Ilova kodi bir necha faylga bo'lingan; hammasi BIR umumiy maydonda ishlaydi
   va index.html dagi TARTIBDA yuklanadi. Yuklanish paytida keyingi fayldagi
   narsani chaqirmang - tekshiruv: tools/tartib.js */
"use strict";
  /* ---------- ONLAYN ----------
     Ilova ochiq turganda serverga har 20 soniyada "shu yerdaman" yuboriladi.
     Chatdagi onlayn belgisi shunga qaraydi - odam chatga kirmagan bo'lsa ham
     ilovada bo'lsa, onlayn ko'rinadi. Ilova yashirilsa/yopilsa - darhol oflayn.
     text/plain - brauzer oldindan "ruxsat so'rovi" yubormasin (keepalive bilan
     yopilish paytida ham yetib boradi). */
  var API_PRESENCE = "https://bot.tizimshunos.uz/api/presence";
  var presenceTimer = null;
  var presenceLast = { off: null, t: 0 };

  function presencePing(off) {
    var initData = "";
    try { initData = (tg && tg.initData) || ""; } catch (e) {}
    if (!initData || !window.fetch) { return; }
    // Bir xil holat qisqa vaqtda qayta yuborilmaydi (oyna tez-tez yashirinib-ochilsa)
    var now = Date.now();
    if (presenceLast.off === !!off && now - presenceLast.t < 5000) { return; }
    presenceLast = { off: !!off, t: now };
    try {
      window.fetch(API_PRESENCE, {
        method: "POST",
        headers: { "Content-Type": "text/plain" },
        body: JSON.stringify({ initData: initData, off: off ? 1 : 0 }),
        keepalive: true
      })["catch"](function () {});
    } catch (e) {}
  }

  function presenceStart() {
    if (presenceTimer) { return; }
    presencePing(false);
    presenceTimer = setInterval(function () {
      if (!document.hidden) { presencePing(false); }
    }, 20000);
    document.addEventListener("visibilitychange", function () { presencePing(document.hidden); });
    window.addEventListener("pagehide", function () { presencePing(true); });
  }

  function openCup() {
    if (!cupData) { return; }
    try { sqDone("cup"); } catch (e) {}
    renderCupScreen();
    stopSortTimer();
    $("scr-cat").classList.add("hidden");
    $("scr-prof").classList.add("hidden");
    $("scr-detail").classList.add("hidden");
    $("scr-cup").classList.remove("hidden");
    try { window.scrollTo(0, 0); } catch (e) {}
    fetchRefs(renderRefsStrip);
    cupRefresh(function () { if (!$("scr-cup").classList.contains("hidden")) { renderCupScreen(); } });
  }

  function closeCup() {
    $("scr-cup").classList.add("hidden");
    openCatalog(lang, false);
  }

  function reportHouse(id) { report("house", id); }

  function reportWand(w) { report("wand", w.wood + "_" + w.core + "_" + w.flex); }

  /* ---------- SVG CHIZMALAR ----------
     currentColor ishlatadi — fakultet rangiga o'zi moslashadi.        */

  // Tayoqcha. Kvadrat nisbatda (100x100) chizilgan, chunki barcha uyalar kvadrat:
  // ochilish 104px, profil kartasi 62px, mashhur sehrgar yonida 44px.
  // Avval 240x40 (6:1) edi va kvadrat uyada ingichka chiziqchaga aylanardi.
  var SVG_WAND =
    '<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
      '<path d="M33.02 84.83 L57.16 29.67 L58.84 30.33 L38.98 87.17 Z" ' +
        'fill="currentColor" fill-opacity=".18" stroke="currentColor" stroke-width="1.6" ' +
        'stroke-linejoin="round"/>' +
      '<path d="M40.9 81.46 L35.5 79.34 M42.25 77.47 L37.23 75.49 M43.61 73.47 L38.95 71.65" ' +
        'stroke="currentColor" stroke-width="1.3" stroke-opacity=".6" stroke-linecap="round"/>' +
      '<path d="M63 14 L64.84 20.16 L71 22 L64.84 23.84 L63 30 L61.16 23.84 L55 22 L61.16 20.16 Z" ' +
        'fill="currentColor" fill-opacity=".9"/>' +
      '<path d="M77 28.5 L78.06 31.94 L81.5 33 L78.06 34.06 L77 37.5 L75.94 34.06 L72.5 33 ' +
        'L75.94 31.94 Z" fill="currentColor" fill-opacity=".55"/>' +
      '<path d="M50 12.8 L50.74 15.26 L53.2 16 L50.74 16.74 L50 19.2 L49.26 16.74 L46.8 16 ' +
        'L49.26 15.26 Z" fill="currentColor" fill-opacity=".4"/>' +
    '</svg>';

  // Ollivander javoni: tayoqcha qutilari, bittasi tortib olingan
  var SVG_SHELF =
    '<svg viewBox="0 0 200 150" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
      '<g stroke="currentColor" stroke-width="1.3" stroke-opacity=".38">' +
        '<rect x="14" y="12" width="52" height="17" rx="2"/>' +
        '<rect x="74" y="12" width="52" height="17" rx="2"/>' +
        '<rect x="134" y="12" width="52" height="17" rx="2"/>' +
        '<rect x="14" y="37" width="52" height="17" rx="2"/>' +
        '<rect x="134" y="37" width="52" height="17" rx="2"/>' +
        '<rect x="14" y="96" width="52" height="17" rx="2"/>' +
        '<rect x="74" y="96" width="52" height="17" rx="2"/>' +
        '<rect x="134" y="96" width="52" height="17" rx="2"/>' +
        '<rect x="14" y="121" width="52" height="17" rx="2"/>' +
        '<rect x="74" y="121" width="52" height="17" rx="2"/>' +
        '<rect x="134" y="121" width="52" height="17" rx="2"/>' +
      '</g>' +
      '<g stroke="currentColor" stroke-width="1.1" stroke-opacity=".2">' +
        '<path d="M8 33 H192 M8 92 H192 M8 117 H192"/>' +
      '</g>' +
      '<rect x="58" y="63" width="84" height="24" rx="3" ' +
        'fill="currentColor" fill-opacity=".10" stroke="currentColor" stroke-width="1.5"/>' +
      '<path d="M70 75 L126 75 L131 75" stroke="currentColor" stroke-width="2" ' +
        'stroke-linecap="round" stroke-opacity=".9"/>' +
      '<circle cx="133" cy="75" r="2.6" fill="currentColor"/>' +
      '<circle cx="133" cy="75" r="6.5" fill="currentColor" fill-opacity=".16"/>' +
    '</svg>';

  function drawSvg(el, svg, cls) {
    if (!el) { return; }
    el.className = cls;
    el.innerHTML = svg;
  }

  var IMG_DIR = "img/";
  var HAT_IMG = "sorting_hat.png";

  // Gerbni chizadi. Rasm topilmasa — belgiga qaytadi.
  function paintCrest(el, houseId, fallback) {
    if (!el) { return; }
    el.innerHTML = "";
    var h = HOUSES[houseId];
    var file = h && h.img;
    if (!file) { el.textContent = fallback; return; }

    var img = document.createElement("img");
    img.src = IMG_DIR + file;
    img.alt = "";
    img.onerror = function () {
      this.onerror = null;
      this.remove();
      el.textContent = fallback;
    };
    el.appendChild(img);
  }

  function paintHat(el) {
    if (!el) { return; }
    el.innerHTML = "";
    var img = document.createElement("img");
    img.src = IMG_DIR + HAT_IMG;
    img.alt = "";
    img.className = "hat-img";
    img.onerror = function () {
      this.onerror = null;
      this.remove();
      el.textContent = "?";
      el.className = "hat-mark";
    };
    el.className = "hat-mark bare";
    el.appendChild(img);
  }

  // Natija chiqqanda bo'sh joy ko'rinmasligi uchun
  function preloadCrests() {
    var names = ["gryffindor", "slytherin", "ravenclaw", "hufflepuff"];
    for (var i = 0; i < names.length; i++) {
      var f = HOUSES[names[i]].img;
      if (f) { try { new Image().src = IMG_DIR + f; } catch (e) {} }
    }
    try { new Image().src = IMG_DIR + HAT_IMG; } catch (e) {}
  }

  function validHouse(v) { return v && HOUSES[v] && v !== "none" ? v : null; }

  function readLocalHouse() {
    try { return validHouse(window.localStorage.getItem(HOUSE_KEY)); }
    catch (e) { return null; }
  }

  function validWand(v) {
    if (!v) { return null; }
    var o = v;
    if (typeof v === "string") {
      try { o = JSON.parse(v); } catch (e) { return null; }
    }
    if (!o || !WOODS[o.wood] || !CORES[o.core] || !FLEX[o.flex]) { return null; }
    return { wood: o.wood, core: o.core, flex: o.flex };
  }

  function readLocalWand() {
    try { return validWand(window.localStorage.getItem(WAND_KEY)); }
    catch (e) { return null; }
  }

  function setWand(w) {
    var v = validWand(w);
    if (!v) { return; }
    wand = v;
    var raw = JSON.stringify(v);
    try { window.localStorage.setItem(WAND_KEY, raw); } catch (e) {}
    if (cloudOk) {
      try { tg.CloudStorage.setItem(WAND_KEY, raw, function () {}); } catch (e) {}
    }
  }

  function setHouse(id) {
    var v = validHouse(id) || "none";
    house = v;
    applyHouse(v);
    try { window.localStorage.setItem(HOUSE_KEY, v); } catch (e) {}
    if (cloudOk) {
      try { tg.CloudStorage.setItem(HOUSE_KEY, v, function () {}); } catch (e) {}
    }
  }

  function load(done) {
    var localLang = readLocalLang();
    var houseChanged = false;

    if (!hasCloud()) { done(localLang, false); return; }
    cloudOk = true;

    var fired = false;
    function once(l) {
      if (!fired) { fired = true; done(l, houseChanged); return; }
      // Bulut kechikib kelgan bo'lsa ham fakultet yangilansin
      if (houseChanged) { houseChanged = false; refreshHouseView(); }
    }
    setTimeout(function () { once(localLang); }, 1200);

    try {
      tg.CloudStorage.getItems([KEY, LANG_KEY, HOUSE_KEY, WAND_KEY], function (err, vals) {
        var l = localLang;
        if (!err && vals) {
          if (vals[KEY]) { absorb(vals[KEY].split(",")); writeLocal(); }
          var cl = validLang(vals[LANG_KEY]);
          if (!l && cl) { l = cl; try { window.localStorage.setItem(LANG_KEY, cl); } catch (e) {} }
          // Fakultet uchun bulut asosiy manba: qurilmalar orasida
          // yagona bo'lishi kerak, shuning uchun lokal qiymatni almashtiradi.
          var ch = validHouse(vals[HOUSE_KEY]);
          if (ch && ch !== house) {
            house = ch;
            applyHouse(ch);
            try { window.localStorage.setItem(HOUSE_KEY, ch); } catch (e) {}
            houseChanged = true;
          }
          var cw = validWand(vals[WAND_KEY]);
          if (cw) {
            var same = wand && wand.wood === cw.wood && wand.core === cw.core && wand.flex === cw.flex;
            if (!same) {
              wand = cw;
              try { window.localStorage.setItem(WAND_KEY, JSON.stringify(cw)); } catch (e) {}
              houseChanged = true;
            }
          }
        }
        once(l);
      });
    } catch (e) { once(localLang); }
  }

  // Fakultet o'zgargach ochiq ekranni qayta chizadi
  function refreshHouseView() {
    if (!$("scr-prof").classList.contains("hidden")) { renderProfile(); }
    else if (!$("scr-cat").classList.contains("hidden")) { renderCatalog(); }
  }

  function persist(cb) {
    writeLocal();
    if (!cloudOk) { if (cb) { cb(); } return; }

    var fired = false;
    function once() { if (!fired) { fired = true; if (cb) { cb(); } } }
    setTimeout(once, 1200);

    try { tg.CloudStorage.setItem(KEY, list().join(","), once); }
    catch (e) { once(); }
  }

  /* ---------- HARAKATLAR ---------- */

  // Kartaga bosilganda tasdiq so'raladi — tasodifiy teginishdan himoya
  /* ---------- XABAR OYNALARI ---------- */

  // Xabarlar bir-birini o'chirmaydi - bir vaqtda bir nechtasi ko'rinishi mumkin.
  function addNote(el, life) {
    var box = $("notes");
    if (!box) { return null; }
    box.appendChild(el);
    // Brauzer o'lchamni hisoblab ulgursin, keyin ochamiz
    setTimeout(function () { el.classList.add("on"); }, 20);
    setTimeout(function () { dismissNote(el); }, life);
    return el;
  }

  // Xabarni vaqtidan oldin yopadi ("Yuborilmoqda..." natija kelgach qolib
  // ketmasligi uchun kerak).
  function dismissNote(el) {
    if (!el || !el.parentNode) { return; }
    el.classList.remove("on");
    setTimeout(function () {
      if (el.parentNode) { el.parentNode.removeChild(el); }
    }, 260);
  }

  function showToast(text, kind) {
    var el = document.createElement("div");
    el.className = "note" + (kind ? " " + kind : "");
    el.textContent = text;
    return addNote(el, 3400);
  }

  // Film yuborilgach chiqadigan xabar. Tasdiq oynasi o'rniga shu ishlatiladi:
  // to'g'ri bosgan odam to'siqni sezmaydi, xato bosgan esa qaytara oladi.
  // Bekor qilish muhlati. Aylana animatsiyasi ham shu vaqtga moslanadi:
  // ikkalasi shu yerdan boshqariladi, shuning uchun ajralib qolmaydi.
  var UNDO_LIFE = 5000;

  // Strelka + atrofida bo'shab boruvchi aylana.
  function undoIcon(ms) {
    var wrap = document.createElement("span");
    wrap.className = "u-ring";
    wrap.innerHTML =
      '<svg viewBox="0 0 24 24" aria-hidden="true">' +
        '<circle class="u-track" cx="12" cy="12" r="10"></circle>' +
        '<circle class="u-prog" cx="12" cy="12" r="10" transform="rotate(-90 12 12)"></circle>' +
        '<path class="u-arrow" transform="translate(6 6) scale(0.5)" ' +
              'd="M12.5 8c-2.65 0-5.05.99-6.9 2.6L2 7v9h9l-3.62-3.62c1.39-1.16 ' +
                 '3.16-1.88 5.12-1.88 3.54 0 6.55 2.31 7.6 5.5l2.37-.78C21.08 ' +
                 '11.03 17.15 8 12.5 8z"></path>' +
      '</svg>';
    var prog = wrap.querySelector(".u-prog");
    if (prog) { prog.style.animationDuration = ms + "ms"; }
    return wrap;
  }

  function showUndoNote(id, title, messageId) {
    var t = T[lang];
    var el = document.createElement("div");
    el.className = "note ok note-undo";

    var txt = document.createElement("span");
    txt.className = "u-txt";
    txt.textContent = "✅ " + t.sentTo(title);

    var btn = document.createElement("button");
    btn.className = "u-btn";
    var ring = undoIcon(UNDO_LIFE);
    var label = document.createElement("span");
    label.textContent = t.undoBtn;
    btn.appendChild(ring);
    btn.appendChild(label);

    btn.addEventListener("click", function () {
      btn.disabled = true;
      // Faqat yozuvni almashtiramiz - belgi joyida qoladi, aks holda
      // tugma bosilgan zahoti "sakrab" ketardi.
      label.textContent = "…";
      var p = ring.querySelector(".u-prog");
      if (p) { p.style.animationPlayState = "paused"; }
      undoSend(id, messageId, el);
    });

    el.appendChild(txt);
    el.appendChild(btn);
    return addNote(el, UNDO_LIFE);
  }

  function undoSend(id, messageId, noteEl) {
    var t = T[lang];
    var init = "";
    try { init = (tg && tg.initData) || ""; } catch (e) {}
    if (!init || !window.fetch || !messageId) {
      dismissNote(noteEl); showToast(t.undoFail, "err"); return;
    }

    window.fetch(API_UNDO, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Telegram-Init-Data": init },
      body: JSON.stringify({ message_id: messageId })
    }).then(function (r) { return r.json(); }).then(function (d) {
      dismissNote(noteEl);
      if (d && d.ok) {
        // Xabar chatdan o'chdi, lekin ✓ qoladi: yuklab olingan film qaytib "olinmagan" bo'lmaydi.
        showToast(t.undone);
        return;
      }
      showToast(d && d.error === "expired" ? t.undoExpired : t.undoFail, "err");
    })["catch"](function () {
      dismissNote(noteEl); showToast(t.undoFail, "err");
    });
  }

  /* ---------- FILM YUBORISH ---------- */

  // Eski usul: botga o'tish. Ilova YOPILADI. Telegram tashqarisida yoki
  // API ishlamay qolganda zaxira yo'l sifatida qoladi.
  //
  // belgilash === false: film yetib BORMASLIGI aniq (masalan obuna yo'q).
  // Qolgan hollarda natijani bilmaymiz - ilova yopiladi va javob kelmaydi -
  // shuning uchun eski xatti-harakat saqlanadi.
  function openInBot(id, belgilash) {
    // `web_` - bot jadvalga film WebApp'dan olinganini yozadi
    var link = "https://t.me/" + BOT + "?start=web_" + id + "_" + lang;
    if (belgilash !== false) {
      watched[key(id)] = true;
      renderCatalog();
    }
    persist(function () {
      if (tg && tg.openTelegramLink) { tg.openTelegramLink(link); tg.close(); }
      else { window.open(link, "_blank"); }
    });
  }

  var sending = false;

  /* ---------- SIFAT TANLASH (egasi, 2026-10-04) ----------
     Har film bosilganda "Full HD / HD" so'raladi - har safar, eslab qolinmaydi. Bizda yo'q
     sifat qulflangan ko'rinadi. Qaysi sifat borligi botdan olinadi (/api/films, hajmi bilan);
     javob kelmagan bo'lsa Full HD bor deb hisoblanadi (avvalgi holat). */
  var API_FILMS = "https://bot.tizimshunos.uz/api/films";
  var QS_LIST = [["fhd", "Full HD", "1080p"], ["hd", "HD", "720p"]];
  var QS_TX = {
    uz: { ask: "Sifatni tanlang", soon: "Tez orada", close: "Yopish", note: "Film bot chatiga yuboriladi." },
    ru: { ask: "Выберите качество", soon: "Скоро", close: "Закрыть", note: "Фильм придёт в чат с ботом." },
    en: { ask: "Choose the quality", soon: "Coming soon", close: "Close", note: "The film is sent to your bot chat." }
  };
  var qsData = null, qsAsked = false;

  function qsLoad() {
    if (qsAsked || !window.fetch) { return; }
    qsAsked = true;
    try { qsData = JSON.parse(window.localStorage.getItem("hp_films") || "null"); } catch (e) { qsData = null; }
    window.fetch(API_FILMS).then(function (r) { return r.json(); }).then(function (res) {
      if (!res || !res.ok || !res.films) { return; }
      qsData = res.films;
      try { window.localStorage.setItem("hp_films", JSON.stringify(qsData)); } catch (e) {}
    })["catch"](function () {});
  }

  // Fayl hajmi doim MB da (egasi, 2026-10-04) - bot tugmalari bilan bir xil
  function qsSize(b) {
    return b ? Math.round(b / 1048576) + " MB" : "";
  }

  function qsFilmName(id) {
    var all = MOVIES.concat(MOVIES_FB);
    for (var i = 0; i < all.length; i++) {
      if (all[i].id === id) { return all[i][lang] || all[i].uz || ""; }
    }
    return "";
  }

  function qsClose() { $("qs").classList.add("hidden"); }

  function play(id) {
    if (sending) { return; }
    var el = $("qs"), x = QS_TX[lang] || QS_TX.uz;
    // .screen ichida position:fixed siljiydi - oyna body ning o'zida turishi kerak
    if (el.parentNode !== document.body) { document.body.appendChild(el); }
    if (!el.getAttribute("data-on")) {
      el.setAttribute("data-on", "1");
      $("qs-close").onclick = qsClose;
      el.addEventListener("click", function (e) { if (e.target === el) { qsClose(); } });
    }
    var bor = qsData ? (qsData[id + "_" + lang] || {}) : { fhd: 0 };
    $("qs-kick").textContent = x.ask;
    $("qs-title").textContent = qsFilmName(id);
    $("qs-note").textContent = x.note;
    $("qs-close").textContent = x.close;
    var box = $("qs-list");
    box.innerHTML = "";
    QS_LIST.forEach(function (q) {
      var ok = Object.prototype.hasOwnProperty.call(bor, q[0]);
      var b = document.createElement("button");
      b.type = "button";
      b.className = "qs-row" + (ok ? "" : " lock");
      b.disabled = !ok;
      b.innerHTML = '<span class="qs-tx"><b></b><small></small></span><span class="qs-ic"></span>';
      b.querySelector("b").textContent = q[1];
      var hajm = ok ? qsSize(bor[q[0]]) : "";
      b.querySelector("small").textContent = ok ? q[2] + (hajm ? " · " + hajm : "") : x.soon;
      b.querySelector(".qs-ic").innerHTML = ok
        ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 4v12M6.5 11l5.5 5.5 5.5-5.5M5 20h14"/></svg>'
        : '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17 9V7A5 5 0 0 0 7 7v2a3 3 0 0 0-3 3v7a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3v-7a3 3 0 0 0-3-3M9 7a3 3 0 0 1 6 0v2H9z"/></svg>';
      if (ok) { b.onclick = function () { qsClose(); playSend(id, q[0]); }; }
      box.appendChild(b);
    });
    el.classList.remove("hidden");
    try { if (tg && tg.HapticFeedback) { tg.HapticFeedback.selectionChanged(); } } catch (e) {}
  }

  function playSend(id, q) {
    if (sending) { return; }
    var t = T[lang];
    var init = "";
    try { init = (tg && tg.initData) || ""; } catch (e) {}
    if (!init || !window.fetch) { openInBot(id); return; }

    sending = true;
    var pending = showToast(t.sending);

    window.fetch(API_SEND, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Telegram-Init-Data": init },
      body: JSON.stringify({ movie_id: id, lang: lang, q: q })
    }).then(function (r) { return r.json(); }).then(function (res) {
      sending = false;
      dismissNote(pending);

      if (res && res.ok) {
        // Belgi endi HAQIQIY: film chindan yuborilgandan keyin qo'yiladi.
        // Ilgari u bosilgan zahoti qo'yilardi - obuna yo'q bo'lsa ham.
        watched[key(id)] = true;
        renderCatalog();
        persist();
        showUndoNote(id, res.title || "", res.message_id);
        return;
      }

      var err = res && res.error;
      if (err === "not_ready") { showToast(t.notReadyMsg, "err"); return; }
      // Film manbada topilmadi: botga o'tish ham yordam bermaydi, adminlar xabardor
      if (err === "film_missing") { showToast(t.filmMissing, "err"); return; }
      // Obuna yo'q: bot filmni emas, obuna taklifini ko'rsatadi -
      // shuning uchun "ko'rilgan" deb belgilamaymiz.
      if (err === "not_subscribed") {
        showToast(t.notSubscribed, "err");
        openInBot(id, false);
        return;
      }
      openInBot(id);   // qolgan xatolarda jim eski usulga o'tamiz
    })["catch"](function () {
      sending = false;
      dismissNote(pending);
      openInBot(id);
    });
  }

  /* ---------- CHIZISH ---------- */

  /* Rasm yuklanmasa darhol taslim bo'lmaymiz. Ilgari karta rasmni birinchi xatodayoq
     olib tashlardi — internet bir lahza uzilsa yoki GitHub sekin javob bersa, plakatlar
     ilova qayta ochilguncha yo'qolib qolardi (2026-09-27, Mac Telegram). Endi: zaxira
     manzillar ketma-ket (masalan ruscha -> o'zbekcha), OXIRGISI esa 1.5 / 4 / 8 soniyadan
     keyin qayta so'raladi; shundan keyingina rasm olib tashlanadi.
     onStep(i, url) — har yangi manzilga o'tilganda (masalan uslubni moslash uchun). */
  var IMG_RETRY = [1500, 4000, 8000];
  function imgTry(img, urls, onStep) {
    var list = [];
    urls.forEach(function (u) { if (list.indexOf(u) === -1) { list.push(u); } });
    var at = 0, tries = 0;
    function go(url) {
      if (onStep) { try { onStep(at, url); } catch (e) {} }
      img.src = url;
    }
    img.onerror = function () {
      if (at < list.length - 1) { at++; go(list[at]); return; }
      if (tries < IMG_RETRY.length) {
        var wait = IMG_RETRY[tries++];
        setTimeout(function () {
          if (!img.parentNode) { return; }           // karta allaqachon qayta chizilgan
          img.src = list[at] + (list[at].indexOf("?") === -1 ? "?" : "&") + "r=" + tries;
        }, wait);
        return;
      }
      img.onerror = null;
      if (img.parentNode) { img.parentNode.removeChild(img); }
    };
    go(list[0]);
  }

  function poster(id) {
    return "img/" + id + "_" + lang + ".jpg?v=3";
  }

  // Film shu tilda yuklanganmi? NOT_READY ro'yxati catalog.py dan
  // generatsiya qilinadi: u yerda message_id = 0 bo'lgan filmlar.
  function isReady(id) {
    var yoq = (typeof NOT_READY !== "undefined" && NOT_READY && NOT_READY[lang]) || [];
    for (var i = 0; i < yoq.length; i++) { if (yoq[i] === id) { return false; } }
    return true;
  }

  function nextIndex() {
    for (var i = 0; i < MOVIES.length; i++) {
      if (isReady(MOVIES[i].id) && !watched[key(MOVIES[i].id)]) { return i; }
    }
    return -1;
  }

  function renderLangs() {
    var box = $("lang-list");
    box.innerHTML = "";
    LANGS.forEach(function (l) {
      var b = document.createElement("button");
      b.className = "lang-btn";

      var mark = document.createElement("span");
      mark.className = "lang-mark";
      mark.style.background = l.grad;
      mark.textContent = l.flag;

      var nm = document.createElement("span");
      nm.className = "lang-name";
      var strong = document.createElement("b");
      strong.textContent = l.name;
      var small = document.createElement("small");
      small.textContent = l.note;
      nm.appendChild(strong);
      nm.appendChild(small);

      var chev = document.createElement("span");
      chev.className = "chev";
      chev.textContent = "›";

      b.appendChild(mark);
      b.appendChild(nm);
      b.appendChild(chev);
      b.addEventListener("click", function () { openCatalog(l.code, true); });
      box.appendChild(b);
    });
  }

  var LIB_TITLE = { uz: "Kutubxona", ru: "Библиотека", en: "Library" };
  var SERIES_TITLE = {
    hp: { uz: "Garri Potter", ru: "Гарри Поттер", en: "Harry Potter" },
    fb: { uz: "Fantastik maxluqlar", ru: "Фантастические твари", en: "Fantastic Beasts" }
  };
  var FILM_WORD = { uz: "film", ru: "фильма", en: "films" };
  var SEEN_WORD = { uz: "Ko'rilgan", ru: "Просмотрено", en: "Watched" };
  var SOON_TILES = [
    { key: "series", icon: "M3.5 7.5h17v11h-17z M8.5 3.5l3.5 4 3.5-4",
      name: { uz: "Seriallar", ru: "Сериалы", en: "Series" },
      sub: { uz: "Dekabr, 2026", ru: "Декабрь 2026", en: "December 2026" } },
    { key: "music", icon: "M9 18V6l10-2v12 M9 18a2.5 2.5 0 1 1-5 0a2.5 2.5 0 1 1 5 0 M19 16a2.5 2.5 0 1 1-5 0a2.5 2.5 0 1 1 5 0",
      name: { uz: "Soundtrack", ru: "Саундтреки", en: "Soundtracks" }, sub: null },
    { key: "books", icon: "M12 6.5c-2-1.5-5-2-8-1.5v13c3-.5 6 0 8 1.5c2-1.5 5-2 8-1.5v-13c-3-.5-6 0-8 1.5z M12 6.5v13",
      name: { uz: "Kitoblar", ru: "Книги", en: "Books" }, sub: null }
  ];

  // ==MS==
