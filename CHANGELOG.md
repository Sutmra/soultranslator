# Changelog

本项目遵循 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.1.0/) 规范，
版本号遵循 [语义化版本 (SemVer)](https://semver.org/lang/zh-CN/)。

---

## [0.3.0] - 2026-06-02

> **主题：首屏（Hero）排版、文案与可读性优化（Typography · Copy · Readability）**
> 本版本为纯前端视觉/文案迭代，不涉及业务逻辑与后端接口变更，可安全回滚至 `v0.2`。

### Added（新增）
- **中文副标题**：「灵魂翻译官」同行追加小号荧光绿副标题「读懂潜台词」，强化产品定位。
- **动态版本号**：顶部徽章版本号由硬编码改为单一来源 `APP_VERSION` 常量驱动
  （`#appVer` 占位 + 同步浏览器标题），升级版本只需改一处。
- **重点词 / 关键信息高亮**：首句「阴阳话术」「真实意图」用白色加粗强调，
  数字「4」用荧光绿加粗；副标语 `WIN THE CHAT` 荧光绿加粗，与开头粉色 `REALLY` 首尾呼应。

### Changed（变更）
- **引言区两段式重构**：从单一 `.tagline` 拆分为语义化的「核心引言 + 行动口号」
  （`.tag-lead` / `.tag-slogan`）。
- **字体族**：优先调用高清晰无衬线黑体 `PingFang SC` / `Inter`，回退 `Noto Sans SC`，
  改善暗黑背景下中文小字号的发虚与黏连。
- **字距 / 行高**：核心引言 `letter-spacing:.04em` + `line-height:1.8`；
  行动口号 `letter-spacing:.12em`，整体更清爽舒展。
- **首屏文案重写**：
  - 核心引言 → 「拆解 阴阳话术，还原 真实意图与心理动机。给你 4 套现成的高情商回复脚本。」
  - 行动口号 → 「终结内耗，掌控聊天主动权。」
- **主次层级调整**：核心引言颜色弱化为 `--muted` 灰度，与口号统一风格，
  仅保留高亮词作为视觉焦点；两行间距收紧（`10px → 3px`）使其读作一句话。

### Notes（说明）
- 宽屏（`≥768px`）首句保持单行平铺不折行；移动端保持自然折行（沿用 v0.2 行为）。
- 高亮去除了早期的荧光绿下划线方案，改为更克制的字色/字重强调。
- 本分支 `feat/v0.3-typography` 独立于 `main`，便于按需回滚。

---

## [0.2.0] - 2026-06-01

> **主题：四场景系统 + 邓巴数心理学框架（Major Feature Refactor）**

### Added（新增）
- **四大社交场景系统**：恋爱/暧昧、朋友/人情、老板/导师、同事/客户，
  每个场景配独立的话术分寸与心理模型。
- **邓巴数（Dunbar's Number）关系深度框架**：150 / 50 / 15 / 5 人四层圈层，
  滑动条联动场景给出「邓巴能量错位审计」。
- **图片 OCR 识别**：上传聊天截图自动提取对话文字（Google Gemini 多模态），
  前端 Canvas 压缩缩略图、原图送识别，尽量省 token。
- **真实浏览量计数**：后端 `/api/views` 接口 + Upstash Redis 持久化存储，
  顶部徽章展示真实访问量（每会话仅 +1）。
- **结果模块化输出**：真心话照妖镜（事实/动机/情绪温度计）、关系走向红绿灯诊断、
  4 套高情商嘴替脚本、一键生成「人间清醒复盘卡」海报。

### Changed（变更）
- AI 输出结构重构为结构化 JSON（`analysis` / `relationship_status` / `reply_scripts`），
  渲染层兼容新旧字段名。
- 关系深度滑动条由静态刻度文字升级为跟随滑块的动态悬浮气泡（Web/移动端自适应）。

### Fixed（修复）
- 修复 Gemini OCR 模型不可用问题：`gemini-1.5-flash`（已下架）→ `gemini-2.5-flash`，
  端点 `v1` → `v1beta`，解决 404 与免费额度为 0 的报错。
- 修复移动端 LEVEL 标签错位、复制按钮被文本挤压、提示词折行等 UI 问题。
- 新增后端 warmup ping，缓解 Render 免费实例冷启动导致的「Load failed」。

---

## [0.1.0] - 初始版本

### Added（新增）
- SoulTranslator 单页应用 MVP：文本输入 → DeepSeek 分析 → 高情商回复脚本。
- Express 后端代理（Render）+ 静态前端（Netlify），API Key 不暴露于前端。

[0.3.0]: https://github.com/Sutmra/soultranslator/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/Sutmra/soultranslator/releases/tag/v0.2.0
