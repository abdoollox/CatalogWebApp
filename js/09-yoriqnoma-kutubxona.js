/* KUTUBXONA YO'RIQNOMASI (egasi, 2026-10-12: «webapp ga film olish uchun kirgan userlar uchun ham onboarding: filmni qayerdan
   topadi, dublyaj va sifatni qanday tanlaydi, tilni o'zgartirib boshqa tildagi filmlar, soundtrack eshitish/yuklab olish, kitob o'qish»).
   Kutubxonaning O'ZIDA ko'rsatiladi. KO'RINISHI ZAMONAVIY (egasi, 2026-10-12: kutubxona Garri Potter uslubida emas, zamonaviy dizaynda —
   yo'riqnoma ham shunday): qahramon/rasm yo'q, qadamda qisqa sarlavha + matn (yqOch(.., {zamon: 1}), css «ZAMONAVIY KO'RINISH»). Bir o'tirishda ko'p narsa bo'lmasin (egasi) - TO'RT QISM, har biri alohida tashrifda:
     1) filmlar - birinchi kirishda (hali film olmagan odamga): film kartasi -> pleyer: ko'rish, ovoz va sifat, yuklab olish -> ortga
        (2026-10-17 gacha: dublyaj -> sifat -> film bot chatiga);
     2) til - keyingi safar kutubxona ochilganda; 3) soundtrack; 4) kitoblar.
   Qismlar orasida kamida KQ_ORA o'tadi; har qism kutubxona ochilgandan KY_KUT keyin boshlanadi. Belgi hp_kq (oxirgi tugagan qism).
   Kutubxona tuzilishi o'zgarsa - shu qadamlarni ham yangilang. Dvigatel: yqOch (09-yoriqnoma.js). */
"use strict";

  var KQ_ORA = 45 * 1000;
  // Har qadam: [sarlavha, matn]
  var KQ_TX = {
    uz: { f1: ["Filmlar", "Garri Potterning sakkizta filmi shu yerda, pastroqda — Fantastik maxluqlar. Hammasi bepul."],
          f2: ["Filmni tanlang", "Ko'rmoqchi bo'lgan filmni bosing — masalan, birinchisini."],
          p1: ["Ilovada ko'rish", "Film shu yerda, ilovaning o'zida boshlanadi. To'xtatib qo'ysangiz, keyingi safar o'sha joydan davom etadi."],
          p2: ["Ovoz va sifat", "Tilni, dublyajni va sifatni shu yerda tanlaysiz — film to'xtamasdan o'sha daqiqadan davom etadi. Internet sekin bo'lsa — HD yoki SD."],
          p3: ["Telegram'da ko'rish", "Film bot chatiga yuboriladi — Telegram'ning o'zida ko'rasiz yoki yuklab olib, internetsiz tomosha qilasiz."],
          p4: ["Ortga", "Kutubxonaga qaytish uchun shu tugmani bosing."],
          l1: ["Boshqa tilda", "Filmlarni rus yoki ingliz tilida ham olsa bo'ladi. Profilni oching."],
          l2: ["Til", "Shu yerda ilova tilini tanlaysiz. Til almashsa, filmlar ham o'sha tilda yuboriladi."],
          l3: ["Ortga", "Kutubxonaga qaytish uchun shu tugmani bosing."],
          m1: ["Soundtrack", "Filmlar musiqasi — albomlar. Birinchi albom bepul, qolganlari galleonga ochiladi."],
          m2: ["Albom", "Albomni oching."],
          m3: ["Tinglash", "Ilovaning o'zida tinglash."],
          m4: ["Yuklab olish", "Albom bot chatiga yuboriladi — keyin internetsiz ham eshitasiz."],
          m5: ["Treklar", "Istalgan trekni bosib tinglang."],
          m6: ["Ortga", "Kutubxonaga qaytish uchun shu tugmani bosing."],
          k1: ["Kitoblar", "Yettita kitob. Birinchisi bepul va tanlab qo'yilgan, qolganlari galleonga ochiladi."],
          k2: ["Kitobni ochish", "Tanlangan kitobni oching."],
          k3: ["O'qish", "Kitob ilovaning o'zida ochiladi, to'xtagan joyingiz eslab qolinadi."],
          k4: ["Ko'rinish", "Harf kattaligi, fon va o'qish usuli."],
          k5: ["Mundarija", "Boblar, xatcho'plar va qidiruv."] },
    ru: { f1: ["Фильмы", "Здесь восемь фильмов о Гарри Поттере, ниже — Фантастические твари. Всё бесплатно."],
          f2: ["Выберите фильм", "Нажмите на фильм, который хотите посмотреть, — например, первый."],
          p1: ["Смотреть здесь", "Фильм начинается прямо здесь, в приложении. Остановите — в следующий раз продолжится с того же места."],
          p2: ["Звук и качество", "Здесь выбираются язык, озвучка и качество — фильм продолжится с той же минуты. Медленный интернет — выберите HD или SD."],
          p3: ["Смотреть в Telegram", "Фильм придёт в чат с ботом — смотрите прямо в Telegram или скачайте и смотрите без интернета."],
          p4: ["Назад", "Нажмите, чтобы вернуться в библиотеку."],
          l1: ["Другой язык", "Фильмы можно получить на узбекском или английском. Откройте профиль."],
          l2: ["Язык", "Здесь выбирается язык приложения. Сменится язык — фильмы будут приходить на нём."],
          l3: ["Назад", "Нажмите, чтобы вернуться в библиотеку."],
          m1: ["Саундтреки", "Музыка из фильмов — альбомы. Первый бесплатный, остальные открываются за галлеоны."],
          m2: ["Альбом", "Откройте альбом."],
          m3: ["Слушать", "Прямо в приложении."],
          m4: ["Скачать", "Альбом придёт в чат с ботом — потом можно слушать без интернета."],
          m5: ["Треки", "Нажмите на любой трек."],
          m6: ["Назад", "Нажмите, чтобы вернуться в библиотеку."],
          k1: ["Книги", "Семь книг. Первая бесплатна и уже выбрана, остальные открываются за галлеоны."],
          k2: ["Открыть книгу", "Откройте выбранную книгу."],
          k3: ["Читать", "Книга откроется прямо в приложении, место остановки запомнится."],
          k4: ["Вид", "Размер шрифта, фон и способ чтения."],
          k5: ["Оглавление", "Главы, закладки и поиск."] },
    en: { f1: ["Films", "All eight Harry Potter films are here, and Fantastic Beasts below. All free."],
          f2: ["Pick a film", "Tap the film you want to watch — the first one, for example."],
          p1: ["Watch here", "The film starts right here in the app. Stop it, and next time it picks up where you left off."],
          p2: ["Audio & quality", "Pick the language, dub and quality here — the film keeps playing from the same minute. Slow internet? Choose HD or SD."],
          p3: ["Watch in Telegram", "The film goes to your chat with the bot — watch it right in Telegram or download it to watch offline."],
          p4: ["Back", "Tap to go back to the library."],
          l1: ["Other languages", "You can get the films in Uzbek or Russian too. Open your profile."],
          l2: ["Language", "Choose the app language here. Change it and the films come in that language."],
          l3: ["Back", "Tap to return to the library."],
          m1: ["Soundtracks", "The films' music as albums. The first one is free, the rest open for galleons."],
          m2: ["Album", "Open the album."],
          m3: ["Listen", "Right here in the app."],
          m4: ["Download", "The album goes to your chat with the bot — listen offline later."],
          m5: ["Tracks", "Tap any track to listen."],
          m6: ["Back", "Tap to return to the library."],
          k1: ["Books", "Seven books. The first is free and already selected; the rest open for galleons."],
          k2: ["Open the book", "Open the selected book."],
          k3: ["Read", "The book opens right in the app, and your place is remembered."],
          k4: ["Display", "Font size, background and reading mode."],
          k5: ["Contents", "Chapters, bookmarks and search."] }
  };
  function kqT(k) { return (KQ_TX[lang] || KQ_TX.uz)[k] || ""; }
  // Qadam: sarlavha + matn (+ boshqa maydonlar)
  function kqQ(sel, k, x) {
    var t = kqT(k), q = { el: typeof sel === "function" ? sel : yqQ(sel), s: t[0], m: t[1] };
    for (var a in (x || {})) { q[a] = x[a]; }
    return q;
  }
  function kqBor() { try { return window.localStorage.getItem(TK("hp_kq")); } catch (e) { return "x"; } }
  function kqQoy(n) { try { window.localStorage.setItem(TK("hp_kq"), String(n)); window.localStorage.setItem(TK("hp_kq_t"), String(Date.now())); } catch (e) {} }
  function kqVaqt() { try { return parseInt(window.localStorage.getItem(TK("hp_kq_t")) || "0", 10) || 0; } catch (e) { return 0; } }
  function kqKatalog() { return !$("scr-cat").classList.contains("hidden"); }
  function kqKor(sel) { var e = document.querySelector(sel); return !!(e && e.getClientRects().length); }

  function kqQism(n) {
    if (n === 1) {
      // 2026-10-17: karta pleyerni ochadi - film ilovada ko'riladi, yuklab olish alohida tugma
      return [kqQ("#rows .rowsec .rowsec-h", "f1"), kqQ("#rows .card:not(.soon)", "f2", { tap: true }),
              kqQ("#scr-pleyer .pl-cta-row", "p1"), kqQ("#scr-pleyer #pl-bot", "p3"),
              kqQ("#scr-pleyer #pl-rows", "p2"), kqQ("#scr-pleyer #pl-back", "p4", { tap: true })];
    }
    if (n === 2) {
      return [kqQ("#scr-cat #pm-btn", "l1", { tap: true }), kqQ("#pm #pm-langs", "l2"), kqQ("#pm #pm-close", "l3", { tap: true })];
    }
    if (n === 3) {
      return [kqQ("#rows .ms-row", "m1"), kqQ("#rows .ms-row .ms-card:not(.lock)", "m2", { tap: true }),
              kqQ("#scr-album #ms-play", "m3"), kqQ("#scr-album #ms-dl", "m4"), kqQ("#scr-album #ms-list", "m5"),
              kqQ("#scr-album #ms-back", "m6", { tap: true })];
    }
    return [kqQ("#rows .kt-shelf", "k1"), kqQ("#rows .kt-info .kt-go", "k2", { tap: true }),
            kqQ("#scr-kitob #kt-acts button", "k3", { tap: true }), kqQ("#scr-oqish #kr-aa", "k4"), kqQ("#scr-oqish #kr-nav", "k5")];
  }
  // Qism boshlanishi uchun kerakli joy kutubxonada bormi (albomlar/kitoblar serverdan kelmagan bo'lsa - keyinroq)
  var KQ_BOSH = { 1: "#rows .card:not(.soon)", 2: "#scr-cat #pm-btn", 3: "#rows .ms-row .ms-card:not(.lock)", 4: "#rows .kt-info .kt-go" };

  var kqTm = 0, kqQayta = 0;
  // Kutubxona ochilganda / ilovaga qaytilganda: navbatdagi qism (biroz kutib)
  function kqTekshir(qayta) {
    clearTimeout(kqTm);
    kqQayta = qayta ? kqQayta + 1 : 0;
    kqTm = setTimeout(function () {
      if (yq || !kqKatalog() || document.hidden) { return; }
      // ustida oyna turibdi (nishon tabrigi, sifat tanlovi va h.k.) - yopilishini kutamiz
      if (!$("qs").classList.contains("hidden") || document.querySelector(".hpask:not(.hidden)")) {
        if (kqQayta < 40) { kqTekshir(true); }
        return;
      }
      var b = kqBor(), n;
      if (b === "x") { return; }
      if (b === null) {
        try { if (filmOlgan()) { return; } } catch (e) { return; }     // yo'riqnoma faqat hali film olmagan (yangi) odamga
        n = 1;
      } else {
        n = (parseInt(b, 10) || 0) + 1;
        if (n > 4 || Date.now() - kqVaqt() < KQ_ORA) { return; }
      }
      if (!kqKor(KQ_BOSH[n])) { if (kqQayta < 40) { kqTekshir(true); } return; }      // albomlar/kitoblar hali yuklanmagan
      kqQoy(n);
      try { $(KQ_BOSH[n].split(" ")[0] === "#rows" ? "rows" : "scr-cat").scrollIntoView({ block: "start" }); } catch (e) {}
      yqOch(kqQism(n), { zamon: 1, tugash: function () { kqQoy(n); } });
    }, typeof KY_KUT === "number" ? KY_KUT : 2000);
  }
  document.addEventListener("visibilitychange", function () { if (!document.hidden) { kqTekshir(); } });

  // Film yuborilmadi (obuna yo'q, xato): yo'riqnoma yopiladi va 1-qism keyingi safar qaytadan boshlanadi
  function kqFilmXato() {
    if (!yq || yq.q[yq.i].kut !== "film") { return; }
    yqTugat();
    try { window.localStorage.removeItem(TK("hp_kq")); } catch (e) {}
  }

  // Kutubxona qayerdan ochilsa ham (ilova ochilishi, Xogvartsdan, profil yoki albomdan qaytish) - navbatdagi qismni tekshiramiz
  try {
    new MutationObserver(function () { if (kqKatalog()) { kqTekshir(); } })
      .observe($("scr-cat"), { attributes: true, attributeFilter: ["class"] });
  } catch (e) {}
