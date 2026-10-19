/* KUBOK MAROSIMI (o'quvchi Farangiz taklifi, 2026-10-19: «haqiqiy kubokni ko'rishni xohlardim, kichkina kubok belgisini emas»).
   Hafta yopilgach g'olib fakultet ochiladigan to'liq ekranli oyna: katta Xogvarts kubogi (img/kubok/kubok.webp, Gemini),
   orqasida g'olib fakultet rangidagi nur va uchqunlar, fakultet nomi, ballar, to'rt fakultet o'rni, o'quvchining o'z hissasi.
   O'z fakulteti yutsa - bayram (konfetti), yutmasa - g'olibni tabriklash va o'z fakulteti o'rni.
   kbmOch(s, men): s = kubok tarixidagi yopilgan hafta {number, winner, houses: [{house, total_points}], top}, men = {uy, ball, gal} (bo'lmasa ham bo'ladi).
   Ilova kodi bir necha faylga bo'lingan; hammasi BIR umumiy maydonda ishlaydi
   va index.html dagi TARTIBDA yuklanadi. Yuklanish paytida keyingi fayldagi
   narsani chaqirmang - tekshiruv: tools/tartib.js */
"use strict";

  var KBM_T = {
    uz: { kick: function (n) { return "Xogvarts kubogi · " + n + "-hafta"; }, oldi: "kubokni qo'lga kiritdi!", sizlar: "Fakultetingiz kubokni oldi!",
          ball: "ball", orinlar: "Fakultetlar", siz: "Sizning hissangiz", sizBall: function (b) { return "+" + b + " ball"; },
          gal: function (g) { return "+" + g + " galleon hamyoningizga tushdi"; }, uyOrin: function (u, o) { return u + " — " + o + "-o'rin"; },
          eng: "Haftaning eng yaxshi sehrgari", tarix: "Kubok tarixi", davom: "Davom etish", yangi: "Yangi hafta boshlandi — kubok yana o'ynaladi",
          bosh: "Bu hafta ball to'plamadingiz — yangi haftada fakultetingizga yordam bering",
          ulash: "G'alabani ulashish", kut: "Rasm tayyorlanmoqda…", story: "Fakultetimiz Xogvarts kubogini oldi!", tugma: "Men ham qo'shilaman", xato: "Rasm tayyorlanmadi, birozdan keyin urinib ko'ring" },
    ru: { kick: function (n) { return "Кубок Хогвартса · неделя " + n; }, oldi: "завоевал кубок!", sizlar: "Ваш факультет выиграл кубок!",
          ball: "очк.", orinlar: "Факультеты", siz: "Ваш вклад", sizBall: function (b) { return "+" + b + " очк."; },
          gal: function (g) { return "+" + g + " галлеонов в ваш кошелёк"; }, uyOrin: function (u, o) { return u + " — " + o + "-е место"; },
          eng: "Лучший волшебник недели", tarix: "История кубка", davom: "Продолжить", yangi: "Началась новая неделя — кубок снова разыгрывается",
          bosh: "На этой неделе у вас нет очков — помогите факультету в новой неделе",
          ulash: "Поделиться победой", kut: "Картинка готовится…", story: "Наш факультет выиграл Кубок Хогвартса!", tugma: "Присоединиться", xato: "Не удалось подготовить картинку, попробуйте позже" },
    en: { kick: function (n) { return "Hogwarts House Cup · week " + n; }, oldi: "wins the House Cup!", sizlar: "Your house won the Cup!",
          ball: "pts", orinlar: "Houses", siz: "Your contribution", sizBall: function (b) { return "+" + b + " pts"; },
          gal: function (g) { return "+" + g + " Galleons added to your wallet"; }, uyOrin: function (u, o) { return u + " — place " + o; },
          eng: "Wizard of the week", tarix: "Cup history", davom: "Continue", yangi: "A new week has begun — the Cup is up for grabs again",
          bosh: "You earned no points this week — help your house in the new one",
          ulash: "Share the victory", kut: "Preparing the picture…", story: "Our house won the Hogwarts House Cup!", tugma: "Join in", xato: "Could not prepare the picture, please try later" }
  };
  function kbmT() { return KBM_T[lang] || KBM_T.uz; }
  function kbmSon(n) { return String(Math.round(n || 0)).replace(/\B(?=(\d{3})+(?!\d))/g, " "); }

  function kbmYop() {
    var el = $("kbm");
    if (!el) { return; }
    el.classList.add("ket");
    setTimeout(function () { if (el.parentNode) { el.parentNode.removeChild(el); } }, 380);
  }

  function kbmOch(s, men) {
    if (!s || !s.winner || !HOUSES[s.winner]) { return; }
    var eski = $("kbm");
    if (eski) { eski.parentNode.removeChild(eski); }
    var t = kbmT(), g = s.winner, H = HOUSES[g], uy = (men && men.uy) || (cupMe().house || ""), biz = uy === g;
    var el = drEl("div", "kbm" + (biz ? " biz" : ""));
    el.id = "kbm";
    el.style.setProperty("--kr", H.rgb);
    el.style.setProperty("--ka", H.hi || H.accent);
    var ich = drEl("div", "kbm-i");
    var tep = drEl("div", "kbm-tep");
    tep.appendChild(drEl("small", "", t.kick(s.number || "")));
    var x = drEl("button", "kbm-x", "×");
    x.type = "button";
    x.setAttribute("aria-label", "×");
    x.addEventListener("click", kbmYop);
    tep.appendChild(x);
    ich.appendChild(tep);
    // sahna: nur, uchqunlar, kubok, gerb
    var sahna = drEl("div", "kbm-s");
    sahna.appendChild(drEl("span", "kbm-nur"));
    sahna.appendChild(drEl("span", "kbm-hal"));
    var uch = drEl("span", "kbm-uch");
    for (var i = 0; i < 18; i++) {
      var u = drEl("i", "");
      u.style.left = (8 + Math.random() * 84) + "%";
      u.style.animationDelay = (-Math.random() * 6) + "s";
      u.style.animationDuration = (4 + Math.random() * 4) + "s";
      u.style.transform = "scale(" + (0.5 + Math.random()) + ")";
      uch.appendChild(u);
    }
    sahna.appendChild(uch);
    var im = document.createElement("img");
    im.className = "kbm-kub";
    im.alt = "";
    im.src = IMG_DIR + "kubok/kubok.webp";
    sahna.appendChild(im);
    var gr = drEl("span", "kbm-gerb"), cr = cupCrestImg(g, 0);
    if (cr) { gr.appendChild(cr); }
    sahna.appendChild(gr);
    ich.appendChild(sahna);
    // sarlavha
    var bosh = drEl("div", "kbm-b");
    if (biz) { bosh.appendChild(drEl("small", "kbm-biz", t.sizlar)); }
    bosh.appendChild(drEl("b", "kbm-uy", cupHouseName(g)));
    bosh.appendChild(drEl("span", "kbm-ol", t.oldi));
    var hs = (s.houses || []).slice().sort(function (a, b) { return (b.total_points || 0) - (a.total_points || 0); });
    var gb = hs.filter(function (h) { return h.house === g; })[0];
    var son = drEl("div", "kbm-son");
    var sn = drEl("b", "", "0");
    son.appendChild(sn);
    son.appendChild(drEl("span", "", t.ball));
    bosh.appendChild(son);
    ich.appendChild(bosh);
    // to'rt fakultet
    if (hs.length) {
      var k = drEl("div", "kbm-k");
      k.appendChild(drEl("div", "kbm-kh", t.orinlar));
      var eng = hs[0].total_points || 1;
      hs.forEach(function (h, j) {
        var r = drEl("div", "kbm-r" + (h.house === g ? " g" : "") + (h.house === uy ? " men" : ""));
        r.style.setProperty("--hr", (HOUSES[h.house] || HOUSES.none).rgb);
        r.appendChild(drEl("i", "o" + (j + 1), String(j + 1)));
        var c2 = cupCrestImg(h.house, 22);
        if (c2) { r.appendChild(c2); }
        var m = drEl("span", "kbm-rm");
        m.appendChild(drEl("b", "", cupHouseName(h.house)));
        var ch = drEl("u", "");
        var ic = drEl("em", "");
        ic.style.width = Math.max(4, Math.round(100 * (h.total_points || 0) / eng)) + "%";
        ch.appendChild(ic);
        m.appendChild(ch);
        r.appendChild(m);
        r.appendChild(drEl("strong", "", kbmSon(h.total_points)));
        k.appendChild(r);
      });
      ich.appendChild(k);
    }
    // o'z hissasi
    if (men && (men.ball != null || men.gal)) {
      var sz = drEl("div", "kbm-k kbm-siz");
      sz.appendChild(drEl("div", "kbm-kh", t.siz));
      var q = drEl("div", "kbm-sq");
      q.appendChild(drEl("b", "", men.ball ? t.sizBall(kbmSon(men.ball)) : "—"));
      var uo = 0;
      hs.forEach(function (h, j) { if (h.house === uy) { uo = j + 1; } });
      if (uo && !biz) { q.appendChild(drEl("span", "", t.uyOrin(cupHouseName(uy), uo))); }
      sz.appendChild(q);
      if (men.gal) { sz.appendChild(drEl("p", "kbm-gal", t.gal(men.gal))); }
      else if (!men.ball) { sz.appendChild(drEl("p", "kbm-gal x", t.bosh)); }
      ich.appendChild(sz);
    }
    // haftaning eng yaxshisi
    var top = (s.top && s.top[0]) || s.best;
    if (top && top.name) {
      var e = drEl("div", "kbm-eng");
      var c3 = cupCrestImg(top.house, 20);
      if (c3) { e.appendChild(c3); }
      var et = drEl("span", "");
      et.appendChild(drEl("small", "", t.eng));
      et.appendChild(drEl("b", "", top.name + " · " + kbmSon(top.points) + " " + t.ball));
      e.appendChild(et);
      ich.appendChild(e);
    }
    var tug = drEl("div", "kbm-tug");
    if (biz && s.id != null) {                       // g'olib fakultet o'quvchisi g'alabani ulasha oladi (egasi, 2026-10-19)
      var bu = drEl("button", "dr-btn kbm-ul", t.ulash);
      bu.type = "button";
      bu.addEventListener("click", function () { kbmUlash(s); });
      tug.appendChild(bu);
    }
    var b1 = drEl("button", "dr-btn" + (biz ? " gb-ikki" : ""), t.davom), b2 = drEl("button", "dr-btn gb-ikki", t.tarix);
    b1.type = b2.type = "button";
    b1.addEventListener("click", kbmYop);
    b2.addEventListener("click", function () { kbmYop(); try { openCup(); openCupHistory(); } catch (er) {} });
    tug.appendChild(b1);
    tug.appendChild(b2);
    ich.appendChild(tug);
    ich.appendChild(drEl("p", "kbm-yangi", t.yangi));
    el.appendChild(ich);
    if (biz) { el.appendChild(kbmKonfetti(H)); }
    el.addEventListener("click", function (ev) { if (ev.target === el) { kbmYop(); } });
    document.body.appendChild(el);
    // ballar sanog'i
    var oxir = (gb && gb.total_points) || 0, t0 = 0;
    var sana = function (ts) {
      if (!el.parentNode) { return; }
      if (!t0) { t0 = ts; }
      var p = Math.min(1, (ts - t0) / 1600), e2 = 1 - Math.pow(1 - p, 3);
      sn.textContent = kbmSon(oxir * e2);
      if (p < 1) { requestAnimationFrame(sana); }
    };
    setTimeout(function () { requestAnimationFrame(sana); }, 650);
    setTimeout(function () { sn.textContent = kbmSon(oxir); }, 2600);      // ilova orqada bo'lsa ham son to'g'ri tursin
    try { if (tg && tg.HapticFeedback) { tg.HapticFeedback.notificationOccurred(biz ? "success" : "warning"); } } catch (er2) {}
  }

  // O'z fakulteti yutganda: fakultet rangida va oltin konfetti
  function kbmKonfetti(H) {
    var w = drEl("div", "kbm-konf"), ranglar = [H.accent, H.hi || H.accent, "#f3d58f", "#e7c170", "#ffffff"];
    for (var i = 0; i < 46; i++) {
      var c = drEl("i", "");
      c.style.left = Math.random() * 100 + "%";
      c.style.background = ranglar[i % ranglar.length];
      c.style.animationDelay = (Math.random() * 1.6) + "s";
      c.style.animationDuration = (2.6 + Math.random() * 2.2) + "s";
      c.style.setProperty("--dx", (Math.random() * 120 - 60) + "px");
      c.style.setProperty("--r", (Math.random() * 720 - 360) + "deg");
      if (i % 3 === 0) { c.style.borderRadius = "50%"; c.style.width = c.style.height = "7px"; }
      w.appendChild(c);
    }
    return w;
  }

  /* G'alabani ulashish: server g'olib fakultet o'quvchisi uchun 9:16 rasm yasaydi (hpkubok.py) - fakultet va hafta bazadan tekshiriladi */
  var API_KUBOK = "https://bot.tizimshunos.uz/api/kubok";
  var kbmBand = false, kbmBor = {};
  function kbmUlash(s) {
    var t = kbmT(), d = chatInitData();
    if (kbmBand) { return; }
    if (kbmBor[s.id]) { rasmUlash(kbmBor[s.id], t.story, t.tugma); return; }
    if (!d || !window.fetch) { showToast(t.xato, "err"); return; }
    kbmBand = true;
    var kut = showToast(t.kut);
    fetch(API_KUBOK, { method: "POST", headers: { "Content-Type": "application/json", "X-Telegram-Init-Data": d },
      body: JSON.stringify({ lang: lang, season: s.id }) })
      .then(function (r) { return r.json(); })
      .then(function (res) {
        kbmBand = false;
        dismissNote(kut);
        if (!(res && res.ok && res.url)) { showToast(t.xato, "err"); return; }
        kbmBor[s.id] = res;
        rasmUlash(res, t.story, t.tugma);
      })["catch"](function () { kbmBand = false; dismissNote(kut); showToast(t.xato, "err"); });
  }

  /* Marosimni ochish: hafta id si bo'yicha (yoki raqami bo'yicha; ikkalasi ham bo'lmasa - oxirgi yopilgan hafta).
     Faqat saralangan o'quvchiga. O'quvchining hissasi kubok tarixidagi `me` dan (server, hpcup.kubok_men). */
  function kbmHafta(id, raqam) {
    if (!hasHouse()) { return; }
    var och = function (h) {
      var ss = (h && h.seasons) || [], s = null;
      ss.forEach(function (x) {
        if (s || x.status !== "closed" || !x.winner) { return; }
        if ((id == null && raqam == null) || x.id === id || (raqam != null && x.number === raqam)) { s = x; }
      });
      if (!s) { return; }
      var m = (h.me && h.me[String(s.id)]) || null;
      kbmOch(s, { uy: cupMe().house || "", ball: m ? m.ball : null, gal: m ? m.gal : 0 });
    };
    if (cupHistory) { och(cupHistory); } else { fetchCupHistory(och); }
  }

  /* Hafta yopilgach bir marta o'zi ochiladi: Xogvarts bosh sahifasi ochilganda, 2-kursdan (kubok kartasi shundan ko'rinadi),
     boshqa oyna (kurs tabrigi, yo'riqnoma) ochiq bo'lmasa; oxirgi yopilgan hafta tugaganiga 7 kundan oshmagan bo'lsa. */
  function kbmAvto() {
    if (!hasHouse() || $("kbm")) { return; }
    try { if (kursN() < 2 || kyTabrikda || yq) { return; } } catch (e) {}
    fetchCupHistory(function (h) {
      var s = ((h && h.seasons) || []).filter(function (x) { return x.status === "closed" && x.winner; })[0];
      if (!s || $("kbm") || $("scr-hub").classList.contains("hidden")) { return; }
      var tugadi = Date.parse(s.ends_at || "") || 0, kalit = "hp_kbm_" + s.id;
      if (!tugadi || Date.now() - tugadi > 7 * 864e5) { return; }
      try { if (localStorage.getItem(kalit)) { return; } localStorage.setItem(kalit, "1"); } catch (e) { return; }
      kbmHafta(s.id);
    });
  }
