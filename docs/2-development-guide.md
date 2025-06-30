# 开发指南 
## 常用命令
```bash
pnpm dev          # 开发服务器
pnpm build        # 构建
pnpm biome:fix    # 格式化代码
pnpm type:check   # 类型检查
pnpm test         # 测试
```

## 开发规范
- 使用函数组件 + Hooks
- TypeScript 严格模式，优先类型推断
- 用 `cn()` 合并 Tailwind 类名
- 组件必须正确类型化
- 提交信息格式：`type(scope): description` 