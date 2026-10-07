/* Darslar: Xogvarts fanlari - har biri kichik interaktiv mashg'ulot (Afsunlar, Iksirlar...), kuniga bir marta ball
   Ilova kodi bir necha faylga bo'lingan; hammasi BIR umumiy maydonda ishlaydi
   va index.html dagi TARTIBDA yuklanadi. Yuklanish paytida keyingi fayldagi
   narsani chaqirmang - tekshiruv: tools/tartib.js */
"use strict";
  /* Egasi (2026-10-07): Xogvarts bosh sahifasida "Kunlik savol" o'rnida "Darslar". Asardagi fanlar;
     kunlik savol "Sehrgarlik tarixi" ichida. Holat va ball botda (hpdars.py, POST /api/dars).
     Bugungi mavzu (qaysi afsun, qaysi damlama) serverdan keladi - hammaga bir xil.
     Yangi fan qo'shish: DR_FANLAR da `on: true`, o'yin ekrani, drOpenFan da tarmoq, botda hpdars.DARSLAR. */
  var API_DARS = "https://bot.tizimshunos.uz/api/dars";
  var DR_FANLAR = [
    { id: "tarix", on: true, rgb: "232,132,60",
      nom: { uz: "Sehrgarlik tarixi", ru: "История магии", en: "History of Magic" },
      ust: { uz: "Professor Binns", ru: "Профессор Бинс", en: "Professor Binns" },
      izoh: { uz: "Kunlik savol: sehrgarlar olami haqida bitta savol.", ru: "Вопрос дня: один вопрос о мире волшебников.", en: "Daily question: one question about the wizarding world." } },
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
    uz: { kick: "Xogvarts", ttl: "Darslar", tile: "Darslar", tileNew: function (n) { return n + " ta dars kutmoqda"; }, tileDone: "Bugungi darslar bajarildi",
          sum: function (a, b) { return "Bugun: " + a + " / " + b + " dars"; }, note: "Har dars kuniga bir marta ball beradi. Ertaga yangi mavzu.",
          pts: function (n) { return "+" + n + " ball"; }, done: "Bajarildi", soon: "Tez orada", go: "Darsga kirish", again: "Mashq qilish",
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
    ru: { kick: "Хогвартс", ttl: "Уроки", tile: "Уроки", tileNew: function (n) { return "Ждут уроки: " + n; }, tileDone: "Уроки на сегодня сделаны",
          sum: function (a, b) { return "Сегодня: " + a + " / " + b; }, note: "Каждый урок даёт очки раз в день. Завтра — новая тема.",
          pts: function (n) { return "+" + n + " очков"; }, done: "Сделано", soon: "Скоро", go: "На урок", again: "Потренироваться",
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
    en: { kick: "Hogwarts", ttl: "Classes", tile: "Classes", tileNew: function (n) { return n + " classes waiting"; }, tileDone: "Today's classes are done",
          sum: function (a, b) { return "Today: " + a + " / " + b + " classes"; }, note: "Each class gives points once a day. A new topic tomorrow.",
          pts: function (n) { return "+" + n + " points"; }, done: "Done", soon: "Coming soon", go: "Enter class", again: "Practise",
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

  var drData = null, drAsked = false, drQayt = false, drBusy = false;

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
  var drLocalDone = {};
  function drSample(done) {
    if (done) { drLocalDone[done] = true; }
    return { ok: true, "new": !!done, pts: done ? 5 : 0, lessons: {
      tarix: { done: false, pts: 10 },
      afsun: { done: !!drLocalDone.afsun, pts: 5, item: "leviosa" },
      iksir: { done: !!drLocalDone.iksir, pts: 5, item: "boils" } } };
  }

  function drPost(body, cb) {
    if (!window.fetch) { return; }
    window.fetch(API_DARS, { method: "POST", headers: { "Content-Type": "application/json", "X-Telegram-Init-Data": drInit() },
                             body: JSON.stringify(body || {}) })
      .then(function (r) { return r.json(); })
      .then(function (res) { cb(res && res.ok ? res : (MS_LOCAL ? drSample(body && body.done) : res)); })
      ["catch"](function () { cb(MS_LOCAL ? drSample(body && body.done) : null); });
  }

  function drApply(res) {
    if (!res || !res.ok) { return; }
    drData = res.lessons || {};
    if (!$("scr-dars").classList.contains("hidden")) { drRender(); }
    try { if (hubVisible()) { renderHub(); } } catch (e) {}
  }

  function drLoad(force) {
    if (drAsked && !force) { return; }
    drAsked = true;
    drPost({}, drApply);
  }

  // Bugun nechta dars kutmoqda (bosh sahifadagi karta uchun). Ma'lumot hali kelmagan bo'lsa -1.
  function drPending() {
    if (!drData) { return -1; }
    var n = 0;
    DR_FANLAR.forEach(function (f) { if (f.on && drData[f.id] && !drData[f.id].done) { n++; } });
    return n;
  }

  function drOpen() {
    drQayt = false;
    ["scr-hub", "scr-cat", "scr-cup", "scr-tasks", "scr-quiz", "scr-afsun", "scr-iksir", "scr-sq", "pm"].forEach(function (id) {
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
    var bajar = ochiq.filter(function (f) { return drData && drData[f.id] && drData[f.id].done; }).length;
    $("dr-sum").textContent = x.sum(bajar, ochiq.length);
    $("dr-bar").style.width = Math.round(100 * bajar / ochiq.length) + "%";
    $("dr-note").textContent = x.note;
    box.innerHTML = "";
    DR_FANLAR.forEach(function (f) {
      var st = drData && drData[f.id];
      var card = drEl("button", "dr-card" + (f.on ? "" : " soon") + (st && st.done ? " done" : ""));
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
      card.appendChild(tx);
      var chip = drEl("span", "dr-chip", !f.on ? x.soon : (st && st.done ? x.done : x.pts(st ? st.pts : (f.id === "tarix" ? 10 : 5))));
      card.appendChild(chip);
      card.addEventListener("click", function () {
        if (!f.on) { showToast(x.soon + ": " + f.nom[lang]); return; }
        drOpenFan(f.id);
      });
      box.appendChild(card);
    });
  }

  function drOpenFan(id) {
    if (id === "tarix") {
      var bor = false;
      try { (tasksData.tasks || []).forEach(function (t) { if (t.type === "daily") { bor = true; } }); } catch (e) {}
      if (!bor) { showToast(HUB_TX.dailyWait[lang]); return; }
      $("scr-dars").classList.add("hidden");
      drQayt = true;
      openDaily();
      return;
    }
    if (id === "afsun") { afOpen(); }
    if (id === "iksir") { ikOpen(); }
  }

  // Dars bajarildi: server ball beradi (kuniga bir marta). cb(pts) - 0 bo'lsa bu mashq edi.
  function drDone(id, cb) {
    if (drBusy) { return; }
    drBusy = true;
    drPost({ done: id }, function (res) {
      drBusy = false;
      if (!res || !res.ok) { showToast(drX().fail, "err"); cb(-1); return; }
      drData = res.lessons || drData;
      if (res["new"]) {
        try { if (tg && tg.HapticFeedback) { tg.HapticFeedback.notificationOccurred("success"); } } catch (e) {}
        try { cupRefresh(function () {}); } catch (e) {}
      }
      cb(res["new"] ? (res.pts || 0) : 0);
    });
  }

  function drShowGame(scr) {
    ["scr-dars", "scr-afsun", "scr-iksir"].forEach(function (id) { $(id).classList.toggle("hidden", id !== scr); });
    try { window.scrollTo(0, 0); } catch (e) {}
  }

  // O'yin oxiridagi natija paneli (ikkala o'yinda bir xil)
  function drResult(box, matn, pts) {
    var x = drX();
    box.innerHTML = "";
    box.appendChild(drEl("p", "dr-res-t", matn));
    if (pts > 0) { box.appendChild(drEl("b", "dr-res-p", x.got(pts))); }
    else if (pts === 0) { box.appendChild(drEl("small", "dr-res-s", x.practice)); }
    var b = drEl("button", "dr-btn", x.back);
    b.type = "button";
    b.addEventListener("click", drOpen);
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

  function afOpen() {
    var st = drData && drData.afsun;
    var id = st && AF[st.item] ? st.item : "lumos";
    af = { id: id, round: 0, idx: 0, drawing: false, trail: [], done: false, msg: "", ok: false, bajar: !!(st && st.done), show: false };
    drShowGame("scr-afsun");
    var x = drX(), f = drFan("afsun"), a = AF[id][lang] || AF[id].uz;
    $("af-kick").textContent = f.nom[lang];
    $("af-ttl").textContent = f.ust[lang];
    $("af-today").textContent = x.today;
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
    var ochiq = af.round === 0 || af.show ? 0.85 : af.round === 1 ? 0.28 : 0;
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
    $("af-step").textContent = x.afStep(Math.min(af.round + 1, 3), 3);
    $("af-hint").textContent = af.msg || x.afR[Math.min(af.round, 2)];
    $("af-hint").classList.toggle("bad", !!af.bad);
    $("af-show").classList.toggle("hidden", af.round < 2 || af.show || af.done);
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
    var p = afXY(ev), tol = af.w * (af.round >= 2 ? 0.15 : 0.13);
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
      drDone("afsun", function (pts) {
        $("af-stage").classList.add("hidden");
        drResult($("af-res"), x.afOk[2], pts);
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
    murtlap: ["Murtlap o'simtasi", "Отросток растопырника", "Murtlap tentacle"], thyme: ["Tog'jambil damlamasi", "Настойка тимьяна", "Tincture of thyme"]
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
    polyjuice:  { c: "#8a8f4a", r: ["lacewing", "leech", "bicorn", "boomslang", "hair"], uz: "Ko'p qiyofali damlama", ru: "Оборотное зелье", en: "Polyjuice Potion" },
    felix:      { c: "#f3d58f", r: ["ashwinder", "horseradish", "squill", "murtlap", "thyme"], uz: "Feliks Felitsis", ru: "Феликс Фелицис", en: "Felix Felicis" }
  };
  var IK_XATO = 3;
  var ik = null;      // {id, phase: "rec"|"cook"|"done", step, err, chips, bajar}

  function ikNom(m) { var i = lang === "ru" ? 1 : lang === "en" ? 2 : 0; return (IK_M[m] || [m, m, m])[i]; }

  function ikOpen() {
    var st = drData && drData.iksir;
    var id = st && IK[st.item] ? st.item : "boils";
    ik = { id: id, phase: "rec", step: 0, err: 0, chips: [], bajar: !!(st && st.done) };
    drShowGame("scr-iksir");
    var x = drX(), f = drFan("iksir");
    $("ik-kick").textContent = f.nom[lang];
    $("ik-ttl").textContent = f.ust[lang];
    $("ik-today").textContent = x.today;
    $("ik-name").textContent = IK[id][lang] || IK[id].uz;
    ikRender();
  }

  function ikShuffle(a) {
    for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  }

  function ikStart() {
    var rec = IK[ik.id].r, boshqa = ikShuffle(Object.keys(IK_M).filter(function (m) { return rec.indexOf(m) < 0; }));
    ik.chips = ikShuffle(rec.concat(boshqa.slice(0, 8 - rec.length)));
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
      $("ik-prog").textContent = x.ikStep(ik.step, rec.length) + " · " + x.ikErr(ik.err, IK_XATO);
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
          drDone("iksir", function (pts) { drResult($("ik-res"), x.ikOk, pts); });
        }, 700);
        return;
      }
      ikRender();
      return;
    }
    // xato masalliq
    ik.err++;
    try { if (tg && tg.HapticFeedback) { tg.HapticFeedback.notificationOccurred("error"); } } catch (e) {}
    btn.classList.add("xato");
    $("ik-pot").classList.remove("tutun");
    void $("ik-pot").offsetWidth;
    $("ik-pot").classList.add("tutun");
    if (ik.err >= IK_XATO) {
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
    $("ik-prog").textContent = x.ikStep(ik.step, rec.length) + " · " + x.ikErr(ik.err, IK_XATO);
  }

  function drSetup() {
    $("dr-back").addEventListener("click", function () { $("scr-dars").classList.add("hidden"); drQayt = false; try { openHub(); } catch (e) {} });
    $("af-back").addEventListener("click", function () { af = null; drOpen(); });
    $("ik-back").addEventListener("click", function () { ik = null; drOpen(); });
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
