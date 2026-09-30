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
      // Birinchi kirish: katta karta. Belgi darhol qo'yiladi — shu seansda karta
      // katta qoladi, keyingi kirishda esa ixcham qator bo'lib chiqadi.
      var seen = false;
      try { seen = window.localStorage.getItem(TK("hp_srl_seen")) === "1"; } catch (e) {}
      try { window.localStorage.setItem(TK("hp_srl_seen"), "1"); } catch (e) {}
      srlSetMini(seen);
      box.addEventListener("click", function () { srlSetMini(!srlMini); });
    }
    box.classList.remove("hidden");
    srlTick();
    if (!srlTimer && SRL_AT > Date.now()) { srlTimer = setInterval(srlTick, 1000); }
  }

  function renderCatalog() {
    var t = T[lang];
    $("cat-kicker").textContent = t.title;
    $("cat-title").textContent = LIB_TITLE[lang];
    $("lang-badge").textContent = flagOf(lang) + " " + lang.toUpperCase();
    renderHero(t);
    renderSerial();
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

  function renderWorldBtn() {
    var btn = $("world-btn");
    if (!btn) { return; }
    var stage = letterStage();
    var isLetter = stage !== "world";
    $("coin-934").classList.toggle("hidden", isLetter);
    $("coin-lt").classList.toggle("hidden", !isLetter);
    btn.classList.toggle("yangi", stage === "new");
    btn.setAttribute("aria-label", isLetter ? al("letterAria") : "9¾");
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
    renderCupStrip();
    maybeAutoSort();
    maybeChessLink();
    maybeWorldLink();
    msMaybeOst();
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
      { label: t.ckPatronus, state: "soon" },
      { label: t.ckPet,      state: "soon" }
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
