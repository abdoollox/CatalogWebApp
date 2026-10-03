/* Kutubxona: HBO serial e'loni, katalog, profil, checklist
   Ilova kodi bir necha faylga bo'lingan; hammasi BIR umumiy maydonda ishlaydi
   va index.html dagi TARTIBDA yuklanadi. Yuklanish paytida keyingi fayldagi
   narsani chaqirmang - tekshiruv: tools/tartib.js */
"use strict";
  /* ---------- HBO SERIALI E'LONI ----------
     Premyera 25-dekabr 2026. Sanash Toshkent vaqti bilan shu kun boshigacha
     (24-dekabr 19:00 UTC). Serial kutubxonaga qo'shilgach karta olib tashlanadi. */
  var SRL_AT = Date.UTC(2026, 11, 24, 19, 0, 0);
  var SRL_TX = {
    uz: { chip: "Yangi serial", date: "25-dekabr", sub: "1-mavsum · Hikmatlar Toshi · 8 qism",
          d: "kun", h: "soat", m: "daqiqa", s: "soniya",
          t1: "Yuqori sifatli video", t2: "Sifatli dublyaj",
          note: "Serial chiqishi bilan shu botda bo'ladi — sizga xabar beramiz.",
          done: "Premyera bo'ldi! Serial tez orada shu yerda.",
          left: function (d, h) { return d + " kun " + h + " soat qoldi"; }, doneShort: "Premyera bo'ldi!" },
    ru: { chip: "Новый сериал", date: "25 декабря", sub: "1 сезон · Философский камень · 8 серий",
          d: "дней", h: "часов", m: "минут", s: "секунд",
          t1: "Высокое качество видео", t2: "Качественная озвучка",
          note: "Как только сериал выйдет, он появится в этом боте — мы вам сообщим.",
          done: "Премьера состоялась! Сериал скоро будет здесь.",
          left: function (d, h) { return "Осталось " + d + " дн. " + h + " ч."; }, doneShort: "Премьера состоялась!" },
    en: { chip: "New series", date: "December 25", sub: "Season 1 · Philosopher's Stone · 8 episodes",
          d: "days", h: "hours", m: "min", s: "sec",
          t1: "High-quality video", t2: "Quality dubbing",
          note: "As soon as it's out, it'll be right here in the bot — we'll let you know.",
          done: "It has premiered! The series is coming here soon.",
          left: function (d, h) { return d + " days " + h + " h left"; }, doneShort: "It has premiered!" }
  };
  var srlTimer = null;
  var srlMini = null;   // null — hali aniqlanmagan; katta karta faqat BIRINCHI kirishda

  function srlSetMini(on) {
    srlMini = on;
    $("srl").classList.toggle("mini", on);
  }

  function srlTick() {
    var box = $("srl");
    if (!box || box.classList.contains("hidden")) { return; }
    var left = Math.max(0, Math.floor((SRL_AT - Date.now()) / 1000));
    var over = left <= 0;
    $("srl-cd").classList.toggle("hidden", over);
    $("srl-done").classList.toggle("hidden", !over);
    var x = SRL_TX[lang] || SRL_TX.uz;
    if (over) {
      $("srl-mt").textContent = x.doneShort;
      if (srlTimer) { clearInterval(srlTimer); srlTimer = null; }
      return;
    }
    $("srl-mt").textContent = x.left(Math.floor(left / 86400), Math.floor(left % 86400 / 3600));
    $("srl-d").textContent = Math.floor(left / 86400);
    $("srl-h").textContent = Math.floor(left % 86400 / 3600);
    $("srl-m").textContent = Math.floor(left % 3600 / 60);
    $("srl-s").textContent = left % 60;
  }

  function renderSerial() {
    var box = $("srl");
    if (!box) { return; }
    var x = SRL_TX[lang] || SRL_TX.uz;
    var art = $("srl-art");
    if (!art.querySelector(".srl-bg")) {
      var bg = document.createElement("img");
      bg.className = "srl-bg";
      bg.alt = "";
      bg.decoding = "async";
      imgTry(bg, [IMG_DIR + "serial/bg.jpg"]);
      art.insertBefore(bg, art.firstChild);

      var logo = document.createElement("img");
      logo.className = "srl-logo";
      logo.alt = "Harry Potter";
      logo.onerror = function () {
        var tx = document.createElement("span");
        tx.className = "srl-logo-tx";
        tx.textContent = "Harry Potter";
        if (logo.parentNode) { logo.parentNode.replaceChild(tx, logo); }
      };
      logo.src = IMG_DIR + "serial/logo.png";
      art.appendChild(logo);

      // Qor: dekabr premyerasi va kadrdagi qorli maydonga mos
      var snow = $("srl-snow");
      for (var k = 0; k < 18; k++) {
        var f = document.createElement("i");
        var sz = 2 + Math.random() * 3;
        f.style.left = (Math.random() * 100) + "%";
        f.style.width = f.style.height = sz + "px";
        f.style.opacity = (0.35 + Math.random() * 0.5).toFixed(2);
        f.style.animationDuration = (6 + Math.random() * 7).toFixed(1) + "s";
        f.style.animationDelay = (-Math.random() * 12).toFixed(1) + "s";
        snow.appendChild(f);
      }
    }
    $("srl-chip").textContent = x.chip;
    $("srl-date").textContent = x.date;
    $("srl-sub").textContent = x.sub;
    $("srl-dl").textContent = x.d;
    $("srl-hl").textContent = x.h;
    $("srl-ml").textContent = x.m;
    $("srl-sl").textContent = x.s;
    $("srl-t1").textContent = x.t1;
    $("srl-t2").textContent = x.t2;
    $("srl-note").textContent = x.note;
    $("srl-done").textContent = x.done;
    $("srl-mk").textContent = x.date;
    if (srlMini === null) {
      // Har doim ixcham qator bo'lib ochiladi (egasi, 2026-10-03: yangi odamga katta karta
      // shovqin). Qiziqqan odam bosib o'zi ochadi.
      srlSetMini(true);
      box.addEventListener("click", function () { srlSetMini(!srlMini); });
    }
    box.classList.remove("hidden");
    srlTick();
    if (!srlTimer && SRL_AT > Date.now()) { srlTimer = setInterval(srlTick, 1000); }
  }

  /* ---------- SERIAL QISMLARI ----------
     Qismlar ro'yxati kodda EMAS: bot uni baza guruhidan o'zi yig'adi (hpserial.py) va
     /api/serial orqali beradi. Qism chiqsa - guruhga fayl tashlash yetarli, ilova o'zi ko'rsatadi.
     Sinov rejimida ro'yxat faqat adminlarga keladi (boshqalarda sanoq bloki turaveradi). */
  var API_SERIAL = "https://bot.tizimshunos.uz/api/serial";
  var SR_TOTAL = { 1: 8 };          // faslda nechta qism kutilmoqda (chiqmaganlari xira ko'rinadi)
  var SR_NEW_MS = 7 * 864e5;        // shuncha vaqt "YANGI" belgisi turadi
  var SR_TX = {
    uz: { chipNew: "Yangi qism", chip: "Serial", chipTest: "Sinov", go: "Tomosha qilish",
          out: function (s, e) { return s + "-fasl · " + e + "-qism chiqdi"; },
          cnt: function (n, all) { return all ? n + " / " + all + " qism" : n + " qism"; },
          kick: "HBO · 2026", season: function (s) { return s + "-fasl"; }, ep: function (e) { return e + "-qism"; },
          soon: "Tez orada", isNew: "YANGI", min: "daq", only: "faqat", sent: "Qism chatga yuborildi", slow: "Biroz kuting…",
          mon: ["yanvar", "fevral", "mart", "aprel", "may", "iyun", "iyul", "avgust", "sentabr", "oktabr", "noyabr", "dekabr"],
          date: function (d, m) { return d + "-" + m; } },
    ru: { chipNew: "Новая серия", chip: "Сериал", chipTest: "Тест", go: "Смотреть",
          out: function (s, e) { return "Сезон " + s + " · вышла " + e + " серия"; },
          cnt: function (n, all) { return all ? n + " / " + all + " серий" : "серий: " + n; },
          kick: "HBO · 2026", season: function (s) { return "Сезон " + s; }, ep: function (e) { return "Серия " + e; },
          soon: "Скоро", isNew: "НОВАЯ", min: "мин", only: "только", sent: "Серия отправлена в чат", slow: "Подождите немного…",
          mon: ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"],
          date: function (d, m) { return d + " " + m; } },
    en: { chipNew: "New episode", chip: "Series", chipTest: "Test", go: "Watch",
          out: function (s, e) { return "Season " + s + " · Episode " + e + " is out"; },
          cnt: function (n, all) { return all ? n + " / " + all + " episodes" : n + " episodes"; },
          kick: "HBO · 2026", season: function (s) { return "Season " + s; }, ep: function (e) { return "Episode " + e; },
          soon: "Coming soon", isNew: "NEW", min: "min", only: "only", sent: "Episode sent to your chat", slow: "One moment…",
          mon: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
          date: function (d, m) { return m + " " + d; } }
  };
  var SR_LANG = { uz: "O'zbekcha", ru: "Русский", en: "English" };
  var srData = null;       // {eps:[{s,e,lang,dur,at}], test, covers:{s1e3: versiya}}
  var srAsked = false, srSeason = null, srBusy = false, srScroll = 0, srPending = false;
  // Bot xabari ostidagi "Barcha qismlar" tugmasi ilovani ?serial=1 bilan ochadi
  try { srPending = /(^|[?&#])(tgWebAppStartParam=serial|serial=1)\b/.test(window.location.href) ||
        ((window.Telegram && Telegram.WebApp && Telegram.WebApp.initDataUnsafe || {}).start_param === "serial"); } catch (e) {}

  function srInit() { try { return (tg && tg.initData) || ""; } catch (e) { return ""; } }

  function srLoad() {
    if (srAsked || !window.fetch) { return; }
    srAsked = true;
    try { srData = JSON.parse(window.localStorage.getItem("hp_serial") || "null"); } catch (e) { srData = null; }
    window.fetch(API_SERIAL, { headers: { "X-Telegram-Init-Data": srInit() } })
      .then(function (r) { return r.json(); })
      .then(function (res) {
        if (!res || !res.ok) { return; }
        srData = { eps: res.eps || [], test: !!res.test, covers: res.covers || {} };
        try { window.localStorage.setItem("hp_serial", JSON.stringify(srData)); } catch (e) {}
        srBlock();
        if (!$("scr-serial").classList.contains("hidden")) { srRender(); }
        srMaybeOpen();
      })["catch"](function () {});
  }

  // Qismlar: {fasl: {qism: {til: yozuv}}}
  function srTree() {
    var t = {};
    ((srData && srData.eps) || []).forEach(function (x) {
      t[x.s] = t[x.s] || {};
      t[x.s][x.e] = t[x.s][x.e] || {};
      t[x.s][x.e][x.lang] = x;
    });
    return t;
  }

  // Qismning shu odamga beriladigan nusxasi: o'z tilida bo'lsa o'sha, bo'lmasa bori
  function srPick(langs) {
    if (!langs) { return null; }
    return langs[lang] || langs.uz || langs.ru || langs.en || null;
  }

  function srArt(key) {
    var v = srData && srData.covers && srData.covers[key];
    return v ? API_SERIAL + "/cover/" + key + ".jpg?v=" + v : IMG_DIR + "serial/bg.jpg";
  }

  // Kutubxonadagi blok: qism bo'lsa sanoq o'rnida shu turadi
  function srBlock() {
    var b = $("srb");
    if (!b) { return; }
    var tree = srTree(), ss = Object.keys(tree).map(Number).sort(function (a, c) { return a - c; });
    if (!ss.length) { b.classList.add("hidden"); return; }
    var x = SR_TX[lang] || SR_TX.uz;
    var s = ss[ss.length - 1];
    var es = Object.keys(tree[s]).map(Number).sort(function (a, c) { return a - c; });
    var e = es[es.length - 1], it = srPick(tree[s][e]);
    var yangi = it && it.at && (Date.now() - it.at * 1000 < SR_NEW_MS);
    $("srb-chip").textContent = srData.test ? x.chipTest : yangi ? x.chipNew : x.chip;
    $("srb-t").textContent = x.out(s, e);
    $("srb-s").textContent = x.cnt(es.length, SR_TOTAL[s]);
    $("srb-go").textContent = x.go;
    $("srb-art").style.backgroundImage = "url('" + srArt("s" + s + "e" + e) + "')";
    b.classList.remove("hidden");
    $("srl").classList.add("hidden");        // sanoq bloki endi kerak emas
    if (!b.onclick) { b.onclick = srOpen; }
  }

  function srOpen() {
    srScroll = window.scrollY || 0;
    srSeason = null;
    srRender();
    $("scr-cat").classList.add("hidden");
    $("scr-serial").classList.remove("hidden");
    try { window.scrollTo(0, 0); } catch (e) {}
  }

  function srClose() {
    $("scr-serial").classList.add("hidden");
    $("scr-cat").classList.remove("hidden");
    renderCatalog();
    try { window.scrollTo(0, srScroll); } catch (e) {}
  }

  // Havoladan (startapp=serial) kelgan bo'lsa serial sahifasi o'zi ochiladi
  function srMaybeOpen() {
    if (!srPending || !srData || !srData.eps || !srData.eps.length) { return; }
    var cat = $("scr-cat");
    if (!cat || cat.classList.contains("hidden")) { return; }
    srPending = false;
    srOpen();
  }

  function srEl(tag, cls, text) {
    var el = document.createElement(tag);
    if (cls) { el.className = cls; }
    if (text != null) { el.textContent = text; }
    return el;
  }

  function srRender() {
    var x = SR_TX[lang] || SR_TX.uz;
    var tree = srTree(), ss = Object.keys(tree).map(Number).sort(function (a, c) { return a - c; });
    if (srSeason === null || !tree[srSeason]) { srSeason = ss.length ? ss[ss.length - 1] : 1; }
    $("sr-top").style.backgroundImage = "url('" + IMG_DIR + "serial/bg.jpg')";
    if (!$("sr-top").querySelector(".sr-logo")) {
      var logo = document.createElement("img");
      logo.className = "sr-logo";
      logo.alt = "Harry Potter";
      logo.src = IMG_DIR + "serial/logo.png";
      $("sr-top").insertBefore(logo, $("sr-kick"));
      $("sr-back").addEventListener("click", srClose);
    }
    $("sr-kick").textContent = x.kick + (srData && srData.test ? " · " + x.chipTest : "");

    var tabs = $("sr-tabs");
    tabs.innerHTML = "";
    tabs.classList.toggle("hidden", ss.length < 2);
    ss.forEach(function (s) {
      var b = srEl("button", "sr-tab" + (s === srSeason ? " on" : ""), x.season(s));
      b.type = "button";
      b.onclick = function () { srSeason = s; srRender(); };
      tabs.appendChild(b);
    });

    var list = $("sr-list");
    list.innerHTML = "";
    var eps = tree[srSeason] || {};
    var bor = Object.keys(eps).map(Number);
    var jami = Math.max(SR_TOTAL[srSeason] || 0, bor.length ? Math.max.apply(null, bor) : 0);
    for (var e = 1; e <= jami; e++) { list.appendChild(srRow(x, srSeason, e, srPick(eps[e]))); }
  }

  function srRow(x, s, e, it) {
    var row = srEl("div", "sr-li" + (it ? "" : " soon"));
    var th = srEl("span", "sr-th");
    th.style.backgroundImage = "url('" + srArt("s" + s + "e" + e) + "')";
    if (it && it.dur) { th.appendChild(srEl("u", "", Math.round(it.dur / 60) + " " + x.min)); }
    row.appendChild(th);
    var tx = srEl("span", "sr-tx");
    var b = srEl("b", "", x.ep(e));
    if (it && it.at && Date.now() - it.at * 1000 < SR_NEW_MS) { b.appendChild(srEl("i", "sr-new", x.isNew)); }
    tx.appendChild(b);
    var sub = x.soon;
    if (it) {
      var d = it.at ? new Date(it.at * 1000) : null;
      sub = (d ? x.date(d.getDate(), x.mon[d.getMonth()]) + " · " : "") +
            (it.lang === lang ? SR_LANG[it.lang] : x.only + " " + SR_LANG[it.lang]);
    }
    tx.appendChild(srEl("small", "", sub));
    row.appendChild(tx);
    if (it) {
      var dl = srEl("button", "sr-dl");
      dl.type = "button";
      dl.setAttribute("aria-label", x.go);
      dl.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 4v12M6.5 11l5.5 5.5 5.5-5.5M5 20h14"/></svg>';
      row.appendChild(dl);
      row.onclick = function () { srSend(it); };
    }
    return row;
  }

  // Qismni bot chatiga yuboradi (filmlar kabi)
  function srSend(it) {
    if (srBusy) { return; }
    var t = T[lang], x = SR_TX[lang] || SR_TX.uz;
    var init = srInit();
    if (!init || !window.fetch) { showToast(t.notReadyMsg, "err"); return; }
    srBusy = true;
    var pending = showToast(t.sending);
    window.fetch(API_SERIAL + "/send", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Telegram-Init-Data": init },
      body: JSON.stringify({ s: it.s, e: it.e, lang: it.lang, ui: lang })
    }).then(function (r) { return r.json(); }).then(function (res) {
      srBusy = false;
      dismissNote(pending);
      if (res && res.ok) {
        try { if (tg && tg.HapticFeedback) { tg.HapticFeedback.notificationOccurred("success"); } } catch (e) {}
        showToast(x.sent);
        return;
      }
      var err = res && res.error;
      if (err === "slow") { showToast(x.slow); return; }
      if (err === "film_missing") { showToast(t.filmMissing, "err"); return; }
      if (err === "not_subscribed") {
        showToast(t.notSubscribed, "err");
        try { if (tg && tg.openTelegramLink) { tg.openTelegramLink("https://t.me/" + BOT); } } catch (e) {}
        return;
      }
      showToast(t.notReadyMsg, "err");
    })["catch"](function () {
      srBusy = false;
      dismissNote(pending);
      showToast(t.notReadyMsg, "err");
    });
  }

  function renderCatalog() {
    var t = T[lang];
    $("cat-kicker").textContent = t.title;
    $("cat-title").textContent = LIB_TITLE[lang];
    $("lang-badge").textContent = flagOf(lang);
    $("back-btn").setAttribute("aria-label", lang.toUpperCase());
    renderHero(t);
    renderSerial();
    srLoad();
    srBlock();
    renderCards(t);
    renderWorldBtn();
  }

  /* Kutubxona tepasidagi tugma. Yo'lni hali boshlamagan odam 9¾ ni emas,
     MUHRLANGAN XATNI ko'radi (asarda ham hammasi xatdan boshlanadi):
       - xatni umuman ochmagan  -> muhr sekin pulsda
       - ochgan, lekin "Keyinroq" bosgan -> xat, pulssiz
       - yo'lga chiqqan yoki saralangan  -> 9¾
     Ko'rish/sinov rejimida ham shu qoida ishlaydi. */
  function letterStage() {
    // Bilet olinmaguncha (yoki saralanmaguncha) kutubxonada 9¾ EMAS, xat turadi:
    // odam hali yo'lda, platformaga chiqishga haqqi yo'q.
    if (hasHouse() || walHas("ticket")) { return "world"; }
    var seen = false;
    try { seen = window.localStorage.getItem(TK("hp_onb_letter")) === "1"; } catch (e) {}
    return seen ? "letter" : "new";
  }

  // Kutubxonadagi taklif kartasi: fakulteti yo'q odamga Xogvarts xati (yo'lga kirish eshigi)
  var HOGC_TX = {
    "new": {
      uz: ["Boyo'g'li pochtasi", "Sizga Xogvartsdan xat keldi", "Ochib o'qing — fakultetingiz sizni kutmoqda"],
      ru: ["Совиная почта", "Вам письмо из Хогвартса", "Откройте — ваш факультет ждёт вас"],
      en: ["Owl Post", "A letter from Hogwarts has arrived", "Open it — your house is waiting"]
    },
    letter: {
      uz: ["Xogvartsga yo'l", "Yo'lingiz davom etmoqda", "Bir necha qadam qoldi — fakultetingizni bilib oling"],
      ru: ["Путь в Хогвартс", "Ваш путь продолжается", "Осталось несколько шагов — узнайте свой факультет"],
      en: ["The road to Hogwarts", "Your journey continues", "A few steps left — find out your house"]
    }
  };

  // Kartani odam yopib qo'ya oladi (x) - shu qurilmada qaytib chiqmaydi; maktub boyo'g'li pochtasida qoladi.
  var HOGC_X = { uz: "Yopish", ru: "Скрыть", en: "Hide" };
  var HOGC_ASK = {
    uz: "Bu kartani yopasizmi?\n\nXogvarts maktubi yo'qolmaydi — uni istalgan payt yuqoridagi 🦉 boyo'g'li pochtasidan topasiz.",
    ru: "Скрыть эту карточку?\n\nПисьмо из Хогвартса не пропадёт — вы всегда найдёте его в 🦉 совиной почте наверху.",
    en: "Hide this card?\n\nYour Hogwarts letter won't be lost — you can always find it in the 🦉 Owl Post at the top."
  };
  function hogcYopiq() {
    try { return window.localStorage.getItem(TK("hp_hogc_off")) === "1"; } catch (e) { return false; }
  }

  // Kamida bitta film olganmi: ilovadagi belgi yoki botdan film ochib to'plangan ball.
  // Hali film olmagan yangi odamga Xogvarts xati ko'rsatilmaydi (avval kutubxona bilan tanishsin).
  function filmOlgan() {
    for (var k in watched) { if (watched[k]) { return true; } }
    try { return (cupMe().points || 0) > 0; } catch (e) { return false; }
  }

  function renderHogCard(stage) {
    var c = $("hogc");
    if (!c) { return; }
    var yoq = stage === "world" || hogcYopiq() || (stage === "new" && !filmOlgan());
    c.classList.toggle("hidden", yoq);
    if (yoq) { return; }
    var t = HOGC_TX[stage][lang] || HOGC_TX[stage].uz;
    $("hogc-k").textContent = t[0];
    $("hogc-t").textContent = t[1];
    $("hogc-seal").textContent = al("seal");
    c.classList.toggle("hogc-new", stage === "new");
    c.onclick = goWorld;
    c.onkeydown = function (ev) { if (ev.key === "Enter" || ev.key === " ") { ev.preventDefault(); goWorld(); } };
    var x = $("hogc-x");
    x.setAttribute("aria-label", HOGC_X[lang] || HOGC_X.uz);
    x.onclick = function (ev) {
      ev.stopPropagation();
      testAsk(HOGC_ASK[lang] || HOGC_ASK.uz, function () {
        try { window.localStorage.setItem(TK("hp_hogc_off"), "1"); } catch (e) {}
        c.classList.add("hidden");
      });
    };
    x.onkeydown = function (ev) { ev.stopPropagation(); };
  }

  function renderWorldBtn() {
    var btn = $("world-btn");
    if (!btn) { return; }
    var stage = letterStage();
    var isLetter = stage !== "world";
    // Yo'ldagi odamda 9¾ tugmasi yo'q: Xogvarts maktubi boyo'g'li pochtasida (js/15-pochta.js owlHog)
    btn.classList.toggle("hidden", isLetter);
    $("coin-934").classList.remove("hidden");
    $("coin-lt").classList.add("hidden");
    btn.classList.remove("yangi");
    btn.setAttribute("aria-label", "9¾");
    renderHogCard(stage);
    try { if (typeof owlBadge === "function") { owlBadge(); } } catch (e) {}
  }

  function openCatalog(code, remember) {
    lang = code;
    applyXT();
    if (remember) { saveLang(code); }
    stopSortTimer();
    $("scr-detail").classList.add("hidden");
    $("scr-lang").classList.add("hidden");
    $("scr-prof").classList.add("hidden");
    $("scr-sort").classList.add("hidden");
    $("scr-reveal").classList.add("hidden");
    $("scr-hat").classList.add("hidden");
    $("scr-think").classList.add("hidden");
    $("scr-hall-full").classList.add("hidden");
    $("scr-feed-full").classList.add("hidden");
    $("scr-tasks").classList.add("hidden");
    $("scr-quiz").classList.add("hidden");
    $("scr-cup").classList.add("hidden");
    $("scr-cat").classList.remove("hidden");
    renderCatalog();
    maybeAutoSort();
    maybeChessLink();
    maybeWorldLink();
    msMaybeOst();
    srMaybeOpen();
  }

  // Bot "Saralanish" tugmasi WebApp'ni ?screen=sort bilan ochadi — shunda
  // katalog o'rniga to'g'ridan-to'g'ri saralash boshlanadi. Bir marta
  // ishlaydi va majburiy emas: saralash ekranidagi "Ortga" katalogga qaytaradi.
  var pendingSort = false;
  var cameForSort = false;      // bot taklifi orqali kelindimi
  try {
    pendingSort = /(^|[?&])screen=sort(&|$)/.test(window.location.search || "");
  } catch (e) { pendingSort = false; }

  function maybeAutoSort() {
    if (!pendingSort) { return; }
    pendingSort = false;
    if (house === "none") {
      cameForSort = true;
      startSorting();
    }
  }

  // Bot orqali saralashga kelgan foydalanuvchi uchun chiqish yo'li.
  // Oddiy holatda "Ortga" til tanlashga qaytaradi, lekin bu yerda til
  // allaqachon tanlangan - o'tkazib yuborgan odam kinolar ro'yxatini
  // ko'rishi kerak (spetsifikatsiya 7-bo'lim).
  function leaveSort() {
    if (!cameForSort) { return false; }
    cameForSort = false;
    openCatalog(lang, false);
    return true;
  }

  /* ---------- PROFIL ---------- */

  function tgUser() {
    try {
      var u = tg && tg.initDataUnsafe && tg.initDataUnsafe.user;
      return u && u.id ? u : null;
    } catch (e) { return null; }
  }

  function fullName(u) {
    var n = (u.first_name || "") + " " + (u.last_name || "");
    return n.trim() || u.username || "";
  }

  function initials(name) {
    var parts = name.split(/\s+/).filter(Boolean);
    if (!parts.length) { return "?"; }
    var s = parts[0].charAt(0);
    if (parts.length > 1) { s += parts[1].charAt(0); }
    return s.toUpperCase();
  }

  function countFor(code) {
    var n = 0;
    MOVIES.forEach(function (m) { if (watched[code + ":" + m.id]) { n++; } });
    return n;
  }

  function uniqueWatched() {
    var seen = {};
    MOVIES.forEach(function (m) {
      LANGS.forEach(function (l) {
        if (watched[l.code + ":" + m.id]) { seen[m.id] = true; }
      });
    });
    var n = 0;
    for (var k in seen) { if (seen[k]) { n++; } }
    return n;
  }

  function fillAvatar(el, u, name, big) {
    el.innerHTML = "";
    if (u && u.photo_url) {
      var img = document.createElement("img");
      img.src = u.photo_url;
      img.alt = "";
      img.onerror = function () {
        this.remove();
        el.textContent = initials(name);
      };
      el.appendChild(img);
    } else {
      el.textContent = big ? initials(name) : initials(name);
    }
  }

  function renderProfile() {
    var t = T[lang];
    var u = tgUser();
    var name = u ? fullName(u) : t.guest;

    $("prof-kicker").textContent = t.profKicker;
    $("prof-heading").textContent = t.profTitle;
    $("prof-back-txt").textContent = t.back;
    $("stats-label").textContent = t.stats;
    $("total-label").textContent = t.total;
    var h = HOUSES[house] || HOUSES.none;
    $("house-label").textContent = t.houseLbl;
    $("house-name").textContent = h[lang];
    $("house-note").textContent = house === "none" ? t.houseNote : t.houseSet;
    paintCrest($("house-crest"), house, h.crest);
    if (house === "none") { $("house-crest").classList.remove("filled"); }
    else { $("house-crest").classList.add("filled"); }

    var cta = $("sort-cta");
    var again = $("resort-btn");
    cta.textContent = t.sortCta;
    again.textContent = t.resort;
    if (house === "none") {
      cta.classList.remove("hidden");
      again.classList.add("hidden");
    } else {
      cta.classList.add("hidden");
      // Fakultet UMRBOD: qayta saralanish faqat muhlat ichida ko'rinadi.
      // Server ham rad etadi, bu yerda tugma shunchaki yashiriladi.
      var me = cupMe();
      if (me.can_resort) { again.classList.remove("hidden"); }
      else { again.classList.add("hidden"); }
    }

    $("prof-name").textContent = name;
    $("prof-tag").textContent = u
      ? (u.username ? "@" + u.username : "ID " + u.id)
      : t.noTag;

    fillAvatar($("prof-pic"), u, name, true);

    var rows = $("stat-rows");
    rows.innerHTML = "";
    LANGS.forEach(function (l) {
      var n = countFor(l.code);
      var total = MOVIES.length;

      var row = document.createElement("div");
      row.className = "stat-row";

      var chip = document.createElement("span");
      chip.className = "stat-chip";
      chip.style.background = LANG_GRADS[l.code];
      chip.textContent = l.code.toUpperCase();

      var bar = document.createElement("span");
      bar.className = "stat-bar";
      var fill = document.createElement("span");
      fill.className = "stat-fill";
      fill.style.width = Math.round(n / total * 100) + "%";
      bar.appendChild(fill);

      var num = document.createElement("span");
      num.className = "stat-num" + (n === total ? " full" : "");
      num.textContent = n + "/" + total;

      row.appendChild(chip);
      row.appendChild(bar);
      row.appendChild(num);
      rows.appendChild(row);
    });

    $("total-val").textContent = uniqueWatched() + " / " + MOVIES.length;

    renderWandPanel(t);
    renderChecklist(t);
  }

  function renderWandPanel(t) {
    var panel = $("wand-panel");
    // Tayoqcha faqat fakultet aniqlangach ochiladi
    if (house === "none") { panel.classList.add("hidden"); return; }
    panel.classList.remove("hidden");

    $("wand-label").textContent = t.wandLbl;
    $("wand-cta").textContent = t.wandCta;
    $("wand-again").textContent = t.wandAgain;
    $("wand-more").textContent = t.wandMore;

    var icon = $("wand-icon");

    if (wand) {
      icon.innerHTML = SVG_WAND;
      $("wand-wood").textContent = WOODS[wand.wood][lang];
      $("wand-l1").textContent = CORES[wand.core][lang];
      $("wand-l2").textContent = FLEX[wand.flex].len + " " + t.inch;
      $("wand-l3").textContent = FLEX[wand.flex][lang];
      $("wand-more").classList.remove("hidden");
      $("wand-cta").classList.add("hidden");
      $("wand-again").classList.remove("hidden");
    } else {
      icon.innerHTML = SVG_WAND;
      $("wand-wood").textContent = t.wandNone;
      $("wand-l1").textContent = t.wandNote;
      $("wand-l2").textContent = "";
      $("wand-l3").textContent = "";
      $("wand-more").classList.add("hidden");
      $("wand-cta").classList.remove("hidden");
      $("wand-again").classList.add("hidden");
    }
  }

  /* ---------- CHECKLIST ---------- */

  function renderChecklist(t) {
    var box = $("checklist");
    box.innerHTML = "";

    var items = [
      { label: t.ckHouse,    state: house !== "none" ? "done" : "todo" },
      { label: t.ckWand,     state: wand ? "done" : (house !== "none" ? "todo" : "soon") },
      { label: t.ckPatronus, state: "soon" }
    ];

    items.forEach(function (it) {
      var el = document.createElement("span");
      el.className = "ck-item " + it.state;
      var dot = document.createElement("span");
      dot.className = "ck-dot";
      dot.textContent = "\u2713";
      var tx = document.createElement("span");
      tx.textContent = it.label;
      el.appendChild(dot);
      el.appendChild(tx);
      box.appendChild(el);
    });
  }

  /* ---------- TAYOQCHA: BATAFSIL ---------- */

  function openWandDetail() {
    if (!wand) { return; }
    var t = T[lang];
    var wd = WOODS[wand.wood], cr = CORES[wand.core], fl = FLEX[wand.flex];

    $("det-kicker").textContent = t.detKicker;
    $("det-back-txt").textContent = t.back;

    $("det-art").innerHTML = SVG_WAND;
    $("det-title").textContent = wd[lang];
    $("det-spec").textContent = cr[lang] + " \u00b7 " + fl.len + " " + t.inch + " \u00b7 " + fl[lang];

    var key = wand.wood + "_" + wand.core;
    var fam = FAMOUS[key];
    if (fam) {
      $("det-famous-icon").innerHTML = SVG_WAND;
      $("det-famous-lbl").textContent = t.famousLbl;
      $("det-famous-who").textContent = fam[lang];
      $("det-famous").classList.remove("hidden");
    } else {
      $("det-famous").classList.add("hidden");
    }

    $("det-h-wood").textContent = t.hWood;
    $("det-wood").textContent = WOOD_LORE[wand.wood][lang];
    $("det-h-core").textContent = t.hCore;
    $("det-core").textContent = CORE_LORE[wand.core][lang];

    $("det-h-rare").textContent = t.hRare;
    $("det-rk1").textContent = t.rareCore;
    $("det-rv1").textContent = RARITY_CORE[wand.core] + "%";
    $("det-rk2").textContent = t.rarePair;
    $("det-rv2").textContent = RARITY_PAIR[wand.core] + "%";

    hideSortScreens();
    $("scr-prof").classList.add("hidden");
    $("scr-detail").classList.remove("hidden");
  }

  function closeWandDetail() {
    $("scr-detail").classList.add("hidden");
    openProfile();
  }
