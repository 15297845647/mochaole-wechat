const app = getApp();

Page({
  data: {
    mode: 'chat',
    messages: [],
    inputText: '',
    isWaiting: false,
    scrollIntoView: '',
    debateStarted: false,
    partyA: '',
    partyB: ''
  },

  onLoad(options) {
    if (options.mode === 'debate' || options.mode === 'chat') {
      this.startDebate();
    }
  },

  startDebate() {
    this.setData({
      mode: 'chat',
      messages: [
        {
          id: 1,
          sender: 'system',
          content: '欢迎来到莫吵了！请开始你们的争吵，AI判官将全程观看并在最后给出裁决。'
        }
      ],
      debateStarted: true
    });
  },

  onInput(e) {
    this.setData({ inputText: e.detail.value });
  },

  sendMessage() {
    const text = this.data.inputText.trim();
    if (!text) return;

    // 添加甲方消息
    const newMessages = [...this.data.messages, {
      id: Date.now(),
      sender: 'partyA',
      content: text
    }];

    this.setData({
      messages: newMessages,
      inputText: '',
      scrollIntoView: 'bottom'
    });

    // 模拟乙方回复
    this.setData({ isWaiting: true });

    setTimeout(() => {
      const replies = [
        '你这个人怎么这样？',
        '明明是你不对！',
        '我不同意你的观点！',
        '你有没有搞错？',
        '那又怎么样？',
        '少来这套！',
        '我不这么认为...',
        '凭什么这么说？'
      ];
      
      const reply = replies[Math.floor(Math.random() * replies.length)];
      
      const finalMessages = [...this.data.messages, {
        id: Date.now() + 1,
        sender: 'partyB',
        content: reply
      }];

      this.setData({
        messages: finalMessages,
        isWaiting: false,
        scrollIntoView: 'bottom'
      });
    }, 1000 + Math.random() * 1000);
  },

  // 提交裁决
  submitJudgment() {
    wx.showModal({
      title: '确认提交',
      content: '确定要提交裁决吗？',
      success: (res) => {
        if (res.confirm) {
          this.getJudgmentResult();
        }
      }
    });
  },

  getJudgmentResult() {
    wx.showLoading({ title: '判官裁决中...' });

    // 模拟AI判决结果
    setTimeout(() => {
      wx.hideLoading();
      
      const result = {
        winner: Math.random() > 0.5 ? 'partyA' : 'partyB',
        winnerName: Math.random() > 0.5 ? '甲方' : '乙方',
        reason: '双方都有一定的道理，但甲方在逻辑性上更胜一筹。乙方虽然情绪激动，但论点也有可取之处。建议双方冷静后再沟通。'
      };

      wx.showModal({
        title: '🧑‍⚖️ 判决结果',
        content: `胜者: ${result.winnerName}\n\n${result.reason}`,
        showCancel: false,
        success: () => {
          // 添加判决结果消息
          const finalMessages = [...this.data.messages, {
            id: Date.now() + 2,
            sender: 'system',
            content: `【判决结果】胜者: ${result.winnerName}！${result.reason}`
          }];
          
          this.setData({ messages: finalMessages });
        }
      });
    }, 2000);
  }
});
