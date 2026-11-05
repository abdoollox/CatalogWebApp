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
    { k: "qayerdan", tur: "bir", v: ["dost", "tg_kanal", "tg_guruh", "tg_qidiruv", "instagram", "tiktok", "youtube", "eslay_olmayman", "boshqa"] },
    { k: "qayerdan_kim", tur: "matn", ixt: true, agar: function (j) { return ["dost", "tg_kanal", "tg_guruh", "boshqa"].indexOf(j.qayerdan) >= 0; } },
    { k: "oldin", tur: "bir", v: ["tv", "tg_boshqa", "sayt", "youtube", "kinoteatr", "korilmagan", "boshqa"] },
    { k: "maqsad", tur: "bir", v: ["film_korish", "film_yuklash", "farzandim", "soundtrack", "kitob", "xogvarts", "qiziqdim", "boshqa"] },
    { k: "oxirgi", tur: "kop", v: ["film", "darslar", "bellashuv", "turnir", "chat", "qurbaqa", "soundtrack", "kitob", "maxluqlar", "eslay_olmayman"] },
    { k: "aytdimi", tur: "bir", v: ["ha", "yoq"] },
    { k: "aytdi_matn", tur: "matn", agar: function (j) { return j.aytdimi === "ha"; } },
    { k: "yosh", tur: "bir", ixt: true, v: ["12", "13_17", "18_24", "25_34", "35"] }
  ];

  var ANK_T = {
    uz: {
      kick: "Xogvarts direktori", ism: "Albus Dambldor",
      kirish: function (n, g) { return "Assalomu alaykum, " + n + ". Men Albus Dambldor, Xogvarts direktoriman. Maktabimizga qanday yo'l topganingizni bilmoqchiman. Bir necha savol, ikki daqiqa.\n\nTo'g'ri yoki noto'g'ri javob yo'q — bilganingizni rost yozing. Faqat shoshmang: rahmat tariqasidagi " + g + " galleon o'ylab yozilgan javobga beriladi."; },
      boshla: "Boshladik", tayyor: "Tayyor", yubor: "Yuborish", otkaz: "O'tkazib yuborish", aytmayman: "Aytmayman", yop: "Yopish",
      yoz: "Yozing…", kam: "Biroz batafsilroq yozing — kamida bir-ikki so'z.",
      xolis: ["Tushunarli.", "Yozib oldim.", "Hm, qiziq.", "Shunday deng.", "Bilib oldim."],
      q: {
        qayerdan: "Bot haqida birinchi marta qayerda bilib qoldingiz?",
        qayerdan_kim: { dost: "Kim aytgan edi? Ism shart emas — masalan, «sinfdoshim» yoki «akam».", tg_kanal: "Qaysi kanal edi? Nomini eslasangiz, yozing.",
                        tg_guruh: "Qaysi guruh edi? Nomini eslasangiz, yozing.", boshqa: "Qayerda? Bir-ikki so'z bilan yozing." },
        oldin: "Bizdan oldin Garri Potter filmlarini oxirgi marta qayerda ko'rgan edingiz?",
        maqsad: "Botni birinchi ochgan kuningiz nima qilmoqchi edingiz?",
        oxirgi: "Oxirgi marta ilovaga kirganingizda nima qildingiz? Bir nechtasini tanlasa bo'ladi.",
        aytdimi: "Bot haqida biror kishiga aytganmisiz?",
        aytdi_matn: "Unga aynan nima deb aytgan edingiz? O'z so'zlaringiz bilan, eslaganingizcha yozing.",
        yosh: "Oxirgisi: yoshingizni aytsangiz bo'ladi, aytmasangiz ham mayli."
      },
      v: {
        dost: "Do'stim yoki tanishim aytdi", tg_kanal: "Telegram kanalda ko'rdim", tg_guruh: "Telegram guruhda ko'rdim", tg_qidiruv: "Telegram qidiruvida topdim",
        instagram: "Instagram", tiktok: "TikTok", youtube: "YouTube", eslay_olmayman: "Eslay olmayman", boshqa: "Boshqa",
        tv: "Televizorda", tg_boshqa: "Boshqa Telegram kanal yoki botda", sayt: "Internet saytida", kinoteatr: "Kinoteatrda", korilmagan: "Oldin ko'rmaganman",
        film_korish: "Filmni ko'rmoqchi edim", film_yuklash: "Filmni yuklab olmoqchi edim", farzandim: "Farzandimga qo'yib bermoqchi edim",
        soundtrack: "Musiqasini eshitmoqchi edim", kitob: "Kitobini o'qimoqchi edim", xogvarts: "Xogvartsga kirmoqchi edim", qiziqdim: "Shunchaki qiziqdim",
        film: "Film ko'rdim yoki oldim", darslar: "Dars o'tdim", bellashuv: "Bellashuvda qatnashdim", turnir: "Turnirda o'ynadim", chat: "Chatda yozishdim",
        qurbaqa: "Shokolad qurbaqani ochdim", maxluqlar: "Maxluq yoki o'simlik boqdim",
        ha: "Ha, aytganman", yoq: "Yo'q, hali aytmaganman",
        "12": "12 yoshgacha", "13_17": "13–17", "18_24": "18–24", "25_34": "25–34", "35": "35 va undan katta"
      },
      oxirgi_v: { soundtrack: "Musiqa tingladim", kitob: "Kitob o'qidim" },
      rahmat: function (n, g) { return g ? "Rahmat, " + n + ". Javoblaringizni yozib oldim. Va'da qilinganidek — " + g + " galleon." : "Rahmat, " + n + ". Javoblaringizni yozib oldim."; },
      oldin_bergan: "Siz bu savollarga javob bergansiz. Rahmat!",
      xato: "Aloqa yo'q — qayta urinib ko'ring",
      karta_k: "So'rovnoma", karta_t: "Dambldor savol bermoqchi", karta_g: function (g) { return "+" + g + " galleon"; },
      korik: "Faqat sizga ko'rinadi"
    },
    ru: {
      kick: "Директор Хогвартса", ism: "Альбус Дамблдор",
      kirish: function (n, g) { return "Здравствуйте, " + n + ". Я Альбус Дамблдор, директор Хогвартса. Хочу узнать, как вы нашли дорогу в нашу школу. Несколько вопросов, две минуты.\n\nПравильных и неправильных ответов нет — пишите как было. Только не спешите: " + g + " галлеонов в благодарность даются за обдуманные ответы."; },
      boshla: "Начнём", tayyor: "Готово", yubor: "Отправить", otkaz: "Пропустить", aytmayman: "Не скажу", yop: "Закрыть",
      yoz: "Напишите…", kam: "Напишите чуть подробнее — хотя бы пару слов.",
      xolis: ["Понятно.", "Записал.", "Хм, интересно.", "Вот как.", "Принято."],
      q: {
        qayerdan: "Где вы впервые узнали о боте?",
        qayerdan_kim: { dost: "Кто рассказал? Имя не нужно — например, «одноклассник» или «брат».", tg_kanal: "Какой это был канал? Если помните название, напишите.",
                        tg_guruh: "Какая это была группа? Если помните название, напишите.", boshqa: "Где именно? Напишите в двух словах." },
        oldin: "Где вы в последний раз смотрели фильмы о Гарри Поттере до нас?",
        maqsad: "Что вы хотели сделать в тот день, когда впервые открыли бота?",
        oxirgi: "Что вы делали, когда в последний раз заходили в приложение? Можно выбрать несколько.",
        aytdimi: "Вы рассказывали кому-нибудь о боте?",
        aytdi_matn: "Что именно вы сказали? Своими словами, как помните.",
        yosh: "И последнее: можете указать возраст, а можете и не указывать."
      },
      v: {
        dost: "Рассказал друг или знакомый", tg_kanal: "Увидел(а) в Telegram-канале", tg_guruh: "Увидел(а) в Telegram-группе", tg_qidiruv: "Нашёл(ла) через поиск Telegram",
        instagram: "Instagram", tiktok: "TikTok", youtube: "YouTube", eslay_olmayman: "Не помню", boshqa: "Другое",
        tv: "По телевизору", tg_boshqa: "В другом Telegram-канале или боте", sayt: "На сайте в интернете", kinoteatr: "В кинотеатре", korilmagan: "Раньше не смотрел(а)",
        film_korish: "Хотел(а) посмотреть фильм", film_yuklash: "Хотел(а) скачать фильм", farzandim: "Хотел(а) включить ребёнку",
        soundtrack: "Хотел(а) послушать музыку", kitob: "Хотел(а) почитать книгу", xogvarts: "Хотел(а) попасть в Хогвартс", qiziqdim: "Просто стало интересно",
        film: "Смотрел(а) или скачал(а) фильм", darslar: "Прошёл(ла) урок", bellashuv: "Участвовал(а) в состязании", turnir: "Играл(а) в турнире", chat: "Переписывался(ась) в чате",
        qurbaqa: "Открыл(а) шоколадную лягушку", maxluqlar: "Кормил(а) существо или растение",
        ha: "Да, рассказывал(а)", yoq: "Нет, пока не рассказывал(а)",
        "12": "До 12 лет", "13_17": "13–17", "18_24": "18–24", "25_34": "25–34", "35": "35 и старше"
      },
      oxirgi_v: { soundtrack: "Слушал(а) музыку", kitob: "Читал(а) книгу" },
      rahmat: function (n, g) { return g ? "Спасибо, " + n + ". Я записал ваши ответы. Как и обещал — " + g + " галлеонов." : "Спасибо, " + n + ". Я записал ваши ответы."; },
      oldin_bergan: "Вы уже ответили на эти вопросы. Спасибо!",
      xato: "Нет связи — попробуйте ещё раз",
      karta_k: "Опрос", karta_t: "Вопросы от Дамблдора", karta_g: function (g) { return "+" + g + " галлеонов"; },
      korik: "Видно только вам"
    },
    en: {
      kick: "Headmaster of Hogwarts", ism: "Albus Dumbledore",
      kirish: function (n, g) { return "Hello, " + n + ". I am Albus Dumbledore, Headmaster of Hogwarts. I'd like to know how you found your way to our school. A few questions, two minutes.\n\nThere are no right or wrong answers — just tell it as it was. Only, take your time: the " + g + " galleons of thanks go to thoughtful answers."; },
      boshla: "Let's begin", tayyor: "Done", yubor: "Send", otkaz: "Skip", aytmayman: "Rather not say", yop: "Close",
      yoz: "Type here…", kam: "Please write a little more — at least a couple of words.",
      xolis: ["I see.", "Noted.", "Hm, interesting.", "Is that so.", "Understood."],
      q: {
        qayerdan: "Where did you first hear about the bot?",
        qayerdan_kim: { dost: "Who told you? No name needed — e.g. «a classmate» or «my brother».", tg_kanal: "Which channel was it? If you remember the name, write it.",
                        tg_guruh: "Which group was it? If you remember the name, write it.", boshqa: "Where exactly? A word or two is enough." },
        oldin: "Before us, where did you last watch the Harry Potter films?",
        maqsad: "On the day you first opened the bot, what were you trying to do?",
        oxirgi: "The last time you opened the app, what did you do? You can pick several.",
        aytdimi: "Have you told anyone about the bot?",
        aytdi_matn: "What exactly did you tell them? In your own words, as you remember it.",
        yosh: "Last one: you may tell me your age, or not — either is fine."
      },
      v: {
        dost: "A friend or someone I know told me", tg_kanal: "Saw it in a Telegram channel", tg_guruh: "Saw it in a Telegram group", tg_qidiruv: "Found it in Telegram search",
        instagram: "Instagram", tiktok: "TikTok", youtube: "YouTube", eslay_olmayman: "I don't remember", boshqa: "Somewhere else",
        tv: "On TV", tg_boshqa: "In another Telegram channel or bot", sayt: "On a website", kinoteatr: "At the cinema", korilmagan: "I hadn't seen them before",
        film_korish: "Watch a film", film_yuklash: "Download a film", farzandim: "Put a film on for my child",
        soundtrack: "Listen to the music", kitob: "Read the book", xogvarts: "Get into Hogwarts", qiziqdim: "I was just curious",
        film: "Watched or got a film", darslar: "Took a lesson", bellashuv: "Joined a contest", turnir: "Played in a tournament", chat: "Chatted",
        qurbaqa: "Opened the Chocolate Frog", maxluqlar: "Fed a creature or plant",
        ha: "Yes, I have", yoq: "No, not yet",
        "12": "Under 12", "13_17": "13–17", "18_24": "18–24", "25_34": "25–34", "35": "35 or older"
      },
      oxirgi_v: { soundtrack: "Listened to music", kitob: "Read a book" },
      rahmat: function (n, g) { return g ? "Thank you, " + n + ". I've noted your answers. As promised — " + g + " galleons." : "Thank you, " + n + ". I've noted your answers."; },
      oldin_bergan: "You have already answered these questions. Thank you!",
      xato: "No connection — please try again",
      karta_k: "Survey", karta_t: "Dumbledore has questions", karta_g: function (g) { return "+" + g + " galleons"; },
      korik: "Only you can see this"
    }
  };
  function ankT() { return ANK_T[lang] || ANK_T.uz; }

  var ankData = null, ankKut = false, ankVaqt = 0, ankJ = {}, ankI = -1, ankLocal = null, ankBand = false, ankXi = 0;
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
    if (body && body.javob) { ankLocal.done = true; return { ok: true, on: true, done: true, yangi: true, galleon: 20 }; }
    return { ok: true, on: true, done: ankLocal.done, preview: true, sovga: 20, kam: 3 };
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

  // Kutubxonadagi karta: zamonaviy, qahramonsiz (kutubxona qoidasi); javob berilgach yo'qoladi
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
    var kor = !!(d && d.on && !d.done);
    c.classList.toggle("hidden", !kor);
    if (!kor) { return; }
    c.innerHTML = "";
    var b = drEl("span", "ankc-b");
    b.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 5h16v11H9l-5 4z"/><path d="M8 9.5h8M8 12.5h5"/></svg>';
    c.appendChild(b);
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
  function ankEl() {
    var o = $("ank");
    if (o) { return o; }
    o = document.createElement("div");
    o.id = "ank"; o.className = "ank hidden";
    o.innerHTML = '<div class="ank-top"><span class="ank-sp"></span><div class="ank-id"><span class="ank-k" id="ank-k"></span><b class="ank-n" id="ank-n"></b></div>' +
      '<button class="ank-x" id="ank-x" type="button" aria-label="×"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M6.5 6.5l11 11M17.5 6.5l-11 11"/></svg></button></div>' +
      '<div class="ank-por"><img id="ank-im" alt=""><i class="ank-halo"></i></div>' +
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
    ankJ = {}; ankI = -1; ankBand = false;
    $("ank-k").textContent = t.kick;
    $("ank-n").textContent = t.ism;
    $("ank-chat").innerHTML = "";
    $("ank-pas").innerHTML = "";
    o.classList.remove("hidden");
    document.body.classList.add("ank-ochiq");
    ankKayf("salom");
    ankNuqta();
    if (ankData && ankData.done) {
      ankGap(t.oldin_bergan);
      ankTugma([[t.yop, ankYop]]);
      return;
    }
    ankGap(t.kirish(ankIsm(), (ankData && ankData.sovga) || 20));
    ankTugma([[t.boshla, function () { ankMen(t.boshla); ankKeyin(); }]]);
  }
  function ankYop() {
    var o = $("ank");
    if (o) { o.classList.add("hidden"); }
    document.body.classList.remove("ank-ochiq");
  }

  function ankGap(matn) {
    var ch = $("ank-chat"), q = drEl("div", "ank-q");
    matn.split("\n\n").forEach(function (p) { q.appendChild(drEl("p", "", p)); });
    ch.appendChild(q);
    ankPas();
    return q;
  }
  function ankMen(matn) {
    var ch = $("ank-chat");
    ch.appendChild(drEl("div", "ank-a", matn));
    ankPas();
  }
  function ankPas() {
    var ch = $("ank-chat");
    setTimeout(function () { try { ch.scrollTo({ top: ch.scrollHeight, behavior: "smooth" }); } catch (e) { ch.scrollTop = ch.scrollHeight; } }, 30);
  }
  function ankYozmoqda(cb) {
    var ch = $("ank-chat"), d = drEl("div", "ank-q ank-dot3");
    d.innerHTML = "<i></i><i></i><i></i>";
    ch.appendChild(d); ankPas();
    ankKayf("oylash");
    setTimeout(function () { if (d.parentNode) { d.parentNode.removeChild(d); } cb(); }, 650);
  }

  function ankSoni() { return ANK_Q.filter(function (q) { return !q.agar; }).length; }
  function ankNuqta() {
    var box = $("ank-dots"), n = ankSoni(), joriy = 0;
    ANK_Q.forEach(function (q, i) { if (!q.agar && i <= ankI) { joriy++; } });
    box.innerHTML = "";
    for (var i = 0; i < n; i++) { box.appendChild(drEl("i", i < joriy - 1 ? "on" : i === joriy - 1 ? "cur" : "")); }
  }

  function ankKeyin() {
    var i = ankI + 1;
    while (i < ANK_Q.length && ANK_Q[i].agar && !ANK_Q[i].agar(ankJ)) { i++; }
    ankI = i;
    $("ank-pas").innerHTML = "";
    if (i >= ANK_Q.length) { ankYubor(); return; }
    var q = ANK_Q[i], t = ankT();
    var sar = q.k === "qayerdan_kim" ? t.q.qayerdan_kim[ankJ.qayerdan] : t.q[q.k];
    ankYozmoqda(function () {
      ankNuqta();
      ankKayf("savol");
      ankGap(sar);
      if (q.tur === "matn") { ankMatn(q); } else { ankVariant(q); }
    });
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
    ankMen(korinish);
    var oxirgisi = ANK_Q.slice(ankI + 1).every(function (n) { return n.agar && !n.agar(ankJ); });
    if (oxirgisi) { ankKeyin(); return; }
    ankYozmoqda(function () { ankGap(ankXolis()); ankKeyin(); });
  }
  function ankNom(q, v) {
    var t = ankT();
    return (q.k === "oxirgi" && t.oxirgi_v[v]) || t.v[v] || v;
  }
  function ankVariant(q) {
    var pas = $("ank-pas"), t = ankT(), tanlov = [];
    var g = drEl("div", "ank-vs" + (q.tur === "kop" ? " kop" : ""));
    q.v.forEach(function (v) {
      var b = drEl("button", "ank-v", ankNom(q, v));
      b.type = "button";
      b.onclick = function () {
        if (q.tur === "bir") { ankJavobBerdi(q, ankNom(q, v), v); return; }
        var j = tanlov.indexOf(v);
        if (v === "eslay_olmayman") { tanlov = j < 0 ? ["eslay_olmayman"] : []; }
        else { tanlov = tanlov.filter(function (x) { return x !== "eslay_olmayman"; }); if (j < 0) { tanlov.push(v); } else { tanlov.splice(tanlov.indexOf(v), 1); } }
        Array.prototype.forEach.call(g.children, function (c, k) { c.classList.toggle("on", tanlov.indexOf(q.v[k]) >= 0); });
        ok.disabled = !tanlov.length;
      };
      g.appendChild(b);
    });
    pas.appendChild(g);
    if (q.tur === "kop") {
      var ok = drEl("button", "ank-ok", t.tayyor);
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
    var t = ankT();
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
        ankKayf("rahmat");
        var g = res.galleon || 0;
        ankGap(t.rahmat(ankIsm(), g));
        if (g) { ankTanga(g); }
        try { if (tg && tg.HapticFeedback) { tg.HapticFeedback.notificationOccurred("success"); } } catch (e) {}
        try { walLoad(function () { try { pmRender(); } catch (e) {} }); } catch (e) {}
        ankTugma([[t.yop, ankYop]]);
      });
    });
  }
  function ankTugma(royxat) {
    var pas = $("ank-pas");
    pas.innerHTML = "";
    royxat.forEach(function (r) {
      var b = drEl("button", "ank-ok", r[0]);
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
