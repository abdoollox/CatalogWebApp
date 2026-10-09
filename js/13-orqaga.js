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
    "scr-blh": "blh-back",
    "scr-fan": "fn-back",
    "scr-tarix": "tr-back",
    "scr-himoya": "hm-back",
    "scr-uchish": "uc-back",
    "scr-maxluq": "mx-back",
    "scr-qoriq": "qr-back",
    "scr-astro": "yl-back",
    "scr-osimlik": "os-back",
    "scr-trans": "tf-back",
    "scr-qob": "qo-back",
    "scr-rek": "rk-back",
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

  /* ---------- Xogvarts PASTKI MENYUSI (egasi, 2026-10-09) ----------
     Bosh sahifa / Darslar / Bellashuv / Chat / Men. Faqat saralangan odamga va faqat «ko'rib chiqish» sahifalarida
     ko'rinadi (o'yin, chat, kutubxona, o'qish oynasida yo'q). Yangi sahifada menyu kerak bo'lsa NAV_ON ga yozing. */
  var NAV_ON = ["scr-hub", "scr-dars", "scr-fan", "scr-blh", "scr-bell", "scr-rek", "scr-qob", "scr-qoriq", "scr-cup", "scr-cup-hist",
                "scr-house", "scr-refs", "scr-hall-full", "scr-feed-full", "scr-sq", "scr-qb", "scr-nsh", "pm"];
  var navQueued = false, navTayyor = false;

  function navKey(top) {
    if (top === "scr-hub") { return "home"; }
    if (top === "scr-dars" || top === "scr-fan") { return "dars"; }
    if (top === "scr-qob") { return qobKel === "pm" ? "men" : "dars"; }
    if (top === "scr-qoriq") { return qrKel === "pm" ? "men" : "dars"; }
    if (top === "scr-blh") { return blhMode === "bell" ? "bell" : ""; }
    if (top === "scr-bell") { return blKel === "fan" ? "dars" : "bell"; }
    if (top === "scr-rek") { return rekKel === "fan" ? "dars" : ""; }
    if (top === "pm" || top === "scr-nsh") { return "men"; }
    return "";
  }

  function navSync() {
    navQueued = false;
    var bar = $("hnav");
    if (!bar) { return; }
    var top = backTopScreen(), on = false;
    try { on = NAV_ON.indexOf(top) >= 0 && hasHouse() && !((top === "pm" || top === "scr-nsh" || top === "scr-qb") && pmFrom !== "hub" && !$("scr-cat").classList.contains("hidden")); } catch (e) {}
    if (on && (top === "pm" || top === "scr-nsh") && pmFrom !== "hub") { on = false; }
    bar.classList.toggle("hidden", !on);
    document.body.classList.toggle("nav-on", on);
    if (!on) { return; }
    var x = drX(), key = navKey(top);
    if (!navTayyor) {
      navTayyor = true;
      $("hn-home").firstChild.innerHTML = QASR_SVG;
      $("hn-dars").firstChild.innerHTML = hubSvg(HUB_ICONS.tasks);
      $("hn-bell").firstChild.innerHTML = hubSvg(HUB_ICONS.bell);
      $("hn-chat").firstChild.innerHTML = hubSvg(HUB_ICONS.chat);
      $("hn-men").firstChild.innerHTML = PM_ICON;
      ["home", "dars", "bell", "chat", "men"].forEach(function (k) {
        $("hn-" + k).addEventListener("click", function () { navGo(k); });
      });
    }
    [["home", x.navHome], ["dars", x.tile], ["bell", x.blTile], ["chat", x.navChat], ["men", x.navMen]].forEach(function (p) {
      var b = $("hn-" + p[0]);
      b.children[1].textContent = p[1];
      b.classList.toggle("on", p[0] === key);
    });
    var cn = 0, bn = 0;
    try { cn = worldChatN(); } catch (e) {}
    try { bn = Math.max(0, drPending()); } catch (e) {}
    [["chat", cn], ["bell", bn]].forEach(function (p) {
      var i = $("hn-" + p[0]).children[2];
      i.textContent = p[1] > 99 ? "99+" : String(p[1]);
      i.classList.toggle("hidden", !(p[1] > 0));
    });
  }

  function navQueue() {
    if (navQueued) { return; }
    navQueued = true;
    setTimeout(navSync, 0);
  }

  // Menyudan o'tish: «ortga qaytish» bayroqlari tozalanadi, ochiq sahifa yopiladi, keyin bo'lim ochiladi
  function navGo(k) {
    if (navKey(backTopScreen()) === k && (k === "home" || backTopScreen() === { dars: "scr-dars", bell: "scr-blh", men: "pm" }[k])) { try { window.scrollTo(0, 0); } catch (e) {} return; }
    sqQayt = false; drQayt = false; blQayt = false; rekFan = null;
    try { blAbort(); } catch (e) {}
    NAV_ON.forEach(function (id) { var el = $(id); if (el) { el.classList.add("hidden"); } });
    try { worldFrom = "hub"; } catch (e) {}
    if (k === "dars") { drOpen(); }
    else if (k === "bell") { blHomeOpen("bell"); }
    else if (k === "chat") { openChat(); }
    else if (k === "men") { pmOpen(); pmFrom = "hub"; navQueue(); }
    else { openHub(); }
  }

  function initNav() {
    if (window.MutationObserver) {
      var mo = new MutationObserver(navQueue), els = document.querySelectorAll(".screen"), i;
      for (i = 0; i < els.length; i++) { mo.observe(els[i], { attributes: true, attributeFilter: ["class"] }); }
    }
    navSync();
  }

  function initBack() {
    try { initNav(); } catch (e) {}
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
