/* Aniqlanmagan funksiya chaqiruvlarini topadi: `nom(...)` deb chaqirilgan, lekin js/ ning hech bir
   joyida e'lon qilinmagan nomlar. tartib.js buni ushlamaydi (u faqat yuklanish tartibini tekshiradi).
   2026-10-03: kod tozalashda jrNext o'chib ketib, maktub ochilmay qolishiga oz qoldi.
   Ishga tushirish: node tools/chaqiruv.js  ("aniqlanmagan: yo'q" bo'lishi kerak)
   Kerak: cd tools && npm i --no-save acorn@8 */
const fs = require("fs"), path = require("path");
const acorn = require("./node_modules/acorn");
const dir = path.join(__dirname, "..", "js");
let src = "";
fs.readdirSync(dir).filter(f => /^\d\d-.*\.js$/.test(f)).sort()
  .forEach(f => { src += fs.readFileSync(path.join(dir, f), "utf8") + "\n"; });
const ast = acorn.parse(src, { ecmaVersion: 2020 });
const bor = new Set(), chaq = new Set();
(function yur(n) {
  if (!n || typeof n !== "object") return;
  if (n.type === "FunctionDeclaration" && n.id) bor.add(n.id.name);
  if (n.type === "VariableDeclarator" && n.id.type === "Identifier") bor.add(n.id.name);
  if (/Function/.test(n.type)) (n.params || []).forEach(p => { if (p.type === "Identifier") bor.add(p.name); });
  if (n.type === "CallExpression" && n.callee.type === "Identifier") chaq.add(n.callee.name);
  for (const k in n) { const v = n[k]; if (Array.isArray(v)) v.forEach(yur); else if (v && typeof v.type === "string") yur(v); }
})(ast);
const brauzer = new Set(("setTimeout clearTimeout setInterval clearInterval parseInt parseFloat String Number Boolean Array " +
  "Object isNaN isFinite fetch requestAnimationFrame cancelAnimationFrame encodeURIComponent decodeURIComponent Date Math JSON " +
  "Promise Error RegExp Image Audio Uint8Array atob btoa alert prompt Symbol Map Set URL Blob Chess getComputedStyle matchMedia " +
  "AbortController FormData MutationObserver ResizeObserver IntersectionObserver Worker TextEncoder TextDecoder").split(" "));
const yoq = [...chaq].filter(c => !bor.has(c) && !brauzer.has(c));
console.log("aniqlanmagan: " + (yoq.length ? yoq.join(", ") : "yo'q"));
process.exit(yoq.length ? 1 : 0);
