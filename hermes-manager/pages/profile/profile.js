const app = getApp();

Page({
  data: {
    themeText: '浅色模式',
    notifications: {
      message: true,
      task: true,
      sound: false
    },
    cacheSize: '2.5 MB'
  },

  onLoad() {
    const theme = app.globalData.theme;
    this.setData({
      themeText: theme === 'dark' ? '深色模式' : '浅色模式'
    });
  },

  onThemeChange() {
    wx.showActionSheet({
      itemList: ['浅色模式', '深色模式'],
      success: (res) => {
        const theme = res.tapIndex === 0 ? 'light' : 'dark';
        app.globalData.theme = theme;
        wx.setStorageSync('theme', theme);
        this.setData({
          themeText: res.tapIndex === 0 ? '浅色模式' : '深色模式'
        });
        wx.showToast({
          title: '主题已切换',
          icon: 'success'
        });
      }
    });
  },

  onNotificationChange(e) {
    const type = e.currentTarget.dataset.type;
    const checked = e.detail.value;
    this.setData({
      [`notifications.${type}`]: checked
    });
    wx.showToast({
      title: '设置已更新',
      icon: 'success'
    });
  },

  onBackup() {
    wx.showLoading({ title: '备份中...' });
    
    const data = {
      conversations: app.globalData.conversations,
      models: app.globalData.models,
      skills: app.globalData.skills,
      tasks: app.globalData.tasks
    };

    setTimeout(() => {
      wx.hideLoading();
      wx.setClipboardData({
        data: JSON.stringify(data, null, 2),
        success: () => {
          wx.showToast({
            title: '已复制到剪贴板',
            icon: 'success'
          });
        }
      });
    }, 1500);
  },

  onRestore() {
    wx.showModal({
      title: '恢复数据',
      content: '请将备份数据粘贴到下方',
      editable: true,
      placeholderText: '粘贴JSON数据...',
      success: (res) => {
        if (res.confirm && res.content) {
          try {
            const data = JSON.parse(res.content);
            if (data.conversations) {
              app.globalData.conversations = data.conversations;
              app.saveConversations();
            }
            if (data.models) {
              app.globalData.models = data.models;
              app.saveModels();
            }
            if (data.skills) {
              app.globalData.skills = data.skills;
              app.saveSkills();
            }
            if (data.tasks) {
              app.globalData.tasks = data.tasks;
              app.saveTasks();
            }
            wx.showToast({
              title: '恢复成功',
              icon: 'success'
            });
          } catch (e) {
            wx.showToast({
              title: '数据格式错误',
              icon: 'none'
            });
          }
        }
      }
    });
  },

  onClearCache() {
    wx.showModal({
      title: '清理缓存',
      content: '确定要清理所有缓存数据吗？',
      confirmColor: '#EF4444',
      success: (res) => {
        if (res.confirm) {
          wx.showLoading({ title: '清理中...' });
          setTimeout(() => {
            wx.hideLoading();
            this.setData({ cacheSize: '0 KB' });
            wx.showToast({
              title: '清理完成',
              icon: 'success'
            });
          }, 1500);
        }
      }
    });
  },

  onCheckUpdate() {
    wx.showToast({
      title: '已是最新版本',
      icon: 'success'
    });
  },

  onViewHelp() {
    wx.showModal({
      title: '帮助与反馈',
      content: 'Hermes Manager v1.0.0\n\n如有问题，请联系开发者。',
      showCancel: false
    });
  },

  onLogout() {
    wx.showModal({
      title: '退出登录',
      content: '确定要退出登录吗？',
      confirmColor: '#EF4444',
      success: (res) => {
        if (res.confirm) {
          wx.showToast({
            title: '已退出',
            icon: 'success'
          });
        }
      }
    });
  }
});
