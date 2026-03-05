Page({
  startDebate: function() {
    wx.navigateTo({
      url: '/pages/judge/judge?mode=debate'
    });
  },

  becomeJudge: function() {
    wx.showToast({
      title: '功能开发中',
      icon: 'none'
    });
  },

  viewHistory: function() {
    wx.showToast({
      title: '功能开发中',
      icon: 'none'
    });
  }
});
