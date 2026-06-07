# CONTRIBUTING.md — 协作实操手册

> 本文件是**怎么做**的命令速查；**规则**（谁拥有哪片、铁律）见 [CLAUDE.md](CLAUDE.md)。
> 两人协作 · 扁平分支模型：`main` 是唯一长期分支，人人从它切短命分支，PR 合回。

## 0. 一次性前置（只做一次）

1. 仓库 owner（Sutmra）在 GitHub → Settings → Collaborators 把对方加为 **Write**。
2. 被加的人接受邀请（邮箱 / `https://github.com/Sutmra/soultranslator/invitations` / `gh api user/repository_invitations` 后 PATCH）。
3. 验证有 push 权限：
   ```powershell
   gh api repos/Sutmra/soultranslator --jq '.permissions'   # push 应为 true
   ```
4. （建议）owner 给 `main` 开分支保护：Settings → Branches → 禁直推 + 需 1 个 approval。

## 1. 标准开发一轮

```powershell
git checkout main; git pull            # 拿最新主干
git checkout -b feat/mp-xxx            # 切自己的短命分支(命名见下表)
# ...写码... 
git add . ; git commit -m "feat(mp): 简述改动"
git push -u origin feat/mp-xxx         # 首推:-u 绑定同名远程分支(不是 main!)
# ...开 PR(见下),对方 review,Squash merge,删远程分支...
git checkout main; git pull            # 把已合内容同步回本地
git branch -d feat/mp-xxx              # 删本地用完的分支
```

要点：**只推「与本地同名的远程分支」，绝不推 main**；代码进 main 靠 PR，不靠 push。本地 `main` 只 `git pull`，绝不在上面写。

## 2. 怎么开 PR

**命令行（最快）** —— 在你的分支上：
```powershell
gh pr create --base main --head feat/mp-xxx --title "feat(mp): 标题" --body "改了啥、为什么"
# 指定 reviewer:加 --reviewer Sutmra
# 嫌填参数烦:gh pr create --web   # 浏览器打开填表
gh pr view --web                       # 随时打开本分支的 PR
```

**网页** —— 推完分支后：
1. 仓库页顶部黄条 **Compare & pull request**；或 **Pull requests → New**。
2. **base = `main`**（合进去的目标），**compare = 你的分支**。
3. 填标题 + 描述（描述写清「改了啥、为什么」，既给对方 review 也给 Claude 读上下文）。
4. 右侧 Reviewers 选 Sutmra → **Create pull request**。

合并：review 通过 → **Squash and merge** → **Delete branch**。

## 3. 改动后端（`backend/`，共享区，特别流程）

后端两条线都调，改它要拆开、双审：

```powershell
# 本地先把后端跑起来联调,开发不被阻塞
cd backend; npm start                  # 如 http://localhost:3000,前端 config 先指这

# 提交时拆成两个 PR,后端先合:
# ① feat/be-<thing>  只改 backend/  → PR(两人都 review)→ 合 main
# ② feat/mp-<thing>  改 app/ 调新接口 → git pull 拿到①后再开 → PR → 合
```

- 后端**单独成 PR**，别塞进前端 PR（便于审，合完对方 `git pull` 即可用）。
- `feat/be-*` 的 PR **两人都要 review**（改 `/api` 返回结构可能搞崩对方那端）。

## 4. 分支命名速查

| 改动范围 | 分支前缀 | 例 | 谁 review |
|---|---|---|---|
| 小程序 `app/` | `feat/mp-<thing>` | `feat/mp-ocr` | 对方扫一眼 |
| 网页 `frontend/` | `feat/web-<thing>` | `feat/web-hero` | 对方扫一眼 |
| 共享后端 `backend/` | `feat/be-<thing>` | `feat/be-ocr-endpoint` | **两人都看** |
