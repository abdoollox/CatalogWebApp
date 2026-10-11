/* Yo'riqnoma (egasi, 2026-10-11): yangi saralangan o'quvchiga Xogvarts bosh sahifasi EKRANNING O'ZIDA, qadam-baqadam
   tushuntiriladi - kerakli joy yoritiladi, yonida sardor nomidan qisqa izoh, «Keyingi». Keyin o'quvchi o'zi bosadi (barmoq ishorasi bilan):
   Umumiy xona -> xabar yozadi -> ortga -> Darslar -> Afsunlar -> 1-dars. Ilova kodi bir necha faylga bo'lingan; hammasi BIR umumiy maydonda
   ishlaydi va index.html dagi TARTIBDA yuklanadi - tekshiruv: tools/tartib.js
   Yangi qadam: YQ_QADAM ga {el: funksiya -> element, t: matn kaliti, tap: true (o'quvchi o'zi bosadi) yoki kut: "nom" (yqHodisa("nom") kelguncha kutadi)}.
   Bosh sahifa tuzilishi yoki kurs qoidasi o'zgarsa SHU matnlarni ham yangilang. */
"use strict";

  var YQ_KEY = TK("hp_yoriq");          // "1" - yo'riqnoma kutmoqda (saralangan zahoti qo'yiladi)
  var yq = null;
  var YQ_TX = {
    kim: { uz: "%s · sardor", ru: "%s · староста", en: "%s · prefect" },
    k1: { uz: "Bu — sizning kursingiz. Hozir 1-kursdasiz. Dars o'tganingiz sari kurs oshadi va yangi xonalar ochiladi.",
          ru: "Это ваш курс. Сейчас вы на 1 курсе. Чем больше уроков, тем выше курс — и тем больше комнат открывается.",
          en: "This is your year. You are in year 1. Pass lessons to move up and open new rooms." },
    k3: { uz: "Qulf turgan xonalar keyingi kurslarda ochiladi. Masalan, Bellashuv — 2-kursda: fakultetga ball shu yerdan keladi.",
          ru: "Комнаты с замком откроются на следующих курсах. Например, Состязание — на 2 курсе: оттуда приходят баллы факультету.",
          en: "Locked rooms open in later years. The Contest, for example, opens in year 2 — that is where house points come from." },
    k4: { uz: "Tepada: chapda — kutubxona (filmlar, kitoblar, musiqa), o'ngda — boyo'g'li pochtasi va profilingiz.",
          ru: "Наверху: слева — библиотека (фильмы, книги, музыка), справа — совиная почта и ваш профиль.",
          en: "At the top: the library (films, books, music) on the left; owl post and your profile on the right." },
    k5: { uz: "Avval fakultetdoshlar bilan tanishamiz. «Umumiy xona»ni bosing.",
          ru: "Сначала познакомимся с факультетом. Нажмите «Общая гостиная».",
          en: "First, meet your housemates. Tap “Common room”." },
    k6: { uz: "Bu — suhbat xonasi. Pastdagi maydonga salom yozing va yuboring.",
          ru: "Это комната для общения. Напишите приветствие в поле внизу и отправьте.",
          en: "This is the chat room. Write a hello in the field below and send it." },
    k7: { uz: "Ajoyib, xabaringiz ketdi! Endi darsga boramiz — «ortga» tugmasini bosing.",
          ru: "Отлично, сообщение отправлено! Теперь на урок — нажмите «назад».",
          en: "Great, your message is sent! Now to the lesson — tap “back”." },
    k8: { uz: "Endi birinchi darsga boramiz. «Darslar»ni bosing.", ru: "А теперь — на первый урок. Нажмите «Уроки».", en: "Now to your first lesson. Tap “Lessons”." },
    k9: { uz: "Bu yerda to'qqiz fan. Birinchisi — Afsunlar, professor Flitvik kutyapti. Uni bosing.",
          ru: "Здесь девять предметов. Первый — Заклинания, профессор Флитвик ждёт. Нажмите на него.",
          en: "Nine subjects live here. First comes Charms — Professor Flitwick is waiting. Tap it." },
    k10: { uz: "Darslar birin-ketin ochiladi. Yoritilgan darsni bosing — omad!", ru: "Уроки открываются по очереди. Нажмите на подсвеченный урок — удачи!", en: "Lessons open one after another. Tap the highlighted lesson — good luck!" },
    nx: { uz: "Keyingi", ru: "Дальше", en: "Next" },
    bos: { uz: "Yoritilgan joyni bosing", ru: "Нажмите на подсвеченное", en: "Tap the highlighted spot" },
    yoz: { uz: "Xabar yozing", ru: "Напишите сообщение", en: "Write a message" }
  };
  function yqT(k) { return (YQ_TX[k] && (YQ_TX[k][lang] || YQ_TX[k].uz)) || ""; }
  function yqQ(sel) { return function () { return document.querySelector(sel); }; }
  var YQ_QADAM = [
    { el: yqQ("#hub-kurs"), t: "k1" },
    { el: yqQ('#scr-hub .hx[data-k="bell"]'), t: "k3" },
    { el: yqQ("#scr-hub .hub-head"), t: "k4" },
    { el: yqQ('#scr-hub .hx[data-k="chat"]'), t: "k5", tap: true },
    { el: yqQ("#scr-chat #chat-form"), t: "k6", kut: "chat" },          // xabar yuborilguncha kutadi (yqHodisa("chat"))
    { el: yqQ("#scr-chat #chat-back"), t: "k7", tap: true },
    { el: yqQ('#scr-hub .hx[data-k="dars"]'), t: "k8", tap: true },
    { el: yqQ('#scr-dars .dr-card[data-fan="afsun"]'), t: "k9", tap: true },
    { el: yqQ("#scr-fan .fn-l.now"), t: "k10", tap: true }
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
    o.innerHTML = '<div class="yq-teshik"></div><div class="yq-qol"><svg viewBox="0 0 24 24" fill="#fff" stroke="#10141a" stroke-width="1.1" stroke-linejoin="round"><path d="M9 11V4.5a1.5 1.5 0 0 1 3 0V10l5.2 1.1A2.3 2.3 0 0 1 19 13.4l-.6 4.3A3.8 3.8 0 0 1 14.6 21h-2.9a3.8 3.8 0 0 1-3-1.5L5.3 15a1.4 1.4 0 0 1 2.1-1.8L9 14.6z"/></svg></div><div class="yq-box"><div class="yq-bosh"><img class="yq-rasm" alt=""><div><b class="yq-kim"></b><p class="yq-m"></p></div></div>'
      + '<div class="yq-btm"><span class="yq-n"></span><button type="button" class="yq-nx"></button></div></div>';
    document.body.appendChild(o);
    yq = { i: 0, o: o, kut: 0, sur: -1, iv: 0, t0: 0 };
    var uy = cupMe().house || house;
    o.querySelector(".yq-rasm").src = "img/sardor/" + (validHouse(uy) || "gryffindor") + ".webp";     // sardor rasmi (asl: dizayn-tizimi/sardor/)
    o.querySelector(".yq-kim").textContent = yqT("kim").replace("%s", syT("ism_" + uy));
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
    if (q.kut && e && e.contains(t)) { return; }
    ev.preventDefault();
    ev.stopPropagation();
  }

  // Kutilgan ish bajarildi (masalan, chatga xabar yuborildi) - keyingi qadam
  function yqHodisa(nom) {
    if (yq && YQ_QADAM[yq.i].kut === nom) { setTimeout(yqKeyingi, 500); }
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
    // «O'tkazib yuborish» yo'q (egasi, 2026-10-11). Yozish qadamida odam tiqilib qolmasin: 40 soniyadan keyin «Keyingi» ochiladi.
    if (yq.t0i !== yq.i) { yq.t0i = yq.i; yq.t0 = Date.now(); }
    var ochiq = q.kut && Date.now() - yq.t0 > 40000;
    nx.textContent = q.tap ? yqT("bos") : q.kut && !ochiq ? yqT("yoz") : yqT("nx");
    nx.disabled = !!q.tap || (!!q.kut && !ochiq);
    // Bosiladigan joyga barmoq ishorasi
    var qol = o.querySelector(".yq-qol");
    qol.style.display = q.tap || q.kut ? "block" : "none";
    qol.style.left = (r.left + r.width / 2 - 6) + "px";
    qol.style.top = (r.top + Math.min(r.height * 0.55, r.height - 14)) + "px";
    box.style.left = Math.max(12, Math.min(vw - box.offsetWidth - 12, r.left + r.width / 2 - box.offsetWidth / 2)) + "px";
    var past = r.bottom + p + 12, tepa = r.top - p - 12 - box.offsetHeight;
    box.style.top = (past + box.offsetHeight < vh - 8 ? past : Math.max(8, tepa)) + "px";
  }
