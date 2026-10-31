/* Kundalik Xabarnoma (egasi, 2026-11-01): kechagi natijalardan o'zi tuziladigan gazeta, eski gazeta ko'rinishida (B namuna).
   «Payg'ambar» so'zi o'zbekchada ishlatilmaydi (egasi). Ruscha va inglizcha nomi asardagidek.
   Server: hpgazeta.py, POST /api/gazeta - faqat raqamlar; sarlavha va matn shu yerda, uch tilda.
   Rasmlar jonli: sekin kattalashadi, yorug'i miltillaydi, uchqunlar suzadi (css «KUNDALIK XABARNOMA»). */
"use strict";

  var API_GAZETA = "https://bot.tizimshunos.uz/api/gazeta";
  var GZT_T = {
    uz: { nom: "Kundalik Xabarnoma", sub: "Qasrdagi kechagi voqealar", owl: "Boyo'g'li yetkazdi", kun: ["yakshanba", "dushanba", "seshanba", "chorshanba", "payshanba", "juma", "shanba"],
          oy: ["yanvar", "fevral", "mart", "aprel", "may", "iyun", "iyul", "avgust", "sentabr", "oktabr", "noyabr", "dekabr"],
          sana: function (k, o, h) { return k + "-" + o + ", " + h; },
          kubok: "Kubok poygasi", yuti: function (u) { return u + " Xogvarts kubogini oldi"; },
          yutiP: function (u, p, v) { return "Hafta yopildi. " + u + " " + p + " ball to'pladi" + (v ? ", ikkinchi o'rinda " + v + "." : "."); },
          kop: [function (u, n, j) { return u + " " + j + " bellashuvdan " + n + " tasini oldi"; }, function (u, n) { return "Kecha " + u + " kuni bo'ldi: " + n + " ta fanda birinchi"; }],
          old: function (u) { return "Kubokda " + u + " oldinda"; }, tinch: "Yangi hafta boshlandi", tinchP: "Hali hech kim ball to'plamadi.",
          farq: function (u, f) { return u + " oldinda, farq " + f + " ball."; }, yopil: " Bugun 23:59 da hafta yopiladi.",
          kechaT: "Kechagi turnir", bugunT: function (a) { return "Bugun " + a; }, golib: function (t, g) { return t + ": g'olib " + g; },
          golibP: function (n, b) { return (n ? n + " sehrgar qatnashdi. " : "") + (b ? "G'olib +" + b + " ball oldi." : ""); },
          bugunH: function (t) { return t + " bugun kechqurun"; }, bugunP: "Yozilish turnir sahifasida.", kir: "Turnir sahifasi",
          tez: "Kecha fanlarning eng tezlari", yangi: "Qasrga yangi kelganlar", yangiP: "sehrgar kecha Saralovchi qalpoq oldiga chiqdi.",
          star: "Kunning sehrgari", starP: function (g) { return g + " bir kunda shuncha fanda birinchi bo'ldi."; },
          yoq: "Aloqa yo'q. Keyinroq qayta oching.", karta: "Bugungi son" },
    ru: { nom: "Ежедневный пророк", sub: "Вчерашние события в замке", owl: "Доставила сова", kun: ["воскресенье", "понедельник", "вторник", "среда", "четверг", "пятница", "суббота"],
          oy: ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"],
          sana: function (k, o, h) { return k + " " + o + ", " + h; },
          kubok: "Гонка за кубок", yuti: function (u) { return u + " забирает Кубок Хогвартса"; },
          yutiP: function (u, p, v) { return "Неделя закрыта. " + u + ": " + p + " баллов" + (v ? ", на втором месте " + v + "." : "."); },
          kop: [function (u, n, j) { return u + " берёт " + n + " состязаний из " + j; }, function (u, n) { return "Вчера день за " + u + ": первое место в " + n + " предметах"; }],
          old: function (u) { return u + " лидирует в гонке за кубок"; }, tinch: "Началась новая неделя", tinchP: "Баллов пока ни у кого нет.",
          farq: function (u, f) { return "Впереди " + u + ", разрыв " + f + " баллов."; }, yopil: " Сегодня в 23:59 неделя закроется.",
          kechaT: "Вчерашний турнир", bugunT: function (a) { return "Сегодня в " + a; }, golib: function (t, g) { return t + ": победил(а) " + g; },
          golibP: function (n, b) { return (n ? "Участников: " + n + ". " : "") + (b ? "Победителю +" + b + " баллов." : ""); },
          bugunH: function (t) { return t + " сегодня вечером"; }, bugunP: "Запись на странице турнира.", kir: "Страница турнира",
          tez: "Самые быстрые вчера", yangi: "Новички в замке", yangiP: "волшебников вчера вышли к Распределяющей шляпе.",
          star: "Волшебник дня", starP: function (g) { return g + ": столько первых мест за день."; },
          yoq: "Нет связи. Откройте позже.", karta: "Сегодняшний номер" },
    en: { nom: "The Daily Prophet", sub: "Yesterday at the castle", owl: "Delivered by owl", kun: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
          oy: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
          sana: function (k, o, h) { return h + ", " + k + " " + o; },
          kubok: "The race for the Cup", yuti: function (u) { return u + " wins the Hogwarts Cup"; },
          yutiP: function (u, p, v) { return "The week is closed. " + u + " scored " + p + " points" + (v ? ", with " + v + " in second." : "."); },
          kop: [function (u, n, j) { return u + " takes " + n + " of " + j + " contests"; }, function (u, n) { return "Yesterday belonged to " + u + ": first in " + n + " subjects"; }],
          old: function (u) { return u + " leads the race for the Cup"; }, tinch: "A new week begins", tinchP: "Nobody has scored yet.",
          farq: function (u, f) { return u + " leads by " + f + " points."; }, yopil: " The week closes today at 23:59.",
          kechaT: "Yesterday's tournament", bugunT: function (a) { return "Today at " + a; }, golib: function (t, g) { return t + ": " + g + " wins"; },
          golibP: function (n, b) { return (n ? n + " wizards took part. " : "") + (b ? "The winner earned +" + b + " points." : ""); },
          bugunH: function (t) { return t + " tonight"; }, bugunP: "Sign up on the tournament page.", kir: "Tournament page",
          tez: "Yesterday's fastest", yangi: "New at the castle", yangiP: "wizards met the Sorting Hat yesterday.",
          star: "Wizard of the day", starP: function (g) { return g + ": that many first places in a day."; },
          yoq: "No connection. Please open it later.", karta: "Today's issue" }
  };
  function gztT() { return GZT_T[lang] || GZT_T.uz; }
  var GZT_RASM = { poyga: "poyga", tosh: "tosh", chess: "chess", vik: "vik", mjang: "mjang", duel: "duel" };

  var gztData = null, gztVaqt = 0, gztKut = false;

  function gztUy(h) { var u = HOUSES[h]; return u ? (u[lang] || u.uz) : ""; }
  function gztSon(n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, " "); }
  var GZT_TUR = { poyga: { uz: "Poyga", ru: "Гонка", en: "Race" }, tosh: { uz: "Toshchalar", ru: "Плюй-камни", en: "Gobstones" }, chess: { uz: "Shaxmat", ru: "Шахматы", en: "Chess" }, vik: { uz: "Viktorina", ru: "Викторина", en: "Quiz" }, mjang: { uz: "Maxluqlar jangi", ru: "Битва существ", en: "Creature Battle" }, duel: { uz: "Duel", ru: "Дуэль", en: "Duel" } };
  function gztTurNom(k) { var n = GZT_TUR[k]; return n ? (n[lang] || n.uz) : ""; }
  function gztOch(k) {
    var f = { poyga: pgOpen, tosh: gbOpen, chess: openChessHub, vik: vkOpen, mjang: mjOpen, duel: duOpen }[k];
    if (!f) { return; }
    $("scr-gazeta").classList.add("hidden");
    try { $("scr-hub").classList.add("hidden"); } catch (e) {}
    f();
  }

  function gztSample() {
    return { ok: true, no: 1, day: "2026-11-01", yesterday: "2026-10-31", fans: 9, "new": 8, today: { kind: "duel", at: "22:00" },
      cup: { closed: false, ends_today: true, winner: null, houses: [{ h: "slytherin", p: 4138 }, { h: "hufflepuff", p: 2260 }, { h: "gryffindor", p: 737 }, { h: "ravenclaw", p: 572 }] },
      tour: { kind: "mjang", n: 14, points: 30, winner: { uid: 1, name: "Hamroyevna", house: "slytherin" } },
      star: { uid: 2, name: "Farangiz", house: "slytherin", n: 3 },
      bell: [["afsun", "Farangiz", "slytherin"], ["astro", "Bekzod", "slytherin"], ["iksir", "Farangiz", "slytherin"], ["himoya", "ZUHRA", "slytherin"], ["maxluq", "ZUHRA", "slytherin"],
             ["osimlik", "Hamroyevna", "slytherin"], ["tarix", "Farangiz", "slytherin"], ["trans", "Abulqosimova", "hufflepuff"], ["uchish", "Hamroyevna", "slytherin"]]
        .map(function (r, i) { return { fan: r[0], name: r[1], house: r[2], uid: i + 1 }; }) };
  }
  function gztPost(body, cb) {
    if (!window.fetch) { return; }
    window.fetch(API_GAZETA, { method: "POST", headers: { "Content-Type": "application/json", "X-Telegram-Init-Data": drInit() }, body: JSON.stringify(body) })
      .then(function (r) { return r.json(); })
      .then(function (res) { cb(res && res.ok ? res : (MS_LOCAL ? gztSample() : null)); })
      ["catch"](function () { cb(MS_LOCAL ? gztSample() : null); });
  }

  // Bosh sarlavha raqamlardan chiqadi
  function gztBosh(d) {
    var x = gztT(), c = d.cup, u = c && c.houses ? c.houses : [], son = {};
    (d.bell || []).forEach(function (b) { son[b.house] = (son[b.house] || 0) + 1; });
    var eng = Object.keys(son).sort(function (a, b) { return son[b] - son[a]; })[0];
    var yetak = u[0] && u[0].p ? u[0] : null;
    var p = yetak ? x.farq(gztUy(yetak.h), gztSon(yetak.p - (u[1] ? u[1].p : 0))) : "";
    if (c && c.ends_today && yetak) { p += x.yopil; }
    if (c && c.closed && c.winner) {
      return { h: x.yuti(gztUy(c.winner)), p: x.yutiP(gztUy(c.winner), gztSon(yetak ? yetak.p : 0), u[1] && u[1].p ? gztUy(u[1].h) : "") };
    }
    if (eng && son[eng] >= 5 && HOUSES[eng] && !HOUSES[eng].direktor) { return { h: x.kop[d.no % 2](gztUy(eng), son[eng], d.fans), p: p }; }
    if (yetak) { return { h: x.old(gztUy(yetak.h)), p: p }; }
    return { h: x.tinch, p: x.tinchP };
  }

  function gztJonli(src, kubok) {
    var w = drEl("div", "gzt-jon" + (kubok ? " kubok" : "")), im = document.createElement("img");
    im.alt = ""; im.src = src; w.appendChild(im);
    return w;
  }
  function gztGerb(h) {
    var im = document.createElement("img");
    im.alt = ""; im.className = "gzt-gerb";
    if (HOUSES[h] && HOUSES[h].img) { im.src = IMG_DIR + HOUSES[h].img; }
    return im;
  }

  function gztRender() {
    var box = $("gzt-body"), x = gztT(), d = gztData;
    box.innerHTML = "";
    if (!d) { box.appendChild(drEl("p", "gzt-yoq", x.yoq)); return; }
    var sana = new Date(d.day + "T12:00:00");
    var top = drEl("div", "gzt-top");
    top.appendChild(drEl("span", "", "№ " + d.no));
    top.appendChild(drEl("span", "", x.sana(sana.getDate(), x.oy[sana.getMonth()], x.kun[sana.getDay()])));
    top.appendChild(drEl("span", "", x.owl));
    box.appendChild(top);
    box.appendChild(drEl("h1", "gzt-nom", x.nom));
    box.appendChild(drEl("div", "gzt-sub", x.sub));

    var bosh = gztBosh(d), lead = drEl("article", "gzt-lead");
    lead.appendChild(gztJonli(IMG_DIR + "kubok/kubok.webp", true));
    lead.appendChild(drEl("div", "gzt-kick", x.kubok));
    lead.appendChild(drEl("h2", "", bosh.h));
    lead.appendChild(drEl("p", "", bosh.p));
    box.appendChild(lead);

    if (d.cup && d.cup.houses && d.cup.houses[0].p) {
      var uy = drEl("ul", "gzt-uy"), eng = d.cup.houses[0].p;
      d.cup.houses.forEach(function (r) {
        var li = document.createElement("li");
        li.appendChild(gztGerb(r.h));
        li.appendChild(drEl("span", "", gztUy(r.h)));
        var bar = document.createElement("i"), q = document.createElement("u");
        q.style.width = Math.round(r.p / eng * 100) + "%";
        bar.appendChild(q); li.appendChild(bar);
        li.appendChild(drEl("b", "", gztSon(r.p)));
        uy.appendChild(li);
      });
      box.appendChild(uy);
    }

    var ikki = drEl("section", "gzt-two" + (d.tour && d.today ? "" : " bitta"));
    if (d.tour) {
      var a = document.createElement("article");
      a.appendChild(gztJonli(IMG_DIR + "hub/" + GZT_RASM[d.tour.kind] + ".webp"));
      a.appendChild(drEl("div", "gzt-kick", x.kechaT));
      a.appendChild(drEl("h3", "", x.golib(gztTurNom(d.tour.kind), d.tour.winner.name)));
      a.appendChild(drEl("p", "", x.golibP(d.tour.n, d.tour.points)));
      ikki.appendChild(a);
    }
    if (d.today) {
      var t = document.createElement("article");
      t.appendChild(gztJonli(IMG_DIR + "hub/" + GZT_RASM[d.today.kind] + ".webp"));
      t.appendChild(drEl("div", "gzt-kick", x.bugunT(d.today.at)));
      t.appendChild(drEl("h3", "", x.bugunH(gztTurNom(d.today.kind))));
      t.appendChild(drEl("p", "", x.bugunP));
      var b = drEl("button", "gzt-btn", x.kir);
      b.type = "button";
      b.onclick = function () { gztOch(d.today.kind); };
      t.appendChild(b);
      ikki.appendChild(t);
    }
    if (d.tour || d.today) { box.appendChild(ikki); }

    if (d.bell && d.bell.length) {
      var sek = drEl("section", "gzt-win");
      sek.appendChild(drEl("div", "gzt-kick", x.tez));
      var ro = document.createElement("ul");
      d.bell.forEach(function (r) {
        var li = document.createElement("li"), f = drFan(r.fan), ic = document.createElement("img");
        ic.alt = ""; ic.className = "gzt-fan"; ic.loading = "lazy"; ic.src = IMG_DIR + "dars/" + r.fan + ".webp";
        li.appendChild(ic);
        li.appendChild(drEl("span", "", f ? (f.nom[lang] || f.nom.uz) : r.fan));
        li.appendChild(drEl("b", "", r.name));
        li.appendChild(gztGerb(r.house));
        li.onclick = function () { try { odamOpen(r.uid, { name: r.name, house: r.house }); } catch (e) {} };
        ro.appendChild(li);
      });
      sek.appendChild(ro);
      box.appendChild(sek);
    }

    if (d["new"] || d.star) {
      var pas = drEl("section", "gzt-foot" + (d["new"] && d.star ? "" : " bitta"));
      if (d["new"]) {
        var y = document.createElement("article");
        y.appendChild(drEl("div", "gzt-kick", x.yangi));
        y.appendChild(drEl("b", "gzt-son", String(d["new"])));
        y.appendChild(drEl("p", "", x.yangiP));
        pas.appendChild(y);
      }
      if (d.star) {
        var s = document.createElement("article");
        s.appendChild(drEl("div", "gzt-kick", x.star));
        s.appendChild(drEl("b", "gzt-son", String(d.star.n)));
        s.appendChild(drEl("p", "", x.starP(d.star.name)));
        pas.appendChild(s);
      }
      box.appendChild(pas);
    }
  }

  // Bosh sahifa kartasi. 2-kursdan (kubok ham shu kursdan). Javob faqat o'z kartasini chizadi, bosh sahifani qayta chizmaydi.
  function gztKarta() {
    var el = $("hub-gzt");
    if (!el) { return; }
    var kor = !!gztData && kursN() >= 2;
    el.classList.toggle("hidden", !kor);
    if (!kor) { return; }
    var x = gztT();
    el.innerHTML = "";
    el.appendChild(drEl("span", "gzt-k-nom", x.nom));
    el.appendChild(drEl("span", "gzt-k-h", gztBosh(gztData).h));
    el.appendChild(drEl("span", "gzt-k-no", x.karta + " · № " + gztData.no));
  }
  function gztLoad() {
    gztKarta();
    if (gztKut || Date.now() - gztVaqt < 300000) { return; }
    gztKut = true;
    gztPost({}, function (res) {
      gztKut = false;
      gztVaqt = Date.now();
      if (res) { gztData = res; gztKarta(); }
    });
  }
  function gztOpen() {
    try { $("scr-hub").classList.add("hidden"); } catch (e) {}
    drShowGame("scr-gazeta");
    try { window.scrollTo(0, 0); } catch (e) {}
    gztRender();
    gztPost({ read: 1 }, function (res) { if (res) { gztData = res; gztRender(); gztKarta(); } });
  }
  function gztYop() {
    $("scr-gazeta").classList.add("hidden");
    openHub();
  }

  $("gzt-bk").addEventListener("click", gztYop);
  $("hub-gzt").addEventListener("click", gztOpen);
