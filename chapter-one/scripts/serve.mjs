import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(fileURLToPath(new URL('../../', import.meta.url)));
const distRoot = path.resolve(fileURLToPath(new URL('../dist/', import.meta.url)));
const port = Number(process.env.PORT || 4173);
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.json': 'application/json; charset=utf-8' };
const server = http.createServer(async (req, res) => {
  try {
    const rawName = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    const relName = (rawName === '/' ? 'index.html' : rawName).replace(/^\/+/, '');
    
    // Check root workspace first, then fallback to chapter-one/dist for legacy single-book links
    let target = path.resolve(root, relName);
    if (!target.startsWith(root + path.sep) && target !== root) {
      res.writeHead(403); res.end('Forbidden'); return;
    }
    
    try {
      const data = await readFile(target);
      res.writeHead(200, { 'Content-Type': types[path.extname(target)] || 'application/octet-stream', 'Cache-Control': 'no-cache', 'X-Content-Type-Options': 'nosniff' });
      res.end(data);
      return;
    } catch {
      // Fallback to chapter-one/dist
      const fallbackTarget = path.resolve(distRoot, relName);
      if (fallbackTarget.startsWith(distRoot + path.sep)) {
        const data = await readFile(fallbackTarget);
        res.writeHead(200, { 'Content-Type': types[path.extname(fallbackTarget)] || 'application/octet-stream', 'Cache-Control': 'no-cache', 'X-Content-Type-Options': 'nosniff' });
        res.end(data);
        return;
      }
      throw new Error('Not found');
    }
  } catch { res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }); res.end('找不到这个文件'); }
});
server.listen(port, '127.0.0.1', () => console.log(`Local: http://127.0.0.1:${port}`));
server.on('error', error => { console.error(error.message); process.exitCode = 1; });
