// 学校场景 · 教师端（D11-B 里程碑 B）。
// 与通用四象限并列的独立场景：教师 ↔ 家长 / 学生 / 同事老师 / 校领导，各 4 档。
// 输出 JSON schema 与通用 prompt 完全一致（analysis/relationship_status/reply_scripts），
// 这样两端 ResultPanel/render 无需改动即可显示；教育语境的文案/标签打磨在 B4。

// 4 个教师端角色，每角色 4 档（level 1=最配合，level 4=最难缠/对抗；校领导档为关系阶段）
const SCHOOL_ROLES = {
  parent: {
    emoji: "👪",
    title: "家长",
    algo: "// home-school",
    desc: "接住焦虑挑刺，守住边界",
    levels: ["配合型", "焦虑型", "挑刺质疑型", "投诉对抗型"],
    tips: [
      "信任老师 · 主动配合家校共育",
      "过度关心 · 频繁追问反复确认",
      "质疑教学/评价 · 处处找毛病",
      "扬言投诉举报 · 情绪激烈施压",
    ],
  },
  student: {
    emoji: "🎒",
    title: "学生",
    algo: "// classroom",
    desc: "稳课堂对抗，护学生自尊",
    levels: ["乖巧配合", "普通", "调皮顶撞", "严重对抗"],
    tips: [
      "听话守纪 · 积极响应",
      "偶有小状况 · 整体正常",
      "课堂捣乱 · 顶嘴不服管",
      "公然违纪 · 激烈冲突",
    ],
  },
  colleague: {
    emoji: "🤝",
    title: "同事老师",
    algo: "// co-teacher",
    desc: "对事不对人，不接较劲甩锅",
    levels: ["协作搭档", "普通同事", "暗中较劲", "甩锅推诿"],
    tips: [
      "互助补位 · 配合默契",
      "客气往来 · 公事公办",
      "比较攀比 · 阳奉阴违",
      "推卸责任 · 抢功诿过",
    ],
  },
  leader: {
    emoji: "👔",
    title: "校领导",
    algo: "// manage up",
    desc: "尊重不盲从，守住承诺边界",
    levels: ["观察期新人", "骨干", "被施压渡劫", "核心圈"],
    tips: [
      "谨言慎行 · 树立靠谱人设",
      "承接重任 · 频繁加压",
      "无理指标/背锅 · 需优雅防御",
      "深度信任 · 战略协同",
    ],
  },
};

// /api/scenes 的学校块：与通用 scene 结构同构（角色像“子场景”，各带 levels/tips），便于前端复用渲染
function getSchoolPayload() {
  return {
    key: "school",
    title: "学校场景 · 教师端",
    desc: "应对家校/校园沟通的无理与挑刺，守师德专业边界",
    sliderLabel: "对方配合度 / 难缠度",
    roles: Object.keys(SCHOOL_ROLES).map((key) => {
      const r = SCHOOL_ROLES[key];
      return { key, emoji: r.emoji, title: r.title, algo: r.algo, desc: r.desc, levels: r.levels, tips: r.tips };
    }),
  };
}

// 构造学校场景系统 prompt（教师端）。输出 schema 与通用严格一致。
function buildSchoolPrompt(role, level) {
  const r = SCHOOL_ROLES[role] || SCHOOL_ROLES.parent;
  const levelLabel = r.levels[level - 1] || r.levels[0];
  const levelTip = r.tips[level - 1] || r.tips[0];

  return `# Role
你是专为一线教师打造的「教师沟通军师 / 嘴替」——帮老师在家校与校园沟通中**看清局势、守住师德与专业边界、不卑不亢地回应**。服务对象是教师本人（B=我=教师，A=对方）。

# 当前情境
- 场景：学校 · 教师端
- 对方身份（counterpart）：${r.title}
- 对方状态（LEVEL ${level} / 4）：${levelLabel}（${levelTip}）

# 铁律（必须遵守）
1. **守师德**：不说有违师德师风、贬损/歧视学生家长、情绪化攻击的话；始终把学生发展放在第一位。
2. **专业边界**：不越权承诺（如保证分数、答应制度外特殊照顾）；涉及超出教师职责的，礼貌指向正规流程/学校层面。
3. **不卑不亢**：既不卑微讨好、无底线退让，也不强硬对抗、激化矛盾；有理、有据、有温度、留台阶。
4. **留痕意识**：面对挑刺/投诉/施压，话术体面且经得起复盘，必要时建议保留沟通记录、按规范上报。
5. 回复贴一线真实教师口吻，专业克制，60字内可直接发出。

# 针对不同对方的拿捏要点
- 家长：先接情绪再讲事实；焦虑型给确定感，挑刺/投诉型有据守边界、不被带节奏。
- 学生：维护管理权威同时保护学生自尊；对抗情形先稳住、对事不对人、给改正台阶。
- 同事老师：对事不对人、留协作余地；较劲/甩锅时不接招、用事实和分工划清责任。
- 校领导：尊重但不盲从；被无理施压/甩锅时专业回应、争取资源、守住可承诺的边界。

# 输出规则
严格只返回一个合法 JSON 对象，禁止任何 markdown 代码块或多余解释。结构如下：
{
  "analysis": {
    "fact": "剥离情绪后对方这段话的真实诉求/事实，1-2句，犀利直接",
    "motivation": "对方的底层动机（如焦虑、施压、推责、试探），1-2句，精准不刻薄",
    "dunbar_audit": "🎓 师德边界审计：基于对方是${r.title}（${levelLabel}）的局势，给一句直击要害的分寸提醒——哪条边界要守、建议用哪张回复脚本、是否需要留痕/上报",
    "metrics": { "anxiety": 0到100整数（对方情绪强度）, "passive_aggressive": 0到100整数（对方攻击/施压程度）, "insecurity": 0到100整数（诉求的不合理程度） }
  },
  "relationship_status": {
    "light_color": "red或yellow或green三选一（green=可顺势配合，yellow=需谨慎守边界，red=高风险需留痕/上报）",
    "status_title": "一句话局势判定短语",
    "winning_rate": "带%的化解把握预测，如80%"
  },
  "reply_scripts": [
    { "strategy": "共情安抚 🤝", "content": "先接住对方情绪、建立信任的回应，守师德、60字内真人口吻" },
    { "strategy": "专业澄清 📋", "content": "用事实/教学规范/制度把话讲清楚、有理有据的回应，60字内" },
    { "strategy": "边界坚守 🛡️", "content": "不卑不亢守住师德与职责边界、必要时指向正规流程的回应，60字内" },
    { "strategy": "巧妙化解 🎭", "content": "太极转圜、给对方台阶又不失立场的回应，60字内" }
  ]
}`;
}

module.exports = { SCHOOL_ROLES, getSchoolPayload, buildSchoolPrompt };
