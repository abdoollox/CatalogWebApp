/* Sehrgar shaxmati - bot miyasi (Web Worker).
 *
 * Ilovadan alohida oqimda ishlaydi, shuning uchun bot o'ylayotganda telefon
 * qotmaydi (ilgari "qiyin" bot hisobni asosiy oqimda qilardi va ekran
 * bir necha soniya muzlab qolardi). Har daraja belgilangan vaqt ichida
 * javob beradi.
 *
 * Tuzilishi: 0x88 taxta, yurish/qaytarish (make/unmake), Zobrist xesh,
 * alfa-beta (PVS) + takroriy chuqurlashtirish, transpozitsiya jadvali,
 * tinch holatgacha urishlar (quiescence), bo'sh yurish, killer/tarix
 * tartibi, kechiktirilgan qisqartirish (LMR). Baho: material + joy
 * jadvallari (o'rta o'yin / endshpil aralash), fil jufti, o'tgan piyoda.
 *
 * Xabarlar:
 *   {cmd:"move", id, moves:[uci...], level:"easy"|"med"|"hard", time:ms}
 *       -> {id, uci, depth, score, nodes}
 *   {cmd:"perft", id, fen, depth} -> {id, nodes}   (sinov uchun)
 */
"use strict";

var PAWN = 1, KNIGHT = 2, BISHOP = 3, ROOK = 4, QUEEN = 5, KING = 6, BLACK = 8, WHITE = 0;
var INF = 1000000, MATE = 100000;

var board = new Int8Array(128);
var side = WHITE, castle = 0, ep = -1, half = 0;
var kingSq = [0, 0];                  // [oq, qora]
var h1 = 0, h2 = 0;
var stack = [];                       // qaytarish uchun
var hist = [];                        // xesh tarixi (takrorni aniqlash)

var KN = [-33, -31, -18, -14, 14, 18, 31, 33];
var BI = [-17, -15, 15, 17];
var RO = [-16, -1, 1, 16];
var KI = [-17, -16, -15, -1, 1, 15, 16, 17];
var VAL = [0, 100, 320, 330, 500, 900, 0];
var PHASE = [0, 0, 1, 1, 2, 4, 0];

// Rokirovka huquqlari: bit 1 - oq qisqa, 2 - oq uzun, 4 - qora qisqa, 8 - qora uzun
var CMASK = new Int8Array(128);
for (var i = 0; i < 128; i++) { CMASK[i] = 15; }
CMASK[0x74] = 12; CMASK[0x77] = 14; CMASK[0x70] = 13;   // e1, h1, a1
CMASK[0x04] = 3; CMASK[0x07] = 11; CMASK[0x00] = 7;     // e8, h8, a8

// Zobrist
function rnd32() { return (Math.random() * 4294967296) >>> 0; }
var Z1 = [], Z2 = [];
for (var p = 0; p < 16; p++) {
  Z1.push(new Int32Array(128)); Z2.push(new Int32Array(128));
  for (var s = 0; s < 128; s++) { Z1[p][s] = rnd32(); Z2[p][s] = rnd32(); }
}
var ZS1 = rnd32(), ZS2 = rnd32();
var ZC1 = new Int32Array(16), ZC2 = new Int32Array(16), ZE1 = new Int32Array(128), ZE2 = new Int32Array(128);
for (i = 0; i < 16; i++) { ZC1[i] = rnd32(); ZC2[i] = rnd32(); }
for (i = 0; i < 128; i++) { ZE1[i] = rnd32(); ZE2[i] = rnd32(); }

function key() { return (h1 >>> 0) * 2097152 + ((h2 >>> 0) & 0x1FFFFF); }

// Joy jadvallari (oq uchun; 0-qator = 8-rank). Qora uchun ko'zgu.
var PST_MG = {}, PST_EG = {};
(function () {
  var mg = {
    1: [0,0,0,0,0,0,0,0, 50,50,50,50,50,50,50,50, 10,10,20,30,30,20,10,10, 5,5,10,25,25,10,5,5,
        0,0,0,20,20,0,0,0, 5,-5,-10,0,0,-10,-5,5, 5,10,10,-20,-20,10,10,5, 0,0,0,0,0,0,0,0],
    2: [-50,-40,-30,-30,-30,-30,-40,-50, -40,-20,0,0,0,0,-20,-40, -30,0,10,15,15,10,0,-30, -30,5,15,20,20,15,5,-30,
        -30,0,15,20,20,15,0,-30, -30,5,10,15,15,10,5,-30, -40,-20,0,5,5,0,-20,-40, -50,-40,-30,-30,-30,-30,-40,-50],
    3: [-20,-10,-10,-10,-10,-10,-10,-20, -10,0,0,0,0,0,0,-10, -10,0,5,10,10,5,0,-10, -10,5,5,10,10,5,5,-10,
        -10,0,10,10,10,10,0,-10, -10,10,10,10,10,10,10,-10, -10,5,0,0,0,0,5,-10, -20,-10,-10,-10,-10,-10,-10,-20],
    4: [0,0,0,0,0,0,0,0, 5,10,10,10,10,10,10,5, -5,0,0,0,0,0,0,-5, -5,0,0,0,0,0,0,-5,
        -5,0,0,0,0,0,0,-5, -5,0,0,0,0,0,0,-5, -5,0,0,0,0,0,0,-5, 0,0,0,5,5,0,0,0],
    5: [-20,-10,-10,-5,-5,-10,-10,-20, -10,0,0,0,0,0,0,-10, -10,0,5,5,5,5,0,-10, -5,0,5,5,5,5,0,-5,
        0,0,5,5,5,5,0,-5, -10,5,5,5,5,5,0,-10, -10,0,5,0,0,0,0,-10, -20,-10,-10,-5,-5,-10,-10,-20],
    6: [-30,-40,-40,-50,-50,-40,-40,-30, -30,-40,-40,-50,-50,-40,-40,-30, -30,-40,-40,-50,-50,-40,-40,-30, -30,-40,-40,-50,-50,-40,-40,-30,
        -20,-30,-30,-40,-40,-30,-30,-20, -10,-20,-20,-20,-20,-20,-20,-10, 20,20,0,0,0,0,20,20, 20,30,10,0,0,10,30,20]
  };
  var kingEg = [-50,-40,-30,-20,-20,-30,-40,-50, -30,-20,-10,0,0,-10,-20,-30, -30,-10,20,30,30,20,-10,-30, -30,-10,30,40,40,30,-10,-30,
                -30,-10,30,40,40,30,-10,-30, -30,-10,20,30,30,20,-10,-30, -30,-30,0,0,0,0,-30,-30, -50,-30,-30,-30,-30,-30,-30,-50];
  var pawnEg = [0,0,0,0,0,0,0,0, 90,90,90,90,90,90,90,90, 50,50,50,50,50,50,50,50, 30,30,30,30,30,30,30,30,
                15,15,15,15,15,15,15,15, 5,5,5,5,5,5,5,5, 0,0,0,0,0,0,0,0, 0,0,0,0,0,0,0,0];
  for (var t = 1; t <= 6; t++) {
    PST_MG[t] = new Int16Array(128); PST_EG[t] = new Int16Array(128);
    PST_MG[t + 8] = new Int16Array(128); PST_EG[t + 8] = new Int16Array(128);
    for (var r = 0; r < 8; r++) {
      for (var c = 0; c < 8; c++) {
        var sq = r * 16 + c, mir = (7 - r) * 16 + c, idx = r * 8 + c;
        var m = mg[t][idx], e = t === KING ? kingEg[idx] : t === PAWN ? pawnEg[idx] : mg[t][idx];
        PST_MG[t][sq] = m; PST_EG[t][sq] = e;
        PST_MG[t + 8][mir] = m; PST_EG[t + 8][mir] = e;
      }
    }
  }
})();

/* ------------------------------------------------------------ holat */

function sqName(sq) { return "abcdefgh".charAt(sq & 7) + (8 - (sq >> 4)); }
function sqOf(name) { return (8 - parseInt(name.charAt(1), 10)) * 16 + "abcdefgh".indexOf(name.charAt(0)); }

function hashAll() {
  h1 = 0; h2 = 0;
  for (var sq = 0; sq < 128; sq++) {
    if (sq & 0x88) { sq += 7; continue; }
    var p = board[sq];
    if (p) { h1 ^= Z1[p][sq]; h2 ^= Z2[p][sq]; }
  }
  if (side) { h1 ^= ZS1; h2 ^= ZS2; }
  h1 ^= ZC1[castle]; h2 ^= ZC2[castle];
  if (ep >= 0) { h1 ^= ZE1[ep]; h2 ^= ZE2[ep]; }
}

function setFen(fen) {
  var parts = fen.split(/\s+/), rows = parts[0].split("/");
  board.fill(0);
  var map = { p: PAWN, n: KNIGHT, b: BISHOP, r: ROOK, q: QUEEN, k: KING };
  for (var r = 0; r < 8; r++) {
    var c = 0;
    for (var i = 0; i < rows[r].length; i++) {
      var ch = rows[r].charAt(i);
      if (/\d/.test(ch)) { c += +ch; continue; }
      var t = map[ch.toLowerCase()], col = ch === ch.toLowerCase() ? BLACK : WHITE;
      board[r * 16 + c] = t | col;
      if (t === KING) { kingSq[col ? 1 : 0] = r * 16 + c; }
      c++;
    }
  }
  side = parts[1] === "b" ? BLACK : WHITE;
  var cs = parts[2] || "-";
  castle = (cs.indexOf("K") > -1 ? 1 : 0) | (cs.indexOf("Q") > -1 ? 2 : 0) | (cs.indexOf("k") > -1 ? 4 : 0) | (cs.indexOf("q") > -1 ? 8 : 0);
  ep = parts[3] && parts[3] !== "-" ? sqOf(parts[3]) : -1;
  half = parseInt(parts[4] || "0", 10) || 0;
  stack = [];
  hashAll();
  hist = [key()];
}

var START = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

/* ------------------------------------------------------------ hujum */

function attacked(sq, by) {
  var i, t, p;
  // piyoda
  if (by === WHITE) {
    t = sq + 15; if (!(t & 0x88) && board[t] === PAWN) return true;
    t = sq + 17; if (!(t & 0x88) && board[t] === PAWN) return true;
  } else {
    t = sq - 15; if (!(t & 0x88) && board[t] === (PAWN | BLACK)) return true;
    t = sq - 17; if (!(t & 0x88) && board[t] === (PAWN | BLACK)) return true;
  }
  for (i = 0; i < 8; i++) {
    t = sq + KN[i]; if (!(t & 0x88) && board[t] === (KNIGHT | by)) return true;
    t = sq + KI[i]; if (!(t & 0x88) && board[t] === (KING | by)) return true;
  }
  for (i = 0; i < 4; i++) {
    t = sq + BI[i];
    while (!(t & 0x88)) {
      p = board[t];
      if (p) { if (p === (BISHOP | by) || p === (QUEEN | by)) return true; break; }
      t += BI[i];
    }
    t = sq + RO[i];
    while (!(t & 0x88)) {
      p = board[t];
      if (p) { if (p === (ROOK | by) || p === (QUEEN | by)) return true; break; }
      t += RO[i];
    }
  }
  return false;
}

function inCheck() { return attacked(kingSq[side ? 1 : 0], side ^ BLACK); }

/* ------------------------------------------------------------ yurishlar
   Kod: from | to<<7 | promo<<14 | flag<<18  (flag: 1 ikki qadam, 2 en passant, 4 rokirovka) */

function mv(from, to, promo, flag) { return from | (to << 7) | (promo << 14) | (flag << 18); }

function gen(list, capsOnly) {
  var us = side, them = side ^ BLACK, i, d, t, p;
  for (var sq = 0; sq < 128; sq++) {
    if (sq & 0x88) { sq += 7; continue; }
    p = board[sq];
    if (!p || (p & BLACK) !== us) continue;
    var type = p & 7;
    if (type === PAWN) {
      var dir = us ? 16 : -16, startRank = us ? 1 : 6, lastRank = us ? 7 : 0;
      t = sq + dir;
      if (!(t & 0x88) && !board[t]) {
        if ((t >> 4) === lastRank) {
          list.push(mv(sq, t, QUEEN, 0));
          if (!capsOnly) { list.push(mv(sq, t, KNIGHT, 0), mv(sq, t, ROOK, 0), mv(sq, t, BISHOP, 0)); }
        } else if (!capsOnly) {
          list.push(mv(sq, t, 0, 0));
          if ((sq >> 4) === startRank && !board[t + dir]) list.push(mv(sq, t + dir, 0, 1));
        }
      }
      for (i = -1; i <= 1; i += 2) {
        t = sq + dir + i;
        if (t & 0x88) continue;
        if (board[t] && (board[t] & BLACK) === them) {
          if ((t >> 4) === lastRank) {
            list.push(mv(sq, t, QUEEN, 0));
            if (!capsOnly) { list.push(mv(sq, t, KNIGHT, 0), mv(sq, t, ROOK, 0), mv(sq, t, BISHOP, 0)); }
          } else list.push(mv(sq, t, 0, 0));
        } else if (t === ep) list.push(mv(sq, t, 0, 2));
      }
    } else if (type === KNIGHT || type === KING) {
      var offs = type === KNIGHT ? KN : KI;
      for (i = 0; i < 8; i++) {
        t = sq + offs[i];
        if (t & 0x88) continue;
        if (!board[t]) { if (!capsOnly) list.push(mv(sq, t, 0, 0)); }
        else if ((board[t] & BLACK) === them) list.push(mv(sq, t, 0, 0));
      }
      if (type === KING && !capsOnly) {
        if (us === WHITE && sq === 0x74) {
          if ((castle & 1) && !board[0x75] && !board[0x76] && board[0x77] === ROOK &&
              !attacked(0x74, them) && !attacked(0x75, them) && !attacked(0x76, them)) list.push(mv(sq, 0x76, 0, 4));
          if ((castle & 2) && !board[0x73] && !board[0x72] && !board[0x71] && board[0x70] === ROOK &&
              !attacked(0x74, them) && !attacked(0x73, them) && !attacked(0x72, them)) list.push(mv(sq, 0x72, 0, 4));
        } else if (us === BLACK && sq === 0x04) {
          if ((castle & 4) && !board[0x05] && !board[0x06] && board[0x07] === (ROOK | BLACK) &&
              !attacked(0x04, them) && !attacked(0x05, them) && !attacked(0x06, them)) list.push(mv(sq, 0x06, 0, 4));
          if ((castle & 8) && !board[0x03] && !board[0x02] && !board[0x01] && board[0x00] === (ROOK | BLACK) &&
              !attacked(0x04, them) && !attacked(0x03, them) && !attacked(0x02, them)) list.push(mv(sq, 0x02, 0, 4));
        }
      }
    } else {
      var dirs = type === BISHOP ? BI : type === ROOK ? RO : KI;
      for (i = 0; i < dirs.length; i++) {
        d = dirs[i]; t = sq + d;
        while (!(t & 0x88)) {
          if (!board[t]) { if (!capsOnly) list.push(mv(sq, t, 0, 0)); }
          else { if ((board[t] & BLACK) === them) list.push(mv(sq, t, 0, 0)); break; }
          t += d;
        }
      }
    }
  }
  return list;
}

function put(sq, p) { board[sq] = p; h1 ^= Z1[p][sq]; h2 ^= Z2[p][sq]; }
function take(sq) { var p = board[sq]; board[sq] = 0; h1 ^= Z1[p][sq]; h2 ^= Z2[p][sq]; return p; }

// Yurishni qo'llaydi. O'z shohi xavf ostida qolsa - qaytaradi va false.
function make(m) {
  var from = m & 127, to = (m >> 7) & 127, promo = (m >> 14) & 15, flag = (m >> 18) & 7;
  var piece = board[from], capSq = to, cap = board[to];
  if (flag === 2) { capSq = to + (side ? -16 : 16); cap = board[capSq]; }
  stack.push({ m: m, cap: cap, capSq: capSq, castle: castle, ep: ep, half: half, h1: h1, h2: h2 });
  if (cap) take(capSq);
  take(from);
  put(to, promo ? (promo | side) : piece);
  if (flag === 4) {
    if (to === from + 2) put(from + 1, take(from + 3));
    else put(from - 1, take(from - 4));
  }
  if ((piece & 7) === KING) kingSq[side ? 1 : 0] = to;
  h1 ^= ZC1[castle]; h2 ^= ZC2[castle];
  castle &= CMASK[from] & CMASK[to];
  h1 ^= ZC1[castle]; h2 ^= ZC2[castle];
  if (ep >= 0) { h1 ^= ZE1[ep]; h2 ^= ZE2[ep]; }
  ep = flag === 1 ? (from + to) >> 1 : -1;
  if (ep >= 0) { h1 ^= ZE1[ep]; h2 ^= ZE2[ep]; }
  half = (cap || (piece & 7) === PAWN) ? 0 : half + 1;
  side ^= BLACK; h1 ^= ZS1; h2 ^= ZS2;
  hist.push(key());
  if (attacked(kingSq[side ? 0 : 1], side)) { unmake(); return false; }
  return true;
}

function unmake() {
  var u = stack.pop(), m = u.m;
  var from = m & 127, to = (m >> 7) & 127, promo = (m >> 14) & 15, flag = (m >> 18) & 7;
  side ^= BLACK;
  var piece = board[to];
  board[to] = 0;
  board[from] = promo ? (PAWN | side) : piece;
  if (flag === 4) {
    if (to === from + 2) { board[from + 3] = board[from + 1]; board[from + 1] = 0; }
    else { board[from - 4] = board[from - 1]; board[from - 1] = 0; }
  }
  if (u.cap) board[u.capSq] = u.cap;
  if ((board[from] & 7) === KING) kingSq[side ? 1 : 0] = from;
  castle = u.castle; ep = u.ep; half = u.half; h1 = u.h1; h2 = u.h2;
  hist.pop();
}

function makeNull() {
  stack.push({ m: 0, ep: ep, h1: h1, h2: h2, half: half });
  if (ep >= 0) { h1 ^= ZE1[ep]; h2 ^= ZE2[ep]; }
  ep = -1;
  side ^= BLACK; h1 ^= ZS1; h2 ^= ZS2;
  hist.push(key());
}

function unmakeNull() {
  var u = stack.pop();
  side ^= BLACK; ep = u.ep; h1 = u.h1; h2 = u.h2; half = u.half;
  hist.pop();
}

function uci(m) {
  var promo = (m >> 14) & 15;
  return sqName(m & 127) + sqName((m >> 7) & 127) + (promo ? " pnbrqk".charAt(promo) : "");
}

function legalMoves() {
  var out = [], list = gen([], false);
  for (var i = 0; i < list.length; i++) { if (make(list[i])) { out.push(list[i]); unmake(); } }
  return out;
}

function playUci(s) {
  var list = legalMoves();
  for (var i = 0; i < list.length; i++) {
    if (uci(list[i]) === s || (uci(list[i]) === s + "q" && s.length === 4)) { make(list[i]); return true; }
  }
  return false;
}

/* ------------------------------------------------------------ baho */

function evaluate() {
  var mg = [0, 0], eg = [0, 0], phase = 0, bishops = [0, 0];
  var pawnFiles = [new Int8Array(8), new Int8Array(8)];
  for (var sq = 0; sq < 128; sq++) {
    if (sq & 0x88) { sq += 7; continue; }
    var p = board[sq];
    if (!p) continue;
    var t = p & 7, c = p & BLACK ? 1 : 0;
    mg[c] += VAL[t] + PST_MG[p][sq];
    eg[c] += VAL[t] + PST_EG[p][sq];
    phase += PHASE[t];
    if (t === BISHOP) bishops[c]++;
    if (t === PAWN) pawnFiles[c][sq & 7]++;
  }
  for (var k = 0; k < 2; k++) {
    if (bishops[k] >= 2) { mg[k] += 30; eg[k] += 45; }
    for (var f = 0; f < 8; f++) {
      if (pawnFiles[k][f] > 1) { mg[k] -= 12 * (pawnFiles[k][f] - 1); eg[k] -= 18 * (pawnFiles[k][f] - 1); }
    }
  }
  if (phase > 24) phase = 24;
  var score = ((mg[0] - mg[1]) * phase + (eg[0] - eg[1]) * (24 - phase)) / 24;
  return (side ? -score : score) | 0;
}

/* ------------------------------------------------------------ qidiruv */

var TT = new Map();
var killers = [], historyTab = new Int32Array(128 * 128);
var nodes = 0, deadline = 0, stopped = false, rootBest = 0;

function repetition() {
  var k = hist[hist.length - 1];
  for (var i = hist.length - 3; i >= 0 && i >= hist.length - 1 - half; i -= 2) {
    if (hist[i] === k) return true;
  }
  return false;
}

function scoreMoves(list, ttMove, ply) {
  var sc = new Int32Array(list.length);
  var k0 = killers[ply * 2] || 0, k1 = killers[ply * 2 + 1] || 0;
  for (var i = 0; i < list.length; i++) {
    var m = list[i], to = (m >> 7) & 127, from = m & 127, cap = board[to], promo = (m >> 14) & 15;
    if (m === ttMove) sc[i] = 10000000;
    else if (cap || ((m >> 18) & 7) === 2) sc[i] = 1000000 + VAL[cap & 7 || PAWN] * 10 - VAL[board[from] & 7];
    else if (promo) sc[i] = 900000 + VAL[promo];
    else if (m === k0) sc[i] = 800000;
    else if (m === k1) sc[i] = 790000;
    else sc[i] = historyTab[from * 128 + to];
  }
  return sc;
}

function pick(list, sc, i) {
  var best = i;
  for (var j = i + 1; j < list.length; j++) if (sc[j] > sc[best]) best = j;
  if (best !== i) {
    var t = list[i]; list[i] = list[best]; list[best] = t;
    var s = sc[i]; sc[i] = sc[best]; sc[best] = s;
  }
  return list[i];
}

function timeUp() {
  if ((nodes & 2047) === 0 && Date.now() > deadline) stopped = true;
  return stopped;
}

function quiesce(alpha, beta, ply) {
  nodes++;
  if (timeUp()) return 0;
  var stand = evaluate();
  if (stand >= beta) return beta;
  if (stand > alpha) alpha = stand;
  if (ply > 60) return stand;
  var list = gen([], true), sc = scoreMoves(list, 0, 63);
  for (var i = 0; i < list.length; i++) {
    var m = pick(list, sc, i);
    var cap = board[(m >> 7) & 127];
    if (cap && stand + VAL[cap & 7] + 200 < alpha && !((m >> 14) & 15)) continue;   // behuda urish
    if (!make(m)) continue;
    var score = -quiesce(-beta, -alpha, ply + 1);
    unmake();
    if (stopped) return 0;
    if (score >= beta) return beta;
    if (score > alpha) alpha = score;
  }
  return alpha;
}

function hasPieces() {
  for (var sq = 0; sq < 128; sq++) {
    if (sq & 0x88) { sq += 7; continue; }
    var p = board[sq];
    if (p && (p & BLACK) === side && (p & 7) !== PAWN && (p & 7) !== KING) return true;
  }
  return false;
}

function search(depth, alpha, beta, ply, allowNull) {
  if (timeUp()) return 0;
  if (ply > 0 && (half >= 100 || repetition())) return 0;
  var check = inCheck();
  if (check) depth++;
  if (depth <= 0) return quiesce(alpha, beta, ply);
  nodes++;

  var k = key(), e = TT.get(k), ttMove = 0;
  if (e) {
    ttMove = e.m;
    if (ply > 0 && e.d >= depth) {
      var ts = e.s;
      if (ts > MATE - 1000) ts -= ply; else if (ts < -MATE + 1000) ts += ply;
      if (e.f === 0) return ts;
      if (e.f === 1 && ts >= beta) return ts;
      if (e.f === 2 && ts <= alpha) return ts;
    }
  }

  if (allowNull && !check && depth >= 3 && ply > 0 && beta < MATE - 1000 && hasPieces() && evaluate() >= beta) {
    makeNull();
    var ns = -search(depth - 3, -beta, -beta + 1, ply + 1, false);
    unmakeNull();
    if (stopped) return 0;
    if (ns >= beta) return beta;
  }

  var list = gen([], false), sc = scoreMoves(list, ttMove, ply);
  var legal = 0, best = -INF, bestMove = 0, alpha0 = alpha;
  for (var i = 0; i < list.length; i++) {
    var m = pick(list, sc, i);
    var quiet = !board[(m >> 7) & 127] && !((m >> 14) & 15) && ((m >> 18) & 7) !== 2;
    if (!make(m)) continue;
    legal++;
    var score;
    if (legal === 1) {
      score = -search(depth - 1, -beta, -alpha, ply + 1, true);
    } else {
      var red = (depth >= 3 && legal > 4 && quiet && !check && !inCheck()) ? 1 : 0;
      score = -search(depth - 1 - red, -alpha - 1, -alpha, ply + 1, true);
      if (score > alpha && (red || score < beta)) score = -search(depth - 1, -beta, -alpha, ply + 1, true);
    }
    unmake();
    if (stopped) return 0;
    if (score > best) {
      best = score; bestMove = m;
      if (ply === 0) rootBest = m;
      if (score > alpha) {
        alpha = score;
        if (score >= beta) {
          if (quiet) {
            if (killers[ply * 2] !== m) { killers[ply * 2 + 1] = killers[ply * 2]; killers[ply * 2] = m; }
            historyTab[(m & 127) * 128 + ((m >> 7) & 127)] += depth * depth;
          }
          break;
        }
      }
    }
  }
  if (!legal) return check ? -MATE + ply : 0;

  var st = best;
  if (st > MATE - 1000) st += ply; else if (st < -MATE + 1000) st -= ply;
  if (TT.size > 600000) TT.clear();
  TT.set(k, { d: depth, s: st, f: best >= beta ? 1 : best <= alpha0 ? 2 : 0, m: bestMove });
  return best;
}

// Har bir yurishni alohida baholash (osonroq darajalar uchun - "xato" qilishi kerak).
function rootScores(depth) {
  var list = legalMoves(), out = [];
  for (var i = 0; i < list.length; i++) {
    make(list[i]);
    var s = -search(depth - 1, -INF, INF, 1, true);
    unmake();
    if (stopped) break;
    out.push({ m: list[i], s: s });
  }
  return out;
}

function gauss() { return (Math.random() + Math.random() + Math.random() + Math.random() - 2) / 0.58; }

var LEVELS = {
  easy: { depth: 2, noise: 170, random: 0.12, time: 250 },
  med: { depth: 4, noise: 40, random: 0, time: 700 },
  hard: { depth: 64, noise: 0, random: 0, time: 1500 }
};

function think(level, timeMs) {
  var L = LEVELS[level] || LEVELS.med;
  nodes = 0; stopped = false;
  deadline = Date.now() + Math.max(80, Math.min(timeMs || L.time, L.time));
  killers = []; historyTab.fill(0);
  var legal = legalMoves();
  if (!legal.length) return null;
  if (legal.length === 1) return { m: legal[0], depth: 0, score: 0 };

  if (L.noise) {
    if (Math.random() < L.random) return { m: legal[Math.floor(Math.random() * legal.length)], depth: 0, score: 0 };
    var best = null;
    for (var d = 1; d <= L.depth; d++) {
      var sc = rootScores(d);
      if (stopped && best) break;
      if (sc.length === legal.length || !best) best = { list: sc, depth: d };
      if (stopped) break;
    }
    var pickM = best.list[0], pickS = -INF;
    for (var i = 0; i < best.list.length; i++) {
      var s = best.list[i].s + gauss() * L.noise;
      if (s > pickS) { pickS = s; pickM = best.list[i]; }
    }
    return { m: pickM.m, depth: best.depth, score: pickM.s };
  }

  var bestMove = legal[0], bestScore = 0, done = 0;
  for (var depth = 1; depth <= L.depth; depth++) {
    rootBest = 0;
    var score = search(depth, -INF, INF, 0, false);
    // Vaqt tugasa: chala chuqurlikda ham to'liq ko'rilgan eng yaxshi yurish
    // ishonchli (avvalgi eng yaxshisi birinchi ko'riladi).
    if (stopped) { if (rootBest) bestMove = rootBest; break; }
    if (rootBest) bestMove = rootBest;
    bestScore = score; done = depth;
    if (Math.abs(score) > MATE - 1000) break;
  }
  return { m: bestMove, depth: done, score: bestScore };
}

function perft(depth) {
  if (depth === 0) return 1;
  var list = gen([], false), n = 0;
  for (var i = 0; i < list.length; i++) {
    if (!make(list[i])) continue;
    n += perft(depth - 1);
    unmake();
  }
  return n;
}

self.onmessage = function (e) {
  var d = e.data || {};
  if (d.cmd === "move") {
    setFen(START);
    var ok = true;
    for (var i = 0; i < (d.moves || []).length && ok; i++) ok = playUci(d.moves[i]);
    var res = ok ? think(d.level, d.time) : null;
    self.postMessage({ id: d.id, uci: res && res.m ? uci(res.m) : null, depth: res ? res.depth : 0,
                       score: res ? res.score : 0, nodes: nodes, ok: ok });
  } else if (d.cmd === "perft") {
    setFen(d.fen || START);
    var t = Date.now(), n = perft(d.depth);
    self.postMessage({ id: d.id, nodes: n, ms: Date.now() - t });
  }
};
