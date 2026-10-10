/* Kitob o'qish: MATN rejimi (harf kattaligi, fon, shrift), mundarija, xatcho'p, qidiruv
   Ilova kodi bir necha faylga bo'lingan; hammasi BIR umumiy maydonda ishlaydi
   va index.html dagi TARTIBDA yuklanadi. Yuklanish paytida keyingi fayldagi
   narsani chaqirmang - tekshiruv: tools/tartib.js */
"use strict";
  /* PDF ning ichidagi MATN pdf.js bilan olinadi va qaytadan teriladi (kitob o'qish dasturlaridagi kabi):
     - bob (PDF mundarijasidan) bitta oqim bo'lib yig'iladi: satrlar xatboshilarga birlashtiriladi;
     - oqim ekran kengligidagi ustunlarga bo'linadi (CSS columns) - har ustun bitta "bet", surilsa keyingisi;
     - har xatboshi qaysi PDF betidan olingani yozib boriladi (data-p) - joy, surgich va xatcho'p shu bet bilan.
     Matni yo'q (skaner) PDF da bu rejim yo'q - faqat asl sahifa (varaqlash). Sozlamalar: hp_kt_pref. */
  var KM_TX = {
    uz: { yz: "Yozuv", yzLot: "Lotin", yzKir: "Кирилл", set: "O'qish sozlamalari", mode: "Ko'rinish", mText: "Matn", mFlip: "Asl sahifa", mScroll: "Surib o'qish",
          size: "Harf kattaligi", theme: "Fon", font: "Shrift", fSerif: "Kitobiy", fSans: "Sodda", gap: "Qator oralig'i",
          thTun: "Tun", thSepia: "Sepiya", thKun: "Kun", close: "Yopish",
          toc: "Mundarija", marks: "Xatcho'plar", find: "Qidiruv", front: "Muqova va kirish", pages: function (a, b) { return a + "–" + b + "-betlar"; },
          noMarks: "Hali xatcho'p yo'q. O'qiyotgan joyingizni saqlash uchun tepada xatcho'p belgisini bosing.",
          markOn: "Xatcho'p qo'yildi", markOff: "Xatcho'p olib tashlandi", pg: function (n) { return n + "-bet"; },
          findPh: "So'z yoki ibora", findGo: "Qidirish", finding: function (a, b) { return "Qidirilmoqda… " + a + " / " + b; },
          found: function (n) { return n ? n + " ta joy topildi" : "Hech narsa topilmadi"; }, more: "Faqat birinchi 60 tasi ko'rsatildi",
          wait: "Bob ochilmoqda…", del: "O'chirish" },
    ru: { yz: "Письменность", yzLot: "Латиница", yzKir: "Кириллица", set: "Настройки чтения", mode: "Вид", mText: "Текст", mFlip: "Оригинал", mScroll: "Прокрутка",
          size: "Размер букв", theme: "Фон", font: "Шрифт", fSerif: "Книжный", fSans: "Простой", gap: "Интервал",
          thTun: "Ночь", thSepia: "Сепия", thKun: "День", close: "Закрыть",
          toc: "Оглавление", marks: "Закладки", find: "Поиск", front: "Обложка и вступление", pages: function (a, b) { return "Стр. " + a + "–" + b; },
          noMarks: "Закладок пока нет. Чтобы сохранить место, нажмите значок закладки вверху.",
          markOn: "Закладка добавлена", markOff: "Закладка удалена", pg: function (n) { return "стр. " + n; },
          findPh: "Слово или фраза", findGo: "Найти", finding: function (a, b) { return "Ищем… " + a + " / " + b; },
          found: function (n) { return n ? "Найдено мест: " + n : "Ничего не найдено"; }, more: "Показаны только первые 60",
          wait: "Глава открывается…", del: "Удалить" },
    en: { yz: "Script", yzLot: "Latin", yzKir: "Cyrillic", set: "Reading settings", mode: "View", mText: "Text", mFlip: "Original", mScroll: "Scroll",
          size: "Text size", theme: "Background", font: "Font", fSerif: "Bookish", fSans: "Plain", gap: "Line spacing",
          thTun: "Night", thSepia: "Sepia", thKun: "Day", close: "Close",
          toc: "Contents", marks: "Bookmarks", find: "Search", front: "Cover and front matter", pages: function (a, b) { return "Pages " + a + "–" + b; },
          noMarks: "No bookmarks yet. Tap the bookmark icon at the top to save your place.",
          markOn: "Bookmark added", markOff: "Bookmark removed", pg: function (n) { return "page " + n; },
          findPh: "Word or phrase", findGo: "Search", finding: function (a, b) { return "Searching… " + a + " / " + b; },
          found: function (n) { return n ? n + " places found" : "Nothing found"; }, more: "Only the first 60 are shown",
          wait: "Opening the chapter…", del: "Delete" }
  };
  var KM_ICON = {
    aa: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7.2 5.5h1.9l4.3 13h-2l-1-3.2H5.9l-1 3.2h-2zm.95 2.6L6.5 13.5h3.3zM17.3 9.3c2 0 3.2 1.1 3.2 3.1v6.1h-1.7v-1c-.6.8-1.5 1.2-2.6 1.2-1.7 0-2.8-1-2.8-2.5 0-1.7 1.3-2.5 3.7-2.7l1.7-.1v-.6c0-1.1-.6-1.7-1.7-1.7-.9 0-1.5.4-1.8 1.1l-1.5-.5c.5-1.5 1.8-2.4 3.5-2.4zm1.5 5.4-1.5.1c-1.4.1-2.1.6-2.1 1.4 0 .7.6 1.2 1.5 1.2 1.2 0 2.1-.8 2.1-2z"/></svg>',
    list: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M4 6.2a1.3 1.3 0 1 1 2.6 0 1.3 1.3 0 0 1-2.6 0zm4.6-1h11.4v2H8.6zM4 12a1.3 1.3 0 1 1 2.6 0A1.3 1.3 0 0 1 4 12zm4.6-1h11.4v2H8.6zM4 17.8a1.3 1.3 0 1 1 2.6 0 1.3 1.3 0 0 1-2.6 0zm4.6-1h11.4v2H8.6z"/></svg>',
    mark: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" aria-hidden="true"><path d="M7 4h10a1 1 0 0 1 1 1v15l-6-4-6 4V5a1 1 0 0 1 1-1z"/></svg>',
    markOn: '<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linejoin="round" aria-hidden="true"><path d="M7 4h10a1 1 0 0 1 1 1v15l-6-4-6 4V5a1 1 0 0 1 1-1z"/></svg>'
  };
  var KM_SIZES = [15, 16.5, 18, 20, 22, 25, 28];
  var KM_GAPS = [1.35, 1.55, 1.8];
  var kmPref = { fs: 2, th: "tun", ff: "serif", lh: 1 };
  try {
    var kmSaved = JSON.parse(window.localStorage.getItem("hp_kt_pref") || "null");
    if (kmSaved) {
      if (KM_SIZES[kmSaved.fs] != null) { kmPref.fs = kmSaved.fs; }
      if (/^(tun|sepia|kun)$/.test(kmSaved.th)) { kmPref.th = kmSaved.th; }
      if (/^(serif|sans)$/.test(kmSaved.ff)) { kmPref.ff = kmSaved.ff; }
      if (KM_GAPS[kmSaved.lh] != null) { kmPref.lh = kmSaved.lh; }
      if (/^(lot|kir)$/.test(kmSaved.yz)) { kmPref.yz = kmSaved.yz; }
    }
  } catch (e) {}

  var kmToc = [];            // bo'limlar: [{t, p (birinchi bet), e (oxirgi bet), real}]
  var kmHasText = false, kmBody = 1, kmL = 28, kmR = 337, kmSz = 11;
  var kmCache = {};          // bet -> {rows, img}
  var kmSec = -1, kmScreens = 1, kmScr = 0, kmMarks = [], kmBusy = false, kmDrag = null, kmGenLocal = 0;
  var kmNavTab = "toc", kmFindGen = 0;

  /* LOTINGA O'GIRIB KO'RSATISH (egasi, 2026-10-09): o'zbekcha kitoblar kirill yozuvida, ilova esa lotinda. Fayl
     o'zgarmaydi - matn rejimida harflar EKRANDA o'zbek lotin alifbosiga o'giriladi (kmPref.yz: "lot" | "kir";
     sozlamada «Yozuv» qatori faqat kirill kitobda ko'rinadi). Qoidalar: е - so'z boshida va unlidan keyin «ye»,
     ц - unlidan keyin «ts», aks holda «s»; ў - o‘, ғ - g‘, ъ - ’, ь - tashlanadi. */
  var kmKirill = false;
  var KM_LOT = { "а": "a", "б": "b", "в": "v", "г": "g", "д": "d", "ж": "j", "з": "z", "и": "i", "й": "y", "к": "k", "л": "l", "м": "m",
                 "н": "n", "о": "o", "п": "p", "р": "r", "с": "s", "т": "t", "у": "u", "ф": "f", "х": "x", "ч": "ch", "ш": "sh", "щ": "sh",
                 "ъ": "\u2019", "ь": "", "э": "e", "ю": "yu", "я": "ya", "ё": "yo", "ы": "i", "ў": "o\u2018", "қ": "q", "ғ": "g\u2018", "ҳ": "h" };
  var KM_UNLI = /[аеёиоуэюяўыАЕЁИОУЭЮЯЎЫ]/;
  function kmLotin(s) {
    if (!s || !/[\u0400-\u04ff]/.test(s)) { return s; }
    var out = "", n = s.length;
    for (var i = 0; i < n; i++) {
      var ch = s.charAt(i), kich = ch.toLowerCase(), l = KM_LOT[kich];
      var oldin = i > 0 ? s.charAt(i - 1) : "", keyin = i + 1 < n ? s.charAt(i + 1) : "";
      if (kich === "е") { l = (!oldin || !/[\u0400-\u04ff]/.test(oldin) || KM_UNLI.test(oldin) || /[ъьЪЬ]/.test(oldin)) ? "ye" : "e"; }
      else if (kich === "ц") { l = (oldin && KM_UNLI.test(oldin)) ? "ts" : "s"; }
      if (l === undefined) { out += ch; continue; }
      if (ch !== kich && l) {
        // bosh harf: so'z to'liq bosh harflarda bo'lsa «CH», aks holda «Ch»
        var hammasi = keyin && keyin !== keyin.toLowerCase() && /[\u0400-\u04ff]/.test(keyin) || (!keyin || !/[\u0400-\u04ff]/.test(keyin)) && oldin && oldin !== oldin.toLowerCase() && /[\u0400-\u04ff]/.test(oldin);
        l = hammasi ? l.toUpperCase() : l.charAt(0).toUpperCase() + l.slice(1);
      }
      out += l;
    }
    return out;
  }
  // Yozuv almashganda: o'qilgan betlar qaytadan o'giriladi, o'quvchi turgan betida qoladi
  function kmYozuv(yz) {
    if (kmPref.yz === yz) { return; }
    kmPref.yz = yz;
    kmSave();
    kmCache = {};
    kmPlainCache = {};
    if (krMode === "text" && kmSec >= 0) {
      var joy = kmHere(), sec = kmSec;
      kmSec = -1;
      kmOpenSec(sec, joy ? { p: joy.p } : undefined);
    }
    kmSetRender();
  }

  function kmX() { return KM_TX[lang] || KM_TX.uz; }
  function kmSave() { try { window.localStorage.setItem("hp_kt_pref", JSON.stringify(kmPref)); } catch (e) {} }

  /* --- kitob ochilganda: mundarija va matn bor-yo'qligi --- */
  function kmReset() {
    kmToc = [];
    kmCache = {};
    kmSec = -1;
    kmMarks = [];
    kmBusy = false;
    kmDrag = null;
    kmHasText = false;
    kmKirill = false;
    kmGenLocal++;
    kmFindGen++;
    kmPlainCache = {};
    var fl = $("km-flow");
    if (fl) { fl.innerHTML = ""; }
  }

  function kmPrep() {
    var doc = krDoc, gen = krGen;
    var tugat = function (list) {
      if (gen !== krGen) { return; }
      var x = kmX(), out = [];
      list = list.filter(function (a) { return a.p >= krFirst && a.p <= krN; }).sort(function (a, b) { return a.p - b.p; });
      list = list.filter(function (a, i) { return !i || a.p !== list[i - 1].p; });
      if (!list.length) {
        // Mundarijasi yo'q fayl: 12 betdan bo'laklar
        for (var s = krFirst; s <= krN; s += 12) { out.push({ t: x.pages(s, Math.min(krN, s + 11)), p: s, e: Math.min(krN, s + 11), real: false }); }
        kmBody = krFirst;
      } else {
        if (list[0].p > krFirst) { out.push({ t: x.front, p: krFirst, e: list[0].p - 1, real: false }); }
        list.forEach(function (a, i) { out.push({ t: a.t, p: a.p, e: (i + 1 < list.length ? list[i + 1].p - 1 : krN), real: true }); });
        kmBody = list.length > 1 ? list[1].p : list[0].p;
      }
      kmToc = out;
    };
    var olish = doc.getOutline().then(function (ol) {
      ol = (ol || []).slice(0, 400);
      return Promise.all(ol.map(function (it) {
        var d = typeof it.dest === "string" ? doc.getDestination(it.dest) : Promise.resolve(it.dest);
        return d.then(function (dest) {
          if (!dest || !dest[0]) { return null; }
          return doc.getPageIndex(dest[0]).then(function (i) {
            return { t: String(it.title || "").replace(/[\r\n]+/g, " ").replace(/\s*[•·]\s*\d+\s*$/, "").trim(), p: i + 1 };
          });
        })["catch"](function () { return null; });
      }));
    })["catch"](function () { return []; }).then(function (l) { tugat((l || []).filter(function (a) { return a && a.t; })); });

    // Matn bormi va asosiy matnning chegaralari (chap/o'ng chet, harf o'lchami) - o'rtadagi bir necha betdan
    return olish.then(function () {
      if (gen !== krGen) { return; }
      var nam = [], o = Math.min(krN, Math.max(kmBody + 2, krFirst));
      for (var i = 0; i < 5 && o + i <= krN; i++) { nam.push(o + i); }
      return Promise.all(nam.map(function (n) { return kmLines(n, true); })).then(function (res) {
        if (gen !== krGen) { return; }
        var harf = 0, xs = {}, rs = {}, szs = {};
        res.forEach(function (pg) {
          (pg.rows || []).forEach(function (r) {
            harf += r.len;
            var a = Math.round(r.x), b = Math.round(r.r), c = Math.round(r.sz * 2) / 2;
            xs[a] = (xs[a] || 0) + 1; rs[b] = (rs[b] || 0) + 1; szs[c] = (szs[c] || 0) + r.len;
          });
        });
        kmHasText = harf > 400;
        var eng = function (m) { var k = null; Object.keys(m).forEach(function (q) { if (k === null || m[q] > m[k]) { k = q; } }); return k === null ? null : parseFloat(k); };
        if (kmHasText) { kmL = eng(xs); kmR = eng(rs); kmSz = eng(szs) || 11; }
        kmCache = {};                    // namuna betlar chegarasiz o'qilgan edi - endi qaytadan
      });
    });
  }

  /* --- bitta betning satrlari --- */
  function kmLines(n, xom) {
    if (!xom && kmCache[n]) { return Promise.resolve(kmCache[n]); }
    var doc = krDoc;
    return doc.getPage(n).then(function (pg) {
      var vp = pg.getViewport({ scale: 1 }), H = vp.height;
      var rasmBor = false;
      var shrift = function (ol) {
        // Betda rasm bormi (muqova) yoki u shunchaki bo'sh oq betmi - bo'sh bet matn rejimida ko'rsatilmaydi
        try {
          var OPS = (window.pdfjsLib || window["pdfjs-dist/build/pdf"] || {}).OPS || {};
          var rasm = [OPS.paintImageXObject || 85, OPS.paintJpegXObject || 82, OPS.paintInlineImageXObject || 86,
                      OPS.paintImageXObjectRepeat || 88, OPS.paintImageMaskXObject || 83];
          rasmBor = !!(ol && ol.fnArray) && Array.prototype.some.call(ol.fnArray, function (f) { return rasm.indexOf(f) >= 0; });
        } catch (e) { rasmBor = false; }
        return pg.getTextContent();
      };
      // getOperatorList shriftlarning haqiqiy nomini ham yuklaydi (kursivni bilish uchun)
      return pg.getOperatorList().then(shrift, function () { return shrift(null); }).then(function (tc) {
        var rows = [], ital = {};
        (tc.items || []).forEach(function (it) {
          if (!it.str) { return; }
          var x = it.transform[4], y = H - it.transform[5], sz = Math.abs(it.transform[3]) || it.height || 10;
          if (ital[it.fontName] === undefined) {
            var nom = "";
            try { nom = (pg.commonObjs.get(it.fontName) || {}).name || ""; } catch (e) { nom = ""; }
            ital[it.fontName] = /ital|oblique/i.test(nom);
          }
          var r = null;
          for (var i = rows.length - 1; i >= 0 && i >= rows.length - 5; i--) {
            if (Math.abs(rows[i].y - y) <= 3.2) { r = rows[i]; break; }
          }
          if (!r) { r = { y: y, x: 1e9, r: 0, sz: 0, len: 0, segs: [] }; rows.push(r); }
          if (it.str.trim()) {
            r.x = Math.min(r.x, x);
            r.r = Math.max(r.r, x + (it.width || 0));
            r.sz = Math.max(r.sz, sz);
            r.len += it.str.trim().length;
          }
          r.segs.push({ x: x, w: it.width || 0, s: it.str, i: ital[it.fontName], f: it.fontName });
        });
        rows = rows.filter(function (r) { return r.len > 0; });
        rows.sort(function (a, b) { return a.y - b.y; });
        if (!xom && n >= kmBody) {
          // Betning tepasidagi takror sarlavha va bet raqami matnga kirmaydi
          rows = rows.filter(function (r) { return r.y > H * 0.078 && r.y < H * 0.95; });
        }
        rows.forEach(function (r) {
          r.segs.sort(function (a, b) { return a.x - b.x; });
          /* ZAXIRA SHRIFT HARFLARI (2026-10-09, o'zbekcha kirill kitoblar): LibreOffice asosiy shriftda yo'q harfni
             (ў, қ, ғ, ҳ) boshqa shriftda ALOHIDA bo'lak qilib, asosiy matndagi bo'sh joy USTIGA chizadi. Shunchaki
             ketma-ket qo'shilsa so'z bo'linib qoladi («Ни оят» + «ҳ»). Shuning uchun boshqa shriftdagi qisqa bo'lak
             oldingi bo'lakning ichiga tushsa, u o'sha joydagi bo'shliq O'RNIGA qo'yiladi. */
          // Zaxira shrift o'z harflari orasiga bo'shliq ham chizadi (joy surish uchun) - u asosiy matn ustiga tushadi va
          // so'zni bo'lib yuboradi. Satrning ASOSIY shriftida bo'lmagan, faqat bo'shliqdan iborat bo'laklar tashlanadi.
          var sanoq = {}, asosiy = null;
          r.segs.forEach(function (sg) { var k = sg.s.replace(/\s+/g, "").length; if (k) { sanoq[sg.f] = (sanoq[sg.f] || 0) + k; } });
          Object.keys(sanoq).forEach(function (f) { if (asosiy === null || sanoq[f] > sanoq[asosiy]) { asosiy = f; } });
          // ZAXIRA shrift - shu satrda FAQAT o'zbekcha maxsus harflarni (ў қ ғ ҳ) chizgan shrift. Qoidalar faqat unga
          // tegishli: kursiv yoki qalin so'zlar (boshqa shrift, lekin oddiy harflar) bularga tushmaydi.
          var zaxira = {};
          r.segs.forEach(function (sg) {
            if (sg.f === asosiy) { return; }
            var k = sg.s.replace(/\s+/g, "");
            if (!k) { if (zaxira[sg.f] === undefined) { zaxira[sg.f] = true; } return; }
            zaxira[sg.f] = zaxira[sg.f] !== false && /^[\u045e\u049b\u0493\u04b3\u040e\u049a\u0492\u04b2]+$/.test(k);
          });
          if (!Object.keys(zaxira).some(function (f) { return zaxira[f] && sanoq[f]; })) { zaxira = {}; }     // bunday shrift yo'q - hech narsa o'zgarmaydi
          r.segs = r.segs.filter(function (sg) { return sg.s.trim() || !zaxira[sg.f]; });
          // Zaxira bo'lak bir nechta harfdan iborat bo'lishi mumkin («қ ғ» - har biri o'z bo'sh joyi ustida): har harf ALOHIDA
          // bo'lak qilinadi, joyi bo'lak ichidagi o'rnidan olinadi (2026-10-10: shu sabab har ~180 so'zdan biri yakka qolardi).
          var yoyilgan = [];
          r.segs.forEach(function (sg) {
            if (!zaxira[sg.f] || sg.s.length < 2 || !sg.w) { yoyilgan.push(sg); return; }
            for (var ci = 0; ci < sg.s.length; ci++) {
              if (/\s/.test(sg.s.charAt(ci))) { continue; }
              yoyilgan.push({ x: sg.x + sg.w * ci / sg.s.length, w: sg.w / sg.s.length, s: sg.s.charAt(ci), i: sg.i, f: sg.f });
            }
          });
          r.segs = yoyilgan;
          r.segs.sort(function (a, b) { return a.x - b.x; });       // yoyilgan harflar o'z joyiga (ikkinchisi keyingi bo'lak ichida bo'lishi mumkin)
          // Zaxira harf ALOHIDA bo'sh joy bo'lagi ustida: harf shu bo'lak ichida turadi. Bo'lak harfdan oldin/keyin ham
          // davom etsa (so'z oralig'i + harf joyi bitta bo'lak bo'lib kelgan: « ҳ») - o'sha tomonda bo'sh joy saqlanadi.
          var ustida = function (harf, joy) {
            return joy.w >= r.sz * 0.4 && harf.x >= joy.x - 0.6 && harf.x + harf.w * 0.5 <= joy.x + joy.w + 0.6;
          };
          var qoshil = function (harf, joy, q) {
            var old = harf.x - joy.x > r.sz * 0.2, key = (joy.x + joy.w) - (harf.x + harf.w) > r.sz * 0.2;
            return { x: joy.x, w: joy.w, s: (old ? " " : "") + q + (key ? " " : ""), i: harf.i, f: harf.f, bir: true };
          };
          // Harf enini taxminlash (asosiy shrift - antikva): bo'sh joy va tinish belgilari tor, bosh va keng harflar enli.
          var en = function (ch) {
            if (/\s/.test(ch)) { return 0.25; }
            if (/[.,;:!'\u2019\-\u2013()"\u00ab\u00bb]/.test(ch)) { return 0.3; }
            if (/[\u0448\u0449\u0436\u043c\u044e\u044b\u0444]/.test(ch)) { return 0.74; }
            if (/[\u0433\u0442\u0441\u0435\u044d\u0437\u043a\u043b\u0451]/.test(ch)) { return 0.45; }
            if (ch !== ch.toLowerCase()) { return 0.7; }
            return 0.52;
          };
          // Bo'lak ichida shu x ga ENG YAQIN bo'sh joyni topadi (bir xil enli deb taxmin qilish uzun satrda adashtirardi)
          var joyTop = function (uyB, mx) {
            var jami = 0, k2, eng = -1, engD = 1e9, yig = 0, m2;
            for (k2 = 0; k2 < uyB.s.length; k2++) { jami += en(uyB.s.charAt(k2)); }
            if (!jami) { return -1; }
            m2 = uyB.w / jami;
            for (k2 = 0; k2 < uyB.s.length; k2++) {
              var e2 = en(uyB.s.charAt(k2));
              if (/\s/.test(uyB.s.charAt(k2))) {
                var d2 = Math.abs(uyB.x + m2 * (yig + e2 / 2) - mx);
                if (d2 < engD) { engD = d2; eng = k2; }
              }
              yig += e2;
            }
            return engD <= r.sz * 0.9 ? eng : -1;
          };
          var toza = [], uy = null, kut = null;
          r.segs.forEach(function (sg) {
            var q = sg.s.replace(/\s+/g, "");
            // Bo'sh joy ALOHIDA bo'lak bo'lib kelgan hol: zaxira harf aynan uning ustida turadi - harf o'sha joyni egallaydi
            var oxt = toza.length ? toza[toza.length - 1] : null;
            if (oxt && q && zaxira[sg.f] && !oxt.s.trim() && !zaxira[oxt.f] && ustida(sg, oxt)) {
              toza.pop();
              toza.push(qoshil(sg, oxt, q)); kut = null;
              return;
            }
            if (oxt && !q && zaxira[oxt.f] && oxt.s.trim() && !oxt.bir && !zaxira[sg.f] && ustida(oxt, sg)) {
              toza.pop();
              toza.push(qoshil(oxt, sg, oxt.s.replace(/\s+/g, ""))); kut = null;
              return;
            }
            if (uy && q && zaxira[sg.f] && !zaxira[uy.f] && uy.w > 0 && sg.x >= uy.x - 0.5 && sg.x < uy.x + uy.w - r.sz * 0.12) {
              var joy = joyTop(uy, sg.x + sg.w / 2);
              if (joy >= 0) { uy.s = uy.s.slice(0, joy) + q + uy.s.slice(joy + 1); return; }
            }
            // So'z BOSHIDAGI zaxira harf: bo'sh joy keyingi bo'lakning boshida turadi va aynan shu harf o'rnidan boshlanadi
            if (kut && !zaxira[sg.f] && /^\s/.test(sg.s) && sg.s.trim() && Math.abs(sg.x - kut.x) <= r.sz * 0.35) {
              toza.splice(toza.indexOf(kut), 1);
              sg.s = kut.s.replace(/\s+/g, "") + sg.s.replace(/^\s/, "");
              sg.x = Math.min(sg.x, kut.x);
            }
            kut = (q && zaxira[sg.f]) ? sg : null;
            toza.push(sg);
            if (sg.s.trim() && sg.w > 0 && !zaxira[sg.f]) { uy = sg; }
          });
          r.segs = toza;
          var parts = [], oxir = null;
          r.segs.forEach(function (sg) {
            var s = sg.s;
            if (oxir && sg.x - (oxir.x + oxir.w) > r.sz * 0.22 && !/\s$/.test(oxir.s) && !/^\s/.test(s)) { s = " " + s; }
            if (parts.length && parts[parts.length - 1].i === sg.i) { parts[parts.length - 1].s += s; }
            else { parts.push({ s: s, i: sg.i }); }
            oxir = sg;
          });
          r.parts = parts;
          r.text = parts.map(function (p) { return p.s; }).join("").replace(/\s+/g, " ").trim();
          delete r.segs;
        });
        // Kirill kitob: lotinga o'girib ko'rsatish (kmLotin)
        var kirSon = 0;
        rows.forEach(function (r) { kirSon += (r.text.match(/[\u0400-\u04ff]/g) || []).length; });
        if (kirSon > 40 && !kmKirill) { kmKirill = true; }
        if (kmKirill) {
          // TIRE: bu kitoblarda muloqot va izoh tiresi o'rnida oddiy defis («- ») yozilgan - ekranda uzun tire ko'rsatiladi
          var tire = function (t) { return t.replace(/(^|\s)[-\u2013](?=\s)/g, "$1\u2014"); };
          rows.forEach(function (r) {
            r.parts.forEach(function (pt, i) {
              pt.s = tire(pt.s);
              if (i === 0) { pt.s = pt.s.replace(/^(\s*)[-\u2013](?=\s|$)/, "$1\u2014"); }
            });
            r.text = tire(r.text);
          });
        }
        if (kmKirill && kmPref.yz !== "kir") {
          rows.forEach(function (r) {
            r.parts.forEach(function (pt) { pt.s = kmLotin(pt.s); });
            r.text = kmLotin(r.text);
          });
        }
        var res = { rows: rows, img: rows.length === 0 && rasmBor, ratio: vp.width / vp.height };
        if (!xom) { kmCache[n] = res; }
        return res;
      });
    });
  }

  /* --- bob: satrlardan xatboshilar --- */
  function kmBlocks(sec) {
    var ps = [], n;
    for (n = sec.p; n <= sec.e; n++) { ps.push(n); }
    var blocks = [], cur = null, oldR = null;
    var chain = Promise.resolve();
    ps.forEach(function (pn) {
      chain = chain.then(function () { return kmLines(pn); }).then(function (pg) {
        if (pg.img) { blocks.push({ k: "img", p: pn, ratio: pg.ratio }); cur = null; return; }
        if (!pg.rows.length) { return; }                        // bo'sh oq bet - tashlab ketiladi
        var birinchi = true;
        // Betdagi eng o'ng chet: satr undan ancha oldin tugasa - «qisqa satr» (xatboshi oxiri bo'lishi mumkin)
        var betOng = 0;
        pg.rows.forEach(function (r) { if (r.r > betOng) { betOng = r.r; } });
        pg.rows.forEach(function (r) {
          var chap = r.x - kmL, ong = kmR - r.r;
          var katta = r.sz >= kmSz * 1.3;
          var markaz = chap > 18 && Math.abs(chap - ong) < 16;
          var parts = r.parts.map(function (p) { return { s: p.s, i: p.i }; });
          if (katta) { blocks.push({ k: "h", p: pn, parts: parts }); cur = null; birinchi = false; return; }
          if (markaz) { blocks.push({ k: "c", p: pn, parts: parts }); cur = null; birinchi = false; return; }
          /* XATBOSHI (2026-10-09, egasi so'radi - o'zbekcha kitoblarda butun bet bitta xatboshi bo'lib chiqardi):
             birinchi satri surilmagan kitoblarda ham xatboshi ajratiladi - (a) satrlar orasida kattaroq bo'shliq bo'lsa,
             (b) oldingi satr QISQA tugagan va gap tugatuvchi tinish belgisi bilan yakunlangan bo'lsa yoki yangi satr
             muloqot tiresi bilan boshlansa. Surilgan birinchi satr - avvalgidek. */
          var yangi = !cur || chap > 6;
          if (!yangi && oldR) {
            var qisqa = (oldR.ong - oldR.r) > Math.max(40, (oldR.ong - kmL) * 0.12);
            if (!birinchi && (r.y - oldR.y) > oldR.sz * 1.75) { yangi = true; }
            else if (qisqa && (/[.!?\u2026:;\u00bb\u201d"]$/.test(oldR.text) || /^[-\u2013\u2014]\s/.test(r.text))) { yangi = true; }
          }
          oldR = { y: r.y, r: r.r, sz: r.sz, text: r.text, ong: betOng };
          if (yangi) {
            cur = { k: chap > 30 ? "q" : "p", p: pn, parts: parts, tekis: chap <= 6 };
            blocks.push(cur);
          } else {
            // oldingi satr davomi; satr oxiridagi bo'g'in ko'chirish chizig'i olib tashlanadi
            var oxir = cur.parts[cur.parts.length - 1];
            var bosh = parts[0].s.replace(/^\s+/, "");
            oxir.s = oxir.s.replace(/\s+$/, "");
            if (/[A-Za-zА-Яа-яЁёÀ-ɏ'’ʻ\u2018\u045e\u049b\u0493\u04b3\u040e\u049a\u0492\u04b2]-$/.test(oxir.s) && /^[a-zа-яёà-ÿ\u045e\u049b\u0493\u04b3]/.test(bosh)) { oxir.s = oxir.s.slice(0, -1); }
            else { oxir.s += " "; }
            parts[0].s = bosh;
            if (birinchi) { cur.parts.push({ pm: pn }); }       // shu yerdan yangi PDF beti boshlanadi
            parts.forEach(function (p) {
              var o2 = cur.parts[cur.parts.length - 1];
              if (o2.pm === undefined && o2.i === p.i) { o2.s += p.s; } else { cur.parts.push(p); }
            });
          }
          birinchi = false;
        });
      });
    });
    return chain.then(function () { return blocks; });
  }

  function kmStage() {
    var st = $("kr-text");
    st.style.height = Math.max(260, (window.innerHeight || 640) - 156) + "px";
    return st;
  }

  function kmStyle() {
    var st = $("kr-text"), fl = $("km-flow");
    st.className = "kr-text km-" + kmPref.th + " km-" + kmPref.ff;
    fl.style.fontSize = KM_SIZES[kmPref.fs] + "px";
    fl.style.lineHeight = String(KM_GAPS[kmPref.lh]);
  }

  // Ustunlarga bo'lish va har belgi (data-p) qaysi "ekran"da ekanini hisoblash
  function kmLayout() {
    var st = kmStage(), fl = $("km-flow");
    var W = st.clientWidth || 320, H = st.clientHeight || 480;
    kmStyle();
    fl.style.width = W + "px";
    fl.style.height = H + "px";
    fl.style.columnWidth = W + "px";
    fl.style.webkitColumnWidth = W + "px";
    Array.prototype.forEach.call(fl.querySelectorAll(".km-img"), function (el) {
      var r = parseFloat(el.getAttribute("data-r")) || 0.65;
      var w = Math.min(W - 44, (H - 24) * r);
      el.style.width = w + "px";
      el.style.height = (w / r) + "px";
    });
    kmScreens = Math.max(1, Math.round(fl.scrollWidth / W));
    kmMarks = Array.prototype.map.call(fl.querySelectorAll("[data-p]"), function (el) {
      return { p: parseInt(el.getAttribute("data-p"), 10), s: Math.max(0, Math.floor((el.offsetLeft + 1) / W)), k: el.getAttribute("data-k") };
    });
  }

  function kmMove(anim) {
    var fl = $("km-flow"), W = $("kr-text").clientWidth || 320;
    fl.style.transition = anim ? "transform .26s cubic-bezier(.3,.7,.3,1)" : "none";
    fl.style.transform = "translate3d(" + (-kmScr * W) + "px,0,0)";
  }

  // Hozirgi ekrandagi joy: PDF beti va blok raqami
  // oxirgi = true: ekrandagi OXIRGI belgi (bet raqami uchun - surgich bilan kelingan bet aynan ko'rinsin);
  // aks holda birinchisi (harf o'zgarganda joyni ushlab turish uchun)
  function kmHere(oxirgi) {
    var joy = null;
    for (var i = 0; i < kmMarks.length; i++) {
      if (kmMarks[i].s > kmScr) { break; }
      joy = kmMarks[i];
      if (!oxirgi && kmMarks[i].s === kmScr) { break; }
    }
    return joy || kmMarks[0] || null;
  }

  function kmSync() {
    var joy = kmHere(true), sec = kmToc[kmSec];
    if (!joy || !sec) { return; }
    krSet(joy.p);
    ktBet(krId, krLang, joy.p);
    $("kr-t").textContent = sec.real ? sec.t : ktName(krId);
    kmMarkIcon();
  }

  function kmRender(blocks) {
    var fl = $("km-flow");
    fl.innerHTML = "";
    var gen = krGen, oldingi = null;
    blocks.forEach(function (b, i) {
      var el;
      if (b.k === "img") {
        el = document.createElement("div");
        el.className = "km-img";
        el.setAttribute("data-r", String(b.ratio));
        (function (box, pn) {
          krDoc.getPage(pn).then(function (pg) {
            if (gen !== krGen) { return; }
            var base = pg.getViewport({ scale: 1 }), vp = pg.getViewport({ scale: Math.min(2.2, 900 / base.width) });
            var c = document.createElement("canvas");
            c.width = Math.floor(vp.width);
            c.height = Math.floor(vp.height);
            return pg.render({ canvasContext: c.getContext("2d"), viewport: vp }).promise.then(function () {
              if (gen === krGen && box.parentNode) { box.appendChild(c); } else { c.width = 0; c.height = 0; }
            });
          })["catch"](function () {});
        })(el, b.p);
      } else {
        el = document.createElement(b.k === "h" ? "h3" : "p");
        if (b.k === "h" && oldingi === "h") { el.className = "km-h2"; }
        if (b.k === "c") { el.className = "km-c"; }
        if (b.k === "q") { el.className = "km-q"; }
        if (b.k === "p" && (b.tekis || oldingi === "h" || oldingi === "c" || oldingi === null)) { el.className = "km-t"; }
        b.parts.forEach(function (p) {
          if (p.pm !== undefined) {
            var a = document.createElement("a");
            a.className = "km-pm";
            a.setAttribute("data-p", String(p.pm));
            el.appendChild(a);
          } else if (p.i) {
            var it = document.createElement("i");
            it.textContent = p.s;
            el.appendChild(it);
          } else {
            el.appendChild(document.createTextNode(p.s));
          }
        });
      }
      el.setAttribute("data-p", String(b.p));
      el.setAttribute("data-k", String(i));
      fl.appendChild(el);
      oldingi = b.k;
    });
  }

  // Bo'limni ochish. qayer: {p: bet} | {k: blok} | {oxir: true} | bo'sh (boshidan)
  function kmOpenSec(i, qayer) {
    var sec = kmToc[i];
    if (!sec || kmBusy) { return; }
    kmBusy = true;
    var gen = krGen, my = ++kmGenLocal;
    var kut = setTimeout(function () { if (kmBusy && gen === krGen) { krMsg(kmX().wait, false); } }, 350);
    kmBlocks(sec).then(function (blocks) {
      clearTimeout(kut);
      kmBusy = false;
      if (gen !== krGen || my !== kmGenLocal || krMode !== "text") { return; }
      if (!blocks.length) {
        // Bo'lim butunlay bo'sh betlardan iborat: yo'nalish bo'yicha keyingisiga o'tamiz
        var qoshni = (qayer && qayer.oxir) ? i - 1 : i + 1;
        if (kmToc[qoshni]) { kmOpenSec(qoshni, (qayer && qayer.oxir) ? { oxir: true } : null); return; }
      }
      krMsg("", false);
      kmSec = i;
      kmRender(blocks);
      kmLayout();
      kmScr = 0;
      if (qayer && qayer.oxir) { kmScr = kmScreens - 1; }
      else if (qayer && qayer.k != null) {
        kmMarks.forEach(function (m) { if (m.k === String(qayer.k)) { kmScr = m.s; } });
      } else if (qayer && qayer.p) {
        for (var j = 0; j < kmMarks.length; j++) { if (kmMarks[j].p >= qayer.p) { kmScr = kmMarks[j].s; break; } }
      }
      kmMove(false);
      kmSync();
    })["catch"](function () {
      clearTimeout(kut);
      kmBusy = false;
      if (gen === krGen) { krMsg(ktX().rfail, true); }
    });
  }

  function kmSecOf(p) {
    for (var i = kmToc.length - 1; i >= 0; i--) { if (p >= kmToc[i].p) { return i; } }
    return 0;
  }

  // Matn rejimini ko'rsatish (rejim almashganda va kitob ochilganda)
  function kmShow() {
    kmStage();
    kmOpenSec(kmSecOf(krCur), { p: krCur });
  }

  function kmGoPage(p) {
    var i = kmSecOf(p);
    if (i === kmSec && !kmBusy) {
      kmScr = 0;
      for (var j = 0; j < kmMarks.length; j++) { if (kmMarks[j].p >= p) { kmScr = kmMarks[j].s; break; } }
      kmMove(false);
      kmSync();
    } else {
      kmOpenSec(i, { p: p });
    }
  }

  function kmTurn(dir) {
    if (kmBusy || krMode !== "text") { return; }
    var n = kmScr + dir;
    if (n < 0) {
      if (kmSec > 0) { kmOpenSec(kmSec - 1, { oxir: true }); } else { kmMove(true); }
      return;
    }
    if (n >= kmScreens) {
      if (kmSec < kmToc.length - 1) { kmOpenSec(kmSec + 1, null); } else { kmMove(true); }
      return;
    }
    kmScr = n;
    kmMove(true);
    kmSync();
    try { if (tg && tg.HapticFeedback) { tg.HapticFeedback.selectionChanged(); } } catch (e) {}
  }

  // Harf/fon o'zgarganda: o'qilayotgan joy saqlanib qoladi
  function kmRelayout() {
    if (krMode !== "text" || kmSec < 0) { kmStyle(); return; }
    var joy = kmHere();
    kmLayout();
    kmScr = 0;
    if (joy) { kmMarks.forEach(function (m) { if (m.k === joy.k && m.p === joy.p) { kmScr = m.s; } }); }
    kmScr = Math.min(kmScr, kmScreens - 1);
    kmMove(false);
    kmSync();
  }

  function kmDown(ev) {
    if (krMode !== "text" || kmBusy) { return; }
    kmDrag = { x: ev.clientX, y: ev.clientY, dx: 0, yon: false };
  }
  function kmDragMove(ev) {
    var d = kmDrag;
    if (!d) { return; }
    d.dx = ev.clientX - d.x;
    if (!d.yon && Math.abs(d.dx) < 10) { return; }
    d.yon = true;
    var fl = $("km-flow"), W = $("kr-text").clientWidth || 320;
    fl.style.transition = "none";
    fl.style.transform = "translate3d(" + (-kmScr * W + d.dx) + "px,0,0)";
  }
  function kmUp(ev) {
    var d = kmDrag;
    kmDrag = null;
    if (!d) { return; }
    var st = $("kr-text").getBoundingClientRect(), W = st.width || 320;
    if (!d.yon) {
      if (Math.abs(ev.clientY - d.y) > 12) { return; }
      var fx = (ev.clientX - st.left) / W;
      if (fx > 0.66) { kmTurn(1); } else if (fx < 0.34) { kmTurn(-1); }
      return;
    }
    if (Math.abs(d.dx) > W * 0.16) { kmTurn(d.dx < 0 ? 1 : -1); } else { kmMove(true); }
  }

  /* --- xatcho'plar --- */
  function kmMarkAll() {
    var all = {};
    try { all = JSON.parse(window.localStorage.getItem("hp_kt_xat") || "{}") || {}; } catch (e) { all = {}; }
    return all;
  }
  function kmMarkList() { return (kmMarkAll()[krId + "_" + krLang] || []).slice(); }
  function kmMarkSave(list) {
    var all = kmMarkAll();
    all[krId + "_" + krLang] = list.slice(0, 60);
    try { window.localStorage.setItem("hp_kt_xat", JSON.stringify(all)); } catch (e) {}
  }
  function kmMarkIcon() {
    var bor = kmMarkList().some(function (m) { return m.p === krCur; });
    $("kr-mark").innerHTML = bor ? KM_ICON.markOn : KM_ICON.mark;
    $("kr-mark").classList.toggle("on", bor);
  }
  function kmMarkToggle() {
    if (!krDoc) { return; }
    var list = kmMarkList(), x = kmX();
    var bor = list.filter(function (m) { return m.p === krCur; }).length > 0;
    if (bor) {
      kmMarkSave(list.filter(function (m) { return m.p !== krCur; }));
      showToast(x.markOff);
      kmMarkIcon();
      return;
    }
    var p = krCur;
    kmLines(p).then(function (pg) {
      var matn = (pg.rows || []).slice(0, 3).map(function (r) { return r.text; }).join(" ").slice(0, 90);
      var sec = kmToc[kmSecOf(p)];
      list.push({ p: p, t: matn, c: sec && sec.real ? sec.t : "", at: Date.now() });
      list.sort(function (a, b) { return a.p - b.p; });
      kmMarkSave(list);
      showToast(x.markOn);
      kmMarkIcon();
      try { if (tg && tg.HapticFeedback) { tg.HapticFeedback.notificationOccurred("success"); } } catch (e) {}
    })["catch"](function () {});
  }

  /* --- mundarija / xatcho'plar / qidiruv oynasi --- */
  function kmNavOpen(tab) {
    if (!krDoc) { return; }
    kmNavTab = tab || kmNavTab;
    $("km-nav").classList.remove("hidden");
    kmNavRender();
  }
  function kmNavClose() { kmFindGen++; $("km-nav").classList.add("hidden"); }
  function kmNavGo(p) { kmNavClose(); krGo(p); }

  function kmNavRow(title, sub, onGo, onDel) {
    var row = document.createElement("div");
    row.className = "km-row";
    var b = document.createElement("button");
    b.type = "button";
    b.className = "km-row-b";
    var t = document.createElement("b");
    t.textContent = title;
    b.appendChild(t);
    if (sub) { var s = document.createElement("small"); s.textContent = sub; b.appendChild(s); }
    b.addEventListener("click", onGo);
    row.appendChild(b);
    if (onDel) {
      var d = document.createElement("button");
      d.type = "button";
      d.className = "km-row-x";
      d.setAttribute("aria-label", kmX().del);
      d.textContent = "×";
      d.addEventListener("click", onDel);
      row.appendChild(d);
    }
    return row;
  }

  function kmNavRender() {
    var x = kmX(), box = $("km-nav-list");
    ["toc", "marks", "find"].forEach(function (k) {
      var b = $("km-tab-" + k);
      b.textContent = x[k];
      b.classList.toggle("on", k === kmNavTab);
    });
    $("km-nav-close").textContent = x.close;
    $("km-find").classList.toggle("hidden", kmNavTab !== "find" || !kmHasText);
    $("km-find-in").placeholder = x.findPh;
    $("km-find-go").textContent = x.findGo;
    $("km-tab-find").classList.toggle("hidden", !kmHasText);
    box.innerHTML = "";
    if (kmNavTab === "toc") {
      var hozir = kmSecOf(krCur);
      kmToc.forEach(function (sec, i) {
        var row = kmNavRow(sec.t, x.pg(sec.p), function () { kmNavGo(sec.p); });
        if (i === hozir) { row.classList.add("on"); }
        box.appendChild(row);
      });
      var on = box.querySelector(".on");
      if (on) { setTimeout(function () { try { box.scrollTop = Math.max(0, on.offsetTop - box.offsetTop - 80); } catch (e) {} }, 0); }
    } else if (kmNavTab === "marks") {
      var list = kmMarkList();
      if (!list.length) {
        var p = document.createElement("p");
        p.className = "km-empty";
        p.textContent = x.noMarks;
        box.appendChild(p);
      }
      list.forEach(function (m) {
        box.appendChild(kmNavRow((m.c ? m.c + " · " : "") + x.pg(m.p), m.t ? m.t + "…" : "", function () { kmNavGo(m.p); }, function () {
          kmMarkSave(kmMarkList().filter(function (q) { return q.p !== m.p; }));
          kmMarkIcon();
          kmNavRender();
        }));
      });
    } else {
      var st = document.createElement("p");
      st.className = "km-empty";
      st.id = "km-find-st";
      box.appendChild(st);
    }
  }

  // Qidiruv uchun betning oddiy matni: yengil yo'l (shrift nomlari yuklanmaydi), kesh alohida
  var kmPlainCache = {};
  function kmPlain(n) {
    if (kmCache[n]) { return Promise.resolve((kmCache[n].rows || []).map(function (r) { return r.text; }).join(" ")); }
    if (kmPlainCache[n] !== undefined) { return Promise.resolve(kmPlainCache[n]); }
    return krDoc.getPage(n).then(function (pg) { return pg.getTextContent(); }).then(function (tc) {
      var t = (tc.items || []).map(function (it) { return it.str + (it.hasEOL ? " " : ""); }).join("").replace(/-\s+(?=[a-zа-яё])/g, "").replace(/\s+/g, " ").trim();
      kmPlainCache[n] = t;
      return t;
    });
  }

  function kmFind() {
    var soz = ($("km-find-in").value || "").replace(/\s+/g, " ").trim().toLowerCase();
    if (soz.length < 2 || !krDoc) { return; }
    try { $("km-find-in").blur(); } catch (e) {}
    var x = kmX(), box = $("km-nav-list"), my = ++kmFindGen, gen = krGen, topildi = 0;
    box.innerHTML = "";
    var st = document.createElement("p");
    st.className = "km-empty";
    box.appendChild(st);
    var p = krFirst;
    var qadam = function () {
      if (my !== kmFindGen || gen !== krGen) { return; }
      if (p > krN || topildi >= 60) {
        st.textContent = x.found(topildi) + (topildi >= 60 ? " · " + x.more : "");
        return;
      }
      st.textContent = x.finding(p, krN);
      var bet = p++;
      kmPlain(bet).then(function (matn) {
        if (my !== kmFindGen || gen !== krGen) { return; }
        var past = matn.toLowerCase(), i = past.indexOf(soz), marta = 0;
        while (i >= 0 && marta < 3 && topildi < 60) {
          var a = Math.max(0, i - 36), b = Math.min(matn.length, i + soz.length + 46);
          var sec = kmToc[kmSecOf(bet)];
          box.appendChild(kmNavRow((a > 0 ? "…" : "") + matn.slice(a, b) + (b < matn.length ? "…" : ""),
                                   (sec && sec.real ? sec.t + " · " : "") + x.pg(bet), (function (q) { return function () { kmNavGo(q); }; })(bet)));
          topildi++;
          marta++;
          i = past.indexOf(soz, i + soz.length);
        }
        // har 12 betda brauzerga nafas - oyna qotib qolmasin
        if (bet % 12 === 0) { setTimeout(qadam, 0); } else { qadam(); }
      })["catch"](function () { qadam(); });
    };
    qadam();
  }

  /* --- sozlamalar oynasi --- */
  function kmSetOpen() {
    if (!krDoc) { return; }
    $("km-set").classList.remove("hidden");
    kmSetRender();
  }
  function kmSetClose() { $("km-set").classList.add("hidden"); }

  function kmSetRender() {
    var x = kmX();
    $("km-set-ttl").textContent = x.set;
    $("km-l-mode").textContent = x.mode;
    $("km-l-size").textContent = x.size;
    $("km-l-theme").textContent = x.theme;
    $("km-l-font").textContent = x.font;
    $("km-l-gap").textContent = x.gap;
    $("km-set-close").textContent = x.close;
    [["text", x.mText], ["flip", x.mFlip], ["scroll", x.mScroll]].forEach(function (m) {
      var b = $("km-m-" + m[0]);
      b.textContent = m[1];
      b.classList.toggle("on", krMode === m[0]);
    });
    $("km-m-text").classList.toggle("hidden", !kmHasText);
    $("km-only-text").classList.toggle("hidden", krMode !== "text");
    $("km-size-n").textContent = String(kmPref.fs + 1) + " / " + KM_SIZES.length;
    $("km-size-m").disabled = kmPref.fs <= 0;
    $("km-size-p").disabled = kmPref.fs >= KM_SIZES.length - 1;
    [["tun", x.thTun], ["sepia", x.thSepia], ["kun", x.thKun]].forEach(function (t) {
      var b = $("km-th-" + t[0]);
      b.querySelector("span").textContent = t[1];
      b.classList.toggle("on", kmPref.th === t[0]);
    });
    [["serif", x.fSerif], ["sans", x.fSans]].forEach(function (f) {
      var b = $("km-ff-" + f[0]);
      b.textContent = f[1];
      b.classList.toggle("on", kmPref.ff === f[0]);
    });
    [0, 1, 2].forEach(function (i) { $("km-lh-" + i).classList.toggle("on", kmPref.lh === i); });
    $("km-only-kir").classList.toggle("hidden", !kmKirill);
    $("km-l-yz").textContent = x.yz;
    $("km-yz-lot").textContent = x.yzLot;
    $("km-yz-kir").textContent = x.yzKir;
    $("km-yz-lot").classList.toggle("on", kmPref.yz !== "kir");
    $("km-yz-kir").classList.toggle("on", kmPref.yz === "kir");
  }

  function kmSetup() {
    $("kr-aa").innerHTML = KM_ICON.aa;
    $("kr-nav").innerHTML = KM_ICON.list;
    $("kr-mark").innerHTML = KM_ICON.mark;
    $("kr-aa").addEventListener("click", kmSetOpen);
    $("kr-nav").addEventListener("click", function () { kmNavOpen("toc"); });
    $("kr-mark").addEventListener("click", kmMarkToggle);
    $("km-set-close").addEventListener("click", kmSetClose);
    $("km-set").addEventListener("click", function (ev) { if (ev.target === $("km-set")) { kmSetClose(); } });
    $("km-nav-close").addEventListener("click", kmNavClose);
    $("km-nav").addEventListener("click", function (ev) { if (ev.target === $("km-nav")) { kmNavClose(); } });
    ["toc", "marks", "find"].forEach(function (k) {
      $("km-tab-" + k).addEventListener("click", function () { kmFindGen++; kmNavTab = k; kmNavRender(); });
    });
    $("km-find-go").addEventListener("click", kmFind);
    $("km-find-in").addEventListener("keydown", function (ev) { if (ev.key === "Enter") { kmFind(); } });
    ["text", "flip", "scroll"].forEach(function (m) {
      $("km-m-" + m).addEventListener("click", function () { krModeSet(m); kmSetRender(); });
    });
    $("km-yz-lot").addEventListener("click", function () { kmYozuv("lot"); });
    $("km-yz-kir").addEventListener("click", function () { kmYozuv("kir"); });
    $("km-size-m").addEventListener("click", function () { if (kmPref.fs > 0) { kmPref.fs--; kmSave(); kmRelayout(); kmSetRender(); } });
    $("km-size-p").addEventListener("click", function () { if (kmPref.fs < KM_SIZES.length - 1) { kmPref.fs++; kmSave(); kmRelayout(); kmSetRender(); } });
    ["tun", "sepia", "kun"].forEach(function (t) {
      $("km-th-" + t).addEventListener("click", function () { kmPref.th = t; kmSave(); kmStyle(); kmSetRender(); });
    });
    ["serif", "sans"].forEach(function (f) {
      $("km-ff-" + f).addEventListener("click", function () { kmPref.ff = f; kmSave(); kmRelayout(); kmSetRender(); });
    });
    [0, 1, 2].forEach(function (i) {
      $("km-lh-" + i).addEventListener("click", function () { kmPref.lh = i; kmSave(); kmRelayout(); kmSetRender(); });
    });
    var st = $("kr-text");
    if (window.PointerEvent) {
      st.addEventListener("pointerdown", kmDown);
      st.addEventListener("pointermove", kmDragMove);
      st.addEventListener("pointerup", kmUp);
      st.addEventListener("pointercancel", function () { kmDrag = null; kmMove(true); });
    } else {
      st.addEventListener("click", function (ev) {
        var r = st.getBoundingClientRect(), fx = (ev.clientX - r.left) / (r.width || 1);
        if (fx > 0.66) { kmTurn(1); } else if (fx < 0.34) { kmTurn(-1); }
      });
    }
    window.addEventListener("resize", function () { if (krDoc && krMode === "text" && !kmBusy) { kmRelayout(); } });
  }

  kmSetup();
