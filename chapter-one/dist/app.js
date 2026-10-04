import { skills, listeners, observations, challengeQuestions } from './content.js';
import { initialState, restoreState, STORAGE_KEY, gradeQuestions, nextReviewDate, recordReview } from './core.js';
import { chapterCatalog, chapterLibrary } from './chapters.js';
import { WORKBOOK_KEY, restoreWorkbook, importWorkbook } from './workbook.js';
import { renderLab, handleLab, labReady, labSummary, resetLabRuntime } from './labs.js';
import { projectReady, studioInput, playStudioSound } from './studio.js';
let workbook, state, book, units, storageAvailable = true, catalogOpen = false;
try { workbook = restoreWorkbook(localStorage.getItem(WORKBOOK_KEY), localStorage.getItem(STORAGE_KEY)); } catch { workbook = restoreWorkbook(null); storageAvailable = false; }
function selectChapter(id) {
  if (!chapterLibrary[id]) return false;
  workbook.currentChapter = id;
  workbook.chapters[id] ||= initialState();
  state = workbook.chapters[id]; book = chapterLibrary[id].book; units = chapterLibrary[id].units;
  return true;
}
selectChapter(chapterLibrary[workbook.currentChapter] ? workbook.currentChapter : 1);
const app = document.querySelector('#app');
const esc = text => String(text ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
let listeningTab = 'team', toastTimer;
const revealed = new Set();
function toast(message) { const el = document.querySelector('#toast'); el.textContent = message; el.classList.add('visible'); clearTimeout(toastTimer); toastTimer = setTimeout(() => el.classList.remove('visible'), 3200); }
function status() { const el = document.querySelector('.save-status'); if (el) { el.textContent = storageAvailable ? '学习记录保存在此浏览器' : '保存失败 · 请导出笔记备份'; el.classList.toggle('error', !storageAvailable); } }
function save() { state.updatedAt = new Date().toISOString(); try { localStorage.setItem(WORKBOOK_KEY, JSON.stringify(workbook)); storageAvailable = true; } catch { if (storageAvailable) toast('此浏览器暂时无法保存进度，请尽快导出备份'); storageAvailable = false; } status(); }
function navigate(view, unit = state.unit) { catalogOpen = false; state.view = view; state.unit = unit; save(); render(false); document.querySelector('#main').focus({ preventScroll: true }); }
function refresh(selector) { render(); document.querySelector(selector)?.focus({ preventScroll: true }); }
function activityState(unit) { if (!state.activities[unit.id] || typeof state.activities[unit.id] !== 'object') state.activities[unit.id] = {}; return state.activities[unit.id]; }
function ready(index) {
  const u = units[index], a = activityState(u);
  if (book.number > 1) return labReady(u, a, state.notes[u.id]);
  if (state.answers[u.question.id] !== u.question.correct) return false;
  if (index === 0) return Number.isInteger(a.decision);
  if (index === 1) return Array.isArray(a.skills) && a.skills.length > 0 && String(a.use || '').trim().length > 0;
  if (index === 2) return a.checked && observations.every(o => a.matches?.[o.id] === o.target);
  return [0, 1, 2].every(i => String(a.plan?.[i] || '').trim().length > 0);
}
function updateFinish() { const b = document.querySelector('[data-complete]'); if (b) b.disabled = !ready(state.unit) && !state.completed.includes(state.unit); }
function dueCount() { return state.completed.filter(i => { const due = nextReviewDate(state.completedAt[i], state.review[i]); return due && new Date(due) <= new Date(); }).length; }
const art = `<svg class="identity-art" viewBox="0 0 180 130" fill="none" aria-hidden="true"><path d="M16 110h150" stroke="#9ab7cb" stroke-dasharray="3 5"/><rect x="67" y="34" width="86" height="66" rx="7" fill="#fff" stroke="#91aec3"/><path d="M79 49h31m-31 10h56m-56 10h42m-42 10h25" stroke="#bad0df" stroke-width="3"/><rect x="26" y="55" width="60" height="52" rx="6" fill="#142e43"/><circle cx="43" cy="74" r="5" fill="#91b5ce"/><path d="M49 92h18m-9-9v18" stroke="#fff" stroke-width="3" stroke-linecap="round"/><circle cx="129" cy="81" r="24" fill="#e87b42"/><path d="m120 80 7 7 13-16" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="m32 24 7 11m10-18 2 13m-35 8 13 5" stroke="#e87b42" stroke-width="2" stroke-linecap="round"/></svg>`;
function render(preserveScroll = true) {
  const y = preserveScroll ? window.scrollY : 0, v = state.view, n = state.completed.length;
  const tabs = [['challenge', book.number===1?'章节挑战':'章节作品'], ['review', '复习卡片'], ['notes', '学习笔记']];
  app.innerHTML = `<div class="shell"><aside class="sidebar"><div class="brand"><a href="bookshelf.html" class="brand-link" title="返回我的书架"><span class="brand-mark">▥</span>书中练习室</a></div><div class="edition"><span class="eyebrow">YOUR LEARNING BOOK</span><div class="book-title">${book.title}</div><span class="tiny">${book.edition} · ${book.author}</span></div><div class="chapter-picker"><label for="chapter-select">学习章节</label><select id="chapter-select">${Object.values(chapterLibrary).map(c=>`<option value="${c.book.number}" ${c.book.number===book.number?'selected':''}>第 ${c.book.number} 章 · ${c.book.chapter}</option>`).join('')}</select><button data-catalog class="catalog-button">全书目录 · ${Object.keys(chapterLibrary).length} / ${chapterCatalog.length} 章可学 ↗</button></div><span class="eyebrow">CHAPTER ${String(book.number).padStart(2,'0')}</span><div class="chapter-name">${book.chapter}</div><ol class="unit-list">${units.map((u,i)=>`<li><button class="nav-unit ${!catalogOpen&&v==='lesson'&&i===state.unit?'active':''} ${state.completed.includes(i)?'done':''}" data-unit="${i}" ${!catalogOpen&&v==='lesson'&&i===state.unit?'aria-current="step"':''}><span class="nav-number">${state.completed.includes(i)?'✓':String(i+1).padStart(2,'0')}</span>${esc(u.nav)}</button></li>`).join('')}</ol><div class="sidebar-separator"></div>${tabs.map(([id,title])=>`<button class="nav-secondary ${!catalogOpen&&v===id?'active':''}" data-view="${id}">${title}${id==='review'?`<span class="nav-count">${dueCount()} 待复习</span>`:''}</button>`).join('')}<div class="mobile-tabs">${tabs.map(([id,title])=>`<button class="${!catalogOpen&&v===id?'active':''}" data-view="${id}">${title}</button>`).join('')}</div><div class="sidebar-foot"><strong>读一段，试一试。</strong><br>把概念变成自己的经验。<br>原书第 ${book.printedPages} 页 · 本地学习</div></aside><div class="workspace"><header class="topbar"><div class="breadcrumb"><a href="bookshelf.html" class="nav-shelf-back">‹ 我的书架</a> <span>/</span> ${book.title} <span>/</span> <strong>第 ${book.number} 章</strong></div><div class="save-status"></div></header><main class="main" id="main" tabindex="-1">${catalogOpen?catalogView():`<div class="chapter-strip"><div><span class="eyebrow">第 ${book.number} 章 · ${book.chapter}</span><p>${units.length} 个学习单元 · ${book.number===1?'按自己的节奏阅读':'先动手体验，再回到概念'}</p></div><div class="chapter-progress"><span>${n} / ${units.length} 已练习</span><div class="progress-track"><div class="progress-fill" style="width:${n/units.length*100}%"></div></div></div></div>${v==='lesson'?lessonView(units[state.unit]):v==='challenge'?challengeView():v==='review'?reviewView():notesView()}`}</main></div></div>`;
  status(); window.scrollTo({ top:y, behavior:'instant' });
}
function catalogView() {
  return `<div class="page-title entry"><span class="eyebrow">THE WHOLE JOURNEY</span><h1>一本书，34 个设计视角。</h1><p>已制作 ${Object.keys(chapterLibrary).length} 章，共 ${Object.values(chapterLibrary).flatMap(c=>c.units).length} 个学习单元。后续章节尚未制作；已有记录按章节分别保存。</p></div><div class="catalog-grid">${chapterCatalog.map(c=>`<button class="catalog-card ${chapterLibrary[c.id]?'available':''}" data-chapter="${c.id}" ${!chapterLibrary[c.id]?'disabled':''}><span class="catalog-number">${String(c.id).padStart(2,'0')}</span><span><strong>${c.title}</strong><small>${chapterLibrary[c.id]?`${workbook.chapters[c.id]?.completed?.length||0} / ${chapterLibrary[c.id].units.length} 已练习 · 可进入`:'待制作'}</small></span>${chapterLibrary[c.id]?'<span>↗</span>':''}</button>`).join('')}</div>`;
}
function newLessonView(u) {
  const i=state.unit, done=state.completed.includes(i), a=activityState(u);
  return `<div class="learning-grid lab-grid entry"><article class="lesson-paper"><div class="lesson-intro"><div class="unit-meta"><span class="unit-tag">UNIT ${String(i+1).padStart(2,'0')} / ${String(units.length).padStart(2,'0')}</span><span>约 ${u.minutes} 分钟</span><span>原书：${esc(u.section)}</span></div><h1>${esc(u.title)}</h1><p class="lead">${esc(u.lead)}</p></div><div class="lesson-body">${u.revision===3&&(state.completed.includes(i)||state.notes[u.id])&&!(a.runs||[]).some(r=>r.revision===3)?'<p class="feedback">本节已更新。此前的笔记、复习日期和完成记录均已保留；建议重做新版操作，旧完成记录不代表新版练习已完成。</p>':''}${renderLab(u,a)}<details class="concept-reading" open><summary>回到书里的概念 <span>讲解与原书依据</span></summary><div class="idea-box"><p>${esc(u.idea)}</p></div><div class="reading-copy">${u.paragraphs.map(p=>`<p>${esc(p)}</p>`).join('')}</div><div class="source-row"><span>讲解为原书转述 · 原型为教学补充</span><button class="source-link" data-source="${u.pages[0]}">核对原书 · 第 ${u.pages[0]-48}—${u.pages.at(-1)-48} 页</button></div></details><section class="note-block open-recall"><span class="eyebrow">把操作连接到概念</span><label for="unit-note">${esc(u.prompts[0])}</label><p>写一条具体观察或解释，作为这次练习的记录。字数与写入不代表理解评分。</p><textarea id="unit-note" data-note="${u.id}" placeholder="先回忆实际发生了什么，再写出你的解释……">${esc(state.notes[u.id])}</textarea><details class="self-check"><summary>写完后，展开自评要点</summary><p>${esc(u.review.answer)}</p><span class="tiny">开放回答由你自评；工具只检查是否完成操作和记录。</span></details></section></div><footer class="lesson-footer"><p>${done?'已记录这次练习。可随时重做。':'完成上方操作步骤，并写一条自己的解释，才能记录完成。'}<br>已有实验结果与文字会自动保存。</p><button class="button" data-complete="${i}" ${!done&&!ready(i)?'disabled':''}>${i===units.length-1?'进入章节作品':'继续下一单元'}</button></footer></article>${companionView(u)}</div>`;
}
function newChallengeView() {
  const chapter=chapterLibrary[book.number], a=state.activities, done=a.capstoneDone;
  return `<div class="page-title entry"><span class="eyebrow">YOUR CHAPTER PROJECT</span><h1>${esc(chapter.project)}</h1><p>把四个单元的记录连成一个设计决定。可以回看实验；这里由你对照要点自评。</p></div><div class="wide-paper">${done&&chapter.revision===3&&a.capstoneRevision!==3?'<p class="feedback">本章作品要点已更新；之前的作品与自评记录仍保留。请回看新版要点后再次自评。</p>':''}<div class="project-evidence">${units.map((u,i)=>`<section><span class="question-number">0${i+1} · ${esc(u.nav)}</span><pre>${esc(labSummary(u,activityState(u))||'还没有实验记录。')}</pre><p>${esc(state.notes[u.id]||'还没有写下自己的解释。')}</p><button class="source-link" data-unit="${i}">回到实验</button></section>`).join('')}</div><section class="notes-item"><label for="chapter-plan"><h3>我的设计说明</h3></label><textarea id="chapter-plan" data-chapter-plan placeholder="我想设计……目标体验或场景是……我会用这些规则……我的依据与待验证假设是……">${esc(a.chapterPlan)}</textarea></section><div class="project-rubric"><h3>由我自己检查</h3>${chapter.rubric.map((r,i)=>`<label><input type="checkbox" data-rubric="${i}" ${a.rubric?.includes(i)?'checked':''}>${esc(r)}</label>`).join('')}</div><div class="challenge-toolbar"><button class="button" data-record-project>记录我的章节作品</button><button class="button secondary" data-export>导出全书学习记录</button></div>${done?'<div class="feedback good" data-project-status role="status">这份作品与自评已记录。之后可以继续修改；它并非自动判定通过的标准答案。</div>':''}</div>`;
}
function options(q, answers, kind, graded = false) {
  return `<div class="options" role="group" aria-label="${esc(q.stem)}">${q.options.map((o,i)=>{ const selected=answers[q.id]===i; let cls=selected?'selected':''; if(graded&&i===q.correct)cls+=' correct'; if(graded&&selected&&i!==q.correct)cls+=' incorrect'; return `<button class="option ${cls}" data-${kind}="${q.id}" data-answer="${i}" aria-pressed="${selected}"><span class="option-letter">${'ABCD'[i]}</span>${esc(o)}</button>`; }).join('')}</div>`;
}
function feedback(q, a) { return `<div class="feedback ${a===q.correct?'good':'retry'}" role="status"><strong>${a===q.correct?'这个判断符合本章。':'再想一想这个区别。'}</strong><br>${q.explanation}<br><button class="source-link" data-source="${q.page}">核对原书 · 第 ${q.page-48} 页</button></div>`; }
function lessonView(u) {
  if (book.number > 1) return newLessonView(u);
  const i=state.unit, done=state.completed.includes(i), q=u.question, answered=Number.isInteger(state.answers[q.id]);
  return `<div class="learning-grid entry"><article class="lesson-paper"><div class="lesson-intro"><div class="unit-meta"><span class="unit-tag">UNIT ${String(i+1).padStart(2,'0')} / 04</span><span>约 ${u.minutes} 分钟</span><span>原书：${esc(u.section)}</span></div><h1>${esc(u.title)}</h1><p class="lead">${esc(u.lead)}</p></div>${u.quote?`<div class="identity-illustration"><div class="quote">“${u.quote}”<small>原书短引 · 书中第 1 页</small></div>${art}</div>`:''}<div class="lesson-body"><div class="idea-box"><span class="eyebrow">这一节，先理解一个观点</span><p>${esc(u.idea)}</p></div><div class="reading-copy">${u.paragraphs.map(p=>`<p>${esc(p)}</p>`).join('')}</div><div class="source-row"><span>根据本章转述 · 图示与情境为教学补充</span><button class="source-link" data-source="${u.pages[0]}">核对原书 · 第 ${u.pages[0]-48}${u.pages.length>1?`—${u.pages.at(-1)-48}`:''} 页</button></div><div class="flow-strip" aria-label="教学图解">${u.takeaway.split(' → ').map((s,j)=>`${j?'<span class="flow-arrow" aria-hidden="true">→</span>':''}<span class="flow-step">${esc(s)}</span>`).join('')}</div>${activityView(u)}<section class="recall"><span class="eyebrow">停一下，试着回忆</span><h3>${esc(q.stem)}</h3>${options(q,state.answers,'recall',answered)}${answered?feedback(q,state.answers[q.id]):''}</section><section class="note-block"><label for="unit-note">留一句自己的理解</label><p>可选。用自己的话，留下这次阅读与你的联系。</p><textarea id="unit-note" data-note="${u.id}" placeholder="${esc(u.notePrompt)}">${esc(state.notes[u.id])}</textarea></section>${u.further?`<section class="references"><h3>原书推荐的延伸阅读</h3>${u.further.map(r=>`<div class="reference-item"><strong>${r.title}</strong>${r.author}<br>${r.purpose}</div>`).join('')}<button class="source-link" data-source="56">核对推荐书目 · 第 8 页</button></section>`:''}</div><footer class="lesson-footer"><p>${done?'这个单元已练习。可以随时回来重做。':'完成互动与回忆题后，记录这次练习。'}<br>你可以随时切换单元，记录会保留。</p><button class="button" data-complete="${i}" ${!done&&!ready(i)?'disabled':''}>${done?i===3?'进入章节挑战':'继续下一单元':i===3?'记录完成，进入挑战':'记录完成，继续学习'}</button></footer></article>${companionView(u)}</div>`;
}
function companionView(u) { return `<aside class="companion"><section class="side-card"><span class="eyebrow">CHAPTER PASSPORT</span><h3 style="margin-top:10px">我的学习进展</h3><div class="chapter-figure">${state.completed.length}<small>/ 4 个单元</small></div><div class="progress-track"><div class="progress-fill" style="width:${state.completed.length*25}%"></div></div><ul class="checklist">${units.map((v,i)=>`<li class="${state.completed.includes(i)?'finished':''}"><span class="dot-circle" aria-hidden="true"></span>${esc(v.nav)}${state.completed.includes(i)?' · 已练习':''}</li>`).join('')}</ul><p style="margin-top:18px;margin-bottom:0">练习完成记录与复习自评，会帮助你了解自己的进展。</p></section><section class="side-card"><h3>回到原书</h3><p>这里是帮助理解的讲解。作者的文字、论证和细节，仍然值得慢慢读。</p><button class="button secondary" data-source="${u.pages[0]}">查看本节原书</button></section><details class="chapter-lenses"><summary>本章原书透镜 · ${chapterLibrary[book.number].lenses.length} 面</summary>${chapterLibrary[book.number].lenses.map(l=>`<button class="source-link" data-source="${l.pdfPage}">#${l.number} ${esc(l.name)} · 第 ${l.pdfPage-48} 页</button>`).join('')}<p class="tiny">这是出处索引，不代表已掌握全部透镜。</p></details><p class="scope-note">当前内容：第 2 版第 ${book.number} 章。<br>PDF 第 ${book.pdfPages} 页，对应书中第 ${book.printedPages} 页。<br>开放练习由你对照要点自评。</p></aside>`; }
function activityView(u) {
  const a=u.activity, d=activityState(u); let body='';
  if(a.type==='decision') body=`<div class="options">${a.options.map((o,i)=>`<button class="option ${d.decision===i?'selected':''}" data-decision="${i}" aria-pressed="${d.decision===i}"><span class="option-letter">${'ABC'[i]}</span>${o}</button>`).join('')}</div>${Number.isInteger(d.decision)?`<div class="feedback ${d.decision===a.best?'good':'retry'}" role="status">${a.feedback[d.decision]}</div>`:''}`;
  else if(a.type==='skills') {
    const selected=Array.isArray(d.skills)?d.skills:[];
    body=`<div class="skill-grid" role="group" aria-label="原书列出的二十项技能">${skills.map((s,i)=>`<button class="skill-chip ${selected.includes(s)?'selected':''}" data-skill="${i}" aria-pressed="${selected.includes(s)}">${s}</button>`).join('')}</div><div class="skill-summary">已选 ${selected.length} 项 · 这是你的起点，不是能力评分</div><label class="activity-intro" for="skill-use">选一项，写下它在设计中的用途</label><textarea id="skill-use" data-skill-use placeholder="例如：我擅长讲故事，可以帮团队把关卡的目标表达清楚。">${esc(d.use)}</textarea>`;
  } else if(a.type==='listening') {
    const l=listeners.find(l=>l.id===listeningTab);
    body=`<div class="listen-tabs" role="group" aria-label="探索五种倾听">${listeners.map(v=>`<button class="listen-tab ${v.id===listeningTab?'active':''}" data-listener="${v.id}" aria-pressed="${v.id===listeningTab}">${v.name}</button>`).join('')}</div><div class="listen-detail"><span class="symbol">${l.symbol}</span><h4>${l.name} · ${l.subtitle}</h4><p>${l.body}</p><p class="ask">${l.ask}</p><button class="source-link" data-source="${l.page}">原书 · 第 ${l.page-48} 页</button></div>${observations.map((o,i)=>`<div class="observation"><label for="${o.id}"><span class="question-number">观察记录 ${String(i+1).padStart(2,'0')}</span><p>${o.text}</p></label><select id="${o.id}" data-match="${o.id}"><option value="">选择主要倾听对象</option>${listeners.map(l=>`<option value="${l.id}" ${d.matches?.[o.id]===l.id?'selected':''}>${l.name}</option>`).join('')}</select>${d.checked?`<div class="feedback ${d.matches?.[o.id]===o.target?'good':'retry'}">${d.matches?.[o.id]===o.target?'归类合适。':`可以再想一想：主要对象是${listeners.find(l=>l.id===o.target).name}。`}${o.why}</div>`:''}</div>`).join('')}<button class="button secondary" data-check-matches style="margin-top:15px">检查归类</button><div class="tiny" style="margin-top:12px">真实项目中，一个观察可能涉及多个对象。这里先练习识别主要对象。</div>`;
  } else body=`<div class="plan-fields">${a.fields.map((label,i)=>`<div><label for="plan-${i}">${label}</label><textarea id="plan-${i}" data-plan="${i}" placeholder="${['例如：用三张纸卡做一个两人交换游戏。','例如：请一位朋友试玩，观察规则是否容易理解。','例如：记录哪一步需要解释，再修改规则说明。'][i]}">${esc(d.plan?.[i])}</textarea></div>`).join('')}</div><div class="feedback">对照检查：行动是否足够小？观察对象是否具体？观察结果能否帮助下一次尝试？这个计划由你自评。</div>`;
  return `<section class="activity"><div class="activity-heading"><span class="activity-icon">✦</span><h3>${a.title}</h3></div><p class="activity-intro">${a.intro}</p><span class="label teaching">${a.type==='skills'?'原书技能清单 · 用途练习为补充':'教学补充 · 情境练习'}</span><div style="margin-top:16px">${body}</div></section>`;
}
function challengeView() {
  if (book.number > 1) return newChallengeView();
  const grades=gradeQuestions(challengeQuestions,state.challenge), correct=grades.filter(q=>q.correct).length;
  const missed=[...new Set(challengeQuestions.filter(q=>state.challenge[q.id]!==q.correct).map(q=>q.unit))];
  return `<div class="page-title entry"><span class="eyebrow">CHAPTER CHALLENGE</span><h1>换一个情境，试试你学到的。</h1><p>6 道情境题 + 一份自己的练习计划。可以回看原书，也可以重新尝试。</p></div><div class="wide-paper">${state.challengeSubmitted?`<section class="result-box" role="status"><h2>${correct} / 6 道判断符合本章</h2><p>${correct===6?'你已经完成这次情境判断。之后换个场景、隔段时间再回忆，才能继续了解理解是否稳定。':'下面标出了答案与依据。你可以回到相关单元，再重新尝试。'}</p><div class="result-actions">${missed.map(i=>`<button class="button secondary" data-unit="${i}">回看：${units[i].nav}</button>`).join('')}<button class="button secondary" data-redo-challenge>重新挑战</button><button class="button" data-view="review">查看复习卡片</button></div></section>`:''}${challengeQuestions.map((q,i)=>`<section class="challenge-item"><span class="question-number">情境 ${String(i+1).padStart(2,'0')} / 06</span><h3>${esc(q.stem)}</h3>${options(q,state.challenge,'challenge',state.challengeSubmitted)}${state.challengeSubmitted?feedback(q,state.challenge[q.id]):''}</section>`).join('')}<section class="notes-item"><span class="eyebrow">我的第一份设计练习</span><h3 style="margin-top:8px">把本章连接到你想做的游戏</h3><p class="activity-intro">选择一个小设计，写出你已有的技能、准备倾听的对象和下一次尝试。开放题由你对照下面要点自评。</p><label for="chapter-plan" class="tiny">我的计划</label><textarea id="chapter-plan" data-chapter-plan placeholder="我想尝试……我可以用到……我会先倾听……通过观察……决定下一步……">${esc(state.activities.chapterPlan)}</textarea><div class="feedback">自评要点：① 有一项可以开始的具体行动；② 发挥已有能力，说明需要的学习或协作；③ 指出倾听对象，以及准备观察或追问的内容。<br>写得具体，比写得长更重要。这里不会自动评价开放答案。</div></section><div class="challenge-toolbar">${!state.challengeSubmitted?'<button class="button" data-submit-challenge>提交 6 道情境题</button>':'<button class="button secondary" data-export>导出我的学习记录</button>'}<span class="tiny">${grades.filter(q=>q.answered).length} / 6 已回答 · 计划会随输入保存</span></div></div>`;
}
function formatDate(iso) { return new Date(iso).toLocaleDateString('zh-CN',{month:'long',day:'numeric'}); }
function reviewView() {
  return `<div class="page-title entry"><span class="eyebrow">RECALL & RETURN</span><h1>先回忆，再翻开答案。</h1><p>练习完成后安排次日、约第 3 天和第 7 天的回顾。想不起来，就从一天后重新开始；也可以提前练习。</p></div><div class="review-grid">${units.map((u,i)=>{
    const done=state.completed.includes(i),due=nextReviewDate(state.completedAt[i],state.review[i]),stage=Math.min(3,Math.max(0,Number(state.review[i]?.stage)||0));
    const info=!done?'这个单元还没有记录完成':!due?'已完成 3 次回忆自评 · 仍可随时重练':new Date(due)<=new Date()?'现在可以回顾':`下次回顾：${formatDate(due)}`;
    return `<article class="review-card"><span class="unit-tag">CONCEPT ${String(i+1).padStart(2,'0')}</span><h3>${esc(u.nav)}</h3><div class="status">${info}${done?` · 自评 ${stage} / 3`:''}</div><p class="question">${esc(u.review.prompt)}</p>${revealed.has(i)?`<div class="feedback">${esc(u.review.answer)}<br><button class="source-link" data-source="${u.pages[0]}">核对原书</button></div><div class="review-actions">${done?`<button class="button secondary" data-review="${i}" data-remembered="false">还需要回看</button><button class="button" data-review="${i}" data-remembered="true">这次能解释</button>`:`<button class="button" data-unit="${i}">去完成这个单元</button>`}</div>`:`<div class="review-actions"><button class="button secondary" data-reveal="${i}">翻开参考答案</button><button class="button ghost" data-unit="${i}">回看单元</button></div>`}</article>`;
  }).join('')}</div><p class="scope-note" style="margin-top:22px">回忆情况由你自评。复习间隔是本原型的简单安排；页面打开时检查到期内容。</p>`;
}
function notesView() { if (book.number>1) return newNotesView(); return `<div class="page-title entry"><span class="eyebrow">MY DESIGN NOTEBOOK</span><h1>把书里的方法，写进自己的经验。</h1><p>所有记录保存在当前浏览器。导出一份 Markdown 文件，可以随时留存或继续整理。</p></div><div class="wide-paper"><div class="notes-toolbar"><button class="button" data-export>导出学习记录 .md</button><button class="button secondary" data-backup>备份学习进度 .json</button><label class="button secondary" for="import-backup" style="cursor:pointer">恢复进度备份</label><input id="import-backup" type="file" accept="application/json,.json" hidden></div>${units.map((u,i)=>`<section class="notes-item"><span class="question-number">UNIT ${String(i+1).padStart(2,'0')} · ${state.completed.includes(i)?'已练习':'未记录完成'}</span><h3>${esc(u.nav)}</h3>${state.notes[u.id]?`<pre>${esc(state.notes[u.id])}</pre>`:'<p class="tiny">这个单元还没有留下笔记。</p>'}${i===1&&state.activities.skills?.skills?.length?`<p class="tiny">我的技能：${esc(state.activities.skills.skills.join('、'))}</p><pre>${esc(state.activities.skills.use)}</pre>`:''}${i===3&&state.activities.practice?.plan?`<pre>${[0,1,2].map(n=>`${u.activity.fields[n]}\n${state.activities.practice.plan[n]||'尚未填写'}`).map(esc).join('\n\n')}</pre>`:''}<button class="source-link" data-unit="${i}">回到这个单元</button></section>`).join('')}<section class="notes-item"><h3>我的第一份设计练习</h3>${state.activities.chapterPlan?`<pre>${esc(state.activities.chapterPlan)}</pre>`:'<p class="tiny">完成章节挑战时，可以留下自己的练习计划。</p>'}</section><p class="scope-note" style="margin-top:20px">恢复备份会替换此浏览器的当前进度。恢复前会先生成一份当前进度备份，请在弹窗中下载或复制留存。</p></div>`; }
function newNotesView() {
  return `<div class="page-title entry"><span class="eyebrow">MY DESIGN NOTEBOOK</span><h1>保存操作，也保存思考。</h1><p>当前展示第 ${book.number} 章；导出与备份包含所有已学习章节。</p></div><div class="wide-paper"><div class="notes-toolbar"><button class="button" data-export>导出全书学习记录 .md</button><button class="button secondary" data-backup>备份全部进度 .json</button><label class="button secondary" for="import-backup">恢复进度备份</label><input id="import-backup" type="file" accept="application/json,.json" hidden></div>${units.map((u,i)=>`<section class="notes-item"><span class="question-number">0${i+1} · ${state.completed.includes(i)?'已练习':'尚未记录完成'}</span><h3>${esc(u.nav)}</h3><pre>${esc(labSummary(u,activityState(u))||'尚无实验记录。')}</pre><pre>${esc(state.notes[u.id]||'尚无个人解释。')}</pre><button class="source-link" data-unit="${i}">回到单元</button></section>`).join('')}<section class="notes-item"><h3>我的章节作品</h3><pre>${esc(state.activities.chapterPlan||'尚未填写。')}</pre><p class="tiny">${state.activities.capstoneDone?'已记录作品与自评':'尚未记录作品'}</p></section><p class="scope-note">恢复全书备份会替换当前全部进度，并先打开恢复前备份供你留存。旧版第一章备份只替换第一章，保留其他章节。</p></div>`;
}
function showSource(page) {
  const start=Number(book.pdfPages.split('—')[0]),end=Number(book.pdfPages.split('—')[1]);
  if(!Number.isInteger(page)||page<start||page>end){toast('原书页面超出本章范围，无法打开');return;}
  const select=document.querySelector('#source-page'); select.innerHTML=Array.from({length:end-start+1},(_,i)=>`<option value="${i+start}">书中第 ${i+start-48} 页 · PDF ${i+start}</option>`).join(''); select.value=String(page);
  const image=document.querySelector('#source-image'); image.src=`assets/source/page-${page}.jpg`; image.alt=`《游戏设计艺术》第2版，书中第 ${page-48} 页，PDF 第 ${page} 页`;
  if(!document.querySelector('#source-dialog').open)document.querySelector('#source-dialog').showModal();
}
function download(contents,name,type) { const url=URL.createObjectURL(new Blob([contents],{type})),a=document.createElement('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),30000); }
let exportFile = null;
function prepareExport(contents, name, type) {
  exportFile = { contents, name, type };
  document.querySelector('#export-content').value = contents;
  document.querySelector('#export-title').textContent = name.endsWith('.json') ? '保存学习进度备份' : '保存我的学习记录';
  const dialog = document.querySelector('#export-dialog');
  if (!dialog.open) dialog.showModal();
}
function backup() { prepareExport(JSON.stringify(workbook,null,2),`全书进度备份-${Date.now()}.json`,'application/json'); }
function exportNotes() {
  const lines=['# 《游戏设计艺术》第2版 · 学习记录',`导出时间：${new Date().toLocaleString('zh-CN')}`,'','讲解为原书转述，互动为教学补充；开放回答由学习者自评。',''];
  for (const [id,chapter] of Object.entries(chapterLibrary)) {
    const saved=workbook.chapters[id]; if(!saved)continue;
    lines.push(`## 第 ${id} 章 · ${chapter.book.chapter}`,`来源：书中第 ${chapter.book.printedPages} 页 / PDF ${chapter.book.pdfPages}`,'');
    chapter.units.forEach((u,i)=>{
      lines.push(`### ${i+1}. ${esc(u.nav)}`,`状态：${saved.completed.includes(i)?'已练习':'未记录完成'}`,`原书：第 ${u.pages[0]-48}—${u.pages.at(-1)-48} 页`,'',saved.notes[u.id]||'尚无个人解释。','');
      const a=saved.activities[u.id]||{};
      if(+id>1)lines.push(labSummary(u,a),'');
      else if(i===0&&Number.isInteger(a.decision))lines.push('情境选择：'+u.activity.options[a.decision],'');
      else if(i===1)lines.push('我的技能：'+(a.skills||[]).join('、'),'用途：'+(a.use||'尚未填写'),'');
      else if(i===2)observations.forEach(o=>lines.push(o.text,'归类：'+(listeners.find(l=>l.id===a.matches?.[o.id])?.name||'尚未选择'),''));
      else if(i===3)[0,1,2].forEach(n=>lines.push(u.activity.fields[n],a.plan?.[n]||'尚未填写',''));
    });
    lines.push('### 我的章节作品',saved.activities.chapterPlan||'尚未填写','');
    if(+id===1)challengeQuestions.forEach(q=>lines.push(q.stem,'我的回答：'+(q.options[saved.challenge[q.id]]||'尚未回答'),saved.challengeSubmitted?'结果：'+(saved.challenge[q.id]===q.correct?'符合本章':'需要回顾'):'未提交',''));
    else lines.push('自评项：'+(saved.activities.rubric||[]).map(i=>chapter.rubric[i]).filter(Boolean).join('；'),'作品记录：'+(saved.activities.capstoneDone?'已记录':'尚未记录'),'');
  }
  prepareExport(lines.join('\n'),`游戏设计艺术学习记录-${new Date().toISOString().slice(0,10)}.md`,'text/markdown; charset=utf-8');
}
function changeChapter(id) { if(!selectChapter(id))return;catalogOpen=false;revealed.clear();resetLabRuntime();save();render(false);document.querySelector('#main').focus({preventScroll:true}); }
app.addEventListener('click',event=>{
  const b=event.target.closest('button');if(!b)return;const d=b.dataset;
  if('catalog' in d){catalogOpen=true;render(false);document.querySelector('#main').focus({preventScroll:true});return;}
  if('chapter' in d){changeChapter(Number(d.chapter));return;}
  if('lab' in d){if(d.lab==='studio-sound')playStudioSound().then(ok=>toast(ok?'已播放反馈音。':'浏览器未能播放音频，仍可比较视觉反馈。'));const result=handleLab(units[state.unit],activityState(units[state.unit]),d);if(result){if(typeof result==='string'&&d.lab!=='studio-sound')toast(result);save();refresh(`[data-lab="${d.lab}"][data-value="${d.value||''}"]`);}return;}
  if('recordProject' in d){const a=state.activities;if(!projectReady(a.chapterPlan,a.rubric,chapterLibrary[book.number].rubric)){toast('请写下设计说明，并对照本章全部要点自评');return;}a.capstoneDone=new Date().toISOString();a.capstoneRevision=chapterLibrary[book.number].revision||1;save();render();toast('已保存作品与自评');return;}
  if('source' in d){showSource(Number(d.source));return;}
  if('unit' in d){navigate('lesson',Number(d.unit));return;}
  if('view' in d){navigate(d.view);return;}
  if('decision' in d){activityState(units[0]).decision=Number(d.decision);save();refresh(`[data-decision="${d.decision}"]`);return;}
  if('skill' in d){const a=activityState(units[1]),s=skills[Number(d.skill)],selected=Array.isArray(a.skills)?a.skills:[];a.skills=selected.includes(s)?selected.filter(v=>v!==s):[...selected,s];save();refresh(`[data-skill="${d.skill}"]`);return;}
  if('listener' in d){listeningTab=d.listener;refresh(`[data-listener="${d.listener}"]`);return;}
  if('checkMatches' in d){const a=activityState(units[2]);if(!observations.every(o=>a.matches?.[o.id])){toast('请先为五段记录选择对象');return;}a.checked=true;save();refresh('[data-check-matches]');return;}
  if('recall' in d){state.answers[d.recall]=Number(d.answer);save();refresh(`[data-recall="${d.recall}"][data-answer="${d.answer}"]`);return;}
  if('complete' in d){const i=Number(d.complete);if(!state.completed.includes(i)){if(!ready(i))return;state.completed.push(i);state.completedAt[i]=new Date().toISOString();save();toast('这次练习已记录，次日可以回来复习');}if(i===units.length-1)navigate('challenge');else navigate('lesson',i+1);return;}
  if('challenge' in d){if(state.challengeSubmitted){toast('点击“重新挑战”开始新一次作答');return;}state.challenge[d.challenge]=Number(d.answer);save();refresh(`[data-challenge="${d.challenge}"][data-answer="${d.answer}"]`);return;}
  if('submitChallenge' in d){if(!gradeQuestions(challengeQuestions,state.challenge).every(q=>q.answered)){toast('请先回答全部 6 道情境题');return;}state.challengeSubmitted=true;save();render(false);document.querySelector('.result-box').scrollIntoView({block:'start'});return;}
  if('redoChallenge' in d){state.challenge={};state.challengeSubmitted=false;save();render(false);toast('开始新一次挑战，练习计划保留');return;}
  if('reveal' in d){revealed.add(Number(d.reveal));render();return;}
  if('review' in d){const i=Number(d.review);if(!state.completed.includes(i))return;state.review[i]=recordReview(state.review[i],d.remembered==='true');revealed.delete(i);save();render();toast(d.remembered==='true'?'已记录这次回忆自评':'已安排一天后再次回顾');return;}
  if('export' in d){exportNotes();return;}
  if('backup' in d){backup();}
});
app.addEventListener('input',event=>{
  const el=event.target,d=el.dataset;
  if('studioField' in d)studioInput(units[state.unit],activityState(units[state.unit]),d.studioField,el.value);
  else if('labField' in d)activityState(units[state.unit])[d.labField]=el.value;
  else if('note' in d)state.notes[d.note]=el.value;
  else if('skillUse' in d)activityState(units[1]).use=el.value;
  else if('plan' in d){const a=activityState(units[3]);a.plan||={};a.plan[d.plan]=el.value;}
  else if('chapterPlan' in d){state.activities.chapterPlan=el.value;if(book.number>1){delete state.activities.capstoneDone;document.querySelector('[data-project-status]')?.remove();}}
  else return;save();updateFinish();
});
app.addEventListener('change',async event=>{
  const el=event.target;
  if(el.id==='chapter-select'){changeChapter(Number(el.value));return;}
  if(el.dataset.studioField){studioInput(units[state.unit],activityState(units[state.unit]),el.dataset.studioField,el.value);save();refresh(`[data-studio-field="${el.dataset.studioField}"]`);return;}
  if(el.dataset.rubric!==undefined){const a=state.activities, i=Number(el.dataset.rubric),selected=a.rubric||[];a.rubric=el.checked?[...new Set([...selected,i])]:selected.filter(v=>v!==i);delete a.capstoneDone;document.querySelector('[data-project-status]')?.remove();save();return;}
  if(el.dataset.match){const a=activityState(units[2]);a.matches||={};a.matches[el.dataset.match]=el.value;a.checked=false;save();refresh(`#${el.id}`);return;}
  if(el.id==='import-backup'){
    const file=el.files[0];if(!file)return;
    try{if(file.size>16000000)throw new Error('too large');const raw=await file.text(),p=JSON.parse(raw);const restored=importWorkbook(p,workbook);backup();workbook=restored;selectChapter(chapterLibrary[workbook.currentChapter]?workbook.currentChapter:1);resetLabRuntime();revealed.clear();save();render(false);toast('已恢复备份；请保存弹窗中的恢复前进度');}
    catch{toast('无法读取这份备份，请选择本工具导出的 JSON 文件');el.value='';}
  }
});
const dialog=document.querySelector('#source-dialog');
document.querySelector('#close-source').addEventListener('click',()=>dialog.close());
document.querySelector('#source-page').addEventListener('change',event=>showSource(Number(event.target.value)));
dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}});
window.addEventListener('storage',event=>{if(event.key===WORKBOOK_KEY)toast('另一个标签页更新了记录；刷新页面可加载最新进度');});
render(false);
document.querySelector('#close-export').addEventListener('click', () => document.querySelector('#export-dialog').close());
document.querySelector('#download-export').addEventListener('click', () => { if (exportFile) { download(exportFile.contents, exportFile.name, exportFile.type); toast('已请求浏览器下载；也可复制内容留存'); } });
document.querySelector('#copy-export').addEventListener('click', async () => {
  if (!exportFile) return;
  try { await navigator.clipboard.writeText(exportFile.contents); toast('完整内容已复制'); }
  catch { document.querySelector('#export-content').focus(); document.querySelector('#export-content').select(); toast('内容已选中，请按 ⌘C 或 Ctrl+C 复制'); }
});

// Optional WebMCP: the same navigation and progress used by the visible UI.
if (document.modelContext?.registerTool) {
  const lifecycle = new AbortController();
  window.addEventListener('pagehide', () => lifecycle.abort(), { once: true });
  const progressTool = {
    name: 'read_chapter_learning_progress', title: '读取当前章节学习进度',
    description: '读取当前单元、已练习单元和待复习数量。只读，不返回笔记或开放答案。',
    inputSchema: { type: 'object', properties: {}, additionalProperties: false },
    annotations: { readOnlyHint: true, untrustedContentHint: false },
    execute(input) {
      if (!input || typeof input !== 'object' || Array.isArray(input) || Object.keys(input).length) throw new Error('此工具只接受空对象。');
      return { chapter: book.number, totalChapters: chapterCatalog.length, availableChapters: Object.keys(chapterLibrary).map(Number), view: state.view, unit: state.unit + 1, completedUnits: state.completed.map(i => i + 1), dueReviews: dueCount() };
    }
  };
  const navigateTool = {
    name: 'navigate_chapter_learning', title: '打开当前章节学习内容',
    description: '切换当前章节的单元、章节挑战、复习卡或笔记，保存阅读位置；不提交答案或完成练习。unit 取值 1—4，只在 lesson 视图使用。',
    inputSchema: { type: 'object', properties: { view: { type: 'string', enum: ['lesson', 'challenge', 'review', 'notes'] }, unit: { type: 'integer', minimum: 1, maximum: 4 } }, required: ['view'], additionalProperties: false },
    annotations: { readOnlyHint: false, untrustedContentHint: false },
    execute(input) {
      if (!input || typeof input !== 'object' || Array.isArray(input) || Object.keys(input).some(k => !['view', 'unit'].includes(k)) || !['lesson', 'challenge', 'review', 'notes'].includes(input.view)) throw new Error('视图无效。');
      if (input.unit !== undefined && (!Number.isInteger(input.unit) || input.unit < 1 || input.unit > 4 || input.view !== 'lesson')) throw new Error('单元必须为 1—4，且只用于 lesson 视图。');
      navigate(input.view, input.unit === undefined ? state.unit : input.unit - 1);
      return { view: state.view, unit: state.unit + 1 };
    }
  };
  for (const tool of [progressTool, navigateTool]) {
    try { Promise.resolve(document.modelContext.registerTool(tool, { signal: lifecycle.signal })).catch(() => {}); } catch { /* UI remains usable in unsupported browsers. */ }
  }
}

app.addEventListener('keydown', event => {
  if(!event.target.closest('[data-lab="move"]')||state.view!=='lesson'||book.number===1)return;
  const direction={ArrowUp:'up',ArrowDown:'down',ArrowLeft:'left',ArrowRight:'right'}[event.key];
  if(!direction)return;event.preventDefault();handleLab(units[state.unit],activityState(units[state.unit]),{lab:'move',value:direction});save();refresh(`[data-lab="move"][data-value="${direction}"]`);
});
