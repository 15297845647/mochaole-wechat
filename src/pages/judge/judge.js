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
        content: '欢迎来到莫吵了！开始你们的争吵，AI判官将给出裁决。'
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
      var replies = ['你这个人怎么这样？', '明明是你不对！', '我不同意！', '你有没有搞错？'];
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
    }, 1500);
  }
});
