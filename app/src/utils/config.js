// 后端与模型配置 —— 改这里即可切换环境
// 开发期：现有 Render 后端（需在微信开发者工具勾选「不校验合法域名」）
// 上线前：改成已备案的国内域名，如 https://api.soultranslator.cn
export const CONFIG = {
  BASE_URL: 'https://soultranslator-backend.onrender.com',
  API_KEY: '',            // 密钥藏在后端，前端留空
  MODEL: 'deepseek-chat', // 与现网页保持一致
}
