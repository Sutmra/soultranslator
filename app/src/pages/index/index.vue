<template>
  <view class="page">
    <!-- HEADER -->
    <view class="header">
      <text class="brand">SOULTRANSLATOR</text>
      <text class="title">灵魂翻译官</text>
      <text class="intl">DECODE WHAT THEY <text class="mag">REALLY</text> MEAN · <text class="acid">WIN THE CHAT</text></text>
    </view>

    <view class="rule"></view>

    <!-- STEP 01 SCENE -->
    <view class="step"><text class="no">01</text><text class="h2">选择场景</text><text class="hint">SCENE</text></view>
    <scene-tabs v-model="scene" />

    <!-- STEP 02 RELATIONSHIP -->
    <view class="step"><text class="no">02</text><text class="h2">关系深度</text><text class="hint">DUNBAR ×4</text></view>
    <relation-slider :scene="scene" v-model="level" />

    <!-- STEP 03 INPUT -->
    <view class="step"><text class="no">03</text><text class="h2">投喂对话</text><text class="hint">TEXT / IMG</text></view>
    <view class="inputgrid">
      <textarea
        class="ta"
        v-model="text"
        placeholder="把 TA 说的话粘进来…&#10;例如：「在忙，回头聊」「随便你吧」「你开心就好」"
        placeholder-class="ta-ph"
        :maxlength="-1"
      />
      <text class="orline">或 上传聊天截图（AI 自动 OCR 识别）</text>
      <view class="drop" @click="onUploadTap">
        <text class="ic">📸</text>
        <text class="drop-t">点击上传聊天截图</text>
        <text class="drop-s">.jpg .png · ≤ 5MB</text>
      </view>
    </view>

    <!-- GO -->
    <view class="go" @click="onGoTap">
      <text class="go-txt">开始解密灵魂</text>
      <text class="arrow">→</text>
    </view>

    <view class="footer">
      <text>SOULTRANSLATOR · 灵魂翻译官</text>
      <text>本工具输出仅供情绪参考与娱乐 · 真实关系请用真心经营 ✦</text>
    </view>
  </view>
</template>

<script>
import SceneTabs from '@/components/SceneTabs.vue'
import RelationSlider from '@/components/RelationSlider.vue'

export default {
  components: { SceneTabs, RelationSlider },
  data() {
    return {
      scene: 'intimate',
      level: 1,
      text: '',
    }
  },
  methods: {
    // Step 5 接入截图 OCR；此处先占位
    onUploadTap() {
      uni.showToast({ title: '截图识别将在后续步骤接入', icon: 'none' })
    },
    // Step 4 接入分析；此处先占位
    onGoTap() {
      uni.showToast({ title: '分析功能将在 Step 4 接入', icon: 'none' })
    },
  },
}
</script>

<style lang="scss">
.page {
  padding: 32rpx 32rpx 80rpx;
}

/* HEADER */
.header {
  display: flex;
  flex-direction: column;
  padding: 24rpx 0 8rpx;
}
.brand {
  font-family: 'Space Mono', monospace;
  font-size: 22rpx;
  letter-spacing: 4rpx;
  color: $st-dim;
}
.title {
  font-size: 64rpx;
  font-weight: 800;
  color: $st-ink;
  margin: 8rpx 0 12rpx;
}
.intl {
  font-family: 'Space Mono', monospace;
  font-size: 20rpx;
  letter-spacing: 1rpx;
  color: $st-muted;
  line-height: 1.6;
}
.intl .mag { color: $st-mag; font-weight: 700; }
.intl .acid { color: $st-acid; font-weight: 700; }

.rule {
  height: 2rpx;
  background: $st-line;
  margin: 28rpx 0;
}

/* STEP 标题 */
.step {
  display: flex;
  align-items: baseline;
  margin: 40rpx 0 20rpx;
}
.step .no {
  font-family: 'Space Mono', monospace;
  font-size: 24rpx;
  color: $st-acid;
  margin-right: 16rpx;
}
.step .h2 {
  font-size: 34rpx;
  font-weight: 700;
  color: $st-ink;
}
.step .hint {
  margin-left: auto;
  font-family: 'Space Mono', monospace;
  font-size: 20rpx;
  color: $st-dim;
}

/* INPUT */
.inputgrid {
  display: flex;
  flex-direction: column;
}
.ta {
  width: 100%;
  box-sizing: border-box;
  min-height: 200rpx;
  padding: 24rpx;
  background: $st-panel;
  border: 2rpx solid $st-line;
  border-radius: 24rpx;
  color: $st-ink;
  font-size: 28rpx;
  line-height: 1.6;
}
.ta-ph {
  color: $st-dim;
}
.orline {
  text-align: center;
  font-size: 22rpx;
  color: $st-dim;
  margin: 24rpx 0;
}
.drop {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 48rpx 24rpx;
  background: $st-panel;
  border: 2rpx dashed $st-line;
  border-radius: 24rpx;
}
.drop .ic { font-size: 56rpx; margin-bottom: 12rpx; }
.drop-t { font-size: 26rpx; color: $st-muted; margin-bottom: 6rpx; }
.drop-s { font-family: 'Space Mono', monospace; font-size: 20rpx; color: $st-dim; }

/* GO */
.go {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 48rpx;
  padding: 32rpx;
  background: $st-acid;
  border-radius: 24rpx;
}
.go-txt { font-size: 32rpx; font-weight: 800; color: $st-bg; }
.arrow { font-size: 32rpx; font-weight: 800; color: $st-bg; margin-left: 12rpx; }

/* FOOTER */
.footer {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 64rpx;
}
.footer text {
  font-size: 20rpx;
  color: $st-dim;
  line-height: 1.8;
  text-align: center;
}
</style>
