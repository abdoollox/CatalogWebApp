#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Sehrgar shaxmati ovozlari: snd/chess_<nom>.m4a.

Hammasi noldan sintez qilinadi (tayyor yozuv yo'q - mualliflik huquqi toza).
Ruhi - "Garri Potter"dagi sehrgar shaxmati: donalar og'ir tosh haykallar,
yurganda taxta ustida sirpanib, gursillab tushadi; urilganda chirs etib
sinadi va parchalari sochiladi. Sehrli lahzalar (shoh xavfda, piyoda
aylanishi, g'alaba) - selesta tembrida (filmlarning "sehrli" cholg'usi),
kuylar esa original (filmdagi mavzular ishlatilmaydi). Hammasi tosh zal
aks-sadosida.

ISHLATISH (CatalogWebApp papkasida; macOS - AAC uchun afconvert)
    pip install numpy
    python3 tools/soundgen.py
"""

import os
import subprocess
import sys
import tempfile
import wave

try:
    import numpy as np
except ImportError:
    sys.exit("XATO: numpy kerak.  pip install numpy")

SR = 44100
HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(os.path.dirname(HERE), "snd")
RNG = np.random.default_rng(7)      # har safar bir xil natija


def silence(sec):
    return np.zeros(int(SR * sec))


def t_axis(sec):
    return np.arange(int(SR * sec)) / SR


def band(x, lo=None, hi=None, soft=0.15):
    """Chastota bo'yicha filtr (oflayn, FFT orqali, yumshoq chegara)."""
    n = len(x)
    f = np.fft.rfftfreq(n, 1 / SR)
    g = np.ones_like(f)
    if lo:
        g *= 1 / (1 + (lo / np.maximum(f, 1)) ** 4)
    if hi:
        g *= 1 / (1 + (f / hi) ** 4)
    return np.fft.irfft(np.fft.rfft(x) * g, n)


def place(dst, src, at):
    i = int(at * SR)
    j = min(len(dst), i + len(src))
    if i < len(dst):
        dst[i:j] += src[:j - i]
    return dst


def modal(freqs, amps, decays, sec, detune=0.0):
    """Tosh / metall jarangi: so'nib boruvchi tebranishlar yig'indisi."""
    t = t_axis(sec)
    y = np.zeros_like(t)
    for f, a, d in zip(freqs, amps, decays):
        f = f * (1 + RNG.uniform(-detune, detune))
        y += a * np.sin(2 * np.pi * f * t + RNG.uniform(0, 6.28)) * np.exp(-t / d)
    return y


def click(sec=0.004, hi=5000, lo=None):
    n = int(SR * sec)
    x = RNG.standard_normal(n) * np.exp(-np.linspace(0, 6, n))
    return band(x, lo, hi)


def grains(sec, count, fmin, fmax, gmin, gmax, decay):
    """Mayda parchalar: tasodifiy paytlarda qisqa 'chiq' lar."""
    y = silence(sec)
    for _ in range(count):
        at = RNG.exponential(decay)
        if at > sec - 0.02:
            continue
        g = RNG.uniform(gmin, gmax)
        n = int(SR * g)
        x = RNG.standard_normal(n) * np.hanning(n)
        fc = RNG.uniform(fmin, fmax)
        x = band(x, fc * 0.7, fc * 1.3)
        place(y, x * np.exp(-at / (decay * 1.5)) * RNG.uniform(0.3, 1.0), at)
    return y


def celesta(freq, sec=1.6, vel=1.0):
    """Selesta: bolg'acha uriladigan po'lat plastina - toza, jarangdor, tez so'nadigan yuqorilar."""
    t = t_axis(sec)
    parts = [(1, 1.0, 1.1), (2, 0.22, 0.45), (3.0, 0.10, 0.25), (4.17, 0.07, 0.12), (6.3, 0.03, 0.05)]
    y = np.zeros_like(t)
    for ratio, a, d in parts:
        y += a * np.sin(2 * np.pi * freq * ratio * t) * np.exp(-t / d)
    y *= 1 - np.exp(-t / 0.0015)
    y[:len(click(0.003, 7000, 2500))] += click(0.003, 7000, 2500) * 0.15
    return y * vel


def bell(freq, sec=3.0, vel=1.0):
    """Minora qo'ng'irog'i (Xogvarts soat minorasi ruhida) - noaniq obertonlar, uzun so'nish."""
    t = t_axis(sec)
    parts = [(0.5, 0.35, 2.2), (1, 1.0, 1.6), (1.19, 0.4, 1.1), (1.5, 0.3, 0.9),
             (2.0, 0.35, 0.8), (2.74, 0.2, 0.5), (4.1, 0.1, 0.25)]
    y = np.zeros_like(t)
    for ratio, a, d in parts:
        y += a * np.sin(2 * np.pi * freq * ratio * t + RNG.uniform(0, 6.28)) * np.exp(-t / d)
    y *= 1 - np.exp(-t / 0.002)
    return y * vel


def note(name):
    names = {"C": -9, "C#": -8, "D": -7, "D#": -6, "E": -5, "F": -4, "F#": -3, "G": -2,
             "G#": -1, "A": 0, "A#": 1, "B": 2}
    pitch, octave = name[:-1], int(name[-1])
    return 440.0 * 2 ** ((names[pitch] + 12 * (octave - 4)) / 12)


def whoosh(sec, f0, f1, level=1.0):
    """Sehrli 'vush': ko'tariluvchi shovqin to'lqini."""
    n = int(SR * sec)
    x = RNG.standard_normal(n)
    out = np.zeros(n)
    steps = 24
    for k in range(steps):
        a, b = k * n // steps, (k + 1) * n // steps
        fc = f0 * (f1 / f0) ** (k / (steps - 1))
        seg = band(x[max(0, a - 512):b + 512], fc * 0.6, fc * 1.6)
        out[a:b] += seg[(a - max(0, a - 512)):(a - max(0, a - 512)) + (b - a)]
    env = np.sin(np.linspace(0, np.pi, n)) ** 2
    return out * env * level


def hall(x, rt=1.8, wet=0.3, bright=4500):
    """Tosh zal aks-sadosi (sun'iy impuls javobi) - stereo qaytaradi."""
    n_ir = int(SR * rt * 1.2)
    t = np.arange(n_ir) / SR
    out = []
    for side in range(2):
        ir = RNG.standard_normal(n_ir) * np.exp(-6.9 * t / rt)
        ir = band(ir, 180, bright)
        for d, a in ((0.011, 0.5), (0.019, 0.35), (0.029 + side * 0.004, 0.3), (0.041, 0.2)):
            ir[int(d * SR)] += a * 8
        ir /= np.sqrt(np.sum(ir ** 2))
        n = len(x) + n_ir
        wetsig = np.fft.irfft(np.fft.rfft(x, n) * np.fft.rfft(ir, n), n)
        dry = np.concatenate([x, np.zeros(n_ir)])
        out.append(dry * (1 - wet) + wetsig * wet * 2.2)
    y = np.stack(out, axis=1)
    # oxirgi jim qismni kesamiz
    mag = np.max(np.abs(y), axis=1)
    last = np.nonzero(mag > 8e-3 * mag.max())[0][-1] + 1
    y = y[:last]
    fade = min(len(y) // 3, int(0.25 * SR))
    y[-fade:] *= np.linspace(1, 0, fade)[:, None]
    return y


# ---------------------------------------------------------------- ovozlar

def s_move():
    y = silence(0.5)
    # tosh taxta bo'ylab qisqa sirpanish
    n = int(0.07 * SR)
    scrape = RNG.standard_normal(n) * (0.4 + 0.6 * RNG.random(n) ** 6)
    scrape = band(scrape, 900, 3200) * np.hanning(n)
    place(y, scrape * 0.25, 0.0)
    # og'ir tushish
    thud = modal([68, 132, 205, 318, 505], [1.0, 0.55, 0.35, 0.2, 0.1], [0.07, 0.05, 0.04, 0.03, 0.02], 0.4, 0.03)
    place(y, thud, 0.055)
    place(y, click(0.004, 3500) * 0.6, 0.055)
    return hall(y, rt=1.1, wet=0.18)


def s_capture():
    y = silence(1.2)
    # chirs etish
    place(y, click(0.012, 9000, 1200) * 1.4, 0.0)
    place(y, modal([1850, 2640, 3710, 5200], [0.5, 0.35, 0.25, 0.12], [0.03, 0.02, 0.015, 0.01], 0.2, 0.05), 0.0)
    # gumburlash
    place(y, modal([52, 104, 166, 240], [1.2, 0.6, 0.35, 0.2], [0.22, 0.14, 0.09, 0.06], 0.8, 0.03), 0.004)
    # sochilayotgan parchalar
    place(y, grains(1.0, 110, 1200, 6500, 0.002, 0.006, 0.16) * 0.55, 0.02)
    for at in (0.09, 0.17, 0.26, 0.38):
        place(y, modal([150, 290, 470], [0.4, 0.2, 0.1], [0.03, 0.02, 0.015], 0.15, 0.2) * RNG.uniform(0.25, 0.5), at)
    return hall(y, rt=1.9, wet=0.3)


def s_check():
    # tez-tez eshitiladi - qisqa va yengil: sehr "uchqun"i
    y = silence(0.9)
    place(y, whoosh(0.22, 700, 5000, 0.14), 0.0)
    for i, nm in enumerate(["B5", "D#6", "F#6"]):
        place(y, celesta(note(nm), 0.7, 0.55 + i * 0.12), 0.04 + i * 0.04)
    return hall(y, rt=1.6, wet=0.3, bright=7000)


def s_start():
    y = silence(2.0)
    for i, nm in enumerate(["E5", "G5", "B5", "D6"]):
        place(y, celesta(note(nm), 1.8, 0.7), i * 0.13)
    place(y, celesta(note("F#6"), 1.8, 0.45), 0.58)
    place(y, bell(note("E3"), 2.2, 0.25), 0.0)
    return hall(y, rt=2.6, wet=0.4, bright=6500)


def s_win():
    y = silence(3.2)
    for i, nm in enumerate(["E5", "G#5", "B5", "E6", "G#6", "B6"]):
        place(y, celesta(note(nm), 1.6, 0.6 + i * 0.05), i * 0.09)
    place(y, bell(note("E4"), 3.0, 0.5), 0.5)
    place(y, bell(note("B4"), 3.0, 0.3), 0.5)
    place(y, grains(1.4, 70, 3000, 9000, 0.001, 0.003, 0.4) * 0.25, 0.55)
    return hall(y, rt=2.8, wet=0.38, bright=7000)


def s_loss():
    y = silence(3.0)
    for i, nm in enumerate(["B5", "G5", "E5", "D#5"]):
        place(y, celesta(note(nm), 1.6, 0.6), i * 0.2)
    place(y, bell(note("E3"), 2.8, 0.45), 0.8)
    place(y, modal([45, 90], [0.4, 0.2], [0.5, 0.3], 1.2, 0.02), 0.8)
    return hall(y, rt=2.6, wet=0.4, bright=4000)


def s_draw():
    y = silence(2.4)
    for nm in ("E5", "B5"):
        place(y, celesta(note(nm), 1.8, 0.5), 0.0)
    for nm in ("D5", "A5"):
        place(y, celesta(note(nm), 1.8, 0.5), 0.34)
    return hall(y, rt=2.4, wet=0.38, bright=6000)


def s_promote():
    y = silence(1.8)
    place(y, whoosh(0.45, 300, 6000, 0.3), 0.0)
    for _ in range(26):
        f = RNG.uniform(1500, 4200)
        place(y, celesta(f, 0.5, RNG.uniform(0.08, 0.2)), RNG.uniform(0.1, 0.55))
    place(y, celesta(note("E6"), 1.4, 0.7), 0.5)
    place(y, celesta(note("B6"), 1.4, 0.5), 0.5)
    return hall(y, rt=2.4, wet=0.4, bright=8000)


SOUNDS = {
    "move": (s_move, 0.6),
    "capture": (s_capture, 0.95),
    "check": (s_check, 0.5),
    "start": (s_start, 0.5),
    "win": (s_win, 0.62),
    "loss": (s_loss, 0.55),
    "draw": (s_draw, 0.5),
    "promote": (s_promote, 0.6),
}


def write_wav(path, y):
    y = np.clip(y, -1, 1)
    data = (y * 32767).astype("<i2")
    with wave.open(path, "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(data.tobytes())


def main():
    os.makedirs(OUT, exist_ok=True)
    tmp = tempfile.mkdtemp()
    for name, (fn, level) in SOUNDS.items():
        y = fn()
        y = y / np.max(np.abs(y)) * level
        wav = os.path.join(tmp, name + ".wav")
        out = os.path.join(OUT, "chess_%s.m4a" % name)
        write_wav(wav, y)
        subprocess.run(["afconvert", "-f", "m4af", "-d", "aac", "-b", "80000", wav, out], check=True)
        print("%-8s %.2f s  %5d bayt" % (name, len(y) / SR, os.path.getsize(out)))


if __name__ == "__main__":
    main()
