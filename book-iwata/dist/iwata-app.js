import { iwataCatalog, iwataChapters } from './iwata-content.js';
import { rpnCalc, evalDebtRestructure, evalBottleneck, evalProgrammerResponse, evalMother2Choice, evalConsoleStrategy } from './iwata-sim.js';
import { iwataEraProfiles } from './iwata-trivia.js';

const STORAGE_KEY = 'book-to-play:iwata:workbook:v1';
let store = {
  currentChapter: 1,
  currentSection: 0,
  fontSize: 18,
  notes: {},
  completed: {},
  simState: {
    debt: { salary: 42, debt: 38, rd: 20 },
    rpn: { stack: [] },
    pipe: { concept: 4, art: 6, logic: 16, qa: 3 },
    programmerMode: 'iwata',
    mother2Choice: 'rewrite',
    consoleStrategy: 'blue-ocean'
  }
};

try {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) Object.assign(store, JSON.parse(raw));
} catch (e) {
  console.warn('读取本地阅读进度失败', e);
}

function save() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch (e) {
    console.error('保存失败', e);
  }
}

const app = document.querySelector('#app');

function render() {
  const currentChapterMeta = iwataCatalog.find(c => c.id === store.currentChapter) || iwataCatalog[0];
  const sections = iwataChapters[store.currentChapter] || [];
  const currentSec = sections[store.currentSection] || sections[0];

  let totalSectionsCount = 0;
  for (let c = 1; c <= 7; c++) {
    totalSectionsCount += (iwataChapters[c] || []).length;
  }
  const readSectionsCount = Object.values(store.completed).filter(Boolean).length;

  app.innerHTML = `
    <div class="reader-shell" style="--base-font-size: ${store.fontSize}px;">
      <!-- Left Chapter & Index Drawer -->
      <aside class="reader-sidebar">
        <div class="sidebar-top">
          <a href="../../index.html" class="nav-back-shelf" title="返回我的书架">
            ‹ 返回书架
          </a>
          <div class="reader-book-identity">
            <span class="eyebrow">AUTHENTIC MEMOIR</span>
            <h2>岩田先生</h2>
            <p>任天堂传奇社长如是说 · 原文精读</p>
          </div>
        </div>

        <div class="chapter-switcher">
          <label for="chapter-select">选择篇章</label>
          <select id="chapter-select">
            ${iwataCatalog.map(c => `
              <option value="${c.id}" ${c.id === store.currentChapter ? 'selected' : ''}>
                ${c.title}
              </option>
            `).join('')}
          </select>
        </div>

        <nav class="section-toc-list">
          <span class="eyebrow" style="margin: 8px 0 10px 12px;">本章小节（点击阅读）</span>
          ${sections.map((s, idx) => `
            <button class="toc-item ${idx === store.currentSection ? 'active' : ''} ${store.completed[s.id] ? 'done' : ''}" data-sec="${idx}">
              <span class="toc-num">${store.completed[s.id] ? '✓' : String(idx + 1).padStart(2, '0')}</span>
              <span class="toc-title">${s.title}</span>
            </button>
          `).join('')}
        </nav>

        <div class="sidebar-foot">
          <div class="font-resizer">
            <span>字号</span>
            <button class="btn-font" id="btn-font-dec" title="缩小正文字号">A-</button>
            <span style="font-family:var(--font-mono); font-size:12px;">${store.fontSize}px</span>
            <button class="btn-font" id="btn-font-inc" title="放大正文字号">A+</button>
          </div>
          <div class="reading-stats">
            累计精读：${readSectionsCount} / ${totalSectionsCount} 节
          </div>
        </div>
      </aside>

      <!-- Main Reading Stage -->
      <main class="reader-stage">
        <header class="reader-topbar">
          <div class="reader-breadcrumb">
            <a href="../../index.html">我的书架</a> <span>/</span>
            <strong>岩田先生</strong> <span>/</span>
            <span>${currentChapterMeta.title}</span> <span>/</span>
            <span class="curr-sec-title">${currentSec.title}</span>
          </div>
          <div class="reader-tools">
            <span class="read-badge">${store.completed[currentSec.id] ? '已通读并标记' : '正在研读'}</span>
          </div>
        </header>

        <!-- Book Reading Paper Sheet -->
        <article class="reader-paper">
          <header class="section-heading">
            <span class="section-chapter-tag">${currentChapterMeta.title} · 第 ${store.currentSection + 1} 节</span>
            <h1 class="section-main-title">${currentSec.title}</h1>
          </header>

          <!-- Historical Era Capsule (Shown at Section 1 of Chapter) -->
          ${store.currentSection === 0 ? renderEraCapsule(store.currentChapter) : ''}

          <!-- Authentic Book Paragraphs -->
          <div class="article-body">
            ${renderArticleContent(currentSec)}
          </div>

          <!-- Historical Trivia & Anecdotes -->
          ${renderTriviaSection(store.currentChapter)}

          <!-- Section End Action & Reader's Notes -->
          <footer class="section-foot">
            <div class="reader-reflection-box">
              <span class="eyebrow">读者思考与心得批注</span>
              <textarea id="section-note" placeholder="读完这一节，岩田社长的哪一句话或哪种态度触动了你？在此记下你的批注与体悟……">${store.notes[currentSec.id] || ''}</textarea>
            </div>

            <div class="section-nav-actions">
              <button class="btn-mark-done" id="btn-done">
                ${store.completed[currentSec.id] ? '✓ 已标记本节读完' : '标记读完此节 · 记录心得'}
              </button>
              ${store.currentSection < sections.length - 1 ? `
                <button class="btn-next-sec" id="btn-next">
                  下一小节：${sections[store.currentSection + 1].title} ➔
                </button>
              ` : `
                <span style="font-size:13px; color:var(--ink-muted);">恭喜！你已读完全章！可在左侧切换篇章。</span>
              `}
            </div>
          </footer>
        </article>
      </main>
    </div>
  `;

  bindEvents();
}

function renderEraCapsule(chapterId) {
  const profile = iwataEraProfiles[chapterId];
  if (!profile) return '';

  return `
    <div class="era-capsule-box">
      <div class="era-capsule-header">
        <span class="era-tag">⏳ 时代背景坐标 · ${escapeHtml(profile.yearSpan)}</span>
        <h3 class="era-title">${escapeHtml(profile.eraName)}</h3>
      </div>
      <p class="era-context">${escapeHtml(profile.industryContext)}</p>

      ${profile.keyFigures?.length ? `
        <div class="era-figures-row">
          <div class="era-figures-label">本章出场 / 核心人物：</div>
          <div class="era-figures-list">
            ${profile.keyFigures.map(fig => `
              <div class="figure-chip" title="${escapeHtml(fig.desc)}">
                <strong>${escapeHtml(fig.name)}</strong>
                <span>${escapeHtml(fig.role)}</span>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}
    </div>
  `;
}

function renderTriviaSection(chapterId) {
  const profile = iwataEraProfiles[chapterId];
  if (!profile || !profile.anecdotes || profile.anecdotes.length === 0) return '';

  return `
    <div class="trivia-section-box">
      <div class="trivia-header">
        <span class="trivia-badge">✦ 历史小趣事 & 幕后逸闻</span>
        <span class="trivia-hint">（帮助读者建立更生动的历史代入感）</span>
      </div>
      <div class="trivia-cards-grid">
        ${profile.anecdotes.map(item => `
          <div class="trivia-card">
            <h4>💡 ${escapeHtml(item.title)}</h4>
            <p>${escapeHtml(item.content)}</p>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function renderArticleContent(sec) {
  const paras = sec.paragraphs || [];
  let html = '';

  paras.forEach((p, idx) => {
    html += `<p class="book-paragraph">${escapeHtml(p)}</p>`;

    // Inline widget at relevant paragraphs
    if (sec.widget === 'rpn-calc' && idx === 3) {
      html += renderRpnWidget();
    } else if (sec.widget === 'debt-restructure' && idx === 3) {
      html += renderDebtWidget();
    } else if (sec.widget === 'bottleneck-finder' && idx === 3) {
      html += renderBottleneckWidget();
    } else if (sec.widget === 'programmer-say-no' && idx === 2) {
      html += renderProgrammerWidget();
    } else if (sec.widget === 'mother2-rewrite' && idx === 2) {
      html += renderMother2Widget();
    } else if (sec.widget === 'dangerous-extension' && idx === 3) {
      html += renderConsoleStrategyWidget();
    }
  });

  return html;
}

function renderDebtWidget() {
  const alloc = store.simState.debt || { salary: 42, debt: 38, rd: 20 };
  const res = evalDebtRestructure(alloc);

  return `
    <div class="inline-widget debt-widget" id="debt-interactive-box">
      <div class="widget-badge">✦ 原文情境决策重演 · 15亿日元负债处境沙盒</div>
      <div class="widget-lead">
        岩田聪三十三岁接手负债 15 亿的濒死公司。请拖动下方滑块调整经营配比，观察公司命运与员工心声的实时反馈：
      </div>

      <div class="sliders-board">
        <div class="slider-row">
          <div class="slider-meta">
            <span class="slider-label">员工薪酬全额保障</span>
            <strong class="slider-val">${alloc.salary}%</strong>
          </div>
          <input type="range" min="15" max="65" value="${alloc.salary}" data-alloc="salary" class="slider-track">
        </div>

        <div class="slider-row">
          <div class="slider-meta">
            <span class="slider-label">每年定额债务偿付</span>
            <strong class="slider-val">${alloc.debt}%</strong>
          </div>
          <input type="range" min="15" max="65" value="${alloc.debt}" data-alloc="debt" class="slider-track">
        </div>

        <div class="slider-row">
          <div class="slider-meta">
            <span class="slider-label">预留试错与原创研发</span>
            <strong class="slider-val">${alloc.rd}%</strong>
          </div>
          <input type="range" min="5" max="45" value="${alloc.rd}" data-alloc="rd" class="slider-track">
        </div>
      </div>

      <div class="situation-grid">
        <div class="situation-card ${res.salaryStatus.level}">
          <div class="card-title">${res.salaryStatus.title}</div>
          <p>${res.salaryStatus.desc}</p>
        </div>

        <div class="situation-card ${res.debtStatus.level}">
          <div class="card-title">${res.debtStatus.title}</div>
          <p>${res.debtStatus.desc}</p>
        </div>

        <div class="situation-card ${res.rdStatus.level}">
          <div class="card-title">${res.rdStatus.title}</div>
          <p>${res.rdStatus.desc}</p>
        </div>
      </div>

      <div class="situation-summary ${res.isBalanced ? 'balanced' : 'unbalanced'}">
        <span class="summary-icon">${res.isBalanced ? '✓' : 'ℹ'}</span>
        <span>${res.summary}</span>
      </div>
    </div>
  `;
}

function renderRpnWidget() {
  const stack = store.simState.rpn?.stack || [];
  const msg = store.simState.rpn?.msg || '操作提示：依次点击 [1] -> [2] -> [＋]，体验没有等号键的逆波兰逻辑！';

  return `
    <div class="inline-widget rpn-widget">
      <div class="widget-badge">✦ 原文情境体验 · 岩田社长少年时代的 HP 逆波兰台式机</div>
      <div class="widget-lead">
        “如果要计算 1 加 2，得先按 1 再按 ENTER，接着按 2，最后按 ＋。”
      </div>
      <div class="rpn-display-box">
        <div class="stack-view">当前运算栈（后进先出）：[ ${stack.length ? stack.join(' , ') : '空'} ]</div>
        <div class="rpn-buttons">
          <button class="btn-rpn-key" data-rpn="1">输入 1</button>
          <button class="btn-rpn-key" data-rpn="2">输入 2</button>
          <button class="btn-rpn-key" data-rpn="3">输入 3</button>
          <button class="btn-rpn-key op" data-rpn="+">＋ (相加)</button>
          <button class="btn-rpn-key op" data-rpn="*">× (相乘)</button>
          <button class="btn-rpn-key reset" data-rpn="clear">重置栈</button>
        </div>
        <div class="rpn-status-text">${escapeHtml(msg)}</div>
      </div>
    </div>
  `;
}

function renderBottleneckWidget() {
  const pipe = store.simState.pipe || { concept: 4, art: 6, logic: 16, qa: 3 };
  const log = store.simState.pipeLog || '点击下方积压最严重的瓶颈环节，尝试对其进行优化：';

  return `
    <div class="inline-widget pipe-widget">
      <div class="widget-badge">✦ 原文机制沙盒 · 找出全线流速瓶颈</div>
      <div class="widget-lead">
        “要想让整体顺畅运转，就必须首先找到这个最狭窄的地方。只把注意力放在瓶颈以外，再拓宽也改变不了全局。”
      </div>
      <div class="pipe-cards-flex">
        ${Object.entries(pipe).map(([k, v]) => `
          <button class="pipe-item-btn ${v >= 10 ? 'choke' : ''}" data-pipe="${k}">
            <span class="p-name">${k === 'concept' ? '策划设定' : k === 'art' ? '原画资源' : k === 'logic' ? '核心代码逻辑' : '质检回归'}</span>
            <strong class="p-load">排队积压: ${v}</strong>
            <span class="p-tip">${v >= 10 ? '🚨 最狭窄瓶颈！' : '流动顺畅'}</span>
          </button>
        `).join('')}
      </div>
      <div class="pipe-feedback-bar">${escapeHtml(log)}</div>
    </div>
  `;
}

function renderProgrammerWidget() {
  const mode = store.simState.programmerMode || 'iwata';
  const res = evalProgrammerResponse(mode);

  return `
    <div class="inline-widget prog-widget">
      <div class="widget-badge">✦ 原文思辨沙盒 · “程序员不能说不”的真正含义</div>
      <div class="widget-lead">
        当策划或伙伴提出一个在现有代码结构下极其棘手的新需求时，不同的回应方式会引发何种连锁反应？
      </div>

      <div class="mode-select-row">
        <button class="btn-mode ${mode === 'reject' ? 'selected' : ''}" data-prog-mode="reject">① 直接拒绝：“在技术上绝不可能”</button>
        <button class="btn-mode ${mode === 'blind-agree' ? 'selected' : ''}" data-prog-mode="blind-agree">② 盲目应承：“没问题我硬写”</button>
        <button class="btn-mode ${mode === 'iwata' ? 'selected' : ''}" data-prog-mode="iwata">③ 岩田式回应：重构底层与边界条件</button>
      </div>

      <div class="prog-feedback-box ${res.isIwataWay ? 'iwata-way' : 'flawed'}">
        <h4>${res.title}</h4>
        <p>${res.feedback}</p>
      </div>
    </div>
  `;
}

function renderMother2Widget() {
  const choice = store.simState.mother2Choice || 'rewrite';
  const res = evalMother2Choice(choice);

  return `
    <div class="inline-widget mother2-widget">
      <div class="widget-badge">✦ 历史决断沙盒 · 重做《地球冒险2》的两个方法</div>
      <div class="widget-lead">
        糸井重里团队开发《地球冒险2》陷入泥潭工期停滞。岩田聪亲赴现场视察全部代码后，给出了震撼业界的两种选择：
      </div>

      <div class="choice-tabs">
        <button class="choice-tab ${choice === 'patch' ? 'active' : ''}" data-mother2="patch">方案 A：顺着现状打补丁继续修</button>
        <button class="choice-tab ${choice === 'rewrite' ? 'active' : ''}" data-mother2="rewrite">方案 B：推倒重来，由岩田聪彻底重写底层</button>
      </div>

      <div class="mother2-report-card ${res.isHistorical ? 'historical-win' : 'delay-trap'}">
        <div class="report-metrics">
          <div>预计工期：<strong>${res.time}</strong></div>
          <div>技术风险：<strong>${res.risk}</strong></div>
          <div>团队士气：<strong>${res.morale}</strong></div>
        </div>
        <p class="report-desc">${res.result}</p>
      </div>
    </div>
  `;
}

function renderConsoleStrategyWidget() {
  const strat = store.simState.consoleStrategy || 'blue-ocean';
  const res = evalConsoleStrategy(strat);

  return `
    <div class="inline-widget console-widget">
      <div class="widget-badge">✦ 商业哲学沙盒 · 站在既有延长线上的可怕性</div>
      <div class="widget-lead">
        主机世代更迭时，竞争对手纷纷加码算力与逼真画质。任天堂应如何抉择？
      </div>

      <div class="choice-tabs">
        <button class="choice-tab ${strat === 'spec-war' ? 'active' : ''}" data-console="spec-war">继续性能延长线（追逐更高算力与极致画面）</button>
        <button class="choice-tab ${strat === 'blue-ocean' ? 'active' : ''}" data-console="blue-ocean">打破延长线：NDS 双屏触控 & Wii 体感蓝海</button>
      </div>

      <div class="console-report-card ${res.isBlueOcean ? 'historical-win' : 'spec-trap'}">
        <div class="report-metrics">
          <div>开发成本：<strong>${res.cost}</strong></div>
          <div>玩家群体：<strong>${res.market}</strong></div>
        </div>
        <p class="report-desc">${res.feedback}</p>
      </div>
    </div>
  `;
}

function bindEvents() {
  // Chapter Switch
  document.querySelector('#chapter-select')?.addEventListener('change', e => {
    store.currentChapter = Number(e.target.value);
    store.currentSection = 0;
    save();
    render();
  });

  // Section Switch
  document.querySelectorAll('.toc-item').forEach(btn => {
    btn.addEventListener('click', () => {
      store.currentSection = Number(btn.getAttribute('data-sec'));
      save();
      render();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });

  // Font resize
  document.querySelector('#btn-font-inc')?.addEventListener('click', () => {
    store.fontSize = Math.min(26, (store.fontSize || 18) + 1);
    save();
    render();
  });
  document.querySelector('#btn-font-dec')?.addEventListener('click', () => {
    store.fontSize = Math.max(14, (store.fontSize || 18) - 1);
    save();
    render();
  });

  // Debt slider live feedback
  document.querySelectorAll('[data-alloc]').forEach(slider => {
    slider.addEventListener('input', e => {
      const key = e.target.getAttribute('data-alloc');
      store.simState.debt ||= { salary: 42, debt: 38, rd: 20 };
      store.simState.debt[key] = Number(e.target.value);
      save();
      const container = document.querySelector('#debt-interactive-box');
      if (container) {
        container.outerHTML = renderDebtWidget();
        bindEvents();
      }
    });
  });

  // RPN actions
  document.querySelectorAll('[data-rpn]').forEach(btn => {
    btn.addEventListener('click', () => {
      const val = btn.getAttribute('data-rpn');
      const op = ['+', '-', '*', '/', 'clear'].includes(val) ? val : Number(val);
      const curStack = store.simState.rpn?.stack || [];
      const res = rpnCalc(curStack, op);
      store.simState.rpn = { stack: res.stack, msg: res.msg || res.error };
      save();
      render();
    });
  });

  // Pipe actions
  document.querySelectorAll('[data-pipe]').forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.getAttribute('data-pipe');
      const pipe = store.simState.pipe || { concept: 4, art: 6, logic: 16, qa: 3 };
      const res = evalBottleneck(pipe, key);
      store.simState.pipe = res.nextPipeline;
      store.simState.pipeLog = res.msg;
      save();
      render();
    });
  });

  // Programmer response buttons
  document.querySelectorAll('[data-prog-mode]').forEach(btn => {
    btn.addEventListener('click', () => {
      store.simState.programmerMode = btn.getAttribute('data-prog-mode');
      save();
      render();
    });
  });

  // Mother 2 choices
  document.querySelectorAll('[data-mother2]').forEach(btn => {
    btn.addEventListener('click', () => {
      store.simState.mother2Choice = btn.getAttribute('data-mother2');
      save();
      render();
    });
  });

  // Console choices
  document.querySelectorAll('[data-console]').forEach(btn => {
    btn.addEventListener('click', () => {
      store.simState.consoleStrategy = btn.getAttribute('data-console');
      save();
      render();
    });
  });

  // Notes and done buttons
  const sections = iwataChapters[store.currentChapter] || [];
  const curSec = sections[store.currentSection];

  const noteInput = document.querySelector('#section-note');
  noteInput?.addEventListener('input', e => {
    if (curSec) store.notes[curSec.id] = e.target.value;
    save();
  });

  document.querySelector('#btn-done')?.addEventListener('click', () => {
    if (curSec) {
      store.completed[curSec.id] = true;
      save();
      render();
    }
  });

  document.querySelector('#btn-next')?.addEventListener('click', () => {
    if (store.currentSection < sections.length - 1) {
      store.currentSection++;
      save();
      render();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });
}

function escapeHtml(text) {
  return String(text || '').replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[c]);
}

render();
