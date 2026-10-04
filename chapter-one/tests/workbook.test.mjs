import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { initialState } from '../dist/core.js';
import { restoreWorkbook, importWorkbook, newGrid, moveGrid, interruptRoute, cleanLab, restoreLaterChapter } from '../dist/workbook.js';
import { chapterCatalog, chapterLibrary } from '../dist/chapters.js';
import { handleLab, labReady, resetLabRuntime, renderLab } from '../dist/labs.js';
const walk = (game, directions) => directions.reduce(moveGrid, game);
test('旧第一章迁入新工作簿，章节状态独立，旧备份仅恢复第一章', () => {
  const old=initialState();old.notes.begin='保留我的笔记';old.completed=[0];old.completedAt[0]='2026-10-04T10:00:00Z';
  const w=restoreWorkbook(null,JSON.stringify(old));assert.equal(w.chapters[1].notes.begin,'保留我的笔记');
  w.chapters[2]=initialState();w.chapters[2].notes.experience='第二章';w.currentChapter=2;
  const restored=restoreWorkbook(JSON.stringify(w));assert.equal(restored.currentChapter,2);assert.equal(restored.chapters[2].notes.experience,'第二章');assert.deepEqual(restored.chapters[1].completed,[0]);
  const merged=importWorkbook(old,restored);assert.equal(merged.chapters[2].notes.experience,'第二章');assert.equal(merged.currentChapter,1);
  assert.equal(restoreWorkbook('{broken',JSON.stringify(old)).chapters[1].notes.begin,'保留我的笔记');
});
test('畸形 JSON 清理危险属性、过深结构与无效数字', () => {
  const sanitized=cleanLab(JSON.parse('{"__proto__":{"bad":true},"constructor":"x","normal":"<b>文本</b>"}'));
  assert.equal(Object.hasOwn(sanitized,'__proto__'),false);assert.equal(sanitized.normal,'<b>文本</b>');assert.equal(cleanLab(Infinity),null);
});
test('规则沙盒执行边界、障碍、预算与胜负，无法非法跳格', () => {
  const g=newGrid({budget:6,obstacles:true});assert.equal(moveGrid(g,'left').steps,0);
  const blocked=moveGrid(moveGrid(g,'right'),'down');assert.equal(blocked.position,1);assert.equal(blocked.steps,1);
  const win=walk(g,['down','down','down','right','right','right']);assert.equal(win.outcome,'won');assert.equal(win.position,15);assert.equal(win.steps,6);
  const lose=walk(g,['right','left','right','left','right','left']);assert.equal(lose.outcome,'lost');assert.equal(moveGrid(lose,'right').position,0);
});
test('资源用途改变进入灯塔的合法条件，两种规则均可完成', () => {
  const direct=['down','down','down','right','right','right'];
  assert.equal(walk(newGrid({key:false}),direct).outcome,'won');
  const locked=walk(newGrid({key:true}),direct);assert.equal(locked.position,14);assert.equal(locked.outcome,'playing');assert.equal(locked.steps,5);
  const withKey=walk(newGrid({key:true}),['right','right','right','down','down','down']);assert.equal(withKey.collected,true);assert.equal(withKey.outcome,'won');
  const exploration=walk(newGrid({goal:false,budget:6}),Array.from({length:20},(_,i)=>i%2?'left':'right'));assert.equal(exploration.outcome,'playing');assert.equal(exploration.steps,20);
});
test('中断实际保留或丢失进度，完成需两种尝试与个人解释', () => {
  assert.equal(interruptRoute(2,true),2);assert.equal(interruptRoute(2,false),0);
  resetLabRuntime();const u=chapterLibrary[3].units[2],a={};
  for(const d of [{lab:'step'},{lab:'step'},{lab:'interrupt'},{lab:'resume'}])handleLab(u,a,d);
  assert.equal(a.runs[0].after,0);assert.equal(labReady(u,a,'说明'),false);
  for(const d of [{lab:'checkpoint'},{lab:'step'},{lab:'step'},{lab:'interrupt'},{lab:'resume'}])handleLab(u,a,d);
  assert.equal(a.runs[1].after,2);assert.equal(labReady(u,a,''),false);assert.equal(labReady(u,a,'通勤时保留进度'),true);
});
test('全书 34 章，34 章 136 单元存在；内容定位有扫描页且在章范围', () => {
  assert.equal(chapterCatalog.length,34);assert.equal(Array.from({length:34},(_,i)=>i+1).flatMap(id=>chapterLibrary[id].units).length,136);
  const ids=[];
  for(const [id,c] of Object.entries(chapterLibrary)) {
    const manifest=chapterCatalog.find(c=>c.id===Number(id));
    for(const u of c.units){ids.push(u.id);assert.ok(u.pages.length);for(const p of u.pages){assert.ok(p>=manifest.pdfStart&&p<=manifest.pdfEnd);assert.ok(existsSync(new URL(`../dist/assets/source/page-${p}.jpg`,import.meta.url)));}}
  }
  assert.equal(new Set(ids).size,ids.length);
});

test('单文件打包可解析，无模块导入、重复变量或外部脚本依赖', async () => {
  const html=readFileSync(new URL('../dist/开始学习.html',import.meta.url),'utf8');
  const source=html.match(/<script type="module">([\s\S]*?)<\/script>/)[1];
  assert.equal(/^import /m.test(source),false);assert.equal(html.includes('src="app.js"'),false);
  const { spawnSync }=await import('node:child_process');const result=spawnSync(process.execPath,['--input-type=module','--check'],{input:source,encoding:'utf8'});assert.equal(result.status,0,result.stderr);
});


test('畸形新增章节备份不能使实验、笔记或作品页崩溃', () => {
  const restored=restoreLaterChapter({notes:[],activities:{rubric:'bad',chapterPlan:4,experience:{runs:'bad',visited:{},essentials:null,config:[]},toy:{},tetrad:{runs:'bad'}}});
  assert.deepEqual(restored.notes,{});assert.deepEqual(restored.activities.rubric,[]);assert.deepEqual(restored.activities.experience.runs,[]);
  resetLabRuntime();assert.doesNotThrow(()=>renderLab(chapterLibrary[2].units[0],restored.activities.experience));
  const free=renderLab(chapterLibrary[4].units[0],restored.activities.toy);assert.ok(free.includes('目标：自由探索'));
  const tetrad=renderLab(chapterLibrary[5].units[1],restored.activities.tetrad);assert.ok(tetrad.includes('四元素'));
});
