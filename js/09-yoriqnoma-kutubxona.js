/* KUTUBXONA YO'RIQNOMASI (egasi, 2026-10-12: «webapp ga film olish uchun kirgan userlar uchun ham onboarding: filmni qayerdan
   topadi, dublyaj va sifatni qanday tanlaydi, tilni o'zgartirib boshqa tildagi filmlar, soundtrack eshitish/yuklab olish, kitob o'qish»).
   Kutubxonachi Madam Pins kutubxonaning O'ZIDA ko'rsatadi. Bir o'tirishda ko'p narsa bo'lmasin (egasi) - TO'RT QISM, har biri alohida tashrifda:
     1) filmlar - birinchi kirishda (hali film olmagan odamga): film -> dublyaj -> sifat -> o'zi bosadi -> film bot chatiga keldi;
     2) til - keyingi safar kutubxona ochilganda; 3) soundtrack; 4) kitoblar.
   Qismlar orasida kamida KQ_ORA o'tadi; har qism kutubxona ochilgandan KY_KUT keyin boshlanadi. Belgi hp_kq (oxirgi tugagan qism).
   Kutubxona tuzilishi o'zgarsa - shu qadamlarni ham yangilang. Dvigatel: yqOch (09-yoriqnoma.js). */
"use strict";

  var KQ_ORA = 45 * 1000;
  var KQ_RASM = "img/pins/pins.webp";
  var KQ_TX = {
    uz: { kim: "Madam Pins · kutubxonachi",
          f1: "Xush kelibsiz! Bu — kutubxona. Mana Garri Potterning sakkizta filmi, pastroqda — Fantastik maxluqlar. Hammasi bepul.",
          f2: "Ko'rmoqchi bo'lgan filmni bosing — masalan, birinchisini.",
          f3: "O'zbek tilida ikki xil dublyaj bor. Qaysi biri yoqsa, o'shani tanlang.",
          f4: "Endi sifat: Full HD — eng tiniq, hajmi katta; HD — o'rtacha; SD — eng yengil, internet sekin bo'lsa qulay. Raqam — fayl hajmi, qulf — bu sifat hali tayyor emas.",
          f5: "Tanlagan sifatingizni bosing — film shu zahoti bot chatiga yuboriladi.",
          f6: "Film yuborilmoqda…", f6b: "Yuborilmoqda…",
          f7: "Tayyor! Film bot chatiga keldi — Telegram'da botni ochib tomosha qiling. Qolgan filmlarni ham xuddi shunday olasiz.",
          l1: "Filmlarni boshqa tilda ham olsa bo'ladi. Profilingizni oching.",
          l2: "Bu yerda ilova tilini tanlaysiz: o'zbek, rus yoki ingliz. Til almashsa, kutubxonadagi filmlar ham o'sha tilda yuboriladi.",
          l3: "Kutubxonaga qaytamiz — «Ortga»ni bosing.",
          m1: "Bu — filmlarning musiqasi, soundtrack albomlari. Birinchi albom bepul, qolganlari galleonga ochiladi.",
          m2: "Albomni oching.",
          m3: "Shu tugma — ilovaning o'zida tinglash.",
          m4: "Bu — yuklab olish: albom bot chatiga yuboriladi, keyin internetsiz ham eshitasiz.",
          m5: "Bu — treklar ro'yxati: istalganini bosib tinglang.",
          m6: "Kutubxonaga qaytamiz — «Ortga»ni bosing.",
          k1: "Bu — kitoblar javoni: yetti kitob. Birinchisi bepul va u tanlab qo'yilgan, qolganlari galleonga ochiladi.",
          k2: "Kitobni oching.",
          k3: "«O'qish»ni bosing — kitob shu ilovaning o'zida ochiladi, qolgan joyingiz eslab qolinadi.",
          k4: "Aa — harf kattaligi, fon va ko'rinish.",
          k5: "Bu yerda — mundarija, xatcho'plar va qidiruv. Yoqimli mutolaa!" },
    ru: { kim: "Мадам Пинс · библиотекарь",
          f1: "Добро пожаловать! Это библиотека. Вот восемь фильмов о Гарри Поттере, ниже — Фантастические твари. Всё бесплатно.",
          f2: "Нажмите на фильм, который хотите посмотреть, — например, первый.",
          f3: "На узбекском есть две озвучки. Выберите ту, что нравится.",
          f4: "Теперь качество: Full HD — самое чёткое, файл большой; HD — среднее; SD — самое лёгкое, удобно при медленном интернете. Число — размер файла, замок — это качество ещё не готово.",
          f5: "Нажмите на выбранное качество — фильм сразу придёт в чат с ботом.",
          f6: "Фильм отправляется…", f6b: "Отправляется…",
          f7: "Готово! Фильм в чате с ботом — откройте бота в Telegram и смотрите. Остальные фильмы берутся так же.",
          l1: "Фильмы можно получить и на другом языке. Откройте профиль.",
          l2: "Здесь выбирается язык приложения: узбекский, русский или английский. Сменится язык — и фильмы будут приходить на нём.",
          l3: "Вернёмся в библиотеку — нажмите «Назад».",
          m1: "Это музыка из фильмов — альбомы саундтреков. Первый бесплатный, остальные открываются за галлеоны.",
          m2: "Откройте альбом.",
          m3: "Эта кнопка — слушать прямо в приложении.",
          m4: "А это — скачать: альбом придёт в чат с ботом, потом можно слушать без интернета.",
          m5: "Это список треков: нажмите на любой и слушайте.",
          m6: "Вернёмся в библиотеку — нажмите «Назад».",
          k1: "Это книжная полка: семь книг. Первая бесплатна и уже выбрана, остальные открываются за галлеоны.",
          k2: "Откройте книгу.",
          k3: "Нажмите «Читать» — книга откроется прямо здесь, а место, где вы остановились, запомнится.",
          k4: "Aa — размер шрифта, фон и вид.",
          k5: "Здесь — оглавление, закладки и поиск. Приятного чтения!" },
    en: { kim: "Madam Pince · librarian",
          f1: "Welcome! This is the library. Here are the eight Harry Potter films, and below — Fantastic Beasts. All free.",
          f2: "Tap the film you want to watch — the first one, for example.",
          f3: "There are two Uzbek dubs. Pick the one you like.",
          f4: "Now the quality: Full HD — sharpest, large file; HD — medium; SD — lightest, handy on slow internet. The number is the file size; a lock means that quality isn't ready yet.",
          f5: "Tap the quality you chose — the film goes straight to your chat with the bot.",
          f6: "Sending the film…", f6b: "Sending…",
          f7: "Done! The film is in your chat with the bot — open the bot in Telegram and enjoy. Other films work the same way.",
          l1: "You can get the films in another language too. Open your profile.",
          l2: "Here you choose the app language: Uzbek, Russian or English. Change it and the films come in that language.",
          l3: "Back to the library — tap “Back”.",
          m1: "This is the films' music — soundtrack albums. The first one is free, the rest open for galleons.",
          m2: "Open the album.",
          m3: "This button plays it right here in the app.",
          m4: "And this downloads it: the album goes to your chat with the bot, so you can listen offline.",
          m5: "This is the track list: tap any track to listen.",
          m6: "Back to the library — tap “Back”.",
          k1: "This is the bookshelf: seven books. The first is free and already selected; the rest open for galleons.",
          k2: "Open the book.",
          k3: "Tap “Read” — the book opens right here, and your place is remembered.",
          k4: "Aa — font size, background and layout.",
          k5: "Here — contents, bookmarks and search. Happy reading!" }
  };
  function kqT(k) { return (KQ_TX[lang] || KQ_TX.uz)[k] || ""; }
  function kqBor() { try { return window.localStorage.getItem(TK("hp_kq")); } catch (e) { return "x"; } }
  function kqQoy(n) { try { window.localStorage.setItem(TK("hp_kq"), String(n)); window.localStorage.setItem(TK("hp_kq_t"), String(Date.now())); } catch (e) {} }
  function kqVaqt() { try { return parseInt(window.localStorage.getItem(TK("hp_kq_t")) || "0", 10) || 0; } catch (e) { return 0; } }
  function kqKatalog() { return !$("scr-cat").classList.contains("hidden"); }
  function kqKor(sel) { var e = document.querySelector(sel); return !!(e && e.getClientRects().length); }

  function kqQism(n) {
    var Q = yqQ;
    if (n === 1) {
      var q = [{ el: Q("#rows .rowsec .rowsec-h"), m: kqT("f1") },
               { el: Q("#rows .card:not(.soon)"), m: kqT("f2"), tap: true }];
      var ikki = false;
      try { ikki = qsDubList(MOVIES[0].id).length > 1; } catch (e) {}
      if (ikki) { q.push({ el: Q("#qs #qs-dubs"), m: kqT("f3") }); }
      return q.concat([{ el: Q("#qs #qs-list"), m: kqT("f4") },
                       { el: Q("#qs #qs-list .qs-row:not(.lock)"), m: kqT("f5"), tap: true },
                       { el: Q("#scr-cat .cat-head"), m: kqT("f6"), kut: "film", b: kqT("f6b") },
                       { el: Q("#scr-cat .cat-head"), m: kqT("f7") }]);
    }
    if (n === 2) {
      return [{ el: Q("#scr-cat #pm-btn"), m: kqT("l1"), tap: true },
              { el: Q("#pm #pm-langs"), m: kqT("l2") },
              { el: Q("#pm #pm-close"), m: kqT("l3"), tap: true }];
    }
    if (n === 3) {
      return [{ el: Q("#rows .ms-row"), m: kqT("m1") },
              { el: Q("#rows .ms-row .ms-card:not(.lock)"), m: kqT("m2"), tap: true },
              { el: Q("#scr-album #ms-play"), m: kqT("m3") },
              { el: Q("#scr-album #ms-dl"), m: kqT("m4") },
              { el: Q("#scr-album #ms-list"), m: kqT("m5") },
              { el: Q("#scr-album #ms-back"), m: kqT("m6"), tap: true }];
    }
    return [{ el: Q("#rows .kt-shelf"), m: kqT("k1") },
            { el: Q("#rows .kt-info .kt-go"), m: kqT("k2"), tap: true },
            { el: Q("#scr-kitob #kt-acts button"), m: kqT("k3"), tap: true },
            { el: Q("#scr-oqish #kr-aa"), m: kqT("k4") },
            { el: Q("#scr-oqish #kr-nav"), m: kqT("k5") }];
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
      yqOch(kqQism(n), { kim: kqT("kim"), rasm: KQ_RASM, tugash: function () { kqQoy(n); } });
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
