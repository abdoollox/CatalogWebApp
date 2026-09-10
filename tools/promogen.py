#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Reklama kartasi uchun 16:9 rasm yasaydi: img/promo_<til>.jpg.

Karta inline'da "taklif" deb yozilganda chiqadi (bot: PROMO_QUERY) va
do'stga butun kolleksiyani taklif qiladi. Rasm tildan-tilga faqat
yozuvi va plakatlari bilan farq qiladi.

DIZAYN
    Orqa fon - shu tildagi film plakatlaridan ikki qatorli devor (pastki
    qator yarim plakatga surilgan), ustidan qorong'i parda. O'rtada
    kolleksiya nomi va qisqa ta'rif. Shriftlar widegen.py dagidek.

ISHLATISH (CatalogWebApp papkasida; CatalogBot yonma-yon turishi kerak)
    python3 tools/promogen.py
"""

import os
import sys

try:
    from PIL import Image, ImageDraw, ImageFilter, ImageFont
except ImportError:
    sys.exit("XATO: Pillow kerak.  pip install pillow")

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
IMG = os.path.join(ROOT, "img")
sys.path.insert(0, os.path.join(os.path.dirname(ROOT), "CatalogBot"))
import catalog  # noqa: E402  (film soni shu yerdan - yagona manba)

F = "/System/Library/Fonts/Supplemental/"
W, H = 1280, 720
OQ = (246, 243, 236)
OLTIN = (224, 178, 91)

# til -> (yuqori qator, katta nom, ta'rif)
MATN = {
    "uz": ("Garri Potter", "KOLLEKSIYASI",
           "%d ta film  ·  3 tilda  ·  1080p  ·  reklamasiz"),
    "ru": ("Гарри Поттер", "КОЛЛЕКЦИЯ",
           "%d фильмов  ·  3 языка  ·  1080p  ·  без рекламы"),
    "en": ("Harry Potter", "COLLECTION",
           "%d films  ·  3 languages  ·  1080p  ·  ad-free"),
}


def shrift(nom, size, idx=0):
    return ImageFont.truetype(F + nom, size, index=idx)


def kirillmi(text):
    return any("Ѐ" <= ch <= "ӿ" for ch in text)


def devor(til):
    """Plakatlar devori: 2 qator, har biri 360 px baland."""
    fon = Image.new("RGB", (W, H), (12, 15, 20))
    ids = [fid for fid, _ in catalog.ordered()]
    ph = H // 2
    pw = int(ph * 600 / 855)
    # Yuqori qatorga 6 ta, pastki qatorga 6 ta (yarim plakatga surilgan) -
    # 11 ta film ikki qatorga aylanma tartibda taqsimlanadi.
    for qator in range(2):
        siljish = -pw // 2 if qator else 0
        for i in range(7):
            fid = ids[(qator * 6 + i) % len(ids)]
            yol = os.path.join(IMG, "%s_%s.jpg" % (fid, til))
            if not os.path.isfile(yol):
                yol = os.path.join(IMG, "%s_uz.jpg" % fid)
            p = Image.open(yol).convert("RGB").resize((pw, ph), Image.LANCZOS)
            fon.paste(p, (siljish + i * pw, qator * ph))
    return fon


def parda(im):
    """Qorong'i parda: o'rtasi eng qorong'i - yozuv o'qilsin, chetlarda
    plakatlar sezilib tursin."""
    g = Image.new("L", (W, H), 0)
    d = ImageDraw.Draw(g)
    for i in range(80):
        k = i / 80.0
        rx, ry = int(W * 0.75 * (1 - k)), int(H * 0.75 * (1 - k))
        d.ellipse((W // 2 - rx, H // 2 - ry, W // 2 + rx, H // 2 + ry),
                  fill=int(150 + 95 * k))
    g = g.filter(ImageFilter.GaussianBlur(60))
    qora = Image.new("RGBA", (W, H), (8, 10, 14, 255))
    qora.putalpha(g)
    base = im.convert("RGBA")
    # Umumiy qoraytirish ham - plakatlar yozuv bilan raqobat qilmasin
    base.alpha_composite(Image.new("RGBA", (W, H), (8, 10, 14, 120)))
    base.alpha_composite(qora)
    return base


def matn(base, xy, text, font, fill, anchor="mm", blur=8):
    q = Image.new("RGBA", base.size, (0, 0, 0, 0))
    ImageDraw.Draw(q).text(xy, text, font=font, fill=(0, 0, 0, 235), anchor=anchor)
    base.alpha_composite(q.filter(ImageFilter.GaussianBlur(blur)))
    ImageDraw.Draw(base).text(xy, text, font=font, fill=fill, anchor=anchor)


def yasash(til):
    yuqori, katta, tarif = MATN[til]
    soni = len(catalog.FILMS)
    im = parda(devor(til))

    f_yuqori = (shrift("Baskerville.ttc", 64) if kirillmi(yuqori)
                else shrift("BigCaslon.ttf", 70))
    f_katta = shrift("Baskerville.ttc", 92, 4)     # SemiBold
    f_tarif = shrift("Baskerville.ttc", 28)

    cx = W // 2
    matn(im, (cx, 268), yuqori, f_yuqori, OQ)
    matn(im, (cx, 366), katta, f_katta, OLTIN)
    # Ingichka chiziq - nom va ta'rifni ajratadi
    d = ImageDraw.Draw(im)
    d.line((cx - 150, 432, cx + 150, 432), fill=(224, 178, 91, 180), width=2)
    matn(im, (cx, 478), tarif % soni, f_tarif, OQ, blur=6)
    return im.convert("RGB")


def main():
    for til in ("uz", "ru", "en"):
        natija = os.path.join(IMG, "promo_%s.jpg" % til)
        yasash(til).save(natija, "JPEG", quality=86, optimize=True)
        print("  %-14s %5.0f KB" % (os.path.basename(natija),
                                    os.path.getsize(natija) / 1024))


if __name__ == "__main__":
    main()
