/* Sayohat dvigateli, saralash qalpoqchasi, tayoqcha tanlash
   Ilova kodi bir necha faylga bo'lingan; hammasi BIR umumiy maydonda ishlaydi
   va index.html dagi TARTIBDA yuklanadi. Yuklanish paytida keyingi fayldagi
   narsani chaqirmang - tekshiruv: tools/tartib.js */
"use strict";
  /* ---------- UMUMIY SAYOHAT DVIGATELI ----------
     Saralash, tayoqcha va kelajakdagi patronus/fan uchun
     bitta mexanika: kirish -> savollar -> o'ylanish -> natija.
     Har sayohat o'z konfiguratsiyasini beradi.                        */

  var QUEST = null;
  // Qayta ko'rish: saralangan odam maktubdan yo'lni yana tomosha qiladi. Hech narsa yozilmaydi
  // va o'zgarmaydi - savollar o'tkazib yuboriladi, bor tayoqcha va fakultet ko'rsatiladi.
  var jrQayta = false;
  var qIdx = 0, qScore = null, qPicks = [], qBusy = false, qTimer = null;

  function stopSortTimer() {
    if (qTimer) { clearTimeout(qTimer); qTimer = null; }
    qBusy = false;
  }

  function pickOne(arr) {
    if (!arr || !arr.length) { return ""; }
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function hideSortScreens() {
    $("scr-detail").classList.add("hidden");
    $("scr-prof").classList.add("hidden");
    $("pm").classList.add("hidden");           // profil sahifasidan boshlangan saralash/tayoqcha
    $("scr-cat").classList.add("hidden");
    $("scr-reveal").classList.add("hidden");
    $("scr-hat").classList.add("hidden");
    $("scr-think").classList.add("hidden");
    $("scr-sort").classList.add("hidden");
  }

  // Komiks sahnasi: rasm + (bo'lsa) ostidagi hikoya yozuvi. Uslublar: css "grk-".
  function kmPanel(src, num, text, ong) {
    var f = document.createElement("figure");
    f.className = "grk-p" + (ong ? " grk-r" : "");
    var im = document.createElement("img");
    im.src = src;
    im.alt = "";
    f.appendChild(im);
    var n = document.createElement("span");
    n.className = "grk-n";
    n.textContent = String(num);
    f.appendChild(n);
    if (text) {
      var c = document.createElement("figcaption");
      c.className = "grk-c";
      c.textContent = text;
      f.appendChild(c);
    }
    return f;
  }

  // Sayohatda rasmlar bo'lsa (cfg.pics) kirish ekrani komiks bo'ladi: 1-sahna, tugma, 2-sahna
  function questIntroKm(cfg, v) {
    var km = $("hat-km"), go = $("hat-go");
    var pics = cfg.pics && cfg.pics.intro;
    km.innerHTML = "";
    $("scr-hat").classList.toggle("hat-has-km", !!pics);
    go.classList.remove("hidden");
    if (!pics) { return; }
    [cfg.pics.intro[1], cfg.pics.think, cfg.pics.reveal].forEach(function (u) {
      if (u && typeof u === "string") { try { (new Image()).src = u; } catch (e) {} }
    });
    // 1-sahna yozuvi: sayohat o'zinikini bersa (cap1) o'sha, bo'lmasa ovozning birinchi gapi
    var cap1 = cfg.cap1 ? al(cfg.cap1) : v.introTop;
    var cap2 = (cfg.cap1 ? v.introTop + " " : "") + v.introMid + " " + v.introBot;
    km.appendChild(kmPanel(pics[0], 1, cap1));
    go.classList.add("hidden");
    var b = document.createElement("button");
    b.type = "button";
    b.className = "tr-go grk-go";
    b.textContent = al(cfg.inKey);
    b.onclick = function () {
      try { if (tg && tg.HapticFeedback) { tg.HapticFeedback.impactOccurred("light"); } } catch (e) {}
      km.removeChild(b);
      var f = kmPanel(pics[1], 2, cap2, true);
      km.appendChild(f);
      go.classList.remove("hidden");
      setTimeout(function () {
        try { f.scrollIntoView({ behavior: "smooth", block: "start" }); } catch (e) {}
      }, 60);
    };
    km.appendChild(b);
  }

  // 1-bosqich: tanishuv
  function startQuest(cfg) {
    QUEST = cfg;
    var v = cfg.voice[lang];
    stopSortTimer();
    hideSortScreens();
    if (cfg.mark) { cfg.mark($("hat-mark")); }
    $("hat-top").textContent = v.introTop;
    $("hat-mid").textContent = v.introMid;
    $("hat-bot").textContent = v.introBot;
    $("hat-go").textContent = v.ready;
    questIntroKm(cfg, v);
    $("scr-hat").classList.remove("hidden");
  }

  // 2-bosqich: savollar
  function beginQuestions() {
    if (!QUEST) { return; }
    stopSortTimer();
    qIdx = 0;
    qPicks = [];
    qScore = {};
    // Rasmli sayohat (tayoqcha): savollar alohida ekranda emas, shu lentaning davomida
    if (QUEST.pics) {
      $("hat-go").classList.add("hidden");
      // Qayta ko'rishda (va javobi allaqachon bor bo'lsa) savollar so'ralmaydi
      if (jrQayta && QUEST !== QUEST_PATRONUS && (QUEST === QUEST_HOUSE || wand)) { lentaThink(); return; }
      lentaQ();
      return;
    }
    hideSortScreens();
    $("scr-sort").classList.remove("hidden");
    renderSortQ();
  }

  /* ---------- LENTA: savollar, o'ylanish va natija komiks davomida ----------
     Egasi (2026-10-03): tayoqcha testi do'kon sahnalarining davomi bo'lib kelsin.
     Hammasi #hat-km ichiga pastga qarab qo'shiladi; javob berilgan savol tepada qoladi. */
  function lentaEl(tag, cls, text) {
    var el = document.createElement(tag);
    if (cls) { el.className = cls; }
    if (text != null) { el.textContent = text; }
    return el;
  }

  function lentaShow(el) {
    $("hat-km").appendChild(el);
    setTimeout(function () {
      try { el.scrollIntoView({ behavior: "smooth", block: "start" }); } catch (e) {}
    }, 60);
  }

  function lentaQ() {
    var v = QUEST.voice[lang];
    var text = QUEST.q[qIdx][lang];
    var box = lentaEl("div", "lnt-q");
    box.appendChild(lentaEl("span", "lnt-n", (qIdx + 1) + " / " + QUEST.q.length));
    // Olivander gapining ichida savol bo'lsa, u ikki marta yozilmaydi
    var say = pickOne(v.before[qIdx]);
    var ichida = say.indexOf(text.q) >= 0;
    box.appendChild(lentaEl("p", "lnt-say" + (ichida ? " lnt-big" : ""), say));
    if (!ichida) { box.appendChild(lentaEl("h3", "lnt-t", text.q)); }
    var opts = lentaEl("div", "sort-opts");
    text.a.forEach(function (label, i) {
      var b = lentaEl("button", "sort-opt", label);
      b.type = "button";
      b.onclick = function () { lentaPick(box, opts, b, i); };
      opts.appendChild(b);
    });
    box.appendChild(opts);
    lentaShow(box);
  }

  function lentaPick(box, opts, btn, i) {
    if (qBusy) { return; }
    qBusy = true;
    scoreFor(qIdx, i, 1);
    qPicks.push(i);
    try { if (tg && tg.HapticFeedback) { tg.HapticFeedback.impactOccurred("light"); } } catch (e) {}
    // Tanlangan javob qoladi, qolganlari yo'qoladi
    var all = opts.querySelectorAll(".sort-opt");
    for (var k = 0; k < all.length; k++) {
      all[k].disabled = true;
      if (all[k] !== btn) { all[k].classList.add("hidden"); }
    }
    btn.classList.add("lnt-on");
    box.classList.add("lnt-done");
    var re = lentaEl("p", "lnt-re", pickOne(QUEST.voice[lang].after));
    // Javobni o'zgartirish: shu savolga qaytadi, undan keyingi hamma narsa o'chadi
    var idx = qIdx;
    var ch = lentaEl("button", "lnt-ch", al("lntCh"));
    ch.type = "button";
    ch.onclick = function () { lentaUndo(box, idx); };
    re.appendChild(ch);
    box.appendChild(re);
    qIdx++;
    qTimer = setTimeout(function () {
      qBusy = false;
      if (qIdx < QUEST.q.length) { lentaQ(); } else { lentaThink(); }
    }, 550);
  }

  function lentaUndo(box, idx) {
    if (qBusy) { return; }
    stopSortTimer();
    while (qIdx > idx) {
      qIdx--;
      scoreFor(qIdx, qPicks.pop(), -1);
    }
    var km = $("hat-km");
    while (box.nextSibling) { km.removeChild(box.nextSibling); }
    km.removeChild(box);
    lentaQ();
  }

  // Natija e'lon qilindi - endi javoblar o'zgarmaydi
  function lentaLock() {
    var chs = $("hat-km").querySelectorAll(".lnt-ch");
    for (var k = 0; k < chs.length; k++) { chs[k].parentNode.removeChild(chs[k]); }
  }

  // O'ylanish: ochiq quti sahnasi, tayoqchani odamning o'zi qo'lga oladi
  function lentaThink() {
    // O'ylanish rasmi bo'lmasa (Patronus) - faqat hikoya matni
    var f = QUEST.pics.think ? kmPanel(QUEST.pics.think, 3, QUEST.voice[lang].think.join(" "))
                             : lentaEl("p", "lnt-say lnt-big lnt-wait", QUEST.voice[lang].think.join(" "));
    lentaShow(f);
    var b = lentaEl("button", "tr-go grk-go", al(QUEST.takeKey));
    b.type = "button";
    b.onclick = function () {
      b.parentNode.removeChild(b);
      QUEST.lenta();
    };
    $("hat-km").appendChild(b);
  }

  function scoreFor(idx, opt, sign) {
    var w = QUEST.q[idx].w[opt] || {};
    var mult = QUEST.lastWeight && idx === QUEST.q.length - 1 ? 2 : 1;
    for (var k in w) {
      qScore[k] = (qScore[k] || 0) + sign * w[k] * mult;
    }
  }

  // Sayohatdan chiqish (qalpoqcha ekrani yoki 1-savoldagi "Chiqish")
  function questExit() {
    if (qBusy) { return; }
    hideSortScreens();
    if (journey) { jrQuit(); return; }
    if (leaveSort()) { return; }
    // 9¾ yoki xaritadan kelgan bo'lsa - o'sha yerga qaytadi
    if (worldReturnTo()) { return; }
    openProfile();
  }

  function sortBack() {
    if (qBusy || !QUEST) { return; }
    if (qIdx === 0) { questExit(); return; }
    qIdx--;
    scoreFor(qIdx, qPicks.pop(), -1);
    try { if (tg && tg.HapticFeedback) { tg.HapticFeedback.selectionChanged(); } } catch (e) {}
    renderSortQ();
  }

  function renderSortQ() {
    var t = T[lang];
    var v = QUEST.voice[lang];
    var text = QUEST.q[qIdx][lang];

    $("react-box").classList.add("hidden");
    $("sort-opts").classList.remove("hidden");
    $("hat-say").classList.remove("hidden");
    $("sort-q").classList.remove("hidden");

    var bar = $("sort-bar");
    bar.innerHTML = "";
    for (var i = 0; i < QUEST.q.length; i++) {
      var seg = document.createElement("span");
      if (i <= qIdx) { seg.className = "on"; }
      bar.appendChild(seg);
    }

    $("sort-step").textContent = t.step(qIdx + 1, QUEST.q.length);
    $("sort-back-txt").textContent = qIdx === 0 ? t.sortExit : t.back;
    $("hat-say").textContent = pickOne(v.before[qIdx]);
    $("sort-q").textContent = text.q;
    paintSortPic();

    var box = $("sort-opts");
    box.innerHTML = "";
    text.a.forEach(function (label, i) {
      var b = document.createElement("button");
      b.className = "sort-opt";
      b.textContent = label;
      b.addEventListener("click", function () { answerSort(i); });
      box.appendChild(b);
    });
  }

  // Savolga mos rasm (faqat saralashda bor). Keyingisi oldindan yuklab qo'yiladi.
  function paintSortPic() {
    var wrap = $("sort-pic"), img = $("sort-pic-img");
    var src = QUEST.q[qIdx].img;
    var scr = $("scr-sort");
    if (!src) { wrap.classList.add("hidden"); scr.classList.remove("sq-has-pic"); return; }
    wrap.classList.remove("hidden");
    scr.classList.add("sq-has-pic");
    if (img.getAttribute("src") !== src) {
      img.classList.remove("on");
      img.onload = function () { img.classList.add("on"); };
      img.src = src;
      if (img.complete && img.naturalWidth) { img.classList.add("on"); }
    }
    var next = QUEST.q[qIdx + 1];
    if (next && next.img) { try { (new Image()).src = next.img; } catch (e) {} }
  }

  function answerSort(i) {
    if (qBusy) { return; }
    qBusy = true;

    scoreFor(qIdx, i, 1);
    qPicks.push(i);

    try { if (tg && tg.HapticFeedback) { tg.HapticFeedback.impactOccurred("light"); } } catch (e) {}

    $("hat-say").classList.add("hidden");
    $("sort-q").classList.add("hidden");
    $("sort-opts").classList.add("hidden");
    var line = pickOne(QUEST.voice[lang].after);
    $("react-line").textContent = line;
    $("react-box").classList.remove("hidden");

    qIdx++;
    qTimer = setTimeout(function () {
      qBusy = false;
      if (qIdx < QUEST.q.length) { renderSortQ(); }
      else { runThinking(); }
    }, readMs(line));
  }

  // 3-bosqich: o'ylanish
  function runThinking() {
    var lines = QUEST.voice[lang].think;
    hideSortScreens();
    $("scr-think").classList.remove("hidden");

    var n = 0;
    function step() {
      if (n >= lines.length) { QUEST.finish(); return; }
      var el = $("think-line");
      var line = lines[n];
      el.textContent = line;
      el.className = "think-line";
      try { void el.offsetWidth; } catch (e) {}
      n++;
      qTimer = setTimeout(step, readMs(line));
    }
    step();
  }

  // Berilgan ro'yxatdan eng ko'p ball to'plaganini tanlaydi
  function topOf(keys, tieKey) {
    var best = null, top = -1, tied = [];
    for (var i = 0; i < keys.length; i++) {
      var v = qScore[keys[i]] || 0;
      if (v > top) { top = v; best = keys[i]; tied = [keys[i]]; }
      else if (v === top) { tied.push(keys[i]); }
    }
    if (tied.length > 1 && tieKey && tied.indexOf(tieKey) >= 0) { return tieKey; }
    return best;
  }

  /* ---------- SARALASH ---------- */

  var HOUSE_IDS = ["gryffindor", "slytherin", "ravenclaw", "hufflepuff"];

  var QUEST_HOUSE = {
    id: "house",
    q: SORTING,
    voice: HAT,
    lastWeight: true,
    // Komiks rasmlari: zal va navbat, qalpoq, o'ylanish; natija - fakultetga qarab
    pics: { intro: ["img/yol/gz1.jpg", "img/yol/gz2.jpg"], think: "img/yol/gz3.jpg",
            reveal: { gryffindor: "img/yol/gz-g.jpg", slytherin: "img/yol/gz-s.jpg",
                      ravenclaw: "img/yol/gz-r.jpg", hufflepuff: "img/yol/gz-h.jpg" } },
    cap1: "endS", inKey: "endGo", takeKey: "gzHear",
    mark: paintHat,
    lenta: lentaHouse,
    finish: finishSorting
  };

  function startSorting() { startQuest(QUEST_HOUSE); }

  // Fakultet umrbod bo'lgani uchun tasdiq SAVOLLARDAN OLDIN so'raladi.
  // Yetti savolga javob bergandan keyingi ogohlantirish - ogohlantirish
  // emas, tuzoq. Tayoqcha uchun bu shart emas - u o'zgartirilishi mumkin.
  function confirmSorting() {
    if (QUEST !== QUEST_HOUSE || jrQayta) { beginQuestions(); return; }
    var t = T[lang];

    function go(agreed) {
      if (!agreed) { return; }
      if (!jrPreview) { report("sort_start", "1"); }     // boshlaganlar/tugatganlar nisbati uchun
      beginQuestions();
    }

    testAsk(t.lockAsk, function () { go(true); }, { title: t.lockTitle, ok: t.lockYes, no: t.lockNo });
  }

  function pickHouse() {
    // Tenglikda oxirgi savoldagi tanlov hal qiladi
    var lastPick = qPicks[qPicks.length - 1];
    var lastW = SORTING[SORTING.length - 1].w[lastPick] || {};
    var tie = null;
    for (var k in lastW) { if (lastW[k] === 3) { tie = k; } }
    return topOf(HOUSE_IDS, tie);
  }

  // Lentadagi natija: fakultet bayrami sahnasi, gerb va fakultet nomi
  function lentaHouse() {
    var id = jrQayta ? validHouse(cupMe().house || house) : pickHouse();
    if (jrQayta) { /* faqat ko'rsatiladi */ } else if (jrPreview) { applyHouse(id); } else {
      setHouse(id);
      reportHouse(id);
    }
    var t = T[lang];
    var h = HOUSES[id];
    lentaLock();
    lentaShow(kmPanel(QUEST_HOUSE.pics.reveal[id], 4, ""));
    var r = lentaEl("div", "lnt-rv lnt-house");
    var cr = lentaEl("div", "reveal-crest");
    paintCrest(cr, id, h.crest);
    r.appendChild(cr);
    r.appendChild(lentaEl("span", "reveal-kicker", t.rvKicker));
    r.appendChild(lentaEl("span", "rv-place", HAT[lang].place));
    r.appendChild(lentaEl("span", "reveal-name", h[lang]));
    r.appendChild(lentaEl("span", "reveal-note", ((h["note_" + lang] || "") + (jrQayta ? "" : " " + t.lockFinal)).trim()));
    var b = lentaEl("button", "tr-go grk-go", jrQayta ? al("ltBack") : journey ? al("rvHouse") : t.rvDone);
    b.type = "button";
    b.onclick = function () {
      $("scr-hat").classList.add("hidden");
      $("hat-km").innerHTML = "";
      if (jrQayta) { jrHome(); return; }
      closeReveal();
    };
    r.appendChild(b);
    // Fakultetni ulashish: ismi va fakulteti yozilgan rasm (Stories yoki chatga)
    var ul = lentaEl("button", "lnt-ul", al("uyShare"));
    ul.type = "button";
    ul.onclick = uyShare;
    r.appendChild(ul);
    $("hat-km").appendChild(r);
    try {
      if (tg && tg.HapticFeedback) { tg.HapticFeedback.notificationOccurred("success"); }
    } catch (e) {}
  }

  function finishSorting() {
    var id = pickHouse();
    if (jrPreview) { applyHouse(id); } else {
      setHouse(id);
      reportHouse(id);
    }

    var t = T[lang];
    var h = HOUSES[id];
    paintCrest($("rv-crest"), id, h.crest);
    $("rv-kicker").textContent = t.rvKicker;
    $("rv-place").textContent = HAT[lang].place;
    $("rv-name").textContent = h[lang];
    $("rv-sub").textContent = "";
    $("rv-sub").classList.add("hidden");
    // Uchinchi ogohlantirish nuqtasi: natija e'lon qilingandan keyin.
    // Ohang tantanali, xavotirli emas.
    $("rv-note").textContent = ((h["note_" + lang] || "") + " " + t.lockFinal).trim();
    $("rv-done").textContent = journey ? al("rvHouse") : t.rvDone;

    hideSortScreens();
    $("scr-reveal").classList.remove("hidden");

    try {
      if (tg && tg.HapticFeedback) { tg.HapticFeedback.notificationOccurred("success"); }
    } catch (e) {}
  }

  /* ---------- TAYOQCHA ---------- */

  var CORE_IDS = ["phoenix", "dragon", "unicorn"];
  var WOOD_IDS = ["oak", "yew", "cherry", "holly", "aspen", "walnut"];
  var FLEX_IDS = ["rigid", "springy", "supple", "yielding"];

  var QUEST_WAND = {
    id: "wand",
    q: WANDQ,
    voice: OLLI,
    lastWeight: false,
    // Komiks rasmlari (dizayn tizimidagi uslubda): ko'cha, do'kon ichi, quti, uchqun
    pics: { intro: ["img/yol/ol1.jpg", "img/yol/ol2.jpg"], think: "img/yol/ol3.jpg", reveal: "img/yol/ol4.jpg" },
    inKey: "olIn", takeKey: "olTake",
    mark: paintWandMark,
    lenta: lentaWand,
    finish: finishWand
  };

  function startWand() { startQuest(QUEST_WAND); }

  function paintWandMark(el) {
    drawSvg(el, SVG_SHELF, "hat-mark art art-shelf");
  }

  // Javoblardan tayoqchani aniqlaydi va saqlaydi
  function wandPick() {
    var w = {
      wood: topOf(WOOD_IDS),
      core: topOf(CORE_IDS),
      flex: topOf(FLEX_IDS)
    };
    if (jrPreview) { pv.wand = w; } else {
      setWand(w);
      reportWand(w);
      // Olivanderda tayoqcha 7 galleon turadi (asardagi narx)
      if (walHas("vault") && !walHas("wand")) { walApi("buy", "wand", null); }
    }
    return w;
  }

  // Lentadagi natija: uchqun sochgan tayoqcha sahnasi va tayoqcha tavsifi
  function lentaWand() {
    var w = (jrQayta && wand) ? wand : wandPick();
    var t = T[lang];
    var wd = WOODS[w.wood], cr = CORES[w.core], fl = FLEX[w.flex];
    lentaLock();
    lentaShow(kmPanel(QUEST_WAND.pics.reveal, 4, ""));
    var r = lentaEl("div", "lnt-rv");
    r.appendChild(lentaEl("span", "reveal-kicker", t.wandKicker));
    r.appendChild(lentaEl("span", "rv-place", OLLI[lang].place));
    r.appendChild(lentaEl("span", "reveal-name", wd[lang] + ", " + cr[lang]));
    r.appendChild(lentaEl("span", "reveal-sub", fl.len + " " + t.inch + ", " + fl[lang]));
    r.appendChild(lentaEl("span", "reveal-note", wd["t_" + lang] + ". " + cr["note_" + lang]));
    var b = lentaEl("button", "tr-go grk-go", jrQayta ? al("ltBack") : journey ? al("rvWand") : t.rvDone);
    b.type = "button";
    b.onclick = function () {
      $("scr-hat").classList.add("hidden");
      $("hat-km").innerHTML = "";
      if (jrQayta) { jrHome(); return; }
      closeReveal();
    };
    r.appendChild(b);
    $("hat-km").appendChild(r);
    try {
      if (tg && tg.HapticFeedback) { tg.HapticFeedback.notificationOccurred("success"); }
    } catch (e) {}
  }

  function finishWand() {
    var w = wandPick();

    var t = T[lang];
    var wd = WOODS[w.wood], cr = CORES[w.core], fl = FLEX[w.flex];

    drawSvg($("rv-crest"), SVG_WAND, "reveal-crest art art-wand");
    $("rv-kicker").textContent = t.wandKicker;
    $("rv-place").textContent = OLLI[lang].place;
    $("rv-name").textContent = wd[lang] + ", " + cr[lang];
    $("rv-sub").textContent = fl.len + " " + t.inch + ", " + fl[lang];
    $("rv-sub").classList.remove("hidden");
    $("rv-note").textContent = wd["t_" + lang] + ". " + cr["note_" + lang];
    $("rv-done").textContent = journey ? al("rvWand") : t.rvDone;

    hideSortScreens();
    $("scr-reveal").classList.remove("hidden");

    try {
      if (tg && tg.HapticFeedback) { tg.HapticFeedback.notificationOccurred("success"); }
    } catch (e) {}
  }

  function wandLabel(w, code) {
    if (!w || !WOODS[w.wood] || !CORES[w.core]) { return ""; }
    return WOODS[w.wood][code] + ", " + CORES[w.core][code];
  }

  function closeReveal() {
    $("scr-reveal").classList.add("hidden");
    if (journey) {
      // Tayoqchadan keyin - xiyobonga, saralanishdan keyin - Xogvartsga
      var was = journey;
      journey = null;
      if (was === "house" && endPreview()) { return; }
      // Tayoqcha olingach xat ochiladi: kundalikda belgi qo'yilgani ko'rinadi
      // va keyingi ish ajralib turadi. Saralangach - Xogvartsga.
      // Tayoqcha olingach - maktubga: ro'yxatda belgi qo'yilgani va keyingi ish ko'rinadi
      if (was === "wand" && !hasHouse()) { jrHome(); return; }
      enterWorld();
      return;
    }
    openProfile();
  }

  /* ---------- PATRONUS (egasi, 2026-10-04) ----------
     Faqat saralangan o'quvchiga, FAQAT BIR MARTA, bepul. 15 ta Patronus - asardagi qahramonlarniki.
     Natija serverda (hppatronus.py, /api/patronus) va shu qurilmada saqlanadi.
     Rasmlar img/patronus/<kod>.webp, sahnalar img/yol/pt1..3.jpg. Feniks eng noyobi (~1%). */
  var API_PATRONUS = "https://bot.tizimshunos.uz/api/patronus";
  var PAT_KEY = TK("patronus");
  // Tartib muhim: ball teng bo'lsa ro'yxatda oldin turgani yutadi (feniks faqat aniq ustun bo'lsa)
  var PAT_IDS = ["stag", "cat", "otter", "doe", "boar", "wolf", "lynx", "fox", "goat", "horse",
                 "weasel", "swan", "dog", "hare", "phoenix"];
  var PATRONUS = {
    stag:    { uz: "Bug'u", ru: "Олень", en: "Stag",
               n_uz: "Himoyachi va yetakchi. Yaqinlaringiz xavfda qolsa, birinchi bo'lib oldinga chiqasiz.",
               n_ru: "Защитник и вожак. Когда близким грозит беда, вы первым выходите вперёд.",
               n_en: "A protector and a leader. When those you love are in danger, you step forward first.",
               w_uz: "Garri Potter va otasi Jeymsning Patronusi", w_ru: "Патронус Гарри Поттера и его отца Джеймса", w_en: "The Patronus of Harry Potter and his father James" },
    doe:     { uz: "Ohu", ru: "Лань", en: "Doe",
               n_uz: "Sadoqat va chuqur mehr. Bir marta yaxshi ko'rsangiz — umrbod.",
               n_ru: "Верность и глубокая любовь. Если полюбили — то навсегда.",
               n_en: "Devotion and deep love. Once you love, it is for always.",
               w_uz: "Lili Potter va Severus Sneypning Patronusi", w_ru: "Патронус Лили Поттер и Северуса Снегга", w_en: "The Patronus of Lily Potter and Severus Snape" },
    otter:   { uz: "Suvsar", ru: "Выдра", en: "Otter",
               n_uz: "Zukko, qiziquvchan va quvnoq. Aqlingiz o'tkir, lekin o'ynashni ham unutmaysiz.",
               n_ru: "Умная, любопытная и весёлая. У вас острый ум, но вы не забываете радоваться.",
               n_en: "Clever, curious and playful. Your mind is sharp, yet you never forget to have fun.",
               w_uz: "Germiona Grenjerning Patronusi", w_ru: "Патронус Гермионы Грейнджер", w_en: "The Patronus of Hermione Granger" },
    dog:     { uz: "Teryer it", ru: "Терьер", en: "Terrier",
               n_uz: "Sodiq do'st. Siz bilan kulish ham, qiyin kunda yonma-yon turish ham oson.",
               n_ru: "Верный друг. С вами легко и смеяться, и стоять плечом к плечу в трудный день.",
               n_en: "A loyal friend. With you it is easy both to laugh and to stand together on a hard day.",
               w_uz: "Ron Uizlining Patronusi", w_ru: "Патронус Рона Уизли", w_en: "The Patronus of Ron Weasley" },
    horse:   { uz: "Ot", ru: "Лошадь", en: "Horse",
               n_uz: "Erkin ruh va tinimsiz kuch. Sizni jilovlab bo'lmaydi.",
               n_ru: "Свободный дух и неутомимая сила. Вас не удержать в узде.",
               n_en: "A free spirit and tireless strength. You cannot be reined in.",
               w_uz: "Jinni Uizlining Patronusi", w_ru: "Патронус Джинни Уизли", w_en: "The Patronus of Ginny Weasley" },
    hare:    { uz: "Quyon", ru: "Заяц", en: "Hare",
               n_uz: "Xayolparast va o'ziga xos. Boshqalar ko'rmagan narsani ko'rasiz.",
               n_ru: "Мечтатель, ни на кого не похожий. Вы видите то, чего не замечают другие.",
               n_en: "A dreamer unlike anyone else. You see what others miss.",
               w_uz: "Luna Lavgudning Patronusi", w_ru: "Патронус Полумны Лавгуд", w_en: "The Patronus of Luna Lovegood" },
    swan:    { uz: "Oqqush", ru: "Лебедь", en: "Swan",
               n_uz: "Nafosat va ichki sokinlik. Tashqaridan xotirjam, ichingizda kuchli tuyg'ular.",
               n_ru: "Изящество и внутренний покой. Снаружи вы спокойны, внутри — сильные чувства.",
               n_en: "Grace and inner calm. Serene on the surface, with strong feelings beneath.",
               w_uz: "Cho Changning Patronusi", w_ru: "Патронус Чжоу Чанг", w_en: "The Patronus of Cho Chang" },
    phoenix: { uz: "Feniks", ru: "Феникс", en: "Phoenix",
               n_uz: "Eng noyob Patronus. Donolik va qayta tug'ilish: har yiqilganingizda kuchliroq bo'lib turasiz.",
               n_ru: "Самый редкий Патронус. Мудрость и возрождение: после каждого падения вы встаёте сильнее.",
               n_en: "The rarest Patronus. Wisdom and rebirth: after every fall you rise stronger.",
               w_uz: "Albus Dambldorning Patronusi", w_ru: "Патронус Альбуса Дамблдора", w_en: "The Patronus of Albus Dumbledore" },
    cat:     { uz: "Mushuk", ru: "Кошка", en: "Cat",
               n_uz: "Mustaqil, aniq va talabchan. O'z qadringizni bilasiz va tartibni yaxshi ko'rasiz.",
               n_ru: "Независимая, точная и требовательная. Вы знаете себе цену и любите порядок.",
               n_en: "Independent, precise and exacting. You know your worth and you like order.",
               w_uz: "Professor Makgonagallning Patronusi", w_ru: "Патронус профессора Макгонагалл", w_en: "The Patronus of Professor McGonagall" },
    lynx:    { uz: "Silovsin", ru: "Рысь", en: "Lynx",
               n_uz: "Sokin kuch. Kam gapirasiz, ko'p kuzatasiz va eng kerakli paytda harakat qilasiz.",
               n_ru: "Спокойная сила. Вы мало говорите, много наблюдаете и действуете в нужный миг.",
               n_en: "Quiet strength. You speak little, watch closely and act at exactly the right moment.",
               w_uz: "Kingsli Shaklboltning Patronusi", w_ru: "Патронус Кингсли Бруствера", w_en: "The Patronus of Kingsley Shacklebolt" },
    weasel:  { uz: "Latcha", ru: "Ласка", en: "Weasel",
               n_uz: "Qiziquvchan va mehribon. Uyingiz, oilangiz va kichik ixtirolaringiz — sizning dunyongiz.",
               n_ru: "Любопытная и добрая. Дом, семья и маленькие изобретения — ваш мир.",
               n_en: "Curious and kind. Home, family and small inventions are your world.",
               w_uz: "Artur Uizlining Patronusi", w_ru: "Патронус Артура Уизли", w_en: "The Patronus of Arthur Weasley" },
    wolf:    { uz: "Bo'ri", ru: "Волк", en: "Wolf",
               n_uz: "O'z to'dasi uchun hamma narsaga tayyor. Chidamli, sadoqatli va ichida ko'p narsani olib yuradi.",
               n_ru: "Готов на всё ради своей стаи. Выносливый, преданный и многое носит в себе.",
               n_en: "Ready to do anything for the pack. Enduring, devoted, and carrying a great deal inside.",
               w_uz: "Nimfadora Tonksning Patronusi", w_ru: "Патронус Нимфадоры Тонкс", w_en: "The Patronus of Nymphadora Tonks" },
    goat:    { uz: "Echki", ru: "Козёл", en: "Goat",
               n_uz: "Qaysar va to'g'riso'z. O'z yo'lingizdan yurasiz, kim nima desa ham.",
               n_ru: "Упрямый и прямой. Вы идёте своей дорогой, что бы ни говорили другие.",
               n_en: "Stubborn and plain-spoken. You go your own way, whatever anyone says.",
               w_uz: "Aberfort Dambldorning Patronusi", w_ru: "Патронус Аберфорта Дамблдора", w_en: "The Patronus of Aberforth Dumbledore" },
    fox:     { uz: "Tulki", ru: "Лис", en: "Fox",
               n_uz: "Epchil va hozirjavob. Har qanday vaziyatdan chiqish yo'lini topasiz.",
               n_ru: "Ловкий и находчивый. Вы найдёте выход из любой ситуации.",
               n_en: "Quick and resourceful. You find a way out of any situation.",
               w_uz: "Sheymus Finniganning Patronusi", w_ru: "Патронус Симуса Финнигана", w_en: "The Patronus of Seamus Finnigan" },
    boar:    { uz: "To'ng'iz", ru: "Вепрь", en: "Boar",
               n_uz: "Jasur va mehnatkash. Boshlagan ishingizni oxiriga yetkazmaguncha to'xtamaysiz.",
               n_ru: "Смелый и трудолюбивый. Вы не остановитесь, пока не доведёте дело до конца.",
               n_en: "Brave and hard-working. You do not stop until the job is done.",
               w_uz: "Erni Makmillanning Patronusi", w_ru: "Патронус Эрни Макмиллана", w_en: "The Patronus of Ernie Macmillan" }
  };

  var PATQ = [
    { w: [{ doe: 2, weasel: 2, dog: 1 }, { boar: 2, stag: 2, cat: 1 }, { otter: 2, dog: 2, fox: 1 }, { swan: 2, lynx: 1, hare: 2 }],
      uz: { q: "Eng baxtli xotirangiz qaysi?", a: ["Oilam bilan o'tgan oddiy bir kecha", "Qiyin ishni uddalagan kunim", "Do'stlar bilan to'yib kulgan payt", "Yolg'iz, tabiat qo'ynidagi sokin lahza"] },
      ru: { q: "Какое ваше самое счастливое воспоминание?", a: ["Обычный вечер с семьёй", "День, когда я справился с трудным делом", "Когда мы с друзьями смеялись до слёз", "Тихая минута наедине с природой"] },
      en: { q: "What is your happiest memory?", a: ["An ordinary evening with my family", "The day I pulled off something hard", "Laughing with friends until it hurt", "A quiet moment alone in nature"] } },
    { w: [{ stag: 2, wolf: 2, boar: 1 }, { lynx: 2, cat: 2, fox: 1 }, { doe: 2, dog: 1, swan: 1 }, { hare: 2, goat: 1, otter: 1, phoenix: 1 }],
      uz: { q: "Sovuq tuman yaqinlashmoqda. Birinchi nima qilasiz?", a: ["Oldinga chiqib, boshqalarni to'saman", "Sovuqqonlik bilan kuzataman, payt poylayman", "Yonimdagining qo'lidan ushlayman", "Hech kim kutmagan ish qilaman"] },
      ru: { q: "Надвигается холодный туман. Что вы сделаете первым делом?", a: ["Выйду вперёд и заслоню других", "Хладнокровно понаблюдаю и выберу момент", "Возьму за руку того, кто рядом", "Сделаю то, чего никто не ждёт"] },
      en: { q: "A cold mist is closing in. What do you do first?", a: ["Step forward and shield the others", "Watch calmly and wait for my moment", "Take the hand of whoever is beside me", "Do something nobody expects"] } },
    { w: [{ dog: 2, wolf: 1, doe: 1 }, { otter: 2, weasel: 1 }, { goat: 2, cat: 2, boar: 1 }, { hare: 2, fox: 1, phoenix: 1, lynx: 1 }],
      uz: { q: "Do'stlaringiz sizni nima uchun qadrlaydi?", a: ["Doim yonlarida turaman", "Ularni kuldiraman", "Yoqmasa ham to'g'risini aytaman", "Ular ko'rmagan narsani ko'raman"] },
      ru: { q: "За что вас ценят друзья?", a: ["Я всегда рядом", "Я умею их рассмешить", "Говорю правду, даже неприятную", "Замечаю то, чего не видят они"] },
      en: { q: "What do your friends value you for?", a: ["I am always there for them", "I make them laugh", "I tell the truth even when it stings", "I notice what they do not"] } },
    { w: [{ horse: 2, stag: 1 }, { cat: 1, otter: 1, fox: 1, lynx: 1 }, { weasel: 2, goat: 1, boar: 1 }, { swan: 2, otter: 1, doe: 1 }],
      uz: { q: "Bo'sh kuningiz. Qayerdasiz?", a: ["Ochiq dalada, shamolda", "Kitob yoki jumboq bilan", "Uyda, nimadir yasab-tuzatib", "Suv bo'yida"] },
      ru: { q: "У вас свободный день. Где вы?", a: ["В чистом поле, на ветру", "С книгой или головоломкой", "Дома, что-то мастерю", "У воды"] },
      en: { q: "You have a free day. Where are you?", a: ["Out in the open, in the wind", "With a book or a puzzle", "At home, making or fixing something", "By the water"] } },
    { w: [{ wolf: 2, stag: 1, doe: 1 }, { boar: 1, goat: 1, phoenix: 1, stag: 1 }, { horse: 2, fox: 1, cat: 1 }, { hare: 1, swan: 1, lynx: 1, wolf: 1 }],
      uz: { q: "Sizni nima eng ko'p og'ritadi?", a: ["Yaqinlarimga zarar yetishi", "Adolatsizlik", "Erkinligimning cheklanishi", "Tushunilmay qolish"] },
      ru: { q: "Что ранит вас сильнее всего?", a: ["Когда страдают мои близкие", "Несправедливость", "Когда ограничивают мою свободу", "Когда меня не понимают"] },
      en: { q: "What hurts you the most?", a: ["Harm coming to those I love", "Injustice", "Having my freedom taken away", "Not being understood"] } },
    { w: [{ boar: 1, stag: 1, phoenix: 1, goat: 1 }, { fox: 2, hare: 1, horse: 1 }, { dog: 2, weasel: 1, wolf: 1 }, { lynx: 1, swan: 1, cat: 1 }],
      uz: { q: "Qorong'i o'rmonda yo'l ikkiga ayrildi. Qaysi biridan yurasiz?", a: ["Qiyin, lekin to'g'ri yo'ldan", "Hech kim yurmagan so'qmoqdan", "Hamrohlarim tanlaganidan", "Avval to'xtab, tinglayman"] },
      ru: { q: "В тёмном лесу дорога раздваивается. Куда вы пойдёте?", a: ["По трудной, но верной", "По тропе, где никто не ходил", "Туда, куда решат мои спутники", "Сначала остановлюсь и прислушаюсь"] },
      en: { q: "In a dark forest the path splits in two. Which way do you go?", a: ["The hard but right one", "The trail nobody has walked", "Wherever my companions choose", "First I stop and listen"] } },
    { w: [{ stag: 1, boar: 1, wolf: 1, horse: 1 }, { doe: 1, dog: 1, lynx: 1, swan: 1 }, { otter: 1, hare: 1, weasel: 1, fox: 1 }, { phoenix: 2, horse: 1, cat: 1, goat: 1 }],
      uz: { q: "Patronusingiz paydo bo'ldi. U nima qiladi?", a: ["Zulmatga qarab tashlanadi", "Atrofimda aylanib, meni qo'riqlaydi", "O'ynoqilab sakrab yuradi", "Yuqoriga ko'tarilib, hamma yoqni yoritadi"] },
      ru: { q: "Ваш Патронус появился. Что он делает?", a: ["Бросается на тьму", "Кружит рядом и охраняет меня", "Резвится и прыгает", "Взмывает вверх и освещает всё вокруг"] },
      en: { q: "Your Patronus appears. What does it do?", a: ["Charges at the darkness", "Circles around me, keeping guard", "Leaps about playfully", "Soars upward and lights up everything"] } }
  ];

  var LUPIN = {
    uz: { introTop: "Qorong'ilikka qarshi himoya darsi. Kechki soat, sinfda faqat siz va professor Lyupin.",
          introMid: "«Bugun eng qiyin afsunni o'rganamiz», deydi u.",
          introBot: "Patronus — ichingizdagi eng yorug' narsadan yasalgan himoyachi. Uning qanday qiyofada chiqishini hech kim oldindan bilmaydi. Professor sizni qora ko'l bo'yiga olib chiqadi: «Haqiqiy sinov shu yerda».",
          ready: "Tayyorman",
          before: [["Patronus baxtli xotiradan tug'iladi. Shundan boshlaymiz."], ["Endi tasavvur qiling."], ["O'zingiz haqingizda to'g'risini ayting."],
                   ["Dam olayotgan paytingizni eslang."], ["Bu savol oson emas, lekin kerak."], ["Yana bir oz qoldi."], ["Oxirgi savol."]],
          after: ["Yaxshi.", "Tushunarli.", "Shunday deng…", "Davom etamiz.", "Juda yaxshi.", "Eslab qoling buni."],
          think: ["Tuman ichidan soyalar yaqinlashmoqda, havo muzlab boryapti.", "Eng baxtli xotirangizni mahkam ushlang va tayoqchani ko'taring…"],
          place: "Sizning Patronusingiz —" },
    ru: { introTop: "Урок защиты от Тёмных искусств. Поздний вечер, в классе только вы и профессор Люпин.",
          introMid: "«Сегодня мы изучим самое трудное заклинание», — говорит он.",
          introBot: "Патронус — защитник, созданный из самого светлого, что есть в вас. Никто не знает заранее, какой облик он примет. Профессор выводит вас на берег чёрного озера: «Настоящее испытание — здесь».",
          ready: "Я готов",
          before: [["Патронус рождается из счастливого воспоминания. С него и начнём."], ["Теперь представьте."], ["Скажите о себе честно."],
                   ["Вспомните, как вы отдыхаете."], ["Вопрос непростой, но нужный."], ["Осталось совсем немного."], ["Последний вопрос."]],
          after: ["Хорошо.", "Понятно.", "Вот как…", "Продолжим.", "Очень хорошо.", "Запомните это."],
          think: ["Из тумана приближаются тени, воздух леденеет.", "Крепко держитесь за самое счастливое воспоминание и поднимите палочку…"],
          place: "Ваш Патронус —" },
    en: { introTop: "Defence Against the Dark Arts. Late evening, only you and Professor Lupin in the classroom.",
          introMid: "“Tonight we learn the hardest charm of all,” he says.",
          introBot: "A Patronus is a guardian made of the brightest thing inside you. Nobody knows beforehand what shape it will take. The professor leads you out to the shore of the black lake: \u201CThe real test is here.\u201D",
          ready: "I am ready",
          before: [["A Patronus is born from a happy memory. Let us start there."], ["Now imagine."], ["Tell me honestly about yourself."],
                   ["Think of how you rest."], ["Not an easy question, but a needed one."], ["Only a little more."], ["The last question."]],
          after: ["Good.", "I see.", "Is that so…", "Let us go on.", "Very good.", "Remember that."],
          think: ["Shadows are drifting closer through the mist, and the air is turning to ice.", "Hold on tight to your happiest memory and raise your wand…"],
          place: "Your Patronus is" }
  };

  var PAT_TX = {
    uz: { lbl: "Patronus", kick: "Ekspekto Patronum", cta: "Patronus testidan o'tish", none: "Hali chaqirilmagan",
          noneS: "Professor Lyupin sizga eng qiyin afsunni o'rgatadi", hubT: "Patronusingizni chaqiring", hubS: "7 ta savol · faqat bir marta",
          askT: "Patronus bir marta chaqiriladi", ask: "Natijani keyin o'zgartirib bo'lmaydi. Savollarga shoshilmasdan, o'zingiz haqingizda rostini ayting.",
          yes: "Boshlash", no: "Keyinroq", done: "Profilga o'tish", share: "Patronusimni ulashish", once: "Patronus o'zgarmaydi — u endi doim siz bilan." },
    ru: { lbl: "Патронус", kick: "Экспекто Патронум", cta: "Пройти тест на Патронуса", none: "Ещё не вызван",
          noneS: "Профессор Люпин научит вас самому трудному заклинанию", hubT: "Вызовите своего Патронуса", hubS: "7 вопросов · только один раз",
          askT: "Патронуса вызывают один раз", ask: "Результат потом нельзя изменить. Отвечайте не спеша и честно.",
          yes: "Начать", no: "Позже", done: "Перейти в профиль", share: "Поделиться Патронусом", once: "Патронус не меняется — теперь он всегда с вами." },
    en: { lbl: "Patronus", kick: "Expecto Patronum", cta: "Take the Patronus test", none: "Not summoned yet",
          noneS: "Professor Lupin will teach you the hardest charm of all", hubT: "Summon your Patronus", hubS: "7 questions · only once",
          askT: "A Patronus is summoned once", ask: "The result cannot be changed later. Take your time and answer honestly.",
          yes: "Begin", no: "Later", done: "Go to profile", share: "Share my Patronus", once: "A Patronus never changes — it is with you for good now." }
  };

  var patronus = null;
  try { patronus = window.localStorage.getItem(PAT_KEY); } catch (e) {}
  if (!PATRONUS[patronus]) { patronus = null; }

  function patX() { return PAT_TX[lang] || PAT_TX.uz; }
  function patImg(code) { return IMG_DIR + "patronus/" + code + ".webp"; }

  function patSet(code) {
    if (!PATRONUS[code]) { return; }
    patronus = code;
    try { window.localStorage.setItem(PAT_KEY, code); } catch (e) {}
  }

  // Serverdagi qiymat asosiy: boshqa qurilmada olingan bo'lsa shu yerga ham keladi
  function patApi(body, done) {
    var init = "";
    try { init = (tg && tg.initData) || ""; } catch (e) {}
    if (!init || !window.fetch) { return; }
    window.fetch(API_PATRONUS, { method: "POST", headers: { "Content-Type": "application/json", "X-Telegram-Init-Data": init },
                                 body: JSON.stringify(body || {}) })
      .then(function (r) { return r.json(); })
      .then(function (res) { if (res && res.ok && done) { done(res); } })["catch"](function () {});
  }

  var patAsked = false;
  function patLoad() {
    if (patAsked) { return; }
    patAsked = true;
    patApi({}, function (res) {
      if (res.code && res.code !== patronus) { patSet(res.code); patPaint(); }
      // Shu qurilmada olingan, lekin serverga yetmagan bo'lsa - qayta yuboramiz
      else if (!res.code && patronus) { patApi({ code: patronus }, function () {}); }
    });
  }

  function patCan() { return !!validHouse(cupMe().house || house) && !patronus; }

  var QUEST_PATRONUS = {
    id: "patronus",
    q: PATQ,
    voice: LUPIN,
    lastWeight: false,
    // Sinf, ko'l bo'yi; o'ylanishda rasm yo'q (faqat matn), natijada kumush nur sahnasi
    pics: { intro: ["img/yol/pt1.jpg", "img/yol/pt2.jpg"], think: null, reveal: "img/yol/pt3.jpg" },
    inKey: "ptIn", takeKey: "ptTake",
    lenta: lentaPatronus
  };

  function startPatronus() {
    if (!patCan()) { return; }
    var x = patX();
    testAsk(x.ask, function () {
      $("scr-hub").classList.add("hidden");
      startQuest(QUEST_PATRONUS);
      try { window.scrollTo(0, 0); } catch (e) {}
    }, { title: x.askT, ok: x.yes, no: x.no });
  }

  // Lentadagi natija: kumush nur sahnasi, Patronus rasmi, ta'rifi va kimniki ekani
  function lentaPatronus() {
    var id = topOf(PAT_IDS);
    patSet(id);
    patApi({ code: id }, function (res) {
      // Server boshqasini qaytarsa (avval boshqa qurilmada olingan) - o'sha qoladi
      if (res.code && res.code !== patronus) { patSet(res.code); patPaint(); }
    });
    var x = patX(), p = PATRONUS[id];
    lentaLock();
    lentaShow(kmPanel(QUEST_PATRONUS.pics.reveal, 4, ""));
    var r = lentaEl("div", "lnt-rv pat-rv");
    var im = document.createElement("img");
    im.className = "pat-big"; im.alt = ""; im.src = patImg(id);
    r.appendChild(im);
    r.appendChild(lentaEl("span", "reveal-kicker", x.kick));
    r.appendChild(lentaEl("span", "rv-place", LUPIN[lang].place));
    r.appendChild(lentaEl("span", "reveal-name", p[lang]));
    r.appendChild(lentaEl("span", "reveal-note", p["n_" + lang]));
    r.appendChild(lentaEl("span", "pat-who", p["w_" + lang]));
    r.appendChild(lentaEl("span", "pat-once", x.once));
    var b = lentaEl("button", "tr-go grk-go", x.done);
    b.type = "button";
    b.onclick = function () {
      $("scr-hat").classList.add("hidden");
      $("hat-km").innerHTML = "";
      try { nshLoad(true); } catch (e) {}        // "Patronus egasi" nishoni
      pmOpen();
    };
    r.appendChild(b);
    var ul = lentaEl("button", "lnt-ul", x.share);
    ul.type = "button";
    ul.onclick = patShare;
    r.appendChild(ul);
    $("hat-km").appendChild(r);
    try { if (tg && tg.HapticFeedback) { tg.HapticFeedback.notificationOccurred("success"); } } catch (e) {}
  }

  // Ulashish: ismi va Patronusi yozilgan rasm (Stories yoki chatga) - fakultet ulashish kabi
  var patBand = false, patBor = null;
  function patShare() {
    if (patBand) { return; }
    var d = "";
    try { d = (tg && tg.initData) || ""; } catch (e) {}
    if (!d || !window.fetch) { showToast(al("shareErr"), "err"); return; }
    if (patBor && patBor.lang === lang) { rasmUlash(patBor, al("ptTake"), patX().lbl); return; }
    patBand = true;
    var kut = showToast(al("uyWait"));
    window.fetch(API_PATRONUS + "/share", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Telegram-Init-Data": d },
      body: JSON.stringify({ lang: lang })
    }).then(function (r) { return r.json(); })
      .then(function (res) {
        patBand = false;
        dismissNote(kut);
        if (!(res && res.ok && res.url)) { showToast(al("shareErr"), "err"); return; }
        res.lang = lang;
        patBor = res;
        rasmUlash(res, al("ptTake"), patX().lbl);
      })["catch"](function () { patBand = false; dismissNote(kut); showToast(al("shareErr"), "err"); });
  }

  // Profildagi panel va Xogvarts bosh sahifasidagi taklif kartasi
  function patPaint() {
    var x = patX(), bor = !!validHouse(cupMe().house || house);
    var panel = $("pat-panel");
    if (panel) {
      panel.classList.toggle("hidden", !bor);
      $("pat-label").textContent = x.lbl;
      var p = patronus && PATRONUS[patronus];
      $("pat-img").src = patImg(p ? patronus : "mist");
      $("pat-img").classList.toggle("off", !p);
      $("pat-name").textContent = p ? p[lang] : x.none;
      $("pat-note").textContent = p ? p["n_" + lang] : x.noneS;
      $("pat-who").textContent = p ? p["w_" + lang] : "";
      $("pat-who").classList.toggle("hidden", !p);
      $("pat-cta").textContent = x.cta;
      $("pat-cta").classList.toggle("hidden", !!p);
      $("pat-cta").onclick = startPatronus;
      $("pat-share").textContent = x.share;
      $("pat-share").classList.toggle("hidden", !p);
      $("pat-share").onclick = patShare;
    }
    var grid = $("hub-grid");
    if (!grid) { return; }
    var card = $("hub-pat");
    if (!patCan()) { if (card) { card.classList.add("hidden"); } return; }
    if (!card) {
      card = document.createElement("button");
      card.type = "button";
      card.id = "hub-pat";
      card.className = "hub-pat";
      card.innerHTML = '<img alt=""><span><b></b><small></small></span><i>›</i>';
      card.onclick = startPatronus;
      grid.parentNode.insertBefore(card, grid.nextSibling);
    }
    card.classList.remove("hidden");
    card.querySelector("img").src = patImg("mist");
    card.querySelector("b").textContent = x.hubT;
    card.querySelector("small").textContent = x.hubS;
  }
