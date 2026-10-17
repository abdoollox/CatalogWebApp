/* Ilova ichidagi pleyer (egasi, 2026-10-17) - SINOV: hozircha faqat adminlarga ko'rinadi.
   Bitta film - ichida til, dublyaj va sifat tugma bilan almashadi (16 ta faylni yuklab olish shart emas).
   Fayllar Telegram'da qoladi; server (bot, hppleyer.py) ularni bo'lakma-bo'lak olib shu zahoti uzatadi.
   Kim ko'rishini SERVER hal qiladi: /api/pleyer "yopiq" desa - sifat oynasida tugma chiqmaydi.
   Almashtirganda film o'sha daqiqadan davom etadi; qayerda to'xtagani shu qurilmada eslanadi (hp_pl_pos).
   Kutubxona qismi - zamonaviy uslub (qahramon, sehrli bezak yo'q). */
"use strict";
  var API_PL = "https://bot.tizimshunos.uz/api/pleyer";
  var PL_TX = {
    uz: { kick: "Ilovada ko'rish · sinov", lang: "Til", dub: "Dublyaj", q: "Sifat", soon: "Tez orada",
          watch: "Ilovada ko'rish", test: "Sinov · faqat sizga ko'rinadi",
          note: "Sinov: film Telegram'dan serverimiz orqali keladi. Tilni yoki sifatni almashtirsangiz, o'sha daqiqadan davom etadi.",
          resume: "To'xtagan joyingizdan: ", bot: "Bot chatiga yuklab olish",
          err: "Film ochilmadi. Boshqa sifatni tanlang yoki bot orqali yuklab oling.",
          wait: "Ulanmoqda…", bad: "Ochilmadi", alt: "Bu sifat telefoningizda ochilmadi — %s ga o'tdik.",
          notReady: "Pleyer hali Telegram'ga ulanmagan: botga ilova kaliti berilishi kerak (/pleyer)." },
    ru: { kick: "Смотреть в приложении · тест", lang: "Язык", dub: "Дубляж", q: "Качество", soon: "Скоро",
          watch: "Смотреть в приложении", test: "Тест · видно только вам",
          note: "Тест: фильм идёт из Telegram через наш сервер. Если сменить язык или качество, просмотр продолжится с той же минуты.",
          resume: "С места остановки: ", bot: "Скачать в чат с ботом",
          err: "Фильм не открылся. Выберите другое качество или скачайте через бота.",
          wait: "Подключение…", bad: "Не открылось", alt: "Это качество не открылось на вашем устройстве — переключили на %s.",
          notReady: "Плеер ещё не подключён к Telegram: боту нужен ключ приложения (/pleyer)." },
    en: { kick: "Watch in the app · test", lang: "Language", dub: "Dubbing", q: "Quality", soon: "Coming soon",
          watch: "Watch in the app", test: "Test · only you can see it",
          note: "Test: the film streams from Telegram through our server. Switch the language or quality and it continues from the same minute.",
          resume: "Resuming from ", bot: "Download to the bot chat",
          err: "The film didn't open. Pick another quality or download it via the bot.",
          wait: "Connecting…", bad: "Didn't open", alt: "This quality didn't open on your device — switched to %s.",
          notReady: "The player isn't connected to Telegram yet: the bot needs an app key (/pleyer)." }
  };
  var PL_LANG = { uz: "O'zbekcha", ru: "Русский", en: "English" };
  var PL_Q = [["fhd", "Full HD"], ["hd", "HD"], ["sd", "SD"]];
  var PL_DUBS = [["my5", "MY5 TV"], ["zor", "ZO'R TV"]];
  var PL_BOSH_Q = ["hd", "fhd", "sd"];            // sinovda HD dan boshlanadi - trafik kamroq
  var plInfo = {};                                // film -> {res, t}
  var pl = { id: null, res: null, lang: null, dub: null, q: null, v: null, scroll: 0, saqT: 0, t: 0, bad: {} };

  function plTx() { return PL_TX[lang] || PL_TX.uz; }

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
      b.querySelector("b").textContent = x.watch;
      b.querySelector("small").textContent = x.test;
      b.onclick = function () { qsClose(); plOpen(id, qsDub); };
      b.classList.remove("hidden");
    });
  }

  function plVer(l, d, q) {
    var vs = (pl.res && pl.res.versions) || [];
    for (var i = 0; i < vs.length; i++) {
      var v = vs[i];
      if (v.lang === l && v.q === q && (l !== "uz" || v.dub === d)) { return v; }
    }
    return null;
  }

  function plHas(l, d) { return PL_Q.some(function (q) { return !!plVer(l, d, q[0]); }); }

  // Shu qurilmada ochilmagan nusxa (brauzer o'ynata olmagan) - tanlovda tashlab o'tiladi
  function plOk(l, d, q) { var v = plVer(l, d, q); return !!v && !pl.bad[v.v]; }

  // Tanlangan til/dublyajda eng mos sifat: avvalgisi, bo'lmasa navbat bo'yicha
  function plPickQ(l, d, avval) {
    var tartib = (avval ? [avval] : []).concat(PL_BOSH_Q);
    for (var i = 0; i < tartib.length; i++) { if (plOk(l, d, tartib[i])) { return tartib[i]; } }
    return null;
  }

  function plVaqt(s) {
    s = Math.floor(s || 0);
    var h = Math.floor(s / 3600), m = Math.floor(s % 3600 / 60), c = s % 60;
    return (h ? h + ":" + (m < 10 ? "0" : "") : "") + m + ":" + (c < 10 ? "0" : "") + c;
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

  function plChips(box, items, onPick) {
    box.innerHTML = "";
    items.forEach(function (it) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "pl-chip" + (it.on ? " on" : "");
      b.disabled = !it.ok;
      b.textContent = it.label;
      if (it.sub) {
        var s = document.createElement("small");
        s.textContent = it.sub;
        b.appendChild(s);
      }
      if (it.ok && !it.on) {
        b.onclick = function () {
          try { if (tg && tg.HapticFeedback) { tg.HapticFeedback.selectionChanged(); } } catch (e) {}
          onPick(it.key);
        };
      }
      box.appendChild(b);
    });
  }

  function plRender() {
    var x = plTx();
    $("pl-l-lang").textContent = x.lang;
    $("pl-l-dub").textContent = x.dub;
    $("pl-l-q").textContent = x.q;
    plChips($("pl-lang"), ["uz", "ru", "en"].map(function (l) {
      var bor = l === "uz" ? PL_DUBS.some(function (d) { return plHas("uz", d[0]); }) : plHas(l, "");
      return { key: l, label: PL_LANG[l], on: l === pl.lang, ok: bor, sub: bor ? "" : x.soon };
    }), function (l) {
      pl.lang = l;
      if (l === "uz" && !plHas("uz", pl.dub)) {
        pl.dub = PL_DUBS.filter(function (d) { return plHas("uz", d[0]); })[0][0];
      }
      pl.q = plPickQ(l, pl.dub, pl.q);
      plGo(true);
    });
    var dubBor = pl.lang === "uz";
    $("pl-r-dub").classList.toggle("hidden", !dubBor);
    if (dubBor) {
      plChips($("pl-dub"), PL_DUBS.map(function (d) {
        var bor = plHas("uz", d[0]);
        return { key: d[0], label: d[1], on: d[0] === pl.dub, ok: bor, sub: bor ? "" : x.soon };
      }), function (d) {
        pl.dub = d;
        pl.q = plPickQ("uz", d, pl.q);
        plGo(true);
      });
    }
    plChips($("pl-q"), PL_Q.map(function (q) {
      var v = plVer(pl.lang, pl.dub, q[0]), bad = v && pl.bad[v.v];
      return { key: q[0], label: q[1], on: q[0] === pl.q, ok: !!v && !bad,
               sub: bad ? x.bad : v ? (v.size ? Math.round(v.size / 1048576) + " MB" : "") : x.soon };
    }), function (q) {
      pl.q = q;
      plGo(true);
    });
  }

  // Tanlangan nusxani pleyerga qo'yish. davom - hozirgi daqiqadan (almashtirish), aks holda saqlangan joydan.
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
    if (!davom && t > 30) { $("pl-note").textContent = plTx().resume + plVaqt(t); }
  }

  function plOpen(id, dub) {
    var x = plTx(), vid = $("pl-video");
    pl.id = id;
    pl.v = null;
    pl.t = 0;
    pl.bad = {};
    pl.lang = lang;
    pl.dub = dub || "my5";
    pl.q = null;
    pl.scroll = window.scrollY || 0;
    if (!vid.getAttribute("data-on")) {
      vid.setAttribute("data-on", "1");
      vid.addEventListener("error", plXato);
      vid.addEventListener("waiting", function () { $("pl-box").classList.add("kut"); });
      vid.addEventListener("playing", function () {
        $("pl-box").classList.remove("kut");
        var x = plTx(), m = $("pl-msg").textContent;
        if (m === x.wait || m === x.err) { plMsg(""); }       // "boshqa sifatga o'tdik" xabari o'z vaqtida yo'qoladi
      });
      vid.addEventListener("timeupdate", function () {
        if (vid.currentTime > 0) { pl.t = vid.currentTime; }
        if (!pl.id || vid.currentTime < 5 || Date.now() - pl.saqT < 5000) { return; }
        pl.saqT = Date.now();
        // Oxirigacha ko'rilgan bo'lsa keyingi safar boshidan
        plPosSet(pl.id, vid.duration && vid.currentTime > vid.duration - 120 ? 0 : vid.currentTime);
      });
      $("pl-back").onclick = plClose;
      $("pl-bot").onclick = function () { var f = pl.id; plClose(); play(f); };
    }
    $("pl-kick").textContent = x.kick;
    $("pl-title").textContent = qsFilmName(id);
    $("pl-note").textContent = x.note;
    $("pl-bot").textContent = x.bot;
    vid.poster = "img/hero/" + id + "_" + lang + ".jpg";
    $("scr-cat").classList.add("hidden");
    $("scr-pleyer").classList.remove("hidden");
    try { window.scrollTo(0, 0); } catch (e) {}
    // Video surilayotganda ilova pastga tortilib yopilmasin
    try { if (tg && tg.disableVerticalSwipes) { tg.disableVerticalSwipes(); } } catch (e) {}
    pl.res = null;
    plMsg(x.wait);
    ["pl-lang", "pl-dub", "pl-q"].forEach(function (b) { $(b).innerHTML = ""; });
    plLoad(id, function (res) {
      if (pl.id !== id || $("scr-pleyer").classList.contains("hidden")) { return; }
      if (!res || !res.ok) { plMsg(plTx().err); return; }
      if (!res.ready) { plMsg(plTx().notReady); return; }
      pl.res = res;
      if (!plHas(pl.lang, pl.dub)) {
        var bor = res.versions[0];
        if (!bor) { plMsg(plTx().err); return; }
        if (pl.lang !== "uz" || !plHas("uz", bor.dub)) { pl.lang = bor.lang; }
        pl.dub = bor.dub || pl.dub;
      }
      pl.q = plPickQ(pl.lang, pl.dub, null);
      plGo(false);
    });
  }

  // Brauzer nusxani o'ynata olmadi (masalan 10 bitli video Android'da): belgilab, shu til/dublyajdagi
  // boshqa sifatga o'zi o'tadi - o'sha daqiqadan. Boshqasi ham bo'lmasa - xabar.
  function plXato() {
    var vid = $("pl-video");
    if (!vid.getAttribute("src") || !pl.v) { return; }
    pl.bad[pl.v] = 1;
    var eski = pl.q, q = plPickQ(pl.lang, pl.dub, null);
    if (!q) { plRender(); plMsg(plTx().err); return; }
    pl.q = q;
    pl.edi = true;
    plGo(true);
    var nom = PL_Q.filter(function (x) { return x[0] === q; })[0];
    if (eski !== q && nom) { plMsg(plTx().alt.replace("%s", nom[1])); setTimeout(function () { if ($("pl-msg").textContent.indexOf(nom[1]) > -1) { plMsg(""); } }, 6000); }
  }

  function plClose() {
    var vid = $("pl-video");
    if (pl.id && vid.currentTime > 5) { plPosSet(pl.id, vid.currentTime); }
    // Manbani olib tashlaymiz - aks holda brauzer yuklashda davom etadi (server trafigi)
    try { vid.pause(); } catch (e) {}
    vid.removeAttribute("src");
    try { vid.load(); } catch (e) {}
    pl.id = null;
    pl.v = null;
    try { if (tg && tg.enableVerticalSwipes) { tg.enableVerticalSwipes(); } } catch (e) {}
    $("scr-pleyer").classList.add("hidden");
    $("scr-cat").classList.remove("hidden");
    try { window.scrollTo(0, pl.scroll); } catch (e) {}
  }
