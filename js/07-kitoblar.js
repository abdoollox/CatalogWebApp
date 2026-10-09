/* Kitoblar: kutubxona javoni, kitob sahifasi va ilova ichida o'qish (PDF)
   Ilova kodi bir necha faylga bo'lingan; hammasi BIR umumiy maydonda ishlaydi
   va index.html dagi TARTIBDA yuklanadi. Yuklanish paytida keyingi fayldagi
   narsani chaqirmang - tekshiruv: tools/tartib.js */
"use strict";
  /* Fayllar bot tomonda (hpkitob.py): egasi kitobni baza guruhidagi mavzuga tashlaydi, bot o'zi taniydi.
     Ro'yxat /api/books dan keladi; kitob yo'q bo'lsa javon chiqmaydi ("Tez orada: Kitoblar" turadi).
     Birinchi kitob bepul, qolganlari galleonga (albomlar kabi: bir marta, doim ochiq).
     O'qish: PDF serverdan bo'laklab olinadi va pdf.js (lib/pdfjs, Mozilla) sahifalarni chizadi.
     Qayerda to'xtagani shu qurilmada eslab qolinadi (hp_kt_bet). */
  var API_BOOKS = "https://bot.tizimshunos.uz/api/books";
  var KT_ORDER = ["kt1", "kt2", "kt3", "kt4", "kt5", "kt6", "kt7"];
  var KT_YEAR = { kt1: 1997, kt2: 1998, kt3: 1999, kt4: 2000, kt5: 2003, kt6: 2005, kt7: 2007 };
  var KT_LANG = { uz: "O'zbekcha", ru: "Русский", en: "English" };
  // Nomlar FILMLAR bilan bir xil (CatalogBot/catalog.py) - egasi, 2026-10-07. Film nomi o'zgarsa shu yerda ham.
  var KT_NOM = {
    uz: ["Hikmatlar Toshi", "Maxfiy Hujra", "Azkaban Mahbusi", "Alanga Kubogi", "Feniks Jamiyati", "Tilsim Shaxzodasi", "Ajal Tuhfasi"],
    ru: ["Философский Камень", "Тайная Комната", "Узник Азкабана", "Кубок Огня", "Орден Феникса", "Принц Полукровка", "Дары Смерти"],
    en: ["Philosopher's Stone", "Chamber of Secrets", "Prisoner of Azkaban", "Goblet of Fire",
         "Order of the Phoenix", "Half-Blood Prince", "Deathly Hallows"]
  };
  var KT_DESC = {
    uz: ["O'n bir yoshli Garri o'zining sehrgar ekanini bilib oladi va Xogvartsga yo'l oladi. Maktab yerto'lasida esa kimdir Hikmatlar toshini qidirmoqda.",
         "Xogvartsda devorlarga qonli yozuvlar paydo bo'ladi, o'quvchilar toshga aylanadi. Maxfiy hujra yana ochilgan.",
         "Azkabandan xavfli mahbus qochadi va u Garrini izlayotgani aytiladi. Maktabni esa dementorlar qo'riqlaydi.",
         "Xogvartsda Uch sehrgar musobaqasi o'tadi. Alanga kubogi kutilmaganda to'rtinchi ismni — Garrini chiqaradi.",
         "Hech kim Garriga ishonmaydi, maktabni Vazirlik egallaydi. O'quvchilar yashirincha Dambldor qo'shinini tuzadi.",
         "Garri eski darslikdan sirli Shaxzodaning yozuvlarini topadi. Dambldor esa unga Volan-de-Mortning o'tmishini ochadi.",
         "Garri, Ron va Germiona maktabga qaytmaydi — ular krestraj qidiradi. Hammasi Xogvarts uchun jangda hal bo'ladi."],
    ru: ["Одиннадцатилетний Гарри узнаёт, что он волшебник, и отправляется в Хогвартс. А в подземельях школы кто-то ищет философский камень.",
         "На стенах Хогвартса появляются кровавые надписи, ученики превращаются в камень. Тайная комната снова открыта.",
         "Из Азкабана сбежал опасный узник, и говорят, что он ищет Гарри. Школу охраняют дементоры.",
         "В Хогвартсе проходит Турнир Трёх Волшебников. Кубок огня неожиданно выбрасывает четвёртое имя — Гарри.",
         "Гарри никто не верит, школу захватывает Министерство. Ученики тайно создают Отряд Дамблдора.",
         "В старом учебнике Гарри находит записи загадочного Принца. А Дамблдор открывает ему прошлое Волан-де-Морта.",
         "Гарри, Рон и Гермиона не возвращаются в школу — они ищут крестражи. Всё решится в битве за Хогвартс."],
    en: ["Eleven-year-old Harry learns he is a wizard and leaves for Hogwarts. Down in the school dungeons, someone is after the Philosopher's Stone.",
         "Bloody writing appears on the castle walls and students are turned to stone. The Chamber of Secrets has been opened again.",
         "A dangerous prisoner has escaped from Azkaban and is said to be after Harry. Dementors guard the school.",
         "Hogwarts hosts the Triwizard Tournament. The Goblet of Fire unexpectedly gives a fourth name — Harry's.",
         "Nobody believes Harry and the Ministry takes over the school. The students secretly form Dumbledore's Army.",
         "In an old textbook Harry finds the notes of a mysterious Prince. Dumbledore shows him Voldemort's past.",
         "Harry, Ron and Hermione do not return to school — they hunt Horcruxes. It all ends in the Battle of Hogwarts."]
  };
  var KT_TX = {
    uz: { shelf: "Kitoblar", cnt: function (n) { return n + " ta kitob"; }, kick: "Kutubxona", ttl: "Kitob",
          num: function (n) { return n + "-kitob"; }, soon: "Tez orada", test: "Sinov", open: "Ochish",
          read: "O'qish", cont: function (n) { return "Davom etish · " + n + "-bet"; },
          dl: function (f, s) { return "Yuklab olish · " + f + (s ? " · " + s : ""); },
          hint: "Yuklab olingan fayl bot bilan suhbatingizga tushadi.", big: "Bu nusxa hajmi katta — uni faqat yuklab olish mumkin.",
          nolang: function (l) { return "Bu kitob hozircha faqat " + l + " tilida bor."; },
          sent: "Kitob bot chatiga yuborildi", fail: "Hozir bo'lmadi, birozdan keyin urinib ko'ring", slow: "Biroz kuting…",
          bar: function (n) { return "Kitobni ochish · " + n + " galleon"; }, chip: function (n) { return n + " galleon"; },
          have: function (n) { return "Hamyoningizda " + n + " galleon"; },
          ask: function (nom, n, bor) { return "Kitob ochilsinmi?\n\n«" + nom + "» — " + n + " galleon. Sizda " + bor + " galleon bor. Kitob doim ochiq qoladi."; },
          yes: "Ochish", no: "Hozir emas", done: "Kitob ochildi", close: "Yopish", cup: "Kubokni ko'rish", letter: "Maktubni ochish",
          poorT: "Galleon yetmaydi", outT: "Kitob galleonga ochiladi",
          poor: function (n, bor) { return "Kitob " + n + " galleon turadi, sizda " + bor + " galleon bor.\n\nGalleon shunday yig'iladi:\n1. Fakultetingizga ball to'plang: kunlik savol, filmlar, shokolad qurbaqa, shaxmat.\n2. Hafta yakunida har 10 ball uchun 1 galleon beriladi.\n3. Fakultetingiz kubokni yutsa — ikki baravar."; },
          out: function (n) { return "Galleon — Xogvarts puli. Uni shunday olasiz:\n\n1. Boyo'g'li keltirgan Xogvarts maktubini oching va fakultetga tushing (5 daqiqa).\n2. Fakultetingizga ball to'plang.\n3. Har hafta yakunida 10 ball uchun 1 galleon beriladi.\n\nBitta kitob " + n + " galleon turadi va doim ochiq qoladi. Birinchi kitob bepul."; },
          swipe: "Varaqlash uchun betni suring yoki chetini bosing", loading: "Kitob ochilmoqda…", rfail: "Kitob ochilmadi. Internetni tekshirib, qayta urinib ko'ring.", retry: "Qayta urinish",
          pg: function (a, b) { return a + " / " + b; } },
    ru: { shelf: "Книги", cnt: function (n) { return n + " книг"; }, kick: "Библиотека", ttl: "Книга",
          num: function (n) { return "Книга " + n; }, soon: "Скоро", test: "Тест", open: "Открыть",
          read: "Читать", cont: function (n) { return "Продолжить · стр. " + n; },
          dl: function (f, s) { return "Скачать · " + f + (s ? " · " + s : ""); },
          hint: "Скачанный файл придёт в ваш чат с ботом.", big: "Этот файл слишком большой — его можно только скачать.",
          nolang: function (l) { return "Эта книга пока есть только на языке: " + l + "."; },
          sent: "Книга отправлена в чат с ботом", fail: "Не получилось, попробуйте чуть позже", slow: "Подождите немного…",
          bar: function (n) { return "Открыть книгу · " + n + " галлеонов"; }, chip: function (n) { return n + " галлеонов"; },
          have: function (n) { return "В кошельке " + n + " галлеонов"; },
          ask: function (nom, n, bor) { return "Открыть книгу?\n\n«" + nom + "» — " + n + " галлеонов. У вас " + bor + ". Книга останется открытой навсегда."; },
          yes: "Открыть", no: "Не сейчас", done: "Книга открыта", close: "Закрыть", cup: "Открыть кубок", letter: "Открыть письмо",
          poorT: "Не хватает галлеонов", outT: "Книга открывается за галлеоны",
          poor: function (n, bor) { return "Книга стоит " + n + " галлеонов, у вас " + bor + ".\n\nКак накопить:\n1. Набирайте очки для факультета: вопрос дня, фильмы, шоколадная лягушка, шахматы.\n2. В конце недели за каждые 10 очков выдаётся 1 галлеон.\n3. Если ваш факультет выиграет Кубок — вдвое больше."; },
          out: function (n) { return "Галлеоны — деньги Хогвартса. Получить их можно так:\n\n1. Откройте письмо из Хогвартса, которое принесла сова, и пройдите распределение (5 минут).\n2. Набирайте очки для факультета.\n3. В конце каждой недели за 10 очков выдаётся 1 галлеон.\n\nОдна книга стоит " + n + " галлеонов и остаётся открытой навсегда. Первая книга бесплатная."; },
          swipe: "Листайте: проведите по странице или нажмите на её край", loading: "Книга открывается…", rfail: "Книга не открылась. Проверьте интернет и попробуйте ещё раз.", retry: "Повторить",
          pg: function (a, b) { return a + " / " + b; } },
    en: { shelf: "Books", cnt: function (n) { return n + " books"; }, kick: "Library", ttl: "Book",
          num: function (n) { return "Book " + n; }, soon: "Coming soon", test: "Test", open: "Open",
          read: "Read", cont: function (n) { return "Continue · page " + n; },
          dl: function (f, s) { return "Download · " + f + (s ? " · " + s : ""); },
          hint: "The downloaded file arrives in your chat with the bot.", big: "This file is too large — it can only be downloaded.",
          nolang: function (l) { return "This book is only available in " + l + " for now."; },
          sent: "The book was sent to the bot chat", fail: "That didn't work, please try again shortly", slow: "Please wait a moment…",
          bar: function (n) { return "Unlock book · " + n + " Galleons"; }, chip: function (n) { return n + " Galleons"; },
          have: function (n) { return n + " Galleons in your wallet"; },
          ask: function (nom, n, bor) { return "Unlock this book?\n\n“" + nom + "” — " + n + " Galleons. You have " + bor + ". It stays unlocked forever."; },
          yes: "Unlock", no: "Not now", done: "Book unlocked", close: "Close", cup: "Open the Cup", letter: "Open the letter",
          poorT: "Not enough Galleons", outT: "Books are unlocked with Galleons",
          poor: function (n, bor) { return "The book costs " + n + " Galleons, you have " + bor + ".\n\nHow to save up:\n1. Earn points for your house: the daily question, films, the Chocolate Frog, chess.\n2. At the end of the week you get 1 Galleon per 10 points.\n3. If your house wins the Cup you get double."; },
          out: function (n) { return "Galleons are Hogwarts money. Here is how to get them:\n\n1. Open the Hogwarts letter the owl brought and get sorted into a house (5 minutes).\n2. Earn points for your house.\n3. At the end of every week you get 1 Galleon per 10 points.\n\nOne book costs " + n + " Galleons and stays unlocked forever. The first book is free."; },
          swipe: "Swipe the page or tap its edge to turn it", loading: "Opening the book…", rfail: "The book didn't open. Check your connection and try again.", retry: "Try again",
          pg: function (a, b) { return a + " / " + b; } }
  };
  var KT_ICON = {
    book: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M11.2 6.6C9.3 5.3 6.9 4.8 4.4 5a1 1 0 0 0-.9 1v11.4a1 1 0 0 0 1.1 1c2.4-.2 4.7.3 6.6 1.6zm1.600 0v13.4c1.9-1.3 4.2-1.8 6.6-1.6a1 1 0 0 0 1.1-1V6a1 1 0 0 0-.9-1c-2.5-.2-4.9.3-6.8 1.6z"/></svg>'
  };

  var ktData = null;       // {books:[{id, year, free, open, files:{en:{pdf:{size, read}}}}], test}
  var ktKey = "", ktGal = 0, ktPrice = 3, ktAsked = false, ktBuying = false, ktSending = false;
  var ktOpenId = null, ktLang = null, ktScroll = 0, ktPending = null, ktLogged = {};
  // Bot xabari ostidagi "Ilovada o'qish" tugmasi ilovani ?kitob=kt1 bilan ochadi; havola: startapp=kitob
  try {
    var ktHref = /(?:[?&#]kitob=|tgWebAppStartParam=kitob_?)(kt[1-7])?/.exec(window.location.href);
    var ktSp = (window.Telegram && Telegram.WebApp && Telegram.WebApp.initDataUnsafe || {}).start_param || "";
    if (ktHref) { ktPending = ktHref[1] || "kt1"; }
    else if (/^kitob/.test(ktSp)) { ktPending = (/kt[1-7]/.exec(ktSp) || ["kt1"])[0]; }
  } catch (e) { ktPending = null; }

  function ktInit() { try { return (tg && tg.initData) || ""; } catch (e) { return ""; } }
  function ktX() { return KT_TX[lang] || KT_TX.uz; }
  function ktNum(id) { return parseInt(id.charAt(2), 10); }
  function ktName(id) { return (KT_NOM[lang] || KT_NOM.uz)[ktNum(id) - 1]; }
  var KT_RASM_V = "3";      // muqova rasmlari almashganda oshiring (fayl nomi o'sha - brauzer eskisini keshdan bermasin)
  function ktArt(id) { return IMG_DIR + "kitob/" + id + ".webp?v=" + KT_RASM_V; }
  function ktBook(id) {
    var list = (ktData && ktData.books) || [];
    for (var i = 0; i < list.length; i++) { if (list[i].id === id) { return list[i]; } }
    return null;
  }
  function ktSize(n) {
    if (!n) { return ""; }
    var mb = n / 1048576;
    return (mb >= 10 ? Math.round(mb) : Math.round(mb * 10) / 10) + " MB";
  }

  // Mahalliy ko'rikda server yo'q - namuna (bitta ochiq, ikkita qulflangan kitob)
  function ktSample() {
    return { ok: true, price: 3, gal: 2, key: "", test: true, books: KT_ORDER.map(function (id, i) {
      return { id: id, year: KT_YEAR[id], free: i === 0, open: i === 0, files: { en: { pdf: { size: 1100000 + i * 300000, read: true } } } };
    }) };
  }

  function ktLoad() {
    if (ktAsked || !window.fetch) { return; }
    ktAsked = true;
    try { ktData = JSON.parse(window.localStorage.getItem("hp_kitob") || "null"); } catch (e) { ktData = null; }
    var done = function (res) {
      var before = JSON.stringify(ktData || {});
      ktData = { books: res.books || [], test: !!res.test };
      ktKey = res.key || "";
      if (typeof res.price === "number" && res.price > 0) { ktPrice = res.price; }
      if (typeof res.gal === "number") { ktGal = res.gal; }
      try { window.localStorage.setItem("hp_kitob", JSON.stringify(ktData)); } catch (e) {}
      if (JSON.stringify(ktData) !== before) {
        var cat = $("scr-cat");
        if (cat && !cat.classList.contains("hidden")) { renderCatalog(); }
        if (ktOpenId && !$("scr-kitob").classList.contains("hidden")) { ktRender(); }
      }
      ktMaybeOpen();
    };
    window.fetch(API_BOOKS, { headers: { "X-Telegram-Init-Data": ktInit() } })
      .then(function (r) { return r.json(); })
      .then(function (res) { if (res && res.ok) { done(res); } else if (MS_LOCAL) { done(ktSample()); } })
      ["catch"](function () { if (MS_LOCAL) { done(ktSample()); } });
  }

  // Muqova: charm jild ko'rinishi (CSS) + o'rtada rasm. Yozuv rasmda emas - shu yerda.
  function ktCover(id, big) {
    var c = document.createElement("span");
    c.className = "kt-cov" + (big ? " big" : "");
    var im = document.createElement("img");
    im.alt = "";
    im.decoding = "async";
    im.src = ktArt(id);
    c.appendChild(im);
    return c;
  }

  /* --- kutubxona javoni ---
     Kitoblar javonda TIK turadi (yon tomoni ko'rinadi). Bosilgan kitob javondan chiqib, muqovasi bilan
     buriladi (3D), ostida nomi va tugma chiqadi; yana bosilsa yoki tugma bosilsa - kitob sahifasi. */
  var KT_LOOK = {            // jild yonining eni (bo'yiga nisbatan) - kitob qalinligi, rasmning o'zidan
    kt1: 0.1107, kt2: 0.1268, kt3: 0.1357, kt4: 0.2536, kt5: 0.2536, kt6: 0.2446, kt7: 0.2054
  };
  var ktSel = null;

  function ktState(id) { var bk = ktBook(id); return !bk ? "soon" : (bk.open ? "" : "lock"); }

  function ktPick(id, sec, jim) {
    ktSel = id;
    var x = ktX(), st = ktState(id);
    Array.prototype.forEach.call(sec.querySelectorAll(".kt-bk"), function (b) {
      var on = b.getAttribute("data-id") === id;
      b.classList.toggle("on", on);
      b.setAttribute("aria-pressed", on ? "true" : "false");
    });
    sec.querySelector(".kt-info-t").textContent = ktName(id);
    sec.querySelector(".kt-info-s").textContent = x.num(ktNum(id)) + " · " + KT_YEAR[id] +
      (st === "soon" ? " · " + x.soon : st === "lock" ? " · " + x.chip(ktPrice) : "");
    var go = sec.querySelector(".kt-go");
    go.textContent = st === "soon" ? x.soon : x.open;
    go.disabled = st === "soon";
    if (!jim) {
      try { if (tg && tg.HapticFeedback) { tg.HapticFeedback.selectionChanged(); } } catch (e) {}
      // Tanlangan kitob kengayadi - javon ichida ko'rinib tursin
      var el = sec.querySelector(".kt-bk.on"), row = sec.querySelector(".kt-books");
      setTimeout(function () {
        if (!el || !row) { return; }
        var chap = el.offsetLeft - 18, ong = el.offsetLeft + el.offsetWidth + 18 - row.clientWidth;
        if (row.scrollLeft > chap) { row.scrollTo({ left: Math.max(0, chap), behavior: "smooth" }); }
        else if (row.scrollLeft < ong) { row.scrollTo({ left: ong, behavior: "smooth" }); }
      }, 420);
    }
  }

  function ktShelf() {
    var list = (ktData && ktData.books) || [];
    if (!list.length) { return null; }
    var x = ktX();
    var sec = document.createElement("div");
    sec.className = "rowsec kt-sec";
    var head = document.createElement("div");
    head.className = "rowsec-h";
    var b = document.createElement("b");
    b.textContent = x.shelf + (ktData.test ? " · " + x.test : "");
    var c = document.createElement("span");
    c.textContent = x.cnt(KT_ORDER.length);
    head.appendChild(b);
    head.appendChild(c);
    sec.appendChild(head);

    var shelf = document.createElement("div");
    shelf.className = "kt-shelf";
    var row = document.createElement("div");
    row.className = "kt-books";
    KT_ORDER.forEach(function (id) {
      var st = ktState(id);
      var bk = document.createElement("button");
      bk.type = "button";
      bk.className = "kt-bk" + (st ? " " + st : "");
      bk.setAttribute("data-id", id);
      bk.setAttribute("aria-label", ktName(id));
      bk.style.setProperty("--r", String(KT_LOOK[id]));
      var sp = document.createElement("span");
      sp.className = "kt-sp";
      sp.innerHTML = '<img alt="" decoding="async"><i class="kt-sp-f"></i>';
      sp.querySelector("img").src = IMG_DIR + "kitob/" + id + "-yon.webp?v=" + KT_RASM_V;
      if (st === "lock") { sp.querySelector(".kt-sp-f").innerHTML = MS_ICON.lock; }
      var fc = document.createElement("span");
      fc.className = "kt-fc";
      var cov = ktCover(id, false);
      if (st) {
        var chip = document.createElement("span");
        chip.className = "kt-chip";
        if (st === "lock") {
          chip.innerHTML = MS_ICON.lock + "<span></span>";
          chip.querySelector("span").textContent = x.chip(ktPrice);
        } else {
          chip.textContent = x.soon;
        }
        cov.appendChild(chip);
      }
      fc.appendChild(cov);
      bk.appendChild(sp);
      bk.appendChild(fc);
      bk.addEventListener("click", function () {
        if (ktSel === id && ktBook(id)) { ktOpen(id); return; }
        ktPick(id, sec, false);
      });
      row.appendChild(bk);
    });
    shelf.appendChild(row);
    var plank = document.createElement("i");
    plank.className = "kt-plank";
    shelf.appendChild(plank);
    sec.appendChild(shelf);

    var info = document.createElement("div");
    info.className = "kt-info";
    info.innerHTML = '<span class="kt-info-tx"><b class="kt-info-t"></b><small class="kt-info-s"></small></span>' +
                     '<button class="kt-go" type="button"></button>';
    info.querySelector(".kt-go").addEventListener("click", function () { if (ktSel && ktBook(ktSel)) { ktOpen(ktSel); } });
    sec.appendChild(info);

    // Boshida: oxirgi tanlangan, bo'lmasa fayli bor birinchi kitob
    ktPick(ktSel && KT_LOOK[ktSel] ? ktSel : list[0].id, sec, true);
    return sec;
  }

  /* --- kitob sahifasi --- */
  function ktOpen(id) {
    ktOpenId = id;
    ktLang = null;
    ktScroll = window.scrollY || 0;
    ktRender();
    $("scr-cat").classList.add("hidden");
    $("scr-kitob").classList.remove("hidden");
    try { window.scrollTo(0, 0); } catch (e) {}
  }

  function ktClose() {
    ktOpenId = null;
    $("scr-kitob").classList.add("hidden");
    $("scr-cat").classList.remove("hidden");
    renderCatalog();
    try { window.scrollTo(0, ktScroll); } catch (e) {}
  }

  // Havoladan kelgan bo'lsa kitob sahifasi o'zi ochiladi
  function ktMaybeOpen() {
    if (!ktPending || !ktData || !ktData.books.length) { return; }
    var cat = $("scr-cat");
    if (!cat || cat.classList.contains("hidden")) { return; }
    var id = ktBook(ktPending) ? ktPending : ktData.books[0].id;
    ktPending = null;
    ktOpen(id);
  }

  function ktBet(id, lg, n) {
    var all = {};
    try { all = JSON.parse(window.localStorage.getItem("hp_kt_bet") || "{}") || {}; } catch (e) { all = {}; }
    if (n == null) { return parseInt(all[id + "_" + lg], 10) || 0; }
    all[id + "_" + lg] = n;
    try { window.localStorage.setItem("hp_kt_bet", JSON.stringify(all)); } catch (e) {}
    return n;
  }

  function ktBtn(cls, icon, text, fn) {
    var b = document.createElement("button");
    b.type = "button";
    b.className = cls;
    b.innerHTML = icon + "<span></span>";
    b.querySelector("span").textContent = text;
    b.addEventListener("click", fn);
    return b;
  }

  function ktRender() {
    var id = ktOpenId, bk = ktBook(id);
    if (!id || !bk) { return; }
    var x = ktX(), n = ktNum(id);
    var langs = ["uz", "ru", "en"].filter(function (l) { return !!bk.files[l]; });
    if (!ktLang || !bk.files[ktLang]) { ktLang = bk.files[lang] ? lang : langs[0]; }
    $("kt-kick").textContent = x.kick;
    $("kt-ttl").textContent = x.ttl;
    var hero = $("kt-cov");
    hero.innerHTML = "";
    var varaq = document.createElement("i");
    varaq.className = "kt-varaq";
    hero.appendChild(varaq);
    hero.appendChild(ktCover(id, true));
    $("kt-num").textContent = x.num(n) + " · " + KT_YEAR[id];
    $("kt-name").textContent = ktName(id);
    $("kt-desc").textContent = (KT_DESC[lang] || KT_DESC.uz)[n - 1];

    // Til tanlovi: bittadan ko'p bo'lsa tugmalar; o'z tilida yo'q bo'lsa - izoh
    var lb = $("kt-langs");
    lb.innerHTML = "";
    if (langs.length > 1) {
      langs.forEach(function (l) {
        var t = document.createElement("button");
        t.type = "button";
        t.className = "kt-lang" + (l === ktLang ? " on" : "");
        t.textContent = KT_LANG[l];
        t.addEventListener("click", function () { ktLang = l; ktRender(); });
        lb.appendChild(t);
      });
    }
    $("kt-nolang").textContent = bk.files[lang] ? "" : x.nolang(langs.map(function (l) { return KT_LANG[l]; }).join(", "));
    $("kt-nolang").classList.toggle("hidden", !!bk.files[lang]);

    var acts = $("kt-acts");
    acts.innerHTML = "";
    var files = bk.files[ktLang] || {};
    var yopiq = !bk.open;
    $("kt-buy").classList.toggle("hidden", !yopiq);
    if (yopiq) {
      $("kt-buy-b").innerHTML = MS_ICON.lock + "<span></span>";
      $("kt-buy-b").querySelector("span").textContent = x.bar(ktPrice);
      $("kt-buy-s").textContent = x.have(ktGal);
      $("kt-buy-b").onclick = function () { ktBuyAsk(id); };
      $("kt-hint").textContent = "";
      return;
    }
    if (files.pdf && files.pdf.read) {
      var bet = ktBet(id, ktLang);
      acts.appendChild(ktBtn("kt-read", KT_ICON.book, bet > 1 ? x.cont(bet) : x.read, function () {
        var kv = $("kt-cov");
        if (kv.classList.contains("ochil")) { return; }
        kv.classList.add("ochil");
        setTimeout(function () { kv.classList.remove("ochil"); krOpen(id, ktLang); }, 620);
      }));
    }
    ["pdf", "epub", "fb2"].forEach(function (f) {
      if (!files[f]) { return; }
      acts.appendChild(ktBtn("kt-dl", MS_ICON.dl, x.dl(f.toUpperCase(), ktSize(files[f].size)), function () { ktSend(id, ktLang, f); }));
    });
    $("kt-hint").textContent = (files.pdf && !files.pdf.read ? x.big + " " : "") + x.hint;
  }

  /* --- galleonga ochish --- */
  function ktBuyAsk(id) {
    if (ktBuying) { return; }
    var x = ktX();
    if (!ktInit() && !MS_LOCAL) { showToast(x.fail, "err"); return; }
    if (ktGal < ktPrice) {
      var ichkarida = false;
      try { ichkarida = hasHouse(); } catch (e) {}
      if (ichkarida) {
        testAsk(x.poor(ktPrice, ktGal), function () { try { openCup(); } catch (e) {} }, { title: x.poorT, ok: x.cup, no: x.close, left: true });
      } else {
        testAsk(x.out(ktPrice), function () { try { goWorld(); } catch (e) {} }, { title: x.outT, ok: x.letter, no: x.close, left: true });
      }
      return;
    }
    testAsk(x.ask(ktName(id), ktPrice, ktGal), function () { ktBuy(id); }, { ok: x.yes, no: x.no });
  }

  function ktBuy(id) {
    var x = ktX();
    ktBuying = true;
    window.fetch(API_BOOKS + "/buy", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Telegram-Init-Data": ktInit() },
      body: JSON.stringify({ book: id })
    }).then(function (r) { return r.json(); }).then(function (res) {
      ktBuying = false;
      if (res && typeof res.gal === "number") { ktGal = res.gal; }
      if (res && res.ok) {
        var bk = ktBook(id);
        if (bk) { bk.open = true; }
        try { window.localStorage.setItem("hp_kitob", JSON.stringify(ktData)); } catch (e) {}
        try { if (wal) { wal.galleons = ktGal; } } catch (e) {}
        try { if (tg && tg.HapticFeedback) { tg.HapticFeedback.notificationOccurred("success"); } } catch (e) {}
        showToast(x.done);
        if (ktOpenId) { ktRender(); }
        return;
      }
      if (res && res.error === "pul") { ktBuyAsk(id); return; }
      showToast(x.fail, "err");
    })["catch"](function () { ktBuying = false; showToast(x.fail, "err"); });
  }

  /* --- faylni bot chatiga yuborish --- */
  function ktSend(id, lg, fmt) {
    if (ktSending) { return; }
    var x = ktX(), t = T[lang];
    var init = ktInit();
    if (!init) { showToast(x.fail, "err"); return; }
    ktSending = true;
    var pending = showToast(t.sending);
    window.fetch(API_BOOKS + "/send", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Telegram-Init-Data": init },
      body: JSON.stringify({ book: id, lang: lg, fmt: fmt, ui: lang })
    }).then(function (r) { return r.json(); }).then(function (res) {
      ktSending = false;
      dismissNote(pending);
      if (res && res.ok) {
        showToast(x.sent, "ok");
        try { if (tg && tg.HapticFeedback) { tg.HapticFeedback.notificationOccurred("success"); } } catch (e) {}
        return;
      }
      var err = res && res.error;
      if (err === "locked") { ktBuyAsk(id); return; }
      if (err === "not_subscribed") {
        showToast(t.notSubscribed, "err");
        try { if (tg && tg.openTelegramLink) { tg.openTelegramLink(MS_CHANNEL); } } catch (e) {}
        return;
      }
      showToast(err === "slow" ? x.slow : x.fail, err === "slow" ? "" : "err");
    })["catch"](function () {
      ktSending = false;
      dismissNote(pending);
      showToast(x.fail, "err");
    });
  }

  /* ================= O'QISH OYNASI =================
     Sahifalar pastga qarab ketma-ket turadi. Faqat ko'rinib turgan va yonidagi sahifalar chiziladi,
     uzoqlashgani bo'shatiladi - telefonda (ayniqsa iPhone) xotira cheklangan. */
  var KR_LIB = "lib/pdfjs/pdf.min.js?v=3.11.174", KR_WORKER = "lib/pdfjs/pdf.worker.min.js?v=3.11.174";
  var KR_ZOOMS = [1, 1.4, 1.8];
  var krDoc = null, krTask = null, krIO = null, krId = null, krLang = null, krN = 0, krCur = 1;
  var krZoom = 0, krQueue = [], krBusy = false, krNear = {}, krTick = null, krLibWait = null, krGen = 0;

  function krLib(cb) {
    var lib = window.pdfjsLib || window["pdfjs-dist/build/pdf"];
    if (lib) { cb(lib); return; }
    if (krLibWait) { krLibWait.push(cb); return; }
    krLibWait = [cb];
    var s = document.createElement("script");
    s.src = KR_LIB;
    var tugadi = function () {
      var l = window.pdfjsLib || window["pdfjs-dist/build/pdf"] || null;
      if (l) { try { l.GlobalWorkerOptions.workerSrc = KR_WORKER; } catch (e) {} }
      var w = krLibWait || [];
      krLibWait = null;
      w.forEach(function (f) { f(l); });
    };
    s.onload = tugadi;
    s.onerror = function () { try { s.parentNode.removeChild(s); } catch (e) {} tugadi(); };
    document.head.appendChild(s);
  }

  function krUrl(id, lg) {
    if (MS_LOCAL) { return "sinov-kitob.pdf"; }
    return API_BOOKS + "/f/" + id + "_" + lg + ".pdf?k=" + encodeURIComponent(ktKey);
  }

  function krMsg(text, retry) {
    var box = $("kr-load");
    box.innerHTML = "";
    if (!text) { box.classList.add("hidden"); return; }
    var p = document.createElement("p");
    p.textContent = text;
    box.appendChild(p);
    if (retry) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "kt-dl";
      b.textContent = ktX().retry;
      b.addEventListener("click", function () { krStart(); });
      box.appendChild(b);
    } else {
      var sp = document.createElement("i");
      sp.className = "kr-spin";
      box.insertBefore(sp, p);
    }
    box.classList.remove("hidden");
  }

  function krOpen(id, lg) {
    krId = id;
    krLang = lg;
    krZoom = 0;
    $("kr-t").textContent = ktName(id);
    $("kr-pg").textContent = "";
    $("scr-kitob").classList.add("hidden");
    $("scr-oqish").classList.remove("hidden");
    document.body.classList.add("kr-on");
    try { window.scrollTo(0, 0); } catch (e) {}
    krStart();
    // Statistikaga va nishonga: shu kitob o'qish uchun ochildi (sessiyada bir marta)
    if (!ktLogged[id + lg] && ktInit()) {
      ktLogged[id + lg] = true;
      window.fetch(API_BOOKS + "/send", {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Telegram-Init-Data": ktInit() },
        body: JSON.stringify({ book: id, lang: lg, action: "read" })
      })["catch"](function () {});
    }
  }

  function krStop() {
    krGen++;
    try { if (krIO) { krIO.disconnect(); } } catch (e) {}
    krIO = null;
    try { if (krTask) { krTask.destroy(); } } catch (e) {}
    krTask = null;
    krDoc = null;
    krQueue = [];
    krBusy = false;
    krNear = {};
    $("kr-pages").innerHTML = "";
    Object.keys(krFp).forEach(krFlipDrop);
    krAnim = false;
    krDrag = null;
    kmReset();
  }

  function krStart() {
    krStop();
    var x = ktX(), gen = krGen;
    krMsg(x.loading, false);
    $("kr-bar").classList.add("hidden");
    krLib(function (lib) {
      if (gen !== krGen) { return; }
      if (!lib) { krMsg(x.rfail, true); return; }
      var task;
      try {
        task = lib.getDocument({ url: krUrl(krId, krLang), rangeChunkSize: 262144, disableAutoFetch: true, disableStream: true });
      } catch (e) { krMsg(x.rfail, true); return; }
      krTask = task;
      task.promise.then(function (doc) {
        if (gen !== krGen) { try { doc.destroy(); } catch (e) {} return; }
        krDoc = doc;
        krN = doc.numPages;
        return doc.getPage(Math.min(4, krN)).then(function (pg) {
          if (gen !== krGen) { return; }
          var vp = pg.getViewport({ scale: 1 });
          krRatio = vp.width / vp.height;
          return doc.getPage(1).then(function (p1) {
            if (gen !== krGen) { return; }
            var v1 = p1.getViewport({ scale: 1 });
            // Ba'zi fayllarda 1-bet - jildning yon tomoni (tor tasma): o'qishda ko'rsatilmaydi
            krFirst = (krN > 2 && v1.width / v1.height < krRatio * 0.6) ? 2 : 1;
            // Mundarija va matn bor-yo'qligi (js/07-kitob-matn.js); xato bo'lsa ham kitob ochiladi
            return kmPrep().then(function () { if (gen === krGen) { krReady(); } },
                                 function () { if (gen === krGen) { krReady(); } });
          });
        });
      })["catch"](function () { if (gen === krGen) { krMsg(x.rfail, true); } });
    });
  }

  function krReady() {
    krMsg("", false);
    var rng = $("kr-range");
    rng.min = krFirst;
    rng.max = krN;
    $("kr-bar").classList.remove("hidden");
    krSet(Math.min(Math.max(ktBet(krId, krLang) || krFirst, krFirst), krN));
    if (krMode === "text" && !kmHasText) { krMode = "flip"; }       // skaner fayl: matn rejimi yo'q
    krModeApply();
    try {
      if (krMode !== "scroll" && !window.localStorage.getItem("hp_kt_hint")) {
        window.localStorage.setItem("hp_kt_hint", "1");
        showToast(ktX().swipe);
      }
    } catch (e) {}
  }

  /* --- varaqlash: bitta bet ekranda, barmoq bilan surilsa bet buriladi --- */
  // Rejimlar: "text" - qayta terilgan matn (asosiy), "flip" - asl sahifa varaqlab, "scroll" - asl sahifa pastga surib
  var krMode = "text", krFirst = 1, krRatio = 0.65, krFp = {}, krAnim = false, krDrag = null;
  try { var krSaqlangan = window.localStorage.getItem("hp_kt_rejim"); if (/^(text|flip|scroll)$/.test(krSaqlangan || "")) { krMode = krSaqlangan; } } catch (e) {}

  function krFlipBox(el, ratio) {
    var st = $("kr-flip"), W = st.clientWidth || 320, H = st.clientHeight || 480;
    var w = Math.min(W, H * ratio), h = w / ratio;
    el.style.width = w + "px";
    el.style.height = h + "px";
    el.style.left = ((W - w) / 2) + "px";
    el.style.top = ((H - h) / 2) + "px";
  }

  function krFlipEl(n) {
    if (n < krFirst || n > krN || !krDoc) { return null; }
    if (krFp[n]) { return krFp[n]; }
    var el = document.createElement("div");
    el.className = "kr-fp";
    el.innerHTML = '<i class="kr-fsh"></i>';
    krFlipBox(el, krRatio);
    $("kr-flip").appendChild(el);
    krFp[n] = el;
    var gen = krGen;
    krDoc.getPage(n).then(function (pg) {
      if (gen !== krGen || krFp[n] !== el) { return; }
      var base = pg.getViewport({ scale: 1 });
      krFlipBox(el, base.width / base.height);
      var dpr = Math.min(window.devicePixelRatio || 1, 2.5);
      var scale = ((parseFloat(el.style.width) || 320) * dpr) / base.width;
      var px = base.width * scale * base.height * scale;
      if (px > 5200000) { scale *= Math.sqrt(5200000 / px); }
      var vp = pg.getViewport({ scale: scale });
      var c = document.createElement("canvas");
      c.width = Math.floor(vp.width);
      c.height = Math.floor(vp.height);
      return pg.render({ canvasContext: c.getContext("2d"), viewport: vp }).promise.then(function () {
        try { pg.cleanup(); } catch (e) {}
        if (gen !== krGen || krFp[n] !== el) { c.width = 0; c.height = 0; return; }
        el.insertBefore(c, el.firstChild);
      });
    })["catch"](function () {});
    return el;
  }

  // p: 0 - bet tekis yotibdi, 1 - to'liq burilib ketgan
  function krTurn(el, p, anim) {
    if (!el) { return; }
    el.style.transition = anim ? "transform .42s cubic-bezier(.3,.7,.3,1),opacity .42s" : "none";
    el.style.transform = "rotateY(" + (-118 * p) + "deg)";
    el.style.opacity = p > 0.82 ? String(Math.max(0, (1 - p) / 0.18)) : "1";
    var sh = el.querySelector(".kr-fsh");
    if (sh) { sh.style.transition = anim ? "opacity .42s" : "none"; sh.style.opacity = String(Math.min(0.55, p * 0.9)); }
  }

  function krFlipDrop(k) {
    var el = krFp[k];
    if (!el) { return; }
    var c = el.querySelector("canvas");
    if (c) { c.width = 0; c.height = 0; }
    if (el.parentNode) { el.parentNode.removeChild(el); }
    delete krFp[k];
  }

  function krFlipLay() {
    Object.keys(krFp).forEach(function (k) { if (Math.abs(parseInt(k, 10) - krCur) > 2) { krFlipDrop(k); } });
    [0, 1, -1, 2].forEach(function (d) {
      var n = krCur + d, el = krFlipEl(n);
      if (!el) { return; }
      el.style.zIndex = d < 0 ? "4" : String(3 - d);
      krTurn(el, d < 0 ? 1 : 0, false);
    });
  }

  function krFlipGo(dir) {
    if (krAnim || !krDoc) { return; }
    var n = krCur + dir;
    if (n < krFirst || n > krN) { return; }
    var el = dir > 0 ? krFp[krCur] : krFlipEl(n);
    if (!el) { return; }
    krAnim = true;
    var gen = krGen;
    // bitta kadr kutamiz: bet hozirgi holatidan silliq harakatlansin
    setTimeout(function () { krTurn(el, dir > 0 ? 1 : 0, true); }, 20);
    setTimeout(function () {
      krAnim = false;
      if (gen !== krGen) { return; }
      krSet(n);
      ktBet(krId, krLang, n);
      krFlipLay();
    }, 470);
    try { if (tg && tg.HapticFeedback) { tg.HapticFeedback.selectionChanged(); } } catch (e) {}
  }

  function krFlipDown(ev) {
    if (krAnim || !krDoc || krMode !== "flip") { return; }
    krDrag = { x: ev.clientX, y: ev.clientY, dir: 0, p: 0 };
  }

  function krFlipMove(ev) {
    var d = krDrag;
    if (!d || krAnim) { return; }
    var dx = ev.clientX - d.x, W = $("kr-flip").clientWidth || 320;
    if (!d.dir) {
      if (Math.abs(dx) < 10) { return; }
      d.dir = dx < 0 ? 1 : -1;
      var n = krCur + d.dir;
      if (n < krFirst || n > krN) { d.dir = 2; }                 // chetda - burilmaydi
      d.el = d.dir === 1 ? krFp[krCur] : d.dir === -1 ? krFlipEl(krCur - 1) : null;
    }
    if (!d.el) { return; }
    var f = Math.min(1, Math.max(0, Math.abs(dx) / W * 1.25));
    if ((d.dir === 1 && dx > 0) || (d.dir === -1 && dx < 0)) { f = 0; }
    d.p = d.dir === 1 ? f : 1 - f;
    krTurn(d.el, d.p, false);
  }

  function krFlipUp(ev) {
    var d = krDrag;
    krDrag = null;
    if (!d || krAnim) { return; }
    if (!d.dir) {                                                // bosish: o'ng tomon - keyingi, chap - oldingi
      var st = $("kr-flip").getBoundingClientRect(), fx = (ev.clientX - st.left) / (st.width || 1);
      if (Math.abs(ev.clientY - d.y) > 12) { return; }
      if (fx > 0.6) { krFlipGo(1); } else if (fx < 0.4) { krFlipGo(-1); }
      return;
    }
    if (!d.el) { return; }
    if (d.dir === 1) { if (d.p > 0.2) { krFlipGo(1); } else { krTurn(d.el, 0, true); } }
    else { if (d.p < 0.8) { krFlipGo(-1); } else { krTurn(d.el, 1, true); } }
  }

  function krFlipSize() {
    var st = $("kr-flip");
    st.style.height = Math.max(260, (window.innerHeight || 640) - 156) + "px";
  }

  function krModeApply() {
    var scr = $("scr-oqish");
    scr.classList.toggle("kr-flipm", krMode === "flip");
    scr.classList.toggle("kr-textm", krMode === "text");
    try { if (krIO) { krIO.disconnect(); } } catch (e) {}
    krIO = null;
    krQueue = [];
    krNear = {};
    $("kr-pages").innerHTML = "";
    $("km-flow").innerHTML = "";
    Object.keys(krFp).forEach(krFlipDrop);
    if (!krDoc) { return; }
    $("kr-t").textContent = ktName(krId);
    if (krMode !== "scroll") { try { window.scrollTo(0, 0); } catch (e) {} }
    if (krMode === "flip") {
      krFlipSize();
      krFlipLay();
    } else if (krMode === "text") {
      kmShow();
    } else {
      krBuild();
    }
  }

  function krModeSet(m) {
    if (krAnim || m === krMode || !krDoc) { return; }
    if (m === "text" && !kmHasText) { return; }
    krMode = m;
    try { window.localStorage.setItem("hp_kt_rejim", krMode); } catch (e) {}
    krModeApply();
  }

  // Betga o'tish (surgich): ikkala rejimda
  function krGo(n) {
    n = Math.min(Math.max(n, krFirst), krN);
    krSet(n);
    ktBet(krId, krLang, n);
    if (krMode === "flip") { krFlipLay(); } else if (krMode === "text") { kmGoPage(n); } else { krJump(n); }
  }

  /* --- pastga surib o'qish (ikkinchi rejim) --- */
  function krBuild() {
    var ratio = krRatio;
    var box = $("kr-pages"), frag = document.createDocumentFragment(), i;
    box.innerHTML = "";
    box.style.width = (KR_ZOOMS[krZoom] * 100) + "%";
    for (i = 1; i <= krN; i++) {
      var p = document.createElement("div");
      p.className = "kr-p";
      p.setAttribute("data-n", i);
      p.style.paddingTop = (100 / ratio) + "%";       // aspect-ratio eski iPhone'da yo'q
      if (i < krFirst) { p.style.display = "none"; }
      frag.appendChild(p);
    }
    box.appendChild(frag);
    krNear = {};
    if (window.IntersectionObserver) {
      krIO = new IntersectionObserver(function (list) {
        list.forEach(function (en) {
          var n = parseInt(en.target.getAttribute("data-n"), 10);
          if (en.isIntersecting) { krNear[n] = en.target; krWant(n); }
          else { delete krNear[n]; krFree(en.target); }
        });
        krPos();
      }, { rootMargin: "120% 0px 120% 0px" });
      Array.prototype.forEach.call(box.children, function (el) { krIO.observe(el); });
    }
    if (krCur > krFirst) { krJump(krCur); } else { try { window.scrollTo(0, 0); } catch (e) {} }
  }

  function krPage(n) { return $("kr-pages").children[n - 1] || null; }

  function krJump(n) {
    var el = krPage(n);
    if (!el) { return; }
    var y = el.getBoundingClientRect().top + (window.scrollY || 0) - 64;
    try { window.scrollTo(0, Math.max(0, y)); } catch (e) {}
  }

  function krSet(n) {
    krCur = n;
    $("kr-pg").textContent = ktX().pg(n, krN);
    $("kr-range").value = n;
    kmMarkIcon();
  }

  // Hozir o'qilayotgan sahifa: ekran tepasidan biroz pastdagi chiziqni kesib turgani
  function krPos() {
    if (!krDoc || krMode !== "scroll") { return; }
    var chiziq = (window.innerHeight || 600) * 0.35, best = null, k;
    for (k in krNear) {
      if (!Object.prototype.hasOwnProperty.call(krNear, k)) { continue; }
      var r = krNear[k].getBoundingClientRect();
      if (r.top <= chiziq && r.bottom > chiziq) { best = parseInt(k, 10); break; }
    }
    if (best && best !== krCur) {
      krSet(best);
      ktBet(krId, krLang, best);
    }
  }

  function krWant(n) {
    var el = krPage(n);
    if (!el || el.getAttribute("data-z") === String(krZoom)) { return; }
    if (krQueue.indexOf(n) < 0) { krQueue.push(n); }
    krNext();
  }

  function krFree(el) {
    var c = el.querySelector("canvas");
    if (c) { c.width = 0; c.height = 0; el.removeChild(c); }
    el.removeAttribute("data-z");
  }

  function krNext() {
    if (krBusy || !krDoc || !krQueue.length) { return; }
    // Avval hozir o'qilayotgan sahifaga eng yaqini
    krQueue.sort(function (a, b) { return Math.abs(a - krCur) - Math.abs(b - krCur); });
    var n = krQueue.shift(), el = krPage(n), gen = krGen, z = krZoom;
    if (!el || !krNear[n] || el.getAttribute("data-z") === String(z)) { krNext(); return; }
    krBusy = true;
    var tugadi = function () { krBusy = false; if (gen === krGen) { krNext(); } };
    krDoc.getPage(n).then(function (pg) {
      if (gen !== krGen || !krNear[n]) { tugadi(); return; }
      var base = pg.getViewport({ scale: 1 });
      var w = el.clientWidth || 320;
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      var scale = (w * dpr) / base.width;
      var px = base.width * scale * base.height * scale;
      if (px > 5200000) { scale *= Math.sqrt(5200000 / px); }      // iPhone xotirasi uchun chegara
      var vp = pg.getViewport({ scale: scale });
      var c = document.createElement("canvas");
      c.width = Math.floor(vp.width);
      c.height = Math.floor(vp.height);
      el.style.paddingTop = (100 * base.height / base.width) + "%";
      return pg.render({ canvasContext: c.getContext("2d"), viewport: vp }).promise.then(function () {
        try { pg.cleanup(); } catch (e) {}
        if (gen !== krGen || !krNear[n] || z !== krZoom) { c.width = 0; c.height = 0; tugadi(); return; }
        krFree(el);
        el.appendChild(c);
        el.setAttribute("data-z", String(z));
        tugadi();
      });
    })["catch"](function () { tugadi(); });
  }

  function krZoomTo(d) {
    var z = Math.min(Math.max(krZoom + d, 0), KR_ZOOMS.length - 1);
    if (z === krZoom || !krDoc || krMode !== "scroll") { return; }
    var n = krCur;
    krZoom = z;
    $("kr-pages").style.width = (KR_ZOOMS[z] * 100) + "%";
    krQueue = [];
    Object.keys(krNear).forEach(function (k) { krWant(parseInt(k, 10)); });
    krJump(n);
  }

  function krClose() {
    krStop();
    document.body.classList.remove("kr-on");
    $("scr-oqish").classList.add("hidden");
    $("scr-kitob").classList.remove("hidden");
    if (ktOpenId) { ktRender(); }
    try { window.scrollTo(0, 0); } catch (e) {}
  }

  function ktSetup() {
    $("kt-back").addEventListener("click", ktClose);
    $("kr-back").addEventListener("click", krClose);
    $("kr-minus").addEventListener("click", function () { krZoomTo(-1); });
    $("kr-plus").addEventListener("click", function () { krZoomTo(1); });
    $("kr-range").addEventListener("input", function () { $("kr-pg").textContent = ktX().pg(this.value, krN); });
    $("kr-range").addEventListener("change", function () {
      krGo(parseInt(this.value, 10) || 1);
    });
    var st = $("kr-flip");
    if (window.PointerEvent) {
      st.addEventListener("pointerdown", krFlipDown);
      st.addEventListener("pointermove", krFlipMove);
      st.addEventListener("pointerup", krFlipUp);
      st.addEventListener("pointercancel", function () { var d = krDrag; krDrag = null; if (d && d.el) { krTurn(d.el, d.dir === 1 ? 0 : 1, true); } });
    } else {
      st.addEventListener("click", function (ev) {
        var r = st.getBoundingClientRect(), fx = (ev.clientX - r.left) / (r.width || 1);
        if (fx > 0.6) { krFlipGo(1); } else if (fx < 0.4) { krFlipGo(-1); }
      });
    }
    window.addEventListener("resize", function () {
      if (!krDoc || krMode !== "flip" || krAnim) { return; }
      krFlipSize();
      Object.keys(krFp).forEach(krFlipDrop);
      krFlipLay();
    });
    window.addEventListener("scroll", function () {
      if (!krDoc || krTick) { return; }
      krTick = setTimeout(function () { krTick = null; krPos(); }, 160);
    }, { passive: true });
  }

  ktSetup();
