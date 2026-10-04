import { book as originalBook, units as firstUnits } from './content.js';
import { lensIndex } from './lenses.js';
import { repairedLessons, courseChapterProjects } from './course.js';
export const chapterCatalog = [{"id":1,"title":"太初之时，有设计师","pdfStart":49,"pdfEnd":56,"available":true},{"id":2,"title":"设计师创造体验","pdfStart":57,"pdfEnd":72,"available":true},{"id":3,"title":"体验发生于场景","pdfStart":73,"pdfEnd":80,"available":true},{"id":4,"title":"体验从游戏中诞生","pdfStart":81,"pdfEnd":98,"available":true},{"id":5,"title":"游戏由元素构成","pdfStart":99,"pdfEnd":106,"available":true},{"id":6,"title":"元素支撑起主题","pdfStart":107,"pdfEnd":118,"available":true},{"id":7,"title":"游戏始于一个创意","pdfStart":119,"pdfEnd":140,"available":true},{"id":8,"title":"游戏通过迭代提高","pdfStart":141,"pdfEnd":166,"available":true},{"id":9,"title":"游戏为玩家而生","pdfStart":167,"pdfEnd":184,"available":true},{"id":10,"title":"体验在玩家的脑中","pdfStart":185,"pdfEnd":198,"available":true},{"id":11,"title":"玩家的动机驱使着玩家的脑","pdfStart":199,"pdfEnd":208,"available":true},{"id":12,"title":"有些元素是游戏机制","pdfStart":209,"pdfEnd":252,"available":true},{"id":13,"title":"游戏机制必须平衡","pdfStart":253,"pdfEnd":290,"available":true},{"id":14,"title":"游戏机制支持谜题","pdfStart":291,"pdfEnd":306,"available":true},{"id":15,"title":"玩家通过界面玩游戏","pdfStart":307,"pdfEnd":332,"available":true},{"id":16,"title":"体验可以用它们的兴趣曲线来评价","pdfStart":333,"pdfEnd":350,"available":true},{"id":17,"title":"有种体验叫作故事","pdfStart":351,"pdfEnd":372,"available":true},{"id":18,"title":"故事和游戏结构可以用间接控制艺术性地融为一体","pdfStart":373,"pdfEnd":390,"available":true},{"id":19,"title":"在世界里发生的故事与游戏","pdfStart":391,"pdfEnd":400,"available":true},{"id":20,"title":"世界中的角色","pdfStart":401,"pdfEnd":424,"available":true},{"id":21,"title":"世界里的空间","pdfStart":425,"pdfEnd":440,"available":true},{"id":22,"title":"世界的外观与感觉是由其美学所定义的","pdfStart":441,"pdfEnd":450,"available":true},{"id":23,"title":"一些游戏让多人同乐","pdfStart":451,"pdfEnd":456,"available":true},{"id":24,"title":"其他玩家有时会形成社群","pdfStart":457,"pdfEnd":472,"available":true},{"id":25,"title":"设计师常与团队合作","pdfStart":473,"pdfEnd":484,"available":true},{"id":26,"title":"团队有时通过文档进行沟通","pdfStart":485,"pdfEnd":492,"available":true},{"id":27,"title":"通过试玩创造好游戏","pdfStart":493,"pdfEnd":510,"available":true},{"id":28,"title":"制作游戏的技术","pdfStart":511,"pdfEnd":526,"available":true},{"id":29,"title":"你的游戏总有个客户","pdfStart":527,"pdfEnd":534,"available":true},{"id":30,"title":"设计师要向客户推销自己的想法","pdfStart":535,"pdfEnd":550,"available":true},{"id":31,"title":"设计师和客户都希望游戏能盈利","pdfStart":551,"pdfEnd":564,"available":true},{"id":32,"title":"游戏改变玩家","pdfStart":565,"pdfEnd":582,"available":true},{"id":33,"title":"设计师担负的责任","pdfStart":583,"pdfEnd":588,"available":true},{"id":34,"title":"每个设计师都有个目标","pdfStart":589,"pdfEnd":594,"available":true}];
export const chapterLibrary = {1:{book:{...originalBook,number:1},units:firstUnits},...{
  "2": {
    "book": {
      "title": "游戏设计艺术",
      "edition": "第 2 版",
      "author": "Jesse Schell · 刘嘉俊译",
      "chapter": "设计师创造体验",
      "printedPages": "9—24",
      "pdfPages": "57—72",
      "sourceFile": "游戏设计艺术（第2版）The art of game design second edition (Jesse Schell, 刘嘉俊) (Z-Library).pdf",
      "number": 2
    },
    "project": "一份体验设计简报",
    "rubric": [
      "描述想让玩家感受什么，而不是只列功能。",
      "用一条实际观察支持判断，分清行为、感受与推测。",
      "指出一个本质体验，并说明你会怎样通过游戏表达它。"
    ],
    "units": [
      {
        "id": "experience",
        "nav": "追光体验实验",
        "title": "先玩一会儿，\n再说说发生了什么。",
        "pages": [
          58,
          59,
          60
        ],
        "section": "第 10—12 页",
        "minutes": 7,
        "lead": "屏幕上的圆点是游戏的一部分。紧张、好奇或无聊，是你体验到的东西。",
        "idea": "作者区分游戏与体验：设计师制作规则、物件和程序，玩家参与后才会产生主观体验。",
        "paragraphs": [
          "相同的游戏，可以让不同的人产生不同感受。体验本身无法像棋盘或代码一样被直接交给另一个人；设计师通过游戏间接创造体验的条件。",
          "先尝试下面的小原型，再分别记录可观察的操作和你自己的感受。“我点错两次”与“我有些紧张”属于不同的信息。这个练习不推断其他玩家的感受。"
        ],
        "activity": {
          "type": "pulse",
          "title": "追光体验实验"
        },
        "prompts": [
          "这次体验与屏幕上的游戏，有什么区别？请分别举一例。"
        ],
        "notePrompt": "这次体验与屏幕上的游戏，有什么区别？请分别举一例。",
        "review": {
          "prompt": "这次体验与屏幕上的游戏，有什么区别？请分别举一例。",
          "answer": "规则、圆点和操作是游戏的组成；感受到的紧张、好奇等是主观体验。设计师能调整前者，但需要观察和倾听来理解后者。"
        }
      },
      {
        "id": "perspectives",
        "nav": "三种观察笔记",
        "title": "同一段经历，\n换三副观察眼镜。",
        "pages": [
          61,
          62,
          63,
          64,
          65,
          66
        ],
        "section": "第 13—18 页",
        "minutes": 8,
        "lead": "不要停在“好玩”或“不好玩”。试着找到触发感受的具体时刻。",
        "idea": "本章从心理学、人类学和其他设计领域寻找理解体验的方法；内省有用，但自己的感受不能自动代表所有玩家。",
        "paragraphs": [
          "心理学提供观察行为和研究心智的角度；人类学强调进入人的生活情境、观察与参与；其他设计领域提供表达体验的思路。这里是作者借用的研究视角，不是三种方法的完整学科介绍。",
          "内省让你分析自己的体验，但有两类风险：把主观感觉当作客观事实，以及把自己的体验当作所有受众的体验。观察、访谈和对具体体验的分析可以相互补充。"
        ],
        "activity": {
          "type": "perspective",
          "title": "三种观察笔记"
        },
        "prompts": [
          "哪条是观察，哪条是你的解释？你准备怎样确认解释？"
        ],
        "notePrompt": "哪条是观察，哪条是你的解释？你准备怎样确认解释？",
        "review": {
          "prompt": "哪条是观察，哪条是你的解释？你准备怎样确认解释？",
          "answer": "把实际行为、自己的感受、对原因的推测分开记录；再通过追问、观察不同玩家或改变条件来检查推测。"
        }
      },
      {
        "id": "introspection",
        "nav": "两次经历对照",
        "title": "观察体验时，\n体验也可能被打断。",
        "pages": [
          67,
          68,
          69
        ],
        "section": "第 19—21 页",
        "minutes": 8,
        "lead": "先完整玩一次，再重玩并插入一次观察。比较你自己的两份记录。",
        "idea": "作者借用“海森堡原理”作类比，说明分析可能干扰体验，并提出回忆分析、两次经历、暗中一瞥和默默观察。",
        "paragraphs": [
          "透镜 #1“情感”让设计师关注希望玩家产生的感受及其原因。第一轮先玩，再回忆刚才的感受；第二轮在游戏途中停一下，观察自己。这只是体验内省练习，不是量子物理实验，也不能据两次得分证明某种心理规律。",
          "作者提出的方法各有取舍：回忆可能遗漏细节，重玩会改变熟悉程度，短暂观察减少中断，默默观察则需要练习。比较时记下练习效应等其他可能原因。"
        ],
        "activity": {
          "type": "twoPass",
          "title": "两次经历对照"
        },
        "prompts": [
          "两次记录哪里不同？除了观察中断，还有什么可能影响结果？"
        ],
        "notePrompt": "两次记录哪里不同？除了观察中断，还有什么可能影响结果？",
        "review": {
          "prompt": "两次记录哪里不同？除了观察中断，还有什么可能影响结果？",
          "answer": "分析记忆、两次经历、暗中一瞥、默默观察都是作者提出的内省方法。比较要承认记忆和熟悉程度等影响，不把个人结果推广为普遍因果。"
        }
      },
      {
        "id": "essence",
        "nav": "本质体验编辑台",
        "title": "删掉一些细节，\n你还想留下什么？",
        "pages": [
          69,
          70,
          71
        ],
        "section": "第 21—23 页",
        "minutes": 8,
        "lead": "完整复制现实并不是唯一道路。先决定哪一种感受最值得保留。",
        "idea": "透镜 #2“本质体验”让设计师识别体验中关键的部分，并思考怎样用游戏表达它。",
        "paragraphs": [
          "作者回忆打雪仗的经历，寻找真正重要的感觉和情境。本质不等于现实的一切细节，也没有适用于所有设计的固定答案。",
          "本章以 Wii Sports 和邦德题材的设计说明：动作、规则与反馈可以突出某种体验，而不必追求事事写实。下面的卡片与配方为教学补充，请用自己的目标解释取舍。"
        ],
        "activity": {
          "type": "essence",
          "title": "本质体验编辑台"
        },
        "prompts": [
          "你想保留哪种本质体验？删去哪个细节，为什么？"
        ],
        "notePrompt": "你想保留哪种本质体验？删去哪个细节，为什么？",
        "review": {
          "prompt": "你想保留哪种本质体验？删去哪个细节，为什么？",
          "answer": "先定义你希望表达的体验，再决定规则、动作、表现中哪些有帮助。真实性只是可能的手段之一；保留和删除都应服务于体验目标。"
        }
      }
    ]
  },
  "3": {
    "book": {
      "title": "游戏设计艺术",
      "edition": "第 2 版",
      "author": "Jesse Schell · 刘嘉俊译",
      "chapter": "体验发生于场景",
      "printedPages": "25—32",
      "pdfPages": "73—80",
      "sourceFile": "游戏设计艺术（第2版）The art of game design second edition (Jesse Schell, 刘嘉俊) (Z-Library).pdf",
      "number": 3
    },
    "project": "同一游戏的两种场景版本",
    "rubric": [
      "写出两种真实使用场景及玩家状态。",
      "让至少一项规则或呈现方式回应场景约束。",
      "解释取舍，并指出需要在真实场景验证的假设。"
    ],
    "units": [
      {
        "id": "venues",
        "nav": "九种场景漫游",
        "title": "先看人在哪里，\n再看屏幕是什么。",
        "pages": [
          74,
          75,
          76,
          77,
          78,
          79,
          80
        ],
        "section": "第 26—32 页",
        "minutes": 8,
        "lead": "在沙发上和家人玩，与通勤时独自玩，可能需要不同的设计。",
        "idea": "本章以私人、公共、半公共场景分析体验，提醒设计师关注使用情境；这些分类会交叠，也不涵盖所有场景。",
        "paragraphs": [
          "私人场景包括炉边、工作台和读书角；公共场景包括剧场、竞技场和博物馆；半公共场景包括游戏桌、操场和随时随地。分类用于思考人与环境之间的关系。",
          "场景不能只按设备划分。同一设备可能用于不同场景，线上与线下、观看与操作也可能交叠。本章关于设备和商业模式的例子属于成书时的背景，下面提炼的是场景约束。"
        ],
        "activity": {
          "type": "venues",
          "title": "九种场景漫游"
        },
        "prompts": [
          "同一个游戏搬到两种场景，有什么需要改变？"
        ],
        "notePrompt": "同一个游戏搬到两种场景，有什么需要改变？",
        "review": {
          "prompt": "同一个游戏搬到两种场景，有什么需要改变？",
          "answer": "关注共同或独处、身体姿态、注意力、时长、观众与中断等条件。分类可交叠，场景约束应通过真实使用情况确认。"
        }
      },
      {
        "id": "spectators",
        "nav": "观众席可见性",
        "title": "有人在玩，\n也有人在看。",
        "pages": [
          75,
          77,
          78
        ],
        "section": "第 27—30 页",
        "minutes": 7,
        "lead": "操作界面看起来清楚，不代表旁观的人知道正在发生什么。",
        "idea": "炉边、剧场、竞技场等场景涉及共处与观看。设计体验时要考虑操作者以外的人如何参与。",
        "paragraphs": [
          "本章讨论一起观看带来的情绪共鸣，以及大规模观众参与交互的困难。竞技场则强调竞争和公共结果。不同场景需要不同的信息表达。",
          "下面把同一个追光原型投到模拟观众席。切换信息公开程度，观察观众能看到什么。它是界面示意，不会替真实观众判断是否兴奋。"
        ],
        "activity": {
          "type": "spectator",
          "title": "观众席可见性"
        },
        "prompts": [
          "观众不知道什么？你会公开哪一条信息，为什么？"
        ],
        "notePrompt": "观众不知道什么？你会公开哪一条信息，为什么？",
        "review": {
          "prompt": "观众不知道什么？你会公开哪一条信息，为什么？",
          "answer": "识别旁观者的观察位置与信息需求，考虑目标、当前进展和结果的可见性。真实观看是否易懂，仍需向观众验证。"
        }
      },
      {
        "id": "interruption",
        "nav": "中断恢复实验",
        "title": "一次来电，\n会带走多少进度？",
        "pages": [
          79,
          80
        ],
        "section": "第 31—32 页",
        "minutes": 7,
        "lead": "亲自试试：走两步后模拟来电，再决定是否保留进度。",
        "idea": "“随时随地”的场景可能短促、分散并被打断；透镜 #3要求设计适应目标场景的特殊条件。",
        "paragraphs": [
          "下面的两种原型只改变一个规则：中断后重来，或保存当前步骤。你可以比较实际保留了多少进度，再记录自己对重来或继续的感受。",
          "自动恢复不是所有游戏的答案。有些设计需要持续投入，另一些要允许随时离开。重点是让取舍回应场景，而不是把某个功能当成万能规则。"
        ],
        "activity": {
          "type": "interruption",
          "title": "中断恢复实验"
        },
        "prompts": [
          "通勤途中，这条恢复规则有什么价值？哪种场景可能需要不同做法？"
        ],
        "notePrompt": "通勤途中，这条恢复规则有什么价值？哪种场景可能需要不同做法？",
        "review": {
          "prompt": "通勤途中，这条恢复规则有什么价值？哪种场景可能需要不同做法？",
          "answer": "从预计的中断频率和玩家时间出发，考虑短任务、清晰状态和恢复方式；说明代价，并在目标场景验证。"
        }
      },
      {
        "id": "adaptation",
        "nav": "双场景改造台",
        "title": "让同一个原型，\n适应不同的生活片段。",
        "pages": [
          74,
          76,
          79,
          80
        ],
        "section": "第 26—32 页",
        "minutes": 9,
        "lead": "将一个连续任务改成可随时恢复的版本，看看呈现与规则一起怎样变化。",
        "idea": "透镜 #3“场景”要求追问：目标场景有哪些特殊条件，游戏的哪些部分符合或不符合它们？",
        "paragraphs": [
          "工作台可能支持较长时间的专注；随时随地可能需要更短的任务和更容易恢复的状态。这些是本章启发的设计假设，需要针对具体人群与环境检验。",
          "改造台给出两种可运行的教学原型。切换场景后，任务长度和恢复规则会实际改变。用你的设计说明补上目标人群、约束和下一次验证，而不只是替界面换个名字。"
        ],
        "activity": {
          "type": "adaptation",
          "title": "双场景改造台"
        },
        "prompts": [
          "你会为两个场景分别保留和修改什么？如何验证？"
        ],
        "notePrompt": "你会为两个场景分别保留和修改什么？如何验证？",
        "review": {
          "prompt": "你会为两个场景分别保留和修改什么？如何验证？",
          "answer": "从场景条件推导具体设计修改，再实际试用并记录取舍。设备名称不能替代对玩家、环境、时长和注意力的描述。"
        }
      }
    ]
  },
  "4": {
    "book": {
      "title": "游戏设计艺术",
      "edition": "第 2 版",
      "author": "Jesse Schell · 刘嘉俊译",
      "chapter": "体验从游戏中诞生",
      "printedPages": "33—50",
      "pdfPages": "81—98",
      "sourceFile": "游戏设计艺术（第2版）The art of game design second edition (Jesse Schell, 刘嘉俊) (Z-Library).pdf",
      "number": 4
    },
    "project": "一份可以试玩的规则说明",
    "rubric": [
      "提出一个玩家想解决的问题，并说明自主参与的态度。",
      "让目标、规则、交互与反馈连接起来。",
      "说明资源为什么有用，并提出一个定义的边界或反例。"
    ],
    "units": [
      {
        "id": "toy",
        "nav": "玩具与目标实验",
        "title": "一组可以玩的东西，\n怎样变成一个问题？",
        "pages": [
          82,
          83,
          84,
          85,
          86,
          87,
          88,
          89
        ],
        "section": "第 34—41 页",
        "minutes": 8,
        "lead": "先自由移动，再加一个目标。同一棋盘会向你提出不同的问题。",
        "idea": "作者把玩具理解为可玩的物件，把乐趣与惊喜联系起来，并把玩与好奇心联系起来；这些定义用于帮助思考。",
        "paragraphs": [
          "透镜 #4“惊喜”、#5“乐趣”和 #6“好奇心”分别帮助设计师追问意外、愉悦与玩家想回答的问题。定义可以帮助设计师沟通与看见新角度，但本章并不把一种定义宣称为最终真理。相同活动也可能因为是否自主、是否怀有玩乐态度而带来不同意义。",
          "下面自由探索模式没有胜负；加上抵达灯塔的目标后，移动变成寻找路径的问题。玩具也可以成为游戏的一部分，不必强迫每个对象只能归入一个类别。"
        ],
        "activity": {
          "type": "toy",
          "title": "玩具与目标实验"
        },
        "prompts": [
          "添加目标后，你开始关心哪个问题？自由探索还有什么乐趣？"
        ],
        "notePrompt": "添加目标后，你开始关心哪个问题？自由探索还有什么乐趣？",
        "review": {
          "prompt": "添加目标后，你开始关心哪个问题？自由探索还有什么乐趣？",
          "answer": "目标能改变玩家关心的问题，但游戏、玩具、玩与乐趣的边界可以讨论。作者强调好奇、惊喜和自主参与的态度，定义用于分析设计。"
        }
      },
      {
        "id": "rules",
        "nav": "规则沙盒",
        "title": "改一条规则，\n亲自走出它的后果。",
        "pages": [
          90,
          91,
          92,
          93,
          94,
          95,
          96
        ],
        "section": "第 42—48 页",
        "minutes": 9,
        "lead": "改变步数限制和障碍，再用方向键或按钮试着抵达灯塔。",
        "idea": "本章比较游戏定义，整理目标、冲突、规则、交互、挑战等特征，再把游戏与解决问题联系起来。",
        "paragraphs": [
          "目标给出方向；规则限制行动；挑战和交互让玩家参与解决问题。下面不是对所有游戏的完整模拟，只把这些关系变成可操作的路径原型。",
          "规则编辑后原型会重开，避免把旧局面的进度混入新规则。可达性与是否在步数内完成都是棋盘中的实际结果，而不是模型预测出的玩家感受。"
        ],
        "activity": {
          "type": "grid",
          "title": "规则沙盒"
        },
        "prompts": [
          "你改了哪条规则？它怎样改变玩家要解决的问题？"
        ],
        "notePrompt": "你改了哪条规则？它怎样改变玩家要解决的问题？",
        "review": {
          "prompt": "你改了哪条规则？它怎样改变玩家要解决的问题？",
          "answer": "说明目标、合法行动、限制、反馈与结果之间的关系。规则改变会改变可行路径或挑战，但实际体验还需要玩家尝试。"
        }
      },
      {
        "id": "value",
        "nav": "资源价值实验",
        "title": "这个光点，\n为什么值得绕路拿？",
        "pages": [
          90,
          91,
          92
        ],
        "section": "第 42—44 页",
        "minutes": 8,
        "lead": "资源位置保持相同：先让它只记录收集，再让它成为开门钥匙，分别玩一次。",
        "idea": "透镜 #7“内生价值”关注物件在游戏目标与规则中的意义。价值不能只用价格或资源数量说明。",
        "paragraphs": [
          "本章用不同游戏中的收集物举例，说明一个资源是否值得关心，与它能怎样帮助玩家及玩家目标有关。不要把作者的案例视为对所有玩家行为的保证。",
          "下面的光点在收集记录模式中只记录收集；在钥匙模式中决定能否进入灯塔。它在规则中的用途确实改变了，是否让你更愿意绕路则由你记录。"
        ],
        "activity": {
          "type": "value",
          "title": "资源价值实验"
        },
        "prompts": [
          "资源在两种规则中分别有什么用？你的路线变了吗，为什么？"
        ],
        "notePrompt": "资源在两种规则中分别有什么用？你的路线变了吗，为什么？",
        "review": {
          "prompt": "资源在两种规则中分别有什么用？你的路线变了吗，为什么？",
          "answer": "内生价值来自资源与目标、行动和结果的关系。规则中的用途和个人动机要区分；可交易价格不是本章概念的全部。"
        }
      },
      {
        "id": "definition",
        "nav": "定义重组工坊",
        "title": "写下你的定义，\n再用一个反例检查它。",
        "pages": [
          90,
          91,
          92,
          93,
          94,
          95,
          96,
          97
        ],
        "section": "第 42—49 页",
        "minutes": 10,
        "lead": "把特征卡排成一条解释链，再用自己的设计和边界例子检查它。",
        "idea": "Schell 在本章用“以玩乐的态度解决问题”概括游戏，透镜 #8邀请设计师检查玩家实际在解决什么问题。",
        "paragraphs": [
          "作者整理十种特征：自主、目标、冲突、规则、输赢、交互、挑战、内生价值、吸引玩家、封闭正式系统，再寻找更集中的表达。它们是作者的分析框架，不宜当作鉴定一切游戏的硬性清单。",
          "作者也讨论随机游戏如何让玩家感到自己在解决问题。使用定义时应能提出反例和限制，解释它在哪种设计问题上有帮助。你写出的句子不会被自动判断为唯一正确答案。"
        ],
        "activity": {
          "type": "forge",
          "title": "定义重组工坊"
        },
        "prompts": [
          "用自己的话解释作者的定义，并给出一个值得讨论的边界例子。"
        ],
        "notePrompt": "用自己的话解释作者的定义，并给出一个值得讨论的边界例子。",
        "review": {
          "prompt": "用自己的话解释作者的定义，并给出一个值得讨论的边界例子。",
          "answer": "作者将解决问题与玩乐态度连接起来。定义的用途是帮助设计思考，反例和边界能揭示它的局限；不必用单一清单决定所有活动是否合法属于游戏。"
        }
      }
    ]
  },
  "5": {
    "book": {
      "title": "游戏设计艺术",
      "edition": "第 2 版",
      "author": "Jesse Schell · 刘嘉俊译",
      "chapter": "游戏由元素构成",
      "printedPages": "51—58",
      "pdfPages": "99—106",
      "sourceFile": "游戏设计艺术（第2版）The art of game design second edition (Jesse Schell, 刘嘉俊) (Z-Library).pdf",
      "number": 5
    },
    "project": "一份四元素协同设计简报",
    "rubric": [
      "用本章的概念解释一个具体设计决定。",
      "结合实际实验记录或构建作品说明依据。",
      "指出方案的限制，以及下一次怎样检验。"
    ],
    "units": [
      {
        "id": "hologram",
        "minutes": 8
      },
      {
        "id": "tetrad",
        "minutes": 8
      },
      {
        "id": "ripple",
        "minutes": 9
      },
      {
        "id": "diagnostic",
        "minutes": 8
      }
    ]
  },
  "6": {
    "book": {
      "title": "游戏设计艺术",
      "edition": "第 2 版",
      "author": "Jesse Schell · 刘嘉俊译",
      "chapter": "元素支撑起主题",
      "printedPages": "59—70",
      "pdfPages": "107—118",
      "sourceFile": "游戏设计艺术（第2版）The art of game design second edition (Jesse Schell, 刘嘉俊) (Z-Library).pdf",
      "number": 6
    },
    "project": "一份基于共鸣主题的设计方案",
    "rubric": [
      "用本章的概念解释一个具体设计决定。",
      "结合实际实验记录或构建作品说明依据。",
      "指出方案的限制，以及下一次怎样检验。"
    ],
    "units": [
      {
        "id": "themeFilter",
        "minutes": 8
      },
      {
        "id": "sensoryTheme",
        "minutes": 8
      },
      {
        "id": "truth",
        "minutes": 9
      },
      {
        "id": "resonance",
        "minutes": 8
      }
    ]
  },
  "7": {
    "book": {
      "title": "游戏设计艺术",
      "edition": "第 2 版",
      "author": "Jesse Schell · 刘嘉俊译",
      "chapter": "游戏始于一个创意",
      "printedPages": "71—92",
      "pdfPages": "119—140",
      "sourceFile": "游戏设计艺术（第2版）The art of game design second edition (Jesse Schell, 刘嘉俊) (Z-Library).pdf",
      "number": 7
    },
    "project": "一份游戏概念提案与问题陈述简报",
    "rubric": [
      "用本章的概念解释一个具体设计决定。",
      "结合实际实验记录或构建作品说明依据。",
      "指出方案的限制，以及下一次怎样检验。"
    ],
    "units": [
      {
        "id": "inspiration",
        "minutes": 8
      },
      {
        "id": "problemStatement",
        "minutes": 8
      },
      {
        "id": "brainstorm",
        "minutes": 9
      },
      {
        "id": "ideaFilter",
        "minutes": 8
      }
    ]
  },
  "8": {
    "book": {
      "title": "游戏设计艺术",
      "edition": "第 2 版",
      "author": "Jesse Schell · 刘嘉俊译",
      "chapter": "游戏通过迭代提高",
      "printedPages": "93—118",
      "pdfPages": "141—166",
      "sourceFile": "游戏设计艺术（第2版）The art of game design second edition (Jesse Schell, 刘嘉俊) (Z-Library).pdf",
      "number": 8
    },
    "project": "一份原型的风险消除与迭代冲刺计划",
    "rubric": [
      "用本章的概念解释一个具体设计决定。",
      "结合实际实验记录或构建作品说明依据。",
      "指出方案的限制，以及下一次怎样检验。"
    ],
    "units": [
      {
        "id": "eightFilters",
        "minutes": 9
      },
      {
        "id": "loop",
        "minutes": 8
      },
      {
        "id": "riskMatrix",
        "minutes": 9
      },
      {
        "id": "toyPassion",
        "minutes": 8
      }
    ]
  },
  "9": {
    "book": {
      "title": "游戏设计艺术",
      "edition": "第 2 版",
      "author": "Jesse Schell · 刘嘉俊译",
      "chapter": "游戏为玩家而生",
      "printedPages": "119—136",
      "pdfPages": "167—184",
      "sourceFile": "游戏设计艺术（第2版）The art of game design second edition (Jesse Schell, 刘嘉俊) (Z-Library).pdf",
      "number": 9
    },
    "project": "一份目标受众同理心档案与玩法乐趣适配方案",
    "rubric": [
      "用本章的概念解释一个具体设计决定。",
      "结合实际实验记录或构建作品说明依据。",
      "指出方案的限制，以及下一次怎样检验。"
    ],
    "units": [
      {
        "id": "playerProfile",
        "minutes": 8
      },
      {
        "id": "lazzaroFun",
        "minutes": 8
      },
      {
        "id": "bartleTypes",
        "minutes": 8
      },
      {
        "id": "empathyLab",
        "minutes": 8
      }
    ]
  },
  "10": {
    "book": {
      "title": "游戏设计艺术",
      "edition": "第 2 版",
      "author": "Jesse Schell · 刘嘉俊译",
      "chapter": "体验在玩家的脑中",
      "printedPages": "137—150",
      "pdfPages": "185—198",
      "sourceFile": "游戏设计艺术（第2版）The art of game design second edition (Jesse Schell, 刘嘉俊) (Z-Library).pdf",
      "number": 10
    },
    "project": "一份核心关卡的心流与认知负荷调优简报",
    "rubric": [
      "用本章的概念解释一个具体设计决定。",
      "结合实际实验记录或构建作品说明依据。",
      "指出方案的限制，以及下一次怎样检验。"
    ],
    "units": [
      {
        "id": "flowChannel",
        "minutes": 9
      },
      {
        "id": "cognitiveLoad",
        "minutes": 8
      },
      {
        "id": "mentalModel",
        "minutes": 8
      },
      {
        "id": "flowDDA",
        "minutes": 8
      }
    ]
  },
  "11": {
    "book": {
      "title": "游戏设计艺术",
      "edition": "第 2 版",
      "author": "Jesse Schell · 刘嘉俊译",
      "chapter": "玩家的动机驱使着玩家的脑",
      "printedPages": "151—160",
      "pdfPages": "199—208",
      "sourceFile": "游戏设计艺术（第2版）The art of game design second edition (Jesse Schell, 刘嘉俊) (Z-Library).pdf",
      "number": 11
    },
    "project": "一份玩家核心自驱力与激励体系设计",
    "rubric": [
      "解释需求、动机与激励之间的关系，并指出限制条件。",
      "用自己的作品或对照记录支持设计取舍。"
    ],
    "units": [
      {
        "id": "sdtNeeds",
        "minutes": 8
      },
      {
        "id": "intrinsicVsExtrinsic",
        "minutes": 8
      },
      {
        "id": "noveltyLens",
        "minutes": 8
      },
      {
        "id": "judgmentFairness",
        "minutes": 8
      }
    ]
  },
  "12": {
    "book": {
      "title": "游戏设计艺术",
      "edition": "第 2 版",
      "author": "Jesse Schell · 刘嘉俊译",
      "chapter": "有些元素是游戏机制",
      "printedPages": "161—204",
      "pdfPages": "209—252",
      "sourceFile": "游戏设计艺术（第2版）The art of game design second edition (Jesse Schell, 刘嘉俊) (Z-Library).pdf",
      "number": 12
    },
    "project": "一份核心游戏机制蓝图与状态机规范",
    "rubric": [
      "用本章的概念解释一个具体设计决定。",
      "结合实际实验记录或构建作品说明依据。",
      "指出方案的限制，以及下一次怎样检验。"
    ],
    "units": [
      {
        "id": "spaceTimeState",
        "minutes": 9
      },
      {
        "id": "secretsEmergence",
        "minutes": 8
      },
      {
        "id": "actionsRulesGoals",
        "minutes": 8
      },
      {
        "id": "skillProbability",
        "minutes": 9
      }
    ]
  },
  "13": {
    "book": {
      "title": "游戏设计艺术",
      "edition": "第 2 版",
      "author": "Jesse Schell · 刘嘉俊译",
      "chapter": "游戏机制必须平衡",
      "printedPages": "205—242",
      "pdfPages": "253—290",
      "sourceFile": "游戏设计艺术（第2版）The art of game design second edition (Jesse Schell, 刘嘉俊) (Z-Library).pdf",
      "number": 13
    },
    "project": "一份机制平衡性与经济系统数值白皮书",
    "rubric": [
      "用本章的概念解释一个具体设计决定。",
      "结合实际实验记录或构建作品说明依据。",
      "指出方案的限制，以及下一次怎样检验。"
    ],
    "units": [
      {
        "id": "dominantStrategies",
        "minutes": 9
      },
      {
        "id": "triangleMethod",
        "minutes": 8
      },
      {
        "id": "feedbackLoops",
        "minutes": 9
      },
      {
        "id": "economyFaucets",
        "minutes": 9
      }
    ]
  },
  "14": {
    "book": {
      "title": "游戏设计艺术",
      "edition": "第 2 版",
      "author": "Jesse Schell · 刘嘉俊译",
      "chapter": "游戏机制支持谜题",
      "printedPages": "243—258",
      "pdfPages": "291—306",
      "sourceFile": "游戏设计艺术（第2版）The art of game design second edition (Jesse Schell, 刘嘉俊) (Z-Library).pdf",
      "number": 14
    },
    "project": "一个金字塔型谜题关卡设计案",
    "rubric": [
      "用本章的概念解释一个具体设计决定。",
      "结合实际实验记录或构建作品说明依据。",
      "指出方案的限制，以及下一次怎样检验。"
    ],
    "units": [
      {
        "id": "ahaMoment",
        "minutes": 8
      },
      {
        "id": "accessibilityProgress",
        "minutes": 8
      },
      {
        "id": "pyramidPuzzles",
        "minutes": 9
      },
      {
        "id": "puzzlePrinciples",
        "minutes": 8
      }
    ]
  },
  "15": {
    "book": {
      "title": "游戏设计艺术",
      "edition": "第 2 版",
      "author": "Jesse Schell · 刘嘉俊译",
      "chapter": "玩家通过界面玩游戏",
      "printedPages": "259—284",
      "pdfPages": "307—332",
      "sourceFile": "游戏设计艺术（第2版）The art of game design second edition (Jesse Schell, 刘嘉俊) (Z-Library).pdf",
      "number": 15
    },
    "project": "一份核心交互界面的“多汁性与透明度”调优规范",
    "rubric": [
      "用本章的概念解释一个具体设计决定。",
      "结合实际实验记录或构建作品说明依据。",
      "指出方案的限制，以及下一次怎样检验。"
    ],
    "units": [
      {
        "id": "interfaceTransparency",
        "minutes": 9
      },
      {
        "id": "juicinessLab",
        "minutes": 9
      },
      {
        "id": "primitiveChannels",
        "minutes": 8
      },
      {
        "id": "modesConsistency",
        "minutes": 8
      }
    ]
  },
  "16": {
    "book": {
      "title": "游戏设计艺术",
      "edition": "第 2 版",
      "author": "Jesse Schell · 刘嘉俊译",
      "chapter": "体验可以用它们的兴趣曲线来评价",
      "printedPages": "285—302",
      "pdfPages": "333—350",
      "sourceFile": "游戏设计艺术（第2版）The art of game design second edition (Jesse Schell, 刘嘉俊) (Z-Library).pdf",
      "number": 16
    },
    "project": "一份完整游戏体验或主线流程的“兴趣曲线图谱与时刻编排”",
    "rubric": [
      "用本章的概念解释一个具体设计决定。",
      "结合实际实验记录或构建作品说明依据。",
      "指出方案的限制，以及下一次怎样检验。"
    ],
    "units": [
      {
        "id": "interestCurveModel",
        "minutes": 9
      },
      {
        "id": "inherentInterest",
        "minutes": 8
      },
      {
        "id": "beautyClimax",
        "minutes": 8
      },
      {
        "id": "projectionBlank",
        "minutes": 8
      }
    ]
  },
  "17": {
    "book": {
      "title": "游戏设计艺术",
      "edition": "第 2 版",
      "author": "Jesse Schell · 刘嘉俊译",
      "chapter": "有种体验叫作故事",
      "printedPages": "303—324",
      "pdfPages": "351—372",
      "sourceFile": "游戏设计艺术（第2版）The art of game design second edition (Jesse Schell, 刘嘉俊) (Z-Library).pdf",
      "number": 17
    },
    "project": "一份线性叙事与核心机制共生的大纲",
    "rubric": [
      "用本章的概念解释一个具体设计决定。",
      "结合实际实验记录或构建作品说明依据。",
      "指出方案的限制，以及下一次怎样检验。"
    ],
    "units": [
      {
        "id": "storyDuality",
        "minutes": 8
      },
      {
        "id": "storyMachine",
        "minutes": 8
      },
      {
        "id": "storyObstacles",
        "minutes": 8
      },
      {
        "id": "heroJourney",
        "minutes": 9
      }
    ]
  },
  "18": {
    "book": {
      "title": "游戏设计艺术",
      "edition": "第 2 版",
      "author": "Jesse Schell · 刘嘉俊译",
      "chapter": "故事和游戏结构可以用间接控制艺术性地融为一体",
      "printedPages": "325—342",
      "pdfPages": "373—390",
      "sourceFile": "游戏设计艺术（第2版）The art of game design second edition (Jesse Schell, 刘嘉俊) (Z-Library).pdf",
      "number": 18
    },
    "project": "一份基于间接控制的开放箱庭关卡动线设计",
    "rubric": [
      "用本章的概念解释一个具体设计决定。",
      "结合实际实验记录或构建作品说明依据。",
      "指出方案的限制，以及下一次怎样检验。"
    ],
    "units": [
      {
        "id": "indirectControl",
        "minutes": 9
      },
      {
        "id": "stringOfPearls",
        "minutes": 8
      },
      {
        "id": "freedomIllusion",
        "minutes": 8
      },
      {
        "id": "contextControl",
        "minutes": 8
      }
    ]
  },
  "19": {
    "book": {
      "title": "游戏设计艺术",
      "edition": "第 2 版",
      "author": "Jesse Schell · 刘嘉俊译",
      "chapter": "在世界里发生的故事与游戏",
      "printedPages": "343—352",
      "pdfPages": "391—400",
      "sourceFile": "游戏设计艺术（第2版）The art of game design second edition (Jesse Schell, 刘嘉俊) (Z-Library).pdf",
      "number": 19
    },
    "project": "一个具备跨媒介扩展潜力的游戏世界观圣经",
    "rubric": [
      "用本章的概念解释一个具体设计决定。",
      "结合实际实验记录或构建作品说明依据。",
      "指出方案的限制，以及下一次怎样检验。"
    ],
    "units": [
      {
        "id": "transmediaWorld",
        "minutes": 8
      },
      {
        "id": "icebergMystery",
        "minutes": 8
      },
      {
        "id": "environmentalStory",
        "minutes": 8
      },
      {
        "id": "worldConsistency",
        "minutes": 8
      }
    ]
  },
  "20": {
    "book": {
      "title": "游戏设计艺术",
      "edition": "第 2 版",
      "author": "Jesse Schell · 刘嘉俊译",
      "chapter": "世界中的角色",
      "printedPages": "353—376",
      "pdfPages": "401—424",
      "sourceFile": "游戏设计艺术（第2版）The art of game design second edition (Jesse Schell, 刘嘉俊) (Z-Library).pdf",
      "number": 20
    },
    "project": "一份多维立体的主角与反派人物设定集",
    "rubric": [
      "用本章的概念解释一个具体设计决定。",
      "结合实际实验记录或构建作品说明依据。",
      "指出方案的限制，以及下一次怎样检验。"
    ],
    "units": [
      {
        "id": "characterFunction",
        "minutes": 9
      },
      {
        "id": "characterDesire",
        "minutes": 8
      },
      {
        "id": "characterWeb",
        "minutes": 8
      },
      {
        "id": "uncannyValley",
        "minutes": 8
      }
    ]
  },
  "21": {
    "book": {
      "title": "游戏设计艺术",
      "edition": "第 2 版",
      "author": "Jesse Schell · 刘嘉俊译",
      "chapter": "世界里的空间",
      "printedPages": "377—392",
      "pdfPages": "425—440",
      "sourceFile": "游戏设计艺术（第2版）The art of game design second edition (Jesse Schell, 刘嘉俊) (Z-Library).pdf",
      "number": 21
    },
    "project": "一份高辨识度与强情绪引导的关卡空间白模规划",
    "rubric": [
      "用本章的概念解释一个具体设计决定。",
      "结合实际实验记录或构建作品说明依据。",
      "指出方案的限制，以及下一次怎样检验。"
    ],
    "units": [
      {
        "id": "spatialPsychology",
        "minutes": 9
      },
      {
        "id": "landmarkMap",
        "minutes": 8
      },
      {
        "id": "vistaOcclusion",
        "minutes": 8
      },
      {
        "id": "spatialWayfinding",
        "minutes": 8
      }
    ]
  },
  "22": {
    "book": {
      "title": "游戏设计艺术",
      "edition": "第 2 版",
      "author": "Jesse Schell · 刘嘉俊译",
      "chapter": "世界的外观与感觉是由其美学所定义的",
      "printedPages": "393—402",
      "pdfPages": "441—450",
      "sourceFile": "游戏设计艺术（第2版）The art of game design second edition (Jesse Schell, 刘嘉俊) (Z-Library).pdf",
      "number": 22
    },
    "project": "一份视觉与听觉情绪板及资产风格规范",
    "rubric": [
      "用本章的概念解释一个具体设计决定。",
      "结合实际实验记录或构建作品说明依据。",
      "指出方案的限制，以及下一次怎样检验。"
    ],
    "units": [
      {
        "id": "aestheticTone",
        "minutes": 8
      },
      {
        "id": "visualHierarchy",
        "minutes": 8
      },
      {
        "id": "soundDesign",
        "minutes": 8
      },
      {
        "id": "aestheticMechanism",
        "minutes": 8
      }
    ]
  },
  "23": {
    "book": {
      "title": "游戏设计艺术",
      "edition": "第 2 版",
      "author": "Jesse Schell · 刘嘉俊译",
      "chapter": "一些游戏让多人同乐",
      "printedPages": "403—408",
      "pdfPages": "451—456",
      "sourceFile": "游戏设计艺术（第2版）The art of game design second edition (Jesse Schell, 刘嘉俊) (Z-Library).pdf",
      "number": 23
    },
    "project": "一份双人非对称合作机制设计提案",
    "rubric": [
      "用本章的概念解释一个具体设计决定。",
      "结合实际实验记录或构建作品说明依据。",
      "指出方案的限制，以及下一次怎样检验。"
    ],
    "units": [
      {
        "id": "socialDynamics",
        "minutes": 8
      },
      {
        "id": "coopSynergy",
        "minutes": 8
      },
      {
        "id": "partyCompetition",
        "minutes": 8
      },
      {
        "id": "socialIcebreaker",
        "minutes": 8
      }
    ]
  },
  "24": {
    "book": {
      "title": "游戏设计艺术",
      "edition": "第 2 版",
      "author": "Jesse Schell · 刘嘉俊译",
      "chapter": "其他玩家有时会形成社群",
      "printedPages": "409—424",
      "pdfPages": "457—472",
      "sourceFile": "游戏设计艺术（第2版）The art of game design second edition (Jesse Schell, 刘嘉俊) (Z-Library).pdf",
      "number": 24
    },
    "project": "一份线上游戏公会与社群生态治理蓝图",
    "rubric": [
      "用本章的概念解释一个具体设计决定。",
      "结合实际实验记录或构建作品说明依据。",
      "指出方案的限制，以及下一次怎样检验。"
    ],
    "units": [
      {
        "id": "communityLifecycle",
        "minutes": 9
      },
      {
        "id": "griefingGovernance",
        "minutes": 8
      },
      {
        "id": "userCreativity",
        "minutes": 8
      },
      {
        "id": "communityRituals",
        "minutes": 8
      }
    ]
  },
  "25": {
    "book": {
      "title": "游戏设计艺术",
      "edition": "第 2 版",
      "author": "Jesse Schell · 刘嘉俊译",
      "chapter": "设计师常与团队合作",
      "printedPages": "425—436",
      "pdfPages": "473—484",
      "sourceFile": "游戏设计艺术（第2版）The art of game design second edition (Jesse Schell, 刘嘉俊) (Z-Library).pdf",
      "number": 25
    },
    "project": "一份跨部门愿景共识与敏捷协作工作流协议",
    "rubric": [
      "用本章的概念解释一个具体设计决定。",
      "结合实际实验记录或构建作品说明依据。",
      "指出方案的限制，以及下一次怎样检验。"
    ],
    "units": [
      {
        "id": "teamDiversity",
        "minutes": 8
      },
      {
        "id": "visionConsensus",
        "minutes": 8
      },
      {
        "id": "psychologicalSafety",
        "minutes": 8
      },
      {
        "id": "burnoutDefense",
        "minutes": 8
      }
    ]
  },
  "26": {
    "book": {
      "title": "游戏设计艺术",
      "edition": "第 2 版",
      "author": "Jesse Schell · 刘嘉俊译",
      "chapter": "团队有时通过文档进行沟通",
      "printedPages": "437—444",
      "pdfPages": "485—492",
      "sourceFile": "游戏设计艺术（第2版）The art of game design second edition (Jesse Schell, 刘嘉俊) (Z-Library).pdf",
      "number": 26
    },
    "project": "一份单页核心玩法设计文档（One-Page GDD）",
    "rubric": [
      "用本章的概念解释一个具体设计决定。",
      "结合实际实验记录或构建作品说明依据。",
      "指出方案的限制，以及下一次怎样检验。"
    ],
    "units": [
      {
        "id": "documentEssence",
        "minutes": 8
      },
      {
        "id": "onePageGdd",
        "minutes": 8
      },
      {
        "id": "livingDocuments",
        "minutes": 8
      },
      {
        "id": "audienceTailored",
        "minutes": 8
      }
    ]
  },
  "27": {
    "book": {
      "title": "游戏设计艺术",
      "edition": "第 2 版",
      "author": "Jesse Schell · 刘嘉俊译",
      "chapter": "通过试玩创造好游戏",
      "printedPages": "445—462",
      "pdfPages": "493—510",
      "sourceFile": "游戏设计艺术（第2版）The art of game design second edition (Jesse Schell, 刘嘉俊) (Z-Library).pdf",
      "number": 27
    },
    "project": "一份标准化试玩测试观察报告与整改路线图",
    "rubric": [
      "用本章的概念解释一个具体设计决定。",
      "结合实际实验记录或构建作品说明依据。",
      "指出方案的限制，以及下一次怎样检验。"
    ],
    "units": [
      {
        "id": "playtestFiveQuestions",
        "minutes": 9
      },
      {
        "id": "realRootCauses",
        "minutes": 8
      },
      {
        "id": "usabilityVsFun",
        "minutes": 8
      },
      {
        "id": "feedbackActionLoop",
        "minutes": 8
      }
    ]
  },
  "28": {
    "book": {
      "title": "游戏设计艺术",
      "edition": "第 2 版",
      "author": "Jesse Schell · 刘嘉俊译",
      "chapter": "制作游戏的技术",
      "printedPages": "463—478",
      "pdfPages": "511—526",
      "sourceFile": "游戏设计艺术（第2版）The art of game design second edition (Jesse Schell, 刘嘉俊) (Z-Library).pdf",
      "number": 28
    },
    "project": "一份针对特定技术平台特性的核心机制立项提案",
    "rubric": [
      "用本章的概念解释一个具体设计决定。",
      "结合实际实验记录或构建作品说明依据。",
      "指出方案的限制，以及下一次怎样检验。"
    ],
    "units": [
      {
        "id": "technologyCanvas",
        "minutes": 8
      },
      {
        "id": "hypeCycleMirage",
        "minutes": 8
      },
      {
        "id": "constraintsCreativity",
        "minutes": 8
      },
      {
        "id": "pipelineVelocity",
        "minutes": 8
      }
    ]
  },
  "29": {
    "book": {
      "title": "游戏设计艺术",
      "edition": "第 2 版",
      "author": "Jesse Schell · 刘嘉俊译",
      "chapter": "你的游戏总有个客户",
      "printedPages": "479—486",
      "pdfPages": "527—534",
      "sourceFile": "游戏设计艺术（第2版）The art of game design second edition (Jesse Schell, 刘嘉俊) (Z-Library).pdf",
      "number": 29
    },
    "project": "一份对齐客户诉求与创意愿景的立项商业备忘录",
    "rubric": [
      "用本章的概念解释一个具体设计决定。",
      "结合实际实验记录或构建作品说明依据。",
      "指出方案的限制，以及下一次怎样检验。"
    ],
    "units": [
      {
        "id": "clientIdentity",
        "minutes": 8
      },
      {
        "id": "clientAlignment",
        "minutes": 8
      },
      {
        "id": "expectationManagement",
        "minutes": 8
      },
      {
        "id": "demoTransparency",
        "minutes": 8
      }
    ]
  },
  "30": {
    "book": {
      "title": "游戏设计艺术",
      "edition": "第 2 版",
      "author": "Jesse Schell · 刘嘉俊译",
      "chapter": "设计师要向客户推销自己的想法",
      "printedPages": "487—502",
      "pdfPages": "535—550",
      "sourceFile": "游戏设计艺术（第2版）The art of game design second edition (Jesse Schell, 刘嘉俊) (Z-Library).pdf",
      "number": 30
    },
    "project": "一份 10 页精炼立项提案幻灯片（Pitch Deck）大纲",
    "rubric": [
      "用本章的概念解释一个具体设计决定。",
      "结合实际实验记录或构建作品说明依据。",
      "指出方案的限制，以及下一次怎样检验。"
    ],
    "units": [
      {
        "id": "elevatorPitch",
        "minutes": 8
      },
      {
        "id": "demoShowcase",
        "minutes": 8
      },
      {
        "id": "pitchObjections",
        "minutes": 8
      },
      {
        "id": "pitchPassion",
        "minutes": 8
      }
    ]
  },
  "31": {
    "book": {
      "title": "游戏设计艺术",
      "edition": "第 2 版",
      "author": "Jesse Schell · 刘嘉俊译",
      "chapter": "设计师和客户都希望游戏能盈利",
      "printedPages": "503—516",
      "pdfPages": "551—564",
      "sourceFile": "游戏设计艺术（第2版）The art of game design second edition (Jesse Schell, 刘嘉俊) (Z-Library).pdf",
      "number": 31
    },
    "project": "一份平衡可玩性与可持续盈利的商业化设计案",
    "rubric": [
      "用本章的概念解释一个具体设计决定。",
      "结合实际实验记录或构建作品说明依据。",
      "指出方案的限制，以及下一次怎样检验。"
    ],
    "units": [
      {
        "id": "businessModels",
        "minutes": 9
      },
      {
        "id": "ethicalMonetization",
        "minutes": 8
      },
      {
        "id": "ltvCacLoop",
        "minutes": 8
      },
      {
        "id": "sustainableEcosystem",
        "minutes": 8
      }
    ]
  },
  "32": {
    "book": {
      "title": "游戏设计艺术",
      "edition": "第 2 版",
      "author": "Jesse Schell · 刘嘉俊译",
      "chapter": "游戏改变玩家",
      "printedPages": "517—534",
      "pdfPages": "565—582",
      "sourceFile": "游戏设计艺术（第2版）The art of game design second edition (Jesse Schell, 刘嘉俊) (Z-Library).pdf",
      "number": 32
    },
    "project": "一份旨在引发积极心智转化的意义向游戏设计方案",
    "rubric": [
      "用本章的概念解释一个具体设计决定。",
      "结合实际实验记录或构建作品说明依据。",
      "指出方案的限制，以及下一次怎样检验。"
    ],
    "units": [
      {
        "id": "transformationalExperience",
        "minutes": 9
      },
      {
        "id": "seriousGames",
        "minutes": 8
      },
      {
        "id": "habitFormation",
        "minutes": 8
      },
      {
        "id": "lastingLegacy",
        "minutes": 8
      }
    ]
  },
  "33": {
    "book": {
      "title": "游戏设计艺术",
      "edition": "第 2 版",
      "author": "Jesse Schell · 刘嘉俊译",
      "chapter": "设计师担负的责任",
      "printedPages": "535—540",
      "pdfPages": "583—588",
      "sourceFile": "游戏设计艺术（第2版）The art of game design second edition (Jesse Schell, 刘嘉俊) (Z-Library).pdf",
      "number": 33
    },
    "project": "一份防沉迷与健康心智守护的伦理设计白皮书",
    "rubric": [
      "用本章的概念解释一个具体设计决定。",
      "结合实际实验记录或构建作品说明依据。",
      "指出方案的限制，以及下一次怎样检验。"
    ],
    "units": [
      {
        "id": "designerPower",
        "minutes": 8
      },
      {
        "id": "darkPatternsDefense",
        "minutes": 8
      },
      {
        "id": "realLifeBalance",
        "minutes": 8
      },
      {
        "id": "conscienceTest",
        "minutes": 8
      }
    ]
  },
  "34": {
    "book": {
      "title": "游戏设计艺术",
      "edition": "第 2 版",
      "author": "Jesse Schell · 刘嘉俊译",
      "chapter": "每个设计师都有个目标",
      "printedPages": "541—546",
      "pdfPages": "589—594",
      "sourceFile": "游戏设计艺术（第2版）The art of game design second edition (Jesse Schell, 刘嘉俊) (Z-Library).pdf",
      "number": 34
    },
    "project": "我的目标声明与原创观察卡",
    "rubric": [
      "用本章的概念解释一个具体设计决定。",
      "结合实际实验记录或构建作品说明依据。",
      "指出方案的限制，以及下一次怎样检验。"
    ],
    "units": [
      {
        "id": "deepestTheme",
        "minutes": 9
      },
      {
        "id": "lens114Creation",
        "minutes": 9
      },
      {
        "id": "continuousPractice",
        "minutes": 8
      },
      {
        "id": "masteryFarewell",
        "minutes": 8
      }
    ]
  }
}};
for(const c of Object.values(chapterLibrary)){
 const range=chapterCatalog.find(x=>x.id===c.book.number);
 c.lenses=lensIndex.filter(l=>l.pdfPage>=range.pdfStart&&l.pdfPage<=range.pdfEnd);
 if(c.book.number>=5){const plan=courseChapterProjects[c.book.number];c.project=plan[0];c.rubric=plan.slice(1);c.revision=3;c.units=c.units.map(u=>{const d=repairedLessons[u.id];if(!d)throw new Error('Missing authored lesson: '+u.id);return {...u,...d,section:`第 ${d.pages[0]-48}—${d.pages.at(-1)-48} 页`,activity:{type:d.studio.kind,title:d.nav},notePrompt:d.prompts[0]};});}
}
