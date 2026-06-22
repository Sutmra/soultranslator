# feature-agnes-model.md — 接入 Agnes AI 免费模型（可切换 provider，含风险落盘）

> Phase 4 增强。**纯 `backend/` 改动**（共享片区，走 `feat/be-agnes`，后端单独 PR + Sutmra 双审）。
> 密钥 `AGNES_API_KEY` 写项目外 `D:\secrets\soultranslator\.env`，AI 不读，只在代码用环境变量。详见 [[security-external-config]]。

## 决策（2026-06-21）
- `/api/analyze` 的分析模型做成 **env 可切换 provider**：`ANALYZE_PROVIDER`（`deepseek` | `agnes`，**缺省 = deepseek**）。
- **本地和生产（Render）都可切换**：当前阶段网页/小程序都还是「我们自己测试」，所以**生产也允许临时切 Agnes** 跑 `agnes-2.0-flash`（免费），自担风险。
- **默认 DeepSeek**：不设 env / 设错 → 走 DeepSeek，行为不变。**切回只需改 Render 环境变量 `ANALYZE_PROVIDER=deepseek`（无需改代码、重启即可）**。

## ⚠️ 风险落盘（用户知情并接受测试期使用）
Agnes 是 OpenAI 兼容的免费 AI 网关（新加坡 Singapore Sapiens Technology Pte）。其服务条款对本产品有实质风险：

1. **默认拿输入训练（8.2）**：原文「使用客户数据来改进……AI 模型（**包括但不限于训练和微调**），**除非……（如果有）选择退出**」→ **默认 opt-out 训练，退出开关「如果有」可能不存在**。输出（8.1）也可能被用于改进服务。
2. **法律责任转嫁（8.3）**：使用方需担保「已获最终用户同意、合规 GDPR/CCPA/HIPAA」。本产品输入是用户粘的**第三方私聊/截图**，现实拿不到「对方」同意 → 合规暴露。
3. **输入高敏感**：SoulTranslator 的输入本质是私密人际对话。
4. **免费档不透明**：RPM 限流具体数字未公开、稳定性/SLA 无保证。
5. **json_object 支持未确认**：`/api/analyze` 依赖严格 JSON；Agnes 支持 tool-calling 但 `response_format:json_object` 未证实（已有「去 fence 取首尾大括号」兜底）。
6. 安全措施本身（TLS、静态加密、访问控制、审计，第 9 条）属标准水平，非风险点。

## 切回 / 正式上线前的责任（不是硬禁止，是必须记得）
- 现阶段「自测」用 Agnes 可接受；**一旦面向真实/外部用户**（尤其小程序公开发布、推广引流后），**把生产 `ANALYZE_PROVIDER` 切回 `deepseek`**。
- 若将来真要用 Agnes 正式上线：前置 ① 确认并开启「退出训练」开关 ② 给用户加隐私告知（内容会发送第三方 AI 处理）③ 保持默认关、可切换。
- 因默认是 DeepSeek + 一个环境变量即可切回，风险随时可控、可逆。

## 实现计划（小，后端为主）
| 步 | 内容 | 验证标准 |
|---|---|---|
| 1 | `/api/analyze` 抽出 provider 配置：`ANALYZE_PROVIDER`(deepseek/agnes) 决定 URL/key/model；默认 deepseek 行为不变 | 不设 env → 与现在等价（回归）；设 agnes + 本地 key → 打到 apihub.agnes-ai.com、出结构化 JSON |
| 2 | （可选）实验脚本：同一批真实案例 A/B 跑 agnes-2.0-flash vs deepseek-chat，实测 ① json 解析稳不稳 ② 质量差多少 ③ 连发观察限流 | 三项有数据；据此决定测试期是否真用 |

- Agnes：Base `https://apihub.agnes-ai.com/v1/chat/completions`，Bearer `AGNES_API_KEY`，model `agnes-2.0-flash`，OpenAI 兼容。
- `/api/chat`、`/api/ocr`、DeepSeek 路径都不动。

## 当前光标
**下一步 = 步骤 1**（后端 provider 可切换，默认 DeepSeek）。前置：用户把 `AGNES_API_KEY` 填进本地 env（我不读）。实现后本地验证：默认走 DeepSeek 回归不变 + 切 agnes 能出结果。
