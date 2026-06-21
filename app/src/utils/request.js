// 统一网络请求封装
// uni.request 在 H5 和微信小程序两端都可用，无需为基础请求做条件编译。
import { CONFIG } from './config'

/**
 * 发起请求，返回 Promise（resolve 后端返回的 data）。
 * @param {string} path  以 / 开头的接口路径，如 '/api/views'
 * @param {object} opts  { method, data, header }
 */
export function request(path, { method = 'GET', data, header } = {}) {
  return new Promise((resolve, reject) => {
    uni.request({
      url: CONFIG.BASE_URL + path,
      method,
      data,
      timeout: 60000, // Render 免费套餐冷启动可能较慢，给足超时
      header: {
        'Content-Type': 'application/json',
        ...(CONFIG.API_KEY ? { Authorization: 'Bearer ' + CONFIG.API_KEY } : {}),
        ...(header || {}),
      },
      success: (res) => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(res.data)
        } else {
          reject(new Error('HTTP ' + res.statusCode + ' ' + JSON.stringify(res.data)))
        }
      },
      fail: (err) => reject(new Error(err.errMsg || '网络请求失败')),
    })
  })
}

// 浏览量计数 —— 用作 Step 2 的最简连通性验证
export function getViews() {
  return request('/api/views', { method: 'GET' })
}

// 截图 OCR —— 把多张图片一次发给后端 /api/ocr(Gemini 当连续对话读)，返回合并后的对话文字
// images: [{ base64, mime }]
export function ocrImages(images) {
  return request('/api/ocr', {
    method: 'POST',
    data: {
      images: images.map((i) => ({ imageData: i.base64, mimeType: i.mime })),
    },
  }).then((data) => (data.text || '').trim())
}

// 场景配置 —— 拉后端 /api/scenes（D11-B：场景/档位/邓巴 meta 单一来源）
// 返回 { scenes:[{key,emoji,title,desc,algo,levels[4],tips[4]}], dunbarCapacity[4] }
export function getScenes() {
  return request('/api/scenes', { method: 'GET' })
}

// 灵魂翻译分析 —— 调后端 /api/analyze（大脑在后端），直接拿结构化 JSON
// role 仅学校场景需要（scene='school'）；通用四象限不传，后端忽略
export function analyze({ scene, level, text, role }) {
  return request('/api/analyze', {
    method: 'POST',
    data: { scene, level, text, role },
  })
}
