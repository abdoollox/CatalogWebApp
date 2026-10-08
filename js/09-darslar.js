/* Darslar: Xogvarts fanlari - har biri kichik interaktiv mashg'ulot (Afsunlar, Iksirlar...), kuniga bir marta ball
   Ilova kodi bir necha faylga bo'lingan; hammasi BIR umumiy maydonda ishlaydi
   va index.html dagi TARTIBDA yuklanadi. Yuklanish paytida keyingi fayldagi
   narsani chaqirmang - tekshiruv: tools/tartib.js */
"use strict";
  /* Egasi (2026-10-07): Xogvarts bosh sahifasida "Kunlik savol" o'rnida "Darslar". Asardagi fanlar;
     kunlik savol "Sehrgarlik tarixi" ichida. Holat va ball botda (hpdars.py, POST /api/dars).
     Bugungi mavzu (qaysi afsun, qaysi damlama) serverdan keladi - hammaga bir xil.
     Qoida (egasi, 2026-10-07 kechqurun): har fanda 24 ta DARS - mashq, ballsiz va cheklovsiz (fan sahifasidagi to'r);
     ball faqat kunlik BELLASHUVDAN. Yangi fan: DR_FANLAR da `on: true`, o'yin ekrani, fanLevel va blStart da tarmoq, botda hpdars.DARSLAR. */
  var API_DARS = "https://bot.tizimshunos.uz/api/dars";
  var DR_FANLAR = [
    { id: "tarix", on: true, rgb: "232,132,60",
      nom: { uz: "Sehrgarlik tarixi", ru: "История магии", en: "History of Magic" },
      ust: { uz: "Professor Binns", ru: "Профессор Бинс", en: "Professor Binns" },
      izoh: { uz: "Sehrgarlar olami haqida savollarga javob bering.", ru: "Отвечайте на вопросы о мире волшебников.", en: "Answer questions about the wizarding world." } },
    { id: "afsun", on: true, rgb: "120,170,240",
      nom: { uz: "Afsunlar", ru: "Заклинания", en: "Charms" },
      ust: { uz: "Professor Flitvik", ru: "Профессор Флитвик", en: "Professor Flitwick" },
      izoh: { uz: "Tayoqcha harakatini barmog'ingiz bilan chizing.", ru: "Нарисуйте пальцем движение палочки.", en: "Trace the wand movement with your finger." } },
    { id: "iksir", on: true, rgb: "110,190,130",
      nom: { uz: "Iksirlar", ru: "Зельеварение", en: "Potions" },
      ust: { uz: "Professor Sneyp", ru: "Профессор Снегг", en: "Professor Snape" },
      izoh: { uz: "Retseptni eslab qoling va damlamani tartib bilan tayyorlang.", ru: "Запомните рецепт и сварите зелье по порядку.", en: "Memorise the recipe and brew the potion in order." } },
    { id: "trans", on: false, rgb: "200,150,90",
      nom: { uz: "Transfiguratsiya", ru: "Трансфигурация", en: "Transfiguration" },
      ust: { uz: "Professor Makgonagall", ru: "Профессор Макгонагалл", en: "Professor McGonagall" } },
    { id: "himoya", on: false, rgb: "190,110,110",
      nom: { uz: "Qora san'atlardan himoya", ru: "Защита от Тёмных искусств", en: "Defence Against the Dark Arts" },
      ust: { uz: "Professor Lyupin", ru: "Профессор Люпин", en: "Professor Lupin" } },
    { id: "osimlik", on: false, rgb: "140,180,90",
      nom: { uz: "O'simlikshunoslik", ru: "Травология", en: "Herbology" },
      ust: { uz: "Professor Sprout", ru: "Профессор Стебль", en: "Professor Sprout" } },
    { id: "astro", on: false, rgb: "130,130,220",
      nom: { uz: "Astronomiya", ru: "Астрономия", en: "Astronomy" },
      ust: { uz: "Professor Sinistra", ru: "Профессор Синистра", en: "Professor Sinistra" } },
    { id: "uchish", on: false, rgb: "224,178,91",
      nom: { uz: "Uchish darsi", ru: "Полёты на мётлах", en: "Flying" },
      ust: { uz: "Xuch xonim", ru: "Мадам Трюк", en: "Madam Hooch" } },
    { id: "maxluq", on: false, rgb: "170,140,110",
      nom: { uz: "Sehrli maxluqlar parvarishi", ru: "Уход за магическими существами", en: "Care of Magical Creatures" },
      ust: { uz: "Xagrid", ru: "Хагрид", en: "Hagrid" } }
  ];
  var DR_TX = {
    uz: { kick: "Xogvarts", ttl: "Darslar", tile: "Darslar", tileNew: function (n) { return "Bugun " + n + " ta topshiriq kutmoqda"; }, tileDone: "Darslar va bellashuv",
          sum: function (a, b) { return a + " / " + b + " dars o'tilgan"; }, note: "Darslar — mashq, xohlagancha o'ting. Ball «Bellashuv» bo'limida beriladi.",
          pts: function (n) { return "+" + n + " ball"; }, done: "Bajarildi", soon: "Tez orada", go: "Darsga kirish", again: "Mashq qilish",
          of: function (a, b) { return a + " / " + b + " dars"; }, lessons: "Darslar", lessonsS: "Mashq: ball berilmaydi, xohlagancha o'ting. Ball — «Bellashuv» bo'limida.",
          blTile: "Bellashuv", blTileNew: function (n) { return "Bugun " + n + " ta bellashuv kutmoqda"; }, blTileDone: "Bugun hammasida qatnashdingiz",
          blHomeS: "Ball shu yerda yig'iladi. Har kuni yangi topshiriq — hammaga bir xil; kim tezroq va xatosiz bajarsa, ertaga ball oladi.",
          chessT: "Sehrgarlar shaxmati", chessS: "Jonli raqib bilan o'ynang · g'alaba +10 ball", tileProg: function (a, b) { return a + " / " + b + " dars o'tilgan"; },
          locked: "Avval oldingi darsni o'ting", passed: function (n) { return n + "-dars o'tildi"; }, again2: "Bu dars oldin o'tilgan — mashq qildingiz.",
          next: "Keyingi dars", toList: "Darslar ro'yxati", allDone: "Hamma dars o'tilgan",
          dailyT: "Kunlik savol", dailyNew: "Bugungi savol kutmoqda", dailyDone: "Bugungi savolga javob berilgan",
          bellCard: "Bugungi bellashuv", bellIn: "Bellashuvga kirish", tarixItem: function (n) { return n + " ta savol"; },
          trQ: function (a, b) { return "Savol " + a + " / " + b; }, trRes: function (a, b) { return b + " tadan " + a + " tasi to'g'ri"; },
          trFail: function (n, j) { return n >= j ? "Keyingi darsga o'tish uchun hamma savolga to'g'ri javob berish kerak." : "Dars o'tishi uchun kamida " + n + " ta to'g'ri javob kerak."; }, retry: "Qayta urinish", loadQ: "Savollar ochilmoqda…",
          lvl: function (n) { return n + "-dars"; }, lvlDone: function (n) { return n + " ta dars o'tilgan"; },
          bell: "Bellashuv", bellS: "Ball shu yerda: kuniga bitta topshiriq — hammaga bir xil. Kim tezroq va xatosiz bajarsa, ertaga ball oladi.",
          bellOf: function (f) { return f + " bellashuvi"; }, bellNone: "Hali qatnashmadingiz", bellGo: "Boshlash", bellNo: "Bugungi urinishlar tugadi",
          tries: function (n) { return n + " ta urinish qoldi"; }, place: function (n, j) { return n + "-o'rin · " + j + " kishidan"; },
          prizes: function (a, b, c, d) { return "1-o'rin +" + a + " · 2-o'rin +" + b + " · 3-o'rin +" + c + " · 4–10-o'rin +" + d + " ball"; },
          rule: "Vaqt «Boshlash» bosilgandan hisoblanadi. Har xato +3 soniya. Eng yaxshi urinishingiz hisobga olinadi.",
          topT: "Bugungi jadval", topNone: "Hali hech kim qatnashmadi — birinchi bo'ling!", yest: "Kechagi g'oliblar",
          yestMe: function (n, p) { return "Siz kecha " + n + "-o'rin" + (p ? " · +" + p + " ball" : ""); }, sec: function (ms) { return (ms / 1000).toFixed(1) + " s"; },
          leftT: function (h, m) { return "Tugashiga " + (h ? h + " soat " : "") + m + " daqiqa qoldi"; }, ptsW: "ball", meK: "Sizning natijangiz", meBest: "Eng yaxshi natijangiz",
          you: "siz", resT: function (t) { return "Natijangiz: " + t; }, resBest: function (t) { return "Eng yaxshi natijangiz: " + t; },
          bellBack: "Jadvalga qaytish", timer: "Vaqt ketyapti",
          today: "Bugungi mavzu", back: "Darslarga qaytish", got: function (n) { return "Fakultetingizga +" + n + " ball"; },
          practice: "Bu dars bugun bajarilgan — mashq uchun ball berilmaydi.", fail: "Hozir bo'lmadi, birozdan keyin urinib ko'ring",
          // afsunlar
          afStep: function (a, b) { return a + " / " + b + "-urinish"; },
          afR: ["Chiziq bo'ylab chizing", "Chiziq xira — diqqat bilan", "Endi yoddan chizing"],
          afStart: "Yonib turgan nuqtadan boshlang", afOff: "Tayoqcha chetga chiqdi — qaytadan", afShort: "Harakatni oxirigacha chizing",
          afOk: ["Yaxshi! Yana bir marta.", "Ajoyib! Endi yoddan.", "Barakalla! Afsun o'zlashtirildi."], afShow: "Chiziqni ko'rsatish",
          // iksirlar
          ikRec: "Retsept", ikRecS: "Masalliqlar tartibini eslab qoling — keyin retsept yopiladi.", ikGo: "Tayyorman",
          ikCook: "Masalliqlarni tartib bilan qozonga soling", ikErr: function (a, b) { return "Xato: " + a + " / " + b; },
          ikBad: ["Noto'g'ri. Diqqat qiling!", "Yana xato. Qozon qaynab ketyapti…"], ikBoom: "Damlama buzildi. Retseptni qaytadan o'qing.",
          ikOk: "Damlama tayyor. Professor Sneyp… hech narsa demadi. Bu maqtov.", ikStep: function (a, b) { return a + " / " + b; } },
    ru: { kick: "Хогвартс", ttl: "Уроки", tile: "Уроки", tileNew: function (n) { return "Заданий на сегодня: " + n; }, tileDone: "Уроки и состязания",
          sum: function (a, b) { return "Пройдено уроков: " + a + " / " + b; }, note: "Уроки — тренировка без ограничений. Очки даются в разделе «Состязания».",
          pts: function (n) { return "+" + n + " очков"; }, done: "Сделано", soon: "Скоро", go: "На урок", again: "Потренироваться",
          of: function (a, b) { return a + " / " + b + " уроков"; }, lessons: "Уроки", lessonsS: "Тренировка: очки не даются, проходите сколько хотите. Очки — в разделе «Состязания».",
          blTile: "Состязания", blTileNew: function (n) { return "Сегодня ждут состязания: " + n; }, blTileDone: "Сегодня вы участвовали во всех",
          blHomeS: "Очки набирают здесь. Каждый день новое задание — одинаковое для всех; кто быстрее и без ошибок, завтра получит очки.",
          chessT: "Волшебные шахматы", chessS: "Играйте с живым соперником · победа +10 очков", tileProg: function (a, b) { return "Пройдено уроков: " + a + " / " + b; },
          locked: "Сначала пройдите предыдущий урок", passed: function (n) { return "Урок " + n + " пройден"; }, again2: "Этот урок уже был пройден — вы потренировались.",
          next: "Следующий урок", toList: "К списку уроков", allDone: "Все уроки пройдены",
          dailyT: "Вопрос дня", dailyNew: "Ждёт сегодняшний вопрос", dailyDone: "На сегодняшний вопрос вы ответили",
          bellCard: "Состязание дня", bellIn: "К состязанию", tarixItem: function (n) { return n + " вопросов"; },
          trQ: function (a, b) { return "Вопрос " + a + " / " + b; }, trRes: function (a, b) { return "Верно " + a + " из " + b; },
          trFail: function (n, j) { return n >= j ? "Чтобы перейти к следующему уроку, нужно ответить верно на все вопросы." : "Чтобы пройти урок, нужно минимум верных ответов: " + n + "."; }, retry: "Ещё раз", loadQ: "Вопросы открываются…",
          lvl: function (n) { return "Урок " + n; }, lvlDone: function (n) { return "Пройдено уроков: " + n; },
          bell: "Состязание", bellS: "Очки дают здесь: одно задание в день — одинаковое для всех. Кто быстрее и без ошибок, завтра получит очки.",
          bellOf: function (f) { return f + ": состязание"; }, bellNone: "Вы ещё не участвовали", bellGo: "Начать", bellNo: "Попытки на сегодня закончились",
          tries: function (n) { return "Осталось попыток: " + n; }, place: function (n, j) { return n + "-е место из " + j; },
          prizes: function (a, b, c, d) { return "1-е место +" + a + " · 2-е +" + b + " · 3-е +" + c + " · 4–10-е +" + d + " очков"; },
          rule: "Время идёт с нажатия «Начать». Каждая ошибка +3 секунды. Засчитывается лучшая попытка.",
          topT: "Таблица дня", topNone: "Пока никто не участвовал — будьте первым!", yest: "Вчерашние победители",
          yestMe: function (n, p) { return "Вчера вы на " + n + "-м месте" + (p ? " · +" + p + " очков" : ""); }, sec: function (ms) { return (ms / 1000).toFixed(1) + " с"; },
          leftT: function (h, m) { return "До конца " + (h ? h + " ч " : "") + m + " мин"; }, ptsW: "очков", meK: "Ваш результат", meBest: "Ваш лучший результат",
          you: "вы", resT: function (t) { return "Ваш результат: " + t; }, resBest: function (t) { return "Лучший результат: " + t; },
          bellBack: "К таблице", timer: "Время идёт",
          today: "Тема дня", back: "К урокам", got: function (n) { return "+" + n + " очков вашему факультету"; },
          practice: "Этот урок сегодня уже сделан — за тренировку очки не даются.", fail: "Не получилось, попробуйте чуть позже",
          afStep: function (a, b) { return "Попытка " + a + " / " + b; },
          afR: ["Ведите по линии", "Линия бледная — внимательнее", "Теперь по памяти"],
          afStart: "Начните со светящейся точки", afOff: "Палочка ушла в сторону — ещё раз", afShort: "Доведите движение до конца",
          afOk: ["Хорошо! Ещё раз.", "Отлично! Теперь по памяти.", "Браво! Заклинание освоено."], afShow: "Показать линию",
          ikRec: "Рецепт", ikRecS: "Запомните порядок ингредиентов — потом рецепт закроется.", ikGo: "Готов",
          ikCook: "Кладите ингредиенты в котёл по порядку", ikErr: function (a, b) { return "Ошибки: " + a + " / " + b; },
          ikBad: ["Неверно. Внимательнее!", "Опять ошибка. Котёл закипает…"], ikBoom: "Зелье испорчено. Прочитайте рецепт ещё раз.",
          ikOk: "Зелье готово. Профессор Снегг… ничего не сказал. Это похвала.", ikStep: function (a, b) { return a + " / " + b; } },
    en: { kick: "Hogwarts", ttl: "Classes", tile: "Classes", tileNew: function (n) { return n + " tasks waiting today"; }, tileDone: "Lessons and contests",
          sum: function (a, b) { return a + " / " + b + " lessons completed"; }, note: "Lessons are practice — as many as you like. Points are won in Contests.",
          pts: function (n) { return "+" + n + " points"; }, done: "Done", soon: "Coming soon", go: "Enter class", again: "Practise",
          of: function (a, b) { return a + " / " + b + " lessons"; }, lessons: "Lessons", lessonsS: "Practice: no points, do as many as you like. Points are won in Contests.",
          blTile: "Contests", blTileNew: function (n) { return n + " contests waiting today"; }, blTileDone: "You took part in all of today's",
          blHomeS: "This is where points are won. A new task every day — the same for everyone; the fastest with no mistakes get points tomorrow.",
          chessT: "Wizard's Chess", chessS: "Play a live opponent · +10 points for a win", tileProg: function (a, b) { return a + " / " + b + " lessons completed"; },
          locked: "Finish the previous lesson first", passed: function (n) { return "Lesson " + n + " completed"; }, again2: "You had completed this lesson before — good practice.",
          next: "Next lesson", toList: "Lesson list", allDone: "All lessons completed",
          dailyT: "Daily question", dailyNew: "Today's question is waiting", dailyDone: "You answered today's question",
          bellCard: "Today's contest", bellIn: "Enter the contest", tarixItem: function (n) { return n + " questions"; },
          trQ: function (a, b) { return "Question " + a + " / " + b; }, trRes: function (a, b) { return a + " of " + b + " correct"; },
          trFail: function (n, j) { return n >= j ? "To move on, you need to answer every question correctly." : "You need at least " + n + " correct answers to pass."; }, retry: "Try again", loadQ: "Opening the questions…",
          lvl: function (n) { return "Lesson " + n; }, lvlDone: function (n) { return n + " lessons completed"; },
          bell: "Contest", bellS: "Points are won here: one task a day — the same for everyone. The fastest with no mistakes get points tomorrow.",
          bellOf: function (f) { return f + " contest"; }, bellNone: "You have not taken part yet", bellGo: "Start", bellNo: "No attempts left today",
          tries: function (n) { return n + " attempts left"; }, place: function (n, j) { return "Place " + n + " of " + j; },
          prizes: function (a, b, c, d) { return "1st +" + a + " · 2nd +" + b + " · 3rd +" + c + " · 4th–10th +" + d + " points"; },
          rule: "The clock starts when you press Start. Each mistake adds 3 seconds. Your best attempt counts.",
          topT: "Today's table", topNone: "Nobody has taken part yet — be the first!", yest: "Yesterday's winners",
          yestMe: function (n, p) { return "Yesterday you were " + n + (p ? " · +" + p + " points" : ""); }, sec: function (ms) { return (ms / 1000).toFixed(1) + " s"; },
          leftT: function (h, m) { return "Ends in " + (h ? h + " h " : "") + m + " min"; }, ptsW: "points", meK: "Your result", meBest: "Your best result",
          you: "you", resT: function (t) { return "Your result: " + t; }, resBest: function (t) { return "Your best: " + t; },
          bellBack: "Back to the table", timer: "The clock is running",
          today: "Today's topic", back: "Back to classes", got: function (n) { return "+" + n + " points for your house"; },
          practice: "This class is already done today — practice gives no points.", fail: "That didn't work, please try again shortly",
          afStep: function (a, b) { return "Attempt " + a + " / " + b; },
          afR: ["Trace along the line", "The line is faint — careful", "Now from memory"],
          afStart: "Start from the glowing dot", afOff: "The wand went astray — again", afShort: "Finish the whole movement",
          afOk: ["Good! Once more.", "Excellent! Now from memory.", "Bravo! The charm is learnt."], afShow: "Show the line",
          ikRec: "Recipe", ikRecS: "Memorise the order of the ingredients — then the recipe closes.", ikGo: "Ready",
          ikCook: "Add the ingredients to the cauldron in order", ikErr: function (a, b) { return "Mistakes: " + a + " / " + b; },
          ikBad: ["Wrong. Pay attention!", "Wrong again. The cauldron is boiling over…"], ikBoom: "The potion is ruined. Read the recipe again.",
          ikOk: "The potion is ready. Professor Snape… said nothing. That is praise.", ikStep: function (a, b) { return a + " / " + b; } }
  };

  var drData = null, drQayt = false, drBusy = false;

  function drX() { return DR_TX[lang] || DR_TX.uz; }
  function drInit() { try { return (tg && tg.initData) || ""; } catch (e) { return ""; } }
  function drFan(id) { for (var i = 0; i < DR_FANLAR.length; i++) { if (DR_FANLAR[i].id === id) { return DR_FANLAR[i]; } } return null; }
  function drEl(tag, cls, text) {
    var el = document.createElement(tag);
    if (cls) { el.className = cls; }
    if (text != null) { el.textContent = text; }
    return el;
  }
  function drImg(id) { return IMG_DIR + "dars/" + id + ".webp"; }

  // Mahalliy ko'rikda server yo'q - namuna
  var drLocalLvl = { tarix: 2, afsun: 13, iksir: 5 }, drLocalBest = {};
  function drSample(body) {
    body = body || {};
    var res = { ok: true };
    if (body.quiz) {
      res.level = body.quiz; res.need = 8;
      res.questions = [1, 2, 3, 4, 5, 6, 7, 8].map(function (i) {
        return { q: "Namuna savol " + i + ": Xogvartsda nechta fakultet bor?", a: ["Oltita", "Uchta", "To'rtta", "Beshta"], c: 2 };
      });
      return res;
    }
    if (body.done) {
      res["new"] = body.level === drLocalLvl[body.done] + 1;
      if (res["new"]) { drLocalLvl[body.done] = body.level; }
      res.pts = 0;
    }
    if (body.start === "tarix") {
      res.questions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(function (i) { return { q: "Bellashuv savoli " + i + ": Garrining boyo'g'lisi nomi?", a: ["Errol", "Xedvig", "Skabbers", "Bakbik"] }; });
    }
    if (body.finish) {
      res.ms = 5200 + Math.round(Math.random() * 3000) + (body.xato || 0) * 3000;
      if (body.finish === "tarix") { res.wrong = 1; res.ms += 3000; }
      drLocalBest[body.finish] = Math.min(drLocalBest[body.finish] || 1e9, res.ms);
      res.best = drLocalBest[body.finish];
    }
    var bell = function (id, item) {
      var top = [{ uid: 11, name: "Germiona", house: "gryffindor", ms: 4300 }, { uid: 12, name: "Luna", house: "ravenclaw", ms: 5100 },
                 { uid: 13, name: "Sedrik", house: "hufflepuff", ms: 6900 }, { uid: 14, name: "Drako", house: "slytherin", ms: 8400 }];
      if (drLocalBest[id]) { top.push({ uid: 1, name: "Siz", house: "gryffindor", ms: drLocalBest[id], me: true }); }
      top.sort(function (p, q) { return p.ms - q.ms; });
      var orin = null;
      top.forEach(function (t, i) { if (t.me) { orin = i + 1; } });
      return { item: item, top: top, n: top.length, place: orin, ms: drLocalBest[id] || null, tries: drLocalBest[id] ? 1 : 0, max: 3,
               prizes: { top: [15, 10, 7], ten: 3 },
               yesterday: { top: top.slice(0, 3), n: 9, place: 4, pts: 3 } };
    };
    res.lessons = {
      tarix: { level: drLocalLvl.tarix, total: 46, contest: bell("tarix", "10") },
      afsun: { level: drLocalLvl.afsun, total: 24, contest: bell("afsun", "lumos") },
      iksir: { level: drLocalLvl.iksir, total: 24, contest: bell("iksir", "boils") } };
    return res;
  }

  function drPost(body, cb) {
    if (!window.fetch) { return; }
    window.fetch(API_DARS, { method: "POST", headers: { "Content-Type": "application/json", "X-Telegram-Init-Data": drInit() },
                             body: JSON.stringify(body || {}) })
      .then(function (r) { return r.json(); })
      .then(function (res) { cb(res && (res.ok || res.error === "no_tries" || res.error === "not_started" || res.error === "locked") ? res : (MS_LOCAL ? drSample(body) : res)); })
      ["catch"](function () { cb(MS_LOCAL ? drSample(body) : null); });
  }

  function drApply(res) {
    if (!res || !res.ok) { return; }
    var oldin = drPending();
    drData = res.lessons || {};
    if (!$("scr-dars").classList.contains("hidden")) { drRender(); }
    // Bosh sahifa FAQAT kartadagi son o'zgargan bo'lsa qayta chiziladi. DIQQAT (2026-10-07 xatosi): renderHub
    // drLoad ni chaqiradi - bu yerda shartsiz renderHub chaqirilsa cheksiz so'rov halqasi bo'ladi va ilova qotadi.
    if (drPending() !== oldin) { try { if (hubVisible()) { renderHub(); } } catch (e) {} }
  }

  // Bosh sahifa har chizilganda chaqiriladi: so'rov eng ko'pi bilan 20 soniyada bir marta ketadi
  var drAt = 0, drWait = false;
  function drLoad() {
    if (drWait || Date.now() - drAt < 20000) { return; }
    var ichkarida = false;
    try { ichkarida = hasHouse(); } catch (e) {}
    if (!ichkarida) { return; }
    drAt = Date.now();
    drWait = true;
    drPost({}, function (res) { drWait = false; drApply(res); });
  }

  // Bosh sahifadagi «Bellashuv» kartasi uchun: bugun hali qatnashilmagan bellashuvlar. Ma'lumot kelmagan bo'lsa -1.
  function drPending() {
    if (!drData) { return -1; }
    var n = 0;
    DR_FANLAR.forEach(function (f) {
      var st = f.on && drData[f.id];
      if (st && st.contest && !st.contest.tries) { n++; }
    });
    return n;
  }
  // «Darslar» kartasi uchun: [o'tilgan, jami] yoki null
  function drJami() {
    if (!drData) { return null; }
    var a = 0, b = 0;
    DR_FANLAR.forEach(function (f) { var st = f.on && drData[f.id]; if (st) { a += st.level; b += st.total; } });
    return [a, b];
  }

  function drOpen() {
    drQayt = false;
    ["scr-hub", "scr-cat", "scr-cup", "scr-tasks", "scr-quiz", "scr-afsun", "scr-iksir", "scr-bell", "scr-blh", "scr-fan", "scr-tarix", "scr-sq", "pm"].forEach(function (id) {
      var el = $(id);
      if (el) { el.classList.add("hidden"); }
    });
    $("scr-dars").classList.remove("hidden");
    drRender();
    drPost({}, drApply);
    try { window.scrollTo(0, 0); } catch (e) {}
  }

  // Darsdan (kunlik savol, o'yin) "ortga" bosilganda darslar ro'yxatiga qaytish
  function drBack() {
    if (!drQayt) { return false; }
    drQayt = false;
    drOpen();
    return true;
  }

  function drRender() {
    var x = drX(), box = $("dr-list");
    $("dr-kick").textContent = x.kick;
    $("dr-ttl").textContent = x.ttl;
    var ochiq = DR_FANLAR.filter(function (f) { return f.on; });
    var bajar = 0, jami = 0;
    ochiq.forEach(function (f) { var q = drData && drData[f.id]; bajar += q ? q.level : 0; jami += q ? q.total : 24; });
    $("dr-sum").textContent = x.sum(bajar, jami);
    $("dr-bar").style.width = Math.round(100 * bajar / (jami || 1)) + "%";
    $("dr-note").textContent = x.note;
    box.innerHTML = "";
    DR_FANLAR.forEach(function (f) {
      var st = drData && drData[f.id];
      var tugadi = st && st.level >= st.total;
      var card = drEl("button", "dr-card" + (f.on ? "" : " soon") + (tugadi ? " done" : ""));
      card.type = "button";
      card.style.setProperty("--dr-rgb", f.rgb);
      var im = drEl("span", "dr-im");
      var img = document.createElement("img");
      img.alt = "";
      img.loading = "lazy";
      img.onerror = function () { im.classList.add("bosh"); im.textContent = f.nom[lang].charAt(0); };
      img.src = drImg(f.id);
      im.appendChild(img);
      card.appendChild(im);
      var tx = drEl("span", "dr-tx");
      tx.appendChild(drEl("b", "", f.nom[lang]));
      tx.appendChild(drEl("small", "dr-ust", f.ust[lang]));
      if (f.on && f.izoh) { tx.appendChild(drEl("small", "dr-izoh", f.izoh[lang])); }
      if (f.on && st) {
        var pr = drEl("span", "dr-prog");
        var pi = drEl("i");
        pi.style.width = Math.round(100 * st.level / st.total) + "%";
        pr.appendChild(pi);
        tx.appendChild(pr);
      }
      card.appendChild(tx);
      var chip = drEl("span", "dr-chip", !f.on ? x.soon : (st ? st.level + " / " + st.total : ""));
      card.appendChild(chip);
      card.addEventListener("click", function () {
        if (!f.on) { showToast(x.soon + ": " + f.nom[lang]); return; }
        fanOpen(f.id);
      });
      box.appendChild(card);
    });

  }

  /* --- «Bellashuv» bo'limi (egasi, 2026-10-07): Xogvarts bosh sahifasida shaxmat o'rnida. Ball shu yerda:
         fanlar bellashuvlari + sehrgarlar shaxmati. Darslar sahifasida bellashuv ko'rsatilmaydi. --- */
  var blQayt = false;

  function blHomeOpen() {
    blQayt = false;
    ["scr-hub", "scr-cat", "scr-cup", "scr-dars", "scr-fan", "scr-afsun", "scr-iksir", "scr-tarix", "scr-bell", "scr-sq",
     "scr-chess-hub", "scr-chess-stats", "pm"].forEach(function (id) { var el = $(id); if (el) { el.classList.add("hidden"); } });
    $("scr-blh").classList.remove("hidden");
    blHomeRender();
    drPost({}, function (res) { if (res && res.ok) { drData = res.lessons || drData; if (!$("scr-blh").classList.contains("hidden")) { blHomeRender(); } } });
    try { window.scrollTo(0, 0); } catch (e) {}
  }

  // Shaxmatdan "ortga" - bellashuv bo'limiga
  function blHomeBack() {
    if (!blQayt) { return false; }
    blQayt = false;
    blHomeOpen();
    return true;
  }

  function blHomeRender() {
    var x = drX(), bb = $("blh-list");
    $("blh-kick").textContent = x.kick;
    $("blh-ttl").textContent = x.blTile;
    $("blh-note").textContent = x.blHomeS;
    bb.innerHTML = "";
    DR_FANLAR.forEach(function (f) {
      var c = f.on && drData && drData[f.id] && drData[f.id].contest;
      if (!c) { return; }
      var card = drEl("button", "dr-card" + (c.tries ? " done" : ""));
      card.type = "button";
      card.style.setProperty("--dr-rgb", f.rgb);
      var im = drEl("span", "dr-im");
      var img = document.createElement("img");
      img.alt = "";
      img.src = drImg(f.id);
      im.appendChild(img);
      card.appendChild(im);
      var tx = drEl("span", "dr-tx");
      tx.appendChild(drEl("b", "", f.nom[lang]));
      tx.appendChild(drEl("small", "dr-ust", drItemName(f.id, c.item)));
      tx.appendChild(drEl("small", "dr-izoh", c.ms ? x.sec(c.ms) + " · " + x.place(c.place, c.n) : x.bellNone));
      card.appendChild(tx);
      card.appendChild(drEl("span", "dr-chip", "+" + c.prizes.top[0]));
      card.addEventListener("click", function () { blOpen(f.id); });
      bb.appendChild(card);
    });
    // Sehrgarlar shaxmati
    var ch = drEl("button", "dr-card");
    ch.type = "button";
    ch.style.setProperty("--dr-rgb", "165,127,224");
    var ci = drEl("span", "dr-im kubok");
    ci.style.color = "rgb(165,127,224)";
    ci.innerHTML = hubSvg(HUB_ICONS.chess);
    ch.appendChild(ci);
    var ct = drEl("span", "dr-tx");
    ct.appendChild(drEl("b", "", x.chessT));
    ct.appendChild(drEl("small", "dr-izoh", x.chessS));
    ch.appendChild(ct);
    ch.appendChild(drEl("span", "dr-chip", "+10"));
    ch.addEventListener("click", function () {
      $("scr-blh").classList.add("hidden");
      blQayt = true;
      try { worldFrom = "hub"; } catch (e) {}
      openChessHub();
    });
    bb.appendChild(ch);
  }

  var DR_KUBOK = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 3h10v2h3v3a4 4 0 0 1-3.6 4A5 5 0 0 1 13 14.9V18h3v3H8v-3h3v-3.1A5 5 0 0 1 7.6 12 4 4 0 0 1 4 8V5h3zm10 4v2.8A2 2 0 0 0 18 8V7zM6 7v1a2 2 0 0 0 1 1.8V7z"/></svg>';
  function drItemName(fan, item) {
    if (fan === "afsun") { return ((AF[item] || {})[lang] || (AF[item] || {}).uz || [item])[0]; }
    if (fan === "iksir") { return (IK[item] || {})[lang] || (IK[item] || {}).uz || item; }
    if (fan === "tarix") { return drX().tarixItem(parseInt(item, 10) || 10); }
    return item;
  }

  /* --- bellashuv sahifasi --- */
  var blFan = null, bl = null;       // bl: ketayotgan urinish {fan, t0, xato}

  function blOpen(fan) {
    blFan = fan;
    bl = null;
    ["scr-dars", "scr-afsun", "scr-iksir", "scr-fan", "scr-tarix", "scr-blh", "scr-hub", "scr-sq"].forEach(function (id) { $(id).classList.add("hidden"); });
    $("scr-bell").classList.remove("hidden");
    blRender();
    drPost({}, function (res) { if (res && res.ok) { drData = res.lessons || drData; if (!$("scr-bell").classList.contains("hidden")) { blRender(); } } });
    try { window.scrollTo(0, 0); } catch (e) {}
  }

  function blRow(p, i, x) {
    var r = drEl("div", "bl-row" + (p.me ? " me" : ""));
    r.appendChild(drEl("i", "o" + (i + 1), String(i + 1)));
    var cr = drEl("span", "bl-cr");
    var im = cupCrestImg(p.house, 18);
    if (im) { cr.appendChild(im); }
    r.appendChild(cr);
    r.appendChild(drEl("b", "", p.name + (p.me && !p.nom ? " (" + x.you + ")" : "")));
    r.appendChild(drEl("em", "", x.sec(p.ms)));
    return odamLink(r, p);
  }

  // Kun tugashiga qancha qoldi (Toshkent vaqti, UTC+5) - bellashuv yarim tunda yakunlanadi
  function blLeft() {
    var tk = Date.now() + 5 * 3600000, ms = 86400000 - (tk % 86400000);
    return [Math.floor(ms / 3600000), Math.floor((ms % 3600000) / 60000)];
  }

  // Shohsupa ustuni (birinchi uchlik)
  function blPod(p, orin, x) {
    var c = drEl("div", "bl-pd p" + orin + (p && p.me ? " me" : "") + (p ? "" : " bosh"));
    c.appendChild(drEl("i", "bl-pd-n", String(orin)));
    var cr = drEl("span", "bl-pd-cr");
    var im = p ? cupCrestImg(p.house, 0) : null;
    if (im) { cr.appendChild(im); }
    c.appendChild(cr);
    c.appendChild(drEl("b", "", p ? p.name : "—"));
    c.appendChild(drEl("em", "", p ? x.sec(p.ms) : ""));
    c.appendChild(drEl("span", "bl-pd-st"));
    return p ? odamLink(c, p) : c;
  }

  function blRender() {
    var x = drX(), f = drFan(blFan), st = drData && drData[blFan], c = st && st.contest;
    if (!f || !c) { return; }
    $("scr-bell").style.setProperty("--dr-rgb", f.rgb);
    $("bl-kick").textContent = x.bell;
    $("bl-ttl").textContent = f.nom[lang];
    $("bl-im").src = drImg(f.id);
    $("bl-today").textContent = x.today;
    $("bl-name").textContent = drItemName(blFan, c.item);
    var lf = blLeft();
    $("bl-left").textContent = x.leftT(lf[0], lf[1]);

    // Sovrinlar: to'rtta medal
    var pz = $("bl-prizes");
    pz.innerHTML = "";
    [["1", c.prizes.top[0], "o1"], ["2", c.prizes.top[1], "o2"], ["3", c.prizes.top[2], "o3"], ["4–10", c.prizes.ten, "o4"]].forEach(function (q) {
      var d = drEl("span", "bl-pz " + q[2]);
      d.appendChild(drEl("i", "", q[0]));
      d.appendChild(drEl("b", "", "+" + q[1]));
      d.appendChild(drEl("small", "", x.ptsW));
      pz.appendChild(d);
    });

    // O'z natijasi va urinishlar
    var qoldi = Math.max(0, (c.max || 3) - (c.tries || 0));
    $("bl-me").classList.toggle("bor", !!c.ms);
    $("bl-me-k").textContent = c.ms ? x.meBest : x.meK;
    $("bl-me-t").textContent = c.ms ? x.sec(c.ms) : x.bellNone;
    $("bl-me-p").textContent = c.ms ? x.place(c.place, c.n) : "";
    var dots = $("bl-dots");
    dots.innerHTML = "";
    for (var k = 0; k < (c.max || 3); k++) { dots.appendChild(drEl("i", k < (c.tries || 0) ? "on" : "")); }
    $("bl-dots-l").textContent = qoldi > 0 ? x.tries(qoldi) : x.bellNo;
    var go = $("bl-go");
    go.textContent = qoldi > 0 ? x.bellGo : x.bellNo;
    go.disabled = qoldi < 1;
    $("bl-rule").textContent = x.rule;

    // Jadval: birinchi uchlik shohsupada, qolganlari ro'yxatda
    $("bl-top-t").textContent = x.topT + (c.n ? " · " + c.n : "");
    var pod = $("bl-pod"), top = $("bl-top");
    pod.innerHTML = "";
    top.innerHTML = "";
    pod.classList.toggle("hidden", !c.top.length);
    if (!c.top.length) { top.appendChild(drEl("p", "bl-none", x.topNone)); }
    else {
      [2, 1, 3].forEach(function (o) { pod.appendChild(blPod(c.top[o - 1] || null, o, x)); });
      c.top.slice(3).forEach(function (p, i) { top.appendChild(blRow(p, i + 3, x)); });
      // O'zi o'ntalikdan pastda bo'lsa - alohida qator
      if (c.ms && c.place > c.top.length) {
        top.appendChild(blRow({ name: x.you, house: (cupMe() || {}).house, ms: c.ms, me: true, nom: true }, c.place - 1, x));
      }
    }
    var y = c.yesterday || { top: [] };
    $("bl-yest-h").classList.toggle("hidden", !y.top.length);
    $("bl-yest-t").textContent = x.yest;
    var yb = $("bl-yest");
    yb.innerHTML = "";
    y.top.forEach(function (p, i) { yb.appendChild(blRow(p, i, x)); });
    if (y.place) { yb.appendChild(drEl("p", "bl-none", x.yestMe(y.place, y.pts))); }
  }

  // Urinishni boshlash: avval server (vaqtni u o'lchaydi), keyin o'yin
  function blStart() {
    if (drBusy || !blFan) { return; }
    drBusy = true;
    var fan = blFan;
    drPost({ start: fan, lang: lang }, function (res) {
      drBusy = false;
      if (res && res.lessons) { drData = res.lessons; }
      if (!res || !res.ok) { showToast(res && res.error === "no_tries" ? drX().bellNo : drX().fail, res && res.error === "no_tries" ? "" : "err"); blRender(); return; }
      bl = { fan: fan, t0: Date.now(), xato: 0, answers: [] };
      if (fan === "afsun") { afOpen(true); } else if (fan === "iksir") { ikOpen(true); } else { trStart(res.questions || [], true, 0); }
      blTick();
    });
  }

  function blTick() {
    if (!bl) { return; }
    if (bl.fan === "iksir") { $("ik-timer").textContent = drX().timer + " · " + drX().sec(Date.now() - bl.t0 + bl.xato * 3000); }
    else if (bl.fan === "tarix") { $("tr-timer").textContent = drX().timer + " · " + drX().sec(Date.now() - bl.t0); }
    else if (af && !af.done) { afPaint(); }
    bl.tm = setTimeout(blTick, 100);
  }

  // Urinish tugadi: natija serverda hisoblanadi
  function blFinish(box) {
    var x = drX(), b = bl;
    if (!b) { return; }
    bl = null;
    clearTimeout(b.tm);
    drPost({ finish: b.fan, xato: b.xato, answers: b.answers }, function (res) {
      if (res && res.lessons) { drData = res.lessons; }
      box.innerHTML = "";
      if (!res || !res.ok) { box.appendChild(drEl("p", "dr-res-t", x.fail)); }
      else {
        var c = drData[b.fan].contest;
        box.appendChild(drEl("p", "dr-res-t", x.resT(x.sec(res.ms))));
        if (b.fan === "tarix" && typeof res.wrong === "number") { box.appendChild(drEl("small", "dr-res-s", x.trRes(b.answers.length - res.wrong, b.answers.length))); }
        box.appendChild(drEl("b", "dr-res-p", x.place(c.place, c.n)));
        if (res.best < res.ms) { box.appendChild(drEl("small", "dr-res-s", x.resBest(x.sec(res.best)))); }
        try { if (tg && tg.HapticFeedback) { tg.HapticFeedback.notificationOccurred("success"); } } catch (e) {}
      }
      var bt = drEl("button", "dr-btn", x.bellBack);
      bt.type = "button";
      bt.addEventListener("click", function () { blOpen(b.fan); });
      box.appendChild(bt);
      box.classList.remove("hidden");
    });
  }

  // Bellashuv paytida o'yindan chiqib ketilsa urinish yonadi (server vaqti o'tib ketadi)
  function blAbort() { if (bl) { clearTimeout(bl.tm); bl = null; } }

  /* --- fan sahifasi: darslar to'ri (bosqichlar) va shu fanning bellashuvi --- */
  var fanId = null;

  function fanOpen(id) {
    fanId = id;
    drQayt = false;
    ["scr-dars", "scr-afsun", "scr-iksir", "scr-bell", "scr-tarix", "scr-hub", "scr-quiz", "scr-tasks"].forEach(function (q) { $(q).classList.add("hidden"); });
    $("scr-fan").classList.remove("hidden");
    fanRender();
    try { window.scrollTo(0, 0); } catch (e) {}
  }

  function fanRender() {
    var x = drX(), f = drFan(fanId), st = drData && drData[fanId];
    if (!f) { return; }
    $("fn-kick").textContent = f.ust[lang];
    $("fn-ttl").textContent = f.nom[lang];
    var im = $("fn-im");
    im.src = drImg(f.id);
    $("scr-fan").style.setProperty("--dr-rgb", f.rgb);
    var lv = st ? st.level : 0, jami = st ? st.total : 24;
    $("fn-sum").textContent = lv >= jami ? x.allDone : x.of(lv, jami);
    $("fn-bar").style.width = Math.round(100 * lv / jami) + "%";
    $("fn-les-t").textContent = x.lessons;
    $("fn-les-s").textContent = x.lessonsS;
    var grid = $("fn-grid");
    grid.innerHTML = "";
    for (var n = 1; n <= jami; n++) {
      (function (k) {
        var b = drEl("button", "fn-l" + (k <= lv ? " done" : k === lv + 1 ? " now" : " lock"), String(k));
        b.type = "button";
        b.addEventListener("click", function () {
          if (k > lv + 1) { showToast(x.locked); return; }
          fanLevel(fanId, k);
        });
        grid.appendChild(b);
      })(n);
    }
  }

  // N-darsni ochish
  function fanLevel(id, n) {
    if (id === "afsun") { afOpen(false, n); }
    else if (id === "iksir") { ikOpen(false, n); }
    else if (id === "tarix") { trOpen(n); }
  }

  // Dars o'tildi: bosqich serverda oshadi (faqat navbatdagi dars). Ball berilmaydi. cb(yangi: true/false/null)
  function drDone(id, level, cb) {
    if (drBusy) { return; }
    drBusy = true;
    drPost({ done: id, level: level }, function (res) {
      drBusy = false;
      if (!res || !res.ok) { showToast(drX().fail, "err"); cb(null); return; }
      drData = res.lessons || drData;
      if (res["new"]) { try { if (tg && tg.HapticFeedback) { tg.HapticFeedback.notificationOccurred("success"); } } catch (e) {} }
      cb(!!res["new"]);
    });
  }

  function drShowGame(scr) {
    ["scr-dars", "scr-afsun", "scr-iksir", "scr-bell", "scr-blh", "scr-fan", "scr-tarix"].forEach(function (id) { $(id).classList.toggle("hidden", id !== scr); });
    try { window.scrollTo(0, 0); } catch (e) {}
  }

  // Dars oxiridagi natija paneli (hamma o'yinda bir xil): keyingi dars yoki ro'yxatga qaytish
  function drResult(box, matn, fan, level, yangi) {
    var x = drX(), st = drData && drData[fan];
    box.innerHTML = "";
    box.appendChild(drEl("p", "dr-res-t", matn));
    if (yangi === true) { box.appendChild(drEl("b", "dr-res-p", x.passed(level))); }
    else if (yangi === false) { box.appendChild(drEl("small", "dr-res-s", x.again2)); }
    if (st && level < st.total && level <= st.level) {
      var nx = drEl("button", "dr-btn", x.next + " · " + x.lvl(level + 1));
      nx.type = "button";
      nx.addEventListener("click", function () { fanLevel(fan, level + 1); });
      box.appendChild(nx);
    }
    var b = drEl("button", "dr-btn ikkinchi", x.toList);
    b.type = "button";
    b.addEventListener("click", function () { fanOpen(fan); });
    box.appendChild(b);
    box.classList.remove("hidden");
  }

  /* ================= SEHRGARLIK TARIXI: savol-javob =================
     Dars: 6 yangi + 2 takror savol (soni serverdan), javob darhol tekshiriladi (to'g'risi yashil); dars faqat
     HAMMA savolga to'g'ri javob berilsa o'tadi (egasi, 2026-10-08).
     Bellashuv: 10 savol, to'g'ri javob ko'rsatilmaydi - javoblar serverga ketadi, u tekshiradi. */
  var tr = null;      // {qs, i, ok, bell, level, need, lock}

  function trOpen(n) {
    drShowGame("scr-tarix");
    var x = drX(), f = drFan("tarix");
    $("tr-kick").textContent = f.nom[lang];
    $("tr-ttl").textContent = x.lvl(n);
    $("tr-timer").classList.add("hidden");
    $("tr-res").classList.add("hidden");
    $("tr-q").textContent = x.loadQ;
    $("tr-step").textContent = "";
    $("tr-opts").innerHTML = "";
    tr = null;
    drPost({ quiz: n, lang: lang }, function (res) {
      if ($("scr-tarix").classList.contains("hidden")) { return; }
      if (!res || !res.ok || !res.questions || !res.questions.length) { showToast(res && res.error === "locked" ? x.locked : x.fail, "err"); fanOpen("tarix"); return; }
      trStart(res.questions, false, n, res.need);
    });
  }

  function trStart(qs, bell, level, need) {
    var x = drX();
    tr = { qs: qs, i: 0, ok: 0, bell: !!bell, level: level, need: need || qs.length, lock: false };
    if (bell) {
      drShowGame("scr-tarix");
      $("tr-kick").textContent = x.bell;
      $("tr-ttl").textContent = drFan("tarix").nom[lang];
      $("tr-res").classList.add("hidden");
    }
    $("tr-timer").classList.toggle("hidden", !bell);
    $("tr-stage").classList.remove("hidden");
    trPaint();
  }

  function trPaint() {
    if (!tr) { return; }
    var x = drX(), q = tr.qs[tr.i], box = $("tr-opts");
    $("tr-step").textContent = x.trQ(tr.i + 1, tr.qs.length);
    $("tr-q").textContent = q.q;
    box.innerHTML = "";
    q.a.forEach(function (matn, k) {
      var b = drEl("button", "tr-o", matn);
      b.type = "button";
      b.addEventListener("click", function () { trPick(k, b); });
      box.appendChild(b);
    });
  }

  function trPick(k, btn) {
    if (!tr || tr.lock) { return; }
    var q = tr.qs[tr.i], kut = 220;
    tr.lock = true;
    if (tr.bell) {
      if (bl) { bl.answers.push(k); }
      btn.classList.add("tanlandi");
    } else {
      var togri = k === q.c;
      if (togri) { tr.ok++; }
      btn.classList.add(togri ? "togri" : "xato");
      if (!togri) { var t = $("tr-opts").children[q.c]; if (t) { t.classList.add("togri"); } }
      try { if (tg && tg.HapticFeedback) { tg.HapticFeedback.notificationOccurred(togri ? "success" : "error"); } } catch (e) {}
      kut = togri ? 650 : 1300;
    }
    setTimeout(function () {
      if (!tr) { return; }
      tr.lock = false;
      tr.i++;
      if (tr.i < tr.qs.length) { trPaint(); return; }
      trEnd();
    }, kut);
  }

  function trEnd() {
    var x = drX(), t = tr, box = $("tr-res");
    $("tr-stage").classList.add("hidden");
    if (t.bell) { tr = null; blFinish(box); return; }
    var natija = x.trRes(t.ok, t.qs.length);
    if (t.ok >= t.need) {
      drDone("tarix", t.level, function (yangi) { drResult(box, natija, "tarix", t.level, yangi); });
      return;
    }
    box.innerHTML = "";
    box.appendChild(drEl("p", "dr-res-t", natija));
    box.appendChild(drEl("small", "dr-res-s", x.trFail(t.need, t.qs.length)));
    var r = drEl("button", "dr-btn", x.retry);
    r.type = "button";
    r.addEventListener("click", function () { trOpen(t.level); });
    box.appendChild(r);
    var b = drEl("button", "dr-btn ikkinchi", x.toList);
    b.type = "button";
    b.addEventListener("click", function () { fanOpen("tarix"); });
    box.appendChild(b);
    box.classList.remove("hidden");
  }

  /* ================= AFSUNLAR: tayoqcha harakatini chizish =================
     Shakl 0..1 kvadrat ichidagi nuqtalar. Uch urinish: chiziq ko'rinadi -> xira -> yoddan. */
  function afArc(cx, cy, r, a0, a1, n) {
    var p = [];
    for (var i = 0; i <= n; i++) { var a = a0 + (a1 - a0) * i / n; p.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]); }
    return p;
  }
  function afWave() { var p = []; for (var i = 0; i <= 24; i++) { var t = i / 24; p.push([0.12 + 0.76 * t, 0.5 - 0.2 * Math.sin(t * Math.PI * 3)]); } return p; }
  function afSpiral() {
    var p = [];
    for (var i = 0; i <= 40; i++) { var t = i / 40, a = -Math.PI / 2 + t * Math.PI * 3.5, r = 0.08 + 0.3 * t; p.push([0.5 + r * Math.cos(a), 0.5 + r * Math.sin(a)]); }
    return p;
  }
  var AF = {
    lumos:        { s: [[0.2, 0.8], [0.5, 0.18], [0.8, 0.8]],
                    uz: ["Lumos", "Tayoqcha uchida yorug'lik yoqadi."], ru: ["Люмос", "Зажигает свет на кончике палочки."], en: ["Lumos", "Lights the tip of the wand."] },
    leviosa:      { s: [[0.14, 0.34], [0.22, 0.52], [0.36, 0.62], [0.52, 0.6], [0.66, 0.5], [0.76, 0.34], [0.84, 0.14]],
                    uz: ["Vingardium Leviosa", "Buyumni havoga ko'taradi. «Silkitib, keyin siltang!»"], ru: ["Вингардиум Левиоса", "Поднимает предмет в воздух. «Взмахнуть и рассечь!»"], en: ["Wingardium Leviosa", "Makes an object fly. “Swish and flick!”"] },
    alohomora:    { s: [[0.72, 0.2], [0.5, 0.16], [0.32, 0.26], [0.34, 0.42], [0.5, 0.5], [0.66, 0.58], [0.68, 0.74], [0.5, 0.84], [0.28, 0.8]],
                    uz: ["Aloxomora", "Qulflangan eshikni ochadi."], ru: ["Алохомора", "Открывает запертую дверь."], en: ["Alohomora", "Opens a locked door."] },
    expelliarmus: { s: [[0.2, 0.25], [0.78, 0.25], [0.26, 0.62], [0.82, 0.62]],
                    uz: ["Ekspelliarmus", "Raqibning qo'lidan tayoqchasini uchirib yuboradi."], ru: ["Экспеллиармус", "Выбивает палочку из рук противника."], en: ["Expelliarmus", "Knocks the wand out of an opponent's hand."] },
    accio:        { s: afArc(0.5, 0.3, 0.36, 0, Math.PI, 20),
                    uz: ["Aksio", "Uzoqdagi buyumni o'ziga chaqiradi."], ru: ["Акцио", "Призывает предмет издалека."], en: ["Accio", "Summons an object from afar."] },
    protego:      { s: [[0.25, 0.22], [0.75, 0.22], [0.75, 0.52], [0.5, 0.86], [0.25, 0.52], [0.25, 0.22]],
                    uz: ["Protego", "Sehrli qalqon hosil qiladi."], ru: ["Протего", "Создаёт магический щит."], en: ["Protego", "Casts a magical shield."] },
    incendio:     { s: [[0.18, 0.3], [0.34, 0.76], [0.5, 0.38], [0.66, 0.76], [0.82, 0.3]],
                    uz: ["Insendio", "Olov yoqadi."], ru: ["Инсендио", "Зажигает огонь."], en: ["Incendio", "Starts a fire."] },
    reparo:       { s: [[0.5, 0.18], [0.82, 0.76], [0.18, 0.76], [0.5, 0.18]],
                    uz: ["Reparo", "Singan buyumni tiklaydi."], ru: ["Репаро", "Чинит сломанную вещь."], en: ["Reparo", "Mends a broken object."] },
    stupefy:      { s: [[0.62, 0.14], [0.34, 0.5], [0.62, 0.5], [0.36, 0.88]],
                    uz: ["Stupefay", "Raqibni karaxt qiladi."], ru: ["Остолбеней", "Оглушает противника."], en: ["Stupefy", "Stuns an opponent."] },
    aguamenti:    { s: afWave(),
                    uz: ["Aguamenti", "Tayoqchadan suv oqizadi."], ru: ["Агуаменти", "Вызывает струю воды из палочки."], en: ["Aguamenti", "Shoots water from the wand."] },
    nox:          { s: [[0.2, 0.2], [0.5, 0.82], [0.8, 0.2]],
                    uz: ["Noks", "Tayoqchadagi yorug'likni o'chiradi."], ru: ["Нокс", "Гасит свет на палочке."], en: ["Nox", "Puts out the wand's light."] },
    patronum:     { s: afSpiral(),
                    uz: ["Ekspekto Patronum", "Dementorlardan himoya qiluvchi Patronusni chaqiradi."], ru: ["Экспекто Патронум", "Вызывает Патронуса — защитника от дементоров."], en: ["Expecto Patronum", "Conjures a Patronus against Dementors."] }
  };
  var AF_N = 30;
  var af = null;      // {id, round, pts:[...], idx, drawing, trail, done, msg, ok, bajar}

  // Siniq chiziqni teng oraliqli AF_N nuqtaga bo'lish
  function afResample(s, n) {
    var cum = [0], i;
    for (i = 1; i < s.length; i++) { cum.push(cum[i - 1] + Math.hypot(s[i][0] - s[i - 1][0], s[i][1] - s[i - 1][1])); }
    var len = cum[cum.length - 1] || 1, out = [], seg = 1;
    for (var k = 0; k < n; k++) {
      var d = len * k / (n - 1);
      while (seg < s.length - 1 && cum[seg] < d) { seg++; }
      var t = (d - cum[seg - 1]) / ((cum[seg] - cum[seg - 1]) || 1);
      out.push([s[seg - 1][0] + (s[seg][0] - s[seg - 1][0]) * t, s[seg - 1][1] + (s[seg][1] - s[seg - 1][1]) * t]);
    }
    return out;
  }

  // Qiyinlik aylanaga qarab: chiziq ko'rinishi (1 - aniq, .3 - xira, 0 - yoddan) va ruxsat etilgan chetlanish
  var AF_TARTIB = ["lumos", "leviosa", "alohomora", "expelliarmus", "accio", "protego",
                   "incendio", "reparo", "stupefy", "aguamenti", "nox", "patronum"];     // bot: hpdars.DARSLAR bilan bir xil
  var AF_BOSQ = [
    { r: [1, 0.3, 0], tol: 0.13 },        // 1-12-darslar: chiziq ko'rinadi -> xira -> yoddan
    { r: [0, 0, 0], tol: 0.11 }           // 13-24-darslar: uchalasi ham yoddan, chetlanish torroq
  ];
  function afOpen(bell, n) {
    var st = drData && drData.afsun;
    var item = bell === true ? (st && st.contest && st.contest.item) : AF_TARTIB[((n || 1) - 1) % AF_TARTIB.length];
    var id = AF[item] ? item : "lumos";
    var bq = bell === true ? AF_BOSQ[0] : AF_BOSQ[Math.min(Math.floor(((n || 1) - 1) / AF_TARTIB.length), AF_BOSQ.length - 1)];
    af = { id: id, round: 0, idx: 0, drawing: false, trail: [], done: false, msg: "", ok: false, show: false,
           bq: bq, bell: bell === true, n: n || 1 };
    drShowGame("scr-afsun");
    var x = drX(), f = drFan("afsun"), a = AF[id][lang] || AF[id].uz;
    $("af-kick").textContent = f.nom[lang];
    $("af-ttl").textContent = f.ust[lang];
    $("af-today").textContent = af.bell ? x.bell : x.lvl(af.n);
    $("af-name").textContent = a[0];
    $("af-desc").textContent = a[1];
    $("af-res").classList.add("hidden");
    $("af-stage").classList.remove("hidden");
    $("af-show").textContent = x.afShow;
    afSize();
    afPaint();
  }

  function afSize() {
    var c = $("af-canvas"), w = Math.min(c.parentNode.clientWidth || 320, 360);
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    c.style.width = w + "px";
    c.style.height = w + "px";
    c.width = Math.round(w * dpr);
    c.height = Math.round(w * dpr);
    af.w = w;
    af.dpr = dpr;
    af.pts = afResample(AF[af.id].s, AF_N).map(function (p) { return [p[0] * w, p[1] * w]; });
  }

  function afPaint() {
    if (!af) { return; }
    var x = drX(), c = $("af-canvas"), g = c.getContext("2d"), w = af.w, i;
    g.setTransform(af.dpr, 0, 0, af.dpr, 0, 0);
    g.clearRect(0, 0, w, w);
    var ochiq = af.show ? 0.85 : af.bq.r[Math.min(af.round, 2)] * 0.85;
    if (ochiq > 0) {
      g.lineCap = "round"; g.lineJoin = "round";
      g.strokeStyle = "rgba(160,190,240," + ochiq + ")";
      g.lineWidth = 3;
      g.setLineDash([2, 10]);
      g.beginPath();
      af.pts.forEach(function (p, k) { if (k) { g.lineTo(p[0], p[1]); } else { g.moveTo(p[0], p[1]); } });
      g.stroke();
      g.setLineDash([]);
      // oxiri - kichik halqa
      var e = af.pts[af.pts.length - 1];
      g.strokeStyle = "rgba(160,190,240," + ochiq + ")";
      g.lineWidth = 2;
      g.beginPath(); g.arc(e[0], e[1], 9, 0, Math.PI * 2); g.stroke();
    }
    // boshlanish nuqtasi doim ko'rinadi
    var s = af.pts[0];
    g.fillStyle = "rgba(243,213,143,.25)";
    g.beginPath(); g.arc(s[0], s[1], 17, 0, Math.PI * 2); g.fill();
    g.fillStyle = "#f3d58f";
    g.beginPath(); g.arc(s[0], s[1], 7, 0, Math.PI * 2); g.fill();
    // chizilgan iz
    if (af.trail.length > 1) {
      g.lineCap = "round"; g.lineJoin = "round";
      g.shadowColor = af.ok ? "rgba(243,213,143,.95)" : "rgba(150,200,255,.9)";
      g.shadowBlur = 14;
      g.strokeStyle = af.ok ? "#f3d58f" : "#cfe4ff";
      g.lineWidth = 5;
      g.beginPath();
      for (i = 0; i < af.trail.length; i++) { if (i) { g.lineTo(af.trail[i][0], af.trail[i][1]); } else { g.moveTo(af.trail[i][0], af.trail[i][1]); } }
      g.stroke();
      g.shadowBlur = 0;
    }
    var ko = af.bq.r[Math.min(af.round, 2)];
    $("af-step").textContent = x.afStep(Math.min(af.round + 1, 3), 3) + (bl && af.bell ? " · " + x.sec(Date.now() - bl.t0 + bl.xato * 3000) : "");
    $("af-hint").textContent = af.msg || x.afR[ko >= 1 ? 0 : ko > 0 ? 1 : 2];
    $("af-hint").classList.toggle("bad", !!af.bad);
    $("af-show").classList.toggle("hidden", af.bell || af.bq.r[Math.min(af.round, 2)] > 0 || af.show || af.done);
  }

  function afXY(ev) {
    var r = $("af-canvas").getBoundingClientRect();
    return [ev.clientX - r.left, ev.clientY - r.top];
  }
  // Nuqtadan chiziqqacha eng qisqa masofa
  function afDist(p) {
    var best = 1e9, a, b, t, dx, dy, i;
    for (i = 1; i < af.pts.length; i++) {
      a = af.pts[i - 1]; b = af.pts[i];
      dx = b[0] - a[0]; dy = b[1] - a[1];
      t = Math.max(0, Math.min(1, ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / ((dx * dx + dy * dy) || 1)));
      best = Math.min(best, Math.hypot(p[0] - (a[0] + dx * t), p[1] - (a[1] + dy * t)));
    }
    return best;
  }

  function afFail(matn) {
    if (bl && af.bell) { bl.xato++; }
    af.drawing = false;
    af.msg = matn;
    af.bad = true;
    afPaint();
    try { if (tg && tg.HapticFeedback) { tg.HapticFeedback.notificationOccurred("error"); } } catch (e) {}
    setTimeout(function () { if (af && !af.drawing && !af.done) { af.trail = []; af.idx = 0; afPaint(); } }, 650);
  }

  function afDown(ev) {
    if (!af || af.done || af.lock) { return; }
    var p = afXY(ev), x = drX(), tol = af.w * 0.13;
    af.bad = false;
    af.ok = false;
    if (Math.hypot(p[0] - af.pts[0][0], p[1] - af.pts[0][1]) > tol * 1.5) { af.msg = x.afStart; af.bad = true; af.trail = []; afPaint(); return; }
    af.drawing = true;
    af.idx = 0;
    af.msg = "";
    af.trail = [p];
    try { ev.preventDefault(); } catch (e) {}
    afPaint();
  }

  function afMove(ev) {
    if (!af || !af.drawing) { return; }
    var p = afXY(ev), tol = af.w * (af.bq.tol + (af.bq.r[Math.min(af.round, 2)] === 0 ? 0.02 : 0));
    af.trail.push(p);
    if (afDist(p) > tol * 1.9) { afFail(drX().afOff); return; }
    while (af.idx < af.pts.length - 1 && Math.hypot(p[0] - af.pts[af.idx + 1][0], p[1] - af.pts[af.idx + 1][1]) < tol) { af.idx++; }
    afPaint();
  }

  function afUp() {
    if (!af || !af.drawing) { return; }
    af.drawing = false;
    var x = drX();
    if (af.idx < af.pts.length - 2) { afFail(x.afShort); return; }
    // urinish o'tdi
    af.ok = true;
    af.msg = x.afOk[Math.min(af.round, 2)];
    af.bad = false;
    af.lock = true;
    afPaint();
    try { if (tg && tg.HapticFeedback) { tg.HapticFeedback.impactOccurred("light"); } } catch (e) {}
    var tugadi = af.round >= 2;
    setTimeout(function () {
      if (!af) { return; }
      af.lock = false;
      if (!tugadi) {
        af.round++;
        af.trail = [];
        af.idx = 0;
        af.ok = false;
        af.msg = "";
        af.show = false;
        afPaint();
        return;
      }
      af.done = true;
      if (af.bell) {
        $("af-stage").classList.add("hidden");
        blFinish($("af-res"));
        return;
      }
      var daraja = af.n;
      drDone("afsun", daraja, function (yangi) {
        $("af-stage").classList.add("hidden");
        drResult($("af-res"), x.afOk[2], "afsun", daraja, yangi);
      });
    }, 900);
  }

  /* ================= IKSIRLAR: retsept bo'yicha tartib bilan solish ================= */
  var IK_M = {
    nettle: ["Quritilgan qichitqi o't", "Сушёная крапива", "Dried nettles"], fangs: ["Ilon tishlari", "Змеиные зубы", "Snake fangs"],
    slugs: ["Shoxli shilliqqurtlar", "Рогатые слизни", "Horned slugs"], quills: ["Jayra ignalari", "Иглы дикобраза", "Porcupine quills"],
    lethe: ["Leta daryosi suvi", "Вода из реки Леты", "Lethe River water"], valerian: ["Valeriana novdalari", "Веточки валерианы", "Valerian sprigs"],
    mistletoe: ["Omela mevalari", "Ягоды омелы", "Mistletoe berries"], daisy: ["Moychechak ildizi", "Корни маргаритки", "Daisy roots"],
    fig: ["Tozalangan quruq anjir", "Очищенная сушёная смоква", "Peeled shrivelfig"], caterpillar: ["Kapalak qurtlari", "Гусеницы", "Caterpillars"],
    ratspleen: ["Kalamush talog'i", "Крысиная селезёнка", "Rat spleen"], leech: ["Zuluk sharbati", "Сок пиявки", "Leech juice"],
    bezoar: ["Bezoar toshi", "Безоар", "Bezoar"], unicorn: ["Yakkashox shoxi kukuni", "Толчёный рог единорога", "Powdered unicorn horn"],
    honeywater: ["Asal suvi", "Медовая вода", "Honeywater"], salamander: ["Salamandra qoni", "Кровь саламандры", "Salamander blood"],
    lionfish: ["Sherbaliq tikanlari", "Шипы крылатки", "Lionfish spines"], flobber: ["Flobber-qurt shillig'i", "Слизь флоббер-червя", "Flobberworm mucus"],
    lavender: ["Lavanda", "Лаванда", "Lavender"], cabbage: ["Xitoy chaynar karami", "Китайская жующая капуста", "Chinese chomping cabbage"],
    puffer: ["Sharbaliq ko'zlari", "Глаза рыбы-собаки", "Puffer-fish eyes"], scarab: ["Skarabey qo'ng'izlari", "Жуки-скарабеи", "Scarab beetles"],
    wormwood: ["Shuvoq damlamasi", "Настойка полыни", "Infusion of wormwood"], asphodel: ["Asfodel ildizi kukuni", "Толчёный корень асфоделя", "Powdered root of asphodel"],
    sopophorous: ["Uyqu no'xati sharbati", "Сок дремоносных бобов", "Sopophorous bean juice"], lacewing: ["To'rqanot pashshalar", "Златоглазки", "Lacewing flies"],
    bicorn: ["Ikkishox shoxi kukuni", "Толчёный рог двурога", "Powdered bicorn horn"], boomslang: ["Bumslang terisi", "Шкура бумсланга", "Boomslang skin"],
    hair: ["Bir tola soch", "Один волос", "A single hair"], ashwinder: ["Olovilon tuxumi", "Яйцо огневицы", "Ashwinder egg"],
    horseradish: ["Xren ildizi", "Корень хрена", "Horseradish"], squill: ["Dengiz piyozi", "Морской лук", "Squill bulb"],
    murtlap: ["Murtlap o'simtasi", "Отросток растопырника", "Murtlap tentacle"], thyme: ["Tog'jambil damlamasi", "Настойка тимьяна", "Tincture of thyme"],
    ginger: ["Zanjabil ildizi", "Корень имбиря", "Ginger root"], armadillo: ["Zirhli hayvon safrosi", "Желчь броненосца", "Armadillo bile"],
    moonstone: ["Oy toshi kukuni", "Толчёный лунный камень", "Powdered moonstone"], hellebore: ["Chemeritsa sharbati", "Сироп чемерицы", "Syrup of hellebore"]
  };
  var IK = {
    boils:      { c: "#7fb86a", r: ["nettle", "fangs", "slugs", "quills"], uz: "Chipqonga qarshi damlama", ru: "Зелье от фурункулов", en: "Cure for Boils" },
    forget:     { c: "#8fb7d9", r: ["lethe", "valerian", "mistletoe"], uz: "Unutish damlamasi", ru: "Зелье забвения", en: "Forgetfulness Potion" },
    shrink:     { c: "#9ad04a", r: ["daisy", "fig", "caterpillar", "ratspleen", "leech"], uz: "Kichraytiruvchi eritma", ru: "Уменьшающее зелье", en: "Shrinking Solution" },
    antidote:   { c: "#5fb3a8", r: ["bezoar", "unicorn", "mistletoe", "honeywater"], uz: "Oddiy zaharlarga qarshi dori", ru: "Противоядие от обычных ядов", en: "Antidote to Common Poisons" },
    wiggenweld: { c: "#59c06b", r: ["salamander", "lionfish", "flobber", "honeywater"], uz: "Vigenveld damlamasi", ru: "Рябиновый отвар", en: "Wiggenweld Potion" },
    uyqu:       { c: "#9a86d6", r: ["lavender", "flobber", "valerian"], uz: "Uyqu damlamasi", ru: "Усыпляющее зелье", en: "Sleeping Draught" },
    skelegro:   { c: "#d9d2bb", r: ["cabbage", "puffer", "scarab"], uz: "«Suyako's»", ru: "«Костерост»", en: "Skele-Gro" },
    living:     { c: "#c9b8e6", r: ["wormwood", "asphodel", "valerian", "sopophorous"], uz: "Tirik o'lim damlamasi", ru: "Напиток живой смерти", en: "Draught of Living Death" },
    wit:        { c: "#e0b25b", r: ["scarab", "ginger", "armadillo"], uz: "Aqlni charxlovchi damlama", ru: "Зелье остроты ума", en: "Wit-Sharpening Potion" },
    peace:      { c: "#b7c7d9", r: ["moonstone", "hellebore", "quills", "unicorn"], uz: "Tinchlik damlamasi", ru: "Умиротворяющий бальзам", en: "Draught of Peace" },
    polyjuice:  { c: "#8a8f4a", r: ["lacewing", "leech", "bicorn", "boomslang", "hair"], uz: "Ko'p qiyofali damlama", ru: "Оборотное зелье", en: "Polyjuice Potion" },
    felix:      { c: "#f3d58f", r: ["ashwinder", "horseradish", "squill", "murtlap", "thyme"], uz: "Feliks Felitsis", ru: "Феликс Фелицис", en: "Felix Felicis" }
  };
  var IK_XATO = 3;
  var ik = null;      // {id, phase: "rec"|"cook"|"done", step, err, chips, bajar}

  function ikNom(m) { var i = lang === "ru" ? 1 : lang === "en" ? 2 : 0; return (IK_M[m] || [m, m, m])[i]; }

  // Qiyinlik aylanaga qarab: nechta masalliq orasidan tanlanadi va nechta xatoga ruxsat
  var IK_TARTIB = ["boils", "forget", "shrink", "antidote", "wiggenweld", "uyqu",
                   "skelegro", "living", "wit", "peace", "polyjuice", "felix"];          // bot: hpdars.DARSLAR bilan bir xil
  var IK_BOSQ = [{ chips: 8, xato: 3 }, { chips: 12, xato: 2 }];      // 1-12-darslar; 13-24-darslar
  function ikOpen(bell, n) {
    var st = drData && drData.iksir;
    var item = bell === true ? (st && st.contest && st.contest.item) : IK_TARTIB[((n || 1) - 1) % IK_TARTIB.length];
    var id = IK[item] ? item : "boils";
    var bq = bell === true ? { chips: 10, xato: 99 } : IK_BOSQ[Math.min(Math.floor(((n || 1) - 1) / IK_TARTIB.length), IK_BOSQ.length - 1)];
    ik = { id: id, phase: "rec", step: 0, err: 0, chips: [], bq: bq, bell: bell === true, n: n || 1 };
    drShowGame("scr-iksir");
    var x = drX(), f = drFan("iksir");
    $("ik-kick").textContent = f.nom[lang];
    $("ik-ttl").textContent = f.ust[lang];
    $("ik-today").textContent = ik.bell ? x.bell : x.lvl(ik.n);
    $("ik-timer").classList.toggle("hidden", !ik.bell);
    $("ik-name").textContent = IK[id][lang] || IK[id].uz;
    ikRender();
  }

  function ikShuffle(a) {
    for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  }

  function ikStart() {
    var rec = IK[ik.id].r, boshqa = ikShuffle(Object.keys(IK_M).filter(function (m) { return rec.indexOf(m) < 0; }));
    ik.chips = ikShuffle(rec.concat(boshqa.slice(0, ik.bq.chips - rec.length)));
    ik.phase = "cook";
    ik.step = 0;
    ik.err = 0;
    ik.msg = "";
    ikRender();
  }

  function ikRender() {
    if (!ik) { return; }
    var x = drX(), p = IK[ik.id], rec = p.r;
    var recBox = $("ik-rec"), cook = $("ik-cook"), res = $("ik-res");
    recBox.classList.toggle("hidden", ik.phase !== "rec");
    cook.classList.toggle("hidden", ik.phase !== "cook");
    res.classList.toggle("hidden", ik.phase !== "done");
    $("ik-pot").style.setProperty("--ik", p.c);
    $("ik-pot").style.setProperty("--ik-h", Math.round(18 + 62 * ik.step / rec.length) + "%");
    $("ik-pot").classList.toggle("tayyor", ik.phase === "done");
    if (ik.phase === "rec") {
      $("ik-rec-t").textContent = x.ikRec;
      $("ik-rec-s").textContent = ik.msg || x.ikRecS;
      $("ik-rec-s").classList.toggle("bad", !!ik.msg);
      var ol = $("ik-rec-l");
      ol.innerHTML = "";
      rec.forEach(function (m) { ol.appendChild(drEl("li", "", ikNom(m))); });
      $("ik-go").textContent = x.ikGo;
      return;
    }
    if (ik.phase === "cook") {
      $("ik-cook-t").textContent = ik.msg || x.ikCook;
      $("ik-cook-t").classList.toggle("bad", !!ik.msg);
      $("ik-prog").textContent = x.ikStep(ik.step, rec.length) + " · " + (ik.bell ? x.ikErr(ik.err, "∞").replace(" / ∞", "") : x.ikErr(ik.err, ik.bq.xato));
      var box = $("ik-chips");
      box.innerHTML = "";
      ik.chips.forEach(function (m) {
        var solingan = rec.indexOf(m) >= 0 && rec.indexOf(m) < ik.step;
        var b = drEl("button", "ik-chip" + (solingan ? " in" : ""), ikNom(m));
        b.type = "button";
        b.disabled = solingan;
        b.addEventListener("click", function () { ikPick(m, b); });
        box.appendChild(b);
      });
    }
  }

  function ikPick(m, btn) {
    if (!ik || ik.phase !== "cook" || ik.lock) { return; }
    var x = drX(), rec = IK[ik.id].r;
    if (rec[ik.step] === m) {
      ik.step++;
      ik.msg = "";
      try { if (tg && tg.HapticFeedback) { tg.HapticFeedback.impactOccurred("light"); } } catch (e) {}
      $("ik-pot").classList.remove("qayna");
      void $("ik-pot").offsetWidth;
      $("ik-pot").classList.add("qayna");
      if (ik.step >= rec.length) {
        ik.lock = true;
        ikRender();
        setTimeout(function () {
          if (!ik) { return; }
          ik.lock = false;
          ik.phase = "done";
          ikRender();
          if (ik.bell) { blFinish($("ik-res")); return; }
          var daraja = ik.n;
          drDone("iksir", daraja, function (yangi) { drResult($("ik-res"), x.ikOk, "iksir", daraja, yangi); });
        }, 700);
        return;
      }
      ikRender();
      return;
    }
    // xato masalliq
    ik.err++;
    if (bl && ik.bell) { bl.xato++; }
    try { if (tg && tg.HapticFeedback) { tg.HapticFeedback.notificationOccurred("error"); } } catch (e) {}
    btn.classList.add("xato");
    $("ik-pot").classList.remove("tutun");
    void $("ik-pot").offsetWidth;
    $("ik-pot").classList.add("tutun");
    if (ik.err >= ik.bq.xato) {
      ik.lock = true;
      setTimeout(function () {
        if (!ik) { return; }
        ik.lock = false;
        ik.phase = "rec";
        ik.step = 0;
        ik.msg = x.ikBoom;
        ikRender();
      }, 700);
      return;
    }
    ik.msg = x.ikBad[Math.min(ik.err - 1, 1)];
    $("ik-cook-t").textContent = ik.msg;
    $("ik-cook-t").classList.add("bad");
    $("ik-prog").textContent = x.ikStep(ik.step, rec.length) + " · " + (ik.bell ? x.ikErr(ik.err, "∞").replace(" / ∞", "") : x.ikErr(ik.err, ik.bq.xato));
  }

  function drSetup() {
    $("dr-back").addEventListener("click", function () { $("scr-dars").classList.add("hidden"); drQayt = false; try { openHub(); } catch (e) {} });
    $("af-back").addEventListener("click", function () { var b = af && af.bell; af = null; blAbort(); if (b) { blOpen("afsun"); } else { fanOpen("afsun"); } });
    $("ik-back").addEventListener("click", function () { var b = ik && ik.bell; ik = null; blAbort(); if (b) { blOpen("iksir"); } else { fanOpen("iksir"); } });
    $("tr-back").addEventListener("click", function () { var b = tr && tr.bell; tr = null; blAbort(); if (b) { blOpen("tarix"); } else { fanOpen("tarix"); } });
    $("bl-back").addEventListener("click", function () {
      blAbort();
      try { if (sqBack()) { $("scr-bell").classList.add("hidden"); return; } } catch (e) {}     // Shokolad qurbaqa topshirig'idan kelingan
      blHomeOpen();
    });
    $("blh-back").addEventListener("click", function () { $("scr-blh").classList.add("hidden"); blQayt = false; try { openHub(); } catch (e) {} });
    $("fn-back").addEventListener("click", function () { drOpen(); });
    $("bl-go").addEventListener("click", blStart);
    $("ik-go").addEventListener("click", function () { if (ik) { ik.msg = ""; ikStart(); } });
    $("af-show").addEventListener("click", function () { if (af && !af.done) { af.show = true; af.trail = []; afPaint(); } });
    var c = $("af-canvas");
    if (window.PointerEvent) {
      c.addEventListener("pointerdown", afDown);
      c.addEventListener("pointermove", afMove);
      c.addEventListener("pointerup", afUp);
      c.addEventListener("pointercancel", afUp);
      c.addEventListener("pointerleave", afUp);
    } else {
      var tch = function (fn) { return function (ev) { var t = ev.changedTouches && ev.changedTouches[0]; if (t) { fn({ clientX: t.clientX, clientY: t.clientY, preventDefault: function () { ev.preventDefault(); } }); } }; };
      c.addEventListener("touchstart", tch(afDown), { passive: false });
      c.addEventListener("touchmove", tch(afMove), { passive: false });
      c.addEventListener("touchend", function () { afUp(); });
    }
    window.addEventListener("resize", function () { if (af && !$("scr-afsun").classList.contains("hidden")) { af.trail = []; afSize(); afPaint(); } });
  }

  drSetup();
