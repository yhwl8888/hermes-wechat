const app = getApp();

Page({
  data: {
    skills: [],
    filteredSkills: [],
    searchKeyword: '',
    category: 'all',
    enabledCount: 0,
    totalCount: 0
  },

  onLoad() {
    this.loadSkills();
  },

  onShow() {
    this.loadSkills();
  },

  loadSkills() {
    const skills = app.globalData.skills || [];
    const enabledCount = skills.filter(s => s.isEnabled).length;
    this.setData({
      skills,
      filteredSkills: skills,
      enabledCount,
      totalCount: skills.length
    });
  },

  onSearchInput(e) {
    const keyword = e.detail.value;
    this.setData({ searchKeyword: keyword });
    this.filterSkills();
  },

  onCategoryChange(e) {
    const category = e.currentTarget.dataset.category;
    this.setData({ category });
    this.filterSkills();
  },

  filterSkills() {
    const { skills, searchKeyword, category } = this.data;
    let filtered = skills;

    if (category !== 'all') {
      filtered = filtered.filter(s => s.category === category);
    }

    if (searchKeyword) {
      filtered = filtered.filter(s => 
        s.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        s.description.toLowerCase().includes(searchKeyword.toLowerCase())
      );
    }

    this.setData({ filteredSkills: filtered });
  },

  onSkillToggle(e) {
    const id = e.currentTarget.dataset.id;
    const enabled = e.detail.value;
    
    const skills = app.globalData.skills;
    const index = skills.findIndex(s => s.id === id);
    if (index !== -1) {
      skills[index].isEnabled = enabled;
      app.globalData.skills = skills;
      app.saveSkills();
      this.loadSkills();
    }
  },

  onSkillTap(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/skillDetail/skillDetail?id=${id}`
    });
  }
});
