/* DIREKTOR XONASI - g'oyalar qutisi (egasi, 2026-11-05): Notion'dagi g'oya so'rovnomasi o'rniga, Xogvarts sahifasida xona.
   Xonada: Dambldor salomi, Xotiralar kosasi (g'oya yozish), Direktor stoli (qabul qilingan - ustida ishlanmoqda),
   Amalga oshgan g'oyalar devori (muallif ismi bilan - egasi rozi), Mening g'oyalarim (holat va javob).
   Ovoz berish YO'Q (egasi rad etgan). Maxfiy so'z o'yini YO'Q (egasi: kerak emas).
   Xogvarts katagi - barcha xonalar ochiladigan kursdan (GOY_KURS). Kanal videosi tugmasi (startapp=goya) va so'rovnoma
   oxiri xonani to'g'ridan-to'g'ri ochadi - Xogvartsga kirmagan odam ham g'oya yoza oladi.
   Server: hpgoya.py, POST /api/goya ({} - o'z g'oyalari + stol + devor, {yangi: {nom, batafsil, bolim}}). YOQIQ = False - faqat adminga.
   «Batafsil» maydoni g'oya ortidagi ehtiyojni so'raydi (The Mom Test: g'oyani tushunib ol, ko'r-ko'rona bajarma).
   Ilova kodi bir necha faylga bo'lingan; hammasi BIR umumiy maydonda ishlaydi
   va index.html dagi TARTIBDA yuklanadi. Yuklanish paytida keyingi fayldagi
   narsani chaqirmang - tekshiruv: tools/tartib.js */
"use strict";

  var API_GOYA = "https://bot.tizimshunos.uz/api/goya";
  var GOY_KURS = 3;                       // Xonalar guruhining hammasi (Qo'riqxona, Issiqxona) 3-kursda ochiladi
  var GOY_BOLIM = ["filmlar", "kutubxona", "xogvarts", "boshqa"];
  var GOY_RASM = { xona: "img/goya/xona.webp", kosa: "img/goya/kosa.webp" };
  var GOY_T = {
    uz: {
      kick: "Xogvarts", egasi: "Albus Dambldor", ttl: "Direktor xonasi", korik: "Faqat sizga ko'rinadi", meningN: function (n) { return "Sizniki: " + n; }, bajN: function (n) { return n + " g'oya bajarildi"; },
      salom: "Xonamga xush kelibsiz! Ilovani birga yaxshilaymiz: g'oyangizni Xotiralar kosasiga qoldiring — har birini o'qiyman, javobini shu yerda ko'rasiz.",
      kosa: "Xotiralar kosasi", kosaS: "Ilovaga nima qo'shilsin yoki o'zgarsin?", yoz: "G'oya yozish",
      nom: "Qisqacha", nomP: "Masalan: kitoblarni ovozli qilish",
      bat: "Bu sizga qachon kerak bo'ldi?", batP: "Oxirgi marta nima qilmoqchi edingiz va nima xalaqit berdi? (ixtiyoriy)",
      bolim: "Qaysi bo'lim", b: { filmlar: "Filmlar", kutubxona: "Kutubxona", xogvarts: "Xogvarts", boshqa: "Boshqa" },
      yubor: "Kosaga tashlash", bekor: "Bekor qilish", yuborildi: "G'oyangiz kosaga tushdi — Dambldor o'qib chiqadi",
      stol: "Direktor stoli", stolS: "Ustida ishlanmoqda", stolB: "Hozircha stol bo'sh",
      devor: "Amalga oshgan g'oyalar", devorB: "Devor hali bo'sh. Birinchi bo'lib g'oyangiz shu yerga osilsin!",
      mening: "Mening g'oyalarim", bosh: "Hali g'oya yubormagansiz",
      h: { yangi: "Yangi", korildi: "Ko'rib chiqilmoqda", qabul: "Qabul qilindi", rad: "Hozircha qabul qilinmadi", bajarildi: "Bajarildi" },
      javob: "Dambldor javobi", xNom: "Kamida 3 harf yozing", xKop: function (n) { return "Bugun " + n + " ta g'oya yubordingiz — ertaga yana yozing"; },
      xato: "Aloqa yo'q — qayta urinib ko'ring",
      tileS: function (n) { return n ? n + " g'oya bajarildi" : "G'oya yozish"; }
    },
    ru: {
      kick: "Хогвартс", egasi: "Альбус Дамблдор", ttl: "Кабинет директора", korik: "Видно только вам", meningN: function (n) { return "Ваших: " + n; }, bajN: function (n) { return "Воплощено: " + n; },
      salom: "Добро пожаловать в мой кабинет! Давайте улучшать приложение вместе: оставьте идею в Омуте памяти — я прочту каждую, ответ появится здесь.",
      kosa: "Омут памяти", kosaS: "Что добавить или изменить в приложении?", yoz: "Написать идею",
      nom: "Кратко", nomP: "Например: озвучить книги",
      bat: "Когда вам это понадобилось?", batP: "Что вы хотели сделать в последний раз и что помешало? (необязательно)",
      bolim: "Раздел", b: { filmlar: "Фильмы", kutubxona: "Библиотека", xogvarts: "Хогвартс", boshqa: "Другое" },
      yubor: "Опустить в Омут", bekor: "Отмена", yuborildi: "Идея в Омуте — Дамблдор её прочтёт",
      stol: "Стол директора", stolS: "В работе", stolB: "Пока на столе пусто",
      devor: "Воплощённые идеи", devorB: "Стена пока пуста. Пусть ваша идея будет первой!",
      mening: "Мои идеи", bosh: "Вы ещё не отправляли идей",
      h: { yangi: "Новая", korildi: "На рассмотрении", qabul: "Принята", rad: "Пока не принята", bajarildi: "Реализована" },
      javob: "Ответ Дамблдора", xNom: "Напишите хотя бы 3 буквы", xKop: function (n) { return "Сегодня вы отправили " + n + " идей — напишите завтра"; },
      xato: "Нет связи — попробуйте ещё раз",
      tileS: function (n) { return n ? "Воплощено: " + n : "Написать идею"; }
    },
    en: {
      kick: "Hogwarts", egasi: "Albus Dumbledore", ttl: "Headmaster's office", korik: "Only you can see this", meningN: function (n) { return "Yours: " + n; }, bajN: function (n) { return n + " ideas done"; },
      salom: "Welcome to my office! Let's make the app better together: leave your idea in the Pensieve — I read every one, and the reply will appear here.",
      kosa: "The Pensieve", kosaS: "What should the app add or change?", yoz: "Write an idea",
      nom: "In short", nomP: "E.g. audio versions of the books",
      bat: "When did you need it?", batP: "What were you trying to do last time, and what got in the way? (optional)",
      bolim: "Section", b: { filmlar: "Films", kutubxona: "Library", xogvarts: "Hogwarts", boshqa: "Other" },
      yubor: "Drop into the Pensieve", bekor: "Cancel", yuborildi: "Your idea is in the Pensieve — Dumbledore will read it",
      stol: "Headmaster's desk", stolS: "In progress", stolB: "The desk is empty for now",
      devor: "Ideas come true", devorB: "The wall is still empty. Let your idea be the first!",
      mening: "My ideas", bosh: "You haven't sent any ideas yet",
      h: { yangi: "New", korildi: "Under review", qabul: "Accepted", rad: "Not accepted for now", bajarildi: "Done" },
      javob: "Dumbledore's reply", xNom: "Please write at least 3 letters", xKop: function (n) { return "You sent " + n + " ideas today — write again tomorrow"; },
      xato: "No connection — please try again",
      tileS: function (n) { return n ? n + " ideas done" : "Write an idea"; }
    }
  };
  function goyT() { return GOY_T[lang] || GOY_T.uz; }

  var goyData = null, goyVaqt = 0, goyKut = false, goyLocal = null, goyBolim = "boshqa", goyHubOn = false;
  var goySp = false;
  try {
    var goyS = (tg && tg.initDataUnsafe && tg.initDataUnsafe.start_param) || "";
    if (!goyS) { var goyM = /[?&#]tgWebAppStartParam=([^&#]+)/.exec((window.location.search || "") + (window.location.hash || "")); if (goyM) { goyS = decodeURIComponent(goyM[1]); } }
    goySp = goyS === "goya";
  } catch (e) { goySp = false; }

  // Mahalliy ko'rik (localhost): server o'rnida namuna
  function goySample(body) {
    if (!goyLocal) {
      goyLocal = {
        list: [{ id: 1, nom: "Kitoblarni ovozli qilish", batafsil: "Yo'lda ketayotganda tinglasam bo'lardi", bolim: "kutubxona", holat: "qabul", javob: "Rejaga kiritdik, rahmat!", vaqt: "2026-11-01T10:00:00Z" }],
        stol: [{ id: 1, nom: "Kitoblarni ovozli qilish", bolim: "kutubxona", ism: "Malika", house: "ravenclaw" },
               { id: 4, nom: "Turnirlar jadvalini taqvimga qo'shish", bolim: "xogvarts", ism: "Jasur", house: "gryffindor" }],
        devor: [{ id: 2, nom: "Pleyerda to'xtagan joydan davom etish", bolim: "filmlar", ism: "Farangiz", house: "slytherin" },
                { id: 3, nom: "Shokolad qurbaqa kolleksiyasi", bolim: "xogvarts", ism: "Dilnoza", house: "hufflepuff" },
                { id: 5, nom: "Toshchalar o'yinini ikki raund qilish", bolim: "xogvarts", ism: "Sardor", house: "gryffindor" }]
      };
    }
    if (body && body.yangi) {
      if (String(body.yangi.nom || "").trim().length < 3) { return { ok: false, error: "nom" }; }
      goyLocal.list.unshift({ id: goyLocal.list.length + 10, nom: body.yangi.nom, batafsil: body.yangi.batafsil || "", bolim: body.yangi.bolim, holat: "yangi", javob: "", vaqt: new Date().toISOString() });
    }
    return { ok: true, on: true, preview: true, list: goyLocal.list, stol: goyLocal.stol, devor: goyLocal.devor, kuniga: 5 };
  }
  function goyPost(body, cb) {
    if (!window.fetch) { cb(null); return; }
    window.fetch(API_GOYA, { method: "POST", headers: { "Content-Type": "application/json", "X-Telegram-Init-Data": drInit() }, body: JSON.stringify(body || {}) })
      .then(function (r) { return r.json(); })
      .then(function (res) { cb(res && (res.ok || res.error) ? res : (MS_LOCAL ? goySample(body) : res)); })
      ["catch"](function () { cb(MS_LOCAL ? goySample(body) : null); });
  }
  function goyOn() { return !!(goyData && goyData.on); }
  // 2 daqiqada bir martadan ko'p so'ralmaydi; kutilmoqda bo'lsa cb keyin chaqiriladi
  function goyLoad(cb) {
    if (goyData && Date.now() - goyVaqt < 120000) { cb && cb(); return; }
    if (goyKut) { return; }
    goyKut = true;
    goyPost({}, function (res) {
      goyKut = false; goyVaqt = Date.now();
      if (res && res.ok) { goyData = res; }
      cb && cb();
    });
  }
  // Xogvarts bosh sahifasi (openHub): katak ko'rinishi o'zgarsagina bosh sahifa bir marta qayta chiziladi
  function goyHub() {
    goyLoad(function () {
      if (goyOn() !== goyHubOn) { goyHubOn = goyOn(); try { if (hubVisible()) { renderHub(); } } catch (e) {} }
    });
  }
  function goyTile() {
    if (!goyOn()) { return []; }
    var t = goyT();
    return [{ key: "goya", kurs: GOY_KURS, title: t.ttl, sub: t.tileS(((goyData && goyData.devor) || []).length), self: true, go: goyOch }];
  }
  // Kanal videosi tugmasi (startapp=goya): kutubxona ochilganda (renderWorldBtn) xonani o'zi ochadi
  function goyStart() {
    if (!goySp) { return; }
    goySp = false;
    goyLoad(function () { if (goyOn()) { setTimeout(goyOch, 500); } });
  }

  // ---------- Xona (xona qolipi - js/09-xona-qolip.js) ----------
  var goyX = null;
  function goyHolatYoz() {
    if (!goyX) { return; }
    var t = goyT(), d = goyData || {};
    goyX.kick(d.preview ? t.korik : t.egasi);
    goyX.holat(t.bajN((d.devor || []).length), (d.list || []).length ? t.meningN((d.list || []).length) : "");
  }
  function goyOch() {
    try { ankYop(); } catch (e) {}
    var t = goyT();
    goyX = xonaQur({ id: "goy", kick: t.egasi, ttl: t.ttl, ortga: goyYop, rasm: GOY_RASM.xona,
                     egasi: { matn: t.salom, rasm: ANK_RASM.salom } });
    goyHolatYoz();
    xonaOch(goyX);
    goyChiz();
    goyPost({}, function (res) { if (res && res.ok) { goyData = res; goyVaqt = Date.now(); goyHolatYoz(); goyBolimlar(); } });
  }
  function goyYop() { xonaYop(goyX); }
  function goyChiz() {
    var ich = goyX.ich, t = goyT();
    ich.innerHTML = "";
    // Xotiralar kosasi - asosiy harakat
    var k = drEl("div", "goy-kosa");
    k.id = "goy-kosa";
    var kb = drEl("div", "goy-kosa-b");
    var ki = drEl("span", "goy-kosa-im");
    var kim = document.createElement("img"); kim.alt = ""; kim.src = GOY_RASM.kosa;
    kim.onerror = function () { kim.remove(); };
    ki.appendChild(kim);
    kb.appendChild(ki);
    var kt = drEl("span", "goy-kosa-tx");
    kt.appendChild(drEl("b", "", t.kosa));
    kt.appendChild(drEl("span", "", t.kosaS));
    kb.appendChild(kt);
    k.appendChild(kb);
    var och = drEl("button", "dr-btn", t.yoz);
    och.type = "button"; och.id = "goy-och";
    och.onclick = function () { k.classList.add("ochiq"); setTimeout(function () { try { $("goy-nom").focus(); } catch (e) {} }, 200); };
    k.appendChild(och);
    k.appendChild(goyForma());
    ich.appendChild(k);
    // Stol, devor, mening g'oyalarim
    var bl = drEl("div", "");
    bl.id = "goy-bl";
    ich.appendChild(bl);
    goyBolimlar();
  }
  function goyForma() {
    var t = goyT(), f = drEl("div", "goy-f");
    f.appendChild(drEl("label", "goy-l", t.nom));
    var nom = document.createElement("input");
    nom.id = "goy-nom"; nom.maxLength = 120; nom.placeholder = t.nomP; nom.className = "goy-in";
    f.appendChild(nom);
    f.appendChild(drEl("label", "goy-l", t.bat));
    var bat = document.createElement("textarea");
    bat.id = "goy-bat"; bat.maxLength = 1500; bat.rows = 3; bat.placeholder = t.batP; bat.className = "goy-in";
    f.appendChild(bat);
    f.appendChild(drEl("label", "goy-l", t.bolim));
    var ch = drEl("div", "goy-ch");
    GOY_BOLIM.forEach(function (b) {
      var x = drEl("button", "ank-v" + (b === goyBolim ? " on" : ""), t.b[b]);
      x.type = "button";
      x.onclick = function () { goyBolim = b; Array.prototype.forEach.call(ch.children, function (c, i) { c.classList.toggle("on", GOY_BOLIM[i] === b); }); };
      ch.appendChild(x);
    });
    f.appendChild(ch);
    var iz = drEl("p", "ank-iz hidden");
    iz.id = "goy-iz";
    f.appendChild(iz);
    var ok = drEl("button", "ank-ok", t.yubor);
    ok.type = "button"; ok.id = "goy-ok";
    ok.onclick = goyYubor;
    f.appendChild(ok);
    var bk = drEl("button", "ank-skip", t.bekor);
    bk.type = "button";
    bk.onclick = function () { $("goy-kosa").classList.remove("ochiq"); iz.classList.add("hidden"); };
    f.appendChild(bk);
    return f;
  }
  function goyYubor() {
    var t = goyT(), nom = $("goy-nom").value.trim(), iz = $("goy-iz"), ok = $("goy-ok");
    if (nom.replace(/[^\p{L}]/gu, "").length < 3) { iz.textContent = t.xNom; iz.classList.remove("hidden"); $("goy-nom").focus(); return; }
    ok.disabled = true;
    goyPost({ yangi: { nom: nom, batafsil: $("goy-bat").value.trim(), bolim: goyBolim }, lang: lang }, function (res) {
      ok.disabled = false;
      if (res && res.ok) {
        goyData = res; goyVaqt = Date.now();
        $("goy-nom").value = ""; $("goy-bat").value = ""; iz.classList.add("hidden");
        goyIp();
        goyHolatYoz();
        showToast(t.yuborildi, "ok");
        try { if (tg && tg.HapticFeedback) { tg.HapticFeedback.notificationOccurred("success"); } } catch (e) {}
        goyBolimlar();
        return;
      }
      iz.textContent = res && res.error === "kop" ? t.xKop((goyData && goyData.kuniga) || 5) : res && res.error === "nom" ? t.xNom : t.xato;
      iz.classList.remove("hidden");
    });
  }
  // Kumush ip kosaga tushadi (g'oya yuborilganda)
  function goyIp() {
    var k = $("goy-kosa");
    k.classList.remove("ochiq");
    k.classList.remove("ip"); void k.offsetWidth; k.classList.add("ip");
    setTimeout(function () { k.classList.remove("ip"); }, 1900);
    try { k.scrollIntoView({ behavior: "smooth", block: "center" }); } catch (e) {}
  }
  function goySana(iso) {
    try { var d = new Date(iso); return d.getDate() + "." + String(d.getMonth() + 1).padStart(2, "0") + "." + d.getFullYear(); } catch (e) { return ""; }
  }
  function goyGerb(h) {
    var i = document.createElement("img");
    i.className = "goy-gerb"; i.alt = "";
    try { if (h && HOUSES[h] && HOUSES[h].img) { i.src = IMG_DIR + HOUSES[h].img; return i; } } catch (e) {}
    return null;
  }
  function goyBolimlar() {
    var bl = $("goy-bl"), t = goyT(), d = goyData || {};
    if (!bl) { return; }
    bl.innerHTML = "";
    // Direktor stoli
    xonaSek(bl, t.stol, t.stolS);
    var stol = drEl("div", "goy-stol");
    if (!(d.stol || []).length) { stol.appendChild(drEl("p", "goy-bosh", t.stolB)); }
    (d.stol || []).forEach(function (g) {
      var c = drEl("div", "goy-st");
      c.appendChild(drEl("b", "", g.nom));
      var m = drEl("span", "goy-mu");
      var gr = goyGerb(g.house); if (gr) { m.appendChild(gr); }
      m.appendChild(document.createTextNode(g.ism));
      c.appendChild(m);
      stol.appendChild(c);
    });
    bl.appendChild(stol);
    // Amalga oshgan g'oyalar devori - portret ramkalari
    xonaSek(bl, t.devor);
    var dv = drEl("div", "goy-devor");
    if (!(d.devor || []).length) { dv.appendChild(drEl("p", "goy-bosh", t.devorB)); dv.classList.add("bosh"); }
    (d.devor || []).forEach(function (g) {
      var r = drEl("div", "goy-ramka");
      r.appendChild(drEl("b", "", g.nom));
      var m = drEl("span", "goy-mu");
      var gr = goyGerb(g.house); if (gr) { m.appendChild(gr); }
      m.appendChild(document.createTextNode(g.ism));
      r.appendChild(m);
      dv.appendChild(r);
    });
    bl.appendChild(dv);
    // Mening g'oyalarim
    xonaSek(bl, t.mening);
    var l = drEl("div", "goy-list");
    var r0 = d.list || [];
    if (!r0.length) { l.appendChild(drEl("p", "goy-bosh", t.bosh)); }
    r0.forEach(function (g) {
      var c = drEl("div", "goy-c");
      var bosh = drEl("div", "goy-c-h");
      bosh.appendChild(drEl("b", "", g.nom));
      bosh.appendChild(drEl("span", "goy-hl " + g.holat, t.h[g.holat] || g.holat));
      c.appendChild(bosh);
      c.appendChild(drEl("span", "goy-c-m", (t.b[g.bolim] || "") + " · " + goySana(g.vaqt)));
      if (g.batafsil) { c.appendChild(drEl("p", "goy-c-b", g.batafsil)); }
      if (g.javob) {
        var j = drEl("div", "goy-c-j");
        j.appendChild(drEl("span", "", t.javob));
        j.appendChild(drEl("p", "", g.javob));
        c.appendChild(j);
      }
      l.appendChild(c);
    });
    bl.appendChild(l);
  }
