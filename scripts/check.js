#!/usr/bin/env node
/* Pre-deploy sanity check on dist/: structured data, meta lengths,
   duplicate titles, heading structure, image alt text, broken internal links.
   Run with: npm run check                                                   */
const fs=require('fs'),path=require('path');
const DIST=require('path').join(__dirname,'..','dist');
let files=[];(function w(d){for(const e of fs.readdirSync(d,{withFileTypes:true})){const p=path.join(d,e.name);
e.isDirectory()?w(p):e.name.endsWith('.html')&&files.push(p);}})(require('path').join(__dirname,'..','dist'));
let fail=0;const seenTitle=new Map(),seenDesc=new Map();
for(const f of files){
  const h=fs.readFileSync(f,'utf8');const rel='/'+path.relative(DIST,f);
  const err=m=>{console.log('  ✗',rel,m);fail++;};
  // JSON-LD
  const blocks=[...h.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  if(!blocks.length)err('no JSON-LD');
  blocks.forEach((b,i)=>{try{JSON.parse(b[1].replace(/\\u003c/g,'<'))}catch(e){err('bad JSON-LD #'+i+': '+e.message)}});
  // essentials
  const dec=x=>x.replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&mdash;/g,'-').replace(/&middot;/g,'-');
  const t=dec((h.match(/<title>([^<]*)<\/title>/)||[])[1]||'');
  const d=dec((h.match(/<meta name="description" content="([^"]*)"/)||[])[1]||'');
  const noidx0=/content="noindex/.test(h);
  if(!t)err('no title'); else if(t.length>65)err(`title ${t.length} chars: ${t}`);
  if(!d)err('no meta description'); else if(!noidx0&&(d.length<110||d.length>170))err(`desc ${d.length} chars`);
  if(!/rel="canonical"/.test(h))err('no canonical');
  const h1=[...h.matchAll(/<h1[^>]*>/g)].length;
  if(h1!==1)err(`${h1} h1 tags`);
  if(!/<html lang=/.test(h))err('no lang');
  if(/undefined|\[object Object\]|NaN/.test(h))err('template leak (undefined/[object Object])');
  // dupes (skip noindex)
  const noidx=/content="noindex/.test(h);
  if(!noidx){ if(seenTitle.has(t))err('duplicate title with '+seenTitle.get(t)); else seenTitle.set(t,rel);
              if(seenDesc.has(d))err('duplicate description with '+seenDesc.get(d)); else seenDesc.set(d,rel); }
  // img alt
  [...h.matchAll(/<img\b[^>]*>/g)].forEach(m=>{if(!/\salt=/.test(m[0]))err('img without alt: '+m[0].slice(0,70))});
  // tag balance for key elements
  const cnt=(re)=>(h.match(re)||[]).length;
  if(cnt(/<section\b/g)!==cnt(/<\/section>/g))err('unbalanced <section>');
  if(cnt(/<div\b/g)!==cnt(/<\/div>/g))err('unbalanced <div>');
  if(cnt(/<ul\b/g)!==cnt(/<\/ul>/g))err('unbalanced <ul>');
  if(cnt(/<a\b/g)!==cnt(/<\/a>/g))err('unbalanced <a>');
}
// internal link targets
const routes=new Set(files.map(f=>'/'+path.relative(DIST,f).replace(/index\.html$/,'')));
const broken=new Set();
for(const f of files){const h=fs.readFileSync(f,'utf8');
  [...h.matchAll(/href="(\/[^"#?]*)"/g)].forEach(m=>{const u=m[1];
    if(u.startsWith('/assets/')||u==='/sitemap.xml')return;
    if(!routes.has(u)&&!fs.existsSync(path.join(DIST,u)))broken.add(u+'  (in '+path.relative(DIST,f)+')');});}
broken.forEach(b=>{console.log('  ✗ broken link:',b);fail++;});
console.log(`\n${files.length} pages checked — ${fail} problem(s)\n`);
process.exit(fail?1:0);
