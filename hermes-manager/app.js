App({
  globalData: {
    userInfo: null,
    theme: 'light',
    conversations: [],
    models: [],
    skills: [],
    tasks: []
  },

  onLaunch() {
    this.loadData();
    this.initTheme();
  },

  loadData() {
    const conversations = wx.getStorageSync('conversations') || [];
    const models = wx.getStorageSync('models') || this.getDefaultModels();
    const skills = wx.getStorageSync('skills') || this.getDefaultSkills();
    const tasks = wx.getStorageSync('tasks') || [];

    this.globalData.conversations = conversations;
    this.globalData.models = models;
    this.globalData.skills = skills;
    this.globalData.tasks = tasks;

    if (conversations.length === 0) {
      wx.setStorageSync('conversations', []);
    }
    if (models.length === 0) {
      wx.setStorageSync('models', this.getDefaultModels());
    }
    if (skills.length === 0) {
      wx.setStorageSync('skills', this.getDefaultSkills());
    }
  },

  initTheme() {
    const theme = wx.getStorageSync('theme') || 'light';
    this.globalData.theme = theme;
  },

  getDefaultModels() {
    return [
      {
        id: 'gpt-4',
        name: 'GPT-4',
        provider: 'OpenAI',
        version: '4.0',
        apiEndpoint: 'https://api.openai.com/v1/chat/completions',
        apiKey: '',
        status: 'online',
        defaultParams: {
          temperature: 0.7,
          maxTokens: 2000
        }
      },
      {
        id: 'gpt-3.5-turbo',
        name: 'GPT-3.5 Turbo',
        provider: 'OpenAI',
        version: '3.5',
        apiEndpoint: 'https://api.openai.com/v1/chat/completions',
        apiKey: '',
        status: 'online',
        defaultParams: {
          temperature: 0.7,
          maxTokens: 2000
        }
      },
      {
        id: 'claude-3',
        name: 'Claude 3',
        provider: 'Anthropic',
        version: '3.0',
        apiEndpoint: 'https://api.anthropic.com/v1/messages',
        apiKey: '',
        status: 'online',
        defaultParams: {
          temperature: 0.7,
          maxTokens: 2000
        }
      }
    ];
  },

  getDefaultSkills() {
    return [
      {
        id: 'web-search',
        name: '网页搜索',
        description: '搜索互联网获取最新信息',
        version: '1.0.0',
        category: '工具',
        isEnabled: true,
        config: {},
        usageCount: 0
      },
      {
        id: 'code-interpreter',
        name: '代码解释器',
        description: '编写和调试代码',
        version: '1.2.0',
        category: '开发',
        isEnabled: true,
        config: {},
        usageCount: 0
      },
      {
        id: 'data-analysis',
        name: '数据分析',
        description: '分析和可视化数据',
        version: '1.0.0',
        category: '分析',
        isEnabled: false,
        config: {},
        usageCount: 0
      },
      {
        id: 'image-generator',
        name: '图像生成',
        description: '使用AI生成图像',
        version: '2.0.0',
        category: '创意',
        isEnabled: false,
        config: {},
        usageCount: 0
      }
    ];
  },

  saveConversations() {
    wx.setStorageSync('conversations', this.globalData.conversations);
  },

  saveModels() {
    wx.setStorageSync('models', this.globalData.models);
  },

  saveSkills() {
    wx.setStorageSync('skills', this.globalData.skills);
  },

  saveTasks() {
    wx.setStorageSync('tasks', this.globalData.tasks);
  }
})
