# 🎭 SoulTranslator (灵魂翻译器) · V0.2 完全体

[![Deploy with Netlify](https://img.shields.io/badge/Frontend-Netlify-00AD9F?style=flat-square&logo=Netlify)](https://soultranslator.netlify.app/)
[![Backend-Render](https://img.shields.io/badge/Backend-Render-46E3B7?style=flat-square&logo=Render)](https://render.com)
[![AI-Engine](https://img.shields.io/badge/AI_Engine-Gemini_1.5_Flash-4285F4?style=flat-square&logo=Google-Gemini)](https://deepmind.google/technologies/gemini/)

> **白天做你的“职场防弹衣”，晚上做你的“情感防空洞”。**
> 剥离对话里的阴阳怪气与字面噪声，深度还原对方的真实意图与心理动机，为你一键提供 4 套拿回聊天主动权的高情商“嘴替”回复脚本。拒绝精神内耗，把聊天主动权拿回来。

---

## 🌟 核心特性 (Key Features)

基于 V0.2 的重大架构重构，SoulTranslator 摆脱了传统 AI 工具单一、扁平的润色逻辑，重构为基于社会心理学支撑的**双端自适应人际关系分流矩阵**：

### 01 / 🧭 社交场域智能分流 (Multi-Domain Routing)
首创“情感卷入 × 利益博弈”双轴平行四象限布局，用户可一键锁定 4 种相互隔离的社交生态，让大模型后台动态调整语义分析权重，C 端网感痛点文案直击红心：
* ❤️ **恋爱 / 暧昧**：主打“看清红绿灯，拒绝精神内耗”。适用于爱人、伴侣或正在拉扯的对象。
* 👥 **朋友 / 人情**：主打“拒绝无效社交，手撕阴阳怪气”。适用于常规搭子、老同学或长辈亲戚往来。
* ⚖️ **老板 / 导师**：主打“高情商向上管理，反职场PUA”。适用于直属上级或掌握生存大权者。
* 💼 **同事 / 客户**：主打“对事不对人，严防甩锅背黑锅”。适用于平级协作、跨部门沟通及甲方接口人。

### 02 / 📊 苹果级极简悬浮气泡滑动条 (Dynamic Tooltip Slider)
彻底洗牌传统固定刻度导致的移动端排版错位，升级为**Web/Mobile 双端自适应的苹果级动态随动气泡**交互：
* **四层垂直货架隔离**：大标题、粉色小字、漂浮气泡、滑动条轨道、学术背书通过弹性盒子物理隔离，在任意窄屏机型下绝对防撞、防坐标重叠。
* **高空专属空域**：气泡强制 100% 漂浮在滑动条轨道的斜上方空域，小三角尖端垂直向下指向滑块，大拇指拖拽时文字绝无遮挡。
* **邓巴数动态圈层审计**：滑动条 1-4 档（如：从 `点头之交`、`业务扯皮` 演进至 `战壕搭子`）时，底部动态透出 **`[ 邓巴容量：15人核心圈 ]`** 等学术级容量提示。

### 03 / 🎭 4维结构化嘴替卡片专区 (Action Scripts Panel)
支持 **TEXT（文本输入）与 IMG（截图识别）** 双向投喂。后端提取语义后，一次性吐出 4 种具备极强策略属性的结构化嘴替脚本：
* **[ 直球推进 🚀 ]** · 破除无效拉扯，高效率推进事实。
* **[ 温柔共情 ❤️ ]** · 向下兼容，提供满格的心智与情绪价值。
* **[ 反向拿捏 🎭 ]** · 启动情绪太极，以守为攻，重新夺回对话掌控权。
* **[ 体面退场 🛡️ ]** · 优雅糊弄，建立高情商防火墙，明确边界不留话柄。
* **全端防挤压复制按钮**：复制（剪贴板）按钮采用右上角绝对定位悬浮（`absolute top-4 right-4`），加持 `flex-shrink-0` 硬度，在窄屏下**绝不变形、绝不扁塌、绝不与文本重叠**。

---

## 🧠 底层科学背书 (Theoretical Foundation)

本软件的去噪算法与分流机制拥有严谨的社会科学理论支撑：
1. **米契尔社会场域理论 (Social Domain Theory)**：将“私人情感场域（感性互惠）”与“公共职场场域（契约合规）”在底层代码级进行解耦，保证 AI 不会交浅言深。
2. **社会交换理论 (Social Exchange Theory)**：识别沟通互动中交换的“特殊性资源（安全感）”与“通用性资源（利益）”，精确诊断内耗源头。
3. **舒茨人际关系三维理论 (FIRO Theory)**：围绕“控制（Control）”与“情感（Affection）”两大核心驱动力，专门针对向上管理（支配关系）进行 Prompt 深度优化。

---

## 🛠️ 项目架构 (Repository Structure)

项目采用现代前后端分离架构（Jamstack 模式）部署：

```text
soultranslator/
├── frontend/             # 前端项目 (HTML5 / Tailwind CSS / Live Deployment)
│   └── (已托管至 Netlify 云端，完美适配 Web / Mobile 移动端原生浏览器)
└── backend/              # 后端服务 (Node.js / Distributed Service)
    ├── (已部署至 Render 云端代理端口)
    └── OCR & LLM Router  # 调用 Gemini 1.5 Flash 接口提供流式/结构化 JSON 输出
