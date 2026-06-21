<template>
  <view class="page">
    <!-- HEADER -->
    <view class="header">
      <text class="brand">SOULTRANSLATOR</text>
      <text class="title">灵魂翻译官</text>
      <text class="intl">DECODE WHAT THEY <text class="mag">REALLY</text> MEAN · <text class="acid">WIN THE CHAT</text></text>
    </view>

    <view class="rule"></view>

    <!-- 模式切换：分段控件（通用 / 学校场景·教师端） -->
    <view class="segctl">
      <view class="seg" :class="{ on: mode==='general' }" @click="switchMode('general')">💬 通用</view>
      <view class="seg" :class="{ on: mode==='school' }" @click="switchMode('school')">🎓 学校场景</view>
    </view>

    <!-- STEP 01 场景 / 对方角色 -->
    <view class="step"><text class="no">01</text><text class="h2">{{ mode==='school' ? '选择对方' : '选择场景' }}</text><text class="hint">{{ mode==='school' ? 'ROLE' : 'SCENE' }}</text></view>
    <scene-tabs v-if="mode==='general'" :scenes="scenes" v-model="scene" />
    <scene-tabs v-else :scenes="roleTabs" v-model="role" />
    <view v-if="!scenes.length" class="scene-fallback">
      <text>{{ scenesErr || '加载场景中…' }}</text>
      <text v-if="scenesErr" class="retry" @click="loadScenes">点此重试</text>
    </view>

    <!-- STEP 02 关系深度 / 对方状态 -->
    <view class="step"><text class="no">02</text><text class="h2">{{ mode==='school' ? '对方状态' : '关系深度' }}</text><text class="hint">{{ mode==='school' ? 'LEVEL ×4' : 'DUNBAR ×4' }}</text></view>
    <relation-slider :levels="sliderLevels" :tips="sliderTips" :dunbar-capacity="sliderDunbar" v-model="level" />

    <!-- STEP 03 INPUT -->
    <view class="step"><text class="no">03</text><text class="h2">投喂对话</text><text class="hint">TEXT / IMG</text></view>
    <view class="inputgrid">
      <textarea
        class="ta"
        v-model="text"
        placeholder="把 TA 说的话粘进来…例如：「在忙，回头聊」「随便你吧」「你开心就好」"
        placeholder-class="ta-ph"
        :maxlength="-1"
      />
      <text class="orline">或 上传聊天截图（可多张，AI 自动 OCR 识别）</text>
      <view v-if="images.length === 0" class="drop" @click="onUploadTap">
        <text class="ic">📸</text>
        <text class="drop-t">点击上传聊天截图</text>
        <text class="drop-s">.jpg .png · ≤ 5MB · 最多 {{ maxImages }} 张</text>
      </view>
      <view v-else class="thumbs">
        <view class="thumb" v-for="(img, i) in images" :key="i">
          <image class="thumb-img" :src="img.preview" mode="aspectFill" />
          <view class="thumb-x" @click.stop="removeImage(i)">×</view>
        </view>
        <view v-if="images.length < maxImages" class="thumb-add" @click="onUploadTap">＋</view>
      </view>
    </view>

    <!-- GO -->
    <view class="go" :class="{ 'go-loading': loading }" @click="onGoTap">
      <text class="go-txt">{{ loading ? loadingLabel : '开始解密灵魂' }}</text>
      <text class="arrow" v-if="!loading">→</text>
    </view>

    <text v-if="errMsg" class="errmsg">{{ errMsg }}</text>

    <!-- 分析结果 -->
    <result-panel :data="result" :is-school="resultIsSchool" />

    <!-- 转发（微信原生，仅小程序） -->
    <!-- #ifdef MP-WEIXIN -->
    <button class="share-btn" open-type="share">转发给好友 →</button>
    <!-- #endif -->

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
import { analyze, ocrImages, getScenes } from '@/utils/request'
import { chooseImagesBase64 } from '@/utils/image'

export default {
  components: { SceneTabs, RelationSlider, ResultPanel },
  computed: {
    shareTitle() {
      const st =
        this.result &&
        this.result.relationship_status &&
        this.result.relationship_status.status_title
      return st
        ? `「${st}」—— 灵魂翻译官帮我看穿了潜台词`
        : '灵魂翻译官 · 看穿聊天潜台词，拿回主动权'
    },
    // 场景配置（来自后端 /api/scenes，单一来源）
    scenes() {
      return (this.scenesData && this.scenesData.scenes) || []
    },
    curSceneCfg() {
      return this.scenes.find((s) => s.key === this.scene) || null
    },
    curLevels() {
      return this.curSceneCfg ? this.curSceneCfg.levels : []
    },
    curTips() {
      return this.curSceneCfg ? this.curSceneCfg.tips : []
    },
    dunbarCapacity() {
      return (this.scenesData && this.scenesData.dunbarCapacity) || []
    },
    // 学校场景配置（来自 /api/scenes 的 school 块）
    school() {
      return (this.scenesData && this.scenesData.school) || null
    },
    // 复用 SceneTabs 渲染 4 个教师端角色卡（algo 上注释 + desc 下描述，与场景卡对齐）
    roleTabs() {
      return this.school
        ? this.school.roles.map((r) => ({ key: r.key, emoji: r.emoji, title: r.title, desc: r.desc, algo: r.algo }))
        : []
    },
    curRole() {
      return this.school ? this.school.roles.find((r) => r.key === this.role) : null
    },
    // 滑块档位随模式切换：通用=邓巴亲密度，学校=该角色的配合↔难缠度
    sliderLevels() {
      return this.mode === 'school' ? (this.curRole ? this.curRole.levels : []) : this.curLevels
    },
    sliderTips() {
      return this.mode === 'school' ? (this.curRole ? this.curRole.tips : []) : this.curTips
    },
    sliderDunbar() {
      return this.mode === 'school' ? [] : this.dunbarCapacity
    },
  },
  onLoad() {
    this.loadScenes()
  },
  onShow() {
    // #ifdef MP-WEIXIN
    uni.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline'],
    })
    // #endif
  },
  // 微信转发好友
  onShareAppMessage() {
    return { title: this.shareTitle, path: '/pages/index/index' }
  },
  // 微信分享朋友圈
  onShareTimeline() {
    return { title: this.shareTitle }
  },
  data() {
    return {
      scene: 'intimate',
      mode: 'general', // 'general' 通用四象限 / 'school' 学校场景·教师端
      role: 'parent',  // 学校模式下选中的教师端角色
      level: 1,
      scenesData: null, // { scenes:[...], dunbarCapacity:[...], school:{...} }，来自 /api/scenes
      scenesErr: '',
      text: '',
      images: [], // [{ base64, mime, preview }]
      maxImages: 6,
      loading: false,
      loadingLabel: '正在剥离情绪伪装…',
      result: null,
      resultIsSchool: false, // 当前结果是否来自学校模式（决定结果面板标签）
      errMsg: '',
    }
  },
  methods: {
    // B2：切换通用 / 学校场景模式，档位归位
    switchMode(m) {
      if (this.loading || this.mode === m) return
      this.mode = m
      this.level = 1
    },
    // A3：拉场景配置。先用本地缓存即时渲染（离线/冷启动也有内容），再后台拉最新覆盖
    async loadScenes() {
      try {
        const cached = uni.getStorageSync('st_scenes')
        if (cached && cached.scenes && cached.scenes.length) this.scenesData = cached
      } catch (e) {}
      try {
        const data = await getScenes()
        if (data && data.scenes && data.scenes.length) {
          this.scenesData = data
          this.scenesErr = ''
          try { uni.setStorageSync('st_scenes', data) } catch (e) {}
        }
      } catch (e) {
        if (!this.scenes.length) this.scenesErr = '场景加载失败，请检查网络后重试'
      }
    },
    // Step 5：选取聊天截图
    async onUploadTap() {
      if (this.loading) return
      const remain = this.maxImages - this.images.length
      if (remain <= 0) {
        uni.showToast({ title: `最多上传 ${this.maxImages} 张`, icon: 'none' })
        return
      }
      try {
        const picked = await chooseImagesBase64(remain)
        picked.forEach((img) => {
          this.images.push({
            base64: img.base64,
            mime: img.mime,
            // base64 data URL 预览，两端通用（比 blob/wxfile 临时路径稳）
            preview: `data:${img.mime};base64,${img.base64}`,
          })
        })
      } catch (e) {
        uni.showToast({ title: (e && e.message) || '选择图片失败', icon: 'none' })
      }
    },
    removeImage(i) {
      this.images.splice(i, 1)
    },
    // Step 4/5：有图先 OCR，再走文字分析
    async onGoTap() {
      if (this.loading) return
      if (!this.text.trim() && !this.images.length) {
        uni.showToast({ title: '请先输入文字或上传截图', icon: 'none' })
        return
      }
      this.loading = true
      this.errMsg = ''
      this.result = null
      try {
        let finalText = this.text.trim()
        if (this.images.length) {
          this.loadingLabel = '正在识别截图文字…'
          // 多张一次发后端，Gemini 当连续对话读 → 顺序/说话人/去重连贯
          const ocrText = await ocrImages(this.images)
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
        const isSchool = this.mode === 'school'
        this.result = await analyze(
          isSchool
            ? { scene: 'school', role: this.role, level: this.level, text: finalText }
            : { scene: this.scene, level: this.level, text: finalText }
        )
        this.resultIsSchool = isSchool
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

/* 模式切换：分段控件（一个胶囊容器，选中段填青柠） */
.segctl {
  display: flex;
  background: $st-panel;
  border: 2rpx solid $st-line;
  border-radius: 999rpx;
  padding: 6rpx;
  margin: 8rpx 0;
}
.seg {
  flex: 1;
  text-align: center;
  padding: 16rpx 0;
  border-radius: 999rpx;
  color: $st-muted;
  font-size: 26rpx;
  font-weight: 700;
  transition: 0.2s;
}
.seg.on {
  background: $st-acid;
  color: $st-bg;
}

/* 场景加载/失败兜底 */
.scene-fallback {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 32rpx;
  font-size: 24rpx;
  color: $st-dim;
}
.scene-fallback .retry {
  margin-top: 12rpx;
  color: $st-acid;
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

/* 截图缩略图（多张） */
.thumbs {
  display: flex;
  flex-wrap: wrap;
}
.thumb {
  position: relative;
  width: 160rpx;
  height: 160rpx;
  margin: 0 18rpx 18rpx 0;
}
.thumb-img {
  width: 100%;
  height: 100%;
  border-radius: 16rpx;
  border: 2rpx solid $st-line;
  display: block;
}
.thumb-x {
  position: absolute;
  top: -14rpx;
  right: -14rpx;
  width: 40rpx;
  height: 40rpx;
  line-height: 36rpx;
  text-align: center;
  border-radius: 50%;
  background: $st-red;
  color: #fff;
  font-size: 28rpx;
}
.thumb-add {
  width: 160rpx;
  height: 160rpx;
  margin-bottom: 18rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2rpx dashed $st-line;
  border-radius: 16rpx;
  color: $st-dim;
  font-size: 56rpx;
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

/* 转发按钮（微信原生 button，重置默认样式） */
.share-btn {
  margin-top: 32rpx;
  padding: 28rpx;
  background: rgba(255, 46, 139, 0.06);
  border: 2rpx dashed $st-mag;
  border-radius: 24rpx;
  color: $st-mag;
  font-size: 28rpx;
  font-weight: 700;
  line-height: 1.4;
}
.share-btn::after {
  border: none;
}

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
