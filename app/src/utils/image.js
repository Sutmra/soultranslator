// 选取图片并转成纯 base64（去 data 前缀），供 /api/ocr 用。
// 条件编译屏蔽两端差异：H5 用 FileReader 读 blob；小程序用 getFileSystemManager 读文件。

const MAX_SIZE = 5 * 1024 * 1024 // 5MB

export function chooseImageBase64() {
  return new Promise((resolve, reject) => {
    uni.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      success: (res) => {
        const path = res.tempFilePaths && res.tempFilePaths[0]
        const file = res.tempFiles && res.tempFiles[0]
        if (!path) {
          resolve(null)
          return
        }
        if (file && file.size && file.size > MAX_SIZE) {
          reject(new Error('图片不能超过 5MB'))
          return
        }
        const mime = (file && file.type) || 'image/jpeg'

        // #ifdef H5
        blobUrlToBase64(path)
          .then((base64) => resolve({ base64, mime, path }))
          .catch(() => reject(new Error('读取图片失败')))
        // #endif

        // #ifndef H5
        uni.getFileSystemManager().readFile({
          filePath: path,
          encoding: 'base64',
          success: (r) => resolve({ base64: r.data, mime, path }),
          fail: () => reject(new Error('读取图片失败')),
        })
        // #endif
      },
      fail: (err) => {
        // 用户主动取消不算错误
        const msg = (err && err.errMsg) || ''
        if (/cancel/i.test(msg)) resolve(null)
        else reject(new Error(msg || '选择图片失败'))
      },
    })
  })
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
