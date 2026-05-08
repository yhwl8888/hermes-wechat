const app = getApp();

Page({
  data: {
    conversation: {
      id: '',
      name: '新会话',
      model: 'GPT-4',
      skills: []
    },
    messages: [],
    inputMessage: '',
    scrollTop: 0,
    isTyping: false,
    showSkillsPanel: false,
    showSettingsPanel: false,
    skills: [],
    modelOptions: [],
    selectedModelName: 'GPT-4',
    temperature: 70
  },

  onLoad(options) {
    const models = app.globalData.models || [];
    const modelOptions = models.map(m => ({ id: m.id, name: m.name }));
    this.setData({ modelOptions });

    if (options.action === 'create') {
      this.createNewConversation();
    } else if (options.id) {
      this.loadConversation(options.id);
    }

    this.loadSkills();
  },

  createNewConversation() {
    const id = 'conv_' + Date.now();
    const newConversation = {
      id,
      name: '新会话',
      model: 'GPT-4',
      skills: [],
      messages: [],
      createdAt: new Date().toLocaleString('zh-CN'),
      updatedAt: new Date().toLocaleString('zh-CN'),
      isPinned: false,
      isArchived: false,
      lastMessage: ''
    };

    const conversations = app.globalData.conversations;
    conversations.unshift(newConversation);
    app.globalData.conversations = conversations;
    app.saveConversations();

    this.setData({
      conversation: newConversation,
      messages: []
    });
  },

  loadConversation(id) {
    const conversations = app.globalData.conversations;
    const conversation = conversations.find(c => c.id === id);
    if (conversation) {
      const enabledSkills = (conversation.skills || []).filter(s => s.isEnabled);
      this.setData({
        conversation,
        messages: conversation.messages || [],
        selectedModelName: conversation.model || 'GPT-4',
        temperature: (conversation.temperature || 0.7) * 100
      });
    }
  },

  loadSkills() {
    const skills = app.globalData.skills || [];
    this.setData({ skills });
  },

  onInputChange(e) {
    this.setData({ inputMessage: e.detail.value });
  },

  onSendMessage() {
    const { inputMessage, conversation, messages } = this.data;
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: 'msg_' + Date.now(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
    };

    messages.push(userMessage);
    conversation.lastMessage = inputMessage;
    conversation.updatedAt = new Date().toLocaleString('zh-CN');
    conversation.messages = messages;

    this.setData({
      messages,
      inputMessage: '',
      scrollTop: messages.length * 1000
    });

    this.saveConversation();

    this.setData({ isTyping: true });

    setTimeout(() => {
      const assistantMessage = {
        id: 'msg_' + (Date.now() + 1),
        role: 'assistant',
        content: this.generateResponse(inputMessage),
        timestamp: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
      };

      messages.push(assistantMessage);
      conversation.messages = messages;
      conversation.lastMessage = assistantMessage.content;

      this.setData({
        messages,
        isTyping: false,
        scrollTop: messages.length * 1000
      });

      this.saveConversation();
    }, 1500);
  },

  generateResponse(input) {
    const responses = [
      `我理解你的问题："${input.slice(0, 20)}..."。让我来解答一下。`,
      `这是一个很好的问题！关于"${input.slice(0, 15)}..."，我的建议是...`,
      `收到！让我分析一下"${input.slice(0, 18)}..."相关的内容。`,
      `好的，我正在处理你的请求。关于"${input.slice(0, 16)}..."，以下是一些信息...`
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  },

  saveConversation() {
    const conversations = app.globalData.conversations;
    const index = conversations.findIndex(c => c.id === this.data.conversation.id);
    if (index !== -1) {
      conversations[index] = this.data.conversation;
      app.globalData.conversations = conversations;
      app.saveConversations();
    }
  },

  onToggleSkills() {
    this.setData({ showSkillsPanel: !this.data.showSkillsPanel });
  },

  onToggleSkill(e) {
    const id = e.currentTarget.dataset.id;
    const skills = this.data.skills;
    const index = skills.findIndex(s => s.id === id);
    if (index !== -1) {
      skills[index].isEnabled = !skills[index].isEnabled;
      this.setData({ skills });

      const conversationSkills = skills.filter(s => s.isEnabled).map(s => ({
        id: s.id,
        name: s.name,
        isEnabled: true
      }));
      this.setData({ 'conversation.skills': conversationSkills });
      this.saveConversation();
    }
  },

  onOpenSettings() {
    this.setData({ showSettingsPanel: true });
  },

  onCloseSettings() {
    this.setData({ showSettingsPanel: false });
  },

  onNameChange(e) {
    this.setData({ 'conversation.name': e.detail.value });
  },

  onModelChange(e) {
    const index = e.detail.value;
    const model = this.data.modelOptions[index];
    this.setData({
      'conversation.model': model.name,
      selectedModelName: model.name
    });
  },

  onTemperatureChange(e) {
    this.setData({ temperature: e.detail.value });
  },

  onSaveSettings() {
    this.setData({ 'conversation.temperature': this.data.temperature / 100 });
    this.saveConversation();
    this.setData({ showSettingsPanel: false });
    wx.showToast({
      title: '设置已保存',
      icon: 'success'
    });
  },

  onBack() {
    wx.navigateBack();
  },

  onScrollUpper() {
    console.log('滚动到顶部');
  }
});
