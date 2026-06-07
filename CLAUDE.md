# CLAUDE.md — SoulTranslator 项目规则（共享）

SoulTranslator（灵魂翻译器）：剥离聊天里的阴阳怪气，还原对方真实意图，一键给出 4 套高情商「嘴替」回复。
现有网页版（V0.3）线上运行中；当前在新增**微信小程序**里程碑，网页保留、后端复用。

> 本文件只放**两条产品线共享**的规则。各自的专属规则在子目录 CLAUDE.md，操作该目录时自动加载：
> - 小程序：[app/CLAUDE.md](app/CLAUDE.md)
> - 网页：`frontend/CLAUDE.md`（Sutmra 视需要自建）

## 仓库分工（谁拥有哪片，改别人的片先打招呼）

| 目录 / 文件 | 归属 | 说明 |
|---|---|---|
| `app/` + [docs/miniprogram/](docs/miniprogram/) | 🟦 小程序（Ysy2017） | uni-app 工程 + 小程序计划/进度 |
| `frontend/` `soul-translator.html` + [docs/web/](docs/web/) | 🟨 网页（Sutmra） | 网页代码 + 网页计划/进度 |
| `backend/` | 🟩 **共享** | Express 后端代理，两条线都调 |
| `CLAUDE.md` `CONTRIBUTING.md` `README.md` `CHANGELOG.md` | ⬜ 共享 | 改动需双方知会同意 |

- 各自只动自己那片，互不干扰；`git pull` 拿到对方改动也不影响自己。
- **`backend/` 是唯一共享交集**：改接口 / 返回结构 → 走 PR + 提前知会对方，避免一边改崩另一边。

## 共享铁律

- **后端密钥（DeepSeek/Gemini/Upstash）只在后端**，前端 / 小程序 / 网页永不持有。改外部配置字段（后端地址、AppID、密钥名）时，主动提示用户填到对应 `.env`。
- 仓库是**公开仓**：代码里绝不写死任何 key / AppSecret（会被爬虫扫到盗刷）。
- 倾向模块化：多个小文件 > 单个巨石文件。

## 分支约定（两人协作 · 扁平模型）

> 具体命令 / 怎么开 PR / 后端拆 PR 流程，见 [CONTRIBUTING.md](CONTRIBUTING.md)。下面是规则。


- **`main` 是唯一长期分支**，共享主干，只能被 PR 合入。谁都不直接 push / commit 到 main。
- 各自从最新 main 切**短命功能分支**，按产品线命名：小程序（Ysy2017）`feat/mp-<thing>`，网页（Sutmra）`feat/web-<thing>`，共享后端 `feat/be-<thing>`。一个功能/一步一条，合并后即删。
- **只推「与本地分支同名的远程分支」，绝不推 main**；代码进 main 靠 PR 合并，不靠 push。本地 `main` 只用 `git pull` 更新，绝不在上面写。
- 标准一轮：

```powershell
git checkout main; git pull            # 拿最新主干
git checkout -b feat/mp-xxx            # 切自己的短命分支
# ...写码... git add . ; git commit -m "..."
git push -u origin feat/mp-xxx         # 推同名远程分支(不是 main)
# GitHub 开 PR(base=main) → 对方扫一眼 diff → Squash merge → 删分支
git checkout main; git pull            # 把已合内容同步回本地
git branch -d feat/mp-xxx              # 删本地用完的分支
```

- **`backend/` 是唯一共享交集**，改它走 `feat/be-<thing>` 分支，且：① 尽量**单独成 PR**（别塞进前端 PR，便于审、合完对方 `git pull` 即可用）；② **两人都要 review**（改 `/api` 返回结构可能搞崩对方那端，必须双方点头）。其他目录（`app/` vs `frontend/`）各推各的，互不干扰。
- main 开启**分支保护**（公开仓免费，GitHub → Settings → Branches 配置）：禁止直推 + 需 1 个 approval，让上面的铁律变成强制。

## 产品总览

整体卖点见 [README.md](README.md)；发布历史见 [CHANGELOG.md](CHANGELOG.md)。
