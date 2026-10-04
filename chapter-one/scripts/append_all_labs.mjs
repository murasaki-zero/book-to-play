// Historical generator: retained for audit only.
throw new Error("历史批量生成脚本已停用：它会覆盖已修复课程。请编辑 dist/course.js / dist/studio.js，参见根目录制作工作流.md。");
import fs from 'fs';

let labsCode = fs.readFileSync('dist/labs.js', 'utf8');

// We have 40 new lab widgets for Ch 7 - 16:
// Ch 7: inspiration, problemStatement, brainstorm, ideaFilter
// Ch 8: eightFilters, loop, riskMatrix, toyPassion
// Ch 9: playerProfile, lazzaroFun, bartleTypes, empathyLab
// Ch 10: flowChannel, cognitiveLoad, mentalModel, flowDDA
// Ch 11: sdtNeeds, intrinsicVsExtrinsic, noveltyLens, judgmentFairness
// Ch 12: spaceTimeState, secretsEmergence, actionsRulesGoals, skillProbability
// Ch 13: dominantStrategies, triangleMethod, feedbackLoops, economyFaucets
// Ch 14: ahaMoment, accessibilityProgress, pyramidPuzzles, puzzlePrinciples
// Ch 15: interfaceTransparency, juicinessLab, primitiveChannels, modesConsistency
// Ch 16: interestCurveModel, inherentInterest, beautyClimax, projectionBlank

// Data constants
const advancedConstants = `
// Chapters 7 - 16 Data & Constants
export const inspirationSources = [
  { id: 'ballet', category: '艺术/舞蹈', title: '双螺旋芭蕾旋转', desc: '杂技演员在纽约观看芭蕾舞时悟出的手臂与步伐旋转节奏。', elem: '美学与机制节奏' },
  { id: 'swans', category: '自然/动物', title: '缅因州天鹅起飞', desc: '观察天鹅群掠过湖面展翅的空气动力学与群体起伏。', elem: '动效与群体行为' },
  { id: 'puncher', category: '工业/机械', title: '长岛纸带打孔机', desc: '老式计算机打孔机的卡顿、敲击与定格机械进给步幅。', elem: '离散步进机制' },
  { id: 'tango', category: '音乐/听觉', title: '皮亚佐拉《热情探戈》', desc: '听探戈乐曲脑海中浮现落日余晖中居民搬家具筑高塔（《粘粘之塔》）。', elem: '共鸣核心意象' }
];

export const problemCasePool = [
  { id: 0, text: '我怎样制作一个利用磁铁特性的有趣的桌面游戏？', constrained: ['技术', '机制'], free: ['故事', '美学'], answer: '约束了物理技术媒介（磁铁）与交互机制，故事与美学完全自由。' },
  { id: 1, text: '我怎样制作一个能够讲述奇幻森林历险记的电子游戏？', constrained: ['故事', '技术'], free: ['机制', '美学'], answer: '约束了故事题材（奇幻森林历险）与数字媒介（电子游戏），核心玩法与画风自由。' },
  { id: 2, text: '我怎样制作一个感觉像超现实主义绘画的游戏？', constrained: ['美学'], free: ['机制', '故事', '技术'], answer: '强力约束了美学风格（达利式超现实绘画），玩法、媒介与剧情自由。' },
  { id: 3, text: '我怎样改进俄罗斯方块？', constrained: ['机制', '技术'], free: ['故事', '美学'], answer: '深度约束了底层核心消除机制与空间规则，允许引入叙事包装或全新美学。' }
];

export const brainstormCategories = {
  mechanics: ['重力倒转', '磁力吸斥', '限时建造', '隐身潜行', '回声定位', '盲盒抽卡'],
  story: ['赛博修真', '深海灯塔', '猫咪法庭', '末日邮差', '时间当铺', '星际植物园'],
  aesthetics: ['像素水彩', '低模折纸', '赛博霓虹', '炭笔素描', '蒸汽黄铜', '黏土定格'],
  technology: ['单键操作', '语音声控', '重力感应', '双人同屏', '实体纸牌', '眼动追踪']
};

export const filterIdeaPool = [
  { id: 0, title: '磁力积木高塔防御', fit: 85, origin: '机制+技术', desc: '利用物理磁力搭积木抵御波次怪物，直观且具有玩具乐趣。' },
  { id: 1, title: '水彩画风时间倒流解谜', fit: 90, origin: '美学+机制', desc: '在动态水彩画布中倒流笔触改变因果，情感张力极强。' },
  { id: 2, title: '万物皆可消除的元宇宙MMO', fit: 25, origin: '膨胀点子', desc: '既要三消又要开放世界万人在线，工程无法交付，问题陈述模糊。' },
  { id: 3, title: '仅凭脚步声辨位的纯黑盲人求生', fit: 80, origin: '颠覆假设', desc: '颠覆玩家看着屏幕玩的假定，高沉浸度且工程成本可控。' }
];

export const eightFiltersList = [
  { id: 'artistic', name: '1. 艺术冲动', desc: '作为设计师，你对这个游戏是否有极好的主观直觉？' },
  { id: 'demographics', name: '2. 人群特征', desc: '目标玩家是谁？受众群体是否真会喜欢它？' },
  { id: 'experience', name: '3. 体验设计', desc: '美学、兴趣曲线、共鸣主题与平衡是否协调？' },
  { id: 'innovation', name: '4. 革新突破', desc: '是否有独特的亮点或前所未有的新颖元素？' },
  { id: 'business', name: '5. 商业与市场', desc: '能卖得出去吗？商业模式与成本能否打平？' },
  { id: 'engineering', name: '6. 工程实现', desc: '团队现有的技术和工期能否切实做出来？' },
  { id: 'community', name: '7. 社交/社区', desc: '能引发玩家间的讨论、分享或同乐竞技吗？' },
  { id: 'playtesting', name: '8. 玩法测试', desc: '玩家实际试玩时是否真的享受并感到快乐？（核心）' }
];

export const riskCaseList = [
  { id: 'core_fun', title: '核心机制可能枯燥（设计风险）', bestProto: '纸上原型或极简白模', why: '不需要画任何美术，用硬纸板 1 小时即可验证规则是否有乐趣。' },
  { id: 'perf_scale', title: '千人同屏物理同步崩溃（技术风险）', bestProto: '纯技术压力探针（无玩法）', why: '写一个只有方块碰撞的控制台脚本，测试帧率上限，消除算力疑问。' },
  { id: 'player_churn', title: '玩家不理解开局指引（体验风险）', bestProto: '旁观可用性测试灰模', why: '让一个从未玩过的新人看着草图界面，不发一言记录他在哪里卡住。' }
];
`;

// Helper builders for generic interactive boards
const newBoardFunctions = `
function inspirationBoard(u, a, r) {
  const chosen = a.sourceId || 'ballet', item = inspirationSources.find(s => s.id === chosen) || inspirationSources[0];
  const days = Number.isInteger(a.incubationDays) ? a.incubationDays : 3;
  return '<div class="lab-controls">' +
    inspirationSources.map(s => labButton(s.title, 'inspire-pick', s.id, chosen === s.id ? 'class="button primary active"' : '')).join('') +
  '</div><div class="hologram-layout"><div class="holo-card"><span class="eyebrow">' +
  labEscape(item.category) + ' · 跨界灵感源</span><h4>' + labEscape(item.title) + '</h4><p>' + labEscape(item.desc) + '</p><div class="stat-pair"><span>转化游戏维度<strong>' +
  labEscape(item.elem) + '</strong></span><span>潜意识发酵周期<strong>' + days + ' 天</strong></span></div><div class="lab-controls" style="margin-top:12px;">' +
  labButton('减少发酵天数 (-1)', 'inspire-days', '-1') + labButton('增加发酵天数 (+1)', 'inspire-days', '1') + labButton('完成发酵调配并记录', 'inspire-record') +
  '</div></div><aside class="lab-aside"><span class="eyebrow">透镜 #13 无尽灵感</span><h4>潜意识发酵法则</h4><p>给潜意识喂饱非游戏的生活原材料，然后停止焦虑，给它充分的静默时间。灵感常常在洗澡、散步或小憩时突然涌现。</p></aside></div>' + runList(a);
}

function problemStatementBoard(u, a, r) {
  const curIdx = Number(a.caseIdx ?? 0), cur = problemCasePool[curIdx] || problemCasePool[0];
  return '<div class="lab-controls">' +
    problemCasePool.map((c, i) => labButton('案例 ' + (i+1), 'problem-case', i, curIdx === i ? 'class="button primary active"' : '')).join('') +
  '</div><div class="diagnostic-layout"><div class="diag-card"><span class="eyebrow">透镜 #14 问题陈述分析</span><h4>“' +
  labEscape(cur.text) + '”</h4><p><strong>已施加硬性约束：</strong>' + labEscape(cur.constrained.join('、')) + '</p><p><strong>保留自由空间：</strong>' +
  labEscape(cur.free.join('、')) + '</p><div class="feedback">' + labEscape(cur.answer) + '</div><div class="lab-controls" style="margin-top:12px;">' +
  labButton('记录本项问题陈述分析', 'problem-record') + '</div></div><aside class="lab-aside"><span class="eyebrow">四维度检验</span><h4>无约束即是灾难</h4><p>一个好的问题陈述界定了边界。如果什么都想做，团队就会陷入方向分歧。通过约束关键元素，给创意筑造支点。</p></aside></div>' + runList(a);
}

function brainstormBoard(u, a, r) {
  const m = a.bs_m || brainstormCategories.mechanics[0], s = a.bs_s || brainstormCategories.story[0], ae = a.bs_ae || brainstormCategories.aesthetics[0], t = a.bs_t || brainstormCategories.technology[0];
  return '<div class="tetrad-layout"><div class="tetrad-panel"><span class="eyebrow">四元素分类灵感池（建议 14）</span><div class="stat-pair"><span>机制 <strong>' +
  labEscape(m) + '</strong></span><span>故事 <strong>' + labEscape(s) + '</strong></span></div><div class="stat-pair" style="margin-top:8px;"><span>美学 <strong>' +
  labEscape(ae) + '</strong></span><span>技术 <strong>' + labEscape(t) + '</strong></span></div><div class="lab-controls" style="margin-top:16px;">' +
  labButton('换个机制', 'bs-roll', 'm') + labButton('换个故事', 'bs-roll', 's') + labButton('换个美学', 'bs-roll', 'ae') + labButton('换个技术', 'bs-roll', 't') + labButton('随机四元素全混搭', 'bs-roll', 'all') + labButton('记录当前混合创意', 'bs-record') +
  '</div></div><aside class="lab-aside"><span class="eyebrow">头脑风暴建议 11 & 13</span><h4>写下所有愚蠢点子并颠覆假设</h4><p>不要害怕看似荒诞的搭配。真正的突破往往发生于打破常规的四元素交叉口。</p></aside></div>' + runList(a);
}

function ideaFilterBoard(u, a, r) {
  const chosenId = Number(a.filterChosen ?? 0), cur = filterIdeaPool.find(x => x.id === chosenId) || filterIdeaPool[0];
  return '<div class="lab-controls">' +
    filterIdeaPool.map(c => labButton(c.title, 'filter-pick', c.id, chosenId === c.id ? 'class="button primary active"' : '')).join('') +
  '</div><div class="diagnostic-layout"><div class="diag-card"><span class="eyebrow">创意收敛漏斗</span><h4>' +
  labEscape(cur.title) + '</h4><p>' + labEscape(cur.desc) + '</p><div class="stat-pair"><span>创意来源<strong>' + labEscape(cur.origin) + '</strong></span><span>综合可行性与聚焦度<strong>' +
  cur.fit + '%</strong></span></div><div class="lab-controls" style="margin-top:12px;">' +
  labButton(cur.fit >= 70 ? '入选核心方案库' : '果断淘汰丢弃', 'filter-eval') + '</div></div><aside class="lab-aside"><span class="eyebrow">专业能力是懂得删减</span><h4>不要留恋点子</h4><p>初学者容易爱上自己的第一个点子。唯有用严苛的标准进行漏斗收敛，才能让真正具备生命力的创意进入制作阶段。</p></aside></div>' + runList(a);
}

function eightFiltersBoard(u, a, r) {
  const scores = a.filterScores || { artistic: 8, demographics: 6, experience: 8, innovation: 7, business: 5, engineering: 6, community: 5, playtesting: 8 };
  const curKey = a.activeFilterKey || 'artistic', cur = eightFiltersList.find(f => f.id === curKey) || eightFiltersList[0];
  return '<div class="lab-controls">' +
    eightFiltersList.map(f => labButton(f.name.slice(3), 'eight-select', f.id, curKey === f.id ? 'class="button primary active"' : '')).join('') +
  '</div><div class="diagnostic-layout"><div class="diag-card"><span class="eyebrow">透镜 #15 八项测试维度</span><h4>' +
  labEscape(cur.name) + '</h4><p>' + labEscape(cur.desc) + '</p><div class="stat-pair"><span>当前健壮度评分<strong>' + (scores[cur.id] ?? 7) +
  ' / 10</strong></span><span>状态<strong>' + ((scores[cur.id] ?? 7) >= 6 ? '基本通过' : '高危短板！') + '</strong></span></div><div class="lab-controls" style="margin-top:12px;">' +
  labButton('降低评分 (-1)', 'eight-adjust', '-1') + labButton('提升评分 (+1)', 'eight-adjust', '1') + labButton('记录八项测试总诊断', 'eight-record') +
  '</div></div><aside class="lab-aside"><span class="eyebrow">全面审视框架</span><h4>修改方案还是修改测试？</h4><p>如果一项测试不通过，要么调整你的游戏设计，要么重新校准你的测试目标。</p></aside></div>' + runList(a);
}

function loopBoard(u, a, r) {
  const sprintWeeks = Number(a.sprintWeeks ?? 2), count = Math.floor(48 / sprintWeeks), waterfall = sprintWeeks >= 12;
  return '<div class="route-preview"><div class="route-header"><span>迭代循环模拟（12 个月项目周期）</span><strong>' +
  count + ' 次迭代循环</strong></div><div class="stat-pair" style="margin:16px 0;"><span>单个冲刺周期<strong>' + sprintWeeks +
  ' 周</strong></span><span>开发模式<strong>' + (waterfall ? '瀑布大泥球（危险）' : '敏捷高频迭代') + '</strong></span></div><p>' +
  (waterfall ? '周期过长导致玩法测试大幅滞后，无法在预算内暴露核心风险！' : '高频短冲刺：每个循环都产出可玩原型并进行真实测试，风险及早释放。') +
  '</p><div class="lab-controls">' + labButton('压缩冲刺 (1 周)', 'loop-set', '1') + labButton('标准双周 (2 周)', 'loop-set', '2') + labButton('月度冲刺 (4 周)', 'loop-set', '4') + labButton('瀑布交付 (12 周)', 'loop-set', '12') + labButton('保存并记录迭代策略', 'loop-record') +
  '</div></div>' + runList(a);
}

function riskMatrixBoard(u, a, r) {
  const curIdx = Number(a.riskIdx ?? 0), cur = riskCaseList[curIdx] || riskCaseList[0];
  return '<div class="lab-controls">' +
    riskCaseList.map((c, i) => labButton('风险 ' + (i+1), 'risk-case', i, curIdx === i ? 'class="button primary active"' : '')).join('') +
  '</div><div class="diagnostic-layout"><div class="diag-card"><span class="eyebrow">透镜 #16 风险消除矩阵</span><h4>' +
  labEscape(cur.title) + '</h4><p><strong>最轻量原型形态：</strong>' + labEscape(cur.bestProto) + '</p><div class="feedback">' +
  labEscape(cur.why) + '</div><div class="lab-controls" style="margin-top:12px;">' +
  labButton('建立此风险的原型计划并记录', 'risk-record') + '</div></div><aside class="lab-aside"><span class="eyebrow">原型技巧：忘记质量</span><h4>越粗糙越敢改</h4><p>精致的美术会让测试者不敢提批评意见。用硬纸板和白模，越快推翻错误假设越好。</p></aside></div>' + runList(a);
}

function toyPassionBoard(u, a, r) {
  const toyFun = Boolean(a.toyFun ?? true), p = Number(a.passionScore ?? 9);
  return '<div class="route-preview"><div class="route-header"><span>透镜 #17“玩具”与 #18“激情”自检</span><strong>激情指数 ' +
  p + ' / 10</strong></div><div class="stat-pair" style="margin:16px 0;"><span>底层交互玩具属性<strong>' + (toyFun ? '独立操作本身就很上瘾' : '没有目标规则时枯燥无味') +
  '</strong></span><span>冲刺末期健康度<strong>' + (p >= 7 ? '激情充沛，火花旺盛' : '警报！激情消退，存在深层死局') + '</strong></span></div><div class="lab-controls">' +
  labButton(toyFun ? '玩具状态：操作本身即好玩' : '玩具状态：依赖外部目标刺激', 'toy-toggle') + labButton('激情检验 (-1)', 'passion-adjust', '-1') + labButton('激情检验 (+1)', 'passion-adjust', '1') + labButton('记录玩具与激情诊断', 'passion-record') +
  '</div></div>' + runList(a);
}

// Universal Generic Interactive Board for Chapters 9 - 16
export function genericLabBoard(u, a, r) {
  const type = u.activity.type;
  const val = Number.isInteger(a.sliderVal) ? a.sliderVal : 5;
  const activeOpt = a.activeOption ?? 0;
  const config = {
    playerProfile: { title: '透镜 #19 玩家画像透视台', opts: ['硬核竞技', '休闲放松', '故事沉浸', '社交聚会'], label: '操作复杂度承受力', metric: '认知门槛' },
    lazzaroFun: { title: '拉扎罗四种乐趣坐标系', opts: ['困难乐趣 (挑战)', '简单乐趣 (好奇)', '旁人乐趣 (社交)', '深层乐趣 (意义)'], label: '核心乐趣比重', metric: '乐趣聚焦度' },
    bartleTypes: { title: '巴特尔玩家生态天平', opts: ['成就者 (点数)', '探索者 (秘密)', '社交者 (陪伴)', '杀手 (支配)'], label: '群体激励权重', metric: '生态平衡度' },
    empathyLab: { title: '透镜 #20 移情与反偏见工坊', opts: ['新手 30 秒卡住', '复杂的双键组合', '未提示的致命陷阱'], label: '同理心重构深度', metric: '挫败规避率' },
    flowChannel: { title: '透镜 #21 心流通道动态控制器', opts: ['挑战过高 (焦虑区)', '恰如其分 (心流带)', '技能过高 (无聊区)'], label: '动态难度弹性', metric: '心流沉浸值' },
    cognitiveLoad: { title: '注意力与工作记忆调度台', opts: ['极简 3 项并发', '中等 5 项并发', '超载 8 项并发 (红区)'], label: '界面信息分流度', metric: '记忆负荷率' },
    mentalModel: { title: '心智模型直觉测试台', opts: ['物理惯性隐喻', '现实色彩直觉', '反常识自定义规则'], label: '直觉隐喻贴合度', metric: '理解耗时' },
    flowDDA: { title: '张弛起伏波形节拍器', opts: ['紧绷战斗 (波峰)', '安全整备 (波谷)', '终局决战 (大波峰)'], label: '呼吸节律深度', metric: '疲劳对冲度' },
    sdtNeeds: { title: '透镜 #22 自我决定论三支柱', opts: ['胜任感 (精通技术)', '自主感 (自由选择)', '归属感 (人际纽带)'], label: '内在需求支撑力', metric: '自驱稳固度' },
    intrinsicVsExtrinsic: { title: '透镜 #23 动机天平与德西效应', opts: ['纯内在探索', '外在数值积分打卡', '混合协同激励'], label: '玩法本质乐趣比重', metric: '抗疲劳系数' },
    noveltyLens: { title: '透镜 #24 创新驱动节拍器', opts: ['80% 熟悉 + 20% 新奇', '过度保守毫无新意', '全新陌生产生排斥'], label: '机制迭代频率', metric: '新奇刺激度' },
    judgmentFairness: { title: '透镜 #25 客观评断与结算工坊', opts: ['公开透明战绩雷达', '暗箱扣分机制', '纯运气结算'], label: '能力归因纯度', metric: '胜利荣耀感' },
    spaceTimeState: { title: '透镜 #26-28 状态机逻辑流转台', opts: ['巡逻态', '警戒态', '交战追击态', '脱战归位态'], label: '状态转移严谨度', metric: '逻辑自洽率' },
    secretsEmergence: { title: '透镜 #29-30 秘密与涌现沙盒', opts: ['非完全信息迷雾', '3 条极简物理规则', '复杂预制脚本'], label: '涌现策略空间', metric: '突现多变性' },
    actionsRulesGoals: { title: '透镜 #31-33 核心动词与目标三角', opts: ['核心动词：跳跃', '核心动词：交易', '核心动词：欺瞒'], label: '动词纯粹性', metric: '目标聚焦度' },
    skillProbability: { title: '透镜 #34-36 概率方差与期望值计算', opts: ['纯技巧无随机', '适度方差 (EV 均衡)', '纯运气体感'], label: '数学期望掌控度', metric: '策略深层度' },
    dominantStrategies: { title: '透镜 #37 & 39 主导策略粉碎机', opts: ['克制剪刀', '克制石头', '克制布'], label: '克制链闭环度', metric: '无主导策略率' },
    triangleMethod: { title: '透镜 #40 风险收益三角形', opts: ['低风险稳妥型', '中风险均衡型', '孤注一掷高爆发'], label: '风险收益对冲比', metric: '博弈张力' },
    feedbackLoops: { title: '透镜 #43-47 正负反馈调谐台', opts: ['适度负反馈 (保持悬念)', '极端滚雪球 (快速决胜)', '纯静态无反馈'], label: '落后追赶补偿力', metric: '终局悬念度' },
    economyFaucets: { title: '透镜 #52-53 水龙头与下水道天平', opts: ['产出 = 消耗 (稳态)', '水龙头过大 (通胀)', '下水道过猛 (通缩)'], label: '货币沉淀调控力', metric: '通胀安全指数' },
    ahaMoment: { title: '透镜 #58 谜题顿悟 (Aha!) 触发器', opts: ['假定 A (盲区阻滞)', '假定 B (视角翻转)', '顿悟突破 (结构洞见)'], label: '反直觉认知差', metric: '顿悟快感值' },
    accessibilityProgress: { title: '透镜 #54-55 可达性与可见阶段反馈', opts: ['首步着手点显而易见', '阶段性机关咔嗒声', '完全无提示黑箱'], label: '阶段反馈清晰度', metric: '坚持耐受力' },
    pyramidPuzzles: { title: '透镜 #56-57 平行解谜与金字塔拓扑', opts: ['平行支线 A', '平行支线 B', '汇聚主谜题顶峰'], label: '分支非线性度', metric: '抗卡关韧性' },
    puzzlePrinciples: { title: '透镜 #58 谜题十原则健康度体检', opts: ['玩具化体感', '杜绝暴力穷举', '极尽优雅'], label: '原则合规率', metric: '优雅指数' },
    interfaceTransparency: { title: '透镜 #59 & 62 控制透明与隐形界面', opts: ['直觉零延迟体感', '多层嵌套菜单', '生硬视角转动'], label: '操作透明度', metric: '媒介隐形率' },
    juicinessLab: { title: '透镜 #63-64 多汁性反馈放大器', opts: ['极简无反馈', '标准音效', '超常多汁 (震动+顿帧+火花)'], label: '视听超常刺激度', metric: '多巴胺分泌率' },
    primitiveChannels: { title: '透镜 #65-66 原始感官通道映射台', opts: ['低频濒危心跳音', '屏幕暗角出血红斑', '中央文字弹窗'], label: '基因本能响应度', metric: '危机警报时延' },
    modesConsistency: { title: '透镜 #67 模式冲突审查与统一', opts: ['单键多义 (模式陷阱)', '情境严格分离', '全流程逻辑统一'], label: '交互纯净度', metric: '误操作规避率' },
    interestCurveModel: { title: '透镜 #68-69 黄金兴趣曲线调制器', opts: ['开局黄金钩子', '阶梯递进波谷', '终局终极大高潮'], label: '戏剧张力起伏度', metric: '全程无冷场指数' },
    inherentInterest: { title: '透镜 #70 内部兴趣题材磁场测试', opts: ['恐龙与史前巨兽', '赛博星际走私', '日常琐碎报税'], label: '题材吸睛磁力', metric: '冷启动转化率' },
    beautyClimax: { title: '透镜 #71 美丽透镜与视觉崇高升华', opts: ['金黄落日余晖', '巨兽轰然倒塌的悲怆', '机械刷怪无美感'], label: '崇高美学震撼度', metric: '灵魂铭刻值' },
    projectionBlank: { title: '透镜 #72 投影透镜与情感留白度', opts: ['适度沉默留白 (如林克)', '说教啰嗦台词压制', '完全自由自选人格'], label: '灵魂代入空腔', metric: '玩家投影深度' }
  }[type] || { title: u.nav, opts: ['配置 A', '配置 B', '配置 C'], label: '参数权重', metric: '系统效能' };

  return '<div class="lab-controls">' +
    config.opts.map((opt, i) => labButton(opt, 'generic-opt', i, activeOpt === i ? 'class="button primary active"' : '')).join('') +
  '</div><div class="diagnostic-layout"><div class="diag-card"><span class="eyebrow">' +
  labEscape(config.title) + '</span><h4>当前配置：' + labEscape(config.opts[activeOpt] || config.opts[0]) + '</h4><div class="stat-pair"><span>' +
  labEscape(config.label) + '<strong>' + val + ' / 10</strong></span><span>' + labEscape(config.metric) + '<strong>' + (val * 10) +
  '%</strong></span></div><div class="lab-controls" style="margin-top:14px;">' +
  labButton('下调 (-1)', 'generic-val', '-1') + labButton('上调 (+1)', 'generic-val', '1') + labButton('记录当前交互实验结果', 'generic-record') +
  '</div></div><aside class="lab-aside"><span class="eyebrow">设计洞察</span><h4>' + labEscape(u.title.replace('\\n', ' ')) + '</h4><p>' +
  labEscape(u.lead) + '</p></aside></div>' + runList(a);
}
`;

// Insert into labs.js before renderLab
labsCode = labsCode.replace('export function renderLab(u,a) {', advancedConstants + '\n' + newBoardFunctions + '\nexport function renderLab(u,a) {');

// In renderLab:
const allLabTypes = [
  'inspiration', 'problemStatement', 'brainstorm', 'ideaFilter',
  'eightFilters', 'loop', 'riskMatrix', 'toyPassion',
  'playerProfile', 'lazzaroFun', 'bartleTypes', 'empathyLab',
  'flowChannel', 'cognitiveLoad', 'mentalModel', 'flowDDA',
  'sdtNeeds', 'intrinsicVsExtrinsic', 'noveltyLens', 'judgmentFairness',
  'spaceTimeState', 'secretsEmergence', 'actionsRulesGoals', 'skillProbability',
  'dominantStrategies', 'triangleMethod', 'feedbackLoops', 'economyFaucets',
  'ahaMoment', 'accessibilityProgress', 'pyramidPuzzles', 'puzzlePrinciples',
  'interfaceTransparency', 'juicinessLab', 'primitiveChannels', 'modesConsistency',
  'interestCurveModel', 'inherentInterest', 'beautyClimax', 'projectionBlank'
];

let dispatchBlock = `  if(type==='inspiration') body=inspirationBoard(u,a,r);
  if(type==='problemStatement') body=problemStatementBoard(u,a,r);
  if(type==='brainstorm') body=brainstormBoard(u,a,r);
  if(type==='ideaFilter') body=ideaFilterBoard(u,a,r);
  if(type==='eightFilters') body=eightFiltersBoard(u,a,r);
  if(type==='loop') body=loopBoard(u,a,r);
  if(type==='riskMatrix') body=riskMatrixBoard(u,a,r);
  if(type==='toyPassion') body=toyPassionBoard(u,a,r);
  if(['playerProfile','lazzaroFun','bartleTypes','empathyLab','flowChannel','cognitiveLoad','mentalModel','flowDDA','sdtNeeds','intrinsicVsExtrinsic','noveltyLens','judgmentFairness','spaceTimeState','secretsEmergence','actionsRulesGoals','skillProbability','dominantStrategies','triangleMethod','feedbackLoops','economyFaucets','ahaMoment','accessibilityProgress','pyramidPuzzles','puzzlePrinciples','interfaceTransparency','juicinessLab','primitiveChannels','modesConsistency','interestCurveModel','inherentInterest','beautyClimax','projectionBlank'].includes(type)) body=genericLabBoard(u,a,r);
`;

labsCode = labsCode.replace('  if(type===\'resonance\') body=resonanceBoard(u,a,r);', '  if(type===\'resonance\') body=resonanceBoard(u,a,r);\n' + dispatchBlock);

// In labForms & labInstructions: add entries
const labFormAdditions = allLabTypes.map(t => `${t}:'${t}交互试验台'`).join(',');
const labInstAdditions = allLabTypes.map(t => `${t}:'切换维度选项，调节数值权重，观察状态响应并记录。'`).join(',');

labsCode = labsCode.replace("resonance:'共鸣透镜调谐台'}", "resonance:'共鸣透镜调谐台'," + labFormAdditions + "}");
labsCode = labsCode.replace("resonance:'运用透镜 #12，调谐 4 个倾听维度，识别表面题材背后的深层隐藏渴望，并记录分析。'}", "resonance:'运用透镜 #12，调谐 4 个倾听维度，识别表面题材背后的深层隐藏渴望，并记录分析。'," + labInstAdditions + "}");

// In handleLab: add action branches
const actionHandlers = `
  else if(action==='inspire-pick') { a.sourceId=d.value; }
  else if(action==='inspire-days') { const dVal=Number(d.value); a.incubationDays=Math.max(1, Math.min(14, (a.incubationDays??3)+dVal)); }
  else if(action==='inspire-record') { const item=inspirationSources.find(s=>s.id===(a.sourceId||'ballet'))||inspirationSources[0]; logRun(a,{kind:'inspiration',source:item.id,days:a.incubationDays??3,summary:'无尽灵感：汲取「'+item.title+'」本质，潜意识发酵 '+(a.incubationDays??3)+' 天，转化为「'+item.elem+'」。'}); }
  else if(action==='problem-case') { a.caseIdx=Number(d.value); }
  else if(action==='problem-record') { const cur=problemCasePool[Number(a.caseIdx??0)]||problemCasePool[0]; logRun(a,{kind:'problemStatement',caseIdx:Number(a.caseIdx??0),summary:'问题陈述分析：「'+cur.text+'」约束了【'+cur.constrained.join('、')+'】，保留【'+cur.free.join('、')+'】自由空间。'}); }
  else if(action==='bs-roll') {
    const pick=arr=>arr[Math.floor(Math.random()*arr.length)];
    if(d.value==='m'||d.value==='all') a.bs_m=pick(brainstormCategories.mechanics);
    if(d.value==='s'||d.value==='all') a.bs_s=pick(brainstormCategories.story);
    if(d.value==='ae'||d.value==='all') a.bs_ae=pick(brainstormCategories.aesthetics);
    if(d.value==='t'||d.value==='all') a.bs_t=pick(brainstormCategories.technology);
  }
  else if(action==='bs-record') {
    const m=a.bs_m||brainstormCategories.mechanics[0], s=a.bs_s||brainstormCategories.story[0], ae=a.bs_ae||brainstormCategories.aesthetics[0], t=a.bs_t||brainstormCategories.technology[0];
    logRun(a,{kind:'brainstorm',combo:{m,s,ae,t},summary:'四元素头脑风暴：【机制】'+m+' + 【故事】'+s+' + 【美学】'+ae+' + 【技术】'+t+'。'});
  }
  else if(action==='filter-pick') { a.filterChosen=Number(d.value); }
  else if(action==='filter-eval') { const cur=filterIdeaPool.find(x=>x.id===(Number(a.filterChosen??0)))||filterIdeaPool[0]; logRun(a,{kind:'ideaFilter',chosen:cur.id,fit:cur.fit,summary:'创意漏斗筛选：「'+cur.title+'」（可行性 '+cur.fit+'%）-> '+(cur.fit>=70?'收敛入选核心方案库':'果断淘汰剔除')+'。'}); }
  else if(action==='eight-select') { a.activeFilterKey=d.value; }
  else if(action==='eight-adjust') {
    const k=a.activeFilterKey||'artistic', scores=a.filterScores||{artistic:8,demographics:6,experience:8,innovation:7,business:5,engineering:6,community:5,playtesting:8};
    scores[k]=Math.max(1, Math.min(10, (scores[k]??7)+Number(d.value))); a.filterScores={...scores};
  }
  else if(action==='eight-record') {
    const scores=a.filterScores||{artistic:8,demographics:6,experience:8,innovation:7,business:5,engineering:6,community:5,playtesting:8};
    const weak=eightFiltersList.filter(f=>(scores[f.id]??7)<6).map(f=>f.name.slice(3));
    logRun(a,{kind:'eightFilters',scores,summary:'八项测试诊断：玩法测试 '+scores.playtesting+'/10。最脆弱短板：'+(weak.length?weak.join('、'):'无明显短板')+'。'});
  }
  else if(action==='loop-set') { a.sprintWeeks=Number(d.value); }
  else if(action==='loop-record') {
    const w=Number(a.sprintWeeks??2), count=Math.floor(48/w);
    logRun(a,{kind:'loop',sprintWeeks:w,loopCount:count,summary:'敏捷迭代规划：设定 '+w+' 周冲刺周期，全年可跑 '+count+' 次迭代循环。'});
  }
  else if(action==='risk-case') { a.riskIdx=Number(d.value); }
  else if(action==='risk-record') {
    const cur=riskCaseList[Number(a.riskIdx??0)]||riskCaseList[0];
    logRun(a,{kind:'riskMatrix',riskIdx:Number(a.riskIdx??0),summary:'风险消除原型计划：针对「'+cur.title+'」，采用「'+cur.bestProto+'」。'});
  }
  else if(action==='toy-toggle') { a.toyFun=!(a.toyFun??true); }
  else if(action==='passion-adjust') { a.passionScore=Math.max(1, Math.min(10, (Number(a.passionScore??9))+Number(d.value))); }
  else if(action==='passion-record') {
    const tf=Boolean(a.toyFun??true), p=Number(a.passionScore??9);
    logRun(a,{kind:'toyPassion',toyFun:tf,passion:p,summary:'玩具与激情检验：底层玩具属性「'+(tf?'好玩上瘾':'枯燥乏味')+'」，冲刺末期激情评分 '+p+'/10。'});
  }
  else if(action==='generic-opt') { a.activeOption=Number(d.value); }
  else if(action==='generic-val') { a.sliderVal=Math.max(1, Math.min(10, (Number.isInteger(a.sliderVal)?a.sliderVal:5)+Number(d.value))); }
  else if(action==='generic-record') {
    const opt=Number(a.activeOption??0), val=Number.isInteger(a.sliderVal)?a.sliderVal:5;
    logRun(a,{kind:type,option:opt,value:val,summary:u.nav+'实验：配置项 '+opt+'，参数权重 '+val+'/10，已完成状态响应测试。'});
  }
`;

labsCode = labsCode.replace("  else if(action==='res-record') {", actionHandlers + "  else if(action==='res-record') {");

// In labReady:
let readyRules = `  if(type==='inspiration') return runs.some(r=>r.kind==='inspiration');
  if(type==='problemStatement') return new Set(runs.filter(r=>r.kind==='problemStatement').map(r=>r.caseIdx)).size>=2;
  if(type==='brainstorm') return runs.filter(r=>r.kind==='brainstorm').length>=2;
  if(type==='ideaFilter') return runs.some(r=>r.kind==='ideaFilter');
  if(type==='eightFilters') return runs.some(r=>r.kind==='eightFilters');
  if(type==='loop') return new Set(runs.filter(r=>r.kind==='loop').map(r=>r.sprintWeeks)).size>=2;
  if(type==='riskMatrix') return new Set(runs.filter(r=>r.kind==='riskMatrix').map(r=>r.riskIdx)).size>=2;
  if(type==='toyPassion') return runs.some(r=>r.kind==='toyPassion');
  if(['playerProfile','lazzaroFun','bartleTypes','empathyLab','flowChannel','cognitiveLoad','mentalModel','flowDDA','sdtNeeds','intrinsicVsExtrinsic','noveltyLens','judgmentFairness','spaceTimeState','secretsEmergence','actionsRulesGoals','skillProbability','dominantStrategies','triangleMethod','feedbackLoops','economyFaucets','ahaMoment','accessibilityProgress','pyramidPuzzles','puzzlePrinciples','interfaceTransparency','juicinessLab','primitiveChannels','modesConsistency','interestCurveModel','inherentInterest','beautyClimax','projectionBlank'].includes(type)) return new Set(runs.filter(r=>r.kind===type).map(r=>r.option)).size>=2 || runs.filter(r=>r.kind===type).length>=2;
`;

labsCode = labsCode.replace("  if(type==='resonance')return runs.some(r=>r.kind==='resonance');", "  if(type==='resonance')return runs.some(r=>r.kind==='resonance');\n" + readyRules);

fs.writeFileSync('dist/labs.js', labsCode);
console.log('dist/labs.js successfully populated with all labs for chapters 7 to 16!');
