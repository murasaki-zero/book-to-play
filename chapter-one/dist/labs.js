import { newGrid, moveGrid, interruptRoute } from './workbook.js';
import { renderStudio, handleStudio, studioReady } from './studio.js';
const labEscape = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' })[c]);
const labRuntime = new Map();
const labSequence = [1,10,4,7,2];
export const venueCards = [
  ['炉边','私人','一起放松，身边的人也可能观看。','共享进展，考虑轻松的身体姿态。','⌂'],
  ['工作台','私人','独处、前倾，可能较长时间专注。','较复杂的操作与信息可能适合；需验证。','▤'],
  ['读书角','私人','舒适、安静、较私人的片刻。','考虑轻松操作与个人节奏。','▱'],
  ['剧场','公共','许多人观看同一个呈现。','考虑共同观看与交互协调。','◉'],
  ['竞技场','公共','竞争、观众和公共结果相互关联。','让目标、进展和结果容易被看见。','⚑'],
  ['博物馆','公共','自由探索，比较不同的展示。','给出好奇的线索和探索入口。','◇'],
  ['游戏桌','半公共','面对面交流，共享物件或区域。','设计人与人之间的信息与行动。','▦'],
  ['操场','半公共','自发聚集，身体与环境参与。','考虑空间、进入退出和自定规则。','☀'],
  ['随时随地','半公共','碎片时间，注意力可能被打断。','考虑短任务、清楚状态与恢复。','↗']
];
const essenceCards = ['与朋友你来我往','出其不意的攻击','躲开后反击','雪的寒冷触感','逼真的天气','复杂的体力数值','熟悉的场地','输赢的悬念'];
const definitionCards = ['自主参与','目标','冲突','规则','输赢','交互','挑战','内生价值','吸引玩家','封闭正式系统'];
function labKey(u) { return u.id; }
function runtimeFor(u, a) {
  if (!labRuntime.has(labKey(u))) labRuntime.set(labKey(u), { hits:0, misses:0, running:false, peek:false, grid:newGrid(a.config || (u.activity.type==='toy'?{goal:false}:{})), progress:0, interrupted:false, interruptionAt:0 });
  return labRuntime.get(labKey(u));
}
export function resetLabRuntime() { labRuntime.clear(); }
function labButton(label, action, value='', extra='') { return `<button class="button secondary" data-lab="${action}" data-value="${labEscape(value)}" ${extra}>${label}</button>`; }
function labField(a, name, label, placeholder='') { return `<label class="lab-field" for="lab-${name}">${label}<textarea id="lab-${name}" data-lab-field="${name}" placeholder="${labEscape(placeholder)}">${labEscape(a[name])}</textarea></label>`; }
function runList(a) { return (a.runs || []).length ? `<div class="run-log"><strong>已保存的实际尝试</strong>${a.runs.slice(-4).map(r=>`<p>${labEscape(r.summary)}</p>`).join('')}</div>` : '<p class="tiny">结束一轮后保存结果；尚未结束的这轮不会保存。</p>'; }
function pulseBoard(u,a,r) {
  const mode = a.mode || 'changing', target = mode==='steady'?5:labSequence[r.hits%labSequence.length];
  return `<div class="pulse-layout"><div><div class="lab-controls">${u.activity.type==='twoPass'?labButton(`第 ${a.pass===2?2:1} 轮 · 切换轮次`,'pass'):u.activity.type==='spectator'?labButton(a.public?'观众信息：公开':'观众信息：隐藏','public'):labButton(mode==='steady'?'轨迹：固定位置':'轨迹：变换位置','pulse-mode')}</div><div class="pulse-board" role="group" aria-label="追光棋盘">${Array.from({length:12},(_,i)=>`<button class="pulse-cell ${r.running&&i===target?'lit':''}" data-lab="hit" data-value="${i}" aria-label="位置 ${i+1}${r.running&&i===target?'，发光目标':''}" ${!r.running?'disabled':''}>${r.running&&i===target?'<span class="light-dot"></span>':'<span class="empty-dot"></span>'}</button>`).join('')}</div><div class="lab-controls">${labButton(r.running?'重新开始本轮':'开始追光 · 命中 5 次','pulse-start')}${u.activity.type==='twoPass'&&a.pass===2&&r.running?labButton('停一下，观察此刻感受','peek'):''}</div><div class="live-line" role="status">${r.running?`已命中 ${r.hits} / 5 · 点错 ${r.misses} 次`:'不限时 · 可用 Tab 定位，空格或回车点击'}</div>${r.peek?'<div class="feedback">此刻你注意到了什么？记住它，继续这一轮。这次停顿只是教学演示。</div>':''}</div>${u.activity.type==='spectator'?`<aside class="audience-screen"><span class="eyebrow">模拟观众席</span><h4>${a.public?'目标：找到 5 次光点':'一个亮点正在移动'}</h4><div class="audience-score">${a.public?`${r.hits} / 5`:'—'}</div><p>${a.public?'观众能看到目标与进展。':'观众暂时看不到任务目标与计数。'}</p></aside>`:`<aside class="lab-aside"><span class="eyebrow">体验采样</span><h4>先体验，再描述。</h4><p>${u.activity.type==='twoPass'?'第一轮完整体验后回忆；第二轮可中途停一下。':'这里记录操作结果，感受由你自己描述。'}</p></aside>`}</div>${runList(a)}`;
}
function gridBoard(u,a,r) {
  const g=r.grid, isValue=u.activity.type==='value', isToy=u.activity.type==='toy';
  return `<div class="lab-controls">${isValue?labButton(g.config.key?'用途：开门钥匙':'用途：只计收集','value-mode'):labButton(g.config.goal?'目标：抵达灯塔':'目标：自由探索','grid-goal')}${!isValue&&!isToy?labButton(`步数上限：${g.config.budget}`,'grid-budget')+labButton(g.config.obstacles?'障碍：开启':'障碍：关闭','grid-obstacles'):''}${labButton('按当前规则重新开始','grid-reset')}</div><div class="grid-layout"><div><div class="path-board" role="img" aria-label="四乘四棋盘，玩家在位置 ${g.position+1}，已走 ${g.steps} 步">${Array.from({length:16},(_,i)=>`<div class="path-cell ${g.position===i?'player':''} ${g.config.obstacles&&[5,6,9,10].includes(i)?'wall':''} ${i===15?'goal':''}"><span>${g.position===i?'●':g.config.obstacles&&[5,6,9,10].includes(i)?'▧':i===3&&!g.collected?(g.config.key?'⚿':'✧'):i===15?'⚑':''}</span><small>${i===0?'起点':i===15?'灯塔':i===3?'资源':''}</small></div>`).join('')}</div><div class="direction-pad" role="group" aria-label="移动控制（也支持方向键）">${labButton('↑ 上','move','up')}${labButton('← 左','move','left')}${labButton('↓ 下','move','down')}${labButton('→ 右','move','right')}</div></div><aside class="lab-aside"><span class="eyebrow">当前规则</span><h4>${g.config.goal?'到达右下角灯塔':'自由移动，没有胜负'}</h4><p>${g.config.goal?`最多 ${g.config.budget} 步。`:'可以随时记录探索。'}${g.config.key?'先拿右上角钥匙，再进入灯塔。':'右上角光点只记录收集。'}</p><div class="stat-pair"><span>步数<strong>${g.steps}${g.config.goal?` / ${g.config.budget}`:''}</strong></span><span>${g.config.key?'钥匙':'光点'}<strong>${g.collected?'已获得':'未获得'}</strong></span></div><div class="feedback" role="status">${g.notice?labEscape(g.notice):g.outcome==='won'?'已到达灯塔，本轮结果已保存。':g.outcome==='lost'?'步数用完，本轮结果已保存。调整规则或重新尝试。':'相邻移动，每次合法移动消耗一步。'}</div>${!g.config.goal?labButton('记录这次自由探索','grid-record'):''}<p class="tiny">修改规则会重新开局；记录按不同规则分别保存。</p></aside></div>${runList(a)}`;
}
function interruptionBoard(u,a,r) {
  const adaptive=u.activity.type==='adaptation', commute=adaptive&&a.profile==='commute', checkpoint=adaptive?commute:a.checkpoint===true, total=adaptive&&!commute?8:4;
  return `<div class="lab-controls">${adaptive?labButton(commute?'场景：通勤片刻':'场景：专注工作台','profile'):labButton(checkpoint?'中断后：保留进度':'中断后：从头开始','checkpoint')}</div><div class="route-preview ${commute?'commute':''}"><div class="route-header"><span>${adaptive?(commute?'通勤 · 分段任务':'工作台 · 连续任务'):'收集路径上的记忆片段'}</span><strong>${r.progress} / ${total}</strong></div><div class="route-steps">${Array.from({length:total},(_,i)=>`<span class="route-stone ${i<r.progress?'passed':''}">${i<r.progress?'✓':i+1}</span>`).join('')}</div><p>${checkpoint?'离开时保留当前位置，可以回来继续。':'离开时本轮归零，需要从起点再来。'}</p><div class="lab-controls">${labButton(r.interrupted?'恢复任务':r.progress>=total?'重新开始':'走下一步',r.interrupted?'resume':r.progress>=total?'route-reset':'step')}${labButton('模拟来电中断','interrupt','',''+(r.interrupted||r.progress===0?'disabled':''))}</div><div role="status" class="live-line">${r.interrupted?`暂停前走了 ${r.interruptionAt} 步；恢复后${checkpoint?'保留':'归零'}。`:'你可以走两步，再模拟一次中断。'}</div></div>${runList(a)}`;
}
function cardComposer(a, cards, name, limit) {
  const selected=Array.isArray(a[name])?a[name].filter(x=>cards.includes(x)):[];
  return `<div class="compose-layout"><div class="card-pool" role="group" aria-label="可选概念卡">${cards.map((c,i)=>`<button class="concept-card ${selected.includes(c)?'chosen':''}" data-lab="card" data-group="${name}" data-value="${i}" aria-pressed="${selected.includes(c)}">${labEscape(c)}<span>${selected.includes(c)?'已加入':'＋'}</span></button>`).join('')}</div><aside class="recipe"><span class="eyebrow">${name==='essentials'?'我的体验配方':'我的解释链'}</span><p>最多 ${limit} 张。用上下按钮排列，再写出你的理由。</p>${selected.length?selected.map((c,i)=>`<div class="recipe-row"><span>${i+1}. ${labEscape(c)}</span><button data-lab="order" data-group="${name}" data-value="${i}" data-direction="-1" aria-label="将${labEscape(c)}上移" ${i===0?'disabled':''}>↑</button><button data-lab="order" data-group="${name}" data-value="${i}" data-direction="1" aria-label="将${labEscape(c)}下移" ${i===selected.length-1?'disabled':''}>↓</button></div>`).join(''):'<div class="recipe-empty">点左侧卡片，开始搭建。</div>'}</aside></div>`;
}
export function renderLab(u,a) {
  if(u.studio)return renderStudio(u,a);
  const r=runtimeFor(u,a), type=u.activity.type; let body='';
  if(['pulse','twoPass','spectator'].includes(type)) body=pulseBoard(u,a,r);
  if(['toy','grid','value'].includes(type)) body=gridBoard(u,a,r);
  if(['interruption','adaptation'].includes(type)) body=interruptionBoard(u,a,r);
  if(type==='perspective') body=`<div class="perspective-grid">${[['behavior','心理学视角','具体发生了什么？','可观察到的行为，不推断所有人的心情。'],['context','人类学视角','情境与人有什么关系？','谁在场？怎样参与？有哪些生活习惯？'],['analogy','设计视角','别的设计领域给你什么启发？','如音乐的节奏、建筑的引导。类比需要验证。']].map(([id,t,p,h],i)=>`<section class="perspective-card"><span class="large-index">0${i+1}</span><h4>${t}</h4><p>${h}</p>${labField(a,id,p)}</section>`).join('')}</div>${labField(a,'hypothesis','一个暂时的解释，以及你会怎样确认它')}`;
  if(type==='essence') body=cardComposer(a,essenceCards,'essentials',3)+labField(a,'recipe','把配方写成一种想表达的体验','我想让玩家感到……我会用……表达；删除……因为……');
  if(type==='forge') body=cardComposer(a,definitionCards,'chain',5)+labField(a,'definition','我的一句定义')+labField(a,'counterexample','一个边界例子，及它暴露的限制');
  if(type==='venues') {
    const v=Number.isInteger(a.venue)&&a.venue>=0&&a.venue<9?a.venue:0, card=venueCards[v];
    body=`<div class="venue-map">${venueCards.map((c,i)=>`<button class="venue-card ${v===i?'selected':''}" data-lab="venue" data-value="${i}" aria-pressed="${v===i}"><span class="venue-symbol">${c[4]}</span><strong>${c[0]}</strong><small>${c[1]}场景</small></button>`).join('')}</div><div class="venue-detail"><div><span class="eyebrow">${card[1]}场景 · ${card[0]}</span><h4>${card[2]}</h4><p>${card[3]}</p></div><div class="venue-seen"><strong>${(a.visited||[]).length} / 9 已探索</strong><p>至少查看两个，再描述你会怎样改造同一个游戏。</p></div></div>`;
  }
  if(type==='twoPass') body+=labField(a,'firstFeeling','第 1 轮结束后：回忆我的感受')+labField(a,'secondFeeling','第 2 轮：停顿时注意到了什么？');
  if(type==='pulse') body+=labField(a,'feeling','我的感受（不代表其他玩家）','出现在哪一刻？可以是好奇、紧张、无聊或其他感受。');
  return `<section class="activity lab-activity"><div class="activity-heading"><span class="activity-icon">✦</span><h3>${u.nav}</h3></div><p class="activity-intro">${labInstructions[type]}</p><span class="label teaching">教学补充 · ${labForms[type]}</span><div class="lab-body">${body}</div></section>`;
}
const labForms={pulse:'可玩原型',twoPass:'两轮体验对照',spectator:'双视角呈现',toy:'自由探索与目标对照',grid:'可执行规则',value:'资源用途对照',interruption:'中断与恢复',adaptation:'场景改造',perspective:'观察日志',essence:'概念卡编辑',forge:'定义重组',venues:'场景漫游'};
const labInstructions={pulse:'完成一轮追光：点击亮起的圆点，共 5 次。可切换固定与变换位置，再记录自己的感受。',twoPass:'完整玩完第 1 轮；切换到第 2 轮，在途中点击“停一下”后继续。结果按轮次分别保存。',spectator:'先在隐藏模式完成一轮；公开观众信息后再完成一轮。看右侧观众席多了哪些信息。',toy:'自由探索至少走两步并记录；打开目标模式，再尝试到达灯塔。',grid:'修改步数或障碍后试玩两种不同配置（走到成功或失败）。方向键和移动按钮均可操作。',value:'收集记录与钥匙模式各完成一轮（成功或失败）。资源用途会实际改变进门规则。',interruption:'每种恢复规则各做一次：走至少两步→模拟来电→恢复。两次结果会保存供你比较。',adaptation:'两种场景分别走至少两步并模拟来电、恢复。观察任务长度与恢复规则的变化。',perspective:'回想一段真实游戏经历，用三种视角写具体记录，再写一个需要确认的解释。',essence:'从打雪仗情境选 2—3 个关键部分，用上下按钮排优先级，再写一份体验配方。',forge:'选 3—5 个概念组织解释链，写出你的一句定义，再找一个边界例子检查它。',venues:'点击探索至少两个场景，比较人在其中怎样参与，再写出一处设计修改。'};
function logRun(a,run) { a.runs=[...(Array.isArray(a.runs)?a.runs:[]),{...run,at:new Date().toISOString()}].slice(-20); }
function resetGrid(u,a) { const r=runtimeFor(u,a); r.grid=newGrid(a.config || {}); return r; }
export function handleLab(u,a,d) {
  if(u.studio)return d.lab.startsWith('studio-')?handleStudio(u,a,d):false;
  const type=u.activity.type,r=runtimeFor(u,a),action=d.lab,value=Number(d.value);
  if(action==='pulse-start') { Object.assign(r,{hits:0,misses:0,running:true,peek:false}); }
  else if(action==='pulse-mode') { a.mode=a.mode==='steady'?'changing':'steady';r.running=false; }
  else if(action==='pass') { a.pass=a.pass===2?1:2;r.running=false;r.peek=false; }
  else if(action==='public') { a.public=!a.public;r.running=false;r.hits=0; }
  else if(action==='peek') { if(!r.running||r.hits===0)return '先命中一个目标，再停下来观察。';r.peek=true; }
  else if(action==='hit') {
    if(!r.running)return true;
    const target=a.mode==='steady'?5:labSequence[r.hits%labSequence.length];
    if(value!==target)r.misses++;
    else if(++r.hits===5){r.running=false;logRun(a,{kind:type,mode:a.mode||'changing',pass:a.pass===2?2:1,peek:r.peek,public:!!a.public,hits:r.hits,misses:r.misses,summary:`${type==='twoPass'?`第 ${a.pass===2?2:1} 轮`:type==='spectator'?`观众信息${a.public?'公开':'隐藏'}`:a.mode==='steady'?'固定位置':'变换位置'}：命中 5 次，点错 ${r.misses} 次${r.peek?'，途中停下来观察':''}。`});}
  }
  else if(['grid-goal','grid-budget','grid-obstacles','value-mode'].includes(action)) {
    const config={...r.grid.config};
    if(action==='grid-goal')config.goal=!config.goal;
    if(action==='grid-budget')config.budget=config.budget===6?10:6;
    if(action==='grid-obstacles')config.obstacles=!config.obstacles;
    if(action==='value-mode')config.key=!config.key;
    a.config=config;resetGrid(u,a);
  }
  else if(action==='grid-reset')resetGrid(u,a);
  else if(action==='move') {
    const before=r.grid;r.grid=moveGrid(r.grid,d.value);
    if(before.outcome==='playing'&&r.grid.outcome!=='playing')logGrid(a,r.grid);
  }
  else if(action==='grid-record') { if(r.grid.steps<2)return '先移动至少两步，再记录探索。';logGrid(a,r.grid); }
  else if(action==='checkpoint'||action==='profile') {
    if(action==='checkpoint')a.checkpoint=!a.checkpoint;
    else a.profile=a.profile==='commute'?'workbench':'commute';
    Object.assign(r,{progress:0,interrupted:false,interruptionAt:0});
  }
  else if(action==='step') { if(!r.interrupted)r.progress=Math.min(type==='adaptation'&&a.profile!=='commute'?8:4,r.progress+1); }
  else if(action==='route-reset')Object.assign(r,{progress:0,interrupted:false,interruptionAt:0});
  else if(action==='interrupt') { if(r.progress<2)return '先走至少两步，再模拟中断。';r.interrupted=true;r.interruptionAt=r.progress; }
  else if(action==='resume') {
    if(!r.interrupted)return true;
    const checkpoint=type==='adaptation'?a.profile==='commute':a.checkpoint===true;
    r.progress=interruptRoute(r.interruptionAt,checkpoint);r.interrupted=false;
    logRun(a,{kind:type,checkpoint,profile:a.profile||'workbench',before:r.interruptionAt,after:r.progress,summary:`${type==='adaptation'?(a.profile==='commute'?'通勤':'工作台'):checkpoint?'保留进度':'从头开始'}：中断前 ${r.interruptionAt} 步，恢复后 ${r.progress} 步。`});
  }
  else if(action==='venue') { if(value<0||value>8)return true;a.venue=value;a.visited=[...new Set([...(a.visited||[]),value])]; }
  else if(action==='card') {
    const cards=d.group==='essentials'?essenceCards:definitionCards,limit=d.group==='essentials'?3:5,item=cards[value];if(!item)return true;
    const selected=Array.isArray(a[d.group])?a[d.group]:[];
    if(selected.includes(item))a[d.group]=selected.filter(c=>c!==item);
    else if(selected.length<limit)a[d.group]=[...selected,item];
    else return `最多 ${limit} 张，请先移除一张。`;
  }
  else if(action==='order') { const selected=a[d.group],to=value+Number(d.direction);if(Array.isArray(selected)&&to>=0&&to<selected.length)[selected[value],selected[to]]=[selected[to],selected[value]]; }
  else return false;
  return true;
}
function logGrid(a,g) { logRun(a,{kind:'grid',config:g.config,steps:g.steps,collected:g.collected,outcome:g.outcome,moves:g.moves,summary:`${g.config.goal?'目标':'探索'} · ${g.config.key?'钥匙':'收集记录'} · ${g.config.budget} 步上限 · 障碍${g.config.obstacles?'开':'关'}：走 ${g.steps} 步，资源${g.collected?'已拿':'未拿'}，${g.outcome==='won'?'到达灯塔':g.outcome==='lost'?'步数用完':'记录探索'}。`}); }
export function labReady(u,a,note) {
  if(u.studio)return studioReady(u,a,note);
  if(!String(note||'').trim())return false;
  const type=u.activity.type,runs=Array.isArray(a.runs)?a.runs:[],text=k=>!!String(a[k]||'').trim();
  if(type==='pulse')return runs.some(r=>r.hits===5)&&text('feeling');
  if(type==='twoPass')return runs.some(r=>r.pass===1)&&runs.some(r=>r.pass===2&&r.peek)&&text('firstFeeling')&&text('secondFeeling');
  if(type==='spectator')return runs.some(r=>r.public===true)&&runs.some(r=>r.public===false);
  if(type==='perspective')return ['behavior','context','analogy','hypothesis'].every(text);
  if(type==='essence')return (a.essentials||[]).length>=2&&text('recipe');
  if(type==='forge')return (a.chain||[]).length>=3&&text('definition')&&text('counterexample');
  if(type==='venues')return (a.visited||[]).length>=2;
  if(type==='interruption'||type==='adaptation')return runs.some(r=>r.checkpoint===true)&&runs.some(r=>r.checkpoint===false);
  if(type==='toy')return runs.some(r=>r.config?.goal===false)&&runs.some(r=>r.config?.goal===true);
  if(type==='value')return runs.some(r=>r.config?.key===false)&&runs.some(r=>r.config?.key===true);
  if(type==='grid')return new Set(runs.map(r=>JSON.stringify(r.config))).size>=2;
  return false;
}
export function labSummary(u,a) {
  const output=[];
  for(const run of a.runs||[])output.push(run.summary);
  for(const name of ['behavior','context','analogy','hypothesis','recipe','definition','counterexample','feeling','firstFeeling','secondFeeling'])if(a[name])output.push(`${({behavior:'行为',context:'情境',analogy:'设计类比',hypothesis:'待确认的解释',recipe:'体验配方',definition:'我的定义',counterexample:'边界例子',feeling:'我的感受',firstFeeling:'第 1 轮感受',secondFeeling:'第 2 轮观察'})[name]}：${a[name]}`);
  if(a.essentials?.length)output.push('本质优先级：'+a.essentials.join(' → '));
  if(a.chain?.length)output.push('解释链：'+a.chain.join(' → '));
  if(a.visited?.length)output.push('已探索场景：'+a.visited.map(i=>venueCards[i]?.[0]).filter(Boolean).join('、'));
  return output.join('\n');
}
