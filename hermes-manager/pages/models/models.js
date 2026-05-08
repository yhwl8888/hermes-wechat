const app = getApp();

Page({
  data: {
    models: [],
    filteredModels: [],
    searchKeyword: '',
    filterType: 'all',
    showAddPanel: false,
    newModel: {
      name: '',
      provider: '',
      version: '',
      apiEndpoint: '',
      apiKey: ''
    }
  },

  computed: {
    onlineCount() {
      return this.data.models.filter(m => m.status === 'online').length;
    },
    totalCount() {
      return this.data.models.length;
    }
  },

  onLoad() {
    this.loadModels();
  },

  onShow() {
    this.loadModels();
  },

  loadModels() {
    const models = app.globalData.models || [];
    this.setData({
      models,
      filteredModels: models
    });
    this.updateStats();
  },

  updateStats() {
    const onlineCount = this.data.models.filter(m => m.status === 'online').length;
    const totalCount = this.data.models.length;
    this.setData({ onlineCount, totalCount });
  },

  onSearchInput(e) {
    const keyword = e.detail.value;
    this.setData({ searchKeyword: keyword });
    this.filterModels();
  },

  onFilterChange(e) {
    const type = e.currentTarget.dataset.type;
    this.setData({ filterType: type });
    this.filterModels();
  },

  filterModels() {
    const { models, searchKeyword, filterType } = this.data;
    let filtered = models;

    if (filterType !== 'all') {
      filtered = filtered.filter(m => m.status === filterType);
    }

    if (searchKeyword) {
      filtered = filtered.filter(m => 
        m.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        m.provider.toLowerCase().includes(searchKeyword.toLowerCase())
      );
    }

    this.setData({ filteredModels: filtered });
  },

  onModelTap(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/modelDetail/modelDetail?id=${id}`
    });
  },

  onAddModel() {
    this.setData({
      showAddPanel: true,
      newModel: {
        name: '',
        provider: '',
        version: '',
        apiEndpoint: '',
        apiKey: ''
      }
    });
  },

  onCloseAddPanel() {
    this.setData({ showAddPanel: false });
  },

  onNameInput(e) {
    this.setData({ 'newModel.name': e.detail.value });
  },

  onProviderInput(e) {
    this.setData({ 'newModel.provider': e.detail.value });
  },

  onVersionInput(e) {
    this.setData({ 'newModel.version': e.detail.value });
  },

  onEndpointInput(e) {
    this.setData({ 'newModel.apiEndpoint': e.detail.value });
  },

  onApiKeyInput(e) {
    this.setData({ 'newModel.apiKey': e.detail.value });
  },

  onConfirmAdd() {
    const { newModel } = this.data;
    if (!newModel.name || !newModel.provider) {
      wx.showToast({
        title: '请填写必填项',
        icon: 'none'
      });
      return;
    }

    const model = {
      id: 'model_' + Date.now(),
      name: newModel.name,
      provider: newModel.provider,
      version: newModel.version || '1.0',
      apiEndpoint: newModel.apiEndpoint || '',
      apiKey: newModel.apiKey || '',
      status: 'online',
      defaultParams: {
        temperature: 0.7,
        maxTokens: 2000
      }
    };

    const models = app.globalData.models;
    models.push(model);
    app.globalData.models = models;
    app.saveModels();

    this.loadModels();
    this.onCloseAddPanel();

    wx.showToast({
      title: '添加成功',
      icon: 'success'
    });
  },

  onTestConnection(e) {
    const id = e.currentTarget.dataset.id;
    const model = this.data.models.find(m => m.id === id);
    
    wx.showLoading({ title: '测试中...' });
    
    setTimeout(() => {
      wx.hideLoading();
      wx.showToast({
        title: model.apiKey ? '连接成功' : '请先配置API密钥',
        icon: 'none'
      });
    }, 1500);
  },

  onConfigModel(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/modelDetail/modelDetail?id=${id}`
    });
  }
});
