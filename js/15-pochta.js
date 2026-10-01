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

  // Qanotli xat - boyo'g'li pochtasining belgisi. Muhr yangi xat kelganda qizaradi (CSS: .owl-wax).
  var OWL_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" ' +
    'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<rect x="6.5" y="8" width="11" height="8.5" rx="1"/><path d="M6.8 8.4l5.2 4.3 5.2-4.3"/>' +
    '<circle class="owl-wax" cx="12" cy="13.6" r="1.6" fill="currentColor" stroke="none"/>' +
    '<path d="M6.5 10.2C4.6 9.6 3 8 2.3 6c1.9.1 3.4.7 4.2 1.7M6.5 12.6c-1.7-.1-3.2-.9-4.1-2.2 1.5-.4 2.9-.2 4.1.5"/>' +
    '<path d="M17.5 10.2c1.9-.6 3.5-2.2 4.2-4.2-1.9.1-3.4.7-4.2 1.7M17.5 12.6c1.7-.1 3.2-.9 4.1-2.2-1.5-.4-2.9-.2-4.1.5"/></svg>';

  var OWL_TX = {
    uz: {
      kick: "Xogvarts", title: "Boyo'g'li pochtasi", back: "Ortga",
      empty: "Hozircha xat yo'q. Boyo'g'lilar yangi xat bilan qaytadi.",
      cta: "Yo'lni davom ettirish", done: "Bajarildi", again: "Xogvarts sizni unutgani yo'q.",
      setT: "Telegram'da ham eslatilsin", setS: "Ilovaga kirmasangiz, boyo'g'li bot orqali xabar beradi",
      today: "bugun", yest: "kecha", ago: "%s kun oldin",
      dmT: "%s sizga xat yozdi", dmTN: "%s sizga %d ta xabar yozdi", dmChess: "♟️ shaxmatga chaqirdi",
      reply: "Javob yozish", seen: "O'qildi",
      steps: {
        alley: ["Diagon xiyoboni sizni kutmoqda", "Xatdagi ro'yxat tayyor, g'isht devor ochiq. Xogvartsga yo'l shu yerdan boshlanadi."],
        gringotts: ["Gringotts eshiklari ochiq", "Ota-onangiz qoldirgan oltinlar bankda sizni kutib turibdi."],
        wand: ["Olivander tayoqchangizni kutyapti", "Tayoqchani sehrgar emas, tayoqcha sehrgarni tanlaydi."],
        ticket: ["Xagrid biletingizni ushlab turibdi", "9¾ platformaga bilet - Qovoqxonada, Xagridning qo'lida."],
        train: ["Xogvarts ekspressi jo'nashga tayyor", "9¾ platformada poyezd sizsiz ketmaydi."],
        sortst: ["Katta zalda Saralovchi qalpoq kutmoqda", "Bir qadam qoldi - qaysi fakultetga tushasiz?"],
        house: ["Saralovchi qalpoq hali qaror qilmadi", "Savollarni oxirigacha javob bering - fakultetingiz e'lon qilinadi."]
      }
    },
    ru: {
      kick: "Хогвартс", title: "Совиная почта", back: "Назад",
      empty: "Писем пока нет. Совы вернутся с новыми.",
      cta: "Продолжить путь", done: "Выполнено", again: "Хогвартс вас не забыл.",
      setT: "Напоминать и в Telegram", setS: "Если вы не заходите в приложение, сова напишет через бота",
      today: "сегодня", yest: "вчера", ago: "%s дн. назад",
      dmT: "%s написал(а) вам", dmTN: "%s написал(а) вам %d сообщ.", dmChess: "♟️ вызывает на дуэль",
      reply: "Ответить", seen: "Прочитано",
      steps: {
        alley: ["Косой переулок ждёт вас", "Список из письма готов, кирпичная стена открыта. Путь в Хогвартс начинается здесь."],
        gringotts: ["Двери Гринготтса открыты", "Золото, оставленное родителями, ждёт вас в банке."],
        wand: ["Олливандер ждёт вас", "Не волшебник выбирает палочку, а палочка - волшебника."],
        ticket: ["Хагрид держит ваш билет", "Билет на платформу 9¾ - в «Дырявом котле», у Хагрида."],
        train: ["Хогвартс-экспресс готов к отправлению", "На платформе 9¾ поезд без вас не уйдёт."],
        sortst: ["Распределяющая шляпа ждёт в Большом зале", "Остался один шаг - на какой факультет вы попадёте?"],
        house: ["Шляпа ещё не приняла решение", "Ответьте на вопросы до конца - и факультет будет объявлен."]
      }
    },
    en: {
      kick: "Hogwarts", title: "Owl Post", back: "Back",
      empty: "No letters yet. The owls will be back with new ones.",
      cta: "Continue the journey", done: "Done", again: "Hogwarts hasn't forgotten you.",
      setT: "Also remind me in Telegram", setS: "If you don't open the app, an owl will write through the bot",
      today: "today", yest: "yesterday", ago: "%s days ago",
      dmT: "%s wrote to you", dmTN: "%s sent you %d messages", dmChess: "♟️ challenges you to chess",
      reply: "Reply", seen: "Read",
      steps: {
        alley: ["Diagon Alley is waiting", "The list from your letter is ready and the brick wall is open. The road to Hogwarts starts here."],
        gringotts: ["Gringotts doors are open", "The gold your parents left you is waiting at the bank."],
        wand: ["Ollivander is waiting for you", "The wand chooses the wizard, not the other way round."],
        ticket: ["Hagrid is holding your ticket", "Your Platform 9¾ ticket is at the Leaky Cauldron, with Hagrid."],
        train: ["The Hogwarts Express is ready to leave", "On Platform 9¾ the train won't leave without you."],
        sortst: ["The Sorting Hat is waiting in the Great Hall", "One step left - which house will you join?"],
        house: ["The Sorting Hat hasn't decided yet", "Answer the questions to the end and your house will be announced."]
      }
    }
  };

  function owlTx() { return OWL_TX[lang] || OWL_TX.uz; }

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
        { id: 4, tur: "dm", n: 2, from: 7100000037, name: "Hermiona", text: "Ertaga shaxmatda revansh?",
          t: new Date(t - 120e3).toISOString(), read: false, done: false },
        { id: 3, tur: "xabar", n: 1, t: new Date(t - 600e3).toISOString(), read: false, done: false,
          title: "Grifindor, bu hafta kubokda oldindasiz!", text: "Yakshanbagacha 120 ball farq.\nSliterin yaqinlashyapti - bo'sh kelmang." },
        { id: 2, tur: "onb", qadam: "wand", n: 2, t: new Date(t - 3600e3).toISOString(), read: false, done: false },
        { id: 1, tur: "onb", qadam: "alley", n: 1, t: new Date(t - 3 * 864e5).toISOString(), read: true, done: true }
      ] };
    }
    if (action === "read") { d.items.forEach(function (x) { x.read = true; }); }
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

  // Ikkala tugmadagi qizil son
  function owlBadge() {
    var n = owlData ? owlData.unread : 0;
    ["owl-cat", "hub-owl"].forEach(function (id) {
      var b = $(id);
      if (!b) { return; }
      var dot = b.querySelector(".owl-n");
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
    if (!items.length) {
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
      c.appendChild(top);
      if (x.tur === "onb" && x.n > 1 && !x.done) { c.appendChild(owlEl("i", "owl-again", t.again)); }
      c.appendChild(owlEl("b", "owl-h", st[0]));
      if (st[1]) { c.appendChild(owlEl("p", "owl-p", st[1])); }
      if (x.tur === "dm") {
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
  }

  function openOwl() {
    if (owlBusy) { return; }
    owlFrom = hubVisible() ? "hub" : "cat";
    $("scr-hub").classList.add("hidden");
    $("scr-cat").classList.add("hidden");
    $("scr-owl").classList.remove("hidden");
    try { window.scrollTo(0, 0); } catch (e) {}
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

  function owlBotToggle() {
    owlApi("bot", { on: $("owl-bot").checked });
  }

  function owlInit() {
    $("owl-cat").innerHTML = OWL_SVG + '<span class="owl-n hidden"></span>';
    $("hub-owl").innerHTML = OWL_SVG + '<span class="owl-n hidden"></span>';
    $("owl-back").innerHTML = hubSvg("M15 18l-6-6 6-6");
    $("owl-cat").addEventListener("click", openOwl);
    $("hub-owl").addEventListener("click", openOwl);
    $("owl-back").addEventListener("click", closeOwl);
    $("owl-bot").addEventListener("change", owlBotToggle);
    owlBadge();

    var fromBot = /(^|[?&])owl=1(&|$)/.test(window.location.search || "");
    var dmM = /(^|[?&])dm=(\d+)(&|$)/.exec(window.location.search || "");
    owlApi(fromBot ? "came" : "list", null, function () {
      if (!fromBot || !$("scr-lang").classList.contains("hidden")) { return; }
      // Bot xabaridagi "Javob yozish" - to'g'ridan-to'g'ri suhbatga, qolganlari - pochtaga
      if (dmM && hasHouse()) {
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
