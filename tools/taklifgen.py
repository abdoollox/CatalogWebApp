#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Do'stni Telegram chatidan chaqirish kartalari (duel, toshchalar, maxluqlar jangi, poyga) uchun 16:9 rasm: img/<tur>_<til>.jpg.

Uslub shaxmat kartasidagidek (chessgen.py): qorong'i fon, oq serif sarlavha, oltin bosh harflar;
o'ngda - o'yin rasmi oltin ramkali «qasr darchasi» ichida (bosh sahifa kataklari kabi).

ISHLATISH (CatalogWebApp papkasida, faqat macOS)
    swiftc -O tools/wksnap.swift -o /tmp/wksnap
    python3 tools/taklifgen.py <duel rasmi> <toshchalar rasmi> [maxluqlar jangi rasmi] [poyga rasmi]
    (asl rasmlar: dizayn-tizimi/hub/hub-2.png ning pastki chap choragi, dizayn-tizimi/toshchalar/katak.jpeg,
     dizayn-tizimi/kartalar/katak.jpeg, dizayn-tizimi/hub/hub-5-poyga.jpeg)
    Faqat bittasini qayta yasash: TAKLIF_FAQAT=poyga python3 tools/taklifgen.py ...
"""

import base64
import io
import os
import subprocess
import sys
import tempfile

from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
SNAP = os.getenv("WKSNAP", "/tmp/wksnap")

TEXT = {
    "duel": {
        "uz": ("Garri Potter kolleksiyasi", "Sehrgarlar", "DUELI", "Do'stingiz sizni duelga chaqirmoqda", ["afsunni barmoq bilan chizing", "aniqroq — kuchliroq"]),
        "ru": ("Коллекция «Гарри Поттер»", "Дуэль", "ВОЛШЕБНИКОВ", "Друг вызывает вас на дуэль", ["рисуйте заклинание пальцем", "точнее — сильнее"]),
        "en": ("Harry Potter Collection", "Wizards'", "DUEL", "A friend challenges you to a duel", ["draw the spell with your finger", "more precise — stronger"]),
    },
    "tosh": {
        "uz": ("Garri Potter kolleksiyasi", "Sehrgarlar o'yini", "TOSHCHALAR", "Do'stingiz sizni o'yinga chaqirmoqda", ["toshchalarni doiradan urib chiqaring", "yutqazganga — sassiq suyuqlik"]),
        "ru": ("Коллекция «Гарри Поттер»", "Игра волшебников", "ПЛЮЙ-КАМНИ", "Друг зовёт вас сыграть", ["выбивайте камешки из круга", "проигравшего обрызгает"]),
        "en": ("Harry Potter Collection", "The wizarding game", "GOBSTONES", "A friend challenges you to a game", ["knock the stones out of the ring", "the loser gets squirted"]),
    },
    "mjang": {
        "uz": ("Garri Potter kolleksiyasi", "Maxluqlar", "JANGI", "Do'stingiz sizni jangga chaqirmoqda", ["har raundda bitta karta", "kuchlisi raundni oladi"]),
        "ru": ("Коллекция «Гарри Поттер»", "Битва", "СУЩЕСТВ", "Друг зовёт вас на битву", ["одна карта за раунд", "сильнейшая берёт раунд"]),
        "en": ("Harry Potter Collection", "Creature", "BATTLE", "A friend challenges you to a battle", ["one card per round", "the stronger card takes it"]),
    },
    "poyga": {
        "uz": ("Garri Potter kolleksiyasi", "Supurgi", "POYGASI", "Do'stingiz sizni poygaga chaqirmoqda", ["halqalar o'rtasidan uching", "marraga birinchi yeting"]),
        "ru": ("Коллекция «Гарри Поттер»", "Гонка", "НА МЁТЛАХ", "Друг вызывает вас на гонку", ["летите через центр колец", "будьте первым на финише"]),
        "en": ("Harry Potter Collection", "Broom", "RACE", "A friend challenges you to a race", ["fly through the centre of the hoops", "be first to the finish"]),
    },
}


def data_url(path, crop=None):
    im = Image.open(path).convert("RGB")
    if crop:
        im = im.crop(crop)
    w, h = im.size
    nw = int(h * 110 / 128.0)                  # bosh sahifa katagi nisbati
    if nw <= w:
        im = im.crop(((w - nw) // 2, 0, (w - nw) // 2 + nw, h))
    else:
        nh = int(w * 128 / 110.0)
        im = im.crop((0, (h - nh) // 2, w, (h - nh) // 2 + nh))
    im = im.resize((440, 512), Image.LANCZOS)
    b = io.BytesIO()
    im.save(b, "JPEG", quality=90)
    return "data:image/jpeg;base64," + base64.b64encode(b.getvalue()).decode()


def html(tur, lang, art):
    kicker, title, caps, sub, chips = TEXT[tur][lang]
    chips_html = '<span class="dot">·</span>'.join("<span>%s</span>" % c for c in chips)
    return """<!doctype html><html><head><meta charset="utf-8"><style>
html,body{margin:0;width:1280px;height:720px;overflow:hidden;background:#07090d}
.wrap{position:relative;width:1280px;height:720px;
  background:radial-gradient(ellipse 60%% 80%% at 78%% 55%%, rgba(155,89,182,.28), transparent 70%%),
             radial-gradient(ellipse 50%% 60%% at 15%% 30%%, rgba(217,167,74,.10), transparent 70%%),
             linear-gradient(135deg,#0b0e14 0%%,#07090d 100%%)}
.art{position:absolute;right:110px;top:50%%;width:440px;height:512px;margin-top:-256px;transform:rotate(2deg);
  border-radius:50%% 50%% 18px 18px / 40%% 40%% 18px 18px;border:8px solid transparent;
  background:url(%s) center/cover padding-box,linear-gradient(135deg,#f3d58f,#9c7424 40%%,#e7c170 60%%,#7a5a1a) border-box;
  box-shadow:0 30px 70px rgba(0,0,0,.75),0 0 110px rgba(155,89,182,.40)}
.text{position:absolute;left:80px;top:0;bottom:0;width:600px;display:flex;flex-direction:column;justify-content:center}
.kicker{font:600 20px/1 'Baskerville',serif;letter-spacing:4px;text-transform:uppercase;color:#98a2b3;margin-bottom:26px}
.t1{font:400 %dpx/1 'Baskerville',serif;color:#f4f1ea;white-space:nowrap}
.t2{font:700 %dpx/1.05 'Baskerville',serif;color:#d9a74a;letter-spacing:3px;margin-top:6px;white-space:nowrap}
.line{width:300px;height:2px;background:#d9a74a;margin:30px 0 26px;opacity:.9}
.sub{font:400 30px/1.25 'Baskerville',serif;color:#f4f1ea}
.chips{font:400 21px/1.35 'Baskerville',serif;color:#b9c0cc;margin-top:20px}
.dot{margin:0 12px;color:#d9a74a}
</style></head><body><div class="wrap">
<div class="art"></div>
<div class="text"><div class="kicker">%s</div><div class="t1">%s</div><div class="t2">%s</div>
<div class="line"></div><div class="sub">%s</div><div class="chips">%s</div></div>
</div></body></html>""" % (art, max(50, min(64, int(600 / (len(title) * 0.5)))), max(48, min(92, int(540 / (len(caps) * (0.95 if any("\u0400" <= ch <= "\u04ff" for ch in caps) else 0.8))))), kicker, title, caps, sub, chips_html)


def main():
    if len(sys.argv) < 3:
        sys.exit(__doc__)
    if not os.path.exists(SNAP):
        sys.exit("XATO: %s yo'q. Avval: swiftc -O tools/wksnap.swift -o %s" % (SNAP, SNAP))
    duel_src = sys.argv[1]
    duel_crop = None
    if duel_src.endswith("hub-2.png"):                # 2x2 varaq: duel - pastki chap chorak
        w, h = Image.open(duel_src).size
        m = int(w / 2 * 0.035)
        duel_crop = (m, h // 2 + m, w // 2 - m, h - m)
    arts = {"duel": data_url(duel_src, duel_crop), "tosh": data_url(sys.argv[2])}
    if len(sys.argv) > 3:
        arts["mjang"] = data_url(sys.argv[3])
    if len(sys.argv) > 4:
        arts["poyga"] = data_url(sys.argv[4])
    faqat = os.getenv("TAKLIF_FAQAT")
    if faqat:
        arts = {k: v for k, v in arts.items() if k == faqat}
    tmp = tempfile.mkdtemp()
    for tur in arts:
        for lang in TEXT[tur]:
            page = os.path.join(tmp, "%s_%s.html" % (tur, lang))
            png = os.path.join(tmp, "%s_%s.png" % (tur, lang))
            open(page, "w", encoding="utf-8").write(html(tur, lang, arts[tur]))
            subprocess.run([SNAP, "file://" + page, png, "1280", "720"], check=True)
            img = Image.open(png).convert("RGB").resize((1280, 720), Image.LANCZOS)
            out = os.path.join(ROOT, "img", "%s_%s.jpg" % (tur, lang))
            img.save(out, quality=90, optimize=True, progressive=True)
            print("tayyor:", out)


if __name__ == "__main__":
    main()
