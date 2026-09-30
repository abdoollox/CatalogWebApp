// Ishlatilmaydigan (o'lik) umumiy funksiya va o'zgaruvchilarni topadi.
//
// Ildiz - yuklanishda bajariladigan kod (var e'lonlaridan tashqari hamma
// statement va chaqiruvli var'lar). Undan boshlab kim kimni tilga oladi -
// shu zanjirga tushmagan nom hech qachon ishlamaydi.
//
//     node tools/olik.js          (kutubxonalar: tools/tartib.js dagidek)
const path=require('path'),fs=require('fs'),acorn=require('acorn'),escope=require('eslint-scope');
const ROOT=path.join(__dirname,'..');
const html=fs.readFileSync(path.join(ROOT,'index.html'),'utf8');
const files=[...html.matchAll(/<script src="(js\/[\w.-]+\.js)\?v=\w*"><\/script>/g)].map(m=>m[1]);
let src='(function () {\n'; const starts=[];
for(const f of files){ starts.push([src.split('\n').length,f]); src+=fs.readFileSync(path.join(ROOT,f),'utf8'); }
src+='})();\n';
const where=l=>{let r=starts[0];for(const s of starts) if(l>=s[0]) r=s; return r[1]+':'+(l-r[0]+1);};
const ast=acorn.parse(src,{ecmaVersion:2022,locations:true,ranges:true});
const sm=escope.analyze(ast,{ecmaVersion:2022,sourceType:'script'});
const iife=ast.body[0].expression.callee, body=iife.body.body, top=sm.acquire(iife);
const parent=new Map();
(function mark(n,p){ if(!n||typeof n.type!=='string')return; parent.set(n,p); for(const k in n){ const v=n[k]; if(Array.isArray(v)) v.forEach(x=>x&&typeof x.type==='string'&&mark(x,n)); else if(v&&typeof v.type==='string') mark(v,n);} })(ast,null);
function hasCall(n){ let r=false; (function w(x){ if(r||!x||typeof x.type!=='string')return; if(/Function/.test(x.type)&&parent.get(x)&&!(parent.get(x).type==='CallExpression'&&parent.get(x).callee===x))return;
  if(x.type==='CallExpression'||x.type==='NewExpression'||x.type==='AssignmentExpression'||x.type==='UpdateExpression'){r=true;return;} for(const k in x){const v=x[k]; if(Array.isArray(v))v.forEach(w); else if(v&&typeof v.type==='string')w(v);} })(n); return r; }
// har statement/declarator -> egasi
const ownerOf=new Map(); const refs=new Map(); const decls=new Map();
const add=(k,n)=>{ if(!refs.has(k)) refs.set(k,new Set()); refs.get(k).add(n); };
const roots=[];
body.forEach((s,i)=>{
  if(s.type==='FunctionDeclaration'){ decls.set(s.id.name,{line:s.loc.start.line,kind:'function',node:s}); }
  else if(s.type==='VariableDeclaration'){ for(const d of s.declarations){ decls.set(d.id.name,{line:d.loc.start.line,kind:'var',node:d,stmt:s}); if(d.init&&hasCall(d.init)) roots.push('n:'+d.id.name); } }
  else roots.push('s:'+i);
});
for(const sc of sm.scopes) for(const r of sc.references){
  if(!r.resolved||r.resolved.scope!==top) continue;
  let n=r.identifier, st=null, decl=null;
  while(n){ const p=parent.get(n); if(p&&p.type==='VariableDeclarator'&&parent.get(p)&&parent.get(parent.get(p))===iife.body) decl=p; if(p===iife.body){st=n;break;} n=p; }
  if(!st) continue;
  let key;
  if(st.type==='FunctionDeclaration') key='n:'+st.id.name;
  else if(st.type==='VariableDeclaration'&&decl) key='n:'+decl.id.name;
  else key='s:'+body.indexOf(st);
  // o'ziga yozish (x = ...) - tirik qilmaydi, faqat o'qish
  if(r.isWriteOnly()&&key!=='n:'+r.identifier.name){ add(key+'#w',r.identifier.name); continue; }
  if(key==='n:'+r.identifier.name) continue;
  add(key,r.identifier.name);
}
const live=new Set(); const q=[...roots];
while(q.length){ const k=q.shift(); for(const nm of (refs.get(k)||[])){ if(!live.has(nm)){ live.add(nm); q.push('n:'+nm);} } }
const dead=[...decls].filter(([n])=>!live.has(n));
for(const [n,d] of dead.sort((a,b)=>a[1].line-b[1].line)) console.log(d.kind.padEnd(8),n.padEnd(28),where(d.line), d.node.loc.end.line-d.node.loc.start.line+1,'qator');
console.log('jami o\'lik:',dead.length,'/',decls.size,'| qatorlar:',dead.reduce((a,[n,d])=>a+d.node.loc.end.line-d.node.loc.start.line+1,0));
if(process.argv[2]==='--json') fs.writeFileSync(process.argv[3],JSON.stringify(dead.map(([n,d])=>[n,d.kind])));
