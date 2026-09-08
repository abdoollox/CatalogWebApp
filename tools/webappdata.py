#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""index.html dagi katalog ro'yxatini CatalogBot/catalog.py dan yasaydi.

NEGA KERAK
    Ilgari filmlar ro'yxati ikki joyda qo'lda yozilardi: botning ichida va
    shu index.html da. Bittasini tuzatib ikkinchisini unutish oson edi -
    natijada bot bir filmni, ilova boshqasini ko'rsatishi mumkin edi.

    Endi yagona manba - catalog.py. Bu dastur o'sha fayldan o'qib,
    index.html ichidagi belgilangan blokni qayta yozadi.

ISHLATISH
    python3 tools/webappdata.py            # index.html ni yangilaydi
    python3 tools/webappdata.py --korish   # faqat ko'rsatadi, tegmaydi

    Film qo'shsangiz yoki message_id ni o'zgartirsangiz: avval catalog.py ni
    tahrirlang, keyin shu buyruqni ishga tushiring.

CATALOG.PY QAYERDAN TOPILADI
    Odatda ikkala papka yonma-yon turadi:
        .../CatalogBot/catalog.py
        .../CatalogWebApp/tools/webappdata.py
    Boshqa joyda bo'lsa: CATALOG_BOT_DIR o'zgaruvchisida yo'lni bering.
"""

import argparse
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
INDEX = os.path.join(ROOT, "index.html")

BOSHI = "  /* ===== KATALOG BOSHI"
OXIRI = "  /* ===== KATALOG OXIRI ===== */"


def catalog_yukla():
    """catalog.py ni topib import qiladi."""
    yollar = [
        os.environ.get("CATALOG_BOT_DIR"),
        os.path.join(os.path.dirname(ROOT), "CatalogBot"),
    ]
    for yol in yollar:
        if yol and os.path.isfile(os.path.join(yol, "catalog.py")):
            sys.path.insert(0, yol)
            import catalog
            return catalog
    sys.exit(
        "XATO: catalog.py topilmadi.\n"
        "  Qidirilgan joylar:\n    " + "\n    ".join(y or "(CATALOG_BOT_DIR berilmagan)" for y in yollar) + "\n"
        "  Yechim: CatalogBot papkasini shu papka yoniga qo'ying yoki\n"
        "          CATALOG_BOT_DIR=/yo'l/CatalogBot python3 tools/webappdata.py"
    )


def js(matn):
    """Matnni JavaScript qatoriga aylantiradi."""
    return '"' + matn.replace("\\", "\\\\").replace('"', '\\"') + '"'


def qator(cat, fid, film, fb=False):
    bosh = '    { id: %-7s' % (js(fid) + ",")
    if fb:
        bosh += ' num: %-6s year: %-8s' % (js(film["num"]) + ",", js(str(film["year"])) + ",")
    tillar = ", ".join("%s: %s" % (l, js(film[l]["title"])) for l in cat.LANGS)
    return bosh + tillar + " },"


def blok(cat):
    hp = cat.series("hp")
    fb = cat.series("fb")

    s = []
    s.append("  /* ===== KATALOG BOSHI — AVTOMATIK YOZILADI, QO'LDA TAHRIRLAMANG =====")
    s.append("     Manba:     CatalogBot/catalog.py")
    s.append("     Yangilash: python3 tools/webappdata.py                          */")
    s.append("")

    s.append("  var MOVIES = [")
    s += [qator(cat, i, f) for i, f in hp]
    s[-1] = s[-1].rstrip(",")
    s.append("  ];")
    s.append("")

    s.append("  var MOVIES_FB = [")
    s += [qator(cat, i, f, fb=True) for i, f in fb]
    s[-1] = s[-1].rstrip(",")
    s.append("  ];")
    s.append("")

    s.append("  var NUMERALS = [%s];" % ",".join(js(f["num"]) for _, f in hp))
    s.append("  var YEARS = [%s];" % ",".join(js(str(f["year"])) for _, f in hp))
    s.append("")

    s.append("  // Qaysi film qaysi tilda hali yuklanmagan (catalog.py da message_id = 0).")
    s.append("  // Bunday kartalar kulrang bo'lib ko'rinadi va bosilmaydi.")
    s.append("  var NOT_READY = {")
    for i, lang in enumerate(cat.LANGS):
        yoq = cat.not_ready(lang)
        vergul = "" if i == len(cat.LANGS) - 1 else ","
        s.append("    %s: [%s]%s" % (lang, ",".join(js(x) for x in yoq), vergul))
    s.append("  };")
    s.append("")
    s.append(OXIRI)
    return "\n".join(s)


def main():
    p = argparse.ArgumentParser(description="index.html katalogini catalog.py dan yangilaydi")
    p.add_argument("--korish", action="store_true", help="faqat ko'rsatadi, faylga tegmaydi")
    args = p.parse_args()

    cat = catalog_yukla()
    yangi = blok(cat)

    if args.korish:
        print(yangi)
        return

    # newline="" - satr oxirlarini o'zgartirmaymiz. index.html CRLF
    # formatida; oddiy o'qish/yozish uni LF ga aylantirib, butun fayl
    # o'zgargandek ko'rinardi va haqiqiy tuzatishni topib bo'lmasdi.
    with open(INDEX, encoding="utf-8", newline="") as f:
        src = f.read()
    nl = "\r\n" if "\r\n" in src else "\n"
    yangi = yangi.replace("\n", nl)

    try:
        b = src.index(BOSHI)
        o = src.index(OXIRI) + len(OXIRI)
    except ValueError:
        sys.exit(
            "XATO: index.html ichida katalog belgilari topilmadi.\n"
            "  Kutilgan belgilar:\n    %s ...\n    %s\n"
            "  Ular tasodifan o'chirilgan bo'lishi mumkin - git tarixidan tiklang."
            % (BOSHI, OXIRI)
        )

    if src[b:o] == yangi:
        print("O'zgarish yo'q — index.html allaqachon catalog.py ga mos.")
        return

    with open(INDEX, "w", encoding="utf-8", newline="") as f:
        f.write(src[:b] + yangi + src[o:])
    print("index.html yangilandi (%d ta film)." % len(cat.FILMS))
    for lang in cat.LANGS:
        yoq = cat.not_ready(lang)
        print("  %s tilida yuklanmagan: %s" % (lang, ", ".join(yoq) if yoq else "yo'q"))


if __name__ == "__main__":
    main()
