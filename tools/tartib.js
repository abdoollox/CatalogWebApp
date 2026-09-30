// Ilova kodi bo'laklarining yuklanish TARTIBINI tekshiradi.
//
// Bo'laklar (js/*.js) bitta umumiy maydonda ishlaydi va index.html dagi
// tartibda yuklanadi. Agar biror bo'lak YUKLANISH PAYTIDA (foydalanuvchi
// hali hech narsa bosmasdan) keyingi bo'lakdagi funksiya yoki o'zgaruvchini
// ishlatsa, ilova ochilmay qoladi. Bu dastur shuni oldindan topadi.
//
// Ishlatish (bir marta: cd tools && npm i --no-save acorn@8 eslint-scope@8):
//     node tools/tartib.js
// "muammo: 0" chiqishi SHART. "KECHIKKAN" - yuklanishda o'rnatilgan tugma/
// kuzatuvchi keyingi bo'lakka tayanadi; ro'yxatdagi ma'lumlari tekshirilgan.
const path=require('path');
const ROOT=path.join(__dirname,'..');
const MALUM={'msInit();':"tugmalar faqat albom ochilganda; javob kelganda kutubxona yashirin",
  'var WORLD_MAPS = {':"xarita tugmalari; xarita faqat ishga tushirishda chiziladi"};
const acorn=require('acorn'),escope=require('eslint-scope'),fs=require('fs');
const html=fs.readFileSync(path.join(ROOT,'index.html'),'utf8');
const files=[...html.matchAll(/<script src="(js\/[\w.-]+\.js)\?v=\w*"><\/script>/g)].map(m=>m[1]);
let src='(function () {\n'; const cuts=[];
files.forEach((f,i)=>{ if(i) cuts.push(src.split('\n').length); src+=fs.readFileSync(path.join(ROOT,f),'utf8'); });
src+='})();\n';
const fname=k=>files[k];
const fileOf=line=>{let k=0;for(const c of cuts) if(line>=c) k++; return k;};
const ast=acorn.parse(src,{ecmaVersion:2022,locations:true,ranges:true});
const sm=escope.analyze(ast,{ecmaVersion:2022,sourceType:'script'});
const iife=ast.body[0].expression.callee, body=iife.body.body;
const top=sm.acquire(iife);
// kesish satri hech bir statement o'rtasiga tushmasin
for(const c of cuts){ for(const s of body){ if(s.loc.start.line<c && s.loc.end.line>=c) console.log('KESISH XATO', c, 'statement', s.loc.start.line,'-',s.loc.end.line);} }
const decl={}; // name -> {file,line,kind}
for(const v of top.variables){ if(!v.defs.length) continue; const d=v.defs[0]; decl[v.name]={file:fileOf(d.name.loc.start.line),line:d.name.loc.start.line,kind:d.type}; }
const stmtOf=new Map(); body.forEach((s,i)=>stmtOf.set(s,i));
// parent xaritasi
const parent=new Map();
(function mark(n,p){ if(!n||typeof n.type!=='string')return; parent.set(n,p); for(const k in n){ if(k==='parent')continue; const v=n[k]; if(Array.isArray(v)) v.forEach(x=>x&&typeof x.type==='string'&&mark(x,n)); else if(v&&typeof v.type==='string') mark(v,n);} })(ast,null);
const IMM=new Set(['forEach','map','filter','some','every','reduce','reduceRight','sort','find','findIndex','flatMap','replace','call','apply']);
function immediateFn(fn){ const p=parent.get(fn);
  if(p&&(p.type==='CallExpression'||p.type==='NewExpression')&&p.callee===fn) return true;
  if(p&&p.type==='CallExpression'&&p.arguments.includes(fn)&&p.callee.type==='MemberExpression'&&!p.callee.computed&&IMM.has(p.callee.property.name)) return true;
  if(p&&p.type==='MemberExpression'&&p.object===fn){ const g=parent.get(p); if(g&&g.type==='CallExpression'&&g.callee===p) return true; } // (function(){}).call()
  return false; }
// har reference uchun: egasi (top statement), va yo'ldagi funksiyalar
const edges=new Map(); // owner key -> Set(name) immediate
const defer=new Map(); // owner key -> Set(name) deferred (ma'lumot uchun)
const add=(m,k,n)=>{ if(!m.has(k)) m.set(k,new Set()); m.get(k).add(n); };
const calls=new Map(); const allrefs=new Map();
for(const sc of sm.scopes){
  for(const r of sc.references){
    if(!r.resolved||r.resolved.scope!==top) continue;
    // yuqoriga chiqib, top statementni va funksiyalarni topamiz
    let n=r.identifier, fns=[]; let st=null;
    while(n){ const p=parent.get(n); if(p===iife.body){ st=n; break; } if(/Function/.test(n.type)) fns.push(n); n=p; }
    if(!st) continue;
    let key, chain=fns;
    if(st.type==='FunctionDeclaration'){ key='fn:'+st.id.name; chain=fns.filter(f=>f!==st); }
    else key='st:'+stmtOf.get(st);
    const imm=chain.every(immediateFn);
    add(imm?edges:defer, key, r.identifier.name);
    const pp=parent.get(r.identifier);
    if(imm && pp && pp.type==='CallExpression' && pp.callee===r.identifier) add(calls,key,r.identifier.name);
    add(allrefs,key,r.identifier.name);
  }
}
// bajariladigan statementlar
const execKeys=[]; body.forEach((s,i)=>{ if(s.type!=='FunctionDeclaration') execKeys.push(['st:'+i, fileOf(s.loc.start.line), s.loc.start.line]); });
let bad=0;
for(const [key,f,line] of execKeys){
  const seen=new Set(), q=[key], via=new Map();
  while(q.length){ const k=q.shift(); for(const nm of (edges.get(k)||[])){ if(seen.has(nm))continue; seen.add(nm); via.set(nm,k); if(decl[nm]&&decl[nm].kind==='FunctionName'&&(calls.get(k)||new Set()).has(nm)) q.push('fn:'+nm);} }
  for(const nm of seen){ const d=decl[nm]; if(d && d.file>f){ bad++; let pth=[nm],k=via.get(nm); while(k&&k.startsWith('fn:')){ pth.unshift(k.slice(3)); k=via.get(k.slice(3)); } console.log('MUAMMO:',fname(f),'->',pth.join(' -> '),'| e\'lon:',fname(d.file)); } }
}
console.log('bajariladigan statementlar:',execKeys.length,'muammo:',bad);
const last=cuts.length;
// Kechiktirilgan chaqiruvlar: yuklanishda o'rnatilgan callback'lar keyingi bo'lakka yetib boradimi
let late=0;
for(const [key,f,line] of execKeys){
  if(f===last) continue;
  const reached=new Set([key]), q=[key];
  while(q.length){ const k=q.shift(); for(const nm of (calls.get(k)||[])){ const kk='fn:'+nm; if(decl[nm]&&decl[nm].kind==='FunctionName'&&!reached.has(kk)){reached.add(kk);q.push(kk);} } }
  // kechiktirilgan nomlar va ular orqali hamma narsa
  const seen=new Set(), q2=[];
  for(const k of reached) for(const nm of (defer.get(k)||[])) q2.push([nm,k]);
  const via=new Map();
  while(q2.length){ const [nm,from]=q2.shift(); if(seen.has(nm))continue; seen.add(nm); via.set(nm,from);
    if(decl[nm]&&decl[nm].kind==='FunctionName') for(const x of (allrefs.get('fn:'+nm)||[])) q2.push([x,'fn:'+nm]); }
  const hits=[...seen].filter(nm=>decl[nm]&&decl[nm].file>f);
  if(hits.length){ const t=src.split('\n')[line-1].trim(); const m=MALUM[t];
    if(m){ console.log('ma\'lum (xavfsiz):',fname(f),t,'-',m); continue; }
    late++; console.log('KECHIKKAN:',fname(f),t.slice(0,50),'->',hits.length,'nom, masalan:',hits.slice(0,6).map(h=>h+'('+fname(decl[h].file)+')').join(' ')); }
}
console.log('kechikkan xavf:',late);
process.exit(bad||late?1:0);
