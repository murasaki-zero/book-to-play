import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.resolve(__dirname, '../dist');

test('百年孤独前三章完整原文提取且包含完整自然段落', async () => {
  const chaptersPath = path.join(distDir, 'chapters.js');
  assert.ok(fs.existsSync(chaptersPath), 'chapters.js 必须存在');

  const content = fs.readFileSync(chaptersPath, 'utf8');
  assert.match(content, /第一章：马孔多的创世与吉卜赛人的奇物/);
  assert.match(content, /第二章：猪尾巴的诅咒与出走大泽/);
  assert.match(content, /第三章：失眠症瘟疫与忘却一切的字条/);
  assert.match(content, /面对行刑队，奥雷里亚诺·布恩迪亚上校将会回想起父亲带他去见识冰块的那个遥远的下午/);
});

test('时代地理坐标仓与历史映射覆盖全部三章', async () => {
  const contextPath = path.join(distDir, 'context.js');
  await import(contextPath);
  const { ERA_MATRIX, METAPHOR_NOTES } = globalThis.SolitudeContext;

  assert.ok(ERA_MATRIX[1], '第 1 章必须有时空坐标仓');
  assert.ok(ERA_MATRIX[2], '第 2 章必须有时空坐标仓');
  assert.ok(ERA_MATRIX[3], '第 3 章必须有时空坐标仓');

  assert.match(ERA_MATRIX[1].historicalBackdrop.content, /新格拉纳达/);
  assert.match(ERA_MATRIX[2].historicalBackdrop.content, /德雷克/);
  assert.match(ERA_MATRIX[3].historicalBackdrop.content, /瓜希拉/);

  // 注脚覆盖度校验
  const noteKeys = Object.keys(METAPHOR_NOTES);
  assert.ok(noteKeys.length >= 8, '行内互文隐喻注脚不少于 8 条');
});

test('布恩迪亚家族谱系树与人物库数据完备', async () => {
  const lineagePath = path.join(distDir, 'lineage.js');
  await import(lineagePath);
  const { CHARACTERS, LINEAGE_TREE } = globalThis.SolitudeLineage;

  assert.ok(CHARACTERS.length >= 8, '人物数据库包含初代与核心主要人物');
  const jose = CHARACTERS.find(c => c.name.includes('何塞·阿尔卡蒂奥·布恩迪亚'));
  assert.ok(jose, '包含初代家长何塞·阿尔卡蒂奥·布恩迪亚');
  assert.ok(jose.fate.includes('栗树'), '人物命运伏笔包含晚年绑在栗树下的宿命');

  assert.ok(LINEAGE_TREE.root.couples[0].children.length >= 3, '第二代分支覆盖长子、次子上校与长女');
});

test('单文件 开始精读.html 自包含且无网络依赖', async () => {
  const standalonePath = path.join(distDir, '开始精读.html');
  assert.ok(fs.existsSync(standalonePath), '开始精读.html 必须存在');

  const html = fs.readFileSync(standalonePath, 'utf8');
  assert.doesNotMatch(html, /http:\/\/|https:\/\//, '严禁包含外部网络脚本链接');
  assert.match(html, /<script>\s*\/\* Inlined chapters\.js \*\//, '内联了章节原文数据');
  assert.match(html, /<script>\s*\/\* Inlined context\.js \*\//, '内联了时空坐标库');
});
