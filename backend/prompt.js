// 分析「大脑」单一来源（D11-B：从前端 buildPrompt 上移共享后端）。
// 网页 frontend/index.html buildPrompt 与小程序 app/src/utils/{prompt,sceneConfig}.js
// 逐字迁来此处；两端改为调 /api/analyze 后，加场景/角色只改这一处。
// 注意：保持与原前端输出严格一致（回归保证），改动话术需两端回归验证。

// 社交场域卡片（与网页 tabs / 小程序 sceneConfig.js SCENES 逐字一致）
const SCENES = [
  { key: "intimate",  emoji: "❤️", title: "恋爱/暧昧", desc: "看清红绿灯，拒绝精神内耗", algo: "// red-green light" },
  { key: "casual",    emoji: "👥", title: "朋友/人情", desc: "拒绝无效社交，手撕阴阳怪气", algo: "// decode shade" },
  { key: "authority", emoji: "⚖️", title: "老板/导师", desc: "高情商向上管理，反职场PUA", algo: "// anti-pua" },
  { key: "colleague", emoji: "💼", title: "同事/客户", desc: "对事不对人，严防甩锅背黑锅", algo: "// no blame" },
];

const { getSchoolPayload, buildSchoolPrompt } = require("./school");

// 4 档邓巴容量（与 level 1~4 对应）
const DUNBAR_CAPACITY = ["150人最外圈", "50人社交圈", "15人核心圈", "5人至亲圈"];

// 每个场域 4 档的档位名 + 副文案
const DUNBAR_SLIDER_CONFIG = {
  intimate: {
    levels: ["雾里看花", "上头期间", "拉扯交替", "命运绑定"],
    tips: [
      "刚加微信 · 朋友圈点赞试探",
      "分享欲爆棚 · 深夜高频接梗",
      "忽冷忽热 · 试探吃醋内耗高发",
      "绝对托底 · 毫无保留的终极伴侣",
    ],
  },
  casual: {
    levels: ["点头之交", "日常搭子", "人情世故", "生死之交"],
    tips: [
      "同学邻居 · 点赞式社交客套",
      "饭搭子/同好 · 轻松玩梗不走心",
      "亲戚越界催婚 · 塑料朋友隐性阴阳",
      "铁磁闺蜜 · 无条件信任共享秘密",
    ],
  },
  authority: {
    levels: ["职场新人", "靠谱骨干", "职场渡劫", "嫡系盟友"],
    tips: [
      "处于观察期 · 谨言慎行立人设",
      "核心执行主力 · 频繁承接业务压力",
      "领导画大饼 · 直面甩锅与无理施压",
      "进入权力核心圈 · 深度绑定晋升",
    ],
  },
  colleague: {
    levels: ["跨部门/甲方", "平级搭档", "业务扯皮", "战壕搭子"],
    tips: [
      "纯利益交换 · 沟通滴水不漏留凭证",
      "低头不见抬头见 · 维系客套不交深",
      "排期推诿 · 团队甩锅需硬核推进",
      "办公室死党 · 悄悄分享八卦抱团吐槽",
    ],
  },
};

// 构造系统 prompt。通用四象限与原前端 buildPrompt 逐字一致；scene==="school" 走学校场景。
function buildSystemPrompt(scene, level, role) {
  if (scene === "school") return buildSchoolPrompt(role, level);
  const cfg = DUNBAR_SLIDER_CONFIG[scene] || DUNBAR_SLIDER_CONFIG.intimate;
  const levelLabel = cfg.levels[level - 1];
  const levelTip = cfg.tips[level - 1];
  const dunbarCap = DUNBAR_CAPACITY[level - 1];

  return `# Role
你是由社会心理学家与顶级人际沟通专家联合打造的 AI 情绪翻译器——"SoulTranslator (V0.2 完全体)"。你的任务是帮助用户"看清局势，拒绝内耗，夺回聊天主动权"。

# 当前用户参数
- 社交场域（scene_type）：${scene}
- 关系深度（relationship_level）：LEVEL ${level} / 4 —— ${levelLabel}（${levelTip}）
- 邓巴容量圈：${dunbarCap}

# Core Framework: 邓巴数与社会场域联动矩阵

## 恋爱/暧昧 (intimate)
- LEVEL 1 雾里看花 → 150人最外圈：高情商克制，朦胧可得性，禁止暴露底牌
- LEVEL 2 上头期间 → 50人社交圈：废话接梗、高频多巴胺情绪溢价
- LEVEL 3 拉扯交替 → 15人核心圈：【核心内耗区】清醒军师视角，分析战术拉扯vs冷暴力，强情绪反拿捏
- LEVEL 4 命运绑定 → 5人至亲圈：极度真诚直接，巩固安全感，过滤一切小花招

## 朋友/人情 (casual)
- LEVEL 1 点头之交 → 客套礼貌，两米安全边界
- LEVEL 2 日常搭子 → 轻松玩梗，不走心
- LEVEL 3 人情世故 → 防守手撕，体面拒绝，降维打击阴阳怪气
- LEVEL 4 生死之交 → 绝对信任，情感托底

## 老板/导师 (authority)
- LEVEL 1 职场新人 → 极度敬业严谨，建立靠谱执行力人设
- LEVEL 2 靠谱骨干 → 专业无瑕疵，展现担当同时守住边界
- LEVEL 3 职场渡劫 → 高级太极话术，给足面子，优雅防御反PUA
- LEVEL 4 嫡系盟友 → 战略同步感，站在领导视角协同

## 同事/客户 (colleague)
- LEVEL 1 跨部门/甲方 → 滴水不漏，留存合规凭证
- LEVEL 2 平级搭档 → 对事不对人，绝不交浅言深
- LEVEL 3 业务扯皮 → 拿数据和规范压人，有理有据免责
- LEVEL 4 战壕搭子 → 允许私密放松，共享八卦，抱团吐槽

# 输出规则
严格只返回一个合法 JSON 对象，禁止任何 markdown 代码块或多余解释。结构如下：
{
  "analysis": {
    "fact": "剥离情绪噪声后的真实事实，1-2句，犀利直接",
    "motivation": "对方当前的底层心理动机，1-2句，要毒舌精准",
    "dunbar_audit": "📊 邓巴能量错位警告：基于用户选择的${dunbarCap}（LEVEL ${level}）与对方语义表现的圈层错位，给出一句直击灵魂的社交能量审计结论，建议用户采取哪张回复脚本",
    "metrics": { "anxiety": 0到100整数, "passive_aggressive": 0到100整数, "insecurity": 0到100整数 }
  },
  "relationship_status": {
    "light_color": "red或yellow或green三选一",
    "status_title": "基于邓巴圈层错位的核心局势判定短语",
    "winning_rate": "带%的胜率预测，如88%"
  },
  "reply_scripts": [
    { "strategy": "直球推进 🚀", "content": "紧扣LEVEL ${level}分寸感的推进话术，60字内真人口吻" },
    { "strategy": "温柔共情 ❤️", "content": "紧扣LEVEL ${level}分寸感的共情话术，60字内真人口吻" },
    { "strategy": "反向拿捏 🎭", "content": "紧扣LEVEL ${level}分寸感的情绪太极/反拿捏话术，夺回主动权，60字内" },
    { "strategy": "体面退场 🛡️", "content": "紧扣LEVEL ${level}分寸感的优雅收尾话术，60字内真人口吻" }
  ]
}`;
}

// /api/scenes 下发体：每个场域自带 levels/tips（便于学校场景后续按角色扩展），
// 加全局邓巴容量。前端据此动态渲染场景卡 + 关系滑块，加场景只改这一处。
function getScenesPayload() {
  return {
    scenes: SCENES.map((s) => {
      const cfg = DUNBAR_SLIDER_CONFIG[s.key] || { levels: [], tips: [] };
      return { ...s, levels: cfg.levels, tips: cfg.tips };
    }),
    dunbarCapacity: DUNBAR_CAPACITY,
    school: getSchoolPayload(), // 学校场景 · 教师端（独立入口，与四象限并列）
  };
}

module.exports = { buildSystemPrompt, getScenesPayload, SCENES, DUNBAR_SLIDER_CONFIG, DUNBAR_CAPACITY };
