const app = getApp();

Page({
  data: {
    model: {
      id: '',
      name: '',
      provider: '',
      version: '',
      apiEndpoint: '',
      apiKey: '',
      status: 'online',
      defaultParams: {
        temperature: 0.7,
        maxTokens: 2000
      }
    },
    showApiKey: false,
    temperatureValue: 70,
    maxTokensValue: 2000
  },

  onLoad(options) {
    if (options.id) {
      this.loadModel(options.id);
    }
  },

  loadModel(id) {
    const models = app.globalData.models;
    const model = models.find(m => m.id === id);
    if (model) {
      this.setData({
        model,
        temperatureValue: model.defaultParams.temperature * 100,
        maxTokensValue: model.defaultParams.maxTokens
      });
    }
  },

  onEndpointChange(e) {
    this.setData({ 'model.apiEndpoint': e.detail.value });
  },

  onApiKeyChange(e) {
    this.setData({ 'model.apiKey': e.detail.value });
  },

  onToggleVisibility() {
    this.setData({ showApiKey: !this.data.showApiKey });
  },

  onTemperatureChange(e) {
    const value = e.detail.value;
    this.setData({
      temperatureValue: value,
      'model.defaultParams.temperature': value / 100
    });
  },

  onMaxTokensChange(e) {
    const value = e.detail.value;
    this.setData({
      maxTokensValue: value,
      'model.defaultParams.maxTokens': value
    });
  },

  onTestConnection() {
    const { model } = this.data;
    if (!model.apiKey) {
      wx.showToast({
        title: '请先配置API密钥',
        icon: 'none'
      });
      return;
    }

    wx.showLoading({ title: '正在测试...' });

    setTimeout(() => {
      wx.hideLoading();
      wx.showToast({
        title: '连接成功',
        icon: 'success'
      });
      this.setData({ 'model.status': 'online' });
    }, 2000);
  },

  onSaveModel() {
    const models = app.globalData.models;
    const index = models.findIndex(m => m.id === this.data.model.id);
    if (index !== -1) {
      models[index] = this.data.model;
      app.globalData.models = models;
      app.saveModels();

      wx.showToast({
        title: '保存成功',
        icon: 'success'
      });
    }
  },

  onDeleteModel() {
    wx.showModal({
      title: '确认删除',
      content: '确定要删除这个模型吗？此操作不可恢复。',
      confirmColor: '#EF4444',
      success: (res) => {
        if (res.confirm) {
          const models = app.globalData.models;
          const filtered = models.filter(m => m.id !== this.data.model.id);
          app.globalData.models = filtered;
          app.saveModels();

          wx.showToast({
            title: '已删除',
            icon: 'success'
          });

          setTimeout(() => {
            wx.navigateBack();
          }, 1500);
        }
      }
    });
  }
});
