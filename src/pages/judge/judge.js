Page({
  data: {
    messages: [],
    inputText: '',
    scrollIntoView: ''
  },

  onLoad: function(options) {
    if (options.mode === 'debate') {
      this.startDebate();
    }
  },

  startDebate: function() {
    this.setData({
      messages: [{
        id: 0,
        sender: 'system',
        content: '欢迎来到莫吵了！开始你们的争吵，点击下方按钮结束并获取判官裁决。'
      }]
    });
  },

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
    setTimeout(function() {
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

  endDebate: function() {
    var that = this;
    wx.showModal({
      title: '确认结束',
      content: '确定要结束争吵并获取判官裁决吗？',
      success: function(res) {
        if (res.confirm) {
          that.showJudgment();
        }
      }
    });
  },

  showJudgment: function() {
    wx.showLoading({ title: '判官裁决中...' });

    var that = this;
    setTimeout(function() {
      wx.hideLoading();
      
      var winners = ['甲方', '乙方'];
      var winner = winners[Math.floor(Math.random() * winners.length)];
      
      var reasons = [
        '甲方在论证逻辑上更加清晰，论据充分。乙方虽然情绪激烈，但缺乏有效论据。',
        '乙方表现更理性，分析问题更全面。甲方有些偏激，需要冷静。',
        '双方都有道理，但甲方表达更有条理。乙方情绪过于激动，影响了判断。'
      ];
      var reason = reasons[Math.floor(Math.random() * reasons.length)];

      var newMessages = that.data.messages.concat([{
        id: Date.now() + 2,
        sender: 'result',
        winner: '👑 胜者: ' + winner,
        reason: reason
      }]);

      that.setData({
        messages: newMessages,
        scrollIntoView: 'bottom'
      });
    }, 1500);
  }
});
