const app = getApp();

Page({
  data: {
    task: {
      name: '',
      type: 'message',
      cron: '0 8 * * *',
      params: {},
      notifyBefore: false,
      status: 'active'
    },
    taskTypes: [
      { value: 'message', label: '发送消息' },
      { value: 'skill', label: '执行技能' },
      { value: 'report', label: '生成报告' }
    ],
    selectedType: { value: 'message', label: '发送消息' },
    cycleTypes: [
      { value: 'daily', label: '每天' },
      { value: 'weekdays', label: '工作日' },
      { value: 'weekly', label: '每周' },
      { value: 'monthly', label: '每月' }
    ],
    selectedCycle: { value: 'daily', label: '每天' },
    executeTime: '08:00',
    cronExpression: '0 8 * * *',
    skills: [],
    selectedSkillName: '请选择技能',
    reportTypes: [
      { value: 'daily', label: '日报' },
      { value: 'weekly', label: '周报' },
      { value: 'monthly', label: '月报' }
    ],
    selectedReportType: { value: 'daily', label: '日报' },
    notifyTimes: [5, 10, 15, 30, 60],
    notifyBeforeMinutes: 15
  },

  onLoad() {
    const skills = app.globalData.skills.filter(s => s.isEnabled);
    this.setData({ skills });
  },

  onNameInput(e) {
    this.setData({ 'task.name': e.detail.value });
  },

  onTypeChange(e) {
    const index = e.detail.value;
    const type = this.data.taskTypes[index];
    this.setData({
      'task.type': type.value,
      selectedType: type
    });
  },

  onCycleChange(e) {
    const index = e.detail.value;
    const cycle = this.data.cycleTypes[index];
    this.setData({ selectedCycle: cycle });
    this.updateCron();
  },

  onTimeChange(e) {
    const time = e.detail.value;
    const [hour, minute] = time.split(':');
    this.setData({ executeTime: time });
    this.updateCron();
  },

  updateCron() {
    const { executeTime, selectedCycle } = this.data;
    const [hour, minute] = executeTime.split(':');
    
    let cron = '';
    switch (selectedCycle.value) {
      case 'daily':
        cron = `${minute} ${hour} * * *`;
        break;
      case 'weekdays':
        cron = `${minute} ${hour} * * 1-5`;
        break;
      case 'weekly':
        cron = `${minute} ${hour} * * 1`;
        break;
      case 'monthly':
        cron = `${minute} ${hour} 1 * *`;
        break;
      default:
        cron = `${minute} ${hour} * * *`;
    }
    
    this.setData({
      cronExpression: cron,
      'task.cron': cron
    });
  },

  onMessageInput(e) {
    this.setData({ 'task.params.message': e.detail.value });
  },

  onSkillSelect(e) {
    const index = e.detail.value;
    const skill = this.data.skills[index];
    if (skill) {
      this.setData({
        'task.params.skillId': skill.id,
        selectedSkillName: skill.name
      });
    }
  },

  onReportTypeChange(e) {
    const index = e.detail.value;
    const reportType = this.data.reportTypes[index];
    this.setData({
      'task.params.reportType': reportType.value,
      selectedReportType: reportType
    });
  },

  onNotifyChange(e) {
    this.setData({ 'task.notifyBefore': e.detail.value });
  },

  onNotifyTimeChange(e) {
    const index = e.detail.value;
    this.setData({ notifyBeforeMinutes: this.data.notifyTimes[index] });
  },

  onCreateTask() {
    const { task } = this.data;
    
    if (!task.name) {
      wx.showToast({
        title: '请输入任务名称',
        icon: 'none'
      });
      return;
    }

    const newTask = {
      id: 'task_' + Date.now(),
      name: task.name,
      type: task.type,
      cron: task.cron,
      params: task.params,
      status: 'active',
      notifyBefore: task.notifyBefore,
      notifyBeforeMinutes: this.data.notifyBeforeMinutes,
      lastRun: null,
      nextRun: this.calculateNextRun(),
      history: []
    };

    const tasks = app.globalData.tasks;
    tasks.push(newTask);
    app.globalData.tasks = tasks;
    app.saveTasks();

    wx.showToast({
      title: '创建成功',
      icon: 'success'
    });

    setTimeout(() => {
      wx.navigateBack();
    }, 1500);
  },

  calculateNextRun() {
    const now = new Date();
    const [hour, minute] = this.data.executeTime.split(':');
    const next = new Date();
    next.setHours(parseInt(hour), parseInt(minute), 0, 0);
    
    if (next <= now) {
      next.setDate(next.getDate() + 1);
    }
    
    return next.toLocaleString('zh-CN');
  }
});
