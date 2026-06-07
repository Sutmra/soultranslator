# mp-progress.md — 微信小程序开发滚动进度

> 发布历史见 [CHANGELOG.md](../../CHANGELOG.md)。本文件记录小程序里程碑的每步进度 + 决策。

## 当前光标

**下一步 = Step 4：文字分析主流程**（点 GO → 组装 prompt → /api/chat → 渲染 4 卡片 + 红绿灯）。
Step 1~3 已完成并验证。**Step 4 开始时先拍板 A/B（prompt 放 app/ 还是上移后端，见 D11）。**

**开工前**：`git checkout main && git pull`（拿到已合并的上一步），再 `git checkout -b feat/mp-step4-analyze` 从最新 main 开始。
（PR 是否已合并 / 在飞，用 `gh pr list` 查，不在此记录。）

## 进度日志

- 2026-06-07 — Phase 1 完成：生成规划文档，commit 66add15。
- 2026-06-07 — **Step 1 完成**：`app/` 生成 uni-app(Vue3+Vite) 工程，依赖装好；微信小程序 + H5 双端编译通过；微信开发者工具（测试号）+ 浏览器 http://localhost:5173 均可视化确认默认首页。环境坑：Node 装在 D:\software\node，npm 缓存目录无写权限 → 已把 cache 改到 C:\Users\YanSiyu\.npm-cache、registry 改 npmmirror。
- 2026-06-07 — **Step 2 完成**：新增 `utils/config.js` + `utils/request.js`（uni.request 统一封装，两端通用），首页 onLoad 调 `/api/views` 验证连通。H5(localhost:5173) + 微信(测试号，勾「不校验合法域名」) 均显示「后端连通 ✅ 浏览量: 373」。分支由 feat/miniprogram 重命名为 feat/mp-bootstrap 以符合新扁平分支约定。bootstrap 经 PR #2 squash 合并入 main(a0cc5d7)。
- 2026-06-07 — **Step 3 完成**：首页静态 UI 骨架，暗色主题还原原网页设计。新增 `utils/sceneConfig.js`、`components/SceneTabs.vue`(四象限)、`components/RelationSlider.vue`(随动气泡滑块)；改 index.vue/App.vue/pages.json/uni.scss；装 sass。坑：H5 桌面鼠标拖不动 → 加 @mousedown + #ifdef H5 挂 window 监听修复。两端验证通过。分支 feat/mp-step3-ui。

---

## 已整理决策

- **D1**：前端用 uni-app（Vue3）统一框架，一套代码出微信小程序 + H5；网页旧 HTML 先并存，不立即下线。
- **D2**：小程序用企业/个体工商户主体注册（便于选类目、过审）。
- **D3**：MVP 范围 = 核心分析 + 分享/转发卡片；登录/历史/付费留后续。
- **D4**：后端开发期复用现有 Render（勾「不校验域名」），备案 + 迁国内并行，上线前切到 `api.soultranslator.cn`。
- **D5**：域名 soultranslator.cn 已在聚名网注册并过户到个人名下，但**备案状态待用户在 beian.miit.gov.cn 确认**（过户 ≠ 备案）。
- **D6**：测试期用**测试号**（免账号/免执照）跑通 Step 1~7；营业执照 + 企业/个体主体正式注册推迟到上线前一步到位；**不先注册个人主体**（个人→企业变更麻烦、且情感/AI 类个人主体大概率过审被拒）。
- **D7**：前置准备只留测试期三件（Node / 微信开发者工具 / 测试号）；营业执照、正式注册、域名备案、国内服务器全部移入「里程碑 4 前置」，可在里程碑 2~3 并行启动以省等待。
- **D8**：封存/检查点约定（无本地 merge）—— 干净边界 = push+开 PR；**封存在 push 之前做**（光标/决策/对账先 commit 再 push）；临时状态（PR 号/在飞）交给 git/gh 不写文档。详见 [../../app/CLAUDE.md](../../app/CLAUDE.md)。
- **D9**：环境修正 —— Node 装在 D:\software\node、npm 缓存目录无写权限 → cache 改 `C:\Users\YanSiyu\.npm-cache`、registry 改 npmmirror（国内加速）。
- **D10**：H5 产物定位（细化 D1）—— **暂不替换桌面网页**。桌面网页继续用 Sutmra 的 `frontend/`（980px 宽屏多列）；uni-app H5 只当**开发预览 + 潜在移动端 web**。原因：uni-app 移动优先竖版(rpx)，桌面不会自动变宽屏多列，直接替换会退化。是否/如何替换推迟，不影响小程序 MVP。
- **D11**：一致性架构原则 —— **一致性放共享层，不放重复 UI**。① 业务大脑(prompt/分析逻辑) + ② 数据文案(场域/档位) 须一致 → 单一来源(目标上移共享 `backend/` 的 `/api/analyze`)；③ 纯 UI/布局/交互 各端独立、允许差异。隐患：buildPrompt+场域配置 frontend 与 app/ 各一份会漂移。**Step 4 拍板** A(先放 app/ 快上线，后续上移后端，记技术债) vs B(先 `feat/be-analyze` 把大脑放后端、需与 Sutmra 协调双审，再让小程序调)。

---

## 未整理决策（草稿区，随手 append，封存时整理）

（空）
