const app = getApp();

Page({
  data: {
    tasks: [],
    filteredTasks: [],
    filterType: 'all',
    activeCount: 0,
    pausedCount: 0,
    totalCount: 0
  },

  onLoad() {
    this.loadTasks();
  },

  onShow() {
    this.loadTasks();
  },

  loadTasks() {
    const tasks = app.globalData.tasks || [];
    const activeCount = tasks.filter(t => t.status === 'active').length;
    const pausedCount = tasks.filter(t => t.status === 'paused').length;
    
    this.setData({
      tasks,
      filteredTasks: tasks,
      activeCount,
      pausedCount,
      totalCount: tasks.length
    });
  },

  onFilterChange(e) {
    const type = e.currentTarget.dataset.type;
    this.setData({ filterType: type });
    this.filterTasks();
  },

  filterTasks() {
    const { tasks, filterType } = this.data;
    if (filterType === 'all') {
      this.setData({ filteredTasks: tasks });
    } else {
      const filtered = tasks.filter(t => t.status === filterType);
      this.setData({ filteredTasks: filtered });
    }
  },

  getTypeName(type) {
    const types = {
      'message': '发送消息',
      'skill': '执行技能',
      'report': '生成报告'
    };
    return types[type] || '未知';
  },

  getStatusName(status) {
    const statuses = {
      'active': '运行中',
      'paused': '已暂停',
      'completed': '已完成'
    };
    return statuses[status] || '未知';
  },

  onToggleTask(e) {
    const id = e.currentTarget.dataset.id;
    const tasks = app.globalData.tasks;
    const index = tasks.findIndex(t => t.id === id);
    if (index !== -1) {
      tasks[index].status = tasks[index].status === 'active' ? 'paused' : 'active';
      app.globalData.tasks = tasks;
      app.saveTasks();
      this.loadTasks();

      wx.showToast({
        title: tasks[index].status === 'active' ? '已恢复' : '已暂停',
        icon: 'success'
      });
    }
  },

  onViewHistory(e) {
    const id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '执行历史',
      content: '暂无执行记录',
      showCancel: false
    });
  },

  onDeleteTask(e) {
    const id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '确认删除',
      content: '确定要删除此任务吗？',
      confirmColor: '#EF4444',
      success: (res) => {
        if (res.confirm) {
          const tasks = app.globalData.tasks;
          const filtered = tasks.filter(t => t.id !== id);
          app.globalData.tasks = filtered;
          app.saveTasks();
          this.loadTasks();

          wx.showToast({
            title: '已删除',
            icon: 'success'
          });
        }
      }
    });
  },

  onCreateTask() {
    wx.navigateTo({
      url: '/pages/taskCreate/taskCreate'
    });
  }
});
