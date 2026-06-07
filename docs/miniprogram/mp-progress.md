# mp-progress.md — 微信小程序开发滚动进度

> 发布历史见 [CHANGELOG.md](../../CHANGELOG.md)。本文件记录小程序里程碑的每步进度 + 决策。

## 当前光标

**下一步 = Step 3：首页 UI 骨架（四象限 / 滑块 / 输入 / 传图，静态）**（计划见 [mp-plan.md](mp-plan.md)）。
Step 1~2 已完成并验证。

**⏳ 在飞**：初始化 PR **#2**（`feat/mp-bootstrap` → main）已推送、待 Sutmra review+squash 合并。
**恢复方式**：① 待 PR #2 合并后 `git checkout main && git pull` 拿到 bootstrap，② 再 `git checkout -b feat/mp-step3-ui` 从最新 main 开始 Step 3。**别重复推 feat/mp-bootstrap。**

## 进度日志

- 2026-06-07 — Phase 1 完成：生成规划文档，commit 66add15。
- 2026-06-07 — **Step 1 完成**：`app/` 生成 uni-app(Vue3+Vite) 工程，依赖装好；微信小程序 + H5 双端编译通过；微信开发者工具（测试号）+ 浏览器 http://localhost:5173 均可视化确认默认首页。环境坑：Node 装在 D:\software\node，npm 缓存目录无写权限 → 已把 cache 改到 C:\Users\YanSiyu\.npm-cache、registry 改 npmmirror。
- 2026-06-07 — **Step 2 完成**：新增 `utils/config.js` + `utils/request.js`（uni.request 统一封装，两端通用），首页 onLoad 调 `/api/views` 验证连通。H5(localhost:5173) + 微信(测试号，勾「不校验合法域名」) 均显示「后端连通 ✅ 浏览量: 373」。分支由 feat/miniprogram 重命名为 feat/mp-bootstrap 以符合新扁平分支约定。

---

## 已整理决策

- **D1**：前端用 uni-app（Vue3）统一框架，一套代码出微信小程序 + H5；网页旧 HTML 先并存，不立即下线。
- **D2**：小程序用企业/个体工商户主体注册（便于选类目、过审）。
- **D3**：MVP 范围 = 核心分析 + 分享/转发卡片；登录/历史/付费留后续。
- **D4**：后端开发期复用现有 Render（勾「不校验域名」），备案 + 迁国内并行，上线前切到 `api.soultranslator.cn`。
- **D5**：域名 soultranslator.cn 已在聚名网注册并过户到个人名下，但**备案状态待用户在 beian.miit.gov.cn 确认**（过户 ≠ 备案）。

---

## 未整理决策（草稿区，随手 append，封存时整理）

- 测试期不注册小程序账号、不用营业执照，**开发者工具用「测试号」(测试 AppID)** 跑通 Step 1~7。营业执照 + 企业/体主体正式注册推迟到「准备发体验版/上线」时一步到位。**不先注册个人主体**（个人→企业变更麻烦、且情感/AI 类个人主体大概率过审被拒）。
- 计划调整：前置准备只保留测试期环境三件（Node / 工具 / 测试号）；营业执照、正式注册、域名备案、国内服务器全部移入「里程碑 4 前置」，测试期不碰（可在里程碑 2~3 期间并行启动以省等待）。
