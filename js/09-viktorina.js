/* Jonli viktorina «Oxirgi sehrgar» (egasi, 2026-10-11) - juma 22:00. Server: hpviktorina.py, POST /api/viktorina.
   Ilova kodi bir necha faylga bo'lingan; hammasi BIR umumiy maydonda ishlaydi
   va index.html dagi TARTIBDA yuklanadi. Yuklanish paytida keyingi fayldagi
   narsani chaqirmang - tekshiruv: tools/tartib.js */
"use strict";

  var API_VIK = "https://bot.tizimshunos.uz/api/viktorina";
  var VK_T = {
    uz: { kick: "Juma turniri", ttl: "Viktorina", nom: "Oxirgi sehrgar", kunlar: ["yakshanba", "dushanba", "seshanba", "chorshanba", "payshanba", "juma", "shanba"], qoldi: "qoldi",
          soni: function (n) { return n + " kishi yozildi"; }, qat: "Qatnashaman", bor: "Eslatma yoqilgan — boyo'g'li xabar beradi", chiq: "Bekor qilish",
          q1: "Hamma bir vaqtda bitta savolga javob beradi", q2: "Xato qilgan yoki ulgurmagan chiqib ketadi", q3: "Oxirida qolgan sehrgar — g'olib",
          sov: "Sovrinlar", orin: function (n) { return n + "-o'rin"; }, yaxshi: function (n, p) { return n + " ta to'g'ri javob — +" + p + " ball"; },
          otgan: function (n, k) { return "O'tgan safar g'olib: " + n + " (" + k + " kishi ichida)"; },
          zal: "Zal ochiq", zalS: function (n) { return n + " sehrgar keldi"; }, bosh: function (v) { return "Boshlanishiga " + v; }, kut: "Shu sahifada qoling — birinchi savol o'zi chiqadi.",
          savolN: function (n) { return n + "-savol"; }, tirik: function (n) { return "Zalda " + n + " sehrgar"; }, qabul: "Javobingiz qabul qilindi — kuting…",
          togri: "To'g'ri!", xato: "Xato — siz chiqdingiz.", ulgurmadi: "Ulgurmadingiz — siz chiqdingiz.", bekor: "Hech kim topa olmadi — savol bekor, hamma qoladi.",
          keyingi: function (s) { return "Keyingi savol " + s + " soniyadan keyin"; }, tomosha: "Siz tomoshabinsiz", chiqqan: function (n) { return "Siz " + n + "-savolda chiqdingiz — tomosha qilyapsiz"; },
          kech: "Kechikdingiz — bu safar faqat tomosha qilasiz", tugadi: "Viktorina tugadi", golib: "G'olib", siz: "siz", orningiz: function (n) { return "Sizning o'rningiz: " + n; },
          ball: function (n) { return "+" + n + " ball kubokka"; }, bolmadi: "Bu safar ishtirokchi yetmadi — viktorina o'tmadi.", ortga: "Xogvartsga qaytish",
          togriN: function (n) { return n + " ta to'g'ri"; }, yoq: "Aloqa yo'q — qayta urinib ko'ring", m: " daq ", h: " soat ", kunQ: "kun" },
    ru: { kick: "Пятничный турнир", ttl: "Викторина", nom: "Последний волшебник", kunlar: ["воскресенье", "понедельник", "вторник", "среда", "четверг", "пятница", "суббота"], qoldi: "осталось",
          soni: function (n) { return "Записалось: " + n; }, qat: "Участвую", bor: "Напоминание включено — сова сообщит", chiq: "Отменить",
          q1: "Все одновременно отвечают на один вопрос", q2: "Ошибся или не успел — выбыл", q3: "Побеждает тот, кто останется последним",
          sov: "Призы", orin: function (n) { return n + "-е место"; }, yaxshi: function (n, p) { return n + " верных ответов — +" + p + " очк."; },
          otgan: function (n, k) { return "Прошлый победитель: " + n + " (из " + k + ")"; },
          zal: "Зал открыт", zalS: function (n) { return "Пришло волшебников: " + n; }, bosh: function (v) { return "До начала " + v; }, kut: "Оставайтесь на этой странице — первый вопрос появится сам.",
          savolN: function (n) { return "Вопрос " + n; }, tirik: function (n) { return "В зале: " + n; }, qabul: "Ответ принят — ждите…",
          togri: "Верно!", xato: "Неверно — вы выбыли.", ulgurmadi: "Вы не успели — вы выбыли.", bekor: "Никто не ответил верно — вопрос отменён, все остаются.",
          keyingi: function (s) { return "Следующий вопрос через " + s + " с"; }, tomosha: "Вы зритель", chiqqan: function (n) { return "Вы выбыли на вопросе " + n + " — смотрите дальше"; },
          kech: "Вы опоздали — в этот раз только смотреть", tugadi: "Викторина окончена", golib: "Победитель", siz: "вы", orningiz: function (n) { return "Ваше место: " + n; },
          ball: function (n) { return "+" + n + " очков в кубок"; }, bolmadi: "В этот раз участников не хватило — викторина не состоялась.", ortga: "Вернуться в Хогвартс",
          togriN: function (n) { return "верных: " + n; }, yoq: "Нет связи — попробуйте ещё раз", m: " мин ", h: " ч ", kunQ: "дн." },
    en: { kick: "Friday tournament", ttl: "Quiz", nom: "The Last Wizard", kunlar: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], qoldi: "left",
          soni: function (n) { return n + " signed up"; }, qat: "I'm in", bor: "Reminder on — an owl will let you know", chiq: "Cancel",
          q1: "Everyone answers the same question at once", q2: "A wrong or late answer and you are out", q3: "The last wizard standing wins",
          sov: "Prizes", orin: function (n) { return ["", "1st", "2nd", "3rd"][n] + " place"; }, yaxshi: function (n, p) { return n + " correct answers — +" + p + " pts"; },
          otgan: function (n, k) { return "Last winner: " + n + " (out of " + k + ")"; },
          zal: "The hall is open", zalS: function (n) { return n + " wizards are here"; }, bosh: function (v) { return "Starts in " + v; }, kut: "Stay on this page — the first question will appear by itself.",
          savolN: function (n) { return "Question " + n; }, tirik: function (n) { return n + " wizards left"; }, qabul: "Answer received — wait…",
          togri: "Correct!", xato: "Wrong — you are out.", ulgurmadi: "Too late — you are out.", bekor: "Nobody got it — the question is void, everyone stays.",
          keyingi: function (s) { return "Next question in " + s + " s"; }, tomosha: "You are watching", chiqqan: function (n) { return "You went out on question " + n + " — watching now"; },
          kech: "You are late — watching only this time", tugadi: "The quiz is over", golib: "Winner", siz: "you", orningiz: function (n) { return "Your place: " + n; },
          ball: function (n) { return "+" + n + " points for the Cup"; }, bolmadi: "Not enough players this time — no quiz.", ortga: "Back to Hogwarts",
          togriN: function (n) { return n + " correct"; }, yoq: "No connection — please try again", m: " min ", h: " h ", kunQ: "d" }
  };
  function vkT() { return VK_T[lang] || VK_T.uz; }

  var vkData = null, vkTm = null, vkSoat = null, vkLocal = null, vkOlingan = 0, vkYuborildi = -1;

  function vkQol(sek) {
    var t = vkT();
    sek = Math.max(0, Math.round(sek));
    if (sek >= 86400) { return Math.floor(sek / 86400) + " " + t.kunQ + " " + Math.floor(sek % 86400 / 3600) + t.h.replace(/\s+$/, ""); }
    if (sek >= 3600) { return Math.floor(sek / 3600) + t.h + Math.floor(sek % 3600 / 60) + t.m.replace(/\s+$/, ""); }
    return Math.floor(sek / 60) + ":" + (sek % 60 < 10 ? "0" : "") + (sek % 60);
  }

  /* Mahalliy ko'rik uchun namuna: vkLocal.rej = "kutish" | "zal" | "savol" | "natija" | "tugadi" */
  function vkSample(body) {
    if (!vkLocal) { vkLocal = { rej: "kutish", joined: false, mine: null }; }
    var L2 = vkLocal, hozir = Date.now() / 1000;
    if (body && body.join != null) { L2.joined = !!body.join; }
    if (body && body.answer != null) { L2.mine = body.answer; }
    var res = { ok: true, now: hozir, tour: { ts: hozir + 4 * 86400 + 3 * 3600, now: hozir, open: true, n: 14, joined: L2.joined },
      rules: { q: 15, show: 7, max: 30, hall: 120, good: 5, good_pts: 5, points: { "1": 30, "2": 20, "3": 10 } },
      last: { uid: 5, name: "Germiona", house: "gryffindor", n: 23 }, me: { "in": false, alive: false, out: null, right: 0, place: null }, phase: L2.rej };
    var savol = { n: 6, q: "Reyvenklo fakultetining asoschisi kim?", a: ["Xelga Xaffelpaff", "Rovena Reyvenklo", "Godrik Grifindor", "Salazar Sliterin"], mine: L2.mine };
    if (L2.rej === "zal") { res.total = 17; res.alive = 17; res.starts_in = 74; res.me = { "in": true, alive: true, right: 0 }; }
    if (L2.rej === "savol") { res.total = 23; res.alive = 9; res.left = 11; res.question = savol; res.me = { "in": true, alive: true, right: 6 }; }
    if (L2.rej === "natija") { res.total = 23; res.alive = 6; res.next_in = 5; savol.c = 1; savol.mine = L2.mine == null ? 1 : L2.mine; res.question = savol; res.me = { "in": true, alive: savol.mine === 1, out: savol.mine === 1 ? null : 6, right: 7 }; }
    if (L2.rej === "tugadi") {
      res.total = 23; res.alive = 1; res.asked = 14; res.played = true; res.me = { "in": true, alive: false, out: 9, right: 9, place: 4, points: 5 };
      res.top = [["Germiona", "gryffindor", 14], ["Luna", "ravenclaw", 13], ["Sedrik", "hufflepuff", 11], ["Sehrgar", "gryffindor", 9], ["Draco", "slytherin", 8], ["Ron", "gryffindor", 6]]
        .map(function (r, i) { return { uid: 100 + i, place: i + 1, name: r[0], house: r[1], right: r[2], me: i === 3 }; });
    }
    return res;
  }

  function vkPost(body, cb) {
    body = body || {};
    body.lang = lang;
    if (!window.fetch) { return; }
    window.fetch(API_VIK, { method: "POST", headers: { "Content-Type": "application/json", "X-Telegram-Init-Data": drInit() }, body: JSON.stringify(body) })
      .then(function (r) { return r.json(); })
      .then(function (res) { cb(res && res.tour ? res : (MS_LOCAL ? vkSample(body) : res)); })
      ["catch"](function () { cb(MS_LOCAL ? vkSample(body) : null); });
  }

  function vkOpen() {
    try { $("scr-hub").classList.add("hidden"); } catch (e) {}
    drShowGame("scr-vik");
    $("vk-kick").textContent = vkT().kick;
    $("vk-ttl").textContent = vkT().ttl;
    vkRender();
    vkLoad();
  }
  function vkYop() {
    clearTimeout(vkTm);
    clearInterval(vkSoat);
    var ochiq = $("du-info");
    if (ochiq) { ochiq.parentNode.removeChild(ochiq); }
    $("scr-vik").classList.add("hidden");
    openHub();
  }

  // Holatni so'rash: viktorina paytida har 1,2 soniyada, zal ochilishiga yaqin - 5 s, boshqa payt - daqiqada bir
  function vkLoad() {
    clearTimeout(vkTm);
    if ($("scr-vik").classList.contains("hidden")) { return; }
    vkPost({}, function (res) {
      if (res && res.tour) { vkApply(res); }
      var d = vkData, ph = d && d.phase, kech = d ? d.tour.ts - d.now : 99999;
      var oraliq = (ph === "zal" || ph === "savol" || ph === "natija") ? 1200 : (ph === "kutish" && kech < 900) ? 5000 : 60000;
      if (ph === "tugadi" && d.question) { oraliq = 2000; }
      if (!$("scr-vik").classList.contains("hidden") && !MS_LOCAL) { vkTm = setTimeout(vkLoad, oraliq); }
    });
  }
  function vkApply(res) {
    vkData = res;
    vkOlingan = Date.now();
    vkRender();
  }
  function vkYozil(on) {
    vkPost({ join: on ? 1 : 0 }, function (res) { if (res && res.tour) { vkApply(res); } else { showToast(vkT().yoq, "err"); } });
  }
  function vkJavob(n, i) {
    if (vkYuborildi === n) { return; }
    vkYuborildi = n;
    try { if (tg && tg.HapticFeedback) { tg.HapticFeedback.impactOccurred("light"); } } catch (e) {}
    if (vkData && vkData.question) { vkData.question.mine = i; vkRender(); }
    vkPost({ q: n, answer: i }, function (res) {
      if (res && res.tour) { vkApply(res); }
      if (!res || res.answer_ok === false) { if (vkData && vkData.question && vkData.question.n === n && vkData.phase === "savol" && vkData.question.mine == null) { vkYuborildi = -1; } }
    });
  }

  function vkRender() {
    var d = vkData, ph = d ? d.phase : "kutish", oyin = ph === "savol" || ph === "natija" || (ph === "tugadi" && d && d.question);
    $("vk-info-b").classList.toggle("hidden", !!oyin);
    $("vk-home").classList.toggle("hidden", !!oyin || ph === "tugadi");
    $("vk-game").classList.toggle("hidden", !oyin);
    $("vk-end").classList.toggle("hidden", oyin || ph !== "tugadi");
    clearInterval(vkSoat);
    if (!d) { return; }
    if (oyin) { vkOyin(); } else if (ph === "tugadi") { vkYakun(); } else { vkBosh(); }
  }

  /* Bosh ko'rinish: turnir kartasi (qachon / zal), qoida va sovrinlar */
  function vkBosh() {
    var d = vkData, t = vkT(), box = $("vk-hero"), tr = d.tour, zal = d.phase === "zal";
    box.innerHTML = "";
    var tep = drEl("div", "du-h-t"), chap = drEl("span", "du-h-m");
    chap.appendChild(drEl("small", "", t.nom));
    var kun = t.kunlar[new Date((tr.ts + 5 * 3600) * 1000).getUTCDay()];
    chap.appendChild(drEl("b", "", zal ? t.zal : kun.charAt(0).toUpperCase() + kun.slice(1) + ", 22:00"));
    var iz = drEl("em", "", "");
    chap.appendChild(iz);
    tep.appendChild(chap);
    box.appendChild(tep);
    var qol0 = zal ? d.starts_in : tr.ts - tr.now, olingan = vkOlingan;
    var yoz = function () {
      var qol = Math.max(0, qol0 - (Date.now() - olingan) / 1000);
      iz.textContent = zal ? t.zalS(d.total || 0) + " · " + t.bosh(vkQol(qol)) : vkQol(qol) + " " + t.qoldi + " · " + t.soni(tr.n);
    };
    yoz();
    vkSoat = setInterval(yoz, 1000);
    if (zal) {
      var kq = drEl("div", "du-yoz bor");
      kq.appendChild(drEl("b", "", d.me && d.me["in"] ? t.kut : t.kech));
      box.appendChild(kq);
    } else if (tr.open) {
      var yb = drEl("div", "du-yoz" + (tr.joined ? " bor" : ""));
      if (tr.joined) {
        yb.appendChild(drEl("b", "", t.bor));
        var ch = drEl("button", "", t.chiq);
        ch.type = "button";
        ch.addEventListener("click", function () { vkYozil(false); });
        yb.appendChild(ch);
      } else {
        var qb = drEl("button", "dr-btn", t.qat);
        qb.type = "button";
        qb.addEventListener("click", function () { vkYozil(true); });
        yb.appendChild(qb);
      }
      box.appendChild(yb);
    }
    // Qoida: uch qisqa band + sovrinlar
    var q = $("vk-qoida"), r = d.rules || {}, pt = r.points || {};
    q.innerHTML = "";
    [t.q1, t.q2, t.q3].forEach(function (m, i) {
      var b = drEl("div", "vk-q");
      b.appendChild(drEl("u", "", String(i + 1)));
      b.appendChild(drEl("span", "", m));
      q.appendChild(b);
    });
    var sv = drEl("div", "vk-sov");
    sv.appendChild(drEl("small", "", t.sov));
    var qator = drEl("div", "vk-sov-r");
    [1, 2, 3].forEach(function (o) {
      var k = drEl("span", "vk-pz o" + o);
      k.appendChild(drEl("b", "", "+" + (pt[String(o)] || 0)));
      k.appendChild(drEl("small", "", t.orin(o)));
      qator.appendChild(k);
    });
    sv.appendChild(qator);
    sv.appendChild(drEl("p", "", t.yaxshi(r.good || 5, r.good_pts || 5)));
    q.appendChild(sv);
    var gk = golibKarta(d.champs);                // so'nggi viktorina g'oliblari: o'rin va ball (keyingisigacha turadi)
    if (gk) { q.appendChild(gk); } else if (d.last) { q.appendChild(drEl("p", "vk-otgan", t.otgan(d.last.name, d.last.n))); }
  }

  /* O'yin: savol, to'rt variant, vaqt chizig'i; natija - to'g'ri javob yashil, xato qizil */
  function vkOyin() {
    var d = vkData, t = vkT(), s = d.question, natija = d.phase !== "savol", men = d.me || {};
    $("vk-g-n").textContent = t.savolN(s.n + 1);
    $("vk-g-t").textContent = t.tirik(d.alive || 0);
    $("vk-g-q").textContent = s.q;
    var holat = $("vk-g-h");
    holat.className = "vk-g-h";
    if (!men["in"]) { holat.textContent = t.kech; }
    else if (!natija && !men.alive) { holat.textContent = t.chiqqan((men.out || 0) + 1); }
    else if (!natija) { holat.textContent = s.mine != null ? t.qabul : ""; }
    else if (men.out === s.n) { holat.textContent = s.mine == null ? t.ulgurmadi : t.xato; holat.classList.add("yomon"); }
    else if (men.alive && s.mine === s.c) { holat.textContent = t.togri; holat.classList.add("yaxshi"); }
    else if (men.alive && men.saved === s.n) { holat.textContent = dkT().ishladi.feliks; holat.classList.add("yaxshi"); dkVaqt = 0; }      // do'kon: Feliks Felitsis
    else if (men.alive) { holat.textContent = t.bekor; }
    else { holat.textContent = t.chiqqan((men.out || 0) + 1); }
    var box = $("vk-g-a");
    box.innerHTML = "";
    var bosa = !natija && men["in"] && men.alive && s.mine == null;
    s.a.forEach(function (m, i) {
      var b = drEl("button", "vk-a" + (s.mine === i ? " men" : "") + (natija && s.c === i ? " togri" : "") + (natija && s.mine === i && s.c !== i ? " xato" : ""));
      b.type = "button";
      b.appendChild(drEl("u", "", "ABCD".charAt(i)));
      b.appendChild(drEl("span", "", m));
      if (bosa) { b.addEventListener("click", function () { vkJavob(s.n, i); }); } else { b.disabled = true; }
      box.appendChild(b);
    });
    // vaqt: savolda chiziq kamayadi, natijada keyingi savolgacha sanoq
    var chiziq = $("vk-g-v"), ost = $("vk-g-k"), olingan = vkOlingan, jami = (d.rules && d.rules.q) || 15;
    var yur = function () {
      var otdi = (Date.now() - olingan) / 1000;
      if (natija) { chiziq.style.width = "0%"; ost.textContent = d.phase === "natija" ? t.keyingi(Math.max(0, Math.ceil((d.next_in || 0) - otdi))) : t.tugadi; }
      else { var q = Math.max(0, (d.left || 0) - otdi); chiziq.style.width = Math.min(100, q * 100 / jami) + "%"; chiziq.classList.toggle("oz", q < 5); ost.textContent = String(Math.ceil(q)); }
    };
    yur();
    vkSoat = setInterval(yur, 100);
  }

  /* Yakun: birinchi o'ntalik, o'z o'rni va bali */
  function vkYakun() {
    var d = vkData, t = vkT(), box = $("vk-end"), men = d.me || {};
    box.innerHTML = "";
    if (!d.played) {
      box.appendChild(drEl("p", "rk-bosh", t.bolmadi));
    } else {
      box.appendChild(drEl("small", "af-baho-k", t.tugadi + " · " + t.savolN(d.asked)));
      var g = (d.top || [])[0];
      if (g) {
        var gk = drEl("div", "vk-golib");
        var cr = cupCrestImg(g.house, 46);
        if (cr) { gk.appendChild(cr); }
        gk.appendChild(drEl("small", "", t.golib));
        gk.appendChild(drEl("b", "", g.name + (g.me ? " (" + t.siz + ")" : "")));
        box.appendChild(gk);
      }
      if (men.place) {
        var mk = drEl("div", "vk-men");
        mk.appendChild(drEl("b", "", t.orningiz(men.place)));
        mk.appendChild(drEl("small", "", t.togriN(men.right || 0) + (men.points ? " · " + t.ball(men.points) : "")));
        box.appendChild(mk);
      }
      var list = drEl("div", "bl-list");
      (d.top || []).forEach(function (p) {
        var row = drEl("div", "bl-row" + (p.me ? " me" : ""));
        row.appendChild(drEl("i", "o" + p.place, String(p.place)));
        var c2 = drEl("span", "bl-cr"), im = cupCrestImg(p.house, 18);
        if (im) { c2.appendChild(im); }
        row.appendChild(c2);
        row.appendChild(drEl("b", "", p.name + (p.me ? " (" + t.siz + ")" : "")));
        row.appendChild(drEl("em", "", t.togriN(p.right)));
        list.appendChild(odamLink(row, p));
      });
      box.appendChild(list);
    }
    var b = drEl("button", "dr-btn", t.ortga);
    b.type = "button";
    b.addEventListener("click", vkYop);
    box.appendChild(b);
  }

  function vkInfo() {
    var eski = $("du-info"), t = vkT(), r = (vkData && vkData.rules) || {}, pt = r.points || {};
    if (eski) { eski.parentNode.removeChild(eski); }
    var v = { q: r.q || 15, max: r.max || 30, hall: Math.round((r.hall || 120) / 60), good: r.good || 5, gp: r.good_pts || 5, p1: pt["1"] || 30, p2: pt["2"] || 20, p3: pt["3"] || 10 };
    var bandlar = lang === "ru" ? [
      ["Когда", "Раз в неделю — в пятницу в 22:00 (время Ташкента). Длится 10–15 минут."],
      ["Кто участвует", "Каждый распределённый ученик, кто был на этой странице к началу. Записываться заранее не обязательно: кнопка «Участвую» нужна, чтобы сова напомнила. Зал открывается за " + v.hall + " мин. до начала."],
      ["Как это проходит", "Все одновременно видят один вопрос и четыре ответа. На ответ — " + v.q + " секунд, изменить его нельзя. Ошибся или не успел — выбыл и дальше только смотришь."],
      ["Если ошиблись все", "Если на вопрос неверно ответили все оставшиеся, никто не выбывает — вопрос отменяется."],
      ["Кто побеждает", "Тот, кто останется последним. Если после " + v.max + " вопросов осталось несколько человек, выше тот, кто отвечал быстрее."],
      ["Опоздавшие", "Кто пришёл после первого вопроса — зритель: вопросы видит, но отвечать не может."],
      ["Очки", "В кубок факультета: 1-е место +" + v.p1 + ", 2-е +" + v.p2 + ", 3-е +" + v.p3 + ". Всем остальным, кто дал " + v.good + " верных ответов, — +" + v.gp + "."],
      ["Вопросы", "О книгах, фильмах и мире волшебников. Каждую неделю — новые, заранее их не знает никто."]]
      : lang === "en" ? [
      ["When", "Once a week — on Friday at 22:00 (Tashkent time). It takes 10–15 minutes."],
      ["Who plays", "Every sorted student who is on this page when it starts. You do not have to sign up: “I'm in” just makes an owl remind you. The hall opens " + v.hall + " minutes before the start."],
      ["How it works", "Everyone sees the same question with four answers at once. You have " + v.q + " seconds and cannot change your answer. A wrong or late answer and you are out — from then on you only watch."],
      ["If everyone is wrong", "If all remaining players answer wrongly, nobody goes out — the question is void."],
      ["Who wins", "The last wizard standing. If several are left after " + v.max + " questions, the faster one ranks higher."],
      ["Latecomers", "Anyone who arrives after the first question is a spectator: they see the questions but cannot answer."],
      ["Points", "For the House Cup: 1st place +" + v.p1 + ", 2nd +" + v.p2 + ", 3rd +" + v.p3 + ". Everyone else with " + v.good + " correct answers gets +" + v.gp + "."],
      ["Questions", "About the books, the films and the wizarding world. New ones every week — nobody knows them in advance."]]
      : [
      ["Qachon", "Haftada bir marta — juma kuni soat 22:00 da (Toshkent vaqti). 10–15 daqiqa davom etadi."],
      ["Kim qatnashadi", "Boshlanish paytida shu sahifada bo'lgan har bir saralangan o'quvchi. Oldindan yozilish shart emas: «Qatnashaman» tugmasi boyo'g'li eslatishi uchun kerak. Zal boshlanishidan " + v.hall + " daqiqa oldin ochiladi."],
      ["Qanday o'tadi", "Hamma bir vaqtda bitta savol va to'rtta javobni ko'radi. Javobga " + v.q + " soniya beriladi, uni o'zgartirib bo'lmaydi. Xato qilgan yoki ulgurmagan chiqib ketadi va qolganini faqat tomosha qiladi."],
      ["Hamma xato qilsa", "Qolganlarning hammasi savolga xato javob bersa, hech kim chiqmaydi — savol bekor bo'ladi."],
      ["Kim yutadi", "Oxirida qolgan bitta sehrgar. " + v.max + " ta savoldan keyin ham bir necha kishi qolsa, tezroq javob bergani yuqori turadi."],
      ["Kechikkanlar", "Birinchi savoldan keyin kelgan — tomoshabin: savollarni ko'radi, lekin javob bera olmaydi."],
      ["Ballar", "Fakultet kubogiga: 1-o'rin +" + v.p1 + ", 2-o'rin +" + v.p2 + ", 3-o'rin +" + v.p3 + ". Qolganlardan " + v.good + " ta to'g'ri javob berganlarga +" + v.gp + "."],
      ["Savollar", "Kitoblar, filmlar va sehrgarlar olami haqida. Har hafta yangi, oldindan hech kim bilmaydi."]];
    var orqa = drEl("div", "du-info"), oyna = drEl("div", "du-info-p"), yop = function () { if (orqa.parentNode) { orqa.parentNode.removeChild(orqa); } };
    orqa.id = "du-info";
    var bosh = drEl("div", "du-info-h");
    bosh.appendChild(drEl("b", "", t.nom));
    var xb = drEl("button", "", "×");
    xb.type = "button";
    xb.addEventListener("click", yop);
    bosh.appendChild(xb);
    oyna.appendChild(bosh);
    var tana = drEl("div", "du-info-b");
    bandlar.forEach(function (b, i) {
      var q = drEl("div", "du-info-q");
      q.appendChild(drEl("u", "", String(i + 1)));
      var m = document.createElement("span");
      m.appendChild(drEl("b", "", b[0]));
      m.appendChild(drEl("p", "", b[1]));
      q.appendChild(m);
      tana.appendChild(q);
    });
    oyna.appendChild(tana);
    orqa.appendChild(oyna);
    orqa.addEventListener("click", function (e) { if (e.target === orqa) { yop(); } });
    document.body.appendChild(orqa);
  }

  function vkSetup() {
    $("vk-back").addEventListener("click", vkYop);
    $("vk-info-b").addEventListener("click", vkInfo);
  }

  vkSetup();
