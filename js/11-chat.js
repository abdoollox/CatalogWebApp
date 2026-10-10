/* Chat
   Ilova kodi bir necha faylga bo'lingan; hammasi BIR umumiy maydonda ishlaydi
   va index.html dagi TARTIBDA yuklanadi. Yuklanish paytida keyingi fayldagi
   narsani chaqirmang - tekshiruv: tools/tartib.js */
"use strict";
  /* ---------- CHAT ----------
     Telegramdek ishlaydi: ilova serverdan "oxirgi ko'rgan o'zgarishimdan
     keyin nima bo'ldi?" deb so'raydi, server esa biror narsa o'zgarguncha
     javobni ushlab turadi - yangi xabar, tahrir, o'chirish va reaksiya
     shu zahoti yetib keladi. Ro'yxat qayta chizilganda o'qilayotgan joy
     saqlanadi: pastda turgan odam yangi xabarga suriladi, yuqorida
     o'qiyotgan odam esa joyidan qo'zg'almaydi.
     Xabarni bosib ushlab turish (kompyuterda o'ng tugma) - menyu; chapga
     surish - javob; ikki marta bosish - ❤️. */
  var chatRooms = { house: chatNewRoom(), global: chatNewRoom() };
  var chatRoom = "house";     // "house" yoki "global"
  var chatOpen = false;
  var chatSeq = 0;            // so'rovlar zanjiri raqami: eskisi o'zini to'xtatadi
  var chatCtl = null;         // hozirgi so'rovni uzish uchun
  var chatFails = 0;
  var chatStick = true;       // ro'yxat pastida turibmizmi
  var chatCounts = {};        // { house: n, global: n } - o'qilmaganlar
  var chatLive = { typing: [], online: 0, until: 0 };   // sarlavha ostidagi yozuv
  var chatLiveTimer = null;
  var chatTypingSent = 0;
  var chatAdmin = false;
  var chatBans = {};          // uid -> until (null - butunlay); faqat admin ko'radi
  var chatBannedUntil = false; // o'zim bloklanganmanmi
  var chatPeers = {};         // uid -> { uid, name, house, online } - shaxsiy suhbatdoshlar
  var chatDmState = "ok";     // ochiq shaxsiy suhbatda yoza olamanmi: ok / blocked_by_me / closed
  var chatDmSet = null;       // { privacy: all|house|none, blocked: [...] } - o'z sozlamalarim
  var chatPeople = null;      // a'zolar oynasi: { room, list, filter }
  var chatDmTimer = null;
  var chatCountTimer = null;
  var CHAT_HOUSES = ["gryffindor", "slytherin", "ravenclaw", "hufflepuff"];
  var chatReadTimer = null;
  var chatNewIds = {};
  var chatCompose = null;     // { mode: "reply" | "edit", id }
  var chatPress = null;       // barmoq xabar ustida: uzoq bosish yoki surish
  var chatPendingPaint = false;
  var chatSuppressClick = 0;
  var chatLastTap = {};
  var chatMenuEl = null;
  var chatTouch = !!(window.matchMedia && window.matchMedia("(pointer: coarse)").matches);
  // Server ro'yxati bilan bir xil bo'lishi shart (hpcup.CHAT_REACTIONS).
  var CHAT_REACTS = ["\ud83d\udc4d", "\u2764\ufe0f", "\ud83d\ude02", "\ud83d\udd25", "\ud83d\ude2e", "\u26a1"];
  var CHAT_EDIT_MS = 48 * 3600 * 1000;
  // Menyu va tugmalardagi belgilar: bir xil chiziqli uslub (emoji har telefonda har xil chiqadi).
  function chatSvg(d) {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" ' +
      'stroke-linecap="round" stroke-linejoin="round">' + d + '</svg>';
  }
  var CHAT_SVG = {
    odam: chatSvg('<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>'),
    oqildi: chatSvg('<path d="m2 12.5 4.5 4.5L16 7"/><path d="m11.5 16 1 1L22 7"/>'),
    kayfiyat: chatSvg('<circle cx="12" cy="12" r="9"/><path d="M8.5 14.5a4 4 0 0 0 7 0"/><path d="M9 9.5h.01M15 9.5h.01"/>'),
    nishon: chatSvg('<circle cx="12" cy="8" r="6"/><path d="M15.5 12.9 17 22l-5-3-5 3 1.5-9.1"/>'),
    reply: chatSvg('<path d="M9 14 4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11"/>'),
    copy: chatSvg('<rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>'),
    edit: chatSvg('<path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/>'),
    check: chatSvg('<path d="m5 12.5 4.5 4.5L19 7"/>'),
    lock: chatSvg('<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>'),
    dm: chatSvg('<path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12Z"/>'),
    ban: chatSvg('<circle cx="12" cy="12" r="9"/><path d="m5.6 5.6 12.8 12.8"/>'),
    ban24: chatSvg('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'),
    unban: chatSvg('<circle cx="12" cy="12" r="9"/><path d="m8.5 12.5 2.5 2.5 5-5.5"/>'),
    trash: chatSvg('<path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/>')
  };
  var CHAT_ICON = {
    sending: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><circle cx="8" cy="8" r="6"/><path d="M8 4.8V8l2 1.3"/></svg>',
    sent: '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3.2 8.4l3 3 6.6-6.8"/></svg>',
    failed: '<b>!</b>'
  };

  // read    - qaysi xabargacha o'qilgan (serverda ham saqlanadi);
  // divider - "Yangi xabarlar" chizig'i shu id dan keyin (chat ochilgandagi holat);
  // moreNew - pastda hali yuklanmagan xabarlar bor (o'qilmaganlar ko'p bo'lsa);
  // hidden  - o'shalardan nechtasi o'qilmagan.
  // Xonalar: "house", "global", "dm:<odam id>" (shaxsiy suhbat); "dms" - suhbatlar ro'yxati.
  function chatIsDm(room) { return String(room).indexOf("dm:") === 0; }
  // Fakultet xonasi: "house" - o'zimniki, "h:<fakultet>" - boshqasi (faqat admin ochadi).
  function chatIsHouseRoom(room) { return room === "house" || String(room).indexOf("h:") === 0; }
  function chatRoomHouse(room) {
    if (room === "house") return cupMe().house;
    return String(room).indexOf("h:") === 0 ? String(room).slice(2) : null;
  }
  function chatPeerOf(room) {
    var id = parseInt(String(room).slice(3), 10);
    return chatPeers[id] || { uid: id, name: "Sehrgar", house: null };
  }

  function chatNewRoom() {
    return { msgs: [], loaded: false, more: false, loadingOld: false, oldFail: 0, rev: 0,
             read: 0, sentRead: 0, divider: 0, moreNew: false, loadingNew: false, newFail: 0,
             hidden: 0, hiddenIds: {}, latest: false };
  }

  // Xonani qayta yuklashga tayyorlaydi (yuborilayotgan xabarlar saqlanib qoladi).
  function chatResetRoom(room, latest) {
    var fresh = chatNewRoom(), old = chatRooms[room];
    fresh.msgs = old ? old.msgs.filter(function(m) { return m.tmp; }) : [];
    fresh.latest = !!latest;
    chatRooms[room] = fresh;
  }
  function chatInitData() { try { return (tg && tg.initData) || ""; } catch (e) { return ""; } }
  function chatUser() { return (tg && tg.initDataUnsafe && tg.initDataUnsafe.user) || {}; }
  // Ism o'z fakultetining rangida (fakulteti yo'q bo'lsa - umumiy kulrang).
  function chatColor(house) { return (HOUSES[house] || HOUSES.none).accent; }
  function chatHaptic(kind) {
    try {
      var h = tg && tg.HapticFeedback;
      if (!h) return;
      if (kind === "sel") h.selectionChanged(); else h.impactOccurred(kind);
    } catch (e) {}
  }

  // Kutilayotgan (hali serverga yetmagan) xabarlar doim ro'yxat oxirida turadi.
  function chatLastId(R) {
    for (var i = R.msgs.length - 1; i >= 0; i--) { if (!R.msgs[i].tmp) return R.msgs[i].id; }
    return 0;
  }
  function chatFirstId(R) {
    for (var i = 0; i < R.msgs.length; i++) { if (!R.msgs[i].tmp) return R.msgs[i].id; }
    return 0;
  }
  function chatFind(R, id) {
    for (var i = 0; i < R.msgs.length; i++) { if (String(R.msgs[i].id) === String(id)) return R.msgs[i]; }
    return null;
  }

  // Serverdan kelgan xabarlarni ro'yxatga qo'shadi yoki yangilaydi:
  // o'chirilganini olib tashlaydi, tahrir/reaksiya olganini almashtiradi,
  // o'zimiz yuborib javobini kutayotgan nusxani (cid) haqiqiysi bilan almashtiradi.
  // live - jonli yangilanish: yuklanmagan eski xabarning o'zgarishi e'tiborsiz qoladi.
  function chatMerge(R, list, live) {
    var map = {}, tmps = [], added = [], changed = false, first = chatFirstId(R), last = chatLastId(R);
    var me = chatUser().id || 0;
    R.msgs.forEach(function(m) { if (m.tmp) tmps.push(m); else map[m.id] = m; });
    (list || []).forEach(function(m) {
      var old = map[m.id], k;
      if (m.deleted) {
        if (old) { delete map[m.id]; changed = true; }
        for (k in map) {
          if (map[k].reply && map[k].reply.id === m.id && !map[k].reply.deleted) {
            map[k].reply = { id: m.id, deleted: true };
            changed = true;
          }
        }
        return;
      }
      if (old) {
        if ((old.rev || 0) < (m.rev || 0)) { map[m.id] = m; changed = true; }
        return;
      }
      if (live && first && m.id < first) return;
      if (live && R.moreNew && m.id > last) {
        if (m.uid != me && !R.hiddenIds[m.id]) { R.hiddenIds[m.id] = 1; R.hidden++; }
        return;
      }
      if (m.cid) tmps = tmps.filter(function(x) { return x.cid !== m.cid; });
      map[m.id] = m;
      added.push(m);
    });
    if (added.length || changed) {
      var real = Object.keys(map).map(function(k) { return map[k]; });
      real.sort(function(a, b) { return a.id - b.id; });
      R.msgs = real.concat(tmps);
    }
    return { added: added, changed: changed };
  }

  function chatDate(m) { var d = new Date(m.time); return isNaN(d.getTime()) ? new Date() : d; }
  function chatHM(d) { return ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2); }
  function chatDayKey(d) { return d.getFullYear() + "-" + d.getMonth() + "-" + d.getDate(); }
  function chatDayLabel(d) {
    var now = new Date();
    var yest = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
    if (chatDayKey(d) === chatDayKey(now)) return L("chatToday");
    if (chatDayKey(d) === chatDayKey(yest)) return L("chatYesterday");
    var mon = L("chatMonths")[d.getMonth()], day = d.getDate(), s;
    if (lang === "en") s = mon + " " + day;
    else if (lang === "ru") s = day + " " + mon;
    else s = day + "-" + mon;
    if (d.getFullYear() !== now.getFullYear()) s += (lang === "en" ? ", " : " ") + d.getFullYear();
    return s;
  }

  // "Oxirgi marta onlayn" matni (iso - serverdagi UTC vaqt). Bo'sh: hech qachon ko'rilmagan.
  function chatSeenText(iso) {
    if (!iso) return "";
    var d = new Date(iso);
    if (isNaN(d.getTime())) return "";
    var mins = Math.floor((Date.now() - d.getTime()) / 60000);
    if (mins < 1) return L("chatSeenNow");
    if (mins < 60) return L("chatSeenAgo").replace("%s", mins);
    if (mins > 60 * 24 * 60) return L("chatSeenAt").replace("%s", L("chatSeenLong"));
    return L("chatSeenAt").replace("%s", chatDayLabel(d).toLowerCase() + " " + chatHM(d));
  }

  function chatHint(text) {
    var el = document.createElement("div");
    el.className = "chat-hint";
    el.textContent = text;
    return el;
  }

  // Matn + "@ism" lar ajratib ko'rsatiladi.
  function chatFillText(el, text) {
    String(text).split(/(@[^\s@.,!?:;()]+)/).forEach(function(part, i) {
      if (i % 2) {
        var at = document.createElement("span");
        at.className = "cm-at";
        at.textContent = part;
        el.appendChild(at);
      } else if (part) {
        el.appendChild(document.createTextNode(part));
      }
    });
  }

  function chatMyTag() {
    var n = String(chatUser().first_name || "").split(/\s+/)[0];
    return n ? "@" + n.toLowerCase() : "";
  }

  function renderChat() {
    var box = $("chat-messages");
    if (!box) return;
    var R = chatRooms[chatRoom];
    if (!R) return;
    box.innerHTML = "";
    if (!R.loaded) { box.appendChild(chatHint(L("loading"))); return; }
    if (!R.msgs.length) { box.appendChild(chatHint(L("chatEmpty"))); return; }

    var meUid = chatUser().id || 0, myTag = chatMyTag();
    var frag = document.createDocumentFragment();
    if (R.loadingOld) frag.appendChild(chatHint(L("loading")));
    var prev = null, lastDay = "", GAP = 5 * 60000, divided = false;

    R.msgs.forEach(function(m, i) {
      var d = chatDate(m), day = chatDayKey(d), next = R.msgs[i + 1];
      if (day !== lastDay) {
        var sep = document.createElement("div");
        sep.className = "cm-day";
        sep.textContent = chatDayLabel(d);
        frag.appendChild(sep);
        lastDay = day;
        prev = null;
      }
      var mine = m.uid == meUid;
      if (R.divider && !divided && !m.tmp && !mine && m.id > R.divider) {
        var bar = document.createElement("div");
        bar.className = "cm-unread";
        bar.id = "chat-unread-bar";
        bar.textContent = L("chatUnreadBar");
        frag.appendChild(bar);
        divided = true;
        prev = null;
      }
      if (m.kind === "join") { frag.appendChild(chatJoinCard(m, mine)); m.anim = false; prev = null; return; }
      // Bir odamning 5 daqiqa ichidagi ketma-ket xabarlari bitta to'da bo'ladi.
      var first = !prev || prev.uid != m.uid || (d - chatDate(prev)) > GAP;
      var nd = next ? chatDate(next) : null;
      var last = !next || next.kind || next.uid != m.uid || chatDayKey(nd) !== day || (nd - d) > GAP;
      // Menga javob yoki meni @ism bilan chaqirishgan bo'lsa - ajratib ko'rsatiladi.
      var hl = !mine && ((m.reply && m.reply.uid == meUid) ||
        (myTag && String(m.text).toLowerCase().indexOf(myTag) >= 0));

      var row = document.createElement("div");
      row.className = "cm" + (mine ? " me" : "") + (first ? " first" : "") + (last ? " last" : "") +
        (hl ? " hl" : "") + (m.st === "failed" ? " failed" : "") +
        ((chatNewIds[m.id] || m.anim) ? " new" : "");
      row.setAttribute("data-id", m.id);

      if (first && !mine && !chatIsDm(chatRoom)) {
        var name = document.createElement("div");
        name.className = "cm-name";
        var nm = document.createElement("span");
        nm.textContent = m.name || "Sehrgar";
        nm.style.color = chatColor(m.house);
        name.appendChild(nm);
        var hh = HOUSES[m.house];
        if (hh && m.house !== "none" && (chatRoom === "global" || m.house !== chatRoomHouse(chatRoom))) {
          var badge = document.createElement("span");
          badge.className = "cm-house";
          badge.textContent = (hh.crest ? hh.crest + " " : "") + cupHouseName(m.house);
          badge.style.background = "rgba(" + (hh.rgb || "151,161,174") + ",.18)";
          badge.style.color = hh.accent || "var(--accent)";
          name.appendChild(badge);
        }
        row.appendChild(name);
      }

      var line = document.createElement("div");
      line.className = "cm-row";
      var b = document.createElement("div");
      b.className = "cm-b";
      if (m.reply) {
        var q = document.createElement("div");
        q.className = "cm-q";
        q.setAttribute("data-jump", m.reply.id);
        q.style.color = mine ? "inherit" : (m.reply.deleted ? "var(--dim)" : chatColor(m.reply.house));
        var qb = document.createElement("b");
        qb.textContent = m.reply.deleted ? L("chatDeletedMsg") : (m.reply.name || "Sehrgar");
        q.appendChild(qb);
        if (!m.reply.deleted) {
          var qs = document.createElement("span");
          qs.textContent = m.reply.kind === "join" ? L("chatJoinQuote") : m.reply.text;
          q.appendChild(qs);
        }
        b.appendChild(q);
      }
      if (m.chess) { b.className += " cm-chess"; b.appendChild(chessChatCard(m)); }
      else { chatFillText(b, m.text); }
      var reacts = m.reactions || [];
      if (reacts.length) {
        var rx = document.createElement("div");
        rx.className = "cm-rx" + (m.edited ? " ed" : "");
        reacts.forEach(function(r) {
          var pill = document.createElement("button");
          pill.type = "button";
          pill.className = "rx" + (r.me ? " me" : "");
          pill.setAttribute("data-rx", r.e);
          pill.textContent = r.e + " " + r.n;
          rx.appendChild(pill);
        });
        b.appendChild(rx);
      } else {
        var sp = document.createElement("span");
        sp.className = "cm-sp" + (m.edited ? " ed" : "");
        b.appendChild(sp);
      }
      var meta = document.createElement("span");
      meta.className = "cm-meta";
      meta.appendChild(document.createTextNode((m.edited ? L("chatEdited") + " " : "") + chatHM(d)));
      if (mine) {
        var st = document.createElement("span");
        st.innerHTML = CHAT_ICON[m.st || "sent"];
        meta.appendChild(st);
      }
      b.appendChild(meta);
      line.appendChild(b);
      if (!m.tmp) {
        var sw = document.createElement("span");
        sw.className = "cm-swipe";
        sw.innerHTML = CHAT_SVG.reply;
        line.appendChild(sw);
      }
      row.appendChild(line);
      if (m.st === "failed" && m.err) {
        var err = document.createElement("div");
        err.className = "cm-err";
        err.textContent = m.err;
        row.appendChild(err);
      }
      frag.appendChild(row);
      m.anim = false;
      prev = m;
    });
    chatNewIds = {};
    box.appendChild(frag);
  }

  // Yangi saralangan o'quvchi: fakultet gerbi, xush kelibsiz va "Salom berish" (👋 javob).
  function chatJoinCard(m, mine) {
    var hh = HOUSES[m.house] || HOUSES.none || {};
    var row = document.createElement("div");
    row.className = "cm cm-join" + ((chatNewIds[m.id] || m.anim) ? " new" : "");
    row.setAttribute("data-id", m.id);
    var card = document.createElement("div");
    card.className = "cm-jc";
    card.style.setProperty("--jc-rgb", hh.rgb || "151,161,174");
    card.style.setProperty("--jc-ac", hh.accent || "var(--accent)");
    var img = cupCrestImg(m.house, 46);
    if (img) card.appendChild(img);
    var t = document.createElement("div");
    t.className = "cm-jc-t";
    var parts = L("chatJoinTitle").split("%s"), nm = document.createElement("b");
    nm.textContent = m.name || "Sehrgar";
    t.appendChild(document.createTextNode(parts[0]));
    t.appendChild(nm);
    t.appendChild(document.createTextNode(parts[1] || ""));
    card.appendChild(t);
    var sub = document.createElement("div");
    sub.className = "cm-jc-s";
    sub.textContent = L(mine ? "chatJoinMine" : "chatJoinSub").replace("%s", cupHouseName(m.house));
    card.appendChild(sub);
    var reacts = m.reactions || [];
    if (reacts.length) {
      var rx = document.createElement("div");
      rx.className = "cm-rx";
      reacts.forEach(function(r) {
        var pill = document.createElement("button");
        pill.type = "button";
        pill.className = "rx" + (r.me ? " me" : "");
        pill.setAttribute("data-rx", r.e);
        pill.textContent = r.e + " " + r.n;
        rx.appendChild(pill);
      });
      card.appendChild(rx);
    }
    if (!mine && chatBannedUntil === false) {
      var w = document.createElement("button");
      w.type = "button";
      w.className = "cm-jc-w";
      w.textContent = L("chatJoinWave");
      w.addEventListener("click", function(e) { e.stopPropagation(); chatWave(m); });
      card.appendChild(w);
    }
    var h = document.createElement("div");
    h.className = "cm-jc-h";
    h.textContent = chatHM(chatDate(m));
    card.appendChild(h);
    row.appendChild(card);
    return row;
  }

  // "Salom berish": 👋 xabari shu kartaga javob bo'lib ketadi (yozilayotgan matn saqlanadi).
  function chatWave(m) {
    if (chatCompose) chatCancelCompose();
    var inp = $("chat-input"), draft = inp.value;
    chatCompose = { mode: "reply", id: m.id };
    inp.value = "\ud83d\udc4b";
    chatSend();
    inp.value = draft;
    chatGrow();
    chatSendState();
  }

  // Qayta chizadi va ko'rinib turgan joyni saqlaydi.
  // "bottom" - pastga tushadi; "keep" - joyida qoladi; "prepend" - tepaga eski xabarlar qo'shildi.
  // Barmoq xabarni surayotgan paytda chizish keyinga qoldiriladi.
  function chatPaint(mode) {
    var box = $("chat-messages");
    if (!box) return;
    if (chatPress && mode !== "prepend") { chatPendingPaint = true; return; }
    var oldH = box.scrollHeight, oldTop = box.scrollTop;
    renderChat();
    var bar = mode === "divider" ? $("chat-unread-bar") : null;
    if (bar) box.scrollTop = Math.max(0, bar.offsetTop - 56);
    else if (mode === "bottom" || mode === "divider") box.scrollTop = box.scrollHeight;
    else if (mode === "prepend") box.scrollTop = oldTop + (box.scrollHeight - oldH);
    else box.scrollTop = oldTop;
    chatScrolled();
  }

  function chatScrolled() {
    var box = $("chat-messages");
    if (!box) return;
    var R = chatRooms[chatRoom];
    if (!R) return;
    var gap = box.scrollHeight - box.scrollTop - box.clientHeight;
    chatStick = gap < 80 && !R.moreNew;
    chatSeen();
    var below = chatBelow(R);
    $("chat-down").classList.toggle("hidden", chatStick || !(gap > 300 || below > 0 || R.moreNew));
    var n = $("chat-down-n");
    n.textContent = chatBadge(below);
    n.classList.toggle("hidden", !below);
    if (box.scrollTop < 200 && R.loaded && R.more && !R.loadingOld && Date.now() - R.oldFail > 3000) {
      chatLoadOlder();
    }
    if (gap < 300 && R.loaded && R.moreNew && !R.loadingNew && Date.now() - R.newFail > 3000) {
      chatLoadNewer();
    }
  }

  // Pastda qolgan o'qilmaganlar: yuklanganlar + hali yuklanmaganlar.
  function chatBelow(R) {
    var me = chatUser().id || 0, n = 0;
    R.msgs.forEach(function(m) { if (!m.tmp && m.uid != me && m.id > R.read) n++; });
    return n + (R.moreNew ? R.hidden : 0);
  }

  // Ekranning pastki chetigacha ko'ringan eng oxirgi xabar - o'qilgan.
  function chatSeen() {
    var box = $("chat-messages"), R = chatRooms[chatRoom];
    if (!R || !R.loaded || !chatOpen || document.hidden) return;
    var edge = box.scrollTop + box.clientHeight + 4, rows = box.querySelectorAll(".cm");
    for (var i = rows.length - 1; i >= 0; i--) {
      var id = parseInt(rows[i].getAttribute("data-id"), 10);
      if (!id) continue;
      if (rows[i].offsetTop + rows[i].offsetHeight <= edge) {
        if (id > R.read) { R.read = id; chatSendRead(chatRoom); }
        return;
      }
    }
  }

  // Serverga "shu yergacha o'qidim" - tez-tez emas, bir oz to'plab.
  function chatSendRead(room) {
    clearTimeout(chatReadTimer);
    chatReadTimer = setTimeout(function() {
      var R = chatRooms[room];
      if (R.read <= R.sentRead) return;
      R.sentRead = R.read;
      chatAct(room, { action: "read", id: R.read }).catch(function() { R.sentRead = 0; });
    }, 800);
  }

  function chatPoll() {
    if (!chatOpen || chatRoom === "dms") return;
    if ($("scr-chat").classList.contains("hidden")) { chatStop(); return; }
    var d = chatInitData();
    if (!d) return;
    var room = chatRoom, R = chatRooms[room], seq = ++chatSeq;
    if (chatCtl) { try { chatCtl.abort(); } catch (e) {} }
    var ctl = window.AbortController ? new AbortController() : null;
    chatCtl = ctl;
    var url = API_CHAT + "?room=" + room +
      (R.loaded ? "&since=" + R.rev + "&wait=1" : (R.latest ? "" : "&unread=1"));
    var started = Date.now();
    fetch(url, { headers: { "X-Telegram-Init-Data": d }, signal: ctl ? ctl.signal : undefined })
      .then(function(r) { return r.json(); })
      .then(function(res) {
        if (seq !== chatSeq) return;
        if (!res || !res.ok) throw new Error("chat");
        chatFails = 0;
        chatApplyLive(res);
        if (!R.loaded) {
          R.loaded = true;
          R.more = !!res.more;
          R.moreNew = !!res.more_new;
          R.rev = res.rev || 0;
          R.read = R.sentRead = res.read || 0;
          R.divider = res.unread ? R.read : 0;
          chatMerge(R, res.messages, false);
          if (R.moreNew) {
            var me = chatUser().id || 0, loadedNew = 0;
            R.msgs.forEach(function(m) { if (!m.tmp && m.uid != me && m.id > R.read) loadedNew++; });
            R.hidden = Math.max(0, (res.unread || 0) - loadedNew);
          }
          chatPaint(R.divider ? "divider" : "bottom");
        } else {
          if (res.rev) R.rev = Math.max(R.rev, res.rev);
          var r = chatMerge(R, res.messages, true);
          if (r.added.length) chatArrived(r.added);
          else if (r.changed) chatPaint(chatStick ? "bottom" : "keep");
        }
        // Eski server (yangilanish paytida) javobni ushlab turmaydi va
        // o'zgarish raqamini bermaydi - tinmay so'rab qolmaslik uchun kutamiz.
        var delay = (res.rev === undefined && Date.now() - started < 1500) ? 3000 : 0;
        setTimeout(function() { if (seq === chatSeq) chatPoll(); }, delay);
      })
      .catch(function() {
        if (seq !== chatSeq) return;
        chatFails++;
        setTimeout(function() { if (seq === chatSeq) chatPoll(); },
          Math.min(15000, 1000 * Math.pow(2, chatFails)));
      });
  }

  // Server har javobda: onlaynlar soni, kim yozmoqda, men bloklanganmanmi, (admin uchun) bloklar.
  function chatApplyLive(res) {
    if (res.online !== undefined) chatLive.online = res.online;
    if (res.typing) { chatLive.typing = res.typing; chatLive.until = Date.now() + 6500; }
    if (res.admin !== undefined && chatAdmin !== !!res.admin) { chatAdmin = !!res.admin; chatAdmUI(); }
    if (res.bans) {
      chatBans = {};
      res.bans.forEach(function(b) { chatBans[b.uid] = b.until; });
    }
    if (res.banned !== undefined) chatSetBanned(res.banned);
    if (res.peer) {
      chatPeers[res.peer.uid] = res.peer;
      chatLive.peerOnline = res.peer.online;
      chatLive.peerSeen = res.peer.seen || null;
      updateChatRoomUI();
    }
    if (res.peer_online !== undefined) chatLive.peerOnline = res.peer_online;
    if (res.peer_seen) chatLive.peerSeen = res.peer_seen;
    if (res.dm_state !== undefined) { chatDmState = res.dm_state; chatFootUI(); }
    chatSubUI();
    clearTimeout(chatLiveTimer);
    if (chatLive.typing.length) chatLiveTimer = setTimeout(chatSubUI, 6600);
  }

  function chatSubUI() {
    var el = $("chat-sub");
    if (!el) return;
    var t = Date.now() < chatLive.until ? chatLive.typing : [];
    el.classList.toggle("typing", t.length > 0 || (chatIsDm(chatRoom) && !!chatLive.peerOnline));
    el.innerHTML = "";
    if (chatRoom === "dms") return;
    if (chatIsDm(chatRoom)) {
      // Shaxsiy suhbat: "yozmoqda" / "onlayn" / suhbatdoshning fakulteti.
      var p = chatPeerOf(chatRoom), ph = HOUSES[p.house];
      if (t.length) {
        el.appendChild(document.createTextNode(L("chatTypingDm")));
        var d2 = document.createElement("span");
        d2.className = "chat-dots";
        d2.innerHTML = "<i></i><i></i><i></i>";
        el.appendChild(d2);
      } else if (chatLive.peerOnline) {
        el.textContent = L("chatPeerOnline");
      } else if (chatSeenText(chatLive.peerSeen || p.seen)) {
        el.textContent = chatSeenText(chatLive.peerSeen || p.seen);
      } else if (ph) {
        el.textContent = (ph.crest ? ph.crest + " " : "") + cupHouseName(p.house);
      }
      return;
    }
    if (t.length) {
      var txt = t.length === 1 ? L("chatTyping1").replace("%s", t[0].name) :
                t.length === 2 ? L("chatTyping2").replace("%s", t[0].name).replace("%s", t[1].name) :
                L("chatTypingN").replace("%s", t.length);
      el.appendChild(document.createTextNode(txt));
      var dots = document.createElement("span");
      dots.className = "chat-dots";
      dots.innerHTML = "<i></i><i></i><i></i>";
      el.appendChild(dots);
    } else if (chatLive.online) {
      el.textContent = chatLive.online <= 1 ? L("chatOnlyYou") : L("chatOnline").replace("%s", chatLive.online);
    }
  }

  function chatWhen(until) {
    var d = new Date(until);
    return chatDayLabel(d) + " " + chatHM(d);
  }

  // Bloklangan odam yozish maydoni o'rnida sababini ko'radi.
  function chatSetBanned(until) {
    chatBannedUntil = until === undefined ? false : until;
    var on = chatBannedUntil !== false;
    $("chat-banned").textContent = !on ? "" : chatBannedUntil ?
      L("chatBanned").replace("%s", chatWhen(chatBannedUntil)) : L("chatBannedForever");
    chatFootUI();
  }

  // Pastki qism: yozish maydoni, yoki chatdan blok izohi, yoki shaxsiy suhbat yopiqligi izohi.
  function chatFootUI() {
    var banned = chatBannedUntil !== false;
    var dmNo = !banned && chatIsDm(chatRoom) && chatDmState !== "ok";
    $("chat-banned").classList.toggle("hidden", !banned);
    var note = $("chat-dmnote");
    note.classList.toggle("hidden", !dmNo);
    note.innerHTML = "";
    if (dmNo) {
      var mine = chatDmState === "blocked_by_me";
      note.appendChild(document.createTextNode(L(mine ? "chatDmYouBlocked" : "chatDmClosed")));
      if (mine) {
        var p = chatPeerOf(chatRoom), btn = document.createElement("button");
        btn.type = "button";
        btn.textContent = L("chatDmUnblock");
        btn.addEventListener("click", function() { chatBlock(p, false); });
        note.appendChild(document.createElement("br"));
        note.appendChild(btn);
      }
    }
    $("chat-form").classList.toggle("hidden", banned || dmNo);
    if (banned || dmNo) { chatCancelCompose(); $("chat-at").classList.add("hidden"); }
  }

  // Pastdan chiqadigan tanlov oynasi (sozlamalar, bloklash).
  function chatSheet(title, note, items) {
    chatCloseMenu();
    var ov = document.createElement("div");
    ov.className = "chat-menu";
    var panel = document.createElement("div");
    panel.className = "chat-sheet";
    var list = document.createElement("div");
    list.className = "chat-menu-list";
    if (title) {
      var t = document.createElement("div");
      t.className = "chat-sheet-t";
      t.textContent = title;
      list.appendChild(t);
    }
    if (note) {
      var n = document.createElement("div");
      n.className = "chat-sheet-n";
      n.textContent = note;
      list.appendChild(n);
    }
    items.forEach(function(it) {
      if (it.head) {
        var h = document.createElement("div");
        h.className = "chat-sheet-h";
        h.textContent = it.head;
        list.appendChild(h);
        return;
      }
      var btn = document.createElement("button");
      btn.type = "button";
      if (it.danger) btn.className = "danger";
      var ic = document.createElement("i");
      ic.innerHTML = it.icon || "";
      btn.appendChild(ic);
      btn.appendChild(document.createTextNode(it.label));
      if (it.on) {
        var ck = document.createElement("span");
        ck.className = "chat-sheet-ck";
        ck.innerHTML = CHAT_SVG.check;
        btn.appendChild(ck);
      }
      btn.addEventListener("click", function() { chatCloseMenu(); it.fn(); });
      list.appendChild(btn);
    });
    panel.appendChild(list);
    ov.appendChild(panel);
    ov.addEventListener("click", function(e) { if (e.target === ov) chatCloseMenu(); });
    $("scr-chat").appendChild(ov);
    chatMenuEl = ov;
  }

  function chatPrivacyLabel(v) {
    return L(v === "house" ? "chatDmHouse" : v === "none" ? "chatDmNone" : "chatDmAll");
  }

  // "Kim menga yoza oladi" + bloklanganlar ro'yxati.
  function chatPrivacySheet() {
    var set = chatDmSet || { privacy: "all", blocked: [] };
    var items = ["all", "house", "none"].map(function(v) {
      return { label: chatPrivacyLabel(v), on: set.privacy === v, fn: function() { chatSetPrivacy(v); } };
    });
    if (set.blocked.length) {
      items.push({ head: L("chatDmBlockedList") });
      set.blocked.forEach(function(p) {
        items.push({ icon: CHAT_SVG.unban, label: L("chatDmUnblock") + ": " + (p.name || "Sehrgar"),
                     fn: function() { chatBlock(p, false); } });
      });
    }
    chatSheet(L("chatDmWho"), L("chatDmWhoNote"), items);
  }

  function chatSetPrivacy(v) {
    chatAct("global", { action: "dm_privacy", value: v }).then(function(res) {
      if (!(res && res.ok)) { chatActFail(res); return; }
      chatDmSet = res.settings;
      if (chatRoom === "dms") chatLoadDms();
    }).catch(function() { chatActFail(); });
  }

  // Shaxsiy suhbat sarlavhasi bosilganda: bloklash / blokdan chiqarish.
  function chatPeerSheet() {
    var p = chatPeerOf(chatRoom), blocked = chatDmState === "blocked_by_me";
    chatSheet(p.name || "Sehrgar", null, [
      { icon: CHAT_SVG.odam, label: odamX().peer, fn: function() { odamOpen(p.uid, p); } },
      { icon: CHESS_IC.swords, label: L("chatChess"), fn: function() { chessAnnounce(chatRoom); } },
      blocked ?
      { icon: CHAT_SVG.unban, label: L("chatDmUnblock"), fn: function() { chatBlock(p, false); } } :
      { icon: CHAT_SVG.ban, label: L("chatDmBlock"), danger: true, fn: function() { chatBlock(p, true); } }]);
  }

  function chatBlock(p, on) {
    function go() {
      chatAct("global", { action: on ? "block" : "unblock", uid: p.uid }).then(function(res) {
        if (!(res && res.ok)) { chatActFail(res); return; }
        chatDmSet = res.settings;
        showToast(L(on ? "chatBanDone" : "chatUnbanDone").replace("%s", p.name || "Sehrgar"), "ok");
        if (chatIsDm(chatRoom) && chatPeerOf(chatRoom).uid == p.uid) {
          // Holatni serverdan qayta olamiz (blokdan chiqqach ham sozlama yopiq bo'lishi mumkin).
          chatResetRoom(chatRoom);
          chatPaint("bottom");
          chatPoll();
        } else if (chatRoom === "dms") {
          chatLoadDms();
        }
      }).catch(function() { chatActFail(); });
    }
    if (!on) { go(); return; }
    var ask = L("chatDmBlockAsk").replace("%s", p.name || "Sehrgar");
    testAsk(ask, go);
  }

  // "Yozmoqda" - 4 soniyada bir martadan ko'p yuborilmaydi.
  function chatTyping() {
    if (chatBannedUntil !== false || (chatCompose && chatCompose.mode === "edit")) return;
    if (chatIsDm(chatRoom) && chatDmState !== "ok") return;
    if (!$("chat-input").value.trim() || Date.now() - chatTypingSent < 4000) return;
    chatTypingSent = Date.now();
    chatAct(chatRoom, { action: "typing" }).catch(function() {});
  }

  // Admin: bloklash / blokdan chiqarish.
  function chatBanAct(m, hours, unban) {
    function go() {
      var body = { action: unban ? "unban" : "ban", uid: m.uid };
      if (hours) body.hours = hours;
      chatAct(chatRoom, body).then(function(res) {
        if (!(res && res.ok)) { chatActFail(res); return; }
        chatApplyLive({ bans: res.bans });
        showToast(L(unban ? "chatUnbanDone" : "chatBanDone").replace("%s", m.name || "Sehrgar"), "ok");
      }).catch(function() { chatActFail(); });
    }
    if (unban) { go(); return; }
    var ask = L("chatBanAsk").replace("%s", m.name || "Sehrgar");
    testAsk(ask, go);
  }

  function chatArrived(added) {
    var me = chatUser().id || 0;
    added.forEach(function(m) { if (m.uid != me) chatNewIds[m.id] = true; });
    chatPaint(chatStick ? "bottom" : "keep");
  }

  // O'qilmaganlar ko'p bo'lsa pastga surgan sari keyingi sahifa yuklanadi.
  function chatLoadNewer() {
    var room = chatRoom, R = chatRooms[room], d = chatInitData(), after = chatLastId(R);
    if (!d || !after) return;
    R.loadingNew = true;
    fetch(API_CHAT + "?room=" + room + "&after=" + after, { headers: { "X-Telegram-Init-Data": d } })
      .then(function(r) { return r.json(); })
      .then(function(res) {
        R.loadingNew = false;
        if (!(res && res.ok)) { R.newFail = Date.now(); return; }
        var me = chatUser().id || 0;
        chatMerge(R, res.messages, false).added.forEach(function(m) {
          if (m.uid != me && R.hidden > 0) R.hidden--;
        });
        R.moreNew = !!res.more_new;
        if (!R.moreNew) { R.hidden = 0; R.hiddenIds = {}; }
        if (chatRoom === room) chatPaint("keep");
      })
      .catch(function() { R.loadingNew = false; R.newFail = Date.now(); });
  }

  // Eng so'nggi xabarlarga o'tish (o'rtadan pastdagi tugma yoki xabar yozganda).
  function chatJumpLatest() {
    chatResetRoom(chatRoom, true);
    chatPaint("bottom");
    chatPoll();
  }

  function chatLoadOlder() {
    var room = chatRoom, R = chatRooms[room], d = chatInitData(), before = chatFirstId(R);
    if (!d || !before) return;
    R.loadingOld = true;
    chatPaint("prepend");
    fetch(API_CHAT + "?room=" + room + "&before=" + before, { headers: { "X-Telegram-Init-Data": d } })
      .then(function(r) { return r.json(); })
      .then(function(res) {
        R.loadingOld = false;
        if (res && res.ok) {
          R.more = !!res.more;
          chatMerge(R, res.messages, false);
        } else {
          R.oldFail = Date.now();
        }
        if (chatRoom === room) chatPaint("prepend");
      })
      .catch(function() {
        R.loadingOld = false;
        R.oldFail = Date.now();
        if (chatRoom === room) chatPaint("prepend");
      });
  }

  function chatSend() {
    var inp = $("chat-input");
    var text = (inp.value || "").trim();
    if (!text) return;
    if (text.length > 1000) { showToast(L("chatLong")); return; }
    var R = chatRooms[chatRoom];
    $("chat-at").classList.add("hidden");
    if (chatCompose && chatCompose.mode === "edit") {
      var em = chatFind(R, chatCompose.id);
      chatCancelCompose();
      if (em && em.text !== text) chatEdit(em, text);
      return;
    }
    var reply = null;
    if (chatCompose && chatCompose.mode === "reply") {
      var rm = chatFind(R, chatCompose.id);
      if (rm) reply = { id: rm.id, uid: rm.uid, name: rm.name, house: rm.house, text: String(rm.text).slice(0, 120), kind: rm.kind };
      chatCancelCompose();
    }
    if (R.moreNew) { chatJumpLatest(); R = chatRooms[chatRoom]; }
    var u = chatUser();
    var m = {
      tmp: true, anim: true, st: "sending",
      id: "t" + Date.now(),
      cid: Date.now().toString(36) + Math.random().toString(36).slice(2, 8),
      uid: u.id || 0, name: u.first_name || "Sehrgar", house: cupMe().house,
      text: text, time: new Date().toISOString(), reply: reply
    };
    R.msgs.push(m);
    inp.value = "";
    chatGrow();
    chatSendState();
    chatPaint("bottom");
    chatPost(chatRoom, m);
  }

  // Internet uzilsa o'zi 2 marta qayta urinadi; server cid bo'yicha
  // takrorni taniydi, shuning uchun xabar ikki marta chiqmaydi.
  function chatPost(room, m) {
    var R = chatRooms[room], d = chatInitData();
    if (m.st !== "sending") {
      m.st = "sending";
      m.err = "";
      if (chatRoom === room) chatPaint("keep");
    }
    fetch(API_CHAT, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Telegram-Init-Data": d },
      body: JSON.stringify({ text: m.text, room: room, cid: m.cid, v: 2, initData: d,
                             reply_to: m.reply ? m.reply.id : undefined })
    }).then(function(r) { return r.json(); })
      .then(function(res) {
        m.tries = 0;
        if (res && res.ok && (res.message || res.messages)) {
          try { sqDone("chat"); } catch (e) {}
          R.msgs = R.msgs.filter(function(x) { return x !== m; });
          if (res.message) {
            res.message.cid = m.cid;
            R.read = R.sentRead = Math.max(R.read, res.message.id);
            R.divider = 0;
          }
          chatMerge(R, res.message ? [res.message] : res.messages, false);
        } else if (res && res.error === "slow") {
          m.st = "failed";
          m.err = L("chatSlow").replace("%s", res.retry || 5);
        } else if (res && res.error === "banned") {
          m.st = "failed";
          m.err = "";
          chatSetBanned(res.until);
        } else if (res && (res.error === "dm_closed" || res.error === "dm_blocked_by_me")) {
          m.st = "failed";
          m.err = "";
          chatDmState = res.error.slice(3);
          chatFootUI();
        } else {
          m.st = "failed";
          m.err = L("chatFailed");
        }
        if (chatRoom === room) chatPaint(chatStick ? "bottom" : "keep");
      })
      .catch(function() {
        m.tries = (m.tries || 0) + 1;
        if (m.tries < 3) { setTimeout(function() { chatPost(room, m); }, 1500 * m.tries); return; }
        m.tries = 0;
        m.st = "failed";
        m.err = L("chatFailed");
        if (chatRoom === room) chatPaint("keep");
      });
  }

  // Tahrir, o'chirish, reaksiya - bitta manzil, "action" bilan.
  function chatAct(room, body) {
    var d = chatInitData();
    body.room = room;
    body.initData = d;
    return fetch(API_CHAT, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Telegram-Init-Data": d },
      body: JSON.stringify(body)
    }).then(function(r) { return r.json(); });
  }

  function chatActFail(res) {
    var e = res && res.error;
    if (e === "banned") { chatSetBanned(res.until); return; }
    if (e === "dm_closed" || e === "dm_blocked_by_me") { chatDmState = e.slice(3); chatFootUI(); return; }
    showToast(e === "slow" ? L("chatSlowAct").replace("%s", res.retry || 5) :
              e === "too_old" ? L("chatTooOld") : L("chatActFail"));
  }

  // Bir odam - bir xabarga bitta reaksiya; o'sha belgini qayta bosish uni olib tashlaydi.
  // Ekranda darhol ko'rinadi, server rad etsa - qaytariladi.
  function chatReact(m, emoji) {
    if (m.tmp) return;
    try { sqDone("chat"); } catch (e) {}
    var room = chatRoom, R = chatRooms[room], saved = JSON.stringify(m.reactions || []);
    var list = JSON.parse(saved), had = null;
    list.forEach(function(r) { if (r.me) { had = r.e; r.n--; r.me = false; } });
    if (had !== emoji) {
      var ex = list.filter(function(r) { return r.e === emoji; })[0];
      if (ex) { ex.n++; ex.me = true; } else list.push({ e: emoji, n: 1, me: true });
    }
    m.reactions = list.filter(function(r) { return r.n > 0; });
    chatHaptic("light");
    chatPaint(chatStick ? "bottom" : "keep");
    function undo(res) {
      m.reactions = JSON.parse(saved);
      chatActFail(res);
      if (chatRoom === room) chatPaint("keep");
    }
    chatAct(room, { action: "react", id: m.id, emoji: emoji }).then(function(res) {
      if (!(res && res.ok && res.message)) { undo(res); return; }
      chatMerge(R, [res.message], false);
      if (chatRoom === room) chatPaint(chatStick ? "bottom" : "keep");
    }).catch(function() { undo(); });
  }

  function chatEdit(m, text) {
    var room = chatRoom, R = chatRooms[room], oldText = m.text, oldEd = m.edited;
    m.text = text;
    m.edited = true;
    chatPaint("keep");
    function undo(res) {
      m.text = oldText;
      m.edited = oldEd;
      chatActFail(res);
      if (chatRoom === room) chatPaint("keep");
    }
    chatAct(room, { action: "edit", id: m.id, text: text }).then(function(res) {
      if (!(res && res.ok && res.message)) { undo(res); return; }
      chatMerge(R, [res.message], false);
      if (chatRoom === room) chatPaint("keep");
    }).catch(function() { undo(); });
  }

  function chatDelete(m) {
    var room = chatRoom, R = chatRooms[room];
    function go() {
      R.msgs = R.msgs.filter(function(x) { return x !== m; });
      chatPaint("keep");
      if (m.tmp) return;
      function undo(res) {
        chatMerge(R, [m], false);
        chatActFail(res);
        if (chatRoom === room) chatPaint("keep");
      }
      chatAct(room, { action: "delete", id: m.id }).then(function(res) {
        if (!(res && res.ok)) undo(res);
      }).catch(function() { undo(); });
    }
    if (m.tmp) { go(); return; }
    testAsk(L("chatDeleteAsk"), go);
  }

  function chatCopy(text) {
    function done() { showToast(L("chatCopied"), "ok"); }
    function fallback() {
      var ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand("copy"); done(); } catch (e) {}
      document.body.removeChild(ta);
    }
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, fallback);
    else fallback();
  }

  function chatJump(id) {
    var el = $("chat-messages").querySelector('.cm[data-id="' + id + '"]');
    if (!el) { showToast(L("chatNotLoaded")); return; }
    el.scrollIntoView({ block: "center", behavior: "smooth" });
    el.classList.remove("flash");
    void el.offsetWidth;
    el.classList.add("flash");
  }

  // Yozish maydoni ustidagi "Javob: ..." yoki "Tahrirlash" tasmasi.
  function chatShowBar(icon, title, text) {
    $("chat-bar-ic").innerHTML = icon;
    $("chat-bar-t").textContent = title;
    $("chat-bar-s").textContent = text;
    $("chat-bar").classList.remove("hidden");
    var box = $("chat-messages");
    if (chatStick) box.scrollTop = box.scrollHeight;
  }

  function chatStartReply(m) {
    if (m.tmp) return;
    if (chatCompose && chatCompose.mode === "edit") $("chat-input").value = "";
    chatCompose = { mode: "reply", id: m.id };
    chatShowBar(CHAT_SVG.reply, L("chatReplyTo").replace("%s", m.name || "Sehrgar"), m.kind === "join" ? L("chatJoinQuote") : m.text);
    chatSendState();
    $("chat-input").focus();
  }

  function chatStartEdit(m) {
    var inp = $("chat-input");
    chatCompose = { mode: "edit", id: m.id };
    chatShowBar(CHAT_SVG.edit, L("chatEditing"), m.text);
    inp.value = m.text;
    chatGrow();
    chatSendState();
    inp.focus();
    try { inp.setSelectionRange(inp.value.length, inp.value.length); } catch (e) {}
  }

  function chatCancelCompose() {
    if (!chatCompose) return;
    if (chatCompose.mode === "edit") $("chat-input").value = "";
    chatCompose = null;
    $("chat-bar").classList.add("hidden");
    chatGrow();
    chatSendState();
  }

  function chatCanEdit(m) { return !m.tmp && Date.now() - chatDate(m).getTime() < CHAT_EDIT_MS; }

  function chatCloseMenu() {
    if (chatMenuEl) { chatMenuEl.remove(); chatMenuEl = null; }
  }

  // Bosib ushlab turilganda: tepada reaksiyalar, pastda amallar.
  function chatMenu(m, bub) {
    chatCloseMenu();
    chatHaptic("medium");
    var own = m.uid == (chatUser().id || 0);
    var ov = document.createElement("div");
    ov.className = "chat-menu";
    var panel = document.createElement("div");
    panel.className = "chat-menu-box";
    if (!m.tmp && chatBannedUntil === false) {
      var mineR = (m.reactions || []).filter(function(r) { return r.me; })[0];
      var rx = document.createElement("div");
      rx.className = "chat-menu-rx";
      CHAT_REACTS.forEach(function(e) {
        var btn = document.createElement("button");
        btn.type = "button";
        btn.textContent = e;
        if (mineR && mineR.e === e) btn.className = "on";
        btn.addEventListener("click", function() { chatCloseMenu(); chatReact(m, e); });
        rx.appendChild(btn);
      });
      panel.appendChild(rx);
    }
    var list = document.createElement("div");
    list.className = "chat-menu-list";
    function item(icon, label, fn, danger) {
      var btn = document.createElement("button");
      btn.type = "button";
      if (danger) btn.className = "danger";
      var ic = document.createElement("i");
      ic.innerHTML = icon;
      btn.appendChild(ic);
      btn.appendChild(document.createTextNode(label));
      btn.addEventListener("click", function() { chatCloseMenu(); fn(); });
      list.appendChild(btn);
    }
    if (!m.tmp && chatBannedUntil === false) item(CHAT_SVG.reply, L("chatReply"), function() { chatStartReply(m); });
    if (!own && !m.tmp && !chatIsDm(chatRoom)) {
      item(CHAT_SVG.dm, L("chatWrite"), function() { chatOpenDm({ uid: m.uid, name: m.name, house: m.house }); });
    }
    if (!m.tmp) item(CHAT_SVG.odam, odamX().peer, function() { odamOpen(m.uid, { name: m.name, house: m.house }); });
    // Kim o'qidi / kim reaksiya bosdi (egasi, 2026-10-10) - bitta oyna, ikki bo'lim
    if (!m.tmp) item(CHAT_SVG.oqildi, L("chatWhoRead"), function() { chatInfo(m, "read"); });
    if (!m.tmp && m.reactions && m.reactions.length) item(CHAT_SVG.kayfiyat, L("chatReacts"), function() { chatInfo(m, "react"); });
    if (!m.kind) item(CHAT_SVG.copy, L("chatCopy"), function() { chatCopy(m.text); });
    if (own && chatCanEdit(m) && !m.chess && !m.kind) item(CHAT_SVG.edit, L("chatEdit"), function() { chatStartEdit(m); });
    if (own || (chatAdmin && !m.tmp)) item(CHAT_SVG.trash, L("chatDelete"), function() { chatDelete(m); }, true);
    if (chatAdmin && !own && !m.tmp) {
      if (m.uid in chatBans) {
        item(CHAT_SVG.unban, L("chatUnban"), function() { chatBanAct(m, 0, true); });
      } else {
        item(CHAT_SVG.ban24, L("chatBan24"), function() { chatBanAct(m, 24); });
        item(CHAT_SVG.ban, L("chatBanForever"), function() { chatBanAct(m, 0); }, true);
      }
    }
    panel.appendChild(list);
    ov.appendChild(panel);
    ov.addEventListener("click", function(e) { if (e.target === ov) chatCloseMenu(); });
    ov.addEventListener("contextmenu", function(e) { e.preventDefault(); chatCloseMenu(); });

    // Bosilgan xabarning nusxasi xiralashgan fon ustida aniq turadi (Telegramdagidek).
    var host = $("scr-chat"), hr = host.getBoundingClientRect(), r = bub.getBoundingClientRect();
    var ghost = document.createElement("div");
    ghost.className = bub.closest(".cm").className.replace(/\b(new|flash)\b/g, "") + " cm-ghost";
    ghost.style.left = (r.left - hr.left) + "px";
    ghost.style.top = (r.top - hr.top) + "px";
    ghost.style.width = r.width + "px";
    ghost.appendChild(bub.cloneNode(true));
    ov.insertBefore(ghost, panel);
    host.appendChild(ov);
    chatMenuEl = ov;

    var W = hr.width, H = hr.height, x = r.left - hr.left, y = r.top - hr.top;
    var bw = panel.offsetWidth, bh = panel.offsetHeight;
    var left = Math.max(8, Math.min(W - bw - 8, own ? x + r.width - bw : x));
    var top = y + r.height + 8;
    if (top + bh > H - 8) top = y - bh - 8;
    if (top < 8) top = Math.max(8, (H - bh) / 2);
    panel.style.left = left + "px";
    panel.style.top = top + "px";
  }

  // "@" yozilganda shu xonada yozgan odamlarning ismlari taklif qilinadi.
  function chatAtUpdate() {
    var inp = $("chat-input"), bar = $("chat-at");
    var head = inp.value.slice(0, inp.selectionStart == null ? inp.value.length : inp.selectionStart);
    var mt = head.match(/(^|\s)@([^\s@]*)$/);
    bar.innerHTML = "";
    if (!mt) { bar.classList.add("hidden"); return; }
    var q = mt[2].toLowerCase(), me = chatUser().id || 0, seen = {}, names = [], R = chatRooms[chatRoom] || chatNewRoom();
    for (var i = R.msgs.length - 1; i >= 0 && names.length < 6; i--) {
      var m = R.msgs[i], nm = String(m.name || "").split(/\s+/)[0], key = nm.toLowerCase();
      if (m.uid == me || !nm || seen[key]) continue;
      seen[key] = true;
      if (key.indexOf(q) === 0) names.push(nm);
    }
    if (!names.length) { bar.classList.add("hidden"); return; }
    names.forEach(function(nm) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.textContent = "@" + nm;
      function pick(e) {
        e.preventDefault();
        var pos = inp.selectionStart == null ? inp.value.length : inp.selectionStart;
        var left = inp.value.slice(0, pos).replace(/@([^\s@]*)$/, "@" + nm + " ");
        inp.value = left + inp.value.slice(pos);
        try { inp.setSelectionRange(left.length, left.length); } catch (err) {}
        inp.focus();
        chatGrow();
        chatSendState();
        bar.classList.add("hidden");
      }
      btn.addEventListener("mousedown", function(e) { e.preventDefault(); });
      btn.addEventListener("touchend", pick);
      btn.addEventListener("click", pick);
      bar.appendChild(btn);
    });
    bar.classList.remove("hidden");
  }

  function setChatRoom(room) {
    if (chatRoom === room) return;
    chatRoom = room;
    if (room !== "dms") chatResetRoom(room);
    chatLive = { typing: [], online: 0, until: 0 };
    chatDmState = "ok";
    chatCancelCompose();
    $("chat-at").classList.add("hidden");
    updateChatRoomUI();
    chatSubUI();
    chatShowView();
    chatFootUI();
    if (room === "dms") {
      chatSeq++;
      if (chatCtl) { try { chatCtl.abort(); } catch (e) {} chatCtl = null; }
      chatLoadDms();
    } else {
      chatPaint("bottom");
      chatPoll();
    }
    chatRefreshCounts();
  }

  // Suhbatlar ro'yxati yoki xabarlar oynasi.
  function chatShowView() {
    var list = chatRoom === "dms";
    $("chat-messages").classList.toggle("hidden", list);
    $("chat-dms").classList.toggle("hidden", !list);
    $("scr-chat").querySelector(".chat-foot").classList.toggle("hidden", list);
    if (list) $("chat-down").classList.add("hidden");
    clearInterval(chatDmTimer);
    if (list) chatDmTimer = setInterval(chatLoadDms, 8000);
  }

  function chatOpenDm(peer) {
    if (!peer || peer.uid == (chatUser().id || 0)) return;
    chatPeers[peer.uid] = chatPeers[peer.uid] || peer;
    chatClosePeople();
    setChatRoom("dm:" + peer.uid);
  }

  function chatLoadDms() {
    var d = chatInitData();
    if (!d) return;
    fetch(API_CHAT + "?dms=1", { headers: { "X-Telegram-Init-Data": d } })
      .then(function(r) { return r.json(); })
      .then(function(res) {
        if (!(res && res.ok) || chatRoom !== "dms") return;
        res.dms.forEach(function(x) { chatPeers[x.peer.uid] = x.peer; });
        if (res.settings) chatDmSet = res.settings;
        chatRenderDms(res.dms);
      }).catch(function() {});
  }

  // Bitta odam qatori: fakultet gerbi (onlayn bo'lsa yashil nuqta), ism, izoh, o'ng tomon.
  function chatPersonRow(p, sub, subOn, right, badge) {
    var hh = HOUSES[p.house] || HOUSES.none;
    var row = document.createElement("button");
    row.type = "button";
    row.className = "pp";
    var av = document.createElement("span");
    av.className = "pp-av" + (p.online ? " on" : "");
    av.style.setProperty("--pp-rgb", hh.rgb || "151,161,174");
    av.textContent = hh.crest || "?";
    var tx = document.createElement("span");
    tx.className = "pp-tx";
    var nm = document.createElement("b");
    nm.textContent = p.name || "Sehrgar";
    nm.style.color = hh.accent || "var(--text)";
    var sb = document.createElement("span");
    sb.textContent = sub;
    if (subOn) sb.className = "on";
    tx.appendChild(nm);
    tx.appendChild(sb);
    var r = document.createElement("span");
    r.className = "pp-r";
    if (right) {
      var rt = document.createElement("span");
      if (right.charAt(0) === "<") rt.innerHTML = right; else rt.textContent = right;
      r.appendChild(rt);
    }
    if (badge) {
      var bd = document.createElement("span");
      bd.className = "pp-n";
      bd.textContent = chatBadge(badge);
      r.appendChild(bd);
    }
    row.appendChild(av);
    row.appendChild(tx);
    row.appendChild(r);
    return row;
  }

  function chatRenderDms(list) {
    var box = $("chat-dms"), me = chatUser().id || 0;
    box.innerHTML = "";
    var set = document.createElement("button");
    set.type = "button";
    set.className = "chat-dms-set";
    set.innerHTML = "<i>" + CHAT_SVG.lock + "</i>";
    var sl = document.createElement("span");
    sl.textContent = L("chatDmWhoShort");
    var sv = document.createElement("em");
    sv.textContent = chatPrivacyLabel(chatDmSet && chatDmSet.privacy) + " ›";
    set.appendChild(sl);
    set.appendChild(sv);
    set.addEventListener("click", chatPrivacySheet);
    box.appendChild(set);
    if (!list.length) {
      var empty = document.createElement("div");
      empty.className = "chat-dms-empty";
      empty.appendChild(document.createTextNode(L("chatDmEmpty")));
      var go = document.createElement("button");
      go.type = "button";
      go.textContent = L("chatDmFind");
      go.addEventListener("click", function() { chatOpenPeople("global"); });
      empty.appendChild(document.createElement("br"));
      empty.appendChild(go);
      box.appendChild(empty);
      return;
    }
    var today = chatDayKey(new Date());
    list.forEach(function(x) {
      var d = chatDate(x.last);
      var when = chatDayKey(d) === today ? chatHM(d) : chatDayLabel(d);
      var sub = (x.last.uid == me ? L("chatDmYou") : "") + x.last.text;
      var row = chatPersonRow(x.peer, sub, false, when, x.unread);
      row.addEventListener("click", function() { chatOpenDm(x.peer); });
      box.appendChild(row);
    });
  }

  // A'zolar oynasi: xonadagi hamma (Katta zalda - fakultet bo'yicha saralash).
  function chatOpenPeople(room) {
    var me = cupMe();
    chatPeople = { room: room, list: null, filter: "all" };
    $("chat-people-q").value = "";
    $("chat-people-title").textContent = room === "global" ? L("chatGlobalTitle") : cupHouseName(chatRoomHouse(room));
    $("chat-people-sub").textContent = "";
    $("chat-people-f").innerHTML = "";
    $("chat-people-list").innerHTML = "";
    $("chat-people-list").appendChild(chatHint(L("loading")));
    $("chat-people").classList.remove("hidden");
    var d = chatInitData();
    fetch(API_CHAT + "?members=" + room, { headers: { "X-Telegram-Init-Data": d } })
      .then(function(r) { return r.json(); })
      .then(function(res) {
        if (!chatPeople || chatPeople.room !== room || !(res && res.ok)) return;
        chatPeople.list = res.members;
        chatRenderPeople();
      }).catch(function() {});
  }

  function chatClosePeople() {
    chatPeople = null;
    $("chat-people").classList.add("hidden");
    chatCloseInfo();
  }

  /* Xabar haqida: kim reaksiya bosgan va kim o'qigan. Server: POST {action: "info", id}. Qator bosilsa - profili. */
  var chatInfoId = 0;
  function chatCloseInfo() { chatInfoId = 0; $("chat-info").classList.add("hidden"); }
  function chatInfo(m, avval) {
    chatInfoId = m.id;
    $("chat-info-title").textContent = L("chatInfoT");
    $("chat-info-sub").textContent = "";
    var box = $("chat-info-list");
    box.innerHTML = "";
    box.appendChild(chatHint(L("loading")));
    $("chat-info").classList.remove("hidden");
    chatAct(chatRoom, { action: "info", id: m.id }).then(function(res) {
      if (chatInfoId !== m.id) return;
      if (!(res && res.ok)) { box.innerHTML = ""; box.appendChild(chatHint(L("chatNobody"))); return; }
      chatInfoRender(res, avval);
    }).catch(function() { if (chatInfoId === m.id) { box.innerHTML = ""; box.appendChild(chatHint(L("chatNobody"))); } });
  }
  function chatInfoRender(res, avval) {
    var box = $("chat-info-list"), me = chatUser().id || 0;
    box.innerHTML = "";
    $("chat-info-sub").textContent = L("chatInfoSub").replace("%s", res.readers_n);
    function bolim(sarlavha, royxat, ong) {
      var t = document.createElement("div");
      t.className = "ci-t";
      t.textContent = sarlavha;
      box.appendChild(t);
      royxat.forEach(function(p) {
        var hh = HOUSES[p.house] || {};
        var row = chatPersonRow(p, p.uid == me ? L("chatYou") : (HOUSES[p.house] ? (hh.crest ? hh.crest + " " : "") + cupHouseName(p.house) : ""), false, ong ? ong(p) : "");
        row.addEventListener("click", function() { odamOpen(p.uid, { name: p.name, house: p.house }); });
        box.appendChild(row);
      });
    }
    var reak = function() { if (res.reactions.length) bolim(L("chatReactN").replace("%s", res.reactions.length), res.reactions, function(p) { return p.e; }); };
    var oqi = function() {
      bolim(L("chatReadN").replace("%s", res.readers_n), res.readers);
      if (!res.readers.length) box.appendChild(chatHint(L("chatNoRead")));
    };
    if (avval === "react") { reak(); oqi(); } else { oqi(); reak(); }
  }

  function chatRenderPeople() {
    if (!chatPeople || !chatPeople.list) return;
    var all = chatPeople.list, f = chatPeople.filter, me = chatUser().id || 0;
    var q = $("chat-people-q").value.trim().toLowerCase();
    var fb = $("chat-people-f");
    fb.innerHTML = "";
    fb.classList.toggle("hidden", chatPeople.room !== "global");
    if (chatPeople.room === "global") {
      ["all"].concat(CHAT_HOUSES).forEach(function(h) {
        var n = h === "all" ? all.length : all.filter(function(m) { return m.house === h; }).length;
        var hh = HOUSES[h];
        var btn = document.createElement("button");
        btn.type = "button";
        btn.textContent = (h === "all" ? L("chatAll") : (hh.crest ? hh.crest + " " : "") + cupHouseName(h)) + " " + n;
        if (f === h) { btn.className = "on"; if (hh) btn.style.color = hh.accent; }
        btn.addEventListener("click", function() { chatPeople.filter = h; chatRenderPeople(); });
        fb.appendChild(btn);
      });
    }
    var list = all.filter(function(m) {
      return (f === "all" || m.house === f) && (!q || String(m.name).toLowerCase().indexOf(q) >= 0);
    });
    // Onlaynlar tepada, keyin oxirgi marta onlayn bo'lgani bo'yicha (yangisi tepada);
    // hech qachon ko'rinmaganlar oxirida, kubok ballari bo'yicha (server tartibi).
    function seenMs(m) { var t = m.seen ? new Date(m.seen).getTime() : 0; return isNaN(t) ? 0 : t; }
    list = list.map(function(m, i) { return { m: m, i: i }; }).sort(function(a, b) {
      if (!!a.m.online !== !!b.m.online) return a.m.online ? -1 : 1;
      var d = seenMs(b.m) - seenMs(a.m);
      return d || a.i - b.i;
    }).map(function(x) { return x.m; });
    var online = list.filter(function(m) { return m.online; }).length;
    $("chat-people-sub").textContent = L("chatMembersSub").replace("%s", list.length).replace("%s", online);
    var box = $("chat-people-list");
    box.innerHTML = "";
    if (!list.length) { box.appendChild(chatHint(L("chatNobody"))); return; }
    var frag = document.createDocumentFragment();
    list.forEach(function(m) {
      var hh = HOUSES[m.house] || {};
      var sub = m.online ? L("chatPeerOnline") :
        (chatSeenText(m.seen) ? chatSeenText(m.seen) + " · " : "") +
        (chatPeople.room === "global" ? (hh.crest ? hh.crest + " " : "") + cupHouseName(m.house) + " · " : "") +
        L("chatPoints").replace("%s", m.points);
      var mine = m.uid == me;
      // A'zo bosilsa - PROFILI ochiladi (egasi, 2026-10-10); xabar yozish profil ichidagi tugmada
      var row = chatPersonRow(m, sub, m.online, mine ? L("chatYou") : "›");
      row.addEventListener("click", function() { odamOpen(m.uid, { name: m.name, house: m.house }); });
      frag.appendChild(row);
    });
    box.appendChild(frag);
  }

  // O'qilmaganlar soni: kubok oynasidagi chat tugmasida (ikkala xona jami)
  // va chat ichida - hozir ochiq bo'lmagan xona yorlig'ida.
  function chatRefreshCounts() {
    var d = chatInitData();
    if (!d) return;
    fetch(API_CHAT + "?counts=1", { headers: { "X-Telegram-Init-Data": d } })
      .then(function(r) { return r.json(); })
      .then(function(res) {
        if (!(res && res.ok && res.counts)) return;
        chatCounts = res.counts;
        chatCountsUI();
      }).catch(function() {});
  }

  function chatBadge(n) { return n > 99 ? "99+" : String(n); }

  function chatCountsUI() {
    setTimeout(worldRefresh, 0);
    var total = (chatCounts.house || 0) + (chatCounts.global || 0) + (chatCounts.dm || 0);
    var sb = $("chat-strip-n");
    if (sb) { sb.textContent = chatBadge(total); sb.classList.toggle("hidden", !total); }
    ["house", "global", "dm"].forEach(function(room) {
      var tab = $("tab-" + room), n = chatCounts[room] || 0, b = tab.querySelector("b");
      if (!b) { b = document.createElement("b"); b.className = "chat-tab-n"; tab.appendChild(b); }
      b.textContent = chatBadge(n);
      b.classList.toggle("hidden", !n || (chatOpen && chatRoom === (room === "dm" ? "dms" : room)));
    });
    chatAdmUI();
  }

  // Admin uchun: tablar ostida to'rttala fakultet xonasi (o'ziniki - "house").
  // Ko'rinish (egasi, 2026-10-08: xunuk edi): emoji va kesilgan yozuv o'rniga gerb + nom, tanlangani fakultet rangida;
  // yuqoridagi "o'z fakulteti" tabi adminda yashiriladi - u shu qatorda bor (takror bo'lmasin).
  function chatAdmUI() {
    var bar = $("chat-adm");
    if (!bar) return;
    bar.classList.toggle("hidden", !chatAdmin);
    var tabs = $("tab-house") && $("tab-house").parentNode;
    if (tabs) tabs.classList.toggle("adm", !!chatAdmin);
    if (!chatAdmin) return;
    var mine = cupMe().house;
    bar.innerHTML = "";
    CHAT_HOUSES.forEach(function(h) {
      var room = h === mine ? "house" : "h:" + h, hh = HOUSES[h] || {};
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = chatRoom === room ? "on" : "";
      btn.style.setProperty("--adm-rgb", hh.rgb || "151,161,174");
      var cr = document.createElement("span");
      cr.className = "chat-adm-cr";
      var im = cupCrestImg(h, 0);
      if (im) cr.appendChild(im);
      btn.appendChild(cr);
      var nm = document.createElement("span");
      nm.className = "chat-adm-nm";
      nm.textContent = cupHouseName(h);
      btn.appendChild(nm);
      var n = chatCounts[room === "house" ? "house" : room] || 0;
      if (n && chatRoom !== room) {
        var b = document.createElement("b");
        b.textContent = chatBadge(n);
        btn.appendChild(b);
      }
      btn.addEventListener("click", function() { setChatRoom(room); });
      bar.appendChild(btn);
    });
  }

  function updateChatRoomUI() {
    var me = cupMe(), hh = HOUSES[me.house] || {};
    var scr = $("scr-chat"), title = $("chat-title-txt"), inp = $("chat-input");
    scr.style.setProperty("--me-bg", hh.accent || "var(--accent)");
    scr.style.setProperty("--me-ink", hh.ink || "#fff");
    scr.style.setProperty("--me-rgb", hh.rgb || "151,161,174");
    $("tab-house").textContent = (hh.crest ? hh.crest + " " : "") + cupHouseName(me.house);
    $("tab-global").textContent = L("chatGlobalTab");
    $("tab-dm").textContent = L("chatDmTab");
    $("tab-house").classList.toggle("on", chatRoom === "house");
    $("tab-global").classList.toggle("on", chatRoom === "global");
    $("tab-dm").classList.toggle("on", chatRoom === "dms" || chatIsDm(chatRoom));
    chatCountsUI();
    if (chatRoom === "dms") {
      title.textContent = L("chatDmTitle");
      title.style.color = "var(--text)";
    } else if (chatIsDm(chatRoom)) {
      var p = chatPeerOf(chatRoom), ph = HOUSES[p.house] || {};
      title.textContent = p.name || "Sehrgar";
      title.style.color = ph.accent || "var(--text)";
      inp.placeholder = L("chatPh");
    } else if (chatIsHouseRoom(chatRoom)) {
      var rh = chatRoomHouse(chatRoom), rhh = HOUSES[rh] || {};
      title.textContent = L("chatHouseTitle").replace("%s", cupHouseName(rh));
      title.style.color = rhh.accent || "var(--accent)";
      inp.placeholder = L("chatPhHouse");
    } else {
      title.textContent = L("chatGlobalTitle");
      title.style.color = "var(--text)";
      inp.placeholder = L("chatPhGlobal");
    }
  }

  function openChat() {
    applyXT();
    $("scr-cup").classList.add("hidden");
    $("scr-chat").classList.remove("hidden");
    chatRoom = "global";
    chatOpen = true;
    // Har ochilishda yangidan: o'qilmaganlar joyidan boshlanadi.
    chatResetRoom("house");
    chatResetRoom("global");
    chatLive = { typing: [], online: 0, until: 0 };
    chatClosePeople();
    updateChatRoomUI();
    chatSubUI();
    chatShowView();
    clearInterval(chatCountTimer);
    chatCountTimer = setInterval(chatRefreshCounts, 20000);
    chatSendState();
    chatPaint("bottom");
    chatPoll();
    chatRefreshCounts();
  }

  function chatStop() {
    chatOpen = false;
    chatSeq++;
    if (chatCtl) { try { chatCtl.abort(); } catch (e) {} chatCtl = null; }
  }

  function closeChat() {
    chatStop();
    chatCloseMenu();
    chatCancelCompose();
    chatClosePeople();
    clearInterval(chatDmTimer);
    clearInterval(chatCountTimer);
    $("scr-chat").classList.add("hidden");
    $("scr-cup").classList.remove("hidden");
    // O'qilgan joy serverga yetib borgach sonlarni yangilaymiz.
    var room = chatRoom, R = chatRooms[room] || chatNewRoom();
    clearTimeout(chatReadTimer);
    var send = R.read > R.sentRead ? chatAct(room, { action: "read", id: R.read }) : Promise.resolve();
    R.sentRead = R.read;
    send.then(chatRefreshCounts, chatRefreshCounts);
  }

  function chatGrow() {
    var inp = $("chat-input");
    inp.style.height = "auto";
    inp.style.height = Math.min(inp.scrollHeight + 2, 120) + "px";
  }

  function chatSendState() { $("chat-send").disabled = !$("chat-input").value.trim(); }

  function chatMsgOf(el) {
    var row = el && el.closest ? el.closest(".cm") : null;
    return row ? chatFind(chatRooms[chatRoom], row.getAttribute("data-id")) : null;
  }

  function chatPressEnd() {
    var p = chatPress;
    chatPress = null;
    if (p) {
      clearTimeout(p.timer);
      p.row.classList.remove("drag");
      p.row.style.transform = "";
      var ic = p.row.querySelector(".cm-swipe");
      if (ic) ic.style.opacity = "";
      if (p.fired) chatSuppressClick = Date.now();
    }
    if (chatPendingPaint) { chatPendingPaint = false; chatPaint(chatStick ? "bottom" : "keep"); }
  }

  function initChatUI() {
    var inp = $("chat-input"), btn = $("chat-send"), box = $("chat-messages");
    $("chat-strip").addEventListener("click", openChat);
    // Shaxsiy suhbatdan "Ortga" - suhbatlar ro'yxatiga, qolgan joyda - chatdan chiqish.
    $("chat-back").addEventListener("click", function() {
      if (chatIsDm(chatRoom)) { setChatRoom("dms"); return; }
      if (worldReturnTo()) { return; }
      closeChat();
    });
    $("tab-house").addEventListener("click", function() { setChatRoom("house"); });
    $("tab-global").addEventListener("click", function() { setChatRoom("global"); });
    $("tab-dm").addEventListener("click", function() { setChatRoom("dms"); });
    $("chat-head").addEventListener("click", function() {
      if (chatIsHouseRoom(chatRoom) || chatRoom === "global") chatOpenPeople(chatRoom);
      else if (chatIsDm(chatRoom)) chatPeerSheet();
    });
    $("chat-people-back").addEventListener("click", chatClosePeople);
    $("chat-info-back").addEventListener("click", chatCloseInfo);
    $("chat-people-q").addEventListener("input", chatRenderPeople);
    $("chat-bar-x").addEventListener("mousedown", function(e) { e.preventDefault(); });
    $("chat-bar-x").addEventListener("click", chatCancelCompose);
    inp.addEventListener("input", function() {
      var stick = chatStick;
      chatGrow();
      chatSendState();
      chatAtUpdate();
      chatTyping();
      if (stick) box.scrollTop = box.scrollHeight;
    });
    // Kompyuterda Enter - yuborish, Shift+Enter - yangi qator. Telefonda Enter yangi qator.
    inp.addEventListener("keydown", function(e) {
      if (e.key === "Enter" && !e.shiftKey && !e.isComposing && !chatTouch) {
        e.preventDefault();
        chatSend();
      } else if (e.key === "Escape" && chatCompose) {
        chatCancelCompose();
      }
    });
    document.addEventListener("keydown", function(e) { if (e.key === "Escape") chatCloseMenu(); });
    $("chat-form").addEventListener("submit", function(e) { e.preventDefault(); chatSend(); });
    // Tugma bosilganda yozish maydoni fokusni yo'qotmaydi - klaviatura yopilib-ochilmaydi.
    btn.addEventListener("mousedown", function(e) { e.preventDefault(); });
    btn.addEventListener("touchend", function(e) { e.preventDefault(); chatSend(); });
    btn.addEventListener("click", function(e) { e.preventDefault(); chatSend(); });
    box.addEventListener("scroll", chatScrolled, { passive: true });
    $("chat-down").addEventListener("click", function() {
      if (chatRooms[chatRoom].moreNew) { chatJumpLatest(); return; }
      if (box.scrollTo) box.scrollTo({ top: box.scrollHeight, behavior: "smooth" });
      else box.scrollTop = box.scrollHeight;
    });

    // Barmoq: uzoq bosish - menyu, chapga surish - javob.
    box.addEventListener("touchstart", function(e) {
      var bub = e.target.closest && e.target.closest(".cm-b");
      if (!bub || e.touches.length > 1) return;
      var m = chatMsgOf(bub);
      if (!m) return;
      var t = e.touches[0];
      var p = { m: m, bub: bub, row: bub.parentNode, x: t.clientX, y: t.clientY, dx: 0 };
      p.timer = setTimeout(function() {
        if (chatPress !== p || p.swiping) return;
        p.fired = true;
        chatMenu(p.m, p.bub);
      }, 420);
      chatPress = p;
    }, { passive: true });
    box.addEventListener("touchmove", function(e) {
      var p = chatPress;
      if (!p || p.fired) return;
      var t = e.touches[0], dx = t.clientX - p.x, dy = t.clientY - p.y;
      if (!p.swiping) {
        if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return;
        clearTimeout(p.timer);
        if (dx < 0 && Math.abs(dx) > Math.abs(dy) * 1.5 && !p.m.tmp) p.swiping = true;
        else { chatPressEnd(); return; }
      }
      p.dx = Math.max(-72, Math.min(0, dx));
      p.row.classList.add("drag");
      p.row.style.transform = "translateX(" + p.dx + "px)";
      var ic = p.row.querySelector(".cm-swipe");
      if (ic) ic.style.opacity = String(Math.min(1, -p.dx / 56));
      if (p.dx <= -56 && !p.buzz) { p.buzz = true; chatHaptic("sel"); }
    }, { passive: true });
    box.addEventListener("touchend", function() {
      var p = chatPress;
      if (!p) return;
      var reply = p.swiping && p.dx <= -56 ? p.m : null;
      chatPressEnd();
      if (reply) chatStartReply(reply);
    });
    box.addEventListener("touchcancel", chatPressEnd);
    // Kompyuterda o'ng tugma; Android'da uzoq bosish ham shu hodisani beradi.
    box.addEventListener("contextmenu", function(e) {
      var bub = e.target.closest && e.target.closest(".cm-b");
      if (!bub) return;
      e.preventDefault();
      if (chatMenuEl) return;
      var m = chatMsgOf(bub);
      if (!m) return;
      if (chatPress) { clearTimeout(chatPress.timer); chatPress.fired = true; }
      chatMenu(m, bub);
    });
    box.addEventListener("click", function(e) {
      if (Date.now() - chatSuppressClick < 500) return;
      var t = e.target;
      if (!t.closest) return;
      var pill = t.closest(".rx");
      if (pill) {
        var pm = chatMsgOf(pill);
        if (pm) chatReact(pm, pill.getAttribute("data-rx"));
        return;
      }
      var ca = t.closest("[data-chess-act]");
      if (ca) { chessFromChat(ca.getAttribute("data-g")); return; }
      var q = t.closest(".cm-q");
      if (q) { chatJump(q.getAttribute("data-jump")); return; }
      var bub = t.closest(".cm-b");
      if (!bub) return;
      var m = chatMsgOf(bub);
      if (!m) return;
      if (m.st === "failed") { chatPost(chatRoom, m); return; }
      if (m.tmp) return;
      // Ikki marta bosish - ❤️
      var now = Date.now();
      if (chatLastTap.id === m.id && now - chatLastTap.t < 320) {
        chatLastTap = {};
        chatReact(m, CHAT_REACTS[1]);
      } else {
        chatLastTap = { id: m.id, t: now };
      }
    });

    // Klaviatura ochilib oyna kichraysa - pastda turgan odam pastda qoladi.
    function keepBottom() {
      setTimeout(function() { if (chatOpen && chatStick) box.scrollTop = box.scrollHeight; }, 60);
    }
    window.addEventListener("resize", keepBottom);
    if (tg && tg.onEvent) tg.onEvent("viewportChanged", keepBottom);
    // Ilova qaytib ochilganda kutib qolmay darhol yangilanadi.
    document.addEventListener("visibilitychange", function() {
      if (!document.hidden && chatOpen) chatPoll();
    });
  }
