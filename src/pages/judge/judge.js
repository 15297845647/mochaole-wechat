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
    result: null,
    isWatching: false,
    selectedRecord: null,
    watchingDebates: []
  },

  onLoad: function(options) {
    this.loadCurrentJudge();
    this.loadHistory();
    this.loadWatchingDebate();
    
    // 根据参数跳转到对应页面
    if (options.mode === 'judge') {
      this.goToJudge();
    } else if (options.mode === 'history') {
      this.goToHistory();
    } else if (options.mode === 'watch') {
      this.goToWatch();
    } else {
      // 默认显示首页
      this.setData({ page: 'index' });
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

  // 查看历史记录详情
  viewRecord: function(e) {
    var id = e.currentTarget.dataset.id;
    var history = this.data.history;
    var record = history.find(function(item) {
      return item.id === id;
    });
    if (record) {
      this.setData({ selectedRecord: record });
    }
  },

  // 关闭详情
  closeRecord: function() {
    this.setData({ selectedRecord: null });
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

  goToWatch: function() {
    this.setData({ page: 'watch' });
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
    var debateId = 'debate_' + Date.now();
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
      inputText: '',
      debateId: debateId
    });
    
    // 保存到实时观看的列表
    this.saveToWatching(debateId);
  },

  saveToWatching: function(debateId) {
    var watching = wx.getStorageSync('watching_debates') || [];
    watching.push({
      id: debateId,
      date: new Date().toISOString(),
      messages: this.data.messages,
      status: 'ongoing'
    });
    wx.setStorageSync('watching_debates', watching);
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

    // 更新到实时观看
    this.updateWatching(this.data.debateId, messages);

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
      // 更新到实时观看
      that.updateWatching(that.data.debateId, newMessages);
    }, 1000 + Math.random() * 1000);
  },

  updateWatching: function(debateId, messages) {
    var watching = wx.getStorageSync('watching_debates') || [];
    watching = watching.map(function(item) {
      if (item.id === debateId) {
        item.messages = messages;
      }
      return item;
    });
    wx.setStorageSync('watching_debates', watching);
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

    this.updateWatching(this.data.debateId, messages);

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
      
      that.updateWatching(that.data.debateId, newMessages);
      
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
    
    this.updateWatching(this.data.debateId, messages);
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

      // 随机事件
      var randomEvents = [
        '突然，窗外传来一声巨响，双方都愣了一下...',
        '这时，邻居敲门来投诉，你们不得不停下来...',
        '突然手机没电了，场面一度尴尬...',
        '就在这时，群主出来了，说了一句...'
      ];
      var randomEvent = randomEvents[Math.floor(Math.random() * randomEvents.length)];

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
        highlight: winner === '甲方' ? '甲方：其实我们没必要吵' : '乙方：好吧，你说得对',
        randomEvent: randomEvent
      };

      var finalMessages = that.data.messages.concat([{
        id: Date.now() + 2,
        sender: 'system',
        content: '📢 ' + randomEvent
      }, {
        id: Date.now() + 3,
        sender: 'result',
        content: '【判决结果】胜者: ' + winner
      }]);

      that.setData({
        messages: finalMessages,
        page: 'result',
        result: result,
        scrollIntoView: 'bottom'
      });

      // 保存历史 - 完整记录
      var history = wx.getStorageSync('debate_history') || [];
      history.unshift({
        id: that.data.debateId,
        date: new Date().toISOString(),
        winner: winner,
        reason: reason,
        mode: that.data.mode,
        style: that.data.style,
        messageCount: that.data.messages.length,
        messages: that.data.messages.filter(function(m) {
          return m.sender === 'partyA' || m.sender === 'partyB';
        }),
        scores: result.scores,
        highlight: result.highlight,
        randomEvent: result.randomEvent
      });
      wx.setStorageSync('debate_history', history);
      
      // 从实时观看中移除
      that.removeFromWatching(that.data.debateId);
    }, 1500);
  },

  removeFromWatching: function(debateId) {
    var watching = wx.getStorageSync('watching_debates') || [];
    watching = watching.filter(function(item) {
      return item.id !== debateId;
    });
    wx.setStorageSync('watching_debates', watching);
  },

  // 分享
  onShareAppMessage: function() {
    return {
      title: '莫吵了 - 让你的架白吵',
      path: '/pages/index/index'
    };
  },

  shareResult: function() {
    var that = this;
    wx.showModal({
      title: '分享判决',
      content: '判决结果已生成，快分享给朋友吧！',
      confirmText: '分享',
      success: function(res) {
        if (res.confirm) {
          wx.showShareMenu({
            withShareTicket: true
          });
        }
      }
    });
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

  // 加载实时观看的辩论
  loadWatchingDebate: function() {
    var watching = wx.getStorageSync('watching_debates') || [];
    // 过滤出正在进行的
    var ongoing = watching.filter(function(item) {
      return item.status === 'ongoing';
    });
    this.setData({ watchingDebates: ongoing });
  },

  // 实时观看页面
  watchDebate: function(e) {
    var debateId = e.currentTarget.dataset.id;
    var watching = wx.getStorageSync('watching_debates') || [];
    var debate = watching.find(function(item) {
      return item.id === debateId;
    });
    
    if (debate) {
      this.setData({
        page: 'watching',
        currentWatching: debate
      });
    }
  },

  // 观看时发送建议
  sendSuggestion: function() {
    if (!this.data.suggestionText) return;
    
    var messages = this.data.currentWatching.messages.concat([{
      id: Date.now(),
      sender: 'judge',
      content: '【判官建议】' + this.data.suggestionText
    }]);
    
    this.setData({
      'currentWatching.messages': messages,
      suggestionText: ''
    });
    
    // 更新存储
    var watching = wx.getStorageSync('watching_debates') || [];
    watching = watching.map(function(item) {
      if (item.id === that.data.currentWatching.id) {
        item.messages = messages;
      }
      return item;
    });
    wx.setStorageSync('watching_debates', watching);
    
    wx.showToast({ title: '建议已发送', icon: 'success' });
  },

  // 调整判决
  adjustJudgment: function() {
    this.setData({ showAdjust: true });
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
    this.setData({ page: 'index', result: null, messages: [], selectedRecord: null });
  }
});
