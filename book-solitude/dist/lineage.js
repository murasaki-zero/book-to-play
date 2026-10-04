/**
 * 《百年孤独》布恩迪亚家族谱系交互树与人物世代图谱
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

  // 家族世代人物库
  const CHARACTERS = [
    {
      id: "gen1-jose",
      name: "何塞·阿尔卡蒂奥·布恩迪亚",
      role: "第一代家长 · 马孔多缔造者",
      gen: 1,
      chaptersActive: [1, 2, 3, 4, 5, 6, 7, 8],
      badge: "创世者 / 炼金狂",
      desc: "体格壮硕、富于进取心的开拓者。沉迷吉卜赛人的奇物与炼金术，企图制造永动机、用放大镜打仗。晚年发疯被绑在院中栗树上，用拉丁语胡言乱语。",
      fate: "被绑栗树下多年，在幽灵的陪伴中衰竭而亡，死时全镇飘落黄花雪。"
    },
    {
      id: "gen1-ursula",
      name: "乌尔苏拉·伊瓜兰",
      role: "第一代主母 · 家族支柱",
      gen: 1,
      chaptersActive: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
      badge: "家族脊梁 / 百岁主母",
      desc: "何塞·阿尔卡蒂奥·布恩迪亚的妻子兼表亲。极其勤勉坚韧，靠卖糖果小动物支撑整个家族开销。活过一百一十五岁，双目失明却仍洞察家中一切秘密。",
      fate: "在衰老失明中逐渐如玩偶般缩小，在圣周五自然离世。"
    },
    {
      id: "gen2-aureliano",
      name: "奥雷里亚诺·布恩迪亚（上校）",
      role: "第二代次子 · 革命领袖",
      gen: 2,
      chaptersActive: [1, 2, 3, 4, 5, 6, 7, 8, 9],
      badge: "革命上校 / 小金鱼匠",
      desc: "马孔多第一个出生的人，童年沉默寡言，天生具有预知能力。后加入自由党发动三十二场武装起义，经历了十四次暗杀、七十三次伏击和一个行刑队，均幸免于难。晚年在作坊里日复一日融化、重铸小金鱼。",
      fate: "晚年厌倦一切权力与战争，靠在院中栗树前撒尿时因衰老离世。"
    },
    {
      id: "gen2-jose-arcadio",
      name: "何塞·阿尔卡蒂奥（长子）",
      role: "第二代长子 · 巨力冒险家",
      gen: 2,
      chaptersActive: [1, 2, 3, 4, 5],
      badge: "流浪水手 / 拓荒巨汉",
      desc: "继承了父亲的强壮体魄，童年与女占卜师庇拉尔有染生子后，随吉卜赛马戏团出海环游世界六十五次。浑身刺满异国刺青归来，娶义妹丽贝卡为妻并强占土地。",
      fate: "在家中被神秘枪杀，鲜血流经全镇流到母亲乌尔苏拉脚下，尸身散发永久火药味。"
    },
    {
      id: "gen2-amaranta",
      name: "阿玛兰妲",
      role: "第二代幼女 · 孤独处子",
      gen: 2,
      chaptersActive: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      badge: "黑纱手腕 / 织裹尸布",
      desc: "布恩迪亚家长女，嫉妒收养的义妹丽贝卡，与意大利技师克雷斯皮发生畸形情愫导致克雷斯皮自杀。余生在手腕缠黑纱以赎罪，夜以继日为自己缝制精美裹尸布。",
      fate: "缝好裹尸布的那天黄昏平静地躺入棺木离世。"
    },
    {
      id: "outsider-melquiades",
      name: "梅尔基亚德斯",
      role: "吉卜赛先知 · 羊皮卷作者",
      gen: 0,
      chaptersActive: [1, 2, 3, 7],
      badge: "炼金宗师 / 预言者",
      desc: "周游世界、掌握古代失传知识的神秘吉卜赛人。历经瘟疫与生死考验，最终定居在布恩迪亚家的小作坊，用梵文密码撰写记载布恩迪亚家族百年命运的羊皮卷。",
      fate: "在马孔多河中溺亡，但其幽灵长年留在作坊中指引后代破译手稿。"
    },
    {
      id: "outsider-pilar",
      name: "庇拉尔·特尔内拉",
      role: "女占卜师 · 家族血脉温床",
      gen: 1,
      chaptersActive: [2, 3, 4, 5, 6, 14, 20],
      badge: "塔罗牌占卜 / 世纪情妇",
      desc: "笑声能惊起鸽群的旷达女子。用纸牌为村民预测未来，先后为何塞·阿尔卡蒂奥和奥雷里亚诺上校生下下一代儿子，贯穿了整个家族数代的秘密情欲。",
      fate: "活过了一百四十五岁，坐在摇椅上安详归天。"
    },
    {
      id: "outsider-rebeca",
      name: "丽贝卡",
      role: "养女 · 吞泥土少女",
      gen: 2,
      chaptersActive: [3, 4, 5, 6, 8],
      badge: "异食癖 / 孤僻寡妇",
      desc: "带着父母骨头袋子突然来到马孔多的孤女，焦虑时有吃泥土和石灰墙皮的异食癖。与何塞·阿尔卡蒂奥私奔结合，丈夫死后把自己反锁在深宅三十年不见天日。",
      fate: "在满布蜘蛛网与跳蚤的旧屋中默默枯槁而死。"
    }
  ];

  // 谱系树层级关系
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
              children: ["阿尔卡蒂奥 (第三代)"]
            },
            {
              id: "gen2-aureliano",
              name: "奥雷里亚诺·布恩迪亚 (上校)",
              spouse: "蕾梅黛丝·摩斯科特 (幼妻) / 庇拉尔 (情妇)",
              branchDesc: "清瘦、冷峻、沉思与战争的孤独分支",
              children: ["奥雷里亚诺·何塞 (第三代)", "十七个奥雷里亚诺私生子"]
            },
            {
              id: "gen2-amaranta",
              name: "阿玛兰妲 (长女)",
              spouse: "终身未嫁 (皮埃特罗·克雷斯皮追求)",
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
