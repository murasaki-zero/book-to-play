import { readFile, writeFile } from 'node:fs/promises';
const root = new URL('../dist/', import.meta.url);
const [html, css, ...sources] = await Promise.all(['index.html', 'styles.css', 'content.js', 'core.js', 'lenses.js', 'course.js', 'chapters.js', 'workbook.js', 'studio.js', 'labs.js', 'app.js'].map(name => readFile(new URL(name, root), 'utf8')));
const script = sources.map(source => source.replace(/^export const book =/m, 'export const originalBook =').replace(/^export const units =/m, 'export const firstUnits =').replace(/^import .*;\s*$/gm, '').replace(/^export /gm, '')).join('\n\n');
if (script.includes('</script>')) throw new Error('脚本中存在需要转义的 HTML 结束标签。');
let output = html.replace('<link rel="stylesheet" href="styles.css">', `<style>${css}</style>`).replace('<script type="module" src="app.js"></script>', `<script type="module">${script}</script>`);
if (output === html || !output.includes(`<style>${css}</style>`) || !output.includes(`<script type="module">${script}</script>`)) throw new Error('内嵌替换未生效：请检查 index.html 中的样式表与脚本标记行是否被改动。');
await writeFile(new URL('开始学习.html', root), output);
console.log('已生成 dist/开始学习.html：脚本和样式全部内嵌，原书扫描页从旁边的 assets 读取。');
