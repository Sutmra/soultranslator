<template>
  <view class="sliderbox">
    <!-- LEVEL 标签：右上角 -->
    <text class="lvl-no">LEVEL {{ modelValue }} / 4</text>

    <!-- 档位文本 -->
    <view class="lvl-text">
      <text class="lvl-label">{{ levelLabel }}</text>
      <text class="lvl-sub">{{ levelTip }}</text>
    </view>

    <!-- 滑轨 + 随动气泡 -->
    <view class="rail-pad">
      <view
        class="rail"
        @touchstart="onDown"
        @touchmove.stop.prevent="onMove"
        @touchend="onUp"
        @mousedown="onDown"
      >
        <!-- 已填充轨道 -->
        <view class="rail-fill" :style="{ width: pct + '%' }"></view>
        <!-- 4 个刻度点 -->
        <view
          v-for="i in 4"
          :key="i"
          class="tick"
          :class="{ active: i <= modelValue }"
          :style="{ left: ((i - 1) / 3 * 100) + '%' }"
        ></view>
        <!-- 滑块 -->
        <view class="thumb" :style="{ left: pct + '%' }"></view>
        <!-- 漂浮气泡 -->
        <view class="bubble" :style="{ left: pct + '%' }">
          <text class="bubble-txt">{{ levelLabel }}</text>
          <view class="bubble-arrow"></view>
        </view>
      </view>
    </view>

    <!-- 邓巴容量提示 -->
    <text class="dunbar-hint">[ 邓巴容量：{{ dunbar }} ]</text>
  </view>
</template>

<script>
import { DUNBAR_SLIDER_CONFIG, DUNBAR_CAPACITY } from '@/utils/sceneConfig'

export default {
  name: 'RelationSlider',
  props: {
    scene: { type: String, default: 'intimate' },
    modelValue: { type: Number, default: 1 },
  },
  emits: ['update:modelValue'],
  data() {
    return { rect: null, dragging: false }
  },
  computed: {
    cfg() {
      return DUNBAR_SLIDER_CONFIG[this.scene] || DUNBAR_SLIDER_CONFIG.intimate
    },
    levelLabel() {
      return this.cfg.levels[this.modelValue - 1]
    },
    levelTip() {
      return this.cfg.tips[this.modelValue - 1]
    },
    dunbar() {
      return DUNBAR_CAPACITY[this.modelValue - 1]
    },
    pct() {
      return ((this.modelValue - 1) / 3) * 100
    },
  },
  methods: {
    // 取指针横坐标：兼容触摸(手机/小程序)与鼠标(H5 桌面)
    getX(e) {
      const p =
        (e.touches && e.touches[0]) ||
        (e.changedTouches && e.changedTouches[0]) ||
        e
      return p.clientX
    },
    applyX(x) {
      const rect = this.rect
      if (!rect || !rect.width) return
      let ratio = (x - rect.left) / rect.width
      ratio = Math.max(0, Math.min(1, ratio))
      const level = Math.round(ratio * 3) + 1
      if (level !== this.modelValue) {
        this.$emit('update:modelValue', level)
      }
    },
    // 按下/点击：开始拖动，每次重新量一次滑轨位置
    onDown(e) {
      this.dragging = true
      const x = this.getX(e)
      uni
        .createSelectorQuery()
        .in(this)
        .select('.rail')
        .boundingClientRect((rect) => {
          this.rect = rect
          this.applyX(x)
        })
        .exec()
      // #ifdef H5
      // 桌面鼠标：拖动时挂到 window，移出滑轨也能继续拖
      this._mm = (ev) => this.onMove(ev)
      this._mu = () => this.onUp()
      window.addEventListener('mousemove', this._mm)
      window.addEventListener('mouseup', this._mu)
      // #endif
    },
    onMove(e) {
      if (!this.dragging) return
      this.applyX(this.getX(e))
    },
    onUp() {
      this.dragging = false
      // #ifdef H5
      if (this._mm) window.removeEventListener('mousemove', this._mm)
      if (this._mu) window.removeEventListener('mouseup', this._mu)
      // #endif
    },
  },
}
</script>

<style lang="scss">
.sliderbox {
  position: relative;
  background: $st-panel;
  border: 2rpx solid $st-line;
  border-radius: 24rpx;
  padding: 36rpx 32rpx 32rpx;
}
.lvl-no {
  position: absolute;
  top: 32rpx;
  right: 32rpx;
  font-family: 'Space Mono', monospace;
  font-size: 22rpx;
  color: $st-dim;
}
.lvl-text {
  display: flex;
  flex-direction: column;
  padding-right: 160rpx;
  margin-bottom: 96rpx;
}
.lvl-label {
  font-size: 44rpx;
  font-weight: 800;
  color: $st-acid;
  margin-bottom: 8rpx;
}
.lvl-sub {
  font-size: 24rpx;
  color: $st-muted;
  line-height: 1.5;
}

/* 滑轨 */
.rail-pad {
  padding: 0 24rpx;
}
.rail {
  position: relative;
  height: 12rpx;
  background: $st-line;
  border-radius: 6rpx;
}
.rail-fill {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  background: $st-acid;
  border-radius: 6rpx;
}
.tick {
  position: absolute;
  top: 50%;
  width: 14rpx;
  height: 14rpx;
  margin-left: -7rpx;
  margin-top: -7rpx;
  border-radius: 50%;
  background: $st-panel;
  border: 2rpx solid $st-dim;
}
.tick.active {
  border-color: $st-acid;
  background: $st-acid;
}
.thumb {
  position: absolute;
  top: 50%;
  width: 40rpx;
  height: 40rpx;
  margin-left: -20rpx;
  margin-top: -20rpx;
  border-radius: 50%;
  background: $st-ink;
  border: 4rpx solid $st-acid;
  box-shadow: 0 4rpx 16rpx rgba(199, 245, 58, 0.4);
}
/* 漂浮气泡：钉在滑块斜上方 */
.bubble {
  position: absolute;
  bottom: 48rpx;
  transform: translateX(-50%);
  background: $st-acid;
  border-radius: 12rpx;
  padding: 8rpx 18rpx;
  white-space: nowrap;
}
.bubble-txt {
  font-size: 24rpx;
  font-weight: 700;
  color: $st-bg;
}
.bubble-arrow {
  position: absolute;
  left: 50%;
  bottom: -10rpx;
  margin-left: -8rpx;
  width: 0;
  height: 0;
  border-left: 8rpx solid transparent;
  border-right: 8rpx solid transparent;
  border-top: 12rpx solid $st-acid;
}
.dunbar-hint {
  display: block;
  margin-top: 28rpx;
  text-align: center;
  font-family: 'Space Mono', monospace;
  font-size: 22rpx;
  letter-spacing: 1rpx;
  color: $st-dim;
}
</style>
