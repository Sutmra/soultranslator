# feature-school-scene.md — 学校场景（教师端）+ D11-B 大脑上移

> Phase 4 增强（project-bootstrap 规划）。跨三端：共享 `backend/`、小程序 `app/`(Ysy2017)、网页 `frontend/`(Sutmra 片区，需知会同意)。

## Phase 0 决策（已定 2026-06-20）
- **D11-B 先行**：场域配置 + prompt 大脑上移共享后端（`/api/analyze` + `/api/scenes`）。
- **范围**：教师端完整（教师 ↔ 家长 / 学生 / 同事老师 / 校领导）。
- **UI**：独立「学校场景」入口/模式（与通用四象限并列）。
- **定位**：现有产品的增强（C 端教师个人）；暂不做学生端、to-B、教师会员。
- **两端都做**（网页 + 小程序，不暂缓网页）。
- 两端都改成 **"后端拉配置动态渲染"**（A3/A4 重构，回归保证不破坏现功能）。

## PRD
- **做什么**：独立「学校场景」，教师端 4 角色，针对家校/校园沟通的无理要求、挑刺、PUA，输出守师德/专业边界、不卑不亢的 4 套嘴替。
- **给谁**：教师个人（C 端），现有工具的增强。
- **成功标准**：
  1. 小程序 + 网页都能进学校场景、选教师端角色、出贴教育语境的 4 套嘴替。
  2. 分析大脑（场域+prompt）在共享后端单一来源，加角色只改后端一处、两端一致。
  3. prompt 真实场景验证可用（"老师味"足、守边界）。
- **明确不做(MVP)**：学生端、to-B/学校后台、教师会员/资质、专门定价。

## 技术决策
| 选型 | 决定 | 为什么 / 否决 |
|---|---|---|
| 分析接口 | 后端 `/api/analyze` `{scene, role, level, text}` → 内置 buildPrompt+场域配置 → DeepSeek → 结构化 JSON | 大脑单一来源；否决前端各存 prompt(D11-A 技术债、双改漂移)。旧 `/api/chat` 暂留兼容、逐步弃用 |
| 配置接口 | 后端 `/api/scenes` 下发场景/角色/档位 meta | 前端动态渲染，加角色只改后端一处 |
| 前端渲染 | mp/web 改为拉 `/api/scenes` 动态渲染（不再硬编码 sceneConfig） | 彻底单一来源；代价：现有四象限/滑块要重构(回归保证) |
| 数据模型 | `scene`(域) + `role`(角色) + `level`(1~4) 三级；通用四象限 role 可空/单一 | 兼容现有四象限 + 扩展学校多角色 |
| 滑块语义 | 随场景变（通用=邓巴亲密度；学校·教师↔家长=配合↔难缠度） | 教育语境不是亲密度 |

## 实现计划

### 里程碑 A：D11-B 大脑上移（前置 · 重构，不破坏现有行为）
> 重构性质：先锁基线（现功能全绿），每步回归全绿。
| 步 | 内容 | 验证标准 |
|---|---|---|
| A1 | 后端 `/api/analyze`：迁入 buildPrompt + 场域配置，`{scene,level,text}`→DeepSeek→结构化 JSON | 传通用四象限参数，结果与现 `/api/chat` 等价 |
| A2 | 后端 `/api/scenes`：下发通用四象限的场景/档位/邓巴 meta | GET 返回完整 config JSON |
| A3 | 小程序：拉 `/api/scenes` 动态渲染 + 调 `/api/analyze`，移除本地 prompt.js | 通用四象限分析功能不变(回归)、两端一致 |
| A4 | 网页(**Sutmra 片区**)：同样迁到 `/api/scenes`+`/api/analyze` | 网页分析功能不变 |

### 里程碑 B：学校场景 · 教师端（两端都做）
| 步 | 内容 | 验证标准 |
|---|---|---|
| B1 | 后端 scenes+prompt 加「学校·教师端」4 角色×4 档 + 教育话术规则(守师德/专业边界/不卑不亢) | `/api/scenes` 含学校；传教师↔家长出贴教育语境结果 |
| B2 | 小程序首页加「学校场景」入口/模式 → 教师端角色选择 + 档位滑块(语义随场景) | 能进学校场景选角色出"老师味"嘴替 |
| B3 | 网页(**Sutmra 片区**)加「学校场景」入口 + 教师端角色选择 | 网页能进学校场景出结果 |
| B4 | 两端打磨：学校场景文案/配色/档位提示按教育语境调 | 两端视觉文案契合 |

## 角色与档位初稿（B1 实现时细化话术）
- **教师↔家长**：配合型 / 焦虑型 / 挑刺质疑型 / 投诉对抗型
- **教师↔学生**：乖巧配合 / 普通 / 调皮顶撞 / 严重对抗
- **教师↔同事老师**：协作搭档 / 普通同事 / 暗中较劲 / 甩锅推诿
- **教师↔校领导**：观察期新人 / 骨干 / 被施压渡劫 / 核心圈

## 评审节奏（2026-06-20 定）
- **Sutmra 双审批到最后一次**：A1→B4 全部实现完再一次性请审，不每里程碑打扰。最终拆**后端 PR + 前端 PR 同时开**，一次审完两个（满足「后端单独 PR」规矩 + 只打扰一次）。
- **每步快确认门**：每步我 commit + 自审，给 Ysy2017 看 diff+疑点，点头才跑验证、进下一步。
- **回归安全前提**：全程**保留旧 `/api/chat` 不动、只新增 `/api/analyze`**，线上网页在最终合并前一直跑老接口，不被中途搞崩。
- **网页片区（A4/B3）**：动 `frontend/` 前需 Sutmra 再次知会同意（多图那次是单次授权，不顺延）。

## 进度
- **A1 ✅**（2026-06-20）：后端新增 `POST /api/analyze`（`{scene,level,text}`→`backend/prompt.js` buildSystemPrompt→DeepSeek→结构化 JSON）；`backend/prompt.js` 逐字迁入 prompt+邓巴场域配置；`/api/chat` 原样保留。本地验证全绿：analyze 返回三段齐全、/api/chat 回归 200、缺参/level 越界返 400。基线已确认：网页 buildPrompt 与小程序 prompt.js 逐字一致、调用参数相同。

- **A2 ✅**（2026-06-20）：后端新增 `GET /api/scenes`，下发 `{scenes:[{key,emoji,title,desc,algo,levels[4],tips[4]}×4], dunbarCapacity[4]}`；`SCENES`+`getScenesPayload()` 入 `backend/prompt.js`。本地验证：返回完整 config JSON。每场域自带 levels/tips（便于学校场景按角色扩展）。

- **A3 ✅**（2026-06-20）：小程序改动态渲染 —— `onLoad` 拉 `/api/scenes`（本地缓存即时渲染+后台拉新+失败重试）、分析调 `/api/analyze`；`SceneTabs`/`RelationSlider` 改 props 驱动；**删 `app/src/utils/prompt.js` + `sceneConfig.js`**。H5 本地验证全绿（场景卡/滑块/4 套嘴替均经后端接口）。小程序本地配置清零，单一来源剩网页内联那份。

- **A4 ✅**（2026-06-20，Sutmra 已授权改网页）：`frontend/index.html` 迁到后端 —— 场景卡改 `/api/scenes` 动态渲染（`renderTabs`/`applyScenes`/`loadScenes`，localStorage 缓存+重试）、analyze 改 `/api/analyze`、删 `buildPrompt`+`DUNBAR_SLIDER_CONFIG`+`DUNBAR_CAPACITY`。本地静态服务验证全绿。**两端一致达成，prompt 收敛成后端唯一一份。**

## 🎯 里程碑 A 完成（A1–A4 全绿）
D11-B 大脑上移完成：分析 prompt + 场景配置单一来源在后端（`/api/analyze` + `/api/scenes`），网页 + 小程序都改为动态渲染。`/api/chat` 保留兼容未删。

- **里程碑 A 两端手动验证通过**（2026-06-20，网页 + 微信小程序，连本地后端实测）。
- **B1 ✅**（2026-06-20）：后端 `backend/school.js` 新增学校·教师端 4 角色（家长/学生/同事老师/校领导）×4 档 + `buildSchoolPrompt`（教育话术铁律：守师德/专业边界/不卑不亢/留痕）；`/api/scenes` 加独立 `school` 块；`/api/analyze` 支持 `role` + 校验。本地验证：scenes 含 school、家长 L4 出守边界的 4 套教育嘴替、缺/非法 role 返 400、通用四象限回归不变。**输出 schema 复用，两端结果面板零改动；标签语义错位留 B4 打磨。**

- **B2 ✅**（2026-06-20，H5 + 微信开发者工具双验）：小程序首页加「💬通用 / 🎓学校场景」模式切换；学校模式渲染 4 角色卡（复用 SceneTabs）、滑块用角色 levels/tips、STEP 标题随模式变；analyze 按模式分支传 `role`；RelationSlider 邓巴提示空时隐藏。顺带给 `backend/school.js` 角色补 `algo`(英文)+`desc`(中文，~10 字一行)，角色卡与场景卡视觉对齐。

- **B3 ✅**（2026-06-20，Sutmra 已授权，本地静态服务验证）：网页 `frontend/index.html` 加「通用/学校场景」模式切换 + 4 角色卡（renderTabs mode 感知，data-scene→data-key）+ syncSlider 学校用角色 levels/tips·隐藏邓巴 + 动态 STEP 标题 + analyze 按模式分支。与 mp B2 同构、两端一致。通用模式零回归。

- **B4 ✅**（2026-06-21，三端验证）：两端结果面板标签学校模式感知 —— 邓巴能量审计→师德边界审计/BOUNDARY AUDIT、温度计→情绪强度/攻击施压/诉求不合理度、胜率预测→化解把握（mp `ResultPanel` 加 `isSchool` prop + index 捕获 `resultIsSchool`；网页 `render()` 读 `mode`）。**界面美化**：模式切换改分段控件（mp 满宽 / 网页紧凑胶囊左对齐）；学校角色图标换符号系 👪🎒🤝👔（后端 school.js emoji）。通用模式零回归。

## 🎉 整个 feature 完成（A1–A4 + B1–B4，8 步全绿）
学校场景·教师端 上线（两端）：D11-B 大脑上移 + 教师 ↔ 家长/学生/同事老师/校领导 各 4 档 + 守师德专业边界话术。分析大脑/场景配置后端单一来源。

## 当前光标（feature 实现完成，收官中）
学校场景·教师端 feature **全部实现 + 三端验证完成**。完整步骤 history 留在本地分支 `feat/be-analyze`（9 commit）。按片区拆**两个 PR**（用户定）：
- **`feat/be-school`**（`backend/` + 本规划文档）→ 后端 PR，**Sutmra 双审**（共享片区铁律）
- **`feat/school-frontend`**（`app/` 小程序 + `frontend/` 网页）→ 前端 PR（一次审完两端，含 Sutmra 已授权的网页改动）

**下一步**：Sutmra 审两 PR → **后端 PR 先合 → 等 Render 部署新接口 → 前端 PR 再合**（硬顺序：前端依赖 `/api/scenes`、`/api/analyze`，后端没上线前合前端会让线上前端调不到接口）→ 合并后删三条分支、本地 `main` `git pull` 同步。
> PR 号/是否已合等临时态查 `gh pr list`，不写本文档。

## 分支规划
- 后端 A1/A2/B1 → `feat/be-analyze` / `feat/be-school`（双人 review）
- 小程序 A3/B2 → `feat/mp-*`
- 网页 A4/B3 → `feat/web-*`（Sutmra 片区，知会同意）

## 未整理决策（草稿区）
- **D13**：学校场景·教师端 + D11-B 大脑上移后端（/api/analyze + /api/scenes，前端动态渲染），两端都做。详见本文件。（待并入 mp-progress 决策区 — 在 feat/be-analyze 分支落盘时整理。）

## 其它 backlog（非本 feature，待迁回 mp-progress）
- **复盘卡海报（feat/mp-poster）**：小程序补「一键生成人间清醒复盘卡」，**走方案 A（纯手绘 `<canvas type=2d>` + canvasToTempFilePath + 保存相册）**，视觉照网页 560px 复盘卡规格（页眉 SoulTranslator+「人间清醒复盘卡」、三模块、页脚、青柠/品红渐变底）。延后，用 project-bootstrap 分步规划再做。
