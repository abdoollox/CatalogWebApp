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
      if (jrQayta && (QUEST === QUEST_HOUSE || wand)) { lentaThink(); return; }
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
    var f = kmPanel(QUEST.pics.think, 3, QUEST.voice[lang].think.join(" "));
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
