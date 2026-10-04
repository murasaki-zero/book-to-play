import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(fileURLToPath(new URL('../../', import.meta.url)));
const distRoot = path.resolve(fileURLToPath(new URL('../dist/', import.meta.url)));
const port = Number(process.env.PORT || 4173);
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.json': 'application/json; charset=utf-8' };
import os from 'node:os';

function getLanIps() {
  const ips = [];
  const nets = os.networkInterfaces();
  for (const name of Object.keys(nets)) {
    for (const net of nets[name] || []) {
      // Node.js 18+ may use 'IPv4' or 4
      const family = typeof net.family === 'string' ? net.family : `IPv${net.family}`;
      if (family === 'IPv4' && !net.internal) {
        ips.push({ iface: name, address: net.address });
      }
    }
  }
  return ips;
}

const server = http.createServer(async (req, res) => {
  try {
    const parsedUrl = new URL(req.url, 'http://localhost');
    const rawName = decodeURIComponent(parsedUrl.pathname);

    // API endpoint to return local network addresses for the UI
    if (rawName === '/api/network-info') {
      const lanIps = getLanIps();
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-cache' });
      res.end(JSON.stringify({ port, lanIps }));
      return;
    }

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

server.listen(port, '0.0.0.0', () => {
  console.log(`\n========================================`);
  console.log(`  书中练习室 · 本地服务已启动`);
  console.log(`========================================`);
  console.log(`  🖥️  本机访问:   http://localhost:${port}`);
  const lanIps = getLanIps();
  if (lanIps.length > 0) {
    lanIps.forEach(net => {
      console.log(`  📱 局域网/iPad: http://${net.address}:${port}  (${net.iface})`);
    });
  } else {
    console.log(`  📱 局域网/iPad: 未检测到外网 IPv4 接口`);
  }
  console.log(`========================================\n`);
});
server.on('error', error => { console.error(error.message); process.exitCode = 1; });

