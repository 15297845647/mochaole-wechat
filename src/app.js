App({
  onLaunch() {
    // 检查是否有判官登录
    const judge = wx.getStorageSync('currentJudge');
    if (judge) {
      this.globalData.currentJudge = judge;
    }
  },
  globalData: {
    currentJudge: null,
    history: [],
    cases: []
  }
})
