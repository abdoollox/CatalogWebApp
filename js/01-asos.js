/* Asos: Telegram, sinov o'quvchisi, katalog, matnlar, tayoqcha ma'lumotlari
   Ilova kodi bir necha faylga bo'lingan; hammasi BIR umumiy maydonda ishlaydi
   va index.html dagi TARTIBDA yuklanadi. Yuklanish paytida keyingi fayldagi
   narsani chaqirmang - tekshiruv: tools/tartib.js */
"use strict";
  var tg = (window.Telegram && window.Telegram.WebApp) ? window.Telegram.WebApp : null;
  if (tg) {
    try { tg.ready(); tg.expand(); } catch (e) {}
    // Pastga surish ilovani YOPIB yuborardi: uzun sahifani (xat, chat, ro'yxatlar)
    // o'qiyman deganda Telegram ilovani yopardi. 7.7 dan boshlab buni o'chirish mumkin.
    try { if (tg.disableVerticalSwipes) { tg.disableVerticalSwipes(); } } catch (e) {}
  }

  var BOT = "garripotterkinobot";

  /* ---------- SINOV O'QUVCHISI (faqat adminlar) ----------
     Yoqilganda ilova butunlay boshqa odamdek ishlaydi: serverga har so'rov
     bilan "X-HP-Test: 1" ketadi va u yerda so'rov MANFIY raqamli alohida
     hisobga tushadi (fakultet, tayoqcha, ball, chat - hammasi noldan).
     Qurilmadagi xotira ham alohida: kalitlar oldiga "t_" qo'yiladi, shuning
     uchun asl profil o'z joyida qoladi. Chiqilganda hamma narsa tiklanadi. */
  var TEST_KEY = "hp_test";
  var HP_TEST = false;
  try { HP_TEST = window.localStorage.getItem(TEST_KEY) === "1"; } catch (e) {}
  function TK(name) { return HP_TEST ? "t_" + name : name; }

  // Serverga ketadigan har so'rovga sinov sarlavhasini qo'shamiz
  if (HP_TEST && window.fetch) {
    var _origFetch = window.fetch;
    window.fetch = function (url, opts) {
      try {
        if (String(url).indexOf("bot.tizimshunos.uz") >= 0) {
          opts = opts || {};
          var h = opts.headers;
          if (h && typeof h.set === "function") { h.set("X-HP-Test", "1"); }
          else {
            var copy = {};
            for (var k in (h || {})) { copy[k] = h[k]; }
            copy["X-HP-Test"] = "1";
            opts.headers = copy;
          }
        }
      } catch (e) {}
      return _origFetch.call(window, url, opts);
    };
  }

  var KEY = TK("watched_movies");
  var LANG_KEY = "pref_lang";
  var HOUSE_KEY = TK("house");
  var WAND_KEY = TK("wand");

  /* ===== KATALOG BOSHI — AVTOMATIK YOZILADI, QO'LDA TAHRIRLAMANG =====
     Manba:     CatalogBot/catalog.py
     Yangilash: python3 tools/webappdata.py                          */

  var MOVIES = [
    { id: "hp1", uz: "Hikmatlar Toshi", ru: "Философский Камень", en: "Philosopher's Stone" },
    { id: "hp2", uz: "Maxfiy Hujra", ru: "Тайная Комната", en: "Chamber of Secrets" },
    { id: "hp3", uz: "Azkaban Mahbusi", ru: "Узник Азкабана", en: "Prisoner of Azkaban" },
    { id: "hp4", uz: "Alanga Kubogi", ru: "Кубок Огня", en: "Goblet of Fire" },
    { id: "hp5", uz: "Feniks Jamiyati", ru: "Орден Феникса", en: "Order of the Phoenix" },
    { id: "hp6", uz: "Tilsim Shaxzodasi", ru: "Принц Полукровка", en: "Half-Blood Prince" },
    { id: "hp7", uz: "Ajal Tuhfasi 1", ru: "Дары Смерти 1", en: "Deathly Hallows 1" },
    { id: "hp8", uz: "Ajal Tuhfasi 2", ru: "Дары Смерти 2", en: "Deathly Hallows 2" }
  ];

  var MOVIES_FB = [
    { id: "fb1",  num: "I",   year: "2016", uz: "Fantastik Maxluqlar", ru: "Фантастические твари 1", en: "Fantastic Beasts 1" },
    { id: "fb2",  num: "II",  year: "2018", uz: "Fantastik Maxluqlar 2", ru: "Фантастические твари 2", en: "Fantastic Beasts 2" },
    { id: "fb3",  num: "III", year: "2022", uz: "Fantastik Maxluqlar 3", ru: "Фантастические твари 3", en: "Fantastic Beasts 3" }
  ];

  var NUMERALS = ["I","II","III","IV","V","VI","VII","VIII"];
  var YEARS = ["2001","2002","2004","2005","2007","2009","2010","2011"];

  // Qaysi film qaysi tilda hali yuklanmagan (catalog.py da message_id = 0).
  // Bunday kartalar kulrang bo'lib ko'rinadi va bosilmaydi.
  var NOT_READY = {
    uz: [],
    ru: ["fb1","fb2","fb3"],
    en: []
  };

  /* ===== KATALOG OXIRI ===== */
  // Posterlar yuklanmaganda ko'rinadigan yagona neytral fon
  var CARD_BG = "linear-gradient(155deg,#39414e,#171c24)";

  // Saralash testi. Har javob fakultetlarga ball beradi:
  // asosiy xususiyat 3 ball, yaqin xususiyat 1 ball.
  var SORTING = [
    { img:"img/sort/q1.jpg", w: [{"gryffindor":3, "ravenclaw":1}, {"ravenclaw":3, "hufflepuff":1}, {"hufflepuff":3, "gryffindor":1}, {"slytherin":3, "ravenclaw":1}],
      uz: { q:"Kechqurun Taqiqlangan o'rmondan g'alati ovoz keladi. Nima qilasiz?",
            a:["Darhol borib tekshiraman",
               "Avval nima bo'lishi mumkinligini aniqlayman",
               "Do'stlarimni ogohlantiraman va birga boramiz",
               "Bu menga qanday imkoniyat berishini o'ylayman"] },
      ru: { q:"Вечером из Запретного леса доносится странный звук. Что вы сделаете?",
            a:["Сразу пойду проверить",
               "Сначала выясню, что это может быть",
               "Предупрежу друзей и пойдём вместе",
               "Подумаю, какую выгоду это может дать"] },
      en: { q:"A strange sound comes from the Forbidden Forest at night. What do you do?",
            a:["Go and investigate at once",
               "First work out what it could be",
               "Warn my friends and go together",
               "Consider what opportunity this might bring"] } },

    { img:"img/sort/q2.jpg", w: [{"hufflepuff":3, "slytherin":1}, {"ravenclaw":3, "slytherin":1}, {"slytherin":3, "ravenclaw":1}, {"gryffindor":3, "hufflepuff":1}],
      uz: { q:"Muhim imtihonga bir kun qoldi. Qanday tayyorlanasiz?",
            a:["Reja tuzib, bosqichma-bosqich takrorlayman",
               "Eng murakkab mavzularni chuqur o'rganaman",
               "Eng tez natija beradigan yo'lni topaman",
               "Bilganim bilan kiraman — qandaydir yo'lini topaman"] },
      ru: { q:"До важного экзамена остался день. Как будете готовиться?",
            a:["Составлю план и пройду всё по порядку",
               "Углублюсь в самые сложные темы",
               "Найду самый быстрый путь к результату",
               "Пойду с тем, что знаю — как-нибудь справлюсь"] },
      en: { q:"One day left before a major exam. How do you prepare?",
            a:["Make a plan and work through it step by step",
               "Go deep on the hardest topics",
               "Find the fastest route to a good result",
               "Go in with what I know and manage somehow"] } },

    { img:"img/sort/q3.jpg", w: [{"gryffindor":3, "slytherin":1}, {"slytherin":3, "gryffindor":1}, {"ravenclaw":3, "hufflepuff":1}, {"hufflepuff":3, "ravenclaw":1}],
      uz: { q:"Sehrli oyna sizga eng katta orzuingizni ko'rsatadi. Unda nima bor?",
            a:["Men qo'rqmasdan turgan lahza",
               "Menga hurmat bilan qaraydigan odamlar",
               "Hech kim ochmagan sirni birinchi bo'lib ochgan lahza",
               "Yaqinlarim yonimda, hammasi joyida"] },
      ru: { q:"Волшебное зеркало показывает вашу заветную мечту. Что в нём?",
            a:["Момент, когда я не отступил",
               "Люди, которые смотрят на меня с уважением",
               "Момент, когда я первым разгадал тайну, которую не разгадал никто",
               "Близкие рядом, и всё хорошо"] },
      en: { q:"A magic mirror shows your deepest wish. What appears?",
            a:["The moment I stood my ground",
               "People who look at me with respect",
               "The moment I solved a mystery no one else could",
               "My loved ones near me, all well"] } },

    { img:"img/sort/q4.jpg", w: [{"hufflepuff":3, "gryffindor":1}, {"gryffindor":3, "ravenclaw":1}, {"slytherin":3, "hufflepuff":1}, {"ravenclaw":3, "slytherin":1}],
      uz: { q:"Do'stingiz qoida buzdi va sizdan yashirishni so'radi.",
            a:["Yashiraman — do'stlik muhimroq",
               "Uni o'zi tan olishga ko'ndiraman",
               "Vaziyatga qarab qaror qilaman",
               "Nima to'g'riligini sovuqqonlik bilan o'ylab, keyin qaror qilaman"] },
      ru: { q:"Друг нарушил правило и просит его прикрыть.",
            a:["Прикрою — дружба важнее",
               "Уговорю его признаться самому",
               "Решу по обстоятельствам",
               "Хладнокровно обдумаю, что правильно, и тогда решу"] },
      en: { q:"A friend broke a rule and asks you to cover for them.",
            a:["Cover for them — friendship comes first",
               "Persuade them to own up themselves",
               "Decide based on the situation",
               "Think calmly about what is right, then decide"] } },

    { img:"img/sort/q5.jpg", w: [{"gryffindor":3, "hufflepuff":1}, {"slytherin":3, "ravenclaw":1}, {"ravenclaw":3, "gryffindor":1}, {"hufflepuff":3, "slytherin":1}],
      uz: { q:"Qaysi dars sizni ko'proq o'ziga tortadi?",
            a:["Qora sehrga qarshi himoya",
               "Iksirlar tayyorlash",
               "Afsunlar",
               "Giyohshunoslik"] },
      ru: { q:"Какой предмет вам интереснее всего?",
            a:["Защита от тёмных искусств",
               "Зельеварение",
               "Заклинания",
               "Травология"] },
      en: { q:"Which subject draws you in the most?",
            a:["Defence Against the Dark Arts",
               "Potions",
               "Charms",
               "Herbology"] } },

    { img:"img/sort/q6.jpg", w: [{"gryffindor":3, "slytherin":1}, {"slytherin":3, "gryffindor":1}, {"ravenclaw":3, "slytherin":1}, {"hufflepuff":3, "gryffindor":1}],
      uz: { q:"Sizni nima ko'proq qo'rqitadi?",
            a:["Qo'rqoq deb bilishlari",
               "Oddiy bo'lib, izsiz o'tib ketish",
               "Hech narsani chuqur tushunmay, yuzaki yashab o'tish",
               "Yordamim kerak bo'lganda yonida bo'lolmaslik"] },
      ru: { q:"Что пугает вас больше всего?",
            a:["Что меня сочтут трусом",
               "Остаться обычным и незамеченным",
               "Прожить жизнь поверхностно, так ничего и не поняв",
               "Не оказаться рядом, когда нужна моя помощь"] },
      en: { q:"What frightens you most?",
            a:["Being thought a coward",
               "Being ordinary and forgotten",
               "Living a shallow life without truly understanding anything",
               "Not being there when someone needs me"] } },

    { img:"img/sort/q7.jpg", w: [{"gryffindor":3, "slytherin":1}, {"ravenclaw":3, "hufflepuff":1}, {"hufflepuff":3, "ravenclaw":1}, {"slytherin":3, "gryffindor":1}],
      uz: { q:"Guruh ishida sizning o'rningiz qanday bo'ladi?",
            a:["Yetakchilik qilaman va qaror qabul qilaman",
               "Rejani tuzaman, xatolarni topaman",
               "Hammani birlashtiraman, ish taqsimlayman",
               "Maqsadga eng qisqa yo'lni topaman"] },
      ru: { q:"Какая у вас роль в командной работе?",
            a:["Беру руководство и принимаю решения",
               "Составляю план, нахожу ошибки",
               "Объединяю всех и распределяю задачи",
               "Нахожу кратчайший путь к цели"] },
      en: { q:"What is your role in a group?",
            a:["I take the lead and make the calls",
               "I build the plan and spot the flaws",
               "I bring people together and share out the work",
               "I find the shortest path to the goal"] } },

    { img:"img/sort/q8.jpg", w: [{"gryffindor":3}, {"slytherin":3}, {"ravenclaw":3}, {"hufflepuff":3}],
      uz: { q:"Yuz yildan keyin sizni qanday eslashlarini istardingiz?",
            a:["Jasur edi", "Buyuk edi", "Dono edi", "Sodiq edi"] },
      ru: { q:"Каким вас должны запомнить через сто лет?",
            a:["Он был храбрым", "Он был великим", "Он был мудрым", "Он был верным"] },
      en: { q:"How would you want to be remembered in a hundred years?",
            a:["As brave", "As great", "As wise", "As loyal"] } }
  ];

  /* ---------- TAYOQCHA ---------- */

  var CORES = {
    phoenix: { uz:"feniks pati", ru:"перо феникса", en:"phoenix feather",
      note_uz:"Eng tanlovchan o'zak. U kamdan-kam sehrgarga bo'ysunadi, lekin bo'ysunsa — imkoniyatlari cheksiz.",
      note_ru:"Самая разборчивая сердцевина. Подчиняется немногим, но если подчинилась — предела нет.",
      note_en:"The most selective core. It yields to few, but where it does, there is no limit." },
    dragon: { uz:"ajdaho yuragi tolasi", ru:"жила дракона", en:"dragon heartstring",
      note_uz:"Eng kuchli o'zak. Tez o'rganadi va tez bog'lanadi, lekin jangovar tabiati bor.",
      note_ru:"Самая мощная сердцевина. Быстро учится и привязывается, но нрав у неё боевой.",
      note_en:"The most powerful core. It learns fast and bonds fast, but its temper is fierce." },
    unicorn: { uz:"yakkashox yeli", ru:"волос единорога", en:"unicorn hair",
      note_uz:"Eng sodiq o'zak. Boshqa egaga o'tishni istamaydi va hech qachon tashlab ketmaydi.",
      note_ru:"Самая верная сердцевина. Не желает менять хозяина и не предаёт.",
      note_en:"The most loyal core. It will not change hands, and it never betrays." }
  };

  var WOODS = {
    oak:     { uz:"Eman",    ru:"Дуб",        en:"Oak",
               t_uz:"jasorat va sadoqat yog'ochi", t_ru:"дерево храбрости и верности", t_en:"a wood of courage and loyalty" },
    yew:     { uz:"Tis",     ru:"Тис",        en:"Yew",
               t_uz:"kuch va hokimiyat yog'ochi", t_ru:"дерево силы и власти", t_en:"a wood of power and dominion" },
    cherry:  { uz:"Olcha",   ru:"Вишня",      en:"Cherry",
               t_uz:"g'ayrioddiy kuch yog'ochi", t_ru:"дерево необычайной силы", t_en:"a wood of uncommon strength" },
    holly:   { uz:"Padub",   ru:"Остролист",  en:"Holly",
               t_uz:"himoya yog'ochi", t_ru:"дерево защиты", t_en:"a wood of protection" },
    aspen:   { uz:"Terak",   ru:"Осина",      en:"Aspen",
               t_uz:"jangchi ruhi yog'ochi", t_ru:"дерево воинского духа", t_en:"a wood of the warrior spirit" },
    walnut:  { uz:"Yong'oq", ru:"Орех",       en:"Walnut",
               t_uz:"zukkolik yog'ochi", t_ru:"дерево изобретательности", t_en:"a wood of ingenuity" }
  };

  var FLEX = {
    rigid:    { uz:"qattiq",          ru:"жёсткая",     en:"unyielding",   len:"13" },
    springy:  { uz:"egiluvchan",      ru:"гибкая",      en:"springy",      len:"9¾" },
    supple:   { uz:"moslashuvchan",   ru:"податливая",  en:"supple",       len:"11¾" },
    yielding: { uz:"yumshoq",         ru:"мягкая",      en:"yielding",     len:"12½" }
  };

  // Testning o'zidan hisoblangan kamyoblik (1536 kombinatsiya)
  var RARITY_CORE = { unicorn: 45, dragon: 31, phoenix: 23 };
  var RARITY_PAIR = { unicorn: 7.6, dragon: 5.2, phoenix: 3.9 };

  // Kanondagi mashhur tayoqchalar bilan mos kelishi
  var FAMOUS = {
    "holly_phoenix":  { uz:"Garri Potter", ru:"Гарри Поттер", en:"Harry Potter" },
    "yew_phoenix":    { uz:"Voldemort", ru:"Волан-де-Морт", en:"Voldemort" },
    "walnut_dragon":  { uz:"Bellatrisa Lestrej", ru:"Беллатриса Лестрейндж", en:"Bellatrix Lestrange" },
    "cherry_unicorn": { uz:"Nevill Longbottom", ru:"Невилл Долгопупс", en:"Neville Longbottom" }
  };

  // Yog'ochlarning kengaytirilgan tavsifi — "batafsil" ekrani uchun
  var WOOD_LORE = {
    oak: {
      uz:"Eman egasi kuchli va sodiq bo'ladi. Bunday tayoqcha o'z odamini uzoq sinaydi, lekin bir marta tanlagach, hech qachon voz kechmaydi. Qiyin paytda u eng ishonchli hamroh.",
      ru:"Владелец дуба силён и верен. Такая палочка долго испытывает своего человека, но однажды выбрав — не отступает. В трудный час она самый надёжный спутник.",
      en:"An oak owner is strong and steadfast. This wand tests its wizard for a long time, but once it has chosen, it never turns away. In hard hours it is the surest companion." },
    yew: {
      uz:"Tis kamdan-kam qo'lga tushadi. U hayot va o'lim chegarasida turadigan tayoqcha — egasiga katta kuch beradi, lekin o'sha kuch bilan nima qilishini so'ramaydi. Javobgarlik egada qoladi.",
      ru:"Тис достаётся немногим. Это палочка на грани жизни и смерти — она даёт большую силу, но не спрашивает, как ею распорядятся. Ответственность остаётся на владельце.",
      en:"Yew comes to few. It is a wand that stands at the edge of life and death — it grants great power, but never asks what will be done with it. The responsibility stays with the owner." },
    cherry: {
      uz:"Olcha tashqaridan yumshoq ko'rinadi, ichida esa g'ayrioddiy kuch yashiradi. Bunday tayoqcha o'zini tuta biladigan odamni tanlaydi — kuchni ko'z-ko'z qilmaydiganini.",
      ru:"Вишня кажется мягкой снаружи, но прячет внутри необычайную силу. Такая палочка выбирает того, кто умеет сдерживаться — кто не выставляет силу напоказ.",
      en:"Cherry looks gentle from the outside and hides uncommon power within. This wand chooses one who can hold back — who does not display strength." },
    holly: {
      uz:"Padub himoya yog'ochi. U ko'pincha g'azabini yengishi kerak bo'lgan yoki xavfli yo'ldan boradigan sehrgarga keladi. Bunday tayoqcha egasini o'zidan asraydi.",
      ru:"Остролист — дерево защиты. Он часто приходит к тому, кому предстоит одолеть свой гнев или пройти опасный путь. Такая палочка бережёт хозяина от него самого.",
      en:"Holly is a wood of protection. It often comes to one who must master their own anger or walk a dangerous road. This wand guards its owner from himself." },
    aspen: {
      uz:"Terak jangchilar yog'ochi. Uning egasi o'z e'tiqodidan qaytmaydi va kerak bo'lsa yolg'iz turadi. Bunday tayoqcha ikkilanishni yoqtirmaydi.",
      ru:"Осина — дерево воинов. Её владелец не отступает от своих убеждений и, если нужно, стоит один. Такая палочка не любит колебаний.",
      en:"Aspen is a wood of warriors. Its owner does not abandon a conviction and will stand alone if need be. This wand has no patience for wavering." },
    walnut: {
      uz:"Yong'oq zukko va ixtirochi qo'lda ochiladi. U egasining aqliga moslashadi va kutilmagan yechimlarni yaxshi ko'radi. Lekin vijdonsiz qo'lda xavfli bo'lishi mumkin.",
      ru:"Орех раскрывается в руке изобретательного. Он подстраивается под ум хозяина и любит неожиданные решения. Но в бессовестной руке может стать опасным.",
      en:"Walnut opens up in an inventive hand. It adapts to its owner's mind and favours unexpected solutions. In an unscrupulous hand, though, it can turn dangerous." }
  };

  var CORE_LORE = {
    phoenix: {
      uz:"Feniks pati — eng kamyob o'zak. Feniks o'z patini kamdan-kam beradi, va bergani ham osonlikcha bo'ysunmaydi. Bunday tayoqcha o'z fikriga ega bo'ladi, ba'zan egasidan mustaqil ish tutadi. Lekin u eng keng sehr doirasiga ega.",
      ru:"Перо феникса — самая редкая сердцевина. Феникс отдаёт перо неохотно, и отданное подчиняется не сразу. Такая палочка имеет собственное мнение и порой действует независимо. Зато её магический диапазон шире всех.",
      en:"Phoenix feather is the rarest core. A phoenix gives up a feather reluctantly, and what it gives does not submit easily. Such a wand keeps its own mind and sometimes acts apart from its owner. But its range of magic is the widest of all." },
    dragon: {
      uz:"Ajdaho yuragi tolasi eng kuchli o'zak. U tez o'rganadi va yangi egaga tez bog'lanadi — hatto avvalgisini unutib. Jangovar sehrga eng mos, lekin g'azabga moyil: ehtiyotsiz qo'lda tez qiziydi.",
      ru:"Жила дракона — самая мощная сердцевина. Она быстро учится и быстро привязывается к новому хозяину, забывая прежнего. Лучше всего подходит для боевой магии, но склонна к вспышкам: в неосторожной руке легко перегревается.",
      en:"Dragon heartstring is the most powerful core. It learns quickly and bonds quickly to a new owner, forgetting the last. Best suited to combative magic, but prone to temper: in a careless hand it overheats." },
    unicorn: {
      uz:"Yakkashox yeli eng sodiq o'zak. U bir egaga bog'lanadi va boshqasiga o'tishni istamaydi. Qora sehrga deyarli yaramaydi — shuning uchun uni buzish qiyin. Kuchi boshqalarnikidan pastroq, lekin u hech qachon xiyonat qilmaydi.",
      ru:"Волос единорога — самая верная сердцевина. Он привязывается к одному хозяину и не желает менять его. Почти не годится для тёмной магии — потому его трудно испортить. Силы в нём меньше, но он никогда не предаёт.",
      en:"Unicorn hair is the most loyal core. It binds to one owner and will not willingly change hands. It is nearly useless for dark magic — which is why it is hard to corrupt. It carries less raw power, but it never betrays." }
  };

  var OLLI = {
    uz: {
      introTop: "Ollivander do'koni. 382-yildan beri.",
      introMid: "Qiziq\u2026 qiziq.",
      introBot: "Tayoqchani siz tanlamaysiz, bola. Tayoqcha sizni tanlaydi. Keling, qaysi biri sizni kutayotganini ko'ramiz.",
      ready: "Qo'limni uzataman",
      before: [
        ["Qaysi qo'lingiz bilan sehr qilasiz? Har birining o'z og'irligi bor."],
        ["Sehringiz birinchi marta qachon ko'ringan? Bunday lahzalar tasodifiy emas."],
        ["O'rmonda yurib borasiz. Qaysi daraxt oldida to'xtaysiz?"],
        ["Sehr sizga nima uchun kerak? To'g'risini ayting — tayoqcha yolg'onni sezadi."],
        ["Oxirgi savol. Tayoqcha qo'lingizda uchqun chiqarmasa — nima qilasiz?"]
      ],
      after: ["Hmm.", "Shunday deng\u2026", "Ko'rdim.", "Qiziq.", "Yaxshi.", "Davom etamiz."],
      think: ["Kutib turing\u2026 shu qutida bir narsa bor edi.",
              "Yo'q, bu emas. Mana bu\u2026 ha.",
              "Uni oling. Qo'lingizda tuting."],
      place: "Sizning tayoqchangiz —"
    },
    ru: {
      introTop: "Лавка Олливандера. С 382 года.",
      introMid: "Любопытно\u2026 весьма любопытно.",
      introBot: "Не вы выбираете палочку, дитя. Палочка выбирает вас. Что ж, посмотрим, какая из них вас дожидается.",
      ready: "Протяну руку",
      before: [
        ["Какой рукой вы колдуете? У каждой свой вес."],
        ["Когда впервые проявилась ваша магия? Такие мгновения не случайны."],
        ["Вы идёте по лесу. У какого дерева остановитесь?"],
        ["Зачем вам магия? Отвечайте честно — палочка чувствует ложь."],
        ["Последний вопрос. Палочка не даёт искры в вашей руке. Что сделаете?"]
      ],
      after: ["Хм.", "Вот как\u2026", "Вижу.", "Любопытно.", "Хорошо.", "Дальше."],
      think: ["Погодите\u2026 в той коробке кое-что было.",
              "Нет, не эта. А вот эта\u2026 да.",
              "Возьмите её. Подержите в руке."],
      place: "Ваша палочка —"
    },
    en: {
      introTop: "Ollivanders. Since 382 BC.",
      introMid: "Curious\u2026 very curious.",
      introBot: "You do not choose the wand, child. The wand chooses you. Let us see which one has been waiting for you.",
      ready: "I hold out my hand",
      before: [
        ["Which hand do you cast with? Each carries its own weight."],
        ["When did your magic first show itself? Such moments are never accidents."],
        ["You are walking through a wood. At which tree do you stop?"],
        ["What do you want magic for? Answer truly — a wand senses a lie."],
        ["One last question. The wand gives no spark in your hand. What do you do?"]
      ],
      after: ["Hmm.", "Is that so\u2026", "I see.", "Curious.", "Good.", "Onward."],
      think: ["Wait\u2026 there was something in that box.",
              "No, not this one. But this\u2026 yes.",
              "Take it. Hold it in your hand."],
      place: "Your wand is —"
    }
  };

  var WANDQ = [
    { w: [{"unicorn":1, "oak":1}, {"dragon":1, "aspen":1}, {"dragon":1, "walnut":1}, {"unicorn":1, "cherry":1}],
      uz: { q:"Qaysi qo'lingiz bilan sehr qilasiz?",
            a:["O'ng qo'l — odatdagidek",
               "Chap qo'l — men boshqacha ushlayman",
               "Ikkalasi ham — farqi yo'q",
               "Bilmayman, hali ushlamaganman"] },
      ru: { q:"Какой рукой вы колдуете?",
            a:["Правой — как обычно",
               "Левой — я держу иначе",
               "Обеими — без разницы",
               "Не знаю, ещё не держал"] },
      en: { q:"Which hand do you cast with?",
            a:["Right — as most do",
               "Left — I hold it differently",
               "Either — it makes no difference",
               "I do not know, I have never held one"] } },

    { w: [{"dragon":3, "aspen":1}, {"phoenix":3, "holly":1}, {"unicorn":3, "oak":1}, {"unicorn":2, "cherry":1}],
      uz: { q:"Sehringiz birinchi marta qachon ko'ringan?",
            a:["G'azablanganimda — nimadir sindi",
               "Qo'rqqanimda — o'zimni himoya qildim",
               "Kimnidir himoya qilmoqchi bo'lganimda",
               "Shunchaki — hech qanday sabab yo'q edi"] },
      ru: { q:"Когда впервые проявилась ваша магия?",
            a:["В гневе — что-то разбилось",
               "В страхе — я защитил себя",
               "Когда хотел защитить другого",
               "Просто так — без всякой причины"] },
      en: { q:"When did your magic first show itself?",
            a:["In anger — something broke",
               "In fear — I shielded myself",
               "When I tried to protect someone",
               "For no reason at all"] } },

    { w: [{"oak":4}, {"yew":4}, {"cherry":4}, {"holly":4}, {"aspen":4}, {"walnut":4}],
      uz: { q:"O'rmonda yurib borasiz. Qaysi daraxt oldida to'xtaysiz?",
            a:["Eng qadimgisi, ildizlari yerdan chiqib turgan",
               "Eng balandi, uchi ko'rinmaydi",
               "Gullab turgani, oq gullari bilan",
               "Kuzda ham yashil turgani",
               "Yaproqlari shitirlagani, shamolsiz ham",
               "Mevali, shoxlari egilgan"] },
      ru: { q:"Вы идёте по лесу. У какого дерева остановитесь?",
            a:["У самого древнего, корни наружу",
               "У самого высокого, вершины не видно",
               "У цветущего, в белых цветах",
               "У того, что зелено и осенью",
               "У того, чьи листья шелестят без ветра",
               "У плодового, ветви клонятся"] },
      en: { q:"You are walking through a wood. At which tree do you stop?",
            a:["The oldest, roots breaking the earth",
               "The tallest, its crown out of sight",
               "The one in bloom, white with flowers",
               "The one still green in autumn",
               "The one whose leaves stir without wind",
               "The fruit tree, branches bowed"] } },

    { w: [{"dragon":3, "yew":1}, {"phoenix":3, "walnut":1}, {"unicorn":3, "holly":1}, {"unicorn":2, "aspen":1}],
      uz: { q:"Sehr sizga nima uchun kerak?",
            a:["Kuchli bo'lish uchun",
               "Bilish va tushunish uchun",
               "Yaqinlarimni asrash uchun",
               "Hali bilmayman — shuni topmoqchiman"] },
      ru: { q:"Зачем вам магия?",
            a:["Чтобы быть сильным",
               "Чтобы знать и понимать",
               "Чтобы беречь близких",
               "Пока не знаю — это и хочу найти"] },
      en: { q:"What do you want magic for?",
            a:["To be strong",
               "To know and understand",
               "To keep my people safe",
               "I do not know yet — that is what I seek"] } },

    { w: [{"rigid":4, "dragon":1}, {"springy":4, "unicorn":1}, {"supple":4}, {"yielding":4, "unicorn":1}],
      uz: { q:"Tayoqcha qo'lingizda uchqun chiqarmasa — nima qilasiz?",
            a:["Yana urinib ko'raman, qayta-qayta",
               "Boshqasini so'rayman",
               "Nega bo'lmaganini o'ylab ko'raman",
               "Kutaman — o'zi vaqti kelganda ishlaydi"] },
      ru: { q:"Палочка не даёт искры в вашей руке. Что сделаете?",
            a:["Попробую снова, и ещё раз",
               "Попрошу другую",
               "Задумаюсь, почему не вышло",
               "Подожду — придёт время, заработает"] },
      en: { q:"The wand gives no spark in your hand. What do you do?",
            a:["Try again, and again",
               "Ask for another",
               "Wonder why it failed",
               "Wait — it will work when it is time"] } }
  ];

  // Saralovchi qalpoq nutqi. Har joyda bir nechta variant — tasodifiy tanlanadi.
  var HAT = {
    uz: {
      introTop: "Meni boshingizga qo'ying.",
      introMid: "Hmm... qiziq. Juda qiziq.",
      introBot: "Men mingdan ortiq boshni ko'rganman. Sizniki esa\u2026 hali ochilmagan kitobga o'xshaydi. Keling, birga varaqlaymiz.",
      ready: "Tayyorman",
      before: [
        ["Boshlaylik. Tun, o'rmon va noma'lum ovoz. Qiziqishingiz qo'rquvingizdan kuchlimi?",
         "Birinchi savol eng sodda ko'rinadi. Odatda shunday emas."],
        ["Endi tartibingizni ko'ray. Odam qanday ishlashi — kim ekanini aytib beradi.",
         "Vaqt kam qolganda haqiqiy odat ko'rinadi."],
        ["Ehtiyot bo'ling. Bu savolga yolg'on aytolmaysiz — men baribir ko'raman.",
         "Orzu\u2026 eng ochiq narsa. Odam o'zi bilmagan holda aytib qo'yadi."],
        ["Endi qiyinroq. Do'stlik va to'g'rilik har doim ham bir yo'ldan bormaydi.",
         "Bu yerda to'g'ri javob yo'q. Faqat sizniki bor."],
        ["Odam nimani o'rganishni tanlasa, nimaga aylanishni ham tanlaydi.",
         "Menga darsingizni ayting — men sizga o'zingizni aytaman."],
        ["Qo'rquv\u2026 hammada bor. Sizniki qaysi biri?",
         "Bu savolni ko'plar chetlab o'tishni istaydi. Siz ham shundaymi?"],
        ["Odamlar orasida turganingizda kim bo'lasiz? Yolg'iz qolganda emas — odamlar orasida.",
         "Deyarli tugadi. Yana ikkitasi."],
        ["Oxirgisi. Va eng og'iri — chunki bu javob qolganlarini yengib chiqishi mumkin.",
         "Bitta so'z tanlang. Ehtiyot bo'ling — men aynan shunga quloq solaman."]
      ],
      after: ["Hmm.", "Shunday deysizmi\u2026", "Ko'rdim.", "Qiziq. Buni yodda tutaman.",
              "Ha\u2026 bu ko'p narsani aytadi.", "Kutgan edim. Yoki kutmagandirman.",
              "Yaxshi. Davom etamiz.", "Ichingizda bundan ko'proq narsa bor."],
      think: ["Hmm\u2026 qiyin. Juda qiyin.",
              "Sizda jasorat ham, aql ham bor. Va yana nimadir\u2026",
              "Ha. Endi bildim."],
      place: "Sizning joyingiz —"
    },
    ru: {
      introTop: "Наденьте меня.",
      introMid: "Хм... любопытно. Весьма любопытно.",
      introBot: "Я повидала тысячи голов. А ваша\u2026 как ещё не открытая книга. Что ж, полистаем вместе.",
      ready: "Я готов",
      before: [
        ["Начнём. Ночь, лес и неизвестный звук. Что сильнее — любопытство или страх?",
         "Первый вопрос кажется простым. Обычно это не так."],
        ["Теперь взгляну на ваш порядок. Как человек работает — то и говорит, кто он.",
         "Когда времени мало, проступают настоящие привычки."],
        ["Осторожнее. Здесь солгать не выйдет — я всё равно увижу.",
         "Мечта\u2026 самое откровенное. Человек выдаёт себя, сам того не зная."],
        ["Теперь сложнее. Дружба и правота не всегда идут одной дорогой.",
         "Здесь нет верного ответа. Есть только ваш."],
        ["Что человек выбирает изучать — тем он и становится.",
         "Назовите свой предмет — и я назову вас."],
        ["Страх\u2026 есть у каждого. Каков ваш?",
         "Этот вопрос многие хотят обойти. Вы тоже?"],
        ["Кем вы становитесь среди людей? Не наедине с собой — среди людей.",
         "Почти закончили. Осталось два."],
        ["Последний. И самый весомый — этот ответ может перевесить всё остальное.",
         "Выберите одно слово. Осторожно — именно к нему я прислушаюсь."]
      ],
      after: ["Хм.", "Вот как\u2026", "Вижу.", "Любопытно. Запомню.",
              "Да\u2026 это многое говорит.", "Я ожидала. Или нет.",
              "Хорошо. Дальше.", "В вас есть больше, чем это."],
      think: ["Хм\u2026 непросто. Совсем непросто.",
              "В вас есть и смелость, и ум. И ещё что-то\u2026",
              "Да. Теперь я знаю."],
      place: "Ваше место —"
    },
    en: {
      introTop: "Put me on.",
      introMid: "Hmm... curious. Very curious indeed.",
      introBot: "I have seen a thousand minds. Yours, though\u2026 is a book yet unopened. Let us turn the pages together.",
      ready: "I'm ready",
      before: [
        ["Let us begin. Night, a forest, an unknown sound. Which is stronger — curiosity or fear?",
         "The first question seems simple. It rarely is."],
        ["Now, your method. How a person works tells me who they are.",
         "When time runs short, true habits surface."],
        ["Careful now. You cannot lie here — I will see it anyway.",
         "A wish is the most revealing thing. People give themselves away without meaning to."],
        ["Harder now. Friendship and rightness do not always walk the same road.",
         "There is no correct answer here. Only yours."],
        ["What a person chooses to study, they choose to become.",
         "Name your subject, and I will name you."],
        ["Fear\u2026 everyone carries one. Which is yours?",
         "Many would rather skip this one. Would you?"],
        ["Who do you become among others? Not alone — among others.",
         "Almost done. Two remain."],
        ["The last. And the heaviest — this answer may outweigh the rest.",
         "Choose one word. Careful — this is the one I listen to."]
      ],
      after: ["Hmm.", "Is that so\u2026", "I see.", "Curious. I shall remember that.",
              "Yes\u2026 that says a great deal.", "I expected as much. Or perhaps not.",
              "Good. Onward.", "There is more in you than that."],
      think: ["Hmm\u2026 difficult. Very difficult.",
              "There is courage here. And a fine mind. And something else\u2026",
              "Yes. Now I know."],
      place: "Your place is —"
    }
  };

  // O'qish vaqti matn uzunligiga qarab hisoblanadi.
  // Sekinroq kerak bo'lsa MS_PER_CHAR ni oshiring.
  var MS_BASE = 950;      // har qanday matn uchun eng kam qo'shimcha
  var MS_PER_CHAR = 52;   // har belgi uchun
  var MS_MIN = 1400;      // eng qisqa ko'rinish
  var MS_MAX = 3400;      // eng uzun ko'rinish

  function readMs(text) {
    var ms = MS_BASE + (text ? text.length : 0) * MS_PER_CHAR;
    if (ms < MS_MIN) { ms = MS_MIN; }
    if (ms > MS_MAX) { ms = MS_MAX; }
    return ms;
  }

  var T = {
    uz: { title:"Garri Potter", label:"Progress",
          next:"Keyingi film", seen:"Ko'rildi", download:"Yuklab olish", soon:"Tez orada",
          sending:"⏳ Yuborilmoqda…", sentTo:function(t){return t+" — botga yuborildi";}, undoBtn:"BEKOR QILISH", undone:"Bekor qilindi", undoFail:"Bekor qilib bo'lmadi", undoExpired:"Vaqti o'tdi — filmni chatdan o'zingiz o'chiring", notSubscribed:"🔒 Avval kanalga obuna bo'ling", notReadyMsg:"⏳ Bu film tez orada qo'shiladi", filmMissing:"😔 Bu filmni hozir yuborib bo'lmadi. Adminlar xabardor — tez orada tuzatamiz",
          profKicker:"Profil", profTitle:"Sehrgar", back:"Ortga",
          stats:"Tillar bo'yicha", total:"Jami ko'rilgan",
          houseLbl:"Fakultet", houseNote:"Saralanish testidan o'ting va fakultetingizni biling",
          cardTitle:"Saralovchi qalpoq sizni kutmoqda", cardSub:"8 ta savol — va fakultetingizni bilib olasiz", houseSet:"Saralovchi qalpoq qaroriga ko'ra",
          sortCta:"Saralanish", resort:"Qayta saralanish", step:function(a,b){return a+" / "+b;}, rvKicker:"Saralovchi qalpoq qaror qildi", rvDone:"Profilga o'tish", sortExit:"Chiqish",
          wandLbl:"Tayoqcha", wandNone:"Hali tanlanmagan", wandNote:"Ollivander do'koni sizni kutmoqda", wandCta:"Tayoqcha tanlash", wandAgain:"Qayta tanlash", wandAskAgain:"Tayoqchangiz o'zgarishi mumkin. Davom etasizmi?", wandKicker:"Ollivander tanladi", inch:"dyuym",
          ckHouse:"Fakultet", ckWand:"Tayoqcha", ckPatronus:"Patronus", wandMore:"Batafsil", detKicker:"Sizning tayoqchangiz", hWood:"Yog'och nima deydi", hCore:"O'zak nima deydi", hRare:"Kamyoblik", rareCore:"Shunday o'zak", rarePair:"Shunday tayoqcha", famousLbl:"Xuddi shunday tayoqcha",
          cupKicker:"Haftalik musobaqa", cupTitle:"Xogvarts kubogi", cupBack:"Ortga",
          cupDays:"%d kun", cupDay1:"%d kun", cupHours:"%d soat", cupHour1:"%d soat",
          cupLeftFmt:"%s qoldi", cupEnding:"tugamoqda",
          cupPlace:"%d-o'rin", cupPts:"ball",
          cupJoin:"Fakultetingizni aniqlang va musobaqada qatnashing",
          cupYourPts:"Sizning hissangiz", cupInHouse:"%s ichida",
          cupGateFirst:"Birinchi ballingizni oling — u darhol %s hisobiga qo'shiladi.",
          cupSortCta:"Saralanish",
          hallName:"%s zali", hallSub:"%a sehrgar \u00b7 %b tasi bu hafta faol",
          hallYou:"siz", hallWaiting:"Yana %d sehrgar saralangan, lekin bu hafta hali boshlamagan.",
          feedKick:"Xogvartsda", feedSorted:" %h ga saralandi",
          agoMin:"%d daqiqa", agoHour:"%d soat", agoDay:"%d kun",
          lockTitle:"Saralanish", lockYes:"Ha, boshlaymiz", lockNo:"Hozir emas",
          lockAsk:"Fakultetingiz umrbod qoladi — uni keyin o'zgartira olmaysiz. Xogvarts kubogida shu fakultet uchun kurashasiz. Tayyormisiz?",
          lockFinal:"Bu sizning fakultetingiz. Endi u o'zgarmaydi.",
          guest:"Mehmon", noTag:"Telegram orqali kiring" },
    ru: { title:"Гарри Поттер", label:"Прогресс",
          next:"Следующий фильм", seen:"Просмотрено", download:"Скачать", soon:"Скоро",
          sending:"⏳ Отправляется…", sentTo:function(t){return t+" — отправлено в бот";}, undoBtn:"ОТМЕНИТЬ", undone:"Отменено", undoFail:"Не удалось отменить", undoExpired:"Время истекло — удалите фильм из чата сами", notSubscribed:"🔒 Сначала подпишитесь на канал", notReadyMsg:"⏳ Этот фильм скоро появится", filmMissing:"😔 Сейчас не получилось отправить этот фильм. Админы уже знают — скоро исправим",
          profKicker:"Профиль", profTitle:"Волшебник", back:"Назад",
          stats:"По языкам", total:"Всего просмотрено",
          houseLbl:"Факультет", houseNote:"Пройдите распределение и узнайте свой факультет",
          cardTitle:"Распределяющая шляпа ждёт вас", cardSub:"8 вопросов — и вы узнаете свой факультет", houseSet:"По решению Распределяющей шляпы",
          sortCta:"Пройти распределение", resort:"Пройти заново", step:function(a,b){return a+" / "+b;}, rvKicker:"Распределяющая шляпа решила", rvDone:"К профилю", sortExit:"Выйти",
          wandLbl:"Палочка", wandNone:"Пока не выбрана", wandNote:"Лавка Олливандера ждёт вас", wandCta:"Выбрать палочку", wandAgain:"Выбрать заново", wandAskAgain:"Ваша палочка может измениться. Продолжить?", wandKicker:"Олливандер выбрал", inch:"дюйма",
          ckHouse:"Факультет", ckWand:"Палочка", ckPatronus:"Патронус", wandMore:"Подробнее", detKicker:"Ваша палочка", hWood:"Что говорит дерево", hCore:"Что говорит сердцевина", hRare:"Редкость", rareCore:"Такая сердцевина", rarePair:"Такая палочка", famousLbl:"Точно такая же палочка у",
          cupKicker:"Еженедельное соревнование", cupTitle:"Кубок Хогвартса", cupBack:"Назад",
          cupDays:"%d дн.", cupDay1:"%d день", cupHours:"%d ч.", cupHour1:"%d час",
          cupLeftFmt:"осталось %s", cupEnding:"завершается",
          cupPlace:"%d место", cupPts:"очков",
          cupJoin:"Определите факультет и участвуйте",
          cupYourPts:"Ваш вклад", cupInHouse:"На факультете %s",
          cupGateFirst:"Получите первые очки — они сразу пойдут в зачёт %s.",
          cupSortCta:"Пройти распределение",
          hallName:"Зал \u00ab%s\u00bb", hallSub:"%a волшебников \u00b7 %b активны на этой неделе",
          hallYou:"вы", hallWaiting:"Ещё %d волшебников распределены, но пока не начали на этой неделе.",
          feedKick:"В Хогвартсе", feedSorted:" \u2014 %h",
          agoMin:"%d мин", agoHour:"%d ч", agoDay:"%d дн",
          lockTitle:"Распределение", lockYes:"Да, начнём", lockNo:"Не сейчас",
          lockAsk:"Ваш факультет останется навсегда — изменить его будет нельзя. В Кубке Хогвартса вы будете бороться за него. Готовы?",
          lockFinal:"Это ваш факультет. Теперь он не изменится.",
          guest:"Гость", noTag:"Войдите через Telegram" },
    en: { title:"Harry Potter", label:"Progress",
          next:"Up next", seen:"Watched", download:"Download", soon:"Coming soon",
          sending:"⏳ Sending…", sentTo:function(t){return t+" — sent to the bot";}, undoBtn:"UNDO", undone:"Undone", undoFail:"Could not undo", undoExpired:"Too late — please delete the film from the chat yourself", notSubscribed:"🔒 Please subscribe to the channel first", notReadyMsg:"⏳ This film is coming soon", filmMissing:"😔 We couldn't send this film right now. The admins know — we'll fix it soon",
          profKicker:"Profile", profTitle:"Wizard", back:"Back",
          stats:"By language", total:"Total watched",
          houseLbl:"House", houseNote:"Take the test and discover your house",
          cardTitle:"The Sorting Hat awaits you", cardSub:"8 questions — and you will know your house", houseSet:"As decided by the Sorting Hat",
          sortCta:"Get sorted", resort:"Retake the test", step:function(a,b){return a+" / "+b;}, rvKicker:"The Sorting Hat has decided", rvDone:"Go to profile", sortExit:"Exit",
          wandLbl:"Wand", wandNone:"Not chosen yet", wandNote:"Ollivanders is waiting for you", wandCta:"Choose a wand", wandAgain:"Choose again", wandAskAgain:"Your wand may change. Continue?", wandKicker:"Ollivander has chosen", inch:"inches",
          ckHouse:"House", ckWand:"Wand", ckPatronus:"Patronus", wandMore:"Read more", detKicker:"Your wand", hWood:"What the wood says", hCore:"What the core says", hRare:"Rarity", rareCore:"This core", rarePair:"This wand", famousLbl:"The very same wand as",
          cupKicker:"Weekly contest", cupTitle:"The Hogwarts Cup", cupBack:"Back",
          cupDays:"%d days", cupDay1:"%d day", cupHours:"%d hours", cupHour1:"%d hour",
          cupLeftFmt:"%s left", cupEnding:"ending",
          cupPlace:"place %d", cupPts:"points",
          cupJoin:"Get sorted and join the contest",
          cupYourPts:"Your contribution", cupInHouse:"Within %s",
          cupGateFirst:"Earn your first points — they count for %s right away.",
          cupSortCta:"Get sorted",
          hallName:"%s hall", hallSub:"%a wizards \u00b7 %b active this week",
          hallYou:"you", hallWaiting:"%d more wizards are sorted but have not started this week.",
          feedKick:"At Hogwarts", feedSorted:" was sorted into %h",
          agoMin:"%d min", agoHour:"%d h", agoDay:"%d d",
          lockTitle:"Sorting", lockYes:"Yes, let's begin", lockNo:"Not now",
          lockAsk:"Your house stays for life — you will not be able to change it. You will compete for it in the Hogwarts Cup. Ready?",
          lockFinal:"This is your house. It will not change now.",
          guest:"Guest", noTag:"Open via Telegram" }
  };

  var LANG_GRADS = {
    uz: "linear-gradient(150deg,#8ec79b,#2f7346)",
    ru: "linear-gradient(150deg,#8fb0e0,#2f4f8f)",
    en: "linear-gradient(150deg,#e09090,#8f2f2f)"
  };

  // Fakultet aniqlanmaguncha — neytral kulrang.
  // Aniqlangach butun interfeys fakultet rangiga o'tadi.
  var HOUSES = {
    none:       { accent:"#97a1ae", accent2:"#5a6472", rgb:"151,161,174", ink:"#0e1117",
                  crest:"?", uz:"Hali aniqlanmagan", ru:"Пока не определён", en:"Not sorted yet" },
    gryffindor: { accent:"#d9524a", accent2:"#7d2420", rgb:"217,82,74",   ink:"#fff5f4", hi:"#f08c83",
                  crest:"🦁", img:"Gryffindor_crest.png",
                  uz:"Grifindor", ru:"Гриффиндор", en:"Gryffindor",
                  note_uz:"Jasorat, matonat va yurak amri bilan yashash — sizning yo'lingiz.",
                  note_ru:"Храбрость, стойкость и верность зову сердца — ваш путь.",
                  note_en:"Courage, nerve and following your heart — that is your way." },
    slytherin:  { accent:"#2fa36b", accent2:"#15533a", rgb:"47,163,107",  ink:"#04180e", hi:"#74d3a3",
                  crest:"🐍", img:"Slytherin_crest.png",
                  uz:"Sliterin", ru:"Слизерин", en:"Slytherin",
                  note_uz:"Maqsad, zukkolik va o'z yo'lini topa bilish — sizning kuchingiz.",
                  note_ru:"Амбиции, хитрость и умение найти свой путь — ваша сила.",
                  note_en:"Ambition, cunning and finding your own path — that is your strength." },
    ravenclaw:  { accent:"#5b8fd9", accent2:"#274a80", rgb:"91,143,217",  ink:"#06132b", hi:"#9dc0f2",
                  crest:"🦅", img:"Ravenclaw_crest.png",
                  uz:"Reyvenklo", ru:"Когтевран", en:"Ravenclaw",
                  note_uz:"Aql, izlanish va bilimga chanqoqlik — sizni yetaklaydi.",
                  note_ru:"Ум, любознательность и жажда знаний — вот что вас ведёт.",
                  note_en:"Wit, curiosity and a thirst for learning — these lead you." },
    hufflepuff: { accent:"#e8b93c", accent2:"#8a6a13", rgb:"232,185,60",  ink:"#1a1204", hi:"#f3d58f",
                  crest:"🦡", img:"Hufflepuff_crest.png",
                  uz:"Xaffelpaff", ru:"Пуффендуй", en:"Hufflepuff",
                  note_uz:"Sadoqat, mehnatsevarlik va adolat — sizning tayanchingiz.",
                  note_ru:"Верность, трудолюбие и справедливость — ваша опора.",
                  note_en:"Loyalty, hard work and fairness — these hold you up." }
  };

  function applyHouse(id) {
    var h = HOUSES[id] || HOUSES.none;
    var root = document.documentElement;
    if (!root || !root.style || !root.style.setProperty) { return; }
    root.style.setProperty("--accent", h.accent);
    root.style.setProperty("--accent-2", h.accent2);
    root.style.setProperty("--accent-rgb", h.rgb);
    root.style.setProperty("--accent-ink", h.ink);
    // Tilla bezaklar Xaffelpaff sarig'iga o'xshab adashtirmasin: fakultet bor bo'lsa
    // ular ham fakultet rangida. Saralanmaganlarda asl tilla qoladi.
    var gold = { "--gold": h.accent, "--gold-2": h.accent2, "--gold-hi": h.hi, "--gold-rgb": h.rgb, "--gold-ink": h.ink };
    for (var g in gold) {
      if (HOUSES[id] && id !== "none" && gold[g]) { root.style.setProperty(g, gold[g]); }
      else { root.style.removeProperty(g); }
    }
  }

  var LANGS = [
    { code:"uz", flag:"🇺🇿", name:"O'zbekcha", note:"UZ · Uzbek",   grad:LANG_GRADS.uz },
    { code:"ru", flag:"🇷🇺", name:"Русский",   note:"RU · Russian", grad:LANG_GRADS.ru },
    { code:"en", flag:"🇬🇧", name:"English",   note:"EN · English", grad:LANG_GRADS.en }
  ];

  function flagOf(code) {
    for (var i = 0; i < LANGS.length; i++) {
      if (LANGS[i].code === code) { return LANGS[i].flag; }
    }
    return "";
  }

  var lang = "uz";
  var house = "none";
  var wand = null;
  var watched = {};
  var cloudOk = false;

  function $(id) { return document.getElementById(id); }

  function list() {
    var out = [];
    for (var k in watched) { if (watched[k]) { out.push(k); } }
    return out;
  }

  // Progress har til uchun alohida: kalit "uz:hp1" ko'rinishida
  function key(id) { return lang + ":" + id; }

  // Eski format ("hp1,hp2") -> "uz:hp1,uz:hp2"
  function migrate(defLang) {
    var moved = 0;
    for (var k in watched) {
      if (k.indexOf(":") === -1) {
        delete watched[k];
        watched[defLang + ":" + k] = true;
        moved++;
      }
    }
    if (moved) { writeLocal(); }
    return moved;
  }
