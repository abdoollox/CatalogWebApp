/* Ilova ichidagi pleyer (egasi, 2026-10-17) - SINOV: hozircha faqat adminlarga ko'rinadi.
   Bitta film - ichida til, dublyaj va sifat tanlanadi (16 ta faylni yuklab olish shart emas).
   Fayllar Telegram'da qoladi; server (bot, hppleyer.py) ularni bo'lakma-bo'lak olib shu zahoti uzatadi.
   Kim ko'rishini SERVER hal qiladi: /api/pleyer "yopiq" desa - sifat oynasida tugma chiqmaydi.
   Ko'rinish «Kino zali»: kadr -> sarlavha -> kumush asosiy tugma -> «Ovoz va sifat» kartasi (pastdan tanlov,
   plSheet) -> kolleksiya qatori. Boshqaruv tugmalari o'zimizniki - har qurilmada bir xil.
   Almashtirganda film o'sha daqiqadan davom etadi; qayerda to'xtagani shu qurilmada eslanadi (hp_pl_pos).
   Sifat ochilmasa (brauzer o'ynata olmasa) - belgilanadi va boshqa sifatga o'zi o'tadi (plXato).
   Kutubxona qismi - zamonaviy uslub (qahramon, sehrli bezak yo'q). */
"use strict";
  var API_PL = "https://bot.tizimshunos.uz/api/pleyer";
  var PL_TX = {
    uz: { hp: "Garri Potter", fb: "Fantastik maxluqlar", qism: "-qism", watch: "Ko'rish", resume: "Davom etish · %s",
          pause: "Pauza", left: "Qolgan vaqt: %s", av: "Ovoz va sifat", rail: "Kolleksiya", now: "Hozir",
          lang: "Til", dub: "Dublyaj", q: "Sifat", chLang: "Qaysi tilda ko'rasiz?", chDub: "Qaysi dublyaj?", chQ: "Qaysi sifatda?",
          soon: "Tez orada", bad: "Bu qurilmada ochilmadi", watchApp: "Ilovada ko'rish", test: "Sinov · faqat sizga ko'rinadi",
          note: "Sinov rejimi — faqat sizga ko'rinadi. Film Telegram'dan serverimiz orqali keladi.",
          bot: "Bot chatiga yuklab olish", soat: "soat", daq: "daqiqa", til: "til", dubl: "dublyaj",
          err: "Film ochilmadi. Boshqa sifatni tanlang yoki bot orqali yuklab oling.", wait: "Ulanmoqda…",
          alt: "Bu sifat qurilmangizda ochilmadi — %s ga o'tdik.", cant: "Bu qurilmada ochilmasligi mumkin",
          noLang: "Bu qurilma %s nusxani o'ynata olmaydi (fayl formati). Boshqa tilni tanlang yoki bot orqali yuklab oling.",
          notReady: "Pleyer hali Telegram'ga ulanmagan: botga ilova kaliti berilishi kerak (/pleyer)." },
    ru: { hp: "Гарри Поттер", fb: "Фантастические твари", qism: "-я часть", watch: "Смотреть", resume: "Продолжить · %s",
          pause: "Пауза", left: "Осталось: %s", av: "Звук и качество", rail: "Коллекция", now: "Сейчас",
          lang: "Язык", dub: "Дубляж", q: "Качество", chLang: "На каком языке смотреть?", chDub: "Какой дубляж?", chQ: "Какое качество?",
          soon: "Скоро", bad: "Не открылось на этом устройстве", watchApp: "Смотреть в приложении", test: "Тест · видно только вам",
          note: "Тестовый режим — видно только вам. Фильм идёт из Telegram через наш сервер.",
          bot: "Скачать в чат с ботом", soat: "ч", daq: "мин", til: "языка", dubl: "дубляжа",
          err: "Фильм не открылся. Выберите другое качество или скачайте через бота.", wait: "Подключение…",
          alt: "Это качество не открылось на вашем устройстве — переключили на %s.", cant: "Может не открыться на этом устройстве",
          noLang: "Это устройство не может воспроизвести версию «%s» (формат файла). Выберите другой язык или скачайте через бота.",
          notReady: "Плеер ещё не подключён к Telegram: боту нужен ключ приложения (/pleyer)." },
    en: { hp: "Harry Potter", fb: "Fantastic Beasts", qism: "", part: "Part ", watch: "Watch", resume: "Resume · %s",
          pause: "Pause", left: "%s left", av: "Audio & quality", rail: "Collection", now: "Now",
          lang: "Language", dub: "Dubbing", q: "Quality", chLang: "Which language?", chDub: "Which dubbing?", chQ: "Which quality?",
          soon: "Coming soon", bad: "Didn't open on this device", watchApp: "Watch in the app", test: "Test · only you can see it",
          note: "Test mode — only you can see it. The film streams from Telegram through our server.",
          bot: "Download to the bot chat", soat: "h", daq: "min", til: "languages", dubl: "dubs",
          err: "The film didn't open. Pick another quality or download it via the bot.", wait: "Connecting…",
          alt: "This quality didn't open on your device — switched to %s.", cant: "May not open on this device",
          noLang: "This device can't play the %s version (file format). Pick another language or download it via the bot.",
          notReady: "The player isn't connected to Telegram yet: the bot needs an app key (/pleyer)." }
  };
  var PL_LANG = { uz: "O'zbekcha", ru: "Русский", en: "English" };
  var PL_Q = [["fhd", "Full HD", "1080p"], ["hd", "HD", "720p"], ["sd", "SD", "480p"]];
  var PL_DUBS = [["my5", "MY5 TV"], ["zor", "ZO'R TV"]];
  var PL_YIL = { hp1: 2001, hp2: 2002, hp3: 2004, hp4: 2005, hp5: 2007, hp6: 2009, hp7: 2010, hp8: 2011,
                 fb1: 2016, fb2: 2018, fb3: 2022 };
  var PL_BOSH_Q = ["hd", "fhd", "sd"];            // sinovda HD dan boshlanadi - trafik kamroq
  var PL_IC = { ok: "M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10s10-4.5 10-10S17.5 2 12 2m-2 15l-5-5l1.41-1.41L10 14.17l7.59-7.59L19 8z", lock: "M12 17a2 2 0 0 0 2-2a2 2 0 0 0-2-2a2 2 0 0 0-2 2a2 2 0 0 0 2 2m6-9a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2h1V6a5 5 0 0 1 5-5a5 5 0 0 1 5 5v2zm-6-5a3 3 0 0 0-3 3v2h6V6a3 3 0 0 0-3-3" };
  var plInfo = {};                                // film -> {res, t}
  var pl = { id: null, res: null, lang: null, dub: null, q: null, v: null, scroll: 0, saqT: 0, t: 0, bad: {}, drag: null };

  function plTx() { return PL_TX[lang] || PL_TX.uz; }
  function plSvg(d) { return '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="' + d + '"/></svg>'; }

  function plLoad(id, cb) {
    var hit = plInfo[id];
    // Keshdan ham keyingi lahzada - chaqirgan joy (sifat oynasi) o'zini ochib ulgursin
    if (hit && Date.now() - hit.t < 5 * 60 * 1000) { setTimeout(function () { cb(hit.res); }, 0); return; }
    var init = "";
    try { init = (tg && tg.initData) || ""; } catch (e) {}
    if (!init || !window.fetch) { cb(null); return; }
    window.fetch(API_PL, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Telegram-Init-Data": init },
      body: JSON.stringify({ film: id })
    }).then(function (r) { return r.json(); }).then(function (res) {
      plInfo[id] = { res: res, t: Date.now() };
      cb(res);
    })["catch"](function () { cb(null); });
  }

  // Sifat oynasi ochilganda (js/05 play): server ruxsat bersa tepada "Ilovada ko'rish" tugmasi
  function plQs(id) {
    var b = $("qs-pl");
    if (!b) { return; }
    b.classList.add("hidden");
    plLoad(id, function (res) {
      if (!res || !res.ok) { return; }
      if ($("qs").classList.contains("hidden") || $("qs").getAttribute("data-film") !== id) { return; }
      var x = plTx();
      b.querySelector("b").textContent = x.watchApp;
      b.querySelector("small").textContent = x.test;
      b.onclick = function () { qsClose(); plOpen(id, qsDub); };
      b.classList.remove("hidden");
    });
  }

  /* ---------- NUSXALAR ---------- */

  function plVer(l, d, q) {
    var vs = (pl.res && pl.res.versions) || [];
    for (var i = 0; i < vs.length; i++) {
      var v = vs[i];
      if (v.lang === l && v.q === q && (l !== "uz" || v.dub === d)) { return v; }
    }
    return null;
  }

  function plHas(l, d) { return PL_Q.some(function (q) { return !!plVer(l, d, q[0]); }); }
  function plHasLang(l) { return l === "uz" ? PL_DUBS.some(function (d) { return plHas("uz", d[0]); }) : plHas(l, ""); }

  // Shu qurilmada ochilmagan nusxa (brauzer o'ynata olmagan) - tanlovda tashlab o'tiladi
  function plOk(l, d, q) { var v = plVer(l, d, q); return !!v && !pl.bad[v.v]; }

  /* Qurilma bu nusxani o'ynata oladimi (2026-10-17: Windows Telegram'da o'zbekcha HD/SD - HEVC - ovoz bilan, lekin
     rasmsiz o'ynardi). Server nusxaning video turini aytadi (codec, p10); brauzerdan oldindan so'raymiz. */
  var plCanK = {};
  function plCan(v) {
    if (!v || !v.codec) { return true; }
    var t = v.codec === "hev1" || v.codec === "hvc1" ? 'video/mp4; codecs="hvc1.1.6.L93.B0"'
          : v.p10 ? 'video/mp4; codecs="avc1.6E0028"' : "";
    if (!t) { return true; }
    if (!Object.prototype.hasOwnProperty.call(plCanK, t)) {
      try { plCanK[t] = !!document.createElement("video").canPlayType(t); } catch (e) { plCanK[t] = true; }
    }
    return plCanK[t];
  }

  // Tanlangan til/dublyajda eng mos sifat: avvalgisi, bo'lmasa navbat bo'yicha; qurilma o'ynata oladiganlari birinchi
  function plPickQ(l, d, avval) {
    var tartib = (avval ? [avval] : []).concat(PL_BOSH_Q), i;
    for (i = 0; i < tartib.length; i++) { if (plOk(l, d, tartib[i]) && plCan(plVer(l, d, tartib[i]))) { return tartib[i]; } }
    for (i = 0; i < tartib.length; i++) { if (plOk(l, d, tartib[i])) { return tartib[i]; } }
    return null;
  }

  function plNoLang() {
    var nom = PL_LANG[pl.lang] || "";
    if (lang === "uz") { nom = nom.charAt(0).toLowerCase() + nom.slice(1); }       // gap o'rtasida: «o'zbekcha nusxani»
    plMsg(plTx().noLang.replace("%s", nom));
  }

  /* Ovoz bor, rasm yo'q: ba'zi brauzerlar video turini o'qiy olmasa xato bermaydi - faqat ovozni o'ynatadi.
     O'ynay boshlagach 2,5 s da birorta kadr chizilmagan bo'lsa - shu nusxa ochilmadi deb, boshqasiga o'tamiz. */
  function plRasmTekshir() {
    var vid = $("pl-video"), v0 = pl.v, t0 = vid.currentTime;
    clearTimeout(pl.rtT);
    pl.rtT = setTimeout(function () {
      if (pl.v !== v0 || vid.paused || vid.currentTime - t0 < 1) { return; }
      var fr = -1;
      try {
        if (vid.getVideoPlaybackQuality) { fr = vid.getVideoPlaybackQuality().totalVideoFrames; }
        else if ("webkitDecodedFrameCount" in vid) { fr = vid.webkitDecodedFrameCount; }
      } catch (e) {}
      if (fr === 0 || (fr < 0 && !vid.videoWidth)) { plXato(); }
    }, 2500);
  }

  function plQNom(q) { var r = PL_Q.filter(function (x) { return x[0] === q; })[0]; return r ? r[1] : ""; }

  function plHajm(b) {
    if (!b) { return ""; }
    var mb = b / 1048576;
    if (mb < 1000) { return Math.round(mb) + " MB"; }
    var gb = (Math.round(mb / 1024 * 10) / 10).toFixed(1);
    return (lang === "en" ? gb : gb.replace(".", ",")) + " GB";
  }

  function plVaqt(s) {
    s = Math.floor(s || 0);
    var h = Math.floor(s / 3600), m = Math.floor(s % 3600 / 60), c = s % 60;
    return (h ? h + ":" + (m < 10 ? "0" : "") : "") + m + ":" + (c < 10 ? "0" : "") + c;
  }

  function plUzun(s) {
    var x = plTx(), h = Math.floor(s / 3600), m = Math.round(s % 3600 / 60);
    return (h ? h + " " + x.soat + " " : "") + m + " " + x.daq;
  }

  function plPosGet(id) {
    try { return (JSON.parse(window.localStorage.getItem("hp_pl_pos") || "{}")[id]) || 0; } catch (e) { return 0; }
  }

  function plPosSet(id, t) {
    try {
      var d = JSON.parse(window.localStorage.getItem("hp_pl_pos") || "{}");
      d[id] = Math.floor(t);
      window.localStorage.setItem("hp_pl_pos", JSON.stringify(d));
    } catch (e) {}
  }

  function plMsg(text) {
    var m = $("pl-msg");
    m.textContent = text || "";
    m.classList.toggle("hidden", !text);
  }

  // Film davomiyligi: Telegram ma'lumotidan (video yuklanmasdan oldin ham ma'lum), bo'lmasa videoning o'zidan
  function plDur() {
    var v = plVer(pl.lang, pl.dub, pl.q), dur = v && v.dur ? v.dur : 0;
    if (!dur) { ((pl.res && pl.res.versions) || []).forEach(function (x) { if (x.dur > dur) { dur = x.dur; } }); }
    return dur || $("pl-video").duration || 0;
  }

  /* ---------- FILM HAQIDA: yorliq, ma'lumot, asosiy tugma ---------- */

  function plYorliq(id) {
    var x = plTx(), fb = id.indexOf("fb") === 0, n = parseInt(id.replace(/\D/g, ""), 10) || 1;
    return (fb ? x.fb : x.hp) + "  ·  " + (x.part ? x.part + n : n + x.qism);
  }

  // Yil · davomiyligi · [sifat] · nechta til va dublyaj
  function plMeta() {
    var x = plTx(), box = $("pl-meta"), vs = (pl.res && pl.res.versions) || [], qism = [];
    box.innerHTML = "";
    if (PL_YIL[pl.id]) { qism.push(document.createTextNode(String(PL_YIL[pl.id]))); }
    var dur = plDur();
    if (dur) { qism.push(document.createTextNode(plUzun(dur))); }
    if (pl.q) { var u = document.createElement("u"); u.textContent = plQNom(pl.q); qism.push(u); }
    var tillar = {}, dublar = {};
    vs.forEach(function (v) { tillar[v.lang] = 1; if (v.lang === "uz" && v.dub) { dublar[v.dub] = 1; } });
    var nt = Object.keys(tillar).length, nd = Object.keys(dublar).length;
    if (nt > 1) { qism.push(document.createTextNode(nt + " " + x.til + (nd > 1 ? ", " + nd + " " + x.dubl : ""))); }
    qism.forEach(function (el, i) {
      if (i) { box.appendChild(document.createElement("i")); }
      box.appendChild(el);
    });
  }

  function plCta() {
    var x = plTx(), vid = $("pl-video"), t = vid.currentTime > 5 ? vid.currentTime : 0;
    var oyn = !!vid.getAttribute("src") && !vid.paused;
    $("scr-pleyer").classList.toggle("oyn", oyn);
    var saq = $("pl-box").classList.contains("bosh") ? plPosGet(pl.id) : 0;      // film boshlanmaguncha
    $("pl-cta-t").textContent = oyn ? x.pause : (t || saq > 30) ? x.resume.replace("%s", plVaqt(t || saq)) : x.watch;
    // To'xtagan joy chizig'i - film boshlanmaguncha (saqlangan joy bo'lsa)
    var dur = plDur(), r = $("pl-resume");
    r.classList.toggle("hidden", !(saq > 30 && dur));
    if (saq > 30 && dur) {
      $("pl-resume-f").style.width = Math.min(100, saq / dur * 100) + "%";
      $("pl-resume-t").textContent = x.left.replace("%s", plUzun(Math.max(0, dur - saq)));
    }
  }

  /* ---------- OVOZ VA SIFAT ---------- */

  function plRender() {
    var x = plTx(), v = plVer(pl.lang, pl.dub, pl.q);
    $("pl-l-av").textContent = x.av;
    $("pl-l-lang").textContent = x.lang;
    $("pl-l-dub").textContent = x.dub;
    $("pl-l-q").textContent = x.q;
    $("pl-v-lang").textContent = PL_LANG[pl.lang] || "—";
    $("pl-r-dub").classList.toggle("hidden", pl.lang !== "uz");
    var d = PL_DUBS.filter(function (r) { return r[0] === pl.dub; })[0];
    $("pl-v-dub").textContent = d ? d[1] : "—";
    var vq = $("pl-v-q");
    vq.textContent = pl.q ? plQNom(pl.q) + " " : "—";
    if (v && v.size) { var em = document.createElement("em"); em.textContent = "· " + plHajm(v.size); vq.appendChild(em); }
    plMeta();
  }

  function plSheet(kind) {
    var x = plTx(), el = $("pl-sheet"), box = $("pl-sh-opts");
    if (!pl.res) { return; }
    if (el.parentNode !== document.body) { document.body.appendChild(el); }
    if (!el.getAttribute("data-on")) {
      el.setAttribute("data-on", "1");
      el.addEventListener("click", function (e) { if (e.target === el) { plSheetClose(); } });
    }
    $("pl-sh-kick").textContent = x[kind === "lang" ? "lang" : kind === "dub" ? "dub" : "q"];
    $("pl-sh-title").textContent = kind === "lang" ? x.chLang : kind === "dub" ? x.chDub : x.chQ;
    var items = [];
    if (kind === "lang") {
      items = ["uz", "ru", "en"].map(function (l) {
        var bor = plHasLang(l), qs = PL_Q.filter(function (q) {
          return l === "uz" ? PL_DUBS.some(function (d) { return plVer("uz", d[0], q[0]); }) : plVer(l, "", q[0]);
        }).map(function (q) { return q[1]; });
        return { key: l, label: PL_LANG[l], sub: bor ? qs.join(" · ") : x.soon, ok: bor, on: l === pl.lang };
      });
    } else if (kind === "dub") {
      items = PL_DUBS.map(function (d) {
        var bor = plHas("uz", d[0]), qs = PL_Q.filter(function (q) { return plVer("uz", d[0], q[0]); }).map(function (q) { return q[1]; });
        return { key: d[0], label: d[1], sub: bor ? qs.join(" · ") : x.soon, ok: bor, on: d[0] === pl.dub };
      });
    } else {
      items = PL_Q.map(function (q) {
        var v = plVer(pl.lang, pl.dub, q[0]), bad = v && pl.bad[v.v];
        return { key: q[0], label: q[1], ok: !!v && !bad, on: q[0] === pl.q,
                 sub: bad ? x.bad : v ? (plCan(v) ? q[2] + (v.size ? " · " + plHajm(v.size) : "") : x.cant) : x.soon };
      });
    }
    box.innerHTML = "";
    items.forEach(function (it) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "pl-opt" + (it.on ? " on" : "");
      b.disabled = !it.ok;
      b.innerHTML = "<span><b></b><small></small></span>" + plSvg(it.ok ? PL_IC.ok : PL_IC.lock);
      b.querySelector("b").textContent = it.label;
      b.querySelector("small").textContent = it.sub;
      if (!it.on && it.ok) { b.querySelector("svg").style.visibility = "hidden"; }
      if (it.ok) {
        b.onclick = function () {
          try { if (tg && tg.HapticFeedback) { tg.HapticFeedback.selectionChanged(); } } catch (e) {}
          plSheetClose();
          if (it.on) { return; }
          if (kind === "lang") {
            pl.lang = it.key;
            if (it.key === "uz" && !plHas("uz", pl.dub)) {
              pl.dub = PL_DUBS.filter(function (d) { return plHas("uz", d[0]); })[0][0];
            }
            pl.q = plPickQ(pl.lang, pl.dub, pl.q);
          } else if (kind === "dub") {
            pl.dub = it.key;
            pl.q = plPickQ("uz", it.key, pl.q);
          } else {
            pl.q = it.key;
          }
          plGo(true);
        };
      }
      box.appendChild(b);
    });
    el.classList.remove("hidden");
    try { if (tg && tg.HapticFeedback) { tg.HapticFeedback.selectionChanged(); } } catch (e) {}
  }

  function plSheetClose() { $("pl-sheet").classList.add("hidden"); }

  /* ---------- KOLLEKSIYA ---------- */

  function plRail() {
    var box = $("pl-rail"), x = plTx();
    $("pl-l-rail").textContent = x.rail;
    box.innerHTML = "";
    MOVIES.concat(MOVIES_FB).forEach(function (m) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "pl-pos" + (m.id === pl.id ? " on" : "");
      var img = document.createElement("img");
      img.alt = "";
      img.loading = "lazy";
      b.appendChild(img);
      imgTry(img, [poster(m.id), "img/" + m.id + "_uz.jpg?v=3"]);
      var s = document.createElement("small");
      s.textContent = m.id === pl.id ? x.now : (m[lang] || m.uz);
      b.appendChild(s);
      b.onclick = function () {
        if (m.id === pl.id) { return; }
        var vid = $("pl-video");
        if (vid.currentTime > 5) { plPosSet(pl.id, vid.currentTime); }
        plOpen(m.id, "my5");
      };
      box.appendChild(b);
    });
    // Hozirgi film ko'rinib tursin (qatorni o'zining ichida suramiz - sahifa qimirlamaydi)
    var on = box.querySelector(".on");
    box.scrollLeft = 0;
    if (on) { box.scrollLeft = Math.max(0, on.getBoundingClientRect().left - box.getBoundingClientRect().left - 18); }
  }

  /* ---------- BOSHQARUV TUGMALARI ---------- */
  /* Ekranga tegilsa ko'rinadi, o'ynayotganda 3 soniyadan keyin yashirinadi; ikki marta tegish - 10 soniya. */
  var plUiT = 0, plTapT = 0, plTapX = 0;
  function plUiKor() {
    var box = $("pl-box"), vid = $("pl-video");
    box.classList.remove("ui-yoq");
    clearTimeout(plUiT);
    if (!vid.paused) { plUiT = setTimeout(function () { if (!vid.paused && pl.drag == null) { box.classList.add("ui-yoq"); } }, 3000); }
  }

  function plPP() {
    var vid = $("pl-video");
    if (!vid.getAttribute("src")) { return; }
    if (vid.paused) { var p = vid.play(); if (p && p["catch"]) { p["catch"](function () {}); } } else { vid.pause(); }
    try { if (tg && tg.HapticFeedback) { tg.HapticFeedback.impactOccurred("light"); } } catch (e) {}
  }

  function plSur(dt, tomon) {
    var vid = $("pl-video");
    if (!vid.duration) { return; }
    vid.currentTime = Math.max(0, Math.min(vid.duration - 1, vid.currentTime + dt));
    if (tomon) {
      var t = $("pl-tap-" + tomon);
      t.classList.remove("on");
      void t.offsetWidth;
      t.classList.add("on");
    }
    plUiKor();
  }

  function plChiz() {
    var vid = $("pl-video"), d = vid.duration || 0, t = pl.drag != null ? pl.drag : vid.currentTime, f = d ? t / d : 0;
    $("pl-fill").style.width = (f * 100) + "%";
    $("pl-knob").style.left = (f * 100) + "%";
    $("pl-cur").textContent = plVaqt(t);
    $("pl-dur").textContent = d ? plVaqt(d) : "0:00";
    var bufer = 0;
    try {
      for (var i = 0; i < vid.buffered.length; i++) {
        if (vid.buffered.start(i) <= vid.currentTime + 1) { bufer = Math.max(bufer, vid.buffered.end(i)); }
      }
    } catch (e) {}
    $("pl-buf").style.width = (d ? Math.min(1, bufer / d) * 100 : 0) + "%";
  }

  function plUiInit() {
    var box = $("pl-box"), vid = $("pl-video"), prog = $("pl-prog");
    $("pl-big").onclick = function (e) { e.stopPropagation(); plPP(); plUiKor(); };
    $("pl-cta").onclick = function () { plPP(); };
    $("pl-rw").onclick = function (e) { e.stopPropagation(); plSur(-10, "l"); };
    $("pl-ff").onclick = function (e) { e.stopPropagation(); plSur(10, "r"); };
    $("pl-gear").onclick = function (e) {
      e.stopPropagation();
      try {
        var fe = document.fullscreenElement || document.webkitFullscreenElement;
        if (fe) { (document.exitFullscreen || document.webkitExitFullscreen).call(document); }
      } catch (er) {}
      plSheet("q");
    };
    $("pl-fs").onclick = function (e) {
      e.stopPropagation();
      try {
        var fe = document.fullscreenElement || document.webkitFullscreenElement;
        if (fe) { (document.exitFullscreen || document.webkitExitFullscreen).call(document); return; }
        if (box.requestFullscreen) { box.requestFullscreen(); }
        else if (box.webkitRequestFullscreen) { box.webkitRequestFullscreen(); }
        else if (vid.webkitEnterFullscreen) { vid.webkitEnterFullscreen(); }        // iPhone: tizimning o'z pleyeri
      } catch (er) {}
    };
    // Bo'sh joyga tegish: tugmalarni ko'rsatadi/yashiradi; tez ikki marta - chap/o'ng chetda 10 soniya
    box.addEventListener("click", function (e) {
      if (e.target.closest(".pl-bar, .pl-topbar, .pl-mid button")) { return; }
      var r = box.getBoundingClientRect(), xx = (e.clientX - r.left) / r.width, now = Date.now();
      var chet = xx < 0.38 ? "l" : xx > 0.62 ? "r" : "";
      if (chet && !box.classList.contains("bosh") && now - plTapT < 320 && Math.abs(xx - plTapX) < 0.25) {
        plTapT = 0;
        plSur(chet === "l" ? -10 : 10, chet);
        return;
      }
      plTapT = now;
      plTapX = xx;
      if (box.classList.contains("ui-yoq")) { plUiKor(); return; }
      if (!vid.paused) { clearTimeout(plUiT); box.classList.add("ui-yoq"); }
    });
    ["play", "pause"].forEach(function (ev) {
      vid.addEventListener(ev, function () {
        if (ev === "play") { box.classList.remove("bosh"); }
        box.classList.toggle("oyn", !vid.paused);
        plUiKor();
        plCta();
      });
    });
    ["timeupdate", "progress", "loadedmetadata", "durationchange"].forEach(function (ev) { vid.addEventListener(ev, plChiz); });
    vid.addEventListener("loadedmetadata", function () { plShakl(); plMeta(); plCta(); });
    function nuqta(e) {
      var r = prog.getBoundingClientRect();
      return Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)) * (vid.duration || 0);
    }
    prog.addEventListener("pointerdown", function (e) {
      if (!vid.duration) { return; }
      e.stopPropagation();
      pl.drag = nuqta(e);
      prog.classList.add("drag");
      try { prog.setPointerCapture(e.pointerId); } catch (er) {}
      plChiz();
      clearTimeout(plUiT);
    });
    prog.addEventListener("pointermove", function (e) { if (pl.drag != null) { pl.drag = nuqta(e); plChiz(); } });
    function qoyib() {
      if (pl.drag == null) { return; }
      vid.currentTime = pl.drag;
      pl.drag = null;
      prog.classList.remove("drag");
      plChiz();
      plUiKor();
    }
    prog.addEventListener("pointerup", qoyib);
    prog.addEventListener("pointercancel", qoyib);
    prog.addEventListener("click", function (e) { e.stopPropagation(); });
    $("pl-rows").addEventListener("click", function (e) {
      var b = e.target.closest(".pl-rowb");
      if (b) { plSheet(b.getAttribute("data-k")); }
    });
  }

  /* Kadr shakli: filmlar kinoteatr formatida (≈2,4:1, masalan 1280x534) - 16:9 oynada tepa-pastda qora chiziq
     qolardi (egasi, 2026-10-17). Film boshlangach oyna videoning o'z shakliga moslashadi; muqova paytida 16:9.
     Juda keng/tor bo'lsa chegaralanadi; keng oynada tugmalar ixchamlashadi (.tor). */
  function plShakl() {
    var vid = $("pl-video"), box = $("pl-box"), w = vid.videoWidth, h = vid.videoHeight;
    if (!w || !h) { return; }
    var r = Math.max(4 / 3, Math.min(2.4, w / h));
    box.style.setProperty("--pl-ar", String(r));
    box.classList.toggle("tor", r > 2);
  }

  /* ---------- NUSXANI QO'YISH ---------- */

  // davom - hozirgi daqiqadan (almashtirish), aks holda saqlangan joydan.
  function plGo(davom) {
    var vid = $("pl-video"), v = plVer(pl.lang, pl.dub, pl.q);
    plRender();
    if (!v) { plMsg(plTx().err); return; }
    if (pl.v === v.v) { return; }
    var t = davom ? (vid.currentTime || pl.t) : plPosGet(pl.id), edi = davom && (!vid.paused || pl.edi);
    pl.edi = false;
    pl.v = v.v;
    plMsg("");
    vid.src = pl.res.base + encodeURIComponent(v.v) + "?k=" + encodeURIComponent(pl.res.key);
    vid.load();
    vid.onloadedmetadata = function () {
      vid.onloadedmetadata = null;
      if (t > 5 && (!vid.duration || t < vid.duration - 5)) {
        try { vid.currentTime = t; } catch (e) {}
      }
    };
    // play() shu bosish ichida chaqiriladi - iPhone boshqacha ruxsat bermaydi
    if (edi) { var p = vid.play(); if (p && p["catch"]) { p["catch"](function () {}); } }
    plCta();
  }

  function plOpen(id, dub) {
    var x = plTx(), vid = $("pl-video"), box = $("pl-box");
    var birinchi = $("scr-pleyer").classList.contains("hidden");
    pl.id = id;
    pl.v = null;
    pl.t = 0;
    pl.bad = {};
    pl.lang = lang;
    pl.dub = dub || "my5";
    pl.q = null;
    pl.drag = null;
    if (birinchi) { pl.scroll = window.scrollY || 0; }
    if (!vid.getAttribute("data-on")) {
      vid.setAttribute("data-on", "1");
      vid.addEventListener("error", plXato);
      vid.addEventListener("waiting", function () { box.classList.add("kut"); });
      // Yuklanish aylanasi: kadr tayyor bo'lsa yoki pauza qilinsa yo'qoladi (pauzada qolib ketardi)
      ["canplay", "seeked", "pause"].forEach(function (ev) { vid.addEventListener(ev, function () { box.classList.remove("kut"); }); });
      vid.addEventListener("playing", function () {
        box.classList.remove("kut");
        plRasmTekshir();
        var xx = plTx(), m = $("pl-msg").textContent;
        if (m === xx.wait || m === xx.err) { plMsg(""); }       // "boshqa sifatga o'tdik" xabari o'z vaqtida yo'qoladi
      });
      vid.addEventListener("timeupdate", function () {
        if (vid.currentTime > 0) { pl.t = vid.currentTime; }
        if (!pl.id || vid.currentTime < 5 || Date.now() - pl.saqT < 5000) { return; }
        pl.saqT = Date.now();
        // Oxirigacha ko'rilgan bo'lsa keyingi safar boshidan
        plPosSet(pl.id, vid.duration && vid.currentTime > vid.duration - 120 ? 0 : vid.currentTime);
      });
      $("pl-back").onclick = function (e) { e.stopPropagation(); plClose(); };
      $("pl-bot").onclick = function () { var f = pl.id; plClose(); play(f); };
      plUiInit();
    }
    // Avvalgi film (kolleksiyadan o'tilganda) to'xtatiladi
    try { vid.pause(); } catch (e) {}
    vid.removeAttribute("src");
    try { vid.load(); } catch (e) {}
    box.classList.add("bosh");
    box.classList.remove("oyn", "ui-yoq", "kut", "tor");
    box.style.removeProperty("--pl-ar");
    $("pl-kick").textContent = plYorliq(id);
    $("pl-title").textContent = qsFilmName(id);
    $("pl-toptt").textContent = qsFilmName(id);
    $("pl-note").textContent = x.note;
    $("pl-bot").setAttribute("aria-label", x.bot);
    $("pl-bot").title = x.bot;
    vid.poster = "img/wide/" + id + "_" + lang + ".jpg";
    $("scr-cat").classList.add("hidden");
    $("scr-pleyer").classList.remove("hidden");
    $("scr-pleyer").classList.add("pl-yuk");
    try { window.scrollTo(0, 0); } catch (e) {}
    // Video surilayotganda ilova pastga tortilib yopilmasin
    try { if (tg && tg.disableVerticalSwipes) { tg.disableVerticalSwipes(); } } catch (e) {}
    pl.res = null;
    plChiz();
    plRender();
    plCta();
    plRail();
    plMsg("");
    plLoad(id, function (res) {
      if (pl.id !== id || $("scr-pleyer").classList.contains("hidden")) { return; }
      $("scr-pleyer").classList.remove("pl-yuk");
      if (!res || !res.ok) { plMsg(plTx().err); return; }
      if (!res.ready) { plMsg(plTx().notReady); return; }
      pl.res = res;
      if (!plHas(pl.lang, pl.dub)) {
        var bor = res.versions[0];
        if (!bor) { plMsg(plTx().soon); plRender(); return; }
        if (pl.lang !== "uz" || !plHas("uz", bor.dub)) { pl.lang = bor.lang; }
        pl.dub = bor.dub || pl.dub;
      }
      pl.q = plPickQ(pl.lang, pl.dub, null);
      plGo(false);
      if (!plCan(plVer(pl.lang, pl.dub, pl.q))) { plNoLang(); }
    });
  }

  // Brauzer nusxani o'ynata olmadi (masalan 10 bitli video Android'da): belgilab, shu til/dublyajdagi
  // boshqa sifatga o'zi o'tadi - o'sha daqiqadan. Boshqasi ham bo'lmasa - xabar.
  function plXato() {
    var vid = $("pl-video");
    if (!vid.getAttribute("src") || !pl.v) { return; }
    pl.bad[pl.v] = 1;
    var eski = pl.q, q = plPickQ(pl.lang, pl.dub, null);
    if (!q) { plRender(); try { vid.pause(); } catch (e) {} plNoLang(); return; }
    pl.q = q;
    pl.edi = true;
    plGo(true);
    var nom = plQNom(q);
    if (eski !== q && nom) {
      plMsg(plTx().alt.replace("%s", nom));
      setTimeout(function () { if ($("pl-msg").textContent.indexOf(nom) > -1) { plMsg(""); } }, 6000);
    }
  }

  function plClose() {
    var vid = $("pl-video");
    if (pl.id && vid.currentTime > 5) { plPosSet(pl.id, vid.currentTime); }
    // Manbani olib tashlaymiz - aks holda brauzer yuklashda davom etadi (server trafigi)
    try { vid.pause(); } catch (e) {}
    vid.removeAttribute("src");
    try { vid.load(); } catch (e) {}
    try {
      var fe = document.fullscreenElement || document.webkitFullscreenElement;
      if (fe) { (document.exitFullscreen || document.webkitExitFullscreen).call(document); }
    } catch (e) {}
    plSheetClose();
    pl.id = null;
    pl.v = null;
    try { if (tg && tg.enableVerticalSwipes) { tg.enableVerticalSwipes(); } } catch (e) {}
    $("scr-pleyer").classList.add("hidden");
    $("scr-pleyer").classList.remove("oyn");
    $("scr-cat").classList.remove("hidden");
    try { window.scrollTo(0, pl.scroll); } catch (e) {}
  }
