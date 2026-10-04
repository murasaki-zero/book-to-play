import http from 'node:http';
import { readFile, readdir, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(fileURLToPath(new URL('../../', import.meta.url)));
const distRoot = path.resolve(fileURLToPath(new URL('../dist/', import.meta.url)));
const port = Number(process.env.PORT || 4173);
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.json': 'application/json; charset=utf-8' };
import os from 'node:os';
import crypto from 'node:crypto';
import { execSync } from 'node:child_process';

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

// Parse book metadata from filename and determine workflow
function parseBookMeta(filename, stats) {
  const ext = path.extname(filename).toLowerCase();
  const cleanName = filename.replace(/\.[^/.]+$/, '');
  // Clean noisy strings
  let title = cleanName
    .replace(/\s*\(Z-Library\).*/i, '')
    .replace(/\s*\(z-library\.sk.*\)/i, '')
    .replace(/\s*\(1lib\.sk.*\)/i, '')
    .replace(/\s*\(.*?\)/g, '')
    .replace(/\s*\[.*?\]/g, '')
    .replace(/\s*【.*?】/g, '')
    .replace(/=\s*[^=]+$/, '')
    .trim();

  if (!title) title = cleanName;

  // Workflow classification rule:
  // 1. Literature & Humanities keywords
  const litKeywords = ['孤独', '血管', '德米安', '黑塞', '马尔克斯', '加西亚', '加莱亚诺', '小说', '文学', '散文', '史诗', '诗歌'];
  const isLiterature = litKeywords.some(kw => cleanName.includes(kw));

  // 2. Biography/Memoir keywords
  const bioKeywords = ['传', '传记', '自传', '回忆录', '如是说', '先生', '访谈', '生平', '生父', 'Jobs', 'Musk', 'Iwata'];
  const isBiography = !isLiterature && bioKeywords.some(kw => cleanName.includes(kw));

  const workflow = isLiterature ? 'literature' : isBiography ? 'memoir' : 'methodology';
  const workflowName = isLiterature ? '文学社科精读工作流' : isBiography ? '传记类思辨工作流' : '方法论设计工作流';

  // Recognized active projects
  let status = 'idle'; // idle | in_progress | ready
  let projectUrl = null;
  let cover = null;
  let spec = {};

  if (title.includes('游戏设计艺术')) {
    status = 'ready';
    title = '游戏设计艺术（第 2 版）';
    projectUrl = 'chapter-one/dist/开始学习.html';
    cover = 'chapter-one/dist/assets/covers/schell-art-of-game-design.jpg';
    spec = { chapters: 34, units: 136, tag: '设计透镜' };
  } else if (title.includes('岩田先生')) {
    status = 'ready';
    title = '岩田先生';
    projectUrl = 'book-iwata/dist/开始思辨.html';
    cover = 'chapter-one/dist/assets/covers/mr-iwata.jpg';
    spec = { chapters: 7, units: 58, tag: '决策重演' };
  } else if (title.includes('通关！游戏设计之道') || title.includes('通关')) {
    status = 'plan';
    title = '通关！游戏设计之道（第 2 版）';
    cover = 'chapter-one/dist/assets/covers/level-up-rogers.jpg';
    spec = { chapters: 18, units: '待开工', tag: '关卡设计' };
  } else if (title.includes('236个技巧')) {
    status = 'plan';
    title = '游戏设计的236个技巧';
    cover = 'chapter-one/dist/assets/covers/game-design-236-tips.jpg';
    spec = { chapters: 236, units: '诀窍库', tag: '手感微调' };
  } else {
    // Newly added custom books
    status = 'new';
    spec = {
      format: ext.replace('.', '').toUpperCase(),
      size: (stats.size / 1024 / 1024).toFixed(1) + ' MB',
      tag: isLiterature ? '时代映射' : isBiography ? '传记思辨' : '系统研读'
    };

    // Check cached cover
    const hash = crypto.createHash('md5').update(filename).digest('hex').slice(0, 12);
    cover = `chapter-one/dist/assets/covers/cache/cover-${hash}.jpg`;
  }

  const commandPrompt = isLiterature
    ? `开始按照《文学类制作工作流.md》制作《${title}》的时代背景与映射精读室`
    : isBiography
      ? `开始按照《传记类制作工作流.md》制作《${title}》的思辨精读练习室`
      : `开始制作《${title}》互动练习室`;

  return {
    filename,
    title,
    rawName: filename,
    ext,
    size: stats.size,
    mtime: stats.mtime,
    isBiography,
    isLiterature,
    workflow,
    workflowName,
    status,
    projectUrl,
    cover,
    spec,
    commandPrompt
  };
}

async function scanBookDirectory() {
  const bookDir = path.resolve(root, 'Book');
  try {
    // Attempt extracting any missing covers
    try {
      execSync(`python3 "${path.resolve(root, 'chapter-one/scripts/extract_covers.py')}" "${root}"`, { stdio: 'ignore' });
    } catch (_) {}

    const files = await readdir(bookDir);
    const validFiles = files.filter(f => !f.startsWith('.') && ['.epub', '.pdf'].includes(path.extname(f).toLowerCase()));
    const results = [];
    for (const f of validFiles) {
      try {
        const s = await stat(path.resolve(bookDir, f));
        results.push(parseBookMeta(f, s));
      } catch (_) {}
    }
    // Sort: ready books first, then recognized plan, then newly added books
    results.sort((a, b) => {
      const order = { ready: 0, plan: 1, in_progress: 2, new: 3 };
      return (order[a.status] ?? 4) - (order[b.status] ?? 4);
    });
    return results;
  } catch (err) {
    console.warn('扫描 Book 目录失败', err);
    return [];
  }
}

const server = http.createServer(async (req, res) => {
  try {
    const parsedUrl = new URL(req.url, 'http://localhost');
    // Enable CORS for API calls if accessed via file: or other origins
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
      res.writeHead(204);
      res.end();
      return;
    }

    const rawName = decodeURIComponent(parsedUrl.pathname);

    // API endpoint to return local network addresses for the UI
    if (rawName === '/api/network-info') {
      const lanIps = getLanIps();
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-cache' });
      res.end(JSON.stringify({ status: 'running', port, lanIps }));
      return;
    }

    // API endpoint to scan Book/ directory and return books list
    if (rawName === '/api/books') {
      const books = await scanBookDirectory();
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-cache' });
      res.end(JSON.stringify({ total: books.length, books }));
      return;
    }

    // API endpoint to gracefully shutdown the server from UI
    if (rawName === '/api/shutdown' && req.method === 'POST') {
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ status: 'stopping' }));
      console.log('收到前端关闭指令，正在停止局域网服务...');
      setTimeout(() => {
        server.close(() => process.exit(0));
      }, 500);
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

