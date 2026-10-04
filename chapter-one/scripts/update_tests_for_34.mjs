// Historical generator: retained for audit only.
throw new Error("历史批量生成脚本已停用：它会覆盖已修复课程。请编辑 dist/course.js / dist/studio.js，参见根目录制作工作流.md。");
import fs from 'fs';

let testCode = fs.readFileSync('tests/workbook.test.mjs', 'utf8');

// Update line 43 from 16 chapters 64 units to 34 chapters 136 units
testCode = testCode.replace(
  "test('全书 34 章，已制作前十六章 64 单元；内容定位有扫描页且在章范围', () => {",
  "test('全书 34 章，已制作全部三十四章 136 单元；内容定位有扫描页且在章范围', () => {"
);
testCode = testCode.replace(
  "assert.equal(Array.from({length:16},(_,i)=>i+1).flatMap(id=>chapterLibrary[id].units).length,64);",
  "assert.equal(Array.from({length:34},(_,i)=>i+1).flatMap(id=>chapterLibrary[id].units).length,136);"
);

// Update test for generic units from 9-16 to 9-34
testCode = testCode.replace(
  "test('第 9 至 16 章交互试验台：状态响应、参数权重与就绪断言正常', () => {",
  "test('第 9 至 34 章交互试验台：状态响应、参数权重与就绪断言正常', () => {"
);
testCode = testCode.replace(
  "for (let chId = 9; chId <= 16; chId++) {",
  "for (let chId = 9; chId <= 34; chId++) {"
);

fs.writeFileSync('tests/workbook.test.mjs', testCode);
console.log('tests/workbook.test.mjs updated for all 34 chapters!');
