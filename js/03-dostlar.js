/* Do'stlar reytingi
   Ilova kodi bir necha faylga bo'lingan; hammasi BIR umumiy maydonda ishlaydi
   va index.html dagi TARTIBDA yuklanadi. Yuklanish paytida keyingi fayldagi
   narsani chaqirmang - tekshiruv: tools/tartib.js */
"use strict";
  /* ---------- DO'STLAR REYTINGI ---------- */
  // Ma'lumot /api/referrals dan keladi. Daraja NOMLARI ham serverdan (bot
  // xabari bilan bir xil bo'lsin) - bu yerda faqat oyna matnlari.
  var API_REFERRALS = "https://bot.tizimshunos.uz/api/referrals";
  var refsData = null;
  var refsBusy = false;

  var REF_T = {
    uz: {
      kick: "Do'stlar reytingi", head: "Taklif qilganlar",
      rankLbl: "Sizning darajangiz",
      friends: "Do'stlar", place: "O'rin", cup: "Kubok bali",
      next: "Keyingi daraja — %s: yana %f", top: "Eng yuqori darajadasiz!",
      share: "Filmni do'stga ulashish", promo: "Kolleksiyani taklif qilish", topKick: "Eng ko'p do'st taklif qilganlar",
      empty: "Hali hech kim do'st taklif qilmagan. Birinchi bo'ling!", you: "siz",
      howTitle: "Qanday ishlaydi?",
      steps: [
        "Istalgan filmni do'stingizga ulashing — film ostidagi «Ulashish» tugmasi yoki yuqoridagi tugma orqali. Kartadagi havola sizniki, boshqa hech narsa qilish shart emas.",
        "Do'stingiz havolani bosib botga kiradi va kanalga obuna bo'ladi. O'sha filmni u darhol oladi.",
        "Shu zahoti sizga +1 do'st yoziladi, Xogvarts kubogida esa +%d ball. Bot sizga xabar yuboradi."
      ],
      rulesTitle: "Qoidalar",
      rules: [
        "Faqat botga birinchi marta kelgan odam hisoblanadi.",
        "Do'stingiz kanalga obuna bo'lmaguncha ball berilmaydi.",
        "Har bir do'st uchun ball faqat bir marta beriladi.",
        "Do'stingiz bir nechta havolani bossa, birinchi bosgani hisoblanadi.",
        "O'zingizni o'zingiz taklif qila olmaysiz."
      ],
      ratingTitle: "Reyting",
      rating: [
        "O'rin taklif qilingan do'stlar soniga qarab belgilanadi. Teng bo'lsa — shu songa birinchi yetgan yuqorida turadi.",
        "Do'stlar soni doimiy saqlanadi, haftalik mavsum bilan nolga tushmaydi. Kubok ballari esa o'sha haftaning musobaqasiga qo'shiladi.",
        "Fakultetga hali saralanmagan bo'lsangiz ham ball yoziladi — shu hafta ichida saralansangiz, u fakultetingiz hisobiga o'tadi."
      ],
      ranksTitle: "Darajalar",
      fr: function (n) { return n + " ta do'st"; }
    },
    ru: {
      kick: "Рейтинг друзей", head: "Пригласившие",
      rankLbl: "Ваш уровень",
      friends: "Друзья", place: "Место", cup: "Очки кубка",
      next: "Следующий уровень — %s: ещё %f", top: "У вас высший уровень!",
      share: "Поделиться фильмом с другом", promo: "Пригласить в коллекцию", topKick: "Больше всех пригласили",
      empty: "Пока никто не пригласил друзей. Будьте первым!", you: "вы",
      howTitle: "Как это работает?",
      steps: [
        "Поделитесь любым фильмом с другом — кнопкой «Поделиться» под фильмом или кнопкой выше. Ссылка в карточке ваша, больше ничего делать не нужно.",
        "Друг переходит по ссылке в бот и подписывается на канал. Этот фильм он получает сразу.",
        "В тот же момент вам засчитывается +1 друг, а в Кубке Хогвартса +%d очков. Бот пришлёт вам сообщение."
      ],
      rulesTitle: "Правила",
      rules: [
        "Считается только тот, кто пришёл в бот впервые.",
        "Пока друг не подписался на канал, очки не начисляются.",
        "За каждого друга очки начисляются только один раз.",
        "Если друг перешёл по нескольким ссылкам, засчитывается первая.",
        "Пригласить самого себя нельзя."
      ],
      ratingTitle: "Рейтинг",
      rating: [
        "Место зависит от числа приглашённых друзей. При равенстве выше тот, кто набрал это число раньше.",
        "Число друзей сохраняется навсегда и не обнуляется с недельным сезоном. Очки кубка идут в соревнование той недели.",
        "Даже если вы ещё не распределены на факультет, очки записываются — распределитесь на этой неделе, и они перейдут вашему факультету."
      ],
      ranksTitle: "Уровни",
      fr: function (n) {
        var a = n % 10, b = n % 100;
        var w = (a === 1 && b !== 11) ? "друг" : (a >= 2 && a <= 4 && (b < 12 || b > 14)) ? "друга" : "друзей";
        return n + " " + w;
      }
    },
    en: {
      kick: "Friends leaderboard", head: "Top inviters",
      rankLbl: "Your rank",
      friends: "Friends", place: "Place", cup: "Cup points",
      next: "Next rank — %s: %f more", top: "You have the highest rank!",
      share: "Share a film with a friend", promo: "Invite to the collection", topKick: "Most friends invited",
      empty: "Nobody has invited a friend yet. Be the first!", you: "you",
      howTitle: "How does it work?",
      steps: [
        "Share any film with a friend — with the “Share” button under the film or the button above. The link in the card is yours, nothing else to do.",
        "Your friend opens the bot through the link and subscribes to the channel. They get that film right away.",
        "At that moment you get +1 friend and +%d points in the Hogwarts Cup. The bot sends you a message."
      ],
      rulesTitle: "Rules",
      rules: [
        "Only people who open the bot for the first time count.",
        "No points until your friend subscribes to the channel.",
        "Each friend counts only once.",
        "If a friend opens several links, the first one counts.",
        "You can't invite yourself."
      ],
      ratingTitle: "Leaderboard",
      rating: [
        "Places depend on the number of friends invited. On a tie, whoever reached that number first ranks higher.",
        "Your friend count is kept forever and doesn't reset with the weekly season. Cup points go to that week's contest.",
        "Even if you haven't been sorted yet, points are recorded — get sorted this week and they go to your house."
      ],
      ranksTitle: "Ranks",
      fr: function (n) { return n + (n === 1 ? " friend" : " friends"); }
    }
  };

  function refT() { return REF_T[lang] || REF_T.uz; }

  function fetchRefs(cb) {
    var initData = "";
    try { initData = (tg && tg.initData) || ""; } catch (e) {}
    if (!initData && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1" || window.location.protocol === "file:")) {
      refsData = {
        ok: true, total: 14, pts_per_friend: 20,
        top: [
          {pos: 1, name: "Hermione", house: "gryffindor", refs: 23},
          {pos: 2, name: "Luna", house: "ravenclaw", refs: 11},
          {pos: 3, name: "Cedric", house: "hufflepuff", refs: 7},
          {pos: 4, name: "Draco", house: "slytherin", refs: 5},
          {pos: 5, name: "Neville", house: "gryffindor", refs: 4},
          {pos: 6, name: "Cho", house: "ravenclaw", refs: 3},
          {pos: 7, name: "Ginny", house: "gryffindor", refs: 3},
          {pos: 8, name: "Blaise", house: "slytherin", refs: 2},
          {pos: 9, name: "Hannah", house: "hufflepuff", refs: 2},
          {pos: 10, name: "Dean", house: "gryffindor", refs: 1}
        ],
        me: {refs: 1, place: 12, rank: "first_year", rank_name: "Birinchi kurs talabasi",
             next_need: 5, next_name: "Prefekt", cup_points: 20},
        ranks: [
          {need: 0, code: "muggle", name: "Maggl"}, {need: 1, code: "first_year", name: "Birinchi kurs talabasi"},
          {need: 5, code: "prefect", name: "Prefekt"}, {need: 10, code: "quidditch_captain", name: "Kvidich sardori"},
          {need: 20, code: "auror", name: "Auror"}, {need: 50, code: "great_wizard", name: "Buyuk sehrgar"}
        ]
      };
      if (cb) { cb(refsData); }
      return;
    }
    if (!initData || !window.fetch || refsBusy) { if (cb) { cb(refsData); } return; }
    refsBusy = true;
    function done(d) {
      refsBusy = false;
      if (d && d.ok) { refsData = d; }
      if (cb) { cb(refsData); }
    }
    try {
      window.fetch(API_REFERRALS + "?lang=" + encodeURIComponent(lang), {
        method: "GET",
        headers: { "X-Telegram-Init-Data": initData }
      }).then(function (r) { return r.ok ? r.json() : null; })
        .then(done)["catch"](function () { done(null); });
    } catch (e) { done(null); }
  }

  function renderRefsStrip() {
    var r = refT();
    $("refs-kicker").textContent = r.kick;
    $("refs-title").textContent = cupT().refsS;
    var me = refsData && refsData.me;
    if (me && me.refs > 0) {
      $("refs-count").textContent = r.fr(me.refs);
      $("refs-pill").classList.remove("hidden");
    } else {
      $("refs-pill").classList.add("hidden");
    }
  }

  function refsEl(tag, cls, text) {
    var el = document.createElement(tag);
    if (cls) { el.className = cls; }
    if (text !== undefined) { el.textContent = text; }
    return el;
  }

  function refsRow(m, t) {
    var row = refsEl("div", "hall-row");
    row.appendChild(refsEl("div", "hall-pos", String(m.pos)));
    row.appendChild(faceEl("hall-face", m.name, m.house));
    var who = refsEl("div", "hall-nm");
    who.appendChild(document.createTextNode(m.name || ""));
    if (m.me) {
      var tag = refsEl("i", "", t.you);
      tag.style.color = "var(--accent)";
      who.appendChild(tag);
    }
    row.appendChild(who);
    row.appendChild(refsEl("div", "hall-pts", String(m.refs || 0)));
    return row;
  }

  function renderRefs() {
    var t = refT();
    var d = refsData || {};
    var me = d.me || {refs: 0};
    var pts = d.pts_per_friend || 20;

    $("refs-back-txt").textContent = T[lang].cupBack;
    $("refs-kick").textContent = t.kick;
    $("refs-head").textContent = t.head;
    $("refs-share").textContent = t.share;
    $("refs-promo").textContent = t.promo;

    // --- sizning holatingiz
    var box = $("refs-me");
    box.innerHTML = "";
    box.appendChild(refsEl("div", "refs-lbl", t.rankLbl));
    box.appendChild(refsEl("div", "refs-rank", me.rank_name || ""));
    var nums = refsEl("div", "refs-nums");
    [[me.refs || 0, t.friends], [me.place ? me.place + (d.total ? " / " + d.total : "") : "—", t.place],
     [me.cup_points || 0, t.cup]].forEach(function (n) {
      var c = refsEl("div", "refs-num");
      c.appendChild(refsEl("b", "", String(n[0])));
      c.appendChild(refsEl("span", "", n[1]));
      nums.appendChild(c);
    });
    box.appendChild(nums);

    // Keyingi darajagacha qancha qolgani
    var ranks = d.ranks || [];
    var prev = 0;
    ranks.forEach(function (x) { if (x.need <= (me.refs || 0)) { prev = x.need; } });
    var bar = refsEl("div", "refs-bar");
    var fill = refsEl("i");
    if (me.next_need) {
      var pct = Math.round(((me.refs || 0) - prev) / Math.max(1, me.next_need - prev) * 100);
      fill.style.width = Math.max(4, Math.min(100, pct)) + "%";
    } else {
      fill.style.width = "100%";
    }
    bar.appendChild(fill);
    box.appendChild(bar);
    box.appendChild(refsEl("div", "refs-next", me.next_need
      ? t.next.replace("%s", me.next_name || "").replace("%f", t.fr(me.next_need - (me.refs || 0)))
      : t.top));

    // --- TOP 10 (+ o'z qatori, agar tashqarida bo'lsa)
    $("refs-top-kick").textContent = t.topKick;
    var list = $("refs-list");
    list.innerHTML = "";
    var top = d.top || [];
    if (!top.length) {
      list.appendChild(refsEl("div", "refs-empty", t.empty));
    }
    top.forEach(function (m) { list.appendChild(refsRow(m, t)); });
    if (me.place && me.place > top.length) {
      list.appendChild(refsEl("div", "refs-gap", "···"));
      var u = tgUser();
      list.appendChild(refsRow({pos: me.place, name: (u && u.first_name) || "—",
        house: cupMe().house, refs: me.refs, me: true}, t));
    }

    // --- qanday ishlaydi
    var info = $("refs-info");
    info.innerHTML = "";
    info.appendChild(refsEl("h3", "", t.howTitle));
    t.steps.forEach(function (txt, i) {
      var st = refsEl("div", "refs-step");
      st.appendChild(refsEl("b", "", String(i + 1)));
      st.appendChild(refsEl("p", "", txt.replace("%d", pts)));
      info.appendChild(st);
    });
    info.appendChild(refsEl("h4", "", t.rulesTitle));
    t.rules.forEach(function (txt) { info.appendChild(refsEl("p", "refs-rule", txt)); });
    info.appendChild(refsEl("h4", "", t.ratingTitle));
    t.rating.forEach(function (txt) { info.appendChild(refsEl("p", "refs-rule", txt)); });
    if (ranks.length) {
      info.appendChild(refsEl("h4", "", t.ranksTitle));
      ranks.forEach(function (x) {
        var lv = refsEl("div", "refs-lvl" + (x.code === me.rank ? " on" : ""));
        lv.appendChild(document.createTextNode(x.name));
        lv.appendChild(refsEl("span", "", t.fr(x.need)));
        info.appendChild(lv);
      });
    }
  }

  function openRefs() {
    renderRefs();
    $("scr-cup").classList.add("hidden");
    $("scr-refs").classList.remove("hidden");
    try { window.scrollTo(0, 0); } catch (e) {}
    // Eng yangi holat - ochilganda qayta so'raymiz
    fetchRefs(function () { renderRefs(); renderRefsStrip(); });
  }

  function closeRefs() {
    $("scr-refs").classList.add("hidden");
    openCup();
  }

  // Ulashish: bot kartasini tanlangan chatga qo'yadi (inline qidiruv).
  // Karta ichidagi havola ulashgan odamning id sini olib yuradi.
  // query: "" - film qidiruvi, "taklif" - kolleksiyaning reklama kartasi.
  function shareRefs(query) {
    try {
      if (tg && tg.switchInlineQuery && tg.isVersionAtLeast && tg.isVersionAtLeast("6.7")) {
        tg.switchInlineQuery(typeof query === "string" ? query : "", ["users", "groups", "channels"]);
        return;
      }
    } catch (e) {}
    // Eski mijozlar: oddiy havola, lekin baribir taklif qilgan odam bilan.
    var u = tgUser();
    var url = "https://t.me/" + BOT + (u ? "?start=ref" + u.id : "");
    try {
      if (tg && tg.openTelegramLink) {
        tg.openTelegramLink("https://t.me/share/url?url=" + encodeURIComponent(url));
        return;
      }
    } catch (e) {}
    try { window.open(url, "_blank"); } catch (e) {}
  }

  function submitTaskAnswer(taskType, questionId, selectedIndex, cb) {
    var initData = "";
    try { initData = (tg && tg.initData) || ""; } catch (e) {}
    if (!initData && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1" || window.location.protocol === "file:")) {
      setTimeout(function() {
        cb({ok: true, correct: selectedIndex === 0, points: 10, correct_index: 0});
      }, 500);
      return;
    }
    if (!initData || !window.fetch) { cb({ok: false}); return; }
    
    window.fetch(API_SUBMIT_TASK, {
      method: "POST",
      headers: { "X-Telegram-Init-Data": initData, "Content-Type": "application/json" },
      body: JSON.stringify({ task_type: taskType, question_id: questionId, selected_index: selectedIndex })
    }).then(function(r) { return r.ok ? r.json() : {ok: false}; })
      .then(cb)["catch"](function() { cb({ok: false}); });
  }

  var currentTask = null;
  var currentQuestionIndex = 0;

  function renderTasksStrip() {
    setTimeout(worldRefresh, 0);
    var strip = $("tasks-strip");
    if (!strip) return;
    strip.classList.remove("hidden");
    
    var count = (tasksData && tasksData.tasks) ? tasksData.tasks.length : 0;
    var c = cupT();
    $("tasks-kicker").textContent = c.tasksT;
    $("tasks-title").textContent = c.tasksS;
    if (count > 0) {
      $("tasks-count").textContent = c.tasksNew.replace("%d", count);
      $("tasks-count").parentNode.querySelector("i").style.display = "";
    } else {
      $("tasks-count").textContent = c.tasksDone;
      $("tasks-count").parentNode.querySelector("i").style.display = "none";
    }
  }

  function openTasks() {
    $("scr-cup").classList.add("hidden");
    $("scr-tasks").classList.remove("hidden");
    
    $("tasks-header").textContent = lang === "uz" ? "Kutilayotgan vazifalar" : lang === "ru" ? "Ожидающие задачи" : "Pending tasks";
    $("tasks-empty").textContent = lang === "uz" ? "Hozircha barcha vazifalarni bajargansiz." : lang === "ru" ? "Пока все задачи выполнены." : "You have completed all tasks for now.";
    $("tasks-back-txt").textContent = T[lang].cupBack;
    $("quiz-back-txt").textContent = lang === "uz" ? "Vazifalar" : lang === "ru" ? "Задачи" : "Tasks";

    // Til almashgan bo'lsa - savollarni yangi tilda qayta olamiz
    if (tasksData && tasksLang && tasksLang !== lang && !tasksBusy) {
      var want = lang;
      fetchTasks(function () {
        if (tasksLang === want && !$("scr-tasks").classList.contains("hidden")) { openTasks(); }
      });
    }
    
    var list = $("tasks-list");
    list.innerHTML = "";
    
    if (!tasksData || !tasksData.tasks || tasksData.tasks.length === 0) {
      $("tasks-empty").classList.remove("hidden");
      return;
    }
    $("tasks-empty").classList.add("hidden");
    
    tasksData.tasks.forEach(function(task) {
      var btn = document.createElement("button");
      btn.className = "btn w-100";
      btn.style.textAlign = "left";
      btn.style.padding = "16px";
      btn.style.background = "var(--card)";
      btn.style.color = "var(--text)";
      btn.style.border = "1px solid var(--line)";
      btn.style.borderRadius = "12px";
      btn.style.display = "flex";
      btn.style.alignItems = "center";
      btn.style.justifyContent = "space-between";
      
      var txt = document.createElement("span");
      txt.style.fontWeight = "600";
      txt.textContent = task.title;
      btn.appendChild(txt);
      
      var ar = document.createElement("span");
      ar.textContent = "›";
      ar.style.color = "var(--accent)";
      ar.style.fontSize = "20px";
      btn.appendChild(ar);
      
      btn.onclick = function() {
        startTask(task);
      };
      
      list.appendChild(btn);
    });
  }
  
  function startTask(task) {
    currentTask = task;
    currentQuestionIndex = 0;
    $("scr-tasks").classList.add("hidden");
    $("scr-quiz").classList.remove("hidden");
    renderQuizQuestion();
  }
  
  function renderQuizQuestion() {
    if (!currentTask) return;
    if (currentQuestionIndex >= currentTask.questions.length) {
      var idx = tasksData.tasks.indexOf(currentTask);
      if (idx > -1) { tasksData.tasks.splice(idx, 1); }
      currentTask = null;
      $("scr-quiz").classList.add("hidden");
      // Xogvarts bosh sahifasidan kelgan bo'lsa - o'sha yerga; aks holda vazifalar ro'yxatiga
      if (!worldReturnTo()) { openTasks(); }
      renderTasksStrip();
      if (window.tg && window.tg.HapticFeedback) {
        window.tg.HapticFeedback.notificationOccurred("success");
      }
      return;
    }
    
    var q = currentTask.questions[currentQuestionIndex];
    $("quiz-progress").textContent = (currentQuestionIndex + 1) + " / " + currentTask.questions.length;
    $("quiz-title").textContent = q.body;
    
    var opts = $("quiz-options");
    opts.innerHTML = "";
    
    q.options.forEach(function(optText, idx) {
      var btn = document.createElement("button");
      btn.className = "btn w-100";
      btn.style.padding = "14px";
      btn.style.borderRadius = "12px";
      btn.style.background = "var(--bg-mid)";
      btn.style.color = "var(--text)";
      btn.style.border = "1px solid var(--line)";
      btn.style.textAlign = "left";
      btn.style.fontSize = "16px";
      btn.textContent = optText;
      
      btn.onclick = function() {
        var allBtns = opts.querySelectorAll("button");
        for (var i=0; i<allBtns.length; i++) {
          allBtns[i].disabled = true;
          allBtns[i].style.opacity = "0.7";
        }
        btn.style.opacity = "1";
        
        submitTaskAnswer(currentTask.type, q.id, idx, function(res) {
          if (res.ok) {
            if (res.correct) {
              btn.style.background = "rgba(46, 204, 113, 0.2)";
              btn.style.borderColor = "#2ecc71";
              if (window.tg && window.tg.HapticFeedback) window.tg.HapticFeedback.notificationOccurred("success");
            } else {
              btn.style.background = "rgba(231, 76, 60, 0.2)";
              btn.style.borderColor = "#e74c3c";
              if (res.correct_index !== undefined && allBtns[res.correct_index]) {
                allBtns[res.correct_index].style.background = "rgba(46, 204, 113, 0.2)";
                allBtns[res.correct_index].style.borderColor = "#2ecc71";
                allBtns[res.correct_index].style.opacity = "1";
              }
              if (window.tg && window.tg.HapticFeedback) window.tg.HapticFeedback.notificationOccurred("error");
            }
            if (res.points && res.points > 0 && cupData && cupData.me) {
               cupData.me.points = (cupData.me.points || 0) + res.points;
               // Fakultet jamisi ham darhol o'ssin (keyingi ochilishda server aniq sonni beradi)
               (cupData.houses || []).forEach(function (h) {
                 if (h.house === cupData.me.house) { h.total_points = (h.total_points || 0) + res.points; }
               });
            }
          } else {
            btn.style.background = "rgba(231, 76, 60, 0.2)";
          }
          
          setTimeout(function() {
            currentQuestionIndex++;
            renderQuizQuestion();
          }, 1500);
        });
      };
      
      opts.appendChild(btn);
    });
  }

  function cupPts(v) {
    var n = Number(v);
    return isFinite(n) ? Math.round(n).toString() : "0";
  }

  function cupHouseName(id) {
    return (HOUSES[id] && HOUSES[id][lang]) || id;
  }

  function cupCrestImg(houseId, size) {
    var h = HOUSES[houseId];
    if (!h || !h.img) { return null; }
    var img = document.createElement("img");
    img.src = IMG_DIR + h.img;
    img.alt = "";
    if (size) { img.style.width = img.style.height = size + "px"; }
    return img;
  }

  // "2 kun 14 soat qoldi" yoki "9 soat qoldi"
  function cupTimer(t) {
    if (!cupData || !cupData.season) { return ""; }
    var diff;
    try { diff = new Date(cupData.season.ends_at).getTime() - Date.now(); }
    catch (e) { return ""; }
    if (!(diff > 0)) { return t.cupEnding; }

    // Avval muddat yig'iladi, keyin tilga mos qolipga qo'yiladi:
    // o'zbekchada "... qoldi", ruschada "осталось ..." - so'z tartibi teskari.
    var days = Math.floor(diff / 86400000);
    var hours = Math.floor((diff % 86400000) / 3600000);
    var span;
    if (days >= 1) {
      span = (days === 1 ? t.cupDay1 : t.cupDays).replace("%d", days);
      if (hours >= 1) {
        span += " " + (hours === 1 ? t.cupHour1 : t.cupHours).replace("%d", hours);
      }
    } else {
      var h = Math.max(1, Math.floor(diff / 3600000));
      span = (h === 1 ? t.cupHour1 : t.cupHours).replace("%d", h);
    }
    return t.cupLeftFmt.replace("%s", span);
  }

  // Chegaradan o'tganlar tepada, keyin o'rtacha ball bo'yicha.
  function cupSorted() {
    if (!cupData || !cupData.houses) { return []; }
    var list = cupData.houses.slice();
    list.sort(function (a, b) {
      if (a.qualified !== b.qualified) { return a.qualified ? -1 : 1; }
      if ((b.total_points || 0) !== (a.total_points || 0)) {
        return (b.total_points || 0) - (a.total_points || 0);
      }
      return HOUSE_ORDER.indexOf(a.house) - HOUSE_ORDER.indexOf(b.house);
    });
    return list;
  }

  function cupMe() { return (cupData && cupData.me) || {}; }

  // Gerb 34px + 9px pastdan = naycha balandligining 23%. To'ldirish
  // undan past bo'lsa, gerb havoda osilib qolgandek ko'rinadi.
  var MIN_FILL = 28;

  // Bu mavsumda imtihoni topshirilmagan qismlar. Bot bu maydonni hali
  // yubormasa - bo'sh massiv, ya'ni katalogda hech narsa o'zgarmaydi.
  function examPending(part) {
    var me = cupMe();
    var list = me.exam_pending;
    if (!list || !list.length) { return false; }
    for (var i = 0; i < list.length; i++) {
      if (Number(list[i]) === Number(part)) { return true; }
    }
    return false;
  }
  var SCALE_FLOOR = 100;   // mavsumdagi maksimum 350
