/* Saqlash (qurilma xotirasi) va Xogvarts kubogi ma'lumotlari
   Ilova kodi bir necha faylga bo'lingan; hammasi BIR umumiy maydonda ishlaydi
   va index.html dagi TARTIBDA yuklanadi. Yuklanish paytida keyingi fayldagi
   narsani chaqirmang - tekshiruv: tools/tartib.js */
"use strict";
  /* ---------- SAQLASH ---------- */

  function hasCloud() {
    try { return !!(tg && tg.CloudStorage && tg.isVersionAtLeast && tg.isVersionAtLeast("6.9")); }
    catch (e) { return false; }
  }

  function absorb(arr) {
    for (var i = 0; i < arr.length; i++) { if (arr[i]) { watched[arr[i]] = true; } }
  }

  function readLocal() {
    try { var raw = window.localStorage.getItem(KEY); return raw ? raw.split(",") : []; }
    catch (e) { return []; }
  }

  function writeLocal() {
    try { window.localStorage.setItem(KEY, list().join(",")); } catch (e) {}
  }

  function validLang(v) { return v === "uz" || v === "ru" || v === "en" ? v : null; }

  function readLocalLang() {
    try { return validLang(window.localStorage.getItem(LANG_KEY)); }
    catch (e) { return null; }
  }

  // Bot tilni allaqachon so'ragan va havolaga ?lang=uz qo'shib yuboradi.
  // Busiz ilova o'z til ekranini qaytadan ko'rsatardi va foydalanuvchi
  // tilni ikki marta tanlashiga to'g'ri kelardi.
  function urlLang() {
    try {
      var m = /(^|[?&])lang=(uz|ru|en)(&|$)/.exec(window.location.search || "");
      return m ? m[2] : null;
    } catch (e) { return null; }
  }

  function saveLang(code) {
    try { window.localStorage.setItem(LANG_KEY, code); } catch (e) {}
    if (!cloudOk) { return; }
    try { tg.CloudStorage.setItem(LANG_KEY, code, function () {}); } catch (e) {}
  }

  var API_PROFILE = "https://bot.tizimshunos.uz/api/profile";

  // Profil tanlovlarini serverga yuboradi (statistika uchun).
  // Xato bo'lsa jim o'tadi — foydalanuvchiga bilinmaydi.
  function report(kind, value) {
    var initData = "";
    try { initData = (tg && tg.initData) || ""; } catch (e) {}
    if (!initData || !window.fetch) { return; }

    try {
      window.fetch(API_PROFILE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind: kind, value: value, initData: initData })
      })["catch"](function () {});
    } catch (e) {}
  }

  /* ---------- XOGVARTS KUBOGI (2.0) ---------- */

  var API_LEADERBOARD = "https://bot.tizimshunos.uz/api/leaderboard";
  var API_TASKS = "https://bot.tizimshunos.uz/api/tasks";
  var API_SUBMIT_TASK = "https://bot.tizimshunos.uz/api/tasks/submit";
  var API_CHAT = "https://bot.tizimshunos.uz/api/chat";
  var API_SEND = "https://bot.tizimshunos.uz/api/send";
  var API_UNDO = "https://bot.tizimshunos.uz/api/undo";
  var HOUSE_ORDER = ["gryffindor", "slytherin", "hufflepuff", "ravenclaw"];
  var cupData = null;
  var cupBusy = false;
  var tasksData = null;
  var tasksBusy = false;
  var tasksLang = null;     // savollar qaysi tilda olingan (til almashsa qayta olinadi)

  // Reytingni serverdan oladi. report() kabi jim ishlaydi: xato bo'lsa
  // foydalanuvchi sezmaydi, tasma shunchaki ko'rinmaydi.
  function fetchCup(cb) {
    var initData = "";
    try { initData = (tg && tg.initData) || ""; } catch (e) {}
    if (!initData && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1" || window.location.protocol === "file:")) {
      cupData = {
        houses: [
          {house: "hufflepuff", total_points: 895, active_members: 15, qualified: true, by: {film: 365, daily: 290, chess: 200, friends: 40}},
          {house: "gryffindor", total_points: 675, active_members: 16, qualified: true, by: {film: 285, daily: 290, chess: 0, friends: 100}},
          {house: "slytherin", total_points: 500, active_members: 14, qualified: true, by: {film: 130, daily: 170, chess: 0, friends: 200}},
          {house: "ravenclaw", total_points: 270, active_members: 8, qualified: true, by: {film: 150, daily: 100, chess: 0, friends: 20}}
        ],
        // Mahalliy namuna: raqamlar 2026-10-04 dagi haqiqiy haftaga yaqin
        season: {prev_winner: "hufflepuff", ends_at: new Date(Date.now() + 3 * 864e5 + 5 * 36e5).toISOString()},
        // Sinov rejimida mahalliy sinov ham saralanmagan odamdan boshlanadi
        me: HP_TEST ? {house: null, can_resort: true} :
            {house: "gryffindor", can_resort: true, points: 75, max_points: 160, is_active: true, house_rank: 4,
             by: {film: 25, daily: 30, chess: 0, friends: 20}, caps: {film: 40, daily: 70, chess: 50}},
        hall: {
          total: 15, active: 12,
          members: [
            {name: "Harry", points: 300, me: true},
            {name: "Hermione", points: 250},
            {name: "Ron", points: 200},
            {name: "Neville", points: 150},
            {name: "Seamus", points: 100},
            {name: "Dean", points: 100},
            {name: "Parvati", points: 100},
            {name: "Lavender", points: 100},
            {name: "Colin", points: 100},
            {name: "Dennis", points: 50},
            {name: "Katie", points: 25},
            {name: "Cormac", points: 25}
          ]
        },
        feed: [
          {name: "Harry", house: "gryffindor", ago_minutes: 5},
          {name: "Draco", house: "slytherin", ago_minutes: 10},
          {name: "Luna", house: "ravenclaw", ago_minutes: 15},
          {name: "Cedric", house: "hufflepuff", ago_minutes: 20},
          {name: "Cho", house: "ravenclaw", ago_minutes: 25},
          {name: "Ginny", house: "gryffindor", ago_minutes: 30}
        ]
      };
      if (cb) { cb(cupData); }
      return;
    }
    if (!initData || !window.fetch || cupBusy) { if (cb) { cb(cupData); } return; }

    cupBusy = true;
    function done(d) {
      cupBusy = false;
      if (d && d.houses) { cupData = d; }
      if (cb) { cb(cupData); }
    }
    try {
      window.fetch(API_LEADERBOARD, {
        method: "GET",
        headers: { "X-Telegram-Init-Data": initData }
      }).then(function (r) { return r.ok ? r.json() : null; })
        .then(done)["catch"](function () { done(null); });
    } catch (e) { done(null); }
  }

  // Kubok ilova ochilganda bir marta yuklanardi: keyin film ko'rilsa, savolga javob berilsa
  // yoki shaxmatda yutilsa, ballar ilova qayta ochilmaguncha o'zgarmasdi. Endi 9¾ va kubok
  // ekrani ochilganda qayta so'raladi; cb faqat raqamlar o'zgargan bo'lsa chaqiriladi.
  function cupKalit(d) {
    if (!d || !d.houses) { return ""; }
    return JSON.stringify([d.houses.map(function (h) { return [h.house, h.total_points]; }),
                           d.me && d.me.points, d.me && d.me.house]);
  }
  function cupRefresh(cb) {
    var eski = cupKalit(cupData);
    fetchCup(function () { if (cupKalit(cupData) !== eski && cb) { cb(); } });
  }

  function fetchTasks(cb) {
    var initData = "";
    try { initData = (tg && tg.initData) || ""; } catch (e) {}
    if (!initData && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1" || window.location.protocol === "file:")) {
      tasksData = {
        tasks: [
          {
            id: "daily", type: "daily", title: "Kunlik savol",
            questions: [{id: 1, body: "Garri Potterning boyqushining ismi nima?", options: ["Hedwig", "Errol", "Pigwidgeon", "Crookshanks"]}]
          },
          {
            id: "quiz_hp1", type: "film_quiz", film_id: "hp1", title: "Garri Potter 1-qism imtihoni",
            questions: [
              {id: 2, body: "Hikmatlar toshini kim himoya qiladi?", options: ["Fluffy", "Norbert", "Fang", "Aragog"]}
            ]
          }
        ]
      };
      if (cb) { cb(tasksData); }
      return;
    }
    if (!initData || !window.fetch || tasksBusy) { if (cb) { cb(tasksData); } return; }

    tasksBusy = true;
    var asked = lang;
    function done(d) {
      tasksBusy = false;
      if (d && d.tasks) { tasksData = d; tasksLang = asked; }
      if (cb) { cb(tasksData); }
    }
    try {
      // Savollar ilova tilida (server tarjimasi bo'lmasa o'zbekcha qaytaradi)
      window.fetch(API_TASKS + "?lang=" + encodeURIComponent(asked), {
        method: "GET",
        headers: { "X-Telegram-Init-Data": initData }
      }).then(function (r) { return r.ok ? r.json() : null; })
        .then(done)["catch"](function () { done(null); });
    } catch (e) { done(null); }
  }
