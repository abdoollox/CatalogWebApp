/* Sayohat dvigateli, saralash qalpoqchasi, tayoqcha tanlash
   Ilova kodi bir necha faylga bo'lingan; hammasi BIR umumiy maydonda ishlaydi
   va index.html dagi TARTIBDA yuklanadi. Yuklanish paytida keyingi fayldagi
   narsani chaqirmang - tekshiruv: tools/tartib.js */
"use strict";
  /* ---------- UMUMIY SAYOHAT DVIGATELI ----------
     Saralash, tayoqcha va kelajakdagi patronus/hayvon/fan uchun
     bitta mexanika: kirish -> savollar -> o'ylanish -> natija.
     Har sayohat o'z konfiguratsiyasini beradi.                        */

  var QUEST = null;
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
    $("scr-hat").classList.remove("hidden");
  }

  // 2-bosqich: savollar
  function beginQuestions() {
    if (!QUEST) { return; }
    stopSortTimer();
    qIdx = 0;
    qPicks = [];
    qScore = {};
    hideSortScreens();
    $("scr-sort").classList.remove("hidden");
    renderSortQ();
  }

  function scoreFor(idx, opt, sign) {
    var w = QUEST.q[idx].w[opt] || {};
    var mult = QUEST.lastWeight && idx === QUEST.q.length - 1 ? 2 : 1;
    for (var k in w) {
      qScore[k] = (qScore[k] || 0) + sign * w[k] * mult;
    }
  }

  function sortBack() {
    if (qBusy || !QUEST) { return; }
    if (qIdx === 0) {
      hideSortScreens();
      if (journey) { jrQuit(); return; }
      if (leaveSort()) { return; }
      openProfile();
      return;
    }
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
    mark: paintHat,
    finish: finishSorting
  };

  function startSorting() { startQuest(QUEST_HOUSE); }

  // Fakultet umrbod bo'lgani uchun tasdiq SAVOLLARDAN OLDIN so'raladi.
  // Yetti savolga javob bergandan keyingi ogohlantirish - ogohlantirish
  // emas, tuzoq. Tayoqcha uchun bu shart emas - u o'zgartirilishi mumkin.
  function confirmSorting() {
    if (QUEST !== QUEST_HOUSE) { beginQuestions(); return; }
    var t = T[lang];

    function go(agreed) {
      if (!agreed) { return; }
      if (!jrPreview) { report("sort_start", "1"); }     // boshlaganlar/tugatganlar nisbati uchun
      beginQuestions();
    }

    try {
      if (tg && tg.showPopup) {
        tg.showPopup({
          title: t.lockTitle,
          message: t.lockAsk,
          buttons: [
            { id: "go", type: "default", text: t.lockYes },
            { id: "no", type: "cancel", text: t.lockNo }
          ]
        }, function (id) { go(id === "go"); });
        return;
      }
      if (tg && tg.showConfirm) {
        tg.showConfirm(t.lockAsk, go);
        return;
      }
    } catch (e) {}
    go(window.confirm ? window.confirm(t.lockAsk) : true);
  }

  function pickHouse() {
    // Tenglikda oxirgi savoldagi tanlov hal qiladi
    var lastPick = qPicks[qPicks.length - 1];
    var lastW = SORTING[SORTING.length - 1].w[lastPick] || {};
    var tie = null;
    for (var k in lastW) { if (lastW[k] === 3) { tie = k; } }
    return topOf(HOUSE_IDS, tie);
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
    mark: paintWandMark,
    finish: finishWand
  };

  function startWand() { startQuest(QUEST_WAND); }

  function paintWandMark(el) {
    drawSvg(el, SVG_SHELF, "hat-mark art art-shelf");
  }

  function finishWand() {
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
      if (was === "wand" && !hasHouse()) {
        jrHideAll();
        $("scr-cat").classList.remove("hidden");
        renderCatalog();
        openLetter(false);
        return;
      }
      enterWorld();
      return;
    }
    openProfile();
  }
