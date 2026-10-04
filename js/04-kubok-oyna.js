/* Kubok oynasi: fakultetlar, ballar, zal, tarix, fakultet sahifasi
   Ilova kodi bir necha faylga bo'lingan; hammasi BIR umumiy maydonda ishlaydi
   va index.html dagi TARTIBDA yuklanadi. Yuklanish paytida keyingi fayldagi
   narsani chaqirmang - tekshiruv: tools/tartib.js */
"use strict";
  /* ---------- FAKULTETLAR HAQIDA (kitoblar asosida) ----------
     Ismlar ilovadagi boshqa matnlar bilan bir xil yozilgan: uz - savollardagi
     (Sneyp, Uizli, Slaggorn, Tom Ridl), ru - "Росмэн" tarjimasi (fakultet
     nomlari ham shundan: Когтевран, Пуффендуй). Har rol: [ism, izoh]. */
  var HOUSE_LORE = {
    gryffindor: {
      colors: ["#ae0001", "#d3a625"],
      uz: {
        traits: "Jasorat · matonat · olijanoblik", symbol: "Sher", element: "Olov", colors: "Qizil va oltin",
        founder: ["Godrik Grifindor", "Jasur duelchi. Uning qilichi haqiqiy grifindorlikka kerak bo'lganda Saralovchi qalpoqdan chiqadi."],
        head: ["Minerva Makgonagall", "Transfiguratsiya ustozi, maktab direktorining o'rinbosari."],
        ghost: ["Deyarli Boshsiz Nik", "Ser Nikolas de Mimsi-Porpington — boshi oxirigacha kesilmay qolgan."],
        captain: ["Oliver Vud", "1–3-kitoblarda. Keyin Anjelina Jonson (5) va Garri Potter (6)."],
        prefects: ["Persi Uizli", "Keyin maktabning Bosh o'quvchisi bo'ldi. 5-kitobdan — Ron Uizli va Germiona Greynjer."],
        room: "Grifindor minorasida. Kirish — Semiz xonim portreti ortida: parolni aytsangiz, portret ochiladi.",
        famous: ["Garri Potter", "Germiona Greynjer", "Ron Uizli", "Nevill Longbottom", "Jinni Uizli", "Jeyms va Lili Potter", "Sirius Blek"]
      },
      ru: {
        traits: "Храбрость · отвага · благородство", symbol: "Лев", element: "Огонь", colors: "Алый и золотой",
        founder: ["Годрик Гриффиндор", "Храбрый дуэлянт. Его меч появляется из Распределяющей шляпы, когда он нужен настоящему гриффиндорцу."],
        head: ["Минерва Макгонагалл", "Преподаёт трансфигурацию, заместитель директора школы."],
        ghost: ["Почти Безголовый Ник", "Сэр Николас де Мимси-Дельфингтон — голову ему отрубили не до конца."],
        captain: ["Оливер Вуд", "В 1–3 книгах. Затем Анджелина Джонсон (5) и Гарри Поттер (6)."],
        prefects: ["Перси Уизли", "Позже стал старостой школы. С 5-й книги — Рон Уизли и Гермиона Грейнджер."],
        room: "В башне Гриффиндора. Вход — за портретом Полной Дамы: назовите пароль, и портрет откроется.",
        famous: ["Гарри Поттер", "Гермиона Грейнджер", "Рон Уизли", "Невилл Долгопупс", "Джинни Уизли", "Джеймс и Лили Поттер", "Сириус Блэк"]
      },
      en: {
        traits: "Bravery · daring · chivalry", symbol: "Lion", element: "Fire", colors: "Scarlet and gold",
        founder: ["Godric Gryffindor", "A brave duellist. His sword comes out of the Sorting Hat when a true Gryffindor needs it."],
        head: ["Minerva McGonagall", "Transfiguration teacher and Deputy Headmistress."],
        ghost: ["Nearly Headless Nick", "Sir Nicholas de Mimsy-Porpington — his head was never quite cut off."],
        captain: ["Oliver Wood", "Books 1–3. Then Angelina Johnson (5) and Harry Potter (6)."],
        prefects: ["Percy Weasley", "Later Head Boy. From book 5 — Ron Weasley and Hermione Granger."],
        room: "In Gryffindor Tower. The entrance is behind the portrait of the Fat Lady: say the password and she swings open.",
        famous: ["Harry Potter", "Hermione Granger", "Ron Weasley", "Neville Longbottom", "Ginny Weasley", "James and Lily Potter", "Sirius Black"]
      }
    },
    slytherin: {
      colors: ["#1a472a", "#aaaaaa"],
      uz: {
        traits: "Maqsad · zukkolik · tadbirkorlik", symbol: "Ilon", element: "Suv", colors: "Yashil va kumush",
        founder: ["Salazar Sliterin", "Ilonlar tilini bilgan. Qasr ichida Maxfiy hujrani yashirincha qurib ketgan."],
        head: ["Severus Sneyp", "Iksirlar ustozi. 7-kitobda mudirlik Horas Slaggornga o'tadi."],
        ghost: ["Qonli Baron", "Kiyimi kumushrang qon dog'lari bilan qoplangan. Hatto Pivz ham undan qo'rqadi."],
        captain: ["Markus Flint", "1–3-kitoblarda. 5-kitobda — Grexem Montegyu."],
        prefects: ["Drako Malfoy va Pensi Parkinson", "5-kitobdan boshlab."],
        room: "Zindonlarda, Qora ko'l ostida — derazalardan ko'l suvi ko'rinadi, xona yashil tusda tovlanadi. Kirish — tosh devordagi yashirin eshik, parol bilan.",
        famous: ["Tom Ridl (Voldemort)", "Severus Sneyp", "Horas Slaggorn", "Drako Malfoy", "Krabb va Goyl"]
      },
      ru: {
        traits: "Амбиции · хитрость · находчивость", symbol: "Змея", element: "Вода", colors: "Зелёный и серебряный",
        founder: ["Салазар Слизерин", "Владел змеиным языком. Тайно построил в замке Тайную комнату."],
        head: ["Северус Снегг", "Преподаёт зельеварение. В 7-й книге деканом становится Гораций Слизнорт."],
        ghost: ["Кровавый Барон", "Его одежда в серебристых пятнах крови. Даже Пивз его боится."],
        captain: ["Маркус Флинт", "В 1–3 книгах. В 5-й — Грэхэм Монтегю."],
        prefects: ["Драко Малфой и Пэнси Паркинсон", "С 5-й книги."],
        room: "В подземельях, под Чёрным озером — в окнах видна вода, комната светится зелёным. Вход — потайная дверь в каменной стене, по паролю.",
        famous: ["Том Реддл (Волан-де-Морт)", "Северус Снегг", "Гораций Слизнорт", "Драко Малфой", "Крэбб и Гойл"]
      },
      en: {
        traits: "Ambition · cunning · resourcefulness", symbol: "Serpent", element: "Water", colors: "Green and silver",
        founder: ["Salazar Slytherin", "A Parselmouth. He secretly built the Chamber of Secrets inside the castle."],
        head: ["Severus Snape", "Potions master. In book 7 Horace Slughorn takes over the house."],
        ghost: ["The Bloody Baron", "His robes are stained with silver blood. Even Peeves is afraid of him."],
        captain: ["Marcus Flint", "Books 1–3. In book 5 — Graham Montague."],
        prefects: ["Draco Malfoy and Pansy Parkinson", "From book 5."],
        room: "In the dungeons, under the Black Lake — the windows look into the water and the room glows green. The entrance is a hidden door in a stone wall, opened by password.",
        famous: ["Tom Riddle (Voldemort)", "Severus Snape", "Horace Slughorn", "Draco Malfoy", "Crabbe and Goyle"]
      }
    },
    ravenclaw: {
      colors: ["#222f5b", "#946b2d"],
      uz: {
        traits: "Aql · donolik · ijodkorlik", symbol: "Burgut", element: "Havo", colors: "Ko'k va bronza",
        founder: ["Rovena Reyvenklo", "O'z davrining eng aqlli sehrgar ayoli. Uning yo'qolgan diademasi taqqanga donolik berardi."],
        head: ["Filius Flitvik", "Afsunlar ustozi. Bo'yi kichkina, lekin kuchli duelchi."],
        ghost: ["Kulrang xonim", "Aslida Xelena Reyvenklo — asoschining qizi. Diadema sirini Garriga aynan u aytgan."],
        captain: ["Rojer Devis", "4–5-kitoblarda. Yul balida Fler Delakur bilan raqsga tushgan."],
        prefects: ["Padma Patil va Entoni Goldsteyn", "5-kitobdan. Ulardan oldin — Penelopa Klirvoter."],
        room: "Reyvenklo minorasida. Parol yo'q: burgut shaklidagi bronza taqillatgich topishmoq so'raydi — to'g'ri javob bergan kiradi.",
        famous: ["Luna Lavgud", "Cho Chang", "Padma Patil", "Terri But", "Maykl Korner"]
      },
      ru: {
        traits: "Ум · мудрость · творчество", symbol: "Орёл", element: "Воздух", colors: "Синий и бронзовый",
        founder: ["Кандида Когтевран", "Самая умная волшебница своего времени. Её утерянная диадема дарила мудрость."],
        head: ["Филиус Флитвик", "Преподаёт заклинания. Маленького роста, но сильный дуэлянт."],
        ghost: ["Серая Дама", "На самом деле Елена Когтевран, дочь основательницы. Именно она открыла Гарри тайну диадемы."],
        captain: ["Роджер Дэвис", "В 4–5 книгах. На Святочном балу танцевал с Флёр Делакур."],
        prefects: ["Падма Патил и Энтони Голдстейн", "С 5-й книги. До них — Пенелопа Кристалл."],
        room: "В башне Когтеврана. Пароля нет: бронзовый молоток в виде орла задаёт загадку — войдёт тот, кто ответит.",
        famous: ["Полумна Лавгуд", "Чжоу Чанг", "Падма Патил", "Терри Бут", "Майкл Корнер"]
      },
      en: {
        traits: "Wit · wisdom · creativity", symbol: "Eagle", element: "Air", colors: "Blue and bronze",
        founder: ["Rowena Ravenclaw", "The cleverest witch of her age. Her lost diadem granted wisdom to whoever wore it."],
        head: ["Filius Flitwick", "Charms teacher. Tiny, but a formidable duellist."],
        ghost: ["The Grey Lady", "Really Helena Ravenclaw, the founder's daughter. She told Harry the secret of the diadem."],
        captain: ["Roger Davies", "Books 4–5. He took Fleur Delacour to the Yule Ball."],
        prefects: ["Padma Patil and Anthony Goldstein", "From book 5. Before them — Penelope Clearwater."],
        room: "In Ravenclaw Tower. There is no password: a bronze eagle knocker asks a riddle, and whoever answers may enter.",
        famous: ["Luna Lovegood", "Cho Chang", "Padma Patil", "Terry Boot", "Michael Corner"]
      }
    },
    hufflepuff: {
      colors: ["#ecb939", "#000000"],
      uz: {
        traits: "Mehnatsevarlik · sadoqat · adolat", symbol: "Bo'rsiq", element: "Yer", colors: "Sariq va qora",
        founder: ["Xelga Xaffelpaff", "Hech kimni ajratmay, hammani o'qitgan. Uning oltin kosasi keyin Voldemort qo'liga tushgan."],
        head: ["Pomona Spraut", "O'simlikshunoslik ustozi. 2-kitobda mandragora o'stirib, toshga aylanganlarni qutqargan."],
        ghost: ["Semiz rohib", "Xushchaqchaq arvoh — hammani, hatto Pivzni ham kechirishga tayyor."],
        captain: ["Sedrik Diggori", "3-kitobda sardor va izlovchi — Grifindorni yenggan."],
        prefects: ["Erni Makmillan va Xanna Ebbot", "5-kitobdan. Ulardan oldin — Sedrik Diggori."],
        room: "Oshxona yaqinida, yerto'lada. Kirish — bochkalar uyumi ortida: kerakli bochkani maxsus ritmda taqillatish kerak.",
        famous: ["Sedrik Diggori", "Nyut Skamander («Fantastik maxluqlar»)", "Xanna Ebbot", "Erni Makmillan", "Jastin Finch-Fletchli", "Syuzan Bouns"]
      },
      ru: {
        traits: "Трудолюбие · верность · справедливость", symbol: "Барсук", element: "Земля", colors: "Жёлтый и чёрный",
        founder: ["Пенелопа Пуффендуй", "Принимала всех без разбора. Её золотая чаша позже попала к Волан-де-Морту."],
        head: ["Помона Стебль", "Преподаёт травологию. Во 2-й книге вырастила мандрагоры и спасла окаменевших."],
        ghost: ["Толстый Монах", "Добродушное привидение — готов простить всех, даже Пивза."],
        captain: ["Седрик Диггори", "В 3-й книге — капитан и ловец, обыграл Гриффиндор."],
        prefects: ["Эрни Макмиллан и Ханна Аббот", "С 5-й книги. До них — Седрик Диггори."],
        room: "Рядом с кухней, в подвале. Вход — за штабелем бочек: нужную бочку надо простучать в особом ритме.",
        famous: ["Седрик Диггори", "Ньют Скамандер («Фантастические твари»)", "Ханна Аббот", "Эрни Макмиллан", "Джастин Финч-Флетчли", "Сьюзен Боунс"]
      },
      en: {
        traits: "Hard work · loyalty · fair play", symbol: "Badger", element: "Earth", colors: "Yellow and black",
        founder: ["Helga Hufflepuff", "She took in every student. Her golden cup later fell into Voldemort's hands."],
        head: ["Pomona Sprout", "Herbology teacher. In book 2 she grew the Mandrakes that saved the petrified."],
        ghost: ["The Fat Friar", "A cheerful ghost, ready to forgive everyone — even Peeves."],
        captain: ["Cedric Diggory", "Book 3 — captain and Seeker, beat Gryffindor."],
        prefects: ["Ernie Macmillan and Hannah Abbott", "From book 5. Before them — Cedric Diggory."],
        room: "Near the kitchens, in the basement. The entrance hides behind a stack of barrels: tap the right one in a special rhythm.",
        famous: ["Cedric Diggory", "Newt Scamander (Fantastic Beasts)", "Hannah Abbott", "Ernie Macmillan", "Justin Finch-Fletchley", "Susan Bones"]
      }
    }
  };

  /* ---------- ball manbalari ----------
     Kalitlar serverdagi hpcup.SOURCE_KEYS bilan bir xil. Ranglar rang ko'rlikka
     tekshirilgan (qo'shni juftlar ajraladi), belgi har doim rang yonida turadi. */
  var SRC_ICON = {
    film: '<path d="M4 5h16v14H4z M8 5v14 M16 5v14 M4 9.5h4 M4 14.5h4 M16 9.5h4 M16 14.5h4"/>',
    exam: '<path d="M7 3.5h8l3.5 3.5v13.5h-11.5z M15 3.5v3.5h3.5 M10 11h5.5 M10 14.5h5.5 M10 18h3"/>',
    daily: '<path d="M4.5 6h15v14h-15z M4.5 10h15 M8.5 3.5v4 M15.5 3.5v4"/><circle cx="12" cy="15" r="1.6" fill="currentColor" stroke="none"/>',
    chess: '<path d="M12 3.8a2.4 2.4 0 1 1 0 4.8a2.4 2.4 0 1 1 0-4.8z M9.6 10.8h4.8 M10.4 10.8l-.9 5.6h5l-.9-5.6 M7.3 20.3h9.4l-1.1-3.9H8.4z"/>',
    friends: '<circle cx="9" cy="8.5" r="3"/><path d="M3.5 19.5c0-3.1 2.5-5.5 5.5-5.5s5.5 2.4 5.5 5.5 M15.8 6.2a2.6 2.6 0 1 1 0 5.2 M17 14.2c2.3.5 3.8 2.6 3.8 5"/>'
  };
  var CUP_SRC = [
    { key: "film",    color: "#3987e5" },
    // "exam" (kino imtihoni) 2026-10-04 da olib tashlandi - kubok muvozanatini buzardi
    { key: "daily",   color: "#199e70" },
    { key: "chess",   color: "#9085e9" },
    { key: "friends", color: "#c98500" }
  ];

  // Fakultet sahifasidagi rollar belgilari
  var ROLE_ICON = {
    founder: '<path d="M12 3l7 3v5.2c0 4.3-3 7.9-7 9.8c-4-1.9-7-5.5-7-9.8V6z M12 8v7 M9 11h6"/>',
    head: '<path d="M2.5 9.5L12 5l9.5 4.5L12 14z M6.5 11.5v4.3c0 1.3 2.5 2.7 5.5 2.7s5.5-1.4 5.5-2.7v-4.3 M21.5 9.5v5"/>',
    ghost: '<path d="M6 20.5V10.5a6 6 0 0 1 12 0v10l-2-1.6-2 1.6-2-1.6-2 1.6-2-1.6z"/><ellipse cx="9.8" cy="10.6" rx="1.1" ry="1.5" fill="currentColor" stroke="none"/><ellipse cx="14.2" cy="10.6" rx="1.1" ry="1.5" fill="currentColor" stroke="none"/><ellipse cx="12" cy="14.6" rx="1" ry="1.3"/>',
    captain: '<path d="M20.5 3.5l-9.6 9.6 M9.2 11.6l3.2 3.2 M10.6 13.4C8.2 12.9 5 15 3.5 20.5c5.5-1.5 7.6-4.7 7.1-7.1z M7.3 16.8l-2.2 2.2 M9 17.6l-1.4 1.8"/>',
    prefects: '<path d="M12 3.2l2.5 5 5.5.8-4 3.9.9 5.5-4.9-2.6-4.9 2.6.9-5.5-4-3.9 5.5-.8z"/>',
    room: '<path d="M5.5 11V8a3 3 0 0 1 3-3h7a3 3 0 0 1 3 3v3 M3.5 12.5a1.5 1.5 0 0 1 3 0V15h11v-2.5a1.5 1.5 0 0 1 3 0V18h-17z M6 18v2 M18 18v2"/>',
    famous: '<path d="M12 3.5l1.7 4.3 4.3 1.7-4.3 1.7L12 15.5l-1.7-4.3L6 9.5l4.3-1.7z M18.5 14.5l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8z M5.5 15.5l.6 1.4 1.4.6-1.4.6-.6 1.4-.6-1.4-1.4-.6 1.4-.6z"/>'
  };
  var CUP_TROPHY =
    '<svg viewBox="0 0 48 48" fill="none" aria-hidden="true">' +
      '<path d="M15 7h18v9.5c0 5.2-4 9.5-9 9.5s-9-4.3-9-9.5z" fill="url(#cupGold)" stroke="#f3d58f" stroke-width="1.2"/>' +
      '<path d="M15 10.5H9.5c0 5 2.6 8 6.8 8.6 M33 10.5h5.5c0 5-2.6 8-6.8 8.6" stroke="#e0b25b" stroke-width="2" stroke-linecap="round"/>' +
      '<path d="M24 26v6 M18.5 40.5h11 M20 32h8l1.6 8.5H18.4z" stroke="#e0b25b" stroke-width="2" stroke-linejoin="round" fill="rgba(224,178,91,.18)"/>' +
      '<path d="M24 11.2l1.3 2.7 3 .4-2.2 2.1.5 3-2.6-1.4-2.6 1.4.5-3-2.2-2.1 3-.4z" fill="#fff6dc" opacity=".9"/>' +
      '<defs><linearGradient id="cupGold" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f6dc98"/><stop offset="1" stop-color="#b8862f"/></linearGradient></defs>' +
    '</svg>';

  function svgIcon(paths, cls) {
    return '<svg class="' + (cls || "") + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" ' +
           'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + paths + '</svg>';
  }

  var CUP_T = {
    uz: {
      src: { film: "Kino", exam: "Imtihon", daily: "Kunlik savol", chess: "Shaxmat", friends: "Do'stlar" },
      rule: { film: "Har film uchun +5 · mavsumda bir marta", exam: "Har to'g'ri javob uchun +10",
              daily: "Kuniga bitta savol · +10", chess: "Jonli g'alaba +10 · durang +5 · 5 o'yin",
              friends: "Har do'st uchun +20 · cheklanmagan" },
      histKick: "Xogvarts kubogi", histTitle: "Kubok tarixi", histLink: "Kubok tarixi", histAll: "Barcha haftalar tarixi",
      histWins: "Kim nechta kubok olgan", cups: "kubok", week: "%d-hafta", live: "Davom etmoqda",
      winner: "G'olib", leading: "Hozir oldinda", noWinner: "G'olib yo'q", noWinnerZero: "Bu hafta hech bir fakultet ball to'plamadi.", noWinnerSet: "Bu hafta g'olib e'lon qilinmagan.",
      best: "Haftaning sehrgari", bestLive: "Hozircha eng ko'p ball",
      months: ["yan", "fev", "mar", "apr", "may", "iyun", "iyul", "avg", "sen", "okt", "noy", "dek"],
      srcKick: "Ballar qayerdan keldi", srcNote: "Shu hafta ball to'plagan har bir sehrgarning ballari.",
      tapHint: "Fakultetni bosing — asoschisi, mudiri, arvohi va a'zolari",
      prevWin: "O'tgan hafta kubogi: %s", place: "%d-o'rin", total: "Jami", none: "Bu hafta hali ball yo'q",
      tasksT: "Vazifalar", tasksS: "Kunlik savol", tasksNew: "%d ta yangi", tasksDone: "Bajarildi",
      chatT: "Umumiy xona", chatS: "Fakultetdoshlar bilan suhbat",
      chessT: "Sehrgar shaxmati", chessS: "Botlar va do'stlar bilan jang",
      refsS: "Taklif qiling — darajangiz oshadi",
      about: "Fakultet haqida",
      hKick: "Xogvarts fakulteti", hSymbol: "Ramzi", hElement: "Unsuri", hColors: "Ranglari",
      hCup: "Bu haftaki kubokda", hActive: "%d faol a'zo", hPeople: "Fakultet ahli",
      founder: "Asoschisi", head: "Mudiri", ghost: "Arvohi", captain: "Kvidich sardori", prefects: "Prefektlar",
      room: "Umumiy xonasi", famous: "Mashhur a'zolari", members: "Bu haftaning a'zolari",
      showAll: "Hammasini ko'rish (%d)", loading: "Yuklanmoqda…", empty: "Bu hafta hali hech kim ball to'plamagan.",
      lore: "Ma'lumotlar J. K. Rouling kitoblari va uning rasmiy yozuvlari asosida.",
      rulesKick: "Kubok qoidalari",
      rules: ["Mavsum — bir hafta: dushanba 00:00 dan yakshanba 23:59 gacha (Toshkent vaqti).",
              "Fakultet bali — a'zolari to'plagan barcha ballar yig'indisi: har bir ball hisobga kiradi.",
              "Hafta oxirida eng ko'p ball to'plagan fakultet kubokni oladi.",
              "Do'st taklifidan boshqa manbalarning mavsumdagi chegarasi bor — jami 160 ball.",
              "Bot bilan shaxmat ball bermaydi — faqat jonli raqib bilan o'yin."]
    },
    ru: {
      src: { film: "Кино", exam: "Экзамены", daily: "Вопрос дня", chess: "Шахматы", friends: "Друзья" },
      rule: { film: "+5 за каждый фильм · раз в сезон", exam: "+10 за каждый верный ответ",
              daily: "Один вопрос в день · +10", chess: "Победа +10 · ничья +5 · 5 партий",
              friends: "+20 за каждого друга · без лимита" },
      histKick: "Кубок Хогвартса", histTitle: "История кубка", histLink: "История кубка", histAll: "История всех недель",
      histWins: "Сколько кубков у факультетов", cups: "кубк.", week: "Неделя %d", live: "Идёт сейчас",
      winner: "Победитель", leading: "Сейчас впереди", noWinner: "Без победителя", noWinnerZero: "На этой неделе ни один факультет не набрал очков.", noWinnerSet: "Победитель этой недели не объявлялся.",
      best: "Волшебник недели", bestLive: "Пока больше всех",
      months: ["янв", "фев", "мар", "апр", "мая", "июн", "июл", "авг", "сен", "окт", "ноя", "дек"],
      srcKick: "Откуда очки", srcNote: "Очки всех волшебников, набравших баллы на этой неделе.",
      tapHint: "Нажмите на факультет — основатель, декан, привидение и участники",
      prevWin: "Кубок прошлой недели: %s", place: "%d место", total: "Всего", none: "На этой неделе очков пока нет",
      tasksT: "Задания", tasksS: "Вопрос дня", tasksNew: "%d новых", tasksDone: "Готово",
      chatT: "Гостиная", chatS: "Беседа с однокурсниками",
      chessT: "Волшебные шахматы", chessS: "Бои с ботами и друзьями",
      refsS: "Приглашайте — растёт уровень",
      about: "О факультете",
      hKick: "Факультет Хогвартса", hSymbol: "Символ", hElement: "Стихия", hColors: "Цвета",
      hCup: "В кубке этой недели", hActive: "%d активных", hPeople: "Люди факультета",
      founder: "Основатель", head: "Декан", ghost: "Привидение", captain: "Капитан по квиддичу", prefects: "Старосты",
      room: "Гостиная", famous: "Известные ученики", members: "Участники этой недели",
      showAll: "Показать всех (%d)", loading: "Загрузка…", empty: "На этой неделе очков пока ни у кого нет.",
      lore: "По книгам Дж. К. Роулинг и её официальным материалам.",
      rulesKick: "Правила кубка",
      rules: ["Сезон длится неделю: с понедельника 00:00 до воскресенья 23:59 (по Ташкенту).",
              "Очки факультета — сумма очков всех его участников: засчитывается каждое очко.",
              "В конце недели кубок получает факультет с наибольшей суммой.",
              "У всех источников, кроме приглашений, есть лимит за сезон — всего 160 очков.",
              "Игра с ботом очков не даёт — только партии с живым соперником."]
    },
    en: {
      src: { film: "Films", exam: "Exams", daily: "Daily", chess: "Chess", friends: "Friends" },
      rule: { film: "+5 per film · once a season", exam: "+10 per correct answer",
              daily: "One question a day · +10", chess: "Live win +10 · draw +5 · 5 games",
              friends: "+20 per friend · no limit" },
      histKick: "The Hogwarts Cup", histTitle: "Cup history", histLink: "Cup history", histAll: "Every week's results",
      histWins: "Cups won by each house", cups: "cups", week: "Week %d", live: "In progress",
      winner: "Winner", leading: "Leading now", noWinner: "No winner", noWinnerZero: "No house scored any points this week.", noWinnerSet: "No winner was announced this week.",
      best: "Wizard of the week", bestLive: "Top scorer so far",
      months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      srcKick: "Where the points come from", srcNote: "Points of every wizard who scored this week.",
      tapHint: "Tap a house — its founder, head, ghost and members",
      prevWin: "Last week's cup: %s", place: "#%d", total: "Total", none: "No points yet this week",
      tasksT: "Tasks", tasksS: "Daily question", tasksNew: "%d new", tasksDone: "Done",
      chatT: "Common room", chatS: "Chat with your housemates",
      chessT: "Wizard chess", chessS: "Duel bots and friends",
      refsS: "Invite friends and rank up",
      about: "About the house",
      hKick: "Hogwarts house", hSymbol: "Emblem", hElement: "Element", hColors: "Colours",
      hCup: "In this week's cup", hActive: "%d active", hPeople: "House figures",
      founder: "Founder", head: "Head of House", ghost: "House ghost", captain: "Quidditch captain", prefects: "Prefects",
      room: "Common room", famous: "Famous members", members: "Members this week",
      showAll: "Show all (%d)", loading: "Loading…", empty: "Nobody has scored yet this week.",
      lore: "Based on J.K. Rowling's books and her official writing.",
      rulesKick: "Cup rules",
      rules: ["A season is one week: Monday 00:00 to Sunday 23:59 (Tashkent time).",
              "A house's score is the sum of all its members' points — every point counts.",
              "At the end of the week the house with the most points wins the cup.",
              "Every source except inviting friends has a season cap — 160 points in total.",
              "Chess against a bot gives no points — only live games do."]
    }
  };

  function cupT() { return CUP_T[lang] || CUP_T.uz; }

  // "#3987e5" -> "rgba(57,135,229,.16)" (color-mix eski Android'da yo'q)
  function hexA(hex, a) {
    var n = parseInt(String(hex).slice(1), 16);
    return "rgba(" + (n >> 16 & 255) + "," + (n >> 8 & 255) + "," + (n & 255) + "," + a + ")";
  }

  function cupEl(tag, cls, text) {
    var el = document.createElement(tag);
    if (cls) { el.className = cls; }
    if (text !== undefined && text !== null) { el.textContent = text; }
    return el;
  }

  function srcSum(by) {
    var s = 0;
    CUP_SRC.forEach(function (x) { s += (by && by[x.key]) || 0; });
    return s;
  }

  // Ustma-ust chiziq: har manba o'z rangida, oralarida 2px bo'shliq.
  // width - chiziqning umumiy uzunligi (%), shunda fakultetlar solishtiriladi.
  function srcBar(by, width, cls) {
    var bar = cupEl("div", "src-bar" + (cls ? " " + cls : ""));
    var sum = srcSum(by);
    var inner = cupEl("div", "src-bar-in");
    inner.style.width = Math.max(0, Math.min(100, width)) + "%";
    if (sum > 0) {
      CUP_SRC.forEach(function (x) {
        var v = (by && by[x.key]) || 0;
        if (!v) { return; }
        var seg = cupEl("i");
        seg.style.flexGrow = v;
        seg.style.background = x.color;
        seg.title = cupT().src[x.key] + ": " + v;
        inner.appendChild(seg);
      });
    }
    bar.appendChild(inner);
    return bar;
  }

  // Kichik belgilar: faqat ball bor manbalar ("🎞 35  📅 60")
  function srcChips(by) {
    var box = cupEl("span", "src-chips");
    CUP_SRC.forEach(function (x) {
      var v = (by && by[x.key]) || 0;
      if (!v) { return; }
      var chip = cupEl("span", "src-chip");
      chip.title = cupT().src[x.key];
      chip.innerHTML = svgIcon(SRC_ICON[x.key]);
      chip.firstChild.style.color = x.color;
      chip.appendChild(document.createTextNode(String(v)));
      box.appendChild(chip);
    });
    return box;
  }

  function srcLegend() {
    var row = cupEl("div", "src-legend");
    var c = cupT();
    CUP_SRC.forEach(function (x) {
      var cell = cupEl("span", "src-leg");
      cell.innerHTML = svgIcon(SRC_ICON[x.key]);
      cell.firstChild.style.color = x.color;
      cell.appendChild(cupEl("span", "", c.src[x.key]));
      row.appendChild(cell);
    });
    return row;
  }

  /* ---------- qum soatlari ---------- */

  function renderGlasses(list, me) {
    var box = $("cup-glasses");
    box.innerHTML = "";
    var t = T[lang];

    var top = 0, i;
    for (i = 0; i < list.length; i++) {
      if ((list[i].total_points || 0) > top) { top = list[i].total_points; }
    }

    list.forEach(function (row, idx) {
      var h = HOUSES[row.house] || {};
      var cell = document.createElement("button");
      cell.type = "button";
      cell.className = "glass" + (row.house === me.house ? " mine" : "") +
                       (row.qualified ? "" : " out") + (idx === 0 && top > 0 ? " lead" : "");
      cell.style.setProperty("--hc", h.accent || "#97a1ae");
      cell.style.setProperty("--hc-rgb", h.rgb || "151,161,174");
      cell.addEventListener("click", function () { openHouse(row.house); });

      var tube = document.createElement("div");
      tube.className = "tube";

      // Minimal to'ldirish gerbni to'liq sig'diradigan balandlikda bo'lishi
      // shart (34px gerb). Shkalada quyi chegara bor: yetakchi SCALE_FLOOR
      // dan past bo'lsa, balandlik o'sha chegaraga nisbatan hisoblanadi -
      // aks holda mavsum boshida naycha "to'lib" ketgandek ko'rinardi.
      var scale = Math.max(top, SCALE_FLOOR);
      var pct = Math.round((row.total_points || 0) / scale * 78);
      var fill = document.createElement("span");
      fill.className = "tube-fill";
      fill.style.height = Math.max(MIN_FILL, pct) + "%";
      tube.appendChild(fill);

      var crest = document.createElement("span");
      crest.className = "tube-crest";
      var img = cupCrestImg(row.house, 26);
      if (img) { crest.appendChild(img); }
      else { crest.textContent = h.crest || "?"; }
      tube.appendChild(crest);

      // O'rin belgisi: yetakchiga toj
      var place = cupEl("span", "g-place", String(idx + 1));
      if (idx === 0 && top > 0) {
        place.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 18h16l1-10-5 4-4-7-4 7-5-4z" fill="currentColor"/></svg>';
      }
      tube.appendChild(place);
      cell.appendChild(tube);

      var nm = document.createElement("span");
      nm.className = "g-name";
      nm.textContent = cupHouseName(row.house);
      cell.appendChild(nm);

      var val = document.createElement("span");
      val.className = "g-val";
      val.textContent = cupPts(row.total_points);
      cell.appendChild(val);

      cell.appendChild(cupEl("span", "g-need", cupT().hActive.replace("%d", row.active_members || 0)));
      box.appendChild(cell);
    });
  }

  /* ---------- ballar qayerdan keldi ---------- */

  function renderSources(list) {
    var box = $("cup-src");
    if (!box) { return; }
    var c = cupT();
    box.innerHTML = "";

    var head = cupEl("div", "cc-head");
    head.appendChild(cupEl("span", "cc-kick", c.srcKick));
    box.appendChild(head);
    box.appendChild(cupEl("p", "cc-note", c.srcNote));
    box.appendChild(srcLegend());

    var top = 0;
    list.forEach(function (r) { if ((r.total_points || 0) > top) { top = r.total_points || 0; } });

    list.forEach(function (r, idx) {
      var hh = HOUSES[r.house] || {};
      var by = r.by || {};
      var row = cupEl("button", "src-row");
      row.type = "button";
      row.addEventListener("click", function () { openHouse(r.house); });

      var line = cupEl("span", "src-row-top");
      var crest = cupEl("span", "src-crest");
      crest.style.background = "rgba(" + (hh.rgb || "151,161,174") + ",.14)";
      var im = cupCrestImg(r.house, 18);
      if (im) { crest.appendChild(im); }
      line.appendChild(crest);
      var nm = cupEl("span", "src-name", cupHouseName(r.house));
      nm.appendChild(cupEl("em", "", T[lang].cupPlace.replace("%d", idx + 1)));
      line.appendChild(nm);
      var tot = cupEl("b", "src-total", cupPts(r.total_points));
      line.appendChild(tot);
      row.appendChild(line);

      if (srcSum(by) > 0) {
        row.appendChild(srcBar(by, top ? (r.total_points || 0) / top * 100 : 0));
        var nums = cupEl("span", "src-nums");
        CUP_SRC.forEach(function (x) {
          var v = by[x.key] || 0;
          var n = cupEl("span", v ? "" : "zero", v ? String(v) : "—");
          nums.appendChild(n);
        });
        row.appendChild(nums);
      } else {
        row.appendChild(cupEl("span", "src-empty", c.none));
      }
      box.appendChild(row);
    });
  }

  /* ---------- fakultet zali va jonli tasma ---------- */

  // Ism va fakultetdan barqaror rang: bir odam har safar bir xil doira oladi.
  function faceColor(name, houseId) {
    var hh = HOUSES[houseId] || {};
    if (hh.accent) { return hh.accent; }
    var s = String(name || "?"), n = 0;
    for (var i = 0; i < s.length; i++) { n = (n * 31 + s.charCodeAt(i)) % 360; }
    return "hsl(" + n + ",42%,66%)";
  }

  // Telegram ismlarida emoji tez uchraydi. charAt(0) emojini ikkiga bo'lib
  // buzuq belgi chiqaradi, shuning uchun avval birinchi HARFNI qidiramiz.
  function initialOf(name) {
    var s = String(name || "").trim();
    if (!s) { return "?"; }
    var letter = s.match(/[\p{L}\p{N}]/u);
    if (letter) { return letter[0].toUpperCase(); }
    return "?";
  }

  function faceEl(cls, name, houseId) {
    var el = document.createElement("span");
    el.className = cls;
    el.textContent = initialOf(name);
    el.style.background = faceColor(name, houseId);
    return el;
  }

  // "45 daqiqa" / "3 soat" / "2 kun"
  function agoText(mins, t) {
    var m = Number(mins);
    if (!isFinite(m) || m < 0) { return ""; }
    if (m < 60) { return t.agoMin.replace("%d", Math.max(1, Math.round(m))); }
    if (m < 1440) { return t.agoHour.replace("%d", Math.round(m / 60)); }
    return t.agoDay.replace("%d", Math.round(m / 1440));
  }

  // A'zo qatori: o'rni, ism, ball va uning qayerdan kelgani
  function memberRow(m, idx, houseId) {
    var t = T[lang];
    var hh = HOUSES[houseId] || {};
    var row = cupEl("div", "hall-row" + (m.active === false ? " idle" : ""));
    row.appendChild(cupEl("div", "hall-pos", String(idx + 1)));
    row.appendChild(faceEl("hall-face", m.name, houseId));

    var who = cupEl("div", "hall-nm");
    var nm = cupEl("span", "hall-nm-t", m.name || "");
    if (m.me) {
      var tag = cupEl("i", "", t.hallYou);
      tag.style.color = hh.accent || "var(--accent)";
      nm.appendChild(tag);
    }
    who.appendChild(nm);
    if (srcSum(m.by) > 0) { who.appendChild(srcChips(m.by)); }
    row.appendChild(who);

    var pts = cupEl("div", "hall-pts", String(m.points || 0));
    pts.style.color = hh.accent || "var(--accent)";
    row.appendChild(pts);
    return row;
  }

  // Ro'yxat: dastlab `shown` ta, qolgani "Hammasini ko'rish" tugmasi ortida
  function memberList(box, members, houseId, shown) {
    box.innerHTML = "";
    members.forEach(function (m, idx) {
      var row = memberRow(m, idx, houseId);
      if (idx >= shown) { row.classList.add("hidden"); }
      box.appendChild(row);
    });
    if (members.length > shown) {
      var more = cupEl("button", "cup-more", cupT().showAll.replace("%d", members.length));
      more.type = "button";
      more.addEventListener("click", function () {
        var rows = box.querySelectorAll(".hall-row.hidden");
        for (var i = 0; i < rows.length; i++) { rows[i].classList.remove("hidden"); }
        more.remove();
      });
      box.appendChild(more);
    }
  }

  function renderHall() {
    var box = $("cup-hall");
    if (!box) { return; }
    var me = cupMe();
    var hall = cupData && cupData.hall;

    // Bot hall yubormasa - blok umuman ko'rinmaydi.
    if (!hall || !me.house) { box.classList.add("hidden"); return; }

    var t = T[lang];
    var hh = HOUSES[me.house] || {};

    var crest = $("hall-crest");
    crest.innerHTML = "";
    var img = cupCrestImg(me.house, 34);
    if (img) { crest.appendChild(img); }
    crest.style.borderColor = "rgba(" + (hh.rgb || "151,161,174") + ",.42)";
    crest.style.background = "rgba(" + (hh.rgb || "151,161,174") + ",.13)";

    var nm = $("hall-name");
    nm.textContent = t.hallName.replace("%s", cupHouseName(me.house));
    nm.style.color = hh.accent || "var(--accent)";

    $("hall-sub").textContent = t.hallSub
      .replace("%a", hall.total || 0).replace("%b", hall.active || 0);
    $("hall-about").textContent = cupT().about + " ›";

    memberList($("hall-list"), hall.members || [], me.house, 10);

    var wait = $("hall-wait");
    var idle = (hall.total || 0) - (hall.active || 0);
    if (idle > 0) {
      wait.innerHTML = "";
      var parts = t.hallWaiting.split("%d");
      wait.appendChild(document.createTextNode(parts[0]));
      var b = document.createElement("b");
      b.textContent = idle;
      wait.appendChild(b);
      if (parts.length > 1) { wait.appendChild(document.createTextNode(parts[1])); }
      wait.classList.remove("hidden");
    } else {
      wait.classList.add("hidden");
    }

    box.classList.remove("hidden");
  }

  function feedRow(ev, t) {
    var hh = HOUSES[ev.house] || {};
    var row = cupEl("div", "feed-row");
    var cr = cupEl("div", "feed-crest");
    cr.style.background = "rgba(" + (hh.rgb || "151,161,174") + ",.14)";
    var im = cupCrestImg(ev.house, 22);
    if (im) { cr.appendChild(im); }
    row.appendChild(cr);

    var txt = cupEl("div", "feed-txt");
    var parts = t.feedSorted.split("%h");
    txt.appendChild(cupEl("b", "", ev.name || ""));
    txt.appendChild(document.createTextNode(parts[0]));
    var hn = cupEl("span", "", cupHouseName(ev.house));
    hn.style.color = hh.accent || "inherit";
    txt.appendChild(hn);
    if (parts.length > 1) { txt.appendChild(document.createTextNode(parts[1])); }
    row.appendChild(txt);

    row.appendChild(cupEl("div", "feed-time", agoText(ev.ago_minutes, t)));
    return row;
  }

  function renderFeed() {
    var box = $("cup-feed");
    if (!box) { return; }
    var feed = cupData && cupData.feed;

    if (!feed || !feed.length) { box.classList.add("hidden"); return; }

    var t = T[lang];
    $("feed-kick").textContent = t.feedKick;

    var list = $("feed-list");
    list.innerHTML = "";
    var MAX_FEED = 5;
    feed.forEach(function (ev, idx) {
      var row = feedRow(ev, t);
      if (idx >= MAX_FEED) { row.classList.add("hidden"); }
      list.appendChild(row);
    });

    if (feed.length > MAX_FEED) {
      var more = cupEl("button", "cup-more",
        lang === "uz" ? "Barcha tasmani ko'rish" : lang === "ru" ? "Показать всю ленту" : "Show the whole feed");
      more.type = "button";
      more.addEventListener("click", function () {
        var rows = list.querySelectorAll(".feed-row.hidden");
        for (var i = 0; i < rows.length; i++) { rows[i].classList.remove("hidden"); }
        more.remove();
      });
      list.appendChild(more);
    }

    box.classList.remove("hidden");
  }

  /* ---------- shaxsiy blok ---------- */

  // Manba qatorini bosganda - o'sha ballni olish joyiga
  function srcGo(key) {
    if (key === "exam" || key === "daily") { openDaily(); }
    else if (key === "chess") { openChessHub(); }
    else if (key === "friends") { openRefs(); }
    else { closeCup(); }
  }

  function renderYou(me) {
    var box = $("cup-you");
    var t = T[lang];
    var c = cupT();

    if (!me.house) { box.classList.add("hidden"); return; }

    box.className = "cup-you" + (me.is_active ? "" : " gate");
    box.innerHTML = "";

    var top = cupEl("div", "you-top");
    top.appendChild(cupEl("span", "you-lbl", t.cupYourPts));
    var val = cupEl("span", "you-val", String(me.points || 0));
    val.appendChild(cupEl("s", "", " / " + (me.max_points || 160)));
    top.appendChild(val);
    box.appendChild(top);

    // Chiziq manbalar bo'yicha bo'lingan (do'st bali chegaradan oshirib yuborishi mumkin)
    var by = me.by || {};
    var pct = (me.points || 0) / (me.max_points || 160) * 100;
    box.appendChild(srcBar(by, Math.max(srcSum(by) ? 2 : 0, pct), "you"));

    if (!me.is_active) {
      // Hali bitta ham ball yo'q: har bir ball darhol fakultetga qo'shiladi
      var msg = cupEl("div", "gate-msg");
      msg.appendChild(document.createTextNode(t.cupGateFirst.replace("%s", cupHouseName(me.house))));
      box.appendChild(msg);
    } else if (me.house_rank) {
      var foot = cupEl("div", "you-foot");
      foot.appendChild(cupEl("span", "", t.cupInHouse.replace("%s", cupHouseName(me.house))));
      foot.appendChild(cupEl("b", "", t.cupPlace.replace("%d", me.house_rank)));
      box.appendChild(foot);
    }

    // Har manba: qancha oldingiz, chegarasi, qanday olinadi - bosilsa o'sha joyga
    var caps = me.caps || {};
    var rows = cupEl("div", "you-src");
    CUP_SRC.forEach(function (x) {
      var v = by[x.key] || 0;
      var cap = caps[x.key];
      var row = cupEl("button", "you-src-row");
      row.type = "button";
      row.addEventListener("click", function () { srcGo(x.key); });

      var ic = cupEl("span", "you-src-ic");
      ic.innerHTML = svgIcon(SRC_ICON[x.key]);
      ic.style.color = x.color;
      ic.style.background = hexA(x.color, .16);
      row.appendChild(ic);

      var mid = cupEl("span", "you-src-mid");
      mid.appendChild(cupEl("b", "", c.src[x.key]));
      mid.appendChild(cupEl("small", "", c.rule[x.key]));
      if (cap) {
        var mb = cupEl("span", "you-src-bar");
        var fi = cupEl("i");
        fi.style.width = Math.min(100, v / cap * 100) + "%";
        fi.style.background = x.color;
        mb.appendChild(fi);
        mid.appendChild(mb);
      }
      row.appendChild(mid);

      var num = cupEl("span", "you-src-num" + (cap && v >= cap ? " full" : ""), String(v));
      if (cap) { num.appendChild(cupEl("s", "", "/" + cap)); }
      row.appendChild(num);
      rows.appendChild(row);
    });
    box.appendChild(rows);
    box.classList.remove("hidden");
  }

  /* ---------- tugmalar (vazifalar, chat, shaxmat, do'stlar) ---------- */

  function renderCupTiles() {
    var c = cupT();
    $("chat-kicker").textContent = c.chatT;
    $("chat-title").textContent = c.chatS;
    $("chess-kicker").textContent = c.chessT;
    $("chess-title").textContent = c.chessS;
  }

  /* ---------- to'liq ekran ---------- */

  function renderCupScreen() {
    var t = T[lang];
    var c = cupT();
    applyXT();
    // Vazifalar tasmasi til tanlanishidan oldin chizilgan bo'lishi mumkin
    if (!$("tasks-strip").classList.contains("hidden")) { renderTasksStrip(); }
    var list = cupSorted();
    var me = cupMe();

    $("cup-timer-txt").textContent = cupTimer(t);
    $("cup-kick").textContent = t.cupKicker;
    $("cup-title").textContent = t.cupTitle;
    $("cup-emblem").innerHTML = CUP_TROPHY;
    $("cup-back-txt").textContent = t.cupBack;
    $("hall-back-txt").textContent = t.cupBack;
    $("feed-back-txt").textContent = t.cupBack;
    $("cup-tap-hint").textContent = c.tapHint;

    // Tepadagi yorliq: o'tgan hafta g'olibi (bo'lsa) va kubok tarixiga yo'l
    var prev = cupData && cupData.season && cupData.season.prev_winner;
    var pw = $("cup-prev");
    pw.innerHTML = "";
    pw.appendChild(svgNode(CUP_MINI));
    if (prev && HOUSES[prev]) {
      var parts = c.prevWin.split("%s");
      pw.appendChild(document.createTextNode(parts[0]));
      var b = cupEl("b", "", cupHouseName(prev));
      b.style.color = HOUSES[prev].accent;
      pw.appendChild(b);
      if (parts.length > 1) { pw.appendChild(document.createTextNode(parts[1])); }
      pw.appendChild(cupEl("em", "", " · " + c.histLink + " ›"));
    } else {
      pw.appendChild(document.createTextNode(c.histLink + " ›"));
    }
    pw.classList.remove("hidden");
    $("cup-hist-btn").textContent = c.histAll + " ›";

    renderGlasses(list, me);
    renderSources(list);
    renderYou(me);
    renderCupTiles();

    if (me && me.house) {
      $("chat-strip").classList.remove("hidden");
      $("chess-strip").classList.remove("hidden");
      chatRefreshCounts();
    } else {
      $("chat-strip").classList.add("hidden");
      $("chess-strip").classList.add("hidden");
    }

    renderRefsStrip();
    renderHall();
    renderFeed();

    // Qoidalar
    $("cup-rules-kick").textContent = c.rulesKick;
    var rl = $("cup-rules-list");
    rl.innerHTML = "";
    c.rules.forEach(function (r) { rl.appendChild(cupEl("p", "refs-rule", r)); });

    // Taklif tugmasi: fakultetsizga saralanish
    var cta = $("cup-cta");
    if (!me.house) {
      cta.textContent = t.cupSortCta;
      cta.setAttribute("data-act", "sort");
      cta.classList.remove("hidden");
    } else {
      cta.classList.add("hidden");
    }
  }

  /* ---------- KUBOK TARIXI ---------- */

  var API_CUP_HISTORY = "https://bot.tizimshunos.uz/api/cup/history";
  var cupHistory = null;
  var CUP_MINI = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<path d="M7.5 4h9v4.5a4.5 4.5 0 0 1-9 0z M7.5 6H5a2.5 2.5 0 0 0 2.8 3.4 M16.5 6H19a2.5 2.5 0 0 1-2.8 3.4 M12 13v3.5 M9 20h6 M10 16.5h4l.6 3.5H9.4z"/></svg>';

  function svgNode(html) {
    var box = document.createElement("span");
    box.className = "svg-i";
    box.innerHTML = html;
    return box;
  }

  // Server vaqti UTC; hafta Toshkent vaqti bilan (+5) dushanbadan yakshanbagacha
  function histDay(iso) {
    var d = new Date(Date.parse(iso) + 5 * 3600000);
    var m = cupT().months[d.getUTCMonth()];
    var n = d.getUTCDate();
    if (lang === "en") { return m + " " + n; }
    if (lang === "ru") { return n + " " + m; }
    return n + "-" + m;
  }

  function fetchCupHistory(cb) {
    var initData = "";
    try { initData = (tg && tg.initData) || ""; } catch (e) {}
    if (!initData || !window.fetch) { cb(null); return; }
    try {
      window.fetch(API_CUP_HISTORY, { headers: { "X-Telegram-Init-Data": initData } })
        .then(function (r) { return r.ok ? r.json() : null; })
        .then(function (d) { if (d && d.ok) { cupHistory = d; } cb(d && d.ok ? d : null); })
        ["catch"](function () { cb(null); });
    } catch (e) { cb(null); }
  }

  function openCupHistory() {
    var c = cupT();
    $("hist-back-txt").textContent = T[lang].cupBack;
    $("hist-emblem").innerHTML = CUP_TROPHY;
    $("hist-kick").textContent = c.histKick;
    $("hist-title").textContent = c.histTitle;
    $("scr-cup").classList.add("hidden");
    $("scr-cup-hist").classList.remove("hidden");
    try { window.scrollTo(0, 0); } catch (e) {}
    if (cupHistory) { renderCupHistory(); }
    else {
      $("hist-wins").innerHTML = "";
      $("hist-list").innerHTML = "";
      $("hist-list").appendChild(cupEl("p", "cc-note hist-wait", c.loading));
    }
    fetchCupHistory(function () { renderCupHistory(); });
  }

  function closeCupHistory() {
    $("scr-cup-hist").classList.add("hidden");
    $("scr-cup").classList.remove("hidden");
  }

  function renderCupHistory() {
    var c = cupT();
    var t = T[lang];
    var d = cupHistory;
    var winsBox = $("hist-wins");
    var list = $("hist-list");
    winsBox.innerHTML = "";
    list.innerHTML = "";
    if (!d) { list.appendChild(cupEl("p", "cc-note hist-wait", c.empty)); return; }

    // Kim nechta kubok olgan
    var wins = d.wins || {};
    var order = HOUSE_ORDER.slice().sort(function (a, b) {
      return (wins[b] || 0) - (wins[a] || 0) || HOUSE_ORDER.indexOf(a) - HOUSE_ORDER.indexOf(b);
    });
    var most = wins[order[0]] || 0;
    winsBox.appendChild(cupEl("div", "cc-kick", c.histWins));
    var grid = cupEl("div", "hist-wins");
    order.forEach(function (h) {
      var hh = HOUSES[h] || {};
      var n = wins[h] || 0;
      var cell = cupEl("button", "hist-win-cell" + (n && n === most ? " top" : "") + (n ? "" : " none"));
      cell.type = "button";
      cell.style.setProperty("--hc", hh.accent || "#97a1ae");
      cell.style.setProperty("--hc-rgb", hh.rgb || "151,161,174");
      cell.addEventListener("click", function () { $("scr-cup-hist").classList.add("hidden"); openHouse(h); houseFromHist = true; });
      var cr = cupEl("span", "hist-win-crest");
      var im = cupCrestImg(h, 30);
      if (im) { cr.appendChild(im); }
      cell.appendChild(cr);
      cell.appendChild(cupEl("b", "", String(n)));
      cell.appendChild(cupEl("span", "", cupHouseName(h)));
      grid.appendChild(cell);
    });
    winsBox.appendChild(grid);

    // Haftalar - yangisi tepada
    (d.seasons || []).forEach(function (s) {
      var live = s.status !== "closed";
      var houses = s.houses || [];
      var top = houses.length ? (houses[0].total_points || 0) : 0;
      var win = live ? (top > 0 ? houses[0].house : null) : s.winner;
      var wh = HOUSES[win] || {};
      var card = cupEl("div", "hist-card" + (live ? " live" : "") + (win ? "" : " nowin"));
      card.style.setProperty("--hc", wh.accent || "#97a1ae");
      card.style.setProperty("--hc-rgb", wh.rgb || "151,161,174");

      var head = cupEl("div", "hist-head");
      head.appendChild(cupEl("span", "cc-kick", c.week.replace("%d", s.number)));
      var when = cupEl("span", "hist-when", histDay(s.starts_at) + " – " + histDay(s.ends_at));
      head.appendChild(when);
      card.appendChild(head);

      var hero = cupEl("div", "hist-hero");
      var cr = cupEl("span", "hist-crest");
      if (win) { var im = cupCrestImg(win, 34); if (im) { cr.appendChild(im); } }
      else { cr.appendChild(svgNode(CUP_MINI)); }
      hero.appendChild(cr);
      var txt = cupEl("span", "hist-hero-txt");
      if (live) {
        var badge = cupEl("span", "hist-live");
        badge.appendChild(cupEl("i"));
        badge.appendChild(document.createTextNode(c.live));
        txt.appendChild(badge);
      }
      txt.appendChild(cupEl("span", "hist-lbl", win ? (live ? c.leading : c.winner) : c.noWinner));
      if (win) {
        var wr = houses.filter(function (x) { return x.house === win; })[0] || {};
        var nm = cupEl("b", "hist-name", cupHouseName(win));
        txt.appendChild(nm);
        txt.appendChild(cupEl("span", "hist-pts", cupPts(wr.total_points) + " " + t.cupPts));
      } else {
        txt.appendChild(cupEl("span", "hist-pts", top > 0 ? c.noWinnerSet : c.noWinnerZero));
      }
      hero.appendChild(txt);
      if (win && !live) { hero.appendChild(svgNode(CUP_MINI)); hero.lastChild.classList.add("hist-cup"); }
      card.appendChild(hero);

      // Yakuniy jadval
      if (top > 0) {
        var rows = cupEl("div", "hist-rows");
        houses.forEach(function (x, i) {
          var hh = HOUSES[x.house] || {};
          var r = cupEl("div", "hist-row");
          r.appendChild(cupEl("span", "hist-pos", String(i + 1)));
          var c2 = cupEl("span", "hist-rc");
          var im2 = cupCrestImg(x.house, 16);
          if (im2) { c2.appendChild(im2); }
          r.appendChild(c2);
          r.appendChild(cupEl("span", "hist-rn", cupHouseName(x.house)));
          var bar = cupEl("span", "hist-bar");
          var fill = cupEl("i");
          fill.style.width = Math.max(x.total_points ? 3 : 0, Math.round((x.total_points || 0) / top * 100)) + "%";
          fill.style.background = hh.accent || "#97a1ae";
          bar.appendChild(fill);
          r.appendChild(bar);
          r.appendChild(cupEl("b", "hist-rp", cupPts(x.total_points)));
          rows.appendChild(r);
        });
        card.appendChild(rows);
      }

      if (s.best && s.best.points > 0) {
        var bh = HOUSES[s.best.house] || {};
        var best = cupEl("div", "hist-best");
        best.appendChild(svgNode(svgIcon(ROLE_ICON.prefects)));
        var bt = cupEl("span", "");
        bt.appendChild(cupEl("em", "", (live ? c.bestLive : c.best) + ": "));
        bt.appendChild(cupEl("b", "", s.best.name));
        var bn = cupEl("span", "", " · " + cupHouseName(s.best.house));
        bn.style.color = bh.accent || "inherit";
        bt.appendChild(bn);
        bt.appendChild(document.createTextNode(" · " + s.best.points + " " + t.cupPts));
        best.appendChild(bt);
        card.appendChild(best);
      }
      list.appendChild(card);
    });
  }

  /* ---------- FAKULTET SAHIFASI ---------- */

  var API_CUP_HOUSE = "https://bot.tizimshunos.uz/api/cup/house";
  var houseBoards = {};       // fakultet -> /api/cup/house javobi
  var houseOpen = null;

  function fetchHouseBoard(id, cb) {
    var initData = "";
    try { initData = (tg && tg.initData) || ""; } catch (e) {}
    if (!initData || !window.fetch) { cb(null); return; }
    try {
      window.fetch(API_CUP_HOUSE + "?house=" + encodeURIComponent(id), {
        headers: { "X-Telegram-Init-Data": initData }
      }).then(function (r) { return r.ok ? r.json() : null; })
        .then(function (d) { if (d && d.ok) { houseBoards[id] = d; } cb(d && d.ok ? d : null); })
        ["catch"](function () { cb(null); });
    } catch (e) { cb(null); }
  }

  function openHouse(id) {
    if (!HOUSE_LORE[id]) { return; }
    houseOpen = id;
    houseFromHist = false;
    renderHousePage(id);
    $("scr-cup").classList.add("hidden");
    $("scr-house").classList.remove("hidden");
    try { window.scrollTo(0, 0); } catch (e) {}
    // O'z fakulteti uchun zal ma'lumoti allaqachon bor, boshqalar - so'raladi
    var me = cupMe();
    if (id === me.house && cupData && cupData.hall) {
      houseBoards[id] = cupData.hall;
      renderHouseMembers(id);
    }
    fetchHouseBoard(id, function () { if (houseOpen === id) { renderHouseMembers(id); } });
  }

  var houseFromHist = false;

  function closeHouse() {
    houseOpen = null;
    $("scr-house").classList.add("hidden");
    $(houseFromHist ? "scr-cup-hist" : "scr-cup").classList.remove("hidden");
    houseFromHist = false;
  }

  function loreRow(icon, label, pair) {
    var row = cupEl("div", "lore-row");
    var ic = cupEl("span", "lore-ic");
    ic.innerHTML = svgIcon(ROLE_ICON[icon]);
    row.appendChild(ic);
    var body = cupEl("div", "lore-body");
    body.appendChild(cupEl("span", "lore-lbl", label));
    body.appendChild(cupEl("b", "lore-name", pair[0]));
    if (pair[1]) { body.appendChild(cupEl("p", "lore-note", pair[1])); }
    row.appendChild(body);
    return row;
  }

  function renderHousePage(id) {
    var c = cupT();
    var t = T[lang];
    var hh = HOUSES[id] || {};
    var lore = HOUSE_LORE[id];
    var L2 = lore[lang] || lore.uz;
    var scr = $("scr-house");
    scr.style.setProperty("--hc", hh.accent || "#97a1ae");
    scr.style.setProperty("--hc-rgb", hh.rgb || "151,161,174");
    $("house-back-txt").textContent = t.cupBack;

    // Bosh qism
    var hero = $("house-hero");
    hero.innerHTML = "";
    var crest = cupEl("div", "hh-crest");
    var img = cupCrestImg(id, 74);
    if (img) { crest.appendChild(img); }
    hero.appendChild(crest);
    hero.appendChild(cupEl("span", "hh-kick", c.hKick));
    hero.appendChild(cupEl("h2", "hh-name", cupHouseName(id)));
    hero.appendChild(cupEl("p", "hh-traits", L2.traits));
    var facts = cupEl("div", "hh-facts");
    function fact(label, value, swatches) {
      var f = cupEl("div", "hh-fact");
      f.appendChild(cupEl("span", "", label));
      var v = cupEl("b", "", value);
      if (swatches) {
        var sw = cupEl("i", "hh-sw");
        swatches.forEach(function (col) { var d = cupEl("u"); d.style.background = col; sw.appendChild(d); });
        v.insertBefore(sw, v.firstChild);
      }
      f.appendChild(v);
      facts.appendChild(f);
    }
    fact(c.hSymbol, L2.symbol);
    fact(c.hElement, L2.element);
    fact(c.hColors, L2.colors, lore.colors);
    hero.appendChild(facts);
    var note = hh["note_" + lang] || hh.note_uz;
    if (note) { hero.appendChild(cupEl("p", "hh-note", note)); }

    // Kubokdagi o'rni va ballar manbasi
    var cupBox = $("house-cup");
    cupBox.innerHTML = "";
    var list = cupSorted();
    var idx = -1;
    list.forEach(function (r, i) { if (r.house === id) { idx = i; } });
    var row = idx >= 0 ? list[idx] : null;
    var head = cupEl("div", "cc-head");
    head.appendChild(cupEl("span", "cc-kick", c.hCup));
    if (row) { head.appendChild(cupEl("span", "hc-place", t.cupPlace.replace("%d", idx + 1))); }
    cupBox.appendChild(head);
    if (row) {
      var big = cupEl("div", "hc-big");
      var num = cupEl("b", "", cupPts(row.total_points));
      big.appendChild(num);
      big.appendChild(cupEl("span", "", t.cupPts + " · " + c.hActive.replace("%d", row.active_members || 0)));
      cupBox.appendChild(big);
      var by = row.by || {};
      var sum = srcSum(by);
      if (sum > 0) {
        cupBox.appendChild(srcBar(by, 100, "big"));
        var tbl = cupEl("div", "hc-src");
        CUP_SRC.forEach(function (x) {
          var v = by[x.key] || 0;
          var r2 = cupEl("div", "hc-src-row" + (v ? "" : " zero"));
          var ic = cupEl("span", "hc-src-ic");
          ic.innerHTML = svgIcon(SRC_ICON[x.key]);
          ic.style.color = x.color;
          r2.appendChild(ic);
          r2.appendChild(cupEl("span", "hc-src-name", c.src[x.key]));
          r2.appendChild(cupEl("span", "hc-src-pct", sum ? Math.round(v / sum * 100) + "%" : ""));
          r2.appendChild(cupEl("b", "hc-src-val", String(v)));
          tbl.appendChild(r2);
        });
        cupBox.appendChild(tbl);
      } else {
        cupBox.appendChild(cupEl("p", "cc-note", c.none));
      }
    }

    // Fakultet ahli
    var people = $("house-people");
    people.innerHTML = "";
    people.appendChild(cupEl("div", "cc-kick", c.hPeople));
    people.appendChild(loreRow("founder", c.founder, L2.founder));
    people.appendChild(loreRow("head", c.head, L2.head));
    people.appendChild(loreRow("ghost", c.ghost, L2.ghost));
    people.appendChild(loreRow("captain", c.captain, L2.captain));
    people.appendChild(loreRow("prefects", c.prefects, L2.prefects));
    people.appendChild(loreRow("room", c.room, ["", ""]));
    var roomRow = people.lastChild;
    roomRow.querySelector(".lore-name").remove();
    roomRow.querySelector(".lore-body").appendChild(cupEl("p", "lore-note strong", L2.room));

    var fam = cupEl("div", "lore-row");
    var fic = cupEl("span", "lore-ic");
    fic.innerHTML = svgIcon(ROLE_ICON.famous);
    fam.appendChild(fic);
    var fb = cupEl("div", "lore-body");
    fb.appendChild(cupEl("span", "lore-lbl", c.famous));
    var chips = cupEl("div", "lore-chips");
    L2.famous.forEach(function (n) { chips.appendChild(cupEl("span", "", n)); });
    fb.appendChild(chips);
    fam.appendChild(fb);
    people.appendChild(fam);
    people.appendChild(cupEl("p", "lore-src", c.lore));

    // A'zolar - serverdan keladi
    var mem = $("house-members");
    mem.innerHTML = "";
    mem.appendChild(cupEl("div", "cc-kick", c.members));
    var ml = cupEl("div", "", null);
    ml.id = "house-members-list";
    ml.appendChild(cupEl("p", "cc-note", c.loading));
    mem.appendChild(ml);
    if (houseBoards[id]) { renderHouseMembers(id); }
  }

  function renderHouseMembers(id) {
    var box = $("house-members-list");
    if (!box) { return; }
    var d = houseBoards[id];
    var c = cupT();
    if (!d) { box.innerHTML = ""; box.appendChild(cupEl("p", "cc-note", c.empty)); return; }
    var members = (d.members || []).filter(function (m) { return (m.points || 0) > 0; });
    if (!members.length) { box.innerHTML = ""; box.appendChild(cupEl("p", "cc-note", c.empty)); return; }
    memberList(box, members, id, 10);
  }
