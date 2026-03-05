Page({
  startDebate: function() {
    wx.navigateTo({
      url: '/pages/judge/judge?mode=debate'
    });
  },

  goToMode: function() {
    wx.navigateTo({
      url: '/pages/judge/judge?mode=mode'
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
  },

  goToWatch: function() {
    wx.navigateTo({
      url: '/pages/judge/judge?mode=watch'
    });
  }
});
