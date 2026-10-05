# 🏛️ 书中练习室 · Book to Play

<p align="left">
  <a href="https://murasaki-zero.github.io/book-to-play/"><img src="https://img.shields.io/badge/Live_Demo-GitHub_Pages-38bdf8?style=flat-square&logo=github" alt="Live Demo"></a>
  <img src="https://img.shields.io/badge/Architecture-100%25_Static_Offline-success?style=flat-square" alt="Offline Architecture">
  <img src="https://img.shields.io/badge/Tests-39%2F39_Passing-brightgreen?style=flat-square" alt="Tests">
  <img src="https://img.shields.io/badge/Node-18%2B-orange?style=flat-square" alt="Node Version">
  <img src="https://img.shields.io/badge/License-MIT-blue?style=flat-square" alt="License">
</p>

> **读书不只是翻页，更是一场亲手搭建的思维实验。**  
> 「书中练习室」是一个专注于将经典书籍（设计方法论、人物传记回忆录、文学社科巨著）深度转化为**可互动、可观察、可推演、可精读**的现代化本地/在线学习平台。

---

## 🌟 在线立即体验 (Live Demo)

全书库已完成离线单文件构建并上线 GitHub Pages，无需本地电脑开机，手机 / iPad / 电脑随时随地即开即用：

👉 **[https://murasaki-zero.github.io/book-to-play/](https://murasaki-zero.github.io/book-to-play/)**

---

## 📚 已收录与在研书籍矩阵

| 书籍类型 | 代表书目 | 章节进度 | 核心转化形态 | 入口状态 |
| :--- | :--- | :--- | :--- | :--- |
| **🎲 方法论与设计类** | 《游戏设计艺术（第 2 版）》<br>*(Jesse Schell)* | **全书 34 章完结**<br>(136 个学习单元) | 15 种数值/规则交互沙盒、112+ 设计透镜、课后实战设计提案、自评量表 | [进入练习室](https://murasaki-zero.github.io/book-to-play/chapter-one/dist/开始学习.html) |
| **📖 传记与回忆录** | 《岩田先生：任天堂传奇社长如是说》<br>*(HOBO日刊ITOI新闻)* | **全书 7 章完结**<br>(58 个精读小节) | 完整自然段长文精读、时代背景胶囊、历史关键抉择推演沙盒、幕后逸闻库 | [进入思辨室](https://murasaki-zero.github.io/book-to-play/book-iwata/dist/开始思辨.html) |
| **🏛️ 文学社科经典** | 《百年孤独》<br>*(加西亚·马尔克斯)* | **前 7 章精读就绪**<br>(306 段原味长文) | 时空地理坐标仓、现实历史与政治隐喻互文注脚、布恩迪亚家族世代谱系树、个人札记仓 | [进入精读室](https://murasaki-zero.github.io/book-to-play/book-solitude/dist/开始精读.html) |
| **🚀 规划中书目** | 《通关！游戏设计之道（第 2 版）》<br>《游戏设计的 236 个技巧》<br>《拉丁美洲被切开的血管》 | 待开工 | 关卡图纸沙盒 / 手感微调滑块 / 地缘政治矿产掠夺历史映射 | 本地原书已入库 |

---

## 🛠️ 三轨制作工作流体系 (Methodology)

针对不同类型的书籍知识结构，项目确立了三条严密的分轨制作流水线（详见规范文档）：

```
                     ┌── 1. 方法论类 (制作工作流.md) ────── 4 单元微课 + 参数化规则沙盒 + 透镜实战
                     │
本地书籍 (Book/ 目录) ─── 2. 传记访谈类 (传记类制作工作流.md) ── 自然段长文 + 时代胶囊 + 历史决断推演
                     │
                     └── 3. 文学社科类 (文学类制作工作流.md) ── 原味精读 + 时空坐标仓 + 隐喻互文 + 家族谱系树
```

### 1. 方法论类工作流（Methodology Playbook）
- **适用**：游戏设计、系统架构、交互设计等理论工具书；
- **机制**：每章严谨拆解为 4 单元结构化微课，围绕核心机制编写真实数值/状态机/算法沙盒，拒绝机械单选题。

### 2. 传记访谈类工作流（Biography & Memoir Playbook）
- **适用**：业界领袖传记、大师访谈、口述历史；
- **机制**：严格保留完整自然段落的长文沉浸感；在关键历史转折点挂载**双向情境决策推演沙盒**，复盘真实历史决断。

### 3. 文学社科类工作流（Literature & Humanities Playbook）
- **适用**：文学名著、魔幻现实主义经典、政治经济学社科巨著；
- **机制**：不设破坏文学审美的重度数值题目；提供**时空地理坐标仓**（交代殖民创伤与内战背景）、**行内现实隐喻与政治互文注脚卡**以及多代**复杂人物家族谱系交互树**。

---

## 💻 本地离线运行与局域网调试 (Local Quick Start)

本项目采用**纯原生静态架构**，无需 `npm install` 安装第三方黑盒依赖，直接克隆即开即用：

### 1. 克隆仓库
```sh
git clone https://github.com/murasaki-zero/book-to-play.git
cd book-to-play
```

### 2. 双击一键启动（双平台原生支持）
- **macOS 用户**：直接双击根目录下的 `启动练习室(局域网共享).command`
- **Windows 用户**：直接双击根目录下的 `启动练习室.bat`

### 3. 或使用命令行运行
```sh
npm run serve
```
启动后终端将输出本机地址与当前局域网地址：
- 🖥️ **电脑端访问**：`http://localhost:4173`
- 📱 **iPad / 手机同步调试**：`http://<局域网IP>:4173`（同一 Wi-Fi 下随时沉浸学习）

---

## 🏗️ 仓库工程架构 (Architecture)

```text
book-to-play/
├── index.html                   # 门户主页：跨书籍书架、局域网指示器与动态开工看板
├── 制作工作流.md                 # 方法论与理论类书籍制作标准规范
├── 传记类制作工作流.md           # 人物传记类情境推演制作标准规范
├── 文学类制作工作流.md           # 文学社科类时代映射精读制作标准规范
├── AGENTS.md                    # AI Pair Programming 行为准则与自动化规范
│
├── chapter-one/                 # 🎲《游戏设计艺术》主工程
│   ├── dist/
│   │   ├── 开始学习.html         # 单文件离线自包含主应用 (136 单元 + 15 种沙盒)
│   │   ├── bookshelf.html       # 模块化开发者书架视图
│   │   └── ...                  # 模块化源文件 (app.js, labs.js, workbook.js)
│   ├── scripts/serve.mjs        # 本地轻量原生 HTTP 服务 (支持 Book/ 动态扫描)
│   └── tests/                   # 26 项规则逻辑、存档迁移与完整性测试
│
├── book-iwata/                  # 📖《岩田先生》传记工程
│   ├── dist/
│   │   ├── 开始思辨.html         # 单文件离线自包含精读思辨室 (7 章全量)
│   │   └── ...                  # 时代胶囊、RPN堆栈、债务重组等历史沙盒
│   └── tests/                   # 9 项长文完备度与历史决策推演测试
│
└── book-solitude/               # 🏛️《百年孤独》文学社科工程
    ├── dist/
    │   ├── 开始精读.html         # 单文件离线自包含文学精读室 (前 7 章全量)
    │   ├── context.js           # 时代地理坐标仓与 18 条现实历史隐喻注脚库
    │   └── lineage.js           # 布恩迪亚家族世代谱系树交互组件
    └── tests/                   # 4 项文本完整性与谱系映射测试
```

---

## 🔒 隐私、安全与离线哲学 (Design Principles)

1. **零外部网络依赖（100% Offline-First）**：
   所有发布的 `开始*.html` 均为自包含离线单文件，没有任何外部 CDN 脚本或远程字体，哪怕在飞机上或没有网络的环境也能完整运行。
2. **个人学习数据绝对隐私**：
   学习者的个人笔记、实战设计草案、思辨抉择历史与复习曲线均保存在当前设备的浏览器 `localStorage` 中，支持本地导出 JSON / Markdown 留存，绝不上传云端。
3. **版权自律与本地依据**：
   本开源工程仅维护交互代码、教学逻辑、时空坐标与学术解读；未经授权的商业原版 PDF/EPUB 原始大文件严格由 `.gitignore` 排除在本地 `Book/` 目录中，不对外公开发布传播。

---

## 🧪 自动化测试套件

项目内置轻量严谨的 Node.js 原生测试套件，全面保障长文排版、沙盒算法与存档兼容性：

```sh
# 运行全部 39 项自动化回归测试
npm --prefix chapter-one run check && npm --prefix book-iwata run check && npm --prefix book-solitude run check
```

---

## 📄 开源许可证

本项目基于 [MIT License](LICENSE) 开源发布。欢迎 Fork 并为更多好书搭建专属练习室！
