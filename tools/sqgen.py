#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Posterlardan 1:1 kvadrat ikonkalar yasaydi (inline qidiruv ro'yxati uchun).

NEGA KERAK
    Telegram inline natijalar ro'yxatidagi kichik rasmni KVADRAT qilib
    kesadi. Bizdagi posterlar tik (600x900), ya'ni to'g'ridan-to'g'ri
    berilsa chetlari qirqiladi va rasm xunuk chiqadi. Shuning uchun
    oldindan kvadrat fayl tayyorlanadi.

    Fayl KICHIK bo'lishi ham muhim (~25 KB): kattasini Telegram yuklab
    olmaydi va rasm o'rniga harf chizadi.

ISHLATISH
    python3 tools/sqgen.py            # img/sq/ ni yangilaydi
    python3 tools/sqgen.py --korish   # nima qilinishini ko'rsatadi, tegmaydi

Manba: img/<id>_<til>.jpg  ->  natija: img/sq/<id>_<til>.jpg
"""

import argparse
import os
import sys

try:
    from PIL import Image
except ImportError:
    sys.exit("XATO: Pillow kerak.  pip install pillow")

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
IMG = os.path.join(ROOT, "img")
SQ = os.path.join(IMG, "sq")

OLCHAM = 320        # Telegram ro'yxatidagi ikonka
SIFAT = 82          # ~25 KB atrofida chiqadi


def kvadrat(im):
    """Markazdan kvadrat kesib, kerakli o'lchamga keltiradi."""
    w, h = im.size
    s = min(w, h)
    quti = ((w - s) // 2, (h - s) // 2, (w + s) // 2, (h + s) // 2)
    return im.crop(quti).resize((OLCHAM, OLCHAM), Image.LANCZOS)


def main():
    p = argparse.ArgumentParser(description="Posterlardan kvadrat ikonka yasaydi")
    p.add_argument("--korish", action="store_true", help="faqat ko'rsatadi")
    args = p.parse_args()

    manbalar = sorted(f for f in os.listdir(IMG)
                      if f.endswith(".jpg") and "_" in f)
    if not manbalar:
        sys.exit("XATO: img/ ichida poster topilmadi")

    if not args.korish:
        os.makedirs(SQ, exist_ok=True)

    jami = 0
    for fayl in manbalar:
        manba = os.path.join(IMG, fayl)
        natija = os.path.join(SQ, fayl)
        if args.korish:
            print("  %s -> sq/%s" % (fayl, fayl))
            jami += 1
            continue
        with Image.open(manba) as im:
            kvadrat(im.convert("RGB")).save(natija, "JPEG",
                                            quality=SIFAT, optimize=True)
        jami += 1
        print("  %-18s %5.1f KB" % (fayl, os.path.getsize(natija) / 1024))

    print("\n%d ta ikonka %s" % (jami, "ko'rsatildi" if args.korish else "tayyorlandi"))


if __name__ == "__main__":
    main()
