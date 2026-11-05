/* ===================== XONA QOLIPI (egasi, 2026-11-05) =====================
   Xogvarts xonalari (Qo'riqxona, Issiqxona, Do'kon, Direktor xonasi va keyingilari) BITTA tuzilishda bo'ladi.
   Yangi xona ochilsa - shu qolip bilan quring (tavsif: dizayn-tizimi/xona-qolipi.md). Tartib yuqoridan pastga:
     1. Sarlavha - markazda: ustida kichik yozuv (xona egasi: «Xagrid», «Professor Sprout», «Albus Dambldor»),
        ostida xona nomi; chapda «‹» ortga, o'ngda bo'sh joy (yoki «i»).
     2. Xona rasmi - IXTIYORIY (keng, burchaklari yumaloq).
     3. Holat qatori - chapda asosiy son (Cormorant, kumush), o'ngda kichik yorliq.
     4. Egasining maslahati - doira portret + pufakdagi gap.
     5. Asosiy harakat tugmasi - IXTIYORIY.
     6. Tarkib - xonaning o'z narsalari (to'r, ro'yxat, kartalar); bo'lim sarlavhasi - xonaSek().
   Uslublar - css «XONA QOLIPI» (.xona). Mavjud .screen xonalariga faqat «xona» klassi qo'shilgan (index.html).
   Ilova kodi bir necha faylga bo'lingan; hammasi BIR umumiy maydonda ishlaydi
   va index.html dagi TARTIBDA yuklanadi. Yuklanish paytida keyingi fayldagi
   narsani chaqirmang - tekshiruv: tools/tartib.js */
"use strict";

  // Xona yasaydi (to'liq ekranli oyna, body ga qo'shiladi). o: {id, kick, ttl, ortga, rasm, holat: [chap, ong], egasi: {rasm, matn}, tugma: {matn, fn}}
  // Qaytaradi: {el, ich, kick(t), ttl(t), holat(chap, ong), egasi(matn, rasm), tugma(matn, fn)}. Orqaga tugmasi uchun 13-orqaga.js BACK_PANELS ga [id, yopish] yozing.
  function xonaQur(o) {
    var el = $(o.id);
    if (!el) {
      el = drEl("div", "xona-o hidden");
      el.id = o.id;
      el.innerHTML = '<div class="xona">' +
        '<div class="cup-hdr kb-hdr"><button class="back-btn" type="button"><span style="font-size:13px">‹</span> <span>Ortga</span></button>' +
        '<div class="kb-ttl"><span class="cup-kick"></span><span class="cup-title"></span></div><span class="kb-sp" aria-hidden="true"></span></div>' +
        '<div class="xona-rasm hidden"><img alt=""></div>' +
        '<div class="xona-holat hidden"><b></b><span></span></div>' +
        '<div class="af-fl xona-egasi hidden"><img alt=""><p class="dr-hint"></p></div>' +
        '<button class="dr-btn xona-tugma hidden" type="button"></button>' +
        '<div class="xona-ich"></div></div>';
      document.body.appendChild(el);
    }
    var q = function (s) { return el.querySelector(s); };
    var x = {
      el: el, ich: q(".xona-ich"),
      kick: function (t) { q(".cup-kick").textContent = t || ""; },
      ttl: function (t) { q(".cup-title").textContent = t || ""; },
      holat: function (chap, ong) {
        q(".xona-holat").classList.toggle("hidden", !chap && !ong);
        q(".xona-holat b").textContent = chap || "";
        q(".xona-holat span").textContent = ong || "";
        q(".xona-holat span").classList.toggle("hidden", !ong);
      },
      egasi: function (matn, rasm) {
        q(".xona-egasi").classList.toggle("hidden", !matn);
        q(".xona-egasi .dr-hint").textContent = matn || "";
        if (rasm) { q(".xona-egasi img").src = rasm; }
      },
      tugma: function (matn, fn) {
        var b = q(".xona-tugma");
        b.classList.toggle("hidden", !matn);
        b.textContent = matn || "";
        b.onclick = fn || null;
      }
    };
    q(".back-btn").onclick = o.ortga || function () { xonaYop(x); };
    var r = q(".xona-rasm");
    r.classList.toggle("hidden", !o.rasm);
    if (o.rasm) { var ri = r.querySelector("img"); ri.onerror = function () { r.classList.add("hidden"); }; ri.src = o.rasm; }
    x.kick(o.kick); x.ttl(o.ttl);
    x.holat(o.holat && o.holat[0], o.holat && o.holat[1]);
    x.egasi(o.egasi && o.egasi.matn, o.egasi && o.egasi.rasm);
    x.tugma(o.tugma && o.tugma.matn, o.tugma && o.tugma.fn);
    return x;
  }
  function xonaOch(x) {
    x.el.classList.remove("hidden");
    x.el.scrollTop = 0;
    document.body.classList.add("ank-ochiq");
  }
  function xonaYop(x) {
    if (x && x.el) { x.el.classList.add("hidden"); }
    document.body.classList.remove("ank-ochiq");
  }
  // Bo'lim sarlavhasi: chapda nomi (kichik bosh harflar), o'ngda izoh
  function xonaSek(ich, sarlavha, ost) {
    var h = drEl("div", "xona-sek");
    h.appendChild(drEl("span", "", sarlavha));
    if (ost) { h.appendChild(drEl("small", "", ost)); }
    ich.appendChild(h);
    return h;
  }
