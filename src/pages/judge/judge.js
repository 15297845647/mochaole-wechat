var app = getApp();

Page({
  data: {
    page: 'index',
    mode: 'anonymous',
    style: 'neutral',
    messages: [],
    inputText: '',
    scrollIntoView: '',
    partyAEnded: false,
    partyBEnded: false,
    inviteCode: '',
    currentJudge: null,
    currentCases: [],
    history: [],
    avatars: ['⚖️', '🔥', '🕊️', '📊', '😄', '👑', '🎭', '💪'],
    selectedAvatar: '⚖️',
    result: null
  },

  onLoad: function(options) {
    this.loadCurrentJudge();
    this.loadHistory();
    
    // 根据参数跳转到对应页面
    if (options.mode === 'judge') {
      this.goToJudge();
    } else if (options.mode === 'history') {
      this.goToHistory();
    }
  },

  loadCurrentJudge: function() {
    var judge = wx.getStorageSync('current_judge');
    if (judge) {
      this.setData({ currentJudge: judge });
    }
  },

  loadHistory: function() {
    var history = wx.getStorageSync('debate_history') || [];
    history = history.map(function(item) {
      var date = new Date(item.date);
      item.date = (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes();
      return item;
    });
    this.setData({ history: history });
  },

  // 首页导航
  goToMode: function() {
    this.setData({ page: 'mode' });
  },

  goToJudge: function() {
    var judge = this.data.currentJudge;
    if (judge) {
      var cases = wx.getStorageSync('judge_cases_' + judge.id) || [];
      this.setData({ page: 'judge', currentCases: cases });
    } else {
      this.setData({ page: 'register' });
    }
  },

  goToHistory: function() {
    this.setData({ page: 'history' });
  },

  // 模式选择
  selectMode: function(e) {
    this.setData({ mode: e.currentTarget.dataset.mode });
  },

  goToStyle: function() {
    this.setData({ page: 'style' });
  },

  // 风格选择
  selectStyle: function(e) {
    this.setData({ style: e.currentTarget.dataset.style });
  },

  // 开始对喷
  startDebate: function() {
    var messages = [{
      id: 0,
      sender: 'system',
      content: '欢迎来到莫吵了！模式: ' + (this.data.mode === 'anonymous' ? '匿名' : '实名') + ' | 判官风格: ' + this.getStyleName(this.data.style)
    }];
    this.setData({
      page: 'chat',
      messages: messages,
      partyAEnded: false,
      partyBEnded: false,
      inputText: ''
    });
  },

  getStyleName: function(style) {
    var names = {
      neutral: '中立判官',
      sarcastic: '毒舌判官',
      peacemaker: '和事佬',
      rational: '理性分析帝',
      humor: '欢乐判官'
    };
    return names[style] || '中立判官';
  },

  // 聊天
  onInput: function(e) {
    this.setData({ inputText: e.detail.value });
  },

  sendMessage: function() {
    var text = this.data.inputText.trim();
    if (!text) return;

    var messages = this.data.messages.concat([{
      id: Date.now(),
      sender: 'partyA',
      content: text
    }]);

    this.setData({
      messages: messages,
      inputText: '',
      scrollIntoView: 'bottom'
    });

    var that = this;
    var replies = [
      '你这个人怎么这样？',
      '明明是你不对！',
      '我不同意你的观点！',
      '你有没有搞错？',
      '那又怎么样？',
      '少来这套！',
      '凭什么这么说？'
    ];
    var reply = replies[Math.floor(Math.random() * replies.length)];
    
    setTimeout(function() {
      var newMessages = that.data.messages.concat([{
        id: Date.now() + 1,
        sender: 'partyB',
        content: reply
      }]);
      that.setData({
        messages: newMessages,
        scrollIntoView: 'bottom'
      });
    }, 1000 + Math.random() * 1000);
  },

  // 结束
  requestEnd: function() {
    var messages = this.data.messages.concat([{
      id: Date.now(),
      sender: 'partyA',
      content: '【我提议结束这场争吵】'
    }]);

    this.setData({
      messages: messages,
      partyAEnded: true,
      scrollIntoView: 'bottom'
    });

    var that = this;
    setTimeout(function() {
      var newMessages = that.data.messages.concat([{
        id: Date.now() + 1,
        sender: 'partyB',
        content: '【我同意结束】'
      }]);
      
      that.setData({
        messages: newMessages,
        partyBEnded: true,
        scrollIntoView: 'bottom'
      });
      
      setTimeout(function() {
        that.showJudgment();
      }, 1000);
    }, 2000);
  },

  cancelEnd: function() {
    var messages = this.data.messages.concat([{
      id: Date.now(),
      sender: 'partyB',
      content: '【我不同意结束，继续吵】'
    }]);

    this.setData({
      messages: messages,
      partyAEnded: false,
      scrollIntoView: 'bottom'
    });
  },

  // 判决结果
  showJudgment: function() {
    var that = this;
    wx.showLoading({ title: '判官裁决中...' });

    setTimeout(function() {
      wx.hideLoading();
      
      var winners = ['甲方', '乙方'];
      var winner = winners[Math.floor(Math.random() * winners.length)];
      
      var styles = {
        neutral: '作为中立判官，我保持公平公正。',
        sarcastic: '哎呀，你们这样吵有意思吗？',
        peacemaker: '都别吵了，各退一步海阔天空。',
        rational: '让我们理性分析一下...',
        humor: '哈哈，你们也太搞笑了吧！'
      };
      
      var reason = styles[that.data.style] + ' ' + 
        (winner === '甲方' ? '甲方在论证逻辑上更加清晰，论据充分。' : '乙方表现更理性，分析问题更全面。');

      var result = {
        winner: winner,
        reason: reason,
        scores: [
          { label: '逻辑性', value: 70 + Math.floor(Math.random() * 30), score: 'good' },
          { label: '情感控制', value: 50 + Math.floor(Math.random() * 30), score: 'medium' },
          { label: '论据充分', value: 60 + Math.floor(Math.random() * 30), score: 'good' },
          { label: '表达清晰', value: 65 + Math.floor(Math.random() * 30), score: 'good' },
          { label: '辩论技巧', value: 55 + Math.floor(Math.random() * 30), score: 'medium' },
          { label: '双赢可能', value: 40 + Math.floor(Math.random() * 30), score: 'poor' }
        ],
        highlight: winner === '甲方' ? '甲方：其实我们没必要吵' : '乙方：好吧，你说得对'
      };

      that.setData({
        page: 'result',
        result: result
      });

      // 保存历史
      var history = wx.getStorageSync('debate_history') || [];
      history.unshift({
        id: 'debate_' + Date.now(),
        date: new Date().toISOString(),
        winner: winner,
        reason: reason
      });
      wx.setStorageSync('debate_history', history);
    }, 1500);
  },

  // 判官注册
  onNameInput: function(e) {
    this.setData({ name: e.detail.value });
  },

  onBioInput: function(e) {
    this.setData({ bio: e.detail.value });
  },

  selectAvatar: function(e) {
    this.setData({ selectedAvatar: e.currentTarget.dataset.avatar });
  },

  registerJudge: function() {
    if (!this.data.name) {
      wx.showToast({ title: '请输入昵称', icon: 'none' });
      return;
    }

    var judge = {
      id: 'judge_' + Date.now(),
      name: this.data.name,
      avatar: this.data.selectedAvatar,
      bio: this.data.bio || '专注裁决三十年',
      createdAt: new Date().toISOString(),
      totalCases: 0
    };

    wx.setStorageSync('current_judge', judge);
    
    wx.showToast({ title: '注册成功！', icon: 'success' });

    var that = this;
    setTimeout(function() {
      that.setData({
        page: 'judge',
        currentJudge: judge,
        currentCases: []
      });
    }, 1500);
  },

  // 邀请码
  generateInvite: function() {
    var chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    var code = '';
    for (var i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    this.setData({ inviteCode: code });
  },

  // 返回首页
  backToHome: function() {
    this.setData({ page: 'index', result: null, messages: [] });
  }
});
