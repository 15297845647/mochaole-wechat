Page({
  startDebate: function() {
    wx.navigateTo({
      url: '/pages/judge/judge'
    });
  },

  goToJudge: function() {
    wx.navigateTo({
      url: '/pages/judge/judge?mode=judge'
    });
  },

  goToHistory: function() {
    wx.navigateTo({
      url: '/pages/judge/judge?mode=history'
    });
  }
});
