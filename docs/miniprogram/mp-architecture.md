# mp-architecture.md — 小程序代码结构（活文档）

> 占位文档。Step 1 建好 uni-app 脚手架后，在此填充实际目录结构、各模块职责、关键数据结构。
> 网页/后端现状架构见 [README.md](../../README.md)「项目架构」节。

## 现状（Step 1 已落地）

已用官方模板 `dcloudio/uni-preset-vue#vite`（Vue3 + Vite，无 TS）在 `app/` 生成 uni-app 工程，
微信小程序 + H5 双端均编译通过并可视化验证。

```
app/
├── index.html            # H5 入口
├── package.json          # 依赖 + dev/build 脚本（dev:h5 / dev:mp-weixin 等）
├── vite.config.js        # Vite + @dcloudio/vite-plugin-uni 配置
├── shims-uni.d.ts
└── src/
    ├── main.js           # 入口，createSSRApp
    ├── App.vue           # 应用根组件（全局样式 / onLaunch 等生命周期）
    ├── manifest.json     # 应用级配置（AppID、各端开关）—— 正式 AppID 在里程碑 4 替换
    ├── pages.json        # 页面路由 + 全局窗口样式（新增页面在此登记）
    ├── uni.scss          # 全局 SCSS 变量
    ├── pages/index/index.vue   # 首页（Step 3 起改造成分析主流程）
    └── static/logo.png
```

构建产物（已 gitignore）：`app/dist/build/mp-weixin`（导入微信开发者工具）、`app/dist/build/h5`（网页）。

## 计划中的结构（后续步骤逐步补全）

```
src/
├── pages/index/index.vue    # 分析主流程页
├── components/              # (Step 3+) 场域卡片 / 滑动条气泡 / 嘴替卡片 / 分享 canvas
└── utils/
    ├── config.js           # ✅(Step 2) 后端地址 BASE_URL、API_KEY、MODEL（改这里切换 Render/国内域名）
    ├── request.js          # ✅(Step 2) 统一请求封装 request()/getViews()（uni.request，两端通用，60s 超时留给 Render 冷启动）
    └── prompt.js           # (Step 4) buildPrompt（从现网页 index.html 迁移）
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
