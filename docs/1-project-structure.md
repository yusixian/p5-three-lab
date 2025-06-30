# 项目结构

## 概述
基于 React TypeScript 的应用，使用 Vite 和 TanStack Router。

## 核心配置文件
- `package.json` - 依赖和脚本
- `tsconfig.json` - TypeScript 配置
- `vite.config.ts` - 构建配置
- `index.html` - 入口 HTML 文件

## 源码结构 (`src/`)

### 入口文件
- `main.tsx` - 应用入口点

### 路由 (`routes/`)
- `__root.tsx` - 根布局组件
- `index.tsx` - 首页路由

### 组件 (`lib/`)
- `components/` - 可复用 UI 组件 (theme-provider, theme-toggle)
- `layout/` - 布局组件 (header, footer)
- `pages/` - 页面特定组件
  - `home/` - 首页组件
  - `404/` - 错误页面
- `styles/globals.css` - 全局样式
- `utils/` - 工具函数和助手

## 技术栈
- **React** - UI 库
- **TypeScript** - 类型安全
- **Vite** - 构建工具
- **TanStack Router** - 类型安全路由
- **Tailwind CSS** - 样式框架

## 组织模式
- 基于功能的组件分组
- 相关组件就近放置
- 共享工具和布局
