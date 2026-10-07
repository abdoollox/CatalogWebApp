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
    uz: { set: "O'qish sozlamalari", mode: "Ko'rinish", mText: "Matn", mFlip: "Asl sahifa", mScroll: "Surib o'qish",
          size: "Harf kattaligi", theme: "Fon", font: "Shrift", fSerif: "Kitobiy", fSans: "Sodda", gap: "Qator oralig'i",
          thTun: "Tun", thSepia: "Sepiya", thKun: "Kun", close: "Yopish",
          toc: "Mundarija", marks: "Xatcho'plar", find: "Qidiruv", front: "Muqova va kirish", pages: function (a, b) { return a + "–" + b + "-betlar"; },
          noMarks: "Hali xatcho'p yo'q. O'qiyotgan joyingizni saqlash uchun tepada xatcho'p belgisini bosing.",
          markOn: "Xatcho'p qo'yildi", markOff: "Xatcho'p olib tashlandi", pg: function (n) { return n + "-bet"; },
          findPh: "So'z yoki ibora", findGo: "Qidirish", finding: function (a, b) { return "Qidirilmoqda… " + a + " / " + b; },
          found: function (n) { return n ? n + " ta joy topildi" : "Hech narsa topilmadi"; }, more: "Faqat birinchi 60 tasi ko'rsatildi",
          wait: "Bob ochilmoqda…", del: "O'chirish" },
    ru: { set: "Настройки чтения", mode: "Вид", mText: "Текст", mFlip: "Оригинал", mScroll: "Прокрутка",
          size: "Размер букв", theme: "Фон", font: "Шрифт", fSerif: "Книжный", fSans: "Простой", gap: "Интервал",
          thTun: "Ночь", thSepia: "Сепия", thKun: "День", close: "Закрыть",
          toc: "Оглавление", marks: "Закладки", find: "Поиск", front: "Обложка и вступление", pages: function (a, b) { return "Стр. " + a + "–" + b; },
          noMarks: "Закладок пока нет. Чтобы сохранить место, нажмите значок закладки вверху.",
          markOn: "Закладка добавлена", markOff: "Закладка удалена", pg: function (n) { return "стр. " + n; },
          findPh: "Слово или фраза", findGo: "Найти", finding: function (a, b) { return "Ищем… " + a + " / " + b; },
          found: function (n) { return n ? "Найдено мест: " + n : "Ничего не найдено"; }, more: "Показаны только первые 60",
          wait: "Глава открывается…", del: "Удалить" },
    en: { set: "Reading settings", mode: "View", mText: "Text", mFlip: "Original", mScroll: "Scroll",
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
    }
  } catch (e) {}

  var kmToc = [];            // bo'limlar: [{t, p (birinchi bet), e (oxirgi bet), real}]
  var kmHasText = false, kmBody = 1, kmL = 28, kmR = 337, kmSz = 11;
  var kmCache = {};          // bet -> {rows, img}
  var kmSec = -1, kmScreens = 1, kmScr = 0, kmMarks = [], kmBusy = false, kmDrag = null, kmGenLocal = 0;
  var kmNavTab = "toc", kmFindGen = 0;

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
      var shrift = function () { return pg.getTextContent(); };
      // getOperatorList shriftlarning haqiqiy nomini yuklaydi (kursivni bilish uchun)
      return pg.getOperatorList().then(shrift, shrift).then(function (tc) {
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
          r.segs.push({ x: x, w: it.width || 0, s: it.str, i: ital[it.fontName] });
        });
        rows = rows.filter(function (r) { return r.len > 0; });
        rows.sort(function (a, b) { return a.y - b.y; });
        if (!xom && n >= kmBody) {
          // Betning tepasidagi takror sarlavha va bet raqami matnga kirmaydi
          rows = rows.filter(function (r) { return r.y > H * 0.078 && r.y < H * 0.95; });
        }
        rows.forEach(function (r) {
          r.segs.sort(function (a, b) { return a.x - b.x; });
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
        var res = { rows: rows, img: rows.length === 0, ratio: vp.width / vp.height };
        if (!xom) { kmCache[n] = res; }
        return res;
      });
    });
  }

  /* --- bob: satrlardan xatboshilar --- */
  function kmBlocks(sec) {
    var ps = [], n;
    for (n = sec.p; n <= sec.e; n++) { ps.push(n); }
    var blocks = [], cur = null;
    var chain = Promise.resolve();
    ps.forEach(function (pn) {
      chain = chain.then(function () { return kmLines(pn); }).then(function (pg) {
        if (pg.img) { blocks.push({ k: "img", p: pn, ratio: pg.ratio }); cur = null; return; }
        var birinchi = true;
        pg.rows.forEach(function (r) {
          var chap = r.x - kmL, ong = kmR - r.r;
          var katta = r.sz >= kmSz * 1.3;
          var markaz = chap > 18 && Math.abs(chap - ong) < 16;
          var parts = r.parts.map(function (p) { return { s: p.s, i: p.i }; });
          if (katta) { blocks.push({ k: "h", p: pn, parts: parts }); cur = null; birinchi = false; return; }
          if (markaz) { blocks.push({ k: "c", p: pn, parts: parts }); cur = null; birinchi = false; return; }
          var yangi = !cur || chap > 6;
          if (yangi) {
            cur = { k: chap > 30 ? "q" : "p", p: pn, parts: parts, tekis: chap <= 6 };
            blocks.push(cur);
          } else {
            // oldingi satr davomi; satr oxiridagi bo'g'in ko'chirish chizig'i olib tashlanadi
            var oxir = cur.parts[cur.parts.length - 1];
            var bosh = parts[0].s.replace(/^\s+/, "");
            oxir.s = oxir.s.replace(/\s+$/, "");
            if (/[A-Za-zА-Яа-яЁёÀ-ɏ'’ʻ]-$/.test(oxir.s) && /^[a-zа-яёà-ÿ]/.test(bosh)) { oxir.s = oxir.s.slice(0, -1); }
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
