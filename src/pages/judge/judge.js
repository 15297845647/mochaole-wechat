Page({
  data: {
    messages: [],
    inputText: '',
    scrollIntoView: '',
    showEndConfirm: false,
    partyAEnded: false,
    partyBEnded: false,
    bothAgreed: false
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
        content: '欢迎来到莫吵了！双方可随时点击"我要结束"，双方都同意后将显示判官裁决。'
      }],
      showEndConfirm: true
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

  // 甲方请求结束
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
    // 模拟乙方思考后同意
    setTimeout(function() {
      var newMessages = that.data.messages.concat([{
        id: Date.now() + 1,
        sender: 'partyB',
        content: '【我同意结束】'
      }]);
      
      that.setData({
        messages: newMessages,
        partyBEnded: true,
        bothAgreed: true,
        scrollIntoView: 'bottom'
      });
      
      // 显示判决结果
      setTimeout(function() {
        that.showJudgment();
      }, 1000);
    }, 2000);
  },

  // 乙方同意结束（模拟）
  confirmEnd: function() {
    // 这个按钮主要是交互反馈，实际逻辑在 requestEnd 模拟
  },

  // 取消结束
  cancelEnd: function() {
    var messages = this.data.messages.concat([{
      id: Date.now(),
      sender: 'partyB',
      content: '【我不同意结束】'
    }]);

    this.setData({
      messages: messages,
      partyAEnded: false,
      scrollIntoView: 'bottom'
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
