#!/usr/bin/env node
/* Tiny static server for previewing dist/ locally:  npm run serve  */
const http = require('http'), fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..', 'dist');
const PORT = process.env.PORT || 8080;
const TYPES = { '.html':'text/html; charset=utf-8', '.css':'text/css; charset=utf-8',
  '.js':'text/javascript; charset=utf-8', '.json':'application/json', '.xml':'application/xml',
  '.txt':'text/plain; charset=utf-8', '.svg':'image/svg+xml', '.png':'image/png',
  '.jpg':'image/jpeg', '.jpeg':'image/jpeg', '.webp':'image/webp', '.woff2':'font/woff2',
  '.webmanifest':'application/manifest+json' };

http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]);
  if (p.endsWith('/')) p += 'index.html';
  let file = path.join(ROOT, path.normalize(p).replace(/^(\.\.[/\\])+/, ''));
  if (!file.startsWith(ROOT)) { res.writeHead(403).end('Forbidden'); return; }
  fs.readFile(file, (err, buf) => {
    if (err) {
      return fs.readFile(path.join(ROOT, '404.html'), (e2, nf) => {
        res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' }).end(e2 ? 'Not found' : nf);
      });
    }
    res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream' }).end(buf);
  });
}).listen(PORT, () => console.log(`\n  Roughneck Roofing preview → http://localhost:${PORT}\n  Ctrl-C to stop.\n`));
