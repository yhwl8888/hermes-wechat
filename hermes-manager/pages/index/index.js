const app = getApp();

Page({
  data: {
    conversations: [],
    filteredConversations: [],
    searchKeyword: '',
    showActionSheet: false,
    selectedConversation: null
  },

  onLoad() {
    this.loadConversations();
  },

  onShow() {
    this.loadConversations();
  },

  loadConversations() {
    const conversations = app.globalData.conversations || [];
    const sortedConversations = conversations.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return new Date(b.updatedAt) - new Date(a.updatedAt);
    });
    this.setData({
      conversations: sortedConversations,
      filteredConversations: sortedConversations
    });
  },

  onSearchInput(e) {
    const keyword = e.detail.value;
    this.setData({ searchKeyword: keyword });
    this.filterConversations(keyword);
  },

  filterConversations(keyword) {
    const conversations = this.data.conversations;
    if (!keyword) {
      this.setData({ filteredConversations: conversations });
      return;
    }
    const filtered = conversations.filter(conv => 
      conv.name.toLowerCase().includes(keyword.toLowerCase())
    );
    this.setData({ filteredConversations: filtered });
  },

  onConversationTap(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/chat/chat?id=${id}`
    });
  },

  onCreateConversation() {
    wx.navigateTo({
      url: '/pages/chat/chat?action=create'
    });
  },

  onMoreTap(e) {
    const id = e.currentTarget.dataset.id;
    const conversation = this.data.conversations.find(c => c.id === id);
    this.setData({
      showActionSheet: true,
      selectedConversation: conversation
    });
  },

  onCloseActionSheet() {
    this.setData({
      showActionSheet: false,
      selectedConversation: null
    });
  },

  onPinConversation() {
    const conversation = this.data.selectedConversation;
    if (!conversation) return;
    
    const conversations = app.globalData.conversations;
    const index = conversations.findIndex(c => c.id === conversation.id);
    if (index !== -1) {
      conversations[index].isPinned = !conversations[index].isPinned;
      app.globalData.conversations = conversations;
      app.saveConversations();
      this.loadConversations();
    }
    this.onCloseActionSheet();
  },

  onRenameConversation() {
    const conversation = this.data.selectedConversation;
    if (!conversation) return;

    wx.showModal({
      title: '重命名会话',
      editable: true,
      placeholderText: '请输入新名称',
      defaultText: conversation.name,
      success: (res) => {
        if (res.confirm && res.content) {
          const conversations = app.globalData.conversations;
          const index = conversations.findIndex(c => c.id === conversation.id);
          if (index !== -1) {
            conversations[index].name = res.content;
            conversations[index].updatedAt = new Date().toLocaleString('zh-CN');
            app.globalData.conversations = conversations;
            app.saveConversations();
            this.loadConversations();
          }
        }
      }
    });
    this.onCloseActionSheet();
  },

  onExportConversation() {
    const conversation = this.data.selectedConversation;
    if (!conversation) return;

    const exportData = {
      name: conversation.name,
      messages: conversation.messages || [],
      exportedAt: new Date().toLocaleString('zh-CN')
    };

    wx.setClipboardData({
      data: JSON.stringify(exportData, null, 2),
      success: () => {
        wx.showToast({
          title: '已复制到剪贴板',
          icon: 'success'
        });
      }
    });
    this.onCloseActionSheet();
  },

  onDeleteConversation() {
    const conversation = this.data.selectedConversation;
    if (!conversation) return;

    wx.showModal({
      title: '确认删除',
      content: `确定要删除会话"${conversation.name}"吗？此操作不可恢复。`,
      confirmColor: '#EF4444',
      success: (res) => {
        if (res.confirm) {
          const conversations = app.globalData.conversations;
          const filtered = conversations.filter(c => c.id !== conversation.id);
          app.globalData.conversations = filtered;
          app.saveConversations();
          this.loadConversations();
          wx.showToast({
            title: '已删除',
            icon: 'success'
          });
        }
      }
    });
    this.onCloseActionSheet();
  },

  onShareAppMessage() {
    return {
      title: 'Hermes Manager - 智能助手管理平台',
      path: '/pages/index/index'
    };
  }
});
