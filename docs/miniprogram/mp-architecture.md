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
    ├── uni.scss          # 全局 SCSS 变量（含 $st-* 配色，从原网页 :root 迁移）
    ├── App.vue           # 全局 page 暗色底 + 字体
    ├── pages.json        # 暗色导航栏 + 标题"灵魂翻译官"
    ├── pages/index/index.vue   # ✅(Step 3~7) 首页：场景/滑块/输入/传图/分析/结果 + 转发(onShareAppMessage/onShareTimeline)
    ├── components/
    │   ├── SceneTabs.vue      # ✅(Step 3) 四象限场域选择（v-model 场域 key）
    │   ├── RelationSlider.vue # ✅(Step 3) 自定义随动气泡滑块(1~4 档)，触摸+鼠标双支持(#ifdef H5 挂 window)
    │   └── ResultPanel.vue    # ✅(Step 4/6) 结果三模块；嘴替卡片：复制(setClipboardData)+图标+四色顶边+两列网格(H5宽屏)+hover/按压反馈
    ├── utils/
    │   ├── config.js          # ✅(Step 2) 后端地址 BASE_URL、API_KEY、MODEL
    │   ├── request.js         # ✅(Step 2/4/5) request()/getViews()/analyze()/ocrImage()（ocrImage 调 /api/ocr）
    │   ├── sceneConfig.js     # ✅(Step 3) SCENES/DUNBAR_CAPACITY/DUNBAR_SLIDER_CONFIG（UI 与 prompt 共用）
    │   ├── prompt.js          # ✅(Step 4) buildSystemPrompt(scene,level)（决策 D11-A：先放 app/，后续考虑上移后端）
    │   └── image.js           # ✅(Step 5) chooseImageBase64()：选图+转纯base64，#ifdef 屏蔽 H5(FileReader)/小程序(getFileSystemManager)
    └── static/logo.png
```

构建产物（已 gitignore）：`app/dist/build/mp-weixin`（导入微信开发者工具）、`app/dist/build/h5`（网页）。
依赖补充：`sass`（devDependency，scss 编译）—— Step 3 引入 `<style lang="scss">` 后必需。

## 关键实现笔记

- **RelationSlider 拖动**：自绘滑轨 + 4 档，靠 `createSelectorQuery` 量轨道 rect 换算档位。触摸事件覆盖手机/小程序；H5 桌面是鼠标，需额外 `@mousedown` + `#ifdef H5` 下挂 `window` 的 mousemove/mouseup（小程序无 window，必须条件编译隔离）。
- **配色**：`$st-*` SCSS 变量在 uni.scss，被全局自动注入，各组件 `<style lang="scss">` 直接用、无需 import。
- **截图 OCR**：选图后预览用 **base64 data URL**(`data:mime;base64,...`)，两端通用，避免 H5 blob / 小程序 wxfile 临时路径在 `<image>` 不显示。缩略图容器须给**显式宽度**(width，非 max-width)，否则竖向 flex 里宽度塌成 0、`mode=widthFix` 高度也塌。有图时 GO 流程：先 `/api/ocr` 取文字 → 与输入文字合并 → 再 `/api/chat` 分析。
- **图标**：SVG 转 base64 data URI 放 `<image>`，两端通用；图标变色用灰/青柠两张图切换(CSS 无法给 `<image>` 重新着色)。
- **交互反馈**：桌面鼠标用 `:hover`(`#ifdef H5`)；触摸屏无 hover，用 uni `hover-class` 做按压反馈(`.reply-press`/`.copy-press`，两端通用)。transition 放基础样式两端都平滑。两列网格仅 H5 宽屏(`@media min-width:600px`)，手机/小程序保持单列。

## 关键数据结构

- 后端 `/api/chat` 返回的分析 JSON（去噪 analysis / relationship_status / reply_scripts[4]）——结构以现网页 [frontend/index.html](frontend/index.html) 中 `buildPrompt` 约定的 schema 为准，迁移时保持一致。

## 后端接口（复用，不改）

| 接口 | 用途 |
|---|---|
| `POST /api/chat` | DeepSeek 分析代理 |
| `POST /api/ocr` | Gemini 截图识别 |
| `GET/POST /api/views` | 浏览量计数（Upstash） |
| `POST /api/sec-check` | （Step 8 新增）微信内容安全校验 |
