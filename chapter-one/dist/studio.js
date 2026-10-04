// Local teaching models and editable artifacts. No player psychology is measured here.
const studioEsc = v => String(v ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const studioInt = (v, fallback, min, max) => Number.isFinite(Number(v)) ? Math.max(min,Math.min(max,Math.round(Number(v)))) : fallback;
const studioArray = v => Array.isArray(v) ? v : [];
export const STUDIO_REVISION = 3;
export function projectReady(plan, selected, rubric) {
  return !!String(plan || '').trim() && Array.isArray(rubric) && rubric.length>0 && rubric.every((_,i)=>studioArray(selected).includes(i));
}
export function probabilityModel(dice=1, threshold=4, prize=10, cost=4) {
  const d=studioInt(dice,1,1,2), counts=new Map();
  for(let x=1;x<=6;x++)for(let y=1;y<=(d===2?6:1);y++) {const value=d===2?(x+y)/2:x;counts.set(value,(counts.get(value)||0)+1);}
  const outcomes=[...counts].sort((a,b)=>a[0]-b[0]).map(([value,count])=>({value,p:count/(d===2?36:6)}));
  const mean=outcomes.reduce((s,o)=>s+o.value*o.p,0), variance=outcomes.reduce((s,o)=>s+(o.value-mean)**2*o.p,0);
  const win=outcomes.filter(o=>o.value>=threshold).reduce((s,o)=>s+o.p,0);
  return {outcomes,mean,variance,win,net:win*prize-cost};
}
export function economyModel({stock=100,income=20,sink=10,rounds=6,catchup=0}={}) {
  let a=studioInt(stock,100,0,1000),b=Math.round(a/2);const rows=[{turn:0,a,b,total:a+b}];
  for(let t=1;t<=studioInt(rounds,6,1,12);t++) {
    const bonus=studioInt(catchup,0,0,20), inc=studioInt(income,20,0,100),out=studioInt(sink,10,0,100);
    const nextA=Math.max(0,a+inc-out+(a<b?bonus:0)),nextB=Math.max(0,b+inc-out+(b<a?bonus:0));a=nextA;b=nextB;rows.push({turn:t,a,b,total:a+b});
  }return rows;
}
export function cashflowModel({price=20,customers=20,monthlyCost=200,upfront=1000,months=6}={}) {
  const revenue=price*customers,net=revenue-monthlyCost;return {revenue,net,values:Array.from({length:studioInt(months,6,1,12)+1},(_,i)=>-upfront+i*net)};
}
export function dominantRows(matrix) {
  return matrix.map((row,i)=>matrix.some((other,j)=>j!==i&&other.every((v,k)=>v>=row[k])&&other.some((v,k)=>v>row[k])));
}
export function toggleLights(board,index) {
  const out=studioArray(board).length===9?board.map(v=>v===1?1:0):Array(9).fill(0);
  if(!Number.isInteger(index)||index<0||index>8)return out;
  for(const j of [index,index%3>0?index-1:-1,index%3<2?index+1:-1,index-3,index+3])if(j>=0&&j<9)out[j]=1-out[j];return out;
}
export function solveLights(board) {
  for(let mask=0;mask<512;mask++){let b=board.slice(),moves=[];for(let i=0;i<9;i++)if(mask&(1<<i)){b=toggleLights(b,i);moves.push(i);}if(b.every(x=>x===0))return moves;}return null;
}
export function machineStep(current,event,table) {const next=table?.[current]?.[event];return Number.isInteger(next)&&next>=0&&next<3?next:current;}
const STUDIO_FORMS={builder:'设计作品编辑',graph:'关系图搭建',order:'结构排序',case:'约束与方案取舍',machine:'可运行状态机',probability:'概率分布与抽样',economy:'资源流动模拟',payoff:'策略收益表',puzzle:'可解谜题与提示',curve:'兴趣曲线编辑',interface:'可操作界面对照',map:'关卡编辑与寻路',palette:'色彩与视觉对照',memory:'注意力与回忆任务',cashflow:'收入与成本推算'};
function studioSpec(u){return u.studio;}
function readStudio(u,a) {
  const p=studioSpec(u),raw=a.studio&&typeof a.studio==='object'&&!Array.isArray(a.studio)?a.studio:{};
  const fields=(p.fields||[]).map((_,i)=>Array.isArray(raw.fields)&&typeof raw.fields[i]==='string'?raw.fields[i].slice(0,12000):'');
  const count=(p.cards||[]).length, order=[...new Set(studioArray(raw.order).filter(i=>Number.isInteger(i)&&i>=0&&i<count))];for(let i=0;i<count;i++)if(!order.includes(i))order.push(i);
  const edges=studioArray(raw.edges).filter(e=>e&&Number.isInteger(e.from)&&Number.isInteger(e.to)&&e.from>=0&&e.to>=0&&e.from<(p.nodes||[]).length&&e.to<(p.nodes||[]).length&&e.from!==e.to&&typeof e.label==='string').slice(0,12);
  const numbers={};for(const [k,v] of Object.entries(p.numbers||{}))numbers[k]=studioInt(raw.numbers?.[k],v.default,v.min,v.max);
  let board=studioArray(raw.board);if(board.length!==9)board=toggleLights(toggleLights(Array(9).fill(0),0),4);else board=board.map(v=>v===1?1:0);
  const table=Array.from({length:3},(_,i)=>Array.from({length:3},(_,j)=>studioInt(raw.table?.[i]?.[j],[[1,0,0],[2,0,1],[2,0,0]][i][j],0,2)));
  return {fields,order,edges,numbers,board,table,from:studioInt(raw.from,0,0,Math.max(0,(p.nodes||[]).length-1)),to:studioInt(raw.to,1,0,Math.max(0,(p.nodes||[]).length-1)),
    picks:[...new Set(studioArray(raw.picks).filter(i=>Number.isInteger(i)&&i>=0&&i<(p.actions||[]).length))],
    changed:raw.changed===true,moves:studioInt(raw.moves,0,0,1000),hints:studioInt(raw.hints,0,0,1000),state:studioInt(raw.state,0,0,2),
    trace:studioArray(raw.trace).filter(v=>typeof v==='string').slice(-30),mode:studioInt(raw.mode,0,0,2),hits:studioInt(raw.hits,0,0,1000),mistakes:studioInt(raw.mistakes,0,0,1000),
    position:studioInt(raw.position,0,0,24),path:studioArray(raw.path).filter(v=>Number.isInteger(v)&&v>=0&&v<25).slice(-100),
    walls:[...new Set(studioArray(raw.walls??p.walls??[7,12,17]).filter(v=>Number.isInteger(v)&&v>0&&v<24))],edit:raw.edit===true,
    samples:studioArray(raw.samples).filter(v=>Number.isFinite(v)&&v>=1&&v<=6).slice(-100),sampleConfig:typeof raw.sampleConfig==='string'?raw.sampleConfig:'',
    shown:raw.shown!==false, memorySeen:raw.memorySeen===true};
}
function studioButton(text,action,value='',extra='') {return `<button class="button secondary" data-lab="studio-${action}" data-value="${studioEsc(value)}" ${extra}>${studioEsc(text)}</button>`;}
function studioField(label,index,value) {return `<div class="lab-field"><label for="studio-f${index}">${studioEsc(label)}</label><textarea id="studio-f${index}" data-studio-field="f${index}">${studioEsc(value)}</textarea></div>`;}
function studioFields(p,s) {return (p.fields||[]).map((label,i)=>studioField(label,i,s.fields[i])).join('');}
function studioNumbers(p,s) {return Object.entries(p.numbers||{}).map(([k,v])=>`<label class="studio-number" for="studio-${k}">${studioEsc(v.label)}<input id="studio-${k}" type="number" min="${v.min}" max="${v.max}" step="1" value="${s.numbers[k]}" data-studio-field="n:${k}"></label>`).join('');}
function studioSvgLine(values,labels,title,max=0) {
  const top=Math.max(max,...values,1),points=values.map((v,i)=>`${30+i*320/Math.max(1,values.length-1)},${145-v/top*115}`);
  return `<svg class="studio-chart" viewBox="0 0 380 185" role="img" aria-label="${studioEsc(title)}"><title>${studioEsc(title)}</title><path d="M30 25V145H350" fill="none" stroke="#9ab2c5"/><polyline points="${points.join(' ')}" fill="none" stroke="#db7036" stroke-width="3"/>${points.map((pt,i)=>{const[x,y]=pt.split(',');return `<circle cx="${x}" cy="${y}" r="4" fill="#db7036"/><text x="${x}" y="${+y-9}" text-anchor="middle">${studioEsc(Math.round(values[i]*100)/100)}</text><text x="${x}" y="165" text-anchor="middle">${studioEsc(labels[i])}</text>`;}).join('')}</svg>`;
}
function studioGraph(p,s) {
  const nodes=p.nodes||[],pos=nodes.map((_,i)=>[75+(i%3)*130,40+Math.floor(i/3)*85]);
  return `<svg class="studio-chart" viewBox="0 0 420 ${Math.max(180,Math.ceil(nodes.length/3)*85)}" role="img" aria-label="自己搭建的关系图"><title>自己搭建的关系图，文字列表也提供所有连线</title>${s.edges.map(e=>`<path d="M${pos[e.from]} L${pos[e.to]}" stroke="#db7036" stroke-width="2"/>`).join('')}${nodes.map((n,i)=>`<rect x="${pos[i][0]-55}" y="${pos[i][1]-18}" width="110" height="36" rx="8" fill="#e8eef2"/><text x="${pos[i][0]}" y="${pos[i][1]+5}" text-anchor="middle">${studioEsc(n)}</text>`).join('')}</svg>`;
}
function studioSelect(name,label,options,value) {const id="studio-select-"+name.replaceAll(":","-");return `<div class="studio-select"><label for="${id}">${studioEsc(label)}</label><select id="${id}" data-studio-field="${name}">${options.map((o,i)=>`<option value="${i}" ${i===value?'selected':''}>${studioEsc(o)}</option>`).join('')}</select></div>`;}
export function renderStudio(u,a) {
  const p=studioSpec(u),s=readStudio(u,a),kind=p.kind;let body='';
  if(kind==='builder')body=`<div class="studio-form">${studioFields(p,s)}</div><div class="studio-artifact"><span class="eyebrow">我的设计草稿</span>${(p.fields||[]).map((label,i)=>`<section><strong>${studioEsc(label)}</strong><p>${studioEsc(s.fields[i]||'在左侧填写后生成这一部分。')}</p></section>`).join('')}</div>`;
  if(kind==='graph')body=studioGraph(p,s)+`<div class="studio-tools">${studioSelect('from','起点',p.nodes,s.from)}${studioSelect('to','终点',p.nodes,s.to)}</div>${studioFields(p,s)}${studioButton('添加这条关系','edge')}<ol>${s.edges.map((e,i)=>`<li>${studioEsc(p.nodes[e.from])} → ${studioEsc(p.nodes[e.to])}：${studioEsc(e.label)} ${studioButton('移除','remove-edge',i)}</li>`).join('')}</ol>`;
  if(kind==='order')body=`<ol class="studio-sequence">${s.order.map((idx,i)=>`<li><span class="large-index">${i+1}</span><strong>${studioEsc(p.cards[idx])}</strong><div>${studioButton('上移','up',i,i===0?'disabled':'')}${studioButton('下移','down',i,i===s.order.length-1?'disabled':'')}</div></li>`).join('')}</ol>${studioFields(p,s)}`;
  if(kind==='case'){const spent=s.picks.reduce((v,i)=>v+p.actions[i].cost,0);body=`<div class="feedback">${studioEsc(p.scenario)}<br>可用预算 ${p.budget} · 已使用 ${spent} · 剩余 ${p.budget-spent}</div><div class="studio-cases">${p.actions.map((c,i)=>`<button class="studio-case ${s.picks.includes(i)?'selected':''}" data-lab="studio-pick" data-value="${i}" aria-pressed="${s.picks.includes(i)}"><strong>${studioEsc(c.title)} · 成本 ${c.cost}</strong><span>${studioEsc(c.consequence)}</span></button>`).join('')}</div><p class="tiny">后果文字是教学案例的推演提示；预算是真实计算，不预测玩家反应。</p>${studioFields(p,s)}`;}
  if(kind==='machine'){const states=['巡逻','警戒','追击'],events=['看见目标','目标消失','计时到期'];body=`<div class="feedback" role="status">当前状态：${states[s.state]}</div><table class="studio-table"><caption>编辑事件对应的目标状态，下一次事件立即使用新规则</caption><thead><tr><th>当前状态</th>${events.map(e=>`<th>${e}</th>`).join('')}</tr></thead><tbody>${states.map((st,i)=>`<tr><th>${st}</th>${events.map((_,j)=>`<td>${studioSelect('t:'+i+':'+j,st+'遇到'+events[j],states,s.table[i][j])}</td>`).join('')}</tr>`).join('')}</tbody></table><div class="studio-flow">${states.map((st,i)=>`<span class="${s.state===i?'active':''}">${st}</span>`).join(' → ')}</div><div class="lab-controls">${events.map((e,i)=>studioButton(e,'event',i)).join('')}${studioButton('重新从巡逻开始','restart')}</div><ol>${s.trace.map(t=>`<li>${studioEsc(t)}</li>`).join('')}</ol>`;}
  if(kind==='probability'){const m=probabilityModel(s.numbers.dice,s.numbers.threshold,s.numbers.prize,s.numbers.cost);body=`<div class="studio-tools">${studioNumbers(p,s)}</div>${studioSvgLine(m.outcomes.map(o=>o.p*100),m.outcomes.map(o=>o.value),'理论分布：纵轴为每个结果的概率百分比')}<p>骰面均值 ${m.mean.toFixed(2)} · 方差 ${m.variance.toFixed(2)} · 达标概率 ${(m.win*100).toFixed(1)}%<br>每轮期望净收益 = 达标概率 × 奖励 − 成本 = ${m.net.toFixed(2)}</p>${studioButton('掷骰 20 次','sample')}<p role="status">已抽样 ${s.samples.length} 次${s.samples.length?'，实际骰面均值 '+(s.samples.reduce((x,y)=>x+y,0)/s.samples.length).toFixed(2):''}。</p><p class="tiny">双骰采用两颗独立六面骰的平均值。样本会波动，理论值不保证每轮结果。</p>`;}
  if(kind==='economy'){const rows=economyModel(s.numbers);body=`<div class="studio-tools">${studioNumbers(p,s)}</div>${studioSvgLine(rows.map(r=>r.total),rows.map(r=>r.turn),'资源总量随回合变化')}<table class="studio-table"><caption>模型：两人初始资源为输入值及其一半；每回合各增加产出、扣除消耗，下限为零。回合开始时落后者获得补偿。</caption><tr><th>回合</th><th>甲</th><th>乙</th><th>合计</th></tr>${rows.map(r=>`<tr><td>${r.turn}</td><td>${r.a}</td><td>${r.b}</td><td>${r.total}</td></tr>`).join('')}</table><p class="tiny">单位是资源枚数。此简化模型没有交易与价格，不能据此预测实际通胀或留存。</p>`;}
  if(kind==='payoff'){const b=s.numbers.bonus,matrix=[[2,2,2],[5,-1,1],[1,5,-1]].map((r,i)=>r.map(v=>v+(i===0?b:0))),dom=dominantRows(matrix);body=`<div class="studio-tools">${studioNumbers(p,s)}</div><table class="studio-table"><caption>列是三种环境；格内为每次行动的固定收益。加成仅作用于保守策略。</caption><tr><th>策略</th><th>环境甲</th><th>环境乙</th><th>环境丙</th></tr>${matrix.map((r,i)=>`<tr><th>${['保守','突击','绕行'][i]}</th>${r.map(v=>`<td>${v}</td>`).join('')}</tr>`).join('')}</table><p>${dom.some(Boolean)?'被其他策略支配：'+dom.map((v,i)=>v?['保守','突击','绕行'][i]:'').filter(Boolean).join('、'):'没有发现被支配的行：选择仍需依赖环境。'}</p><p class="tiny">这里比较逐列“不更差且至少一列更好”；不是对所有真实战术的证明。</p>`;}
  if(kind==='puzzle')body=`<p>目标：熄灭九盏灯。点击一格，会翻转自己及上下左右的灯；不能翻转斜角。</p><div class="studio-lights">${s.board.map((v,i)=>`<button class="${v?'lit':''}" data-lab="studio-light" data-value="${i}" aria-label="第 ${i+1} 格，${v?'亮':'灭'}">${v?'●':'○'}</button>`).join('')}</div><p role="status">${s.board.every(v=>!v)?'全部熄灭，谜题已解开。':'还有 '+s.board.filter(Boolean).length+' 盏灯亮着。'} 操作 ${s.moves} 次 · 提示 ${s.hints} 次</p>${studioButton('给一个可执行提示','hint')}${studioButton('重开谜题','restart')}${s.trace.length?`<p class="feedback">${studioEsc(s.trace.at(-1))}</p>`:''}`;
  if(kind==='curve')body=`${studioSvgLine(Object.values(s.numbers),Object.keys(p.numbers).map(k=>p.numbers[k].label),'自己设定的兴趣曲线，纵轴 0—10',10)}<div class="studio-tools">${studioNumbers(p,s)}</div><p class="tiny">这些值由你设定，表示设计假设或自己的回忆，不是测得的玩家兴趣。</p>${studioFields(p,s)}`;
  if(kind==='cashflow'){const {revenue,net,values}=cashflowModel(s.numbers);body=`<div class="studio-tools">${studioNumbers(p,s)}</div><table class="studio-table"><caption>模型：每月人数与价格固定；现金变化 = −一次性成本 + 月数 ×（单份收入 × 每月人数 − 每月成本）。</caption><tr><th>每月收入</th><th>每月净额</th><th>期末累计净额</th></tr><tr><td>${revenue}</td><td>${net}</td><td>${values.at(-1)}</td></tr></table><p>各月累计净额：${values.join(' → ')}</p><p class="tiny">金额以同一种自定货币计。没有预测销量，未含抽成、税费和退款。</p>`;}
  if(kind==='interface'){const target=s.hits%3,labels=s.mode===0?['操作一','操作二','操作三']:['向左','向上','向右'];body=`<div class="lab-controls">${studioButton('无映射提示','mode',0)}${studioButton('明确映射与反馈','mode',1)}${studioButton('交换左右的模式','mode',2)}</div><div class="studio-target ${s.mode>0&&s.hits?'studio-flash':''}">目标动作：${['向左','向上','向右'][target]}<br>${s.mode>0?`已达成 ${s.hits} 次 · 点错 ${s.mistakes} 次`:'按三次正确动作后再比较反馈。'}</div><div class="lab-controls">${labels.map((v,i)=>studioButton(v,'tap',i)).join('')}${studioButton('播放一次反馈音','sound')}</div><p class="tiny">明确映射模式显示动作名称、计数与动画；交换模式将左右含义反转。反馈音只在点击时播放，可随时停止操作。</p>`;}
  if(kind==='map')body=`<div class="lab-controls">${studioButton(s.edit?'完成编辑，开始行走':'编辑障碍格','edit')}${studioButton(s.mode?'隐藏引导路线':'显示引导路线','mode',s.mode?0:1)}${studioButton('回到入口','restart')}</div><div class="studio-map">${Array.from({length:25},(_,i)=>`<button data-lab="studio-wall" data-value="${i}" aria-label="格 ${i+1}${s.walls.includes(i)?'，障碍':''}" ${!s.edit?'disabled':''} class="${s.walls.includes(i)?'wall':''} ${s.mode&&[0,5,10,15,20,21,22,23,24].includes(i)?'guided':''}">${s.position===i?'人':i===24?'门':s.walls.includes(i)?'■':i===20?'灯':'·'}</button>`).join('')}</div><div class="lab-controls">${['上','左','下','右'].map((v,i)=>studioButton(v,'walk',i)).join('')}</div><p role="status">已走 ${s.path.length} 步 · ${s.position===24?'已到达出口':'当前位于格 '+(s.position+1)}</p><p class="tiny">入口为左上、出口为右下；灯是地标。着色路线只提供视觉线索，不改变移动规则；改障碍后请检查是否仍能到达。</p>`;
  if(kind==='palette'){const colors=[['#e8d5b5','#33483c','#d26d36'],['#152b42','#b7d4e5','#ffb85e'],['#efe9e1','#817b77','#787773']][s.mode];body=`<div class="lab-controls">${['暖色森林','冷色港湾','接近的灰调'].map((v,i)=>studioButton(v,'mode',i)).join('')}</div><svg class="studio-scene" viewBox="0 0 400 180" role="img" aria-label="可切换配色的关卡场景"><rect width="400" height="180" fill="${colors[0]}"/><path d="M0 170L70 70L130 130L230 40L400 170Z" fill="${colors[1]}"/><circle cx="300" cy="95" r="22" fill="${colors[2]}"/><text x="300" y="140" text-anchor="middle" fill="${colors[2]}">目标</text></svg><p>背景 ${colors[0]} · 环境 ${colors[1]} · 目标 ${colors[2]}</p><p class="tiny">颜色实际改变场景。请自己比较目标是否清晰、感受怎样变化，不推断所有玩家的情绪。</p>${studioFields(p,s)}`;}
  if(kind==='memory')body=`<div class="lab-controls">${studioButton('三项任务','mode',0)}${studioButton('六项任务','mode',1)}${studioButton(s.shown?'隐藏并回忆':'重新观察','hide')}</div><div class="studio-flow">${s.shown?(s.mode?['钥匙','桥','月亮','门','钟','树']:['钥匙','桥','门']).map(v=>`<span>${v}</span>`).join(''):'线索已隐藏。按原顺序写下刚才看到的物件。'}</div>${studioFields(p,s)}${studioButton('对照本轮线索','memory-check')}${s.trace.length?`<p role="status">${studioEsc(s.trace.at(-1))}</p>`:''}<p class="tiny">两轮熟悉程度不同；此任务只记录自己的回忆，不测量一般记忆容量。</p>`;
  const logs=studioArray(a.runs).filter(r=>r&&typeof r.summary==='string');
  return `<section class="activity studio-activity"><span class="eyebrow">动手理解 · ${STUDIO_FORMS[kind]}</span><h3>${studioEsc(p.title||u.nav)}</h3><p>${studioEsc(p.instruction)}</p><div class="studio-body ${kind==='builder'?'studio-two-col':''}">${body}</div><div class="studio-footer">${studioButton('保存这份实验或作品','record')}<p>操作条件只检查记录过程；解释与设计质量由你自评。${p.minRuns===2?'本节需要保存两种不同条件，当前 '+studioRecordCount(u,a)+' / 2。':''}</p></div>${logs.length?`<details class="studio-log" open><summary>已保存的尝试（保留旧版记录）</summary>${logs.slice(-4).map(r=>`<pre>${studioEsc(r.summary)}</pre>`).join('')}</details>`:''}</section>`;
}
export function studioInput(u,a,key,value) {
  if(!u.studio)return false;const p=u.studio,s=readStudio(u,a);
  if(/^f\d+$/.test(key)&&+key.slice(1)<s.fields.length)s.fields[+key.slice(1)]=String(value).slice(0,12000);
  else if(key.startsWith('n:')&&p.numbers?.[key.slice(2)]){const k=key.slice(2),c=p.numbers[k];s.numbers[k]=studioInt(value,c.default,c.min,c.max);s.changed=true;s.samples=[];}
  else if(key==='from'||key==='to')s[key]=studioInt(value,0,0,p.nodes.length-1);
  else if(/^t:[0-2]:[0-2]$/.test(key)){const[,i,j]=key.split(':');s.table[+i][+j]=studioInt(value,0,0,2);s.changed=true;}
  else return false;a.studio=s;return true;
}
function studioEvidence(p,s){
  if((p.fields||[]).some((_,i)=>!s.fields[i].trim()))return false;
  if(p.kind==='builder')return s.fields.length>=2;
  if(p.kind==='graph')return s.edges.length>=2;
  if(p.kind==='order')return s.changed;
  if(p.kind==='case')return s.picks.length>0;
  if(p.kind==='machine')return s.trace.length>=3;
  if(p.kind==='probability')return s.samples.length>=20;
  if(['economy','payoff','curve','cashflow'].includes(p.kind))return s.changed;
  if(p.kind==='puzzle')return s.moves>0&&s.board.every(v=>!v);
  if(p.kind==='interface')return s.hits>=3;
  if(p.kind==='map')return s.position===24&&s.path.length>0;
  if(p.kind==='palette')return s.changed;
  if(p.kind==='memory')return s.memorySeen&&s.trace.length>0;
  return false;
}
function studioSnapshot(u,s){
  const p=u.studio,lines=[p.title||u.nav],config={kind:p.kind,fields:s.fields};
  s.fields.forEach((v,i)=>lines.push(p.fields[i]+'：'+v));
  if(p.kind==='graph'){config.edges=s.edges;lines.push(...s.edges.map(e=>`${p.nodes[e.from]} → ${p.nodes[e.to]}：${e.label}`));}
  if(p.kind==='order'){config.order=s.order;lines.push('顺序：'+s.order.map(i=>p.cards[i]).join(' → '));}
  if(p.kind==='case'){config.picks=s.picks;lines.push('方案：'+s.picks.map(i=>p.actions[i].title).join('、'),'预算使用：'+s.picks.reduce((v,i)=>v+p.actions[i].cost,0)+' / '+p.budget);}
  if(p.numbers){config.numbers=s.numbers;lines.push(...Object.entries(s.numbers).map(([k,v])=>p.numbers[k].label+'：'+v));}
  if(p.kind==='probability'){const m=probabilityModel(s.numbers.dice,s.numbers.threshold,s.numbers.prize,s.numbers.cost);lines.push(`理论均值 ${m.mean.toFixed(2)}，方差 ${m.variance.toFixed(2)}，每轮期望净收益 ${m.net.toFixed(2)}；抽样 ${s.samples.length} 次，样本均值 ${(s.samples.reduce((a,b)=>a+b,0)/s.samples.length).toFixed(2)}`);config.samples=s.samples;}
  if(p.kind==='economy'){const rows=economyModel(s.numbers);lines.push('资源轨迹：'+rows.map(r=>`${r.turn}回合=${r.total}`).join(' → '));}
  if(p.kind==='cashflow'){const v=s.numbers;lines.push(`每月收入 ${v.price*v.customers}，每月净额 ${v.price*v.customers-v.monthlyCost}，期末累计净额 ${-v.upfront+v.months*(v.price*v.customers-v.monthlyCost)}`);}
  if(p.kind==='machine'){config.table=s.table;config.trace=s.trace;lines.push(...s.trace);}
  if(p.kind==='payoff'){const matrix=[[2,2,2],[5,-1,1],[1,5,-1]].map((r,i)=>r.map(v=>v+(i===0?s.numbers.bonus:0))),dom=dominantRows(matrix);lines.push('收益表：'+matrix.map(r=>r.join('/')).join('；'),'被支配的行：'+(dom.map((v,i)=>v?['保守','突击','绕行'][i]:'').filter(Boolean).join('、')||'无'));config.matrix=matrix;}
  if(p.kind==='puzzle'){config.moves=s.moves;config.hints=s.hints;lines.push(`已熄灭所有灯；操作 ${s.moves} 次，提示 ${s.hints} 次。`);}
  if(p.kind==='map'){config.walls=s.walls;config.mode=s.mode;config.path=s.path;lines.push(`入口到出口路径：${[0,...s.path].map(i=>i+1).join(' → ')}；障碍格：${s.walls.map(i=>i+1).join('、')}；引导${s.mode?'开':'关'}`);}
  if(p.kind==='interface'){config.mode=s.mode;config.hits=s.hits;config.mistakes=s.mistakes;lines.push(`映射模式 ${['无提示','明确映射','交换左右'][s.mode]}；正确 ${s.hits}，错误 ${s.mistakes}`);}
  if(p.kind==='palette'){config.mode=s.mode;lines.push('配色：'+['暖色森林','冷色港湾','接近的灰调'][s.mode]);}
  if(p.kind==='memory'){config.mode=s.mode;config.trace=s.trace;lines.push(...s.trace);}
  return {signature:JSON.stringify(config),condition:JSON.stringify({numbers:config.numbers,mode:config.mode,walls:config.walls}),summary:lines.join('\n'),snapshot:config};
}
export function handleStudio(u,a,d) {
  const p=u.studio,s=readStudio(u,a),action=d.lab.slice(7),idx=studioInt(d.value,-1,-1,1000);let message=true;
  if(action==='edge'){if(s.from===s.to)return '请选择两个不同的节点。';if(!s.fields[0]?.trim())return '先解释这条关系，再添加连线。';if(s.edges.some(e=>e.from===s.from&&e.to===s.to))return '这条连线已存在，可以先移除再重建。';if(s.edges.length>=12)return '最多保留 12 条关系。';s.edges.push({from:s.from,to:s.to,label:s.fields[0].trim()});}
  else if(action==='remove-edge'){if(idx<0||idx>=s.edges.length)return false;s.edges.splice(idx,1);}
  else if(action==='up'||action==='down'){const j=idx+(action==='up'?-1:1);if(idx>=0&&idx<s.order.length&&j>=0&&j<s.order.length){[s.order[idx],s.order[j]]=[s.order[j],s.order[idx]];s.changed=true;}}
  else if(action==='pick'){if(!p.actions?.[idx])return false;if(s.picks.includes(idx))s.picks=s.picks.filter(i=>i!==idx);else if(s.picks.reduce((v,i)=>v+p.actions[i].cost,0)+p.actions[idx].cost<=p.budget)s.picks.push(idx);else return '预算不足。先取消一个方案，再选择新方案。';}
  else if(action==='event'){if(idx<0||idx>2)return false;const before=s.state;s.state=machineStep(s.state,idx,s.table);s.trace.push(`${['巡逻','警戒','追击'][before]} —${['看见目标','目标消失','计时到期'][idx]}→ ${['巡逻','警戒','追击'][s.state]}`);s.trace=s.trace.slice(-30);}
  else if(action==='light'){if(idx<0||idx>8)return false;s.board=toggleLights(s.board,idx);s.moves++;s.trace=[];}
  else if(action==='hint'){const solution=solveLights(s.board);s.trace=[solution?.length?'可以先点击第 '+(solution[0]+1)+' 格，再观察哪些灯改变。':'目前已解开。'];s.hints++;}
  else if(action==='sample'){const count=s.numbers.dice===2?2:1;for(let i=0;i<20;i++){const x=1+Math.floor(Math.random()*6),y=count===2?1+Math.floor(Math.random()*6):0;s.samples.push(count===2?(x+y)/2:x);}s.samples=s.samples.slice(-100);}
  else if(action==='mode'){s.mode=Math.max(0,Math.min(2,idx));s.changed=true;s.hits=0;s.mistakes=0;s.shown=true;s.memorySeen=false;s.trace=[];s.position=0;s.path=[];}
  else if(action==='tap'){if(idx<0||idx>2)return false;const mapped=s.mode===2?2-idx:idx;if(mapped===s.hits%3)s.hits++;else s.mistakes++;}
  else if(action==='sound'){message='反馈音由浏览器在本次点击后播放。';}
  else if(action==='edit'){s.edit=!s.edit;s.position=0;s.path=[];}
  else if(action==='wall'){if(s.edit&&idx>0&&idx<24){s.walls=s.walls.includes(idx)?s.walls.filter(i=>i!==idx):[...s.walls,idx];s.changed=true;}}
  else if(action==='walk'){if(s.edit)return '先结束编辑，再行走。';const offsets=[-5,-1,5,1],next=s.position+offsets[idx];if(!Number.isInteger(next)||next<0||next>=25||(idx===1&&s.position%5===0)||(idx===3&&s.position%5===4)||s.walls.includes(next))return '这里不能通行，位置没有变化。';s.position=next;s.path.push(next);s.path=s.path.slice(-100);}
  else if(action==='hide'){s.shown=!s.shown;if(!s.shown)s.memorySeen=true;}
  else if(action==='memory-check'){if(s.shown)return '先隐藏线索并写下回忆，再对照。';if(!s.fields[0]?.trim())return '先写下你回忆到的物件。';s.trace=['本轮线索：'+(s.mode?['钥匙','桥','月亮','门','钟','树']:['钥匙','桥','门']).join(' → ')+'；我的回忆：'+s.fields[0]];}
  else if(action==='restart'){s.state=0;s.trace=[];s.position=0;s.path=[];s.hits=0;s.mistakes=0;s.moves=0;s.hints=0;s.board=toggleLights(toggleLights(Array(9).fill(0),0),4);}
  else if(action==='record'){
    if(!studioEvidence(p,s))return '请先完成本节操作条件，并填写作品中的说明。';const snap=studioSnapshot(u,s);
    if(studioArray(a.runs).some(r=>r?.revision===STUDIO_REVISION&&r.signature===snap.signature))return '这份设置与结果已经记录。请修改作品或尝试不同条件。';
    a.runs=[...studioArray(a.runs),{kind:'studio',engine:p.kind,revision:STUDIO_REVISION,...snap,at:new Date().toISOString()}].slice(-20);message='已保存实际操作与作品，解释仍由你自评。';
  }else return false;a.studio=s;return message;
}
function studioRecordCount(u,a) {const runs=studioArray(a.runs).filter(r=>r?.kind==='studio'&&r.revision===STUDIO_REVISION&&r.engine===u.studio.kind);if(u.studio.minRuns!==2)return runs.length;const conditions=new Set(runs.map(r=>r.condition).filter(v=>typeof v==='string')).size;return u.studio.distinctPath?Math.min(conditions,new Set(runs.filter(r=>Array.isArray(r.snapshot?.path)).map(r=>JSON.stringify(r.snapshot.path))).size):conditions;}
export function studioReady(u,a,note) {return !!String(note||'').trim()&&studioRecordCount(u,a)>=(u.studio.minRuns||1);}
export async function playStudioSound() {
  try {const C=window.AudioContext||window.webkitAudioContext;if(!C)return false;const ctx=new C();await ctx.resume();const osc=ctx.createOscillator(),gain=ctx.createGain();osc.frequency.value=520;gain.gain.setValueAtTime(.035,ctx.currentTime);gain.gain.exponentialRampToValueAtTime(.001,ctx.currentTime+.15);osc.connect(gain);gain.connect(ctx.destination);osc.start();osc.stop(ctx.currentTime+.16);osc.onended=()=>ctx.close();return true;}catch{return false;}
}
