// Rebuild descriptive documents from the authored course, never change verification status.
import {writeFile} from 'node:fs/promises';
import {chapterLibrary,chapterCatalog} from '../dist/chapters.js';
const content=new URL('../content/',import.meta.url);
const forms={builder:'设计作品编辑',graph:'关系图搭建',order:'结构排序',case:'约束与方案取舍',machine:'可运行状态机',probability:'概率分布与抽样',economy:'资源流动模拟',payoff:'策略收益表',puzzle:'可解谜题与提示',curve:'兴趣曲线编辑',interface:'可操作界面对照',map:'关卡编辑与寻路',palette:'色彩与视觉对照',memory:'注意力与回忆任务',cashflow:'收入与成本推算'};
const evidence={builder:'填写全部作品部分（至少两部分）。',graph:'填解释与验证问题，添加至少两条不同连线。',order:'实际重排一次，并填写理由。',case:'在预算内组合至少一项，并填写选择理由和代价。',machine:'执行至少三个事件，留下实际转移轨迹。',probability:'完成至少20次本机随机抽样。',economy:'修改收支或补偿参数，生成可计算轨迹。',payoff:'修改加成，比较逐列收益及被支配行。',puzzle:'亲自操作使九灯全灭；提示不自动代做。',curve:'修改时刻值，并填写事件与验证方案。',interface:'完成至少三次正确动作，保存实际错误与映射模式。',map:'亲自从入口合法行走到出口。',palette:'切换场景颜色，并填写观察与个人感受。',memory:'先隐藏线索，写回忆，再对照本轮线索。',cashflow:'修改成本或收入假设，记录按月推算。'};
const catalog=chapterCatalog.map(c=>({...c,pdfRange:[c.pdfStart,c.pdfEnd],bookRange:[c.pdfStart-48,c.pdfEnd-48],lenses:chapterLibrary[c.id].lenses.map(l=>l.number)}));
await writeFile(new URL('book-chapters.json',content),JSON.stringify(catalog,null,2)+'\n');
let overview='# 全书课程与来源索引\n\n2026-10-04 修订。34章、136单元；第5—34章使用15种工作台形式。113面透镜为1—112与∞，以下只是来源索引，不表示113面均有独立教学或已掌握。原书第1章无编号透镜。\n\n| 章 | 主题 | 四个学习单元 | 本章原书透镜 |\n|---|---|---|---|\n';
for(const c of Object.values(chapterLibrary)){
 const id=c.book.number,manifest=chapterCatalog.find(x=>x.id===id);
 overview+=`| ${id} | ${c.book.chapter} | ${c.units.map(u=>u.nav).join('；')} | ${c.lenses.map(l=>'#'+l.number+' '+l.name).join('；')||'无新增编号透镜'} |\n`;
 if(id<5)continue;
 const lines=[`# 第${id}章：${c.book.chapter} — 教学设计记录`,'','修订日期：2026-10-04。内容源：dist/course.js；保留原单元ID以兼容个人存档。',`原书PDF ${manifest.pdfStart}—${manifest.pdfEnd}，书中 ${manifest.pdfStart-48}—${manifest.pdfEnd-48}。`, '','四单元是入门与应用路线，未逐段替代全章阅读。解释是转述；工作台与规则是教学补充。开放回答由学习者自评。','','## 来源与目标','','| 单元ID | 学习目标/概念 | PDF定位 | 形式 |','|---|---|---|---|',...c.units.map(u=>`| ${u.id} | ${u.lead} | ${u.pages.join('、')} | ${forms[u.studio.kind]} |`),'','## 操作与记录',''];
 for(const u of c.units){lines.push(`### ${u.nav}`,'',u.idea,'',u.studio.instruction,'',`记录条件：${evidence[u.studio.kind]}${u.studio.minRuns===2?'还需保存两种不同参数或映射/地图条件，重复抽样同一条件不凑数。':''}${u.studio.distinctPath?'两条已保存路径也必须不同。':''} 最后填写一条个人解释，才可记录单元完成。`, `回忆/迁移：${u.prompts[0]}`,'');}
 lines.push('## 章末作品','',c.project,'',...c.rubric.map(r=>'- '+r),'','已有作品、自评、笔记和日期均保留；旧记录不代表已完成新版操作。版号3用于区分新版操作证据。','', '## 本章透镜来源','',...c.lenses.map(l=>`- #${l.number} ${l.name}：PDF ${l.pdfPage}，书中 ${l.pdfPage-48}。`),'','验证范围与限制以 content/verification.md 为准，不能从存在此文件推断已经验收。','');
 await writeFile(new URL(`chapter-${id}-design.md`,content),lines.join('\n'));
}
await writeFile(new URL('course-overview.md',content),overview);
console.log('已同步34章目录、课程总览和第5—34章设计记录；验证状态仍需人工更新。');
