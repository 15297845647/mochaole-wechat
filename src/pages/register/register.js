Page({
  data: {
    name: '',
    bio: '',
    selectedAvatar: '⚖️',
    avatars: ['⚖️', '🔥', '🕊️', '📊', '😄', '👑', '🎭', '💪']
  },

  onNameInput: function(e) {
    this.setData({ name: e.detail.value });
  },

  onBioInput: function(e) {
    this.setData({ bio: e.detail.value });
  },

  selectAvatar: function(e) {
    this.setData({ selectedAvatar: e.currentTarget.dataset.avatar });
  },

  register: function() {
    if (!this.data.name) {
      wx.showToast({ title: '请输入昵称', icon: 'none' });
      return;
    }

    var judges = wx.getStorageSync('judges') || [];
    var judge = {
      id: 'judge_' + Date.now(),
      name: this.data.name,
      avatar: this.data.selectedAvatar,
      bio: this.data.bio,
      createdAt: new Date().toISOString(),
      totalCases: 0
    };
    judges.push(judge);
    wx.setStorageSync('judges', judges);

    wx.showToast({ title: '注册成功！', icon: 'success' });

    var that = this;
    setTimeout(function() {
      wx.navigateBack();
    }, 1500);
  }
});
