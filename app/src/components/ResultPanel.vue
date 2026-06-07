<template>
  <view class="result" v-if="data">
    <!-- MODULE A 真心话照妖镜 -->
    <view class="card">
      <view class="ctitle">🪞 真心话照妖镜<text class="tag">MODULE A</text></view>
      <view class="field">
        <text class="k">底层事实 / FACTS</text>
        <text class="v">{{ a.fact || a.facts || '—' }}</text>
      </view>
      <view class="field">
        <text class="k">真实心理动机 / MOTIVE</text>
        <text class="v mag">{{ a.motivation || '—' }}</text>
      </view>
      <view class="field" v-if="a.dunbar_audit">
        <text class="k">📊 邓巴能量审计 / DUNBAR AUDIT</text>
        <text class="v cyan">{{ a.dunbar_audit }}</text>
      </view>
      <view class="field">
        <text class="k">情绪温度计 / THERMOMETER</text>
        <view class="temp" v-for="t in temps" :key="t.label">
          <view class="temp-head">
            <text class="temp-l">{{ t.label }}</text>
            <text class="temp-n">{{ t.val }}</text>
          </view>
          <view class="temp-track">
            <view class="temp-fill" :style="{ width: t.val + '%', background: t.color }"></view>
          </view>
        </view>
      </view>
    </view>

    <!-- MODULE B 关系走向诊断 -->
    <view class="card">
      <view class="ctitle">🚦 关系走向诊断<text class="tag">MODULE B</text></view>
      <view class="traffic">
        <text class="light">{{ lightEmoji }}</text>
        <view class="t-info">
          <text class="rating">{{ rs.status_title || rs.rating || '—' }}</text>
          <text class="winrate">胜率预测：<text class="win-b">{{ rs.winning_rate || rs.win_rate || '—' }}</text></text>
        </view>
      </view>
    </view>

    <!-- MODULE C 高情商嘴替专区 -->
    <view class="card">
      <view class="ctitle">🎤 高情商嘴替专区<text class="tag">MODULE C</text></view>
      <view class="replies">
        <view class="reply" hover-class="reply-press" :hover-stay-time="80" v-for="(rp, i) in reps" :key="i">
          <view class="copy" hover-class="copy-press" :hover-stay-time="80" @click="copy(rp.content || rp.text)">
            <image class="copy-ic copy-ic--base" :src="copyIcon" />
            <image class="copy-ic copy-ic--hov" :src="copyIconHover" />
          </view>
          <text class="rl">{{ rp.strategy || rp.label }}</text>
          <text class="rt">{{ rp.content || rp.text }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'ResultPanel',
  props: {
    data: { type: Object, default: null },
  },
  data() {
    return {
      // 剪贴板线框图标（SVG base64，两端 <image> 通用）；hover 版为青柠色
      copyIcon:
        'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjOGE5MDk5IiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PHJlY3QgeD0iOSIgeT0iOSIgd2lkdGg9IjEzIiBoZWlnaHQ9IjEzIiByeD0iMiIgcnk9IjIiLz48cGF0aCBkPSJNNSAxNUg0YTIgMiAwIDAgMS0yLTJWNGEyIDIgMCAwIDEgMi0yaDlhMiAyIDAgMCAxIDIgMnYxIi8+PC9zdmc+',
      copyIconHover:
        'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjYzdmNTNhIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PHJlY3QgeD0iOSIgeT0iOSIgd2lkdGg9IjEzIiBoZWlnaHQ9IjEzIiByeD0iMiIgcnk9IjIiLz48cGF0aCBkPSJNNSAxNUg0YTIgMiAwIDAgMS0yLTJWNGEyIDIgMCAwIDEgMi0yaDlhMiAyIDAgMCAxIDIgMnYxIi8+PC9zdmc+',
    }
  },
  computed: {
    a() {
      return (this.data && this.data.analysis) || {}
    },
    m() {
      return this.a.metrics || {}
    },
    rs() {
      return (this.data && this.data.relationship_status) || {}
    },
    reps() {
      return (this.data && this.data.reply_scripts) || []
    },
    temps() {
      const m = this.m
      return [
        { label: '焦虑值', val: this.clamp(m.anxiety), color: '#37e6ff' },
        { label: '隐性攻击 / 阴阳值', val: this.clamp(m.passive_aggressive ?? m.passive_aggression), color: '#ff2e8b' },
        { label: '安全感缺乏度', val: this.clamp(m.insecurity), color: '#ffc53a' },
      ]
    },
    lightEmoji() {
      const c = (this.rs.light_color || 'yellow').toLowerCase()
      return c === 'green' ? '🟢' : c === 'red' ? '🔴' : '🟡'
    },
  },
  methods: {
    clamp(n) {
      const v = Number(n)
      if (isNaN(v)) return 0
      return Math.max(0, Math.min(100, Math.round(v)))
    },
    copy(text) {
      if (!text) return
      uni.setClipboardData({
        data: text,
        success: () => uni.showToast({ title: '已复制', icon: 'success' }),
        fail: () => uni.showToast({ title: '复制失败', icon: 'none' }),
      })
    },
  },
}
</script>

<style lang="scss">
.result {
  margin-top: 32rpx;
}
.card {
  background: $st-panel;
  border: 2rpx solid $st-line;
  border-radius: 24rpx;
  padding: 32rpx;
  margin-bottom: 24rpx;
}
.ctitle {
  display: flex;
  align-items: center;
  font-size: 30rpx;
  font-weight: 800;
  color: $st-ink;
  margin-bottom: 24rpx;
}
.tag {
  margin-left: auto;
  font-family: 'Space Mono', monospace;
  font-size: 18rpx;
  color: $st-dim;
}
.field {
  margin-bottom: 24rpx;
}
.field:last-child {
  margin-bottom: 0;
}
.k {
  display: block;
  font-family: 'Space Mono', monospace;
  font-size: 20rpx;
  color: $st-dim;
  margin-bottom: 10rpx;
}
.v {
  display: block;
  font-size: 27rpx;
  line-height: 1.7;
  color: $st-ink;
  padding-left: 20rpx;
  border-left: 4rpx solid $st-acid;
}
.v.mag { border-left-color: $st-mag; }
.v.cyan { border-left-color: $st-cyan; }

/* 温度计 */
.temp {
  margin-bottom: 18rpx;
}
.temp:last-child { margin-bottom: 0; }
.temp-head {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8rpx;
}
.temp-l { font-size: 22rpx; color: $st-muted; }
.temp-n { font-family: 'Space Mono', monospace; font-size: 22rpx; color: $st-ink; }
.temp-track {
  height: 12rpx;
  background: $st-panel-2;
  border-radius: 6rpx;
  overflow: hidden;
}
.temp-fill {
  height: 100%;
  border-radius: 6rpx;
}

/* 红绿灯 */
.traffic {
  display: flex;
  align-items: center;
}
.light {
  font-size: 72rpx;
  margin-right: 24rpx;
}
.t-info { display: flex; flex-direction: column; }
.rating { font-size: 30rpx; font-weight: 700; color: $st-ink; margin-bottom: 8rpx; }
.winrate { font-size: 24rpx; color: $st-muted; }
.win-b { color: $st-acid; font-weight: 700; }

/* 嘴替卡片 */
.reply {
  position: relative;
  background: $st-panel-2;
  border: 2rpx solid $st-line;
  border-radius: 18rpx;
  padding: 24rpx;
  margin-bottom: 18rpx;
  transition: 0.18s;
}
.reply:last-child { margin-bottom: 0; }
/* 四色顶边（青/品红/灰/青柠），两端通用 */
.reply:nth-child(1) { border-top: 4rpx solid $st-cyan; }
.reply:nth-child(2) { border-top: 4rpx solid $st-mag; }
.reply:nth-child(3) { border-top: 4rpx solid $st-muted; }
.reply:nth-child(4) { border-top: 4rpx solid $st-acid; }
.copy {
  position: absolute;
  top: 16rpx;
  right: 16rpx;
  width: 52rpx;
  height: 52rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.06);
  border: 2rpx solid $st-line;
  border-radius: 12rpx;
  transition: 0.15s;
}
.copy-ic {
  width: 30rpx;
  height: 30rpx;
}
.copy-ic--hov {
  display: none;
}

/* 按压反馈（hover-class，触摸端按住时生效，两端通用） */
.reply-press {
  border-color: #3a4049;
  transform: translateY(-4rpx);
}
.copy-press {
  border-color: $st-acid;
  background: rgba(199, 245, 58, 0.08);
}
.copy-press .copy-ic--base {
  display: none;
}
.copy-press .copy-ic--hov {
  display: block;
}

/* 桌面端 hover：卡片上浮 + 复制按钮变青柠（小程序无 hover，#ifdef 隔离） */
/* #ifdef H5 */
.reply:hover {
  border-color: #3a4049;
  transform: translateY(-4rpx);
}
.copy {
  cursor: pointer;
}
.copy:hover {
  border-color: $st-acid;
  background: rgba(199, 245, 58, 0.08);
}
.copy:hover .copy-ic--base {
  display: none;
}
.copy:hover .copy-ic--hov {
  display: block;
}
/* 宽屏：嘴替两列网格（窄屏/手机保持单列） */
@media (min-width: 600px) {
  .replies {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 18rpx;
  }
  .reply {
    margin-bottom: 0;
  }
}
/* #endif */
.rl {
  display: block;
  font-size: 26rpx;
  font-weight: 700;
  color: $st-acid;
  margin-bottom: 12rpx;
  padding-right: 72rpx;
}
.rt {
  display: block;
  font-size: 27rpx;
  line-height: 1.7;
  color: $st-ink;
}
</style>
