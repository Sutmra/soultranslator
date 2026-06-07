<script>
export default {
  onLaunch: function () {
    console.log('App Launch')
  },
  onShow: function () {
    console.log('App Show')
  },
  onHide: function () {
    console.log('App Hide')
  },
}
</script>

<style lang="scss">
/* 全局公共样式 */
page {
  background: $st-bg;
  color: $st-ink;
  font-family: 'Noto Sans SC', system-ui, sans-serif;
}
</style>
