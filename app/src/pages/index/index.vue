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
      <view v-if="!imagePreview" class="drop" @click="onUploadTap">
        <text class="ic">📸</text>
        <text class="drop-t">点击上传聊天截图</text>
        <text class="drop-s">.jpg .png · ≤ 5MB</text>
      </view>
      <view v-else class="thumb">
        <image class="thumb-img" :src="imagePreview" mode="widthFix" />
        <view class="thumb-x" @click="removeImage">×</view>
      </view>
    </view>

    <!-- GO -->
    <view class="go" :class="{ 'go-loading': loading }" @click="onGoTap">
      <text class="go-txt">{{ loading ? loadingLabel : '开始解密灵魂' }}</text>
      <text class="arrow" v-if="!loading">→</text>
    </view>

    <text v-if="errMsg" class="errmsg">{{ errMsg }}</text>

    <!-- 分析结果 -->
    <result-panel :data="result" />

    <view class="footer">
      <text>SOULTRANSLATOR · 灵魂翻译官</text>
      <text>本工具输出仅供情绪参考与娱乐 · 真实关系请用真心经营 ✦</text>
    </view>
  </view>
</template>

<script>
import SceneTabs from '@/components/SceneTabs.vue'
import RelationSlider from '@/components/RelationSlider.vue'
import ResultPanel from '@/components/ResultPanel.vue'
import { analyze, ocrImage } from '@/utils/request'
import { chooseImageBase64 } from '@/utils/image'

export default {
  components: { SceneTabs, RelationSlider, ResultPanel },
  data() {
    return {
      scene: 'intimate',
      level: 1,
      text: '',
      imageBase64: null,
      imageMime: '',
      imagePreview: '',
      loading: false,
      loadingLabel: '正在剥离情绪伪装…',
      result: null,
      errMsg: '',
    }
  },
  methods: {
    // Step 5：选取聊天截图
    async onUploadTap() {
      if (this.loading) return
      try {
        const img = await chooseImageBase64()
        if (!img) return // 用户取消
        this.imageBase64 = img.base64
        this.imageMime = img.mime
        // 用 base64 data URL 预览，两端通用（比 blob/wxfile 临时路径稳）
        this.imagePreview = `data:${img.mime};base64,${img.base64}`
      } catch (e) {
        uni.showToast({ title: (e && e.message) || '选择图片失败', icon: 'none' })
      }
    },
    removeImage() {
      this.imageBase64 = null
      this.imageMime = ''
      this.imagePreview = ''
    },
    // Step 4/5：有图先 OCR，再走文字分析
    async onGoTap() {
      if (this.loading) return
      if (!this.text.trim() && !this.imageBase64) {
        uni.showToast({ title: '请先输入文字或上传截图', icon: 'none' })
        return
      }
      this.loading = true
      this.errMsg = ''
      this.result = null
      try {
        let finalText = this.text.trim()
        if (this.imageBase64) {
          this.loadingLabel = '正在识别截图文字…'
          const ocrText = await ocrImage(this.imageBase64, this.imageMime)
          if (ocrText === 'NOT_CHAT' || ocrText.length < 5) {
            if (!finalText) {
              throw new Error('图片里没有聊天对话，请上传微信/其他 App 的聊天截图')
            }
            uni.showToast({ title: '截图未识别到对话，仅分析文字', icon: 'none' })
          } else {
            finalText = finalText
              ? `${finalText}\n\n【截图识别内容】\n${ocrText}`
              : ocrText
          }
        }
        this.loadingLabel = '正在剥离情绪伪装…'
        this.result = await analyze({
          scene: this.scene,
          level: this.level,
          text: finalText,
        })
      } catch (e) {
        this.errMsg = (e && e.message) || '分析失败，请重试'
      } finally {
        this.loading = false
        this.loadingLabel = '正在剥离情绪伪装…'
      }
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

/* 截图缩略图 */
.thumb {
  position: relative;
  align-self: flex-start;
  width: 55%;
}
.thumb-img {
  width: 100%;
  border-radius: 18rpx;
  border: 2rpx solid $st-line;
  display: block;
}
.thumb-x {
  position: absolute;
  top: -16rpx;
  right: -16rpx;
  width: 44rpx;
  height: 44rpx;
  line-height: 40rpx;
  text-align: center;
  border-radius: 50%;
  background: $st-red;
  color: #fff;
  font-size: 30rpx;
}

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
.go-loading { opacity: 0.6; }

.errmsg {
  display: block;
  margin-top: 24rpx;
  padding: 20rpx 24rpx;
  background: rgba(255, 71, 71, 0.12);
  border: 2rpx solid $st-red;
  border-radius: 16rpx;
  color: $st-red;
  font-size: 24rpx;
  line-height: 1.6;
}

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
