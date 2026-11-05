/* So'rovnoma «Bizni qanday topdingiz?» (egasi, 2026-11-04/05) - Albus Dambldor bilan suhbat ko'rinishida.
   Savollar «The Mom Test» qoidalari bo'yicha: fikr va kelajak emas, o'tgan aniq voqealar (tahlil/mom-test-xulosa.md).
   Dambldor maqtov kutmaydi - har javobga faqat xolis gap («Tushunarli»). Javob bergan odamga bir marta 20 galleon
   (server: hpanketa.py, POST /api/anketa; kalitlar serverdagi ANKETA bilan BIR XIL bo'lishi shart).
   Kirish: kutubxonadagi karta (zamonaviy, qahramonsiz - #ankc), startapp=anketa, boyo'g'li xati.
   Server YOQIQ = False bo'lsa faqat adminga ko'rinadi.
   Ilova kodi bir necha faylga bo'lingan; hammasi BIR umumiy maydonda ishlaydi
   va index.html dagi TARTIBDA yuklanadi. Yuklanish paytida keyingi fayldagi
   narsani chaqirmang - tekshiruv: tools/tartib.js */
"use strict";

  var API_ANKETA = "https://bot.tizimshunos.uz/api/anketa";
  var ANK_RASM = { salom: "img/dambldor/salom.webp", savol: "img/dambldor/savol.webp", oylash: "img/dambldor/oylash.webp",
                   rahmat: "img/dambldor/rahmat.webp" };
  var ANK_KAM = 3;           // yozma javobda kamida shuncha harf (serverdagi MATN_KAM)

  // Savollar tartibi; "agar" - qachon so'raladi (oldingi javobga qarab).
  var ANK_Q = [
    { k: "qayerdan", tur: "bir", v: ["dost", "tg_kanal", "tg_guruh", "tg_qidiruv", "eslay_olmayman", "boshqa"] },   // Instagram/TikTok/YouTube yo'q (egasi, 2026-11-05)
    { k: "qayerdan_kim", tur: "matn", ixt: true, agar: function (j) { return ["dost", "tg_kanal", "tg_guruh", "boshqa"].indexOf(j.qayerdan) >= 0; } },
    { k: "oldin", tur: "bir", v: ["tv", "tg_boshqa", "sayt", "youtube", "kinoteatr", "korilmagan", "boshqa"] },
    { k: "maqsad", tur: "bir", v: ["film_korish", "film_yuklash", "farzandim", "soundtrack", "kitob", "xogvarts", "qiziqdim", "boshqa"] },
    { k: "oxirgi", tur: "kop", v: ["film", "darslar", "bellashuv", "turnir", "chat", "qurbaqa", "soundtrack", "kitob", "maxluqlar", "eslay_olmayman"] },
    { k: "aytdimi", tur: "bir", v: ["ha", "yoq"] },
    { k: "aytdi_matn", tur: "matn", agar: function (j) { return j.aytdimi === "ha"; } },
    // «Yo'q» desa - nega (o'tgan holat; «nima qilsak» emas, chunki bu xayoliy javob beradi - The Mom Test)
    { k: "aytmadi_sabab", tur: "bir", v: ["eslamadim", "qiziqmaydi", "yangiman", "ishonch_yoq", "boshqa"], agar: function (j) { return j.aytdimi === "yoq"; } },
    { k: "aytmadi_matn", tur: "matn", ixt: true, dan: "aytmadi_sabab", agar: function (j) { return j.aytmadi_sabab === "ishonch_yoq" || j.aytmadi_sabab === "boshqa"; } },
    { k: "yosh", tur: "bir", ixt: true, v: ["12", "13_17", "18_24", "25_34", "35"] }
  ];

  var ANK_T = {
    uz: {
      kick: "Xogvarts direktori", ism: "Albus Dambldor",
      kirish: function (n, g) { return ["Salom, " + n + "! Men Albus Dambldor, Xogvarts direktoriman.", "Maktabimizga qanday yo'l topganingizni bilmoqchiman. Bir necha savol, ikki daqiqa.",
        "To'g'ri yoki noto'g'ri javob yo'q — bilganingizni rost yozing. Faqat shoshmang: rahmat tariqasidagi " + g + " galleon o'ylab yozilgan javobga beriladi."]; },
      yana: "Yana ↓", bitta: "Bittasini tanlang", kopi: "Bir nechtasini tanlash mumkin", ozgar: "Javobni o'zgartirish", qayta: "Qaytadan sinash (javobim o'chadi)",
      boshla: "Boshladik", tayyor: "Tayyor", yubor: "Yuborish", otkaz: "O'tkazib yuborish", aytmayman: "Aytmayman", yop: "Yopish",
      yoz: "Yozing…", kam: "Biroz batafsilroq yozing — kamida bir-ikki so'z.",
      xolis: ["Tushunarli.", "Yozib oldim.", "Hm, qiziq.", "Shunday deng.", "Bilib oldim."],
      q: {
        qayerdan: "Bot haqida birinchi marta qayerda bilib qoldingiz?",
        qayerdan_kim: { dost: "Kim aytgan edi? Ism shart emas — masalan, «sinfdoshim» yoki «akam».", tg_kanal: "Qaysi kanal edi? Nomini eslasangiz, yozing.",
                        tg_guruh: "Qaysi guruh edi? Nomini eslasangiz, yozing.", boshqa: "Qayerda? Bir-ikki so'z bilan yozing." },
        oldin: "Bizdan oldin Garri Potter filmlarini oxirgi marta qayerda ko'rgan edingiz?",
        maqsad: "Botni birinchi ochgan kuningiz nima qilmoqchi edingiz?",
        oxirgi: "Oxirgi marta ilovaga kirganingizda nima qildingiz?",
        aytdimi: "Bot haqida biror kishiga aytganmisiz?",
        aytdi_matn: "Unga aynan nima deb aytgan edingiz? O'z so'zlaringiz bilan, eslaganingizcha yozing.",
        aytmadi_sabab: "Nega hali hech kimga aytmagansiz? Rostini ayting — bu biz uchun muhim.",
        aytmadi_matn: { ishonch_yoq: "Nima yetishmayapti? Bir-ikki so'z bilan yozing.", boshqa: "Qanday sabab? Bir-ikki so'z bilan yozing." },
        yosh: "Oxirgisi: yoshingizni aytsangiz bo'ladi, aytmasangiz ham mayli."
      },
      v: {
        dost: "Do'stim aytdi", tg_kanal: "Telegram kanal", tg_guruh: "Telegram guruh", tg_qidiruv: "Telegram qidiruvi",
        eslay_olmayman: "Eslay olmayman", boshqa: "Boshqa",
        tv: "Televizor", tg_boshqa: "Boshqa kanal yoki bot", sayt: "Internet sayti", youtube: "YouTube", kinoteatr: "Kinoteatr", korilmagan: "Ko'rmaganman",
        film_korish: "Film ko'rish", film_yuklash: "Film yuklab olish", farzandim: "Farzandimga qo'yish",
        soundtrack: "Musiqa tinglash", kitob: "Kitob o'qish", xogvarts: "Xogvartsga kirish", qiziqdim: "Shunchaki qiziqdim",
        film: "Film", darslar: "Dars", bellashuv: "Bellashuv", turnir: "Turnir", chat: "Chat",
        qurbaqa: "Shokolad qurbaqa", maxluqlar: "Maxluq yoki o'simlik",
        ha: "Ha, aytganman", yoq: "Yo'q, hali aytmaganman",
        eslamadim: "Shunchaki eslamadim", qiziqmaydi: "Tanishlarim Garri Potterga qiziqmaydi", yangiman: "Hali o'zim yaxshi tanishmadim", ishonch_yoq: "Tavsiya qiladigan darajada emas",
        "12": "12 yoshgacha", "13_17": "13–17", "18_24": "18–24", "25_34": "25–34", "35": "35 va undan katta"
      },
      oxirgi_v: { soundtrack: "Musiqa", kitob: "Kitob" },
      goyaga: "Yana bir gap: ilova uchun g'oyangiz bo'lsa, xonamdagi G'oyalar kosasiga yozing — har birini ko'rib chiqaman.", goyaB: "G'oya yozish",
      rahmat: function (n, g) { return g ? "Rahmat, " + n + ". Javoblaringizni yozib oldim. Va'da qilinganidek — " + g + " galleon." : "Rahmat, " + n + ". Javoblaringizni yozib oldim."; },
      oldin_bergan: "Siz bu savollarga javob bergansiz. Rahmat!",
      xato: "Aloqa yo'q — qayta urinib ko'ring",
      karta_k: "So'rovnoma", karta_t: "Dambldor savol bermoqchi", karta_g: function (g) { return "+" + g + " galleon"; },
      korik: "Faqat sizga ko'rinadi"
    },
    ru: {
      kick: "Директор Хогвартса", ism: "Альбус Дамблдор",
      kirish: function (n, g) { return ["Привет, " + n + "! Я Альбус Дамблдор, директор Хогвартса.", "Хочу узнать, как вы нашли дорогу в нашу школу. Несколько вопросов, две минуты.",
        "Правильных и неправильных ответов нет — пишите как было. Только не спешите: " + g + " галлеонов в благодарность даются за обдуманные ответы."]; },
      yana: "Ещё ↓", bitta: "Выберите один вариант", kopi: "Можно выбрать несколько", ozgar: "Изменить ответ", qayta: "Пройти заново (ответ удалится)",
      boshla: "Начнём", tayyor: "Готово", yubor: "Отправить", otkaz: "Пропустить", aytmayman: "Не скажу", yop: "Закрыть",
      yoz: "Напишите…", kam: "Напишите чуть подробнее — хотя бы пару слов.",
      xolis: ["Понятно.", "Записал.", "Хм, интересно.", "Вот как.", "Принято."],
      q: {
        qayerdan: "Где вы впервые узнали о боте?",
        qayerdan_kim: { dost: "Кто рассказал? Имя не нужно — например, «одноклассник» или «брат».", tg_kanal: "Какой это был канал? Если помните название, напишите.",
                        tg_guruh: "Какая это была группа? Если помните название, напишите.", boshqa: "Где именно? Напишите в двух словах." },
        oldin: "Где вы в последний раз смотрели фильмы о Гарри Поттере до нас?",
        maqsad: "Что вы хотели сделать в тот день, когда впервые открыли бота?",
        oxirgi: "Что вы делали, когда в последний раз заходили в приложение?",
        aytdimi: "Вы рассказывали кому-нибудь о боте?",
        aytdi_matn: "Что именно вы сказали? Своими словами, как помните.",
        aytmadi_sabab: "Почему вы пока никому не рассказали? Честно — для нас это важно.",
        aytmadi_matn: { ishonch_yoq: "Чего не хватает? В двух словах.", boshqa: "Какая причина? В двух словах." },
        yosh: "И последнее: можете указать возраст, а можете и не указывать."
      },
      v: {
        dost: "Друг рассказал", tg_kanal: "Telegram-канал", tg_guruh: "Telegram-группа", tg_qidiruv: "Поиск Telegram",
        eslay_olmayman: "Не помню", boshqa: "Другое",
        tv: "Телевизор", tg_boshqa: "Другой канал или бот", sayt: "Сайт", youtube: "YouTube", kinoteatr: "Кинотеатр", korilmagan: "Не смотрел(а)",
        film_korish: "Посмотреть фильм", film_yuklash: "Скачать фильм", farzandim: "Включить ребёнку",
        soundtrack: "Послушать музыку", kitob: "Почитать книгу", xogvarts: "Попасть в Хогвартс", qiziqdim: "Просто интересно",
        film: "Фильм", darslar: "Урок", bellashuv: "Состязание", turnir: "Турнир", chat: "Чат",
        qurbaqa: "Шоколадная лягушка", maxluqlar: "Существа и растения",
        ha: "Да, рассказывал(а)", yoq: "Нет, пока не рассказывал(а)",
        eslamadim: "Просто не вспомнил(а)", qiziqmaydi: "Знакомым не интересен Гарри Поттер", yangiman: "Сам(а) ещё не разобрался(лась)", ishonch_yoq: "Пока не настолько хорошо, чтобы советовать",
        "12": "До 12 лет", "13_17": "13–17", "18_24": "18–24", "25_34": "25–34", "35": "35 и старше"
      },
      oxirgi_v: { soundtrack: "Музыка", kitob: "Книга" },
      goyaga: "И ещё: если у вас есть идея для приложения, запишите её в Чашу идей в моём кабинете — я рассмотрю каждую.", goyaB: "Написать идею",
      rahmat: function (n, g) { return g ? "Спасибо, " + n + ". Я записал ваши ответы. Как и обещал — " + g + " галлеонов." : "Спасибо, " + n + ". Я записал ваши ответы."; },
      oldin_bergan: "Вы уже ответили на эти вопросы. Спасибо!",
      xato: "Нет связи — попробуйте ещё раз",
      karta_k: "Опрос", karta_t: "Вопросы от Дамблдора", karta_g: function (g) { return "+" + g + " галлеонов"; },
      korik: "Видно только вам"
    },
    en: {
      kick: "Headmaster of Hogwarts", ism: "Albus Dumbledore",
      kirish: function (n, g) { return ["Hi, " + n + "! I am Albus Dumbledore, Headmaster of Hogwarts.", "I'd like to know how you found your way to our school. A few questions, two minutes.",
        "There are no right or wrong answers — just tell it as it was. Only, take your time: the " + g + " galleons of thanks go to thoughtful answers."]; },
      yana: "More ↓", bitta: "Pick one", kopi: "You can pick several", ozgar: "Change answer", qayta: "Try again (my answer is deleted)",
      boshla: "Let's begin", tayyor: "Done", yubor: "Send", otkaz: "Skip", aytmayman: "Rather not say", yop: "Close",
      yoz: "Type here…", kam: "Please write a little more — at least a couple of words.",
      xolis: ["I see.", "Noted.", "Hm, interesting.", "Is that so.", "Understood."],
      q: {
        qayerdan: "Where did you first hear about the bot?",
        qayerdan_kim: { dost: "Who told you? No name needed — e.g. «a classmate» or «my brother».", tg_kanal: "Which channel was it? If you remember the name, write it.",
                        tg_guruh: "Which group was it? If you remember the name, write it.", boshqa: "Where exactly? A word or two is enough." },
        oldin: "Before us, where did you last watch the Harry Potter films?",
        maqsad: "On the day you first opened the bot, what were you trying to do?",
        oxirgi: "The last time you opened the app, what did you do?",
        aytdimi: "Have you told anyone about the bot?",
        aytdi_matn: "What exactly did you tell them? In your own words, as you remember it.",
        aytmadi_sabab: "Why haven't you told anyone yet? Be honest — it matters to us.",
        aytmadi_matn: { ishonch_yoq: "What's missing? A word or two.", boshqa: "What's the reason? A word or two." },
        yosh: "Last one: you may tell me your age, or not — either is fine."
      },
      v: {
        dost: "A friend told me", tg_kanal: "Telegram channel", tg_guruh: "Telegram group", tg_qidiruv: "Telegram search",
        eslay_olmayman: "I don't remember", boshqa: "Somewhere else",
        tv: "TV", tg_boshqa: "Another channel or bot", sayt: "A website", youtube: "YouTube", kinoteatr: "Cinema", korilmagan: "Hadn't seen them",
        film_korish: "Watch a film", film_yuklash: "Download a film", farzandim: "Put on for my child",
        soundtrack: "Listen to music", kitob: "Read the book", xogvarts: "Get into Hogwarts", qiziqdim: "Just curious",
        film: "Film", darslar: "Lesson", bellashuv: "Contest", turnir: "Tournament", chat: "Chat",
        qurbaqa: "Chocolate Frog", maxluqlar: "Creatures and plants",
        ha: "Yes, I have", yoq: "No, not yet",
        eslamadim: "I just didn't think of it", qiziqmaydi: "My friends aren't into Harry Potter", yangiman: "I'm still exploring it myself", ishonch_yoq: "Not good enough to recommend yet",
        "12": "Under 12", "13_17": "13–17", "18_24": "18–24", "25_34": "25–34", "35": "35 or older"
      },
      oxirgi_v: { soundtrack: "Music", kitob: "Book" },
      goyaga: "One more thing: if you have an idea for the app, write it in the Idea Bowl in my office — I review every one.", goyaB: "Write an idea",
      rahmat: function (n, g) { return g ? "Thank you, " + n + ". I've noted your answers. As promised — " + g + " galleons." : "Thank you, " + n + ". I've noted your answers."; },
      oldin_bergan: "You have already answered these questions. Thank you!",
      xato: "No connection — please try again",
      karta_k: "Survey", karta_t: "Dumbledore has questions", karta_g: function (g) { return "+" + g + " galleons"; },
      korik: "Only you can see this"
    }
  };
  function ankT() { return ANK_T[lang] || ANK_T.uz; }

  var ankData = null, ankKut = false, ankVaqt = 0, ankJ = {}, ankI = -1, ankLocal = null, ankBand = false, ankXi = 0;
  var ankTok = 0, ankIz = [];      // ankTok - kechikkan taymerlar eskirganini bilish; ankIz - javob berilgan savollar izi (o'zgartirish uchun)
  var ankSp = false;
  try {
    var ankS = (tg && tg.initDataUnsafe && tg.initDataUnsafe.start_param) || "";
    if (!ankS) { var ankM = /[?&#]tgWebAppStartParam=([^&#]+)/.exec((window.location.search || "") + (window.location.hash || "")); if (ankM) { ankS = decodeURIComponent(ankM[1]); } }
    ankSp = ankS === "anketa";
  } catch (e) { ankSp = false; }

  function ankIsm() {
    try { var u = tgUser(); if (u && u.first_name) { return u.first_name; } } catch (e) {}
    return lang === "ru" ? "друг" : lang === "en" ? "friend" : "do'stim";
  }

  // Mahalliy ko'rik (localhost): server o'rnida namuna
  function ankSample(body) {
    if (!ankLocal) { ankLocal = { done: false }; }
    if (body && body.reset) { ankLocal.done = false; }
    if (body && body.javob) { ankLocal.done = true; return { ok: true, on: true, done: true, yangi: true, galleon: 20 }; }
    return { ok: true, on: true, done: ankLocal.done, preview: true, admin: true, sovga: 20, kam: 3 };
  }
  function ankPost(body, cb) {
    if (!window.fetch) { cb(null); return; }
    window.fetch(API_ANKETA, { method: "POST", headers: { "Content-Type": "application/json", "X-Telegram-Init-Data": drInit() }, body: JSON.stringify(body || {}) })
      .then(function (r) { return r.json(); })
      .then(function (res) { cb(res && res.ok ? res : (MS_LOCAL ? ankSample(body) : res)); })
      ["catch"](function () { cb(MS_LOCAL ? ankSample(body) : null); });
  }

  // Kutubxona ochilganda (renderWorldBtn): 10 daqiqada bir martadan ko'p so'ralmaydi
  function ankLoad() {
    ankKarta();
    if (ankKut || Date.now() - ankVaqt < 600000) { return; }
    ankKut = true;
    ankPost({}, function (res) {
      ankKut = false;
      ankVaqt = Date.now();
      if (res && res.ok) {
        ankData = res;
        ankKarta();
        if (ankSp && res.on && !res.done) { ankSp = false; setTimeout(ankOch, 600); }
      }
    });
  }

  // Kutubxonadagi karta (egasi, 2026-11-05: chap tomonda Dambldor rasmi); javob berilgach yo'qoladi
  function ankKarta() {
    var hog = $("hogc"), c = $("ankc"), d = ankData, t = ankT();
    if (!hog) { return; }
    if (!c) {
      c = document.createElement("div");
      c.id = "ankc"; c.className = "ankc hidden"; c.setAttribute("role", "button"); c.tabIndex = 0;
      hog.parentNode.insertBefore(c, hog.nextSibling);
      c.onclick = ankOch;
      c.onkeydown = function (ev) { if (ev.key === "Enter" || ev.key === " ") { ev.preventDefault(); ankOch(); } };
    }
    var kor = !!(d && d.on && (!d.done || d.admin));      // adminga javob bergach ham turadi - «Qaytadan sinash» uchun
    c.classList.toggle("hidden", !kor);
    if (!kor) { return; }
    c.innerHTML = "";
    var im = document.createElement("img");
    im.className = "ankc-im"; im.alt = ""; im.src = ANK_RASM.salom;
    c.appendChild(im);
    var tx = drEl("span", "ankc-tx");
    tx.appendChild(drEl("span", "ankc-k", d.preview ? t.korik : t.karta_k));
    tx.appendChild(drEl("b", "ankc-t", t.karta_t));
    c.appendChild(tx);
    var g = drEl("span", "ankc-g");
    g.innerHTML = '<span class="pm-coin"></span>';
    g.appendChild(document.createTextNode("+" + (d.sovga || 20)));
    g.setAttribute("aria-label", t.karta_g(d.sovga || 20));
    c.appendChild(g);
  }

  // ---------- Suhbat oynasi ----------
  // Kirish paytida portret katta; suhbat boshlangach u sarlavha yoniga kichrayib o'tadi (ixcham) va suhbatga joy bo'shaydi,
  // oxirida (rahmat) yana kattalashadi.
  function ankEl() {
    var o = $("ank");
    if (o) { return o; }
    o = document.createElement("div");
    o.id = "ank"; o.className = "ank hidden";
    o.innerHTML = '<div class="ank-top"><div class="ank-por"><img id="ank-im" alt=""><i class="ank-halo"></i></div><div class="ank-id"><span class="ank-k" id="ank-k"></span><b class="ank-n" id="ank-n"></b></div>' +
      '<button class="ank-x" id="ank-x" type="button" aria-label="×"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M6.5 6.5l11 11M17.5 6.5l-11 11"/></svg></button></div>' +
      '<div class="ank-dots" id="ank-dots"></div>' +
      '<div class="ank-chat" id="ank-chat"></div>' +
      '<div class="ank-pas" id="ank-pas"></div>';
    document.body.appendChild(o);
    $("ank-x").onclick = ankYop;
    return o;
  }
  function ankKayf(k) {
    var im = $("ank-im");
    if (!im || im.getAttribute("data-k") === k) { return; }
    im.setAttribute("data-k", k);
    im.classList.remove("ank-al"); void im.offsetWidth; im.classList.add("ank-al");
    im.onerror = function () { im.onerror = null; im.src = "img/Direktor_crest.webp"; };
    im.src = ANK_RASM[k];
  }
  function ankOch() {
    var o = ankEl(), t = ankT();
    try { goyLoad(); } catch (e) {}
    ankTok++;
    ankJ = {}; ankI = -1; ankBand = false; ankIz = [];
    $("ank-k").textContent = t.kick;
    $("ank-n").textContent = t.ism;
    $("ank-chat").innerHTML = "";
    $("ank-pas").innerHTML = "";
    o.classList.remove("hidden", "ixcham", "yoz", "yuborildi");
    document.body.classList.add("ank-ochiq");
    ankKayf("salom");
    ankNuqta();
    if (ankData && ankData.done) {
      ankGap(t.oldin_bergan);
      var tg2 = [[t.yop, ankYop]];
      if (ankData.admin) { tg2.unshift([t.qayta, ankQaytaSina]); }
      ankTugma(tg2);
      return;
    }
    ankKetma(t.kirish(ankIsm(), (ankData && ankData.sovga) || 20), function () {
      ankTugma([[t.boshla, function () { ankMen(t.boshla); o.classList.add("ixcham"); ankKeyin(); }]]);
    }, true);
  }
  function ankYop() {
    ankTok++;
    var o = $("ank");
    if (o) { o.classList.add("hidden"); }
    document.body.classList.remove("ank-ochiq");
  }
  // Admin sinovi: javobni o'chirib, boshidan (sovg'a ham qaytariladi)
  function ankQaytaSina() {
    $("ank-pas").innerHTML = "";
    ankPost({ reset: 1 }, function (res) {
      if (!res || !res.ok) { showToast(ankT().xato, "err"); return; }
      ankData = res;
      ankVaqt = Date.now();
      ankKarta();
      try { walLoad(function () { try { pmRender(); } catch (e) {} }); } catch (e) {}
      ankOch();
    });
  }

  function ankGap(matn) {
    var ch = $("ank-chat"), q = drEl("div", "ank-q");
    q.appendChild(drEl("p", "", matn));
    ch.appendChild(q);
    ankPas();
    return q;
  }
  // Bir nechta xabar - birin-ketin, orasida «yozmoqda» nuqtalari (egasi, 2026-11-05)
  function ankKetma(royxat, cb, birinchiTez, kayf) {
    var tok = ankTok, i = 0;
    (function navbat() {
      if (tok !== ankTok) { return; }
      if (i >= royxat.length) { cb && cb(); return; }
      var m = royxat[i++];
      if (i === 1 && birinchiTez) { ankGap(m); setTimeout(navbat, 350); return; }
      ankYozmoqda(function () { ankKayf(kayf || "salom"); ankGap(m); navbat(); }, Math.min(1400, 450 + m.length * 9));
    })();
  }
  function ankMen(matn, p) {
    var ch = $("ank-chat"), a = drEl("div", "ank-a");
    a.appendChild(drEl("span", "", matn));
    if (p != null) {
      // O'z javobini bosib o'zgartirish (egasi: xato belgilagan bo'lsa ortga qaytsin)
      var b = drEl("button", "ank-ed");
      b.type = "button";
      b.setAttribute("aria-label", ankT().ozgar);
      b.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 20h4L19 9l-4-4L4 16z"/><path d="M13.5 6.5l4 4"/></svg>';
      a.appendChild(b);
      a.classList.add("ozgar");
      a.onclick = function () { if (!ankBand && !$("ank").classList.contains("yuborildi")) { ankQayt(p); } };
    }
    ch.appendChild(a);
    ankPas();
  }
  function ankPas() {
    var ch = $("ank-chat");
    setTimeout(function () { try { ch.scrollTo({ top: ch.scrollHeight, behavior: "smooth" }); } catch (e) { ch.scrollTop = ch.scrollHeight; } }, 30);
  }
  function ankYozmoqda(cb, ms) {
    var ch = $("ank-chat"), d = drEl("div", "ank-q ank-dot3"), tok = ankTok;
    d.innerHTML = "<i></i><i></i><i></i>";
    ch.appendChild(d); ankPas();
    ankKayf("oylash");
    setTimeout(function () { if (d.parentNode) { d.parentNode.removeChild(d); } if (tok === ankTok) { cb(); } }, ms || 650);
  }

  function ankSoni() { return ANK_Q.filter(function (q) { return !q.agar; }).length; }
  function ankNuqta() {
    var box = $("ank-dots"), n = ankSoni(), joriy = 0;
    ANK_Q.forEach(function (q, i) { if (!q.agar && i <= ankI) { joriy++; } });
    box.innerHTML = "";
    for (var i = 0; i < n; i++) { box.appendChild(drEl("i", i < joriy - 1 ? "on" : i === joriy - 1 ? "cur" : "")); }
  }

  function ankSavolMatni(q) { var t = ankT(), m = t.q[q.k]; return typeof m === "object" ? m[ankJ[q.dan || "qayerdan"]] : m; }
  function ankKeyin() {
    var i = ankI + 1;
    while (i < ANK_Q.length && ANK_Q[i].agar && !ANK_Q[i].agar(ankJ)) { i++; }
    ankI = i;
    $("ank-pas").innerHTML = "";
    if (i >= ANK_Q.length) { ankYubor(); return; }
    var q = ANK_Q[i];
    ankYozmoqda(function () { ankSavolKorsat(q, i); }, 700);
  }
  function ankSavolKorsat(q, i) {
    ankIz.push({ i: i, n: $("ank-chat").children.length });
    ankNuqta();
    ankKayf("savol");
    ankGap(ankSavolMatni(q));
    if (q.tur === "matn") { ankMatn(q); } else { ankVariant(q); }
  }
  // p-javobga qaytish: undan keyingi suhbat va javoblar o'chadi, savol qayta beriladi
  function ankQayt(p) {
    var iz = ankIz[p];
    if (!iz) { return; }
    ankTok++;
    var ch = $("ank-chat");
    while (ch.children.length > iz.n) { ch.removeChild(ch.lastChild); }
    ankIz.slice(p).forEach(function (z) { delete ankJ[ANK_Q[z.i].k]; });
    ankIz = ankIz.slice(0, p);
    ankI = iz.i;
    $("ank").classList.remove("yoz");
    $("ank-pas").innerHTML = "";
    ankSavolKorsat(ANK_Q[iz.i], iz.i);
  }
  function ankXolis() {
    var x = ankT().xolis;
    ankXi = (ankXi + 1 + Math.floor(Math.random() * (x.length - 1))) % x.length;
    return x[ankXi];
  }
  function ankJavobBerdi(q, korinish, qiymat) {
    $("ank").classList.remove("yoz");
    if (qiymat != null) { ankJ[q.k] = qiymat; } else { delete ankJ[q.k]; }
    try { if (tg && tg.HapticFeedback) { tg.HapticFeedback.selectionChanged(); } } catch (e) {}
    $("ank-pas").innerHTML = "";
    ankMen(korinish, ankIz.length - 1);
    var oxirgisi = ANK_Q.slice(ankI + 1).every(function (n) { return n.agar && !n.agar(ankJ); });
    if (oxirgisi) { ankKeyin(); return; }
    ankYozmoqda(function () { ankKayf("savol"); ankGap(ankXolis()); ankKeyin(); }, 600);
  }
  function ankNom(q, v) {
    var t = ankT();
    return (q.k === "oxirgi" && t.oxirgi_v[v]) || t.v[v] || v;
  }
  // Bitta tanlov - doiracha (bosilishi bilan yuboriladi); ko'p tanlov - katakcha va «Tayyor» (egasi: farqi ko'rinib tursin)
  var ANK_KATAK = '<svg viewBox="0 0 20 20" aria-hidden="true"><rect x="2.5" y="2.5" width="15" height="15" rx="4" fill="none" stroke="currentColor" stroke-width="1.6"/><path class="ank-tik" d="M6 10.3l2.7 2.7L14.2 7.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var ANK_DOIRA = '<svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="7.5" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>';
  function ankVariant(q) {
    var pas = $("ank-pas"), t = ankT(), tanlov = [], kop = q.tur === "kop", ok = null;
    pas.appendChild(drEl("p", "ank-tur", kop ? t.kopi : t.bitta));
    var g = drEl("div", "ank-vs" + (kop ? " kop" : ""));
    q.v.forEach(function (v) {
      var b = drEl("button", "ank-v");
      b.type = "button";
      b.innerHTML = kop ? ANK_KATAK : ANK_DOIRA;
      b.appendChild(drEl("span", "", ankNom(q, v)));
      b.onclick = function () {
        if (!kop) { b.classList.add("on"); setTimeout(function () { ankJavobBerdi(q, ankNom(q, v), v); }, 160); return; }
        var j = tanlov.indexOf(v);
        if (v === "eslay_olmayman") { tanlov = j < 0 ? ["eslay_olmayman"] : []; }
        else { tanlov = tanlov.filter(function (x) { return x !== "eslay_olmayman"; }); if (j < 0) { tanlov.push(v); } else { tanlov.splice(tanlov.indexOf(v), 1); } }
        Array.prototype.forEach.call(g.children, function (c, k) { c.classList.toggle("on", tanlov.indexOf(q.v[k]) >= 0); });
        ok.disabled = !tanlov.length;
      };
      g.appendChild(b);
    });
    var qut = drEl("div", "ank-vsw");
    qut.appendChild(g);
    var yana = drEl("button", "ank-yana", t.yana);
    yana.type = "button";
    yana.onclick = function () { try { g.scrollBy({ top: g.clientHeight * 0.7, behavior: "smooth" }); } catch (e) { g.scrollTop += 120; } };
    qut.appendChild(yana);
    pas.appendChild(qut);
    // Ro'yxat sig'masa: pasti xiralashadi va «Yana» belgisi chiqadi; oxirigacha surilsa yo'qoladi
    var tekshir = function () { qut.classList.toggle("ortiq", g.scrollHeight - g.scrollTop - g.clientHeight > 6); };
    g.addEventListener("scroll", tekshir, { passive: true });
    setTimeout(tekshir, 60);
    if (kop) {
      ok = drEl("button", "ank-ok", t.tayyor);
      ok.type = "button"; ok.disabled = true;
      ok.onclick = function () {
        var tartib = q.v.filter(function (v) { return tanlov.indexOf(v) >= 0; });
        ankJavobBerdi(q, tartib.map(function (v) { return ankNom(q, v); }).join(", "), tartib);
      };
      pas.appendChild(ok);
    }
    if (q.ixt) {
      var s = drEl("button", "ank-skip", t.aytmayman);
      s.type = "button";
      s.onclick = function () { ankJavobBerdi(q, t.aytmayman, null); };
      pas.appendChild(s);
    }
  }
  function ankMatn(q) {
    var pas = $("ank-pas"), t = ankT(), f = drEl("div", "ank-yoz");
    var ta = document.createElement("textarea");
    ta.maxLength = 300; ta.rows = 2; ta.placeholder = t.yoz;
    ta.onfocus = function () { $("ank").classList.add("yoz"); };
    ta.onblur = function () { setTimeout(function () { var o = $("ank"); if (o && document.activeElement !== ta) { o.classList.remove("yoz"); } }, 150); };
    var ok = drEl("button", "ank-ok", t.yubor);
    ok.type = "button";
    var iz = drEl("p", "ank-iz hidden", t.kam);
    ok.onclick = function () {
      var m = ta.value.trim(), harf = (m.match(/\p{L}/gu) || []).length;
      if (harf < ANK_KAM) {
        iz.classList.remove("hidden");
        f.classList.remove("ank-silk"); void f.offsetWidth; f.classList.add("ank-silk");
        ta.focus();
        return;
      }
      ankJavobBerdi(q, m, m);
    };
    f.appendChild(ta);
    f.appendChild(ok);
    pas.appendChild(f);
    pas.appendChild(iz);
    if (q.ixt) {
      var s = drEl("button", "ank-skip", t.otkaz);
      s.type = "button";
      s.onclick = function () { ankJavobBerdi(q, t.otkaz, null); };
      pas.appendChild(s);
    }
    setTimeout(function () { try { ta.focus({ preventScroll: true }); } catch (e) {} }, 300);
  }

  function ankYubor() {
    if (ankBand) { return; }
    ankBand = true;
    var t = ankT(), o = $("ank");
    o.classList.add("yuborildi");
    ankYozmoqda(function () {
      ankPost({ javob: ankJ, lang: lang }, function (res) {
        ankBand = false;
        if (!res || !res.ok || !res.done) {
          ankGap(t.xato);
          ankTugma([[t.yubor, function () { $("ank-pas").innerHTML = ""; ankYubor(); }]]);
          return;
        }
        if (ankData) { ankData.done = true; }
        ankKarta();
        o.classList.remove("ixcham");
        ankKayf("rahmat");
        var g = res.galleon || 0;
        ankGap(t.rahmat(ankIsm(), g));
        if (g) { setTimeout(function () { ankTanga(g); }, 350); }
        try { if (tg && tg.HapticFeedback) { tg.HapticFeedback.notificationOccurred("success"); } } catch (e) {}
        try { walLoad(function () { try { pmRender(); } catch (e) {} }); } catch (e) {}
        // G'oyalar qutisi ochiq bo'lsa - Dambldor o'sha yerga yo'llaydi (egasi, 2026-11-05)
        var goyaOn = false;
        try { goyaOn = goyOn(); } catch (e) {}
        if (!goyaOn) { ankTugma([[t.yop, ankYop]]); return; }
        ankKetma([t.goyaga], function () { ankTugma([[t.yop, ankYop], [t.goyaB, function () { goyOch(); }, 1]]); }, false, "rahmat");
      });
    }, 700);
  }
  function ankTugma(royxat) {
    var pas = $("ank-pas");
    pas.innerHTML = "";
    royxat.forEach(function (r, i) {
      var asosiy = royxat.some(function (x) { return x[2]; }) ? !!r[2] : i === royxat.length - 1;
      var b = drEl("button", asosiy ? "ank-ok" : "ank-skip", r[0]);
      b.type = "button"; b.onclick = r[1];
      pas.appendChild(b);
    });
  }
  // Tangalar portret ustidan sochiladi, hamyon soni sanaladi
  function ankTanga(g) {
    var o = $("ank"), por = o.querySelector(".ank-por"), i;
    for (i = 0; i < 18; i++) {
      var c = drEl("i", "ank-coin");
      c.style.left = (50 + (Math.random() * 70 - 35)) + "%";
      c.style.setProperty("--dx", (Math.random() * 160 - 80).toFixed(0) + "px");
      c.style.animationDelay = (i * 0.06).toFixed(2) + "s";
      por.appendChild(c);
      setTimeout((function (el) { return function () { if (el.parentNode) { el.parentNode.removeChild(el); } }; })(c), 2600);
    }
    var b = drEl("div", "ank-gal");
    b.innerHTML = '<span class="pm-coin"></span><b>+0</b>';
    por.appendChild(b);
    var n = 0, s = b.querySelector("b"), tm = setInterval(function () { n++; s.textContent = "+" + n; if (n >= g) { clearInterval(tm); } }, 45);
  }
