# 快速开始指南 / Quick Start Guide

## 🚀 启动应用 / Start the Application

### 1. 安装依赖 / Install Dependencies

```bash
pnpm install
```

### 2. 启动开发服务器 / Start Development Server

```bash
pnpm run dev
```

应用将在 http://localhost:5173 启动 (如果该端口被占用,将自动使用下一个可用端口)

The app will start at http://localhost:5173 (if port is in use, it will automatically use the next available port)

### 3. 构建生产版本 / Build for Production

```bash
pnpm run build
```

### 4. 预览生产版本 / Preview Production Build

```bash
pnpm run preview
```

## 🌐 多语言功能 / Multi-language Feature

### 切换语言 / Switch Language

1. **在页面右上角找到语言切换按钮**
   - Look for the language switcher button in the top-right corner

2. **点击按钮切换语言**
   - Click the button to switch languages
   - 英文显示 "中文" 按钮 / English shows "中文" button
   - 中文显示 "English" 按钮 / Chinese shows "English" button

3. **语言设置自动保存**
   - Your language preference is automatically saved
   - 下次访问时自动加载 / Automatically loaded on next visit

### 支持的语言 / Supported Languages

- 🇺🇸 **English** (默认 / Default)
- 🇨🇳 **中文简体** (Simplified Chinese)

## 📝 主要功能 / Main Features

### 1. 签证设置 / Visa Setup

- 输入签证开始日期 / Enter visa start date
- 选择有效期 / Select validity period
  - 18个月 / 18 months
  - 3年 / 3 years
  - 5年 / 5 years
  - 10年 / 10 years
  - 自定义 / Custom

### 2. 行程管理 / Trip Management

- ➕ 添加行程 / Add trips
- ✏️ 编辑行程 / Edit trips
- 🗑️ 删除行程 / Delete trips
- 📊 自动验证 Condition 8558 合规性 / Auto-validate Condition 8558 compliance

### 3. 统计信息 / Statistics

- 📅 签证有效期 / Visa validity period
- 🔢 已规划行程数 / Number of planned trips
- 📈 总在澳天数 / Total days in Australia
- ⚠️ 违规天数警告 / Violation days warning

### 4. 可视化日历 / Visual Calendar

- 📆 月度视图 / Monthly view
- 🎨 颜色编码的日期状态 / Color-coded date status
  - 🟢 可入境 / Can enter
  - 🔴 窗口已满 / Window full
  - 🟡 合规停留 / Valid stay
  - ⚠️ 违规停留 / Violation stay
- 💡 点击日期查看详细信息 / Click dates for detailed information

### 5. 智能计算 / Smart Calculations

- 🔍 18个月滑动窗口分析 / 18-month sliding window analysis
- 📊 实时合规性检查 / Real-time compliance check
- 🎯 最大可停留天数计算 / Maximum stay calculation
- 📅 下一个可入境日期建议 / Next valid entry date suggestion

## 🧪 测试 / Testing

### 运行测试 / Run Tests

```bash
# 运行所有测试 / Run all tests
pnpm test:run

# 运行测试并查看覆盖率 / Run with coverage
pnpm test:coverage

# 交互式测试界面 / Interactive test UI
pnpm test:ui
```

### 代码质量检查 / Code Quality

```bash
# ESLint 检查 / ESLint check
pnpm run lint

# 自动修复 / Auto-fix issues
pnpm run lint:fix

# Prettier 格式化 / Prettier format
pnpm run format

# 检查格式 / Check format
pnpm run format:check
```

## 📂 项目结构 / Project Structure

```
src/
├── components/           # React 组件 / Components
│   ├── Calendar/        # 日历相关 / Calendar-related
│   ├── LanguageSwitcher.tsx  # 语言切换 / Language switcher
│   ├── VisaSetup.tsx    # 签证设置 / Visa setup
│   ├── TripManager.tsx  # 行程管理 / Trip manager
│   └── StatsPanel.tsx   # 统计面板 / Stats panel
├── i18n/                # 国际化 / Internationalization
│   ├── config.ts        # i18n 配置 / config
│   └── locales/         # 翻译文件 / Translations
│       ├── en.json      # 英语 / English
│       └── zh.json      # 中文 / Chinese
├── hooks/               # 自定义钩子 / Custom hooks
├── utils/               # 工具函数 / Utilities
├── types/               # 类型定义 / Type definitions
└── styles/              # 样式文件 / Styles
```

## 🎯 使用建议 / Usage Tips

1. **首次使用** / First Time Use
   - 先设置签证有效期 / Set visa validity period first
   - 从签证开始日期开始规划 / Plan from visa start date

2. **添加行程** / Add Trips
   - 可以使用日历选择日期 / Use calendar to select dates
   - 点击"最大"按钮获取最大可停留天数 / Click "Max" for maximum stay

3. **查看窗口使用情况** / View Window Usage
   - 点击日历上的任意日期 / Click any date on calendar
   - 查看该日期的18个月窗口详情 / View 18-month window details

4. **避免违规** / Avoid Violations
   - 注意红色警告 / Watch for red warnings
   - 使用统计面板监控总天数 / Monitor total days in stats panel

## ❓ 常见问题 / FAQ

### Q: 如何清除所有数据? / How to clear all data?

A: 在签证设置部分点击"清除所有数据"按钮

Click "Clear All Data" button in visa setup section

### Q: 数据保存在哪里? / Where is data saved?

A: 数据保存在浏览器的 localStorage 中,不会上传到服务器

Data is saved in browser's localStorage, not uploaded to server

### Q: 可以添加多少个行程? / How many trips can I add?

A: 没有限制,但需确保符合 Condition 8558 规定

No limit, but must comply with Condition 8558 rules

### Q: 如何导出数据? / How to export data?

A: 目前版本不支持导出功能,数据仅保存在本地浏览器

Current version doesn't support export, data is local only

## 📞 获取帮助 / Get Help

- 📖 查看 [README.md](./README.md) 了解更多技术细节
- 🌐 查看 [I18N.md](./I18N.md) 了解多语言功能
- 📋 查看 [CHANGELOG.md](./CHANGELOG.md) 了解更新历史
- 📝 查看 [I18N_IMPLEMENTATION_SUMMARY.md](./I18N_IMPLEMENTATION_SUMMARY.md) 了解实施细节

## 🎉 开始使用吧! / Let's Get Started!

```bash
pnpm install
pnpm run dev
```

然后在浏览器中打开 http://localhost:5173

Then open http://localhost:5173 in your browser

**祝您使用愉快! / Enjoy using the app! 🚀**

