import test from 'node:test';
import assert from 'node:assert/strict';
import { iwataCatalog, iwataChapters } from '../dist/iwata-content.js';
import { rpnCalc, evalDebtRestructure, evalBottleneck, evalProgrammerResponse, evalMother2Choice, evalConsoleStrategy } from '../dist/iwata-sim.js';

test('岩田先生目录结构符合规范且包含7章全书', () => {
  assert.equal(iwataCatalog.length, 7);
  for (let i = 0; i < 7; i++) {
    assert.equal(iwataCatalog[i].id, i + 1);
    assert.equal(iwataCatalog[i].ready, true, `第 ${i+1} 章未就绪`);
  }
});

test('全书 7 章各小节均包含完整原文自然段落', () => {
  let totalSections = 0;
  for (let chId = 1; chId <= 7; chId++) {
    const list = iwataChapters[chId];
    assert.ok(Array.isArray(list) && list.length > 0, `第 ${chId} 章小节列表为空`);
    totalSections += list.length;
    for (const sec of list) {
      assert.ok(sec.id && sec.title);
      assert.ok(Array.isArray(sec.paragraphs) && sec.paragraphs.length > 0, `${sec.title} 原文段落为空`);
    }
  }
  assert.equal(totalSections, 58, '全书小节总数应为58节（含各章访谈与拾零）');
});

test('RPN 计算器正确模拟压栈与运算', () => {
  let res = rpnCalc([], 1);
  assert.deepEqual(res.stack, [1]);
  res = rpnCalc(res.stack, 2);
  assert.deepEqual(res.stack, [1, 2]);
  res = rpnCalc(res.stack, '+');
  assert.deepEqual(res.stack, [3]);
  res = rpnCalc(res.stack, 4);
  res = rpnCalc(res.stack, '*');
  assert.deepEqual(res.stack, [12]);
});

test('债务重组模型准确给出实时处境与动荡反馈', () => {
  // Balanced: 42% salary, 38% debt, 20% rd
  const balanced = evalDebtRestructure({ salary: 42, debt: 38, rd: 20 });
  assert.equal(balanced.isBalanced, true);
  assert.equal(balanced.salaryStatus.level, 'good');
  assert.equal(balanced.debtStatus.level, 'good');
  assert.equal(balanced.rdStatus.level, 'good');

  // Low salary (<30%): Danger warning on personnel loss
  const lowSalary = evalDebtRestructure({ salary: 20, debt: 50, rd: 30 });
  assert.equal(lowSalary.isBalanced, false);
  assert.equal(lowSalary.salaryStatus.level, 'danger');
  assert.match(lowSalary.salaryStatus.desc, /离职信/);

  // Low debt (<25%): Creditor liquidation warning
  const lowDebt = evalDebtRestructure({ salary: 50, debt: 20, rd: 30 });
  assert.equal(lowDebt.debtStatus.level, 'danger');
  assert.match(lowDebt.debtStatus.desc, /银行下达最后通牒/);
});

test('瓶颈识别算法准确识别最狭窄环节并给予疏通提示', () => {
  const pipe = { concept: 4, art: 6, logic: 16, qa: 3 };
  const good = evalBottleneck(pipe, 'logic');
  assert.equal(good.success, true);
  assert.equal(good.nextPipeline.logic, 10);

  const bad = evalBottleneck(pipe, 'concept');
  assert.equal(bad.success, false);
  assert.match(bad.msg, /盲目优化/);
});

test('程序员应对模式评估准确反映岩田聪哲学', () => {
  const iwataMode = evalProgrammerResponse('iwata');
  assert.equal(iwataMode.isIwataWay, true);
  assert.match(iwataMode.title, /重构/);

  const rejectMode = evalProgrammerResponse('reject');
  assert.equal(rejectMode.isIwataWay, false);
  assert.match(rejectMode.feedback, /对立扯皮/);
});

test('地球冒险2抉择准确重演历史决断', () => {
  const rewrite = evalMother2Choice('rewrite');
  assert.equal(rewrite.isHistorical, true);
  assert.match(rewrite.time, /半年/);

  const patch = evalMother2Choice('patch');
  assert.equal(patch.isHistorical, false);
  assert.match(patch.time, /2 年以上/);
});

test('主机延长线策略准确辨析红海陷阱与蓝海创新', () => {
  const blueOcean = evalConsoleStrategy('blue-ocean');
  assert.equal(blueOcean.isBlueOcean, true);
  assert.match(blueOcean.feedback, /打破既有延长线/);

  const specWar = evalConsoleStrategy('spec-war');
  assert.equal(specWar.isBlueOcean, false);
  assert.match(specWar.feedback, /军备竞赛/);
});
