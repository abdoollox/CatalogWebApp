/* Boyo'g'li pochtasi - ilovadagi bildirishnomalar
   Ilova kodi bir necha faylga bo'lingan; hammasi BIR umumiy maydonda ishlaydi
   va index.html dagi TARTIBDA yuklanadi. Yuklanish paytida keyingi fayldagi
   narsani chaqirmang - tekshiruv: tools/tartib.js

   Xatlar serverda (CatalogBot/hppochta.py). Kutubxona va 9¾ sarlavhasidagi
   🦉 tugmasi o'qilmaganlar sonini ko'rsatadi. Bot ham eslatishi mumkin -
   buni odam shu ekrandagi tugma bilan o'zi yoqadi yoki o'chiradi.
   Bot xabaridagi "Xatni o'qish" ilovani `?owl=1` bilan ochadi. */
"use strict";
  var API_POCHTA = "https://bot.tizimshunos.uz/api/pochta";
  var owlData = null;          // {items, unread, bot}
  var owlFrom = "cat";         // pochta qaysi ekrandan ochilgani
  var owlBusy = false;
  var owlFresh = {};           // shu ochilishda yangi bo'lgan xatlar - yopilguncha muhrli turadi

  // Boyo'g'li - pochtaning belgisi. Tayyor belgi: Lucide Lab "owl" (ISC litsenziyasi, (c) Lucide Contributors).
  var OWL_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" ' +
    'stroke-linejoin="round" aria-hidden="true"><ellipse cx="12" cy="9" rx="8" ry="7"/>' +
    '<path d="M12 9a4 4 0 1 1 8 0v12h-4C9.4 21 4 15.6 4 9a4 4 0 1 1 8 0v1M8 9h.01M16 9h.01"/>' +
    '<path d="M20 21a3.9 3.9 0 1 1 0-7.8m-10 6.2V22m4-1.15V22"/></svg>';

  var OWL_TX = {
    uz: {
      kick: "Xogvarts", title: "Boyo'g'li pochtasi", back: "Ortga",
      empty: "Hozircha xat yo'q. Boyo'g'lilar yangi xat bilan qaytadi.",
      hogT: "Xogvartsdan maktub", hogS: "Siz Xogvarts sehrgarlik maktabiga qabul qilindingiz. Yo'l Diagon xiyobonidan boshlanadi.",
      hogNew: "Xatni ochish",
      hogOldS: "Sizni Xogvartsga chaqirgan o'sha maktub. Uni saqlab qo'ydik — do'stlaringizga ham ko'rsating.",
      hogOld: "Maktubni ochish",
      del: "Xatni o'chirish", delAsk: "Bu xat o'chirilsinmi?",
      cta: "Yo'lni davom ettirish", done: "Bajarildi", again: "Xogvarts sizni unutgani yo'q.",
      setT: "Telegram'da ham eslatilsin", setS: "Ilovaga kirmasangiz, boyo'g'li bot orqali xabar beradi",
      today: "bugun", yest: "kecha", ago: "%s kun oldin",
      dmT: "%s sizga xat yozdi", dmTN: "%s sizga %d ta xabar yozdi", dmChess: "♟️ shaxmatga chaqirdi",
      reply: "Javob yozish", seen: "O'qildi",
      cupWin: "🏆 %s kubokni oldi!", cupWinYou: "Tabriklaymiz! Fakultetingiz hafta g'olibi: %s ball.",
      cupLost: "🏆 Hafta g'olibi — %s", cupPlace: "%s %d-o'rinda: %s ball.",
      cupNone: "🏆 Hafta yakunlandi", cupNoneB: "Bu hafta g'olib aniqlanmadi.",
      cupMe: "Siz %s ball qo'shdingiz.", cupZero: "Siz bu hafta ball to'plamadingiz — yangi haftada fakultetingizga yordam bering.",
      cupBadge: "Yangi nishon: %s", cupGo: "Kubokni ko'rish",
      houses: { gryffindor: "Grifindor", slytherin: "Sliterin", ravenclaw: "Reyvenklo", hufflepuff: "Xaffelpaff" },
      badges: { all_films: "Sakkiz qism", flawless_exam: "Benuqson imtihon", perfect_week: "Mukammal hafta", streak_7: "Yetti kun ketma-ket" },
      steps: {
        alley: ["Gringotts sizni kutmoqda", "Xogvartsga yo'l sehrgarlar bankidan boshlanadi: goblin kalitingizni ko'zdan kechirmoqchi."],
        gringotts: ["Gringotts eshiklari ochiq", "Xogvarts sizga ajratgan galleonlar bankda kutib turibdi."],
        wand: ["Olivander tayoqchangizni kutyapti", "Tayoqchani sehrgar emas, tayoqcha sehrgarni tanlaydi."],
        ticket: ["Xagrid 9¾ platformada kutmoqda", "Biletingiz Xagridning qo'lida - Kings Kross vokzalida, g'isht ustun yonida."],
        train: ["Xogvarts ekspressi jo'nashga tayyor", "9¾ platformada poyezd sizsiz ketmaydi."],
        sortst: ["Katta zalda Saralovchi qalpoq kutmoqda", "Bir qadam qoldi - qaysi fakultetga tushasiz?"],
        house: ["Saralovchi qalpoq hali qaror qilmadi", "Savollarni oxirigacha javob bering - fakultetingiz e'lon qilinadi."]
      }
    },
    ru: {
      kick: "Хогвартс", title: "Совиная почта", back: "Назад",
      empty: "Писем пока нет. Совы вернутся с новыми.",
      hogT: "Письмо из Хогвартса", hogS: "Вы приняты в Школу чародейства и волшебства Хогвартс. Путь начинается в Косом переулке.",
      hogNew: "Открыть письмо",
      hogOldS: "То самое письмо, которое позвало вас в Хогвартс. Мы его сохранили — покажите друзьям.",
      hogOld: "Открыть письмо",
      del: "Удалить письмо", delAsk: "Удалить это письмо?",
      cta: "Продолжить путь", done: "Выполнено", again: "Хогвартс вас не забыл.",
      setT: "Напоминать и в Telegram", setS: "Если вы не заходите в приложение, сова напишет через бота",
      today: "сегодня", yest: "вчера", ago: "%s дн. назад",
      dmT: "%s написал(а) вам", dmTN: "%s написал(а) вам %d сообщ.", dmChess: "♟️ вызывает на дуэль",
      reply: "Ответить", seen: "Прочитано",
      cupWin: "🏆 %s забирает кубок!", cupWinYou: "Поздравляем! Ваш факультет - победитель недели: %s очков.",
      cupLost: "🏆 Победитель недели — %s", cupPlace: "%s на %d-м месте: %s очков.",
      cupNone: "🏆 Неделя завершена", cupNoneB: "На этой неделе победитель не определён.",
      cupMe: "Вы принесли %s очков.", cupZero: "На этой неделе у вас нет очков — помогите факультету в новой неделе.",
      cupBadge: "Новый значок: %s", cupGo: "Открыть кубок",
      houses: { gryffindor: "Гриффиндор", slytherin: "Слизерин", ravenclaw: "Когтевран", hufflepuff: "Пуффендуй" },
      badges: { all_films: "Восемь частей", flawless_exam: "Безупречный экзамен", perfect_week: "Идеальная неделя", streak_7: "Семь дней подряд" },
      steps: {
        alley: ["Гринготтс ждёт вас", "Путь в Хогвартс начинается с банка волшебников: гоблин хочет осмотреть ваш ключ."],
        gringotts: ["Двери Гринготтса открыты", "Галлеоны, которые выделил вам Хогвартс, ждут вас в банке."],
        wand: ["Олливандер ждёт вас", "Не волшебник выбирает палочку, а палочка - волшебника."],
        ticket: ["Хагрид ждёт на платформе 9¾", "Ваш билет у Хагрида - на вокзале Кингс-Кросс, у кирпичной колонны."],
        train: ["Хогвартс-экспресс готов к отправлению", "На платформе 9¾ поезд без вас не уйдёт."],
        sortst: ["Распределяющая шляпа ждёт в Большом зале", "Остался один шаг - на какой факультет вы попадёте?"],
        house: ["Шляпа ещё не приняла решение", "Ответьте на вопросы до конца - и факультет будет объявлен."]
      }
    },
    en: {
      kick: "Hogwarts", title: "Owl Post", back: "Back",
      empty: "No letters yet. The owls will be back with new ones.",
      hogT: "A letter from Hogwarts", hogS: "You have been accepted to Hogwarts School of Witchcraft and Wizardry. The journey starts in Diagon Alley.",
      hogNew: "Open the letter",
      hogOldS: "The very letter that called you to Hogwarts. We kept it for you — show it to your friends.",
      hogOld: "Open the letter",
      del: "Delete the letter", delAsk: "Delete this letter?",
      cta: "Continue the journey", done: "Done", again: "Hogwarts hasn't forgotten you.",
      setT: "Also remind me in Telegram", setS: "If you don't open the app, an owl will write through the bot",
      today: "today", yest: "yesterday", ago: "%s days ago",
      dmT: "%s wrote to you", dmTN: "%s sent you %d messages", dmChess: "♟️ challenges you to chess",
      reply: "Reply", seen: "Read",
      cupWin: "🏆 %s takes the Cup!", cupWinYou: "Congratulations! Your house won the week: %s points.",
      cupLost: "🏆 House of the week — %s", cupPlace: "%s is in place %d: %s points.",
      cupNone: "🏆 The week is over", cupNoneB: "No winner this week.",
      cupMe: "You earned %s points.", cupZero: "You earned no points this week — help your house in the new one.",
      cupBadge: "New badge: %s", cupGo: "Open the Cup",
      houses: { gryffindor: "Gryffindor", slytherin: "Slytherin", ravenclaw: "Ravenclaw", hufflepuff: "Hufflepuff" },
      badges: { all_films: "All eight parts", flawless_exam: "Flawless exam", perfect_week: "Perfect week", streak_7: "Seven days in a row" },
      steps: {
        alley: ["Gringotts is waiting", "The road to Hogwarts starts at the wizarding bank: a goblin wants to examine your key."],
        gringotts: ["Gringotts doors are open", "The galleons Hogwarts set aside for you are waiting at the bank."],
        wand: ["Ollivander is waiting for you", "The wand chooses the wizard, not the other way round."],
        ticket: ["Hagrid is waiting at Platform 9¾", "Hagrid has your ticket - at King's Cross, by the brick pillar."],
        train: ["The Hogwarts Express is ready to leave", "On Platform 9¾ the train won't leave without you."],
        sortst: ["The Sorting Hat is waiting in the Great Hall", "One step left - which house will you join?"],
        house: ["The Sorting Hat hasn't decided yet", "Answer the questions to the end and your house will be announced."]
      }
    }
  };

  function owlTx() { return OWL_TX[lang] || OWL_TX.uz; }

  function owlSon(n) { return String(Math.round(n || 0)).replace(/\B(?=(\d{3})+(?!\d))/g, " "); }

  // Kubok xati: bot ham xuddi shu qoida bilan yozadi (hppochta.kubok_matni)
  function owlCupText(d) {
    var t = owlTx(), uy = t.houses[d.uy] || d.uy || "", sar, q;
    if (!d.g) { sar = t.cupNone; q = [t.cupNoneB]; }
    else if (d.g === d.uy) { sar = t.cupWin.replace("%s", uy); q = [t.cupWinYou.replace("%s", owlSon(d.uy_ball))]; }
    else {
      sar = t.cupLost.replace("%s", t.houses[d.g] || d.g);
      q = [t.cupPlace.replace("%s", uy).replace("%d", d.orin || 0).replace("%s", owlSon(d.uy_ball))];
    }
    q.push(d.ball ? t.cupMe.replace("%s", owlSon(d.ball)) : t.cupZero);
    (d.nish || []).forEach(function (b) { q.push("🎖 " + t.cupBadge.replace("%s", t.badges[b] || b)); });
    return [sar, q.join("\n")];
  }

  function owlLocal() {
    return !chatInitData() && (window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1" || window.location.protocol === "file:");
  }

  // Mahalliy sinov uchun namuna xatlar (jonli Telegram'da ishlatilmaydi)
  function owlDemo(action, body) {
    var key = "hp_owl_demo", d = null;
    try { d = JSON.parse(window.localStorage.getItem(key) || "null"); } catch (e) {}
    if (!d) {
      var t = Date.now();
      d = { bot: true, items: [
        { id: 5, tur: "kubok", n: 1, t: new Date(t - 60e3).toISOString(), read: false, done: false,
          cup: { s: 7, g: "slytherin", uy: "gryffindor", orin: 2, uy_ball: 1240, ball: 45, nish: ["streak_7"] } },
        { id: 4, tur: "dm", n: 2, from: 7100000037, name: "Hermiona", text: "Ertaga shaxmatda revansh?",
          t: new Date(t - 120e3).toISOString(), read: false, done: false },
        { id: 3, tur: "xabar", n: 1, t: new Date(t - 600e3).toISOString(), read: false, done: false,
          title: "Grifindor, bu hafta kubokda oldindasiz!", text: "Yakshanbagacha 120 ball farq.\nSliterin yaqinlashyapti - bo'sh kelmang." },
        { id: 2, tur: "onb", qadam: "wand", n: 2, t: new Date(t - 3600e3).toISOString(), read: false, done: false },
        { id: 1, tur: "onb", qadam: "alley", n: 1, t: new Date(t - 3 * 864e5).toISOString(), read: true, done: true }
      ] };
    }
    if (action === "read") { d.items.forEach(function (x) { x.read = true; }); }
    if (action === "delete") { d.items = d.items.filter(function (x) { return (body.ids || []).indexOf(x.id) < 0; }); }
    if (action === "bot") { d.bot = !!body.on; }
    try { window.localStorage.setItem(key, JSON.stringify(d)); } catch (e) {}
    d.unread = d.items.filter(function (x) { return !x.read; }).length;
    return d;
  }

  function owlApi(action, extra, done) {
    var body = { action: action };
    if (extra) { for (var k in extra) { body[k] = extra[k]; } }
    if (owlLocal()) {
      var res = owlDemo(action, body);
      setTimeout(function () { owlSet(res); done && done(res); }, 40);
      return;
    }
    var d = chatInitData();
    if (!d || !window.fetch) { done && done(null); return; }
    fetch(API_POCHTA, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Telegram-Init-Data": d },
      body: JSON.stringify(body)
    }).then(function (r) { return r.json(); })
      .then(function (res) {
        if (res && res.ok) { owlSet(res); }
        done && done(res);
      })["catch"](function () { done && done(null); });
  }

  function owlSet(res) {
    owlData = { items: res.items || [], unread: res.unread || 0, bot: res.bot !== false };
    owlBadge();
    if (owlVisible()) { owlRender(); }
  }

  function owlVisible() { var el = $("scr-owl"); return !!el && !el.classList.contains("hidden"); }

  // Saralangan odamning esdalik maktubi (owlHogOld) hali ko'rilmagan bo'lsa - u ham o'qilmagan xat.
  // Faqat shu qurilmada eslab qolinadi.
  var owlEsdFresh = false;
  function owlEsdYangi() {
    try {
      if (owlHog() || !hasHouse()) { return false; }
      return window.localStorage.getItem(TK("hp_owl_esd")) !== "1";
    } catch (e) { return false; }
  }

  var OWL_DEL = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" ' +
    'stroke-linejoin="round" aria-hidden="true"><path d="M4.5 7h15M9.5 7V4.8h5V7M6.5 7l.8 12.2h9.4L17.5 7M10 10.5v5.5M14 10.5v5.5"/></svg>';

  // Xatni o'chirish (serverdagi xatlar). Xogvarts maktubida bu tugma yo'q - u o'chirilmaydi.
  function owlDelBtn(x, card) {
    var t = owlTx();
    var b = owlEl("button", "owl-del");
    b.type = "button";
    b.innerHTML = OWL_DEL;
    b.setAttribute("aria-label", t.del);
    b.title = t.del;
    b.addEventListener("click", function () {
      testAsk(t.delAsk, function () {
        card.classList.add("owl-gone");
        delete owlFresh[x.id];
        owlApi("delete", { ids: [x.id] });
      });
    });
    return b;
  }

  // Ikkala tugmadagi qizil son
  function owlBadge() {
    var n0 = owlData ? owlData.unread : 0, hog = owlHog();
    ["owl-cat", "hub-owl"].forEach(function (id) {
      var b = $(id);
      if (!b) { return; }
      // Xogvarts maktubi ochilmagan bo'lsa - u ham o'qilmagan xat (faqat kutubxonadagi belgida)
      // Hali film olmagan odamda maktub belgisi ham chiqmaydi (maktub pochta ichida turadi)
      var n = n0 + (id === "owl-cat" && hog === "new" && filmOlgan() ? 1 : 0) + (owlEsdYangi() ? 1 : 0);
      b.classList.toggle("owl-yol", id === "owl-cat" && hog === "letter");
      var dot = b.querySelector(".owl-n");
      // Ilova ishga tushayotganda (owlInit hali belgini chizmagan) - o'tkazib yuboramiz.
      // Ilgari shu yerda xato chiqib, ishga tushirish to'xtardi va kubok umuman yuklanmasdi.
      if (!dot) { return; }
      dot.textContent = n > 9 ? "9+" : String(n);
      dot.classList.toggle("hidden", !n);
      b.classList.toggle("owl-yangi", n > 0);
      b.setAttribute("aria-label", owlTx().title + (n ? " (" + n + ")" : ""));
    });
  }

  function owlWhen(iso) {
    var t = owlTx(), d = new Date(iso);
    if (isNaN(d)) { return ""; }
    var hm = String(d.getHours()).padStart(2, "0") + ":" + String(d.getMinutes()).padStart(2, "0");
    var bugun = new Date(); bugun.setHours(0, 0, 0, 0);
    var kun = Math.floor((bugun - new Date(d.getFullYear(), d.getMonth(), d.getDate())) / 864e5);
    if (kun <= 0) { return t.today + ", " + hm; }
    if (kun === 1) { return t.yest + ", " + hm; }
    return t.ago.replace("%s", kun);
  }

  function owlEl(tag, cls, text) {
    var el = document.createElement(tag);
    if (cls) { el.className = cls; }
    if (text != null) { el.textContent = text; }
    return el;
  }

  // Saralanmagan, bilet olmagan odam: Xogvarts maktubi 9¾ tugmasida emas, shu pochtada turadi.
  // "new" - hali ochilmagan, "letter" - ochgan, yo'lda; null - maktub kerak emas.
  function owlHog() {
    var st = letterStage();
    return st === "world" ? null : st;
  }

  function owlHogCard(t) {
    var hog = owlHog();
    if (!hog || owlFrom === "hub") { return null; }
    var c = owlEl("div", "owl-card owl-hog" + (hog === "new" ? " owl-new" : ""));
    var top = owlEl("div", "owl-top");
    var ic = owlEl("span", "owl-ic"); ic.innerHTML = OWL_SVG;
    top.appendChild(ic);
    top.appendChild(owlEl("span", "owl-when", t.kick));
    if (hog === "new") { top.appendChild(owlEl("span", "owl-seal")); }
    c.appendChild(top);
    c.appendChild(owlEl("b", "owl-h", t.hogT));
    c.appendChild(owlEl("p", "owl-p", t.hogS));
    var b = owlEl("button", "owl-cta", hog === "new" ? t.hogNew : t.cta);
    b.type = "button";
    b.addEventListener("click", owlGoJourney);
    c.appendChild(b);
    return c;
  }

  // Fakultetga tushgan odamda ham maktub pochtada turadi - esdalik, ochib ulashsa bo'ladi
  // (egasi so'radi, 2026-10-03). Eng birinchi xat bo'lgani uchun ro'yxat oxirida.
  function owlHogOld(t) {
    if (owlHog() || !hasHouse()) { return null; }
    var c = owlEl("div", "owl-card owl-hog" + (owlEsdFresh ? " owl-new" : ""));
    var top = owlEl("div", "owl-top");
    var ic = owlEl("span", "owl-ic"); ic.innerHTML = OWL_SVG;
    top.appendChild(ic);
    top.appendChild(owlEl("span", "owl-when", t.kick));
    if (owlEsdFresh) { top.appendChild(owlEl("span", "owl-seal")); }
    c.appendChild(top);
    c.appendChild(owlEl("b", "owl-h", t.hogT));
    c.appendChild(owlEl("p", "owl-p", t.hogOldS));
    var b = owlEl("button", "owl-cta", t.hogOld);
    b.type = "button";
    b.addEventListener("click", function () { openLetter(true); });
    c.appendChild(b);
    return c;
  }

  function owlRender() {
    var t = owlTx();
    $("owl-kick").textContent = t.kick;
    $("owl-title").textContent = t.title;
    $("owl-back").setAttribute("aria-label", t.back);
    $("owl-set-t").textContent = t.setT;
    $("owl-set-s").textContent = t.setS;
    $("owl-bot").checked = !owlData || owlData.bot;

    var box = $("owl-list");
    box.innerHTML = "";
    var items = (owlData && owlData.items) || [];
    var hogC = owlHogCard(t), hogO = owlHogOld(t);
    if (hogC) { box.appendChild(hogC); }
    if (!items.length && !hogC && !hogO) {
      var em = owlEl("div", "owl-empty");
      em.innerHTML = OWL_SVG;
      em.appendChild(owlEl("p", "", t.empty));
      box.appendChild(em);
      return;
    }
    items.forEach(function (x) {
      // Turlar: onb - yo'l eslatmasi (matn ilovada), xabar - egasi paneldan yozgan xat
      // dm - chatda shaxsiy xabar keldi (o'qilmagan)
      var st = x.tur === "onb" ? t.steps[x.qadam] : (x.tur === "xabar" && x.title ? [x.title, x.text || ""] : null);
      if (x.tur === "kubok" && x.cup) { st = owlCupText(x.cup); }
      if (x.tur === "dm" && x.from) {
        var ism = x.name || "Sehrgar";
        st = [x.n > 1 ? t.dmTN.replace("%s", ism).replace("%d", x.n) : t.dmT.replace("%s", ism),
              x.text === "♟️" ? t.dmChess : "«" + (x.text || "") + "»"];
      }
      if (!st) { return; }               // ilova hali bilmaydigan tur - ko'rsatilmaydi
      var yangi = !x.read || owlFresh[x.id];
      var c = owlEl("div", "owl-card" + (yangi ? " owl-new" : "") + (x.done ? " owl-done" : ""));
      var top = owlEl("div", "owl-top");
      var ic = owlEl("span", "owl-ic"); ic.innerHTML = OWL_SVG;
      top.appendChild(ic);
      top.appendChild(owlEl("span", "owl-when", owlWhen(x.t)));
      if (yangi) { top.appendChild(owlEl("span", "owl-seal")); }
      top.appendChild(owlDelBtn(x, c));
      c.appendChild(top);
      if (x.tur === "onb" && x.n > 1 && !x.done) { c.appendChild(owlEl("i", "owl-again", t.again)); }
      c.appendChild(owlEl("b", "owl-h", st[0]));
      if (st[1]) { c.appendChild(owlEl("p", "owl-p", st[1])); }
      if (x.tur === "kubok") {
        var cb = owlEl("button", "owl-cta", t.cupGo);
        cb.type = "button";
        cb.addEventListener("click", owlGoCup);
        c.appendChild(cb);
      } else if (x.tur === "dm") {
        if (x.done) { c.appendChild(owlEl("span", "owl-ok", "✓ " + t.seen)); }
        else {
          var rb = owlEl("button", "owl-cta", t.reply);
          rb.type = "button";
          rb.addEventListener("click", function () { owlGoDm(x.from, x.name); });
          c.appendChild(rb);
        }
      } else if (x.tur !== "onb") {
        // qo'lda yozilgan xatda tugma yo'q
      } else if (x.done) {
        c.appendChild(owlEl("span", "owl-ok", "✓ " + t.done));
      } else {
        var b = owlEl("button", "owl-cta", t.cta);
        b.type = "button";
        b.addEventListener("click", owlGoJourney);
        c.appendChild(b);
      }
      box.appendChild(c);
    });
    if (hogO) { box.appendChild(hogO); }
  }

  function openOwl() {
    if (owlBusy) { return; }
    owlFrom = hubVisible() ? "hub" : "cat";
    $("scr-hub").classList.add("hidden");
    $("scr-cat").classList.add("hidden");
    $("scr-owl").classList.remove("hidden");
    try { window.scrollTo(0, 0); } catch (e) {}
    // Esdalik maktub shu ochilishda "yangi" bo'lib ko'rinadi, keyin o'qilgan hisoblanadi
    owlEsdFresh = owlEsdYangi();
    if (owlEsdFresh) { try { window.localStorage.setItem(TK("hp_owl_esd"), "1"); } catch (e) {} owlBadge(); }
    owlRender();
    owlBusy = true;
    owlApi("list", null, function () {
      owlBusy = false;
      // Ko'rsatilganidan keyin o'qilgan deb belgilanadi (muhr hozircha ko'rinib turadi)
      if (owlData && owlData.unread) {
        owlData.items.forEach(function (x) { if (!x.read) { owlFresh[x.id] = 1; } });
        owlApi("read");
      }
    });
  }

  function closeOwl() {
    owlFresh = {};
    owlEsdFresh = false;
    $("scr-owl").classList.add("hidden");
    if (owlFrom === "hub") { openHub(); } else { $("scr-cat").classList.remove("hidden"); }
    owlRender();
  }

  // Xatdagi tugma: yo'l to'xtagan joyidan davom etadi (9¾ tugmasi bilan bir xil yo'l)
  function owlGoJourney() {
    owlFresh = {};
    $("scr-owl").classList.add("hidden");
    $("scr-cat").classList.remove("hidden");
    goWorld();
  }

  // "Javob yozish": o'sha odam bilan shaxsiy suhbat ochiladi. Ortga - 9¾ ga.
  function owlGoDm(uid, ism) {
    owlFresh = {};
    ["scr-owl", "scr-cat", "scr-hub"].forEach(function (id) { $(id).classList.add("hidden"); });
    worldFrom = "hub";
    openChat();
    chatOpenDm({ uid: Number(uid), name: ism || "Sehrgar" });
    // Suhbat o'qilgach server xatni yopadi - belgidagi son yangilansin
    setTimeout(function () { owlApi("list"); }, 5000);
  }

  // "Kubokni ko'rish": kubok sahifasi. Ortga - 9¾ ga.
  function owlGoCup() {
    owlFresh = {};
    function och() {
      ["scr-owl", "scr-hub"].forEach(function (id) { $(id).classList.add("hidden"); });
      worldFrom = "hub";
      openCup();
    }
    if (cupData) { och(); } else { fetchCup(och); }
  }

  function owlBotToggle() {
    owlApi("bot", { on: $("owl-bot").checked });
  }

  function owlInit() {
    $("owl-cat").innerHTML = OWL_SVG + '<span class="owl-n hidden"></span>';
    $("hub-owl").innerHTML = OWL_SVG + '<span class="owl-n hidden"></span>';
    $("owl-back").innerHTML = hubSvg("M15 18l-6-6 6-6");
    $("owl-cat").addEventListener("click", function () {
      // Birinchi marta: boyo'g'li Xogvarts maktubini to'g'ridan-to'g'ri olib keladi
      // Yo'ldagi odam (maktubni ochgan yoki ochmagan): boshqa o'qilmagan xati bo'lmasa -
      // to'g'ri maktubning o'zi ochiladi, u yerda qayerga kelgani ko'rinadi.
      var hg = owlHog();
      if (hg && (hg === "letter" || filmOlgan()) && !(owlData && owlData.unread)) { goWorld(); return; }
      openOwl();
    });
    $("hub-owl").addEventListener("click", openOwl);
    $("owl-back").addEventListener("click", closeOwl);
    $("owl-bot").addEventListener("change", owlBotToggle);
    owlBadge();

    var fromBot = /(^|[?&])owl=1(&|$)/.test(window.location.search || "");
    var dmM = /(^|[?&])dm=(\d+)(&|$)/.exec(window.location.search || "");
    owlApi(fromBot ? "came" : "list", null, function () {
      if (!fromBot || !$("scr-lang").classList.contains("hidden")) { return; }
      // Bot xabaridagi "Javob yozish" - to'g'ridan-to'g'ri suhbatga, qolganlari - pochtaga
      if (/(^|[?&])cup=1(&|$)/.test(window.location.search || "")) { owlGoCup(); }
      else if (dmM && hasHouse()) {
        var x = ((owlData && owlData.items) || []).filter(function (i) { return i.tur === "dm" && String(i.from) === dmM[2]; })[0];
        owlGoDm(dmM[2], x ? x.name : "");
      } else { openOwl(); }
    });
    // Ilova ochiq turganda ham yangi xat kelishi mumkin
    setInterval(function () { if (!document.hidden && !owlVisible()) { owlApi("list"); } }, 180000);
    document.addEventListener("visibilitychange", function () { if (!document.hidden) { owlApi("list"); } });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", owlInit);
  } else {
    owlInit();
  }
