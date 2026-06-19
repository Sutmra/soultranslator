// 选取图片并转成纯 base64（去 data 前缀），供 /api/ocr 用。
// 支持一次多选；条件编译屏蔽两端差异：H5 用 FileReader 读 blob；小程序用 getFileSystemManager 读文件。

const MAX_SIZE = 5 * 1024 * 1024 // 单张 5MB

/**
 * 选取最多 count 张图片，返回 [{ base64, mime, path }]（取消返回 []，超 5MB 的自动跳过）。
 */
export function chooseImagesBase64(count = 1) {
  return new Promise((resolve, reject) => {
    uni.chooseImage({
      count: Math.max(1, count),
      sizeType: ['compressed'],
      success: async (res) => {
        const paths = res.tempFilePaths || []
        const files = res.tempFiles || []
        try {
          const out = []
          for (let i = 0; i < paths.length; i++) {
            const file = files[i]
            if (file && file.size && file.size > MAX_SIZE) continue // 超大跳过
            const mime = (file && file.type) || 'image/jpeg'
            const base64 = await pathToBase64(paths[i])
            out.push({ base64, mime, path: paths[i] })
          }
          resolve(out)
        } catch (e) {
          reject(new Error('读取图片失败'))
        }
      },
      fail: (err) => {
        const msg = (err && err.errMsg) || ''
        if (/cancel/i.test(msg)) resolve([])
        else reject(new Error(msg || '选择图片失败'))
      },
    })
  })
}

function pathToBase64(path) {
  // #ifdef H5
  return blobUrlToBase64(path)
  // #endif
  // #ifndef H5
  return new Promise((resolve, reject) => {
    uni.getFileSystemManager().readFile({
      filePath: path,
      encoding: 'base64',
      success: (r) => resolve(r.data),
      fail: () => reject(new Error('读取图片失败')),
    })
  })
  // #endif
}

// #ifdef H5
function blobUrlToBase64(blobUrl) {
  return fetch(blobUrl)
    .then((r) => r.blob())
    .then(
      (blob) =>
        new Promise((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = () => {
            const result = String(reader.result || '')
            const comma = result.indexOf(',')
            resolve(comma >= 0 ? result.slice(comma + 1) : result)
          }
          reader.onerror = reject
          reader.readAsDataURL(blob)
        })
    )
}
// #endif
