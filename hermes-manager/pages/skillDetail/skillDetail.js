const app = getApp();

Page({
  data: {
    skill: {
      id: '',
      name: '',
      description: '',
      version: '',
      category: '',
      isEnabled: false,
      usageCount: 0
    },
    config: {
      timeout: 30,
      retryCount: 3
    },
    logLevels: [
      { value: 'debug', label: '调试' },
      { value: 'info', label: '信息' },
      { value: 'warning', label: '警告' },
      { value: 'error', label: '错误' }
    ],
    selectedLogLevel: '信息',
    usageStats: {
      today: 0,
      week: 0,
      month: 0
    }
  },

  onLoad(options) {
    if (options.id) {
      this.loadSkill(options.id);
    }
  },

  loadSkill(id) {
    const skills = app.globalData.skills;
    const skill = skills.find(s => s.id === id);
    if (skill) {
      this.setData({
        skill,
        config: skill.config || { timeout: 30, retryCount: 3 },
        usageStats: {
          today: Math.floor(Math.random() * 10),
          week: Math.floor(Math.random() * 50),
          month: Math.floor(Math.random() * 200)
        }
      });
    }
  },

  onToggleEnabled(e) {
    const enabled = e.detail.value;
    this.setData({ 'skill.isEnabled': enabled });
  },

  onTimeoutChange(e) {
    this.setData({ 'config.timeout': e.detail.value });
  },

  onRetryChange(e) {
    this.setData({ 'config.retryCount': e.detail.value });
  },

  onLogLevelChange(e) {
    const index = e.detail.value;
    const level = this.data.logLevels[index];
    this.setData({ selectedLogLevel: level.label });
  },

  onSaveSkill() {
    const skills = app.globalData.skills;
    const index = skills.findIndex(s => s.id === this.data.skill.id);
    if (index !== -1) {
      skills[index] = {
        ...skills[index],
        isEnabled: this.data.skill.isEnabled,
        config: this.data.config
      };
      app.globalData.skills = skills;
      app.saveSkills();

      wx.showToast({
        title: '保存成功',
        icon: 'success'
      });
    }
  },

  onUninstallSkill() {
    wx.showModal({
      title: '确认卸载',
      content: '确定要卸载此技能吗？卸载后数据无法恢复。',
      confirmColor: '#EF4444',
      success: (res) => {
        if (res.confirm) {
          const skills = app.globalData.skills;
          const filtered = skills.filter(s => s.id !== this.data.skill.id);
          app.globalData.skills = filtered;
          app.saveSkills();

          wx.showToast({
            title: '已卸载',
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
