// Detailed simulation models and feedback for Iwata reader across all 7 chapters

export function rpnCalc(stack, op) {
  const s = [...(stack || [])];
  if (typeof op === 'number') {
    s.push(op);
    return { stack: s, msg: `将数值 [${op}] 压入计算栈顶` };
  }
  if (['+', '-', '*', '/'].includes(op)) {
    if (s.length < 2) return { stack: s, error: '栈内至少需要两个数值才能执行运算' };
    const b = s.pop();
    const a = s.pop();
    let res = 0;
    if (op === '+') res = a + b;
    else if (op === '-') res = a - b;
    else if (op === '*') res = a * b;
    else if (op === '/') res = b !== 0 ? Math.round((a / b) * 100) / 100 : 0;
    s.push(res);
    return { stack: s, msg: `出栈运算：${a} ${op} ${b} = ${res}，结果已重新入栈` };
  }
  if (op === 'clear') return { stack: [], msg: '计算栈已重置' };
  return { stack: s, error: '未知指令' };
}

export function evalDebtRestructure(alloc) {
  const salary = Number(alloc.salary || 0);
  const debt = Number(alloc.debt || 0);
  const rd = Number(alloc.rd || 0);
  const total = salary + debt + rd;

  let salaryStatus = {};
  if (salary < 30) {
    salaryStatus = {
      level: "danger",
      title: "【人员动荡】薪资削减幅度过大",
      desc: "一线核心程序员与美术面临生活压力，离职信接踵而至。HAL 研究所仅存的开发火种即将熄灭，人心涣散，任何重组计划都失去执行者。"
    };
  } else if (salary < 38) {
    salaryStatus = {
      level: "warning",
      title: "【情绪紧绷】勉强维持生计",
      desc: "团队虽未大面积流失，但普遍心怀顾虑与不安，大家每天都在担忧公司下个月能否按时发薪，开发效率下滑约 25%。"
    };
  } else if (salary <= 52) {
    salaryStatus = {
      level: "good",
      title: "【军心稳定】岩田社长全额保障薪酬",
      desc: "正如岩田聪当年所做的那样：‘困难时刻更要善待员工’。所有人领到足额薪水，放下生计焦虑，全力投入重组拼搏，凝聚力空前高涨。"
    };
  } else {
    salaryStatus = {
      level: "warning",
      title: "【支出过重】日常薪酬占比过高",
      desc: "在公司负债 15 亿的极限状态下，人工开支未做精益控制，严重挤压了每年的硬性还款现金流。"
    };
  }

  let debtStatus = {};
  if (debt < 25) {
    debtStatus = {
      level: "danger",
      title: "【清算危机】还款过慢激怒债权方",
      desc: "每年还款额远低于银行与债权人底线（原本需每年还清约2.5亿）。银行下达最后通牒，随时可能冻结公司账户并强制破产拍卖。"
    };
  } else if (debt < 33) {
    debtStatus = {
      level: "warning",
      title: "【周期拉长】还款进度缓慢",
      desc: "利息持续侵蚀利润，预计需要超过 10 年才能走出债务阴影，长期处于信用受限的脆弱境地。"
    };
  } else if (debt <= 48) {
    debtStatus = {
      level: "good",
      title: "【稳健履约】六年还清 15 亿日元",
      desc: "每年坚实偿还 2.5 亿日元本金。债权人建立信任，社会信誉逐步修复，为 HAL 研究所赢得了宝贵的商业信誉。"
    };
  } else {
    debtStatus = {
      level: "danger",
      title: "【现金断裂】偿债过于激进",
      desc: "每月利润几乎全部抽调还债，一旦遭遇一两个月的版税结算延期，公司就会因周转不灵而瞬间休克。"
    };
  }

  let rdStatus = {};
  if (rd < 12) {
    rdStatus = {
      level: "danger",
      title: "【丧失未来】没有试错与新作预研",
      desc: "只顾埋头还债，断绝了所有原型试验与新工具开发。几年后即使还清债务，也会因为没有受市场欢迎的原创爆款而再次掉入深渊。"
    };
  } else if (rd <= 30) {
    rdStatus = {
      level: "good",
      title: "【火种长存】保留原创技术与原型实验",
      desc: "维持了精干的实验预算。正是在这一阶段，团队积累了《星之卡比》等核心资产与极速试错能力，为任天堂时代的腾飞奠定了技术地基。"
    };
  } else {
    rdStatus = {
      level: "warning",
      title: "【盲目铺张】研发摊子铺得太大",
      desc: "在危机时刻同时立项过多高风险未经验证的新项目，资金回笼周期过长，与危机重组阶段的目标相悖。"
    };
  }

  const isBalanced = salary >= 38 && salary <= 52 && debt >= 33 && debt <= 48 && rd >= 12 && rd <= 30;

  return {
    total,
    isBalanced,
    salaryStatus,
    debtStatus,
    rdStatus,
    summary: isBalanced 
      ? "★ 达成岩田聪当年力挽狂澜的‘黄金均衡’：员工保障 + 稳健还债 + 未来火种兼备！"
      : total !== 100 
        ? `⚠️ 预算总和为 ${total}%（需调至 100% 以模拟真实资金分配）`
        : "⚠️ 当前策略存在重大失衡短板，请观察上方三维状态做进一步调优。"
  };
}

export function evalBottleneck(pipeline, action) {
  const keys = Object.keys(pipeline);
  const maxKey = keys.reduce((a, b) => pipeline[a] > pipeline[b] ? a : b);
  
  if (action === maxKey) {
    return {
      success: true,
      msg: `✓ 准确定位瓶颈环节 [${action === 'logic' ? '核心逻辑' : action}]！正如岩田社长所言，疏通最狭窄之处后，全产线积压瞬间化解。`,
      nextPipeline: { ...pipeline, [action]: Math.max(3, pipeline[action] - 6) }
    };
  } else {
    return {
      success: false,
      msg: `⚠️ 盲目优化 [${action === 'concept' ? '策划案' : action}] 无法提升流速！它不是当前的阻塞瓶颈，再怎么拓宽也不会改变全局吞吐量。`,
      nextPipeline: pipeline
    };
  }
}

// Chapter 3: "程序员不能说不" 的真正含义
export function evalProgrammerResponse(mode) {
  if (mode === 'reject') {
    return {
      title: "【直接说不】引发对立与创意思维阻断",
      feedback: "‘这个在技术上不可能做出来。’策划听到后备受打击，认为技术团队顽固封闭；双方陷入对立扯皮，原本闪光的创意胎死腹中。",
      isIwataWay: false
    };
  } else if (mode === 'blind-agree') {
    return {
      title: "【盲目应承】代码架构雪崩与无限期延宕",
      feedback: "‘没问题，我硬写！’程序员在已有脆弱底层上疯狂打补丁，最终导致内存溢出、Bug连连，项目延宕数月无法收尾。",
      isIwataWay: false
    };
  } else {
    return {
      title: "【岩田式应对】重构边界条件，探寻真实目标",
      feedback: "‘如果按照现有的实现方式确实会崩溃；但如果你真正想要达到的游戏效果是A，那么只要我们把数据结构做成B，不仅完全可行，还能在这个月内完成！’——这就是‘程序员不能说不’的真谛！",
      isIwataWay: true
    };
  }
}

// Chapter 4: 重做《地球冒险2》的两个方法
export function evalMother2Choice(choice) {
  if (choice === 'patch') {
    return {
      time: "2 年以上（且不可预测）",
      risk: "极高 · 代码盘根错节",
      morale: "全员精疲力竭，士气崩溃",
      result: "顺着已有代码修补，每天都在解决旧代码连带出的新灾难。工期越拖越长，糸井重里团队深陷绝望。",
      isHistorical: false
    };
  } else {
    return {
      time: "恰好半年（100% 按期交付）",
      risk: "可控 · 结构彻底透明化",
      morale: "轻装上阵，效率爆发式提升",
      result: "岩田聪名言：‘如果顺着现状改，需要2年而且不知道能不能成；如果让我从头重写，半年保证交货。’——岩田聪亲赴现场重写底层，不仅半年交货，还创造了任天堂RPG传奇！",
      isHistorical: true
    };
  }
}

// Chapter 5: 站在延长线上的可怕性（异质主机决策）
export function evalConsoleStrategy(strategy) {
  if (strategy === 'spec-war') {
    return {
      cost: "开发成本暴涨 400%",
      market: "用户圈层收窄至少数硬核发烧友",
      feedback: "陷入性能军备竞赛。画质越来越逼真，游戏越来越复杂昂贵，但轻度玩家望而生畏，全行业面临‘游戏疲劳’导致的衰退陷阱（Gamecube时期的深刻教训）。",
      isBlueOcean: false
    };
  } else {
    return {
      cost: "成熟技术、成本可控且极易上手",
      market: "母亲、老人、儿童全家人成为新玩家",
      feedback: "打破既有延长线！开创 NDS 双屏触控与 Wii 体感遥控器蓝海，一举将全球非玩家转化为游戏人口，带领任天堂迎来空前历史巅峰！",
      isBlueOcean: true
    };
  }
}
