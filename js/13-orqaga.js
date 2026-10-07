/* Telegram "Orqaga" tugmasi - YAGONA boshqaruvchi
   Ilova kodi bir necha faylga bo'lingan; hammasi BIR umumiy maydonda ishlaydi
   va index.html dagi TARTIBDA yuklanadi. Yuklanish paytida keyingi fayldagi
   narsani chaqirmang - tekshiruv: tools/tartib.js */
"use strict";
  /* Ilgari tugmani uch joy (olam, xiyobon, 9¾) o'zicha yoqib-o'chirardi,
     qolgan ekranlarda (profil, kubok, chat, shaxmat...) u umuman yo'q edi.
     Androidda telefonning "orqaga" tugmasi shu Telegram tugmasiga bog'liq:
     tugma yo'q bo'lsa - ilova YOPILIB ketardi, oldingi ekranga qaytmasdi.

     Endi qoida bitta: ochiq turgan eng ustki narsa (panel yoki ekran)
     qaysi bo'lsa, "Orqaga" o'shaning o'z "Ortga" tugmasi qiladigan ishni
     qiladi. Ekranlar qanday almashishidan qat'i nazar, holat har o'zgarishda
     qayta hisoblanadi. Faqat kutubxona va til tanlash - boshlang'ich ekran:
     u yerda tugma yo'q, orqaga bosilsa ilova yopiladi (Telegram odati). */

  // Ekran ustida ochiladigan panellar - avval ular yopiladi.
  var BACK_PANELS = [
    ["hpask", "hpask-no"],
    ["nsh", "nsh-ok"],
    ["odam", "odam-close"],
    ["chess-promo", function () { closePromo(); }],
    ["lt", "lt-later"],
    ["chat-people", "chat-people-back"],
    ["hub-set", "hub-set-close"],
    ["qs", "qs-close"],
    ["km-set", "km-set-close"],
    ["km-nav", "km-nav-close"],
    ["w-set", "w-set-close"]
  ];

  // Ekran -> uning "Ortga" tugmasi (id) yoki qaytish funksiyasi.
  // Ro'yxatda yo'q ekranda (kutubxona, til, "o'ylanish") tugma ko'rinmaydi.
  var BACK_OF = {
    "scr-album": "ms-back",
    "scr-serial": "sr-back",
    "scr-kitob": "kt-back",
    "scr-oqish": "kr-back",
    "pm": "pm-close",
    "scr-nsh": "nsh-back",
    "scr-sq": "sq-back",
    "scr-dars": "dr-back",
    "scr-afsun": "af-back",
    "scr-iksir": "ik-back",
    "scr-bell": "bl-back",
    "scr-qb": "qb-back",
    "scr-hub": "hub-back",
    "scr-owl": "owl-back",
    "scr-vault": "gr-back",
    "scr-train": "tr-back",
    "scr-world": function () { worldBack(); },
    "scr-prof": "prof-back",
    "scr-detail": "det-back",
    "scr-hat": function () { questExit(); },
    "scr-sort": "sort-back",
    "scr-reveal": "rv-done",
    "scr-cup": "cup-back",
    "scr-cup-hist": "hist-back",
    "scr-house": "house-back",
    "scr-refs": "refs-back",
    "scr-hall-full": "hall-back",
    "scr-feed-full": "feed-back",
    "scr-tasks": "tasks-back",
    "scr-quiz": "quiz-back",
    "scr-chat": "chat-back",
    "scr-chess-hub": "chess-hub-back",
    "scr-chess-stats": "chess-stats-back",
    "scr-chess-game": "chess-game-back"
  };

  var backShown = false, backQueued = false;

  function backOpen(id) {
    var el = $(id);
    return !!el && !el.classList.contains("hidden");
  }

  function backDo(how) {
    if (typeof how === "function") { return how; }
    return function () { var b = $(how); if (b) { b.click(); } };
  }

  // Hozir ko'rinib turgan ekranlardan eng ustkisi. Chat, vazifalar kabi
  // ekranlar kutubxona USTIDA ochiladi - shuning uchun kutubxona hisobga
  // olinmaydi; qolganlari orasida sahifada keyin turgani ustda.
  function backTopScreen() {
    var list = document.querySelectorAll(".screen"), top = null, i;
    for (i = 0; i < list.length; i++) {
      if (list[i].classList.contains("hidden") || list[i].id === "scr-cat" || list[i].id === "scr-lang") { continue; }
      top = list[i].id;
    }
    return top;
  }

  // Hozir "Orqaga" nima qiladi (null - hech narsa, tugma yashirinadi).
  function backAction() {
    var i;
    if (chatMenuEl && backOpen("scr-chat")) { return chatCloseMenu; }
    for (i = 0; i < BACK_PANELS.length; i++) {
      if (backOpen(BACK_PANELS[i][0])) { return backDo(BACK_PANELS[i][1]); }
    }
    var top = backTopScreen();
    return top && BACK_OF[top] ? backDo(BACK_OF[top]) : null;
  }

  function backPress() {
    var fn = backAction();
    if (fn) { fn(); }
  }

  function backSync() {
    backQueued = false;
    if (!tg || !tg.BackButton) { return; }
    var on = !!backAction();
    if (on === backShown) { return; }
    backShown = on;
    try { if (on) { tg.BackButton.show(); } else { tg.BackButton.hide(); } } catch (e) {}
  }

  // Bir nechta ekran ketma-ket almashsa ham bir marta hisoblanadi.
  function backQueue() {
    if (backQueued) { return; }
    backQueued = true;
    setTimeout(backSync, 0);
  }

  function initBack() {
    if (!tg || !tg.BackButton) { return; }
    try { tg.BackButton.onClick(backPress); } catch (e) {}
    if (window.MutationObserver) {
      var mo = new MutationObserver(backQueue), els = document.querySelectorAll(".screen"), i;
      for (i = 0; i < els.length; i++) { mo.observe(els[i], { attributes: true, attributeFilter: ["class"] }); }
      BACK_PANELS.forEach(function (p) {
        var el = $(p[0]);
        if (el) { mo.observe(el, { attributes: true, attributeFilter: ["class"] }); }
      });
    }
    backSync();
  }
