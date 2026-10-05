/**
 * 《百年孤独》精读阅读器核心逻辑
 * 包含：自然段原味排版、时空坐标仓、行内现实隐喻卡展开、人物家族谱系悬浮树、字号缩放与个人扎记本地存储
 */
(function() {
  'use strict';

  const STORAGE_KEY = 'solitude_study_v1';
  let appState = {
    currentChapter: 1,
    fontSize: 18,
    activeCharacter: null,
    notes: {} // { chapterId: string }
  };

  function loadState() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        appState = Object.assign(appState, parsed);
      }
    } catch (e) {
      console.warn('读取本地存档失败:', e);
    }
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
    } catch (e) {
      console.warn('保存本地存档失败:', e);
    }
  }

  function renderChapterNav() {
    const navEl = document.getElementById('chapter-nav-list');
    if (!navEl || !window.SolitudeChapters) return;

    navEl.innerHTML = window.SolitudeChapters.map(ch => `
      <button class="nav-ch-btn ${ch.id === appState.currentChapter ? 'active' : ''}" data-chid="${ch.id}">
        <span class="ch-num">第 ${ch.id} 章</span>
        <span class="ch-name">${ch.title.split('：')[1] || ch.title}</span>
      </button>
    `).join('');

    navEl.querySelectorAll('.nav-ch-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = parseInt(btn.dataset.chid, 10);
        switchChapter(id);
      });
    });
  }

  function renderEraCapsule(chapterId) {
    const eraEl = document.getElementById('era-capsule-content');
    if (!eraEl || !window.SolitudeContext) return;

    const data = window.SolitudeContext.ERA_MATRIX[chapterId];
    if (!data) return;

    eraEl.innerHTML = `
      <div class="era-header">
        <div class="era-tag">🏛️ 时空坐标仓 · 历史经纬</div>
        <div class="era-scale">${data.timeScale}</div>
      </div>
      <div class="era-geo">📍 <strong>地理定位：</strong>${data.geographicCoordinates}</div>
      <div class="era-grid">
        <div class="era-box">
          <h4>📜 真实历史背景与哥伦比亚社会映射</h4>
          <p>${data.historicalBackdrop.content}</p>
        </div>
        <div class="era-box">
          <h4>✨ 魔幻现实主义笔法与叙事机制</h4>
          <p>${data.literaryDevice.content}</p>
        </div>
      </div>
    `;
  }

  function renderCharactersBar(chapterId) {
    const listEl = document.getElementById('character-chips-list');
    if (!listEl || !window.SolitudeLineage) return;

    const activeChars = window.SolitudeLineage.CHARACTERS.filter(c => c.chaptersActive.includes(chapterId));
    
    listEl.innerHTML = activeChars.map(c => `
      <div class="char-chip ${appState.activeCharacter === c.id ? 'active' : ''}" data-cid="${c.id}" title="点击查看人物档案与命运">
        <span class="char-name">${c.name}</span>
        <span class="char-badge">${c.badge}</span>
      </div>
    `).join('');

    listEl.querySelectorAll('.char-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const cid = chip.dataset.cid;
        showCharacterDetail(cid);
      });
    });
  }

  function showCharacterDetail(cid) {
    const char = window.SolitudeLineage.CHARACTERS.find(c => c.id === cid);
    if (!char) return;

    appState.activeCharacter = cid;
    const modal = document.getElementById('char-modal');
    const modalBody = document.getElementById('char-modal-body');
    if (!modal || !modalBody) return;

    modalBody.innerHTML = `
      <div class="modal-char-header">
        <div>
          <span class="status-pill">${char.role}</span>
          <h2 style="font-size:22px; margin-top:8px; color:var(--ink);">${char.name}</h2>
        </div>
        <span class="char-badge-lg">${char.badge}</span>
      </div>
      <div style="margin:16px 0; font-size:15px; line-height:1.75; color:var(--ink);">
        <strong>人物小传：</strong>${char.desc}
      </div>
      <div style="background:rgba(217,119,6,0.08); border-left:4px solid #d97706; padding:12px 16px; border-radius:0 8px 8px 0; font-size:14px; line-height:1.7; color:var(--ink);">
        <strong>命运伏笔与结局：</strong>${char.fate}
      </div>
    `;

    modal.classList.add('show');
  }

  function renderLineageDrawer() {
    const treeEl = document.getElementById('lineage-tree-container');
    if (!treeEl || !window.SolitudeLineage) return;

    const data = window.SolitudeLineage.LINEAGE_TREE.root.couples[0];
    treeEl.innerHTML = `
      <div class="tree-root-box">
        <div class="tree-couple">
          <strong>${data.male}</strong> ⚭ <strong>${data.female}</strong>
        </div>
        <div class="tree-note">${data.note}</div>
      </div>
      <div class="tree-branch-connector">▼ 第二代分支血脉 ▼</div>
      <div class="tree-children-grid">
        ${data.children.map(child => `
          <div class="tree-child-card">
            <h4 style="font-size:16px; color:var(--accent-purple); margin-bottom:6px;">${child.name}</h4>
            <div style="font-size:13px; color:var(--ink-dim); margin-bottom:6px;">配偶/情妇：${child.spouse}</div>
            <p style="font-size:13px; line-height:1.6; color:var(--ink);">${child.branchDesc}</p>
            <div style="margin-top:8px; font-size:12px; font-family:var(--font-mono); color:var(--ink-muted);">
              子嗣：${child.children.length ? child.children.join(', ') : '无后代'}
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  function renderParagraphs(chapter) {
    const container = document.getElementById('paragraphs-stream');
    if (!container) return;

    // 获取当前章节的注脚配置
    const chapterNotes = Object.entries(window.SolitudeContext.METAPHOR_NOTES)
      .filter(([key, note]) => note.chapterId === chapter.id);

    let html = '';
    chapter.paragraphs.forEach((pText, idx) => {
      let markedText = pText;

      // 匹配注入行内注脚微标
      chapterNotes.forEach(([noteKey, note]) => {
        // 查找短语或核心词
        const searchPattern = note.targetText.slice(0, 30);
        if (markedText.includes(searchPattern)) {
          const badgeHtml = `<span class="metaphor-badge" data-nkey="${noteKey}">[${note.typeLabel}：${note.title}]</span>`;
          markedText = markedText.replace(searchPattern, `${searchPattern} ${badgeHtml}`);
        }
      });

      html += `
        <div class="par-block" data-pindex="${idx}">
          <div class="par-num">§ ${idx + 1}</div>
          <p class="par-content" style="font-size: ${appState.fontSize}px;">${markedText}</p>
        </div>
      `;
    });

    container.innerHTML = html;

    // 绑定注脚点击
    container.querySelectorAll('.metaphor-badge').forEach(badge => {
      badge.addEventListener('click', (e) => {
        e.stopPropagation();
        const nkey = badge.dataset.nkey;
        showMetaphorCard(nkey);
      });
    });
  }

  function showMetaphorCard(nkey) {
    const note = window.SolitudeContext.METAPHOR_NOTES[nkey];
    if (!note) return;

    const modal = document.getElementById('metaphor-modal');
    const titleEl = document.getElementById('metaphor-modal-title');
    const contentEl = document.getElementById('metaphor-modal-body');
    if (!modal || !titleEl || !contentEl) return;

    titleEl.textContent = `${note.typeLabel} · ${note.title}`;
    contentEl.innerHTML = `
      <div style="background:rgba(168,85,247,0.08); border-left:4px solid var(--accent-purple); padding:10px 14px; border-radius:4px; font-size:14px; margin-bottom:14px; color:var(--ink-dim); font-style:italic;">
        “${note.targetText.slice(0, 100)}${note.targetText.length > 100 ? '...' : ''}”
      </div>
      <div style="font-size:15px; line-height:1.8; color:var(--ink);">
        ${note.detail}
      </div>
    `;

    modal.classList.add('show');
  }

  function renderReflectionNote(chapterId) {
    const noteArea = document.getElementById('chapter-reflection-input');
    const statusEl = document.getElementById('reflection-save-status');
    if (!noteArea) return;

    noteArea.value = appState.notes[chapterId] || '';
    if (statusEl) statusEl.textContent = appState.notes[chapterId] ? '已保存于本地' : '尚未撰写札记';

    noteArea.oninput = () => {
      appState.notes[chapterId] = noteArea.value;
      saveState();
      if (statusEl) statusEl.textContent = '已保存于本地';
    };
  }

  function switchChapter(chapterId) {
    const chapter = window.SolitudeChapters.find(c => c.id === chapterId);
    if (!chapter) return;

    appState.currentChapter = chapterId;
    saveState();

    document.getElementById('current-chapter-title').textContent = chapter.title;
    document.getElementById('current-chapter-meta').textContent = `全节完整收录 ${chapter.paragraph_count} 个自然段 · ${chapter.era}`;

    renderChapterNav();
    renderEraCapsule(chapterId);
    renderCharactersBar(chapterId);
    renderParagraphs(chapter);
    renderReflectionNote(chapterId);

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function initUI() {
    loadState();

    // 主题切换（浅色/深色）
    const themeBtn = document.getElementById('btn-theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const themeText = document.getElementById('theme-text');

    function applyTheme(theme) {
      document.documentElement.setAttribute('data-theme', theme);
      appState.theme = theme;
      saveState();
      if (themeIcon && themeText) {
        if (theme === 'light') {
          themeIcon.textContent = '🌙';
          themeText.textContent = '深色';
        } else {
          themeIcon.textContent = '☀️';
          themeText.textContent = '浅色';
        }
      }
    }

    const currentTheme = appState.theme || (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
    applyTheme(currentTheme);

    if (themeBtn) {
      themeBtn.onclick = () => {
        const next = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
        applyTheme(next);
      };
    }

    // 字体缩放
    const incBtn = document.getElementById('btn-font-plus');
    const decBtn = document.getElementById('btn-font-minus');
    if (incBtn && decBtn) {
      incBtn.onclick = () => {
        if (appState.fontSize < 24) {
          appState.fontSize += 1;
          saveState();
          document.querySelectorAll('.par-content').forEach(p => p.style.fontSize = `${appState.fontSize}px`);
        }
      };
      decBtn.onclick = () => {
        if (appState.fontSize > 15) {
          appState.fontSize -= 1;
          saveState();
          document.querySelectorAll('.par-content').forEach(p => p.style.fontSize = `${appState.fontSize}px`);
        }
      };
    }

    // 谱系树抽屉控制
    const drawer = document.getElementById('lineage-drawer');
    const btnOpenTree = document.getElementById('btn-open-lineage');
    const btnCloseTree = document.getElementById('btn-close-lineage');
    if (drawer && btnOpenTree && btnCloseTree) {
      btnOpenTree.onclick = () => {
        renderLineageDrawer();
        drawer.classList.add('open');
      };
      btnCloseTree.onclick = () => {
        drawer.classList.remove('open');
      };
    }

    // 弹窗关闭监听
    document.querySelectorAll('.modal-close, .modal-backdrop').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('show'));
      });
    });

    // 初始渲染第一章
    switchChapter(appState.currentChapter);
  }

  // 挂载启动
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initUI);
  } else {
    initUI();
  }

})();
