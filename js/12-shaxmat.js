/* Sehrgar shaxmati
   Ilova kodi bir necha faylga bo'lingan; hammasi BIR umumiy maydonda ishlaydi
   va index.html dagi TARTIBDA yuklanadi. Yuklanish paytida keyingi fayldagi
   narsani chaqirmang - tekshiruv: tools/tartib.js */
"use strict";
  var CHESS_SVGS = {
    P: '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 45 45"><g id="white-pawn" class="white pawn"><path d="M22.5 9c-2.21 0-4 1.79-4 4 0 .89.29 1.71.78 2.38C17.33 16.5 16 18.59 16 21c0 2.03.94 3.84 2.41 5.03-3 1.06-7.41 5.55-7.41 13.47h23c0-7.92-4.41-12.41-7.41-13.47 1.47-1.19 2.41-3 2.41-5.03 0-2.41-1.33-4.5-3.28-5.62.49-.67.78-1.49.78-2.38 0-2.21-1.79-4-4-4z" fill="#fff" stroke="#000" stroke-width="1.5" stroke-linecap="round" /></g></svg>',
    N: '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 45 45"><g id="white-knight" class="white knight" fill="none" fill-rule="evenodd" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M 22,10 C 32.5,11 38.5,18 38,39 L 15,39 C 15,30 25,32.5 23,18" style="fill:#ffffff; stroke:#000000;" /><path d="M 24,18 C 24.38,20.91 18.45,25.37 16,27 C 13,29 13.18,31.34 11,31 C 9.958,30.06 12.41,27.96 11,28 C 10,28 11.19,29.23 10,30 C 9,30 5.997,31 6,26 C 6,24 12,14 12,14 C 12,14 13.89,12.1 14,10.5 C 13.27,9.506 13.5,8.5 13.5,7.5 C 14.5,6.5 16.5,10 16.5,10 L 18.5,10 C 18.5,10 19.28,8.008 21,7 C 22,7 22,10 22,10" style="fill:#ffffff; stroke:#000000;" /><path d="M 9.5 25.5 A 0.5 0.5 0 1 1 8.5,25.5 A 0.5 0.5 0 1 1 9.5 25.5 z" style="fill:#000000; stroke:#000000;" /><path d="M 15 15.5 A 0.5 1.5 0 1 1 14,15.5 A 0.5 1.5 0 1 1 15 15.5 z" transform="matrix(0.866,0.5,-0.5,0.866,9.693,-5.173)" style="fill:#000000; stroke:#000000;" /></g></svg>',
    B: '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 45 45"><g id="white-bishop" class="white bishop" fill="none" fill-rule="evenodd" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><g fill="#fff" stroke-linecap="butt"><path d="M9 36c3.39-.97 10.11.43 13.5-2 3.39 2.43 10.11 1.03 13.5 2 0 0 1.65.54 3 2-.68.97-1.65.99-3 .5-3.39-.97-10.11.46-13.5-1-3.39 1.46-10.11.03-13.5 1-1.354.49-2.323.47-3-.5 1.354-1.94 3-2 3-2zM15 32c2.5 2.5 12.5 2.5 15 0 .5-1.5 0-2 0-2 0-2.5-2.5-4-2.5-4 5.5-1.5 6-11.5-5-15.5-11 4-10.5 14-5 15.5 0 0-2.5 1.5-2.5 4 0 0-.5.5 0 2zM25 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 1 1 5 0z" /></g><path d="M17.5 26h10M15 30h15m-7.5-14.5v5M20 18h5" stroke-linejoin="miter" /></g></svg>',
    R: '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 45 45"><g id="white-rook" class="white rook" fill="#fff" fill-rule="evenodd" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 39h27v-3H9v3zM12 36v-4h21v4H12zM11 14V9h4v2h5V9h5v2h5V9h4v5" stroke-linecap="butt" /><path d="M34 14l-3 3H14l-3-3" /><path d="M31 17v12.5H14V17" stroke-linecap="butt" stroke-linejoin="miter" /><path d="M31 29.5l1.5 2.5h-20l1.5-2.5" /><path d="M11 14h23" fill="none" stroke-linejoin="miter" /></g></svg>',
    Q: '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 45 45"><g id="white-queen" class="white queen" fill="#fff" fill-rule="evenodd" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8 12a2 2 0 1 1-4 0 2 2 0 1 1 4 0zM24.5 7.5a2 2 0 1 1-4 0 2 2 0 1 1 4 0zM41 12a2 2 0 1 1-4 0 2 2 0 1 1 4 0zM16 8.5a2 2 0 1 1-4 0 2 2 0 1 1 4 0zM33 9a2 2 0 1 1-4 0 2 2 0 1 1 4 0z" /><path d="M9 26c8.5-1.5 21-1.5 27 0l2-12-7 11V11l-5.5 13.5-3-15-3 15-5.5-14V25L7 14l2 12zM9 26c0 2 1.5 2 2.5 4 1 1.5 1 1 .5 3.5-1.5 1-1.5 2.5-1.5 2.5-1.5 1.5.5 2.5.5 2.5 6.5 1 16.5 1 23 0 0 0 1.5-1 0-2.5 0 0 .5-1.5-1-2.5-.5-2.5-.5-2 .5-3.5 1-2 2.5-2 2.5-4-8.5-1.5-18.5-1.5-27 0z" stroke-linecap="butt" /><path d="M11.5 30c3.5-1 18.5-1 22 0M12 33.5c6-1 15-1 21 0" fill="none" /></g></svg>',
    K: '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 45 45"><g id="white-king" class="white king" fill="none" fill-rule="evenodd" stroke="#000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22.5 11.63V6M20 8h5" stroke-linejoin="miter" /><path d="M22.5 25s4.5-7.5 3-10.5c0 0-1-2.5-3-2.5s-3 2.5-3 2.5c-1.5 3 3 10.5 3 10.5" fill="#fff" stroke-linecap="butt" stroke-linejoin="miter" /><path d="M11.5 37c5.5 3.5 15.5 3.5 21 0v-7s9-4.5 6-10.5c-4-6.5-13.5-3.5-16 4V27v-3.5c-3.5-7.5-13-10.5-16-4-3 6 5 10 5 10V37z" fill="#fff" /><path d="M11.5 30c5.5-3 15.5-3 21 0m-21 3.5c5.5-3 15.5-3 21 0m-21 3.5c5.5-3 15.5-3 21 0" /></g></svg>',
  };

  function getPieceSVG(p, style) {
    if (!p) return "";
    var svg = CHESS_SVGS[p.toUpperCase()] || "";
    var paint = PIECE_PAINT[style || chessPieceStyle()][p === p.toUpperCase() ? "w" : "b"];
    svg = svg.replace(/#(?:ffffff|fff)\b/g, "@B@").replace(/#(?:000000|000)\b/g, paint[1]).replace(/@B@/g, paint[0]);
    return svg.replace("<svg ", '<svg width="100%" height="100%" style="display:block" ');
  }

  // Donalar qiymati (bot baholashi uchun). Ilgari bu jadval yo'q edi va
  // "o'rta" / "qiyin" bot birinchi yurishdayoq xatoga uchrab to'xtab qolardi.
  var CHESS_PIECES = (function () {
    var v = { P: 100, N: 320, B: 330, R: 500, Q: 900, K: 20000 }, out = {};
    for (var k in v) { out[k] = { val: v[k] }; out[k.toLowerCase()] = { val: v[k] }; }
    return out;
  })();

  var PST = {
    P: [
      [0,  0,  0,  0,  0,  0,  0,  0],
      [50, 50, 50, 50, 50, 50, 50, 50],
      [10, 10, 20, 30, 30, 20, 10, 10],
      [5,  5, 10, 25, 25, 10,  5,  5],
      [0,  0,  0, 20, 20,  0,  0,  0],
      [5, -5,-10,  0,  0,-10, -5,  5],
      [5, 10, 10,-20,-20, 10, 10,  5],
      [0,  0,  0,  0,  0,  0,  0,  0]
    ],
    N: [
      [-50,-40,-30,-30,-30,-30,-40,-50],
      [-40,-20,  0,  0,  0,  0,-20,-40],
      [-30,  0, 10, 15, 15, 10,  0,-30],
      [-30,  5, 15, 20, 20, 15,  5,-30],
      [-30,  0, 15, 20, 20, 15,  0,-30],
      [-30,  5, 10, 15, 15, 10,  5,-30],
      [-40,-20,  0,  5,  5,  0,-20,-40],
      [-50,-40,-30,-30,-30,-30,-40,-50]
    ],
    B: [
      [-20,-10,-10,-10,-10,-10,-10,-20],
      [-10,  0,  0,  0,  0,  0,  0,-10],
      [-10,  0,  5, 10, 10,  5,  0,-10],
      [-10,  5,  5, 10, 10,  5,  5,-10],
      [-10,  0, 10, 10, 10, 10,  0,-10],
      [-10, 10, 10, 10, 10, 10, 10,-10],
      [-10,  5,  0,  0,  0,  0,  5,-10],
      [-20,-10,-10,-10,-10,-10,-10,-20]
    ],
    R: [
      [0,  0,  0,  0,  0,  0,  0,  0],
      [5, 10, 10, 10, 10, 10, 10,  5],
      [-5,  0,  0,  0,  0,  0,  0, -5],
      [-5,  0,  0,  0,  0,  0,  0, -5],
      [-5,  0,  0,  0,  0,  0,  0, -5],
      [-5,  0,  0,  0,  0,  0,  0, -5],
      [-5,  0,  0,  0,  0,  0,  0, -5],
      [0,  0,  0,  5,  5,  0,  0,  0]
    ],
    Q: [
      [-20,-10,-10, -5, -5,-10,-10,-20],
      [-10,  0,  0,  0,  0,  0,  0,-10],
      [-10,  0,  5,  5,  5,  5,  0,-10],
      [-5,  0,  5,  5,  5,  5,  0, -5],
      [0,  0,  5,  5,  5,  5,  0, -5],
      [-10,  5,  5,  5,  5,  5,  0,-10],
      [-10,  0,  5,  0,  0,  0,  0,-10],
      [-20,-10,-10, -5, -5,-10,-10,-20]
    ],
    K: [
      [-30,-40,-40,-50,-50,-40,-40,-30],
      [-30,-40,-40,-50,-50,-40,-40,-30],
      [-30,-40,-40,-50,-50,-40,-40,-30],
      [-30,-40,-40,-50,-50,-40,-40,-30],
      [-20,-30,-30,-40,-40,-30,-20,-20],
      [-10,-20,-20,-20,-20,-20,-10,-10],
      [20, 20,  0,  0,  0,  0, 20, 20],
      [20, 30, 10,  0,  0, 10, 30, 20]
    ]
  };

  var chessState = {
    board: [],
    turn: "w", // "w" or "b"
    castling: { wK: true, wQ: true, bK: true, bQ: true },
    ep: null,
    history: [],
    selectedSq: null,
    legalMoves: [],
    lastMove: null,
    gameMode: "bot", // "bot" or "pvp"
    botDiff: "easy",
    myColor: "w",
    pvpGameId: null,
    whiteTime: 300,
    blackTime: 300,
    clockTimer: null,
    pollTimer: null,
    gameOver: false
  };

  function initChessEngine() {
    chessState.board = [
      ["r","n","b","q","k","b","n","r"],
      ["p","p","p","p","p","p","p","p"],
      [null,null,null,null,null,null,null,null],
      [null,null,null,null,null,null,null,null],
      [null,null,null,null,null,null,null,null],
      [null,null,null,null,null,null,null,null],
      ["P","P","P","P","P","P","P","P"],
      ["R","N","B","Q","K","B","N","R"]
    ];
    chessState.turn = "w";
    chessState.castling = { wK: true, wQ: true, bK: true, bQ: true };
    chessState.ep = null;
    chessState.history = [];
    chessState.selectedSq = null;
    chessState.legalMoves = [];
    chessState.lastMove = null;
    chessState.whiteTime = 300;
    chessState.blackTime = 300;
    chessState.gameOver = false;
    chessState.halfmove = 0;
    chessState.seen = {};
    chessState.seen[posKey()] = 1;
    chessState.sans = [];
    chessState.ucis = [];
    chessState.hist = [{ board: cloneBoard(chessState.board), last: null, turn: "w" }];
  }

  function cloneBoard(b) {
    return b.map(function(r) { return r.slice(); });
  }

  function isWhitePiece(p) { return p && p === p.toUpperCase(); }
  function getPieceColor(p) { if (!p) return null; return isWhitePiece(p) ? "w" : "b"; }

  function isSquareAttacked(board, r, c, byColor) {
    // Knight attacks
    var knightDeltas = [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]];
    var targetKnight = (byColor === "w" ? "N" : "n");
    for (var i = 0; i < knightDeltas.length; i++) {
      var nr = r + knightDeltas[i][0], nc = c + knightDeltas[i][1];
      if (nr >= 0 && nr < 8 && nc >= 0 && nc < 8 && board[nr][nc] === targetKnight) return true;
    }

    // Pawn attacks
    var pawnDir = (byColor === "w" ? 1 : -1);
    var targetPawn = (byColor === "w" ? "P" : "p");
    if (r + pawnDir >= 0 && r + pawnDir < 8) {
      if (c - 1 >= 0 && board[r + pawnDir][c - 1] === targetPawn) return true;
      if (c + 1 < 8 && board[r + pawnDir][c + 1] === targetPawn) return true;
    }

    // King attacks
    var kingDeltas = [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]];
    var targetKing = (byColor === "w" ? "K" : "k");
    for (var k = 0; k < kingDeltas.length; k++) {
      var kr = r + kingDeltas[k][0], kc = c + kingDeltas[k][1];
      if (kr >= 0 && kr < 8 && kc >= 0 && kc < 8 && board[kr][kc] === targetKing) return true;
    }

    // Straight (Rook/Queen)
    var straights = [[-1,0],[1,0],[0,-1],[0,1]];
    var targetR = (byColor === "w" ? "R" : "r"), targetQ = (byColor === "w" ? "Q" : "q");
    for (var s = 0; s < straights.length; s++) {
      var sr = r + straights[s][0], sc = c + straights[s][1];
      while (sr >= 0 && sr < 8 && sc >= 0 && sc < 8) {
        var p = board[sr][sc];
        if (p) {
          if (p === targetR || p === targetQ) return true;
          break;
        }
        sr += straights[s][0]; sc += straights[s][1];
      }
    }

    // Diagonal (Bishop/Queen)
    var diags = [[-1,-1],[-1,1],[1,-1],[1,1]];
    var targetB = (byColor === "w" ? "B" : "b");
    for (var d = 0; d < diags.length; d++) {
      var dr = r + diags[d][0], dc = c + diags[d][1];
      while (dr >= 0 && dr < 8 && dc >= 0 && dc < 8) {
        var dp = board[dr][dc];
        if (dp) {
          if (dp === targetB || dp === targetQ) return true;
          break;
        }
        dr += diags[d][0]; dc += diags[d][1];
      }
    }

    return false;
  }

  function findKing(board, color) {
    var target = (color === "w" ? "K" : "k");
    for (var r = 0; r < 8; r++) {
      for (var c = 0; c < 8; c++) {
        if (board[r][c] === target) return { r: r, c: c };
      }
    }
    return null;
  }

  function isKingInCheck(board, color) {
    var kp = findKing(board, color);
    if (!kp) return false;
    var opp = (color === "w" ? "b" : "w");
    return isSquareAttacked(board, kp.r, kp.c, opp);
  }

  function getRawMoves(board, r, c, castling, ep) {
    var p = board[r][c];
    if (!p) return [];
    var color = isWhitePiece(p) ? "w" : "b";
    var moves = [];
    var type = p.toUpperCase();

    if (type === "P") {
      var dir = (color === "w" ? -1 : 1);
      var startRow = (color === "w" ? 6 : 1);
      // 1 step forward
      if (r + dir >= 0 && r + dir < 8 && !board[r + dir][c]) {
        moves.push({ from: { r: r, c: c }, to: { r: r + dir, c: c } });
        // 2 steps forward
        if (r === startRow && !board[r + dir * 2][c]) {
          moves.push({ from: { r: r, c: c }, to: { r: r + dir * 2, c: c }, isDoublePawn: true });
        }
      }
      // Captures
      var capCols = [c - 1, c + 1];
      for (var i = 0; i < capCols.length; i++) {
        var cc = capCols[i];
        if (cc >= 0 && cc < 8 && r + dir >= 0 && r + dir < 8) {
          var target = board[r + dir][cc];
          if (target && getPieceColor(target) !== color) {
            moves.push({ from: { r: r, c: c }, to: { r: r + dir, c: cc } });
          } else if (ep && ep.r === r + dir && ep.c === cc) {
            moves.push({ from: { r: r, c: c }, to: { r: r + dir, c: cc }, isEnPassant: true });
          }
        }
      }
    } else if (type === "N") {
      var nDeltas = [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]];
      for (var ni = 0; ni < nDeltas.length; ni++) {
        var nr = r + nDeltas[ni][0], nc = c + nDeltas[ni][1];
        if (nr >= 0 && nr < 8 && nc >= 0 && nc < 8) {
          var nt = board[nr][nc];
          if (!nt || getPieceColor(nt) !== color) moves.push({ from: { r: r, c: c }, to: { r: nr, c: nc } });
        }
      }
    } else if (type === "B" || type === "R" || type === "Q") {
      var dirs = [];
      if (type === "B" || type === "Q") dirs.push([-1,-1],[-1,1],[1,-1],[1,1]);
      if (type === "R" || type === "Q") dirs.push([-1,0],[1,0],[0,-1],[0,1]);
      for (var di = 0; di < dirs.length; di++) {
        var dr = r + dirs[di][0], dc = c + dirs[di][1];
        while (dr >= 0 && dr < 8 && dc >= 0 && dc < 8) {
          var dt = board[dr][dc];
          if (!dt) {
            moves.push({ from: { r: r, c: c }, to: { r: dr, c: dc } });
          } else {
            if (getPieceColor(dt) !== color) moves.push({ from: { r: r, c: c }, to: { r: dr, c: dc } });
            break;
          }
          dr += dirs[di][0]; dc += dirs[di][1];
        }
      }
    } else if (type === "K") {
      var kDeltas = [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]];
      for (var ki = 0; ki < kDeltas.length; ki++) {
        var kr = r + kDeltas[ki][0], kc = c + kDeltas[ki][1];
        if (kr >= 0 && kr < 8 && kc >= 0 && kc < 8) {
          var kt = board[kr][kc];
          if (!kt || getPieceColor(kt) !== color) moves.push({ from: { r: r, c: c }, to: { r: kr, c: kc } });
        }
      }
      // Castling
      var opp = (color === "w" ? "b" : "w");
      if (color === "w" && r === 7 && c === 4 && !isSquareAttacked(board, 7, 4, opp)) {
        if (castling.wK && !board[7][5] && !board[7][6] && !isSquareAttacked(board, 7, 5, opp) && !isSquareAttacked(board, 7, 6, opp) && board[7][7] === "R") {
          moves.push({ from: { r: 7, c: 4 }, to: { r: 7, c: 6 }, isCastle: "wK" });
        }
        if (castling.wQ && !board[7][3] && !board[7][2] && !board[7][1] && !isSquareAttacked(board, 7, 3, opp) && !isSquareAttacked(board, 7, 2, opp) && board[7][0] === "R") {
          moves.push({ from: { r: 7, c: 4 }, to: { r: 7, c: 2 }, isCastle: "wQ" });
        }
      }
      if (color === "b" && r === 0 && c === 4 && !isSquareAttacked(board, 0, 4, opp)) {
        if (castling.bK && !board[0][5] && !board[0][6] && !isSquareAttacked(board, 0, 5, opp) && !isSquareAttacked(board, 0, 6, opp) && board[0][7] === "r") {
          moves.push({ from: { r: 0, c: 4 }, to: { r: 0, c: 6 }, isCastle: "bK" });
        }
        if (castling.bQ && !board[0][3] && !board[0][2] && !board[0][1] && !isSquareAttacked(board, 0, 3, opp) && !isSquareAttacked(board, 0, 2, opp) && board[0][0] === "r") {
          moves.push({ from: { r: 0, c: 4 }, to: { r: 0, c: 2 }, isCastle: "bQ" });
        }
      }
    }

    return moves;
  }

  function makeSimMove(board, move) {
    var nb = cloneBoard(board);
    var p = nb[move.from.r][move.from.c];
    nb[move.from.r][move.from.c] = null;
    
    if (move.isEnPassant) {
      var capRow = (p === "P" ? move.to.r + 1 : move.to.r - 1);
      nb[capRow][move.to.c] = null;
    }
    
    if (move.isCastle === "wK") { nb[7][7] = null; nb[7][5] = "R"; }
    else if (move.isCastle === "wQ") { nb[7][0] = null; nb[7][3] = "R"; }
    else if (move.isCastle === "bK") { nb[0][7] = null; nb[0][5] = "r"; }
    else if (move.isCastle === "bQ") { nb[0][0] = null; nb[0][3] = "r"; }

    // Piyoda aylanishi: o'yinchi tanlagan dona, tanlanmagan bo'lsa (bot) - farzin
    var promo = move.promo || "q";
    if (p === "P" && move.to.r === 0) p = promo.toUpperCase();
    if (p === "p" && move.to.r === 7) p = promo;

    nb[move.to.r][move.to.c] = p;
    return nb;
  }

  function getLegalMovesForSquare(board, r, c, castling, ep) {
    var raw = getRawMoves(board, r, c, castling, ep);
    var color = getPieceColor(board[r][c]);
    var legal = [];
    for (var i = 0; i < raw.length; i++) {
      var simulated = makeSimMove(board, raw[i]);
      if (!isKingInCheck(simulated, color)) {
        legal.push(raw[i]);
      }
    }
    return legal;
  }

  function getAllLegalMoves(board, color, castling, ep) {
    var all = [];
    for (var r = 0; r < 8; r++) {
      for (var c = 0; c < 8; c++) {
        if (getPieceColor(board[r][c]) === color) {
          all = all.concat(getLegalMovesForSquare(board, r, c, castling, ep));
        }
      }
    }
    return all;
  }

  /* --- AI ENGINE --- */

  function evaluateBoard(board) {
    var total = 0;
    for (var r = 0; r < 8; r++) {
      for (var c = 0; c < 8; c++) {
        var p = board[r][c];
        if (p) {
          var type = p.toUpperCase();
          var val = (CHESS_PIECES[p] ? CHESS_PIECES[p].val : 0);
          var pstTable = PST[type];
          var posVal = 0;
          if (pstTable) {
            posVal = isWhitePiece(p) ? pstTable[r][c] : pstTable[7 - r][c];
          }
          if (isWhitePiece(p)) {
            total += val + posVal;
          } else {
            total -= (val + posVal);
          }
        }
      }
    }
    return total;
  }

  function minimax(board, depth, alpha, beta, isMaximizing, castling, ep) {
    if (depth === 0) return { score: evaluateBoard(board) };

    var color = isMaximizing ? "w" : "b";
    var moves = getAllLegalMoves(board, color, castling, ep);
    if (moves.length === 0) {
      if (isKingInCheck(board, color)) {
        return { score: isMaximizing ? -50000 + (3 - depth) : 50000 - (3 - depth) };
      }
      return { score: 0 }; // Stalemate
    }

    var bestMove = moves[Math.floor(Math.random() * moves.length)];

    if (isMaximizing) {
      var maxEval = -999999;
      for (var i = 0; i < moves.length; i++) {
        var nextBoard = makeSimMove(board, moves[i]);
        var nextEp = moves[i].isDoublePawn ? { r: (moves[i].from.r + moves[i].to.r)/2, c: moves[i].from.c } : null;
        var evaluation = minimax(nextBoard, depth - 1, alpha, beta, false, castling, nextEp).score;
        if (evaluation > maxEval) {
          maxEval = evaluation;
          bestMove = moves[i];
        }
        alpha = Math.max(alpha, evaluation);
        if (beta <= alpha) break;
      }
      return { score: maxEval, move: bestMove };
    } else {
      var minEval = 999999;
      for (var j = 0; j < moves.length; j++) {
        var nBoard = makeSimMove(board, moves[j]);
        var nEp = moves[j].isDoublePawn ? { r: (moves[j].from.r + moves[j].to.r)/2, c: moves[j].from.c } : null;
        var ev = minimax(nBoard, depth - 1, alpha, beta, true, castling, nEp).score;
        if (ev < minEval) {
          minEval = ev;
          bestMove = moves[j];
        }
        beta = Math.min(beta, ev);
        if (beta <= alpha) break;
      }
      return { score: minEval, move: bestMove };
    }
  }

  function getBestBotMove(board, diff, color, castling, ep) {
    var moves = getAllLegalMoves(board, color, castling, ep);
    if (moves.length === 0) return null;

    if (diff === "easy") {
      // 70% random, 30% capture
      var captures = moves.filter(function(m) { return !!board[m.to.r][m.to.c]; });
      if (captures.length > 0 && Math.random() < 0.3) {
        return captures[Math.floor(Math.random() * captures.length)];
      }
      return moves[Math.floor(Math.random() * moves.length)];
    } else if (diff === "med") {
      // Depth 2
      var res2 = minimax(board, 2, -999999, 999999, (color === "w"), castling, ep);
      return res2.move || moves[0];
    } else {
      // Depth 3
      var res3 = minimax(board, 3, -999999, 999999, (color === "w"), castling, ep);
      return res3.move || moves[0];
    }
  }

  /* --- UI CONTROLLER & CLOCK --- */

  function formatTime(s) {
    var m = Math.floor(s / 60);
    var sec = s % 60;
    return (m < 10 ? "0" + m : m) + ":" + (sec < 10 ? "0" + sec : sec);
  }

  function fmtClock(ms) {
    ms = Math.max(0, ms);
    if (ms >= 10000) { return formatTime(Math.ceil(ms / 1000)); }
    // So'nggi 10 soniyada o'ndan bir soniya ham ko'rinadi (chess.com dagidek).
    return "00:0" + (Math.floor(ms / 100) / 10).toFixed(1);
  }

  function updateChessClocks() {
    var myClock = $("chess-my-clock");
    var oppClock = $("chess-opp-clock");
    if (!myClock || !oppClock) return;

    var pvp = chessState.gameMode === "pvp";
    var me = chessState.myColor, opp = (me === "w" ? "b" : "w");
    var myMs = pvp ? pvpClockMs(me) : (me === "w" ? chessState.whiteTime : chessState.blackTime) * 1000;
    var oppMs = pvp ? pvpClockMs(opp) : (me === "w" ? chessState.blackTime : chessState.whiteTime) * 1000;
    var isMyTurn = (chessState.turn === me);
    var running = !chessState.gameOver;

    myClock.textContent = fmtClock(myMs);
    oppClock.textContent = fmtClock(oppMs);

    var badge = $("chess-status-badge");
    var text = isMyTurn ? L("yourTurn") : L("oppThinking");
    var color = isMyTurn ? "#f1c40f" : "var(--dim)";
    if (pvp) {
      var g = chessNet.game;
      if (!g || g.status !== "active") {
        text = (!g || g.status === "waiting") ? L("waitShort") : L("r_over");
        color = "var(--dim)";
        running = false;
      } else if (g.ply < 2 && g.first_move_left !== null) {
        var left = Math.max(0, g.first_move_left - (Date.now() - chessNet.recvAt));
        text = L(isMyTurn ? "firstMove" : "oppFirstMove").replace("%s", formatTime(Math.ceil(left / 1000)));
      }
      if (chessNet.fails >= 2) { text = L("reconnect"); color = "#e74c3c"; }
    } else if (chessState.gameOver) {
      text = L("r_over");
      color = "var(--dim)";
    }
    myClock.classList.toggle("on", running && isMyTurn);
    oppClock.classList.toggle("on", running && !isMyTurn);
    myClock.classList.toggle("low", running && isMyTurn && myMs <= 30000);
    oppClock.classList.toggle("low", running && !isMyTurn && oppMs <= 30000);
    myClock.style.color = running && isMyTurn ? (myMs <= 30000 ? "#ff8a7a" : "var(--text)") : "var(--dim)";
    oppClock.style.color = running && !isMyTurn ? (oppMs <= 30000 ? "#ff8a7a" : "var(--text)") : "var(--dim)";
    badge.textContent = text;
    badge.style.color = color;
  }

  /* --- JONLI O'YIN (PvP) ---
     Hakam - server (bot.tizimshunos.uz/api/chess/*). Ilova faqat yurishni
     ("e2e4", piyoda aylansa "e7e8n") yuboradi; qaysi yurishlar mumkinligi,
     soat, natija va ball - hammasi serverdan keladi, ilova ularni faqat
     ko'rsatadi. O'zgarishlar chatdagi kabi jonli: ilova "shu raqamdan keyin
     nima o'zgardi?" deb so'raydi, server javobni o'zgarish bo'lguncha
     (25 soniyagacha) ushlab turadi. Soat ham server vaqti bo'yicha: ilova
     yig'ilib qolsa ham raqibning vaqti to'g'ri yuradi. */

  var API_CHESS = "https://bot.tizimshunos.uz/api/chess/";
  var FILES = "abcdefgh";
  var chessNet = { game: null, pollGen: 0, ctrl: null, busy: false, frozen: null,
                   recvAt: 0, fails: 0, ended: false, tick: null };

  function sqName(r, c) { return FILES.charAt(c) + (8 - r); }
  function uciSq(s) { return { r: 8 - parseInt(s.charAt(1), 10), c: FILES.indexOf(s.charAt(0)) }; }
  function moveUci(m) { return sqName(m.from.r, m.from.c) + sqName(m.to.r, m.to.c) + (m.promo || ""); }

  // Server holatni FEN ko'rinishida yuboradi - ilova uni o'z taxtasiga o'giradi.
  function fenState(fen) {
    var parts = String(fen || "").split(" ");
    var rows = (parts[0] || "").split("/");
    var board = [];
    for (var r = 0; r < 8; r++) {
      var row = [], src = rows[r] || "8";
      for (var i = 0; i < src.length; i++) {
        var ch = src.charAt(i);
        if (/[1-8]/.test(ch)) { for (var k = 0; k < +ch; k++) { row.push(null); } }
        else { row.push(ch); }
      }
      while (row.length < 8) { row.push(null); }
      board.push(row.slice(0, 8));
    }
    var cs = parts[2] || "-";
    return {
      board: board,
      turn: parts[1] === "b" ? "b" : "w",
      castling: { wK: cs.indexOf("K") > -1, wQ: cs.indexOf("Q") > -1, bK: cs.indexOf("k") > -1, bQ: cs.indexOf("q") > -1 },
      ep: (parts[3] && parts[3] !== "-") ? uciSq(parts[3]) : null
    };
  }

  function chessApi(what, body, query, ctrl) {
    var d = ""; try { d = (tg && tg.initData) || ""; } catch (e) {}
    var opt = { method: body ? "POST" : "GET", headers: { "X-Telegram-Init-Data": d } };
    if (body) { opt.headers["Content-Type"] = "application/json"; opt.body = JSON.stringify(body); }
    if (ctrl) { opt.signal = ctrl.signal; }
    return fetch(API_CHESS + what + (query || ""), opt).then(function (r) { return r.json(); });
  }

  function chessAsk(msg, cb) { testAsk(msg, cb); }

  function chessHaptic(kind) {
    try { if (tg && tg.HapticFeedback) { tg.HapticFeedback.notificationOccurred(kind); } } catch (e) {}
  }

  function pvpIs(gid) { return !!(chessNet.game && chessNet.game.id === gid); }

  function pvpClockMs(color) {
    var g = chessNet.game;
    if (!g) { return 0; }
    if (chessNet.frozen) { return chessNet.frozen[color]; }
    var ms = g.clock[color];
    if (g.clock.running && g.status === "active" && g.turn === color) {
      ms -= (Date.now() - chessNet.recvAt);
    }
    return Math.max(0, ms);
  }

  function timeLabel(g) {
    return formatTime(g.base) + (g.inc ? " +" + g.inc : "");
  }

  // Tanlangan dona uchun mumkin bo'lgan yurishlar - serverning ro'yxatidan.
  function pvpLegalFor(r, c) {
    var g = chessNet.game, from = sqName(r, c), out = [], seen = {};
    if (!g || chessNet.busy) { return out; }
    var p = chessState.board[r][c];
    (g.legal || []).forEach(function (u) {
      var to = u.slice(2, 4);
      if (u.slice(0, 2) !== from || seen[to]) { return; }
      seen[to] = 1;
      var m = { from: { r: r, c: c }, to: uciSq(to) };
      if (p && p.toUpperCase() === "K" && Math.abs(m.to.c - c) === 2) {
        m.isCastle = (p === "K" ? "w" : "b") + (m.to.c === 6 ? "K" : "Q");
      }
      if (p && p.toUpperCase() === "P" && m.to.c !== c && !chessState.board[m.to.r][m.to.c]) {
        m.isEnPassant = true;
      }
      out.push(m);
    });
    return out;
  }

  function pvpRenderPlayers(g) {
    var mine = g.you === "b" ? g.black : g.white;
    var opp = g.you === "b" ? g.white : g.black;
    var myCol = g.you === "b" ? L("black") : L("white");
    var oppCol = g.you === "b" ? L("white") : L("black");
    $("chess-my-name").textContent = (mine && mine.name) || L("you");
    chessAvatar($("chess-my-avatar"), mine && mine.house);
    $("chess-my-sub").textContent = myCol + (mine && mine.house ? " • " + cupHouseName(mine.house) : "");
    var invBtn = $("chess-invite-btn");
    if (opp) {
      $("chess-opp-name").textContent = opp.name || L("opp");
      chessAvatar($("chess-opp-avatar"), opp.house);
      $("chess-opp-sub").textContent = oppCol + " • " + timeLabel(g) +
        (g.status === "active" && !opp.online ? " • " + L("offline") : "");
      invBtn.classList.add("hidden");
    } else {
      $("chess-opp-name").textContent = L("waitFriend");
      $("chess-opp-avatar").setAttribute("data-k", "wait");
      $("chess-opp-avatar").textContent = "⏳";
      $("chess-opp-sub").textContent = L("codeLbl") + " " + g.id + " • " + timeLabel(g);
      invBtn.classList.toggle("hidden", g.status !== "waiting");
    }
  }

  function pvpRenderControls(g) {
    var live = g.status === "active";
    var early = g.status === "waiting" || (live && g.ply < 2);
    var resign = $("btn-chess-resign"), draw = $("btn-chess-draw");
    resign.classList.toggle("hidden", !(live || g.status === "waiting"));
    $("btn-chess-resign-tx").textContent = early ? L("abortBtn") : L("resign");
    draw.classList.toggle("hidden", !live || g.ply < 2);
    draw.disabled = !g.can_offer;
    $("btn-chess-draw-tx").textContent = g.draw_offer === g.you ? L("drawSent") : L("drawBtn");
    $("chess-offer").classList.toggle("hidden", !(live && g.draw_offer && g.draw_offer !== g.you));
  }

  function pvpApply(g) {
    if (!g || g.v !== 2) { return; }
    var cur = chessNet.game;
    if (cur && cur.id === g.id && g.rev < cur.rev) { return; }   // eskirgan javob
    var wasMyTurn = cur && cur.id === g.id && cur.turn === cur.you;
    chessNet.game = g;
    chessNet.recvAt = Date.now();
    chessNet.frozen = null;

    var st = fenState(g.fen);
    chessState.board = st.board;
    chessState.turn = st.turn;
    chessState.castling = st.castling;
    chessState.ep = st.ep;
    chessState.myColor = g.you || "w";
    chessState.pvpGameId = g.id;
    chessState.lastMove = g.last ? { from: uciSq(g.last.slice(0, 2)), to: uciSq(g.last.slice(2, 4)) } : null;
    chessState.gameOver = (g.status === "finished" || g.status === "aborted");

    if (chessState.selectedSq && !chessState.gameOver) {
      chessState.legalMoves = pvpLegalFor(chessState.selectedSq.r, chessState.selectedSq.c);
      if (!chessState.legalMoves.length) { chessState.selectedSq = null; }
    } else {
      chessState.selectedSq = null;
      chessState.legalMoves = [];
    }
    if (chessState.gameOver || g.turn !== g.you) { closePromo(); }

    pvpRenderPlayers(g);
    pvpRenderControls(g);
    renderChessBoard();
    updateChessClocks();

    if (g.status === "active" && g.turn === g.you && cur && !wasMyTurn) {
      try { if (tg && tg.HapticFeedback) { tg.HapticFeedback.impactOccurred("light"); } } catch (e) {}
    }
    if (chessState.gameOver && !chessNet.ended) {
      chessNet.ended = true;
      try { if (!chessNet.review) { sqDone("chess"); } } catch (e) {}
      pvpStopPoll();
      if (!chessNet.review) { pvpShowEnd(g); }
    }
  }

  function pvpShowEnd(g) {
    if (g.status === "aborted") {
      showChessOverlay("aborted", g.reason, "");
      return;
    }
    var mine = g.you === "b" ? g.black : g.white;
    var res = g.result === "1/2-1/2" ? "draw" : (mine && g.winner_uid === mine.uid ? "win" : "loss");
    var extra = "";
    if (g.award && g.award.points) {
      extra = L("winPts").replace("%d", g.award.points);
    } else if (g.award && g.award.limit_reached) {
      extra = L("limitFull").replace("%d", g.award.limit);
    }
    var rt = g.rating && g.rating[g.you];
    if (rt) {
      // Reyting o'zgarishi: "Reyting: 1216 (+16)"
      extra += (extra ? " " : "") + L("ratingAfter").replace("%r", rt.r + rt.d).replace("%d", (rt.d > 0 ? "+" : "") + rt.d);
    }
    showChessOverlay(res, g.reason, extra);
    chessHaptic(res === "win" ? "success" : res === "loss" ? "error" : "warning");
  }

  function pvpPoll() {
    var g = chessNet.game, gen = chessNet.pollGen;
    if (!g || g.status === "finished" || g.status === "aborted") { return; }
    var ctrl = null;
    try { ctrl = new AbortController(); } catch (e) {}
    chessNet.ctrl = ctrl;
    chessApi("state", null, "?game_id=" + encodeURIComponent(g.id) + "&since=" + g.rev + "&wait=1", ctrl)
      .then(function (res) {
        if (gen !== chessNet.pollGen) { return; }
        if (!res || !res.game) { throw new Error("bad"); }
        chessNet.fails = 0;
        if (chessNet.busy) { setTimeout(function () { if (gen === chessNet.pollGen) { pvpPoll(); } }, 300); return; }
        pvpApply(res.game);
        pvpPoll();
      })["catch"](function () {
        if (gen !== chessNet.pollGen) { return; }
        chessNet.fails++;
        updateChessClocks();
        setTimeout(function () { if (gen === chessNet.pollGen) { pvpPoll(); } },
                   Math.min(1000 * chessNet.fails, 5000));
      });
  }

  function pvpStopPoll() {
    chessNet.pollGen++;
    if (chessNet.ctrl) { try { chessNet.ctrl.abort(); } catch (e) {} }
    chessNet.ctrl = null;
    if (chessNet.tick) { clearInterval(chessNet.tick); chessNet.tick = null; }
  }

  function pvpStartPoll() {
    pvpStopPoll();
    if (!chessNet.game || chessState.gameOver) { return; }
    chessNet.tick = setInterval(updateChessClocks, 200);
    pvpPoll();
  }

  function pvpRefresh() {
    var g = chessNet.game;
    if (!g) { return; }
    chessApi("state", null, "?game_id=" + encodeURIComponent(g.id)).then(function (res) {
      if (res && res.game && pvpIs(g.id)) { pvpApply(res.game); }
    })["catch"](function () {});
  }

  function pvpSendMove(move) {
    var g = chessNet.game;
    if (!g || chessNet.busy) { return; }
    var uci = moveUci(move);
    // Yurish darhol ko'rinadi; server javobi kelgach uning holati ustun turadi.
    chessNet.frozen = { w: pvpClockMs("w"), b: pvpClockMs("b") };
    chessState.board = makeSimMove(chessState.board, move);
    chessState.lastMove = move;
    chessState.turn = (chessState.turn === "w" ? "b" : "w");
    chessState.selectedSq = null;
    chessState.legalMoves = [];
    chessNet.busy = true;
    renderChessBoard();
    updateChessClocks();
    var tries = 0;
    (function send() {
      chessApi("move", { game_id: g.id, uci: uci, ply: g.ply }).then(function (res) {
        if (!pvpIs(g.id)) { return; }
        chessNet.busy = false;
        if (res && res.game) { pvpApply(res.game); } else { pvpRefresh(); }
        if (res && !res.ok && res.error !== "not_active") { showToast(L("moveRejected"), "err"); }
      })["catch"](function () {
        if (!pvpIs(g.id)) { return; }
        // Takror yuborish xavfsiz: server bir yurishni ikki marta qabul qilmaydi.
        if (++tries < 4) { setTimeout(send, 800 * tries); return; }
        chessNet.busy = false;
        showToast(L("netErr"), "err");
        pvpRefresh();
      });
    })();
  }

  function pvpAction(action) {
    var g = chessNet.game;
    if (!g) { return; }
    chessApi("action", { game_id: g.id, action: action }).then(function (res) {
      if (!pvpIs(g.id)) { return; }
      if (res && res.game) { pvpApply(res.game); }
      if (res && res.ok && action === "draw_offer") { showToast(L("drawSent")); }
      if (res && res.error === "offer_limit") { showToast(L("offerLimit"), "err"); }
    })["catch"](function () { showToast(L("netErr"), "err"); });
  }

  function openPvP(g, review) {
    chessSoundUnlock();
    seekStop(false);
    stopHubTimer();
    // Chatdagi kartadan kelinsa - chat yopiladi (o'qilgan joy saqlanadi).
    if (!$("scr-chat").classList.contains("hidden")) { closeChat(); }
    pvpStopPoll();
    stopBotClock();
    closePromo();
    chessState.gameMode = "pvp";
    chessNet.game = null;
    chessNet.busy = false;
    chessNet.frozen = null;
    chessNet.fails = 0;
    chessNet.ended = false;
    chessNet.review = !!review;       // tarixdan: natija oynasisiz, faqat ko'rish
    chessState.selectedSq = null;
    chessState.legalMoves = [];
    chessResetView();
    $("chess-board-overlay").classList.add("hidden");
    $("scr-lang").classList.add("hidden");
    $("scr-cat").classList.add("hidden");
    $("scr-cup").classList.add("hidden");
    $("scr-chess-hub").classList.add("hidden");
    $("scr-chess-stats").classList.add("hidden");
    $("scr-chess-game").classList.remove("hidden");
    pvpApply(g);
    pvpStartPoll();
    if (review) {
      $("chess-controls").classList.add("hidden");
      $("btn-chess-again").classList.add("hidden");
      $("chess-end-row").classList.remove("hidden");
    }
    if (g.status === "active" && g.ply === 0) { chessSound("start"); }
  }

  // Ilova qayta ochilganda (telefonda yig'ilib turgan bo'lsa) darhol yangilaymiz:
  // yo'lda qolgan so'rov o'lik bo'lishi mumkin.
  document.addEventListener("visibilitychange", function () {
    if (document.hidden || chessState.gameMode !== "pvp" || chessState.gameOver) { return; }
    if (!chessNet.game || $("scr-chess-game").classList.contains("hidden")) { return; }
    pvpStartPoll();
  });

  function stopBotClock() {
    if (chessState.clockTimer) { clearInterval(chessState.clockTimer); chessState.clockTimer = null; }
  }

  function startBotClock() {
    stopBotClock();
    chessState.clockTimer = setInterval(function() {
      if (chessState.gameOver) return;
      if (chessState.turn === "w") {
        chessState.whiteTime = Math.max(0, chessState.whiteTime - 1);
        if (chessState.whiteTime === 0) finishChessGame(chessState.myColor === "w" ? "loss" : "win", "timeout");
      } else {
        chessState.blackTime = Math.max(0, chessState.blackTime - 1);
        if (chessState.blackTime === 0) finishChessGame(chessState.myColor === "b" ? "loss" : "win", "timeout");
      }
      updateChessClocks();
    }, 1000);
  }

  /* --- SEHRLI TAXTA ---
     Garri Potter olamidagi sehrgar shaxmatidek: tosh taxta, oltin ramka,
     fil suyagi va obsidian donalar; dona urilganda tosh kabi sinib ketadi.
     Uslublar: "Sehrli tosh" (asosiy), "Fakultet" (o'z fakultetingiz ranglari),
     "Klassik" (oddiy yog'och). Taxta faqat shu yerda chiziladi; bosish va
     sudrash ham taxta darajasida ushlanadi (har katakka alohida emas). */

  var THEME_KEY = "chess_theme";
  var SOUND_KEY = "chess_sound";
  var BOARD_STONE = ["#d3cab8", "#5d626b"];
  var BOARD_CLASSIC = ["#dfc7a7", "#885c35"];
  var BOARD_HOUSE = {
    gryffindor: ["#e7c77e", "#8a2a22"], slytherin: ["#cfd6d9", "#1f5c40"],
    ravenclaw: ["#d6bd8f", "#2b4f86"], hufflepuff: ["#eed27f", "#3b352c"]
  };
  var PIECE_PAINT = {
    marble: { w: ["url(#hpIvory)", "#3b2a16"], b: ["url(#hpObsidian)", "#d9a74a"] },
    classic: { w: ["#fff", "#000"], b: ["#000", "#fff"] }
  };
  var CG_IC = {
    half: chatSvg('<path d="M5 9h14M5 15h14"/>'),
    flag: chatSvg('<path d="M5 22V4"/><path d="M5 4h13l-2.5 4.5L18 13H5"/>'),
    again: chatSvg('<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/>'),
    soundOn: chatSvg('<path d="M11 5 6 9H2v6h4l5 4Z"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/><path d="M19 5a10 10 0 0 1 0 14"/>'),
    soundOff: chatSvg('<path d="M11 5 6 9H2v6h4l5 4Z"/><path d="m22 9-6 6M16 9l6 6"/>'),
    prev: chatSvg('<path d="m15 18-6-6 6-6"/>'),
    next: chatSvg('<path d="m9 18 6-6-6-6"/>')
  };

  var chessThemeSel = null;

  function chessThemeName() {
    if (chessThemeSel) { return chessThemeSel; }
    var n = "stone";
    try { n = window.localStorage.getItem(THEME_KEY) || "stone"; } catch (e) {}
    chessThemeSel = (n === "house" || n === "classic") ? n : "stone";
    return chessThemeSel;
  }

  function setChessTheme(name) {
    chessThemeSel = name;
    try { window.localStorage.setItem(THEME_KEY, name); } catch (e) {}
  }

  function chessTheme(name) {
    name = name || chessThemeName();
    if (name === "classic") { return { name: name, sq: BOARD_CLASSIC, pieces: "classic", frame: "chf-wood" }; }
    if (name === "house") {
      var h = BOARD_HOUSE[cupMe().house] || BOARD_HOUSE[house];
      return { name: name, sq: h || BOARD_STONE, pieces: "marble", frame: "chf-gold" };
    }
    return { name: "stone", sq: BOARD_STONE, pieces: "marble", frame: "chf-gold" };
  }

  function chessPieceStyle() { return chessTheme().pieces; }

  /* --- Tarix: har yurishdan keyingi holat (ro'yxatdan orqaga qarash uchun) --- */

  var chessHist = { view: null, cacheKey: null, cache: null, drawnKey: null };

  function startBoard() {
    return fenState("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1").board;
  }

  function applyUciTo(board, uci) {
    var from = uciSq(uci.slice(0, 2)), to = uciSq(uci.slice(2, 4)), p = board[from.r][from.c];
    var m = { from: from, to: to };
    if (p && p.toUpperCase() === "K" && Math.abs(to.c - from.c) === 2) {
      m.isCastle = (p === "K" ? "w" : "b") + (to.c === 6 ? "K" : "Q");
    }
    if (p && p.toUpperCase() === "P" && to.c !== from.c && !board[to.r][to.c]) { m.isEnPassant = true; }
    if (uci.length > 4) { m.promo = uci.charAt(4); }
    return { board: makeSimMove(board, m), move: m };
  }

  function chessPositions() {
    if (chessState.gameMode !== "pvp") { return chessState.hist || []; }
    var g = chessNet.game;
    if (!g) { return []; }
    var key = g.id + ":" + g.ply;
    if (chessHist.cacheKey === key) { return chessHist.cache; }
    var b = startBoard(), list = [{ board: b, last: null, turn: "w" }];
    (g.moves || []).forEach(function (u, i) {
      var res = applyUciTo(b, u);
      b = res.board;
      list.push({ board: b, last: res.move, turn: i % 2 ? "w" : "b" });
    });
    chessHist.cacheKey = key;
    chessHist.cache = list;
    return list;
  }

  function chessSans() {
    if (chessState.gameMode === "pvp") { return (chessNet.game && chessNet.game.san) || []; }
    return chessState.sans || [];
  }

  function chessViewState() {
    if (chessHist.view !== null) {
      var pos = chessPositions()[chessHist.view];
      if (pos) { return { board: pos.board, last: pos.last, turn: pos.turn, live: false }; }
      chessHist.view = null;
    }
    return { board: chessState.board, last: chessState.lastMove, turn: chessState.turn, live: true };
  }

  // Bot bilan o'yinda yurish yozuvi (jonli o'yinda buni server yuboradi).
  function sanFor(board, move, castling, ep) {
    var p = board[move.from.r][move.from.c], type = p.toUpperCase(), color = getPieceColor(p);
    var s;
    if (move.isCastle) {
      s = move.to.c === 6 ? "O-O" : "O-O-O";
    } else {
      var cap = !!board[move.to.r][move.to.c] || !!move.isEnPassant;
      if (type === "P") {
        s = (cap ? FILES.charAt(move.from.c) + "x" : "") + sqName(move.to.r, move.to.c);
        if (move.to.r === 0 || move.to.r === 7) { s += "=" + (move.promo || "q").toUpperCase(); }
      } else {
        s = type;
        var others = [];
        for (var r = 0; r < 8; r++) {
          for (var c = 0; c < 8; c++) {
            if (board[r][c] !== p || (r === move.from.r && c === move.from.c)) { continue; }
            var ok = getLegalMovesForSquare(board, r, c, castling, ep).some(function (m) {
              return m.to.r === move.to.r && m.to.c === move.to.c;
            });
            if (ok) { others.push({ r: r, c: c }); }
          }
        }
        if (others.length) {
          var sameFile = others.some(function (o) { return o.c === move.from.c; });
          var sameRank = others.some(function (o) { return o.r === move.from.r; });
          if (!sameFile) { s += FILES.charAt(move.from.c); }
          else if (!sameRank) { s += (8 - move.from.r); }
          else { s += sqName(move.from.r, move.from.c); }
        }
        s += (cap ? "x" : "") + sqName(move.to.r, move.to.c);
      }
    }
    var nb = makeSimMove(board, move), opp = color === "w" ? "b" : "w";
    if (isKingInCheck(nb, opp)) {
      s += getAllLegalMoves(nb, opp, castling, null).length ? "+" : "#";
    }
    return s;
  }

  function sanHtml(s, white) {
    var m = /^([KQRBN])(.*)$/.exec(s);
    if (!m) { return escapeHtmlChess(s); }
    return "<i>" + getPieceSVG(white ? m[1] : m[1].toLowerCase()) + "</i>" + escapeHtmlChess(m[2]);
  }

  function escapeHtmlChess(s) {
    return String(s).replace(/[&<>"]/g, function (ch) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[ch];
    });
  }

  function renderChessMoves() {
    var strip = $("chess-moves");
    if (!strip) { return; }
    var sans = chessSans();
    var cur = chessHist.view === null ? sans.length : chessHist.view;
    var key = chessState.gameMode + (chessState.pvpGameId || "") + ":" + sans.length + ":" + cur + ":" + chessThemeName();
    if (chessHist.drawnKey !== key) {
      chessHist.drawnKey = key;
      if (!sans.length) {
        strip.innerHTML = '<span class="cg-mv-empty">' + escapeHtmlChess(L("noMoves")) + "</span>";
      } else {
        var html = "";
        for (var i = 0; i < sans.length; i++) {
          html += '<span class="cg-mv' + (i + 1 === cur ? " cur" : "") + '" data-i="' + (i + 1) + '">' +
            (i % 2 === 0 ? '<span class="num">' + (i / 2 + 1) + ".</span>" : "") + sanHtml(sans[i], i % 2 === 0) + "</span>";
        }
        strip.innerHTML = html;
      }
      if (chessHist.view === null) {
        strip.scrollLeft = strip.scrollWidth;
      } else {
        var el = strip.querySelector(".cg-mv.cur");
        if (el) { strip.scrollLeft = Math.max(0, el.offsetLeft - strip.clientWidth / 2); }
      }
    }
    $("chess-mv-prev").disabled = cur <= 0;
    $("chess-mv-next").disabled = chessHist.view === null;
    $("chess-frame").classList.toggle("browsing", chessHist.view !== null);
  }

  function chessBrowse(index) {
    var last = chessPositions().length - 1;
    if (index === null || index >= last) { chessHist.view = null; }
    else { chessHist.view = Math.max(0, index); }
    chessState.selectedSq = null;
    chessState.legalMoves = [];
    renderChessBoard();
  }

  /* --- Olingan donalar va ustunlik --- */

  function renderChessCaps(board) {
    var start = { p: 8, n: 2, b: 2, r: 2, q: 1 }, val = { p: 1, n: 3, b: 3, r: 5, q: 9 };
    var cnt = { w: { p: 0, n: 0, b: 0, r: 0, q: 0 }, b: { p: 0, n: 0, b: 0, r: 0, q: 0 } };
    var score = { w: 0, b: 0 };
    for (var r = 0; r < 8; r++) {
      for (var c = 0; c < 8; c++) {
        var p = board[r][c];
        if (!p || p.toUpperCase() === "K") { continue; }
        var col = getPieceColor(p), t = p.toLowerCase();
        cnt[col][t]++;
        score[col] += val[t];
      }
    }
    function caps(by) {
      var victim = by === "w" ? "b" : "w", html = "";
      ["q", "r", "b", "n", "p"].forEach(function (t) {
        var miss = Math.max(0, start[t] - cnt[victim][t]);
        for (var i = 0; i < miss; i++) {
          html += '<i' + (i === miss - 1 ? ' class="gap"' : "") + ">" +
            getPieceSVG(victim === "w" ? t.toUpperCase() : t) + "</i>";
        }
      });
      var adv = score[by] - score[victim];
      if (adv > 0) { html += "<b>+" + adv + "</b>"; }
      return html;
    }
    var me = chessState.myColor, opp = me === "w" ? "b" : "w";
    $("chess-my-caps").innerHTML = caps(me);
    $("chess-opp-caps").innerHTML = caps(opp);
  }

  /* --- Chizish --- */

  var chessFx = { key: null, prev: null, noSlide: false };
  var chessDrag = null;

  function moveKey(m) {
    return m ? "" + m.from.r + m.from.c + m.to.r + m.to.c : "-";
  }

  function renderChessBoard() {
    var boardEl = $("chess-board");
    if (!boardEl) return;
    var th = chessTheme();
    var frame = $("chess-frame");
    frame.className = th.frame + (chessHist.view !== null ? " browsing" : "");

    // Yangi yurishmi? (tovush, silliq siljish, sinish - faqat hozirgi holatda)
    var fxMove = null, fxCaptured = null, fxCheck = false, fxPromo = false;
    var liveKey = chessState.gameMode + ":" + (chessState.pvpGameId || "") + ":" + moveKey(chessState.lastMove) + ":" + chessState.turn;
    if (chessFx.key !== null && liveKey !== chessFx.key && chessState.lastMove && chessFx.prev) {
      var lm = chessState.lastMove, prev = chessFx.prev;
      var mover = prev[lm.from.r] && prev[lm.from.r][lm.from.c];
      fxMove = lm;
      fxCaptured = prev[lm.to.r][lm.to.c];
      if (!fxCaptured && mover && mover.toUpperCase() === "P" && lm.from.c !== lm.to.c) {
        fxCaptured = prev[lm.from.r][lm.to.c];
      }
      fxCheck = isKingInCheck(chessState.board, chessState.turn);
      fxPromo = !!(mover && mover.toUpperCase() === "P" && (lm.to.r === 0 || lm.to.r === 7));
      chessHist.view = null;
    }
    chessFx.key = liveKey;
    chessFx.prev = cloneBoard(chessState.board);

    var view = chessViewState();
    var board = view.board;
    boardEl.innerHTML = "";
    var checkKing = isKingInCheck(board, view.turn) ? findKing(board, view.turn) : null;
    var flipped = (chessState.myColor === "b");
    var lift = chessDrag && chessDrag.lifted ? chessDrag : null;
    var targets = view.live ? chessState.legalMoves : [];

    for (var ri = 0; ri < 8; ri++) {
      for (var ci = 0; ci < 8; ci++) {
        var r = flipped ? 7 - ri : ri;
        var c = flipped ? 7 - ci : ci;
        var light = ((r + c) % 2 === 0);
        var sq = document.createElement("div");
        sq.className = "csq";
        sq.setAttribute("data-sq", "" + r + c);
        sq.style.background = light ? th.sq[0] : th.sq[1];
        var html = "";
        var lmv = view.last;
        if (lmv && ((lmv.from.r === r && lmv.from.c === c) || (lmv.to.r === r && lmv.to.c === c))) { html += '<div class="hl"></div>'; }
        if (view.live && chessState.selectedSq && chessState.selectedSq.r === r && chessState.selectedSq.c === c) { html += '<div class="sel"></div>'; }
        if (checkKing && checkKing.r === r && checkKing.c === c) { html += '<div class="chk"></div>'; }
        var coordCol = light ? th.sq[1] : th.sq[0];
        if (ci === 0) { html += '<span class="co rk" style="color:' + coordCol + '">' + (8 - r) + "</span>"; }
        if (ri === 7) { html += '<span class="co fl" style="color:' + coordCol + '">' + FILES.charAt(c) + "</span>"; }
        var p = board[r][c];
        if (p) {
          html += '<span class="pc' + (lift && lift.r === r && lift.c === c ? " lift" : "") + '">' + getPieceSVG(p, th.pieces) + "</span>";
        }
        for (var k = 0; k < targets.length; k++) {
          if (targets[k].to.r === r && targets[k].to.c === c) { html += p ? '<div class="ring"></div>' : '<div class="dot"></div>'; break; }
        }
        sq.innerHTML = html;
        boardEl.appendChild(sq);
      }
    }

    renderChessCaps(board);
    renderChessMoves();

    if (fxMove) {
      if (!chessFx.noSlide) { chessSlide(fxMove, flipped); }
      if (fxCaptured) {
        chessSound("capture");
        if (th.pieces === "marble") {
          var cr = fxMove.to.r, cc = fxMove.to.c, white = getPieceColor(fxCaptured) === "w";
          setTimeout(function () { chessShatter(cr, cc, white); }, chessFx.noSlide ? 0 : 140);
        }
      } else {
        chessSound("move");
      }
      if (fxPromo) { setTimeout(function () { chessSound("promote"); }, 60); }
      if (fxCheck) { setTimeout(function () { chessSound("check"); }, 90); }
    }
    chessFx.noSlide = false;
  }

  function chessSlide(m, flipped) {
    var boardEl = $("chess-board");
    var size = boardEl.clientWidth / 8, dir = flipped ? -1 : 1;
    function slide(from, to) {
      var el = boardEl.querySelector('[data-sq="' + to.r + to.c + '"] .pc');
      if (!el) { return; }
      el.style.transform = "translate(" + ((from.c - to.c) * dir * size) + "px," + ((from.r - to.r) * dir * size) + "px)";
      el.getBoundingClientRect();
      el.style.transition = "transform 170ms cubic-bezier(.2,.8,.3,1)";
      el.style.transform = "";
    }
    slide(m.from, m.to);
    if (m.isCastle) {
      var row = m.to.r, kside = m.to.c === 6;
      slide({ r: row, c: kside ? 7 : 0 }, { r: row, c: kside ? 5 : 3 });
    }
  }

  // Urilgan dona tosh kabi sinadi: parchalar sochiladi, oltin chaqnash.
  function chessShatter(r, c, white) {
    var fx = $("chess-fx"), boardEl = $("chess-board");
    if (!fx || !boardEl || !fx.animate) { return; }
    var fl = chessState.myColor === "b", size = boardEl.clientWidth / 8;
    var cx = boardEl.offsetLeft + ((fl ? 7 - c : c) + 0.5) * size;
    var cy = boardEl.offsetTop + ((fl ? 7 - r : r) + 0.5) * size;
    var cols = white ? ["#fbf6ea", "#e6dcc6", "#c8b995", "#d9a74a"] : ["#43434f", "#1d1d25", "#0b0b0f", "#d9a74a"];
    function gone(el) { return function () { if (el.parentNode) { el.parentNode.removeChild(el); } }; }
    var flash = document.createElement("div");
    flash.style.cssText = "position:absolute;left:" + (cx - size * 0.7) + "px;top:" + (cy - size * 0.7) + "px;width:" +
      (size * 1.4) + "px;height:" + (size * 1.4) + "px;border-radius:50%;background:radial-gradient(circle,rgba(255,228,150,.9),rgba(217,167,74,.35) 42%,transparent 70%)";
    fx.appendChild(flash);
    flash.animate([{ transform: "scale(.3)", opacity: 1 }, { transform: "scale(1.35)", opacity: 0 }],
      { duration: 420, easing: "ease-out" }).onfinish = gone(flash);
    for (var i = 0; i < 16; i++) {
      var s = document.createElement("div"), w = 4 + Math.random() * 8;
      s.style.cssText = "position:absolute;left:" + cx + "px;top:" + cy + "px;width:" + w + "px;height:" + (w * (0.6 + Math.random())) +
        "px;margin:" + (-w / 2) + "px 0 0 " + (-w / 2) + "px;background:" + cols[i % cols.length] + ";clip-path:polygon(50% 0,100% 100%,0 70%)";
      fx.appendChild(s);
      var ang = Math.random() * Math.PI * 2, dist = size * (0.45 + Math.random() * 0.9);
      s.animate([
        { transform: "translate(0,0) rotate(0deg)", opacity: 1 },
        { transform: "translate(" + (Math.cos(ang) * dist) + "px," + (Math.sin(ang) * dist + size * 0.3) + "px) rotate(" +
          (Math.random() * 540 - 270) + "deg) scale(.4)", opacity: 0 }
      ], { duration: 520 + Math.random() * 260, easing: "cubic-bezier(.15,.7,.3,1)" }).onfinish = gone(s);
    }
  }

  /* --- Ovoz ---
     Sehrgar shaxmati ovozlari (snd/chess_*.m4a, tools/soundgen.py): tosh haykal
     yurishi va sinishi, selesta tembridagi sehrli kuylar, tosh zal aks-sadosi.
     Hammasi noldan sintez qilingan - filmdagi yozuvlar ishlatilmaydi.
     iPhone ovozni faqat bosishdan keyin yoqadi - shuning uchun birinchi
     bosishda "ochiladi" va fayllar o'shanda yuklanadi. */

  var CHESS_SND = ["move", "capture", "check", "start", "win", "loss", "draw", "promote"];
  var chessAudio = { ctx: null, bufs: {}, loading: false, on: true };
  try { chessAudio.on = window.localStorage.getItem(SOUND_KEY) !== "0"; } catch (e) {}

  function chessSoundUnlock() {
    if (!chessAudio.on) { return; }
    try {
      if (!chessAudio.ctx) {
        var AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) { return; }
        chessAudio.ctx = new AC();
      }
      if (chessAudio.ctx.state === "suspended") { chessAudio.ctx.resume(); }
    } catch (e) { return; }
    if (chessAudio.loading) { return; }
    chessAudio.loading = true;
    CHESS_SND.forEach(function (k) {
      fetch("snd/chess_" + k + ".m4a?v=1").then(function (r) { return r.arrayBuffer(); }).then(function (data) {
        chessAudio.ctx.decodeAudioData(data, function (buf) { chessAudio.bufs[k] = buf; }, function () {});
      })["catch"](function () {});
    });
  }

  function chessSound(kind) {
    var ctx = chessAudio.ctx, buf = chessAudio.bufs[kind];
    if (!chessAudio.on || !ctx || !buf) { return; }
    try {
      var src = ctx.createBufferSource(), g = ctx.createGain();
      src.buffer = buf;
      g.gain.value = 0.9;
      src.connect(g);
      g.connect(ctx.destination);
      src.start(0);
    } catch (e) {}
  }

  function renderSoundBtn() {
    var b = $("chess-sound-btn");
    if (!b) { return; }
    b.innerHTML = chessAudio.on ? CG_IC.soundOn : CG_IC.soundOff;
    b.classList.toggle("off", !chessAudio.on);
  }

  /* --- Bosish va sudrash --- */

  function sqFromPoint(x, y) {
    var rect = $("chess-board").getBoundingClientRect();
    if (x < rect.left || y < rect.top || x >= rect.right || y >= rect.bottom) { return null; }
    var ci = Math.floor((x - rect.left) / (rect.width / 8)), ri = Math.floor((y - rect.top) / (rect.height / 8));
    var fl = chessState.myColor === "b";
    return { r: fl ? 7 - ri : ri, c: fl ? 7 - ci : ci };
  }

  function chessCanAct() {
    if (chessState.gameOver || chessState.turn !== chessState.myColor) { return false; }
    if (chessState.gameMode === "pvp" && (chessNet.busy || !chessNet.game || chessNet.game.status !== "active")) { return false; }
    return true;
  }

  function selectSquare(r, c) {
    chessState.selectedSq = { r: r, c: c };
    chessState.legalMoves = chessState.gameMode === "pvp" ? pvpLegalFor(r, c)
      : getLegalMovesForSquare(chessState.board, r, c, chessState.castling, chessState.ep);
  }

  function tryChessMove(r, c, dragged) {
    var move = (chessState.legalMoves || []).find(function (m) { return m.to.r === r && m.to.c === c; });
    if (!move) { return false; }
    if (isPromotion(move)) {
      askPromo(chessState.myColor, function (k) {
        if (!chessCanAct()) return;
        move.promo = k;
        chessFx.noSlide = !!dragged;
        executeMove(move);
      });
      renderChessBoard();
    } else {
      chessFx.noSlide = !!dragged;
      executeMove(move);
    }
    return true;
  }

  function onBoardDown(e) {
    chessSoundUnlock();
    if (e.button) { return; }
    var sq = sqFromPoint(e.clientX, e.clientY);
    if (!sq) { return; }
    e.preventDefault();
    if (chessHist.view !== null) { chessBrowse(null); return; }
    if (!chessCanAct()) { return; }
    if (chessState.selectedSq && tryChessMove(sq.r, sq.c, false)) { return; }
    var p = chessState.board[sq.r][sq.c];
    if (p && getPieceColor(p) === chessState.myColor) {
      var again = !!(chessState.selectedSq && chessState.selectedSq.r === sq.r && chessState.selectedSq.c === sq.c);
      selectSquare(sq.r, sq.c);
      chessDrag = { r: sq.r, c: sq.c, x: e.clientX, y: e.clientY, id: e.pointerId, active: false, again: again, piece: p };
    } else {
      chessState.selectedSq = null;
      chessState.legalMoves = [];
    }
    renderChessBoard();
  }

  function onBoardMove(e) {
    if (!chessDrag || e.pointerId !== chessDrag.id) { return; }
    if (!chessDrag.active) {
      if (Math.abs(e.clientX - chessDrag.x) + Math.abs(e.clientY - chessDrag.y) < 6) { return; }
      chessDrag.active = true;
      var size = $("chess-board").getBoundingClientRect().width / 8;
      var gh = document.createElement("div");
      gh.className = "cg-ghost";
      gh.style.width = gh.style.height = size + "px";
      gh.innerHTML = getPieceSVG(chessDrag.piece);
      document.body.appendChild(gh);
      chessDrag.ghost = gh;
      chessDrag.lifted = true;
      renderChessBoard();
    }
    chessDrag.ghost.style.left = e.clientX + "px";
    chessDrag.ghost.style.top = e.clientY + "px";
    e.preventDefault();
  }

  function onBoardUp(e, cancel) {
    if (!chessDrag || e.pointerId !== chessDrag.id) { return; }
    var d = chessDrag;
    chessDrag = null;
    if (d.ghost && d.ghost.parentNode) { d.ghost.parentNode.removeChild(d.ghost); }
    if (!d.active) {
      if (d.again) { chessState.selectedSq = null; chessState.legalMoves = []; renderChessBoard(); }
      return;
    }
    var sq = cancel ? null : sqFromPoint(e.clientX, e.clientY);
    if (!sq || !chessCanAct() || !tryChessMove(sq.r, sq.c, true)) { renderChessBoard(); }
  }

  function initChessBoardInput() {
    var b = $("chess-board");
    b.addEventListener("pointerdown", onBoardDown);
    window.addEventListener("pointermove", onBoardMove, { passive: false });
    window.addEventListener("pointerup", function (e) { onBoardUp(e, false); });
    window.addEventListener("pointercancel", function (e) { onBoardUp(e, true); });
    b.addEventListener("contextmenu", function (e) { e.preventDefault(); });
    $("chess-mv-prev").innerHTML = CG_IC.prev;
    $("chess-mv-next").innerHTML = CG_IC.next;
    $("chess-mv-prev").addEventListener("click", function () {
      var cur = chessHist.view === null ? chessPositions().length - 1 : chessHist.view;
      chessBrowse(cur - 1);
    });
    $("chess-mv-next").addEventListener("click", function () {
      if (chessHist.view !== null) { chessBrowse(chessHist.view + 1); }
    });
    $("chess-moves").addEventListener("click", function (e) {
      var el = e.target.closest ? e.target.closest(".cg-mv") : null;
      if (el) { chessBrowse(parseInt(el.getAttribute("data-i"), 10)); }
    });
    var els = document.querySelectorAll("#scr-chess-game [data-ic]");
    for (var i = 0; i < els.length; i++) { els[i].innerHTML = CG_IC[els[i].getAttribute("data-ic")] || ""; }
    renderSoundBtn();
    $("chess-sound-btn").addEventListener("click", function () {
      chessAudio.on = !chessAudio.on;
      try { window.localStorage.setItem(SOUND_KEY, chessAudio.on ? "1" : "0"); } catch (e) {}
      renderSoundBtn();
      if (chessAudio.on) { chessSoundUnlock(); chessSound("move"); }
    });
  }

  // O'yin boshlanganda (bot yoki jonli): eski effekt va tarix holati tozalanadi.
  function chessResetView() {
    chessFx.key = null;
    chessFx.prev = null;
    chessFx.noSlide = false;
    chessHist.view = null;
    chessHist.cacheKey = null;
    chessHist.drawnKey = null;
    if (chessDrag && chessDrag.ghost && chessDrag.ghost.parentNode) { chessDrag.ghost.parentNode.removeChild(chessDrag.ghost); }
    chessDrag = null;
    $("chess-end-row").classList.add("hidden");
    $("chess-controls").classList.remove("hidden");
  }

  function isPromotion(move) {
    var p = chessState.board[move.from.r][move.from.c];
    return (p === "P" && move.to.r === 0) || (p === "p" && move.to.r === 7);
  }

  // Piyoda oxirgi qatorga yetganda - qaysi donaga aylanishini o'yinchi tanlaydi.
  function askPromo(color, cb) {
    var row = $("chess-promo-row");
    row.innerHTML = "";
    ["q", "r", "b", "n"].forEach(function (k) {
      var b = document.createElement("button");
      b.type = "button";
      b.style.cssText = "width:64px;height:64px;border-radius:12px;border:1px solid var(--line);background:#dfc7a7;cursor:pointer;padding:6px;";
      b.innerHTML = getPieceSVG(color === "w" ? k.toUpperCase() : k);
      b.addEventListener("click", function (e) {
        e.stopPropagation();
        closePromo();
        cb(k);
      });
      row.appendChild(b);
    });
    $("chess-promo").classList.remove("hidden");
  }

  function closePromo() {
    var el = $("chess-promo");
    if (el) { el.classList.add("hidden"); }
  }

  // Bot bilan o'yin uchun durang qoidalari (jonli o'yinda buni server qiladi).
  function posKey() {
    var cs = chessState.castling;
    return chessState.board.map(function (row) {
      return row.map(function (p) { return p || "."; }).join("");
    }).join("/") + chessState.turn + (cs.wK ? "K" : "") + (cs.wQ ? "Q" : "") +
      (cs.bK ? "k" : "") + (cs.bQ ? "q" : "") + (chessState.ep ? sqName(chessState.ep.r, chessState.ep.c) : "-");
  }

  function insufficientMaterial(board) {
    var rest = [];
    for (var r = 0; r < 8; r++) {
      for (var c = 0; c < 8; c++) {
        var p = board[r][c];
        if (p && p.toUpperCase() !== "K") { rest.push({ p: p, sq: (r + c) % 2 }); }
      }
    }
    if (rest.length === 0) return true;
    if (rest.length === 1) return /[NBnb]/.test(rest[0].p);
    if (rest.length === 2 && rest[0].p.toUpperCase() === "B" && rest[1].p.toUpperCase() === "B") {
      return rest[0].sq === rest[1].sq;     // bir xil rangli katakdagi fillar
    }
    return false;
  }

  function executeMove(move) {
    if (chessState.gameMode === "pvp") { pvpSendMove(move); return; }

    var p = chessState.board[move.from.r][move.from.c];
    var target = chessState.board[move.to.r][move.to.c];
    var san = sanFor(chessState.board, move, chessState.castling, chessState.ep);

    // Handle castling rights
    if (p === "K") { chessState.castling.wK = false; chessState.castling.wQ = false; }
    if (p === "k") { chessState.castling.bK = false; chessState.castling.bQ = false; }
    if (move.from.r === 7 && move.from.c === 7 || move.to.r === 7 && move.to.c === 7) chessState.castling.wK = false;
    if (move.from.r === 7 && move.from.c === 0 || move.to.r === 7 && move.to.c === 0) chessState.castling.wQ = false;
    if (move.from.r === 0 && move.from.c === 7 || move.to.r === 0 && move.to.c === 7) chessState.castling.bK = false;
    if (move.from.r === 0 && move.from.c === 0 || move.to.r === 0 && move.to.c === 0) chessState.castling.bQ = false;

    // Apply move
    chessState.board = makeSimMove(chessState.board, move);
    chessState.ep = move.isDoublePawn ? { r: (move.from.r + move.to.r) / 2, c: move.from.c } : null;
    chessState.lastMove = move;
    chessState.selectedSq = null;
    chessState.legalMoves = [];
    chessState.halfmove = (target || move.isEnPassant || p.toUpperCase() === "P") ? 0 : chessState.halfmove + 1;

    // Switch turn
    chessState.turn = (chessState.turn === "w" ? "b" : "w");
    var key = posKey();
    chessState.seen[key] = (chessState.seen[key] || 0) + 1;
    chessState.sans.push(san);
    chessState.ucis.push(moveUci(move));
    chessState.hist.push({ board: cloneBoard(chessState.board), last: move, turn: chessState.turn });
    renderChessBoard();
    updateChessClocks();

    // Check game over local
    var nextLegal = getAllLegalMoves(chessState.board, chessState.turn, chessState.castling, chessState.ep);
    if (nextLegal.length === 0) {
      if (isKingInCheck(chessState.board, chessState.turn)) {
        finishChessGame(chessState.turn === chessState.myColor ? "loss" : "win", "mate");
      } else {
        finishChessGame("draw", "stalemate");
      }
      return;
    }
    if (insufficientMaterial(chessState.board)) { finishChessGame("draw", "insufficient"); return; }
    if (chessState.halfmove >= 100) { finishChessGame("draw", "fifty"); return; }
    if (chessState.seen[key] >= 3) { finishChessGame("draw", "repetition"); return; }

    if (chessState.turn !== chessState.myColor && !chessState.gameOver) { botMove(400); }
  }

  /* --- BOT: fon oqimidagi miya (chessbot.js) ---
     Bot alohida oqimda o'ylaydi - ekran qotmaydi. Har daraja o'z vaqtida
     javob beradi (soat kam qolsa - tezroq). Fon oqimi ishlamasa (juda eski
     telefon) - eski sodda hisob, lekin faqat sayoz (qotmasin). */

  var chessBot = { worker: null, failed: false, id: 0 };
  var BOT_TIME = { novice: 150, easy: 250, med: 700, hard: 900, master: 2000 };
  var BOT_PIECE = { novice: "p", easy: "n", med: "r", hard: "q", master: "k" };

  function chessBotWorker() {
    if (chessBot.worker || chessBot.failed) { return chessBot.worker; }
    try {
      chessBot.worker = new Worker("chessbot.js?v=1");
      chessBot.worker.onerror = function () { chessBot.failed = true; chessBot.worker = null; };
    } catch (e) { chessBot.failed = true; }
    return chessBot.worker;
  }

  function uciToLocal(u) {
    var from = uciSq(u.slice(0, 2)), to = uciSq(u.slice(2, 4));
    var m = getLegalMovesForSquare(chessState.board, from.r, from.c, chessState.castling, chessState.ep)
      .find(function (x) { return x.to.r === to.r && x.to.c === to.c; });
    if (m && u.length > 4) { m.promo = u.charAt(4); }
    return m || null;
  }

  function botMove(minDelay) {
    var seq = chessState.botSeq, started = Date.now();
    function play(m) {
      if (!m || seq !== chessState.botSeq || chessState.gameOver || chessState.gameMode !== "bot" ||
          chessState.turn === chessState.myColor) { return; }
      setTimeout(function () {
        if (seq !== chessState.botSeq || chessState.gameOver || chessState.turn === chessState.myColor) { return; }
        executeMove(m);
      }, Math.max(0, minDelay - (Date.now() - started)));
    }
    function fallback() {
      play(getBestBotMove(chessState.board, (chessState.botDiff === "easy" || chessState.botDiff === "novice") ? "easy" : "med",
                          chessState.turn, chessState.castling, chessState.ep));
    }
    var w = chessBotWorker();
    if (!w) { setTimeout(fallback, 50); return; }
    var id = ++chessBot.id, answered = false;
    var left = (chessState.turn === "w" ? chessState.whiteTime : chessState.blackTime) * 1000;
    var budget = Math.max(100, Math.min(BOT_TIME[chessState.botDiff] || 700, left / 25));
    w.onmessage = function (e) {
      if (!e.data || e.data.id !== id) { return; }
      answered = true;
      var m = e.data.uci ? uciToLocal(e.data.uci) : null;
      if (m) { play(m); } else { fallback(); }
    };
    w.postMessage({ cmd: "move", id: id, moves: chessState.ucis.slice(), level: chessState.botDiff, time: budget });
    // Javob kelmasa (oqim osilib qolsa) - baribir yuramiz.
    setTimeout(function () { if (!answered && id === chessBot.id) { answered = true; fallback(); } }, budget + 4000);
  }

  // Bot bilan o'yin natijasi (jonli o'yinda natijani server aytadi - pvpShowEnd).
  function finishChessGame(result, reason) {
    chessState.gameOver = true;
    try { sqDone("chess"); } catch (e) {}       // kunlik sandiq: bot bilan o'yin ham sanaladi
    stopBotClock();
    closePromo();
    showChessOverlay(result, reason, "");
    // Sehrgarlar zinapoyasi: botlar ustidan natija (bezak - ball va reyting bermaydi).
    if (chessState.gameMode === "bot" && chessState.sans.length >= 2) {
      chessApi("botresult", { level: chessState.botDiff, result: result }).then(function () {
        var b = chessStats.bots || {}, r = b[chessState.botDiff] || { w: 0, d: 0, l: 0 };
        r[{ win: "w", draw: "d", loss: "l" }[result]]++;
        b[chessState.botDiff] = r;
        chessStats.bots = b;
      })["catch"](function () {});
    }
  }

  function showChessOverlay(result, reason, extra) {
    var icon = $("chess-overlay-icon");
    var title = $("chess-overlay-title");
    var desc = $("chess-overlay-desc");
    var rtxt = reasonText(reason, result);

    chessSound(result === "win" ? "win" : result === "loss" ? "loss" : "draw");
    $("btn-chess-overlay-again").classList.toggle("hidden", chessState.gameMode !== "bot");
    $("chess-end-row").classList.add("hidden");
    if (result === "win") {
      icon.textContent = "🏆";
      title.textContent = L("win");
      title.style.color = "#2ecc71";
      desc.textContent = rtxt + "." + (extra ? " " + extra : "");
    } else if (result === "loss") {
      icon.textContent = "💀";
      title.textContent = L("loss");
      title.style.color = "#e74c3c";
      desc.textContent = rtxt + ". " + (extra || L("lossTail"));
    } else if (result === "draw") {
      icon.textContent = "🤝";
      title.textContent = L("draw");
      title.style.color = "#f1c40f";
      desc.textContent = rtxt + ". " + (extra || L("drawTail"));
    } else {
      icon.textContent = "🚫";
      title.textContent = L("aborted");
      title.style.color = "var(--dim)";
      desc.textContent = rtxt + ".";
    }
    // Jonli o'yin (bot emas) tarixda qoladi - shuni aytamiz: raqib ham keyin qayta ko'ra oladi
    if (chessState.gameMode !== "bot" && result !== "aborted" && (result === "win" || result === "loss" || result === "draw")) {
      desc.textContent += " " + L("savedNote");
      chessLastAt = 0;
    }
    $("chess-board-overlay").classList.remove("hidden");
  }

  var chessResume = null;

  var CHESS_IC = {
    swords: chatSvg('<path d="M14.5 17.5 3 6V3h3l11.5 11.5"/><path d="m13 19 6-6"/><path d="m16 16 4 4"/><path d="m19 21 2-2"/><path d="M14.5 6.5 18 3h3v3l-3.5 3.5"/><path d="m5 14 4 4"/><path d="m7 17-3 3"/><path d="m3 19 2 2"/>'),
    send: chatSvg('<path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>'),
    bot: chatSvg('<path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2M20 14h2M15 13v2M9 13v2"/>'),
    play: chatSvg('<path d="M7 4.5v15l12-7.5Z"/>'),
    search: chatSvg('<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>'),
    chat: chatSvg('<path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12Z"/>'),
    wand: chatSvg('<path d="m3 21 12-12"/><path d="M15 4V2M15 16v-2M8 9H6M22 9h-2M17.8 11.8 19 13M17.8 6.2 19 5M12.2 6.2 11 5"/>')
  };
  var chessHubDrawn = false;
  var chessSeason = null;

  function renderChessHub() {
    var i, els, th = chessTheme();
    if (!chessHubDrawn) {
      chessHubDrawn = true;
      els = document.querySelectorAll("#scr-chess-hub [data-ic]");
      for (i = 0; i < els.length; i++) { els[i].innerHTML = CHESS_IC[els[i].getAttribute("data-ic")] || ""; }
    }
    // Uslubga bog'liq qismlar har safar qayta chiziladi.
    $("ch-mark-piece").innerHTML = getPieceSVG("N");
    els = document.querySelectorAll("#ch-mark i");
    for (i = 0; i < els.length; i++) { els[i].style.background = (i === 0 || i === 3) ? th.sq[0] : th.sq[1]; }
    $("ch-mark").style.borderColor = th.pieces === "marble" ? "rgba(var(--gold-rgb),.75)" : "rgba(155,89,182,.55)";
    els = document.querySelectorAll("#scr-chess-hub [data-piece]");
    for (i = 0; i < els.length; i++) {
      els[i].innerHTML = getPieceSVG(els[i].getAttribute("data-piece"));
      els[i].style.background = th.sq[0];
    }
    chessSegs("ch-time", chessTc().key, chessTcLabel);
    // Shu vaqtda raqib qidirayotganlar - tugma ustida son (bosilsa darhol o'yin).
    var seekers = chessSeekers || {};
    els = document.querySelectorAll("#ch-time [data-v]");
    for (i = 0; i < els.length; i++) {
      var n = seekers[els[i].getAttribute("data-v")];
      if (n) { els[i].insertAdjacentHTML("beforeend", '<span class="n">' + n + "</span>"); }
    }
    var here = seekers[chessTc().key] || 0;
    $("ch-seekers").textContent = here ? L("seekersHere").replace("%d", here) : "";
    $("ch-seekers").classList.toggle("hidden", !here);
    $("btn-announce-house").classList.toggle("hidden", !cupMe().house);
    // Botlar: daraja nuqtalari va tanlanganining ismi, darajasi, tavsifi.
    els = document.querySelectorAll("#scr-chess-hub [data-lv]");
    for (i = 0; i < els.length; i++) {
      var lv = +els[i].getAttribute("data-lv"), dots = "";
      for (var d = 1; d <= 5; d++) { dots += '<i' + (d <= lv ? ' class="on"' : "") + "></i>"; }
      els[i].innerHTML = dots;
    }
    var bot = chessBotDiff();
    $("ch-bot-name").textContent = L("botNames")[bot] || "";
    $("ch-bot-level").textContent = L({ novice: "lvlNovice", easy: "lvlEasy", med: "lvlMed", hard: "lvlHard", master: "lvlMaster" }[bot]);
    $("ch-bot-tag").textContent = (L("botTags") || {})[bot] || "";
    chessSegs("ch-color", chessPref(BOT_COLOR_KEY, "w", ["w", "r", "b"]), function (v) {
      return L({ w: "colWhite", r: "colRandom", b: "colBlack" }[v]);
    });
    els = document.querySelectorAll("#ch-themes [data-v]");
    for (i = 0; i < els.length; i++) {
      var name = els[i].getAttribute("data-v"), t = chessTheme(name);
      els[i].classList.toggle("on", name === chessThemeName());
      var cells = els[i].querySelectorAll(".mini i");
      for (var k = 0; k < cells.length; k++) { cells[k].style.background = (k === 0 || k === 3) ? t.sq[0] : t.sq[1]; }
      els[i].querySelector(".mini span").innerHTML = getPieceSVG("n", t.pieces);
    }
    $("ch-pill-win").innerHTML = L("pillWin").replace("%s", "<b>+10</b>");
    $("ch-pill-draw").innerHTML = L("pillDraw").replace("%s", "<b>+5</b>");
    var sp = $("ch-pill-season");
    if (chessSeason) {
      sp.innerHTML = L("pillSeason").replace("%s", "<b>" + chessSeason.used + "/" + chessSeason.limit + "</b>");
      sp.classList.remove("hidden");
    } else {
      sp.classList.add("hidden");
    }
  }

  // Tanlov tugmalari (vaqt, rang): tanlangani belgilanadi, matni tilga qarab.
  function chessSegs(id, current, label) {
    var els = document.querySelectorAll("#" + id + " [data-v]");
    for (var i = 0; i < els.length; i++) {
      var v = els[i].getAttribute("data-v");
      els[i].textContent = label(v);
      els[i].classList.toggle("on", v === current);
    }
  }

  // O'yinchi belgisi: fakultet gerbi; bot uchun - uning donasi.
  function chessAvatar(el, house, piece) {
    var key = piece ? "p:" + piece : "h:" + (house || "");
    if (el.getAttribute("data-k") === key) { return; }
    el.setAttribute("data-k", key);
    el.innerHTML = "";
    if (piece) {
      el.innerHTML = '<span style="display:block;width:30px;height:30px;border-radius:8px;background:#dfc7a7;padding:3px;box-sizing:border-box">' + getPieceSVG(piece) + "</span>";
      return;
    }
    var img = house ? cupCrestImg(house, 28) : null;
    if (img) { el.appendChild(img); } else { el.textContent = "🧙"; }
  }

  // Hubda: davom etayotgan yoki do'st kutayotgan o'yin - qaytish tugmasi bilan.
  function chessRefreshMine() {
    var box = $("chess-resume");
    chessApi("mine").then(function (res) {
      if (res && res.seeking) { chessSeekers = res.seeking; }
      if (res && res.season) { chessSeason = res.season; }
      if (res && res.rating) { renderRateCard(res.rating); }
      if (res && res.bots) { renderBotBadges(res.bots); }
      renderChessHub();
      var g = res && res.games && res.games[0];
      chessResume = g || null;
      if (!g) { box.classList.add("hidden"); return; }
      var opp = g.you === "b" ? g.white : g.black;
      if (g.status === "waiting") {
        $("chess-resume-head").textContent = L("waitHead");
        $("chess-resume-sub").textContent = L("codeLbl") + " " + g.id + " • " + timeLabel(g);
      } else {
        $("chess-resume-head").textContent = L("resumeHead");
        $("chess-resume-sub").textContent = ((opp && opp.name) || L("opp")) + " • " +
          (g.turn === g.you ? L("yourTurn") : L("oppThinking"));
      }
      $("chess-resume-cancel").classList.toggle("hidden", g.status !== "waiting");
      box.classList.remove("hidden");
    })["catch"](function () {});
  }

  function openChessHub() {
    applyXT();
    chessSoundUnlock();     // bosishdan keyin - iPhone ovozni shunda ruxsat beradi; fayllar oldindan yuklanadi
    pvpStopPoll();
    stopBotClock();
    closePromo();
    $("scr-cup").classList.add("hidden");
    $("scr-cat").classList.add("hidden");
    $("scr-chess-game").classList.add("hidden");
    $("scr-chess-stats").classList.add("hidden");
    $("scr-chess-hub").classList.remove("hidden");
    renderChessHub();
    renderBotBadges();
    chessRefreshMine();
    loadLastGames();
    // Hub ochiq turganda raqib qidirayotganlar soni yangilanib turadi.
    stopHubTimer();
    chessHubTimer = setInterval(function () {
      if ($("scr-chess-hub").classList.contains("hidden") || document.hidden) { return; }
      chessRefreshMine();
    }, 8000);
  }

  function closeChessHub() {
    seekStop(true);
    stopHubTimer();
    $("scr-chess-hub").classList.add("hidden");
    openCup();
  }

  var chessHubTimer = null;
  var chessSeekers = null;

  function stopHubTimer() {
    if (chessHubTimer) { clearInterval(chessHubTimer); chessHubTimer = null; }
  }

  function chessBotDiff() {
    var r = document.querySelector('input[name="chess-bot-diff"]:checked');
    return r ? r.value : "easy";
  }

  function chessTc() {
    var key = chessPref(TIME_KEY, "300+0", ["60+0", "180+2", "300+0", "600+0"]), p = key.split("+");
    return { key: key, base: +p[0], inc: +p[1] };
  }

  function chessTcLabel(v) {
    var p = String(v).split("+"), m = +p[0] / 60;
    return m + (+p[1] ? "+" + p[1] : " " + L("minShort"));
  }

  /* --- TASODIFIY RAQIB ---
     Server navbati: shu vaqtni tanlagan boshqa odam bo'lsa - darhol o'yin
     (ranglar tasodifiy), bo'lmasa so'rov o'zgarish bo'lguncha ushlab turiladi.
     30 soniyadan keyin - chatga e'lon qilish yoki bot bilan o'ynash taklifi. */

  var chessSeek = { on: false, gen: 0, started: 0, timer: null, tc: null };

  function seekUI() {
    var on = chessSeek.on;
    $("ch-pvp-actions").classList.toggle("hidden", on);
    $("ch-seek-panel").classList.toggle("hidden", !on);
    if (!on) { return; }
    var sec = Math.floor((Date.now() - chessSeek.started) / 1000);
    $("ch-seek-sub").textContent = chessTcLabel(chessSeek.tc.key) + " · " + formatTime(sec);
    var slow = sec >= 30;
    $("ch-seek-hint").classList.toggle("hidden", !slow);
    $("ch-seek-more").classList.toggle("hidden", !slow);
  }

  function seekStart() {
    if (chessSeek.on) { return; }
    chessSoundUnlock();
    chessSeek.on = true;
    chessSeek.gen++;
    chessSeek.started = Date.now();
    chessSeek.tc = chessTc();
    chessSeek.timer = setInterval(seekUI, 500);
    $("ch-announce").classList.add("hidden");
    seekUI();
    seekPoll(chessSeek.gen);
  }

  function seekPoll(gen) {
    var tc = chessSeek.tc;
    chessApi("seek", { base: tc.base, inc: tc.inc, wait: 1 }).then(function (res) {
      if (gen !== chessSeek.gen || !chessSeek.on) { return; }
      if (res && res.game_id) {
        seekStop(false);
        if (res.error === "has_active") { showToast(L("hasActive")); }
        joinPvPGame(res.game_id);
        return;
      }
      if (res && res.searching) {
        chessSeekers = res.counts;
        seekPoll(gen);
        return;
      }
      throw new Error("seek");
    })["catch"](function () {
      if (gen !== chessSeek.gen || !chessSeek.on) { return; }
      setTimeout(function () { if (gen === chessSeek.gen && chessSeek.on) { seekPoll(gen); } }, 2000);
    });
  }

  function seekStop(tell) {
    if (!chessSeek.on) { return; }
    chessSeek.on = false;
    chessSeek.gen++;
    clearInterval(chessSeek.timer);
    seekUI();
    if (tell) {
      // Bekor qilish paytida juftlik topilib qolgan bo'lsa - o'yin baribir boshlangan.
      chessApi("seek", { cancel: true }).then(function (res) {
        if (res && res.game_id) { joinPvPGame(res.game_id); }
      })["catch"](function () {});
    }
  }

  /* --- CHATGA E'LON / SHAXSIY TAKLIF ---
     Chatda karta paydo bo'ladi: kim chaqiryapti, vaqt va "Qabul qilish". Kimdir
     qabul qilsa yoki o'yin tugasa - karta hamma uchun jonli yangilanadi. */

  function chessAnnounce(room) {
    var tc = chessTc(), d = chatInitData();
    fetch(API_CHAT, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Telegram-Init-Data": d },
      body: JSON.stringify({ action: "chess", room: room, base: tc.base, inc: tc.inc, v: 2, initData: d })
    }).then(function (r) { return r.json(); }).then(function (res) {
      if (res && res.ok && res.game) {
        seekStop(true);
        showToast(L("announced"));
        openPvP(res.game);
        return;
      }
      if (res && res.error === "has_active" && res.game_id) { showToast(L("hasActive")); joinPvPGame(res.game_id); return; }
      if (res && res.error === "slow") { showToast(L("chatSlow").replace("%s", res.retry || 5), "err"); return; }
      if (res && res.error === "banned") { showToast(L("chatBannedShort"), "err"); return; }
      if (res && String(res.error || "").indexOf("dm_") === 0) { showToast(L("chatDmClosedShort"), "err"); return; }
      showToast(L("err"), "err");
    })["catch"](function () { showToast(L("netErr"), "err"); });
  }

  function chessChatCard(m) {
    var c = m.chess, me = (chatUser().id || 0), el = document.createElement("div");
    el.className = "cmc";
    var wn = (c.white && c.white.name) || "Sehrgar", bn = (c.black && c.black.name) || "Sehrgar";
    var player = me == c.white.uid || (c.black && me == c.black.uid);
    var st, btn = "";
    function act(label, gold) {
      return '<button type="button" class="cmc-b' + (gold ? " gold" : "") + '" data-chess-act="1" data-g="' +
        escapeHtmlChess(c.id) + '">' + escapeHtmlChess(label) + "</button>";
    }
    if (c.status === "waiting") {
      if (me == c.white.uid) { st = L("cardMine"); btn = act(L("cardOpen"), false); }
      else { st = L("cardCalls").replace("%s", wn); btn = act(L("cardAccept"), true); }
    } else if (c.status === "active") {
      st = wn + " ⚔ " + bn + " — " + L("cardPlaying");
      if (player) { btn = act(L("resumeBtn"), false); }
    } else if (c.status === "finished") {
      st = wn + " ⚔ " + bn + " — " + (c.winner ? L("cardWon").replace("%s", c.winner == c.white.uid ? wn : bn) : L("draw"));
    } else {
      st = L("cardExpired");
    }
    el.innerHTML = '<div class="cmc-h"><span class="cmc-ic">' + getPieceSVG("N", "marble") + "</span><div><b>" +
      escapeHtmlChess(L("chessHubTitle")) + "</b><span>" + escapeHtmlChess(chessTcLabel(c.base + "+" + (c.inc || 0))) +
      " · " + escapeHtmlChess(L("cardLive")) + '</span></div></div><div class="cmc-s">' + escapeHtmlChess(st) + "</div>" + btn;
    return el;
  }

  function chessFromChat(gid) {
    joinPvPGame(gid);
  }

  var BOT_COLOR_KEY = "chess_bot_color";
  var TIME_KEY = "chess_time";

  function chessPref(key, def, allowed) {
    var v = def;
    try { v = window.localStorage.getItem(key) || def; } catch (e) {}
    return allowed.indexOf(v) > -1 ? v : def;
  }

  function setChessPref(key, v) {
    try { window.localStorage.setItem(key, v); } catch (e) {}
  }

  function startBotGame() {
    chessSoundUnlock();
    chessBotWorker();
    seekStop(true);
    stopHubTimer();
    var diff = chessBotDiff();
    var pick = chessPref(BOT_COLOR_KEY, "w", ["w", "r", "b"]);
    var color = pick === "r" ? (Math.random() < 0.5 ? "w" : "b") : pick;

    pvpStopPoll();
    stopBotClock();
    chessNet.game = null;
    chessState.botSeq = (chessState.botSeq || 0) + 1;     // eski o'yinning kechikkan javobi e'tiborsiz
    chessState.gameMode = "bot";
    chessState.botDiff = diff;
    chessState.myColor = color;
    chessState.pvpGameId = null;

    initChessEngine();
    chessResetView();

    var botColor = color === "w" ? L("black") : L("white");
    $("chess-my-name").textContent = (tg && tg.initDataUnsafe && tg.initDataUnsafe.user && tg.initDataUnsafe.user.first_name) || L("you");
    $("chess-my-sub").textContent = (color === "w" ? L("white") : L("black")) + " • " + cupHouseName(cupMe().house);

    var botNames = L("botNames");
    $("chess-opp-name").textContent = botNames[diff] || "Bot";
    $("chess-opp-sub").textContent = botColor + " • 05:00";
    chessAvatar($("chess-opp-avatar"), null, BOT_PIECE[diff] || "p");
    chessAvatar($("chess-my-avatar"), cupMe().house);
    $("chess-invite-btn").classList.add("hidden");
    $("btn-chess-resign").classList.remove("hidden");
    $("btn-chess-resign-tx").textContent = L("resign");
    $("btn-chess-draw").classList.add("hidden");
    $("chess-offer").classList.add("hidden");
    closePromo();

    $("chess-board-overlay").classList.add("hidden");
    $("scr-chess-hub").classList.add("hidden");
    $("scr-chess-game").classList.remove("hidden");

    renderChessBoard();
    updateChessClocks();
    startBotClock();
    chessSound("start");
    if (color === "b") { botMove(700); }     // bot oq donalarda - birinchi yurish uniki
  }
  function chessInvite(code, shareId) {
    var canShare = false;
    try { canShare = !!(tg && tg.shareMessage && tg.isVersionAtLeast && tg.isVersionAtLeast("8.0")); } catch (e) {}
    if (canShare && shareId) { chessShare(code, shareId); return; }
    if (canShare) {
      chessApi("share", { game_id: code, lang: lang }).then(function (res) {
        if (res && res.ok && res.id) { chessShare(code, res.id); } else { chessInviteInline(code); }
      })["catch"](function () { chessInviteInline(code); });
      return;
    }
    chessInviteInline(code);
  }

  function chessShare(code, id) {
    try { tg.shareMessage(id, function () {}); }
    catch (e) { chessInviteInline(code); }
  }

  function chessInviteInline(code) {
    try {
      if (tg && tg.switchInlineQuery && tg.isVersionAtLeast && tg.isVersionAtLeast("6.7")) {
        tg.switchInlineQuery("chess_" + code, ["users", "groups"]);
        return;
      }
    } catch (e) {}
    var url = "https://t.me/" + BOT + "/catalog?startapp=chess_" + code;
    // Kod ham yoziladi: havola ochilmasa, do'st uni shaxmat bo'limida qo'lda kirita oladi.
    var text = L("inviteText") + "\n" + L("codeLbl") + " " + code;
    if (tg && tg.openTelegramLink) {
      tg.openTelegramLink("https://t.me/share/url?url=" + encodeURIComponent(url) +
        "&text=" + encodeURIComponent(text));
    } else {
      prompt(L("linkPrompt"), text + "\n" + url);
    }
  }

  function joinErrText(code) {
    if (code === "not_found") return L("jNotFound");
    if (code === "game_already_started") return L("jStarted");
    return L("err");
  }

  var chessCreating = false;

  function createPvPGame() {
    if (chessCreating) return;
    chessCreating = true;
    var tc = chessPref(TIME_KEY, "300+0", ["60+0", "180+2", "300+0", "600+0"]).split("+");
    chessApi("create", { base: +tc[0], inc: +tc[1], lang: lang }).then(function (res) {
      chessCreating = false;
      if (res && res.ok && res.game) {
        openPvP(res.game);
        chessInvite(res.game.id, res.share_id);
        return;
      }
      if (res && res.error === "has_active" && res.game_id) {
        showToast(L("hasActive"));
        joinPvPGame(res.game_id);
        return;
      }
      showToast(res && res.error === "slow" ? L("slowCreate") : L("err"), "err");
    })["catch"](function () {
      chessCreating = false;
      showToast(L("netErr"), "err");
    });
  }

  // Kod qo'lda yozilsa ham, butun taklif havolasi tashlansa ham ishlaydi.
  function joinPvPGame(code) {
    var text = String(code || "");
    var m = /chess_([0-9a-f]{8})/i.exec(text) || /\b([0-9a-f]{8})\b/i.exec(text);
    if (!m) { showToast(L("badCode"), "err"); return; }
    chessApi("join", { game_id: m[1].toLowerCase() }).then(function (res) {
      if (res && res.ok && res.game) {
        $("input-join-code").value = "";
        openPvP(res.game);
        return;
      }
      if (res && res.error === "has_active" && res.game_id) {
        showToast(L("hasActive"));
        joinPvPGame(res.game_id);
        return;
      }
      showToast(L("joinFail") + joinErrText(res && res.error), "err");
    })["catch"](function () { showToast(L("netErr"), "err"); });
  }

  // Taklif havolasi (t.me/<bot>/catalog?startapp=chess_<kod>) bilan kelgan
  // do'st katalog ochilishi bilan to'g'ridan-to'g'ri o'yinga tushadi.
  var pendingChess = null;
  var pendingWorld = false;     // ?startapp=olam bilan kelinganmi
  try {
    var sp = (tg && tg.initDataUnsafe && tg.initDataUnsafe.start_param) || "";
    if (!sp) {
      var spm = /[?&#]tgWebAppStartParam=([^&#]+)/.exec((window.location.search || "") + (window.location.hash || ""));
      if (spm) { sp = decodeURIComponent(spm[1]); }
    }
    var cm = /^chess_([0-9a-f]{8})$/i.exec(sp);
    if (cm) { pendingChess = cm[1].toLowerCase(); }
    if (/^(olam|world)$/i.test(sp)) { pendingWorld = true; }
  } catch (e) { pendingChess = null; pendingWorld = false; }

  function maybeChessLink() {
    if (!pendingChess) { return; }
    var code = pendingChess;
    pendingChess = null;
    joinPvPGame(code);
  }

  // 9¾ tugmasining o'zi: saralanmaganga avval maktub, keyin g'isht devor.
  // Tugma ham, havola ham shu yerdan o'tadi - yo'l bir xil bo'lsin.
  function goWorld() {
    // Saralanmagan odam har doim avval MAKTUBNI ko'radi (egasi, 2026-10-03): yo'lni boshlab,
    // to'xtab qaytgan bo'lsa ham - qaysi qadamga kelganini ko'rib, o'zi "davom" ni bosadi.
    // Ilgari yo'l shu zahoti boshlanib ketardi va odam nima bo'layotganini tushunmasdi.
    if (!hasHouse()) { openLetter(false); return; }
    playGate(enterWorld);
  }

  // Kanaldagi post havolasi (t.me/<bot>/catalog?startapp=olam) bilan kelgan
  // odam katalog ochilishi bilan to'g'ridan-to'g'ri sehrli olamga tushadi.
  function maybeWorldLink() {
    if (!pendingWorld) { return; }
    pendingWorld = false;
    goWorld();
  }

  function leaveChessGame() {
    chessState.botSeq = (chessState.botSeq || 0) + 1;     // bot o'ylayotgan bo'lsa - javobi kerak emas
    seekStop(true);
    pvpStopPoll();
    stopBotClock();
    closePromo();
    // Reyting ekranidan kelingan bo'lsa (tarix, zinapoya, chaqiruv) - o'shanga qaytamiz.
    if (chessStats.from === "stats") {
      chessStats.from = null;
      $("scr-chess-game").classList.add("hidden");
      openChessStats();
      return;
    }
    openChessHub();
  }

  function initChessUI() {
    $("chess-hub-back").addEventListener("click", worldGuard(closeChessHub));
    $("btn-start-bot-game").addEventListener("click", startBotGame);
    $("btn-create-pvp-game").addEventListener("click", createPvPGame);
    $("btn-join-pvp-game").addEventListener("click", function() { joinPvPGame($("input-join-code").value); });
    $("chess-invite-btn").addEventListener("click", function () {
      if (chessNet.game) { chessInvite(chessNet.game.id); }
    });
    $("chess-resume-go").addEventListener("click", function () {
      if (chessResume) { joinPvPGame(chessResume.id); }
    });
    $("chess-resume-cancel").addEventListener("click", function () {
      if (!chessResume) return;
      chessApi("action", { game_id: chessResume.id, action: "abort" })
        .then(chessRefreshMine)["catch"](function () { showToast(L("netErr"), "err"); });
    });
    $("chess-game-back").addEventListener("click", function() {
      if (chessState.gameMode === "pvp") {
        // Jonli o'yin serverda davom etadi - chiqish taslim bo'lish EMAS.
        var g = chessNet.game;
        if (g && g.status === "active" && g.ply >= 2) { chessAsk(L("leaveLive"), leaveChessGame); }
        else { leaveChessGame(); }
        return;
      }
      if (chessState.gameOver) { leaveChessGame(); return; }
      chessAsk(L("leaveAsk"), leaveChessGame);
    });
    $("btn-chess-resign").addEventListener("click", function() {
      if (chessState.gameOver) return;
      if (chessState.gameMode !== "pvp") {
        chessAsk(L("resignAsk"), function () { finishChessGame("loss", "resign"); });
        return;
      }
      var g = chessNet.game;
      if (!g) return;
      if (g.status === "waiting" || g.ply < 2) { chessAsk(L("abortAsk"), function () { pvpAction("abort"); }); }
      else { chessAsk(L("resignAsk"), function () { pvpAction("resign"); }); }
    });
    $("btn-chess-draw").addEventListener("click", function () {
      if (chessState.gameMode === "pvp" && chessNet.game && chessNet.game.can_offer) { pvpAction("draw_offer"); }
    });
    $("chess-offer-yes").addEventListener("click", function () { pvpAction("draw_accept"); });
    $("chess-offer-no").addEventListener("click", function () { pvpAction("draw_decline"); });
    $("chess-promo").addEventListener("click", function (e) { if (e.target === this) { closePromo(); } });
    $("btn-chess-overlay-ok").addEventListener("click", leaveChessGame);
    $("btn-chess-overlay-view").addEventListener("click", function () {
      $("chess-board-overlay").classList.add("hidden");
      $("chess-controls").classList.add("hidden");
      $("btn-chess-again").classList.toggle("hidden", chessState.gameMode !== "bot");
      $("chess-end-row").classList.remove("hidden");
    });
    $("btn-chess-overlay-again").addEventListener("click", startBotGame);
    $("btn-chess-again").addEventListener("click", startBotGame);
    $("btn-chess-leave").addEventListener("click", leaveChessGame);
    function segClick(id, key) {
      $(id).addEventListener("click", function (e) {
        var b = e.target.closest ? e.target.closest("[data-v]") : null;
        if (!b) return;
        setChessPref(key, b.getAttribute("data-v"));
        renderChessHub();
      });
    }
    segClick("ch-time", TIME_KEY);
    segClick("ch-color", BOT_COLOR_KEY);
    $("ch-themes").addEventListener("click", function (e) {
      var b = e.target.closest ? e.target.closest("[data-v]") : null;
      if (!b) return;
      setChessTheme(b.getAttribute("data-v"));
      renderChessHub();
    });
    $("btn-seek").addEventListener("click", seekStart);
    $("btn-seek-cancel").addEventListener("click", function () { seekStop(true); renderChessHub(); });
    $("btn-announce").addEventListener("click", function () { $("ch-announce").classList.toggle("hidden"); });
    $("btn-announce-house").addEventListener("click", function () { chessAnnounce("house"); });
    $("btn-announce-global").addEventListener("click", function () { chessAnnounce("global"); });
    $("btn-seek-announce").addEventListener("click", function () { chessAnnounce("global"); });
    $("btn-seek-bot").addEventListener("click", function () { seekStop(true); startBotGame(); });
    var radios = document.getElementsByName("chess-bot-diff");
    for (var ri = 0; ri < radios.length; ri++) { radios[ri].addEventListener("change", renderChessHub); }
    initChessBoardInput();
    initChessStatsUI();
  }

  /* --- REYTING, TARIX, SEHRGARLAR ZINAPOYASI ---
     Reyting (Elo) faqat jonli o'yinlarda o'zgaradi, hisobni server qiladi.
     Unvon - shaxmat donasi: Piyoda -> Ot -> Fil -> Ruh -> Farzin -> Shoh.
     Tarixdagi o'yinni bosib, uni yurishma-yurish qayta ko'rish mumkin.
     Zinapoya - beshta sehrgar botdan qaysilari yengilgani (bezak, ball yo'q). */

  var TITLE_PIECE = { pawn: "P", knight: "N", bishop: "B", rook: "R", queen: "Q", king: "K" };
  var BOT_ORDER = ["novice", "easy", "med", "hard", "master"];
  var chessStats = { tab: "top", filter: "all", prof: null, top: {}, bots: null, from: null };

  function titleName(t) { return L("title_" + (t || "pawn")); }

  function renderRateCard(r) {
    if (!r) { return; }
    $("ch-rate-piece").innerHTML = getPieceSVG(TITLE_PIECE[r.title] || "P", "marble");
    $("ch-rate-num").textContent = r.rating;
    $("ch-rate-title").textContent = titleName(r.title);
    $("ch-rate-sub").textContent = r.games
      ? L("rateSub").replace("%r", r.rank || "—").replace("%g", r.games)
      : L("rateNew");
  }

  function renderBotBadges(bots) {
    chessStats.bots = bots || chessStats.bots || {};
    var els = document.querySelectorAll('#scr-chess-hub input[name="chess-bot-diff"]');
    for (var i = 0; i < els.length; i++) {
      var t = els[i].nextElementSibling, won = (chessStats.bots[els[i].value] || {}).w > 0;
      var mark = t.querySelector(".won");
      if (won && !mark) { t.insertAdjacentHTML("beforeend", '<span class="won">' + CHAT_SVG.check + "</span>"); }
      if (!won && mark) { mark.parentNode.removeChild(mark); }
    }
  }

  function csDate(iso) {
    var d = new Date(iso);
    if (isNaN(d.getTime())) { return ""; }
    return ("0" + d.getDate()).slice(-2) + "." + ("0" + (d.getMonth() + 1)).slice(-2) + " · " +
      ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2);
  }

  function csSpark(series) {
    var box = $("cs-spark");
    if (!series || series.length < 2) { box.innerHTML = ""; box.style.display = "none"; return; }
    box.style.display = "";
    var w = 300, h = 54, lo = Math.min.apply(null, series), hi = Math.max.apply(null, series), span = Math.max(20, hi - lo);
    var pts = series.map(function (v, i) {
      return (i * w / (series.length - 1)).toFixed(1) + "," + (h - 6 - (v - lo) / span * (h - 12)).toFixed(1);
    });
    box.innerHTML = '<svg viewBox="0 0 ' + w + " " + h + '" preserveAspectRatio="none">' +
      '<defs><linearGradient id="csg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:rgba(var(--gold-rgb),.35)"/><stop offset="1" style="stop-color:rgba(var(--gold-rgb),0)"/></linearGradient></defs>' +
      '<polygon fill="url(#csg)" points="0,' + h + " " + pts.join(" ") + " " + w + "," + h + '"/>' +
      '<polyline fill="none" style="stroke:var(--gold)" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" vector-effect="non-scaling-stroke" points="' + pts.join(" ") + '"/></svg>';
  }

  function renderStatsProfile(p) {
    $("cs-piece").innerHTML = getPieceSVG(TITLE_PIECE[p.title] || "P", "marble");
    $("cs-rating").textContent = p.rating;
    $("cs-title").textContent = L("titleLine").replace("%s", titleName(p.title));
    $("cs-sub").textContent = p.games ? L("rankLine").replace("%r", p.rank || "—").replace("%b", p.best) : L("rateNew");
    $("cs-games").textContent = p.games;
    $("cs-wins").textContent = p.wins;
    $("cs-draws").textContent = p.draws;
    $("cs-losses").textContent = p.losses;
    csSpark(p.series);
  }

  // Tarixdagi bitta o'yin qatori (statistika sahifasi va shaxmat bosh sahifasidagi «So'nggi o'yinlar»)
  function histRow(h) {
    var mark = { win: L("resW"), loss: L("resL"), draw: L("resD") }[h.result];
    var d = h.delta, yur = Math.ceil((h.plies || 0) / 2);
    return csRow('<span class="res ' + h.result + '">' + escapeHtmlChess(mark) + '</span><span class="nm"><b>' +
      escapeHtmlChess(h.opp.name) + "</b><span>" + escapeHtmlChess(reasonText(h.reason, h.result)) + " · " +
      escapeHtmlChess(L("movesN").replace("%d", yur)) + " · " + csDate(h.time) + '</span></span>' +
      (d !== null && d !== undefined ? '<span class="dl ' + (d >= 0 ? "up" : "dn") + '">' + (d > 0 ? "+" : "") + d + "</span>" : ""),
      ' data-game="' + escapeHtmlChess(h.id) + '"');
  }
  // Shaxmat bosh sahifasi: so'nggi uch o'yin. Profil 30 soniyada bir martadan ko'p so'ralmaydi.
  var chessLastAt = 0;
  function renderLastGames() {
    var hist = chessStats.prof ? chessStats.prof.history : null, box = $("ch-last");
    if (!box) { return; }
    box.classList.toggle("hidden", !(hist && hist.length));
    if (!hist || !hist.length) { return; }
    var html = "";
    hist.slice(0, 3).forEach(function (h) { html += histRow(h); });
    $("ch-last-list").innerHTML = html;
  }
  function loadLastGames() {
    renderLastGames();
    var now = Date.now();
    if (now - chessLastAt < 30000) { return; }
    chessLastAt = now;
    chessApi("profile").then(function (res) {
      if (!res || !res.ok) { return; }
      chessStats.prof = res;
      chessStats.bots = res.bots || chessStats.bots;
      renderLastGames();
    })["catch"](function () {});
  }

  function csRow(html, attrs, me) {
    return '<button type="button" class="cs-row' + (me ? " me" : "") + '"' + (attrs || "") + ">" + html + "</button>";
  }

  function crestHtml(house) {
    var h = HOUSES[house];
    return h && h.img ? '<img src="' + IMG_DIR + h.img + '" alt="">' : "";
  }

  function renderStatsList() {
    var box = $("cs-list"), tab = chessStats.tab, html = "", me = chatUser().id || 0;
    $("cs-top-filter").classList.toggle("hidden", tab !== "top");
    chessSegs("cs-tabs", tab, function (v) { return L({ top: "tabTop", hist: "tabHist", lad: "tabLadder" }[v]); });
    chessSegs("cs-top-filter", chessStats.filter, function (v) { return L(v === "all" ? "filterAll" : "filterHouse"); });
    if (tab === "top") {
      var data = chessStats.top[chessStats.filter];
      if (!data) { box.innerHTML = '<div class="cs-empty">' + escapeHtmlChess(L("loading")) + "</div>"; return; }
      if (!data.top.length) { box.innerHTML = '<div class="cs-empty">' + escapeHtmlChess(L("topEmpty")) + "</div>"; return; }
      var inTop = false;
      data.top.forEach(function (x, i) {
        var mine = x.uid == me;
        inTop = inTop || mine;
        html += csRow('<span class="rk' + (i < 3 ? " top" : "") + '">' + (i + 1) + '</span><span class="av">' + crestHtml(x.house) +
          '</span><span class="nm"><b>' + escapeHtmlChess(x.name) + "</b><span>" + escapeHtmlChess(titleName(x.title)) + " · " +
          L("gamesN").replace("%d", x.games) + '</span></span><span class="pc">' + getPieceSVG(TITLE_PIECE[x.title] || "P", "marble") +
          '</span><span class="rt">' + x.rating + "</span>", ' data-uid="' + x.uid + '"', mine);
      });
      if (!inTop && data.me) {
        html += csRow('<span class="rk">' + data.me.rank + '</span><span class="av">' + crestHtml(cupMe().house) +
          '</span><span class="nm"><b>' + escapeHtmlChess(L("you")) + "</b><span>" + escapeHtmlChess(titleName(data.me.title)) +
          '</span></span><span class="rt">' + data.me.rating + "</span>", "", true);
      }
    } else if (tab === "hist") {
      var hist = chessStats.prof ? chessStats.prof.history : null;
      if (!hist) { box.innerHTML = '<div class="cs-empty">' + escapeHtmlChess(L("loading")) + "</div>"; return; }
      if (!hist.length) { box.innerHTML = '<div class="cs-empty">' + escapeHtmlChess(L("histEmpty")) + "</div>"; return; }
      hist.forEach(function (h) { html += histRow(h); });
    } else {
      var bots = chessStats.bots || {}, names = L("botNames");
      BOT_ORDER.forEach(function (lv, i) {
        var r = bots[lv] || { w: 0, d: 0, l: 0 }, won = r.w > 0;
        html += csRow('<span class="rk">' + (i + 1) + '</span><span class="pc">' + getPieceSVG(BOT_PIECE[lv]) +
          '</span><span class="nm"><b>' + escapeHtmlChess(names[lv]) + "</b><span>" +
          escapeHtmlChess(L({ novice: "lvlNovice", easy: "lvlEasy", med: "lvlMed", hard: "lvlHard", master: "lvlMaster" }[lv])) +
          " · " + L("wdl").replace("%w", r.w).replace("%d", r.d).replace("%l", r.l) + '</span></span><span class="cs-badge' +
          (won ? " won" : "") + '">' + escapeHtmlChess(won ? L("beaten") : L("notBeaten")) + "</span>", ' data-bot="' + lv + '"');
      });
    }
    box.innerHTML = html;
    var lad = box.querySelectorAll("[data-bot] .pc");
    for (var i = 0; i < lad.length; i++) { lad[i].parentNode.classList.add("cs-lad"); }
  }

  function loadStatsTop(filter) {
    var q = filter === "house" && cupMe().house ? "?house=" + encodeURIComponent(cupMe().house) : "";
    chessApi("top", null, q).then(function (res) {
      if (res && res.ok) { chessStats.top[filter] = res; if (chessStats.tab === "top") { renderStatsList(); } }
    })["catch"](function () {});
  }

  function loadStatsProfile() {
    chessApi("profile").then(function (res) {
      if (!res || !res.ok) { return; }
      chessStats.prof = res;
      chessStats.bots = res.bots || {};
      renderStatsProfile(res);
      renderStatsList();
    })["catch"](function () {});
  }

  function openChessStats(tab) {
    applyXT();
    seekStop(true);
    stopHubTimer();
    chessStats.tab = tab || chessStats.tab || "top";
    chessStats.top = {};
    $("scr-chess-hub").classList.add("hidden");
    $("scr-chess-game").classList.add("hidden");
    $("scr-chess-stats").classList.remove("hidden");
    window.scrollTo(0, 0);
    renderStatsList();
    loadStatsProfile();
    loadStatsTop(chessStats.filter);
  }

  function closeChessStats() {
    $("scr-chess-stats").classList.add("hidden");
    openChessHub();
  }

  // Jadvaldagi o'yinchi: qisqa ma'lumot va "Shaxmatga chaqirish".
  function chessPlayerSheet(uid) {
    chessApi("profile", null, "?uid=" + encodeURIComponent(uid)).then(function (p) {
      if (!p || !p.ok) { return; }
      var me = uid == (chatUser().id || 0);
      var ov = document.createElement("div");
      ov.className = "cs-sheet";
      ov.innerHTML = '<div class="box"><div class="cs-prof"><span class="pc">' + getPieceSVG(TITLE_PIECE[p.title] || "P", "marble") +
        '</span><div style="min-width:0"><div class="r" style="font-size:26px">' + escapeHtmlChess(p.name) + '</div><div class="t">' +
        p.rating + " · " + escapeHtmlChess(titleName(p.title)) + (p.house ? " · " + escapeHtmlChess(cupHouseName(p.house)) : "") +
        '</div><div class="s">' + (p.games ? L("rankLine").replace("%r", p.rank || "—").replace("%b", p.best) : L("rateNew")) +
        '</div></div></div><div class="cs-stats"><div><b>' + p.games + "</b><span>" + L("statGames") + '</span></div><div><b style="color:#5fd98f">' +
        p.wins + "</b><span>" + L("statWins") + '</span></div><div><b style="color:#f3d58f">' + p.draws + "</b><span>" + L("statDraws") +
        '</span></div><div><b style="color:#ff8a7a">' + p.losses + "</b><span>" + L("statLosses") + "</span></div></div>" +
        (me ? "" : '<button type="button" class="ch-btn ch-gold" style="margin-top:14px" data-challenge="1">' + CHESS_IC.swords + "<span>" +
          escapeHtmlChess(L("chatChess")) + "</span></button>") + "</div>";
      ov.addEventListener("click", function (e) {
        if (e.target === ov) { ov.parentNode.removeChild(ov); return; }
        if (e.target.closest && e.target.closest("[data-challenge]")) {
          ov.parentNode.removeChild(ov);
          chessStats.from = "stats";
          chessAnnounce("dm:" + uid);
        }
      });
      document.body.appendChild(ov);
    })["catch"](function () { showToast(L("netErr"), "err"); });
  }

  // Tarixdagi o'yinni ko'rish: tugagan holat, yurishlar ro'yxati bilan orqaga-oldinga.
  function chessReview(gid, hubdan) {
    chessApi("state", null, "?game_id=" + encodeURIComponent(gid)).then(function (res) {
      if (!res || !res.game || res.game.v !== 2) { showToast(L("err"), "err"); return; }
      chessStats.from = hubdan ? null : "stats";       // bosh sahifadan ochilgan bo'lsa - «ortga» bosh sahifaga
      $("scr-chess-stats").classList.add("hidden");
      $("scr-chess-hub").classList.add("hidden");
      openPvP(res.game, true);
    })["catch"](function () { showToast(L("netErr"), "err"); });
  }

  function initChessStatsUI() {
    $("ch-rate").addEventListener("click", function () { openChessStats("top"); });
    $("ch-last-all").addEventListener("click", function () { openChessStats("hist"); });
    $("ch-last-list").addEventListener("click", function (e) {
      var row = e.target.closest ? e.target.closest(".cs-row") : null;
      if (row && row.getAttribute("data-game")) { stopHubTimer(); chessReview(row.getAttribute("data-game"), true); }
    });
    $("chess-stats-back").addEventListener("click", closeChessStats);
    $("cs-tabs").addEventListener("click", function (e) {
      var b = e.target.closest ? e.target.closest("[data-v]") : null;
      if (!b) return;
      chessStats.tab = b.getAttribute("data-v");
      renderStatsList();
    });
    $("cs-top-filter").addEventListener("click", function (e) {
      var b = e.target.closest ? e.target.closest("[data-v]") : null;
      if (!b) return;
      chessStats.filter = b.getAttribute("data-v");
      if (!chessStats.top[chessStats.filter]) { loadStatsTop(chessStats.filter); }
      renderStatsList();
    });
    $("cs-list").addEventListener("click", function (e) {
      var row = e.target.closest ? e.target.closest(".cs-row") : null;
      if (!row) return;
      if (row.getAttribute("data-uid")) { chessPlayerSheet(row.getAttribute("data-uid")); return; }
      if (row.getAttribute("data-game")) { chessReview(row.getAttribute("data-game")); return; }
      var lv = row.getAttribute("data-bot");
      if (lv) {
        var radio = document.querySelector('input[name="chess-bot-diff"][value="' + lv + '"]');
        if (radio) { radio.checked = true; }
        chessStats.from = "stats";
        $("scr-chess-stats").classList.add("hidden");
        startBotGame();
      }
    });
  }
