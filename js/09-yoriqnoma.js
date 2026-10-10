/* Yo'riqnoma (egasi, 2026-10-11): yangi saralangan o'quvchiga Xogvarts bosh sahifasi EKRANNING O'ZIDA, qadam-baqadam
   tushuntiriladi - kerakli joy yoritiladi, yonida sardor nomidan qisqa izoh, «Keyingi». Oxirgi qadamlarda o'quvchi
   o'zi bosadi: Darslar -> Afsunlar -> 1-dars. Ilova kodi bir necha faylga bo'lingan; hammasi BIR umumiy maydonda
   ishlaydi va index.html dagi TARTIBDA yuklanadi - tekshiruv: tools/tartib.js
   Yangi qadam: YQ_QADAM ga {el: funksiya -> element, t: matn kaliti, tap: true (o'quvchi o'zi bosadi)}.
   Bosh sahifa tuzilishi yoki kurs qoidasi o'zgarsa SHU matnlarni ham yangilang. */
"use strict";

  var YQ_KEY = TK("hp_yoriq");          // "1" - yo'riqnoma kutmoqda (saralangan zahoti qo'yiladi)
  var yq = null;
  var YQ_TX = {
    kim: { uz: "%s · sardor", ru: "%s · староста", en: "%s · prefect" },
    k1: { uz: "Bu — sizning kursingiz. Hozir 1-kursdasiz. Dars o'tganingiz sari kurs oshadi va yangi xonalar ochiladi.",
          ru: "Это ваш курс. Сейчас вы на 1 курсе. Чем больше уроков, тем выше курс — и тем больше комнат открывается.",
          en: "This is your year. You are in year 1. Pass lessons to move up and open new rooms." },
    k2: { uz: "Umumiy xona — fakultetdoshlar va butun maktab bilan suhbat shu yerda. U hozirdan ochiq.",
          ru: "Общая гостиная — здесь общаются факультет и вся школа. Она уже открыта.",
          en: "The common room — chat with your house and the whole school here. It is open already." },
    k3: { uz: "Qulf turgan xonalar keyingi kurslarda ochiladi. Masalan, Bellashuv — 2-kursda: fakultetga ball shu yerdan keladi.",
          ru: "Комнаты с замком откроются на следующих курсах. Например, Состязание — на 2 курсе: оттуда приходят баллы факультету.",
          en: "Locked rooms open in later years. The Contest, for example, opens in year 2 — that is where house points come from." },
    k4: { uz: "Tepada: chapda — kutubxona (filmlar, kitoblar, musiqa), o'ngda — boyo'g'li pochtasi va profilingiz.",
          ru: "Наверху: слева — библиотека (фильмы, книги, музыка), справа — совиная почта и ваш профиль.",
          en: "At the top: the library (films, books, music) on the left; owl post and your profile on the right." },
    k5: { uz: "Endi birinchi darsga boramiz. «Darslar»ni bosing.", ru: "А теперь — на первый урок. Нажмите «Уроки».", en: "Now to your first lesson. Tap “Lessons”." },
    k6: { uz: "Bu yerda to'qqiz fan. Birinchisi — Afsunlar, professor Flitvik kutyapti. Uni bosing.",
          ru: "Здесь девять предметов. Первый — Заклинания, профессор Флитвик ждёт. Нажмите на него.",
          en: "Nine subjects live here. First comes Charms — Professor Flitwick is waiting. Tap it." },
    k7: { uz: "Darslar birin-ketin ochiladi. Yoritilgan darsni bosing — omad!", ru: "Уроки открываются по очереди. Нажмите на подсвеченный урок — удачи!", en: "Lessons open one after another. Tap the highlighted lesson — good luck!" },
    nx: { uz: "Keyingi", ru: "Дальше", en: "Next" },
    bos: { uz: "Yoritilgan joyni bosing", ru: "Нажмите на подсвеченное", en: "Tap the highlighted spot" },
    otkaz: { uz: "O'tkazib yuborish", ru: "Пропустить", en: "Skip" }
  };
  function yqT(k) { return (YQ_TX[k] && (YQ_TX[k][lang] || YQ_TX[k].uz)) || ""; }
  function yqQ(sel) { return function () { return document.querySelector(sel); }; }
  var YQ_QADAM = [
    { el: yqQ("#hub-kurs"), t: "k1" },
    { el: yqQ('#scr-hub .hx[data-k="chat"]'), t: "k2" },
    { el: yqQ('#scr-hub .hx[data-k="bell"]'), t: "k3" },
    { el: yqQ("#scr-hub .hub-head"), t: "k4" },
    { el: yqQ('#scr-hub .hx[data-k="dars"]'), t: "k5", tap: true },
    { el: yqQ('#scr-dars .dr-card[data-fan="afsun"]'), t: "k6", tap: true },
    { el: yqQ("#scr-fan .fn-l.now"), t: "k7", tap: true }
  ];

  function yqKut() { try { window.localStorage.setItem(YQ_KEY, "1"); } catch (e) {} }
  function yqKerak() { try { return window.localStorage.getItem(YQ_KEY) === "1"; } catch (e) { return false; } }

  // Ko'rinib turgan element (yashirin sahifadagisi hisobga olinmaydi)
  function yqEl() {
    var e = null;
    try { e = YQ_QADAM[yq.i].el(); } catch (x) {}
    if (!e || !e.getClientRects().length) { return null; }
    return e;
  }

  function yqBosh() {
    if (yq || !yqKerak() || !hasHouse() || $("scr-hub").classList.contains("hidden")) { return; }
    var o = document.createElement("div");
    o.className = "yq";
    o.innerHTML = '<div class="yq-teshik"></div><div class="yq-box"><div class="yq-bosh"><img class="yq-rasm" alt=""><div><b class="yq-kim"></b><p class="yq-m"></p></div></div>'
      + '<div class="yq-btm"><button type="button" class="yq-otkaz"></button><span class="yq-n"></span><button type="button" class="yq-nx"></button></div></div>';
    document.body.appendChild(o);
    yq = { i: 0, o: o, kut: 0, sur: -1, iv: 0 };
    var uy = cupMe().house || house;
    o.querySelector(".yq-rasm").src = "img/sardor/" + (validHouse(uy) || "gryffindor") + ".webp";     // sardor rasmi (asl: dizayn-tizimi/sardor/)
    o.querySelector(".yq-kim").textContent = yqT("kim").replace("%s", syT("ism_" + uy));
    o.querySelector(".yq-otkaz").textContent = yqT("otkaz");
    o.querySelector(".yq-otkaz").onclick = yqTugat;
    o.querySelector(".yq-nx").onclick = function () { yqKeyingi(); };
    document.addEventListener("click", yqBosildi, true);
    yq.iv = setInterval(yqJoy, 200);
    yqJoy();
  }

  function yqKeyingi() {
    if (!yq) { return; }
    yq.i++; yq.kut = 0;
    if (yq.i >= YQ_QADAM.length) { yqTugat(); return; }
    yqJoy();
  }

  function yqTugat() {
    try { window.localStorage.removeItem(YQ_KEY); } catch (e) {}
    if (!yq) { return; }
    clearInterval(yq.iv);
    document.removeEventListener("click", yqBosildi, true);
    if (yq.o.parentNode) { yq.o.parentNode.removeChild(yq.o); }
    yq = null;
  }

  // Yoritilgan joydan va izoh oynasidan boshqa hech narsa bosilmaydi
  function yqBosildi(ev) {
    if (!yq) { return; }
    var t = ev.target, q = YQ_QADAM[yq.i], e = yqEl();
    if (yq.o.querySelector(".yq-box").contains(t)) { return; }
    if (q.tap && e && e.contains(t)) { setTimeout(yqKeyingi, 60); return; }
    ev.preventDefault();
    ev.stopPropagation();
  }

  // Teshik va izohni element ustiga qo'yadi (sahifa qayta chizilsa ham ergashadi)
  function yqJoy() {
    if (!yq) { return; }
    var q = YQ_QADAM[yq.i], e = yqEl(), o = yq.o;
    var tsh = o.querySelector(".yq-teshik"), box = o.querySelector(".yq-box");
    if (!e) {
      // element hali chizilmagan: biroz kutamiz; chiqmasa - qadam tashlab ketiladi (bosiladigan qadamda yo'riqnoma tugaydi)
      o.classList.add("kut");
      if (++yq.kut > 30) { if (q.tap) { yqTugat(); } else { yqKeyingi(); } }
      return;
    }
    yq.kut = 0;
    if (yq.sur !== yq.i) { yq.sur = yq.i; try { e.scrollIntoView({ block: "center" }); } catch (x) {} }
    var r = e.getBoundingClientRect(), vh = window.innerHeight, vw = window.innerWidth, p = 6;
    o.classList.remove("kut");
    tsh.style.left = (r.left - p) + "px"; tsh.style.top = (r.top - p) + "px";
    tsh.style.width = (r.width + p * 2) + "px"; tsh.style.height = (r.height + p * 2) + "px";
    o.querySelector(".yq-m").textContent = yqT(q.t);
    o.querySelector(".yq-n").textContent = (yq.i + 1) + " / " + YQ_QADAM.length;
    var nx = o.querySelector(".yq-nx");
    nx.textContent = q.tap ? yqT("bos") : yqT("nx");
    nx.disabled = !!q.tap;
    box.style.left = Math.max(12, Math.min(vw - box.offsetWidth - 12, r.left + r.width / 2 - box.offsetWidth / 2)) + "px";
    var past = r.bottom + p + 12, tepa = r.top - p - 12 - box.offsetHeight;
    box.style.top = (past + box.offsetHeight < vh - 8 ? past : Math.max(8, tepa)) + "px";
  }
