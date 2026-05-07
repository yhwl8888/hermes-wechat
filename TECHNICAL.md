# Hermes Manager - 技术架构文档

## 1. 项目结构

```
hermes-manager/
├── app.js                    # 应用入口
├── app.json                  # 应用配置
├── app.wxss                  # 全局样式
├── project.config.json       # 项目配置
├── sitemap.json              # SEO配置
├── pages/                    # 页面目录
│   ├── index/               # 首页（对话列表）
│   ├── chat/                # 聊天详情页
│   ├── models/              # 模型管理
│   ├── modelDetail/         # 模型详情
│   ├── skills/              # 技能管理
│   ├── skillDetail/         # 技能详情
│   ├── tasks/               # 任务管理
│   ├── taskCreate/          # 创建任务
│   └── profile/             # 个人设置
├── components/              # 组件目录
│   ├── conversationItem/    # 会话列表项
│   ├── modelCard/           # 模型卡片
│   ├── skillCard/           # 技能卡片
│   ├── taskCard/            # 任务卡片
│   └── emptyState/          # 空状态组件
├── utils/                   # 工具函数
│   ├── storage.js          # 本地存储
│   ├── request.js          # 请求封装
│   ├── date.js             # 日期处理
│   └── validator.js        # 数据验证
├── services/               # 服务层
│   ├── conversationService.js
│   ├── modelService.js
│   ├── skillService.js
│   └── taskService.js
└── assets/                  # 静态资源
    ├── images/
    └── icons/
```

## 2. 技术栈

### 2.1 前端框架
- 微信小程序原生框架
- WXML + WXSS + JavaScript

### 2.2 数据存储
- 本地存储（wx.setStorage/wx.getStorage）
- 数据格式：JSON

### 2.3 UI组件
- 微信原生组件
- 自定义组件

## 3. 数据模型

### 3.1 对话（Conversation）
```javascript
{
  id: String,
  name: String,
  agentType: String,
  model: String,
  skills: Array<String>,
  messages: Array<Message>,
  createdAt: Date,
  updatedAt: Date,
  isPinned: Boolean,
  isArchived: Boolean
}
```

### 3.2 消息（Message）
```javascript
{
  id: String,
  role: 'user' | 'assistant',
  content: String,
  timestamp: Date
}
```

### 3.3 模型（Model）
```javascript
{
  id: String,
  name: String,
  provider: String,
  version: String,
  apiEndpoint: String,
  apiKey: String,
  status: 'online' | 'offline',
  defaultParams: {
    temperature: Number,
    maxTokens: Number
  }
}
```

### 3.4 技能（Skill）
```javascript
{
  id: String,
  name: String,
  description: String,
  version: String,
  category: String,
  isEnabled: Boolean,
  config: Object,
  usageCount: Number
}
```

### 3.5 定时任务（Task）
```javascript
{
  id: String,
  name: String,
  type: 'message' | 'skill' | 'report',
  cron: String,
  params: Object,
  status: 'active' | 'paused' | 'completed',
  lastRun: Date,
  nextRun: Date,
  history: Array<TaskHistory>
}
```

## 4. API设计（本地模拟）

由于是微信小程序本地应用，API将通过本地服务模拟：

### 4.1 对话服务
- `getConversations()` - 获取会话列表
- `getConversation(id)` - 获取会话详情
- `createConversation(data)` - 创建会话
- `updateConversation(id, data)` - 更新会话
- `deleteConversation(id)` - 删除会话
- `sendMessage(conversationId, content)` - 发送消息

### 4.2 模型服务
- `getModels()` - 获取模型列表
- `getModel(id)` - 获取模型详情
- `addModel(data)` - 添加模型
- `updateModel(id, data)` - 更新模型
- `testConnection(id)` - 测试连接

### 4.3 技能服务
- `getSkills()` - 获取技能列表
- `getSkill(id)` - 获取技能详情
- `toggleSkill(id, enabled)` - 切换技能状态
- `installSkill(data)` - 安装技能
- `updateSkill(id, data)` - 更新技能

### 4.4 任务服务
- `getTasks()` - 获取任务列表
- `getTask(id)` - 获取任务详情
- `createTask(data)` - 创建任务
- `updateTask(id, data)` - 更新任务
- `deleteTask(id)` - 删除任务
- `pauseTask(id)` - 暂停任务
- `resumeTask(id)` - 恢复任务

## 5. 页面路由

| 页面 | 路径 | 说明 |
|------|------|------|
| 首页 | /pages/index/index | 对话列表 |
| 聊天 | /pages/chat/chat | 聊天详情 |
| 模型列表 | /pages/models/models | 模型管理 |
| 模型详情 | /pages/modelDetail/modelDetail | 模型配置 |
| 技能列表 | /pages/skills/skills | 技能管理 |
| 技能详情 | /pages/skillDetail/skillDetail | 技能配置 |
| 任务列表 | /pages/tasks/tasks | 任务管理 |
| 创建任务 | /pages/taskCreate/taskCreate | 创建任务 |
| 个人设置 | /pages/profile/profile | 设置页面 |

## 6. 组件设计

### 6.1 基础组件
- EmptyState - 空状态提示
- Loading - 加载状态
- Toast - 轻提示

### 6.2 业务组件
- ConversationItem - 会话列表项
- MessageBubble - 消息气泡
- ModelCard - 模型卡片
- SkillCard - 技能卡片
- TaskCard - 任务卡片

## 7. 主题配置

### 7.1 颜色系统
```css
:root {
  --primary-color: #4F46E5;      /* 主色 - 靛蓝 */
  --primary-light: #818CF8;     /* 浅主色 */
  --secondary-color: #10B981;   /* 辅助色 - 翠绿 */
  --accent-color: #F59E0B;       /* 强调色 - 琥珀 */
  --background: #F9FAFB;         /* 背景色 */
  --surface: #FFFFFF;           /* 卡片背景 */
  --text-primary: #111827;       /* 主文字 */
  --text-secondary: #6B7280;    /* 次要文字 */
  --border-color: #E5E7EB;       /* 边框色 */
}
```

### 7.2 深色主题
```css
.dark {
  --background: #111827;
  --surface: #1F2937;
  --text-primary: #F9FAFB;
  --text-secondary: #9CA3AF;
  --border-color: #374151;
}
```

## 8. 状态管理

使用微信小程序原生的状态管理方案：
- `app.globalData` - 全局数据
- `this.setData()` - 页面数据更新
- `wx.setStorage` - 本地持久化

## 9. 错误处理

统一的错误处理机制：
- 网络请求错误
- 数据验证错误
- 业务逻辑错误
- 未知错误

## 10. 性能优化

- 列表虚拟滚动（长列表优化）
- 图片懒加载
- 组件按需加载
- 数据缓存策略
