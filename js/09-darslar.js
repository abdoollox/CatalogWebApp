/* Darslar: Xogvarts fanlari - har biri kichik interaktiv mashg'ulot (Afsunlar, Damlamalar...), kuniga bir marta ball
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
      nom: { uz: "Damlamalar", ru: "Зельеварение", en: "Potions" },
      ust: { uz: "Professor Sneyp", ru: "Профессор Снегг", en: "Professor Snape" },
      izoh: { uz: "Retseptni eslab qoling va damlamani tartib bilan tayyorlang.", ru: "Запомните рецепт и сварите зелье по порядку.", en: "Memorise the recipe and brew the potion in order." } },
    { id: "trans", on: false, rgb: "200,150,90",
      nom: { uz: "Transfiguratsiya", ru: "Трансфигурация", en: "Transfiguration" },
      ust: { uz: "Professor Makgonagall", ru: "Профессор Макгонагалл", en: "Professor McGonagall" } },
    { id: "himoya", on: true, rgb: "190,110,110",
      nom: { uz: "Qora san'atlardan himoya", ru: "Защита от Тёмных искусств", en: "Defence Against the Dark Arts" },
      ust: { uz: "Professor Lyupin", ru: "Профессор Люпин", en: "Professor Lupin" },
      izoh: { uz: "Xavf yetib kelguncha to'g'ri himoya afsunini tanlang.", ru: "Выберите верное защитное заклинание, пока опасность не настигла.", en: "Pick the right defensive spell before the danger reaches you." } },
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
          afBaho: ["Troll", "Yomon", "Qoniqarli", "Kutilganidan yuqori", "A'lo"], afBahoT: "Baho", afAcc: function (p) { return "Aniqlik " + p + "%"; }, afVaqt: function (a, b) { return "Vaqtida " + a + " / " + b; },
          afLow: "Keyingi darsga o'tish uchun kamida «Qoniqarli» baho kerak.",
          afNth: function (a, b) { return a + " / " + b + "-afsun"; }, afVazT: "Qaysi afsun kerak?", afVazK: "Vaziyat", afZanK: "Ketma-ket afsunlar", afVazNo: "Bu afsun yordam bermaydi",
          afFlN: "Professor Flitvik",
          afFl: { a: ["Ajoyib, juda aniq!", "Barakalla! Bilak harakati a'lo.", "Zo'r! Xuddi darslikdagidek."],
                  b: ["Yomon emas. Bilakni yumshoqroq tuting.", "Durust, lekin chiziqdan uzoqlashmang.", "Bo'ladi. Yana bir oz diqqat!"],
                  c: ["Tezroq — sham kutib turmaydi!", "To'g'ri, lekin juda sekin."] },
          afFlB: ["Bunaqada tayoqcha ham xafa bo'ladi. Qaytadan!", "Hali mashq kerak. Yana bir urinib ko'ring.", "Qoniqarli. Mashq qilsangiz, bundan ham yaxshi chiqadi.", "Juda yaxshi! Yana ozgina — va a'lo bo'ladi.", "A'lo! Fakultetingiz siz bilan faxrlansa arziydi."], afPuf: "Afsun chiqmadi…", afKech: "sham o'chdi",
          // iksirlar
          ikRec: "Retsept", ikRecS: "Masalliqlar tartibini eslab qoling — keyin retsept yopiladi.", ikGo: "Tayyorman",
          ikCook: "Masalliqlarni tartib bilan qozonga soling", ikErr: function (a, b) { return "Xato: " + a + " / " + b; },
          ikBad: ["Noto'g'ri. Diqqat qiling!", "Yana xato. Qozon qaynab ketyapti…"], ikBoom: "Damlama buzildi. Retseptni qaytadan o'qing.",
          ikOk: "Damlama tayyor. Professor Sneyp… hech narsa demadi. Bu maqtov.",
          hmStep: function (a, b) { return a + " / " + b + "-xavf"; }, hmGo: "Boshlash", hmNew: "Yangi xavf. Qaysi afsun yordam berishini eslab qoling.",
          hmOld: "Yangi xavf yo'q. Endi ular ko'proq va tezroq keladi.", hmHint: "To'g'ri himoyani tanlang", hmOk: ["Ajoyib!", "Juda yaxshi!", "Xuddi shunday!"],
          hmBad: "Bu yordam bermaydi!", hmLate: "Kech qoldingiz!", hmLpN: "Professor Lyupin", hmStat: function (w, l) { return "Xato: " + w + " · Kechikish: " + l; },
          hmLpB: ["Hechqisi yo'q. Shokolad yeng va qaytadan urinib ko'ring.", "Hali tayyor emassiz, lekin buni o'rgansa bo'ladi. Yana bir marta.", "Qoniqarli. Xavf oldida o'zingizni yo'qotmadingiz.", "Juda yaxshi! Tezligingiz oshyapti.", "A'lo! Bunday himoyani kam ko'rganman."],
          ikImt: "Imtihon", ikYop: function (n) { return "Retsept " + n + " soniyadan keyin yopiladi"; }, ikXato: function (n) { return "Xato: " + n; },
          ikVaqt: ["Vaqtida", "Sham o'chdi"], ikSnN: "Professor Sneyp", ikTogri: ["Hm. To'g'ri.", "Davom eting.", "Shunday."],
          ikSnB: ["Bu damlama emas, bu falokat. Qaytadan.", "Achinarli. Retseptni o'qishni ham bilmaysizmi?", "Qoniqarli. Hech kim zaharlanmaydi — shunisi ham katta gap.", "Yomon emas. Sizdan buni kutmagan edim.", "A'lo. Bu so'zni tez-tez aytmayman."], ikStep: function (a, b) { return a + " / " + b; } },
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
          afBaho: ["Тролль", "Слабо", "Удовлетворительно", "Выше ожидаемого", "Превосходно"], afBahoT: "Оценка", afAcc: function (p) { return "Точность " + p + "%"; }, afVaqt: function (a, b) { return "Вовремя " + a + " / " + b; },
          afLow: "Чтобы перейти к следующему уроку, нужна оценка не ниже «Удовлетворительно».",
          afNth: function (a, b) { return "Заклинание " + a + " / " + b; }, afVazT: "Какое заклинание нужно?", afVazK: "Ситуация", afZanK: "Серия заклинаний", afVazNo: "Это заклинание не поможет",
          afFlN: "Профессор Флитвик",
          afFl: { a: ["Превосходно, очень точно!", "Браво! Отличное движение кисти.", "Блестяще! Как в учебнике."],
                  b: ["Неплохо. Держите кисть мягче.", "Сносно, но не уходите от линии.", "Годится. Чуть больше внимания!"],
                  c: ["Быстрее — свеча ждать не будет!", "Верно, но слишком медленно."] },
          afFlB: ["Так и палочка обидится. Ещё раз!", "Нужно ещё потренироваться. Попробуйте снова.", "Удовлетворительно. С практикой выйдет лучше.", "Очень хорошо! Ещё чуть-чуть — и будет «Превосходно».", "Превосходно! Ваш факультет может вами гордиться."], afPuf: "Заклинание не получилось…", afKech: "свеча погасла",
          ikRec: "Рецепт", ikRecS: "Запомните порядок ингредиентов — потом рецепт закроется.", ikGo: "Готов",
          ikCook: "Кладите ингредиенты в котёл по порядку", ikErr: function (a, b) { return "Ошибки: " + a + " / " + b; },
          ikBad: ["Неверно. Внимательнее!", "Опять ошибка. Котёл закипает…"], ikBoom: "Зелье испорчено. Прочитайте рецепт ещё раз.",
          hmStep: function (a, b) { return "Опасность " + a + " / " + b; }, hmGo: "Начать", hmNew: "Новая опасность. Запомните, какое заклинание поможет.",
          hmOld: "Новых опасностей нет. Теперь их больше и они быстрее.", hmHint: "Выберите верную защиту", hmOk: ["Превосходно!", "Очень хорошо!", "Именно так!"],
          hmBad: "Это не поможет!", hmLate: "Слишком поздно!", hmLpN: "Профессор Люпин", hmStat: function (w, l) { return "Ошибок: " + w + " · Опозданий: " + l; },
          hmLpB: ["Ничего страшного. Съешьте шоколад и попробуйте снова.", "Вы пока не готовы, но этому можно научиться. Ещё раз.", "Удовлетворительно. Вы не растерялись перед опасностью.", "Очень хорошо! Вы становитесь быстрее.", "Превосходно! Такую защиту я вижу редко."],
          ikImt: "Экзамен", ikYop: function (n) { return "Рецепт закроется через " + n + " с"; }, ikXato: function (n) { return "Ошибок: " + n; },
          ikVaqt: ["Вовремя", "Свеча погасла"], ikSnN: "Профессор Снегг", ikTogri: ["Хм. Верно.", "Продолжайте.", "Так."],
          ikSnB: ["Это не зелье, это катастрофа. Заново.", "Прискорбно. Вы и рецепт прочесть не способны?", "Удовлетворительно. Никто не отравится — уже достижение.", "Неплохо. От вас я этого не ожидал.", "Превосходно. Я нечасто произношу это слово."],
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
          afBaho: ["Troll", "Poor", "Acceptable", "Exceeds Expectations", "Outstanding"], afBahoT: "Grade", afAcc: function (p) { return "Accuracy " + p + "%"; }, afVaqt: function (a, b) { return "In time " + a + " / " + b; },
          afLow: "You need at least “Acceptable” to move on.",
          afNth: function (a, b) { return "Spell " + a + " / " + b; }, afVazT: "Which spell do you need?", afVazK: "Situation", afZanK: "Spell chain", afVazNo: "That spell won't help",
          afFlN: "Professor Flitwick",
          afFl: { a: ["Splendid, very precise!", "Bravo! Lovely wrist movement.", "Excellent! Just like the textbook."],
                  b: ["Not bad. Keep your wrist looser.", "Passable, but stay close to the line.", "That will do. A little more care!"],
                  c: ["Quicker — the candle won't wait!", "Correct, but far too slow."] },
          afFlB: ["Even the wand is offended. Again!", "More practice needed. Try once more.", "Acceptable. Practice will make it better.", "Very good! A little more and it's Outstanding.", "Outstanding! Your house can be proud of you."], afPuf: "The spell fizzled…", afKech: "the candle went out",
          ikRec: "Recipe", ikRecS: "Memorise the order of the ingredients — then the recipe closes.", ikGo: "Ready",
          ikCook: "Add the ingredients to the cauldron in order", ikErr: function (a, b) { return "Mistakes: " + a + " / " + b; },
          ikBad: ["Wrong. Pay attention!", "Wrong again. The cauldron is boiling over…"], ikBoom: "The potion is ruined. Read the recipe again.",
          hmStep: function (a, b) { return "Danger " + a + " / " + b; }, hmGo: "Begin", hmNew: "A new danger. Remember which spell helps.",
          hmOld: "No new dangers. Now there are more of them, and they are faster.", hmHint: "Pick the right defence", hmOk: ["Excellent!", "Very good!", "Exactly!"],
          hmBad: "That won't help!", hmLate: "Too late!", hmLpN: "Professor Lupin", hmStat: function (w, l) { return "Mistakes: " + w + " · Too late: " + l; },
          hmLpB: ["Never mind. Eat some chocolate and try again.", "You are not ready yet, but this can be learnt. Once more.", "Acceptable. You kept your head in the face of danger.", "Very good! You are getting quicker.", "Outstanding! I rarely see a defence like that."],
          ikImt: "Exam", ikYop: function (n) { return "The recipe closes in " + n + " s"; }, ikXato: function (n) { return "Mistakes: " + n; },
          ikVaqt: ["In time", "The candle went out"], ikSnN: "Professor Snape", ikTogri: ["Hm. Correct.", "Continue.", "Indeed."],
          ikSnB: ["That is not a potion, it is a disaster. Again.", "Pitiful. Can you not even read a recipe?", "Acceptable. Nobody will be poisoned — an achievement in itself.", "Not bad. I did not expect that from you.", "Outstanding. I do not say that word often."],
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
  var drLocalLvl = { tarix: 2, afsun: 40, iksir: 30, himoya: 26 }, drLocalBest = {};
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
      afsun: { level: drLocalLvl.afsun, total: 48, contest: bell("afsun", "lumos") },
      iksir: { level: drLocalLvl.iksir, total: 36, contest: bell("iksir", "boils") },
      himoya: { level: drLocalLvl.himoya, total: 36, contest: bell("himoya", "dementor") } };
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
    ["scr-hub", "scr-cat", "scr-cup", "scr-tasks", "scr-quiz", "scr-afsun", "scr-iksir", "scr-bell", "scr-blh", "scr-fan", "scr-tarix", "scr-himoya", "scr-sq", "pm"].forEach(function (id) {
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
    ["scr-hub", "scr-cat", "scr-cup", "scr-dars", "scr-fan", "scr-afsun", "scr-iksir", "scr-tarix", "scr-himoya", "scr-bell", "scr-sq",
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
    ["scr-dars", "scr-afsun", "scr-iksir", "scr-fan", "scr-tarix", "scr-himoya", "scr-blh", "scr-hub", "scr-sq"].forEach(function (id) { $(id).classList.add("hidden"); });
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
      if (fan === "afsun") { afOpen(true); } else if (fan === "iksir") { ikOpen(true); } else if (fan === "himoya") { hmOpen(true); } else { trStart(res.questions || [], true, 0); }
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
    ["scr-dars", "scr-afsun", "scr-iksir", "scr-bell", "scr-tarix", "scr-himoya", "scr-hub", "scr-quiz", "scr-tasks"].forEach(function (q) { $(q).classList.add("hidden"); });
    $("scr-fan").classList.remove("hidden");
    fanRender();
    try { window.scrollTo(0, 0); } catch (e) {}
  }

  function fanRender() {
    var x = drX(), f = drFan(fanId), st = drData && drData[fanId];
    if (!f) { return; }
    $("fn-kick").textContent = f.ust[lang];
    $("fn-ttl").textContent = f.nom[lang];
    $("fn-ttl").classList.toggle("uzun", f.nom[lang].length > 18);
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
        if (DR_BAHO_K[fanId] && k <= lv && drBahoGet(fanId, k) >= 4) { b.classList.add("bh" + drBahoGet(fanId, k)); }
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
    else if (id === "himoya") { hmOpen(false, n); }
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
    ["scr-dars", "scr-afsun", "scr-iksir", "scr-bell", "scr-blh", "scr-fan", "scr-tarix", "scr-himoya"].forEach(function (id) { $(id).classList.toggle("hidden", id !== scr); });
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
  function afSakkiz() {
    var p = [];
    for (var i = 0; i <= 40; i++) { var t = i / 40 * Math.PI * 2; p.push([0.5 + 0.32 * Math.sin(t), 0.5 + 0.2 * Math.sin(2 * t)]); }
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
                    uz: ["Ekspekto Patronum", "Dementorlardan himoya qiluvchi Patronusni chaqiradi."], ru: ["Экспекто Патронум", "Вызывает Патронуса — защитника от дементоров."], en: ["Expecto Patronum", "Conjures a Patronus against Dementors."] },
    petrificus:   { s: [[0.25, 0.82], [0.25, 0.22], [0.75, 0.22], [0.75, 0.82]],
                    uz: ["Petrifikus Totalus", "Raqibning butun tanasini qotirib qo'yadi."], ru: ["Петрификус Тоталус", "Полностью обездвиживает противника."], en: ["Petrificus Totalus", "Binds the whole body of an opponent."] },
    impedimenta:  { s: [[0.15, 0.3], [0.85, 0.3], [0.85, 0.7], [0.15, 0.7]],
                    uz: ["Impedimenta", "Yaqinlashayotgan raqibni sekinlashtiradi yoki to'xtatadi."], ru: ["Импедимента", "Замедляет или останавливает приближающегося противника."], en: ["Impedimenta", "Slows or stops an approaching attacker."] },
    riddikulus:   { s: afArc(0.5, 0.5, 0.3, -Math.PI / 2, Math.PI * 1.5, 32),
                    uz: ["Ridikulus", "Boggartni kulgili narsaga aylantiradi."], ru: ["Ридикулус", "Превращает боггарта во что-то смешное."], en: ["Riddikulus", "Turns a Boggart into something funny."] },
    finite:       { s: [[0.2, 0.2], [0.8, 0.8]],
                    uz: ["Finite Inkantatem", "Amal qilayotgan afsunlarni to'xtatadi."], ru: ["Фините Инкантатем", "Прекращает действие заклинаний."], en: ["Finite Incantatem", "Ends the effects of spells."] },
    reducto:      { s: [[0.25, 0.2], [0.78, 0.5], [0.25, 0.8]],
                    uz: ["Redukto", "Qattiq to'siqni parcha-parcha qiladi."], ru: ["Редукто", "Разбивает твёрдую преграду на куски."], en: ["Reducto", "Blasts a solid obstacle to pieces."] },
    diffindo:     { s: [[0.18, 0.5], [0.4, 0.78], [0.84, 0.2]],
                    uz: ["Diffindo", "Buyumni kesadi yoki yirtadi."], ru: ["Диффиндо", "Разрезает или разрывает предмет."], en: ["Diffindo", "Cuts or rips an object."] },
    episkey:      { s: afArc(0.5, 0.72, 0.34, Math.PI, Math.PI * 2, 20),
                    uz: ["Episkey", "Yengil jarohatlarni davolaydi."], ru: ["Эпискеи", "Залечивает лёгкие травмы."], en: ["Episkey", "Heals minor injuries."] },
    silencio:     { s: [[0.82, 0.32], [0.2, 0.32], [0.2, 0.74]],
                    uz: ["Silensio", "Ovozni o'chirib qo'yadi."], ru: ["Силенцио", "Лишает голоса."], en: ["Silencio", "Silences its target."] },
    engorgio:     { s: [[0.25, 0.25], [0.75, 0.25], [0.75, 0.75], [0.25, 0.75], [0.25, 0.25]],
                    uz: ["Engorgio", "Buyumni kattalashtiradi."], ru: ["Энгоргио", "Увеличивает предмет."], en: ["Engorgio", "Makes an object grow."] },
    reducio:      { s: [[0.5, 0.15], [0.8, 0.5], [0.5, 0.85], [0.2, 0.5], [0.5, 0.15]],
                    uz: ["Redusio", "Buyumni kichraytiradi."], ru: ["Редуцио", "Уменьшает предмет."], en: ["Reducio", "Makes an object shrink."] },
    colloportus:  { s: afArc(0.5, 0.32, 0.17, Math.PI / 2, Math.PI * 2.5, 24).concat([[0.5, 0.88]]),
                    uz: ["Kolloportus", "Eshikni sehr bilan qulflaydi."], ru: ["Коллопортус", "Запирает дверь волшебством."], en: ["Colloportus", "Magically locks a door."] },
    obliviate:    { s: afSakkiz(),
                    uz: ["Obliviate", "Xotiradan voqeani o'chirib tashlaydi."], ru: ["Обливиэйт", "Стирает событие из памяти."], en: ["Obliviate", "Erases a memory."] }
  };
  // Vaziyatlar (25-36-darslar): afsun nomi aytilmaydi - o'quvchi o'zi topadi
  var AF_VAZ = {
    lumos: ["Yo'lak zim-ziyo, hech narsa ko'rinmayapti.", "В коридоре кромешная тьма, ничего не видно.", "The corridor is pitch-dark; you can't see a thing."],
    leviosa: ["Partadagi patni havoga ko'tarish kerak.", "Нужно поднять перо с парты в воздух.", "You need to make the feather on your desk fly."],
    alohomora: ["Eshik qulflangan, kalit esa yo'q.", "Дверь заперта, а ключа нет.", "The door is locked and there is no key."],
    expelliarmus: ["Raqib tayoqchasini sizga o'qtaldi — uni qurolsizlantiring.", "Противник навёл на вас палочку — обезоружьте его.", "An opponent points a wand at you — disarm them."],
    accio: ["Supurgingiz uzoqda qolib ketdi — uni chaqirish kerak.", "Ваша метла осталась далеко — её нужно призвать.", "Your broom is far away — you need to summon it."],
    protego: ["Sizga qarab afsun uchib kelyapti!", "В вас летит заклинание!", "A spell is flying straight at you!"],
    incendio: ["Kamin o'chib qolgan, xona sovuq.", "Камин погас, в комнате холодно.", "The fire has gone out and the room is cold."],
    reparo: ["Ko'zoynagingiz sinib qoldi.", "Ваши очки разбились.", "Your glasses are broken."],
    stupefy: ["Hujum qilayotgan raqibni karaxt qilish kerak.", "Нужно оглушить нападающего противника.", "You need to stun an attacker."],
    aguamenti: ["Parda yonib ketdi — tezda suv kerak!", "Загорелась штора — срочно нужна вода!", "The curtain is on fire — you need water, fast!"],
    nox: ["Tayoqchangiz yonib turibdi — sizni payqab qolishlari mumkin.", "Ваша палочка светится — вас могут заметить.", "Your wand is lit — you might be spotted."],
    patronum: ["Dementorlar yaqinlashmoqda, havo muzlab ketdi.", "Приближаются дементоры, воздух леденеет.", "Dementors are closing in and the air turns icy."],
    petrificus: ["Kimdir yo'lingizni to'smoqda — uni qimirlamaydigan qilib qo'ying.", "Кто-то преграждает вам путь — обездвижьте его.", "Someone is blocking your way — make them unable to move."],
    impedimenta: ["Sizni quvib kelayotganlarni sekinlashtirish kerak.", "Нужно замедлить тех, кто за вами гонится.", "You need to slow down those chasing you."],
    riddikulus: ["Shkafdan boggart chiqdi va eng katta qo'rquvingizga aylandi.", "Из шкафа вышел боггарт и принял облик вашего главного страха.", "A Boggart leaves the wardrobe and becomes your worst fear."],
    finite: ["Do'stingizning oyoqlari afsundan o'zi raqsga tushyapti — buni to'xtating.", "Ноги вашего друга сами пляшут от заклинания — прекратите это.", "A spell makes your friend's legs dance on their own — stop it."],
    reducto: ["Yo'lni qalin to'siq to'sib qo'ygan — uni parchalash kerak.", "Путь преграждает толстая преграда — её нужно разбить.", "A thick barrier blocks the way — it must be blasted apart."],
    diffindo: ["Sumkangiz bog'ichi tugilib qolgan — uni kesish kerak.", "Ремень сумки затянулся узлом — его нужно разрезать.", "Your bag strap is knotted tight — it needs cutting."],
    episkey: ["Do'stingizning burni qonayapti.", "У вашего друга идёт кровь из носа.", "Your friend's nose is bleeding."],
    silencio: ["Qarg'a tinmay qag'illayapti — ovozini o'chirish kerak.", "Ворон не перестаёт каркать — нужно лишить его голоса.", "A raven won't stop cawing — it must be silenced."],
    engorgio: ["Qovoq juda kichik — uni kattalashtirish kerak.", "Тыква слишком мала — её нужно увеличить.", "The pumpkin is far too small — make it bigger."],
    reducio: ["Sandiq eshikdan sig'mayapti — uni kichraytirish kerak.", "Сундук не проходит в дверь — его нужно уменьшить.", "The trunk won't fit through the door — make it smaller."],
    colloportus: ["Quvg'inchilar eshikdan kirmasligi kerak — uni qulflang.", "Преследователи не должны войти в дверь — заприте её.", "Your pursuers mustn't get through the door — lock it."],
    obliviate: ["Maggl sehrni ko'rib qoldi — u buni unutishi kerak.", "Магл увидел волшебство — он должен это забыть.", "A Muggle has seen magic — they must forget it."]
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

  /* Darslar rejasi (bot: hpdars.AFSUN_DARS = 48):
       1-24  o'rganish: bitta afsun, uch urinish - chiziq ko'rinadi -> xira -> yoddan
       25-36 vaziyat:   ikki vaziyat - afsunni o'zi topadi (4 variant), keyin yoddan chizadi
       37-48 ketma-ket: uch afsun birin-ketin, yoddan, bitta sham
     Bellashuv - o'rganish darsidek. */
  var AF_TARTIB = ["lumos", "leviosa", "alohomora", "expelliarmus", "accio", "protego",
                   "incendio", "reparo", "stupefy", "aguamenti", "nox", "patronum",
                   "petrificus", "impedimenta", "riddikulus", "finite", "reducto", "diffindo",
                   "episkey", "silencio", "engorgio", "reducio", "colloportus", "obliviate"];     // bot: hpdars.DARSLAR bilan bir xil
  function afPlan(n) {
    var T = AF_TARTIB, L = T.length, k;
    if (n <= L) { return { mode: "oquv", steps: [1, 0.3, 0].map(function (r) { return { id: T[n - 1], r: r }; }) }; }
    if (n <= L + 12) {
      k = n - L - 1;
      return { mode: "vaz", steps: [{ id: T[(k * 7 + 3) % L], r: 0, ask: true }, { id: T[(k * 7 + 15) % L], r: 0, ask: true }] };
    }
    k = (n - L - 13) % 12;
    return { mode: "zan", steps: [0, 1, 2].map(function (j) { return { id: T[(k * 5 + 1 + j * 8) % L], r: 0 }; }) };
  }
  function afFlImg(k) { return IMG_DIR + "flitvik/" + k + ".webp"; }
  function afR() { return af.steps[Math.min(af.round, af.steps.length - 1)].r; }
  // Vaqt (sham): shakl uzunligiga qarab, dars oshgani sari qisqaradi. Kechiksa urinish kuymaydi - baho pasayadi.
  function afLim(id, n) {
    var uz = 0, sh = AF[id].s;
    for (var q = 1; q < sh.length; q++) { uz += Math.hypot(sh[q][0] - sh[q - 1][0], sh[q][1] - sh[q - 1][1]); }
    return Math.round((1.6 + uz * (4.2 - 2.2 * Math.min(n - 1, 23) / 23)) * 1000);
  }

  function afOpen(bell, n) {
    var st = drData && drData.afsun, plan;
    if (bell === true) {
      var item = st && st.contest && st.contest.item, bid = AF[item] ? item : "lumos";
      plan = { mode: "bell", steps: [1, 0.3, 0].map(function (r) { return { id: bid, r: r }; }) };
    } else { plan = afPlan(n || 1); }
    af = { id: plan.steps[0].id, steps: plan.steps, mode: plan.mode, round: 0, idx: 0, drawing: false, trail: [], done: false, msg: "", ok: false, show: false,
           bell: bell === true, n: n || 1, ask: false,
           sp: [], fx: null, t0: 0, pct: 1, fails: 0, dsum: 0, dn: 0, used: false, off: false, rounds: [], raf: 0, hz: 0 };
    drShowGame("scr-afsun");
    ["zor", "yaxshi", "maslahat", "xafa"].forEach(function (k) { var i = new Image(); i.src = afFlImg(k); });
    var x = drX(), f = drFan("afsun");
    $("af-kick").textContent = f.nom[lang];
    $("af-ttl").textContent = f.ust[lang];
    $("af-today").textContent = af.bell ? x.bell : x.lvl(af.n) + (af.mode === "vaz" ? " · " + x.afVazK : af.mode === "zan" ? " · " + x.afZanK : "");
    $("af-res").classList.add("hidden");
    $("af-stage").classList.remove("hidden");
    $("af-show").textContent = x.afShow;
    if (af.mode === "zan") {     // bitta sham uchala afsunga (orasidagi tanaffuslar bilan)
      af.lim = 1800 + af.steps.reduce(function (a, q) { return a + afLim(q.id, af.n); }, 0);
    }
    afStepSet();
  }

  // Navbatdagi qadam: afsun, sarlavha, (vaziyatda) variantlar
  function afStepSet() {
    var x = drX(), q = af.steps[af.round], a = AF[q.id][lang] || AF[q.id].uz;
    af.id = q.id;
    af.ask = !!q.ask;
    if (af.mode !== "zan") { af.lim = afLim(q.id, af.n); }
    $("af-stage").classList.toggle("sorov", af.ask);
    $("af-name").textContent = af.ask ? x.afVazT : a[0];
    $("af-desc").textContent = af.ask ? (AF_VAZ[q.id] || [a[1], a[1], a[1]])[lang === "ru" ? 1 : lang === "en" ? 2 : 0] : a[1];
    if (af.ask) { afAsk(); }
    afSize();
    afPaint();
  }
  function afAsk() {
    var x = drX(), box = $("af-opts"), togri = af.id, ids = [togri], k = 0;
    while (ids.length < 4 && k < 200) {
      var c = AF_TARTIB[Math.floor(afRnd(af.n * 31 + af.round * 7 + k++) * AF_TARTIB.length)];
      if (ids.indexOf(c) < 0) { ids.push(c); }
    }
    ids.sort(function () { return Math.random() - 0.5; });
    box.innerHTML = "";
    ids.forEach(function (id) {
      var b = drEl("button", "tr-o", (AF[id][lang] || AF[id].uz)[0]);
      b.type = "button";
      b.addEventListener("click", function () {
        if (!af || !af.ask || b.classList.contains("xato")) { return; }
        if (id !== togri) {
          b.classList.add("xato");
          af.fails++;
          showToast(x.afVazNo, "err");
          try { if (tg && tg.HapticFeedback) { tg.HapticFeedback.notificationOccurred("error"); } } catch (e) {}
          return;
        }
        af.ask = false;
        $("af-stage").classList.remove("sorov");
        $("af-name").textContent = (AF[id][lang] || AF[id].uz)[0];
        afSize();
        afPaint();
      });
      box.appendChild(b);
    });
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
    var ochiq = af.show ? 0.85 : afR() * 0.85;
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
      g.shadowColor = af.ok ? "rgba(243,213,143,.95)" : af.off ? "rgba(255,130,110,.9)" : "rgba(150,200,255,.9)";
      g.shadowBlur = 14;
      g.strokeStyle = af.ok ? "#f3d58f" : af.off ? "#ffc1b6" : "#cfe4ff";
      g.lineWidth = 5;
      g.beginPath();
      for (i = 0; i < af.trail.length; i++) { if (i) { g.lineTo(af.trail[i][0], af.trail[i][1]); } else { g.moveTo(af.trail[i][0], af.trail[i][1]); } }
      g.stroke();
      g.shadowBlur = 0;
    }
    // tayoqcha izi: oltin uchqunlar
    var now = Date.now();
    af.sp = af.sp.filter(function (u) { return now - u.t < 520; });
    af.sp.forEach(function (u) {
      var k = (now - u.t) / 520;
      g.fillStyle = "rgba(243,213,143," + (1 - k) + ")";
      g.beginPath(); g.arc(u.x + u.vx * k, u.y + u.vy * k + 18 * k * k, 3.4 * (1 - k) + 0.8, 0, Math.PI * 2); g.fill();
    });
    if (af.fx) { afFx(g, af.fx.id, Math.min(1, (now - af.fx.t0) / af.fx.ms), w); }
    // sham
    var sham = $("af-sham");
    if (sham) {
      sham.classList.toggle("hidden", af.bell);
      if (!af.bell) {
        if (af.t0) { af.pct = Math.max(0, 1 - (now - af.t0) / af.lim); }
        $("af-sham-w").style.width = (af.pct * 100).toFixed(1) + "%";
        sham.classList.toggle("ochdi", af.pct <= 0);
        sham.classList.toggle("oz", af.pct > 0 && af.pct < 0.3);
      }
    }
    var ko = afR(), jami = af.steps.length;
    $("af-step").textContent = (af.mode === "vaz" || af.mode === "zan" ? x.afNth : x.afStep)(Math.min(af.round + 1, jami), jami) + (bl && af.bell ? " · " + x.sec(Date.now() - bl.t0 + bl.xato * 3000) : "") +
      (!af.bell && af.pct <= 0 && !af.done ? " · " + x.afKech : "");
    $("af-hint").textContent = af.msg || x.afR[ko >= 1 ? 0 : ko > 0 ? 1 : 2];
    $("af-hint").classList.toggle("bad", !!af.bad);
    // Professor Flitvik: holatiga qarab rasmi almashadi
    var kayf = af.bad ? "xafa" : (af.ok && af.kayf) || "maslahat", fim = $("af-fl-im");
    if (fim && af.kayfEl !== kayf) { af.kayfEl = kayf; fim.src = afFlImg(kayf); }
    $("af-show").classList.toggle("hidden", af.bell || af.ask || afR() > 0 || af.show || af.done);
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
    af.fails++;
    af.off = false;
    af.drawing = false;
    af.msg = matn;
    af.bad = true;
    afPaint();
    try { if (tg && tg.HapticFeedback) { tg.HapticFeedback.notificationOccurred("error"); } } catch (e) {}
    setTimeout(function () { if (af && !af.drawing && !af.done) { af.trail = []; af.idx = 0; afPaint(); } }, 650);
  }

  function afDown(ev) {
    if (!af || af.done || af.lock || af.ask) { return; }
    var p = afXY(ev), x = drX(), tol = af.w * 0.13;
    af.bad = false;
    af.ok = false;
    if (Math.hypot(p[0] - af.pts[0][0], p[1] - af.pts[0][1]) > tol * 1.5) { af.msg = x.afStart; af.bad = true; af.trail = []; afPaint(); return; }
    af.drawing = true;
    af.idx = 0;
    af.msg = "";
    af.trail = [p];
    af.dsum = 0; af.dn = 0; af.off = false;
    if (!af.t0 && !af.bell) { af.t0 = Date.now(); }
    afLoop();
    try { ev.preventDefault(); } catch (e) {}
    afPaint();
  }

  function afMove(ev) {
    if (!af || !af.drawing) { return; }
    var p = afXY(ev), tol = af.w * (0.13 + (afR() === 0 ? 0.02 : 0));
    af.trail.push(p);
    var d = afDist(p), now = Date.now();
    af.dsum += d; af.dn++;
    if (af.sp.length < 120) {
      af.sp.push({ x: p[0], y: p[1], vx: (Math.random() - 0.5) * 26, vy: (Math.random() - 0.5) * 26, t: now });
      af.sp.push({ x: p[0], y: p[1], vx: (Math.random() - 0.5) * 40, vy: (Math.random() - 0.7) * 30, t: now });
    }
    if (d > tol * 1.9) { afFail(drX().afOff); return; }
    af.off = d > tol * 1.15;
    if (af.off && now - af.hz > 160) { af.hz = now; try { if (tg && tg.HapticFeedback) { tg.HapticFeedback.impactOccurred("soft"); } } catch (e) {} }
    afLoop();
    while (af.idx < af.pts.length - 1 && Math.hypot(p[0] - af.pts[af.idx + 1][0], p[1] - af.pts[af.idx + 1][1]) < tol) { af.idx++; }
    afPaint();
  }

  function afUp() {
    if (!af || !af.drawing) { return; }
    af.drawing = false;
    var x = drX();
    if (af.idx < af.pts.length - 2) { afFail(x.afShort); return; }
    // urinish o'tdi
    var otgan = af.t0 ? Date.now() - af.t0 : 0;
    af.rounds.push({ r: (af.dsum / (af.dn || 1)) / (af.w * 0.13), fails: af.fails, used: af.used,
                     late: !af.bell && otgan > af.lim ? (otgan > af.lim * 2 ? 2 : 1) : 0 });
    var tugadi = af.round >= af.steps.length - 1, oxir = af.rounds[af.rounds.length - 1];
    if (af.mode !== "zan" || tugadi) { af.t0 = 0; }
    af.off = false;
    af.ok = true;
    // Professor Flitvik izohi (bellashuvda - eski qisqa matn)
    var fl = oxir.late ? x.afFl.c : (oxir.r < 0.4 && !oxir.fails && !oxir.used ? x.afFl.a : x.afFl.b);
    af.msg = af.bell ? x.afOk[Math.min(af.round, 2)] : fl[(af.n + af.round) % fl.length];
    af.kayf = fl === x.afFl.a ? "zor" : fl === x.afFl.b ? "yaxshi" : "maslahat";
    af.bad = false;
    af.lock = true;
    afPaint();
    try { if (tg && tg.HapticFeedback) { tg.HapticFeedback.impactOccurred("light"); } } catch (e) {}
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
        af.fails = 0; af.used = false;
        if (af.mode !== "zan") { af.pct = 1; }
        afStepSet();
        return;
      }
      af.done = true;
      if (af.bell) {
        $("af-stage").classList.add("hidden");
        blFinish($("af-res"));
        return;
      }
      afEnd();
    }, 900);
  }

  // Baho (asardagi imtihon baholari): aniqlik + xatolar + vaqt. 5 A'lo, 4 Kutilganidan yuqori, 3 Qoniqarli (o'tadi), 2 Yomon, 1 Troll
  function afScore() {
    var sum = 0, acc = 0, vaqt = 0;
    af.rounds.forEach(function (q) {
      var a = 100 * Math.max(0, Math.min(1, 1 - (q.r - 0.25) / 1.1));
      acc += a;
      if (!q.late) { vaqt++; }
      sum += Math.max(0, a - Math.min(q.fails, 3) * 12 - (q.used ? 20 : 0) - q.late * 20);
    });
    var n = af.rounds.length || 1, s = sum / n;
    return { acc: Math.round(acc / n), vaqt: vaqt, n: n, baho: s >= 85 ? 5 : s >= 70 ? 4 : s >= 50 ? 3 : s >= 30 ? 2 : 1 };
  }
  // Eng yaxshi baho shu qurilmada (fan bo'yicha): darslar to'rida halqa bilan ko'rinadi
  var DR_BAHO_K = { afsun: "hp_af_baho", iksir: "hp_ik_baho", himoya: "hp_hm_baho" };
  function drBahoGet(fan, n) { try { return (JSON.parse(localStorage.getItem(DR_BAHO_K[fan]) || "{}") || {})[n] || 0; } catch (e) { return 0; } }
  function drBahoSave(fan, n, b) {
    try {
      var m = JSON.parse(localStorage.getItem(DR_BAHO_K[fan]) || "{}") || {};
      if (!(m[n] >= b)) { m[n] = b; localStorage.setItem(DR_BAHO_K[fan], JSON.stringify(m)); }
    } catch (e) {}
  }
  function afBahoSave(n, b) { drBahoSave("afsun", n, b); }
  function afBahoEl(sc) {
    var x = drX(), el = drEl("div", "af-baho b" + sc.baho), pp = drEl("span", "af-baho-p");
    for (var i = 1; i <= 5; i++) { pp.appendChild(drEl("i", i <= sc.baho ? "on" : "")); }
    el.appendChild(drEl("small", "af-baho-k", x.afBahoT));
    el.appendChild(drEl("b", "af-baho-n", x.afBaho[sc.baho - 1]));
    el.appendChild(pp);
    el.appendChild(drEl("span", "af-baho-s", sc.izoh || (x.afAcc(sc.acc) + " · " + x.afVaqt(sc.vaqt, sc.n))));
    return el;
  }

  // Dars oxiri: afsun natijasi (animatsiya) -> baho. «Qoniqarli»dan past bo'lsa dars o'tmaydi.
  function afEnd() {
    var x = drX(), me = af, sc = afScore(), daraja = af.n, otdi = sc.baho >= 3;
    af.fx = { id: otdi ? af.id : "puf", t0: Date.now(), ms: otdi ? 1700 : 800 };
    af.msg = otdi ? (AF[af.id][lang] || AF[af.id].uz)[0] + "!" : x.afPuf;
    af.bad = !otdi;
    af.ok = otdi;
    af.kayf = "zor";
    if (!otdi) { af.trail = []; }
    afLoop();
    setTimeout(function () {
      if (af !== me) { return; }
      af.fx = null;
      var show = function (yangi) {
        if (af !== me) { return; }
        var box = $("af-res");
        $("af-stage").classList.add("hidden");
        if (otdi) { drResult(box, "«" + x.afFlB[sc.baho - 1] + "»", "afsun", daraja, yangi); }
        else {
          box.innerHTML = "";
          box.appendChild(drEl("p", "dr-res-t", "«" + x.afFlB[sc.baho - 1] + "»"));
          box.appendChild(drEl("p", "dr-res-s", x.afLow));
          var r = drEl("button", "dr-btn", x.retry);
          r.type = "button";
          r.addEventListener("click", function () { afOpen(false, daraja); });
          box.appendChild(r);
          var b = drEl("button", "dr-btn ikkinchi", x.toList);
          b.type = "button";
          b.addEventListener("click", function () { af = null; fanOpen("afsun"); });
          box.appendChild(b);
          box.classList.remove("hidden");
        }
        var ft = box.querySelector(".dr-res-t");
        if (ft) {
          var fi = document.createElement("img");
          fi.className = "af-fl-big";
          fi.alt = "";
          fi.src = afFlImg(sc.baho >= 5 ? "zor" : sc.baho === 4 ? "yaxshi" : sc.baho === 3 ? "maslahat" : "xafa");
          box.insertBefore(fi, ft);
          box.insertBefore(drEl("small", "af-baho-k", x.afFlN), ft);
        }
        box.insertBefore(afBahoEl(sc), box.firstChild);
      };
      if (otdi) { afBahoSave(daraja, sc.baho); drDone("afsun", daraja, show); } else { show(null); }
    }, af.fx.ms);
  }

  // Chizish paytida kadrlar: sham, uchqunlar va afsun natijasi uchun
  function afLoop() {
    if (!af || af.raf) { return; }
    var step = function () {
      if (!af) { return; }
      af.raf = 0;
      if ($("scr-afsun").classList.contains("hidden")) { return; }
      afPaint();
      if (af.sp.length || af.fx || (af.t0 && !af.done)) { af.raf = requestAnimationFrame(step); }
    };
    af.raf = requestAnimationFrame(step);
  }

  function afRnd(i) { var v = Math.sin(i * 12.9898) * 43758.5453; return v - Math.floor(v); }
  function afGlow(g, x, y, rad, rgb, al) {
    if (!(rad > 0) || !(al > 0)) { return; }
    var gr = g.createRadialGradient(x, y, 0, x, y, rad);
    gr.addColorStop(0, "rgba(" + rgb + "," + Math.min(1, al) + ")");
    gr.addColorStop(1, "rgba(" + rgb + ",0)");
    g.fillStyle = gr;
    g.beginPath(); g.arc(x, y, rad, 0, Math.PI * 2); g.fill();
  }
  // Afsun natijasi: t 0..1. Har afsunning o'z ko'rinishi; "puf" - afsun chiqmadi.
  function afFx(g, id, t, w) {
    var e = 1 - Math.pow(1 - t, 3), fade = t < 0.7 ? 1 : Math.max(0, (1 - t) / 0.3), P2 = Math.PI * 2, i, a, ph, px, py;
    var path = function (k) {
      g.beginPath();
      af.pts.forEach(function (p, j) {
        var qx = 0.5 * w + (p[0] - 0.5 * w) * k, qy = 0.5 * w + (p[1] - 0.5 * w) * k;
        if (j) { g.lineTo(qx, qy); } else { g.moveTo(qx, qy); }
      });
    };
    g.save();
    g.lineCap = "round"; g.lineJoin = "round";
    if (id === "lumos") {
      afGlow(g, 0.5 * w, 0.18 * w, (0.15 + 0.6 * e) * w, "255,244,200", 0.9 * fade);
      afGlow(g, 0.5 * w, 0.18 * w, 0.09 * w, "255,255,255", fade);
    } else if (id === "nox") {
      g.fillStyle = "rgba(0,0,0," + 0.85 * e * fade + ")"; g.fillRect(0, 0, w, w);
      afGlow(g, 0.5 * w, 0.82 * w, 0.32 * (1 - e) * w, "255,244,200", 0.9);
    } else if (id === "leviosa") {
      px = (0.5 + 0.06 * Math.sin(t * 9)) * w; py = (0.82 - 0.5 * e) * w;
      afGlow(g, px, py, 0.22 * w, "200,225,255", 0.35 * fade);
      g.translate(px, py); g.rotate(-0.6 + 0.25 * Math.sin(t * 7)); g.globalAlpha = fade;
      g.fillStyle = "#f4f7ff"; g.beginPath(); g.ellipse(0, 0, 0.035 * w, 0.13 * w, 0, 0, P2); g.fill();
      g.strokeStyle = "#9fb3d6"; g.lineWidth = 2; g.beginPath(); g.moveTo(0, -0.13 * w); g.lineTo(0, 0.19 * w); g.stroke();
    } else if (id === "alohomora" || id === "colloportus") {
      px = 0.5 * w; py = 0.52 * w;
      afGlow(g, px, py, 0.36 * w, id === "alohomora" ? "243,213,143" : "150,200,255", 0.4 * e * fade);
      g.globalAlpha = fade;
      g.strokeStyle = "#e9eef8"; g.lineWidth = 0.035 * w;
      g.save(); g.translate(px + 0.09 * w, py - 0.06 * w); g.rotate(0.9 * (id === "alohomora" ? e : 1 - Math.min(1, t * 2.2)));
      g.beginPath(); g.moveTo(0, 0); g.lineTo(0, -0.07 * w); g.arc(-0.09 * w, -0.07 * w, 0.09 * w, 0, Math.PI, true); g.lineTo(-0.18 * w, -0.01 * w); g.stroke();
      g.restore();
      g.fillStyle = "#f3d58f"; g.fillRect(px - 0.15 * w, py - 0.06 * w, 0.3 * w, 0.24 * w);
      g.fillStyle = "#3a2c12"; g.beginPath(); g.arc(px, py + 0.04 * w, 0.028 * w, 0, P2); g.fill();
      g.fillRect(px - 0.011 * w, py + 0.04 * w, 0.022 * w, 0.07 * w);
    } else if (id === "expelliarmus") {
      g.fillStyle = "rgba(255,70,60," + 0.35 * (1 - t) + ")"; g.fillRect(0, 0, w, w);
      afGlow(g, 0.3 * w, 0.6 * w, 0.5 * e * w, "255,90,70", 0.6 * (1 - t));
      g.translate((0.5 + 0.36 * e) * w, (0.55 - 0.42 * e + 0.25 * t * t) * w); g.rotate(t * 14); g.globalAlpha = fade;
      g.strokeStyle = "#c79a5b"; g.lineWidth = 0.022 * w; g.beginPath(); g.moveTo(-0.12 * w, 0); g.lineTo(0.12 * w, 0); g.stroke();
    } else if (id === "accio") {
      var sc = 0.15 + 0.85 * e;
      g.strokeStyle = "rgba(200,225,255," + 0.55 * (1 - e) + ")"; g.lineWidth = 2;
      for (i = 0; i < 10; i++) {
        a = i * P2 / 10;
        g.beginPath(); g.moveTo(0.5 * w + Math.cos(a) * 0.46 * w, 0.5 * w + Math.sin(a) * 0.46 * w);
        g.lineTo(0.5 * w + Math.cos(a) * (0.46 - 0.2 * e) * w, 0.5 * w + Math.sin(a) * (0.46 - 0.2 * e) * w); g.stroke();
      }
      afGlow(g, 0.5 * w, (0.2 + 0.3 * e) * w, 0.34 * w * sc, "200,225,255", 0.45 * fade);
      g.translate(0.5 * w, (0.2 + 0.3 * e) * w); g.scale(sc, sc); g.rotate((1 - e) * 1.2); g.globalAlpha = fade;
      g.fillStyle = "#7a3b2e"; g.fillRect(-0.13 * w, -0.17 * w, 0.26 * w, 0.34 * w);
      g.fillStyle = "#f3d58f"; g.fillRect(-0.13 * w, -0.17 * w, 0.035 * w, 0.34 * w);
      g.strokeStyle = "#f3d58f"; g.lineWidth = 0.008 * w; g.strokeRect(-0.06 * w, -0.11 * w, 0.15 * w, 0.1 * w);
    } else if (id === "protego") {
      path(1); g.closePath(); g.fillStyle = "rgba(120,180,255," + 0.32 * e * fade + ")"; g.fill();
      g.shadowColor = "rgba(150,200,255,.9)"; g.shadowBlur = 22;
      g.strokeStyle = "rgba(210,232,255," + fade + ")"; g.lineWidth = 4; g.stroke(); g.shadowBlur = 0;
      for (i = 0; i < 3; i++) {
        ph = (t * 1.6 + i / 3) % 1;
        path(1 + ph * 0.5); g.closePath(); g.strokeStyle = "rgba(170,210,255," + 0.5 * (1 - ph) * fade + ")"; g.lineWidth = 2; g.stroke();
      }
    } else if (id === "incendio") {
      afGlow(g, 0.5 * w, 0.72 * w, 0.48 * w, "255,140,40", 0.45 * fade * e);
      for (i = 0; i < 30; i++) {
        ph = (t * 2.2 + afRnd(i)) % 1;
        afGlow(g, (0.5 + (afRnd(i + 40) - 0.5) * 0.42 * (1 - ph * 0.7)) * w, (0.82 - ph * 0.55) * w,
               (0.02 + 0.07 * (1 - ph)) * w, ph < 0.4 ? "255,225,130" : "255,120,40", 0.85 * (1 - ph) * fade);
      }
    } else if (id === "reparo") {
      for (i = 0; i < 6; i++) {
        a = i * Math.PI / 3;
        var uzoq = (1 - e) * 0.3 * w * (0.6 + afRnd(i));
        g.save(); g.translate(0.5 * w + Math.cos(a + 0.52) * uzoq, 0.52 * w + Math.sin(a + 0.52) * uzoq);
        g.rotate((1 - e) * (afRnd(i + 9) - 0.5) * 3); g.globalAlpha = fade;
        g.fillStyle = i % 2 ? "#e9eef8" : "#cfd8ea";
        g.beginPath(); g.moveTo(0, 0); g.arc(0, 0, 0.22 * w, a, a + Math.PI / 3); g.closePath(); g.fill();
        g.restore();
      }
      if (t > 0.6) {
        g.shadowColor = "rgba(243,213,143,.9)"; g.shadowBlur = 18;
        g.strokeStyle = "rgba(243,213,143," + fade * Math.min(1, (t - 0.6) / 0.15) + ")"; g.lineWidth = 3;
        g.beginPath(); g.arc(0.5 * w, 0.52 * w, 0.22 * w, 0, P2); g.stroke();
      }
    } else if (id === "stupefy") {
      g.fillStyle = "rgba(255,40,40," + 0.4 * (1 - t) + ")"; g.fillRect(0, 0, w, w);
      var en = af.pts[af.pts.length - 1];
      afGlow(g, en[0], en[1], 0.45 * e * w, "255,70,60", 0.7 * fade);
      g.shadowColor = "rgba(255,60,60,.95)"; g.shadowBlur = 26;
      g.strokeStyle = "rgba(255,180,170," + fade + ")"; g.lineWidth = 7;
      path(1); g.stroke();
    } else if (id === "aguamenti") {
      afGlow(g, 0.84 * w, 0.72 * w, 0.34 * e * w, "90,160,255", 0.4 * fade);
      for (i = 0; i < 36; i++) {
        ph = (t * 1.8 + afRnd(i)) % 1;
        afGlow(g, (0.12 + 0.8 * ph) * w, (0.5 - 0.2 * Math.sin(ph * Math.PI * 3) + ph * ph * 0.34 * afRnd(i + 5)) * w,
               (0.025 + 0.03 * afRnd(i + 3)) * w, "130,195,255", 0.85 * fade);
      }
    } else if (id === "patronum") {
      afGlow(g, 0.5 * w, 0.5 * w, (0.2 + 0.6 * e) * w, "215,235,255", 0.85 * fade);
      for (i = 0; i < 3; i++) {
        ph = (t * 1.5 + i / 3) % 1;
        g.strokeStyle = "rgba(230,242,255," + 0.6 * (1 - ph) * fade + ")"; g.lineWidth = 3;
        g.beginPath(); g.arc(0.5 * w, 0.5 * w, ph * 0.55 * w + 1, 0, P2); g.stroke();
      }
      afGlow(g, 0.5 * w, 0.5 * w, 0.11 * w, "255,255,255", fade);
    } else if (id === "petrificus") {
      afGlow(g, 0.5 * w, 0.5 * w, 0.5 * w, "200,225,255", 0.45 * (1 - t));
      g.translate(0.5 * w, 0.8 * w); g.rotate(Math.max(0, (t - 0.35) / 0.65) * Math.max(0, (t - 0.35) / 0.65) * Math.PI / 2); g.globalAlpha = fade;
      g.fillStyle = "#cfe0f5";
      g.beginPath(); g.arc(0, -0.5 * w, 0.06 * w, 0, P2); g.fill();
      g.fillRect(-0.05 * w, -0.43 * w, 0.1 * w, 0.43 * w);
    } else if (id === "impedimenta") {
      for (i = 0; i < 4; i++) {
        ph = 1 - ((t * 1.1 + i / 4) % 1);
        g.strokeStyle = "rgba(120,225,215," + 0.7 * (1 - ph) * fade + ")"; g.lineWidth = 3;
        g.beginPath(); g.arc(0.5 * w, 0.5 * w, ph * 0.46 * w + 2, 0, P2); g.stroke();
      }
      afGlow(g, 0.5 * w, 0.5 * w, 0.16 * w, "120,225,215", 0.7 * e * fade);
    } else if (id === "riddikulus") {
      var rang = ["255,120,150", "255,210,90", "120,220,160", "130,190,255", "210,150,255"];
      for (i = 0; i < 40; i++) {
        a = afRnd(i) * P2; ph = 0.12 + 0.36 * afRnd(i + 20);
        afGlow(g, (0.5 + Math.cos(a) * ph * e) * w, (0.5 + Math.sin(a) * ph * e + 0.18 * t * t) * w, (0.018 + 0.02 * afRnd(i + 60)) * w, rang[i % 5], fade);
      }
    } else if (id === "finite") {
      afGlow(g, 0.5 * w, 0.5 * w, 0.42 * (1 - e) * w + 1, "255,170,160", 0.8);
      g.strokeStyle = "rgba(240,244,255," + fade + ")"; g.lineWidth = 3; g.shadowColor = "rgba(240,244,255,.9)"; g.shadowBlur = 16;
      g.beginPath(); g.moveTo(0.2 * w, 0.2 * w); g.lineTo((0.2 + 0.6 * Math.min(1, t * 2.5)) * w, (0.2 + 0.6 * Math.min(1, t * 2.5)) * w); g.stroke();
    } else if (id === "reducto") {
      afGlow(g, 0.5 * w, 0.5 * w, 0.5 * e * w, "130,180,255", 0.6 * (1 - t));
      for (i = 0; i < 9; i++) {
        px = (i % 3 - 1) * 0.11; py = (Math.floor(i / 3) - 1) * 0.11;
        g.save(); g.translate((0.5 + px * (1 + e * 3.2)) * w, (0.5 + py * (1 + e * 3.2) + 0.2 * t * t) * w);
        g.rotate(e * (afRnd(i) - 0.5) * 5); g.globalAlpha = fade;
        g.fillStyle = i % 2 ? "#8b93a6" : "#6f778a"; g.fillRect(-0.05 * w, -0.05 * w, 0.1 * w, 0.1 * w);
        g.restore();
      }
    } else if (id === "diffindo") {
      g.globalAlpha = fade; g.strokeStyle = "#c9a36a"; g.lineWidth = 0.03 * w;
      g.save(); g.translate(0.5 * w, 0.5 * w); g.rotate(-0.5 * e); g.beginPath(); g.moveTo(-0.01 * w, 0); g.lineTo(-0.36 * w, 0); g.stroke(); g.restore();
      g.save(); g.translate(0.5 * w, 0.5 * w); g.rotate(0.5 * e); g.beginPath(); g.moveTo(0.01 * w, 0); g.lineTo(0.36 * w, 0); g.stroke(); g.restore();
      g.globalAlpha = 1; afGlow(g, 0.5 * w, 0.5 * w, 0.2 * w, "255,255,255", 0.9 * (1 - t));
    } else if (id === "episkey") {
      afGlow(g, 0.5 * w, 0.5 * w, (0.25 + 0.2 * Math.sin(t * 9) * (1 - t) + 0.15 * e) * w, "150,230,170", 0.6 * fade);
      g.globalAlpha = fade; g.fillStyle = "#eafff0";
      g.fillRect(0.46 * w, 0.36 * w, 0.08 * w, 0.28 * w); g.fillRect(0.36 * w, 0.46 * w, 0.28 * w, 0.08 * w);
    } else if (id === "silencio") {
      for (i = 0; i < 4; i++) {
        ph = (0.12 + i * 0.09) * (1 - e);
        g.strokeStyle = "rgba(200,215,240," + (1 - e) + ")"; g.lineWidth = 4;
        g.beginPath(); g.arc(0.3 * w, 0.5 * w, ph * w + 1, -0.7, 0.7); g.stroke();
      }
      afGlow(g, 0.3 * w, 0.5 * w, 0.07 * w, "200,215,240", fade);
    } else if (id === "engorgio" || id === "reducio") {
      var ol = id === "engorgio" ? 0.3 + 0.7 * e : 1 - 0.72 * e;
      afGlow(g, 0.5 * w, 0.54 * w, 0.42 * w * ol, id === "engorgio" ? "255,160,70" : "200,160,110", 0.4 * fade);
      g.translate(0.5 * w, 0.54 * w); g.scale(ol, ol); g.globalAlpha = fade;
      if (id === "engorgio") {
        g.fillStyle = "#e8843c"; g.beginPath(); g.ellipse(0, 0, 0.26 * w, 0.21 * w, 0, 0, P2); g.fill();
        g.strokeStyle = "#b85f22"; g.lineWidth = 0.012 * w;
        g.beginPath(); g.ellipse(0, 0, 0.11 * w, 0.21 * w, 0, 0, P2); g.stroke();
        g.fillStyle = "#5f8a4a"; g.fillRect(-0.02 * w, -0.27 * w, 0.04 * w, 0.08 * w);
      } else {
        g.fillStyle = "#7a5230"; g.fillRect(-0.26 * w, -0.14 * w, 0.52 * w, 0.32 * w);
        g.fillStyle = "#5e3d22"; g.fillRect(-0.26 * w, -0.2 * w, 0.52 * w, 0.1 * w);
        g.fillStyle = "#f3d58f"; g.fillRect(-0.035 * w, -0.13 * w, 0.07 * w, 0.08 * w);
      }
    } else if (id === "obliviate") {
      for (i = 0; i < 34; i++) {
        a = afRnd(i) * P2 + t * 3; ph = (0.05 + 0.4 * afRnd(i + 11)) * (0.4 + 0.9 * e);
        afGlow(g, (0.5 + Math.cos(a) * ph) * w, (0.5 + Math.sin(a) * ph * 0.7) * w, (0.03 + 0.04 * afRnd(i + 5)) * w, "225,235,250", 0.55 * (1 - t));
      }
      afGlow(g, 0.5 * w, 0.5 * w, 0.5 * e * w, "225,235,250", 0.4 * fade);
    } else if (id === "puf") {
      for (i = 0; i < 14; i++) {
        a = afRnd(i) * P2;
        afGlow(g, (0.5 + Math.cos(a) * 0.25 * e) * w, (0.5 + Math.sin(a) * 0.2 * e + 0.3 * t * t) * w, 0.028 * w, "170,175,190", 0.7 * (1 - t));
      }
    } else {
      afGlow(g, 0.5 * w, 0.5 * w, (0.2 + 0.5 * e) * w, "243,213,143", 0.7 * fade);
    }
    g.restore();
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

  // Masalliq rasmi (img/masalliq/<kod>.webp) + nomi
  function ikMas(el, m) {
    var im = document.createElement("img");
    im.className = "ik-mi";
    im.alt = "";
    im.src = IMG_DIR + "masalliq/" + m + ".webp";
    im.onerror = function () { im.style.display = "none"; };
    el.appendChild(im);
    el.appendChild(drEl("span", "", ikNom(m)));
    return el;
  }
  function ikNom(m) { var i = lang === "ru" ? 1 : lang === "en" ? 2 : 0; return (IK_M[m] || [m, m, m])[i]; }

  /* Darslar rejasi (bot: hpdars.IKSIR_DARS = 36), har bosqichda o'sha 12 damlama:
       1-12  retsept xohlagancha ochiq turadi; 8 masalliq; 3 xatoda damlama buziladi
       13-24 12 masalliq; 2 xato
       25-36 IMTIHON: retsept bir necha soniya ko'rinib yopiladi; 14 masalliq; 2 xato
     Hamma bosqichda SHAM (vaqt) va BAHO: xato, buzilish va kechikish bahoni pasaytiradi; «Qoniqarli»dan past - dars o'tmaydi. */
  var IK_TARTIB = ["boils", "forget", "shrink", "antidote", "wiggenweld", "uyqu",
                   "skelegro", "living", "wit", "peace", "polyjuice", "felix"];          // bot: hpdars.DARSLAR bilan bir xil
  var IK_BOSQ = [{ chips: 8, xato: 3, sek: 5 }, { chips: 12, xato: 2, sek: 4 }, { chips: 14, xato: 2, sek: 3, yop: true }];
  function ikSnImg(k) { return IMG_DIR + "sneyp/" + k + ".webp"; }
  function ikOpen(bell, n) {
    var st = drData && drData.iksir;
    var item = bell === true ? (st && st.contest && st.contest.item) : IK_TARTIB[((n || 1) - 1) % IK_TARTIB.length];
    var id = IK[item] ? item : "boils";
    var bq = bell === true ? { chips: 10, xato: 99 } : IK_BOSQ[Math.min(Math.floor(((n || 1) - 1) / IK_TARTIB.length), IK_BOSQ.length - 1)];
    ikStop();
    ik = { id: id, phase: "rec", step: 0, err: 0, chips: [], bq: bq, bell: bell === true, n: n || 1,
           errJami: 0, boom: 0, t0: 0, pct: 1, lim: 0, kayf: "maslahat", yopT: 0, tm: 0 };
    ik.lim = bq.sek ? (3 + IK[id].r.length * bq.sek) * 1000 : 0;
    drShowGame("scr-iksir");
    ["zor", "yaxshi", "maslahat", "xafa"].forEach(function (k) { var i = new Image(); i.src = ikSnImg(k); });
    Object.keys(IK_M).forEach(function (m) { var i = new Image(); i.src = IMG_DIR + "masalliq/" + m + ".webp"; });      // tugmalar bo'sh chiqmasin
    var x = drX(), f = drFan("iksir");
    $("ik-kick").textContent = f.nom[lang];
    $("ik-ttl").textContent = f.ust[lang];
    $("ik-today").textContent = ik.bell ? x.bell : x.lvl(ik.n) + (bq.yop ? " · " + x.ikImt : "");
    $("ik-timer").classList.toggle("hidden", !ik.bell);
    $("ik-name").textContent = IK[id][lang] || IK[id].uz;
    ikRender();
    ikYopBosh();
  }
  function ikStop() { if (ik) { clearInterval(ik.tm); clearInterval(ik.yopTm); ik.tm = 0; ik.yopTm = 0; } }
  // Imtihon: retsept sanoq bilan o'zi yopiladi
  function ikYopBosh() {
    if (!ik || !ik.bq.yop || ik.phase !== "rec") { return; }
    var me = ik, qoldi = 4 + IK[ik.id].r.length;
    clearInterval(ik.yopTm);
    var chiz = function () { if (ik === me && ik.phase === "rec") { $("ik-go").textContent = drX().ikGo + " · " + qoldi; $("ik-rec-s").textContent = ik.msg || drX().ikYop(qoldi); } };
    chiz();
    ik.yopTm = setInterval(function () {
      if (ik !== me || ik.phase !== "rec") { clearInterval(me.yopTm); return; }
      qoldi--;
      if (qoldi <= 0) { clearInterval(me.yopTm); ik.msg = ""; ikStart(); return; }
      chiz();
    }, 1000);
  }
  // Sham: pishirish boshlangandan yonadi
  function ikSham() {
    var sh = $("ik-sham");
    if (!sh || !ik) { return; }
    sh.classList.toggle("hidden", ik.bell || ik.phase !== "cook" || !ik.lim);
    if (ik.t0) { ik.pct = Math.max(0, 1 - (Date.now() - ik.t0) / ik.lim); }
    $("ik-sham-w").style.width = (ik.pct * 100).toFixed(1) + "%";
    sh.classList.toggle("ochdi", ik.pct <= 0);
    sh.classList.toggle("oz", ik.pct > 0 && ik.pct < 0.3);
  }
  function ikKayf(k) {
    if (!ik) { return; }
    ik.kayf = k;
    ["ik-sn-im", "ik-sn-im2"].forEach(function (id) { var el = $(id); if (el && el.getAttribute("data-k") !== k) { el.setAttribute("data-k", k); el.src = ikSnImg(k); } });
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
    clearInterval(ik.yopTm);
    if (ik.lim) {
      var me = ik;
      ik.t0 = Date.now(); ik.pct = 1;
      clearInterval(ik.tm);
      ik.tm = setInterval(function () { if (ik !== me || ik.phase !== "cook") { clearInterval(me.tm); return; } ikSham(); }, 100);
    }
    ikKayf("maslahat");
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
    $("ik-pot").style.setProperty("--ik-p", (0.12 + 0.88 * ik.step / rec.length).toFixed(2));
    $("ik-pot").classList.toggle("pish", ik.phase === "cook");
    var sl = $("ik-slots");
    if (sl) {
      sl.style.setProperty("--ik-c", p.c);
      sl.innerHTML = "";
      rec.forEach(function (m, i) { sl.appendChild(drEl("i", ik.phase !== "rec" && i < ik.step ? "on" : "")); });
    }
    $("ik-pot").classList.toggle("tayyor", ik.phase === "done");
    ikSham();
    ikKayf(ik.kayf);
    if (ik.phase === "rec") {
      $("ik-rec-t").textContent = x.ikRec;
      $("ik-rec-s").textContent = ik.msg || x.ikRecS;
      $("ik-rec-s").classList.toggle("bad", !!ik.msg);
      var ol = $("ik-rec-l");
      ol.innerHTML = "";
      rec.forEach(function (m) { ol.appendChild(ikMas(drEl("li", ""), m)); });
      $("ik-go").textContent = x.ikGo;
      return;
    }
    if (ik.phase === "cook") {
      $("ik-cook-t").textContent = ik.msg || ik.okMsg || x.ikCook;
      $("ik-cook-t").classList.toggle("bad", !!ik.msg);
      $("ik-prog").textContent = x.ikStep(ik.step, rec.length) + " · " + (ik.bell ? x.ikErr(ik.err, "∞").replace(" / ∞", "") : x.ikErr(ik.err, ik.bq.xato));
      var box = $("ik-chips");
      box.innerHTML = "";
      ik.chips.forEach(function (m) {
        var solingan = rec.indexOf(m) >= 0 && rec.indexOf(m) < ik.step;
        var b = ikMas(drEl("button", "ik-chip" + (solingan ? " in" : "")), m);
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
      ik.kayf = "yaxshi";
      if (!ik.bell && ik.step < rec.length) { ik.okMsg = x.ikTogri[ik.step % x.ikTogri.length]; }
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
          ikEnd();
        }, 700);
        return;
      }
      ikRender();
      return;
    }
    // xato masalliq
    ik.err++;
    ik.errJami++;
    ik.okMsg = "";
    ikKayf("xafa");
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
        ik.boom++;
        ik.msg = x.ikBoom;
        ik.kayf = "xafa";
        ikRender();
        ikYopBosh();
      }, 700);
      return;
    }
    ik.msg = x.ikBad[Math.min(ik.err - 1, 1)];
    $("ik-cook-t").textContent = ik.msg;
    $("ik-cook-t").classList.add("bad");
    $("ik-prog").textContent = x.ikStep(ik.step, rec.length) + " · " + (ik.bell ? x.ikErr(ik.err, "∞").replace(" / ∞", "") : x.ikErr(ik.err, ik.bq.xato));
  }

  // Dars oxiri: baho (xato -12, buzilish -15, sham o'chsa -20, ikki baravar kechiksa -40) va Professor Sneyp xulosasi
  function ikEnd() {
    var x = drX(), me = ik, daraja = ik.n, otgan = ik.t0 ? Date.now() - ik.t0 : 0;
    var kech = ik.lim && otgan > ik.lim ? (otgan > ik.lim * 2 ? 2 : 1) : 0;
    var s = Math.max(0, 100 - ik.errJami * 12 - ik.boom * 15 - kech * 20);
    var sc = { baho: s >= 85 ? 5 : s >= 70 ? 4 : s >= 50 ? 3 : s >= 30 ? 2 : 1, izoh: x.ikXato(ik.errJami) + " · " + x.ikVaqt[kech ? 1 : 0] };
    var otdi = sc.baho >= 3, box = $("ik-res");
    clearInterval(ik.tm);
    $("ik-pot").classList.toggle("tayyor", otdi);
    var show = function (yangi) {
      if (ik !== me) { return; }
      if (otdi) { drResult(box, "«" + x.ikSnB[sc.baho - 1] + "»", "iksir", daraja, yangi); }
      else {
        box.innerHTML = "";
        box.appendChild(drEl("p", "dr-res-t", "«" + x.ikSnB[sc.baho - 1] + "»"));
        box.appendChild(drEl("p", "dr-res-s", x.afLow));
        var r = drEl("button", "dr-btn", x.retry);
        r.type = "button";
        r.addEventListener("click", function () { ikOpen(false, daraja); });
        box.appendChild(r);
        var b = drEl("button", "dr-btn ikkinchi", x.toList);
        b.type = "button";
        b.addEventListener("click", function () { ik = null; fanOpen("iksir"); });
        box.appendChild(b);
        box.classList.remove("hidden");
      }
      var ft = box.querySelector(".dr-res-t"), fi = document.createElement("img");
      fi.className = "af-fl-big";
      fi.alt = "";
      fi.src = ikSnImg(sc.baho >= 5 ? "zor" : sc.baho === 4 ? "yaxshi" : sc.baho === 3 ? "maslahat" : "xafa");
      box.insertBefore(fi, ft);
      box.insertBefore(drEl("small", "af-baho-k", x.ikSnN), ft);
      box.insertBefore(afBahoEl(sc), box.firstChild);
    };
    if (otdi) { drBahoSave("iksir", daraja, sc.baho); drDone("iksir", daraja, show); } else { show(null); }
  }

  /* ================= QORA SAN'ATLARDAN HIMOYA: xavf yetib kelguncha to'g'ri afsunni tanlash =================
     Darslar rejasi (bot: hpdars.HIMOYA_DARS = 36): 1-darsda uch xavf, 2-10-darslarda bittadan yangi xavf qo'shiladi (jami 12);
     dars oshgani sari xavflar ko'payadi (5 -> 10) va tezlashadi (7 s -> 2,4 s); 25-darsdan 6 variant. Uch «jon» (qalqon):
     xato tanlov yoki kechikish bittasini oladi, tugasa dars o'tmaydi. Bellashuv: 8 xavf, jon yo'q, xato va kechikish +3 s. */
  var HM = {
    dementor: { s: "patronum", x: [], uz: ["Dementor", "Dementor yaqinlashmoqda — havo muzlab ketdi!"], ru: ["Дементор", "Приближается дементор — воздух леденеет!"], en: ["Dementor", "A Dementor is closing in — the air turns icy!"] },
    boggart:  { s: "riddikulus", x: [], uz: ["Boggart", "Shkafdan boggart otilib chiqdi!"], ru: ["Боггарт", "Из шкафа вырвался боггарт!"], en: ["Boggart", "A Boggart bursts out of the wardrobe!"] },
    curse:    { s: "protego", x: [], uz: ["La'nat", "Sizga qarab la'nat uchib kelyapti!"], ru: ["Проклятие", "В вас летит проклятие!"], en: ["Curse", "A curse is flying straight at you!"] },
    duelist:  { s: "expelliarmus", x: ["stupefy"], uz: ["Qora sehrgar", "Qora sehrgar tayoqchasini sizga o'qtaldi!"], ru: ["Тёмный волшебник", "Тёмный волшебник навёл на вас палочку!"], en: ["Dark wizard", "A Dark wizard aims a wand at you!"] },
    dark:     { s: "lumos", x: [], uz: ["Zulmat", "Atrof zim-ziyo — qorong'ida kimdir bor!"], ru: ["Тьма", "Кромешная тьма — в ней кто-то есть!"], en: ["Darkness", "Pitch darkness — something is in there!"] },
    troll:    { s: "leviosa", x: ["stupefy", "reducto"], uz: ["Tog' troli", "Trol to'qmog'ini boshingiz uzra ko'tardi!"], ru: ["Горный тролль", "Тролль занёс дубину над вашей головой!"], en: ["Mountain troll", "The troll raises its club above your head!"] },
    fire:     { s: "aguamenti", x: [], uz: ["Yong'in", "Olov pardalarga o'tib ketdi!"], ru: ["Пожар", "Огонь перекинулся на шторы!"], en: ["Fire", "The fire has caught the curtains!"] },
    pixies:   { s: "immobulus", x: ["stupefy"], uz: ["Piksilar", "Bir gala piksi sizga tashlandi!"], ru: ["Пикси", "На вас летит стая пикси!"], en: ["Pixies", "A swarm of pixies dives at you!"] },
    inferi:   { s: "incendio", x: [], uz: ["Inferiylar", "Ko'ldan inferiylar chiqib kelyapti!"], ru: ["Инферналы", "Из озера поднимаются инферналы!"], en: ["Inferi", "Inferi are rising from the lake!"] },
    spider:   { s: "arania", x: ["stupefy", "incendio"], uz: ["Akromantula", "Ulkan o'rgimchak sizga yaqinlashmoqda!"], ru: ["Акромантул", "К вам ползёт гигантский паук!"], en: ["Acromantula", "A giant spider is creeping toward you!"] },
    rock:     { s: "reducto", x: ["protego", "leviosa"], uz: ["Ko'chki", "Shiftdan toshlar qulab tushyapti!"], ru: ["Обвал", "С потолка падают камни!"], en: ["Rockfall", "Rocks are falling from the ceiling!"] },
    attacker: { s: "stupefy", x: ["expelliarmus"], uz: ["Hujumchi", "Raqib sizga qarab yugurib kelyapti!"], ru: ["Нападающий", "Противник бежит прямо на вас!"], en: ["Attacker", "An enemy is running straight at you!"] }
  };
  var HM_TARTIB = ["dementor", "boggart", "curse", "duelist", "dark", "troll", "fire", "pixies", "inferi", "spider", "rock", "attacker"];     // bot: hpdars.DARSLAR bilan bir xil
  var HM_AF = { immobulus: ["Immobilus", "Иммобулюс", "Immobulus"], arania: ["Araniya Ekzumay", "Арания Экзумай", "Arania Exumai"] };      // Afsunlar darsida yo'q afsunlar
  var hm = null;      // {n, bell, waves, i, lives, wrong, late, tSum, lim, opts, t0, tm, lock}

  function hmAf(id) { return AF[id] ? (AF[id][lang] || AF[id].uz)[0] : (HM_AF[id] || [id, id, id])[lang === "ru" ? 1 : lang === "en" ? 2 : 0]; }
  function hmTx(id) { return HM[id][lang] || HM[id].uz; }
  function hmImg(id) { return IMG_DIR + "himoya/" + id + ".webp"; }
  function hmLpImg(k) { return IMG_DIR + "lyupin/" + k + ".webp"; }
  function hmPlan(n) {
    var T = HM_TARTIB, pool = T.slice(0, Math.min(T.length, n + 2)), soni = 5 + Math.min(5, Math.floor((n - 1) / 6)), w = [], g = 0;
    var yangi = n === 1 ? T.slice(0, 3) : n + 1 < T.length ? [T[n + 1]] : [];
    if (yangi.length) { w.push(yangi[yangi.length - 1]); }
    while (w.length < soni && g < 500) { var c = pool[Math.floor(afRnd(n * 53 + g++) * pool.length)]; if (c !== w[w.length - 1]) { w.push(c); } }
    return { waves: w, lim: Math.round(Math.max(2400, 7000 - (n - 1) * 131)), opts: n > 24 ? 6 : 4, yangi: yangi };
  }
  function hmBellPlan(item) {
    var T = HM_TARTIB, urug = 0, w = [], g = 0, i;
    for (i = 0; i < String(item).length; i++) { urug += String(item).charCodeAt(i) * (i + 3); }
    if (HM[item]) { w.push(item); }
    while (w.length < 8 && g < 500) { var c = T[Math.floor(afRnd(urug + g++) * T.length)]; if (c !== w[w.length - 1]) { w.push(c); } }
    return { waves: w, lim: 6000, opts: 4, yangi: [] };
  }
  function hmStop() { if (hm) { clearInterval(hm.tm); hm.tm = 0; } }
  function hmKayf(k) { ["hm-lp-im", "hm-lp-im2"].forEach(function (id) { var el = $(id); if (el && el.getAttribute("data-k") !== k) { el.setAttribute("data-k", k); el.src = hmLpImg(k); } }); }

  function hmOpen(bell, n) {
    var st = drData && drData.himoya, x = drX(), f = drFan("himoya");
    var plan = bell === true ? hmBellPlan(st && st.contest && st.contest.item) : hmPlan(n || 1);
    hmStop();
    hm = { n: n || 1, bell: bell === true, waves: plan.waves, lim: plan.lim, opts: plan.opts, yangi: plan.yangi,
           i: 0, lives: 3, wrong: 0, late: 0, tSum: 0, t0: 0, tm: 0, lock: false };
    drShowGame("scr-himoya");
    ["zor", "yaxshi", "maslahat", "xafa"].forEach(function (k) { var im = new Image(); im.src = hmLpImg(k); });
    plan.waves.forEach(function (id) { var im = new Image(); im.src = hmImg(id); });
    $("hm-kick").textContent = { uz: "Himoya darsi", ru: "Урок защиты", en: "Defence class" }[lang] || f.nom[lang];
    $("hm-ttl").textContent = f.ust[lang];
    $("hm-today").textContent = hm.bell ? x.bell : x.lvl(hm.n);
    $("hm-name").textContent = f.nom[lang];
    $("hm-desc").textContent = "";
    $("hm-res").classList.add("hidden");
    $("hm-stage").classList.add("hidden");
    $("hm-intro").classList.toggle("hidden", hm.bell);
    if (hm.bell) { hmGo(); return; }
    // kirish: yangi xavf(lar) va unga qarshi afsun
    var box = $("hm-new");
    box.innerHTML = "";
    hm.yangi.forEach(function (id) {
      var r = drEl("div", "hm-nw"), im = document.createElement("img");
      im.alt = ""; im.src = hmImg(id);
      r.appendChild(im);
      var t = drEl("span", "hm-nw-t");
      t.appendChild(drEl("b", "", hmTx(id)[0]));
      t.appendChild(drEl("small", "", hmAf(HM[id].s)));
      r.appendChild(t);
      box.appendChild(r);
    });
    $("hm-intro-t").textContent = hm.yangi.length ? x.hmNew : x.hmOld;
    $("hm-go").textContent = x.hmGo;
    hmKayf("maslahat");
  }

  function hmGo() {
    $("hm-intro").classList.add("hidden");
    $("hm-stage").classList.remove("hidden");
    $("hm-lives").classList.toggle("hidden", hm.bell);
    hm.i = 0;
    hmWave();
  }

  function hmLives() {
    var el = $("hm-lives");
    el.innerHTML = "";
    for (var i = 0; i < 3; i++) { el.appendChild(drEl("i", i < hm.lives ? "on" : "")); }
  }
  function hmHead() {
    var x = drX();
    $("hm-step").textContent = x.hmStep(Math.min(hm.i + 1, hm.waves.length), hm.waves.length) + (bl && hm.bell ? " · " + x.sec(Date.now() - bl.t0 + bl.xato * 3000) : "");
  }

  // Navbatdagi xavf: rasm uzoqdan yaqinlashadi, sham yonadi, variantlar chiqadi
  function hmWave() {
    var x = drX(), me = hm, id = hm.waves[hm.i], t = HM[id], box = $("hm-opts"), ids = [t.s], g = 0;
    var hammasi = HM_TARTIB.map(function (k) { return HM[k].s; });
    while (ids.length < hm.opts && g < 300) {
      var c = hammasi[Math.floor(afRnd(hm.n * 29 + hm.i * 13 + g++ + (hm.bell ? 700 : 0)) * hammasi.length)];
      if (ids.indexOf(c) < 0 && t.x.indexOf(c) < 0) { ids.push(c); }
    }
    ids.sort(function () { return Math.random() - 0.5; });
    hm.lock = false;
    $("hm-name").textContent = hmTx(id)[0];
    $("hm-desc").textContent = hmTx(id)[1];
    $("hm-box").className = "hm-box";
    $("hm-im").src = hmImg(id);
    $("hm-im").style.transform = "scale(.42)";
    $("hm-hint").textContent = x.hmHint;
    $("hm-hint").classList.remove("bad");
    hmKayf("maslahat");
    hmLives();
    hmHead();
    box.innerHTML = "";
    ids.forEach(function (af) {
      var b = drEl("button", "tr-o", hmAf(af));
      b.type = "button";
      b.addEventListener("click", function () { hmPick(af, b); });
      box.appendChild(b);
    });
    hm.t0 = Date.now();
    clearInterval(hm.tm);
    hm.tm = setInterval(function () {
      if (hm !== me || $("scr-himoya").classList.contains("hidden")) { clearInterval(me.tm); return; }
      if (hm.lock) { return; }
      var p = Math.min(1, (Date.now() - hm.t0) / hm.lim);
      $("hm-im").style.transform = "scale(" + (0.42 + 0.58 * p).toFixed(3) + ")";
      $("hm-sham-w").style.width = ((1 - p) * 100).toFixed(1) + "%";
      $("hm-sham").classList.toggle("oz", p > 0.7 && p < 1);
      $("hm-sham").classList.toggle("ochdi", p >= 1);
      if (hm.bell) { hmHead(); }
      if (p >= 1) { hmMiss(true); }
    }, 50);
  }

  // Jon ketdi (kechikish - keyingi xavfga o'tadi; xato tanlov - shu xavf davom etadi)
  function hmMiss(kech) {
    var x = drX(), me = hm;
    if (kech) { hm.late++; } else { hm.wrong++; }
    if (bl && hm.bell) { bl.xato++; } else { hm.lives--; }
    hmLives();
    hmKayf("xafa");
    $("hm-hint").textContent = kech ? x.hmLate : x.hmBad;
    $("hm-hint").classList.add("bad");
    $("hm-box").classList.remove("zarba");
    void $("hm-box").offsetWidth;
    $("hm-box").classList.add("zarba");
    try { if (tg && tg.HapticFeedback) { tg.HapticFeedback.notificationOccurred("error"); } } catch (e) {}
    if (!hm.bell && hm.lives <= 0) { hm.lock = true; clearInterval(hm.tm); setTimeout(function () { if (hm === me) { hmEnd(); } }, 800); return; }
    if (kech) {
      hm.lock = true;
      hm.tSum += 1;
      setTimeout(function () { if (hm === me) { hmNext(); } }, 800);
    }
  }
  function hmNext() {
    hm.i++;
    if (hm.i >= hm.waves.length) { hmEnd(); return; }
    hmWave();
  }
  function hmPick(af, btn) {
    if (!hm || hm.lock || btn.classList.contains("xato")) { return; }
    var x = drX(), me = hm, id = hm.waves[hm.i];
    if (af !== HM[id].s) { btn.classList.add("xato"); hmMiss(false); return; }
    hm.lock = true;
    hm.tSum += Math.min(1, (Date.now() - hm.t0) / hm.lim);
    btn.classList.add("togri");
    $("hm-box").classList.add("urildi");
    $("hm-hint").textContent = x.hmOk[hm.i % x.hmOk.length];
    $("hm-hint").classList.remove("bad");
    hmKayf((Date.now() - hm.t0) / hm.lim < 0.5 ? "zor" : "yaxshi");
    try { if (tg && tg.HapticFeedback) { tg.HapticFeedback.impactOccurred("light"); } } catch (e) {}
    setTimeout(function () { if (hm === me) { hmNext(); } }, 650);
  }

  // Dars oxiri: baho (xato -12, kechikish -15, sekin javob -10) va Professor Lyupin xulosasi
  function hmEnd() {
    var x = drX(), me = hm, daraja = hm.n, box = $("hm-res");
    clearInterval(hm.tm);
    $("hm-stage").classList.add("hidden");
    $("hm-name").textContent = drFan("himoya").nom[lang];
    $("hm-desc").textContent = "";
    if (hm.bell) { blFinish(box); return; }
    var s = Math.max(0, 100 - hm.wrong * 12 - hm.late * 15 - (hm.tSum / hm.waves.length > 0.75 ? 10 : 0));
    var baho = s >= 85 ? 5 : s >= 70 ? 4 : s >= 50 ? 3 : s >= 30 ? 2 : 1;
    if (hm.lives <= 0) { baho = Math.min(baho, 2); }
    var sc = { baho: baho, izoh: x.hmStat(hm.wrong, hm.late) }, otdi = baho >= 3;
    var show = function (yangi) {
      if (hm !== me) { return; }
      if (otdi) { drResult(box, "«" + x.hmLpB[baho - 1] + "»", "himoya", daraja, yangi); }
      else {
        box.innerHTML = "";
        box.appendChild(drEl("p", "dr-res-t", "«" + x.hmLpB[baho - 1] + "»"));
        box.appendChild(drEl("p", "dr-res-s", x.afLow));
        var r = drEl("button", "dr-btn", x.retry);
        r.type = "button";
        r.addEventListener("click", function () { hmOpen(false, daraja); });
        box.appendChild(r);
        var b = drEl("button", "dr-btn ikkinchi", x.toList);
        b.type = "button";
        b.addEventListener("click", function () { hm = null; fanOpen("himoya"); });
        box.appendChild(b);
        box.classList.remove("hidden");
      }
      var ft = box.querySelector(".dr-res-t"), fi = document.createElement("img");
      fi.className = "af-fl-big";
      fi.alt = "";
      fi.src = hmLpImg(baho >= 5 ? "zor" : baho === 4 ? "yaxshi" : baho === 3 ? "maslahat" : "xafa");
      box.insertBefore(fi, ft);
      box.insertBefore(drEl("small", "af-baho-k", x.hmLpN), ft);
      box.insertBefore(afBahoEl(sc), box.firstChild);
    };
    if (otdi) { drBahoSave("himoya", daraja, baho); drDone("himoya", daraja, show); } else { show(null); }
  }

  function drSetup() {
    $("dr-back").addEventListener("click", function () { $("scr-dars").classList.add("hidden"); drQayt = false; try { openHub(); } catch (e) {} });
    $("af-back").addEventListener("click", function () { var b = af && af.bell; af = null; blAbort(); if (b) { blOpen("afsun"); } else { fanOpen("afsun"); } });
    $("ik-back").addEventListener("click", function () { var b = ik && ik.bell; ikStop(); ik = null; blAbort(); if (b) { blOpen("iksir"); } else { fanOpen("iksir"); } });
    $("hm-back").addEventListener("click", function () { var b = hm && hm.bell; hmStop(); hm = null; blAbort(); if (b) { blOpen("himoya"); } else { fanOpen("himoya"); } });
    $("hm-go").addEventListener("click", function () { if (hm) { hmGo(); } });
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
    $("af-show").addEventListener("click", function () { if (af && !af.done) { af.show = true; af.used = true; af.trail = []; afPaint(); } });
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
