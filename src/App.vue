<script>
export default {
    created () {
      wx.showShareMenu({withShareTicket: true})
    // 调用API从本地缓存中获取数据
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    console.log('app created and cache list by setStorageSync')
  }
}
</script>

<style lang="scss">
@import "global";
</style>
