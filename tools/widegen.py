#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Ulashilgan inline karta uchun 16:9 rasmlar yasaydi (img/wide/).

MANBA
    Foydalanuvchi topgan 16:9 rasmlar: <papka>/hp1_uz.png ... hp8_en.png
    - ruscha va inglizcha rasmlarda film nomi ALLAQACHON yozilgan
      (rasmiy plakatlar) - ular faqat kichraytiriladi;
    - o'zbekcha rasmlarda yozuv YO'Q (rasmiy o'zbekcha plakat mavjud
      emas) - nomni shu dastur yozadi, ruscha/inglizchadagi uslubda.

NATIJA
    img/wide/<id>_<til>.jpg - 1280x720, ~150 KB.
    Manba 1.4-10 MB edi; kartada sifat farqi bilinmaydi, tezligi esa bor.

    Fantastik Maxluqlar: shu papkada fb1.jpg, fb2.jpg, fb3.jpg - TMDB dagi
    yozuvsiz kadrlar (w1280). Nom uchala tilda ham shu dastur yozadi.

ISHLATISH
    python3 tools/widegen.py "~/Downloads/HP thumbnails"
    python3 tools/widegen.py "~/Downloads/HP thumbnails" --faqat hp3_uz

SHRIFTLAR macOS tizimidan olinadi (Big Caslon, Baskerville, Didot,
Hoefler Text). Boshqa tizimda ishlatish uchun F ni o'zgartiring.

DIZAYN (o'zbekcha)
    Pastki o'ng burchak yumshoq qoraytiriladi - yozuv har qanday fonda
    o'qilsin. O'zbekcha rasmlarda qahramonlar ruscha/inglizchadagidan
    kattaroq va o'ngroqda turibdi, shuning uchun yozuv o'rta-o'ng emas,
    pastki o'ng qorong'i joyga qo'yiladi (aks holda yuzlarga tushardi).

    Ranglar inglizcha rasmdagi subtitr rangidan olingan. 4 va 8-filmda
    avtomatik o'lchov fondan ifloslangan (binafsha osmon, ajdarho olovi),
    shuning uchun ular qo'lda to'g'rilangan.

    7 va 8-filmlar: raqam 7 va 8 (foydalanuvchi tanlovi), ostida
    "1-QISM" / "2-QISM". Rasmiy ruscha/inglizcha plakatlarda ikkalasida
    ham "7" turadi - bu ataylab farq.
"""

import argparse
import os
import sys

try:
    from PIL import Image, ImageDraw, ImageFilter, ImageFont
except ImportError:
    sys.exit("XATO: Pillow kerak.  pip install pillow")

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
OUT = os.path.join(ROOT, "img", "wide")

F = "/System/Library/Fonts/Supplemental/"
W, H = 1280, 720
SIFAT = 86
OQ = (246, 243, 236)
TILLAR = ("uz", "ru", "en")

# id -> (subtitr qatorlari, katta raqam, rang, qism)
UZ = {
    "hp1": (["HIKMATLAR", "TOSHI"],   "1", (95, 175, 235),  None),
    "hp2": (["MAXFIY", "HUJRA"],      "2", (60, 200, 175),  None),
    "hp3": (["AZKABAN", "MAHBUSI"],   "3", (242, 166, 64),  None),
    "hp4": (["ALANGA", "KUBOGI"],     "4", (215, 100, 235), None),
    "hp5": (["FENIKS", "JAMIYATI"],   "5", (55, 210, 205),  None),
    "hp6": (["TILSIM", "SHAXZODASI"], "6", (230, 195, 85),  None),
    "hp7": (["AJAL", "TUHFASI"],      "7", (170, 205, 70),  "1-QISM"),
    "hp8": (["AJAL", "TUHFASI"],      "8", (160, 195, 220), "2-QISM"),
}


def shrift(nom, size, idx=0):
    return ImageFont.truetype(F + nom, size, index=idx)


def matn(base, xy, text, font, fill, anchor, blur=7, soya=(0, 0, 0, 230)):
    """Matn orqasida yumshoq soya - fon qanday bo'lmasin o'qilsin."""
    q = Image.new("RGBA", base.size, (0, 0, 0, 0))
    ImageDraw.Draw(q).text(xy, text, font=font, fill=soya, anchor=anchor)
    base.alpha_composite(q.filter(ImageFilter.GaussianBlur(blur)))
    ImageDraw.Draw(base).text(xy, text, font=font, fill=fill, anchor=anchor)


def burchak_soya(base, kuch=190):
    """Pastki o'ng burchakni yumshoq qoraytiradi."""
    g = Image.new("L", (W, H), 0)
    d = ImageDraw.Draw(g)
    for i in range(60):
        k = i / 60.0
        r = int(900 * (1 - k))
        d.ellipse((W + 120 - r, H + 160 - r, W + 120 + r, H + 160 + r),
                  fill=int(kuch * k))
    g = g.filter(ImageFilter.GaussianBlur(40))
    qora = Image.new("RGBA", (W, H), (0, 0, 0, 255))
    qora.putalpha(g)
    base.alpha_composite(qora)


def uzbekcha(manba, qatorlar, son, rang, qism=None):
    return yozuv(manba, "Garri Potter", qatorlar, son, rang, va="va", qism=qism)


def yozuv(manba, brend, qatorlar, son, rang, va=None, qism=None, brend_size=56,
          max_eni=None):
    """Pastki o'ng burchakka nom yozadi: brend qatori, rangli subtitr
    (oldida ixtiyoriy kichik kursiv bog'lovchi - "va", "and", "и") va
    katta raqam.

    max_eni - subtitrning eng uzun qatori shu kenglikdan (px) oshsa, harf
    kichraytiriladi: uzun nom ("GRINDELVALDNING") qahramonlar ustiga
    chiqib ketmasin. Brend qatoriga ham shu chegara qo'yiladi."""
    im = Image.open(manba).convert("RGB").resize((W, H), Image.LANCZOS).convert("RGBA")
    burchak_soya(im)

    # Big Caslon kirillni bilmaydi - ruscha brend Baskerville bilan
    kirill = any("Ѐ" <= ch <= "ӿ" for ch in brend)
    f_brend = (shrift("Baskerville.ttc", brend_size) if kirill
               else shrift("BigCaslon.ttf", brend_size))
    if max_eni and f_brend.getlength(brend) > max_eni:
        brend_size = int(brend_size * max_eni / f_brend.getlength(brend))
        f_brend = f_brend.font_variant(size=brend_size)
    f_va = shrift("Hoefler Text.ttc", 30, 2)      # Italic
    sub_size = 50
    f_sub = shrift("Baskerville.ttc", sub_size, 4)      # SemiBold
    if max_eni:
        eng_uzun = max(f_sub.getlength(q) for q in qatorlar)
        if eng_uzun > max_eni:
            sub_size = int(sub_size * max_eni / eng_uzun)
            f_sub = shrift("Baskerville.ttc", sub_size, 4)
    qadam = int(sub_size * 1.12)
    f_qism = shrift("Baskerville.ttc", 24, 4)
    f_son = shrift("Didot.ttc", 230, 2)           # Bold

    o = W - 70
    d = ImageDraw.Draw(im)
    blok_o = o - d.textlength(son, font=f_son) - 22
    pastki = H - 70

    matn(im, (o, pastki + 14), son, f_son, OQ, "rs")
    y = pastki
    if qism:
        matn(im, (blok_o, y), qism, f_qism, OQ, "rs")
        y -= 38
    for q in reversed(qatorlar):
        matn(im, (blok_o, y), q, f_sub, rang, "rs")
        y -= qadam
    if va:
        birinchi_y = y + qadam
        bw = d.textlength(qatorlar[0], font=f_sub)
        matn(im, (blok_o - bw - 12, birinchi_y - 4), va, f_va, OQ, "rs")
    matn(im, (blok_o, y - 6), brend, f_brend, OQ, "rs")
    return im.convert("RGB")


# Fantastik Maxluqlar: manba kadrlarda yozuv YO'Q (TMDB, yozuvsiz kadr),
# shuning uchun uchala tilda ham nomni shu dastur yozadi.
# id -> (raqam, rang, {til: (brend, bog'lovchi, subtitr qatorlari)})
FB = {
    "fb1": ("1", (232, 190, 118), {
        "uz": ("Fantastik Maxluqlar", "va", ["ULARNING", "MAKONI"]),
        "ru": ("Фантастические твари", "и", ["ГДЕ ОНИ", "ОБИТАЮТ"]),
        "en": ("Fantastic Beasts", "and", ["WHERE TO", "FIND THEM"]),
    }),
    "fb2": ("2", (150, 192, 235), {
        "uz": ("Fantastik Maxluqlar", None, ["GRINDELVALDNING", "JINOYATLARI"]),
        "ru": ("Фантастические твари", None, ["ПРЕСТУПЛЕНИЯ", "ГРИН-ДЕ-ВАЛЬДА"]),
        "en": ("Fantastic Beasts", None, ["THE CRIMES OF", "GRINDELWALD"]),
    }),
    "fb3": ("3", (242, 150, 62), {
        "uz": ("Fantastik Maxluqlar", None, ["DAMBLDOR", "SIRLARI"]),
        "ru": ("Фантастические твари", None, ["ТАЙНЫ", "ДАМБЛДОРА"]),
        "en": ("Fantastic Beasts", None, ["THE SECRETS OF", "DUMBLEDORE"]),
    }),
}


def fantastik(manba, fid, til):
    son, rang, tillar = FB[fid]
    brend, va, qatorlar = tillar[til]
    return yozuv(manba, brend, qatorlar, son, rang, va=va, brend_size=46,
                 max_eni=340)


def tayyor(manba):
    """Ruscha/inglizcha: nom allaqachon yozilgan - faqat kichraytiramiz."""
    return Image.open(manba).convert("RGB").resize((W, H), Image.LANCZOS)


def saqla(im, nom):
    natija = os.path.join(OUT, nom + ".jpg")
    im.save(natija, "JPEG", quality=SIFAT, optimize=True)
    print("  %-10s %5.0f KB" % (nom, os.path.getsize(natija) / 1024))
    return 1


def main():
    p = argparse.ArgumentParser(description="16:9 karta rasmlarini yasaydi")
    p.add_argument("manba", help="foydalanuvchi topgan rasmlar papkasi")
    p.add_argument("--faqat", help="bitta fayl, masalan hp3_uz")
    args = p.parse_args()

    papka = os.path.expanduser(args.manba)
    if not os.path.isdir(papka):
        sys.exit("XATO: papka topilmadi: %s" % papka)
    os.makedirs(OUT, exist_ok=True)

    jami = 0
    for fid in sorted(UZ):
        for til in TILLAR:
            nom = "%s_%s" % (fid, til)
            if args.faqat and nom != args.faqat:
                continue
            manba = os.path.join(papka, nom + ".png")
            if not os.path.isfile(manba):
                print("  YO'Q  %s" % nom)
                continue
            im = uzbekcha(manba, *UZ[fid]) if til == "uz" else tayyor(manba)
            jami += saqla(im, nom)

    # Fantastik Maxluqlar: bitta yozuvsiz kadr (<papka>/fb1.jpg) - uch til
    for fid in sorted(FB):
        manba = os.path.join(papka, fid + ".jpg")
        for til in TILLAR:
            nom = "%s_%s" % (fid, til)
            if args.faqat and nom != args.faqat:
                continue
            if not os.path.isfile(manba):
                print("  YO'Q  %s" % nom)
                continue
            jami += saqla(fantastik(manba, fid, til), nom)
    print("\n%d ta rasm tayyor: %s" % (jami, OUT))


if __name__ == "__main__":
    main()
