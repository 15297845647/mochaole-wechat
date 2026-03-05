const app = getApp();

Page({
  data: {
    
  },

  startDebate() {
    wx.navigateTo({
      url: '/pages/judge/judge?mode=debate'
    });
  },

  becomeJudge() {
    wx.navigateTo({
      url: '/pages/judge/judge?mode=register'
    });
  },

  viewHistory() {
    wx.showToast({
      title: '功能开发中',
      icon: 'none'
    });
  }
});
