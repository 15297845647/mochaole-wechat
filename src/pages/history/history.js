Page({
  data: {
    history: []
  },

  onShow: function() {
    this.loadHistory();
  },

  loadHistory: function() {
    var history = wx.getStorageSync('debate_history') || [];
    // 格式化日期
    history = history.map(function(item) {
      var date = new Date(item.date);
      item.date = date.getFullYear() + '-' + 
        (date.getMonth() + 1).toString().padStart(2, '0') + '-' + 
        date.getDate().toString().padStart(2, '0') + ' ' + 
        date.getHours().toString().padStart(2, '0') + ':' + 
        date.getMinutes().toString().padStart(2, '0');
      return item;
    });
    this.setData({ history: history });
  }
});
