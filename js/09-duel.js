/* Duel (egasi, 2026-10-09). 1-bosqich: kompyuter raqiblar bilan duel va haftalik saralash jadvali
   Ilova kodi bir necha faylga bo'lingan; hammasi BIR umumiy maydonda ishlaydi
   va index.html dagi TARTIBDA yuklanadi. Yuklanish paytida keyingi fayldagi
   narsani chaqirmang - tekshiruv: tools/tartib.js */
"use strict";
  /* QOIDA: har duelchida 5 jon. Har raundda TUR tanlanadi (hujum / himoya / hiyla), keyin shu turdagi afsun barmoq bilan
     chiziladi - aniqlik 0..100 (duAcc). KUCH = aniqlik, ustun tur bo'lsa +25 (hujum > hiyla > himoya > hujum); kuchi baland
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
    uz: { ttl: "Duel", kick: "Duel klubi", note: "Raqibni tanlang. Har ikkingizda 5 tadan jon bor: kim birinchi tugatsa — yutqazadi.",
          tur: { hujum: "Hujum", himoya: "Himoya", hiyla: "Hiyla" }, raq: ["Birinchi kurs o'quvchisi", "Yuqori kurs o'quvchisi", "Duel ustozi"], lvl: ["Oson", "O'rta", "Qiyin"],
          best: function (n) { return "Reytingi " + n; }, rdelta: function (n) { return "Reyting " + (n >= 0 ? "+" : "−") + Math.abs(n); }, rule: "Kuch = chizish aniqligi. Ustun tur +25: hujum › hiyla › himoya › hujum. Kuchi baland yutadi.", kuch: "kuch",
          planT: "Duel turniri", plan: "Haftada bir marta, yakshanba kuni soat 21:00 da — va shu oqshomning o'zida g'olib aniqlanadi. Saralash yo'q: «Qatnashaman» tugmasini bosgan har kim o'ynaydi. Reytingi yuqori duelchilar birinchi bosqichni o'tkazib yuboradi. Har duelga 5 daqiqa, bosqichlar orasida 1 daqiqa tanaffus; 1 daqiqa ichida kelmagan duelchi yutqazadi.",
          topT: "Reyting jadvali", empty: "Hali hech kim duel qilmadi. Birinchi bo'ling!", mine: function (b, p, n) { return "Reytingingiz: " + b + (p ? " · " + p + "-o'rin (" + n + " kishi)" : ""); },
          pick: function (r) { return r + "-raund. Nima qilasiz?"; }, draw: function (nom) { return nom + " — afsunni chizing!"; }, wait: "Afsunlar to'qnashmoqda…",
          you: "Siz", w1: "Zarbangiz yetdi!", w0: "Durang — afsunlar bir-birini so'ndirdi.", wm: "Raqib ustun keldi.", fail: "afsun chiqmadi", next: "Keyingi raund",
          won: "G'alaba!", lost: "Mag'lubiyat", score: function (n) { return "Saralash bali: " + n; }, again: "Yana duel", back: "Raqiblar", acc: "aniqlik" },
    ru: { ttl: "Дуэль", kick: "Дуэльный клуб", note: "Выберите соперника. У каждого по 5 жизней: у кого закончатся первыми — тот проиграл.",
          tur: { hujum: "Атака", himoya: "Защита", hiyla: "Уловка" }, raq: ["Первокурсник", "Старшекурсник", "Мастер дуэлей"], lvl: ["Легко", "Средне", "Сложно"],
          best: function (n) { return "Рейтинг " + n; }, rdelta: function (n) { return "Рейтинг " + (n >= 0 ? "+" : "−") + Math.abs(n); }, rule: "Сила = точность рисунка. Преимущество типа +25: атака › уловка › защита › атака. Побеждает более сильное.", kuch: "сила",
          planT: "Дуэльный турнир", plan: "Раз в неделю, в воскресенье в 21:00 — и победитель определяется в тот же вечер. Отбора нет: играет каждый, кто нажал «Участвую». Дуэлянты с высоким рейтингом пропускают первый круг. На дуэль 5 минут, между кругами перерыв 1 минута; кто не пришёл за минуту — проигрывает.",
          topT: "Таблица рейтинга", empty: "Пока никто не дрался. Будьте первым!", mine: function (b, p, n) { return "Ваш рейтинг: " + b + (p ? " · место " + p + " (из " + n + ")" : ""); },
          pick: function (r) { return "Раунд " + r + ". Что будете делать?"; }, draw: function (nom) { return nom + " — начертите заклинание!"; }, wait: "Заклинания сталкиваются…",
          you: "Вы", w1: "Ваш удар достиг цели!", w0: "Ничья — заклинания погасили друг друга.", wm: "Соперник оказался сильнее.", fail: "заклинание не вышло", next: "Следующий раунд",
          won: "Победа!", lost: "Поражение", score: function (n) { return "Очки отбора: " + n; }, again: "Ещё дуэль", back: "Соперники", acc: "точность" },
    en: { ttl: "Duel", kick: "Duelling Club", note: "Choose your opponent. You each have 5 lives: whoever runs out first loses.",
          tur: { hujum: "Attack", himoya: "Defence", hiyla: "Trick" }, raq: ["First-year student", "Senior student", "Duelling master"], lvl: ["Easy", "Medium", "Hard"],
          best: function (n) { return "Rating " + n; }, rdelta: function (n) { return "Rating " + (n >= 0 ? "+" : "−") + Math.abs(n); }, rule: "Power = drawing accuracy. Type advantage +25: attack › trick › defence › attack. The stronger spell wins.", kuch: "power",
          planT: "Duelling tournament", plan: "Once a week, on Sunday at 21:00 — and the winner is decided that same evening. No qualifying: everyone who taps “I'm in” plays. Higher-rated duellists skip the first round. Each duel lasts up to 5 minutes with a 1-minute break between rounds; anyone a minute late loses.",
          topT: "Rating table", empty: "Nobody has duelled yet. Be the first!", mine: function (b, p, n) { return "Your rating: " + b + (p ? " · place " + p + " of " + n : ""); },
          pick: function (r) { return "Round " + r + ". What will you do?"; }, draw: function (nom) { return nom + " — draw the spell!"; }, wait: "The spells collide…",
          you: "You", w1: "Your spell hit!", w0: "A draw — the spells cancelled out.", wm: "Your opponent got the better of you.", fail: "the spell failed", next: "Next round",
          won: "Victory!", lost: "Defeat", score: function (n) { return "Qualifying points: " + n; }, again: "Duel again", back: "Opponents", acc: "accuracy" }
  };
  /* PLEY-OFF (jonli, 21:00): to'r serverdan (holatdagi `cup`), duel «arena»da - {arena: id} har 1,5 soniyada so'raladi,
     bosqichni server aytadi: early / wait / pick / reveal / over (hpduel._arena). Mahalliy ko'rikda soxta arena (duArSample). */
  var DU_T = {
    uz: { hSar: "duel reytingingiz", hOrin: "o'rin", stN: function (n) { return "1/" + n + " final"; },
          tKun: function (k, t) { return "Turnir: " + k + ", 21:00 · " + t + " qoldi"; }, tBugun: function (t) { return "Turnir bugun 21:00 da · " + t + " qoldi"; }, tKunlar: ["yakshanba", "dushanba", "seshanba", "chorshanba", "payshanba", "juma", "shanba"],
          tSoni: function (n) { return n + " kishi yozildi"; }, tQat: "Qatnashaman", tBor: "Siz turnirga yozilgansiz", tChiq: "Chiqish", tYopiq: "Yozilish yopildi — to'r tuzilmoqda", tKeyin: "Yozilish dushanbadan ochiladi", qoldi: "qoldi",
          tYoz: "Turnirga yozilmagan edingiz. Keyingi turnir — kelasi yakshanba.", bye: "bu bosqichni o'tkazib yuboradi", ball: function (n) { return "+" + n + " ball"; }, qatT: "Yozilganlar",
          keyingi: function (t) { return "Keyingi duelingiz " + t + " dan keyin. Arenada qoling!"; }, vaqtT: "Vaqt tugadi — joni ko'p duelchi yutdi.", kunQ: "kun", byeT: "Bu bosqichni o'tkazib yuboradi (reytingi yuqori)", rey: "Reyting", turT: "Duel turniri", raqib: function (n) { return "Raqibingiz: " + n; },
          kutadi: "kutadi", torT: "Turnir to'ri", surish: "Yonga suring — keyingi bosqichlar", yozS: "Reytingi yuqorilar birinchi bosqichni o'tkazib yuboradi",
          hist: "Duellar tarixi", histBosh: "Hali tugagan duelingiz yo'q.", rnd: function (n) { return n + " raund"; }, jon: "jon", gal: "G'alaba", mag: "Mag'lubiyat",
          eski: "Bu duelning raundlari saqlanmagan — u yangilanishdan oldin o'ynalgan.", jonli: "JONLI", kelmadiQ: "kelmadi", uchN: "Ustun tur +25 · kuchi baland yutadi",
          chiq: "chiqmadi", raund: "Raund", rSiz: "Siz", ham: "Barcha duellar",
          st: { 16: "1/8 final", 8: "Chorak final", 4: "Yarim final", 2: "Final" }, kun: { 16: "payshanba", 8: "juma", 4: "shanba", 2: "yakshanba" },
          from: "Birinchi turnir — yakshanba 18-oktabr, 21:00. Hozircha mashq qiling: har duel reytingingizga ta'sir qiladi.",
          kam: "Bu safar turnirga duelchi yetmadi (kamida 2 kishi kerak).", at: function (k) { return k + ", 21:00"; }, tbd: "aniqlanmoqda",
          my: function (st, k) { return "Sizning duelingiz: " + st + " — " + k; }, in_: function (t) { return "Boshlanishiga " + t + " qoldi"; }, now: "Duel boshlandi — kiring!",
          go: "Arenaga kirish", wopp: "Raqibingiz hali aniqlanmagan", test: "Sinov dueli (faqat admin)", h: " soat ", m: " daqiqa",
          early: function (t) { return "Duel " + t + " dan keyin boshlanadi"; }, wait: function (t) { return "Raqib kutilmoqda… " + t; }, here: "Raqibingiz arenada.", nothere: "Raqibingiz hali kelmadi.",
          sent: "Afsun otildi! Raqibni kutamiz…", left: function (s) { return " · " + s + " s"; }, nxt: function (s) { return "Keyingi raund " + s + " soniyadan keyin"; },
          kelmadi: "Raqibingiz kelmadi — g'alaba sizniki.", kelmadim: "Siz vaqtida kelmadingiz.", ikkalasi: "Ikkalangiz ham kelmadingiz — reytingi yuqori duelchi o'tdi.",
          pts: function (n) { return "+" + n + " ball kubokka"; }, champ: "Siz duel chempionisiz!", out: "Turnir siz uchun tugadi. Keyingi yakshanba yana urinib ko'ring!", tbl: "Turnir jadvali", bot: "Sinov raqibi" },
    ru: { hSar: "ваш дуэльный рейтинг", hOrin: "место", stN: function (n) { return "1/" + n + " финала"; },
          tKun: function (k, t) { return "Турнир: " + k + ", 21:00 · осталось " + t; }, tBugun: function (t) { return "Турнир сегодня в 21:00 · осталось " + t; }, tKunlar: ["воскресенье", "понедельник", "вторник", "среда", "четверг", "пятница", "суббота"],
          tSoni: function (n) { return "Записалось: " + n; }, tQat: "Участвую", tBor: "Вы записаны на турнир", tChiq: "Выйти", tYopiq: "Запись закрыта — составляется сетка", tKeyin: "Запись откроется в понедельник", qoldi: "осталось",
          tYoz: "Вы не записались на этот турнир. Следующий — в будущее воскресенье.", bye: "пропускает этот круг", ball: function (n) { return "+" + n + " очк."; }, qatT: "Участники",
          keyingi: function (t) { return "Ваша следующая дуэль через " + t + ". Оставайтесь на арене!"; }, vaqtT: "Время вышло — победил тот, у кого больше жизней.", kunQ: "дн.", byeT: "Пропускают этот круг (высокий рейтинг)", rey: "Рейтинг", turT: "Дуэльный турнир", raqib: function (n) { return "Ваш соперник: " + n; },
          kutadi: "ждёт", torT: "Сетка турнира", surish: "Листайте вбок — следующие круги", yozS: "Дуэлянты с высоким рейтингом пропускают первый круг",
          hist: "История дуэлей", histBosh: "У вас пока нет завершённых дуэлей.", rnd: function (n) { return "раундов: " + n; }, jon: "жизни", gal: "Победа", mag: "Поражение",
          eski: "Раунды этой дуэли не сохранены — она была сыграна до обновления.", jonli: "ИДЁТ", kelmadiQ: "не пришёл", uchN: "Преимущество типа +25 · побеждает более сильное",
          chiq: "не вышло", raund: "Раунд", rSiz: "Вы", ham: "Все дуэли",
          st: { 16: "1/8 финала", 8: "Четвертьфинал", 4: "Полуфинал", 2: "Финал" }, kun: { 16: "четверг", 8: "пятница", 4: "суббота", 2: "воскресенье" },
          from: "Первый турнир — в воскресенье 18 октября, 21:00. Пока тренируйтесь: каждая дуэль влияет на рейтинг.",
          kam: "В этот раз не хватило дуэлянтов для турнира (нужно минимум 2).", at: function (k) { return k + ", 21:00"; }, tbd: "определяется",
          my: function (st, k) { return "Ваша дуэль: " + st + " — " + k; }, in_: function (t) { return "До начала " + t; }, now: "Дуэль началась — заходите!",
          go: "Войти на арену", wopp: "Ваш соперник ещё не определён", test: "Тестовая дуэль (только админ)", h: " ч ", m: " мин",
          early: function (t) { return "Дуэль начнётся через " + t; }, wait: function (t) { return "Ждём соперника… " + t; }, here: "Соперник на арене.", nothere: "Соперник ещё не пришёл.",
          sent: "Заклинание выпущено! Ждём соперника…", left: function (s) { return " · " + s + " с"; }, nxt: function (s) { return "Следующий раунд через " + s + " с"; },
          kelmadi: "Соперник не пришёл — победа ваша.", kelmadim: "Вы не пришли вовремя.", ikkalasi: "Никто не пришёл — дальше прошёл дуэлянт с более высоким рейтингом.",
          pts: function (n) { return "+" + n + " очков в кубок"; }, champ: "Вы чемпион дуэлей!", out: "Турнир для вас окончен. Попробуйте на следующей неделе!", tbl: "Таблица турнира", bot: "Тестовый соперник" },
    en: { hSar: "your duelling rating", hOrin: "place", stN: function (n) { return "Round of " + (n * 2); },
          tKun: function (k, t) { return "Tournament: " + k + ", 21:00 · " + t + " left"; }, tBugun: function (t) { return "Tournament today at 21:00 · " + t + " left"; }, tKunlar: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
          tSoni: function (n) { return n + " signed up"; }, tQat: "I'm in", tBor: "You are signed up", tChiq: "Leave", tYopiq: "Sign-up is closed — the bracket is being drawn", tKeyin: "Sign-up opens on Monday", qoldi: "left",
          tYoz: "You did not sign up for this tournament. The next one is next Sunday.", bye: "skips this round", ball: function (n) { return "+" + n + " pts"; }, qatT: "Signed up",
          keyingi: function (t) { return "Your next duel is in " + t + ". Stay in the arena!"; }, vaqtT: "Time is up — the duellist with more lives won.", kunQ: "d", byeT: "Skip this round (higher rating)", rey: "Rating", turT: "Duelling tournament", raqib: function (n) { return "Your opponent: " + n; },
          kutadi: "bye", torT: "Bracket", surish: "Swipe sideways for the next rounds", yozS: "Higher-rated duellists skip the first round",
          hist: "Duel history", histBosh: "You have no finished duels yet.", rnd: function (n) { return n + " rounds"; }, jon: "lives", gal: "Victory", mag: "Defeat",
          eski: "The rounds of this duel were not saved — it was played before the update.", jonli: "LIVE", kelmadiQ: "no-show", uchN: "Type advantage +25 · the stronger spell wins",
          chiq: "failed", raund: "Round", rSiz: "You", ham: "All duels",
          st: { 16: "Round of 16", 8: "Quarter-final", 4: "Semi-final", 2: "Final" }, kun: { 16: "Thursday", 8: "Friday", 4: "Saturday", 2: "Sunday" },
          from: "The first tournament is on Sunday 18 October at 21:00. Practise for now: every duel changes your rating.",
          kam: "Not enough duellists for the tournament this time (at least 2 needed).", at: function (k) { return k + ", 21:00"; }, tbd: "to be decided",
          my: function (st, k) { return "Your duel: " + st + " — " + k; }, in_: function (t) { return "Starts in " + t; }, now: "The duel has started — come in!",
          go: "Enter the arena", wopp: "Your opponent is not known yet", test: "Test duel (admin only)", h: " h ", m: " min",
          early: function (t) { return "The duel starts in " + t; }, wait: function (t) { return "Waiting for your opponent… " + t; }, here: "Your opponent is in the arena.", nothere: "Your opponent has not arrived yet.",
          sent: "Spell cast! Waiting for your opponent…", left: function (s) { return " · " + s + " s"; }, nxt: function (s) { return "Next round in " + s + " s"; },
          kelmadi: "Your opponent did not turn up — the win is yours.", kelmadim: "You did not turn up in time.", ikkalasi: "Neither of you turned up — the higher-rated duellist went through.",
          pts: function (n) { return "+" + n + " points for the Cup"; }, champ: "You are the duelling champion!", out: "The tournament is over for you. Try again next week!", tbl: "Tournament table", bot: "Test opponent" }
  };
  // Bosqich nomi: 2 - final, 4 - yarim final, 8 - chorak, 16 - 1/8; kattaroq to'rda - "1/16 final" va h.k.
  function duBosq(s) { var t = duT(); return t.st[s] || t.stN(s / 2); }
  function duBall(s) { var p = duData && duData.rules && duData.rules.points; return (p && p[String(s)]) || 0; }
  // Vaqt Toshkent bo'yicha "21:06"
  function duSoat(ts) { var d = new Date((ts + 5 * 3600) * 1000); return ("0" + d.getUTCHours()).slice(-2) + ":" + ("0" + d.getUTCMinutes()).slice(-2); }
  function duBotR(l) { var b = duData && duData.rules && duData.rules.bots; return (b && b[String(l)]) || { 1: 850, 2: 1050, 3: 1250 }[l]; }
  function duT() { return DU_T[lang] || DU_T.uz; }
  function duMS(s) { s = Math.max(0, Math.round(s)); return Math.floor(s / 60) + ":" + (s % 60 < 10 ? "0" : "") + (s % 60); }

  var DU_VAQT = 8000;        // afsunni chizishga vaqt (ms)
  var duData = null, du = null, duLocal = null;     // du: {game, tur, af, pts, user, drawing, t0, tm, busy}

  function duX() { return DU_X[lang] || DU_X.uz; }
  function duRaqImg(l) { return l === 3 ? IMG_DIR + "duel/r3.webp" : IMG_DIR + "duel/r" + l + ".webp"; }

  // Mahalliy ko'rik uchun namuna (server yo'q)
  function duSample(body) {
    if (!duLocal) { duLocal = { best: { 1: 190, 2: 0, 3: 0 }, g: null }; }
    var L = duLocal, res = { ok: true };
    if (body && body.start) { L.g = { id: 1, level: body.start, lives: 5, rlives: 5, round: 0, over: false, sum: 0 }; res.game = L.g; }
    if (body && body.move && L.g) {
      var g = L.g, his = DU_TUR[Math.floor(Math.random() * 3)], racc = Math.round([50, 68, 84][g.level - 1] + (Math.random() - 0.5) * 30), a = body.acc, w;
      var mk = a < 35 ? 0 : a + (DU_YENG[body.move] === his ? 25 : 0), rk = racc < 35 ? 0 : racc + (DU_YENG[his] === body.move ? 25 : 0);
      w = Math.abs(mk - rk) < 5 ? 0 : mk > rk ? 1 : -1;
      g.round++; g.sum += a; if (w > 0) { g.rlives--; } if (w < 0) { g.lives--; }
      g.over = g.lives <= 0 || g.rlives <= 0 || g.round >= 20; g.won = g.over && g.lives > g.rlives;
      g.score = g.won ? g.level * 100 + g.lives * 20 + Math.floor(g.sum / g.round * 0.5) : 0;
      if (g.won) { L.best[g.level] = Math.max(L.best[g.level], g.score); }
      if (g.over) { g.delta = g.won ? 9 : -7; }
      res.round = { mine: body.move, his: his, acc: a, racc: racc, win: w }; res.game = g;
    }
    if (body && body.history) {
      res.history = [{ k: "m", id: 3, stage: 4, won: true, why: "duel", lives: [2, 0], rounds: 7, saved: true, opp: { uid: 7, name: "Luna", house: "ravenclaw", seed: 4 }, time: new Date(Date.now() - 86400e3).toISOString() },
                     { k: "o", id: 12, level: 3, won: false, lives: [0, 3], rounds: 6, saved: true, time: new Date(Date.now() - 2 * 3600e3).toISOString() },
                     { k: "o", id: 11, level: 1, won: true, lives: [5, 0], rounds: 5, saved: false, time: new Date(Date.now() - 2 * 86400e3).toISOString() }];
    }
    if (body && body.replay) {
      var rr = [["hujum", 88, "hiyla", 61, 1], ["hiyla", 72, "hujum", 80, -1], ["himoya", 91, "hujum", 77, 1], ["hujum", 30, "himoya", 66, -1], ["hiyla", 85, "himoya", 70, 1], ["hujum", 79, "hujum", 77, 0], ["himoya", 83, "hujum", 58, 1]]
        .map(function (q) { return { mine: q[0], acc: q[1], his: q[2], racc: q[3], win: q[4] }; });
      res.replay = body.replay.k === "o" ? { k: "o", id: body.replay.id, level: 3, won: true, lives: [3, 0], start: 5, rounds: rr, me: true }
        : { k: "m", id: body.replay.id, stage: 4, why: "duel", me: true, won: true, p1: { uid: 1, name: "Sehrgar", house: "gryffindor", seed: 1 }, p2: { uid: 7, name: "Luna", house: "ravenclaw", seed: 4 }, lives: [3, 0], start: 5, rounds: rr };
      if (body.replay.id === 11) { res.replay.rounds = []; }
    }
    var tot = L.best[1] + L.best[2] + L.best[3];
    res.mine = { "1": L.best[1], "2": L.best[2], "3": L.best[3], total: tot };
    res.top = [{ uid: 5, name: "Germiona", house: "gryffindor", score: 880 }, { uid: 6, name: "Draco", house: "slytherin", score: 610 }, { uid: 1, name: "Sehrgar", house: "gryffindor", score: tot, me: true }, { uid: 7, name: "Luna", house: "ravenclaw", score: 150 }]
      .sort(function (p, q) { return q.score - p.score; });
    res.n = res.top.length; res.place = res.top.findIndex(function (p) { return p.me; }) + 1;
    var P = function (u, n, h, sd) { return { uid: u, name: n, house: h, seed: sd }; }, hozir = Date.now() / 1000, meId = (tgUser() || {}).id || 1;
    res.admin = false;
    res.now = hozir;
    res.rating = { r: 1042, games: 9, wins: 6, place: 3, n: 22 };
    res.top = [{ uid: 5, name: "Germiona", house: "gryffindor", score: 1175 }, { uid: 6, name: "Draco", house: "slytherin", score: 1090 }, { uid: meId, name: "Sehrgar", house: "gryffindor", score: 1042, me: true }, { uid: 7, name: "Luna", house: "ravenclaw", score: 1010 }];
    res.n = 22; res.place = 3;
    res.rules = { lives: 5, fail: 35, top: 16, round: 20, bonus: 25, match: 300, gap: 60, wait: 60, points: { "16": 5, "8": 10, "4": 20, "2": 30 }, bots: { "1": 850, "2": 1050, "3": 1250 } };
    if (!L.rej) { L.rej = "yozilish"; L.joined = false; }
    if (body && body.join != null) { L.joined = !!body.join; res.join_ok = true; }
    var ism = ["Germiona", "Draco", "Sehrgar", "Luna", "Sedrik", "Ron", "Nevill", "Parvati", "Jinni"], uy = ["gryffindor", "slytherin", "gryffindor", "ravenclaw", "hufflepuff", "gryffindor", "gryffindor", "gryffindor", "gryffindor"];
    var rr = [1175, 1090, 1042, 1010, 1004, 990, 975, 960, 948];
    var kim = function (i) { return P(i === 2 ? meId : 100 + i, ism[i], uy[i], i + 1); };
    if (L.rej === "yozilish") {
      var royxat = ism.map(function (n, i) { return { uid: i === 2 ? meId : 100 + i, name: n, house: uy[i], r: rr[i], me: i === 2 }; }).filter(function (p) { return !p.me || L.joined; });
      res.tour = { ts: hozir + 2 * 86400 + 5 * 3600, now: hozir, open: true, joined: L.joined, n: royxat.length, close: 300, players: royxat };
      res.cup = { size: null, hour: 21 };
    } else {
      // 9 kishi: 16 talik to'r - 7 kuchli birinchi bosqichni o'tkazib yuboradi, 8- va 9-o'rin o'ynaydi
      var T0 = hozir - 400, bye = function (id, i) { return { id: id, a: kim(i), b: null, winner: kim(i).uid, state: "tugadi", lives: [5, 5], why: "bye", rounds: 0 }; };
      res.tour = { ts: T0, now: hozir, open: false, joined: true, n: 9, close: 300, players: [] };
      res.cup = { size: 16, hour: 21, wait: 60, now: hozir, match_t: 300, gap: 60, my: { id: 23, stage: 8, ts: T0 + 360, ready: true }, stages: [
        { stage: 16, ts: T0, points: 5, matches: [bye(1, 0), { id: 2, a: kim(7), b: kim(8), winner: kim(7).uid, state: "tugadi", lives: [3, 0], why: "duel", rounds: 7 }, bye(3, 3), bye(4, 4), bye(5, 1), bye(6, 6), bye(7, 2), bye(8, 5)] },
        { stage: 8, ts: T0 + 360, points: 10, matches: [
          { id: 20, a: kim(0), b: kim(7), winner: null, state: "ketmoqda", lives: [4, 3], why: null, rounds: 3 },
          { id: 22, a: kim(3), b: kim(4), winner: kim(3).uid, state: "tugadi", lives: [5, 5], why: "kelmadi", rounds: 0 },
          { id: 21, a: kim(1), b: kim(6), winner: null, state: "kutmoqda", lives: [5, 5], why: null, rounds: 0 },
          { id: 23, a: kim(2), b: kim(5), winner: null, state: "ketmoqda", lives: [5, 4], why: null, rounds: 1 }] },
        { stage: 4, ts: T0 + 720, points: 20, matches: [{ id: 30, a: null, b: kim(3), winner: null, state: "kutmoqda", lives: [5, 5], why: null, rounds: 0 }, { id: 31, a: null, b: null, winner: null, state: "kutmoqda", lives: [5, 5], why: null, rounds: 0 }] },
        { stage: 2, ts: T0 + 1080, points: 30, matches: [{ id: 40, a: null, b: null, winner: null, state: "kutmoqda", lives: [5, 5], why: null, rounds: 0 }] }] };
    }
    return res;
  }
  // Mahalliy soxta arena: 6 s kutish -> raundlar (raqib 2 s da yuradi) -> natija
  var duArL = null;
  function duArSample(body) {
    var n = Date.now(), A = duArL;
    if (!A || body.sinov) { A = duArL = { bosh: n + 6000, r: 0, rb: 0, l: 5, rl: 5, mv: null, last: null, over: false }; if (body.sinov) { return { ok: true, test_id: 1, mine: duSample({}).mine, top: [], cup: null }; } }
    if (!A.over && n >= A.bosh && A.r === 0) { A.r = 1; A.rb = n; }
    if (!A.over && A.r && n >= A.rb) {
      if (body.move && !A.mv) { A.mv = [body.move, body.acc]; A.mt = n; }
      if ((A.mv && n >= A.mt + 1500) || n >= A.rb + 30000) {
        var his = DU_TUR[Math.floor(Math.random() * 3)], racc = 55 + Math.round(Math.random() * 35), m = A.mv || ["hujum", 0], w;
        var mk2 = m[1] < 35 ? 0 : m[1] + (DU_YENG[m[0]] === his ? 25 : 0), rk2 = racc + (DU_YENG[his] === m[0] ? 25 : 0);
        w = Math.abs(mk2 - rk2) < 5 ? 0 : mk2 > rk2 ? 1 : -1;
        if (w > 0) { A.rl--; } if (w < 0) { A.l--; }
        A.last = { r: A.r, mine: m[0], acc: m[1], his: his, racc: racc, win: w }; A.mv = null; A.rb = n + 6000;
        if (A.l <= 0 || A.rl <= 0) { A.over = true; } else { A.r++; }
      }
    }
    var ph = A.over ? (n < A.rb ? "reveal" : "over") : A.r === 0 ? "early" : n < A.rb ? "reveal" : "pick";
    return { ok: true, arena: { id: 1, stage: 2, test: true, phase: ph, starts_in: Math.max(0, Math.round((A.bosh - n) / 1000)), wait_left: 300, round: A.r,
      deadline_in: ph === "pick" ? Math.max(0, Math.round((A.rb + 30000 - n) / 1000)) : 0, next_in: ph === "reveal" ? Math.max(0, Math.round((A.rb - n) / 1000)) : 0,
      lives: A.l, rlives: A.rl, moved: !!A.mv, opp: { uid: 0, name: "Sinov raqibi", house: null, seed: 0, here: true }, last: A.last, over: A.over, won: A.over && A.l > A.rl, why: "duel" } };
  }
  function duPost(body, cb) {
    if (!window.fetch) { return; }
    if (MS_LOCAL && body && (body.arena != null || body.sinov)) { setTimeout(function () { cb(duArSample(body)); }, 60); return; }
    window.fetch(API_DUEL, { method: "POST", headers: { "Content-Type": "application/json", "X-Telegram-Init-Data": drInit() }, body: JSON.stringify(body || {}) })
      .then(function (r) { return r.json(); })
      .then(function (res) { cb(res && (res.mine || res.arena) ? res : (MS_LOCAL ? duSample(body) : res)); })
      ["catch"](function () { cb(MS_LOCAL ? duSample(body) : null); });
  }

  function duOpen() {
    drShowGame("scr-duel");
    duStop();
    duHome();
    duPost({}, function (res) { if (res && res.mine) { duData = res; if (!du) { duHome(); } } else if (!duData) { showToast(drX().fail, "err"); } });
  }
  function duStop() { if (du) { clearTimeout(du.tm); clearTimeout(du.poll); cancelAnimationFrame(du.raf || 0); } du = null; }

  function duBonus() { return (duData && duData.rules && duData.rules.bonus) || 25; }
  function duJonlar() { return (duData && duData.rules && duData.rules.lives) || 5; }     // har duelchida 5 jon (egasi, 2026-10-09)
  function duJon(el, n) {
    el.innerHTML = "";
    for (var i = 0; i < duJonlar(); i++) { el.appendChild(drEl("i", i < n ? "on" : "")); }
  }

  /* ---------- bosh ko'rinish: raqiblar, turnir rejasi, saralash jadvali ---------- */
  function duHome() {
    var x = duX(), d = duData;
    $("du-kick").textContent = x.kick;
    $("du-ttl").textContent = x.ttl;
    $("du-home").classList.remove("hidden");
    $("du-game").classList.add("hidden");
    $("du-hist").classList.add("hidden");
    $("du-rep").classList.add("hidden");
    duKorinish = "home";
    duHero();
    duUch();
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
      tx.appendChild(drEl("span", "", x.best(duBotR(l))));
      c.appendChild(tx);
      c.addEventListener("click", function () { duStart(l); });
      box.appendChild(c);
    });
    $("du-info-b").classList.remove("hidden");
    duCup();
    $("du-top-t").textContent = x.topT;
    $("du-mine").textContent = d && d.rating && d.rating.games ? x.mine(d.rating.r, d.place, d.n) : "";
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

  /* ---------- sahifa tepasi (egasi, 2026-10-10): o'rin, saralash bali, holat, «Duellar tarixi» ---------- */
  var duKorinish = "home", duRepDan = "home";
  function duVaqt(sek) {
    var t = duT();
    sek = Math.max(0, Math.round(sek));
    return sek >= 3600 ? Math.floor(sek / 3600) + t.h + Math.floor(sek % 3600 / 60) + t.m : duMS(sek);
  }
  function duQol(sek) {
    var t = duT();
    sek = Math.max(0, Math.round(sek));
    return sek >= 86400 ? Math.floor(sek / 86400) + " " + t.kunQ + " " + Math.floor(sek % 86400 / 3600) + t.h.replace(/\s+$/, "") : duVaqt(sek);
  }
  function duYozil(on) {
    duPost({ join: on ? 1 : 0 }, function (res) {
      if (res && res.mine) { duData = res; duHome(); if (res.join_ok === false) { showToast(duT().tYopiq, "err"); } }
      else { showToast(drX().fail, "err"); }
    });
  }
  function duMen() { return (tgUser() || {}).id || (MS_LOCAL ? 1 : 0); }     // mahalliy ko'rikda namuna o'quvchi = 1
  // O'quvchining to'rdagi hozirgi uchrashuvi (raqib nomi uchun)
  function duMeniki(c) {
    var topildi = null;
    if (!c || !c.my || !c.stages) { return null; }
    c.stages.forEach(function (st) { st.matches.forEach(function (m) { if (m.id === c.my.id) { topildi = m; } }); });
    return topildi;
  }
  /* Tepa karta (egasi, 2026-10-10: turnirda O'RIN muhim emas - kim qaysi to'rda va qayerda ekani muhim):
     halqa va o'rin YO'Q; katta yozuv - turnir holati (qachon / o'z dueli va raqibi), reyting - burchakda kichik. */
  function duHero() {
    var box = $("du-hero"), d = duData, t = duT();
    if (!box) { return; }
    box.innerHTML = "";
    var rt = (d && d.rating) || { r: 1000 }, c = d && d.cup, tr = d && d.tour, meId = duMen();
    var tep = drEl("div", "du-h-t"), chap = drEl("span", "du-h-m");
    chap.appendChild(drEl("small", "", t.turT));
    var sar = "", izoh = "", tugma = null;
    if (c && c.size) {
      if (c.my) {
        var m = duMeniki(c), raq = m ? ((m.a && m.a.uid === meId) ? m.b : m.a) : null, qol = c.my.ts - c.now;
        sar = duBosq(c.my.stage) + " · " + duSoat(c.my.ts);
        izoh = (raq ? t.raqib(raq.name) + " · " : "") + (!c.my.ready ? t.wopp : qol > 0 ? t.in_(duVaqt(qol)) : t.now);
        if (c.my.ready) { tugma = [t.go, function () { duArena(c.my.id); }]; }
      } else {
        var bormi = false;
        c.stages.forEach(function (st) { st.matches.forEach(function (x) { if ((x.a && x.a.uid === meId) || (x.b && x.b.uid === meId)) { bormi = true; } }); });
        var chempion = bormi && c.stages.some(function (st) { return st.stage === 2 && st.matches[0] && st.matches[0].winner === meId; });
        sar = chempion ? duX().won : t.turT;
        izoh = chempion ? t.champ : bormi ? t.out : t.tYoz;
      }
    } else if (c && c.size === 0) { sar = t.turT; izoh = t.kam; }
    else if (tr) {
      var qolT = tr.ts - tr.now, kunNomi = t.tKunlar[new Date((tr.ts + 5 * 3600) * 1000).getUTCDay()];
      sar = kunNomi.charAt(0).toUpperCase() + kunNomi.slice(1) + ", 21:00";
      izoh = duQol(qolT) + " " + (t.qoldi || "") + (tr.open ? " · " + t.tSoni(tr.n) : "");
      if (!tr.open) { izoh = (c && c.from) ? t.tKeyin : t.tYopiq; }
    }
    chap.appendChild(drEl("b", "", sar));
    if (izoh) { chap.appendChild(drEl("em", "", izoh)); }
    tep.appendChild(chap);
    var rc = drEl("span", "du-h-r");
    rc.appendChild(drEl("small", "", t.rey));
    rc.appendChild(drEl("b", "", String(rt.r)));
    tep.appendChild(rc);
    box.appendChild(tep);
    if (tugma) {
      var tb = drEl("div", "du-yoz"), gb = drEl("button", "dr-btn", tugma[0]);
      gb.type = "button";
      gb.addEventListener("click", tugma[1]);
      tb.appendChild(gb);
      box.appendChild(tb);
    } else if (tr && tr.open) {
      var yb = drEl("div", "du-yoz" + (tr.joined ? " bor" : ""));
      if (tr.joined) {
        yb.appendChild(drEl("b", "", t.tBor));
        var ch = drEl("button", "", t.tChiq);
        ch.type = "button";
        ch.addEventListener("click", function () { duYozil(false); });
        yb.appendChild(ch);
      } else {
        var qb = drEl("button", "dr-btn", t.tQat);
        qb.type = "button";
        qb.addEventListener("click", function () { duYozil(true); });
        yb.appendChild(qb);
      }
      box.appendChild(yb);
    }
    var hb = drEl("button", "dr-hero-q du-hero-b");
    hb.type = "button";
    hb.innerHTML = '<span class="qo-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.2 2"/></svg></span>';
    var hs = document.createElement("span");
    hs.appendChild(drEl("b", "", t.hist));
    hb.appendChild(hs);
    hb.appendChild(drEl("i", "", "›"));
    hb.addEventListener("click", duHist);
    box.appendChild(hb);
  }
  /* «i» tugmasi (egasi, 2026-10-10): turnir haqidagi hamma ma'lumot bitta oynada; sonlar serverdagi qoidalardan */
  function duInfoMatn() {
    var q = (duData && duData.rules) || {}, pt = q.points || {};
    var r = { jon: q.lives || 5, raund: q.round || 20, bonus: q.bonus || 25, fail: q.fail || 35, match: Math.round((q.match || 300) / 60), gap: Math.round((q.gap || 60) / 60),
      wait: Math.round((q.wait || 60) / 60), yop: Math.round((((duData && duData.tour) || {}).close || 300) / 60), p16: pt["16"] || 5, p8: pt["8"] || 10, p4: pt["4"] || 20, p2: pt["2"] || 30 };
    if (lang === "ru") { return [["Когда", "Раз в неделю — в воскресенье в 21:00 (время Ташкента). Победитель определяется в тот же вечер."],
      ["Кто участвует", "Отбора нет. Играет каждый, кто нажал «Участвую». Запись закрывается за " + r.yop + " мин. до начала — после этого составляется сетка."],
      ["Как составляется сетка", "Турнир на выбывание: победитель идёт дальше, проигравший выбывает. Если участников не хватает на полную сетку, дуэлянты с более высоким рейтингом пропускают первый круг («ждёт»), остальные играют в нём."],
      ["Как проходит дуэль", "У каждого " + r.jon + " жизней. В каждом раунде вы выбираете тип и рисуете заклинание (" + r.raund + " секунд). Атака бьёт хитрость, хитрость — защиту, защита — атаку: сильный тип даёт +" + r.bonus + " к силе. Сила — это точность рисунка; у кого сила выше, тот отнимает у соперника жизнь. При точности ниже " + r.fail + " заклинание не срабатывает."],
      ["Время", "На дуэль — не больше " + r.match + " минут. Если время вышло, побеждает тот, у кого осталось больше жизней. Между кругами перерыв " + r.gap + " мин. Кто не вошёл на арену за " + r.wait + " мин. после начала — проигрывает."],
      ["Очки", "За победу — очки в кубок факультета: в 1/8 финала +" + r.p16 + ", в четвертьфинале +" + r.p8 + ", в полуфинале +" + r.p4 + ", в финале +" + r.p2 + ". За более ранние круги и за пропуск круга очков нет."],
      ["Рейтинг дуэлянта", "Все начинают с 1000. Победа повышает рейтинг, поражение понижает; за победу над сильным соперником прибавляется больше. Тренировочные дуэли тоже считаются, но слабее."],
      ["Напоминание", "Записавшимся сова приносит напоминание утром в день турнира и за 10 минут до начала."]]; }
    if (lang === "en") { return [["When", "Once a week — on Sunday at 21:00 (Tashkent time). The winner is decided that same evening."],
      ["Who plays", "No qualifying. Everyone who taps “I'm in” plays. Sign-up closes " + r.yop + " minutes before the start — then the bracket is drawn."],
      ["How the bracket works", "It is a knockout: the winner moves on, the loser is out. If there are not enough players for a full bracket, higher-rated duellists skip the first round (“bye”) and the rest play it."],
      ["How a duel works", "Each duellist has " + r.jon + " lives. Every round you pick a type and draw the spell (" + r.raund + " seconds). Attack beats trick, trick beats defence, defence beats attack: the stronger type adds +" + r.bonus + " power. Power is your drawing accuracy; the higher power takes one life. Below " + r.fail + " accuracy the spell fails."],
      ["Time", "A duel lasts " + r.match + " minutes at most. When time runs out, the one with more lives wins. There is a " + r.gap + "-minute break between rounds. Anyone who has not entered the arena within " + r.wait + " minute(s) loses."],
      ["Points", "A win earns House Cup points: +" + r.p16 + " in the round of 16, +" + r.p8 + " in the quarter-final, +" + r.p4 + " in the semi-final, +" + r.p2 + " in the final. No points for earlier rounds or for a bye."],
      ["Duel rating", "Everyone starts at 1000. A win raises it, a loss lowers it; beating a stronger opponent gives more. Practice duels count too, but less."],
      ["Reminder", "If you signed up, an owl reminds you on the morning of the tournament and 10 minutes before it starts."]]; }
    return [["Qachon", "Haftada bir marta — yakshanba kuni soat 21:00 da (Toshkent vaqti). G'olib shu oqshomning o'zida aniqlanadi."],
      ["Kim qatnashadi", "Saralash yo'q. «Qatnashaman» tugmasini bosgan har bir o'quvchi o'ynaydi. Yozilish turnirdan " + r.yop + " daqiqa oldin yopiladi — shundan keyin to'r tuziladi."],
      ["To'r qanday tuziladi", "Turnir — olib tashlash usulida: yutgan keyingi bosqichga o'tadi, yutqazgan turnirni tark etadi. Ishtirokchilar soni to'rga to'liq yetmasa, duel reytingi yuqori bo'lganlar birinchi bosqichni o'tkazib yuboradi («kutadi»), qolganlar o'sha bosqichda bellashadi."],
      ["Duel qanday o'tadi", "Har duelchida " + r.jon + " ta jon. Har raundda tur tanlaysiz va afsunni chizasiz (" + r.raund + " soniya). Hujum hiylani, hiyla himoyani, himoya hujumni yengadi: ustun tur kuchga +" + r.bonus + " qo'shadi. Kuch — chizish aniqligi; kimning kuchi baland bo'lsa, raqibining bir joni ketadi. Aniqlik " + r.fail + " dan past bo'lsa afsun chiqmaydi."],
      ["Vaqt", "Bir duelga eng ko'pi " + r.match + " daqiqa. Vaqt tugasa — joni ko'p qolgan yutadi. Bosqichlar orasida " + r.gap + " daqiqa tanaffus. Duel boshlanganidan " + r.wait + " daqiqa ichida arenaga kirmagan duelchi yutqazadi."],
      ["Ballar", "G'alaba uchun fakultet kubogiga ball: 1/8 finalda +" + r.p16 + ", chorak finalda +" + r.p8 + ", yarim finalda +" + r.p4 + ", finalda +" + r.p2 + ". Oldingi bosqichlar va o'tkazib yuborilgan bosqich uchun ball yo'q."],
      ["Duel reytingi", "Hamma 1000 dan boshlaydi. G'alaba reytingni oshiradi, mag'lubiyat tushiradi; kuchli raqibni yengsangiz ko'proq qo'shiladi. Mashq duellari (kompyuter raqiblar) ham hisobga olinadi, lekin kamroq."],
      ["Eslatma", "Turnirga yozilganlarga turnir kuni ertalab va boshlanishiga 10 daqiqa qolganda boyo'g'li xabar olib keladi."]];
  }
  function duInfo() {
    var eski = $("du-info");
    if (eski) { eski.parentNode.removeChild(eski); }
    var orqa = drEl("div", "du-info"), oyna = drEl("div", "du-info-p"), yop = function () { if (orqa.parentNode) { orqa.parentNode.removeChild(orqa); } };
    orqa.id = "du-info";
    var bosh = drEl("div", "du-info-h");
    bosh.appendChild(drEl("b", "", duT().turT));
    var xb = drEl("button", "", "×");
    xb.type = "button";
    xb.addEventListener("click", yop);
    bosh.appendChild(xb);
    oyna.appendChild(bosh);
    var tana = drEl("div", "du-info-b");
    duInfoMatn().forEach(function (b, i) {
      var q = drEl("div", "du-info-q");
      q.appendChild(drEl("u", "", String(i + 1)));
      var m = document.createElement("span");
      m.appendChild(drEl("b", "", b[0]));
      m.appendChild(drEl("p", "", b[1]));
      q.appendChild(m);
      tana.appendChild(q);
    });
    oyna.appendChild(tana);
    orqa.appendChild(oyna);
    orqa.addEventListener("click", function (e) { if (e.target === orqa) { yop(); } });
    document.body.appendChild(orqa);
  }

  // Uch tur qoidasi - matn o'rniga belgilar: hujum › hiyla › himoya › hujum
  function duUch() {
    var box = $("du-uch"), x = duX(), t = duT();
    if (!box) { return; }
    box.innerHTML = "";
    var q = drEl("div", "du-uch-r");
    ["hujum", "hiyla", "himoya", "hujum"].forEach(function (tur, i) {
      if (i) { q.appendChild(drEl("i", "", "›")); }
      var c = drEl("span", "du-uch-c" + (i === 3 ? " xira" : ""));
      c.style.setProperty("--tr", DU_RGB[tur]);
      c.innerHTML = DU_IC[tur];
      c.appendChild(drEl("b", "", x.tur[tur]));
      q.appendChild(c);
    });
    box.appendChild(q);
    box.appendChild(drEl("small", "", t.uchN.replace("25", String(duBonus()))));
  }

  /* ---------- turnir kartasi: o'z dueli, to'r (juftliklar kartada; tugagan duel bosilsa - raund-raund ko'riladi) ---------- */
  function duCup() {
    var x = duX(), t = duT(), box = $("du-cup"), c = duData && duData.cup, tr = duData && duData.tour;
    box.innerHTML = "";
    // admin sinov tugmasi to'r ustida emas - pastdagi qoida kartasida (o'quvchi ko'rinishiga xalal bermasin)
    var planK = $("du-plan");
    planK.innerHTML = "";
    planK.classList.toggle("hidden", !(duData && duData.admin));
    if (duData && duData.admin) {
      var tb = drEl("button", "qr-b du-test", t.test);
      tb.type = "button";
      tb.addEventListener("click", function () { duPost({ sinov: 1 }, function (res) { if (res && res.test_id) { duArena(res.test_id); } else { showToast(drX().fail, "err"); } }); });
      planK.appendChild(tb);
    }
    if (!c) { return; }
    if (c.from) { box.appendChild(drEl("p", "du-cup-n", t.from)); return; }
    if (c.size == null) {                               // to'r hali tuzilmagan: yozilganlar ro'yxati (reyting bo'yicha)
      if (tr && tr.players && tr.players.length) {
        var sq = drEl("span", "du-st-t");
        sq.appendChild(drEl("b", "", t.qatT));
        sq.appendChild(drEl("em", "", t.tSoni(tr.n)));
        box.appendChild(sq);
        var ql = drEl("div", "du-qat");
        tr.players.forEach(function (p) {
          var r = drEl("span", "du-qat-p" + (p.me ? " men" : ""));
          var cr = cupCrestImg(p.house, 16);
          if (cr) { r.appendChild(cr); }
          r.appendChild(drEl("b", "", p.name));
          ql.appendChild(r);
        });
        box.appendChild(ql);
        box.appendChild(drEl("p", "du-qat-n", t.yozS));
      }
      return;
    }
    if (!c.size) { box.appendChild(drEl("p", "du-cup-n", t.kam)); return; }
    duTor(box, c);
  }
  /* TURNIR TO'RI - daraxt (egasi, 2026-10-10: «turnirda muhimi - kim qaysi to'rda va qayerida ekani»).
     Har bosqich - ustun; uchrashuvlar chiziqlar bilan keyingi bosqichga ulanadi; yonga suriladi. O'quvchining o'z
     uchrashuvlari oltin hoshiyada, sahifa ochilganda uning hozirgi bosqichi ko'rinadigan qilib suriladi.
     Birinchi bosqichni o'tkazib yuboradiganlar o'z joyida, bitta qatorli xira katakda («kutadi»). */
  function duTor(box, c) {
    var t = duT(), meId = duMen(), birinchi = c.stages[0].matches.length, QATOR = 62;
    var sar = drEl("span", "du-st-t");
    sar.appendChild(drEl("b", "", t.torT));
    sar.appendChild(drEl("em", "", t.surish));
    box.appendChild(sar);
    var br = drEl("div", "du-br"), ich = drEl("div", "du-br-i"), menUstun = null;
    c.stages.forEach(function (s, si) {
      var col = drEl("div", "du-br-c");
      var bosh = drEl("div", "du-br-h");
      bosh.appendChild(drEl("b", "", duBosq(s.stage)));
      bosh.appendChild(drEl("small", "", duSoat(s.ts) + (s.points ? " · " + t.ball(s.points) : "")));
      col.appendChild(bosh);
      var tana = drEl("div", "du-br-b");
      tana.style.height = (birinchi * QATOR) + "px";
      s.matches.forEach(function (m) {
        var tugadi = m.state === "tugadi", kelmadi = m.why === "kelmadi" || m.why === "ikkalasi", bye = m.why === "bye";
        var meniki = (m.a && m.a.uid === meId) || (m.b && m.b.uid === meId);
        if (meniki && !tugadi) { menUstun = col; }
        if (meniki && !menUstun) { menUstun = col; }
        var joy = drEl("div", "du-br-m" + (si === c.stages.length - 1 ? " oxir" : ""));
        var ochiladi = tugadi && m.rounds && !bye;
        var card = drEl(ochiladi ? "button" : "div", "du-bc" + (meniki ? " men" : "") + (m.state === "ketmoqda" ? " jonli" : "") + (bye ? " bye" : ""));
        if (ochiladi) { card.type = "button"; card.addEventListener("click", function () { duRep("m", m.id, "home"); }); }
        var yon = function (p, jon) {
          var e = drEl("span", "du-bc-p" + (p && m.winner === p.uid && !bye ? " g" : "") + (p && m.winner && m.winner !== p.uid ? " y" : "") + (p && p.uid === meId ? " siz" : ""));
          if (!p) { e.appendChild(drEl("b", "tbd", "—")); return e; }
          var cr = cupCrestImg(p.house, 14);
          if (cr) { e.appendChild(cr); }
          e.appendChild(drEl("b", "", p.name));
          if (bye) { e.appendChild(drEl("em", "yoq", t.kutadi)); }
          else if (m.state !== "kutmoqda" && !kelmadi) { e.appendChild(drEl("em", "", String(jon))); }
          else if (tugadi && kelmadi && m.winner !== p.uid) { e.appendChild(drEl("em", "yoq", t.kelmadiQ)); }
          return e;
        };
        card.appendChild(yon(m.a, m.lives[0]));
        if (!bye) { card.appendChild(yon(m.b, m.lives[1])); }
        if (m.state === "ketmoqda") { card.appendChild(drEl("i", "du-bc-j", t.jonli)); }
        joy.appendChild(card);
        tana.appendChild(joy);
      });
      col.appendChild(tana);
      ich.appendChild(col);
    });
    br.appendChild(ich);
    box.appendChild(br);
    // o'quvchining hozirgi bosqichi ko'rinib tursin
    if (menUstun) { setTimeout(function () { try { br.scrollLeft = Math.max(0, menUstun.offsetLeft - 12); } catch (e) {} }, 60); }
  }

  /* ---------- duellar tarixi va raund-raund qayta ko'rish (server: {history: 1}, {replay: {k, id}}) ---------- */
  function duKor(qaysi) {
    duKorinish = qaysi;
    $("du-info-b").classList.add("hidden");
    $("du-home").classList.toggle("hidden", qaysi !== "home");
    $("du-hist").classList.toggle("hidden", qaysi !== "hist");
    $("du-rep").classList.toggle("hidden", qaysi !== "rep");
    $("du-game").classList.add("hidden");
    try { window.scrollTo(0, 0); } catch (e) {}
  }
  function duNatijaChip(yutdi) { var t = duT(); return drEl("span", "du-nt " + (yutdi ? "g" : "m"), yutdi ? t.gal : t.mag); }
  function duHist() {
    var t = duT(), x = duX(), box = $("du-h-list");
    duKor("hist");
    $("du-ttl").textContent = t.hist;
    box.innerHTML = "";
    box.appendChild(drEl("p", "rk-bosh", drX().loading || "…"));
    duPost({ history: 1 }, function (res) {
      if (duKorinish !== "hist") { return; }
      var h = (res && res.history) || [];
      box.innerHTML = "";
      if (!h.length) { box.appendChild(drEl("p", "rk-bosh", t.histBosh)); return; }
      h.forEach(function (g) {
        var row = drEl("button", "du-hr"), rasm = drEl("span", "du-hr-im");
        row.type = "button";
        if (g.k === "o") { var im = document.createElement("img"); im.alt = ""; im.src = duRaqImg(g.level); rasm.appendChild(im); }
        else { var cr = g.opp ? cupCrestImg(g.opp.house, 0) : null; if (cr) { rasm.appendChild(cr); } rasm.classList.add("gerb"); }
        row.appendChild(rasm);
        var tx = drEl("span", "du-hr-tx");
        tx.appendChild(drEl("b", "", g.k === "o" ? x.raq[g.level - 1] : ((g.opp && g.opp.name) || "Sehrgar")));
        var izoh = (g.k === "m" ? t.st[g.stage] + " · " : "") + (g.why === "kelmadi" || g.why === "ikkalasi" ? t.kelmadiQ : t.rnd(g.rounds) + " · " + t.jon + " " + g.lives[0] + " : " + g.lives[1]);
        var sana = "";
        try { sana = csDate(g.time); } catch (e) { sana = ""; }
        tx.appendChild(drEl("small", "", izoh + (sana ? " · " + sana : "")));
        row.appendChild(tx);
        row.appendChild(duNatijaChip(g.won));
        row.addEventListener("click", function () { duRep(g.k, g.id, "hist"); });
        box.appendChild(row);
      });
    });
  }
  function duTurChip(tur, acc, ustun) {
    var x = duX(), t = duT(), c = drEl("span", "du-rc");
    c.style.setProperty("--tr", DU_RGB[tur] || "150,150,150");
    c.innerHTML = DU_IC[tur] || "";
    c.appendChild(drEl("b", "", x.tur[tur] || tur));
    var fail = (duData && duData.rules && duData.rules.fail) || 35;
    c.appendChild(drEl("em", acc < fail ? "yoq" : "", acc < fail ? t.chiq : acc + (ustun ? " +" + duBonus() : "")));
    return c;
  }
  function duRep(k, id, qayerdan) {
    var t = duT(), x = duX(), box = $("du-rep");
    duRepDan = qayerdan || "home";
    duKor("rep");
    box.innerHTML = "";
    box.appendChild(drEl("p", "rk-bosh", drX().loading || "…"));
    duPost({ replay: { k: k, id: id } }, function (res) {
      if (duKorinish !== "rep") { return; }
      var r = res && res.replay;
      box.innerHTML = "";
      if (!r) { box.appendChild(drEl("p", "rk-bosh", drX().fail)); return; }
      $("du-ttl").textContent = r.k === "m" ? t.st[r.stage] : x.raq[r.level - 1];
      var n1 = r.k === "m" ? (r.me ? t.rSiz : r.p1.name) : t.rSiz, n2 = r.k === "m" ? r.p2.name : x.raq[r.level - 1];
      var bosh = drEl("div", "du-rp-h");
      var tomon = function (nom, jon, gol) { var e = drEl("span", "du-rp-s" + (gol ? " g" : "")); e.appendChild(drEl("b", "", nom)); var j = drEl("span", "du-jon"); for (var i = 0; i < r.start; i++) { j.appendChild(drEl("i", i < jon ? "on" : "")); } e.appendChild(j); return e; };
      bosh.appendChild(tomon(n1, r.lives[0], r.won));
      bosh.appendChild(r.me ? duNatijaChip(r.won) : drEl("span", "du-nt", "VS"));
      bosh.appendChild(tomon(n2, r.lives[1], !r.won));
      box.appendChild(bosh);
      if (!r.rounds.length) { box.appendChild(drEl("p", "rk-bosh", r.why === "kelmadi" || r.why === "ikkalasi" ? t[r.why] || t.kelmadiQ : t.eski)); return; }
      var j1 = r.start, j2 = r.start;
      r.rounds.forEach(function (q, i) {
        if (q.win > 0) { j2--; } else if (q.win < 0) { j1--; }
        var row = drEl("div", "du-rr " + (q.win > 0 ? "w1" : q.win < 0 ? "w2" : "w0"));
        row.appendChild(drEl("u", "", String(i + 1)));
        row.appendChild(duTurChip(q.mine, q.acc, DU_YENG[q.mine] === q.his));
        row.appendChild(drEl("i", "", q.win > 0 ? "›" : q.win < 0 ? "‹" : "="));
        row.appendChild(duTurChip(q.his, q.racc, DU_YENG[q.his] === q.mine));
        row.appendChild(drEl("small", "", j1 + " : " + j2));
        box.appendChild(row);
      });
    });
  }

  /* ---------- arena: jonli duel (pley-off) ---------- */
  function duArena(id) {
    var x = duX();
    duStop();
    du = { mode: "ar", arena: id, game: { lives: duJonlar(), rlives: duJonlar(), round: 0 }, rnd: 0, shown: 0, step: "" };
    $("du-home").classList.add("hidden");
    $("du-game").classList.remove("hidden");
    $("du-res").classList.add("hidden");
    $("du-turs").classList.add("hidden");
    $("du-draw").classList.add("hidden");
    $("du-rev").classList.add("hidden");
    $("du-msg").textContent = "…";
    $("du-m-nom").textContent = x.you;
    var av = $("du-m-im"), me = cupMe(), ci = cupCrestImg(me.house || house, 54);
    av.innerHTML = "";
    if (ci) { av.appendChild(ci); }
    duHearts();
    try { window.scrollTo(0, 0); } catch (e) {}
    duArTick();
  }
  function duArTick(body) {
    if (!du || du.mode !== "ar") { return; }
    var id = du.arena, so = body || { arena: id };
    clearTimeout(du.poll);
    duPost(so, function (res) {
      if (!du || du.mode !== "ar" || du.arena !== id) { return; }
      if (res && res.arena) { duArApply(res.arena); }
      if (du && du.mode === "ar" && !du.done) { du.poll = setTimeout(duArTick, 1500); }
    });
  }
  function duArApply(ar) {
    var x = duX(), t = duT();
    du.ar = ar;
    du.game = { lives: ar.lives, rlives: ar.rlives, round: Math.max(0, ar.round - 1) };
    du.oppName = ar.opp.uid ? ar.opp.name : t.bot;
    $("du-r-nom").textContent = du.oppName;
    var rim = $("du-r-im"), src = ar.opp.house ? (cupCrestImg(ar.opp.house, 54) || {}).src : IMG_DIR + "duel/r4.webp";
    if (src && rim.getAttribute("data-s") !== src) { rim.setAttribute("data-s", src); rim.src = src; rim.classList.toggle("gerb", !!ar.opp.house); }
    if (ar.phase === "early" || ar.phase === "wait") {
      duHearts();
      $("du-msg").textContent = (ar.phase === "early" ? t.early(duMS(ar.starts_in)) : t.wait(duMS(ar.wait_left))) + " " + (ar.opp.here ? t.here : t.nothere);
      return;
    }
    if (ar.phase === "pick") {
      if (du.rnd !== ar.round) { du.rnd = ar.round; du.step = "pick"; du.busy = false; clearTimeout(du.tm); duPick(); }
      if (ar.moved && du.step !== "sent") { du.step = "sent"; du.busy = true; clearTimeout(du.tm); $("du-turs").classList.add("hidden"); $("du-draw").classList.add("hidden"); }
      if (du.step === "sent") { $("du-msg").textContent = t.sent + t.left(ar.deadline_in); }
      else if (du.step === "pick") { $("du-msg").textContent = x.pick(ar.round) + t.left(ar.deadline_in); }
      return;
    }
    if (ar.last && du.shown !== ar.last.r) {
      du.shown = ar.last.r; du.step = "rev"; du.busy = true; clearTimeout(du.tm);
      $("du-turs").classList.add("hidden");
      duReveal(ar.last);
    }
    if (ar.phase === "reveal" && !ar.over) { var nx = $("du-nxt"); if (nx) { nx.textContent = t.nxt(ar.next_in); } }
    if (ar.phase === "over" && !du.done) { du.done = true; clearTimeout(du.poll); duArEnd(ar); }
  }
  function duArEnd(ar) {
    var x = duX(), t = duT(), box = $("du-res");
    duHearts();
    $("du-turs").classList.add("hidden");
    $("du-draw").classList.add("hidden");
    if (ar.why !== "duel") { $("du-rev").classList.add("hidden"); }
    $("du-msg").textContent = ar.why === "kelmadi" ? (ar.won ? t.kelmadi : t.kelmadim) : ar.why === "ikkalasi" ? t.ikkalasi : ar.why === "vaqt" ? t.vaqtT : "";
    box.innerHTML = "";
    box.appendChild(drEl("b", "rk-son", ar.won ? x.won : x.lost));
    if (!ar.test) {
      if (ar.won && duBall(ar.stage)) { box.appendChild(drEl("b", "dr-res-p", t.pts(duBall(ar.stage)))); }
      box.appendChild(drEl("small", "dr-res-s", ar.won ? (ar.stage === 2 ? t.champ : ar.next ? t.keyingi(duMS(ar.next["in"])) : "") : t.out));
    }
    // G'olib keyingi bosqichga O'ZI o'tadi: bir necha soniyadan keyin keyingi duel arenasi ochiladi (tanaffus atigi 1 daqiqa)
    if (!ar.test && ar.won && ar.next) {
      var kid = ar.next.id;
      du.tm = setTimeout(function () { if (du && du.mode === "ar" && du.done) { duArena(kid); } }, 6000);
    }
    var b = drEl("button", "dr-btn", t.tbl);
    b.type = "button";
    b.addEventListener("click", function () { duOpen(); });
    box.appendChild(b);
    box.classList.remove("hidden");
    try { if (tg && tg.HapticFeedback) { tg.HapticFeedback.notificationOccurred(ar.won ? "success" : "error"); } } catch (e) {}
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
    du.vaqt = du.mode === "ar" && du.ar ? Math.max(3000, Math.min(DU_VAQT, du.ar.deadline_in * 1000 - 2500)) : DU_VAQT;
    if (du.mode === "ar") { du.step = "draw"; }
    du.tm = setTimeout(function () { duSend(); }, du.vaqt);
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
    var q = Math.max(0, 1 - (Date.now() - du.t0) / (du.vaqt || DU_VAQT));
    $("du-vaqt").style.width = Math.round(q * 100) + "%";
  }
  /* Aniqlik 0..100 (egasi, 2026-10-09: «xatolar bilan chizganda ham yaxshi ball berardi» - o'lchov QATTIQLASHTIRILDI).
     To'rt o'lchov birga: (1) TARTIB - iz shakl bo'ylab nuqtama-nuqta solishtiriladi (boshidan yoki oxiridan), ya'ni
     boshqa shakl yoki burchakni kesib o'tish jazolanadi; (2) YAQINLIK - iz va shakl orasidagi o'rtacha masofa;
     (3) ENG YOMON QISM - eng uzoqlashgan beshdan bir qism (bitta katta xato ham ko'rinadi); (4) QOPLASH - shaklning
     qancha qismi chizilgan (yarmi chizilsa ball ham shunga yarasha). Chegaralar: DU_ACC. */
  var DU_ACC = { n: 64, nol: 0.010, toliq: 0.075, qop: 0.055 };
  // yoddan = true: namuna ko'rsatilmagan (Afsunlar darsining «yoddan» urinishlari) - o'lchov shu, chegaralar kengroq
  function duAcc(pts, user, yoddan) {
    if (!user || user.length < 6) { return 0; }
    var toliq = yoddan ? 0.115 : DU_ACC.toliq, qop = yoddan ? 0.085 : DU_ACC.qop;
    var N = DU_ACC.n, P = afResample(pts, N), U = afResample(user, N), i;
    var H = function (p, q) { return Math.hypot(p[0] - q[0], p[1] - q[1]); };
    var yaqin = function (a, b) { return a.map(function (p) { var m = 9; b.forEach(function (q) { var d = H(p, q); if (d < m) { m = d; } }); return m; }); };
    var orta = function (v) { var s = 0; v.forEach(function (x) { s += x; }); return s / v.length; };
    var oldin = 0, orqa = 0;
    for (i = 0; i < N; i++) { oldin += H(P[i], U[i]); orqa += H(P[i], U[N - 1 - i]); }
    var tartib = Math.min(oldin, orqa) / N;
    var a = yaqin(P, U), b = yaqin(U, P), yaq = (orta(a) + orta(b)) / 2;
    var hammasi = a.concat(b).sort(function (x, y) { return y - x; }), yomon = orta(hammasi.slice(0, Math.ceil(hammasi.length / 5)));
    var qoplangan = a.filter(function (x) { return x <= qop; }).length / N;
    var d = 0.4 * tartib + 0.25 * yaq + 0.35 * yomon;
    var ball = 100 * (1 - (d - DU_ACC.nol) / (toliq - DU_ACC.nol));
    if (qoplangan < 0.92) { ball *= qoplangan / 0.92; }
    return Math.max(0, Math.min(100, Math.round(ball)));
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
    if (du.mode === "ar") {                      // jonli duel: yurish arenaga, natijani server aytadi
      du.step = "sent";
      $("du-draw").classList.add("hidden");
      $("du-msg").textContent = duT().sent;
      duArTick({ arena: du.arena, move: du.tur, acc: acc });
      return;
    }
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
    var yon = function (nom, tur, acc, yutdi, qarshi) {
      var c = drEl("div", "du-rv" + (yutdi ? " yutdi" : ""));
      c.style.setProperty("--tu", DU_RGB[tur]);
      c.appendChild(drEl("small", "", nom));
      var ic = drEl("span", "du-rv-ic"); ic.innerHTML = DU_IC[tur];
      c.appendChild(ic);
      c.appendChild(drEl("b", "", x.tur[tur]));
      // kuch = aniqlik (+ ustun tur uchun qo'shimcha); kuchi baland yutadi (hpduel.kuch)
      var ustun = acc >= 35 && DU_YENG[tur] === qarshi ? duBonus() : 0;
      c.appendChild(drEl("em", acc < 35 ? "yoq" : "", acc < 35 ? x.fail : x.acc + " " + acc + (ustun ? " + " + ustun : "")));
      if (acc >= 35) { c.appendChild(drEl("strong", "", x.kuch + " " + (acc + ustun))); }
      return c;
    };
    box.appendChild(yon(du.mode === "ar" ? du.oppName : x.raq[du.level - 1], r.his, r.racc, r.win < 0, r.mine));
    box.appendChild(yon(x.you, r.mine, r.acc, r.win > 0, r.his));
    $("du-msg").textContent = r.win > 0 ? x.w1 : r.win < 0 ? x.wm : x.w0;
    duHearts();
    try { if (tg && tg.HapticFeedback) { tg.HapticFeedback.notificationOccurred(r.win > 0 ? "success" : r.win < 0 ? "error" : "warning"); } } catch (e) {}
    $("scr-duel").classList.remove("zarba-m", "zarba-r");
    void $("scr-duel").offsetWidth;
    if (r.win) { $("scr-duel").classList.add(r.win > 0 ? "zarba-r" : "zarba-m"); }
    if (du.mode === "ar") { var nx = drEl("small", "du-nxt", ""); nx.id = "du-nxt"; box.appendChild(nx); return; }     // keyingi raundni server boshlaydi
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
    if (g.delta != null) { box.appendChild(drEl("b", "dr-res-p", x.rdelta(g.delta))); }
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
    $("du-info-b").addEventListener("click", duInfo);
    $("du-back").addEventListener("click", function () {
      var ochiq = $("du-info");
      if (ochiq) { ochiq.parentNode.removeChild(ochiq); return; }
      if (du) { duStop(); duHome(); return; }
      if (duKorinish === "rep") { if (duRepDan === "hist") { duHist(); } else { duHome(); } return; }
      if (duKorinish === "hist") { duHome(); return; }
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
