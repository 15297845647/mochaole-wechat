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
    wx.navigateTo({
      url: '/pages/judge/judge?mode=history'
    });
  },

  enterJudgeDashboard() {
    const judge = app.globalData.currentJudge;
    if (judge) {
      wx.navigateTo({
        url: '/pages/judge/judge?mode=dashboard'
      });
    } else {
      wx.navigateTo({
        url: '/pages/judge/judge?mode=register'
      });
    }
  }
});
