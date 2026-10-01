/* 9¾ Sehrli olam: xat, Diagon xiyoboni, Gringotts, platforma, xarita
   Ilova kodi bir necha faylga bo'lingan; hammasi BIR umumiy maydonda ishlaydi
   va index.html dagi TARTIBDA yuklanadi. Yuklanish paytida keyingi fayldagi
   narsani chaqirmang - tekshiruv: tools/tartib.js */
"use strict";
  // ---------------------------------------------------------------- SEHRLI OLAM (A)
  // 9¾ ortidagi bosh sahifa: profil, kubok, bo'limlar. Xarita (WORLD_MAPS) keyinroq
  // ikkinchi ko'rinish bo'lib qaytadi, hozircha 9¾ shu yerga olib keladi.
  var HUB_TX = {
    kick: { uz: "Xogvarts qasri", ru: "Замок Хогвартс", en: "Hogwarts Castle" },
    title: { uz: "Sehrli olam", ru: "Волшебный мир", en: "The Wizarding World" },
    pts: { uz: "ball", ru: "очков", en: "points" },
    wandT: { uz: "Tayoqcha", ru: "Волшебная палочка", en: "Wand" },
    wandNone: { uz: "Olivander do'koni: tayoqcha sizni tanlaydi",
                ru: "Лавка Олливандера: палочка выбирает волшебника",
                en: "Ollivanders: the wand chooses the wizard" },
    chessNone: { uz: "Botlar va do'stlar bilan jang", ru: "Бои с ботами и друзьями", en: "Battle bots and friends" },
    rating: { uz: "Reyting %d", ru: "Рейтинг %d", en: "Rating %d" }
  };

  var HUB_ICONS = {
    tasks: "M7 3.5h8l3.5 3.5v13.5h-11.5z M15 3.5v3.5h3.5 M10 11h5.5 M10 14.5h5.5 M10 18h3",
    chat: "M4 5.5h16v10.5H10l-6 4z M8 9.5h8 M8 12.5h5",
    chess: "M12 3.8a2.4 2.4 0 1 1 0 4.8a2.4 2.4 0 1 1 0-4.8z M9.6 10.8h4.8 M10.4 10.8l-.9 5.6h5l-.9-5.6 M7.3 20.3h9.4l-1.1-3.9H8.4z",
    refs: "M9 5.5a3 3 0 1 1 0 6a3 3 0 1 1 0-6z M3.5 19.5c0-3.1 2.5-5.5 5.5-5.5s5.5 2.4 5.5 5.5 M15.8 6.2a2.6 2.6 0 1 1 0 5.2 M17 14.2c2.3.5 3.8 2.6 3.8 5",
    wand: "M4 20L15.5 8.5 M15.5 8.5l2-2 M18.5 2.5v3 M21.5 5.5h-3 M20.5 2.5l-1 1 M13 11l-2-2"
  };

  var hubChess = null;     // {rating, title, games} - shaxmat serveridan

  function hubSvg(d) {
    if (!d) { return ""; }
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" ' +
           'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="' + d + '"></path></svg>';
  }

  function hubVisible() {
    var el = $("scr-hub");
    return !!el && !el.classList.contains("hidden");
  }

  // Bo'limga o'tish: "Ortga" bosilganda shu sahifaga qaytadi.
  function hubGo(fn) {
    return function () {
      worldFrom = "hub";
      $("scr-hub").classList.add("hidden");
      fn();
    };
  }

  function renderHub() {
    var t = T[lang];
    var c = cupT();
    var me = cupMe();
    var hid = me.house || house || "none";
    var hh = HOUSES[hid] || HOUSES.none;
    var root = $("scr-hub");
    root.style.setProperty("--hub-rgb", hh.rgb);
    root.style.setProperty("--hub-accent", hh.accent);

    $("hub-back").innerHTML = hubSvg("M12 6.5c-2-1.5-5-2-8-1.5v13c3-.5 6 0 8 1.5c2-1.5 5-2 8-1.5v-13c-3-.5-6 0-8 1.5z M12 6.5v13");
    $("hub-gear").innerHTML = worldIcon("gear");
    $("hub-kick").textContent = HUB_TX.kick[lang];
    $("hub-title").textContent = HUB_TX.title[lang];

    // Profil kartasi
    var u = tgUser();
    $("hub-name").textContent = u ? (u.first_name || fullName(u)) : t.guest;
    var rank = refsData && refsData.me && refsData.me.rank_name;
    $("hub-house").textContent = hid === "none" ? t.houseNote : (cupHouseName(hid) + (rank ? " · " + rank : ""));
    paintCrest($("hub-crest"), hid, hh.crest);
    $("hub-pts").textContent = String(me.points || 0);
    $("hub-pts-l").textContent = HUB_TX.pts[lang];

    // Fakultetsiz: avval saralanish
    var sort = $("hub-sort");
    if (hid === "none") {
      sort.classList.remove("hidden");
      paintHatSmall($("hub-sort-mark"));
      $("hub-sort-t").textContent = t.cardTitle;
      $("hub-sort-s").textContent = t.cardSub;
    } else {
      sort.classList.add("hidden");
    }

    // Kubok: to'rtta qum soati
    var cup = $("hub-cup");
    if (!cupData) {
      cup.classList.add("hidden");
    } else {
      cup.classList.remove("hidden");
      $("hub-cup-t").textContent = t.cupTitle;
      $("hub-cup-time").textContent = cupTimer(t);
      var list = cupSorted();
      var top = 0;
      list.forEach(function (row) { if ((row.total_points || 0) > top) { top = row.total_points || 0; } });
      var scale = Math.max(top, SCALE_FLOOR);
      var tubes = $("hub-tubes");
      tubes.innerHTML = "";
      list.forEach(function (row) {
        var rh = HOUSES[row.house] || HOUSES.none;
        var cell = document.createElement("span");
        cell.className = "hub-tube" + (row.house === hid ? " mine" : "");
        cell.style.setProperty("--tc-rgb", rh.rgb);
        var g = document.createElement("span");
        g.className = "hub-tube-g";
        var f = document.createElement("span");
        f.className = "hub-tube-f";
        f.style.height = Math.max(6, Math.round((row.total_points || 0) / scale * 100)) + "%";
        f.style.background = "linear-gradient(" + rh.accent + ", " + (rh.accent2 || rh.accent) + ")";
        g.appendChild(f);
        cell.appendChild(g);
        var n = document.createElement("span");
        n.className = "hub-tube-n";
        n.textContent = cupHouseName(row.house);
        cell.appendChild(n);
        var p = document.createElement("span");
        p.className = "hub-tube-p";
        p.style.color = rh.accent;
        p.textContent = String(row.total_points || 0);
        cell.appendChild(p);
        tubes.appendChild(cell);
      });
    }

    // Bo'limlar
    var grid = $("hub-grid");
    grid.innerHTML = "";
    var tasksN = worldTasksN();
    var chatN = worldChatN();
    var refsN = (refsData && refsData.me && refsData.me.refs) || 0;
    var tiles = [
      { key: "tasks", rgb: "232,132,60", title: c.tasksT, sub: c.tasksS, badge: tasksN, go: openTasks },
      { key: "chat", rgb: hh.rgb, title: c.chatT, sub: c.chatS, badge: chatN, go: openChat, needHouse: true },
      { key: "chess", rgb: "165,127,224", title: c.chessT,
        sub: hubChess && hubChess.rating ? HUB_TX.rating[lang].replace("%d", hubChess.rating) : HUB_TX.chessNone[lang],
        badge: 0, go: openChessHub, needHouse: true },
      { key: "refs", rgb: "var(--gold-rgb)", title: refT().kick, sub: c.refsS, badge: refsN, go: openRefs }
    ];
    tiles.forEach(function (tile) {
      if (tile.needHouse && hid === "none") { return; }
      var el = document.createElement("button");
      el.type = "button";
      el.className = "hub-tile";
      el.style.setProperty("--tc-rgb", tile.rgb);
      el.innerHTML = '<span class="hub-tile-ic">' + hubSvg(HUB_ICONS[tile.key]) + "</span>";
      if (tile.badge > 0) {
        var bd = document.createElement("i");
        bd.textContent = tile.badge > 99 ? "99+" : String(tile.badge);
        el.appendChild(bd);
      }
      var bt = document.createElement("b");
      bt.textContent = tile.title;
      el.appendChild(bt);
      var sp = document.createElement("span");
      sp.textContent = tile.sub;
      el.appendChild(sp);
      el.onclick = hubGo(tile.go);
      grid.appendChild(el);
    });

    // Tayoqcha
    $("hub-wand-ic").innerHTML = hubSvg(HUB_ICONS.wand);
    $("hub-wand-t").textContent = HUB_TX.wandT[lang];
    $("hub-wand-s").textContent = wand ? wandLabel(wand, lang) : HUB_TX.wandNone[lang];
  }

  function openHub() {
    if (!hasHouse()) { openAlley(); return; }
    stopSortTimer();
    ["scr-cat", "scr-world", "scr-alley", "scr-train", "scr-prof", "scr-detail", "scr-lang", "scr-cup", "scr-cup-hist", "scr-house",
     "scr-tasks", "scr-quiz", "scr-chat", "scr-refs", "scr-hall-full", "scr-feed-full",
     "scr-chess-hub", "scr-chess-stats"].forEach(function (id) {
      var el = $(id);
      if (el) { el.classList.add("hidden"); }
    });
    $("hub-set").classList.add("hidden");
    $("scr-hub").classList.remove("hidden");
    try { window.scrollTo(0, 0); } catch (e) {}
    renderHub();

    // Sonlar va reyting fonda yangilanadi
    fetchRefs(function () { if (hubVisible()) { renderHub(); } });
    fetchTasks(function () { if (hubVisible()) { renderHub(); } });
    try { chatRefreshCounts(); } catch (e) {}
    try { jrAdminCheck(); } catch (e) {}
    try {
      chessApi("mine").then(function (res) {
        if (res && res.rating) { hubChess = res.rating; if (hubVisible()) { renderHub(); } }
      })["catch"](function () {});
    } catch (e) {}
  }

  function leaveHub() {
    $("scr-hub").classList.add("hidden");
    $("hub-set").classList.add("hidden");
    $("scr-cat").classList.remove("hidden");
    renderCatalog();
  }

  function renderHubSettings() {
    var cur = readStart();
    $("hub-set-title").textContent = W_SET_TX.title[lang];
    $("hub-set-note").textContent = {
      uz: "Sehrli olam tanlansa, ilovani ochganingizda to'g'ridan-to'g'ri shu yerga tushasiz.",
      ru: "Если выбрать волшебный мир, приложение будет открываться сразу здесь.",
      en: "Choose the wizarding world and the app will open straight here."
    }[lang];
    $("hub-set-close").textContent = W_SET_TX.close[lang];
    $("hub-set-lib").innerHTML = hubSvg("M12 6.5c-2-1.5-5-2-8-1.5v13c3-.5 6 0 8 1.5c2-1.5 5-2 8-1.5v-13c-3-.5-6 0-8 1.5z M12 6.5v13") +
                                 "<span>" + W_SET_TX.lib[lang] + "</span>";
    $("hub-set-hub").innerHTML = '<span class="n934">9¾</span><span>' + HUB_TX.title[lang] + "</span>";
    $("hub-set-lib").className = cur === "lib" ? "on" : "";
    $("hub-set-pv").classList.toggle("hidden", !jrIsAdmin());
    $("hub-pv-ic").innerHTML = hubSvg(AL_ICONS.letter);
    $("hub-pv-t").textContent = al("pvBtn");
    $("hub-pv-s").textContent = al("pvNote");
    $("hub-set-hub").className = cur === "world" ? "on" : "";
  }

  // ---------------------------------------------------------------- DIAGON XIYOBONI
  // Saralanmagan o'quvchi 9¾ dan to'g'ri Xogvartsga tushmaydi - asardagi yo'lni
  // bosib o'tadi: maktub -> g'isht devor -> Diagon xiyoboni (Olivander) ->
  // Kings Kross, 9¾ -> Xogvarts ekspressi -> Katta zal (saralanish) -> Xogvarts.
  var LETTER_KEY = TK("hp_letter"), TRAIN_KEY = TK("hp_train");
  var journey = null;        // "wand" | "house": savollar yo'l ichidan boshlangan
  var trTimer = null;
  // Ko'rish rejimi (adminlar): o'quvchi saralanmagandek ko'rinadi, hech narsa saqlanmaydi
  var jrPreview = false;
  var pv = { wand: null, letter: false, train: false };
  var jrAdminAsked = false;

  var AL_TX = {
    kick: { uz: "London", ru: "Лондон", en: "London" },
    title: { uz: "Diagon xiyoboni", ru: "Косой переулок", en: "Diagon Alley" },
    intro: { uz: "Maktubdagi ro'yxat bo'yicha yuring — Xogvartsga yo'l shu yerdan boshlanadi.",
             ru: "Идите по списку из письма — путь в Хогвартс начинается здесь.",
             en: "Follow the list in your letter — the road to Hogwarts starts here." },
    prog: { uz: "Yo'l", ru: "Путь", en: "Journey" },
    letterAria: { uz: "Maktub", ru: "Письмо", en: "Letter" },
    s0p: { uz: "Diagon xiyoboni", ru: "Косой переулок", en: "Diagon Alley" },
    s0t: { uz: "Gringotts banki", ru: "Банк Гринготтс", en: "Gringotts Bank" },
    s0s: { uz: "Xogvarts sizga ajratgan galleonlar shu yerda", ru: "Здесь галлеоны, которые выделил вам Хогвартс",
           en: "The galleons Hogwarts set aside for you are here" },
    s0d: { uz: "Hamyoningizda %s galleon", ru: "В кошельке %s галлеонов", en: "%s Galleons in your purse" },
    s0c: { uz: "Bankka kirish", ru: "Войти в банк", en: "Enter the bank" },
    sTp: { uz: "Qovoqxona", ru: "«Дырявый котёл»", en: "The Leaky Cauldron" },
    sTt: { uz: "Xagriddan bilet", ru: "Билет от Хагрида", en: "Hagrid's ticket" },
    sTs: { uz: "Xogvarts ekspressiga chipta", ru: "Билет на Хогвартс-экспресс",
           en: "A ticket for the Hogwarts Express" },
    sTl: { uz: "Avval xaridlarni tugating", ru: "Сначала закончите покупки", en: "Finish your shopping first" },
    sTd: { uz: "Bilet cho'ntagingizda", ru: "Билет у вас в кармане", en: "The ticket is in your pocket" },
    s2n: { uz: "Avval biletni oling", ru: "Сначала получите билет", en: "Get your ticket first" },
    sTc: { uz: "Biletni olish", ru: "Получить билет", en: "Take the ticket" },
    s1p: { uz: "Diagon xiyoboni", ru: "Косой переулок", en: "Diagon Alley" },
    s1t: { uz: "Olivander do'koni", ru: "Лавка Олливандера", en: "Ollivanders" },
    s1s: { uz: "Tayoqcha sizni tanlaydi · 5 savol", ru: "Палочка выбирает волшебника · 5 вопросов",
           en: "The wand chooses the wizard · 5 questions" },
    s1l: { uz: "Avval Gringottsdan pul oling", ru: "Сначала возьмите деньги в Гринготтсе",
           en: "Get money from Gringotts first" },
    s1c: { uz: "Do'konga kirish", ru: "Войти в лавку", en: "Step inside" },
    s2p: { uz: "Kings Kross vokzali", ru: "Вокзал Кингс-Кросс", en: "King's Cross Station" },
    s2t: { uz: "9¾ platforma", ru: "Платформа 9¾", en: "Platform 9¾" },
    s2s: { uz: "Xogvarts ekspressi soat 11:00 da jo'naydi", ru: "Хогвартс-экспресс отходит в 11:00",
           en: "The Hogwarts Express leaves at 11:00" },
    s2c: { uz: "Vokzalga yo'l olish", ru: "На вокзал", en: "To the station" },
    s2l: { uz: "Avval tayoqcha oling", ru: "Сначала получите палочку", en: "Get your wand first" },
    s2d: { uz: "Ekspressda Xogvartsga keldingiz", ru: "Вы приехали в Хогвартс на экспрессе", en: "You rode the Express to Hogwarts" },
    s3p: { uz: "Xogvarts", ru: "Хогвартс", en: "Hogwarts" },
    s3t: { uz: "Katta zal", ru: "Большой зал", en: "The Great Hall" },
    s3s: { uz: "Saralovchi shlyapa fakultetingizni aytadi · 8 savol",
           ru: "Распределяющая шляпа назовёт факультет · 8 вопросов",
           en: "The Sorting Hat names your house · 8 questions" },
    s3c: { uz: "Saralanishga kirish", ru: "На распределение", en: "To the Sorting" },
    s3l: { uz: "Avval ekspressga chiqing", ru: "Сначала сядьте на экспресс", en: "Board the Express first" },
    more: { uz: "Xiyobonda yana", ru: "Ещё в переулке", en: "Also in the alley" },
    bankT: { uz: "Gringotts", ru: "Гринготтс", en: "Gringotts" },
    bankS: { uz: "Sehrgarlar banki · tez orada", ru: "Банк волшебников · скоро", en: "The wizarding bank · coming soon" },

    seal: { uz: "X", ru: "Х", en: "H" },
    school: { uz: "Xogvarts jodugarlik va sehrgarlik maktabi", ru: "Школа чародейства и волшебства «Хогвартс»",
              en: "Hogwarts School of Witchcraft and Wizardry" },
    hi: { uz: "Hurmatli %s,", ru: "Дорогой(ая) %s!", en: "Dear %s," },
    body: { uz: "Xogvarts maktabida siz uchun joy ajratilganini mamnuniyat bilan ma'lum qilamiz. O'qish boshlanishidan oldin quyidagilarni bajaring:",
            ru: "С удовольствием сообщаем, что вам предоставлено место в школе «Хогвартс». До начала учёбы сделайте следующее:",
            en: "We are pleased to inform you that a place has been reserved for you at Hogwarts. Before term starts, do the following:" },
    list: {
      uz: ["Diagon xiyobonidagi Olivander do'konidan tayoqcha oling",
           "Kings Kross vokzalida 9¾ platformadan Xogvarts ekspressiga chiqing",
           "Katta zalda Saralovchi shlyapa fakultetingizni aytadi"],
      ru: ["Получите палочку в лавке Олливандера в Косом переулке",
           "Сядьте на Хогвартс-экспресс на платформе 9¾ вокзала Кингс-Кросс",
           "В Большом зале Распределяющая шляпа назовёт ваш факультет"],
      en: ["Get a wand at Ollivanders in Diagon Alley",
           "Board the Hogwarts Express at King's Cross, platform 9¾",
           "In the Great Hall, the Sorting Hat will name your house"]
    },
    share: { uz: "Ulashish", ru: "Поделиться", en: "Share" },
    shareWait: { uz: "Xat tayyorlanmoqda…", ru: "Письмо готовится…", en: "Preparing the letter…" },
    shareErr: { uz: "Xat tayyorlanmadi, birozdan keyin urinib ko'ring",
                ru: "Письмо не подготовилось, попробуйте позже",
                en: "The letter could not be prepared, try again later" },
    shareStory: { uz: "Menga Xogvartsdan maktub keldi", ru: "Мне пришло письмо из Хогвартса",
                  en: "My Hogwarts letter has arrived" },
    shareBtn: { uz: "Xogvartsga kirish", ru: "В Хогвартс", en: "Enter Hogwarts" },
    sign: { uz: "Minerva Makgonagall, direktor o'rinbosari", ru: "Минерва Макгонагалл, заместитель директора",
            en: "Minerva McGonagall, Deputy Headmistress" },
    hint: { uz: "Xagrid sizni qovoqxona hovlisidagi g'isht devor oldida kutmoqda.",
            ru: "Хагрид ждёт вас у кирпичной стены во дворе «Дырявого котла».",
            en: "Hagrid is waiting by the brick wall behind the Leaky Cauldron." },
    go: { uz: "Diagon xiyoboniga yo'l olish", ru: "Отправиться в Косой переулок", en: "Head to Diagon Alley" },
    later: { uz: "Keyinroq", ru: "Позже", en: "Later" },
    close: { uz: "Yopish", ru: "Закрыть", en: "Close" },

    grKick: { uz: "Diagon xiyoboni", ru: "Косой переулок", en: "Diagon Alley" },
    grTitle: { uz: "Gringotts", ru: "Гринготтс", en: "Gringotts" },
    grP1: { uz: "Goblin kalitingizni ko'zdan kechirdi va boshini qimirlatdi: «Aravacha tayyor».",
            ru: "Гоблин осмотрел ваш ключ и кивнул: «Тележка подана».",
            en: "The goblin examined your key and nodded: \u201cThe cart is ready.\u201d" },
    grGo: { uz: "Aravachaga o'tirish", ru: "Сесть в тележку", en: "Get into the cart" },
    grRide: { uz: ["Aravacha zulmatga sho'ng'idi.",
                   "Tosh yo'laklar, stalaktitlar va yer ostidagi ko'l yonidan o'tdingiz.",
                   "Qayerdadir olovli nafas eshitildi — pastda ajdaho qo'riqlaydi.",
                   "Aravacha keskin to'xtadi: 687-xona."],
              ru: ["Тележка нырнула во тьму.",
                   "Каменные тоннели, сталактиты и подземное озеро промелькнули мимо.",
                   "Где-то внизу послышалось огненное дыхание — там сторожит дракон.",
                   "Тележка резко остановилась: сейф 687."],
              en: ["The cart plunged into the dark.",
                   "Stone tunnels, stalactites and an underground lake rushed past.",
                   "Somewhere below came a fiery breath \u2014 a dragon stands guard.",
                   "The cart stopped sharply: vault 687."] },
    grOpen: { uz: "Xonani ochish", ru: "Открыть сейф", en: "Open the vault" },
    grGot: { uz: "galleon", ru: "галлеонов", en: "Galleons" },
    grDone: { uz: "Xogvarts sizga ajratgan galleonlar. Xaridlarga yetadi.",
              ru: "Галлеоны, которые выделил вам Хогвартс. На покупки хватит.",
              en: "The galleons Hogwarts set aside for you. Enough for your shopping." },
    grNext: { uz: "Xiyobonga qaytish", ru: "Вернуться в переулок", en: "Back to the alley" },

    tkKick: { uz: "Qovoqxona", ru: "«Дырявый котёл»", en: "The Leaky Cauldron" },
    tkTitle: { uz: "Xagriddan bilet", ru: "Билет от Хагрида", en: "Hagrid's ticket" },
    tkSay: { uz: "«Mana, biletingni yo'qotib qo'yma. Bir sentabr, soat o'n bir. Kings Krossda ko'rishamiz.»",
             ru: "«Вот твой билет, не потеряй. Первого сентября, одиннадцать часов. Увидимся на Кингс-Кроссе.»",
             en: "\u201cHere\u2019s your ticket, don\u2019t lose it. First of September, eleven o\u2019clock. See you at King\u2019s Cross.\u201d" },
    tkTop: { uz: "XOGVARTS EKSPRESSI", ru: "ХОГВАРТС-ЭКСПРЕСС", en: "HOGWARTS EXPRESS" },
    tkSub: { uz: "Kings Kross vokzali · London", ru: "Вокзал Кингс-Кросс · Лондон",
             en: "King's Cross Station · London" },
    tkWhen: { uz: "Jo'nash", ru: "Отправление", en: "Departure" },
    tkWhenV: { uz: "1-sentabr, 11:00", ru: "1 сентября, 11:00", en: "1 September, 11:00" },
    tkSeat: { uz: "Yo'nalish", ru: "Направление", en: "To" },
    tkSeatV: { uz: "Xogvarts", ru: "Хогвартс", en: "Hogwarts" },
    tkGo: { uz: "Biletni olish", ru: "Взять билет", en: "Take the ticket" },
    tkNext: { uz: "Vokzalga yo'l olish", ru: "На вокзал", en: "To the station" },

    trSign: { uz: "PLATFORMA", ru: "ПЛАТФОРМА", en: "PLATFORM" },
    trSignSub: { uz: "Xogvarts ekspressi", ru: "Хогвартс-экспресс", en: "Hogwarts Express" },
    trP1: { uz: "Chiptada yozilgan: 9¾ platforma, soat 11:00. Lekin 9 va 10-platformalar orasida faqat g'isht ustun turibdi…",
            ru: "В билете написано: платформа 9¾, 11:00. Но между платформами 9 и 10 — только кирпичная колонна…",
            en: "Your ticket says platform 9¾, 11:00. But between platforms 9 and 10 there is only a brick pillar…" },
    trP2: { uz: "Sehrgarlar unga to'xtamasdan yurib kirishadi. Ikkilanmang.",
            ru: "Волшебники проходят сквозь неё не останавливаясь. Не сомневайтесь.",
            en: "Wizards walk straight into it without stopping. Don't hesitate." },
    trGo: { uz: "Devorga qarab yurish", ru: "Шагнуть в стену", en: "Walk into the wall" },
    trRideT: { uz: "Shimolga", ru: "На север", en: "Northbound" },
    trHint: { uz: "Davom etish uchun bosing", ru: "Нажмите, чтобы продолжить", en: "Tap to continue" },
    endT: { uz: "Saralanish marosimi", ru: "Церемония распределения", en: "The Sorting Ceremony" },
    endS: { uz: "Saralovchi shlyapa sizni kutmoqda. U aytgan fakultet umrbod qoladi.",
            ru: "Распределяющая шляпа ждёт вас. Факультет, который она назовёт, — навсегда.",
            en: "The Sorting Hat is waiting. The house it names is yours for life." },
    endGo: { uz: "Shlyapa oldiga borish", ru: "Подойти к шляпе", en: "Approach the Hat" },
    rvHouse: { uz: "Xogvartsga kirish", ru: "Войти в Хогвартс", en: "Enter Hogwarts" },
    rvWand: { uz: "Diagon xiyoboniga qaytish", ru: "Вернуться в Косой переулок", en: "Back to Diagon Alley" },

    pvBtn: { uz: "Sinov o'quvchisi bo'lib kirish", ru: "Войти как тестовый ученик", en: "Enter as a test student" },
    pvNote: { uz: "Faqat adminlar uchun: ilova noldan boshlanadi - fakultet, tayoqcha, ball, chat. Asl profilingizga tegilmaydi.",
              ru: "Только для админов: приложение начнётся с нуля — факультет, палочка, баллы, чат. Ваш профиль не тронут.",
              en: "Admins only: the app starts from zero — house, wand, points, chat. Your real profile is untouched." },
    pvTag: { uz: "Ko'rish rejimi · hech narsa saqlanmaydi", ru: "Режим просмотра · ничего не сохраняется",
             en: "Preview · nothing is saved" }
  };

  var TR_LINES = {
    uz: ["Devor ortida — bug' va qirmizi paravoz: Xogvarts ekspressi.",
         "Soat o'n bir. Hushtak chalindi, poyezd shimolga yo'l oldi.",
         "Deraza ortidan dalalar, keyin tog'lar o'tib bordi. Shirinlik aravachasi ham keldi.",
         "Qorong'i tushdi. Poyezd kichkina bekatda to'xtadi.",
         "Birinchi kurslar qayiqlarda qora ko'l bo'ylab suzdi — ro'parada qasr chiroqlari.",
         "Eshiklar ochildi. Katta zalda minglab shamlar havoda suzib yuribdi."],
    ru: ["За стеной — пар и алый паровоз: Хогвартс-экспресс.",
         "Одиннадцать часов. Гудок — и поезд уходит на север.",
         "За окном поля, потом горы. Мимо проезжает тележка со сладостями.",
         "Стемнело. Поезд остановился на маленькой станции.",
         "Первокурсники плывут в лодках по чёрному озеру — впереди огни замка.",
         "Двери открылись. Над Большим залом парят тысячи свечей."],
    en: ["Beyond the wall — steam and a scarlet engine: the Hogwarts Express.",
         "Eleven o'clock. A whistle, and the train heads north.",
         "Fields roll past the window, then mountains. The sweets trolley rattles by.",
         "Night falls. The train stops at a tiny station.",
         "First-years cross the black lake in little boats — castle lights ahead.",
         "The doors swing open. Thousands of candles float above the Great Hall."]
  };

  var AL_ICONS = {
    book: "M12 6.5c-2-1.5-5-2-8-1.5v13c3-.5 6 0 8 1.5c2-1.5 5-2 8-1.5v-13c-3-.5-6 0-8 1.5z M12 6.5v13",
    letter: "M3.5 6h17v12h-17z M3.5 6.5l8.5 6.5 8.5-6.5",
    back: "M15 6l-6 6 6 6",
    wand: "M4 20L15.5 8.5 M15.5 8.5l2-2 M18.5 2.5v3 M21.5 5.5h-3 M20.5 2.5l-1 1 M13 11l-2-2",
    train: "M7 3.5h10a2.5 2.5 0 0 1 2.5 2.5v9a2.5 2.5 0 0 1-2.5 2.5H7A2.5 2.5 0 0 1 4.5 15V6A2.5 2.5 0 0 1 7 3.5z M4.5 10.5h15 M8.5 14.2h.01 M15.5 14.2h.01 M8 17.5l-2 3.5 M16 17.5l2 3.5",
    castle: "M4 20.5h16 M5 20.5V8h3v2h2V8h4v2h2V8h3v12.5 M10 20.5v-4.5a2 2 0 0 1 4 0v4.5",
    bank: "M3.5 9.5L12 4.5l8.5 5 M5 10v7 M9.7 10v7 M14.3 10v7 M19 10v7 M3.5 20h17",
    check: "M5 12.5l4.5 4.5L19 7.5",
    arrow: "M9 6l6 6-6 6",
    share: "M12 15.5V3.5 M8 7l4-3.5L16 7 M4.5 13v6.5a1 1 0 0 0 1 1h13a1 1 0 0 0 1-1V13",
    ticket: "M4 8.5A2.5 2.5 0 0 0 6.5 6h11A2.5 2.5 0 0 0 20 8.5v2a1.5 1.5 0 0 0 0 3v2a2.5 2.5 0 0 0-2.5 2.5h-11A2.5 2.5 0 0 0 4 15.5v-2a1.5 1.5 0 0 0 0-3z M9.5 6v12",
    coin: "M12 3.5a8.5 8.5 0 1 0 0 17 8.5 8.5 0 0 0 0-17z M9.5 9.5h5 M9.5 14.5h5 M12 7v10"
  };

  function al(k) { return (AL_TX[k] && (AL_TX[k][lang] || AL_TX[k].uz)) || ""; }
  function jrGet(k) {
    if (jrPreview) { return k === LETTER_KEY ? pv.letter : pv.train; }
    try { return window.localStorage.getItem(k) === "1"; } catch (e) { return false; }
  }
  function jrSet(k) {
    if (jrPreview) { if (k === LETTER_KEY) { pv.letter = true; } else { pv.train = true; } return; }
    try { window.localStorage.setItem(k, "1"); } catch (e) {}
  }

  /* Onboarding qadamlari (asardagi yo'l): xat -> xiyobon -> Gringotts ->
     tayoqcha -> bilet -> poyezd -> saralanish. Har qadam serverga
     BIR MARTA yoziladi, panel voronkasi shulardan yig'iladi. Tayoqcha,
     saralash boshlanishi va fakultet alohida yoziladi (report("wand"...)). */
  function onbStep(name) {
    if (jrPreview) { return; }              // eski ko'rish rejimi - yozilmaydi
    var k = TK("hp_onb_" + name);
    try {
      if (window.localStorage.getItem(k) === "1") { return; }
      window.localStorage.setItem(k, "1");
    } catch (e) {}
    report("onb", name);
    try { renderWorldBtn(); } catch (e) {}
  }

  // Yo'l ichidagi tayoqcha: ko'rish rejimida haqiqiysi emas
  function jrWandNow() { return jrPreview ? pv.wand : wand; }

  function jrEl(tag, cls, text) {
    var el = document.createElement(tag);
    if (cls) { el.className = cls; }
    if (text != null) { el.textContent = text; }
    return el;
  }

  function hasHouse() { return !jrPreview && !!validHouse(cupMe().house || house); }

  // Admin ekani chat serveridan bilinadi (umumiy xonaning oddiy so'rovi "admin" qaytaradi)
  function jrIsAdmin() {
    if (chatAdmin) { return true; }
    var local = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
    return local && !chatInitData();
  }

  // ---------------------------------------------------------------- SINOV O'QUVCHISI
  var API_TEST_RESET = "https://bot.tizimshunos.uz/api/test/reset";
  var FRESH_KEY = "hp_test_fresh";
  var TEST_LS = ["watched_movies", "house", "wand", "hp_letter", "hp_train", "hp_start"];

  var TEST_TX = {
    bar: { uz: "SINOV O'QUVCHISI", ru: "ТЕСТОВЫЙ УЧЕНИК", en: "TEST STUDENT" },
    zero: { uz: "Noldan", ru: "С нуля", en: "Reset" },
    exit: { uz: "Chiqish", ru: "Выйти", en: "Exit" },
    askIn: { uz: "Sinov o'quvchisi bo'lib kirasizmi? Ilova noldan boshlanadi, asl profilingiz saqlanib qoladi.",
             ru: "Войти как тестовый ученик? Приложение начнётся с нуля, ваш профиль сохранится.",
             en: "Enter as a test student? The app starts from zero; your real profile stays." },
    askZero: { uz: "Sinov o'quvchisini butunlay tozalaymizmi? U yana yangi odamdek boshlaydi.",
               ru: "Полностью очистить тестового ученика? Он снова начнёт как новичок.",
               en: "Wipe the test student completely? It starts again as a newcomer." }
  };

  function testAsk(msg, done) {
    // Eski Telegram'da showConfirm xato tashlaydi - o'shanda oddiy confirm
    if (tg && tg.showConfirm) {
      try {
        tg.showConfirm(msg, function (ok) { if (ok) { done(); } });
        return;
      } catch (e) {}
    }
    if (!window.confirm || window.confirm(msg)) { done(); }
  }

  function testTx(k) { return (TEST_TX[k] && (TEST_TX[k][lang] || TEST_TX[k].uz)) || ""; }

  // Qurilmadagi sinov xotirasi (localStorage + Telegram buluti)
  function testWipeLocal(done) {
    var keys = TEST_LS.map(function (n) { return "t_" + n; });
    // Onboarding belgilari ("t_hp_onb_*") ro'yxatda yo'q - o'zi topiladi
    try {
      for (var i = 0; i < window.localStorage.length; i++) {
        var k = window.localStorage.key(i);
        if (k && k.indexOf("t_") === 0 && keys.indexOf(k) === -1) { keys.push(k); }
      }
    } catch (e) {}
    keys.forEach(function (k) {
      try { window.localStorage.removeItem(k); } catch (e) {}
    });
    var cloud = false;
    try { cloud = !!(tg && tg.CloudStorage && tg.isVersionAtLeast && tg.isVersionAtLeast("6.9")); } catch (e) {}
    if (!cloud) { done(); return; }
    try { tg.CloudStorage.removeItems(keys, function () { done(); }); }
    catch (e) { done(); }
  }

  function testStart() {
    testAsk(testTx("askIn"), function () {
      try {
        window.localStorage.setItem(TEST_KEY, "1");
        // Kirishda har doim toza boshlansin: qayta yuklangach server tozalanadi
        window.localStorage.setItem(FRESH_KEY, "1");
      } catch (e) {}
      window.location.reload();
    });
  }

  function testExit() {
    try { window.localStorage.removeItem(TEST_KEY); } catch (e) {}
    window.location.reload();
  }

  // Serverdagi sinov hisobini o'chiradi (manfiy raqamli hisob), keyin qurilmani
  function testServerWipe(done) {
    var d = chatInitData();
    if (!d || !window.fetch) { done(); return; }
    fetch(API_TEST_RESET, { method: "POST", headers: { "X-Telegram-Init-Data": d } })
      .then(function (r) { return r.json(); })
      ["catch"](function () { return null; })
      .then(function () { done(); });
  }

  function testReset() {
    testAsk(testTx("askZero"), function () {
      testServerWipe(function () {
        testWipeLocal(function () { window.location.reload(); });
      });
    });
  }

  // Kirgandan keyingi birinchi ochilish: hisobni tozalab, chinakam noldan boshlaymiz
  function testFreshCheck() {
    if (!HP_TEST) { return; }
    var fresh = false;
    try { fresh = window.localStorage.getItem(FRESH_KEY) === "1"; } catch (e) {}
    if (!fresh) { return; }
    try { window.localStorage.removeItem(FRESH_KEY); } catch (e) {}
    testServerWipe(function () {
      testWipeLocal(function () { window.location.reload(); });
    });
  }

  function testBar() {
    if (!HP_TEST || document.querySelector(".hptest-bar")) { return; }
    document.body.classList.add("hptest");
    var bar = document.createElement("div");
    bar.className = "hptest-bar";
    var tag = document.createElement("span");
    tag.textContent = testTx("bar");
    var zero = document.createElement("button");
    zero.type = "button";
    zero.textContent = testTx("zero");
    zero.addEventListener("click", testReset);
    var out = document.createElement("button");
    out.type = "button";
    out.textContent = testTx("exit");
    out.addEventListener("click", testExit);
    bar.appendChild(tag);
    bar.appendChild(zero);
    bar.appendChild(out);
    document.body.appendChild(bar);
  }

  function jrAdminCheck() {
    if (jrAdminAsked || chatAdmin || !window.fetch) { return; }
    var d = chatInitData();
    if (!d) { return; }
    jrAdminAsked = true;
    fetch(API_CHAT + "?room=global", { headers: { "X-Telegram-Init-Data": d } })
      .then(function (r) { return r.json(); })
      .then(function (res) { if (res && res.admin !== undefined) { chatAdmin = !!res.admin; } })
      ["catch"](function () { jrAdminAsked = false; });
  }

  // Ko'rishdan chiqish: asl fakultet ranglari bilan Xogvartsga
  function endPreview() {
    if (!jrPreview) { return false; }
    jrPreview = false;
    trStop();
    closeLetter();
    applyHouse(house);
    openHub();
    return true;
  }

  function jrLetterCancel() {
    closeLetter();
    endPreview();
  }

  // 9¾ ortiga: saralangan - Xogvarts (hub), saralanmagan - Diagon xiyoboni.
  function enterWorld() { if (hasHouse()) { openHub(); } else { openAlley(); } }

  function alleyVisible() {
    var el = $("scr-alley");
    return !!el && !el.classList.contains("hidden");
  }

  // Fakultet serverdan kechroq kelsa - xiyobonda qolib ketmasin
  function jrRecheck() { if (alleyVisible() && hasHouse()) { openHub(); } }

  function jrHideAll() {
    ["scr-cat", "scr-hub", "scr-world", "scr-prof", "scr-detail", "scr-lang", "scr-alley", "scr-train",
     "scr-vault", "scr-ticket",
     "scr-hat", "scr-think", "scr-sort", "scr-reveal"].forEach(function (id) {
      var el = $(id);
      if (el) { el.classList.add("hidden"); }
    });
  }

  function openAlley() {
    if (hasHouse()) { openHub(); return; }
    stopSortTimer();
    trStop();
    journey = null;
    jrHideAll();
    $("scr-alley").classList.remove("hidden");
    try { window.scrollTo(0, 0); } catch (e) {}
    onbStep("alley");
    renderAlley();
  }

  function leaveAlley() {
    if (endPreview()) { return; }
    $("scr-alley").classList.add("hidden");
    $("scr-cat").classList.remove("hidden");
    renderCatalog();
  }

  function renderAlley() {
    var rode = jrGet(TRAIN_KEY);
    var wand = jrWandNow();
    $("al-pv").textContent = al("pvTag");
    $("al-pv").classList.toggle("hidden", !jrPreview);
    $("al-back").innerHTML = hubSvg(AL_ICONS.book);
    $("al-back").setAttribute("aria-label", LIB_TITLE[lang] || "");
    walShow($("al-wal"));
    $("al-letter-btn").innerHTML = hubSvg(AL_ICONS.letter);
    $("al-letter-btn").setAttribute("aria-label", al("letterAria"));
    $("al-kick").textContent = al("kick");
    $("al-title").textContent = al("title");
    $("al-intro").textContent = al("intro");

    // Faqat XIYOBONDAGI joylar. Vokzal va Katta zal boshqa shaharda -
    // butun yo'l xatning o'zida kuzatiladi (ltPath).
    var steps = jrSteps().filter(function (st) { return st.alley; });
    var next = jrNext(steps);
    steps.forEach(function (st) { st.on = (st === next); });

    var path = $("al-path");
    path.innerHTML = "";
    var done = 0;
    steps.forEach(function (st) {
      if (st.done) { done++; }
      var el = jrEl("button", "al-step" + (st.done ? " done" : st.on ? " on" : " lock"));
      el.type = "button";
      var mk = jrEl("span", "al-mk");
      mk.innerHTML = hubSvg(st.done ? AL_ICONS.check : AL_ICONS[st.icon]);
      el.appendChild(mk);
      var tx = jrEl("span", "al-tx");
      tx.appendChild(jrEl("small", "", st.place));
      tx.appendChild(jrEl("b", "", st.title));
      tx.appendChild(jrEl("span", "", st.sub));
      if (st.on) {
        var cta = jrEl("span", "al-cta", st.cta);
        cta.insertAdjacentHTML("beforeend", hubSvg(AL_ICONS.arrow));
        tx.appendChild(cta);
      }
      el.appendChild(tx);
      el.onclick = function () {
        if (st.on) { st.go(); return; }
        if (st.done) { return; }
        el.classList.remove("shake");
        try { void el.offsetWidth; } catch (e) {}
        el.classList.add("shake");
        try { if (tg && tg.HapticFeedback) { tg.HapticFeedback.notificationOccurred("warning"); } } catch (e) {}
      };
      path.appendChild(el);
    });

    // Kundalik xatda; bu yerda bitta do'kon qolsa yo'lakcha ortiqcha
    var prog = document.querySelector(".al-prog");
    if (prog) { prog.classList.toggle("hidden", steps.length < 2); }
    $("al-prog-t").textContent = al("prog");
    $("al-prog-n").textContent = done + " / " + steps.length;
    $("al-prog-b").style.width = Math.round(done / steps.length * 100) + "%";
  }

  // Savollardan chiqish (Telegram "Orqaga" yoki 1-savoldagi "Chiqish") - xiyobonga
  function jrQuit() {
    stopSortTimer();
    hideSortScreens();
    openAlley();
  }

  /* Yo'lning barcha qadamlari - YAGONA MANBA. Xat kundalik sifatida hammasini
     ko'rsatadi, xiyobon esa faqat o'zidagilarini (`alley: true`). */
  function jrSteps() {
    var w = jrWandNow(), rode = jrGet(TRAIN_KEY), sorted = hasHouse();
    var vault = walHas("vault");
    return [
      { icon: "bank", alley: true, done: vault, place: al("s0p"), title: al("s0t"),
        sub: vault ? al("s0d").replace("%s", walSum()) : al("s0s"), cta: al("s0c"),
        go: alleyGo(openVault) },
      { icon: "wand", alley: true, done: !!w, place: al("s1p"), title: al("s1t"),
        sub: !vault ? al("s1l") : ((w && wandLabel(w, lang)) || al("s1s")), cta: al("s1c"), lock: !vault,
        go: alleyGo(jrWand) },
      { icon: "ticket", done: walHas("ticket"), place: al("sTp"), title: al("sTt"),
        sub: !w ? al("sTl") : (walHas("ticket") ? al("sTd") : al("sTs")), cta: al("sTc"), lock: !w,
        go: function () { closeLetter(); openTicket(); } },
      { icon: "train", done: !!w && rode, place: al("s2p"), title: al("s2t"),
        sub: !walHas("ticket") ? al("s2n") : (rode ? al("s2d") : al("s2s")), cta: al("s2c"),
        lock: !walHas("ticket"),
        go: function () { closeLetter(); openTrain(); } },
      { icon: "castle", done: sorted, place: al("s3p"), title: al("s3t"),
        sub: (w && rode) || sorted ? al("s3s") : al("s3l"), cta: al("s3c"),
        go: function () { closeLetter(); jrSort(); } }
    ];
  }

  /* Xiyobondagi ish: ko'chada bo'lsak - to'g'ri do'konga, bo'lmasa avval
     g'isht devor ochilib, xiyobonning o'zi ko'rinadi (asardagi yo'l). */
  function alleyGo(fn) {
    return function () {
      if (alleyVisible()) { closeLetter(); fn(); return; }
      jrToAlley();
    };
  }

  // Birinchi bajarilmagan qadam - hozir qilinishi kerak bo'lgani
  function jrNext(steps) {
    for (var i = 0; i < steps.length; i++) { if (!steps[i].done) { return steps[i]; } }
    return null;
  }

  // Xatdan xiyobonga: g'isht devor ochilib, ko'cha ko'rinadi
  function jrToAlley() {
    playGate(function () { closeLetter(); openAlley(); });
  }

  function jrWand() {
    $("scr-alley").classList.add("hidden");
    startWand();
    journey = "wand";
  }

  function jrSort() {
    trStop();
    $("scr-train").classList.add("hidden");
    $("scr-alley").classList.add("hidden");
    startSorting();
    journey = "house";
  }

  // ---------------------------------------------------------------- maktub
  function openLetter(readOnly) {
    // Qayta o'qish (readOnly) emas, haqiqiy yo'l boshlanishi - voronkaning
    // birinchi qadami. Davom etganlar "alley" bilan ajraladi.
    if (!readOnly) { onbStep("letter"); }
    var u = tgUser();
    var name = u ? (u.first_name || fullName(u)) : T[lang].guest;
    $("lt-seal").textContent = al("seal");
    $("lt-school").textContent = al("school");
    $("lt-hi").textContent = al("hi").replace("%s", name);
    $("lt-body").textContent = al("body");
    ltPath(readOnly);
    $("lt-share").innerHTML = hubSvg(AL_ICONS.share) + "<span>" + al("share") + "</span>";
    $("lt-sign").textContent = al("sign");
    // Qayta o'qiyotganda pastdagi tugma "Yopish" bo'ladi
    $("lt-later").textContent = readOnly ? al("close") : al("later");
    $("lt").scrollTop = 0;
    $("lt").classList.remove("hidden");
    ltFit();
  }

  /* Xat BITTA EKRANGA sig'ishi kerak: Telegram'da pastga surish ilovani
     yopib yuborardi va odam xatni o'qiy olmasdi. Sig'masa yozuvlar ikki
     bosqichda kichrayadi (.lt-sm -> .lt-xs). */
  function ltFit() {
    var box = $("lt"), card = document.querySelector(".lt-card");
    if (!box || !card) { return; }
    card.classList.remove("lt-sm", "lt-xs");
    var joy = box.clientHeight - 48;        // tepa/past bo'shlig'i
    if (card.offsetHeight <= joy) { return; }
    card.classList.add("lt-sm");
    if (card.offsetHeight > joy) { card.classList.add("lt-xs"); }
  }

  function closeLetter() { $("lt").classList.add("hidden"); }

  /* Xatni ulashish. Server ismga qarab 9:16 rasm yasaydi (bir marta), keyin:
       1) Telegram Stories (7.8+) - eng yaxshisi;
       2) chatga tayyor xabar (8.0+);
       3) oddiy havola (eski Telegram).
     Rasm manzili tokenli - unda ism ham, odam raqami ham yo'q. */
  var API_XAT = "https://bot.tizimshunos.uz/api/xat";
  var xatBor = null;            // {url, share_id} - bir marta so'raladi
  var xatBand = false;

  function xatOl(done) {
    if (xatBor) { done(xatBor); return; }
    var d = chatInitData();
    if (!d || !window.fetch) { done(null); return; }
    fetch(API_XAT, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Telegram-Init-Data": d },
      body: JSON.stringify({ lang: lang })
    }).then(function (r) { return r.json(); })
      .then(function (res) {
        xatBor = (res && res.ok && res.url) ? res : null;
        done(xatBor);
      })["catch"](function () { done(null); });
  }

  function xatStory(url) {
    var params = { text: al("shareStory") };
    try {
      // Havolali tasma faqat Premium hisoblarda ishlaydi - bo'lmasa havolasiz
      tg.shareToStory(url, {
        text: params.text,
        widget_link: { url: "https://t.me/" + BOT + "/catalog?startapp=olam",
                       name: al("shareBtn") }
      });
      return true;
    } catch (e) {}
    try { tg.shareToStory(url, params); return true; } catch (e) {}
    return false;
  }

  function ltShare() {
    if (xatBand) { return; }
    xatBand = true;
    var kut = showToast(al("shareWait"));
    xatOl(function (res) {
      xatBand = false;
      dismissNote(kut);
      if (!res) { showToast(al("shareErr"), "err"); return; }

      var story = false, chat = false;
      try { story = !!(tg && tg.shareToStory && tg.isVersionAtLeast && tg.isVersionAtLeast("7.8")); } catch (e) {}
      try { chat = !!(tg && tg.shareMessage && tg.isVersionAtLeast && tg.isVersionAtLeast("8.0")); } catch (e) {}

      if (story && xatStory(res.url)) { return; }
      if (chat && res.share_id) {
        try { tg.shareMessage(res.share_id, function () {}); return; } catch (e) {}
      }
      // Eng eski holat: rasmni shunchaki ochamiz - odam o'zi saqlaydi
      try { tg.openLink ? tg.openLink(res.url) : window.open(res.url, "_blank"); }
      catch (e) { showToast(al("shareErr"), "err"); }
    });
  }

  /* Xatdagi yo'l kundaligi: bajarilgani ✓ bo'lib chiziladi, navbatdagisi
     ajralib turadi va bosilsa o'sha ishga olib boradi, qolganlari qulflangan. */
  function ltPath(readOnly) {
    var box = $("lt-list");
    box.innerHTML = "";
    var steps = jrSteps(), next = jrNext(steps), done = 0;

    steps.forEach(function (st) {
      if (st.done) { done++; }
      var on = (st === next);
      var el = jrEl("button", "lt-step " + (st.done ? "done" : on ? "on" : "lock"));
      el.type = "button";
      var mk = jrEl("span", "lt-mk");
      mk.innerHTML = hubSvg(st.done ? AL_ICONS.check : AL_ICONS[st.icon]);
      el.appendChild(mk);
      var tx = jrEl("span", "lt-st");
      tx.appendChild(jrEl("span", "lt-st-t", st.title));
      // Qulflangan qadamlarda izoh yozilmaydi: kundalik bitta ekranga sig'sin
      if (on || st.done) { tx.appendChild(jrEl("span", "lt-st-s", st.sub)); }
      el.appendChild(tx);
      el.onclick = function () {
        if (on) { jrSet(LETTER_KEY); st.go(); return; }
        if (st.done) { return; }
        el.classList.remove("shake");
        try { void el.offsetWidth; } catch (e) {}
        el.classList.add("shake");
        try { if (tg && tg.HapticFeedback) { tg.HapticFeedback.notificationOccurred("warning"); } } catch (e) {}
      };
      box.appendChild(el);
    });

    $("lt-prog-b").style.width = Math.round(done / steps.length * 100) + "%";

    // Asosiy tugma har doim navbatdagi ishni bajaradi
    var go = $("lt-go");
    if (!next) {
      go.textContent = al("close");
      go.onclick = closeLetter;
    } else {
      // Xiyobondan tashqarida turganda birinchi qadam avval ko'chaga olib boradi
      var toAlley = next.alley && !alleyVisible();
      go.textContent = toAlley ? al("go") : (next.cta || al("go"));
      go.onclick = function () {
        jrSet(LETTER_KEY);
        next.go();
      };
    }
  }

  /* ---------------------------------------------------------------- GRINGOTTS HAMYONI
     Onboarding iqtisodi: xona ochilganda 25 galleon beriladi, tayoqcha
     shundan sotib olinadi, bilet bepul (Xagrid beradi).
     Haqiqiy holat SERVERDA (hpcup), bu yerda faqat nusxasi turadi. */
  var API_WALLET = "https://bot.tizimshunos.uz/api/wallet";
  var wal = null;              // {galleons, vault, wand, ticket, prices}
  var PRICE_FALLBACK = { wand: 7 };

  function walHas(k) { return !!(wal && wal[k]); }
  function walSum() { return wal ? (wal.galleons || 0) : 0; }

  // Mahalliy sinov (localhost, imzo yo'q): hamyon shu qurilmada yuradi.
  // Jonli Telegram'da bu yo'l ISHLAMAYDI - haqiqiy holat serverdan keladi.
  function walLocal(action, item) {
    var key = TK("hp_wal_demo"), w;
    try { w = JSON.parse(window.localStorage.getItem(key) || "null"); } catch (e) { w = null; }
    if (!w) { w = { galleons: 0, vault: false, wand: false, ticket: false, prices: PRICE_FALLBACK }; }
    var res = { ok: true, wallet: w };
    if (action === "vault" && !w.vault) { w.vault = true; w.galleons += 25; res["new"] = true; }
    else if (action === "buy") {
      var narx = item === "wand" ? w.prices.wand : 0;
      if (!narx || w.wand || w.galleons < narx) { res.ok = false; }
      else { w.galleons -= narx; w.wand = true; }
    } else if (action === "ticket") {
      if (!w.wand) { res.ok = false; } else { w.ticket = true; }
    }
    try { window.localStorage.setItem(key, JSON.stringify(w)); } catch (e) {}
    wal = w;
    return res;
  }

  function walIsLocal() {
    return !chatInitData() && (window.location.hostname === "localhost"
      || window.location.hostname === "127.0.0.1" || window.location.protocol === "file:");
  }

  // Serverga murojaat. Javob kelmasa (masalan tarmoq uzilsa) - jim o'tadi.
  function walApi(action, item, done) {
    if (walIsLocal()) {
      var res = walLocal(action, item);
      setTimeout(function () { done && done(res); }, 40);
      return;
    }
    var d = chatInitData();
    if (!d || !window.fetch) { done && done(null); return; }
    fetch(API_WALLET, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Telegram-Init-Data": d },
      body: JSON.stringify({ action: action, item: item || "" })
    }).then(function (r) { return r.json(); })
      .then(function (res) {
        if (res && res.wallet) { wal = res.wallet; }
        done && done(res);
      })["catch"](function () { done && done(null); });
  }

  function walLoad(done) { walApi("get", null, function () { done && done(); }); }

  function walShow(el) {
    if (!el) { return; }
    el.textContent = walSum();
    el.classList.toggle("hidden", !walHas("vault"));
  }

  /* ---------- Gringotts: aravachada yer ostiga ---------- */
  var grTimer = null;

  function grStop() { if (grTimer) { clearTimeout(grTimer); grTimer = null; } }

  function openVault() {
    grStop();
    jrHideAll();
    $("scr-vault").classList.remove("hidden");
    $("gr-back").innerHTML = hubSvg(AL_ICONS.back);
    $("gr-kick").textContent = al("grKick");
    $("gr-title").textContent = al("grTitle");
    try { window.scrollTo(0, 0); } catch (e) {}
    if (walHas("vault")) { grVault(false); return; }
    grIntro();
  }

  function grIntro() {
    var st = $("gr-stage");
    st.className = "gr-center";
    st.innerHTML = "";
    st.appendChild(jrEl("p", "tr-p", al("grP1")));
    var b = jrEl("button", "tr-go", al("grGo"));
    b.type = "button";
    b.onclick = grRide;
    st.appendChild(b);
  }

  // Tunnel: yorug'liklar yuqoridan pastga uchadi (rAF emas - CSS animatsiya)
  function grSparks(box) {
    var t = jrEl("div", "gr-tunnel");
    for (var i = 0; i < 26; i++) {
      var sp = jrEl("span", "gr-spark");
      sp.style.left = Math.round(Math.random() * 100) + "%";
      sp.style.animationDuration = (0.5 + Math.random() * 0.7).toFixed(2) + "s";
      sp.style.animationDelay = (Math.random() * 0.9).toFixed(2) + "s";
      t.appendChild(sp);
    }
    box.appendChild(t);
    setTimeout(function () { t.classList.add("on"); }, 20);
    return t;
  }

  function grRide() {
    var st = $("gr-stage");
    st.className = "gr-ride";
    st.innerHTML = "";
    grSparks(st);
    var lines = al("grRide") || [];
    var line = jrEl("p", "gr-line", lines[0] || "");
    st.appendChild(line);
    try { if (tg && tg.HapticFeedback) { tg.HapticFeedback.impactOccurred("medium"); } } catch (e) {}

    var i = 0;
    function next() {
      i++;
      if (i >= lines.length) { grDoor(); return; }
      line.textContent = lines[i];
      line.style.animation = "none";
      try { void line.offsetWidth; } catch (e) {}
      line.style.animation = "";
      grTimer = setTimeout(next, 1700);
    }
    grTimer = setTimeout(next, 1700);
    st.onclick = function () { grStop(); next(); };
  }

  function grDoor() {
    grStop();
    var st = $("gr-stage");
    st.onclick = null;
    st.className = "gr-center";
    st.innerHTML = "";
    var door = jrEl("div", "gr-door");
    door.innerHTML = hubSvg(AL_ICONS.bank);
    var coins = jrEl("div", "gr-coins");
    for (var i = 0; i < 14; i++) {
      var c = jrEl("span", "gr-coin");
      c.style.left = (12 + Math.random() * 70) + "%";
      c.style.top = (18 + Math.random() * 62) + "%";
      coins.appendChild(c);
    }
    door.appendChild(coins);
    st.appendChild(door);
    var b = jrEl("button", "tr-go", al("grOpen"));
    b.type = "button";
    b.onclick = function () {
      b.disabled = true;
      door.classList.add("open");
      try { if (tg && tg.HapticFeedback) { tg.HapticFeedback.notificationOccurred("success"); } } catch (e) {}
      walApi("vault", null, function () {
        onbStep("gringotts");
        setTimeout(function () { grVault(true); }, 700);
      });
    };
    st.appendChild(b);
  }

  // Xona ochilgandan keyingi ko'rinish (qayta kirganda ham shu)
  function grVault(yangi) {
    var st = $("gr-stage");
    st.className = "gr-center";
    st.innerHTML = "";
    var sum = jrEl("div", "gr-sum", String(walSum()));
    sum.appendChild(jrEl("small", "", al("grGot")));
    st.appendChild(sum);
    st.appendChild(jrEl("p", "tr-note", al("grDone")));
    var b = jrEl("button", "tr-go", al("grNext"));
    b.type = "button";
    b.onclick = openAlley;
    st.appendChild(b);
    if (yangi) { renderWorldBtn(); }
  }

  /* ---------- Xagrid biletni beradi ---------- */
  function openTicket() {
    jrHideAll();
    $("scr-ticket").classList.remove("hidden");
    $("tk-back").innerHTML = hubSvg(AL_ICONS.back);
    $("tk-kick").textContent = al("tkKick");
    $("tk-title").textContent = al("tkTitle");
    try { window.scrollTo(0, 0); } catch (e) {}
    renderTicket();
  }

  function renderTicket() {
    var st = $("tk-stage");
    st.className = "tk-wrap";
    st.innerHTML = "";
    st.appendChild(jrEl("p", "tk-say", al("tkSay")));

    var card = jrEl("div", "tk-card");
    card.appendChild(jrEl("div", "tk-top", al("tkTop")));
    card.appendChild(jrEl("div", "tk-big", "9¾"));
    card.appendChild(jrEl("div", "tk-sub", al("tkSub")));
    var row = jrEl("div", "tk-row");
    [[al("tkWhen"), al("tkWhenV")], [al("tkSeat"), al("tkSeatV")]].forEach(function (pair) {
      var cell = jrEl("span", "tk-cell");
      cell.appendChild(jrEl("small", "", pair[0]));
      cell.appendChild(jrEl("b", "", pair[1]));
      row.appendChild(cell);
    });
    card.appendChild(row);
    st.appendChild(card);

    var b = jrEl("button", "tr-go", walHas("ticket") ? al("tkNext") : al("tkGo"));
    b.type = "button";
    b.style.marginTop = "22px";
    b.onclick = function () {
      if (walHas("ticket")) { openTrain(); return; }
      b.disabled = true;
      walApi("ticket", null, function (res) {
        b.disabled = false;
        if (res && res.ok) {
          onbStep("ticket");
          renderWorldBtn();
          try { if (tg && tg.HapticFeedback) { tg.HapticFeedback.notificationOccurred("success"); } } catch (e) {}
          renderTicket();
        }
      });
    };
    st.appendChild(b);
  }

  // ---------------------------------------------------------------- 9¾ platforma
  function trStop() {
    if (trTimer) { clearTimeout(trTimer); trTimer = null; }
  }

  function openTrain() {
    // Biletsiz platformaga chiqib bo'lmaydi (eski foydalanuvchilarda bilet
    // belgisi yo'q, lekin ular allaqachon saralangan - bu yerga tushmaydi).
    if (!jrWandNow()) { openAlley(); return; }
    if (!walHas("ticket")) { openTicket(); return; }
    trStop();
    jrHideAll();
    $("scr-train").classList.remove("hidden");
    try { window.scrollTo(0, 0); } catch (e) {}
    $("tr-back").innerHTML = hubSvg(AL_ICONS.back);
    $("tr-back").setAttribute("aria-label", al("title"));
    $("tr-kick").textContent = al("s2p");
    $("tr-title").textContent = al("s2t");
    var stage = $("tr-stage");
    stage.innerHTML = "";
    var wrap = jrEl("div", "tr-center");
    var sign = jrEl("div", "tr-sign");
    sign.appendChild(jrEl("small", "", al("trSign")));
    sign.appendChild(jrEl("b", "", "9¾"));
    sign.appendChild(jrEl("span", "", al("trSignSub")));
    wrap.appendChild(sign);
    wrap.appendChild(jrEl("p", "tr-p", al("trP1")));
    wrap.appendChild(jrEl("p", "tr-note", al("trP2")));
    var go = jrEl("button", "tr-go", al("trGo"));
    go.type = "button";
    go.onclick = trRun;
    wrap.appendChild(go);
    stage.appendChild(wrap);
  }

  // Devorga yurish: ekranni bug' qoplaydi, ortidan poyezd yo'li
  function trRun() {
    trStop();
    try { if (tg && tg.HapticFeedback) { tg.HapticFeedback.impactOccurred("medium"); } } catch (e) {}
    var fog = $("tr-fog");
    fog.classList.add("on");
    trTimer = setTimeout(function () {
      $("tr-kick").textContent = al("trSignSub");
      $("tr-title").textContent = al("trRideT");
      trRide(0);
      setTimeout(function () { fog.classList.remove("on"); }, 150);
    }, 480);
  }

  function trRide(i) {
    trStop();
    if ($("scr-train").classList.contains("hidden")) { return; }
    var lines = TR_LINES[lang] || TR_LINES.uz;
    if (i >= lines.length) { jrSet(TRAIN_KEY); onbStep("train"); trEnd(); return; }
    var stage = $("tr-stage");
    stage.innerHTML = "";
    var ride = jrEl("div", "tr-ride");
    for (var p = 0; p < 5; p++) {
      var puff = jrEl("i", "tr-puff");
      puff.style.left = (12 + p * 19) + "%";
      puff.style.animationDelay = (-p * 1.4 - i * 0.7) + "s";
      ride.appendChild(puff);
    }
    ride.appendChild(jrEl("p", "tr-line", lines[i]));
    var dots = jrEl("div", "tr-dots");
    for (var k = 0; k < lines.length; k++) { dots.appendChild(jrEl("i", k <= i ? "on" : "")); }
    ride.appendChild(dots);
    ride.appendChild(jrEl("span", "tr-hint", al("trHint")));
    ride.onclick = function () { trRide(i + 1); };
    stage.appendChild(ride);
    trTimer = setTimeout(function () { trRide(i + 1); }, readMs(lines[i]) + 1200);
  }

  function trEnd() {
    $("tr-kick").textContent = al("s3p");
    $("tr-title").textContent = al("s3t");
    var stage = $("tr-stage");
    stage.innerHTML = "";
    var end = jrEl("div", "tr-end");
    var hat = jrEl("div", "tr-hat");
    paintHatSmall(hat);
    end.appendChild(hat);
    end.appendChild(jrEl("h2", "tr-h", al("endT")));
    end.appendChild(jrEl("p", "tr-note", al("endS")));
    var go = jrEl("button", "tr-go", al("endGo"));
    go.type = "button";
    go.onclick = jrSort;
    end.appendChild(go);
    stage.appendChild(end);
    try { if (tg && tg.HapticFeedback) { tg.HapticFeedback.notificationOccurred("success"); } } catch (e) {}
  }

  // ---------------------------------------------------------------- 9¾ eshigi
  // Diagon Alley ravog'i ruhida: g'isht devor paydo bo'ladi, tayoqcha uch g'ishtga
  // tegadi, keyin g'ishtlar o'rtadan chetga qarab bittalab ichkariga buklanib,
  // ravoq ochiladi. Ovoz (snd/gate.m4a, tools/soundgen.py s_gate) shu vaqtlarga
  // moslangan - GATE_* ni o'zgartirsangiz, ovozni ham qayta yarating.
  var GATE_FADE = 160, GATE_TAPS = [200, 290, 380], GATE_SWAP = 520, GATE_OPEN = 820;
  var gateSnd = { ctx: null, data: null, buf: null };
  var gateBusy = false;

  function gatePreload() {
    if (gateSnd.buf || gateSnd.data || !window.fetch) { return; }
    gateSnd.data = true;   // yuklanmoqda
    fetch("snd/gate.m4a?v=2").then(function (r) { return r.arrayBuffer(); })
      .then(function (d) { gateSnd.data = d; })["catch"](function () { gateSnd.data = null; });
  }

  function gateSound(t0) {
    try {
      // iPhone jim rejimda bo'lsa, eshik ham jim ochiladi
      if (navigator.audioSession) { navigator.audioSession.type = "ambient"; }
      if (!gateSnd.ctx) {
        var AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) { return; }
        gateSnd.ctx = new AC();
      }
      var ctx = gateSnd.ctx;
      if (ctx.state === "suspended") { ctx.resume(); }
      var play = function (buf) {
        var late = (Date.now() - t0) / 1000;
        if (late > 0.35) { return; }   // juda kechiksa, ovoz animatsiyadan ajralib qoladi
        var src = ctx.createBufferSource();
        src.buffer = buf;
        src.connect(ctx.destination);
        src.start(0, late);
      };
      if (gateSnd.buf) { play(gateSnd.buf); return; }
      if (gateSnd.data && gateSnd.data.byteLength) {
        var d = gateSnd.data;
        gateSnd.data = null;             // decodeAudioData buferni o'zlashtirib oladi
        ctx.decodeAudioData(d, function (buf) { gateSnd.buf = buf; play(buf); }, function () {});
      } else { gatePreload(); }
    } catch (e) {}
  }

  function gateRound(g, x, y, w, h, r) {
    g.beginPath();
    g.moveTo(x + r, y);
    g.lineTo(x + w - r, y); g.quadraticCurveTo(x + w, y, x + w, y + r);
    g.lineTo(x + w, y + h - r); g.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    g.lineTo(x + r, y + h); g.quadraticCurveTo(x, y + h, x, y + h - r);
    g.lineTo(x, y + r); g.quadraticCurveTo(x, y, x + r, y);
    g.closePath();
  }

  // Bir necha xil g'isht (rang, dog'lar, qirralar) - devor bir xil ko'rinmasin.
  function gateSprites(bw, bh, sc) {
    var bases = [[122, 58, 40], [106, 50, 36], [134, 68, 46], [96, 46, 34],
                 [118, 64, 44], [140, 76, 52], [102, 56, 42], [128, 54, 38]];
    return bases.map(function (b) {
      var c = document.createElement("canvas");
      c.width = Math.ceil(bw * sc); c.height = Math.ceil(bh * sc);
      var g = c.getContext("2d");
      g.scale(sc, sc);
      var gr = g.createLinearGradient(0, 0, 0, bh);
      gr.addColorStop(0, "rgb(" + (b[0] + 18) + "," + (b[1] + 10) + "," + (b[2] + 8) + ")");
      gr.addColorStop(1, "rgb(" + (b[0] - 24) + "," + (b[1] - 15) + "," + (b[2] - 11) + ")");
      g.fillStyle = gr;
      gateRound(g, 0, 0, bw, bh, 2.5);
      g.fill();
      for (var i = 0; i < 30; i++) {
        var r = Math.random() * 2.2 + 0.6;
        g.fillStyle = Math.random() < 0.55 ? "rgba(0,0,0," + (Math.random() * 0.22).toFixed(3) + ")"
                                           : "rgba(255,222,190," + (Math.random() * 0.1).toFixed(3) + ")";
        g.fillRect(Math.random() * bw, Math.random() * bh, r, r);
      }
      g.fillStyle = "rgba(255,215,180,.14)"; g.fillRect(2, 0.5, bw - 4, 1.2);
      g.fillStyle = "rgba(0,0,0,.3)"; g.fillRect(2, bh - 1.8, bw - 4, 1.8);
      return c;
    });
  }

  function gateLayout(W, H) {
    var bh = Math.max(24, Math.round(H / 30)), bw = Math.round(bh * 2.3), gap = 3;
    var cw = bw + gap, ch = bh + gap, cx = W / 2, cy = H * 0.55;
    var bricks = [], dust = [], maxd = 0;
    for (var r = 0; r * ch < H + ch; r++) {
      var off = r % 2 ? -cw / 2 : -cw;
      for (var c = 0; off + c * cw < W + cw; c++) {
        var x = off + c * cw, y = r * ch - gap;
        var dx = (x + bw / 2 - cx) / (W * 0.5), dy = (y + bh / 2 - cy) / (H * 0.62);
        var d = Math.sqrt(dx * dx + dy * dy);
        if (d > maxd) { maxd = d; }
        bricks.push({ x: x, y: y, d: d, sp: Math.floor(Math.random() * 8),
                      rot: (Math.random() - 0.5) * 0.6, j: Math.random() * 0.05 });
      }
    }
    bricks.forEach(function (b) { b.d /= maxd; });
    // tayoqcha tegadigan uch g'isht - o'rtaga eng yaqinlari
    var near = bricks.slice().sort(function (a, b) { return a.d - b.d; }).slice(0, 3);
    // surilgan g'isht ortidan ko'tariladigan chang
    bricks.forEach(function (b, k) {
      if (k % 3) { return; }
      var n = 2;
      while (n--) {
        var ang = Math.atan2(b.y + bh / 2 - cy, b.x + bw / 2 - cx) + (Math.random() - 0.5) * 1.2;
        var sp = 20 + Math.random() * 60;
        dust.push({ x: b.x + Math.random() * bw, y: b.y + Math.random() * bh,
                    vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp - 15,
                    t0: b.d * 0.55 + b.j + 0.12, life: 0.35 + Math.random() * 0.3, r: 1 + Math.random() * 2 });
      }
    });
    return { W: W, H: H, bw: bw, bh: bh, gap: gap, cx: cx, cy: cy, bricks: bricks, near: near, dust: dust };
  }

  function gateFrame(st, now) {
    var g = st.g, W = st.W, H = st.H, bw = st.bw, bh = st.bh, gap = st.gap, t = now - st.t0;
    var cw = bw + gap, ch = bh + gap;
    g.setTransform(st.sc, 0, 0, st.sc, 0, 0);
    g.globalAlpha = 1;
    g.globalCompositeOperation = "source-over";
    g.clearRect(0, 0, W, H);
    var i, b, big = Math.max(W, H);

    if (t < GATE_SWAP) {
      g.globalAlpha = Math.min(1, t / GATE_FADE);
      g.fillStyle = "#1b120d";
      g.fillRect(0, 0, W, H);
      for (i = 0; i < st.bricks.length; i++) {
        b = st.bricks[i];
        var k = st.near.indexOf(b), push = 0;
        if (k >= 0) {
          var tt = t - GATE_TAPS[k];
          if (tt >= 0 && tt < 140) { push = Math.sin(tt / 140 * Math.PI); }
        }
        if (push) {
          var s1 = 1 - push * 0.08;
          g.drawImage(st.sp[b.sp], b.x + bw * (1 - s1) / 2, b.y + bh * (1 - s1) / 2, bw * s1, bh * s1);
        } else {
          g.drawImage(st.sp[b.sp], b.x, b.y, bw, bh);
        }
      }
      g.globalAlpha = Math.min(1, t / GATE_FADE);
      g.fillStyle = st.vig;
      g.fillRect(0, 0, W, H);
      // tayoqcha uchqunlari
      g.globalCompositeOperation = "lighter";
      for (k = 0; k < 3; k++) {
        var ta = (t - GATE_TAPS[k]) / 260;
        if (ta < 0 || ta > 1) { continue; }
        b = st.near[k];
        var gx = b.x + bw / 2, gy = b.y + bh / 2, rad = 30 + ta * 50;
        var sg = g.createRadialGradient(gx, gy, 0, gx, gy, rad);
        sg.addColorStop(0, "rgba(255,236,190," + (0.9 * (1 - ta)).toFixed(3) + ")");
        sg.addColorStop(0.35, "rgba(240,180,90," + (0.45 * (1 - ta)).toFixed(3) + ")");
        sg.addColorStop(1, "rgba(240,180,90,0)");
        g.fillStyle = sg;
        g.fillRect(gx - rad, gy - rad, rad * 2, rad * 2);
      }
      return;
    }

    var p = (t - GATE_SWAP) / GATE_OPEN;
    for (i = 0; i < st.bricks.length; i++) {
      b = st.bricks[i];
      var q = (p - b.d * 0.55 - b.j) / 0.42;
      if (q >= 1) { continue; }
      q = q < 0 ? 0 : q;
      // qorishma (g'isht orasidagi chok) g'ishtdan tezroq yo'qoladi
      var mq = Math.min(1, q * 1.8);
      if (mq < 1) {
        g.globalAlpha = 1 - mq;
        g.fillStyle = "#1b120d";
        g.fillRect(b.x - gap / 2, b.y - gap / 2, cw, ch);
      }
      var e = q * q, s2 = 1 - e * 0.88;
      var ox = (b.x + bw / 2 - st.cx) / W * 26 * e, oy = (b.y + bh / 2 - st.cy) / H * 26 * e;
      g.globalAlpha = 1 - e;
      g.save();
      g.translate(b.x + bw / 2 + ox, b.y + bh / 2 + oy);
      if (e) { g.rotate(b.rot * e); g.scale(s2, s2); }
      g.drawImage(st.sp[b.sp], -bw / 2, -bh / 2, bw, bh);
      if (e > 0.02) {
        g.globalAlpha = (1 - e) * e * 1.6;
        g.fillStyle = "#000";
        g.fillRect(-bw / 2, -bh / 2, bw, bh);
      }
      g.restore();
    }
    g.globalAlpha = Math.max(0, 1 - p * 1.6);
    g.fillStyle = st.vig;
    g.fillRect(0, 0, W, H);
    // chang
    g.globalAlpha = 1;
    for (i = 0; i < st.dust.length; i++) {
      var ds = st.dust[i], age = p - ds.t0;
      if (age < 0 || age > ds.life) { continue; }
      var sec = age * GATE_OPEN / 1000;
      g.fillStyle = "rgba(214,176,136," + (0.55 * (1 - age / ds.life)).toFixed(3) + ")";
      g.fillRect(ds.x + ds.vx * sec, ds.y + ds.vy * sec, ds.r, ds.r);
    }
    // ravoq ortidan iliq tilla nur
    if (p < 0.6) {
      var fl = Math.sin(p / 0.6 * Math.PI);
      var fr = big * (0.25 + p * 0.7);
      var fg = g.createRadialGradient(st.cx, st.cy, 0, st.cx, st.cy, fr);
      fg.addColorStop(0, "rgba(255,226,160," + (0.42 * fl).toFixed(3) + ")");
      fg.addColorStop(0.4, "rgba(231,170,80," + (0.2 * fl).toFixed(3) + ")");
      fg.addColorStop(1, "rgba(231,170,80,0)");
      g.globalCompositeOperation = "lighter";
      g.fillStyle = fg;
      g.fillRect(0, 0, W, H);
    }
  }

  function playGate(after) {
    var gate = $("w-gate"), cv = $("w-gate-cv");
    var slow = false;
    try { slow = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches; }
    catch (e) { slow = false; }
    if (!gate || !cv || !cv.getContext || slow) { after(); return; }
    if (gateBusy) { return; }
    gateBusy = true;

    var t0 = Date.now();
    gateSound(t0);
    var W = window.innerWidth, H = window.innerHeight, sc = Math.min(2, window.devicePixelRatio || 1);
    cv.width = Math.round(W * sc);
    cv.height = Math.round(H * sc);
    var st = gateLayout(W, H);
    st.g = cv.getContext("2d");
    st.sc = sc;
    st.t0 = t0;
    st.sp = gateSprites(st.bw, st.bh, sc);
    st.vig = st.g.createRadialGradient(st.cx, st.cy, Math.min(W, H) * 0.2, st.cx, st.cy, Math.max(W, H) * 0.75);
    st.vig.addColorStop(0, "rgba(0,0,0,0)");
    st.vig.addColorStop(1, "rgba(0,0,0,.62)");
    st.live = true;

    gate.className = "wgate";
    gate.style.pointerEvents = "auto";   // animatsiya paytida ikkinchi bosish o'tmasin
    var raf = window.requestAnimationFrame || function (f) { return setTimeout(f, 16); };
    (function loop() {
      if (!st.live) { return; }
      gateFrame(st, Date.now());
      raf(loop);
    })();
    // rAF ekran yashiringanda to'xtashi mumkin - asosiy qadamlar setTimeout da
    setTimeout(after, GATE_SWAP);
    setTimeout(function () {
      st.live = false;
      gate.className = "wgate hidden";
      gate.style.pointerEvents = "";
      cv.width = cv.height = 1;
      gateBusy = false;
    }, GATE_SWAP + GATE_OPEN + 60);
  }

  // ---------------------------------------------------------------- sozlama
  var START_KEY = TK("hp_start");        // "lib" (kutubxona) yoki "world" (xarita)

  function readStart() {
    try { return window.localStorage.getItem(START_KEY) === "world" ? "world" : "lib"; }
    catch (e) { return "lib"; }
  }

  function saveStart(v) {
    try { window.localStorage.setItem(START_KEY, v); } catch (e) {}
  }

  var W_SET_TX = {
    title: { uz: "Ilova ochilganda", ru: "При открытии", en: "When the app opens" },
    note: {
      uz: "Xarita tanlansa, ilovani ochganingizda to'g'ridan-to'g'ri sehrli olamga tushasiz.",
      ru: "Если выбрать карту, приложение будет открываться сразу в волшебном мире.",
      en: "Choose the map and the app will open straight into the wizarding world."
    },
    lib: { uz: "Kutubxona", ru: "Библиотека", en: "Library" },
    map: { uz: "Xarita", ru: "Карта", en: "Map" },
    close: { uz: "Yopish", ru: "Закрыть", en: "Close" }
  };

  function renderWorldSettings() {
    var cur = readStart();
    $("w-set-title").textContent = W_SET_TX.title[lang];
    $("w-set-note").textContent = W_SET_TX.note[lang];
    $("w-set-close").textContent = W_SET_TX.close[lang];
    $("w-set-lib").innerHTML = worldIcon("book") + "<span>" + W_SET_TX.lib[lang] + "</span>";
    $("w-set-map").innerHTML = worldIcon("map") + "<span>" + W_SET_TX.map[lang] + "</span>";
    $("w-set-lib").className = cur === "lib" ? "on" : "";
    $("w-set-map").className = cur === "world" ? "on" : "";
  }

  function openWorldSettings() {
    renderWorldSettings();
    $("w-set").classList.remove("hidden");
  }

  function setStart(v) {
    saveStart(v);
    renderWorldSettings();
  }

  // ---------------------------------------------------------------- sonlar
  function worldChatN() {
    try { return (chatCounts.house || 0) + (chatCounts.global || 0) + (chatCounts.dm || 0); }
    catch (e) { return 0; }
  }

  function worldTasksN() {
    try { return (tasksData && tasksData.tasks) ? tasksData.tasks.length : 0; }
    catch (e) { return 0; }
  }

  // Xarita ochiq bo'lsa sonlarni yangilab turamiz.
  function worldRefresh() {
    var w = $("scr-world");
    if (w && !w.classList.contains("hidden")) { renderWorld(); }
    if (hubVisible()) { renderHub(); }
  }

  // ---------------------------------------------------------------- qaytish
  // Xaritadan ochilgan ekran "Ortga" bosilganda xaritaga qaytsin.
  var worldFrom = null;

  function worldReturnTo() {
    if (!worldFrom) { return false; }
    var place = worldFrom;
    worldFrom = null;
    ["scr-cup", "scr-tasks", "scr-quiz", "scr-chat", "scr-refs", "scr-prof",
     "scr-chess-hub", "scr-chess-stats", "scr-hall-full", "scr-feed-full"].forEach(function (id) {
      var el = $(id);
      if (el) { el.classList.add("hidden"); }
    });
    if (place === "hub") { openHub(); } else { openWorld(place); }
    return true;
  }

  function worldGuard(fn) {
    return function () {
      if (worldReturnTo()) { return; }
      return fn.apply(this, arguments);
    };
  }

  // ---------------------------------------------------------------- SEHRLI OLAM
  // Uch xarita: olam -> Xogvarts qasri va Diagon xiyoboni. Rasm soatga qarab
  // almashadi: tong 05-07, kun 07-17, oqshom 17-19, tun 19-05.
  var WORLD_ICONS = {
    castle: "M3 21h18 M5 21V9l3-2 3 2v12 M13 21V6l4-3 4 3v18",
    village: "M4 20h16 M6 20v-8l4-3 4 3v8 M14 20v-6l3-2 3 2v6",
    city: "M4 20V8l5-3 5 3v12 M14 20v-7h6v7 M7 11h1 M7 15h1 M11 11h1 M11 15h1 M17 16h1",
    owl: "M12 7c-3.5 0-6 2.8-6 6.5c0 3.5 2.7 6.5 6 6.5s6-3 6-6.5C18 9.8 15.5 7 12 7z M6.5 9.5L4 4l5 2.2 M17.5 9.5L20 4l-5 2.2 M9.5 12.5h.01 M14.5 12.5h.01",
    chat: "M4 5.5h16v10.5H10l-6 4z M8 9.5h8 M8 12.5h5",
    book: "M12 6.5c-2-1.5-5-2-8-1.5v13c3-.5 6 0 8 1.5c2-1.5 5-2 8-1.5v-13c-3-.5-6 0-8 1.5z M12 6.5v13",
    quiz: "M7 3.5h8l3.5 3.5v13.5h-11.5z M15 3.5v3.5h3.5 M10 11h5.5 M10 14.5h5.5 M10 18h3",
    hall: "M7 3.5h10 M7 20.5h10 M8 3.5c0 4 8 5 8 8.5s-8 4.5-8 8.5 M16 3.5c0 4-8 5-8 8.5s8 4.5 8 8.5",
    chess: "M12 3.8a2.4 2.4 0 1 1 0 4.8a2.4 2.4 0 1 1 0-4.8z M9.6 10.8h4.8 M10.4 10.8l-.9 5.6h5l-.9-5.6 M7.3 20.3h9.4l-1.1-3.9H8.4z",
    wand: "M4 20L15.5 8.5 M15.5 8.5l2-2 M18.5 2.5v3 M21.5 5.5h-3 M20.5 2.5l-1 1 M13 11l-2-2",
    bank: "M3 20h18 M4 20V9h16v11 M12 3l9 6H3z M8 20v-6h3v6 M14 14h3v3h-3z",
    gear: "M12 9a3 3 0 1 0 0 6a3 3 0 1 0 0-6z M19.4 13.5l1.6 1.2-2 3.4-1.9-.7a7 7 0 0 1-2 1.2l-.3 2h-4l-.3-2a7 7 0 0 1-2-1.2l-1.9.7-2-3.4 1.6-1.2a7 7 0 0 1 0-2.9L3 9.3l2-3.4 1.9.7a7 7 0 0 1 2-1.2l.3-2h4l.3 2a7 7 0 0 1 2 1.2l1.9-.7 2 3.4-1.6 1.2a7 7 0 0 1 0 2.9z",
    back: "M15 6l-6 6 6 6",
    map: "M3.5 6.5l6-2.5 5 2.5 6-2.5v13.5l-6 2.5-5-2.5-6 2.5z M9.5 4v13.5 M14.5 6.5V20"
  };

  var WORLD_SOON = { uz: "Tez orada", ru: "Скоро", en: "Coming soon" };
  var WORLD_MAPS = {
    world: {
      img: "world",
      title: { uz: "Sehrgarlar olami", ru: "Мир волшебников", en: "The Wizarding World" },
      sub: { uz: "Joyni tanlang", ru: "Выберите место", en: "Choose a place" },
      pins: [
        { dot: [22, 12], side: "l", top: 15.5, icon: "castle",
          name: { uz: "Xogvarts", ru: "Хогвартс", en: "Hogwarts" },
          sub: { uz: "6 ta joy", ru: "6 мест", en: "6 places" },
          badge: function () { return worldChatN() + worldTasksN(); },
          go: function () { openWorld("castle"); } },
        { dot: [73, 58], side: "r", top: 61.5, icon: "village", soon: true,
          name: { uz: "Xogsmid", ru: "Хогсмид", en: "Hogsmeade" },
          sub: WORLD_SOON, go: null },
        { dot: [24, 84], side: "l", top: 87.5, icon: "city",
          name: { uz: "London", ru: "Лондон", en: "London" },
          sub: { uz: "Diagon xiyoboni", ru: "Косой переулок", en: "Diagon Alley" },
          go: function () { openWorld("alley"); } }
      ]
    },
    castle: {
      img: "castle", parent: "world",
      title: { uz: "Xogvarts qasri", ru: "Замок Хогвартс", en: "Hogwarts Castle" },
      sub: { uz: "Xonani tanlang", ru: "Выберите комнату", en: "Choose a room" },
      pins: [
        { dot: [50, 9], side: "r", top: 13, icon: "owl",
          name: { uz: "Boyqushxona", ru: "Совятня", en: "Owlery" },
          sub: { uz: "Do'stlarni taklif qilish", ru: "Пригласить друзей", en: "Invite friends" },
          go: function () { worldFrom = "castle"; leaveWorld(true); openRefs(); } },
        { dot: [50, 27], side: "l", top: 24, icon: "chat",
          name: { uz: "Umumiy xona", ru: "Гостиная", en: "Common Room" },
          sub: { uz: "Muloqot", ru: "Общение", en: "Chat" },
          badge: worldChatN,
          go: function () { worldFrom = "castle"; leaveWorld(true); openChat(); } },
        { dot: [50, 43], side: "r", top: 40, icon: "book",
          name: { uz: "Kutubxona", ru: "Библиотека", en: "Library" },
          sub: { uz: "Filmlar", ru: "Фильмы", en: "Films" },
          go: function () { leaveWorld(false); } },
        { dot: [50, 58], side: "l", top: 55, icon: "quiz",
          name: { uz: "Darsxona", ru: "Класс", en: "Classroom" },
          sub: { uz: "Kunlik savol", ru: "Вопрос дня", en: "Daily question" },
          badge: worldTasksN,
          go: function () { worldFrom = "castle"; leaveWorld(true); openTasks(); } },
        { dot: [50, 73], side: "r", top: 70, icon: "hall",
          name: { uz: "Katta zal", ru: "Большой зал", en: "Great Hall" },
          sub: { uz: "Kubok · imtihon", ru: "Кубок · экзамен", en: "Cup · exam" },
          go: function () { worldFrom = "castle"; leaveWorld(true); openCup(); } },
        { dot: [50, 89], side: "l", top: 86, icon: "chess",
          name: { uz: "Shaxmat kamerasi", ru: "Шахматный зал", en: "Chess Chamber" },
          sub: { uz: "Sehrgar shaxmati", ru: "Волшебные шахматы", en: "Wizard chess" },
          go: function () { worldFrom = "castle"; leaveWorld(true); openChessHub(); } }
      ]
    },
    alley: {
      img: "alley", parent: "world",
      title: { uz: "Diagon xiyoboni", ru: "Косой переулок", en: "Diagon Alley" },
      sub: { uz: "London", ru: "Лондон", en: "London" },
      pins: [
        { dot: [56, 14], side: "l", top: 17, icon: "bank", soon: true,
          name: { uz: "Gringotts", ru: "Гринготтс", en: "Gringotts" },
          sub: WORLD_SOON, go: null },
        { dot: [78, 70], side: "l", top: 74, icon: "wand",
          name: { uz: "Olivander do'koni", ru: "Лавка Олливандера", en: "Ollivanders" },
          sub: { uz: "Tayoqchangizni toping", ru: "Найдите палочку", en: "Find your wand" },
          go: function () { worldFrom = "alley"; leaveWorld(true); if (wand) { openProfile(); } else { startWand(); } } }
      ]
    }
  };

  var worldPlace = "world";

  // Kun qismi: tong 05:00-07:00, kun 07:00-17:00, oqshom 17:00-19:00, tun 19:00-05:00.
  function worldPhase() {
    var h = new Date().getHours();
    if (h >= 7 && h < 17) { return "kun"; }
    if (h >= 17 && h < 19) { return "oqshom"; }
    if (h >= 5 && h < 7) { return "tong"; }
    return "tun";
  }

  function worldIcon(name) {
    if (!WORLD_ICONS[name]) { return ""; }
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" ' +
           'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="' +
           WORLD_ICONS[name] + '"></path></svg>';
  }

  function renderWorld() {
    var map = WORLD_MAPS[worldPlace];
    var bg = $("w-bg");
    var phase = worldPhase();
    bg.onerror = function () {
      // Bu joy uchun shu payt rasmi hali yo'q bo'lsa - kunduzgisi.
      if (this.src.indexOf("_kun.jpg") === -1) { this.src = "img/world/" + map.img + "_kun.jpg"; }
    };
    bg.src = "img/world/" + map.img + "_" + phase + ".jpg";

    $("w-title").textContent = map.title[lang];
    $("w-sub").textContent = map.sub[lang];

    var left = $("w-left");
    var right = $("w-right");
    left.className = "w-glass";
    right.className = "w-glass";
    if (map.parent) {
      left.innerHTML = worldIcon("back") + "<span>" +
                       (lang === "ru" ? "Карта" : (lang === "en" ? "Map" : "Xarita")) + "</span>";
      left.onclick = function () { openWorld(map.parent); };
      right.innerHTML = "";
      right.appendChild(document.createTextNode(meShort()));
      var crest = document.createElement("span");
      paintCrest(crest, house);
      right.appendChild(crest);
      right.onclick = function () { worldFrom = worldPlace; leaveWorld(true); openProfile(); };
    } else {
      left.innerHTML = "";
      left.appendChild(document.createTextNode(meShort()));
      var crest2 = document.createElement("span");
      paintCrest(crest2, house);
      left.appendChild(crest2);
      left.onclick = function () { worldFrom = worldPlace; leaveWorld(true); openProfile(); };
      right.className = "w-glass w-ic";
      right.innerHTML = worldIcon("gear");
      right.onclick = openWorldSettings;
    }

    var box = $("w-pins");
    box.innerHTML = "";
    map.pins.forEach(function (p) {
      var dot = document.createElement("span");
      dot.className = "w-dot";
      dot.style.left = p.dot[0] + "%";
      dot.style.top = p.dot[1] + "%";
      box.appendChild(dot);

      var pin = document.createElement("button");
      pin.type = "button";
      pin.className = "w-pin" + (p.soon ? " soon" : "");
      pin.style.top = p.top + "%";
      if (p.side === "l") { pin.style.left = "14px"; } else { pin.style.right = "14px"; }
      pin.innerHTML = worldIcon(p.icon) +
                      '<span class="w-pin-tx"><b>' + p.name[lang] + '</b><i>' + p.sub[lang] + '</i></span>';
      var n = p.badge ? p.badge() : 0;
      if (n > 0) {
        var wax = document.createElement("span");
        wax.className = "w-wax";
        wax.textContent = n > 99 ? "99+" : String(n);
        pin.appendChild(wax);
      }
      pin.onclick = function () {
        if (!p.go) { showToast(WORLD_SOON[lang]); return; }
        p.go();
      };
      box.appendChild(pin);
    });
  }

  // Sarlavhadagi qisqa ism: "Sardor · 245"
  function meShort() {
    var name = "";
    try {
      var u = tg && tg.initDataUnsafe && tg.initDataUnsafe.user;
      if (u) { name = u.first_name || u.username || ""; }
    } catch (e) { name = ""; }
    if (!name) { name = "?"; }
    var pts = (cupMe() && cupMe().points) || 0;
    return name + " · " + pts;
  }

  function openWorld(place) {
    worldPlace = (typeof place === "string" && WORLD_MAPS[place]) ? place : "world";
    stopSortTimer();
    ["scr-cat", "scr-prof", "scr-detail", "scr-lang", "scr-cup", "scr-tasks",
     "scr-quiz", "scr-chat", "scr-refs", "scr-hall-full", "scr-feed-full"].forEach(function (id) {
      var el = $(id);
      if (el) { el.classList.add("hidden"); }
    });
    $("w-set").classList.add("hidden");
    $("scr-world").classList.remove("hidden");
    renderWorld();
  }

  function worldBack() {
    var map = WORLD_MAPS[worldPlace];
    if (map && map.parent) { openWorld(map.parent); } else { leaveWorld(false); }
  }

  // keepHidden = true bo'lsa katalog ochilmaydi (boshqa ekran ochilmoqchi).
  function leaveWorld(keepHidden) {
    $("scr-world").classList.add("hidden");
    if (!keepHidden) {
      $("scr-cat").classList.remove("hidden");
      renderCatalog();
    }
  }

  function openProfile() {
    stopSortTimer();
    $("scr-detail").classList.add("hidden");
    $("scr-cat").classList.add("hidden");
    $("scr-lang").classList.add("hidden");
    $("scr-sort").classList.add("hidden");
    $("scr-reveal").classList.add("hidden");
    $("scr-hat").classList.add("hidden");
    $("scr-think").classList.add("hidden");
    $("scr-prof").classList.remove("hidden");
    renderProfile();
  }

  function closeProfile() {
    $("scr-prof").classList.add("hidden");
    $("scr-cat").classList.remove("hidden");
    renderCatalog();
  }
