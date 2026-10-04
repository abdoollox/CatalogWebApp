/* Soundtrack: javon, albom, pleyer, like'lar
   Ilova kodi bir necha faylga bo'lingan; hammasi BIR umumiy maydonda ishlaydi
   va index.html dagi TARTIBDA yuklanadi. Yuklanish paytida keyingi fayldagi
   narsani chaqirmang - tekshiruv: tools/tartib.js */
"use strict";
  /* ---------- SOUNDTRACK ----------
     Albomlar ro'yxati serverdan (/api/music) keladi. Fayllar filmlar kabi yopiq
     Telegram kanalida turadi, server ularni oqim bilan uzatadi (ilovada ham,
     GitHub'da ham musiqa fayli YO'Q). Ikki yo'l: ilova ichida tinglash va butun
     albomni / bitta trekni Telegram chatga yuborish (u yerda ekran o'chsa ham chaladi).
     HOZIRCHA BEPUL. Keyin butun albom galleonga bir marta ochiladi (server: album_open). */
  var API_MUSIC = "https://bot.tizimshunos.uz/api/music";
  var MS_LOCAL = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
  if (MS_LOCAL) { API_MUSIC = "http://" + window.location.hostname + ":8799/api/music"; }
  var MS_CHANNEL = "https://t.me/garripotter_kolleksiya";

  function msPlural(n, one, few, many) {
    var a = n % 10, b = n % 100;
    if (a === 1 && b !== 11) { return one; }
    if (a >= 2 && a <= 4 && (b < 12 || b > 14)) { return few; }
    return many;
  }

  var MS_TX = {
    uz: { shelf: "Soundtrack", kick: "Filmning asl musiqasi", play: "Tinglash", pause: "Pauza",
          dl: "Yuklab olish", sentAll: "Albom bot chatiga yuborildi",
          sentOne: function (t) { return "«" + t + "» bot chatiga yuborildi"; },
          slow: "Biroz kuting…", fail: "Yuborib bo'lmadi, birozdan keyin urinib ko'ring",
          loadFail: "Musiqani yuklab bo'lmadi", big: "Bu trek faqat Telegramda chalinadi",
          hint: "Ilova yopilsa musiqa to'xtaydi. Yo'lda tinglash uchun albomni Telegramga yuboring — u yerda ekran o'chsa ham chalinaveradi.",
          albums: function (n) { return n + " albom"; }, tracks: function (n) { return n + " trek"; },
          min: function (n) { return n + " daq"; }, dlAria: "Yuklab olish (bot chatiga)", likeAria: "Yoqdi",
          likeFail: "Like saqlanmadi, qayta urinib ko'ring" },
    ru: { shelf: "Саундтреки", kick: "Оригинальный саундтрек", play: "Слушать", pause: "Пауза",
          dl: "Скачать", sentAll: "Альбом отправлен в чат с ботом",
          sentOne: function (t) { return "«" + t + "» отправлен в чат с ботом"; },
          slow: "Подождите немного…", fail: "Не удалось отправить, попробуйте чуть позже",
          loadFail: "Не удалось загрузить музыку", big: "Этот трек играет только в Telegram",
          hint: "Если закрыть приложение, музыка остановится. Чтобы слушать в дороге, отправьте альбом в Telegram — там он играет даже с выключенным экраном.",
          albums: function (n) { return n + " " + msPlural(n, "альбом", "альбома", "альбомов"); },
          tracks: function (n) { return n + " " + msPlural(n, "трек", "трека", "треков"); },
          min: function (n) { return n + " мин"; }, dlAria: "Скачать (в чат с ботом)", likeAria: "Нравится",
          likeFail: "Лайк не сохранился, попробуйте ещё раз" },
    en: { shelf: "Soundtracks", kick: "Original motion picture soundtrack", play: "Play", pause: "Pause",
          dl: "Download", sentAll: "Album sent to your bot chat",
          sentOne: function (t) { return "“" + t + "” sent to your bot chat"; },
          slow: "One moment…", fail: "Couldn't send it, please try again shortly",
          loadFail: "Couldn't load the music", big: "This track plays only in Telegram",
          hint: "Music stops when the app is closed. To listen on the go, send the album to Telegram — it keeps playing there even with the screen off.",
          albums: function (n) { return n + (n === 1 ? " album" : " albums"); },
          tracks: function (n) { return n + (n === 1 ? " track" : " tracks"); },
          min: function (n) { return n + " min"; }, dlAria: "Download (to your bot chat)", likeAria: "Like",
          likeFail: "Couldn't save the like, please try again" }
  };

  var MS_COMPOSER = {
    "John Williams": { uz: "Jon Uilyams", ru: "Джон Уильямс" },
    "Patrick Doyle": { uz: "Patrik Doyl", ru: "Патрик Дойл" },
    "Nicholas Hooper": { uz: "Nikolas Xuper", ru: "Николас Хупер" },
    "Alexandre Desplat": { uz: "Aleksandr Despla", ru: "Александр Деспла" }
  };

  var MS_ICON = {
    lock: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17 9V7A5 5 0 0 0 7 7v2a3 3 0 0 0-3 3v7a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3v-7a3 3 0 0 0-3-3M9 7a3 3 0 0 1 6 0v2H9zm4 9.7V18a1 1 0 0 1-2 0v-1.3a2 2 0 1 1 2 0"/></svg>',
    play: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5.2v13.6c0 .8.9 1.3 1.6.8l10.3-6.8a1 1 0 0 0 0-1.6L9.6 4.4C8.9 3.9 8 4.4 8 5.2z"/></svg>',
    pause: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="6" y="4.5" width="4.2" height="15" rx="1.3"/><rect x="13.8" y="4.5" width="4.2" height="15" rx="1.3"/></svg>',
    next: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M5 6.2v11.6c0 .8.9 1.2 1.5.8l8.6-5.8a1 1 0 0 0 0-1.6L6.5 5.4C5.9 5 5 5.4 5 6.2z"/><rect x="16.6" y="5" width="2.6" height="14" rx="1.1"/></svg>',
    dl: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 4v11 M7 10.5l5 5 5-5 M5 20h14"/></svg>',
    heart: '<svg viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round" aria-hidden="true"><path d="M12 20s-7-4.35-9.2-8.7C1.3 8.3 3.1 5 6.4 5c2.1 0 3.5 1.2 5.6 3.3C14.1 6.2 15.5 5 17.6 5c3.3 0 5.1 3.3 3.6 6.3C19 15.65 12 20 12 20z"/></svg>',
    eq: '<i></i><i></i><i></i>'
  };

  var msData = null;        // { hp1: {year, composer, tracks:[{t, d, big}]} }
  var msKey = "";           // tinglash kaliti (server imzolaydi, 12 soat)
  var msCur = null;         // hozir chalinayotgan: {album, i}
  var msOpen = null;        // ochiq albom sahifasi
  var msAudio = null;
  var msSending = false;
  var msRetried = false;
  var msLogged = {};
  var msScroll = 0;

  function msInitData() {
    var init = "";
    try { init = (tg && tg.initData) || ""; } catch (e) {}
    return init;
  }

  // Albom muqovasi guruhdagi albom sarlavhasi rasmidan (server saqlaydi); bo'lmasa film plakati
  function msCover(id) {
    var cv = msData && msData[id] && msData[id].cv;
    return cv ? API_MUSIC + "/cover/" + id + ".jpg?v=" + cv : "img/sq/" + id + "_" + lang + ".jpg";
  }
  function msTracks(id) { return (msData && msData[id] && msData[id].tracks) || []; }
  function msName(id) {
    for (var i = 0; i < MOVIES.length; i++) { if (MOVIES[i].id === id) { return MOVIES[i][lang]; } }
    return id;
  }
  function msNumeral(id) {
    for (var i = 0; i < MOVIES.length; i++) { if (MOVIES[i].id === id) { return NUMERALS[i]; } }
    return "";
  }
  function msComposer(id) {
    var c = (msData && msData[id] && msData[id].composer) || "";
    return (MS_COMPOSER[c] && MS_COMPOSER[c][lang]) || c;
  }
  function msAlbums() {
    var out = [];
    MOVIES.forEach(function (m) { if (msTracks(m.id).length) { out.push(m.id); } });
    return out;
  }
  function msDur(sec) {
    sec = Math.max(0, Math.round(sec || 0));
    var m = Math.floor(sec / 60), s = sec % 60;
    return m + ":" + (s < 10 ? "0" : "") + s;
  }
  function msPlaying() { return !!(msAudio && msCur && !msAudio.paused && !msAudio.ended); }

  /* --- ro'yxatni olish --- */
  function msFetch(cb) {
    if (!window.fetch) { return; }
    window.fetch(API_MUSIC, { headers: { "X-Telegram-Init-Data": msInitData() } })
      .then(function (r) { return r.json(); })
      .then(function (res) {
        if (!res || !res.ok) { if (cb) { cb(); } return; }
        var before = JSON.stringify(msData || {});
        msData = res.albums || {};
        msKey = res.key || "";
        if (typeof res.price === "number" && res.price > 0) { msPrice = res.price; }
        if (typeof res.gal === "number") { msGal = res.gal; }
        try { window.localStorage.setItem("hp_music", JSON.stringify(msData)); } catch (e) {}
        if (JSON.stringify(msData) !== before) {
          var cat = $("scr-cat");
          if (cat && !cat.classList.contains("hidden")) { renderCatalog(); }
          if (msOpen) { msRenderAlbum(); }
        }
        msMaybeOst();
        if (cb) { cb(); }
      })["catch"](function () { if (cb) { cb(); } });
  }

  /* --- kutubxona javoni --- */
  function msShelf() {
    var list = msAlbums();
    if (!list.length) { return null; }
    var x = MS_TX[lang];
    var sec = document.createElement("div");
    sec.className = "rowsec";
    var head = document.createElement("div");
    head.className = "rowsec-h";
    var b = document.createElement("b");
    b.textContent = x.shelf;
    var c = document.createElement("span");
    c.textContent = x.albums(list.length);
    head.appendChild(b);
    head.appendChild(c);
    sec.appendChild(head);

    var row = document.createElement("div");
    row.className = "ms-row";
    list.forEach(function (id) {
      var card = document.createElement("button");
      card.type = "button";
      card.className = "ms-card" + (msCur && msCur.album === id && msPlaying() ? " on" : "") +
                       (msData[id].cv ? " art" : "");
      card.setAttribute("data-album", id);
      card.innerHTML =
        '<span class="ms-art"><span class="ms-disc"></span><span class="ms-shine"></span>' +
        '<span class="ms-cover"><img alt="" loading="lazy" decoding="async"><b class="ms-num"></b>' +
        '<span class="ms-eq">' + MS_ICON.eq + '</span><span class="ms-lk"></span></span></span>' +
        '<span class="ms-name"></span><span class="ms-sub"></span>';
      card.querySelector("img").src = msCover(id);
      card.querySelector(".ms-disc").style.setProperty("--lbl", "url('" + msCover(id) + "')");
      card.querySelector(".ms-num").textContent = msNumeral(id);
      card.querySelector(".ms-name").textContent = msName(id);
      card.querySelector(".ms-sub").textContent = msComposer(id) + " · " + msData[id].year;
      var sum = msSum(id), pill = card.querySelector(".ms-lk");
      pill.innerHTML = sum ? MS_ICON.heart + "<span>" + msLikeNum(sum) + "</span>" : "";
      pill.classList.toggle("hidden", !sum);
      if (msLocked(id)) {
        // Yopiq albom: muqova ustida qulf va narx
        card.classList.add("lock");
        var qulf = document.createElement("span");
        qulf.className = "ms-lock";
        qulf.innerHTML = MS_ICON.lock + "<span></span>";
        qulf.querySelector("span").textContent = (MS_BUY[lang] || MS_BUY.uz).chip(msPrice);
        card.querySelector(".ms-cover").appendChild(qulf);
      }
      card.addEventListener("click", function () { msOpenAlbum(id); });
      row.appendChild(card);
    });
    sec.appendChild(row);
    return sec;
  }

  /* --- albom sahifasi --- */
  function msOpenAlbum(id) {
    msOpen = id;
    msScroll = window.scrollY || 0;
    msRenderAlbum();
    $("scr-cat").classList.add("hidden");
    $("scr-album").classList.remove("hidden");
    try { window.scrollTo(0, 0); } catch (e) {}
  }

  function msCloseAlbum() {
    msOpen = null;
    $("scr-album").classList.add("hidden");
    $("scr-cat").classList.remove("hidden");
    renderCatalog();
    try { window.scrollTo(0, msScroll); } catch (e) {}
  }

  function msRenderAlbum() {
    var id = msOpen;
    if (!id) { return; }
    var x = MS_TX[lang];
    var list = msTracks(id);
    var total = 0;
    list.forEach(function (tr) { total += tr.d || 0; });

    $("ms-sleeve").src = msCover(id);
    $("ms-vinyl").style.setProperty("--lbl", "url('" + msCover(id) + "')");
    $("ms-kick").textContent = x.kick;
    $("ms-title").textContent = msName(id);
    $("ms-meta").textContent = [msComposer(id), (msData && msData[id] ? msData[id].year : ""),
                                x.tracks(list.length), x.min(Math.round(total / 60))].join(" · ");
    $("ms-dl").innerHTML = MS_ICON.dl + "<span></span>";
    $("ms-dl").querySelector("span").textContent = x.dl;
    $("ms-dl").setAttribute("aria-label", x.dlAria);
    $("ms-hint").textContent = x.hint;
    var yopiq = msLocked(id), bx = MS_BUY[lang] || MS_BUY.uz;
    $("scr-album").classList.toggle("ms-yopiq", yopiq);
    $("ms-buy").classList.toggle("hidden", !yopiq);
    if (yopiq) {
      $("ms-buy-b").innerHTML = MS_ICON.lock + "<span></span>";
      $("ms-buy-b").querySelector("span").textContent = bx.bar(msPrice);
      $("ms-buy-s").textContent = bx.have(msGal);
      $("ms-buy-b").onclick = function () { msBuyAsk(id); };
    }

    var box = $("ms-list");
    box.innerHTML = "";
    list.forEach(function (tr, i) {
      var row = document.createElement("div");
      row.className = "ms-tr" + (tr.big ? " big" : "");
      row.innerHTML =
        '<button class="ms-tr-main" type="button"><span class="ms-tr-n"></span>' +
        '<span class="ms-tr-eq">' + MS_ICON.eq + '</span><span class="ms-tr-t"></span>' +
        '<span class="ms-tr-d"></span></button>' +
        '<button class="ms-tr-lk" type="button">' + MS_ICON.heart + '<b></b></button>' +
        '<button class="ms-tr-dl" type="button">' + MS_ICON.dl + '</button>';
      row.querySelector(".ms-tr-n").textContent = i + 1;
      row.querySelector(".ms-tr-t").textContent = tr.t;
      // Ba'zi fayllarda davomiylik yozilmagan (0) — bo'sh qoldiramiz, "0:00" chalg'itadi
      row.querySelector(".ms-tr-d").textContent = tr.d ? msDur(tr.d) : "";
      row.querySelector(".ms-tr-dl").setAttribute("aria-label", x.dlAria);
      row.querySelector(".ms-tr-lk").setAttribute("aria-label", x.likeAria);
      row.querySelector(".ms-tr-main").addEventListener("click", function () {
        if (tr.big) { showToast(x.big); msSend(id, i + 1); return; }
        if (msCur && msCur.album === id && msCur.i === i) { msToggle(); } else { msPlay(id, i); }
      });
      row.querySelector(".ms-tr-dl").addEventListener("click", function () { msSend(id, i + 1); });
      row.querySelector(".ms-tr-lk").addEventListener("click", function () { msLike(id, i); });
      box.appendChild(row);
    });
    msSync();
  }

  /* --- pleyer --- */
  function msEnsureAudio() {
    if (msAudio) { return msAudio; }
    msAudio = new Audio();
    msAudio.preload = "auto";
    ["play", "pause", "playing", "waiting"].forEach(function (ev) { msAudio.addEventListener(ev, msSync); });
    msAudio.addEventListener("timeupdate", msProgress);
    msAudio.addEventListener("ended", function () { msNext(true); });
    msAudio.addEventListener("error", msError);
    try {
      if (navigator.mediaSession) {
        var ms = navigator.mediaSession;
        ms.setActionHandler("play", function () { msToggle(); });
        ms.setActionHandler("pause", function () { msToggle(); });
        ms.setActionHandler("nexttrack", function () { msNext(false); });
        ms.setActionHandler("previoustrack", msPrev);
      }
    } catch (e) {}
    return msAudio;
  }

  /* --- albomni galleonga ochish (egasi, 2026-10-04) ---
     Birinchi albom bepul, qolganlari bir marta galleonga ochiladi (server: /api/music/buy).
     Yopiq albomning treklar ro'yxati ko'rinadi, lekin tinglash va yuklab olish - ochilgach. */
  var MS_BUY = {
    uz: { chip: function (n) { return n + " galleon"; }, bar: function (n) { return "Albomni ochish · " + n + " galleon"; },
          have: function (n) { return "Hamyoningizda " + n + " galleon"; },
          ask: function (nom, n, bor) { return "Albom ochilsinmi?\n\n«" + nom + "» — " + n + " galleon. Sizda " + bor + " galleon bor. Albom doim ochiq qoladi."; },
          yes: "Ochish", no: "Hozir emas", done: "Albom ochildi",
          poor: function (n, bor) { return "Galleon yetmaydi\n\nAlbom " + n + " galleon turadi, sizda " + bor + " galleon bor. Galleon har hafta yakunida Xogvarts kubogidagi ballaringiz uchun beriladi: har 10 ballga 1 galleon, g'olib fakultetga ikki baravar."; },
          cup: "Kubokni ko'rish", close: "Yopish" },
    ru: { chip: function (n) { return n + " галлеонов"; }, bar: function (n) { return "Открыть альбом · " + n + " галлеонов"; },
          have: function (n) { return "В кошельке " + n + " галлеонов"; },
          ask: function (nom, n, bor) { return "Открыть альбом?\n\n«" + nom + "» — " + n + " галлеонов. У вас " + bor + ". Альбом останется открытым навсегда."; },
          yes: "Открыть", no: "Не сейчас", done: "Альбом открыт",
          poor: function (n, bor) { return "Не хватает галлеонов\n\nАльбом стоит " + n + ", у вас " + bor + ". Галлеоны выдаются в конце каждой недели за очки в Кубке Хогвартса: 1 галлеон за каждые 10 очков, факультету-победителю — вдвое больше."; },
          cup: "Открыть кубок", close: "Закрыть" },
    en: { chip: function (n) { return n + " Galleons"; }, bar: function (n) { return "Unlock album · " + n + " Galleons"; },
          have: function (n) { return n + " Galleons in your wallet"; },
          ask: function (nom, n, bor) { return "Unlock this album?\n\n\u201c" + nom + "\u201d \u2014 " + n + " Galleons. You have " + bor + ". It stays unlocked forever."; },
          yes: "Unlock", no: "Not now", done: "Album unlocked",
          poor: function (n, bor) { return "Not enough Galleons\n\nThe album costs " + n + ", you have " + bor + ". Galleons are paid at the end of each week for your House Cup points: 1 Galleon per 10 points, doubled for the winning house."; },
          cup: "Open the Cup", close: "Close" }
  };
  var MS_GUIDE = {
    uz: { outT: "Albom galleonga ochiladi", outGo: "Maktubni ochish",
          out: function (n) { return "Galleon — Xogvarts puli. Uni shunday olasiz:\n\n1. Boyo'g'li keltirgan Xogvarts maktubini oching va fakultetga tushing (5 daqiqa).\n2. Fakultetingizga ball to'plang: har film +5, kunlik savol +10, taklif qilgan do'stingiz +20.\n3. Har hafta yakunida 10 ball uchun 1 galleon beriladi.\n\nBitta albom " + n + " galleon turadi va doim ochiq qoladi. Birinchi albom bepul."; },
          inT: "Galleon yetmaydi",
          ich: function (n, bor) { return "Albom " + n + " galleon turadi, sizda " + bor + " galleon bor.\n\nGalleon shunday yig'iladi:\n1. Ball to'plang: har film +5, kunlik savol +10, shaxmatda g'alaba +10, taklif qilgan do'stingiz +20.\n2. Hafta yakunida (yakshanba kechasi) har 10 ball uchun 1 galleon beriladi.\n3. Fakultetingiz kubokni yutsa — ikki baravar, eng yaxshi uch o'quvchiga yana +15, +10, +5."; } },
    ru: { outT: "Альбом открывается за галлеоны", outGo: "Открыть письмо",
          out: function (n) { return "Галлеоны — деньги Хогвартса. Получить их можно так:\n\n1. Откройте письмо из Хогвартса, которое принесла сова, и пройдите распределение (5 минут).\n2. Набирайте очки для факультета: каждый фильм +5, вопрос дня +10, приглашённый друг +20.\n3. В конце каждой недели за 10 очков выдаётся 1 галлеон.\n\nОдин альбом стоит " + n + " галлеонов и остаётся открытым навсегда. Первый альбом бесплатный."; },
          inT: "Не хватает галлеонов",
          ich: function (n, bor) { return "Альбом стоит " + n + " галлеонов, у вас " + bor + ".\n\nКак накопить:\n1. Набирайте очки: каждый фильм +5, вопрос дня +10, победа в шахматах +10, приглашённый друг +20.\n2. В конце недели (в ночь на понедельник) за каждые 10 очков выдаётся 1 галлеон.\n3. Если ваш факультет выиграет Кубок — вдвое больше, трём лучшим ученикам ещё +15, +10, +5."; } },
    en: { outT: "Albums are unlocked with Galleons", outGo: "Open the letter",
          out: function (n) { return "Galleons are Hogwarts money. Here is how to get them:\n\n1. Open the Hogwarts letter the owl brought and get sorted into a house (5 minutes).\n2. Earn points for your house: +5 per film, +10 for the daily question, +20 for a friend you invite.\n3. At the end of every week you get 1 Galleon per 10 points.\n\nOne album costs " + n + " Galleons and stays unlocked forever. The first album is free."; },
          inT: "Not enough Galleons",
          ich: function (n, bor) { return "The album costs " + n + " Galleons, you have " + bor + ".\n\nHow to save up:\n1. Earn points: +5 per film, +10 for the daily question, +10 for a chess win, +20 for a friend you invite.\n2. At the end of the week (Sunday night) you get 1 Galleon per 10 points.\n3. If your house wins the Cup you get double, and the top three students get +15, +10 and +5 more."; } }
  };
  var msPrice = 3, msGal = 0, msBuying = false;      // narx serverdan keladi (hpmusic.ALBUM_PRICE)

  function msLocked(id) { return !!(msData && msData[id] && msData[id].open === false); }

  function msBuyAsk(id) {
    if (msBuying) { return; }
    var x = MS_BUY[lang] || MS_BUY.uz;
    if (!msInitData()) { showToast(MS_TX[lang].fail, "err"); return; }
    if (msGal < msPrice) {
      // Yo'l-yo'riq noldan (egasi, 2026-10-04): saralanmagan odamga - maktubdan boshlab, saralanganga - ball yo'llari
      var g = MS_GUIDE[lang] || MS_GUIDE.uz, ichkarida = false;
      try { ichkarida = hasHouse(); } catch (e) {}
      if (ichkarida) {
        testAsk(g.ich(msPrice, msGal), function () { try { openCup(); } catch (e) {} }, { title: g.inT, ok: x.cup, no: x.close, left: true });
      } else {
        testAsk(g.out(msPrice), function () { try { goWorld(); } catch (e) {} }, { title: g.outT, ok: g.outGo, no: x.close, left: true });
      }
      return;
    }
    testAsk(x.ask(msName(id), msPrice, msGal), function () { msBuy(id); }, { ok: x.yes, no: x.no });
  }

  function msBuy(id) {
    var x = MS_BUY[lang] || MS_BUY.uz;
    msBuying = true;
    window.fetch(API_MUSIC + "/buy", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Telegram-Init-Data": msInitData() },
      body: JSON.stringify({ album: id })
    }).then(function (r) { return r.json(); }).then(function (res) {
      msBuying = false;
      if (res && typeof res.gal === "number") { msGal = res.gal; }
      if (res && res.ok) {
        msData[id].open = true;
        try { window.localStorage.setItem("hp_music", JSON.stringify(msData)); } catch (e) {}
        try { if (wal) { wal.galleons = msGal; } } catch (e) {}
        try { if (tg && tg.HapticFeedback) { tg.HapticFeedback.notificationOccurred("success"); } } catch (e) {}
        showToast(x.done);
        if (msOpen) { msRenderAlbum(); }
        return;
      }
      if (res && res.error === "pul") { msBuyAsk(id); return; }
      showToast(MS_TX[lang].fail, "err");
    })["catch"](function () { msBuying = false; showToast(MS_TX[lang].fail, "err"); });
  }

  function msUrl(id, i) {
    return API_MUSIC + "/a/" + id + "/" + (i + 1) + "?k=" + encodeURIComponent(msKey);
  }

  function msPlay(id, i) {
    if (msLocked(id)) { msBuyAsk(id); return; }
    var list = msTracks(id);
    while (i < list.length && list[i].big) { i++; }
    if (i >= list.length) { return; }
    try { sqDone("music"); } catch (e) {}
    if (!msKey) {
      // Kalit hali kelmagan (yoki eskirgan) — olib, keyin chalamiz
      msFetch(function () {
        if (msKey) { msPlay(id, i); } else { showToast(MS_TX[lang].loadFail, "err"); }
      });
      return;
    }
    var a = msEnsureAudio();
    msCur = { album: id, i: i };
    msRetried = false;
    a.src = msUrl(id, i);
    var p = a.play();
    if (p && p["catch"]) { p["catch"](function () { msSync(); }); }
    msMeta();
    msSync();
    if (!msLogged[id]) { msLogged[id] = true; msLogPlay(id); }
  }

  function msToggle() {
    if (!msAudio || !msCur) { return; }
    if (msAudio.ended) { msPlay(msCur.album, 0); return; }
    if (msAudio.paused) {
      var p = msAudio.play();
      if (p && p["catch"]) { p["catch"](function () {}); }
    } else {
      msAudio.pause();
    }
  }

  function msNext(auto) {
    if (!msCur) { return; }
    var list = msTracks(msCur.album);
    var j = msCur.i + 1;
    while (j < list.length && list[j].big) { j++; }
    if (j < list.length) { msPlay(msCur.album, j); return; }
    // Albom tugadi: to'xtaymiz, "Tinglash" boshidan boshlaydi
    if (!auto && msAudio) { msAudio.pause(); }
    msSync();
  }

  function msPrev() {
    if (!msCur || !msAudio) { return; }
    if (msAudio.currentTime > 3 || msCur.i === 0) { msAudio.currentTime = 0; return; }
    var j = msCur.i - 1;
    var list = msTracks(msCur.album);
    while (j > 0 && list[j].big) { j--; }
    msPlay(msCur.album, j);
  }

  function msError() {
    if (!msCur || !msAudio || !msAudio.getAttribute("src")) { return; }
    // Kalit eskirgan bo'lishi mumkin (12 soat) — bir marta yangisini olib qayta urinamiz
    if (!msRetried) {
      msRetried = true;
      var cur = msCur;
      msFetch(function () {
        if (!msCur || msCur !== cur || !msKey) { return; }
        msAudio.src = msUrl(cur.album, cur.i);
        var p = msAudio.play();
        if (p && p["catch"]) { p["catch"](function () { msSync(); }); }
      });
      return;
    }
    showToast(MS_TX[lang].loadFail, "err");
    msSync();
  }

  function msMeta() {
    try {
      if (!navigator.mediaSession || !window.MediaMetadata || !msCur) { return; }
      var tr = msTracks(msCur.album)[msCur.i];
      var art = new URL(msCover(msCur.album), window.location.href).href;
      navigator.mediaSession.metadata = new MediaMetadata({
        title: tr ? tr.t : "", artist: msComposer(msCur.album), album: msName(msCur.album),
        artwork: [{ src: art, type: "image/jpeg" }]
      });
    } catch (e) {}
  }

  function msProgress() {
    var bar = $("mp-prog");
    if (!bar || !msAudio) { return; }
    var d = msAudio.duration;
    if (!d || !isFinite(d)) {
      var tr = msCur && msTracks(msCur.album)[msCur.i];
      d = tr ? tr.d : 0;
    }
    bar.style.width = d ? Math.min(100, msAudio.currentTime / d * 100) + "%" : "0";
  }

  // Hamma joydagi holatni bir yerdan yangilaydi: mini pleyer, albom sahifasi, javon
  function msSync() {
    var playing = msPlaying();
    var x = MS_TX[lang];

    var mp = $("mp");
    if (mp && msCur) {
      var tr = msTracks(msCur.album)[msCur.i];
      $("mp-img").src = msCover(msCur.album);
      $("mp-t").textContent = tr ? tr.t : "";
      $("mp-a").textContent = msName(msCur.album) + " · " + msComposer(msCur.album);
      $("mp-pp").innerHTML = playing ? MS_ICON.pause : MS_ICON.play;
      $("mp-pp").setAttribute("aria-label", playing ? x.pause : x.play);
      $("mp-next").innerHTML = MS_ICON.next;
    }
    msBarVisible();

    if (msOpen) {
      var mine = !!(msCur && msCur.album === msOpen);
      var on = mine && playing;
      $("ms-play").innerHTML = (on ? MS_ICON.pause : MS_ICON.play) + "<span></span>";
      $("ms-play").querySelector("span").textContent = on ? x.pause : x.play;
      $("ms-stage").classList.toggle("out", mine);
      $("ms-stage").classList.toggle("spin", on);
      var rows = $("ms-list").children;
      for (var i = 0; i < rows.length; i++) {
        var cur = mine && msCur.i === i;
        rows[i].classList.toggle("on", cur);
        rows[i].classList.toggle("paused", cur && !playing);
      }
    }

    var cards = document.querySelectorAll(".ms-card");
    for (var k = 0; k < cards.length; k++) {
      var own = !!(msCur && cards[k].getAttribute("data-album") === msCur.album);
      cards[k].classList.toggle("on", own && playing);
    }
    msLikeUI();
  }

  /* --- like'lar --- */
  function msSum(id) {
    var n = 0;
    msTracks(id).forEach(function (tr) { n += tr.l || 0; });
    return n;
  }

  function msLikeNum(n) { return n > 999 ? (Math.floor(n / 100) / 10) + "k" : String(n); }

  // Yurakchalar va sonlarni hamma joyda yangilaydi: treklar, albom, javon, mini pleyer
  function msLikeUI() {
    if (msOpen) {
      var list = msTracks(msOpen);
      var rows = $("ms-list").children;
      for (var i = 0; i < rows.length && i < list.length; i++) {
        var b = rows[i].querySelector(".ms-tr-lk");
        if (!b) { continue; }
        b.classList.toggle("on", !!list[i].me);
        b.setAttribute("aria-pressed", list[i].me ? "true" : "false");
        b.querySelector("b").textContent = list[i].l ? msLikeNum(list[i].l) : "";
      }
      var sum = msSum(msOpen);
      var chip = $("ms-lk");
      chip.innerHTML = MS_ICON.heart + "<span></span>";
      chip.querySelector("span").textContent = msLikeNum(sum);
      chip.classList.toggle("zero", !sum);
    }
    var cards = document.querySelectorAll(".ms-card");
    for (var k = 0; k < cards.length; k++) {
      var s = msSum(cards[k].getAttribute("data-album"));
      var pill = cards[k].querySelector(".ms-lk");
      if (!pill) { continue; }
      pill.innerHTML = s ? MS_ICON.heart + "<span>" + msLikeNum(s) + "</span>" : "";
      pill.classList.toggle("hidden", !s);
    }
    var mb = $("mp-lk");
    if (mb && msCur) {
      var tr = msTracks(msCur.album)[msCur.i];
      mb.innerHTML = MS_ICON.heart;
      mb.classList.toggle("on", !!(tr && tr.me));
      mb.setAttribute("aria-label", MS_TX[lang].likeAria);
    }
  }

  var msLiking = {};
  function msLike(id, i) {
    var tr = msTracks(id)[i];
    if (!tr) { return; }
    var key = id + ":" + i;
    if (msLiking[key]) { return; }
    var init = msInitData();
    if (!init && !MS_LOCAL) { showToast(MS_TX[lang].likeFail, "err"); return; }
    // Darhol ko'rsatamiz, server javobi kelgach aniq son bilan almashtiramiz
    var was = { me: !!tr.me, l: tr.l || 0 };
    tr.me = !was.me;
    tr.l = Math.max(0, was.l + (tr.me ? 1 : -1));
    msLiking[key] = true;
    msLikeUI();
    msPop(id, i);
    try { if (tg && tg.HapticFeedback) { tg.HapticFeedback.impactOccurred(tr.me ? "medium" : "light"); } } catch (e) {}
    window.fetch(API_MUSIC + "/like", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Telegram-Init-Data": init },
      body: JSON.stringify({ album: id, track: i + 1, on: tr.me })
    }).then(function (r) { return r.json(); }).then(function (res) {
      msLiking[key] = false;
      if (res && res.ok) { tr.me = !!res.me; tr.l = res.l || 0; }
      else { tr.me = was.me; tr.l = was.l; showToast(MS_TX[lang].likeFail, "err"); }
      msLikeUI();
      try { window.localStorage.setItem("hp_music", JSON.stringify(msData)); } catch (e) {}
    })["catch"](function () {
      msLiking[key] = false;
      tr.me = was.me; tr.l = was.l;
      msLikeUI();
      showToast(MS_TX[lang].likeFail, "err");
    });
  }

  // Like bosilganda yurakcha "sakraydi"
  function msPop(id, i) {
    var els = [];
    if (msOpen === id) {
      var row = $("ms-list").children[i];
      if (row) { els.push(row.querySelector(".ms-tr-lk")); }
    }
    if (msCur && msCur.album === id && msCur.i === i) { els.push($("mp-lk")); }
    els.forEach(function (el) {
      if (!el) { return; }
      el.classList.remove("pop");
      void el.offsetWidth;
      el.classList.add("pop");
    });
  }

  // Mini pleyer faqat kutubxona va albom sahifasida. Boshqa ekranlarda (chat,
  // shaxmat...) pastki joy band — musiqa baribir chalinaveradi.
  function msBarVisible() {
    var mp = $("mp");
    if (!mp) { return; }
    var cat = $("scr-cat"), alb = $("scr-album");
    var here = (cat && !cat.classList.contains("hidden")) || (alb && !alb.classList.contains("hidden"));
    var show = !!(msCur && here);
    mp.classList.toggle("hidden", !show);
    document.body.classList.toggle("mp-on", show);
  }

  /* --- Telegramga yuborish --- */
  function msSend(id, n) {
    if (msLocked(id)) { msBuyAsk(id); return; }
    if (msSending) { return; }
    var x = MS_TX[lang], t = T[lang];
    var init = msInitData();
    if (!init && !MS_LOCAL) { showToast(x.fail, "err"); return; }
    msSending = true;
    var pending = showToast(t.sending);
    var body = { album: id, lang: lang };
    if (n) { body.track = n; }
    window.fetch(API_MUSIC + "/send", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Telegram-Init-Data": init },
      body: JSON.stringify(body)
    }).then(function (r) { return r.json(); }).then(function (res) {
      msSending = false;
      dismissNote(pending);
      if (res && res.ok) {
        var tr = n ? msTracks(id)[n - 1] : null;
        showToast(tr ? x.sentOne(tr.t) : x.sentAll, "ok");
        try { if (tg && tg.HapticFeedback) { tg.HapticFeedback.notificationOccurred("success"); } } catch (e) {}
        return;
      }
      var err = res && res.error;
      if (err === "not_subscribed") {
        showToast(t.notSubscribed, "err");
        try { if (tg && tg.openTelegramLink) { tg.openTelegramLink(MS_CHANNEL); } } catch (e) {}
        return;
      }
      showToast(err === "slow" ? x.slow : x.fail, err === "slow" ? "" : "err");
    })["catch"](function () {
      msSending = false;
      dismissNote(pending);
      showToast(x.fail, "err");
    });
  }

  // Statistikaga: albom shu sessiyada birinchi marta ilovada chalindi
  function msLogPlay(id) {
    var init = msInitData();
    if (!init || !window.fetch) { return; }
    window.fetch(API_MUSIC + "/send", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Telegram-Init-Data": init },
      body: JSON.stringify({ album: id, action: "play" })
    })["catch"](function () {});
  }

  // Trek ostidagi "GARRI POTTER KOLLEKSIYA" havolasi: t.me/<bot>/catalog?startapp=ost_hp1
  // — ilova ochilishi bilan o'sha albom sahifasi ochiladi.
  var msPendingOst = null;
  try {
    var msSp = (tg && tg.initDataUnsafe && tg.initDataUnsafe.start_param) || "";
    if (!msSp) {
      var msSpm = /[?&#]tgWebAppStartParam=([^&#]+)/.exec((window.location.search || "") + (window.location.hash || ""));
      if (msSpm) { msSp = decodeURIComponent(msSpm[1]); }
    }
    var msOm = /^ost_(hp[1-8])$/i.exec(msSp);
    if (msOm) { msPendingOst = msOm[1].toLowerCase(); }
  } catch (e) { msPendingOst = null; }

  function msMaybeOst() {
    if (!msPendingOst || !msTracks(msPendingOst).length) { return; }
    var cat = $("scr-cat");
    if (!cat || cat.classList.contains("hidden")) { return; }
    var id = msPendingOst;
    msPendingOst = null;
    msOpenAlbum(id);
  }

  function msInit() {
    try { msData = JSON.parse(window.localStorage.getItem("hp_music") || "null"); } catch (e) { msData = null; }
    $("ms-back").addEventListener("click", msCloseAlbum);
    $("ms-play").addEventListener("click", function () {
      if (!msOpen) { return; }
      if (msCur && msCur.album === msOpen) { msToggle(); } else { msPlay(msOpen, 0); }
    });
    $("ms-dl").addEventListener("click", function () { if (msOpen) { msSend(msOpen, null); } });
    $("mp-lk").addEventListener("click", function () { if (msCur) { msLike(msCur.album, msCur.i); } });
    $("mp-pp").addEventListener("click", msToggle);
    $("mp-next").addEventListener("click", function () { msNext(false); });
    $("mp-main").addEventListener("click", function () {
      if (msCur && msOpen !== msCur.album) {
        if (msOpen) { msOpen = msCur.album; msRenderAlbum(); try { window.scrollTo(0, 0); } catch (e) {} }
        else { msOpenAlbum(msCur.album); }
      }
    });
    // Ekranlar ko'p joyda to'g'ridan-to'g'ri yashiriladi — mini pleyer o'zi kuzatadi
    try {
      if (window.MutationObserver) {
        var mo = new MutationObserver(msBarVisible);
        mo.observe($("scr-cat"), { attributes: true, attributeFilter: ["class"] });
        mo.observe($("scr-album"), { attributes: true, attributeFilter: ["class"] });
      }
    } catch (e) {}
    msFetch();
  }
  msInit();
  // ==/MS==
  // Katta karta uchun 16:9 rasm; bo'lmasa o'zbekchasi, u ham bo'lmasa plakat.
  // img/hero — img/wide ning 800px li yengil nusxasi (wide ni bot Telegram kartalari uchun ishlatadi)
  function heroArt(id) {
    return "img/hero/" + id + "_" + lang + ".jpg";
  }

  function renderHero(t) {
    var hero = $("hero");
    var i = nextIndex();
    var n = 0;
    MOVIES.forEach(function (m) { if (watched[key(m.id)]) { n++; } });
    var total = MOVIES.length;

    if (i < 0) { hero.classList.add("hidden"); return; }
    hero.classList.remove("hidden");

    var m = MOVIES[i];
    var art = $("hero-art");
    var old = art.querySelector("img");
    if (old) { old.remove(); }

    var img = document.createElement("img");
    img.alt = "";
    img.decoding = "async";
    // 16:9 rasm (shu til -> o'zbekcha), bo'lmasa plakat
    imgTry(img, [heroArt(m.id), "img/hero/" + m.id + "_uz.jpg", poster(m.id)], function (step, url) {
      img.style.objectPosition = url.indexOf("/hero/") === -1 ? "center 20%" : "";
    });
    art.insertBefore(img, art.firstChild);

    $("hero-kick").textContent = t.next;
    $("hero-title").textContent = m[lang];

    var ticks = $("hero-ticks");
    ticks.innerHTML = "";
    for (var k = 0; k < total; k++) {
      var s2 = document.createElement("i");
      if (k < n) { s2.className = "on"; }
      ticks.appendChild(s2);
    }
    $("hero-meta").textContent = SEEN_WORD[lang] + ": " + n + " / " + total;
    hero.onclick = function () { play(m.id); };
  }

  function rowSection(title, count) {
    var sec = document.createElement("div");
    sec.className = "rowsec";
    var head = document.createElement("div");
    head.className = "rowsec-h";
    var b = document.createElement("b");
    b.textContent = title;
    var c = document.createElement("span");
    c.textContent = count;
    head.appendChild(b);
    head.appendChild(c);
    sec.appendChild(head);
    var scroll = document.createElement("div");
    scroll.className = "rowscroll";
    sec.appendChild(scroll);
    sec.scroller = scroll;
    return sec;
  }

  var BADGE_SVG = {
    get: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" ' +
         'stroke-linejoin="round" aria-hidden="true"><path d="M12 4v11 M7 10.5l5 5 5-5 M5 20h14"></path></svg>',
    got: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" ' +
         'stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"></path></svg>',
    soon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" ' +
          'stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="8.5"></circle><path d="M12 7.5V12l3 2"></path></svg>'
  };

  // Bitta film kartasi. O'ng tepadagi belgi: yuklab olinmagan bo'lsa "yuklab olish",
  // olingan bo'lsa ✓, hali yuklanmagan bo'lsa soat. ✓ bir marta qo'yilgach qaytarib olinmaydi.
  // Sarlavha doim ikki qatorda: eng teng bo'ladigan bo'shliqdan bo'linadi
  // ("Maxfiy / Hujra", "Ajal / Tuhfasi 1"). Kartalar tagi bir tekis turadi.
  function twoLines(text) {
    var words = String(text).split(" ");
    if (words.length < 2) { return [text]; }
    var best = 1, bestLen = Infinity;
    for (var i = 1; i < words.length; i++) {
      var a = words.slice(0, i).join(" ").length, b = words.slice(i).join(" ").length;
      if (Math.max(a, b) < bestLen) { bestLen = Math.max(a, b); best = i; }
    }
    return [words.slice(0, best).join(" "), words.slice(best).join(" ")];
  }

  function filmCard(m, numeral, t, pending) {
    var ready = isReady(m.id);
    var seen = ready && !!watched[key(m.id)];

    var card = document.createElement("div");
    card.className = "card" + (!ready ? " soon" : (seen ? " seen" : "")) + (pending ? " exam" : "");
    card.style.background = CARD_BG;
    if (ready) { card.addEventListener("click", function () { play(m.id); }); }

    var img = document.createElement("img");
    img.className = "card-img";
    img.loading = "lazy";
    img.decoding = "async";
    img.alt = m[lang];
    img.onload = function () { card.classList.add("has-img"); };
    imgTry(img, [poster(m.id), "img/" + m.id + "_uz.jpg?v=3"]);
    card.appendChild(img);

    var veil = document.createElement("span");
    veil.className = "veil";
    card.appendChild(veil);

    var num = document.createElement("span");
    num.className = "numeral";
    num.textContent = numeral;
    card.appendChild(num);

    if (!ready) {
      var clock = document.createElement("span");
      clock.className = "card-badge";
      clock.innerHTML = BADGE_SVG.soon;
      clock.setAttribute("role", "img");
      clock.setAttribute("aria-label", t.soon + ": " + m[lang]);
      card.appendChild(clock);
    } else {
      var badge = document.createElement("button");
      badge.type = "button";
      badge.className = "card-badge";
      badge.innerHTML = seen ? BADGE_SVG.got : BADGE_SVG.get;
      badge.setAttribute("aria-label", (seen ? t.seen : t.download) + ": " + m[lang]);
      badge.addEventListener("click", function (ev) {
        ev.stopPropagation();
        if (!seen) { play(m.id); }
      });
      card.appendChild(badge);
    }

    var foot = document.createElement("span");
    foot.className = "card-foot";
    var textCol = document.createElement("span");
    textCol.className = "card-text";
    var ttl = document.createElement("span");
    ttl.className = "card-title";
    twoLines(m[lang]).forEach(function (part) {
      var line = document.createElement("span");
      line.className = "card-title-line";
      line.textContent = part;
      ttl.appendChild(line);
    });
    textCol.appendChild(ttl);
    foot.appendChild(textCol);
    card.appendChild(foot);

    return card;
  }

  // Uzun so'z ("Фантастические") kartaga sig'masa, BARCHA sarlavhalar bir xil
  // miqdorda kichrayadi - kartalar bir-biridan farq qilmasin.
  var TITLE_FS = 23;
  function fitTitles() {
    var rows = $("rows");
    if (!rows || !rows.clientWidth) { return; }
    rows.style.removeProperty("--title-fs");
    var ratio = 1;
    var lines = rows.querySelectorAll(".card-title-line");
    for (var i = 0; i < lines.length; i++) {
      var need = lines[i].scrollWidth, room = lines[i].clientWidth;
      if (need > room && room > 0) { ratio = Math.min(ratio, room / need); }
    }
    if (ratio < 1) {
      rows.style.setProperty("--title-fs", Math.floor(TITLE_FS * ratio * 2) / 2 + "px");
    }
  }
  try {
    if (window.ResizeObserver) {
      new ResizeObserver(function () { fitTitles(); }).observe($("rows"));
    }
    if (document.fonts && document.fonts.ready) { document.fonts.ready.then(fitTitles); }
  } catch (e) {}

  function renderCards(t) {
    var rows = $("rows");
    rows.innerHTML = "";

    var hp = rowSection(SERIES_TITLE.hp[lang], MOVIES.length + " " + FILM_WORD[lang]);
    MOVIES.forEach(function (m, i) {
      var ready = isReady(m.id);
      var seen = ready && !!watched[key(m.id)];
      // Uchinchi holat: film ko'rilgan, lekin bu mavsumning imtihoni topshirilmagan.
      var pending = seen && examPending(i + 1);
      hp.scroller.appendChild(filmCard(m, NUMERALS[i], t, pending));
    });
    rows.appendChild(hp);

    if (typeof MOVIES_FB !== "undefined" && MOVIES_FB && MOVIES_FB.length) {
      var fb = rowSection(SERIES_TITLE.fb[lang], MOVIES_FB.length + " " + FILM_WORD[lang]);
      MOVIES_FB.forEach(function (m) {
        fb.scroller.appendChild(filmCard(m, m.num, t, false));
      });
      rows.appendChild(fb);
    }

    // Soundtrack javoni (albomlar serverdan kelgan bo'lsa)
    var msSec = msShelf();
    if (msSec) { rows.appendChild(msSec); }

    // Kutubxonaning bo'sh javonlari: seriallar, musiqa, kitoblar.
    var soon = document.createElement("div");
    soon.className = "rowsec";
    var soonHead = document.createElement("div");
    soonHead.className = "rowsec-h";
    var sb = document.createElement("b");
    sb.textContent = t.soon;
    soonHead.appendChild(sb);
    soon.appendChild(soonHead);

    var tiles = document.createElement("div");
    tiles.className = "soonrow";
    var soonItems = SOON_TILES.filter(function (item) { return !(item.key === "music" && msSec); });
    tiles.style.gridTemplateColumns = "repeat(" + soonItems.length + ",minmax(0,1fr))";
    soonItems.forEach(function (item) {
      var tile = document.createElement("div");
      tile.className = "soontile";
      tile.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" ' +
                       'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="' +
                       item.icon + '"></path></svg>';
      var b = document.createElement("b");
      b.textContent = item.name[lang];
      var sp = document.createElement("span");
      sp.textContent = item.sub ? item.sub[lang] : t.soon;
      tile.appendChild(b);
      tile.appendChild(sp);
      tiles.appendChild(tile);
    });
    soon.appendChild(tiles);
    rows.appendChild(soon);
    fitTitles();
  }

  function paintHatSmall(el) {
    if (!el || el.getAttribute("data-done") === "1") { return; }
    el.innerHTML = "";
    var img = document.createElement("img");
    img.src = IMG_DIR + HAT_IMG;
    img.alt = "";
    img.onerror = function () {
      this.onerror = null;
      this.remove();
      el.textContent = "?";
    };
    el.appendChild(img);
    el.setAttribute("data-done", "1");
  }
