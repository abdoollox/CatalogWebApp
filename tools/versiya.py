#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""index.html dagi css/ va js/ havolalariga ?v=<xesh> qo'yadi.

Telegram ichidagi brauzer fayllarni keshda ushlab turadi. Havola oxiridagi
?v= fayl mazmunidan olingan xesh bo'lgani uchun fayl o'zgarsa havola ham
o'zgaradi va yangi nusxa yuklanadi; o'zgarmagan fayl esa keshdan keladi.

css/ yoki js/ ichidagi faylni o'zgartirgandan keyin HAR SAFAR:

    python3 tools/versiya.py

(webappdata.py buni o'zi chaqiradi.)
"""

import hashlib
import os
import re

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
INDEX = os.path.join(ROOT, "index.html")
HAVOLA = re.compile(r'((?:css|js)/[\w./-]+\.(?:css|js))\?v=\w*')


def xesh(yol):
    with open(os.path.join(ROOT, yol), "rb") as f:
        return hashlib.md5(f.read()).hexdigest()[:8]


def main():
    with open(INDEX, encoding="utf-8", newline="") as f:
        src = f.read()
    yangi = HAVOLA.sub(lambda m: "%s?v=%s" % (m.group(1), xesh(m.group(1))), src)
    if yangi == src:
        print("Versiyalar joyida.")
        return
    with open(INDEX, "w", encoding="utf-8", newline="") as f:
        f.write(yangi)
    for m in HAVOLA.finditer(yangi):
        print("  " + m.group(0))


if __name__ == "__main__":
    main()
