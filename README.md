# 🎭 SoulTranslator (灵魂翻译器) · V0.2

[![Deploy with Netlify](https://img.shields.io/badge/Frontend-Netlify-00AD9F?style=flat-square&logo=Netlify)](https://www.netlify.com)
[![Deploy with Render](https://img.shields.io/badge/Backend-Render-46E3B7?style=flat-square&logo=Render)](https://render.com)
[![Model-Gemini](https://img.shields.io/badge/AI_Engine-Gemini_1.5_Flash-4285F4?style=flat-square&logo=Google-Gemini)](https://deepmind.google/technologies/gemini/)

> **白天帮你做“职场防弹衣”，晚上陪你做“情感防空洞”。**
> 剥离对话里的阴阳怪气与字面噪声，看清人际关系局势，为你提供开箱即用的 4 套高情商“嘴替”回复脚本。拒绝精神内耗，把聊天主动权拿回来。

---

## 🌟 核心特性 (Key Features)

基于 V0.2 的重大升级，SoulTranslator 摆脱了传统 AI 润色工具的单薄语调，重构为基于社会心理学支撑的**四大平行社交场域矩阵**：

### 1. 🧭 四大平行社交场景 (Parallel Social Domains)
用户可在输入端精准锁定对话关系，AI 将自动路由至独立提示词链并“看人下菜碟”：
* ❤️ **恋爱 / 暧昧 (Intimate)**：主打“看清红绿灯，拒绝精神内耗”。适用于爱人、伴侣或正在拉扯的对象。
* 👥 **朋友 / 人情 (Casual)**：主打“拒绝无效社交，手撕阴阳怪气”。适用于常规搭子、老同学或长辈亲戚。
* ⚖️ **老板 / 导师 (Authority)**：主打“高情商向上管理，反职场PUA”。适用于直属上级或掌握生存大权者。
* 💼 **同事 / 客户 (Colleague)**：主打“对事不对人，严防甩锅背黑锅”。适用于平级同事与跨部门业务推进。

### 📊 2. 邓巴数级动态深度联动 (Contextual Slider)
独创滑块联动组件，滑动 1-4 档（关系深度）时，标签自动切换为最懂人性的 C 端直观痛点：
* 恋爱场域：`雾里看花` ➔ `上头期间` ➔ `拉扯交替` ➔ `命运绑定`
* 老板场域：`职场新人` ➔ `靠谱骨干` ➔ `职场渡劫` ➔ `嫡系盟友`

### 🎭 3. 四维结构化高情商回复卡片 (4-Dimensional Action Scripts)
后端接口严格执行结构化输出，一次性吐出 4 种具备极强策略属性的嘴替脚本：
* **[ 直球推进 🚀 ]** · 打破僵局，直戳核心。
* **[ 温柔共情 ❤️ ]** · 向下兼容，提供核心情绪价值。
* **[ 反向拿捏/情绪太极 🎭 ]** · 高情商反拉扯/高级防御免责，重新夺回对话掌控权。
* **[ 体面糊弄/退场 🛡️ ]** · 优雅降温，明确边界，不留把柄。

---

## 🧠 理论背书 (Theoretical Foundation)

本软件的底层去噪与策略算法拥有严谨的社会科学理论支撑：
1. **米契尔的社会场域理论 (Social Domain Theory)**：将“私人情感场域（感性互惠）”与“公共职场场域（契约合规）”进行底层代码级的解耦与分流。
2. **社会交换理论 (Social Exchange Theory)**：识别沟通互动中交换的“特殊性资源（爱/心理安全）”与“通用性资源（利益/免责）”，精确诊断内耗源头。
3. **舒茨的人际关系三维理论 (FIRO Theory)**：围绕“控制（Control）”与“情感（Affection）”两大核心驱动力，专门针对向上管理（支配关系）进行 Prompt 深度优化。

---

## 🛠️ 项目架构 (Repository Structure)

项目采用前后端分离架构部署：

```text
soultranslator/
├── frontend/             # 前端项目 (HTML5 / Tailwind CSS / Vue or React)
│   └── (已部署至 Netlify)
└── backend/              # 后端服务 (Node.js or Python)
    ├── (已部署至 Render)
    └── OCR & LLM Router  # 调用 Gemini 1.5 Flash 接口提供结构化 JSON 输出
