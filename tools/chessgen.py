#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Shaxmat taklif kartasi uchun 16:9 rasm yasaydi: img/chess_<til>.jpg.

Karta do'stga yuboriladigan taklif xabarining ustida turadi (bot:
chess_card). Uslubi reklama kartasidagidek (promogen.py): qorong'i fon,
oq serif sarlavha, oltin bosh harflar. O'ngda - oltin ramkali "Sehrli tosh"
taxta, donalar ilovadagi bilan bir xil (index.html dagi CHESS_SVGS, marmar).

Rasm HTML qilib yig'iladi va Safari dvigatelida (WebKit) chiziladi -
shunda donalar ilovadagi SVG lardan aynan olinadi.

ISHLATISH (CatalogWebApp papkasida, faqat macOS)
    swiftc -O tools/wksnap.swift -o /tmp/wksnap
    python3 tools/chessgen.py
"""

import os
import re
import subprocess
import sys
import tempfile

try:
    from PIL import Image
except ImportError:
    sys.exit("XATO: Pillow kerak.  pip install pillow")

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
SNAP = os.getenv("WKSNAP", "/tmp/wksnap")

TEXT = {
    "uz": ("Garri Potter kolleksiyasi", "Sehrgar", "SHAXMATI",
           "Do'stingiz sizni jangga chaqirmoqda", ["jonli raqib", "sehrli taxta", "fakultet uchun ball"]),
    "ru": ("Коллекция «Гарри Поттер»", "Волшебные", "ШАХМАТЫ",
           "Друг вызывает вас на поединок", ["живой соперник", "волшебная доска", "очки факультету"]),
    "en": ("Harry Potter Collection", "Wizard's", "CHESS",
           "A friend challenges you to a duel", ["live opponent", "enchanted board", "points for your house"]),
}

# O'rta o'yin holati: har ikki tomonda ham dona ko'p, oq farzin hujumda.
POSITION = [
    "r...kb.r",
    "ppp..ppp",
    "..n.bn..",
    "...qp.B.",
    "...P....",
    "..N..N..",
    "PPP.QPPP",
    "R...KB.R",
]


def piece_svgs():
    src = open(os.path.join(ROOT, "index.html"), encoding="utf-8").read()
    block = re.search(r"var CHESS_SVGS = \{(.*?)\n  \};", src, re.S).group(1)
    svgs = dict(re.findall(r"(\w): '(<svg.*?</svg>)'", block))

    def piece(p):
        # Ilovadagi getPieceSVG ("Sehrli tosh" uslubi) bilan bir xil bo'yash:
        # tana - fil suyagi / obsidian, chiziq - bronza / oltin.
        body, line = ("url(#hpIvory)", "#3b2a16") if p.isupper() else ("url(#hpObsidian)", "#d9a74a")
        svg = svgs[p.upper()]
        svg = re.sub(r"#(?:ffffff|fff)\b", "@B@", svg)
        svg = re.sub(r"#(?:000000|000)\b", line, svg)
        svg = svg.replace("@B@", body)
        return svg.replace("<svg ", '<svg width="100%" height="100%" style="display:block" ')
    return piece


def html(lang, piece):
    kicker, title, caps, sub, chips = TEXT[lang]
    cells = []
    for r, row in enumerate(POSITION):
        for c, p in enumerate(row):
            light = (r + c) % 2 == 0
            inner = piece(p) if p != "." else ""
            cells.append('<div class="sq %s">%s</div>' % ("l" if light else "d", inner))
    chips_html = '<span class="dot">·</span>'.join("<span>%s</span>" % c for c in chips)
    return """<!doctype html><html><head><meta charset="utf-8"><style>
html,body{margin:0;width:1280px;height:720px;overflow:hidden;background:#07090d}
.wrap{position:relative;width:1280px;height:720px;
  background:radial-gradient(ellipse 60%% 80%% at 78%% 55%%, rgba(155,89,182,.28), transparent 70%%),
             radial-gradient(ellipse 50%% 60%% at 15%% 30%%, rgba(217,167,74,.10), transparent 70%%),
             linear-gradient(135deg,#0b0e14 0%%,#07090d 100%%)}
.stage{position:absolute;right:76px;top:50%%;width:500px;height:500px;margin-top:-250px}
.board{width:480px;height:480px;display:grid;grid-template-columns:repeat(8,1fr);grid-template-rows:repeat(8,1fr);
  border:9px solid transparent;border-radius:16px;overflow:hidden;transform:rotate(-3deg);
  background:linear-gradient(#000,#000) padding-box,linear-gradient(135deg,#f3d58f,#9c7424 40%%,#e7c170 60%%,#7a5a1a) border-box;
  box-shadow:0 30px 70px rgba(0,0,0,.75),0 0 110px rgba(155,89,182,.40)}
.sq{display:flex;align-items:center;justify-content:center}
.sq svg{width:86%%!important;height:86%%!important;filter:drop-shadow(0 4px 3px rgba(0,0,0,.45))}
.l{background:#d3cab8}.d{background:#5d626b}
.text{position:absolute;left:80px;top:0;bottom:0;width:600px;display:flex;flex-direction:column;justify-content:center}
.kicker{font:600 20px/1 'Baskerville',serif;letter-spacing:4px;text-transform:uppercase;color:#98a2b3;margin-bottom:26px}
.t1{font:400 92px/1 'Baskerville',serif;color:#f4f1ea}
.t2{font:700 96px/1.05 'Baskerville',serif;color:#d9a74a;letter-spacing:3px;margin-top:4px}
.line{width:300px;height:2px;background:#d9a74a;margin:30px 0 26px;opacity:.9}
.sub{font:400 30px/1.25 'Baskerville',serif;color:#f4f1ea}
.chips{font:400 23px/1 'Baskerville',serif;color:#b9c0cc;margin-top:20px}
.dot{margin:0 12px;color:#d9a74a}
</style></head><body>
<svg width="0" height="0" style="position:absolute"><defs>
<linearGradient id="hpIvory" x1="0" y1="0" x2="0.35" y2="1"><stop offset="0" stop-color="#fffdf6"/><stop offset=".55" stop-color="#eee4cf"/><stop offset="1" stop-color="#c9ba98"/></linearGradient>
<linearGradient id="hpObsidian" x1="0" y1="0" x2="0.35" y2="1"><stop offset="0" stop-color="#4c4c5a"/><stop offset=".5" stop-color="#24242d"/><stop offset="1" stop-color="#0b0b10"/></linearGradient>
</defs></svg><div class="wrap">
<div class="stage"><div class="board">%s</div></div>
<div class="text"><div class="kicker">%s</div><div class="t1">%s</div><div class="t2">%s</div>
<div class="line"></div><div class="sub">%s</div><div class="chips">%s</div></div>
</div></body></html>""" % ("".join(cells), kicker, title, caps, sub, chips_html)


def main():
    if not os.path.exists(SNAP):
        sys.exit("XATO: %s yo'q. Avval: swiftc -O tools/wksnap.swift -o %s" % (SNAP, SNAP))
    piece = piece_svgs()
    tmp = tempfile.mkdtemp()
    for lang in TEXT:
        page = os.path.join(tmp, "chess_%s.html" % lang)
        png = os.path.join(tmp, "chess_%s.png" % lang)
        open(page, "w", encoding="utf-8").write(html(lang, piece))
        subprocess.run([SNAP, "file://" + page, png, "1280", "720"], check=True)
        img = Image.open(png).convert("RGB").resize((1280, 720), Image.LANCZOS)
        out = os.path.join(ROOT, "img", "chess_%s.jpg" % lang)
        img.save(out, quality=90, optimize=True, progressive=True)
        print("tayyor:", out)


if __name__ == "__main__":
    main()
