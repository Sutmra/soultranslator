<template>
  <view class="tabs">
    <view
      v-for="s in scenes"
      :key="s.key"
      class="tab"
      :class="{ on: s.key === modelValue }"
      @click="$emit('update:modelValue', s.key)"
    >
      <text class="algo">{{ s.algo }}</text>
      <text class="emo">{{ s.emoji }}</text>
      <text class="t">{{ s.title }}</text>
      <text class="d">{{ s.desc }}</text>
    </view>
  </view>
</template>

<script>
export default {
  name: 'SceneTabs',
  props: {
    // 场景卡片数据，由父级从后端 /api/scenes 拉取后传入
    scenes: { type: Array, default: () => [] },
    modelValue: { type: String, default: 'intimate' },
  },
  emits: ['update:modelValue'],
}
</script>

<style lang="scss">
.tabs {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}
.tab {
  position: relative;
  width: 48%;
  margin-bottom: 20rpx;
  box-sizing: border-box;
  padding: 28rpx 24rpx 24rpx;
  background: $st-panel;
  border: 2rpx solid $st-line;
  border-radius: 24rpx;
  display: flex;
  flex-direction: column;
  transition: all 0.18s;
}
.tab.on {
  border-color: $st-acid;
  background: $st-panel-2;
}
.algo {
  font-family: 'Space Mono', monospace;
  font-size: 18rpx;
  color: $st-dim;
  margin-bottom: 12rpx;
}
.tab.on .algo {
  color: $st-acid;
}
.emo {
  font-size: 44rpx;
  line-height: 1.2;
  margin-bottom: 8rpx;
}
.t {
  font-size: 30rpx;
  font-weight: 700;
  color: $st-ink;
  margin-bottom: 6rpx;
}
.d {
  font-size: 22rpx;
  color: $st-muted;
  line-height: 1.4;
}
</style>
