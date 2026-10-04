import { readFile, writeFile } from 'node:fs/promises';
const root = new URL('../dist/', import.meta.url);

const html = await readFile(new URL('index.html', root), 'utf8');
const contentJs = await readFile(new URL('iwata-content.js', root), 'utf8');
const triviaJs = await readFile(new URL('iwata-trivia.js', root), 'utf8');
const simJs = await readFile(new URL('iwata-sim.js', root), 'utf8');
const appJs = await readFile(new URL('iwata-app.js', root), 'utf8');

const combinedScript = [contentJs, triviaJs, simJs, appJs]
  .map(src => src.replace(/^import .*;\s*$/gm, '').replace(/^export /gm, ''))
  .join('\n\n');

if (combinedScript.includes('</script>')) {
  throw new Error('脚本中存在未转义的结束标签');
}

const standaloneHtml = html.replace('<script type="module" src="iwata-app.js"></script>', `<script type="module">\n${combinedScript}\n</script>`);

await writeFile(new URL('开始思辨.html', root), standaloneHtml, 'utf8');
console.log('已成功构建 book-iwata/dist/开始思辨.html 自包含单文件！');
