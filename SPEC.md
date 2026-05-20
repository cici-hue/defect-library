---
AIGC:
    ContentProducer: Minimax Agent AI
    ContentPropagator: Minimax Agent AI
    Label: AIGC
    ProduceID: "00000000000000000000000000000000"
    PropagateID: "00000000000000000000000000000000"
    ReservedCode1: 3045022100ff016df45d358e907e91e043af67fb0b13ed4a8993b7f4bc4bf614f4faa32ba0022002a55f25f9bd7745ec5b5397227a7674e2a629565724e9560d98fb5fb82bbdc8
    ReservedCode2: 3046022100828957c2e696c75ec835993424d2d87cdc6830b0dbe588d054f7c6ce597efa3e022100eaeddf68377e9771e3cf28c85869a7686139734bddec074ad3bb4a3c25055e54
---

# Material Library System Specification

## 1. Concept & Vision

Material Library 是一个专业的面料/材料管理系统，参考 Otto International Claim Management System 的设计风格，为纺织行业提供线上填报、智能检索和分类管理的一站式解决方案。系统采用深蓝色企业级侧边栏搭配清爽的白灰主界面，强调专业、高效和数据可视化。

## 2. Design Language

### Aesthetic Direction
企业级管理系统风格，参考 Claim Manager v8 的设计语言：
- 严谨专业的视觉呈现
- 卡片式模块化布局
- 高对比度信息层级

### Color Palette
```
Primary:      #1a3a5c (深蓝 - 侧边栏背景)
Primary Dark: #0f2540 (深蓝 - 侧边栏悬停)
Primary Light:#2c5f8a (浅蓝 - 次要元素)
Accent:       #3b82f6 (蓝色 - 主操作按钮)
Success:      #22c55e (绿色 - 成功状态)
Warning:      #f59e0b (橙色 - 警告状态)
Danger:       #ef4444 (红色 - 危险/删除)
Info:         #0891b2 (青色 - 信息提示)
Background:   #f0f4f8 (浅灰 - 页面背景)
Card:         #ffffff (白色 - 卡片背景)
Text:         #0f172a (深色 - 主文字)
Text Secondary: #64748b (灰色 - 次要文字)
Border:       #e2e8f0 (边框色)
```

### Typography
- Font Family: Inter, system-ui, sans-serif
- Headings: 700 weight, 深蓝色
- Body: 400-500 weight
- Labels: 0.75rem uppercase, 灰色

### Spatial System
- Sidebar Width: 272px
- Card Border Radius: 12px
- Card Shadow: 0 2px 8px rgba(15,23,42,0.08)
- Section Padding: 24px
- Grid Gap: 16px-24px

### Motion Philosophy
- Sidebar collapse: 300ms ease
- Page transitions: 200ms fade
- Hover effects: 150ms all
- Loading skeleton: 1.5s shimmer

## 3. Layout & Structure

### Overall Layout
```
┌─────────────────────────────────────────────────────┐
│ ┌──────────┬────────────────────────────────────┐ │
│ │          │  Header (Title + User Info + Actions) │ │
│ │ Sidebar  ├────────────────────────────────────┤ │
│ │          │                                    │ │
│ │ - Logo   │   Main Content Area                │ │
│ │ - Nav    │   (Cards, Forms, Tables)           │ │
│ │ - User   │                                    │ │
│ │          │                                    │ │
│ └──────────┴────────────────────────────────────┘ │
└─────────────────────────────────────────────────────┘
```

### Sidebar Navigation
1. Dashboard & AI (仪表盘与AI)
2. Material Library (材料库)
3. Create Material (新建材料)
4. Supplier Management (供应商管理)
5. Categories (分类管理)
6. Audit Logs (审计日志)
7. Settings (系统设置)

### Page Structure
- Header: 页面标题 + 操作按钮
- Content: 白色卡片容器包裹内容
- Section: 分组表单，每组有蓝色标题

## 4. Features & Interactions

### Dashboard & AI
- 统计卡片：材料总数、分类统计、待审核、最近更新
- AI 智能搜索栏：自然语言输入，实时搜索建议
- 快速操作入口
- 数据可视化图表

### Material Library
- 列表视图/卡片视图切换
- 高级筛选器：材质类型、颜色、克重、价格
- 关键词搜索
- 分页控制
- 批量操作

### Create Material Form
**Section 1: 基础信息**
- 材料编号 (自动生成)
- 材料名称* (必填)
- 材质类型* (下拉)
- 供应商* (下拉搜索)
- 产地

**Section 2: 规格参数**
- 克重 (GSM)
- 幅宽
- 成分比例
- 颜色
- 纱线规格

**Section 3: 业务信息**
- 单价
- 最小起订量
- 交货周期
- 库存状态

**Section 4: 文档管理**
- 图片上传 (多张)
- 技术文档 (PDF)
- 备注

### Supplier Management
- 供应商列表
- 新增/编辑供应商
- 关联材料查看
- 联系信息管理

### Interactions
- 按钮悬停：scale(1.02) + shadow
- 输入框聚焦：蓝色边框 + 浅蓝背景
- 表格行悬停：背景色加深
- 删除确认：模态对话框
- 表单验证：实时校验 + 红色提示

## 5. Component Inventory

### Sidebar
- Logo + 系统名称
- 导航菜单项 (图标 + 文字)
- 当前选中高亮
- 折叠按钮
- 用户信息区域

### Header
- 页面标题
- 快捷操作按钮
- 用户头像 + 名称
- 通知图标
- 退出按钮

### Card
- 白色背景
- 圆角边框
- 标题栏 (蓝色加粗)
- 内容区
- 响应式列数

### Form Elements
- Input: 标签在上，输入框在下，聚焦高亮
- Select: 带搜索的下拉
- DatePicker: 日历选择器
- FileUpload: 拖拽上传区
- Checkbox: 左侧标签
- Radio: 选项组

### Table
- 紧凑行高 (padding: 5px 8px)
- 表头灰色背景
- 斑马条纹可选
- 悬停高亮
- 操作按钮组

### Buttons
- Primary (蓝): Save, 提交
- Danger (红): Delete, Clear
- Secondary (灰): Cancel
- Ghost: 图标按钮

### Search & Filter
- SearchBar: 搜索图标 + 输入框
- FilterPanel: 可折叠筛选项
- TagInput: 多选标签

## 6. Technical Approach

### Frontend
- React 18 + TypeScript
- Vite 构建
- TailwindCSS 样式
- React Router 路由
- Lucide React 图标
- Recharts 图表

### Data Management
- React Context 全局状态
- LocalStorage 本地持久化
- Mock Data 演示数据

### Pages
1. `/` - Dashboard
2. `/library` - Material Library
3. `/material/:id` - Material Detail
4. `/create` - Create Material
5. `/edit/:id` - Edit Material
6. `/suppliers` - Supplier Management
7. `/categories` - Categories
8. `/logs` - Audit Logs
9. `/settings` - Settings