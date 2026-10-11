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
     nuqta - barmoq ishorasi joyi (funksiya -> [x, y], ekran koordinatasi).
     o = {kim: sarlavha, rasm: doiradagi rasm, kalit: tugaganda o'chiriladigan belgi (ixtiyoriy), tugash: funksiya (ixtiyoriy),
          ekran: sahifa id si - o'quvchi undan chiqib ketsa yo'riqnoma darhol yopiladi}. */
  function yqOch(qadamlar, o2) {
    if (yq) { return; }
    var o = document.createElement("div");
    o.className = "yq";
    o.innerHTML = '<div class="yq-teshik"></div><div class="yq-qol"><svg viewBox="0 0 24 24" fill="#fff" stroke="#10141a" stroke-width="1.1" stroke-linejoin="round"><path d="M9 11V4.5a1.5 1.5 0 0 1 3 0V10l5.2 1.1A2.3 2.3 0 0 1 19 13.4l-.6 4.3A3.8 3.8 0 0 1 14.6 21h-2.9a3.8 3.8 0 0 1-3-1.5L5.3 15a1.4 1.4 0 0 1 2.1-1.8L9 14.6z"/></svg></div><div class="yq-box"><div class="yq-bosh"><img class="yq-rasm" alt=""><div><b class="yq-kim"></b><p class="yq-m"></p></div></div>'
      + '<div class="yq-btm"><span class="yq-n"></span><button type="button" class="yq-nx"></button></div></div>';
    document.body.appendChild(o);
    yq = { i: 0, o: o, kut: 0, sur: -1, iv: 0, t0: 0, q: qadamlar, kalit: o2.kalit || "", tugash: o2.tugash || null, ekran: o2.ekran || "", onI: -1 };
    o.querySelector(".yq-rasm").src = o2.rasm;
    o.querySelector(".yq-kim").textContent = o2.kim;
    o.querySelector(".yq-nx").onclick = function () { yqKeyingi(); };
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
    o.querySelector(".yq-n").textContent = (yq.i + 1) + " / " + yq.q.length;
    var nx = o.querySelector(".yq-nx");
    // «O'tkazib yuborish» yo'q (egasi, 2026-10-11). Yozish qadamida odam tiqilib qolmasin: 40 soniyadan keyin «Keyingi» ochiladi.
    if (yq.t0i !== yq.i) { yq.t0i = yq.i; yq.t0 = Date.now(); }
    var ochiq = q.kut && Date.now() - yq.t0 > 40000;
    nx.textContent = q.tap ? yqT("bos") : q.kut && !ochiq ? (q.b || yqT("yoz")) : yqT("nx");
    nx.disabled = !!q.tap || (!!q.kut && !ochiq);
    // Bosiladigan joyga barmoq ishorasi
    var qol = o.querySelector(".yq-qol");
    qol.style.display = q.tap || q.kut ? "block" : "none";
    var nq = null;
    if (q.nuqta) { try { nq = q.nuqta(); } catch (x1) {} }
    qol.style.left = (nq ? nq[0] - 6 : r.left + r.width / 2 - 6) + "px";
    qol.style.top = (nq ? nq[1] : r.top + Math.min(r.height * 0.55, r.height - 14)) + "px";
    box.style.left = Math.max(12, Math.min(vw - box.offsetWidth - 12, r.left + r.width / 2 - box.offsetWidth / 2)) + "px";
    var past = r.bottom + p + 12, tepa = r.top - p - 12 - box.offsetHeight;
    // sig'masa (masalan, katta o'yin maydoni) - ko'proq joy qolgan tomonda, ekran chetida turadi
    box.style.top = (past + box.offsetHeight < vh - 8 ? past : tepa >= 8 ? tepa : vh - r.bottom > r.top ? vh - box.offsetHeight - 8 : 8) + "px";
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
          sq: "Shokolad qurbaqa: har kuni oltita topshiriq. Hammasini bajarsangiz quti ochiladi — 10 ball, 1 galleon va sehrgar kartochkasi.",
          kurs: "Bu yerda keyingi kursga o'tish shartlari. Bajarilgan shart yashil bo'ladi, qatorni bossangiz — o'sha joyga olib boradi.",
          pat: "Patronusingizni ham chaqirib ko'ring — u bir marta aniqlanadi va profilingizda turadi.",
          dost: "Do'stlaringizni taklif qiling — har bir kelgan do'st uchun fakultetingizga ball qo'shiladi.",
          bell: "Ball yig'ishning asosiy usuli — Bellashuv. Har kuni har fanda bitta bellashuv: kim tez va xatosiz bajarsa, o'sha ko'p ball oladi (1-o'ringa +15). «Bellashuv»ni bosing.",
          bhero: "Tepada — bugungi natijangiz: nechta bellashuvda qatnashdingiz va hozirgi o'rinlaringizga qarab bugun qancha ball kutilmoqda. Kun yarim tunda yopiladi.",
          blist: "Mana bugungi bellashuvlar — har fanda bittadan. Birinchisini bosib, sinab ko'ring!",
          rek: "Rekordlar — har fanda «xatosiz kim uzoqqa boradi». Har kuni yarim tunda birinchi uchlik ball oladi.",
          qoriq: "Qo'riqxona — Maxluqlar darslarida olingan maxluqlaringiz. Galleonga yemish olib boqasiz, ular o'sadi va darslarda yordam beradi.",
          issiq: "Issiqxona — O'simlikshunoslik darslaridan urug'lar. Har kuni bepul sug'orasiz; yetilgan o'simlik maxluqlarga yemish beradi.",
          kurs3: "4-kurs — eng yuqori kurs. Shartlari shu yerda.",
          duel: "Duel — afsun chizib bellashasiz. Har yakshanba 21:00 da turnir, kompyuter raqiblar bilan esa istalgan payt mashq qilsa bo'ladi.",
          chess: "Sehrgarlar shaxmati — har chorshanba 21:00 da turnir. Do'stingizni ham chatdan o'yinga chaqirsa bo'ladi.",
          vik: "«Oxirgi sehrgar» viktorinasi — har juma 21:00. Xato qilgan chiqadi, oxirigacha qolgan — g'olib.",
          jd: "Hafta jadvali: qaysi kuni qanday turnir — shu yerda. Omad, sehrgar!",
          jd0: "Endi siz turnirlarda qatnasha olasiz. Hafta jadvali: qaysi kuni qanday turnir — shu yerda." },
    ru: { cup: "Это Кубок школы: четыре факультета всю неделю соревнуются за баллы. Заглянем внутрь — нажмите на карточку.",
          cupG: "Каждые песочные часы — один факультет. Чем больше баллов, тем полнее часы. В воскресенье в 23:59 кубок получает факультет с наибольшим числом баллов.",
          cupT: "Сезон длится неделю: с понедельника до полуночи воскресенья. Сколько осталось — здесь.",
          cupS: "Откуда у каждого факультета баллы: состязания, Шоколадная лягушка, фильмы, шахматы, друзья. Здесь видно, какой путь приносит факультету больше всего.",
          cupY: "Это ваш вклад: баллы за эту неделю и ваше место внутри факультета. Ниже — сколько даёт каждый способ и сколько вы уже получили. В конце недели — 1 галлеон за каждые 10 баллов.",
          cupX: "Теперь разберём один из способов набирать баллы. Нажмите «Назад».",
          sq: "Шоколадная лягушка: каждый день шесть заданий. Выполните все — коробка откроется: 10 баллов, 1 галлеон и карточка волшебника.",
          kurs: "Здесь условия перехода на следующий курс. Выполненное становится зелёным, нажмите на строку — она приведёт куда нужно.",
          pat: "Вызовите и своего Патронуса — он определяется один раз и остаётся в профиле.",
          dost: "Приглашайте друзей — за каждого пришедшего друга ваш факультет получает баллы.",
          bell: "Главный способ набирать баллы — Состязания. Каждый день по одному в каждом предмете: кто быстрее и без ошибок, тот получает больше (1-е место +15). Нажмите «Состязание».",
          bhero: "Наверху — ваш итог за сегодня: в скольких состязаниях вы участвовали и сколько баллов ожидается по вашим текущим местам. День закрывается в полночь.",
          blist: "Вот сегодняшние состязания — по одному в каждом предмете. Нажмите на первое и попробуйте!",
          rek: "Рекорды — в каждом предмете: кто дальше пройдёт без ошибок. Каждую полночь первая тройка получает баллы.",
          qoriq: "Заповедник — ваши существа с уроков ухода за ними. Покупайте корм за галлеоны: они растут и помогают на уроках.",
          issiq: "Теплица — семена с уроков травологии. Поливайте каждый день бесплатно; зрелое растение даёт корм существам.",
          kurs3: "4-й курс — старший. Условия здесь.",
          duel: "Дуэль — сражение рисованием заклинаний. Турнир каждое воскресенье в 21:00, а с компьютерными соперниками можно тренироваться всегда.",
          chess: "Волшебные шахматы — турнир каждую среду в 21:00. Друга можно позвать на партию из чата.",
          vik: "Викторина «Последний волшебник» — каждую пятницу в 21:00. Ошибся — выбыл, последний оставшийся — победитель.",
          jd: "Расписание недели: в какой день какой турнир — здесь. Удачи, волшебник!",
          jd0: "Теперь вам открыты турниры. Расписание недели: в какой день какой турнир — здесь." },
    en: { cup: "This is the House Cup: the four houses compete for points all week. Let's look inside — tap the card.",
          cupG: "Each hourglass is one house. The more points, the fuller the glass. On Sunday at 23:59 the house with the most points wins the cup.",
          cupT: "A season is one week: Monday to Sunday midnight. How much time is left — right here.",
          cupS: "Where each house's points come from: contests, the Chocolate Frog, films, chess, friends. You can see which way brings the house the most.",
          cupY: "This is your contribution: your points this week and your place within your house. Below — how much each way gives and how much you have earned from it. At week's end, 1 galleon for every 10 points.",
          cupX: "Now let's look at one of the ways to earn points. Tap “Back”.",
          sq: "Chocolate Frog: six tasks every day. Finish them all and the box opens — 10 points, 1 galleon and a wizard card.",
          kurs: "Here are the conditions for the next year. Done ones turn green; tap a row and it takes you there.",
          pat: "Summon your Patronus too — it is revealed once and stays on your profile.",
          dost: "Invite your friends — your house earns points for every friend who joins.",
          bell: "The main way to earn points is Contests. One every day in every subject: the fastest without mistakes earns the most (1st place +15). Tap “Contest”.",
          bhero: "At the top is your day so far: how many contests you entered and how many points your current places would earn. The day closes at midnight.",
          blist: "Here are today's contests — one per subject. Tap the first one and give it a try!",
          rek: "Records — in every subject, who goes furthest without a mistake. Every midnight the top three earn points.",
          qoriq: "The Reserve — creatures from your Care of Magical Creatures lessons. Buy food with galleons; they grow and help in lessons.",
          issiq: "The Greenhouse — seeds from Herbology lessons. Water them free every day; a grown plant gives food for your creatures.",
          kurs3: "Year 4 is the top year. Its conditions are here.",
          duel: "Duel — you fight by drawing spells. A tournament every Sunday at 21:00; practise against computer rivals any time.",
          chess: "Wizard chess — a tournament every Wednesday at 21:00. You can also challenge a friend from the chat.",
          vik: "The “Last Wizard” quiz — every Friday at 21:00. One mistake and you are out; the last one standing wins.",
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
           { el: yqQ("#scr-blh #blh-list > *"), m: kyT("blist"), tap: true, bet: 1 }],
          [{ el: yqQ("#hub-sq"), m: kyT("sq") },
           { el: yqQ("#hub-kurs .hub-kurs-q"), m: kyT("kurs") }]],
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
  function kyOch(q) {
    // hozir ko'rinmayotgan narsalar (Patronus olingan, jadval yashirin...) tashlab ketiladi; boshqa sahifadagi qadam (bet) qoladi
    q = q.filter(function (s) { if (s.bet) { return true; } var e = s.el(); return e && e.getClientRects().length; });
    if (!q.length) { return false; }
    var uy = cupMe().house || house;
    yqOch(q, { kim: yqT("kim").replace("%s", syT("ism_" + uy)), rasm: "img/sardor/" + (validHouse(uy) || "gryffindor") + ".webp" });
    return true;
  }
  function kyBor(k) { try { return window.localStorage.getItem(TK(k)); } catch (e) { return "x"; } }
  function kyQoy(k, v) { try { window.localStorage.setItem(TK(k), v); } catch (e) {} }
  // 2-kursda qurbaqa kartasi yo'riqnomaning 1-qismidan 2-qismigacha yashirin (egasi: avval kubok va bellashuv) - renderHub ham chaqiradi
  function kySq() {
    var h = $("scr-hub");
    if (h) { h.classList.toggle("sq-yop", kursN() === 2 && !!kyBor("hp_kyq_2") && !kyBor("hp_kyq_2b")); }
  }
  // 1-qism: kurs tabrigi yopilgach
  function yqKurs(n) {
    if (yq || !hasHouse() || n < 2 || n > 4 || kyBor("hp_kyq_" + n)) { return; }
    kyQoy("hp_kyq_" + n, String(Date.now()));
    kySq();
    kyOch(kyQism(n, 0));
  }
  // 2-qism: keyingi safar bosh sahifa ochilganda (openHub)
  function yqKursDavom() {
    if (yq || !hasHouse() || $("scr-hub").classList.contains("hidden")) { return; }
    var n = kursN(), t0 = parseInt(kyBor("hp_kyq_" + n) || "0", 10);
    if (n < 2 || n > 4 || !t0 || kyBor("hp_kyq_" + n + "b")) { return; }
    var vaqt = Date.now() - (t0 > 1 ? t0 : 0) >= KY_KEYIN, bell = n === 2 && drKurs && (drKurs.bellf || 0) >= 1;
    if (!vaqt && !bell) { return; }
    kyQoy("hp_kyq_" + n + "b", "1");
    kySq();                                          // qurbaqa kartasi endi ko'rinadi - 2-qism shundan boshlanadi
    kyOch(kyQism(n, 1));
  }
