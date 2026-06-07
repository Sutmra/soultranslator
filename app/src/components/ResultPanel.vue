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
      <view class="reply" v-for="(rp, i) in reps" :key="i">
        <text class="rl">{{ rp.strategy || rp.label }}</text>
        <text class="rt">{{ rp.content || rp.text }}</text>
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
  background: $st-panel-2;
  border: 2rpx solid $st-line;
  border-radius: 18rpx;
  padding: 24rpx;
  margin-bottom: 18rpx;
}
.reply:last-child { margin-bottom: 0; }
.rl {
  display: block;
  font-size: 26rpx;
  font-weight: 700;
  color: $st-acid;
  margin-bottom: 12rpx;
}
.rt {
  display: block;
  font-size: 27rpx;
  line-height: 1.7;
  color: $st-ink;
}
</style>
