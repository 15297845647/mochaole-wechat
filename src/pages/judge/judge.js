const app = getApp();

Page({
  data: {
    mode: 'select',
    partyA: '',
    partyB: '',
    judgeName: '',
    judgeAvatar: '⚖️',
    judgeBio: '',
    avatarOptions: ['⚖️', '🔥', '🕊️', '📊', '😄', '👑', '🎭', '💪'],
    pendingCount: 0,
    judgingCount: 0,
    completedCount: 0,
    inviteCode: ''
  },

  onLoad(options) {
    if (options.mode) {
      this.setData({ mode: options.mode });
    }
    
    // 如果是 dashboard 模式，加载案件统计
    if (this.data.mode === 'dashboard') {
      this.loadCaseStats();
    }
  },

  selectMode(e) {
    const mode = e.currentTarget.dataset.mode;
    this.setData({ mode: 'input' });
  },

  onInputA(e) {
    this.setData({ partyA: e.detail.value });
  },

  onInputB(e) {
    this.setData({ partyB: e.detail.value });
  },

  async submitDebate() {
    if (!this.data.partyA || !this.data.partyB) {
      wx.showToast({ title: '请输入双方观点', icon: 'none' });
      return;
    }

    wx.showLoading({ title: '判官裁决中...' });

    try {
      // 调用 AI 判决 API
      const response = await wx.request({
        url: 'http://localhost:3000/api/judge',
        method: 'POST',
        data: {
          partyA: this.data.partyA,
          partyB: this.data.partyB,
          mode: 'anonymous',
          style: 'neutral'
        }
      });

      wx.hideLoading();
      
      // 保存到历史记录
      const history = wx.getStorageSync('history') || [];
      history.unshift({
        id: Date.now(),
        date: new Date().toISOString(),
        partyA: this.data.partyA,
        partyB: this.data.partyB,
        result: response.data
      });
      wx.setStorageSync('history', history);

      wx.showModal({
        title: '判决结果',
        content: `胜者: ${response.data.winnerName}\n${response.data.subtitle}`,
        showCancel: false
      });

    } catch (err) {
      wx.hideLoading();
      console.error(err);
      wx.showToast({ title: '判决失败，使用默认结果', icon: 'none' });
      
      // 使用默认结果
      wx.showModal({
        title: '判决结果',
        content: '胜者: 甲方\n理由: 甲方逻辑更清晰',
        showCancel: false
      });
    }
  },

  onNameInput(e) {
    this.setData({ judgeName: e.detail.value });
  },

  onBioInput(e) {
    this.setData({ judgeBio: e.detail.value });
  },

  selectAvatar(e) {
    this.setData({ judgeAvatar: e.currentTarget.dataset.avatar });
  },

  registerJudge() {
    if (!this.data.judgeName) {
      wx.showToast({ title: '请输入昵称', icon: 'none' });
      return;
    }

    const judge = {
      id: Date.now().toString(),
      name: this.data.judgeName,
      avatar: this.data.judgeAvatar,
      bio: this.data.judgeBio,
      totalCases: 0,
      createdAt: new Date().toISOString()
    };

    // 保存判官
    const judges = wx.getStorageSync('judges') || [];
    judges.push(judge);
    wx.setStorageSync('judges', judges);
    
    // 设置当前判官
    app.globalData.currentJudge = judge;
    wx.setStorageSync('currentJudge', judge);

    wx.showToast({ title: '注册成功!', icon: 'success' });
    
    setTimeout(() => {
      this.setData({ mode: 'dashboard' });
      this.loadCaseStats();
    }, 1500);
  },

  loadCaseStats() {
    const cases = wx.getStorageSync('cases') || [];
    this.setData({
      pendingCount: cases.filter(c => c.status === 'pending').length,
      judgingCount: cases.filter(c => c.status === 'judging').length,
      completedCount: cases.filter(c => c.status === 'completed').length
    });
  },

  generateInvite() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    this.setData({ inviteCode: code });
  },

  copyCode() {
    wx.setClipboardData({
      data: this.data.inviteCode,
      success: () => {
        wx.showToast({ title: '已复制', icon: 'success' });
      }
    });
  }
});
