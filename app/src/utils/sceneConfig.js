// 社交场域 + 邓巴关系档位配置（从现网页 frontend/index.html 迁移，保持一致）
// UI（场域卡片 / 关系滑块）与 Step 4 的 buildPrompt 共用此数据源。

export const SCENES = [
  { key: 'intimate',  emoji: '❤️', title: '恋爱/暧昧', desc: '看清红绿灯，拒绝精神内耗', algo: '// red-green light' },
  { key: 'casual',    emoji: '👥', title: '朋友/人情', desc: '拒绝无效社交，手撕阴阳怪气', algo: '// decode shade' },
  { key: 'authority', emoji: '⚖️', title: '老板/导师', desc: '高情商向上管理，反职场PUA', algo: '// anti-pua' },
  { key: 'colleague', emoji: '💼', title: '同事/客户', desc: '对事不对人，严防甩锅背黑锅', algo: '// no blame' },
]

// 4 档邓巴容量（与 level 1~4 对应）
export const DUNBAR_CAPACITY = ['150人最外圈', '50人社交圈', '15人核心圈', '5人至亲圈']

// 每个场域 4 档的档位名 + 副文案
export const DUNBAR_SLIDER_CONFIG = {
  intimate: {
    levels: ['雾里看花', '上头期间', '拉扯交替', '命运绑定'],
    tips: [
      '刚加微信 · 朋友圈点赞试探',
      '分享欲爆棚 · 深夜高频接梗',
      '忽冷忽热 · 试探吃醋内耗高发',
      '绝对托底 · 毫无保留的终极伴侣',
    ],
  },
  casual: {
    levels: ['点头之交', '日常搭子', '人情世故', '生死之交'],
    tips: [
      '同学邻居 · 点赞式社交客套',
      '饭搭子/同好 · 轻松玩梗不走心',
      '亲戚越界催婚 · 塑料朋友隐性阴阳',
      '铁磁闺蜜 · 无条件信任共享秘密',
    ],
  },
  authority: {
    levels: ['职场新人', '靠谱骨干', '职场渡劫', '嫡系盟友'],
    tips: [
      '处于观察期 · 谨言慎行立人设',
      '核心执行主力 · 频繁承接业务压力',
      '领导画大饼 · 直面甩锅与无理施压',
      '进入权力核心圈 · 深度绑定晋升',
    ],
  },
  colleague: {
    levels: ['跨部门/甲方', '平级搭档', '业务扯皮', '战壕搭子'],
    tips: [
      '纯利益交换 · 沟通滴水不漏留凭证',
      '低头不见抬头见 · 维系客套不交深',
      '排期推诿 · 团队甩锅需硬核推进',
      '办公室死党 · 悄悄分享八卦抱团吐槽',
    ],
  },
}
