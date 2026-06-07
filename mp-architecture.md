# mp-architecture.md — 小程序代码结构（活文档）

> 占位文档。Step 1 建好 uni-app 脚手架后，在此填充实际目录结构、各模块职责、关键数据结构。
> 网页/后端现状架构见 [README.md](README.md)「项目架构」节。

## 现状（待 Step 1 后更新）

尚未创建 uni-app 工程。

## 计划中的结构（实现后以实际为准）

```
（uni-app 工程，Step 1 落地后补全）
├── pages/            # 页面（首页 = 分析主流程）
├── components/       # 复用组件（场域卡片 / 滑动条气泡 / 嘴替卡片 / 分享 canvas）
├── utils/
│   ├── config.*      # 后端地址、模型名等配置（改这里切换 Render/国内域名）
│   ├── request.*     # 统一网络请求封装（条件编译屏蔽 H5/小程序差异）
│   └── prompt.*      # buildPrompt（从现网页 index.html 迁移）
└── static/           # 静态资源
```

## 关键数据结构

- 后端 `/api/chat` 返回的分析 JSON（去噪 analysis / relationship_status / reply_scripts[4]）——结构以现网页 [frontend/index.html](frontend/index.html) 中 `buildPrompt` 约定的 schema 为准，迁移时保持一致。

## 后端接口（复用，不改）

| 接口 | 用途 |
|---|---|
| `POST /api/chat` | DeepSeek 分析代理 |
| `POST /api/ocr` | Gemini 截图识别 |
| `GET/POST /api/views` | 浏览量计数（Upstash） |
| `POST /api/sec-check` | （Step 8 新增）微信内容安全校验 |
