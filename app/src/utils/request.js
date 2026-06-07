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
