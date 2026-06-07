# CLAUDE.md — SoulTranslator 项目规则

SoulTranslator（灵魂翻译器）：剥离聊天里的阴阳怪气，还原对方真实意图，一键给出 4 套高情商「嘴替」回复。
现有网页版（V0.3）线上运行中；当前正在新增**微信小程序**里程碑（iOS/Android 通用），网页保留、后端复用。

## 文档地图（职能 → 实际文件）

每次写码 / 子代理取文档，按这张表找：

| 职能 | 实际位置 |
|---|---|
| 产品总览 PRD | [README.md](README.md)（整体卖点）+ [mp-prd.md](mp-prd.md)（小程序里程碑的 PRD + 技术选型） |
| 架构 | [README.md](README.md)「项目架构」节（网页/后端现状）+ [mp-architecture.md](mp-architecture.md)（小程序代码结构，Step 1 后填充） |
| 实现计划 | [mp-plan.md](mp-plan.md)（小程序分步计划，每步带验证标准） |
| 进度 | [CHANGELOG.md](CHANGELOG.md)（发布历史）+ [mp-progress.md](mp-progress.md)（小程序开发滚动进度） |
| 决策记录 | [mp-progress.md](mp-progress.md) 末尾「未整理决策」区 + 上方「已整理决策」区 |

## 项目规则（每次写码前遵守）

- 写任何代码前，先读 [mp-architecture.md](mp-architecture.md) 和 [mp-prd.md](mp-prd.md)。
- 倾向模块化：多个小文件 > 单个巨石文件。（现网页是单文件 HTML，小程序不要重蹈覆辙。）
- 完成里程碑/大功能后，更新 [mp-architecture.md](mp-architecture.md) 和 [mp-progress.md](mp-progress.md)。
- 改外部配置字段（后端地址、AppID、密钥名）时，主动提示用户填到对应配置/.env。
- 后端密钥（DeepSeek/Gemini/Upstash）只在后端，前端/小程序永不持有。

## 分支约定

- **不在 main 上直接写。** 一个里程碑一条分支。
- 命名沿用仓库现有风格 `feat/<kebab>`（参考历史 `feat/v0.3-typography`）。
- 当前里程碑分支：`feat/miniprogram`。
- 里程碑做完 → `branch vs main` review → 合并 main → 提封存。

## 技术栈速记

- 前端统一框架：**uni-app（Vue3）**，一套代码编译出微信小程序 + H5 网页。
- 后端：复用现有 **Express 代理**（Render，开发期勾「不校验合法域名」），上线前迁国内 + 绑备案域名。
- 详见 [mp-prd.md](mp-prd.md) 技术选型节。
