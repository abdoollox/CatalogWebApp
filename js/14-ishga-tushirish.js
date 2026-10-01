/* Ishga tushirish (oxirgi bo'lib yuklanadi)
   Ilova kodi bir necha faylga bo'lingan; hammasi BIR umumiy maydonda ishlaydi
   va index.html dagi TARTIBDA yuklanadi. Yuklanish paytida keyingi fayldagi
   narsani chaqirmang - tekshiruv: tools/tartib.js */
"use strict";
  /* ---------- ISHGA TUSHIRISH ---------- */

  function init() {
    preloadCrests();
    initBack();
    renderLangs();
    $("back-btn").addEventListener("click", goBack);
    $("world-btn").addEventListener("click", goWorld);
    $("al-back").addEventListener("click", leaveAlley);
    $("al-letter-btn").addEventListener("click", function () { openLetter(true); });
    $("tr-back").addEventListener("click", openAlley);
    $("lt-later").addEventListener("click", jrLetterCancel);
    $("lt").addEventListener("click", function (ev) {
      if (ev.target !== $("lt")) { return; }
      if ($("lt-later").classList.contains("hidden")) { closeLetter(); } else { jrLetterCancel(); }
    });
    $("hub-set-pv").addEventListener("click", testStart);
    $("lt-share").addEventListener("click", ltShare);
    $("gr-back").addEventListener("click", function () { grStop(); openAlley(); });
    $("tk-back").addEventListener("click", openAlley);
    setTimeout(gatePreload, 1500);
    $("hub-back").addEventListener("click", leaveHub);
    $("hub-me").addEventListener("click", hubGo(openProfile));
    $("hub-cup").addEventListener("click", hubGo(openCup));
    $("hub-sort").addEventListener("click", hubGo(startSorting));
    $("hub-wand").addEventListener("click", hubGo(function () { if (wand) { openProfile(); } else { startWand(); } }));
    $("hub-gear").addEventListener("click", function () {
      renderHubSettings();
      // Ekran kirish harakatida (transform) "fixed" oyna ekranga emas, butun sahifaga yopishib qoladi -
      // past qismi ko'rinmay qolardi. Shuning uchun oyna to'g'ridan-to'g'ri body ichida turadi.
      if ($("hub-set").parentNode !== document.body) { document.body.appendChild($("hub-set")); }
      $("hub-set").classList.remove("hidden");
    });
    $("hub-set-lib").addEventListener("click", function () { saveStart("lib"); renderHubSettings(); });
    $("hub-set-hub").addEventListener("click", function () { saveStart("world"); renderHubSettings(); });
    $("hub-set-close").addEventListener("click", function () { $("hub-set").classList.add("hidden"); });
    $("hub-set").addEventListener("click", function (ev) { if (ev.target === $("hub-set")) { $("hub-set").classList.add("hidden"); } });
    $("w-set-lib").addEventListener("click", function () { setStart("lib"); });
    $("w-set-map").addEventListener("click", function () { setStart("world"); });
    $("w-set-close").addEventListener("click", function () { $("w-set").classList.add("hidden"); });
    $("w-set").addEventListener("click", function (ev) {
      if (ev.target === $("w-set")) { $("w-set").classList.add("hidden"); }
    });
    $("prof-back").addEventListener("click", worldGuard(closeProfile));
    $("sort-cta").addEventListener("click", startSorting);
    $("wand-cta").addEventListener("click", startWand);
    $("wand-more").addEventListener("click", openWandDetail);
    $("det-back").addEventListener("click", closeWandDetail);
    $("wand-again").addEventListener("click", function () {
      var msg = T[lang].wandAskAgain;
      if (tg && tg.showConfirm) {
        tg.showConfirm(msg, function (ok) { if (ok) { startWand(); } });
      } else if (window.confirm ? window.confirm(msg) : true) {
        startWand();
      }
    });
    $("tasks-strip").addEventListener("click", openTasks);
    $("tasks-back").addEventListener("click", function() {
      if (worldReturnTo()) { return; }
      $("scr-tasks").classList.add("hidden");
      $("scr-cup").classList.remove("hidden");
      renderTasksStrip();
    });
    $("quiz-back").addEventListener("click", function() {
      // confirm exit?
      $("scr-quiz").classList.add("hidden");
      openTasks();
    });
    
    initChatUI();

    // Chess events
    $("chess-strip").addEventListener("click", openChessHub);
    $("refs-strip").addEventListener("click", openRefs);
    $("refs-back").addEventListener("click", worldGuard(closeRefs));
    $("refs-share").addEventListener("click", function () { shareRefs(""); });
    $("refs-promo").addEventListener("click", function () { shareRefs("taklif"); });
    initChessUI();
    
    $("cup-back").addEventListener("click", worldGuard(closeCup));
    $("house-back").addEventListener("click", closeHouse);
    $("hall-about").addEventListener("click", function () { openHouse(cupMe().house); });
    $("cup-prev").addEventListener("click", openCupHistory);
    $("cup-hist-btn").addEventListener("click", openCupHistory);
    $("hist-back").addEventListener("click", closeCupHistory);
    $("hall-back").addEventListener("click", function() {
      $("scr-hall-full").classList.add("hidden");
      $("scr-cup").classList.remove("hidden");
    });
    $("feed-back").addEventListener("click", function() {
      $("scr-feed-full").classList.add("hidden");
      $("scr-cup").classList.remove("hidden");
    });
    $("cup-cta").addEventListener("click", function () {
      // Fakultetsizga - saralanish, chegaradan o'tmaganga - a'zo taklifi
      if (this.getAttribute("data-act") === "sort") {
        $("scr-cup").classList.add("hidden");
        startSorting();
        return;
      }
      // Kolleksiya kartasi - ichidagi havola taklif qilgan odam bilan,
      // ya'ni do'st kelsa ball ham tushadi. Eski mijozda - pastdagi yo'l.
      try {
        if (tg && tg.switchInlineQuery && tg.isVersionAtLeast && tg.isVersionAtLeast("6.7")) {
          tg.switchInlineQuery("taklif", ["users", "groups", "channels"]);
          return;
        }
      } catch (e) {}
      var me0 = tgUser();
      var url = "https://t.me/" + BOT + (me0 ? "?start=ref" + me0.id : "");
      var text = T[lang].cupJoin;
      try {
        if (tg && tg.openTelegramLink) {
          tg.openTelegramLink("https://t.me/share/url?url=" +
            encodeURIComponent(url) + "&text=" + encodeURIComponent(text));
          return;
        }
      } catch (e) {}
      try { window.open(url, "_blank"); } catch (e) {}
    });
    $("hat-go").addEventListener("click", confirmSorting);
    $("sort-back").addEventListener("click", sortBack);
    $("rv-done").addEventListener("click", closeReveal);
    // Ogohlantirish shlyapa ekranidagi confirmSorting() da beriladi.
    // Bu yerda ikkinchi oyna ko'rsatilmaydi - u lockAsk ga zid edi.
    $("resort-btn").addEventListener("click", startSorting);

    // Ikkala ekran ham yashirin turadi — saqlangan til aniqlangunicha
    $("scr-lang").classList.add("hidden");
    $("scr-cat").classList.add("hidden");
    $("scr-prof").classList.add("hidden");
    $("scr-sort").classList.add("hidden");
    $("scr-reveal").classList.add("hidden");
    $("scr-hat").classList.add("hidden");
    $("scr-think").classList.add("hidden");
    $("scr-detail").classList.add("hidden");
    $("scr-cup").classList.add("hidden");
    $("cup-back-txt").textContent = T[lang].cupBack;
    $("hall-back-txt").textContent = T[lang].cupBack;
    $("feed-back-txt").textContent = T[lang].cupBack;

    // Lokal ma'lumot sinxron o'qiladi — kutish shart emas
    absorb(readLocal());
    // Tartib: botdan kelgan til -> ilovada saqlangani -> so'rash.
    var fromBot = urlLang();
    var quick = fromBot || readLocalLang();
    if (fromBot) { saveLang(fromBot); }
    var localHouse = readLocalHouse();
    if (localHouse) { house = localHouse; }
    wand = readLocalWand();
    applyHouse(house);

    var settled = false;
    function show(saved) {
      if (settled) { return; }
      settled = true;
      if (saved) {
        openCatalog(saved, false);
        // Foydalanuvchi shunday sozlagan bo'lsa - to'g'ridan-to'g'ri xaritaga.
        if (readStart() === "world") { openHub(); }
      } else { $("scr-lang").classList.remove("hidden"); }
    }

    if (quick) { migrate(quick); show(quick); }

    load(function (saved, houseChanged) {
      // Botdan kelgan til bulutdagi eski tanlovdan ustun turadi.
      migrate(fromBot || saved || quick || "uz");
      show(fromBot || saved);
      if (!$("scr-cat").classList.contains("hidden")) { renderCatalog(); }
      if (houseChanged) { refreshHouseView(); jrRecheck(); }
    });

    // Ilova ochiq - chatdagi "onlayn" belgisi shunga qaraydi
    presenceStart();

    // Reyting fon rejimida yuklanadi - kechiksa yoki xato bo'lsa,
    // katalog baribir ochiladi, tasma shunchaki ko'rinmaydi.
    fetchCup(function () {
      $("cup-back-txt").textContent = T[lang].cupBack;
      $("hall-back-txt").textContent = T[lang].cupBack;
      $("feed-back-txt").textContent = T[lang].cupBack;
      jrRecheck();
      fetchTasks(function() {
        renderTasksStrip();
      });
    });
  }

  function initTest() { testBar(); testFreshCheck(); }

  // Hamyon holati ishga tushishda o'qiladi: xatdagi kundalik va kutubxona
  // tugmasi (xat/9¾) shunga qarab chiziladi.
  function initWallet() {
    walLoad(function () {
      try { renderWorldBtn(); } catch (e) {}
      if (!$("lt").classList.contains("hidden")) { ltPath(false); ltFit(); }
      if (alleyVisible()) { renderAlley(); }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () { init(); initTest(); initWallet(); });
  } else {
    init();
    initTest();
    initWallet();
  }
