/* Duel (egasi, 2026-10-09). 1-bosqich: kompyuter raqiblar bilan duel va haftalik saralash jadvali
   Ilova kodi bir necha faylga bo'lingan; hammasi BIR umumiy maydonda ishlaydi
   va index.html dagi TARTIBDA yuklanadi. Yuklanish paytida keyingi fayldagi
   narsani chaqirmang - tekshiruv: tools/tartib.js */
"use strict";
  /* QOIDA: har duelchida 3 jon. Har raundda TUR tanlanadi (hujum / himoya / hiyla), keyin shu turdagi afsun barmoq bilan
     chiziladi - aniqlik 0..100 (duAcc). Hujum hiylani, hiyla himoyani, himoya hujumni yengadi; bir xil turda aniqrog'i
     yutadi; aniqlik 35 dan past - afsun chiqmadi. Raundni SERVER hal qiladi (hpduel.py, POST /api/duel) - raqib yurishi
     ham serverda. REJA: duel haftalik TURNIR bo'ladi (saralash du-ch, pley-off pa-ya, JONLI, belgilangan vaqtda) -
     pley-off hali qurilmagan; bu yerda saralash bosqichi. Afsun shakllari Afsunlar darsidan (AF). */
  var API_DUEL = "https://bot.tizimshunos.uz/api/duel";
  var DU_TUR = ["hujum", "himoya", "hiyla"];
  var DU_AF = { hujum: ["stupefy", "expelliarmus", "incendio", "reducto"], himoya: ["protego", "finite", "episkey"], hiyla: ["impedimenta", "petrificus", "riddikulus", "silencio"] };
  var DU_YENG = { hujum: "hiyla", hiyla: "himoya", himoya: "hujum" };
  var DU_RGB = { hujum: "214,84,72", himoya: "92,140,226", hiyla: "150,196,96" };
  var DU_IC = {
    hujum: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M13.500 2 5 13.200h5.200L9 22l9-11.600h-5.400z"/></svg>',
    himoya: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2.500 4.500 5.200v6.100c0 4.700 3.100 8.300 7.500 10.200 4.400-1.900 7.500-5.500 7.500-10.200V5.200z"/></svg>',
    hiyla: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M4 8c3-4 6-4 8 0s5 4 8 0M4 16c3-4 6-4 8 0s5 4 8 0"/></svg>'
  };
  var DU_X = {
    uz: { ttl: "Duel", kick: "Duel klubi", note: "Raqibni tanlang. Har ikkingizda 3 tadan jon bor: kim birinchi tugatsa — yutqazadi.",
          tur: { hujum: "Hujum", himoya: "Himoya", hiyla: "Hiyla" }, raq: ["Birinchi kurs o'quvchisi", "Yuqori kurs o'quvchisi", "Duel ustozi"], lvl: ["Oson", "O'rta", "Qiyin"],
          best: function (n) { return n ? "Eng yaxshi natija: " + n : "Hali yengilmagan"; }, rule: "Hujum hiylani yengadi · hiyla himoyani · himoya hujumni",
          planT: "Duel turniri", plan: "Dushanba–chorshanba: saralash — shu yerda ball to'plang. Eng yaxshi 16 duelchi pley-offga chiqadi: payshanba 1/8 final, juma chorak final, shanba yarim final, yakshanba final. Pley-off jonli o'tadi — tez orada ochiladi.",
          topT: "Saralash jadvali · shu hafta", empty: "Bu hafta hali hech kim duel qilmadi. Birinchi bo'ling!", mine: function (b, p, n) { return "Sizning balingiz: " + b + (p ? " · " + p + "-o'rin (" + n + " kishi)" : ""); },
          pick: function (r) { return r + "-raund. Nima qilasiz?"; }, draw: function (nom) { return nom + " — afsunni chizing!"; }, wait: "Afsunlar to'qnashmoqda…",
          you: "Siz", w1: "Zarbangiz yetdi!", w0: "Durang — afsunlar bir-birini so'ndirdi.", wm: "Raqib ustun keldi.", fail: "afsun chiqmadi", next: "Keyingi raund",
          won: "G'alaba!", lost: "Mag'lubiyat", score: function (n) { return "Saralash bali: " + n; }, again: "Yana duel", back: "Raqiblar", acc: "aniqlik" },
    ru: { ttl: "Дуэль", kick: "Дуэльный клуб", note: "Выберите соперника. У каждого по 3 жизни: у кого закончатся первыми — тот проиграл.",
          tur: { hujum: "Атака", himoya: "Защита", hiyla: "Уловка" }, raq: ["Первокурсник", "Старшекурсник", "Мастер дуэлей"], lvl: ["Легко", "Средне", "Сложно"],
          best: function (n) { return n ? "Лучший результат: " + n : "Ещё не побеждён"; }, rule: "Атака бьёт уловку · уловка — защиту · защита — атаку",
          planT: "Дуэльный турнир", plan: "Понедельник–среда: отбор — набирайте очки здесь. 16 лучших дуэлянтов выходят в плей-офф: четверг — 1/8 финала, пятница — четвертьфинал, суббота — полуфинал, воскресенье — финал. Плей-офф проходит вживую — скоро откроется.",
          topT: "Таблица отбора · эта неделя", empty: "На этой неделе ещё никто не дрался. Будьте первым!", mine: function (b, p, n) { return "Ваши очки: " + b + (p ? " · место " + p + " (из " + n + ")" : ""); },
          pick: function (r) { return "Раунд " + r + ". Что будете делать?"; }, draw: function (nom) { return nom + " — начертите заклинание!"; }, wait: "Заклинания сталкиваются…",
          you: "Вы", w1: "Ваш удар достиг цели!", w0: "Ничья — заклинания погасили друг друга.", wm: "Соперник оказался сильнее.", fail: "заклинание не вышло", next: "Следующий раунд",
          won: "Победа!", lost: "Поражение", score: function (n) { return "Очки отбора: " + n; }, again: "Ещё дуэль", back: "Соперники", acc: "точность" },
    en: { ttl: "Duel", kick: "Duelling Club", note: "Choose your opponent. You each have 3 lives: whoever runs out first loses.",
          tur: { hujum: "Attack", himoya: "Defence", hiyla: "Trick" }, raq: ["First-year student", "Senior student", "Duelling master"], lvl: ["Easy", "Medium", "Hard"],
          best: function (n) { return n ? "Best result: " + n : "Not beaten yet"; }, rule: "Attack beats trick · trick beats defence · defence beats attack",
          planT: "Duelling tournament", plan: "Monday–Wednesday: qualifying — earn points here. The top 16 duellists reach the play-offs: Thursday round of 16, Friday quarter-finals, Saturday semi-finals, Sunday final. Play-offs are live — opening soon.",
          topT: "Qualifying table · this week", empty: "Nobody has duelled this week yet. Be the first!", mine: function (b, p, n) { return "Your points: " + b + (p ? " · place " + p + " of " + n : ""); },
          pick: function (r) { return "Round " + r + ". What will you do?"; }, draw: function (nom) { return nom + " — draw the spell!"; }, wait: "The spells collide…",
          you: "You", w1: "Your spell hit!", w0: "A draw — the spells cancelled out.", wm: "Your opponent got the better of you.", fail: "the spell failed", next: "Next round",
          won: "Victory!", lost: "Defeat", score: function (n) { return "Qualifying points: " + n; }, again: "Duel again", back: "Opponents", acc: "accuracy" }
  };
  var DU_VAQT = 8000;        // afsunni chizishga vaqt (ms)
  var duData = null, du = null, duLocal = null;     // du: {game, tur, af, pts, user, drawing, t0, tm, busy}

  function duX() { return DU_X[lang] || DU_X.uz; }
  function duRaqImg(l) { return l === 3 ? IMG_DIR + "duel/r3.webp" : IMG_DIR + "duel/r" + l + ".webp"; }

  // Mahalliy ko'rik uchun namuna (server yo'q)
  function duSample(body) {
    if (!duLocal) { duLocal = { best: { 1: 190, 2: 0, 3: 0 }, g: null }; }
    var L = duLocal, res = { ok: true };
    if (body && body.start) { L.g = { id: 1, level: body.start, lives: 3, rlives: 3, round: 0, over: false, sum: 0 }; res.game = L.g; }
    if (body && body.move && L.g) {
      var g = L.g, his = DU_TUR[Math.floor(Math.random() * 3)], racc = Math.round([50, 68, 84][g.level - 1] + (Math.random() - 0.5) * 30), a = body.acc, w;
      if (a < 35 && racc < 35) { w = 0; } else if (a < 35) { w = -1; } else if (racc < 35) { w = 1; }
      else if (his === body.move) { w = Math.abs(a - racc) < 5 ? 0 : a > racc ? 1 : -1; } else { w = DU_YENG[body.move] === his ? 1 : -1; }
      g.round++; g.sum += a; if (w > 0) { g.rlives--; } if (w < 0) { g.lives--; }
      g.over = g.lives <= 0 || g.rlives <= 0 || g.round >= 12; g.won = g.over && g.lives > g.rlives;
      g.score = g.won ? g.level * 100 + g.lives * 20 + Math.floor(g.sum / g.round * 0.5) : 0;
      if (g.won) { L.best[g.level] = Math.max(L.best[g.level], g.score); }
      res.round = { mine: body.move, his: his, acc: a, racc: racc, win: w }; res.game = g;
    }
    var tot = L.best[1] + L.best[2] + L.best[3];
    res.mine = { "1": L.best[1], "2": L.best[2], "3": L.best[3], total: tot };
    res.top = [{ uid: 5, name: "Germiona", house: "gryffindor", score: 880 }, { uid: 6, name: "Draco", house: "slytherin", score: 610 }, { uid: 1, name: "Sehrgar", house: "gryffindor", score: tot, me: true }, { uid: 7, name: "Luna", house: "ravenclaw", score: 150 }]
      .sort(function (p, q) { return q.score - p.score; });
    res.n = res.top.length; res.place = res.top.findIndex(function (p) { return p.me; }) + 1;
    return res;
  }
  function duPost(body, cb) {
    if (!window.fetch) { return; }
    window.fetch(API_DUEL, { method: "POST", headers: { "Content-Type": "application/json", "X-Telegram-Init-Data": drInit() }, body: JSON.stringify(body || {}) })
      .then(function (r) { return r.json(); })
      .then(function (res) { cb(res && res.mine ? res : (MS_LOCAL ? duSample(body) : res)); })
      ["catch"](function () { cb(MS_LOCAL ? duSample(body) : null); });
  }

  function duOpen() {
    drShowGame("scr-duel");
    duStop();
    duHome();
    duPost({}, function (res) { if (res && res.mine) { duData = res; if (!du) { duHome(); } } else if (!duData) { showToast(drX().fail, "err"); } });
  }
  function duStop() { if (du) { clearTimeout(du.tm); cancelAnimationFrame(du.raf || 0); } du = null; }

  function duJon(el, n) {
    el.innerHTML = "";
    for (var i = 0; i < 3; i++) { el.appendChild(drEl("i", i < n ? "on" : "")); }
  }

  /* ---------- bosh ko'rinish: raqiblar, turnir rejasi, saralash jadvali ---------- */
  function duHome() {
    var x = duX(), d = duData;
    $("du-kick").textContent = x.kick;
    $("du-ttl").textContent = x.ttl;
    $("du-home").classList.remove("hidden");
    $("du-game").classList.add("hidden");
    $("du-note").textContent = x.note;
    $("du-rule").textContent = x.rule;
    var box = $("du-raq");
    box.innerHTML = "";
    [1, 2, 3].forEach(function (l) {
      var c = drEl("button", "du-rq"), im = document.createElement("img");
      c.type = "button";
      im.alt = ""; im.src = duRaqImg(l);
      c.appendChild(im);
      var tx = drEl("span", "du-rq-tx");
      tx.appendChild(drEl("small", "du-lv l" + l, x.lvl[l - 1]));
      tx.appendChild(drEl("b", "", x.raq[l - 1]));
      tx.appendChild(drEl("span", "", x.best(d ? d.mine[String(l)] : 0)));
      c.appendChild(tx);
      c.addEventListener("click", function () { duStart(l); });
      box.appendChild(c);
    });
    $("du-plan-t").textContent = x.planT;
    $("du-plan").textContent = x.plan;
    $("du-top-t").textContent = x.topT;
    $("du-mine").textContent = d && d.mine.total ? x.mine(d.mine.total, d.place, d.n) : "";
    var tb = $("du-top");
    tb.innerHTML = "";
    if (!d || !d.top.length) { tb.appendChild(drEl("p", "rk-bosh", x.empty)); return; }
    d.top.forEach(function (p, i) {
      var row = drEl("div", "bl-row" + (p.me ? " me" : ""));
      row.appendChild(drEl("i", "o" + (i + 1), String(i + 1)));
      var cr = drEl("span", "bl-cr"), im = cupCrestImg(p.house, 18);
      if (im) { cr.appendChild(im); }
      row.appendChild(cr);
      row.appendChild(drEl("b", "", p.name + (p.me ? " (" + drX().you + ")" : "")));
      row.appendChild(drEl("em", "", String(p.score)));
      tb.appendChild(odamLink(row, p));
    });
  }

  /* ---------- duel ---------- */
  function duStart(level) {
    var x = duX();
    duStop();
    duPost({ start: level }, function (res) {
      if (!res || !res.game) { showToast(drX().fail, "err"); return; }
      du = { game: res.game, level: level };
      $("du-home").classList.add("hidden");
      $("du-game").classList.remove("hidden");
      $("du-r-im").src = duRaqImg(level);
      $("du-r-nom").textContent = x.raq[level - 1];
      $("du-m-nom").textContent = x.you;
      var av = $("du-m-im"), me = cupMe(), ci = cupCrestImg(me.house || house, 54);
      av.innerHTML = "";
      if (ci) { av.appendChild(ci); }
      $("du-res").classList.add("hidden");
      duPick();
      try { window.scrollTo(0, 0); } catch (e) {}
    });
  }

  function duHearts() { duJon($("du-r-jon"), du.game.rlives); duJon($("du-m-jon"), du.game.lives); }

  // 1) tur tanlash
  function duPick() {
    var x = duX(), box = $("du-turs");
    duHearts();
    $("du-msg").textContent = x.pick(du.game.round + 1);
    $("du-draw").classList.add("hidden");
    $("du-rev").classList.add("hidden");
    box.classList.remove("hidden");
    box.innerHTML = "";
    DU_TUR.forEach(function (t) {
      var b = drEl("button", "du-tur");
      b.type = "button";
      b.style.setProperty("--tu", DU_RGB[t]);
      b.innerHTML = DU_IC[t];
      b.appendChild(drEl("b", "", x.tur[t]));
      b.appendChild(drEl("small", "", "› " + x.tur[DU_YENG[t]]));
      b.addEventListener("click", function () { duDraw(t); });
      box.appendChild(b);
    });
  }

  // 2) afsunni chizish
  function duDraw(tur) {
    var x = duX(), havza = DU_AF[tur], id = havza[Math.floor(Math.random() * havza.length)], a = AF[id];
    du.tur = tur; du.af = id; du.user = []; du.drawing = false; du.busy = false;
    du.pts = afResample(a.s, 48);
    $("du-turs").classList.add("hidden");
    $("du-draw").classList.remove("hidden");
    $("du-draw").style.setProperty("--tu", DU_RGB[tur]);
    $("du-msg").textContent = x.draw((a[lang] || a.uz)[0]);
    duSize();
    du.t0 = Date.now();
    clearTimeout(du.tm);
    du.tm = setTimeout(function () { duSend(); }, DU_VAQT);
    duLoop();
  }
  function duSize() {
    var c = $("du-canvas"), w = Math.min(300, ($("du-draw").clientWidth || 300)), r = window.devicePixelRatio || 1;
    c.style.width = w + "px"; c.style.height = w + "px";
    c.width = Math.round(w * r); c.height = Math.round(w * r);
    du.w = w; du.r = r;
  }
  function duLoop() {
    if (!du || du.busy || $("du-draw").classList.contains("hidden")) { return; }
    duPaint();
    du.raf = requestAnimationFrame(duLoop);
  }
  function duPaint() {
    var c = $("du-canvas"), g = c.getContext("2d"), w = du.w, i, rgb = DU_RGB[du.tur];
    g.setTransform(du.r, 0, 0, du.r, 0, 0);
    g.clearRect(0, 0, w, w);
    g.lineCap = "round"; g.lineJoin = "round";
    g.strokeStyle = "rgba(" + rgb + ",.38)"; g.lineWidth = 12; g.setLineDash([2, 16]);
    g.beginPath();
    for (i = 0; i < du.pts.length; i++) { g[i ? "lineTo" : "moveTo"](du.pts[i][0] * w, du.pts[i][1] * w); }
    g.stroke();
    g.setLineDash([]);
    g.fillStyle = "rgba(" + rgb + ",.95)";
    g.beginPath(); g.arc(du.pts[0][0] * w, du.pts[0][1] * w, 8, 0, Math.PI * 2); g.fill();
    if (du.user.length > 1) {
      g.strokeStyle = "#f3d58f"; g.lineWidth = 5; g.shadowColor = "rgba(243,213,143,.9)"; g.shadowBlur = 12;
      g.beginPath();
      for (i = 0; i < du.user.length; i++) { g[i ? "lineTo" : "moveTo"](du.user[i][0] * w, du.user[i][1] * w); }
      g.stroke();
      g.shadowBlur = 0;
    }
    var q = Math.max(0, 1 - (Date.now() - du.t0) / DU_VAQT);
    $("du-vaqt").style.width = Math.round(q * 100) + "%";
  }
  // Aniqlik 0..100: chizilgan iz shaklga qanchalik yaqin va shaklni qanchalik to'liq qoplagan
  function duAcc(pts, user) {
    if (!user || user.length < 6) { return 0; }
    var u = afResample(user, 48), yaq = function (a, b) {
      var s = 0;
      a.forEach(function (p) { var m = 9; b.forEach(function (q) { var d = Math.hypot(p[0] - q[0], p[1] - q[1]); if (d < m) { m = d; } }); s += m; });
      return s / a.length;
    };
    var d = (yaq(pts, u) + yaq(u, pts)) / 2;
    return Math.max(0, Math.min(100, Math.round(100 * (1 - (d - 0.012) / 0.13))));
  }
  function duXY(ev) {
    var r = $("du-canvas").getBoundingClientRect();
    return [Math.max(0, Math.min(1, (ev.clientX - r.left) / r.width)), Math.max(0, Math.min(1, (ev.clientY - r.top) / r.height))];
  }
  function duDown(ev) { if (!du || du.busy || !du.pts) { return; } du.drawing = true; du.user = [duXY(ev)]; try { ev.preventDefault(); } catch (e) {} }
  function duMove(ev) { if (!du || !du.drawing) { return; } du.user.push(duXY(ev)); try { ev.preventDefault(); } catch (e) {} }
  function duUp() { if (!du || !du.drawing) { return; } du.drawing = false; if (du.user.length >= 6) { duSend(); } }

  // 3) yurish serverga, natijani ko'rsatish
  function duSend() {
    if (!du || du.busy) { return; }
    var x = duX(), acc = duAcc(du.pts, du.user);
    du.busy = true; du.drawing = false;
    clearTimeout(du.tm);
    duPaint();
    $("du-msg").textContent = x.wait;
    duPost({ game: du.game.id, move: du.tur, acc: acc }, function (res) {
      if (!du) { return; }
      if (!res || !res.round) { showToast(drX().fail, "err"); du.busy = false; duPick(); return; }
      duData = res;
      du.game = res.game;
      duReveal(res.round);
    });
  }
  function duReveal(r) {
    var x = duX(), box = $("du-rev");
    $("du-draw").classList.add("hidden");
    box.classList.remove("hidden");
    box.innerHTML = "";
    var yon = function (nom, tur, acc, yutdi) {
      var c = drEl("div", "du-rv" + (yutdi ? " yutdi" : ""));
      c.style.setProperty("--tu", DU_RGB[tur]);
      c.appendChild(drEl("small", "", nom));
      var ic = drEl("span", "du-rv-ic"); ic.innerHTML = DU_IC[tur];
      c.appendChild(ic);
      c.appendChild(drEl("b", "", x.tur[tur]));
      c.appendChild(drEl("em", acc < 35 ? "yoq" : "", acc < 35 ? x.fail : x.acc + " " + acc));
      return c;
    };
    box.appendChild(yon(x.raq[du.level - 1], r.his, r.racc, r.win < 0));
    box.appendChild(yon(x.you, r.mine, r.acc, r.win > 0));
    $("du-msg").textContent = r.win > 0 ? x.w1 : r.win < 0 ? x.wm : x.w0;
    duHearts();
    try { if (tg && tg.HapticFeedback) { tg.HapticFeedback.notificationOccurred(r.win > 0 ? "success" : r.win < 0 ? "error" : "warning"); } } catch (e) {}
    $("scr-duel").classList.remove("zarba-m", "zarba-r");
    void $("scr-duel").offsetWidth;
    if (r.win) { $("scr-duel").classList.add(r.win > 0 ? "zarba-r" : "zarba-m"); }
    var b = drEl("button", "dr-btn", du.game.over ? (du.game.won ? x.won : x.lost) : x.next);
    b.type = "button";
    b.addEventListener("click", function () { if (du.game.over) { duEnd(); } else { du.busy = false; duPick(); } });
    box.appendChild(b);
  }
  function duEnd() {
    var x = duX(), box = $("du-res"), g = du.game, level = du.level;
    $("du-rev").classList.add("hidden");
    $("du-turs").classList.add("hidden");
    $("du-msg").textContent = "";
    box.innerHTML = "";
    box.appendChild(drEl("b", "rk-son", g.won ? x.won : x.lost));
    if (g.won) { box.appendChild(drEl("b", "dr-res-p", x.score(g.score))); }
    var a = drEl("button", "dr-btn", x.again);
    a.type = "button";
    a.addEventListener("click", function () { duStart(level); });
    box.appendChild(a);
    var b = drEl("button", "dr-btn ikkinchi", x.back);
    b.type = "button";
    b.addEventListener("click", function () { duStop(); duHome(); });
    box.appendChild(b);
    box.classList.remove("hidden");
  }

  function duSetup() {
    $("du-back").addEventListener("click", function () {
      if (du) { duStop(); duHome(); return; }
      $("scr-duel").classList.add("hidden");
      openHub();
    });
    var c = $("du-canvas");
    if (window.PointerEvent) {
      c.addEventListener("pointerdown", duDown); c.addEventListener("pointermove", duMove);
      c.addEventListener("pointerup", duUp); c.addEventListener("pointercancel", duUp); c.addEventListener("pointerleave", duUp);
    } else {
      var tch = function (fn) { return function (ev) { var t = ev.changedTouches && ev.changedTouches[0]; if (t) { fn({ clientX: t.clientX, clientY: t.clientY, preventDefault: function () { ev.preventDefault(); } }); } }; };
      c.addEventListener("touchstart", tch(duDown), { passive: false });
      c.addEventListener("touchmove", tch(duMove), { passive: false });
      c.addEventListener("touchend", function () { duUp(); });
    }
  }

  duSetup();
