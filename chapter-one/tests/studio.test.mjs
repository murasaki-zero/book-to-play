import test from 'node:test';
import assert from 'node:assert/strict';
import {chapterLibrary,chapterCatalog} from '../dist/chapters.js';
import {lensIndex} from '../dist/lenses.js';
import {projectReady,probabilityModel,economyModel,cashflowModel,dominantRows,toggleLights,solveLights,machineStep,studioInput,handleStudio,studioReady,renderStudio} from '../dist/studio.js';
import {restoreWorkbook} from '../dist/workbook.js';
const lesson=id=>Object.values(chapterLibrary).flatMap(c=>c.units).find(u=>u.id===id);
const act=(u,a,lab,value='')=>handleStudio(u,a,{lab:'studio-'+lab,value:String(value)});
const set=(u,a,key,value)=>studioInput(u,a,key,String(value));
const near=(a,b)=>assert.ok(Math.abs(a-b)<1e-9,`${a} != ${b}`);
function operate(u,a,second=false) {
  const p=u.studio;
  for(let i=0;i<(p.fields||[]).length;i++)set(u,a,'f'+i,'我的具体设计：动作与条件；依据这轮记录，下一次向玩家验证。'+(second?'第二轮':''));
  switch(p.kind){
    case 'graph':set(u,a,'from',0);set(u,a,'to',1);act(u,a,'edge');set(u,a,'from',1);set(u,a,'to',2);act(u,a,'edge');break;
    case 'order':act(u,a,'down',0);break;
    case 'case':act(u,a,'pick',0);break;
    case 'machine':act(u,a,'event',0);act(u,a,'event',0);act(u,a,'event',1);break;
    case 'probability':if(second)set(u,a,'n:dice',2);act(u,a,'sample');break;
    case 'economy':set(u,a,'n:income',second?30:21);break;
    case 'payoff':set(u,a,'n:bonus',second?7:1);break;
    case 'puzzle':for(const i of solveLights(toggleLights(toggleLights(Array(9).fill(0),0),4)))act(u,a,'light',i);break;
    case 'curve':set(u,a,'n:a',second?7:4);break;
    case 'cashflow':set(u,a,'n:price',second?30:21);break;
    case 'interface':act(u,a,'mode',second?2:1);for(const i of (second?[2,1,0]:[0,1,2]))act(u,a,'tap',i);break;
    case 'map':if(second)act(u,a,'mode',1);for(const i of (second?[3,3,3,3,2,2,2,2]:[2,2,2,2,3,3,3,3]))act(u,a,'walk',i);break;
    case 'palette':act(u,a,'mode',1);break;
    case 'memory':act(u,a,'hide');set(u,a,'f0','钥匙 桥 门');act(u,a,'memory-check');break;
  }
}
test('章末自评按实际条目校验：第11章两项可保存，缺项或伪造索引不可保存',()=>{
  const two=chapterLibrary[11].rubric;assert.equal(two.length,2);
  assert.equal(projectReady('自己的设计',[0,1],two),true);
  assert.equal(projectReady('自己的设计',[0,9],two),false);
  assert.equal(projectReady('   ',[0,1],two),false);
  assert.equal(projectReady('方案',[0,1],['甲','乙','丙']),false);
  const restored=restoreWorkbook(JSON.stringify({version:2,currentChapter:11,chapters:{11:{activities:{chapterPlan:'说明',rubric:[0,1],capstoneDone:'2026-10-01T00:00:00Z',capstoneRevision:3}}}}));assert.equal(restored.chapters[11].activities.capstoneRevision,3);assert.equal(projectReady(restored.chapters[11].activities.chapterPlan,restored.chapters[11].activities.rubric,two),true);
});
test('骰子分布归一、同均值不同方差，门槛改变胜率与期望净收益',()=>{
  const one=probabilityModel(1,4,10,4),two=probabilityModel(2,4,10,4);
  near(one.outcomes.reduce((s,o)=>s+o.p,0),1);near(two.outcomes.reduce((s,o)=>s+o.p,0),1);
  near(one.mean,3.5);near(two.mean,3.5);near(one.variance,35/12);near(two.variance,35/24);
  near(one.win,.5);near(two.win,15/36);near(one.net,1);near(two.net,1/6);
  near(probabilityModel(1,6,12,3).net,-1);assert.equal(two.outcomes.length,11);
});
test('资源模型按回合收支计算，下限为零，落后补偿可改变差距',()=>{
  const flat=economyModel({stock:100,income:10,sink:10});assert.equal(flat.at(-1).total,150);
  const drain=economyModel({stock:4,income:0,sink:10});assert.equal(drain[1].total,0);
  const grow=economyModel({stock:100,income:20,sink:10,rounds:6});assert.equal(grow.at(-1).total,270);
  const bonus=economyModel({stock:100,income:10,sink:10,catchup:5,rounds:6});assert.equal(bonus.at(-1).a-bonus.at(-1).b,20);
});
test('现金流不会把亏损变收益；策略支配必须逐列比较',()=>{
  assert.deepEqual(cashflowModel({price:10,customers:10,monthlyCost:150,upfront:100,months:2}),{revenue:100,net:-50,values:[-100,-150,-200]});
  assert.deepEqual(dominantRows([[2,2],[3,1]]),[false,false]);
  assert.deepEqual(dominantRows([[2,2],[3,2]]),[true,false]);
  assert.deepEqual(dominantRows([[2,2],[2,2]]),[false,false]);
});
test('谜题邻接翻转、提示不代做、真实解可达；状态机使用编辑后的转移表',()=>{
  assert.deepEqual(toggleLights(Array(9).fill(0),0),[1,1,0,1,0,0,0,0,0]);
  const initial=toggleLights(toggleLights(Array(9).fill(0),0),4),solution=solveLights(initial);
  assert.ok(solution.length);assert.ok(solution.reduce(toggleLights,initial).every(x=>x===0));
  const u=lesson('ahaMoment'),a={};act(u,a,'hint');assert.equal(a.studio.moves,0);assert.deepEqual(a.studio.board,initial);
  const m=lesson('spaceTimeState'),b={};set(m,b,'t:0:0',2);act(m,b,'event',0);assert.equal(b.studio.state,2);
  assert.equal(machineStep(1,2,[[0],[0],[0]]),1);
});
test('预算拒绝超支；图拒绝自连接和重复；地图拒绝穿墙与越界',()=>{
  const u=lesson('empathyLab'),a={};assert.ok(u.studio.actions);
  act(u,a,'pick',0);const cost=u.studio.actions[0].cost;
  for(let i=1;i<u.studio.actions.length;i++)act(u,a,'pick',i);
  assert.ok(a.studio.picks.reduce((s,i)=>s+u.studio.actions[i].cost,0)<=u.studio.budget);
  act(u,a,'pick',0);assert.ok(!a.studio.picks.includes(0));assert.ok(cost>0);
  const g=lesson('hologram'),b={};set(g,b,'f0','规则导致行为');set(g,b,'to',0);assert.match(act(g,b,'edge'),/不同/);
  set(g,b,'to',1);act(g,b,'edge');assert.match(act(g,b,'edge'),/已存在/);assert.equal(b.studio.edges.length,1);
  const map=lesson('indirectControl'),c={};assert.match(act(map,c,'walk',1),/不能通行/);assert.equal(c.studio,undefined);
  act(map,c,'walk',3);act(map,c,'walk',3);assert.match(act(map,c,'walk',2),/不能通行/);assert.equal(c.studio.position,2);
});
test('旧重复点击、字母笔记不满足新证据；同一结果不能重复记录，比较要求两个不同条件',()=>{
  const u=lesson('skillProbability'),a={runs:[{kind:'generic',summary:'配置A',at:'2026-10-01'}]};assert.equal(studioReady(u,a,'a'),false);
  assert.match(act(u,a,'record'),/先完成/);operate(u,a);act(u,a,'record');assert.equal(studioReady(u,a,'自己的解释'),false);
  assert.match(act(u,a,'record'),/已经记录/);assert.equal(a.runs.length,2);
  act(u,a,'sample');act(u,a,'record');assert.equal(studioReady(u,a,'自己的解释'),false);
  operate(u,a,true);act(u,a,'record');assert.equal(studioReady(u,a,'自己的解释'),true);
  assert.equal(studioReady(u,a,''),false);
});
test('第5—34章120单元都可通过实际操作记录；每章至少两种形式，无泛化A/B/C模板',()=>{
  let count=0;const kinds=new Set();
  for(let id=5;id<=34;id++){
    const c=chapterLibrary[id];assert.ok(new Set(c.units.map(u=>u.studio.kind)).size>=2,'chapter '+id);
    for(const u of c.units){count++;kinds.add(u.studio.kind);const a={};assert.match(String(act(u,a,'record')),/先完成/,u.id);
      operate(u,a);act(u,a,'record');assert.equal(a.runs?.length,1,u.id);
      if(u.studio.minRuns===2){assert.equal(studioReady(u,a,'解释'),false,u.id);operate(u,a,true);act(u,a,'record');}
      assert.equal(studioReady(u,a,'解释'),true,u.id);assert.ok(a.runs.at(-1).summary.length>10);
      assert.doesNotMatch(renderStudio(u,a),/配置 ?[ABC]|沉浸度.*%|留存率.*%/);
    }
  }assert.equal(count,120);assert.equal(kinds.size,15);
});
test('v2旧笔记、完成时间与复习日期保留；新参数、连线和记录也跨恢复保存',()=>{
  const u=lesson('hologram'),a={};operate(u,a);act(u,a,'record');
  const w={version:2,currentChapter:5,chapters:{5:{unit:0,view:'lesson',completed:[0],notes:{hologram:'旧笔记'},completedAt:{0:'2026-10-01T00:00:00Z'},review:{0:{stage:1,lastAt:'2026-10-10T00:00:00.000Z'}},activities:{hologram:a}}}};
  const restored=restoreWorkbook(JSON.stringify(w)),saved=restored.chapters[5];
  assert.equal(saved.notes.hologram,'旧笔记');assert.deepEqual(saved.completed,[0]);assert.equal(Date.parse(saved.completedAt[0]),Date.parse('2026-10-01T00:00:00Z'));assert.equal(saved.review[0].lastAt,'2026-10-10T00:00:00.000Z');
  assert.deepEqual(saved.activities.hologram.studio.edges,a.studio.edges);assert.equal(saved.activities.hologram.runs[0].summary,a.runs[0].summary);
  assert.equal(studioReady(u,saved.activities.hologram,'解释'),true);
});
test('畸形实验存档安全渲染，用户文字转义；透镜为1—112及∞，来源按章节归属',()=>{
  const a={studio:{fields:['<img src=x onerror=alert(1)>'],edges:[{from:999,to:0,label:'x'}],table:null,numbers:{dice:'bad'}},runs:[null]};
  for(let id=5;id<=34;id++)for(const u of chapterLibrary[id].units)assert.doesNotThrow(()=>renderStudio(u,a));
  assert.ok(renderStudio(lesson('hologram'),a).includes('&lt;img'));assert.equal(renderStudio(lesson('hologram'),a).includes('<img src=x'),false);
  assert.equal(lensIndex.length,113);assert.deepEqual(lensIndex.slice(0,112).map(l=>l.number),Array.from({length:112},(_,i)=>i+1));
  assert.equal(lensIndex.at(-1).number,'∞');assert.equal(lensIndex.at(-1).pdfPage,591);
  for(const c of chapterCatalog)for(const l of chapterLibrary[c.id].lenses)assert.ok(l.pdfPage>=c.pdfStart&&l.pdfPage<=c.pdfEnd);
  assert.match(lesson('lazzaroFun').lead,/勒布朗/);assert.deepEqual(lesson('bartleTypes').pages,[180,181,182]);
  assert.deepEqual(chapterLibrary[34].lenses.map(l=>l.number),[112,'∞']);
});
