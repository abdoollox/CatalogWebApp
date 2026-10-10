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

  /* ---------- PROFIL MENYUSI (egasi, 2026-10-04) ----------
     O'ng tepadagi tugma: fakultet gerbi + galleon soni. Bosilsa pastdan menyu:
     hamyon, profil (fakultet va tayoqcha), til, bot xabarlari. Til bayrog'i tugmasi
     shu menyuga ko'chdi (#back-btn yashirin qoldi - eski kod unga tayanadi). */
  var PM_TX = {
    uz: { guest: "Sehrgar", noHouse: "Hali saralanmagan", gal: function (n) { return n + " galleon"; },
          walS: "Xaridlar: albomlar, kitoblar, yemish. Galleon har hafta kubok ballari uchun beriladi.",
          prof: "Profil", profS: "Fakultet, tayoqcha va nishonlar", lang: "Til",
          sec1: "Sehrgar", sec2: "Sozlamalar", me: "Mening sehrgarim",
          bot: "Bot xabarlari", botS: "Boyo'g'li xatlari Telegram'da ham kelsin", close: "Yopish" },
    ru: { guest: "Волшебник", noHouse: "Ещё не распределён", gal: function (n) { return n + " галлеонов"; },
          walS: "Покупки: альбомы, книги, корм. Галлеоны выдаются каждую неделю за очки Кубка.",
          prof: "Профиль", profS: "Факультет, палочка и значки", lang: "Язык",
          sec1: "Волшебник", sec2: "Настройки", me: "Мой волшебник",
          bot: "Сообщения бота", botS: "Присылать письма совы и в Telegram", close: "Закрыть" },
    en: { guest: "Wizard", noHouse: "Not sorted yet", gal: function (n) { return n + " Galleons"; },
          walS: "Purchases: albums, books, food. Galleons are paid each week for your Cup points.",
          prof: "Profile", profS: "House, wand and badges", lang: "Language",
          sec1: "Wizard", sec2: "Settings", me: "My wizard",
          bot: "Bot messages", botS: "Also send owl letters in Telegram", close: "Close" }
  };
  // Profil belgisi: Phosphor "user-bold" (MIT) - egasi tanladi (2026-10-04, 55-variant), hoshiyali tugma ichida.
  // Gerb menyu ichida qoladi.
  var PM_ICON = '<svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path fill="currentColor" d="M234.38 210a123.36 123.36 0 0 0-60.78-53.23a76 76 0 1 0-91.2 0A123.36 123.36 0 0 0 21.62 210a12 12 0 1 0 20.77 12c18.12-31.32 50.12-50 85.61-50s67.49 18.69 85.61 50a12 12 0 0 0 20.77-12M76 96a52 52 0 1 1 52 52a52.06 52.06 0 0 1-52-52"/></svg>';

  function pmGal() {
    try { if (wal) { return wal.galleons || 0; } } catch (e) {}
    try { return msGal || 0; } catch (e) {}
    return 0;
  }

  function pmAvatar(el, belgi) {
    var h = validHouse(cupMe().house || house);
    el.innerHTML = "";
    if (!belgi && h && HOUSES[h] && HOUSES[h].img) {
      var im = document.createElement("img");
      im.alt = "";
      im.src = IMG_DIR + HOUSES[h].img;
      el.appendChild(im);
    } else { el.innerHTML = PM_ICON; }
  }

  // Tepadagi tugma: gerb va (bo'lsa) galleon soni
  function pmRender() {
    var b = $("pm-btn");
    if (!b) { return; }
    var n = pmGal();
    // Ikki joyda bir xil tugma: kutubxona tepasida va Xogvarts sahifasida
    [["pm-btn", "pm-av", "pm-gal", "pm-gal-n"], ["pm-btn2", "pm-av3", "pm-gal2", "pm-gal2-n"]].forEach(function (x) {
      var el = $(x[0]);
      if (!el) { return; }
      pmAvatar($(x[1]), true);
      $(x[2]).classList.toggle("hidden", !n);
      $(x[3]).textContent = n;
      if (!el.onclick) { el.onclick = pmOpen; }
    });
    if (!$("pm").classList.contains("hidden")) { pmFill(); }
  }

  function pmFill() {
    var x = PM_TX[lang] || PM_TX.uz;
    var u = tgUser(), h = validHouse(cupMe().house || house);
    pmAvatar($("pm-av2"));
    $("pm-title").textContent = x.prof;
    $("pm-name").textContent = (u && (u.first_name || fullName(u))) || x.guest;
    $("pm-house").textContent = h ? HOUSES[h][lang] : x.noHouse;
    $("pm-wal-n").textContent = x.gal(pmGal());
    $("pm-wal-s").textContent = x.walS;
    $("pm-sec2").textContent = x.sec2;
    // Fakultet va tayoqcha panellari (ilgari "Sehrgar" sahifasida edi)
    try { renderProfile(); } catch (e) {}
    try { patPaint(); patLoad(); } catch (e) {}
    try { sqLoad(); qbRow(); } catch (e) {}
    $("pm-lang-l").textContent = x.lang;
    $("pm-bot-t").textContent = x.bot;
    $("pm-bot-s").textContent = x.botS;
    var box = $("pm-langs");
    box.innerHTML = "";
    ["uz", "ru", "en"].forEach(function (code) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = code === lang ? "on" : "";
      b.textContent = flagOf(code) + " " + code.toUpperCase();
      b.onclick = function () {
        if (code === lang) { return; }
        openCatalog(code, true);          // tilni saqlaydi va hamma matnni yangilaydi
        pmShow();                         // ... lekin odam shu sahifada qoladi
      };
      box.appendChild(b);
    });
    try { $("pm-bot").checked = !owlData || owlData.bot; } catch (e) { $("pm-bot").checked = true; }
    // "Ilova ochilganda" tanlovi va (admin uchun) sinov o'quvchisi
    try { renderHubSettings(); } catch (e) {}
    nshRender();
    // Xogvartsga hali kirmagan (saralanmagan) odamga faqat til va bot xabarlari ko'rinadi (egasi, 2026-10-04):
    // hamyon, nishonlar, fakultet va "Ilova ochilganda" fakultetga tushgach ochiladi.
    var ichkarida = false;
    try { ichkarida = hasHouse(); } catch (e) {}
    $("pm-wal").classList.toggle("hidden", !ichkarida);
    $("house-label").parentNode.classList.toggle("hidden", !ichkarida);
    $("hub-set-title").parentNode.classList.toggle("hidden", !ichkarida);
    if (!ichkarida) { $("nsh-sec").classList.add("hidden"); $("qb-row").classList.add("hidden"); }
  }

  /* Profil ALOHIDA SAHIFA (egasi, 2026-10-04: modal emas). Qayerdan ochilgani eslab qolinadi -
     "ortga" o'sha yerga qaytaradi (kutubxona yoki Xogvarts). */
  var pmFrom = "cat";

  function pmShow() {
    ["scr-cat", "scr-hub", "scr-prof", "scr-detail", "scr-nsh"].forEach(function (id) { $(id).classList.add("hidden"); });
    pmFill();
    try { pmDarsRows(); } catch (e) {}
    try { puRender(); } catch (e) {}
    try { pu2Render(); } catch (e) {}
    try { $("pm-kick").textContent = $("pm-name").textContent; } catch (e) {}      // ism - sarlavha tepasida (alohida qator olib tashlandi)
    $("pm").classList.remove("hidden");
  }

  function pmOpen() {
    var el = $("pm");
    // Tayoqcha tafsiloti yoki saralashdan qaytganda (ikkalasi ham yashirin) eski qiymat saqlanadi
    if (!$("scr-hub").classList.contains("hidden")) { pmFrom = "hub"; }
    else if (!$("scr-cat").classList.contains("hidden")) { pmFrom = "cat"; }
    if (!el.getAttribute("data-on")) {
      el.setAttribute("data-on", "1");
      $("pm-close").onclick = pmClose;
      $("hub-set-pv").addEventListener("click", pmHide);     // sinov o'quvchisi boshlanganda sahifa yopilsin
      $("pm-wal").onclick = function () { pmHide(); try { openCup(); } catch (e) {} };
      $("pm-bot").addEventListener("change", function () {
        try { owlApi("bot", { on: $("pm-bot").checked }); } catch (e) {}
      });
    }
    pmShow();
    try { window.scrollTo(0, 0); } catch (e) {}
    // Qoldiq eskirgan bo'lishi mumkin (hafta yakunidagi mukofot) - yangilab olamiz
    try { walLoad(function () { pmRender(); }); } catch (e) {}
    nshLoad(true);
  }

  function pmHide() { $("pm").classList.add("hidden"); }

  // "Ortga": qayerdan ochilgan bo'lsa o'sha yerga
  function pmClose() {
    pmHide();
    if (pmFrom === "hub") { try { openHub(); return; } catch (e) {} }
    $("scr-cat").classList.remove("hidden");
    renderCatalog();
    try { window.scrollTo(0, 0); } catch (e) {}
  }

  /* ---------- NISHONLAR (egasi, 2026-10-04) ----------
     Profil sahifasidagi yutuqlar. Hisob serverda (hpnishon.py): bazadagi izlardan, eski
     foydalanuvchilar ham oladi. Rasmlar img/nishon/<kod>.webp (dizayn tizimi uslubida).
     Boshqa odamning nishonlari chatdan ochiladi (nshPeer). Galleon berilmaydi. */
  var API_NISHON = "https://bot.tizimshunos.uz/api/nishon";
  var NSH_ORDER = ["film_1", "film_8", "fb_3", "poliglot", "oquvchi", "tayoqcha", "patronus", "ball_1", "streak_7",
                   "perfect_week", "kubok_golib", "top_3", "sandiq_1", "sandiq_7", "dost_1", "dost_5", "shaxmat", "albom", "serial_1",
                   "maxluq_1", "maxluq_katta", "maxluq_12", "issiq_1", "issiq_yetilgan", "issiq_hosil", "issiq_12", "kitob_1", "kitob_7"];
  var NSH_TX = {
    uz: { sec: "Nishonlar", got: "Olingan", lock: "Hali olinmagan", close: "Yopish", fresh: "Yangi nishon",
          freshN: function (n) { return n + " ta yangi nishon"; }, freshP: "Hammasi profilingizda turadi.",
          prog: function (a, b) { return a + " / " + b; }, of: "Nishonlari", none: "Hali nishon yo'q",
          peer: "Nishonlarini ko'rish",
          n: { film_1: ["Birinchi seans", "Kutubxonadan birinchi filmni oling"],
               film_8: ["To'liq kolleksiya", "Garri Potterning 8 ta filmini ham oling"],
               fb_3: ["Sehrli maxluqlar", "«Fantastik maxluqlar»ning 3 ta filmini oling"],
               poliglot: ["Uch tilli sehrgar", "Filmlarni uch tilda oling: o'zbek, rus va ingliz"],
               oquvchi: ["Xogvarts o'quvchisi", "Saralovchi qalpoq fakultetingizni aytsin"],
               tayoqcha: ["Tayoqcha egasi", "Olivander do'konidan tayoqcha oling"],
               patronus: ["Patronus egasi", "Professor Lyupin darsida Patronusingizni chaqiring"],
               ball_1: ["Birinchi ball", "Fakultetingizga birinchi ballni keltiring"],
               sandiq_1: ["Birinchi qurbaqa", "Shokolad qurbaqa qutisini bir marta oching"],
               sandiq_7: ["Yetti qurbaqa", "Qutini 7 kun ketma-ket oching"],
               streak_7: ["Yetti sham", "Bir haftaning 7 kunida ham ball to'plang"],
               perfect_week: ["Bexato hafta", "Haftaning hamma kunlik savoliga to'g'ri javob bering"],
               kubok_golib: ["Kubok g'olibi", "Fakultetingiz haftalik kubokni yutsin, siz ham ball qo'shgan bo'ling"],
               top_3: ["Eng yaxshi uchlik", "Hafta yakunida eng ko'p ball to'plagan 3 o'quvchidan biri bo'ling"],
               dost_1: ["Birinchi do'st", "Taklifingiz bilan 1 do'st qo'shilsin"],
               dost_5: ["Do'stlar davrasi", "Taklifingiz bilan 5 do'st qo'shilsin"],
               shaxmat: ["Sehrgarlar shaxmati", "Shaxmatda bir o'quvchini yuting"],
               albom: ["Musiqa ixlosmandi", "Galleonga bitta albom oching"],
               serial_1: ["Birinchi qism", "Serialning bitta qismini oling"],
               maxluq_1: ["Birinchi maxluq", "Qo'riqxonangizga birinchi maxluqni oling"], maxluq_katta: ["Katta maxluq", "Bitta maxluqni boqib, katta qilib o'stiring"],
               maxluq_12: ["To'liq qo'riqxona", "O'n ikki maxluqning hammasini yig'ing"],
               issiq_1: ["Birinchi urug'", "Issiqxonangizga birinchi o'simlikni oling"], issiq_yetilgan: ["Yetilgan o'simlik", "Bitta o'simlikni sug'orib, to'liq yetishtiring"],
               issiq_hosil: ["Birinchi hosil", "Yetilgan o'simlikdan birinchi hosilni oling"], issiq_12: ["To'liq issiqxona", "O'n ikki o'simlikning hammasini yig'ing"],
               kitob_1: ["Birinchi kitob", "Ilovada birinchi kitobni oching"], kitob_7: ["Yetti kitob", "Yettala kitobning hammasini oching"] } },
    ru: { sec: "Значки", got: "Получен", lock: "Ещё не получен", close: "Закрыть", fresh: "Новый значок",
          freshN: function (n) { return "Новых значков: " + n; }, freshP: "Все они хранятся в вашем профиле.",
          prog: function (a, b) { return a + " / " + b; }, of: "Значки", none: "Значков пока нет",
          peer: "Посмотреть значки",
          n: { film_1: ["Первый сеанс", "Получите первый фильм из библиотеки"],
               film_8: ["Полная коллекция", "Получите все 8 фильмов о Гарри Поттере"],
               fb_3: ["Волшебные существа", "Получите 3 фильма «Фантастические твари»"],
               poliglot: ["Волшебник на трёх языках", "Получите фильмы на трёх языках: узбекском, русском и английском"],
               oquvchi: ["Ученик Хогвартса", "Пусть Распределяющая шляпа назовёт ваш факультет"],
               tayoqcha: ["Владелец палочки", "Получите палочку в лавке Олливандера"],
               patronus: ["Обладатель Патронуса", "Вызовите своего Патронуса на уроке профессора Люпина"],
               ball_1: ["Первое очко", "Принесите факультету первые очки"],
               sandiq_1: ["Первая лягушка", "Откройте коробку с шоколадной лягушкой один раз"],
               sandiq_7: ["Семь лягушек", "Открывайте коробку 7 дней подряд"],
               streak_7: ["Семь свечей", "Набирайте очки все 7 дней одной недели"],
               perfect_week: ["Неделя без ошибок", "Ответьте верно на все вопросы дня за неделю"],
               kubok_golib: ["Обладатель Кубка", "Ваш факультет выиграл Кубок недели, и вы принесли очки"],
               top_3: ["Лучшая тройка", "Войдите в тройку учеников с наибольшим числом очков за неделю"],
               dost_1: ["Первый друг", "По вашему приглашению пришёл 1 друг"],
               dost_5: ["Круг друзей", "По вашему приглашению пришли 5 друзей"],
               shaxmat: ["Волшебные шахматы", "Победите ученика в шахматах"],
               albom: ["Ценитель музыки", "Откройте один альбом за галлеоны"],
               serial_1: ["Первая серия", "Получите одну серию сериала"],
               maxluq_1: ["Первое существо", "Получите первое существо в питомник"], maxluq_katta: ["Взрослое существо", "Вырастите одно существо до взрослого"],
               maxluq_12: ["Полный питомник", "Соберите всех двенадцать существ"],
               issiq_1: ["Первое семя", "Получите первое растение в теплицу"], issiq_yetilgan: ["Зрелое растение", "Поливайте одно растение, пока оно не созреет"],
               issiq_hosil: ["Первый урожай", "Соберите первый урожай со зрелого растения"], issiq_12: ["Полная теплица", "Соберите все двенадцать растений"],
               kitob_1: ["Первая книга", "Откройте первую книгу в приложении"], kitob_7: ["Семь книг", "Откройте все семь книг"] } },
    en: { sec: "Badges", got: "Earned", lock: "Not earned yet", close: "Close", fresh: "New badge",
          freshN: function (n) { return n + " new badges"; }, freshP: "They are all kept in your profile.",
          prog: function (a, b) { return a + " / " + b; }, of: "Badges", none: "No badges yet",
          peer: "View badges",
          n: { film_1: ["First Screening", "Get your first film from the library"],
               film_8: ["Full Collection", "Get all 8 Harry Potter films"],
               fb_3: ["Magical Creatures", "Get all 3 Fantastic Beasts films"],
               poliglot: ["Three-Language Wizard", "Get films in three languages: Uzbek, Russian and English"],
               oquvchi: ["Hogwarts Student", "Let the Sorting Hat name your house"],
               tayoqcha: ["Wand Owner", "Get a wand at Ollivander's"],
               patronus: ["Patronus Caster", "Summon your Patronus in Professor Lupin's lesson"],
               ball_1: ["First Point", "Earn your first points for your house"],
               sandiq_1: ["First Frog", "Open a Chocolate Frog box once"],
               sandiq_7: ["Seven Frogs", "Open the box 7 days in a row"],
               streak_7: ["Seven Candles", "Earn points on all 7 days of one week"],
               perfect_week: ["Flawless Week", "Answer every daily question of a week correctly"],
               kubok_golib: ["Cup Winner", "Your house wins the weekly Cup and you earned points for it"],
               top_3: ["Top Three", "Be one of the 3 students with the most points in a week"],
               dost_1: ["First Friend", "1 friend joins by your invitation"],
               dost_5: ["Circle of Friends", "5 friends join by your invitation"],
               shaxmat: ["Wizard's Chess", "Beat a student at chess"],
               albom: ["Music Lover", "Unlock one album with Galleons"],
               serial_1: ["First Episode", "Get one episode of the series"],
               maxluq_1: ["First Creature", "Get your first creature for the menagerie"], maxluq_katta: ["Grown Creature", "Feed one creature until it is fully grown"],
               maxluq_12: ["Full Menagerie", "Collect all twelve creatures"],
               issiq_1: ["First Seed", "Get your first plant for the greenhouse"], issiq_yetilgan: ["Mature Plant", "Water one plant until it is fully grown"],
               issiq_hosil: ["First Harvest", "Gather the first harvest from a mature plant"], issiq_12: ["Full Greenhouse", "Collect all twelve plants"],
               kitob_1: ["First Book", "Open your first book in the app"], kitob_7: ["Seven Books", "Open all seven books"] } }
  };
  // Toifalar (egasi: nishonlar ko'payadi, guruhlarga bo'linsin). Yangi nishon -> shu ro'yxatga.
  var NSH_GROUPS = [
    ["kino", ["film_1", "film_8", "fb_3", "poliglot", "serial_1"], { uz: "Kino", ru: "Кино", en: "Films" }],
    ["xogvarts", ["oquvchi", "tayoqcha", "patronus"], { uz: "Xogvarts yo'li", ru: "Путь в Хогвартс", en: "Road to Hogwarts" }],
    ["kubok", ["ball_1", "sandiq_1", "sandiq_7", "streak_7", "perfect_week", "kubok_golib", "top_3"], { uz: "Fakultetlar kubogi", ru: "Кубок школы", en: "House Cup" }],
    ["shaxmat", ["shaxmat"], { uz: "Shaxmat", ru: "Шахматы", en: "Chess" }],
    ["musiqa", ["albom"], { uz: "Musiqa", ru: "Музыка", en: "Music" }],
    ["dostlik", ["dost_1", "dost_5"], { uz: "Do'stlik", ru: "Дружба", en: "Friendship" }],
    ["maxluq", ["maxluq_1", "maxluq_katta", "maxluq_12"], { uz: "Qo'riqxona", ru: "Питомник", en: "Menagerie" }],
    ["issiq", ["issiq_1", "issiq_yetilgan", "issiq_hosil", "issiq_12"], { uz: "Issiqxona", ru: "Теплица", en: "Greenhouse" }],
    ["kitob", ["kitob_1", "kitob_7"], { uz: "Kitoblar", ru: "Книги", en: "Books" }]
  ];
  var NSH_SUM = { uz: "nishon olingan", ru: "значков получено", en: "badges earned" };
  var nshData = null, nshAsked = false, nshSampleSeen = false;

  function nshX() { return NSH_TX[lang] || NSH_TX.uz; }
  function nshImg(code) { return IMG_DIR + "nishon/" + code + ".webp"; }
  function nshLocal() { return /^(localhost|127\.0\.0\.1)$/.test(window.location.hostname); }

  // Mahalliy ko'rikda server yo'q - namuna ro'yxat (faqat localhost)
  function nshSample() {
    var bor = { film_1: 1, film_8: 1, oquvchi: 1, tayoqcha: 1, ball_1: 1, dost_1: 1 };
    if (patronus) { bor.patronus = 1; }
    var yol = { fb_3: [1, 3], poliglot: [2, 3], streak_7: [3, 7], dost_5: [2, 5] };
    var yangi = nshSampleSeen ? [] : ["tayoqcha", "ball_1"];
    nshSampleSeen = true;
    return { ok: true, total: NSH_ORDER.length, "new": yangi, list: NSH_ORDER.map(function (c) {
      return { code: c, got: !!bor[c], at: bor[c] ? "2026-10-04T10:00:00Z" : null,
               have: bor[c] ? 1 : (yol[c] ? yol[c][0] : 0), need: yol[c] ? yol[c][1] : 1 };
    }) };
  }

  function nshPost(body, done) {
    if (!window.fetch) { return; }
    window.fetch(API_NISHON, { method: "POST", headers: { "Content-Type": "application/json", "X-Telegram-Init-Data": srInit() },
                               body: JSON.stringify(body || {}) })
      .then(function (r) { return r.json(); })
      .then(function (res) { if (res && res.ok) { done(res); } else if (nshLocal()) { done(nshSample()); } })
      ["catch"](function () { if (nshLocal()) { done(nshSample()); } });
  }

  function nshLoad(force) {
    if (nshAsked && !force) { return; }
    nshAsked = true;
    nshPost({}, function (res) {
      nshData = res;
      nshRender();
      nshFresh();
    });
  }

  // Profildagi qator (nechta olingan + oxirgilari) va nishonlar sahifasi (toifalar bo'yicha)
  function nshRender() {
    var go = $("nsh-sec"), box = $("nsh-grid");
    if (!go || !box) { return; }
    var x = nshX(), lst = (nshData && nshData.list) || [], by = {};
    lst.forEach(function (b) { by[b.code] = b; });
    var olingan = lst.filter(function (b) { return b.got; });
    go.classList.toggle("hidden", !lst.length);
    go.onclick = nshOpen;
    $("nsh-lbl").textContent = x.sec;
    $("nsh-cnt").textContent = olingan.length + " / " + lst.length;
    var mini = $("nsh-mini");
    mini.innerHTML = "";
    olingan.slice().sort(function (a, c) { return String(c.at).localeCompare(String(a.at)); }).slice(0, 4).forEach(function (b) {
      var im = document.createElement("img");
      im.alt = ""; im.src = nshImg(b.code);
      mini.appendChild(im);
    });

    $("nsh-title").textContent = x.sec;
    $("nsh-sum-n").textContent = olingan.length + " / " + lst.length;
    $("nsh-sum-s").textContent = NSH_SUM[lang] || NSH_SUM.uz;
    $("nsh-bar").style.width = (lst.length ? Math.round(olingan.length * 100 / lst.length) : 0) + "%";
    box.innerHTML = "";
    var korildi = {};
    function guruh(nom, kodlar) {
      var bs = kodlar.map(function (c) { return by[c]; }).filter(function (b) { return b && x.n[b.code]; });
      if (!bs.length) { return; }
      var lb = document.createElement("span");
      lb.className = "pm-lbl";
      lb.textContent = nom + " · " + bs.filter(function (b) { return b.got; }).length + " / " + bs.length;
      var g = document.createElement("div");
      g.className = "nsh-grid";
      bs.forEach(function (b) {
        korildi[b.code] = 1;
        var t = x.n[b.code];
        var el = document.createElement("button");
        el.type = "button";
        el.className = "nsh-it" + (b.got ? "" : " off");
        var im = document.createElement("img");
        im.alt = ""; im.src = nshImg(b.code);
        var nm = document.createElement("span");
        nm.textContent = t[0];
        el.appendChild(im);
        el.appendChild(nm);
        if (!b.got && b.need > 1) {
          var pr = document.createElement("i");
          pr.textContent = x.prog(b.have, b.need);
          el.appendChild(pr);
        }
        el.onclick = function () { nshOne(b); };
        g.appendChild(el);
      });
      box.appendChild(lb);
      box.appendChild(g);
    }
    NSH_GROUPS.forEach(function (gr) { guruh(gr[2][lang] || gr[2].uz, gr[1]); });
  }

  function nshOpen() {
    $("pm").classList.add("hidden");
    nshRender();
    $("scr-nsh").classList.remove("hidden");
    $("nsh-back").onclick = function () { $("scr-nsh").classList.add("hidden"); pmShow(); try { window.scrollTo(0, 0); } catch (e) {} };
    try { window.scrollTo(0, 0); } catch (e) {}
  }

  function nshDate(iso) {
    var d = new Date(iso);
    if (isNaN(d.getTime())) { return ""; }
    return ("0" + d.getDate()).slice(-2) + "." + ("0" + (d.getMonth() + 1)).slice(-2) + "." + d.getFullYear();
  }

  // Oyna: bitta nishon, bir nechta yangi nishon yoki boshqa odamning nishonlari
  function nshBox(o) {
    var box = $("nsh");
    if (!box) { return; }
    $("nsh-kick").textContent = o.kick || "";
    $("nsh-kick").classList.toggle("hidden", !o.kick);
    $("nsh-t").textContent = o.title || "";
    $("nsh-p").textContent = o.text || "";
    $("nsh-p").classList.toggle("hidden", !o.text);
    var row = $("nsh-row");
    row.innerHTML = "";
    row.className = "nsh-row" + (o.codes.length > 1 ? " many" : "") + (o.off ? " off" : "");
    if (o.icon) { row.className = "nsh-row nsh-ic"; row.innerHTML = o.icon; }
    if (o.card) { row.className = "nsh-row nsh-card"; }
    if (o.crest) { row.className = "nsh-row nsh-crest"; }        // fakultet gerbi: doiraga kesilmaydi          // sehrgar kartochkasi: doira emas, karta shaklida
    o.codes.forEach(function (c) {
      var im = document.createElement("img");
      im.alt = ""; im.src = o.srcs ? o.srcs[row.children.length] : nshImg(c);
      if (o.names) {
        var w = document.createElement("span"), s = document.createElement("small");
        s.textContent = (nshX().n[c] || [""])[0];
        w.appendChild(im); w.appendChild(s);
        row.appendChild(w);
      } else { row.appendChild(im); }
    });
    $("nsh-ok").textContent = o.ok || nshX().close;
    function yop() { box.classList.add("hidden"); if (o.done) { o.done(); } }
    // Ikkinchi tugma (masalan "Batafsil"): oyna yopiladi va o'sha joyga o'tiladi
    var more = $("nsh-more");
    more.classList.toggle("hidden", !o.more);
    if (o.more) { more.textContent = o.more.label; more.onclick = function () { box.classList.add("hidden"); o.more.fn(); }; }
    var more2 = $("nsh-more2");                  // uchinchi tugma (profil kataklari: «Ulashish»)
    if (more2) {
      more2.classList.toggle("hidden", !o.more2);
      if (o.more2) { more2.textContent = o.more2.label; more2.onclick = function () { box.classList.add("hidden"); o.more2.fn(); }; }
    }
    $("nsh-ok").onclick = yop;
    // o.x: katta «Yopish» tugmasi o'rnida burchakda kichik × (profil kataklari - egasi, 2026-10-09)
    $("nsh-ok").classList.toggle("hidden", !!o.x);
    var xb = $("nsh-x");
    if (xb) { xb.classList.toggle("hidden", !o.x); xb.onclick = yop; }
    box.onclick = function (ev) { if (ev.target === box) { yop(); } };
    box.classList.remove("hidden");
  }

  function nshOne(b) {
    var x = nshX(), t = x.n[b.code];
    nshBox({ codes: [b.code], off: !b.got, title: t[0], text: t[1],
             kick: b.got ? x.got + (b.at ? " · " + nshDate(b.at) : "") : x.lock + (b.need > 1 ? " · " + x.prog(b.have, b.need) : "") });
  }

  // Yangi nishonlar tabrigi: faqat kutubxona, Xogvarts yoki profil ochiq turganda
  function nshFresh() {
    var yangi = (nshData && nshData["new"]) || [];
    if (!yangi.length || !$("nsh") || !$("nsh").classList.contains("hidden")) { return; }
    // Saralanmagan odamga nishonlar hali ko'rinmaydi - tabrik fakultetga tushgach chiqadi
    try { if (!hasHouse()) { return; } } catch (e) { return; }
    var ochiq = ["scr-cat", "scr-hub", "pm", "scr-nsh"].some(function (id) { return $(id) && !$(id).classList.contains("hidden"); });
    if (!ochiq || ($("hpask") && !$("hpask").classList.contains("hidden"))) { return; }
    var x = nshX(), bitta = yangi.length === 1, t = x.n[yangi[0]] || ["", ""];
    nshData["new"] = [];
    nshBox({ codes: yangi, names: !bitta, kick: x.fresh,
             title: bitta ? t[0] : x.freshN(yangi.length), text: bitta ? t[1] : x.freshP,
             done: function () { nshPost({ seen: true }, function () {}); } });
    try { if (tg && tg.HapticFeedback) { tg.HapticFeedback.notificationOccurred("success"); } } catch (e) {}
  }

  // Boshqa odamning nishonlari (chatdan)
  function nshPeer(uid, name) {
    var x = nshX();
    nshPost({ uid: uid }, function (res) {
      var codes = (res.list || []).filter(function (b) { return b.got; }).map(function (b) { return b.code; });
      nshBox({ codes: codes, names: true, kick: x.of + (codes.length ? " · " + codes.length + " / " + (res.total || NSH_ORDER.length) : ""),
               title: name || "", text: codes.length ? "" : x.none });
    });
  }

  /* ---------- SHOKOLAD QURBAQA: kunlik topshiriqlar va sehrgarlar kartochkalari (egasi, 2026-10-05) ----------
     Har kuni 6 ta topshiriq (server tanlaydi, hammaga bir xil). HAMMASI bajarilganda odam qutini o'zi ochadi:
     +10 ball, 1 galleon va SHU KUNNING sehrgar kartochkasi (kolleksiyaga). Oraliq mukofot yo'q.
     7 kun ketma-ket - qo'shimcha +3 galleon. Hisob serverda (hpsandiq.py, /api/sandiq). Faqat saralanganlarga.
     Kodda nomlar "sq"/"sandiq" bo'lib qolgan (birinchi nusxa sandiq edi).
     Topshiriq bajarilganini aytish: sqDone("chat") - kerakli joylarga ilgak qilib qo'yilgan. */
  var API_SANDIQ = "https://bot.tizimshunos.uz/api/sandiq";
  // Olov belgisi: MDI "fire" (Apache 2.0) - ketma-ketlik
  var SQ_FIRE = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.66 11.2c-.23-.3-.51-.56-.77-.82c-.67-.6-1.43-1.03-2.07-1.66C13.33 7.26 13 4.85 13.95 3c-.95.23-1.78.75-2.49 1.32c-2.59 2.08-3.61 5.75-2.39 8.9c.04.1.08.2.08.33c0 .22-.15.42-.35.5c-.23.1-.47.04-.66-.12a.6.6 0 0 1-.14-.17c-1.13-1.43-1.31-3.48-.55-5.12C5.78 10 4.87 12.3 5 14.47c.06.5.12 1 .29 1.5c.14.6.41 1.2.71 1.73c1.08 1.73 2.95 2.97 4.96 3.22c2.14.27 4.43-.12 6.07-1.6c1.83-1.66 2.47-4.32 1.53-6.6l-.13-.26c-.21-.46-.77-1.26-.77-1.26m-3.16 6.3c-.28.24-.74.5-1.1.6c-1.12.4-2.24-.16-2.9-.82c1.19-.28 1.9-1.16 2.11-2.05c.17-.8-.15-1.46-.28-2.23c-.12-.74-.1-1.37.17-2.06c.19.38.39.76.63 1.06c.77 1 1.98 1.44 2.24 2.8c.04.14.06.28.06.43c.03.82-.33 1.72-.93 2.27"/></svg>';
  var SQ_CHECK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7"/></svg>';

  // Kartochkalar: asardagi "Mashhur sehrgarlar" to'plamidan 24 tasi. [ism, bir qatorlik ta'rif]
  var QB_ORDER = ["dumbledore", "merlin", "morgana", "flamel", "gryffindor", "slytherin", "ravenclaw", "hufflepuff",
                  "circe", "paracelsus", "agrippa", "ptolemy", "cliodna", "hengist", "grunnion", "scamander",
                  "bott", "wright", "gregory", "uric", "gwenog", "wildsmith", "whitehorn", "potter"];
  var QB = {
    uz: { dumbledore: ["Albus Dambldor", "Xogvarts direktori. Zamonamizning eng buyuk sehrgari, feniks patining egasi."],
          merlin: ["Merlin", "Barcha zamonlarning eng mashhur sehrgari. Qirol Artur saroyida xizmat qilgan."],
          morgana: ["Morgana", "Qirol Arturning o'gay singlisi, qudratli sehrgar ayol va Merlinning raqibi."],
          flamel: ["Nikolas Flamel", "Hikmatlar toshini yaratgan yagona alkimyogar. 665 yil yashagan."],
          gryffindor: ["Godrik Grifindor", "Xogvartsning to'rt asoschisidan biri. Jasorati va qilichi bilan mashhur."],
          slytherin: ["Salazar Sliterin", "Xogvarts asoschisi. Ilonlar tilida gapira olgan va Sirlar xonasini qurgan."],
          ravenclaw: ["Rovena Reyvenklo", "Xogvarts asoschisi. O'z davrining eng aqlli sehrgar ayoli, diademasi mashhur."],
          hufflepuff: ["Xelga Xaffelpaff", "Xogvarts asoschisi. Mehribonligi va oshxona afsunlari bilan tanilgan."],
          circe: ["Sirseya", "Qadimgi yunon sehrgar ayoli. Adashgan dengizchilarni cho'chqaga aylantirgan."],
          paracelsus: ["Paratsels", "Alkimyogar va tabib. Sehrgarlar tibbiyotining asoschilaridan biri."],
          agrippa: ["Agrippa", "Mashhur sehrgar-olim. Sehr haqidagi kitoblari uchun magllar uni qamoqqa tashlagan."],
          ptolemy: ["Ptolemey", "Qadimgi astronom sehrgar. Eng noyob kartochkalardan biri — Ron uni uzoq qidirgan."],
          cliodna: ["Kliodna", "Irland druid ayoli. Uchta sehrli qushining qo'shig'i kasallarni davolagan."],
          hengist: ["Vudkroftlik Xengist", "Xogsmid qishlog'iga asos solgan. Magllar ta'qibidan qochib kelgan."],
          grunnion: ["Alberik Grannion", "Tezak bombasini ixtiro qilgan. Xogvarts hazilkashlari undan minnatdor."],
          scamander: ["Nyut Skamander", "Sehrli maxluqlar bilimdoni. «Fantastik maxluqlar va ularning makoni» muallifi."],
          bott: ["Berti Bott", "Har xil ta'mli konfetlarni tasodifan — iflos paypoq tufayli ixtiro qilgan."],
          wright: ["Bouman Rayt", "Temirchi sehrgar. Kviddich uchun Oltin snitchni yasagan."],
          gregory: ["Xushomadgo'y Gregori", "O'zi yasagan malham bilan qirol Richardning ishonchiga kirib, boyib ketgan."],
          uric: ["G'alati Urik", "Boshiga meduzani shlyapa qilib kiyib yurgan g'aroyib sehrgar."],
          gwenog: ["Gvenog Jons", "«Xolixed Garpiyalari» kviddich jamoasining sardori va zarbachisi."],
          wildsmith: ["Ignatiya Uayldsmit", "Uchar kukunni ixtiro qilgan — kaminlar orqali sayohat uning sharofati."],
          whitehorn: ["Devlin Uaytxorn", "«Nimbus» poyga supurgilari kompaniyasining asoschisi."],
          potter: ["Garri Potter", "Tirik qolgan bola. Yuz yil ichidagi eng yosh Izlovchi."] },
    ru: { dumbledore: ["Альбус Дамблдор", "Директор Хогвартса. Величайший волшебник нашего времени."],
          merlin: ["Мерлин", "Самый знаменитый волшебник всех времён. Служил при дворе короля Артура."],
          morgana: ["Моргана", "Сводная сестра короля Артура, могущественная чародейка и соперница Мерлина."],
          flamel: ["Николас Фламель", "Единственный создатель философского камня. Прожил 665 лет."],
          gryffindor: ["Годрик Гриффиндор", "Один из четырёх основателей Хогвартса. Славился храбростью и мечом."],
          slytherin: ["Салазар Слизерин", "Основатель Хогвартса. Говорил на языке змей и построил Тайную комнату."],
          ravenclaw: ["Кандида Когтевран", "Основательница Хогвартса. Умнейшая волшебница своего времени."],
          hufflepuff: ["Пенелопа Пуффендуй", "Основательница Хогвартса. Известна добротой и кулинарными чарами."],
          circe: ["Цирцея", "Древнегреческая волшебница. Превращала заблудших моряков в свиней."],
          paracelsus: ["Парацельс", "Алхимик и целитель. Один из основателей волшебной медицины."],
          agrippa: ["Агриппа", "Знаменитый учёный-волшебник. Маглы посадили его в тюрьму за книги о магии."],
          ptolemy: ["Птолемей", "Древний волшебник-астроном. Одна из самых редких карточек — Рон долго её искал."],
          cliodna: ["Клиодна", "Ирландская друидесса. Пение трёх её волшебных птиц исцеляло больных."],
          hengist: ["Хенгист из Вудкрофта", "Основал деревню Хогсмид, спасаясь от преследования маглов."],
          grunnion: ["Альберик Граннион", "Изобрёл навозную бомбу. Шутники Хогвартса ему благодарны."],
          scamander: ["Ньют Саламандер", "Знаток волшебных существ. Автор «Фантастических тварей и мест их обитания»."],
          bott: ["Берти Ботт", "Случайно изобрёл драже со всеми вкусами — из-за грязных носков."],
          wright: ["Боумен Райт", "Кузнец-волшебник. Создал Золотой снитч для квиддича."],
          gregory: ["Грегори Льстивый", "Втёрся в доверие к королю Ричарду с помощью своей мази и разбогател."],
          uric: ["Урик Странный", "Чудаковатый волшебник, носивший медузу вместо шляпы."],
          gwenog: ["Гвеног Джонс", "Капитан и загонщица квиддичной команды «Холихедские гарпии»."],
          wildsmith: ["Игнатия Уилдсмит", "Изобрела летучий порох — путешествия через камины появились благодаря ей."],
          whitehorn: ["Девлин Уайтхорн", "Основатель компании гоночных мётел «Нимбус»."],
          potter: ["Гарри Поттер", "Мальчик, который выжил. Самый молодой ловец за сто лет."] },
    en: { dumbledore: ["Albus Dumbledore", "Headmaster of Hogwarts. The greatest wizard of modern times."],
          merlin: ["Merlin", "The most famous wizard of all time. Served at King Arthur's court."],
          morgana: ["Morgana", "King Arthur's half-sister, a powerful sorceress and Merlin's rival."],
          flamel: ["Nicolas Flamel", "The only known maker of the Philosopher's Stone. Lived for 665 years."],
          gryffindor: ["Godric Gryffindor", "One of the four founders of Hogwarts. Famed for his courage and his sword."],
          slytherin: ["Salazar Slytherin", "A founder of Hogwarts. Spoke to snakes and built the Chamber of Secrets."],
          ravenclaw: ["Rowena Ravenclaw", "A founder of Hogwarts. The cleverest witch of her age."],
          hufflepuff: ["Helga Hufflepuff", "A founder of Hogwarts. Known for her kindness and her food charms."],
          circe: ["Circe", "Ancient Greek sorceress. Turned lost sailors into pigs."],
          paracelsus: ["Paracelsus", "Alchemist and healer. One of the founders of wizarding medicine."],
          agrippa: ["Agrippa", "A celebrated scholar wizard. Muggles imprisoned him for his books on magic."],
          ptolemy: ["Ptolemy", "Ancient astronomer wizard. One of the rarest cards — Ron searched for it for ages."],
          cliodna: ["Cliodna", "Irish druidess. The song of her three magical birds cured the sick."],
          hengist: ["Hengist of Woodcroft", "Founded the village of Hogsmeade after fleeing Muggle persecution."],
          grunnion: ["Alberic Grunnion", "Inventor of the Dungbomb. Hogwarts pranksters are grateful."],
          scamander: ["Newt Scamander", "Expert on magical creatures. Author of Fantastic Beasts and Where to Find Them."],
          bott: ["Bertie Bott", "Invented Every Flavour Beans by accident — thanks to a dirty sock."],
          wright: ["Bowman Wright", "Metal-charmer. Created the Golden Snitch for Quidditch."],
          gregory: ["Gregory the Smarmy", "Won King Richard's trust with his own unction and grew rich."],
          uric: ["Uric the Oddball", "An eccentric wizard who wore a jellyfish for a hat."],
          gwenog: ["Gwenog Jones", "Captain and Beater of the Holyhead Harpies Quidditch team."],
          wildsmith: ["Ignatia Wildsmith", "Invented Floo powder — travel by fireplace is her doing."],
          whitehorn: ["Devlin Whitehorn", "Founder of the Nimbus Racing Broom Company."],
          potter: ["Harry Potter", "The Boy Who Lived. The youngest Seeker in a century."] }
  };

  var SQ_TX = {
    uz: { kick: "Kunlik topshiriqlar", title: "Shokolad qurbaqa", today: "Bugungi kartochka", sir: "Sirli kartochka", sirS: "Kim chiqishini quti ochilganda bilasiz", cardS: function (n, t) { return n + " / " + t + " topshiriq"; },
          ready: "Quti tayyor — oching!", openedC: "Bugungi kartochka sizda", days: function (n) { return n + " kun ketma-ket"; },
          tasksL: "Bugungi topshiriqlar", open: "Qutini ochish", need: function (n) { return "Yana " + n + " ta topshiriq"; },
          opened: "Kartochka olindi. Ertaga yangi sehrgar keladi.", prize: "Mukofot",
          prizeS: function (b, g) { return "kartochka · +" + b + " ball · " + g + " galleon"; },
          have: function (n) { return "Sizda bor" + (n > 1 ? " ×" + n : ""); }, miss: "Sizda hali yo'q",
          rwK: "Yangi kartochka", rwKDup: "Kartochka (takror)", rwP: function (b, g) { return "+" + b + " ball va " + g + " galleon"; },
          coll: "Kolleksiyam", collK: "Mashhur sehrgarlar", collS: function (n, t) { return n + " / " + t + " kartochka"; }, unknown: "Hali ochilmagan",
          strL: "Ketma-ketlik", strS: function (k, g) { return "Har " + k + "-kun — qo'shimcha +" + g + " galleon. Bir kun o'tkazib yuborsangiz, sanoq noldan boshlanadi."; },
          t: { daily: ["Sehrgarlik tarixi bellashuvida qatnashing", "Bugungi 10 ta savol"], chat: ["Chatga yozing yoki reaksiya qo'ying", "Fakultet xonasi"],
               music: ["Bitta trek tinglang", "Kutubxonadagi soundtreklar"], chess: ["Shaxmatda bir o'yin o'ynang", "Bot bilan ham bo'ladi"],
               owl: ["Boyo'g'li pochtasini oching", "Xatlaringizni ko'ring"], cup: ["Kubok sahifasiga kiring", "Fakultetingiz nechanchi o'rinda"],
               share: ["Do'stingizga ulashing", "Taklif havolasi, fakultet yoki Patronus"], house: ["Fakultet sahifasini oching", "Asoschisi, mudiri, a'zolari"] } },
    ru: { kick: "Задания дня", title: "Шоколадная лягушка", today: "Карточка дня", sir: "Тайная карточка", sirS: "Кто внутри — узнаете, когда откроете коробку", cardS: function (n, t) { return "Заданий: " + n + " / " + t; },
          ready: "Коробка готова — откройте!", openedC: "Сегодняшняя карточка у вас", days: function (n) { return "Дней подряд: " + n; },
          tasksL: "Задания на сегодня", open: "Открыть коробку", need: function (n) { return "Осталось заданий: " + n; },
          opened: "Карточка получена. Завтра придёт новый волшебник.", prize: "Награда",
          prizeS: function (b, g) { return "карточка · +" + b + " очков · галлеонов: " + g; },
          have: function (n) { return "У вас есть" + (n > 1 ? " ×" + n : ""); }, miss: "У вас пока нет",
          rwK: "Новая карточка", rwKDup: "Карточка (повтор)", rwP: function (b, g) { return "+" + b + " очков и галлеонов: " + g; },
          coll: "Моя коллекция", collK: "Знаменитые волшебники", collS: function (n, t) { return "Карточек: " + n + " / " + t; }, unknown: "Ещё не открыта",
          strL: "Серия", strS: function (k, g) { return "Каждый " + k + "-й день — ещё +" + g + " галлеона. Пропустите день — счёт начнётся заново."; },
          t: { daily: ["Примите участие в состязании по истории магии", "10 вопросов дня"], chat: ["Напишите в чат или поставьте реакцию", "Комната факультета"],
               music: ["Послушайте один трек", "Саундтреки в библиотеке"], chess: ["Сыграйте партию в шахматы", "Можно и с ботом"],
               owl: ["Откройте совиную почту", "Посмотрите свои письма"], cup: ["Загляните на страницу Кубка", "На каком месте ваш факультет"],
               share: ["Поделитесь с другом", "Приглашение, факультет или Патронус"], house: ["Откройте страницу факультета", "Основатель, декан, участники"] } },
    en: { kick: "Daily tasks", title: "Chocolate Frog", today: "Today's card", sir: "Mystery card", sirS: "You find out who it is when you open the box", cardS: function (n, t) { return n + " / " + t + " tasks"; },
          ready: "The box is ready — open it!", openedC: "You have today's card", days: function (n) { return n + " days in a row"; },
          tasksL: "Today's tasks", open: "Open the box", need: function (n) { return n + " more tasks"; },
          opened: "Card collected. A new wizard arrives tomorrow.", prize: "Reward",
          prizeS: function (b, g) { return "card · +" + b + " points · " + g + " Galleon"; },
          have: function (n) { return "You have it" + (n > 1 ? " ×" + n : ""); }, miss: "Not in your collection yet",
          rwK: "New card", rwKDup: "Card (duplicate)", rwP: function (b, g) { return "+" + b + " points and " + g + " Galleons"; },
          coll: "My collection", collK: "Famous wizards", collS: function (n, t) { return n + " / " + t + " cards"; }, unknown: "Not opened yet",
          strL: "Streak", strS: function (k, g) { return "Every " + k + "th day brings +" + g + " extra Galleons. Miss a day and the count starts over."; },
          t: { daily: ["Take part in the History of Magic contest", "Today's 10 questions"], chat: ["Write or react in the chat", "Your house room"],
               music: ["Listen to one track", "Soundtracks in the library"], chess: ["Play a game of chess", "A bot counts too"],
               owl: ["Open the owl post", "Check your letters"], cup: ["Visit the Cup page", "See where your house stands"],
               share: ["Share with a friend", "Invite link, house or Patronus"], house: ["Open a house page", "Founder, head, members"] } }
  };
  var sqData = null, sqAsked = false, sqBusy = false;
  var sqQayt = false;          // topshiriqqa sandiq sahifasidan ketilgan: "ortga" shu ro'yxatga qaytaradi

  function sqX() { return SQ_TX[lang] || SQ_TX.uz; }
  function qbImg(code) { return IMG_DIR + "qurbaqa/" + code + ".webp"; }
  function qbTx(code) { return ((QB[lang] || QB.uz)[code]) || [code, ""]; }
  function sqLocal() { return /^(localhost|127\.0\.0\.1)$/.test(window.location.hostname); }

  // Mahalliy ko'rikda server yo'q - namuna (faqat localhost); topshiriqlar shu yerning o'zida belgilanadi
  var sqDemo = null;
  function sqSample(body) {
    if (!sqDemo) {
      sqDemo = { ok: true, kun: "2026-10-05", total: 6, opened: false, streak: 3, big: false, card: null,
                 cards: { dumbledore: 1, flamel: 2, hufflepuff: 1, scamander: 1, uric: 1 }, cards_total: 24,
                 tasks: ["daily", "chat", "music", "owl", "cup", "house"].map(function (c, i) { return { code: c, done: i < 3 }; }),
                 prizes: { ball: 10, gal: 1, big_every: 7, big_gal: 3 } };
    }
    var d = sqDemo;
    d.reward = null;
    if (body && body.task) { d.tasks.forEach(function (t) { if (t.code === body.task) { t.done = true; } }); }
    d.n = d.tasks.filter(function (t) { return t.done; }).length;
    if (body && body.open && d.n >= 6 && !d.opened) {
      d.card = "merlin"; d.opened = true; d.streak++; d.cards[d.card] = (d.cards[d.card] || 0) + 1;
      d.reward = { ball: 10, gal: 1, big: false, streak: d.streak, opened: true, card: d.card, card_new: d.cards[d.card] === 1 };
    }
    d.can_open = d.n >= 6 && !d.opened;
    return JSON.parse(JSON.stringify(d));
  }

  function sqPost(body, done) {
    var init = "";
    try { init = (tg && tg.initData) || ""; } catch (e) {}
    if (!init) { if (sqLocal()) { done(sqSample(body)); } return; }
    if (!window.fetch) { return; }
    window.fetch(API_SANDIQ, { method: "POST", headers: { "Content-Type": "application/json", "X-Telegram-Init-Data": init },
                               body: JSON.stringify(body || {}) })
      .then(function (r) { return r.json(); })
      .then(function (res) { if (res && res.ok) { done(res); } })["catch"](function () {});
  }

  function sqApply(res) {
    sqData = res;
    sqCard();
    if ($("scr-sq") && !$("scr-sq").classList.contains("hidden")) { sqRender(); }
    if ($("scr-qb") && !$("scr-qb").classList.contains("hidden")) { qbRender(); }
    try { qbRow(); } catch (e) {}
  }

  function sqLoad(force) {
    if (sqAsked && !force) { sqCard(); return; }
    var ichkarida = false;
    try { ichkarida = hasHouse(); } catch (e) {}
    if (!ichkarida) { return; }
    sqAsked = true;
    sqPost({}, sqApply);
  }

  // Topshiriq bajarildi: bugungi ro'yxatda bo'lsa va hali belgilanmagan bo'lsa - serverga
  function sqDone(code) {
    if (!sqData || !sqData.tasks) { return; }
    var bor = sqData.tasks.filter(function (t) { return t.code === code && !t.done; })[0];
    if (!bor) { return; }
    bor.done = true;                      // ikki marta yubormaslik uchun
    sqPost({ task: code }, sqApply);
  }

  function qbCount() {
    var n = 0, c = (sqData && sqData.cards) || {};
    QB_ORDER.forEach(function (k) { if (c[k]) { n++; } });
    return n;
  }

  // Xogvarts bosh sahifasidagi karta (kubok blokidan keyin): bugungi kartochka va nechta topshiriq
  function sqCard() {
    var grid = $("hub-grid");
    if (!grid) { return; }
    var card = $("hub-sq");
    if (!sqData) { if (card) { card.classList.add("hidden"); } return; }
    var x = sqX(), d = sqData;
    if (!card) {
      card = document.createElement("button");
      card.type = "button";
      card.id = "hub-sq";
      card.className = "hub-sq";
      card.innerHTML = '<span class="qb-sir">?</span><img alt=""><span class="hub-sq-tx"><b></b><small></small><span class="hub-sq-dots"></span></span><em></em>';
      card.onclick = sqOpen;
      grid.parentNode.insertBefore(card, grid);
    }
    card.classList.remove("hidden");
    card.classList.toggle("ready", !!d.can_open);
    card.classList.toggle("done", !!d.opened);
    // Bugungi kartochka quti ochilmaguncha SIR (server ham aytmaydi)
    var ochiq = !!(d.opened && d.card);
    card.querySelector(".qb-sir").classList.toggle("hidden", ochiq);
    card.querySelector("img").classList.toggle("hidden", !ochiq);
    if (ochiq) { card.querySelector("img").src = qbImg(d.card); }
    card.querySelector("b").textContent = x.title + (ochiq ? " · " + qbTx(d.card)[0] : "");
    card.querySelector("small").textContent = d.opened ? x.openedC : d.can_open ? x.ready : x.cardS(d.n, d.total);
    var dots = card.querySelector(".hub-sq-dots");
    dots.innerHTML = "";
    d.tasks.forEach(function (t) { var i = document.createElement("i"); if (t.done) { i.className = "on"; } dots.appendChild(i); });
    var em = card.querySelector("em");
    em.innerHTML = d.streak > 0 ? SQ_FIRE + "<span>" + d.streak + "</span>" : "";
    em.classList.toggle("hidden", !(d.streak > 0));
  }

  function sqGo(code) {
    var h = null;
    try { h = validHouse(cupMe().house || house); } catch (e) {}
    $("scr-sq").classList.add("hidden");
    sqQayt = true;
    try { worldFrom = "hub"; } catch (e) {}          // "ortga" -> openHub() -> yana shu ro'yxat
    try {
      if (code === "daily") { blOpen("tarix", "list"); }            // kunlik savol o'rnida: Sehrgarlik tarixi bellashuvi
      else if (code === "chat") { openChat(); }
      else if (code === "chess") { openChessHub(); }
      else if (code === "owl") { openOwl(); owlFrom = "hub"; }
      else if (code === "cup") { openCup(); }
      else if (code === "house" && h) { openHouse(h); }
      else if (code === "share") { openRefs(); }
      else if (code === "music") {
        $("scr-cat").classList.remove("hidden");
        renderCatalog();
        setTimeout(function () { try { $("ms-row").scrollIntoView({ behavior: "smooth", block: "center" }); } catch (e) {} }, 120);
      }
      else { sqQayt = false; openHub(); }
    } catch (e) { sqQayt = false; try { openHub(); } catch (e2) {} }
  }

  // Topshiriqdan qaytish: sqGo dan keyin birinchi "ortga" (openHub, closeCup, closeHouse) shu yerga keladi
  function sqBack() {
    if (!sqQayt) { return false; }
    sqQayt = false;
    sqOpen();
    return true;
  }

  function sqRender() {
    var x = sqX(), d = sqData;
    if (!d) { return; }
    var pz = d.prizes || { ball: 10, gal: 1, big_every: 7, big_gal: 3 };
    var ochiq = !!(d.opened && d.card);
    var kt = ochiq ? qbTx(d.card) : [x.sir, ""], bor = ochiq ? ((d.cards || {})[d.card] || 0) : 0;
    $("sq-kick").textContent = x.kick;
    $("sq-title").textContent = x.title;
    $("sq-img").classList.toggle("hidden", !ochiq);
    $("sq-sir").classList.toggle("hidden", ochiq);
    if (ochiq) { $("sq-img").src = qbImg(d.card); }
    $("sq-card").className = "sq-card" + (d.can_open ? " ready" : "") + (d.opened ? " done" : "");
    $("sq-card-k").textContent = x.today;
    $("sq-card-n").textContent = kt[0];
    $("sq-card-s").textContent = ochiq ? x.have(bor || 1) : x.sirS;
    $("sq-card-s").classList.toggle("on", !!bor);
    $("sq-n").textContent = d.n + " / " + d.total;

    // Mukofot faqat 6 ta topshiriqning hammasi bajarilganda (oraliq mukofot yo'q)
    var lad = $("sq-ladder");
    lad.innerHTML = "";
    var pr = document.createElement("span");
    pr.className = "sq-prize" + (d.n >= d.total ? " on" : "");
    pr.innerHTML = "<small></small><b></b>";
    pr.querySelector("small").textContent = x.prize;
    pr.querySelector("b").textContent = x.prizeS(pz.ball, pz.gal + (d.big ? pz.big_gal : 0));
    lad.appendChild(pr);
    $("sq-fill").style.width = Math.round(d.n * 100 / d.total) + "%";

    $("sq-tasks-l").textContent = x.tasksL;
    var list = $("sq-tasks");
    list.innerHTML = "";
    d.tasks.forEach(function (t) {
      var tx = x.t[t.code];
      if (!tx) { return; }
      var row = document.createElement("button");
      row.type = "button";
      row.className = "sq-task" + (t.done ? " done" : "");
      row.innerHTML = '<span class="sq-ck">' + (t.done ? SQ_CHECK : "") + '</span><span class="sq-task-tx"><b></b><small></small></span><i>›</i>';
      row.querySelector("b").textContent = tx[0];
      row.querySelector("small").textContent = tx[1];
      if (!t.done) { row.onclick = function () { sqGo(t.code); }; }
      list.appendChild(row);
    });

    var btn = $("sq-open");
    btn.textContent = d.opened ? x.opened : d.can_open ? x.open : x.need(d.total - d.n);
    btn.disabled = !d.can_open;
    btn.classList.toggle("off", !d.can_open);
    btn.onclick = sqChest;

    // Kolleksiyaga yo'l
    $("sq-coll-t").textContent = x.coll;
    $("sq-coll-s").textContent = x.collS(qbCount(), d.cards_total || QB_ORDER.length);
    $("sq-coll").onclick = function () { qbOpen("sq"); };

    // Ketma-ketlik: 7 ta katak, bugungacha yoqilgan
    $("sq-str-l").textContent = x.strL;
    $("sq-str-n").innerHTML = SQ_FIRE + "<span></span>";
    $("sq-str-n").querySelector("span").textContent = x.days(d.streak);
    var dots = $("sq-str-dots"), k = pz.big_every, joy = d.streak % k;
    if (d.opened && joy === 0 && d.streak > 0) { joy = k; }
    dots.innerHTML = "";
    for (var i = 1; i <= k; i++) {
      var o = document.createElement("i");
      o.className = (i <= joy ? "on" : "") + (i === k ? " big" : "");
      o.textContent = i;
      dots.appendChild(o);
    }
    $("sq-str-s").textContent = x.strS(k, pz.big_gal);
  }

  function sqOpen() {
    if (!sqData) { return; }
    sqQayt = false;
    ["scr-hub", "scr-cat", "scr-cup", "scr-house", "scr-owl", "scr-refs", "scr-chat", "scr-chess-hub", "scr-tasks", "scr-quiz", "scr-qb", "pm"]
      .forEach(function (id) { var el = $(id); if (el) { el.classList.add("hidden"); } });
    $("scr-sq").classList.remove("hidden");
    $("sq-back").onclick = function () { $("scr-sq").classList.add("hidden"); sqQayt = false; try { openHub(); } catch (e) {} };
    sqRender();
    sqPost({}, sqApply);                 // kunlik savol boshqa joyda bajarilgan bo'lishi mumkin
    try { window.scrollTo(0, 0); } catch (e) {}
  }

  // Qutini ochish: kartochka va mukofot oynasi (nishon oynasidan foydalanadi)
  function sqChest() {
    if (sqBusy || !sqData || !sqData.can_open) { return; }
    sqBusy = true;
    sqPost({ open: true }, function (res) {
      sqBusy = false;
      var x = sqX(), r = res.reward;
      sqApply(res);
      if (!r || !r.opened) { return; }
      try { if (tg && tg.HapticFeedback) { tg.HapticFeedback.notificationOccurred("success"); } } catch (e) {}
      var kt = qbTx(r.card);
      nshBox({ codes: ["x"], srcs: [qbImg(r.card)], card: true, kick: r.card_new === false ? x.rwKDup : x.rwK,
               title: kt[0], text: kt[1] + "\n\n" + x.rwP(r.ball, r.gal),
               done: function () { try { nshLoad(true); } catch (e) {} } });
      try { walLoad(function () { pmRender(); }); } catch (e) {}
      try { fetchCup(function () {}); } catch (e) {}
    });
    setTimeout(function () { sqBusy = false; }, 6000);
  }

  /* --- Kolleksiya sahifasi: 24 ta kartochka, borlari rangli, yo'qlari qorong'i --- */
  var qbFrom = "sq";

  function qbRender() {
    var x = sqX(), d = sqData || {}, bor = d.cards || {};
    $("qb-kick").textContent = x.collK;
    $("qb-title").textContent = x.coll;
    var n = qbCount(), t = d.cards_total || QB_ORDER.length;
    $("qb-sum-n").textContent = n + " / " + t;
    $("qb-bar").style.width = Math.round(n * 100 / t) + "%";
    var g = $("qb-grid");
    g.innerHTML = "";
    QB_ORDER.forEach(function (code) {
      var kt = qbTx(code), soni = bor[code] || 0;
      var el = document.createElement("button");
      el.type = "button";
      el.className = "qb-it" + (soni ? "" : " off");
      var im = document.createElement("img");
      im.alt = ""; im.loading = "lazy"; im.src = qbImg(code);
      el.appendChild(im);
      var nm = document.createElement("span");
      nm.textContent = soni ? kt[0] : "?";
      el.appendChild(nm);
      if (soni > 1) { var k = document.createElement("i"); k.textContent = "×" + soni; el.appendChild(k); }
      el.onclick = function () {
        if (soni) { nshBox({ codes: ["x"], srcs: [qbImg(code)], card: true, kick: x.have(soni), title: kt[0], text: kt[1] }); }
        else { nshBox({ codes: [], kick: x.unknown, title: "?", text: x.sirS }); }
      };
      g.appendChild(el);
    });
  }

  function qbOpen(from) {
    if (!sqData) { return; }
    qbFrom = from || "sq";
    ["scr-sq", "scr-hub", "pm"].forEach(function (id) { $(id).classList.add("hidden"); });
    $("scr-qb").classList.remove("hidden");
    $("qb-back").onclick = function () {
      $("scr-qb").classList.add("hidden");
      if (qbFrom === "pm") { try { pmShow(); } catch (e) {} } else { sqOpen(); }
    };
    qbRender();
    try { window.scrollTo(0, 0); } catch (e) {}
  }

  // Profildagi qator: "Kartochkalar 5 / 24"
  function qbRow() {
    var row = $("qb-row");
    if (!row) { return; }
    var ichkarida = false;
    try { ichkarida = hasHouse(); } catch (e) {}
    row.classList.toggle("hidden", !(ichkarida && sqData));
    if (!sqData) { return; }
    var x = sqX(), bor = sqData.cards || {};
    $("qb-row-t").textContent = x.coll;
    $("qb-row-s").textContent = qbCount() + " / " + (sqData.cards_total || QB_ORDER.length);
    var mini = $("qb-row-im");
    mini.innerHTML = "";
    QB_ORDER.filter(function (c) { return bor[c]; }).slice(-4).forEach(function (c) {
      var im = document.createElement("img"); im.alt = ""; im.src = qbImg(c); mini.appendChild(im);
    });
    row.onclick = function () { qbOpen("pm"); };
  }

  function renderCatalog() {
    var t = T[lang];
    $("cat-kicker").textContent = t.title;
    $("cat-title").textContent = LIB_TITLE[lang];
    $("lang-badge").textContent = flagOf(lang);
    $("back-btn").setAttribute("aria-label", lang.toUpperCase());
    renderHero(t);
    pmRender();
    qsLoad();
    nshLoad();
    renderSerial();
    srLoad();
    srBlock();
    ktLoad();
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
    // Qasr tugmasi yo'q bo'lsa boyo'g'li eng o'ngga suriladi (egasi, 2026-10-04)
    try { btn.parentNode.parentNode.classList.toggle("no-world", isLetter); } catch (e) {}
    $("coin-934").classList.remove("hidden");
    $("coin-lt").classList.add("hidden");
    btn.classList.remove("yangi");
    btn.setAttribute("aria-label", "Xogvarts");
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

    // Fakulteti borlar uni rasm qilib ulasha oladi (uyShare, js/09)
    var ush = $("house-share");
    ush.textContent = al("uyShare");
    ush.classList.toggle("hidden", house === "none");
    if (!ush.onclick) { ush.onclick = function () { uyShare(); }; }
    // Kichik "i" tugmasi: fakultet sahifasi (asoschisi, mudiri, a'zolari) - qaytganda yana profil
    var hi = $("house-info");
    hi.classList.toggle("hidden", house === "none");
    // Avval qisqa oyna: shu fakultet odamining xarakteri; "Batafsil" - fakultet sahifasi (egasi, 2026-10-05)
    hi.onclick = function () {
      var hx = UY_XAR[lang] || UY_XAR.uz, hh = HOUSES[house] || {};
      nshBox({ codes: ["x"], srcs: [IMG_DIR + hh.img], crest: true, kick: t.houseLbl, title: hh[lang] || "",
               text: hx[house] || "",
               more: { label: hx.more, fn: function () { pmUy = true; pmHide(); try { openHouse(house); } catch (e) { pmUy = false; pmShow(); } } } });
    };

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

    $("wand-info").classList.toggle("hidden", !wand);
    $("wand-info").onclick = openWandDetail;
    $("wand-share").textContent = TQ_TX[lang] || TQ_TX.uz;
    $("wand-share").classList.toggle("hidden", !wand);
    $("wand-share").onclick = tqShare;
    icon.classList.toggle("rasm", !!wand);
    if (wand) {
      // Tayoqcha rasmi yog'ochiga qarab (img/tayoqcha/<yog'och>.webp, dizayn tizimi uslubida)
      icon.innerHTML = '<img alt="" src="' + IMG_DIR + "tayoqcha/" + wand.wood + '.webp">';
      $("wand-wood").textContent = WOODS[wand.wood][lang];
      $("wand-l1").textContent = CORES[wand.core][lang];
      $("wand-l2").textContent = FLEX[wand.flex].len + " " + t.inch;
      $("wand-l3").textContent = FLEX[wand.flex][lang];
      $("wand-more").classList.add("hidden");       // "Batafsil" o'rnida endi kichik "i" tugmasi
      $("wand-cta").classList.add("hidden");
      // Tayoqcha ham bir marta tanlanadi (egasi, 2026-10-05) - "Qayta tanlash" tugmasi yo'q
      $("wand-again").classList.add("hidden");
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
      { label: t.ckPatronus, state: patronus ? "done" : (house !== "none" ? "todo" : "soon") }
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

  /* Tayoqchani ulashish: ismi va tayoqchasi yozilgan rasm (Stories yoki chatga) - fakultet va Patronus kabi */
  // Fakultet odamining xarakteri (profildagi "i" oynasi uchun)
  var UY_XAR = {
    uz: { more: "Fakultet haqida batafsil",
          gryffindor: "Grifindorliklar jasur, dadil va olijanob. Qo'rquvga qaramay oldinga chiqadi, do'stlari uchun o'zini xavfga qo'yadi va adolatsizlikka jim qarab turolmaydi.",
          slytherin: "Sliterinliklar maqsadli, zukko va topqir. Nima istashini aniq biladi, unga yetish yo'lini topadi va o'z odamlariga sodiq qoladi.",
          ravenclaw: "Reyvenkloliklar aqlli, qiziquvchan va ijodkor. Bilimni hamma narsadan ustun qo'yadi, savol berishdan charchamaydi va har narsaga o'zgacha nazar bilan qaraydi.",
          hufflepuff: "Xaffelpaffliklar sodiq, mehnatkash va adolatli. Sabr bilan ishlaydi, hech kimni ajratmaydi va qiyin kunda birinchi bo'lib yordamga keladi." },
    ru: { more: "Подробнее о факультете",
          gryffindor: "Гриффиндорцы храбры, решительны и благородны. Они идут вперёд, несмотря на страх, рискуют собой ради друзей и не молчат при виде несправедливости.",
          slytherin: "Слизеринцы целеустремлённы, хитры и находчивы. Они точно знают, чего хотят, находят путь к цели и верны своим.",
          ravenclaw: "Когтевранцы умны, любознательны и изобретательны. Знания для них превыше всего, они не устают задавать вопросы и на всё смотрят по-своему.",
          hufflepuff: "Пуффендуйцы верны, трудолюбивы и справедливы. Они работают терпеливо, никого не делят на своих и чужих и первыми приходят на помощь." },
    en: { more: "More about the house",
          gryffindor: "Gryffindors are brave, daring and chivalrous. They step forward despite fear, risk themselves for their friends and cannot stay silent in the face of injustice.",
          slytherin: "Slytherins are ambitious, cunning and resourceful. They know exactly what they want, find a way to get it and stay loyal to their own.",
          ravenclaw: "Ravenclaws are clever, curious and inventive. They value knowledge above all, never tire of asking questions and see everything in their own way.",
          hufflepuff: "Hufflepuffs are loyal, hard-working and fair. They work patiently, treat everyone equally and are the first to help on a hard day." }
  };
  var API_TAYOQ = "https://bot.tizimshunos.uz/api/tayoqcha/share";
  var TQ_TX = { uz: "Tayoqchamni ulashish", ru: "Поделиться палочкой", en: "Share my wand" };
  var TQ_ST = { uz: "Tayoqcha sehrgarni tanlaydi", ru: "Палочка выбирает волшебника", en: "The wand chooses the wizard" };
  var tqBand = false, tqBor = null;
  var pmUy = false;            // fakultet sahifasi profildan ochilgan - "ortga" profilga qaytaradi

  function tqShare() {
    if (tqBand || !wand) { return; }
    var d = "";
    try { d = (tg && tg.initData) || ""; } catch (e) {}
    if (!d || !window.fetch) { showToast(al("shareErr"), "err"); return; }
    var kalit = lang + wand.wood + wand.core + wand.flex;
    if (tqBor && tqBor.kalit === kalit) { rasmUlash(tqBor, TQ_ST[lang] || TQ_ST.uz, T[lang].wandLbl); return; }
    tqBand = true;
    var kut = showToast(al("uyWait"));
    window.fetch(API_TAYOQ, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Telegram-Init-Data": d },
      body: JSON.stringify({ lang: lang, wood: wand.wood, core: wand.core, flex: wand.flex })
    }).then(function (r) { return r.json(); })
      .then(function (res) {
        tqBand = false;
        dismissNote(kut);
        if (!(res && res.ok && res.url)) { showToast(al("shareErr"), "err"); return; }
        res.kalit = kalit;
        tqBor = res;
        rasmUlash(res, TQ_ST[lang] || TQ_ST.uz, T[lang].wandLbl);
      })["catch"](function () { tqBand = false; dismissNote(kut); showToast(al("shareErr"), "err"); });
  }

  function openWandDetail() {
    if (!wand) { return; }
    var t = T[lang];
    var wd = WOODS[wand.wood], cr = CORES[wand.core], fl = FLEX[wand.flex];

    $("scr-detail").classList.remove("pat");      // shu sahifa Patronus tafsiloti uchun ham ishlatiladi (openPatDetail)
    $("det-b3").classList.add("hidden");
    $("det-kicker").textContent = t.detKicker;
    $("det-back-txt").textContent = t.back;

    $("det-art").innerHTML = '<img class="det-rasm" alt="" src="' + IMG_DIR + "tayoqcha/" + wand.wood + '.webp">';
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
