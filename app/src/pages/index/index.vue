<template>
  <view class="content">
    <image class="logo" src="/static/logo.png"></image>
    <view class="text-area">
      <text class="title">{{ title }}</text>
    </view>
  </view>
</template>

<script>
import { getViews } from '@/utils/request'

export default {
  data() {
    return {
      title: '正在连接后端…',
    }
  },
  onLoad() {
    this.testBackend()
  },
  methods: {
    async testBackend() {
      try {
        const res = await getViews()
        console.log('后端 /api/views 返回:', res)
        this.title = '后端连通 ✅ 浏览量: ' + res.count
      } catch (e) {
        console.error('后端请求失败:', e)
        this.title = '后端请求失败: ' + e.message
      }
    },
  },
}
</script>

<style>
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.logo {
  height: 200rpx;
  width: 200rpx;
  margin-top: 200rpx;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 50rpx;
}

.text-area {
  display: flex;
  justify-content: center;
  padding: 0 40rpx;
}

.title {
  font-size: 32rpx;
  color: #8f8f94;
  text-align: center;
}
</style>
