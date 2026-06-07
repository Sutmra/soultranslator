# app/CLAUDE.md — 微信小程序产品线规则（Ysy2017）

> 本文件在操作 `app/` 下文件时**自动加载**，叠加在根 [../CLAUDE.md](../CLAUDE.md) 之上。
> 这里只放小程序专属规则；共享规则（仓库分工、密钥铁律、分支总则）在根 CLAUDE.md。

## 文档地图（小程序线）

写小程序代码 / 子代理取文档，按这张表找：

| 职能 | 实际位置 |
|---|---|
| PRD + 技术选型 | [mp-prd.md](../docs/miniprogram/mp-prd.md) |
| 架构（代码结构，活文档） | [mp-architecture.md](../docs/miniprogram/mp-architecture.md) |
| 实现计划（分步，带验证标准） | [mp-plan.md](../docs/miniprogram/mp-plan.md) |
| 滚动进度 | [mp-progress.md](../docs/miniprogram/mp-progress.md) |
| 上线清单 | [mp-launch-checklist.md](../docs/miniprogram/mp-launch-checklist.md) |
| 决策记录 | mp-progress.md 末尾「未整理决策」区 + 上方「已整理决策」区 |

## 写码规则

- 写任何小程序代码前，先读 [mp-architecture.md](../docs/miniprogram/mp-architecture.md) 和 [mp-prd.md](../docs/miniprogram/mp-prd.md)。
- 完成里程碑/大功能后，更新 [mp-architecture.md](../docs/miniprogram/mp-architecture.md) 和 [mp-progress.md](../docs/miniprogram/mp-progress.md)。

## 技术栈

- 前端框架：**uni-app（Vue3）**，一套代码编译出微信小程序 + H5 网页。
- 后端：复用现有 **Express 代理**（`backend/`，Render，开发期勾「不校验合法域名」），上线前迁国内 + 绑备案域名。详见 [mp-prd.md](../docs/miniprogram/mp-prd.md) 技术选型节。

## 分支

- 遵循根 [../CLAUDE.md](../CLAUDE.md) 的**扁平模型**：从 main 切短命分支 → PR 合回 main，无长期集成分支。
- 小程序的分支统一命名 `feat/mp-<thing>`（如 `feat/mp-step2-request`），做完合 main 即删。
- 实现按 [mp-plan.md](../docs/miniprogram/mp-plan.md) 分步走，一步一条分支一个 PR。
