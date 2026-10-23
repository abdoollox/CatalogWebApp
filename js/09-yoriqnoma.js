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
    try { e = yq.q[yq.i].el(); } catch (x) {}
    if (!e || !e.getClientRects().length) { return null; }
    return e;
  }

  // Bosh sahifa yo'riqnomasi (saralangandan keyin): sardor nomidan
  function yqBosh() {
    if (yq || !yqKerak() || !hasHouse() || $("scr-hub").classList.contains("hidden")) { return; }
    var uy = cupMe().house || house;
    yqOch(YQ_QADAM, { kim: yqT("kim").replace("%s", syT("ism_" + uy)), rasm: "img/sardor/" + (validHouse(uy) || "gryffindor") + ".webp", kalit: YQ_KEY });
  }

  /* Istalgan sahifa uchun yo'riqnoma: qadamlar = [{el: funksiya, t: YQ_TX kaliti yoki m: tayyor matn, tap, kut}],
     qadamda yana (ixtiyoriy): on - qadam boshlanganda bir marta chaqiriladi; b - kutish qadamidagi tugma matni;
     nuqta - barmoq ishorasi joyi (funksiya -> [x, y], ekran koordinatasi);
     savol: {ha, yoq} - so'rov qadami: ikki tugma, «ha» keyingi qadamga o'tadi, «yo'q» yo'riqnomani tugatadi (egasi, 2026-10-19:
     kutubxonada til/soundtrack/kitob yo'riqnomasi avval so'raladi).
     o = {kim: sarlavha, rasm: doiradagi rasm, kalit: tugaganda o'chiriladigan belgi (ixtiyoriy), tugash: funksiya (ixtiyoriy),
          ekran: sahifa id si - o'quvchi undan chiqib ketsa yo'riqnoma darhol yopiladi}. */
  function yqOch(qadamlar, o2) {
    if (yq) { return; }
    var o = document.createElement("div");
    o.className = "yq";
    o.innerHTML = '<div class="yq-teshik"></div><div class="yq-qol"><svg viewBox="0 0 24 24" fill="#fff" stroke="#10141a" stroke-width="1.1" stroke-linejoin="round"><path d="M9 11V4.5a1.5 1.5 0 0 1 3 0V10l5.2 1.1A2.3 2.3 0 0 1 19 13.4l-.6 4.3A3.8 3.8 0 0 1 14.6 21h-2.9a3.8 3.8 0 0 1-3-1.5L5.3 15a1.4 1.4 0 0 1 2.1-1.8L9 14.6z"/></svg></div><div class="yq-box"><div class="yq-bosh"><img class="yq-rasm" alt=""><div><b class="yq-kim"></b><b class="yq-s"></b><p class="yq-m"></p></div></div>'
      + '<div class="yq-btm"><span class="yq-n"></span><button type="button" class="yq-yoq"></button><button type="button" class="yq-nx"></button></div></div>';
    document.body.appendChild(o);
    yq = { i: 0, o: o, kut: 0, sur: -1, iv: 0, t0: 0, q: qadamlar, kalit: o2.kalit || "", tugash: o2.tugash || null, ekran: o2.ekran || "", onI: -1, zamon: !!o2.zamon };
    // zamon: kutubxona uchun zamonaviy ko'rinish (egasi, 2026-10-12) - qahramon va rasm yo'q, qadamda sarlavha (s), nuqtalar, ko'rsatkich
    if (o2.zamon) { o.classList.add("zamon"); } else { o.querySelector(".yq-rasm").src = o2.rasm; }
    o.querySelector(".yq-kim").textContent = o2.kim || "";
    o.querySelector(".yq-nx").onclick = function () { yqKeyingi(); };
    o.querySelector(".yq-yoq").onclick = function () { yqTugat(); };
    document.addEventListener("click", yqBosildi, true);
    yq.iv = setInterval(yqJoy, 200);
    yqJoy();
  }

  function yqKeyingi() {
    if (!yq) { return; }
    yq.i++; yq.kut = 0;
    if (yq.i >= yq.q.length) { yqTugat(); return; }
    yqJoy();
  }

  function yqTugat() {
    if (!yq) { try { window.localStorage.removeItem(YQ_KEY); } catch (e) {} return; }
    var tugash = yq.tugash;
    if (yq.kalit) { try { window.localStorage.removeItem(yq.kalit); } catch (e) {} }
    clearInterval(yq.iv);
    document.removeEventListener("click", yqBosildi, true);
    if (yq.o.parentNode) { yq.o.parentNode.removeChild(yq.o); }
    yq = null;
    if (tugash) { try { tugash(); } catch (e) {} }
  }

  // Yoritilgan joydan va izoh oynasidan boshqa hech narsa bosilmaydi
  function yqBosildi(ev) {
    if (!yq) { return; }
    var t = ev.target, q = yq.q[yq.i], e = yqEl();
    if (yq.o.querySelector(".yq-box").contains(t)) { return; }
    if (yq.ekran && t && t.closest && t.closest("#" + yq.ekran + " .back-btn")) { return; }      // dars yo'riqnomasida «ortga» doim ishlaydi (yo'riqnoma o'zi yopiladi)
    if (q.tap && e && e.contains(t)) { setTimeout(yqKeyingi, 60); return; }
    if (q.kut && e && e.contains(t)) { return; }
    ev.preventDefault();
    ev.stopPropagation();
  }

  // O'yin maydoni (canvas) yo'riqnoma paytida qabul qiladimi: faqat hozirgi qadam shu ishni kutayotgan bo'lsa (kut: nom)
  function yqBlok(nom) { return !!yq && yq.q[yq.i].kut !== nom; }

  // Kutilgan ish bajarildi (masalan, chatga xabar yuborildi) - keyingi qadam
  function yqHodisa(nom) {
    if (yq && yq.q[yq.i].kut === nom) { setTimeout(yqKeyingi, 500); }
  }

  // Teshik va izohni element ustiga qo'yadi (sahifa qayta chizilsa ham ergashadi)
  function yqJoy() {
    if (!yq) { return; }
    if (yq.ekran) { var ek = $(yq.ekran); if (!ek || ek.classList.contains("hidden")) { yqTugat(); return; } }
    if (yq.onI !== yq.i) { yq.onI = yq.i; if (yq.q[yq.i].on) { try { yq.q[yq.i].on(); } catch (x0) {} } }
    var q = yq.q[yq.i], e = yqEl(), o = yq.o;
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
    o.querySelector(".yq-m").textContent = q.m || yqT(q.t);
    if (yq.zamon) {
      var sv = o.querySelector(".yq-s"); sv.textContent = q.s || ""; sv.style.display = q.s ? "" : "none";
      var nq0 = "";
      for (var di = 0; di < yq.q.length; di++) { nq0 += '<i class="' + (di === yq.i ? "on" : di < yq.i ? "ot" : "") + '"></i>'; }
      o.querySelector(".yq-n").innerHTML = nq0;
    } else { o.querySelector(".yq-n").textContent = (yq.i + 1) + " / " + yq.q.length; }
    var nx = o.querySelector(".yq-nx"), yoq = o.querySelector(".yq-yoq");
    o.classList.toggle("savol", !!q.savol);
    if (q.savol) {                          // so'rov: «Ko'rsating» / «Kerak emas»
      yoq.textContent = q.savol.yoq; nx.textContent = q.savol.ha; nx.disabled = false;
      o.querySelector(".yq-qol").style.display = "none";
    }
    // «O'tkazib yuborish» yo'q (egasi, 2026-10-11). Yozish qadamida odam tiqilib qolmasin: 40 soniyadan keyin «Keyingi» ochiladi.
    if (yq.t0i !== yq.i) { yq.t0i = yq.i; yq.t0 = Date.now(); }
    var ochiq = q.kut && Date.now() - yq.t0 > 40000;
    if (!q.savol) {
    nx.textContent = q.tap ? yqT("bos") : q.kut && !ochiq ? (q.b || yqT("yoz")) : yqT("nx");
    nx.disabled = !!q.tap || (!!q.kut && !ochiq);
    // Bosiladigan joyga barmoq ishorasi
    var qol = o.querySelector(".yq-qol");
    qol.style.display = (q.tap || q.kut) && !q.qolsiz ? "block" : "none";      // qolsiz - o'zi kutiladigan ish (masalan, film yuborilishi)
    var nq = null;
    if (q.nuqta) { try { nq = q.nuqta(); } catch (x1) {} }
    qol.style.left = (nq ? nq[0] - 6 : r.left + r.width / 2 - 6) + "px";
    qol.style.top = (nq ? nq[1] : r.top + Math.min(r.height * 0.55, r.height - 14)) + "px";
    }
    box.style.left = Math.max(12, Math.min(vw - box.offsetWidth - 12, r.left + r.width / 2 - box.offsetWidth / 2)) + "px";
    var past = r.bottom + p + 12, tepa = r.top - p - 12 - box.offsetHeight;
    // sig'masa (masalan, katta o'yin maydoni) - ko'proq joy qolgan tomonda, ekran chetida turadi
    var bt = past + box.offsetHeight < vh - 8 ? past : tepa >= 8 ? tepa : vh - r.bottom > r.top ? vh - box.offsetHeight - 8 : 8;
    box.style.top = bt + "px";
    // zamonaviy ko'rinishda oyna chetidagi uchburchak element tomonga qaraydi (oyna element ustiga tushsa - yo'q)
    if (yq.zamon) {
      var bl = parseFloat(box.style.left) || 0;
      box.classList.toggle("ost", bt >= r.bottom); box.classList.toggle("ust", bt + box.offsetHeight <= r.top);
      box.style.setProperty("--ul", Math.max(22, Math.min(box.offsetWidth - 22, r.left + r.width / 2 - bl)) + "px");
    }
  }

  /* KURS YO'RIQNOMASI (egasi, 2026-10-11: «2-kursga o'tgandan keyin ham onboarding davom etsin - nima yangi qo'shilsa birin-ketin
     tushuntirilsin»). Kurs tabrigi yopilgach (kursTabrik -> yqKurs) sardor yangi ochilgan narsalarni bosh sahifaning O'ZIDA ko'rsatadi.
     Har kursga bir marta, ikki qismda (belgilar hp_kyq_<n> - 1-qism vaqti, hp_kyq_<n>b - 2-qism; pastda kyQism). Ko'rinmayotgan narsa (masalan, Patronus taklifi - olingan bo'lsa) qadamdan chiqariladi;
     bet: 1 - boshqa sahifadagi qadam (oldingi qadamda o'quvchi o'zi o'tadi), u tekshirilmaydi.
     Bosh sahifaga yangi narsa qo'shilsa yoki kurs qoidasi o'zgarsa - KY_TX va yqKurs dagi ro'yxatni yangilang. */
  var KY_TX = {
    uz: { cup: "Bu — Xogvarts kubogi: to'rt fakultet butun hafta ball uchun bellashadi. Ichiga kirib ko'ramiz — kartani bosing.",
          cupG: "Har qum soat — bitta fakultet. Ball qancha ko'p bo'lsa, soat shuncha to'ladi. Yakshanba 23:59 da eng ko'p ball to'plagan fakultet kubokni oladi.",
          cupT: "Mavsum — bir hafta: dushanbadan yakshanba yarim tunigacha. Tugashiga qancha qolgani shu yerda.",
          cupS: "Har fakultet ballari qayerdan kelgani: bellashuv, Shokolad qurbaqa, filmlar, shaxmat, do'stlar. Qaysi yo'l fakultetga ko'proq ball keltirayotgani shu yerda ko'rinadi.",
          cupY: "Bu — sizning hissangiz: bu hafta to'plagan ballingiz va fakultetingiz ichidagi o'rningiz. Pastda — har bir usul qancha ball berishi va siz undan qanchasini olganingiz. Hafta yakunida har 10 ballga 1 galleon.",
          cupX: "Endi ball yig'ish usullaridan birini ko'rib chiqamiz. «Ortga»ni bosing.",
          sq: "Ball yig'ishning yana bir usuli — Shokolad qurbaqa. Har kuni yangi quti. Ichiga kirib ko'ramiz — kartani bosing.",
          vNav: "Bugun — eng sodda topshiriqlar. Keling, ularni birga bajaramiz: har birida yo'l ko'rsataman.",
          vRow: "«%s» — shu topshiriqni bosing.",
          v_daily: "Bugungi Sehrgarlik tarixi bellashuvi — «Boshlash»ni bosing.",
          v_chat: "Fakultetdoshlaringizga salom yozing va yuboring.", v_chatB: "Xabar yozing",
          v_dars1: "Masalan, Afsunlar — Professor Flitvik darsi. Uni bosing.",
          v_dars2: "Navbatdagi darsni bosing — uni o'tsangiz, topshiriq bajariladi.",
          v_kitob1: "Bu — kitoblar javoni. Birinchi kitob bepul va u tanlab qo'yilgan.",
          v_kitob2: "«Ochish»ni bosing.",
          v_kitob3: "«O'qish»ni bosing — kitob ochilishi bilan topshiriq bajariladi.",
          v_music1: "Bu — soundtrack albomlari. Birinchisi bepul — uni bosing.",
          v_music2: "Tinglash tugmasini bosing.",
          vDone: "Barakalla! «%s» bajarildi. Qurbaqaga qaytamiz — keyingisini bajaramiz.",
          vOpen: "Hammasi bajarildi! Endi qutini oching.",
          vEslat: "Qurbaqa topshiriqlarini davom ettiramiz — kartani bosing.",
          sq1: "Bugungi kartochka hozircha sir: qutini ochgandagina qaysi mashhur sehrgar ekanini bilasiz — Dambldor, Merlin, Flamel…",
          sq2: "Bugungi oltita topshiriq: yengil, o'rtacha va qiyin. Bajarilgani belgilanadi; topshiriqni bossangiz — o'sha joyga olib boradi.",
          sq3: "Oltitasi bajarilgach shu tugma yonadi — qutini ochasiz: fakultetingizga +%b ball, sizga %g galleon va sehrgar kartochkasi.",
          sq4: "Ochilgan kartochkalar kolleksiyangizga tushadi — jami %n ta sehrgar. Hammasini yig'a olasizmi?",
          sq5: "Ketma-ketlik: har kuni qutini ochsangiz, sanoq o'sadi — har %k-kunda qo'shimcha +%g galleon. Bir kun o'tkazib yuborsangiz, noldan boshlanadi.",
          sq6: "Qurbaqa 3-kursga o'tish shartlaridan biri ham. Ortga qaytib, shartlarni ko'ramiz — «Ortga»ni bosing.",
          ks0: "3-kursga o'tish uchun uchta shart bor. Bajarilgani yashil bo'ladi.",
          ks1: "Birinchisi — har bir fandan 9 tadan dars. Pastdagi belgilarda har fan qanchada ekani ko'rinadi.",
          ks2: "Ikkinchisi — Shokolad qurbaqadan bitta karta: kunning oltita topshirig'ini bajarib, qutini oching.",
          ks3: "Uchinchisi — to'qqiz fanning har birida kamida bir marta bellashuv. Qatorni bossangiz — o'sha joyga olib boradi. Omad!",
          kurs: "Bu yerda keyingi kursga o'tish shartlari. Bajarilgan shart yashil bo'ladi, qatorni bossangiz — o'sha joyga olib boradi.",
          pat: "Patronusingizni ham chaqirib ko'ring — u bir marta aniqlanadi va profilingizda turadi.",
          dost: "Do'stlaringizni taklif qiling — har bir kelgan do'st uchun fakultetingizga ball qo'shiladi.",
          bell: "Ball yig'ishning asosiy usuli — Bellashuv. Har kuni har fanda bitta bellashuv: kim tez va xatosiz bajarsa, o'sha ko'p ball oladi (1-o'ringa +15). «Bellashuv»ni bosing.",
          bhero: "Tepada — bugungi natijangiz: nechta bellashuvda qatnashdingiz va hozirgi o'rinlaringizga qarab bugun qancha ball kutilmoqda. Kun yarim tunda yopiladi.",
          blist: "Mana bugungi bellashuvlar — har fanda bittadan. Birinchisini bosib, sinab ko'ring!",
          bh: "Bu — bugungi bellashuv: topshiriq hammaga bir xil. Kun yarim tunda yopiladi — qancha vaqt qolgani shu yerda.",
          bpz: "Kun yakunida o'rin bo'yicha ball beriladi: 1-o'ringa +%1, 2-o'ringa +%2, 3-o'ringa +%3, 4–10-o'rinlarga +%4. Bu ball fakultetingizga qo'shiladi.",
          bme: "Bu — sizning natijangiz. Kuniga uchta urinish bor, eng yaxshisi hisoblanadi. Vaqt «Boshlash» bosilgandan yuradi, har xato vaqtga qo'shiladi.",
          btop: "Pastda — bugungi peshqadamlar: kim tezroq bajarsa, o'sha yuqorida.",
          bgo: "Endi o'zingiz qatnashing — «Boshlash»ni bosing. Omad!",
          eslat: "Siz hali birorta bellashuvda qatnashmadingiz. Fakultetingizga ball olib kelish uchun bittasidan o'ting — «Bellashuv»ni bosing.",
          blist2: "Istalgan fanni tanlang.",
          tug1: "Barakalla, birinchi bellashuvingiz! Bu — natijangiz va hozirgi o'rningiz. Kun oxirigacha boshqalar ham qatnashadi, o'rningiz o'zgarishi mumkin. Yaxshilamoqchi bo'lsangiz — yana ikki urinish bor.",
          tug2: "Endi jadvalga qaytamiz — tugmani bosing.",
          tug3: "Boshqa fanlarga o'tamiz — «Ortga»ni bosing.",
          tug4: "Xuddi shu tartibda qolgan fanlarning bellashuvlarida ham qatnashing: har biri fakultetingizga alohida ball beradi. Bellashuvlar har kuni yangilanadi.",
          rek: "Rekordlar — har fanda «xatosiz kim uzoqqa boradi». Har kuni yarim tunda birinchi uchlik ball oladi.",
          qoriq: "Qo'riqxona — Maxluqlar darslarida olingan maxluqlaringiz. Galleonga yemish olib boqasiz, ular o'sadi va darslarda yordam beradi.",
          issiq: "Issiqxona — O'simlikshunoslik darslaridan urug'lar. Har kuni bepul sug'orasiz; yetilgan o'simlik maxluqlarga yemish beradi.",
          kurs3: "4-kurs — eng yuqori kurs. Shartlari shu yerda.",
          duel: "Duel — afsun chizib bellashasiz. Har yakshanba 22:00 da turnir, kompyuter raqiblar bilan esa istalgan payt mashq qilsa bo'ladi.",
          chess: "Sehrgarlar shaxmati — har chorshanba 22:00 da turnir. Do'stingizni ham chatdan o'yinga chaqirsa bo'ladi.",
          vik: "«Oxirgi sehrgar» viktorinasi — har juma 22:00. Xato qilgan chiqadi, oxirigacha qolgan — g'olib.",
          jd: "Hafta jadvali: qaysi kuni qanday turnir — shu yerda. Omad, sehrgar!",
          jd0: "Endi siz turnirlarda qatnasha olasiz. Hafta jadvali: qaysi kuni qanday turnir — shu yerda." },
    ru: { cup: "Это Кубок школы: четыре факультета всю неделю соревнуются за баллы. Заглянем внутрь — нажмите на карточку.",
          cupG: "Каждые песочные часы — один факультет. Чем больше баллов, тем полнее часы. В воскресенье в 23:59 кубок получает факультет с наибольшим числом баллов.",
          cupT: "Сезон длится неделю: с понедельника до полуночи воскресенья. Сколько осталось — здесь.",
          cupS: "Откуда у каждого факультета баллы: состязания, Шоколадная лягушка, фильмы, шахматы, друзья. Здесь видно, какой путь приносит факультету больше всего.",
          cupY: "Это ваш вклад: баллы за эту неделю и ваше место внутри факультета. Ниже — сколько даёт каждый способ и сколько вы уже получили. В конце недели — 1 галлеон за каждые 10 баллов.",
          cupX: "Теперь разберём один из способов набирать баллы. Нажмите «Назад».",
          sq: "Ещё один способ набирать баллы — Шоколадная лягушка. Каждый день новая коробка. Заглянем внутрь — нажмите на карточку.",
          vNav: "Сегодня — самые простые задания. Давайте выполним их вместе: в каждом я покажу дорогу.",
          vRow: "«%s» — нажмите на это задание.",
          v_daily: "Сегодняшнее состязание по истории магии — нажмите «Начать».",
          v_chat: "Напишите приветствие однокурсникам и отправьте.", v_chatB: "Напишите сообщение",
          v_dars1: "Например, Заклинания — урок профессора Флитвика. Нажмите.",
          v_dars2: "Нажмите на следующий урок — пройдёте его, и задание выполнено.",
          v_kitob1: "Это книжная полка. Первая книга бесплатна, и она уже выбрана.",
          v_kitob2: "Нажмите «Открыть».",
          v_kitob3: "Нажмите «Читать» — как только книга откроется, задание выполнено.",
          v_music1: "Это альбомы саундтреков. Первый бесплатный — нажмите на него.",
          v_music2: "Нажмите кнопку воспроизведения.",
          vDone: "Браво! «%s» — выполнено. Возвращаемся к лягушке — за следующим.",
          vOpen: "Всё выполнено! Теперь откройте коробку.",
          vEslat: "Продолжим задания лягушки — нажмите на карточку.",
          sq1: "Сегодняшняя карточка пока тайна: кто из знаменитых волшебников на ней, узнаете, только открыв коробку — Дамблдор, Мерлин, Фламель…",
          sq2: "Шесть заданий на сегодня: лёгкие, средние и трудные. Выполненные отмечаются; нажмите на задание — оно приведёт куда нужно.",
          sq3: "Когда все шесть выполнены, загорится эта кнопка — откройте коробку: факультету +%b баллов, вам %g галлеон и карточка волшебника.",
          sq4: "Открытые карточки попадают в вашу коллекцию — всего %n волшебников. Соберёте всех?",
          sq5: "Серия: открываете коробку каждый день — счёт растёт, каждый %k-й день ещё +%g галлеона. Пропустите день — начнётся заново.",
          sq6: "Лягушка — ещё и одно из условий перехода на 3-й курс. Вернёмся и посмотрим условия — нажмите «Назад».",
          ks0: "Для перехода на 3-й курс три условия. Выполненное становится зелёным.",
          ks1: "Первое — по 9 уроков по каждому предмету. По значкам ниже видно, где вы в каждом предмете.",
          ks2: "Второе — одна карточка Шоколадной лягушки: выполните шесть заданий дня и откройте коробку.",
          ks3: "Третье — хотя бы одно состязание по каждому из девяти предметов. Нажмите на строку — она приведёт куда нужно. Удачи!",
          kurs: "Здесь условия перехода на следующий курс. Выполненное становится зелёным, нажмите на строку — она приведёт куда нужно.",
          pat: "Вызовите и своего Патронуса — он определяется один раз и остаётся в профиле.",
          dost: "Приглашайте друзей — за каждого пришедшего друга ваш факультет получает баллы.",
          bell: "Главный способ набирать баллы — Состязания. Каждый день по одному в каждом предмете: кто быстрее и без ошибок, тот получает больше (1-е место +15). Нажмите «Состязание».",
          bhero: "Наверху — ваш итог за сегодня: в скольких состязаниях вы участвовали и сколько баллов ожидается по вашим текущим местам. День закрывается в полночь.",
          blist: "Вот сегодняшние состязания — по одному в каждом предмете. Нажмите на первое и попробуйте!",
          bh: "Это сегодняшнее состязание: задание у всех одинаковое. День закрывается в полночь — сколько осталось, видно здесь.",
          bpz: "В конце дня баллы по местам: 1-е место +%1, 2-е +%2, 3-е +%3, 4–10-е +%4. Эти баллы идут вашему факультету.",
          bme: "Это ваш результат. В день три попытки, засчитывается лучшая. Время идёт с нажатия «Начать», каждая ошибка добавляет время.",
          btop: "Ниже — лидеры дня: кто быстрее, тот выше.",
          bgo: "Теперь попробуйте сами — нажмите «Начать». Удачи!",
          eslat: "Вы ещё не участвовали ни в одном состязании. Чтобы принести баллы факультету, пройдите одно — нажмите «Состязание».",
          blist2: "Выберите любой предмет.",
          tug1: "Браво, ваше первое состязание! Это ваш результат и текущее место. До конца дня участвуют и другие, место может измениться. Хотите улучшить — осталось ещё две попытки.",
          tug2: "Теперь вернёмся к таблице — нажмите кнопку.",
          tug3: "Перейдём к другим предметам — нажмите «Назад».",
          tug4: "Точно так же участвуйте в состязаниях по остальным предметам: каждое приносит факультету свои баллы. Состязания обновляются каждый день.",
          rek: "Рекорды — в каждом предмете: кто дальше пройдёт без ошибок. Каждую полночь первая тройка получает баллы.",
          qoriq: "Заповедник — ваши существа с уроков ухода за ними. Покупайте корм за галлеоны: они растут и помогают на уроках.",
          issiq: "Теплица — семена с уроков травологии. Поливайте каждый день бесплатно; зрелое растение даёт корм существам.",
          kurs3: "4-й курс — старший. Условия здесь.",
          duel: "Дуэль — сражение рисованием заклинаний. Турнир каждое воскресенье в 22:00, а с компьютерными соперниками можно тренироваться всегда.",
          chess: "Волшебные шахматы — турнир каждую среду в 22:00. Друга можно позвать на партию из чата.",
          vik: "Викторина «Последний волшебник» — каждую пятницу в 22:00. Ошибся — выбыл, последний оставшийся — победитель.",
          jd: "Расписание недели: в какой день какой турнир — здесь. Удачи, волшебник!",
          jd0: "Теперь вам открыты турниры. Расписание недели: в какой день какой турнир — здесь." },
    en: { cup: "This is the House Cup: the four houses compete for points all week. Let's look inside — tap the card.",
          cupG: "Each hourglass is one house. The more points, the fuller the glass. On Sunday at 23:59 the house with the most points wins the cup.",
          cupT: "A season is one week: Monday to Sunday midnight. How much time is left — right here.",
          cupS: "Where each house's points come from: contests, the Chocolate Frog, films, chess, friends. You can see which way brings the house the most.",
          cupY: "This is your contribution: your points this week and your place within your house. Below — how much each way gives and how much you have earned from it. At week's end, 1 galleon for every 10 points.",
          cupX: "Now let's look at one of the ways to earn points. Tap “Back”.",
          sq: "Another way to earn points — the Chocolate Frog. A new box every day. Let's look inside — tap the card.",
          vNav: "Today — the simplest tasks. Let's do them together: I'll show the way in each one.",
          vRow: "“%s” — tap this task.",
          v_daily: "Today's History of Magic contest — press Start.",
          v_chat: "Write a hello to your housemates and send it.", v_chatB: "Write a message",
          v_dars1: "For example, Charms — Professor Flitwick's class. Tap it.",
          v_dars2: "Tap the next lesson — pass it and the task is done.",
          v_kitob1: "This is the bookshelf. The first book is free, and it is already selected.",
          v_kitob2: "Tap “Open”.",
          v_kitob3: "Tap “Read” — as soon as the book opens, the task is done.",
          v_music1: "These are the soundtrack albums. The first one is free — tap it.",
          v_music2: "Tap the play button.",
          vDone: "Well done! “%s” is complete. Back to the frog — on to the next one.",
          vOpen: "All done! Now open the box.",
          vEslat: "Let's continue the frog tasks — tap the card.",
          sq1: "Today's card is still a secret: you find out which famous wizard it is only when you open the box — Dumbledore, Merlin, Flamel…",
          sq2: "Today's six tasks: easy, medium and hard. Done ones are ticked; tap a task and it takes you there.",
          sq3: "When all six are done this button lights up — open the box: +%b points for your house, %g galleon for you and a wizard card.",
          sq4: "Opened cards go into your collection — %n wizards in all. Can you collect them all?",
          sq5: "Streak: open the box every day and the count grows — every %kth day brings +%g extra galleons. Miss a day and it starts over.",
          sq6: "The Frog is also one of the conditions for year 3. Let's go back and see them — tap “Back”.",
          ks0: "There are three conditions for year 3. Done ones turn green.",
          ks1: "First — 9 lessons in every subject. The icons below show where you are in each.",
          ks2: "Second — one Chocolate Frog card: finish the day's six tasks and open the box.",
          ks3: "Third — at least one contest in each of the nine subjects. Tap a row and it takes you there. Good luck!",
          kurs: "Here are the conditions for the next year. Done ones turn green; tap a row and it takes you there.",
          pat: "Summon your Patronus too — it is revealed once and stays on your profile.",
          dost: "Invite your friends — your house earns points for every friend who joins.",
          bell: "The main way to earn points is Contests. One every day in every subject: the fastest without mistakes earns the most (1st place +15). Tap “Contest”.",
          bhero: "At the top is your day so far: how many contests you entered and how many points your current places would earn. The day closes at midnight.",
          blist: "Here are today's contests — one per subject. Tap the first one and give it a try!",
          bh: "This is today's contest: everyone gets the same task. The day closes at midnight — the time left is shown here.",
          bpz: "At the end of the day points go by place: 1st +%1, 2nd +%2, 3rd +%3, 4th–10th +%4. These points go to your house.",
          bme: "This is your result. You have three tries a day; the best counts. The clock starts when you press Start, each mistake adds time.",
          btop: "Below — today's leaders: the fastest are on top.",
          bgo: "Now it's your turn — press Start. Good luck!",
          eslat: "You have not entered a contest yet. To bring points to your house, finish one — tap “Contest”.",
          blist2: "Pick any subject.",
          tug1: "Well done, your first contest! This is your result and your current place. Others will play until the end of the day, so your place may change. Want to improve? You have two more tries.",
          tug2: "Now back to the table — tap the button.",
          tug3: "On to other subjects — tap “Back”.",
          tug4: "In the same way, enter the contests in the other subjects: each one brings your house its own points. Contests refresh every day.",
          rek: "Records — in every subject, who goes furthest without a mistake. Every midnight the top three earn points.",
          qoriq: "The Reserve — creatures from your Care of Magical Creatures lessons. Buy food with galleons; they grow and help in lessons.",
          issiq: "The Greenhouse — seeds from Herbology lessons. Water them free every day; a grown plant gives food for your creatures.",
          kurs3: "Year 4 is the top year. Its conditions are here.",
          duel: "Duel — you fight by drawing spells. A tournament every Sunday at 22:00; practise against computer rivals any time.",
          chess: "Wizard chess — a tournament every Wednesday at 22:00. You can also challenge a friend from the chat.",
          vik: "The “Last Wizard” quiz — every Friday at 22:00. One mistake and you are out; the last one standing wins.",
          jd: "The weekly schedule: which tournament on which day — all here. Good luck, wizard!",
          jd0: "Tournaments are open to you now. The weekly schedule: which tournament on which day — all here." }
  };
  function kyT(k) { return (KY_TX[lang] || KY_TX.uz)[k] || ""; }
  /* IKKI QISM (egasi, 2026-10-11: «birdaniga ko'p narsa tushuntirildi, esdan chiqadi»): 1-qism - tabrikdan keyin darhol,
     2-qism - keyingi safar bosh sahifa ochilganda (2-kursda: birinchi bellashuvdan keyin; yoki 1-qismdan KY_KEYIN o'tgach).
     Tartib: avval kubok («nima uchun» - fakultet uchun ball), keyin bellashuv («qanday»); qurbaqa - keyinroq. */
  var KY_KEYIN = 20 * 60 * 1000;
  function kyQism(n, b) {
    var tile = function (k) { return yqQ('#scr-hub .hx[data-k="' + k + '"]'); };
    var Q = {
      // 2-kurs: kubok kartasi -> kubok sahifasining ICHI (qum soatlar, muddat, ball manbalari, o'z hissasi) -> ortga ->
      // «ball yig'ish usullaridan biri» - Bellashuv (egasi, 2026-10-11: «sayoz bo'lib qolibdi»). Qurbaqa kartasi bu paytda yashirin (kySq).
      2: [[{ el: yqQ("#hub-cup"), m: kyT("cup"), tap: true },
           { el: yqQ("#scr-cup #cup-glasses"), m: kyT("cupG"), bet: 1 },
           { el: yqQ("#scr-cup .cup-head"), m: kyT("cupT"), bet: 1 },
           { el: yqQ("#scr-cup #cup-src"), m: kyT("cupS"), bet: 1 },
           { el: yqQ("#scr-cup #cup-you"), m: kyT("cupY"), bet: 1 },
           { el: yqQ("#scr-cup #cup-back"), m: kyT("cupX"), tap: true, bet: 1 },
           { el: tile("bell"), m: kyT("bell"), tap: true, bet: 1 },
           { el: yqQ("#scr-blh #blh-hero"), m: kyT("bhero"), bet: 1 },
           { el: yqQ("#scr-blh #blh-list > *"), m: kyT("blist"), tap: true, bet: 1 }].concat(kyBell()),
          kySqQ()],
      3: [[{ el: tile("qoriq"), m: kyT("qoriq") },
           { el: tile("issiq"), m: kyT("issiq") }],
          [{ el: tile("rek"), m: kyT("rek") },
           { el: yqQ("#hub-pat"), m: kyT("pat") },
           { el: yqQ("#hub-kurs .hub-kurs-q"), m: kyT("kurs3") }]],
      4: [[{ el: yqQ("#hub-jd"), m: kyT("jd0") },
           { el: tile("duel"), m: kyT("duel") }],
          [{ el: tile("chess"), m: kyT("chess") },
           { el: tile("vik"), m: kyT("vik") },
           { el: yqQ("#scr-hub .hub-dost"), m: kyT("dost") }]]
    };
    return (Q[n] && Q[n][b]) || [];
  }
  /* Fan bellashuvi sahifasining ichida (egasi, 2026-10-11): bugungi topshiriq, o'rinlar bo'yicha ball, urinishlar va qoida,
     peshqadamlar - va oxirida «Boshlash»ni o'zi bosadi (bir bellashuvda qatnashishga majbur; «ortga» bu qadamda bosilmaydi). */
  function kyBell() {
    var pz = null;
    try { DR_FANLAR.some(function (f) { var c = drData && drData[f.id] && drData[f.id].contest; if (c && c.prizes) { pz = c.prizes; } return !!pz; }); } catch (e) {}
    var t = (pz && pz.top) || [15, 10, 7], o = (pz && pz.ten) || 3;
    return [{ el: yqQ("#scr-bell .bl-hero"), m: kyT("bh"), bet: 1 },
            { el: yqQ("#scr-bell #bl-prizes"), m: kyT("bpz").replace("%1", t[0]).replace("%2", t[1]).replace("%3", t[2]).replace("%4", o), bet: 1 },
            { el: yqQ("#scr-bell #bl-me"), m: kyT("bme"), bet: 1 },
            { el: yqQ("#scr-bell #bl-top-t"), m: kyT("btop"), bet: 1 },
            { el: yqQ("#scr-bell #bl-go"), m: kyT("bgo"), tap: true, bet: 1 }];
  }
  // Hali birorta bellashuvni tugatmagan bo'lsa (2-kurs, yo'riqnomaning 1-qismidan keyin) - bosh sahifa ochilganda yana bellashuvga yo'llaydi
  var kyEslat = 0;
  function kyBellBor() {
    if (drKurs && (drKurs.bellf || 0) >= 1) { return true; }
    try { return DR_FANLAR.some(function (f) { var c = drData && drData[f.id] && drData[f.id].contest; return !!(c && c.ms); }); } catch (e) { return false; }
  }
  function yqBellEslat() {
    if (yq || kursN() !== 2 || !kyBor("hp_kyq_2") || kyBellBor() || Date.now() - kyEslat < 3 * 60 * 1000) { return false; }
    kyEslat = Date.now();
    return kyOch([{ el: yqQ('#scr-hub .hx[data-k="bell"]'), m: kyT("eslat"), tap: true },
                  { el: yqQ("#scr-blh #blh-list > .dr-card:not(.done)"), m: kyT("blist2"), tap: true, bet: 1 },
                  { el: yqQ("#scr-bell #bl-go"), m: kyT("bgo"), tap: true, bet: 1 }]);
  }
  /* Birinchi bellashuv tugagach (egasi, 2026-10-11): sardor natijani tushuntiradi va «shu tartibda boshqa bellashuvlarda ham
     qatnashing» deb ro'yxatga olib boradi. 2-kursda, yo'riqnomaning 1-qismidan keyin, bir marta (hp_kyq_2r). */
  function kyBellTugadi(box) {
    if (yq || kursN() !== 2 || !kyBor("hp_kyq_2") || kyBor("hp_kyq_2r")) { return; }
    kyQoy("hp_kyq_2r", "1");
    setTimeout(function () {
      kyOch([{ el: function () { return box && box.getClientRects().length ? box : null; }, m: kyT("tug1") },
             { el: function () { return box ? box.querySelector(".dr-btn") : null; }, m: kyT("tug2"), tap: true },
             { el: yqQ("#scr-bell #bl-back"), m: kyT("tug3"), tap: true, bet: 1 },
             { el: yqQ("#scr-blh #blh-list"), m: kyT("tug4"), bet: 1 }]);
    }, 900);
  }
  /* 2-kursning 2-qismi (egasi, 2026-10-11: «qurbaqa ham chuqurroq»): qurbaqa kartasi -> Shokolad qurbaqa sahifasining ICHI
     (sir kartochka, oltita topshiriq, quti va mukofot, kolleksiya, ketma-ketlik) -> ortga -> 3-kursning uchta sharti bittadan. */
  function kySqQ() {
    var pz = { ball: 10, gal: 1, big_every: 7, big_gal: 3 }, jami = 24, bir = false;
    try { bir = !!(sqData && sqData.first && !sqData.opened); } catch (e) {}
    try { if (sqData) { pz = sqData.prizes || pz; jami = sqData.cards_total || (QB_ORDER && QB_ORDER.length) || jami; } } catch (e) {}
    return [{ el: yqQ("#hub-sq"), m: kyT("sq"), tap: true },
            { el: yqQ("#scr-sq #sq-card"), m: kyT("sq1"), bet: 1 },
            { el: yqQ("#scr-sq #sq-tasks"), m: kyT("sq2"), bet: 1 },
            { el: yqQ("#scr-sq #sq-open"), m: kyT("sq3").replace("%b", pz.ball).replace("%g", pz.gal), bet: 1 },
            { el: yqQ("#scr-sq #sq-coll"), m: kyT("sq4").replace("%n", jami), bet: 1 },
            { el: yqQ("#scr-sq .sq-str"), m: kyT("sq5").replace("%k", pz.big_every).replace("%g", pz.big_gal), bet: 1 }]
      .concat(bir ? [{ el: yqQ("#scr-sq #sq-tasks"), m: kyT("vNav"), bet: 1, on: function () { kyQoy("hp_kyq_2v", "1"); } }] : kyOxir());
  }
  // Qurbaqadan keyin: ortga -> 3-kursning uchta sharti bittadan (kurs kartasi shu yerda effekt bilan ochiladi)
  function kyOxir() {
    var shart = function (i) { return function () { return document.querySelectorAll("#hub-kurs .hub-kurs-s")[i] || null; }; };
    return [{ el: yqQ("#scr-sq #sq-back"), m: kyT("sq6"), tap: true, bet: 1 },
            { el: yqQ("#hub-kurs .hub-kurs-q"), m: kyT("ks0"), bet: 1,
              on: function () { kyQoy("hp_kyq_2k", "1"); kySq(); kyChiq("chiqk"); } },
            { el: shart(0), m: kyT("ks1"), bet: 1 },
            { el: shart(1), m: kyT("ks2"), bet: 1 },
            { el: shart(2), m: kyT("ks3"), bet: 1 }];
  }

  /* BIRINCHI KUN TOPSHIRIQLARI YO'RIQNOMA BILAN (egasi, 2026-10-11: «eng sodda ishlar; har biri yo'riqnoma orqali bajartirilsin»).
     Server birinchi qutigacha sodda ro'yxat beradi (hpsandiq.BIRINCHI, sqData.first). Rejim hp_kyq_2v (2-qismda yoqiladi) dan
     hp_kyq_2z gacha: qurbaqa sahifasi ochilganda (sqOpen) navbatdagi bajarilmagan topshiriq yo'riqnomasi; topshiriq bajarilganda
     (sqDone yoki bellashuv tugashi) - «bajarildi» va qurbaqaga qaytish; hammasi bajarilsa - «Qutini ochish»; quti ochilgach - kyOxir. */
  function kyVaz() { return !!kyBor("hp_kyq_2v") && !kyBor("hp_kyq_2z"); }
  function kyQator(code) { return yqQ('#scr-sq #sq-tasks .sq-task[data-k="' + code + '"]'); }
  function kyVazNomi(code) {
    try { var t = (sqData.tasks || []).filter(function (q) { return q.code === code; })[0]; return (sqMatn(t) || [code])[0]; } catch (e) { return code; }
  }
  function kyVazQ(code) {
    var q = [{ el: kyQator(code), m: kyT("vRow").replace("%s", kyVazNomi(code)), tap: true }];
    if (code === "daily") { q.push({ el: yqQ("#scr-bell #bl-go"), m: kyT("v_daily"), tap: true, bet: 1 }); }
    else if (code === "chat") { q.push({ el: yqQ("#scr-chat #chat-form"), m: kyT("v_chat"), kut: "chat", b: kyT("v_chatB"), bet: 1 }); }
    else if (code === "dars") { q.push({ el: function () { return document.querySelector('#scr-dars .dr-card[data-fan="afsun"]') || document.querySelector("#scr-dars .dr-card"); },
                                         m: kyT("v_dars1"), tap: true, bet: 1 },
                                       { el: yqQ("#scr-fan .fn-l.now"), m: kyT("v_dars2"), tap: true, bet: 1 }); }
    else if (code === "kitob") { q.push({ el: yqQ("#scr-cat .kt-shelf"), m: kyT("v_kitob1"), bet: 1 },
                                        { el: yqQ("#scr-cat .kt-info .kt-go"), m: kyT("v_kitob2"), tap: true, bet: 1 },
                                        { el: yqQ("#scr-kitob #kt-acts button"), m: kyT("v_kitob3"), tap: true, bet: 1 }); }
    else if (code === "music") { q.push({ el: yqQ("#scr-cat .ms-row .ms-card:not(.lock)"), m: kyT("v_music1"), tap: true, bet: 1 },
                                        { el: yqQ("#scr-album #ms-play"), m: kyT("v_music2"), tap: true, bet: 1 }); }
    return q;                                       // «house» - qatorni bosishning o'zi yetarli (sahifa ochilganda bajariladi)
  }
  function kySqQayt() {
    try { if (!$("scr-oqish").classList.contains("hidden")) { krClose(); } } catch (e) {}
    [].forEach.call(document.querySelectorAll(".screen"), function (e) { e.classList.add("hidden"); });
    try { sqOpen(); } catch (e) {}
  }
  // Qurbaqa sahifasi ochilganda: navbatdagi ish
  function kyVazNavbat() {
    if (yq || !kyVaz() || !sqData || $("scr-sq").classList.contains("hidden")) { return; }
    var d = sqData;
    if (d.opened) { kyQoy("hp_kyq_2z", "1"); kyOch(kyOxir()); return; }
    if (d.can_open) { kyOch([{ el: yqQ("#scr-sq #sq-open"), m: kyT("vOpen"), tap: true }]); return; }
    var t = (d.tasks || []).filter(function (q) { return !q.done; })[0];
    if (t) { kyOch(kyVazQ(t.code)); }
  }
  // Topshiriq bajarildi (sqDone / bellashuv tugashi): maqtov va qurbaqaga qaytish
  function kyVazTugadi(code) {
    if (!kyVaz()) { return; }
    var k = 0;
    (function och() {
      if (yq) { if (k++ < 40) { setTimeout(och, 300); } return; }
      var el = function () {
        var s0 = [".screen:not(.hidden) .dr-res:not(.hidden)", "#scr-oqish:not(.hidden) .kr-top", "#scr-album:not(.hidden) #ms-play",
                  "#scr-house:not(.hidden) #house-hero", "#scr-chat:not(.hidden) #chat-form", ".screen:not(.hidden) .kb-hdr", ".screen:not(.hidden) .cup-hdr",
                  "#scr-cat:not(.hidden) .cat-head", ".screen:not(.hidden) .hub-head"];
        for (var i = 0; i < s0.length; i++) { var e = document.querySelector(s0[i]); if (e && e.getClientRects().length) { return e; } }
        return null;
      };
      kyOch([{ el: el, m: kyT("vDone").replace("%s", kyVazNomi(code)), bet: 1 }], kySqQayt);      // joy topilmasa ham qurbaqaga qaytadi
    })();
  }
  function kyOch(q, tugash) {
    // hozir ko'rinmayotgan narsalar (Patronus olingan, jadval yashirin...) tashlab ketiladi; boshqa sahifadagi qadam (bet) qoladi
    q = q.filter(function (s) { if (s.bet) { return true; } var e = s.el(); return e && e.getClientRects().length; });
    if (!q.length) { return false; }
    var uy = cupMe().house || house;
    yqOch(q, { kim: yqT("kim").replace("%s", syT("ism_" + uy)), rasm: "img/sardor/" + (validHouse(uy) || "gryffindor") + ".webp", tugash: tugash || null });
    return true;
  }
  function kyBor(k) { try { return window.localStorage.getItem(TK(k)); } catch (e) { return "x"; } }
  function kyQoy(k, v) { try { window.localStorage.setItem(TK(k), v); } catch (e) {} }
  /* 2-kursda (egasi, 2026-10-11): qurbaqa kartasi - 2-qism boshlanguncha, KURS KARTASI (3-kurs vazifalari) - 2-qism unga
     yetguncha yashirin. Tabrik ochilgan zahoti boshlanadi (hp_kyq_2t). renderHub ham chaqiradi. Ochilganda - effekt bilan (kyChiq). */
  var KY_KUT = 2000;                                  // yo'riqnoma sahifa ochilgandan shuncha keyin boshlanadi (egasi: «birdaniga emas»)
  function kySq() {
    var h = $("scr-hub");
    if (!h) { return; }
    var ikki = kursN() === 2 && !!(kyBor("hp_kyq_2t") || kyBor("hp_kyq_2"));
    h.classList.toggle("sq-yop", ikki && !kyBor("hp_kyq_2b"));
    h.classList.toggle("kurs-yop", ikki && !kyBor("hp_kyq_2k"));
  }
  // Yangi ochilgan narsa effekt bilan paydo bo'ladi: sahifaga vaqtincha klass (renderHub qayta chizsa ham ishlaydi)
  function kyChiq(cls, ms) {
    var h = $("scr-hub");
    if (!h) { return; }
    h.classList.remove(cls); void h.offsetWidth; h.classList.add(cls);
    setTimeout(function () { h.classList.remove(cls); }, ms || 2600);
  }
  // Kurs tabrigi ochilganda: yangi xonalar tabrik yopilguncha ko'rinmaydi (kutN), yopilgach effekt bilan chiqadi (chiqN)
  var kyTabrikda = false;                             // tabrik ochiq yoki yo'riqnoma kutilmoqda - bosh sahifa taymeri aralashmaydi
  function kyTabrikOchildi(n) {
    kyTabrikda = true;
    kyQoy("hp_kyq_" + n + "t", "1");
    kySq();
    var h = $("scr-hub");
    if (h) { h.classList.add("kut" + n); }
  }
  // Tabrik yopilgach (egasi, 2026-10-11): 2 s kutiladi -> yangi xonalar effekt bilan paydo bo'ladi -> ular chiqib bo'lgach yo'riqnoma
  function kyTabrikYopildi(n) {
    setTimeout(function () {
      var h = $("scr-hub");
      if (h) { h.classList.remove("kut" + n); }
      kyChiq("chiq" + n);
      setTimeout(function () { kyTabrikda = false; try { yqKurs(n); } catch (e) {} }, 1600);
    }, KY_KUT);
  }
  // 1-qism: kurs tabrigi yopilgach
  function yqKurs(n) {
    if (yq || !hasHouse() || n < 2 || n > 4 || kyBor("hp_kyq_" + n)) { return; }
    if ($("scr-hub").classList.contains("hidden")) { return; }    // sahifadan chiqib ketgan - keyingi safar (yqKursDavom ochmaydi; tabrik qayta chiqmaydi)
    kyQoy("hp_kyq_" + n, String(Date.now()));
    kySq();
    kyOch(kyQism(n, 0));
  }
  // 2-qism: keyingi safar bosh sahifa ochilganda (openHub)
  function yqKursDavom() {
    if (yq || kyTabrikda || !hasHouse() || $("scr-hub").classList.contains("hidden")) { return; }
    if (yqBellEslat()) { return; }                  // avval - birinchi bellashuv (2-qism undan keyin)
    if (kyVaz() && Date.now() - kyEslat > 3 * 60 * 1000) {     // qurbaqa topshiriqlari chala qolgan - davom ettiramiz
      kyEslat = Date.now();
      kyOch([{ el: yqQ("#hub-sq"), m: kyT("vEslat"), tap: true }]);
      return;
    }
    var n = kursN(), t0 = parseInt(kyBor("hp_kyq_" + n) || "0", 10);
    if (n >= 2 && n <= 4 && !t0 && kyBor("hp_kyq_" + n + "t")) { yqKurs(n); return; }     // tabrik ko'rilgan, 1-qism boshlanmay qolgan
    if (n < 2 || n > 4 || !t0 || kyBor("hp_kyq_" + n + "b")) { return; }
    var vaqt = Date.now() - (t0 > 1 ? t0 : 0) >= KY_KEYIN, bell = n === 2 && kyBellBor();
    if (!vaqt && !bell) { return; }
    kyQoy("hp_kyq_" + n + "b", "1");
    kySq();                                          // qurbaqa kartasi endi ko'rinadi - effekt bilan, keyin 2-qism
    if (n === 2) { kyChiq("chiqsq"); }
    setTimeout(function () { if (!yq && !$("scr-hub").classList.contains("hidden")) { kyOch(kyQism(n, 1), n === 2 ? function () { setTimeout(kyVazNavbat, 900); } : null); } }, n === 2 ? 1300 : 0);
  }
