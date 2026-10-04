// Historical generator: retained for audit only.
throw new Error("历史批量生成脚本已停用：它会覆盖已修复课程。请编辑 dist/course.js / dist/studio.js，参见根目录制作工作流.md。");
import fs from 'fs';

let testCode = fs.readFileSync('tests/workbook.test.mjs', 'utf8');

// Update line 43 from 6 chapters 24 units to 16 chapters 64 units
testCode = testCode.replace(
  "test('全书 34 章，已制作前六章 24 单元；内容定位有扫描页且在章范围', () => {",
  "test('全书 34 章，已制作前十六章 64 单元；内容定位有扫描页且在章范围', () => {"
);
testCode = testCode.replace(
  "assert.equal([1,2,3,4,5,6].flatMap(id=>chapterLibrary[id].units).length,24);",
  "assert.equal(Array.from({length:16},(_,i)=>i+1).flatMap(id=>chapterLibrary[id].units).length,64);"
);

// Add tests for chapters 7 to 16
const newTests = `
test('第 7 章创意与头脑风暴：无尽灵感、问题陈述、四元素碰撞与漏斗筛选', () => {
  resetLabRuntime();
  const uInsp = chapterLibrary[7].units[0], aInsp = {};
  handleLab(uInsp, aInsp, { lab: 'inspire-pick', value: 'ballet' });
  handleLab(uInsp, aInsp, { lab: 'inspire-record' });
  assert.equal(labReady(uInsp, aInsp, '跨界灵感转译'), true);

  const uProb = chapterLibrary[7].units[1], aProb = {};
  handleLab(uProb, aProb, { lab: 'problem-case', value: '0' });
  handleLab(uProb, aProb, { lab: 'problem-record' });
  handleLab(uProb, aProb, { lab: 'problem-case', value: '1' });
  handleLab(uProb, aProb, { lab: 'problem-record' });
  assert.equal(labReady(uProb, aProb, '约束四元素提炼问题陈述'), true);

  const uBS = chapterLibrary[7].units[2], aBS = {};
  handleLab(uBS, aBS, { lab: 'bs-roll', value: 'all' });
  handleLab(uBS, aBS, { lab: 'bs-record' });
  handleLab(uBS, aBS, { lab: 'bs-roll', value: 'all' });
  handleLab(uBS, aBS, { lab: 'bs-record' });
  assert.equal(labReady(uBS, aBS, '打破常规假设碰撞'), true);

  const uFilter = chapterLibrary[7].units[3], aFilter = {};
  handleLab(uFilter, aFilter, { lab: 'filter-pick', value: '0' });
  handleLab(uFilter, aFilter, { lab: 'filter-eval' });
  assert.equal(labReady(uFilter, aFilter, '漏斗收敛淘汰点子'), true);
});

test('第 8 章迭代法则与风险消除：八项测试、敏捷循环、粗糙原型与玩具激情', () => {
  resetLabRuntime();
  const uEight = chapterLibrary[8].units[0], aEight = {};
  handleLab(uEight, aEight, { lab: 'eight-select', value: 'artistic' });
  handleLab(uEight, aEight, { lab: 'eight-record' });
  assert.equal(labReady(uEight, aEight, '八项测试全面审查'), true);

  const uLoop = chapterLibrary[8].units[1], aLoop = {};
  handleLab(uLoop, aLoop, { lab: 'loop-set', value: '1' });
  handleLab(uLoop, aLoop, { lab: 'loop-record' });
  handleLab(uLoop, aLoop, { lab: 'loop-set', value: '2' });
  handleLab(uLoop, aLoop, { lab: 'loop-record' });
  assert.equal(labReady(uLoop, aLoop, '压缩冲刺快速及早暴露风险'), true);

  const uRisk = chapterLibrary[8].units[2], aRisk = {};
  handleLab(uRisk, aRisk, { lab: 'risk-case', value: '0' });
  handleLab(uRisk, aRisk, { lab: 'risk-record' });
  handleLab(uRisk, aRisk, { lab: 'risk-case', value: '1' });
  handleLab(uRisk, aRisk, { lab: 'risk-record' });
  assert.equal(labReady(uRisk, aRisk, '忘记质量使用粗糙原型'), true);

  const uToy = chapterLibrary[8].units[3], aToy = {};
  handleLab(uToy, aToy, { lab: 'toy-toggle' });
  handleLab(uToy, aToy, { lab: 'passion-record' });
  assert.equal(labReady(uToy, aToy, '底层操作好玩与团队激情'), true);
});

test('第 9 至 16 章交互试验台：状态响应、参数权重与就绪断言正常', () => {
  resetLabRuntime();
  for (let chId = 9; chId <= 16; chId++) {
    const chapter = chapterLibrary[chId];
    assert.equal(chapter.units.length, 4);
    for (const unit of chapter.units) {
      const act = {};
      handleLab(unit, act, { lab: 'generic-opt', value: '0' });
      handleLab(unit, act, { lab: 'generic-val', value: '1' });
      handleLab(unit, act, { lab: 'generic-record' });
      handleLab(unit, act, { lab: 'generic-opt', value: '1' });
      handleLab(unit, act, { lab: 'generic-record' });
      assert.equal(labReady(unit, act, '学习笔记记录'), true);
    }
  }
});
`;

testCode = testCode.replace("test('畸形新增章节备份不能使实验、笔记或作品页崩溃', () => {", newTests + "\ntest('畸形新增章节备份不能使实验、笔记或作品页崩溃', () => {");

fs.writeFileSync('tests/workbook.test.mjs', testCode);
console.log('tests/workbook.test.mjs updated!');
