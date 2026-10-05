/**
 * 《百年孤独》布恩迪亚家族谱系交互树与人物世代图谱（覆盖第 1—7 章）
 * 遵循《文学类制作工作流.md》规范，解决马尔克斯同名繁复人物阅读痛点
 */
(function(root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else {
    var g = typeof globalThis !== 'undefined' ? globalThis : root || window;
    g.SolitudeLineage = factory();
  }
})(typeof globalThis !== 'undefined' ? globalThis : typeof self !== 'undefined' ? self : this, function() {
  'use strict';

  // 家族世代人物库（扩充至第 7 章关键角色）
  const CHARACTERS = [
    {
      id: "gen1-jose",
      name: "何塞·阿尔卡蒂奥·布恩迪亚",
      role: "第一代家长 · 马孔多缔造者",
      gen: 1,
      chaptersActive: [1, 2, 3, 4, 5, 6, 7],
      badge: "创世者 / 炼金狂",
      desc: "体格壮硕、富于进取心的开拓者。沉迷吉卜赛人的奇物与炼金术，企图制造永动机、用放大镜打仗。第 4 章深感时间停滞发疯被绑在院中栗树上，第 7 章离世引发全镇黄花雨。",
      fate: "被绑栗树下多年，在幽灵的陪伴中衰竭而亡，死时全镇飘落密集的黄色小花雪。"
    },
    {
      id: "gen1-ursula",
      name: "乌尔苏拉·伊瓜兰",
      role: "第一代主母 · 家族支柱",
      gen: 1,
      chaptersActive: [1, 2, 3, 4, 5, 6, 7],
      badge: "家族脊梁 / 百岁主母",
      desc: "何塞·阿尔卡蒂奥·布恩迪亚的妻子兼表亲。极其勤勉坚韧，靠卖糖果小动物支撑家族。第 6 章当众用皮鞭抽打暴君阿尔卡蒂奥接管小镇，守护着家族伦理与生存。",
      fate: "活过一百一十五岁，在衰老失明中逐渐如玩偶般缩小，在圣周五安详离世。"
    },
    {
      id: "gen2-aureliano",
      name: "奥雷里亚诺·布恩迪亚（上校）",
      role: "第二代次子 · 革命领袖",
      gen: 2,
      chaptersActive: [1, 2, 3, 4, 5, 6, 7],
      badge: "革命上校 / 小金鱼匠",
      desc: "马孔多第一个出生的人，童年沉默寡言，天生具有预知能力。第 5 章因目睹宪兵暴行起义，自封上校发动三十二场内战。第 7 章看透政治污浊后在粉笔圈内自闭熔铸小金鱼。",
      fate: "经历了十四次暗杀、七十三次伏击幸存，晚年靠在栗树前撒尿时因衰老猝逝。"
    },
    {
      id: "gen2-jose-arcadio",
      name: "何塞·阿尔卡蒂奥（长子）",
      role: "第二代长子 · 巨力冒险家",
      gen: 2,
      chaptersActive: [1, 2, 3, 4, 5, 6, 7],
      badge: "流浪水手 / 拓荒巨汉",
      desc: "体魄赛过野牛。随吉卜赛马戏团出海环游世界六十五次，第 6 章满身刺青归来，强娶义妹丽贝卡，持枪强占全镇土地。第 7 章在行刑队枪口下救出胞弟上校。",
      fate: "在家中被神秘枪杀，鲜血流经全镇流到母亲乌尔苏拉脚下，尸身散发永久火药味。"
    },
    {
      id: "gen2-amaranta",
      name: "阿玛兰妲",
      role: "第二代长女 · 孤独处子",
      gen: 2,
      chaptersActive: [1, 2, 3, 4, 5, 6, 7],
      badge: "黑纱手腕 / 织裹尸布",
      desc: "布恩迪亚家长女，嫉妒收养的义妹丽贝卡，刻意折磨追求她的意大利技师克雷斯皮导致其割腕自杀。余生在手腕缠黑纱以赎罪，第 7 章拒绝马克斯上校求婚，夜以继日织裹尸布。",
      fate: "织好精美裹尸布的那天黄昏平静地躺入棺木离世。"
    },
    {
      id: "gen3-arcadio",
      name: "阿尔卡蒂奥",
      role: "第三代私生子 · 嗜血独裁官",
      gen: 3,
      chaptersActive: [3, 4, 5, 6],
      badge: "短命独裁者 / 面对行刑队",
      desc: "庇拉尔·特尔内拉与长子何塞·阿尔卡蒂奥的私生子。本为温顺小学教师，第 6 章掌握小镇军权后变质为残暴考迪罗独裁者，大肆搜刮杀戮，终被保守党行刑队枪决。",
      fate: "面对保守党行刑队时平静回忆昔日课堂与爱情，在晨曦枪声中崩落。"
    },
    {
      id: "outsider-rebeca",
      name: "丽贝卡",
      role: "养女 · 吞泥土少妇",
      gen: 2,
      chaptersActive: [3, 4, 5, 6, 7],
      badge: "异食癖 / 孤僻寡妇",
      desc: "带着父母骨头袋子来到马孔多的孤女，焦虑时有吃泥土与石灰墙皮的癖好。与长子何塞·阿尔卡蒂奥狂热结合被逐出大宅。丈夫神秘死后把自己反锁在深宅三十年不见天日。",
      fate: "在满布蜘蛛网与跳蚤的废宅中默默枯槁而死。"
    },
    {
      id: "outsider-remedios-moscote",
      name: "蕾梅黛丝·摩斯科特",
      role: "上校幼妻 · 天使化身",
      gen: 2,
      chaptersActive: [5],
      badge: "纯真童妻 / 悲剧夭折",
      desc: "保守党镇长摩斯科特的幼女。嫁给奥雷里亚诺时年仅九岁，以天使般的纯真化解了两个家族的敌意，深得全家喜爱。第 5 章因怀双胞胎妊娠中毒不幸夭折。",
      fate: "死于难产血崩，其黑框肖像永久供奉在布恩迪亚大宅并点燃长明灯。"
    },
    {
      id: "outsider-crespi",
      name: "皮埃特罗·克雷斯皮",
      role: "意大利技师 · 文明绅士",
      gen: 2,
      chaptersActive: [4, 5],
      badge: "自动琴技师 / 割腕殉情",
      desc: "优雅体面的意大利机械技师，负责组装自动钢琴并传授舞步。深陷丽贝卡与阿玛兰妲的争夺之中，被阿玛兰妲无情玩弄感情后，在万念俱灰中切开双腕自杀。",
      fate: "在小提琴音与古龙水香气中切开血管自尽，葬于马孔多公墓。"
    },
    {
      id: "outsider-gerineldo",
      name: "赫里内勒多·马克斯（上校）",
      role: "革命军战友 · 忠诚统帅",
      gen: 2,
      chaptersActive: [5, 6, 7],
      badge: "上校挚友 / 苦恋阿玛兰妲",
      desc: "奥雷里亚诺上校最信任的结拜战友与民兵统帅。终身苦恋阿玛兰妲却屡遭拒绝。厌倦战争后隐退，坐在摇椅里看着窗外雨落，直至终老。",
      fate: "在衰老与瘫痪中平静去世，遗体盖着三色战旗。"
    },
    {
      id: "outsider-melquiades",
      name: "梅尔基亚德斯",
      role: "吉卜赛先知 · 羊皮卷作者",
      gen: 0,
      chaptersActive: [1, 2, 3, 4, 7],
      badge: "炼金宗师 / 预言者",
      desc: "周游世界掌握古代失传知识的神秘吉卜赛人。历经瘟疫，第 4 章在马孔多河中溺水而亡，第 7 章起幽灵长年留在作坊指引后代破译记载百年命运的梵文羊皮卷。",
      fate: "肉身溺水而死，幽灵永驻小作坊直至马孔多毁灭。"
    },
    {
      id: "outsider-pilar",
      name: "庇拉尔·特尔内拉",
      role: "女占卜师 · 家族血脉温床",
      gen: 1,
      chaptersActive: [2, 3, 4, 5, 6, 7],
      badge: "塔罗牌占卜 / 世纪情妇",
      desc: "笑声能惊起鸽群的旷达女子。用纸牌预测未来，先后为长子何塞·阿尔卡蒂奥和奥雷里亚诺上校生下下一代儿子，贯穿了整个家族数代的秘密情欲。",
      fate: "活过了一百四十五岁，坐在摇椅上安详归天。"
    }
  ];

  // 谱系树层级关系（扩充至第三代分支）
  const LINEAGE_TREE = {
    root: {
      name: "初代始祖",
      couples: [
        {
          male: "何塞·阿尔卡蒂奥·布恩迪亚",
          female: "乌尔苏拉·伊瓜兰",
          note: "表亲通婚，因恐惧生出长猪尾巴的孩子而开启逃亡建立马孔多",
          children: [
            {
              id: "gen2-jose-arcadio",
              name: "何塞·阿尔卡蒂奥 (长子)",
              spouse: "丽贝卡 (养女) / 庇拉尔 (情妇)",
              branchDesc: "狂暴、粗犷、力大无穷的肉体分支",
              children: ["阿尔卡蒂奥 (第三代 · 枪决暴君)"]
            },
            {
              id: "gen2-aureliano",
              name: "奥雷里亚诺·布恩迪亚 (上校)",
              spouse: "蕾梅黛丝·摩斯科特 (早夭幼妻) / 庇拉尔 (情妇)",
              branchDesc: "清瘦、冷峻、沉思与战争的孤独分支",
              children: ["奥雷里亚诺·何塞 (第三代)", "十七个奥雷里亚诺私生子 (前线游击队)"]
            },
            {
              id: "gen2-amaranta",
              name: "阿玛兰妲 (长女)",
              spouse: "终身未嫁 (皮埃特罗·克雷斯皮 / 赫里内勒多追求)",
              branchDesc: "孤独、怨恨与赎罪的自闭分支",
              children: []
            }
          ]
        }
      ]
    }
  };

  return {
    CHARACTERS,
    LINEAGE_TREE
  };
});
