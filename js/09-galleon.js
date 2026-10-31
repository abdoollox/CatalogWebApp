/* «Galleon qanday yig'iladi?» oynasi (egasi, 2026-10-17: o'quvchilar so'rayapti - bitta joyda, sodda tilda).
   Ilgari tushuntirish olti joyda tarqoq va bir qismi eskirgan edi. Endi hamma «galleon yetmaydi» oynalari,
   Xaridlar sahifasidagi «Galleon qanday olinadi?», do'kon va kubokdagi galleon qatori SHU oynani ochadi.
   Galleon manbalari (server): hafta yakuni - har 10 ballga 1, g'olib fakultetga ikki baravar, eng yaxshi uchtaga
   +15/10/5 (hpcup.GAL_*); Shokolad qurbaqa qutisi +1, har 7-kun ketma-ket +3 (hpsandiq); Niffler 1, Ajdar bolasi 2
   galleon har 7-boqishda (hpqoriq.SOVGALAR); Issiqxona hosili: 5 hosil = 1 galleon (hpissiq.HOSIL_NARX). Yangi manba qo'shilsa - shu oynaga ham bo'lim qo'shing.
   Ilova kodi bir necha faylga bo'lingan; hammasi BIR umumiy maydonda ishlaydi
   va index.html dagi TARTIBDA yuklanadi. Yuklanish paytida keyingi fayldagi
   narsani chaqirmang - tekshiruv: tools/tartib.js */
"use strict";
  var GX_TX = {
    uz: { ttl: "Galleon qanday yig'iladi?", ham: "Hamyoningizda", gal: function (n) { return n + " galleon"; },
          kam: function (narx, bor) { return "Bu " + narx + " galleon turadi, sizda " + bor + " ta. Yana " + (narx - bor) + " ta galleon kerak."; },
          sarT: "Avval fakultetga saralaning",
          sar: "Galleon faqat Xogvarts o'quvchilariga beriladi. Boyo'g'li keltirgan maktubni oching va Saralovchi qalpoqqacha yo'lni o'ting — 5 daqiqa.",
          sarB: "Maktubni ochish",
          k1: "Har hafta", t1: "Ball galleonga aylanadi",
          m1: "Fakultetingizga to'plagan har 10 ballingiz yakshanba kechasi 1 galleonga aylanadi. Fakultetingiz kubokni yutsa — ikki baravar. Haftaning eng yaxshi uch o'quvchisiga yana +15, +10, +5.",
          h1: function (b, g) { return "Bu hafta: " + b + " ball → yakshanba kechasi " + g + " galleon (fakultet yutsa " + (g * 2) + ")"; },
          h1q: function (n) { return "Yana " + n + " ball — yana 1 galleon"; },
          h1n: "Bu hafta hali ball yo'q. Birinchi 10 ball — birinchi galleon.",
          b1: "Ball qayerdan olinadi",
          k2: "Har kuni", t2: "Shokolad qurbaqa",
          m2: "Kunning 6 ta topshirig'ini bajarib qutini oching — +1 galleon. 7 kun ketma-ket ochsangiz — yana +3 galleon.",
          h2o: "Bugungi quti ochildi ✓", h2: function (n, j) { return "Bugun: " + n + " / " + j + " topshiriq bajarildi"; },
          h2s: function (n) { return "ketma-ket " + n + " kun"; }, b2: "Qurbaqaga o'tish",
          k3: "Maxluqlaringiz", t3: "Niffler va Ajdar bolasi",
          m3: "Qo'riqxonada ularni har kuni boqing: har 7-boqishda Niffler 1 galleon, Ajdar bolasi 2 galleon olib keladi.",
          nif: "Niffler", ajd: "Ajdar bolasi", bor: "sizda bor ✓", dars: function (n) { return n + "-darsdan keyin"; },
          ajdQ: "Maxluqlar bellashuvida birinchi uchlikka kiring", b3: "Qo'riqxona",
          k4: "O'simliklaringiz", t4: "Issiqxona hosili", m4: "Yetilgan o'simliklar hosil beradi. 5 ta hosilni 1 galleonga almashtirsa bo'ladi.", h4: function (n) { return "Hosil: " + n; }, b4: "Issiqxona",
          kurs: function (n) { return n + "-kursda ochiladi"; },
          oxir: "Galleonga: soundtrack albomlari, kitoblar, maxluqlarga yemish va do'kondagi jihozlar.",
          kut: function (g) { return "Yakshanba kechasi: yana ~" + g + " galleon keladi"; } },
    ru: { ttl: "Как получить галлеоны?", ham: "В кошельке", gal: function (n) { return n + " галл."; },
          kam: function (narx, bor) { return "Это стоит " + narx + " галл., у вас " + bor + ". Нужно ещё " + (narx - bor) + "."; },
          sarT: "Сначала пройдите распределение",
          sar: "Галлеоны получают только ученики Хогвартса. Откройте письмо, которое принесла сова, и пройдите путь до Распределяющей шляпы — 5 минут.",
          sarB: "Открыть письмо",
          k1: "Каждую неделю", t1: "Очки превращаются в галлеоны",
          m1: "Каждые 10 очков, которые вы набрали для факультета, в ночь на понедельник превращаются в 1 галлеон. Если факультет выиграет Кубок — вдвое больше. Трём лучшим ученикам недели ещё +15, +10, +5.",
          h1: function (b, g) { return "На этой неделе: " + b + " очков → " + g + " галл. (если факультет победит — " + (g * 2) + ")"; },
          h1q: function (n) { return "Ещё " + n + " очков — ещё 1 галлеон"; },
          h1n: "На этой неделе очков пока нет. Первые 10 очков — первый галлеон.",
          b1: "Где взять очки",
          k2: "Каждый день", t2: "Шоколадная лягушка",
          m2: "Выполните 6 заданий дня и откройте коробку — +1 галлеон. Откроете 7 дней подряд — ещё +3.",
          h2o: "Сегодняшняя коробка открыта ✓", h2: function (n, j) { return "Сегодня: выполнено " + n + " из " + j; },
          h2s: function (n) { return n + " дн. подряд"; }, b2: "К лягушке",
          k3: "Ваши существа", t3: "Нюхлер и детёныш дракона",
          m3: "Кормите их в Питомнике каждый день: на каждое 7-е кормление нюхлер приносит 1 галлеон, дракончик — 2.",
          nif: "Нюхлер", ajd: "Дракончик", bor: "уже есть ✓", dars: function (n) { return "после урока " + n; },
          ajdQ: "войдите в тройку лучших в состязании по существам", b3: "Питомник",
          k4: "Ваши растения", t4: "Урожай теплицы", m4: "Взрослые растения дают урожай. 5 единиц урожая можно обменять на 1 галлеон.", h4: function (n) { return "Урожай: " + n; }, b4: "Теплица",
          kurs: function (n) { return "Откроется на " + n + "-м курсе"; },
          oxir: "За галлеоны: альбомы саундтреков, книги, корм для существ и снаряжение в лавке.",
          kut: function (g) { return "В ночь на понедельник: ещё ~" + g + " галл."; } },
    en: { ttl: "How do I earn Galleons?", ham: "In your purse", gal: function (n) { return n + " Galleons"; },
          kam: function (narx, bor) { return "This costs " + narx + " Galleons, you have " + bor + ". You need " + (narx - bor) + " more."; },
          sarT: "Get sorted first",
          sar: "Only Hogwarts students receive Galleons. Open the letter the owl brought and follow the path to the Sorting Hat — 5 minutes.",
          sarB: "Open the letter",
          k1: "Every week", t1: "Points turn into Galleons",
          m1: "Every 10 points you earn for your house turn into 1 Galleon on Sunday night. If your house wins the Cup — double. The week's top three students get +15, +10 and +5 more.",
          h1: function (b, g) { return "This week: " + b + " points → " + g + " Galleons on Sunday night (" + (g * 2) + " if your house wins)"; },
          h1q: function (n) { return n + " more points — 1 more Galleon"; },
          h1n: "No points yet this week. Your first 10 points make your first Galleon.",
          b1: "Where points come from",
          k2: "Every day", t2: "Chocolate Frog",
          m2: "Finish the day's 6 tasks and open the box — +1 Galleon. Open it 7 days in a row — 3 more.",
          h2o: "Today's box is open ✓", h2: function (n, j) { return "Today: " + n + " / " + j + " tasks done"; },
          h2s: function (n) { return n + " days in a row"; }, b2: "Go to the Frog",
          k3: "Your creatures", t3: "Niffler and baby dragon",
          m3: "Feed them in the Sanctuary every day: every 7th feeding the Niffler brings 1 Galleon, the baby dragon brings 2.",
          nif: "Niffler", ajd: "Baby dragon", bor: "yours ✓", dars: function (n) { return "after lesson " + n; },
          ajdQ: "finish top three in the Creatures contest", b3: "Sanctuary",
          k4: "Your plants", t4: "Greenhouse harvest", m4: "Grown plants give a harvest. Trade 5 harvest for 1 Galleon.", h4: function (n) { return "Harvest: " + n; }, b4: "Greenhouse",
          kurs: function (n) { return "Opens in year " + n; },
          oxir: "Spend Galleons on soundtrack albums, books, creature food and gear in the shop.",
          kut: function (g) { return "Sunday night: ~" + g + " more Galleons"; } }
  };
  function gxX() { return GX_TX[lang] || GX_TX.uz; }
  function gxEl(tag, cls, text) { var e = document.createElement(tag); if (cls) { e.className = cls; } if (text != null) { e.textContent = text; } return e; }

  // Bu haftaning bashorati (hpcup._galleon_hisob bilan bir xil: ball // 10, g'olib fakultetga ikki baravar)
  function gxBall() { var m = {}; try { m = cupMe(); } catch (e) {} return Math.max(0, Math.round(m.points || 0)); }
  function gxIchkarida() { try { return hasHouse(); } catch (e) { return false; } }
  // Hamyon kartasi uchun qisqa qator: «Yakshanba kechasi: yana ~4 galleon keladi» (bo'lmasa - bo'sh)
  function gxKutilMatn() {
    var g = Math.floor(gxBall() / 10);
    return gxIchkarida() && g > 0 ? gxX().kut(g) : "";
  }

  var gxOpt = {};
  // o = {narx, bor} - «galleon yetmaydi» holatida tepada qancha yetmasligi yoziladi
  function gxOch(o) {
    gxOpt = o || {};
    gxYop();
    var orqa = gxEl("div", "gx"), oyna = gxEl("div", "gx-p"), x = gxX();
    orqa.id = "gx";
    var bosh = gxEl("div", "gx-h");
    bosh.appendChild(gxEl("b", "", x.ttl));
    var xb = gxEl("button", "", "×");
    xb.type = "button";
    xb.setAttribute("aria-label", "×");
    xb.addEventListener("click", gxYop);
    bosh.appendChild(xb);
    oyna.appendChild(bosh);
    oyna.appendChild(gxEl("div", "gx-b"));
    orqa.appendChild(oyna);
    orqa.addEventListener("click", function (e) { if (e.target === orqa) { gxYop(); } });
    document.body.appendChild(orqa);
    gxChiz();
    // Holatlar yo'q bo'lsa - so'rab, kelgach qayta chiziladi
    var qayta = function () { if ($("gx")) { gxChiz(); } };
    try { if (!sqData && gxIchkarida()) { sqPost({}, function (r) { try { sqApply(r); } catch (e) {} qayta(); }); } } catch (e) {}
    try { if (!qrData && gxIchkarida() && kursN() >= 3) { qrPost({}, function (r) { if (r && r.list) { qrData = r; } qayta(); }); } } catch (e) {}
    try { cupRefresh(qayta); } catch (e) {}
    try { walLoad(qayta); } catch (e) {}
  }
  function gxYop() { var e = $("gx"); if (e && e.parentNode) { e.parentNode.removeChild(e); } }

  // Oynadan boshqa sahifaga: ochiq sahifalar yopiladi, keyin o'sha sahifa ochiladi
  function gxBor(fn) {
    gxYop();
    [].forEach.call(document.querySelectorAll(".screen"), function (s) { s.classList.add("hidden"); });
    try { fn(); } catch (e) {}
  }

  function gxChiz() {
    var orqa = $("gx");
    if (!orqa) { return; }
    var box = orqa.querySelector(".gx-b"), x = gxX(), ich = gxIchkarida(), kurs = 4, gal = 0;
    try { kurs = kursN(); } catch (e) {}
    try { gal = pmGal(); } catch (e) {}
    box.innerHTML = "";

    if (gxOpt.narx && gxOpt.bor < gxOpt.narx) { box.appendChild(gxEl("p", "gx-kam", x.kam(gxOpt.narx, gxOpt.bor))); }
    var ham = gxEl("div", "gx-ham");
    ham.appendChild(gxEl("i", "pm-coin"));
    ham.appendChild(gxEl("small", "", x.ham));
    ham.appendChild(gxEl("b", "", x.gal(gal)));
    box.appendChild(ham);

    if (!ich) {
      var sr = gxEl("div", "gx-sar");
      sr.appendChild(gxEl("b", "", x.sarT));
      sr.appendChild(gxEl("p", "", x.sar));
      var sb = gxEl("button", "gx-btn asos", x.sarB);
      sb.type = "button";
      sb.addEventListener("click", function () { gxBor(goWorld); });
      sr.appendChild(sb);
      box.appendChild(sr);
    }

    // karta: rasm, kicker, sarlavha, matn, holat qatorlari, tugma
    var karta = function (o) {
      var k = gxEl("div", "gx-k" + (o.xira ? " xira" : ""));
      var im = gxEl("span", "gx-im" + (o.tanga ? " tanga" : ""));
      if (o.tanga) { im.appendChild(gxEl("i", "pm-coin")); }
      else { var img = document.createElement("img"); img.alt = ""; img.src = o.rasm; im.appendChild(img); }
      k.appendChild(im);
      var m = gxEl("div", "gx-m");
      m.appendChild(gxEl("small", "", o.kick));
      m.appendChild(gxEl("b", "", o.ttl));
      m.appendChild(gxEl("p", "", o.matn));
      (o.hol || []).forEach(function (h) { if (h) { m.appendChild(gxEl("span", "gx-hol" + (h.ok ? " ok" : ""), h.t)); } });
      if (o.tugma) {
        var b = gxEl("button", "gx-btn", o.tugma + " ›");
        b.type = "button";
        b.addEventListener("click", function () { gxBor(o.fn); });
        m.appendChild(b);
      }
      k.appendChild(m);
      box.appendChild(k);
    };

    // 1. Har hafta - asosiy yo'l
    var ball = gxBall(), g = Math.floor(ball / 10), hol1 = [];
    if (ich) {
      if (ball > 0) { hol1.push({ t: x.h1(ball, g) }); hol1.push({ t: x.h1q(10 - ball % 10) }); }
      else { hol1.push({ t: x.h1n }); }
    }
    karta({ tanga: true, kick: x.k1, ttl: x.t1, matn: x.m1, hol: hol1, tugma: ich ? x.b1 : "", fn: openCup });

    // 2. Har kuni - Shokolad qurbaqa (2-kursdan)
    var hol2 = [], d = null;
    try { d = sqData; } catch (e) {}
    if (ich && kurs < 2) { hol2.push({ t: x.kurs(2) }); }
    else if (ich && d && d.tasks) {
      hol2.push(d.opened ? { t: x.h2o + (d.streak > 0 ? " · " + x.h2s(d.streak) : ""), ok: true } : { t: x.h2(d.n || 0, d.total || 6) + (d.streak > 0 ? " · " + x.h2s(d.streak) : "") });
    }
    karta({ rasm: IMG_DIR + "hub/sq.webp", kick: x.k2, ttl: x.t2, matn: x.m2, hol: hol2, xira: ich && kurs < 2,
            tugma: ich && kurs >= 2 && d ? x.b2 : "", fn: sqOpen });

    // 3. Maxluqlar - Niffler va Ajdar bolasi (Qo'riqxona 3-kursdan)
    var hol3 = [], q = null;
    try { q = qrData; } catch (e) {}
    if (ich && kurs < 3) { hol3.push({ t: x.kurs(3) }); }
    else if (ich && q && q.list) {
      [["niffler", x.nif], ["ajdar", x.ajd]].forEach(function (p) {
        var m = q.list.filter(function (z) { return z.kod === p[0]; })[0];
        if (!m) { return; }
        hol3.push(m.got ? { t: p[1] + ": " + x.bor, ok: true } : { t: p[1] + ": " + (p[0] === "ajdar" ? x.ajdQ : x.dars(m.need)) });
      });
    }
    karta({ rasm: IMG_DIR + "qoriq/niffler-2.webp", kick: x.k3, ttl: x.t3, matn: x.m3, hol: hol3, xira: ich && kurs < 3,
            tugma: ich && kurs >= 3 ? x.b3 : "", fn: qrHubOpen });

    // 4. Issiqxona hosili (Issiqxona ham 3-kursdan)
    var hol4 = [], isd = null;
    try { isd = isData; } catch (e) {}
    if (ich && kurs < 3) { hol4.push({ t: x.kurs(3) }); }
    else if (ich && isd && isd.list) { hol4.push({ t: x.h4(isd.hosil || 0) }); }
    karta({ rasm: IMG_DIR + "issiq/mandragora-2.webp", kick: x.k4, ttl: x.t4, matn: x.m4, hol: hol4, xira: ich && kurs < 3,
            tugma: ich && kurs >= 3 ? x.b4 : "", fn: isHubOpen });

    box.appendChild(gxEl("p", "gx-oxir", x.oxir));
  }
