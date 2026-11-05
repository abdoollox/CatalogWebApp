/* G'oyalar qutisi (egasi, 2026-11-04/05): Notion'dagi g'oya so'rovnomasi o'rniga ilova ichida; nazorati - kuzatuv panelida.
   Server: hpgoya.py, POST /api/goya ({} - o'z g'oyalari, {yangi: {nom, batafsil, bolim}}). YOQIQ = False bo'lsa faqat adminga.
   Kirish: profil (Sozlamalar ustida qator) va so'rovnoma oxiri (Dambldor yo'llaydi). Ko'rinishi zamonaviy, qahramonsiz.
   «Batafsil» maydoni g'oyaning ortidagi ehtiyojni so'raydi (The Mom Test: g'oyani tushunib ol, ko'r-ko'rona bajarma).
   Ilova kodi bir necha faylga bo'lingan; hammasi BIR umumiy maydonda ishlaydi
   va index.html dagi TARTIBDA yuklanadi. Yuklanish paytida keyingi fayldagi
   narsani chaqirmang - tekshiruv: tools/tartib.js */
"use strict";

  var API_GOYA = "https://bot.tizimshunos.uz/api/goya";
  var GOY_BOLIM = ["filmlar", "kutubxona", "xogvarts", "boshqa"];
  var GOY_T = {
    uz: {
      kick: "Ilova uchun", ttl: "G'oyalar qutisi", korik: "Faqat sizga ko'rinadi",
      kirish: "Ilovada nimani qo'shish yoki o'zgartirish kerak deb o'ylaysiz? Har bir g'oyani o'qiymiz, javobini shu yerda ko'rasiz.",
      nom: "Qisqacha", nomP: "Masalan: kitoblarni ovozli qilish",
      bat: "Bu sizga qachon kerak bo'ldi?", batP: "Oxirgi marta nima qilmoqchi edingiz va nima xalaqit berdi? (ixtiyoriy)",
      bolim: "Qaysi bo'lim", b: { filmlar: "Filmlar", kutubxona: "Kutubxona", xogvarts: "Xogvarts", boshqa: "Boshqa" },
      yubor: "Yuborish", yuborildi: "G'oyangiz yuborildi — rahmat!", mening: "Mening g'oyalarim", bosh: "Hali g'oya yubormagansiz",
      h: { yangi: "Yangi", korildi: "Ko'rib chiqilmoqda", qabul: "Qabul qilindi", rad: "Hozircha qabul qilinmadi", bajarildi: "Bajarildi" },
      javob: "Javob", xNom: "Kamida 3 harf yozing", xKop: function (n) { return "Bugun " + n + " ta g'oya yubordingiz — ertaga yana yozing"; },
      xato: "Aloqa yo'q — qayta urinib ko'ring", qator: "Ilova uchun taklifingizni yozing"
    },
    ru: {
      kick: "Для приложения", ttl: "Ящик идей", korik: "Видно только вам",
      kirish: "Что, по-вашему, стоит добавить или изменить в приложении? Мы читаем каждую идею, ответ появится здесь.",
      nom: "Кратко", nomP: "Например: озвучить книги",
      bat: "Когда вам это понадобилось?", batP: "Что вы хотели сделать в последний раз и что помешало? (необязательно)",
      bolim: "Раздел", b: { filmlar: "Фильмы", kutubxona: "Библиотека", xogvarts: "Хогвартс", boshqa: "Другое" },
      yubor: "Отправить", yuborildi: "Идея отправлена — спасибо!", mening: "Мои идеи", bosh: "Вы ещё не отправляли идей",
      h: { yangi: "Новая", korildi: "На рассмотрении", qabul: "Принята", rad: "Пока не принята", bajarildi: "Реализована" },
      javob: "Ответ", xNom: "Напишите хотя бы 3 буквы", xKop: function (n) { return "Сегодня вы отправили " + n + " идей — напишите завтра"; },
      xato: "Нет связи — попробуйте ещё раз", qator: "Напишите предложение для приложения"
    },
    en: {
      kick: "For the app", ttl: "Idea box", korik: "Only you can see this",
      kirish: "What do you think the app should add or change? We read every idea — the reply will appear here.",
      nom: "In short", nomP: "E.g. audio versions of the books",
      bat: "When did you need it?", batP: "What were you trying to do last time, and what got in the way? (optional)",
      bolim: "Section", b: { filmlar: "Films", kutubxona: "Library", xogvarts: "Hogwarts", boshqa: "Other" },
      yubor: "Send", yuborildi: "Idea sent — thank you!", mening: "My ideas", bosh: "You haven't sent any ideas yet",
      h: { yangi: "New", korildi: "Under review", qabul: "Accepted", rad: "Not accepted for now", bajarildi: "Done" },
      javob: "Reply", xNom: "Please write at least 3 letters", xKop: function (n) { return "You sent " + n + " ideas today — write again tomorrow"; },
      xato: "No connection — please try again", qator: "Suggest something for the app"
    }
  };
  function goyT() { return GOY_T[lang] || GOY_T.uz; }

  var goyData = null, goyVaqt = 0, goyKut = false, goyLocal = null, goyBolim = "boshqa";

  function goySample(body) {
    if (!goyLocal) { goyLocal = [{ id: 1, nom: "Kitoblarni ovozli qilish", batafsil: "Yo'lda ketayotganda tinglasam bo'lardi", bolim: "kutubxona", holat: "qabul", javob: "Rejaga kiritdik, rahmat!", vaqt: "2026-11-01T10:00:00Z" }]; }
    if (body && body.yangi) {
      if (String(body.yangi.nom || "").trim().length < 3) { return { ok: false, error: "nom" }; }
      goyLocal.unshift({ id: goyLocal.length + 1, nom: body.yangi.nom, batafsil: body.yangi.batafsil || "", bolim: body.yangi.bolim, holat: "yangi", javob: "", vaqt: new Date().toISOString() });
    }
    return { ok: true, on: true, preview: true, list: goyLocal, kuniga: 5 };
  }
  function goyPost(body, cb) {
    if (!window.fetch) { cb(null); return; }
    window.fetch(API_GOYA, { method: "POST", headers: { "Content-Type": "application/json", "X-Telegram-Init-Data": drInit() }, body: JSON.stringify(body || {}) })
      .then(function (r) { return r.json(); })
      .then(function (res) { cb(res && (res.ok || res.error) ? res : (MS_LOCAL ? goySample(body) : res)); })
      ["catch"](function () { cb(MS_LOCAL ? goySample(body) : null); });
  }
  function goyOn() { return !!(goyData && goyData.on); }
  // Profil yoki so'rovnoma ochilganda: 2 daqiqada bir martadan ko'p so'ralmaydi
  function goyLoad(cb) {
    if (goyKut || (goyData && Date.now() - goyVaqt < 120000)) { goyPmRow(); cb && cb(); return; }
    goyKut = true;
    goyPost({}, function (res) {
      goyKut = false; goyVaqt = Date.now();
      if (res && res.ok) { goyData = res; }
      goyPmRow();
      cb && cb();
    });
  }

  // Profilda «Sozlamalar» ustida qator (pmFill chaqiradi)
  function goyPmRow() {
    var lbl = $("pm-sec2"), r = $("goy-pm"), t = goyT();
    if (!lbl) { return; }
    if (!r) {
      r = document.createElement("button");
      r.type = "button"; r.id = "goy-pm"; r.className = "goy-pm hidden";
      lbl.parentNode.insertBefore(r, lbl);
      r.onclick = goyOch;
    }
    r.classList.toggle("hidden", !goyOn());
    r.innerHTML = '<span class="goy-pm-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-3.6 10.8c.6.5 1 1.2 1 2V16h5.2v-.2c0-.8.4-1.5 1-2A6 6 0 0 0 12 3z"/></svg></span>';
    var tx = drEl("span", "goy-pm-tx");
    tx.appendChild(drEl("b", "", t.ttl));
    tx.appendChild(drEl("span", "", goyData && goyData.preview ? t.korik : t.qator));
    r.appendChild(tx);
    r.appendChild(drEl("span", "goy-pm-ch", "›"));
  }

  function goyEl() {
    var o = $("goy");
    if (o) { return o; }
    o = document.createElement("div");
    o.id = "goy"; o.className = "goy hidden";
    o.innerHTML = '<div class="goy-top"><div class="goy-id"><span class="goy-k" id="goy-k"></span><b class="goy-n" id="goy-n"></b></div>' +
      '<button class="ank-x" id="goy-x" type="button" aria-label="×"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M6.5 6.5l11 11M17.5 6.5l-11 11"/></svg></button></div>' +
      '<div class="goy-ich" id="goy-ich"></div>';
    document.body.appendChild(o);
    $("goy-x").onclick = goyYop;
    return o;
  }
  function goyOch() {
    try { ankYop(); } catch (e) {}
    var o = goyEl(), t = goyT();
    $("goy-k").textContent = goyData && goyData.preview ? t.korik : t.kick;
    $("goy-n").textContent = t.ttl;
    o.classList.remove("hidden");
    document.body.classList.add("ank-ochiq");
    goyChiz();
    goyPost({}, function (res) { if (res && res.ok) { goyData = res; goyVaqt = Date.now(); goyRoyxat(); } });
  }
  function goyYop() {
    var o = $("goy");
    if (o) { o.classList.add("hidden"); }
    document.body.classList.remove("ank-ochiq");
  }
  function goyChiz() {
    var ich = $("goy-ich"), t = goyT();
    ich.innerHTML = "";
    ich.appendChild(drEl("p", "goy-kir", t.kirish));
    var f = drEl("div", "goy-f");
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
    ich.appendChild(f);
    ich.appendChild(drEl("span", "pm-lbl goy-ml", t.mening));
    var l = drEl("div", "goy-list");
    l.id = "goy-list";
    ich.appendChild(l);
    goyRoyxat();
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
        showToast(t.yuborildi, "ok");
        try { if (tg && tg.HapticFeedback) { tg.HapticFeedback.notificationOccurred("success"); } } catch (e) {}
        goyRoyxat();
        return;
      }
      iz.textContent = res && res.error === "kop" ? t.xKop((goyData && goyData.kuniga) || 5) : res && res.error === "nom" ? t.xNom : t.xato;
      iz.classList.remove("hidden");
    });
  }
  function goySana(iso) {
    try { var d = new Date(iso); return d.getDate() + "." + String(d.getMonth() + 1).padStart(2, "0") + "." + d.getFullYear(); } catch (e) { return ""; }
  }
  function goyRoyxat() {
    var l = $("goy-list"), t = goyT();
    if (!l) { return; }
    l.innerHTML = "";
    var r = (goyData && goyData.list) || [];
    if (!r.length) { l.appendChild(drEl("p", "goy-bosh", t.bosh)); return; }
    r.forEach(function (g) {
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
  }
